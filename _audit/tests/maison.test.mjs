/* v7.10.0, « Toute la maison au même endroit » : les règles pures de l'accueil, des tâches, de la liste des clients et de
   la recherche. Ce qui se voit à l'écran (navigation, briefing, formulaires) est joué dans `_audit/parcours-espace.mjs`.
   Lancer : node --test _audit/tests/*.test.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { publier } from '../../assets/js/disponibilites.js';
import { appliquer } from '../../assets/js/espace-donnees.js';
import { ajouter, resasDuJour, telephoneDemo, couverts } from '../../assets/js/espace-regles.js';
import { demandes } from '../../assets/js/espace-demandes.js';
import { listeClients, demandesDuClient, cleClient } from '../../assets/js/espace-clients.js';
import { nouvelleTache, tachesDuJour, tachesLiees, tachesEnRetard, etatTache } from '../../assets/js/espace-taches.js';
import { prochainService, resumeService, priorites, activitesDuJour, filDuJour, accueil, nomService, cleService, GRANDE_TABLEE } from '../../assets/js/espace-accueil.js';
import { rechercher, correspond } from '../../assets/js/espace-recherche.js';

const lire = (f) => JSON.parse(readFileSync(new URL(`../../donnees/${f}`, import.meta.url), 'utf8'));
const SALLE = lire('salle.json'), AGENDA = lire('agenda.json').dates, HORAIRES = lire('horaires.json').adresses[0], R = publier(lire('reservation.json'), HORAIRES).reservation;
const AUJ = '2026-11-20' /* un vendredi : midi et soir ouverts */, ctx = (plus = {}) => ({ R, auj: AUJ, site: [], demandes: [], produits: [{ nom: 'Terrine', prix: 12 }, { nom: 'Tarte', prix: 9 }], exceptions: [], agenda: AGENDA, pages: {}, ...plus });
const jouer = (S, ...actions) => actions.reduce((e, [nom, args]) => appliquer(e, nom, args), S);

test('tâches : créer, modifier, terminer, rouvrir, supprimer ; l\'état suit la date', () => {
  assert.equal(nouvelleTache({ id: 't1', titre: '   ', cree: 'x' }), null, 'pas de tâche sans titre');
  const t1 = nouvelleTache({ id: 't1', titre: '  Vérifier   la terrasse ', echeance: AUJ, responsable: ' Léa ', cree: '2026-11-20T08:00:00Z' });
  assert.deepEqual(t1, { id: 't1', titre: 'Vérifier la terrasse', fait: false, cree: '2026-11-20T08:00:00Z', echeance: AUJ, responsable: 'Léa' });
  const t2 = nouvelleTache({ id: 't2', titre: 'Rappeler Camille', echeance: ajouter(AUJ, -2), lien: { type: 'demande', id: 'demo-reception-1', libelle: 'Camille R. · Réception' }, cree: '2026-11-18T08:00:00Z' });
  const t3 = nouvelleTache({ id: 't3', titre: 'Commander le pain', echeance: 'demain', cree: '2026-11-20T09:00:00Z' });
  assert.ok(!('echeance' in t3), 'une date mal formée n\'est pas gardée');
  let S = jouer({}, ['tacheAjouter', { tache: t1 }], ['tacheAjouter', { tache: t2 }], ['tacheAjouter', { tache: t3 }], ['tacheAjouter', { tache: t1 }]);
  assert.equal(S.taches.liste.length, 3, 'la même tâche ajoutée deux fois ne fait pas un doublon');
  assert.deepEqual(tachesDuJour(S, AUJ).map((t) => [t.id, t.etat]), [['t2', 'retard'], ['t1', 'jour'], ['t3', 'libre']]);
  assert.deepEqual(tachesEnRetard(S, AUJ).map((t) => t.id), ['t2']);
  assert.deepEqual(tachesLiees(S, 'demande', 'demo-reception-1').map((t) => t.id), ['t2']);
  S = jouer(S, ['tacheModifier', { id: 't3', champs: { titre: 'Commander le pain de seigle', echeance: ajouter(AUJ, 1), responsable: '' } }], ['tacheTerminer', { id: 't2', fait: true, le: AUJ }]);
  assert.equal(S.taches.liste.find((t) => t.id === 't3').titre, 'Commander le pain de seigle'); assert.equal(etatTache(S.taches.liste.find((t) => t.id === 't3'), AUJ), 'venir');
  assert.deepEqual(tachesDuJour(S, AUJ).map((t) => [t.id, t.etat]), [['t1', 'jour'], ['t3', 'venir'], ['t2', 'faite']], 'terminée aujourd\'hui : encore visible, en dernier');
  assert.deepEqual(tachesDuJour(S, ajouter(AUJ, 1)).map((t) => t.id), ['t1', 't3'], 'le lendemain, la tâche terminée la veille n\'encombre plus');
  S = jouer(S, ['tacheTerminer', { id: 't2', fait: false }]); assert.ok(!S.taches.liste.find((t) => t.id === 't2').faitLe);
  S = jouer(S, ['tacheSupprimer', { id: 't1' }], ['tacheSupprimer', { id: 't2' }], ['tacheSupprimer', { id: 't3' }]); assert.ok(!S.taches, 'plus de tâche : rien ne reste dans l\'état');
});

test('prochain service : le service en cours, puis le suivant, en sautant les services fermés', () => {
  assert.deepEqual(prochainService(ctx(), {}, 9 * 60), { date: AUJ, service: 'midi', estAujourdhui: true, enCours: false });
  assert.equal(prochainService(ctx(), {}, 12 * 60 + 30).enCours, true);
  assert.deepEqual(prochainService(ctx(), {}, 17 * 60), { date: AUJ, service: 'soir', estAujourdhui: true, enCours: false });
  const tard = prochainService(ctx(), {}, 23 * 60 + 50); assert.ok(tard.date >= AUJ);
  const S = jouer({}, ['fermer', { date: AUJ, service: 'soir', actif: true }]);
  const apres = prochainService(ctx(), S, 17 * 60); assert.ok(apres.date > AUJ, 'le soir fermé par l\'équipe n\'est pas « le prochain service »');
  assert.equal(nomService(ctx(), AUJ, 'soir'), 'Ce soir'); assert.equal(nomService(ctx(), ajouter(AUJ, 1), 'midi'), 'Demain midi');
});

test('résumé d\'un service : les chiffres de l\'accueil sont ceux des listes', () => {
  const l = resasDuJour(ctx(), {}, AUJ).filter((r) => r.service === 'soir'), r = resumeService(ctx(), {}, SALLE, AUJ, 'soir');
  const conf = l.filter((x) => x.statut === 'confirmee'), dem = l.filter((x) => x.statut === 'a-confirmer');
  assert.equal(r.confirmees, conf.length); assert.equal(r.couvertsAttendus, couverts(conf)); assert.equal(r.demandes.length, dem.length);
  assert.equal(r.grandes.length, conf.filter((x) => +x.couverts >= GRANDE_TABLEE).length);
  assert.equal(r.aPlacer.length, conf.length, 'sans plan de salle rempli, chaque réservation confirmée reste à placer');
  assert.ok(r.attentions.every((x) => x.demande || x.allergies.length || x.noteClient), 'rien d\'inventé : seulement ce qui est noté');
  /* Une demande n'est pas une réservation confirmée ; une arrivée est une personne accueillie. */
  const id = conf[0].id, S = jouer({}, ['statut', { id, statut: 'arrivee' }], ['placerResa', { id: conf[1].id, table: '1' }]), r2 = resumeService(ctx(), S, SALLE, AUJ, 'soir');
  assert.equal(r2.confirmees, conf.length - 1); assert.equal(r2.accueillies, 1); assert.equal(r2.couvertsAttendus, couverts(conf), 'les couverts attendus comptent les confirmés et les accueillis');
  assert.equal(r2.aPlacer.some((x) => x.id === conf[1].id), false); assert.equal(r2.placees, 1);
  /* Une note de la fiche client se retrouve sur le briefing de sa réservation. */
  const S3 = jouer({}, ['client', { cle: cleClient(conf[0]), champs: { allergies: ['Gluten'], note: 'Table près de la cheminée' } }]), r3 = resumeService(ctx(), S3, SALLE, AUJ, 'soir');
  const vu = r3.attentions.find((x) => x.id === conf[0].id); assert.deepEqual(vu.allergies, ['Gluten']); assert.equal(vu.noteClient, 'Table près de la cheminée');
});

test('priorités : déduites des données, une par situation, à jour après une action', () => {
  const p = priorites(ctx(), {}, SALLE, 17 * 60), ids = p.map((x) => x.id);
  assert.equal(new Set(ids).size, ids.length, 'pas deux fois la même');
  const placer = p.find((x) => x.id === `placer-${AUJ}-soir`); assert.ok(placer, 'les réservations sans table du prochain service'); assert.deepEqual(placer.aller, { vue: 'resas', onglet: 'salle', jour: AUJ, service: 'soir' });
  assert.ok(p.every((x) => x.titre && x.raison && x.bouton && x.aller), 'chacune dit quoi, pourquoi, et où aller');
  /* « Plus tard » : elle se tait pour aujourd'hui et revient demain. */
  const tue = jouer({}, ['taireConseil', { id: placer.id, date: AUJ }]); assert.ok(!priorites(ctx(), tue, SALLE, 17 * 60).some((x) => x.id === placer.id));
  assert.ok(priorites(ctx({ auj: ajouter(AUJ, 1) }), tue, SALLE, 9 * 60).every((x) => x.id !== placer.id), 'le lendemain, c\'est un autre service : une autre priorité');
  /* Tout placer : la priorité disparaît. */
  const conf = resasDuJour(ctx(), {}, AUJ).filter((r) => r.service === 'soir' && r.statut === 'confirmee');
  const S = jouer({}, ['placerPlusieurs', { places: Object.fromEntries(conf.map((r, i) => [r.id, String(SALLE.tables[i].id)])) }]);
  assert.ok(!priorites(ctx(), S, SALLE, 17 * 60).some((x) => x.id.startsWith('placer-')));
  /* Une tâche en retard devient une priorité ; terminée, elle ne l'est plus. */
  const t = nouvelleTache({ id: 't9', titre: 'Rappeler le fleuriste', echeance: ajouter(AUJ, -1), cree: 'x' }), S2 = jouer({}, ['tacheAjouter', { tache: t }]);
  assert.ok(priorites(ctx(), S2, SALLE, 17 * 60).some((x) => x.id === 'tache-t9' && /En retard/.test(x.titre)));
  assert.ok(!priorites(ctx(), jouer(S2, ['tacheTerminer', { id: 't9', fait: true, le: AUJ }]), SALLE, 17 * 60).some((x) => x.id === 'tache-t9'));
  /* Aujourd'hui et demain fermés : le prochain service est plus loin, on ne demande pas de placer une salle de dans deux jours. */
  const ferme = jouer({}, ['fermer', { date: AUJ, services: ['midi', 'soir'], actif: true }], ['fermer', { date: ajouter(AUJ, 1), services: ['midi', 'soir'], actif: true }]);
  assert.ok(prochainService(ctx(), ferme, 9 * 60).date > ajouter(AUJ, 1)); assert.ok(!priorites(ctx(), ferme, SALLE, 9 * 60).some((x) => x.id.startsWith('placer-')));
});

test('fil de la journée et agenda : une demande datée reste une demande', () => {
  const ev = AGENDA[0], jourEv = String(ev.debut).slice(0, 10), a = activitesDuJour(ctx(), {}, jourEv);
  assert.ok(a.some((x) => x.type === 'soiree' && x.titre === ev.titre && x.statut === 'Affichée sur le site' && x.aller.vue === 'carte' && x.aller.onglet === 'soirees'), 'la soirée ouvre son éditeur, dans Offres');
  const S = jouer({}, ['visibilite', { id: ev.id, visible: false, agenda: AGENDA }]);
  assert.equal(activitesDuJour(ctx(), S, jourEv).find((x) => x.type === 'soiree').statut, 'Masquée sur le site');
  /* Le mariage de Camille R. : une date souhaitée, rien de réservé. */
  const mariage = demandes(ctx(), {}).find((d) => d.id === 'demo-reception-1'), jm = mariage.brut.date, vu = activitesDuJour(ctx(), {}, jm).find((x) => x.type === 'reception');
  assert.ok(vu); assert.match(vu.statut, /^Demande/); assert.equal(vu.ferme, false); assert.match(vu.detail, /rien n'est réservé/);
  const signe = activitesDuJour(ctx(), jouer({}, ['etapeDemande', { id: 'demo-reception-1', statut: 'signe' }]), jm).find((x) => x.type === 'reception'); assert.equal(signe.statut, 'Signée'); assert.equal(signe.ferme, true);
  assert.ok(!activitesDuJour(ctx(), jouer({}, ['etapeDemande', { id: 'demo-reception-1', statut: 'perdue' }]), jm).some((x) => x.type === 'reception'), 'sans suite : plus dans l\'agenda');
  /* Le retrait traiteur de Julien M. */
  const traiteur = demandes(ctx(), {}).find((d) => d.genre === 'traiteur'), r = activitesDuJour(ctx(), {}, traiteur.brut.jour).find((x) => x.type === 'retrait');
  assert.equal(r.statut, 'Commande à confirmer'); assert.equal(r.aller.demande, traiteur.id);
  /* Le fil du jour : les services dans l'ordre de l'horloge, avec leur état. */
  const fil = filDuJour(ctx(), {}, AUJ, 15 * 60).filter((x) => x.type === 'service');
  assert.deepEqual(fil.map((x) => x.service), ['midi', 'soir']); assert.equal(fil[1].statut, 'À venir'); assert.ok(['Terminé', 'En cours'].includes(fil[0].statut), 'à 15 h, le midi n\'est plus « à venir »');
  const a2 = accueil(ctx(), {}, SALLE, 17 * 60); assert.equal(a2.prochain.service, 'soir'); assert.equal(a2.prochain.nom, 'Ce soir'); assert.equal(cleService(a2.prochain.date, a2.prochain.service), `${AUJ}|soir`);
  /* Mode connecté : aucun exemple, donc ni réception ni retrait inventés. */
  assert.deepEqual(activitesDuJour(ctx({ exemples: false }), {}, jm).filter((x) => x.type !== 'soiree'), []);
});

test('clients : une personne d\'exemple a le même téléphone partout ; deux personnes ne sont réunies que par le téléphone', () => {
  const dems = demandes(ctx(), {}), l = listeClients(ctx(), {}, dems);
  const camille = l.filter((c) => c.nom === 'Camille R.'); assert.equal(camille.length, 1, 'Camille R. des réservations et Camille R. du mariage : une seule fiche');
  assert.equal(camille[0].telephone, telephoneDemo('Camille R.')); assert.ok(camille[0].resas > 0); assert.deepEqual(camille[0].demandes.map((d) => d.id), ['demo-reception-1']); assert.equal(camille[0].exemple, true);
  assert.deepEqual(demandesDuClient(dems, camille[0].cle).map((d) => d.id), ['demo-reception-1']);
  assert.equal(new Set(l.map((c) => c.cle)).size, l.length, 'une ligne par client');
  /* Deux réservations du site au même nom, deux téléphones : deux clients. Sans téléphone : reconnu par le nom, et dit. */
  const site = [{ id: 's1', date: AUJ, service: 'soir', heure: '20:00', couverts: 2, prenom: 'Marie', nom: 'Durand', telephone: '06 11 11 11 11', statut: 'a-confirmer' }, { id: 's2', date: AUJ, service: 'soir', heure: '20:30', couverts: 4, prenom: 'Marie', nom: 'Durand', telephone: '06 22 22 22 22', statut: 'a-confirmer' },
    { id: 's3', date: ajouter(AUJ, 1), service: 'soir', heure: '20:00', couverts: 2, prenom: 'Jean', nom: 'Sansnumero', telephone: '', statut: 'a-confirmer' }];
  const l2 = listeClients(ctx({ site, exemples: false }), {}, []);
  assert.deepEqual(l2.map((c) => [c.nom, c.telephone, c.parNom, c.exemple]), [['Jean Sansnumero', '', true, false], ['Marie Durand', '06 11 11 11 11', false, false], ['Marie Durand', '06 22 22 22 22', false, false]]);
  assert.equal(l2[1].prochaine.id, 's1');
  /* Un client dont la maison a noté quelque chose reste dans la liste, avec sa note. */
  const S = jouer({}, ['client', { cle: l2[1].cle, champs: { habitue: true, allergies: ['Lait'] } }]); const m = listeClients(ctx({ site, exemples: false }), S, []).find((c) => c.cle === l2[1].cle);
  assert.equal(m.habitue, true); assert.deepEqual(m.allergies, ['Lait']);
});

test('recherche : exacte, distinguable, et qui ouvre le bon écran', () => {
  const dems = demandes(ctx(), {}), clients = listeClients(ctx(), {}, dems), plats = [{ cle: 'entrees/foie-gras', nom: 'Foie gras de canard maison', rubrique: 'Nos entrées', prix: '21 €' }];
  const index = { auj: AUJ, clients, demandes: dems, evenements: AGENDA, plats };
  assert.equal(correspond('cam r', 'Camille R.'), true); assert.equal(correspond('mille', 'Camille R.'), false, 'le début des mots, pas le milieu'); assert.equal(correspond('0629', 'X', '06 29 01 62 65'), true);
  const c = rechercher('camille', index); assert.equal(c[0].genre, 'client'); assert.deepEqual(c[0].aller, { vue: 'clients', client: clients.find((x) => x.nom === 'Camille R.').cle }); assert.match(c[0].titre, /Camille R\. · 06/);
  assert.ok(c.some((x) => x.genre === 'demande' && x.aller.demande === 'demo-reception-1' && /Mariage/.test(x.detail)), 'sa demande de réception, avec son état');
  const tel = rechercher(telephoneDemo('Thomas B.').replace(/\s/g, '').slice(0, 6), index); assert.equal(tel[0].genre, 'client'); assert.match(tel[0].titre, /Thomas B\./);
  const s = rechercher('raclette', index); assert.equal(s.length, 1); assert.equal(s[0].type, 'Soirée'); assert.deepEqual(s[0].aller, { vue: 'carte', onglet: 'soirees', editer: AGENDA.find((x) => /raclette/i.test(x.titre)).id });
  const p = rechercher('foie', index); assert.deepEqual(p.map((x) => [x.type, x.aller.plat]), [['Carte', 'entrees/foie-gras']]);
  assert.deepEqual(rechercher('zzzz', index), []); assert.deepEqual(rechercher('a', index), []); assert.deepEqual(rechercher('   ', index), []);
  assert.ok(rechercher('s', index).length === 0 && rechercher('so', index).length <= 6, 'jamais plus de six résultats');
  /* Une soirée passée ne remonte pas. */
  assert.deepEqual(rechercher('raclette', { ...index, auj: '2027-06-01' }), []);
});
