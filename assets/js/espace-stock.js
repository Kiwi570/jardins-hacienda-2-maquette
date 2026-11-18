/* Le stockage de l'espace restaurateur (démonstration) : le SEUL fichier qui touche à la mémoire du navigateur.
   Aujourd'hui : deux entrées du localStorage. Demain : ce fichier se remplace par des appels à une API (ou GitHub pour
   le contenu et une base de données pour les réservations) sans toucher au reste : l'espace passe par espace-donnees.js,
   le site par espace-apercu.js, la page Réserver par ajouterResaSite().
   Toute lecture ou écriture est protégée : stockage plein, bloqué ou navigation privée, la page reste juste.

   Schéma (v7.7.0, numéro dans `_schema`) :
     annonce   { active, texte }
     textes    { [clé data-edit]: texte }
     photos    { [emplacement]: { nom, l, src, cadrage } }
     ardoise   { jour: { titre, lignes: [{ plat, prix }], mot }, soir: … }
     horaires  { semaine: { lundi: ['12:00-14:30'], … }, exceptions: [{ du, au, motif }] }
     resa      { statuts: { [id]: statut }, complets: { [date]: [service] }, fermes: { [date]: [service] }, ajouts: [réservation] }
     evenements{ modifs: { [id]: champs }, ajouts: [événement], liste: [résumé pour l'accueil et Réserver] }
   Les clés qui commencent par « _ » sont de l'intendance : elles ne comptent pas comme une modification du site. */
export const SCHEMA = 2;
const CLE = 'jh-espace:v1', CLE_RESAS = 'jh-espace-resas:v1';

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
export function vider() { try { localStorage.removeItem(CLE); localStorage.removeItem(CLE_RESAS); } catch { /* rien */ } }
export const estVide = (d) => !d || !Object.keys(d).some((k) => !k.startsWith('_') && d[k] && (typeof d[k] !== 'object' || Object.keys(d[k]).length));

/* Les réservations faites sur la page Réserver de ce navigateur : elles arrivent dans l'agenda de l'espace. */
export function resasSite() { try { const l = JSON.parse(localStorage.getItem(CLE_RESAS) || '[]'); return Array.isArray(l) ? l : []; } catch { return []; } }
export function ecrireResasSite(l) { try { if (l?.length) localStorage.setItem(CLE_RESAS, JSON.stringify(l.slice(-80))); else localStorage.removeItem(CLE_RESAS); return true; } catch { return false; } }
export function ajouterResaSite(r) { const l = resasSite().filter((x) => x.id !== r.id); l.push(r); return ecrireResasSite(l); }
