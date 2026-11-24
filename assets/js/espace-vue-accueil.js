/* La rubrique « Aujourd'hui » (v7.10.0) : le prochain service, les priorités, le fil de la journée, les tâches, et le
   briefing d'un service (« Préparer le service »). Tout est lu par espace-accueil.js dans les mêmes données que les
   autres rubriques : un compteur d'ici ouvre toujours la liste qui le compose.
   Les tâches et l'aperçu des vues métier sont gardés dans ce navigateur ; l'écran le dit. */
import { fmt, maj, heure, pluriel, typo, ajouter, servicesDe, hhmm } from './espace-regles.js?v=7';
import { accueil, resumeService, nomService, cleService, filDuJour, GRANDE_TABLEE } from './espace-accueil.js?v=7';
import { nomPlace, ETATS_TABLE } from './espace-salle.js?v=7';
import { ETATS_ATTENTE } from './espace-attente.js?v=7';
import { nouvelleTache, tachesDuJour, tachesLiees } from './espace-taches.js?v=7';
import { preparation as preparationCommerce, commandes as commandesCommerce, quantite, nomClient, momentTexte, manqueDe, ETATS as ETATS_COMMANDE } from './commerce.js?v=7';

/* v7.15.0 : quatre vues métiers. Elles changent l'ordre des blocs, les raccourcis et le niveau de détail ; jamais les
   données, ni les règles, ni les droits (ce n'est pas une connexion). `PRIO` : les genres de priorités mis en avant. */
const VUES_METIER = [['direction', 'Direction', 'Les priorités générales, les dossiers, l\'activité et le bilan.'], ['accueil', 'Accueil', 'Les arrivées, les réservations, les demandes à décider et les retraits.'],
  ['salle', 'Salle', 'Le placement, l\'état des tables, les groupes et les points d\'attention du service.'], ['cuisine', 'Cuisine', 'Les couverts utiles, les informations signalées, la production et les préparations traiteur.']];
const ORDRE = { direction: ['service', 'priorites', 'fil', 'taches', 'commerce', 'site'], accueil: ['priorites', 'service', 'commerce', 'fil', 'taches', 'site'], salle: ['service', 'priorites', 'fil', 'taches'], cuisine: ['service', 'priorites', 'commerce', 'fil', 'taches'] };
const PRIO = { salle: ['salle', 'complet', 'tache', 'attente', 'venue'], cuisine: ['commande', 'tache'] };
const RACCOURCIS = { direction: [['bilan', 'Voir le bilan de la semaine'], ['demandes', 'Ouvrir les demandes'], ['assistant', 'Demander à l\'assistant']], accueil: [['demandes', 'Ouvrir les demandes'], ['retraits', 'Préparation et retraits'], ['service', 'Voir le service'], ['assistant', 'Demander à l\'assistant']],
  salle: [['salle', 'Ouvrir la salle'], ['briefing', 'Préparer le service'], ['service', 'Voir le service'], ['assistant', 'Demander à l\'assistant']], cuisine: [['briefing', 'Préparer le service'], ['retraits', 'Préparation et retraits'], ['carte', 'Modifier la carte'], ['assistant', 'Demander à l\'assistant']] };
/* L'ordre des blocs du briefing selon la vue : les mêmes blocs, jamais d'autres données. */
const BRIEF = { direction: ['ou', 'grandes', 'attentions', 'reste', 'traiteur', 'autour', 'rapprocher', 'indispo', 'attente', 'installations', 'taches'], accueil: ['reste', 'ou', 'traiteur', 'attente', 'grandes', 'attentions', 'autour', 'rapprocher', 'indispo', 'installations', 'taches'],
  salle: ['ou', 'installations', 'rapprocher', 'indispo', 'grandes', 'attentions', 'reste', 'attente', 'autour', 'traiteur', 'taches'], cuisine: ['attentions', 'grandes', 'traiteur', 'autour', 'taches', 'reste', 'ou'] };
const ETAT_TACHE = { retard: 'En retard', jour: 'Aujourd\'hui', venir: '', libre: '', faite: 'Terminée' };
const TYPE_LIEN = { demande: 'Demande', resa: 'Réservation', service: 'Service', client: 'Client', reception: 'Réception' };

export function creerAccueil(X) {
  const { root, $, e, S, A, D, ctx, etat, agir, dire } = X;
  const C = () => ({ ...ctx(), agenda: D.agenda, pages: D.pages });
  const lireVue = () => { try { return sessionStorage.getItem('jh-espace-vue-metier') || 'direction'; } catch { return 'direction'; } };
  etat.vueMetier = VUES_METIER.some(([id]) => id === lireVue()) ? lireVue() : 'direction'; etat.tacheEditee = null; etat.tacheLien = null; etat.briefing = null; etat.prioToutes = false;
  X.vueMetier = () => (ctx().exemples === false ? 'direction' : etat.vueMetier);
  const connecte = () => ctx().exemples === false;
  const dateCourte = (iso) => (iso === A.iso ? 'aujourd\'hui' : iso === ajouter(A.iso, 1) ? 'demain' : fmt(iso, { weekday: 'short', day: 'numeric', month: 'short' }));

  /* ---------- Zone A : le prochain service ---------- */
  function zoneService(p, vue) {
    if (!p) return `<section class="esp-carte esp-carte--large esp-acc__service" aria-labelledby="t-prochain"><p class="esp-acc__sur">Le prochain service</p><h3 id="t-prochain">Aucun service ouvert dans les quinze jours</h3>
      <p class="esp-vide">Les horaires et les fermetures se règlent dans Site. <button type="button" class="esp-lien" data-aller="site" data-onglet="horaires">Voir les horaires</button></p></section>`;
    const chiffre = (n, mot, plus = '') => `<li${n ? plus : `${plus.replace(' class="est-alerte"', '')} class="est-zero"`}><b>${n}</b> <span>${mot}</span></li>`;
    const att = p.attentions, cuisine = vue === 'cuisine', pr = p.presence;
    return `<section class="esp-carte esp-carte--large esp-acc__service" aria-labelledby="t-prochain" data-prochain="${e(cleService(p.date, p.service))}">
      <p class="esp-acc__sur">${p.enCours ? 'Le temps fort en cours' : 'Le prochain temps fort'}</p>
      <h3 id="t-prochain">${e(p.nom)} <small>arrivées de ${heure(hhmm(servicesDe(ctx().R).find((s) => s.id === p.service).d))} à ${heure(hhmm(servicesDe(ctx().R).find((s) => s.id === p.service).f))}</small>${p.complet ? ' <span class="esp-pastille esp-pastille--a-confirmer">Complet</span>' : ''}</h3>
      <ul class="esp-acc__chiffres">
        ${chiffre(p.confirmees + p.accueillies, p.confirmees + p.accueillies > 1 ? 'réservations' : 'réservation')}
        ${chiffre(p.couvertsAttendus, p.couvertsAttendus > 1 ? 'couverts attendus' : 'couvert attendu')}
        ${cuisine ? '' : chiffre(p.placees, p.placees > 1 ? 'tables attribuées' : 'table attribuée')}
        ${cuisine ? '' : chiffre(p.demandes.length, p.demandes.length > 1 ? 'demandes pour ce service' : 'demande pour ce service', p.demandes.length ? ' class="est-alerte"' : '')}
        ${chiffre(p.grandes.length, p.grandes.length > 1 ? `grandes tablées (${GRANDE_TABLEE} couverts et plus)` : `grande tablée (${GRANDE_TABLEE} couverts et plus)`)}
        ${cuisine || !p.aPlacer.length ? '' : chiffre(p.aPlacer.length, 'sans table', ' class="est-alerte"')}
      </ul>
      ${p.date === A.iso && (pr.retards.length || pr.aInstaller.length || pr.installes.length || pr.partis.length || pr.aRemettre.length) ? `<p class="esp-acc__presence" data-acc-presence><b>En ce moment&nbsp;:</b> ${[pr.retards.length ? `<span class="est-alerte">${pr.retards.length} en retard</span>` : '', pr.aInstaller.length ? `<span class="est-alerte">${pr.aInstaller.length} à installer</span>` : '', pr.installes.length ? `${pr.installes.length} ${pr.installes.length > 1 ? 'groupes installés' : 'groupe installé'}` : '', pr.partis.length ? `${pr.partis.length} ${pr.partis.length > 1 ? 'partis' : 'parti'}` : '', pr.aRemettre.length ? `<span class="est-alerte">${pluriel(pr.aRemettre.length, 'table')} à remettre en état</span>` : '', `${pluriel(pr.tables.pretes, 'table')} ${pr.tables.pretes > 1 ? 'prêtes' : 'prête'}`].filter(Boolean).join(' · ')}</p>` : ''}
      ${!cuisine && pr.attente.length ? `<p class="esp-acc__presence">Liste d'attente&nbsp;: ${pluriel(pr.attente.length, 'demande')}${pr.attenteCompatibles.length ? `, <span class="est-alerte">${pr.attenteCompatibles.length} à qui une place peut être proposée</span>` : ''}. <button type="button" class="esp-lien" data-aller="resas" data-onglet-resas="attente">Ouvrir</button></p>` : ''}
      ${att.length ? `<p class="esp-acc__savoir"><b>À savoir&nbsp;:</b> ${att.slice(0, cuisine ? 8 : 3).map((r) => `${e(r.nom || 'Sans nom')} (${e(typo([r.allergies.length ? `allergie : ${r.allergies.join(', ')}` : '', r.demande, r.noteClient].filter(Boolean).join(' ; ')))})`).join(' · ')}${att.length > (cuisine ? 8 : 3) ? ` · et ${att.length - (cuisine ? 8 : 3)} de plus dans le briefing` : ''}</p>` : ''}
      <p class="esp-aide esp-acc__reserve" data-acc-allergies>${e(p.allergies.phrase)}</p>
      ${p.autour.length ? `<div class="esp-acc__autour" data-acc-autour><p class="esp-acc__autour-titre">Aussi ${p.date === A.iso ? 'aujourd\'hui' : 'ce jour-là'}&nbsp;: réceptions, soirées et retraits</p>
        <ul>${p.autour.slice(0, 5).map((x) => `<li><span class="esp-fil__type">${e(x.libelleType)}</span> <b>${e(x.titre)}</b> <span class="esp-acc__engagement">${e(x.engagement)}</span> <button type="button" class="esp-lien" data-autour="${e(x.cle)}" aria-label="Ouvrir : ${e(x.titre)}">Ouvrir</button></li>`).join('')}</ul>
        ${p.autour.length > 5 ? `<p class="esp-aide">Et ${pluriel(p.autour.length - 5, 'autre ligne')} dans le fil de la journée.</p>` : ''}</div>` : `<p class="esp-aide esp-acc__reserve" data-acc-autour="vide">Ni réception, ni soirée, ni retrait de commande ${p.date === A.iso ? 'aujourd\'hui' : 'ce jour-là'}.</p>`}
      <p class="esp-acc__actions"><button type="button" class="bouton" data-briefing="${e(cleService(p.date, p.service))}">Préparer le service</button>
        <button type="button" class="esp-bouton" data-aller-service="${e(cleService(p.date, p.service))}" data-onglet-service="${vue === 'salle' ? 'salle' : 'service'}">${vue === 'salle' ? 'Ouvrir la salle' : 'Voir le service'}</button></p>
    </section>`;
  }

  /* ---------- Zone B : les priorités, puis les demandes qui attendent ---------- */
  function zonePriorites(a, vue) {
    /* Les demandes en attente sont listées juste dessous, la plus ancienne d'abord : seule leur carte d'ensemble est une priorité. */
    const { ligneResa } = X, att = X.enAttente(), autres = [...X.demandesEnAttente()].sort((x, y) => String(x.cree).localeCompare(String(y.cree))), total = att.length + autres.length;
    const DEMANDES = ['table', 'reception', 'traiteur', 'cadeau', 'question'];
    const l = a.priorites.filter((c) => (PRIO[vue] ? PRIO[vue].includes(c.genre) : !DEMANDES.includes(c.genre))), vus = etat.prioToutes ? l : l.slice(0, 4);
    const carte = (c) => `<li class="esp-conseil" data-conseil="${e(c.id)}" data-prio-genre="${e(c.genre)}"><div class="esp-conseil__texte"><p class="esp-conseil__titre">${e(typo(c.titre))}</p><p class="esp-conseil__detail">${e(typo(c.raison))}</p>
          ${c.concerne ? `<p class="esp-conseil__concerne" data-prio-concerne><span>Concerne</span> ${e(typo(c.concerne))}</p>` : ''}</div>
        <p class="esp-conseil__actions"><button type="button" class="esp-bouton esp-bouton--ok" ${c.directe ? `data-faire-priorite="${e(c.id)}"` : `data-faire-conseil="${e(c.id)}"`}>${e(c.bouton)}</button><button type="button" class="esp-bouton esp-bouton--discret" data-taire-conseil="${e(c.id)}" aria-label="Plus tard : ${e(c.titre)}">Plus tard</button></p></li>`;
    const prio = vus.length ? `<ol class="esp-conseils__liste esp-prio" data-prio-liste>${vus.map(carte).join('')}</ol>
        ${l.length > 4 ? `<p class="esp-plus esp-conseils__reste"><button type="button" class="esp-lien" data-prio-toutes aria-expanded="${etat.prioToutes}">${etat.prioToutes ? 'Ne garder que les quatre premières' : `Voir les ${l.length - 4 > 1 ? `${l.length - 4} autres priorités` : 'la priorité suivante'}`.replace('Voir les la', 'Voir la')}</button></p>` : ''}
        <p class="esp-aide esp-prio__aide">Une priorité disparaît quand la situation est réglée, pas quand on l'ouvre. « Plus tard » la met de côté jusqu'à demain.</p>` : '';
    const demandes = vue === 'salle' || vue === 'cuisine' ? '' : `<div class="esp-acc__attente"><h4 id="t-attente">Les demandes qui attendent une réponse${total ? ` <span class="esp-acc__compte">${total}</span>` : ''}</h4>
        ${total ? `${att.length ? `<ul class="esp-resas">${att.slice(0, 4).map((r) => ligneResa(r, true)).join('')}</ul>` : ''}${autres.length ? `<ul class="esp-dems">${autres.slice(0, 4).map((d) => X.carteDemande(d)).join('')}</ul>` : ''}`
          : '<p class="esp-vide esp-vide--fete"><span class="esp-vide__sceau" aria-hidden="true"></span><span><b>Tout a une réponse.</b> Les prochaines demandes faites sur le site arriveront ici.</span></p>'}
        <p class="esp-plus"><button type="button" class="esp-lien" data-aller="demandes">${total > Math.min(att.length, 4) + Math.min(autres.length, 4) ? `Voir les ${total} demandes` : 'Ouvrir les demandes'}</button></p></div>`;
    const vide = vue === 'cuisine' ? 'Rien ne presse en cuisine : aucune commande à préparer ou à compléter, aucune tâche à échéance.' : vue === 'salle' ? 'Rien ne presse en salle pour l\'instant.' : 'Rien ne presse pour l\'instant. Ce qui demandera une décision apparaîtra ici.';
    return `<section class="esp-carte esp-carte--large esp-conseils esp-acc__priorites" aria-labelledby="t-priorites" data-prio-total="${l.length}"><h3 id="t-priorites">Les priorités${l.length ? ` <span class="esp-acc__compte">${l.length}</span>` : ''}</h3>
      ${prio || `<p class="esp-vide" data-prio-vide>${vide}</p>`}${demandes}</section>`;
  }

  /* ---------- Zone C : le fil de la journée ---------- */
  function zoneFil(a, vue) {
    const l = a.fil.filter((x) => vue !== 'cuisine' || x.type !== 'reception' || x.ferme).filter((x) => vue !== 'salle' || x.type !== 'retrait');
    return `<section class="esp-carte esp-acc__fil" aria-labelledby="t-fil"><h3 id="t-fil">Le fil de la journée</h3>
      ${l.length ? `<ol class="esp-fil">${l.map((x) => `<li class="esp-fil__item est-${x.type}${x.ferme ? '' : ' est-demande'}">
          <span class="esp-fil__heure">${x.heureConnue ? heure(x.heure) : (x.detail && /midi|soir/i.test(x.detail) ? e(x.detail.replace(/^(À|Le) /, '')) : 'Dans la journée')}</span>
          <span class="esp-fil__quoi"><span class="esp-fil__type">${e(x.libelleType)}</span><b>${e(x.titre)}</b>${x.detail && x.heureConnue ? `<small>${e(typo(x.detail))}</small>` : x.detail && !/^(À midi|Le soir)$/.test(x.detail) ? `<small>${e(typo(x.detail))}</small>` : ''}
            ${x.engagement && x.type !== 'service' ? `<small class="esp-fil__engagement" data-fil-engagement>${e(typo(x.engagement))}</small>` : ''}</span>
          ${x.statut ? `<span class="esp-pastille${x.ferme ? '' : ' esp-pastille--a-confirmer'}">${e(x.statut)}</span>` : ''}
          <button type="button" class="esp-lien" data-fil="${e(x.cle)}" aria-label="Ouvrir : ${e(x.titre)}">Ouvrir</button></li>`).join('')}</ol>`
        : `<p class="esp-vide">Journée calme&nbsp;: pas de service ni d'activité datée aujourd'hui.</p>
           <p class="esp-plus"><button type="button" class="esp-lien" data-aller="resas">Ouvrir l'agenda</button> <button type="button" class="esp-lien" data-aller="carte">Modifier la carte</button> <button type="button" class="esp-lien" data-tache-nouvelle>Ajouter une tâche</button></p>`}
      ${l.length ? '<p class="esp-plus"><button type="button" class="esp-lien" data-aller="resas">Ouvrir l\'agenda</button> <button type="button" class="esp-lien" data-bilan-ouvrir="jour">Voir le bilan du jour</button></p><p class="esp-aide esp-fil__legende">Une demande n\'engage rien ; une option retient des espaces jusqu\'à son échéance ; une réception confirmée et une commande validée sont fermes.</p>' : ''}</section>`;
  }

  /* ---------- Zone D : les tâches ---------- */
  function formulaireTache(t) {
    const lien = t ? t.lien : etat.tacheLien, id = t ? t.id : 'nouvelle';
    return `<form class="esp-tache-form" data-form-tache="${e(id)}" aria-label="${t ? `Modifier la tâche : ${e(t.titre)}` : 'Nouvelle tâche'}">
      <p class="esp-champ esp-champ--large"><label for="tache-titre-${e(id)}">Ce qu'il y a à faire</label><input id="tache-titre-${e(id)}" name="titre" required maxlength="140" autocomplete="off" value="${e(t ? t.titre : etat.tacheLien?.titre || '')}" placeholder="Rappeler le fleuriste, vérifier la terrasse…"></p>
      <p class="esp-champ"><label for="tache-ech-${e(id)}">Pour le <small>facultatif</small></label><input id="tache-ech-${e(id)}" name="echeance" type="date" value="${e(t ? t.echeance || '' : etat.tacheLien?.echeance || '')}"></p>
      <p class="esp-champ"><label for="tache-qui-${e(id)}">Qui s'en occupe <small>facultatif</small></label><input id="tache-qui-${e(id)}" name="responsable" maxlength="40" autocomplete="off" value="${e(t?.responsable || '')}" placeholder="Un prénom"></p>
      ${lien ? `<p class="esp-tache-form__lien">Liée à&nbsp;: <b>${e(TYPE_LIEN[lien.type] || '')}</b> ${e(lien.libelle)}</p>` : ''}
      <p class="esp-tache-form__actions"><button type="submit" class="bouton">${t ? 'Enregistrer' : 'Ajouter la tâche'}</button><button type="button" class="esp-bouton esp-bouton--discret" data-tache-fermer>Fermer</button>${t ? `<button type="button" class="esp-bouton esp-bouton--discret esp-tache-form__suppr" data-tache-supprimer="${e(t.id)}">Supprimer</button>` : ''}</p>
    </form>`;
  }
  const ligneTache = (t) => (etat.tacheEditee === t.id ? `<li class="esp-tache est-edition" data-tache="${e(t.id)}">${formulaireTache(t)}</li>`
    : `<li class="esp-tache est-${t.etat}" data-tache="${e(t.id)}">
      <button type="button" class="esp-tache__coche" role="checkbox" aria-checked="${t.fait}" data-tache-fait="${e(t.id)}" aria-label="${t.fait ? 'Rouvrir' : 'Terminer'} : ${e(t.titre)}"><span aria-hidden="true"></span></button>
      <div class="esp-tache__texte"><p class="esp-tache__titre">${e(t.titre)}</p>
        <p class="esp-tache__meta">${[ETAT_TACHE[t.etat] ? `<span class="esp-pastille${t.etat === 'retard' ? ' esp-pastille--a-confirmer' : ''}">${ETAT_TACHE[t.etat]}</span>` : '', t.echeance && t.etat !== 'jour' ? `pour ${e(dateCourte(t.echeance))}` : '', t.responsable ? e(t.responsable) : '',
          t.lien ? `<button type="button" class="esp-lien" data-tache-lien="${e(t.id)}">${e(TYPE_LIEN[t.lien.type] || 'Voir')} : ${e(t.lien.libelle)}</button>` : ''].filter(Boolean).join(' <span aria-hidden="true">·</span> ')}</p></div>
      <button type="button" class="esp-lien esp-tache__modifier" data-tache-modifier="${e(t.id)}" aria-label="Modifier : ${e(t.titre)}">Modifier</button></li>`);
  function zoneTaches(a) {
    const l = a.taches, aFaire = l.filter((t) => !t.fait).length;
    return `<section class="esp-carte esp-acc__taches" aria-labelledby="t-taches"><h3 id="t-taches">Les tâches${aFaire ? ` <span class="esp-acc__compte">${aFaire}</span>` : ''} <span class="esp-source">Sur cet appareil</span></h3>
      ${l.length ? `<ul class="esp-taches">${l.map(ligneTache).join('')}</ul>` : etat.tacheEditee === 'nouvelle' ? '' : '<p class="esp-vide">Aucune tâche. Notez ici ce qu\'il ne faut pas oublier avant le service.</p>'}
      ${etat.tacheEditee === 'nouvelle' ? formulaireTache(null) : '<p class="esp-plus"><button type="button" class="esp-bouton" data-tache-nouvelle>Ajouter une tâche</button></p>'}
      ${connecte() ? '<p class="esp-aide">Les tâches ne sont pas encore partagées entre vos appareils : elles restent sur celui-ci.</p>' : ''}</section>`;
  }

  function zoneSite() {
    const s = S(), ouv = (sv) => X.ouv(A.iso, sv), ouverts = ['midi', 'soir'].filter(ouv);
    return `<article class="esp-carte esp-acc__site" aria-labelledby="t-site"><h3 id="t-site">Sur le site en ce moment</h3>
      <ul class="esp-etat">
        <li><span class="esp-etat__point${s.annonce?.active ? ' est-on' : ''}"></span>${s.annonce?.active ? `Annonce affichée : « ${e(s.annonce.texte)} »` : 'Pas d\'annonce affichée'}</li>
        <li><span class="esp-etat__point${ouverts.length ? ' est-on' : ''}"></span>${ouverts.length ? `Ouvert aujourd'hui : ${ouverts.join(' et ')}` : 'Fermé aujourd\'hui'}</li>
        <li><span class="esp-etat__point${X.siteVide() ? '' : ' est-on'}"></span>${X.siteVide() ? 'Le site est tel que livré' : 'Vos modifications sont visibles sur le site (dans ce navigateur)'}</li>
      </ul>
      <p class="esp-plus"><button type="button" class="esp-lien" data-aller="site" data-onglet="horaires">Annonce et horaires</button> <button type="button" class="esp-lien" data-aller="carte">Modifier la carte</button></p></article>`;
  }

  function rendre() {
    const a = accueil(C(), S(), D.salle, A.min), vue = connecte() ? 'direction' : etat.vueMetier, nbDem = X.enAttenteTotal();
    const p = a.prochain, intro = p ? `${p.nom.toLowerCase().replace(/^./, (c) => c.toUpperCase())} : ${pluriel(p.confirmees + p.accueillies, 'réservation')}, ${pluriel(p.couvertsAttendus, 'couvert')} ${p.couvertsAttendus > 1 ? 'attendus' : 'attendu'}` : 'Pas de service à venir';
    const etroit = typeof matchMedia === 'function' && matchMedia('(max-width: 640px)').matches;
    const zones = { service: () => zoneService(p, vue), priorites: () => zonePriorites(a, vue), fil: () => zoneFil(a, vue), taches: () => zoneTaches(a), site: () => zoneSite(), commerce: () => X.aujourdhuiCommerce?.({ sansDemandes: vue === 'direction' || vue === 'accueil', production: vue === 'cuisine' }) || '' };
    const raccourci = ([cle, nom]) => (cle === 'bilan' ? `<button type="button" class="esp-bouton" data-bilan-ouvrir="semaine">${nom}</button>` : cle === 'demandes' ? `<button type="button" class="esp-bouton" data-aller="demandes">${nom}${nbDem ? ` <span class="esp-filtre__n" aria-label="${nbDem} à traiter">${nbDem}</span>` : ''}</button>`
      : cle === 'assistant' ? `<button type="button" class="esp-bouton esp-bouton--discret" data-esp-quoi>${nom}</button>` : cle === 'retraits' ? `<button type="button" class="esp-bouton" data-com-ouvrir="preparation">${nom}</button>` : cle === 'carte' ? `<button type="button" class="esp-bouton" data-aller="carte" data-onglet-carte="carte">${nom}</button>`
      : !p ? '' : cle === 'briefing' ? `<button type="button" class="esp-bouton" data-briefing="${e(cleService(p.date, p.service))}">${nom}</button>` : `<button type="button" class="esp-bouton" data-aller-service="${e(cleService(p.date, p.service))}" data-onglet-service="${cle === 'salle' ? 'salle' : 'service'}">${nom}</button>`);
    /* typo() : les espaces insécables de la typographie française, sur tout ce que la rubrique écrit. */
    X.corps('jour').innerHTML = typo(`
      <p class="esp-bonjour">${e(maj(fmt(A.iso)))}. ${e(intro)}${nbDem ? `, ${pluriel(nbDem, 'demande')} à traiter, toutes activités confondues` : ''}.</p>
      ${connecte() ? '' : `<div class="esp-metier esp-metier--ordi" role="group" aria-labelledby="t-metier"><p class="esp-metier__titre" id="t-metier">Voir comme <span class="esp-source">Présentation</span></p>
        <p class="esp-metier__choix">${VUES_METIER.map(([id, nom]) => `<button type="button" class="esp-metier__bouton" data-vue-metier="${id}" aria-pressed="${id === vue}">${nom}</button>`).join('')}</p>
        <p class="esp-metier__aide">${e(VUES_METIER.find(([id]) => id === vue)[2])} Mêmes données et mêmes règles pour tous : ce choix change l'ordre, les raccourcis et le détail, pas les droits.</p></div>
      <details class="esp-metier-tel" data-metier-tel><summary><span>Voir comme&nbsp;: <b>${VUES_METIER.find(([id]) => id === vue)[1]}</b></span></summary>
        <p class="esp-metier__choix" role="group" aria-label="Voir comme">${VUES_METIER.map(([id, nom]) => `<button type="button" class="esp-metier__bouton" data-vue-metier="${id}" aria-pressed="${id === vue}">${nom}</button>`).join('')}</p>
        <p class="esp-metier__aide">${e(VUES_METIER.find(([id]) => id === vue)[2])} Mêmes données et mêmes règles pour tous : ce choix change l'ordre, les raccourcis et le détail, pas les droits. <span class="esp-source">Présentation</span></p></details>`}
      <div class="esp-acc esp-acc--${vue}" data-vue-active="${vue}">${(() => { const blocs = ORDRE[vue].map((z) => zones[z]()).filter(Boolean);
        const raccourcis = `<p class="esp-acc__raccourcis" data-raccourcis="${vue}" role="group" aria-label="Raccourcis de la vue ${e(VUES_METIER.find(([id]) => id === vue)[1])}">${RACCOURCIS[vue].map(raccourci).join('')}</p>`;
        /* Sur un écran étroit, le premier bloc (le temps fort, ou les priorités) reste en haut : les raccourcis viennent juste après. */
        return etroit ? [blocs[0], raccourcis, ...blocs.slice(1)].join('') : [raccourcis, ...blocs].join(''); })()}</div>`);
    if (etat.tacheEditee) $(`[data-form-tache] [name="titre"]`, X.corps('jour'))?.focus({ preventScroll: true });
  }

  /* ---------- Le briefing d'un service ---------- */
  let fen = null, retour = null;
  function contenuBriefing() {
    const [iso, sv] = etat.briefing.split('|'), r = resumeService(C(), S(), D.salle, iso, sv), pr = r.presence, nom = nomService(C(), iso, sv), fil = filDuJour(C(), S(), iso).filter((x) => !['service', 'retrait', 'tache'].includes(x.type));   /* les retraits et les tâches ont leur propre bloc */
    const services = servicesDe(ctx().R), libre = tachesDuJour(S(), A.iso).filter((t) => !t.fait && !t.lien && (!t.echeance || t.echeance <= iso)), vue = X.vueMetier();
    /* Les commandes à retirer sur ce créneau (validées, en préparation, prêtes) ; celles du jour qui attendent une décision ou un complément sont « à résoudre ». */
    const cmdJour = commandesCommerce(X.demandes(), S(), ctx().lieux).filter((c) => c.jour === iso), duCreneau = cmdJour.filter((c) => !c.moment || c.moment === sv);
    const tr = { commandes: duCreneau.filter((c) => ['validee', 'preparation', 'prete'].includes(c.etat)), produits: preparationCommerce(S(), { jour: iso, moment: sv }).produits.filter((x) => x.aRemettre > 0),
      aResoudre: [...duCreneau.filter((c) => c.etat === 'recue').map((c) => ({ id: c.id, ref: c.ref, qui: nomClient(c.client), quoi: `— commande à décider (retrait ${momentTexte(c.moment)})` })), ...duCreneau.filter((c) => manqueDe(c).length).map((c) => ({ id: c.id, ref: c.ref, qui: nomClient(c.client), quoi: `— production à compléter : ${manqueDe(c).map((x) => `${x.nom}, ${quantite(x.quantite, x.unite)}`).join(' ; ')}` }))] };
    const taches = [...r.taches, ...libre.filter((t) => !r.taches.some((x) => x.id === t.id))];
    const ligne = (x, plus = '') => `<li><button type="button" class="esp-lien" data-brief-resa="${e(x.id)}">${heure(x.heure)} · ${e(x.nom || 'Sans nom')}</button> <span>${pluriel(+x.couverts, 'couvert')}${x.table ? ` · ${e(nomPlace(x.table))}` : ''}${plus}</span></li>`;
    const bloc = (titre, corps, vide) => `<section class="esp-brief__bloc"><h3>${titre}</h3>${corps || `<p class="esp-brief__vide">${vide}</p>`}</section>`;
    return `<header class="esp-modale__tete"><h2 id="brief-titre">Préparer le service</h2><button type="button" class="esp-rond" data-fermer-brief aria-label="Fermer">×</button></header>
      <div class="esp-brief" data-brief="${e(etat.briefing)}" data-brief-vue="${e(vue)}">
        <p class="esp-brief__vue">Briefing présenté pour la vue <b>${e(VUES_METIER.find(([id]) => id === vue)[1])}</b> : mêmes informations, autre ordre.</p>
        <div class="esp-brief__quand"><button type="button" class="esp-rond" data-brief-jour="-1" aria-label="Jour précédent"><span aria-hidden="true">‹</span></button>
          <p><b>${e(maj(fmt(iso)))}</b> ${services.map((s) => `<button type="button" class="esp-brief__sv" data-brief-sv="${s.id}" aria-pressed="${s.id === sv}">${s.libelle}</button>`).join('')}</p>
          <button type="button" class="esp-rond" data-brief-jour="1" aria-label="Jour suivant"><span aria-hidden="true">›</span></button></div>
        ${!r.ouvert && !r.resas.length ? `<p class="esp-vide">${e(nom)} : pas de service. Choisissez un autre jour ou l'autre service.</p>` : `
        <ul class="esp-acc__chiffres esp-brief__chiffres"><li><b>${r.confirmees + r.accueillies}</b> <span>${r.confirmees + r.accueillies > 1 ? 'réservations' : 'réservation'}</span></li><li><b>${r.couvertsAttendus}</b> <span>${r.couvertsAttendus > 1 ? 'couverts attendus' : 'couvert attendu'}</span></li>
          ${r.accueillies ? `<li><b>${r.couvertsAccueillis}</b> <span>déjà accueillis</span></li>` : ''}<li><b>${r.placees}</b> <span>${r.placees > 1 ? 'tables attribuées' : 'table attribuée'}</span></li><li><b>${r.demandes.length}</b> <span>${r.demandes.length > 1 ? 'demandes pour ce service' : 'demande pour ce service'}</span></li>${r.pic?.couverts ? `<li><b>${heure(hhmm(r.pic.t))}</b> <span>le plus chargé (${r.pic.couverts} à table)</span></li>` : ''}</ul>
        ${(() => { const B = {
          ou: () => iso === A.iso && (pr.retards.length || pr.aInstaller.length || pr.installes.length || pr.partis.length || pr.aRemettre.length) ? bloc('Où en est le service', `<ul class="esp-brief__liste">${[
...pr.retards.map((x) => ligne(x, ` — en retard de ${x.retard} min${x.retardAnnonce ? ` (retard annoncé : ${x.retardAnnonce} min)` : ''}`)),
...pr.aInstaller.map((x) => ligne(x, ` — arrivé, à installer${x.presents ? ` (${x.presents} présents sur ${+x.couverts})` : ''}`)),
...pr.installes.map((x) => ligne(x, ' — installé')), ...pr.partis.map((x) => ligne(x, ' — parti')),
...pr.aRemettre.map((t) => `<li><b>Table ${e(t.id)}</b> <span>${e(ETATS_TABLE[t.etat].toLowerCase())}</span></li>`)].join('')}</ul>`, '') : '',
          grandes: () => bloc(`Les grandes tablées <small>${GRANDE_TABLEE} couverts et plus</small>`, r.grandes.length ? `<ul class="esp-brief__liste">${r.grandes.map((x) => ligne(x)).join('')}</ul>` : '', 'Aucune pour ce service.'),
          attentions: () => bloc('Occasions, allergies et demandes particulières', r.attentions.length ? `<ul class="esp-brief__liste">${r.attentions.map((x) => ligne(x, ` — ${e(typo([x.allergies.length ? `allergie : ${x.allergies.join(', ')}` : '', x.demande, x.noteClient].filter(Boolean).join(' ; ')))}`)).join('')}</ul><p class="esp-brief__reserve">Seules les allergies signalées figurent ici. Sans mention, on ne sait pas : ce n'est pas « aucune allergie ».</p>` : '', 'Rien de signalé sur les réservations de ce service. Sans mention, on ne sait pas : ce n\'est pas « aucune allergie ».'),
          reste: () => bloc('Ce qui reste à traiter', r.demandes.length || r.aPlacer.length || tr.aResoudre.length ? `<ul class="esp-brief__liste">${r.demandes.map((x) => ligne(x, ' — demande à confirmer ou refuser')).join('')}${r.aPlacer.map((x) => ligne(x, ' — pas encore de table')).join('')}${tr.aResoudre.map((x) => `<li><button type="button" class="esp-lien" data-brief-commande="${e(x.id)}">${e(x.ref)} · ${e(x.qui)}</button> <span>${e(x.quoi)}</span></li>`).join('')}</ul>` : '', 'Toutes les demandes ont une réponse, chaque réservation a sa table et aucune commande du jour n\'attend de décision.'),
          rapprocher: () => pr.assemblages.length ? bloc('Tables à rapprocher', `<ul class="esp-brief__liste">${pr.assemblages.map((a) => `<li><b>Tables ${e(a.id.split('+').join(' et '))}</b> <span>${a.places} places — ${a.resas.map((x) => `${heure(x.heure)} ${e(x.nom || 'Sans nom')} (${+x.couverts})`).join(', ')}</span></li>`).join('')}</ul>`, '') : '',
          indispo: () => pr.tables.indisponibles ? bloc('Tables indisponibles', `<p>${pluriel(pr.tables.indisponibles, 'table')} ${pr.tables.indisponibles > 1 ? 'indisponibles' : 'indisponible'} pour ce service. <button type="button" class="esp-lien" data-brief-ouvrir="salle">Voir le plan de salle</button></p>`, '') : '',
          attente: () => pr.attente.length ? bloc('Liste d\'attente', `<ul class="esp-brief__liste">${pr.attente.map((x) => `<li><b>${e(x.nom)}</b> <span>${pluriel(x.couverts, 'personne')}${x.heure ? `, vers ${heure(x.heure)}` : ''} — ${e(ETATS_ATTENTE[x.etat].toLowerCase())}${pr.attenteCompatibles.some((c) => c.id === x.id) ? ' : une place peut être proposée' : ''}</span></li>`).join('')}</ul><p class="esp-brief__reserve">Une inscription en liste d'attente n'est pas une réservation : ces personnes ne sont pas comptées dans les couverts.</p>`, '') : '',
          installations: () => bloc('Installations à prévoir', r.placees ? `<p>${pluriel(r.placees, 'réservation')} ${r.placees > 1 ? 'ont' : 'a'} déjà ${r.placees > 1 ? 'leur' : 'sa'} table. <button type="button" class="esp-lien" data-brief-ouvrir="salle">Voir le plan de salle</button></p>` : '', 'Aucune table n\'est encore attribuée pour ce service.'),
          autour: () => fil.length ? bloc('Aussi ce jour-là', `<ul class="esp-brief__liste">${fil.map((x) => `<li><b>${e(x.libelleType)}</b> ${e(x.titre)} <span>${e([x.engagement, x.statut].filter(Boolean).join(' · '))}</span></li>`).join('')}</ul>`, '') : '',
          /* v7.15.0 : les préparations traiteur et les retraits du créneau, relus dans les commandes (jamais une liste à part). */
          traiteur: () => (tr.commandes.length || tr.produits.length ? bloc(`Préparations et retraits <small>${sv === 'midi' ? 'à midi' : 'le soir'}</small>`, `${tr.produits.length ? `<ul class="esp-brief__liste" data-brief-production>${tr.produits.map((x) => `<li><b>${e(x.nom)}</b> <span>à remettre ${e(quantite(x.aRemettre, x.unite))}${x.aPreparer > 0 ? ` — reste à préparer ${e(quantite(x.aPreparer, x.unite))}` : ' — tout est préparé'}${x.capacite != null ? ` (déjà engagé en production : ${e(quantite(x.engage, x.unite))} ; capacité du jour : ${e(quantite(x.capacite, x.unite))})` : ''}</span></li>`).join('')}</ul>` : ''}
              <ul class="esp-brief__liste" data-brief-retraits>${tr.commandes.map((c) => `<li><button type="button" class="esp-lien" data-brief-commande="${e(c.id)}">${e(c.ref)} · ${e(nomClient(c.client))}</button> <span>${e(ETATS_COMMANDE[c.etat].toLowerCase())}${manqueDe(c).length ? ' — il manque de la production' : ''} — ${e(c.lignes.map((l) => `${l.nom}, ${quantite(l.quantite, l.unite)}`).join(' ; '))}</span></li>`).join('')}</ul>
              <p class="esp-brief__reserve">Une commande ne prend aucune table ni aucun couvert : elle est comptée à part des réservations.${connecte() ? ' Les commandes sont suivies sur cet appareil.' : ''}</p>`, '')
            : vue === 'cuisine' || vue === 'accueil' ? bloc(`Préparations et retraits <small>${sv === 'midi' ? 'à midi' : 'le soir'}</small>`, '', 'Aucune commande à retirer sur ce créneau.') : ''),
          taches: () => bloc('Les tâches', taches.length ? `<ul class="esp-brief__liste esp-brief__taches">${taches.map((t) => `<li class="${t.fait ? 'est-faite' : ''}"><span class="esp-brief__case" aria-hidden="true">${t.fait ? '✓' : ''}</span>${e(t.titre)}${t.responsable ? ` <span>(${e(t.responsable)})</span>` : ''}</li>`).join('')}</ul>` : '', 'Aucune tâche pour ce service.') };
          return (BRIEF[vue] || BRIEF.direction).map((k) => B[k]()).join(''); })()}`}
        <p class="esp-brief__actions"><button type="button" class="bouton" data-brief-imprimer>Imprimer le briefing</button><button type="button" class="esp-bouton" data-brief-tache>Ajouter une tâche pour ce service</button>
          <button type="button" class="esp-bouton" data-brief-ouvrir="service">Ouvrir le service</button></p>
      </div>`;
  }
  function ouvrirBriefing(cle, depuis) {
    etat.briefing = cle; retour = depuis || document.activeElement;
    if (!fen) {
      fen = document.createElement('div'); fen.className = 'esp-modale esp-modale--brief'; fen.hidden = true;
      fen.innerHTML = '<div class="esp-modale__fond" data-fermer-brief></div><div class="esp-modale__boite" role="dialog" aria-modal="true" aria-labelledby="brief-titre" data-brief-boite></div>';
      root.append(fen);
      fen.addEventListener('click', (ev) => { const t = ev.target; let [iso, sv] = (etat.briefing || '|').split('|');
        if (t.closest('[data-fermer-brief]')) { fermerBriefing(); return; }
        const j = t.closest('[data-brief-jour]'), s = t.closest('[data-brief-sv]'), o = t.closest('[data-brief-ouvrir]'), rr = t.closest('[data-brief-resa]'), bc = t.closest('[data-brief-commande]');
        if (bc) { fermerBriefing(false); X.executer({ aller: { commande: bc.dataset.briefCommande } }); return; }
        if (j) { iso = ajouter(iso, +j.dataset.briefJour); etat.briefing = cleService(iso, sv); dessiner(`[data-brief-jour="${j.dataset.briefJour}"]`); return; }
        if (s) { etat.briefing = cleService(iso, s.dataset.briefSv); dessiner(`[data-brief-sv="${s.dataset.briefSv}"]`); return; }
        if (o || rr) { fermerBriefing(false); etat.jour = iso; etat.serviceVu = sv; etat.ongletResas = o ? o.dataset.briefOuvrir : 'service'; etat.resaEditee = null; X.allerVue('resas'); if (rr) X.viser($(`[data-esp-panneau-resas] [data-resa="${CSS.escape(rr.dataset.briefResa)}"]`, root), 'center'); return; }
        if (t.closest('[data-brief-imprimer]')) { imprimer(); return; }
        if (t.closest('[data-brief-tache]')) { fermerBriefing(false); nouvelleDepuis({ type: 'service', id: etat.briefing, libelle: nomService(C(), iso, sv), echeance: iso }); }
      });
      document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && fen && !fen.hidden) { ev.stopPropagation(); fermerBriefing(); } }, true);
    }
    fen.hidden = false; document.documentElement.classList.add('esp-modale-ouverte'); dessiner('[data-fermer-brief]');
  }
  function dessiner(focus) { const b = $('[data-brief-boite]', fen); b.innerHTML = typo(contenuBriefing()); (focus && $(focus, b) || $('[data-fermer-brief]', b))?.focus({ preventScroll: true }); }
  function fermerBriefing(rendreFocus = true) { if (!fen || fen.hidden) return; fen.hidden = true; etat.briefing = null; document.documentElement.classList.remove('esp-modale-ouverte'); if (rendreFocus) (retour?.isConnected ? retour : $('[data-briefing]', root))?.focus?.({ preventScroll: true }); }
  /** Le briefing imprimé : le même contenu, sans boutons, sur autant de pages qu'il faut (le texte ne rétrécit jamais). */
  function imprimer() {
    document.querySelector('.esp-feuille')?.remove();
    const [iso, sv] = etat.briefing.split('|'), f = document.createElement('div'); f.className = 'esp-feuille esp-feuille--brief';
    const src = $('.esp-brief', fen).cloneNode(true); for (const x of src.querySelectorAll('.esp-brief__quand, .esp-brief__actions, .esp-brief__vue, button.esp-rond')) x.remove();
    for (const b of src.querySelectorAll('button')) { const s = document.createElement('span'); s.textContent = b.textContent; b.replaceWith(s); }
    f.innerHTML = `<header><p class="esp-feuille__maison">Les Jardins de l'Hacienda</p><h1>Briefing du service</h1><p class="esp-feuille__quand">${e(maj(fmt(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })))}, ${sv === 'midi' ? 'midi' : 'soir'}</p></header>`;
    f.append(src); f.insertAdjacentHTML('beforeend', `<footer>Imprimé depuis l'espace, vue ${e(VUES_METIER.find(([id]) => id === X.vueMetier())[1])}. Les allergies non signalées ne sont pas connues.</footer>`); document.body.append(f); document.documentElement.classList.add('esp-impression');
    const fin = () => { document.documentElement.classList.remove('esp-impression'); f.remove(); removeEventListener('afterprint', fin); };
    addEventListener('afterprint', fin);
    try { print(); } catch { fin(); dire('L\'impression n\'a pas pu démarrer sur ce navigateur.'); }
  }

  /* ---------- Les gestes ---------- */
  const idTache = () => `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  /** Ouvre le formulaire d'une nouvelle tâche dans « Aujourd'hui », déjà liée à un objet (une demande, un service…). */
  function nouvelleDepuis(lien) { etat.tacheLien = lien || null; etat.tacheEditee = 'nouvelle'; X.allerVue('jour'); X.viser($('#t-taches', root)?.closest('.esp-carte')); $('[data-form-tache] [name="titre"]', root)?.focus({ preventScroll: true }); }
  function ouvrirLien(l) {
    if (l.type === 'demande') X.executer({ aller: { vue: 'demandes', filtre: 'tout', demande: l.id } });
    else if (l.type === 'service') { const [iso, sv] = l.id.split('|'); X.executer({ aller: { vue: 'resas', onglet: 'service', jour: iso, service: sv } }); }
    else if (l.type === 'resa') { const r = X.trouverResa(l.id); if (r) X.executer({ aller: { vue: 'resas', onglet: 'service', jour: r.date, service: r.service, resa: r.id } }); else dire('Cette réservation n\'est plus dans l\'agenda.'); }
    else if (l.type === 'client') X.executer({ aller: { vue: 'clients', client: l.id } });
    else if (l.type === 'reception') X.executer({ aller: { dossier: l.id, onglet: 'jourj' } });
  }
  function clic(t) {
    const b = t.closest('[data-briefing]'); if (b) { ouvrirBriefing(b.dataset.briefing, b); return true; }
    const sv = t.closest('[data-aller-service]'); if (sv) { const [iso, s] = sv.dataset.allerService.split('|'); X.executer({ aller: { vue: 'resas', onglet: sv.dataset.ongletService || 'service', jour: iso, service: s } }); return true; }
    const m = t.closest('[data-vue-metier]'); if (m) { etat.vueMetier = m.dataset.vueMetier; try { sessionStorage.setItem('jh-espace-vue-metier', etat.vueMetier); } catch { /* rien */ } X.rendre(); $(`[data-vue-metier="${etat.vueMetier}"]`, root)?.focus({ preventScroll: true }); return true; }
    const p = t.closest('[data-faire-priorite]'); if (p) { const c = accueil(C(), S(), D.salle, A.min).priorites.find((x) => x.id === p.dataset.fairePriorite); if (c) X.executer({ action: c.action, aller: c.aller }); return true; }
    if (t.closest('[data-prio-toutes]')) { etat.prioToutes = !etat.prioToutes; X.rendre(); $('[data-prio-toutes]', root)?.focus({ preventScroll: true }); return true; }
    const au = t.closest('[data-autour]'); if (au) { const pr = accueil(C(), S(), D.salle, A.min).prochain, x = pr?.autour.find((y) => y.cle === au.dataset.autour); if (x) X.executer({ aller: x.aller }); return true; }
    const f = t.closest('[data-fil]'); if (f) { const x = filDuJour(C(), S(), A.iso, A.min).find((y) => y.cle === f.dataset.fil); if (x) X.executer({ aller: x.aller }); return true; }
    if (t.closest('[data-tache-nouvelle]')) { etat.tacheLien = null; etat.tacheEditee = 'nouvelle'; if (etat.vue !== 'jour') X.allerVue('jour'); else X.rendre(); X.viser($('#t-taches', root)?.closest('.esp-carte')); $('[data-form-tache] [name="titre"]', root)?.focus({ preventScroll: true }); return true; }
    if (t.closest('[data-tache-fermer]')) { const id = etat.tacheEditee; etat.tacheEditee = null; etat.tacheLien = null; X.rendre(); (id && id !== 'nouvelle' ? $(`[data-tache-modifier="${CSS.escape(id)}"]`, root) : $('[data-tache-nouvelle]', root))?.focus({ preventScroll: true }); return true; }
    const mo = t.closest('[data-tache-modifier]'); if (mo) { etat.tacheEditee = mo.dataset.tacheModifier; X.rendre(); return true; }
    const fa = t.closest('[data-tache-fait]'); if (fa) { const id = fa.dataset.tacheFait, fait = fa.getAttribute('aria-checked') !== 'true';
      agir('tacheTerminer', { id, fait, le: A.iso }, { msg: fait ? 'Tâche terminée.' : 'Tâche rouverte.' }); X.rendre(); $(`[data-tache-fait="${CSS.escape(id)}"]`, root)?.focus({ preventScroll: true }); return true; }
    const su = t.closest('[data-tache-supprimer]'); if (su) { etat.tacheEditee = null; agir('tacheSupprimer', { id: su.dataset.tacheSupprimer }, { msg: 'Tâche supprimée.' }); X.rendre(); $('[data-tache-nouvelle]', root)?.focus({ preventScroll: true }); return true; }
    const li = t.closest('[data-tache-lien]'); if (li) { const x = tachesDuJour(S(), A.iso).find((y) => y.id === li.dataset.tacheLien) || (S().taches?.liste || []).find((y) => y.id === li.dataset.tacheLien); if (x?.lien) ouvrirLien(x.lien); return true; }
    const tp = t.closest('[data-tache-pour]'); if (tp) { const [type, ...reste] = tp.dataset.tachePour.split(':'); nouvelleDepuis({ type, id: reste.join(':'), libelle: tp.dataset.tacheLibelle || '', titre: tp.dataset.tacheTitre || '' }); return true; }
    return false;
  }
  function soumettre(f) {
    if (!f.matches('[data-form-tache]')) return false;
    const id = f.dataset.formTache, v = { titre: f.elements.titre.value, echeance: f.elements.echeance.value, responsable: f.elements.responsable.value };
    if (!v.titre.trim()) { f.elements.titre.focus(); dire('Écrivez ce qu\'il y a à faire.'); return true; }
    let ok, cible = id;
    if (id === 'nouvelle') { const lien = etat.tacheLien ? { type: etat.tacheLien.type, id: etat.tacheLien.id, libelle: etat.tacheLien.libelle } : null, tache = nouvelleTache({ id: idTache(), ...v, lien, cree: new Date().toISOString() });
      cible = tache.id; ok = agir('tacheAjouter', { tache }, { msg: 'Tâche ajoutée.' }); }
    else ok = agir('tacheModifier', { id, champs: v }, { msg: 'Tâche enregistrée.' });
    /* Refusée (mémoire du navigateur pleine, par exemple) : le formulaire reste ouvert avec sa saisie. */
    if (ok === false) return true;
    etat.tacheEditee = null; etat.tacheLien = null; X.rendre(); $(`[data-tache-modifier="${CSS.escape(cible)}"]`, root)?.focus({ preventScroll: true });
    return true;
  }
  /** Les tâches d'un objet, à montrer dans son dossier (une demande ouverte, par exemple). */
  function tachesDe(type, id, libelle, titre = '') {
    const l = tachesLiees(S(), type, id);
    return typo(`<div class="esp-dem__bloc esp-dem__taches"><p class="esp-champ__titre">Tâches de suivi</p>
      ${l.length ? `<ul class="esp-brief__liste esp-brief__taches">${l.map((t) => `<li class="${t.fait ? 'est-faite' : ''}"><button type="button" class="esp-tache__coche" role="checkbox" aria-checked="${t.fait}" data-tache-fait="${e(t.id)}" aria-label="${t.fait ? 'Rouvrir' : 'Terminer'} : ${e(t.titre)}"><span aria-hidden="true"></span></button>${e(t.titre)}${t.echeance ? ` <span>pour ${e(dateCourte(t.echeance))}</span>` : ''}${t.responsable ? ` <span>(${e(t.responsable)})</span>` : ''}</li>`).join('')}</ul>` : ''}
      <p><button type="button" class="esp-bouton esp-bouton--discret" data-tache-pour="${e(`${type}:${id}`)}" data-tache-libelle="${e(libelle)}" data-tache-titre="${e(titre)}">Ajouter une tâche de suivi</button></p></div>`);
  }
  return { rendre, clic, soumettre, ouvrirBriefing, fermerBriefing, nouvelleDepuis, tachesDe };
}
