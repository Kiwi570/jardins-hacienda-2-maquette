/* « Votre venue aux Jardins » et les rappels (v7.11.0) : les règles, en fonctions pures (testées par
   `node --test _audit/tests/*.test.mjs`). Elles servent à la page du client (/votre-venue) et à l'espace.

   La page du client montre UNE réservation : son statut, son récapitulatif, les informations pratiques, ce qu'il peut
   faire. Pas de compte client : l'accès passe par un lien propre à la réservation (identifiant + code).
   Ce que le client fait est noté à part (espace-stock.js, `venues`) ; l'équipe garde la main :
   - reconfirmer : noté, visible dans le service ;
   - compléter (allergie, occasion…) : ajouté à la note de la réservation ;
   - annuler : la réservation est annulée ;
   - changer l'heure ou le nombre de personnes : c'est une DEMANDE. La réservation initiale est gardée telle quelle
     tant que l'équipe n'a pas accepté.
   Rappels : un réglage (combien de temps avant), l'aperçu du message, le lien vers la page du client. Vocabulaire :
   « préparé » (le texte est prêt), « programmé » (une date d'envoi est fixée), « envoyé » (parti), « aperçu » (rien ne
   part). En démonstration, tout est aperçu : aucun rappel n'est programmé ni envoyé.
   Portée : démonstration, sur cet appareil. Le lien n'est pas un secret tant qu'il n'y a pas de serveur. */
import { enMin, hhmm, ajouter, heureDite, faisabilite, arrivees, servicesDe } from './disponibilites.js?v=7';

const fnv = (t) => { let h = 2166136261; for (const c of String(t)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const chiffres = (t) => String(t || '').replace(/\D/g, '').replace(/^(33|0033)/, '0').replace(/^0?(\d{9})$/, '0$1');
/** Le code du lien d'une réservation (démonstration : dérivé de l'identifiant et du téléphone ; demain : un jeton tiré au sort par le serveur). */
export const codeVenue = (id, telephone = '') => fnv(`${id}|${chiffres(telephone)}|hacienda`).toString(36).padStart(6, '0').slice(0, 6);
export const lienVenue = (r) => `/votre-venue?r=${encodeURIComponent(r.id)}&c=${codeVenue(r.id, r.telephone)}`;

export const ETATS_VENUE = { 'demande-recue': 'Demande reçue', confirmee: 'Confirmée', 'modification-demandee': 'Modification demandée', modifiee: 'Modifiée', annulee: 'Annulée', refusee: 'Non retenue', venue: 'Vous êtes venus', passee: 'Date passée' };
/**
 * Où en est la venue, vue par le client : { etat, libelle, phrase }.
 * `v` : ce que le client a fait (voir espace-stock.js). Une modification demandée garde la réservation initiale.
 */
export function etatVenue(r, v = {}, auj, minute = 0) {
  const dit = (etat, phrase) => ({ etat, libelle: ETATS_VENUE[etat], phrase });
  if (r.statut === 'annulee' || v.annulee) return dit('annulee', 'Votre réservation est annulée. Aucune table n\'est retenue.');
  if (r.statut === 'refusee') return dit('refusee', 'Le restaurant n\'a pas pu retenir cette demande.');
  if (r.statut === 'arrivee') return dit('venue', 'Merci de votre visite.');
  if (r.statut === 'absente' || r.date < auj || (r.date === auj && enMin(r.heure) + 180 < minute)) return dit('passee', 'La date de cette réservation est passée.');
  if (v.modif) return dit('modification-demandee', `Vous avez demandé un changement. Tant que le restaurant n'a pas répondu, votre réservation initiale est gardée : ${heureDite(r.heure)}, ${r.couverts} ${+r.couverts > 1 ? 'personnes' : 'personne'}.`);
  if (r.statut === 'a-confirmer') return dit('demande-recue', 'Votre demande est bien arrivée. Elle devient une réservation quand le restaurant la confirme.');
  if (v.reponse?.acceptee && v.reponse.le) return dit('modifiee', 'Votre réservation a été modifiée comme vous l\'aviez demandé.');
  return dit('confirmee', 'Votre table est réservée.');
}
/** Ce que le client peut faire, selon l'état : ['reconfirmer', 'modifier', 'completer', 'annuler']. */
export function actionsVenue(r, v = {}, auj, minute = 0) {
  const e = etatVenue(r, v, auj, minute).etat;
  if (['annulee', 'refusee', 'venue', 'passee'].includes(e)) return [];
  return [...(r.statut === 'confirmee' && !v.reconfirmee ? ['reconfirmer'] : []), ...(v.modif ? [] : ['modifier']), 'completer', 'annuler'];
}
/** Les heures que le client peut demander ce jour-là : les arrivées ouvertes des services du jour. */
export function heuresVenue(R, r, { auj, minute = 0, equipe } = {}) {
  return servicesDe(R).flatMap((s) => arrivees(R, r.date, s.id, equipe).filter((t) => faisabilite(R, { date: r.date, service: s.id, heure: t, couverts: r.couverts }, { auj, minute, equipe, public: true }).ok || t === r.heure).map((t) => ({ heure: t, service: s.id, libelle: `${heureDite(t)} (${s.libelle.toLowerCase()})` })));
}
/** La demande de changement est-elle recevable ? '' si oui, sinon la phrase qui dit pourquoi. */
export function refusModifVenue(R, r, modif, { auj, minute = 0, equipe } = {}) {
  const n = Math.round(+modif.couverts), max = R.couverts_max ?? 10;
  if (!Number.isFinite(n) || n < 1) return 'Indiquez le nombre de personnes.';
  if (n > max) return `Au-delà de ${max} personnes, appelez le restaurant : il vous répondra directement.`;
  if (modif.heure === r.heure && n === +r.couverts) return 'Rien ne change : choisissez une autre heure ou un autre nombre de personnes.';
  const v = faisabilite(R, { date: r.date, service: modif.service, heure: modif.heure, couverts: n }, { auj, minute, equipe, public: true });
  return v.ok || modif.heure === r.heure ? '' : `${v.message} Votre réservation actuelle est gardée.`;
}

/* ---------- Les rappels ---------- */
export const DELAIS_RAPPEL = [[0, 'Aucun rappel'], [24, 'La veille'], [48, 'Deux jours avant'], [72, 'Trois jours avant']];
/** Le délai réglé par le restaurant, en heures avant l'arrivée (par défaut : la veille ; valeur d'exemple, à régler). */
export const delaiRappel = (S) => (S.rappels && 'delai' in S.rappels ? +S.rappels.delai : 24);
/**
 * Le rappel d'une réservation : { actif, du (jour où il partirait), etat, libelle, reconfirmee }.
 * etat : 'aucun' (pas de rappel), 'prepare' (le texte est prêt, la date d'envoi n'est pas arrivée), 'du' (il partirait aujourd'hui ou serait parti).
 * En démonstration, rien n'est programmé ni envoyé : l'écran le dit (« Aperçu »).
 */
export function rappelDe(S, r, v = {}, auj) {
  const d = delaiRappel(S), actif = d > 0 && r.statut === 'confirmee' && r.date >= auj, du = actif ? ajouter(r.date, -Math.round(d / 24)) : '';
  const etat = !actif ? 'aucun' : du > auj ? 'prepare' : 'du';
  return { actif, du, etat, reconfirmee: v.reconfirmee || '', libelle: !actif ? 'Pas de rappel' : v.reconfirmee ? 'Venue reconfirmée par le client' : etat === 'prepare' ? 'Rappel préparé' : 'Rappel dû : pas encore de réponse' };
}
/** Le texte du rappel (aperçu). */
export function messageRappel(r, { lien = '', telephone = '', jour = '' } = {}) {
  return `Bonjour ${String(r.nom || '').split(' ')[0] || ''}, nous vous attendons aux Jardins de l'Hacienda ${jour ? `${jour} ` : ''}à ${heureDite(r.heure)}, pour ${r.couverts} ${+r.couverts > 1 ? 'personnes' : 'personne'}. Pouvez-vous nous confirmer votre venue ? ${lien ? `Confirmer, modifier ou annuler : ${lien}` : ''}${telephone ? ` Ou par téléphone : ${telephone}.` : ''}`.replace(/\s+/g, ' ').trim();
}

/** Ce que les clients ont fait et que l'espace n'a pas encore pris en compte : { annulations, complements, modifs }. */
export function venuesATraiter(S, venues = {}, trouver = () => null) {
  const vus = S.venues?.vus || {}, out = { annulations: [], complements: [], modifs: [] };
  for (const [id, v] of Object.entries(venues)) { const r = trouver(id); if (!r) continue;
    if (v.annulee && vus[id]?.annulee !== v.annulee && !['annulee', 'refusee'].includes(r.statut)) out.annulations.push({ resa: r, cree: v.annulee });
    if (v.complement?.texte && vus[id]?.complement !== v.complement.cree) out.complements.push({ resa: r, texte: v.complement.texte, cree: v.complement.cree });
    if (v.modif && !['annulee', 'refusee', 'absente'].includes(r.statut)) out.modifs.push({ resa: r, modif: v.modif }); }
  return out;
}
export const MUTATIONS_VENUE = {
  /** Le délai des rappels, en heures avant l'arrivée (0 : aucun rappel). */
  rappelReglage(S, { delai }) { (S.rappels ||= {}).delai = Math.max(0, Math.min(168, Math.round(+delai) || 0)); },
  /** L'espace a pris en compte une action du client (annulation, complément) : elle ne sera pas appliquée deux fois. */
  venueVue(S, { id, quoi, cree }) { ((((S.venues ||= {}).vus ||= {})[id] ||= {}))[quoi] = cree; },
};
export { hhmm };
