/* Stabilisation v7.8.1 : les défauts de validation, de sauvegarde et de modifications concurrentes, rejoués sur les
   règles pures. Ce qui se joue dans le navigateur (formulaire public, minuit, saisie rapide, fiche ouverte dans deux
   onglets) est dans `_audit/parcours-espace.mjs`. Lancer : node --test _audit/tests/*.test.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { etatService, arrivees, faisabilite, equipeDe, publier, exceptionsOuvertures } from '../../assets/js/disponibilites.js';
import { appliquer, creerDepot } from '../../assets/js/espace-donnees.js';
import { ajouter, evenements, listeEvenements, trouverResa } from '../../assets/js/espace-regles.js';
import { reglesAction } from '../../assets/js/espace-garde.js';
import { planDuService } from '../../assets/js/espace-salle.js';
import { serviceDuJour } from '../../assets/js/espace-service.js';
import { changementsFiche, notesDe } from '../../assets/js/espace-clients.js';
import { comprendre } from '../../assets/js/espace-commandes.js';
import { carteDe, origine, cleDurable, migrerCarte } from '../../assets/js/espace-carte.js';

const lire = (f) => JSON.parse(readFileSync(new URL(`../../donnees/${f}`, import.meta.url), 'utf8'));
const R = lire('reservation.json'), SALLE = lire('salle.json'), AGENDA = lire('agenda.json').dates, CARTE = lire('carte.json').rubriques, HORAIRES = lire('horaires.json').adresses[0];
const AUJ = '2026-11-18', VENDREDI = '2026-11-20', MERCREDI = '2026-11-25';
const SEMAINE = { lundi: [], mardi: [], mercredi: ['12:00-14:30'], jeudi: ['12:00-14:30'], vendredi: ['12:00-14:30', '19:00-00:00'], samedi: ['19:00-00:00'], dimanche: ['12:00-16:00'] };
function memoire({ refuseVider = false, refuseSite = false } = {}) {
  let etat = {}, site = [], demandes = [];
  return { lire: () => JSON.parse(JSON.stringify(etat)), ecrire: (d) => { etat = JSON.parse(JSON.stringify(d)); return true; }, vider: () => { if (refuseVider) return false; etat = {}; site = []; demandes = []; return true; },
    resasSite: () => [...site], ecrireResasSite: (l) => { if (refuseSite) return false; site = [...l]; return true; }, demandesSite: () => [...demandes], ecrireDemandesSite: (l) => { demandes = [...l]; return true; }, pousser: (r) => site.push(r) };
}
const ctx = (m) => ({ R, auj: AUJ, site: m ? m.resasSite() : [], exceptions: [] });
const depotAvec = (m) => creerDepot(m, undefined, { regle: (nom, args, frais) => reglesAction(ctx(m), frais, SALLE, nom, args), derives: [{ chemin: ['evenements', 'liste'], calcul: (e) => (e.evenements && (Object.keys(e.evenements.modifs || {}).length || (e.evenements.ajouts || []).length) ? listeEvenements(AGENDA, e) : undefined) }] });
const un = (t, S = {}) => comprendre(t, { auj: AUJ, R, S, exceptions: [], pages: {}, carte: CARTE })[0];

test('3.1 · une demande pour midi n\'est plus confirmable quand l\'ouverture passe à 13 h', () => {
  const m = memoire(), depot = depotAvec(m);
  m.pousser({ id: 'R-MIDI', date: MERCREDI, service: 'midi', heure: '12:00', couverts: 2, prenom: 'Claire', nom: 'Essai' });
  depot.agir('horaires', { semaine: { ...SEMAINE, mercredi: ['13:00-14:30'] } });
  assert.equal(depot.agir('statut', { id: 'R-MIDI', statut: 'confirmee' }), false); assert.match(depot.raisonRefus(), /12 h n'est plus une heure d'arrivée/);
  assert.equal(depot.agir('modifierResa', { id: 'R-MIDI', champs: { heure: '13:00' } }), true, 'l\'heure se corrige');
  assert.equal(depot.agir('statut', { id: 'R-MIDI', statut: 'confirmee' }), true, 'puis la demande se confirme');
});

test('3.1 · le site refuse au dernier moment : délai d\'une heure, jour passé, service complet', () => {
  const resa = { date: AUJ, service: 'midi', heure: '12:00', couverts: 2 };
  assert.equal(faisabilite(R, resa, { auj: AUJ, minute: 10 * 60, public: true }).ok, true, 'à 10 h, midi est possible');
  const tard = faisabilite(R, resa, { auj: AUJ, minute: 11 * 60 + 10, public: true }); assert.equal(tard.ok, false); assert.equal(tard.raison, 'passee', 'à 11 h 10, le délai de 60 minutes n\'est plus tenu');
  assert.equal(faisabilite(R, resa, { auj: ajouter(AUJ, 1), minute: 5, public: true }).raison, 'passee', 'après minuit, la date de la veille est refusée');
  const S = appliquer({}, 'complet', { date: VENDREDI, service: 'soir', actif: true });
  assert.equal(faisabilite({ ...R, equipe: equipeDe(S) }, { date: VENDREDI, service: 'soir', heure: '20:00', couverts: 2 }, { auj: AUJ, public: true }).raison, 'complet');
  assert.equal(faisabilite(R, { date: VENDREDI, service: 'soir', heure: '20:00', couverts: 11 }, { auj: AUJ, public: true }).raison, 'couverts');
});

test('3.1 · une réservation annulée puis remise ne reprend pas une table donnée entre-temps', () => {
  const m = memoire(), depot = depotAvec(m), jour = Array.from({ length: 10 }, (_, k) => ajouter(AUJ, k)).find((iso) => serviceDuJour(ctx(m), {}, iso, 'soir').resas.length >= 2);
  const [a, b] = serviceDuJour(ctx(m), {}, jour, 'soir').resas.filter((r, i, l) => Math.abs(r.debutMin - l[0].debutMin) < 120);
  assert.ok(a && b, 'deux réservations qui se croisent');
  depot.agir('statut', { id: a.id, statut: 'confirmee' }); depot.agir('statut', { id: b.id, statut: 'confirmee' });
  assert.equal(depot.agir('placerResa', { id: a.id, table: '7' }), true);
  assert.equal(depot.agir('placerResa', { id: b.id, table: '7' }), false, 'la table est prise'); assert.match(depot.raisonRefus(), /table 7 est prise/);
  depot.agir('statut', { id: a.id, statut: 'annulee' });
  assert.equal(depot.agir('placerResa', { id: b.id, table: '7' }), true, 'annulée, elle libère sa table');
  assert.equal(depot.agir('placerResa', { id: a.id, table: '5' }), false, 'on n\'assoit pas une réservation annulée');
  assert.equal(depot.agir('statut', { id: a.id, statut: 'confirmee' }), true); assert.match(depot.noteAction(), /table 7 a été donnée entre-temps.*à placer/);
  const p = planDuService(ctx(m), m.lire(), SALLE, jour, 'soir');
  assert.equal(p.conflits.length, 0); assert.deepEqual(p.tables.find((t) => t.id === '7').resas.map((r) => r.id), [b.id]); assert.ok(p.aPlacer.some((r) => r.id === a.id), 'elle est « à placer »');
  /* Annuler la remise : le statut et la table reviennent ensemble (un seul pas en arrière). */
  depot.annuler(); assert.equal(trouverResa(ctx(m), m.lire(), a.id).statut, 'annulee'); assert.equal(m.lire().resa.tables[a.id], '7');
  /* « Placer tout seul » ne peut pas donner la même table à deux réservations. */
  assert.equal(depot.agir('placerPlusieurs', { places: { [a.id]: '4', [b.id]: '4' } }), false);
});

test('3.1 · une table devenue trop petite est retirée par le dépôt, dans le même enregistrement', () => {
  const m = memoire(), depot = depotAvec(m), jour = Array.from({ length: 10 }, (_, k) => ajouter(AUJ, k)).find((iso) => serviceDuJour(ctx(m), {}, iso, 'soir').resas.length >= 1);
  const a = serviceDuJour(ctx(m), {}, jour, 'soir').resas[0];
  depot.agir('modifierResa', { id: a.id, champs: { couverts: 2 } }); depot.agir('placerResa', { id: a.id, table: '1' });
  assert.equal(depot.agir('modifierResa', { id: a.id, champs: { couverts: 5 } }), true); assert.match(depot.noteAction(), /table 1 ne convient plus \(2 places pour 5 couverts\)/);
  assert.equal(trouverResa(ctx(m), m.lire(), a.id).table, ''); depot.annuler(); assert.equal(trouverResa(ctx(m), m.lire(), a.id).table, '1'); assert.equal(+trouverResa(ctx(m), m.lire(), a.id).couverts, 2);
  /* Changer le nom ne remet pas la table en cause. */
  assert.equal(depot.agir('modifierResa', { id: a.id, champs: { nom: 'Autre nom' } }), true); assert.equal(depot.noteAction(), ''); assert.equal(trouverResa(ctx(m), m.lire(), a.id).table, '1');
});

test('3.2 · effacer ou restaurer en partie n\'est jamais annoncé comme réussi', () => {
  const m = memoire({ refuseVider: true }), depot = creerDepot(m); depot.agir('annonce', { active: true, texte: 'x' });
  assert.equal(depot.toutEffacer(), false); assert.equal(m.lire().annonce.texte, 'x', 'rien n\'est effacé');
  const m2 = memoire({ refuseSite: true }), d2 = creerDepot(m2); m2.pousser({ id: 'R-1' }); d2.agir('annonce', { active: true, texte: 'x' });
  assert.equal(d2.toutEffacer(), true); assert.ok(d2.annuler()); assert.match(d2.annulationPartielle(), /réservations venues du site/); assert.equal(m2.lire().annonce.texte, 'x');
});

test('3.3 · annuler ne duplique pas une soirée retouchée dans un autre onglet', () => {
  const m = memoire(), moi = depotAvec(m), autre = depotAvec(m);
  moi.agir('evenement', { id: 'ev-essai', champs: { titre: 'Soirée fondue', debut: '2026-12-05T19:30', type: 'Soirée', prix: '32 €' }, agenda: AGENDA });
  moi.agir('evenement', { id: 'ev-essai', champs: { titre: 'Soirée fondue savoyarde' }, agenda: AGENDA });
  autre.agir('evenement', { id: 'ev-essai', champs: { titre: 'Soirée raclette' }, agenda: AGENDA });
  moi.annuler(); /* mon changement de titre : l'autre l'a retouché depuis */
  let S = m.lire();
  assert.equal(S.evenements.ajouts.length, 1, 'une seule soirée, pas d\'ancienne copie réinsérée'); assert.equal(S.evenements.ajouts[0].titre, 'Soirée raclette', 'la version courante est gardée');
  assert.equal(moi.conflitsAnnulation(), 1); assert.deepEqual(moi.gardesAnnulation()[0].slice(0, 2), ['evenements', 'ajouts']);
  assert.deepEqual(S.evenements.liste.filter((x) => x.id === 'ev-essai').map((x) => x.titre), ['Soirée raclette'], 'la liste publiée est recalculée, une seule fois');
  moi.annuler(); /* la création : la soirée a changé depuis, elle est gardée */
  S = m.lire(); assert.equal(S.evenements.ajouts.length, 1); assert.equal(moi.conflitsAnnulation(), 1);
  /* Sans retouche ailleurs, annuler une création la retire bien, et la liste calculée suit. */
  const m2 = memoire(), d2 = depotAvec(m2); d2.agir('evenement', { id: 'ev-2', champs: { titre: 'Brunch', debut: '2026-12-06T11:00' }, agenda: AGENDA }); d2.annuler();
  assert.deepEqual(m2.lire(), {});
  /* Une soirée supprimée puis recréée ailleurs : annuler la suppression ne réinsère pas l'ancienne. */
  const m3 = memoire(), a3 = depotAvec(m3), b3 = depotAvec(m3);
  a3.agir('evenement', { id: 'ev-3', champs: { titre: 'Un', debut: '2026-12-07T19:00' }, agenda: AGENDA }); a3.agir('supprimerEvenement', { id: 'ev-3', agenda: AGENDA });
  b3.agir('evenement', { id: 'ev-3', champs: { titre: 'Deux', debut: '2026-12-07T19:00' }, agenda: AGENDA }); a3.annuler();
  assert.deepEqual(m3.lire().evenements.ajouts.map((x) => x.titre), ['Deux']); assert.equal(a3.conflitsAnnulation(), 1);
});

test('3.4 · la fiche client n\'enregistre que ce qui a réellement changé', () => {
  const ouverture = { habitue: false, allergies: ['Gluten'], note: '' };
  assert.deepEqual(changementsFiche(ouverture, ouverture, ouverture), { champs: null, conflits: [] }, 'une fiche intacte n\'écrit rien');
  /* Pendant qu'elle est ouverte, un autre onglet note une allergie : la fermer n'efface rien. */
  const ailleurs = { habitue: false, allergies: ['Gluten', 'Arachides'], note: '' };
  assert.deepEqual(changementsFiche(ouverture, ouverture, ailleurs), { champs: null, conflits: [] });
  /* J'ajoute « Lait » et je retire « Gluten » : seuls ces deux gestes partent, « Arachides » reste. */
  const r = changementsFiche(ouverture, { habitue: true, allergies: ['Lait'], note: 'Table près du feu' }, ailleurs);
  assert.deepEqual(r, { champs: { habitue: true, note: 'Table près du feu', allergiesPlus: ['Lait'], allergiesMoins: ['Gluten'] }, conflits: [] });
  const S = appliquer(appliquer({}, 'client', { cle: 'c', champs: { allergies: ['Gluten', 'Arachides'] } }), 'client', { cle: 'c', champs: r.champs });
  assert.deepEqual(notesDe(S, 'c'), { habitue: true, allergies: ['Arachides', 'Lait'], note: 'Table près du feu' });
  /* Le même champ changé des deux côtés : conflit, la version enregistrée est gardée. */
  const c = changementsFiche(ouverture, { habitue: false, allergies: ['Gluten'], note: 'Ma note' }, { habitue: false, allergies: ['Gluten'], note: 'Leur note' });
  assert.deepEqual(c, { champs: null, conflits: ['note'] });
});

test('3.6 · les mêmes exceptions pour le public et l\'équipe ; une ouverture exceptionnelle s\'explique dans les horaires', () => {
  const pub = publier(R, { ...HORAIRES, exceptions: [{ du: '2026-12-24', au: '2026-12-25', motif: 'Noël' }, { date: '2026-12-26', creneaux: ['12:00-16:00'], motif: 'Lendemain de Noël' }] });
  assert.deepEqual(pub.reservation.fermetures.periodes.map((x) => x.du), ['2026-12-24', '2026-12-26']);
  assert.equal(etatService(pub.reservation, '2026-12-25', 'midi').raison, 'fermeture', 'le site ferme comme l\'espace');
  /* Des horaires particuliers un samedi : le midi ouvre, le soir ferme. */
  assert.equal(etatService(pub.reservation, '2026-12-26', 'midi').ouvert, true); assert.equal(etatService(pub.reservation, '2026-12-26', 'soir').ouvert, false);
  /* La Saint-Sylvestre est dite dans les horaires publiés, avec le créneau du soir des autres jours. */
  const syl = publier(R, HORAIRES).exceptions.find((x) => x.du === '2026-12-31');
  assert.deepEqual({ creneaux: syl.creneaux, motif: syl.motif, ouverture: syl.ouverture }, { creneaux: ['12:00-14:30', '19:00-00:00'], motif: 'Saint-Sylvestre', ouverture: true });
  assert.equal(etatService(publier(R, HORAIRES).reservation, '2026-12-31', 'midi').debut, 12 * 60, 'cette mention n\'est qu\'un affichage : elle ne change pas les règles');
  assert.equal(exceptionsOuvertures(R, HORAIRES.semaine, [{ date: VENDREDI, service: 'soir' }]).length, 0, 'un service déjà ouvert n\'a rien à expliquer');
  assert.deepEqual(exceptionsOuvertures(R, HORAIRES.semaine, [{ date: '2026-11-24', service: 'soir', note: 'Soirée privée' }])[0].creneaux, ['19:00-00:00']);
});

test('3.6 · une soirée masquée puis réaffichée garde toutes ses informations', () => {
  const champs = { titre: 'Soirée fondue', debut: '2026-12-05T19:30', type: 'Soirée', prix: '32 €', texte: 'Fondue savoyarde à volonté.' };
  let S = appliquer({}, 'evenement', { id: 'ev-essai', champs, agenda: AGENDA });
  S = appliquer(S, 'visibilite', { id: 'ev-essai', visible: false, agenda: AGENDA });
  assert.equal(evenements(AGENDA, S).find((x) => x.id === 'ev-essai').masque, true);
  S = appliquer(S, 'visibilite', { id: 'ev-essai', visible: true, agenda: AGENDA });
  const e = evenements(AGENDA, S).find((x) => x.id === 'ev-essai'), l = S.evenements.liste.find((x) => x.id === 'ev-essai');
  for (const k of Object.keys(champs)) assert.equal(e[k], champs[k], k);
  assert.equal(!!e.masque, false); assert.deepEqual({ titre: l.titre, debut: l.debut, prix: l.prix, type: l.type }, { titre: champs.titre, debut: champs.debut, prix: champs.prix, type: champs.type });
  /* Une soirée du site : masquée puis réaffichée, elle redevient exactement celle du site. */
  const id = AGENDA[0].id; let T = appliquer({}, 'visibilite', { id, visible: false, agenda: AGENDA }); T = appliquer(T, 'visibilite', { id, visible: true, agenda: AGENDA });
  const base = evenements(AGENDA, {}).find((x) => x.id === id), apres = evenements(AGENDA, T).find((x) => x.id === id);
  for (const k of ['titre', 'debut', 'prix', 'type']) assert.equal(apres[k], base[k], k);
});

test('3.7 · la barre reste prudente : négation sans « ne », « même si c\'est complet »', () => {
  for (const t of ['ferme pas vendredi soir', 'ne ferme pas vendredi soir même si c\'est complet', 'surtout pas fermer samedi', 'note pas de table pour 4 vendredi 20 h']) { const p = un(t); assert.equal(p.genre, 'erreur', t); assert.equal(p.action, undefined, t); }
  const S = appliquer({}, 'complet', { date: VENDREDI, service: 'soir', actif: true });
  assert.equal(un('plus complet vendredi soir', S).action.args.actif, false, '« plus complet » reste une vraie demande');
  assert.equal(un('fermer vendredi soir').action.nom, 'fermer'); assert.equal(un('il n\'y a plus de foie gras').action.nom, 'epuise');
});

test('3.8 · les plats ont un identifiant qui ne dépend plus de leur rang', () => {
  assert.ok(CARTE.every((r) => r.plats.every((p) => p.id && /^[a-z0-9-]+$/.test(p.id))), 'chaque plat du site a un identifiant');
  assert.ok(CARTE.every((r) => new Set(r.plats.map((p) => p.id)).size === r.plats.length), 'unique dans sa rubrique');
  const premier = CARTE[0].plats[0], cle = `${CARTE[0].id}/${premier.id}`;
  assert.equal(carteDe(CARTE, {}, AUJ)[0].plats[0].cle, cle); assert.equal(origine(CARTE, cle).nom, premier.nom); assert.equal(cleDurable(CARTE, `${CARTE[0].id}/0`), cle);
  /* Les anciennes références « rubrique/rang » d'un navigateur sont traduites, sans rien perdre. */
  const S = { carte: { modifs: { [`${CARTE[0].id}/0`]: { prix: 23 } }, epuises: { [`${CARTE[1].id}/1`]: AUJ }, ajouts: [{ id: 'x1', rubrique: CARTE[0].id, nom: 'Plat du jour', prix: 18 }] } };
  assert.equal(migrerCarte(S, CARTE), true); assert.deepEqual(Object.keys(S.carte.modifs), [cle]); assert.deepEqual(Object.keys(S.carte.epuises), [`${CARTE[1].id}/${CARTE[1].plats[1].id}`]);
  assert.equal(migrerCarte(S, CARTE), false, 'une seule fois');
  const vue = carteDe(CARTE, S, AUJ); assert.equal(vue[0].plats[0].prix, 23); assert.equal(vue[1].plats[1].epuise, true);
  /* Réordonner la carte du site ne déplace plus une modification sur un autre plat. */
  const inverse = CARTE.map((r, i) => (i ? r : { ...r, plats: [...r.plats].reverse() }));
  assert.equal(carteDe(inverse, S, AUJ)[0].plats.find((p) => p.cle === cle).prix, 23);
});
