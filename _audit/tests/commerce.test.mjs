/* v7.14.0 · Du catalogue à la remise au client : commandes à emporter, capacités, cartes cadeaux (règles pures). */
import test from 'node:test';
import assert from 'node:assert/strict';
import { appliquer } from '../../assets/js/espace-donnees.js';
import { offresDeBase, emporterVitrine, offresVitrine, cadeauxVitrine } from '../../assets/js/espace-publie.js';
import { validerOffre, offre } from '../../assets/js/espace-offres.js';
import { refusCommerce, commandeDe, commandes, lignesDeDemande, disponibilite, engagements, preparation, creneauxComplets, effetsModification, quantite, cadeauDe, lienOffreCadeau, cartes, soldeCarte, etatCarte, carteParCode, codeCarte, ajouterMois, priorites, commerceDuClient, reference } from '../../assets/js/commerce.js';

const LIEUX = { lignes: [{ id: 'menu-groupe', libelle: 'Menu de groupe', pu: 45, unite: 'par personne', exemple: true }], cadeaux: [25, 50, 100, 150, 200],
  emporter: [{ id: 'escargots', nom: 'Escargots à la crème d\'ail', texte: 'La douzaine.', prix: 18, unite: 'piece' }, { id: 'pate-lorrain', nom: 'Pâté lorrain', texte: '', prix: 28, unite: 'kg' }, { id: 'foie-gras', nom: 'Foie gras de canard maison', prix: 36, unite: 'piece' }] };
const AUJ = '2026-12-01', JOUR = '2026-12-12', LE = `${AUJ}T10:00`;
const agir = (S, nom, args) => { const r = refusCommerce(S, nom, args, { auj: AUJ }); return r ? { S, refus: r } : { S: appliquer(S, nom, args), refus: '' }; };
const ok = (S, nom, args) => { const r = agir(S, nom, args); assert.equal(r.refus, '', `${nom} devrait passer : ${r.refus}`); return r.S; };
const demande = (id, lignes, plus = {}) => ({ id, genre: 'traiteur', cree: `${AUJ}T09:00:00`, lignes, total: lignes.reduce((s, l) => s + l.total, 0), jour: JOUR, moment: 'soir', prenom: 'Julie', nom: 'Martin (exemple)', telephone: '06 00 00 00 01', email: '', publication: 0, ...plus });
const L = { esc: (q) => ({ offre: 'emporter-escargots', nom: 'Escargots à la crème d\'ail', unite: 'piece', prix: 18, quantite: q, total: 18 * q }), pate: (kg) => ({ offre: 'emporter-pate-lorrain', nom: 'Pâté lorrain', unite: 'kilo', prix: 28, quantite: kg, total: 28 * kg, detail: `1 × ${String(kg).replace('.', ',')} kg` }) };
const base = (d, S = {}) => commandeDe(d, S, LIEUX);

test('catalogue traiteur : les produits livrés deviennent des offres modifiables, avec une unité explicite et des quantités', () => {
  const b = offresDeBase(LIEUX).filter((o) => o.type === 'emporter');
  assert.deepEqual(b.map((o) => [o.id, o.unite, o.vente.min, o.vente.pas]), [['emporter-escargots', 'piece', 1, 1], ['emporter-pate-lorrain', 'kilo', 0.5, 0.5], ['emporter-foie-gras', 'piece', 1, 1]]);
  assert.equal(quantite(2, 'piece'), '2 pièces'); assert.equal(quantite(1.5, 'kilo'), '1,5 kg'); assert.match(quantite(2, ''), /unité à préciser/, 'sans unité connue, un nombre n\'est jamais présenté comme des pièces');
  assert.deepEqual(emporterVitrine(LIEUX, {}, AUJ).map((o) => o.id), b.map((o) => o.id), 'sans changement, la page propose les produits livrés');
  assert.ok(!offresVitrine(LIEUX, {}, AUJ).some((o) => o.type === 'emporter'), 'un produit à emporter ne s\'affiche pas parmi les formules de réception');
  assert.ok(validerOffre({ nom: 'Bûche', prix: '', unite: 'piece', type: 'emporter', site: true, vente: { min: '1', pas: '1', delai: '' } }).some((e) => e.champ === 'prix'), 'un produit proposé à la commande a besoin d\'un prix');
  assert.deepEqual(validerOffre({ nom: 'Bûche', prix: '', unite: 'piece', type: 'emporter', site: false, vente: { min: '1', pas: '1', delai: '' } }), [], 'un brouillon sans prix reste possible tant qu\'il n\'est pas proposé');
  assert.ok(validerOffre({ nom: 'Bûche', prix: '24', unite: 'personne', type: 'emporter', vente: { min: '1', pas: '1', delai: '' } }).some((e) => e.champ === 'unite'));
  assert.ok(validerOffre({ nom: 'Bûche', prix: '24', unite: 'piece', type: 'emporter', vente: { min: '0', pas: '1', delai: '' } }).some((e) => e.champ === 'min'));
  assert.deepEqual(validerOffre({ nom: 'Bûche', prix: '24', unite: 'kilo', type: 'emporter', vente: { min: '0,5', pas: '0,5', delai: '3' } }), []);
});

test('offre préparée puis publiée : le site ne suit que la version publiée ; un produit masqué ou archivé n\'est plus proposé', () => {
  let S = appliquer({}, 'offre', { id: 'emporter-escargots', champs: { prix: 20 }, base: offresDeBase(LIEUX) });
  assert.equal(emporterVitrine(LIEUX, S, AUJ).find((o) => o.id === 'emporter-escargots').prix, 18, 'préparée : le site garde 18 €');
  assert.equal(emporterVitrine(LIEUX, S, AUJ, true).find((o) => o.id === 'emporter-escargots').prix, 20, 'l\'aperçu montre 20 €');
  S = appliquer(S, 'offPublier', { perimetre: 'offre', id: 'emporter-escargots', le: LE, sources: { lieux: LIEUX } });
  assert.equal(emporterVitrine(LIEUX, S, AUJ).find((o) => o.id === 'emporter-escargots').prix, 20, 'publiée : le site suit');
  S = appliquer(S, 'offre', { id: 'emporter-foie-gras', champs: { prix: 40 }, base: offresDeBase(LIEUX) });
  assert.equal(emporterVitrine(LIEUX, S, AUJ).find((o) => o.id === 'emporter-foie-gras').prix, 36, 'une publication ne publie que son périmètre : le foie gras reste en préparation');
  S = appliquer(S, 'offArchiver', { id: 'emporter-pate-lorrain', actif: true, le: LE });
  assert.ok(!emporterVitrine(LIEUX, S, AUJ).some((o) => o.id === 'emporter-pate-lorrain'), 'archivé : plus proposé');
  assert.equal(offre(LIEUX, S, 'emporter-escargots', 'publie').prix, 20);
});

test('commande : la référence, les lignes, le total et le retrait sont les mêmes partout ; le cycle a le bon bouton au bon moment', () => {
  const d = demande('T-abc123', [L.esc(2), L.pate(1.5)]), c = base(d);
  assert.equal(c.ref, 'T-ABC123'); assert.equal(reference(d.id), c.ref); assert.equal(c.etat, 'recue'); assert.equal(c.total, 78, '2 × 18 € + 1,5 kg × 28 €'); assert.equal(c.lignes[1].quantite, 1.5); assert.equal(c.lignes[1].unite, 'kilo');
  let S = {};
  assert.match(agir(S, 'cmdAvancer', { id: d.id, vers: 'preparation', le: LE }).refus, /introuvable/, 'on ne prépare pas une demande non validée');
  S = ok(S, 'cmdValider', { id: d.id, base: c, le: LE });
  assert.equal(S.commerce.commandes[d.id].etat, 'validee'); assert.equal(S.demandes.statuts[d.id], 'confirmee', 'la demande et la commande restent liées');
  assert.match(agir(S, 'cmdAvancer', { id: d.id, vers: 'prete', le: LE }).refus, /validée/, 'pas d\'étape sautée');
  S = ok(S, 'cmdAvancer', { id: d.id, vers: 'preparation', le: LE }); S = ok(S, 'cmdAvancer', { id: d.id, vers: 'prete', le: LE }); S = ok(S, 'cmdAvancer', { id: d.id, vers: 'retiree', le: LE });
  const fin = S.commerce.commandes[d.id];
  assert.equal(fin.etat, 'retiree'); assert.deepEqual(fin.historique.map((h) => h.quoi), ['recue', 'validee', 'preparation', 'prete', 'retiree']); assert.equal(fin.total, 78); assert.equal(fin.ref, 'T-ABC123');
  assert.match(agir(S, 'cmdAnnuler', { id: d.id, motif: 'erreur', le: LE }).refus, /retirée/);
  assert.equal(commandes([{ ...d, brut: d }], S, LIEUX).length, 1, 'une demande et sa commande ne font qu\'un : pas de double comptage');
  assert.match(agir({}, 'cmdRefuser', { id: d.id, base: c, motif: '', le: LE }).refus, /motif/);
  assert.equal(ok({}, 'cmdRefuser', { id: d.id, base: c, motif: 'Produit indisponible ce jour-là.', le: LE }).commerce.commandes[d.id].etat, 'refusee');
});

test('capacités : une demande non validée n\'engage rien ; la dernière capacité ne se donne qu\'une fois ; une commande compte une seule fois', () => {
  let S = ok({}, 'cmdCapacites', { production: { 'emporter-escargots': 3 }, retraits: 2, exemple: true });
  const a = demande('T-a', [L.esc(2)]), b = demande('T-b', [L.esc(2)]), c3 = demande('T-c', [L.esc(1)]);
  assert.deepEqual(engagements(S, JOUR).production, {}, 'rien n\'est engagé tant que rien n\'est validé');
  S = ok(S, 'cmdValider', { id: a.id, base: base(a), le: LE });
  /* Le second onglet valide « T-b » : les règles relisent l'état frais, où « T-a » est déjà validée. */
  const r = agir(S, 'cmdValider', { id: b.id, base: base(b), le: LE });
  assert.match(r.refus, /il ne reste que 1 pièce/); assert.match(r.refus, /n'a pas été validée/); assert.equal(r.S.commerce.commandes[b.id], undefined, 'rien n\'est enregistré pour la commande refusée');
  S = ok(S, 'cmdValider', { id: c3.id, base: base(c3), le: LE });
  assert.equal(engagements(S, JOUR).production['emporter-escargots'], 3);
  for (const vers of ['preparation', 'prete', 'retiree']) { S = ok(S, 'cmdAvancer', { id: a.id, vers, le: LE }); assert.equal(engagements(S, JOUR).production['emporter-escargots'], 3, `toujours comptée une fois (${vers})`); }
  assert.deepEqual(creneauxComplets(S, JOUR), ['soir'], 'deux commandes validées le soir : le créneau est complet');
  assert.match(agir(S, 'cmdValider', { id: 'T-d', base: base(demande('T-d', [L.pate(1)])), le: LE }).refus, /retraits .* sont complets/);
  assert.equal(agir(S, 'cmdValider', { id: 'T-e', base: base(demande('T-e', [L.pate(1)], { moment: 'midi' })), le: LE }).refus, '', 'le midi reste libre ; le pâté n\'a pas de capacité définie : rien n\'est inventé');
  assert.equal(disponibilite(S, { jour: '2026-12-13', moment: 'soir', lignes: [L.esc(3)] }).ok, true, 'un autre jour a sa propre capacité');
});

test('annulation : avant la préparation tout est libéré ; après, la production reste comptée et le créneau est libéré', () => {
  let S = ok({}, 'cmdCapacites', { production: { 'emporter-escargots': 4 }, retraits: 1 });
  const a = demande('T-a', [L.esc(4)]);
  S = ok(S, 'cmdValider', { id: a.id, base: base(a), le: LE });
  assert.match(agir(S, 'cmdAnnuler', { id: a.id, motif: '', le: LE }).refus, /motif/);
  let T = ok(S, 'cmdAnnuler', { id: a.id, motif: 'Le client a changé d\'avis.', le: LE });
  assert.deepEqual(engagements(T, JOUR), { production: {}, retraits: { midi: 0, soir: 0 } }); assert.match(T.commerce.commandes[a.id].historique.at(-1).texte, /libérés/);
  T = ok(S, 'cmdAvancer', { id: a.id, vers: 'preparation', le: LE }); T = ok(T, 'cmdAnnuler', { id: a.id, motif: 'Annulée après cuisson.', le: LE });
  assert.equal(engagements(T, JOUR).production['emporter-escargots'], 4, 'ce qui a été produit ne redevient pas une capacité'); assert.equal(engagements(T, JOUR).retraits.soir, 0, 'le créneau est libéré');
  assert.match(T.commerce.commandes[a.id].historique.at(-1).texte, /production reste comptée/);
});

test('modification : les effets sont dits, les contraintes revérifiées, l\'engagement remplacé ; après la préparation, une trace et un motif', () => {
  let S = ok({}, 'cmdCapacites', { production: { 'emporter-escargots': 5 } });
  const a = demande('T-a', [L.esc(2)]), b = demande('T-b', [L.esc(2)]);
  S = ok(S, 'cmdValider', { id: a.id, base: base(a), le: LE }); S = ok(S, 'cmdValider', { id: b.id, base: base(b), le: LE });
  const c = S.commerce.commandes[a.id];
  assert.deepEqual(effetsModification(c, { ...c, lignes: [L.esc(3)], moment: 'midi' }), ['Escargots à la crème d\'ail : 2 pièces → 3 pièces à préparer.', 'Retrait : samedi 12 décembre, le soir → samedi 12 décembre, à midi.', 'Total : 36 € → 54 €.']);
  assert.match(agir(S, 'cmdModifier', { id: a.id, lignes: [L.esc(4)], le: LE }).refus, /il ne reste que 3 pièces/, 'l\'ancien engagement de la commande est remplacé, pas ajouté');
  S = ok(S, 'cmdModifier', { id: a.id, lignes: [L.esc(3)], moment: 'midi', le: LE });
  assert.equal(engagements(S, JOUR).production['emporter-escargots'], 5); assert.equal(S.commerce.commandes[a.id].total, 54); assert.deepEqual(engagements(S, JOUR).retraits, { midi: 1, soir: 1 });
  S = ok(S, 'cmdAvancer', { id: a.id, vers: 'preparation', le: LE });
  assert.match(agir(S, 'cmdModifier', { id: a.id, lignes: [L.esc(2)], le: LE }).refus, /motif de cette correction/);
  S = ok(S, 'cmdModifier', { id: a.id, lignes: [L.esc(2)], motif: 'Une boîte en moins, vu au téléphone.', le: LE });
  assert.equal(S.commerce.commandes[a.id].historique.at(-1).quoi, 'correction');
  const p = preparation(S, { jour: JOUR });
  assert.deepEqual(p.produits.map((x) => [x.nom, x.aPreparer, x.unite]), [['Escargots à la crème d\'ail', 4, 'piece']], 'les quantités à préparer sont regroupées par produit');
});

test('changement du catalogue après la commande : la commande reçue garde ses lignes, ses prix et son total', () => {
  const d = demande('T-a', [L.esc(2), L.pate(1.5)]);
  let S = ok({}, 'cmdValider', { id: d.id, base: base(d), le: LE });
  S = appliquer(S, 'offre', { id: 'emporter-escargots', champs: { prix: 25, nom: 'Escargots (nouvelle recette)' }, base: offresDeBase(LIEUX) });
  S = appliquer(S, 'offPublier', { perimetre: 'offre', id: 'emporter-escargots', le: LE, sources: { lieux: LIEUX } });
  S = appliquer(S, 'offArchiver', { id: 'emporter-pate-lorrain', actif: true, le: LE });
  const c = commandeDe({ ...d, brut: d }, S, LIEUX);
  assert.deepEqual(c.lignes.map((l) => [l.nom, l.prix, l.quantite]), [['Escargots à la crème d\'ail', 18, 2], ['Pâté lorrain', 28, 1.5]]); assert.equal(c.total, 78);
  const autre = base(demande('T-b', [L.esc(1)]), S); assert.equal(autre.lignes[0].prix, 18, 'une demande reçue avant le changement garde aussi son prix');
});

test('reprise des anciennes demandes : relues sans rien inventer, reliées seulement si c\'est certain, une seule fois', () => {
  const vieille = { id: 'T-vieux', genre: 'traiteur', cree: '2026-11-20T10:00:00', produits: [{ nom: 'Escargots à la crème d\'ail', qte: 2 }, { nom: 'Pâté lorrain · 1,5 kg', qte: 1 }], total: 78, jour: JOUR, moment: 'soir', prenom: 'Luc', nom: 'D.' };
  const l = lignesDeDemande(vieille, LIEUX, {});
  assert.deepEqual(l.map((x) => [x.offre, x.unite, x.quantite, x.prix]), [['emporter-escargots', 'piece', 2, 18], ['emporter-pate-lorrain', 'kilo', 1.5, 28]], 'les prix redonnent exactement le total d\'alors : ils sont repris');
  const floue = lignesDeDemande({ ...vieille, total: 70, produits: [{ nom: 'Terrine du chef', qte: 2 }] }, LIEUX, {});
  assert.deepEqual(floue.map((x) => [x.offre, x.unite, x.prix]), [['', '', null]], 'produit inconnu : ni lien, ni unité, ni prix inventés');
  const args = { commandes: [{ id: vieille.id, statut: 'confirmee', base: base(vieille) }], cadeaux: [{ id: 'C-vieux', statut: 'envoyee', base: cadeauDe({ id: 'C-vieux', genre: 'cadeau', montant: 100, quantite: 1, total: 100, pour: 'Léa', de: 'Hugo' }, {}, LIEUX) }], le: LE };
  const S = appliquer({}, 'comReprendre', args), S2 = appliquer(S, 'comReprendre', args);
  assert.equal(S.commerce.commandes[vieille.id].etat, 'validee'); assert.equal(engagements(S, JOUR).production['emporter-escargots'], 2);
  assert.equal(S.commerce.cadeaux['C-vieux'].etat, 'ancienne'); assert.equal(S.commerce.cadeaux['C-vieux'].reglement, null); assert.deepEqual(cartes(S), [], 'aucun paiement ni aucun code n\'est inventé');
  assert.deepEqual(S2, S, 'rejouer la reprise ne change rien');
});

test('carte cadeau : l\'offre choisie est gardée ; une ancienne demande n\'est reliée que si la correspondance est certaine', () => {
  const neuve = { id: 'C-1', genre: 'cadeau', montant: 250, quantite: 1, total: 250, offre: 'cadeau-200', intitule: 'Carte cadeau de 250 €', publication: 3, acheteur: { nom: 'Hugo S. (exemple)', telephone: '06 00 00 00 02' } };
  let S = appliquer({}, 'offre', { id: 'cadeau-200', champs: { prix: 250 }, base: offresDeBase(LIEUX) }); S = appliquer(S, 'offPublier', { perimetre: 'offre', id: 'cadeau-200', le: LE, sources: { lieux: LIEUX } });
  assert.ok(cadeauxVitrine(LIEUX, S, AUJ).some((o) => o.prix === 250 && o.nom === 'Carte cadeau de 250 €'), 'la carte publiée à 250 € est proposée, avec un nom juste');
  const c = cadeauDe(neuve, S, LIEUX); assert.deepEqual([c.offre, c.intitule, c.publication, c.montant, c.total], ['cadeau-200', 'Carte cadeau de 250 €', 3, 250, 250]);
  S = appliquer(S, 'offre', { id: 'cadeau-200', champs: { prix: 300 }, base: offresDeBase(LIEUX) }); S = appliquer(S, 'offPublier', { perimetre: 'offre', id: 'cadeau-200', le: LE, sources: { lieux: LIEUX } });
  assert.equal(cadeauDe(neuve, S, LIEUX).intitule, 'Carte cadeau de 250 €', 'un changement du catalogue ne réécrit pas la demande');
  assert.deepEqual(lienOffreCadeau({ montant: 100 }, LIEUX, {}), { offre: 'cadeau-100', intitule: 'Carte cadeau de 100 €', publication: null, certain: true });
  assert.equal(lienOffreCadeau({ montant: 200 }, LIEUX, S).certain, false, 'la carte livrée à 200 € ne vaut plus 200 € : le lien reste à préciser');
  assert.equal(lienOffreCadeau({ montant: 60 }, LIEUX, {}).certain, false);
});

const cadeau2 = { id: 'C-2', genre: 'cadeau', cree: `${AUJ}T09:30:00`, montant: 50, quantite: 2, total: 100, pour: 'Léa', de: 'Hugo', mot: 'Bon anniversaire', offre: 'cadeau-50', intitule: 'Carte cadeau de 50 €', publication: 0, acheteur: { nom: 'Hugo Simon (exemple)', telephone: '06 00 00 00 02', email: '' } };
function emises(S = {}) {
  const b = cadeauDe(cadeau2, S, LIEUX);
  S = ok(S, 'cadValider', { id: cadeau2.id, base: b, acheteur: b.acheteur, le: LE }); S = ok(S, 'cadRegler', { id: cadeau2.id, le: LE }); return ok(S, 'cadEmettre', { id: cadeau2.id, le: LE });
}

test('émission : après validation et règlement simulé seulement ; deux cartes de 50 € sont deux cartes distinctes ; jamais deux fois', () => {
  const b = cadeauDe(cadeau2, {}, LIEUX);
  assert.match(agir({}, 'cadEmettre', { id: cadeau2.id, base: b, le: LE }).refus, /après la validation .* règlement simulé/);
  assert.match(agir({}, 'cadValider', { id: cadeau2.id, base: { ...b, acheteur: { nom: '', telephone: '', email: '' } }, le: LE }).refus, /acheteur/, 'la signature « De la part de » ne fait pas un acheteur');
  let S = ok({}, 'cadValider', { id: cadeau2.id, base: b, acheteur: b.acheteur, le: LE });
  assert.match(agir(S, 'cadEmettre', { id: cadeau2.id, le: LE }).refus, /règlement simulé/);
  S = ok(S, 'cadRegler', { id: cadeau2.id, le: LE }); assert.equal(S.commerce.cadeaux[cadeau2.id].reglement.simule, true);
  S = ok(S, 'cadEmettre', { id: cadeau2.id, le: LE });
  const l = cartes(S); assert.equal(l.length, 2); assert.deepEqual(l.map((c) => [c.valeur, soldeCarte(c), c.rang, c.expire]), [[50, 50, 1, null], [50, 50, 2, null]], 'deux cartes de 50 €, pas une de 100 € ; validité non définie : aucune date inventée');
  assert.notEqual(l[0].code, l[1].code); assert.ok(l.every((c) => /^DEMO-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(c.code)), 'un code reconnaissable comme un code de démonstration'); assert.equal(codeCarte(l[0].id), l[0].code, 'le code d\'une carte ne change pas');
  assert.match(agir(S, 'cadEmettre', { id: cadeau2.id, le: LE }).refus, /déjà émises/); assert.equal(cartes(appliquer(S, 'cadEmettre', { id: cadeau2.id, le: LE })).length, 2, 'même rejouée, l\'émission ne crée rien de plus');
  assert.equal(carteParCode(S, l[0].code.toLowerCase().replace(/-/g, ' ')).id, l[0].id);
  let V = ok({}, 'cadValidite', { mois: 6, exemple: true }); V = emises(V); assert.equal(cartes(V)[0].expire, ajouterMois(AUJ, 6)); assert.equal(etatCarte(cartes(V)[0], '2027-07-01'), 'expiree');
});

test('utilisation : partielle, solde suivi, dépassement refusé, carte épuisée, expirée ou désactivée refusée avec un message clair', () => {
  let S = emises(); const [c1, c2] = cartes(S).map((c) => c.id);
  S = ok(S, 'carteUtiliser', { carte: c1, montant: 20, ref: 'Déjeuner du 3 décembre', par: 'Régis', op: 'op-1', vu: 50, le: LE });
  assert.deepEqual(cartes(S).map(soldeCarte), [30, 50], 'la première carte passe à 30 €, la seconde reste à 50 €');
  const r = agir(S, 'carteUtiliser', { carte: c1, montant: 35, op: 'op-2', vu: 30, le: LE }); assert.match(r.refus, /solde de cette carte est de 30 €/); assert.match(r.refus, /Rien n'a été débité/); assert.equal(soldeCarte(r.S.commerce.cartes[c1]), 30);
  assert.match(agir(S, 'carteUtiliser', { carte: c1, montant: 0, op: 'op-3', le: LE }).refus, /plus grand que zéro/); assert.match(agir(S, 'carteUtiliser', { carte: c1, montant: -5, op: 'op-3', le: LE }).refus, /plus grand que zéro/);
  S = ok(S, 'carteUtiliser', { carte: c1, montant: 30, op: 'op-4', vu: 30, le: LE }); assert.equal(etatCarte(S.commerce.cartes[c1], AUJ), 'epuisee'); assert.match(agir(S, 'carteUtiliser', { carte: c1, montant: 5, op: 'op-5', le: LE }).refus, /épuisée/);
  assert.match(agir(S, 'carteActiver', { carte: c2, actif: false, motif: '', le: LE }).refus, /motif/);
  const D = ok(S, 'carteActiver', { carte: c2, actif: false, motif: 'Carte perdue.', le: LE }); assert.match(agir(D, 'carteUtiliser', { carte: c2, montant: 5, op: 'op-6', le: LE }).refus, /désactivée \(Carte perdue\.\)/);
  assert.equal(agir(ok(D, 'carteActiver', { carte: c2, actif: true, le: LE }), 'carteUtiliser', { carte: c2, montant: 5, op: 'op-7', le: LE }).refus, '');
  /* Masquer ou archiver l'offre ne désactive pas les cartes émises. */
  const M = appliquer(S, 'offArchiver', { id: 'cadeau-50', actif: true, le: LE }); assert.equal(etatCarte(M.commerce.cartes[c2], AUJ), 'active'); assert.equal(agir(M, 'carteUtiliser', { carte: c2, montant: 10, op: 'op-8', le: LE }).refus, '');
});

test('répétition, conflit, correction, annulation : pas de double débit ; ce qui est dit est ce qui a été enregistré', () => {
  let S = emises(); const [c1] = cartes(S).map((c) => c.id);
  S = ok(S, 'carteUtiliser', { carte: c1, montant: 20, op: 'op-1', vu: 50, le: LE });
  assert.match(agir(S, 'carteUtiliser', { carte: c1, montant: 20, op: 'op-1', vu: 50, le: LE }).refus, /déjà enregistrée .* seconde fois/, 'la même opération rejouée ne débite pas deux fois');
  assert.equal(soldeCarte(appliquer(S, 'carteUtiliser', { carte: c1, montant: 20, op: 'op-1', le: LE }).commerce.cartes[c1]), 30, 'même appliquée de force, elle reste sans effet');
  /* Un autre onglet affichait encore 50 € : il apprend le vrai solde, rien n'est débité. */
  const conflit = agir(S, 'carteUtiliser', { carte: c1, montant: 40, op: 'op-autre-onglet', vu: 50, le: LE }); assert.match(conflit.refus, /a changé ailleurs : il est maintenant de 30 €/);
  S = ok(S, 'carteUtiliser', { carte: c1, montant: 20, op: 'op-2', vu: 30, le: LE }); assert.equal(soldeCarte(S.commerce.cartes[c1]), 10, 'deux utilisations voulues du même montant sont permises');
  assert.match(agir(S, 'carteCorriger', { carte: c1, utilisation: 'u2', montant: 15, motif: '', op: 'op-3', le: LE }).refus, /motif de la correction/);
  S = ok(S, 'carteCorriger', { carte: c1, utilisation: 'u2', montant: 15, motif: 'Addition de 15 € et non de 20 €.', par: 'Régis', op: 'op-3', le: LE });
  const c = S.commerce.cartes[c1]; assert.equal(soldeCarte(c), 15); assert.equal(c.utilisations.length, 3, 'rien n\'est effacé'); assert.equal(c.utilisations[1].annulee.remplaceePar, 'u3'); assert.equal(c.utilisations[2].corrige, 'u2');
  assert.match(agir(S, 'carteCorriger', { carte: c1, utilisation: 'u2', montant: 10, motif: 'x', op: 'op-4', le: LE }).refus, /déjà été annulée ou corrigée/);
  S = ok(S, 'carteAnnulerUtilisation', { carte: c1, utilisation: 'u1', motif: 'Passée sur la mauvaise carte.', le: LE }); assert.equal(soldeCarte(S.commerce.cartes[c1]), 35); assert.match(agir(S, 'carteAnnulerUtilisation', { carte: c1, utilisation: 'u1', motif: 'encore', le: LE }).refus, /déjà été annulée/);
  assert.deepEqual(S.commerce.cartes[c1].historique.map((h) => h.quoi), ['emise', 'utilisation', 'utilisation', 'correction', 'annulation']);
});

test('aujourd\'hui et fiche client : les priorités du jour, sans effet sur les couverts ; aucun rattachement sur un nom seul', () => {
  const a = demande('T-a', [L.esc(2)], { jour: AUJ, moment: 'soir', telephone: '06 11 22 33 44' }), b = demande('T-b', [L.pate(1)], { telephone: '06 99 99 99 99', prenom: 'Julie', nom: 'Martin (exemple)' });
  let S = ok({}, 'cmdValider', { id: a.id, base: base(a), le: LE }); S = emises(S);
  const dem = [{ ...a, brut: a }, { ...b, brut: b }, { ...cadeau2, brut: cadeau2 }], p = priorites(dem, S, LIEUX, AUJ);
  assert.deepEqual([p.aDecider.map((c) => c.id), p.aPreparer.map((c) => c.id), p.retraits.map((c) => c.id), p.cartesAEmettre.length], [['T-b'], ['T-a'], ['T-a'], 0]);
  assert.equal(S.resa, undefined, 'une commande ne crée aucune réservation : elle ne prend ni table ni couvert');
  const julie = { id: 'cl-1', nom: 'Julie Martin (exemple)', telephone: '0611223344', email: '' }, f = commerceDuClient(julie, dem, S, LIEUX);
  assert.deepEqual(f.commandes.map((c) => c.id), ['T-a'], 'même nom, autre téléphone : la seconde commande n\'est pas rattachée');
  assert.equal(f.cadeaux.length, 0); assert.equal(commerceDuClient({ id: 'cl-2', nom: 'Léa', telephone: '', email: '' }, dem, S, LIEUX).cartesRecues.length, 0, 'le prénom du bénéficiaire ne suffit pas');
  const carte = cartes(S)[0].id; S = ok(S, 'comLier', { quoi: 'carte', id: carte, client: 'cl-2' }); S = ok(S, 'comLier', { quoi: 'commande', id: 'T-b', client: 'cl-1' });
  assert.deepEqual(commerceDuClient({ id: 'cl-2', nom: 'Léa' }, dem, S, LIEUX).cartesRecues.map((c) => c.id), [carte], 'une association faite à la main rattache la carte reçue');
  assert.deepEqual(commerceDuClient(julie, dem, S, LIEUX).commandes.map((c) => c.id).sort(), ['T-a', 'T-b']);
  const hugo = commerceDuClient({ id: 'cl-3', nom: 'Hugo', telephone: '06 00 00 00 02' }, dem, S, LIEUX); assert.equal(hugo.cadeaux.length, 1); assert.equal(hugo.cartesAchetees.length, 2, 'l\'acheteur retrouve ses deux cartes, comptées une fois chacune');
});

/* ---------- Les deux démonstrations (v7.14.0) : rejouables, datées à l'horloge du scénario, sans donnée réelle ---------- */
import { SCENARIOS, depart, avancement } from '../../assets/js/espace-scenarios.js';
const R = JSON.parse((await import('node:fs')).readFileSync(new URL('../../donnees/reservation.json', import.meta.url), 'utf8'));
const LIEUX_SC = { ...LIEUX, retraits: { debut: '2026-12-05', fin: '2026-12-31' } };

test('démonstration 7 : une commande jusqu\'au retrait, toujours du même point, avec une vraie unité au kilo', () => {
  assert.deepEqual(SCENARIOS.slice(6).map((s) => [s.id, s.numero, s.etapes.length]), [['commande', 7, 6], ['cadeau', 8, 6]]);
  const a = depart('commande', R, '2026-11-23', { lieux: LIEUX_SC }), b = depart('commande', R, '2027-03-02', { lieux: LIEUX_SC });
  assert.deepEqual(a, b, 'le même départ quel que soit le jour réel'); assert.deepEqual(a.horloge, { iso: '2026-12-02', min: 600 });
  assert.ok(a.demandes.every((d) => d.source === 'demo' && /^sc7-/.test(d.id)), 'des demandes visiblement fictives'); assert.equal(a.etat.commerce.capacites.exemple, true, 'les capacités sont dites « exemples »');
  assert.equal(a.etat.commerce.commandes['sc7-paul'].etat, 'validee'); assert.equal(a.etat.commerce.commandes['sc7-paul'].jour, '2026-12-05'); assert.equal(a.etat.commerce.commandes['sc7-nadia'], undefined, 'Nadia B. attend une décision');
  assert.equal(engagements(a.etat, '2026-12-05').production['emporter-escargots'], 4);
  const av = (S, demandes, vus = {}) => avancement('commande', { S, vus, iso: a.horloge.iso, lieux: LIEUX_SC, demandes });
  assert.equal(av(a.etat, a.demandes).faites, 0);
  /* Le visiteur commande sur le site : 2 escargots et 1,5 kg de pâté lorrain, à l'horloge du scénario. */
  const d = demande('T-site', [L.esc(2), L.pate(1.5)], { jour: '2026-12-05', cree: '2026-12-02T10:05:00' }), dem = [...a.demandes, d];
  assert.equal(av(a.etat, dem, { 'offre-catalogue': 1, 'cmd-dossier': 1 }).faites, 3);
  let S = ok(a.etat, 'cmdValider', { id: d.id, base: commandeDe(d, a.etat, LIEUX_SC), le: '2026-12-02T10:10' });
  assert.equal(S.commerce.commandes[d.id].total, 78, '2 × 18 € + 1,5 kg × 28 € = 78 €'); assert.equal(engagements(S, '2026-12-05').production['emporter-escargots'], 6);
  /* Variante : Nadia B. demande les 2 derniers escargots du même soir. La seconde validation est refusée, rien n'est enregistré. */
  const nadia = a.demandes.find((x) => x.id === 'sc7-nadia'), refus = agir(S, 'cmdValider', { id: nadia.id, base: commandeDe(nadia, S, LIEUX_SC), le: '2026-12-02T10:12' });
  assert.match(refus.refus, /production du samedi 5 décembre est complète/); assert.equal(refus.S.commerce.commandes[nadia.id], undefined);
  /* Variante : annulation de Marc L. avant la préparation : le vendredi est libéré. */
  assert.equal(engagements(S, '2026-12-11').production['emporter-foie-gras'], 1);
  const T = ok(S, 'cmdAnnuler', { id: 'sc7-marc', motif: 'Le client a annulé.', le: '2026-12-02T10:15' }); assert.deepEqual(engagements(T, '2026-12-11').production, {});
  for (const vers of ['preparation', 'prete']) S = ok(S, 'cmdAvancer', { id: d.id, vers, le: '2026-12-05T17:00' });
  assert.equal(av(S, dem, { 'offre-catalogue': 1, 'cmd-dossier': 1 }).faites, 5);
  S = ok(S, 'cmdAvancer', { id: d.id, vers: 'retiree', le: '2026-12-05T19:10' });
  const fin = av(S, dem, { 'offre-catalogue': 1, 'cmd-dossier': 1 }); assert.equal(fin.fini, true); assert.match(fin.conclusion, /T-SITE/); assert.match(fin.conclusion, /1,5 kg Pâté lorrain/); assert.match(fin.conclusion, /6 pièces d'escargots engagées sur 6/); assert.match(fin.conclusion, /Rien n'a été envoyé ni encaissé/);
});

test('démonstration 8 : deux cartes de 50 €, 20 € utilisés, 35 € refusés ; la validité est un exemple', () => {
  const a = depart('cadeau', R, '2026-11-23', { lieux: LIEUX }), dem = a.demandes, av = (S, vus = {}) => avancement('cadeau', { S, vus, iso: a.horloge.iso, lieux: LIEUX, demandes: dem });
  assert.deepEqual(depart('cadeau', R, '2026-11-23', { lieux: LIEUX }), a); assert.equal(a.horloge.min, 600); assert.equal(a.etat.commerce.exempleValidite, true); assert.equal(av(a.etat).faites, 0);
  assert.ok(cadeauxVitrine(LIEUX, a.etat, a.horloge.iso).some((o) => o.prix === 250), 'variante : la carte à 250 € est proposée sur le site');
  const le = `${a.horloge.iso}T10:05`, b = cadeauDe(dem[0], a.etat, LIEUX);
  assert.deepEqual([b.acheteur.nom, b.pour, b.de, b.total], ['Hugo S.', 'Léa', 'Hugo', 100], 'l\'acheteur, la bénéficiaire et la signature sont distincts');
  let S = ok(a.etat, 'cadValider', { id: b.id, base: b, acheteur: b.acheteur, le }); S = ok(S, 'cadRegler', { id: b.id, le }); S = ok(S, 'cadEmettre', { id: b.id, le });
  assert.equal(av(S, { 'cad-dossier': 1 }).faites, 4); assert.equal(cartes(S)[0].expire, ajouterMois(a.horloge.iso, 6), 'la validité d\'exemple s\'applique aux cartes émises');
  const [c1] = cartes(S).map((c) => c.id);
  S = ok(S, 'carteUtiliser', { carte: c1, montant: 20, op: 'a', vu: 50, le }); assert.deepEqual(cartes(S).map(soldeCarte), [30, 50]);
  assert.match(agir(S, 'carteUtiliser', { carte: c1, montant: 35, op: 'b', vu: 30, le }).refus, /35 € ne peuvent pas être utilisés/);
  const fin = av(S, { 'cad-dossier': 1, 'cad-refus': 1 }); assert.equal(fin.fini, true); assert.match(fin.conclusion, /solde 30 €/); assert.match(fin.conclusion, /solde 50 €/); assert.match(fin.conclusion, /exemple à confirmer/); assert.match(fin.conclusion, /Aucun paiement réel/);
});
