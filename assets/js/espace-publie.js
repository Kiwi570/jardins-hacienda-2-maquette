/* Ce que les pages du site ont besoin de savoir des offres (v7.13.0), sans rien charger d'autre : la version PUBLIÉE,
   les offres qu'elle montre, « épuisé » pour un service. Aucune dépendance : ce fichier est chargé sur chaque page.
   Les règles complètes (catalogue, publication, historique) sont dans espace-offres.js, qui reprend celles-ci. */
export const UNITES = { personne: 'par personne', piece: 'la pièce', kilo: 'le kilo', formule: 'la formule', forfait: 'forfait' };
/** L'unité telle qu'on l'écrivait avant (« par personne », « pièce », « kg ») ramenée à sa clé ; '' si elle est inconnue. */
export const cleUnite = (t) => { const s = String(t || '').toLowerCase(); return UNITES[s] ? s : /personne|convive|couvert/.test(s) ? 'personne' : /pi[èe]ce|unit/.test(s) ? 'piece' : /kilo|kg/.test(s) ? 'kilo' : /forfait/.test(s) ? 'forfait' : /formule|menu/.test(s) ? 'formule' : ''; };
/** Les offres livrées avec le site : les prestations de réception (donnees/receptions.json), sous leurs identifiants d'origine. */
export function offresDeBase(lieux) {
  return (lieux?.lignes || []).map((l, i) => ({ id: l.id, type: /menu|formule/i.test(l.libelle) ? 'formule' : 'prestation', nom: l.libelle, description: l.description || '', prix: Number.isFinite(+l.pu) && l.pu !== '' && l.pu != null ? +l.pu : '',
    unite: cleUnite(l.unite), categorie: 'Réceptions', ordre: i + 1, periode: null, conditions: '', usages: { propositions: true, site: false }, visuel: null, exemple: !!l.exemple }));
}
/** Les offres d'un contenu ({ modifs, ajouts }) : celles du site, modifiées ou non, puis celles que le restaurant a créées. */
export function offresDe(base, o = {}) {
  return [...base.map((b) => ({ ...b, ...(o?.modifs?.[b.id] || {}), id: b.id, duSite: true })), ...(o?.ajouts || []).map((a) => ({ ...a, duSite: false }))]
    .sort((a, b) => (a.ordre || 0) - (b.ordre || 0) || a.nom.localeCompare(b.nom, 'fr'));
}
/** L'offre est-elle dans sa période, ce jour-là ? (Sans période : toujours.) */
export const dansPeriode = (o, iso) => !o.periode || !iso || ((!o.periode.du || o.periode.du <= iso) && (!o.periode.au || iso <= o.periode.au));

/**
 * L'état que lisent les pages du site : le contenu publié, et la disponibilité opérationnelle du moment.
 * `apercu` : le contenu en préparation à la place (l'aperçu avant publication).
 */
export function vuePublique(S, apercu = false) {
  if (!S || apercu || !S.publie) return S || {};
  const v = { ...S }, p = S.publie;
  for (const k of ['ardoise', 'evenements']) { if (p[k]) v[k] = p[k]; else delete v[k]; }
  const carte = { ...(p.carte || {}), ...(S.carte?.epuises ? { epuises: S.carte.epuises } : {}) }; if (Object.keys(carte).length) v.carte = carte; else delete v.carte;
  const offres = { ...(p.offres || {}), ...(S.offres?.archives ? { archives: S.offres.archives } : {}) }; if (Object.keys(offres).length) v.offres = offres; else delete v.offres;
  return v;
}
/**
 * « Épuisé » vaut pour un jour ET un service (v7.13.0) : la valeur gardée est « AAAA-MM-JJ/soir ». Une ancienne valeur
 * « AAAA-MM-JJ » (avant la v7.13.0) vaut pour toute la journée. Sans service demandé (`sv` vide), on répond pour le jour.
 */
export const estEpuise = (v, auj, sv = '') => { if (!v || !auj) return false; const [jour, service] = String(v).split('/'); return jour === auj && (!service || !sv || service === sv); };
/** Les offres que le site affiche (page Réceptions) : dans la version lue, montrées sur le site, non archivées, dans leur période. */
export function offresVitrine(lieux, S, iso = '', apercu = false) {
  const v = vuePublique(S, apercu), arch = S?.offres?.archives || {};
  return offresDe(offresDeBase(lieux), v.offres).filter((o) => !arch[o.id] && o.usages?.site && dansPeriode(o, iso || ''));
}
