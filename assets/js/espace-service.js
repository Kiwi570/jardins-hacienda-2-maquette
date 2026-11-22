/* Le service dans l'espace restaurateur (v7.7.5) : les règles, en fonctions pures (testées par
   `node --test _audit/tests/*.test.mjs`).
   Un service (le midi ou le soir d'un jour) vu comme une frise : chaque réservation occupe la salle de son heure
   d'arrivée jusqu'à la fin de son repas ; la charge dit combien de couverts sont à table à chaque quart d'heure et à
   quelle heure tombe le coup de feu. Et ce qu'on peut faire d'une réservation pendant le service : arrivés, absent,
   la modifier (heure, couverts, note, nom, téléphone), l'annuler.
   La durée d'un repas est une valeur indicative (1 h 30 le midi, 2 h le soir), à régler avec le restaurant. */
import { enMin, hhmm, servicesDe, creneauxDuJour, ouvert, complet, resasDuJour, actives, couverts } from './espace-regles.js?v=7';

import { DUREES_REPAS, dureeRepas } from './disponibilites.js?v=7';

/* La durée d'un repas est définie avec les disponibilités (v7.12.1) : le service, la salle et les réceptions lisent la même. */
export const DUREES = DUREES_REPAS;
/** La durée d'un repas pour un service, en minutes. */
export const dureeDe = dureeRepas;

/**
 * Le service d'un jour : ses bornes, ses réservations placées dans le temps, la charge de la salle.
 * @returns {{ service: string, ouvert: boolean, complet: boolean, debut: number, fin: number, pas: number, resas: object[], charge: { t: number, couverts: number }[], pic: { t: number, couverts: number }|null, couverts: number, tables: number, attendus: number, arrives: number, absents: number }}
 */
export function serviceDuJour(ctx, S, iso, sv) {
  const s = servicesDe(ctx.R).find((x) => x.id === sv), duree = dureeDe(sv), regles = { R: ctx.R, exceptions: ctx.exceptions || [] };
  const tous = resasDuJour(ctx, S, iso).filter((r) => r.service === sv), l = tous.map((r) => ({ ...r, debutMin: enMin(r.heure), finMin: enMin(r.heure) + duree }));
  const pres = actives(l), debut = Math.min(s ? s.d : 0, ...pres.map((r) => r.debutMin)), fin = Math.max((s ? s.f : 0) + duree, ...pres.map((r) => r.finMin)), pas = s?.pas || 15;
  const charge = []; for (let t = debut; t < fin; t += pas) charge.push({ t, couverts: pres.filter((r) => r.debutMin <= t && t < r.finMin).reduce((n, r) => n + (+r.couverts || 0), 0) });
  const pic = charge.reduce((m, c) => (c.couverts > (m?.couverts || 0) ? c : m), null);
  return { service: sv, ouvert: ouvert(regles, S, iso, sv), complet: complet(S, iso, sv), debut, fin, pas, duree, resas: l, charge, pic, couverts: couverts(l), tables: pres.length,
    attendus: l.filter((r) => r.statut === 'confirmee').length, arrives: l.filter((r) => r.statut === 'arrivee').length, absents: l.filter((r) => r.statut === 'absente').length, aConfirmer: l.filter((r) => r.statut === 'a-confirmer').length };
}

/** Le service à montrer d'office : celui qui est ouvert et pas encore fini à l'heure qu'il est (le midi jusqu'à 16 h, le soir ensuite). */
export function serviceCourant(ctx, S, iso, minute) {
  const regles = { R: ctx.R, exceptions: ctx.exceptions || [] }, l = servicesDe(ctx.R).filter((s) => ouvert(regles, S, iso, s.id) || resasDuJour(ctx, S, iso).some((r) => r.service === s.id));
  if (!l.length) return servicesDe(ctx.R)[0]?.id || 'midi';
  return (l.find((s) => minute <= s.f + dureeDe(s.id)) || l[l.length - 1]).id;
}

/** Ce qu'on peut faire d'une réservation, selon où elle en est et le jour : [{ statut, libelle, genre }]. */
export function gestes(r, auj) {
  const g = [], passe = r.date <= auj;
  if (r.statut === 'a-confirmer') g.push({ statut: 'confirmee', libelle: 'Confirmer', genre: 'ok' }, { statut: 'refusee', libelle: 'Refuser', genre: 'non' });
  if (r.statut === 'confirmee' && passe) g.push({ statut: 'arrivee', libelle: 'Arrivés', genre: 'ok' }, { statut: 'absente', libelle: 'Absent', genre: 'non' });
  if (r.statut === 'confirmee' && !passe) g.push({ statut: 'annulee', libelle: 'Annuler la réservation', genre: 'non' });
  if (['arrivee', 'absente', 'annulee', 'refusee'].includes(r.statut)) g.push({ statut: 'confirmee', libelle: r.statut === 'arrivee' ? 'Pas encore arrivés' : 'Remettre la réservation', genre: 'neutre' });
  return g;
}
/** Les heures où l'on peut déplacer une réservation, le même jour : les créneaux des services ouverts. */
export function heuresPossibles(ctx, S, iso) {
  return servicesDe(ctx.R).flatMap((s) => creneauxDuJour(ctx, S, iso, s.id).map((h) => ({ heure: h, service: s.id })));
}

export const MUTATIONS_SERVICE = {
  /** Modifie une réservation (heure, service, couverts, note, nom, téléphone), d'où qu'elle vienne ; son jour ne change pas. */
  modifierResa(S, { id, champs }) {
    const m = (((S.resa ||= {}).modifs ||= {})[id] ||= {});
    for (const k of ['heure', 'service', 'nom', 'telephone', 'demande']) if (k in champs) m[k] = String(champs[k] ?? '').trim();
    if ('couverts' in champs) m.couverts = Math.max(1, Math.min(60, Math.round(+champs.couverts) || 1));
    if (m.heure) m.heure = hhmm(enMin(m.heure));
    /* La table ne convient plus (trop petite, ou prise à la nouvelle heure) : la réservation est à replacer (v7.8.0). */
    if ('table' in champs) ((S.resa.tables ||= {}))[id] = String(champs.table || '');
  },
};
