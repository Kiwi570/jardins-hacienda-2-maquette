/* Tests de la carte dans l'espace : plats modifiés, ajoutés, retirés, épuisés pour un jour (fonctions pures).
   Lancer : node --test _audit/tests/*.test.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ALLERGENES, prixTexte, lirePrix, carteDe, platsDe, origine, trouverPlat } from '../../assets/js/espace-carte.js';
import { appliquer } from '../../assets/js/espace-donnees.js';
import { estVide } from '../../assets/js/espace-stock.js';

const BASE = JSON.parse(readFileSync(new URL('../../donnees/carte.json', import.meta.url), 'utf8')).rubriques;
const AUJ = '2026-11-18', DEMAIN = '2026-11-19';
const plat = (S, cle, jour = AUJ) => platsDe(carteDe(BASE, S, jour)).find((p) => p.cle === cle);

test('les prix s\'écrivent comme sur la carte', () => {
  assert.equal(prixTexte(21), '21 €'); assert.equal(prixTexte(9.5), '9,50 €'); assert.equal(prixTexte('Prix du marché'), 'Prix du marché'); assert.equal(prixTexte(''), ''); assert.equal(prixTexte('23'), '23 €');
  assert.equal(lirePrix('23'), 23); assert.equal(lirePrix('24,50 €'), 24.5); assert.equal(lirePrix(' Prix du marché '), 'Prix du marché'); assert.equal(lirePrix(''), '');
  assert.equal(ALLERGENES.length, 14);
});

test('la carte livrée, telle quelle : rien n\'est inventé', () => {
  const c = carteDe(BASE, {}, AUJ);
  assert.deepEqual(c.map((r) => [r.id, r.plats.length]), BASE.map((r) => [r.id, r.plats.length]));
  for (const p of platsDe(c)) { const o = origine(BASE, p.cle); assert.equal(p.nom, o.nom); assert.deepEqual(p.allergenes, [], 'aucun allergène prérempli'); assert.ok(!p.epuise && !p.masque && !p.modifie && !p.nouveau); }
});

test('modifier un plat ; le remettre comme avant ne laisse rien', () => {
  let S = appliquer({}, 'plat', { cle: 'entrees/foie-gras-de-canard-maison', champs: { prix: 23, allergenes: ['Lait', 'Gluten', 'Inconnu'] }, base: BASE });
  const p = plat(S, 'entrees/foie-gras-de-canard-maison'); assert.equal(p.prix, 23); assert.deepEqual(p.allergenes, ['Gluten', 'Lait'], 'dans l\'ordre de la liste, sans intrus'); assert.equal(p.modifie, true); assert.equal(p.nom, BASE[0].plats[0].nom);
  assert.equal(plat(S, 'entrees/risotto-de-saint-jacques-au-riz-noir').modifie, false);
  S = appliquer(S, 'plat', { cle: 'entrees/foie-gras-de-canard-maison', champs: { prix: BASE[0].plats[0].prix, allergenes: [] }, base: BASE }); assert.ok(estVide(S), 'revenu à la carte livrée');
});

test('ajouter un plat, le modifier, le retirer', () => {
  let S = appliquer({}, 'ajouterPlat', { rubrique: 'desserts', id: 'x1', plat: { nom: 'Tarte aux mirabelles', prix: 9 } });
  const cle = 'desserts/+x1', p = plat(S, cle); assert.equal(p.nouveau, true); assert.equal(p.rubrique, 'desserts'); assert.equal(carteDe(BASE, S, AUJ).find((r) => r.id === 'desserts').plats.at(-1).cle, cle, 'en fin de rubrique');
  S = appliquer(S, 'plat', { cle, champs: { description: 'De Lorraine.' }, base: BASE }); assert.equal(plat(S, cle).description, 'De Lorraine.');
  S = appliquer(S, 'epuise', { cle, date: AUJ, actif: true }); S = appliquer(S, 'platVisible', { cle, visible: false }); assert.ok(estVide(S), 'un plat ajouté puis retiré ne laisse rien');
});

test('retirer un plat du site de la carte, puis le remettre', () => {
  let S = appliquer({}, 'platVisible', { cle: 'plats/supreme-de-pintade', visible: false }); assert.equal(plat(S, 'plats/supreme-de-pintade').masque, true); assert.equal(plat(S, 'plats/supreme-de-pintade').modifie, false);
  S = appliquer(S, 'plat', { cle: 'plats/supreme-de-pintade', champs: { prix: 30 }, base: BASE }); assert.equal(plat(S, 'plats/supreme-de-pintade').masque, true, 'modifier ne le remet pas sur la carte');
  S = appliquer(S, 'platVisible', { cle: 'plats/supreme-de-pintade', visible: true }); assert.equal(plat(S, 'plats/supreme-de-pintade').masque, false); assert.equal(plat(S, 'plats/supreme-de-pintade').prix, 30);
});

test('épuisé aujourd\'hui : le lendemain, le plat revient tout seul', () => {
  let S = appliquer({}, 'epuise', { cle: 'plats/piece-de-boucher', date: AUJ, actif: true });
  assert.equal(plat(S, 'plats/piece-de-boucher').epuise, true); assert.equal(plat(S, 'plats/piece-de-boucher', DEMAIN).epuise, false, 'demain, il est de retour');
  S = appliquer(S, 'epuise', { cle: 'plats/poisson-selon-l-arrivage', date: DEMAIN, actif: true }); assert.deepEqual(S.carte.epuises, { 'plats/poisson-selon-l-arrivage': DEMAIN }, 'les jours passés ne s\'accumulent pas');
  assert.ok(estVide(appliquer(S, 'epuise', { cle: 'plats/poisson-selon-l-arrivage', date: DEMAIN, actif: false })));
});

test('retrouver un plat d\'après ce qu\'on en dit', () => {
  const c = carteDe(BASE, {}, AUJ), t = (x) => trouverPlat(c, x)?.cle;
  assert.equal(t('foie gras'), 'entrees/foie-gras-de-canard-maison'); assert.equal(t('le foie gras de canard'), 'entrees/foie-gras-de-canard-maison'); assert.equal(t('os à moelle'), 'entrees/l-os-a-moelle'); assert.equal(t('risotto'), 'entrees/risotto-de-saint-jacques-au-riz-noir');
  assert.equal(t('licorne rôtie'), undefined); assert.equal(t(''), undefined); assert.equal(t('le la de'), undefined);
  const S = appliquer({}, 'platVisible', { cle: 'entrees/foie-gras-de-canard-maison', visible: false }); assert.notEqual(trouverPlat(carteDe(BASE, S, AUJ), 'foie gras')?.cle, 'entrees/foie-gras-de-canard-maison', 'un plat retiré de la carte n\'est plus proposé');
});
