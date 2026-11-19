/* L'espace restaurateur (démonstration, v7.7.0) : connexion fictive, puis une application à cinq rubriques.
   Aujourd'hui (le service du jour, ce qui attend une réponse, le prochain événement), Réservations (l'agenda de la
   semaine, confirmer, refuser, fermer un service, le dire complet, ajouter une réservation prise au téléphone),
   Événements (modifier, masquer, créer, avec la photothèque), Textes et horaires (annonce, horaires de la semaine,
   fermetures exceptionnelles, ardoise, textes du site), Photos (remplacer depuis la photothèque ou l'appareil, cadrer).
   v7.7.0 : une fois connecté, l'espace est une application (plus d'en-tête ni de pied du site ; les rubriques en bas
   sur téléphone) ; chaque geste est une action nommée de espace-donnees.js, enregistrée aussitôt, avec « Annuler »
   pendant dix secondes ; l'état de l'enregistrement est toujours visible. Les règles (horaires, réservations de
   démonstration) sont dans espace-regles.js. Ce fichier ne fait que dessiner et écouter.
   v7.7.1 : la barre « Que voulez-vous faire ? » (espace-barre.js, phrases comprises par espace-commandes.js), une petite
   fête quand la dernière demande a sa réponse, des états vides qui disent quoi faire.
   v7.7.2 : cinq rubriques (Aujourd'hui, Demandes, Réservations, Carte, Site) ; « Site » a ses onglets (soirées, annonce
   et horaires, textes, messages, photos) ; les demandes de tout le site arrivent dans « Demandes » (espace-vue-demandes.js)
   et s'affichent en direct quand elles sont faites dans un autre onglet.
   v7.7.3 : « Carte » (espace-vue-carte.js) porte la carte du site (plats, prix, allergènes, épuisé aujourd'hui) et l'ardoise.
   v7.7.4 : « L'espace vous propose » en tête d'Aujourd'hui et le bilan de la semaine dans Réservations
   (espace-vue-propose.js) ; la dictée dans la barre ; l'installation sur l'écran d'accueil.
   v7.7.5 : l'onglet « Service » de Réservations (espace-vue-service.js) : la frise, arrivés, absent, modifier, la feuille.
   v7.7.6 : l'onglet « Salle » (espace-vue-salle.js) : le plan, placer une réservation ; la fiche client
   (espace-vue-client.js), ouverte en touchant un nom.
   v7.9.0 : le mode connecté. Si la page indique une API (`<meta name="jh-api">`), les réservations, les règles du jour
   et le plan viennent du serveur (espace-serveur.js) : connexion réelle, « enregistré » seulement quand le serveur l'a
   confirmé, erreurs et conflits dits, suivi des autres appareils. Sans API, l'espace reste la démonstration locale.
   v7.8.0 : le garde-fou métier du dépôt (une réservation impossible n'entre pas dans l'agenda), les heures d'arrivée du
   jour, l'ouverture exceptionnelle, l'annulation ciblée, les écritures différées jamais perdues. */
import { creerDepot, estVide } from './espace-donnees.js?v=7';
import { comprendre } from './espace-commandes.js?v=7';
import { installerBarre } from './espace-barre.js?v=7';
import { creerDemandes } from './espace-vue-demandes.js?v=7';
import { creerCarte } from './espace-vue-carte.js?v=7';
import { creerPropose } from './espace-vue-propose.js?v=7';
import { creerService } from './espace-vue-service.js?v=7';
import { creerSalle } from './espace-vue-salle.js?v=7';
import { creerClient } from './espace-vue-client.js?v=7';
import { normaliser, GENRES } from './espace-demandes.js?v=7';
import { SEMAINE, STATUTS, CAPACITE, hhmm, heure, ajouter, jourDe, fmt, maj, typo, svDe, pluriel, aujourdhui, servicesDe, creneaux as creneauxDe, ouvert, complet as estComplet, resasDuJour, actives, couverts, aConfirmer, evenements as evenementsDe, etatDuService, creneauxDuJour, verifierResa, listeEvenements } from './espace-regles.js?v=7';
import { reglesAction } from './espace-garde.js?v=7';
import { creerDepotServeur } from './espace-serveur.js?v=7';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const e = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const ICO = {
  midi: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.5M12 18.9v2.5M2.6 12h2.5M18.9 12h2.5M5.4 5.4l1.8 1.8M16.8 16.8l1.8 1.8M5.4 18.6l1.8-1.8M16.8 7.2l1.8-1.8"/></svg>',
  soir: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.4 14.7A7.9 7.9 0 1 1 9.3 4.6a6.3 6.3 0 0 0 10.1 10.1Z"/></svg>',
  tel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5h2.6l1.5 4-2 1.3a11 11 0 0 0 6.5 6.5l1.3-2 4 1.5v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  oeil: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
};
const DUREE_ANNULER = 10000, DUREE_MESSAGE = 4200;
const REFUS = 'Ce navigateur refuse d\'enregistrer (mémoire pleine ou stockage bloqué). Essayez une photo de la photothèque plutôt qu\'une photo envoyée.';

export function init(root) {
  let D; try { D = JSON.parse($('script[data-esp-donnees]', root).textContent); } catch { return; }
  const R = D.reservation;
  /* Aujourd'hui, à Moineville : relu au fil du temps (v7.8.1). Une page restée ouverte après minuit ne garde plus la veille. */
  const A = (() => { let t = 0, v = aujourdhui(); const lire = () => { if (Date.now() - t > 15000) { t = Date.now(); v = aujourdhui(); } return v; }; return { get iso() { return lire().iso; }, get min() { return lire().min; }, relire() { t = 0; return lire(); } }; })();
  /* Le garde-fou : avant d'enregistrer, le dépôt demande aux règles si l'action est possible (d'où qu'elle vienne). */
  const API = document.querySelector('meta[name="jh-api"]')?.content || '', ENVIRONNEMENT = document.querySelector('meta[name="jh-environnement"]')?.content || '';
  const depotLocal = creerDepot(undefined, undefined, {
    regle: (nom, args, frais) => reglesAction({ R, auj: A.iso, site: depotLocal.resasSite(), exceptions: D.horaires.exceptions || [] }, frais, D.salle, nom, args),
    /* La liste des soirées publiée sur le site est calculée, jamais restaurée telle quelle : elle suit toujours les données. */
    derives: [{ chemin: ['evenements', 'liste'], calcul: (e) => (e.evenements && (Object.keys(e.evenements.modifs || {}).length || (e.evenements.ajouts || []).length) ? listeEvenements(D.agenda, e) : undefined) }],
  });
  /* Mode connecté (v7.9.0) : le dépôt du serveur prend les réservations et les règles ; le reste demeure local. */
  const depot = API ? creerDepotServeur({ api: API, local: depotLocal, periode: () => ({ du: ajouter(A.iso, -7), au: ajouter(A.iso, 120) }), surFin: (r) => finServeur(r), surEtat: (l) => montrerLiaison(l) }) : depotLocal;
  const S = () => depot.etat();
  /* Le contexte des règles (réglages du site, jour, demandes venues du site) : relu à chaque rendu. */
  let contexte = null;
  /* v7.8.1 : les plats du site sont désignés par un identifiant, plus par leur rang. Les anciennes références de ce
     navigateur sont traduites une fois, sans rien afficher. */
  { const c = depot.etat().carte || {}; if ([...Object.keys(c.modifs || {}), ...Object.keys(c.epuises || {})].some((k) => /\/\d+$/.test(k))) depot.agir('migrerCarte', { base: D.carte }); }
  const ctx = () => (contexte ||= { R, auj: A.iso, site: depot.resasSite(), demandes: depot.demandesSite(), produits: D.produits || [], exceptions: API ? [] : D.horaires.exceptions || [], exemples: !API });
  const services = servicesDe(R);
  const ouv = (iso, sv) => ouvert(ctx(), S(), iso, sv);
  const plein = (iso, sv) => estComplet(S(), iso, sv);
  /* Les heures d'arrivée d'un service le jour choisi : horaires déplacés et ouvertures exceptionnelles compris. */
  const creneaux = (sv) => creneauxDuJour(ctx(), S(), etat.jour, sv);
  /* Les écritures différées (saisie au fil de l'eau) : une par champ, jamais écrasée par la saisie d'un autre champ, et
     toutes enregistrées avant de redessiner, de changer de rubrique ou de quitter la page (v7.8.0). */
  const ecritures = new Map();
  function viderEcritures() { for (const [k, x] of [...ecritures]) { clearTimeout(x.t); ecritures.delete(k); x.f(); } }
  /* Sans clé, l'écriture a sa propre file : elle ne peut jamais effacer celle d'un autre champ (v7.8.1). */
  function plus_tard(f, cle = Symbol('saisie')) {
    etatSauve('cours', 'En cours…'); const deja = ecritures.get(cle); if (deja) clearTimeout(deja.t);
    ecritures.set(cle, { f, t: setTimeout(() => { ecritures.delete(cle); f(); }, 500) });
  }
  /* Le jour change (minuit, ou la page retrouvée le lendemain) : l'espace passe au nouveau jour sans rechargement. */
  let jourConnu = A.iso;
  function suivreLeJour() { A.relire(); if (A.iso === jourConnu) return; if (etat.jour === jourConnu) etat.jour = A.iso; jourConnu = A.iso; contexte = null; if (document.documentElement.classList.contains('esp-dedans')) rendre(); }
  setInterval(suivreLeJour, 30000); document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') suivreLeJour(); });
  addEventListener('pagehide', viderEcritures); document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') viderEcritures(); });
  const resas = (iso) => resasDuJour(ctx(), S(), iso);
  const enAttente = () => aConfirmer(ctx(), S());
  const evenements = () => evenementsDe(D.agenda, S());

  // ---------- Le message du bas : ce qui vient d'être fait, « Annuler » pendant dix secondes ----------
  const toast = $('[data-esp-toast]', root), toastTexte = $('[data-esp-toast-texte]', toast), toastLien = $('[data-esp-toast-lien]', toast), toastAnnuler = $('[data-esp-annuler]', toast), toastAction = $('[data-esp-toast-action]', toast);
  let minuteurToast, actionToast = null;
  function dire(msg, { lien = '', annuler = false, action = null } = {}) {
    toastTexte.textContent = typo(msg);
    toastLien.hidden = !lien; if (lien) toastLien.href = lien;
    toastAnnuler.hidden = !annuler;
    actionToast = action; toastAction.hidden = !action; if (action) toastAction.textContent = action.libelle;
    const duree = annuler || action ? DUREE_ANNULER : DUREE_MESSAGE;
    toast.style.setProperty('--duree', `${duree}ms`);
    toast.classList.remove('est-visible', 'est-compte'); void toast.offsetWidth; toast.classList.add('est-visible'); toast.classList.toggle('est-compte', annuler || !!action);
    clearTimeout(minuteurToast);
    const cacher = () => { if (toast.contains(document.activeElement)) { minuteurToast = setTimeout(cacher, 2000); return; } toast.classList.remove('est-visible', 'est-compte'); toastAnnuler.hidden = true; toastAction.hidden = true; };
    minuteurToast = setTimeout(cacher, duree);
  }
  /** Fait une action nommée (espace-donnees.js), l'enregistre et le dit, avec « Annuler ». */
  function agir(nom, args, { msg = 'Enregistré : visible sur le site, dans ce navigateur.', lien = '', groupe = '' } = {}) {
    const ok = depot.agir(nom, args, { libelle: msg, groupe, msg, lien });
    contexte = null;
    /* Mode connecté : l'action est partie au serveur. Rien n'est dit « enregistré » avant sa réponse (voir finServeur). */
    if (ok === 'attente') { etatSauve('cours', 'Enregistrement…'); root.setAttribute('aria-busy', 'true'); return false; }
    /* Ce que les règles ont fait en plus (une table retirée) est dit avec le message. */
    if (ok) dire([msg, depot.noteAction()].filter(Boolean).join(' '), { lien, annuler: true }); else dire(depot.raisonRefus() || REFUS);
    return ok;
  }
  /* La réponse du serveur à une action. Réussie : l'écran est redessiné depuis ce qu'il a confirmé, les formulaires se
     ferment. Refusée ou sans réponse : rien n'a changé, la raison est dite, un formulaire ouvert garde sa saisie. */
  function finServeur({ ok, nom, args, meta, note, message, code }) {
    root.removeAttribute('aria-busy'); contexte = null;
    /* Un conflit : quelqu'un a changé la réservation entre-temps. L'écran reprend ce que le serveur a, formulaire refermé. */
    if (!ok) { if (code === 'RESEAU') montrerLiaison(depot.liaison()); else etatSauve('refus', 'Non enregistré'); dire(message || REFUS); if (code === 'CONFLIT_VERSION') etat.resaEditee = null; if (!etat.ajoutOuvert && !etat.resaEditee) rendre(); return; }
    etat.ajoutOuvert = false; etat.resaEditee = null; etat.resaAPlacer = null;
    const propre = String(meta?.msg || 'Enregistré.').replace(/ : le client (?:reçoit un message|est prévenu) \(simulé\)\./, '. Aucun message n\'est encore envoyé au client.').replace(/ : visible sur le site, dans ce navigateur\./, '.');
    dire([propre, note].filter(Boolean).join(' '), { lien: meta?.lien || '' });
    if (nom !== 'horaires') rendre(); /* les horaires s'enregistrent pendant la saisie : leur formulaire n'est pas redessiné sous les doigts */
    if (nom === 'statut' && args?.statut === 'confirmee' && !enAttenteTotal()) feter();
  }
  /* L'état de la liaison, toujours visible : à jour (et depuis quand), enregistrement en cours, hors connexion. */
  function montrerLiaison(l) {
    if (l.enCours) { etatSauve('cours', 'Enregistrement…'); return; }
    const h = l.dernier ? new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' }).format(new Date(l.dernier)).replace(':', ' h ') : '';
    if (l.etat === 'hors-ligne') etatSauve('refus', `Hors connexion${h ? ` depuis ${h}` : ''} : rien ne s'enregistre`);
    else if (l.etat === 'a-jour') etatSauve('ok', `Synchronisé à ${h}`);
    else if (l.etat === 'charge') etatSauve('cours', 'Chargement…');
    else if (l.etat === 'interdit') etatSauve('refus', 'Accès limité');
    else if (l.etat === 'deconnecte' && document.documentElement.classList.contains('esp-dedans')) { viderEcrans(); montrer(false); const m = $('[data-esp-connexion-message]', root); if (m && l.message) { m.textContent = l.message; m.hidden = false; } }
  }
  /* Sortie du mode connecté : plus aucun nom ni téléphone dans la page, même caché. */
  function viderEcrans() { for (const z of $$('[data-esp-rendu], [data-esp-panneau]', root)) z.innerHTML = ''; for (const z of $$('[data-client-boite]')) { z.innerHTML = ''; z.parentElement.hidden = true; } toastTexte.textContent = ''; toast.hidden = true; fermerModale?.(); contexte = null; }
  function annuler() {
    if (!depot.peutAnnuler()) return;
    if (!depot.annuler()) { dire(REFUS); return; }
    /* Ce qui a été retouché ailleurs depuis est gardé tel quel, et nommé ; ce qui n'a pas pu être restauré est dit. */
    const NOMS = { resa: 'une réservation', evenements: 'une soirée', annonce: 'l\'annonce', horaires: 'les horaires', carte: 'la carte', ardoise: 'l\'ardoise', textes: 'un texte', photos: 'une photo', clients: 'une fiche client', demandes: 'une demande', messages: 'un modèle de message', conseils: 'une suggestion' };
    const quoi = [...new Set(depot.gardesAnnulation().map((c) => NOMS[c[0]] || 'un élément'))], partiel = depot.annulationPartielle();
    contexte = null; dire(quoi.length ? `Annulé en partie : ${quoi.join(', ')} ${quoi.length > 1 ? 'ont été modifiés' : 'a été modifié'} ailleurs depuis ; ${quoi.length > 1 ? 'les versions actuelles sont gardées' : 'la version actuelle est gardée'}.` : partiel ? `Annulé, sauf ${partiel} : le navigateur a refusé de les restaurer.` : 'Annulé : tout est revenu comme avant.'); rendre();
    const t = $(`#vue-${etat.vue}`, root); t?.setAttribute('tabindex', '-1'); t?.focus({ preventScroll: true });
  }
  toastAnnuler.addEventListener('click', annuler);
  toastAction.addEventListener('click', () => { const a = actionToast; actionToast = null; toast.classList.remove('est-visible', 'est-compte'); toastAction.hidden = true; a?.faire(); });

  // ---------- L'état de l'enregistrement, toujours visible ----------
  const sauve = $('[data-esp-sauve]', root);
  const etatSauve = (etat, texte) => { if (!sauve) return; sauve.dataset.etat = etat; $('[data-esp-sauve-texte]', sauve).textContent = texte; };
  depot.abonner((quoi) => {
    if (quoi.type === 'refus') { etatSauve('refus', 'Non enregistré'); return; }
    if (API) { etatSauve('ok', 'Enregistré dans ce navigateur (rubrique non partagée)'); return; }
    const h = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' }).format(new Date(quoi.t)).replace(':', ' h ');
    etatSauve('ok', `Enregistré à ${h}`);
  });

  // ---------- Rendu des réservations ----------
  const assiettes = (n) => `<span class="esp-assiettes" aria-hidden="true">${'<i></i>'.repeat(Math.min(n, 10))}</span>`;
  function ligneResa(r, avecJour) {
    const actions = r.statut === 'a-confirmer' ? `<button type="button" class="esp-bouton esp-bouton--ok" data-statut="confirmee" data-id="${e(r.id)}" data-repondre>Confirmer</button><button type="button" class="esp-bouton esp-bouton--non" data-statut="refusee" data-id="${e(r.id)}">Refuser</button>`
      : r.statut === 'confirmee' && r.date === A.iso ? `<button type="button" class="esp-bouton" data-statut="arrivee" data-id="${e(r.id)}">Arrivés</button>`
      : '';
    const src = r.source === 'site' ? '<span class="esp-source esp-source--site">Depuis le site</span>' : r.source === 'telephone' ? '<span class="esp-source">Au téléphone</span>' : '';
    return `<li class="esp-resa est-${r.statut}" data-resa="${e(r.id)}">
      <p class="esp-resa__heure">${avecJour ? `<small>${e(maj(fmt(r.date, { weekday: 'short', day: 'numeric', month: 'short' })))}</small>` : ''}${heure(r.heure)}</p>
      <div class="esp-resa__qui"><p class="esp-resa__nom">${vClient.nom(r)} ${src}</p><p class="esp-resa__detail">${assiettes(+r.couverts)}<span>${pluriel(+r.couverts, 'couvert')}</span>${r.table ? `<span>· table ${e(r.table)}</span>` : ''}${r.espace === 'terrasse' ? '<span>· terrasse</span>' : ''}${r.demande ? `<span class="esp-resa__demande">· ${e(r.demande)}</span>` : ''}${vClient.allergies(r) ? `<span class="esp-resa__allergie">· ${e(vClient.allergies(r))}</span>` : ''}</p>
        ${r.telephone ? `<p class="esp-resa__tel"><a href="tel:${e(r.telephone.replace(/\s/g, ''))}">${ICO.tel}<span>${e(r.telephone)}</span></a></p>` : ''}</div>
      <p class="esp-resa__statut"><span class="esp-pastille esp-pastille--${r.statut}">${STATUTS[r.statut]}</span></p>
      <div class="esp-resa__actions">${actions}</div>
    </li>`;
  }
  const MSG_STATUT = { confirmee: 'Réservation confirmée : le client reçoit un message (simulé).', refusee: 'Réservation refusée : le client est prévenu (simulé).', arrivee: 'Bonne table !',
    absente: 'Noté absent : la table est libérée, ses couverts ne comptent plus.', annulee: 'Réservation annulée : le client est prévenu (simulé).' };

  // ---------- Photos ----------
  const imgSrc = (o, w = 640) => o.src || `/assets/images/${o.image || o.nom}-${w}.webp`;
  const largeurs = (nom) => D.phototheque.find((p) => p.nom === nom)?.l || D.photos.find((p) => p.nom === nom)?.l || [640];
  const vignette = (nom) => { const l = largeurs(nom); return `/assets/images/${nom}-${l.find((w) => w >= 480) || l[l.length - 1]}.webp`; };

  // ---------- Vues ----------
  /* L'état des écrans, partagé avec les rubriques écrites dans d'autres fichiers (espace-vue-*.js). */
  const etat = { vue: 'jour', jour: A.iso, evEdite: null, ajoutOuvert: false, onglet: 'soirees', filtreDemandes: 'tout', demandeOuverte: null, ongletCarte: 'carte', platEdite: null, ongletResas: 'agenda', serviceVu: null, resaEditee: null, resaAPlacer: null, tableVue: null };
  /* Où chaque écran se dessine : sa rubrique, ou le panneau de l'onglet ouvert dans « Site ». */
  const corps = (v) => (['evenements', 'soirees', 'horaires', 'textes', 'messages', 'photos'].includes(v) ? $('[data-esp-panneau]', root) : $(`[data-esp-rendu="${v}"]`, root));
  function enAttenteTotal() { const a = vDemandes.attente(); return a.tables.length + a.autres.length; }
  const X = { root, $, $$, e, S, A, D, ctx, etat, agir, dire, corps, ligneResa, rendre, allerVue, viser, feter, enAttenteTotal, plusTard: (f, cle) => plus_tard(f, cle) };
  const vDemandes = creerDemandes(X);
  X.ardoiseHtml = () => cartesSite().ardoise;
  const vCarte = creerCarte(X);
  X.executer = (p) => executer(p);
  const vPropose = creerPropose(X);
  const vService = creerService(X);
  X.serviceVu = vService.serviceVu;
  const vSalle = creerSalle(X);
  const vClient = creerClient(X);
  X.nomClient = vClient.nom; X.allergiesClient = vClient.allergies;

  function rendreJour() {
    const l = resas(A.iso), midi = l.filter((r) => r.service === 'midi'), soir = l.filter((r) => r.service === 'soir'), att = enAttente(), autres = vDemandes.attente().autres, total = att.length + autres.length;
    const prochain = evenements().find((x) => !x.masque && x.debut >= A.iso);
    const s = S(), nb = actives(l).length;
    const tuile = (titre, valeur, detail, cls = '', style = '') => `<div class="esp-tuile ${cls}"${style ? ` style="${style}"` : ''}><p class="esp-tuile__titre">${titre}</p><p class="esp-tuile__valeur">${valeur}</p><p class="esp-tuile__detail">${detail}</p></div>`;
    const sv = (id, lst) => !ouv(A.iso, id) ? tuile(id === 'midi' ? 'Ce midi' : 'Ce soir', 'Fermé', 'Pas de service aujourd\'hui')
      : tuile(id === 'midi' ? 'Ce midi' : 'Ce soir', `${couverts(lst)}<small> / ${CAPACITE}</small>`, `${pluriel(actives(lst).length, 'table')}${plein(A.iso, id) ? ' · complet' : ''}`, 'esp-tuile--jauge', `--jauge:${Math.min(1, couverts(lst) / CAPACITE)}`);
    corps('jour').innerHTML = `
      <p class="esp-bonjour">${e(maj(fmt(A.iso)))} : ${pluriel(nb, 'réservation')} aujourd'hui${total ? `, ${pluriel(total, 'demande')} à traiter` : ''}.</p>
      <div class="esp-tuiles">
        ${tuile('Aujourd\'hui', nb, `${pluriel(nb, 'réservation').replace(/^\d+ /, '')} · ${pluriel(couverts(l), 'couvert')}`)}
        ${sv('midi', midi)}${sv('soir', soir)}
        ${tuile('À traiter', total, total ? [att.length ? pluriel(att.length, 'table') : '', autres.length ? `${autres.length} autre${autres.length > 1 ? 's' : ''}` : ''].filter(Boolean).join(' · ') : 'tout est à jour', total ? 'esp-tuile--alerte' : '')}
      </div>
      <div class="esp-grille esp-grille--jour">
        ${vPropose.carteConseils()}
        <article class="esp-carte esp-carte--large" aria-labelledby="t-attente"><h3 id="t-attente">Ce qui attend une réponse</h3>
          ${total ? `${att.length ? `<ul class="esp-resas">${att.slice(0, 4).map((r) => ligneResa(r, true)).join('')}</ul>` : ''}${autres.length ? `<ul class="esp-dems">${autres.slice(0, 4).map((d) => vDemandes.carte(d, { compacte: true })).join('')}</ul>` : ''}`
            : '<p class="esp-vide esp-vide--fete"><span class="esp-vide__sceau" aria-hidden="true"></span><span><b>Tout a une réponse.</b> Les prochaines demandes faites sur le site arriveront ici.</span></p>'}
          <p class="esp-plus"><button type="button" class="esp-lien" data-aller="demandes">${total > Math.min(att.length, 4) + Math.min(autres.length, 4) ? `Voir les ${total} demandes` : 'Ouvrir les demandes'}</button></p>
        </article>
        <article class="esp-carte" aria-labelledby="t-service"><h3 id="t-service">Le service d'aujourd'hui</h3>
          ${nb ? `<ul class="esp-resas esp-resas--court">${actives(l).slice(0, 6).map((r) => ligneResa(r)).join('')}</ul>` : '<p class="esp-vide">Aucune réservation aujourd\'hui.</p>'}
          <p class="esp-plus"><button type="button" class="esp-lien" data-aller="resas" data-onglet-resas="service">Voir le service en frise</button> <button type="button" class="esp-lien" data-aller="resas">Ouvrir l'agenda</button></p>
        </article>
        ${prochain ? `<article class="esp-carte esp-carte--ev" aria-labelledby="t-ev"><h3 id="t-ev">Prochain événement</h3>
          <div class="esp-ev-mini"><img src="${e(imgSrc(prochain))}" alt="" style="object-position:${e(prochain.cadrage || '50% 50%')}" loading="lazy"><div><p class="esp-ev-mini__type">${e(prochain.type)} · ${e(maj(fmt(prochain.debut.slice(0, 10))))}</p><p class="esp-ev-mini__titre">${e(prochain.titre)}</p><p class="esp-ev-mini__prix">${e(prochain.prix)}</p></div></div>
          <p class="esp-plus"><button type="button" class="esp-lien" data-aller="site" data-onglet="soirees" data-editer="${e(prochain.id)}">Modifier</button></p></article>` : ''}
        <article class="esp-carte" aria-labelledby="t-site"><h3 id="t-site">Sur le site en ce moment</h3>
          <ul class="esp-etat">
            <li><span class="esp-etat__point${s.annonce?.active ? ' est-on' : ''}"></span>${s.annonce?.active ? `Annonce affichée : « ${e(s.annonce.texte)} »` : 'Pas d\'annonce affichée'}</li>
            <li><span class="esp-etat__point${ouv(A.iso, 'midi') || ouv(A.iso, 'soir') ? ' est-on' : ''}"></span>${ouv(A.iso, 'midi') || ouv(A.iso, 'soir') ? `Ouvert aujourd'hui : ${['midi', 'soir'].filter((x) => ouv(A.iso, x)).join(' et ')}` : 'Fermé aujourd\'hui'}</li>
            <li><span class="esp-etat__point${estVide(s) ? '' : ' est-on'}"></span>${estVide(s) ? 'Le site est tel que livré' : 'Vos modifications sont visibles sur le site (dans ce navigateur)'}</li>
          </ul>
          <p class="esp-plus"><button type="button" class="esp-lien" data-aller="site" data-onglet="horaires">Annonce et horaires</button></p>
        </article>
      </div>`;
  }

  function rendreResas() {
    const og = (id, nom) => `<button type="button" class="esp-onglet" role="tab" id="onglet-resas-${id}" aria-selected="${id === etat.ongletResas}" aria-controls="panneau-resas" tabindex="${id === etat.ongletResas ? 0 : -1}" data-onglet="${id}" data-onglets-resas>${nom}</button>`;
    const onglets = `<div class="esp-onglets" role="tablist" aria-label="L'agenda, le service, la salle et le bilan de la semaine">${og('agenda', 'Agenda')}${og('service', 'Service')}${og('salle', 'Salle')}${og('bilan', 'Bilan')}</div>`;
    if (etat.ongletResas === 'bilan') { corps('resas').innerHTML = `${onglets}<div class="esp-panneau" id="panneau-resas" role="tabpanel" aria-labelledby="onglet-resas-bilan" data-esp-panneau-resas data-bilan></div>`; vPropose.rendreBilan($('[data-bilan]', root)); return; }
    if (etat.ongletResas === 'salle') { corps('resas').innerHTML = `${onglets}<div class="esp-panneau" id="panneau-resas" role="tabpanel" aria-labelledby="onglet-resas-salle" data-esp-panneau-resas data-plan-salle></div>`; vSalle.rendre($('[data-plan-salle]', root)); return; }
    if (etat.ongletResas === 'service') { corps('resas').innerHTML = `${onglets}<div class="esp-panneau" id="panneau-resas" role="tabpanel" aria-labelledby="onglet-resas-service" data-esp-panneau-resas data-service></div>`; vService.rendre($('[data-service]', root)); return; }
    const lundi = ajouter(etat.jour, -((jourDe(etat.jour) + 6) % 7));
    const jours = Array.from({ length: 7 }, (_, k) => ajouter(lundi, k));
    const l = resas(etat.jour);
    const colonne = (s) => {
      const es = etatDuService(ctx(), S(), etat.jour, s.id), excIci = (S().resa?.ouvertures || []).some((x) => x.date === etat.jour && x.service === s.id);
      const lst = l.filter((r) => r.service === s.id), o = es.ouvert, fermeIci = (S().resa?.fermes?.[etat.jour] || []).includes(s.id), p = plein(etat.jour, s.id), passe = etat.jour < A.iso;
      return `<section class="esp-service${o ? '' : ' est-ferme'}" aria-labelledby="sv-${s.id}">
        <header class="esp-service__tete"><span class="esp-ico-sv" aria-hidden="true">${ICO[s.id]}</span><h4 id="sv-${s.id}">${s.libelle} <small>${o ? `<span class="esp-insecable">arrivées de ${heure(hhmm(es.debut))} à ${heure(hhmm(es.fin))}</span>` : e(es.motif || 'Fermé')}</small>${es.exceptionnel ? ` <span class="esp-pastille esp-pastille--a-confirmer">Ouverture exceptionnelle${es.note ? ` · ${e(es.note)}` : ''}</span>` : ''}</h4>
          <p class="esp-service__jauge" style="--jauge:${Math.min(1, couverts(lst) / CAPACITE)}"><span>${couverts(lst)} / ${CAPACITE} couverts</span></p></header>
        ${passe ? '' : `<p class="esp-bascules">${o || fermeIci ? `<button type="button" class="esp-bascule" aria-pressed="${p}" data-complet="${s.id}" ${o ? '' : 'disabled'}><span class="esp-bascule__rail" aria-hidden="true"></span>Complet</button><button type="button" class="esp-bascule" aria-pressed="${fermeIci}" data-fermer="${s.id}"><span class="esp-bascule__rail" aria-hidden="true"></span>Fermé ce jour</button>${excIci ? `<button type="button" class="esp-bascule" aria-pressed="true" data-ouvrir-exc="${s.id}"><span class="esp-bascule__rail" aria-hidden="true"></span>Ouverture exceptionnelle</button>` : ''}`
          : es.raison === 'semaine' ? `<button type="button" class="esp-bascule" aria-pressed="false" data-ouvrir-exc="${s.id}"><span class="esp-bascule__rail" aria-hidden="true"></span>Ouverture exceptionnelle</button>`
          : `<span class="esp-note">${e(es.motif || 'Fermé')}${es.raison === 'fermeture' ? ' : à retirer dans Site, Horaires' : ''}</span>`}</p>`}
        ${lst.length ? `<ul class="esp-resas">${lst.map((r) => ligneResa(r)).join('')}</ul>` : `<p class="esp-vide">${o ? `Pas encore de réservation.${passe || etat.ajoutOuvert ? '' : ' <button type="button" class="esp-lien" data-ajouter>Noter une réservation prise au téléphone</button>'}` : 'Pas de service.'}</p>`}
      </section>`;
    };
    corps('resas').innerHTML = `${onglets}<div class="esp-panneau" id="panneau-resas" role="tabpanel" aria-labelledby="onglet-resas-agenda" data-esp-panneau-resas>
      <div class="esp-semaine">
        <button type="button" class="esp-rond" data-semaine="-7" aria-label="Semaine précédente"><span aria-hidden="true">‹</span><span class="esp-semaine__mot" aria-hidden="true">Semaine précédente</span></button>
        <ol class="esp-semaine__jours">${jours.map((iso) => { const lj = resas(iso), n = couverts(lj), att = lj.filter((r) => r.statut === 'a-confirmer').length; return `<li><button type="button" class="esp-jour${iso === A.iso ? ' est-auj' : ''}" data-jour="${iso}" aria-pressed="${iso === etat.jour}"><span class="esp-jour__nom">${e(fmt(iso, { weekday: 'short' }).replace('.', ''))}</span><b>${+iso.slice(8)}</b><span class="esp-jour__n">${n ? `${n} couv.` : '—'}</span>${att ? `<span class="esp-jour__att" aria-label="${att} à confirmer">${att}</span>` : ''}</button></li>`; }).join('')}</ol>
        <button type="button" class="esp-rond" data-semaine="7" aria-label="Semaine suivante"><span aria-hidden="true">›</span><span class="esp-semaine__mot" aria-hidden="true">Semaine suivante</span></button>
      </div>
      <div class="esp-jourtete"><h3>${e(maj(fmt(etat.jour)))}${etat.jour === A.iso ? ' <span class="esp-pastille">Aujourd\'hui</span>' : ''}</h3>
        <button type="button" class="bouton esp-ajouter" data-ajouter aria-expanded="${etat.ajoutOuvert}">${ICO.plus}<span>Ajouter une réservation</span></button></div>
      ${etat.ajoutOuvert ? `<form class="esp-carte esp-form-ajout" data-form-ajout aria-label="Nouvelle réservation prise au téléphone">
        <p class="esp-champ"><label for="aj-nom">Nom</label><input id="aj-nom" name="nom" required autocomplete="off"></p>
        <p class="esp-champ"><label for="aj-tel">Téléphone</label><input id="aj-tel" name="telephone" type="tel" autocomplete="off"></p>
        <p class="esp-champ"><label for="aj-sv">Service</label><select id="aj-sv" name="service">${services.map((s) => `<option value="${s.id}"${ouv(etat.jour, s.id) ? '' : ' disabled'}>${s.libelle}</option>`).join('')}</select></p>
        <p class="esp-champ"><label for="aj-h">Heure</label><select id="aj-h" name="heure">${services.map((s) => creneaux(s.id).map((t) => `<option value="${t}" data-sv="${s.id}">${heure(t)}</option>`).join('')).join('')}</select></p>
        <p class="esp-champ"><label for="aj-c">Couverts</label><input id="aj-c" name="couverts" type="number" inputmode="numeric" min="1" max="${CAPACITE}" value="2"></p>
        <p class="esp-champ esp-champ--large"><label for="aj-d">Note</label><input id="aj-d" name="demande" placeholder="Anniversaire, chaise haute…" autocomplete="off"></p>
        <p class="esp-form-ajout__actions"><button type="submit" class="bouton">Enregistrer</button><button type="button" class="esp-bouton esp-bouton--discret" data-ajouter>Fermer</button></p>
      </form>` : ''}
      <div class="esp-services">${services.map(colonne).join('')}</div></div>`;
    /* Très petit écran : la ligne des jours se fait glisser ; le jour choisi reste au milieu. */
    const choisi = $('.esp-jour[aria-pressed="true"]', root), ol = choisi?.closest('ol');
    if (ol && ol.scrollWidth > ol.clientWidth) ol.scrollLeft = choisi.offsetLeft - (ol.clientWidth - choisi.offsetWidth) / 2;
    const f = $('[data-form-ajout]', root);
    if (f) { const sv = f.elements.service, h = f.elements.heure; const filtre = () => { for (const o of h.options) o.hidden = o.disabled = o.dataset.sv !== sv.value; if (h.selectedOptions[0]?.hidden) h.value = [...h.options].find((o) => !o.hidden)?.value; }; const premier = [...sv.options].find((o) => !o.disabled); if (premier) sv.value = premier.value; filtre(); sv.addEventListener('change', filtre); }
  }

  function rendreEvenements() {
    const l = evenements();
    if (etat.evEdite) return rendreEditeur(l.find((x) => x.id === etat.evEdite) || { id: etat.evEdite, titre: '', debut: ajouter(A.iso, 14), type: 'Soirée', prix: '', service: 'soir', image: 'vraie/salle-pierre', l: largeurs('vraie/salle-pierre'), cadrage: '50% 50%', nouveau: true });
    const venir = l.filter((x) => x.debut.slice(0, 10) >= A.iso), passes = l.filter((x) => x.debut.slice(0, 10) < A.iso);
    const carte = (x) => `<li class="esp-ev${x.masque ? ' est-masque' : ''}"><img class="esp-ev__photo" src="${e(imgSrc(x))}" alt="" style="object-position:${e(x.cadrage || '50% 50%')}" loading="lazy">
      <div class="esp-ev__texte"><p class="esp-ev__type">${e(x.type)}${x.debut.slice(0, 10) < A.iso ? ' · passé' : ''}${x.nouveau ? ' · <span class="esp-pastille">Nouveau</span>' : ''}${x.masque ? ' · <span class="esp-pastille esp-pastille--refusee">Masqué</span>' : ''}</p><h4 class="esp-ev__titre">${e(x.titre)}</h4><p class="esp-ev__date">${e(maj(fmt(x.debut.slice(0, 10))))} · ${x.service === 'midi' ? 'midi' : 'soir'}</p>${x.prix ? `<p class="esp-ev__prix">${e(x.prix)}</p>` : ''}</div>
      <p class="esp-ev__actions"><button type="button" class="esp-bouton" data-editer="${e(x.id)}">Modifier</button><button type="button" class="esp-bascule" aria-pressed="${!x.masque}" data-visible="${e(x.id)}"><span class="esp-bascule__rail" aria-hidden="true"></span>Sur le site</button></p></li>`;
    corps('evenements').innerHTML = `<div class="esp-barre"><p class="esp-barre__texte">Ils s'affichent sur la page Les fêtes, dans « Prochaine soirée » de l'accueil et dans le choix des dates de la réservation.</p><button type="button" class="bouton esp-ajouter" data-nouvel-ev>${ICO.plus}<span>Nouvel événement</span></button></div>
      <h3 class="esp-sous">À venir</h3><ul class="esp-evs">${venir.map(carte).join('') || '<li class="esp-vide">Aucun événement à venir. <button type="button" class="esp-lien" data-nouvel-ev>Créer une soirée</button></li>'}</ul>
      ${passes.length ? `<h3 class="esp-sous">Passés</h3><ul class="esp-evs esp-evs--passes">${passes.map(carte).join('')}</ul>` : ''}`;
  }
  function rendreEditeur(x) {
    corps('evenements').innerHTML = `<p><button type="button" class="esp-lien esp-retour" data-fermer-ev>← Tous les événements</button></p>
      <form class="esp-editeur" data-editeur data-id="${e(x.id)}" aria-label="${x.nouveau && !x.titre ? 'Nouvel événement' : 'Modifier l\'événement'}">
        <div class="esp-editeur__champs esp-carte">
          <p class="esp-champ esp-champ--large"><label for="ev-titre">Titre</label><input id="ev-titre" name="titre" value="${e(x.titre)}" required placeholder="Soirée raclette"></p>
          <p class="esp-champ"><label for="ev-type">Genre</label><select id="ev-type" name="type">${['Soirée', 'Brunch', 'Fête', 'Concert', 'Atelier'].map((t) => `<option${t === x.type ? ' selected' : ''}>${t}</option>`).join('')}</select></p>
          <p class="esp-champ"><label for="ev-date">Date</label><input id="ev-date" name="debut" type="date" value="${e(x.debut.slice(0, 10))}" required></p>
          <p class="esp-champ"><label for="ev-sv">Service</label><select id="ev-sv" name="service"><option value="midi"${x.service === 'midi' ? ' selected' : ''}>Midi</option><option value="soir"${x.service !== 'midi' ? ' selected' : ''}>Soir</option></select></p>
          <p class="esp-champ esp-champ--large"><label for="ev-prix">Prix</label><input id="ev-prix" name="prix" value="${e(x.prix)}" placeholder="39 € hors boissons"></p>
          <div class="esp-champ esp-champ--large"><p class="esp-champ__titre">Photo <small>(touchez la photo pour choisir le point à garder au centre)</small></p>
            <button type="button" class="esp-cadreur" data-cadreur style="--fx:${e((x.cadrage || '50% 50%').split(' ')[0])};--fy:${e((x.cadrage || '50% 50%').split(' ')[1])}" aria-label="Cadrer la photo : touchez le point à garder au centre, ou utilisez les flèches"><img src="${e(imgSrc(x, 1280))}" alt="" style="object-position:${e(x.cadrage || '50% 50%')}"><span class="esp-cadreur__mire" aria-hidden="true"></span></button>
            <p class="esp-editeur__photo-actions"><button type="button" class="esp-bouton" data-choisir-photo="ev">Changer la photo</button></p></div>
          <p class="esp-editeur__actions"><button type="submit" class="bouton">Enregistrer</button>${x.nouveau && x.titre ? '<button type="button" class="esp-bouton esp-bouton--non" data-supprimer-ev>Supprimer</button>' : ''}</p>
        </div>
        <div class="esp-editeur__apercu"><p class="esp-champ__titre">Sur la page Les fêtes</p>
          <article class="esp-billet" data-billet><img src="${e(imgSrc(x))}" alt="" style="object-position:${e(x.cadrage || '50% 50%')}"><span class="esp-billet__perfo" aria-hidden="true"></span><p class="esp-billet__date"></p><p class="esp-billet__titre"></p><p class="esp-billet__prix"></p></article></div>
      </form>`;
    const f = $('[data-editeur]', root);
    f._photo = { image: x.src ? null : x.image, l: x.l || largeurs(x.image), src: x.src || null, cadrage: x.cadrage || '50% 50%' };
    apercuBillet(f);
  }
  function apercuBillet(f) {
    const b = $('[data-billet]', f), v = Object.fromEntries(new FormData(f)), p = f._photo;
    $('.esp-billet__date', b).textContent = v.debut ? maj(fmt(v.debut)) + (v.service === 'midi' ? ', au déjeuner' : ', le soir') : '';
    $('.esp-billet__titre', b).textContent = v.titre || 'Titre de l\'événement';
    $('.esp-billet__prix', b).textContent = v.prix;
    const src = p.src || `/assets/images/${p.image}-640.webp`;
    for (const img of $$('img', f)) { img.src = img.closest('[data-cadreur]') ? (p.src || `/assets/images/${p.image}-${p.l.find((w) => w >= 1000) || p.l[p.l.length - 1]}.webp`) : src; img.style.objectPosition = p.cadrage; }
    const [fx, fy] = p.cadrage.split(' '); const c = $('[data-cadreur]', f); c.style.setProperty('--fx', fx); c.style.setProperty('--fy', fy);
  }

  /** Les cartes de l'annonce, des fermetures, des horaires, de l'ardoise et des textes : chacune va dans son écran. */
  function cartesSite() {
    const s = S(), an = s.annonce || {}, sem = s.horaires?.semaine || D.horaires.semaine, exc = [...(s.horaires?.exceptions || [])];
    const ard = { jour: s.ardoise?.jour || D.ardoise.jour, soir: s.ardoise?.soir || D.ardoise.soir };
    const plage = (j, sv) => (sem[j] || []).find((c) => svDe(c) === sv);
    const defauts = { midi: ['12:00', '14:30'], soir: ['19:00', '23:00'] };
    const ligneH = (j) => `<tr><th scope="row">${maj(j)}</th>${['midi', 'soir'].map((sv) => { const p = plage(j, sv), [d, f] = p ? p.split('-') : defauts[sv]; return `<td><div class="esp-plage${p ? '' : ' est-off'}"><label class="esp-coche"><input type="checkbox" name="${j}-${sv}"${p ? ' checked' : ''}><span>${sv === 'midi' ? 'Midi' : 'Soir'}</span></label><input type="time" name="${j}-${sv}-d" value="${d}" aria-label="${maj(j)} ${sv}, ouverture" step="900"${p ? '' : ' disabled'}><span aria-hidden="true">–</span><input type="time" name="${j}-${sv}-f" value="${f === '00:00' ? '23:59' : f}" aria-label="${maj(j)} ${sv}, fermeture" step="900"${p ? '' : ' disabled'}></div></td>`; }).join('')}</tr>`;
    const ardoise = (k, nom) => `<fieldset class="esp-ardoise" data-ardoise="${k}"><legend>${nom}</legend>
      <p class="esp-champ"><label for="ar-${k}-t">Titre</label><input id="ar-${k}-t" name="titre" value="${e(ard[k].titre)}"></p>
      <ol class="esp-ardoise__lignes">${ard[k].lignes.map((l, i) => `<li><input name="plat" value="${e(l.plat)}" aria-label="Plat ${i + 1}"><input name="prix" value="${e(l.prix)}" aria-label="Prix du plat ${i + 1}" class="esp-prix"><button type="button" class="esp-rond esp-rond--petit" data-retirer-plat aria-label="Retirer ce plat">×</button></li>`).join('')}</ol>
      <p><button type="button" class="esp-bouton" data-ajouter-plat>${ICO.plus}<span>Ajouter un plat</span></button></p>
      <p class="esp-champ"><label for="ar-${k}-m">Le mot du chef</label><input id="ar-${k}-m" name="mot" value="${e(ard[k].mot)}"></p></fieldset>`;
    return {
      annonce: `<article class="esp-carte" aria-labelledby="t-annonce"><h3 id="t-annonce">L'annonce</h3><p class="esp-aide">Un petit mot qui apparaît sur toutes les pages : une fermeture, une soirée complète, le menu de la Saint-Valentin…</p>
        <form data-form-annonce><p><button type="button" class="esp-bascule" aria-pressed="${!!an.active}" data-annonce-active><span class="esp-bascule__rail" aria-hidden="true"></span>Afficher l'annonce</button></p>
        <p class="esp-champ esp-champ--large"><label for="an-texte">Texte <small data-compte>${(an.texte || '').length} / 160</small></label><textarea id="an-texte" name="texte" maxlength="160" rows="3" placeholder="Fermeture annuelle du 4 au 18 janvier : à très vite !">${e(an.texte || '')}</textarea></p></form>
        <div class="esp-annonce-apercu" aria-hidden="true"><p class="annonce-site__sur">Annonce</p><p data-annonce-apercu>${e(an.texte || 'Fermeture annuelle du 4 au 18 janvier : à très vite !')}</p></div>
      </article>`,
      fermetures: `<article class="esp-carte" aria-labelledby="t-fermetures"><h3 id="t-fermetures">Fermetures exceptionnelles</h3><p class="esp-aide">Le site affiche « fermé » ces jours-là et la réservation ne les propose plus.</p>
        <ul class="esp-fermetures">${exc.map((x, i) => `<li><span><b>${e(x.du === x.au ? maj(fmt(x.du)) : `Du ${fmt(x.du, { day: 'numeric', month: 'long' })} au ${fmt(x.au, { day: 'numeric', month: 'long' })}`)}</b>${x.motif ? ` · ${e(x.motif)}` : ''}</span><button type="button" class="esp-bouton esp-bouton--discret" data-retirer-fermeture="${i}">Retirer</button></li>`).join('') || '<li class="esp-vide">Aucune fermeture prévue. Pour vos congés, donnez les dates ci-dessous.</li>'}</ul>
        <form class="esp-form-fermeture" data-form-fermeture><p class="esp-champ"><label for="fe-du">Du</label><input id="fe-du" name="du" type="date" min="${A.iso}" required></p><p class="esp-champ"><label for="fe-au">Au</label><input id="fe-au" name="au" type="date" min="${A.iso}"></p><p class="esp-champ esp-champ--large"><label for="fe-motif">Motif (affiché)</label><input id="fe-motif" name="motif" placeholder="Congés annuels"></p><p><button type="submit" class="bouton">Ajouter la fermeture</button></p></form>
      </article>`,
      horaires: `<article class="esp-carte esp-carte--large" aria-labelledby="t-horaires"><h3 id="t-horaires">Horaires de la semaine</h3><p class="esp-aide">Le statut « ouvert maintenant » du site et les services proposés à la réservation suivent ces horaires.</p>
        <form data-form-horaires><div class="esp-table-defile" tabindex="0" role="group" aria-label="Horaires de la semaine, à faire défiler"><table class="esp-horaires"><caption class="visuellement-cache">Horaires du midi et du soir, jour par jour</caption><thead><tr><th scope="col">Jour</th><th scope="col">Midi</th><th scope="col">Soir</th></tr></thead><tbody>${SEMAINE.map(ligneH).join('')}</tbody></table></div></form>
      </article>`,
      ardoise: `<article class="esp-carte esp-carte--large" aria-labelledby="t-ardoise"><h3 id="t-ardoise">L'ardoise de la semaine</h3><p class="esp-aide">Elle s'affiche sur La carte et au dos de la photo du chef, à l'accueil.</p>
        <form class="esp-ardoises" data-form-ardoise>${ardoise('jour', 'Le midi')}${ardoise('soir', 'Le soir')}</form>
      </article>`,
      textes: `<article class="esp-carte esp-carte--large" aria-labelledby="t-textes"><h3 id="t-textes">Les textes du site</h3>
        <form class="esp-textes" data-form-textes>${D.textes.map((t, i) => `<div class="esp-texte"><p class="esp-texte__lieu">${e(t.lieu)} <a href="${e(t.url)}" class="esp-voir">${ICO.oeil}<span>Voir</span></a></p><p class="esp-champ esp-champ--large"><label for="tx-${i}">${e(t.libelle)}</label>${t.long ? `<textarea id="tx-${i}" name="${e(t.cle)}" rows="3">${e(typo(s.textes?.[t.cle] || t.defaut))}</textarea>` : `<input id="tx-${i}" name="${e(t.cle)}" value="${e(typo(s.textes?.[t.cle] || t.defaut))}">`}</p>${s.textes?.[t.cle] ? `<p><button type="button" class="esp-lien" data-retablir-texte="${e(t.cle)}">Revenir au texte d'origine</button></p>` : ''}</div>`).join('')}</form>
      </article>`,
    };
  }
  function rendreHoraires() { const c = cartesSite(); corps('horaires').innerHTML = `<div class="esp-grille esp-grille--textes">${c.annonce}${c.fermetures}${c.horaires}</div>`; }
  function rendreTextesSite() { corps('textes').innerHTML = cartesSite().textes; }
  /* « Site » : ce que le restaurant change sur son site, en onglets. */
  const ONGLETS = [['soirees', 'Soirées'], ['horaires', 'Annonce et horaires'], ['textes', 'Textes'], ['messages', 'Messages'], ['photos', 'Photos']];
  function rendreSite() {
    if (!ONGLETS.some(([id]) => id === etat.onglet)) etat.onglet = 'soirees';
    corps('site').innerHTML = `<div class="esp-onglets" role="tablist" aria-label="Ce que vous changez sur le site">${ONGLETS.map(([id, nom]) => `<button type="button" class="esp-onglet" role="tab" id="onglet-${id}" aria-selected="${id === etat.onglet}" aria-controls="panneau-site" tabindex="${id === etat.onglet ? 0 : -1}" data-onglet="${id}">${nom}</button>`).join('')}</div>
      <div class="esp-panneau" id="panneau-site" role="tabpanel" aria-labelledby="onglet-${etat.onglet}" data-esp-panneau></div>`;
    ({ soirees: rendreEvenements, horaires: rendreHoraires, textes: rendreTextesSite, messages: vDemandes.rendreMessages, photos: rendrePhotos })[etat.onglet]();
  }

  function rendrePhotos() {
    const s = S();
    corps('photos').innerHTML = `<p class="esp-aide esp-aide--haut">Remplacez une photo par une autre de votre photothèque ou de votre téléphone, puis touchez-la pour choisir le point à garder au centre.</p>
      <ul class="esp-photos">${D.photos.map((p) => { const m = s.photos?.[p.id] || {}, nom = m.src ? null : (m.nom || p.nom), cad = m.cadrage || p.cadrage, [fx, fy] = cad.split(' ');
        return `<li class="esp-photo"><button type="button" class="esp-cadreur" data-cadreur-slot="${p.id}" style="--fx:${fx};--fy:${fy}" aria-label="Cadrer : ${e(p.lieu)}, ${e(p.libelle)}. Touchez le point à garder au centre, ou utilisez les flèches"><img src="${e(m.src || vignette(nom))}" alt="" style="object-position:${e(cad)}" loading="lazy"><span class="esp-cadreur__mire" aria-hidden="true"></span></button>
          <div class="esp-photo__texte"><p class="esp-photo__lieu">${e(p.lieu)}</p><h3 class="esp-photo__titre">${e(p.libelle)}</h3>${s.photos?.[p.id] ? '<p><span class="esp-pastille">Modifiée</span></p>' : ''}</div>
          <p class="esp-photo__actions"><button type="button" class="esp-bouton" data-choisir-photo="${p.id}">Changer</button>${s.photos?.[p.id] ? `<button type="button" class="esp-bouton esp-bouton--discret" data-retablir-photo="${p.id}">Rétablir</button>` : ''}<a class="esp-voir" href="${e(p.url)}">${ICO.oeil}<span>Voir</span></a></p></li>`; }).join('')}</ul>`;
  }

  function rendre() {
    viderEcritures();
    contexte = null;
    ({ jour: rendreJour, demandes: vDemandes.rendre, resas: rendreResas, carte: vCarte.rendre, site: rendreSite })[etat.vue]();
    const n = enAttenteTotal();
    for (const b of $$('[data-esp-badge]', root)) { const on = b.dataset.espBadge === 'demandes' && n > 0; b.hidden = !on; if (on) { b.textContent = n; b.setAttribute('aria-label', `${n} à traiter`); } }
  }
  function allerVue(v, focus = true) {
    etat.vue = v; try { sessionStorage.setItem('jh-espace-vue', v); } catch { /* rien */ }
    for (const s of $$('.esp-vue', root)) s.hidden = s.dataset.vue !== v;
    for (const b of $$('[data-esp-vue]', root)) { if (b.dataset.espVue === v) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); }
    rendre();
    scrollTo({ top: 0, behavior: 'instant' });
    const t = $(`#vue-${v}`, root);
    if (focus && t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
  }

  // ---------- La photothèque (et l'envoi depuis l'appareil) ----------
  let pourQui = null, retourFocus = null;
  const modale = document.createElement('div');
  modale.className = 'esp-modale'; modale.hidden = true;
  modale.innerHTML = `<div class="esp-modale__fond" data-fermer-modale></div><div class="esp-modale__boite" role="dialog" aria-modal="true" aria-labelledby="modale-titre">
    <header class="esp-modale__tete"><h2 id="modale-titre">Choisir une photo</h2><button type="button" class="esp-rond" data-fermer-modale aria-label="Fermer">×</button></header>
    <p class="esp-modale__envoi"><label class="bouton esp-fichier">Depuis mon appareil<input type="file" accept="image/*" data-fichier></label><span class="esp-aide">La photo est réduite et gardée dans ce navigateur.</span></p>
    <ul class="esp-phototheque">${D.phototheque.map((p) => `<li><button type="button" class="esp-vignette" data-photo="${p.nom}"><img src="/assets/images/${p.nom}-640.webp" alt="${e(p.nom.split('/')[1].replace(/-/g, ' '))}" loading="lazy"></button></li>`).join('')}</ul></div>`;
  root.append(modale);
  function ouvrirModale(qui, depuis) { pourQui = qui; retourFocus = depuis; modale.hidden = false; document.documentElement.classList.add('esp-modale-ouverte'); $('.esp-vignette', modale)?.focus(); }
  function fermerModale() { modale.hidden = true; document.documentElement.classList.remove('esp-modale-ouverte'); retourFocus?.focus?.(); }
  function choisie(photo) {
    if (pourQui === 'ev') { const f = $('[data-editeur]', root); if (f) { f._photo = { ...f._photo, ...photo, image: photo.nom || null, src: photo.src || null }; apercuBillet(f); } fermerModale(); return; }
    const emplacement = pourQui;
    const ok = agir('photo', { emplacement, photo }, { msg: 'Photo changée : visible sur le site, dans ce navigateur.', lien: D.photos.find((p) => p.id === emplacement)?.url });
    fermerModale(); if (ok) { rendre(); $(`[data-choisir-photo="${emplacement}"]`, root)?.focus(); }
  }
  function reduire(fichier) {
    return new Promise((ok, non) => {
      const lecteur = new FileReader();
      lecteur.onload = () => { const img = new Image(); img.onload = () => { const k = Math.min(1, 1400 / Math.max(img.width, img.height)), c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); ok(c.toDataURL('image/jpeg', .8)); }; img.onerror = non; img.src = lecteur.result; };
      lecteur.onerror = non; lecteur.readAsDataURL(fichier);
    });
  }
  modale.addEventListener('click', (ev) => {
    if (ev.target.closest('[data-fermer-modale]')) { fermerModale(); return; }
    const v = ev.target.closest('[data-photo]'); if (v) { const nom = v.dataset.photo; choisie({ nom, l: largeurs(nom) }); }
  });
  modale.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') fermerModale();
    if (ev.key === 'Tab') { const f = $$('button, input, [href]', modale).filter((x) => !x.closest('[hidden]') && x.offsetParent); if (!f.length) return; if (ev.shiftKey && document.activeElement === f[0]) { ev.preventDefault(); f[f.length - 1].focus(); } else if (!ev.shiftKey && document.activeElement === f[f.length - 1]) { ev.preventDefault(); f[0].focus(); } }
  });
  $('[data-fichier]', modale).addEventListener('change', async (ev) => { const f = ev.target.files?.[0]; if (!f) return; try { choisie({ src: await reduire(f) }); } catch { dire('Cette photo ne s\'ouvre pas : essayez un fichier JPEG ou PNG.'); } ev.target.value = ''; });

  // ---------- Cadrage : toucher la photo, ou les flèches ----------
  function cadrer(btn, x, y) {
    const c = `${Math.round(x)}% ${Math.round(y)}%`; btn.style.setProperty('--fx', `${Math.round(x)}%`); btn.style.setProperty('--fy', `${Math.round(y)}%`); $('img', btn).style.objectPosition = c;
    const id = btn.dataset.cadreurSlot;
    if (id) { const p = D.photos.find((q) => q.id === id); agir('cadrage', { emplacement: id, cadrage: c, origine: { nom: p.nom, l: largeurs(p.nom) } }, { msg: 'Cadrage enregistré.', lien: p.url, groupe: `cadrage-${id}` }); }
    else { const f = btn.closest('[data-editeur]'); if (f) { f._photo.cadrage = c; apercuBillet(f); } }
  }
  root.addEventListener('pointerdown', (ev) => {
    const btn = ev.target.closest('[data-cadreur], [data-cadreur-slot]'); if (!btn) return;
    const r = btn.getBoundingClientRect(); cadrer(btn, ((ev.clientX - r.left) / r.width) * 100, ((ev.clientY - r.top) / r.height) * 100);
  });
  root.addEventListener('keydown', (ev) => {
    const tab = ev.target.closest('[role="tab"][data-onglet]');
    if (tab && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(ev.key)) { ev.preventDefault(); const l = $$('[role="tab"]', tab.parentElement), i = l.indexOf(tab); (ev.key === 'Home' ? l[0] : ev.key === 'End' ? l[l.length - 1] : l[(i + (ev.key === 'ArrowRight' ? 1 : -1) + l.length) % l.length]).click(); return; }
    const btn = ev.target.closest('[data-cadreur], [data-cadreur-slot]'); if (!btn || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(ev.key)) return;
    ev.preventDefault(); const x = parseFloat(btn.style.getPropertyValue('--fx')) || 50, y = parseFloat(btn.style.getPropertyValue('--fy')) || 50, d = 5;
    cadrer(btn, Math.max(0, Math.min(100, x + (ev.key === 'ArrowRight' ? d : ev.key === 'ArrowLeft' ? -d : 0))), Math.max(0, Math.min(100, y + (ev.key === 'ArrowDown' ? d : ev.key === 'ArrowUp' ? -d : 0))));
  });

  // ---------- La barre « Que voulez-vous faire ? » : la phrase comprise, puis l'action lancée et la rubrique ouverte ----------
  /** Les réservations des quatre semaines qui viennent, pour retrouver un client par son nom. */
  const prochaines = () => (ctx().prochaines ||= Array.from({ length: 29 }, (_, k) => resas(ajouter(A.iso, k))).flat());
  function viser(el, bloc = 'start') { if (!el) return; el.scrollIntoView({ block: bloc, behavior: 'instant' }); el.classList.add('est-vise'); setTimeout(() => el.classList.remove('est-vise'), 2400); }
  function executer(p) {
    if (p.aller?.url) { location.assign(p.aller.url); return; }
    let ok = true, resa = p.aller?.resa;
    if (p.action) {
      const args = { ...p.action.args };
      if (p.action.nom === 'evenement') { args.agenda = D.agenda; args.champs = { ...args.champs, l: largeurs(args.champs.image) }; }
      if (p.action.nom === 'plat') args.base = D.carte;
      if (p.action.nom === 'ajouterResa') { resa = 'tel-' + Date.now().toString(36); args.resa = { ...args.resa, id: resa }; }
      ok = agir(p.action.nom, args, { msg: p.action.msg, lien: p.action.lien });
    }
    const a = p.aller; if (!a?.vue) { rendre(); return; }
    if (a.jour) etat.jour = a.jour; if (a.onglet) { if (a.vue === 'carte') etat.ongletCarte = a.onglet; else if (a.vue === 'resas') etat.ongletResas = a.onglet; else etat.onglet = a.onglet; }
    if (a.vue === 'resas' && !a.onglet) etat.ongletResas = 'agenda'; if (a.demande) etat.demandeOuverte = a.demande; if (a.filtre) etat.filtreDemandes = a.filtre;
    if (a.vue === 'carte') etat.platEdite = null;
    etat.evEdite = ok && a.editer ? a.editer : null; etat.ajoutOuvert = false;
    allerVue(a.vue);
    if (resa) viser($(`[data-resa="${CSS.escape(resa)}"]`, corps(a.vue)), 'center');
    else if (a.demande) viser($(`[data-esp-rendu="demandes"] [data-demande="${CSS.escape(a.demande)}"]`, root), 'center');
    else if (a.plat) viser($(`[data-plat="${CSS.escape(a.plat)}"]`, root), 'center');
    else if (a.ancre) viser(document.getElementById(a.ancre)?.closest('.esp-carte'));
    else if (a.editer && etat.evEdite) $('#ev-prix', root)?.focus({ preventScroll: true });
  }
  installerBarre(root, { comprendre: (texte) => comprendre(texte, { auj: A.iso, R, S: S(), exceptions: D.horaires.exceptions || [], pages: D.pages, carte: D.carte, resas: prochaines() }), executer, actif: () => root.classList.contains('est-connecte') });

  /** Une petite fête quand la dernière demande a sa réponse : des assiettes dorées s'envolent de la tuile « À confirmer ». */
  function feter() {
    if (document.documentElement.matches('.calme, [data-calme]')) return;
    const r = ($('.esp-vide--fete', root) || $('.esp-tuiles', root) || root).getBoundingClientRect(), f = document.createElement('div');
    f.className = 'esp-fete'; f.setAttribute('aria-hidden', 'true');
    f.style.left = `${Math.round(Math.min(innerWidth - 40, Math.max(40, r.left + Math.min(r.width / 2, 160))))}px`; f.style.top = `${Math.round(Math.min(innerHeight - 120, Math.max(120, r.top + r.height / 2)))}px`;
    f.innerHTML = Array.from({ length: 16 }, (_, i) => `<i style="--a:${i * 22.5 + (i % 3) * 9}deg;--d:${64 + ((i * 37) % 80)}px;--t:${(i % 4) * 45}ms;--s:${10 + (i % 3) * 4}px"></i>`).join('');
    document.body.append(f); setTimeout(() => f.remove(), 1900);
  }

  // ---------- Installer l'espace sur l'écran d'accueil : la marche à suivre, et le bouton du navigateur quand il le propose ----------
  let invite = null; addEventListener('beforeinstallprompt', (ev) => { ev.preventDefault(); invite = ev; });
  const installe = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  if (installe()) $('[data-esp-installer]', root)?.setAttribute('hidden', '');
  let fenInstall = null, retourInstall = null;
  function ouvrirInstaller(depuis) {
    retourInstall = depuis;
    if (!fenInstall) {
      fenInstall = document.createElement('div'); fenInstall.className = 'esp-modale esp-modale--petite';
      fenInstall.innerHTML = `<div class="esp-modale__fond" data-fermer-install></div><div class="esp-modale__boite" role="dialog" aria-modal="true" aria-labelledby="install-titre">
        <header class="esp-modale__tete"><h2 id="install-titre">Sur l'écran d'accueil</h2><button type="button" class="esp-rond" data-fermer-install aria-label="Fermer">×</button></header>
        <div class="esp-install"><p>L'espace s'ouvre alors comme une application, sans barre d'adresse, d'un toucher sur son icône.</p>
          <p data-install-direct hidden><button type="button" class="bouton" data-install-go>Installer maintenant</button></p>
          <dl><div><dt>iPhone, iPad (Safari)</dt><dd>Le bouton Partager, puis «\u00a0Sur l'écran d'accueil\u00a0».</dd></div>
            <div><dt>Android (Chrome)</dt><dd>Le menu à trois points, puis «\u00a0Installer l'application\u00a0» ou «\u00a0Ajouter à l'écran d'accueil\u00a0».</dd></div>
            <div><dt>Ordinateur (Chrome, Edge)</dt><dd>L'icône d'installation, à droite de la barre d'adresse.</dd></div></dl></div></div>`;
      root.append(fenInstall);
      const fermer = () => { fenInstall.hidden = true; document.documentElement.classList.remove('esp-modale-ouverte'); retourInstall?.focus?.(); };
      fenInstall.addEventListener('click', async (ev) => {
        if (ev.target.closest('[data-fermer-install]')) { fermer(); return; }
        if (ev.target.closest('[data-install-go]') && invite) { const i = invite; invite = null; fermer(); try { await i.prompt(); } catch { dire('L\'installation n\'a pas pu démarrer : suivez la marche indiquée pour votre appareil.'); } }
      });
      fenInstall.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape') fermer();
        if (ev.key === 'Tab') { const f = $$('button', fenInstall).filter((x) => x.offsetParent); if (ev.shiftKey && document.activeElement === f[0]) { ev.preventDefault(); f[f.length - 1].focus(); } else if (!ev.shiftKey && document.activeElement === f[f.length - 1]) { ev.preventDefault(); f[0].focus(); } }
      });
    }
    $('[data-install-direct]', fenInstall).hidden = !invite;
    fenInstall.hidden = false; document.documentElement.classList.add('esp-modale-ouverte'); $('[data-fermer-install].esp-rond', fenInstall).focus();
  }

  // ---------- Le menu « Plus d'actions » (voir le site, se déconnecter, tout remettre comme livré) ----------
  const btnPlus = $('[data-esp-plus]', root), panneauPlus = $('[data-esp-plus-panneau]', root);
  function ouvrirPlus(on, rendreFocus = true) {
    if (!btnPlus) return;
    panneauPlus.hidden = !on; btnPlus.setAttribute('aria-expanded', String(on));
    if (on) $('a, button', panneauPlus)?.focus(); else if (rendreFocus) btnPlus.focus();
  }
  document.addEventListener('click', (ev) => { if (btnPlus && !panneauPlus.hidden && !ev.target.closest('[data-esp-plus], [data-esp-plus-panneau]')) ouvrirPlus(false, false); });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && btnPlus && !panneauPlus.hidden) { ouvrirPlus(false); return; }
    /* Ctrl ou Cmd + Z, hors d'un champ : annule la dernière action. */
    if ((ev.ctrlKey || ev.metaKey) && !ev.shiftKey && ev.key.toLowerCase() === 'z' && root.classList.contains('est-connecte') && !ev.target.closest('input, textarea, select, [contenteditable]') && depot.peutAnnuler()) { ev.preventDefault(); annuler(); }
  });

  // ---------- Les clics : un geste, une action ----------
  const basculeService = (nom, sv, on, msgOn, msgOff, sel) => { agir(nom, { date: etat.jour, service: sv, actif: on }, { msg: on ? msgOn : msgOff, lien: D.pages.reserver }); rendre(); $(`[${sel}="${sv}"]`, root)?.focus(); };
  root.addEventListener('click', (ev) => {
    const t = ev.target;
    if (t.closest('[data-esp-plus]')) { ouvrirPlus(panneauPlus.hidden); return; }
    const nav = t.closest('[data-esp-vue]'); if (nav) { etat.evEdite = null; allerVue(nav.dataset.espVue); return; }
    const al = t.closest('[data-aller]'); if (al) { if (al.dataset.onglet) etat.onglet = al.dataset.onglet; if (al.dataset.aller === 'resas') etat.ongletResas = al.dataset.ongletResas || 'agenda'; etat.evEdite = al.dataset.editer || null; allerVue(al.dataset.aller); if (al.dataset.modele) viser(document.getElementById(`modele-${al.dataset.modele}`)); return; }
    if (vClient.clic(t)) return;
    const ogr = t.closest('[data-onglets-resas]'); if (ogr) { etat.ongletResas = ogr.dataset.onglet; etat.ajoutOuvert = false; etat.resaAPlacer = null; etat.tableVue = null; rendre(); $(`#onglet-resas-${etat.ongletResas}`, root)?.focus(); return; }
    if (t.closest('[data-esp-installer]')) { ouvrirPlus(false, false); ouvrirInstaller(btnPlus); return; }
    if (vCarte.clic(t) || vPropose.clic(t) || vService.clic(t) || vSalle.clic(t)) return;
    const og = t.closest('[role="tab"][data-onglet]'); if (og) { etat.onglet = og.dataset.onglet; etat.evEdite = null; rendre(); $(`#onglet-${etat.onglet}`, root)?.focus(); return; }
    if (vDemandes.clic(t)) return;
    const st = t.closest('[data-statut]'); if (st) { const id = st.dataset.id, s = st.dataset.statut, restait = enAttenteTotal(), repond = ['confirmee', 'refusee'].includes(s);
      /* Revenir sur « arrivés », « absent », « annulée » ou « refusée » : la réservation est simplement remise à « confirmée ». */
      const avant = st.closest('[data-resa]')?.className.match(/est-(arrivee|absente|annulee|refusee)/)?.[1];
      const ok = agir('statut', { id, statut: s }, { msg: avant && s === 'confirmee' ? 'Réservation remise à « confirmée ».' : MSG_STATUT[s] || 'Enregistré.' }); rendre();
      if (ok && repond && restait > 0 && !enAttenteTotal()) { dire(`${MSG_STATUT[s].split(' : ')[0]}. Tout a une réponse : bon service !`, { annuler: true }); feter(); } ($(`[data-resa="${CSS.escape(id)}"] button`, root) || $(`#vue-${etat.vue}`, root))?.focus({ preventScroll: true }); return; }
    const j = t.closest('[data-jour]'); if (j) { etat.jour = j.dataset.jour; rendre(); $(`[data-jour="${etat.jour}"]`, root)?.focus(); return; }
    const sm = t.closest('[data-semaine]'); if (sm) { etat.jour = ajouter(etat.jour, +sm.dataset.semaine); rendre(); $(`[data-semaine="${sm.dataset.semaine}"]`, root)?.focus(); return; }
    const aj = t.closest('[data-ajouter]'); if (aj) { etat.ajoutOuvert = !etat.ajoutOuvert; rendre(); (etat.ajoutOuvert ? $('#aj-nom', root) : $('[data-ajouter]', root))?.focus(); return; }
    const cp = t.closest('[data-complet]'); if (cp) { basculeService('complet', cp.dataset.complet, cp.getAttribute('aria-pressed') !== 'true', 'Service complet : la réservation en ligne ne le propose plus.', 'Le service est de nouveau proposé.', 'data-complet'); return; }
    const oe = t.closest('[data-ouvrir-exc]'); if (oe) { const sv = oe.dataset.ouvrirExc, on = oe.getAttribute('aria-pressed') !== 'true'; agir('ouvertureExceptionnelle', { date: etat.jour, service: sv, actif: on }, { msg: on ? 'Ouverture exceptionnelle : la réservation en ligne propose ce service ce jour-là.' : 'Ouverture exceptionnelle retirée.', lien: D.pages.reserver }); rendre(); $(`[data-ouvrir-exc="${sv}"]`, root)?.focus(); return; }
    const fm = t.closest('[data-fermer]'); if (fm) { basculeService('fermer', fm.dataset.fermer, fm.getAttribute('aria-pressed') !== 'true', 'Service fermé ce jour-là : plus de réservation en ligne.', 'Service rouvert.', 'data-fermer'); return; }
    // Événements
    const ed = t.closest('[data-editer]'); if (ed) { etat.evEdite = ed.dataset.editer; rendre(); scrollTo({ top: 0, behavior: 'instant' }); $('#ev-titre', root)?.focus(); return; }
    if (t.closest('[data-nouvel-ev]')) { etat.evEdite = 'ev-' + Date.now().toString(36); rendre(); scrollTo({ top: 0, behavior: 'instant' }); $('#ev-titre', root)?.focus(); return; }
    if (t.closest('[data-fermer-ev]')) { const id = etat.evEdite; etat.evEdite = null; rendre(); ($(`[data-editer="${CSS.escape(id)}"]`, root) || $('[data-nouvel-ev]', root))?.focus(); return; }
    const vis = t.closest('[data-visible]'); if (vis) { const id = vis.dataset.visible, on = vis.getAttribute('aria-pressed') !== 'true'; agir('visibilite', { id, visible: on, agenda: D.agenda }, { msg: on ? 'Événement affiché sur le site.' : 'Événement masqué sur le site.', lien: D.pages.fetes }); rendre(); $(`[data-visible="${CSS.escape(id)}"]`, root)?.focus(); return; }
    if (t.closest('[data-supprimer-ev]')) { const id = etat.evEdite; agir('supprimerEvenement', { id, agenda: D.agenda }, { msg: 'Événement supprimé.' }); etat.evEdite = null; rendre(); $('[data-nouvel-ev]', root)?.focus(); return; }
    const cph = t.closest('[data-choisir-photo]'); if (cph) { ouvrirModale(cph.dataset.choisirPhoto, cph); return; }
    const rph = t.closest('[data-retablir-photo]'); if (rph) { const id = rph.dataset.retablirPhoto; agir('retablirPhoto', { emplacement: id }, { msg: 'Photo d\'origine rétablie.' }); rendre(); $(`[data-choisir-photo="${id}"]`, root)?.focus(); return; }
    // Textes et horaires
    const ann = t.closest('[data-annonce-active]'); if (ann) { const on = ann.getAttribute('aria-pressed') !== 'true', champ = $('#an-texte', root), txt = champ.value.trim() || 'Fermeture annuelle du 4 au 18 janvier : à très vite !'; if (!agir('annonce', { active: on, texte: txt }, { msg: on ? 'Annonce affichée sur toutes les pages.' : 'Annonce retirée.', lien: D.pages.accueil })) return; /* refusé : la bascule ne bouge pas */ ann.setAttribute('aria-pressed', String(on)); if (on && !champ.value.trim()) champ.value = txt; return; }
    const rf = t.closest('[data-retirer-fermeture]'); if (rf) { agir('retirerFermeture', { index: +rf.dataset.retirerFermeture }, { msg: 'Fermeture retirée.', lien: D.pages.infos }); rendre(); $('#fe-du', root)?.focus(); return; }
    if (t.closest('[data-ajouter-plat]')) { const ol = $('.esp-ardoise__lignes', t.closest('[data-ardoise]')), n = ol.children.length + 1; ol.insertAdjacentHTML('beforeend', `<li><input name="plat" aria-label="Plat ${n}" placeholder="Nouveau plat"><input name="prix" aria-label="Prix du plat ${n}" class="esp-prix" placeholder="00 €"><button type="button" class="esp-rond esp-rond--petit" data-retirer-plat aria-label="Retirer ce plat">×</button></li>`); ol.lastElementChild.querySelector('input').focus(); return; }
    if (t.closest('[data-retirer-plat]')) { const li = t.closest('li'), fs = li.closest('[data-ardoise]'); li.remove(); sauverArdoise('Plat retiré de l\'ardoise.'); $('[data-ajouter-plat]', fs)?.focus(); return; }
    const rt = t.closest('[data-retablir-texte]'); if (rt) { const cle = rt.dataset.retablirTexte; agir('texte', { cle, valeur: '' }, { msg: 'Texte d\'origine rétabli.', lien: D.textes.find((x) => x.cle === cle)?.url }); rendre(); $(`[name="${CSS.escape(cle)}"]`, root)?.focus(); return; }
    if (t.closest('[data-esp-quitter]')) { try { sessionStorage.removeItem('jh-espace-session'); } catch { /* rien */ } ouvrirPlus(false, false); if (API) { depot.deconnecter(); viderEcrans(); } montrer(false); return; }
    if (t.closest('[data-tout-effacer]')) { ouvrirPlus(false, false); if (!depot.toutEffacer({ libelle: 'Tout remettre comme livré' })) { dire('Votre navigateur a refusé d\'effacer : rien n\'a été remis comme livré.'); return; } contexte = null; etat.evEdite = null; dire('Tout est revenu comme à la livraison.', { annuler: true }); rendre(); $(`#vue-${etat.vue}`, root)?.focus({ preventScroll: true }); }
  });

  // ---------- Saisie : enregistrée au fil de l'eau ----------
  function sauverArdoise(msg = 'Ardoise enregistrée.') {
    const f = $('[data-form-ardoise]', root); if (!f) return;
    const lire1 = (k) => { const fs = $(`[data-ardoise="${k}"]`, f); return { titre: fs.querySelector('[name="titre"]').value, lignes: $$('.esp-ardoise__lignes li', fs).map((li) => ({ plat: li.querySelector('[name="plat"]').value.trim(), prix: li.querySelector('[name="prix"]').value.trim() })).filter((l) => l.plat || l.prix), mot: fs.querySelector('[name="mot"]').value }; };
    agir('ardoise', { ardoise: { jour: lire1('jour'), soir: lire1('soir') } }, { msg, lien: D.pages.carte, groupe: 'ardoise' });
  }
  function sauverHoraires() {
    const f = $('[data-form-horaires]', root); if (!f) return;
    const semaine = Object.fromEntries(SEMAINE.map((j) => [j, ['midi', 'soir'].filter((sv) => f.elements[`${j}-${sv}`].checked).map((sv) => { const fin = f.elements[`${j}-${sv}-f`].value; return `${f.elements[`${j}-${sv}-d`].value}-${fin === '23:59' ? '00:00' : fin}`; })]));
    for (const j of SEMAINE) for (const sv of ['midi', 'soir']) { const on = f.elements[`${j}-${sv}`].checked; f.elements[`${j}-${sv}`].closest('.esp-plage').classList.toggle('est-off', !on); f.elements[`${j}-${sv}-d`].disabled = !on; f.elements[`${j}-${sv}-f`].disabled = !on; }
    agir('horaires', { semaine }, { msg: 'Horaires enregistrés : le statut du site et la réservation les suivent.', lien: D.pages.infos, groupe: 'horaires' });
  }
  root.addEventListener('input', (ev) => {
    const t = ev.target;
    if (vDemandes.saisie(t) || vCarte.saisie(t)) return;
    if (t.id === 'an-texte') { $('[data-compte]', root).textContent = `${t.value.length} / 160`; $('[data-annonce-apercu]', root).textContent = t.value || '…'; plus_tard(() => agir('annonce', { texte: t.value.trim() }, { msg: 'Annonce enregistrée.', lien: D.pages.accueil, groupe: 'annonce-texte' }), 'annonce'); return; }
    if (t.closest('[data-form-ardoise]')) { plus_tard(() => sauverArdoise(), 'ardoise'); return; }
    if (t.closest('[data-form-textes]')) { const cle = t.name, x = D.textes.find((y) => y.cle === cle); plus_tard(() => agir('texte', { cle, valeur: t.value, defaut: x?.defaut }, { msg: 'Texte enregistré : visible sur le site, dans ce navigateur.', lien: x?.url, groupe: `texte-${cle}` }), `texte-${cle}`); return; }
    if (t.closest('[data-editeur]')) apercuBillet(t.closest('[data-editeur]'));
  });
  root.addEventListener('change', (ev) => { if (ev.target.closest('[data-form-horaires]')) sauverHoraires(); });
  root.addEventListener('submit', (ev) => {
    ev.preventDefault(); const f = ev.target;
    if (vService.envoi(f)) return;
    if (f.matches('[data-esp-connexion]')) {
      if (!API) { try { sessionStorage.setItem('jh-espace-session', '1'); } catch { /* rien */ } montrer(true); return; }
      /* Mode connecté : une vraie connexion. Rien n'est gardé dans le navigateur, la session est un cookie que le script ne lit pas. */
      const b = $('button[type="submit"]', f), m = $('[data-esp-connexion-message]', f); b.disabled = true; b.textContent = 'Connexion…'; m.hidden = true;
      depot.connecter(f.elements.identifiant.value, f.elements.mdp.value).then(() => { f.elements.mdp.value = ''; entrerConnecte(); }, (err) => { m.textContent = err.message; m.hidden = false; f.elements.mdp.focus(); })
        .finally(() => { b.disabled = false; b.textContent = 'Se connecter'; });
      return;
    }
    if (f.matches('[data-form-ajout]')) {
      const v = Object.fromEntries(new FormData(f)); if (!v.nom.trim()) { f.elements.nom.focus(); return; }
      /* Les règles disent si c'est possible (fermé, heure hors service, couverts hors limites) : sinon rien n'est noté et le formulaire reste ouvert. */
      const resa = { id: 'tel-' + Date.now().toString(36), date: etat.jour, service: v.service, heure: v.heure, couverts: Math.round(+v.couverts), nom: v.nom.trim(), telephone: v.telephone.trim(), demande: v.demande.trim(), espace: 'salle', statut: 'confirmee', source: 'telephone' }, verdict = verifierResa(ctx(), S(), resa);
      if (!agir('ajouterResa', { resa }, { msg: verdict.alerte === 'complet' ? 'Réservation ajoutée. Ce service est dit complet : elle s\'ajoute en plus, à votre décision.' : 'Réservation ajoutée à l\'agenda.' })) return;
      etat.ajoutOuvert = false; rendre(); $('[data-ajouter]', root)?.focus(); return;
    }
    if (f.matches('[data-form-fermeture]')) {
      const du = f.elements.du.value; if (!du) return;
      agir('ajouterFermeture', { du, au: f.elements.au.value, motif: f.elements.motif.value }, { msg: 'Fermeture ajoutée : le site affichera « fermé » ces jours-là.', lien: D.pages.infos });
      rendre(); $('#fe-du', root)?.focus(); return;
    }
    if (f.matches('[data-editeur]')) {
      const v = Object.fromEntries(new FormData(f)); if (!v.titre.trim()) { f.elements.titre.focus(); return; }
      const id = f.dataset.id, p = f._photo, base = D.agenda.find((x) => x.id === id);
      const champs = { titre: v.titre.trim(), type: v.type, debut: v.debut, service: v.service, prix: v.prix.trim(), image: p.image || base?.image || 'vraie/salle-pierre', l: p.l, src: p.src || null, cadrage: p.cadrage };
      if (agir('evenement', { id, champs, agenda: D.agenda }, { msg: 'Événement enregistré : visible sur la page Les fêtes.', lien: D.pages.fetes })) { etat.evEdite = null; rendre(); $(`[data-editer="${CSS.escape(id)}"]`, root)?.focus(); }
    }
  });

  // ---------- Connexion : dedans, l'espace est une application (l'en-tête et le pied du site s'effacent) ----------
  function montrer(dedans) {
    $('[data-esp-connexion]', root).hidden = dedans; $('[data-esp-app]', root).hidden = !dedans; $('[data-esp-outils]', root).hidden = !dedans;
    root.classList.toggle('est-connecte', dedans); document.documentElement.classList.toggle('esp-dedans', dedans);
    if (dedans) { let v = 'jour'; try { v = sessionStorage.getItem('jh-espace-vue') || 'jour'; } catch { /* rien */ } if (!$(`[data-vue="${v}"]`, root)) v = 'jour'; allerVue(v, false); $('[data-esp-vue][aria-current]', root)?.focus({ preventScroll: true }); }
    else { scrollTo({ top: 0, behavior: 'instant' }); $('#esp-id', root)?.focus({ preventScroll: true }); }
  }
  // ---------- En direct : une demande faite sur le site dans un autre onglet arrive pendant que l'espace est ouvert ----------
  const idsSite = () => [...depot.resasSite(), ...depot.demandesSite()].map((x) => x.id);
  let connus = new Set(idsSite());
  depot.ecouter(() => {
    contexte = null; const neufs = idsSite().filter((id) => !connus.has(id)); connus = new Set(idsSite());
    if (!root.classList.contains('est-connecte')) return;
    rendre(); if (!neufs.length) return;
    const id = neufs[neufs.length - 1], r = depot.resasSite().find((x) => x.id === id), d = r ? null : normaliser(depot.demandesSite().find((x) => x.id === id));
    const quoi = r ? `${[r.prenom, r.nom].filter(Boolean).join(' ') || 'Une table'}, ${pluriel(+r.couverts || 2, 'couvert')}, ${fmt(r.date)} à ${heure(r.heure)}` : `${d.qui}, ${GENRES[d.genre].nom.toLowerCase()} : ${d.titre}`;
    dire(`Nouvelle demande depuis le site : ${quoi}.`, { action: { libelle: 'Voir', faire: () => { etat.filtreDemandes = 'tout'; etat.demandeOuverte = d ? id : null; allerVue('demandes'); viser($(`[data-resa="${CSS.escape(id)}"], [data-demande="${CSS.escape(id)}"]`, root), 'center'); } } });
    for (const b of $$('[data-esp-badge="demandes"]', root)) { b.classList.remove('est-neuf'); void b.offsetWidth; b.classList.add('est-neuf'); }
  });

  /* Mode connecté : les réglages et le plan du serveur remplacent ceux de la page (les mêmes objets, pour toutes les vues),
     puis l'espace suit ce qui change sur les autres appareils. Un formulaire ouvert n'est pas redessiné : sa saisie est gardée. */
  function entrerConnecte() {
    const reg = depot.reglages(); if (reg) { for (const k of Object.keys(R)) delete R[k]; Object.assign(R, reg); }
    const tb = depot.tables(); if (tb.length) D.salle.tables = tb.filter((t) => t.active).map((t) => ({ id: t.id, zone: t.zone, places: t.places, forme: t.forme, ...t.plan }));
    contexte = null; jourConnu = A.iso; etat.jour = A.iso; montrer(true);
    const c = depot.compte(), bouton = $('[data-tout-effacer]', root), ROLES = { direction: 'Direction', accueil: 'Accueil', edition: 'Édition' };
    if (bouton) { bouton.textContent = 'Remettre les rubriques non partagées comme livrées';
      let n = $('[data-esp-partage]', root); if (!n) { n = document.createElement('p'); n.className = 'esp-menu__note'; n.dataset.espPartage = ''; bouton.before(n); }
      n.textContent = typo(`Connecté : ${c.nom || c.email} (${ROLES[c.role] || c.role}). Partagé entre vos appareils : réservations, plan de salle, complets, fermetures et horaires. Encore dans ce navigateur seulement : carte, soirées, textes, photos, autres demandes, fiches clients.`); }
    depot.suivre(() => { contexte = null; if (etat.ajoutOuvert || etat.resaEditee || etat.evEdite || etat.platEdite || document.documentElement.classList.contains('esp-modale-ouverte')) return; rendre(); });
  }
  if (API) {
    document.documentElement.classList.remove('esp-dedans');
    const f = $('[data-esp-connexion]', root), env = ENVIRONNEMENT === 'production' ? '' : (ENVIRONNEMENT || 'recette');
    f.elements.identifiant.value = ''; f.elements.mdp.value = ''; f.elements.identifiant.type = 'email'; f.elements.identifiant.autocomplete = 'username'; f.elements.identifiant.required = true; f.elements.mdp.required = true;
    $('label[for="esp-id"]', f).textContent = 'Adresse e-mail'; $('.esp-connexion__texte', f).textContent = `Espace de l'équipe${env ? ` (${env})` : ''} : les réservations sont partagées entre tous vos appareils.`; $('button[type="submit"]', f).textContent = 'Se connecter';
    const m = document.createElement('p'); m.className = 'esp-connexion__erreur'; m.setAttribute('role', 'alert'); m.dataset.espConnexionMessage = ''; m.hidden = true; $('button[type="submit"]', f).before(m);
    for (const d of $$('.esp-demo', root)) d.innerHTML = env ? `<span class="esp-long">${e(maj(env))}</span><span class="esp-court">${e(maj(env.slice(0, 4)))}</span>` : '<span class="esp-long">Équipe</span><span class="esp-court">Équipe</span>';
    depot.reprendre().then((ok) => { if (ok && depot.compte()) entrerConnecte(); });
  } else {
    let session = false; try { session = sessionStorage.getItem('jh-espace-session') === '1'; } catch { /* rien */ }
    if (session) montrer(true); else document.documentElement.classList.remove('esp-dedans');
  }
}
