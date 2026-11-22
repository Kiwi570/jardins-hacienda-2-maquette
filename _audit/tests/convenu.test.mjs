/* v7.12.1, « Ce qui est convenu reste clair » : la proposition acceptée, la version en attente et les espaces réservés
   vivent côte à côte ; une version présentée garde son instantané ; un changement accepté laisse une révision due ;
   la fiche du jour J dit ce qui est confirmé et ce qui attend ; l'occupation suit la durée réelle des repas, les
   horaires du jour et la réunion des zones retenues. Tout est joué avec des données fictives.
   Lancer : node --test _audit/tests/*.test.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { publier, occupationsActives, prisesDuService, etatService, equipeDe, faisabilite, fenetreService, retenueActive, dureeRepas } from '../../assets/js/disponibilites.js';
import { appliquer } from '../../assets/js/espace-donnees.js';
import { reglesAction } from '../../assets/js/espace-garde.js';
import { planDuService } from '../../assets/js/espace-salle.js';
import { dureeDe } from '../../assets/js/espace-service.js';
import { normaliser } from '../../assets/js/espace-demandes.js';
import { creerDepotServeur } from '../../assets/js/espace-serveur.js';
import { SCENARIOS, depart, avancement, samedisDeReception } from '../../assets/js/espace-scenarios.js';
import { demandes as demandesDe } from '../../assets/js/espace-demandes.js';
import { dossierDepuisDemande, idDossier, dossierDe, etapeDe, etatRetenue, accordDe, accordsDe, accepteeDe, commerceDe, revisionDe, contexteDe, contexteDit, couranteDe, brouillonDe, versionsDe,
  conflits, argsRetenue, consequences, fichePreparation, vueClient, resume, prochaineAction, prioritesReceptions, echeanceParDefaut } from '../../assets/js/espace-receptions.js';

globalThis.document ||= { visibilityState: 'visible' };
const lire = (f) => JSON.parse(readFileSync(new URL(`../../donnees/${f}`, import.meta.url), 'utf8'));
const SALLE = lire('salle.json'), LIEUX = lire('receptions.json'), R = publier(lire('reservation.json'), lire('horaires.json').adresses[0]).reservation;
/* Vendredi 20 novembre 2026, 10 h. Seules les réservations et les réceptions posées par le test existent. */
const AUJ = '2026-11-20', ctx = (plus = {}) => ({ R, auj: AUJ, minute: 10 * 60, maintenant: `${AUJ}T10:00:00`, site: [], demandes: [], exceptions: [], scenario: 'test', lieux: LIEUX, venues: {}, ...plus });
const a = (iso, hm, plus = {}) => ctx({ auj: iso, minute: +hm.slice(0, 2) * 60 + +hm.slice(3), maintenant: `${iso}T${hm}:00`, ...plus });
function agir(S, nom, args, c = ctx()) { const r = reglesAction(c, S, SALLE, nom, args); if (r.refus) return { S, refus: r.refus }; let e = appliquer(S, nom, args); for (const s of r.suites) e = appliquer(e, s.nom, s.args); return { S: e, refus: '' }; }
const ok = (S, nom, args, c) => { const r = agir(S, nom, args, c); assert.equal(r.refus, '', `${nom} devrait être possible`); return r.S; };
const dem = (id, invites = '40', plus = {}) => normaliser({ id, genre: 'reception', cree: '2026-11-18T09:00:00', occasion: 'Un anniversaire', date: '2026-12-12', invites, espace: 'La salle du restaurant', message: 'Les 40 ans de Julie.', prenom: 'Thomas', nom: 'B.', telephone: '06 11 22 33 44', source: 'demo', ...plus });
const creer = (S, d, c = ctx()) => ok(S, 'recCreer', { dossier: dossierDepuisDemande(d, { cree: c.maintenant, lieux: LIEUX }) }, c);
const ID = idDossier('dem-1'), SAMEDI = '2026-12-12', HOR = { preparation: '17:00', arrivee: '19:00', fin: '01:00', remise: '02:00' };
const menus = (n) => [{ id: 'l1', libelle: 'Menu de groupe, trois plats', qte: n, pu: 45, unite: 'par personne', exemple: true }];
const nb = (t) => String(t).replace(/[  ]/g, ' ');

/** Le parcours de la situation à reproduire : V1 (40 menus) présentée, acceptée, réception confirmée, 60 invités demandés puis acceptés. */
function jusquAuChangement() {
  let S = creer({}, dem('dem-1')), venues = {}; const c = (quand = '10:00') => a(AUJ, quand, { venues });
  S = ok(S, 'recProposition', { id: ID, proposition: { titre: 'Les 40 ans de Julie', presentation: 'Un dîner assis, puis une soirée.', lignes: menus(40), compris: 'Le service', conditions: '' }, le: c().maintenant }, c());
  S = ok(S, 'recPresenter', { id: ID, le: c('10:05').maintenant, espaces: ['La salle du restaurant'] }, c('10:05'));
  venues = { [ID]: { accord: { version: 1, le: `${AUJ}T10:10` }, accords: [{ version: 1, le: `${AUJ}T10:10` }] } };
  S = ok(S, 'recRetenir', argsRetenue(c('10:15'), SALLE, dossierDe(S, ID), { type: 'ferme', jour: SAMEDI, horaires: HOR, espaces: ['restaurant'], le: c('10:15').maintenant }), c('10:15'));
  const ch = { id: 'ch-60', le: `${AUJ}T10:20`, type: 'effectif', valeur: { invites: 60 } }; venues = { [ID]: { ...venues[ID], changements: [ch] } };
  const k = consequences(c('10:25'), S, SALLE, dossierDe(S, ID), ch);
  S = ok(S, 'recDecider', { id: ID, changement: ch.id, type: ch.type, valeur: ch.valeur, acceptee: true, retenue: k.retenue, le: c('10:25').maintenant }, c('10:25'));
  return { S, c, venues: () => venues, poser: (v) => { venues = { [ID]: { ...venues[ID], ...v } }; }, consequences: k };
}
/** La suite : une version 2 pour 60 menus, présentée. */
function jusquALaV2() {
  const x = jusquAuChangement(); let S = x.S;
  S = ok(S, 'recNouvelleVersion', { id: ID, le: x.c('10:30').maintenant }, x.c('10:30'));
  S = ok(S, 'recProposition', { id: ID, proposition: { lignes: menus(60) }, le: x.c('10:32').maintenant }, x.c('10:32'));
  S = ok(S, 'recPresenter', { id: ID, le: x.c('10:35').maintenant, espaces: ['La salle du restaurant'] }, x.c('10:35'));
  return { ...x, S };
}

/* ============================== Les propositions après la confirmation ============================== */
test('1 · une version présentée reste identique après une modification du dossier : prestations, total et ce qu\'elle affichait', () => {
  const { S, consequences: k } = jusquAuChangement(), d = dossierDe(S, ID), v1 = d.propositions[0];
  assert.deepEqual([d.projet.invitesConfirmes, v1.lignes[0].qte, v1.total], [60, 40, 1800], 'le dossier est passé à 60 ; la version 1 garde 40 menus et 1 800 €');
  assert.deepEqual(contexteDe(v1), { pour: 'Thomas B.', intitule: 'Anniversaire · Thomas B.', jour: SAMEDI, souhaitee: true, periode: '', invites: 40, confirmes: false, espaces: ['La salle du restaurant'], retenus: false });
  assert.equal(nb(contexteDit(contexteDe(v1))), 'Pour Thomas B. · Samedi 12 décembre 2026 (date souhaitée) · 40 invités annoncés', 'l\'en-tête du document relit l\'instantané, pas le dossier du jour');
  assert.match(k.lignes.join(' '), /Proposition version 1 \(acceptée\) : elle a été établie avant ce changement, pour 40.invités\. Elle ne sera pas réécrite/);
  /* Le dossier change encore : nom du client, intitulé, date. L'instantané ne bouge pas. */
  let T = ok(S, 'recModifier', { id: ID, champs: { client: { nom: 'Thomas Bernard' }, projet: { intitule: 'Les 40 ans de Julie (révisé)' } } });
  assert.deepEqual(contexteDe(dossierDe(T, ID).propositions[0]), contexteDe(v1)); assert.deepEqual(dossierDe(T, ID).propositions[0].lignes, v1.lignes);
  /* Une version 2 saisit le dossier tel qu'il est au moment où elle est présentée : 60 invités confirmés, la date retenue. */
  const { S: U } = jusquALaV2(), v2 = dossierDe(U, ID).propositions[1];
  assert.deepEqual([contexteDe(v2).invites, contexteDe(v2).confirmes, contexteDe(v2).souhaitee, contexteDe(v2).retenus, v2.total, dossierDe(U, ID).propositions[0].total], [60, true, false, true, 2700, 1800]);
  /* Un dossier d'avant la v7.12.1 : la version présentée n'a pas d'instantané. On ne le reconstitue pas. */
  const vieux = { ...v1 }; delete vieux.contexte; assert.equal(contexteDe(vieux), null);
  const V = vueClient(ctx({ venues: {} }), { ...d, propositions: [vieux] }, {}); assert.equal(V.proposition.contexte, null, 'la page du client reçoit « non conservé », pas les valeurs du jour');
});

test('2 · une version 2 peut recevoir un accord après la confirmation de la réception', () => {
  const x = jusquALaV2(); let d = dossierDe(x.S, ID), v = x.venues()[ID];
  assert.deepEqual([etapeDe(d, v).id, etatRetenue(d, `${AUJ}T10:40`).etat, couranteDe(d).v, accordDe(d, v)], ['confirmee', 'ferme', 2, null]);
  let vue = vueClient(x.c('10:40'), d, v); assert.equal(vue.peutAccorder, true, 'la réception confirmée n\'empêche pas d\'accepter la révision');
  assert.deepEqual([vue.proposition.v, vue.acceptee.v, vue.acceptee.total, vue.proposition.total], [2, 1, 1800, 2700]);
  assert.match(vue.etape.phrase, /Votre réception est confirmée : les espaces sont réservés\. Une nouvelle proposition \(version 2\) attend votre accord ; la version 1, que vous avez acceptée, reste la référence d'ici là\./);
  assert.deepEqual(vue.prochaines.slice(0, 2), ['Consultez la nouvelle version de la proposition.', 'Donnez votre accord, ou posez vos questions.']);
  /* Le client donne son accord sur la version 2 (sa page garde les accords version par version). */
  x.poser({ accord: { version: 2, le: `${AUJ}T10:45` }, accords: [...v.accords, { version: 2, le: `${AUJ}T10:45` }] }); v = x.venues()[ID];
  assert.deepEqual([accepteeDe(d, v).proposition.v, accordDe(d, v).version, etapeDe(d, v).id, d.retenue.etat], [2, 2, 'confirmee', 'ferme']);
  vue = vueClient(x.c('10:50'), d, v); assert.deepEqual([vue.peutAccorder, vue.acceptee, vue.revision], [false, null, '']);
  assert.match(nb(vue.convenu.find(([l]) => l === 'Proposition acceptée')[1]), /Version 2, 2 700 €, établie pour 60 invités/);
  /* L'équipe peut aussi noter un accord reçu autrement, après la confirmation. */
  const y = jusquALaV2(); const T = ok(y.S, 'recAccordEquipe', { id: ID, le: `${AUJ}T11:00` }, y.c('11:00'));
  assert.deepEqual([accepteeDe(dossierDe(T, ID), y.venues()[ID]).proposition.v, accepteeDe(dossierDe(T, ID), y.venues()[ID]).accord.par], [2, 'equipe']);
  assert.match(agir(T, 'recAccordEquipe', { id: ID, le: 'x' }, y.c('11:05')).refus, /La version 2 a déjà reçu un accord/);
});

test('3 · l\'accord sur la version 1 n\'est jamais appliqué à la version 2', () => {
  const x = jusquALaV2(), d = dossierDe(x.S, ID), v = x.venues()[ID];
  assert.deepEqual(Object.keys(accordsDe(d, v)), ['1'], 'l\'accord reste attaché à la version 1'); assert.equal(accordDe(d, v), null); assert.equal(accepteeDe(d, v).proposition.v, 1);
  const k = commerceDe(d, v); assert.deepEqual(k.lignes.map((l) => l.texte), ['Proposition acceptée : version 1', 'Version 2 présentée, accord attendu']); assert.deepEqual([k.attente.v, k.couverte], [2, true]);
  /* Même un ancien format (accord unique, sans liste) ne déborde pas sur la version suivante. */
  assert.equal(accordDe(d, { accord: { version: 1, le: 'x' } }), null); assert.equal(accordDe({ ...d, accordEquipe: { version: 1, le: 'x' } }, {}), null);
  /* Un accord sur une version inconnue, ou sur un brouillon, ne compte pas. */
  assert.deepEqual(accordsDe(d, { accords: [{ version: 7, le: 'x' }] }), {});
  /* Une réception pas encore confirmée : la confirmation attend l'accord sur la version courante, pas sur l'ancienne. */
  let S = creer({}, dem('dem-1')); S = ok(S, 'recProposition', { id: ID, proposition: { titre: 'V1', lignes: menus(40) }, le: 'x' }); S = ok(S, 'recPresenter', { id: ID, le: `${AUJ}T10:00` });
  const ven = { [ID]: { accord: { version: 1, le: `${AUJ}T10:01` } } }; S = ok(S, 'recNouvelleVersion', { id: ID, le: 'x' }); S = ok(S, 'recPresenter', { id: ID, le: `${AUJ}T10:02` });
  const r = agir(S, 'recRetenir', argsRetenue(ctx({ venues: ven }), SALLE, dossierDe(S, ID), { type: 'ferme', jour: SAMEDI, horaires: HOR, espaces: ['restaurant'], le: ctx().maintenant }), ctx({ venues: ven }));
  assert.match(r.refus, /Le client n'a pas donné son accord sur la version 2/); assert.ok(!dossierDe(r.S, ID).retenue, 'rien n\'est réservé');
});

test('4 · une révision ne libère pas les espaces réservés, ni ne crée une seconde réception', () => {
  const x = jusquAuChangement(); let S = x.S; const ret = () => JSON.stringify(dossierDe(S, ID).retenue), avant = ret(), occ = () => occupationsActives(S, `${AUJ}T11:00`).map((o) => [o.id, o.type, o.tables.length]);
  for (const [nom, args] of [['recNouvelleVersion', {}], ['recProposition', { proposition: { lignes: menus(60) } }], ['recPresenter', {}], ['recRetirerVersion', { version: 2, raison: 'Le client préfère en rester là' }], ['recNouvelleVersion', {}], ['recAbandonnerBrouillon', {}], ['recNouvelleVersion', {}], ['recPresenter', {}], ['recAccordEquipe', {}]]) {
    S = ok(S, nom, { id: ID, le: `${AUJ}T10:40`, ...args }, x.c('10:40')); assert.equal(ret(), avant, `${nom} : les espaces restent réservés, tels quels`); assert.deepEqual(occ(), [[ID, 'ferme', 9]]); }
  assert.equal(Object.keys(S.receptions.dossiers).length, 1); assert.equal(etapeDe(dossierDe(S, ID), x.venues()[ID]).id, 'confirmee');
  assert.deepEqual(versionsDe(dossierDe(S, ID)).map((p) => [p.v, p.etat]), [[1, 'presentee'], [2, 'retiree'], [3, 'presentee']], 'la version retirée reste dans l\'historique ; le brouillon abandonné a rendu son numéro');
  /* Une réception déjà confirmée se déplace sans nouvel accord : sa révision se décide à part. */
  const y = jusquALaV2(), d = dossierDe(y.S, ID);
  const dep = agir(y.S, 'recRetenir', argsRetenue(y.c('11:00'), SALLE, d, { type: 'ferme', jour: SAMEDI, horaires: { ...HOR, arrivee: '18:30', preparation: '16:30' }, espaces: ['restaurant'], le: y.c('11:00').maintenant }), y.c('11:00'));
  assert.equal(dep.refus, '', 'avancer l\'arrivée d\'une réception confirmée ne demande pas l\'accord sur la version 2'); assert.equal(dossierDe(dep.S, ID).retenue.debut, `${SAMEDI}T16:30`);
});

test('4 bis · une révision abandonnée ou retirée conserve les engagements précédents, et dit ce qui reste à décider', () => {
  const x = jusquAuChangement(); let S = x.S, d = dossierDe(S, ID), v = x.venues()[ID];
  assert.match(revisionDe(d, v).texte, /Changement accepté le 20 novembre \(60.invités\) : la proposition version 1, établie avant, est à réviser\./);
  assert.match(prochaineAction(d, v, { maintenant: `${AUJ}T10:30`, auj: AUJ }).texte, /Préparer une nouvelle version de la proposition \(60.invités\)/);
  assert.equal(resume(x.c('10:30'), d).attention, 'Proposition à réviser');
  assert.ok(prioritesReceptions(x.c('10:30'), S).some((p) => /proposition à réviser \(60.invités\)/.test(nb(p.texte))), 'la révision due remonte dans Aujourd\'hui');
  /* Un brouillon est créé, puis abandonné : la révision due ne s'efface pas. */
  S = ok(S, 'recNouvelleVersion', { id: ID, le: 'x' }, x.c('10:31')); d = dossierDe(S, ID);
  assert.deepEqual(commerceDe(d, v).lignes.map((l) => l.texte), ['Proposition acceptée : version 1', 'Version 2 en préparation']); assert.match(prochaineAction(d, v, { maintenant: `${AUJ}T10:32`, auj: AUJ }).texte, /Terminer la version 2 et la présenter au client/);
  S = ok(S, 'recAbandonnerBrouillon', { id: ID, le: 'x' }, x.c('10:33')); d = dossierDe(S, ID);
  assert.deepEqual(commerceDe(d, v).lignes.map((l) => l.cle), ['acceptee', 'revision']); assert.equal(d.projet.invitesConfirmes, 60, 'le changement accepté par l\'équipe n\'est pas repris en silence');
  /* Une version 2 est présentée, puis retirée (le client la refuse) : la version 1 acceptée redevient la référence. */
  const y = jusquALaV2(); assert.match(agir(y.S, 'recRetirerVersion', { id: ID, version: 1, raison: 'x' }, y.c('10:40')).refus, /Seule la dernière version présentée peut être retirée/);
  assert.match(agir(y.S, 'recRetirerVersion', { id: ID, version: 2, raison: '' }, y.c('10:40')).refus, /Indiquez la raison/);
  const T = ok(y.S, 'recRetirerVersion', { id: ID, version: 2, raison: 'Le client refuse le nouveau total', le: `${AUJ}T10:41` }, y.c('10:41')), t = dossierDe(T, ID), w = y.venues()[ID];
  assert.deepEqual([t.courante, accepteeDe(t, w).proposition.v, accordDe(t, w).version, t.retenue.etat, t.projet.invitesConfirmes], [1, 1, 1, 'ferme', 60]);
  assert.deepEqual(commerceDe(t, w).lignes.map((l) => l.cle), ['acceptee', 'revision'], 'la révision reste due : 60 invités sont acceptés, la version 1 est établie pour 40');
  assert.match(vueClient(y.c('10:45'), t, w).revision, /Changement accepté/); assert.equal(vueClient(y.c('10:45'), t, w).peutAccorder, false);
  /* Une version qui a reçu un accord ne se retire pas. */
  const U = ok(y.S, 'recAccordEquipe', { id: ID, le: 'x' }, y.c('10:50')); assert.match(agir(U, 'recRetirerVersion', { id: ID, version: 2, raison: 'x' }, y.c('10:51')).refus, /a reçu un accord/);
});

/* ============================== Le jour J ============================== */
test('5 · le jour J distingue les prestations acceptées de la révision en attente, et se met à jour d\'un bloc', () => {
  const x = jusquALaV2(); const d = dossierDe(x.S, ID); let v = x.venues()[ID];
  let f = fichePreparation(x.c('10:40'), d, v, []);
  assert.deepEqual(f.sections.map((s) => s.cle), ['reception', 'a-valider', 'espaces', 'horaires', 'prestations', 'proposees', 'personnes', 'a-savoir']);
  const ligne = (cle, label) => nb(f.sections.find((s) => s.cle === cle).lignes.find((l) => l.label === label)?.valeur || '');
  assert.match(ligne('reception', 'Proposition retenue'), /^Version 1 · Les 40 ans de Julie · 1 800 € \(montants d'exemple\) · établie pour 40 invités · accord du client, simulation$/, 'une version seulement présentée n\'est pas la proposition retenue');
  assert.equal(ligne('reception', 'Invités confirmés'), '60');
  assert.deepEqual(f.sections.find((s) => s.cle === 'a-valider').lignes.map((l) => l.label), ['Version 2 présentée', 'Effectif']);
  assert.match(ligne('a-valider', 'Version 2 présentée'), /Accord du client attendu \(2 700 €, pour 60 invités\)\. D'ici là, préparez sur la base de la version 1 acceptée\./);
  assert.match(ligne('a-valider', 'Effectif'), /60 invités confirmés ; les prestations acceptées \(version 1\) sont établies pour 40\./);
  assert.deepEqual([f.sections.find((s) => s.cle === 'prestations').titre, f.sections.find((s) => s.cle === 'prestations').lignes[0].valeur], ['Les prestations acceptées (version 1)', '40 par personne']);
  assert.deepEqual([f.sections.find((s) => s.cle === 'proposees').titre, f.sections.find((s) => s.cle === 'proposees').lignes[0].valeur], ['Les prestations proposées (version 2, accord attendu)', '60 par personne']);
  assert.match(nb(f.base), /^Espaces réservés\. Préparez sur la base de la version 1 acceptée, établie pour 40 invités\. 2 points restent à valider\.$/); assert.deepEqual([f.aValider, f.acceptee], [2, 1]);
  /* L'accord sur la version 2 : la proposition retenue, les prestations et les points à valider changent ensemble, sans ressaisie. */
  x.poser({ accord: { version: 2, le: `${AUJ}T10:45` }, accords: [...v.accords, { version: 2, le: `${AUJ}T10:45` }] }); v = x.venues()[ID]; f = fichePreparation(x.c('10:50'), d, v, []);
  assert.deepEqual(f.sections.map((s) => s.cle), ['reception', 'espaces', 'horaires', 'prestations', 'personnes', 'a-savoir']);
  assert.match(ligne('reception', 'Proposition retenue'), /^Version 2 · Les 40 ans de Julie · 2 700 € .* établie pour 60 invités · accord du client, simulation$/);
  assert.deepEqual([f.sections.find((s) => s.cle === 'prestations').titre, f.sections.find((s) => s.cle === 'prestations').lignes[0].valeur, f.aValider, f.acceptee], ['Les prestations acceptées (version 2)', '60 par personne', 0, 2]);
  assert.equal(revisionDe(d, v), null, 'la révision due est soldée par l\'accord sur une version plus récente'); assert.deepEqual(commerceDe(d, v).lignes.map((l) => l.texte), ['Proposition acceptée : version 2']);
  assert.match(prochaineAction(d, v, { maintenant: `${AUJ}T10:50`, auj: AUJ }).texte, /^Préparer le jour J/);
  /* La version 1 reste consultable, intacte. */
  assert.deepEqual([d.propositions[0].lignes[0].qte, d.propositions[0].total, contexteDe(d.propositions[0]).invites, accordsDe(d, v)[1].le], [40, 1800, 40, `${AUJ}T10:10`]);
  /* Avant toute acceptation de révision : le changement accepté seul est déjà signalé sur la fiche. */
  const y = jusquAuChangement(), g = fichePreparation(y.c('10:30'), dossierDe(y.S, ID), y.venues()[ID], []);
  assert.deepEqual(g.sections.find((s) => s.cle === 'a-valider').lignes.map((l) => l.label), ['Proposition à réviser', 'Effectif']); assert.equal(g.acceptee, 1);
});

/* ============================== Le restaurant et les réceptions ============================== */
const resa = (id, iso, heure, table, plus = {}) => [{ id, date: iso, service: +heure.slice(0, 2) < 17 && +heure.slice(0, 2) >= 5 ? 'midi' : 'soir', heure, couverts: 2, nom: 'Client du test', telephone: '', statut: 'confirmee', source: 'demo', ...plus }, table];
const avecResas = (S, l, plus = {}) => ({ ...S, resa: { ...(S.resa || {}), ajouts: l.map(([r]) => r), tables: Object.fromEntries(l.filter(([, t]) => t).map(([r, t]) => [r.id, t])), ...plus } });
const petit = (S, id, n) => ok(S, 'recModifier', { id, champs: { projet: { invitesAnnonces: n } } });
const verifier = (S, id, p, c = ctx()) => conflits(c, S, SALLE, dossierDe(S, id), { invites: 8, espaces: ['coin-feu'], ...p });

test('6 · un repas commencé à 13 h 30 occupe sa table jusqu\'à 15 h : une préparation à 14 h 45 est en conflit, à 15 h elle ne l\'est plus', () => {
  const VEN = '2026-12-11'; assert.equal(dureeRepas('midi'), 90); assert.equal(dureeDe('midi'), dureeRepas('midi'), 'le service et les réceptions lisent la même durée de repas');
  assert.deepEqual(fenetreService(R, VEN, 'midi'), { debut: `${VEN}T12:00`, fin: `${VEN}T15:00` }, 'la fenêtre du midi va jusqu\'à la fin du dernier repas possible');
  let S = petit(creer({}, dem('dem-1', '8')), ID, 8); S = avecResas(S, [resa('r1', VEN, '13:30', '1')]);
  const k = verifier(S, ID, { jour: VEN, horaires: { preparation: '14:45', arrivee: '16:00', fin: '18:00', remise: '18:30' } });
  assert.deepEqual(k.bloquants.map((b) => b.type), ['resa']); assert.match(nb(k.bloquants[0].texte), /Table 1 : Client du test, vendredi 11 décembre, le midi à 13 h 30, 2 couverts\./);
  assert.match(agir(S, 'recRetenir', argsRetenue(ctx(), SALLE, dossierDe(S, ID), { type: 'option', jour: VEN, horaires: { preparation: '14:45', arrivee: '16:00', fin: '18:00', remise: '18:30' }, espaces: ['coin-feu'], echeance: '2026-11-27T18:00', le: ctx().maintenant })).refus, /Table 1/, 'le conflit est dit avant toute validation');
  /* La limite exacte : la table est rendue à 15 h, la préparation peut commencer à 15 h. */
  const pile = verifier(S, ID, { jour: VEN, horaires: { preparation: '15:00', arrivee: '16:00', fin: '18:00', remise: '18:30' } }); assert.deepEqual(pile.bloquants, []); assert.deepEqual(pile.services, []);
  /* Une table qui n'est pas retenue ne gêne pas. */
  assert.deepEqual(verifier(avecResas(S, [resa('r1', VEN, '13:30', '5')]), ID, { jour: VEN, horaires: { preparation: '14:45', arrivee: '16:00', fin: '18:00', remise: '18:30' } }).bloquants, []);
  /* Dans l'autre sens : une remise en état finie à midi rend la table au service de midi ; finie à 12 h 15, elle la garde. */
  const o = (remise) => ok(S, 'recRetenir', argsRetenue(ctx(), SALLE, dossierDe(S, ID), { type: 'option', jour: '2026-12-13', horaires: { preparation: '08:00', arrivee: '09:00', fin: '11:00', remise }, espaces: ['coin-feu'], echeance: '2026-11-27T18:00', le: ctx().maintenant }));
  const tablesRetenues = (T) => planDuService(ctx(), T, SALLE, '2026-12-13', 'midi').tables.filter((t) => t.reception).map((t) => t.id);
  assert.deepEqual(tablesRetenues(o('12:00')), []); assert.deepEqual(tablesRetenues(o('12:15')), ['1', '2', '3']);
  /* Un repas noté tard par l'équipe, hors des heures d'arrivée : il est vu lui aussi (table encore occupée). */
  const tard = verifier(avecResas(S, [resa('r2', VEN, '14:15', '2')]), ID, { jour: VEN, horaires: { preparation: '15:15', arrivee: '16:00', fin: '18:00', remise: '18:30' } });
  assert.deepEqual(tard.bloquants.map((b) => b.type), ['resa'], 'arrivé à 14 h 15, à table jusqu\'à 15 h 45 : la préparation de 15 h 15 le dérangerait');
});

test('7 · les horaires du jour et le passage de minuit : une arrivée exceptionnelle à 23 h 30 gêne une préparation à 0 h 30 le lendemain', () => {
  const JEU = '2026-12-10', VEN = '2026-12-11', nuit = { preparation: '00:30', arrivee: '02:00', fin: '04:00', remise: '05:00' };
  let S = petit(creer({}, dem('dem-1', '8')), ID, 8);
  /* Sans ouverture exceptionnelle, le jeudi soir est fermé : rien à minuit et demi. */
  assert.equal(etatService(R, JEU, 'soir', equipeDe(S, [], '')).ouvert, false); assert.deepEqual(verifier(S, ID, { jour: VEN, horaires: nuit }).bloquants, []);
  /* Ouverture exceptionnelle ce jeudi soir, arrivées jusqu'à 23 h 30 ; une table est prise à 23 h 30. */
  S = avecResas(S, [resa('r1', JEU, '23:30', '1')], { ouvertures: [{ date: JEU, service: 'soir', fin: '23:30', note: 'Soirée tardive' }] });
  const eq = equipeDe(S, [], `${AUJ}T10:00`); assert.deepEqual([etatService(R, JEU, 'soir', eq).ouvert, etatService(R, JEU, 'soir', eq).fin], [true, 23 * 60 + 30]);
  assert.deepEqual(fenetreService(R, JEU, 'soir', eq), { debut: `${JEU}T19:00`, fin: `${VEN}T02:00` }, 'la fenêtre suit l\'ouverture exceptionnelle et finit le lendemain');
  assert.deepEqual(fenetreService(R, JEU, 'soir'), { debut: `${JEU}T19:00`, fin: `${VEN}T00:00` }, 'les horaires habituels, eux, s\'arrêtent à minuit');
  const k = verifier(S, ID, { jour: VEN, horaires: nuit }); assert.deepEqual(k.bloquants.map((b) => b.type), ['resa'], 'le changement de date ne masque pas le conflit');
  assert.match(nb(k.bloquants[0].texte), /Table 1 : Client du test, jeudi 10 décembre, le soir à 23 h 30, 2 couverts \(repas jusqu'après minuit\)\./); assert.deepEqual(k.services.map((s) => [s.iso, s.service]), [[JEU, 'soir']]);
  /* Les limites exactes : la fenêtre de ce soir-là se ferme à 2 h ; une occupation peut commencer à 2 h pile. */
  assert.deepEqual(verifier(S, ID, { jour: VEN, horaires: { preparation: '02:00', arrivee: '03:00', fin: '05:00', remise: '06:00' } }).bloquants, []);
  assert.deepEqual(verifier(S, ID, { jour: VEN, horaires: { preparation: '01:45', arrivee: '03:00', fin: '05:00', remise: '06:00' } }).bloquants.map((b) => b.type), ['resa']);
  /* Et dans l'autre sens : une option posée la nuit ferme ces tables au service exceptionnel de la veille. */
  const T = ok(avecResas(S, [], { ouvertures: S.resa.ouvertures }), 'recRetenir', argsRetenue(ctx(), SALLE, dossierDe(S, ID), { type: 'option', jour: VEN, horaires: nuit, espaces: ['coin-feu'], echeance: '2026-11-27T18:00', le: ctx().maintenant }));
  assert.deepEqual(planDuService(ctx(), T, SALLE, JEU, 'soir').tables.filter((t) => t.reception).map((t) => t.id), ['1', '2', '3']);
  /* Des horaires déplacés par l'espace (fermeture plus tôt le vendredi midi) resserrent la fenêtre de la même façon. */
  const tot = equipeDe({ horaires: { semaine: { vendredi: ['12:00-13:30', '19:00-00:00'] } } }, [], '');
  assert.deepEqual(fenetreService(R, VEN, 'midi', tot), { debut: `${VEN}T12:00`, fin: `${VEN}T14:00` }, 'dernière arrivée 12 h 30, repas jusqu\'à 14 h');
});

test('8 · plusieurs occupations partielles s\'additionnent : toutes les zones prises, la page Réserver ne propose plus le service', () => {
  const zones = [['a', 'coin-feu', 3], ['b', 'baies', 5], ['c', 'grande-table', 1]], poser = (S, l, jour, horaires = HOR) => { for (const [i, z] of l) { S = petit(creer(S, dem(`dem-${i}`, '4')), idDossier(`dem-${i}`), 4);
    S = ok(S, 'recRetenir', argsRetenue(ctx(), SALLE, dossierDe(S, idDossier(`dem-${i}`)), { type: 'option', jour, horaires, espaces: [z], echeance: '2026-11-27T18:00', le: ctx().maintenant })); } return S; };
  const etat = (S, jour, quand = `${AUJ}T10:00`) => etatService(R, jour, 'soir', equipeDe(S, [], quand)), pub = (S, jour) => faisabilite(R, { date: jour, service: 'soir', heure: '20:00', couverts: 2 }, { auj: AUJ, minute: 600, equipe: equipeDe(S, [], `${AUJ}T10:00`), public: true });
  /* En décembre, la terrasse est hors saison : les trois zones intérieures font toute la capacité utilisable. */
  const S = poser({}, zones, SAMEDI), d = dossierDe(S, idDossier('dem-a'));
  assert.deepEqual(d.retenue.publics, { salle: { tables: ['1', '2', '3'], sur: 9 }, terrasse: { tables: [], sur: 3 } }, 'chaque retenue dit ce qu\'elle prend de chaque espace proposé au public');
  assert.deepEqual(Object.values(S.receptions.dossiers).map((x) => x.retenue.salle), [false, false, false], 'aucun dossier ne porte « toute la salle »');
  const e = etat(S, SAMEDI); assert.deepEqual([e.ouvert, e.prive, e.sallePrise, e.terrassePrise], [true, true, true, false]);
  assert.deepEqual([pub(S, SAMEDI).ok, pub(S, SAMEDI).raison], [false, 'prive'], 'la page Réserver n\'annonce aucune disponibilité');
  assert.equal(planDuService(ctx(), S, SALLE, SAMEDI, 'soir').tables.filter((t) => !t.horsSaison && !t.reception).length, 0);
  /* Une réception partielle laisse le reste disponible. */
  const P = poser({}, zones.slice(0, 2), SAMEDI), ep = etat(P, SAMEDI); assert.deepEqual([ep.prive, ep.sallePrise, pub(P, SAMEDI).ok], [false, false, true]);
  assert.deepEqual(planDuService(ctx(), P, SALLE, SAMEDI, 'soir').tables.filter((t) => !t.horsSaison && !t.reception).map((t) => t.id), ['7'], 'la grande table reste proposée');
  const k = conflits(ctx(), P, SALLE, dossierDe(petit(creer(P, dem('dem-z', '4')), idDossier('dem-z'), 4), idDossier('dem-z')), { jour: SAMEDI, horaires: HOR, espaces: ['grande-table'], invites: 4 });
  assert.deepEqual(k.bloquants, []); assert.ok(k.attentions.some((t) => /Avec les autres réceptions, il ne restera aucune table samedi 12 décembre, le soir : la page Réserver n'ouvrira pas ce service\./.test(nb(t))), 'l\'équipe est prévenue avant de poser la troisième option');
  /* Quand une option expire, sa zone redevient proposée. */
  assert.equal(etat(S, SAMEDI, '2026-11-27T18:00').prive, false);
  /* En juillet, la terrasse est ouverte : la salle entièrement retenue ne ferme pas le service, elle n'est simplement plus proposée. */
  const ETE = '2027-07-10', c7 = a('2027-06-01', '10:00'), poserEte = (S, l) => { for (const [i, z] of l) { S = petit(creer(S, dem(`ete-${i}`, '4', { date: ETE }), c7), idDossier(`ete-${i}`), 4);
    S = ok(S, 'recRetenir', argsRetenue(c7, SALLE, dossierDe(S, idDossier(`ete-${i}`)), { type: 'option', jour: ETE, horaires: HOR, espaces: [z], echeance: '2027-06-20T18:00', le: c7.maintenant }), c7); } return S; };
  const E = poserEte({}, zones), ee = etatService(R, ETE, 'soir', equipeDe(E, [], '2027-06-01T10:00')); assert.deepEqual([ee.prive, ee.sallePrise, ee.terrassePrise], [false, true, false]);
  const F = poserEte(E, [['t', 'terrasse', 3]]), ef = etatService(R, ETE, 'soir', equipeDe(F, [], '2027-06-01T10:00')); assert.deepEqual([ef.prive, ef.sallePrise, ef.terrassePrise], [true, true, true]);
  /* Une retenue enregistrée avant la v7.12.1 (sans le détail par espace) : « toute la salle » continue de privatiser. */
  const vieux = [{ id: 'x', debut: `${SAMEDI}T17:00`, fin: '2026-12-13T02:00', tables: ['1'], espaces: ['restaurant'], salle: true, terrasse: false }];
  assert.deepEqual([prisesDuService(vieux, R, SAMEDI, 'soir').salle, prisesDuService(vieux, R, SAMEDI, 'soir').tout], [true, true]);
});

test('9 · l\'expiration d\'une option libère toujours les espaces à l\'échéance prévue, y compris après un rechargement', () => {
  let S = petit(creer({}, dem('dem-1', '30')), ID, 30); const ech = echeanceParDefaut(ctx().maintenant, SAMEDI, LIEUX.durees); assert.equal(ech, '2026-11-27T18:00');
  S = ok(S, 'recRetenir', argsRetenue(ctx(), SALLE, dossierDe(S, ID), { type: 'option', jour: SAMEDI, horaires: HOR, espaces: ['restaurant'], echeance: ech, le: ctx().maintenant }));
  const recharge = JSON.parse(JSON.stringify(S)), prive = (T, quand) => etatService(R, SAMEDI, 'soir', equipeDe(T, [], quand)).prive;
  for (const T of [S, recharge]) {
    assert.deepEqual([retenueActive(dossierDe(T, ID).retenue, '2026-11-27T17:59'), retenueActive(dossierDe(T, ID).retenue, '2026-11-27T18:00')], [true, false], 'active jusqu\'à la minute d\'avant, plus à l\'échéance exacte');
    assert.deepEqual([prive(T, '2026-11-27T17:59'), prive(T, '2026-11-27T18:00'), prive(T, '2026-12-01T09:00')], [true, false, false]);
    assert.deepEqual([etatRetenue(dossierDe(T, ID), '2026-11-27T18:00').etat, occupationsActives(T, '2026-11-27T18:00').length, !!dossierDe(T, ID)], ['expiree', 0, true], 'le dossier reste, les espaces sont libres');
    assert.equal(planDuService(a('2026-11-28', '09:00'), T, SALLE, SAMEDI, 'soir').tables.filter((t) => t.reception).length, 0);
  }
  assert.deepEqual(recharge, S, 'recharger ne change rien : l\'échéance est une date, pas un compte à rebours');
  /* Une révision commerciale ne prolonge pas l'option non plus. */
  let T = ok(S, 'recProposition', { id: ID, proposition: { titre: 'V1', lignes: menus(30) }, le: 'x' }); T = ok(T, 'recPresenter', { id: ID, le: `${AUJ}T11:00` });
  assert.equal(dossierDe(T, ID).retenue.echeance, ech); assert.equal(prive(T, '2026-11-27T18:00'), false);
});

test('10 · les données fictives de réception ne touchent pas les tables partagées du site connecté', () => {
  const S = jusquALaV2().S; assert.equal(occupationsActives(S, `${AUJ}T11:00`).length, 1, 'en démonstration, le dossier retient bien la salle');
  const local = { etat: () => S, agir: () => true, demandesSite: () => [], ecouter() {}, abonner() {}, raisonRefus: () => '', noteAction: () => '', toutEffacer: () => true, peutAnnuler: () => false, annuler() {}, conflitsAnnulation: () => [] };
  const depot = creerDepotServeur({ api: '/api', local, periode: () => ({ du: AUJ, au: '2027-03-01' }), surFin() {}, surEtat() {}, fetch: async () => { throw new Error('hors ligne'); } });
  const E = depot.etat(); assert.equal(E.receptions, undefined, 'en mode connecté, les dossiers locaux sont écartés de l\'état que lisent les écrans');
  assert.equal(occupationsActives(E, `${AUJ}T11:00`).length, 0); const e = etatService(R, SAMEDI, 'soir', equipeDe(E, [], `${AUJ}T11:00`)); assert.deepEqual([e.prive, e.sallePrise], [false, false]);
  assert.equal(planDuService(ctx(), E, SALLE, SAMEDI, 'soir').tables.filter((t) => t.reception).length, 0); assert.ok(dossierDe(S, ID), 'le dossier local, lui, n\'est pas modifié');
});

/* ============================== Le cinquième scénario, variante « Un client qui change ses plans » ============================== */
test('scénario 5 · la variante complète : V1 acceptée, confirmation, 60 invités, V2, nouvel accord, jour J à jour, V1 intacte', () => {
  const sc = SCENARIOS.find((s) => s.id === 'reception'); assert.match(sc.variantes[2].texte, /« Préparer une nouvelle version ».*« Présenter au client ».*la version 1 reste consultable, telle qu'elle a été présentée/);
  const CFG = { lieux: LIEUX, salle: SALLE }, ID5 = idDossier('sc5-demande'), d0 = depart('reception', R, '2026-11-21', CFG), [, s2] = samedisDeReception(R, d0.horloge.iso); let venues = {};
  const c = (min = 600) => ({ R, auj: d0.horloge.iso, minute: min, maintenant: `${d0.horloge.iso}T${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}:00`, site: [], demandes: d0.demandes, exceptions: [], scenario: 'reception', demandesDemo: false, lieux: LIEUX, venues });
  const ou = (S) => avancement('reception', { S, venues, vus: {}, iso: d0.horloge.iso, lieux: LIEUX });
  let S = ok(d0.etat, 'recCreer', { dossier: dossierDepuisDemande(demandesDe(c(), d0.etat).find((x) => x.id === 'sc5-demande'), { cree: c().maintenant, lieux: LIEUX }) }, c());
  S = ok(S, 'recProposition', { id: ID5, proposition: { titre: 'Les 40 ans de Julie', lignes: menus(40) }, le: c().maintenant }, c()); S = ok(S, 'recPresenter', { id: ID5, le: c(605).maintenant }, c(605));
  venues = { [ID5]: { accord: { version: 1, le: c(610).maintenant.slice(0, 16) }, accords: [{ version: 1, le: c(610).maintenant.slice(0, 16) }] } };
  S = ok(S, 'recRetenir', argsRetenue(c(615), SALLE, dossierDe(S, ID5), { type: 'ferme', jour: s2, horaires: { arrivee: '19:00', fin: '01:00' }, espaces: ['restaurant'], le: c(615).maintenant }), c(615));
  assert.equal(ou(S).faites, 5); const ch = { id: 'c60', le: c(620).maintenant.slice(0, 16), type: 'effectif', valeur: { invites: 60 } }; venues = { [ID5]: { ...venues[ID5], changements: [ch] } };
  S = ok(S, 'recDecider', { id: ID5, changement: 'c60', type: 'effectif', valeur: { invites: 60 }, acceptee: true, le: c(625).maintenant }, c(625));
  S = ok(S, 'recNouvelleVersion', { id: ID5, le: c(630).maintenant }, c(630)); S = ok(S, 'recProposition', { id: ID5, proposition: { lignes: menus(60) }, le: c(631).maintenant }, c(631)); S = ok(S, 'recPresenter', { id: ID5, le: c(635).maintenant }, c(635));
  assert.equal(ou(S).faites, 5, 'présenter une version 2 ne décoche aucune étape du parcours principal');
  assert.equal(vueClient(c(640), dossierDe(S, ID5), venues[ID5]).peutAccorder, true);
  venues = { [ID5]: { ...venues[ID5], accord: { version: 2, le: c(645).maintenant.slice(0, 16) }, accords: [...venues[ID5].accords, { version: 2, le: c(645).maintenant.slice(0, 16) }] } };
  const d = dossierDe(S, ID5), f = fichePreparation(c(650), d, venues[ID5], []);
  assert.match(nb(f.sections[0].lignes.at(-1).valeur), /^Version 2 · Les 40 ans de Julie · 2 700 €/); assert.deepEqual([f.aValider, d.retenue.etat, d.propositions[0].total, contexteDe(d.propositions[0]).invites, contexteDe(d.propositions[1]).invites], [0, 'ferme', 1800, 40, 60]);
  /* Le scénario reste isolé et rejouable : un nouveau départ est identique au premier. */
  assert.deepEqual(depart('reception', R, '2026-11-21', CFG), d0); assert.equal(brouillonDe(d), null);
});
