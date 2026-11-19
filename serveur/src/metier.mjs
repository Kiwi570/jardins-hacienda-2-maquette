/* Les opérations de réservation, côté serveur. Le navigateur ne décide plus seul : disponibilités, acceptation,
   affectation d'une table, droits et changements de statut sont décidés ici, dans une transaction.
   Les règles de disponibilité sont celles du site (assets/js/disponibilites.js) : le même fichier, les mêmes données. */
import { createHash, randomInt } from 'node:crypto';
import { faisabilite, etatService, arrivees, servicesDe, enMin, hhmm, ajouter, dateValide } from '../../assets/js/disponibilites.js';
import { Refus, CODE_RAISON } from './erreurs.mjs';
import { exiger, peut } from './auth.mjs';

/* ---------- Temps : le jour et l'heure de Moineville ---------- */
export function maintenant(date = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date).map((x) => [x.type, x.value]));
  return { iso: `${p.year}-${p.month}-${p.day}`, min: +p.hour * 60 + +p.minute };
}

/* ---------- Réglages : ceux du site et ce que l'équipe a changé, lus ensemble par le moteur commun ---------- */
export async function lireRegles(c) {
  const l = (await c.query(`select cle, valeur, version from reglages where cle in ('reservation', 'equipe')`)).rows, de = (k) => l.find((x) => x.cle === k);
  const base = de('reservation'); if (!base) throw new Refus('SERVEUR', 'Les réglages de la réservation ne sont pas initialisés.', 500);
  const equipe = de('equipe') || { valeur: {}, version: 0 };
  return { R: { ...base.valeur, equipe: equipe.valeur }, versionEquipe: equipe.version, versionReservation: base.version };
}
const dureeDe = (R, sv) => Math.max(15, +(R.durees?.[sv] ?? 120) || 120);
const capaciteEquipe = (R) => Math.max(1, +(R.couverts_max_equipe ?? 60) || 60);

/* ---------- Entrées : rien de ce que le navigateur envoie n'est cru sans contrôle ---------- */
const texte = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
/** Un téléphone sous forme internationale (+33612345678), ou null si on ne peut pas le lire sans deviner. */
export function normaliserTelephone(t) {
  const s = String(t || '').trim(), c = s.replace(/[^\d+]/g, '');
  if (/^\+\d{8,15}$/.test(c)) return c;
  if (/^00\d{8,15}$/.test(c)) return `+${c.slice(2)}`;
  if (/^0[1-9]\d{8}$/.test(c)) return `+33${c.slice(1)}`;   /* numéro français à dix chiffres */
  return null;
}
function lireEntree(e, R) {
  const x = e && typeof e === 'object' ? e : {};
  const date = texte(x.date, 10), service = texte(x.service, 12), heure = texte(x.heure, 5), couverts = Number(x.couverts);
  if (!dateValide(date)) throw new Refus('DATE', 'Cette date n\'existe pas.', 422, { champ: 'date' });
  if (!servicesDe(R).some((s) => s.id === service)) throw new Refus('VALIDATION', 'Ce service n\'existe pas.', 422, { champ: 'service' });
  if (!/^\d{2}:\d{2}$/.test(heure) || enMin(heure) > 1439 || +heure.slice(3) > 59) throw new Refus('HEURE', 'Cette heure n\'existe pas.', 422, { champ: 'heure' });
  if (!Number.isInteger(couverts)) throw new Refus('COUVERTS', 'Le nombre de couverts doit être un nombre entier.', 422, { champ: 'couverts' });
  const email = texte(x.email, 120).toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw new Refus('VALIDATION', 'Adresse e-mail à vérifier.', 422, { champ: 'email' });
  return { date, service, heure, couverts, nom: texte(x.nom, 80), prenom: texte(x.prenom, 80), telephone: texte(x.telephone, 30), email,
    espaceSouhaite: texte(x.espace ?? x.espaceSouhaite, 20), tableSouhaitee: texte(x.table ?? x.tableSouhaitee, 8), noteClient: texte(x.message ?? x.noteClient ?? x.demande, 500), noteEquipe: texte(x.noteEquipe, 500) };
}
/** Refuse si le moteur commun dit non ; rend son avis (alerte « complet » pour l'équipe). */
function verifier(R, r, { public: pub, auj, minute }) {
  const v = faisabilite(R, r, { auj, minute, public: pub, couvertsMax: pub ? undefined : capaciteEquipe(R) });
  if (!v.ok) throw new Refus(CODE_RAISON[v.raison] || 'VALIDATION', v.message, 422, { raison: v.raison, propositions: v.propositions });
  return v;
}

/* ---------- Vue d'une réservation, journal, suivi des changements ---------- */
const COLONNES = `r.id, r.reference, r.origine, r.statut, r.jour, r.service, r.heure_min, r.duree_min, r.couverts, r.client_id, r.nom, r.prenom, r.telephone, r.email,
  r.espace_souhaite, r.table_souhaitee, r.note_client, r.note_equipe, r.derogation, r.version, r.cree_le, r.modifie_le, a.table_id, a.genre`;
const DE = 'from reservations r left join affectations a on a.reservation_id = r.id';
export const vue = (r) => ({ id: r.id, reference: r.reference, origine: r.origine, statut: r.statut, date: r.jour, service: r.service, heure: hhmm(r.heure_min), dureeMin: r.duree_min, couverts: r.couverts,
  clientId: r.client_id, nom: r.nom, prenom: r.prenom, telephone: r.telephone, email: r.email, espaceSouhaite: r.espace_souhaite, tableSouhaitee: r.table_souhaitee,
  noteClient: r.note_client, noteEquipe: r.note_equipe, derogation: r.derogation, version: r.version, creeLe: r.cree_le, modifieLe: r.modifie_le,
  /* table : l'affectation effective ; placement : 'placement' si l'équipe l'a choisie, 'technique' si le serveur l'a retenue pour garantir la capacité (« à placer »). */
  table: r.table_id || '', placement: r.genre || '' });
const lireResa = async (c, id, verrou = '') => (await c.query(`select ${COLONNES} ${DE} where r.id = $1 ${verrou}`, [id])).rows[0];
async function tracer(c, compte, action, cible, id, detail = {}) {
  await c.query('insert into journal (compte_id, role, action, cible, cible_id, detail) values ($1, $2, $3, $4, $5, $6)', [compte?.id || null, compte?.role || 'public', action, cible, String(id), detail]);
  await c.query('insert into suivi (quoi, id) values ($1, $2)', [cible, String(id)]);
}

/* ---------- Capacité : une table affectée à chaque réservation qui engage le restaurant ---------- */
const ACTIFS = ['confirmee', 'arrivee'];
const verrouJour = (c, jour) => c.query('select pg_advisory_xact_lock(hashtext($1))', [`jour:${jour}`]);
const mois = (jour) => +String(jour).slice(5, 7);
async function tablesLibres(c, r) {
  return (await c.query(`select t.id, t.zone, t.places from tables_salle t
    where t.active and (t.saison is null or t.saison @> $1::int) and t.places >= $2
      and not exists (select 1 from affectations a where a.table_id = t.id and a.jour = $3 and a.plage && int4range($4, $5) and a.reservation_id <> $6)
    order by t.places, t.id`, [mois(r.jour), r.couverts, r.jour, r.heure_min, r.heure_min + r.duree_min, r.id])).rows;
}
/**
 * Retient une table pour la réservation, ou refuse. `table` : celle que l'équipe choisit (placement) ; sinon le
 * serveur retient la plus petite table libre qui suffit (affectation technique : la réservation reste « à placer »).
 * La contrainte d'exclusion de la base interdit que deux affectations se chevauchent, quoi qu'il arrive.
 */
async function affecter(c, r, { table = '', garder = '' } = {}) {
  await c.query('delete from affectations where reservation_id = $1', [r.id]);
  const poser = async (id, genre) => {
    await c.query('savepoint affectation');
    try { await c.query('insert into affectations (reservation_id, table_id, jour, plage, genre) values ($1, $2, $3, int4range($4, $5), $6)', [r.id, id, r.jour, r.heure_min, r.heure_min + r.duree_min, genre]); await c.query('release savepoint affectation'); return true; }
    catch (e) { await c.query('rollback to savepoint affectation'); if (e.code === '23P01') return false; throw e; }
  };
  if (table) {
    const t = (await c.query('select id, places, active, saison @> $2::int as saison_ok, saison is null as toute_annee from tables_salle where id = $1', [table, mois(r.jour)])).rows[0];
    if (!t || !t.active) throw new Refus('VALIDATION', `La table ${table} n'est pas sur le plan.`, 422, { champ: 'table' });
    if (!t.toute_annee && !t.saison_ok) throw new Refus('TABLE_PRISE', 'Cette table est fermée hors saison.', 409, { table });
    if (await poser(table, 'placement')) return { table, placement: 'placement' };
    const genes = (await c.query(`select a.genre, ${COLONNES} ${DE.replace('left join', 'join')} where a.table_id = $1 and a.jour = $2 and a.plage && int4range($3, $4) and a.reservation_id <> $5`, [table, r.jour, r.heure_min, r.heure_min + r.duree_min, r.id])).rows;
    /* La table n'était que retenue par le serveur pour d'autres réservations (pas choisie par l'équipe) : elles sont
       déplacées vers une autre table libre, dans la même transaction. Si l'une n'a nulle part où aller, rien ne change. */
    if (genes.length && genes.every((g) => g.genre === 'technique')) {
      await c.query('delete from affectations where reservation_id = any($1::uuid[])', [genes.map((g) => g.id)]);
      if (await poser(table, 'placement')) {
        for (const g of genes) { try { await affecter(c, g); } catch (e) { if (e instanceof Refus && e.code === 'CAPACITE') throw new Refus('CAPACITE', `Placer cette réservation à la table ${table} ne laisserait plus de table à ${g.nom || 'une autre réservation'} (${hhmm(g.heure_min)}).`, 409, { table }); throw e; } }
        return { table, placement: 'placement' };
      }
    }
    const o = genes.find((g) => g.genre === 'placement') || genes[0];
    throw new Refus('TABLE_PRISE', `La table ${table} est prise à cette heure-là${o ? ` (${o.nom || 'une autre réservation'}, ${hhmm(o.heure_min)})` : ''}.`, 409, { table });
  }
  const libres = await tablesLibres(c, r), terrasse = r.espace_souhaite === 'terrasse';
  const ordre = [...libres.filter((t) => t.id === garder), ...libres.filter((t) => t.id !== garder && (t.zone === 'terrasse') === terrasse), ...libres.filter((t) => t.id !== garder && (t.zone === 'terrasse') !== terrasse)];
  for (const t of ordre) if (await poser(t.id, t.id === garder ? 'placement' : 'technique')) return { table: t.id, placement: t.id === garder ? 'placement' : 'technique' };
  throw new Refus('CAPACITE', 'Aucune table ne peut accueillir cette réservation à cette heure-là.', 409, { couverts: r.couverts });
}

/* ---------- Clients : un identifiant durable ; le téléphone normalisé rapproche, jamais le nom seul ---------- */
async function clientPour(c, e) {
  const tel = normaliserTelephone(e.telephone);
  if (tel) return (await c.query(`insert into clients (nom, prenom, telephone, telephone_saisi, email) values ($1, $2, $3, $4, nullif($5, ''))
    on conflict (telephone) where telephone is not null do update set modifie_le = clients.modifie_le returning id`, [e.nom, e.prenom, tel, e.telephone, e.email])).rows[0].id;
  if (!e.nom && !e.prenom) return null;
  return (await c.query(`insert into clients (nom, prenom, telephone_saisi, email) values ($1, $2, $3, nullif($4, '')) returning id`, [e.nom, e.prenom, e.telephone, e.email])).rows[0].id;
}
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const reference = (jour) => `R-${jour.slice(2, 4)}${jour.slice(5, 7)}${jour.slice(8, 10)}-${Array.from({ length: 5 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')}`;
async function inserer(c, e, R, { origine, statut, compte }) {
  for (let essai = 0; ; essai++) {
    await c.query('savepoint reference');
    try {
      const r = (await c.query(`insert into reservations (reference, origine, statut, jour, service, heure_min, duree_min, couverts, client_id, nom, prenom, telephone, email, espace_souhaite, table_souhaitee, note_client, note_equipe, cree_par)
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) returning id`,
        [reference(e.date), origine, statut, e.date, e.service, enMin(e.heure), dureeDe(R, e.service), e.couverts, await clientPour(c, e), e.nom, e.prenom, e.telephone, e.email, e.espaceSouhaite, e.tableSouhaitee, e.noteClient, e.noteEquipe, compte?.id || null])).rows[0];
      await c.query('release savepoint reference'); return r.id;
    } catch (err) { await c.query('rollback to savepoint reference'); if (err.code !== '23505' || essai > 5) throw err; }
  }
}
/** Une même clé rend la même réservation (double clic, reprise réseau) ; la même clé avec un autre contenu est refusée. */
async function dejaFaite(c, cle, contenu) {
  if (!cle) return null;
  if (!/^[A-Za-z0-9_-]{8,80}$/.test(cle)) throw new Refus('VALIDATION', 'Clé de requête mal formée.', 422, { champ: 'Idempotency-Key' });
  const empreinte = createHash('sha256').update(JSON.stringify(contenu)).digest('hex');
  const pris = (await c.query('insert into idempotence (cle, empreinte) values ($1, $2) on conflict (cle) do nothing returning cle', [cle, empreinte])).rows[0];
  if (pris) return { nouvelle: true };
  const ex = (await c.query('select empreinte, reservation_id from idempotence where cle = $1', [cle])).rows[0];
  if (ex.empreinte !== empreinte) throw new Refus('IDEMPOTENCE', 'Cette demande a déjà été envoyée avec un autre contenu.', 409);
  return { nouvelle: false, id: ex.reservation_id };
}

/* ---------- Le public : une demande, validée par le serveur, qui ne retient aucune table ---------- */
export async function creerDemande(db, entree, { cle = '' } = {}) {
  return db.transaction(async (c) => {
    const { R } = await lireRegles(c), e = lireEntree(entree, R), n = maintenant();
    if (!e.nom || !e.telephone) throw new Refus('VALIDATION', 'Indiquez un nom et un téléphone.', 422, { champ: e.nom ? 'telephone' : 'nom' });
    const deja = await dejaFaite(c, cle, e);
    if (deja && !deja.nouvelle) { const r = await lireResa(c, deja.id); return { reference: r.reference, statut: r.statut, deja: true }; }
    verifier(R, e, { public: true, auj: n.iso, minute: n.min });
    const id = await inserer(c, e, R, { origine: 'site', statut: 'demande' });
    if (cle) await c.query('update idempotence set reservation_id = $2 where cle = $1', [cle, id]);
    await tracer(c, null, 'demande', 'reservation', id, { origine: 'site' });
    const r = await lireResa(c, id);
    /* Le public ne reçoit que sa référence et son statut : une demande, pas une table garantie. */
    return { reference: r.reference, statut: 'demande', deja: false };
  });
}
/** Ce que le site public peut lire : les réglages et l'état des services d'un jour. Aucune réservation, aucun client. */
export async function disponibilites(db, { date, couverts = 2 }) {
  const { R } = await lireRegles(db.pool), n = maintenant();
  if (!dateValide(date)) throw new Refus('DATE', 'Cette date n\'existe pas.', 422);
  return { date, services: servicesDe(R).map((s) => { const e = etatService(R, date, s.id);
    return { id: s.id, libelle: s.libelle, ouvert: e.ouvert, complet: e.complet, motif: e.motif, exceptionnel: e.exceptionnel,
      heures: arrivees(R, date, s.id).filter((t) => faisabilite(R, { date, service: s.id, heure: t, couverts }, { auj: n.iso, minute: n.min, public: true }).ok) }; }) };
}
/** Ce que le site public a le droit de savoir : les règles, et les places de chaque table (pour le plan). Aucune réservation, aucun client. */
export async function reglagesPublics(db) {
  const { R } = await lireRegles(db.pool), t = (await db.q('select id, places from tables_salle where active order by id')).rows;
  return { ...R, tables: Object.fromEntries(t.map((x) => [x.id, x.places])) };
}

/* ---------- L'équipe ---------- */
export async function lister(db, compte, { du, au }) {
  exiger(compte, 'reservations:lire');
  if (!dateValide(du) || !dateValide(au) || au < du || au > ajouter(du, 400)) throw new Refus('VALIDATION', 'Période mal formée.', 422);
  return (await db.q(`select ${COLONNES} ${DE} where r.jour between $1 and $2 order by r.jour, r.heure_min, r.cree_le`, [du, au])).rows.map(vue);
}
/** Une réservation notée par l'équipe : confirmée d'office, donc avec sa table retenue dans la même transaction. */
export async function creerParEquipe(db, compte, entree, { cle = '' } = {}) {
  exiger(compte, 'reservations:ecrire');
  return db.transaction(async (c) => {
    const { R } = await lireRegles(c), e = lireEntree(entree, R), n = maintenant();
    const deja = await dejaFaite(c, cle, e);
    if (deja && !deja.nouvelle) return { reservation: vue(await lireResa(c, deja.id)), deja: true };
    const avis = verifier(R, e, { public: false, auj: n.iso, minute: n.min });
    await verrouJour(c, e.date);
    const id = await inserer(c, e, R, { origine: 'telephone', statut: 'confirmee', compte });
    const r = await lireResa(c, id); await affecter(c, r, { table: texte(entree?.tableChoisie, 8) });
    if (cle) await c.query('update idempotence set reservation_id = $2 where cle = $1', [cle, id]);
    await tracer(c, compte, 'creation', 'reservation', id, { origine: 'telephone', alerte: avis.alerte });
    return { reservation: vue(await lireResa(c, id)), alerte: avis.alerte, deja: false };
  });
}

/* Les changements de statut autorisés. Une demande ne retient rien ; confirmée ou arrivée, la réservation a sa table. */
const TRANSITIONS = { demande: ['confirmee', 'refusee'], confirmee: ['arrivee', 'absente', 'annulee'], arrivee: ['confirmee'], absente: ['confirmee'], annulee: ['confirmee'], refusee: ['demande', 'confirmee'] };
async function verrouiller(c, id, version) {
  const r = await lireResa(c, id, 'for update of r'); if (!r) throw new Refus('INTROUVABLE', 'Cette réservation est introuvable.', 404);
  if (!Number.isInteger(version)) throw new Refus('VALIDATION', 'La version de la réservation manque.', 422, { champ: 'version' });
  if (r.version !== version) throw new Refus('CONFLIT_VERSION', 'Cette réservation a été modifiée entre-temps : la voici à jour.', 409, { reservation: vue(r) });
  return r;
}
const versionSuivante = (c, id, plus = '', params = []) => c.query(`update reservations set version = version + 1, modifie_le = now()${plus} where id = $1`, [id, ...params]);

export async function changerStatut(db, compte, id, { statut, version, derogation = '' }) {
  exiger(compte, 'reservations:ecrire');
  return db.transaction(async (c) => {
    /* Le jour est verrouillé avant la réservation : deux confirmations qui visent la même capacité passent l'une après l'autre. */
    const jour = (await c.query('select jour from reservations where id = $1', [id])).rows[0]?.jour; if (jour) await verrouJour(c, jour);
    const r = await verrouiller(c, id, version);
    if (!(TRANSITIONS[r.statut] || []).includes(statut)) throw new Refus('TRANSITION', `Une réservation « ${r.statut} » ne peut pas devenir « ${statut} ».`, 409, { de: r.statut, vers: statut });
    const { R } = await lireRegles(c), n = maintenant(), engage = ACTIFS.includes(statut), engageait = ACTIFS.includes(r.statut);
    let note = '';
    if (engage && !engageait) {
      /* Confirmer ou remettre : la réservation précise est revérifiée, puis une table est retenue. Rien n'est repris d'office. */
      if (r.jour >= n.iso) {
        const v = faisabilite(R, { date: r.jour, service: r.service, heure: hhmm(r.heure_min), couverts: r.couverts }, { auj: n.iso, minute: n.min, public: false, couvertsMax: capaciteEquipe(R) });
        if (!v.ok) {
          if (!derogation) throw new Refus(CODE_RAISON[v.raison] || 'VALIDATION', v.message, 422, { raison: v.raison, propositions: v.propositions, derogeable: peut(compte, 'reservations:deroger') });
          exiger(compte, 'reservations:deroger');
        }
      }
      try { await affecter(c, { ...r }); note = 'a-placer'; }
      catch (e) {
        if (!(e instanceof Refus) || e.code !== 'CAPACITE') throw e;
        if (r.jour >= n.iso) { if (!derogation) throw new Refus('CAPACITE', e.message, 409, { derogeable: peut(compte, 'reservations:deroger') }); exiger(compte, 'reservations:deroger'); }
        note = 'sans-table';
      }
    }
    if (!engage) await c.query('delete from affectations where reservation_id = $1', [id]);
    await versionSuivante(c, id, ', statut = $2, derogation = $3', [statut, texte(derogation, 200) || r.derogation]);
    await tracer(c, compte, 'statut', 'reservation', id, { de: r.statut, vers: statut, ...(derogation ? { derogation: texte(derogation, 200) } : {}) });
    return { reservation: vue(await lireResa(c, id)), note };
  });
}

const MODIFIABLES = ['date', 'service', 'heure', 'couverts', 'nom', 'prenom', 'telephone', 'email', 'noteEquipe', 'noteClient'];
/** Modifie une réservation. Un déplacement réussit entièrement (nouvelle table retenue) ou ne change rien. */
export async function modifier(db, compte, id, { version, champs = {} }) {
  exiger(compte, 'reservations:ecrire');
  const inconnus = Object.keys(champs).filter((k) => !MODIFIABLES.includes(k)); if (inconnus.length) throw new Refus('VALIDATION', `Champ non modifiable : ${inconnus.join(', ')}.`, 422, { champs: inconnus });
  return db.transaction(async (c) => {
    const avant0 = (await c.query('select jour from reservations where id = $1', [id])).rows[0];
    for (const j of [...new Set([avant0?.jour, champs.date].filter(Boolean))].sort()) await verrouJour(c, j);
    const r = await verrouiller(c, id, version), { R } = await lireRegles(c), n = maintenant();
    const e = lireEntree({ date: r.jour, service: r.service, heure: hhmm(r.heure_min), couverts: r.couverts, nom: r.nom, prenom: r.prenom, telephone: r.telephone, email: r.email, noteEquipe: r.note_equipe, noteClient: r.note_client, ...champs }, R);
    const bouge = e.date !== r.jour || e.service !== r.service || enMin(e.heure) !== r.heure_min, plus = e.couverts > r.couverts;
    if (bouge || e.couverts !== r.couverts) verifier(R, e, { public: false, auj: bouge ? n.iso : '', minute: n.min });
    await c.query(`update reservations set jour = $2, service = $3, heure_min = $4, duree_min = $5, couverts = $6, nom = $7, prenom = $8, telephone = $9, email = $10, note_equipe = $11, note_client = $12, version = version + 1, modifie_le = now() where id = $1`,
      [id, e.date, e.service, enMin(e.heure), dureeDe(R, e.service), e.couverts, e.nom, e.prenom, e.telephone, e.email, e.noteEquipe, e.noteClient]);
    let note = '';
    if (ACTIFS.includes(r.statut) && (bouge || plus)) {
      /* La table est remise en jeu : gardée si elle convient encore et que l'équipe l'avait choisie, sinon une autre est retenue (« à placer »). */
      const apres = await lireResa(c, id), res = await affecter(c, apres, { garder: r.genre === 'placement' ? r.table_id : '' });
      if (r.genre === 'placement' && res.table !== r.table_id) note = `La table ${r.table_id} ne convient plus : la réservation est à placer.`;
    }
    await tracer(c, compte, 'modification', 'reservation', id, { champs: Object.keys(champs) });
    return { reservation: vue(await lireResa(c, id)), note };
  });
}

/** Place la réservation à une table choisie par l'équipe ; `table` vide : elle redevient « à placer » (sa capacité reste retenue). */
export async function placer(db, compte, id, { table, version }) {
  exiger(compte, 'reservations:ecrire');
  return db.transaction(async (c) => {
    const jour = (await c.query('select jour from reservations where id = $1', [id])).rows[0]?.jour; if (jour) await verrouJour(c, jour);
    const r = await verrouiller(c, id, version);
    if (!ACTIFS.includes(r.statut)) throw new Refus('TRANSITION', 'Cette réservation n\'est plus active : remettez-la d\'abord.', 409, { statut: r.statut });
    if (table) await affecter(c, r, { table: texte(table, 8) });
    else if (r.table_id) await c.query(`update affectations set genre = 'technique' where reservation_id = $1`, [id]);
    await versionSuivante(c, id);
    await tracer(c, compte, 'placement', 'reservation', id, { table: table || '' });
    return { reservation: vue(await lireResa(c, id)) };
  });
}

/* ---------- Ce que l'équipe change aux règles : complet, fermé, ouverture exceptionnelle, semaine, fermetures ---------- */
const OPS = {
  complet: (E, { date, service, actif }) => bascule(E, 'complets', date, service, actif),
  fermer: (E, { date, service, actif }) => bascule(E, 'fermes', date, service, actif),
  ouverture: (E, { date, service, actif, note }) => { E.ouvertures = (E.ouvertures || []).filter((x) => !(x.date === date && x.service === service)); if (actif) E.ouvertures.push({ date, service, ...(note ? { note: texte(note, 80) } : {}) }); },
  semaine: (E, { semaine }) => { if (semaine === null) delete E.semaine; else E.semaine = Object.fromEntries(Object.entries(semaine).map(([j, l]) => [j, (l || []).map((x) => texte(x, 11)).filter((x) => /^\d{2}:\d{2}-\d{2}:\d{2}$/.test(x))])); },
  ajouterFermeture: (E, { du, au, motif }) => { if (!dateValide(du) || !dateValide(au || du) || (au || du) < du) throw new Refus('DATE', 'Période mal formée.', 422); (E.fermetures ||= []).push({ du, au: au || du, motif: texte(motif, 80) || 'Fermeture exceptionnelle' }); },
  retirerFermeture: (E, { du, au }) => { E.fermetures = (E.fermetures || []).filter((x) => !(x.du === du && x.au === (au || du))); },
};
function bascule(E, champ, date, service, actif) {
  if (!dateValide(date)) throw new Refus('DATE', 'Cette date n\'existe pas.', 422);
  const l = new Set((E[champ] ||= {})[date] || []); if (actif) l.add(service); else l.delete(service);
  if (l.size) E[champ][date] = [...l].sort(); else delete E[champ][date];
}
const DROIT_OP = { complet: 'reglages:jour', fermer: 'reglages:jour', ouverture: 'reglages:semaine', semaine: 'reglages:semaine', ajouterFermeture: 'reglages:semaine', retirerFermeture: 'reglages:semaine' };
export async function changerRegles(db, compte, { version, operation, args = {} }) {
  if (!OPS[operation]) throw new Refus('VALIDATION', 'Opération inconnue.', 422);
  exiger(compte, DROIT_OP[operation]);
  return db.transaction(async (c) => {
    await c.query(`insert into reglages (cle, valeur, version) values ('equipe', '{}', 0) on conflict (cle) do nothing`);
    const l = (await c.query(`select valeur, version from reglages where cle = 'equipe' for update`)).rows[0];
    if (version !== l.version) throw new Refus('CONFLIT_VERSION', 'Les règles ont été modifiées entre-temps : les voici à jour.', 409, { equipe: l.valeur, version: l.version });
    const { R } = await lireRegles(c); if ('service' in args && !servicesDe(R).some((s) => s.id === args.service)) throw new Refus('VALIDATION', 'Ce service n\'existe pas.', 422);
    const E = structuredClone(l.valeur); OPS[operation](E, args);
    const r = (await c.query(`update reglages set valeur = $1, version = version + 1, modifie_le = now(), modifie_par = $2 where cle = 'equipe' returning valeur, version`, [E, compte.id])).rows[0];
    await tracer(c, compte, `regles:${operation}`, 'reglages', 'equipe', args);
    return { equipe: r.valeur, version: r.version };
  });
}
export async function lireReglesEquipe(db, compte) {
  exiger(compte, 'reglages:lire');
  const { R, versionEquipe } = await lireRegles(db.pool), tables = (await db.q('select id, zone, places, forme, plan, lower(saison) as saison_du, upper(saison) as saison_au, active from tables_salle order by id::int')).rows;
  return { reservation: { ...R, equipe: undefined }, equipe: R.equipe, version: versionEquipe, tables };
}

/* ---------- Clients et journal ---------- */
export async function lireClient(db, compte, id) {
  exiger(compte, 'clients:lire');
  const cl = (await db.q('select id, nom, prenom, telephone, telephone_saisi, email, habitue, allergies, note, version from clients where id = $1', [id])).rows[0];
  if (!cl) throw new Refus('INTROUVABLE', 'Cette fiche est introuvable.', 404);
  return { client: cl, reservations: (await db.q(`select ${COLONNES} ${DE} where r.client_id = $1 order by r.jour desc, r.heure_min desc limit 200`, [id])).rows.map(vue) };
}
/** Seuls les champs envoyés changent ; une allergie s'ajoute ou se retire une par une. */
export async function modifierClient(db, compte, id, { version, champs = {} }) {
  exiger(compte, 'clients:ecrire');
  return db.transaction(async (c) => {
    const cl = (await c.query('select * from clients where id = $1 for update', [id])).rows[0]; if (!cl) throw new Refus('INTROUVABLE', 'Cette fiche est introuvable.', 404);
    if (cl.version !== version) throw new Refus('CONFLIT_VERSION', 'Cette fiche a été modifiée entre-temps : la voici à jour.', 409, { client: cl });
    const moins = new Set((champs.allergiesMoins || []).map((a) => texte(a, 40))), allergies = [...new Set([...cl.allergies.filter((a) => !moins.has(a)), ...(champs.allergiesPlus || []).map((a) => texte(a, 40)).filter(Boolean)])];
    const r = (await c.query('update clients set habitue = $2, note = $3, allergies = $4, version = version + 1, modifie_le = now() where id = $1 returning id, nom, prenom, telephone, email, habitue, allergies, note, version',
      [id, 'habitue' in champs ? !!champs.habitue : cl.habitue, 'note' in champs ? texte(champs.note, 400) : cl.note, allergies])).rows[0];
    await tracer(c, compte, 'modification', 'client', id, { champs: Object.keys(champs) });
    return { client: r };
  });
}
export async function lireJournal(db, compte, { limite = 100 } = {}) {
  exiger(compte, 'journal:lire');
  return (await db.q('select j.id, j.quand, j.role, j.action, j.cible, j.cible_id, j.detail, c.nom as par from journal j left join comptes c on c.id = j.compte_id order by j.id desc limit $1', [Math.min(500, Math.max(1, +limite || 100))])).rows;
}
/** Ce qui a changé depuis le numéro `depuis` : les réservations concernées, à jour, et si les règles ont bougé. */
export async function suivre(db, compte, { depuis = 0 }) {
  exiger(compte, 'reservations:lire');
  /* depuis = -1 : seulement le numéro courant, pour commencer à suivre à partir de maintenant. */
  if (+depuis < 0) return { numero: (await db.q('select coalesce(max(numero), 0) n from suivi')).rows[0].n, reservations: [], regles: false, clients: [] };
  const l = (await db.q('select numero, quoi, id from suivi where numero > $1 order by numero limit 500', [+depuis || 0])).rows, ids = [...new Set(l.filter((x) => x.quoi === 'reservation').map((x) => x.id))];
  const dernier = l.length ? l[l.length - 1].numero : (await db.q('select coalesce(max(numero), 0) n from suivi')).rows[0].n;
  return { numero: Math.max(+depuis || 0, dernier), reservations: ids.length ? (await db.q(`select ${COLONNES} ${DE} where r.id = any($1::uuid[])`, [ids])).rows.map(vue) : [], regles: l.some((x) => x.quoi === 'reglages'), clients: [...new Set(l.filter((x) => x.quoi === 'client').map((x) => x.id))] };
}
