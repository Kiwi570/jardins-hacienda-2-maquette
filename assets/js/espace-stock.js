/* Le stockage de l'espace restaurateur (démonstration) : le SEUL fichier qui touche à la mémoire du navigateur.
   Aujourd'hui : trois entrées du localStorage (l'état de l'espace, les réservations et les autres demandes venues du site). Demain : ce fichier se remplace par des appels à une API (ou GitHub pour
   le contenu et une base de données pour les réservations) sans toucher au reste : l'espace passe par espace-donnees.js,
   le site par espace-apercu.js, la page Réserver par ajouterResaSite().
   Toute lecture ou écriture est protégée : stockage plein, bloqué ou navigation privée, la page reste juste.

   Schéma (v7.7.0, numéro dans `_schema`) :
     annonce   { active, texte }
     textes    { [clé data-edit]: texte }
     photos    { [emplacement]: { nom, l, src, cadrage } }
     ardoise   { jour: { titre, lignes: [{ plat, prix }], mot }, soir: … }
     horaires  { semaine: { lundi: ['12:00-14:30'], … }, exceptions: [{ du, au, motif }] }
     resa      { statuts: { [id]: statut }, complets: { [date]: [service] }, fermes: { [date]: [service] }, ajouts: [réservation],
                 modifs: { [id]: { heure, service, couverts, nom, telephone, demande } },   (modifs : v7.7.5)
                 tables: { [id]: table },
                 ouvertures: [{ date, service, note }] }   (ouvertures exceptionnelles posées par le restaurant ; v7.8.0)   (la table où chaque réservation est assise ; '' : retirée ; v7.7.6)
     clients   { [clé]: { habitue, allergies: [nom], note } }   (clé : téléphone, à défaut nom ; v7.7.6)
     evenements{ modifs: { [id]: champs }, ajouts: [événement], liste: [résumé pour l'accueil et Réserver] }
     demandes  { statuts: { [id]: étape }, notes: { [id]: texte } }   (v7.7.2 : réceptions, traiteur, cartes cadeaux, questions)
     messages  { [modèle]: texte }                                    (v7.7.2 : les messages envoyés aux clients)
     carte     { modifs: { [rubrique/rang]: champs }, ajouts: [plat], epuises: { [clé]: date } }   (v7.7.3)
     conseils  { ignores: { [suggestion]: date } }                    (v7.7.4 : « Plus tard », jusqu'au lendemain)
     offres    { modifs: { [id]: champs }, ajouts: [offre], archives: { [id]: quand } }   (v7.13.0 : le catalogue, en préparation)
     publie    { n, carte, ardoise, evenements, offres, historique: [{ n, le, perimetre, id, libelle, resume, avant, apres }] }
               (v7.13.0 : ce que lisent les pages du site ; absent : état d'avant, où tout était aussitôt en ligne)
     v7.13.0 : carte.epuises vaut « AAAA-MM-JJ/soir » (un jour ET un service ; l'ancienne valeur « AAAA-MM-JJ » vaut pour la journée) ;
               carte.ordre { [rubrique]: [clé] } ; carte, ardoise, evenements et offres sont le contenu EN PRÉPARATION (voir espace-offres.js).
   Les clés qui commencent par « _ » sont de l'intendance : elles ne comptent pas comme une modification du site. */
export const SCHEMA = 2;
/* ---------- Le contexte de démonstration (v7.11.1) ----------
   « Lancer une démonstration » ouvre un scénario dans SON propre espace de données : les quatre entrées ci-dessous (et
   l'horloge du scénario) portent alors un préfixe à son nom. Les données habituelles ne sont ni lues ni écrites, et un
   onglet ordinaire resté ouvert ne voit rien passer (il n'écoute que ses propres clés).
   Le contexte appartient à l'onglet : il arrive par l'adresse (`?demo=nom`), puis il est gardé pour la session de
   l'onglet (les liens ordinaires du site le conservent) ; `?demo=` (vide) le quitte. Les liens qui ouvrent un nouvel
   onglet le portent dans leur adresse (`avecContexte`).
   Jamais en mode connecté : une page reliée au serveur n'a pas de contexte de démonstration. */
const CLE_CONTEXTE = 'jh-demo';
/* v7.14.1 : le contexte ne retombe plus en silence sur les données habituelles. Quatre états :
   - 'normal' : l'usage habituel ;
   - 'demo' : un scénario, retenu par l'onglet ;
   - 'fragile' : l'adresse nomme un scénario mais l'onglet ne peut pas le retenir (mémoire de session refusée) : le
     scénario vaut pour cette page, ses liens le portent dans leur adresse (`porterContexte`), et c'est dit ;
   - 'incertain' : la mémoire de session est illisible et l'adresse ne dit rien : on ne sait pas si l'onglet est en
     démonstration. Les saisies temporaires (`temporaire`) ne sont alors ni lues ni écrites : elles restent sur la page. */
let etatContexte = 'normal';
export const CONTEXTE = (() => {
  let demande = null;   /* null : l'adresse ne dit rien ; '' : elle quitte la démonstration ; 'nom' : elle nomme un scénario */
  try {
    if (typeof document !== 'undefined' && document.querySelector('meta[name="jh-api"]')) return '';
    const q = new URLSearchParams(location.search);
    if (q.has('demo')) { const v = q.get('demo') || ''; demande = /^[a-z0-9-]{1,24}$/.test(v) ? v : ''; }
  } catch { return ''; }
  try {
    if (demande !== null) { if (demande) sessionStorage.setItem(CLE_CONTEXTE, demande); else sessionStorage.removeItem(CLE_CONTEXTE); }
    const garde = sessionStorage.getItem(CLE_CONTEXTE) || '';
    if (demande && garde !== demande) { etatContexte = 'fragile'; return demande; }
    etatContexte = garde ? 'demo' : 'normal'; return garde;
  } catch {
    if (demande) { etatContexte = 'fragile'; return demande; }
    etatContexte = demande === '' ? 'normal' : 'incertain'; return '';
  }
})();
/** L'état du contexte de cet onglet : 'normal', 'demo', 'fragile' ou 'incertain' (voir plus haut). */
export const etatDuContexte = () => etatContexte;
const P = CONTEXTE ? `jh-demo:${CONTEXTE}:` : 'jh-';
const CLE = `${P}espace:v1`, CLE_RESAS = `${P}espace-resas:v1`, CLE_DEMANDES = `${P}espace-demandes:v1`, CLE_VENUES = `${P}espace-venues:v1`, CLE_HORLOGE = `${P}horloge:v1`;
/** Une adresse du site, avec le contexte de démonstration de cet onglet (pour un lien qui ouvre un nouvel onglet). */
export const avecContexte = (url) => (CONTEXTE && !/[?&]demo=/.test(url) ? url.replace(/(#.*)?$/, (ancre) => `${url.includes('?') ? '&' : '?'}demo=${CONTEXTE}${ancre}`) : url);
/** L'heure simulée du scénario en cours : { iso, min }, ou null hors démonstration (l'horloge normale sert alors). */
export function horloge() { if (!CONTEXTE) return null; try { const h = JSON.parse(localStorage.getItem(CLE_HORLOGE) || 'null'); return h && /^\d{4}-\d{2}-\d{2}$/.test(h.iso) && Number.isFinite(h.min) ? { iso: h.iso, min: h.min } : null; } catch { return null; } }
const journal = () => { try { const h = JSON.parse(localStorage.getItem(CLE_HORLOGE) || 'null'); return h && typeof h === 'object' ? h : {}; } catch { return {}; } };
export function reglerHorloge(h) { if (!CONTEXTE) return false; try { localStorage.setItem(CLE_HORLOGE, JSON.stringify({ ...journal(), iso: h.iso, min: h.min })); return true; } catch { return false; } }
/* Ce qui a été regardé pendant le scénario (un aperçu ouvert, une page visitée) : des repères pour les étapes
   « à essayer », gardés avec l'horloge, hors de l'état de l'espace (ils ne s'annulent pas avec « Annuler »). */
export const vusDemo = () => (CONTEXTE ? journal().vus || {} : {});
export function noterVu(cle) { if (!CONTEXTE) return false; try { const j = journal(); if (j.vus?.[cle]) return false; localStorage.setItem(CLE_HORLOGE, JSON.stringify({ ...j, vus: { ...(j.vus || {}), [cle]: true } })); return true; } catch { return false; } }

/* ---------- L'époque d'un scénario, et les saisies temporaires des pages publiques (v7.14.1) ----------
   Chaque lancement d'un scénario (son premier départ, puis chaque « Recommencer ») porte une ÉPOQUE, gardée avec son
   horloge. Une page du scénario restée ouverte la compare à celle de son chargement : si elle a changé, le scénario a
   été recommencé ailleurs. La page le reconnaît : elle ne réinjecte pas son ancien panier, n'envoie pas son ancien
   brouillon ni une ancienne demande. */
const lireEpoque = () => { if (!CONTEXTE) return ''; try { return String(JSON.parse(localStorage.getItem(CLE_HORLOGE) || 'null')?.epoque || ''); } catch { return ''; } };
let EPOQUE_PAGE = lireEpoque();
/** Le scénario de cet onglet a-t-il été recommencé (ou effacé) depuis le chargement de cette page ? Toujours false hors démonstration. */
export const scenarioRecommence = () => !!CONTEXTE && lireEpoque() !== EPOQUE_PAGE;
/* v7.15.0 : la même décision de contexte vaut jusqu'au dernier enregistrement. Quand le contexte est indéterminable
   (« incertain »), aucune écriture métier n'atteint les données habituelles : ni une saisie temporaire, ni une demande,
   ni une réservation, ni une réponse du client, ni l'état de l'espace. La protection est posée ici, dans le chemin
   commun, quel que soit l'écran ou le geste (bouton, touche Entrée) qui déclenche l'enregistrement. */
const indeterminable = () => etatContexte === 'incertain';
export const MESSAGE_INCERTAIN = 'Ce navigateur ne permet pas de savoir si cet onglet est en démonstration ou en usage normal. Pour ne rien mêler à vos données habituelles, rien n\'a été enregistré. Votre saisie reste sur cette page : rechargez-la, ou ouvrez le site dans une nouvelle fenêtre, puis recommencez.';
/** Pourquoi cette page ne peut rien enregistrer en ce moment ('' si elle le peut) : contexte indéterminable, ou démonstration recommencée ailleurs. */
export const refusEnregistrement = () => (indeterminable() ? MESSAGE_INCERTAIN : scenarioRecommence() ? MESSAGE_RECOMMENCE : '');
export const MESSAGE_RECOMMENCE = 'Cette démonstration a été recommencée dans un autre onglet. Cette page date d\'avant : rechargez-la pour reprendre le parcours. Rien n\'a été envoyé.';
const PREFIXE_TMP = (nom) => `jh-demo:${nom}:tmp:`;
/* Efface les saisies temporaires d'un scénario : celles du navigateur (partagées entre ses onglets) et celles de cet onglet. */
function viderTemporaires(nom) {
  for (const magasin of [() => localStorage, () => sessionStorage]) { try { const m = magasin(), cles = []; for (let i = 0; i < m.length; i++) { const k = m.key(i); if (k && k.startsWith(PREFIXE_TMP(nom))) cles.push(k); } for (const k of cles) m.removeItem(k); } catch { /* stockage indisponible : rien à effacer */ } }
}
/**
 * Une saisie temporaire d'une page publique : le panier À emporter, le brouillon de réservation. Chaque contexte a la
 * sienne ; aucune n'est lue, copiée ou effacée depuis un autre.
 * - Contexte normal : la clé HISTORIQUE (`nom`), avec sa valeur telle quelle — les paniers et brouillons existants sont
 *   retrouvés à l'identique.
 * - Scénario : `jh-demo:<scénario>:tmp:<nom>`, avec l'époque du scénario ; une valeur d'une autre époque n'est pas lue.
 * - Contexte incertain : rien n'est lu ni écrit ; la valeur reste sur la page (`persistant` est false : la page le dit).
 * `session` : la saisie appartient à l'onglet (mémoire de session) au lieu du navigateur.
 */
export function temporaire(nom, { session = false } = {}) {
  const magasin = () => (session ? sessionStorage : localStorage), cle = CONTEXTE ? `${PREFIXE_TMP(CONTEXTE)}${nom}` : nom, muet = etatContexte === 'incertain';
  let memoire = null;
  return {
    cle, persistant: !muet,
    /** La valeur gardée, ou null. */
    lire() {
      if (muet) return memoire;
      try { const brut = magasin().getItem(cle); if (brut == null) return null; const v = JSON.parse(brut); return CONTEXTE ? (v && v.epoque === lireEpoque() ? v.valeur ?? null : null) : v; } catch { return memoire; }
    },
    /** Garde la valeur ; false si elle n'a pas pu l'être (stockage refusé, contexte incertain, scénario recommencé depuis). */
    ecrire(valeur) {
      memoire = valeur; if (muet || scenarioRecommence()) return false;
      try { magasin().setItem(cle, JSON.stringify(CONTEXTE ? { epoque: EPOQUE_PAGE, valeur } : valeur)); return true; } catch { return false; }
    },
    effacer() { memoire = null; if (muet || scenarioRecommence()) return false; try { magasin().removeItem(cle); return true; } catch { return false; } },
    /** Prévient quand la valeur change dans un autre onglet du MÊME contexte ('valeur'), ou quand le scénario est recommencé ('recommence'). */
    ecouter(f) {
      const sur = (ev) => { if (ev.key === CLE_HORLOGE && CONTEXTE) { if (scenarioRecommence()) f('recommence'); } else if (!session && !muet && (ev.key === cle || ev.key === null) && !scenarioRecommence()) f('valeur'); };
      try { addEventListener('storage', sur); } catch { return () => {}; }
      return () => removeEventListener('storage', sur);
    },
  };
}
/** En contexte 'fragile', l'onglet ne retient pas le scénario : chaque lien du site le porte dans son adresse. */
export function porterContexte() {
  if (etatContexte !== 'fragile' || typeof document === 'undefined') return false;
  document.addEventListener('click', (ev) => { const a = ev.target.closest?.('a[href]'); if (!a) return; try { const u = new URL(a.href, location.href); if (u.origin === location.origin && !u.searchParams.has('demo')) { u.searchParams.set('demo', CONTEXTE); a.href = u.href; } } catch { /* adresse illisible : le lien reste tel quel */ } }, true);
  return true;
}
/** Efface les données du scénario de cet onglet, et elles seules (jamais les données habituelles). */
export function viderContexte() { if (!CONTEXTE) return false; try { for (const k of [CLE, CLE_RESAS, CLE_DEMANDES, CLE_VENUES, CLE_HORLOGE]) localStorage.removeItem(k); viderTemporaires(CONTEXTE); return true; } catch { return false; } }
/** Efface les données d'un scénario nommé (pour le relancer depuis le début), où que l'on soit. Le préfixe `jh-demo:<nom>:`
    est le seul touché : les données habituelles (`jh-espace…`) ne peuvent pas l'être. */
/** Ce scénario a-t-il déjà été lancé sur cet appareil (une progression est gardée) ? */
export function scenarioEntame(nom) { try { return /^[a-z0-9-]{1,24}$/.test(nom || '') && !!localStorage.getItem(`jh-demo:${nom}:horloge:v1`); } catch { return false; } }
export function viderScenario(nom) { if (!/^[a-z0-9-]{1,24}$/.test(nom || '') || document.querySelector('meta[name="jh-api"]')) return false;
  try { for (const fin of ['espace:v1', 'espace-resas:v1', 'espace-demandes:v1', 'espace-venues:v1', 'horloge:v1']) localStorage.removeItem(`jh-demo:${nom}:${fin}`); viderTemporaires(nom); return true; } catch { return false; } }
/** Écrit l'état de départ d'un scénario (son contexte uniquement). */
export function semer({ etat, venues: v = {}, horloge: h, demandes = [] }) {
  if (!CONTEXTE) return false;
  try { localStorage.setItem(CLE, JSON.stringify({ ...etat, _schema: SCHEMA })); if (Object.keys(v).length) localStorage.setItem(CLE_VENUES, JSON.stringify(v)); if (demandes.length) localStorage.setItem(CLE_DEMANDES, JSON.stringify(demandes)); /* Un nouveau départ : une nouvelle époque. La page qui sème en fait partie ; les autres pages déjà ouvertes datent d'avant. */
    const epoque = `e${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
    localStorage.setItem(CLE_HORLOGE, JSON.stringify({ iso: h.iso, min: h.min, vus: {}, epoque })); EPOQUE_PAGE = epoque; return true; } catch { return false; }
}

/** Met un objet lu au schéma courant (fonction pure : ne touche pas au stockage).
    1 → 2 : chaque fermeture exceptionnelle a toujours une fin (`au`) et un motif. */
export function migrer(d) {
  if (!d || typeof d !== 'object' || Array.isArray(d)) return {};
  const v = +d._schema || 1;
  if (v < 2 && Array.isArray(d.horaires?.exceptions)) {
    d.horaires.exceptions = d.horaires.exceptions.filter((x) => x && (x.du || x.date)).map((x) => ({ du: x.du || x.date, au: x.au || x.du || x.date, motif: x.motif || 'Fermeture exceptionnelle' }));
  }
  if (Object.keys(d).some((k) => !k.startsWith('_'))) d._schema = SCHEMA;
  return d;
}

export function lire() { try { return migrer(JSON.parse(localStorage.getItem(CLE) || 'null')); } catch { return {}; } }
/** Enregistre tout l'objet ; renvoie false si le navigateur refuse (mémoire pleine, stockage bloqué). */
export function ecrire(d) {
  if (indeterminable()) return false;
  try {
    if (estVide(d)) localStorage.removeItem(CLE); else localStorage.setItem(CLE, JSON.stringify({ ...d, _schema: SCHEMA }));
    return true;
  } catch { return false; }
}
/** Lit, change (f reçoit l'objet), enregistre ; renvoie false si l'enregistrement a échoué (et ne change rien). */
export function changer(f) { const d = lire(); f(d); return ecrire(d); }
/** Efface tout ; false si le navigateur a refusé (rien ne doit alors être annoncé comme effacé). */
export function vider() { if (indeterminable()) return false; try { localStorage.removeItem(CLE); localStorage.removeItem(CLE_RESAS); localStorage.removeItem(CLE_DEMANDES); localStorage.removeItem(CLE_VENUES); return true; } catch { return false; } }
export const estVide = (d) => !d || !Object.keys(d).some((k) => !k.startsWith('_') && d[k] && (typeof d[k] !== 'object' || Object.keys(d[k]).length));

/* Les réservations faites sur la page Réserver de ce navigateur : elles arrivent dans l'agenda de l'espace.
   v7.8.0 : plus de limite à 80 entrées (les plus anciennes étaient effacées sans rien dire) ; si la mémoire du navigateur
   est pleine, l'écriture échoue et le dit (false), elle ne jette plus de données. */
export function resasSite() { try { const l = JSON.parse(localStorage.getItem(CLE_RESAS) || '[]'); return Array.isArray(l) ? l : []; } catch { return []; } }
export function ecrireResasSite(l) { if (indeterminable()) return false; try { if (l?.length) localStorage.setItem(CLE_RESAS, JSON.stringify(l)); else localStorage.removeItem(CLE_RESAS); return true; } catch { return false; } }
/* v7.14.1 : une page d'un scénario recommencé depuis ne dépose plus rien dans le nouveau départ. */
export function ajouterResaSite(r) { if (refusEnregistrement()) return false; const l = resasSite().filter((x) => x.id !== r.id); l.push(r); return ecrireResasSite(l); }

/* Les autres demandes faites sur le site de ce navigateur (v7.7.2) : réception, commande traiteur, carte cadeau, question.
   Chacune porte son genre, un identifiant et l'heure de sa création. */
const liste = (cle) => { try { const l = JSON.parse(localStorage.getItem(cle) || '[]'); return Array.isArray(l) ? l : []; } catch { return []; } };
export const demandesSite = () => liste(CLE_DEMANDES);
export function ecrireDemandesSite(l) { if (indeterminable()) return false; try { if (l?.length) localStorage.setItem(CLE_DEMANDES, JSON.stringify(l)); else localStorage.removeItem(CLE_DEMANDES); return true; } catch { return false; } }
export function ajouterDemandeSite(d) {
  if (refusEnregistrement()) return false;
  const maintenant = new Date();
  return ecrireDemandesSite([...demandesSite(), { id: `${(d.genre || 'demande').charAt(0).toUpperCase()}-${maintenant.getTime().toString(36)}`, cree: maintenant.toISOString(), ...d }]);
}

/* Ce que le client a fait depuis sa page « Votre venue » (v7.11.0), par réservation : reconfirmation, demande de
   modification, complément d'information, annulation ; et la réponse de l'équipe à une demande de modification.
     { [id]: { reconfirmee: date, annulee: date, complement: { texte, cree }, modif: { heure, service, couverts, cree },
               reponse: { acceptee, le, heure, couverts } } }
   Démonstration : ce navigateur seulement. Demain : des appels au serveur, protégés par un jeton propre à la réservation. */
export function venues() { try { const o = JSON.parse(localStorage.getItem(CLE_VENUES) || '{}'); return o && typeof o === 'object' && !Array.isArray(o) ? o : {}; } catch { return {}; } }
export function noterVenue(id, champs) {
  if (refusEnregistrement()) return false;
  try { const o = venues(); o[id] = { ...(o[id] || {}), ...champs }; for (const k of Object.keys(o[id])) if (o[id][k] == null) delete o[id][k]; localStorage.setItem(CLE_VENUES, JSON.stringify(o)); return true; } catch { return false; }
}

/** Prévient quand le stockage change ailleurs (un autre onglet de ce navigateur : une demande arrive pendant que l'espace
    est ouvert). Demain : un abonnement au serveur. Renvoie de quoi arrêter l'écoute. */
export function ecouter(f) {
  const sur = (ev) => { const quoi = ev.key === CLE_RESAS ? 'resas' : ev.key === CLE_DEMANDES ? 'demandes' : ev.key === CLE_VENUES ? 'venues' : ev.key === CLE_HORLOGE ? 'horloge' : ev.key === CLE || ev.key === null ? 'etat' : null; if (quoi) f(quoi); };
  try { addEventListener('storage', sur); } catch { return () => {}; }
  return () => removeEventListener('storage', sur);
}
