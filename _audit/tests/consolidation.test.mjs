/* v7.14.1 · Des démonstrations isolées, une préparation fiable : la production engagée gardée à part de la commande,
   la période des retraits réglable, la correction d'une utilisation de carte après expiration (règles pures). */
import test from 'node:test';
import assert from 'node:assert/strict';
import { appliquer, creerDepot } from '../../assets/js/espace-donnees.js';
import { reglesAction } from '../../assets/js/espace-garde.js';
import { refusCommerce, commandeDe, disponibilite, engagements, preparation, lotsDe, productionAVerifier, preparationCommencee, effetsModification, effetsProduction, joursDeProduction, repriseProductionAFaire,
  periodeRetraits, periodeTexte, creneauxDuJour, refusRetrait, calendrierRetraits, raisonRetraitsTexte, ouvertureRetraits, soldeCarte, etatCarte, priorites } from '../../assets/js/commerce.js';

const LIEUX = { lignes: [], cadeaux: [50], retraits: { debut: '2026-12-05', fin: '2026-12-31' },
  emporter: [{ id: 'escargots', nom: 'Escargots à la crème d\'ail', texte: '', prix: 18, unite: 'piece' }, { id: 'foie-gras', nom: 'Foie gras de canard maison', prix: 36, unite: 'piece' }, { id: 'pate-lorrain', nom: 'Pâté lorrain', prix: 28, unite: 'kg' }] };
/* Les horaires livrés : fermé lundi et mardi ; mercredi et jeudi le midi ; vendredi midi et soir ; samedi le soir ; dimanche le midi. */
const SEMAINE = { lundi: [], mardi: [], mercredi: ['12:00-14:30'], jeudi: ['12:00-14:30'], vendredi: ['12:00-14:30', '19:00-00:00'], samedi: ['19:00-00:00'], dimanche: ['12:00-16:00'] };
const OUV = { semaine: SEMAINE, fermetures: [] };
const AUJ = '2026-12-01', J = '2026-12-11', J1 = '2026-12-12', LE = `${AUJ}T10:00`;   /* J : un vendredi (midi et soir) ; J+1 : un samedi (soir) */
const CTX = { auj: AUJ, lieux: LIEUX, ouverture: OUV };
const agir = (S, nom, args, ctx = CTX) => { const r = refusCommerce(S, nom, args, ctx); return r ? { S, refus: r } : { S: appliquer(S, nom, args), refus: '' }; };
const ok = (S, nom, args, ctx) => { const r = agir(S, nom, args, ctx); assert.equal(r.refus, '', `${nom} devrait passer : ${r.refus}`); return r.S; };
const non = (S, nom, args, motif, ctx) => { const r = agir(S, nom, args, ctx); assert.match(r.refus, motif, `${nom} devrait être refusé`); assert.deepEqual(r.S, S, 'un refus ne change rien'); return r.refus; };
const L = { esc: (q) => ({ offre: 'emporter-escargots', nom: 'Escargots à la crème d\'ail', unite: 'piece', prix: 18, quantite: q, total: 18 * q }), foie: (q) => ({ offre: 'emporter-foie-gras', nom: 'Foie gras de canard maison', unite: 'piece', prix: 36, quantite: q, total: 36 * q }) };
const demande = (id, lignes, plus = {}) => ({ id, genre: 'traiteur', cree: `${AUJ}T09:00:00`, lignes, total: lignes.reduce((s, l) => s + l.total, 0), jour: J, moment: 'soir', prenom: 'Julie', nom: 'Martin (exemple)', telephone: '06 00 00 00 01', email: '', publication: 0, ...plus });
const base = (d, S = {}) => commandeDe(d, S, LIEUX);
const cap = (S, production, retraits = null) => ok(S, 'cmdCapacites', { production, retraits, exemple: true });
const jusqua = (S, d, etat) => { S = ok(S, 'cmdValider', { id: d.id, base: base(d, S), le: LE }); for (const vers of ['preparation', 'prete', 'retiree']) { if (S.commerce.commandes[d.id].etat === etat) break; S = ok(S, 'cmdAvancer', { id: d.id, vers, le: LE }); } return S; };
const prod = (S, jour, offre = 'emporter-escargots') => engagements(S, jour).production[offre] || 0;

/* ====================== B · La production engagée ====================== */
test('B · la séquence complète : plafond 4, commande de 4 prête, réduite à 1, retrait déplacé à J+1, puis annulée — J garde ses 4 pièces', () => {
  const a = demande('T-A', [L.esc(4)]), b = demande('T-B', [L.esc(3)]), c1 = demande('T-C', [L.esc(1)]);
  let S = cap({}, { 'emporter-escargots': 4 }, 1);
  S = jusqua(S, a, 'prete');
  assert.deepEqual(lotsDe(S.commerce.commandes[a.id]).map((x) => [x.offre, x.unite, x.jour, x.quantite, x.quoi]), [['emporter-escargots', 'piece', J, 4, 'preparation']], 'le lancement garde le produit, l\'unité, la quantité et le jour prévu');
  /* Réduction à une pièce : le motif est obligatoire, la production ne bouge pas. */
  non(S, 'cmdModifier', { id: a.id, lignes: [L.esc(1)], le: LE }, /motif/);
  S = ok(S, 'cmdModifier', { id: a.id, lignes: [L.esc(1)], motif: 'Le client n\'en retire qu\'une.', le: LE });
  const k = S.commerce.commandes[a.id];
  assert.equal(k.lignes[0].quantite, 1, 'la commande à remettre indique une pièce'); assert.equal(k.total, 18); assert.equal(k.etat, 'prete', 'une réduction ne fait pas revenir en préparation');
  assert.equal(prod(S, J), 4, 'les quatre pièces préparées restent comptées'); assert.match(k.historique.at(-1).texte, /Production conservée.*production déjà engagée le vendredi 11 décembre \(4 pièces\) reste comptée/);
  non(S, 'cmdValider', { id: b.id, base: base(b, S), le: LE }, /production du vendredi 11 décembre est complète/);
  non(S, 'cmdValider', { id: c1.id, base: base(c1, S), le: LE }, /complète/, undefined);
  /* Retrait déplacé au lendemain : la production reste à J, rien n'est inventé à J+1 ; le créneau, lui, suit. */
  assert.deepEqual(engagements(S, J).retraits, { midi: 0, soir: 1 });
  S = ok(S, 'cmdModifier', { id: a.id, jour: J1, moment: 'soir', motif: 'Le client passe samedi.', le: LE });
  assert.equal(prod(S, J), 4, 'J garde sa production'); assert.equal(prod(S, J1), 0, 'aucune production n\'apparaît à J+1');
  assert.deepEqual(engagements(S, J).retraits, { midi: 0, soir: 0 }, 'le créneau de J est libéré'); assert.deepEqual(engagements(S, J1).retraits, { midi: 0, soir: 1 }, 'celui de J+1 est pris');
  non(S, 'cmdValider', { id: b.id, base: base(b, S), le: LE }, /complète/);
  /* Une autre commande ne peut pas prendre le créneau de J+1 (capacité : une commande par créneau)… */
  non(S, 'cmdValider', { id: 'T-D', base: base(demande('T-D', [L.foie(1)], { jour: J1 }), S), le: LE }, /retraits du samedi 12 décembre.*complets/);
  /* Annulation : les lots restent, le créneau est libéré. */
  S = ok(S, 'cmdAnnuler', { id: a.id, motif: 'Finalement annulée.', le: LE });
  assert.equal(prod(S, J), 4); assert.equal(prod(S, J1), 0); assert.deepEqual(engagements(S, J1).retraits, { midi: 0, soir: 0 });
  assert.match(S.commerce.commandes[a.id].historique.at(-1).texte, /production engagée reste comptée \(Escargots à la crème d'ail, 4 pièces le vendredi 11 décembre\)/);
  non(S, 'cmdValider', { id: b.id, base: base(b, S), le: LE }, /complète/);
  ok(S, 'cmdValider', { id: 'T-D', base: base(demande('T-D', [L.foie(1)], { jour: J1 }), S), le: LE });
  /* La vue de préparation dit la même chose : 4 engagés à J, rien à remettre. */
  const p = preparation(S, { jour: J }).produits.find((x) => x.offre === 'emporter-escargots');
  assert.equal(p.engage, 4); assert.equal(p.aRemettre, 0); assert.equal(p.capacite, 4); assert.deepEqual(p.ecarts.map((x) => [x.ref, x.etat, x.engage, x.aRemettre]), [['T-A', 'annulee', 4, 0]]);
  assert.ok(joursDeProduction(S).includes(J), 'le jour garde sa place dans « Préparation et retraits »');
});

test('B · compter une seule fois : réservé puis engagé, jamais les deux ; prête et retirée n\'ajoutent rien', () => {
  const a = demande('T-A', [L.esc(4)]); let S = cap({}, { 'emporter-escargots': 6 });
  S = ok(S, 'cmdValider', { id: a.id, base: base(a, S), le: LE });
  let e = engagements(S, J); assert.deepEqual([e.reservee['emporter-escargots'], e.engagee['emporter-escargots'] || 0, e.production['emporter-escargots']], [4, 0, 4]);
  S = ok(S, 'cmdAvancer', { id: a.id, vers: 'preparation', le: LE });
  e = engagements(S, J); assert.deepEqual([e.reservee['emporter-escargots'] || 0, e.engagee['emporter-escargots'], e.production['emporter-escargots']], [0, 4, 4], 'le lancement fait passer de « réservé » à « engagé »');
  /* Double clic : la seconde demande est refusée, rien n'est doublé. */
  non(S, 'cmdAvancer', { id: a.id, vers: 'preparation', le: LE }, /maintenant « en préparation »/);
  assert.equal(appliquer(S, 'cmdAvancer', { id: a.id, vers: 'preparation', le: LE }).commerce.commandes[a.id].production.lots.length, 1, 'même rejouée sans garde, l\'action n\'ajoute aucun lot');
  for (const vers of ['prete', 'retiree']) { S = ok(S, 'cmdAvancer', { id: a.id, vers, le: LE }); assert.equal(prod(S, J), 4); assert.equal(S.commerce.commandes[a.id].production.lots.length, 1); }
  /* Annulation avant la préparation : tout est libéré. */
  const b = demande('T-B', [L.esc(2)]); S = ok(S, 'cmdValider', { id: b.id, base: base(b, S), le: LE }); assert.equal(prod(S, J), 6);
  S = ok(S, 'cmdAnnuler', { id: b.id, motif: 'Annulée.', le: LE }); assert.equal(prod(S, J), 4); assert.equal(preparationCommencee(S.commerce.commandes[b.id]), false);
});

test('B · hausse après « Prête » : seul le supplément est contrôlé, il est engagé à part et la commande repasse en préparation', () => {
  const a = demande('T-A', [L.esc(4)]); let S = cap({}, { 'emporter-escargots': 6 }); S = jusqua(S, a, 'prete');
  const apres = { lignes: [L.esc(6)], jour: J, moment: 'soir' }, ep = effetsProduction(S.commerce.commandes[a.id], apres);
  assert.deepEqual(ep.supplement.map((x) => [x.offre, x.quantite, x.jour]), [['emporter-escargots', 2, J]]); assert.equal(ep.retour, true);
  assert.match(effetsModification(S.commerce.commandes[a.id], apres)[0], /4 pièces → 6 pièces à remettre/);
  const d = disponibilite(S, { jour: J, moment: 'soir', lignes: apres.lignes, sauf: a.id }).production[0];
  assert.deepEqual([d.aRemettre, d.dejaEngage, d.demande, d.engage, d.reste], [6, 4, 2, 4, 2], 'ce qui est demandé à la production, c\'est le supplément');
  S = ok(S, 'cmdModifier', { id: a.id, lignes: apres.lignes, motif: 'Deux de plus.', le: LE });
  const k = S.commerce.commandes[a.id];
  assert.equal(k.etat, 'preparation', 'les nouvelles quantités ne sont pas prêtes toutes seules'); assert.equal(S.demandes.statuts[a.id], 'preparation');
  assert.deepEqual(k.production.lots.map((x) => [x.quantite, x.quoi, x.jour]), [[4, 'preparation', J], [2, 'supplement', J]], 'la production précédente est gardée, le supplément identifié');
  assert.equal(prod(S, J), 6, 'sans double comptage'); assert.match(k.historique.at(-1).texte, /Supplément engagé en production.*2 pièces.*repasse en préparation/);
  /* Au-delà de la capacité : refusé, rien ne change. */
  non(S, 'cmdModifier', { id: a.id, lignes: [L.esc(7)], motif: 'Encore une.', le: LE }, /production du vendredi 11 décembre est complète/);
  /* Redescendre puis remonter sous ce qui est engagé ne demande rien de plus. */
  S = ok(S, 'cmdModifier', { id: a.id, lignes: [L.esc(2)], motif: 'Moins.', le: LE }); S = ok(S, 'cmdModifier', { id: a.id, lignes: [L.esc(5)], motif: 'Plus.', le: LE });
  assert.equal(S.commerce.commandes[a.id].production.lots.length, 2); assert.equal(prod(S, J), 6);
});

test('B · ajout et remplacement de produit après préparation : A reste engagé, B passe son propre contrôle', () => {
  const a = demande('T-A', [L.esc(4)]); let S = cap({}, { 'emporter-escargots': 4, 'emporter-foie-gras': 1 }); S = jusqua(S, a, 'preparation');
  non(S, 'cmdModifier', { id: a.id, lignes: [L.foie(2)], motif: 'Remplacement.', le: LE }, /Foie gras.*il ne reste que 1 pièce/);
  S = ok(S, 'cmdModifier', { id: a.id, lignes: [L.foie(1)], motif: 'Remplacement.', le: LE });
  const k = S.commerce.commandes[a.id];
  assert.deepEqual(k.lignes.map((l) => l.offre), ['emporter-foie-gras']); assert.equal(prod(S, J), 4, 'retirer la ligne préparée ne rend pas sa capacité'); assert.equal(prod(S, J, 'emporter-foie-gras'), 1);
  assert.deepEqual(k.production.lots.map((x) => [x.offre, x.quantite, x.quoi]), [['emporter-escargots', 4, 'preparation'], ['emporter-foie-gras', 1, 'supplement']]);
  assert.match(k.historique.at(-1).texte, /Produit retiré de la commande.*Production conservée.*à remettre : rien/);
  /* Ajout d'un produit en gardant le premier. */
  const b = demande('T-B', [L.foie(1)], { jour: J1 }); S = cap(S, { 'emporter-foie-gras': 2 }); S = jusqua(S, b, 'prete');
  S = ok(S, 'cmdModifier', { id: b.id, lignes: [L.foie(1), L.esc(2)], motif: 'Ajout.', le: LE });
  assert.equal(S.commerce.commandes[b.id].etat, 'preparation'); assert.equal(prod(S, J1), 2); assert.equal(prod(S, J1, 'emporter-foie-gras'), 1);
});

test('B · rectification de production : une action à part, motivée, tracée, revérifiée, appliquée une seule fois', () => {
  const a = demande('T-A', [L.esc(4)]); let S = cap({}, { 'emporter-escargots': 6 }); S = jusqua(S, a, 'prete');
  const lot = S.commerce.commandes[a.id].production.lots[0].id, R = { id: a.id, lot, jour: J, quantite: 3, op: 'rp-1', vu: { jour: J, quantite: 4 }, le: LE };
  non({ commerce: { commandes: { [a.id]: { ...S.commerce.commandes[a.id], etat: 'validee', production: undefined, produite: false } } } }, 'cmdRectifier', { ...R, motif: 'x' }, /n'a pas commencé/);
  non(S, 'cmdRectifier', R, /motif/); non(S, 'cmdRectifier', { ...R, motif: 'x', quantite: NaN }, /quantité produite/); non(S, 'cmdRectifier', { ...R, motif: 'x', jour: '2026-02-30' }, /jour de production/);
  non(S, 'cmdRectifier', { ...R, motif: 'x', quantite: 4 }, /Rien ne change/); non(S, 'cmdRectifier', { ...R, motif: 'x', vu: { jour: J, quantite: 5 } }, /a changé ailleurs/);
  S = ok(S, 'cmdRectifier', { ...R, motif: 'Trois pièces seulement ont été cuites.' });
  const k = S.commerce.commandes[a.id];
  assert.equal(prod(S, J), 3, 'la capacité suit'); assert.equal(k.lignes[0].quantite, 4, 'la commande du client ne change pas');
  assert.deepEqual(k.production.rectifications.map((r) => [r.avant, r.apres, r.motif, r.le]), [[{ jour: J, quantite: 4 }, { jour: J, quantite: 3 }, 'Trois pièces seulement ont été cuites.', LE]], 'l\'avant, l\'après, le motif et la date sont gardés');
  assert.match(k.historique.at(-1).texte, /Production rectifiée.*4 pièces le vendredi 11 décembre → 3 pièces le vendredi 11 décembre.*Motif/); assert.equal(k.historique.at(-1).quoi, 'rectification');
  /* La même opération renvoyée : refusée par les règles ; même rejouée telle quelle, elle n'est pas appliquée deux fois. */
  non(S, 'cmdRectifier', { ...R, motif: 'Trois pièces seulement ont été cuites.' }, /déjà enregistrée/);
  assert.deepEqual(appliquer(S, 'cmdRectifier', { ...R, quantite: 1, motif: 'rejeu' }).commerce.commandes[a.id].production, k.production);
  /* Une hausse et un déplacement de charge revérifient la capacité du jour visé. */
  const b = demande('T-B', [L.esc(3)]); S = jusqua(S, b, 'preparation'); assert.equal(prod(S, J), 6);
  non(S, 'cmdRectifier', { id: a.id, lot, jour: J, quantite: 4, motif: 'En fait quatre.', op: 'rp-2', le: LE }, /capacité du vendredi 11 décembre est de 6 pièces, et la production déjà comptée ce jour-là est de 3 pièces/);
  const c = demande('T-C', [L.esc(5)], { jour: J1 }); S = jusqua(S, c, 'preparation');
  non(S, 'cmdRectifier', { id: a.id, lot, jour: J1, quantite: 3, motif: 'Cuit samedi.', op: 'rp-3', le: LE }, /capacité du samedi 12 décembre/);
  S = ok(S, 'cmdRectifier', { id: a.id, lot, jour: J1, quantite: 1, motif: 'Une seule, cuite samedi.', op: 'rp-4', le: LE });
  assert.equal(prod(S, J), 3); assert.equal(prod(S, J1), 6);
  /* Ajouter une production oubliée (sans lot). */
  non(S, 'cmdRectifier', { id: a.id, lot: '', jour: J, quantite: 2, motif: 'Oubli.', op: 'rp-5', le: LE }, /Choisissez le produit/);
  S = ok(S, 'cmdRectifier', { id: a.id, lot: '', offre: 'emporter-foie-gras', nom: 'Foie gras de canard maison', unite: 'piece', jour: J, quantite: 2, motif: 'Deux foies gras lancés par erreur.', op: 'rp-5', le: LE });
  assert.equal(prod(S, J, 'emporter-foie-gras'), 2); assert.equal(S.commerce.commandes[a.id].production.lots.at(-1).quoi, 'ajout'); assert.equal(S.commerce.commandes[a.id].production.rectifications.at(-1).avant, null);
});

test('B · reprise des commandes d\'avant la v7.14.1 : fidèle quand c\'est sûr, « à vérifier » sinon, et sans effet quand on la rejoue', () => {
  const ancienne = (id, etat, plus = {}) => ({ id, ref: id, etat, lignes: [L.esc(2)], total: 36, jour: J, moment: 'soir', client: { prenom: 'Luc', nom: 'D. (exemple)', telephone: '', email: '' }, remarque: '', publication: 0, cree: LE, ...(['preparation', 'prete', 'retiree'].includes(etat) || plus.produite ? { produite: true } : {}),
    historique: [{ le: LE, quoi: 'recue', texte: 'Demande reçue.' }, { le: `${AUJ}T11:00`, quoi: 'validee', texte: 'Validée.' }, ...(etat === 'validee' ? [] : [{ le: `${AUJ}T12:00`, quoi: 'preparation', texte: 'Préparation lancée.' }])], ...plus });
  const corrigee = ancienne('T-OLD3', 'prete'); corrigee.lignes = [L.esc(1)]; corrigee.historique.push({ le: `${AUJ}T13:00`, quoi: 'correction', texte: 'Correction après le début de la préparation : Escargots à la crème d\'ail : 4 pièces → 1 pièce à préparer. Motif : erreur' });
  const S0 = { commerce: { capacites: { production: { 'emporter-escargots': 12 } }, commandes: { 'T-OLD1': ancienne('T-OLD1', 'prete'), 'T-OLD2': ancienne('T-OLD2', 'annulee', { produite: true }), 'T-OLD3': corrigee, 'T-OLD4': ancienne('T-OLD4', 'validee'), 'T-OLD5': ancienne('T-OLD5', 'retiree') } } };
  /* Avant même la reprise, les règles lisent ces commandes comme elles étaient comptées (le site peut s'ouvrir avant l'espace). */
  assert.equal(prod(S0, J), 9, '2 + 2 + 1 + 2 (réservé) + 2'); assert.equal(repriseProductionAFaire(S0), true); assert.equal(productionAVerifier(S0.commerce.commandes['T-OLD3']), true);
  const S = appliquer(S0, 'comReprendreProduction', { le: `${AUJ}T14:00` }), K = S.commerce.commandes;
  assert.equal(prod(S, J), 9, 'la reprise ne change aucun compte'); assert.equal(repriseProductionAFaire(S), false);
  for (const id of ['T-OLD1', 'T-OLD2', 'T-OLD5']) { assert.deepEqual(K[id].production.lots.map((x) => [x.offre, x.jour, x.quantite, x.quoi]), [['emporter-escargots', J, 2, 'reprise']]); assert.equal(K[id].production.aVerifier, undefined); assert.match(K[id].historique.at(-1).texte, /reprise telle qu'elle était comptée/); }
  assert.equal(K['T-OLD1'].production.lots[0].le, `${AUJ}T12:00`, 'datée du lancement de la préparation');
  assert.equal(K['T-OLD4'].production, undefined, 'une commande seulement validée n\'a rien d\'engagé');
  /* L'historique incomplet est signalé, sans reconstitution : on garde ce qui est connu (1 pièce), on ne devine pas les 4. */
  assert.equal(K['T-OLD3'].production.aVerifier, true); assert.deepEqual(K['T-OLD3'].production.lots.map((x) => x.quantite), [1]); assert.match(K['T-OLD3'].historique.at(-1).texte, /Production historique à vérifier.*ne sont pas reconstitués/);
  for (const id of Object.keys(K)) { const { production, historique, ...reste } = K[id], { production: p0, historique: h0, ...avant } = S0.commerce.commandes[id]; assert.deepEqual(reste, avant, 'identifiants, références, états, prix : inchangés'); assert.deepEqual(historique.slice(0, h0.length), h0, 'l\'historique est conservé'); }
  /* Une capacité incertaine n'est pas présentée comme certainement disponible. */
  assert.deepEqual(disponibilite(S, { jour: J, moment: 'midi', lignes: [L.esc(1)] }).aVerifier, ['T-OLD3']); assert.deepEqual(preparation(S, { jour: J }).aVerifier.map((x) => x.ref), ['T-OLD3']);
  assert.deepEqual(priorites([], S, LIEUX, AUJ).aVerifier, []);   /* (les priorités partent des demandes de l'espace ; ici aucune) */
  /* Rejouée, la reprise ne change rien du tout. */
  assert.deepEqual(appliquer(S, 'comReprendreProduction', { le: `${AUJ}T15:00` }), S); assert.deepEqual(appliquer(appliquer(S0, 'comReprendreProduction', { le: `${AUJ}T14:00` }), 'comReprendreProduction', { le: `${AUJ}T14:00` }), S);
  /* Le moyen explicite : compléter par une rectification, puis confirmer. */
  let T = ok(S, 'cmdRectifier', { id: 'T-OLD3', lot: K['T-OLD3'].production.lots[0].id, jour: J, quantite: 4, motif: 'Quatre pièces avaient été cuites.', op: 'rp-9', le: LE }, { auj: AUJ });
  assert.equal(T.commerce.commandes['T-OLD3'].production.aVerifier, true, 'rectifier ne vaut pas confirmation');
  T = ok(T, 'cmdProductionVerifiee', { id: 'T-OLD3', le: LE }); assert.equal(productionAVerifier(T.commerce.commandes['T-OLD3']), false); assert.deepEqual(disponibilite(T, { jour: J, moment: 'midi', lignes: [L.esc(1)] }).aVerifier, []);
  non(T, 'cmdProductionVerifiee', { id: 'T-OLD3', le: LE }, /n'est pas à vérifier/);
  /* Corriger une ancienne commande pas encore reprise la reprend d'abord : ses 2 pièces restent comptées. */
  const U = ok(S0, 'cmdModifier', { id: 'T-OLD1', lignes: [L.esc(1)], motif: 'Une seule.', le: LE }); assert.equal(lotsDe(U.commerce.commandes['T-OLD1'])[0].quantite, 2);
});

test('B · échec de sauvegarde : rien n\'est changé, rien n\'est annoncé comme fait', () => {
  const a = demande('T-A', [L.esc(4)]); let S = cap({}, { 'emporter-escargots': 4 }); S = jusqua(S, a, 'prete');
  let ecrit = 0, plein = false; const stock = { lire: () => JSON.parse(JSON.stringify(S)), ecrire: (d) => { if (plein) return false; S = JSON.parse(JSON.stringify(d)); ecrit++; return true; }, resasSite: () => [], vider: () => true };
  const depot = creerDepot(stock, () => 0, { regle: (nom, args, frais) => reglesAction({ auj: AUJ, lieux: LIEUX, semaine: SEMAINE, exceptions: [] }, frais, null, nom, args) });
  const avant = JSON.stringify(S); plein = true;
  assert.equal(depot.agir('cmdModifier', { id: a.id, lignes: [L.esc(1)], motif: 'Une seule.', le: LE }, { sansRetour: true }), false);
  assert.equal(depot.agir('cmdRectifier', { id: a.id, lot: 'l1', jour: J, quantite: 2, motif: 'Deux.', op: 'rp-1', le: LE }, { sansRetour: true }), false);
  assert.equal(JSON.stringify(S), avant, 'le stockage n\'a pas bougé'); assert.equal(ecrit, 0); assert.equal(depot.raisonRefus(), '', 'ce n\'est pas un refus des règles : l\'écran dit que l\'enregistrement a échoué');
  plein = false; assert.equal(depot.agir('cmdModifier', { id: a.id, lignes: [L.esc(1)], motif: 'Une seule.', le: LE }, { sansRetour: true }), true); assert.equal(prod(S, J), 4);
});

/* ====================== C · La période des retraits ====================== */
test('C · la période : réglage de départ conservé, bornes comprises, période invalide refusée, période après le 31 décembre 2026', () => {
  assert.deepEqual(periodeRetraits({}, LIEUX), { debut: '2026-12-05', fin: '2026-12-31', reglee: false }); assert.equal(periodeTexte(periodeRetraits({}, LIEUX)), 'du 5 au 31 décembre 2026');
  const P = periodeRetraits({}, LIEUX);
  assert.equal(refusRetrait(P, OUV, { jour: '2026-12-05', moment: 'soir', auj: AUJ }), '', 'le premier jour est compris'); assert.equal(refusRetrait(P, OUV, { jour: '2026-12-31', moment: 'midi', auj: AUJ }), '', 'le dernier jour est compris');
  assert.match(refusRetrait(P, OUV, { jour: '2026-12-04', moment: 'midi', auj: AUJ }), /hors de la période des retraits \(du 5 au 31 décembre 2026\)/); assert.match(refusRetrait(P, OUV, { jour: '2027-01-01', moment: 'midi', auj: AUJ }), /hors de la période/);
  for (const [debut, fin, motif] of [['2026-12-20', '2026-12-10', /avant le premier/], ['2026-12-20', '', /deux dates/], ['2026-02-30', '2026-03-10', /deux dates/], ['2026-01-01', '2027-06-30', /au plus un an/]]) non({}, 'cmdRetraits', { debut, fin }, motif);
  let S = ok({}, 'cmdRetraits', { debut: '2026-12-28', fin: '2027-01-10' });
  assert.deepEqual(periodeRetraits(S, LIEUX), { debut: '2026-12-28', fin: '2027-01-10', reglee: true }); assert.equal(periodeTexte(periodeRetraits(S, LIEUX)), 'du 28 décembre 2026 au 10 janvier 2027');
  assert.equal(refusRetrait(periodeRetraits(S, LIEUX), OUV, { jour: '2027-01-08', moment: 'soir', auj: AUJ }), '', 'un vendredi de janvier 2027 est possible'); assert.match(refusRetrait(periodeRetraits(S, LIEUX), OUV, { jour: '2026-12-11', moment: 'soir', auj: AUJ }), /hors de la période/);
  assert.equal(periodeTexte({ debut: '2027-01-01', fin: '2027-01-01' }), 'le 1er janvier 2027'); assert.equal(periodeTexte({ debut: '2026-12-01', fin: '2027-01-10' }), 'du 1er décembre 2026 au 10 janvier 2027');
  /* Revenir au réglage de départ ; un réglage abîmé dans le stockage ne casse rien. */
  S = ok(S, 'cmdRetraits', { debut: '', fin: '' }); assert.equal(periodeRetraits(S, LIEUX).reglee, false); assert.equal(periodeRetraits({ commerce: { retraits: { debut: 'x', fin: '2026-12-10' } } }, LIEUX).debut, '2026-12-05');
  /* Le réglage est opérationnel : publier, reprendre une ancienne publication ou effacer une offre ne le touchent pas. */
  let T = ok({}, 'cmdRetraits', { debut: '2026-12-10', fin: '2026-12-20' });
  T = appliquer(T, 'offre', { id: 'emporter-escargots', champs: { prix: 19 }, base: [] }); T = appliquer(T, 'offPublier', { perimetre: 'offres', le: LE, sources: {} }); T = appliquer(T, 'offReprendre', { n: 1, cote: 'avant', sources: {} });
  assert.deepEqual(T.commerce.retraits, { debut: '2026-12-10', fin: '2026-12-20' });
});

test('C · jours fermés, créneaux, délai, absence de disponibilité : une seule règle, des raisons dites', () => {
  const P = { debut: '2026-12-05', fin: '2026-12-31' };
  assert.deepEqual(creneauxDuJour(OUV, '2026-12-07'), { midi: false, soir: false, motif: '' }, 'lundi : fermé'); assert.deepEqual(creneauxDuJour(OUV, J), { midi: true, soir: true, motif: '' }); assert.deepEqual(creneauxDuJour(OUV, J1), { midi: false, soir: true, motif: '' });
  assert.match(refusRetrait(P, OUV, { jour: '2026-12-07', moment: 'midi', auj: AUJ }), /fermé le lundi 7 décembre/); assert.match(refusRetrait(P, OUV, { jour: J1, moment: 'midi', auj: AUJ }), /n'est pas ouvert à midi/);
  const ferme = { semaine: SEMAINE, fermetures: [{ du: '2026-12-10', au: '2026-12-12', motif: 'Travaux' }] };
  assert.match(refusRetrait(P, ferme, { jour: J, moment: 'soir', auj: AUJ }), /fermé le 11 décembre 2026 \(Travaux\)/);
  assert.match(refusRetrait(P, OUV, { jour: '2026-12-05', moment: 'soir', auj: '2026-12-06' }), /passé/); assert.match(refusRetrait(P, OUV, { jour: '2026-12-05', moment: 'soir', auj: '2026-12-03', delai: 3 }), /au moins 3 jours avant/); assert.equal(refusRetrait(P, OUV, { jour: '2026-12-06', moment: 'midi', auj: '2026-12-03', delai: 3 }), '');
  let cal = calendrierRetraits(P, OUV, { auj: AUJ });
  assert.equal(cal.jours.length, 27); assert.equal(cal.jours[0].iso, '2026-12-05'); assert.equal(cal.jours.at(-1).iso, '2026-12-31'); assert.equal(cal.premier, '2026-12-05'); assert.equal(cal.raison, '');
  assert.equal(cal.jours.filter((j) => j.etat === 'ferme').length, 8, 'quatre lundis et quatre mardis');
  cal = calendrierRetraits(P, OUV, { auj: '2026-12-10', delai: 2 }); assert.deepEqual([cal.jours.find((j) => j.iso === '2026-12-09').etat, cal.jours.find((j) => j.iso === '2026-12-11').etat, cal.jours.find((j) => j.iso === '2026-12-12').etat], ['passe', 'delai', 'ouvert']);
  /* Les créneaux complets (capacité de retrait) sortent du calendrier ; un jour dont tous les créneaux sont pleins est « complet ». */
  cal = calendrierRetraits(P, OUV, { auj: AUJ, complets: (iso) => (iso === J ? ['soir'] : iso === J1 ? ['soir'] : []) });
  assert.deepEqual([cal.jours.find((j) => j.iso === J).midi, cal.jours.find((j) => j.iso === J).soir, cal.jours.find((j) => j.iso === J).etat, cal.jours.find((j) => j.iso === J1).etat], [true, false, 'ouvert', 'complet']);
  /* Les quatre absences de disponibilité, chacune avec sa phrase. */
  assert.equal(calendrierRetraits(P, OUV, { auj: '2027-01-02' }).raison, 'terminee'); assert.match(raisonRetraitsTexte('terminee', P), /est terminée/);
  assert.equal(calendrierRetraits({ debut: '2026-12-07', fin: '2026-12-08' }, OUV, { auj: AUJ }).raison, 'aucun-jour'); assert.match(raisonRetraitsTexte('aucun-jour', P), /fermé pendant toute la période/);
  assert.equal(calendrierRetraits({ debut: J, fin: J1 }, OUV, { auj: AUJ, complets: () => ['midi', 'soir'] }).raison, 'aucun-creneau'); assert.match(raisonRetraitsTexte('aucun-creneau', P), /complets/);
  assert.equal(calendrierRetraits({ debut: J, fin: J1 }, OUV, { auj: '2026-12-10', delai: 5 }).raison, 'delai'); assert.match(raisonRetraitsTexte('delai', P, 5), /au moins 5 jours avant/);
  assert.equal(calendrierRetraits({ debut: '', fin: '' }, OUV, {}).raison, 'indefinie');
  /* Les horaires réglés par l'équipe l'emportent en démonstration ; en mode connecté, ce que ce navigateur a gardé n'est pas mêlé. */
  const S = { horaires: { semaine: { ...SEMAINE, lundi: ['12:00-14:00'] }, exceptions: [{ du: J, au: J, motif: 'Privatisation' }] } };
  assert.equal(creneauxDuJour(ouvertureRetraits({ semaine: SEMAINE, exceptions: [] }, S), '2026-12-07').midi, true); assert.equal(creneauxDuJour(ouvertureRetraits({ semaine: SEMAINE, exceptions: [] }, S), J).soir, false);
  assert.equal(creneauxDuJour(ouvertureRetraits({ semaine: SEMAINE, exceptions: [], connecte: true }, S), '2026-12-07').midi, false);
});

test('C · changer la période préserve les commandes acceptées ; une demande en attente devenue incompatible demande une décision explicite', () => {
  const a = demande('T-A', [L.esc(2)]), b = demande('T-B', [L.esc(1)], { jour: J1 }), c = demande('T-C', [L.esc(1)], { jour: '2026-12-18' });
  let S = ok({}, 'cmdValider', { id: a.id, base: base(a, {}), le: LE });
  S = ok(S, 'cmdRetraits', { debut: '2026-12-15', fin: '2026-12-31' });
  const k = S.commerce.commandes[a.id];
  assert.equal(k.etat, 'validee'); assert.equal(k.jour, J, 'ni annulée, ni déplacée'); assert.equal(prod(S, J), 2, 'toujours comptée');
  for (const vers of ['preparation', 'prete', 'retiree']) S = ok(S, 'cmdAvancer', { id: a.id, vers, le: LE });   /* elle reste traitable jusqu'au bout */
  /* La demande en attente (retrait le 12, hors de la nouvelle période) : refus dit avant validation, trois issues. */
  const refus = non(S, 'cmdValider', { id: b.id, base: base(b, S), le: LE }, /hors de la période des retraits \(du 15 au 31 décembre 2026\)/); assert.match(refus, /autre retrait.*refusez-la.*à titre exceptionnel/);
  const T = ok(S, 'cmdValider', { id: b.id, base: base(b, S), exception: true, le: LE }); assert.equal(T.commerce.commandes[b.id].horsPeriode, true); assert.match(T.commerce.commandes[b.id].historique.at(-1).texte, /à titre exceptionnel/);
  ok(S, 'cmdRefuser', { id: b.id, base: base(b, S), motif: 'Hors période.', le: LE });
  const U = ok(S, 'cmdModifier', { id: b.id, base: base(b, S), jour: '2026-12-19', moment: 'soir', le: LE }); ok(U, 'cmdValider', { id: b.id, le: LE });
  /* Une demande restée dans la période se valide comme avant ; un jour fermé demande la même décision explicite. */
  S = ok(S, 'cmdValider', { id: c.id, base: base(c, S), le: LE });
  non(S, 'cmdModifier', { id: c.id, jour: '2026-12-21', moment: 'midi', le: LE }, /fermé le lundi 21 décembre.*retrait exceptionnel/);
  S = ok(S, 'cmdModifier', { id: c.id, jour: '2026-12-21', moment: 'midi', exception: true, le: LE }); assert.equal(S.commerce.commandes[c.id].horsPeriode, true);
  /* Changer autre chose qu'un retrait déjà hors période ne redemande pas la décision. */
  S = ok(S, 'cmdModifier', { id: c.id, lignes: [L.esc(2)], le: LE }); assert.equal(S.commerce.commandes[c.id].horsPeriode, true);
  /* Sans les données du site (un contexte minimal), la garde ne bloque rien sur la période : elle ne juge que ce qu'elle connaît. */
  assert.equal(refusCommerce(S, 'cmdValider', { id: b.id, base: base(b, S), le: LE }, { auj: AUJ }), '');
});

/* ====================== D · Une utilisation corrigée après l'expiration de la carte ====================== */
test('D · carte de 50 €, 20 € utilisés, la carte expire, l\'utilisation est corrigée à 15 € : solde 35 €, carte toujours expirée', () => {
  const d = { id: 'C-1', genre: 'cadeau', cree: '2026-01-10T10:00:00', offre: 'cadeau-50', intitule: 'Carte cadeau de 50 €', montant: 50, quantite: 1, total: 50, pour: 'Léa', de: 'Hugo', mot: '', acheteur: { nom: 'Hugo S. (exemple)', telephone: '06 00 00 00 08', email: '' }, publication: 0 };
  const LIEUX2 = { ...LIEUX, cadeaux: [50] }, c0 = { auj: '2026-01-10' };
  let S = ok({}, 'cadValidite', { mois: 6, exemple: true }, c0);
  S = ok(S, 'cadValider', { id: d.id, base: { id: d.id, ref: d.id, etat: 'recue', offre: d.offre, intitule: d.intitule, montant: 50, quantite: 1, total: 50, pour: 'Léa', de: 'Hugo', mot: '', acheteur: d.acheteur, reglement: null, cartes: [], cree: d.cree, historique: [] }, le: '2026-01-10T10:05' }, c0);
  S = ok(S, 'cadRegler', { id: d.id, le: '2026-01-10T10:06' }, c0); S = ok(S, 'cadEmettre', { id: d.id, le: '2026-01-10T10:07' }, c0);
  const id = S.commerce.cadeaux[d.id].cartes[0]; assert.equal(S.commerce.cartes[id].expire, '2026-07-10');
  S = ok(S, 'carteUtiliser', { carte: id, montant: 20, ref: 'Déjeuner du 14 mars', par: 'Camille', op: 'op-1', vu: 50, le: '2026-03-14T13:30' }, { auj: '2026-03-14' });
  assert.equal(soldeCarte(S.commerce.cartes[id]), 30);
  /* La carte a expiré. */
  const APRES = { auj: '2026-12-02' }; assert.equal(etatCarte(S.commerce.cartes[id], APRES.auj), 'expiree');
  non(S, 'carteUtiliser', { carte: id, montant: 1, op: 'op-2', vu: 30, le: '2026-12-02T10:00' }, /a expiré le vendredi 10 juillet : elle ne peut plus être utilisée/, APRES);
  /* La correction historique : motif obligatoire, montant contrôlé, solde contrôlé. */
  const K = { carte: id, utilisation: 'u1', par: 'Camille', op: 'op-3', le: '2026-12-02T10:05' };
  non(S, 'carteCorriger', { ...K, montant: 15 }, /motif/, APRES); non(S, 'carteCorriger', { ...K, montant: 0, motif: 'x' }, /plus grand que zéro/, APRES); non(S, 'carteCorriger', { ...K, montant: 20, motif: 'x' }, /le même/, APRES); non(S, 'carteCorriger', { ...K, montant: 51, motif: 'x' }, /dépasserait la valeur restante/, APRES);
  S = ok(S, 'carteCorriger', { ...K, montant: 15, motif: 'L\'addition était de 15 €, pas de 20 €.' }, APRES);
  const c = S.commerce.cartes[id];
  assert.equal(soldeCarte(c), 35, 'solde historique : 35 €'); assert.equal(c.expire, '2026-07-10', 'la date d\'expiration ne change pas'); assert.equal(etatCarte(c, APRES.auj), 'expiree', 'la carte n\'est pas réactivée'); assert.equal(c.desactivee, undefined);
  assert.deepEqual(c.utilisations.map((u) => [u.id, u.montant, !!u.annulee, u.corrige || '']), [['u1', 20, true, ''], ['u2', 15, false, 'u1']], 'l\'opération d\'origine et la correction sont conservées');
  assert.equal(c.utilisations[0].annulee.remplaceePar, 'u2'); assert.match(c.historique.at(-1).texte, /corrigée : 20 € → 15 €.*Solde : 35 €\. La carte reste expirée depuis le 10 juillet 2026.*rien n'est remboursé/);
  /* Aucune nouvelle utilisation, même d'un euro ; la même correction répétée ne recrédite pas. */
  non(S, 'carteUtiliser', { carte: id, montant: 1, op: 'op-4', vu: 35, le: '2026-12-02T10:10' }, /a expiré/, APRES);
  non(S, 'carteCorriger', { ...K, montant: 15, motif: 'L\'addition était de 15 €, pas de 20 €.' }, /déjà enregistrée/, APRES);
  non(S, 'carteCorriger', { ...K, op: 'op-5', montant: 10, motif: 'encore' }, /déjà été annulée ou corrigée/, APRES);
  assert.deepEqual(appliquer(S, 'carteCorriger', { ...K, montant: 15, motif: 'rejeu' }), S, 'rejouée telle quelle, elle ne change rien'); assert.equal(soldeCarte(S.commerce.cartes[id]), 35);
  /* L'annulation d'une utilisation passée suit la même règle : possible, tracée, la carte reste expirée. */
  const T = ok(S, 'carteAnnulerUtilisation', { carte: id, utilisation: 'u2', motif: 'Saisie par erreur.', le: '2026-12-02T10:20' }, APRES);
  assert.equal(soldeCarte(T.commerce.cartes[id]), 50); assert.equal(etatCarte(T.commerce.cartes[id], APRES.auj), 'expiree'); assert.match(T.commerce.cartes[id].historique.at(-1).texte, /reste expirée/);
  /* Les autres états gardent leurs protections : une carte désactivée est figée jusqu'à sa réactivation, explicite. */
  let U = ok(S, 'carteActiver', { carte: id, actif: false, motif: 'Carte perdue.', le: '2026-12-02T10:30' }, APRES);
  non(U, 'carteCorriger', { ...K, op: 'op-6', utilisation: 'u2', montant: 10, motif: 'x' }, /désactivée.*historique est figé.*Réactivez-la/, APRES); non(U, 'carteAnnulerUtilisation', { carte: id, utilisation: 'u2', motif: 'x', le: LE }, /désactivée.*figé/, APRES);
  U = ok(U, 'carteActiver', { carte: id, actif: true, le: '2026-12-02T10:40' }, APRES); assert.equal(etatCarte(U.commerce.cartes[id], APRES.auj), 'expiree', 'réactiver ne repousse pas l\'expiration');
  /* Une carte épuisée se corrige aussi ; une carte active continue de se corriger comme avant. */
  let V = ok(S, 'carteCorriger', { ...K, op: 'op-7', utilisation: 'u2', montant: 50, motif: 'Tout a été utilisé.' }, { auj: '2026-06-01' }); assert.equal(etatCarte(V.commerce.cartes[id], '2026-06-01'), 'epuisee');
  V = ok(V, 'carteCorriger', { ...K, op: 'op-8', utilisation: 'u3', montant: 40, motif: 'Quarante.', le: '2026-06-01T12:00' }, { auj: '2026-06-01' }); assert.equal(soldeCarte(V.commerce.cartes[id]), 10); assert.doesNotMatch(V.commerce.cartes[id].historique.at(-1).texte, /reste expirée/);
});
