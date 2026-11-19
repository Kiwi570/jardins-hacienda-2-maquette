/* Crée ou met à jour un compte de l'équipe. Le mot de passe est lu dans la variable JH_MOT_DE_PASSE (jamais en argument,
   jamais dans un fichier du dépôt) :  JH_MOT_DE_PASSE='…' node outils/creer-compte.mjs regis@exemple.fr "Régis" direction */
import { ouvrir } from '../src/db.mjs';
import { hacher } from '../src/auth.mjs';
const [email, nom, role] = process.argv.slice(2), mdp = process.env.JH_MOT_DE_PASSE;
if (!process.env.DATABASE_URL || !email || !nom || !['direction', 'accueil', 'edition'].includes(role) || !mdp) { console.error('Usage : DATABASE_URL=… JH_MOT_DE_PASSE=… node outils/creer-compte.mjs email "Nom" direction|accueil|edition'); process.exit(1); }
const db = ouvrir(process.env.DATABASE_URL);
await db.q(`insert into comptes (email, nom, role, mot_de_passe) values ($1, $2, $3, $4) on conflict (email) do update set nom = excluded.nom, role = excluded.role, mot_de_passe = excluded.mot_de_passe, actif = true`, [email.toLowerCase(), nom, role, await hacher(mdp)]);
console.log(`Compte ${email.toLowerCase()} (${role}) en place.`); await db.fermer();
