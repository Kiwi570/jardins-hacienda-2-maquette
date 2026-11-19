/* Outillage des tests du serveur : un vrai PostgreSQL (embarqué), une base neuve par test, l'API appelée comme le ferait
   un navigateur (cookies séparés par session). Rien n'est simulé côté base : transactions, verrous et contraintes sont réels. */
import EmbeddedPostgres from 'embedded-postgres';
import { rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ouvrir, migrer } from '../src/db.mjs';
import { creerApp } from '../src/app.mjs';
import { initialiser } from '../src/initialiser.mjs';
import { hacher } from '../src/auth.mjs';
import { maintenant } from '../src/metier.mjs';
import { ajouter, etatService } from '../../assets/js/disponibilites.js';

const ici = dirname(fileURLToPath(import.meta.url));
export const MOTS = { direction: 'direction-essai-2026', accueil: 'accueil-essai-2026', edition: 'edition-essai-2026' };
let pg = null, dossier = '', port = 0, n = 0;
const racineUrl = (base) => `postgres://hacienda:essai@localhost:${port}/${base}`;

export async function demarrerPostgres() {
  /* Le dossier n'est pas créé ici : PostgreSQL refuse de tourner sous le compte root et crée le sien sous son propre compte. */
  dossier = join(tmpdir(), `jh-pg-${process.pid}-${Date.now().toString(36)}`); port = 54400 + Math.floor(Math.random() * 400);
  pg = new EmbeddedPostgres({ databaseDir: dossier, user: 'hacienda', password: 'essai', port, persistent: false, createPostgresUser: true, onLog: () => {}, onError: () => {} });
  await pg.initialise(); await pg.start();
}
export async function arreterPostgres() { await pg?.stop().catch(() => {}); try { rmSync(dossier, { recursive: true, force: true }); } catch { /* rien */ } }

/** Une base neuve, migrée, avec les réglages de départ et trois comptes de test. */
export async function baseNeuve({ comptes = true, initialise = true } = {}) {
  const nom = `essai_${process.pid}_${++n}`, admin = ouvrir(racineUrl('postgres'), { max: 1 });
  await admin.q(`create database ${nom}`); await admin.fermer();
  const url = racineUrl(nom), db = ouvrir(url, { max: 12 });
  await migrer(db, join(ici, '..', 'migrations')); if (initialise) await initialiser(db);
  if (comptes) for (const role of Object.keys(MOTS)) await db.q('insert into comptes (email, nom, role, mot_de_passe) values ($1, $2, $3, $4)', [`${role}@essai.test`, `Compte ${role}`, role, await hacher(MOTS[role])]);
  const erreurs = [], app = creerApp({ db, config: { origines: ['http://essai.test'], environnement: 'test', livraison: 'essai', journalErreur: (e) => erreurs.push(e) } });
  /** Une session de navigateur : ses propres cookies, rien de partagé avec une autre. */
  const session = () => {
    let cookie = '';
    const appel = async (methode, chemin, { corps, cle, entetes = {} } = {}) => {
      const [c, q = ''] = chemin.split('?');
      const r = await app({ methode, chemin: c, requete: Object.fromEntries(new URLSearchParams(q)), corps, adresse: '203.0.113.7',
        entetes: { ...(methode === 'GET' ? {} : { 'content-type': 'application/json', origin: 'http://essai.test' }), ...(cookie ? { cookie } : {}), ...(cle ? { 'idempotency-key': cle } : {}), ...entetes } });
      const pose = r.entetes['set-cookie']; if (pose) cookie = pose.split(';')[0].endsWith('=') ? '' : pose.split(';')[0];
      return { statut: r.statut, corps: r.corps, entetes: r.entetes };
    };
    return { appel, connecter: (role) => appel('POST', '/api/session', { corps: { email: `${role}@essai.test`, motDePasse: MOTS[role] } }), cookie: () => cookie };
  };
  return { db, url, app, session, erreurs, fermer: () => db.fermer() };
}

/* Des jours utiles, calculés depuis aujourd'hui à Moineville (les tests ne dépendent pas d'une date écrite en dur). */
export const AUJ = maintenant().iso;
const R = JSON.parse((await import('node:fs')).readFileSync(join(ici, '..', '..', 'donnees', 'reservation.json'), 'utf8'));
export const prochain = (jourSemaine, service, apres = 2) => Array.from({ length: 40 }, (_, k) => ajouter(AUJ, k + apres)).find((iso) => new Date(`${iso}T12:00:00Z`).getUTCDay() === jourSemaine && etatService(R, iso, service).ouvert);
export const VENDREDI = prochain(5, 'soir'), SAMEDI = prochain(6, 'soir'), MERCREDI = prochain(3, 'midi'), LUNDI = Array.from({ length: 10 }, (_, k) => ajouter(AUJ, k + 2)).find((iso) => new Date(`${iso}T12:00:00Z`).getUTCDay() === 1);
export const demande = (plus = {}) => ({ date: VENDREDI, service: 'soir', heure: '20:00', couverts: 2, prenom: 'Claire', nom: 'Essai', telephone: '06 12 34 56 78', email: 'claire@exemple.fr', ...plus });
