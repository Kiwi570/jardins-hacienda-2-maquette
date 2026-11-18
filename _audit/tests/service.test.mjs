/* Tests du service : la frise, la charge de la salle, arrivés, absent, modifier une réservation (fonctions pures).
   Lancer : node --test _audit/tests/*.test.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { serviceDuJour, serviceCourant, gestes, heuresPossibles, dureeDe, DUREES } from '../../assets/js/espace-service.js';
import { appliquer } from '../../assets/js/espace-donnees.js';
import { ajouter, enMin, ouvertSite, resasDuJour, actives, couverts, creneaux, STATUTS } from '../../assets/js/espace-regles.js';
import { bilanSemaine, lundiDe } from '../../assets/js/espace-conseils.js';

const R = JSON.parse(readFileSync(new URL('../../donnees/reservation.json', import.meta.url), 'utf8'));
const AUJ = '2026-11-18';
const ctx = (site = []) => ({ R, auj: AUJ, site, exceptions: [] });
const JOUR = Array.from({ length: 10 }, (_, k) => ajouter(AUJ, k)).find((iso) => ouvertSite(R, iso, 'soir') && resasDuJour(ctx(), {}, iso).some((r) => r.service === 'soir'));

test('la frise : chaque réservation occupe la salle de son heure à la fin du repas', () => {
  const sv = serviceDuJour(ctx(), {}, JOUR, 'soir');
  assert.equal(sv.ouvert, true); assert.equal(sv.duree, DUREES.soir); assert.ok(sv.resas.length > 0);
  for (const r of sv.resas) { assert.equal(r.debutMin, enMin(r.heure)); assert.equal(r.finMin, r.debutMin + dureeDe('soir')); assert.ok(r.debutMin >= sv.debut && r.finMin <= sv.fin); }
  assert.equal(sv.debut, enMin(R.services.soir.debut)); assert.equal(sv.fin, enMin(R.services.soir.fin) + dureeDe('soir'));
  assert.equal(sv.couverts, couverts(sv.resas)); assert.equal(sv.tables, actives(sv.resas).length);
});

test('la charge : les couverts à table à chaque quart d\'heure, et le coup de feu', () => {
  const sv = serviceDuJour(ctx(), {}, JOUR, 'soir');
  for (const c of sv.charge) assert.equal(c.couverts, actives(sv.resas).filter((r) => r.debutMin <= c.t && c.t < r.finMin).reduce((n, r) => n + r.couverts, 0));
  assert.equal(sv.pic.couverts, Math.max(...sv.charge.map((c) => c.couverts))); assert.ok(sv.pic.couverts <= sv.couverts);
  assert.equal(sv.charge[0].t, sv.debut); assert.equal(sv.charge.at(-1).t, sv.fin - sv.pas);
  const vide = serviceDuJour(ctx(), {}, ajouter(AUJ, 60), 'soir'); assert.equal(vide.tables, 0); assert.equal(vide.pic, null); assert.ok(vide.charge.every((c) => c.couverts === 0));
});

test('arrivés, absent, annulée : les gestes selon le moment, et ce qui compte dans les couverts', () => {
  const r = serviceDuJour(ctx(), {}, JOUR, 'soir').resas.find((x) => x.statut === 'confirmee');
  assert.deepEqual(gestes({ ...r, date: AUJ }, AUJ).map((g) => g.statut), ['arrivee', 'absente'], 'le jour même');
  assert.deepEqual(gestes({ ...r, date: ajouter(AUJ, 3) }, AUJ).map((g) => g.statut), ['annulee'], 'un jour à venir');
  assert.deepEqual(gestes({ ...r, statut: 'a-confirmer' }, AUJ).map((g) => g.statut), ['confirmee', 'refusee']);
  assert.deepEqual(gestes({ ...r, statut: 'absente' }, AUJ).map((g) => g.libelle), ['Remettre la réservation']);
  assert.equal(STATUTS.absente, 'Absents');
  const avant = serviceDuJour(ctx(), {}, JOUR, 'soir'), S = appliquer({}, 'statut', { id: r.id, statut: 'absente' }), apres = serviceDuJour(ctx(), S, JOUR, 'soir');
  assert.equal(apres.absents, 1); assert.equal(apres.couverts, avant.couverts - r.couverts, 'un absent ne compte plus de couverts'); assert.equal(apres.tables, avant.tables - 1);
  assert.equal(bilanSemaine(ctx(), S, lundiDe(JOUR)).couverts, bilanSemaine(ctx(), {}, lundiDe(JOUR)).couverts - r.couverts);
});

test('modifier une réservation : heure, couverts, note ; d\'où qu\'elle vienne', () => {
  const r = serviceDuJour(ctx(), {}, JOUR, 'soir').resas[0], h = creneaux(R, 'soir').at(-1);
  let S = appliquer({}, 'modifierResa', { id: r.id, champs: { heure: h, couverts: '8', demande: ' Allergie aux fruits à coque ' } });
  const m = serviceDuJour(ctx(), S, JOUR, 'soir').resas.find((x) => x.id === r.id);
  assert.deepEqual({ heure: m.heure, couverts: m.couverts, demande: m.demande, nom: m.nom }, { heure: h, couverts: 8, demande: 'Allergie aux fruits à coque', nom: r.nom });
  assert.equal(serviceDuJour(ctx(), S, JOUR, 'soir').couverts, serviceDuJour(ctx(), {}, JOUR, 'soir').couverts - r.couverts + 8);
  const tri = serviceDuJour(ctx(), S, JOUR, 'soir').resas.map((x) => x.heure); assert.deepEqual(tri, [...tri].sort(), 'la frise reste triée par heure');
  assert.equal(appliquer({}, 'modifierResa', { id: 'x', champs: { couverts: 0 } }).resa.modifs.x.couverts, 1); assert.equal(appliquer({}, 'modifierResa', { id: 'x', champs: { couverts: 500 } }).resa.modifs.x.couverts, 60);
  /* Une demande venue du site, déplacée du soir au midi le même jour. */
  const site = [{ id: 'R-1', date: JOUR, service: 'soir', heure: R.services.soir.debut, couverts: 2, prenom: 'Claire', nom: 'Essai' }];
  if (ouvertSite(R, JOUR, 'midi')) { S = appliquer({}, 'modifierResa', { id: 'R-1', champs: { heure: R.services.midi.debut, service: 'midi' } });
    assert.ok(serviceDuJour(ctx(site), S, JOUR, 'midi').resas.some((x) => x.id === 'R-1')); assert.ok(!serviceDuJour(ctx(site), S, JOUR, 'soir').resas.some((x) => x.id === 'R-1')); }
});

test('le service montré d\'office et les heures possibles', () => {
  const deux = Array.from({ length: 10 }, (_, k) => ajouter(AUJ, k)).find((iso) => ouvertSite(R, iso, 'midi') && ouvertSite(R, iso, 'soir'));
  if (deux) { assert.equal(serviceCourant(ctx(), {}, deux, 11 * 60), 'midi'); assert.equal(serviceCourant(ctx(), {}, deux, 17 * 60), 'soir'); assert.equal(serviceCourant(ctx(), {}, deux, 23 * 60 + 59), 'soir');
    assert.deepEqual(heuresPossibles(ctx(), {}, deux).map((h) => h.heure), [...creneaux(R, 'midi'), ...creneaux(R, 'soir')]);
    assert.deepEqual(heuresPossibles(ctx(), appliquer({}, 'fermer', { date: deux, service: 'midi', actif: true }), deux).map((h) => h.service).filter((s) => s === 'midi'), []); }
  const midiSeul = Array.from({ length: 10 }, (_, k) => ajouter(AUJ, k)).find((iso) => ouvertSite(R, iso, 'midi') && !ouvertSite(R, iso, 'soir'));
  if (midiSeul) assert.equal(serviceCourant(ctx(), {}, midiSeul, 22 * 60), 'midi', 'un seul service ce jour-là');
});
