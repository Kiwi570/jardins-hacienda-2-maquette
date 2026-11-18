/* Les disponibilités de la réservation (v7.8.0) : UNE seule logique, en fonctions pures, pour la page Réserver, la
   mini-réservation de l'accueil, l'agenda de l'espace, la frise, le plan de salle, l'ajout au téléphone et la barre
   « Que voulez-vous faire ? ». Testée par `node --test _audit/tests/*.test.mjs`.

   Deux entrées :
   - R : les réglages publiés (`donnees/reservation.json`) : services et heures d'arrivée, fermetures de la semaine,
     dates fermées, ouvertures exceptionnelles, délai, horizon, couverts ;
   - equipe : ce que le restaurant a changé depuis son espace, sous une forme unique (voir `equipeDe` dans
     espace-regles.js) : { semaine, fermetures: [{ du, au, motif }], fermes: { [date]: [service] },
     complets: { [date]: [service] }, ouvertures: [{ date, service, note }] }. Sur le site, l'aperçu la pose dans
     `R.equipe` ; l'espace la passe en argument. Les deux côtés appellent donc la même fonction avec les mêmes données.

   Ordre des règles pour un service d'un jour (du plus fort au plus faible) :
   1. une fermeture exceptionnelle (date ou période) ferme tout, même une ouverture exceptionnelle ;
   2. un service fermé ce jour-là depuis l'agenda est fermé ;
   3. une ouverture exceptionnelle ouvre un service que la semaine tient fermé (Saint-Sylvestre) ;
   4. sinon la semaine décide : celle de l'espace si elle a été modifiée, sinon celle des réglages publiés ;
   5. les heures d'arrivée vont du début du service à sa dernière arrivée ; si les horaires de la semaine ont été
      déplacés, elles se resserrent : pas avant l'ouverture, pas après « fermeture moins la marge » ;
   6. « complet » ne ferme pas le restaurant : le service reste ouvert, la réservation en ligne ne le propose plus.

   Les heures sont celles de Moineville (Europe/Paris) : les jours sont des dates AAAA-MM-JJ et les heures des minutes
   depuis minuit, sans passer par l'heure de l'appareil ; un changement d'heure ne décale donc rien. Un service qui
   ferme après minuit (« 19:00-00:00 ») est compté jusqu'à 24 h, le jour où il commence. */
export const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
export const enMin = (t) => { const [h, m] = String(t).split(':').map(Number); return h * 60 + (m || 0); };
export const hhmm = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
export const ajouter = (iso, n) => { const [a, m, j] = iso.split('-').map(Number); return new Date(Date.UTC(a, m - 1, j + n)).toISOString().slice(0, 10); };
export const jourDe = (iso) => { const [a, m, j] = iso.split('-').map(Number); return new Date(Date.UTC(a, m - 1, j)).getUTCDay(); };
/** « 12:30 » → « 12 h 30 » (espaces insécables), pour les phrases dites à l'écran. */
export const heureDite = (t) => { const m = enMin(t), h = Math.floor(m / 60) % 24, r = m % 60; return `${h}\u00a0h${r ? '\u00a0' + String(r).padStart(2, '0') : ''}`; };
/** Une date AAAA-MM-JJ qui existe vraiment (pas de 31 février). */
export const dateValide = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || '')); if (!m) return false; const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])); return d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3]; };
/** Le service d'un créneau d'horaires « 12:00-14:30 » : avant 17 h, le midi. */
export const svDe = (creneau) => (enMin(String(creneau).split('-')[0]) < 17 * 60 ? 'midi' : 'soir');
/** Les bornes d'un créneau d'horaires, en minutes ; une fin à minuit ou après compte pour le lendemain. */
export const bornes = (creneau) => { const [a, b] = String(creneau).split('-').map(enMin); return [a, b <= a ? b + 1440 : b]; };

/** Les services de la réservation, dans l'ordre : [{ id, libelle, d, f, pas }] (d : première arrivée, f : dernière arrivée). */
export const servicesDe = (R) => Object.entries(R?.services || {}).map(([id, s]) => ({ id, libelle: s.libelle || (id === 'midi' ? 'Midi' : 'Soir'), d: enMin(s.debut), f: enMin(s.fin), pas: s.pas || 15 }));

/** Le temps laissé entre la dernière arrivée et la fermeture du lieu, en minutes, par service (réglage à valider par le restaurant). */
export const margeDe = (R, sv) => Math.max(0, +(R?.derniere_arrivee_avant_fermeture?.[sv] ?? 0) || 0);

/**
 * Ce que le restaurant a changé depuis son espace (l'état S), sous la forme que lisent les règles : horaires de la
 * semaine, fermetures exceptionnelles, services fermés ou complets un jour, ouvertures exceptionnelles.
 * `exceptions` : celles des horaires publiés. L'aperçu du site et l'espace appellent tous deux cette fonction.
 */
export const equipeDe = (S = {}, exceptions = []) => ({ ...(S.horaires?.semaine ? { semaine: S.horaires.semaine } : {}), fermetures: [...exceptions, ...(S.horaires?.exceptions || [])],
  fermes: S.resa?.fermes || {}, complets: S.resa?.complets || {}, ouvertures: S.resa?.ouvertures || [] });

const dans = (iso, x) => (x.du || x.date) <= iso && iso <= (x.au || x.du || x.date);

/**
 * L'état d'un service un jour donné.
 * @returns {{ ouvert: boolean, raison: ''|'inconnu'|'fermeture'|'ferme'|'semaine'|'horaires', motif: string, exceptionnel: boolean, note: string, complet: boolean, debut: number, fin: number, pas: number }}
 *   raison : pourquoi il est fermé ; exceptionnel : ouvert par une ouverture exceptionnelle ; debut, fin : première et dernière arrivée (minutes).
 */
export function etatService(R, iso, sv, equipe = R?.equipe || {}) {
  const s = servicesDe(R).find((x) => x.id === sv), ferme = (raison, motif = '') => ({ ouvert: false, raison, motif, exceptionnel: false, note: '', complet: false, debut: s?.d ?? 0, fin: s?.f ?? 0, pas: s?.pas ?? 15 });
  if (!s || !dateValide(iso)) return ferme('inconnu');
  const F = R.fermetures || {}, j = JOURS[jourDe(iso)];
  /* 1. Fermeture exceptionnelle : une date des réglages, une période des horaires publiés, une période posée dans l'espace. */
  if ((F.dates || []).includes(iso)) return ferme('fermeture', 'Fermeture exceptionnelle');
  const periode = [...(F.periodes || []), ...(equipe.fermetures || [])].find((x) => dans(iso, x) && !(x.creneaux || []).length);
  if (periode) return ferme('fermeture', periode.motif || 'Fermeture exceptionnelle');
  /* 2. Service fermé ce jour-là depuis l'agenda. */
  if ((equipe.fermes?.[iso] || []).includes(sv) || (F.par_date?.[iso] || []).includes(sv)) return ferme('ferme', 'Service fermé ce jour-là');
  /* 3 et 4. Ouverture exceptionnelle, sinon la semaine. */
  const exc = [...(R.ouvertures_exceptionnelles || []), ...(equipe.ouvertures || [])].find((x) => x.date === iso && x.service === sv);
  const plage = equipe.semaine ? (equipe.semaine[j] || []).find((c) => svDe(c) === sv) : null;
  const semaineOuverte = equipe.semaine ? !!plage : !(F.jours || []).includes(j) && !(F.services?.[j] || []).includes(sv);
  if (!semaineOuverte && !exc) return ferme('semaine', 'Fermé ce jour de la semaine');
  /* 5. Les heures d'arrivée : celles du service, resserrées si les horaires de la semaine ont été déplacés. */
  let debut = s.d, fin = s.f;
  if (exc?.debut) debut = enMin(exc.debut); if (exc?.fin) fin = enMin(exc.fin);
  if (plage && semaineOuverte) {
    const [a, b] = bornes(plage);
    debut = Math.max(debut, s.d + Math.ceil(Math.max(0, a - s.d) / s.pas) * s.pas);
    fin = Math.min(fin, b - margeDe(R, sv));
    if (fin < debut) return ferme('horaires', 'Les horaires de ce jour ne laissent aucune heure d\'arrivée');
  }
  /* 6. Complet : dit par le restaurant pour le service entier. */
  const complet = (equipe.complets?.[iso] || []).includes(sv);
  return { ouvert: true, raison: '', motif: '', exceptionnel: !!exc && !semaineOuverte, note: exc?.note || '', complet, debut, fin, pas: s.pas };
}

/** Le service est-il ouvert ce jour-là ? */
export const estOuvert = (R, iso, sv, equipe) => etatService(R, iso, sv, equipe).ouvert;
/** Les heures d'arrivée possibles d'un service ce jour-là : ['12:00', '12:15', …] ; vide s'il est fermé. */
export function arrivees(R, iso, sv, equipe) {
  const e = etatService(R, iso, sv, equipe), l = [];
  if (e.ouvert) for (let m = e.debut; m <= e.fin; m += e.pas) l.push(hhmm(m));
  return l;
}
/** Le service d'une heure d'arrivée ce jour-là, ou null. */
export const serviceDeLHeure = (R, iso, t, equipe) => servicesDe(R).find((s) => arrivees(R, iso, s.id, equipe).includes(t))?.id || null;

const RAISONS = {
  date: 'Cette date n\'existe pas.',
  passee: 'Ce moment est déjà passé.',
  horizon: 'Cette date est trop lointaine pour la réservation en ligne.',
  ferme: 'Le restaurant est fermé à ce moment-là.',
  heure: 'Ce n\'est pas une heure d\'arrivée de ce service.',
  couverts: 'Ce nombre de couverts n\'est pas possible.',
  complet: 'Ce service est complet.',
};

/**
 * Une réservation est-elle possible ? Même réponse pour le site (`public: true` : délai, horizon, couverts du site,
 * service complet refusé) et pour l'équipe (un service complet reste possible, avec une alerte : c'est une dérogation).
 * @param {{ date: string, service?: string, heure: string, couverts: number }} resa
 * @param {{ auj: string, minute?: number, equipe?: object, public?: boolean, couvertsMax?: number }} o
 * @returns {{ ok: boolean, raison: string, message: string, alerte: string, service: string, propositions: string[] }}
 */
export function faisabilite(R, resa, o = {}) {
  const { auj, minute = 0, equipe = R?.equipe || {}, public: pub = false } = o;
  const non = (raison, message, propositions = []) => ({ ok: false, raison, message: message || RAISONS[raison], alerte: '', service: resa.service || '', propositions });
  if (!dateValide(resa.date)) return non('date');
  if (auj && resa.date < auj) return non('passee', 'Cette date est déjà passée.');
  if (pub && auj && resa.date > ajouter(auj, R.jours_a_l_avance ?? 60)) return non('horizon');
  const c = Math.round(+resa.couverts), max = o.couvertsMax ?? (pub ? R.couverts_max ?? 10 : Infinity);
  if (!Number.isFinite(c) || c < 1) return non('couverts', 'Il faut au moins un couvert.');
  if (c > max) return non('couverts', pub ? `Au-delà de ${max} couverts, la demande passe par le restaurant.` : `${c} couverts : au-delà de ${max}, ce n'est pas une table mais une réception.`);
  const t = /^\d{1,2}:\d{2}$/.test(String(resa.heure || '')) && enMin(resa.heure) < 1440 && +String(resa.heure).split(':')[1] < 60 ? hhmm(enMin(resa.heure)) : null;
  const sv = resa.service || (t && servicesDe(R).find((s) => t && enMin(t) >= s.d - 120 && enMin(t) <= s.f + 120)?.id) || servicesDe(R)[0]?.id;
  const e = etatService(R, resa.date, sv, equipe);
  if (!e.ouvert) return { ...non('ferme', e.motif ? `${e.motif}.` : RAISONS.ferme), service: sv };
  const l = arrivees(R, resa.date, sv, equipe);
  if (!t) return { ...non('heure', 'Précisez l\'heure d\'arrivée.', l), service: sv };
  if (!l.includes(t)) {
    const proches = [...l].sort((a, b) => Math.abs(enMin(a) - enMin(t)) - Math.abs(enMin(b) - enMin(t))).slice(0, 2).sort();
    return { ...non('heure', `Ce service reçoit de ${heureDite(l[0])} à ${heureDite(l[l.length - 1])}.`, proches), service: sv };
  }
  /* Le jour même : le site demande un délai ; l'équipe peut noter une table après coup. */
  if (pub && auj && resa.date === auj && enMin(t) < minute + (R.delai_minutes ?? 60)) return { ...non('passee', 'Cette heure est trop proche ou déjà passée.'), service: sv };
  if (e.complet && pub) return { ...non('complet'), service: sv };
  return { ok: true, raison: '', message: '', alerte: e.complet ? 'complet' : '', service: sv, propositions: [] };
}
