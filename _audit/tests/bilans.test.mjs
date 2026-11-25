/* v7.15.0 · Les bilans : des chiffres compréhensibles et vérifiables (règles pures, données fictives).
   Chaque indicateur a sa définition ; un chiffre se retrouve dans la liste des dossiers comptés ; une donnée absente
   n'est jamais un zéro ; un montant accepté ne suit pas le catalogue ; une carte expirée n'a pas de solde utilisable. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { publier } from '../../assets/js/disponibilites.js';
import { appliquer } from '../../assets/js/espace-donnees.js';
import { reglesAction } from '../../assets/js/espace-garde.js';
import { normaliser, aTraiter } from '../../assets/js/espace-demandes.js';
import { depart } from '../../assets/js/espace-scenarios.js';
import { idDossier, dossierDe, accepteeDe } from '../../assets/js/espace-receptions.js';
import { offresDeBase } from '../../assets/js/espace-offres.js';
import { refusCommerce, commandeDe, cadeauDe, cartes, soldeCarte, etatCarte } from '../../assets/js/commerce.js';
import { bilan, indicateur, periodes, periodeDite, taux, DEFINITIONS, DOMAINES } from '../../assets/js/espace-bilans.js';

globalThis.document ||= { visibilityState: 'visible' };
const lire = (f) => JSON.parse(readFileSync(new URL(`../../donnees/${f}`, import.meta.url), 'utf8'));
const SALLE = lire('salle.json'), LIEUX = lire('receptions.json'), AGENDA = lire('agenda.json').dates, R = publier(lire('reservation.json'), lire('horaires.json').adresses[0]).reservation;
const SRC = { carte: [], agenda: AGENDA, lieux: LIEUX }, BASE = offresDeBase(LIEUX);
const ctx = (auj, plus = {}) => ({ R, auj, minute: 600, maintenant: `${auj}T10:00:00`, site: [], demandes: [], exceptions: [], scenario: 'test', lieux: LIEUX, venues: {}, agenda: AGENDA, ...plus });
const agirR = (S, nom, args, c) => { const r = reglesAction(c, S, SALLE, nom, args); assert.equal(r.refus || '', '', `${nom} : ${r.refus}`); let e = appliquer(S, nom, args); for (const s of r.suites || []) e = appliquer(e, s.nom, s.args); return e; };
const agirC = (S, nom, args, auj) => { const r = refusCommerce(S, nom, args, { auj }); assert.equal(r, '', `${nom} : ${r}`); return appliquer(S, nom, args); };
const v = (b, id) => indicateur(b, id).valeur;
const resa = (id, date, statut, couverts, plus = {}) => ({ id, date, service: 'soir', heure: '20:00', couverts, nom: `Client ${id} (exemple)`, telephone: '', demande: '', espace: 'salle', statut, source: 'telephone', ...plus });

test('définitions : chaque indicateur dit ce qui est compté, les statuts inclus et exclus, sa date, sa source et le cas d\'une donnée manquante', () => {
  const b = bilan(ctx('2026-12-02'), {}, periodes('2026-12-02')[1], { attente: { tables: [], autres: [] } });
  assert.deepEqual([...new Set(b.indicateurs.map((x) => x.id))].sort(), Object.keys(DEFINITIONS).sort(), 'chaque indicateur calculé a sa définition, et réciproquement');
  for (const [id, d] of Object.entries(DEFINITIONS)) { for (const k of ['libelle', 'compte', 'inclus', 'exclus', 'date', 'source', 'manquant']) assert.ok(String(d[k] || '').length > 0, `${id} : « ${k} » est défini`);
    assert.ok(['periode', 'instant'].includes(d.portee), `${id} : sa portée est dite`); assert.ok(DOMAINES.some(([x]) => x === d.domaine), `${id} : son domaine existe`); }
  assert.ok(!Object.values(DEFINITIONS).some((d) => /chiffre d'affaires|encaiss[ée]s?\b(?! )/i.test(d.libelle)), 'aucun libellé ne parle d\'un chiffre d\'affaires encaissé');
  assert.deepEqual(Object.keys(b.parDomaine), ['restaurant', 'receptions', 'traiteur', 'cadeaux', 'suivi']);
});

test('périodes : le jour choisi, la semaine en cours et la précédente, avec leurs dates exactes ; elles suivent l\'horloge', () => {
  const p = periodes('2026-12-02');
  assert.deepEqual(p.map((x) => [x.cle, x.debut, x.fin]), [['jour', '2026-12-02', '2026-12-02'], ['semaine', '2026-11-30', '2026-12-06'], ['precedente', '2026-11-23', '2026-11-29']]);
  assert.equal(periodeDite(p[0]), 'mercredi 2 décembre 2026'); assert.equal(periodeDite(p[1]), 'du lundi 30 novembre au dimanche 6 décembre 2026');
  assert.equal(periodeDite({ debut: '2026-12-28', fin: '2027-01-03' }), 'du lundi 28 décembre 2026 au dimanche 3 janvier 2027', 'une semaine à cheval sur deux années dit les deux années');
  assert.deepEqual(periodes('2026-12-02', '2026-12-05')[0], { cle: 'jour', nom: 'Le jour', debut: '2026-12-05', fin: '2026-12-05' }, 'le jour peut être choisi');
  /* L'horloge de la démonstration avance d'une semaine : les périodes suivent. */
  assert.deepEqual(periodes('2026-12-09').map((x) => x.debut), ['2026-12-09', '2026-12-07', '2026-11-30']);
  assert.deepEqual(periodes('2026-12-07')[1], { cle: 'semaine', nom: 'Cette semaine', debut: '2026-12-07', fin: '2026-12-13' }, 'un lundi ouvre sa semaine');
  assert.deepEqual(periodes('2026-12-06')[1].fin, '2026-12-06', 'un dimanche la ferme');
});

test('restaurant : les couverts se comptent par statut, à la date de venue ; le chiffre et la liste disent la même chose', () => {
  const S = { resa: { ajouts: [resa('a', '2026-12-01', 'arrivee', 4), resa('b', '2026-12-01', 'confirmee', 2), resa('c', '2026-12-02', 'confirmee', 6), resa('d', '2026-12-02', 'a-confirmer', 3), resa('e', '2026-12-01', 'annulee', 5), resa('f', '2026-12-01', 'absente', 2), resa('g', '2026-12-01', 'refusee', 8), resa('h', '2026-12-04', 'confirmee', 2), resa('z', '2026-11-28', 'arrivee', 7)] } };
  const c = ctx('2026-12-02'), b = bilan(c, S, periodes('2026-12-02')[1], { attente: { tables: [], autres: [] } });
  assert.equal(v(b, 'resa-reserves'), 14, 'confirmées + arrivées : 4 + 2 + 6 + 2 ; ni la demande, ni l\'annulée, ni l\'absente, ni la refusée');
  assert.equal(v(b, 'resa-recus'), 4); assert.equal(v(b, 'resa-annulees'), 1); assert.equal(v(b, 'resa-absentes'), 1);
  for (const id of ['resa-reserves', 'resa-recus']) { const x = indicateur(b, id); assert.equal(x.dossiers.reduce((n, d) => n + +(/· (\d+) couverts?/.exec(d.titre)?.[1] || 0), 0), x.valeur, `${id} : la somme des dossiers listés redonne le chiffre`); }
  assert.deepEqual(indicateur(b, 'resa-reserves').dossiers.map((d) => d.id).sort(), ['a', 'b', 'c', 'h']);
  assert.deepEqual(indicateur(b, 'resa-annulees').dossiers[0].aller, { vue: 'resas', onglet: 'service', jour: '2026-12-01', service: 'soir', resa: 'e' }, 'chaque dossier compté ouvre son service, sa date et sa réservation');
  /* Le taux : numérateur et denominateur dits ; les jours à venir n'y entrent pas (le 4 décembre n'est pas commencé). */
  const t = indicateur(b, 'resa-venue'); assert.deepEqual([t.taux.numerateur, t.taux.denominateur], [4, 14], '4 reçus sur 4 + 2 + 6 + 2 absents (jours commencés)'); assert.match(t.detail, /4 sur 14 couverts/);
  /* La semaine précédente ne voit que sa réservation ; le jour choisi, les siennes. */
  assert.equal(v(bilan(c, S, periodes('2026-12-02')[2]), 'resa-recus'), 7); assert.equal(v(bilan(c, S, periodes('2026-12-02')[0]), 'resa-reserves'), 6);
  /* L'horloge avance d'une semaine : « cette semaine » est une autre semaine, et l'ancienne est devenue « la précédente ». */
  const c2 = ctx('2026-12-09'); assert.equal(v(bilan(c2, S, periodes('2026-12-09')[1]), 'resa-reserves'), 0); assert.equal(v(bilan(c2, S, periodes('2026-12-09')[2]), 'resa-reserves'), 14);
});

test('donnée absente ou valeur nulle : « non disponible » n\'est jamais un zéro', () => {
  const c = ctx('2026-12-02'), futur = bilan(c, {}, { debut: '2026-12-07', fin: '2026-12-13' }, { attente: { tables: [], autres: [] } });
  assert.equal(v(futur, 'resa-recus'), null, 'période à venir : les couverts reçus ne sont pas connus'); assert.match(indicateur(futur, 'resa-recus').raison, /pas encore commencé/);
  assert.equal(v(futur, 'resa-reserves'), 0, 'aucune réservation : zéro est connu'); assert.equal(v(futur, 'resa-annulees'), 0);
  assert.equal(v(futur, 'resa-venue'), null, 'dénominateur nul : pas de pourcentage'); assert.equal(taux(0, 0), null); assert.equal(taux(3, 0), null); assert.equal(taux(null, 4), null); assert.deepEqual(taux(1, 4), { valeur: 0.25, numerateur: 1, denominateur: 4 });
  assert.equal(v(futur, 'carte-soldes'), null, 'aucune carte émise : aucun solde à calculer'); assert.match(indicateur(futur, 'carte-soldes').raison, /Aucune carte/);
  assert.equal(v(futur, 'carte-emises'), 0); assert.equal(indicateur(futur, 'carte-emises').montant, 0);
  /* Sans la liste des demandes, « Demandes à traiter » est non disponible ; avec une liste vide, c'est zéro. */
  assert.equal(v(bilan(c, {}, periodes('2026-12-02')[1]), 'suivi-demandes'), null); assert.equal(v(futur, 'suivi-demandes'), 0);
  /* Site d'essai connecté : les réceptions ne sont pas partagées → non disponibles, pas « 0 dossier ». */
  const co = bilan(ctx('2026-12-02', { exemples: false, connecte: true, scenario: '' }), {}, periodes('2026-12-02')[1], { attente: { tables: [], autres: [] } });
  for (const id of ['rec-en-cours', 'rec-options', 'rec-acceptees']) { assert.equal(v(co, id), null); assert.match(indicateur(co, id).raison, /pas encore partagés/); }
  assert.equal(v(co, 'resa-reserves'), 0, 'les réservations, elles, sont partagées : zéro est un vrai zéro');
});

test('réceptions : une proposition acceptée garde son montant après un changement du catalogue ; l\'acceptation se rattache à sa date', () => {
  const d = depart('offre', R, '2026-11-20', { lieux: LIEUX, salle: SALLE }), c = ctx(d.horloge.iso, { scenario: 'offre' }), A = idDossier('sc6-ancienne');
  const acc = accepteeDe(dossierDe(d.etat, A), {}); assert.equal(acc.proposition.total, 1800); assert.ok(acc.accord.le, 'la date de l\'accord est connue');
  const P = { debut: acc.accord.le.slice(0, 10), fin: acc.accord.le.slice(0, 10) }, avant = indicateur(bilan(c, d.etat, P), 'rec-acceptees');
  assert.equal(avant.valeur, 1); assert.equal(avant.montant, 1800); assert.equal(avant.montantLibelle, 'Somme des montants de ces versions'); assert.equal(avant.dossiers[0].aller.dossier, A); assert.equal(avant.dossiers[0].aller.onglet, 'proposition');
  /* Le menu de groupe passe de 45 € à 49 € et est publié : l'historique n'est pas réévalué. */
  let S = agirR(d.etat, 'offre', { id: 'menu-groupe', champs: { prix: 49 }, saisie: { nom: 'Menu', prix: '49', unite: 'personne' }, base: BASE }, c);
  S = agirR(S, 'offPublier', { perimetre: 'offre', id: 'menu-groupe', le: `${d.horloge.iso}T10:00`, sources: SRC }, c);
  const apres = indicateur(bilan(c, S, P), 'rec-acceptees'); assert.equal(apres.montant, 1800, 'le montant accepté reste 1 800 €, pas 40 × 49 €'); assert.match(apres.dossiers[0].detail, /1800 €/);
  /* Hors de la date de l'accord, l'acceptation n'est pas comptée ; un accord sans date n'est rattaché à rien et c'est dit. */
  assert.equal(v(bilan(c, S, { debut: '2027-06-01', fin: '2027-06-07' }), 'rec-acceptees'), 0);
  const T = structuredClone(S), dos = T.receptions.dossiers[A]; for (const k of Object.keys(dos.accords || {})) dos.accords[k].le = ''; if (dos.accordEquipe) dos.accordEquipe.le = '';
  const flou = indicateur(bilan(c, T, { debut: '2020-01-01', fin: '2020-01-31' }), 'rec-acceptees'); assert.equal(flou.valeur, 0); assert.match(flou.aPart || '', /sans date connue/);
  /* Dossiers en cours : l'état du moment, avec chaque dossier ouvrable. */
  const cours = indicateur(bilan(c, S, P), 'rec-en-cours'); assert.equal(cours.portee, 'instant'); assert.equal(cours.valeur, cours.dossiers.length); assert.ok(cours.valeur >= 2);
});

test('traiteur : chaque commande compte une fois, à son jour de retrait ; le détail par état ne s\'additionne pas au total', () => {
  const lieux = { ...LIEUX, retraits: { debut: '2026-12-05', fin: '2026-12-31' }, emporter: [{ id: 'escargots', nom: 'Escargots à la crème d\'ail', prix: 18, unite: 'piece' }, { id: 'pate-lorrain', nom: 'Pâté lorrain', prix: 28, unite: 'kg' }, { id: 'foie-gras', nom: 'Foie gras de canard maison', prix: 36, unite: 'piece' }] };
  const d = depart('commande', R, '2026-11-23', { lieux }), c = ctx(d.horloge.iso, { scenario: 'commande', lieux }), dem = d.demandes.map(normaliser);
  const sem = periodes(d.horloge.iso)[1], b = bilan(c, d.etat, sem, { demandes: dem });
  /* Départ : SC7-PAUL validée pour le samedi 5 (72 €) ; Nadia attend une décision (non comptée) ; Marc retire la semaine suivante. */
  const val = indicateur(b, 'cmd-validees'); assert.deepEqual(val.dossiers.map((x) => x.id), ['sc7-paul']); assert.equal(val.valeur, 1); assert.equal(val.montant, 72); assert.equal(val.montantLibelle, 'Montant des commandes concernées');
  assert.deepEqual([v(b, 'cmd-a-preparer'), v(b, 'cmd-pretes'), v(b, 'cmd-retirees')], [1, 0, 0]); assert.equal(indicateur(b, 'cmd-a-preparer').sous, 'cmd-validees', 'le détail est dit « dont »');
  assert.deepEqual(val.dossiers[0].aller, { commande: 'sc7-paul' });
  let S = d.etat; for (const vers of ['preparation', 'prete', 'retiree']) S = agirC(S, 'cmdAvancer', { id: 'sc7-paul', vers, le: `${d.horloge.iso}T11:00` }, d.horloge.iso);
  const b2 = bilan(c, S, sem, { demandes: dem }); assert.deepEqual([v(b2, 'cmd-validees'), v(b2, 'cmd-a-preparer'), v(b2, 'cmd-pretes'), v(b2, 'cmd-retirees')], [1, 0, 0, 1], 'retirée : toujours une commande, comptée une fois');
  assert.equal(indicateur(b2, 'cmd-validees').montant, 72);
  /* Annulée : elle sort du compte. La semaine suivante a ses propres commandes. */
  const S3 = agirC(d.etat, 'cmdAnnuler', { id: 'sc7-paul', motif: 'Le client a annulé.', le: `${d.horloge.iso}T11:00` }, d.horloge.iso); assert.equal(v(bilan(c, S3, sem, { demandes: dem }), 'cmd-validees'), 0);
  assert.ok(indicateur(bilan(c, d.etat, { debut: '2026-12-07', fin: '2026-12-13' }, { demandes: dem }), 'cmd-validees').dossiers.some((x) => x.id === 'sc7-marc'));
  /* Une commande sans total connu est comptée, et son montant est dit non disponible (pas zéro). */
  const sans = structuredClone(d.etat); sans.commerce.commandes['sc7-paul'].total = null; const bs = indicateur(bilan(c, sans, sem, { demandes: dem }), 'cmd-validees');
  assert.equal(bs.valeur, 1); assert.equal(bs.montant, null); assert.match(bs.aPart, /sans total/);
});

test('cartes cadeaux : émission et utilisation sont deux événements ; le solde d\'une carte expirée n\'est pas utilisable', () => {
  const d = depart('cadeau', R, '2026-11-23', { lieux: LIEUX }), iso = d.horloge.iso, le = `${iso}T10:05`, dem = d.demandes.map(normaliser), g = cadeauDe(d.demandes[0], d.etat, LIEUX);
  let S = agirC(d.etat, 'cadValider', { id: g.id, base: g, acheteur: g.acheteur, le }, iso); S = agirC(S, 'cadRegler', { id: g.id, le }, iso); S = agirC(S, 'cadEmettre', { id: g.id, le }, iso);
  const [c1] = cartes(S).map((x) => x.id); S = agirC(S, 'carteUtiliser', { carte: c1, montant: 20, op: 'a', vu: 50, le }, iso);
  const c = ctx(iso, { scenario: 'cadeau' }), b = bilan(c, S, periodes(iso)[0], { demandes: dem });
  const em = indicateur(b, 'carte-emises'), us = indicateur(b, 'carte-utilisations'), rg = indicateur(b, 'cad-reglements'), so = indicateur(b, 'carte-soldes');
  assert.deepEqual([em.valeur, em.montant, em.montantLibelle], [2, 100, 'Valeur des cartes émises']); assert.deepEqual([us.valeur, us.montant, us.montantLibelle], [1, 20, 'Utilisations enregistrées']);
  assert.deepEqual([rg.valeur, rg.montant, rg.montantLibelle], [1, 100, 'Règlements simulés']); assert.match(rg.dossiers[0].detail, /rien n'est encaissé/);
  assert.equal(so.valeur, 80, 'solde utilisable : 30 € + 50 €'); assert.deepEqual(so.parts.map((x) => [x.cle, x.montant, x.n]), [['utilisable', 80, 2], ['expire', 0, 0], ['desactive', 0, 0]]);
  assert.deepEqual(em.dossiers[0].aller, { commerce: { ecran: 'carte', id: c1 } });
  /* Une utilisation annulée sort du compte ; l'émission, elle, n'est jamais comptée deux fois. */
  const SA = agirC(S, 'carteAnnulerUtilisation', { carte: c1, utilisation: 'u1', motif: 'Erreur de saisie.', le }, iso); assert.deepEqual([indicateur(bilan(c, SA, periodes(iso)[0], { demandes: dem }), 'carte-utilisations').valeur, indicateur(bilan(c, SA, periodes(iso)[0], { demandes: dem }), 'carte-soldes').valeur], [0, 100]);
  /* Après la fin de validité : les deux cartes sont expirées. Leur solde historique (80 €) n'est plus dans le solde utilisable. */
  const apres = cartes(S)[0].expire, tard = `${apres.slice(0, 8)}${String(+apres.slice(8) + 1).padStart(2, '0')}`, c2 = ctx(tard > apres ? tard : apres, { scenario: 'cadeau' });
  const fin = ctx('2027-12-31', { scenario: 'cadeau' }); assert.equal(etatCarte(cartes(S)[0], fin.auj), 'expiree');
  const so2 = indicateur(bilan(fin, S, periodes(fin.auj)[1], { demandes: dem }), 'carte-soldes');
  assert.equal(so2.valeur, 0, 'solde utilisable : 0 €'); assert.deepEqual(so2.parts.map((x) => [x.cle, x.montant]), [['utilisable', 0], ['expire', 80], ['desactive', 0]]); assert.match(so2.parts[1].libelle, /non utilisable/);
  assert.ok(so2.dossiers.every((x) => /non utilisable/.test(x.detail))); assert.equal(soldeCarte(cartes(S)[0]), 30, 'le solde historique reste lisible sur la carte'); void c2;
  /* Dans une autre semaine, ni émission ni utilisation : zéro connu. */
  const autre = bilan(c, S, { debut: '2027-02-01', fin: '2027-02-07' }, { demandes: dem }); assert.deepEqual([v(autre, 'carte-emises'), v(autre, 'carte-utilisations'), v(autre, 'cad-reglements')], [0, 0, 0]);
});

test('suivi : les demandes à traiter sont celles de la rubrique Demandes ; les tâches se rattachent à leur échéance', () => {
  const c = ctx('2026-12-02', { demandes: [{ id: 'q1', genre: 'question', cree: '2026-12-01T09:00:00', sujet: 'Une question', message: 'Bonjour', prenom: 'Claire', nom: 'D. (exemple)' }], exemples: false, demandesDemo: false });
  const S = { resa: { ajouts: [resa('t1', '2026-12-03', 'a-confirmer', 4)] }, taches: { liste: [{ id: 't-a', titre: 'Commander les fleurs', fait: false, cree: '2026-11-30', echeance: '2026-12-01' }, { id: 't-b', titre: 'Appeler le DJ', fait: false, cree: '2026-11-30', echeance: '2026-12-04' }, { id: 't-c', titre: 'Sans date', fait: false, cree: '2026-11-30' }, { id: 't-d', titre: 'Déjà faite', fait: true, cree: '2026-11-30', echeance: '2026-12-02', faitLe: '2026-12-02' }] } };
  const att = aTraiter({ ...c, exemples: true, scenario: 'test' }, S), b = bilan({ ...c, exemples: true }, S, periodes('2026-12-02')[1], { attente: att });
  const dm = indicateur(b, 'suivi-demandes'); assert.equal(dm.valeur, att.tables.length + att.autres.length); assert.equal(dm.valeur, 2); assert.deepEqual(dm.dossiers.map((x) => x.type), ['resa', 'demande']);
  assert.deepEqual(dm.dossiers[1].aller, { vue: 'demandes', filtre: 'question', demande: 'q1' });
  const tc = indicateur(b, 'suivi-taches'); assert.equal(tc.valeur, 2, 'ni la tâche sans date, ni la tâche terminée'); assert.match(tc.detail, /dont 1 en retard/); assert.deepEqual(tc.dossiers.map((x) => x.id), ['t-a', 't-b']);
});

test('le document des définitions (_exploitation/indicateurs.md) dit la même chose que le code', () => {
  const doc = readFileSync(new URL('../../_exploitation/indicateurs.md', import.meta.url), 'utf8');
  for (const [id, d] of Object.entries(DEFINITIONS)) { assert.ok(doc.includes(`(\`${id}\`)`), `${id} est documenté`); for (const k of ['compte', 'inclus', 'exclus', 'date', 'source', 'manquant']) assert.ok(doc.includes(d[k]), `${id} : « ${k} » est repris mot pour mot`); }
});

test('v7.16.0 · les libellés disent exactement ce qui est compté : des versions, et des arrivées notées sur les jours commencés', () => {
  const D = DEFINITIONS;
  assert.equal(D['rec-acceptees'].libelle, 'Versions de propositions acceptées'); assert.match(D['rec-acceptees'].note, /plusieurs versions acceptées/); assert.match(D['rec-acceptees'].note, /additionne les versions comptées/); assert.match(D['rec-acceptees'].note, /pas nécessairement la valeur actuelle des réceptions confirmées/); assert.match(D['rec-acceptees'].note, /pas des encaissements/);
  assert.equal(D['resa-recus'].libelle, 'Couverts notés arrivés'); assert.equal(D['resa-venue'].libelle, 'Part des couverts notés arrivés'); assert.equal(D['resa-venue'].precision, 'Sur les jours commencés');
  for (const id of ['resa-recus', 'resa-venue']) assert.match(D[id].manquant, /non renseignée ne prouve pas une absence/, `${id} : une arrivée non renseignée n'est pas une absence`);
  assert.match(D['resa-venue'].inclus, /Numérateur/); assert.match(D['resa-venue'].inclus, /Dénominateur/); assert.match(D['resa-venue'].inclus, /jours déjà commencés/); assert.match(D['resa-venue'].inclus, /service du soir/);
  /* Un dossier, deux versions acceptées dans la période : deux versions comptées, leurs montants additionnés ; l'unité est « version ». */
  const d = depart('offre', R, '2026-11-20', { lieux: LIEUX, salle: SALLE }), c = ctx(d.horloge.iso, { scenario: 'offre' }), acc = accepteeDe(dossierDe(d.etat, idDossier('sc6-ancienne')), {});
  const P = { debut: acc.accord.le.slice(0, 10), fin: acc.accord.le.slice(0, 10) }, x = indicateur(bilan(c, d.etat, P), 'rec-acceptees');
  assert.equal(x.unite, 'version'); assert.equal(x.valeur, 1); assert.equal(x.montantLibelle, 'Somme des montants de ces versions'); assert.equal(x.montant, 1800, 'le nombre et le montant sont ceux de la v7.15.0');
  /* Le taux garde son numérateur, son dénominateur, et dit quels jours sont commencés. */
  const S = { resa: { ajouts: [resa('a', '2026-12-01', 'arrivee', 4), resa('b', '2026-12-02', 'confirmee', 6), resa('z', '2026-12-04', 'confirmee', 8)] } }, t = indicateur(bilan(ctx('2026-12-02'), S, periodes('2026-12-02')[1], { attente: { tables: [], autres: [] } }), 'resa-venue');
  assert.deepEqual([t.taux.numerateur, t.taux.denominateur], [4, 10], 'le jour à venir (8 couverts) ne pèse pas ; le jour en cours pèse en entier'); assert.deepEqual(t.commences, { debut: '2026-11-30', fin: '2026-12-02' }); assert.match(t.detail, /4 sur 10 couverts/);
});
