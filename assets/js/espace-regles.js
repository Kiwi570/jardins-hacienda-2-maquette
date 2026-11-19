/* Les règles de l'espace restaurateur (v7.7.0) : des fonctions pures, sans page ni stockage, testées par
   `node --test _audit/tests/*.test.mjs`. Dates, horaires et ouvertures (les mêmes règles que la page Réserver), réservations
   de démonstration tirées des vrais horaires, réservations du jour, événements.
   v7.8.0 : les ouvertures, les heures d'arrivée et la faisabilité d'une réservation viennent de `disponibilites.js`,
   le fichier que lit aussi la page Réserver : une seule logique pour le site et pour l'équipe. */
import { JOURS, enMin, hhmm, ajouter, jourDe, svDe, servicesDe, etatService, arrivees, faisabilite, equipeDe } from './disponibilites.js?v=7';
export { JOURS, enMin, hhmm, ajouter, jourDe, svDe, servicesDe, etatService, equipeDe };
export const SEMAINE = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
export const STATUTS = { 'a-confirmer': 'À confirmer', confirmee: 'Confirmée', arrivee: 'Arrivés', absente: 'Absents', refusee: 'Refusée', annulee: 'Annulée' };
/* Couverts par service : valeur de démonstration pour la jauge, à remplacer par la capacité donnée par le restaurant. */
export const CAPACITE = 60;

/** « 12:30 » → « 12 h 30 », « 19:00 » → « 19 h ». */
export const heure = (t) => { const m = enMin(t), h = Math.floor(m / 60) % 24, r = m % 60; return `${h} h${r ? ' ' + String(r).padStart(2, '0') : ''}`; };
export const fmt = (iso, o = { weekday: 'long', day: 'numeric', month: 'long' }) => { const [a, m, j] = iso.split('-').map(Number); return new Intl.DateTimeFormat('fr-FR', { ...o, timeZone: 'UTC' }).format(new Date(Date.UTC(a, m - 1, j))); };
export const maj = (t) => t.charAt(0).toUpperCase() + t.slice(1);
export const hache = (t) => { let h = 2166136261; for (const c of t) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
/** Typographie française des messages : espace insécable devant : ; ! ? et dans les guillemets. */
export const typo = (t) => String(t).replace(/ ([:;!?»])/g, ' $1').replace(/« /g, '« ');
/** Minuscules, sans accents, apostrophes droites, espaces simples : pour reconnaître les mots. */
export const simplifier = (t) => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[’`]/g, '\'').replace(/\s+/g, ' ').trim();
export const pluriel = (n, mot) => `${n} ${mot}${n > 1 ? 's' : ''}`;
/** Le jour et la minute qu'il est à Moineville. */
export function aujourdhui(maintenant = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(maintenant).map((x) => [x.type, x.value]));
  return { iso: `${p.year}-${p.month}-${p.day}`, min: +p.hour * 60 + +p.minute };
}

/** Les heures d'arrivée d'un service telles que les réglages les publient, sans regarder le jour (v7.7.0). Pour un jour précis : creneauxDuJour. */
export function creneaux(R, sv) { const s = servicesDe(R).find((x) => x.id === sv); const l = []; if (s) for (let m = s.d; m <= s.f; m += s.pas) l.push(hhmm(m)); return l; }

/** Les règles du site seul (semaine, dates fermées, ouvertures exceptionnelles), sans rien de l'espace. */
export const ouvertSite = (R, iso, sv) => etatService(R, iso, sv, {}).ouvert;
/** L'état d'un service ce jour-là, avec ce que l'espace a changé : { ouvert, raison, motif, exceptionnel, note, complet, debut, fin, pas }. */
export const etatDuService = ({ R, exceptions = [] }, S, iso, sv) => etatService(R, iso, sv, equipeDe(S, exceptions));
/** Le service est-il ouvert ce jour-là ? Règles du site, plus ce que l'espace a changé (S). */
export const ouvert = (regles, S, iso, sv) => etatDuService(regles, S, iso, sv).ouvert;
/** Les heures d'arrivée possibles ce jour-là (horaires déplacés et ouvertures exceptionnelles compris) ; vide si le service est fermé. */
export const creneauxDuJour = ({ R, exceptions = [] }, S, iso, sv) => arrivees(R, iso, sv, equipeDe(S, exceptions));
/**
 * Une réservation notée par l'équipe est-elle possible ? { ok, raison, message, alerte, service, propositions }.
 * Fermé, heure hors service, date passée ou impossible, couverts hors limites : refusé. Service dit complet : possible,
 * avec l'alerte « complet » (l'équipe déroge, en le sachant).
 */
export const verifierResa = ({ R, exceptions = [], auj }, S, resa) => faisabilite(R, resa, { auj, equipe: equipeDe(S, exceptions), couvertsMax: CAPACITE });
export const complet = (S, iso, sv) => (S.resa?.complets?.[iso] || []).includes(sv);

/* Démonstration : des réservations tirées des vrais horaires, avec des noms inventés ; aucune n'est réelle. */
const NOMS = ['Camille R.', 'Julien M.', 'Sophie L.', 'Thomas B.', 'Léa K.', 'Nicolas F.', 'Claire D.', 'Antoine P.', 'Manon G.', 'Hugo S.', 'Sarah V.', 'Maxime T.', 'Chloé N.', 'Lucas H.', 'Émilie W.', 'Paul-Henri C.', 'Inès A.', 'Romain J.', 'Famille Weber', 'Aurélie et Marc'];
const DEMANDES = ['', '', 'Anniversaire', '', '', 'Chaise haute', '', 'Près de la cheminée', '', 'Allergie aux fruits à coque', '', '', 'Une occasion à fêter', ''];
export function demo(R, auj, iso, sv) {
  if (iso < ajouter(auj, -7) || iso > ajouter(auj, 28) || !ouvertSite(R, iso, sv)) return [];
  const h = hache(iso + sv), we = [5, 6].includes(jourDe(iso)), loin = iso > ajouter(auj, 10);
  const n = Math.max(0, (2 + (h % 5) + (we ? 3 : 0)) - (loin ? 3 : 0)), cr = creneaux(R, sv), out = [];
  for (let i = 0; i < n; i++) {
    const k = hache(iso + sv + i), t = cr[(k >>> 3) % cr.length];
    // Quelques demandes en attente seulement, dans les jours qui viennent (comme un vrai lundi matin).
    const statut = iso < auj ? 'arrivee' : iso > auj && iso <= ajouter(auj, 6) && k % 13 === 0 ? 'a-confirmer' : 'confirmee';
    /* Un client d'exemple garde le même téléphone d'une réservation à l'autre : sa fiche le reconnaît (v7.7.6). */
    const qui = (k + i * 7) % NOMS.length, n = hache(`tel-${NOMS[qui]}`);
    out.push({ id: `demo-${iso}-${sv}-${i}`, date: iso, service: sv, heure: t, couverts: 2 + (k % 5) - (k % 7 === 0 ? 1 : 0), nom: NOMS[qui],
      telephone: `06 ${String(10 + (n % 89)).padStart(2, '0')} ${String(n % 97).padStart(2, '0')} ${String((n >>> 4) % 99).padStart(2, '0')} ${String((n >>> 8) % 99).padStart(2, '0')}`,
      demande: DEMANDES[(k >>> 5) % DEMANDES.length], espace: 'salle', statut, source: 'demo' });
  }
  return out;
}

/** Une demande faite sur la page Réserver, mise à la forme de l'agenda. */
export const depuisSite = (r) => ({ id: r.id, date: r.date, service: r.service, heure: r.heure, couverts: r.couverts, nom: [r.prenom, r.nom].filter(Boolean).join(' '), telephone: r.telephone,
  demande: [...(r.demandes || []), r.message].filter(Boolean).join(' · '), espace: r.espace, table: r.table, statut: 'a-confirmer', source: 'site' });

/** Les réservations d'un jour, triées par heure : démonstration, ajoutées au téléphone, venues du site, avec le statut choisi dans l'espace. */
export function resasDuJour({ R, auj, site = [], exemples = true }, S, iso) {
  const st = S.resa?.statuts || {}, mod = S.resa?.modifs || {}, tab = S.resa?.tables || {};
  /* En mode connecté (ctx.exemples === false), il n'y a aucune réservation d'exemple : seulement celles du serveur. */
  return [...(exemples === false ? [] : servicesDe(R)).flatMap((s) => demo(R, auj, iso, s.id)), ...(S.resa?.ajouts || []).filter((r) => r.date === iso), ...site.filter((r) => r.date === iso).map(depuisSite)]
    /* Ce que le restaurant a modifié (heure, service, couverts, nom, téléphone, note ; v7.7.5), la table où il l'a assise (v7.7.6), puis le statut choisi. */
    .map((r) => ({ ...r, ...(mod[r.id] || {}), ...(r.id in tab ? { table: tab[r.id] } : {}), statut: st[r.id] || r.statut })).sort((a, b) => a.heure.localeCompare(b.heure));
}
/** Les réservations qui comptent : ni refusées, ni annulées, ni absentes. */
export const actives = (l) => l.filter((r) => !['refusee', 'annulee', 'absente'].includes(r.statut));
export const couverts = (l) => actives(l).reduce((n, r) => n + (+r.couverts || 0), 0);
/** Les demandes sans réponse, d'aujourd'hui à dans quatre semaines. */
/** Jusqu'où l'espace regarde : l'horizon de la réservation en ligne (60 jours aujourd'hui), jamais moins de quatre semaines. */
export const horizonDe = (R) => Math.max(28, +R?.jours_a_l_avance || 0);
/**
 * Les demandes sans réponse, d'aujourd'hui jusqu'à l'horizon de la réservation en ligne ; une demande venue du site ou
 * notée par l'équipe pour plus tard encore n'est jamais oubliée (v7.8.0 : avant, rien au-delà de 28 jours).
 */
export function aConfirmer(ctx, S) {
  const l = [], h = horizonDe(ctx.R), fin = ajouter(ctx.auj, h);
  for (let k = 0; k <= h; k++) l.push(...resasDuJour(ctx, S, ajouter(ctx.auj, k)).filter((r) => r.statut === 'a-confirmer'));
  const loin = [...new Set([...(ctx.site || []), ...(S.resa?.ajouts || [])].map((r) => r.date).filter((d) => d > fin))].sort();
  for (const d of loin) l.push(...resasDuJour(ctx, S, d).filter((r) => r.statut === 'a-confirmer'));
  return l;
}
/** Retrouve une réservation par son identifiant, où qu'elle soit : notée par l'équipe, venue du site, ou d'exemple. */
export function trouverResa(ctx, S, id) {
  const brute = (S.resa?.ajouts || []).find((r) => r.id === id) || (ctx.site || []).find((r) => r.id === id);
  const iso = brute?.date || (/^demo-(\d{4}-\d{2}-\d{2})-/.exec(String(id)) || [])[1];
  return iso ? resasDuJour(ctx, S, iso).find((r) => r.id === id) || null : null;
}
/** Les événements tels que l'espace les a laissés : ceux du site modifiés ou masqués, et les nouveaux. */
export function evenements(base, S) {
  const m = S.evenements?.modifs || {};
  return [...base.map((x) => ({ ...x, ...(m[x.id] || {}) })), ...(S.evenements?.ajouts || []).map((x) => ({ ...x, ...(m[x.id] || {}), nouveau: true }))]
    .sort((a, b) => a.debut.localeCompare(b.debut));
}
/** La même liste, sans les photos : pour la prochaine soirée de l'accueil et l'agenda de Réserver. */
export const listeEvenements = (base, S) => evenements(base, S).map(({ id, titre, debut, type, prix, service, masque }) => ({ id, titre, debut, type, prix, service, masque: !!masque }));
