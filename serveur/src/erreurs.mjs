/* Les erreurs métier que l'API rend : un code stable, une phrase pour l'écran, un statut HTTP. */
export class Refus extends Error {
  constructor(code, message, statut = 422, details = {}) { super(message); this.code = code; this.statut = statut; this.details = details; }
}
export const CODES = {
  VALIDATION: 'Une information est manquante ou mal formée.',
  DATE: 'Cette date n\'existe pas.', PASSEE: 'Ce moment est déjà passé.', HORIZON: 'Cette date est trop lointaine.',
  FERME: 'Le restaurant est fermé à ce moment-là.', HEURE: 'Ce n\'est pas une heure d\'arrivée de ce service.',
  COUVERTS: 'Ce nombre de couverts n\'est pas possible.', COMPLET: 'Ce service est complet.',
  CAPACITE: 'Aucune table ne peut accueillir cette réservation à cette heure-là.', TABLE_PRISE: 'Cette table est prise à cette heure-là.',
  TRANSITION: 'Ce changement de statut n\'est pas possible.', CONFLIT_VERSION: 'Cette réservation a été modifiée entre-temps.',
  IDEMPOTENCE: 'Cette demande a déjà été envoyée avec un autre contenu.',
  NON_CONNECTE: 'Connectez-vous.', INTERDIT: 'Votre compte n\'a pas ce droit.', INTROUVABLE: 'Introuvable.',
  TROP_DE_TENTATIVES: 'Trop de tentatives : réessayez dans quelques minutes.', ORIGINE: 'Requête refusée.', SERVEUR: 'Le serveur a rencontré une erreur.',
};
/** Le code d'erreur de l'API pour une raison rendue par le moteur commun (disponibilites.js). */
export const CODE_RAISON = { date: 'DATE', passee: 'PASSEE', horizon: 'HORIZON', ferme: 'FERME', heure: 'HEURE', couverts: 'COUVERTS', complet: 'COMPLET' };
