/* v7.15.0 · « La journée en main » : les priorités d'Aujourd'hui (règles pures, données fictives).
   Chaque priorité vient d'une situation réellement présente, dit pourquoi elle apparaît, ce qu'elle concerne et où agir ;
   les situations voisines sont regroupées ; une priorité disparaît quand la situation est résolue, pas quand on l'ouvre. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { publier } from '../../assets/js/disponibilites.js';
import { appliquer } from '../../assets/js/espace-donnees.js';
import { refusCommerce, commandeDe } from '../../assets/js/commerce.js';
import { depart } from '../../assets/js/espace-scenarios.js';
import { priorites, prioritesCommandes, filDuJour, resumeService } from '../../assets/js/espace-accueil.js';
import { nouvelleTache } from '../../assets/js/espace-taches.js';
import { aTraiter } from '../../assets/js/espace-demandes.js';

globalThis.document ||= { visibilityState: 'visible' };
const lire = (f) => JSON.parse(readFileSync(new URL(`../../donnees/${f}`, import.meta.url), 'utf8'));
const SALLE = lire('salle.json'), AGENDA = lire('agenda.json').dates, R = publier(lire('reservation.json'), lire('horaires.json').adresses[0]).reservation;
const LIEUX = { ...lire('receptions.json'), retraits: { debut: '2026-12-05', fin: '2026-12-31' }, emporter: [{ id: 'escargots', nom: 'Escargots à la crème d\'ail', prix: 18, unite: 'piece' }, { id: 'pate-lorrain', nom: 'Pâté lorrain', prix: 28, unite: 'kg' }, { id: 'foie-gras', nom: 'Foie gras de canard maison', prix: 36, unite: 'piece' }] };
const sc7 = depart('commande', R, '2026-11-23', { lieux: LIEUX });
const ctx = (auj = sc7.horloge.iso, plus = {}) => ({ R, auj, minute: 600, maintenant: `${auj}T10:00:00`, site: [], demandes: sc7.demandes, exceptions: [], scenario: 'commande', demandesDemo: false, lieux: LIEUX, venues: {}, agenda: AGENDA, ...plus });
const agir = (S, nom, args, auj = sc7.horloge.iso) => { const r = refusCommerce(S, nom, args, { auj }); assert.equal(r, '', `${nom} : ${r}`); return appliquer(S, nom, args); };
const prio = (S, c = ctx(), min = 600) => priorites(c, S, SALLE, min), une = (l, debut) => l.find((x) => x.id.startsWith(debut));

test('chaque priorité dit quoi, pourquoi, ce qu\'elle concerne et où agir ; aucune n\'est en double', () => {
  const p = prio(sc7.etat), ids = p.map((x) => x.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const x of p) { assert.ok(x.titre && x.raison && x.bouton, `${x.id} : titre, raison et bouton`); assert.ok(x.concerne, `${x.id} : ce qu'elle concerne est dit`); assert.ok(x.aller || x.action, `${x.id} : elle ouvre un endroit`); }
  /* Les demandes en attente : une seule carte, le même compte que la rubrique Demandes (ici : la commande de Nadia B.). */
  const att = aTraiter(ctx(), sc7.etat), d = une(p, 'demandes-attente'); assert.ok(d); assert.equal(att.tables.length + att.autres.length, 1);
  assert.match(d.titre, /^1 demande attend une décision$/); assert.match(d.raison, /1 commande à emporter/); assert.match(d.raison, /rien n'est réservé ni engagé/); assert.deepEqual(d.aller, { vue: 'demandes', filtre: 'traiteur' });
});

test('commandes : regroupées par créneau ; la priorité suit l\'horloge et disparaît quand la commande est prête', () => {
  /* Mercredi 2 décembre : le retrait de SC7-PAUL est samedi → rien à préparer aujourd'hui ni demain. */
  assert.equal(une(prioritesCommandes(ctx(), sc7.etat), 'cmd-preparer'), undefined);
  /* Vendredi 4 : « demain soir » ; samedi 5 : « ce soir ». */
  const ven = une(prioritesCommandes(ctx('2026-12-04'), sc7.etat), 'cmd-preparer'); assert.match(ven.titre, /^1 commande reste à préparer pour les retraits de demain soir$/); assert.equal(ven.concerne, 'Retraits de demain soir');
  const sam = une(prio(sc7.etat, ctx('2026-12-05')), 'cmd-preparer'); assert.match(sam.titre, /ce soir$/); assert.match(sam.raison, /SC7-PAUL \(Paul D\.\)/); assert.match(sam.raison, /À produire : Escargots à la crème d'ail, 4 pièces/); assert.deepEqual(sam.aller, { commerce: { ecran: 'preparation', jour: '2026-12-05' } });
  /* Une deuxième commande validée pour le même créneau : toujours une seule carte, qui en compte deux. */
  let S = agir(sc7.etat, 'cmdValider', { id: 'sc7-nadia', base: commandeDe(sc7.demandes.find((d) => d.id === 'sc7-nadia'), sc7.etat, LIEUX), le: '2026-12-02T10:10' });
  const deux = prioritesCommandes(ctx('2026-12-05'), S).filter((x) => x.id.startsWith('cmd-preparer')); assert.equal(deux.length, 1); assert.match(deux[0].titre, /^2 commandes restent à préparer pour les retraits de ce soir$/);
  /* L'ouvrir ne change rien : la relire donne la même carte. La résoudre la fait évoluer. */
  assert.deepEqual(prioritesCommandes(ctx('2026-12-05'), S).map((x) => x.id), prioritesCommandes(ctx('2026-12-05'), S).map((x) => x.id));
  for (const id of ['sc7-paul', 'sc7-nadia']) for (const vers of ['preparation', 'prete']) S = agir(S, 'cmdAvancer', { id, vers, le: '2026-12-05T15:00' }, '2026-12-05');
  const apres = prioritesCommandes(ctx('2026-12-05'), S); assert.equal(une(apres, 'cmd-preparer'), undefined, 'prêtes : plus rien à préparer');
  const pretes = une(apres, 'cmd-pretes'); assert.match(pretes.titre, /^2 commandes prêtes attendent leur retrait aujourd'hui$/); assert.equal(pretes.concerne, 'Retraits du jour');
  /* Remises au client : la carte disparaît. */
  for (const id of ['sc7-paul', 'sc7-nadia']) S = agir(S, 'cmdAvancer', { id, vers: 'retiree', le: '2026-12-05T19:00' }, '2026-12-05');
  assert.deepEqual(prioritesCommandes(ctx('2026-12-05'), S).filter((x) => /^cmd-(preparer|pretes)/.test(x.id)), []);
});

test('commandes : un complément de production manquant et un retrait dépassé sont des priorités, tant que la situation dure', () => {
  let S = sc7.etat; for (const vers of ['preparation', 'prete']) S = agir(S, 'cmdAvancer', { id: 'sc7-paul', vers, le: '2026-12-02T10:20' });
  S = agir(S, 'cmdRectifier', { id: 'sc7-paul', lot: 'l1', jour: '2026-12-05', quantite: 1, motif: 'Une seule pièce a été cuite.', op: 'r1', vu: { jour: '2026-12-05', quantite: 4 }, le: '2026-12-02T10:30' });
  const c = une(prioritesCommandes(ctx(), S), 'cmd-completer'); assert.match(c.titre, /^La commande SC7-PAUL attend un complément de production$/); assert.match(c.raison, /il reste à produire Escargots à la crème d'ail, 3 pièces/); assert.equal(c.concerne, 'Commande SC7-PAUL · Paul D.'); assert.deepEqual(c.aller, { commande: 'sc7-paul' });
  /* La même commande n'est pas en plus « à préparer » ni « prête » : une situation, une carte. */
  assert.deepEqual(prioritesCommandes(ctx('2026-12-05'), S).map((x) => x.id.replace(/-(sc7|2026).*/, '')), ['cmd-completer']);
  S = agir(S, 'cmdCompleter', { id: 'sc7-paul', le: '2026-12-02T10:40' }); assert.equal(une(prioritesCommandes(ctx(), S), 'cmd-completer'), undefined, 'le complément engagé, la priorité disparaît');
  /* Lundi 7 : la commande est toujours en préparation alors que son retrait était samedi → retrait dépassé, en tête. */
  const lundi = prioritesCommandes(ctx('2026-12-07'), S); assert.match(lundi[0].id, /^cmd-depasse/); assert.match(lundi[0].titre, /Le retrait de la commande SC7-PAUL est dépassé/); assert.match(lundi[0].raison, /retrait prévu samedi 5 décembre/); assert.match(lundi[0].raison, /rien n'est fait à votre place/);
  let T = agir(S, 'cmdAvancer', { id: 'sc7-paul', vers: 'prete', le: '2026-12-07T10:00' }, '2026-12-07'); T = agir(T, 'cmdAvancer', { id: 'sc7-paul', vers: 'retiree', le: '2026-12-07T10:05' }, '2026-12-07');
  assert.equal(une(prioritesCommandes(ctx('2026-12-07'), T), 'cmd-depasse'), undefined);
});

test('tâches arrivées à échéance : une seule carte pour celles en retard et celles du jour', () => {
  const t = (id, titre, echeance) => nouvelleTache({ id, titre, echeance, cree: 'x' }), AUJ = sc7.horloge.iso;
  let S = appliquer(sc7.etat, 'tacheAjouter', { tache: t('t1', 'Rappeler le fleuriste', '2026-12-01') });
  const un = une(prio(S), 'taches-echeance'); assert.match(un.titre, /^En retard : Rappeler le fleuriste$/); assert.equal(un.concerne, 'Les tâches de l\'équipe'); assert.deepEqual(un.aller, { vue: 'jour', ancre: 't-taches' });
  S = appliquer(S, 'tacheAjouter', { tache: t('t2', 'Sortir les nappes', AUJ) }); S = appliquer(S, 'tacheAjouter', { tache: t('t3', 'Plus tard', '2026-12-20') });
  const deux = prio(S).filter((x) => x.id === 'taches-echeance'); assert.equal(deux.length, 1); assert.match(deux[0].titre, /^2 tâches sont arrivées à échéance$/); assert.match(deux[0].raison, /1 en retard, 1 pour aujourd'hui/);
  S = appliquer(S, 'tacheTerminer', { id: 't1', fait: true, le: AUJ }); S = appliquer(S, 'tacheTerminer', { id: 't2', fait: true, le: AUJ }); assert.equal(une(prio(S), 'taches-echeance'), undefined);
});

test('le fil de la journée garde les niveaux d\'engagement : demande, option, confirmée, réservation, commande à retirer, tâche', () => {
  const fil = filDuJour(ctx('2026-12-05'), sc7.etat, '2026-12-05', 600);
  const retrait = fil.find((x) => x.type === 'retrait' && /Paul D\./.test(x.titre)); assert.ok(retrait); assert.equal(retrait.engagement, 'Commande validée, à retirer'); assert.equal(retrait.ferme, true);
  const nadia = fil.find((x) => x.type === 'retrait' && /Nadia B\./.test(x.titre)); assert.equal(nadia.ferme, false); assert.equal(nadia.engagement, 'Demande : rien n\'est engagé');
  assert.ok(fil.some((x) => x.type === 'service'), 'les services du jour'); assert.ok(fil.filter((x) => x.type === 'service').every((x) => x.engagement === 'Réservations'));
  /* Une tâche datée de ce jour entre dans le fil ; terminée, elle y reste dite « faite ». */
  const S = appliquer(sc7.etat, 'tacheAjouter', { tache: nouvelleTache({ id: 't5', titre: 'Sortir les boîtes de retrait', echeance: '2026-12-05', cree: 'x' }) });
  const tache = filDuJour(ctx('2026-12-05'), S, '2026-12-05', 600).find((x) => x.type === 'tache'); assert.equal(tache.titre, 'Sortir les boîtes de retrait'); assert.equal(tache.engagement, 'Tâche à faire'); assert.deepEqual(tache.aller, { vue: 'jour', ancre: 't-taches' });
  assert.equal(filDuJour(ctx('2026-12-04'), S, '2026-12-04', 600).some((x) => x.type === 'tache'), false, 'la veille, elle n\'y est pas');
});

test('le prochain temps fort dit les retraits et réceptions du même jour, et ne transforme pas un manque en « aucune »', () => {
  const r = resumeService(ctx('2026-12-05'), sc7.etat, SALLE, '2026-12-05', 'soir');
  assert.ok(Array.isArray(r.autour), 'ce qui se passe autour du service'); assert.ok(r.autour.some((x) => x.type === 'retrait' && /Paul D\./.test(x.titre)));
  assert.equal(r.allergies.connues, 0); assert.match(r.allergies.phrase, /Aucune allergie signalée/); assert.match(r.allergies.phrase, /ne veut pas dire « aucune allergie »/);
  /* Une allergie écrite dans la note d'une réservation est comptée : l'écran ne dit plus « aucune allergie signalée » à côté d'elle. */
  const S = { ...sc7.etat, resa: { ...(sc7.etat.resa || {}), ajouts: [{ id: 'r-a', date: '2026-12-05', service: 'soir', heure: '20:00', couverts: 2, nom: 'Camille R. (exemple)', telephone: '', demande: 'Allergie aux fruits à coque', espace: 'salle', statut: 'confirmee', source: 'telephone' }, { id: 'r-b', date: '2026-12-05', service: 'soir', heure: '20:30', couverts: 4, nom: 'Hugo (exemple)', telephone: '', demande: '', espace: 'salle', statut: 'confirmee', source: 'telephone' }] } };
  const r2 = resumeService(ctx('2026-12-05'), S, SALLE, '2026-12-05', 'soir'); assert.equal(r2.allergies.connues, 1); assert.match(r2.allergies.phrase, /^1 réservation signale une allergie ou une intolérance\. Pour les autres, on ne sait pas/);
});
