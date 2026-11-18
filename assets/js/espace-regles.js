/* Les règles de l'espace restaurateur (v7.7.0) : des fonctions pures, sans page ni stockage, testées par
   `node --test _audit/tests/*.test.mjs`. Dates, horaires et ouvertures (les mêmes règles que la page Réserver), réservations
   de démonstration tirées des vrais horaires, réservations du jour, événements. */
export const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
export const SEMAINE = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
export const STATUTS = { 'a-confirmer': 'À confirmer', confirmee: 'Confirmée', arrivee: 'Arrivés', refusee: 'Refusée', annulee: 'Annulée' };
/* Couverts par service : valeur de démonstration pour la jauge, à remplacer par la capacité donnée par le restaurant. */
export const CAPACITE = 60;

export const enMin = (t) => { const [h, m] = String(t).split(':').map(Number); return h * 60 + (m || 0); };
export const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
/** « 12:30 » → « 12 h 30 », « 19:00 » → « 19 h ». */
export const heure = (t) => { const m = enMin(t), h = Math.floor(m / 60) % 24, r = m % 60; return `${h} h${r ? ' ' + String(r).padStart(2, '0') : ''}`; };
export const ajouter = (iso, n) => { const [a, m, j] = iso.split('-').map(Number); return new Date(Date.UTC(a, m - 1, j + n)).toISOString().slice(0, 10); };
export const jourDe = (iso) => { const [a, m, j] = iso.split('-').map(Number); return new Date(Date.UTC(a, m - 1, j)).getUTCDay(); };
export const fmt = (iso, o = { weekday: 'long', day: 'numeric', month: 'long' }) => { const [a, m, j] = iso.split('-').map(Number); return new Intl.DateTimeFormat('fr-FR', { ...o, timeZone: 'UTC' }).format(new Date(Date.UTC(a, m - 1, j))); };
export const maj = (t) => t.charAt(0).toUpperCase() + t.slice(1);
export const hache = (t) => { let h = 2166136261; for (const c of t) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
/** Typographie française des messages : espace insécable devant : ; ! ? et dans les guillemets. */
export const typo = (t) => String(t).replace(/ ([:;!?»])/g, ' $1').replace(/« /g, '« ');
export const svDe = (creneau) => (enMin(creneau.split('-')[0]) < 17 * 60 ? 'midi' : 'soir');
export const pluriel = (n, mot) => `${n} ${mot}${n > 1 ? 's' : ''}`;
/** Le jour et la minute qu'il est à Moineville. */
export function aujourdhui(maintenant = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(maintenant).map((x) => [x.type, x.value]));
  return { iso: `${p.year}-${p.month}-${p.day}`, min: +p.hour * 60 + +p.minute };
}

/** Les services de la réservation, dans l'ordre : [{ id, d, f, pas, libelle }]. */
export const servicesDe = (R) => Object.entries(R.services).map(([id, s]) => ({ id, d: enMin(s.debut), f: enMin(s.fin), pas: s.pas || 15, libelle: id === 'midi' ? 'Midi' : 'Soir' }));
export function creneaux(R, sv) { const s = servicesDe(R).find((x) => x.id === sv); const l = []; if (s) for (let m = s.d; m <= s.f; m += s.pas) l.push(hhmm(m)); return l; }

/** Les règles du site seul (jours, dates et services fermés), sans rien de l'espace. */
export function ouvertSite(R, iso, sv) {
  const F = R.fermetures || {}, j = JOURS[jourDe(iso)];
  return !(F.jours || []).includes(j) && !(F.dates || []).includes(iso) && !((F.services || {})[j] || []).includes(sv);
}
/** Le service est-il ouvert ce jour-là ? Règles du site, plus ce que l'espace a changé (S). */
export function ouvert({ R, exceptions = [] }, S, iso, sv) {
  if ([...exceptions, ...(S.horaires?.exceptions || [])].some((x) => (x.du || x.date) <= iso && iso <= (x.au || x.du || x.date))) return false;
  if ((S.resa?.fermes?.[iso] || []).includes(sv)) return false;
  if (S.horaires?.semaine) return (S.horaires.semaine[JOURS[jourDe(iso)]] || []).some((c) => svDe(c) === sv);
  return ouvertSite(R, iso, sv);
}
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
    out.push({ id: `demo-${iso}-${sv}-${i}`, date: iso, service: sv, heure: t, couverts: 2 + (k % 5) - (k % 7 === 0 ? 1 : 0), nom: NOMS[(k + i * 7) % NOMS.length],
      telephone: `06 ${String(10 + (k % 89)).padStart(2, '0')} ${String(k % 97).padStart(2, '0')} ${String((k >>> 4) % 99).padStart(2, '0')} ${String((k >>> 8) % 99).padStart(2, '0')}`,
      demande: DEMANDES[(k >>> 5) % DEMANDES.length], espace: 'salle', statut, source: 'demo' });
  }
  return out;
}

/** Une demande faite sur la page Réserver, mise à la forme de l'agenda. */
export const depuisSite = (r) => ({ id: r.id, date: r.date, service: r.service, heure: r.heure, couverts: r.couverts, nom: [r.prenom, r.nom].filter(Boolean).join(' '), telephone: r.telephone,
  demande: [...(r.demandes || []), r.message].filter(Boolean).join(' · '), espace: r.espace, table: r.table, statut: 'a-confirmer', source: 'site' });

/** Les réservations d'un jour, triées par heure : démonstration, ajoutées au téléphone, venues du site, avec le statut choisi dans l'espace. */
export function resasDuJour({ R, auj, site = [] }, S, iso) {
  const st = S.resa?.statuts || {};
  return [...servicesDe(R).flatMap((s) => demo(R, auj, iso, s.id)), ...(S.resa?.ajouts || []).filter((r) => r.date === iso), ...site.filter((r) => r.date === iso).map(depuisSite)]
    .map((r) => ({ ...r, statut: st[r.id] || r.statut })).sort((a, b) => a.heure.localeCompare(b.heure));
}
export const actives = (l) => l.filter((r) => !['refusee', 'annulee'].includes(r.statut));
export const couverts = (l) => actives(l).reduce((n, r) => n + (+r.couverts || 0), 0);
/** Les demandes sans réponse, d'aujourd'hui à dans quatre semaines. */
export function aConfirmer(ctx, S) { const l = []; for (let k = 0; k <= 28; k++) l.push(...resasDuJour(ctx, S, ajouter(ctx.auj, k)).filter((r) => r.statut === 'a-confirmer')); return l; }

/** Les événements tels que l'espace les a laissés : ceux du site modifiés ou masqués, et les nouveaux. */
export function evenements(base, S) {
  const m = S.evenements?.modifs || {};
  return [...base.map((x) => ({ ...x, ...(m[x.id] || {}) })), ...(S.evenements?.ajouts || []).map((x) => ({ ...x, ...(m[x.id] || {}), nouveau: true }))]
    .sort((a, b) => a.debut.localeCompare(b.debut));
}
/** La même liste, sans les photos : pour la prochaine soirée de l'accueil et l'agenda de Réserver. */
export const listeEvenements = (base, S) => evenements(base, S).map(({ id, titre, debut, type, prix, service, masque }) => ({ id, titre, debut, type, prix, service, masque: !!masque }));
