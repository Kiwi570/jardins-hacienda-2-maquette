/* Une pile de recette complète sur cette machine : PostgreSQL embarqué, base neuve, trois comptes d'essai, l'API et le site.
   Sert aux essais dans le navigateur. Rien n'en sort : la base est jetée à l'arrêt. */
import { demarrerPostgres, arreterPostgres, baseNeuve } from './outillage.mjs';
import { pathToFileURL } from 'node:url';
import { demarrer } from '../local.mjs';

/** `fonction` : chemin de la fonction hébergée construite (api/index.mjs). L'API est alors servie par elle, appelée
    comme chez l'hébergeur : chemin réécrit en « /api?__chemin=… », en-têtes du relais posés. */
export async function pile({ port = 4790, fonction = '' } = {}) {
  await demarrerPostgres();
  const base = await baseNeuve();
  let gestionnaire = null;
  if (fonction) {
    process.env.DATABASE_URL = base.url; process.env.JH_ENV = 'recette'; process.env.JH_LIVRAISON = 'essai-fonction';
    const f = (await import(pathToFileURL(fonction).href)).default;
    gestionnaire = (req, res) => { const u = new URL(req.url, 'http://x'), reste = u.pathname.replace(/^\/api\//, ''); u.searchParams.set('__chemin', reste);
      req.url = `/api?${u.searchParams}`; req.headers['x-forwarded-host'] = req.headers.host; req.headers['x-forwarded-for'] = '203.0.113.9'; return f(req, res); };
  }
  const lancer = () => demarrer({ url: base.url, port, environnement: 'recette', livraison: 'essai-navigateur', silencieux: true, gestionnaire });
  let serveur = await lancer();
  return { adresse: `http://localhost:${port}`, base,
    /** Arrêter puis relancer le serveur sur la même base : ce qui était enregistré doit être encore là. */
    async couper() { await serveur.arreter(); }, async reprendre() { serveur = await lancer(); },
    async arreter() { await serveur.arreter().catch(() => {}); await base.fermer().catch(() => {}); await arreterPostgres(); } };
}
if (process.argv[1]?.endsWith('pile.mjs')) { const p = await pile({ port: +process.argv[2] || 4790, fonction: process.env.JH_FONCTION || '' }); console.log('PRET', p.adresse); process.on('SIGTERM', async () => { await p.arreter(); process.exit(0); }); }
