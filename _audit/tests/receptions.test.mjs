/* v7.12.0, « Les réceptions de A à Z » : le dossier unique, les propositions versionnées, les options et les espaces,
   les conflits (préparation, remise en état, minuit, réservations du restaurant), le portail du client, le jour J, et
   les ajustements de la v7.11.1 (téléphone partagé). Tout est joué avec des données fictives.
   Lancer : node --test _audit/tests/*.test.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { publier, occupationsActives, prisesDuService, etatService, equipeDe, faisabilite, instantDe, seCroisent, retenueActive } from '../../assets/js/disponibilites.js';
import { appliquer } from '../../assets/js/espace-donnees.js';
import { ajouter, resasDuJour } from '../../assets/js/espace-regles.js';
import { reglesAction } from '../../assets/js/espace-garde.js';
import { planDuService, possibles } from '../../assets/js/espace-salle.js';
import { normaliser } from '../../assets/js/espace-demandes.js';
import { marques, fiche, telephonesPartages, notesTelephonePartage, partagesConnus, cleClient } from '../../assets/js/espace-clients.js';
import { dossierDepuisDemande, idDossier, dossierDe, dossiersDe, dossierDeDemande, ressources, chronologie, completerHoraires, echeanceParDefaut, etatRetenue, etapeDe, accordDe, couranteDe, brouillonDe, versionsDe, totalProposition, euros,
  conflits, replacement, argsRetenue, consequences, suivi, resume, receptionsDuJour, prioritesReceptions, fichePreparation, tachesHabituelles, vueClient, refusChangement, codeReception, lienReception, prochaineAction } from '../../assets/js/espace-receptions.js';

globalThis.document ||= { visibilityState: 'visible' };
const lire = (f) => JSON.parse(readFileSync(new URL(`../../donnees/${f}`, import.meta.url), 'utf8'));
const SALLE = lire('salle.json'), LIEUX = lire('receptions.json'), R = publier(lire('reservation.json'), lire('horaires.json').adresses[0]).reservation;
/* Vendredi 20 novembre 2026, 10 h. Un scénario sans exemple tiré au hasard : seules les réservations posées par le test existent. */
const AUJ = '2026-11-20', ctx = (plus = {}) => ({ R, auj: AUJ, minute: 10 * 60, maintenant: `${AUJ}T10:00:00`, site: [], demandes: [], exceptions: [], scenario: 'test', lieux: LIEUX, venues: {}, ...plus });
const a = (iso, hm) => ({ ...ctx(), auj: iso, minute: +hm.slice(0, 2) * 60 + +hm.slice(3), maintenant: `${iso}T${hm}:00` });
function agir(S, nom, args, c = ctx()) { const r = reglesAction(c, S, SALLE, nom, args); if (r.refus) return { S, refus: r.refus }; let e = appliquer(S, nom, args); for (const s of r.suites) e = appliquer(e, s.nom, s.args); return { S: e, refus: '' }; }
const ok = (S, nom, args, c) => { const r = agir(S, nom, args, c); assert.equal(r.refus, '', `${nom} devrait être possible`); return r.S; };
const DEM = normaliser({ id: 'dem-1', genre: 'reception', cree: '2026-11-18T09:00:00', occasion: 'Un anniversaire', date: '2026-12-12', invites: '30', espace: 'Salle du restaurant', message: 'Les 60 ans de Paul.', prenom: 'Nadia', nom: 'K.', telephone: '06 11 22 33 44', email: 'nadia@exemple.fr', source: 'demo' });
const creer = (S = {}, dem = DEM, c = ctx()) => ok(S, 'recCreer', { dossier: dossierDepuisDemande(dem, { cree: c.maintenant, lieux: LIEUX }) }, c);
const petit = (S, n = 18) => ok(S, 'recModifier', { id: idDossier('dem-1'), champs: { projet: { invitesAnnonces: n } } });
const ID = idDossier('dem-1'), SAMEDI = '2026-12-12', HOR = { preparation: '17:00', arrivee: '19:00', repas: '20:00', fin: '01:00', remise: '02:00' };
const option = (S, plus = {}, c = ctx()) => agir(S, 'recRetenir', argsRetenue(c, SALLE, dossierDe(S, plus.id || ID), { type: 'option', jour: SAMEDI, horaires: HOR, espaces: ['restaurant'], echeance: '2026-11-27T18:00', le: c.maintenant, ...plus }), c);
const resa = (id, iso, heure, couverts, table, nom = 'Client du test') => ({ id, date: iso, service: +heure.slice(0, 2) < 17 ? 'midi' : 'soir', heure, couverts, nom, telephone: '', statut: 'confirmee', source: 'demo', ...(table ? {} : {}) });
const avecResas = (l) => ({ resa: { ajouts: l.map(([r]) => r), tables: Object.fromEntries(l.filter(([, t]) => t).map(([r, t]) => [r.id, t])) } });
const proposition = (S, lignes = [{ id: 'l1', libelle: 'Menu de groupe', qte: 30, pu: 45, unite: 'par personne', exemple: true }], c = ctx()) => ok(S, 'recProposition', { id: ID, proposition: { titre: 'Les 60 ans de Paul', presentation: 'Un dîner au coin du feu.', lignes, compris: 'Service et nappage.', aPreciser: 'Le gâteau.' }, le: c.maintenant }, c);

/* ============================== Le dossier ============================== */
test('1 · transformer une demande crée un seul dossier, qui reprend la demande sans ressaisie et garde son identifiant', () => {
  let S = creer(); const d = dossierDe(S, ID);
  assert.equal(d.demande, 'dem-1'); assert.deepEqual([d.client.nom, d.client.telephone, d.client.email], ['Nadia K.', '06 11 22 33 44', 'nadia@exemple.fr']);
  assert.deepEqual([d.projet.occasion, d.projet.invitesAnnonces, d.projet.attentes, d.souhait.date], ['Un anniversaire', 30, 'Les 60 ans de Paul.', '2026-12-12']);
  assert.deepEqual(d.espaces.envisages, ['restaurant'], 'l\'espace demandé est reconnu comme espace envisagé'); assert.equal(d.jour, '', 'la date demandée reste un souhait');
  S = creer(S); S = creer(S, { ...DEM }); assert.equal(dossiersDe(S).length, 1, 'un double clic ou une seconde ouverture ne crée pas un second dossier');
  S = appliquer(S, 'recCreer', { dossier: { ...dossierDepuisDemande(DEM, { cree: 'x', lieux: LIEUX }), id: 'rec-autre' } }); assert.equal(dossiersDe(S).length, 1, 'même demande, autre identifiant : toujours un seul dossier');
  assert.equal(dossierDeDemande(S, 'dem-1').id, ID);
  S = option(S).S; S = ok(S, 'recRetenir', argsRetenue(ctx(), SALLE, dossierDe(S, ID), { type: 'option', jour: '2026-12-19', horaires: HOR, espaces: ['restaurant'], echeance: '2026-11-27T18:00', le: ctx().maintenant }));
  assert.equal(dossierDe(S, ID).jour, '2026-12-19'); assert.deepEqual(Object.keys(S.receptions.dossiers), [ID], 'changer de date ne change pas l\'identifiant');
});

test('2 · le suivi, l\'agenda et Aujourd\'hui relisent le même dossier : un seul identifiant partout', () => {
  let S = option(proposition(creer())).S;
  const s = suivi(ctx(), S, [DEM]); assert.equal(s.total, 1, 'la demande et son dossier ne font qu\'une ligne');
  assert.deepEqual(s.phases.map((p) => [p.id, p.cartes.map((c) => c.id)]).filter(([, l]) => l.length), [['proposition', [ID]]]);
  assert.deepEqual(receptionsDuJour(ctx(), S, SAMEDI).map((x) => [x.type, x.dossier]), [['option', ID]]);
  assert.deepEqual(receptionsDuJour(ctx(), S, ajouter(SAMEDI, 1)).map((x) => [x.type, x.dossier]), [['option', ID]], 'la soirée finit le lendemain : elle y figure aussi');
  assert.match(receptionsDuJour(ctx(), S, SAMEDI)[0].detail, /préparation 17 h · invités 19 h · fin 1 h \(le lendemain\) · remise en état jusqu'à 2 h \(le lendemain\)/);
  const c = a('2026-11-26', '09:00'); assert.deepEqual(prioritesReceptions(c, S).map((x) => [x.genre, x.dossier]), [['echeance', ID]], 'la veille de l\'échéance, l\'option remonte dans Aujourd\'hui');
  assert.equal(suivi(ctx(), {}, [DEM]).phases[0].cartes[0].etape.libelle, 'Demande sans dossier');
});

/* ============================== Les propositions ============================== */
test('3 · une proposition ne retient aucun espace', () => {
  let S = proposition(creer()); S = ok(S, 'recPresenter', { id: ID, le: ctx().maintenant });
  assert.deepEqual(occupationsActives(S, ctx().maintenant), []); assert.equal(etatRetenue(dossierDe(S, ID), ctx().maintenant).etat, 'aucune');
  assert.equal(planDuService(ctx(), S, SALLE, SAMEDI, 'soir').tables.filter((t) => t.reception).length, 0);
  assert.equal(etatService(R, SAMEDI, 'soir', equipeDe(S, [], ctx().maintenant)).prive, false);
  assert.equal(etapeDe(dossierDe(S, ID), {}, ctx().maintenant).id, 'presentee');
});

test('9 · une proposition présentée est un instantané : la modifier crée une nouvelle version, l\'ancienne reste intacte', () => {
  let S = proposition(creer()); const brouillon = structuredClone(brouillonDe(dossierDe(S, ID)));
  assert.equal(brouillon.v, 1); assert.equal(totalProposition(brouillon), 1350); assert.equal(euros(1350), '1 350 €'); assert.equal(euros(45.5), '45,50 €');
  S = proposition(S, [{ id: 'l1', libelle: 'Menu de groupe', qte: 30, pu: 48, unite: 'par personne' }]); assert.equal(versionsDe(dossierDe(S, ID)).length, 1, 'un brouillon se modifie sur place');
  assert.match(agir(S, 'recPresenter', { id: ID, le: 'x' }).refus || 'ok', /ok/);
  assert.match(agir(ok(creer(), 'recProposition', { id: ID, proposition: { titre: '', lignes: [] }, le: 'x' }), 'recPresenter', { id: ID }).refus, /titre/);
  S = ok(S, 'recPresenter', { id: ID, le: '2026-11-20T10:05' }); const v1 = structuredClone(couranteDe(dossierDe(S, ID)));
  assert.deepEqual([v1.v, v1.etat, v1.total, dossierDe(S, ID).courante], [1, 'presentee', 1440, 1]);
  /* Enregistrer après la présentation ne touche pas à la version 1 : un nouveau brouillon, numéroté 2, est créé. */
  S = ok(S, 'recNouvelleVersion', { id: ID, le: '2026-11-21T09:00' }); assert.match(agir(S, 'recNouvelleVersion', { id: ID }).refus, /déjà en préparation/);
  S = ok(S, 'recProposition', { id: ID, proposition: { titre: 'Les 60 ans de Paul, version sans apéritif', lignes: [{ id: 'l1', libelle: 'Menu de groupe', qte: 32, pu: 48 }, { id: 'l2', libelle: 'Gâteau', qte: 1, pu: 90 }] }, le: '2026-11-21T09:10' });
  const d = dossierDe(S, ID); assert.deepEqual(versionsDe(d).map((p) => [p.v, p.etat]), [[1, 'presentee'], [2, 'brouillon']]);
  assert.deepEqual(couranteDe(d), v1, 'la version 1 est restée telle qu\'elle a été présentée'); assert.equal(d.courante, 1, 'une seule version courante : la dernière présentée');
  S = ok(S, 'recPresenter', { id: ID, le: '2026-11-21T09:30' }); assert.equal(dossierDe(S, ID).courante, 2); assert.deepEqual(versionsDe(dossierDe(S, ID)).find((p) => p.v === 1), v1);
  assert.equal(totalProposition(couranteDe(dossierDe(S, ID))), 32 * 48 + 90);
});

/* ============================== Les options et les espaces ============================== */
test('4 · une option active retient exactement les ressources et la période prévues', () => {
  let S = option(petit(creer()), { espaces: ['coin-feu', 'grande-table'] }).S; const d = dossierDe(S, ID);
  assert.deepEqual([d.retenue.etat, d.retenue.debut, d.retenue.fin, d.retenue.echeance], ['option', '2026-12-12T17:00', '2026-12-13T02:00', '2026-11-27T18:00']);
  assert.deepEqual(d.retenue.tables, ['1', '2', '3', '7']); assert.deepEqual([d.retenue.salle, d.retenue.terrasse], [false, false]);
  const prises = (iso, sv) => planDuService(ctx(), S, SALLE, iso, sv).tables.filter((t) => t.reception).map((t) => t.id);
  assert.deepEqual(prises(SAMEDI, 'soir'), ['1', '2', '3', '7'], 'le soir de la réception : ses tables, et elles seules');
  assert.deepEqual(prises(SAMEDI, 'midi'), [], 'le midi du même jour (service fini à 14 h 30, préparation à 17 h) : rien');
  assert.deepEqual(prises(ajouter(SAMEDI, -1), 'soir'), []); assert.deepEqual(prises(ajouter(SAMEDI, 1), 'midi'), [], 'le lendemain midi (remise en état finie à 2 h) : rien');
  /* Les autres tables restent proposées ; celles de la réception ne le sont plus, avec leur raison. */
  const plan = planDuService(ctx(), S, SALLE, SAMEDI, 'soir'), r = { id: 'x', couverts: 4, debutMin: 20 * 60, finMin: 22 * 60 };
  assert.deepEqual(possibles(plan, r).map((t) => t.id).sort((x, y) => x - y), ['4', '5', '8', '9']);
  assert.match(agir(S, 'ajouterResa', { resa: { ...resa('n1', SAMEDI, '20:00', 2), table: '1' } }).refus || agir({ ...S, ...avecResas([[resa('n1', SAMEDI, '20:00', 2)]]) }, 'placerResa', { id: 'n1', table: '1' }).refus, /retenue pour une réception/);
  /* La page Réserver : la salle n'est pas entièrement prise, le service reste ouvert. */
  assert.equal(etatService(R, SAMEDI, 'soir', equipeDe(S, [], ctx().maintenant)).prive, false);
  S = option(creer(), { espaces: ['restaurant'] }).S; const e = etatService(R, SAMEDI, 'soir', equipeDe(S, [], ctx().maintenant));
  assert.deepEqual([e.ouvert, e.prive, e.reception], [true, true, 'Anniversaire · Nadia K.']);
  assert.equal(faisabilite(R, { date: SAMEDI, service: 'soir', heure: '20:00', couverts: 2 }, { auj: AUJ, equipe: equipeDe(S, [], ctx().maintenant), public: true }).raison, 'prive');
  assert.equal(faisabilite(R, { date: SAMEDI, service: 'soir', heure: '20:00', couverts: 2 }, { auj: AUJ, equipe: equipeDe(S, [], ctx().maintenant) }).alerte, 'prive', 'l\'équipe est prévenue, pas empêchée');
  assert.equal(etatService(R, ajouter(SAMEDI, 7), 'soir', equipeDe(S, [], ctx().maintenant)).prive, false);
  /* La salle de réception n'a pas de table : elle ne prend rien au restaurant. */
  S = option(creer(), { espaces: ['salle-reception'] }).S; assert.deepEqual(dossierDe(S, ID).retenue.tables, []); assert.equal(prisesDuService(occupationsActives(S, ctx().maintenant), R, SAMEDI, 'soir').tables.size, 0);
});

test('5 · à l\'échéance exacte, l\'option cesse de retenir ; le dossier et son historique restent, sans être classés', () => {
  const S = option(creer()).S, d = dossierDe(S, ID);
  assert.equal(retenueActive(d.retenue, '2026-11-27T17:59'), true); assert.equal(retenueActive(d.retenue, '2026-11-27T18:00'), false, 'à l\'heure exacte de l\'échéance');
  const apres = a('2026-11-27', '18:00');
  assert.equal(etatRetenue(d, apres.maintenant).etat, 'expiree'); assert.deepEqual(occupationsActives(S, apres.maintenant), []);
  assert.equal(planDuService(apres, S, SALLE, SAMEDI, 'soir').tables.filter((t) => t.reception).length, 0); assert.equal(etatService(R, SAMEDI, 'soir', equipeDe(S, [], apres.maintenant)).prive, false);
  assert.equal(dossiersDe(S).length, 1); assert.equal(d.cloture, null, 'l\'expiration ne classe pas le dossier sans suite'); assert.ok(d.historique.some((h) => /Option posée/.test(h.quoi)));
  assert.equal(resume(apres, d).attention, 'Option expirée : les espaces sont libres'); assert.match(prochaineAction(d, {}, { maintenant: apres.maintenant }).texte, /Option expirée/);
  /* Recharger ne prolonge rien : l'échéance est enregistrée. Reposer une option demande une nouvelle vérification. */
  assert.equal(JSON.parse(JSON.stringify(S)).receptions.dossiers[ID].retenue.echeance, '2026-11-27T18:00');
  const pris = option(creer({}, normaliser({ ...DEM.brut, id: 'dem-2', prenom: 'Omar', nom: 'T.', telephone: '06 55 44 33 22' }), apres), { id: idDossier('dem-2'), echeance: '2026-12-04T18:00', le: apres.maintenant }, apres);
  assert.equal(pris.refus, '', 'les espaces sont libres pour un autre dossier après l\'expiration');
  const deux = { receptions: { dossiers: { ...S.receptions.dossiers, ...pris.S.receptions.dossiers } } };
  assert.match(option(deux, { echeance: '2026-12-05T18:00', le: apres.maintenant }, apres).refus, /déjà retenu par une option/, 'la réactivation est revérifiée : l\'espace a été pris entre-temps');
});

test('6 · un déplacement ou une prolongation refusés conservent l\'option initiale', () => {
  let S = option(creer()).S; const avant = structuredClone(dossierDe(S, ID));
  /* Un autre dossier tient la salle le samedi suivant. */
  S = creer(S, normaliser({ ...DEM.brut, id: 'dem-2', prenom: 'Omar', nom: 'T.', telephone: '06 55 44 33 22' }));
  S = ok(S, 'recRetenir', argsRetenue(ctx(), SALLE, dossierDe(S, idDossier('dem-2')), { type: 'option', jour: '2026-12-19', horaires: HOR, espaces: ['restaurant'], echeance: '2026-11-30T18:00', le: ctx().maintenant }));
  const refus = option(S, { jour: '2026-12-19' }); assert.match(refus.refus, /La salle du restaurant : déjà retenu par une option.*« Anniversaire · Omar T\. »/);
  assert.deepEqual(dossierDe(refus.S, ID), avant, 'le dossier est exactement dans son état d\'avant');
  assert.match(option(S, { echeance: '2026-12-12T18:00' }).refus, /doit précéder le début de la préparation/); assert.match(option(S, { echeance: '2026-11-20T09:00' }).refus, /à venir/);
  assert.match(option(S, { echeance: '' }).refus, /échéance/); assert.deepEqual(dossierDe(S, ID), avant);
  /* Une prolongation possible est acceptée, et l'historique le dit. */
  const prolonge = option(S, { echeance: '2026-12-04T18:00' }); assert.equal(prolonge.refus, ''); assert.equal(dossierDe(prolonge.S, ID).retenue.echeance, '2026-12-04T18:00'); assert.equal(dossierDe(prolonge.S, ID).retenue.posee, avant.retenue.posee);
  assert.match(dossierDe(prolonge.S, ID).historique.at(-1).quoi, /Option modifiée/);
  /* La date, les horaires et les espaces ne se changent pas en douce quand des espaces sont retenus. */
  assert.match(agir(S, 'recModifier', { id: ID, champs: { jour: '2026-12-26' } }).refus, /Vérifier et déplacer/); assert.equal(agir(S, 'recModifier', { id: ID, champs: { projet: { contraintes: 'Une personne en fauteuil.' } } }).refus, '');
});

test('7 · les conflits comptent la préparation, la remise en état et le passage de minuit', () => {
  assert.deepEqual(chronologie(SAMEDI, HOR).etapes.map((e) => [e.cle, e.instant]), [['preparation', '2026-12-12T17:00'], ['arrivee', '2026-12-12T19:00'], ['repas', '2026-12-12T20:00'], ['fin', '2026-12-13T01:00'], ['remise', '2026-12-13T02:00']]);
  assert.deepEqual(completerHoraires({ arrivee: '19:00', fin: '01:00' }, LIEUX.durees), { arrivee: '19:00', fin: '01:00', preparation: '17:00', remise: '02:00' }); assert.equal(instantDe('2026-12-31', 1500), '2027-01-01T01:00');
  assert.equal(echeanceParDefaut('2026-11-20T10:00', SAMEDI, LIEUX.durees), '2026-11-27T18:00'); assert.equal(echeanceParDefaut('2026-12-09T10:00', SAMEDI, LIEUX.durees), '2026-12-11T18:00');
  let S = option(creer(), { espaces: ['salle-reception'] }).S; S = creer(S, normaliser({ ...DEM.brut, id: 'dem-2', prenom: 'Omar', nom: 'T.', telephone: '06 55 44 33 22' }));
  const essai = (jour, horaires) => conflits(ctx(), S, SALLE, dossierDe(S, idDossier('dem-2')), { jour, horaires, espaces: ['salle-reception'], invites: 30 }).bloquants.map((b) => b.type);
  /* Le dimanche à 1 h 30 du matin : la remise en état du samedi n'est pas finie. */
  assert.deepEqual(essai('2026-12-13', { preparation: '01:30', arrivee: '03:00', fin: '05:00', remise: '06:00' }), ['reception'], 'après minuit, pendant la remise en état');
  assert.deepEqual(essai('2026-12-13', { preparation: '02:00', arrivee: '03:00', fin: '05:00', remise: '06:00' }), [], 'à 2 h pile, la salle est rendue');
  /* Le samedi midi : un repas dont la remise en état déborde sur la préparation du soir. */
  assert.deepEqual(essai(SAMEDI, { preparation: '10:00', arrivee: '12:00', fin: '16:30', remise: '17:30' }), ['reception'], 'la remise en état croise la préparation');
  assert.deepEqual(essai(SAMEDI, { preparation: '10:00', arrivee: '12:00', fin: '16:00', remise: '17:00' }), [], 'rendue à 17 h, quand l\'autre commence');
  /* Le vendredi soir jusqu'à 3 h du matin : la soirée finit avant la préparation du samedi. */
  assert.deepEqual(essai('2026-12-11', { preparation: '18:00', arrivee: '20:00', fin: '02:00', remise: '03:00' }), []);
  assert.deepEqual(essai('2026-12-12', { preparation: '18:00', arrivee: '20:00', fin: '02:00' }), ['incomplet']); assert.deepEqual(conflits(ctx(), S, SALLE, null, { jour: '', horaires: {}, espaces: [] }).bloquants.map((b) => b.type), ['incomplet', 'incomplet']);
  /* La saison et la capacité. */
  const c = conflits(ctx(), S, SALLE, null, { jour: SAMEDI, horaires: HOR, espaces: ['terrasse'], invites: 30 }); assert.deepEqual(c.bloquants.map((b) => b.type), ['saison']); assert.match(c.attentions[0], /Capacité à renseigner : La terrasse/, 'la page Réceptions donne une surface, pas un nombre de places : rien n\'est inventé');
  assert.deepEqual(conflits(ctx(), {}, SALLE, null, { jour: SAMEDI, horaires: HOR, espaces: ['coin-feu'], invites: 9 }).bloquants.map((b) => b.type), ['capacite'], 'huit places au coin du feu sur le plan');
  assert.deepEqual(conflits(ctx(), {}, SALLE, null, { jour: SAMEDI, horaires: HOR, espaces: ['coin-feu', 'grande-table'], invites: 18 }).bloquants, []);
  assert.deepEqual([ressources(LIEUX, SALLE, ['restaurant', 'coin-feu']).capacite, ressources(LIEUX, SALLE, ['salle-reception']).capacite, ressources(LIEUX, SALLE, ['piscine']).capacite], [100, 220, null], 'une zone et sa salle ne comptent pas deux fois ; une capacité inconnue reste inconnue');
  assert.match(conflits(ctx(), {}, SALLE, null, { jour: '2027-06-12', horaires: HOR, espaces: ['piscine'], invites: 300 }).attentions[0], /Capacité à renseigner : La piscine/);
});

test('8 · les réservations du restaurant déjà prises sont vues, table par table, et un replacement est proposé sans rien changer', () => {
  const pris = avecResas([[resa('r1', SAMEDI, '20:00', 8, '7', 'Famille Weber'), '7'], [resa('r2', SAMEDI, '19:30', 2, '1', 'Aurélie et Marc'), '1'], [resa('r3', SAMEDI, '20:30', 4, '4', 'Rose S.'), '4'], [resa('r4', SAMEDI, '12:30', 4, '2', 'Déjeuner'), '2'], [resa('r5', ajouter(SAMEDI, 1), '12:30', 2, '3', 'Lendemain'), '3']]);
  let S = petit(creer(pris)); const d = dossierDe(S, ID), p = { jour: SAMEDI, horaires: HOR, espaces: ['coin-feu', 'grande-table'], invites: 18 };
  const c = conflits(ctx(), S, SALLE, d, p);
  assert.deepEqual(c.resas.map((x) => x.resa.id).sort(), ['r1', 'r2'], 'les réservations du soir sur les tables retenues ; ni celle d\'une autre table, ni le midi, ni le lendemain');
  assert.match(c.bloquants.find((b) => /Weber/.test(b.texte)).texte, /Table 7 : Famille Weber, samedi 12 décembre, le soir à 20 h, 8 couverts\./);
  assert.match(option(S, { espaces: p.espaces }).refus, /Table (1|7)/, 'l\'option est refusée tant que des réservations occupent ces tables');
  /* Une préparation qui commence pendant le service du midi prend aussi ses réservations. */
  assert.ok(conflits(ctx(), S, SALLE, d, { ...p, horaires: { ...HOR, preparation: '14:00' } }).resas.some((x) => x.resa.id === 'r4'), 'la durée du service du midi compte, pas seulement l\'heure d\'arrivée');
  /* Le replacement : un aperçu. */
  const rep = replacement(ctx(), S, SALLE, d, p), avant = JSON.stringify(S);
  assert.deepEqual(rep.propositions.map((x) => [x.resa.id, x.vers]).sort(), [['r1', '8+9'], ['r2', '6']]); assert.equal(rep.sansSolution.length, 0); assert.equal(JSON.stringify(S), avant, 'l\'aperçu ne change rien');
  for (const x of rep.propositions) S = ok(S, 'placerResa', { id: x.resa.id, table: x.vers });
  assert.deepEqual(conflits(ctx(), S, SALLE, d, p).bloquants, [], 'une fois les réservations déplacées, par une action explicite, l\'option devient possible');
  S = option(S, { espaces: p.espaces }).S; assert.equal(etatRetenue(dossierDe(S, ID), ctx().maintenant).etat, 'option');
  /* Toute la salle : les réservations sans table n'ont plus où aller. */
  const sansTable = creer(avecResas([[resa('r9', SAMEDI, '20:00', 2, '', 'Sans table'), '']]));
  assert.match(conflits(ctx(), sansTable, SALLE, dossierDe(sansTable, ID), { jour: SAMEDI, horaires: HOR, espaces: ['restaurant'], invites: 30 }).bloquants[0].texte, /1 réservation sans table.*aucune table/);
  assert.match(conflits(ctx(), sansTable, SALLE, dossierDe(sansTable, ID), p).attentions.join(' '), /1 réservation sans table.*il restera 20 places/);
});

/* ============================== Le client ============================== */
test('10 · l\'accord du client désigne une version et ne confirme rien : la confirmation revérifie les espaces', () => {
  let S = ok(option(proposition(creer())).S, 'recPresenter', { id: ID, le: '2026-11-20T10:05' });
  const sans = ctx(); assert.match(agir(S, 'recRetenir', argsRetenue(sans, SALLE, dossierDe(S, ID), { type: 'ferme', jour: SAMEDI, horaires: HOR, espaces: ['restaurant'], le: sans.maintenant }), sans).refus, /n'a pas donné son accord sur la version 1/);
  const avec = ctx({ venues: { [ID]: { accord: { version: 1, le: '2026-11-21T09:00' } } } }), d = dossierDe(S, ID);
  assert.deepEqual(accordDe(d, avec.venues[ID]), { version: 1, le: '2026-11-21T09:00', par: 'client' }); assert.equal(etapeDe(d, avec.venues[ID], avec.maintenant).libelle, 'Accord du client — simulation (version 1)');
  assert.equal(etatRetenue(d, avec.maintenant).etat, 'option', 'l\'accord ne change pas la retenue'); assert.equal(vueClient(avec, d, avec.venues[ID]).etape.libelle, 'À confirmer par l\'équipe');
  /* Entre-temps l'option a expiré et un autre dossier a pris la salle : l'accord ne passe pas en force. */
  const tard = { ...a('2026-11-28', '09:00'), venues: avec.venues }; let T = creer(S, normaliser({ ...DEM.brut, id: 'dem-2', prenom: 'Omar', nom: 'T.', telephone: '06 55 44 33 22' }), tard);
  T = ok(T, 'recRetenir', argsRetenue(tard, SALLE, dossierDe(T, idDossier('dem-2')), { type: 'option', jour: SAMEDI, horaires: HOR, espaces: ['restaurant'], echeance: '2026-12-05T18:00', le: tard.maintenant }), tard);
  const refus = agir(T, 'recRetenir', argsRetenue(tard, SALLE, dossierDe(T, ID), { type: 'ferme', jour: SAMEDI, horaires: HOR, espaces: ['restaurant'], le: tard.maintenant }), tard);
  assert.match(refus.refus, /La salle du restaurant : déjà retenu par une option/); assert.equal(dossierDe(refus.S, ID).retenue.etat, 'option'); assert.equal(etapeDe(dossierDe(refus.S, ID), tard.venues[ID], tard.maintenant).id, 'accord', 'toujours « à confirmer »');
  /* Un accord sur une ancienne version ne vaut plus quand une nouvelle a été présentée. */
  let N = ok(ok(ok(S, 'recNouvelleVersion', { id: ID, le: 'x' }), 'recProposition', { id: ID, proposition: { lignes: [{ id: 'l1', libelle: 'Menu', qte: 30, pu: 50 }] } }), 'recPresenter', { id: ID, le: '2026-11-22T09:00' });
  assert.equal(accordDe(dossierDe(N, ID), avec.venues[ID]), null); assert.match(agir(N, 'recRetenir', argsRetenue(avec, SALLE, dossierDe(N, ID), { type: 'ferme', jour: SAMEDI, horaires: HOR, espaces: ['restaurant'], le: avec.maintenant }), avec).refus, /version 2/);
  /* Quand tout est cohérent : la confirmation réserve, et l'écran peut dire « Réception confirmée ». */
  S = ok(S, 'recRetenir', argsRetenue(avec, SALLE, d, { type: 'ferme', jour: SAMEDI, horaires: HOR, espaces: ['restaurant'], le: avec.maintenant }), avec);
  assert.deepEqual([dossierDe(S, ID).retenue.etat, etapeDe(dossierDe(S, ID), avec.venues[ID], avec.maintenant).libelle], ['ferme', 'Réception confirmée']);
  assert.equal(retenueActive(dossierDe(S, ID).retenue, '2027-01-01T00:00'), true, 'une réception confirmée n\'expire pas');
  assert.equal(agir(ok(S, 'recLiberer', { id: ID, raison: 'annulation du client', le: 'x' }), 'recLiberer', { id: ID, raison: 'x' }).refus, 'Aucun espace n\'est retenu pour ce dossier.');
});

test('11 · une demande de changement garde l\'accord précédent jusqu\'à la décision ; l\'équipe en voit les conséquences', () => {
  const v = (plus) => ({ [ID]: { accord: { version: 1, le: '2026-11-21T09:00' }, ...plus } });
  let S = ok(option(proposition(creer())).S, 'recPresenter', { id: ID, le: '2026-11-20T10:05' });
  S = ok(S, 'recRetenir', argsRetenue(ctx({ venues: v({}) }), SALLE, dossierDe(S, ID), { type: 'ferme', jour: SAMEDI, horaires: HOR, espaces: ['restaurant'], le: ctx().maintenant }), ctx({ venues: v({}) }));
  const avant = structuredClone(dossierDe(S, ID));
  assert.equal(refusChangement(avant, 'effectif', { invites: 30 }), 'C\'est déjà le nombre d\'invités prévu.'); assert.equal(refusChangement(avant, 'effectif', { invites: 120 }), ''); assert.match(refusChangement(avant, 'horaire', {}), /heure/);
  const trop = { id: 'c1', type: 'effectif', valeur: { invites: 120 }, le: '2026-11-22T10:00' }, c = ctx({ venues: v({ changements: [trop] }) });
  assert.deepEqual(dossierDe(S, ID), avant, 'la demande seule ne change rien au dossier');
  assert.equal(vueClient(c, dossierDe(S, ID), c.venues[ID]).convenu.find(([k]) => k === 'Invités')[1], '30 (annoncés)', 'le client voit toujours ce qui est convenu');
  assert.deepEqual(prioritesReceptions(c, S).map((x) => x.genre), ['client']); assert.equal(resume(c, dossierDe(S, ID)).attention, 'Le client demande un changement');
  const cons = consequences(c, S, SALLE, dossierDe(S, ID), trop); assert.match(cons.lignes.join(' '), /Invités : 30 → 120\..*Capacité des espaces retenus : 100\. Elle serait dépassée\./); assert.equal(cons.bloquants[0].type, 'capacite');
  const non = agir(S, 'recDecider', { id: ID, changement: 'c1', type: 'effectif', valeur: trop.valeur, acceptee: true, le: c.maintenant }, c);
  assert.match(non.refus, /capacité de 100.*la situation actuelle est gardée/); assert.deepEqual(dossierDe(non.S, ID), avant);
  /* Refuser : l'accord et la réception restent ce qu'ils étaient. */
  let Rf = ok(S, 'recDecider', { id: ID, changement: 'c1', type: 'effectif', valeur: trop.valeur, acceptee: false, texte: 'La salle reçoit 100 personnes.', le: c.maintenant }, c);
  assert.deepEqual([dossierDe(Rf, ID).projet.invitesConfirmes, dossierDe(Rf, ID).retenue.etat, accordDe(dossierDe(Rf, ID), c.venues[ID]).version], [0, 'ferme', 1]);
  assert.equal(vueClient(c, dossierDe(Rf, ID), c.venues[ID]).changements[0].decision.acceptee, false); assert.match(agir(Rf, 'recDecider', { id: ID, changement: 'c1', acceptee: true }, c).refus, /déjà reçu une réponse/);
  /* Accepter un effectif possible : l'effectif confirmé change, la proposition est marquée « à revoir », la réception reste confirmée. */
  const ok40 = { id: 'c2', type: 'effectif', valeur: { invites: 40 }, le: '2026-11-22T11:00' }, c2 = ctx({ venues: v({ changements: [ok40] }) });
  let Ac = ok(S, 'recDecider', { id: ID, changement: 'c2', type: 'effectif', valeur: ok40.valeur, acceptee: true, le: c2.maintenant }, c2);
  assert.deepEqual([dossierDe(Ac, ID).projet.invitesConfirmes, dossierDe(Ac, ID).retenue.etat], [40, 'ferme']); assert.match(dossierDe(Ac, ID).aRevoir, /proposition version 1 est à revoir/); assert.deepEqual(couranteDe(dossierDe(Ac, ID)), couranteDe(avant), 'la version présentée n\'est pas réécrite');
  /* Accepter un nouvel horaire : la période occupée suit, après vérification. */
  const plusTot = { id: 'c3', type: 'horaire', valeur: { arrivee: '18:00' }, le: '2026-11-22T12:00' }, c3 = ctx({ venues: v({ changements: [plusTot] }) }), k = consequences(c3, S, SALLE, dossierDe(S, ID), plusTot);
  assert.match(k.lignes[0], /du samedi 12 décembre à 17 h au dimanche 13 décembre à 2 h → du samedi 12 décembre à 16 h au dimanche 13 décembre à 2 h/); assert.equal(k.retenue.debut, '2026-12-12T16:00');
  Ac = ok(S, 'recDecider', { id: ID, changement: 'c3', type: 'horaire', valeur: plusTot.valeur, acceptee: true, retenue: k.retenue, le: c3.maintenant }, c3);
  assert.deepEqual([dossierDe(Ac, ID).retenue.debut, dossierDe(Ac, ID).retenue.etat, dossierDe(Ac, ID).horaires.arrivee, dossierDe(Ac, ID).horaires.preparation], ['2026-12-12T16:00', 'ferme', '18:00', '16:00']);
});

test('12 · les notes internes n\'apparaissent ni dans la vue du client ni dans sa proposition', () => {
  let S = ok(proposition(creer()), 'recPresenter', { id: ID, le: 'x' });
  S = ok(S, 'recModifier', { id: ID, champs: { suivi: { notes: 'SECRET-INTERNE budget serré, rappeler le beau-frère', partage: 'Parking sur place.' }, responsable: 'Régis' }, le: 'x', quoi: 'Note HISTORIQUE-INTERNE' });
  S = creer(S, normaliser({ ...DEM.brut, id: 'dem-2', prenom: 'Omar', nom: 'AUTRE-DOSSIER', telephone: '06 55 44 33 22' }));
  const vue = JSON.stringify(vueClient(ctx(), dossierDe(S, ID), {}));
  for (const interdit of ['SECRET-INTERNE', 'HISTORIQUE-INTERNE', 'AUTRE-DOSSIER', 'Régis', 'historique', '"notes"']) assert.ok(!vue.includes(interdit), `« ${interdit} » ne doit pas sortir`);
  assert.ok(vue.includes('Parking sur place.'), 'ce qui est partageable sort'); assert.equal(vueClient(ctx(), dossierDe(S, ID), {}).proposition.v, 1);
  assert.equal(vueClient(ctx(), dossierDe(proposition(creer()), ID), {}).proposition, null, 'un brouillon n\'est pas montré au client');
  assert.match(lienReception(dossierDe(S, ID)), /^\/votre-reception\?d=rec-dem-1&c=[a-z0-9]{6}$/); assert.notEqual(codeReception(ID, '0611223344'), codeReception('rec-dem-2', '0611223344'));
});

/* ============================== Le jour J ============================== */
test('le jour J · la fiche relit le dossier et dit ce qui manque ; les tâches habituelles ne se doublent pas', () => {
  let S = ok(option(proposition(creer())).S, 'recPresenter', { id: ID, le: 'x' }); const d = dossierDe(S, ID);
  const f = fichePreparation(ctx(), d, {}, []); assert.deepEqual(f.sections.map((s) => s.titre), ['La réception', 'Les espaces', 'Les horaires', 'Les prestations', 'Les personnes', 'À savoir']);
  assert.deepEqual(f.sections.flatMap((s) => s.lignes).filter((l) => l.manque).map((l) => l.label), ['Invités confirmés', 'Configuration', 'Pour la cuisine', 'Pour l\'accueil']); assert.equal(f.manques, 4);
  assert.match(f.sections[0].lignes.at(-1).valeur, /Version 1 · Les 60 ans de Paul · 1 350 € \(montants d'exemple\) · sans accord/); assert.match(f.sections[2].lignes.find((l) => l.label === 'Fin de la réception').valeur, /1 h \(le lendemain\)/);
  const t = tachesHabituelles(LIEUX, d, 'x'); assert.equal(t.length, 6); assert.deepEqual([t[0].echeance, t[0].lien], ['2026-12-05', { type: 'reception', id: ID, libelle: 'Anniversaire · Nadia K.' }]);
  for (const x of [...t, ...t]) S = appliquer(S, 'tacheAjouter', { tache: x }); assert.equal(S.taches.liste.length, 6, 'ajoutées deux fois : six tâches, pas douze');
});

/* ============================== Ajustement v7.11.1 : le téléphone partagé ============================== */
test('15 · un téléphone partagé par deux clients ne donne les anciennes notes à aucun des deux : elles restent « à vérifier »', () => {
  const tel = '06 12 34 56 78', S = { clients: { 't:+33612345678': { allergies: ['Arachides'], note: 'Table au calme', habitue: true } } };
  const lea = { id: 'r1', nom: 'Léa Martin', telephone: tel, clientId: 'cl_1' }, tom = { id: 'r2', nom: 'Tom Martin', telephone: tel, clientId: 'cl_2' };
  /* Un seul client connu sous ce numéro : il garde ses anciennes notes (comportement d'avant, inchangé). */
  assert.deepEqual(marques(S, lea).allergies, ['Arachides']); assert.deepEqual(marques(S, lea, telephonesPartages([lea])).allergies, ['Arachides']);
  const partages = telephonesPartages([lea], [tom]); assert.deepEqual([...partages], ['+33612345678']);
  assert.deepEqual(telephonesPartages([lea, { ...lea, id: 'r3' }]).size, 0, 'deux réservations du même client ne font pas un partage'); assert.equal(telephonesPartages([{ nom: 'Sans identifiant', telephone: tel }, lea]).size, 0);
  for (const r of [lea, tom]) { const m = marques(S, r, partages); assert.deepEqual([m.habitue, m.allergies, m.note], [false, [], ''], `${r.nom} ne reçoit pas la note d'office`); }
  assert.notEqual(cleClient(lea), cleClient(tom), 'les identités restent distinctes');
  /* La note est gardée, et proposée « à vérifier » sur chacune des deux fiches. */
  for (const r of [lea, tom]) { const v = notesTelephonePartage(S, cleClient(r), tel, partages); assert.deepEqual([v.cle, v.motif, v.allergies, v.note], ['t:+33612345678', 'partage', ['Arachides'], 'Table au calme']); }
  assert.equal(notesTelephonePartage(S, 'c:cl_1', tel, new Set()), null, 'sans partage : rien à vérifier');
  /* Les notes propres à un client passent d'abord. */
  const S2 = { clients: { ...S.clients, 'c:cl_2': { allergies: ['Gluten'] } } }; assert.deepEqual(marques(S2, tom, partages).allergies, ['Gluten']); assert.deepEqual(marques(S2, lea, partages).allergies, []);
  /* Le rattachement explicite : la note va à celui que l'équipe désigne, et à lui seul. */
  const S3 = appliquer(S, 'rattacherNotes', { de: 't:+33612345678', vers: 'c:cl_1' });
  assert.deepEqual(marques(S3, lea, partages).allergies, ['Arachides']); assert.deepEqual(marques(S3, tom, partages).allergies, []); assert.equal(notesTelephonePartage(S3, 'c:cl_2', tel, partages), null);
  /* Les deux personnes dans des dossiers de réception différents : le partage est vu aussi. */
  const dossiers = { receptions: { dossiers: { a: { id: 'a', client: { nom: 'Léa Martin', telephone: tel, clientId: 'cl_1' } }, b: { id: 'b', client: { nom: 'Tom Martin', telephone: '+33 6 12 34 56 78', clientId: 'cl_2' } } } }, ...S };
  const vus = partagesConnus(ctx(), dossiers, []); assert.deepEqual([...vus], ['+33612345678']);
  const f = fiche({ ...ctx(), partages: vus }, dossiers, 'c:cl_1'); assert.deepEqual(f.allergies, []); assert.deepEqual(f.aVerifier.map((x) => x.motif), ['partage']);
  /* La migration des anciens formats de téléphone n'est pas touchée. */
  const M = appliquer({ clients: { t0612345678: { note: 'Ancienne' } } }, 'migrerClients', {}); assert.deepEqual(Object.keys(M.clients), ['t:+33612345678']);
});

/* ============================== Le cinquième scénario : « Une réception aux Jardins » ============================== */
import { SCENARIOS, depart, avancement, sauts, prochainMercredi, samedisDeReception } from '../../assets/js/espace-scenarios.js';
import { demandes as demandesDe } from '../../assets/js/espace-demandes.js';
import { tachesLiees } from '../../assets/js/espace-taches.js';
import { maintenant as maintenantHoraires } from '../../assets/js/modules/horaires-ouvert-maintenant/horaires-calcul.js';

const CFG = { lieux: LIEUX, salle: SALLE }, ID5 = idDossier('sc5-demande');
/* Le contexte du scénario : son jour, son heure, ses demandes, aucun exemple habituel. */
const c5 = (d, venues = {}, quand = d.horloge) => ({ R, auj: quand.iso, minute: quand.min, maintenant: `${quand.iso}T${String(Math.floor(quand.min / 60)).padStart(2, '0')}:${String(quand.min % 60).padStart(2, '0')}:00`, site: [], demandes: d.demandes, exceptions: [], scenario: 'reception', demandesDemo: false, lieux: LIEUX, venues });
const ou = (d, S, plus = {}) => avancement('reception', { S, venues: {}, vus: {}, iso: d.horloge.iso, lieux: LIEUX, ...plus });
/* Le parcours principal jusqu'à l'option posée. */
function jusquaLOption(d) {
  const c = c5(d), [, s2] = samedisDeReception(R, d.horloge.iso); let S = d.etat;
  const dem = demandesDe(c, S).find((x) => x.id === 'sc5-demande'); S = ok(S, 'recCreer', { dossier: dossierDepuisDemande(dem, { cree: c.maintenant, lieux: LIEUX }) }, c);
  S = ok(S, 'recProposition', { id: ID5, proposition: { titre: 'Les 40 ans de Julie', lignes: [{ id: 'l1', libelle: 'Menu de groupe, trois plats', qte: 40, pu: 45, unite: 'par personne', exemple: true }] }, le: c.maintenant }, c);
  S = ok(S, 'recPresenter', { id: ID5, le: c.maintenant }, c);
  const args = argsRetenue(c, SALLE, dossierDe(S, ID5), { type: 'option', jour: s2, horaires: { arrivee: '19:00', fin: '01:00' }, espaces: ['restaurant'], echeance: echeanceParDefaut(c.maintenant, s2, LIEUX.durees), le: c.maintenant });
  return { S: ok(S, 'recRetenir', args, c), c, s2, args };
}

test('scénario 5 · il part toujours du même point : un mercredi à 10 h, une demande, un mariage déjà confirmé le samedi d\'avant', () => {
  assert.equal(SCENARIOS.length, 5); assert.equal(SCENARIOS[4].titre, 'Une réception aux Jardins');
  for (const reel of ['2026-11-21', '2026-11-25', '2026-12-31', '2027-05-30']) {
    const d = depart('reception', R, reel, CFG); assert.deepEqual(d, depart('reception', R, reel, CFG), 'deux lancements : le même départ');
    assert.ok(d.horloge.iso >= reel && new Date(`${d.horloge.iso}T12:00:00Z`).getUTCDay() === 3 && d.horloge.min === 600, 'un mercredi à 10 h, jamais dans le passé');
    const [s1, s2] = samedisDeReception(R, d.horloge.iso); assert.deepEqual([new Date(`${s1}T12:00:00Z`).getUTCDay(), s2, s1 >= ajouter(d.horloge.iso, 17)], [6, ajouter(s1, 7), true]);
    assert.deepEqual(d.demandes.map((x) => [x.id, x.date, x.source]), [['sc5-demande', s2, 'demo'], ['sc5-mariage', s1, 'demo']], 'des demandes fictives, marquées comme telles');
    const m = dossierDe(d.etat, idDossier('sc5-mariage')); assert.deepEqual([m.retenue.etat, m.jour, m.retenue.salle, m.retenue.tables.length, m.courante, m.source], ['ferme', s1, true, 9, 1, 'demo']);
    const a = ou(d, d.etat); assert.deepEqual([a.faites, a.etapes.length, a.fini, a.conclusion], [0, 7, false, '']);
    assert.deepEqual(demandesDe(c5(d), d.etat).map((x) => x.id).sort(), ['sc5-demande', 'sc5-mariage'], 'les exemples habituels ne s\'y mêlent pas');
    assert.ok(sauts('reception', { S: d.etat, iso: d.horloge.iso, min: 600 }).every((x) => !x.cible && x.raison), 'aucun saut tant qu\'il n\'y a ni option ni date');
  }
  assert.equal(prochainMercredi('2026-11-25'), '2026-11-25'); assert.equal(prochainMercredi('2026-11-26'), '2026-12-02');
});

test('scénario 5 · le parcours principal : chaque étape suit une action réelle, jusqu\'à la fiche du jour J', () => {
  const d = depart('reception', R, '2026-11-21', CFG), { S: opt, c, s2 } = jusquaLOption(d); let S = opt;
  assert.equal(ou(d, S).faites, 3); assert.equal(etatRetenue(dossierDe(S, ID5), c.maintenant).etat, 'option');
  /* L'agenda et la page Réserver reflètent l'option : la salle est retenue ce soir-là. */
  assert.deepEqual(receptionsDuJour(c, S, s2).map((x) => [x.type, x.dossier]), [['option', ID5]]); assert.equal(etatService(R, s2, 'soir', equipeDe(S, [], c.maintenant)).prive, true);
  assert.equal(planDuService(c, S, SALLE, s2, 'soir').tables.filter((t) => t.reception && !t.horsSaison).length, 9);
  /* L'accord du client (simulation), puis la confirmation par l'équipe. */
  const venues = { [ID5]: { accord: { version: 1, le: c.maintenant.slice(0, 16) } } }, cv = c5(d, venues);
  assert.equal(ou(d, S, { venues }).faites, 4); assert.equal(ou(d, S, { venues }).prochaine.id, 'confirmer'); assert.equal(dossierDe(S, ID5).retenue.etat, 'option', 'l\'accord ne confirme rien');
  S = ok(S, 'recRetenir', argsRetenue(cv, SALLE, dossierDe(S, ID5), { type: 'ferme', jour: s2, horaires: dossierDe(S, ID5).horaires, espaces: ['restaurant'], le: cv.maintenant }), cv);
  assert.equal(ou(d, S, { venues }).faites, 5);
  for (const t of tachesHabituelles(LIEUX, dossierDe(S, ID5), cv.maintenant)) S = appliquer(S, 'tacheAjouter', { tache: t });
  assert.equal(ou(d, S, { venues }).faites, 5, 'les tâches seules ne suffisent pas'); S = ok(S, 'recModifier', { id: ID5, champs: { jourJ: { cuisine: 'Menu arrêté.' } } }, cv);
  assert.equal(ou(d, S, { venues }).faites, 6); assert.equal(ou(d, S, { venues }).fini, false);
  const fin = ou(d, S, { venues, vus: { 'rec-fiche': true } }); assert.equal(fin.fini, true);
  assert.match(fin.conclusion, /réception confirmée : La salle du restaurant, du samedi .* à 17 h au dimanche .* à 2 h\..*page Réserver n'ouvre plus ce soir-là.*\(6 tâches, dont 0 faite\)\. Rien n'a été envoyé, signé ni encaissé\./);
  assert.equal(tachesLiees(S, 'reception', ID5).length, 6); assert.equal(fichePreparation(cv, dossierDe(S, ID5), venues[ID5], tachesLiees(S, 'reception', ID5)).sections[5].lignes.find((l) => l.label === 'Pour la cuisine').valeur, 'Menu arrêté.');
});

test('scénario 5 · variante « un conflit » : le samedi d\'avant est pris, le problème se voit avant de valider, une autre solution existe', () => {
  const d = depart('reception', R, '2026-11-21', CFG), c = c5(d), [s1, s2] = samedisDeReception(R, d.horloge.iso);
  let S = ok(d.etat, 'recCreer', { dossier: dossierDepuisDemande(demandesDe(c, d.etat).find((x) => x.id === 'sc5-demande'), { cree: c.maintenant, lieux: LIEUX }) }, c);
  const p = (jour, espaces) => ({ jour, horaires: completerHoraires({ arrivee: '19:00', fin: '01:00' }, LIEUX.durees), espaces, invites: 40 }), vu = conflits(c, S, SALLE, dossierDe(S, ID5), p(s1, ['restaurant']));
  assert.deepEqual(vu.bloquants.map((b) => b.type), ['reception']); assert.match(vu.bloquants[0].texte, /La salle du restaurant : déjà réservé du samedi .* à 16 h au dimanche .* à 3 h pour « Mariage · Camille et Hugo »\./);
  const avant = structuredClone(S), refus = agir(S, 'recRetenir', argsRetenue(c, SALLE, dossierDe(S, ID5), { type: 'option', jour: s1, horaires: { arrivee: '19:00', fin: '01:00' }, espaces: ['restaurant'], echeance: echeanceParDefaut(c.maintenant, s1, LIEUX.durees), le: c.maintenant }), c);
  assert.match(refus.refus, /Mariage · Camille et Hugo/); assert.deepEqual(refus.S, avant, 'le dossier est gardé tel quel');
  assert.deepEqual(conflits(c, S, SALLE, dossierDe(S, ID5), p(s1, ['salle-reception'])).bloquants, [], 'un autre espace, libre ce jour-là'); assert.deepEqual(conflits(c, S, SALLE, dossierDe(S, ID5), p(s2, ['restaurant'])).bloquants, [], 'ou le samedi demandé');
  assert.deepEqual(conflits(c, S, SALLE, dossierDe(S, ID5), p(s1, ['coin-feu'])).bloquants.map((b) => b.type), ['capacite', 'reception'], 'une partie de la salle déjà réservée est prise aussi');
});

test('scénario 5 · variante « une option qui expire » : l\'horloge libère les espaces, sans rien décider à la place de l\'équipe', () => {
  const d = depart('reception', R, '2026-11-21', CFG), { S, c, s2, args } = jusquaLOption(d);
  const l = sauts('reception', { S, iso: d.horloge.iso, min: d.horloge.min }), ech = l.find((x) => x.cle === 'echeance');
  assert.deepEqual(l.map((x) => [x.cle, !!x.cible]), [['echeance', true], ['veille', true], ['jourj', true]]); assert.deepEqual(ech.cible, { iso: ajouter(d.horloge.iso, 7), min: 18 * 60 });
  assert.deepEqual(l.find((x) => x.cle === 'veille').cible, { iso: ajouter(s2, -1), min: 600 }); assert.deepEqual(l.find((x) => x.cle === 'jourj').cible, { iso: s2, min: 17 * 60 });
  /* À l'échéance : seule l'heure a changé. L'état est identique ; ce qu'on en déduit ne l'est plus. */
  const tard = c5(d, {}, ech.cible), d5 = dossierDe(S, ID5);
  assert.equal(etatRetenue(d5, tard.maintenant).etat, 'expiree'); assert.equal(planDuService(tard, S, SALLE, s2, 'soir').tables.filter((t) => t.reception).length, 0); assert.equal(etatService(R, s2, 'soir', equipeDe(S, [], tard.maintenant)).prive, false);
  assert.deepEqual(receptionsDuJour(tard, S, s2), [], 'l\'agenda ne montre plus l\'option'); assert.equal(etapeDe(d5, {}, tard.maintenant).id, 'presentee', 'la proposition n\'est ni acceptée ni refusée');
  assert.equal(d5.cloture, null); assert.equal(resume(tard, d5).phase, 'decision'); assert.equal(resume(tard, d5).attention, 'Option expirée : les espaces sont libres');
  assert.equal(ou(d, S, { iso: tard.auj }).etapes.find((e) => e.id === 'option').fait, true, 'l\'étape faite reste faite : l\'option a bien été posée');
  assert.deepEqual(sauts('reception', { S, iso: tard.auj, min: tard.minute }).find((x) => x.cle === 'echeance'), { cle: 'echeance', libelle: 'Aller à l\'échéance de l\'option', cible: null, raison: 'L\'option a déjà expiré.' });
  /* Reposer l'option : l'ancienne échéance est refusée, une nouvelle est revérifiée. */
  assert.match(agir(S, 'recRetenir', { ...args, le: tard.maintenant }, tard).refus, /à venir/);
  const encore = agir(S, 'recRetenir', { ...args, echeance: echeanceParDefaut(tard.maintenant, s2, LIEUX.durees), le: tard.maintenant }, tard); assert.equal(encore.refus, ''); assert.equal(etatRetenue(dossierDe(encore.S, ID5), tard.maintenant).etat, 'option');
  /* Au jour J sans confirmation : rien n'a été confirmé ni coché tout seul. */
  const jj = c5(d, {}, l.find((x) => x.cle === 'jourj').cible); assert.equal(dossierDe(S, ID5).retenue.etat, 'option'); assert.equal(etapeDe(d5, {}, jj.maintenant).id, 'presentee'); assert.equal((S.taches?.liste || []).length, 0);
});

test('scénario 5 · variante « le client change ses plans » : 120 invités ne tiennent pas, 60 oui ; l\'accord précédent est gardé jusqu\'à la décision', () => {
  const d = depart('reception', R, '2026-11-21', CFG), { S: opt, c, s2 } = jusquaLOption(d), accord = { version: 1, le: c.maintenant.slice(0, 16) };
  let S = ok(opt, 'recRetenir', argsRetenue(c5(d, { [ID5]: { accord } }), SALLE, dossierDe(opt, ID5), { type: 'ferme', jour: s2, horaires: dossierDe(opt, ID5).horaires, espaces: ['restaurant'], le: c.maintenant }), c5(d, { [ID5]: { accord } }));
  const trop = { id: 'c1', type: 'effectif', valeur: { invites: 120 }, le: c.maintenant.slice(0, 16) }, bien = { id: 'c2', type: 'effectif', valeur: { invites: 60 }, le: c.maintenant.slice(0, 16) }, cv = c5(d, { [ID5]: { accord, changements: [trop, bien] } });
  assert.match(agir(S, 'recDecider', { id: ID5, changement: 'c1', type: 'effectif', valeur: trop.valeur, acceptee: true, le: cv.maintenant }, cv).refus, /120 invités pour une capacité de 100/);
  S = ok(S, 'recDecider', { id: ID5, changement: 'c1', type: 'effectif', valeur: trop.valeur, acceptee: false, le: cv.maintenant }, cv); assert.deepEqual([dossierDe(S, ID5).projet.invitesConfirmes, dossierDe(S, ID5).retenue.etat], [0, 'ferme']);
  S = ok(S, 'recDecider', { id: ID5, changement: 'c2', type: 'effectif', valeur: bien.valeur, acceptee: true, le: cv.maintenant }, cv);
  assert.deepEqual([dossierDe(S, ID5).projet.invitesConfirmes, dossierDe(S, ID5).retenue.etat, accordDe(dossierDe(S, ID5), cv.venues[ID5]).version], [60, 'ferme', 1]); assert.match(dossierDe(S, ID5).aRevoir, /à revoir/);
  assert.deepEqual(vueClient(cv, dossierDe(S, ID5), cv.venues[ID5]).changements.map((x) => x.decision.acceptee), [false, true]);
});

/* ============================== Ajustement v7.11.1 : une même horloge pour le scénario et ses pages publiques ============================== */
test('B · le calcul d\'ouverture des pages publiques suit l\'horloge du scénario, et l\'heure réelle en dehors', () => {
  const vendredi = new Date('2026-11-20T19:30:00+01:00');
  assert.deepEqual(maintenantHoraires('Europe/Paris', vendredi), { iso: '2026-11-20', min: 19 * 60 + 30, fuseau: 'Europe/Paris' }, 'hors scénario : l\'instant réel');
  globalThis.__jhHorloge = () => ({ iso: '2027-06-12', min: 17 * 60 });
  try { assert.deepEqual(maintenantHoraires('Europe/Paris', vendredi), { iso: '2027-06-12', min: 17 * 60, fuseau: 'Europe/Paris' }, 'dans un scénario : son jour et son heure, même si un instant est passé');
    globalThis.__jhHorloge = () => null; assert.equal(maintenantHoraires('Europe/Paris', vendredi).iso, '2026-11-20', 'un scénario sans horloge : l\'heure réelle'); } finally { delete globalThis.__jhHorloge; }
  assert.equal(maintenantHoraires('Europe/Paris', vendredi).iso, '2026-11-20');
});
