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

/* ---------- Les assemblages (v7.11.0) ----------
   Deux tables rapprochées pour un groupe. Ils viennent de la configuration (`donnees/salle.json`, `assemblages`) : les
   tables qui les composent et une capacité dite, jamais calculée. Une réservation assise sur un assemblage porte son
   identifiant (« 2+3 ») à la place d'un numéro de table : pendant son repas, les tables qui le composent ne peuvent pas
   servir séparément ; avant et après, elles redeviennent des tables ordinaires. */
export const idAssemblage = (tables) => [...tables].map(String).sort((a, b) => +a - +b || a.localeCompare(b)).join('+');
export function assemblagesDe(salle, iso) {
  const tables = tablesDe(salle, iso);
  return (salle?.assemblages || []).map((a) => {
    const comp = (a.tables || []).map(String).map((id) => tables.find((t) => t.id === id)).filter(Boolean);
    if (comp.length < 2 || comp.length !== (a.tables || []).length || !(+a.places > 0)) return null;
    return { id: idAssemblage(comp.map((t) => t.id)), assemblage: true, tables: comp.map((t) => t.id), places: +a.places, zone: comp[0].zone, zoneNom: comp[0].zoneNom,
      nom: `Tables ${comp.map((t) => t.id).join(' et ')}`, note: a.note || '', fermee: comp.some((t) => t.fermee) };
  }).filter(Boolean);
}
/** Le nom à dire d'une place : « table 4 » ou « tables 2 et 3 ». */
export const nomPlace = (id) => (String(id).includes('+') ? `tables ${String(id).split('+').join(' et ')}` : `table ${id}`);

/* ---------- L'état physique des tables (v7.11.0) ----------
   Une table est : prête, occupée (un groupe y est installé), à débarrasser (le groupe est parti), à préparer
   (débarrassée, pas encore dressée) ou indisponible. « Occupée » se déduit de la présence ; le reste est noté par
   l'équipe dans `S.service.tables["jour|service"][table]`. Une table vide n'est donc pas forcément prête. */
export const ETATS_TABLE = { prete: 'Prête', occupee: 'Occupée', 'a-debarrasser': 'À débarrasser', 'a-preparer': 'À préparer', indisponible: 'Indisponible' };
export const cleSalle = (iso, sv) => `${iso}|${sv}`;

/**
 * Le plan d'un service : chaque table avec ceux qui s'y assoient et son état, les assemblages, les réservations sans
 * table, celles qui se gênent. `minute` (le jour même) : un groupe encore installé après la durée prévue occupe
 * toujours sa table, et un groupe parti plus tôt l'a rendue.
 * @returns {{ service: object, tables: object[], assemblages: object[], aPlacer: object[], placees: object[], conflits: { table: string, resas: object[] }[] }}
 */
export function planDuService(ctx, S, salle, iso, sv, minute = iso === ctx.auj ? ctx.minute ?? null : null) {
  const service = serviceDuJour(ctx, S, iso, sv), presence = S.service?.presence || {}, notes = S.service?.tables?.[cleSalle(iso, sv)] || {};
  const base = tablesDe(salle, iso), ass = assemblagesDe(salle, iso), parId = new Map(ass.map((a) => [a.id, a]));
  const pres = actives(service.resas).map((r) => {
    const p = presence[r.id], installe = r.statut === 'arrivee' && p?.etat === 'installe', parti = r.statut === 'arrivee' && p?.etat === 'parti';
    /* La durée prévue ne libère pas une table : tant que le groupe est installé, il l'occupe. Parti : il l'a rendue. */
    const finMin = parti && p.partiA != null ? Math.max(r.debutMin + 1, Math.min(r.finMin, p.partiA)) : installe && minute != null && minute >= r.finMin ? minute + 15 : r.finMin;
    return { ...r, finMin, finPrevue: r.finMin, installe, parti, depasse: installe && minute != null && minute >= r.finMin };
  });
  const sur = (r) => { const id = String(r.table || ''); return parId.has(id) ? parId.get(id).tables : [id]; };
  const connues = new Set([...base.map((t) => t.id), ...ass.map((a) => a.id)]);
  const tables = base.map((t) => {
    const resas = pres.filter((r) => sur(r).includes(t.id)).map((r) => (parId.has(String(r.table)) ? { ...r, via: String(r.table) } : r)).sort((a, b) => a.debutMin - b.debutMin);
    const occupant = resas.find((r) => r.installe) || null, note = notes[t.id] || '';
    const etat = t.fermee || note === 'indisponible' ? 'indisponible' : occupant ? 'occupee' : ['a-debarrasser', 'a-preparer'].includes(note) ? note : 'prete';
    return { ...t, resas, occupant, etat, fermee: t.fermee || note === 'indisponible', horsSaison: t.fermee };
  });
  const assemblages = ass.map((a) => { const composantes = tables.filter((t) => a.tables.includes(t.id));
    return { ...a, composantes, fermee: composantes.some((t) => t.fermee), resas: pres.filter((r) => String(r.table || '') === a.id).sort((x, y) => x.debutMin - y.debutMin),
      etat: composantes.some((t) => t.etat === 'indisponible') ? 'indisponible' : composantes.some((t) => t.etat === 'occupee') ? 'occupee' : composantes.find((t) => t.etat !== 'prete')?.etat || 'prete' }; });
  const placees = pres.filter((r) => connues.has(String(r.table || ''))), aPlacer = pres.filter((r) => !connues.has(String(r.table || '')));
  const conflits = tables.filter((t) => t.resas.some((a, i) => t.resas.slice(i + 1).some((b) => croise(a, b)))).map((t) => ({ table: t.id, resas: t.resas }));
  return { service, tables, assemblages, aPlacer, placees, conflits, minute };
}

/** La place (table ou assemblage) qui porte cet identifiant dans le plan. */
export const placeDe = (plan, id) => plan.tables.find((t) => t.id === String(id)) || (plan.assemblages || []).find((a) => a.id === String(id)) || null;
/** La table est-elle libre pour cette réservation (personne d'autre entre son arrivée et la fin de son repas) ? Un assemblage : toutes ses tables. */
export const libre = (t, r) => (t.assemblage ? !t.fermee && t.composantes.every((c) => libre(c, r)) : !t.fermee && t.resas.every((x) => x.id === r.id || !croise(x, r)));
/** Les tables où l'on peut l'asseoir sans serrer : libres, avec assez de places. */
export const possibles = (plan, r) => plan.tables.filter((t) => libre(t, r) && t.places >= (+r.couverts || 1));
/** Les assemblages possibles pour cette réservation : toutes leurs tables libres, assez de places. */
export const assemblagesPossibles = (plan, r) => (plan.assemblages || []).filter((a) => libre(a, r) && a.places >= (+r.couverts || 1));

/**
 * Pourquoi cette place convient, ou pas, à cette réservation (v7.11.0) : { ok, genre, raison }.
 * genre : 'ok', 'serre' (libre mais trop petite), 'prise', 'fermee', 'etat' (occupée, à débarrasser, à préparer : pour une installation maintenant).
 * `maintenant` : on veut installer le groupe tout de suite, l'état physique de la table compte.
 */
export function avisPlace(plan, t, r, { maintenant = false } = {}) {
  const n = +r.couverts || 1, tables = t.assemblage ? t.composantes : [t], dire = (h) => `${Math.floor(h / 60) % 24} h${h % 60 ? ` ${String(h % 60).padStart(2, '0')}` : ''}`;
  const hors = tables.find((c) => c.horsSaison); if (hors) return { ok: false, genre: 'fermee', raison: 'La terrasse est fermée hors saison.' };
  const indispo = tables.find((c) => c.etat === 'indisponible'); if (indispo) return { ok: false, genre: 'fermee', raison: `La table ${indispo.id} est indisponible pour ce service.` };
  for (const c of tables) { const a = c.resas.find((x) => x.id !== r.id && croise(x, r));
    if (a) return { ok: false, genre: 'prise', raison: a.installe ? `La table ${c.id} est occupée par ${a.nom || 'un groupe'}${a.depasse ? ', installé depuis plus longtemps que prévu' : `, jusque vers ${dire(a.finMin)}`}.` : `La table ${c.id} est ${a.via && a.via !== t.id ? `rapprochée d'une autre (${nomPlace(a.via)}) ` : 'réservée '}à ${dire(a.debutMin)} pour ${a.nom || 'une autre réservation'}.` }; }
  if (maintenant) { const pas = tables.find((c) => c.etat !== 'prete' && !(c.occupant?.id === r.id)); if (pas) return { ok: false, genre: 'etat', raison: `La table ${pas.id} est ${ETATS_TABLE[pas.etat].toLowerCase()} : elle n'est pas prête.` }; }
  if (t.places < n) return { ok: false, genre: 'serre', raison: `${t.places} places pour ${n} couverts.` };
  const suivante = tables.flatMap((c) => c.resas).filter((x) => x.id !== r.id && x.debutMin >= r.finMin).sort((a, b) => a.debutMin - b.debutMin)[0];
  return { ok: true, genre: 'ok', raison: `${t.places} places, libre ${suivante ? `jusqu'à ${dire(suivante.debutMin)} (${suivante.nom || 'réservation suivante'})` : 'pour tout le service'}.` };
}

/**
 * La place proposée : la plus petite table qui suffit, en terrasse d'abord si le client l'a demandée (et qu'elle est
 * ouverte). Si la seule table libre est bien trop grande (plus de deux places de trop), un assemblage plus juste lui est
 * préféré : la grande table reste pour une grande tablée. Sans table seule, le plus petit assemblage.
 */
export function proposer(plan, r) {
  const n = +r.couverts || 1, tri = (a, b) => a.places - b.places || a.id.localeCompare(b.id, 'fr', { numeric: true });
  const choix = (liste) => (r.espace === 'terrasse' ? liste.find((t) => t.zone === 'terrasse') : liste.find((t) => t.zone !== 'terrasse')) || liste[0] || null;
  const t = choix(possibles(plan, r).sort(tri)), a = choix(assemblagesPossibles(plan, r).sort(tri));
  return t && a && t.places > n + 2 && a.places < t.places ? a : t || a;
}

/** Placer tout seul : les grandes tablées d'abord, puis par heure. Rend { places: { [id]: table }, restes: [réservation] }. */
export function placerTout(plan, aPlacer = plan.aPlacer) {
  const tables = plan.tables.map((t) => ({ ...t, resas: [...t.resas] })), assemblages = (plan.assemblages || []).map((a) => ({ ...a, composantes: tables.filter((t) => a.tables.includes(t.id)) })), places = {}, restes = [];
  for (const r of [...aPlacer].sort((a, b) => (+b.couverts || 0) - (+a.couverts || 0) || a.debutMin - b.debutMin)) {
    const t = proposer({ tables, assemblages }, r);
    if (t) { places[r.id] = t.id; for (const c of t.assemblage ? t.composantes : [t]) c.resas.push(t.assemblage ? { ...r, via: t.id } : r); } else restes.push(r);
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
  const t = placeDe(planDuService(ctx, S, salle, r.date, f.service), table);
  const raison = !t ? 'elle n\'est plus sur le plan' : t.fermee ? (t.horsSaison === false || (t.assemblage && !t.composantes.some((c) => c.horsSaison)) ? 'elle est indisponible' : 'la terrasse est fermée') : places && t.places < n ? `${t.places} places pour ${n} couverts` : !libre(t, f) ? 'elle est prise à cette heure-là' : '';
  return { table, convient: !raison, raison };
}

export const MUTATIONS_SALLE = {
  /** Assoit une réservation à une table ; `table` vide : elle n'a plus de table. */
  placerResa(S, { id, table }) { (((S.resa ||= {}).tables ||= {}))[id] = String(table || ''); },
  /** Assoit plusieurs réservations d'un coup (« Placer tout seul »). */
  placerPlusieurs(S, { places }) { const t = ((S.resa ||= {}).tables ||= {}); for (const [id, table] of Object.entries(places || {})) t[id] = String(table || ''); },
};
