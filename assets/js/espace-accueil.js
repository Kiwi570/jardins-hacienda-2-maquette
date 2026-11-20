/* « Aujourd'hui », l'accueil de la maison (v7.10.0) : le prochain service, les priorités, le fil de la journée et le
   briefing. Fonctions pures : elles lisent les mêmes réservations, demandes, soirées et tâches que les autres rubriques,
   et ne gardent rien. Un chiffre affiché ici se retrouve donc, à l'unité près, dans la rubrique qu'il ouvre. */
import { ajouter, servicesDe, ouvert, resasDuJour, actives, couverts, fmt, maj, heure, pluriel, hhmm, enMin, evenements, typo } from './espace-regles.js?v=7';
import { serviceDuJour, dureeDe } from './espace-service.js?v=7';
import { planDuService } from './espace-salle.js?v=7';
import { conseils } from './espace-conseils.js?v=7';
import { demandes, GENRES, libelleEtape } from './espace-demandes.js?v=7';
import { marques } from './espace-clients.js?v=7';
import { tachesEnRetard, tachesLiees, tachesDuJour } from './espace-taches.js?v=7';

/** À partir de combien de couverts une réservation est une « grande tablée » (repère d'affichage, à ajuster avec la maison). */
export const GRANDE_TABLEE = 6;
export const cleService = (iso, sv) => `${iso}|${sv}`;
const svMot = (sv) => (sv === 'midi' ? 'midi' : 'soir');
const regles = (ctx) => ({ R: ctx.R, exceptions: ctx.exceptions || [] });

/** Le service en cours ou le prochain à venir, dans les quatorze jours : { date, service, estAujourdhui, enCours } ou null. */
export function prochainService(ctx, S, minute) {
  for (let k = 0; k <= 14; k++) { const iso = ajouter(ctx.auj, k);
    for (const s of servicesDe(ctx.R)) {
      if (!ouvert(regles(ctx), S, iso, s.id)) continue;
      if (k === 0 && minute > s.f + dureeDe(s.id)) continue; /* fini pour aujourd'hui */
      return { date: iso, service: s.id, estAujourdhui: k === 0, enCours: k === 0 && minute >= s.d };
    } }
  return null;
}
/** « Ce midi », « ce soir », « demain soir », « samedi midi ». */
export function nomService(ctx, iso, sv) {
  if (iso === ctx.auj) return sv === 'midi' ? 'Ce midi' : 'Ce soir';
  if (iso === ajouter(ctx.auj, 1)) return `Demain ${svMot(sv)}`;
  return `${maj(fmt(iso, { weekday: 'long', day: 'numeric', month: 'long' }))}, ${svMot(sv)}`;
}

/**
 * Tout ce qu'on sait d'un service, sans rien inventer : les mots distinguent les demandes, les réservations confirmées
 * et les personnes déjà accueillies.
 */
export function resumeService(ctx, S, salle, iso, sv) {
  const plan = planDuService(ctx, S, salle, iso, sv), s = plan.service, l = s.resas;
  const conf = l.filter((r) => r.statut === 'confirmee'), arr = l.filter((r) => r.statut === 'arrivee'), dem = l.filter((r) => r.statut === 'a-confirmer');
  const tenues = [...conf, ...arr], parHeure = (a, b) => a.heure.localeCompare(b.heure);
  const avecNote = (r) => { const m = marques(S, r); return { ...r, allergies: m.allergies || [], noteClient: m.note || '', habitue: !!m.habitue }; };
  return { date: iso, service: sv, ouvert: s.ouvert, complet: s.complet, debut: s.debut, fin: s.fin, pic: s.pic,
    confirmees: conf.length, couvertsConfirmes: couverts(conf), accueillies: arr.length, couvertsAccueillis: couverts(arr), couvertsAttendus: couverts(tenues),
    demandes: dem.sort(parHeure), couvertsDemandes: couverts(dem), absents: s.absents,
    grandes: tenues.filter((r) => +r.couverts >= GRANDE_TABLEE).sort(parHeure),
    aPlacer: plan.aPlacer.filter((r) => r.statut !== 'a-confirmer').sort(parHeure),
    placees: plan.placees.length,
    /* Ce que l'équipe doit savoir : la note de la réservation, les allergies et la note de la fiche client. Rien d'autre. */
    attentions: tenues.map(avecNote).filter((r) => r.demande || r.allergies.length || r.noteClient).sort(parHeure),
    resas: [...tenues, ...dem].sort(parHeure), taches: tachesLiees(S, 'service', cleService(iso, sv)) };
}

/**
 * Les priorités : peu nombreuses, déduites des données, une par situation. Chacune dit ce qui se passe, pourquoi agir,
 * l'action directe et où trouver l'objet. @returns {{ id, genre, titre, raison, bouton, action?, aller, directe }[]}
 */
export function priorites(ctx, S, salle, minute) {
  const out = [], ps = prochainService(ctx, S, minute), proches = conseils(ctx, S);
  /* 1. Les tables d'aujourd'hui ou de demain qui attendent une réponse (une seule ligne par jour). */
  out.push(...proches.filter((c) => c.genre === 'table'));
  /* 2. Le prochain service, s'il est aujourd'hui ou demain : des réservations confirmées sans table. */
  if (ps && ps.date <= ajouter(ctx.auj, 1)) { const r = resumeService(ctx, S, salle, ps.date, ps.service);
    if (r.aPlacer.length) out.push({ id: `placer-${ps.date}-${ps.service}`, genre: 'salle', titre: `${pluriel(r.aPlacer.length, 'réservation')} ${r.aPlacer.length > 1 ? 'n\'ont' : 'n\'a'} pas encore de table ${nomService(ctx, ps.date, ps.service).toLowerCase()}`,
      raison: `${r.aPlacer.slice(0, 3).map((x) => `${x.nom || 'Sans nom'}, ${pluriel(+x.couverts, 'couvert')} à ${heure(x.heure)}`).join(' · ')}${r.aPlacer.length > 3 ? ' …' : ''}. Les placer maintenant évite de chercher une table pendant le service.`,
      bouton: 'Placer en salle', aller: { vue: 'resas', onglet: 'salle', jour: ps.date, service: ps.service } }); }
  /* 3. Une tâche en retard : la plus ancienne. */
  const retard = tachesEnRetard(S, ctx.auj);
  if (retard.length) out.push({ id: `tache-${retard[0].id}`, genre: 'tache', titre: `En retard : ${retard[0].titre}`, raison: `Prévue pour ${fmt(retard[0].echeance)}.${retard.length > 1 ? ` ${pluriel(retard.length - 1, 'autre tâche')} dans le même cas.` : ''}`, bouton: 'Voir la tâche', aller: { vue: 'jour', ancre: 't-taches' } });
  /* 4. Le reste de ce que l'espace sait déduire : service presque plein, demande sans réponse, soirée sans prix, fermeture sans annonce. */
  out.push(...proches.filter((c) => c.genre !== 'table'));
  /* « Plus tard » : une priorité mise de côté revient demain si elle est toujours vraie (comme les suggestions). */
  const tu = S.conseils?.ignores || {};
  return out.filter((c) => tu[c.id] !== ctx.auj).map((c) => ({ ...c, raison: c.raison || c.detail || '', directe: /^(placer|tache)-/.test(c.id) }));
}

const STATUT_EV = (x) => (x.masque ? 'Masquée sur le site' : 'Affichée sur le site');
/** Ce qui a une date ce jour-là, en dehors des réservations de table : soirées, réceptions demandées ou signées, retraits traiteur. */
export function activitesDuJour(ctx, S, iso) {
  const out = [];
  for (const x of evenements(ctx.agenda || [], S)) { if (String(x.debut).slice(0, 10) !== iso) continue; const h = String(x.debut).slice(11, 16);
    out.push({ cle: `ev-${x.id}`, type: 'soiree', libelleType: x.type || 'Soirée', heure: h || (x.service === 'midi' ? '12:00' : '19:00'), heureConnue: !!h, titre: x.titre, detail: x.prix || '', statut: STATUT_EV(x), ferme: !x.masque, aller: { vue: 'carte', onglet: 'soirees', editer: x.id } }); }
  for (const d of demandes(ctx, S)) {
    if (d.genre === 'reception' && d.brut.date === iso && d.statut !== 'perdue') { const signee = d.statut === 'signe';
      /* Une demande avec une date souhaitée reste une demande : elle n'occupe rien tant qu'elle n'est pas signée. */
      out.push({ cle: `dem-${d.id}`, type: 'reception', libelleType: 'Réception', heure: '', heureConnue: false, titre: `${d.qui} · ${d.titre}`, detail: signee ? '' : 'Date souhaitée par le client : rien n\'est réservé.', statut: signee ? 'Signée' : `Demande · ${libelleEtape(d.genre, d.statut)}`, ferme: signee, aller: { vue: 'demandes', filtre: 'reception', demande: d.id } }); }
    if (d.genre === 'traiteur' && d.brut.jour === iso && !['annulee', 'retiree'].includes(d.statut)) { const conf = d.statut !== 'nouvelle';
      out.push({ cle: `dem-${d.id}`, type: 'retrait', libelleType: 'Retrait traiteur', heure: d.brut.moment === 'midi' ? '12:00' : d.brut.moment === 'soir' ? '19:00' : '', heureConnue: false, titre: `${d.qui} · ${(d.brut.produits || []).map((p) => `${p.qte} × ${p.nom}`).join(', ')}`, detail: d.brut.moment === 'midi' ? 'À midi' : d.brut.moment === 'soir' ? 'Le soir' : '', statut: conf ? libelleEtape(d.genre, d.statut) : 'Commande à confirmer', ferme: conf, aller: { vue: 'demandes', filtre: 'traiteur', demande: d.id } }); }
  }
  return out.sort((a, b) => (a.heure || '99').localeCompare(b.heure || '99'));
}

/** Le fil de la journée : les services et les activités datées, dans l'ordre de l'horloge. */
export function filDuJour(ctx, S, iso, minute = -1) {
  const out = activitesDuJour(ctx, S, iso);
  for (const s of servicesDe(ctx.R)) { const sd = serviceDuJour(ctx, S, iso, s.id); if (!sd.ouvert && !sd.resas.length) continue;
    const fin = s.f + dureeDe(s.id), quand = iso !== ctx.auj || minute < 0 ? '' : minute > fin ? 'Terminé' : minute >= s.d ? 'En cours' : 'À venir';
    out.push({ cle: `sv-${s.id}`, type: 'service', libelleType: 'Service', heure: hhmm(s.d), heureConnue: true, titre: s.id === 'midi' ? 'Service du midi' : 'Service du soir',
      detail: sd.ouvert ? `${pluriel(sd.attendus + sd.arrives, 'réservation confirmée').replace('réservation confirmées', 'réservations confirmées')} · ${pluriel(couverts(sd.resas.filter((r) => ['confirmee', 'arrivee'].includes(r.statut))), 'couvert')}${sd.aConfirmer ? ` · ${pluriel(sd.aConfirmer, 'demande')} à traiter` : ''}` : 'Fermé',
      statut: !sd.ouvert ? 'Fermé' : sd.complet ? 'Complet' : quand, ferme: true, service: s.id, aller: { vue: 'resas', onglet: 'service', jour: iso, service: s.id } }); }
  return out.sort((a, b) => (a.heure || '99').localeCompare(b.heure || '99') || a.cle.localeCompare(b.cle));
}

/** Ce que montre l'accueil : tout vient d'ici, pour que les compteurs correspondent aux listes. */
export function accueil(ctx, S, salle, minute) {
  const ps = prochainService(ctx, S, minute);
  return { prochain: ps ? { ...ps, nom: nomService(ctx, ps.date, ps.service), ...resumeService(ctx, S, salle, ps.date, ps.service) } : null,
    priorites: priorites(ctx, S, salle, minute), fil: filDuJour(ctx, S, ctx.auj, minute), taches: tachesDuJour(S, ctx.auj) };
}
export { typo, GENRES, actives, enMin };
