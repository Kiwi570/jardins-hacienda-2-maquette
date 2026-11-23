/* La carte du restaurant dans l'espace (v7.7.3) : les règles, en fonctions pures (testées par
   `node --test _audit/tests/*.test.mjs`).
   La carte livrée avec le site (donnees/carte.json : rubriques et plats) n'est jamais modifiée : l'espace garde ce qui
   change. Chaque plat a une clé stable, « rubrique/identifiant » pour un plat du site (v7.8.1 ; avant : « rubrique/rang »), « rubrique/+identifiant » pour un plat
   ajouté. Un plat peut être modifié (nom, description, prix, végétarien, allergènes), retiré de la carte, ou dit
   « épuisé » pour un jour donné : le lendemain, il revient tout seul.
   Les allergènes sont ceux que le restaurant indique lui-même : rien n'est prérempli. */
import { simplifier, typo } from './espace-regles.js?v=7';
import { estEpuise } from './espace-publie.js?v=7';
export { estEpuise };

/* Les quatorze allergènes à déclaration obligatoire (règlement européen INCO). */
export const ALLERGENES = ['Gluten', 'Crustacés', 'Œufs', 'Poissons', 'Arachides', 'Soja', 'Lait', 'Fruits à coque', 'Céleri', 'Moutarde', 'Sésame', 'Sulfites', 'Lupin', 'Mollusques'];
/** Le prix tel qu'il s'écrit : « 21 € », « 9,50 € », ou le texte déjà écrit (« Prix du marché »). */
export function prixTexte(v) {
  if (v == null || v === '') return '';
  const n = typeof v === 'number' ? v : /^\s*\d+(?:[.,]\d{1,2})?\s*(?:€|euros?)?\s*$/i.test(String(v)) ? parseFloat(String(v).replace(',', '.')) : null;
  return n == null ? String(v).trim() : `${Number.isInteger(n) ? n : n.toFixed(2).replace('.', ',')} €`;
}
/** Ce que le restaurateur écrit dans le champ du prix, gardé en nombre quand c'en est un. */
export function lirePrix(t) {
  const s = String(t ?? '').trim(); if (!s) return '';
  return /^\d+(?:[.,]\d{1,2})?\s*(?:€|euros?)?$/i.test(s) ? parseFloat(s.replace(',', '.')) : s;
}
/* Un plat mis au propre : textes avec la typographie française, allergènes connus et dans l'ordre de la liste. */
const propre = (p) => ({ nom: typo(String(p.nom || '').trim()), description: typo(String(p.description || '').trim()), prix: p.prix ?? '', vegetarien: !!p.vegetarien, allergenes: [...(p.allergenes || [])].filter((a) => ALLERGENES.includes(a)).sort((a, b) => ALLERGENES.indexOf(a) - ALLERGENES.indexOf(b)) });
const pareil = (a, b) => JSON.stringify(propre(a)) === JSON.stringify(propre(b));

/** La carte telle que l'espace l'a laissée : [{ id, titre, plats: [{ cle, nom, description, prix, vegetarien, allergenes, masque, epuise, nouveau, modifie }] }]. */
export function carteDe(base, S, auj, sv = '') {
  const c = S.carte || {}, m = c.modifs || {}, ep = c.epuises || {};
  return base.map((r) => { const ordre = c.ordre?.[r.id] || [], rang = (p) => { const i = ordre.indexOf(p.cle); return i < 0 ? 1e6 : i; };
    return { id: r.id, titre: r.titre, plats: [
      ...r.plats.map((p, i) => { const cle = `${r.id}/${p.id ?? i}`, x = m[cle] || {}; return { cle, ...propre({ ...p, ...x }), masque: !!x.masque, epuise: estEpuise(ep[cle], auj, sv), nouveau: false, modifie: Object.keys(x).some((k) => k !== 'masque') }; }),
      ...(c.ajouts || []).filter((p) => p.rubrique === r.id).map((p) => { const cle = `${r.id}/+${p.id}`; return { cle, ...propre(p), masque: false, epuise: estEpuise(ep[cle], auj, sv), nouveau: true, modifie: false }; }),
    ].map((p, i) => ({ p, i })).sort((a, b) => rang(a.p) - rang(b.p) || a.i - b.i).map((x) => x.p) }; });
}
export const platsDe = (carte) => carte.flatMap((r) => r.plats.map((p) => ({ ...p, rubrique: r.id, rubriqueTitre: r.titre })));
/** Le plat de la carte livrée pour une clé (null pour un plat ajouté). */
export function origine(base, cle) { const [rub, rang] = String(cle).split('/'); const r = base.find((x) => x.id === rub); return !r || String(rang).startsWith('+') ? null : r.plats.find((p) => p.id === rang) || (/^\d+$/.test(rang) ? r.plats[+rang] || null : null); }
/** La clé durable d'un plat du site : « rubrique/identifiant ». Une ancienne clé « rubrique/rang » est traduite ; une clé inconnue est rendue telle quelle. */
export function cleDurable(base, cle) { const [rub, rang] = String(cle).split('/'), p = /^\d+$/.test(rang) ? base.find((x) => x.id === rub)?.plats[+rang] : null; return p?.id ? `${rub}/${p.id}` : String(cle); }
/**
 * La migration des anciennes références (v7.8.1) : les plats du site étaient désignés par leur rang dans la rubrique ;
 * ils le sont par un identifiant qui ne dépend plus de l'ordre d'affichage. Rend true si quelque chose a changé.
 */
export function migrerCarte(S, base) {
  const c = S.carte; if (!c) return false; let change = false;
  for (const champ of ['modifs', 'epuises']) for (const k of Object.keys(c[champ] || {})) { const n = cleDurable(base, k); if (n !== k) { if (!(n in c[champ])) c[champ][n] = c[champ][k]; delete c[champ][k]; change = true; } }
  return change;
}

/** Retrouve un plat d'après ce qu'on en dit (« côte de bœuf », « le foie gras ») : celui dont le nom contient le plus de ces mots. */
export function trouverPlat(carte, texte) {
  const vides = new Set(['le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'au', 'aux', 'a', 'et', 'en', 'd', 'l', 'ce', 'soir', 'midi', 'plus', 'epuise', 'epuisee', 'rupture', 'prix']);
  const mots = simplifier(texte).split(/[^a-z0-9]+/).filter((w) => w.length > 1 && !vides.has(w)); if (!mots.length) return null;
  let meilleur = null, score = 0;
  for (const p of platsDe(carte)) {
    if (p.masque) continue;
    const nom = simplifier(p.nom).split(/[^a-z0-9]+/), n = mots.filter((w) => nom.some((x) => x === w || (w.length >= 4 && (x.startsWith(w) || w.startsWith(x) && x.length >= 4)))).length;
    /* Il faut au moins deux mots sur trois reconnus : « licorne rôtie » ne devient pas « figues rôties ». */
    const s = n / mots.length >= 0.66 ? n / mots.length + n / (nom.length + 4) : 0;
    if (s > score) { score = s; meilleur = p; }
  }
  return score > 0 ? meilleur : null;
}

/* Les actions de la carte (appliquées par espace-donnees.js) : chacune modifie une copie de l'état. */
const net = (S) => { const c = S.carte; if (!c) return; for (const k of ['modifs', 'epuises', 'ordre']) if (c[k] && !Object.keys(c[k]).length) delete c[k]; if (c.ajouts && !c.ajouts.length) delete c.ajouts; if (!Object.keys(c).length) delete S.carte; };
export const MUTATIONS_CARTE = {
  /** Traduit les anciennes clés « rubrique/rang » en « rubrique/identifiant » (une fois, à l'ouverture de l'espace). */
  migrerCarte(S, { base }) { migrerCarte(S, base); },
  /** Modifie un plat ; `base` est la carte livrée : un plat du site redevenu identique ne laisse rien. */
  plat(S, { cle, champs, base }) {
    const c = (S.carte ||= {}), [rub, rang] = cle.split('/');
    if (rang.startsWith('+')) { const p = (c.ajouts || []).find((x) => x.id === rang.slice(1) && x.rubrique === rub); if (p) Object.assign(p, propre({ ...p, ...champs })); }
    else { const o = origine(base, cle), masque = c.modifs?.[cle]?.masque, x = propre({ ...o, ...(c.modifs?.[cle] || {}), ...champs }); (c.modifs ||= {})[cle] = pareil(x, o || {}) ? {} : x; if (masque) c.modifs[cle].masque = true; if (!Object.keys(c.modifs[cle]).length) delete c.modifs[cle]; }
    net(S);
  },
  ajouterPlat(S, { rubrique, id, plat }) { ((S.carte ||= {}).ajouts ||= []).push({ id, rubrique, ...propre(plat) }); },
  /** Sur la carte ou non : un plat du site est masqué, un plat ajouté est supprimé. */
  platVisible(S, { cle, visible }) {
    const c = (S.carte ||= {}), [rub, rang] = cle.split('/');
    if (rang.startsWith('+')) { if (!visible) { c.ajouts = (c.ajouts || []).filter((x) => !(x.id === rang.slice(1) && x.rubrique === rub)); delete c.epuises?.[cle]; } }
    else { const x = ((c.modifs ||= {})[cle] ||= {}); if (visible) delete x.masque; else x.masque = true; if (!Object.keys(x).length) delete c.modifs[cle]; }
    net(S);
  },
  /** Épuisé pour un jour (date AAAA-MM-JJ) : le lendemain, la date ne correspond plus et le plat revient. */
  /* v7.13.0 : avec un `service` (midi, soir), le plat n'est épuisé que pour ce service-là : il revient au suivant. C'est une
     disponibilité du moment, appliquée aussitôt : elle ne passe pas par une publication et aucune version ne la restaure. */
  epuise(S, { cle, date, service = '', actif }) {
    const e = ((S.carte ||= {}).epuises ||= {});
    for (const k of Object.keys(e)) if (String(e[k]).slice(0, 10) < date) delete e[k]; /* les jours passés ne s'accumulent pas */
    if (actif) e[cle] = service ? `${date}/${service}` : date; else delete e[cle];
    net(S);
  },
  /** Monte ou descend un plat dans sa rubrique (`sens` : -1 ou 1), parmi ceux qui sont sur la carte. En préparation, comme le reste. */
  ordrePlat(S, { cle, sens, base }) {
    const rub = String(cle).split('/')[0], r = carteDe(base, S, '').find((x) => x.id === rub); if (!r) return;
    const l = r.plats.map((p) => p.cle), vus = r.plats.filter((p) => !p.masque).map((p) => p.cle), i = vus.indexOf(cle), j = i + (sens < 0 ? -1 : 1); if (i < 0 || j < 0 || j >= vus.length) return;
    const a = l.indexOf(vus[i]), b = l.indexOf(vus[j]); [l[a], l[b]] = [l[b], l[a]];
    const naturel = carteDe(base, { carte: { ...S.carte, ordre: {} } }, '').find((x) => x.id === rub).plats.map((p) => p.cle);
    const c = (S.carte ||= {}); (c.ordre ||= {})[rub] = l; if (JSON.stringify(l) === JSON.stringify(naturel)) delete c.ordre[rub];
    net(S);
  },
};
