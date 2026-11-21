/* La liste d'attente (v7.11.0) : les règles, en fonctions pures (testées par `node --test _audit/tests/*.test.mjs`).

   Une inscription en liste d'attente n'est PAS une réservation : c'est le souhait d'un client pour un jour et une
   période, avec sa souplesse d'horaire et les espaces qu'il accepte. Quand une place se libère, l'équipe prépare une
   proposition ; le client l'accepte, la refuse, ou la laisse expirer.

   Règle de la proposition (décision v7.11.0) : RIEN n'est bloqué pendant que le client réfléchit. La disponibilité est
   revérifiée au moment où il accepte. Si la place a été prise entre-temps, l'acceptation est refusée, la raison est
   dite, et la demande revient en attente. L'acceptation crée une seule réservation (son identifiant dérive de celui
   de l'inscription : un double clic ne peut pas en créer deux).

   Ce qui est noté : `S.attente.liste` (inscriptions notées par l'équipe) et `S.attente.suivi[id] = { statut,
   proposition: { heure, service, faite, expire, mode }, resaId, motif }` pour toutes les inscriptions, d'où qu'elles viennent
   (équipe, site, exemples). Les messages sont des aperçus : rien n'est envoyé.
   Portée : démonstration, sur cet appareil. Le serveur ne connaît pas encore la liste d'attente. */
import { enMin, hhmm, heure, fmt, ajouter, pluriel, servicesDe, verifierResa, telephoneDemo, histoires, ouvertSite, creneaux } from './espace-regles.js?v=7';
import { dureeDe } from './espace-service.js?v=7';
import { planDuService, placerTout, proposer, nomPlace } from './espace-salle.js?v=7';

export const ETATS_ATTENTE = { 'en-attente': 'En attente', proposee: 'Proposition faite', acceptee: 'Acceptée', refusee: 'Refusée par le client', expiree: 'Proposition expirée', retiree: 'Retirée', perimee: 'Date passée' };
export const SOUPLESSES = [[0, 'À cette heure précise'], [30, 'À une demi-heure près'], [60, 'À une heure près'], [999, 'Tout le service']];
/* Les délais d'une proposition, en minutes. Valeurs d'exemple, à confirmer avec le restaurant (`_exploitation/a-valider.md`).
   - DELAI_REPONSE : le temps laissé au client pour répondre ;
   - MARGE_AVANT_ARRIVEE : une proposition standard se clôt au plus tard ce temps-là avant l'arrivée ;
   - DELAI_DERNIERE_MINUTE : quand il est trop tard pour une proposition standard, le délai court, dit comme tel. */
export const DELAI_REPONSE = 120, MARGE_AVANT_ARRIVEE = 60, DELAI_DERNIERE_MINUTE = 15;
export const ESPACES_ATTENTE = { salle: 'En salle', terrasse: 'En terrasse' };

/** Les inscriptions d'exemple : toujours aux mêmes moments par rapport à aujourd'hui, noms inventés. */
export function attenteDemo(R, auj) {
  const soir = histoires(R, auj).find((x) => x.role === 'tablee')?.date; if (!soir) return [];
  const cr = creneaux(R, 'soir'), h = (t) => (cr.includes(t) ? t : cr[Math.min(cr.length - 1, 2)]);
  let samedi = ajouter(auj, 5); for (let k = 0; k < 14 && !ouvertSite(R, samedi, 'soir'); k++) samedi = ajouter(samedi, 1);
  const une = (n, cree, nom, couverts, date, heureV, souplesse, plus = {}) => ({ id: `att-demo-${n}`, cree, nom, telephone: telephoneDemo(nom), email: '', couverts, date, periode: 'soir', heure: h(heureV), souplesse, espaces: [], note: '', statut: 'en-attente', source: 'demo', ...plus });
  return [
    une(1, `${ajouter(auj, -3)}T10:12:00`, 'Nadia F.', 2, soir, '20:30', 30, { statut: 'proposee', proposition: { heure: h('20:30'), service: 'soir', faite: `${ajouter(auj, -1)}T18:00:00`, expire: `${ajouter(auj, -1)}T20:00:00` } }),
    une(2, `${ajouter(auj, -2)}T19:40:00`, 'Tablée Lambert', 9, soir, '20:00', 60, { note: 'Un départ à la retraite' }),
    une(3, `${ajouter(auj, -1)}T09:05:00`, 'Les amis de Sylvie', 9, soir, '20:00', 999),
    une(4, `${ajouter(auj, -1)}T21:30:00`, 'Bernard T.', 4, samedi, '20:00', 30, { espaces: ['salle'] }),
  ];
}

/** Une inscription venue du site (genre « attente » des demandes du site), mise à la forme de la liste. */
const depuisSite = (d) => ({ id: d.id, cree: d.cree, nom: [d.prenom, d.nom].filter(Boolean).join(' ') || 'Sans nom', telephone: d.telephone || '', email: d.email || '', couverts: Math.max(1, Math.round(+d.couverts) || 1),
  date: d.date, periode: d.periode || d.service || 'soir', heure: d.heure || '', souplesse: +d.souplesse || 0, espaces: Array.isArray(d.espaces) ? d.espaces : [], note: d.message || '', statut: 'en-attente', source: 'site' });

/** L'état d'une inscription à cet instant : une proposition dont le délai est passé est « expirée », une date passée « périmée ». */
export function etatAttente(e, auj, maintenant) {
  /* À l'échéance exacte, la proposition est expirée (v7.11.1). L'échéance est celle enregistrée à la création : rien ne la prolonge. */
  if (e.statut === 'proposee' && e.proposition?.expire && maintenant && String(maintenant).slice(0, 19) >= String(e.proposition.expire).slice(0, 19)) return 'expiree';
  if (['en-attente', 'expiree', 'proposee'].includes(e.statut) && e.date < auj) return 'perimee';
  return e.statut;
}
/**
 * Toute la liste d'attente, la plus ancienne inscription d'abord, avec le rang d'ancienneté de chacune parmi celles qui
 * attendent encore pour le même jour et la même période.
 * `ctx.maintenant` : l'instant présent (« 2026-11-20T19:05:00 ») pour les délais ; `ctx.exemples === false` : pas d'exemples.
 */
export function listeAttente(ctx, S) {
  const suivi = S.attente?.suivi || {};
  const l = [...(ctx.exemples === false || ctx.scenario ? [] : attenteDemo(ctx.R, ctx.auj)), ...(S.attente?.liste || []), ...(ctx.demandes || []).filter((d) => d.genre === 'attente').map(depuisSite)]
    .map((e) => { const x = { ...e, ...(suivi[e.id] || {}) }; return { ...x, etat: etatAttente(x, ctx.auj, ctx.maintenant) }; })
    .sort((a, b) => String(a.cree).localeCompare(String(b.cree)) || a.id.localeCompare(b.id));
  const rangs = {};
  return l.map((e) => (['en-attente', 'proposee', 'expiree'].includes(e.etat) ? { ...e, rang: (rangs[`${e.date}|${e.periode}`] = (rangs[`${e.date}|${e.periode}`] || 0) + 1) } : { ...e, rang: 0 }));
}
export const trouverAttente = (ctx, S, id) => listeAttente(ctx, S).find((e) => e.id === id) || null;

/** Le plan d'un service où chaque réservation active tient une place, même celles que l'équipe n'a pas encore assises. */
function planOccupe(ctx, S, salle, iso, sv) {
  const plan = planDuService(ctx, S, salle, iso, sv, null), { places } = placerTout(plan), gardees = plan.aPlacer.filter((r) => places[r.id]);
  const sur = (id) => (plan.assemblages.find((a) => a.id === id)?.tables || [id]);
  return { ...plan, restes: plan.aPlacer.filter((r) => !places[r.id]), tables: plan.tables.map((t) => ({ ...t, resas: [...t.resas, ...gardees.filter((r) => sur(places[r.id]).includes(t.id))] })),
    assemblages: plan.assemblages.map((a) => ({ ...a })) };
}
/**
 * Les heures où l'on peut aujourd'hui proposer une place à cette inscription : le service est ouvert et pas complet,
 * l'heure est une heure d'arrivée dans la souplesse du client, et une table (ou un assemblage) est libre pour ce
 * nombre de personnes, dans un espace qu'il accepte. La plus proche de son souhait d'abord.
 * @returns {{ heure: string, service: string, place: string, placeNom: string, espace: string }[]}
 */
export function creneauxCompatibles(ctx, S, salle, e) {
  if (!salle || e.date < ctx.auj) return [];
  const sv = e.periode, plan0 = planOccupe(ctx, S, salle, e.date, sv), souhait = e.heure ? enMin(e.heure) : null, duree = dureeDe(sv), out = [];
  /* Les tables rattachées à leurs assemblages (après placement virtuel). */
  const plan = { ...plan0, assemblages: plan0.assemblages.map((a) => ({ ...a, composantes: plan0.tables.filter((t) => a.tables.includes(t.id)) })) };
  const s = servicesDe(ctx.R).find((x) => x.id === sv); if (!s) return [];
  for (let t = s.d; t <= s.f; t += s.pas || 15) {
    if (souhait != null && e.souplesse < 999 && Math.abs(t - souhait) > e.souplesse) continue;
    const h = hhmm(t), v = verifierResa(ctx, S, { date: e.date, service: sv, heure: h, couverts: e.couverts });
    if (!v.ok || v.alerte === 'complet') continue;
    if (e.date === ctx.auj && ctx.minute != null && t < ctx.minute) continue;
    const r = { id: `att-${e.id}`, couverts: e.couverts, debutMin: t, finMin: t + duree, espace: e.espaces?.length === 1 ? e.espaces[0] : '' };
    const limite = (e.espaces || []).length ? { ...plan, tables: plan.tables.filter((x) => e.espaces.includes(x.zone === 'terrasse' ? 'terrasse' : 'salle')), assemblages: plan.assemblages.filter((x) => e.espaces.includes(x.zone === 'terrasse' ? 'terrasse' : 'salle')) } : plan;
    const p = proposer(limite, r);
    if (p) out.push({ heure: h, service: sv, place: p.id, placeNom: nomPlace(p.id), espace: p.zone === 'terrasse' ? 'terrasse' : 'salle', ecart: souhait == null ? 0 : Math.abs(t - souhait) });
  }
  return out.sort((a, b) => a.ecart - b.ecart || a.heure.localeCompare(b.heure));
}
/** La liste, avec pour chaque inscription qui attend les créneaux qu'on peut lui proposer maintenant. */
export function attenteAvecPossibles(ctx, S, salle) {
  return listeAttente(ctx, S).map((e) => (['en-attente', 'expiree'].includes(e.etat) ? { ...e, possibles: creneauxCompatibles(ctx, S, salle, e) } : { ...e, possibles: [] }));
}
/** Les inscriptions à qui l'on peut proposer une place pour ce service, la plus ancienne d'abord. */
export const compatiblesPour = (ctx, S, salle, iso, sv) => attenteAvecPossibles(ctx, S, salle).filter((e) => e.date === iso && e.periode === sv && e.possibles.length);

/** La réservation que crée l'acceptation : un seul identifiant possible par inscription. */
export const idResaAttente = (id) => `att-${id}`;
export function resaDepuisAttente(e) {
  const p = e.proposition || {};
  return { id: idResaAttente(e.id), date: e.date, service: p.service || e.periode, heure: p.heure || e.heure, couverts: e.couverts, nom: e.nom, telephone: e.telephone, email: e.email, demande: [e.note, 'Venu de la liste d\'attente'].filter(Boolean).join(' · '),
    espace: e.espaces?.length === 1 ? e.espaces[0] : 'salle', statut: 'confirmee', source: 'attente' };
}
/* Les instants sont des dates et heures de la maison, écrites « 2026-11-27T19:30:00 » (l'heure métier du restaurant,
   la même pour le calcul, l'affichage et la validation). */
const ms = (instant) => Date.parse(`${String(instant).slice(0, 19)}Z`), versInstant = (t) => new Date(t).toISOString().slice(0, 19);
/**
 * Le délai de réponse d'une proposition faite maintenant pour cette heure d'arrivée (v7.11.1) :
 * - standard : la plus proche de « maintenant + 2 h » et « arrivée − 1 h », si elle est encore à venir ;
 * - dernière minute (quand la fenêtre standard est passée) : la plus proche de « maintenant + 15 min » et de l'arrivée ;
 * - à l'heure d'arrivée ou après : aucun délai valable, il faut proposer un autre créneau.
 * @returns {{ mode: 'standard' | 'derniere-minute' | '', expire: string, minutes: number }}
 */
export function delaiProposition(e, heureProposee, maintenant) {
  const t0 = ms(maintenant), arrivee = ms(`${e.date}T${hhmm(enMin(heureProposee))}:00`);
  const standard = Math.min(t0 + DELAI_REPONSE * 60000, arrivee - MARGE_AVANT_ARRIVEE * 60000);
  if (standard > t0) return { mode: 'standard', expire: versInstant(standard), minutes: Math.round((standard - t0) / 60000) };
  if (t0 < arrivee) { const fin = Math.min(t0 + DELAI_DERNIERE_MINUTE * 60000, arrivee); return { mode: 'derniere-minute', expire: versInstant(fin), minutes: Math.round((fin - t0) / 60000) }; }
  return { mode: '', expire: '', minutes: 0 };
}
/** L'échéance seule (voir `delaiProposition`) : '' s'il n'y a plus de délai valable. */
export const echeance = (e, heureProposee, maintenant) => delaiProposition(e, heureProposee, maintenant).expire;

/** Peut-on faire cette action sur la liste d'attente ? '' si oui, sinon la phrase qui dit pourquoi (appelée par le garde-fou du dépôt). */
export function refusAttente(ctx, S, salle, nom, args = {}) {
  if (nom === 'attenteAjouter') {
    const e = args.entree || {};
    if (!String(e.nom || '').trim()) return 'Indiquez le nom du client.';
    if (!(+e.couverts >= 1) || +e.couverts > 60) return 'Indiquez le nombre de personnes.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date || '') || e.date < ctx.auj) return 'Choisissez un jour à venir.';
    if (!String(e.telephone || '').trim() && !String(e.email || '').trim()) return 'Il faut un téléphone ou une adresse pour prévenir le client.';
    if (listeAttente(ctx, S).some((x) => x.id === e.id)) return 'Cette inscription est déjà notée.';
    return '';
  }
  const e = trouverAttente(ctx, S, args.id); if (!e) return 'Cette inscription est introuvable.';
  if (nom === 'attenteProposer') {
    if (e.etat === 'acceptee') return 'Cette inscription a déjà donné une réservation.';
    if (!['en-attente', 'expiree', 'refusee'].includes(e.etat)) return e.etat === 'proposee' ? 'Une proposition est déjà en cours pour ce client.' : 'Cette inscription n\'attend plus de proposition.';
    if (!creneauxCompatibles(ctx, S, salle, e).some((c) => c.heure === args.heure)) return `${heure(args.heure)} n'est plus possible pour ${pluriel(e.couverts, 'personne')} ce jour-là.`;
    /* Le délai est recalculé ici, avec la même heure que l'écran : jamais plus long que la règle, jamais déjà passé. */
    const d = delaiProposition(e, args.heure, ctx.maintenant);
    if (!d.mode) return `Il est trop tard pour proposer ${heure(args.heure)} : c'est l'heure d'arrivée. Proposez un autre créneau.`;
    if (d.mode === 'derniere-minute' && args.mode !== 'derniere-minute') return `Le délai habituel n'est plus possible pour ${heure(args.heure)} (il se clôt une heure avant l'arrivée). Utilisez « Dernière minute » : le client aura ${d.minutes} minutes pour répondre.`;
    if (!args.expire || String(args.expire) > d.expire || String(args.expire) <= String(ctx.maintenant).slice(0, 19)) return 'Le délai de réponse a changé : relancez la proposition.';
    return '';
  }
  if (nom === 'attenteAccepter') {
    if (e.etat === 'acceptee') return 'Déjà acceptée : la réservation existe, elle n\'a pas été créée une seconde fois.';
    if (e.etat === 'expiree') return `La proposition a expiré (${quand(e.proposition.expire)}) : le délai de réponse est passé, elle ne peut plus être acceptée. Refaites une proposition si la place est toujours libre.`;
    if (e.etat !== 'proposee') return 'Aucune proposition en cours pour ce client.';
    /* La règle : on revérifie au moment de l'acceptation. La proposition n'avait rien bloqué. */
    if (!creneauxCompatibles(ctx, S, salle, { ...e, heure: e.proposition.heure, souplesse: 0 }).some((c) => c.heure === e.proposition.heure)) return `La place proposée à ${heure(e.proposition.heure)} a été prise entre-temps : l'acceptation n'est pas possible. La demande reste dans la liste d'attente.`;
    return '';
  }
  if (nom === 'attenteReponse' && args.reponse === 'refusee' && e.etat !== 'proposee' && e.etat !== 'expiree') return 'Aucune proposition en cours pour ce client.';
  return '';
}
const quand = (iso) => `${fmt(String(iso).slice(0, 10), { weekday: 'long', day: 'numeric', month: 'long' })} à ${heure(String(iso).slice(11, 16))}`;
export const quandDit = quand;

export const MUTATIONS_ATTENTE = {
  /** L'équipe inscrit un client en liste d'attente. */
  attenteAjouter(S, { entree }) { const l = ((S.attente ||= {}).liste ||= []); if (!l.some((e) => e.id === entree.id)) l.push({ ...entree, statut: 'en-attente' }); },
  /** Une proposition est préparée pour le client ; elle expire à `expire`. Rien n'est bloqué. */
  attenteProposer(S, { id, heure: h, service, faite, expire, mode = 'standard' }) { (((S.attente ||= {}).suivi ||= {})[id] ||= {}); Object.assign(S.attente.suivi[id], { statut: 'proposee', proposition: { heure: h, service, faite, expire, mode }, motif: '' }); },
  /** Le client accepte : UNE réservation confirmée est créée (jamais deux), l'inscription est close. */
  attenteAccepter(S, { id, resa }) {
    const s = (((S.attente ||= {}).suivi ||= {})[id] ||= {}); if (s.statut === 'acceptee') return;
    const l = ((S.resa ||= {}).ajouts ||= []); if (!l.some((r) => r.id === resa.id)) l.push(resa);
    Object.assign(s, { statut: 'acceptee', resaId: resa.id, motif: '' });
  },
  /** Le client refuse, la proposition a expiré, il se retire, ou la demande revient en attente (avec la raison). */
  attenteReponse(S, { id, reponse, motif = '' }) { const s = (((S.attente ||= {}).suivi ||= {})[id] ||= {}); if (s.statut === 'acceptee') return; Object.assign(s, { statut: reponse, motif }); },
};

/** L'aperçu du message de proposition (rien n'est envoyé). */
export function messageProposition(e, telephone = '') {
  const p = e.proposition || {};
  return `Bonjour ${String(e.nom).split(' ')[0]}, une table pour ${pluriel(e.couverts, 'personne')} s'est libérée aux Jardins de l'Hacienda le ${fmt(e.date, { weekday: 'long', day: 'numeric', month: 'long' })} à ${heure(p.heure || e.heure)}. Pour la prendre, répondez avant ${p.expire ? `le ${quand(p.expire)}` : 'ce soir'}${p.mode === 'derniere-minute' ? ' (c\'est une place de dernière minute)' : ''} : passé ce délai, elle sera proposée à la personne suivante.${telephone ? ` Une question : ${telephone}.` : ''}`;
}
