/* La base PostgreSQL : connexion, transactions, migrations versionnées. */
import pg from 'pg';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

pg.types.setTypeParser(1082, (v) => v);          /* date : « 2026-11-20 », jamais un instant décalé par un fuseau */
pg.types.setTypeParser(20, (v) => Number(v));     /* bigint : nombre */

export function ouvrir(url, { max = 10 } = {}) {
  const pool = new pg.Pool({ connectionString: url, max });
  pool.on('error', () => {});
  return {
    pool,
    q: (texte, params) => pool.query(texte, params),
    /** Exécute f dans une transaction ; tout réussit ou rien n'est écrit. */
    async transaction(f) {
      const c = await pool.connect();
      try { await c.query('begin'); const r = await f(c); await c.query('commit'); return r; }
      catch (e) { await c.query('rollback').catch(() => {}); throw e; }
      finally { c.release(); }
    },
    fermer: () => pool.end(),
  };
}

/** Applique les migrations qui manquent, dans l'ordre de leur nom ; chacune dans sa transaction. Rend celles appliquées. */
export async function migrer(db, dossier) {
  await db.q('create table if not exists migrations (nom text primary key, empreinte text not null, appliquee_le timestamptz not null default now())');
  const faites = new Map((await db.q('select nom, empreinte from migrations')).rows.map((r) => [r.nom, r.empreinte])), appliquees = [];
  for (const nom of readdirSync(dossier).filter((f) => f.endsWith('.sql')).sort()) {
    const sql = readFileSync(join(dossier, nom), 'utf8'), empreinte = createHash('sha256').update(sql).digest('hex');
    if (faites.has(nom)) { if (faites.get(nom) !== empreinte) throw new Error(`La migration ${nom} a changé depuis son application : écrire une nouvelle migration au lieu de modifier celle-ci.`); continue; }
    await db.transaction(async (c) => { await c.query(sql); await c.query('insert into migrations (nom, empreinte) values ($1, $2)', [nom, empreinte]); });
    appliquees.push(nom);
  }
  return appliquees;
}
