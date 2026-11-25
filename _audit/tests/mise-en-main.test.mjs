/* v7.16.0 · « Préparer l'outil pour votre restaurant » : la mise en main des réglages existants (règles pures, données fictives).
   Le guide ne règle rien : il relit les sources réelles, dit honnêtement l'état de chaque valeur, et nomme l'écran
   existant où elle se modifie. Un refus n'y fait rien avancer ; une valeur présente n'est jamais dite « confirmée ». */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { publier } from '../../assets/js/disponibilites.js';
import { appliquer } from '../../assets/js/espace-donnees.js';
import { depart } from '../../assets/js/espace-scenarios.js';
import { refusCommerce, cartes, validite, capacites, periodeRetraits } from '../../assets/js/commerce.js';
import { comprendre } from '../../assets/js/espace-commandes.js';
import { CAPACITE } from '../../assets/js/espace-regles.js';
import { miseEnMain, repereDit, serviceDit, ETATS, RUBRIQUES, TITRE } from '../../assets/js/espace-mise-en-main.js';

globalThis.document ||= { visibilityState: 'visible' };
const lire = (f) => JSON.parse(readFileSync(new URL(`../../donnees/${f}`, import.meta.url), 'utf8'));
const H = lire('horaires.json').adresses[0], SALLE = lire('salle.json'), AGENDA = lire('agenda.json').dates, R = publier(lire('reservation.json'), H).reservation;
const LIEUX = { ...lire('receptions.json'), cadeaux: [25, 50, 100], retraits: { debut: '2026-12-05', fin: '2026-12-31' }, emporter: [{ id: 'escargots', nom: 'Escargots à la crème d\'ail', prix: 18, unite: 'piece' }, { id: 'foie-gras', nom: 'Foie gras de canard maison', prix: 36, unite: 'piece' }] };
const AUJ = '2026-12-02';
const mise = (S = {}, plus = {}) => miseEnMain({ S, base: { semaine: H.semaine, exceptions: [] }, salle: SALLE, lieux: LIEUX, R, sources: { carte: [], agenda: AGENDA, lieux: LIEUX }, auj: AUJ, connecte: false, scenario: '', ...plus });
const rub = (m, id) => m.rubriques.find((r) => r.id === id), ligne = (m, id, libelle) => rub(m, id).lignes.find((l) => l.libelle.startsWith(libelle));
const ok = (S, nom, args) => { assert.equal(refusCommerce(S, nom, args, { auj: AUJ }), '', `${nom} devrait être accepté`); return appliquer(S, nom, args); };

test('cinq rubriques, dans l\'ordre, chacune avec son utilité, ses valeurs et au moins un écran existant à ouvrir', () => {
  const m = mise();
  assert.deepEqual(m.rubriques.map((r) => r.id), ['horaires', 'salles', 'emporter', 'offres', 'cadeaux']); assert.deepEqual(m.rubriques.map((r) => r.titre), RUBRIQUES.map(([, t]) => t));
  assert.equal(TITRE, 'Préparer l\'outil pour votre restaurant');
  /* Les seuls écrans visés : ceux qui existent déjà (une rubrique et son onglet, ou un écran des commandes et cartes). */
  const ECRANS = new Set(['site/horaires', 'site/publication', 'resas/salle', 'carte/catalogue', 'commerce/preparation', 'commerce/cartes']);
  for (const r of m.rubriques) { assert.ok(r.sert.length > 40, `${r.id} : une phrase dit à quoi sert la relecture`); assert.ok(r.lignes.length >= 3, `${r.id} : un résumé des valeurs`); assert.ok(r.actions.length >= 1 && r.actions.filter((a) => a.principal).length === 1, `${r.id} : un bouton principal`);
    for (const a of r.actions) assert.ok(ECRANS.has(a.aller.commerce ? `commerce/${a.aller.commerce.ecran}` : `${a.aller.vue}/${a.aller.onglet}`), `${r.id} : « ${a.libelle} » ouvre un écran existant`);
    for (const l of r.lignes) { assert.ok(l.libelle && l.valeur, `${r.id} : chaque ligne a un libellé et une valeur dite`); assert.ok(l.etat === '' || ETATS[l.etat], `${r.id} : état connu`); } }
});

test('quatre états, et jamais « confirmé » : une valeur présente n\'est pas une décision du restaurant', () => {
  assert.deepEqual(Object.values(ETATS), ['Non renseigné', 'Valeur d\'exemple à confirmer', 'Renseigné', 'Non disponible dans ce mode']);
  const textes = JSON.stringify([mise(), mise({}, { connecte: true }), mise({}, { scenario: 'commande' })]);
  assert.doesNotMatch(textes, /confirmée? par (le restaurant|vous)"|Confirmé par/i, 'aucun état « confirmé »');
  assert.doesNotMatch(readFileSync(new URL('../../assets/js/espace-mise-en-main.js', import.meta.url), 'utf8'), /localStorage|sessionStorage|agir\(|appliquer\(/, 'le module ne garde et ne modifie rien');
  assert.doesNotMatch(readFileSync(new URL('../../assets/js/espace-vue-mise.js', import.meta.url), 'utf8'), /<input|<select|<textarea|<form|X\.agir|agir\(/, 'l\'écran n\'a ni champ, ni formulaire, ni action d\'enregistrement');
});

test('horaires : relus dans la source réelle ; les règles d\'arrivée sont dites non modifiables', () => {
  let m = mise();
  assert.equal(serviceDit(H.semaine, 'soir'), 'vendredi et samedi, de 19 h à minuit'); assert.match(ligne(m, 'horaires', 'Service du soir').valeur, /^Vendredi et samedi, de 19 h à minuit$/);
  assert.equal(ligne(m, 'horaires', 'Service du midi').etat, 'renseigne'); assert.match(ligne(m, 'horaires', 'Service du midi').note, /Repris du site publié/);
  for (const l of ['Heures d\'arrivée', 'Réservation en ligne']) { assert.equal(ligne(m, 'horaires', l).fixe, true, `${l} : non modifiable dans l'outil`); assert.equal(ligne(m, 'horaires', l).etat, 'exemple'); }
  assert.match(rub(m, 'horaires').limites.join(' '), /ne se modifient pas encore dans l'outil/);
  /* L'éditeur existant enregistre de nouveaux horaires : le résumé les relit, et dit d'où ils viennent. */
  const S = appliquer({}, 'horaires', { semaine: { ...H.semaine, lundi: ['19:00-22:00'], vendredi: ['12:00-14:30'] } }); m = mise(S);
  assert.match(ligne(m, 'horaires', 'Service du soir').valeur, /Lundi, de 19 h à 22 h ; samedi, de 19 h à minuit/); assert.match(ligne(m, 'horaires', 'Service du soir').note, /Enregistrés dans l'espace/);
  assert.equal(ligne(mise({ horaires: { exceptions: [{ du: '2026-12-24', au: '2026-12-26', motif: 'Noël' }, { du: '2026-11-01', au: '2026-11-02' }] } }), 'horaires', 'Fermetures').valeur, 'Du 24 décembre au 26 décembre', 'seules les fermetures à venir');
  assert.equal(ligne(mise({ horaires: { semaine: {} } }), 'horaires', 'Service du midi').etat, 'vide'); assert.equal(rub(mise({ horaires: { semaine: {} } }), 'horaires').manques.length, 1);
});

test('salles : les valeurs de la maquette sont des exemples en lecture seule ; la capacité de démonstration reste dite « exemple »', () => {
  const m = mise(), cap = ligne(m, 'salles', 'Capacité par service');
  assert.equal(cap.valeur, `${CAPACITE} couverts (réservation en ligne et à la main)`); assert.equal(cap.etat, 'exemple'); assert.equal(cap.fixe, true); assert.match(cap.note, /ne doit pas devenir votre capacité réelle/);
  assert.equal(ligne(m, 'salles', 'Tables de la salle').valeur, '9 tables, 38 places'); assert.match(ligne(m, 'salles', 'Tables de la terrasse').valeur, /3 tables, 14 places/);
  assert.equal(rub(m, 'salles').portee.cle, 'fixe'); assert.deepEqual(rub(m, 'salles').actions.map((a) => a.aller), [{ vue: 'resas', onglet: 'salle' }]);
  assert.equal(ligne(m, 'salles', 'Espaces de réception').etat, 'renseigne'); assert.match(rub(m, 'salles').manques[0], /sans capacité connue/);
});

test('à emporter : non renseigné, exemple, renseigné suivent les réglages réels ; un refus ne fait rien avancer', () => {
  let S = {}, m = mise(S);
  assert.equal(ligne(m, 'emporter', 'Période').etat, 'exemple', 'réglage de départ : à confirmer'); assert.equal(ligne(m, 'emporter', 'Commandes par créneau').etat, 'vide'); assert.equal(ligne(m, 'emporter', 'Production').etat, 'vide');
  /* Des capacités d'exemple (celles d'une démonstration) restent dites « exemple ». */
  S = ok(S, 'cmdCapacites', { production: { 'emporter-escargots': 6 }, retraits: 2, exemple: true }); m = mise(S);
  assert.equal(ligne(m, 'emporter', 'Commandes par créneau').etat, 'exemple'); assert.equal(ligne(m, 'emporter', 'Production').etat, 'exemple'); assert.match(ligne(m, 'emporter', 'Production').valeur, /Escargots à la crème d'ail : 6 pièces ; Foie gras de canard maison : non définie/); assert.match(rub(m, 'emporter').manques.join(' '), /1 produit sans capacité de production/);
  /* Un refus de l'éditeur (capacité négative) : l'état précédent est conservé, le résumé ne bouge pas. */
  const avant = JSON.stringify(mise(S)); assert.notEqual(refusCommerce(S, 'cmdCapacites', { production: { 'emporter-escargots': -3 }, retraits: 2, exemple: false }, { auj: AUJ }), ''); assert.equal(JSON.stringify(mise(S)), avant);
  /* L'éditeur enregistre : la source change, le résumé la relit. */
  S = ok(S, 'cmdCapacites', { production: { 'emporter-escargots': 8, 'emporter-foie-gras': 4 }, retraits: 3, exemple: false }); S = ok(S, 'cmdRetraits', { debut: '2026-12-10', fin: '2026-12-24' }); m = mise(S);
  assert.equal(ligne(m, 'emporter', 'Commandes par créneau').valeur, '3 commandes'); assert.equal(ligne(m, 'emporter', 'Commandes par créneau').etat, 'renseigne'); assert.equal(ligne(m, 'emporter', 'Production').etat, 'renseigne');
  assert.equal(ligne(m, 'emporter', 'Période').valeur, 'Du 10 au 24 décembre 2026'); assert.equal(ligne(m, 'emporter', 'Période').etat, 'renseigne'); assert.deepEqual(periodeRetraits(S, LIEUX), { debut: '2026-12-10', fin: '2026-12-24', reglee: true });
  assert.deepEqual(capacites(S).production, { 'emporter-escargots': 8, 'emporter-foie-gras': 4 });
});

test('cartes cadeaux : la validité relue ; la changer ne touche pas aux cartes déjà émises', () => {
  const d = depart('cadeau', R, '2026-11-23', { lieux: LIEUX, salle: SALLE }); let S = d.etat, m = mise(S, { scenario: 'cadeau', auj: d.horloge.iso });
  const v0 = validite(S); assert.equal(ligne(m, 'cadeaux', 'Durée de validité').etat, v0 ? (v0.exemple ? 'exemple' : 'renseigne') : 'vide');
  assert.equal(ligne(mise({}), 'cadeaux', 'Durée de validité').etat, 'vide'); assert.match(ligne(mise({}), 'cadeaux', 'Durée de validité').valeur, /Non définie/);
  assert.match(ligne(mise({}), 'cadeaux', 'Cartes proposées').valeur, /3 cartes : 25 €, 50 €, 100 €/);
  /* Une carte émise garde sa date de fin quand la durée par défaut change. */
  S = ok({}, 'cadValidite', { mois: 6, exemple: true }); assert.equal(ligne(mise(S), 'cadeaux', 'Durée de validité').etat, 'exemple');
  const emises = cartes(S).map((c) => [c.id, c.expire, c.utilisations?.length || 0]);
  assert.notEqual(refusCommerce(S, 'cadValidite', { mois: -1, exemple: false }, { auj: AUJ }), '', 'une durée négative est refusée par l\'éditeur');
  S = ok(S, 'cadValidite', { mois: 12, exemple: false }); m = mise(S);
  assert.equal(ligne(m, 'cadeaux', 'Durée de validité').valeur, '12 mois à partir de l\'émission'); assert.equal(ligne(m, 'cadeaux', 'Durée de validité').etat, 'renseigne');
  assert.deepEqual(cartes(S).map((c) => [c.id, c.expire, c.utilisations?.length || 0]), emises);
});

test('offres : les montants d\'exemple et les brouillons sont comptés dans le catalogue réel ; relire ne publie rien', () => {
  const m = mise(), ex = ligne(m, 'offres', 'Montants marqués');
  assert.equal(ex.etat, 'exemple'); assert.match(ex.valeur, /^4 offres : Menu de groupe/); assert.match(rub(m, 'offres').limites[0], /ne publie rien/);
  assert.match(ligne(m, 'offres', 'Brouillons').valeur, /^Aucun/);
  /* Un prix modifié dans le catalogue devient un changement en préparation, pas une publication. */
  const S = appliquer({}, 'offre', { id: LIEUX.lignes[0].id, champs: { prix: 49 }, base: LIEUX.lignes.map((l) => ({ id: l.id })) });
  if (JSON.stringify(S) !== '{}') { const b = ligne(mise(S), 'offres', 'Brouillons'); assert.match(b.valeur, /changement/); assert.match(b.note, /Rien n'est en ligne/); }
});

test('la portée est dite d\'après le mode : démonstration, navigateur, partagé ou sur cet appareil', () => {
  const demo = mise({}, { scenario: 'commande' }), nav = mise(), essai = mise({}, { connecte: true });
  assert.deepEqual(demo.rubriques.map((r) => r.portee.cle), ['demo', 'fixe', 'demo', 'demo', 'demo']); assert.deepEqual(nav.rubriques.map((r) => r.portee.cle), ['navigateur', 'fixe', 'navigateur', 'navigateur', 'navigateur']);
  assert.deepEqual(essai.rubriques.map((r) => r.portee.cle), ['partage', 'fixe', 'appareil', 'appareil', 'appareil'], 'sur le site d\'essai : seuls les horaires sont partagés');
  assert.match(rub(essai, 'emporter').portee.texte, /ne sont pas encore partagés avec l'équipe/); assert.equal(ligne(essai, 'salles', 'Espaces de réception').etat, 'indisponible'); assert.equal(essai.repere.indisponible, 1);
});

test('le repère dit exactement ce qu\'il compte : des valeurs relues, pas une progression', () => {
  const m = mise(), avecEtat = m.rubriques.flatMap((r) => r.lignes).filter((l) => l.etat);
  assert.equal(m.repere.total, avecEtat.length); assert.equal(m.repere.vide + m.repere.exemple + m.repere.renseigne + m.repere.indisponible, m.repere.total);
  assert.match(repereDit(m.repere), new RegExp(`^${m.repere.total} valeurs relues dans vos réglages : ${m.repere.exemple} valeurs d'exemple à confirmer`)); assert.doesNotMatch(repereDit(m.repere), /%|terminé|fait/);
  /* Ouvrir un écran ne change rien : seul un réglage enregistré déplace le repère. */
  const S = ok({}, 'cadValidite', { mois: 6, exemple: false }), n = mise(S); assert.equal(n.repere.vide, m.repere.vide - 1); assert.equal(n.repere.renseigne, m.repere.renseigne + 1);
});

test('la barre « Que voulez-vous faire ? » mène à la mise en main', () => {
  for (const t of ['réglages', 'où sont les paramètres', 'préparer l\'outil', 'mise en main']) { const p = comprendre(t, { auj: AUJ, R, S: {}, exceptions: [], pages: {} }).find((x) => x.aller?.mise); assert.ok(p, `« ${t} » propose la mise en main`); assert.match(p.titre, /Préparer l'outil pour votre restaurant/); }
});
