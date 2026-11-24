/* v7.15.0 · L'assistant de la barre « Que voulez-vous faire ? » : des intentions reconnues, des réponses reliées aux
   dossiers, des précisions demandées, rien d'exécuté sans validation. Règles pures, données fictives des scénarios. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { publier } from '../../assets/js/disponibilites.js';
import { appliquer } from '../../assets/js/espace-donnees.js';
import { reglesAction } from '../../assets/js/espace-garde.js';
import { depart } from '../../assets/js/espace-scenarios.js';
import { demandes as toutesDemandes, aTraiter } from '../../assets/js/espace-demandes.js';
import { listeClients } from '../../assets/js/espace-clients.js';
import { idDossier } from '../../assets/js/espace-receptions.js';
import { refusCommerce, commandeDe, ouvertureRetraits } from '../../assets/js/commerce.js';
import { tachesDe } from '../../assets/js/espace-taches.js';
import { resasDuJour, ajouter, ouvert } from '../../assets/js/espace-regles.js';
import { assister, nonCompris, INTENTIONS, exemplesPour, lirePeriodeNommee } from '../../assets/js/espace-assistant.js';
import { comprendre } from '../../assets/js/espace-commandes.js';

globalThis.document ||= { visibilityState: 'visible' };
const lire = (f) => JSON.parse(readFileSync(new URL(`../../donnees/${f}`, import.meta.url), 'utf8'));
const SEMAINE = lire('horaires.json').adresses[0].semaine, SALLE = lire('salle.json'), AGENDA = lire('agenda.json').dates, R = publier(lire('reservation.json'), lire('horaires.json').adresses[0]).reservation;
const LIEUX = { ...lire('receptions.json'), retraits: { debut: '2026-12-05', fin: '2026-12-31' }, emporter: [{ id: 'escargots', nom: 'Escargots à la crème d\'ail', prix: 18, unite: 'piece' }, { id: 'pate-lorrain', nom: 'Pâté lorrain', prix: 28, unite: 'kg' }, { id: 'foie-gras', nom: 'Foie gras de canard maison', prix: 36, unite: 'piece' }] };
/** Un scénario prêt : son contexte, son état, ses demandes mises en forme, ses fiches clients et ses réservations à venir. */
function scene(id, { auj, min = 600, S } = {}) {
  const d = depart(id, R, '2026-11-23', { lieux: LIEUX, salle: SALLE }), iso = auj || d.horloge.iso, etat = S || d.etat;
  const ctx = { R, auj: iso, minute: min, maintenant: `${iso}T${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}:00`, site: [], demandes: d.demandes, exceptions: [], scenario: id, demandesDemo: false, lieux: LIEUX, semaine: SEMAINE, venues: d.venues || {}, agenda: AGENDA };
  const dem = toutesDemandes(ctx, etat), clients = listeClients(ctx, etat, dem), resas = Array.from({ length: 29 }, (_, k) => resasDuJour(ctx, etat, ajouter(iso, k))).flat();
  return { d, ctx, S: etat, dem, clients, resas, dire: (t, plus = {}) => assister(t, { ctx, S: plus.S || etat, salle: SALLE, minute: min, demandes: plus.S ? toutesDemandes(ctx, plus.S) : dem, clients, resas }) };
}
const titres = (l) => l.map((p) => p.titre);

test('intentions annoncées : chacune a son exemple, et chaque exemple est compris', () => {
  assert.deepEqual(INTENTIONS.map((i) => i.id), ['briefing', 'retraits', 'demandes', 'options', 'dossier', 'bilan', 'tache', 'blocage']);
  const s = scene('reception');
  for (const i of INTENTIONS) { const r = s.dire(i.exemple); assert.ok(r.length > 0, `« ${i.exemple} » est compris`); assert.ok(r[0].entete || r[0].genre === 'erreur', `« ${i.exemple} » : la réponse commence par ce qui a été compris`); }
  for (const vue of ['direction', 'accueil', 'salle', 'cuisine']) assert.ok(exemplesPour(vue).length >= 5, `la vue ${vue} a ses raccourcis`);
  assert.notDeepEqual(exemplesPour('cuisine'), exemplesPour('accueil'), 'les raccourcis suivent la vue métier');
});

test('« Prépare le briefing de ce soir » : le service et la date compris, le résumé vient du service, le bouton ouvre le briefing', () => {
  const s = scene('service'), r = s.dire('Prépare le briefing de ce soir.');
  assert.match(r[0].titre, /^Compris : préparer le briefing/); assert.match(r[0].detail, /Ce soir/);
  assert.deepEqual(r[1].aller, { briefing: `${s.ctx.auj}|soir` }); assert.match(r[1].titre, /^Ouvrir le briefing : ce soir/); assert.match(r[1].detail, /réservations? · \d+ couverts? attendus?/); assert.match(r[1].detail, /allergie/);
  assert.equal(r.filter((p) => p.action).length, 0, 'ouvrir un briefing ne modifie rien');
  /* Un jour dit sans service, les deux ouverts : l'assistant demande lequel, et ne choisit pas. */
  const deux = Array.from({ length: 8 }, (_, k) => ajouter(s.ctx.auj, k + 1)).find((iso) => ['midi', 'soir'].every((sv) => ouvert({ R, exceptions: [] }, s.S, iso, sv))), dit = `${+deux.slice(8)}/${+deux.slice(5, 7)}`;
  const sam = s.dire(`briefing du ${dit}`); assert.equal(sam[0].aChoisir, true); assert.match(sam[0].titre, /^Quel service/); assert.deepEqual(sam.slice(1).map((p) => p.aller.briefing), [`${deux}|midi`, `${deux}|soir`]);
  /* Un service fermé : c'est dit, et le prochain service ouvert est proposé à la place (sans être ouvert d'office). */
  const ferme = Array.from({ length: 8 }, (_, k) => ajouter(s.ctx.auj, k + 1)).find((iso) => !ouvert({ R, exceptions: [] }, s.S, iso, 'midi'));
  if (ferme) { const f = s.dire(`briefing du ${+ferme.slice(8)}/${+ferme.slice(5, 7)} midi`); assert.match(f[0].titre, /^Pas de service le midi/); assert.equal(f[0].inactif, true); }
  /* Une date impossible est dite ; rien n'est pris à la place. */
  const faux = s.dire('briefing du 31 février'); assert.equal(faux.length, 1); assert.match(faux[0].titre, /cette date n'existe pas/); assert.equal(faux[0].inactif, true);
});

test('« Montre les commandes à retirer demain » : la période, les commandes comptées, chacune ouvrant son dossier', () => {
  const s = scene('commande', { auj: '2026-12-04' }), r = s.dire('Montre les commandes à retirer demain.');
  assert.match(r[0].titre, /^Compris : les commandes à retirer demain, samedi 5 décembre$/); assert.match(r[0].detail, /1 commande à retirer : 1 validée/); assert.match(r[0].detail, /1 demande pour ce jour attend encore une décision \(non comptée\)/);
  assert.deepEqual(r[1].aller, { commerce: { ecran: 'preparation', jour: '2026-12-05' } }); assert.match(r[1].titre, /Préparation et retraits du samedi 5 décembre/);
  assert.deepEqual(r[2].aller, { commande: 'sc7-paul' }); assert.match(r[2].detail, /Validée · le soir · Escargots à la crème d'ail, 4 pièces · 72 €/);
  assert.deepEqual(r[3].aller, { commande: 'sc7-nadia' }); assert.match(r[3].detail, /Demande à décider/);
  /* Sans jour : l'assistant demande le jour ; les choix écrivent la phrase complète, ils n'ouvrent rien. */
  const q = s.dire('commandes à retirer'); assert.equal(q[0].aChoisir, true); assert.match(q[0].titre, /quel jour/); assert.deepEqual(q.slice(1).map((p) => p.completer), ['montre les commandes à retirer aujourd\'hui', 'montre les commandes à retirer demain']); assert.ok(q.every((p) => !p.aller && !p.action));
  /* Un jour sans commande : zéro est dit, et rien n'est inventé. */
  const vide = s.dire('commandes à retirer le 20 décembre'); assert.match(vide[0].detail, /Aucune commande validée à retirer ce jour-là/); assert.equal(vide.filter((p) => p.aller?.commande).length, 0);
});

test('« Quelles demandes attendent une décision ? » : le même compte que la rubrique Demandes', () => {
  const s = scene('commande'), att = aTraiter(s.ctx, s.S), r = s.dire('Quelles demandes attendent une décision ?');
  assert.match(r[0].detail, new RegExp(`${att.tables.length + att.autres.length} demandes?`)); assert.match(r[0].detail, /1 commande à emporter/); assert.match(r[0].detail, /même compte que la rubrique Demandes/);
  assert.deepEqual(r[1].aller, { vue: 'demandes', filtre: 'tout' }); assert.deepEqual(r[2].aller, { commande: 'sc7-nadia' }, 'la demande de commande ouvre son dossier');
  /* Une fois décidée, elle n'y est plus. */
  const nadia = s.d.demandes.find((x) => x.id === 'sc7-nadia'), T = appliquer(s.S, 'cmdRefuser', { id: 'sc7-nadia', base: commandeDe(nadia, s.S, LIEUX), motif: 'Production complète.', le: '2026-12-02T10:10' });
  if (refusCommerce(s.S, 'cmdRefuser', { id: 'sc7-nadia', base: commandeDe(nadia, s.S, LIEUX), motif: 'Production complète.', le: '2026-12-02T10:10' }, { auj: s.ctx.auj }) === '') assert.match(s.dire('quelles demandes attendent une décision ?', { S: T })[0].detail, /Aucune : toutes les demandes ont une réponse/);
});

test('« Quelles options arrivent à échéance cette semaine ? » : la période exacte, les dossiers, l\'onglet Espaces', () => {
  const s = scene('reception'), D = idDossier('sc5-demande'), c = s.ctx;
  assert.deepEqual(lirePeriodeNommee('cette semaine', '2026-12-02'), { debut: '2026-11-30', fin: '2026-12-06', nom: 'cette semaine' }); assert.equal(lirePeriodeNommee('la semaine prochaine', '2026-12-02').debut, '2026-12-07');
  const vide = s.dire('Quelles options arrivent à échéance cette semaine ?'); assert.match(vide[0].titre, /options de réception à échéance cette semaine$/); assert.match(vide[0].detail, /^Période : du lundi .* au dimanche .* \d{4}\./); assert.match(vide[0].detail, /Aucune option/);
  /* Thomas B. : un dossier, puis une option posée pour le second samedi ; son échéance tombe dans les jours qui suivent. */
  const agir = (S, nom, args) => { const r = reglesAction(c, S, SALLE, nom, args); assert.equal(r.refus || '', '', `${nom} : ${r.refus}`); let e = appliquer(S, nom, args); for (const x of r.suites || []) e = appliquer(e, x.nom, x.args); return e; };
  const { dossierDepuisDemande, argsRetenue, dossierDe } = receptions; let S = agir(s.S, 'recCreer', { dossier: dossierDepuisDemande(s.dem.find((x) => x.id === 'sc5-demande'), { cree: c.maintenant, lieux: LIEUX }) });
  const jour = s.d.demandes.find((x) => x.id === 'sc5-demande').date, ech = `${ajouter(c.auj, 2)}T18:00`;
  S = agir(S, 'recRetenir', argsRetenue(c, SALLE, dossierDe(S, D), { type: 'option', jour, horaires: { preparation: '17:00', arrivee: '19:00', repas: '20:00', fin: '01:00', remise: '02:00' }, espaces: ['restaurant'], echeance: ech, le: c.maintenant }));
  const sem = s.dire('quelles options arrivent à échéance cette semaine ?', { S }), prochaine = s.dire('options à échéance la semaine prochaine', { S });
  const dans = ajouter(c.auj, 2) <= lirePeriodeNommee('cette semaine', c.auj).fin ? sem : prochaine, ligne = dans.find((p) => p.aller?.dossier === D);
  assert.ok(ligne, 'l\'option de Thomas B. est trouvée dans la semaine de son échéance'); assert.equal(ligne.aller.onglet, 'espaces'); assert.match(ligne.detail, /Option valable jusqu'au/); assert.match(dans[0].detail, /1 option : 1 encore valable, 0 déjà expirée/);
  /* Site d'essai connecté : les dossiers ne sont pas partagés → c'est dit, sans faux « aucune option ». */
  const co = assister('quelles options arrivent à échéance cette semaine ?', { ctx: { ...c, exemples: false, connecte: true }, S, salle: SALLE, minute: 600 }); assert.equal(co.length, 1); assert.match(co[0].titre, /ne sont pas disponibles ici/);
});
import * as receptions from '../../assets/js/espace-receptions.js';

test('« Retrouve le dossier de Camille » : une personne → ses dossiers ; plusieurs → un choix, rien n\'est ouvert d\'office ; personne → c\'est dit', () => {
  const s = scene('reception'), r = s.dire('Retrouve le dossier de Camille.');
  assert.match(r[0].titre, /^Compris : retrouver le dossier de Camille R\.$/); assert.ok(r.slice(1).some((p) => p.aller?.dossier === idDossier('sc5-mariage') && /Dossier de réception/.test(p.titre)), 'son dossier de mariage');
  assert.ok(r.slice(1).every((p) => p.aller && !p.action), 'chaque ligne ouvre un dossier, aucune ne modifie');
  /* Une autre Camille (autre nom, autre téléphone) : l'assistant demande laquelle. */
  const autre = { id: 'q-camille', genre: 'question', cree: `${s.ctx.auj}T09:00:00`, sujet: 'Une question', message: 'Bonjour', prenom: 'Camille', nom: 'Durand (exemple)', telephone: '06 00 00 00 77', source: 'demo' };
  const c2 = { ...s.ctx, demandes: [...s.d.demandes, autre] }, dem2 = toutesDemandes(c2, s.S), amb = assister('retrouve le dossier de Camille', { ctx: c2, S: s.S, salle: SALLE, minute: 600, demandes: dem2, clients: listeClients(c2, s.S, dem2), resas: s.resas });
  assert.equal(amb[0].aChoisir, true); assert.match(amb[0].titre, /Plusieurs personnes correspondent à « Camille »/); assert.equal(amb.length, 3); assert.deepEqual(titres(amb.slice(1)).map((t) => t.split(' · ')[0]).sort(), ['Camille Durand (exemple)', 'Camille R.']);
  /* Préciser le nom lève l'ambiguïté. */
  assert.match(assister('retrouve le dossier de Camille Durand', { ctx: c2, S: s.S, salle: SALLE, minute: 600, demandes: dem2, clients: listeClients(c2, s.S, dem2), resas: s.resas })[0].titre, /Camille Durand/);
  const rien = s.dire('retrouve le dossier de Zoé'); assert.equal(rien.length, 1); assert.match(rien[0].titre, /Aucun dossier au nom de « Zoé »/); assert.equal(rien[0].inactif, true);
});

test('« Affiche le bilan de la semaine » : la période dite avec ses dates ; sans période, un choix parmi les trois', () => {
  const s = scene('commande'), r = s.dire('Affiche le bilan de la semaine.');
  assert.match(r[0].detail, /Période : du lundi 30 novembre au dimanche 6 décembre 2026/); assert.deepEqual(r[1].aller, { bilan: { periode: 'semaine', jour: '2026-11-30' } }); assert.match(r[1].detail, /1 commande validée/);
  assert.deepEqual(s.dire('bilan de la semaine dernière')[1].aller, { bilan: { periode: 'precedente', jour: '2026-11-23' } }); assert.deepEqual(s.dire('bilan du 5 décembre')[1].aller, { bilan: { periode: 'jour', jour: '2026-12-05' } });
  const q = s.dire('bilan'); assert.equal(q[0].aChoisir, true); assert.deepEqual(q.slice(1).map((p) => p.aller.bilan.periode), ['jour', 'semaine', 'precedente']);
});

test('créer une tâche : la proposition dit ce qui sera créé ; rien n\'existe avant la validation ; elle passe par l\'action des tâches', () => {
  const s = scene('commande'), r = s.dire('tâche : rappeler le fleuriste demain');
  assert.match(r[0].titre, /^Compris : créer une tâche$/); assert.match(r[0].detail, /Échéance : demain, jeudi 3 décembre/); assert.match(r[0].detail, /Rien n'est créé tant que vous ne validez pas/);
  assert.equal(r[1].action.nom, 'tacheAjouter'); assert.equal(r[1].action.args.tache.titre, 'Rappeler le fleuriste'); assert.equal(r[1].action.args.tache.echeance, '2026-12-03'); assert.match(r[1].titre, /^Créer la tâche « Rappeler le fleuriste », pour demain, jeudi 3 décembre$/);
  assert.equal(tachesDe(s.S).length, 0, 'comprendre la phrase n\'a rien créé');
  const S = appliquer(s.S, r[1].action.nom, { tache: { ...r[1].action.args.tache, id: 't-1' } }); assert.deepEqual(tachesDe(S).map((t) => [t.titre, t.echeance, t.fait]), [['Rappeler le fleuriste', '2026-12-03', false]]);
  assert.equal(s.dire('rappelle-moi de sortir les nappes')[1].action.args.tache.echeance, undefined, 'sans jour dit, pas d\'échéance inventée'); assert.match(s.dire('rappelle-moi de sortir les nappes')[0].detail, /Sans échéance/);
  /* Il manque le titre : l'assistant le demande. Une date impossible : c'est dit. Une phrase négative : rien n'est proposé à créer. */
  const q = s.dire('tâche :'); assert.equal(q.length, 1); assert.equal(q[0].aChoisir, true); assert.match(q[0].titre, /Quelle tâche/);
  assert.match(s.dire('tâche : appeler le traiteur le 31 février')[0].titre, /cette date n'existe pas/);
  assert.deepEqual(s.dire('ne crée pas de tâche'), [], 'une phrase négative n\'est pas une demande de création'); assert.equal(s.dire('ne crée pas de tâche').filter((p) => p.action).length, 0);
});

test('expliquer un blocage : la raison est celle des règles, mot pour mot ; la commande s\'ouvre, rien n\'est forcé', () => {
  const s = scene('commande'), nadia = s.d.demandes.find((x) => x.id === 'sc7-nadia');
  /* Nadia B. demande 2 escargots le samedi : 4 + 2 = 6 sur 6, elle passe → rien ne la bloque. */
  const libre = s.dire('pourquoi la commande de Nadia est bloquée ?'); assert.match(libre[0].titre, /^Rien ne bloque la commande SC7-NADIA$/); assert.deepEqual(libre[1].aller, { commande: 'sc7-nadia' });
  /* La capacité du samedi tombe à 5 : la validation de Nadia serait refusée ; l'assistant donne la raison de la garde. */
  const S = appliquer(s.S, 'cmdCapacites', { production: { ...s.S.commerce.capacites.production, 'emporter-escargots': 5 }, retraits: s.S.commerce.capacites.retraits, exemple: true });
  const garde = refusCommerce(S, 'cmdValider', { id: 'sc7-nadia', base: commandeDe(nadia, S, LIEUX), le: '2026-12-02T10:00' }, { auj: s.ctx.auj, lieux: LIEUX, ouverture: ouvertureRetraits(s.ctx, S) }); assert.match(garde, /il ne reste que 1 pièce à produire/);
  const r = s.dire('pourquoi la commande SC7-NADIA est bloquée ?', { S }); assert.match(r[0].titre, /^La commande SC7-NADIA est bloquée : « Valider la commande » est refusé$/); assert.equal(r[0].detail, garde, 'la même phrase que l\'interface');
  assert.ok(r.every((p) => !p.action), 'expliquer ne valide ni ne force rien');
  /* Sans dire laquelle, et avec plusieurs commandes en cours : l'assistant demande. */
  const q = s.dire('pourquoi la commande est bloquée ?', { S }); assert.equal(q[0].aChoisir, true); assert.ok(q.slice(1).every((p) => /^pourquoi la commande SC7-/.test(p.completer)));
});

test('une intention non comprise n\'exécute rien et propose ce qui existe', () => {
  const s = scene('commande'), t = 'réserve un taxi pour les musiciens';
  assert.deepEqual(s.dire(t), []); assert.deepEqual(comprendre(t, { auj: s.ctx.auj, R, S: s.S, exceptions: [], pages: {} }).filter((p) => p.action), [], 'aucun ordre n\'en est déduit');
  const r = nonCompris(t, 'cuisine'); assert.match(r[0].titre, /^Je n'ai pas compris « réserve un taxi pour les musiciens »$/); assert.match(r[0].detail, /Rien n'a été fait/); assert.equal(r[0].aChoisir, true);
  assert.ok(r.slice(1).every((p) => p.completer && !p.action && !p.aller), 'les suggestions écrivent une phrase dans le champ, elles ne lancent rien'); assert.equal(r.slice(1).length, 5);
  assert.deepEqual(nonCompris('a'), []);
});
