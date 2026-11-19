/* DATABASE_URL=… node outils/sauvegarder.mjs sauvegardes/2026-11-19.json   (le dossier de sortie ne doit pas être dans le dépôt) */
import { writeFileSync } from 'node:fs';
import { ouvrir } from '../src/db.mjs';
import { sauvegarder } from '../src/sauvegarde.mjs';
const sortie = process.argv[2]; if (!process.env.DATABASE_URL || !sortie) { console.error('Usage : DATABASE_URL=… node outils/sauvegarder.mjs fichier.json'); process.exit(1); }
const db = ouvrir(process.env.DATABASE_URL), s = await sauvegarder(db); writeFileSync(sortie, JSON.stringify(s));
console.log(Object.entries(s.tables).map(([t, v]) => `${t} : ${v.nombre}`).join(', ')); await db.fermer();
