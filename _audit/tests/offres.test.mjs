/* v7.13.0, « Les offres prennent vie » : le catalogue commun, la version publiée et le contenu en préparation,
   « épuisé » pour un service, les soirées liées à leurs réservations, l'historique et la restauration, les offres
   copiées dans les propositions, la reprise des options d'avant la v7.12.1, la sixième démonstration.
   Tout est joué avec des données fictives. Lancer : node --test _audit/tests/*.test.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { publier, occupationsActives, prisesDuService, etatService, equipeDe, serviceCourant } from '../../assets/js/disponibilites.js';
import { appliquer } from '../../assets/js/espace-donnees.js';
import { reglesAction } from '../../assets/js/espace-garde.js';
import { estVide, migrer } from '../../assets/js/espace-stock.js';
import { normaliser } from '../../assets/js/espace-demandes.js';
import { creerDepotServeur } from '../../assets/js/espace-serveur.js';
import { resasSoirees, resasDuJour, evenements as evenementsDe } from '../../assets/js/espace-regles.js';
import { carteDe, platsDe, estEpuise } from '../../assets/js/espace-carte.js';
import { SCENARIOS, depart, avancement, sauts } from '../../assets/js/espace-scenarios.js';
import { dossierDepuisDemande, idDossier, dossierDe, etatRetenue, completerRetenue, retenuesAReprendre, argsRetenue, accepteeDe, couranteDe, brouillonDe, totalProposition, ligneDepuisOffre, actualisation, actualiser } from '../../assets/js/espace-receptions.js';
import { offres, offre, offresDeBase, offresPourProposition, offresDuSite, enPreparation, attente, vuePublique, publie, contenu, validerOffre, lirePrixOffre, usagesOffre, historique, versions, retablirait, refusSoiree, resasDeSoiree, catalogue, changementsSoiree } from '../../assets/js/espace-offres.js';
import { offresVitrine } from '../../assets/js/espace-publie.js';

globalThis.document ||= { visibilityState: 'visible' };
const lire = (f) => JSON.parse(readFileSync(new URL(`../../donnees/${f}`, import.meta.url), 'utf8'));
const SALLE = lire('salle.json'), LIEUX = lire('receptions.json'), AGENDA = lire('agenda.json').dates, R = publier(lire('reservation.json'), lire('horaires.json').adresses[0]).reservation;
const CARTE = lire('carte.json').rubriques.map((r) => ({ id: r.id, titre: r.titre, plats: r.plats.map((p) => ({ id: p.id, nom: p.nom, description: p.description || '', prix: p.prix ?? '', vegetarien: !!p.vegetarien })) }));
const SRC = { carte: CARTE, agenda: AGENDA, lieux: LIEUX }, BASE = offresDeBase(LIEUX);
/* Vendredi 20 novembre 2026, 10 h. Seules les réservations et les réceptions posées par le test existent. */
const AUJ = '2026-11-20', ctx = (plus = {}) => ({ R, auj: AUJ, minute: 10 * 60, maintenant: `${AUJ}T10:00:00`, site: [], demandes: [], exceptions: [], scenario: 'test', lieux: LIEUX, venues: {}, agenda: AGENDA, resasSoirees(S) { return resasSoirees(this, S); }, ...plus });
function agir(S, nom, args, c = ctx()) { const r = reglesAction(c, S, SALLE, nom, args); if (r.refus) return { S, refus: r.refus }; let e = appliquer(S, nom, args); for (const s of r.suites) e = appliquer(e, s.nom, s.args); return { S: e, refus: '' }; }
const ok = (S, nom, args, c) => { const r = agir(S, nom, args, c); assert.equal(r.refus, '', `${nom} devrait être possible : ${r.refus}`); return r.S; };
const refus = (S, nom, args, c) => { const r = agir(S, nom, args, c); assert.notEqual(r.refus, '', `${nom} devrait être refusé`); assert.deepEqual(r.S, S, 'un refus ne change rien'); return r.refus; };
const nb = (t) => String(t).replace(/[  ]/g, ' ');
const dem = (id, plus = {}) => normaliser({ id, genre: 'reception', cree: '2026-11-18T09:00:00', occasion: 'Un anniversaire', date: '2026-12-12', invites: '40', espace: 'La salle du restaurant', message: 'Un dîner.', prenom: 'Thomas', nom: 'B.', telephone: '06 11 22 33 44', source: 'demo', ...plus });
const creer = (S, d, c = ctx()) => ok(S, 'recCreer', { dossier: dossierDepuisDemande(d, { cree: c.maintenant, lieux: LIEUX }) }, c);
const LE = `${AUJ}T10:00`;
const publierOffre = (S, id) => ok(S, 'offPublier', { perimetre: 'offre', id, le: LE, sources: SRC });
const prix = (S, id, version) => offre(LIEUX, S, id, version).prix;

/* ---------- Le catalogue commun ---------- */
test('catalogue : les prestations livrées gardent leur identifiant, leur prix d\'exemple et une unité explicite', () => {
  assert.deepEqual(BASE.map((o) => o.id), LIEUX.lignes.map((l) => l.id), 'les anciens identifiants sont ceux du catalogue');
  const m = offre(LIEUX, {}, 'menu-groupe'); assert.equal(m.prix, 45); assert.equal(m.unite, 'personne'); assert.equal(m.exemple, true, 'un montant d\'exemple reste marqué'); assert.equal(m.type, 'formule');
  assert.equal(offre(LIEUX, {}, 'privatisation').unite, 'forfait'); assert.ok(BASE.every((o) => o.usages.propositions && !o.usages.site), 'aucune offre d\'exemple n\'est sur le site sans décision du restaurant');
  const c = catalogue({ ...SRC, produits: [{ id: 'escargots', nom: 'Escargots', prix: 18, unite: 'piece' }] }, {}, AUJ);
  assert.deepEqual([...new Set(c.map((x) => x.type))].sort(), ['emporter', 'formule', 'plat', 'prestation', 'soiree'], 'tous les métiers dans un seul catalogue');
  assert.equal(c.find((x) => x.type === 'emporter').lecture, true); assert.ok(c.every((x) => x.id && x.nom && x.prix), 'chaque offre a un nom et un prix lisible');
});

test('cas d\'erreur : prix invalide, unité manquante, période incohérente ; un prix vide n\'est jamais gratuit', () => {
  assert.equal(lirePrixOffre('49'), 49); assert.equal(lirePrixOffre('49,50 €'), 49.5); assert.equal(lirePrixOffre(''), ''); assert.equal(lirePrixOffre('-4'), null); assert.equal(lirePrixOffre('quarante'), null); assert.equal(lirePrixOffre('12,345'), null);
  const bon = { nom: 'Menu', prix: '49', unite: 'personne' };
  assert.deepEqual(validerOffre(bon), []); assert.deepEqual(validerOffre({ ...bon, prix: '' }), [], 'un prix vide est accepté : « à définir »');
  assert.equal(validerOffre({ ...bon, prix: '-4' })[0].champ, 'prix'); assert.equal(validerOffre({ ...bon, unite: '' })[0].champ, 'unite'); assert.equal(validerOffre({ ...bon, nom: ' ' })[0].champ, 'nom');
  assert.equal(validerOffre({ ...bon, periode: { du: '2026-12-10', au: '2026-12-01' } })[0].champ, 'periode');
  /* La garde refuse d'enregistrer, et ne change rien. */
  assert.match(refus({}, 'offre', { id: 'menu-groupe', champs: { prix: null }, saisie: { nom: 'Menu', prix: 'abc', unite: 'personne' }, base: BASE }), /nombre positif/);
  assert.match(refus({}, 'offre', { id: 'menu-groupe', champs: {}, saisie: { nom: 'Menu', prix: '49', unite: '' }, base: BASE }), /unité/);
  /* Sans prix : « à définir », pas dans les propositions (elle ne vaut pas zéro). */
  const S = ok({}, 'offre', { id: 'o-1', champs: { nom: 'Cocktail', prix: '', unite: 'personne' }, saisie: { nom: 'Cocktail', prix: '', unite: 'personne' }, base: BASE });
  assert.equal(offre(LIEUX, S, 'o-1').prix, ''); assert.equal(catalogue(SRC, S, AUJ).find((x) => x.id === 'o-1').prix, 'Prix à définir');
  const P = publierOffre(S, 'o-1'); assert.ok(!offresPourProposition(LIEUX, P).some((o) => o.id === 'o-1'), 'une offre sans prix n\'est pas proposée');
});

/* ---------- Brouillon, publié, aperçu ---------- */
test('critère 3 : un prix modifié en brouillon ne change pas le site ; la page publique lit le prix publié', () => {
  const S = ok({}, 'offre', { id: 'menu-groupe', champs: { prix: 49 }, base: BASE });
  assert.equal(prix(S, 'menu-groupe'), 49); assert.equal(prix(S, 'menu-groupe', 'publie'), 45, 'le publié reste à 45 €');
  assert.deepEqual(vuePublique(S).offres || {}, {}, 'la vue du site ne porte pas le brouillon');
  assert.deepEqual(attente(SRC, S, 'offre', 'menu-groupe').changements.map(nb), ['Prix : 45 € → 49 €']);
  /* « Rechargement », autre onglet, retour dans l'espace : l'état est lu depuis le stockage, il dit la même chose. */
  const relu = migrer(JSON.parse(JSON.stringify(S))); assert.equal(prix(relu, 'menu-groupe', 'publie'), 45); assert.equal(prix(relu, 'menu-groupe'), 49);
  /* Remettre le prix d'avant : plus rien n'attend, et rien ne reste dans l'état. */
  assert.ok(estVide(ok(S, 'offre', { id: 'menu-groupe', champs: { prix: 45 }, base: BASE })));
});

test('critère 4 : l\'aperçu montre le contenu en préparation, sans rien publier', () => {
  let S = ok({}, 'offre', { id: 'menu-groupe', champs: { usages: { propositions: true, site: true } }, base: BASE }); S = publierOffre(S, 'menu-groupe');
  S = ok(S, 'offre', { id: 'menu-groupe', champs: { prix: 49 }, base: BASE });
  assert.equal(offresDuSite(LIEUX, S, AUJ)[0].prix, 45, 'le site : 45 €'); assert.equal(offresDuSite(LIEUX, S, AUJ, true)[0].prix, 49, 'l\'aperçu : 49 €');
  assert.equal(offresVitrine({ lignes: LIEUX.lignes }, S, AUJ, false)[0].prix, 45); assert.equal(offresVitrine({ lignes: LIEUX.lignes }, S, AUJ, true)[0].prix, 49);
  assert.equal(S.publie.n, 1, 'regarder l\'aperçu ne publie rien'); assert.equal(vuePublique(S, true), S, 'l\'aperçu lit l\'état en préparation');
});

test('critère 5 : publier une offre ne publie qu\'elle ; les autres brouillons restent en préparation', () => {
  let S = ok({}, 'offre', { id: 'menu-groupe', champs: { prix: 49 }, base: BASE });
  S = ok(S, 'offre', { id: 'aperitif', champs: { prix: 14 }, base: BASE });
  S = ok(S, 'plat', { cle: 'entrees/l-os-a-moelle', champs: { prix: 11 }, base: CARTE });
  S = ok(S, 'ardoise', { ardoise: { jour: { titre: 'Ce midi', lignes: [{ plat: 'Blanquette', prix: '19 €' }], mot: '' }, soir: { titre: 'Ce soir', lignes: [], mot: '' } } });
  S = ok(S, 'evenement', { id: 'raclette', champs: { titre: 'Grande soirée raclette' }, agenda: AGENDA });
  assert.deepEqual(enPreparation(SRC, S).map((x) => `${x.perimetre}:${x.id}`).sort(), ['ardoise:', 'carte:', 'offre:aperitif', 'offre:menu-groupe', 'soiree:raclette']);
  assert.deepEqual(enPreparation(SRC, S).map((x) => x.bouton).sort(), ['Publier cette offre', 'Publier cette offre', 'Publier cette soirée', 'Publier l\'ardoise', 'Publier les modifications de la carte']);
  const P = publierOffre(S, 'menu-groupe');
  assert.equal(prix(P, 'menu-groupe', 'publie'), 49); assert.equal(prix(P, 'aperitif', 'publie'), 12, 'l\'autre offre n\'est pas publiée');
  assert.deepEqual(enPreparation(SRC, P).map((x) => `${x.perimetre}:${x.id}`).sort(), ['ardoise:', 'carte:', 'offre:aperitif', 'soiree:raclette']);
  const v = vuePublique(P); assert.equal(v.carte, undefined, 'la carte du site n\'a pas bougé'); assert.equal(v.ardoise, undefined); assert.equal(v.evenements, undefined);
  /* La carte, à son tour : elle seule. */
  const Q = ok(P, 'offPublier', { perimetre: 'carte', le: LE, sources: SRC });
  assert.equal(vuePublique(Q).carte.modifs['entrees/l-os-a-moelle'].prix, 11); assert.equal(vuePublique(Q).ardoise, undefined);
  assert.deepEqual(historique(Q).map((h) => [h.n, h.perimetre, h.id]), [[2, 'carte', ''], [1, 'offre', 'menu-groupe']]);
  assert.match(refus(Q, 'offPublier', { perimetre: 'carte', le: LE, sources: SRC }), /rien à publier/, 'rien à publier : pas de faux succès');
});

test('cas d\'erreur : une publication faite ailleurs entre-temps est refusée et expliquée', () => {
  const S = ok({}, 'offre', { id: 'menu-groupe', champs: { prix: 49 }, base: BASE }), vu = S.publie?.n || 0;
  const ailleurs = ok(ok(S, 'offre', { id: 'aperitif', champs: { prix: 14 }, base: BASE }), 'offPublier', { perimetre: 'offre', id: 'aperitif', le: LE, sources: SRC });
  assert.match(refus(ailleurs, 'offPublier', { perimetre: 'offre', id: 'menu-groupe', vu, le: LE, sources: SRC }), /publié ailleurs.*Rien n'a été publié/);
  assert.equal(prix(ok(ailleurs, 'offPublier', { perimetre: 'offre', id: 'menu-groupe', vu: ailleurs.publie.n, le: LE, sources: SRC }), 'menu-groupe', 'publie'), 49, 'après relecture, la publication passe');
});

test('reprise : ce qui était visible avant la v7.13.0 devient la version publiée, sans rien réinitialiser', () => {
  /* Un état d'avant : tout changement était aussitôt en ligne ; il n'y a pas de `publie`. */
  const avant = { carte: { modifs: { 'entrees/l-os-a-moelle': { prix: 11 } }, epuises: { 'plats/piece-de-boucher': AUJ }, ajouts: [{ id: 'x1', rubrique: 'desserts', nom: 'Tarte au citron', description: '', prix: 9, vegetarien: false, allergenes: [] }] }, ardoise: { jour: { titre: 'Ce midi', lignes: [{ plat: 'Blanquette', prix: '19 €' }], mot: '' } },
    evenements: { modifs: { raclette: { titre: 'Grande soirée raclette' } }, liste: [] } };
  assert.equal(vuePublique(avant), avant, 'sans version publiée, ce qui est là est en ligne'); assert.deepEqual(enPreparation(SRC, avant), [], 'rien n\'attend');
  /* La première modification fige ce qui était en ligne ; les modifications locales sont conservées. */
  const S = ok(avant, 'plat', { cle: 'entrees/l-os-a-moelle', champs: { prix: 12 }, base: CARTE });
  assert.equal(publie(S, 'carte').modifs['entrees/l-os-a-moelle'].prix, 11); assert.equal(contenu(S, 'carte').modifs['entrees/l-os-a-moelle'].prix, 12);
  assert.equal(publie(S, 'carte').ajouts[0].nom, 'Tarte au citron'); assert.equal(publie(S, 'evenements').modifs.raclette.titre, 'Grande soirée raclette'); assert.equal(publie(S, 'ardoise').jour.lignes[0].plat, 'Blanquette');
  assert.equal(vuePublique(S).carte.epuises['plats/piece-de-boucher'], AUJ, 'l\'ancien « épuisé » (toute la journée) est gardé');
  assert.equal(platsDe(carteDe(CARTE, vuePublique(S), AUJ, 'soir')).find((p) => p.cle === 'plats/piece-de-boucher').epuise, true, 'et il vaut pour les deux services, comme avant');
  /* Idempotent : rejouer la même action ne refige rien. */
  assert.deepEqual(ok(S, 'plat', { cle: 'entrees/l-os-a-moelle', champs: { prix: 12 }, base: CARTE }), S);
});

/* ---------- Carte, ardoise, épuisé ---------- */
test('critère 8 : « épuisé ce soir » vaut pour un jour et un service, tout de suite, sans publication', () => {
  assert.equal(serviceCourant(R, 10 * 60), 'midi'); assert.equal(serviceCourant(R, 19 * 60), 'soir'); assert.equal(serviceCourant(R, 23 * 60 + 30), 'soir');
  const cle = 'plats/poisson-selon-l-arrivage', plat = (S, jour, sv) => platsDe(carteDe(CARTE, vuePublique(S), jour, sv)).find((p) => p.cle === cle);
  const S = ok({}, 'epuise', { cle, date: AUJ, service: 'soir', actif: true });
  assert.equal(S.carte.epuises[cle], `${AUJ}/soir`); assert.equal(S.publie, undefined, 'aucune publication');
  assert.equal(plat(S, AUJ, 'soir').epuise, true, 'épuisé ce soir, sur le site aussi'); assert.equal(plat(S, AUJ, 'midi').epuise, false, 'pas au déjeuner');
  assert.equal(plat(S, '2026-11-21', 'midi').epuise, false, 'ni au service suivant'); assert.equal(plat(S, '2026-11-21', 'soir').epuise, false);
  assert.equal(plat(S, AUJ, 'soir').masque, false, 'le plat n\'est pas supprimé'); assert.equal(estEpuise(`${AUJ}/soir`, AUJ, 'midi'), false);
  /* La réservation de tables n'est pas fermée. */
  assert.equal(etatService(R, AUJ, 'soir', equipeDe(S, [], `${AUJ}T10:00`)).ouvert, etatService(R, AUJ, 'soir', equipeDe({}, [], `${AUJ}T10:00`)).ouvert);
  /* Une publication ou une restauration ne touche pas à « épuisé ». */
  let T = ok(S, 'plat', { cle, champs: { prix: 27 }, base: CARTE }); T = ok(T, 'offPublier', { perimetre: 'carte', le: LE, sources: SRC });
  assert.equal(T.carte.epuises[cle], `${AUJ}/soir`); assert.equal(T.publie.carte.epuises, undefined, 'la version publiée ne porte pas la disponibilité du moment');
  T = ok(T, 'offReprendre', { n: 1, cote: 'avant', sources: SRC }); assert.equal(T.carte.epuises[cle], `${AUJ}/soir`, 'la restauration ne rend pas le plat disponible');
  assert.ok(estVide(ok(S, 'epuise', { cle, date: AUJ, service: 'soir', actif: false })), 'de nouveau disponible : rien ne reste');
});

test('carte : un plat se prépare, change de place, se publie ; l\'ordre suit', () => {
  const noms = (S, version) => carteDe(CARTE, { carte: version === 'publie' ? publie(S, 'carte') || {} : contenu(S, 'carte') || {} }, AUJ).find((r) => r.id === 'entrees').plats.map((p) => p.cle);
  const avant = noms({});
  let S = ok({}, 'ordrePlat', { cle: avant[1], sens: -1, base: CARTE });
  assert.deepEqual(noms(S).slice(0, 2), [avant[1], avant[0]]); assert.deepEqual(noms(S, 'publie'), avant, 'le site garde l\'ordre publié');
  assert.match(attente(SRC, S, 'carte').changements.join(' '), /l'ordre des plats change/);
  S = ok(S, 'offPublier', { perimetre: 'carte', le: LE, sources: SRC }); assert.deepEqual(noms(S, 'publie').slice(0, 2), [avant[1], avant[0]]);
  assert.ok(estVide(ok({}, 'ordrePlat', { cle: avant[0], sens: -1, base: CARTE })), 'le premier ne monte pas plus haut');
  assert.equal(ok(S, 'ordrePlat', { cle: avant[1], sens: 1, base: CARTE }).carte?.ordre, undefined, 'revenu à l\'ordre du site : rien ne reste en préparation');
});

/* ---------- Les soirées ---------- */
const resaSite = (id, plus = {}) => ({ id, date: '2026-11-28', service: 'soir', heure: '19:30', couverts: 4, prenom: 'Lina', nom: 'P.', telephone: '06 00 00 00 01', soiree: { id: 'raclette', titre: 'Soirée raclette', prix: '39 € hors boissons' }, cree: '2026-11-20T09:00:00', ...plus });
test('critères 9 et 10 : une réservation prise depuis une soirée garde son lien ; la soirée ne se déplace pas sous elle', () => {
  const c = ctx({ site: [resaSite('R-1128-1001')] }), S = {};
  const liees = resasDeSoiree(c.resasSoirees(S), 'raclette');
  assert.equal(liees.length, 1, 'une seule réservation'); assert.equal(liees[0].soiree.titre, 'Soirée raclette'); assert.equal(liees[0].statut, 'a-confirmer', 'elle suit les règles communes : à confirmer');
  assert.equal(resasDuJour(c, S, '2026-11-28').filter((r) => r.id === 'R-1128-1001').length, 1, 'elle est dans l\'agenda du jour, une fois');
  /* La présentation change librement : la réservation garde le titre et le prix vus au moment de réserver. */
  const T = ok(S, 'evenement', { id: 'raclette', champs: { titre: 'Grande soirée raclette', prix: '42 € hors boissons' }, agenda: AGENDA }, c);
  assert.equal(resasDeSoiree(c.resasSoirees(T), 'raclette')[0].soiree.prix, '39 € hors boissons');
  assert.equal(changementsSoiree({ titre: 'A', debut: '2026-11-28', service: 'soir' }, { titre: 'B', debut: '2026-11-28', service: 'soir' }).engage, false);
  /* La date, le service, la suppression : refusés, avec ce qu'il faut faire ; rien n'est déplacé, aucun message n'est annoncé. */
  const pourquoi = refus(T, 'evenement', { id: 'raclette', champs: { debut: '2026-12-05' }, agenda: AGENDA }, c);
  assert.match(pourquoi, /1 réservation \(4 couverts\) est liée/); assert.match(pourquoi, /ne les déplacerait pas/); assert.match(pourquoi, /aucun message ne partirait/);
  assert.match(refus(T, 'evenement', { id: 'raclette', champs: { service: 'midi' }, agenda: AGENDA }, c), /liée à cette soirée/);
  assert.equal(c.resasSoirees(T)[0].date, '2026-11-28', 'la réservation n\'a pas bougé');
  /* Une réservation annulée ne retient plus la soirée. */
  const A = ok(T, 'statut', { id: 'R-1128-1001', statut: 'annulee' }, c); assert.equal(resasDeSoiree(c.resasSoirees(A), 'raclette').length, 0);
  assert.equal(agir(A, 'evenement', { id: 'raclette', champs: { debut: '2026-12-05' }, agenda: AGENDA }, c).refus, '');
  assert.equal(refusSoiree({ debut: '2026-11-28', service: 'soir' }, { debut: '2026-12-05', service: 'soir' }, []), '', 'sans réservation liée, la date se change');
});

test('soirées : la même identité partout ; un brouillon reste hors du site ; publier ne crée pas de disponibilité', () => {
  let S = ok({}, 'evenement', { id: 'truffe', champs: { titre: 'Soirée truffe', type: 'Soirée', debut: '2026-12-11', service: 'soir', prix: '', image: 'vraie/salle-soir' }, agenda: AGENDA });
  S = ok(S, 'evenement', { id: 'truffe', champs: { titre: 'Soirée truffe noire' }, agenda: AGENDA });
  assert.equal(evenementsDe(AGENDA, S).filter((x) => x.id === 'truffe').length, 1, 'modifier le titre ne crée pas une deuxième soirée');
  assert.equal(vuePublique(S).evenements, undefined, 'un brouillon n\'est pas sur le site'); assert.equal(attente(SRC, S, 'soiree', 'truffe').nouvelle, true);
  assert.equal(catalogue(SRC, S, AUJ).find((x) => x.id === 'truffe').publie, false);
  const avant = etatService(R, '2026-12-11', 'soir', equipeDe(S, [], LE)), P = ok(S, 'offPublier', { perimetre: 'soiree', id: 'truffe', le: LE, sources: SRC });
  assert.equal(vuePublique(P).evenements.ajouts[0].titre, 'Soirée truffe noire'); assert.ok(vuePublique(P).evenements.liste.some((x) => x.id === 'truffe'), 'la liste que lisent l\'accueil et Réserver suit');
  assert.deepEqual(etatService(R, '2026-12-11', 'soir', equipeDe(P, [], LE)), avant, 'publier une soirée n\'ouvre aucun service et ne libère aucun espace');
  /* Un service fermé reste fermé. */
  const F = ok(P, 'fermer', { date: '2026-12-11', service: 'soir', actif: true }); assert.equal(etatService(R, '2026-12-11', 'soir', equipeDe(F, [], LE)).ouvert, false);
});

/* ---------- Historique et restauration ---------- */
test('critère 11 : restaurer une version la reprend en brouillon, sans toucher aux réservations, aux services, aux accords ni au « épuisé »', () => {
  let S = { resa: { fermes: { '2026-11-27': ['soir'] }, ajouts: [{ id: 't1', date: AUJ, service: 'soir', heure: '20:00', couverts: 2, nom: 'Test', statut: 'confirmee', source: 'telephone' }] }, taches: { liste: [{ id: 'k1', texte: 'Commander le pain', fait: false }] } };
  S = creer(S, dem('d1')); S = ok(S, 'epuise', { cle: 'plats/piece-de-boucher', date: AUJ, service: 'soir', actif: true });
  S = publierOffre(ok(S, 'offre', { id: 'menu-groupe', champs: { prix: 47 }, base: BASE }), 'menu-groupe');
  S = publierOffre(ok(S, 'offre', { id: 'menu-groupe', champs: { prix: 49, description: 'Entrée, plat, fromage, dessert.' }, base: BASE }), 'menu-groupe');
  const fige = (e) => JSON.stringify([e.resa, e.taches, e.receptions, e.carte?.epuises]), avant = fige(S);
  assert.deepEqual(versions(S, 'offre', 'menu-groupe').map((v) => [v.n, v.cote, v.enLigne]), [[2, 'apres', true], [1, 'apres', false], [1, 'avant', false]]);
  /* Voir ce qu'elle rétablirait, puis la reprendre : le site ne change pas. */
  assert.deepEqual(retablirait(SRC, S, 1, 'apres').changements.map(nb), ['Description : Entrée, plat, fromage, dessert. → Entrée, plat, dessert. Composition à convenir avec le chef.', 'Prix : 49 € → 47 €']);
  const T = ok(S, 'offReprendre', { n: 1, cote: 'apres', sources: SRC });
  assert.equal(prix(T, 'menu-groupe'), 47); assert.equal(prix(T, 'menu-groupe', 'publie'), 49, 'reprise en brouillon : le site reste à 49 €'); assert.equal(T.publie.n, 2);
  assert.equal(fige(T), avant, 'réservations, service fermé, tâches, dossiers, plat épuisé : rien n\'a bougé');
  /* Il faut publier explicitement. */
  const P = publierOffre(T, 'menu-groupe'); assert.equal(prix(P, 'menu-groupe', 'publie'), 47); assert.equal(P.publie.n, 3); assert.equal(fige(P), avant);
  /* Le contenu d'avant la première publication. */
  assert.equal(prix(ok(P, 'offReprendre', { n: 1, cote: 'avant', sources: SRC }), 'menu-groupe'), 45);
  /* Abandonner un brouillon : il redevient le publié. */
  const B = ok(ok(P, 'offre', { id: 'menu-groupe', champs: { prix: 60 }, base: BASE }), 'offAbandonner', { perimetre: 'offre', id: 'menu-groupe', sources: SRC });
  assert.equal(prix(B, 'menu-groupe'), 47); assert.equal(attente(SRC, B, 'offre', 'menu-groupe'), null);
  assert.match(refus(P, 'offReprendre', { n: 99, sources: SRC }), /plus dans l'historique/);
});

test('restauration d\'une soirée : sa date ne revient pas en arrière sous des réservations', () => {
  let S = ok({}, 'evenement', { id: 'raclette', champs: { debut: '2026-12-05' }, agenda: AGENDA }); S = ok(S, 'offPublier', { perimetre: 'soiree', id: 'raclette', le: LE, sources: SRC });
  const c = ctx({ site: [resaSite('R-1205-2002', { date: '2026-12-05' })] });
  assert.match(refus(S, 'offReprendre', { n: 1, cote: 'avant', sources: SRC }, c), /liée à cette soirée/);
  assert.equal(agir(S, 'offReprendre', { n: 1, cote: 'avant', sources: SRC }).refus, '', 'sans réservation liée, la reprise est possible');
});

/* ---------- Les offres dans les propositions ---------- */
const avecProposition = (S, id, c = ctx()) => { const o = offresPourProposition(LIEUX, S).find((x) => x.id === 'menu-groupe');
  return ok(S, 'recProposition', { id, proposition: { titre: 'Dîner', lignes: [ligneDepuisOffre(o, { id: 'l1', qte: 40, n: S.publie?.n || 0, le: c.maintenant })] }, le: c.maintenant }, c); };
test('critère 6 : 45 € → 49 € ; la nouvelle proposition vaut 1 960 €, l\'ancienne reste à 1 800 €', () => {
  let S = creer({}, dem('ancien')); const A = idDossier('ancien');
  S = avecProposition(S, A); S = ok(S, 'recPresenter', { id: A, le: LE }); S = ok(S, 'recAccordEquipe', { id: A, le: LE });
  assert.equal(accepteeDe(dossierDe(S, A), {}).proposition.total, 1800);
  const l = couranteDe(dossierDe(S, A)).lignes[0];
  assert.deepEqual([l.libelle, l.description, l.pu, l.unite, l.origine], ['Menu de groupe, trois plats', 'Entrée, plat, dessert. Composition à convenir avec le chef.', 45, 'par personne', 'menu-groupe'], 'la ligne porte sa copie et sa référence d\'origine');
  /* Le menu passe à 49 € : en préparation, les nouvelles propositions reprennent encore 45 € ; publié, 49 €. */
  S = ok(S, 'offre', { id: 'menu-groupe', champs: { prix: 49 }, base: BASE });
  assert.equal(offresPourProposition(LIEUX, S).find((o) => o.id === 'menu-groupe').prix, 45, 'une nouvelle proposition reprend la version publiée');
  S = publierOffre(S, 'menu-groupe');
  S = creer(S, dem('nouveau', { prenom: 'Bruno', nom: 'K.' })); const N = idDossier('nouveau'); S = avecProposition(S, N);
  assert.equal(totalProposition(brouillonDe(dossierDe(S, N))), 1960, '40 × 49 €');
  assert.equal(accepteeDe(dossierDe(S, A), {}).proposition.total, 1800, 'l\'ancienne reste à 1 800 €'); assert.equal(totalProposition(couranteDe(dossierDe(S, A))), 1800); assert.equal(couranteDe(dossierDe(S, A)).lignes[0].pu, 45);
  /* Archiver l'offre : rien n'est réécrit, rien n'est annulé ; elle n'est plus proposée. */
  const u = usagesOffre(LIEUX, S, 'menu-groupe'); assert.deepEqual(u.propositions.map((p) => [p.dossier, p.version, p.etat]), [[A, 1, 'presentee'], [N, 1, 'brouillon']], 'les usages sont montrés avant d\'archiver');
  const X = ok(S, 'offArchiver', { id: 'menu-groupe', actif: true, le: LE });
  assert.equal(accepteeDe(dossierDe(X, A), {}).proposition.total, 1800); assert.equal(totalProposition(brouillonDe(dossierDe(X, N))), 1960); assert.deepEqual(X.receptions, S.receptions, 'critère 12 : aucun dossier n\'est touché');
  assert.ok(!offresPourProposition(LIEUX, X).some((o) => o.id === 'menu-groupe')); assert.equal(offre(LIEUX, X, 'menu-groupe').archive, true);
  assert.equal(offre(LIEUX, ok(X, 'offArchiver', { id: 'menu-groupe', actif: false }), 'menu-groupe').archive, false, 'elle se remet au catalogue');
});

test('critère 7 : un brouillon de proposition personnalisé n\'est jamais écrasé ; l\'actualisation montre les différences et garde les adaptations', () => {
  let S = creer({}, dem('d1')); const D = idDossier('d1'); S = avecProposition(S, D);
  /* Le restaurateur adapte : 38 couverts, une description à lui. */
  const adapte = brouillonDe(dossierDe(S, D)).lignes.map((l) => ({ ...l, qte: 38, description: 'Menu de fête : foie gras, pintade, bûche.' }));
  S = ok(S, 'recProposition', { id: D, proposition: { lignes: adapte }, le: LE });
  S = publierOffre(ok(S, 'offre', { id: 'menu-groupe', champs: { prix: 49, description: 'Entrée, plat, fromage, dessert.' }, base: BASE }), 'menu-groupe');
  const b = brouillonDe(dossierDe(S, D)); assert.equal(b.lignes[0].pu, 45, 'le brouillon n\'a pas changé tout seul'); assert.equal(totalProposition(b), 38 * 45);
  const diff = actualisation(b.lignes, offres(LIEUX, S, 'publie'));
  assert.deepEqual(diff[0].changements.map((c) => [c.champ, nb(c.avant), nb(c.apres)]), [['pu', '45 €', '49 €']]); assert.deepEqual(diff[0].gardes, ['Description'], 'la description adaptée est gardée');
  assert.deepEqual([diff[0].avant, diff[0].apres], [38 * 45, 38 * 49]);
  const apres = actualiser(b.lignes, offres(LIEUX, S, 'publie'), { n: S.publie.n, le: LE });
  assert.deepEqual([apres[0].pu, apres[0].qte, apres[0].description], [49, 38, 'Menu de fête : foie gras, pintade, bûche.']);
  S = ok(S, 'recProposition', { id: D, proposition: { lignes: apres }, le: LE });
  assert.equal(totalProposition(brouillonDe(dossierDe(S, D))), 38 * 49); assert.deepEqual(actualisation(brouillonDe(dossierDe(S, D)).lignes, offres(LIEUX, S, 'publie')), [{ ...actualisation(brouillonDe(dossierDe(S, D)).lignes, offres(LIEUX, S, 'publie'))[0] }].filter((x) => x.id), 'après actualisation, seule la description adaptée diffère encore');
  /* Une ligne ajoutée avant la v7.13.0 (sans copie de référence) n'est pas comparée : rien n'est deviné. */
  assert.deepEqual(actualisation([{ id: 'x', libelle: 'Menu', pu: 45, qte: 10, origine: 'menu-groupe' }], offres(LIEUX, S, 'publie')), []);
});

/* ---------- Les options d'avant la v7.12.1 ---------- */
const poser = (S, id, espaces, c = ctx(), horaires = { arrivee: '19:00', fin: '23:30' }) => ok(S, 'recRetenir', argsRetenue({ lieux: LIEUX }, SALLE, dossierDe(S, id), { type: 'option', jour: '2026-12-12', horaires, espaces, le: c.maintenant, echeance: '2026-11-27T12:00' }), c);
const ancienne = (S, id) => { const e = JSON.parse(JSON.stringify(S)); delete e.receptions.dossiers[id].retenue.publics; return e; };
test('critère 1 : anciennes et nouvelles options se cumulent ; la reprise est rejouable et ne touche à rien d\'autre', () => {
  /* Deux zones de la salle du restaurant, pour deux petites tablées. */
  const z1 = { id: 'coin-feu' }, z2 = { id: 'grande-table' }; let S = creer(creer({}, dem('a', { invites: '6' })), dem('b', { invites: '6', nom: 'C.' })); const A = idDossier('a'), B = idDossier('b');
  S = poser(S, A, [z1.id]); S = poser(S, B, [z2.id]);
  const neuf = prisesDuService(occupationsActives(S, LE), R, '2026-12-12', 'soir', equipeDe(S, [], LE));
  /* L'option A date d'avant la v7.12.1 : elle ne dit pas ce qu'elle prend de la salle. */
  const vieux = ancienne(S, A); assert.deepEqual(retenuesAReprendre(vieux, LIEUX, SALLE), [A]);
  assert.equal(occupationsActives(vieux, LE).find((o) => o.id === A).incertain, true, 'avant reprise : une occupation inconnue n\'est pas une place libre');
  assert.equal(prisesDuService(occupationsActives(vieux, LE), R, '2026-12-12', 'soir', equipeDe(vieux, [], LE)).tout, true, 'elle est comptée comme prenant tout');
  const repris = ok(vieux, 'recReprendre', { lieux: LIEUX, salle: SALLE });
  assert.deepEqual(dossierDe(repris, A).retenue, dossierDe(S, A).retenue, 'la retenue retrouve exactement ce qu\'elle prend : identifiant, dates, échéance, tables intacts');
  assert.deepEqual(dossierDe(repris, B), dossierDe(S, B), 'la nouvelle option n\'est pas touchée'); assert.deepEqual(dossierDe(repris, A).historique, dossierDe(S, A).historique);
  const apres = prisesDuService(occupationsActives(repris, LE), R, '2026-12-12', 'soir', equipeDe(repris, [], LE));
  assert.deepEqual([apres.salle, apres.tout, apres.incertain, [...apres.tables.keys()].sort()], [neuf.salle, neuf.tout, false, [...neuf.tables.keys()].sort()], 'ancienne et nouvelle se cumulent comme deux nouvelles');
  assert.deepEqual(ok(repris, 'recReprendre', { lieux: LIEUX, salle: SALLE }), repris, 'rejouer la reprise ne change rien'); assert.deepEqual(retenuesAReprendre(repris, LIEUX, SALLE), []);
  /* L'expiration est respectée : une ancienne option expirée ne bloque plus, reprise ou non. */
  assert.equal(occupationsActives(repris, '2026-11-27T12:00').length, 0); assert.equal(occupationsActives(vieux, '2026-11-27T12:00').length, 0);
});

test('anciennes options : quand rien ne permet de savoir, « À vérifier » et tout est compté comme pris', () => {
  let S = creer({}, dem('a')); const A = idDossier('a'); S = poser(S, A, ['restaurant']);
  const inconnu = JSON.parse(JSON.stringify(S)); Object.assign(inconnu.receptions.dossiers[A].retenue, { tables: [], espaces: ['ancien-salon'], salle: false, terrasse: false }); delete inconnu.receptions.dossiers[A].retenue.publics;
  const repris = ok(inconnu, 'recReprendre', { lieux: LIEUX, salle: SALLE }), ret = dossierDe(repris, A).retenue;
  assert.equal(ret.aVerifier, true); assert.equal(ret.publics, undefined, 'rien n\'est inventé'); assert.equal(ret.echeance, dossierDe(S, A).retenue.echeance, 'l\'échéance est gardée');
  const e = etatRetenue(dossierDe(repris, A), LE); assert.equal(e.aVerifier, true); assert.match(e.verifier, /tout le restaurant est compté comme pris/);
  assert.equal(etatService(R, '2026-12-12', 'soir', equipeDe(repris, [], LE)).prive, true, 'la page Réserver ne propose pas ce service');
  assert.equal(completerRetenue(ret, LIEUX, SALLE), ret, 'idempotent');
  /* « Toute la salle » sans tables ni zones : c'est déterminable. */
  const flag = completerRetenue({ etat: 'option', debut: 'x', fin: 'y', espaces: [], tables: [], salle: true, terrasse: false, echeance: 'z' }, LIEUX, SALLE);
  assert.equal(flag.aVerifier, undefined); assert.equal(flag.publics.salle.tables.length, flag.publics.salle.sur);
  /* Reposer les espaces lève le doute. */
  const leve = poser(repris, A, ['restaurant']); assert.equal(dossierDe(leve, A).retenue.aVerifier, undefined); assert.ok(dossierDe(leve, A).retenue.publics);
});

/* ---------- Isolation, site connecté, démonstration ---------- */
test('critère 15 : le site d\'essai connecté n\'est pas touché par les offres locales', async () => {
  const local = { etat: () => ({ offres: { modifs: { 'menu-groupe': { prix: 49 } } }, publie: { n: 3, offres: {} }, receptions: { dossiers: { x: {} } }, carte: { epuises: { a: `${AUJ}/soir` } } }), agir: () => true, ecouter: () => {}, abonner: () => {}, demandesSite: () => [], raisonRefus: () => '', noteAction: () => '' };
  const appels = [], depot = creerDepotServeur({ api: '/api', local, periode: () => ({ du: AUJ, au: AUJ }), surFin: () => {}, surEtat: () => {}, fetch: async (u, o) => { appels.push([u, o?.method || 'GET']); return { ok: true, status: 200, json: async () => ({ reservations: [], regles: {}, version: 1 }) }; } });
  const S = depot.etat(); assert.equal(S.receptions, undefined, 'les dossiers locaux restent écartés'); assert.equal(S.resa?.ajouts?.length || 0, 0, 'aucune réservation locale');
  assert.equal(S.offres.modifs['menu-groupe'].prix, 49, 'le catalogue reste local, dans ce navigateur');
  depot.agir('offPublier', { perimetre: 'offre', id: 'menu-groupe' }); depot.agir('epuise', { cle: 'a', date: AUJ, service: 'soir', actif: true });
  assert.ok(!appels.some(([, m]) => m !== 'GET'), 'publier une offre ou dire un plat épuisé n\'écrit rien sur le serveur');
});

test('sixième démonstration : une offre prend vie, de 45 € à 49 €, étape par étape', () => {
  assert.deepEqual(SCENARIOS.map((s) => s.id), ['service', 'attente', 'terrasse', 'client', 'reception', 'offre'], 'les cinq premières démonstrations sont toujours là');
  const d = depart('offre', R, AUJ, { lieux: LIEUX, salle: SALLE }), sc = SCENARIOS.find((s) => s.id === 'offre');
  const c = (S, vus = {}) => ({ S, vus, venues: {}, lieux: LIEUX, iso: d.horloge.iso }), faits = (S, vus) => avancement('offre', c(S, vus)).etapes.filter((e) => e.fait).map((e) => e.id);
  let S = d.etat; const A = idDossier('sc6-ancienne'), N = idDossier('sc6-nouvelle');
  /* Le départ : une offre d'exemple publiée à 45 €, montrée sur le site ; une proposition acceptée à 1 800 €. */
  assert.equal(prix(S, 'menu-groupe', 'publie'), 45); assert.equal(offre(LIEUX, S, 'menu-groupe').exemple, true); assert.equal(offresDuSite(LIEUX, S, d.horloge.iso)[0].prix, 45);
  assert.equal(accepteeDe(dossierDe(S, A), {}).proposition.total, 1800); assert.equal(dossierDe(S, N).propositions?.length || 0, 0);
  assert.deepEqual(faits(S), [], 'rien n\'est fait d\'avance');
  assert.deepEqual(faits(S, { 'offre-catalogue': true }), ['retrouver']);
  S = ok(S, 'offre', { id: 'menu-groupe', champs: { prix: 49 }, saisie: { nom: 'Menu', prix: '49', unite: 'personne' }, base: BASE });
  assert.deepEqual(faits(S, { 'offre-catalogue': true }), ['retrouver', 'preparer']); assert.equal(offresDuSite(LIEUX, S, d.horloge.iso)[0].prix, 45, 'le site normal affiche toujours 45 €');
  assert.equal(offresDuSite(LIEUX, S, d.horloge.iso, true)[0].prix, 49, 'l\'aperçu montre 49 €');
  const vus = { 'offre-catalogue': true, 'offre-apercu': true, 'offre-site': true }; assert.deepEqual(faits(S, vus), ['retrouver', 'preparer', 'apercu']);
  S = publierOffre(S, 'menu-groupe'); assert.deepEqual(faits(S, vus), ['retrouver', 'preparer', 'apercu', 'publier']); assert.equal(offresDuSite(LIEUX, S, d.horloge.iso)[0].prix, 49);
  assert.deepEqual(enPreparation(SRC, S), [], 'seule cette offre a été publiée, rien d\'autre n\'attendait');
  S = avecProposition(S, N); assert.equal(totalProposition(brouillonDe(dossierDe(S, N))), 1960);
  assert.deepEqual(faits(S, vus), ['retrouver', 'preparer', 'apercu', 'publier', 'nouvelle']);
  const fin = avancement('offre', c(S, { ...vus, 'offre-ancienne': true })); assert.equal(fin.etapes.every((e) => e.fait), true);
  assert.equal(accepteeDe(dossierDe(S, A), {}).proposition.total, 1800, 'l\'ancienne proposition est restée à 1 800 €');
  const mot = nb(sc.conclusion(c(S, vus))); assert.match(mot, /1 960 €/); assert.match(mot, /1 800 €/); assert.match(mot, /exemples/);
  /* Rejouable : un nouveau départ redonne le même état. */
  assert.deepEqual(depart('offre', R, AUJ, { lieux: LIEUX, salle: SALLE }).etat, d.etat);
  /* Les variantes : un saut vers le soir ; une soirée d'exemple à réserver. */
  assert.equal(sauts('offre', { iso: d.horloge.iso, min: 600 })[0].cible.min, 19 * 60); assert.equal(sauts('offre', { iso: d.horloge.iso, min: 19 * 60 })[0].cible, null);
  assert.match(evenementsDe(AGENDA, d.etat).find((x) => x.id === 'sc6-soiree').titre, /exemple/); assert.equal(sc.variantes.length, 3);
});
