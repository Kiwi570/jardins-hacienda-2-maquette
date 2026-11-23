/* Les offres prennent vie (v7.13.0) : l'écran du catalogue commun, la barre « en préparation / publié » que portent
   la carte, l'ardoise et les soirées, et l'onglet « Publication » de la rubrique Site (ce qui attend, l'historique,
   la reprise d'une version en brouillon). Les règles sont dans espace-offres.js ; ici, seulement l'écran.

   Trois repères reviennent partout, parce qu'ils changent ce qu'on comprend :
   - « En préparation » : enregistré dans l'espace, pas sur le site ;
   - « Aperçu — non publié » : la page du site telle qu'elle serait, dans un autre onglet ;
   - « Sur cet appareil » : dans cette démonstration, tout est gardé dans ce navigateur. */
import { UNITES, UNITES_EMPORTER, TYPES, catalogue, enPreparation, attente, offre as offreDe, offresDeBase, validerOffre, lirePrixOffre, usagesOffre, historique, retablirait } from './espace-offres.js?v=7';
import { pluriel, typo } from './espace-regles.js?v=7';
import { instantDit } from './espace-receptions.js?v=7';

const LIEU = { carte: 'la carte', ardoise: 'l\'ardoise', soiree: 'cette soirée', offre: 'cette offre', annonce: 'l\'annonce', textes: 'ces textes', photo: 'cette photo' };
const ENTIER = ['carte', 'ardoise', 'annonce', 'textes', 'photo'];
const FILTRES = [['tout', 'Tout'], ['formule', 'Formules et menus'], ['prestation', 'Prestations'], ['plat', 'Plats'], ['soiree', 'Soirées'], ['cadeau', 'Cartes cadeaux'], ['emporter', 'À emporter']];
const ETAT_PROP = { brouillon: 'brouillon', presentee: 'présentée', retiree: 'retirée' };

export function creerOffres(X) {
  const { root, $, $$, e, S, A, D, etat, agir, corps } = X;
  const sources = () => ({ carte: D.carte, agenda: D.agenda, lieux: D.receptions, produits: D.produits, ardoise: D.ardoise, textes: D.textes, photos: D.photos });
  const base = () => offresDeBase(D.receptions);
  const maintenant = () => String(X.ctx().maintenant).slice(0, 16);
  /* La page du site où un périmètre se voit (pour l'aperçu et le lien « Voir »). Une carte cadeau se voit sur Offrir. */
  const pageDe = (perimetre, id = '') => (perimetre === 'soiree' ? D.pages.fetes : perimetre === 'offre' ? (offreDe(D.receptions, S(), id)?.type === 'cadeau' ? D.pages.offrir : offreDe(D.receptions, S(), id)?.type === 'emporter' ? D.pages.emporter : D.pages.receptions)
    : perimetre === 'annonce' ? D.pages.accueil : perimetre === 'textes' ? D.textes.find((t) => t.page === id)?.url || D.pages.accueil : perimetre === 'photo' ? D.photos.find((x) => x.id === id)?.url || D.pages.accueil : D.pages.carte);
  const local = X.connecte ? 'Ce contenu n\'est pas encore partagé entre vos appareils : il est gardé dans ce navigateur.' : 'Dans cette démonstration, la publication est enregistrée dans ce navigateur, pas sur un serveur.';
  const cleP = (perimetre, id = '') => `${perimetre}:${id || ''}`;

  /** La barre d'un périmètre : ce qui attend, l'aperçu, la publication (avec son résumé), l'abandon. */
  function barre(perimetre, id = '', { discret = false } = {}) {
    const d = attente(sources(), S(), perimetre, id), ouvert = etat.pub?.cle === cleP(perimetre, id);
    if (!d) return discret ? '' : typo(`<p class="esp-pub esp-pub--net" data-pub-net="${e(cleP(perimetre, id))}"><span class="esp-pastille esp-pastille--confirmee">Publié</span> Le site affiche ce contenu : rien n'attend ici.</p>`);
    const autres = enPreparation(sources(), S()).filter((x) => cleP(x.perimetre, x.id) !== cleP(perimetre, id)), n = d.changements.length;
    return typo(`<div class="esp-pub" data-pub="${e(cleP(perimetre, id))}">
      <p class="esp-pub__texte"><span class="esp-pastille esp-pastille--cours">En préparation</span> <span data-pub-compte>${pluriel(n, 'changement')}</span> ${n > 1 ? 'ne sont' : 'n\'est'} pas encore sur le site : les visiteurs voient toujours la version publiée.</p>
      <p class="esp-pub__actions"><a class="esp-bouton" href="${e(X.lienApercu(pageDe(perimetre, id)))}" target="_blank" rel="noopener" data-pub-apercu>Voir l'aperçu <span aria-hidden="true">↗</span><span class="visuellement-cache"> (nouvel onglet, non publié)</span></a>
        <button type="button" class="bouton esp-pub__publier" data-pub-ouvrir="${e(perimetre)}" data-pub-id="${e(id)}" aria-expanded="${ouvert}">${e(d.bouton)}</button>
        <button type="button" class="esp-bouton esp-bouton--discret" data-pub-abandonner="${e(perimetre)}" data-pub-id="${e(id)}">Abandonner ces changements</button></p>
      ${ouvert ? `<div class="esp-pub__resume" role="group" aria-labelledby="pub-titre" data-pub-resume>
        <h4 id="pub-titre" tabindex="-1">Ce qui va changer sur le site${d.ou ? ` <small data-pub-ou>(${e(d.ou)})</small>` : ''}</h4>
        <ul class="esp-pub__liste">${d.changements.map((c) => `<li>${e(c)}</li>`).join('')}</ul>
        <p class="esp-aide" data-pub-reste>${autres.length ? `Reste en préparation, sans être publié : ${e(autres.map((x) => (ENTIER.includes(x.perimetre) ? x.libelle.toLowerCase() : `« ${x.libelle} »`)).join(', '))}.` : 'Rien d\'autre n\'est en préparation.'}</p>
        <p class="esp-aide"><span class="esp-pastille">Sur cet appareil</span> ${e(local)}</p>
        ${etat.pub.erreur ? `<p class="esp-erreur" role="alert" data-pub-erreur>${e(etat.pub.erreur)}</p>` : ''}
        <p class="esp-pub__actions"><button type="button" class="bouton" data-pub-confirmer>Publier maintenant</button><button type="button" class="esp-bouton" data-pub-annuler>Pas maintenant</button></p>
      </div>` : ''}
    </div>`);
  }

  /* ---------- Le catalogue commun ---------- */
  const erreursDe = (id) => (etat.offreErreurs?.id === id ? etat.offreErreurs.liste : []);
  function editeur(o) {
    const err = erreursDe(o.id), de = (champ) => err.find((x) => x.champ === champ), msg = (champ) => (de(champ) ? `<small class="esp-erreur" id="of-err-${champ}" data-of-erreur="${champ}">${e(de(champ).message)}</small>` : ''), inv = (champ) => (de(champ) ? ` aria-invalid="true" aria-describedby="of-err-${champ}"` : '');
    const s = etat.offreSaisie?.id === o.id ? etat.offreSaisie.champs : { nom: o.nom, type: o.type, prix: o.prix === '' || o.prix == null ? '' : String(o.prix).replace('.', ','), unite: o.unite, description: o.description, categorie: o.categorie, ordre: o.ordre || '', du: o.periode?.du || '', au: o.periode?.au || '', conditions: o.conditions, propositions: o.usages?.propositions !== false, site: !!o.usages?.site, visuel: o.visuel?.nom || (o.type === 'emporter' && o.produit ? `traiteur/${o.produit}` : ''), alt: o.visuel?.alt || '',
      min: o.vente ? String(o.vente.min).replace('.', ',') : '', pas: o.vente ? String(o.vente.pas).replace('.', ',') : '', delai: o.vente?.delai === '' || o.vente?.delai == null ? '' : String(o.vente.delai) };
    const emp = o.type === 'emporter';
    return `<form class="esp-offre__form" data-form-offre="${e(o.id)}" novalidate aria-label="Modifier ${e(o.nom || 'la nouvelle offre')}">
      <p class="esp-champ esp-champ--large"><label for="of-nom">Nom</label><input id="of-nom" name="nom" value="${e(s.nom)}" autocomplete="off"${inv('nom')}>${msg('nom')}</p>
      <p class="esp-champ"><label for="of-type">Genre d'offre</label><select id="of-type" name="type">${(o.type === 'cadeau' ? ['cadeau'] : emp ? ['emporter'] : ['formule', 'prestation']).map((t) => `<option value="${t}"${t === s.type ? ' selected' : ''}>${TYPES[t]}</option>`).join('')}</select></p>
      <p class="esp-champ"><label for="of-prix">Prix <small>en euros ; vide : « à définir », jamais gratuit</small></label><input id="of-prix" name="prix" inputmode="decimal" value="${e(s.prix)}" autocomplete="off"${inv('prix')}>${msg('prix')}</p>
      <p class="esp-champ"><label for="of-unite">Unité du prix</label><select id="of-unite" name="unite"${inv('unite')}><option value="">Choisir…</option>${Object.entries(UNITES).filter(([k]) => !emp || UNITES_EMPORTER.includes(k)).map(([k, v]) => `<option value="${k}"${k === s.unite ? ' selected' : ''}>${v}</option>`).join('')}</select>${msg('unite')}</p>
      ${emp ? `<fieldset class="esp-offre__periode" data-of-vente><legend>Quantités à la commande <small>dans l'unité du prix : « 2 pièces » n'est pas « 2 kilos »</small></legend>
        <p class="esp-champ"><label for="of-min">Quantité minimale</label><input id="of-min" name="min" inputmode="decimal" value="${e(s.min)}" autocomplete="off"${inv('min')}>${msg('min')}</p>
        <p class="esp-champ"><label for="of-pas">Pas <small>de combien elle augmente</small></label><input id="of-pas" name="pas" inputmode="decimal" value="${e(s.pas)}" autocomplete="off"${inv('pas')}>${msg('pas')}</p>
        <p class="esp-champ"><label for="of-delai">Délai de commande <small>en jours ; vide : non précisé</small></label><input id="of-delai" name="delai" inputmode="numeric" value="${e(s.delai)}" autocomplete="off"${inv('delai')}>${msg('delai')}</p></fieldset>` : ''}
      <p class="esp-champ esp-champ--large"><label for="of-desc">Description <small>ce que le client lira</small></label><textarea id="of-desc" name="description" rows="2">${e(s.description)}</textarea></p>
      <p class="esp-champ"><label for="of-cat">Catégorie</label><input id="of-cat" name="categorie" value="${e(s.categorie)}" autocomplete="off"></p>
      <p class="esp-champ"><label for="of-ordre">Ordre dans sa catégorie</label><input id="of-ordre" name="ordre" type="number" min="0" step="1" value="${e(s.ordre)}"></p>
      <fieldset class="esp-offre__periode"${de('periode') ? ' aria-describedby="of-err-periode"' : ''}><legend>Période <small>facultative : en dehors, l'offre n'est ni affichée ni proposée</small></legend>
        <p class="esp-champ"><label for="of-du">Du</label><input id="of-du" name="du" type="date" value="${e(s.du)}"${inv('periode')}></p><p class="esp-champ"><label for="of-au">Au</label><input id="of-au" name="au" type="date" value="${e(s.au)}"${inv('periode')}></p>${msg('periode')}</fieldset>
      <p class="esp-champ esp-champ--large"><label for="of-cond">Conditions <small>facultatives : effectif minimum, délai…</small></label><textarea id="of-cond" name="conditions" rows="2">${e(s.conditions)}</textarea></p>
      <fieldset class="esp-offre__usages"><legend>Où cette offre sert</legend>
        ${o.type === 'cadeau' ? `<input type="hidden" name="propositions" value="">` : `<label class="esp-coche"><input type="checkbox" name="propositions"${s.propositions ? ' checked' : ''}><span>Dans les propositions de réception${emp ? ' <small>(une ligne de proposition ne crée jamais de commande à préparer)</small>' : ''}</span></label>`}
        <label class="esp-coche"><input type="checkbox" name="site"${s.site ? ' checked' : ''}><span>${o.type === 'cadeau' ? 'Proposée sur le site, page Offrir' : emp ? 'Proposé à la commande, page À emporter' : 'Sur le site, page Réceptions'}</span></label>
        ${emp ? '<p class="esp-aide">Un produit masqué n\'est plus proposé à la commande ; les commandes déjà reçues gardent leurs lignes et leurs montants.</p>' : ''}
        ${o.type === 'cadeau' ? '<p class="esp-aide">La demande de carte cadeau garde son parcours actuel : le client choisit ce montant, puis envoie sa demande. La validité et les conditions restent celles que le restaurant aura confirmées.</p>' : ''}</fieldset>
      ${emp ? `<p class="esp-champ"><label for="of-visuel">Visuel <small>un des plats dessinés de la page</small></label><select id="of-visuel" name="visuel"><option value="">Cloche sans dessin</option>${(D.produits || []).map((p) => `<option value="traiteur/${e(p.id)}"${`traiteur/${p.id}` === s.visuel ? ' selected' : ''}>${e(p.nom)}</option>`).join('')}</select></p>`
        : `<p class="esp-champ"><label for="of-visuel">Photo <small>de votre photothèque</small></label><select id="of-visuel" name="visuel"><option value="">Aucune</option>${D.phototheque.map((p) => `<option value="${e(p.nom)}"${p.nom === s.visuel ? ' selected' : ''}>${e(p.nom.split('/')[1].replace(/-/g, ' '))}</option>`).join('')}</select></p>`}
      <p class="esp-champ"><label for="of-alt">Ce que montre la photo <small>pour les lecteurs d'écran</small></label><input id="of-alt" name="alt" value="${e(s.alt)}" autocomplete="off"></p>
      ${etat.offreErreurs?.id === o.id && etat.offreErreurs.refus ? `<p class="esp-erreur esp-champ--large" role="alert" data-of-refus>${e(etat.offreErreurs.refus)}</p>` : ''}
      <p class="esp-offre__form-actions"><button type="submit" class="bouton">Enregistrer en préparation</button><button type="button" class="esp-bouton" data-offre-fermer>Fermer sans enregistrer</button>
        <span class="esp-aide">Le site ne change pas tant que vous ne publiez pas cette offre.</span></p>
    </form>`;
  }
  function panneauArchive(o) {
    const u = usagesOffre(D.receptions, S(), o.id), n = u.propositions.length, dem = u.cadeau ? (X.demandes?.() || []).filter((x) => x.genre === 'cadeau' && +x.montant === +offreDe(D.receptions, S(), o.id, 'publie')?.prix).length : 0;
    return `<div class="esp-offre__archive" role="group" aria-labelledby="arch-titre" data-offre-archive-panneau>
      <h4 id="arch-titre" tabindex="-1">Archiver « ${e(o.nom)} » ?</h4>
      <ul class="esp-pub__liste">
        ${u.cadeau ? `<li data-usage="demandes">${dem ? `${pluriel(dem, 'demande reçue')} ${dem > 1 ? 'portent' : 'porte'} ce montant : ${dem > 1 ? 'elles gardent' : 'elle garde'} le montant choisi par le client.` : 'Aucune demande reçue ne porte ce montant.'}</li>` : ''}
        <li data-usage="propositions"${u.cadeau || (u.emporter && !n) ? ' hidden' : ''}>${n ? `Reprise dans ${pluriel(n, 'proposition')} de réception (${e(u.propositions.slice(0, 4).map((p) => `${p.intitule}, version ${p.version} ${ETAT_PROP[p.etat] || p.etat}`).join(' ; '))}${n > 4 ? '…' : ''}) : ${n > 1 ? 'elles gardent leurs lignes et leurs prix' : 'elle garde ses lignes et ses prix'}, rien n'y est réécrit.` : 'Aucune proposition de réception ne la reprend.'}</li>
        ${u.emporter ? `<li data-usage="commandes">${(() => { const n = X.commerce?.commandesDeOffre?.(o.id) || 0; return n ? `${pluriel(n, 'commande reçue')} ${n > 1 ? 'reprennent' : 'reprend'} ce produit : ${n > 1 ? 'elles gardent' : 'elle garde'} ses lignes, ses quantités et ses montants.` : 'Aucune commande reçue ne reprend ce produit.'; })()}</li>` : ''}
        <li data-usage="site">${u.site ? `${u.cadeau ? 'Proposée sur la page Offrir' : u.emporter ? 'Proposé à la commande sur la page À emporter' : 'Affichée sur le site (page Réceptions)'} : ${u.emporter ? 'il en est retiré' : 'elle en est retirée'} tout de suite.` : u.emporter ? 'Il n\'est pas proposé à la commande.' : 'Elle n\'est pas affichée sur le site.'}</li>
        <li>${u.cadeau ? 'Le client ne peut plus choisir ce montant.' : u.emporter ? 'Le client ne peut plus commander ce produit.' : 'Elle n\'est plus proposée dans les nouvelles propositions.'} Vous pouvez ${u.emporter ? 'le' : 'la'} remettre au catalogue quand vous voulez.</li>
        <li>Aucune réservation, aucun dossier, aucun accord n'est annulé ni modifié.</li></ul>
      <p class="esp-pub__actions"><button type="button" class="bouton" data-offre-archiver-oui="${e(o.id)}">Archiver cette offre</button><button type="button" class="esp-bouton" data-offre-archiver-non>Ne pas archiver</button></p></div>`;
  }
  function ligne(x) {
    const ouvert = etat.offreEditee === x.id && x.ou === 'offre', arch = etat.offreArchive === x.id;
    const o = x.ou === 'offre' ? offreDe(D.receptions, S(), x.id) : null;
    const pastilles = [x.exemple ? '<span class="esp-pastille" data-offre-exemple>Exemple</span>' : '', x.archive ? '<span class="esp-pastille esp-pastille--refusee">Archivée</span>' : x.preparation ? `<span class="esp-pastille esp-pastille--cours">${x.publie ? 'Modification en préparation' : 'Brouillon, pas encore sur le site'}</span>` : x.ou === 'offre' ? `<span class="esp-pastille esp-pastille--confirmee">Publiée</span>` : x.publie ? '<span class="esp-pastille esp-pastille--confirmee">Sur le site</span>' : '<span class="esp-pastille">Pas sur le site</span>'].filter(Boolean).join(' ');
    const ou = x.type === 'cadeau' ? (x.usages?.site ? 'la page Offrir' : 'nulle part pour l\'instant (masquée sur la page Offrir)') : x.type === 'emporter' ? [x.usages?.site ? 'la page À emporter' : '', x.usages?.propositions ? 'propositions de réception' : ''].filter(Boolean).join(' et ') || 'nulle part pour l\'instant (masqué sur la page À emporter)' : x.ou === 'offre' ? [x.usages?.propositions !== false ? 'propositions de réception' : '', x.usages?.site ? 'site' : ''].filter(Boolean).join(' et ') || 'nulle part pour l\'instant' : x.ou === 'carte' ? 'la carte du site' : x.ou === 'soirees' ? 'Les fêtes, l\'accueil, Réserver' : 'la page À emporter et les propositions';
    const actions = x.ou === 'offre' ? `${x.archive ? `<button type="button" class="esp-bouton" data-offre-remettre="${e(x.id)}">Remettre au catalogue</button>` : `<button type="button" class="esp-bouton" data-offre-editer="${e(x.id)}" aria-expanded="${ouvert}">Modifier</button><button type="button" class="esp-bouton esp-bouton--discret" data-offre-archiver="${e(x.id)}" aria-expanded="${arch}">Archiver</button>`}`
      : x.ou === 'carte' ? `<button type="button" class="esp-bouton" data-offre-aller="carte" data-offre-cle="${e(x.id)}">Ouvrir dans La carte</button>` : x.ou === 'soirees' ? `<button type="button" class="esp-bouton" data-offre-aller="soirees" data-offre-cle="${e(x.id)}">Ouvrir dans Les soirées</button>` : '';
    return `<li class="esp-offre${x.archive ? ' est-archive' : ''}${ouvert ? ' est-ouvert' : ''}" data-offre="${e(x.id)}" data-offre-type="${e(x.type)}">
      <div class="esp-offre__texte"><p class="esp-offre__nom"><b>${e(x.nom)}</b></p><p class="esp-offre__etats" data-offre-etats>${pastilles}</p><p class="esp-offre__detail">${e(TYPES[x.type])} · ${e(x.categorie)} · sert pour : ${e(ou)}</p></div>
      <p class="esp-offre__prix" data-offre-prix>${e(x.prix)}</p>
      <p class="esp-offre__actions">${actions}</p>
      ${x.ou === 'offre' && !x.archive ? barre('offre', x.id, { discret: true }) : ''}
      ${ouvert && o ? editeur(o) : ''}${arch && o ? panneauArchive(o) : ''}</li>`;
  }
  function rendreCatalogue(onglets) {
    X.demoVu?.('offre-catalogue');
    const tout = catalogue(sources(), S(), A.iso), f = FILTRES.some(([k]) => k === etat.filtreOffres) ? etat.filtreOffres : 'tout', vus = tout.filter((x) => f === 'tout' || x.type === f), prep = enPreparation(sources(), S()).length;
    corps('carte').innerHTML = typo(`${onglets}<div class="esp-panneau" id="panneau-carte" role="tabpanel" aria-labelledby="onglet-carte-catalogue">
      <p class="esp-bonjour">${pluriel(tout.filter((x) => !x.archive).length, 'offre')} dans votre catalogue : plats, formules, prestations, soirées, cartes cadeaux, produits à emporter. Chacune se prépare une fois, ici, puis sert sur le site et dans vos propositions. ${prep ? `<b>${pluriel(prep, 'élément')} en préparation</b>, pas encore sur le site.` : 'Tout ce qui est ici est publié.'}</p>
      <div class="esp-barre"><p class="esp-filtres" role="group" aria-label="Montrer">${FILTRES.map(([k, nom]) => `<button type="button" class="esp-filtre" aria-pressed="${k === f}" data-offre-filtre="${k}">${nom}</button>`).join('')}</p>
        <p class="esp-barre__actions"><button type="button" class="bouton esp-ajouter" data-offre-nouvelle><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><span>Nouvelle offre</span></button><button type="button" class="esp-bouton" data-offre-nouvelle="emporter">Nouveau produit à emporter</button></p></div>
      <p class="esp-aide"><span class="esp-pastille">Exemple</span> Les prix marqués « Exemple » sont des montants de démonstration : ils ne viennent pas du restaurant et restent à remplacer par les vôtres.</p>
      <ul class="esp-offres" data-offres>${vus.map(ligne).join('') || '<li class="esp-vide">Aucune offre de ce genre pour l\'instant. <button type="button" class="esp-lien" data-offre-nouvelle>Créer une offre</button></li>'}</ul></div>`);
  }

  /* ---------- Site, onglet « Publication » : ce qui attend, l'historique, la reprise en brouillon ---------- */
  const NOM_P = { carte: 'La carte', ardoise: 'L\'ardoise', soiree: 'Soirée', offre: 'Offre', annonce: 'L\'annonce', textes: 'Textes', photo: 'Photo' };
  const nomP = (x) => (ENTIER.includes(x.perimetre) ? x.libelle : `${NOM_P[x.perimetre]} : ${x.libelle}`);
  function rendrePublication() {
    const prep = enPreparation(sources(), S()), h = historique(S()), premiers = new Set(), enLigne = new Set();
    for (const x of [...h].reverse()) { const k = cleP(x.perimetre, x.id); if (!premiers.has(k)) { premiers.add(k); x.premier = true; } }
    for (const x of h) { const k = cleP(x.perimetre, x.id); if (!enLigne.has(k)) { enLigne.add(k); x.enLigne = true; } }
    const voir = (x, cote) => { const ouvert = etat.histo?.n === x.n && etat.histo?.cote === cote, r = ouvert ? retablirait(sources(), S(), x.n, cote) : null;
      return `<p class="esp-pub__actions"><button type="button" class="esp-bouton" data-histo-voir="${x.n}" data-histo-cote="${cote}" aria-expanded="${ouvert}">${cote === 'avant' ? 'Voir ce que rétablirait le contenu d\'avant' : 'Voir ce que cette version rétablirait'}</button></p>
        ${ouvert ? `<div class="esp-pub__resume" role="group" aria-labelledby="histo-titre" data-histo-detail><h4 id="histo-titre" tabindex="-1">Si vous reprenez ${cote === 'avant' ? 'le contenu d\'avant cette publication' : `la version n° ${x.n}`}</h4>
          ${r.changements.length ? `<ul class="esp-pub__liste">${r.changements.map((c) => `<li>${e(c)}</li>`).join('')}</ul>` : '<p class="esp-aide" data-histo-rien>Rien ne changerait : ce contenu est déjà celui qui est en préparation.</p>'}
          <p class="esp-aide">Elle revient <b>en brouillon</b> : le site ne change pas tant que vous ne publiez pas. Les réservations, les services fermés, les plats épuisés, les propositions présentées ou acceptées et les tâches ne sont pas touchés.</p>
          ${etat.histo.erreur ? `<p class="esp-erreur" role="alert" data-histo-erreur>${e(etat.histo.erreur)}</p>` : ''}
          <p class="esp-pub__actions">${r.changements.length ? `<button type="button" class="bouton" data-histo-reprendre="${x.n}" data-histo-cote="${cote}">Reprendre en brouillon</button>` : ''}<button type="button" class="esp-bouton" data-histo-fermer>Fermer</button></p></div>` : ''}`; };
    corps('publication').innerHTML = typo(`<p class="esp-aide esp-aide--haut">Ce que vous préparez dans Offres reste ici en attente : le site ne change qu'à la publication, et vous publiez une chose à la fois. <span class="esp-pastille">Sur cet appareil</span> ${e(local)}</p>
      <h3 class="esp-sous">À publier</h3>
      ${prep.length ? `<ul class="esp-attentes" data-attentes>${prep.map((x) => `<li class="esp-attente-pub" data-attente-pub="${e(cleP(x.perimetre, x.id))}"><p class="esp-attente-pub__nom"><b>${e(nomP(x))}</b></p>
        <ul class="esp-pub__liste esp-pub__liste--court">${x.changements.slice(0, 4).map((c) => `<li>${e(c)}</li>`).join('')}${x.changements.length > 4 ? `<li>… et ${pluriel(x.changements.length - 4, 'autre changement')}.</li>` : ''}</ul>${barre(x.perimetre, x.id)}</li>`).join('')}</ul>` : '<p class="esp-vide" data-attentes-vide>Rien n\'attend : le site affiche tout ce que vous avez préparé. Pour préparer un changement, ouvrez <button type="button" class="esp-lien" data-aller="carte">Offres</button>.</p>'}
      <h3 class="esp-sous">Historique des publications</h3>
      ${h.length ? `<ol class="esp-histo" data-histo>${h.map((x) => `<li class="esp-histo__ligne" data-histo-n="${x.n}"><p class="esp-histo__tete"><b>N° ${x.n}</b> · ${e(x.le ? instantDit(x.le) : '')} · ${e(nomP(x))} ${x.enLigne ? '<span class="esp-pastille esp-pastille--confirmee">En ligne</span>' : ''}</p>
        <ul class="esp-pub__liste esp-pub__liste--court">${x.resume.slice(0, 3).map((c) => `<li>${e(c)}</li>`).join('')}${x.resume.length > 3 ? `<li>… et ${pluriel(x.resume.length - 3, 'autre changement')}.</li>` : ''}</ul>
        ${voir(x, 'apres')}${x.premier ? voir(x, 'avant') : ''}</li>`).join('')}</ol>` : '<p class="esp-vide" data-histo-vide>Aucune publication pour l\'instant : chaque publication s\'inscrira ici, avec ce qu\'elle a changé, et pourra être reprise en brouillon.</p>'}`);
  }

  /* ---------- Les gestes ---------- */
  const lireOffre = (f) => ({ nom: f.elements.nom.value, type: f.elements.type.value, prix: f.elements.prix.value, unite: f.elements.unite.value, description: f.elements.description.value, categorie: f.elements.categorie.value, ordre: f.elements.ordre.value, du: f.elements.du.value, au: f.elements.au.value, conditions: f.elements.conditions.value, propositions: f.elements.propositions.type === 'checkbox' ? f.elements.propositions.checked : false, site: f.elements.site.checked, visuel: f.elements.visuel.value, alt: f.elements.alt.value, min: f.elements.min?.value ?? '', pas: f.elements.pas?.value ?? '', delai: f.elements.delai?.value ?? '' });
  function soumis(f) {
    if (!f.matches('[data-form-offre]')) return false;
    const id = f.dataset.formOffre, s = lireOffre(f), avant = offreDe(D.receptions, S(), id), emp = s.type === 'emporter', saisie = { nom: s.nom, prix: s.prix, unite: s.unite, periode: { du: s.du, au: s.au }, type: s.type, site: s.site, ...(emp ? { vente: { min: s.min, pas: s.pas, delai: s.delai } } : {}) }, liste = validerOffre(saisie);
    etat.offreSaisie = { id, champs: s };
    if (liste.length) { etat.offreErreurs = { id, liste }; X.rendre(); const c = liste[0].champ; ($(`#of-${c === 'periode' ? 'du' : c}`, root))?.focus(); return true; }
    const champs = { nom: s.nom, type: s.type, prix: lirePrixOffre(s.prix), unite: s.unite, description: s.description, categorie: s.categorie, ordre: s.ordre, periode: s.du || s.au ? { du: s.du, au: s.au } : null, conditions: s.conditions, usages: { propositions: s.propositions, site: s.site }, visuel: s.visuel && !(emp && avant?.produit && s.visuel === `traiteur/${avant.produit}` && !s.alt.trim()) ? { nom: s.visuel, alt: s.alt } : null, ...(emp ? { vente: { min: s.min, pas: s.pas, delai: s.delai } } : {}) };
    if (agir('offre', { id, champs, saisie, base: base() }, { msg: 'Offre enregistrée en préparation : le site ne change pas tant que vous ne la publiez pas.' })) { etat.offreEditee = null; etat.offreErreurs = null; etat.offreSaisie = null; X.rendre(); $(`[data-offre="${CSS.escape(id)}"] [data-pub-ouvrir], [data-offre="${CSS.escape(id)}"] [data-offre-editer]`, root)?.focus(); }
    else { etat.offreErreurs = { id, liste: [], refus: X.refus() }; X.rendre(); $('[data-of-refus]', root)?.focus?.(); }
    return true;
  }
  function clic(t) {
    /* La publication : ouvrir le résumé, confirmer, renoncer, abandonner le brouillon. */
    const ouv = t.closest('[data-pub-ouvrir]'); if (ouv) { const cle = cleP(ouv.dataset.pubOuvrir, ouv.dataset.pubId); etat.pub = etat.pub?.cle === cle ? null : { cle, perimetre: ouv.dataset.pubOuvrir, id: ouv.dataset.pubId || '', vu: S().publie?.n || 0 }; X.rendre(); (etat.pub ? $('#pub-titre', root) : $(`[data-pub="${CSS.escape(cle)}"] [data-pub-ouvrir]`, root))?.focus(); return true; }
    if (t.closest('[data-pub-annuler]')) { const cle = etat.pub?.cle; etat.pub = null; X.rendre(); $(`[data-pub="${CSS.escape(cle || '')}"] [data-pub-ouvrir]`, root)?.focus(); return true; }
    if (t.closest('[data-pub-confirmer]') && etat.pub) {
      const { perimetre, id, vu, cle } = etat.pub, d = attente(sources(), S(), perimetre, id);
      const ok = agir('offPublier', { perimetre, id, vu, le: maintenant(), sources: sources() }, { msg: `Publié : ${d ? (ENTIER.includes(perimetre) ? d.libelle.toLowerCase() : `« ${d.libelle} »`) : 'ce contenu'} est en ligne, dans ce navigateur.${enPreparation(sources(), S()).length > 1 ? ' Le reste est resté en préparation.' : ''}`, lien: pageDe(perimetre, id) });
      if (ok) { etat.pub = null; X.rendre(); ($(`[data-pub-net="${CSS.escape(cle)}"]`, root) || $('[data-attentes] [data-pub-ouvrir], [data-attentes-vide], [data-offres]', root))?.focus?.(); }
      else { etat.pub = { ...etat.pub, vu: S().publie?.n || 0, erreur: X.refus() }; X.rendre(); $('[data-pub-erreur]', root)?.scrollIntoView?.({ block: 'nearest' }); }
      return true;
    }
    const ab = t.closest('[data-pub-abandonner]'); if (ab) {
      const perimetre = ab.dataset.pubAbandonner, id = ab.dataset.pubId || '', cle = cleP(perimetre, id);
      if (agir('offAbandonner', { perimetre, id, sources: sources() }, { msg: `Changements abandonnés : ${LIEU[perimetre]} est de nouveau comme sur le site.` })) { if (etat.pub?.cle === cle) etat.pub = null; if (perimetre === 'offre') { etat.offreEditee = null; etat.offreSaisie = null; } etat.platEdite = null; }
      X.rendre(); return true;
    }
    /* Le catalogue. */
    const fi = t.closest('[data-offre-filtre]'); if (fi) { etat.filtreOffres = fi.dataset.offreFiltre; X.rendre(); $(`[data-offre-filtre="${etat.filtreOffres}"]`, root)?.focus(); return true; }
    const ed = t.closest('[data-offre-editer]'); if (ed) { const id = ed.dataset.offreEditer, ouvrir = etat.offreEditee !== id; etat.offreEditee = ouvrir ? id : null; etat.offreArchive = null; etat.offreErreurs = null; etat.offreSaisie = null; X.rendre(); (ouvrir ? $('#of-nom', root) : $(`[data-offre="${CSS.escape(id)}"] [data-offre-editer]`, root))?.focus(); return true; }
    if (t.closest('[data-offre-fermer]')) { const id = etat.offreEditee; etat.offreEditee = null; etat.offreErreurs = null; etat.offreSaisie = null; X.rendre(); $(`[data-offre="${CSS.escape(id || '')}"] [data-offre-editer]`, root)?.focus(); return true; }
    const nv = t.closest('[data-offre-nouvelle]');
    if (nv) {
      const emp = nv.dataset.offreNouvelle === 'emporter', id = `${emp ? 'emporter-n' : 'o-'}${Date.now().toString(36)}`;
      const champs = emp ? { nom: 'Nouveau produit', type: 'emporter', prix: '', unite: 'piece', categorie: 'Carte traiteur', ordre: 300, usages: { propositions: false, site: false }, vente: { min: 1, pas: 1, delai: '' } } : { nom: 'Nouvelle offre', type: 'prestation', prix: '', unite: 'personne', categorie: 'Réceptions', usages: { propositions: true, site: false } };
      if (agir('offre', { id, champs, base: base() }, { msg: emp ? 'Produit créé en brouillon : donnez-lui un nom, un prix et une unité, puis proposez-le à la commande.' : 'Offre créée en brouillon : donnez-lui un nom, un prix et une unité.' })) { etat.filtreOffres = emp ? 'emporter' : 'tout'; etat.offreEditee = id; }
      X.rendre(); const n = $('#of-nom', root); n?.focus(); n?.select(); return true;
    }
    const ar = t.closest('[data-offre-archiver]'); if (ar) { const id = ar.dataset.offreArchiver; etat.offreArchive = etat.offreArchive === id ? null : id; etat.offreEditee = null; X.rendre(); (etat.offreArchive ? $('#arch-titre', root) : $(`[data-offre="${CSS.escape(id)}"] [data-offre-archiver]`, root))?.focus(); return true; }
    if (t.closest('[data-offre-archiver-non]')) { const id = etat.offreArchive; etat.offreArchive = null; X.rendre(); $(`[data-offre="${CSS.escape(id || '')}"] [data-offre-archiver]`, root)?.focus(); return true; }
    const oui = t.closest('[data-offre-archiver-oui]'); if (oui) { const id = oui.dataset.offreArchiverOui; agir('offArchiver', { id, actif: true, le: maintenant() }, { msg: 'Offre archivée : elle n\'est plus proposée. Les propositions et les réservations existantes n\'ont pas changé.' }); etat.offreArchive = null; X.rendre(); $(`[data-offre="${CSS.escape(id)}"] [data-offre-remettre]`, root)?.focus(); return true; }
    const re = t.closest('[data-offre-remettre]'); if (re) { const id = re.dataset.offreRemettre; agir('offArchiver', { id, actif: false }, { msg: 'Offre remise au catalogue.' }); X.rendre(); $(`[data-offre="${CSS.escape(id)}"] [data-offre-editer]`, root)?.focus(); return true; }
    const al = t.closest('[data-offre-aller]'); if (al) { etat.ongletCarte = al.dataset.offreAller; if (al.dataset.offreAller === 'carte') etat.platEdite = al.dataset.offreCle; else etat.evEdite = al.dataset.offreCle; X.rendre(); (al.dataset.offreAller === 'carte' ? $('#pl-nom', root) : $('#ev-titre', root))?.focus(); return true; }
    /* L'historique. */
    const vo = t.closest('[data-histo-voir]'); if (vo) { const n = +vo.dataset.histoVoir, cote = vo.dataset.histoCote, meme = etat.histo?.n === n && etat.histo?.cote === cote; etat.histo = meme ? null : { n, cote }; X.rendre(); (meme ? $(`[data-histo-voir="${n}"][data-histo-cote="${cote}"]`, root) : $('#histo-titre', root))?.focus(); return true; }
    if (t.closest('[data-histo-fermer]')) { const h = etat.histo; etat.histo = null; X.rendre(); $(`[data-histo-voir="${h?.n}"][data-histo-cote="${h?.cote}"]`, root)?.focus(); return true; }
    const rp = t.closest('[data-histo-reprendre]'); if (rp) {
      const n = +rp.dataset.histoReprendre, cote = rp.dataset.histoCote;
      if (agir('offReprendre', { n, cote, sources: sources() }, { msg: 'Version reprise en brouillon : le site n\'a pas changé. Relisez l\'aperçu, puis publiez si elle vous convient.' })) { etat.histo = null; X.rendre(); $('[data-attentes] [data-pub-apercu]', root)?.focus(); }
      else { etat.histo = { ...etat.histo, erreur: X.refus() }; X.rendre(); }
      return true;
    }
    return false;
  }
  /* v7.13.1 : ce que la rubrique Site affiche à côté de ses éditeurs. `zone` : « annonce », « textes » ou « photo:<emplacement> ». */
  function zone(z) {
    if (z === 'annonce') return barre('annonce');
    if (z.startsWith('photo:')) return barre('photo', z.slice(6), { discret: true });
    const l = enPreparation(sources(), S()).filter((x) => x.perimetre === 'textes');
    return l.length ? l.map((x) => `<p class="esp-pub__titre"><b>${e(x.libelle)}</b></p>${barre('textes', x.id)}`).join('') : typo('<p class="esp-pub esp-pub--net" data-pub-net="textes:"><span class="esp-pastille esp-pastille--confirmee">Publié</span> Le site affiche ces textes : rien n\'attend ici. Une modification se prépare d\'abord, puis se publie page par page.</p>');
  }
  return { barre, zone, rendreCatalogue, rendrePublication, clic, soumis, sources };
}
