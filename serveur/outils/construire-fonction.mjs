/* Construit la fonction hébergée en un seul fichier (code de l'API, pilote PostgreSQL, migrations et réglages de
   départ embarqués) :  node outils/construire-fonction.mjs ../api/index.mjs
   Le fichier produit ne contient aucun secret : l'adresse de la base est lue à l'exécution, chez l'hébergeur. */
import { build } from 'esbuild';
import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ici = dirname(fileURLToPath(import.meta.url)), serveur = join(ici, '..'), racine = join(serveur, '..');
const sortie = resolve(process.argv[2] || join(racine, 'api', 'index.mjs'));
const migrations = readdirSync(join(serveur, 'migrations')).filter((f) => f.endsWith('.sql')).sort().map((nom) => ({ nom, sql: readFileSync(join(serveur, 'migrations', nom), 'utf8') }));
const lire = (f) => JSON.parse(readFileSync(join(racine, 'donnees', f), 'utf8'));
const donnees = { reservation: lire('reservation.json'), horaires: lire('horaires.json'), salle: lire('salle.json') };
const entree = join(serveur, 'hebergement', '.entree.mjs');
writeFileSync(entree, `import { creerFonction } from './fonction.mjs';\nexport default creerFonction({ migrations: ${JSON.stringify(migrations)}, donnees: ${JSON.stringify(donnees)} });\n`);
mkdirSync(dirname(sortie), { recursive: true });
try {
  await build({ entryPoints: [entree], outfile: sortie, bundle: true, platform: 'node', format: 'esm', target: 'node22', legalComments: 'none', logLevel: 'warning',
    external: ['pg-native', 'pg-cloudflare'], /* pilotes facultatifs, jamais utilisés ici */
    banner: { js: "/* Fichier construit par serveur/outils/construire-fonction.mjs : ne pas modifier à la main. */\nimport { createRequire as __jhRequire } from 'node:module'; const require = __jhRequire(import.meta.url);" } });
} finally { rmSync(entree, { force: true }); }
const taille = readFileSync(sortie).length;
console.log(`${sortie} : ${(taille / 1024).toFixed(0)} Ko, ${migrations.length} migration(s) embarquée(s).`);
