/* v7.16.1 · Cinq correctifs visibles relevés par l'audit de l'expérience. Ce sont des défauts d'affichage : ces tests
   lisent les fichiers pour empêcher leur retour ; la vérification à l'écran est dans les parcours de l'audit. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const lire = (f) => readFileSync(new URL(`../../${f}`, import.meta.url), 'utf8');
const CSS = lire('assets/css/site.css'), SITE = lire('assets/js/site.js'), ESPACE = lire('assets/js/espace.js'), PAGE = lire('source/pages/espace.mjs');
const regle = (selecteur) => { const i = CSS.indexOf(`${selecteur} {`); assert.ok(i >= 0, `règle absente : ${selecteur}`); return CSS.slice(i, CSS.indexOf('}', i) + 1); };

test('pied de page : le blanc entre deux mots ne porte plus le nom de classe de l\'espace restaurateur', () => {
  assert.doesNotMatch(SITE, /className\s*=\s*'espace'/, 'site.js ne doit plus poser la classe « espace » sur une lettre du pied de page');
  assert.match(SITE, /className\s*=\s*'pied2__blanc'/);
  const r = regle('.pied2__marque :is(.pied2__blanc, .espace)');
  for (const attendu of ['min-height: 0', 'padding: 0', 'background: none']) assert.ok(r.includes(attendu), `l'ancien nom reste neutralisé (${attendu})`);
});

test('pied de page : aucune autre page que /espace ne pose la classe « espace » dans son gabarit', () => {
  assert.equal((PAGE.match(/class="espace"/g) || []).length, 1, 'la classe « espace » n\'existe qu\'une fois, sur la section de l\'espace');
  assert.doesNotMatch(lire('source/gabarits/commun.mjs'), /class="[^"]*\bespace\b[^"]*"/, 'le gabarit commun ne réutilise pas ce nom');
});

test('tableau des réceptions : plus de cinq colonnes fixes, une colonne garde au moins 260 px', () => {
  const r = regle('.esp-rec-phases');
  assert.doesNotMatch(r, /repeat\(5/, 'cinq colonnes fixes donnaient 179 px par colonne');
  assert.match(r, /repeat\(auto-fill, minmax\(min\(260px, 100%\), 1fr\)\)/);
  assert.doesNotMatch(CSS, /\.esp-rec-phases \{ grid-template-columns: repeat\((3|5)/, 'aucune autre règle ne refixe le nombre de colonnes');
});

test('téléphone : le bouton flottant de recherche s\'efface quand « Plus » est ouvert', () => {
  const r = regle('.espace:has(.esp-plusnav:not([hidden])) .esp-fab');
  assert.ok(r.includes('opacity: 0') && r.includes('pointer-events: none'));
});

test('téléphone : toute la rubrique Agenda allume « Service », « Plus » ne s\'allume que pour Offres, Clients et Site', () => {
  const i = ESPACE.indexOf('function marquerNavMobile()'), corps = ESPACE.slice(i, ESPACE.indexOf('\n  }', i));
  assert.match(corps, /const service = etat\.vue === 'resas', plus = \['carte', 'clients', 'site'\]\.includes\(etat\.vue\);/);
  assert.doesNotMatch(corps, /ongletResas/, 'l\'onglet ouvert ne change plus l\'entrée allumée');
});

test('Site : l\'accès à la mise en main tient sur une ligne, et se réduit au lien seul au téléphone', () => {
  const m = ESPACE.match(/data-mise-acces>.*?<span>(.*?)<\/span>/);
  assert.ok(m && m[1].length <= 50, `l'explication reste courte (${m ? m[1].length : '?'} caractères)`);
  assert.match(CSS, /@media \(max-width: 760px\) \{\s*\.esp-mise__acces \{[^}]*border: 0;[^}]*\}\s*\.esp-mise__acces span \{ display: none; \}/);
});
