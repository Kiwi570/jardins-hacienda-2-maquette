/* Mémoire de l'espace restaurateur (démonstration, v7.6.0) : un objet dans le localStorage de ce navigateur, lu par
   l'espace (espace.js) et par chaque page du site (espace-apercu.js). Rien ne part ailleurs. Toute lecture ou écriture
   est protégée : stockage plein, bloqué ou navigation privée, la page reste juste. */
const CLE = 'jh-espace:v1', CLE_RESAS = 'jh-espace-resas:v1';

export function lire() { try { return JSON.parse(localStorage.getItem(CLE) || 'null') || {}; } catch { return {}; } }
/** Enregistre tout l'objet ; renvoie false si le navigateur refuse (mémoire pleine, stockage bloqué). */
export function ecrire(d) { try { localStorage.setItem(CLE, JSON.stringify(d)); return true; } catch { return false; } }
/** Lit, change (f reçoit l'objet), enregistre ; renvoie false si l'enregistrement a échoué (et ne change rien). */
export function changer(f) { const d = lire(); f(d); return ecrire(d); }
export function vider() { try { localStorage.removeItem(CLE); localStorage.removeItem(CLE_RESAS); } catch { /* rien */ } }
export const estVide = (d) => !d || !Object.keys(d).some((k) => d[k] && (typeof d[k] !== 'object' || Object.keys(d[k]).length));

/* Les réservations faites sur la page Réserver de ce navigateur : elles arrivent dans l'agenda de l'espace. */
export function resasSite() { try { return JSON.parse(localStorage.getItem(CLE_RESAS) || '[]'); } catch { return []; } }
export function ajouterResaSite(r) { try { const l = resasSite().filter((x) => x.id !== r.id); l.push(r); localStorage.setItem(CLE_RESAS, JSON.stringify(l.slice(-80))); } catch { /* rien */ } }
