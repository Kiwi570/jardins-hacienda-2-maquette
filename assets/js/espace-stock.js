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
const CLE = 'jh-espace:v1', CLE_RESAS = 'jh-espace-resas:v1', CLE_DEMANDES = 'jh-espace-demandes:v1';

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
export function vider() { try { localStorage.removeItem(CLE); localStorage.removeItem(CLE_RESAS); localStorage.removeItem(CLE_DEMANDES); return true; } catch { return false; } }
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

/** Prévient quand le stockage change ailleurs (un autre onglet de ce navigateur : une demande arrive pendant que l'espace
    est ouvert). Demain : un abonnement au serveur. Renvoie de quoi arrêter l'écoute. */
export function ecouter(f) {
  const sur = (ev) => { const quoi = ev.key === CLE_RESAS ? 'resas' : ev.key === CLE_DEMANDES ? 'demandes' : ev.key === CLE || ev.key === null ? 'etat' : null; if (quoi) f(quoi); };
  try { addEventListener('storage', sur); } catch { return () => {}; }
  return () => removeEventListener('storage', sur);
}
