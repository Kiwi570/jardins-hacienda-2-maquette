/* Une pile de recette complète sur cette machine : PostgreSQL embarqué, base neuve, trois comptes d'essai, l'API et le site.
   Sert aux essais dans le navigateur. Rien n'en sort : la base est jetée à l'arrêt. */
import { demarrerPostgres, arreterPostgres, baseNeuve } from './outillage.mjs';
import { demarrer } from '../local.mjs';

export async function pile({ port = 4790 } = {}) {
  await demarrerPostgres();
  const base = await baseNeuve();
  let serveur = await demarrer({ url: base.url, port, environnement: 'recette', livraison: 'essai-navigateur', silencieux: true });
  return { adresse: `http://localhost:${port}`, base,
    /** Arrêter puis relancer le serveur sur la même base : ce qui était enregistré doit être encore là. */
    async relancer() { await serveur.arreter(); serveur = await demarrer({ url: base.url, port, environnement: 'recette', livraison: 'essai-navigateur', silencieux: true }); },
    async couper() { await serveur.arreter(); }, async reprendre() { serveur = await demarrer({ url: base.url, port, environnement: 'recette', livraison: 'essai-navigateur', silencieux: true }); },
    async arreter() { await serveur.arreter().catch(() => {}); await base.fermer().catch(() => {}); await arreterPostgres(); } };
}
if (process.argv[1]?.endsWith('pile.mjs')) { const p = await pile({ port: +process.argv[2] || 4790 }); console.log('PRET', p.adresse); process.on('SIGTERM', async () => { await p.arreter(); process.exit(0); }); }
