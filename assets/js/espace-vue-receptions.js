/* Les réceptions dans l'espace restaurateur (v7.12.0) : les écrans. Les règles sont dans espace-receptions.js
   (fonctions pures) ; ce fichier dessine et écoute, avec les outils de espace.js.

   - Le SUIVI (rubrique Demandes, filtre « Réceptions ») : les dossiers rangés par phase, une recherche, des filtres.
   - Le DOSSIER : un seul écran par réception, ouvert depuis Demandes, Aujourd'hui, l'Agenda ou la fiche client.
     Trois états dits séparément en tête (avancement, espaces, préparation), puis six onglets : Projet, Proposition,
     Espaces et option, Client, Jour J, Historique.
   - Les DOCUMENTS : l'aperçu de la proposition tel que le client la voit, et la fiche du jour J ; tous deux imprimables.
   Tout est relu depuis le dossier. Rien n'est envoyé, signé ni encaissé : les écrans le disent. */
import { PHASES, HORAIRES, TYPES_CHANGEMENT, FILTRES_SUIVI, euros, instantDit, dossierDe, dossierDeDemande, dossierDepuisDemande, actionsClient, nomsEspaces, capaciteEspace, chronologie, completerHoraires, echeanceParDefaut,
  etatRetenue, etapeDe, accordDe, couranteDe, brouillonDe, versionsDe, totalLigne, totalProposition, attentesClient, prochaineAction, conflits, replacement, argsRetenue, consequences, suivi, fichePreparation, tachesHabituelles, lienReception } from './espace-receptions.js?v=7';
import { appliquerUnParUn, phraseBilan, ETATS_REPLI } from './espace-repli.js?v=7';
import { tachesLiees } from './espace-taches.js?v=7';
import { nomPlace } from './espace-salle.js?v=7';
import { fmt, maj, heure, pluriel, typo } from './espace-regles.js?v=7';

const ONGLETS = [['projet', 'Projet'], ['proposition', 'Proposition'], ['espaces', 'Espaces et option'], ['client', 'Client'], ['jourj', 'Jour J'], ['historique', 'Historique']];
const PASTILLE = { 'a-qualifier': 'a-confirmer', demande: 'a-confirmer', qualifie: 'cours', brouillon: 'cours', presentee: 'cours', accord: 'a-confirmer', confirmee: 'confirmee', terminee: 'arrivee', 'sans-suite': 'refusee' };
const PASTILLE_RET = { aucune: 'r-non-tentee', option: 'a-confirmer', expiree: 'refusee', ferme: 'confirmee', liberee: 'r-non-tentee' };
const jour = (iso) => (iso ? fmt(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '');

export function creerReceptions(X) {
  const { root, $, $$, e, S, A, D, ctx, etat, agir } = X;
  const R = (etat.rec ||= { onglet: 'projet', filtre: 'tous', recherche: '', form: null, pour: '', bilan: null, liberer: false, sansSuite: false, changement: '' });
  const lieux = () => D.receptions, maintenant = () => ctx().maintenant.slice(0, 16), venues = () => X.venues();
  const taches = (id) => tachesLiees(S(), 'reception', id);
  const dossier = () => dossierDe(S(), etat.dossier);
  /* Le dossier ouvert et son onglet sont gardés pour cet onglet du navigateur : recharger la page y revient. */
  const garder = () => { try { if (etat.dossier) sessionStorage.setItem('jh-espace-dossier', JSON.stringify({ id: etat.dossier, onglet: R.onglet })); else sessionStorage.removeItem('jh-espace-dossier'); } catch { /* rien */ } };
  try { const g = JSON.parse(sessionStorage.getItem('jh-espace-dossier') || 'null'); if (g?.id && ctx().exemples !== false && dossierDe(S(), g.id)) { etat.dossier = g.id; R.onglet = ONGLETS.some(([k]) => k === g.onglet) ? g.onglet : 'projet'; etat.filtreDemandes = 'reception'; } } catch { /* rien */ }
  const refaire = () => { const a = document.activeElement, id = a?.id, deb = a?.selectionStart; X.rendre(); if (id) { const b = document.getElementById(id); if (b) { b.focus({ preventScroll: true }); try { if (deb != null && b.setSelectionRange) b.setSelectionRange(deb, deb); } catch { /* champ sans sélection */ } } } };
  const champ = (label, id, corps, aide = '', classe = '') => `<p class="esp-champ${classe ? ` ${classe}` : ''}"><label for="${id}">${label}${aide ? ` <small>${aide}</small>` : ''}</label>${corps}</p>`;
  const texte = (id, cle, v, o = {}) => `<input id="${id}" type="${o.type || 'text'}" data-rec="${cle}" value="${e(v ?? '')}"${o.placeholder ? ` placeholder="${e(o.placeholder)}"` : ''}${o.min != null ? ` min="${o.min}"` : ''}${o.inputmode ? ` inputmode="${o.inputmode}"` : ''} autocomplete="off">`;
  const zone = (id, cle, v, placeholder = '', lignes = 3) => `<textarea id="${id}" rows="${lignes}" data-rec="${cle}" placeholder="${e(placeholder)}">${e(v ?? '')}</textarea>`;
  const source = (d) => (d.source === 'demo' || d.exemple ? '<span class="esp-source">Exemple</span>' : '');

  /* ---------- Le suivi ---------- */
  function phasesHtml() {
    const s = suivi(ctx(), S(), X.demandes(), { filtre: R.filtre, recherche: R.recherche, tachesDe: taches });
    const carte = (c) => `<li class="esp-rec-carte${c.attention ? ' a-une-attention' : ''}" data-rec-carte="${e(c.id || c.demande)}">
      <button type="button" class="esp-rec-carte__tete" ${c.id ? `data-rec-ouvrir="${e(c.id)}"` : `data-rec-creer="${e(c.demande)}"`}><span class="esp-rec-carte__nom">${e(c.client)} ${source(c)}</span><span class="esp-rec-carte__occasion">${e(maj(c.occasion.replace(/^une? /i, '')))}</span></button>
      <dl class="esp-rec-carte__faits"><div><dt>Date</dt><dd>${e(maj(c.quand))}</dd></div><div><dt>Invités</dt><dd>${e(c.invites)}</dd></div><div><dt>Espaces</dt><dd>${e(c.espaces)}</dd></div></dl>
      <p class="esp-rec-carte__etats"><span class="esp-pastille esp-pastille--${PASTILLE[c.etape.id] || 'cours'}">${e(c.etape.libelle)}</span>${c.retenue.etat !== 'aucune' ? ` <span class="esp-pastille esp-pastille--${PASTILLE_RET[c.retenue.etat]}">${e(c.retenue.libelle)}${c.echeance ? ` jusqu'au ${e(fmt(c.echeance.slice(0, 10), { day: 'numeric', month: 'long' }))}` : ''}</span>` : ''}</p>
      ${c.prochaine.texte ? `<p class="esp-rec-carte__action"><b>À faire&nbsp;:</b> ${e(c.prochaine.texte)}${c.prochaine.echeance ? ` <span>(pour le ${e(fmt(c.prochaine.echeance.slice(0, 10), { day: 'numeric', month: 'long' }))})</span>` : ''}</p>` : ''}
      ${c.attention ? `<p class="esp-rec-carte__attention"><span aria-hidden="true">!</span> ${e(c.attention)}</p>` : ''}
      ${c.id ? '' : `<p class="esp-rec-carte__creer"><button type="button" class="esp-bouton esp-bouton--ok" data-rec-creer="${e(c.demande)}">Créer le dossier</button></p>`}</li>`;
    return { html: typo(s.phases.map((p) => `<section class="esp-rec-phase" aria-labelledby="rec-ph-${p.id}"><h3 class="esp-rec-phase__titre" id="rec-ph-${p.id}">${e(p.nom)} <span class="esp-rec-phase__n">${p.cartes.length}</span></h3>
      ${p.cartes.length ? `<ul class="esp-rec-cartes">${p.cartes.map(carte).join('')}</ul>` : '<p class="esp-rec-vide">Aucun dossier à cette phase.</p>'}</section>`).join('')),
      compte: s.total ? (s.trouves === s.total ? pluriel(s.total, 'dossier') : `${s.trouves} sur ${pluriel(s.total, 'dossier')}`) : 'Aucun dossier pour le moment' };
  }
  /** Le suivi des réceptions, placé dans la rubrique Demandes (filtre « Réceptions »). */
  function suiviHtml() {
    if (ctx().exemples === false) return typo('<p class="esp-vide"><span><b>Les dossiers de réception ne sont pas partagés.</b> Sur ce site d\'essai connecté, ils restent masqués : une option posée ici ne serait visible que sur cet appareil, et ne doit pas être prise pour une réservation d\'espace partagée. Ils se présentent dans l\'espace de démonstration.</span></p>');
    const p = phasesHtml();
    return typo(`<div class="esp-rec-suivi" data-rec-suivi>
      <div class="esp-rec-outils">${champ('Retrouver un dossier', 'rec-recherche', `<input id="rec-recherche" type="search" data-rec-recherche value="${e(R.recherche)}" placeholder="Un client, une occasion, une date, un espace" autocomplete="off">`)}
        <div class="esp-filtres" role="group" aria-label="Filtrer les dossiers">${FILTRES_SUIVI.map(([id, nom]) => `<button type="button" class="esp-filtre" data-rec-filtre="${id}" aria-pressed="${id === R.filtre}">${nom}</button>`).join('')}</div></div>
      <p class="esp-aide" role="status" data-rec-compte>${e(p.compte)}</p>
      <div class="esp-rec-phases" data-rec-phases>${p.html}</div>
      <p class="esp-aide">Une demande, une visite ou une proposition ne retiennent rien. Seules une option encore valable et une réception confirmée occupent des espaces, de la préparation à la remise en état.</p></div>`);
  }
  /** Le bouton d'une demande de réception : ouvrir son dossier, ou le créer. */
  const boutonDemande = (dem) => { if (ctx().exemples === false || dem.genre !== 'reception') return ''; const d = dossierDeDemande(S(), dem.id);
    return d ? `<button type="button" class="esp-bouton" data-rec-ouvrir="${e(d.id)}">Ouvrir le dossier</button>` : `<button type="button" class="esp-bouton" data-rec-creer="${e(dem.id)}">Créer le dossier</button>`; };

  /* ---------- Le dossier ---------- */
  function entete(d) {
    const v = actionsClient(venues(), d.id), et = etapeDe(d, v, maintenant()), ret = etatRetenue(d, maintenant()), pa = prochaineAction(d, v, { maintenant: maintenant(), auj: A.iso, taches: taches(d.id) }), f = fichePreparation(ctx(), d, v, taches(d.id)), tt = taches(d.id);
    return `<p class="esp-rec-retour"><button type="button" class="esp-lien" data-rec-retour><span aria-hidden="true">←</span> Tous les dossiers</button></p>
      <header class="esp-rec-tete"><h3 class="esp-rec-tete__titre" id="rec-titre" tabindex="-1">${e(d.projet?.intitule || 'Réception')} ${source(d)}</h3>
        <p class="esp-rec-tete__sous">${e(d.client?.nom || '')}${d.jour ? ` · ${e(maj(jour(d.jour)))}` : d.souhait?.date ? ` · ${e(maj(jour(d.souhait.date)))} (date souhaitée)` : ''}</p></header>
      <ul class="esp-rec-etats" aria-label="Où en est ce dossier">
        <li><span class="esp-rec-etats__quoi">Avancement</span><b class="esp-pastille esp-pastille--${PASTILLE[et.id] || 'cours'}" data-rec-etape="${et.id}">${e(et.libelle)}</b></li>
        <li><span class="esp-rec-etats__quoi">Espaces</span><b class="esp-pastille esp-pastille--${PASTILLE_RET[ret.etat]}" data-rec-retenue="${ret.etat}">${e(ret.libelle)}</b><span class="esp-rec-etats__detail">${e(ret.etat === 'option' ? `jusqu'au ${instantDit(ret.echeance)}` : ret.etat === 'aucune' ? 'rien n\'est bloqué' : ret.etat === 'ferme' ? nomsEspaces(lieux(), d.retenue.espaces).join(', ') : ret.etat === 'expiree' ? `depuis le ${instantDit(ret.echeance)}` : '')}</span></li>
        <li><span class="esp-rec-etats__quoi">Préparation</span><b class="esp-pastille esp-pastille--${tt.length && tt.every((t) => t.fait) && !f.manques ? 'confirmee' : 'r-non-tentee'}">${tt.length ? `${tt.filter((t) => t.fait).length} tâche${tt.filter((t) => t.fait).length > 1 ? 's' : ''} sur ${tt.length}` : 'Pas encore de tâche'}</b><span class="esp-rec-etats__detail">${f.manques ? `${pluriel(f.manques, 'information')} à renseigner` : 'fiche complète'}</span></li></ul>
      ${pa.texte ? `<p class="esp-rec-suite${pa.retard ? ' est-en-retard' : ''}" data-rec-suite><b>Prochaine action&nbsp;:</b> ${e(pa.texte)}${pa.echeance ? ` <span>(pour le ${e(fmt(pa.echeance.slice(0, 10), { day: 'numeric', month: 'long' }))})</span>` : ''}</p>` : ''}
      ${d.aRevoir ? `<p class="esp-rec-alerte">${e(d.aRevoir)}</p>` : ''}
      ${d.cloture?.etat === 'sans-suite' ? `<p class="esp-rec-alerte">Dossier classé sans suite le ${e(fmt(d.cloture.le.slice(0, 10), { day: 'numeric', month: 'long' }))} : ${e(d.cloture.raison)}. <button type="button" class="esp-lien" data-rec-rouvrir>Rouvrir le dossier</button></p>` : ''}
      <div class="esp-onglets" role="tablist" aria-label="Les parties du dossier">${ONGLETS.map(([id, nom]) => { const n = id === 'client' ? attentesClient(d, v).questions.length + attentesClient(d, v).changements.length : 0;
        return `<button type="button" class="esp-onglet" role="tab" id="rec-onglet-${id}" aria-selected="${id === R.onglet}" aria-controls="rec-panneau" tabindex="${id === R.onglet ? 0 : -1}" data-rec-onglet="${id}">${nom}${n ? ` <span class="esp-filtre__n" aria-label="${n} à traiter">${n}</span>` : ''}</button>`; }).join('')}</div>`;
  }

  function ongletProjet(d) {
    const p = d.projet || {}, c = d.client || {}, s = d.suivi || {}, vi = d.visite || {};
    return `<div class="esp-rec-grille">
      <article class="esp-carte" aria-labelledby="rec-pr-t"><h4 id="rec-pr-t">Le projet</h4>
        ${champ('Occasion', 'rec-occasion', texte('rec-occasion', 'projet.occasion', p.occasion))}${champ('Intitulé du dossier', 'rec-intitule', texte('rec-intitule', 'projet.intitule', p.intitule))}
        ${champ('Ce que le client attend', 'rec-attentes', zone('rec-attentes', 'projet.attentes', p.attentes, 'Ambiance, déroulé, souhaits particuliers…'))}
        <div class="esp-rec-duo">${champ('Invités annoncés', 'rec-annonces', texte('rec-annonces', 'projet.invitesAnnonces', p.invitesAnnonces || '', { type: 'number', min: 0, inputmode: 'numeric' }))}${champ('Invités confirmés', 'rec-confirmes', texte('rec-confirmes', 'projet.invitesConfirmes', p.invitesConfirmes || '', { type: 'number', min: 0, inputmode: 'numeric' }), 'quand le client l\'a confirmé')}</div>
        ${champ('Besoins ou contraintes déclarés', 'rec-contraintes', zone('rec-contraintes', 'projet.contraintes', p.contraintes, 'Allergies, accès, enfants, matériel…', 2))}
        <p class="esp-rec-case"><label><input type="checkbox" data-rec-qualifie${d.qualifie ? ' checked' : ''}> Projet qualifié : la date, l'effectif et les espaces sont assez clairs pour préparer une proposition</label></p></article>
      <article class="esp-carte" aria-labelledby="rec-pe-t"><h4 id="rec-pe-t">Les personnes</h4>
        ${champ('Client principal', 'rec-client', texte('rec-client', 'client.nom', c.nom))}
        <div class="esp-rec-duo">${champ('Téléphone', 'rec-tel', texte('rec-tel', 'client.telephone', c.telephone, { type: 'tel' }))}${champ('Adresse électronique', 'rec-mail', texte('rec-mail', 'client.email', c.email, { type: 'email' }))}</div>
        ${(d.contacts || []).length ? `<ul class="esp-rec-contacts">${d.contacts.map((x) => `<li><span><b>${e(x.nom)}</b>${x.role ? ` · ${e(x.role)}` : ''}${x.telephone ? ` · ${e(x.telephone)}` : ''}${x.email ? ` · ${e(x.email)}` : ''}</span><button type="button" class="esp-lien" data-rec-contact-retirer="${e(x.id)}" aria-label="Retirer ${e(x.nom)}">Retirer</button></li>`).join('')}</ul>` : ''}
        <form class="esp-rec-ajout" data-rec-contact><p class="esp-champ__titre">Ajouter un interlocuteur</p><div class="esp-rec-duo">${champ('Nom', 'rec-ct-nom', '<input id="rec-ct-nom" name="nom" autocomplete="off" required>')}${champ('Rôle', 'rec-ct-role', '<input id="rec-ct-role" name="role" placeholder="Témoin, traiteur, parent…" autocomplete="off">')}</div>
          ${champ('Téléphone ou adresse', 'rec-ct-tel', '<input id="rec-ct-tel" name="telephone" autocomplete="off">')}<p><button type="submit" class="esp-bouton">Ajouter</button></p></form>
        ${champ('Suivi côté restaurant', 'rec-resp', texte('rec-resp', 'responsable', d.responsable, { placeholder: 'Qui suit ce dossier' }))}
        ${d.demande ? `<p class="esp-plus"><button type="button" class="esp-lien" data-voir-demande="${e(d.demande)}">Voir la demande d'origine</button> · <button type="button" class="esp-lien" data-rec-client aria-haspopup="dialog">Fiche du client</button></p>` : ''}</article>
      <article class="esp-carte" aria-labelledby="rec-da-t"><h4 id="rec-da-t">Le souhait et la visite</h4>
        <div class="esp-rec-duo">${champ('Date souhaitée', 'rec-souhait', texte('rec-souhait', 'souhait.date', d.souhait?.date, { type: 'date' }))}${champ('Ou une période', 'rec-periode', texte('rec-periode', 'souhait.periode', d.souhait?.periode, { placeholder: 'Printemps 2027' }))}</div>
        <p class="esp-aide">La date retenue, les horaires et les espaces se décident dans l'onglet « Espaces et option ».</p>
        <div class="esp-rec-duo">${champ('Visite : le jour', 'rec-visite', `<input id="rec-visite" type="date" data-rec-visite="date" value="${e(vi.date || '')}">`, 'facultative')}${champ('Visite : l\'heure', 'rec-visite-h', `<input id="rec-visite-h" type="time" data-rec-visite="heure" value="${e(vi.heure || '')}">`)}</div>
        ${vi.date ? `<p class="esp-rec-case"><label><input type="checkbox" data-rec-visite="faite"${vi.faite ? ' checked' : ''}> La visite a eu lieu</label></p>` : ''}</article>
      <article class="esp-carte" aria-labelledby="rec-su-t"><h4 id="rec-su-t">Le suivi</h4>
        <div class="esp-rec-duo">${champ('Prochaine action', 'rec-proch', texte('rec-proch', 'suivi.prochaine', s.prochaine, { placeholder: 'Laissée vide : elle se déduit du dossier' }))}${champ('Pour le', 'rec-proch-d', texte('rec-proch-d', 'suivi.echeance', s.echeance, { type: 'date' }))}</div>
        ${champ('Notes internes', 'rec-notes', zone('rec-notes', 'suivi.notes', s.notes, 'Budget évoqué, personnes à ménager…'), 'jamais montrées au client')}
        ${champ('Informations partageables', 'rec-partage', zone('rec-partage', 'suivi.partage', s.partage, 'Parking, accès, hébergements proches…', 2), 'visibles sur la page du client')}
        ${d.cloture ? '' : R.sansSuite ? `<form class="esp-rec-ajout" data-rec-sans-suite>${champ('Pourquoi ce dossier est-il sans suite ?', 'rec-raison', '<input id="rec-raison" name="raison" required autocomplete="off" placeholder="Autre lieu choisi, date reportée…">')}<p><button type="submit" class="esp-bouton esp-bouton--non">Classer sans suite</button> <button type="button" class="esp-bouton esp-bouton--discret" data-rec-sans-suite-non>Annuler</button></p></form>` : '<p class="esp-plus"><button type="button" class="esp-lien" data-rec-sans-suite-ouvrir>Classer ce dossier sans suite</button></p>'}</article></div>`;
  }

  const catalogue = () => [...(lieux().lignes || []).map((l) => ({ ...l, groupe: 'Prestations d\'exemple' })), ...(D.produits || []).map((p, i) => ({ id: `traiteur-${i}`, libelle: p.nom, description: 'Carte traiteur du site.', unite: p.unite === 'kg' ? 'le kilo' : 'pièce', pu: +p.prix || 0, groupe: 'Carte traiteur (prix du site)' }))];
  function ongletProposition(d) {
    const v = actionsClient(venues(), d.id), b = brouillonDe(d), c = couranteDe(d), accord = accordDe(d, v), versions = versionsDe(d), cat = catalogue(), groupes = [...new Set(cat.map((x) => x.groupe))];
    const ligne = (l, i) => `<tr data-rec-ligne="${e(l.id)}"><td><label class="visuellement-cache" for="pl-lib-${i}">Prestation ${i + 1}</label><input id="pl-lib-${i}" data-pl="libelle" value="${e(l.libelle)}"><label class="visuellement-cache" for="pl-des-${i}">Description de la prestation ${i + 1}</label><input id="pl-des-${i}" class="esp-rec-ligne__desc" data-pl="description" value="${e(l.description)}" placeholder="Description (facultative)">${l.exemple ? '<span class="esp-source">Montant d\'exemple</span>' : ''}</td>
      <td><label class="visuellement-cache" for="pl-qte-${i}">Quantité, prestation ${i + 1}</label><input id="pl-qte-${i}" type="number" min="0" step="any" inputmode="decimal" data-pl="qte" value="${e(l.qte)}"><span class="esp-rec-ligne__unite">${e(l.unite || '')}</span></td>
      <td><label class="visuellement-cache" for="pl-pu-${i}">Prix unitaire en euros, prestation ${i + 1}</label><input id="pl-pu-${i}" type="number" min="0" step="any" inputmode="decimal" data-pl="pu" value="${e(l.pu)}"></td>
      <td class="esp-rec-ligne__total">${e(euros(totalLigne(l)))}</td><td><button type="button" class="esp-rond" data-rec-ligne-retirer="${e(l.id)}" aria-label="Retirer ${e(l.libelle || `la prestation ${i + 1}`)}">×</button></td></tr>`;
    const editeur = !b ? '' : `<article class="esp-carte esp-rec-prop" aria-labelledby="rec-br-t" data-rec-brouillon="${b.v}"><h4 id="rec-br-t">Version ${b.v} <span class="esp-pastille esp-pastille--cours">Brouillon</span></h4>
        <p class="esp-aide">Un brouillon se modifie librement. Une fois présenté au client, il devient un instantané : le modifier créera une nouvelle version.</p>
        ${champ('Titre', 'pr-titre', `<input id="pr-titre" data-pr="titre" value="${e(b.titre)}">`)}${champ('Présentation', 'pr-pres', `<textarea id="pr-pres" rows="3" data-pr="presentation" placeholder="Quelques lignes pour le client.">${e(b.presentation)}</textarea>`)}
        <div class="esp-rec-table"><table><caption class="visuellement-cache">Les prestations de la proposition</caption><thead><tr><th scope="col">Prestation</th><th scope="col">Quantité</th><th scope="col">Prix unitaire</th><th scope="col">Total</th><th scope="col"><span class="visuellement-cache">Retirer</span></th></tr></thead>
          <tbody>${b.lignes.map(ligne).join('') || '<tr><td colspan="5" class="esp-rec-vide">Aucune prestation pour le moment.</td></tr>'}</tbody>
          <tfoot><tr><th scope="row" colspan="3">Total</th><td class="esp-rec-ligne__total" data-rec-total>${e(euros(totalProposition(b)))}</td><td></td></tr></tfoot></table></div>
        <div class="esp-rec-ajout esp-rec-ajout--ligne">${champ('Ajouter une prestation', 'pr-cat', `<select id="pr-cat" data-rec-catalogue><option value="">Choisir…</option>${groupes.map((g) => `<optgroup label="${e(g)}">${cat.filter((x) => x.groupe === g).map((x) => `<option value="${e(x.id)}">${e(x.libelle)} · ${e(euros(x.pu))}${x.unite ? ` ${e(x.unite)}` : ''}</option>`).join('')}</optgroup>`).join('')}</select>`)}
          <p><button type="button" class="esp-bouton" data-rec-ligne-ajouter>Ajouter</button> <button type="button" class="esp-bouton esp-bouton--discret" data-rec-ligne-libre>Ligne personnalisée</button></p></div>
        <p class="esp-rec-convention"><span class="esp-source">À savoir</span> Les montants sont ceux que vous saisissez : le total est la somme des lignes (quantité × prix unitaire). Aucune taxe, aucun acompte et aucune remise ne sont calculés. Prix TTC ou HT : à renseigner dans les conditions.</p>
        <div class="esp-rec-duo">${champ('Ce qui est compris', 'pr-compris', `<textarea id="pr-compris" rows="3" data-pr="compris" placeholder="Un élément par ligne.">${e(b.compris)}</textarea>`)}${champ('Ce qui reste à préciser', 'pr-apreciser', `<textarea id="pr-apreciser" rows="3" data-pr="aPreciser" placeholder="Un élément par ligne.">${e(b.aPreciser)}</textarea>`)}</div>
        <div class="esp-rec-duo">${champ('Proposition valable jusqu\'au', 'pr-validite', `<input id="pr-validite" type="date" data-pr="validite" value="${e(b.validite)}">`, 'validité commerciale, distincte de l\'option')}${champ('Conditions', 'pr-conditions', `<textarea id="pr-conditions" rows="3" data-pr="conditions" placeholder="À renseigner : acompte, annulation, prix TTC ou HT…">${e(b.conditions)}</textarea>`)}</div>
        <p class="esp-rec-actions"><button type="button" class="esp-bouton esp-bouton--ok" data-rec-presenter>Présenter au client</button> <button type="button" class="esp-bouton" data-rec-apercu="${b.v}" aria-haspopup="dialog">Aperçu client</button> <button type="button" class="esp-bouton esp-bouton--discret" data-rec-abandonner>Abandonner ce brouillon</button></p>
        <p class="esp-aide">« Présenter » ne déclenche aucun envoi : la proposition devient visible sur la page du client.</p></article>`;
    const fige = (p) => `<li class="esp-rec-version${p.v === d.courante ? ' est-courante' : ''}" data-rec-version="${p.v}"><span><b>Version ${p.v}</b> · ${e(p.titre)} · ${e(euros(totalProposition(p)))}${p.v === d.courante ? ' <span class="esp-pastille esp-pastille--confirmee">Version courante</span>' : ' <span class="esp-pastille esp-pastille--r-non-tentee">Ancienne version</span>'}<br><small>Présentée le ${e(instantDit(p.presenteeLe))}${accord && accord.version === p.v ? ` · Accord du client — simulation (${accord.par === 'client' ? 'donné sur sa page' : 'noté par l\'équipe'})` : ''}</small></span>
      <button type="button" class="esp-bouton" data-rec-apercu="${p.v}" aria-haspopup="dialog">Voir et imprimer</button></li>`;
    return `${!b && !c ? `<article class="esp-carte"><h4>Aucune proposition pour le moment</h4><p class="esp-aide">Préparez-la ici : prestations, quantités, prix, ce qui est compris. Une proposition ne retient aucun espace.</p><p><button type="button" class="esp-bouton esp-bouton--ok" data-rec-proposition-creer>Préparer une proposition</button></p></article>` : ''}
      ${editeur}
      ${versions.some((p) => p.etat === 'presentee') ? `<article class="esp-carte" aria-labelledby="rec-ve-t"><h4 id="rec-ve-t">Les versions présentées</h4><ul class="esp-rec-versions">${versions.filter((p) => p.etat === 'presentee').reverse().map(fige).join('')}</ul>
        <p class="esp-rec-actions">${b ? '' : '<button type="button" class="esp-bouton" data-rec-nouvelle-version>Préparer une nouvelle version</button> '}${c && !accord ? '<button type="button" class="esp-bouton esp-bouton--discret" data-rec-accord-equipe>Noter un accord reçu autrement (simulation)</button>' : ''}</p>
        <p class="esp-aide">Une version présentée ne change plus, même si une offre du catalogue est modifiée ensuite. L'accord du client porte sur une version précise ; il ne confirme pas la réception : c'est l'équipe qui confirme, dans « Espaces et option ».</p></article>` : ''}`;
  }

  /* Le formulaire « Espaces et option » : une saisie de travail, gardée tant qu'elle n'est pas enregistrée (un refus ne l'efface pas). */
  function saisie(d) {
    if (!R.form || R.pour !== d.id) { R.pour = d.id; R.bilan = null;
      R.form = { jour: d.jour || d.souhait?.date || '', horaires: { ...(d.horaires || {}) }, espaces: [...(d.espaces?.retenus?.length ? d.espaces.retenus : d.espaces?.envisages || [])], echeance: etatRetenue(d, maintenant()).etat === 'option' ? d.retenue.echeance : '' }; }
    return R.form;
  }
  const invitesDe = (d) => d.projet?.invitesConfirmes || d.projet?.invitesAnnonces || 0;
  function ongletEspaces(d) {
    const f = saisie(d), v = actionsClient(venues(), d.id), ret = etatRetenue(d, maintenant()), h = completerHoraires(f.horaires, lieux().durees), ch = chronologie(f.jour, h);
    const c = conflits(ctx(), S(), D.salle, d, { jour: f.jour, horaires: h, espaces: f.espaces, invites: invitesDe(d) }), rep = c.resas.length ? replacement(ctx(), S(), D.salle, d, { jour: f.jour, horaires: h, espaces: f.espaces, invites: invitesDe(d) }) : null;
    const echeance = f.echeance || (f.jour ? echeanceParDefaut(maintenant(), f.jour, lieux().durees) : ''), actif = ['option', 'ferme'].includes(ret.etat), accord = accordDe(d, v), ferme = ret.etat === 'ferme';
    const esp = (x) => { const cap = capaciteEspace(x, D.salle), saison = x.mois ? 'de juin à septembre' : 'toute l\'année';
      return `<li><label><input type="checkbox" data-rec-form="espace" value="${e(x.id)}"${f.espaces.includes(x.id) ? ' checked' : ''}> <span><b>${e(x.nom)}</b><small>${cap ? `${cap} places${x.source === 'site' ? '' : ' sur le plan de démonstration'}` : 'Capacité à renseigner'} · ${saison}${x.partie ? ' · une partie de la salle du restaurant' : ''}${(x.tables || []).length ? ` · ${x.tables.length > 1 ? `tables ${x.tables.join(', ')}` : `table ${x.tables[0]}`}` : ''}</small></span></label></li>`; };
    const verif = !f.jour && !f.espaces.length ? '<p class="esp-aide">Choisissez une date, des horaires et un espace : les disponibilités sont vérifiées au fur et à mesure.</p>'
      : `<div class="esp-rec-verif${c.bloquants.length ? ' a-des-conflits' : ' est-libre'}" data-rec-verif="${c.bloquants.length ? 'conflit' : 'libre'}" role="status">
        <p class="esp-rec-verif__titre">${c.bloquants.length ? `${pluriel(c.bloquants.length, 'point')} ${c.bloquants.length > 1 ? 'empêchent' : 'empêche'} de retenir ces espaces` : 'Ces espaces sont libres sur toute la période'}</p>
        ${ch.debut && ch.fin ? `<p class="esp-rec-verif__periode">Période occupée : du ${e(instantDit(ch.debut))} au ${e(instantDit(ch.fin))}${ch.lendemain ? ' (la soirée finit le lendemain)' : ''}. Préparation et remise en état comprises.</p>` : ''}
        ${c.bloquants.length ? `<ul class="esp-rec-verif__liste">${c.bloquants.map((x) => `<li data-rec-conflit="${x.type}">${e(x.texte)}</li>`).join('')}</ul>` : ''}
        ${c.attentions.length ? `<ul class="esp-rec-verif__notes">${c.attentions.map((x) => `<li>${e(x)}</li>`).join('')}</ul>` : ''}
        ${c.bloquants.length ? '<p class="esp-aide">Vous pouvez examiner un autre horaire ou un autre espace : la vérification se refait à chaque changement. Rien n\'est enregistré tant que vous ne validez pas.</p>' : ''}</div>`;
    const repl = !rep ? '' : `<article class="esp-carte esp-rec-repl" data-rec-repl aria-labelledby="rec-rp-t"><h4 id="rec-rp-t">Proposition de replacement</h4>
        <p class="esp-aide">Un aperçu : rien n'est changé. Chaque déplacement est revérifié au moment où il est enregistré.</p>
        <ul class="esp-rec-verif__liste">${rep.propositions.map((x) => `<li>${e(x.resa.nom || 'Une réservation')} (${pluriel(+x.resa.couverts, 'couvert')}, ${e(x.libelle)} à ${e(heure(x.resa.heure))}) : ${e(nomPlace(x.de))} → ${e(nomPlace(x.vers))}</li>`).join('')}${rep.sansSolution.map((x) => `<li class="est-sans-solution">${e(x.raison)}</li>`).join('')}</ul>
        ${rep.propositions.length ? `<p><button type="button" class="esp-bouton" data-rec-replacer>Appliquer ${rep.propositions.length > 1 ? `ces ${rep.propositions.length} déplacements` : 'ce déplacement'}</button></p>` : ''}</article>`;
    const bilan = !R.bilan ? '' : `<div class="esp-rec-verif est-libre" data-rec-bilan role="status"><p class="esp-rec-verif__titre">${e(phraseBilan(R.bilan))}</p><ul class="esp-rec-verif__liste">${R.bilan.map((x) => `<li data-repli-resultat="${x.etat}">${e(x.nom)} : ${e(ETATS_REPLI[x.etat].toLowerCase())}${x.etat === 'deplacee' ? ` (${e(nomPlace(x.table))})` : x.raison ? ` : ${e(x.raison)}` : ''}</li>`).join('')}</ul></div>`;
    return `<div class="esp-rec-grille esp-rec-grille--espaces">
      <article class="esp-carte" aria-labelledby="rec-es-t"><h4 id="rec-es-t">La date, les horaires, les espaces</h4>
        ${actif ? `<p class="esp-rec-alerte" data-rec-retenue-phrase>${e(ret.phrase)} Pour changer la date, les horaires ou les espaces, modifiez-les ci-dessous puis utilisez « Vérifier et déplacer ».</p>` : ret.etat === 'expiree' || ret.etat === 'liberee' ? `<p class="esp-rec-alerte" data-rec-retenue-phrase>${e(ret.phrase)}</p>` : ''}
        ${champ('Date de la réception', 'rf-jour', `<input id="rf-jour" type="date" data-rec-form="jour" value="${e(f.jour)}">`)}
        <div class="esp-rec-horaires">${HORAIRES.map(([cle, lib]) => champ(lib, `rf-${cle}`, `<input id="rf-${cle}" type="time" data-rec-form="h-${cle}" value="${e(f.horaires[cle] || '')}">`, !f.horaires[cle] && h[cle] ? `proposé : ${heure(h[cle])}` : cle === 'repas' ? 'facultatif' : '')).join('')}</div>
        <p class="esp-aide">Exemples à confirmer : la préparation commence ${lieux().durees.preparation / 60} h avant l'arrivée, la remise en état dure ${lieux().durees.remise / 60} h. Une heure plus petite que la précédente est le lendemain.</p>
        <fieldset class="esp-rec-espaces"><legend>Les espaces</legend><ul>${(lieux().espaces || []).map(esp).join('')}</ul></fieldset>
        <p class="esp-aide">Effectif pris en compte : ${invitesDe(d) ? pluriel(invitesDe(d), 'invité') : 'non précisé (onglet Projet)'}. Capacités : celles de la page Réceptions quand elle les donne, sinon celles du plan de démonstration.</p></article>
      <div class="esp-rec-colonne">${verif}${repl}${bilan}
        <article class="esp-carte" aria-labelledby="rec-op-t"><h4 id="rec-op-t">${ferme ? 'Réception confirmée' : 'L\'option'}</h4>
          ${ferme ? '<p class="esp-aide">Les espaces sont réservés. Un changement de date, d\'horaires ou d\'espace est revérifié avant d\'être enregistré.</p>'
            : `${champ('L\'option est valable jusqu\'au', 'rf-echeance', `<input id="rf-echeance" type="datetime-local" data-rec-form="echeance" value="${e(echeance)}">`, 'à cette date et à cette heure, les espaces sont libérés')}
               <p class="esp-aide">Exemple à confirmer : ${lieux().durees.option_jours} jours, sans dépasser la veille de la réception. Une option retient les espaces sans les réserver.</p>`}
          <p class="esp-rec-actions">${ferme ? '<button type="button" class="esp-bouton esp-bouton--ok" data-rec-retenir="ferme">Vérifier et déplacer la réception</button>'
            : `<button type="button" class="esp-bouton${accord ? '' : ' esp-bouton--ok'}" data-rec-retenir="option">${ret.etat === 'option' ? 'Vérifier et déplacer, ou prolonger l\'option' : ret.etat === 'expiree' ? 'Vérifier et poser une nouvelle option' : 'Poser l\'option'}</button>`}
            ${actif ? '<button type="button" class="esp-bouton esp-bouton--discret" data-rec-liberer-ouvrir>Libérer les espaces</button>' : ''}</p>
          ${R.liberer ? `<form class="esp-rec-ajout" data-rec-liberer>${champ(ferme ? 'Pourquoi la réception est-elle annulée ?' : 'Pourquoi l\'option est-elle levée ?', 'rf-raison', '<input id="rf-raison" name="raison" required autocomplete="off">')}<p><button type="submit" class="esp-bouton esp-bouton--non">Libérer les espaces</button> <button type="button" class="esp-bouton esp-bouton--discret" data-rec-liberer-non>Annuler</button></p></form>` : ''}</article>
        ${ferme ? '' : `<article class="esp-carte esp-rec-confirmer" aria-labelledby="rec-co-t"><h4 id="rec-co-t">Confirmer la réception</h4>
          <ul class="esp-rec-conditions">${[[!!couranteDe(d) && !brouillonDe(d), couranteDe(d) ? (brouillonDe(d) ? `Une version ${brouillonDe(d).v} est en préparation : à présenter ou à abandonner` : `Proposition version ${d.courante} présentée`) : 'Aucune proposition présentée'],
            [!!accord, accord ? `Accord du client — simulation (version ${accord.version})` : 'Accord du client : pas encore donné'], [!c.bloquants.length && ch.complet && f.espaces.length > 0, c.bloquants.length ? 'Les espaces ne sont pas libres sur la période' : ch.complet && f.espaces.length ? 'Espaces libres sur toute la période' : 'Date, horaires ou espaces à compléter']]
            .map(([ok, t]) => `<li class="${ok ? 'est-ok' : ''}"><span aria-hidden="true">${ok ? '✓' : '·'}</span> ${e(t)}<span class="visuellement-cache">${ok ? ' (rempli)' : ' (à faire)'}</span></li>`).join('')}</ul>
          <p class="esp-rec-actions"><button type="button" class="esp-bouton esp-bouton--ok" data-rec-retenir="ferme">Confirmer la réception</button></p>
          <p class="esp-aide">La confirmation réserve les espaces après une dernière vérification. Elle n'envoie rien, ne signe rien et n'encaisse rien.</p></article>`}</div></div>`;
  }

  function ongletClient(d) {
    const v = actionsClient(venues(), d.id), att = attentesClient(d, v), accord = accordDe(d, v), lien = X.lienReception(d);
    const question = (q) => { const r = d.portail?.reponses?.[q.id]; return `<li class="esp-rec-echange" data-rec-question="${e(q.id)}"><p><b>Question du client</b> <small>le ${e(instantDit(q.le))}</small></p><p class="esp-rec-echange__texte">${e(q.texte)}</p>
      ${r ? `<p class="esp-rec-echange__reponse"><b>Votre réponse</b> <small>le ${e(instantDit(r.le))}</small><br>${e(r.texte)}</p>` : `<form data-rec-repondre="${e(q.id)}">${champ('Votre réponse', `rq-${q.id}`, `<textarea id="rq-${e(q.id)}" name="texte" rows="2" required></textarea>`, 'visible sur la page du client ; aucun message n\'est envoyé')}<p><button type="submit" class="esp-bouton esp-bouton--ok">Répondre</button></p></form>`}</li>`; };
    const changement = (x) => { const dec = d.portail?.decisions?.[x.id], k = dec ? null : consequences(ctx(), S(), D.salle, d, x), val = x.valeur || {};
      const voulu = x.type === 'effectif' ? `${val.invites} invités` : x.type === 'horaire' ? [val.arrivee ? `arrivée à ${heure(val.arrivee)}` : '', val.fin ? `fin à ${heure(val.fin)}` : ''].filter(Boolean).join(', ') : x.type === 'espace' ? nomsEspaces(lieux(), val.espaces || []).join(', ') : val.texte || '';
      return `<li class="esp-rec-echange${dec ? '' : ' est-en-attente'}" data-rec-changement="${e(x.id)}"><p><b>${e(TYPES_CHANGEMENT[x.type] || 'Changement')}</b> <small>demandé le ${e(instantDit(x.le))}</small> ${dec ? `<span class="esp-pastille esp-pastille--${dec.acceptee ? 'confirmee' : 'refusee'}">${dec.acceptee ? 'Accepté' : 'Refusé'}</span>` : '<span class="esp-pastille esp-pastille--a-confirmer">Demande à traiter</span>'}</p>
        <p class="esp-rec-echange__texte">Souhaité : ${e(voulu)}${x.message ? `. « ${e(x.message)} »` : ''}</p>
        ${dec ? (dec.texte ? `<p class="esp-rec-echange__reponse">${e(dec.texte)}</p>` : '') : `<div class="esp-rec-verif${k.bloquants.length ? ' a-des-conflits' : ' est-libre'}" data-rec-consequences><p class="esp-rec-verif__titre">Ce que ce changement entraîne</p><ul class="esp-rec-verif__liste">${k.lignes.map((l) => `<li>${e(l)}</li>`).join('')}</ul>${k.attentions.length ? `<ul class="esp-rec-verif__notes">${k.attentions.map((l) => `<li>${e(l)}</li>`).join('')}</ul>` : ''}</div>
          <form data-rec-decider="${e(x.id)}">${champ('Un mot pour le client', `rc-${x.id}`, `<input id="rc-${e(x.id)}" name="texte" autocomplete="off">`, 'facultatif')}
          <p class="esp-rec-actions"><button type="submit" class="esp-bouton esp-bouton--ok" name="decision" value="oui">Accepter le changement</button> <button type="submit" class="esp-bouton esp-bouton--non" name="decision" value="non">Refuser</button></p>
          <p class="esp-aide">Tant que vous n'avez pas répondu, ce qui est convenu reste inchangé, sur votre écran comme sur la page du client.</p></form>`}</li>`; };
    return `<div class="esp-rec-grille">
      <article class="esp-carte" aria-labelledby="rec-cl-t"><h4 id="rec-cl-t">« Votre réception aux Jardins »</h4>
        <p class="esp-aide">La page du client : son projet, l'étape, la proposition courante, ce qui est convenu, ses demandes et vos réponses. Vos notes internes n'y figurent jamais.</p>
        <p class="esp-rec-actions">${lien}</p>
        <p class="esp-rec-accord" data-rec-accord="${accord ? accord.version : ''}">${accord ? `<span class="esp-pastille esp-pastille--a-confirmer">Accord du client — simulation</span> sur la version ${accord.version}, le ${e(instantDit(accord.le))}${accord.par === 'equipe' ? ' (noté par l\'équipe)' : ''}. À confirmer par l'équipe, dans « Espaces et option ».` : couranteDe(d) ? `Le client n'a pas encore donné son accord sur la version ${d.courante}.` : 'Aucune proposition n\'a encore été présentée.'}</p>
        <p class="esp-aide">Un accord donné sur cette page est une simulation : il ne vaut ni signature ni paiement.</p></article>
      <article class="esp-carte" aria-labelledby="rec-in-t"><h4 id="rec-in-t">Les informations attendues du client</h4>
        ${(d.portail?.infos || []).length ? `<ul class="esp-rec-infos">${d.portail.infos.map((i) => `<li><b>${e(i.libelle)}</b> ${v.infos?.[i.id] ? `<span class="esp-pastille esp-pastille--confirmee">Reçue</span><br>${e(v.infos[i.id].valeur)}` : '<span class="esp-pastille esp-pastille--r-non-tentee">En attente</span>'}</li>`).join('')}</ul>` : '<p class="esp-aide">Rien n\'est demandé au client pour le moment.</p>'}
        <form class="esp-rec-ajout" data-rec-info>${champ('Demander une information', 'ri-libelle', '<input id="ri-libelle" name="libelle" required autocomplete="off" placeholder="Nombre d\'enfants, régimes particuliers…">')}<p><button type="submit" class="esp-bouton">Demander</button></p></form></article>
      <article class="esp-carte esp-carte--large" aria-labelledby="rec-de-t"><h4 id="rec-de-t">Les demandes du client ${att.questions.length + att.changements.length ? `<span class="esp-filtre__n">${att.questions.length + att.changements.length}</span>` : ''}</h4>
        ${(v.changements || []).length || (v.questions || []).length ? `<ul class="esp-rec-echanges">${[...(v.changements || [])].reverse().map(changement).join('')}${[...(v.questions || [])].reverse().map(question).join('')}</ul>` : '<p class="esp-aide">Le client n\'a rien demandé. Ses questions et ses demandes de changement faites depuis sa page arriveront ici.</p>'}</article></div>`;
  }

  function ongletJourJ(d) {
    const v = actionsClient(venues(), d.id), f = fichePreparation(ctx(), d, v, taches(d.id)), j = d.jourJ || {}, ferme = d.retenue?.etat === 'ferme';
    return `${ferme ? '' : '<p class="esp-rec-alerte">La réception n\'est pas encore confirmée : cette fiche se remplit déjà, mais rien n\'est réservé.</p>'}
      <div class="esp-rec-grille">
      <article class="esp-carte esp-carte--large" aria-labelledby="rec-jj-t"><h4 id="rec-jj-t">La fiche du jour J ${f.manques ? `<span class="esp-pastille esp-pastille--a-confirmer">${pluriel(f.manques, 'information')} à renseigner</span>` : '<span class="esp-pastille esp-pastille--confirmee">Complète</span>'}</h4>
        <div class="esp-rec-fiche">${f.sections.map((s) => `<section><h5>${e(s.titre)}</h5><dl>${s.lignes.map((l) => `<div class="${l.manque ? 'est-manquant' : ''}"><dt>${e(l.label)}</dt><dd>${e(l.valeur)}</dd></div>`).join('')}</dl></section>`).join('')}</div>
        <p class="esp-rec-actions"><button type="button" class="esp-bouton esp-bouton--ok" data-rec-fiche aria-haspopup="dialog">Voir et imprimer la fiche</button></p>
        <p class="esp-aide">Chaque information vient du dossier : la corriger ici ou dans son onglet la corrige partout.</p></article>
      <article class="esp-carte" aria-labelledby="rec-jc-t"><h4 id="rec-jc-t">À compléter pour l'équipe</h4>
        ${champ('Invités confirmés', 'jj-confirmes', texte('jj-confirmes', 'projet.invitesConfirmes', d.projet?.invitesConfirmes || '', { type: 'number', min: 0, inputmode: 'numeric' }))}
        ${champ('Configuration des espaces', 'jj-config', zone('jj-config', 'jourJ.configuration', j.configuration, 'Tables, plan, décor, matériel…'))}
        ${champ('Pour la cuisine', 'jj-cuisine', zone('jj-cuisine', 'jourJ.cuisine', j.cuisine, 'Menu arrêté, régimes, horaires d\'envoi…'))}
        ${champ('Pour l\'accueil', 'jj-accueil', zone('jj-accueil', 'jourJ.accueil', j.accueil, 'Vestiaire, placement, prestataires attendus…'))}</article>
      <article class="esp-carte" aria-labelledby="rec-jt-t"><h4 id="rec-jt-t">Les tâches</h4>
        ${X.tachesDe('reception', d.id, d.projet?.intitule || 'Réception', '')}
        ${tachesHabituelles(lieux(), d, '').some((t) => !taches(d.id).some((x) => x.id === t.id)) ? '<p><button type="button" class="esp-bouton" data-rec-taches>Ajouter les tâches habituelles</button></p><p class="esp-aide">Six tâches d\'exemple, datées par rapport au jour J. Elles apparaissent aussi dans Aujourd\'hui, le jour venu : ce sont les mêmes, pas des copies.</p>' : '<p class="esp-aide" data-rec-taches-faites>Les tâches habituelles sont dans la liste. Elles apparaissent aussi dans Aujourd\'hui, le jour venu : ce sont les mêmes, pas des copies.</p>'}
        ${ferme && d.jour && d.jour <= A.iso ? '<p><button type="button" class="esp-bouton" data-rec-terminer>La réception est terminée</button></p>' : ''}</article></div>`;
  }
  const ongletHistorique = (d) => `<article class="esp-carte" aria-labelledby="rec-hi-t"><h4 id="rec-hi-t">L'historique des décisions</h4><ol class="esp-rec-histo">${[...(d.historique || [])].reverse().map((h) => `<li><time>${e(/^\d{4}-\d{2}-\d{2}T/.test(h.le) ? instantDit(h.le, true) : h.le)}</time><span>${e(h.quoi)}</span></li>`).join('')}</ol></article>`;

  function rendreDossier() {
    const d = dossier(); if (!d) { etat.dossier = null; garder(); return false; }
    garder();
    X.corps('demandes').innerHTML = typo(`<div class="esp-rec-dossier" data-rec-dossier="${e(d.id)}">${entete(d)}
      <div class="esp-rec-panneau" id="rec-panneau" role="tabpanel" aria-labelledby="rec-onglet-${R.onglet}" tabindex="-1" data-rec-panneau="${R.onglet}">${({ projet: ongletProjet, proposition: ongletProposition, espaces: ongletEspaces, client: ongletClient, jourj: ongletJourJ, historique: ongletHistorique })[R.onglet](d)}</div></div>`);
    return true;
  }
  function ouvrir(id, onglet = 'projet') { if (ctx().exemples === false) return; etat.dossier = id; R.onglet = onglet; R.form = null; R.liberer = false; R.sansSuite = false; etat.filtreDemandes = 'reception'; X.allerVue('demandes'); $('#rec-titre', root)?.focus({ preventScroll: true }); }
  function creer(demande) {
    const dem = X.demandes().find((x) => x.id === demande); if (!dem) return;
    const existant = dossierDeDemande(S(), demande); if (existant) { ouvrir(existant.id); return; }
    const d = dossierDepuisDemande(dem, { cree: maintenant(), lieux: lieux() });
    if (agir('recCreer', { dossier: d }, { msg: `Dossier créé pour ${dem.qui} : rien n'est à ressaisir.` })) ouvrir(d.id);
  }

  /* ---------- Les documents : aperçu à l'écran, puis impression ---------- */
  let fen = null, retour = null, document_ = '';
  function fenetre(titre, html, classe) {
    retour = document.activeElement; document_ = `<div class="${classe}">${html}</div>`;
    if (!fen) { fen = document.createElement('div'); fen.className = 'esp-modale esp-modale--doc'; fen.hidden = true; root.append(fen);
      fen.addEventListener('click', (ev) => { if (ev.target.closest('[data-fermer-doc]')) fermer(); if (ev.target.closest('[data-imprimer-doc]')) imprimer(); });
      fen.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { ev.stopPropagation(); fermer(); }
        if (ev.key === 'Tab') { const l = $$('a[href], button:not([disabled])', fen).filter((x) => x.offsetParent), i = l.indexOf(document.activeElement); if (ev.shiftKey && i <= 0) { ev.preventDefault(); l[l.length - 1]?.focus(); } else if (!ev.shiftKey && i === l.length - 1) { ev.preventDefault(); l[0]?.focus(); } } }); }
    fen.innerHTML = `<div class="esp-modale__fond" data-fermer-doc></div><div class="esp-modale__boite" role="dialog" aria-modal="true" aria-labelledby="doc-titre"><header class="esp-modale__tete"><h2 id="doc-titre">${e(typo(titre))}</h2><button type="button" class="esp-rond" data-fermer-doc aria-label="Fermer">×</button></header>
      <div class="esp-doc-cadre" tabindex="0" role="group" aria-label="Le document">${document_}</div><p class="esp-doc-actions"><button type="button" class="esp-bouton esp-bouton--ok" data-imprimer-doc>Imprimer</button> <button type="button" class="esp-bouton" data-fermer-doc>Fermer</button></p></div>`;
    fen.hidden = false; document.documentElement.classList.add('esp-modale-ouverte'); $('[data-imprimer-doc]', fen).focus();
  }
  function fermer() { if (!fen || fen.hidden) return; fen.hidden = true; document.documentElement.classList.remove('esp-modale-ouverte'); (retour && document.contains(retour) ? retour : $('#rec-titre', root))?.focus?.(); }
  function imprimer() {
    document.querySelector('.esp-feuille')?.remove(); const f = document.createElement('div'); f.className = 'esp-feuille esp-feuille--doc'; f.innerHTML = document_; document.body.append(f);
    document.documentElement.classList.add('esp-impression');
    const fin = () => { document.documentElement.classList.remove('esp-impression'); f.remove(); removeEventListener('afterprint', fin); };
    addEventListener('afterprint', fin);
    try { print(); } catch { fin(); X.dire('L\'impression n\'a pas pu démarrer sur ce navigateur.'); }
  }
  /** La proposition telle que le client la voit et la reçoit : jamais les notes internes. */
  function documentProposition(d, p) {
    const liste = (t) => String(t || '').split('\n').map((x) => x.trim()).filter(Boolean);
    return typo(`<p class="esp-doc__demo">Démonstration · proposition d'exemple, sans valeur contractuelle</p>
      <header class="esp-doc__tete"><p class="esp-doc__maison">Les Jardins de l'Hacienda</p><h3>${e(p.titre || 'Proposition')}</h3>
        <p class="esp-doc__ref">Proposition version ${p.v}${p.etat === 'presentee' ? ` · présentée le ${e(instantDit(p.presenteeLe, true))}` : ' · brouillon, non présenté'}</p>
        <p class="esp-doc__ref">Pour ${e(d.client?.nom || '')}${d.jour ? ` · ${e(maj(jour(d.jour)))}` : d.souhait?.date ? ` · ${e(maj(jour(d.souhait.date)))} (date souhaitée)` : ''}${d.projet?.invitesConfirmes || d.projet?.invitesAnnonces ? ` · ${d.projet.invitesConfirmes || d.projet.invitesAnnonces} invités` : ''}</p></header>
      ${p.presentation ? `<p class="esp-doc__intro">${e(p.presentation)}</p>` : ''}
      <table class="esp-doc__table"><caption class="visuellement-cache">Les prestations</caption><thead><tr><th scope="col">Prestation</th><th scope="col">Quantité</th><th scope="col">Prix unitaire</th><th scope="col">Total</th></tr></thead>
        <tbody>${p.lignes.map((l) => `<tr><td><b>${e(l.libelle)}</b>${l.description ? `<br><span>${e(l.description)}</span>` : ''}</td><td>${e(String(l.qte).replace('.', ','))}${l.unite ? ` <span>${e(l.unite)}</span>` : ''}</td><td>${e(euros(l.pu))}</td><td>${e(euros(totalLigne(l)))}</td></tr>`).join('')}</tbody>
        <tfoot><tr><th scope="row" colspan="3">Total</th><td>${e(euros(totalProposition(p)))}</td></tr></tfoot></table>
      <p class="esp-doc__note">Montants d'exemple. Le total est la somme des lignes ; taxes, acompte et remises ne sont pas calculés.</p>
      ${liste(p.compris).length ? `<section><h4>Ce qui est compris</h4><ul>${liste(p.compris).map((x) => `<li>${e(x)}</li>`).join('')}</ul></section>` : ''}
      ${liste(p.aPreciser).length ? `<section><h4>Ce qui reste à préciser</h4><ul>${liste(p.aPreciser).map((x) => `<li>${e(x)}</li>`).join('')}</ul></section>` : ''}
      <section><h4>Validité et conditions</h4><p>Proposition valable ${p.validite ? `jusqu'au ${e(jour(p.validite))}` : ': durée à renseigner'}.</p><p>${e(p.conditions || 'Conditions (acompte, annulation, prix TTC ou HT) : à renseigner par le restaurant.')}</p></section>
      <p class="esp-doc__pied">Les Jardins de l'Hacienda · ${e(D.telephone || '')} · Document de démonstration : aucune signature, aucun paiement.</p>`);
  }
  /** La fiche du jour J : le résumé opérationnel d'abord, les détails ensuite. Tout vient du dossier. */
  function documentJourJ(d) {
    const v = actionsClient(venues(), d.id), f = fichePreparation(ctx(), d, v, taches(d.id)), s = Object.fromEntries(f.sections.map((x) => [x.titre, x.lignes])), val = (t, l) => s[t]?.find((x) => x.label === l)?.valeur || 'À renseigner';
    return typo(`${d.source === 'demo' ? '<p class="esp-doc__demo">Démonstration · données fictives</p>' : ''}
      <header class="esp-doc__tete"><p class="esp-doc__maison">Les Jardins de l'Hacienda · Fiche du jour J</p><h3>${e(d.projet?.intitule || 'Réception')}</h3>
        <p class="esp-doc__ref">${e(val('La réception', 'Date'))} · ${e(val('La réception', 'Invités confirmés') === 'À renseigner' ? `${val('La réception', 'Invités annoncés')} invités annoncés (à confirmer)` : `${val('La réception', 'Invités confirmés')} invités confirmés`)} · ${e(val('Les espaces', 'Espaces réservés'))}</p>
        <p class="esp-doc__ref">${d.retenue?.etat === 'ferme' ? 'Réception confirmée' : 'Réception non confirmée : fiche provisoire'}</p></header>
      <section class="esp-doc__resume"><h4>Le déroulé</h4><ol>${s['Les horaires'].map((l) => `<li class="${l.manque ? 'est-manquant' : ''}"><b>${e(l.valeur)}</b> ${e(l.label)}</li>`).join('')}</ol></section>
      ${f.sections.filter((x) => x.titre !== 'Les horaires').map((x) => `<section><h4>${e(x.titre)}</h4><dl>${x.lignes.map((l) => `<div class="${l.manque ? 'est-manquant' : ''}"><dt>${e(l.label)}</dt><dd>${e(l.valeur)}</dd></div>`).join('')}</dl></section>`).join('')}
      <section><h4>Les tâches</h4>${f.taches.length ? `<ul class="esp-doc__taches">${f.taches.map((t) => `<li><span class="esp-doc__case" aria-hidden="true">${t.fait ? '✓' : ''}</span>${e(t.titre)}${t.echeance ? ` <span>pour le ${e(fmt(t.echeance, { day: 'numeric', month: 'long' }))}</span>` : ''}${t.responsable ? ` <span>· ${e(t.responsable)}</span>` : ''}<span class="visuellement-cache">${t.fait ? ' (faite)' : ' (à faire)'}</span></li>`).join('')}</ul>` : '<p>Aucune tâche notée.</p>'}</section>
      <p class="esp-doc__pied">Fiche relue depuis le dossier le ${e(instantDit(maintenant(), true))}. « À renseigner » : l'information manque dans le dossier.</p>`);
  }

  /* ---------- Les gestes ---------- */
  const lireProposition = () => { const z = $('[data-rec-brouillon]', root); if (!z) return null;
    return { ...Object.fromEntries($$('[data-pr]', z).map((x) => [x.dataset.pr, x.value])), lignes: $$('[data-rec-ligne]', z).map((tr) => { const avant = brouillonDe(dossier())?.lignes.find((l) => l.id === tr.dataset.recLigne) || {};
      return { ...avant, id: tr.dataset.recLigne, ...Object.fromEntries($$('[data-pl]', tr).map((x) => [x.dataset.pl, ['qte', 'pu'].includes(x.dataset.pl) ? +String(x.value).replace(',', '.') || 0 : x.value])) }; }) }; };
  const sauverProposition = (plus = null, msg = 'Proposition enregistrée (brouillon).') => { const p = lireProposition() || { lignes: [] }; if (plus) p.lignes = [...p.lignes, plus]; return agir('recProposition', { id: etat.dossier, proposition: p, le: maintenant() }, { msg, groupe: `rec-prop-${etat.dossier}` }); };
  const retenir = (type) => {
    const d = dossier(), f = saisie(d), ech = f.echeance || (f.jour ? echeanceParDefaut(maintenant(), f.jour, lieux().durees) : '');
    const ok = agir('recRetenir', argsRetenue(ctx(), D.salle, d, { type, jour: f.jour, horaires: f.horaires, espaces: f.espaces, echeance: ech, le: maintenant() }), { msg: type === 'ferme' ? 'Réception confirmée : les espaces sont réservés. Rien n\'est envoyé.' : `Option enregistrée jusqu'au ${instantDit(ech)} : les espaces sont retenus.` });
    if (ok) { R.form = null; R.bilan = null; R.liberer = false; }
    X.rendre(); (ok ? $('#rec-titre', root) : $('[data-rec-verif]', root))?.focus?.({ preventScroll: false }); if (!ok) X.viser?.($('[data-rec-verif]', root), 'center');
  };
  function clic(t) {
    if (ctx().exemples === false) return false;
    const o = t.closest('[data-rec-ouvrir]'); if (o) { if (o.closest('.esp-modale')) X.fermerClient?.(); ouvrir(o.dataset.recOuvrir, o.dataset.recVers || 'projet'); return true; }
    const cr = t.closest('[data-rec-creer]'); if (cr) { creer(cr.dataset.recCreer); return true; }
    const fi = t.closest('[data-rec-filtre]'); if (fi) { R.filtre = fi.dataset.recFiltre; X.rendre(); $(`[data-rec-filtre="${R.filtre}"]`, root)?.focus(); return true; }
    if (!etat.dossier || !t.closest('[data-rec-dossier], .esp-modale--doc')) return false;
    const d = dossier(); if (!d) return false;
    if (t.closest('[data-rec-retour]')) { etat.dossier = null; R.form = null; garder(); X.rendre(); $(`[data-rec-carte="${CSS.escape(d.id)}"] button`, root)?.focus(); return true; }
    const og = t.closest('[data-rec-onglet]'); if (og) { R.onglet = og.dataset.recOnglet; R.liberer = false; R.sansSuite = false; X.rendre(); $(`#rec-onglet-${R.onglet}`, root)?.focus(); if (R.onglet === 'jourj') X.demoVu?.('rec-jourj'); return true; }
    if (t.closest('[data-rec-client]')) { X.ouvrirClient?.(d); return true; }
    if (t.matches('[data-rec-qualifie]')) { agir('recModifier', { id: d.id, champs: { qualifie: t.checked }, le: maintenant(), quoi: t.checked ? 'Projet qualifié.' : '' }, { msg: t.checked ? 'Projet qualifié.' : 'Projet à qualifier.' }); refaire(); return true; }
    if (t.matches('[data-rec-visite="faite"]')) { agir('recModifier', { id: d.id, champs: { visite: { ...d.visite, faite: t.checked } }, le: maintenant(), quoi: t.checked ? 'Visite faite.' : '' }, { msg: t.checked ? 'Visite notée comme faite.' : 'Visite à faire.' }); refaire(); return true; }
    const rc = t.closest('[data-rec-contact-retirer]'); if (rc) { agir('recModifier', { id: d.id, champs: { contact: { id: rc.dataset.recContactRetirer, retirer: true } } }, { msg: 'Interlocuteur retiré.' }); X.rendre(); $('#rec-ct-nom', root)?.focus(); return true; }
    if (t.closest('[data-rec-sans-suite-ouvrir]')) { R.sansSuite = true; X.rendre(); $('#rec-raison', root)?.focus(); return true; }
    if (t.closest('[data-rec-sans-suite-non]')) { R.sansSuite = false; X.rendre(); $('[data-rec-sans-suite-ouvrir]', root)?.focus(); return true; }
    if (t.closest('[data-rec-rouvrir]')) { agir('recRouvrir', { id: d.id, le: maintenant() }, { msg: 'Dossier rouvert. Aucun espace n\'est retenu.' }); X.rendre(); $('#rec-titre', root)?.focus(); return true; }
    /* La proposition. */
    if (t.closest('[data-rec-proposition-creer]')) { agir('recProposition', { id: d.id, proposition: { titre: d.projet?.intitule || 'Proposition', lignes: [] }, le: maintenant() }, { msg: 'Brouillon créé : il ne retient aucun espace.' }); X.rendre(); $('#pr-titre', root)?.focus(); return true; }
    if (t.closest('[data-rec-ligne-ajouter]')) { const id = $('[data-rec-catalogue]', root)?.value, x = catalogue().find((y) => y.id === id); if (!x) { X.dire('Choisissez une prestation dans la liste.'); $('[data-rec-catalogue]', root)?.focus(); return true; }
      const n = /personne/.test(x.unite || '') ? invitesDe(d) || 1 : 1; sauverProposition({ id: `l-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`, libelle: x.libelle, description: x.description || '', qte: n, pu: x.pu, unite: x.unite || '', origine: x.id, ...(x.exemple ? { exemple: true } : {}) }, `${x.libelle} ajouté à la proposition.`); X.rendre(); $('[data-rec-catalogue]', root)?.focus(); return true; }
    if (t.closest('[data-rec-ligne-libre]')) { sauverProposition({ id: `l-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`, libelle: 'Nouvelle prestation', description: '', qte: 1, pu: 0, unite: '' }, 'Ligne ajoutée : donnez-lui un nom et un prix.'); X.rendre(); const l = $$('[data-rec-ligne] [data-pl="libelle"]', root); l[l.length - 1]?.focus(); l[l.length - 1]?.select?.(); return true; }
    const lr = t.closest('[data-rec-ligne-retirer]'); if (lr) { const p = lireProposition(); p.lignes = p.lignes.filter((l) => l.id !== lr.dataset.recLigneRetirer); agir('recProposition', { id: d.id, proposition: p, le: maintenant() }, { msg: 'Prestation retirée.' }); X.rendre(); $('[data-rec-catalogue]', root)?.focus(); return true; }
    if (t.closest('[data-rec-presenter]')) { sauverProposition(null, 'Proposition enregistrée.'); const ok = agir('recPresenter', { id: d.id, le: maintenant() }, { msg: 'Proposition présentée : elle est visible sur la page du client. Rien n\'est envoyé.' }); X.rendre(); (ok ? $('[data-rec-version]', root)?.querySelector('button') : $('#pr-titre', root))?.focus(); return true; }
    if (t.closest('[data-rec-abandonner]')) { agir('recAbandonnerBrouillon', { id: d.id, le: maintenant() }, { msg: 'Brouillon abandonné. La version présentée reste la version courante.' }); X.rendre(); $('#rec-onglet-proposition', root)?.focus(); return true; }
    if (t.closest('[data-rec-nouvelle-version]')) { agir('recNouvelleVersion', { id: d.id, le: maintenant() }, { msg: 'Nouvelle version en préparation : l\'ancienne reste consultable, intacte.' }); X.rendre(); $('#pr-titre', root)?.focus(); return true; }
    if (t.closest('[data-rec-accord-equipe]')) { agir('recAccordEquipe', { id: d.id, le: maintenant() }, { msg: 'Accord noté (simulation). La réception reste à confirmer par l\'équipe.' }); X.rendre(); $('#rec-onglet-proposition', root)?.focus(); return true; }
    const ap = t.closest('[data-rec-apercu]'); if (ap) { if (brouillonDe(d)?.v === +ap.dataset.recApercu) sauverProposition(null, 'Proposition enregistrée.'); const p = dossier().propositions.find((x) => x.v === +ap.dataset.recApercu); if (p) { fenetre(`Proposition version ${p.v} : ce que voit le client`, documentProposition(dossier(), p), 'esp-doc'); X.demoVu?.('rec-apercu'); } return true; }
    /* Les espaces et l'option. */
    const re = t.closest('[data-rec-retenir]'); if (re) { retenir(re.dataset.recRetenir); return true; }
    if (t.closest('[data-rec-liberer-ouvrir]')) { R.liberer = true; X.rendre(); $('#rf-raison', root)?.focus(); return true; }
    if (t.closest('[data-rec-liberer-non]')) { R.liberer = false; X.rendre(); $('[data-rec-liberer-ouvrir]', root)?.focus(); return true; }
    if (t.closest('[data-rec-replacer]')) { const f = saisie(d), h = completerHoraires(f.horaires, lieux().durees), rep = replacement(ctx(), S(), D.salle, d, { jour: f.jour, horaires: h, espaces: f.espaces, invites: invitesDe(d) });
      const res = appliquerUnParUn(rep.propositions.map((x) => ({ id: x.resa.id, table: x.vers })), (x) => (agir('placerResa', { id: x.id, table: x.table }, { msg: 'Réservation déplacée.' }) ? true : X.raisonRefus() || 'Ce déplacement a été refusé.'));
      R.bilan = res.map((x) => ({ ...x, nom: rep.propositions.find((p) => p.resa.id === x.id)?.resa.nom || 'Une réservation' })); X.apresSerie?.(); X.rendre(); X.dire(phraseBilan(res)); $('[data-rec-bilan]', root)?.setAttribute('tabindex', '-1'); $('[data-rec-bilan]', root)?.focus(); return true; }
    /* Le jour J. */
    if (t.closest('[data-rec-taches]')) { const l = tachesHabituelles(lieux(), d, maintenant()).filter((x) => !taches(d.id).some((y) => y.id === x.id)); for (const tache of l) agir('tacheAjouter', { tache }, { msg: `${pluriel(l.length, 'tâche')} ${l.length > 1 ? 'ajoutées' : 'ajoutée'} au dossier.`, groupe: `rec-taches-${d.id}` }); X.rendre(); $('#rec-onglet-jourj', root)?.focus(); return true; }
    if (t.closest('[data-rec-fiche]')) { fenetre('Fiche du jour J', documentJourJ(d), 'esp-doc esp-doc--jourj'); X.demoVu?.('rec-fiche'); return true; }
    if (t.closest('[data-rec-terminer]')) { agir('recTerminer', { id: d.id, le: maintenant() }, { msg: 'Réception terminée : le dossier est rangé dans « Terminé ».' }); X.rendre(); $('#rec-titre', root)?.focus(); return true; }
    return false;
  }
  /** Un champ du dossier quitté ou modifié : enregistré, sans redessiner (le focus reste où il est). */
  function change(t) {
    if (ctx().exemples === false || !etat.dossier) return false; const d = dossier(); if (!d) return false;
    if (t.matches('[data-rec]')) { const [groupe, cle] = t.dataset.rec.split('.'), val = t.type === 'number' ? Math.max(0, Math.round(+t.value || 0)) : t.value;
      agir('recModifier', { id: d.id, champs: cle ? { [groupe]: { [cle]: val } } : { [groupe]: val } }, { msg: 'Dossier enregistré.', groupe: `rec-${d.id}-${t.dataset.rec}` }); X.majScene?.();
      if (['projet.intitule', 'client.nom', 'projet.invitesConfirmes', 'projet.invitesAnnonces', 'suivi.prochaine', 'suivi.echeance'].includes(t.dataset.rec)) refaire(); return true; }
    if (t.matches('[data-rec-visite]') && t.dataset.recVisite !== 'faite') { const v = { ...(d.visite || {}), [t.dataset.recVisite]: t.value };
      agir('recModifier', { id: d.id, champs: { visite: v.date ? v : null }, le: maintenant(), quoi: t.dataset.recVisite === 'date' && t.value ? `Visite prévue le ${fmt(t.value, { weekday: 'long', day: 'numeric', month: 'long' })}.` : '' }, { msg: v.date ? 'Visite enregistrée : elle apparaît dans l\'agenda.' : 'Visite retirée.' }); refaire(); return true; }
    if (t.matches('[data-rec-form]')) { const f = saisie(d), k = t.dataset.recForm;
      if (k === 'jour') f.jour = t.value; else if (k === 'echeance') f.echeance = t.value; else if (k === 'espace') f.espaces = $$('[data-rec-form="espace"]:checked', root).map((x) => x.value); else if (k.startsWith('h-')) { if (t.value) f.horaires[k.slice(2)] = t.value; else delete f.horaires[k.slice(2)]; }
      R.bilan = null; refaire(); if (k === 'espace') $(`[data-rec-form="espace"][value="${CSS.escape(t.value)}"]`, root)?.focus({ preventScroll: true }); return true; }
    if (t.closest('[data-rec-brouillon]') && (t.matches('[data-pr]') || t.matches('[data-pl]'))) { sauverProposition(); if (t.matches('[data-pl="qte"], [data-pl="pu"]')) refaire(); return true; }
    return false;
  }
  /** La recherche du suivi : la liste se met à jour sans quitter le champ. */
  function saisieTexte(t) {
    if (!t.matches('[data-rec-recherche]')) return false; R.recherche = t.value; const p = phasesHtml(), z = $('[data-rec-phases]', root); if (z) z.innerHTML = p.html; const c = $('[data-rec-compte]', root); if (c) c.textContent = p.compte; return true;
  }
  function soumettre(f, ev) {
    if (ctx().exemples === false || !etat.dossier) return false; const d = dossier(); if (!d) return false; const le = maintenant(), v = (n) => String(new FormData(f).get(n) || '').trim();
    if (f.matches('[data-rec-contact]')) { const tel = v('telephone'); agir('recModifier', { id: d.id, champs: { contact: { id: `c-${Date.now().toString(36)}`, nom: v('nom'), role: v('role'), ...(tel.includes('@') ? { email: tel } : { telephone: tel }) } } }, { msg: `${v('nom')} ajouté aux interlocuteurs.` }); X.rendre(); $('#rec-ct-nom', root)?.focus(); return true; }
    if (f.matches('[data-rec-sans-suite]')) { if (agir('recSansSuite', { id: d.id, raison: v('raison'), le }, { msg: 'Dossier classé sans suite. Ce qui était retenu est libéré ; l\'historique est gardé.' })) R.sansSuite = false; X.rendre(); $('#rec-titre', root)?.focus(); return true; }
    if (f.matches('[data-rec-liberer]')) { if (agir('recLiberer', { id: d.id, raison: v('raison'), le }, { msg: 'Espaces libérés. Le dossier et son historique sont gardés.' })) { R.liberer = false; R.form = null; } X.rendre(); $('#rec-titre', root)?.focus(); return true; }
    if (f.matches('[data-rec-info]')) { agir('recModifier', { id: d.id, champs: { info: { id: `i-${Date.now().toString(36)}`, libelle: v('libelle') } }, le, quoi: `Information demandée au client : ${v('libelle')}.` }, { msg: 'Demande ajoutée à la page du client. Rien n\'est envoyé.' }); X.rendre(); $('#ri-libelle', root)?.focus(); return true; }
    if (f.matches('[data-rec-repondre]')) { agir('recRepondre', { id: d.id, question: f.dataset.recRepondre, texte: v('texte'), le }, { msg: 'Réponse visible sur la page du client. Rien n\'est envoyé.' }); X.rendre(); $('#rec-onglet-client', root)?.focus(); return true; }
    if (f.matches('[data-rec-decider]')) { const ch = (actionsClient(venues(), d.id).changements || []).find((x) => x.id === f.dataset.recDecider), oui = ev?.submitter?.value !== 'non'; if (!ch) return true;
      const k = oui ? consequences(ctx(), S(), D.salle, d, ch) : null;
      agir('recDecider', { id: d.id, changement: ch.id, type: ch.type, valeur: ch.valeur, acceptee: oui, texte: v('texte'), retenue: k?.retenue || null, le }, { msg: oui ? 'Changement accepté : le dossier est mis à jour, la page du client aussi.' : 'Changement refusé : ce qui était convenu est gardé.' });
      R.form = null; X.rendre(); $('#rec-onglet-client', root)?.focus(); return true; }
    return false;
  }
  return { suiviHtml, boutonDemande, rendreDossier, ouvrir, creer, clic, change, saisieTexte, soumettre, fermerDocument: fermer };
}
