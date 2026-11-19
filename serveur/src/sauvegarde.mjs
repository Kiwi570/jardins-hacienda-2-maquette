/* Sauvegarde et restauration logiques : toutes les données, dans un fichier JSON daté, avec le nombre de lignes et une
   empreinte par table. La restauration se fait dans une base vide déjà migrée, en une transaction : tout ou rien.
   Chez un hébergeur de base, ses sauvegardes automatiques et pg_dump restent la première ligne ; ceci est la sauvegarde
   que le restaurant peut garder lui-même et dont la restauration est essayée par les tests. */
import { createHash } from 'node:crypto';
const TABLES = ['comptes', 'reglages', 'tables_salle', 'clients', 'reservations', 'affectations', 'idempotence', 'journal', 'suivi'];
const empreinte = (lignes) => createHash('sha256').update(JSON.stringify(lignes)).digest('hex');

export async function sauvegarder(db) {
  return db.transaction(async (c) => {
    await c.query('set transaction isolation level repeatable read read only');
    const migrations = (await c.query('select nom, empreinte from migrations order by nom')).rows, tables = {};
    for (const t of TABLES) { const lignes = (await c.query(`select row_to_json(x)::text as l from (select * from ${t}) x order by 1`)).rows.map((r) => r.l); tables[t] = { lignes, nombre: lignes.length, empreinte: empreinte(lignes) }; }
    return { genre: 'sauvegarde-jardins-hacienda', faite_le: new Date().toISOString(), migrations, tables };
  });
}
export async function restaurer(db, s) {
  if (s?.genre !== 'sauvegarde-jardins-hacienda') throw new Error('Ce fichier n\'est pas une sauvegarde.');
  const ici = (await db.q('select nom, empreinte from migrations order by nom')).rows;
  if (JSON.stringify(ici) !== JSON.stringify(s.migrations)) throw new Error('La base n\'est pas au même niveau de migration que la sauvegarde : appliquer d\'abord les mêmes migrations.');
  return db.transaction(async (c) => {
    for (const t of TABLES) if ((await c.query(`select count(*)::int n from ${t}`)).rows[0].n) { if (!['reglages', 'tables_salle'].includes(t)) throw new Error(`La table ${t} n'est pas vide : on ne restaure que dans une base vide.`); await c.query(`delete from ${t}`); }
    const bilan = {};
    for (const t of TABLES) {
      const { lignes, nombre, empreinte: e } = s.tables[t]; if (empreinte(lignes) !== e || lignes.length !== nombre) throw new Error(`La sauvegarde de ${t} est abîmée.`);
      for (const l of lignes) await c.query(`insert into ${t} select * from json_populate_record(null::${t}, $1::json)`, [l]);
      bilan[t] = nombre;
    }
    await c.query(`select setval('changements', greatest((select coalesce(max(numero), 0) from suivi), 1))`);
    await c.query(`select setval(pg_get_serial_sequence('journal', 'id'), greatest((select coalesce(max(id), 0) from journal), 1))`);
    return bilan;
  });
}
