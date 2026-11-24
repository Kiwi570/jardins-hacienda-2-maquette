/* v7.15.0 · Les deux correctifs préalables.
   A. Une production rectifiée laisse une commande cohérente : ce qui manque reste à produire, réservé, jamais inventé.
   B. Un contexte indéterminable n'enregistre rien dans les données habituelles (voir aussi isolation.test.mjs). */
import test from 'node:test';
import assert from 'node:assert/strict';
import { appliquer } from '../../assets/js/espace-donnees.js';
import { refusCommerce, commandeDe, engagements, resteAProduire, manqueDe, lotsDe, preparation, priorites, disponibilite } from '../../assets/js/commerce.js';

const LIEUX = { lignes: [], cadeaux: [50], retraits: { debut: '2026-12-05', fin: '2026-12-31' }, emporter: [{ id: 'escargots', nom: 'Escargots à la crème d\'ail', prix: 18, unite: 'piece' }] };
const AUJ = '2026-12-01', J = '2026-12-11', J1 = '2026-12-12', LE = `${AUJ}T10:00`, CTX = { auj: AUJ };
const agir = (S, nom, args) => { const r = refusCommerce(S, nom, args, CTX); return r ? { S, refus: r } : { S: appliquer(S, nom, args), refus: '' }; };
const ok = (S, nom, args) => { const r = agir(S, nom, args); assert.equal(r.refus, '', `${nom} devrait passer : ${r.refus}`); return r.S; };
const non = (S, nom, args, motif) => { const r = agir(S, nom, args); assert.match(r.refus, motif, `${nom} devrait être refusé`); assert.deepEqual(r.S, S, 'un refus ne change rien'); return r.refus; };
const esc = (q) => ({ offre: 'emporter-escargots', nom: 'Escargots à la crème d\'ail', unite: 'piece', prix: 18, quantite: q, total: 18 * q });
const demande = (id, q, plus = {}) => ({ id, genre: 'traiteur', cree: `${AUJ}T09:00:00`, lignes: [esc(q)], total: 18 * q, jour: J, moment: 'soir', prenom: 'Julie', nom: 'Martin (exemple)', telephone: '06 00 00 00 01', email: '', publication: 0, ...plus });
const base = (d, S = {}) => commandeDe(d, S, LIEUX);
const depart = (cap = 4) => ok({}, 'cmdCapacites', { production: { 'emporter-escargots': cap }, retraits: null, exemple: true });
const jusqua = (S, d, etat) => { S = ok(S, 'cmdValider', { id: d.id, base: base(d, S), le: LE }); for (const vers of ['preparation', 'prete', 'retiree']) { if (S.commerce.commandes[d.id].etat === etat) break; S = ok(S, 'cmdAvancer', { id: d.id, vers, le: LE }); } return S; };
const compte = (S, jour) => { const e = engagements(S, jour); return [e.engagee['emporter-escargots'] || 0, e.reservee['emporter-escargots'] || 0, e.production['emporter-escargots'] || 0]; };
const RECTIF = { lot: 'l1', jour: J, quantite: 1, motif: 'Une seule pièce a été cuite.', op: 'rp-1', vu: { jour: J, quantite: 4 }, le: LE };

test('A · commande prête de quatre, production rectifiée à une : une engagée + trois réservées = quatre comptées ; une commande de trois est refusée', () => {
  const a = demande('T-A', 4), b = demande('T-B', 3); let S = jusqua(depart(), a, 'prete');
  assert.deepEqual(compte(S, J), [4, 0, 4]);
  S = ok(S, 'cmdRectifier', { id: a.id, ...RECTIF });
  const c = S.commerce.commandes[a.id];
  assert.deepEqual(compte(S, J), [1, 3, 4], 'une pièce engagée, trois restant à produire, quatre comptées');
  assert.deepEqual(lotsDe(c).map((x) => [x.quantite, x.jour, x.quoi]), [[1, J, 'preparation']], 'la quantité rectifiée est gardée dans le lot ; aucun lot de trois n\'est inventé');
  assert.deepEqual(resteAProduire(c).map((x) => [x.offre, x.quantite]), [['emporter-escargots', 3]]); assert.deepEqual(manqueDe(c).map((x) => x.quantite), [3]);
  assert.equal(c.etat, 'preparation', 'une commande prête repasse en préparation'); assert.equal(S.demandes.statuts[a.id], 'preparation'); assert.equal(c.lignes[0].quantite, 4, 'le client retire toujours quatre pièces');
  assert.match(c.historique.at(-1).texte, /4 pièces le vendredi 11 décembre → 1 pièce.*Il reste à produire pour l'honorer : Escargots à la crème d'ail, 3 pièces \(réservé dans la capacité du vendredi 11 décembre\).*repasse en préparation.*Motif/);
  non(S, 'cmdValider', { id: b.id, base: base(b, S), le: LE }, /production du vendredi 11 décembre est complète/);
  assert.equal(disponibilite(S, { jour: J, moment: 'midi', lignes: [esc(1)] }).ok, false, 'pas même une pièce de plus');
  /* Les écrans lisent la même chose : le tableau du jour, et « Commandes à compléter » dans Aujourd'hui. */
  const p = preparation(S, { jour: J }).produits[0]; assert.deepEqual([p.engage, p.aRemettre, p.ecarts[0].manque], [1, 4, 3]);
  assert.deepEqual(priorites([{ ...a, id: a.id }], S, LIEUX, AUJ).aCompleter.map((x) => x.ref), ['T-A']);
});

test('A · « Prête » et « Retirée » sont refusées tant que le complément manque ; l\'engager ne compte rien deux fois, puis le parcours reprend', () => {
  const a = demande('T-A', 4), b = demande('T-B', 3); let S = jusqua(depart(), a, 'prete');
  S = ok(S, 'cmdRectifier', { id: a.id, ...RECTIF });
  const dit = non(S, 'cmdAvancer', { id: a.id, vers: 'prete', le: LE }, /Il reste à produire pour cette commande : Escargots à la crème d'ail, 3 pièces\. Engagez le complément/); assert.match(dit, /marquer prête/);
  non(S, 'cmdAvancer', { id: a.id, vers: 'retiree', le: LE }, /maintenant « en préparation »/);   /* un écran resté sur « Prête » : la remise directe ne passe pas non plus */
  /* La même rectification renvoyée : refusée, sans second effet. */
  non(S, 'cmdRectifier', { id: a.id, ...RECTIF }, /déjà enregistrée/); assert.deepEqual(appliquer(S, 'cmdRectifier', { id: a.id, ...RECTIF }), S);
  /* Engager le complément : la réserve devient un lot, le total reste de quatre. */
  S = ok(S, 'cmdCompleter', { id: a.id, le: LE });
  const c = S.commerce.commandes[a.id];
  assert.deepEqual(compte(S, J), [4, 0, 4], 'les mêmes pièces ne sont pas comptées deux fois'); assert.deepEqual(lotsDe(c).map((x) => [x.quantite, x.jour, x.quoi]), [[1, J, 'preparation'], [3, J, 'complement']]);
  assert.deepEqual(manqueDe(c), []); assert.equal(c.etat, 'preparation'); assert.match(c.historique.at(-1).texte, /Complément engagé en production pour le vendredi 11 décembre : Escargots à la crème d'ail, 3 pièces/); assert.equal(c.historique.at(-1).quoi, 'complement');
  /* Répété : rien à engager, aucun second effet. */
  non(S, 'cmdCompleter', { id: a.id, le: LE }, /plus de complément à engager/); assert.deepEqual(appliquer(S, 'cmdCompleter', { id: a.id, le: LE }), S);
  non(S, 'cmdValider', { id: b.id, base: base(b, S), le: LE }, /complète/);
  /* Le parcours reprend normalement. */
  S = ok(S, 'cmdAvancer', { id: a.id, vers: 'prete', le: LE }); S = ok(S, 'cmdAvancer', { id: a.id, vers: 'retiree', le: LE }); assert.deepEqual(compte(S, J), [4, 0, 4]);
});

test('A · autres issues : corriger ce que le client retire ; le complément suit le jour du retrait courant ; un dépassement est expliqué avant d\'écrire', () => {
  const a = demande('T-A', 4); let S = jusqua(depart(), a, 'prete'); S = ok(S, 'cmdRectifier', { id: a.id, ...RECTIF });
  /* Le client ne retire finalement qu'une pièce : plus rien ne manque, trois pièces de capacité se libèrent. */
  let T = ok(S, 'cmdModifier', { id: a.id, lignes: [esc(1)], motif: 'Il n\'en retire qu\'une.', le: LE }); assert.deepEqual(compte(T, J), [1, 0, 1]); assert.deepEqual(manqueDe(T.commerce.commandes[a.id]), []);
  ok(T, 'cmdAvancer', { id: a.id, vers: 'prete', le: LE });
  /* Une hausse pendant qu'un complément manque : seule la hausse est engagée ; le complément reste réservé. */
  T = ok(depart(8), 'cmdValider', { id: a.id, base: base(a, depart(8)), le: LE }); for (const vers of ['preparation', 'prete']) T = ok(T, 'cmdAvancer', { id: a.id, vers, le: LE }); T = ok(T, 'cmdRectifier', { id: a.id, ...RECTIF });
  T = ok(T, 'cmdModifier', { id: a.id, lignes: [esc(6)], motif: 'Deux de plus.', le: LE });
  assert.deepEqual(lotsDe(T.commerce.commandes[a.id]).map((x) => [x.quantite, x.quoi]), [[1, 'preparation'], [2, 'supplement']]); assert.deepEqual(compte(T, J), [3, 3, 6]); assert.deepEqual(manqueDe(T.commerce.commandes[a.id]).map((x) => x.quantite), [3]);
  /* Le retrait a été déplacé au lendemain avant la rectification : les lots restent à J, le complément se réserve à J+1. */
  let U = jusqua(depart(), a, 'prete'); U = ok(U, 'cmdModifier', { id: a.id, jour: J1, moment: 'soir', motif: 'Il passe samedi.', le: LE }); U = ok(U, 'cmdRectifier', { id: a.id, ...RECTIF });
  assert.deepEqual(compte(U, J), [1, 0, 1], 'le lot garde son jour'); assert.deepEqual(compte(U, J1), [0, 3, 3], 'la réserve suit le jour du retrait courant');
  U = ok(U, 'cmdCompleter', { id: a.id, le: LE }); assert.deepEqual(compte(U, J1), [3, 0, 3]); assert.deepEqual(lotsDe(U.commerce.commandes[a.id]).map((x) => [x.quantite, x.jour]), [[1, J], [3, J1]]);
  /* Si le jour du retrait est déjà plein, la rectification qui y reporterait du travail est refusée, et dit pourquoi. */
  let V = jusqua(depart(), a, 'prete'); V = ok(V, 'cmdModifier', { id: a.id, jour: J1, moment: 'soir', motif: 'Il passe samedi.', le: LE });
  const autre = demande('T-C', 4, { jour: J1 }); V = jusqua(V, autre, 'preparation');
  non(V, 'cmdRectifier', { id: a.id, ...RECTIF }, /après cette rectification, il resterait 3 pièces de plus à produire pour le samedi 12 décembre, jour du retrait, où la capacité est de 4 pièces/);
});

test('A · rectifier une commande retirée ou annulée reste de l\'historique : ni préparation active, ni réserve, ni retrait', () => {
  const a = demande('T-A', 4), b = demande('T-B', 2); let S = depart(8); S = jusqua(S, a, 'retiree'); S = jusqua(S, b, 'prete'); S = ok(S, 'cmdAnnuler', { id: b.id, motif: 'Annulée.', le: LE });
  const histoA = S.commerce.commandes[a.id].historique.length;
  S = ok(S, 'cmdRectifier', { id: a.id, lot: 'l1', jour: J, quantite: 1, motif: 'Une seule avait été cuite.', op: 'rp-a', le: LE }); S = ok(S, 'cmdRectifier', { id: b.id, lot: 'l1', jour: J, quantite: 1, motif: 'Une seule avait été cuite.', op: 'rp-b', le: LE });
  const A = S.commerce.commandes[a.id], B = S.commerce.commandes[b.id];
  assert.deepEqual([A.etat, B.etat], ['retiree', 'annulee'], 'l\'état terminal est conservé'); assert.equal(A.historique.length, histoA + 1, 'l\'historique est conservé, la rectification s\'y ajoute'); assert.doesNotMatch(A.historique.at(-1).texte, /Il reste à produire|repasse en préparation/);
  assert.deepEqual(compte(S, J), [2, 0, 2], 'aucune obligation de préparation n\'est recréée'); assert.deepEqual([manqueDe(A), manqueDe(B)], [[], []]); assert.deepEqual(engagements(S, J).retraits, { midi: 0, soir: 1 }, 'aucune réservation de retrait nouvelle (seule la commande retirée compte, comme avant)');
  const p = preparation(S, { jour: J }); assert.deepEqual(p.commandes.map((c) => c.ref), ['T-A']); assert.deepEqual(priorites([a, b], S, LIEUX, AUJ).aCompleter, []);
  non(S, 'cmdCompleter', { id: a.id, le: LE }, /« retirée »/); non(S, 'cmdCompleter', { id: b.id, le: LE }, /« annulée »/);
});

test('A · non-régression v7.14.1 : quatre préparées, contenu réduit à une, retrait déplacé, annulation — les quatre restent comptées au jour de production', () => {
  const a = demande('T-A', 4); let S = jusqua(depart(), a, 'prete');
  S = ok(S, 'cmdModifier', { id: a.id, lignes: [esc(1)], motif: 'Une seule.', le: LE }); assert.deepEqual(compte(S, J), [4, 0, 4]); assert.equal(S.commerce.commandes[a.id].etat, 'prete');
  S = ok(S, 'cmdModifier', { id: a.id, jour: J1, moment: 'soir', motif: 'Samedi.', le: LE }); assert.deepEqual(compte(S, J), [4, 0, 4]); assert.deepEqual(compte(S, J1), [0, 0, 0]);
  S = ok(S, 'cmdAnnuler', { id: a.id, motif: 'Annulée.', le: LE }); assert.deepEqual(compte(S, J), [4, 0, 4]); assert.deepEqual(compte(S, J1), [0, 0, 0]);
  non(S, 'cmdValider', { id: 'T-B', base: base(demande('T-B', 1), S), le: LE }, /complète/);
});

/* ---------- Finitions de la v7.15.0 ---------- */
test('finitions : l\'historique d\'une carte écrit les dates en clair ; le refus de capacité accorde ses mots', async () => {
  const { cartes, cadeauDe } = await import('../../assets/js/commerce.js');
  const d = { id: 'C-1', genre: 'cadeau', cree: `${AUJ}T09:00:00`, montant: 50, quantite: 1, total: 50, pour: 'Léa', de: 'Hugo', acheteur: { nom: 'Hugo S. (exemple)', telephone: '06 00 00 00 02', email: '' }, offre: 'cadeau-50', intitule: 'Carte cadeau de 50 €', publication: 0 };
  let S = ok({}, 'cadValider', { id: d.id, base: cadeauDe(d, {}, LIEUX), acheteur: d.acheteur, le: LE }); S = ok(S, 'cadRegler', { id: d.id, le: LE }); S = ok(S, 'cadEmettre', { id: d.id, le: LE });
  const c = cartes(S)[0].id; S = ok(S, 'carteUtiliser', { carte: c, montant: 20, op: 'u-a', vu: 50, le: `${AUJ}T12:30` });
  S = ok(S, 'carteCorriger', { carte: c, utilisation: 'u1', montant: 15, motif: 'L\'addition était de 15 €.', op: 'c-a', vu: 30, le: `${AUJ}T15:00` });
  const traces = cartes(S)[0].historique.map((h) => h.texte).join(' | ');
  assert.match(traces, /Utilisation du mardi 1er décembre à 12 h 30 corrigée : 20 € → 15 €/); assert.doesNotMatch(traces, /\d{4}-\d{2}-\d{2}/, 'aucune date brute dans les phrases de l\'historique');
  /* Le refus de capacité : « il ne reste que … à produire … (demande : … ; capacité : …) », sans accord fautif. */
  const a = demande('T-A', 3), b = demande('T-B', 3); let T = jusqua(depart(), a, 'validee');
  const r = non(T, 'cmdValider', { id: b.id, base: base(b, T), le: LE }, /il ne reste que 1 pièce à produire pour le vendredi 11 décembre \(demande : 3 pièces ; capacité : 4 pièces\)/); assert.doesNotMatch(r, /demandés/);
});
