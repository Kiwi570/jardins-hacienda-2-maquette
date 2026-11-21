/* La fiche client dans l'espace restaurateur (v7.7.6) : les règles, en fonctions pures (testées par
   `node --test _audit/tests/*.test.mjs`).
   Un client se reconnaît à son téléphone, à défaut à son nom. Sa fiche réunit ce que l'agenda sait de lui (ses
   réservations, venues, absences) et ce que la maison note : habitué, allergies, préférences. Ce qui est noté suit le
   client : son allergie s'affiche sur chacune de ses réservations et sur la feuille de service.
   Dans la démonstration, l'agenda ne couvre que la semaine passée et les quatre semaines à venir, et les clients
   d'exemple portent des noms inventés. */
import { ajouter, simplifier, resasDuJour } from './espace-regles.js?v=7';

/** La clé d'un client : son téléphone (chiffres), à défaut son nom. */
/**
 * Un numéro de téléphone mis sous une seule forme (v7.11.0), comme le fait le serveur : « 06 12 34 56 78 »,
 * « +33 6 12 34 56 78 » et « 0033612345678 » donnent « +33612345678 ». Le pays connu est la France ; un numéro d'un
 * autre format garde ses chiffres. Trop court pour être un numéro : chaîne vide.
 */
export function normaliserTelephone(tel) {
  const s = String(tel || '').trim(), c = s.replace(/[^\d+]/g, ''), ch = c.replace(/\D/g, '');
  if (ch.length < 6) return '';
  if (/^\+33\(?0/.test(s.replace(/\s/g, ''))) return `+33${ch.slice(3)}`;         /* « +33 (0)6… » */
  if (c.startsWith('+')) return `+${ch}`;
  if (ch.startsWith('00')) return `+${ch.slice(2)}`;
  return francais(ch) || ch;
}
/**
 * Un numéro français écrit sans « + » (v7.11.1), reconnu à ses seuls chiffres : « 0612345678 », « 33612345678 »,
 * « 330612345678 », « 0033612345678 ». Rend « +33612345678 », ou '' si ce n'est pas une de ces écritures (numéro
 * étranger, trop court, ambigu) : dans ce cas rien n'est deviné.
 */
export function francais(chiffres) {
  const m = /^(?:0033|33)0?([1-9]\d{8})$/.exec(chiffres) || /^0([1-9]\d{8})$/.exec(chiffres);
  return m ? `+33${m[1]}` : '';
}
const slug = (nom) => simplifier(nom || '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
/** L'ancienne clé (avant la v7.11.0) d'un client reconnu par son nom : gardée pour retrouver ses anciennes notes. */
export const cleNom = (nom) => (slug(nom) ? `n-${slug(nom)}` : '');
/**
 * La clé d'un client (v7.11.0). Dans l'ordre : l'identifiant stable donné par le serveur (`c:`), sinon le téléphone
 * sous sa forme unique (`t:`), sinon la réservation ou la demande elle-même (`s:`). Deux personnes qui portent le même
 * nom sans téléphone ne sont donc jamais réunies : le rapprochement par le nom est seulement proposé (voir `semblables`).
 */
export function cleClient(r) {
  if (r?.clientId) return `c:${r.clientId}`;
  const tel = normaliserTelephone(r?.telephone); if (tel) return `t:${tel}`;
  if (!slug(r?.nom)) return '';
  return r?.id ? `s:${r.id}` : cleNom(r.nom);
}
/** La clé du client d'une demande (réception, traiteur, cadeau, question). */
export const cleDemande = (d) => cleClient({ id: d.id, nom: d.qui, telephone: d.telephone, clientId: d.clientId });

const VIDE = { habitue: false, allergies: [], note: '' };
/** Ce que la maison a noté d'un client. */
export const notesDe = (S, cle) => ({ ...VIDE, ...(S.clients?.[cle] || {}) });
/**
 * Ce qu'il faut voir sur une réservation de ce client : { habitue, allergies, note }. Un client connu du serveur garde
 * les notes prises avant sous son téléphone (même numéro : même personne). Rien n'est jamais repris d'un simple nom.
 */
export function marques(S, r) {
  const cle = cleClient(r), tel = normaliserTelephone(r?.telephone);
  return { ...VIDE, ...(S.clients?.[cle] || (cle.startsWith('c:') && tel ? S.clients?.[`t:${tel}`] : null) || {}) };
}
/**
 * Des notes rangées sous le même numéro écrit autrement (v7.11.1) : une ancienne fiche dont on ne sait pas dire, à ses
 * seuls chiffres, à qui elle appartient (numéro étranger ou ambigu). Elles sont gardées telles quelles et proposées
 * « à vérifier » sur la fiche qui porte ces mêmes chiffres ; rien n'est attribué d'office.
 */
export function notesMemeNumero(S, cle, telephone) {
  const tel = normaliserTelephone(telephone), ch = tel.replace(/\D/g, ''); if (!tel.startsWith('+') || !ch) return null;
  const k = `t:${ch}`, n = S.clients?.[k];
  return k !== cle && n && (n.habitue || n.allergies?.length || n.note) ? { cle: k, motif: 'numero', ...VIDE, ...n } : null;
}
/** D'anciennes notes gardées sous le seul nom (avant la v7.11.0) : une proposition à vérifier, jamais appliquée d'office. */
export function notesParNom(S, cle, nom) {
  const k = cleNom(nom), n = S.clients?.[k];
  return k && k !== cle && cle.startsWith('s:') && n && (n.habitue || n.allergies?.length || n.note) ? { cle: k, ...VIDE, ...n } : null;
}

/** Toutes les réservations d'un client dans l'agenda (de la semaine passée à dans quatre semaines), de la plus récente à la plus ancienne. */
export function historique(ctx, S, cle, { avant = 7, apres = 28 } = {}) {
  const l = [];
  if (cle) for (let k = -avant; k <= apres; k++) l.push(...resasDuJour(ctx, S, ajouter(ctx.auj, k)).filter((r) => cleClient(r) === cle));
  return l.sort((a, b) => b.date.localeCompare(a.date) || b.heure.localeCompare(a.heure));
}

/**
 * La fiche d'un client.
 * @returns {{ cle: string, nom: string, telephone: string, habitue: boolean, allergies: string[], note: string, resas: object[], venues: number, aVenir: number, absences: number, annulations: number, prochaine: object|null, exemple: boolean }}
 */
export function fiche(ctx, S, cle) {
  const resas = historique(ctx, S, cle), der = resas[0] || {}, n = { ...VIDE, ...(S.clients?.[cle] ? S.clients[cle] : marques(S, der)) };
  const venues = resas.map((r) => ({ ...r, moment: momentVenue(r, ctx.auj, ctx.minute) }));
  const futures = venues.filter((r) => r.moment === 'a-venir').sort((a, b) => a.date.localeCompare(b.date) || a.heure.localeCompare(b.heure));
  return { cle, nom: n.nom || der.nom || 'Sans nom', telephone: n.telephone || der.telephone || '', habitue: !!n.habitue, allergies: n.allergies || [], note: n.note || '', resas: venues,
    venues: resas.filter((r) => r.statut === 'arrivee').length, aVenir: futures.length, absences: resas.filter((r) => r.statut === 'absente').length,
    annulations: resas.filter((r) => r.statut === 'annulee').length, prochaine: futures[0] || null, aClarifier: venues.filter((r) => r.moment === 'a-clarifier'),
    periode: { du: ajouter(ctx.auj, -7), au: ajouter(ctx.auj, 28) }, ancienne: notesParNom(S, cle, n.nom || der.nom), aVerifier: [notesParNom(S, cle, n.nom || der.nom), notesMemeNumero(S, cle, n.telephone || der.telephone)].filter(Boolean), exemple: resas.length > 0 && resas.every((r) => r.source === 'demo') };
}
/**
 * Où en est une venue par rapport à maintenant (v7.11.0), avec la date ET l'heure :
 * 'a-venir' (demandée ou confirmée, pas encore l'heure), 'a-clarifier' (confirmée, l'heure est passée, personne n'a dit
 * si le client est venu), 'en-cours' (arrivé aujourd'hui), 'passee' (venu un autre jour), 'sans-suite' (annulée, refusée, absent).
 */
export function momentVenue(r, auj, minute = 0) {
  if (['annulee', 'refusee', 'absente'].includes(r.statut)) return 'sans-suite';
  if (r.statut === 'arrivee') return r.date === auj ? 'en-cours' : 'passee';
  const [h, m] = String(r.heure || '0:0').split(':').map(Number), passe = r.date < auj || (r.date === auj && h * 60 + m + 30 < minute);
  return passe ? (r.statut === 'confirmee' ? 'a-clarifier' : 'sans-suite') : 'a-venir';
}

/**
 * Ce qu'il faut enregistrer d'une fiche ouverte (v7.8.1) : seulement ce que la personne a réellement changé, comparé à
 * l'état de la fiche à son ouverture, et seulement si personne n'a changé la même chose entre-temps.
 * @param {{ habitue: boolean, allergies: string[], note: string }} ouverture  la fiche telle qu'elle était à l'ouverture
 * @param {{ habitue: boolean, allergies: string[], note: string }} saisie     ce que montre le formulaire
 * @param {{ habitue: boolean, allergies: string[], note: string }} courant    la fiche enregistrée maintenant
 * @returns {{ champs: object|null, conflits: string[] }}  champs : à passer à l'action `client` (null : rien à enregistrer) ;
 *          conflits : les champs changés des deux côtés, gardés tels qu'ils sont enregistrés.
 */
export function changementsFiche(ouverture, saisie, courant) {
  const champs = {}, conflits = [];
  for (const k of ['habitue', 'note']) {
    const mien = k === 'note' ? String(saisie.note ?? '').trim() : !!saisie.habitue, avant = k === 'note' ? String(ouverture.note ?? '').trim() : !!ouverture.habitue, ici = k === 'note' ? String(courant.note ?? '').trim() : !!courant.habitue;
    if (mien === avant || mien === ici) continue;          /* pas touché, ou déjà enregistré ainsi */
    if (ici !== avant) conflits.push(k); else champs[k] = mien; /* changé ailleurs aussi : on garde la version enregistrée */
  }
  const avant = new Set(ouverture.allergies || []), mien = new Set(saisie.allergies || []), ici = new Set(courant.allergies || []);
  const plus = [...mien].filter((a) => !avant.has(a) && !ici.has(a)), moins = [...avant].filter((a) => !mien.has(a) && ici.has(a));
  if (plus.length) champs.allergiesPlus = plus; if (moins.length) champs.allergiesMoins = moins;
  return { champs: Object.keys(champs).length ? champs : null, conflits };
}

/** Où une clé d'avant doit aller : '' si elle est déjà à sa place (ou n'est pas une clé de téléphone à reprendre). */
export function cleMigree(k) {
  const ancien = /^t(\d{6,})$/.exec(k); if (ancien) return `t:${francais(ancien[1]) || ancien[1]}`;
  const mal = /^t:(\d{6,})$/.exec(k); return mal && francais(mal[1]) ? `t:${francais(mal[1])}` : '';
}
/** Reste-t-il des fiches à reprendre ? (Pour ne lancer la migration que s'il y a quelque chose à faire.) */
export const aMigrer = (S) => Object.keys(S.clients || {}).some((k) => { const c = cleMigree(k); return c && c !== k; });
/** Réunit deux jeux de notes sans rien perdre : habitué si l'un l'est, toutes les allergies, les deux notes. */
const reunir = (a = {}, b = {}) => ({ ...b, ...a, habitue: !!(a.habitue || b.habitue), allergies: [...new Set([...(a.allergies || []), ...(b.allergies || [])])], note: [a.note, b.note].flatMap((x) => String(x || '').split(' · ')).map((x) => x.trim()).filter((x, i, l) => x && l.indexOf(x) === i).join(' · ') });

export const MUTATIONS_CLIENTS = {
  /** v7.11.0 : les notes gardées sous l'ancienne clé de téléphone (« t0612… ») passent sous la nouvelle (« t:+33612… »). Rien n'est perdu ; les notes gardées sous un seul nom restent où elles sont, à vérifier. */
  /**
   * v7.11.1 : reprend aussi les anciennes clés internationales (« t33612345678 ») et répare celles que la v7.11.0 avait
   * mal rangées (« t:33612345678 ») : pour une écriture française reconnue, tout rejoint « t:+33612345678 ». Ce qui
   * est déjà noté à destination est gardé avec ; l'ancienne entrée n'est retirée qu'une fois son contenu réuni, dans
   * le même enregistrement. Un numéro qu'on ne sait pas attribuer (étranger, ambigu) garde ses chiffres : il sera
   * proposé « à vérifier » sur la fiche concernée (`notesMemeNumero`). Les identifiants du serveur (`c:`) ne sont
   * jamais touchés. Un second passage ne change plus rien.
   */
  migrerClients(S) {
    for (const k of Object.keys(S.clients || {})) { const cle = cleMigree(k); if (!cle || cle === k) continue; S.clients[cle] = reunir(S.clients[cle], S.clients[k]); delete S.clients[k]; }
  },
  /** Rattache à une fiche d'anciennes notes gardées sous un nom, après vérification par l'équipe. */
  rattacherNotes(S, { de, vers }) { if (!S.clients?.[de] || !vers || de === vers) return; S.clients[vers] = reunir(S.clients[vers], S.clients[de]); delete S.clients[de]; },
  /** Note ce que la maison sait d'un client : habitué, allergies (liste), préférences. */
  client(S, { cle, champs }) {
    if (!cle) return;
    const c = ((S.clients ||= {})[cle] ||= {});
    if ('habitue' in champs) c.habitue = !!champs.habitue;
    if ('allergies' in champs) c.allergies = [...new Set((champs.allergies || []).map((a) => String(a).trim()).filter(Boolean))];
    /* v7.8.1 : une allergie s'ajoute ou se retire une par une, sans toucher à celles notées ailleurs entre-temps. */
    if (champs.allergiesPlus || champs.allergiesMoins) {
      const moins = new Set((champs.allergiesMoins || []).map(String));
      c.allergies = [...new Set([...(c.allergies || []).filter((a) => !moins.has(a)), ...(champs.allergiesPlus || []).map((a) => String(a).trim()).filter(Boolean)])];
    }
    if ('note' in champs) c.note = String(champs.note ?? '').trim().slice(0, 400);
    if (!c.habitue && !c.allergies?.length && !c.note) delete S.clients[cle];
  },
};

/* ---------- La liste des clients (v7.10.0) ---------- */
/**
 * Tous les clients que l'espace connaît : ceux des réservations (de la semaine passée à dans quatre semaines), ceux des
 * demandes, et ceux dont la maison a noté quelque chose. Deux personnes ne sont réunies que par leur téléphone ; sans
 * téléphone, le rapprochement se fait sur le nom et la liste le dit (`parNom`), pour qu'on puisse le vérifier.
 * @param {object[]} [dems] les demandes déjà mises en forme (espace-demandes.js)
 * @returns {{ cle, nom, telephone, email, habitue, allergies, note, resas, aVenir, venues, prochaine, derniere, demandes: object[], parNom, exemple }[]}
 */
export function listeClients(ctx, S, dems = []) {
  const m = new Map(), prendre = (cle) => { if (!m.has(cle)) m.set(cle, { cle, nom: '', telephone: '', email: '', resas: [], demandes: [] }); return m.get(cle); };
  for (let k = -7; k <= 28; k++) for (const r of resasDuJour(ctx, S, ajouter(ctx.auj, k))) { const cle = cleClient(r); if (!cle) continue; const c = prendre(cle); c.resas.push(r); c.nom ||= r.nom || ''; c.telephone ||= r.telephone || ''; c.email ||= r.email || ''; }
  for (const d of dems) { const cle = cleDemande(d); if (!cle || d.qui === 'Sans nom') continue; const c = prendre(cle); c.demandes.push(d); c.nom ||= d.qui; c.telephone ||= d.telephone || ''; c.email ||= d.email || ''; }
  /* Les clients dont la maison a noté quelque chose restent dans la liste (sauf les anciennes notes gardées sous un seul nom). */
  for (const cle of Object.keys(S.clients || {})) if (!cle.startsWith('n-')) prendre(cle);
  const l = [...m.values()].map((c) => { const der = c.resas[c.resas.length - 1] || {}, n = { ...VIDE, ...(S.clients?.[c.cle] ? S.clients[c.cle] : marques(S, { ...der, id: der.id })) };
    const v = c.resas.map((r) => ({ ...r, moment: momentVenue(r, ctx.auj, ctx.minute) })).sort((a, b) => a.date.localeCompare(b.date) || a.heure.localeCompare(b.heure));
    const futures = v.filter((r) => r.moment === 'a-venir'), passees = v.filter((r) => r.statut === 'arrivee');
    return { cle: c.cle, nom: n.nom || c.nom || 'Sans nom', telephone: n.telephone || c.telephone, email: c.email, habitue: !!n.habitue, allergies: n.allergies || [], note: n.note || '',
      resas: v.length, aVenir: futures.length, venues: passees.length, prochaine: futures[0] || null, derniere: passees[passees.length - 1] || null, aClarifier: v.filter((r) => r.moment === 'a-clarifier'), demandes: c.demandes,
      parNom: c.cle.startsWith('s:') || c.cle.startsWith('n-'), exemple: (v.length > 0 || c.demandes.length > 0) && v.every((r) => r.source === 'demo') && c.demandes.every((d) => d.source === 'demo') }; });
  /* Même nom, fiches distinctes : un rapprochement possible, à vérifier (jamais fait d'office). */
  const parNom = new Map(); for (const c of l) { const k = slug(c.nom); if (k) parNom.set(k, [...(parNom.get(k) || []), c.cle]); }
  return l.map((c) => ({ ...c, semblables: (parNom.get(slug(c.nom)) || []).filter((k) => k !== c.cle) }))
    .sort((a, b) => simplifier(a.nom).localeCompare(simplifier(b.nom)) || a.cle.localeCompare(b.cle));
}
/** Les demandes d'un client (même téléphone, ou même nom s'il n'a pas de téléphone). */
export const demandesDuClient = (dems, cle) => dems.filter((d) => cleDemande(d) === cle);
