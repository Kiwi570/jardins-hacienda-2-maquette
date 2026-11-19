/* Première mise en place d'une base : les réglages et les tables, à partir des données du site.
   Ce sont des valeurs de départ à faire valider par le restaurant (`a_valider`), jamais des réservations ni des clients :
   les exemples de la démonstration ne sont pas importés. Rejouer cette fonction ne remplace rien de ce qui existe. */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publier } from '../../assets/js/disponibilites.js';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const lire = (f) => JSON.parse(readFileSync(join(racine, 'donnees', f), 'utf8'));

/** `donnees` : { reservation, horaires, salle } déjà lus (fonction hébergée : ils sont embarqués) ; sinon lus dans donnees/. */
export async function initialiser(db, donnees = null) {
  const reservation = donnees?.reservation || lire('reservation.json'), horaires = (donnees?.horaires || lire('horaires.json')).adresses[0], salle = donnees?.salle || lire('salle.json');
  const R = publier(reservation, horaires).reservation;
  const reglages = { services: R.services, fermetures: R.fermetures, ouvertures_exceptionnelles: R.ouvertures_exceptionnelles || [], jours_a_l_avance: R.jours_a_l_avance, delai_minutes: R.delai_minutes,
    couverts_max: R.couverts_max, derniere_arrivee_avant_fermeture: R.derniere_arrivee_avant_fermeture || {}, fuseau: 'Europe/Paris',
    /* Valeurs de démonstration, à confirmer avant toute mise en service : durée d'un repas, plafond d'une réservation notée par l'équipe. */
    durees: { midi: 90, soir: 120 }, couverts_max_equipe: 60,
    a_valider: ['durees', 'couverts_max_equipe', 'derniere_arrivee_avant_fermeture', 'tables', 'couverts_max', 'delai_minutes', 'jours_a_l_avance'] };
  await db.q(`insert into reglages (cle, valeur) values ('reservation', $1) on conflict (cle) do nothing`, [reglages]);
  await db.q(`insert into reglages (cle, valeur, version) values ('equipe', '{}', 0) on conflict (cle) do nothing`);
  for (const t of salle.tables) await db.q(`insert into tables_salle (id, zone, places, forme, plan, saison) values ($1, $2, $3, $4, $5, $6) on conflict (id) do nothing`,
    [String(t.id), t.zone, t.places, t.forme || 'carree', { x: t.x, y: t.y, l: t.l, ...(t.h ? { h: t.h } : {}), ...(t.note ? { note: t.note } : {}) }, t.zone === 'terrasse' ? '[6,10)' : null]);
  return { tables: salle.tables.length };
}
