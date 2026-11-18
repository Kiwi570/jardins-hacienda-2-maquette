/* Lot A (v7.8.0) : les scénarios de régression. Chaque cas de l'ancien audit est rejoué ici sur les règles pures ; ceux
   qui se jouent dans le navigateur (page Réserver, deux onglets, saisie au fil de l'eau) sont dans
   `_audit/parcours-espace.mjs`. Lancer : node --test _audit/tests/*.test.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { etatService, arrivees, faisabilite, equipeDe, bornes, dateValide } from '../../assets/js/disponibilites.js';
import { appliquer, creerDepot, difference, defaire } from '../../assets/js/espace-donnees.js';
import { ajouter, aujourdhui, ouvert, ouvertSite, creneauxDuJour, verifierResa, gardeMetier, aConfirmer, trouverResa, resasDuJour, evenements, listeEvenements, horizonDe, CAPACITE } from '../../assets/js/espace-regles.js';
import { comprendre, lireHeureDetail, lireDateDetail, simplifier } from '../../assets/js/espace-commandes.js';
import { tableApres, planDuService } from '../../assets/js/espace-salle.js';
import { serviceDuJour } from '../../assets/js/espace-service.js';

const lire = (f) => JSON.parse(readFileSync(new URL(`../../donnees/${f}`, import.meta.url), 'utf8'));
const R = lire('reservation.json'), SALLE = lire('salle.json'), AGENDA = lire('agenda.json').dates;
const AUJ = '2026-11-18'; /* un mercredi */
const ctx = (site = []) => ({ R, auj: AUJ, site, exceptions: [] });
const SYLVESTRE = '2026-12-31', VENDREDI = '2026-11-20', MERCREDI = '2026-11-25', MARDI = '2026-11-24';
const SEMAINE = { lundi: [], mardi: [], mercredi: ['12:00-14:30'], jeudi: ['12:00-14:30'], vendredi: ['12:00-14:30', '19:00-00:00'], samedi: ['19:00-00:00'], dimanche: ['12:00-16:00'] };
/* Le site et l'espace lisent la même fonction : côté site, l'aperçu pose `equipe` dans les réglages ; côté espace, elle est passée en argument. */
const cotePublic = (S) => ({ ...R, equipe: equipeDe(S) });
function memoire({ plein = false } = {}) {
  let etat = {}, site = [], demandes = [];
  return { lire: () => JSON.parse(JSON.stringify(etat)), ecrire: (d) => { if (plein) return false; etat = JSON.parse(JSON.stringify(d)); return true; }, vider: () => { etat = {}; site = []; demandes = []; },
    resasSite: () => [...site], ecrireResasSite: (l) => { site = [...l]; return true; }, demandesSite: () => [...demandes], ecrireDemandesSite: (l) => { demandes = [...l]; return true; }, pousser: (r) => site.push(r) };
}
const un = (t, S = {}) => comprendre(t, { auj: AUJ, R, S, exceptions: [], pages: {}, carte: lire('carte.json').rubriques })[0];

test('1. un service dit complet le reste, même un soir d\'ouverture exceptionnelle', () => {
  const S = appliquer({}, 'complet', { date: SYLVESTRE, service: 'soir', actif: true });
  const e = etatService(cotePublic(S), SYLVESTRE, 'soir');
  assert.equal(e.ouvert, true); assert.equal(e.exceptionnel, true); assert.equal(e.complet, true);
  assert.equal(faisabilite(cotePublic(S), { date: SYLVESTRE, service: 'soir', heure: '20:00', couverts: 2 }, { auj: AUJ, public: true }).raison, 'complet', 'le site refuse');
  const equipe = verifierResa(ctx(), S, { date: SYLVESTRE, service: 'soir', heure: '20:00', couverts: 2 });
  assert.equal(equipe.ok, true); assert.equal(equipe.alerte, 'complet', 'l\'équipe peut ajouter, en le sachant');
  /* Et un vendredi ordinaire. */
  const S2 = appliquer({}, 'complet', { date: VENDREDI, service: 'soir', actif: true });
  assert.equal(etatService(cotePublic(S2), VENDREDI, 'soir').complet, true); assert.equal(etatService(cotePublic(S2), VENDREDI, 'midi').complet, false);
});

test('2. une ouverture déplacée à 13 h ne laisse pas proposer midi', () => {
  const S = appliquer({}, 'horaires', { semaine: { ...SEMAINE, mercredi: ['13:00-14:30'] } });
  assert.deepEqual(arrivees(cotePublic(S), MERCREDI, 'midi'), ['13:00', '13:15', '13:30'], 'le site');
  assert.deepEqual(creneauxDuJour(ctx(), S, MERCREDI, 'midi'), ['13:00', '13:15', '13:30'], 'l\'espace');
  const v = verifierResa(ctx(), S, { date: MERCREDI, service: 'midi', heure: '12:00', couverts: 2 });
  assert.equal(v.ok, false); assert.equal(v.raison, 'heure'); assert.deepEqual(v.propositions, ['13:00', '13:15'], 'les arrivées les plus proches sont proposées');
  /* La dernière arrivée reste distincte de la fermeture : fermer à 14 h avance la dernière arrivée d'une demi-heure. */
  const S2 = appliquer({}, 'horaires', { semaine: { ...SEMAINE, mercredi: ['12:00-14:00'] } });
  assert.equal(arrivees(cotePublic(S2), MERCREDI, 'midi').at(-1), '13:00');
  /* Sans changement d'horaires, rien ne bouge ; un soir qui ferme à minuit compte jusqu'à 24 h. */
  assert.deepEqual(arrivees(R, MERCREDI, 'midi'), arrivees(cotePublic(appliquer({}, 'horaires', { semaine: SEMAINE })), MERCREDI, 'midi'));
  assert.deepEqual(bornes('19:00-00:00'), [1140, 1440]); assert.equal(arrivees(cotePublic(appliquer({}, 'horaires', { semaine: SEMAINE })), VENDREDI, 'soir').at(-1), '21:30');
});

test('3. la Saint-Sylvestre : la même réponse pour le site et pour l\'équipe', () => {
  for (const S of [{}, appliquer({}, 'horaires', { semaine: SEMAINE })]) {
    assert.equal(etatService(cotePublic(S), SYLVESTRE, 'soir').ouvert, true, 'le site'); assert.equal(ouvert(ctx(), S, SYLVESTRE, 'soir'), true, 'l\'espace');
    assert.equal(etatService(cotePublic(S), '2026-12-24', 'soir').ouvert, false, 'un jeudi soir ordinaire reste fermé'); assert.equal(ouvert(ctx(), S, '2026-12-24', 'soir'), false);
  }
  assert.equal(etatService(R, SYLVESTRE, 'soir').note, 'Saint-Sylvestre'); assert.equal(ouvertSite(R, SYLVESTRE, 'soir'), true);
  /* Une fermeture exceptionnelle l'emporte sur l'ouverture exceptionnelle. */
  const conges = appliquer({}, 'ajouterFermeture', { du: '2026-12-28', au: '2027-01-03', motif: 'Congés annuels' });
  assert.equal(etatService(cotePublic(conges), SYLVESTRE, 'soir').raison, 'fermeture'); assert.equal(ouvert(ctx(), conges, SYLVESTRE, 'soir'), false);
  /* Le restaurant ouvre exceptionnellement un mardi soir depuis son espace : ouvert des deux côtés, puis retiré. */
  let S = appliquer({}, 'ouvertureExceptionnelle', { date: MARDI, service: 'soir', actif: true, note: 'Soirée privée' });
  assert.equal(etatService(cotePublic(S), MARDI, 'soir').exceptionnel, true); assert.equal(ouvert(ctx(), S, MARDI, 'soir'), true); assert.equal(ouvert(ctx(), S, MARDI, 'midi'), false);
  assert.equal(verifierResa(ctx(), S, { date: MARDI, service: 'soir', heure: '20:00', couverts: 4 }).ok, true);
  S = appliquer(S, 'ouvertureExceptionnelle', { date: MARDI, service: 'soir', actif: false }); assert.equal(ouvert(ctx(), S, MARDI, 'soir'), false); assert.equal(S.resa.ouvertures, undefined);
});

test('4. une demande en attente reste visible au-delà de 28 jours', () => {
  assert.equal(horizonDe(R), 60);
  const site = [45, 90].map((k) => ({ id: `R-${k}`, date: ajouter(AUJ, k), service: 'soir', heure: '20:00', couverts: 2, prenom: 'Claire', nom: `Essai ${k}`, telephone: '06 00 00 00 00' }));
  const ids = aConfirmer(ctx(site), {}).map((r) => r.id);
  assert.ok(ids.includes('R-45'), 'dans l\'horizon de 60 jours'); assert.ok(ids.includes('R-90'), 'et même au-delà : une demande reçue n\'est jamais oubliée');
  assert.equal(trouverResa(ctx(site), {}, 'R-90').nom, 'Claire Essai 90');
});

test('5. un changement du nombre de couverts retire une table devenue trop petite', () => {
  const jour = Array.from({ length: 10 }, (_, k) => ajouter(AUJ, k)).find((iso) => serviceDuJour(ctx(), {}, iso, 'soir').resas.length >= 2);
  const [a, b] = serviceDuJour(ctx(), {}, jour, 'soir').resas;
  let S = appliquer({}, 'placerResa', { id: a.id, table: '1' }); /* table 1 : deux places */
  S = appliquer(S, 'modifierResa', { id: a.id, champs: { couverts: 2 } });
  const r = () => serviceDuJour(ctx(), S, jour, 'soir').resas.find((x) => x.id === a.id);
  assert.equal(tableApres(ctx(), S, SALLE, r(), { couverts: 2 }).convient, true);
  const ta = tableApres(ctx(), S, SALLE, r(), { couverts: 5 }); assert.equal(ta.convient, false); assert.match(ta.raison, /2 places pour 5 couverts/);
  S = appliquer(S, 'modifierResa', { id: a.id, champs: { couverts: 5, table: '' } });
  assert.equal(r().table, ''); assert.ok(planDuService(ctx(), S, SALLE, jour, 'soir').aPlacer.some((x) => x.id === a.id), 'elle est à replacer');
  /* Déplacée à une heure où sa table est prise : même chose. */
  let S2 = appliquer({}, 'placerResa', { id: a.id, table: '7' }); S2 = appliquer(S2, 'placerResa', { id: b.id, table: '7' });
  S2 = appliquer(S2, 'modifierResa', { id: b.id, champs: { heure: '21:30' } }); S2 = appliquer(S2, 'modifierResa', { id: a.id, champs: { heure: '19:00' } });
  const ra = serviceDuJour(ctx(), S2, jour, 'soir').resas.find((x) => x.id === a.id);
  assert.equal(tableApres(ctx(), S2, SALLE, ra, { heure: '21:30' }).convient, false);
});

test('6. une réservation impossible ne devient pas confirmée : ni par la barre, ni par un appel direct', () => {
  const p = comprendre('table pour 4 mardi 20 h au nom de Martin', { auj: AUJ, R, S: {}, exceptions: [], pages: {} });
  assert.ok(p.every((x) => !x.action), 'un mardi, fermé : aucune action proposée'); assert.equal(p[0].genre, 'erreur');
  const m = memoire(), depot = creerDepot(m, undefined, { garde: (nom, args, frais) => gardeMetier(ctx(m.resasSite()), frais, nom, args) });
  const resa = (plus) => ({ id: 'tel-1', date: MARDI, service: 'soir', heure: '20:00', couverts: 4, nom: 'Martin', statut: 'confirmee', source: 'telephone', ...plus });
  assert.equal(depot.agir('ajouterResa', { resa: resa() }), false); assert.match(depot.raisonRefus(), /Réservation impossible/); assert.deepEqual(m.lire(), {}, 'rien n\'est enregistré');
  assert.equal(depot.agir('ajouterResa', { resa: resa({ date: VENDREDI, heure: '20:10' }) }), false, 'une heure qui n\'est pas une arrivée');
  assert.equal(depot.agir('ajouterResa', { resa: resa({ date: VENDREDI, couverts: 0 }) }), false); assert.equal(depot.agir('ajouterResa', { resa: resa({ date: VENDREDI, couverts: CAPACITE + 1 }) }), false);
  assert.equal(depot.agir('ajouterResa', { resa: resa({ date: '2026-02-31' }) }), false, 'une date qui n\'existe pas'); assert.equal(depot.agir('ajouterResa', { resa: resa({ date: ajouter(AUJ, -1) }) }), false, 'une date passée');
  assert.equal(depot.agir('ajouterResa', { resa: resa({ date: VENDREDI }) }), true); assert.equal(depot.peutAnnuler(), true);
  /* Une demande du site pour un service fermé ensuite : la confirmer est refusé, la refuser reste possible. */
  m.pousser({ id: 'R-1', date: VENDREDI, service: 'soir', heure: '20:00', couverts: 2, prenom: 'Claire', nom: 'Essai' });
  depot.agir('fermer', { date: VENDREDI, service: 'soir', actif: true });
  assert.equal(depot.agir('statut', { id: 'R-1', statut: 'confirmee' }), false); assert.match(depot.raisonRefus(), /Confirmation impossible/);
  assert.equal(depot.agir('statut', { id: 'R-1', statut: 'refusee' }), true);
  /* Déplacer une réservation vers une heure impossible : refusé, l'ancienne heure est gardée. */
  assert.equal(depot.agir('modifierResa', { id: 'tel-1', champs: { heure: '23:00' } }), false); assert.equal(trouverResa(ctx(), m.lire(), 'tel-1').heure, '20:00');
});

test('7. une sauvegarde refusée ne dit jamais « enregistré »', () => {
  const depot = creerDepot(memoire({ plein: true })), vus = []; depot.abonner((q) => vus.push(q.type));
  assert.equal(depot.agir('annonce', { active: true, texte: 'x' }), false); assert.deepEqual(vus, ['refus']); assert.equal(depot.peutAnnuler(), false); assert.equal(depot.raisonRefus(), '', 'le stockage a refusé, pas une règle');
});

test('8. plus de limite à 80 entrées : rien n\'est effacé en silence', async () => {
  const boite = new Map(); let plein = false;
  globalThis.localStorage = { getItem: (k) => (boite.has(k) ? boite.get(k) : null), setItem: (k, v) => { if (plein) throw new Error('QuotaExceededError'); boite.set(k, String(v)); }, removeItem: (k) => boite.delete(k) };
  const stock = await import('../../assets/js/espace-stock.js?lot-a');
  for (let i = 0; i < 120; i++) assert.equal(stock.ajouterResaSite({ id: `R-${i}`, date: VENDREDI }), true);
  assert.equal(stock.resasSite().length, 120); assert.equal(stock.resasSite()[0].id, 'R-0', 'la première demande est toujours là');
  for (let i = 0; i < 100; i++) stock.ajouterDemandeSite({ genre: 'question', message: `q${i}` });
  assert.equal(stock.demandesSite().length, 100);
  plein = true; assert.equal(stock.ajouterResaSite({ id: 'R-plein', date: VENDREDI }), false, 'mémoire pleine : l\'écriture échoue et le dit'); assert.equal(stock.resasSite().length, 120, 'sans rien perdre');
  delete globalThis.localStorage;
});

test('9. annuler ne supprime pas le travail fait ensuite par quelqu\'un d\'autre', () => {
  const m = memoire(), moi = creerDepot(m), autre = creerDepot(m);
  moi.agir('statut', { id: 'a', statut: 'refusee' });
  autre.agir('statut', { id: 'b', statut: 'confirmee' }); autre.agir('ajouterResa', { resa: { id: 'tel-9', date: VENDREDI, service: 'soir', heure: '20:00', couverts: 2, nom: 'Autre' } });
  moi.annuler();
  assert.equal(m.lire().resa.statuts.a, undefined, 'mon geste est défait'); assert.equal(m.lire().resa.statuts.b, 'confirmee'); assert.equal(m.lire().resa.ajouts.length, 1, 'le travail de l\'autre est gardé'); assert.equal(moi.conflitsAnnulation(), 0);
  /* Deux fermetures posées l'une après l'autre : annuler la mienne laisse l'autre. */
  moi.agir('ajouterFermeture', { du: '2027-01-04', au: '2027-01-18', motif: 'Congés annuels' }); autre.agir('ajouterFermeture', { du: '2027-02-01', au: '2027-02-02', motif: 'Travaux' });
  moi.annuler(); assert.deepEqual(m.lire().horaires.exceptions.map((x) => x.motif), ['Travaux']);
  /* Le même texte retouché ailleurs : il est gardé, et l'annulation le dit. */
  moi.agir('annonce', { active: true, texte: 'Fermé lundi' }); autre.agir('annonce', { texte: 'Fermé lundi et mardi' });
  moi.annuler(); assert.equal(m.lire().annonce.texte, 'Fermé lundi et mardi'); assert.equal(m.lire().annonce.active, undefined, 'ce que personne n\'a retouché est défait'); assert.ok(moi.conflitsAnnulation() >= 1);
  /* « Tout remettre comme livré », puis quelqu'un travaille, puis « Annuler » : tout revient, son travail aussi. */
  moi.toutEffacer(); autre.agir('statut', { id: 'c', statut: 'arrivee' }); moi.annuler();
  assert.equal(m.lire().resa.statuts.b, 'confirmee'); assert.equal(m.lire().resa.statuts.c, 'arrivee');
  /* Les fonctions de base : la différence d'une action, défaite sur un état qui a bougé. */
  const avant = { a: { x: 1 }, l: [{ id: 1 }, { id: 2 }] }, apres = { a: { x: 2, y: 3 }, l: [{ id: 2 }, { id: 3 }], n: { z: [1] } };
  assert.deepEqual(defaire(apres, difference(avant, apres)).etat, avant, 'sans rien d\'autre, on revient exactement en arrière');
  const bouge = { a: { x: 2, y: 3, w: 9 }, l: [{ id: 2 }, { id: 3 }, { id: 4 }], n: { z: [1] } };
  assert.deepEqual(defaire(bouge, difference(avant, apres)).etat, { a: { x: 1, w: 9 }, l: [{ id: 1 }, { id: 2 }, { id: 4 }] });
});

test('10. un événement modifié dit la même chose dans toutes ses listes', () => {
  const id = AGENDA[0].id, S = appliquer({}, 'evenement', { id, champs: { titre: 'Côte de bœuf au feu de bois', prix: '39 €', debut: '2026-11-22' }, agenda: AGENDA });
  const billet = evenements(AGENDA, S).find((x) => x.id === id), resume = listeEvenements(AGENDA, S).find((x) => x.id === id), publie = S.evenements.liste.find((x) => x.id === id);
  for (const x of [billet, resume, publie]) assert.deepEqual({ titre: x.titre, prix: x.prix, debut: x.debut }, { titre: 'Côte de bœuf au feu de bois', prix: '39 €', debut: '2026-11-22' });
});

test('12. les phrases ambiguës : une erreur ou une question, jamais une autre valeur à la place', () => {
  /* Négation. */
  const neg = un('ne ferme pas samedi soir'); assert.equal(neg.genre, 'erreur'); assert.equal(neg.action, undefined);
  assert.equal(un('le foie gras n\'est pas épuisé').genre, 'erreur'); assert.equal(un('ne pas réserver pour 4 vendredi 20 h').action, undefined);
  const S = appliquer({}, 'fermer', { date: '2026-11-21', service: 'soir', actif: true });
  const l = comprendre('on ne ferme pas samedi soir', { auj: AUJ, R, S, exceptions: [], pages: {} });
  assert.equal(l[0].aChoisir, true); assert.equal(l[1].action.args.actif, false, 'si le service était fermé, « Rouvrir » est proposé, sans être lancé');
  assert.equal(un('plus de foie gras').action.nom, 'epuise', '« plus de » reste « épuisé »'); assert.equal(un('il n\'y a plus de foie gras').action.nom, 'epuise');
  /* Date impossible. */
  for (const t of ['fermer le 31 février', 'table pour 4 le 31/02 à 20 h', 'complet le 32']) { const p = un(t); assert.equal(p.genre, 'erreur', t); assert.match(p.titre, /n'existe pas/); assert.equal(p.action, undefined); }
  assert.deepEqual(lireDateDetail(simplifier('fermer le 30 février'), AUJ), { date: null, erreur: '30 fevrier' }); assert.equal(dateValide('2026-02-31'), false); assert.equal(dateValide('2028-02-29'), true);
  /* Heure invalide. */
  for (const t of ['table pour 4 vendredi 25 h', 'table pour 4 vendredi 20 h 75']) { const p = un(t); assert.equal(p.genre, 'erreur', t); assert.match(p.titre, /cette heure n'existe pas/); }
  /* « Midi et demi » et ses cousins. */
  const h = (t) => lireHeureDetail(simplifier(t)).heure;
  assert.equal(h('midi et demi'), '12:30'); assert.equal(h('midi et quart'), '12:15'); assert.equal(h('à midi'), '12:00'); assert.equal(h('20 h et demie'), '20:30'); assert.equal(h('20 h moins le quart'), '19:45'); assert.equal(h('demain midi'), null, '« demain midi » dit le service, pas l\'heure');
  assert.equal(un('table pour 2 vendredi midi et demi au nom de Martin').action.args.resa.heure, '12:30');
  /* Quantité hors limites : dite, pas rabotée. */
  const gros = un('table pour 80 vendredi 20 h'); assert.equal(gros.action, undefined); assert.match(gros.titre, /80 couverts/); assert.equal(un('table pour 0 vendredi 20 h').action, undefined);
  assert.equal(un('table pour 12 vendredi 20 h au nom de Martin').action.args.resa.couverts, 12, 'douze couverts sont notés tels quels');
});

test('fuseau et changements d\'heure : le jour et l\'heure sont ceux de Moineville', () => {
  assert.deepEqual(aujourdhui(new Date('2027-03-28T00:30:00Z')), { iso: '2027-03-28', min: 90 }, '1 h 30, heure d\'hiver');
  assert.deepEqual(aujourdhui(new Date('2027-03-28T01:30:00Z')), { iso: '2027-03-28', min: 210 }, '3 h 30 : l\'heure d\'été a sauté 2 h');
  assert.deepEqual(aujourdhui(new Date('2026-10-24T22:30:00Z')), { iso: '2026-10-25', min: 30 }, 'minuit et demi, déjà le lendemain à Moineville');
  assert.equal(ajouter('2027-03-27', 1), '2027-03-28'); assert.equal(ajouter('2026-10-25', 1), '2026-10-26', 'un jour de 25 heures reste un jour');
  assert.equal(arrivees(R, '2027-03-28', 'midi').length, arrivees(R, '2026-11-22', 'midi').length, 'un dimanche de changement d\'heure a les mêmes arrivées');
  assert.ok(resasDuJour(ctx(), {}, VENDREDI).every((r) => arrivees(R, VENDREDI, r.service).includes(r.heure)), 'les réservations d\'exemple tombent sur des heures d\'arrivée');
});
