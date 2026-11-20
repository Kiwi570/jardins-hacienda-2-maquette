/* L'accueil pendant le service (v7.11.0) : les règles, en fonctions pures (testées par `node --test _audit/tests/*.test.mjs`).

   Cinq notions restent distinctes :
   - la réservation (demandée, confirmée, annulée, refusée) : `statut`, comme avant ;
   - la présence du groupe : attendu, en retard, arrivé (il attend sa table), installé, parti, absent ;
   - l'affectation : la table ou l'assemblage prévu (`S.resa.tables`, voir espace-salle.js) ;
   - l'état physique de la table : prête, occupée, à débarrasser, à préparer, indisponible (espace-salle.js) ;
   - la liste d'attente (espace-attente.js).
   Conséquences : un groupe arrivé n'est pas forcément installé ; une table vide n'est pas forcément prête ; la durée
   prévue d'un repas ne libère pas une table ; une réservation dont l'heure est passée sans nouvelle reste visible.

   Ce qui est noté : `S.service.presence[id] = { etat: 'installe' | 'parti', installeA, partiA, retard, presents }`
   par-dessus le statut « arrivée », et `S.service.tables["jour|service"][table]` pour l'état des tables.
   Portée : ces notes vivent sur cet appareil ; elles ne sont pas encore partagées par le serveur. */
import { enMin, hhmm, heure, pluriel } from './espace-regles.js?v=7';
import { planDuService, placeDe, avisPlace, nomPlace, cleSalle, ETATS_TABLE } from './espace-salle.js?v=7';

/** Au-delà de ce délai après l'heure prévue, un groupe attendu est « en retard ». Valeur d'exemple, à régler avec le restaurant. */
export const TOLERANCE_RETARD = 15;
export const PRESENCES = { demande: 'Demande à traiter', attendu: 'Attendu', retard: 'En retard', 'non-traitee': 'Heure passée, à préciser', arrive: 'Arrivé, à installer', installe: 'Installé', parti: 'Parti', absent: 'Absent', annulee: 'Annulée', refusee: 'Refusée' };

/**
 * Où en est le groupe : 'demande', 'attendu', 'retard', 'non-traitee', 'arrive', 'installe', 'parti', 'absent', 'annulee', 'refusee'.
 * 'non-traitee' : confirmée, le jour est passé (ou le service fini depuis longtemps) et personne n'a dit si le groupe est venu.
 */
export function presenceDe(S, r, auj, minute = 0) {
  if (r.statut === 'a-confirmer') return 'demande';
  if (r.statut === 'absente') return 'absent';
  if (r.statut === 'annulee' || r.statut === 'refusee') return r.statut;
  const p = S.service?.presence?.[r.id];
  if (r.statut === 'arrivee') return p?.etat === 'parti' || (r.date < auj && p?.etat !== 'installe') ? 'parti' : p?.etat === 'installe' ? 'installe' : 'arrive';
  if (r.date < auj) return 'non-traitee';
  if (r.date > auj) return 'attendu';
  const t = enMin(r.heure), tolerance = TOLERANCE_RETARD + (+p?.retard || 0);
  return minute > t + 180 ? 'non-traitee' : minute > t + tolerance ? 'retard' : 'attendu';
}
/** Le retard d'un groupe attendu, en minutes (0 s'il n'est pas en retard). */
export const retardDe = (r, auj, minute) => (r.date === auj && r.statut === 'confirmee' ? Math.max(0, minute - enMin(r.heure)) : 0);

/**
 * La prochaine action d'une ligne, et les autres : { presence, principale, autres }.
 * Chaque action : { action, libelle, genre } ; l'écran sait quoi en faire (voir espace-vue-service.js).
 */
export function prochaineAction(S, r, auj, minute = 0) {
  const presence = presenceDe(S, r, auj, minute), p = S.service?.presence?.[r.id] || {}, a = (action, libelle, genre = '') => ({ action, libelle, genre });
  const jour = r.date === auj, lieu = r.table ? ` (${nomPlace(r.table)})` : '';
  const m = {
    demande: [a('accepter', 'Accepter', 'ok'), a('proposer', 'Proposer un autre horaire'), a('refuser', 'Refuser', 'non')],
    attendu: jour ? [a('arrivee', 'Signaler l\'arrivée', 'ok'), a('retard', 'Retard annoncé'), a('absent', 'Absent', 'non'), a('annuler', 'Le client annule', 'non')] : [a('annuler', 'Annuler la réservation', 'non')],
    retard: [a('arrivee', 'Signaler l\'arrivée', 'ok'), a('retard', p.retard ? 'Retard annoncé : changer' : 'Retard annoncé'), a('absent', 'Absent', 'non'), a('annuler', 'Le client annule', 'non')],
    'non-traitee': [a('arrivee', 'Ils sont venus', 'ok'), a('absent', 'Ils ne sont pas venus', 'non')],
    arrive: jour ? [r.table ? a('installer', `Installer${lieu}`, 'ok') : a('choisir-table', 'Choisir une table', 'ok'), a('incomplet', p.presents ? 'Groupe incomplet : changer' : 'Groupe incomplet'), a('pas-arrive', 'Pas encore arrivés')] : [a('pas-arrive', 'Pas encore arrivés')],
    installe: [a('depart', 'Noter le départ', 'ok'), a('desinstaller', 'Pas encore installés')],
    parti: jour ? [a('revenir', 'Ils sont encore à table')] : [],
    absent: [a('remettre', 'Remettre la réservation')], annulee: [a('remettre', 'Remettre la réservation')], refusee: [a('remettre', 'Remettre la réservation')],
  }[presence] || [];
  return { presence, principale: m[0] || null, autres: m.slice(1) };
}

/** Les tables (physiques) qu'occupe une réservation : sa table, ou celles de son assemblage. */
export function tablesDeLaResa(plan, r) { const t = placeDe(plan, r.table || ''); return !t ? [] : t.assemblage ? t.tables : [t.id]; }

/**
 * Où en est le service, pour l'accueil : les groupes rangés par présence, les tables par état, ce qui demande un geste.
 * @returns {{ plan, lignes: object[], parPresence: object, tables: object, attenteSurPlace: object[], aRemettre: object[], bloquees: object[] }}
 */
export function accueilDuService(ctx, S, salle, iso, sv, minute = iso === ctx.auj ? ctx.minute ?? 0 : 0) {
  const plan = planDuService(ctx, S, salle, iso, sv, iso === ctx.auj ? minute : null);
  const lignes = plan.service.resas.map((r) => { const na = prochaineAction(S, r, ctx.auj, minute), notes = S.service?.presence?.[r.id] || {};
    return { ...r, ...na, retard: na.presence === 'retard' ? retardDe(r, ctx.auj, minute) : 0, retardAnnonce: +notes.retard || 0, presents: notes.presents || null, installeA: notes.installeA ?? null, partiA: notes.partiA ?? null }; });
  const parPresence = {}; for (const l of lignes) (parPresence[l.presence] ||= []).push(l);
  const tables = {}; for (const t of plan.tables) (tables[t.etat] ||= []).push(t);
  /* Une réservation attendue dont la table n'est pas prête : le groupe précédent est encore là, ou la table n'est pas remise en état. */
  const bloquees = lignes.filter((l) => ['attendu', 'retard', 'arrive'].includes(l.presence) && l.table).map((l) => {
    const t = placeDe(plan, l.table), comp = !t ? [] : t.assemblage ? t.composantes : [t];
    const gene = comp.find((c) => (c.occupant && c.occupant.id !== l.id && enMin(l.heure) - minute <= 30) || (['a-debarrasser', 'a-preparer'].includes(c.etat) && enMin(l.heure) - minute <= 30));
    return gene ? { resa: l, table: gene, raison: gene.occupant && gene.occupant.id !== l.id ? `${gene.occupant.nom || 'Un groupe'} y est encore installé` : ETATS_TABLE[gene.etat].toLowerCase() } : null;
  }).filter(Boolean);
  return { plan, lignes, parPresence, tables, attenteSurPlace: lignes.filter((l) => l.presence === 'arrive'), aRemettre: plan.tables.filter((t) => ['a-debarrasser', 'a-preparer'].includes(t.etat)), bloquees };
}

/** Peut-on installer ce groupe maintenant ? '' si oui, sinon la phrase qui dit pourquoi. */
export function refusInstallation(ctx, S, salle, r, minute = ctx.minute ?? 0) {
  if (!r) return 'Cette réservation est introuvable : elle a peut-être été supprimée ailleurs.';
  if (r.statut !== 'arrivee') return 'Signalez d\'abord l\'arrivée du groupe : on installe un groupe arrivé.';
  if (!r.table) return 'Choisissez d\'abord une table pour ce groupe.';
  const plan = planDuService(ctx, S, salle, r.date, r.service, r.date === ctx.auj ? minute : null), t = placeDe(plan, r.table);
  if (!t) return `La ${nomPlace(r.table)} n'est pas sur le plan.`;
  /* Pour une installation, on regarde la table maintenant : qui y est assis, et si elle est prête. */
  const comp = t.assemblage ? t.composantes : [t], gene = comp.find((c) => c.occupant && c.occupant.id !== r.id);
  if (gene) return `La table ${gene.id} est encore occupée par ${gene.occupant.nom || 'un autre groupe'} : notez d'abord son départ, ou choisissez une autre table.`;
  const pas = comp.find((c) => c.etat !== 'prete' && c.occupant?.id !== r.id);
  if (pas) return pas.etat === 'indisponible' ? `La table ${pas.id} est indisponible : choisissez une autre table.` : `La table ${pas.id} est ${ETATS_TABLE[pas.etat].toLowerCase()} : remettez-la en état d'abord, ou choisissez une autre table.`;
  return '';
}

/**
 * Des clients se présentent sans réservation : ce qu'on peut leur proposer maintenant.
 * @returns {{ service: string, places: { id, nom, places, raison }[], refus: { id, raison }[], prochaine: { id, heure }|null }}
 */
export function pourUnPassage(ctx, S, salle, { couverts, minute = ctx.minute ?? 0, service, duree = 90 }) {
  const plan = planDuService(ctx, S, salle, ctx.auj, service, minute), r = { id: '', couverts, debutMin: minute, finMin: minute + duree };
  const toutes = [...plan.tables, ...plan.assemblages].map((t) => ({ t, avis: avisPlace(plan, t, r, { maintenant: true }) }));
  const places = toutes.filter((x) => x.avis.ok).map((x) => ({ id: x.t.id, nom: nomPlace(x.t.id), places: x.t.places, zone: x.t.zoneNom, assemblage: !!x.t.assemblage, raison: x.avis.raison }))
    .sort((a, b) => a.assemblage - b.assemblage || a.places - b.places || a.id.localeCompare(b.id, 'fr', { numeric: true }));
  /* Rien de libre tout de suite : la première table assez grande qui se libère, d'après les durées prévues (une estimation). */
  const plusTard = [...plan.tables].filter((t) => !t.fermee && t.places >= couverts).map((t) => ({ id: t.id, fin: Math.max(minute, ...t.resas.filter((x) => x.debutMin <= minute + duree).map((x) => x.finMin)) }))
    .filter((x) => !plan.tables.find((t) => t.id === x.id).resas.some((y) => y.debutMin >= x.fin && y.debutMin < x.fin + duree)).sort((a, b) => a.fin - b.fin)[0] || null;
  return { service, places, refus: toutes.filter((x) => !x.avis.ok).map((x) => ({ id: x.t.id, raison: x.avis.raison })), prochaine: places.length || !plusTard ? null : { id: plusTard.id, heure: hhmm(plusTard.fin) } };
}
/** La réservation à noter pour un passage : arrivée tout de suite, source « passage ». L'identifiant dérive de la clé donnée (un double clic ne crée qu'un groupe). */
export function resaDePassage({ cle, auj, minute, service, couverts, nom, demande, table = '' }) {
  return { id: `passage-${cle}`, date: auj, service, heure: hhmm(minute), couverts: Math.max(1, Math.round(+couverts) || 1), nom: String(nom || '').trim() || 'Sans réservation', telephone: '', demande: String(demande || '').trim(), espace: 'salle', statut: 'arrivee', source: 'passage', ...(table ? { table } : {}) };
}

export const MUTATIONS_PRESENCE = {
  /** Le groupe est installé à sa table. */
  installer(S, { id, minute }) { (((S.service ||= {}).presence ||= {})[id] ||= {}); Object.assign(S.service.presence[id], { etat: 'installe', installeA: minute ?? null }); delete S.service.presence[id].partiA; },
  /** Le groupe est parti : ses tables sont à débarrasser. */
  depart(S, { id, minute, cle, tables = [] }) {
    (((S.service ||= {}).presence ||= {})[id] ||= {}); Object.assign(S.service.presence[id], { etat: 'parti', partiA: minute ?? null });
    const t = ((S.service.tables ||= {})[cle] ||= {}); for (const x of tables) t[x] = 'a-debarrasser';
  },
  /** Retour en arrière : le groupe n'est pas encore installé (il attend), ou il est encore à table. */
  presenceRetirer(S, { id, vers = '' }) { const p = S.service?.presence?.[id]; if (!p) return; if (vers === 'installe') { p.etat = 'installe'; delete p.partiA; } else { delete p.etat; delete p.installeA; delete p.partiA; } },
  /** Le groupe a prévenu d'un retard (en minutes ; 0 : plus de retard annoncé). */
  retardAnnonce(S, { id, minutes }) { const p = (((S.service ||= {}).presence ||= {})[id] ||= {}); if (+minutes > 0) p.retard = Math.min(120, Math.round(+minutes)); else delete p.retard; },
  /** Le groupe est incomplet : combien sont là (0 ou vide : au complet). */
  groupeIncomplet(S, { id, presents }) { const p = (((S.service ||= {}).presence ||= {})[id] ||= {}); if (+presents > 0) p.presents = Math.round(+presents); else delete p.presents; },
  /** L'état d'une table : 'a-debarrasser', 'a-preparer', 'indisponible' ; '' : prête. */
  etatTable(S, { cle, table, etat }) { const t = (((S.service ||= {}).tables ||= {})[cle] ||= {}); if (etat) t[String(table)] = etat; else delete t[String(table)]; },
  /** Des clients sans réservation : le groupe est noté arrivé ; un double appel avec la même clé ne l'ajoute qu'une fois. */
  passage(S, { resa, installer = false, minute }) {
    const l = ((S.resa ||= {}).ajouts ||= []); if (l.some((r) => r.id === resa.id)) return;
    l.push(resa); if (resa.table) ((S.resa.tables ||= {}))[resa.id] = String(resa.table);
    if (installer && resa.table) (((S.service ||= {}).presence ||= {}))[resa.id] = { etat: 'installe', installeA: minute ?? null };
  },
};

/** Le texte court d'une présence, pour une ligne : « En retard de 20 min », « Installé depuis 20 h 05 »… */
export function ditPresence(l) {
  if (l.presence === 'retard') return `En retard de ${l.retard} min${l.retardAnnonce ? ` (retard annoncé : ${l.retardAnnonce} min)` : ''}`;
  if (l.presence === 'attendu' && l.retardAnnonce) return `Attendu, retard annoncé de ${l.retardAnnonce} min`;
  if (l.presence === 'arrive') return l.presents ? `Arrivés à ${l.presents} sur ${pluriel(+l.couverts, 'couvert').replace(/ couverts?$/, '')}, à installer` : PRESENCES.arrive;
  if (l.presence === 'installe') return `Installé${l.installeA != null ? ` depuis ${heure(hhmm(l.installeA))}` : ''}${l.presents ? ` (${l.presents} présents sur ${+l.couverts})` : ''}`;
  if (l.presence === 'parti') return `Parti${l.partiA != null ? ` à ${heure(hhmm(l.partiA))}` : ''}`;
  return PRESENCES[l.presence] || '';
}
