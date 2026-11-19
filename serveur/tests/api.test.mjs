/* Les garanties du fonctionnement partagé (v7.9.0), prouvées sur un vrai PostgreSQL : persistance, sessions
   indépendantes, droits, validations communes, doublons, concurrence, conflits, erreurs, sauvegarde et restauration.
   Lancer : npm test (dans serveur/). */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { demarrerPostgres, arreterPostgres, baseNeuve, demande, VENDREDI, SAMEDI, MERCREDI, LUNDI, AUJ } from './outillage.mjs';
import { ouvrir } from '../src/db.mjs';
import { sauvegarder, restaurer } from '../src/sauvegarde.mjs';
import { normaliserTelephone } from '../src/metier.mjs';

before(demarrerPostgres); after(arreterPostgres);
const equipe = async (b, role) => { const s = b.session(); const r = await s.connecter(role); assert.equal(r.statut, 200, `connexion ${role}`); return s; };
const uneTable = (b, id = '5') => b.db.q('update tables_salle set active = (id = $1)', [id]); /* une salle d'une seule table : la dernière capacité */
const affectations = async (b) => (await b.db.q('select reservation_id, table_id, genre from affectations order by table_id')).rows;

test('le parcours partagé : demande publique, validation serveur, autre session, traitement, résultat partagé, persistance', async () => {
  const b = await baseNeuve(), visiteur = b.session();
  assert.equal((await b.db.q('select count(*)::int n from reservations')).rows[0].n, 0, 'aucun exemple de la démonstration n\'est importé');
  assert.equal((await b.db.q('select count(*)::int n from clients')).rows[0].n, 0);
  const envoi = await visiteur.appel('POST', '/api/public/demandes', { corps: demande({ table: '4', espace: 'salle', message: 'Anniversaire' }), cle: 'visiteur-0001' });
  assert.equal(envoi.statut, 201); assert.match(envoi.corps.reference, /^R-\d{6}-[A-Z2-9]{5}$/); assert.equal(envoi.corps.statut, 'demande', 'une demande, pas une réservation confirmée');
  assert.deepEqual(Object.keys(envoi.corps).sort(), ['deja', 'reference', 'statut'], 'le public ne reçoit rien d\'autre');
  /* Une autre session (un autre appareil) : l'équipe la voit. */
  const accueil = await equipe(b, 'accueil'), liste = (await accueil.appel('GET', `/api/reservations?du=${VENDREDI}&au=${VENDREDI}`)).corps.reservations;
  assert.equal(liste.length, 1); const r = liste[0];
  assert.equal(r.statut, 'demande'); assert.equal(r.table, '', 'une demande ne retient aucune table'); assert.equal(r.tableSouhaitee, '4', 'la table demandée reste un souhait'); assert.equal(r.origine, 'site');
  const conf = await accueil.appel('POST', `/api/reservations/${r.id}/statut`, { corps: { statut: 'confirmee', version: r.version } });
  assert.equal(conf.statut, 200); assert.equal(conf.corps.reservation.statut, 'confirmee'); assert.ok(conf.corps.reservation.table, 'confirmée : une table est retenue'); assert.equal(conf.corps.reservation.placement, 'technique', 'retenue par le serveur, « à placer »');
  /* Une troisième session (la direction, ailleurs) voit le résultat ; le suivi le signale. */
  const direction = await equipe(b, 'direction'), vue = (await direction.appel('GET', `/api/reservations?du=${VENDREDI}&au=${VENDREDI}`)).corps.reservations[0];
  assert.equal(vue.statut, 'confirmee'); assert.equal(vue.version, r.version + 1);
  const suivi = (await direction.appel('GET', '/api/suivi?depuis=0')).corps; assert.ok(suivi.reservations.some((x) => x.id === r.id)); assert.ok(suivi.numero > 0);
  assert.equal((await direction.appel('GET', `/api/suivi?depuis=${suivi.numero}`)).corps.reservations.length, 0, 'rien de neuf depuis');
  const place = await direction.appel('PUT', `/api/reservations/${r.id}/table`, { corps: { table: '7', version: vue.version } });
  assert.equal(place.corps.reservation.table, '7'); assert.equal(place.corps.reservation.placement, 'placement');
  for (const [statut, v] of [['arrivee', 0], ['confirmee', 1], ['annulee', 2]]) assert.equal((await direction.appel('POST', `/api/reservations/${r.id}/statut`, { corps: { statut, version: place.corps.reservation.version + v } })).statut, 200, statut);
  assert.deepEqual(await affectations(b), [], 'annulée : la table est libérée');
  /* Après reconnexion à la base (un redémarrage du serveur), tout est encore là. */
  await b.fermer(); const db2 = ouvrir(b.url), relu = (await db2.q('select statut, version from reservations')).rows[0];
  assert.deepEqual(relu, { statut: 'annulee', version: r.version + 5 }); assert.ok((await db2.q('select count(*)::int n from journal')).rows[0].n >= 6); await db2.fermer();
});

test('droits : contrôlés par le serveur, même par un appel direct', async () => {
  const b = await baseNeuve(), anonyme = b.session(), edition = await equipe(b, 'edition'), accueil = await equipe(b, 'accueil'), direction = await equipe(b, 'direction');
  await anonyme.appel('POST', '/api/public/demandes', { corps: demande(), cle: 'droits-00001' });
  const r = (await accueil.appel('GET', `/api/reservations?du=${VENDREDI}&au=${VENDREDI}`)).corps.reservations[0];
  for (const [m, chemin, corps] of [['GET', `/api/reservations?du=${VENDREDI}&au=${VENDREDI}`], ['GET', `/api/clients/${r.clientId}`], ['GET', '/api/journal'], ['GET', '/api/suivi'], ['GET', '/api/reglages'],
    ['POST', '/api/reservations', demande()], ['POST', `/api/reservations/${r.id}/statut`, { statut: 'confirmee', version: r.version }], ['PATCH', `/api/reservations/${r.id}`, { version: r.version, champs: { couverts: 4 } }], ['PUT', `/api/reservations/${r.id}/table`, { table: '5', version: r.version }]]) {
    const rep = await anonyme.appel(m, chemin, { corps }); assert.equal(rep.statut, 401, `sans session : ${m} ${chemin}`); assert.equal(rep.corps.erreur.code, 'NON_CONNECTE');
  }
  /* Le compte « édition » n'a aucun accès aux réservations ni aux clients. */
  for (const [m, chemin, corps] of [['GET', `/api/reservations?du=${VENDREDI}&au=${VENDREDI}`], ['GET', `/api/clients/${r.clientId}`], ['POST', '/api/reservations', demande()], ['POST', `/api/reservations/${r.id}/statut`, { statut: 'confirmee', version: r.version }]])
    assert.equal((await edition.appel(m, chemin, { corps })).corps.erreur.code, 'INTERDIT', `édition : ${m} ${chemin}`);
  /* L'accueil gère le jour, pas la semaine ni le journal. */
  const reg = (await accueil.appel('GET', '/api/reglages')).corps;
  assert.equal((await accueil.appel('POST', '/api/reglages/equipe', { corps: { version: reg.version, operation: 'semaine', args: { semaine: { lundi: [] } } } })).statut, 403);
  assert.equal((await accueil.appel('GET', '/api/journal')).statut, 403);
  assert.equal((await accueil.appel('POST', '/api/reglages/equipe', { corps: { version: reg.version, operation: 'complet', args: { date: VENDREDI, service: 'soir', actif: true } } })).statut, 200);
  assert.equal((await direction.appel('GET', '/api/journal')).statut, 200);
  /* Rien dans la réponse publique ne laisse lire un dossier ; un rôle envoyé par le navigateur est ignoré. */
  assert.equal((await anonyme.appel('GET', `/api/public/disponibilites?date=${VENDREDI}&couverts=2`)).corps.services.find((s) => s.id === 'soir').complet, true);
  assert.equal((await anonyme.appel('GET', `/api/reservations?du=${VENDREDI}&au=${VENDREDI}`, { entetes: { 'x-role': 'direction' } })).statut, 401);
  /* Écritures : du JSON, depuis notre site. */
  assert.equal((await accueil.appel('POST', '/api/reservations', { corps: demande(), entetes: { 'content-type': 'text/plain' } })).statut, 415);
  assert.equal((await accueil.appel('POST', '/api/reservations', { corps: demande(), entetes: { origin: 'http://ailleurs.test' } })).corps.erreur.code, 'ORIGINE');
});

test('connexion : mot de passe faux, blocage après cinq échecs, déconnexion', async () => {
  const b = await baseNeuve(), s = b.session();
  for (let i = 0; i < 5; i++) assert.equal((await s.appel('POST', '/api/session', { corps: { email: 'accueil@essai.test', motDePasse: 'mauvais-mot-de-passe' } })).statut, 401);
  assert.equal((await s.appel('POST', '/api/session', { corps: { email: 'accueil@essai.test', motDePasse: 'accueil-essai-2026' } })).statut, 429, 'bloqué même avec le bon mot de passe');
  assert.equal((await s.appel('POST', '/api/session', { corps: { email: 'inconnu@essai.test', motDePasse: 'x' } })).corps.erreur.message, 'Identifiant ou mot de passe incorrect.', 'la même réponse pour un compte inconnu');
  const d = b.session(), c = await d.connecter('direction'); assert.match(c.entetes['set-cookie'], /HttpOnly; SameSite=Lax/); assert.deepEqual(c.corps.compte.role, 'direction');
  assert.equal((await d.appel('GET', '/api/session')).statut, 200); const ancien = d.cookie();
  await d.appel('DELETE', '/api/session', { corps: {} }); assert.equal((await d.appel('GET', '/api/session', { entetes: { cookie: ancien } })).statut, 401, 'le jeton ne vaut plus rien');
  assert.equal((await b.db.q(`select count(*)::int n from comptes where mot_de_passe not like 'scrypt$%'`)).rows[0].n, 0, 'aucun mot de passe en clair');
});

test('les validations communes s\'appliquent côté serveur : fermé, heure, délai, couverts, complet', async () => {
  const b = await baseNeuve(), v = b.session(), accueil = await equipe(b, 'accueil'), direction = await equipe(b, 'direction');
  const refus = async (plus, code) => { const r = await v.appel('POST', '/api/public/demandes', { corps: demande(plus) }); assert.equal(r.statut, 422, JSON.stringify(plus)); assert.equal(r.corps.erreur.code, code); assert.equal(r.corps.reference, undefined, 'aucune référence inventée'); return r; };
  await refus({ date: LUNDI }, 'FERME'); await refus({ date: '2026-02-31' }, 'DATE'); await refus({ couverts: 11 }, 'COUVERTS'); await refus({ couverts: 0 }, 'COUVERTS'); await refus({ date: '2020-01-03' }, 'PASSEE');
  assert.deepEqual((await refus({ heure: '20:10' }, 'HEURE')).corps.erreur.details.propositions, ['20:00', '20:15']);
  await refus({ nom: '' }, 'VALIDATION'); await refus({ service: 'brunch' }, 'VALIDATION'); await refus({ email: 'pas-une-adresse' }, 'VALIDATION');
  assert.equal((await b.db.q('select count(*)::int n from reservations')).rows[0].n, 0, 'rien n\'est enregistré');
  /* Complet : le site est refusé, l'équipe peut encore noter une table, prévenue. */
  const reg = (await accueil.appel('GET', '/api/reglages')).corps;
  await accueil.appel('POST', '/api/reglages/equipe', { corps: { version: reg.version, operation: 'complet', args: { date: VENDREDI, service: 'soir', actif: true } } });
  await refus({}, 'COMPLET');
  const tel = await accueil.appel('POST', '/api/reservations', { corps: demande({ nom: 'Téléphone' }), cle: 'tel-00000001' });
  assert.equal(tel.statut, 201); assert.equal(tel.corps.alerte, 'complet'); assert.equal(tel.corps.reservation.statut, 'confirmee'); assert.ok(tel.corps.reservation.table);
  /* Une demande pour midi, puis l'ouverture passe à 13 h : la confirmer est refusé ; la direction peut déroger, et c'est tracé. */
  const envoi = await v.appel('POST', '/api/public/demandes', { corps: demande({ date: MERCREDI, service: 'midi', heure: '12:00' }), cle: 'midi-0000001' }); assert.equal(envoi.statut, 201);
  const reg2 = (await direction.appel('GET', '/api/reglages')).corps, jour = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const semaine = Object.fromEntries(jour.map((j) => [j, j === 'mercredi' ? ['13:00-14:30'] : j === 'vendredi' ? ['12:00-14:30', '19:00-00:00'] : j === 'samedi' ? ['19:00-00:00'] : ['jeudi', 'dimanche'].includes(j) ? ['12:00-14:30'] : []]));
  assert.equal((await direction.appel('POST', '/api/reglages/equipe', { corps: { version: reg2.version, operation: 'semaine', args: { semaine } } })).statut, 200);
  const r = (await accueil.appel('GET', `/api/reservations?du=${MERCREDI}&au=${MERCREDI}`)).corps.reservations[0];
  const non = await accueil.appel('POST', `/api/reservations/${r.id}/statut`, { corps: { statut: 'confirmee', version: r.version } });
  assert.equal(non.statut, 422); assert.equal(non.corps.erreur.code, 'HEURE'); assert.equal(non.corps.erreur.details.derogeable, false);
  assert.equal((await accueil.appel('POST', `/api/reservations/${r.id}/statut`, { corps: { statut: 'confirmee', version: r.version, derogation: 'Client habitué' } })).statut, 403, 'l\'accueil ne déroge pas');
  const oui = await direction.appel('POST', `/api/reservations/${r.id}/statut`, { corps: { statut: 'confirmee', version: r.version, derogation: 'Client habitué, accord du chef' } });
  assert.equal(oui.statut, 200); assert.equal(oui.corps.reservation.derogation, 'Client habitué, accord du chef');
  assert.ok((await direction.appel('GET', '/api/journal')).corps.journal.some((j) => j.action === 'statut' && j.detail.derogation));
  /* Le public lit les mêmes règles que l'équipe. */
  assert.deepEqual((await v.appel('GET', `/api/public/disponibilites?date=${MERCREDI}&couverts=2`)).corps.services.find((s) => s.id === 'midi').heures, ['13:00', '13:15', '13:30']);
  assert.deepEqual((await v.appel('GET', '/api/public/reglages')).corps.equipe.semaine.mercredi, ['13:00-14:30']);
});

test('doublons : la même création répétée dix fois ne crée qu\'une réservation', async () => {
  const b = await baseNeuve(), v = b.session(), accueil = await equipe(b, 'accueil');
  const dix = await Promise.all(Array.from({ length: 10 }, () => v.appel('POST', '/api/public/demandes', { corps: demande(), cle: 'meme-requete-01' })));
  assert.equal(new Set(dix.map((r) => r.corps.reference)).size, 1, 'une seule référence'); assert.equal(dix.filter((r) => r.statut === 201).length, 1); assert.equal(dix.filter((r) => r.statut === 200 && r.corps.deja).length, 9);
  assert.equal((await b.db.q('select count(*)::int n from reservations')).rows[0].n, 1);
  assert.equal((await v.appel('POST', '/api/public/demandes', { corps: demande({ couverts: 4 }), cle: 'meme-requete-01' })).corps.erreur.code, 'IDEMPOTENCE', 'la même clé avec un autre contenu est refusée');
  const tel = await Promise.all(Array.from({ length: 10 }, () => accueil.appel('POST', '/api/reservations', { corps: demande({ nom: 'Double clic', date: SAMEDI }), cle: 'double-clic-001' })));
  assert.equal(new Set(tel.map((r) => r.corps.reservation.id)).size, 1); assert.equal((await b.db.q(`select count(*)::int n from reservations where nom = 'Double clic'`)).rows[0].n, 1); assert.equal((await affectations(b)).length, 1);
});

test('concurrence : deux confirmations pour la dernière table n\'en retiennent qu\'une', async () => {
  const b = await baseNeuve(), v = b.session(), accueil = await equipe(b, 'accueil'), direction = await equipe(b, 'direction');
  await uneTable(b, '5');
  for (const [nom, cle] of [['Premier', 'conc-0000001'], ['Second', 'conc-0000002']]) await v.appel('POST', '/api/public/demandes', { corps: demande({ nom, telephone: nom === 'Premier' ? '06 11 11 11 11' : '06 22 22 22 22' }), cle });
  const [a, c] = (await accueil.appel('GET', `/api/reservations?du=${VENDREDI}&au=${VENDREDI}`)).corps.reservations;
  const [ra, rc] = await Promise.all([accueil.appel('POST', `/api/reservations/${a.id}/statut`, { corps: { statut: 'confirmee', version: a.version } }), direction.appel('POST', `/api/reservations/${c.id}/statut`, { corps: { statut: 'confirmee', version: c.version } })]);
  assert.deepEqual([ra.statut, rc.statut].sort(), [200, 409], 'une réussite, un refus'); const perdu = ra.statut === 409 ? ra : rc;
  assert.equal(perdu.corps.erreur.code, 'CAPACITE'); assert.equal((await affectations(b)).length, 1, 'une seule affectation dans la base');
  assert.deepEqual((await b.db.q('select statut from reservations')).rows.map((x) => x.statut).sort(), ['confirmee', 'demande'], 'la demande refusée reste une demande');
  /* Même chose pour deux réservations notées au téléphone en même temps. */
  await b.db.q('delete from affectations'); await b.db.q('delete from idempotence'); await b.db.q('delete from reservations');
  const tels = await Promise.all(['Un', 'Deux', 'Trois', 'Quatre'].map((nom, i) => (i % 2 ? accueil : direction).appel('POST', '/api/reservations', { corps: demande({ nom, telephone: '' }), cle: `tel-conc-000${i}` })));
  assert.equal(tels.filter((r) => r.statut === 201).length, 1); assert.equal(tels.filter((r) => r.statut === 409 && r.corps.erreur.code === 'CAPACITE').length, 3);
  assert.equal((await b.db.q('select count(*)::int n from reservations')).rows[0].n, 1, 'les trois refusées n\'ont rien laissé');
  /* La garantie dure : même en écrivant directement dans la base, deux affectations ne se chevauchent pas. */
  const r = (await b.db.q('select id, jour from reservations')).rows[0], autre = (await b.db.q(`insert into reservations (reference, origine, statut, jour, service, heure_min, duree_min, couverts) values ('R-TEST', 'equipe', 'confirmee', $1, 'soir', 1230, 120, 2) returning id`, [r.jour])).rows[0];
  await assert.rejects(b.db.q(`insert into affectations (reservation_id, table_id, jour, plage, genre) values ($1, '5', $2, int4range(1230, 1350), 'placement')`, [autre.id, r.jour]), (e) => e.code === '23P01');
});

test('conflits : deux modifications concurrentes, un déplacement impossible, une réactivation', async () => {
  const b = await baseNeuve(), accueil = await equipe(b, 'accueil'), direction = await equipe(b, 'direction');
  const creer = async (plus, cle) => (await accueil.appel('POST', '/api/reservations', { corps: demande({ telephone: '', ...plus }), cle })).corps.reservation;
  const a = await creer({ nom: 'Alpha' }, 'conflit-00001');
  /* Deux personnes modifient la même version : une passe, l'autre reçoit un conflit avec la réservation à jour. */
  const [m1, m2] = await Promise.all([accueil.appel('PATCH', `/api/reservations/${a.id}`, { corps: { version: a.version, champs: { couverts: 4 } } }), direction.appel('PATCH', `/api/reservations/${a.id}`, { corps: { version: a.version, champs: { noteEquipe: 'Chaise haute' } } })]);
  assert.deepEqual([m1.statut, m2.statut].sort(), [200, 409]); const conflit = m1.statut === 409 ? m1 : m2, gagne = m1.statut === 200 ? m1 : m2;
  assert.equal(conflit.corps.erreur.code, 'CONFLIT_VERSION'); assert.equal(conflit.corps.erreur.details.reservation.version, a.version + 1, 'la version courante est rendue');
  const jour = gagne.corps.reservation; assert.equal(jour.version, a.version + 1);
  assert.equal((await accueil.appel('PATCH', `/api/reservations/${a.id}`, { corps: { version: jour.version, champs: { statut: 'arrivee' } } })).statut, 422, 'un champ non modifiable est refusé');
  /* Un déplacement impossible conserve l'ancienne réservation, entière. */
  await uneTable(b, '5'); await b.db.q('delete from affectations');
  const soir = await creer({ nom: 'Soir', couverts: 2 }, 'conflit-00002'), tard = await creer({ nom: 'Tard', heure: '19:00', date: SAMEDI, couverts: 2 }, 'conflit-00003');
  const dep = await accueil.appel('PATCH', `/api/reservations/${tard.id}`, { corps: { version: tard.version, champs: { date: VENDREDI, heure: '20:30' } } });
  assert.equal(dep.statut, 409); assert.equal(dep.corps.erreur.code, 'CAPACITE');
  const relu = (await accueil.appel('GET', `/api/reservations?du=${SAMEDI}&au=${SAMEDI}`)).corps.reservations.find((x) => x.id === tard.id);
  assert.deepEqual({ date: relu.date, heure: relu.heure, table: relu.table, version: relu.version }, { date: SAMEDI, heure: '19:00', table: '5', version: tard.version }, 'rien n\'a bougé');
  /* Un déplacement possible réussit entièrement. */
  const ok = await accueil.appel('PATCH', `/api/reservations/${tard.id}`, { corps: { version: tard.version, champs: { heure: '21:00' } } }); assert.equal(ok.statut, 200); assert.equal(ok.corps.reservation.heure, '21:00'); assert.equal(ok.corps.reservation.table, '5');
  /* Réactivation : annulée, sa table est donnée à un autre ; remise, elle ne la reprend pas. */
  await b.db.q('update tables_salle set active = true');
  const p = (await accueil.appel('PUT', `/api/reservations/${soir.id}/table`, { corps: { table: '7', version: soir.version } })).corps.reservation;
  const annulee = (await accueil.appel('POST', `/api/reservations/${soir.id}/statut`, { corps: { statut: 'annulee', version: p.version } })).corps.reservation;
  const nouveau = await creer({ nom: 'Nouveau', heure: '20:15' }, 'conflit-00004');
  assert.equal((await accueil.appel('PUT', `/api/reservations/${nouveau.id}/table`, { corps: { table: '7', version: nouveau.version } })).statut, 200);
  assert.equal((await accueil.appel('PUT', `/api/reservations/${soir.id}/table`, { corps: { table: '7', version: annulee.version } })).corps.erreur.code, 'TRANSITION', 'on ne place pas une réservation annulée');
  const remise = await accueil.appel('POST', `/api/reservations/${soir.id}/statut`, { corps: { statut: 'confirmee', version: annulee.version } });
  assert.equal(remise.statut, 200); assert.notEqual(remise.corps.reservation.table, '7'); assert.equal(remise.corps.reservation.placement, 'technique'); assert.equal(remise.corps.note, 'a-placer');
  assert.equal((await accueil.appel('PUT', `/api/reservations/${soir.id}/table`, { corps: { table: '7', version: remise.corps.reservation.version } })).corps.erreur.code, 'TABLE_PRISE');
  assert.equal((await accueil.appel('POST', `/api/reservations/${soir.id}/statut`, { corps: { statut: 'demande', version: remise.corps.reservation.version } })).corps.erreur.code, 'TRANSITION');
});

test('capacité garantie et placement choisi : une table seulement retenue par le serveur se libère pour l\'équipe', async () => {
  const b = await baseNeuve(), accueil = await equipe(b, 'accueil');
  await b.db.q(`update tables_salle set active = id in ('2', '4')`); /* deux tables de quatre */
  const creer = async (nom, cle) => (await accueil.appel('POST', '/api/reservations', { corps: demande({ nom, telephone: '', couverts: 3 }), cle })).corps.reservation;
  const a = await creer('Alpha', 'capacite-0001'), c = await creer('Bravo', 'capacite-0002');
  assert.deepEqual([a.placement, c.placement], ['technique', 'technique']); assert.notEqual(a.table, c.table, 'chacune a sa table retenue');
  /* L'équipe veut asseoir Bravo à la table que le serveur avait retenue pour Alpha : Alpha est déplacée, personne ne perd sa capacité. */
  const place = await accueil.appel('PUT', `/api/reservations/${c.id}/table`, { corps: { table: a.table, version: c.version } });
  assert.equal(place.statut, 200); assert.equal(place.corps.reservation.table, a.table); assert.equal(place.corps.reservation.placement, 'placement');
  const apres = (await accueil.appel('GET', `/api/reservations?du=${VENDREDI}&au=${VENDREDI}`)).corps.reservations;
  assert.equal(apres.find((x) => x.id === a.id).table, c.table, 'Alpha a reçu l\'autre table'); assert.equal(new Set(apres.map((x) => x.table)).size, 2);
  /* Une troisième réservation n'a plus de table : refusée, sans rien retenir. */
  const trop = await accueil.appel('POST', '/api/reservations', { corps: demande({ nom: 'Charlie', telephone: '', couverts: 3 }), cle: 'capacite-0003' });
  assert.equal(trop.statut, 409); assert.equal(trop.corps.erreur.code, 'CAPACITE'); assert.equal((await b.db.q('select count(*)::int n from reservations')).rows[0].n, 2);
  /* Choisir pour Alpha la table que l'équipe a donnée à Bravo est refusé ; retirer Bravo de sa table lui garde sa capacité. */
  const alpha = apres.find((x) => x.id === a.id);
  assert.equal((await accueil.appel('PUT', `/api/reservations/${a.id}/table`, { corps: { table: a.table, version: alpha.version } })).corps.erreur.code, 'TABLE_PRISE');
  const retire = await accueil.appel('PUT', `/api/reservations/${c.id}/table`, { corps: { table: '', version: place.corps.reservation.version } });
  assert.equal(retire.corps.reservation.placement, 'technique'); assert.ok(retire.corps.reservation.table, 'à placer, mais toujours garantie');
});

test('une panne du serveur ne produit jamais de faux succès', async () => {
  const b = await baseNeuve(), v = b.session();
  await b.fermer(); /* la base ne répond plus */
  const r = await v.appel('POST', '/api/public/demandes', { corps: demande(), cle: 'panne-000001' });
  assert.equal(r.statut, 500); assert.equal(r.corps.erreur.code, 'SERVEUR'); assert.equal(r.corps.reference, undefined); assert.equal(b.erreurs.length, 1, 'l\'erreur est journalisée côté serveur, pas montrée');
  assert.ok(!JSON.stringify(r.corps).includes('postgres'), 'aucun détail interne dans la réponse');
});

test('clients : un identifiant durable, le téléphone rapproche, les homonymes ne fusionnent pas', async () => {
  const b = await baseNeuve(), v = b.session(), accueil = await equipe(b, 'accueil'), direction = await equipe(b, 'direction');
  assert.equal(normaliserTelephone('06 12 34 56 78'), '+33612345678'); assert.equal(normaliserTelephone('+33 6 12 34 56 78'), '+33612345678'); assert.equal(normaliserTelephone('0049 30 1234567'), '+49301234567'); assert.equal(normaliserTelephone('12 34'), null);
  await v.appel('POST', '/api/public/demandes', { corps: demande(), cle: 'client-00001' }); await v.appel('POST', '/api/public/demandes', { corps: demande({ telephone: '+33 6 12 34 56 78', date: SAMEDI }), cle: 'client-00002' });
  for (const cle of ['client-00003', 'client-00004']) await accueil.appel('POST', '/api/reservations', { corps: demande({ nom: 'Martin', prenom: 'Paul', telephone: '', date: SAMEDI }), cle });
  const cl = (await b.db.q('select id, nom, telephone from clients order by telephone nulls last, id')).rows;
  assert.equal(cl.filter((c) => c.telephone === '+33612345678').length, 1, 'le même téléphone, écrit de deux façons : une seule fiche'); assert.equal(cl.filter((c) => c.nom === 'Martin').length, 2, 'deux homonymes sans téléphone : deux fiches');
  const id = cl[0].id, fiche = (await accueil.appel('GET', `/api/clients/${id}`)).corps; assert.equal(fiche.reservations.length, 2);
  const [x, y] = await Promise.all([accueil.appel('PATCH', `/api/clients/${id}`, { corps: { version: fiche.client.version, champs: { allergiesPlus: ['Arachides'] } } }), direction.appel('PATCH', `/api/clients/${id}`, { corps: { version: fiche.client.version, champs: { habitue: true } } })]);
  assert.deepEqual([x.statut, y.statut].sort(), [200, 409]);
  const apres = (await accueil.appel('GET', `/api/clients/${id}`)).corps.client, suite = await accueil.appel('PATCH', `/api/clients/${id}`, { corps: { version: apres.version, champs: { allergiesPlus: ['Lait'], note: 'Table près du feu' } } });
  assert.equal(suite.statut, 200); assert.ok(suite.corps.client.allergies.includes('Lait')); assert.equal(suite.corps.client.note, 'Table près du feu');
});

test('sauvegarde et restauration, dans une base de vérification', async () => {
  const b = await baseNeuve(), v = b.session(), accueil = await equipe(b, 'accueil');
  await v.appel('POST', '/api/public/demandes', { corps: demande(), cle: 'sauve-000001' });
  const tel = (await accueil.appel('POST', '/api/reservations', { corps: demande({ nom: 'Gardée', date: SAMEDI, telephone: '' }), cle: 'sauve-000002' })).corps.reservation;
  await accueil.appel('PUT', `/api/reservations/${tel.id}/table`, { corps: { table: '9', version: tel.version } });
  const s = JSON.parse(JSON.stringify(await sauvegarder(b.db)));
  assert.equal(s.tables.reservations.nombre, 2); assert.equal(s.tables.affectations.nombre, 1); assert.equal(s.tables.comptes.nombre, 3);
  const neuve = await baseNeuve({ comptes: false, initialise: false }), bilan = await restaurer(neuve.db, s);
  assert.equal(bilan.reservations, 2); assert.equal(bilan.journal, s.tables.journal.nombre);
  /* La base restaurée sert vraiment : on s'y connecte avec le même compte, on y retrouve la réservation et sa table, on y travaille. */
  const la = neuve.session(); assert.equal((await la.connecter('accueil')).statut, 200);
  const relue = (await la.appel('GET', `/api/reservations?du=${SAMEDI}&au=${SAMEDI}`)).corps.reservations[0];
  assert.equal(relue.nom, 'Gardée'); assert.equal(relue.table, '9'); assert.equal(relue.reference, tel.reference);
  assert.equal((await la.appel('POST', `/api/reservations/${relue.id}/statut`, { corps: { statut: 'arrivee', version: relue.version } })).statut, 200, 'les numéros de suivi et du journal repartent après les derniers');
  assert.deepEqual(JSON.parse(JSON.stringify((await sauvegarder(b.db)).tables.reservations.empreinte)), s.tables.reservations.empreinte, 'la source n\'a pas bougé');
  await assert.rejects(restaurer(neuve.db, s), /n'est pas vide/, 'on ne restaure pas par-dessus des données');
  const abimee = structuredClone(s); abimee.tables.reservations.lignes.pop(); const autre = await baseNeuve({ comptes: false, initialise: false });
  await assert.rejects(restaurer(autre.db, abimee), /abîmée/); assert.equal((await autre.db.q('select count(*)::int n from comptes')).rows[0].n, 0, 'tout ou rien');
});

test('la fonction hébergée construite : base vide préparée seule, chemin réécrit, même origine, panne de base', async () => {
  const { execFileSync } = await import('node:child_process'), { tmpdir } = await import('node:os'), { join: joindre } = await import('node:path'), { pathToFileURL } = await import('node:url');
  const { baseVide, appelFonction, MOTS } = await import('./outillage.mjs'), { ouvrir } = await import('../src/db.mjs'), { hacher } = await import('../src/auth.mjs');
  const fichier = joindre(tmpdir(), `jh-fonction-${process.pid}.mjs`);
  execFileSync(process.execPath, [joindre(import.meta.dirname, '..', 'outils', 'construire-fonction.mjs'), fichier], { stdio: 'ignore' });
  const construit = (await import('node:fs')).readFileSync(fichier, 'utf8');
  assert.ok(!/postgres:\/\/[^'"`\s]*@/.test(construit), 'aucune adresse de base dans le fichier construit');
  const url = await baseVide(), avant = { ...process.env };
  /* Sans adresse de base : 503, jamais un succès. */
  delete process.env.DATABASE_URL;
  const f = (await import(pathToFileURL(fichier).href)).default;
  const sans = await appelFonction(f, { url: '/api?__chemin=etat' });
  assert.equal(sans.statut, 503); assert.equal(sans.corps.erreur.code, 'SERVEUR');
  /* Avec la base vide : le premier appel migre et pose les réglages de départ ; aucune réservation, aucun client, aucun compte. */
  process.env.DATABASE_URL = url; process.env.JH_ENV = 'recette'; process.env.JH_LIVRAISON = 'essai-fonction';
  const etat = await appelFonction(f, { url: '/api?__chemin=etat' });
  assert.equal(etat.statut, 200); assert.deepEqual(etat.corps, { ok: true, livraison: 'essai-fonction', environnement: 'recette', base: 1 });
  const db = ouvrir(url, { max: 2 });
  for (const t of ['reservations', 'clients', 'comptes']) assert.equal((await db.q(`select count(*)::int n from ${t}`)).rows[0].n, 0, `${t} : vide`);
  assert.ok((await db.q('select count(*)::int n from tables_salle')).rows[0].n > 0);
  /* Le chemin réécrit par l'hébergeur (« /api?__chemin=… ») et ses paramètres arrivent bien à l'API. */
  const regles = await appelFonction(f, { url: '/api?__chemin=public/reglages' }); assert.equal(regles.statut, 200); assert.ok(regles.corps.services);
  const dispo = await appelFonction(f, { url: `/api?__chemin=public/disponibilites&date=${VENDREDI}&couverts=2` }); assert.equal(dispo.statut, 200);
  /* Une écriture venue d'un autre site est refusée ; du même hôte, acceptée ; le cookie de session est marqué Secure. */
  await db.q('insert into comptes (email, nom, role, mot_de_passe) values ($1, $2, $3, $4)', ['accueil@essai.test', 'Accueil', 'accueil', await hacher(MOTS.accueil)]);
  const corps = { email: 'accueil@essai.test', motDePasse: MOTS.accueil };
  const ailleurs = await appelFonction(f, { methode: 'POST', url: '/api?__chemin=session', corps, entetes: { origin: 'https://ailleurs.exemple.test', 'x-forwarded-host': 'recette.exemple.test' } });
  assert.equal(ailleurs.statut, 403); assert.equal(ailleurs.corps.erreur.code, 'ORIGINE');
  const ici = await appelFonction(f, { methode: 'POST', url: '/api?__chemin=session', corps, entetes: { origin: 'https://recette.exemple.test', 'x-forwarded-host': 'recette.exemple.test' } });
  assert.equal(ici.statut, 200); assert.match(ici.entetes['set-cookie'], /HttpOnly/); assert.match(ici.entetes['set-cookie'], /Secure/); assert.match(ici.entetes['set-cookie'], /SameSite=Lax/);
  const cookie = ici.entetes['set-cookie'].split(';')[0];
  const liste = await appelFonction(f, { url: `/api?__chemin=reservations&du=${VENDREDI}&au=${VENDREDI}`, entetes: { cookie } }); assert.equal(liste.statut, 200); assert.deepEqual(liste.corps.reservations, []);
  const sansSession = await appelFonction(f, { url: `/api?__chemin=reservations&du=${VENDREDI}&au=${VENDREDI}` }); assert.equal(sansSession.statut, 401);
  /* Une demande publique passe par la fonction et tient compte de l'adresse posée par le relais. */
  const dem = await appelFonction(f, { methode: 'POST', url: '/api?__chemin=public/demandes', corps: demande(), entetes: { origin: 'https://recette.exemple.test', 'x-forwarded-host': 'recette.exemple.test', 'x-forwarded-for': '203.0.113.9, 10.0.0.1', 'idempotency-key': 'fonction-0001' } });
  assert.equal(dem.statut, 201); assert.match(dem.corps.reference, /^R-/);
  await db.fermer(); for (const k of ['DATABASE_URL', 'JH_ENV', 'JH_LIVRAISON']) { if (k in avant) process.env[k] = avant[k]; else delete process.env[k]; }
});
