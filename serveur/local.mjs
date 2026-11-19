/* Le serveur de recette : l'API et le site, à la même adresse. Sert aussi aux tests dans le navigateur.
   Variables : DATABASE_URL (obligatoire), PORT (3000), JH_ORIGINE (http://localhost:PORT), JH_ENV (recette), JH_LIVRAISON.
   En recette et en production, c'est un hébergeur qui tient ce rôle : voir _exploitation/architecture.md. */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ouvrir, migrer } from './src/db.mjs';
import { creerApp } from './src/app.mjs';
import { versNoeud } from './src/noeud.mjs';

const ici = dirname(fileURLToPath(import.meta.url)), racine = join(ici, '..');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json' };
/* Jamais servis : les dossiers internes (comme .vercelignore), le serveur lui-même, les fichiers cachés. */
const INTERDITS = /^\/(?:_[^/]*|serveur|outils|source|donnees|recu|node_modules|\.[^/]*)(?:\/|$)/;

export async function demarrer({ url = process.env.DATABASE_URL, port = +process.env.PORT || 3000, origine, environnement = process.env.JH_ENV || 'recette', livraison = process.env.JH_LIVRAISON || '', silencieux = false } = {}) {
  if (!url) throw new Error('DATABASE_URL manque : voir serveur/.env.exemple');
  const db = ouvrir(url); await migrer(db, join(ici, 'migrations'));
  const app = creerApp({ db, config: { origines: [origine || process.env.JH_ORIGINE || `http://localhost:${port}`], securise: String(origine || process.env.JH_ORIGINE || '').startsWith('https://'), environnement, livraison, journalErreur: (e) => { if (!silencieux) console.error(e); } } });
  const api = versNoeud(app);
  const serveur = createServer(async (req, res) => {
    const u = new URL(req.url, 'http://x'), chemin = decodeURIComponent(u.pathname);
    if (chemin.startsWith('/api/')) { await api(req, res); return; }
    /* Le site statique, comme Vercel le sert (adresses sans .html). Les pages reçoivent l'adresse de l'API : mode connecté. */
    if (INTERDITS.test(chemin)) { res.writeHead(404).end('Introuvable'); return; }
    const base = normalize(join(racine, chemin)); if (!base.startsWith(racine)) { res.writeHead(403).end(); return; }
    for (const f of [base, `${base}.html`, join(base, 'index.html')]) {
      const s = await stat(f).catch(() => null); if (!s?.isFile()) continue;
      let contenu = await readFile(f); const type = TYPES[extname(f)] || 'application/octet-stream';
      /* Une page déjà construite en mode connecté (JH_API) garde ses propres balises. */
      if (type.startsWith('text/html') && !contenu.includes('name="jh-api"')) contenu = Buffer.from(contenu.toString('utf8').replace('<head>', `<head><meta name="jh-api" content="/api"><meta name="jh-environnement" content="${environnement}">`));
      res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' }).end(contenu); return;
    }
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' }).end(await readFile(join(racine, '404.html')).catch(() => 'Introuvable'));
  });
  await new Promise((ok) => serveur.listen(port, ok));
  return { port, db, arreter: async () => { await new Promise((ok) => serveur.close(ok)); serveur.closeAllConnections?.(); await db.fermer(); } };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const s = await demarrer(); console.log(`Les Jardins de l'Hacienda, recette : http://localhost:${s.port} (API sous /api)`);
}
