/* L'API comme fonction hébergée (une fonction (req, res), à la même adresse que le site : /api/…).
   Au premier appel d'une instance : connexion à la base, migrations manquantes, réglages de départ s'ils n'existent
   pas (jamais de réservation ni de client d'exemple). Si cette préparation échoue, rien n'est servi et l'appel
   suivant réessaie : jamais de réponse « réussie » sans base.
   Variables lues : DATABASE_URL (secret, posé par l'hébergeur de la base), JH_ENV, JH_ORIGINE, JH_LIVRAISON. */
import { ouvrir, migrer } from '../src/db.mjs';
import { creerApp } from '../src/app.mjs';
import { versNoeud } from '../src/noeud.mjs';
import { initialiser } from '../src/initialiser.mjs';

/** @param {{ migrations: { nom: string, sql: string }[], donnees: { reservation: object, horaires: object, salle: object }, env?: object }} o */
export function creerFonction({ migrations, donnees, env = process.env }) {
  let pret = null;
  const preparer = () => (pret ||= (async () => {
    if (!env.DATABASE_URL) throw new Error('DATABASE_URL manque');
    const db = ouvrir(env.DATABASE_URL, { max: 3 });
    await migrer(db, migrations); await initialiser(db, donnees);
    const app = creerApp({ db, config: { memeOrigine: true, origines: env.JH_ORIGINE ? [env.JH_ORIGINE] : [], securise: true, environnement: env.JH_ENV || 'recette',
      livraison: env.JH_LIVRAISON || String(env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7), journalErreur: (e) => console.error(e?.message || e) } });
    /* Derrière le relais de l'hébergeur, l'adresse du visiteur est dans l'en-tête qu'il pose. */
    return versNoeud(app, { adresse: (req) => String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress });
  })().catch((e) => { pret = null; throw e; }));
  return async (req, res) => {
    let traiter;
    try { traiter = await preparer(); }
    catch (e) { console.error('API indisponible :', e?.message || e); res.writeHead(503, { 'content-type': 'application/json' }).end(JSON.stringify({ erreur: { code: 'SERVEUR', message: 'Le service de réservation ne répond pas : rien n\'a été enregistré.' } })); return; }
    return traiter(req, res);
  };
}
