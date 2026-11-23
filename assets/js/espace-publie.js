/* Ce que les pages du site ont besoin de savoir des offres (v7.13.0), sans rien charger d'autre : la version PUBLIÉE,
   les offres qu'elle montre, « épuisé » pour un service. Aucune dépendance : ce fichier est chargé sur chaque page.
   Les règles complètes (catalogue, publication, historique) sont dans espace-offres.js, qui reprend celles-ci. */
export const UNITES = { personne: 'par personne', piece: 'la pièce', kilo: 'le kilo', formule: 'la formule', forfait: 'forfait', carte: 'la carte' };
/* v7.13.1 : les contenus éditoriaux du Site (textes, photos, annonce) se préparent et se publient eux aussi. */
export const EDITORIAL = ['textes', 'photos', 'annonce'];
/** L'unité telle qu'on l'écrivait avant (« par personne », « pièce », « kg ») ramenée à sa clé ; '' si elle est inconnue. */
export const cleUnite = (t) => { const s = String(t || '').toLowerCase(); return UNITES[s] ? s : /personne|convive|couvert/.test(s) ? 'personne' : /pi[èe]ce|unit/.test(s) ? 'piece' : /kilo|kg/.test(s) ? 'kilo' : /forfait/.test(s) ? 'forfait' : /formule|menu/.test(s) ? 'formule' : ''; };
/** Les offres livrées avec le site : les prestations de réception (donnees/receptions.json), sous leurs identifiants d'origine. */
export function offresDeBase(lieux) {
  return [...(lieux?.lignes || []).map((l, i) => ({ id: l.id, type: /menu|formule/i.test(l.libelle) ? 'formule' : 'prestation', nom: l.libelle, description: l.description || '', prix: Number.isFinite(+l.pu) && l.pu !== '' && l.pu != null ? +l.pu : '',
    unite: cleUnite(l.unite), categorie: 'Réceptions', ordre: i + 1, periode: null, conditions: '', usages: { propositions: true, site: false }, visuel: null, exemple: !!l.exemple })),
    /* v7.13.1 : les cartes cadeaux de la page Offrir (`lieux.cadeaux` : ses montants), sous un identifiant stable par montant
       d'origine. Pour une carte cadeau, « sur le site » veut dire : proposée sur la page Offrir. */
    ...(lieux?.cadeaux || []).map((m, i) => ({ id: `cadeau-${m}`, type: 'cadeau', nom: `Carte cadeau de ${m} €`, description: '', prix: +m, unite: 'carte', categorie: 'Cartes cadeaux', ordre: 101 + i, periode: null, conditions: '', usages: { propositions: false, site: true }, visuel: null, exemple: false })),
    /* v7.14.0 : les produits de la page À emporter (`lieux.emporter` : ceux livrés avec le site), sous un identifiant stable
       par produit. `vente` : la quantité minimale et le pas (dans l'unité du prix), le délai de commande en jours (vide :
       non précisé). `produit` : le produit livré dont l'offre garde le dessin. « Sur le site » veut dire : page À emporter. Comme avant,
       un produit livré peut être repris dans une proposition de réception (au prix publié) : cela ne crée jamais de commande. */
    ...(lieux?.emporter || []).map((x, i) => { const kilo = /kg|kilo/i.test(x.unite || ''); return { id: `emporter-${x.id}`, type: 'emporter', nom: x.nom, description: x.texte || '', prix: +x.prix, unite: kilo ? 'kilo' : cleUnite(x.unite) || 'piece', categorie: 'Carte traiteur', ordre: 201 + i,
      periode: null, conditions: '', usages: { propositions: true, site: true }, visuel: null, exemple: false, vente: { min: kilo ? 0.5 : 1, pas: kilo ? 0.5 : 1, delai: '' }, produit: x.id }; })];
}
/** Les offres d'un contenu ({ modifs, ajouts }) : celles du site, modifiées ou non, puis celles que le restaurant a créées. */
export function offresDe(base, o = {}) {
  /* v7.14.0 : une carte cadeau du site dont seul le montant a changé garde un nom juste (« Carte cadeau de 250 € »). */
  const juste = (b, x) => (b.type === 'cadeau' && x.nom === b.nom && typeof x.prix === 'number' && x.prix !== b.prix ? { ...x, nom: `Carte cadeau de ${String(x.prix).replace('.', ',')} €` } : x);
  return [...base.map((b) => juste(b, { ...b, ...(o?.modifs?.[b.id] || {}), id: b.id, duSite: true })), ...(o?.ajouts || []).map((a) => ({ ...a, duSite: false }))]
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
  /* Les contenus éditoriaux du Site ne se lisent dans la version publiée qu'une fois repris (`editorial`) : avant, ils étaient en direct. */
  for (const k of ['ardoise', 'evenements', ...(p.editorial ? EDITORIAL : [])]) { if (p[k]) v[k] = p[k]; else delete v[k]; }
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
  return offresDe(offresDeBase(lieux), v.offres).filter((o) => o.type !== 'cadeau' && o.type !== 'emporter' && !arch[o.id] && o.usages?.site && dansPeriode(o, iso || ''));
}
/** Les cartes cadeaux que la page Offrir propose : dans la version lue, visibles, non archivées, avec un montant. */
export function cadeauxVitrine(lieux, S, iso = '', apercu = false) {
  const v = vuePublique(S, apercu), arch = S?.offres?.archives || {};
  return offresDe(offresDeBase(lieux), v.offres).filter((o) => o.type === 'cadeau' && !arch[o.id] && o.usages?.site && typeof o.prix === 'number' && o.prix > 0 && dansPeriode(o, iso || '')).sort((a, b) => a.prix - b.prix);
}
/** Les produits que la page À emporter propose (v7.14.0) : dans la version lue, visibles, non archivés, dans leur période,
    avec un prix ; dans l'ordre du catalogue. Un produit masqué ou archivé n'est plus proposé à la commande. */
export function emporterVitrine(lieux, S, iso = '', apercu = false) {
  const v = vuePublique(S, apercu), arch = S?.offres?.archives || {};
  return offresDe(offresDeBase(lieux), v.offres).filter((o) => o.type === 'emporter' && !arch[o.id] && o.usages?.site && typeof o.prix === 'number' && o.prix > 0 && dansPeriode(o, iso || ''));
}
/** Ce que l'aperçu montre de différent du site : les rubriques qui ont quelque chose en préparation (pour le dire sur le repère). */
export function preparations(S) {
  const p = S?.publie; if (!p) return [];
  const net = (x) => JSON.stringify(x ?? null, (k, v) => (k === 'liste' || k === 'epuises' || k === 'archives' || (v && typeof v === 'object' && !Object.keys(v).length) ? undefined : v));
  return [['carte', 'la carte'], ['ardoise', 'l\'ardoise'], ['evenements', 'les soirées'], ['offres', 'les offres'], ...(p.editorial ? [['textes', 'les textes'], ['photos', 'les photos'], ['annonce', 'l\'annonce']] : [])]
    .filter(([k]) => net(p[k]) !== net(S[k])).map(([, nom]) => nom);
}
