/* Le pont entre l'API (une fonction : `creerApp(...)`) et un serveur Node classique ou une fonction hébergée qui reçoit
   (req, res). Le serveur de recette (`local.mjs`) l'utilise ; un hébergeur l'utilisera de la même façon. */
const LIMITE = 20000; /* octets : une réservation tient en bien moins */

/** @param {Function} app la fonction rendue par creerApp
    @param {{ adresse?: (req) => string }} [o] adresse : d'où vient la requête (derrière un relais, l'en-tête qu'il pose)
    @returns {(req, res) => Promise<void>} */
export function versNoeud(app, { adresse = (req) => req.socket?.remoteAddress } = {}) {
  return async (req, res) => {
    const u = new URL(req.url, 'http://x'); let chemin = decodeURIComponent(u.pathname);
    /* Derrière une réécriture « /api/… → /api?__chemin=… », le chemin demandé arrive en paramètre. */
    if (u.searchParams.has('__chemin')) { if (!/^\/api\/.+/.test(chemin)) chemin = `/api/${u.searchParams.getAll('__chemin').join('/')}`; u.searchParams.delete('__chemin'); }
    let corps; try { corps = req.body; } catch { res.writeHead(400, { 'content-type': 'application/json' }).end(JSON.stringify({ erreur: { code: 'VALIDATION', message: 'JSON mal formé.' } })); return; } /* certains hébergeurs ont déjà lu et décodé le corps */
    if (corps === undefined) {
      let brut = ''; for await (const m of req) { brut += m; if (brut.length > LIMITE) { res.writeHead(413).end(); return; } }
      try { corps = brut ? JSON.parse(brut) : undefined; } catch { res.writeHead(400, { 'content-type': 'application/json' }).end(JSON.stringify({ erreur: { code: 'VALIDATION', message: 'JSON mal formé.' } })); return; }
    }
    try {
      const r = await app({ methode: req.method, chemin, requete: Object.fromEntries(u.searchParams), entetes: req.headers, corps, adresse: adresse(req) });
      res.writeHead(r.statut, r.entetes).end(JSON.stringify(r.corps));
    } catch { /* l'API rend elle-même ses erreurs ; ceci ne sert que si elle casse : jamais un succès par défaut */
      if (!res.headersSent) res.writeHead(500, { 'content-type': 'application/json' }); res.end(JSON.stringify({ erreur: { code: 'SERVEUR', message: 'Le serveur a rencontré une erreur : rien n\'a été enregistré.' } }));
    }
  };
}
