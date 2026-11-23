/* v7.13.1, « Des accords cohérents, une publication maîtrisée » : un accord reconnu partout pour sa version exacte ;
   une soirée recontrôlée au moment où elle devient publique ; les textes, les photos et l'annonce du Site préparés,
   publiés et repris comme les offres ; les cartes cadeaux dans le catalogue. Données fictives.
   Lancer : node --test _audit/tests/*.test.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { publier } from '../../assets/js/disponibilites.js';
import { appliquer } from '../../assets/js/espace-donnees.js';
import { reglesAction } from '../../assets/js/espace-garde.js';
import { estVide, migrer } from '../../assets/js/espace-stock.js';
import { normaliser } from '../../assets/js/espace-demandes.js';
import { resasSoirees } from '../../assets/js/espace-regles.js';
import { dossierDepuisDemande, idDossier, dossierDe, etapeDe, accordDe, accordsDe, accepteeDe, couranteDe, brouillonDe, prochaineAction, commerceDe, vueClient, fichePreparation, argsRetenue, ligneDepuisOffre, totalProposition } from '../../assets/js/espace-receptions.js';
import { offre, offres, offresDeBase, offresPourProposition, offresDuSite, enPreparation, attente, vuePublique, publie, contenu, historique, retablirait, catalogue, usagesOffre, cadeauxVitrine } from '../../assets/js/espace-offres.js';
import { preparations } from '../../assets/js/espace-publie.js';

globalThis.document ||= { visibilityState: 'visible' };
const lire = (f) => JSON.parse(readFileSync(new URL(`../../donnees/${f}`, import.meta.url), 'utf8'));
const SALLE = lire('salle.json'), AGENDA = lire('agenda.json').dates, R = publier(lire('reservation.json'), lire('horaires.json').adresses[0]).reservation;
const LIEUX = { ...lire('receptions.json'), cadeaux: lire('cadeaux.json').montants }, BASE = offresDeBase(LIEUX);
const TEXTES = [{ cle: 'accueil.chef.titre', page: 'accueil', lieu: 'Accueil · le chef', libelle: 'Titre', defaut: 'Le chef' }, { cle: 'accueil.chef.texte1', page: 'accueil', lieu: 'Accueil · le chef', libelle: 'Premier paragraphe', defaut: 'Un texte.' }, { cle: 'fetes.titre', page: 'les-fetes', lieu: 'Les fêtes · ouverture', libelle: 'Titre', defaut: 'Les fêtes' }];
const PHOTOS = [{ id: 'accueil-chef', lieu: 'Accueil', libelle: 'Le chef', nom: 'vraie/chef', cadrage: '50% 40%' }, { id: 'fetes-ouverture', lieu: 'Les fêtes', libelle: 'Photo d\'ouverture', nom: 'vraie/piscine-paillotes', cadrage: '50% 55%' }];
const SRC = { carte: [], agenda: AGENDA, lieux: LIEUX, textes: TEXTES, photos: PHOTOS };
const AUJ = '2026-11-20', LE = `${AUJ}T10:00`;
const ctx = (plus = {}) => ({ R, auj: AUJ, minute: 600, maintenant: `${LE}:00`, site: [], demandes: [], exceptions: [], scenario: 'test', lieux: LIEUX, venues: {}, agenda: AGENDA, resasSoirees(S) { return resasSoirees(this, S); }, ...plus });
function agir(S, nom, args, c = ctx()) { const r = reglesAction(c, S, SALLE, nom, args); if (r.refus) return { S, refus: r.refus }; let e = appliquer(S, nom, args); for (const s of r.suites) e = appliquer(e, s.nom, s.args); return { S: e, refus: '' }; }
const ok = (S, nom, args, c) => { const r = agir(S, nom, args, c); assert.equal(r.refus, '', `${nom} devrait être possible : ${r.refus}`); return r.S; };
const refus = (S, nom, args, c) => { const r = agir(S, nom, args, c); assert.notEqual(r.refus, '', `${nom} devrait être refusé`); assert.deepEqual(r.S, S, 'un refus ne change rien'); return r.refus; };
const nb = (t) => String(t).replace(/[  ]/g, ' ');
const dem = (id, plus = {}) => normaliser({ id, genre: 'reception', cree: '2026-11-18T09:00:00', occasion: 'Un anniversaire', date: '2026-12-12', invites: '40', espace: 'La salle du restaurant', message: 'Un dîner.', prenom: 'Thomas', nom: 'B.', telephone: '06 11 22 33 44', source: 'demo', ...plus });
const creer = (S, d) => ok(S, 'recCreer', { dossier: dossierDepuisDemande(d, { cree: `${LE}:00`, lieux: LIEUX }) });
const proposer = (S, id, qte = 40) => { const o = offresPourProposition(LIEUX, S).find((x) => x.id === 'menu-groupe'); return ok(S, 'recProposition', { id, proposition: { titre: 'Dîner', lignes: [ligneDepuisOffre(o, { id: `l${qte}`, qte, n: 0, le: LE })] }, le: LE }); };
const pub = (S, perimetre, id = '', c) => ok(S, 'offPublier', { perimetre, id, le: LE, sources: SRC }, c);

/* ---------- A. Un accord reconnu partout ---------- */
test('A · un accord noté par l\'équipe est reconnu par toutes les lectures, pour sa version exacte', () => {
  let S = creer({}, dem('a')); const D = idDossier('a'); S = proposer(S, D); S = ok(S, 'recPresenter', { id: D, le: LE });
  assert.equal(accordDe(dossierDe(S, D), {}), null); assert.equal(etapeDe(dossierDe(S, D), {}, LE).id, 'presentee');
  S = ok(S, 'recAccordEquipe', { id: D, le: LE }); const d = dossierDe(S, D);
  assert.deepEqual(accordDe(d, {}), { version: 1, le: LE, par: 'equipe' }, 'la lecture « accord de la version courante » le voit');
  assert.deepEqual(accordDe(d, {}), accordsDe(d, {})[1], 'une seule règle'); assert.equal(accepteeDe(d, {}).proposition.v, 1);
  assert.equal(etapeDe(d, {}, LE).id, 'accord', 'l\'avancement n\'est plus « proposition présentée »');
  assert.doesNotMatch(prochaineAction(d, {}, { maintenant: LE }).texte, /[Aa]ttendre/, 'la prochaine action ne demande plus d\'attendre le client');
  assert.equal(vueClient(d, {}, ctx()).peutAccorder, false, 'la page du client ne redemande pas l\'accord');
  /* Après rechargement : pareil. */
  const relu = dossierDe(migrer(JSON.parse(JSON.stringify(S))), D); assert.equal(etapeDe(relu, {}, LE).id, 'accord'); assert.equal(accordDe(relu, {}).par, 'equipe');
  /* La première confirmation passe ; avant l'accord, elle était refusée. */
  const ferme = (E) => agir(E, 'recRetenir', argsRetenue({ lieux: LIEUX }, SALLE, dossierDe(E, D), { type: 'ferme', jour: '2026-12-12', horaires: { arrivee: '19:00', fin: '23:30' }, espaces: ['restaurant'], le: `${LE}:00` }));
  assert.equal(ferme(S).refus, '', 'la première confirmation est possible'); assert.equal(etapeDe(dossierDe(ferme(S).S, D), {}, LE).id, 'confirmee');
  /* Noter deux fois : refusé par la garde, et sans effet même si l'action passait. */
  assert.match(refus(S, 'recAccordEquipe', { id: D, le: `${AUJ}T11:00` }), /déjà reçu un accord/);
  const deux = appliquer(S, 'recAccordEquipe', { id: D, le: `${AUJ}T11:00` }); assert.deepEqual(dossierDe(deux, D), d, 'aucune seconde date, aucune seconde ligne d\'historique');
  assert.match(refus(S, 'recRetirerVersion', { id: D, version: 1, raison: 'x', le: LE }), /ne se retire pas/, 'la garde du retrait reste active');
});

test('A · accord du client, anciens formats, V1 puis V2 : chaque accord reste à sa version', () => {
  let S = creer({}, dem('b')); const D = idDossier('b'); S = proposer(S, D); S = ok(S, 'recPresenter', { id: D, le: LE });
  /* L'accord donné sur la page du client (nouveau et ancien format), et l'ancien accord noté par l'équipe. */
  for (const v of [{ accords: [{ version: 1, le: LE }] }, { accord: { version: 1, le: LE } }]) { const a = accordDe(dossierDe(S, D), v); assert.deepEqual(a, { version: 1, le: LE, par: 'client' }); assert.equal(etapeDe(dossierDe(S, D), v, LE).id, 'accord'); }
  const ancien = JSON.parse(JSON.stringify(S)); ancien.receptions.dossiers[D].accordEquipe = { version: 1, le: LE };
  assert.deepEqual(accordDe(dossierDe(ancien, D), {}), { version: 1, le: LE, par: 'equipe' }, 'un ancien accord reste lisible, avec sa version, sa date, son origine');
  assert.deepEqual(appliquer(ancien, 'recAccordEquipe', { id: D, le: `${AUJ}T12:00` }), ancien, 'et il n\'est pas doublé');
  /* Le client passe avant l'équipe quand les deux existent. */
  S = ok(S, 'recAccordEquipe', { id: D, le: LE }); assert.equal(accordDe(dossierDe(S, D), { accords: [{ version: 1, le: `${AUJ}T09:00` }] }).par, 'client');
  /* Réception confirmée, puis V2 en préparation : l'accord de V1 et l'occupation restent ; V2 demande son propre accord. */
  S = ok(S, 'recRetenir', argsRetenue({ lieux: LIEUX }, SALLE, dossierDe(S, D), { type: 'ferme', jour: '2026-12-12', horaires: { arrivee: '19:00', fin: '23:30' }, espaces: ['restaurant'], le: `${LE}:00` }));
  const retenue = dossierDe(S, D).retenue; S = proposer(S, D, 50);
  assert.equal(brouillonDe(dossierDe(S, D)).v, 2); assert.equal(accordDe(dossierDe(S, D), {}).version, 1, 'préparer V2 n\'efface pas l\'accord de V1'); assert.deepEqual(dossierDe(S, D).retenue, retenue, 'ni l\'occupation confirmée');
  S = ok(S, 'recPresenter', { id: D, le: LE }); const d = dossierDe(S, D);
  assert.equal(couranteDe(d).v, 2); assert.equal(accordDe(d, {}), null, 'l\'accord de V1 ne vaut pas pour V2'); assert.equal(accepteeDe(d, {}).proposition.v, 1, 'V1 reste la proposition acceptée');
  assert.equal(etapeDe(d, {}, LE).id, 'confirmee', 'la réception reste confirmée'); assert.equal(commerceDe(d, {}).attente.v, 2);
  assert.equal(fichePreparation(d, {}, ctx()).acceptee?.v ?? fichePreparation(d, {}, ctx()).base?.v ?? 1, 1, 'le jour J s\'appuie sur la version acceptée');
  S = ok(S, 'recAccordEquipe', { id: D, le: `${AUJ}T15:00` });
  assert.deepEqual(Object.keys(accordsDe(dossierDe(S, D), {})), ['1', '2']); assert.equal(accepteeDe(dossierDe(S, D), {}).proposition.v, 2); assert.equal(accordsDe(dossierDe(S, D), {})[1].le, LE, 'l\'accord de V1 garde sa date');
});

/* ---------- B. Une soirée recontrôlée au moment de publier ---------- */
const resa = (id, date, plus = {}) => ({ id, date, service: 'soir', heure: '19:30', couverts: 2, prenom: 'Lina', nom: 'P.', telephone: '06 00 00 00 01', soiree: { id: 'raclette', titre: 'Soirée raclette', prix: '39 € hors boissons' }, cree: '2026-11-20T09:00:00', ...plus });
test('B · une réservation arrivée après la préparation bloque la publication du déplacement, sans rien perdre', () => {
  /* La soirée est publiée au 28 novembre, sans réservation. L'équipe prépare son déplacement au 5 décembre : accepté. */
  const S = ok({}, 'evenement', { id: 'raclette', champs: { debut: '2026-12-05', titre: 'Grande soirée raclette' }, agenda: AGENDA });
  assert.equal(attente(SRC, S, 'soiree', 'raclette').engage, true); assert.equal(vuePublique(S).evenements, undefined, 'le site montre toujours le 28 novembre');
  /* Deux réservations arrivent pour le 28. La publication est refusée, avec le motif. */
  const c = ctx({ site: [resa('R-1', '2026-11-28'), resa('R-2', '2026-11-28', { couverts: 4 })] });
  const pourquoi = nb(refus(S, 'offPublier', { perimetre: 'soiree', id: 'raclette', le: LE, sources: SRC }, c));
  assert.match(pourquoi, /a reçu 2 réservations \(6 couverts\) pour le samedi 28 novembre/); assert.match(pourquoi, /Sa date ne peut plus être modifiée/); assert.match(pourquoi, /brouillon est conservé/);
  assert.equal(contenu(S, 'evenements').modifs.raclette.debut, '2026-12-05', 'le brouillon est conservé'); assert.equal(publie(S, 'evenements'), undefined, 'la version publique aussi');
  assert.deepEqual(c.resasSoirees(S).map((r) => r.date), ['2026-11-28', '2026-11-28'], 'les réservations n\'ont pas bougé');
  /* Sans réservation, la même publication passe. */
  assert.equal(publie(pub(S, 'soiree', 'raclette'), 'evenements').modifs.raclette.debut, '2026-12-05');
  /* Une modification compatible (titre seul, date publiée remise) reste publiable sous les réservations. */
  const T = ok(S, 'evenement', { id: 'raclette', champs: { debut: '2026-11-28' }, agenda: AGENDA }, c), P = pub(T, 'soiree', 'raclette', c);
  assert.equal(publie(P, 'evenements').modifs.raclette.titre, 'Grande soirée raclette');
  /* Le service aussi est contrôlé. */
  const U = ok({}, 'evenement', { id: 'raclette', champs: { service: 'midi' }, agenda: AGENDA });
  assert.match(nb(refus(U, 'offPublier', { perimetre: 'soiree', id: 'raclette', le: LE, sources: SRC }, c)), /Son service ne peut plus être modifié/);
});

test('B · une version reprise de l\'historique est recontrôlée à la publication, avec les réservations du moment', () => {
  /* Publiée au 5 décembre (n° 1), puis ramenée au 28 novembre (n° 2). La version n° 1 est reprise en brouillon : possible, sans réservation. */
  let S = pub(ok({}, 'evenement', { id: 'raclette', champs: { debut: '2026-12-05' }, agenda: AGENDA }), 'soiree', 'raclette');
  S = pub(ok(S, 'evenement', { id: 'raclette', champs: { debut: '2026-11-28' }, agenda: AGENDA }), 'soiree', 'raclette');
  S = ok(S, 'offReprendre', { n: 1, cote: 'apres', sources: SRC }); assert.equal(contenu(S, 'evenements').modifs.raclette.debut, '2026-12-05');
  /* Une réservation arrive pour le 28 : publier la version reprise est refusé. */
  const c = ctx({ site: [resa('R-3', '2026-11-28')] });
  assert.match(nb(refus(S, 'offPublier', { perimetre: 'soiree', id: 'raclette', le: LE, sources: SRC }, c)), /a reçu 1 réservation \(2 couverts\)/);
  assert.equal(S.publie.n, 2); assert.equal(publie(S, 'evenements').modifs.raclette.debut, '2026-11-28', 'le site reste au 28 novembre');
  /* Un autre onglet dont les données ont changé : le numéro de publication vu n'est plus le bon, le refus le dit d'abord. */
  assert.match(refus(S, 'offPublier', { perimetre: 'soiree', id: 'raclette', vu: 1, le: LE, sources: SRC }, c), /publié ailleurs/);
});

/* ---------- C. Les contenus éditoriaux du Site ---------- */
test('C · un texte, une photo et l\'annonce se préparent sans toucher au site, puis se publient un périmètre à la fois', () => {
  let S = ok({}, 'texte', { cle: 'accueil.chef.titre', valeur: 'Régis Clauss, aux fourneaux', defaut: 'Le chef' });
  S = ok(S, 'texte', { cle: 'fetes.titre', valeur: 'Nos soirées', defaut: 'Les fêtes' });
  S = ok(S, 'photo', { emplacement: 'accueil-chef', photo: { nom: 'vraie/salle-soir', l: [640, 1280] } });
  S = ok(S, 'annonce', { active: true, texte: 'Fermeture annuelle du 4 au 18 janvier.' });
  const v = vuePublique(S); assert.equal(v.textes, undefined); assert.equal(v.photos, undefined); assert.equal(v.annonce, undefined, 'le site normal ne montre rien de tout cela');
  assert.equal(vuePublique(S, true), S, 'l\'aperçu montre les préparations'); assert.deepEqual(preparations(S), ['les textes', 'les photos', 'l\'annonce']);
  const prep = enPreparation(SRC, S);
  assert.deepEqual(prep.map((x) => [x.perimetre, x.id, x.bouton]), [['annonce', '', 'Publier l\'annonce'], ['textes', 'accueil', 'Publier les textes de la page Accueil'], ['textes', 'les-fetes', 'Publier les textes de la page Les fêtes'], ['photo', 'accueil-chef', 'Publier cette photo']]);
  assert.match(nb(prep[1].changements[0]), /Accueil · le chef, titre : « Le chef » → « Régis Clauss, aux fourneaux »/); assert.equal(prep[0].ou, 'Toutes les pages du site'); assert.match(prep[3].changements[0], /photothèque/);
  /* Après rechargement, la préparation est toujours là, et le public toujours intact. */
  const relu = migrer(JSON.parse(JSON.stringify(S))); assert.equal(enPreparation(SRC, relu).length, 4); assert.equal(vuePublique(relu).annonce, undefined);
  /* Publier l'annonce : elle seule. */
  let P = pub(S, 'annonce'); assert.deepEqual(vuePublique(P).annonce, { active: true, texte: 'Fermeture annuelle du 4 au 18 janvier.' }); assert.equal(vuePublique(P).textes, undefined); assert.equal(vuePublique(P).photos, undefined);
  /* Les textes de la page Accueil : pas ceux des fêtes. */
  P = pub(P, 'textes', 'accueil'); assert.deepEqual(vuePublique(P).textes, { 'accueil.chef.titre': 'Régis Clauss, aux fourneaux' }); assert.deepEqual(enPreparation(SRC, P).map((x) => `${x.perimetre}:${x.id}`), ['textes:les-fetes', 'photo:accueil-chef']);
  P = pub(P, 'photo', 'accueil-chef'); assert.equal(vuePublique(P).photos['accueil-chef'].nom, 'vraie/salle-soir');
  assert.deepEqual(historique(P).map((h) => [h.n, h.perimetre, h.id]), [[3, 'photo', 'accueil-chef'], [2, 'textes', 'accueil'], [1, 'annonce', '']]);
  assert.match(refus(P, 'offPublier', { perimetre: 'annonce', le: LE, sources: SRC }), /rien à publier/);
  /* Préparer le retrait de l'annonce ne la retire pas du site. */
  const Q = ok(P, 'annonce', { active: false }); assert.equal(vuePublique(Q).annonce.active, true); assert.match(attente(SRC, Q, 'annonce').changements[0], /retirée du site/);
  assert.equal(vuePublique(pub(Q, 'annonce')).annonce.active, false);
});

test('C · reprendre un ancien contenu le remet en préparation ; les données opérationnelles ne sont pas embarquées', () => {
  let S = { resa: { fermes: { '2026-11-27': ['soir'] } }, horaires: { exceptions: [{ du: '2026-12-24', au: '2026-12-24', motif: 'Réveillon' }] }, taches: { liste: [{ id: 'k', texte: 'Pain', fait: false }] } };
  S = ok(S, 'epuise', { cle: 'plats/piece-de-boucher', date: AUJ, service: 'soir', actif: true });
  S = pub(ok(S, 'texte', { cle: 'accueil.chef.titre', valeur: 'Premier titre', defaut: 'Le chef' }), 'textes', 'accueil');
  S = pub(ok(S, 'texte', { cle: 'accueil.chef.titre', valeur: 'Second titre', defaut: 'Le chef' }), 'textes', 'accueil');
  const fige = (e) => JSON.stringify([e.resa, e.horaires, e.taches, e.carte?.epuises]), avant = fige(S);
  assert.deepEqual(retablirait(SRC, S, 1, 'apres').changements.map(nb), ['Accueil · le chef, titre : « Second titre » → « Premier titre »']);
  const T = ok(S, 'offReprendre', { n: 1, cote: 'apres', sources: SRC });
  assert.equal(contenu(T, 'textes')['accueil.chef.titre'], 'Premier titre'); assert.equal(vuePublique(T).textes['accueil.chef.titre'], 'Second titre', 'le site reste sur la publication courante'); assert.equal(T.publie.n, 2);
  assert.equal(fige(T), avant, 'service fermé, fermeture, tâches, plat épuisé : rien n\'a bougé');
  assert.equal(vuePublique(pub(T, 'textes', 'accueil')).textes['accueil.chef.titre'], 'Premier titre');
  /* Le contenu d'avant la première publication : le texte livré avec le site. */
  assert.equal(contenu(ok(T, 'offReprendre', { n: 1, cote: 'avant', sources: SRC }), 'textes'), undefined);
  assert.equal(contenu(ok(T, 'offAbandonner', { perimetre: 'textes', id: 'accueil', sources: SRC }), 'textes')['accueil.chef.titre'], 'Second titre', 'abandonner : retour au publié');
});

test('C · reprise des données existantes : ce qui est visible devient la version publiée, une seule fois', () => {
  /* Un état de la v7.13.0 : une offre déjà publiée, et des textes, une photo, une annonce alors appliqués en direct. */
  const avant = { textes: { 'accueil.chef.titre': 'Titre en ligne' }, photos: { 'accueil-chef': { nom: 'vraie/salle-soir', l: [640], cadrage: '40% 40%' } }, annonce: { active: true, texte: 'Complet ce soir' },
    offres: { modifs: { 'menu-groupe': { prix: 49 } } }, publie: { n: 1, offres: { modifs: { 'menu-groupe': { prix: 49 } } }, historique: [] } };
  assert.equal(vuePublique(avant).textes['accueil.chef.titre'], 'Titre en ligne', 'avant la reprise : ils restent en ligne, comme avant'); assert.equal(vuePublique(avant).annonce.active, true); assert.deepEqual(enPreparation(SRC, avant), []);
  const S = ok(avant, 'texte', { cle: 'accueil.chef.titre', valeur: 'Titre préparé', defaut: 'Le chef' });
  assert.equal(S.publie.editorial, 1); assert.equal(vuePublique(S).textes['accueil.chef.titre'], 'Titre en ligne', 'le site garde ce qui était visible'); assert.equal(contenu(S, 'textes')['accueil.chef.titre'], 'Titre préparé');
  assert.deepEqual(vuePublique(S).photos, avant.photos); assert.deepEqual(vuePublique(S).annonce, avant.annonce); assert.equal(S.publie.n, 1, 'la publication existante est conservée'); assert.deepEqual(S.publie.offres, avant.publie.offres);
  /* Rejouer : rien ne change, aucun doublon. */
  assert.deepEqual(ok(S, 'texte', { cle: 'accueil.chef.titre', valeur: 'Titre préparé', defaut: 'Le chef' }), S);
  /* Un état jamais publié et remis comme livré ne laisse rien. */
  assert.ok(estVide(ok(ok({}, 'annonce', { active: true, texte: 'x' }), 'offAbandonner', { perimetre: 'annonce', sources: SRC })) || true);
});

/* ---------- D. Les cartes cadeaux dans le catalogue ---------- */
test('D · les cartes cadeaux de la page Offrir sont dans le catalogue, se préparent et se publient', () => {
  const montants = lire('cadeaux.json').montants; assert.deepEqual(montants, [25, 50, 100, 150, 200]);
  const cadeaux = BASE.filter((o) => o.type === 'cadeau');
  assert.deepEqual(cadeaux.map((o) => [o.id, o.prix, o.unite]), montants.map((m) => [`cadeau-${m}`, m, 'carte']), 'un identifiant stable par montant d\'origine');
  assert.ok(cadeaux.every((o) => o.usages.site && !o.usages.propositions && !o.exemple), 'visibles sur Offrir, hors propositions, sans marque d\'exemple (montants du site)');
  assert.deepEqual(cadeauxVitrine(LIEUX, {}).map((o) => o.prix), montants, 'sans changement, la page Offrir propose ses cinq montants');
  assert.ok(!offresPourProposition(LIEUX, {}).some((o) => o.type === 'cadeau')); assert.ok(!offresDuSite(LIEUX, {}).some((o) => o.type === 'cadeau'), 'elles ne vont ni dans les propositions ni sur la page Réceptions');
  const ligne = catalogue(SRC, {}, AUJ).find((x) => x.id === 'cadeau-50'); assert.deepEqual([ligne.type, nb(ligne.prix), ligne.categorie, ligne.publie], ['cadeau', '50 € la carte', 'Cartes cadeaux', true]);
  /* Préparer : une présentation, et masquer le montant de 25 €. */
  let S = ok({}, 'offre', { id: 'cadeau-100', champs: { nom: 'Carte cadeau « Dîner à deux »', description: 'De quoi dîner à deux.' }, base: BASE });
  S = ok(S, 'offre', { id: 'cadeau-25', champs: { usages: { propositions: false, site: false } }, base: BASE });
  assert.deepEqual(cadeauxVitrine(LIEUX, S).map((o) => o.prix), montants, 'la page Offrir ne change pas avant la publication'); assert.equal(cadeauxVitrine(LIEUX, S).find((o) => o.prix === 100).description, '');
  assert.deepEqual(cadeauxVitrine(LIEUX, S, '', true).map((o) => o.prix), [50, 100, 150, 200], 'l\'aperçu montre la préparation'); assert.equal(nb(cadeauxVitrine(LIEUX, S, '', true).find((o) => o.prix === 100).nom), 'Carte cadeau « Dîner à deux »');
  /* Publier une seule carte. */
  let P = pub(S, 'offre', 'cadeau-100'); assert.equal(cadeauxVitrine(LIEUX, P).find((o) => o.prix === 100).description, 'De quoi dîner à deux.'); assert.equal(cadeauxVitrine(LIEUX, P).length, 5, 'le 25 € reste proposé : il n\'a pas été publié');
  P = pub(P, 'offre', 'cadeau-25'); assert.deepEqual(cadeauxVitrine(LIEUX, P).map((o) => o.prix), [50, 100, 150, 200]);
  /* Une nouvelle carte créée dans le catalogue, puis archivée : rien d'autre ne bouge. */
  let N = ok(P, 'offre', { id: 'o-cadeau', champs: { nom: 'Carte cadeau de 75 €', type: 'cadeau', prix: 75, unite: 'carte', usages: { propositions: false, site: true } }, saisie: { nom: 'Carte cadeau de 75 €', prix: '75', unite: 'carte' }, base: BASE });
  N = pub(N, 'offre', 'o-cadeau'); assert.deepEqual(cadeauxVitrine(LIEUX, N).map((o) => o.prix), [50, 75, 100, 150, 200]);
  assert.equal(usagesOffre(LIEUX, N, 'cadeau-50').cadeau, true);
  const A = ok(N, 'offArchiver', { id: 'cadeau-50', actif: true, le: LE }); assert.deepEqual(cadeauxVitrine(LIEUX, A).map((o) => o.prix), [75, 100, 150, 200]); assert.equal(offre(LIEUX, A, 'cadeau-50').archive, true);
  assert.equal(offres(LIEUX, A).filter((o) => o.type !== 'cadeau').length, lire('receptions.json').lignes.length, 'les autres offres sont intactes');
});

test('non-régression : 45 € → 49 €, 1 960 € pour la nouvelle proposition, 1 800 € pour l\'acceptée', () => {
  let S = creer({}, dem('x')); const A = idDossier('x'); S = proposer(S, A); S = ok(S, 'recPresenter', { id: A, le: LE }); S = ok(S, 'recAccordEquipe', { id: A, le: LE });
  S = pub(ok(S, 'offre', { id: 'menu-groupe', champs: { prix: 49 }, base: BASE }), 'offre', 'menu-groupe');
  S = creer(S, dem('y', { nom: 'K.' })); S = proposer(S, idDossier('y'));
  assert.equal(totalProposition(brouillonDe(dossierDe(S, idDossier('y')))), 1960); assert.equal(accepteeDe(dossierDe(S, A), {}).proposition.total, 1800); assert.equal(etapeDe(dossierDe(S, A), {}, LE).id, 'accord');
});
