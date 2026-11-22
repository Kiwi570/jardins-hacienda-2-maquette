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

/** La durée indicative d'un repas, en minutes, par service (1 h 30 le midi, 2 h le soir : à régler avec le restaurant). Le service, le plan de salle et les réceptions lisent la même. */
export const DUREES_REPAS = { midi: 90, soir: 120 };
export const dureeRepas = (sv) => DUREES_REPAS[sv] || 90;

/** Le temps laissé entre la dernière arrivée et la fermeture du lieu, en minutes, par service (réglage à valider par le restaurant). */
export const margeDe = (R, sv) => Math.max(0, +(R?.derniere_arrivee_avant_fermeture?.[sv] ?? 0) || 0);

/**
 * Ce que le restaurant a changé depuis son espace (l'état S), sous la forme que lisent les règles : horaires de la
 * semaine, fermetures exceptionnelles, services fermés ou complets un jour, ouvertures exceptionnelles.
 * `exceptions` : celles des horaires publiés. L'aperçu du site et l'espace appellent tous deux cette fonction.
 */
export const equipeDe = (S = {}, exceptions = [], maintenant = '') => ({ ...(S.horaires?.semaine ? { semaine: S.horaires.semaine } : {}), fermetures: [...exceptions, ...(S.horaires?.exceptions || [])],
  fermes: S.resa?.fermes || {}, complets: S.resa?.complets || {}, ouvertures: S.resa?.ouvertures || [],
  /* v7.12.0 : les espaces retenus par une option encore valable ou une réception confirmée. */
  ...(S.receptions ? { occupations: occupationsActives(S, maintenant) } : {}) });

/* ---------- Les réceptions et les espaces qu'elles retiennent (v7.12.0) ----------
   Une demande, une visite ou une proposition ne retient rien. Une OPTION retient ses espaces jusqu'à une échéance ;
   une réception CONFIRMÉE les réserve. Dans les deux cas, pour une période opérationnelle entière : du début de la
   préparation à la fin de la remise en état, y compris quand la soirée se termine après minuit.
   Tout se lit dans le dossier (`S.receptions.dossiers[id].retenue`) : son état, sa période, les tables du plan qu'elle
   prend, si elle prend toute la salle du restaurant ou toute la terrasse. Les mêmes fonctions servent au plan de
   salle, au placement, aux arrivées sans réservation, à la liste d'attente, à l'agenda et à la page Réserver.
   Règle retenue (à confirmer) : une table prise par une réception n'est plus proposée pendant tout service dont la
   fenêtre croise la période de la réception.
   v7.12.1 : cette fenêtre suit les horaires EFFECTIFS du jour (ouverture exceptionnelle, horaires déplacés) et va de la
   première arrivée à la fin du dernier repas possible (dernière arrivée, plus la durée d'un repas ou la marge de
   fermeture si elle est plus longue). Elle franchit minuit quand le repas le franchit. Les zones retenues par
   plusieurs dossiers s'additionnent : le service n'est plus proposé quand tous les espaces utilisables à cette saison
   sont pris, même si aucun dossier ne retient « toute la salle ». */
const court = (t) => String(t || '').slice(0, 16);
/** Un instant « AAAA-MM-JJTHH:MM » à partir d'un jour et de minutes comptées depuis minuit (1500 : le lendemain à 1 h). */
export const instantDe = (iso, min) => `${ajouter(iso, Math.floor(min / 1440))}T${hhmm(((min % 1440) + 1440) % 1440)}`;
/** Deux périodes { debut, fin } se croisent-elles ? Une fin égale à un début ne se croise pas. */
export const seCroisent = (a, b) => court(a.debut) < court(b.fin) && court(b.debut) < court(a.fin);
/** Une retenue bloque-t-elle encore ses espaces ? Une option cesse de bloquer à son échéance exacte. */
export const retenueActive = (ret, maintenant = '') => !!ret && (ret.etat === 'ferme' || (ret.etat === 'option' && (!maintenant || court(maintenant) < court(ret.echeance))));
/** Les espaces retenus en ce moment : [{ id, type: 'option' | 'ferme', intitule, client, debut, fin, tables, espaces, salle, terrasse, echeance }]. */
export function occupationsActives(S, maintenant = '') {
  return Object.values(S?.receptions?.dossiers || {}).filter((d) => retenueActive(d.retenue, maintenant)).map((d) => ({ id: d.id, type: d.retenue.etat, intitule: d.projet?.intitule || d.projet?.occasion || 'Réception', client: d.client?.nom || '',
    debut: court(d.retenue.debut), fin: court(d.retenue.fin), tables: (d.retenue.tables || []).map(String), espaces: d.retenue.espaces || [], salle: !!d.retenue.salle, terrasse: !!d.retenue.terrasse, publics: d.retenue.publics || null, echeance: d.retenue.echeance || '' }));
}
/**
 * La fenêtre d'un service ce jour-là : de la première arrivée à la fin du dernier repas possible. Elle suit les
 * horaires effectifs du jour (`equipe` : ouvertures exceptionnelles, horaires déplacés) ; un service fermé garde sa
 * fenêtre habituelle. La fin vaut : dernière arrivée, plus la durée d'un repas (ou la marge de fermeture, si elle est
 * plus longue). Une fin après minuit appartient au lendemain.
 */
export const fenetreService = (R, iso, sv, equipe = R?.equipe || {}) => {
  const s = servicesDe(R).find((x) => x.id === sv); if (!s) return null;
  const h = horairesDuService(R, iso, sv, equipe), d = h.ouvert ? h.debut : s.d, f = h.ouvert ? h.fin : s.f;
  return { debut: instantDe(iso, d), fin: instantDe(iso, f + Math.max(margeDe(R, sv), dureeRepas(sv))) };
};
/** L'espace « terrasse » de la réservation est-il utilisable ce jour-là (sa saison) ? */
const terrasseOuverte = (R, iso) => { const e = (R?.espaces || []).find((x) => x.id === 'terrasse'); return !!e && (!e.mois || e.mois.includes(+String(iso).slice(5, 7))); };
/**
 * Ce que les réceptions prennent pendant un service : { occs, tables: Map(table → occupation), salle, terrasse, tout }.
 * salle, terrasse : tout l'espace que le site propose est pris, par un dossier ou par la réunion de plusieurs.
 * tout : il ne reste aucun espace utilisable à cette saison (la terrasse hors saison ne compte pas).
 */
export function prisesDuService(occupations, R, iso, sv, equipe = R?.equipe || {}) {
  const f = fenetreService(R, iso, sv, equipe), occs = f ? (occupations || []).filter((o) => seCroisent(o, f)) : [], tables = new Map();
  for (const o of occs) for (const t of o.tables) if (!tables.has(t)) tables.set(t, o);
  /* Chaque retenue dit ce qu'elle prend de chaque espace public et combien de tables il compte : la réunion se calcule ici. */
  const entier = (pub) => { if (occs.some((o) => o[pub])) return true; const sur = Math.max(0, ...occs.map((o) => +o.publics?.[pub]?.sur || 0)); if (!sur) return false;
    return new Set(occs.flatMap((o) => (o.publics?.[pub]?.tables || []).map(String))).size >= sur; };
  const salle = entier('salle'), terrasse = entier('terrasse');
  return { occs, tables, salle, terrasse, tout: salle && (terrasse || !terrasseOuverte(R, iso)) };
}

const dans = (iso, x) => (x.du || x.date) <= iso && iso <= (x.au || x.du || x.date);

/**
 * L'état d'un service un jour donné.
 * @returns {{ ouvert: boolean, raison: ''|'inconnu'|'fermeture'|'ferme'|'semaine'|'horaires', motif: string, exceptionnel: boolean, note: string, complet: boolean, debut: number, fin: number, pas: number }}
 *   raison : pourquoi il est fermé ; exceptionnel : ouvert par une ouverture exceptionnelle ; debut, fin : première et dernière arrivée (minutes).
 */
export function etatService(R, iso, sv, equipe = R?.equipe || {}) {
  const h = horairesDuService(R, iso, sv, equipe); if (!h.ouvert) return h;
  /* 6. Complet : dit par le restaurant pour le service entier. */
  const complet = (equipe.complets?.[iso] || []).includes(sv);
  /* 7. Les réceptions (v7.12.0, v7.12.1) : quand tous les espaces utilisables sont retenus, le service est privatisé ;
     la salle ou la terrasse peuvent l'être seules, et l'autre reste proposée. */
  const pris = prisesDuService(equipe.occupations, R, iso, sv, equipe);
  return { ...h, complet, prive: pris.tout, sallePrise: pris.salle, terrassePrise: pris.terrasse, reception: pris.occs[0]?.intitule || '' };
}
/** Les horaires d'un service ce jour-là, sans regarder l'occupation : ouvert ou non, pourquoi, première et dernière arrivée. */
function horairesDuService(R, iso, sv, equipe = R?.equipe || {}) {
  const s = servicesDe(R).find((x) => x.id === sv), ferme = (raison, motif = '') => ({ ouvert: false, raison, motif, exceptionnel: false, note: '', complet: false, debut: s?.d ?? 0, fin: s?.f ?? 0, pas: s?.pas ?? 15 });
  if (!s || !dateValide(iso)) return ferme('inconnu');
  const F = R.fermetures || {}, j = JOURS[jourDe(iso)];
  /* 1. Fermeture exceptionnelle : une date des réglages, une période des horaires publiés, une période posée dans l'espace. */
  if ((F.dates || []).includes(iso)) return ferme('fermeture', 'Fermeture exceptionnelle');
  const exceptions = [...(F.periodes || []), ...(equipe.fermetures || [])].filter((x) => dans(iso, x) && !x.ouverture);
  const periode = exceptions.find((x) => !(x.creneaux || []).length);
  if (periode) return ferme('fermeture', periode.motif || 'Fermeture exceptionnelle');
  /* Des horaires particuliers ce jour-là (une exception des horaires publiés, avec ses créneaux) remplacent ceux de la semaine. */
  const particulier = exceptions.find((x) => (x.creneaux || []).length);
  /* 2. Service fermé ce jour-là depuis l'agenda. */
  if ((equipe.fermes?.[iso] || []).includes(sv) || (F.par_date?.[iso] || []).includes(sv)) return ferme('ferme', 'Service fermé ce jour-là');
  /* 3 et 4. Ouverture exceptionnelle, sinon la semaine. */
  const exc = [...(R.ouvertures_exceptionnelles || []), ...(equipe.ouvertures || [])].find((x) => x.date === iso && x.service === sv);
  const plage = particulier ? particulier.creneaux.find((c) => svDe(c) === sv) : equipe.semaine ? (equipe.semaine[j] || []).find((c) => svDe(c) === sv) : null;
  const semaineOuverte = particulier || equipe.semaine ? !!plage : !(F.jours || []).includes(j) && !(F.services?.[j] || []).includes(sv);
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
  return { ouvert: true, raison: '', motif: '', exceptionnel: !!exc && !semaineOuverte, note: exc?.note || '', complet: false, debut, fin, pas: s.pas };
}

/**
 * Les ouvertures exceptionnelles, dites comme des exceptions d'horaires (v7.8.1) : le statut « ouvert maintenant » et la
 * liste « À noter » expliquent ainsi le même soir que la réservation propose. Le créneau du service est celui que la
 * semaine lui donne les autres jours ; à défaut, de la première arrivée à « dernière arrivée plus la marge ».
 * Ces entrées portent `ouverture: true` : elles informent l'affichage, elles ne changent pas les règles.
 */
export function exceptionsOuvertures(R, semaine = {}, ouvertures = []) {
  return ouvertures.filter((o) => dateValide(o.date)).map((o) => {
    const jour = semaine[JOURS[jourDe(o.date)]] || [], s = servicesDe(R).find((x) => x.id === o.service);
    if (!s || jour.some((c) => svDe(c) === o.service)) return null;
    const vus = Object.values(semaine).flat().filter((c) => svDe(c) === o.service), compte = (c) => vus.filter((x) => x === c).length;
    const creneau = [...vus].sort((a, b) => compte(b) - compte(a))[0] || `${hhmm(s.d)}-${hhmm(s.f + margeDe(R, o.service))}`;
    return { du: o.date, au: o.date, creneaux: [...jour, creneau].sort(), motif: o.note || 'Ouverture exceptionnelle', ouverture: true };
  }).filter(Boolean);
}

/**
 * Ce que le site publie, calculé une fois par le générateur (v7.8.1) pour que le public et l'équipe reçoivent les mêmes
 * exceptions : les réglages de la réservation reçoivent les exceptions des horaires (`fermetures.periodes`), et les
 * horaires reçoivent les ouvertures exceptionnelles de la réservation.
 * @returns {{ reservation: object, exceptions: object[] }}
 */
export function publier(reservation, adresse = {}) {
  const base = (adresse.exceptions || []).filter((x) => !x.ouverture).map((x) => ({ du: x.du || x.date, au: x.au || x.du || x.date, creneaux: x.creneaux || [], motif: x.motif || '' }));
  return { reservation: { ...reservation, fermetures: { ...(reservation.fermetures || {}), periodes: base } },
    exceptions: [...(adresse.exceptions || []).filter((x) => !x.ouverture), ...exceptionsOuvertures(reservation, adresse.semaine || {}, reservation.ouvertures_exceptionnelles || [])] };
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
  /* v7.12.0 : la salle retenue par une réception. Le site ne propose plus ce service ; l'équipe est prévenue. */
  if (e.prive && pub) return { ...non('prive', 'Le restaurant accueille une réception ce jour-là : ce service n\'est pas ouvert à la réservation.'), service: sv };
  if (e.complet && pub) return { ...non('complet'), service: sv };
  return { ok: true, raison: '', message: '', alerte: e.prive ? 'prive' : e.complet ? 'complet' : '', service: sv, propositions: [] };
}

/**
 * Ce qu'on peut proposer quand le choix du client n'est pas possible (v7.11.0), dans l'ordre : le même jour à une
 * autre heure, le même jour à l'autre service, un autre jour proche, un autre espace. Chaque proposition dit ce qui
 * change ; rien d'autre ne change (nombre de personnes, coordonnées, message).
 * `creneaux(iso, service)` rend les heures telles que le client les voit : [{ t, etat: 'libre' | 'complet' }].
 * @param {{ date: string, service: string, heure?: string, espace?: string }} souhait
 * @returns {{ type: 'heure'|'service'|'date'|'espace', date, service, heure, espace?, titre: string, change: string }[]}
 */
export function alternatives(R, souhait, { auj, horizon = R?.jours_a_l_avance ?? 60, creneaux, max = 2, jour = (iso) => iso } = {}) {
  const out = [], libres = (iso, sid) => creneaux(iso, sid).filter((x) => x.etat === 'libre').map((x) => x.t), cible = souhait.heure ? enMin(souhait.heure) : null;
  /* Sans heure souhaitée : le milieu du service d'abord. */
  const proches = (l) => (cible == null ? [l[Math.floor((l.length - 1) / 2)], ...l].filter((x, i, t) => x && t.indexOf(x) === i) : [...l].sort((a, b) => Math.abs(enMin(a) - cible) - Math.abs(enMin(b) - cible) || enMin(a) - enMin(b)));
  const svs = servicesDe(R), nom = (sid) => (svs.find((s) => s.id === sid)?.libelle || sid).toLowerCase(), moment = (sid) => (sid === 'midi' ? 'le midi' : 'le soir');
  if (souhait.service && souhait.heure) for (const t of proches(libres(souhait.date, souhait.service)).filter((x) => x !== souhait.heure).slice(0, max))
    out.push({ type: 'heure', date: souhait.date, service: souhait.service, heure: t, titre: `Le même jour, à ${heureDite(t)}`, change: `l'heure d'arrivée (${heureDite(t)} au lieu de ${heureDite(souhait.heure)})` });
  for (const s of svs) { if (s.id === souhait.service) continue; const l = libres(souhait.date, s.id); if (!l.length) continue;
    const t = l[Math.floor((l.length - 1) / 2)]; out.push({ type: 'service', date: souhait.date, service: s.id, heure: t, titre: `Le même jour, ${moment(s.id)}, à ${heureDite(t)}`, change: `le service (${nom(s.id)} au lieu de ${nom(souhait.service) || 'l\'autre service'})` }); }
  if (souhait.service) { let n = 0; for (let k = 1; k <= 21 && n < max; k++) for (const d of [ajouter(souhait.date, k), ajouter(souhait.date, -k)]) {
    if (n >= max || (auj && d < auj) || (auj && d > ajouter(auj, horizon))) continue; const l = libres(d, souhait.service); if (!l.length) continue;
    const t = souhait.heure && l.includes(souhait.heure) ? souhait.heure : proches(l)[0]; n++;
    out.push({ type: 'date', date: d, service: souhait.service, heure: t, titre: `${jour(d)}, ${moment(souhait.service)}, à ${heureDite(t)}`, change: `le jour${souhait.heure && t !== souhait.heure ? ' et l\'heure' : ''} (${jour(d)}${souhait.heure && t !== souhait.heure ? `, ${heureDite(t)}` : ''})` }); } }
  /* Un espace fermé à cette saison (la terrasse en hiver) : l'autre espace, sans rien changer d'autre. */
  const e = (R?.espaces || []).find((x) => x.id === souhait.espace);
  if (e?.mois && !e.mois.includes(+souhait.date.slice(5, 7))) { const autre = (R.espaces || []).find((x) => !x.mois || x.mois.includes(+souhait.date.slice(5, 7)));
    if (autre) out.push({ type: 'espace', date: souhait.date, service: souhait.service, heure: souhait.heure || '', espace: autre.id, titre: autre.libelle, change: `l'installation (${autre.libelle.toLowerCase()} : ${e.libelle.toLowerCase()}, c'est ${e.hors_saison || 'à la belle saison'})` }); }
  return out;
}
