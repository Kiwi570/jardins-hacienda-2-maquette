/* Dans une base vide et migrée :  DATABASE_URL=… node outils/restaurer.mjs fichier.json */
import { readFileSync } from 'node:fs';
import { ouvrir } from '../src/db.mjs';
import { restaurer } from '../src/sauvegarde.mjs';
const entree = process.argv[2]; if (!process.env.DATABASE_URL || !entree) { console.error('Usage : DATABASE_URL=… node outils/restaurer.mjs fichier.json'); process.exit(1); }
const db = ouvrir(process.env.DATABASE_URL), b = await restaurer(db, JSON.parse(readFileSync(entree, 'utf8')));
console.log('Restauré : ' + Object.entries(b).map(([t, n]) => `${t} ${n}`).join(', ')); await db.fermer();
