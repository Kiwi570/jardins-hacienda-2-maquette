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
export const CONTEXTE = (() => {
  try {
    if (typeof document !== 'undefined' && document.querySelector('meta[name="jh-api"]')) return '';
    const q = new URLSearchParams(location.search);
    if (q.has('demo')) { const v = q.get('demo') || ''; if (/^[a-z0-9-]{1,24}$/.test(v)) sessionStorage.setItem(CLE_CONTEXTE, v); else sessionStorage.removeItem(CLE_CONTEXTE); }
    return sessionStorage.getItem(CLE_CONTEXTE) || '';
  } catch { return ''; }
})();
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
/** Efface les données du scénario de cet onglet, et elles seules (jamais les données habituelles). */
export function viderContexte() { if (!CONTEXTE) return false; try { for (const k of [CLE, CLE_RESAS, CLE_DEMANDES, CLE_VENUES, CLE_HORLOGE]) localStorage.removeItem(k); return true; } catch { return false; } }
/** Efface les données d'un scénario nommé (pour le relancer depuis le début), où que l'on soit. Le préfixe `jh-demo:<nom>:`
    est le seul touché : les données habituelles (`jh-espace…`) ne peuvent pas l'être. */
/** Ce scénario a-t-il déjà été lancé sur cet appareil (une progression est gardée) ? */
export function scenarioEntame(nom) { try { return /^[a-z0-9-]{1,24}$/.test(nom || '') && !!localStorage.getItem(`jh-demo:${nom}:horloge:v1`); } catch { return false; } }
export function viderScenario(nom) { if (!/^[a-z0-9-]{1,24}$/.test(nom || '') || document.querySelector('meta[name="jh-api"]')) return false;
  try { for (const fin of ['espace:v1', 'espace-resas:v1', 'espace-demandes:v1', 'espace-venues:v1', 'horloge:v1']) localStorage.removeItem(`jh-demo:${nom}:${fin}`); return true; } catch { return false; } }
/** Écrit l'état de départ d'un scénario (son contexte uniquement). */
export function semer({ etat, venues: v = {}, horloge: h, demandes = [] }) {
  if (!CONTEXTE) return false;
  try { localStorage.setItem(CLE, JSON.stringify({ ...etat, _schema: SCHEMA })); if (Object.keys(v).length) localStorage.setItem(CLE_VENUES, JSON.stringify(v)); if (demandes.length) localStorage.setItem(CLE_DEMANDES, JSON.stringify(demandes)); localStorage.setItem(CLE_HORLOGE, JSON.stringify({ iso: h.iso, min: h.min, vus: {} })); return true; } catch { return false; }
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
  try {
    if (estVide(d)) localStorage.removeItem(CLE); else localStorage.setItem(CLE, JSON.stringify({ ...d, _schema: SCHEMA }));
    return true;
  } catch { return false; }
}
/** Lit, change (f reçoit l'objet), enregistre ; renvoie false si l'enregistrement a échoué (et ne change rien). */
export function changer(f) { const d = lire(); f(d); return ecrire(d); }
/** Efface tout ; false si le navigateur a refusé (rien ne doit alors être annoncé comme effacé). */
export function vider() { try { localStorage.removeItem(CLE); localStorage.removeItem(CLE_RESAS); localStorage.removeItem(CLE_DEMANDES); localStorage.removeItem(CLE_VENUES); return true; } catch { return false; } }
export const estVide = (d) => !d || !Object.keys(d).some((k) => !k.startsWith('_') && d[k] && (typeof d[k] !== 'object' || Object.keys(d[k]).length));

/* Les réservations faites sur la page Réserver de ce navigateur : elles arrivent dans l'agenda de l'espace.
   v7.8.0 : plus de limite à 80 entrées (les plus anciennes étaient effacées sans rien dire) ; si la mémoire du navigateur
   est pleine, l'écriture échoue et le dit (false), elle ne jette plus de données. */
export function resasSite() { try { const l = JSON.parse(localStorage.getItem(CLE_RESAS) || '[]'); return Array.isArray(l) ? l : []; } catch { return []; } }
export function ecrireResasSite(l) { try { if (l?.length) localStorage.setItem(CLE_RESAS, JSON.stringify(l)); else localStorage.removeItem(CLE_RESAS); return true; } catch { return false; } }
export function ajouterResaSite(r) { const l = resasSite().filter((x) => x.id !== r.id); l.push(r); return ecrireResasSite(l); }

/* Les autres demandes faites sur le site de ce navigateur (v7.7.2) : réception, commande traiteur, carte cadeau, question.
   Chacune porte son genre, un identifiant et l'heure de sa création. */
const liste = (cle) => { try { const l = JSON.parse(localStorage.getItem(cle) || '[]'); return Array.isArray(l) ? l : []; } catch { return []; } };
export const demandesSite = () => liste(CLE_DEMANDES);
export function ecrireDemandesSite(l) { try { if (l?.length) localStorage.setItem(CLE_DEMANDES, JSON.stringify(l)); else localStorage.removeItem(CLE_DEMANDES); return true; } catch { return false; } }
export function ajouterDemandeSite(d) {
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
  try { const o = venues(); o[id] = { ...(o[id] || {}), ...champs }; for (const k of Object.keys(o[id])) if (o[id][k] == null) delete o[id][k]; localStorage.setItem(CLE_VENUES, JSON.stringify(o)); return true; } catch { return false; }
}

/** Prévient quand le stockage change ailleurs (un autre onglet de ce navigateur : une demande arrive pendant que l'espace
    est ouvert). Demain : un abonnement au serveur. Renvoie de quoi arrêter l'écoute. */
export function ecouter(f) {
  const sur = (ev) => { const quoi = ev.key === CLE_RESAS ? 'resas' : ev.key === CLE_DEMANDES ? 'demandes' : ev.key === CLE_VENUES ? 'venues' : ev.key === CLE_HORLOGE ? 'horloge' : ev.key === CLE || ev.key === null ? 'etat' : null; if (quoi) f(quoi); };
  try { addEventListener('storage', sur); } catch { return () => {}; }
  return () => removeEventListener('storage', sur);
}
