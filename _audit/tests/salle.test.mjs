/* Tests du plan de salle et de la fiche client (fonctions pures).
   Lancer : node --test _audit/tests/*.test.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { tablesDe, terrasseOuverte, planDuService, libre, possibles, proposer, placerTout } from '../../assets/js/espace-salle.js';
import { cleClient, fiche, marques, historique } from '../../assets/js/espace-clients.js';
import { appliquer } from '../../assets/js/espace-donnees.js';
import { ajouter, ouvertSite, resasDuJour, actives, creneaux } from '../../assets/js/espace-regles.js';
import { serviceDuJour } from '../../assets/js/espace-service.js';

const lire = (f) => JSON.parse(readFileSync(new URL(`../../donnees/${f}`, import.meta.url), 'utf8'));
const R = lire('reservation.json'), SALLE = lire('salle.json');
const AUJ = '2026-11-18';
const ctx = (site = []) => ({ R, auj: AUJ, site, exceptions: [] });
const JOUR = Array.from({ length: 10 }, (_, k) => ajouter(AUJ, k)).find((iso) => ouvertSite(R, iso, 'soir') && actives(resasDuJour(ctx(), {}, iso)).filter((r) => r.service === 'soir').length >= 3);
const plan = (S = {}, site = [], iso = JOUR) => planDuService(ctx(site), S, SALLE, iso, 'soir');

test('les tables : celles du plan du site, la terrasse fermée hors saison', () => {
  const hiver = tablesDe(SALLE, '2026-11-20'), ete = tablesDe(SALLE, '2027-07-10');
  assert.equal(hiver.length, SALLE.tables.length); assert.ok(hiver.every((t) => t.zoneNom && t.places > 0));
  assert.ok(hiver.filter((t) => t.zone === 'terrasse').every((t) => t.fermee)); assert.ok(hiver.filter((t) => t.zone !== 'terrasse').every((t) => !t.fermee));
  assert.ok(ete.every((t) => !t.fermee)); assert.equal(terrasseOuverte('2027-06-01'), true); assert.equal(terrasseOuverte('2027-10-01'), false);
});

test('le plan d\'un service : personne n\'est placé au départ, puis une réservation s\'assoit et se relève', () => {
  const p = plan(); assert.ok(p.aPlacer.length >= 3); assert.equal(p.placees.length, 0); assert.equal(p.conflits.length, 0);
  const r = p.aPlacer[0];
  let S = appliquer({}, 'placerResa', { id: r.id, table: '5' });
  let q = plan(S); assert.equal(q.placees.length, 1); assert.equal(q.tables.find((t) => t.id === '5').resas[0].id, r.id); assert.equal(q.aPlacer.length, p.aPlacer.length - 1);
  assert.equal(resasDuJour(ctx(), S, JOUR).find((x) => x.id === r.id).table, '5', 'la table suit la réservation partout (agenda, feuille)');
  S = appliquer(S, 'placerResa', { id: r.id, table: '' }); q = plan(S); assert.equal(q.placees.length, 0); assert.equal(q.aPlacer.length, p.aPlacer.length);
  S = appliquer({}, 'placerResa', { id: r.id, table: '5' }); S = appliquer(S, 'statut', { id: r.id, statut: 'annulee' });
  assert.equal(plan(S).tables.find((t) => t.id === '5').resas.length, 0, 'une réservation annulée libère sa table');
});

test('libre ou prise : deux réservations ne partagent pas une table en même temps', () => {
  const p = plan(), [a] = p.aPlacer, memeHeure = p.aPlacer.find((r) => r.id !== a.id && Math.abs(r.debutMin - a.debutMin) < p.service.duree);
  const S = appliquer({}, 'placerResa', { id: a.id, table: '7' }), q = plan(S), t7 = q.tables.find((t) => t.id === '7');
  if (memeHeure) { assert.equal(libre(t7, memeHeure), false); assert.ok(!possibles(q, memeHeure).some((t) => t.id === '7')); }
  assert.equal(libre(t7, a), true, 'sa propre table reste libre pour elle');
  assert.equal(libre(q.tables.find((t) => t.zone === 'terrasse'), a), false, 'la terrasse fermée n\'est jamais libre');
  /* Le site a pu donner la même table à deux clients : le plan le signale. */
  if (memeHeure) { const S2 = appliquer(S, 'placerResa', { id: memeHeure.id, table: '7' }); assert.deepEqual(plan(S2).conflits.map((c) => c.table), ['7']); }
});

test('la table proposée : la plus petite qui suffit ; « Placer tout seul » n\'assoit jamais deux tablées ensemble', () => {
  const p = plan();
  for (const r of p.aPlacer) { const t = proposer(p, r); if (t) { assert.ok(t.places >= +r.couverts); assert.ok(!possibles(p, r).some((x) => x.places < t.places && x.zone !== 'terrasse')); assert.notEqual(t.zone, 'terrasse'); } }
  const { places, restes } = placerTout(p); assert.equal(Object.keys(places).length + restes.length, p.aPlacer.length);
  const S = appliquer({}, 'placerPlusieurs', { places }), q = plan(S);
  assert.equal(q.conflits.length, 0); assert.equal(q.placees.length, Object.keys(places).length); assert.equal(q.aPlacer.length, restes.length);
  assert.ok(q.tables.every((t) => t.resas.every((r) => +r.couverts <= (r.via ? q.assemblages.find((a) => a.id === r.via).places : t.places))), 'personne n\'est serré (un groupe assis sur deux tables rapprochées compte sur leur capacité dite)');
  /* Une tablée de douze ne tient à aucune table : elle reste à placer. */
  const S2 = appliquer({}, 'ajouterResa', { resa: { id: 'tel-12', date: JOUR, service: 'soir', heure: creneaux(R, 'soir')[0], couverts: 12, nom: 'Tablée Essai' } });
  assert.ok(placerTout(plan(S2)).restes.some((r) => r.id === 'tel-12')); assert.equal(proposer(plan(S2), plan(S2).aPlacer.find((r) => r.id === 'tel-12')), null);
});

test('le client qui a choisi sa table sur le site arrive déjà placé', () => {
  const site = [{ id: 'R-SITE', date: JOUR, service: 'soir', heure: creneaux(R, 'soir')[2], couverts: 2, prenom: 'Claire', nom: 'Essai', telephone: '06 00 00 00 00', table: '4', espace: 'salle' }];
  const p = plan({ resa: { statuts: { 'R-SITE': 'confirmee' } } }, site);
  assert.equal(p.tables.find((t) => t.id === '4').resas[0].id, 'R-SITE'); assert.ok(p.placees.some((r) => r.id === 'R-SITE'));
});

test('la fiche client : reconnu à son téléphone, ses réservations, ce que la maison note', () => {
  assert.equal(cleClient({ nom: 'Claire Essai', telephone: '06 00 00 00 00' }), 't:+33600000000'); assert.equal(cleClient({ nom: 'Émilie W.' }), 'n-emilie-w'); assert.equal(cleClient({ id: 'r9', nom: 'Émilie W.' }), 's:r9', 'sans téléphone : une fiche par réservation (v7.11.0)'); assert.equal(cleClient({}), '');
  const r = serviceDuJour(ctx(), {}, JOUR, 'soir').resas[0], cle = cleClient(r), f = fiche(ctx(), {}, cle);
  assert.equal(f.nom, r.nom); assert.ok(f.resas.some((x) => x.id === r.id)); assert.equal(f.exemple, true); assert.equal(f.habitue, false); assert.deepEqual(f.allergies, []);
  assert.ok(f.resas.every((x) => cleClient(x) === cle)); assert.equal(f.venues + f.aVenir + f.absences + f.annulations <= f.resas.length, true);
  /* Un client d'exemple garde le même téléphone d'une réservation à l'autre : son histoire se suit. */
  const memeNom = historique(ctx(), {}, cle).filter((x) => x.nom === r.nom); assert.equal(memeNom.length, f.resas.length);
  let S = appliquer({}, 'client', { cle, champs: { habitue: true, allergies: ['Gluten', 'Gluten', ' Lait '], note: '  Table près du feu  ' } });
  assert.deepEqual(marques(S, r), { habitue: true, allergies: ['Gluten', 'Lait'], note: 'Table près du feu' });
  assert.deepEqual(marques(S, { nom: 'Quelqu\'un d\'autre', telephone: '06 99 99 99 99' }).allergies, []);
  S = appliquer(S, 'statut', { id: r.id, statut: 'absente' }); assert.equal(fiche(ctx(), S, cle).absences, 1);
  S = appliquer(S, 'client', { cle, champs: { habitue: false, allergies: [], note: '' } }); assert.equal(S.clients[cle], undefined, 'une fiche vidée ne laisse rien');
});
