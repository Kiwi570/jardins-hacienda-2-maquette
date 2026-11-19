/* L'API : une fonction « requête → réponse », sans cadre d'application. Le même code sert au serveur local (recette,
   tests) et à une fonction hébergée. Toute entrée est contrôlée ici ; les droits sont contrôlés dans le métier. */
import { Refus } from './erreurs.mjs';
import { connecter, compteDe, deconnecter, droitsDe, sha256 } from './auth.mjs';
import * as M from './metier.mjs';

const COOKIE = 'jh_session';
const lireCookie = (entetes) => (String(entetes.cookie || '').split(';').map((x) => x.trim().split('=')).find(([k]) => k === COOKIE) || [])[1] || '';
const poserCookie = (jeton, dureeS, securise) => `${COOKIE}=${jeton}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${dureeS}${securise ? '; Secure' : ''}`;

/**
 * @param {{ db: object, config?: { origines?: string[], securise?: boolean, livraison?: string, environnement?: string } }} o
 * @returns {(requete: { methode: string, chemin: string, requete?: object, entetes?: object, corps?: any, adresse?: string }) => Promise<{ statut: number, entetes: object, corps: any }>}
 */
export function creerApp({ db, config = {} }) {
  const limites = new Map(); /* demandes publiques : au plus 20 par adresse et par dix minutes */
  const tropVite = (adresse) => { const t = Date.now(), l = (limites.get(adresse) || []).filter((x) => t - x < 600000); l.push(t); limites.set(adresse, l); if (limites.size > 5000) limites.clear(); return l.length > 20; };

  const routes = [
    ['GET', /^\/api\/etat$/, async () => ({ ok: true, livraison: config.livraison || '', environnement: config.environnement || 'local', base: (await db.q('select count(*)::int n from migrations')).rows[0].n })],
    /* --- public : aucune lecture de réservation ni de client --- */
    ['GET', /^\/api\/public\/reglages$/, () => M.reglagesPublics(db)],
    ['GET', /^\/api\/public\/disponibilites$/, ({ requete }) => M.disponibilites(db, { date: requete.date, couverts: +requete.couverts || 2 })],
    ['POST', /^\/api\/public\/demandes$/, ({ corps, entetes, adresse }) => { if (tropVite(sha256(adresse || ''))) throw new Refus('TROP_DE_TENTATIVES', 'Trop de demandes : réessayez dans quelques minutes, ou appelez-nous.', 429); return M.creerDemande(db, corps, { cle: entetes['idempotency-key'] || '' }); }, 201],
    /* --- session --- */
    ['POST', /^\/api\/session$/, async ({ corps, adresse, reponse }) => { const s = await connecter(db, { email: corps?.email, motDePasse: corps?.motDePasse, origine: adresse }); reponse.entetes['set-cookie'] = poserCookie(s.jeton, s.dureeS, config.securise); return { compte: s.compte, droits: droitsDe(s.compte) }; }],
    ['GET', /^\/api\/session$/, ({ compte }) => { if (!compte) throw new Refus('NON_CONNECTE', 'Connectez-vous.', 401); return { compte, droits: droitsDe(compte) }; }],
    ['DELETE', /^\/api\/session$/, async ({ entetes, reponse }) => { await deconnecter(db, lireCookie(entetes)); reponse.entetes['set-cookie'] = poserCookie('', 0, config.securise); return { ok: true }; }],
    /* --- équipe --- */
    ['GET', /^\/api\/reservations$/, async ({ compte, requete }) => ({ reservations: await M.lister(db, compte, { du: requete.du, au: requete.au }) })],
    ['POST', /^\/api\/reservations$/, ({ compte, corps, entetes }) => M.creerParEquipe(db, compte, corps, { cle: entetes['idempotency-key'] || '' }), 201],
    ['PATCH', /^\/api\/reservations\/([0-9a-f-]{36})$/, ({ compte, corps, m }) => M.modifier(db, compte, m[1], { version: corps?.version, champs: corps?.champs || {} })],
    ['POST', /^\/api\/reservations\/([0-9a-f-]{36})\/statut$/, ({ compte, corps, m }) => M.changerStatut(db, compte, m[1], { statut: String(corps?.statut || ''), version: corps?.version, derogation: corps?.derogation || '' })],
    ['PUT', /^\/api\/reservations\/([0-9a-f-]{36})\/table$/, ({ compte, corps, m }) => M.placer(db, compte, m[1], { table: String(corps?.table || ''), version: corps?.version })],
    ['GET', /^\/api\/suivi$/, ({ compte, requete }) => M.suivre(db, compte, { depuis: requete.depuis })],
    ['GET', /^\/api\/reglages$/, ({ compte }) => M.lireReglesEquipe(db, compte)],
    ['POST', /^\/api\/reglages\/equipe$/, ({ compte, corps }) => M.changerRegles(db, compte, { version: corps?.version, operation: String(corps?.operation || ''), args: corps?.args || {} })],
    ['GET', /^\/api\/clients\/([0-9a-f-]{36})$/, ({ compte, m }) => M.lireClient(db, compte, m[1])],
    ['PATCH', /^\/api\/clients\/([0-9a-f-]{36})$/, ({ compte, corps, m }) => M.modifierClient(db, compte, m[1], { version: corps?.version, champs: corps?.champs || {} })],
    ['GET', /^\/api\/journal$/, async ({ compte, requete }) => ({ journal: await M.lireJournal(db, compte, { limite: requete.limite }) })],
  ];

  return async function traiter({ methode, chemin, requete = {}, entetes = {}, corps, adresse = '' }) {
    const reponse = { statut: 200, entetes: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }, corps: null };
    try {
      const route = routes.find(([m, re]) => m === methode && re.test(chemin));
      if (!route) throw new Refus('INTROUVABLE', 'Cette adresse n\'existe pas.', routes.some(([, re]) => re.test(chemin)) ? 405 : 404);
      if (methode !== 'GET') {
        /* Écritures : du JSON seulement, et depuis notre site (une page d'un autre site ne peut pas faire agir un compte connecté). */
        if (!/^application\/json\b/i.test(entetes['content-type'] || '')) throw new Refus('VALIDATION', 'Le contenu doit être du JSON.', 415);
        /* memeOrigine (fonction hébergée à la même adresse que le site) : l'origine doit être l'hôte de la requête elle-même. */
        const memeHote = () => { try { return new URL(entetes.origin).host === String(entetes['x-forwarded-host'] || entetes.host || ''); } catch { return false; } };
        if (entetes.origin && (config.memeOrigine ? !memeHote() && !(config.origines || []).includes(entetes.origin) : config.origines?.length && !config.origines.includes(entetes.origin))) throw new Refus('ORIGINE', 'Requête refusée.', 403);
        if (corps !== undefined && corps !== null && (typeof corps !== 'object' || Array.isArray(corps))) throw new Refus('VALIDATION', 'Le contenu doit être un objet JSON.', 422);
      }
      const compte = /^\/api\/public\//.test(chemin) ? null : await compteDe(db, lireCookie(entetes));
      reponse.corps = await route[2]({ compte, requete, entetes, corps, adresse, reponse, m: chemin.match(route[1]) });
      reponse.statut = route[3] && !reponse.corps?.deja ? route[3] : 200;
    } catch (e) {
      if (e instanceof Refus) { reponse.statut = e.statut; reponse.corps = { erreur: { code: e.code, message: e.message, details: e.details } }; }
      else { reponse.statut = 500; reponse.corps = { erreur: { code: 'SERVEUR', message: 'Le serveur a rencontré une erreur. Rien n\'a été enregistré.' } }; config.journalErreur?.(e); }
    }
    return reponse;
  };
}
