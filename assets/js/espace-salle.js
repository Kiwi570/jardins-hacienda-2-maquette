/* Le plan de salle dans l'espace restaurateur (v7.7.6) : les règles, en fonctions pures (testées par
   `node --test _audit/tests/*.test.mjs`).
   Les tables sont celles du plan de la page Réserver (`donnees/salle.json`) : le client qui a choisi sa table sur le
   site arrive déjà placé. Une table porte les réservations du service qui y sont assises ; elle est libre pour une
   réservation si personne n'y est entre son arrivée et la fin de son repas (durées de `espace-service.js`).
   La terrasse n'ouvre que de juin à septembre, comme sur le site. */
import { actives, enMin } from './espace-regles.js?v=7';
import { serviceDuJour, dureeDe } from './espace-service.js?v=7';

/** La terrasse est-elle ouverte ce jour-là ? De juin à septembre. */
export const terrasseOuverte = (iso) => { const m = +String(iso).slice(5, 7); return m >= 6 && m <= 9; };

/** Les tables d'un jour, avec le nom de leur zone ; celles de la terrasse sont fermées hors saison. */
export function tablesDe(salle, iso) {
  return (salle?.tables || []).map((t) => ({ id: String(t.id), zone: t.zone, zoneNom: salle.zones?.[t.zone] || t.zone, places: +t.places || 0, forme: t.forme, x: t.x, y: t.y, l: t.l, h: t.h || t.l,
    note: t.note || '', fermee: t.zone === 'terrasse' && !terrasseOuverte(iso) }));
}

const croise = (a, b) => a.debutMin < b.finMin && b.debutMin < a.finMin;

/**
 * Le plan d'un service : chaque table avec ceux qui s'y assoient, les réservations sans table, celles qui se gênent.
 * @returns {{ service: object, tables: object[], aPlacer: object[], placees: object[], conflits: { table: string, resas: object[] }[] }}
 */
export function planDuService(ctx, S, salle, iso, sv) {
  const service = serviceDuJour(ctx, S, iso, sv), pres = actives(service.resas), connues = new Set(tablesDe(salle, iso).map((t) => t.id));
  const tables = tablesDe(salle, iso).map((t) => ({ ...t, resas: pres.filter((r) => String(r.table || '') === t.id).sort((a, b) => a.debutMin - b.debutMin) }));
  const placees = pres.filter((r) => connues.has(String(r.table || ''))), aPlacer = pres.filter((r) => !connues.has(String(r.table || '')));
  const conflits = tables.filter((t) => t.resas.some((a, i) => t.resas.slice(i + 1).some((b) => croise(a, b)))).map((t) => ({ table: t.id, resas: t.resas }));
  return { service, tables, aPlacer, placees, conflits };
}

/** La table est-elle libre pour cette réservation (personne d'autre entre son arrivée et la fin de son repas) ? */
export const libre = (t, r) => !t.fermee && t.resas.every((x) => x.id === r.id || !croise(x, r));
/** Les tables où l'on peut l'asseoir sans serrer : libres, avec assez de places. */
export const possibles = (plan, r) => plan.tables.filter((t) => libre(t, r) && t.places >= (+r.couverts || 1));

/** La table proposée : la plus petite qui suffit ; en terrasse d'abord si le client l'a demandée (et qu'elle est ouverte). */
export function proposer(plan, r) {
  const l = possibles(plan, r).sort((a, b) => a.places - b.places || +a.id - +b.id);
  return (r.espace === 'terrasse' ? l.find((t) => t.zone === 'terrasse') : l.find((t) => t.zone !== 'terrasse')) || l[0] || null;
}

/** Placer tout seul : les grandes tablées d'abord, puis par heure. Rend { places: { [id]: table }, restes: [réservation] }. */
export function placerTout(plan) {
  const tables = plan.tables.map((t) => ({ ...t, resas: [...t.resas] })), places = {}, restes = [];
  for (const r of [...plan.aPlacer].sort((a, b) => (+b.couverts || 0) - (+a.couverts || 0) || a.debutMin - b.debutMin)) {
    const t = proposer({ tables }, r);
    if (t) { places[r.id] = t.id; t.resas.push(r); } else restes.push(r);
  }
  return { places, restes };
}

/**
 * Après une modification (heure, service, couverts), la table de la réservation convient-elle encore ? (v7.8.0)
 * Trop petite, prise à la nouvelle heure, ou fermée : la réservation est à replacer.
 * `places: false` : on ne regarde que si elle est libre (une réservation qui revient garde une table que l'équipe avait serrée exprès).
 * @returns {{ table: string, convient: boolean, raison: string }}
 */
export function tableApres(ctx, S, salle, r, champs = {}, { places = true } = {}) {
  const table = String(r.table || ''); if (!table) return { table: '', convient: true, raison: '' };
  const f = { ...r, ...champs }, n = Math.round(+f.couverts) || 1; f.debutMin = enMin(f.heure); f.finMin = f.debutMin + dureeDe(f.service);
  const t = planDuService(ctx, S, salle, r.date, f.service).tables.find((x) => x.id === table);
  const raison = !t ? 'elle n\'est plus sur le plan' : t.fermee ? 'la terrasse est fermée' : places && t.places < n ? `${t.places} places pour ${n} couverts` : !libre(t, f) ? 'elle est prise à cette heure-là' : '';
  return { table, convient: !raison, raison };
}

export const MUTATIONS_SALLE = {
  /** Assoit une réservation à une table ; `table` vide : elle n'a plus de table. */
  placerResa(S, { id, table }) { (((S.resa ||= {}).tables ||= {}))[id] = String(table || ''); },
  /** Assoit plusieurs réservations d'un coup (« Placer tout seul »). */
  placerPlusieurs(S, { places }) { const t = ((S.resa ||= {}).tables ||= {}); for (const [id, table] of Object.entries(places || {})) t[id] = String(table || ''); },
};
