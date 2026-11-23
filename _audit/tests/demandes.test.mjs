/* Tests des demandes (réceptions, traiteur, cartes cadeaux, questions) et des messages aux clients (fonctions pures).
   Lancer : node --test _audit/tests/*.test.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { GENRES, libelleEtape, suite, recue, demandesDemo, normaliser, demandes, aTraiter, suiviReceptions, MODELES, modele, composer, variablesTable, messageDemande, exempleModele } from '../../assets/js/espace-demandes.js';
import { appliquer, creerDepot } from '../../assets/js/espace-donnees.js';
import { estVide } from '../../assets/js/espace-stock.js';

const lireJson = (f) => JSON.parse(readFileSync(new URL(`../../donnees/${f}`, import.meta.url), 'utf8'));
const R = lireJson('reservation.json'), PRODUITS = lireJson('emporter.json').produits.map((p) => ({ nom: p.nom.fr, prix: p.prix }));
const AUJ = '2026-11-18', TEL = '06 18 21 28 10';
const ctx = (site = []) => ({ R, auj: AUJ, site: [], demandes: site, produits: PRODUITS, exceptions: [] });

test('les étapes de chaque genre', () => {
  assert.deepEqual(suite('reception', 'nouvelle'), { statut: 'rappele', libelle: 'J\'ai rappelé' }); assert.deepEqual(suite('reception', 'devis'), { statut: 'signe', libelle: 'C\'est signé' });
  assert.equal(suite('reception', 'signe'), null); assert.equal(suite('reception', 'perdue'), null); assert.equal(suite('question', 'repondue'), null); assert.equal(suite('inconnu', 'nouvelle'), null);
  assert.equal(libelleEtape('traiteur', 'prete'), 'Prête'); assert.equal(libelleEtape('reception', 'perdue'), 'Sans suite'); assert.equal(libelleEtape('cadeau', 'x'), 'Nouvelle');
  /* v7.14.0 : la commande à emporter et la carte cadeau se suivent dans leur dossier (commerce.js) : pas d'étape « à la main » ici. */
  for (const [g, def] of Object.entries(GENRES)) if (def.etapes && def.suite) for (const [id] of def.etapes.slice(0, -1)) assert.ok(suite(g, id), `${g} ${id} a une suite`);
  assert.equal(suite('traiteur', 'nouvelle'), null); assert.equal(suite('cadeau', 'nouvelle'), null); assert.equal(libelleEtape('traiteur', 'preparation'), 'En préparation'); assert.equal(libelleEtape('cadeau', 'emise'), 'Cartes émises');
  assert.equal(recue(`${AUJ}T08:00:00`, AUJ), 'aujourd\'hui'); assert.equal(recue('2026-11-17T23:00:00', AUJ), 'hier'); assert.equal(recue('2026-11-09T10:00:00', AUJ), 'il y a 9 jours');
});

test('la démonstration : des demandes visiblement fictives, tirées des vrais produits', () => {
  const l = demandesDemo(AUJ, PRODUITS);
  assert.ok(l.every((d) => d.source === 'demo' && /^demo-/.test(d.id)));
  assert.deepEqual([...new Set(l.map((d) => d.genre))].sort(), ['cadeau', 'question', 'reception', 'traiteur']);
  const t = l.find((d) => d.genre === 'traiteur'); assert.ok(t.produits.every((x) => PRODUITS.some((p) => p.nom === x.nom)), 'les produits existent sur la page Traiteur');
  assert.equal(t.total, PRODUITS[0].prix * 2 + PRODUITS[1].prix);
  assert.ok(!demandesDemo(AUJ, []).some((d) => d.genre === 'traiteur'), 'sans produits, pas de commande inventée');
  assert.deepEqual(demandesDemo(AUJ, PRODUITS), demandesDemo(AUJ, PRODUITS), 'stable');
});

test('chaque formulaire du site devient une ligne de la liste', () => {
  const r = normaliser({ id: 'R-1', genre: 'reception', cree: `${AUJ}T10:00:00`, occasion: 'Un mariage', date: '2027-06-12', invites: '120', espace: 'Salle de réception', message: 'Bonjour', prenom: 'Claire', nom: 'Martin', telephone: '06 00', email: 'c@exemple.fr' });
  assert.deepEqual({ qui: r.qui, titre: r.titre, statut: r.statut, source: r.source }, { qui: 'Claire Martin', titre: 'Mariage · 120 invités · samedi 12 juin 2027', statut: 'nouvelle', source: 'site' });
  assert.deepEqual(r.lignes.map(([k]) => k), ['Occasion', 'Date', 'Invités', 'Espace', 'Message']);
  assert.equal(normaliser({ id: 'R-2', genre: 'reception', occasion: 'Un baptême', periode: 'Printemps 2027', invites: '40' }).titre, 'Baptême · 40 invités · Printemps 2027');
  const t = normaliser({ id: 'T-1', genre: 'traiteur', produits: [{ nom: 'Tourte aux escargots', qte: 2 }, { nom: 'Foie gras', qte: 1 }], total: 109.5, jour: '2026-12-05', jourLibelle: 'samedi 5 décembre', moment: 'soir', prenom: 'Paul', nom: 'E.', tel: '06 01' });
  assert.equal(t.titre, '2 produits · 109,5 € · retrait samedi 5 décembre, le soir'); assert.equal(t.telephone, '06 01');
  const c = normaliser({ id: 'C-1', genre: 'cadeau', montant: 100, quantite: 2, pour: 'Léa', de: 'Hugo S.', mot: '' });
  assert.equal(c.titre, '2 cartes de 100 € pour Léa'); assert.equal(c.qui, 'Hugo S.'); assert.ok(!c.lignes.some(([k]) => k === 'Le mot'), 'un champ vide ne fait pas de ligne');
  assert.equal(normaliser({ id: 'Q-1', genre: 'question', sujet: 'Une allergie', message: 'x' }).qui, 'Sans nom');
});

test('la liste : ce qui attend d\'abord ; l\'étape et la note du restaurant ; le suivi des réceptions', () => {
  const site = [{ id: 'R-9', genre: 'reception', cree: `${AUJ}T12:00:00`, occasion: 'Un séminaire', invites: '30', prenom: 'Luc', nom: 'D.' }, { id: 'X-1', genre: 'inconnu' }];
  const l = demandes(ctx(site), {});
  assert.ok(!l.some((d) => d.id === 'X-1'), 'un genre inconnu est écarté'); assert.equal(l[0].id, 'R-9', 'la plus récente des nouvelles en tête');
  const i = l.findIndex((d) => d.statut !== 'nouvelle'); assert.ok(l.slice(0, i).every((d) => d.statut === 'nouvelle') && l.slice(i).every((d) => d.statut !== 'nouvelle'));
  const avant = aTraiter(ctx(site), {}); assert.equal(avant.autres.length, 5); assert.ok(avant.tables.length >= 0);
  let S = appliquer({}, 'etapeDemande', { id: 'R-9', statut: 'rappele' }); S = appliquer(S, 'noteDemande', { id: 'R-9', note: ' Rappeler jeudi ' });
  const d = demandes(ctx(site), S).find((x) => x.id === 'R-9'); assert.equal(d.statut, 'rappele'); assert.equal(d.note, 'Rappeler jeudi');
  assert.equal(aTraiter(ctx(site), S).autres.length, 4);
  assert.deepEqual(suiviReceptions(demandes(ctx(site), S)).map((x) => [x.id, x.n]), [['nouvelle', 1], ['rappele', 1], ['visite', 1], ['devis', 1], ['signe', 0], ['perdue', 0]]);
  assert.ok(!('notes' in (appliquer(S, 'noteDemande', { id: 'R-9', note: '' }).demandes || {})), 'une note vidée ne laisse rien');
});

test('les messages aux clients : modèles, variables, retouche', () => {
  const r = { nom: 'Camille R.', couverts: 4, date: '2026-11-21', heure: '20:00' };
  assert.equal(composer(modele({}, 'confirmation'), variablesTable(r, TEL)), 'Bonjour Camille, votre table pour 4 est confirmée samedi 21 novembre à 20 h. À très vite aux Jardins de l\'Hacienda !');
  assert.equal(variablesTable({ ...r, nom: 'Famille Weber' }, TEL)['prénom'], 'Famille Weber'); assert.equal(variablesTable({ ...r, nom: 'Martin' }, TEL)['prénom'], 'Martin');
  assert.match(composer(modele({}, 'refus'), variablesTable(r, TEL)), /Appelez-nous au 06 18 21 28 10 :/);
  assert.equal(composer('Bonjour {prénom}, {inconnu} et {vide}.', { 'prénom': 'Léa', vide: '' }), 'Bonjour Léa, {inconnu} et {vide}.', 'une variable inconnue ou vide reste visible');
  let S = appliquer({}, 'modeleMessage', { cle: 'confirmation', texte: 'Merci {prénom} !', defaut: MODELES.confirmation.texte });
  assert.equal(modele(S, 'confirmation'), 'Merci {prénom} !'); assert.equal(composer(modele(S, 'confirmation'), variablesTable(r, TEL)), 'Merci Camille !');
  S = appliquer(S, 'modeleMessage', { cle: 'confirmation', texte: MODELES.confirmation.texte, defaut: MODELES.confirmation.texte }); assert.ok(estVide(S), 'revenir au texte d\'origine ne laisse rien');
  const [mariage, , , commande, cadeau, question] = demandesDemo(AUJ, PRODUITS).map(normaliser);
  assert.match(messageDemande({}, mariage, TEL).texte, /merci pour votre demande \(un mariage\)/); assert.match(messageDemande({}, commande, TEL).texte, /Retrait samedi \d+ \S+, le soir\. Total : \d+ €/);
  assert.match(messageDemande({}, cadeau, TEL).texte, /carte cadeau de 100 € pour Léa/); assert.equal(messageDemande({}, question, TEL), null, 'une question n\'a pas de message tout fait');
  for (const cle of Object.keys(MODELES)) assert.ok(!/\{[^{}]+\}/.test(composer(MODELES[cle].texte, exempleModele(cle, TEL))), `l'exemple remplit tout le modèle « ${cle} »`);
});

test('tout remettre comme livré efface aussi les demandes du site, et « Annuler » les rend', () => {
  let etat = {}, resas = [], dem = [{ id: 'R-1', genre: 'reception' }];
  const m = { lire: () => JSON.parse(JSON.stringify(etat)), ecrire: (d) => { etat = JSON.parse(JSON.stringify(d)); return true; }, vider: () => { etat = {}; resas = []; dem = []; }, resasSite: () => [...resas], ecrireResasSite: (l) => { resas = [...l]; return true; }, demandesSite: () => [...dem], ecrireDemandesSite: (l) => { dem = [...l]; return true; } };
  const depot = creerDepot(m); depot.agir('etapeDemande', { id: 'R-1', statut: 'rappele' });
  depot.toutEffacer(); assert.deepEqual(depot.demandesSite(), []); assert.ok(estVide(depot.etat()));
  depot.annuler(); assert.deepEqual(depot.demandesSite(), [{ id: 'R-1', genre: 'reception' }]); assert.equal(depot.etat().demandes.statuts['R-1'], 'rappele');
});
