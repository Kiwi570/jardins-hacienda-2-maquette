/* Applique les migrations qui manquent, puis pose les réglages et les tables de départ s'ils n'existent pas. */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ouvrir, migrer } from '../src/db.mjs';
import { initialiser } from '../src/initialiser.mjs';
if (!process.env.DATABASE_URL) { console.error('DATABASE_URL manque : voir serveur/.env.exemple'); process.exit(1); }
const db = ouvrir(process.env.DATABASE_URL);
const faites = await migrer(db, join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations'));
console.log(faites.length ? `Migrations appliquées : ${faites.join(', ')}` : 'Base déjà à jour.');
const i = await initialiser(db); console.log(`Réglages et ${i.tables} tables en place (valeurs de départ, à valider).`);
await db.fermer();
