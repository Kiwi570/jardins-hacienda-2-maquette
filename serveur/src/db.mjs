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

/** Applique les migrations qui manquent, dans l'ordre de leur nom ; chacune dans sa transaction. Rend celles appliquées.
    `source` : un dossier de fichiers .sql, ou une liste [{ nom, sql }] (fonction hébergée : les fichiers sont embarqués). */
export async function migrer(db, source) {
  const liste = Array.isArray(source) ? [...source].sort((a, b) => a.nom.localeCompare(b.nom)) : readdirSync(source).filter((f) => f.endsWith('.sql')).sort().map((nom) => ({ nom, sql: readFileSync(join(source, nom), 'utf8') }));
  await db.q('create table if not exists migrations (nom text primary key, empreinte text not null, appliquee_le timestamptz not null default now())');
  const faites = new Map((await db.q('select nom, empreinte from migrations')).rows.map((r) => [r.nom, r.empreinte])), appliquees = [];
  for (const { nom, sql } of liste) {
    const empreinte = createHash('sha256').update(sql).digest('hex');
    if (faites.has(nom)) { if (faites.get(nom) !== empreinte) throw new Error(`La migration ${nom} a changé depuis son application : écrire une nouvelle migration au lieu de modifier celle-ci.`); continue; }
    /* Deux démarrages au même instant (deux instances d'une fonction hébergée) : un verrou, et l'on revérifie une fois dedans. */
    const faite = await db.transaction(async (c) => { await c.query('select pg_advisory_xact_lock(779001)'); if ((await c.query('select 1 from migrations where nom = $1', [nom])).rowCount) return false;
      await c.query(sql); await c.query('insert into migrations (nom, empreinte) values ($1, $2)', [nom, empreinte]); return true; });
    if (faite) appliquees.push(nom);
  }
  return appliquees;
}
