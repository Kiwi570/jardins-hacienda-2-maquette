/* Comptes de l'équipe : mots de passe hachés (scrypt), sessions par jeton opaque, limite de tentatives, droits. */
import { scrypt, randomBytes, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { Refus } from './erreurs.mjs';

const scryptP = promisify(scrypt), N = 16384, r = 8, p = 1;
export const sha256 = (t) => createHash('sha256').update(String(t)).digest('hex');

export async function hacher(motDePasse) {
  if (typeof motDePasse !== 'string' || motDePasse.length < 10) throw new Refus('VALIDATION', 'Le mot de passe doit faire au moins dix caractères.');
  const sel = randomBytes(16), h = await scryptP(motDePasse, sel, 32, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${sel.toString('base64')}$${h.toString('base64')}`;
}
export async function verifier(motDePasse, hache) {
  const [genre, n, rr, pp, sel, h] = String(hache).split('$'); if (genre !== 'scrypt') return false;
  const attendu = Buffer.from(h, 'base64'), obtenu = await scryptP(String(motDePasse), Buffer.from(sel, 'base64'), attendu.length, { N: +n, r: +rr, p: +pp });
  return attendu.length === obtenu.length && timingSafeEqual(attendu, obtenu);
}

const DUREE_SESSION_H = 12, TENTATIVES = 5, FENETRE_MIN = 15;

/** Vérifie l'identifiant et le mot de passe ; rend { jeton, compte } ou refuse. Cinq échecs en quinze minutes bloquent l'adresse. */
export async function connecter(db, { email, motDePasse, origine }) {
  const e = String(email || '').trim().toLowerCase(), o = sha256(origine || '');
  const rates = (await db.q(`select count(*)::int n from tentatives_connexion where email = $1 and not reussie and quand > now() - interval '${FENETRE_MIN} minutes'`, [e])).rows[0].n;
  if (rates >= TENTATIVES) throw new Refus('TROP_DE_TENTATIVES', 'Trop de tentatives : réessayez dans quelques minutes.', 429);
  const c = (await db.q('select id, email, nom, role, mot_de_passe, actif from comptes where email = $1', [e])).rows[0];
  /* Le même temps de calcul et la même réponse, que le compte existe ou non. */
  const bon = c ? await verifier(motDePasse, c.mot_de_passe) : (await verifier(motDePasse, 'scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='), false);
  await db.q('insert into tentatives_connexion (email, origine, reussie) values ($1, $2, $3)', [e, o, !!(bon && c.actif)]);
  if (!bon || !c.actif) throw new Refus('NON_CONNECTE', 'Identifiant ou mot de passe incorrect.', 401);
  const jeton = randomBytes(32).toString('base64url');
  await db.q(`insert into sessions (jeton_hache, compte_id, expire_le) values ($1, $2, now() + interval '${DUREE_SESSION_H} hours')`, [sha256(jeton), c.id]);
  await db.q('insert into journal (compte_id, role, action, cible, cible_id) values ($1, $2, $3, $4, $5)', [c.id, c.role, 'connexion', 'compte', c.id]);
  return { jeton, compte: { id: c.id, email: c.email, nom: c.nom, role: c.role }, dureeS: DUREE_SESSION_H * 3600 };
}
/** Le compte d'un jeton de session valide, ou null. */
export async function compteDe(db, jeton) {
  if (!jeton) return null;
  const s = (await db.q(`update sessions set vue_le = now() where jeton_hache = $1 and expire_le > now() returning compte_id`, [sha256(jeton)])).rows[0]; if (!s) return null;
  const c = (await db.q('select id, email, nom, role from comptes where id = $1 and actif', [s.compte_id])).rows[0];
  return c || null;
}
export const deconnecter = (db, jeton) => db.q('delete from sessions where jeton_hache = $1', [sha256(jeton || '')]);

/* Les droits, contrôlés ici et nulle part ailleurs. Le navigateur ne décide de rien. */
const DROITS = {
  'reservations:lire': ['direction', 'accueil'], 'reservations:ecrire': ['direction', 'accueil'], 'reservations:deroger': ['direction'],
  'clients:lire': ['direction', 'accueil'], 'clients:ecrire': ['direction', 'accueil'],
  'reglages:lire': ['direction', 'accueil', 'edition'], 'reglages:jour': ['direction', 'accueil'], 'reglages:semaine': ['direction'],
  'journal:lire': ['direction'], 'comptes:gerer': ['direction'],
};
export const peut = (compte, droit) => !!compte && (DROITS[droit] || []).includes(compte.role);
export function exiger(compte, droit) {
  if (!compte) throw new Refus('NON_CONNECTE', 'Connectez-vous.', 401);
  if (!peut(compte, droit)) throw new Refus('INTERDIT', 'Votre compte n\'a pas ce droit.', 403, { droit });
}
export const droitsDe = (compte) => Object.keys(DROITS).filter((d) => peut(compte, d));
