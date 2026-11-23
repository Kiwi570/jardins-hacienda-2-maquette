/* « Aujourd'hui », l'accueil de la maison (v7.10.0) : le prochain service, les priorités, le fil de la journée et le
   briefing. Fonctions pures : elles lisent les mêmes réservations, demandes, soirées et tâches que les autres rubriques,
   et ne gardent rien. Un chiffre affiché ici se retrouve donc, à l'unité près, dans la rubrique qu'il ouvre. */
import { attente as attentePub, publie as contenuPublie, resasDeSoiree } from './espace-offres.js?v=7';
import { trouverResa, ajouter, servicesDe, ouvert, resasDuJour, actives, couverts, fmt, maj, heure, pluriel, hhmm, enMin, evenements, typo } from './espace-regles.js?v=7';
import { serviceDuJour, dureeDe } from './espace-service.js?v=7';
import { planDuService } from './espace-salle.js?v=7';
import { accueilDuService } from './espace-presence.js?v=7';
import { listeAttente, compatiblesPour, attenteAvecPossibles } from './espace-attente.js?v=7';
import { conseils } from './espace-conseils.js?v=7';
import { demandes, GENRES, libelleEtape } from './espace-demandes.js?v=7';
import { marques } from './espace-clients.js?v=7';
import { tachesEnRetard, tachesLiees, tachesDuJour } from './espace-taches.js?v=7';
import { receptionsDuJour, prioritesReceptions, dossierDeDemande, etatRetenue } from './espace-receptions.js?v=7';
import { instantCtx } from './espace-regles.js?v=7';

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
  const avecNote = (r) => { const m = marques(S, r, ctx.partages); return { ...r, allergies: m.allergies || [], noteClient: m.note || '', habitue: !!m.habitue }; };
  return { date: iso, service: sv, ouvert: s.ouvert, complet: s.complet, debut: s.debut, fin: s.fin, pic: s.pic,
    confirmees: conf.length, couvertsConfirmes: couverts(conf), accueillies: arr.length, couvertsAccueillis: couverts(arr), couvertsAttendus: couverts(tenues),
    demandes: dem.sort(parHeure), couvertsDemandes: couverts(dem), absents: s.absents,
    grandes: tenues.filter((r) => +r.couverts >= GRANDE_TABLEE).sort(parHeure),
    aPlacer: plan.aPlacer.filter((r) => r.statut !== 'a-confirmer').sort(parHeure),
    placees: plan.placees.length,
    /* Ce que l'équipe doit savoir : la note de la réservation, les allergies et la note de la fiche client. Rien d'autre. */
    attentions: tenues.map(avecNote).filter((r) => r.demande || r.allergies.length || r.noteClient).sort(parHeure),
    resas: [...tenues, ...dem].sort(parHeure), taches: tachesLiees(S, 'service', cleService(iso, sv)),
    /* v7.11.0 : où en sont les groupes et les tables (le jour même), et la liste d'attente de ce service. */
    presence: presenceDuService(ctx, S, salle, iso, sv, plan) };
}
/** Le résumé de la présence pour un service : les groupes par état, les tables qui demandent un geste, la liste d'attente. */
export function presenceDuService(ctx, S, salle, iso, sv) {
  const acc = accueilDuService(ctx, S, salle, iso, sv), P = (k) => acc.parPresence[k] || [], liste = ctx.exemples === false ? [] : listeAttente(ctx, S).filter((e) => e.date === iso && e.periode === sv);
  return { attendus: P('attendu'), retards: P('retard'), aInstaller: P('arrive'), installes: P('installe'), partis: P('parti'), nonTraitees: P('non-traitee'), aRemettre: acc.aRemettre, bloquees: acc.bloquees,
    tables: { pretes: (acc.tables.prete || []).length, occupees: (acc.tables.occupee || []).length, aRemettre: acc.aRemettre.length, indisponibles: (acc.tables.indisponible || []).filter((t) => !t.horsSaison).length },
    assemblages: acc.plan.assemblages.filter((a) => a.resas.length).map((a) => ({ id: a.id, places: a.places, resas: a.resas })),
    attente: liste.filter((e) => ['en-attente', 'proposee', 'expiree'].includes(e.etat)), attenteCompatibles: ctx.exemples === false ? [] : compatiblesPour(ctx, S, salle, iso, sv) };
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
  /* 2 bis (v7.11.0). Pendant le service du jour : les retards, les groupes qui attendent leur table, les tables pas prêtes, une place à proposer. */
  if (ps && ps.date === ctx.auj) { const p = presenceDuService(ctx, S, salle, ps.date, ps.service), vers = { vue: 'resas', onglet: 'service', jour: ps.date, service: ps.service }, noms = (l) => l.slice(0, 3).map((x) => `${x.nom || 'Sans nom'} (${heure(x.heure)}, ${pluriel(+x.couverts, 'couvert')})`).join(' · ');
    if (p.aInstaller.length) out.unshift({ id: `installer-${ps.date}-${ps.service}`, genre: 'salle', titre: `${pluriel(p.aInstaller.length, 'groupe')} ${p.aInstaller.length > 1 ? 'sont arrivés et attendent' : 'est arrivé et attend'} une table`, raison: `${noms(p.aInstaller)}. Arrivé ne veut pas dire installé : choisissez une table prête.`, bouton: 'Les installer', aller: vers });
    if (p.retards.length) out.push({ id: `retard-${ps.date}-${ps.service}`, genre: 'salle', titre: `${pluriel(p.retards.length, 'groupe')} en retard`, raison: `${p.retards.slice(0, 3).map((x) => `${x.nom || 'Sans nom'}, attendu à ${heure(x.heure)} (${x.retard} min)`).join(' · ')}. Pas de nouvelle n'est pas une annulation : la table reste gardée tant que vous ne décidez pas.`, bouton: 'Voir le service', aller: vers });
    if (p.bloquees.length) out.push({ id: `table-${ps.date}-${ps.service}`, genre: 'salle', titre: `Table ${p.bloquees[0].table.id} pas prête pour ${p.bloquees[0].resa.nom || 'la réservation suivante'}`, raison: `Attendu à ${heure(p.bloquees[0].resa.heure)} : ${p.bloquees[0].raison}.${p.bloquees.length > 1 ? ` ${pluriel(p.bloquees.length - 1, 'autre table')} dans le même cas.` : ''}`, bouton: 'Voir les tables', aller: vers });
    else if (p.aRemettre.length) out.push({ id: `remettre-${ps.date}-${ps.service}`, genre: 'salle', titre: `${pluriel(p.aRemettre.length, 'table')} à remettre en état`, raison: `${p.aRemettre.map((t) => `table ${t.id}`).join(', ')}. Une table vide n'est pas encore une table prête.`, bouton: 'Voir les tables', aller: vers });
  }
  for (const [id, v] of Object.entries(ctx.venues || {})) { if (!v?.modif) continue; const r = trouverResa(ctx, S, id); if (!r || ['annulee', 'refusee', 'absente'].includes(r.statut) || r.date < ctx.auj) continue;
    out.unshift({ id: `venue-${id}`, genre: 'venue', titre: `${r.nom || 'Un client'} demande à changer sa réservation`, raison: `${heure(v.modif.heure)}, ${pluriel(+v.modif.couverts, 'couvert')} au lieu de ${heure(r.heure)}, ${pluriel(+r.couverts, 'couvert')}, ${fmt(r.date, { weekday: 'long', day: 'numeric', month: 'long' })}. La réservation actuelle est gardée tant que vous n'avez pas répondu.`, bouton: 'Répondre', aller: { vue: 'resas', onglet: 'service', jour: r.date, service: r.service } }); }
  if (ctx.exemples !== false) { const comp = attenteAvecPossibles(ctx, S, salle).filter((e) => e.etat === 'en-attente' && e.possibles.length && e.date <= ajouter(ctx.auj, 2));
    if (comp.length) out.push({ id: `attente-${comp[0].id}`, genre: 'attente', titre: `Une place peut être proposée à ${comp[0].nom} (liste d'attente)`, raison: `${pluriel(comp[0].couverts, 'personne')}, ${fmt(comp[0].date, { weekday: 'long', day: 'numeric', month: 'long' })} à ${heure(comp[0].possibles[0].heure)}.${comp.length > 1 ? ` ${pluriel(comp.length - 1, 'autre demande')} ensuite, par ordre d'inscription.` : ''}`, bouton: 'Ouvrir la liste d\'attente', aller: { vue: 'resas', onglet: 'attente' } }); }
  /* 2 ter (v7.12.0). Les réceptions qui demandent une action : visite du jour, option proche de son échéance, demande ou accord du client, préparatifs, réception du jour. */
  if (ctx.exemples !== false) { const lib = { visite: 'Une visite aujourd\'hui.', echeance: 'À l\'échéance, les espaces sont libérés ; le dossier reste suivi.', client: 'Tant que vous n\'avez pas répondu, ce qui est convenu reste inchangé.', preparatifs: 'Le jour J approche.', jourj: 'La fiche du jour J rassemble tout ce que l\'équipe doit savoir.', relance: 'Une action notée dans le dossier a dépassé sa date.' };
    const vers = { visite: 'projet', echeance: 'espaces', client: 'client', preparatifs: 'jourj', jourj: 'jourj', relance: 'projet' };
    for (const p of prioritesReceptions(ctx, S, (id) => tachesLiees(S, 'reception', id)).reverse()) { const c = { id: `rec-${p.genre}-${p.dossier}`, genre: 'dossier', titre: p.texte, raison: lib[p.genre] || '', bouton: 'Ouvrir le dossier', aller: { dossier: p.dossier, onglet: /accord/.test(p.texte) ? 'espaces' : vers[p.genre] } }; if (p.urgent) out.unshift(c); else out.push(c); } }
  /* 3. Une tâche en retard : la plus ancienne. */
  const retard = tachesEnRetard(S, ctx.auj);
  if (retard.length) out.push({ id: `tache-${retard[0].id}`, genre: 'tache', titre: `En retard : ${retard[0].titre}`, raison: `Prévue pour ${fmt(retard[0].echeance)}.${retard.length > 1 ? ` ${pluriel(retard.length - 1, 'autre tâche')} dans le même cas.` : ''}`, bouton: 'Voir la tâche', aller: { vue: 'jour', ancre: 't-taches' } });
  /* 4. Le reste de ce que l'espace sait déduire : service presque plein, demande sans réponse, soirée sans prix, fermeture sans annonce. */
  out.push(...proches.filter((c) => c.genre !== 'table'));
  /* « Plus tard » : une priorité mise de côté revient demain si elle est toujours vraie (comme les suggestions). */
  const tu = S.conseils?.ignores || {};
  return out.filter((c) => tu[c.id] !== ctx.auj).map((c) => ({ ...c, raison: c.raison || c.detail || '', directe: /^(placer|tache|installer|retard|table|remettre|attente|venue|rec)-/.test(c.id) }));
}

const STATUT_EV = (x) => (x.masque ? 'Masquée sur le site' : 'Affichée sur le site');
/** Ce qui a une date ce jour-là, en dehors des réservations de table : soirées, réceptions demandées ou signées, retraits traiteur. */
export function activitesDuJour(ctx, S, iso) {
  const out = [];
  /* v7.13.0 : la même soirée partout ; l'équipe voit aussi ses brouillons, avec leur repère, et les réservations qui lui sont liées. */
  const pub = new Set(evenements(ctx.agenda || [], { evenements: contenuPublie(S, 'evenements') || {} }).filter((x) => !x.masque).map((x) => x.id)), prep = (id) => !!attentePub({ agenda: ctx.agenda || [] }, S, 'soiree', id);
  const toutes = ctx.resasSoirees ? ctx.resasSoirees(S) : [], liees = (id) => { const r = resasDeSoiree(toutes, id), n = r.reduce((a, y) => a + (+y.couverts || 0), 0); return r.length ? `${pluriel(r.length, 'réservation')} ${r.length > 1 ? 'liées' : 'liée'} (${pluriel(n, 'couvert')})` : ''; };
  for (const x of evenements(ctx.agenda || [], S)) { if (String(x.debut).slice(0, 10) !== iso) continue; const h = String(x.debut).slice(11, 16);
    out.push({ cle: `ev-${x.id}`, type: 'soiree', libelleType: x.type || 'Soirée', heure: h || (x.service === 'midi' ? '12:00' : '19:00'), heureConnue: !!h, titre: x.titre, detail: [x.prix || '', liees(x.id)].filter(Boolean).join(' · '), statut: prep(x.id) ? (pub.has(x.id) ? 'Modification en préparation' : 'Brouillon, pas encore sur le site') : STATUT_EV(x), ferme: !x.masque && pub.has(x.id), brouillon: prep(x.id), aller: { vue: 'carte', onglet: 'soirees', editer: x.id } }); }
  for (const d of demandes(ctx, S)) {
    /* v7.12.0 : une demande qui a un dossier ouvre ce dossier ; dès que le dossier retient des espaces ou est classé, c'est lui qui parle (plus bas). */
    const dossier = d.genre === 'reception' && ctx.exemples !== false ? dossierDeDemande(S, d.id) : null;
    if (dossier && (['option', 'ferme'].includes(etatRetenue(dossier, instantCtx(ctx)).etat) || dossier.cloture || (dossier.jour && dossier.jour !== iso))) continue;
    if (d.genre === 'reception' && d.brut.date === iso && d.statut !== 'perdue') { const signee = d.statut === 'signe';
      /* Une demande avec une date souhaitée reste une demande : elle n'occupe rien tant qu'elle n'est pas signée. */
      out.push({ cle: `dem-${d.id}`, type: 'reception', libelleType: 'Réception', heure: '', heureConnue: false, titre: `${d.qui} · ${d.titre}`, detail: signee ? '' : 'Date souhaitée par le client : rien n\'est réservé.', statut: signee ? 'Signée' : `Demande · ${libelleEtape(d.genre, d.statut)}`, ferme: signee, aller: dossier ? { dossier: dossier.id } : { vue: 'demandes', filtre: 'tout', demande: d.id } }); }
    /* v7.14.0 : le retrait d'une commande à emporter se lit sur la commande telle que l'équipe la suit (jour et créneau
       modifiés compris) ; il mène à son dossier. Une commande ne compte dans aucun couvert. */
    if (d.genre === 'traiteur') { const k = S.commerce?.commandes?.[d.id], jour = k?.jour || d.brut.jour, moment = k?.moment || d.brut.moment, conf = d.statut !== 'nouvelle';
      if (jour === iso && !['annulee', 'retiree', 'refusee'].includes(d.statut)) out.push({ cle: `dem-${d.id}`, type: 'retrait', libelleType: 'Retrait traiteur', heure: moment === 'midi' ? '12:00' : moment === 'soir' ? '19:00' : '', heureConnue: false,
        titre: `${d.qui} · ${k ? k.lignes.map((l) => l.nom).join(', ') : (d.brut.produits || []).map((p) => `${p.qte} × ${p.nom}`).join(', ')}`, detail: moment === 'midi' ? 'À midi' : moment === 'soir' ? 'Le soir' : '', statut: conf ? libelleEtape(d.genre, d.statut) : 'Demande à décider', ferme: conf, aller: { commande: d.id } }); }
  }
  /* v7.12.0 : les visites, les options encore valables et les réceptions confirmées, relues depuis les dossiers. Le libellé dit l'état ; la couleur ne fait que l'accompagner. */
  if (ctx.exemples !== false) for (const x of receptionsDuJour(ctx, S, iso))
    out.push({ cle: `rec-${x.type}-${x.dossier}`, type: x.type === 'confirmee' ? 'reception-ferme' : x.type, libelleType: x.type === 'visite' ? 'Visite' : x.type === 'option' ? 'Réception · option' : 'Réception', heure: x.heure && x.heure !== '00:00' ? x.heure : '', heureConnue: !!x.heure && x.heure !== '00:00',
      titre: x.titre, detail: x.detail, statut: x.libelle, ferme: x.type === 'confirmee', aller: { dossier: x.dossier, onglet: x.type === 'visite' ? 'projet' : 'espaces' } });
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
