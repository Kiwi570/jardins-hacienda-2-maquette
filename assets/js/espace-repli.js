/* Le repli de la terrasse (v7.11.0) : les règles, en fonctions pures (testées par `node --test _audit/tests/*.test.mjs`).

   La météo tourne : « Préparer un repli en intérieur » montre d'abord un APERÇU (rien n'est changé) : les réservations
   concernées, la place proposée à chacune en salle (table ou tables rapprochées), les groupes déjà installés dehors,
   les conflits, les personnes sans solution et les décisions qui restent à prendre. L'équipe ajuste, puis applique :
   chaque déplacement est revérifié au moment où il est enregistré ; le résultat dit précisément ce qui a été fait et
   ce qui ne l'a pas été. Fermer l'aperçu ne change rien.
   Portée : comme le plan de salle (partagé en mode connecté pour les tables ; l'état des tables reste sur l'appareil). */
import { ajouter, ouvertSite, creneaux, telephoneDemo } from './espace-regles.js?v=7';
import { planDuService, placeDe, placerTout, avisPlace, nomPlace, terrasseOuverte } from './espace-salle.js?v=7';

const dehors = (t) => !!t && t.zone === 'terrasse';

/**
 * L'aperçu d'un repli. `choix` : les ajustements de l'équipe, { [réservation]: table | 'garder' } ('garder' : elle reste dehors).
 * @returns {{ ouvert, concernees, installes, propositions: { resa, de, vers, places, assemblage, options }[], sansSolution: { resa, raison }[], gardees, conflits, tables: string[], decisions: string[] }}
 */
export function repliTerrasse(ctx, S, salle, iso, sv, choix = {}) {
  const plan = planDuService(ctx, S, salle, iso, sv), tous = [...plan.placees, ...plan.aPlacer];
  const concernees = tous.filter((r) => dehors(placeDe(plan, r.table || '')) || (!placeDe(plan, r.table || '') && r.espace === 'terrasse')).sort((a, b) => a.debutMin - b.debutMin);
  const installes = concernees.filter((r) => r.installe), gardees = concernees.filter((r) => !r.installe && choix[r.id] === 'garder'), aDeplacer = concernees.filter((r) => !r.installe && !r.parti && choix[r.id] !== 'garder');
  /* La salle seule, telle qu'elle est occupée. */
  const tables = plan.tables.filter((t) => !dehors(t)).map((t) => ({ ...t, resas: [...t.resas] })), lier = () => plan.assemblages.filter((a) => !dehors(a)).map((a) => ({ ...a, composantes: tables.filter((t) => a.tables.includes(t.id)) }));
  const poser = (r, t) => { for (const c of t.assemblage ? t.composantes : [t]) c.resas.push(t.assemblage ? { ...r, via: t.id } : r); };
  const places = {}, sansSolution = [];
  /* Les ajustements de l'équipe d'abord (revérifiés), puis une proposition pour les autres : les grandes tablées d'abord. */
  for (const r of aDeplacer.filter((x) => choix[x.id])) {
    const dedans = { tables, assemblages: lier() }, t = placeDe(dedans, choix[r.id]), avis = t ? avisPlace(dedans, t, r) : { ok: false, raison: 'Cette table n\'est pas en salle.' };
    if (t && (avis.ok || avis.genre === 'serre')) { places[r.id] = t.id; poser(r, t); } else sansSolution.push({ resa: r, raison: `Le choix « ${nomPlace(choix[r.id])} » n'est pas possible : ${avis.raison}` });
  }
  const auto = placerTout({ tables, assemblages: lier() }, aDeplacer.filter((x) => !choix[x.id]));
  for (const r of aDeplacer.filter((x) => !choix[x.id])) { if (auto.places[r.id]) { places[r.id] = auto.places[r.id]; poser(r, placeDe({ tables, assemblages: lier() }, auto.places[r.id])); } }
  for (const r of auto.restes) sansSolution.push({ resa: r, raison: `Aucune table en salle n'est libre à ${String(r.heure).replace(':', ' h ').replace(' h 00', ' h')} pour ${+r.couverts} couverts, même en rapprochant deux tables.` });
  const fin = { tables, assemblages: lier() };
  const propositions = aDeplacer.filter((r) => places[r.id]).map((r) => { const t = placeDe(fin, places[r.id]);
    /* Les autres places possibles pour elle, une fois toutes les autres posées. */
    const options = [...fin.tables, ...fin.assemblages].filter((x) => x.id === t.id || avisPlace(fin, x, r).ok).map((x) => ({ id: x.id, nom: nomPlace(x.id), places: x.places }));
    return { resa: r, de: r.table || '', vers: t.id, places: t.places, assemblage: !!t.assemblage, serre: t.places < +r.couverts, options }; });
  const decisions = [
    ...installes.map((r) => `${r.nom || 'Un groupe'} est déjà installé en terrasse (${nomPlace(r.table)}) : à déplacer avec lui, de vive voix. Rien n'est changé pour ce groupe.`),
    ...sansSolution.map((x) => `${x.resa.nom || 'Une réservation'} (${+x.resa.couverts} couverts) : proposer un autre horaire, séparer le groupe sur deux tables, ou prévenir le client.`),
    ...gardees.map((r) => `${r.nom || 'Une réservation'} reste en terrasse, à votre demande.`),
  ];
  return { ouvert: terrasseOuverte(iso), plan, concernees, installes, gardees, propositions, sansSolution, conflits: plan.conflits, tables: plan.tables.filter((t) => t.zone === 'terrasse' && !t.horsSaison).map((t) => t.id), places, decisions };
}

/** Le prochain soir d'été ouvert (terrasse ouverte), pour l'exemple : un samedi de juin si possible. */
export function soirDEte(ctx) {
  let d = ctx.auj; for (let k = 0; k < 400; k++) { d = ajouter(ctx.auj, k); if (terrasseOuverte(d) && ouvertSite(ctx.R, d, 'soir') && (new Date(`${d}T12:00:00Z`).getUTCDay() === 6 || k > 380)) return d; }
  return null;
}
/** Les réservations de l'exemple d'été : noms inventés, quatre en terrasse, quatre en salle. Identifiants stables pour une date. */
export function exempleEte(ctx, iso) {
  const cr = creneaux(ctx.R, 'soir'), h = (t) => (cr.includes(t) ? t : cr[Math.min(cr.length - 1, 2)]);
  const une = (n, heure, couverts, nom, table, espace = 'salle', demande = '') => ({ id: `ete-${iso}-${n}`, date: iso, service: 'soir', heure: h(heure), couverts, nom, telephone: telephoneDemo(nom), demande, espace, statut: 'confirmee', source: 'demo', ...(table ? { table } : {}) });
  return [
    une(1, '19:30', 6, 'Lucie B.', '12', 'terrasse', 'Au bord de la piscine'), une(2, '20:00', 8, 'Tablée Marchand', '10+11', 'terrasse', 'Un anniversaire'),
    une(3, '20:15', 2, 'Inès et Paul', '', 'terrasse'), une(4, '20:30', 5, 'Georges V.', '', 'terrasse', 'Chaise haute'),
    une(5, '20:00', 8, 'Famille Colin', '7'), une(6, '20:00', 4, 'Hélène D.', '4'), une(7, '19:45', 2, 'Yann et Zoé', '1'), une(8, '20:15', 4, 'Margaux P.', '8'),
  ];
}

/* ---------- Le bilan d'un repli appliqué (v7.11.1) ----------
   Un repli s'applique déplacement par déplacement, et s'arrête au premier incident. Le bilan dit, pour chaque
   réservation, ce qui s'est réellement passé : 'deplacee', 'refusee', 'non-tentee', 'a-verifier'. Le nombre prévu
   n'est jamais un compteur de réussite. */
export const ETATS_REPLI = { deplacee: 'Déplacée', refusee: 'Refusée', 'non-tentee': 'Non tentée', 'a-verifier': 'Résultat à vérifier' };
export function compteBilan(resultats = []) {
  const n = (k) => resultats.filter((x) => x.etat === k).length;
  return { deplacees: n('deplacee'), refusees: n('refusee'), nonTentees: n('non-tentee'), aVerifier: n('a-verifier'), prevues: resultats.length };
}
/** La phrase du bilan : « 1 réservation déplacée. 1 déplacement refusé. 2 déplacements restent à traiter. » */
export function phraseBilan(resultats = []) {
  const c = compteBilan(resultats), p = (k, un, plusieurs) => (k ? [`${k} ${k > 1 ? plusieurs : un}.`] : []);
  if (!c.prevues) return 'Aucun déplacement à faire.';
  return [...(c.deplacees ? p(c.deplacees, 'réservation déplacée', 'réservations déplacées') : ['Aucune réservation déplacée.']), ...p(c.refusees, 'déplacement refusé', 'déplacements refusés'),
    ...p(c.aVerifier, 'résultat à vérifier', 'résultats à vérifier'), ...p(c.nonTentees, 'déplacement reste à traiter', 'déplacements restent à traiter')].join(' ');
}
/**
 * Applique des déplacements un par un avec `deplacer(x)` (rend true, ou la raison du refus) et s'arrête au premier
 * refus : le même comportement, en démonstration, que la série du mode connecté.
 */
export function appliquerUnParUn(liste, deplacer) {
  const resultats = liste.map((x) => ({ id: x.id, table: String(x.table || ''), etat: 'non-tentee', raison: '' }));
  for (const x of resultats) { const r = deplacer(x); if (r === true) x.etat = 'deplacee'; else { x.etat = 'refusee'; x.raison = String(r || 'Ce déplacement a été refusé.'); break; } }
  return resultats;
}

export const MUTATIONS_REPLI = {
  /** Charge l'exemple d'un soir d'été (une seule fois par date) : des réservations d'exemple, avec leurs tables. */
  exempleEte(S, { resas }) {
    const l = ((S.resa ||= {}).ajouts ||= []), t = (S.resa.tables ||= {});
    for (const r of resas) { if (l.some((x) => x.id === r.id)) continue; const { table, ...reste } = r; l.push(reste); if (table) t[r.id] = table; }
  },
};
