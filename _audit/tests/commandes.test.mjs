/* Tests de la barre « Que voulez-vous faire ? » : la phrase comprise et l'action proposée (fonctions pures).
   Lancer : node --test _audit/tests/*.test.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { comprendre, lireDate, lirePeriode, lireService, lireHeure, simplifier, EXEMPLES } from '../../assets/js/espace-commandes.js';
import { appliquer, MUTATIONS } from '../../assets/js/espace-donnees.js';
import { resasDuJour, ajouter, ouvert, complet } from '../../assets/js/espace-regles.js';

const lireJson = (f) => JSON.parse(readFileSync(new URL(`../../donnees/${f}`, import.meta.url), 'utf8'));
const R = lireJson('reservation.json'), AGENDA = lireJson('agenda.json').dates;
const AUJ = '2026-11-18'; /* un mercredi */
const ctx = (S = {}, plus = {}) => ({ auj: AUJ, R, S, exceptions: [], pages: { reserver: '/reserver' }, ...plus });
const un = (t, S, plus) => comprendre(t, ctx(S, plus))[0];
const d = (t) => lireDate(simplifier(t), AUJ);

test('les dates dites en français', () => {
  assert.equal(d('demain'), '2026-11-19'); assert.equal(d('après-demain'), '2026-11-20'); assert.equal(d('ce soir'), AUJ); assert.equal(d('aujourd\'hui'), AUJ);
  assert.equal(d('samedi'), '2026-11-21'); assert.equal(d('mercredi'), AUJ, 'le jour même'); assert.equal(d('mercredi prochain'), '2026-11-25'); assert.equal(d('mardi'), '2026-11-24');
  assert.equal(d('le 12'), '2026-12-12', 'le 12 est passé ce mois-ci : le mois prochain'); assert.equal(d('le 30'), '2026-11-30'); assert.equal(d('le 1er'), '2026-12-01'); assert.equal(d('le 31'), '2026-12-31', 'novembre n\'a pas de 31');
  assert.equal(d('24 décembre'), '2026-12-24'); assert.equal(d('le 4 janvier'), '2027-01-04', 'janvier est l\'an prochain'); assert.equal(d('1er mai 2027'), '2027-05-01');
  assert.equal(d('12/12'), '2026-12-12'); assert.equal(d('03/01'), '2027-01-03'); assert.equal(d('31/02'), null);
  assert.equal(d('table pour 4 à 20 h'), null, 'une heure ou un nombre de couverts n\'est pas une date'); assert.equal(d('rien'), null);
  assert.deepEqual(lirePeriode(simplifier('du 4 au 18 janvier'), AUJ), { du: '2027-01-04', au: '2027-01-18' });
  assert.deepEqual(lirePeriode(simplifier('du 28 décembre au 3 janvier'), AUJ), { du: '2026-12-28', au: '2027-01-03' }, 'à cheval sur deux années');
  assert.deepEqual(lirePeriode(simplifier('du 24 au 26'), AUJ), { du: '2026-11-24', au: '2026-11-26' });
  assert.equal(lireService(simplifier('samedi au dîner')), 'soir'); assert.equal(lireService('demain midi'), 'midi'); assert.equal(lireService('samedi'), null);
  assert.equal(lireHeure('20 h 30'), '20:30'); assert.equal(lireHeure('a 12h'), '12:00'); assert.equal(lireHeure('12:15'), '12:15'); assert.equal(lireHeure('pour 4'), null);
});

test('« fermer samedi soir » ferme le service, et se rouvre', () => {
  const p = un('fermer samedi soir');
  assert.equal(p.titre, 'Fermer samedi 21 novembre au soir'); assert.deepEqual(p.action, { nom: 'fermer', args: { date: '2026-11-21', services: ['soir'], actif: true }, msg: p.action.msg, lien: '/reserver' });
  assert.deepEqual(p.aller, { vue: 'resas', jour: '2026-11-21' });
  const S = appliquer({}, p.action.nom, p.action.args);
  assert.equal(ouvert({ R, exceptions: [] }, S, '2026-11-21', 'soir'), false);
  assert.equal(un('fermer samedi soir', S).inactif, true, 'déjà fermé : rien à faire');
  const r = un('rouvrir samedi soir', S); assert.equal(r.titre, 'Rouvrir samedi 21 novembre au soir');
  assert.equal(ouvert({ R, exceptions: [] }, appliquer(S, r.action.nom, r.action.args), '2026-11-21', 'soir'), true);
  assert.match(un('rouvrir samedi soir').titre, /^Rien à rouvrir/);
});

test('« fermer vendredi » ferme les deux services ouverts, en une seule action', () => {
  const p = un('Fermer vendredi'); assert.deepEqual(p.action.args.services, ['midi', 'soir']); assert.equal(p.titre, 'Fermer vendredi 20 novembre');
  const S = appliquer({}, p.action.nom, p.action.args); assert.deepEqual(S.resa.fermes['2026-11-20'], ['midi', 'soir']);
});

test('« complet demain midi », puis « plus complet demain midi »', () => {
  const p = un('complet demain midi'); assert.equal(p.titre, 'Dire complet jeudi 19 novembre à midi');
  const S = appliquer({}, p.action.nom, p.action.args); assert.equal(complet(S, '2026-11-19', 'midi'), true);
  const q = un('plus complet demain midi', S); assert.equal(q.action.args.actif, false); assert.equal(complet(appliquer(S, q.action.nom, q.action.args), '2026-11-19', 'midi'), false);
  assert.equal(un('complet ce soir').inactif, true, 'pas de service le mercredi soir');
});

test('« ajouter une soirée raclette le 12 » crée le billet', () => {
  const p = un('ajouter une soirée raclette le 12');
  assert.equal(p.titre, 'Créer « Soirée raclette », samedi 12 décembre au soir'); assert.equal(p.action.nom, 'evenement');
  assert.deepEqual({ ...p.action.args.champs }, { titre: 'Soirée raclette', type: 'Soirée', debut: '2026-12-12', service: 'soir', prix: '', image: 'vraie/salle-pierre', cadrage: '50% 50%' });
  assert.deepEqual(p.aller, { vue: 'evenements', editer: p.action.args.id });
  const S = appliquer({}, 'evenement', { ...p.action.args, agenda: AGENDA }); assert.equal(S.evenements.ajouts[0].titre, 'Soirée raclette');
  assert.equal(un('Brunch de Noël dimanche 20 décembre').action.args.champs.type, 'Brunch'); assert.equal(un('brunch de noël dimanche 20 décembre').action.args.champs.service, 'midi');
  assert.equal(un('créer un concert jazz samedi').action.args.champs.titre, 'Concert jazz');
  assert.equal(un('Soirée couscous vendredi 4 décembre').action.args.champs.titre, 'Soirée couscous');
});

test('l\'annonce : sa phrase peut contenir « complet » ou une date', () => {
  const p = un('annonce : complet ce soir, merci !');
  assert.equal(p.action.nom, 'annonce'); assert.deepEqual(p.action.args, { active: true, texte: 'Complet ce soir, merci !' });
  assert.equal(un('retirer l\'annonce').inactif, true); assert.equal(un('retirer l\'annonce', { annonce: { active: true, texte: 'x' } }).action.args.active, false);
});

test('une fermeture exceptionnelle', () => {
  const p = un('congés du 4 au 18 janvier');
  assert.equal(p.titre, 'Fermer du 4 janvier au 18 janvier 2027'); assert.deepEqual(p.action.args, { du: '2027-01-04', au: '2027-01-18', motif: 'Congés annuels' });
  assert.equal(un('fermé du 24 au 26 décembre').action.args.motif, 'Fermeture exceptionnelle');
});

test('une réservation prise au téléphone', () => {
  const p = un('table pour 4 vendredi 20 h au nom de Martin');
  assert.equal(p.titre, 'Noter Martin, 4 couverts, vendredi 20 novembre à 20 h'); const r = p.action.args.resa;
  assert.deepEqual({ date: r.date, service: r.service, heure: r.heure, couverts: r.couverts, nom: r.nom, statut: r.statut, source: r.source }, { date: '2026-11-20', service: 'soir', heure: '20:00', couverts: 4, nom: 'Martin', statut: 'confirmee', source: 'telephone' });
  const S = appliquer({}, 'ajouterResa', { resa: { ...r, id: 'tel-x' } });
  assert.ok(resasDuJour({ R, auj: AUJ, site: [] }, S, '2026-11-20').some((x) => x.id === 'tel-x'));
  assert.equal(un('réserver Dupont 2 personnes dimanche midi').action.args.resa.nom, 'Dupont', 'le nom juste après le verbe');
  assert.equal(un('Table pour Famille Weber samedi 20h').action.args.resa.nom, 'Famille Weber');
  assert.equal(comprendre('ajouter une soirée raclette le 12', ctx()).length, 1, 'une action comprise : pas de proposition en plus');
  assert.equal(un('résa 6 personnes demain 12h30').action.args.resa.couverts, 6); assert.equal(un('résa 6 personnes demain 12h30').action.args.resa.heure, '12:30');
  assert.match(un('réserver pour 2 samedi 23 h').detail, /créneau le plus proche de 23 h/, 'une heure hors service prend le créneau le plus proche');
  assert.equal(un('table pour 2 ce soir').inactif, true, 'pas de service le mercredi soir');
});

test('ouvrir une rubrique, retrouver un client, ne rien inventer', () => {
  assert.deepEqual(un('horaires').aller, { vue: 'textes', ancre: 't-horaires' }); assert.equal(un('ardoise').aller.ancre, 't-ardoise'); assert.equal(un('photos').aller.vue, 'photos');
  assert.deepEqual(un('samedi').aller, { vue: 'resas', jour: '2026-11-21' });
  const resas = Array.from({ length: 12 }, (_, k) => resasDuJour({ R, auj: AUJ, site: [] }, {}, ajouter(AUJ, k))).flat();
  const nom = resas[0].nom.split(/[ .]/)[0]; const c = comprendre(nom.toLowerCase(), ctx({}, { resas })).filter((p) => p.genre === 'client');
  assert.ok(c.length >= 1); assert.ok(c.every((p) => p.aller.vue === 'resas' && p.aller.resa)); assert.ok(c.length <= 4);
  assert.deepEqual(comprendre('', ctx()), []); assert.deepEqual(comprendre('a', ctx()), []); assert.deepEqual(comprendre('xyzzy quux', ctx()), []);
});

test('chaque exemple proposé est compris et lance une action connue', () => {
  for (const ex of EXEMPLES) { const p = un(ex); assert.ok(p?.action, `« ${ex} » n'est pas compris`); assert.ok(MUTATIONS[p.action.nom], p.action.nom); assert.doesNotThrow(() => appliquer({}, p.action.nom, { ...p.action.args, agenda: AGENDA })); }
});
