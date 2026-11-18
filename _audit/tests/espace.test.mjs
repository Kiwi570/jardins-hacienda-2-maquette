/* Tests des règles et des actions de l'espace restaurateur (fonctions pures, sans navigateur).
   Lancer : node --test _audit/tests/*.test.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { heure, ajouter, jourDe, typo, svDe, pluriel, aujourdhui, creneaux, ouvert, ouvertSite, complet, demo, resasDuJour, actives, couverts, aConfirmer, evenements, listeEvenements } from '../../assets/js/espace-regles.js';
import { MUTATIONS, appliquer, creerDepot } from '../../assets/js/espace-donnees.js';
import { migrer, estVide, SCHEMA } from '../../assets/js/espace-stock.js';

const lireJson = (f) => JSON.parse(readFileSync(new URL(`../../donnees/${f}`, import.meta.url), 'utf8'));
const R = lireJson('reservation.json'), AGENDA = lireJson('agenda.json').dates;
const AUJ = '2026-11-18'; /* un mercredi */
const ctx = (site = []) => ({ R, auj: AUJ, site, exceptions: [] });
/** Un stockage en mémoire, au même contrat que espace-stock.js. */
function memoire({ plein = false } = {}) {
  let etat = {}, site = [];
  return { lire: () => JSON.parse(JSON.stringify(etat)), ecrire: (d) => { if (plein) return false; etat = JSON.parse(JSON.stringify(d)); return true; }, vider: () => { etat = {}; site = []; },
    resasSite: () => [...site], ecrireResasSite: (l) => { site = [...l]; return true; }, pousser: (r) => site.push(r) };
}

test('dates et écriture française', () => {
  assert.equal(heure('12:30'), '12 h 30'); assert.equal(heure('19:00'), '19 h');
  assert.equal(ajouter('2026-12-31', 1), '2027-01-01'); assert.equal(jourDe(AUJ), 3);
  assert.equal(typo('Complet : fermé !'), 'Complet : fermé !'); assert.equal(typo('« fermé »'), '« fermé »');
  assert.equal(svDe('12:00-14:30'), 'midi'); assert.equal(svDe('19:00-23:00'), 'soir');
  assert.equal(pluriel(1, 'couvert'), '1 couvert'); assert.equal(pluriel(3, 'couvert'), '3 couverts');
  assert.deepEqual(aujourdhui(new Date('2026-11-18T22:30:00Z')), { iso: '2026-11-18', min: 23 * 60 + 30 });
  assert.equal(aujourdhui(new Date('2026-11-18T23:30:00Z')).iso, '2026-11-19', 'après minuit à Moineville');
});

test('les créneaux suivent les services de la réservation', () => {
  for (const sv of Object.keys(R.services)) { const l = creneaux(R, sv); assert.ok(l.length > 0); assert.equal(l[0], R.services[sv].debut); assert.ok(l.at(-1) <= R.services[sv].fin); }
  assert.deepEqual(creneaux(R, 'inconnu'), []);
});

test('ouvert : les règles du site, puis ce que l\'espace a changé', () => {
  const jours = Array.from({ length: 14 }, (_, k) => ajouter(AUJ, k));
  const cas = jours.flatMap((iso) => ['midi', 'soir'].map((sv) => [iso, sv])).find(([iso, sv]) => ouvertSite(R, iso, sv));
  assert.ok(cas, 'au moins un service ouvert dans les quinze jours'); const [iso, sv] = cas;
  assert.equal(ouvert(ctx(), {}, iso, sv), true);
  assert.equal(ouvert(ctx(), appliquer({}, 'fermer', { date: iso, service: sv, actif: true }), iso, sv), false, 'fermé ce jour');
  assert.equal(ouvert(ctx(), appliquer({}, 'ajouterFermeture', { du: ajouter(iso, -1), au: ajouter(iso, 1) }), iso, sv), false, 'fermeture exceptionnelle');
  assert.equal(ouvert(ctx(), { horaires: { semaine: {} } }, iso, sv), false, 'horaires de la semaine vidés');
  const S = appliquer({}, 'complet', { date: iso, service: sv, actif: true });
  assert.equal(complet(S, iso, sv), true); assert.equal(ouvert(ctx(), S, iso, sv), true, 'complet ne ferme pas le service');
  assert.equal(complet(appliquer(S, 'complet', { date: iso, service: sv, actif: false }), iso, sv), false);
});

test('la démonstration est stable, tirée des horaires, et visiblement fictive', () => {
  for (let k = -7; k <= 28; k++) for (const sv of ['midi', 'soir']) {
    const iso = ajouter(AUJ, k), l = demo(R, AUJ, iso, sv);
    assert.deepEqual(l, demo(R, AUJ, iso, sv), 'même jour, mêmes réservations');
    if (!ouvertSite(R, iso, sv)) assert.equal(l.length, 0, `rien un service fermé (${iso} ${sv})`);
    for (const r of l) { assert.ok(creneaux(R, sv).includes(r.heure)); assert.ok(r.couverts >= 1); assert.equal(r.source, 'demo'); assert.match(r.id, /^demo-/); if (iso < AUJ) assert.equal(r.statut, 'arrivee'); }
  }
  assert.deepEqual(demo(R, AUJ, ajouter(AUJ, 40), 'midi'), [], 'rien au-delà de quatre semaines');
});

test('réserver sur le site, puis confirmer dans l\'espace', () => {
  const jour = Array.from({ length: 14 }, (_, k) => ajouter(AUJ, k + 1)).find((iso) => ouvertSite(R, iso, 'midi'));
  const demande = { id: 'R-TEST', date: jour, service: 'midi', heure: R.services.midi.debut, couverts: 4, prenom: 'Claire', nom: 'Essai', telephone: '06 00 00 00 00', demandes: ['Anniversaire'], message: 'Près de la cheminée', espace: 'salle', table: '' };
  const avant = aConfirmer(ctx(), {}).length;
  const r = resasDuJour(ctx([demande]), {}, jour).find((x) => x.id === 'R-TEST');
  assert.deepEqual({ nom: r.nom, statut: r.statut, source: r.source, demande: r.demande }, { nom: 'Claire Essai', statut: 'a-confirmer', source: 'site', demande: 'Anniversaire · Près de la cheminée' });
  assert.equal(aConfirmer(ctx([demande]), {}).length, avant + 1);
  const S = appliquer({}, 'statut', { id: 'R-TEST', statut: 'confirmee' });
  assert.equal(resasDuJour(ctx([demande]), S, jour).find((x) => x.id === 'R-TEST').statut, 'confirmee');
  assert.equal(aConfirmer(ctx([demande]), S).length, avant);
  const refuse = resasDuJour(ctx([demande]), appliquer({}, 'statut', { id: 'R-TEST', statut: 'refusee' }), jour);
  assert.ok(!actives(refuse).some((x) => x.id === 'R-TEST')); assert.equal(couverts(refuse), couverts(resasDuJour(ctx(), {}, jour)), 'une demande refusée ne compte plus de couverts');
});

test('une réservation prise au téléphone entre dans l\'agenda, triée par heure', () => {
  const S = appliquer({}, 'ajouterResa', { resa: { id: 'tel-1', date: AUJ, service: 'midi', heure: '12:00', couverts: 2, nom: 'Essai', statut: 'confirmee', source: 'telephone' } });
  const l = resasDuJour(ctx(), S, AUJ); assert.ok(l.some((r) => r.id === 'tel-1'));
  assert.deepEqual(l.map((r) => r.heure), [...l.map((r) => r.heure)].sort());
});

test('les actions ne modifient jamais l\'état reçu', () => {
  const etat = { annonce: { active: false, texte: 'x' } }, copie = JSON.stringify(etat);
  appliquer(etat, 'annonce', { active: true }); appliquer(etat, 'texte', { cle: 'a', valeur: 'b' });
  assert.equal(JSON.stringify(etat), copie); assert.throws(() => appliquer(etat, 'inconnue'));
});

test('annonce, textes, fermetures, photos', () => {
  assert.deepEqual(appliquer({ annonce: { active: true, texte: 'a' } }, 'annonce', { texte: 'b' }).annonce, { active: true, texte: 'b' });
  let S = appliquer({}, 'texte', { cle: 'k', valeur: ' Bonjour ', defaut: 'Défaut' }); assert.equal(S.textes.k, 'Bonjour');
  assert.equal(appliquer({}, 'texte', { cle: 'k', valeur: 'Ouvert : oui !' }).textes.k, 'Ouvert\u00a0: oui\u00a0!', 'typographie française à l\'enregistrement');
  S = appliquer(S, 'texte', { cle: 'k', valeur: 'Défaut : là', defaut: 'Défaut : là' }); assert.ok(estVide(S), 'revenir au texte d\'origine ne laisse rien');
  S = appliquer(appliquer({}, 'ajouterFermeture', { du: '2027-01-10', au: '2027-01-05', motif: '' }), 'ajouterFermeture', { du: '2027-01-04', au: '2027-01-08', motif: 'Congés' });
  assert.deepEqual(S.horaires.exceptions, [{ du: '2027-01-04', au: '2027-01-08', motif: 'Congés' }, { du: '2027-01-10', au: '2027-01-10', motif: 'Fermeture exceptionnelle' }]);
  assert.ok(estVide(appliquer(appliquer(S, 'retirerFermeture', { index: 0 }), 'retirerFermeture', { index: 0 })));
  S = appliquer({}, 'cadrage', { emplacement: 'p', cadrage: '10% 20%', origine: { nom: 'vraie/chef', l: [640] } }); assert.deepEqual(S.photos.p, { nom: 'vraie/chef', l: [640], cadrage: '10% 20%' });
  S = appliquer(S, 'photo', { emplacement: 'p', photo: { nom: 'vraie/salle-midi', l: [640, 1280] } }); assert.equal(S.photos.p.cadrage, '10% 20%', 'changer la photo garde le cadrage');
  assert.ok(estVide(appliquer(S, 'retablirPhoto', { emplacement: 'p' })));
});

test('événements : modifier, masquer, créer, supprimer ; la liste résumée suit', () => {
  const id = AGENDA[0].id;
  let S = appliquer({}, 'evenement', { id, champs: { titre: 'Nouveau titre' }, agenda: AGENDA });
  assert.equal(evenements(AGENDA, S).find((x) => x.id === id).titre, 'Nouveau titre'); assert.equal(S.evenements.liste.length, AGENDA.length);
  S = appliquer(S, 'visibilite', { id, visible: false, agenda: AGENDA }); assert.equal(listeEvenements(AGENDA, S).find((x) => x.id === id).masque, true);
  S = appliquer(S, 'evenement', { id: 'ev-1', champs: { titre: 'Soirée raclette', debut: '2026-12-12', type: 'Soirée', prix: '', service: 'soir' }, agenda: AGENDA });
  assert.equal(evenements(AGENDA, S).length, AGENDA.length + 1); assert.equal(evenements(AGENDA, S).find((x) => x.id === 'ev-1').nouveau, true);
  const tri = evenements(AGENDA, S).map((x) => x.debut); assert.deepEqual(tri, [...tri].sort());
  S = appliquer(S, 'supprimerEvenement', { id: 'ev-1', agenda: AGENDA }); assert.equal(evenements(AGENDA, S).length, AGENDA.length);
});

test('le dépôt : enregistrer, annuler, regrouper les saisies, tout remettre comme livré', () => {
  let t = 0; const m = memoire(), depot = creerDepot(m, () => t); const vus = []; depot.abonner((q) => vus.push(q.type));
  assert.equal(depot.peutAnnuler(), false);
  depot.agir('statut', { id: 'a', statut: 'refusee' }, { libelle: 'Refusée' });
  assert.equal(m.lire().resa.statuts.a, 'refusee', 'enregistré aussitôt');
  assert.equal(depot.annuler(), 'Refusée'); assert.ok(estVide(m.lire()), 'annuler remet le stockage comme avant'); assert.equal(depot.annuler(), false);
  /* Trois saisies du même champ en moins de dix secondes : un seul pas en arrière. */
  for (const v of ['B', 'Bo', 'Bon']) { t += 1000; depot.agir('texte', { cle: 'k', valeur: v }, { groupe: 'texte-k' }); }
  assert.equal(depot.etat().textes.k, 'Bon'); depot.annuler(); assert.ok(estVide(depot.etat()));
  /* Tout remettre comme livré efface aussi les demandes venues du site ; annuler les rend. */
  m.pousser({ id: 'R-1' }); depot.agir('annonce', { active: true, texte: 'Fermé lundi' });
  depot.toutEffacer(); assert.ok(estVide(depot.etat())); assert.deepEqual(m.resasSite(), []);
  depot.annuler(); assert.equal(depot.etat().annonce.texte, 'Fermé lundi'); assert.deepEqual(m.resasSite(), [{ id: 'R-1' }]);
  assert.deepEqual([...new Set(vus)].sort(), ['action', 'annulation']);
});

test('le dépôt : si le stockage refuse, rien ne change', () => {
  const depot = creerDepot(memoire({ plein: true })); const vus = []; depot.abonner((q) => vus.push(q.type));
  assert.equal(depot.agir('annonce', { active: true, texte: 'x' }), false); assert.ok(estVide(depot.etat())); assert.equal(depot.peutAnnuler(), false); assert.deepEqual(vus, ['refus']);
});

test('schéma : un état de la v7.6.0 est mis au schéma courant', () => {
  const ancien = { horaires: { exceptions: [{ date: '2026-12-24' }, { du: '2027-01-04', au: '2027-01-18', motif: 'Congés' }, null] }, annonce: { active: true, texte: 'x' } };
  const d = migrer(ancien); assert.equal(d._schema, SCHEMA);
  assert.deepEqual(d.horaires.exceptions, [{ du: '2026-12-24', au: '2026-12-24', motif: 'Fermeture exceptionnelle' }, { du: '2027-01-04', au: '2027-01-18', motif: 'Congés' }]);
  assert.deepEqual(migrer(null), {}); assert.deepEqual(migrer([1]), {}); assert.ok(estVide(migrer({}))); assert.ok(estVide({ _schema: SCHEMA }), 'le numéro de schéma ne compte pas comme une modification');
  assert.equal(Object.keys(MUTATIONS).length, 16);
});
