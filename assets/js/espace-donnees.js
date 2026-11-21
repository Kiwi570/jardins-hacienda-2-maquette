/* La couche de données de l'espace restaurateur (v7.7.0) : tout ce que l'espace lit ou change passe par ici.
   - MUTATIONS : chaque geste du restaurateur est une action nommée, une fonction pure qui modifie une copie de l'état
     (testées par `node --test _audit/tests/*.test.mjs`).
   - creerDepot(stockage) : garde l'état en mémoire, applique une action, l'enregistre par le stockage (espace-stock.js
     aujourd'hui, une API demain : même contrat lire / ecrire / vider / resasSite / ecrireResasSite / demandesSite /
     ecrireDemandesSite / ecouter), prévient les
     abonnés, et sait revenir en arrière (« Annuler »).
   Pour passer au réel : remplacer le stockage ; les écrans et les actions ne changent pas. */
import * as stockLocal from './espace-stock.js?v=7';
import { listeEvenements, typo } from './espace-regles.js?v=7';
import { MUTATIONS_CARTE } from './espace-carte.js?v=7';
import { MUTATIONS_CONSEILS } from './espace-conseils.js?v=7';
import { MUTATIONS_SERVICE } from './espace-service.js?v=7';
import { MUTATIONS_SALLE } from './espace-salle.js?v=7';
import { MUTATIONS_CLIENTS } from './espace-clients.js?v=7';
import { MUTATIONS_TACHES } from './espace-taches.js?v=7';
import { MUTATIONS_PRESENCE } from './espace-presence.js?v=7';
import { MUTATIONS_ATTENTE } from './espace-attente.js?v=7';
import { MUTATIONS_REPLI } from './espace-repli.js?v=7';
import { MUTATIONS_VENUE } from './espace-venue.js?v=7';
import { MUTATIONS_RECEPTIONS } from './espace-receptions.js?v=7';
export { estVide } from './espace-stock.js?v=7';

const basculer = (liste = [], valeur, actif) => [...new Set([...liste.filter((x) => x !== valeur), ...(actif ? [valeur] : [])])];
const sansVide = (o, k) => { if (o[k] && !Object.keys(o[k]).length) delete o[k]; };

export const MUTATIONS = {
  /* Réservations */
  statut(S, { id, statut }) { ((S.resa ||= {}).statuts ||= {})[id] = statut; },
  /* Un service (`service`) ou plusieurs d'un coup (`services`), pour un jour. */
  complet(S, { date, service, services, actif }) { const c = ((S.resa ||= {}).complets ||= {}); for (const sv of services || [service]) c[date] = basculer(c[date], sv, actif); if (!c[date].length) delete c[date]; },
  fermer(S, { date, service, services, actif }) { const c = ((S.resa ||= {}).fermes ||= {}); for (const sv of services || [service]) c[date] = basculer(c[date], sv, actif); if (!c[date].length) delete c[date]; },
  ajouterResa(S, { resa }) { ((S.resa ||= {}).ajouts ||= []).push(resa); },
  /** Ouvre exceptionnellement un service que la semaine tient fermé (ou retire cette ouverture) ; v7.8.0. */
  ouvertureExceptionnelle(S, { date, service, actif = true, note = '' }) {
    const l = ((S.resa ||= {}).ouvertures || []).filter((x) => !(x.date === date && x.service === service));
    if (actif) l.push({ date, service, ...(note ? { note: String(note).trim().slice(0, 80) } : {}) });
    if (l.length) S.resa.ouvertures = l.sort((a, b) => a.date.localeCompare(b.date) || a.service.localeCompare(b.service)); else delete S.resa.ouvertures;
  },
  /* Annonce, fermetures, horaires, ardoise, textes */
  annonce(S, { active, texte }) { S.annonce = { active: active ?? !!S.annonce?.active, texte: texte ?? S.annonce?.texte ?? '' }; },
  ajouterFermeture(S, { du, au, motif }) {
    const l = ((S.horaires ||= {}).exceptions ||= []);
    l.push({ du, au: au && au >= du ? au : du, motif: (motif || '').trim() || 'Fermeture exceptionnelle' }); l.sort((a, b) => a.du.localeCompare(b.du));
  },
  retirerFermeture(S, { index }) { S.horaires?.exceptions?.splice(index, 1); if (S.horaires && !S.horaires.exceptions?.length) delete S.horaires.exceptions; },
  horaires(S, { semaine }) { (S.horaires ||= {}).semaine = semaine; },
  ardoise(S, { ardoise }) { S.ardoise = ardoise; },
  /* Les textes sont gardés avec la typographie française ; le texte d'origine (ou un champ vidé) ne laisse rien. */
  texte(S, { cle, valeur, defaut }) { S.textes ||= {}; const v = typo((valeur || '').trim()); if (!v || v === typo(defaut || '')) delete S.textes[cle]; else S.textes[cle] = v; sansVide(S, 'textes'); },
  /* Demandes (réceptions, traiteur, cartes cadeaux, questions) : l'étape où elles en sont, une note du restaurant */
  etapeDemande(S, { id, statut }) { ((S.demandes ||= {}).statuts ||= {})[id] = statut; },
  noteDemande(S, { id, note }) { const n = ((S.demandes ||= {}).notes ||= {}), v = (note || '').trim(); if (v) n[id] = v; else delete n[id]; sansVide(S.demandes, 'notes'); sansVide(S, 'demandes'); },
  /* Les messages aux clients : un modèle retouché ; le texte d'origine (ou un champ vidé) ne laisse rien */
  modeleMessage(S, { cle, texte, defaut }) { S.messages ||= {}; const v = typo((texte || '').trim()); if (!v || v === typo(defaut || '')) delete S.messages[cle]; else S.messages[cle] = v; sansVide(S, 'messages'); },
  /* La carte (v7.7.3) : plat, ajouterPlat, platVisible, epuise (espace-carte.js) */
  ...MUTATIONS_CARTE,
  /* « L'espace vous propose » (v7.7.4) : taireConseil (espace-conseils.js) */
  ...MUTATIONS_CONSEILS,
  /* Le service (v7.7.5) : modifierResa (espace-service.js) */
  ...MUTATIONS_SERVICE,
  /* Le plan de salle et la fiche client (v7.7.6) : placerResa, placerPlusieurs (espace-salle.js), client (espace-clients.js) */
  ...MUTATIONS_SALLE,
  ...MUTATIONS_CLIENTS,
  ...MUTATIONS_TACHES,
  ...MUTATIONS_PRESENCE,
  ...MUTATIONS_ATTENTE,
  ...MUTATIONS_REPLI,
  ...MUTATIONS_VENUE,
  /* v7.12.0 : les dossiers de réception (un par réception), leurs propositions versionnées, leurs options. */
  ...MUTATIONS_RECEPTIONS,
  /* Photos */
  photo(S, { emplacement, photo }) { (S.photos ||= {})[emplacement] = { ...(S.photos[emplacement] || {}), nom: photo.nom || null, l: photo.l || null, src: photo.src || null }; },
  cadrage(S, { emplacement, cadrage, origine }) { (S.photos ||= {})[emplacement] = { ...origine, ...(S.photos[emplacement] || {}), cadrage }; },
  retablirPhoto(S, { emplacement }) { delete S.photos?.[emplacement]; sansVide(S, 'photos'); },
  /* Événements : `agenda` est la liste livrée avec le site ; la liste résumée suit pour l'accueil et Réserver. */
  evenement(S, { id, champs, agenda }) {
    S.evenements ||= {};
    if (agenda.some((x) => x.id === id)) (S.evenements.modifs ||= {})[id] = { ...(S.evenements.modifs[id] || {}), ...champs };
    else { const l = (S.evenements.ajouts ||= []), i = l.findIndex((x) => x.id === id), x = { id, ...champs }; if (i >= 0) l[i] = { ...l[i], ...x }; else l.push(x); }
    S.evenements.liste = listeEvenements(agenda, S);
  },
  visibilite(S, { id, visible, agenda }) { const m = ((S.evenements ||= {}).modifs ||= {}); m[id] = { ...(m[id] || {}), masque: !visible }; S.evenements.liste = listeEvenements(agenda, S); },
  supprimerEvenement(S, { id, agenda }) {
    if (!S.evenements) return;
    S.evenements.ajouts = (S.evenements.ajouts || []).filter((x) => x.id !== id); delete S.evenements.modifs?.[id];
    S.evenements.liste = listeEvenements(agenda, S);
  },
};

/** Applique une action à une copie de l'état et la renvoie (fonction pure). */
export function appliquer(etat, nom, args) {
  if (!MUTATIONS[nom]) throw new Error(`Action inconnue : ${nom}`);
  const copie = JSON.parse(JSON.stringify(etat || {})); MUTATIONS[nom](copie, args || {}); return copie;
}

const DELAI_GROUPE = 10000, PILE_MAX = 30;

/* ---------- Ce qu'une action a changé, et comment le défaire sans toucher au reste (v7.8.0, v7.8.1) ----------
   « Annuler » ne remet plus tout l'état comme il était : il défait seulement ce que l'action a changé, et seulement si
   personne n'y a retouché depuis (un autre onglet aujourd'hui, un autre appareil demain). Le travail fait ensuite
   ailleurs est gardé ; ce qui n'a pas pu être défait est compté comme un conflit et dit à l'écran.
   v7.8.1 : dans une liste, un élément qui porte un identifiant (`id`) est suivi par cet identifiant, champ par champ.
   Annuler ne réinsère donc jamais une ancienne copie d'une soirée ou d'une réservation que quelqu'un a retouchée :
   la version courante est gardée et le conflit est dit. Les listes calculées (`derives`) ne sont jamais comparées ni
   restaurées : elles sont recalculées depuis les données métier après chaque action et chaque annulation. */
const estObjet = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const egal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const estEntites = (l) => Array.isArray(l) && l.length > 0 && l.every((x) => estObjet(x) && x.id != null);
const pas = (x, k) => (x == null ? undefined : estObjet(k) ? (Array.isArray(x) ? x.find((e) => e?.id === k.id) : undefined) : x[k]);
const lireChemin = (o, c) => c.reduce(pas, o);
/* Pose une valeur ; ne crée jamais une entité qui n'existe plus (renvoie false : c'est un conflit). */
function poserChemin(o, c, v) {
  let x = o;
  for (const k of c.slice(0, -1)) {
    if (estObjet(k)) { x = Array.isArray(x) ? x.find((e) => e?.id === k.id) : undefined; if (!x) return false; }
    else x = estObjet(x[k]) || Array.isArray(x[k]) ? x[k] : (x[k] = {});
  }
  const d = c[c.length - 1]; if (v === undefined) delete x[d]; else x[d] = v; return true;
}
const vide = (v) => (estObjet(v) && !Object.keys(v).length) || (Array.isArray(v) && !v.length);

/**
 * La différence entre deux états : une liste de changements.
 * - { chemin, avant, apres } : une valeur a changé (ou est apparue, ou a disparu) ;
 * - { chemin, entite: 'ajoutee' | 'retiree', v, i } : un élément identifié d'une liste ;
 * - { chemin, liste: true, ajoutes: [{ i, v }], retires: [{ i, v }] } : des éléments sans identifiant ;
 * - { chemin, cree: true } : un objet ou une liste qui n'existait pas (à retirer s'il redevient vide).
 * Un segment de chemin { id } désigne l'élément d'une liste qui porte cet identifiant.
 */
export function difference(avant, apres, chemin = []) {
  if (egal(avant, apres)) return [];
  const listeA = Array.isArray(avant) || (avant === undefined && Array.isArray(apres)), listeB = Array.isArray(apres) || (apres === undefined && Array.isArray(avant));
  if (listeA && listeB) {
    const a = avant || [], b = apres || [], debut = avant === undefined ? [{ chemin, cree: true }] : [];
    if ((estEntites(a) || !a.length) && (estEntites(b) || !b.length) && (a.length || b.length)) {
      const ida = new Set(a.map((x) => x.id)), idb = new Set(b.map((x) => x.id));
      return [...debut, ...a.flatMap((x, i) => (idb.has(x.id) ? difference(x, b.find((y) => y.id === x.id), [...chemin, { id: x.id }]) : [{ chemin, entite: 'retiree', v: x, i }])),
        ...b.flatMap((x, i) => (ida.has(x.id) ? [] : [{ chemin, entite: 'ajoutee', v: x, i }]))];
    }
    const ja = a.map((x) => JSON.stringify(x)), jb = b.map((x) => JSON.stringify(x)), resteB = [...jb], resteA = [...ja], retires = [], ajoutes = [];
    ja.forEach((j, i) => { const k = resteB.indexOf(j); if (k >= 0) resteB.splice(k, 1); else retires.push({ i, v: a[i] }); });
    jb.forEach((j, i) => { const k = resteA.indexOf(j); if (k >= 0) resteA.splice(k, 1); else ajoutes.push({ i, v: b[i] }); });
    if (!ajoutes.length && !retires.length && avant !== undefined && apres !== undefined) return [{ chemin, avant, apres }]; /* le même contenu dans un autre ordre */
    return [...debut, { chemin, liste: true, ajoutes, retires }];
  }
  const objA = estObjet(avant) || avant === undefined, objB = estObjet(apres) || apres === undefined;
  if (objA && objB) {
    const cles = [...new Set([...Object.keys(avant || {}), ...Object.keys(apres || {})])];
    return [...(avant === undefined ? [{ chemin, cree: true }] : []), ...cles.flatMap((k) => difference(avant?.[k], apres?.[k], [...chemin, k]))];
  }
  return [{ chemin, avant, apres }];
}

/**
 * Défait une liste de changements sur l'état courant (une copie est rendue), du dernier au premier.
 * Un changement n'est défait que si la valeur est encore celle que l'action avait posée ; sinon la donnée courante est
 * gardée et son chemin est rendu dans `gardes` (ce qui n'a pas pu être annulé).
 * @returns {{ etat: object, conflits: number, gardes: Array<Array<string|{id:string}>> }}
 */
export function defaire(courant, changements) {
  const etat = JSON.parse(JSON.stringify(courant || {})), gardes = [], conflit = (c) => { gardes.push(c.chemin); };
  for (const c of [...changements].reverse()) {
    const ici = lireChemin(etat, c.chemin);
    if (c.cree) { if (c.chemin.length && vide(ici)) poserChemin(etat, c.chemin, undefined); continue; }
    if (c.entite) {
      const l = Array.isArray(ici) ? ici : [], k = l.findIndex((x) => x?.id === c.v.id);
      if (c.entite === 'ajoutee') { if (k < 0) continue; if (egal(l[k], c.v)) l.splice(k, 1); else conflit({ chemin: [...c.chemin, { id: c.v.id }] }); }
      else if (k >= 0) conflit({ chemin: [...c.chemin, { id: c.v.id }] }); /* quelqu'un l'a recréé : on ne réinsère pas une ancienne copie */
      else if (Array.isArray(ici)) ici.splice(Math.min(c.i, ici.length), 0, c.v);
      else if (!poserChemin(etat, c.chemin, [c.v])) conflit(c);
      continue;
    }
    if (c.liste) {
      const l = Array.isArray(ici) ? [...ici] : [], cle = (x) => JSON.stringify(x);
      for (const a of c.ajoutes) { const k = l.findIndex((x) => cle(x) === cle(a.v)); if (k >= 0) l.splice(k, 1); else conflit(c); }
      for (const r of c.retires) if (!l.some((x) => cle(x) === cle(r.v))) l.splice(Math.min(r.i, l.length), 0, r.v);
      if (c.chemin.length && !poserChemin(etat, c.chemin, l)) conflit(c); continue;
    }
    if (egal(ici, c.apres)) { if (c.chemin.length && !poserChemin(etat, c.chemin, c.avant)) conflit(c); }
    else if (!egal(ici, c.avant)) conflit(c);
  }
  return { etat, conflits: gardes.length, gardes };
}
const parId = (courante, sauvee) => [...courante, ...sauvee.filter((x) => !courante.some((y) => y.id === x.id))];

/**
 * @param {object} [stockage]  le contrat de espace-stock.js (une API demain)
 * @param {function} [horloge]
 * @param {{ garde?: Function, regle?: Function, derives?: Array<{ chemin: string[], calcul: (etat: object) => any }> }} [options]
 *   garde(nom, args, etat) : le garde-fou métier ; s'il rend une phrase, l'action est refusée et rien n'est enregistré.
 *   regle(nom, args, etat) : la forme complète, { refus?, suites?: [{ nom, args }], note? }. Les suites sont des
 *     actions appliquées dans le même enregistrement (une table retirée parce qu'elle ne convient plus) ; la note le dit.
 *   derives : les listes calculées, recalculées après chaque action et chaque annulation, jamais comparées.
 */
export function creerDepot(stockage = stockLocal, horloge = () => Date.now(), { garde, regle, derives = [] } = {}) {
  let etat = stockage.lire(), raison = '', note = '', conflits = 0, gardes = [], partiel = '';
  const pile = [], abonnes = new Set();
  const prevenir = (quoi) => { for (const f of abonnes) f(quoi); };
  const sansDerives = (e) => { if (!derives.length) return e; const c = JSON.parse(JSON.stringify(e)); for (const d of derives) if (lireChemin(c, d.chemin) !== undefined) poserChemin(c, d.chemin, undefined); return c; };
  const deriver = (e) => { for (const d of derives) { const v = d.calcul(e); if (v === undefined) { if (lireChemin(e, d.chemin) !== undefined) poserChemin(e, d.chemin, undefined); } else poserChemin(e, d.chemin, v); } return e; };
  /* Garde de quoi revenir en arrière. Les saisies qui se suivent (même `groupe`) ne font qu'un seul pas en arrière. */
  function retenir(etape, { groupe, libelle } = {}) {
    const dernier = pile[pile.length - 1], t = horloge();
    if (groupe && dernier && dernier.groupe === groupe && t - dernier.t < DELAI_GROUPE) { dernier.t = t; dernier.libelle = libelle || dernier.libelle; dernier.changements.push(...etape.changements); return; }
    pile.push({ ...etape, groupe, libelle, t }); if (pile.length > PILE_MAX) pile.shift();
  }
  return {
    /** L'état courant (ne pas le modifier : passer par agir). */
    etat: () => etat,
    resasSite: () => stockage.resasSite(),
    demandesSite: () => stockage.demandesSite?.() || [],
    /* v7.11.0 : ce que les clients ont fait depuis « Votre venue », et la réponse de l'équipe. */
    venues: () => stockage.venues?.() || {}, noterVenue: (id, champs) => stockage.noterVenue?.(id, champs) !== false,
    /** Recharge l'état quand il a changé ailleurs (autre onglet) et prévient ; renvoie de quoi arrêter l'écoute. */
    ecouter(f) { return stockage.ecouter ? stockage.ecouter((quoi) => { if (quoi === 'etat') etat = stockage.lire(); f(quoi); }) : () => {}; },
    abonner(f) { abonnes.add(f); return () => abonnes.delete(f); },
    /**
     * Applique une action et l'enregistre. L'état est relu juste avant (il a pu changer ailleurs), les règles métier
     * sont consultées, puis l'action et ses suites s'appliquent à cet état frais, en un seul enregistrement. Renvoie
     * false si les règles ou le stockage refusent : rien n'est alors changé, et `raisonRefus()` dit pourquoi.
     */
    agir(nom, args, meta) {
      const frais = stockage.lire(), avis = regle?.(nom, args || {}, frais) || {};
      raison = avis.refus || garde?.(nom, args || {}, frais) || ''; note = '';
      if (raison) { etat = frais; prevenir({ type: 'refus', nom, raison }); return false; }
      let suivant = appliquer(frais, nom, args);
      for (const s of avis.suites || []) suivant = appliquer(suivant, s.nom, s.args);
      deriver(suivant);
      if (!stockage.ecrire(suivant)) { prevenir({ type: 'refus', nom, raison: '' }); return false; }
      const changements = difference(sansDerives(frais), sansDerives(suivant));
      if (changements.length) retenir({ changements }, meta);
      etat = suivant; note = avis.note || ''; prevenir({ type: 'action', nom, t: horloge() });
      return true;
    },
    /** Pourquoi la dernière action a été refusée : la phrase des règles, ou '' si c'est le stockage qui a refusé. */
    raisonRefus: () => raison,
    /** Ce que les règles ont fait en plus de la dernière action réussie (« la table 5 ne convient plus… »), ou ''. */
    noteAction: () => note,
    /**
     * Efface tout ce que l'espace a changé et les demandes venues du site (« Tout remettre comme livré »).
     * Renvoie false si le stockage n'a pas pu effacer : rien n'est alors annoncé comme effacé.
     */
    toutEffacer(meta) {
      const frais = stockage.lire(), site = stockage.resasSite(), demandes = stockage.demandesSite?.() || [];
      if (stockage.vider() === false) { raison = ''; prevenir({ type: 'refus', nom: 'toutEffacer', raison: '' }); return false; }
      retenir({ changements: difference(sansDerives(frais), {}), site, demandes }, meta); etat = stockage.lire(); raison = ''; prevenir({ type: 'action', nom: 'toutEffacer', t: horloge() });
      return true;
    },
    peutAnnuler: () => pile.length > 0,
    /**
     * Défait la dernière action, et elle seule : ce qui a été changé ailleurs depuis est gardé. Renvoie son libellé
     * (ou true), ou false s'il n'y a rien à annuler ou si le stockage refuse. `conflitsAnnulation()` dit combien de
     * changements n'ont pas pu être défaits, `gardesAnnulation()` lesquels, `annulationPartielle()` ce qui n'a pas pu
     * être restauré (les demandes venues du site, si leur écriture échoue).
     */
    annuler() {
      const p = pile.pop(); if (!p) return false;
      const r = defaire(sansDerives(stockage.lire()), p.changements); deriver(r.etat);
      if (!stockage.ecrire(r.etat)) { pile.push(p); prevenir({ type: 'refus', nom: 'annuler', raison: '' }); return false; }
      partiel = '';
      if (p.site && stockage.ecrireResasSite(parId(stockage.resasSite(), p.site)) === false) partiel = 'les réservations venues du site';
      if (p.demandes && stockage.ecrireDemandesSite?.(parId(stockage.demandesSite?.() || [], p.demandes)) === false) partiel = partiel ? 'les réservations et les demandes venues du site' : 'les demandes venues du site';
      etat = r.etat; conflits = r.conflits; gardes = r.gardes; prevenir({ type: 'annulation', t: horloge(), conflits, partiel });
      return p.libelle || true;
    },
    conflitsAnnulation: () => conflits,
    gardesAnnulation: () => gardes,
    annulationPartielle: () => partiel,
  };
}
