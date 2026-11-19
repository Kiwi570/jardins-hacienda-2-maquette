/* La fiche client dans l'espace restaurateur (v7.7.6) : les règles, en fonctions pures (testées par
   `node --test _audit/tests/*.test.mjs`).
   Un client se reconnaît à son téléphone, à défaut à son nom. Sa fiche réunit ce que l'agenda sait de lui (ses
   réservations, venues, absences) et ce que la maison note : habitué, allergies, préférences. Ce qui est noté suit le
   client : son allergie s'affiche sur chacune de ses réservations et sur la feuille de service.
   Dans la démonstration, l'agenda ne couvre que la semaine passée et les quatre semaines à venir, et les clients
   d'exemple portent des noms inventés. */
import { ajouter, simplifier, resasDuJour } from './espace-regles.js?v=7';

/** La clé d'un client : son téléphone (chiffres), à défaut son nom. */
export function cleClient(r) {
  const tel = String(r?.telephone || '').replace(/\D/g, ''), nom = simplifier(r?.nom || '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return tel.length >= 6 ? `t${tel}` : nom ? `n-${nom}` : '';
}

/** Ce que la maison a noté d'un client. */
export const notesDe = (S, cle) => ({ habitue: false, allergies: [], note: '', ...(S.clients?.[cle] || {}) });
/** Ce qu'il faut voir sur une réservation de ce client : { habitue, allergies, note }. */
export const marques = (S, r) => notesDe(S, cleClient(r));

/** Toutes les réservations d'un client dans l'agenda (de la semaine passée à dans quatre semaines), de la plus récente à la plus ancienne. */
export function historique(ctx, S, cle, { avant = 7, apres = 28 } = {}) {
  const l = [];
  if (cle) for (let k = -avant; k <= apres; k++) l.push(...resasDuJour(ctx, S, ajouter(ctx.auj, k)).filter((r) => cleClient(r) === cle));
  return l.sort((a, b) => b.date.localeCompare(a.date) || b.heure.localeCompare(a.heure));
}

/**
 * La fiche d'un client.
 * @returns {{ cle: string, nom: string, telephone: string, habitue: boolean, allergies: string[], note: string, resas: object[], venues: number, aVenir: number, absences: number, annulations: number, prochaine: object|null, exemple: boolean }}
 */
export function fiche(ctx, S, cle) {
  const resas = historique(ctx, S, cle), n = notesDe(S, cle), der = resas[0] || {};
  const futures = resas.filter((r) => r.date >= ctx.auj && ['a-confirmer', 'confirmee'].includes(r.statut));
  return { cle, nom: n.nom || der.nom || 'Sans nom', telephone: n.telephone || der.telephone || '', habitue: !!n.habitue, allergies: n.allergies || [], note: n.note || '', resas,
    venues: resas.filter((r) => r.statut === 'arrivee').length, aVenir: futures.length, absences: resas.filter((r) => r.statut === 'absente').length,
    annulations: resas.filter((r) => r.statut === 'annulee').length, prochaine: futures[futures.length - 1] || null, exemple: resas.length > 0 && resas.every((r) => r.source === 'demo') };
}

/**
 * Ce qu'il faut enregistrer d'une fiche ouverte (v7.8.1) : seulement ce que la personne a réellement changé, comparé à
 * l'état de la fiche à son ouverture, et seulement si personne n'a changé la même chose entre-temps.
 * @param {{ habitue: boolean, allergies: string[], note: string }} ouverture  la fiche telle qu'elle était à l'ouverture
 * @param {{ habitue: boolean, allergies: string[], note: string }} saisie     ce que montre le formulaire
 * @param {{ habitue: boolean, allergies: string[], note: string }} courant    la fiche enregistrée maintenant
 * @returns {{ champs: object|null, conflits: string[] }}  champs : à passer à l'action `client` (null : rien à enregistrer) ;
 *          conflits : les champs changés des deux côtés, gardés tels qu'ils sont enregistrés.
 */
export function changementsFiche(ouverture, saisie, courant) {
  const champs = {}, conflits = [];
  for (const k of ['habitue', 'note']) {
    const mien = k === 'note' ? String(saisie.note ?? '').trim() : !!saisie.habitue, avant = k === 'note' ? String(ouverture.note ?? '').trim() : !!ouverture.habitue, ici = k === 'note' ? String(courant.note ?? '').trim() : !!courant.habitue;
    if (mien === avant || mien === ici) continue;          /* pas touché, ou déjà enregistré ainsi */
    if (ici !== avant) conflits.push(k); else champs[k] = mien; /* changé ailleurs aussi : on garde la version enregistrée */
  }
  const avant = new Set(ouverture.allergies || []), mien = new Set(saisie.allergies || []), ici = new Set(courant.allergies || []);
  const plus = [...mien].filter((a) => !avant.has(a) && !ici.has(a)), moins = [...avant].filter((a) => !mien.has(a) && ici.has(a));
  if (plus.length) champs.allergiesPlus = plus; if (moins.length) champs.allergiesMoins = moins;
  return { champs: Object.keys(champs).length ? champs : null, conflits };
}

export const MUTATIONS_CLIENTS = {
  /** Note ce que la maison sait d'un client : habitué, allergies (liste), préférences. */
  client(S, { cle, champs }) {
    if (!cle) return;
    const c = ((S.clients ||= {})[cle] ||= {});
    if ('habitue' in champs) c.habitue = !!champs.habitue;
    if ('allergies' in champs) c.allergies = [...new Set((champs.allergies || []).map((a) => String(a).trim()).filter(Boolean))];
    /* v7.8.1 : une allergie s'ajoute ou se retire une par une, sans toucher à celles notées ailleurs entre-temps. */
    if (champs.allergiesPlus || champs.allergiesMoins) {
      const moins = new Set((champs.allergiesMoins || []).map(String));
      c.allergies = [...new Set([...(c.allergies || []).filter((a) => !moins.has(a)), ...(champs.allergiesPlus || []).map((a) => String(a).trim()).filter(Boolean)])];
    }
    if ('note' in champs) c.note = String(champs.note ?? '').trim().slice(0, 400);
    if (!c.habitue && !c.allergies?.length && !c.note) delete S.clients[cle];
  },
};
