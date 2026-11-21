/* v7.11.1, « Le service, prêt à être présenté » : les trois corrections (fiches clients reprises, délais des
   propositions de liste d'attente, bilan exact du repli en mode connecté) et les scénarios de démonstration.
   Le mode connecté est joué sans réseau, avec un faux serveur (réponses simulées) ; le vrai serveur est vérifié dans
   serveur/tests/. Lancer : node --test _audit/tests/*.test.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { publier } from '../../assets/js/disponibilites.js';
import { appliquer } from '../../assets/js/espace-donnees.js';
import { ajouter, histoires, trouverResa } from '../../assets/js/espace-regles.js';
import { reglesAction } from '../../assets/js/espace-garde.js';
import { normaliserTelephone, francais, cleClient, cleMigree, aMigrer, marques, fiche, notesMemeNumero, listeClients } from '../../assets/js/espace-clients.js';
import { delaiProposition, echeance, listeAttente, resaDepuisAttente, DELAI_REPONSE, MARGE_AVANT_ARRIVEE, DELAI_DERNIERE_MINUTE } from '../../assets/js/espace-attente.js';
import { phraseBilan, compteBilan, appliquerUnParUn } from '../../assets/js/espace-repli.js';
import { creerDepotServeur } from '../../assets/js/espace-serveur.js';

globalThis.document ||= { visibilityState: 'visible' };
const lire = (f) => JSON.parse(readFileSync(new URL(`../../donnees/${f}`, import.meta.url), 'utf8'));
const SALLE = lire('salle.json'), R = publier(lire('reservation.json'), lire('horaires.json').adresses[0]).reservation;
const AUJ = '2026-11-20', ctx = (plus = {}) => ({ R, auj: AUJ, minute: 18 * 60, maintenant: `${AUJ}T18:00:00`, site: [], demandes: [], exceptions: [], ...plus });
function agir(S, nom, args, c = ctx()) { const r = reglesAction(c, S, SALLE, nom, args); if (r.refus) return { S, refus: r.refus }; let e = appliquer(S, nom, args); for (const s of r.suites) e = appliquer(e, s.nom, s.args); return { S: e, refus: '' }; }
const H = Object.fromEntries(histoires(R, AUJ).filter((x) => x.date === AUJ).map((x) => [x.role, x]));

/* ============================== A. Les anciennes informations clients ============================== */
test('A · un numéro français s\'écrit de cinq façons et donne une seule clé ; un numéro étranger n\'est pas deviné', () => {
  for (const t of ['06 12 34 56 78', '+33 6 12 34 56 78', '0033612345678', '+33 (0)6 12 34 56 78', '33612345678', '33 06 12 34 56 78']) assert.equal(normaliserTelephone(t), '+33612345678', t);
  assert.equal(francais('0612345678'), '+33612345678'); assert.equal(francais('33612345678'), '+33612345678'); assert.equal(francais('330612345678'), '+33612345678'); assert.equal(francais('0033612345678'), '+33612345678');
  for (const d of ['32475123456', '4915112345678', '612345678', '336123456', '3361234567890', '0012125551234']) assert.equal(francais(d), '', `${d} n'est pas reconnu comme français`);
  assert.equal(normaliserTelephone('+32 475 12 34 56'), '+32475123456'); assert.equal(normaliserTelephone('32475123456'), '32475123456', 'sans indicatif lisible : les chiffres, sans rien deviner');
  assert.equal(cleMigree('t0612345678'), 't:+33612345678'); assert.equal(cleMigree('t33612345678'), 't:+33612345678'); assert.equal(cleMigree('t:33612345678'), 't:+33612345678');
  assert.equal(cleMigree('t:+33612345678'), '', 'déjà à sa place'); assert.equal(cleMigree('t:32475123456'), '', 'ambigu : laissé où il est'); assert.equal(cleMigree('c:cl_1'), ''); assert.equal(cleMigree('n-marie-durand'), ''); assert.equal(cleMigree('s:r1'), '');
});

test('A · anciennes fiches nationale, internationale et mal migrée : tout rejoint la bonne fiche, rien n\'est perdu, un second passage ne change rien', () => {
  const avant = { clients: {
    t0612345678: { habitue: true, note: 'Près du feu' },                       /* ancienne clé nationale */
    t33612345678: { allergies: ['arachide'], note: 'Vin rouge' },               /* ancienne clé internationale */
    't:33612345678': { allergies: ['gluten'], note: 'Près du feu' },            /* clé mal rangée par la v7.11.0 */
    't:+33612345678': { allergies: ['lait'], note: 'Table ronde' },             /* ce qui est déjà noté à destination */
    t0698765432: { note: 'Autre personne' },
  } };
  assert.equal(aMigrer(avant), true);
  const S = appliquer(avant, 'migrerClients', {});
  assert.deepEqual(Object.keys(S.clients).sort(), ['t:+33612345678', 't:+33698765432']);
  const f = S.clients['t:+33612345678'];
  assert.equal(f.habitue, true); assert.deepEqual([...f.allergies].sort(), ['arachide', 'gluten', 'lait'], 'toutes les allergies, sans doublon');
  for (const mot of ['Près du feu', 'Vin rouge', 'Table ronde']) assert.ok(f.note.includes(mot), `la note « ${mot} » est gardée`);
  assert.equal(f.note.split('Près du feu').length - 1, 1, 'une note identique n\'est pas répétée');
  /* La fiche attendue les retrouve, quelle que soit l'écriture du numéro. */
  assert.deepEqual([...marques(S, { id: 'r1', nom: 'Qui', telephone: '+33 6 12 34 56 78' }).allergies].sort(), ['arachide', 'gluten', 'lait']);
  assert.equal(marques(S, { id: 'r1', nom: 'Qui', telephone: '06.12.34.56.78' }).habitue, true);
  /* Second passage, puis « rechargement » (l'état relu tel qu'il est enregistré) : rien ne bouge, aucun doublon. */
  assert.equal(aMigrer(S), false); const S2 = appliquer(S, 'migrerClients', {}); assert.deepEqual(S2, S);
  const S3 = appliquer(JSON.parse(JSON.stringify(S2)), 'migrerClients', {}); assert.deepEqual(S3.clients, S.clients);
});

test('A · identifiants du serveur, homonymes, numéros ambigus : rien n\'est fusionné ni attribué d\'office', () => {
  /* Deux identifiants clients distincts restent deux fiches, même après migration ; la migration ne touche pas « c: ». */
  const avant = { clients: { 'c:cl_1': { note: 'Client 1' }, 'c:cl_2': { allergies: ['lait'] }, 'n-marie-durand': { allergies: ['gluten'] }, t32475123456: { note: 'Belge ?', allergies: ['poisson'] }, t123456: { note: 'Court' } } };
  const S = appliquer(avant, 'migrerClients', {});
  assert.deepEqual(S.clients['c:cl_1'], { note: 'Client 1' }); assert.deepEqual(S.clients['c:cl_2'], { allergies: ['lait'] }); assert.deepEqual(S.clients['n-marie-durand'], { allergies: ['gluten'] });
  assert.notEqual(cleClient({ id: 'a', clientId: 'cl_1', telephone: '0612345678' }), cleClient({ id: 'b', clientId: 'cl_2', telephone: '0612345678' }), 'l\'identifiant du serveur passe avant le téléphone');
  assert.equal(marques(S, { id: 'a', clientId: 'cl_1', nom: 'X' }).note, 'Client 1'); assert.deepEqual(marques(S, { id: 'b', clientId: 'cl_2', nom: 'X' }).allergies, ['lait']); assert.equal(marques(S, { id: 'b', clientId: 'cl_2', nom: 'X' }).note, '');
  /* Deux homonymes sans téléphone : deux fiches, aucune allergie reprise du nom. */
  const deux = { ...S, resa: { ajouts: [{ id: 'r1', date: AUJ, service: 'soir', heure: '19:30', couverts: 2, nom: 'Marie Durand', statut: 'confirmee' }, { id: 'r2', date: AUJ, service: 'soir', heure: '20:00', couverts: 2, nom: 'Marie Durand', statut: 'confirmee' }] } };
  assert.equal(listeClients(ctx({ exemples: false }), deux).filter((c) => c.nom === 'Marie Durand').length, 2); assert.deepEqual(marques(deux, deux.resa.ajouts[0]).allergies, []);
  /* Un numéro étranger ou ambigu garde ses chiffres : il n'est rangé sous aucun « +33 », et ses notes sont gardées. */
  assert.equal(S.clients['t:32475123456'].note, 'Belge ?'); assert.deepEqual(S.clients['t:32475123456'].allergies, ['poisson']); assert.equal(S.clients['t:123456'].note, 'Court'); assert.equal(Object.keys(S.clients).some((k) => k.startsWith('t:+')), false);
  /* Elles ne sont appliquées à personne d'office, mais proposées « à vérifier » sur la fiche qui porte ces chiffres. */
  const r = { id: 'x', nom: 'Luc Peeters', telephone: '+32 475 12 34 56', date: AUJ, service: 'soir', heure: '20:00', couverts: 2, statut: 'confirmee' }, cle = cleClient(r);
  assert.deepEqual(marques(S, r).allergies, []); const v = notesMemeNumero(S, cle, r.telephone); assert.equal(v.cle, 't:32475123456'); assert.deepEqual(v.allergies, ['poisson']);
  const Sx = { ...S, resa: { ajouts: [r] } }; assert.equal(fiche(ctx({ exemples: false }), Sx, cle).aVerifier.length, 1);
  const S4 = appliquer(Sx, 'rattacherNotes', { de: v.cle, vers: cle }); assert.deepEqual(marques(S4, r).allergies, ['poisson']); assert.equal(S4.clients['t:32475123456'], undefined); assert.equal(fiche(ctx({ exemples: false }), S4, cle).aVerifier.length, 0);
  assert.equal(aMigrer(S), false);
});

/* ============================== B. Les propositions de liste d'attente ============================== */
test('B · l\'échéance : la plus proche de « maintenant + 2 h » et « arrivée − 1 h » ; passé ce délai, la dernière minute, dite comme telle', () => {
  assert.deepEqual([DELAI_REPONSE, MARGE_AVANT_ARRIVEE, DELAI_DERNIERE_MINUTE], [120, 60, 15]);
  const e = { date: AUJ }, d = (hm, arrivee = '20:00') => { const x = delaiProposition(e, arrivee, `${AUJ}T${hm}:00`); return [x.mode, x.expire.slice(11, 16)]; };
  assert.deepEqual(d('18:00'), ['standard', '19:00']); assert.deepEqual(d('18:50'), ['standard', '19:00']);
  assert.deepEqual(d('16:30'), ['standard', '18:30'], 'loin de l\'arrivée : deux heures pleines');
  assert.deepEqual(d('19:00'), ['derniere-minute', '19:15'], 'à 19 h, le délai standard n\'existe plus : dernière minute, explicitement');
  assert.deepEqual(d('19:30'), ['derniere-minute', '19:45']); assert.deepEqual(d('19:55'), ['derniere-minute', '20:00'], 'jamais au-delà de l\'heure d\'arrivée');
  assert.deepEqual(d('20:00'), ['', '']); assert.deepEqual(d('20:10'), ['', ''], 'à l\'heure d\'arrivée ou après : aucun délai valable');
  assert.equal(echeance(e, '20:00', `${AUJ}T19:30:00`), `${AUJ}T19:45:00`, 'plus jamais 21 h 30');
  /* La veille : deux heures. */
  assert.deepEqual(delaiProposition({ date: ajouter(AUJ, 1) }, '20:00', `${AUJ}T22:30:00`).expire, `${ajouter(AUJ, 1)}T00:30:00`);
});

test('B · proposition enregistrée avec son mode et son échéance ; expirée à l\'échéance exacte ; acceptée revérifiée ; une seule réservation', () => {
  const libre = (c) => agir({}, 'statut', { id: H.tablee.id, statut: 'annulee' }, c).S; /* la grande table se libère */
  /* 19 h 30 : le mode standard est refusé, la dernière minute est demandée explicitement. */
  const c1930 = ctx({ minute: 19 * 60 + 30, maintenant: `${AUJ}T19:30:00` }), S0 = libre(c1930), e0 = listeAttente(c1930, S0).find((x) => x.id === 'att-demo-2');
  const d = delaiProposition(e0, '20:00', c1930.maintenant); assert.equal(d.mode, 'derniere-minute');
  assert.match(agir(S0, 'attenteProposer', { id: 'att-demo-2', heure: '20:00', service: 'soir', faite: c1930.maintenant, expire: `${AUJ}T21:30:00` }, c1930).refus, /délai habituel n'est plus possible.*Dernière minute.*15 minutes/);
  assert.match(agir(S0, 'attenteProposer', { id: 'att-demo-2', heure: '20:00', service: 'soir', faite: c1930.maintenant, expire: `${AUJ}T21:30:00`, mode: 'derniere-minute' }, c1930).refus, /délai de réponse a changé/, 'une échéance plus longue que la règle est refusée');
  let r = agir(S0, 'attenteProposer', { id: 'att-demo-2', heure: '20:00', service: 'soir', faite: c1930.maintenant, expire: d.expire, mode: d.mode }, c1930); assert.equal(r.refus, ''); let S = r.S;
  assert.deepEqual(S.attente.suivi['att-demo-2'].proposition, { heure: '20:00', service: 'soir', faite: `${AUJ}T19:30:00`, expire: `${AUJ}T19:45:00`, mode: 'derniere-minute' });
  /* « Rechargement » : l'état relu ne prolonge rien, quelle que soit l'heure à laquelle on le relit. */
  const relu = JSON.parse(JSON.stringify(S)), a = (hm) => ctx({ minute: +hm.slice(0, 2) * 60 + +hm.slice(3), maintenant: `${AUJ}T${hm}:00` });
  assert.equal(listeAttente(a('19:44'), relu).find((x) => x.id === 'att-demo-2').etat, 'proposee'); assert.equal(relu.attente.suivi['att-demo-2'].proposition.expire, `${AUJ}T19:45:00`);
  /* À l'échéance exacte : expirée, et l'acceptation le dit (une expiration, pas une place prise). */
  assert.equal(listeAttente(a('19:45'), relu).find((x) => x.id === 'att-demo-2').etat, 'expiree');
  const tard = agir(relu, 'attenteAccepter', { id: 'att-demo-2' }, a('19:45')); assert.match(tard.refus, /a expiré.*délai de réponse est passé/); assert.doesNotMatch(tard.refus, /prise entre-temps/);
  /* Une minute avant : acceptée ; double clic : une seule réservation. */
  const c = a('19:44'), e = listeAttente(c, relu).find((x) => x.id === 'att-demo-2'), resa = resaDepuisAttente(e);
  r = agir(relu, 'attenteAccepter', { id: 'att-demo-2', resa }, c); assert.equal(r.refus, ''); S = r.S;
  assert.match(agir(S, 'attenteAccepter', { id: 'att-demo-2', resa }, c).refus, /Déjà acceptée/); S = appliquer(S, 'attenteAccepter', { id: 'att-demo-2', resa });
  assert.equal(S.resa.ajouts.filter((x) => x.source === 'attente').length, 1); assert.equal(trouverResa(c, S, resa.id).statut, 'confirmee');
  /* Dans le délai mais la place prise entre-temps : c'est dit autrement qu'une expiration, et rien n'est créé. */
  const c18 = ctx(), S1 = libre(c18), d18 = delaiProposition(e0, '20:00', c18.maintenant); assert.equal(d18.mode, 'standard');
  let Sp = agir(S1, 'attenteProposer', { id: 'att-demo-2', heure: '20:00', service: 'soir', faite: c18.maintenant, expire: d18.expire, mode: d18.mode }, c18).S;
  Sp = agir(Sp, 'statut', { id: H.tablee.id, statut: 'confirmee' }, c18).S; /* la famille Weber revient : la grande table est reprise */
  const pris = agir(Sp, 'attenteAccepter', { id: 'att-demo-2' }, ctx({ minute: 18 * 60 + 30, maintenant: `${AUJ}T18:30:00` }));
  assert.match(pris.refus, /prise entre-temps/); assert.doesNotMatch(pris.refus, /expiré/); assert.equal((pris.S.resa?.ajouts || []).length, 0);
  /* Une proposition n'immobilise pas la table : la seconde tablée peut recevoir la sienne. */
  assert.equal(agir(agir(S1, 'attenteProposer', { id: 'att-demo-2', heure: '20:00', service: 'soir', faite: c18.maintenant, expire: d18.expire, mode: 'standard' }, c18).S, 'attenteProposer', { id: 'att-demo-3', heure: '20:00', service: 'soir', faite: c18.maintenant, expire: d18.expire, mode: 'standard' }, c18).refus, '');
  /* À l'heure d'arrivée : plus de proposition pour cette heure. */
  const c20 = a('20:00'); assert.notEqual(agir(libre(c20), 'attenteProposer', { id: 'att-demo-2', heure: '20:00', service: 'soir', faite: c20.maintenant, expire: c20.maintenant, mode: 'derniere-minute' }, c20).refus, '');
});

/* ============================== C. Le bilan du repli, déplacement par déplacement ============================== */
test('C · la phrase du bilan dit ce qui s\'est réellement passé ; en démonstration aussi, on s\'arrête au premier refus', () => {
  const r = (etats) => etats.map((etat, i) => ({ id: `r${i}`, table: String(i + 1), etat }));
  assert.equal(phraseBilan(r(['deplacee', 'refusee', 'non-tentee', 'non-tentee'])), '1 réservation déplacée. 1 déplacement refusé. 2 déplacements restent à traiter.');
  assert.equal(phraseBilan(r(['deplacee', 'deplacee', 'deplacee'])), '3 réservations déplacées.');
  assert.equal(phraseBilan(r(['refusee', 'non-tentee'])), 'Aucune réservation déplacée. 1 déplacement refusé. 1 déplacement reste à traiter.');
  assert.equal(phraseBilan(r(['deplacee', 'a-verifier', 'non-tentee'])), '1 réservation déplacée. 1 résultat à vérifier. 1 déplacement reste à traiter.');
  assert.deepEqual(compteBilan(r(['deplacee', 'refusee', 'non-tentee', 'non-tentee'])), { deplacees: 1, refusees: 1, nonTentees: 2, aVerifier: 0, prevues: 4 });
  const tentes = [], res = appliquerUnParUn([{ id: 'a', table: '1' }, { id: 'b', table: '2' }, { id: 'c', table: '3' }], (x) => { tentes.push(x.id); return x.id === 'b' ? 'La table 2 est prise.' : true; });
  assert.deepEqual(res.map((x) => x.etat), ['deplacee', 'refusee', 'non-tentee']); assert.deepEqual(tentes, ['a', 'b'], 'le troisième n\'est pas tenté'); assert.equal(res[1].raison, 'La table 2 est prise.');
});

/* Un faux serveur à plusieurs réservations : `refus` (réponse 409 pour une réservation), `perdue` (l'écriture est faite
   ou non, puis la réponse se perd), `sourd` (plus rien ne répond). */
function fauxServeur({ refus = {}, perdue = {}, ecritQuandPerdue = true } = {}) {
  const etat = { reservations: ['a', 'b', 'c', 'd'].map((id, i) => ({ id, date: '2027-06-19', service: 'soir', heure: '20:00', couverts: 2, prenom: '', nom: `Groupe ${id.toUpperCase()}`, telephone: '', statut: 'confirmee', origine: 'equipe', table: String(10 + (i % 3)), placement: 'placement', version: 1 })),
    numero: 5, appels: [], sourd: false, enCours: 0, maxEnMemeTemps: 0 };
  const rep = (statut, corps) => ({ ok: statut < 400, status: statut, json: async () => structuredClone(corps) });
  const aller = async (url, o = {}) => {
    const methode = o.method || 'GET', chemin = url.replace('/api', ''), corps = o.body ? JSON.parse(o.body) : null; etat.appels.push(`${methode} ${chemin}`);
    if (etat.sourd) throw new TypeError('fetch failed');
    if (chemin === '/session') return rep(200, { compte: { id: 'u1', email: 'accueil@essai.test', nom: 'Accueil', role: 'accueil' }, droits: ['reservations:lire', 'reservations:ecrire', 'reglages:lire'] });
    if (chemin === '/reglages') return rep(200, { reservation: { services: {} }, equipe: {}, version: 1, tables: [] });
    if (chemin.startsWith('/reservations?')) return rep(200, { reservations: etat.reservations });
    if (chemin.startsWith('/suivi')) return rep(200, { numero: etat.numero, reservations: [], regles: false, clients: [] });
    const m = chemin.match(/^\/reservations\/([^/]+)\/table$/), r = m && etat.reservations.find((x) => x.id === m[1]);
    if (m && r) {
      etat.enCours++; etat.maxEnMemeTemps = Math.max(etat.maxEnMemeTemps, etat.enCours); await new Promise((f) => setTimeout(f, 3)); etat.enCours--;
      if (refus[r.id]) return rep(409, { erreur: { code: 'TABLE_PRISE', message: refus[r.id] } });
      if (perdue[r.id]) { if (ecritQuandPerdue) Object.assign(r, { table: corps.table, placement: 'placement', version: r.version + 1 }); if (perdue[r.id] === 'sourd') etat.sourd = true; throw new TypeError('fetch failed'); }
      Object.assign(r, { table: corps.table, placement: 'placement', version: r.version + 1 }); return rep(200, { reservation: r });
    }
    return rep(404, { erreur: { code: 'INTROUVABLE', message: 'Introuvable.' } });
  };
  return { etat, aller };
}
async function monter(serveur) {
  const local = { etat: () => ({}), agir: () => true, demandesSite: () => [], ecouter() {}, abonner() {}, raisonRefus: () => '', noteAction: () => '', toutEffacer: () => true, peutAnnuler: () => false, annuler() {}, conflitsAnnulation: () => [], gardesAnnulation: () => [], annulationPartielle: () => false };
  const depot = creerDepotServeur({ api: '/api', local, periode: () => ({ du: '2026-11-20', au: '2027-12-31' }), surFin() {}, surEtat() {}, fetch: serveur.aller });
  await depot.connecter('accueil@essai.test', 'x'); return depot;
}
const LISTE = [{ id: 'a', table: '5' }, { id: 'b', table: '6' }, { id: 'c', table: '2+3' }, { id: 'd', table: '4' }];
const tables = (s) => Object.fromEntries(s.etat.reservations.map((r) => [r.id, r.table]));

test('C · mode connecté (réponses simulées) : tout réussit ; le deuxième refusé ; le premier refusé', async () => {
  let s = fauxServeur(), depot = await monter(s), r = await depot.placerUnParUn(LISTE);
  assert.deepEqual(r.resultats.map((x) => x.etat), ['deplacee', 'deplacee', 'deplacee', 'deplacee']); assert.deepEqual(tables(s), { a: '5', b: '6', c: '2+3', d: '4' }); assert.equal(phraseBilan(r.resultats), '4 réservations déplacées.');
  assert.equal(depot.etat().resa.tables.a, '5', 'l\'écran lit ce que le serveur a confirmé'); assert.equal(depot.liaison().enCours, 0);
  /* Le deuxième est refusé : le premier est gardé, les suivants ne sont pas tentés. Ce n'est pas « tout ou rien ». */
  s = fauxServeur({ refus: { b: 'La table 6 est prise à cette heure-là.' } }); depot = await monter(s); r = await depot.placerUnParUn(LISTE);
  assert.deepEqual(r.resultats.map((x) => x.etat), ['deplacee', 'refusee', 'non-tentee', 'non-tentee']); assert.equal(r.resultats[1].raison, 'La table 6 est prise à cette heure-là.');
  assert.deepEqual(tables(s), { a: '5', b: '11', c: '12', d: '10' }, 'le premier déplacement confirmé reste fait'); assert.equal(s.etat.appels.filter((x) => /PUT .*\/table/.test(x)).length, 2, 'les deux derniers ne sont pas envoyés');
  assert.equal(phraseBilan(r.resultats), '1 réservation déplacée. 1 déplacement refusé. 2 déplacements restent à traiter.');
  /* Le premier est refusé : aucune réussite annoncée, rien n'a bougé. */
  s = fauxServeur({ refus: { a: 'La table 5 est indisponible.' } }); depot = await monter(s); r = await depot.placerUnParUn(LISTE);
  assert.deepEqual(r.resultats.map((x) => x.etat), ['refusee', 'non-tentee', 'non-tentee', 'non-tentee']); assert.equal(compteBilan(r.resultats).deplacees, 0); assert.deepEqual(tables(s), { a: '10', b: '11', c: '12', d: '10' });
  assert.match(phraseBilan(r.resultats), /^Aucune réservation déplacée\. 1 déplacement refusé\. 3 déplacements restent à traiter\.$/);
});

test('C · mode connecté (réponses simulées) : réponse perdue, vérification de l\'état, double clic, nouvelle tentative', async () => {
  /* La réponse se perd alors que le serveur a écrit : on relit l'état, le déplacement est reconnu fait, et on s'arrête là. */
  let s = fauxServeur({ perdue: { b: true } }), depot = await monter(s), r = await depot.placerUnParUn(LISTE);
  assert.deepEqual(r.resultats.map((x) => x.etat), ['deplacee', 'deplacee', 'non-tentee', 'non-tentee']); assert.match(r.resultats[1].raison, /vérification faite : le déplacement est bien enregistré/);
  assert.equal(s.etat.appels.filter((x) => x === 'PUT /reservations/b/table').length, 1, 'rien n\'est relancé à l\'aveugle');
  /* La réponse se perd et le serveur n'a rien écrit : vérifié, « non tenté », à refaire. */
  s = fauxServeur({ perdue: { b: true }, ecritQuandPerdue: false }); depot = await monter(s); r = await depot.placerUnParUn(LISTE);
  assert.deepEqual(r.resultats.map((x) => x.etat), ['deplacee', 'non-tentee', 'non-tentee', 'non-tentee']); assert.match(r.resultats[1].raison, /n'a pas été enregistré/); assert.equal(tables(s).b, '11');
  /* Plus aucune réponse : on ne sait pas. Le résultat est « à vérifier », jamais une réussite ni un refus inventés. */
  s = fauxServeur({ perdue: { b: 'sourd' } }); depot = await monter(s); r = await depot.placerUnParUn(LISTE);
  assert.deepEqual(r.resultats.map((x) => x.etat), ['deplacee', 'a-verifier', 'non-tentee', 'non-tentee']); assert.match(r.resultats[1].raison, /on ne sait pas/);
  assert.equal(phraseBilan(r.resultats), '1 réservation déplacée. 1 résultat à vérifier. 2 déplacements restent à traiter.'); assert.equal(depot.liaison().enCours, 0);
  /* Hors connexion : une nouvelle série est refusée, rien ne part. */
  const avant = s.etat.appels.length, hors = await depot.placerUnParUn(LISTE); assert.match(hors.refus, /Pas de liaison/); assert.equal(hors.resultats.length, 0); assert.equal(s.etat.appels.length, avant);
  /* Double clic : la seconde demande ne lance rien, une seule série passe, jamais deux écritures en même temps. */
  s = fauxServeur(); depot = await monter(s); const [un, deux] = await Promise.all([depot.placerUnParUn(LISTE), depot.placerUnParUn(LISTE)]);
  assert.equal(deux.occupe, true); assert.equal(un.resultats.length, 4); assert.equal(s.etat.appels.filter((x) => /PUT .*\/table/.test(x)).length, 4); assert.equal(s.etat.maxEnMemeTemps, 1);
  /* Nouvelle tentative après un refus : elle ne porte que sur ce qui reste (le premier, déjà fait, n'est pas renvoyé). */
  s = fauxServeur({ refus: { b: 'La table 6 est prise.' } }); depot = await monter(s); r = await depot.placerUnParUn(LISTE);
  assert.deepEqual(r.resultats.map((x) => x.etat), ['deplacee', 'refusee', 'non-tentee', 'non-tentee']);
  const reste = r.resultats.filter((x) => x.etat !== 'deplacee').map(({ id, table }) => ({ id, table: id === 'b' ? '9' : table }));
  delete s.etat.reservations; s.etat.reservations = ['a', 'b', 'c', 'd'].map((id) => ({ id, table: depot.reservation(id).table, placement: 'placement', version: depot.reservation(id).version, statut: 'confirmee', date: '2027-06-19', service: 'soir', heure: '20:00', couverts: 2, nom: id }));
  const s2 = fauxServeur(); s2.etat.reservations = s.etat.reservations; const depot2 = await monter(s2), r2 = await depot2.placerUnParUn(reste);
  assert.deepEqual(r2.resultats.map((x) => [x.id, x.etat]), [['b', 'deplacee'], ['c', 'deplacee'], ['d', 'deplacee']]); assert.equal(s2.etat.appels.includes('PUT /reservations/a/table'), false, 'ce qui était déjà déplacé n\'est pas renvoyé');
  assert.deepEqual(tables(s2), { a: '5', b: '9', c: '2+3', d: '4' });
});

/* ============================== D. Les scénarios de démonstration ============================== */
import { SCENARIOS, depart, avancement, prochainVendredi, prochainSamediDEte } from '../../assets/js/espace-scenarios.js';
import { resasDuJour } from '../../assets/js/espace-regles.js';
import { pourUnPassage, resaDePassage } from '../../assets/js/espace-presence.js';
import { repliTerrasse } from '../../assets/js/espace-repli.js';
import { refusModifVenue } from '../../assets/js/espace-venue.js';
import { equipeDe } from '../../assets/js/disponibilites.js';
import { cleSalle } from '../../assets/js/espace-salle.js';

const REELS = ['2026-11-21', '2026-12-31', '2027-03-05', '2027-06-19', '2027-08-30'];
/* Le contexte d'un scénario : son jour, son heure, aucun exemple tiré au hasard. */
const cs = (d, min = d.horloge.min) => ({ R, auj: d.horloge.iso, minute: min, maintenant: `${d.horloge.iso}T${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}:00`, site: [], demandes: [], exceptions: [], scenario: 'x' });
const etat = (id, d, S, plus = {}) => avancement(id, { S, venues: {}, vus: {}, iso: d.horloge.iso, ...plus });
const jouer = (S, c, ...actions) => { for (const [nom, args] of actions) { const r = agir(S, nom, args, c); assert.equal(r.refus || '', '', `${nom} doit être possible`); S = r.S; } return S; };

test('D · les quatre scénarios partent toujours du même point, quel que soit le jour réel, sans exemple tiré au hasard', () => {
  assert.deepEqual(SCENARIOS.map((s) => s.id), ['service', 'attente', 'terrasse', 'client']);
  for (const reel of REELS) for (const s of SCENARIOS) {
    const d = depart(s.id, R, reel), encore = depart(s.id, R, reel);
    assert.deepEqual(d, encore, `${s.id} : deux lancements le même jour donnent le même départ`);
    assert.ok(d.horloge.iso >= reel, `${s.id} : le jour simulé n'est pas dans le passé (${d.horloge.iso})`);
    const jour = new Date(`${d.horloge.iso}T12:00:00Z`).getUTCDay(); assert.equal(jour, s.id === 'terrasse' ? 6 : 5, `${s.id} : un ${s.id === 'terrasse' ? 'samedi' : 'vendredi'}`);
    if (s.id === 'terrasse') assert.ok(['06', '07', '08', '09'].includes(d.horloge.iso.slice(5, 7)), 'la terrasse : à la belle saison');
    const a = etat(s.id, d, d.etat); assert.equal(a.faites, 0, `${s.id} : aucune étape faite au départ`); assert.equal(a.fini, false); assert.equal(a.conclusion, '', 'pas de conclusion avant la fin'); assert.ok(a.etapes.length >= 3 && a.etapes.length <= 5, '3 à 5 actions suggérées');
    const resas = resasDuJour(cs(d), d.etat, d.horloge.iso); assert.ok(resas.length >= 4, `${s.id} : des réservations préparées`);
    assert.ok(resas.every((r) => /^(sc\d-|ete-)/.test(r.id)), `${s.id} : uniquement les réservations du scénario (${resas.map((r) => r.id).join(', ')})`);
  }
  assert.equal(prochainVendredi(R, '2026-11-27'), '2026-11-27', 'un vendredi : le jour même'); assert.match(prochainSamediDEte(R, '2026-11-21'), /^2027-06-/);
});

test('D · scénario 1 : arrivée, installation, passage, départ, table prête ; chaque étape suit une action réelle', () => {
  const d = depart('service', R, REELS[0]), c = cs(d), iso = d.horloge.iso; let S = d.etat;
  S = jouer(S, c, ['statut', { id: 'sc1-couple', statut: 'arrivee' }]); assert.equal(etat('service', d, S).faites, 1);
  S = jouer(S, c, ['installer', { id: 'sc1-couple', minute: c.minute }]); assert.equal(etat('service', d, S).faites, 2);
  const o = pourUnPassage(c, S, SALLE, { couverts: 2, service: 'soir' });
  assert.ok(o.places.length >= 1, 'une table est libre et prête pour deux personnes sans réservation');
  assert.match(o.refus.find((x) => x.id === '2')?.raison || '', /débarrasser/, 'la table 2, à débarrasser, est refusée avec sa raison'); assert.ok(o.refus.some((x) => /occupée/.test(x.raison)), 'une table occupée est refusée avec sa raison');
  S = jouer(S, c, ['passage', { resa: resaDePassage({ cle: 'k', auj: iso, minute: c.minute, service: 'soir', couverts: 2, nom: '', demande: '', table: o.places[0].id }), installer: true }]); assert.equal(etat('service', d, S).faites, 3);
  S = jouer(S, c, ['depart', { id: 'sc1-hugo', minute: c.minute, cle: cleSalle(iso, 'soir'), tables: ['6'] }]);
  let a = etat('service', d, S); assert.equal(a.faites, 4); assert.equal(S.service.tables[cleSalle(iso, 'soir')]['6'], 'a-debarrasser', 'le départ ne rend pas la table prête'); assert.equal(a.fini, false);
  S = jouer(S, c, ['etatTable', { cle: cleSalle(iso, 'soir'), table: '6', etat: 'a-preparer' }]); assert.equal(etat('service', d, S).fini, false, 'débarrassée n\'est pas encore prête');
  S = jouer(S, c, ['etatTable', { cle: cleSalle(iso, 'soir'), table: '6', etat: '' }]); a = etat('service', d, S);
  assert.equal(a.fini, true); assert.match(a.conclusion, /table vide n'est pas encore une table prête/);
});

test('D · scénario 2 : sans annulation, rien à proposer ; après, la plus ancienne reçoit la place, échéance 19 h, une seule réservation', () => {
  const d = depart('attente', R, REELS[0]), c = cs(d), iso = d.horloge.iso; let S = d.etat;
  const avant = listeAttente(c, S); assert.deepEqual(avant.map((e) => e.id), ['sc2-lambert', 'sc2-sylvie'], 'deux tablées, la plus ancienne d\'abord');
  assert.equal(agir(S, 'attenteProposer', { id: 'sc2-lambert', heure: '20:00', service: 'soir', faite: c.maintenant, expire: `${iso}T19:00:00` }, c).refus ? true : false, true, 'tant que la grande table est prise, la proposition est refusée');
  S = jouer(S, c, ['statut', { id: 'sc2-weber', statut: 'annulee' }]); assert.equal(etat('attente', d, S).faites, 1);
  assert.equal(etat('attente', d, S, { vus: { 'attente-vue': 1 } }).faites, 2);
  const e = listeAttente(c, S)[0], delai = delaiProposition(e, '20:00', c.maintenant);
  assert.deepEqual([delai.mode, delai.expire], ['standard', `${iso}T19:00:00`], 'à 18 h 30 pour 20 h : réponse avant 19 h');
  S = jouer(S, c, ['attenteProposer', { id: 'sc2-lambert', heure: '20:00', service: 'soir', faite: c.maintenant, expire: delai.expire, mode: delai.mode }]);
  const resa = resaDepuisAttente(listeAttente(c, S)[0]); S = jouer(S, c, ['attenteAccepter', { id: 'sc2-lambert', resa }]);
  assert.ok(agir(S, 'attenteAccepter', { id: 'sc2-lambert', resa }, c).refus || (agir(S, 'attenteAccepter', { id: 'sc2-lambert', resa }, c).S.resa.ajouts || []).filter((r) => r.source === 'attente').length === 1, 'un second clic ne crée pas de seconde réservation');
  const a = etat('attente', d, S, { vus: { 'attente-vue': 1 } }); assert.equal(a.fini, true); assert.match(a.conclusion, /ne crée une réservation que lorsque tout est réuni/);
  /* La variante : à 19 h pile la proposition est expirée ; seule la dernière minute reste (15 min). */
  let V = jouer(d.etat, c, ['statut', { id: 'sc2-weber', statut: 'annulee' }], ['attenteProposer', { id: 'sc2-lambert', heure: '20:00', service: 'soir', faite: c.maintenant, expire: delai.expire, mode: 'standard' }]);
  const c19 = cs(d, 19 * 60); assert.equal(listeAttente(cs(d, 18 * 60 + 45), V)[0].etat, 'proposee'); assert.equal(listeAttente(c19, V)[0].etat, 'expiree');
  const minute = delaiProposition(listeAttente(c19, V)[0], '20:00', c19.maintenant); assert.deepEqual([minute.mode, minute.expire], ['derniere-minute', `${iso}T19:15:00`]);
});

test('D · scénario 3 : trois groupes trouvent une place (dont deux tables rapprochées), la tablée de huit reste sans solution', () => {
  const d = depart('terrasse', R, REELS[0]), c = cs(d), iso = d.horloge.iso; let S = d.etat;
  const a = repliTerrasse(c, S, SALLE, iso, 'soir');
  assert.equal(a.propositions.length, 3); assert.equal(a.sansSolution.length, 1); assert.equal(a.sansSolution[0].resa.couverts, 8);
  assert.ok(a.propositions.some((p) => String(p.vers).includes('+')), 'au moins une proposition rapproche deux tables');
  assert.equal(etat('terrasse', d, S, { vus: { 'repli-ouvert': 1, 'repli-ajuste': 1 } }).faites, 2, 'regarder et ajuster ne déplacent rien');
  S = jouer(S, c, ...a.propositions.map((p) => ['placerResa', { id: p.resa.id, table: p.vers }]));
  assert.equal(etat('terrasse', d, S, { vus: { 'repli-ouvert': 1, 'repli-ajuste': 1 } }).faites, 3); const fin = etat('terrasse', d, S, { vus: { 'repli-ouvert': 1, 'repli-ajuste': 1, 'repli-bilan': 1 } });
  assert.equal(fin.fini, true); assert.match(fin.conclusion, /Marchand/);
  assert.equal(repliTerrasse(c, S, SALLE, iso, 'soir').sansSolution.length, 1, 'la tablée de huit reste à décider');
});

test('D · scénario 4 : la demande 21 h pour 4 est réellement possible ; accepter ou refuser conclut différemment', () => {
  const d = depart('client', R, REELS[0]), c = cs(d), iso = d.horloge.iso; let S = d.etat;
  const r = resasDuJour(c, S, iso).find((x) => x.id === 'sc4-camille'); assert.deepEqual([r.heure, +r.couverts, r.statut], ['20:30', 2, 'confirmee']);
  const modif = { heure: '21:00', service: 'soir', couverts: 4 };
  assert.equal(refusModifVenue(R, r, modif, { auj: iso, minute: c.minute, equipe: equipeDe(S, []) }), '', 'la page du client accepte d\'envoyer la demande');
  const demande = { 'sc4-camille': { modif } }; assert.equal(etat('client', d, S, { venues: demande }).faites, 2, 'la demande ne change pas la réservation');
  assert.deepEqual([resasDuJour(c, S, iso).find((x) => x.id === 'sc4-camille').heure], ['20:30']);
  S = jouer(S, c, ['modifierResa', { id: 'sc4-camille', champs: modif }]); const apres = resasDuJour(c, S, iso).find((x) => x.id === 'sc4-camille'); assert.deepEqual([apres.heure, +apres.couverts], ['21:00', 4]);
  const oui = etat('client', d, S, { venues: { 'sc4-camille': { reponse: { acceptee: true } } } }), non = etat('client', d, d.etat, { venues: { 'sc4-camille': { reponse: { acceptee: false } } } });
  assert.equal(oui.fini, true); assert.equal(non.fini, true); assert.match(oui.conclusion, /accepté/); assert.match(non.conclusion, /refusé/); assert.notEqual(oui.conclusion, non.conclusion);
});
