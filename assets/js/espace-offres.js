/* Les offres prennent vie (v7.13.0) : le catalogue commun, la version publiée et le contenu en préparation.
   Fonctions pures (testées par `node --test _audit/tests/*.test.mjs`).

   Trois choses ne se confondent jamais :
   1. le contenu EN PRÉPARATION : ce que l'équipe modifie dans l'espace (`S.carte`, `S.ardoise`, `S.evenements`,
      `S.offres`), comme avant ;
   2. le contenu PUBLIÉ : ce que lisent les pages du site (`S.publie`), qui ne change que par une publication ;
   3. la DISPONIBILITÉ opérationnelle : « épuisé ce soir » (`S.carte.epuises`), une offre archivée
      (`S.offres.archives`). Elle s'applique aussitôt, sans publication, et n'est jamais restaurée par l'historique.

   `S.publie` absent : c'est l'état d'avant la v7.13.0, où tout changement était aussitôt en ligne. Ce qui était
   visible est donc la version publiée ; `assurerPublication` la fige juste avant la première modification suivante.

   Schéma :
     offres   { modifs: { [id]: champs }, ajouts: [offre], archives: { [id]: quand } }
     publie   { n, carte, ardoise, evenements, offres, historique: [{ n, le, perimetre, id, libelle, resume, avant, apres }] }
   Une offre : { id, type, nom, description, prix (nombre, ou '' : à définir), unite, categorie, ordre,
                 periode { du, au }, conditions, usages { propositions, site }, visuel { nom, alt }, exemple }. */
import { typo, evenements as evenementsDe, listeEvenements, fmt } from './espace-regles.js?v=7';
import { carteDe, platsDe, prixTexte } from './espace-carte.js?v=7';
import { UNITES, cleUnite, offresDeBase, offresDe, dansPeriode, vuePublique, offresVitrine } from './espace-publie.js?v=7';
export { UNITES, cleUnite, offresDeBase, offresDe, dansPeriode, vuePublique };


export const TYPES = { formule: 'Formule ou menu', prestation: 'Prestation', plat: 'Plat de la carte', soiree: 'Soirée', emporter: 'À emporter' };
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const net = (t, n) => typo(String(t ?? '').trim()).slice(0, n);
const egal = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const clone = (x) => (x == null ? x : JSON.parse(JSON.stringify(x)));
/** Un objet sans ses parties vides (pour comparer deux contenus sans se laisser tromper par un `{}` resté là). */
function sansVide(x) {
  if (Array.isArray(x)) return x.length ? x.map((v) => sansVide(v) ?? null) : undefined;
  if (x && typeof x === 'object') { const o = {}; for (const [k, v] of Object.entries(x)) { const w = sansVide(v); if (w !== undefined) o[k] = w; } return Object.keys(o).length ? o : undefined; }
  return x === undefined ? undefined : x;
}
const pareil = (a, b) => egal(sansVide(a), sansVide(b));

/* ---------- Le catalogue ---------- */
/** Lit un prix saisi : un nombre positif à deux décimales au plus, '' s'il est vide, null s'il n'est pas valable. */
export function lirePrixOffre(t) {
  if (typeof t === 'number') return Number.isFinite(t) && t >= 0 ? Math.round(t * 100) / 100 : null;
  const s = String(t ?? '').trim().replace(/\s*(€|euros?)$/i, '').replace(/[\s  ]/g, ''); if (!s) return '';
  return /^\d{1,6}(?:[.,]\d{1,2})?$/.test(s) ? parseFloat(s.replace(',', '.')) : null;
}
/** Une offre mise au propre (les champs absents ne sont pas inventés). */
export function offrePropre(o) {
  const prix = lirePrixOffre(o.prix), p = o.periode && (o.periode.du || o.periode.au) ? { du: ISO.test(o.periode.du || '') ? o.periode.du : '', au: ISO.test(o.periode.au || '') ? o.periode.au : '' } : null;
  return { id: String(o.id || '').slice(0, 40), type: TYPES[o.type] && !['plat', 'soiree', 'emporter'].includes(o.type) ? o.type : 'prestation', nom: net(o.nom, 120), description: net(o.description, 600), prix: prix == null ? '' : prix, unite: UNITES[o.unite] ? o.unite : '',
    categorie: net(o.categorie, 60), ordre: Math.max(0, Math.round(+o.ordre || 0)), periode: p, conditions: net(o.conditions, 400), usages: { propositions: o.usages?.propositions !== false, site: !!o.usages?.site },
    visuel: o.visuel?.nom ? { nom: String(o.visuel.nom).slice(0, 80), alt: net(o.visuel.alt, 160) } : null, ...(o.exemple ? { exemple: true } : {}) };
}
/**
 * Ce qui empêche d'enregistrer une offre : [{ champ, message }] (vide si tout va bien). `saisie` : les champs tels
 * qu'ils sont écrits dans le formulaire. Un prix vide est accepté (« à définir ») : il n'est jamais lu comme gratuit.
 */
export function validerOffre(saisie = {}) {
  const e = [], prix = lirePrixOffre(saisie.prix);
  if (!String(saisie.nom || '').trim()) e.push({ champ: 'nom', message: 'Donnez un nom à cette offre.' });
  if (prix == null) e.push({ champ: 'prix', message: 'Le prix doit être un nombre positif, par exemple 49 ou 49,50. Laissez le champ vide si le prix n\'est pas encore décidé.' });
  if (!UNITES[saisie.unite]) e.push({ champ: 'unite', message: 'Choisissez l\'unité du prix : par personne, la pièce, le kilo, la formule ou au forfait.' });
  const du = saisie.periode?.du || '', au = saisie.periode?.au || '';
  if ((du && !ISO.test(du)) || (au && !ISO.test(au))) e.push({ champ: 'periode', message: 'Les dates de la période s\'écrivent en choisissant un jour dans le calendrier.' });
  else if (du && au && au < du) e.push({ champ: 'periode', message: 'La période se termine avant de commencer : la date de fin doit suivre la date de début.' });
  return e;
}
export const prixOffre = (o) => (o.prix === '' || o.prix == null ? 'Prix à définir' : `${prixTexte(o.prix)} ${UNITES[o.unite] || ''}`.trim());

/* ---------- Publié / en préparation ---------- */
const SECTIONS = ['carte', 'ardoise', 'evenements', 'offres'];
/** Le contenu éditorial d'une rubrique, sans ce qui est opérationnel (épuisés, archives) ni calculé (liste des soirées). */
export function contenu(S, k) {
  const x = S?.[k]; if (!x) return undefined;
  if (k === 'carte') return sansVide({ modifs: x.modifs, ajouts: x.ajouts, ordre: x.ordre });
  if (k === 'evenements' || k === 'offres') return sansVide({ modifs: x.modifs, ajouts: x.ajouts });
  return sansVide(x);
}
/** Le contenu publié d'une rubrique. Sans `S.publie` (état d'avant la v7.13.0), ce qui est là est ce qui était en ligne. */
export const publie = (S, k) => (S?.publie ? sansVide(k === 'evenements' && S.publie.evenements ? { modifs: S.publie.evenements.modifs, ajouts: S.publie.evenements.ajouts } : S.publie[k]) : contenu(S, k));
/** Fige la version publiée avant la première modification (ne fait rien ensuite). */
export function assurerPublication(S) {
  if (S.publie) return false;
  S.publie = { n: 0 }; for (const k of SECTIONS) { const c = contenu(S, k); if (c) S.publie[k] = clone(k === 'evenements' ? { ...c, ...(S.evenements?.liste ? { liste: S.evenements.liste } : {}) } : c); }
  return true;
}
/** Une version publiée qui ne dit rien de plus que le contenu présent (jamais publiée ici, rien en préparation) ne laisse rien. */
export function allegerPublication(S) {
  const p = S.publie; if (!p || p.n || p.historique?.length) return false;
  if (!SECTIONS.every((k) => pareil(k === 'evenements' && p.evenements ? { modifs: p.evenements.modifs, ajouts: p.evenements.ajouts } : p[k], contenu(S, k)))) return false;
  delete S.publie; return true;
}
/** Les offres du catalogue dans une version : 'publie' (ce que voient le site et les nouvelles propositions) ou 'travail'. */
export function offres(lieux, S, version = 'travail') {
  const arch = S?.offres?.archives || {};
  return offresDe(offresDeBase(lieux), version === 'publie' ? publie(S, 'offres') : contenu(S, 'offres')).map((o) => ({ ...o, archive: !!arch[o.id] }));
}
export const offre = (lieux, S, id, version = 'travail') => offres(lieux, S, version).find((o) => o.id === id) || null;
/** Les offres qu'une nouvelle proposition peut reprendre : publiées, non archivées, ouvertes aux propositions, avec un prix. */
export const offresPourProposition = (lieux, S, iso = '') => offres(lieux, S, 'publie').filter((o) => !o.archive && o.usages?.propositions !== false && o.prix !== '' && o.prix != null && (!iso || dansPeriode(o, iso)));
/** Les offres que le site affiche (page Réceptions) ; `apercu` : dans la version en préparation. */
export const offresDuSite = (lieux, S, iso = '', apercu = false) => offresVitrine(lieux, S, iso, apercu);

/* ---------- Ce qui attend d'être publié ---------- */
const dit = (v) => (v === '' || v == null ? 'rien' : String(v));
const CHAMPS_OFFRE = [['nom', 'Nom'], ['description', 'Description'], ['prix', 'Prix'], ['unite', 'Unité'], ['categorie', 'Catégorie'], ['ordre', 'Ordre'], ['periode', 'Période'], ['conditions', 'Conditions'], ['usages', 'Endroits d\'usage'], ['visuel', 'Photo']];
const valOffre = (o, k) => (k === 'prix' ? (o.prix === '' || o.prix == null ? 'à définir' : prixTexte(o.prix)) : k === 'unite' ? UNITES[o.unite] || 'aucune' : k === 'periode' ? (o.periode ? `du ${o.periode.du || '…'} au ${o.periode.au || '…'}` : 'toute l\'année')
  : k === 'usages' ? [o.usages?.propositions !== false ? 'propositions' : '', o.usages?.site ? 'site' : ''].filter(Boolean).join(' et ') || 'nulle part' : k === 'visuel' ? (o.visuel?.nom ? `photo « ${o.visuel.alt || o.visuel.nom} »` : 'aucune') : dit(o[k]));
function changementsOffre(a, b) {
  if (!a) return [`Nouvelle offre : ${b.nom}, ${prixOffre(b)}.`];
  if (!b) return [`Offre retirée : ${a.nom}.`];
  return CHAMPS_OFFRE.filter(([k]) => !pareil(a[k], b[k])).map(([k, nom]) => `${nom} : ${valOffre(a, k)} → ${valOffre(b, k)}`);
}
const CHAMPS_PLAT = [['nom', 'Nom'], ['prix', 'Prix'], ['description', 'Description'], ['vegetarien', 'Végétarien'], ['allergenes', 'Allergènes']];
const valPlat = (p, k) => (k === 'prix' ? prixTexte(p.prix) || 'rien' : k === 'vegetarien' ? (p.vegetarien ? 'oui' : 'non') : k === 'allergenes' ? (p.allergenes.join(', ').toLowerCase() || 'aucun') : dit(p[k]));
function changementsCarte(base, a, b) {
  const A = carteDe(base, { carte: a || {} }, ''), B = carteDe(base, { carte: b || {} }, ''), l = [], cles = new Set();
  for (const r of B) {
    const ra = A.find((x) => x.id === r.id), pa = new Map((ra?.plats || []).map((p) => [p.cle, p]));
    for (const p of r.plats) {
      const o = pa.get(p.cle); pa.delete(p.cle);
      if (!o || (o.masque && !p.masque)) { if (!p.masque) { l.push(`${r.titre} : « ${p.nom} » arrive sur la carte (${prixTexte(p.prix) || 'sans prix'}).`); cles.add(p.cle); } continue; }
      if (p.masque && !o.masque) { l.push(`${r.titre} : « ${o.nom} » est retiré de la carte.`); cles.add(p.cle); continue; }
      const ch = CHAMPS_PLAT.filter(([k]) => !pareil(o[k], p[k])).map(([k, nom]) => `${nom.toLowerCase()} ${valPlat(o, k)} → ${valPlat(p, k)}`);
      if (ch.length) { l.push(`${r.titre} : « ${o.nom} », ${ch.join(' ; ')}.`); cles.add(p.cle); }
    }
    for (const o of pa.values()) if (!o.masque) { l.push(`${r.titre} : « ${o.nom} » est retiré de la carte.`); cles.add(o.cle); }
    const oa = (ra?.plats || []).filter((p) => !p.masque).map((p) => p.cle), ob = r.plats.filter((p) => !p.masque).map((p) => p.cle), communs = ob.filter((c) => oa.includes(c));
    if (!egal(oa.filter((c) => communs.includes(c)), communs)) l.push(`${r.titre} : l'ordre des plats change.`);
  }
  return { phrases: l, cles };
}
function changementsArdoise(a, b, base) {
  const l = [];
  for (const [k, nom] of [['jour', 'Ardoise du midi'], ['soir', 'Ardoise du soir']]) {
    /* Une partie que l'espace n'a pas touchée est celle livrée avec le site (`base`) : on compare ligne à ligne avec elle. */
    const x = a?.[k] ?? base?.[k], y = b?.[k] ?? base?.[k]; if (pareil(x, y)) continue;
    if (!y) { l.push(`${nom} : retour à l'ardoise livrée avec le site.`); continue; }
    if (!x) { l.push(`${nom} : ${(y.lignes || []).filter((i) => i.plat).length} lignes modifiées par rapport à l'ardoise livrée avec le site.`); continue; }
    if ((x.titre || '') !== (y.titre || '')) l.push(`${nom} : titre « ${x.titre} » → « ${y.titre} ».`);
    const lx = x.lignes || [], ly = y.lignes || [], n = Math.max(lx.length, ly.length);
    for (let i = 0; i < n; i++) { const p = lx[i], q = ly[i]; if (pareil(p, q)) continue; l.push(`${nom}, ligne ${i + 1} : ${p?.plat ? `« ${p.plat} » ${p.prix || ''}`.trim() : 'vide'} → ${q?.plat ? `« ${q.plat} » ${q.prix || ''}`.trim() : 'vide'}.`); }
    if ((x.mot || '') !== (y.mot || '')) l.push(`${nom} : mot du bas « ${x.mot || ''} » → « ${y.mot || ''} ».`);
  }
  return l;
}
const CHAMPS_SOIREE = [['titre', 'Titre'], ['debut', 'Date'], ['service', 'Service'], ['type', 'Genre'], ['prix', 'Prix'], ['image', 'Photo'], ['src', 'Photo'], ['cadrage', 'Cadrage'], ['masque', 'Visible sur le site']];
const valSoiree = (s, k) => (k === 'debut' ? fmt(String(s.debut).slice(0, 10)) : k === 'masque' ? (s.masque ? 'non' : 'oui') : k === 'src' ? (s.src ? 'photo de l\'appareil' : 'photothèque') : dit(s[k]));
/** Ce qui change d'une soirée, en séparant sa présentation (titre, photo, prix affiché) de ce qui engage (date, service). */
export function changementsSoiree(a, b) {
  if (!a) return { phrases: [`Nouvelle soirée : ${b.titre || 'sans titre'}, ${fmt(String(b.debut).slice(0, 10))} (${b.service === 'midi' ? 'midi' : 'soir'}).`], engage: true, nouvelle: true };
  if (!b) return { phrases: [`Soirée retirée : ${a.titre}.`], engage: true, retiree: true };
  const ch = [...new Map(CHAMPS_SOIREE.filter(([k]) => !pareil(a[k], b[k])).map(([k, nom]) => [nom, `${nom} : ${valSoiree(a, k)} → ${valSoiree(b, k)}`])).values()];
  return { phrases: ch, engage: String(a.debut).slice(0, 10) !== String(b.debut).slice(0, 10) || (a.service || 'soir') !== (b.service || 'soir') };
}

/**
 * Tout ce qui est en préparation et pas encore publié, par périmètre de publication :
 * [{ perimetre: 'offre' | 'carte' | 'ardoise' | 'soiree', id, libelle, bouton, changements: [phrase], cles }].
 * `sources` : { carte (rubriques livrées), agenda (soirées livrées), lieux (prestations livrées), ardoise (ardoise livrée) }.
 */
export function enPreparation(sources, S) {
  const l = [], { carte: base = [], agenda = [], lieux } = sources || {};
  const oa = offresDe(offresDeBase(lieux), publie(S, 'offres')), ob = offresDe(offresDeBase(lieux), contenu(S, 'offres'));
  for (const id of new Set([...oa, ...ob].map((o) => o.id))) { const a = oa.find((o) => o.id === id), b = ob.find((o) => o.id === id), ch = changementsOffre(a, b); if (ch.length) l.push({ perimetre: 'offre', id, libelle: (b || a).nom, bouton: 'Publier cette offre', changements: ch }); }
  const c = changementsCarte(base, publie(S, 'carte'), contenu(S, 'carte'));
  if (c.phrases.length) l.push({ perimetre: 'carte', id: '', libelle: 'La carte', bouton: 'Publier les modifications de la carte', changements: c.phrases, cles: [...c.cles] });
  const ar = changementsArdoise(publie(S, 'ardoise'), contenu(S, 'ardoise'), sources?.ardoise);
  if (ar.length) l.push({ perimetre: 'ardoise', id: '', libelle: 'L\'ardoise', bouton: 'Publier l\'ardoise', changements: ar });
  const sa = evenementsDe(agenda, { evenements: publie(S, 'evenements') || {} }), sb = evenementsDe(agenda, { evenements: contenu(S, 'evenements') || {} });
  for (const id of new Set([...sa, ...sb].map((x) => x.id))) { const a = sa.find((x) => x.id === id), b = sb.find((x) => x.id === id), ch = changementsSoiree(a, b); if (ch.phrases.length) l.push({ perimetre: 'soiree', id, libelle: (b || a).titre || 'Soirée', bouton: 'Publier cette soirée', changements: ch.phrases, engage: ch.engage, nouvelle: !!ch.nouvelle }); }
  return l;
}
export const attente = (sources, S, perimetre, id = '') => enPreparation(sources, S).find((x) => x.perimetre === perimetre && (x.id || '') === (id || '')) || null;

/* ---------- Publier, reprendre une version, abandonner un brouillon ---------- */
const RUBRIQUE = { offre: 'offres', soiree: 'evenements', carte: 'carte', ardoise: 'ardoise' };
/** La part d'un contenu que couvre un périmètre : la rubrique entière (carte, ardoise) ou une seule entrée (offre, soirée). */
function extrait(c, perimetre, id) {
  if (perimetre === 'carte' || perimetre === 'ardoise') return clone(sansVide(c)) ?? null;
  return sansVide({ modif: c?.modifs?.[id], ajout: (c?.ajouts || []).find((x) => x.id === id) }) ? clone({ modif: c?.modifs?.[id] ?? null, ajout: (c?.ajouts || []).find((x) => x.id === id) ?? null }) : null;
}
/** Pose cette part dans un objet qui porte les rubriques (l'état, ou `S.publie`). La disponibilité opérationnelle n'est jamais touchée. */
function poser(cible, perimetre, id, x) {
  const k = RUBRIQUE[perimetre];
  if (perimetre === 'ardoise') { if (x) cible.ardoise = clone(x); else delete cible.ardoise; return; }
  if (perimetre === 'carte') { const garde = cible.carte?.epuises; cible.carte = { ...(clone(x) || {}), ...(garde ? { epuises: garde } : {}) }; if (!Object.keys(cible.carte).length) delete cible.carte; return; }
  const c = (cible[k] ||= {});
  if (x?.modif) (c.modifs ||= {})[id] = clone(x.modif); else if (c.modifs) delete c.modifs[id];
  c.ajouts = (c.ajouts || []).filter((a) => a.id !== id); if (x?.ajout) c.ajouts.push(clone(x.ajout));
  if (c.modifs && !Object.keys(c.modifs).length) delete c.modifs; if (!c.ajouts.length) delete c.ajouts; if (!Object.keys(c).length) delete cible[k];
}
const HISTORIQUE_MAX = 40;
/** Les versions publiées d'un périmètre, de la plus récente à la plus ancienne ; la dernière est « le contenu d'avant ». */
export function versions(S, perimetre, id = '') {
  const h = (S?.publie?.historique || []).filter((x) => x.perimetre === perimetre && (x.id || '') === (id || ''));
  const l = [...h].reverse().map((x, i) => ({ n: x.n, cote: 'apres', le: x.le, libelle: x.libelle, resume: x.resume, enLigne: i === 0 }));
  if (h.length) l.push({ n: h[0].n, cote: 'avant', le: '', libelle: h[0].libelle, resume: ['Le contenu en ligne avant la première publication faite ici.'], enLigne: false, origine: true });
  return l;
}
/** L'historique entier, du plus récent au plus ancien. */
export const historique = (S) => [...(S?.publie?.historique || [])].reverse();
/** Ce qu'une version rétablirait si on la reprenait en brouillon : les changements par rapport au contenu en préparation d'aujourd'hui. */
export function retablirait(sources, S, n, cote = 'apres') {
  const x = (S?.publie?.historique || []).find((h) => h.n === n); if (!x) return null;
  const essai = clone(S); poser(essai, x.perimetre, x.id, x[cote]); delete essai.publie; essai.publie = { n: 0, [RUBRIQUE[x.perimetre]]: clone(contenuBrut(S, RUBRIQUE[x.perimetre])) };
  const d = attente(sources, essai, x.perimetre, x.id);
  return { perimetre: x.perimetre, id: x.id, libelle: x.libelle, changements: d ? d.changements : [], contenu: x[cote] };
}
const contenuBrut = (S, k) => contenu(S, k) || null;

export const MUTATIONS_OFFRES = {
  /** Modifie une offre du catalogue (en préparation : le site ne change pas). `base` : les offres livrées avec le site. */
  offre(S, { id, champs, base = [] }) {
    const o = (S.offres ||= {}), b = base.find((x) => x.id === id);
    if (b) { const x = offrePropre({ ...b, ...(o.modifs?.[id] || {}), ...champs, id }), diff = Object.fromEntries(Object.entries(x).filter(([k, v]) => k !== 'id' && !pareil(v, offrePropre(b)[k]))); if (Object.keys(diff).length) (o.modifs ||= {})[id] = diff; else if (o.modifs) delete o.modifs[id]; }
    else { const l = (o.ajouts ||= []), i = l.findIndex((x) => x.id === id), x = offrePropre({ ...(i >= 0 ? l[i] : {}), ...champs, id }); if (i >= 0) l[i] = x; else l.push(x); }
    if (o.modifs && !Object.keys(o.modifs).length) delete o.modifs; if (o.ajouts && !o.ajouts.length) delete o.ajouts; if (!Object.keys(o).length) delete S.offres;
  },
  /** Archive une offre (ou la remet) : tout de suite, sans publication. Aucun dossier, aucune proposition, aucune réservation n'est touché. */
  offArchiver(S, { id, actif = true, le = '' }) { const a = ((S.offres ||= {}).archives ||= {}); if (actif) a[id] = String(le || '').slice(0, 16) || '1'; else delete a[id]; if (!Object.keys(a).length) delete S.offres.archives; if (!Object.keys(S.offres).length) delete S.offres; },
  /**
   * Publie un périmètre, et lui seul : une offre, une soirée, la carte ou l'ardoise. Les autres brouillons restent en préparation.
   * `sources` : { carte, agenda, lieux } (les contenus livrés avec le site, pour écrire le résumé) ; `le` : l'instant.
   */
  offPublier(S, { perimetre, id = '', le = '', sources = {} }) {
    assurerPublication(S); const d = attente(sources, S, perimetre, id); if (!d) return;
    const k = RUBRIQUE[perimetre], p = S.publie, avant = extrait(k === 'evenements' && p.evenements ? { modifs: p.evenements.modifs, ajouts: p.evenements.ajouts } : p[k], perimetre, id), apres = extrait(contenu(S, k), perimetre, id);
    poser(p, perimetre, id, apres); p.n = (p.n || 0) + 1;
    if (k === 'evenements') { if (p.evenements) p.evenements.liste = listeEvenements(sources.agenda || [], { evenements: p.evenements }); }
    (p.historique ||= []).push({ n: p.n, le: String(le || '').slice(0, 16), perimetre, id, libelle: d.libelle, resume: d.changements.slice(0, 12), avant, apres });
    if (p.historique.length > HISTORIQUE_MAX) p.historique.splice(0, p.historique.length - HISTORIQUE_MAX);
  },
  /** Reprend une version de l'historique EN BROUILLON : le site ne change pas tant qu'on ne publie pas. Rien d'opérationnel n'est restauré. */
  offReprendre(S, { n, cote = 'apres', sources = {} }) {
    const x = (S.publie?.historique || []).find((h) => h.n === n); if (!x) return;
    poser(S, x.perimetre, x.id, x[cote]); if (S.evenements) S.evenements.liste = listeEvenements(sources.agenda || [], S);
  },
  /** Abandonne ce qui est en préparation pour un périmètre : il redevient ce qui est publié. */
  offAbandonner(S, { perimetre, id = '', sources = {} }) {
    assurerPublication(S); const k = RUBRIQUE[perimetre], p = S.publie;
    poser(S, perimetre, id, extrait(k === 'evenements' && p.evenements ? { modifs: p.evenements.modifs, ajouts: p.evenements.ajouts } : p[k], perimetre, id));
    if (S.evenements) S.evenements.liste = listeEvenements(sources.agenda || [], S);
  },
};
/** Les actions qui modifient un contenu en préparation : la version publiée est figée juste avant la première. */
export const ACTIONS_CONTENU = new Set(['plat', 'ajouterPlat', 'platVisible', 'ordrePlat', 'ardoise', 'evenement', 'visibilite', 'supprimerEvenement', 'offre', 'offReprendre']);

/* ---------- Les usages d'une offre, les soirées et leurs réservations ---------- */
/** Où une offre est utilisée : les propositions de réception qui la reprennent, et le site. */
export function usagesOffre(lieux, S, id) {
  const props = [];
  for (const d of Object.values(S?.receptions?.dossiers || {})) for (const p of d.propositions || []) { const n = (p.lignes || []).filter((l) => l.origine === id).length; if (n) props.push({ dossier: d.id, client: d.client?.nom || '', intitule: d.projet?.intitule || d.projet?.occasion || 'Réception', version: p.v, etat: p.etat }); }
  const pub = offre(lieux, S, id, 'publie');
  return { propositions: props, site: !!pub?.usages?.site && !pub.archive, nouvelles: !!pub && pub.usages?.propositions !== false };
}
const INACTIFS = ['refusee', 'annulee', 'absente'];
/** Les réservations encore actives prises depuis une soirée (`resas` : toutes celles que l'espace connaît). */
export const resasDeSoiree = (resas, id) => (resas || []).filter((r) => r.soiree?.id === id && !INACTIFS.includes(r.statut));
/**
 * Peut-on enregistrer ce changement sur une soirée ? '' si oui. Changer la date ou le service d'une soirée déjà
 * réservée déplacerait, en apparence, des réservations qui ne bougent pas : c'est refusé, avec ce qu'il faut faire.
 */
export function refusSoiree(avant, apres, liees = []) {
  if (!liees.length || !avant) return '';
  const n = liees.length, couverts = liees.reduce((a, r) => a + (+r.couverts || 0), 0), qui = `${n} réservation${n > 1 ? 's' : ''} (${couverts} couvert${couverts > 1 ? 's' : ''}) ${n > 1 ? 'sont liées' : 'est liée'} à cette soirée`;
  if (!apres) return `${qui[0].toUpperCase()}${qui.slice(1)} : la supprimer leur ferait perdre ce lien. Retirez-la plutôt du site (« Sur le site »), ou traitez d'abord ces réservations dans l'agenda.`;
  if (String(avant.debut).slice(0, 10) !== String(apres.debut).slice(0, 10) || (avant.service || 'soir') !== (apres.service || 'soir')) return `${qui[0].toUpperCase()}${qui.slice(1)}. Changer sa date ou son service ne les déplacerait pas, et aucun message ne partirait aux clients : prévenez-les et modifiez leurs réservations une à une dans l'agenda, ou créez une nouvelle soirée.`;
  return '';
}
/** Ce que les règles disent d'une action sur les offres : '' si elle est possible, sinon la phrase qui dit pourquoi. */
export function refusOffre(S, nom, args = {}, { resas = [] } = {}) {
  const sources = args.sources || {};
  if (nom === 'offre') {
    /* Le formulaire envoie ce qui est écrit (`saisie`) ; sinon on vérifie l'offre telle qu'elle serait après le changement. */
    const o = { ...((args.base || []).find((x) => x.id === args.id) || {}), ...(S.offres?.modifs?.[args.id] || {}), ...((S.offres?.ajouts || []).find((x) => x.id === args.id) || {}), ...(args.champs || {}) };
    const e = validerOffre(args.saisie || { nom: o.nom, prix: o.prix, unite: o.unite, periode: o.periode }); return e.length ? e[0].message : '';
  }
  if (nom === 'offPublier') {
    if (args.vu != null && (S.publie?.n || 0) !== args.vu) return 'Le site a été publié ailleurs pendant que cet écran était ouvert (un autre onglet). Rien n\'a été publié ici : relisez les changements, puis publiez de nouveau.';
    return attente(sources, S, args.perimetre, args.id) ? '' : 'Il n\'y a rien à publier ici : le site affiche déjà ce contenu.';
  }
  if (nom === 'offReprendre') {
    const x = (S.publie?.historique || []).find((h) => h.n === args.n); if (!x) return 'Cette version n\'est plus dans l\'historique.';
    if (x.perimetre === 'soiree') { const s = (c) => evenementsDe(sources.agenda || [], { evenements: c || {} }).find((y) => y.id === x.id), essai = clone(S); poser(essai, 'soiree', x.id, x[args.cote || 'apres']); return refusSoiree(s(contenu(S, 'evenements')), s(contenu(essai, 'evenements')), resasDeSoiree(resas, x.id)); }
    return '';
  }
  if (nom === 'offAbandonner' && args.perimetre === 'soiree') { const s = (c) => evenementsDe(sources.agenda || [], { evenements: c || {} }).find((y) => y.id === args.id); return refusSoiree(s(contenu(S, 'evenements')), s(publie(S, 'evenements')), resasDeSoiree(resas, args.id)); }
  if (nom === 'evenement' || nom === 'supprimerEvenement') {
    const avant = evenementsDe(args.agenda || [], { evenements: contenu(S, 'evenements') || {} }).find((y) => y.id === args.id);
    return refusSoiree(avant, nom === 'supprimerEvenement' ? null : { ...avant, ...(args.champs || {}) }, resasDeSoiree(resas, args.id));
  }
  return '';
}
/** Le catalogue commun, pour l'écran « Offres » : toutes les offres, quel que soit leur métier, avec leur état. */
export function catalogue(sources, S, auj = '') {
  const { carte: base = [], agenda = [], lieux, produits = [] } = sources || {}, prep = enPreparation(sources, S), enCours = (p, id) => prep.some((x) => x.perimetre === p && (x.id || '') === (id || ''));
  const pubO = offres(lieux, S, 'publie'), cles = new Set(prep.find((x) => x.perimetre === 'carte')?.cles || []);
  const pubS = evenementsDe(agenda, { evenements: publie(S, 'evenements') || {} });
  return [
    ...offres(lieux, S).map((o) => ({ id: o.id, type: o.type, nom: o.nom, prix: prixOffre(o), categorie: o.categorie || 'Réceptions', exemple: !!o.exemple, archive: o.archive, publie: pubO.some((x) => x.id === o.id), preparation: enCours('offre', o.id), ou: 'offre', usages: o.usages })),
    ...platsDe(carteDe(base, { carte: contenu(S, 'carte') || {} }, '')).filter((p) => !p.masque || cles.has(p.cle)).map((p) => ({ id: p.cle, type: 'plat', nom: p.nom, prix: prixTexte(p.prix) || 'Prix à définir', categorie: p.rubriqueTitre, exemple: false, archive: false, publie: !(p.nouveau && cles.has(p.cle)), preparation: cles.has(p.cle), ou: 'carte' })),
    ...evenementsDe(agenda, { evenements: contenu(S, 'evenements') || {} }).filter((x) => !auj || String(x.debut).slice(0, 10) >= auj).map((x) => ({ id: x.id, type: 'soiree', nom: x.titre, prix: x.prix || 'Prix à définir', categorie: `${fmt(String(x.debut).slice(0, 10))}, ${x.service === 'midi' ? 'midi' : 'soir'}`, exemple: false, archive: false, publie: pubS.some((y) => y.id === x.id && !y.masque), preparation: enCours('soiree', x.id), ou: 'soirees' })),
    ...produits.map((p, i) => ({ id: p.id ? `emporter:${p.id}` : `traiteur-${i}`, type: 'emporter', nom: p.nom, prix: `${prixTexte(p.prix)} ${p.unite === 'kg' ? UNITES.kilo : UNITES.piece}`, categorie: 'Carte traiteur', exemple: false, archive: false, publie: true, preparation: false, ou: 'emporter', lecture: true })),
  ];
}
