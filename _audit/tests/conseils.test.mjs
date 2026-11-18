/* Tests de « L'espace vous propose » et du bilan de la semaine (fonctions pures).
   Lancer : node --test _audit/tests/*.test.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { conseils, bilanSemaine, lundiDe, SEUIL_PLEIN } from '../../assets/js/espace-conseils.js';
import { appliquer, MUTATIONS } from '../../assets/js/espace-donnees.js';
import { CAPACITE, ajouter, ouvertSite, resasDuJour, couverts } from '../../assets/js/espace-regles.js';

const j = (f) => JSON.parse(readFileSync(new URL(`../../donnees/${f}`, import.meta.url), 'utf8'));
const R = j('reservation.json'), AGENDA = j('agenda.json').dates, PRODUITS = j('emporter.json').produits.map((p) => ({ nom: p.nom.fr, prix: p.prix }));
const AUJ = '2026-11-18';
const ctx = (plus = {}) => ({ R, auj: AUJ, site: [], demandes: [], produits: PRODUITS, exceptions: [], agenda: AGENDA, pages: { reserver: '/reserver', accueil: '/' }, ...plus });
const ids = (S, plus) => conseils(ctx(plus), S).map((c) => c.id);

test('chaque suggestion vient de l\'état réel et porte son geste', () => {
  const l = conseils(ctx(), {});
  assert.ok(l.length >= 1); for (const c of l) { assert.ok(c.titre && c.detail && c.bouton && (c.action || c.aller)); if (c.action) assert.ok(MUTATIONS[c.action.nom], c.action.nom); }
  assert.ok(l.some((c) => c.id === 'attente-demo-cadeau-1'), 'la carte cadeau de démonstration attend depuis deux jours');
  assert.ok(!l.some((c) => c.genre === 'complet'), 'aucun service de démonstration n\'atteint les quatre cinquièmes de la capacité');
});

test('un service presque plein : « Dire complet », puis plus rien', () => {
  const jour = Array.from({ length: 7 }, (_, k) => ajouter(AUJ, k + 1)).find((iso) => ouvertSite(R, iso, 'soir'));
  const deja = couverts(resasDuJour(ctx(), {}, jour).filter((r) => r.service === 'soir')), manque = Math.ceil(SEUIL_PLEIN * CAPACITE) - deja;
  let S = appliquer({}, 'ajouterResa', { resa: { id: 'tel-g', date: jour, service: 'soir', heure: R.services.soir.debut, couverts: manque, nom: 'Groupe', statut: 'confirmee', source: 'telephone' } });
  const c = conseils(ctx(), S).find((x) => x.id === `plein-${jour}-soir`); assert.ok(c, 'le service à quatre cinquièmes est signalé'); assert.match(c.titre, new RegExp(`${Math.ceil(SEUIL_PLEIN * CAPACITE)} couverts sur ${CAPACITE}`));
  S = appliquer(S, c.action.nom, c.action.args); assert.ok(!ids(S).includes(c.id), 'une fois complet, la suggestion disparaît');
  assert.ok(!ids(appliquer({}, 'ajouterResa', { resa: { id: 'tel-p', date: jour, service: 'soir', heure: R.services.soir.debut, couverts: Math.max(1, manque - 1), nom: 'Petit groupe', statut: 'confirmee', source: 'telephone' } })).includes(c.id), 'juste en dessous du seuil : rien');
});

test('une table pour demain sans réponse ; une demande qui attend ; une réponse les fait disparaître', () => {
  const demain = ajouter(AUJ, 1), resa = { id: 'R-1', date: demain, service: 'midi', heure: R.services.midi.debut, couverts: 4, prenom: 'Claire', nom: 'Essai' };
  if (ouvertSite(R, demain, 'midi')) { const l = conseils(ctx({ site: [resa] }), {}), c = l.find((x) => x.id === `tables-${demain}`); assert.ok(c); assert.match(c.detail, /Claire Essai, 4 couverts/); assert.deepEqual(c.aller, { vue: 'demandes', filtre: 'table' }); }
  const vieille = { id: 'Q-1', genre: 'question', cree: `${ajouter(AUJ, -5)}T10:00:00`, sujet: 'Une allergie', prenom: 'Luc', nom: 'D.' };
  const c = conseils(ctx({ demandes: [vieille] }), {}).find((x) => x.id === 'attente-Q-1'); assert.ok(c, 'la plus ancienne des demandes en attente'); assert.match(c.titre, /Luc D\. attend une réponse depuis 5 jours/); assert.match(c.detail, /1 autre demande dans le même cas/);
  assert.ok(!ids(appliquer({}, 'etapeDemande', { id: 'Q-1', statut: 'repondue' }), { demandes: [vieille] }).includes('attente-Q-1'));
  assert.ok(!ids({}, { demandes: [{ ...vieille, id: 'Q-2', cree: `${AUJ}T09:00:00` }] }).includes('attente-Q-2'), 'une demande d\'aujourd\'hui n\'est pas en retard');
});

test('une soirée proche sans prix ; une fermeture proche sans annonce', () => {
  let S = appliquer({}, 'evenement', { id: 'ev-1', champs: { titre: 'Soirée raclette', debut: ajouter(AUJ, 10), type: 'Soirée', service: 'soir', prix: '' }, agenda: AGENDA });
  const c = conseils(ctx(), S).find((x) => x.id === 'prix-ev-1'); assert.match(c.titre, /« Soirée raclette » est dans 10 jours et n'a pas de prix/); assert.deepEqual(c.aller, { vue: 'site', onglet: 'soirees', editer: 'ev-1' });
  assert.ok(!ids(appliquer(S, 'evenement', { id: 'ev-1', champs: { prix: '39 €' }, agenda: AGENDA })).includes('prix-ev-1')); assert.ok(!ids(appliquer(S, 'visibilite', { id: 'ev-1', visible: false, agenda: AGENDA })).includes('prix-ev-1'), 'une soirée masquée ne compte pas');
  assert.ok(!ids(appliquer({}, 'evenement', { id: 'ev-2', champs: { titre: 'Loin', debut: ajouter(AUJ, 40), prix: '' }, agenda: AGENDA })).includes('prix-ev-2'));
  S = appliquer({}, 'ajouterFermeture', { du: ajouter(AUJ, 6), au: ajouter(AUJ, 8), motif: 'Travaux' });
  const f = conseils(ctx(), S).find((x) => x.genre === 'annonce'); assert.ok(f); assert.match(f.action.args.texte, /^Le restaurant sera fermé du 24 novembre au 26 novembre\. À très vite !$/);
  assert.ok(!conseils(ctx(), appliquer(S, f.action.nom, f.action.args)).some((x) => x.genre === 'annonce'), 'une fois annoncée, plus de suggestion');
});

test('« Plus tard » fait taire une suggestion jusqu\'au lendemain', () => {
  const id = ids({})[0]; const S = appliquer({}, 'taireConseil', { id, date: AUJ });
  assert.ok(!ids(S).includes(id)); assert.ok(conseils({ ...ctx(), auj: ajouter(AUJ, 1) }, S).length >= 0);
  assert.deepEqual(appliquer(S, 'taireConseil', { id: 'autre', date: ajouter(AUJ, 1) }).conseils.ignores, { autre: ajouter(AUJ, 1) }, 'les jours passés ne s\'accumulent pas');
});

test('le bilan de la semaine compte ce que l\'agenda montre', () => {
  assert.equal(lundiDe(AUJ), '2026-11-16'); assert.equal(lundiDe('2026-11-16'), '2026-11-16'); assert.equal(lundiDe('2026-11-22'), '2026-11-16');
  const b = bilanSemaine(ctx(), {}, lundiDe(AUJ)); assert.equal(b.jours.length, 7); assert.equal(b.capacite, CAPACITE);
  let total = 0, ouverts = 0; for (const x of b.jours) for (const sv of ['midi', 'soir']) { const s = x.services[sv]; assert.equal(s.ouvert, ouvertSite(R, x.iso, sv)); assert.equal(s.couverts, couverts(resasDuJour(ctx(), {}, x.iso).filter((r) => r.service === sv))); total += s.couverts; ouverts += s.ouvert ? 1 : 0; }
  assert.equal(b.couverts, total); assert.equal(b.servicesOuverts, ouverts); assert.ok(Math.abs(b.remplissage - total / (ouverts * CAPACITE)) < 1e-9);
  assert.equal(b.origines.demo, b.tables, 'sans rien d\'autre, tout vient de la démonstration'); assert.equal(b.origines.site + b.origines.telephone, 0);
  const S = appliquer({}, 'ajouterResa', { resa: { id: 'tel-1', date: b.plusCharge.iso, service: b.plusCharge.service, heure: R.services[b.plusCharge.service].debut, couverts: 6, nom: 'Essai', statut: 'confirmee', source: 'telephone' } });
  const b2 = bilanSemaine(ctx(), S, lundiDe(AUJ)); assert.equal(b2.couverts, b.couverts + 6); assert.equal(b2.origines.telephone, 1); assert.equal(b2.plusCharge.couverts, b.plusCharge.couverts + 6);
});
