/* v7.11.0, « Un service parfaitement accompagné » : les règles pures de l'identité client, de la présence, des tables,
   des assemblages, des clients sans réservation et de la liste d'attente. Ce qui se voit à l'écran est joué dans
   `_audit/parcours-espace.mjs`. Lancer : node --test _audit/tests/*.test.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { publier } from '../../assets/js/disponibilites.js';
import { appliquer } from '../../assets/js/espace-donnees.js';
import { ajouter, resasDuJour, histoires, trouverResa } from '../../assets/js/espace-regles.js';
import { reglesAction } from '../../assets/js/espace-garde.js';
import { normaliserTelephone, cleClient, cleDemande, marques, notesParNom, momentVenue, fiche, listeClients } from '../../assets/js/espace-clients.js';
import { planDuService, placeDe, libre, possibles, assemblagesPossibles, proposer, avisPlace, assemblagesDe, cleSalle } from '../../assets/js/espace-salle.js';
import { presenceDe, prochaineAction, accueilDuService, pourUnPassage, resaDePassage, tablesDeLaResa } from '../../assets/js/espace-presence.js';
import { listeAttente, creneauxCompatibles, compatiblesPour, resaDepuisAttente, idResaAttente, echeance, messageProposition } from '../../assets/js/espace-attente.js';

const lire = (f) => JSON.parse(readFileSync(new URL(`../../donnees/${f}`, import.meta.url), 'utf8'));
const SALLE = lire('salle.json'), HORAIRES = lire('horaires.json').adresses[0], R = publier(lire('reservation.json'), HORAIRES).reservation;
const AUJ = '2026-11-20' /* un vendredi : midi et soir ouverts */, SOIR = 20 * 60;
const ctx = (plus = {}) => ({ R, auj: AUJ, minute: SOIR, maintenant: `${AUJ}T20:00:00`, site: [], demandes: [], exceptions: [], ...plus });
/* Comme le dépôt : la règle d'abord, puis l'action et ses suites. Rend { S, refus }. */
function agir(S, nom, args, c = ctx()) {
  const r = reglesAction(c, S, SALLE, nom, args); if (r.refus) return { S, refus: r.refus };
  let e = appliquer(S, nom, args); for (const s of r.suites) e = appliquer(e, s.nom, s.args);
  return { S: e, refus: '' };
}
const suite = (S, ...actions) => actions.reduce((e, [nom, args, c]) => { const r = agir(e, nom, args, c); assert.equal(r.refus, '', `${nom} : ${r.refus}`); return r.S; }, S);
const H = Object.fromEntries(histoires(R, AUJ).filter((x) => x.date === AUJ).map((x) => [x.role, x]));

test('3.1 · identité : un numéro, une seule forme ; l\'identifiant stable d\'abord ; jamais de fusion sur le seul nom', () => {
  for (const t of ['06 12 34 56 78', '+33 6 12 34 56 78', '0033612345678', '+33 (0)6 12 34 56 78', '06.12.34.56.78']) assert.equal(normaliserTelephone(t), '+33612345678', t);
  assert.equal(normaliserTelephone('+32 475 12 34 56'), '+32475123456'); assert.equal(normaliserTelephone('12'), '');
  assert.equal(cleClient({ nom: 'A', telephone: '06 12 34 56 78' }), cleClient({ nom: 'B', telephone: '+33612345678' }), 'même numéro, même client');
  assert.equal(cleClient({ id: 'r1', nom: 'Marie Durand', telephone: '06 12 34 56 78', clientId: 'cl_9' }), 'c:cl_9');
  /* Deux homonymes sans téléphone : deux fiches. */
  assert.notEqual(cleClient({ id: 'r1', nom: 'Marie Durand' }), cleClient({ id: 'r2', nom: 'Marie Durand' }));
  assert.equal(cleDemande({ id: 'Q-1', qui: 'Marie Durand' }), 's:Q-1');
  const S = { resa: { ajouts: [{ id: 'r1', date: AUJ, service: 'soir', heure: '19:30', couverts: 2, nom: 'Marie Durand', statut: 'confirmee' }, { id: 'r2', date: AUJ, service: 'soir', heure: '20:00', couverts: 3, nom: 'Marie Durand', statut: 'confirmee' }] } };
  const l = listeClients(ctx(), S).filter((c) => c.nom === 'Marie Durand');
  assert.equal(l.length, 2); assert.ok(l.every((c) => c.semblables.length === 1 && c.resas === 1), 'un rapprochement possible, à vérifier');
});

test('3.1 · les anciennes notes : le téléphone est repris, le nom seul devient une proposition à vérifier', () => {
  const ancien = { clients: { t0612345678: { habitue: true, allergies: ['arachide'], note: 'Près du feu' }, 'n-marie-durand': { allergies: ['gluten'], note: '' } } };
  const S = appliquer(ancien, 'migrerClients', {});
  assert.deepEqual(Object.keys(S.clients).sort(), ['n-marie-durand', 't:+33612345678']);
  assert.deepEqual(marques(S, { id: 'x', nom: 'Qui que ce soit', telephone: '+33 6 12 34 56 78' }).allergies, ['arachide'], 'rien n\'est perdu');
  /* Un client connu du serveur garde les notes prises sous son téléphone. */
  assert.equal(marques(S, { id: 'x', clientId: 'cl_1', nom: 'Z', telephone: '0612345678' }).habitue, true);
  /* Sur le seul nom : aucune allergie n'est appliquée. */
  const r = { id: 'r1', nom: 'Marie Durand' }; assert.deepEqual(marques(S, r).allergies, []);
  const p = notesParNom(S, cleClient(r), r.nom); assert.deepEqual(p.allergies, ['gluten']); assert.equal(p.cle, 'n-marie-durand');
  const S2 = appliquer(S, 'rattacherNotes', { de: p.cle, vers: cleClient(r) });
  assert.deepEqual(marques(S2, r).allergies, ['gluten']); assert.equal(S2.clients['n-marie-durand'], undefined);
  /* Rattacher réunit sans rien perdre. */
  const S3 = appliquer(appliquer(S, 'client', { cle: 's:r1', champs: { allergies: ['lait'], habitue: true } }), 'rattacherNotes', { de: 'n-marie-durand', vers: 's:r1' });
  assert.deepEqual(S3.clients['s:r1'].allergies.sort(), ['gluten', 'lait']); assert.equal(S3.clients['s:r1'].habitue, true);
});

test('3.3 · la prochaine venue tient compte de l\'heure : un midi confirmé resté sans nouvelle n\'est pas « prochaine venue » le soir', () => {
  const midi = { id: 'm', date: AUJ, service: 'midi', heure: '12:30', couverts: 2, nom: 'Luc Essai', telephone: '06 00 00 00 01', statut: 'confirmee' };
  assert.equal(momentVenue(midi, AUJ, 11 * 60), 'a-venir'); assert.equal(momentVenue(midi, AUJ, 12 * 60 + 45), 'a-venir', 'une demi-heure de marge');
  assert.equal(momentVenue(midi, AUJ, SOIR), 'a-clarifier'); assert.equal(momentVenue({ ...midi, statut: 'arrivee' }, AUJ, SOIR), 'en-cours');
  assert.equal(momentVenue({ ...midi, date: ajouter(AUJ, -1) }, AUJ, 0), 'a-clarifier'); assert.equal(momentVenue({ ...midi, statut: 'a-confirmer', date: ajouter(AUJ, -1) }, AUJ, 0), 'sans-suite');
  const S = { resa: { ajouts: [midi, { ...midi, id: 's', date: ajouter(AUJ, 3), service: 'soir', heure: '20:00' }] } }, f = fiche(ctx(), S, cleClient(midi));
  assert.equal(f.prochaine.id, 's', 'la prochaine venue est la suivante'); assert.deepEqual(f.aClarifier.map((r) => r.id), ['m'], 'celle de midi reste visible, à clarifier');
  assert.equal(f.aVenir, 1); assert.deepEqual(f.periode, { du: ajouter(AUJ, -7), au: ajouter(AUJ, 28) });
  const c = listeClients(ctx(), S).find((x) => x.cle === cleClient(midi)); assert.equal(c.prochaine.id, 's'); assert.equal(c.aClarifier.length, 1);
});

test('3.5 · exemples plausibles : personne ne vient deux fois le même jour ; les identifiants ne changent pas de forme', () => {
  const parNom = {};
  for (let k = -7; k <= 28; k++) { const l = resasDuJour(ctx(), {}, ajouter(AUJ, k)), noms = l.map((r) => r.nom); assert.equal(new Set(noms).size, noms.length, ajouter(AUJ, k));
    for (const r of l) { parNom[r.nom] = (parNom[r.nom] || 0) + 1; assert.match(r.id, /^demo-\d{4}-\d{2}-\d{2}-(midi|soir)-(\d+|couple|tablee|allergie)$/); assert.equal(trouverResa(ctx(), {}, r.id).id, r.id); } }
  assert.ok(Math.max(...Object.values(parNom)) <= 4, 'au plus quatre venues en cinq semaines');
  /* Un même client d'exemple garde le même téléphone : sa fiche réunit ses venues. */
  const f = fiche(ctx(), {}, cleClient(H.allergie)); assert.ok(f.resas.length >= 2); assert.ok(f.resas.every((r) => r.nom === 'Camille R.'));
});

test('9 · la présence : attendu, en retard, arrivé, installé, parti ; chaque état a sa prochaine action', () => {
  const r = H.couple; /* 19 h 30, 2 couverts */
  assert.equal(presenceDe({}, r, AUJ, 19 * 60), 'attendu'); assert.equal(presenceDe({}, r, AUJ, 19 * 60 + 40), 'attendu', 'un quart d\'heure de tolérance');
  assert.equal(presenceDe({}, r, AUJ, 19 * 60 + 50), 'retard'); assert.equal(presenceDe({}, { ...r, date: ajouter(AUJ, -1) }, AUJ, 0), 'non-traitee', 'une réservation passée sans nouvelle reste identifiable');
  assert.equal(presenceDe({}, { ...r, date: ajouter(AUJ, -1), statut: 'arrivee' }, AUJ, 0), 'parti');
  assert.equal(prochaineAction({}, r, AUJ, 19 * 60).principale.action, 'arrivee'); assert.equal(prochaineAction({}, { ...r, statut: 'a-confirmer' }, AUJ, 0).principale.action, 'accepter');
  /* Un retard annoncé repousse l'alerte. */
  let S = suite({}, ['retardAnnonce', { id: r.id, minutes: 30 }]); assert.equal(presenceDe(S, r, AUJ, 19 * 60 + 50), 'attendu'); assert.equal(presenceDe(S, r, AUJ, 20 * 60 + 20), 'retard');
  /* Arrivé n'est pas installé. */
  S = suite(S, ['statut', { id: r.id, statut: 'arrivee' }]); let v = trouverResa(ctx(), S, r.id);
  assert.equal(presenceDe(S, v, AUJ, SOIR), 'arrive'); assert.equal(prochaineAction(S, v, AUJ, SOIR).principale.action, 'choisir-table');
  assert.match(agir(S, 'installer', { id: r.id, minute: SOIR }).refus, /Choisissez d'abord une table/);
  S = suite(S, ['placerResa', { id: r.id, table: '1' }]); v = trouverResa(ctx(), S, r.id);
  assert.equal(prochaineAction(S, v, AUJ, SOIR).principale.libelle, 'Installer (table 1)');
  S = suite(S, ['installer', { id: r.id, minute: SOIR }]); assert.equal(presenceDe(S, v, AUJ, SOIR), 'installe');
  let p = planDuService(ctx(), S, SALLE, AUJ, 'soir'); assert.equal(placeDe(p, '1').etat, 'occupee'); assert.equal(placeDe(p, '1').occupant.id, r.id);
  /* Le départ rend la table… à débarrasser, pas prête. */
  assert.match(agir(S, 'depart', { id: H.tablee.id }).refus, /n'est pas installé/);
  S = suite(S, ['depart', { id: r.id, minute: SOIR + 70, cle: cleSalle(AUJ, 'soir'), tables: tablesDeLaResa(p, v) }]);
  p = planDuService(ctx(), S, SALLE, AUJ, 'soir'); assert.equal(placeDe(p, '1').etat, 'a-debarrasser'); assert.equal(presenceDe(S, v, AUJ, SOIR + 70), 'parti');
  S = suite(S, ['etatTable', { cle: cleSalle(AUJ, 'soir'), table: '1', etat: 'a-preparer' }]); assert.equal(placeDe(planDuService(ctx(), S, SALLE, AUJ, 'soir'), '1').etat, 'a-preparer');
  S = suite(S, ['etatTable', { cle: cleSalle(AUJ, 'soir'), table: '1', etat: '' }]); assert.equal(placeDe(planDuService(ctx(), S, SALLE, AUJ, 'soir'), '1').etat, 'prete');
  /* Remettre « pas encore arrivés » efface la présence avec le statut. */
  S = suite(S, ['statut', { id: r.id, statut: 'confirmee' }]); assert.equal(S.service.presence[r.id].etat, undefined);
});

test('4 · une table vide n\'est pas forcément prête ; la durée prévue ne libère pas une table', () => {
  const a = H.couple, b = H.allergie; /* 19 h 30 et 20 h 30, deux couverts chacun */
  let S = suite({}, ['statut', { id: a.id, statut: 'arrivee' }], ['placerResa', { id: a.id, table: '1' }], ['installer', { id: a.id, minute: 19 * 60 + 30 }]);
  /* 21 h 45 : le repas « devait » finir à 21 h 30, mais le groupe est toujours installé. */
  const tard = ctx({ minute: 21 * 60 + 45 }), p = planDuService(tard, S, SALLE, AUJ, 'soir'), t1 = placeDe(p, '1');
  assert.equal(t1.etat, 'occupee'); assert.equal(t1.occupant.depasse, true);
  const venu = { id: 'x', couverts: 2, debutMin: 21 * 60 + 45, finMin: 23 * 60 + 15 };
  assert.equal(libre(t1, venu), false, 'la table reste prise'); assert.match(avisPlace(p, t1, venu).raison, /occupée par Aurélie et Marc, installé depuis plus longtemps que prévu/);
  /* Un autre groupe ne peut pas y être installé tant que le premier n'est pas parti, ni tant qu'elle n'est pas remise en état. */
  S = suite(S, ['statut', { id: b.id, statut: 'arrivee' }, tard], ['placerResa', { id: b.id, table: '3' }, tard]);
  S = appliquer(S, 'placerResa', { id: b.id, table: '1' });
  assert.match(agir(S, 'installer', { id: b.id }, tard).refus, /table 1 est encore occupée par Aurélie et Marc/);
  S = suite(S, ['depart', { id: a.id, minute: 21 * 60 + 50, cle: cleSalle(AUJ, 'soir'), tables: ['1'] }, tard]);
  assert.match(agir(S, 'installer', { id: b.id }, tard).refus, /table 1 est à débarrasser : remettez-la en état/);
  S = suite(S, ['etatTable', { cle: cleSalle(AUJ, 'soir'), table: '1', etat: '' }], ['installer', { id: b.id, minute: 21 * 60 + 55 }, tard]);
  assert.equal(placeDe(planDuService(tard, S, SALLE, AUJ, 'soir'), '1').occupant.id, b.id);
  /* Un groupe parti plus tôt que prévu a rendu sa table pour la suite du service. */
  const q = planDuService(tard, S, SALLE, AUJ, 'soir'); assert.ok(q.tables.find((t) => t.id === '1').resas.find((r) => r.id === a.id).finMin <= 21 * 60 + 50);
  /* Indisponible : plus personne ne peut y être placé. */
  S = suite(S, ['etatTable', { cle: cleSalle(AUJ, 'soir'), table: '4', etat: 'indisponible' }]);
  assert.match(agir(S, 'placerResa', { id: H.tablee.id, table: '4' }).refus, /table 4 est indisponible/);
  const acc = accueilDuService(tard, S, SALLE, AUJ, 'soir'); assert.equal(acc.parPresence.installe.length, 1); assert.equal(acc.tables.indisponible.some((t) => t.id === '4'), true);
});

test('10 · les assemblages : une capacité dite, des tables qui ne servent plus séparément pendant le repas', () => {
  const ass = assemblagesDe(SALLE, AUJ); assert.deepEqual(ass.map((a) => a.id), ['2+3', '8+9', '10+11']); assert.equal(ass[0].places, 6, 'la capacité vient de la configuration, pas d\'une addition');
  assert.equal(ass[2].fermee, true, 'la terrasse est fermée en novembre');
  const w = H.tablee /* 8 couverts à 20 h */, p0 = planDuService(ctx(), {}, SALLE, AUJ, 'soir'), moi = p0.aPlacer.find((r) => r.id === w.id);
  assert.equal(proposer(p0, moi).id, '7', 'une table seule d\'abord, quand elle n\'est pas trop grande'); assert.ok(assemblagesPossibles(p0, moi).some((a) => a.id === '8+9'));
  assert.equal(proposer(p0, { ...moi, couverts: 5, id: 'cinq' }).id, '5'); assert.equal(proposer({ ...p0, tables: p0.tables.filter((t) => t.id !== '5') }, { ...moi, couverts: 5, id: 'cinq' }).id, '2+3', 'plutôt deux tables rapprochées que la grande table pour cinq');
  let S = suite({}, ['placerResa', { id: w.id, table: '8+9' }]);
  const p = planDuService(ctx(), S, SALLE, AUJ, 'soir'), t8 = placeDe(p, '8'), a89 = placeDe(p, '8+9');
  assert.equal(a89.resas[0].id, w.id); assert.equal(t8.resas[0].via, '8+9'); assert.equal(p.placees.some((r) => r.id === w.id), true); assert.equal(p.conflits.length, 0);
  /* Pendant le repas (20 h – 22 h), la table 8 seule n'est pas libre ; avant, si. */
  assert.equal(libre(t8, { id: 'x', debutMin: 20 * 60 + 30, finMin: 22 * 60 + 30 }), false); assert.equal(libre(t8, { id: 'x', debutMin: 18 * 60, finMin: 20 * 60 }), true);
  assert.match(avisPlace(p, t8, { id: 'x', couverts: 2, debutMin: 20 * 60 + 30, finMin: 22 * 60 + 30 }).raison, /rapprochée d'une autre \(tables 8 et 9\) à 20 h pour Famille Weber/);
  assert.match(agir(S, 'placerResa', { id: H.couple.id, table: '9' }).refus, /table 9 est prise/);
  /* Un assemblage dont une table est prise n'est pas possible. */
  let S2 = suite({}, ['placerResa', { id: H.couple.id, table: '2' }]); assert.match(agir(S2, 'placerResa', { id: H.allergie.id, table: '2+3' }).refus, /table 2 est prise/);
  assert.match(agir({}, 'placerResa', { id: w.id, table: '10+11' }).refus, /terrasse est fermée/); assert.match(agir({}, 'placerResa', { id: w.id, table: '4+5' }).refus, /assemblage 4\+5 n'est pas sur le plan/);
  /* Séparer : le groupe n'a plus de place, les deux tables reviennent. */
  S = suite(S, ['placerResa', { id: w.id, table: '' }]); assert.equal(placeDe(planDuService(ctx(), S, SALLE, AUJ, 'soir'), '8').resas.length, 0);
  /* Installer sur un assemblage : les deux tables sont occupées, puis à débarrasser. */
  S = suite(S, ['placerResa', { id: w.id, table: '8+9' }], ['statut', { id: w.id, statut: 'arrivee' }], ['installer', { id: w.id, minute: SOIR }]);
  let q = planDuService(ctx(), S, SALLE, AUJ, 'soir'); assert.deepEqual([placeDe(q, '8').etat, placeDe(q, '9').etat, placeDe(q, '8+9').etat], ['occupee', 'occupee', 'occupee']);
  S = suite(S, ['depart', { id: w.id, minute: SOIR + 90, cle: cleSalle(AUJ, 'soir'), tables: tablesDeLaResa(q, trouverResa(ctx(), S, w.id)) }]);
  q = planDuService(ctx(), S, SALLE, AUJ, 'soir'); assert.deepEqual([placeDe(q, '8').etat, placeDe(q, '9').etat], ['a-debarrasser', 'a-debarrasser']);
});

test('9 · des clients se présentent : ce qu\'on peut leur proposer, et un seul groupe noté même au double clic', () => {
  const c = ctx(), o = pourUnPassage(c, {}, SALLE, { couverts: 4, service: 'soir' });
  assert.ok(o.places.length > 0); assert.ok(o.places.every((p) => p.places >= 4)); assert.ok(o.places.findIndex((p) => p.assemblage) === -1 || o.places.findIndex((p) => p.assemblage) > o.places.findIndex((p) => !p.assemblage), 'les tables seules d\'abord');
  assert.ok(o.refus.some((x) => /terrasse est fermée/.test(x.raison)) && o.refus.some((x) => /places pour 4/.test(x.raison)), 'chaque table écartée dit pourquoi');
  const resa = resaDePassage({ cle: 'k1', auj: AUJ, minute: SOIR + 7, service: 'soir', couverts: 4, nom: '', demande: 'Poussette', table: o.places[0].id });
  assert.equal(resa.heure, '20:07'); assert.equal(resa.nom, 'Sans réservation'); assert.equal(resa.source, 'passage');
  let S = suite({}, ['passage', { resa, installer: true, minute: SOIR + 7 }]);
  assert.match(agir(S, 'passage', { resa, installer: true }).refus, /déjà noté/); S = appliquer(S, 'passage', { resa, installer: true });
  assert.equal(S.resa.ajouts.length, 1); const v = trouverResa(c, S, resa.id); assert.equal(presenceDe(S, v, AUJ, SOIR + 10), 'installe'); assert.equal(v.table, o.places[0].id);
  /* Attendre sur place : arrivé, sans table. */
  const att = resaDePassage({ cle: 'k2', auj: AUJ, minute: SOIR + 10, service: 'soir', couverts: 2 }); S = suite(S, ['passage', { resa: att }]);
  assert.equal(accueilDuService(ctx({ minute: SOIR + 10 }), S, SALLE, AUJ, 'soir').attenteSurPlace.some((l) => l.id === att.id), true);
  /* Une table occupée ou pas prête n'est pas proposée pour une installation immédiate. */
  S = suite(S, ['etatTable', { cle: cleSalle(AUJ, 'soir'), table: '5', etat: 'a-debarrasser' }]);
  const o2 = pourUnPassage(ctx({ minute: SOIR + 10 }), S, SALLE, { couverts: 4, service: 'soir' });
  assert.ok(!o2.places.some((p) => p.id === '5' || p.id === o.places[0].id)); assert.ok(o2.refus.some((x) => /table 5 est à débarrasser/.test(x.raison)));
});

test('6 · la liste d\'attente : ancienneté, créneaux compatibles, une place qui se libère', () => {
  const l = listeAttente(ctx(), {}); assert.deepEqual(l.map((e) => e.id), ['att-demo-1', 'att-demo-2', 'att-demo-3', 'att-demo-4'], 'la plus ancienne d\'abord');
  assert.equal(l[0].etat, 'expiree', 'une proposition faite hier a expiré'); assert.deepEqual(l.filter((e) => e.date === AUJ).map((e) => e.rang), [1, 2, 3]);
  assert.equal(listeAttente(ctx({ exemples: false }), {}).length, 0, 'aucun exemple en mode connecté');
  /* Neuf personnes ce soir : seule la grande table convient, et la famille Weber (8) y tient. Personne n'est compatible. */
  const lambert = l[1]; assert.equal(creneauxCompatibles(ctx({ minute: 18 * 60 }), {}, SALLE, lambert).length, 0);
  assert.equal(compatiblesPour(ctx({ minute: 18 * 60 }), {}, SALLE, AUJ, 'soir').some((e) => e.couverts === 9), false);
  /* La famille Weber annule : la grande table se libère, les deux tablées de neuf deviennent compatibles, la plus ancienne d'abord. */
  const S = suite({}, ['statut', { id: H.tablee.id, statut: 'annulee' }]), c = ctx({ minute: 18 * 60, maintenant: `${AUJ}T18:00:00` });
  const comp = compatiblesPour(c, S, SALLE, AUJ, 'soir').filter((e) => e.couverts === 9); assert.deepEqual(comp.map((e) => e.id), ['att-demo-2', 'att-demo-3']);
  assert.equal(comp[0].possibles[0].heure, '20:00'); assert.equal(comp[0].possibles[0].place, '7'); assert.ok(comp[0].possibles.every((x) => Math.abs(+x.heure.slice(0, 2) * 60 + +x.heure.slice(3) - 1200) <= 60), 'dans la souplesse du client');
  /* Un service marqué complet : plus rien n'est proposé. */
  assert.equal(creneauxCompatibles(c, appliquer(S, 'complet', { date: AUJ, service: 'soir', actif: true }), SALLE, lambert).length, 0);
});

test('6 · proposition, expiration, acceptation revérifiée : une seule réservation, même au double clic', () => {
  const c = ctx({ minute: 18 * 60, maintenant: `${AUJ}T18:00:00` });
  let S = suite({}, ['statut', { id: H.tablee.id, statut: 'annulee' }, c]);
  assert.match(agir({}, 'attenteProposer', { id: 'att-demo-2', heure: '20:00' }, c).refus, /20 h n'est plus possible pour 9 personnes/);
  const expire = echeance(listeAttente(c, S)[1], '20:00', c.maintenant); assert.equal(expire, `${AUJ}T19:00:00`, 'au plus tard une heure avant l\'arrivée');
  S = suite(S, ['attenteProposer', { id: 'att-demo-2', heure: '20:00', service: 'soir', faite: c.maintenant, expire }, c]);
  let e = listeAttente(c, S).find((x) => x.id === 'att-demo-2'); assert.equal(e.etat, 'proposee'); assert.match(messageProposition(e), /une table pour 9 personnes s'est libérée.*à 20 h\. Pour la prendre, répondez avant le vendredi 20 novembre à 19 h/);
  assert.match(agir(S, 'attenteProposer', { id: 'att-demo-2', heure: '20:00' }, c).refus, /déjà en cours/);
  /* La proposition n'a rien bloqué : la seconde tablée peut encore recevoir la sienne (règle de revérification). */
  assert.equal(agir(S, 'attenteProposer', { id: 'att-demo-3', heure: '20:00', service: 'soir', faite: c.maintenant, expire }, c).refus, '');
  /* Passé le délai : expirée, l'acceptation est refusée et le dit. */
  const tard = ctx({ minute: 19 * 60 + 5, maintenant: `${AUJ}T19:05:00` });
  assert.equal(listeAttente(tard, S).find((x) => x.id === 'att-demo-2').etat, 'expiree'); assert.match(agir(S, 'attenteAccepter', { id: 'att-demo-2' }, tard).refus, /a expiré \(vendredi 20 novembre à 19 h\)/);
  /* Dans le délai : acceptée, une réservation confirmée est créée. */
  e = listeAttente(c, S).find((x) => x.id === 'att-demo-2'); const resa = resaDepuisAttente(e); assert.equal(resa.id, idResaAttente('att-demo-2'));
  S = suite(S, ['attenteAccepter', { id: 'att-demo-2', resa }, c]);
  assert.match(agir(S, 'attenteAccepter', { id: 'att-demo-2', resa }, c).refus, /Déjà acceptée.*pas été créée une seconde fois/); S = appliquer(S, 'attenteAccepter', { id: 'att-demo-2', resa });
  assert.equal(S.resa.ajouts.filter((r) => r.id === resa.id).length, 1); const v = trouverResa(c, S, resa.id); assert.equal(v.statut, 'confirmee'); assert.equal(v.couverts, 9); assert.equal(v.heure, '20:00');
  assert.equal(listeAttente(c, S).find((x) => x.id === 'att-demo-2').etat, 'acceptee'); assert.equal(resasDuJour(c, S, AUJ).some((r) => r.id === resa.id), true, 'elle est dans l\'agenda et le service');
  /* La place est prise : la seconde proposition, encore dans son délai, ne peut plus être acceptée ; la demande revient en attente. */
  let S3 = appliquer(S, 'attenteProposer', { id: 'att-demo-3', heure: '20:00', service: 'soir', faite: c.maintenant, expire });
  assert.match(agir(S3, 'attenteAccepter', { id: 'att-demo-3' }, c).refus, /a été prise entre-temps.*reste dans la liste d'attente/);
  S3 = suite(S3, ['attenteReponse', { id: 'att-demo-3', reponse: 'en-attente', motif: 'place-prise' }, c]); assert.equal(listeAttente(c, S3).find((x) => x.id === 'att-demo-3').etat, 'en-attente');
  /* Refus du client, retrait. */
  S3 = suite(S3, ['attenteReponse', { id: 'att-demo-1', reponse: 'retiree' }, c]); assert.equal(listeAttente(c, S3).find((x) => x.id === 'att-demo-1').etat, 'retiree');
  /* Une inscription notée par l'équipe : contrôlée. */
  assert.match(agir({}, 'attenteAjouter', { entree: { id: 'a1', nom: 'Essai', couverts: 2, date: AUJ } }, c).refus, /téléphone ou une adresse/);
  const S4 = suite({}, ['attenteAjouter', { entree: { id: 'a1', cree: c.maintenant, nom: 'Essai', telephone: '06 00 00 00 02', couverts: 2, date: AUJ, periode: 'soir', heure: '20:00', souplesse: 30, espaces: [] } }, c]);
  assert.equal(listeAttente(c, S4).at(-1).id, 'a1'); assert.ok(creneauxCompatibles(c, S4, SALLE, listeAttente(c, S4).at(-1)).length > 0);
});

test('11 · le repli de terrasse : un aperçu d\'abord, des places en salle, les sans-solution et les décisions dites', async () => {
  const { repliTerrasse, soirDEte, exempleEte } = await import('../../assets/js/espace-repli.js');
  const c0 = ctx({ exemples: false }), ete = soirDEte(c0); assert.match(ete, /^2027-06-\d\d$/); assert.equal(new Date(`${ete}T12:00:00Z`).getUTCDay(), 6, 'un samedi de juin');
  /* Hors saison : la terrasse est fermée, rien à replier. */
  assert.equal(repliTerrasse(ctx(), {}, SALLE, AUJ, 'soir').ouvert, false); assert.equal(repliTerrasse(ctx(), {}, SALLE, AUJ, 'soir').concernees.length, 0);
  const c = { ...c0, minute: 0 }, S0 = appliquer({}, 'exempleEte', { resas: exempleEte(c, ete) });
  assert.equal(appliquer(S0, 'exempleEte', { resas: exempleEte(c, ete) }).resa.ajouts.length, 8, 'chargé une seule fois');
  const avant = JSON.stringify(S0), a = repliTerrasse(c, S0, SALLE, ete, 'soir');
  assert.equal(JSON.stringify(S0), avant, 'l\'aperçu ne change rien'); assert.equal(a.ouvert, true); assert.deepEqual(a.tables, ['10', '11', '12']);
  assert.deepEqual(a.concernees.map((r) => r.nom), ['Lucie B.', 'Tablée Marchand', 'Inès et Paul', 'Georges V.'], 'placées dehors, ou qui avaient demandé la terrasse');
  const vers = Object.fromEntries(a.propositions.map((p) => [p.resa.nom, p.vers]));
  assert.equal(vers['Lucie B.'], '5'); assert.equal(vers['Georges V.'], '2+3', 'cinq couverts : deux tables rapprochées'); assert.ok(['3', '6'].includes(vers['Inès et Paul']));
  assert.deepEqual(a.sansSolution.map((x) => x.resa.nom), ['Tablée Marchand']); assert.match(a.sansSolution[0].raison, /Aucune table en salle n'est libre à 20 h pour 8 couverts, même en rapprochant deux tables/);
  assert.ok(a.decisions.some((d) => /Tablée Marchand \(8 couverts\) : proposer un autre horaire/.test(d)));
  /* Personne n'est posé deux fois au même endroit. */
  let S = S0; for (const p of a.propositions) { const r = agir(S, 'placerResa', { id: p.resa.id, table: p.vers }, c); assert.equal(r.refus, '', p.resa.nom); S = r.S; }
  const apres = planDuService(c, S, SALLE, ete, 'soir'); assert.equal(apres.conflits.length, 0); assert.equal(repliTerrasse(c, S, SALLE, ete, 'soir').concernees.map((r) => r.nom).join(), 'Tablée Marchand');
  /* Ajuster : garder une réservation dehors, imposer une table ; un choix impossible est refusé avec sa raison. */
  const b = repliTerrasse(c, S0, SALLE, ete, 'soir', { [a.concernees[0].id]: 'garder', [a.concernees[2].id]: '6' });
  assert.equal(b.gardees[0].nom, 'Lucie B.'); assert.equal(b.propositions.find((p) => p.resa.nom === 'Inès et Paul').vers, '6'); assert.ok(b.propositions.find((p) => p.resa.nom === 'Inès et Paul').options.length > 1);
  const d = repliTerrasse(c, S0, SALLE, ete, 'soir', { [a.concernees[2].id]: '7' }); assert.match(d.sansSolution.find((x) => x.resa.nom === 'Inès et Paul').raison, /« table 7 » n'est pas possible : La table 7 est réservée à 20 h pour Famille Colin/);
  /* La salle a changé entre l'aperçu et l'application : le déplacement concerné est refusé, les autres passent. */
  const pris = suite(S0, ['ajouterResa', { resa: { id: 'tel-x', date: ete, service: 'soir', heure: '19:30', couverts: 6, nom: 'Entre-temps', statut: 'confirmee' } }, c], ['placerResa', { id: 'tel-x', table: '5' }, c]);
  assert.match(agir(pris, 'placerResa', { id: a.propositions.find((p) => p.vers === '5').resa.id, table: '5' }, c).refus, /table 5 est prise à cette heure-là \(Entre-temps/);
  /* Un groupe déjà installé dehors n'est jamais déplacé d'office. */
  const jour = { ...c, auj: ete, minute: 20 * 60 }, l = exempleEte(c, ete)[0];
  const S5 = suite(S0, ['statut', { id: l.id, statut: 'arrivee' }, jour], ['installer', { id: l.id, minute: 19 * 60 + 35 }, jour]), e5 = repliTerrasse(jour, S5, SALLE, ete, 'soir');
  assert.deepEqual(e5.installes.map((r) => r.nom), ['Lucie B.']); assert.ok(!e5.propositions.some((p) => p.resa.nom === 'Lucie B.')); assert.ok(e5.decisions.some((x) => /Lucie B\. est déjà installé en terrasse/.test(x)));
});

test('5 · côté client : des alternatives qui disent ce qui change (autre heure, autre service, autre jour, autre espace)', async () => {
  const { alternatives, arrivees, etatService } = await import('../../assets/js/disponibilites.js');
  /* Vendredi soir complet ; 20 h 30 pris le samedi. */
  const complets = { [`${AUJ}|soir`]: true }, pris = { [`${ajouter(AUJ, 1)}|20:30`]: true };
  const creneaux = (iso, sid) => (etatService(R, iso, sid).ouvert ? arrivees(R, iso, sid).map((t) => ({ t, etat: complets[`${iso}|${sid}`] || pris[`${iso}|${t}`] ? 'complet' : 'libre' })) : []);
  const jour = (iso) => `le ${iso.slice(8)}`;
  const a = alternatives(R, { date: AUJ, service: 'soir', heure: '20:30', espace: 'salle' }, { auj: AUJ, creneaux, jour });
  assert.deepEqual(a.map((x) => x.type), ['service', 'date', 'date'], 'pas d\'autre heure le même soir : il est complet');
  assert.equal(a[0].service, 'midi'); assert.match(a[0].change, /le service \(midi au lieu de soir\)/);
  assert.equal(a[1].date, ajouter(AUJ, 1)); assert.notEqual(a[1].heure, '20:30', '20 h 30 est pris le samedi : l\'heure la plus proche'); assert.match(a[1].change, /le jour et l'heure/);
  assert.ok(a.every((x) => x.date >= AUJ), 'jamais une date passée');
  /* Une heure prise dans un service encore ouvert : les heures voisines d'abord. */
  const b = alternatives(R, { date: ajouter(AUJ, 1), service: 'soir', heure: '20:30' }, { auj: AUJ, creneaux, jour });
  assert.deepEqual(b.slice(0, 2).map((x) => [x.type, x.heure]), [['heure', '20:15'], ['heure', '20:45']]); assert.match(b[0].change, /l'heure d'arrivée \(20\sh\s15 au lieu de 20\sh\s30\)/);
  /* La terrasse en novembre : la salle, sans rien changer d'autre. */
  const c = alternatives(R, { date: ajouter(AUJ, 1), service: 'soir', heure: '20:00', espace: 'terrasse' }, { auj: AUJ, creneaux, jour }).find((x) => x.type === 'espace');
  assert.equal(c.espace, 'salle'); assert.equal(c.heure, '20:00'); assert.match(c.change, /l'installation \(en salle/);
});

test('7 et 8 · « Votre venue » : l\'état vu par le client, ce qu\'il peut faire, et les rappels', async () => {
  const { codeVenue, lienVenue, etatVenue, actionsVenue, refusModifVenue, heuresVenue, rappelDe, messageRappel, venuesATraiter, delaiRappel } = await import('../../assets/js/espace-venue.js');
  const r = { ...H.allergie }, demain = { ...r, id: 'x1', date: ajouter(AUJ, 1) };
  assert.equal(codeVenue(r.id, '06 12 34 56 78'), codeVenue(r.id, '+33 6 12 34 56 78'), 'le même code quelle que soit l\'écriture du numéro'); assert.notEqual(codeVenue(r.id, r.telephone), codeVenue('autre', r.telephone));
  assert.match(lienVenue(r), /^\/votre-venue\?r=demo-2026-11-20-soir-allergie&c=[a-z0-9]{6}$/);
  const e = (rr, v = {}, min = 15 * 60) => etatVenue(rr, v, AUJ, min).etat;
  assert.equal(e({ ...r, statut: 'a-confirmer' }), 'demande-recue'); assert.equal(e(r), 'confirmee'); assert.equal(e(r, { modif: { heure: '21:00', couverts: 4 } }), 'modification-demandee');
  assert.match(etatVenue(r, { modif: { heure: '21:00', couverts: 4 } }, AUJ, 900).phrase, /votre réservation initiale est gardée : 20\sh\s30, 2 personnes/);
  assert.equal(e(r, { reponse: { acceptee: true, le: 'x' } }), 'modifiee'); assert.equal(e(r, { annulee: 'x' }), 'annulee'); assert.equal(e({ ...r, statut: 'annulee' }), 'annulee'); assert.equal(e({ ...r, date: ajouter(AUJ, -1) }), 'passee');
  assert.deepEqual(actionsVenue(r, {}, AUJ, 900), ['reconfirmer', 'modifier', 'completer', 'annuler']); assert.deepEqual(actionsVenue(r, { reconfirmee: 'x', modif: {} }, AUJ, 900), ['completer', 'annuler']);
  assert.deepEqual(actionsVenue({ ...r, statut: 'a-confirmer' }, {}, AUJ, 900), ['modifier', 'completer', 'annuler']); assert.deepEqual(actionsVenue(r, { annulee: 'x' }, AUJ, 900), []);
  /* Une demande de changement : contrôlée par les mêmes règles que la réservation en ligne. */
  const o = { auj: AUJ, minute: 15 * 60 };
  assert.equal(refusModifVenue(R, demain, { heure: '21:00', service: 'soir', couverts: 4 }, o), ''); assert.match(refusModifVenue(R, demain, { heure: demain.heure, service: 'soir', couverts: 2 }, o), /Rien ne change/);
  assert.match(refusModifVenue(R, demain, { heure: '21:00', service: 'soir', couverts: 14 }, o), /Au-delà de 10 personnes, appelez/); assert.match(refusModifVenue(R, demain, { heure: '23:30', service: 'soir', couverts: 2 }, o), /Votre réservation actuelle est gardée/);
  assert.ok(heuresVenue(R, demain, o).some((h) => h.heure === '21:00' && h.service === 'soir'));
  /* Les rappels : réglage, état, message avec le lien ; sans réponse, rien n'est annulé. */
  assert.equal(delaiRappel({}), 24); const S = appliquer({}, 'rappelReglage', { delai: 48 }); assert.equal(delaiRappel(S), 48);
  const dans3 = { ...r, id: 'x3', date: ajouter(AUJ, 3) };
  assert.deepEqual([rappelDe(S, dans3, {}, AUJ).etat, rappelDe(S, dans3, {}, AUJ).du], ['prepare', ajouter(AUJ, 1)]); assert.equal(rappelDe(S, demain, {}, AUJ).etat, 'du'); assert.match(rappelDe(S, demain, {}, AUJ).libelle, /pas encore de réponse/);
  assert.equal(rappelDe(S, demain, { reconfirmee: 'x' }, AUJ).libelle, 'Venue reconfirmée par le client'); assert.equal(rappelDe(appliquer({}, 'rappelReglage', { delai: 0 }), demain, {}, AUJ).etat, 'aucun');
  assert.match(messageRappel(demain, { lien: 'https://exemple.test/votre-venue?r=x1&c=abc123', telephone: '06 00 00 00 00', jour: 'samedi 21 novembre' }), /^Bonjour Camille, nous vous attendons aux Jardins de l'Hacienda samedi 21 novembre à 20\sh\s30, pour 2 personnes\. Pouvez-vous nous confirmer votre venue \? Confirmer, modifier ou annuler : https:/);
  /* Ce que l'espace doit prendre en compte, une seule fois. */
  const venues = { [r.id]: { annulee: 't1', complement: { texte: 'Une poussette', cree: 't2' } }, [H.couple.id]: { modif: { heure: '20:00', service: 'soir', couverts: 3, cree: 't3' } }, inconnue: { annulee: 't' } };
  const t = venuesATraiter({}, venues, (id) => trouverResa(ctx(), {}, id));
  assert.deepEqual([t.annulations.length, t.complements.length, t.modifs.length], [1, 1, 1]); assert.equal(t.modifs[0].resa.id, H.couple.id);
  const S2 = suite({}, ['statut', { id: r.id, statut: 'annulee' }], ['venueVue', { id: r.id, quoi: 'annulee', cree: 't1' }], ['venueVue', { id: r.id, quoi: 'complement', cree: 't2' }]);
  const t2 = venuesATraiter(S2, venues, (id) => trouverResa(ctx(), S2, id)); assert.deepEqual([t2.annulations.length, t2.complements.length], [0, 0], 'pas appliqué deux fois');
});
