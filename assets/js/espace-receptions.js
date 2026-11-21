/* Les réceptions de A à Z (v7.12.0) : les règles, en fonctions pures (testées par `node --test _audit/tests/*.test.mjs`).

   Un DOSSIER par réception, et un seul : `S.receptions.dossiers[id]`. Né d'une demande (`rec-<demande>`), il garde son
   identifiant quand il change de date ou d'étape. Tout ce que montrent le suivi, l'agenda, Aujourd'hui, la fiche client,
   la page du client et la fiche du jour J est relu depuis lui : aucune copie.

   Trois choses avancent séparément, et l'écran les dit séparément :
   1. l'avancement commercial : à qualifier, proposition en préparation, proposition présentée, accord du client
      (simulation), réception confirmée, terminée ou sans suite ;
   2. la retenue des espaces : aucune, option (jusqu'à une échéance), option expirée, espaces réservés, libérés ;
   3. la préparation : les informations du jour J et les tâches.
   Une demande, une visite, une proposition ne retiennent rien. Seules une option encore valable et une réception
   confirmée occupent des espaces, de la préparation à la remise en état (voir disponibilites.js).

   Les propositions sont versionnées : un brouillon se modifie ; une proposition présentée est un instantané gardé tel
   quel ; la modifier crée une nouvelle version. Les montants de démonstration sont des exemples : aucune taxe, aucun
   acompte, aucune condition n'est affirmé (« À renseigner »).

   Le client agit depuis « Votre réception » : ce qu'il fait est noté à part (espace-stock.js, `venues`, sous
   l'identifiant du dossier) ; l'équipe garde la main. Un accord du client est une simulation : il ne confirme rien.
   Portée : démonstration, sur cet appareil. Rien n'est envoyé, rien n'est signé, rien n'est encaissé. */
import { enMin, hhmm, ajouter, servicesDe, instantDe, seCroisent, retenueActive, occupationsActives, fenetreService } from './disponibilites.js?v=7';
import { fmt, maj, heure, pluriel, instantCtx, etatDuService, evenements } from './espace-regles.js?v=7';
import { planDuService, placerTout, placeDe, nomPlace } from './espace-salle.js?v=7';

/* ---------- Les mots ---------- */
export const PHASES = [['a-qualifier', 'À qualifier'], ['proposition', 'Proposition'], ['decision', 'Décision attendue'], ['preparation', 'Préparation'], ['termine', 'Terminé']];
export const HORAIRES = [['preparation', 'Préparation'], ['arrivee', 'Arrivée des invités'], ['repas', 'Repas'], ['fin', 'Fin de la réception'], ['remise', 'Fin de la remise en état']];
export const TYPES_CHANGEMENT = { horaire: 'Les horaires', effectif: 'Le nombre d\'invités', espace: 'L\'espace', prestation: 'Une prestation' };
const court = (t) => String(t || '').slice(0, 16);
const propre = (t, max = 400) => String(t ?? '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, max);
const entier = (v) => { const n = Math.round(+v); return Number.isFinite(n) && n > 0 ? n : 0; };
/** « 1 800 € », « 45,50 € ». */
export const euros = (n) => { const v = Math.round((+n || 0) * 100) / 100, [e, d] = v.toFixed(2).split('.'); return `${e.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}${d === '00' ? '' : `,${d}`} €`; };
const jourLong = (iso) => fmt(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
/** « samedi 12 juin à 17 h » pour un instant « AAAA-MM-JJTHH:MM ». */
export const instantDit = (t, avecAnnee = false) => (t ? `${fmt(t.slice(0, 10), { weekday: 'long', day: 'numeric', month: 'long', ...(avecAnnee ? { year: 'numeric' } : {}) })} à ${heure(t.slice(11, 16))}` : '');

/* ---------- Le dossier ---------- */
export const idDossier = (demande) => `rec-${demande}`;
export const dossiersDe = (S) => Object.values(S?.receptions?.dossiers || {});
export const dossierDe = (S, id) => S?.receptions?.dossiers?.[id] || null;
export const dossierDeDemande = (S, demande) => dossiersDe(S).find((d) => d.demande === demande) || null;
/** Ce que le client a fait depuis sa page, pour ce dossier (jamais absent : des listes vides). */
export const actionsClient = (venues, id) => ({ accord: null, questions: [], infos: {}, changements: [], ...(venues?.[id] || {}) });

/**
 * Le dossier d'une demande de réception, prêt à être enregistré : rien n'est ressaisi. `d` : la demande mise en forme
 * (espace-demandes.js, `normaliser`). La date demandée reste un souhait ; aucune date n'est retenue, aucun espace n'est pris.
 */
export function dossierDepuisDemande(d, { cree, lieux } = {}) {
  const b = d.brut || {}, occasion = propre(b.occasion || 'Une réception', 80), intitule = `${maj(occasion.replace(/^une? /i, ''))} · ${d.qui}`;
  const envisage = (lieux?.espaces || []).find((e) => simple(e.nom).includes(simple(b.espace || '§')) || simple(b.espace || '').includes(simple(e.nom.replace(/^(la|le|les) /i, ''))));
  return { id: idDossier(d.id), demande: d.id, cree, source: d.source === 'demo' ? 'demo' : 'site',
    client: { nom: d.qui, prenom: d.prenom || '', telephone: d.telephone || '', email: d.email || '', ...(b.clientId ? { clientId: b.clientId } : {}) }, contacts: [], responsable: '',
    projet: { occasion, intitule, attentes: propre(b.message, 600), invitesAnnonces: entier(b.invites), invitesConfirmes: 0, contraintes: '' },
    souhait: { date: /^\d{4}-\d{2}-\d{2}$/.test(b.date || '') ? b.date : '', periode: propre(b.periode, 60), espace: propre(b.espace, 60) },
    jour: '', horaires: {}, espaces: { envisages: envisage ? [envisage.id] : [], retenus: [] }, visite: null, qualifie: false,
    retenue: null, propositions: [], courante: 0, accordEquipe: null, cloture: null,
    suivi: { prochaine: '', echeance: '', notes: d.note || '', partage: '' }, portail: { infos: [], reponses: {}, decisions: {} }, jourJ: { configuration: '', cuisine: '', accueil: '' },
    historique: [{ le: cree, quoi: `Dossier créé à partir de la demande reçue le ${fmt(String(d.cree).slice(0, 10), { day: 'numeric', month: 'long' })}.` }] };
}
const simple = (t) => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/* ---------- Les espaces et leurs ressources ---------- */
export const espaceDe = (lieux, id) => (lieux?.espaces || []).find((e) => e.id === id) || null;
export const nomsEspaces = (lieux, ids = []) => ids.map((id) => espaceDe(lieux, id)?.nom || id);
/** La capacité d'un espace : celle que la maison indique ; pour une zone du plan de démonstration, la somme des places de ses tables ; sinon inconnue (null : « à renseigner »). */
export function capaciteEspace(e, salle) {
  if (Number.isFinite(+e?.capacite) && +e.capacite > 0) return +e.capacite;
  if (e?.source !== 'plan') return null;
  const t = (e?.tables || []).map((id) => (salle?.tables || []).find((x) => String(x.id) === String(id))?.places || 0).reduce((a, b) => a + b, 0);
  return t || null;
}
/**
 * Ce que retiennent ces espaces : { espaces, tables, salle, terrasse, capacite, inconnues }.
 * Une zone et ses tables sont la même ressource : « la salle du restaurant » contient « le coin du feu ». Choisir les
 * deux ne compte pas la capacité deux fois. salle, terrasse : tout l'espace que le site propose à la réservation est pris.
 */
export function ressources(lieux, salle, ids = []) {
  const choisis = [...new Set(ids)].map((id) => espaceDe(lieux, id)).filter(Boolean), tables = [...new Set(choisis.flatMap((e) => (e.tables || []).map(String)))];
  const utiles = choisis.filter((e) => !(e.partie && choisis.some((p) => p.id === e.partie)));
  const caps = utiles.map((e) => capaciteEspace(e, salle)), tout = (pub) => { const e = (lieux?.espaces || []).find((x) => x.public === pub); return !!e && (e.tables || []).length > 0 && e.tables.every((t) => tables.includes(String(t))); };
  return { espaces: choisis.map((e) => e.id), tables, salle: tout('salle'), terrasse: tout('terrasse'), capacite: caps.length && caps.every((c) => c != null) ? caps.reduce((a, b) => a + b, 0) : null, inconnues: utiles.filter((e, i) => caps[i] == null).map((e) => e.nom) };
}

/* ---------- Les horaires et la période opérationnelle ---------- */
/**
 * La chronologie d'une réception : chaque temps renseigné, dans l'ordre, en minutes comptées depuis minuit du jour J.
 * Une heure plus petite que la précédente est le lendemain (fin à 1 h du matin : 1500).
 * @returns {{ etapes: { cle, libelle, heure, min, instant, lendemain }[], debut: string, fin: string, complet: boolean, lendemain: boolean, alerte: string }}
 */
export function chronologie(jour, horaires = {}) {
  let avant = -1; const etapes = [];
  for (const [cle, libelle] of HORAIRES) { const t = horaires[cle]; if (!/^\d{1,2}:\d{2}$/.test(t || '')) continue; let m = enMin(t); while (m < avant) m += 1440; avant = m;
    etapes.push({ cle, libelle, heure: hhmm(m), min: m, instant: jour ? instantDe(jour, m) : '', lendemain: m >= 1440 }); }
  const a = etapes[0], z = etapes[etapes.length - 1], complet = !!jour && ['preparation', 'arrivee', 'fin', 'remise'].every((k) => etapes.some((e) => e.cle === k));
  return { etapes, debut: a?.instant || '', fin: z?.instant || '', complet, lendemain: !!z?.lendemain,
    alerte: a && z && z.min - a.min > 20 * 60 ? 'Vérifiez les horaires : la réception durerait plus de vingt heures.' : a && z && z.min === a.min ? 'La période est vide : la fin doit suivre le début.' : '' };
}
/** Les horaires complétés avec les durées d'exemple : préparation avant l'arrivée, remise en état après la fin. Ce qui est déjà saisi est gardé. */
export function completerHoraires(h = {}, durees = {}) {
  const out = { ...h }, t = (x) => /^\d{1,2}:\d{2}$/.test(x || '');
  if (t(out.arrivee) && !t(out.preparation)) out.preparation = hhmm(enMin(out.arrivee) - (durees.preparation ?? 120) + 1440);
  if (t(out.fin) && !t(out.remise)) out.remise = hhmm(enMin(out.fin) + (durees.remise ?? 60));
  return out;
}
/** L'échéance d'exemple d'une option : dans N jours à 18 h, sans dépasser la veille de la réception à 18 h. */
export function echeanceParDefaut(maintenant, jour, durees = {}) {
  const dans = `${ajouter(court(maintenant).slice(0, 10), durees.option_jours ?? 7)}T18:00`, veille = jour ? `${ajouter(jour, -1)}T18:00` : dans;
  return dans < veille ? dans : veille;
}

/* ---------- Où en est le dossier ---------- */
/** La retenue des espaces, telle qu'elle est à cet instant : { etat: 'aucune'|'option'|'expiree'|'ferme'|'liberee', libelle, phrase, echeance }. */
export function etatRetenue(d, maintenant = '') {
  const r = d?.retenue;
  if (!r) return { etat: 'aucune', libelle: 'Aucun espace retenu', phrase: 'Aucun espace n\'est retenu : rien n\'est bloqué dans l\'agenda.', echeance: '' };
  if (r.etat === 'ferme') return { etat: 'ferme', libelle: 'Espaces réservés', phrase: `Espaces réservés du ${instantDit(r.debut)} au ${instantDit(r.fin)}.`, echeance: '' };
  if (r.etat === 'liberee') return { etat: 'liberee', libelle: 'Espaces libérés', phrase: `Espaces libérés${r.raison ? ` : ${r.raison}` : ''}.`, echeance: '' };
  if (retenueActive(r, maintenant)) return { etat: 'option', libelle: 'Option posée', phrase: `Option jusqu'au ${instantDit(r.echeance)} : les espaces sont retenus, pas encore réservés.`, echeance: r.echeance };
  return { etat: 'expiree', libelle: 'Option expirée', phrase: `L'option a expiré le ${instantDit(r.echeance)} : les espaces sont de nouveau libres. Le dossier reste suivi.`, echeance: r.echeance };
}
export const versionsDe = (d) => [...(d?.propositions || [])].sort((a, b) => a.v - b.v);
export const brouillonDe = (d) => (d?.propositions || []).find((p) => p.etat === 'brouillon') || null;
/** La version courante : la dernière proposition présentée au client (null tant qu'aucune ne l'a été). */
export const couranteDe = (d) => (d?.propositions || []).find((p) => p.v === d.courante && p.etat === 'presentee') || null;
export const totalLigne = (l) => Math.round((+l.qte || 0) * (+l.pu || 0) * 100) / 100;
export const totalProposition = (p) => Math.round((p?.lignes || []).reduce((n, l) => n + totalLigne(l), 0) * 100) / 100;
/** L'accord sur la version courante : { version, le, par: 'client' | 'equipe' } ou null. Un accord sur une ancienne version ne vaut plus. */
export function accordDe(d, v = {}) {
  const c = couranteDe(d); if (!c) return null;
  if (v.accord?.version === c.v) return { version: c.v, le: v.accord.le, par: 'client' };
  return d.accordEquipe?.version === c.v ? { version: c.v, le: d.accordEquipe.le, par: 'equipe' } : null;
}
/**
 * L'étape principale : { id, libelle, phase }. Elle se déduit des faits du dossier, jamais d'un curseur à part.
 * `v` : ce que le client a fait (accord simulé).
 */
export function etapeDe(d, v = {}, maintenant = '') {
  const dit = (id, libelle, phase) => ({ id, libelle, phase });
  if (d.cloture?.etat === 'sans-suite') return dit('sans-suite', 'Sans suite', 'termine');
  if (d.cloture?.etat === 'terminee') return dit('terminee', 'Réception terminée', 'termine');
  if (d.retenue?.etat === 'ferme') return dit('confirmee', 'Réception confirmée', 'preparation');
  const c = couranteDe(d), b = brouillonDe(d), accord = accordDe(d, v);
  if (accord) return dit('accord', `Accord du client — simulation (version ${accord.version})`, 'decision');
  if (c && !b) return dit('presentee', `Proposition présentée (version ${c.v})`, 'decision');
  if (b) return dit('brouillon', c ? `Nouvelle version en préparation (version ${b.v})` : 'Proposition en préparation', 'proposition');
  if (d.qualifie) return dit('qualifie', 'Projet qualifié', 'proposition');
  return dit('a-qualifier', 'À qualifier', 'a-qualifier');
}
/** Ce que le client attend de l'équipe : questions sans réponse, changements sans décision. */
export function attentesClient(d, v = {}) {
  return { questions: (v.questions || []).filter((q) => !d.portail?.reponses?.[q.id]), changements: (v.changements || []).filter((c) => !d.portail?.decisions?.[c.id]),
    infos: (d.portail?.infos || []).filter((i) => !v.infos?.[i.id]) };
}
/**
 * La prochaine action : { texte, echeance, retard, origine: 'equipe' | 'regle' }. Celle que l'équipe a notée passe d'abord ;
 * sinon elle se déduit du dossier. `taches` : les tâches liées, `auj` : le jour.
 */
export function prochaineAction(d, v = {}, { maintenant = '', auj = court(maintenant).slice(0, 10), taches = [] } = {}) {
  const e = etapeDe(d, v, maintenant), ret = etatRetenue(d, maintenant), att = attentesClient(d, v), dit = (texte, echeance = '') => ({ texte, echeance, retard: !!echeance && echeance.slice(0, 10) < auj, origine: 'regle' });
  if (e.phase === 'termine') return dit('');
  if (att.changements.length) return dit('Répondre à la demande de changement du client');
  if (att.questions.length) return dit('Répondre à la question du client');
  if (d.suivi?.prochaine) return { texte: d.suivi.prochaine, echeance: d.suivi.echeance || '', retard: !!d.suivi.echeance && d.suivi.echeance < auj, origine: 'equipe' };
  if (e.id === 'confirmee') {
    if (d.jour && d.jour < auj) return dit('Clôturer le dossier : la réception a eu lieu');
    if (d.jour === auj) return dit('Réception aujourd\'hui : suivre la fiche du jour J', d.jour);
    const reste = taches.filter((t) => !t.fait); return dit(reste.length ? `Préparer le jour J : ${pluriel(reste.length, 'tâche')} à faire` : 'Préparer le jour J', reste.map((t) => t.echeance).filter(Boolean).sort()[0] || d.jour);
  }
  if (e.id === 'accord') return dit('Confirmer la réception : le client a donné son accord', ret.echeance);
  if (ret.etat === 'expiree') return dit('Option expirée : en poser une nouvelle ou classer le dossier');
  if (e.id === 'presentee') return dit(ret.etat === 'option' ? 'Relancer le client avant la fin de l\'option' : 'Attendre la réponse du client, ou le relancer', ret.echeance || couranteDe(d)?.validite || '');
  if (e.id === 'brouillon') return dit('Terminer la proposition et la présenter au client');
  if (d.visite?.date && !d.visite.faite) return dit(`Visite ${fmt(d.visite.date, { weekday: 'long', day: 'numeric', month: 'long' })}${d.visite.heure ? ` à ${heure(d.visite.heure)}` : ''}`, d.visite.date);
  if (e.id === 'qualifie') return dit('Préparer une proposition');
  return dit('Qualifier le projet : date, invités, espaces');
}

/* ---------- Les conflits, avant toute validation ---------- */
/** Les jours et services dont la fenêtre croise une période : [{ iso, service, libelle }]. */
export function servicesTouches(R, periode) {
  const out = []; if (!periode?.debut || !periode?.fin) return out;
  for (let iso = ajouter(periode.debut.slice(0, 10), -1); iso <= periode.fin.slice(0, 10); iso = ajouter(iso, 1))
    for (const s of servicesDe(R)) { const f = fenetreService(R, iso, s.id); if (f && seCroisent(f, periode)) out.push({ iso, service: s.id, libelle: `${fmt(iso, { weekday: 'long', day: 'numeric', month: 'long' })}, ${s.id === 'midi' ? 'le midi' : 'le soir'}` }); }
  return out;
}
/**
 * Ce qui empêche de retenir ces espaces sur cette période, et ce qu'il faut savoir.
 * `p` : { jour, horaires, espaces, invites }. Vérifie : la saison des espaces, leur capacité, les autres réceptions et
 * options encore valables, les réservations du restaurant déjà prises (sur les tables concernées, pour tout service
 * que la période croise, préparation et remise en état comprises), les fermetures.
 * @returns {{ periode, res, bloquants: { type, texte }[], attentions: string[], resas: { iso, service, resa, table }[], services }}
 */
export function conflits(ctx, S, salle, d, p) {
  const lieux = ctx.lieux, bloquants = [], attentions = [], resas = [], non = (type, texte) => bloquants.push({ type, texte });
  const h = p.horaires || {}, ch = chronologie(p.jour, h), res = ressources(lieux, salle, p.espaces || []), periode = { debut: ch.debut, fin: ch.fin }, invites = entier(p.invites);
  if (!p.jour) non('incomplet', 'Choisissez la date de la réception.');
  if (!res.espaces.length) non('incomplet', 'Choisissez au moins un espace.');
  if (p.jour && !ch.complet) non('incomplet', `Il manque un horaire : ${HORAIRES.filter(([k]) => k !== 'repas' && !ch.etapes.some((e) => e.cle === k)).map(([, l]) => l.toLowerCase()).join(', ')}.`);
  if (ch.alerte) non('horaires', ch.alerte);
  if (bloquants.length) return { periode, res, bloquants, attentions, resas, services: [] };
  if (ctx.auj && p.jour < ctx.auj) non('passee', 'Cette date est déjà passée.');
  /* La saison et la capacité. */
  for (const id of res.espaces) { const e = espaceDe(lieux, id); if (e.mois && !e.mois.includes(+p.jour.slice(5, 7))) non('saison', `${e.nom} n'est pas ouvert à cette date : de juin à septembre seulement.`); }
  if (res.capacite != null && invites > res.capacite) non('capacite', `${pluriel(invites, 'invité')} pour une capacité de ${res.capacite} (${nomsEspaces(lieux, res.espaces).join(', ')}) : choisissez un espace plus grand, ou ajoutez-en un.`);
  if (res.inconnues.length) attentions.push(`Capacité à renseigner : ${res.inconnues.join(', ')}. L'effectif n'est pas contrôlé pour ${res.inconnues.length > 1 ? 'ces espaces' : 'cet espace'}.`);
  /* Les autres réceptions et options encore valables. */
  for (const o of occupationsActives(S, instantCtx(ctx))) {
    if (o.id === d?.id || !seCroisent(o, periode)) continue;
    const communs = [...new Set([...o.espaces.filter((x) => res.espaces.includes(x)), ...(o.tables.some((t) => res.tables.includes(t)) ? res.espaces.filter((id) => (espaceDe(lieux, id)?.tables || []).some((t) => o.tables.includes(String(t)))) : [])])];
    if (communs.length) non('reception', `${nomsEspaces(lieux, communs).join(', ')} : déjà ${o.type === 'option' ? `retenu par une option (jusqu'au ${instantDit(o.echeance)})` : 'réservé'} du ${instantDit(o.debut)} au ${instantDit(o.fin)} pour « ${o.intitule} ».`);
  }
  /* Une soirée annoncée sur le site ces jours-là : à savoir avant de décider (elle n'est pas déplacée d'office). */
  for (const x of evenements(ctx.agenda || [], S)) { const j = String(x.debut).slice(0, 10); if (!x.masque && j >= periode.debut.slice(0, 10) && j <= periode.fin.slice(0, 10) && res.tables.length) attentions.push(`Une soirée est annoncée sur le site le ${fmt(j, { weekday: 'long', day: 'numeric', month: 'long' })} (${x.titre}) : à déplacer, ou à tenir ailleurs.`); }
  /* Les réservations du restaurant, service par service. */
  const services = res.tables.length ? servicesTouches(ctx.R, periode) : [];
  for (const s of services) {
    const plan = planDuService(ctx, S, salle, s.iso, s.service), ouvertes = plan.tables.filter((t) => !t.horsSaison), prises = new Set(res.tables);
    for (const r of plan.placees) { const sur = (parIdAss(plan, r.table) || [String(r.table)]).filter((t) => prises.has(t)); if (sur.length) { resas.push({ ...s, resa: r, table: String(r.table) });
      non('resa', `${maj(nomPlace(r.table))} : ${r.nom || 'une réservation'}, ${s.libelle} à ${heure(r.heure)}, ${pluriel(+r.couverts, 'couvert')}.`); } }
    const restent = ouvertes.filter((t) => !prises.has(t.id) && !(t.reception && t.reception.id !== d?.id));
    if (plan.aPlacer.length && !restent.length) non('resa', `${pluriel(plan.aPlacer.length, 'réservation')} sans table ${s.libelle} : il ne resterait aucune table au restaurant.`);
    else if (plan.aPlacer.length) attentions.push(`${pluriel(plan.aPlacer.length, 'réservation')} sans table ${s.libelle} : il restera ${pluriel(restent.reduce((n, t) => n + t.places, 0), 'place')} au restaurant.`);
    const es = etatDuService(ctx, S, s.iso, s.service);
    if (!es.ouvert) attentions.push(`Le restaurant est fermé ${s.libelle}${es.motif ? ` (${es.motif.toLowerCase()})` : ''} : la réception n'y change rien.`);
    else if (res.salle) attentions.push(`Toute la salle est prise ${s.libelle} : la page Réserver n'ouvrira pas ce service.`);
  }
  return { periode, res, bloquants, attentions, resas, services };
}
const parIdAss = (plan, id) => (plan.assemblages || []).find((a) => a.id === String(id))?.tables || null;

/**
 * Une proposition de replacement pour les réservations que la réception dérange : un aperçu, rien n'est changé.
 * Chaque réservation reçoit une autre table du même service, hors des tables retenues ; celles qui n'en trouvent pas
 * sont dites. L'application passe par le placement habituel, une réservation après l'autre, avec son bilan.
 * @returns {{ propositions: { iso, service, resa, de, vers, places }[], sansSolution: { resa, raison }[] }}
 */
export function replacement(ctx, S, salle, d, p) {
  const c = conflits(ctx, S, salle, d, p), prises = new Set(c.res.tables), propositions = [], sansSolution = [];
  for (const s of c.services) {
    const plan = planDuService(ctx, S, salle, s.iso, s.service), concernees = c.resas.filter((x) => x.iso === s.iso && x.service === s.service).map((x) => x.resa); if (!concernees.length) continue;
    const ids = new Set(concernees.map((r) => r.id));
    const tables = plan.tables.filter((t) => !prises.has(t.id) && !t.fermee).map((t) => ({ ...t, resas: t.resas.filter((r) => !ids.has(r.id)) }));
    const assemblages = plan.assemblages.filter((a) => !a.tables.some((t) => prises.has(t)) && !a.fermee).map((a) => ({ ...a, composantes: tables.filter((t) => a.tables.includes(t.id)) }));
    const auto = placerTout({ tables, assemblages }, concernees.filter((r) => !r.installe));
    for (const r of concernees) { const vers = auto.places[r.id];
      if (vers) propositions.push({ ...s, resa: r, de: String(r.table), vers, places: placeDe({ tables, assemblages }, vers)?.places || 0 });
      else sansSolution.push({ resa: r, raison: r.installe ? `${r.nom || 'Ce groupe'} est déjà installé : à voir de vive voix.` : `Aucune autre table n'est libre ${s.libelle} à ${heure(r.heure)} pour ${pluriel(+r.couverts, 'couvert')}.` }); }
  }
  return { propositions, sansSolution };
}

/**
 * Les arguments complets d'une retenue (option ou réservation ferme) : la période et les ressources sont calculées ici,
 * une fois, et enregistrées avec elle. `type` : 'option' | 'ferme'.
 */
export function argsRetenue(ctx, salle, d, { type, jour, horaires, espaces, echeance = '', le }) {
  const h = completerHoraires(horaires, ctx.lieux?.durees), ch = chronologie(jour, h), res = ressources(ctx.lieux, salle, espaces);
  return { id: d.id, type, jour, horaires: h, espaces: res.espaces, tables: res.tables, salle: res.salle, terrasse: res.terrasse, debut: ch.debut, fin: ch.fin, echeance: type === 'option' ? court(echeance) : '', le };
}

/* ---------- Le garde-fou : ce que les règles disent d'une action sur un dossier ---------- */
/** '' si l'action est possible, sinon la phrase qui dit pourquoi. Le dossier et les saisies sont toujours gardés. */
export function refusReception(ctx, S, salle, nom, args = {}) {
  const d = dossierDe(S, args.id), v = actionsClient(ctx.venues, args.id), maintenant = instantCtx(ctx);
  if (nom === 'recCreer') return args.dossier?.id && args.dossier?.client?.nom ? '' : 'Ce dossier est incomplet : il lui faut un client.';
  if (!d) return 'Ce dossier est introuvable : il a peut-être été retiré ailleurs.';
  const clos = d.cloture?.etat;
  if (clos && !['recRouvrir', 'recModifier'].includes(nom)) return clos === 'sans-suite' ? 'Ce dossier est classé sans suite : rouvrez-le d\'abord.' : 'Cette réception est terminée.';
  if (nom === 'recModifier') {
    const c = args.champs || {}, touche = ['jour', 'horaires', 'retenus'].some((k) => k in c);
    return touche && retenueActive(d.retenue, maintenant) ? 'Des espaces sont retenus pour ce dossier : la date, les horaires et les espaces se changent avec « Vérifier et déplacer », qui recontrôle les disponibilités.' : '';
  }
  if (nom === 'recRetenir') {
    if (!['option', 'ferme'].includes(args.type)) return 'Cette retenue est inconnue.';
    const c = conflits(ctx, S, salle, d, { jour: args.jour, horaires: args.horaires, espaces: args.espaces, invites: d.projet?.invitesConfirmes || d.projet?.invitesAnnonces });
    if (c.bloquants.length) return `${c.bloquants[0].texte}${c.bloquants.length > 1 ? ` Et ${pluriel(c.bloquants.length - 1, 'autre point')}.` : ''}`;
    if (args.type === 'option') {
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(args.echeance || '')) return 'Donnez une échéance à l\'option : le jour et l\'heure où elle cesse de retenir les espaces.';
      if (court(args.echeance) <= maintenant) return 'L\'échéance de l\'option doit être à venir.';
      if (court(args.echeance) > c.periode.debut) return 'L\'échéance de l\'option doit précéder le début de la préparation.';
      if (d.retenue?.etat === 'ferme') return 'Cette réception est déjà confirmée : ses espaces sont réservés.';
    } else {
      const cour = couranteDe(d); if (!cour) return 'Aucune proposition n\'a été présentée au client : présentez-en une avant de confirmer.';
      if (brouillonDe(d)) return `Une nouvelle version (${brouillonDe(d).v}) est en préparation : présentez-la, ou abandonnez-la, avant de confirmer.`;
      if (!accordDe(d, v)) return `Le client n'a pas donné son accord sur la version ${cour.v} : la confirmation attend son accord.`;
    }
    return '';
  }
  if (nom === 'recPresenter') { const b = brouillonDe(d); if (!b) return 'Il n\'y a pas de brouillon à présenter.'; if (!propre(b.titre)) return 'Donnez un titre à la proposition.'; if (!(b.lignes || []).some((l) => propre(l.libelle))) return 'Ajoutez au moins une prestation.'; return ''; }
  if (nom === 'recNouvelleVersion') return brouillonDe(d) ? 'Une nouvelle version est déjà en préparation.' : couranteDe(d) ? '' : 'Aucune proposition présentée à reprendre.';
  if (nom === 'recAccordEquipe') return couranteDe(d) ? '' : 'Aucune proposition n\'a été présentée.';
  if (nom === 'recDecider') {
    const ch = (v.changements || []).find((x) => x.id === args.changement); if (!ch) return 'Cette demande de changement est introuvable.';
    if (d.portail?.decisions?.[ch.id]) return 'Cette demande a déjà reçu une réponse.';
    if (!args.acceptee) return '';
    const c = consequences(ctx, S, salle, d, ch); return c.bloquants.length ? `${c.bloquants[0].texte} Le changement ne peut pas être accepté tel quel : la situation actuelle est gardée.` : '';
  }
  if (nom === 'recRepondre') return propre(args.texte) ? '' : 'Écrivez la réponse.';
  if (nom === 'recSansSuite') return propre(args.raison) ? '' : 'Indiquez la raison : elle reste dans l\'historique.';
  if (nom === 'recLiberer') return d.retenue && ['option', 'ferme'].includes(d.retenue.etat) ? (propre(args.raison) ? '' : 'Indiquez la raison : elle reste dans l\'historique.') : 'Aucun espace n\'est retenu pour ce dossier.';
  if (nom === 'recTerminer') return d.retenue?.etat === 'ferme' && d.jour && d.jour <= (ctx.auj || '') ? '' : 'Une réception se termine après son jour J.';
  return '';
}

/**
 * Ce que change une demande du client, avant de l'accepter : { lignes: string[], bloquants, attentions, retenue }.
 * `retenue` : les arguments de la nouvelle retenue quand la période ou les espaces changent (null sinon).
 */
export function consequences(ctx, S, salle, d, ch) {
  const lignes = [], val = ch.valeur || {}, invites = d.projet?.invitesConfirmes || d.projet?.invitesAnnonces || 0, active = retenueActive(d.retenue, instantCtx(ctx));
  let p = { jour: d.jour, horaires: d.horaires, espaces: d.espaces?.retenus || [], invites }, bloquants = [], attentions = [], retenue = null;
  if (ch.type === 'effectif') { const n = entier(val.invites); p = { ...p, invites: n }; lignes.push(`Invités : ${invites || 'non précisé'} → ${n}.`);
    const res = ressources(ctx.lieux, salle, p.espaces); if (res.capacite != null) lignes.push(n > res.capacite ? `Capacité des espaces retenus : ${res.capacite}. Elle serait dépassée.` : `Capacité des espaces retenus : ${res.capacite}. Elle suffit.`);
    else if (p.espaces.length) lignes.push(`Capacité à renseigner (${res.inconnues.join(', ')}) : à vérifier avec le client.`); }
  if (ch.type === 'horaire') { const h = completerHoraires({ ...d.horaires, ...(val.arrivee ? { arrivee: val.arrivee, preparation: '' } : {}), ...(val.fin ? { fin: val.fin, remise: '' } : {}) }, ctx.lieux?.durees); p = { ...p, horaires: h };
    const a = chronologie(d.jour, d.horaires), z = chronologie(d.jour, h); lignes.push(`Période occupée : du ${instantDit(a.debut) || 'non fixée'} au ${instantDit(a.fin) || 'non fixée'} → du ${instantDit(z.debut)} au ${instantDit(z.fin)}.`); }
  if (ch.type === 'espace') { p = { ...p, espaces: val.espaces || [] }; lignes.push(`Espaces : ${nomsEspaces(ctx.lieux, d.espaces?.retenus || []).join(', ') || 'aucun'} → ${nomsEspaces(ctx.lieux, p.espaces).join(', ') || 'aucun'}.`); }
  if (ch.type === 'prestation') lignes.push('La proposition présentée n\'est pas modifiée : préparez une nouvelle version si vous acceptez.');
  if (['horaire', 'espace', 'effectif'].includes(ch.type) && d.jour && p.espaces.length) { const c = conflits(ctx, S, salle, d, p); bloquants = c.bloquants; attentions = c.attentions;
    lignes.push(c.bloquants.length ? `${pluriel(c.bloquants.length, 'conflit')} : ${c.bloquants.map((b) => b.texte).join(' ')}` : 'Aucun conflit avec les autres réceptions ni avec les réservations du restaurant.');
    if (active && ch.type !== 'effectif' && !c.bloquants.length) retenue = argsRetenue(ctx, salle, d, { type: d.retenue.etat, jour: d.jour, horaires: p.horaires, espaces: p.espaces, echeance: d.retenue.echeance, le: instantCtx(ctx) }); }
  const cour = couranteDe(d); if (cour && ch.type !== 'horaire') lignes.push(`Proposition version ${cour.v} : elle a été établie avant ce changement. Si vous acceptez, elle sera marquée « à revoir ».`);
  return { lignes, bloquants, attentions, retenue, p };
}

/* ---------- Les mutations ---------- */
const noter = (d, le, quoi) => { (d.historique ||= []).push({ le: court(le), quoi }); };
const prendre = (S, id) => S.receptions?.dossiers?.[id] || null;
const lignePropre = (l, i) => ({ id: String(l.id || `l${i + 1}`), libelle: propre(l.libelle, 120), description: propre(l.description, 300), qte: Math.max(0, Math.round((+l.qte || 0) * 100) / 100), pu: Math.max(0, Math.round((+l.pu || 0) * 100) / 100), unite: propre(l.unite, 30), ...(l.exemple ? { exemple: true } : {}), ...(l.origine ? { origine: String(l.origine).slice(0, 40) } : {}) });
export const MUTATIONS_RECEPTIONS = {
  /** Crée le dossier s'il n'existe pas déjà (même identifiant, ou même demande) : un double clic ne fait rien de plus. */
  recCreer(S, { dossier }) {
    if (!dossier?.id) return; const l = ((S.receptions ||= {}).dossiers ||= {});
    if (l[dossier.id] || (dossier.demande && Object.values(l).some((d) => d.demande === dossier.demande))) return;
    l[dossier.id] = dossier;
  },
  /** Ce que l'équipe renseigne : projet, personnes, souhait, visite, espaces envisagés, suivi, jour J ; et, sans retenue active, la date, les horaires et les espaces retenus. */
  recModifier(S, { id, champs = {}, le = '', quoi = '' }) {
    const d = prendre(S, id); if (!d) return;
    for (const k of ['projet', 'client', 'souhait', 'suivi', 'jourJ']) if (champs[k] && typeof champs[k] === 'object') { d[k] = { ...(d[k] || {}), ...Object.fromEntries(Object.entries(champs[k]).map(([c, x]) => [c, typeof x === 'string' ? propre(x, 800) : x])) }; }
    if (d.projet) { d.projet.invitesAnnonces = entier(d.projet.invitesAnnonces); d.projet.invitesConfirmes = entier(d.projet.invitesConfirmes); }
    if ('responsable' in champs) d.responsable = propre(champs.responsable, 40);
    if ('qualifie' in champs) d.qualifie = !!champs.qualifie;
    if ('visite' in champs) d.visite = champs.visite?.date ? { date: champs.visite.date, heure: champs.visite.heure || '', faite: !!champs.visite.faite } : null;
    if ('envisages' in champs) (d.espaces ||= {}).envisages = [...new Set(champs.envisages || [])];
    if ('jour' in champs) d.jour = /^\d{4}-\d{2}-\d{2}$/.test(champs.jour || '') ? champs.jour : '';
    if ('horaires' in champs) d.horaires = Object.fromEntries(HORAIRES.map(([k]) => [k, /^\d{1,2}:\d{2}$/.test(champs.horaires?.[k] || '') ? hhmm(enMin(champs.horaires[k])) : '']).filter(([, x]) => x));
    if ('retenus' in champs) (d.espaces ||= {}).retenus = [...new Set(champs.retenus || [])];
    if ('contact' in champs && champs.contact?.id) { const c = champs.contact, l = (d.contacts ||= []), i = l.findIndex((x) => x.id === c.id);
      if (c.retirer) { if (i >= 0) l.splice(i, 1); } else { const propreC = { id: String(c.id), nom: propre(c.nom, 80), role: propre(c.role, 60), telephone: propre(c.telephone, 30), email: propre(c.email, 80) }; if (propreC.nom) { if (i >= 0) l[i] = propreC; else l.push(propreC); } } }
    if ('info' in champs && champs.info?.id && propre(champs.info.libelle)) { const l = ((d.portail ||= {}).infos ||= []); if (!l.some((x) => x.id === champs.info.id)) l.push({ id: String(champs.info.id), libelle: propre(champs.info.libelle, 140), demandeeLe: court(le) }); }
    if (quoi) noter(d, le, quoi);
  },
  /** Pose, déplace ou prolonge une option, ou réserve les espaces (confirmation). La date, les horaires et les espaces du dossier sont ceux de la retenue. */
  recRetenir(S, a) {
    const d = prendre(S, a.id); if (!d) return; const avant = d.retenue, deja = avant && ['option', 'ferme'].includes(avant.etat);
    d.jour = a.jour; d.horaires = { ...a.horaires }; (d.espaces ||= {}).retenus = [...a.espaces];
    d.retenue = { etat: a.type, posee: avant?.posee && deja ? avant.posee : court(a.le), debut: a.debut, fin: a.fin, espaces: [...a.espaces], tables: [...a.tables], salle: !!a.salle, terrasse: !!a.terrasse, ...(a.type === 'option' ? { echeance: court(a.echeance) } : { confirmeeLe: court(a.le) }) };
    d.qualifie = true;
    noter(d, a.le, a.type === 'ferme' ? `Réception confirmée : espaces réservés du ${instantDit(a.debut)} au ${instantDit(a.fin)}.`
      : deja && avant.etat === 'option' ? `Option modifiée : du ${instantDit(a.debut)} au ${instantDit(a.fin)}, valable jusqu'au ${instantDit(a.echeance)}.` : `Option posée jusqu'au ${instantDit(a.echeance)} : du ${instantDit(a.debut)} au ${instantDit(a.fin)}.`);
  },
  /** Libère les espaces (option abandonnée, réception annulée) : le dossier et son historique restent. */
  recLiberer(S, { id, raison = '', le = '' }) { const d = prendre(S, id); if (!d?.retenue) return; d.retenue = { ...d.retenue, etat: 'liberee', raison: propre(raison, 200), libereeLe: court(le) }; noter(d, le, `Espaces libérés : ${propre(raison, 200)}.`); },
  /** Enregistre le brouillon de proposition (créé au besoin, avec le numéro de version suivant). Une proposition présentée n'est jamais touchée. */
  recProposition(S, { id, proposition = {}, le = '' }) {
    const d = prendre(S, id); if (!d) return; const l = (d.propositions ||= []); let b = l.find((p) => p.etat === 'brouillon');
    if (!b) { b = { v: Math.max(0, ...l.map((p) => p.v)) + 1, etat: 'brouillon', cree: court(le), titre: '', presentation: '', lignes: [], compris: '', aPreciser: '', validite: '', conditions: '' }; l.push(b); noter(d, le, `Proposition version ${b.v} : brouillon créé.`); }
    for (const k of ['titre', 'presentation', 'compris', 'aPreciser', 'conditions']) if (k in proposition) b[k] = propre(proposition[k], k === 'titre' ? 120 : 1200);
    if ('validite' in proposition) b.validite = /^\d{4}-\d{2}-\d{2}$/.test(proposition.validite || '') ? proposition.validite : '';
    if ('lignes' in proposition) b.lignes = (proposition.lignes || []).map(lignePropre).filter((x) => x.libelle).slice(0, 40);
    d.qualifie = true; delete d.aRevoir;
  },
  /** Abandonne le brouillon en cours (la version présentée reste la version courante). */
  recAbandonnerBrouillon(S, { id, le = '' }) { const d = prendre(S, id); if (!d) return; const b = brouillonDe(d); if (!b) return; d.propositions = d.propositions.filter((p) => p !== b); noter(d, le, `Brouillon de la version ${b.v} abandonné.`); },
  /** Présente le brouillon au client : il devient un instantané, et la version courante. */
  recPresenter(S, { id, le = '' }) {
    const d = prendre(S, id), b = d && brouillonDe(d); if (!b) return;
    b.etat = 'presentee'; b.presenteeLe = court(le); b.total = totalProposition(b); d.courante = b.v; d.accordEquipe = null;
    noter(d, le, `Proposition version ${b.v} présentée au client (${euros(b.total)}, montants d'exemple). Rien n'est envoyé : aperçu.`);
  },
  /** Reprend la version courante dans un nouveau brouillon : l'ancienne version reste consultable, intacte. */
  recNouvelleVersion(S, { id, le = '' }) {
    const d = prendre(S, id), c = d && couranteDe(d); if (!c || brouillonDe(d)) return;
    const v = Math.max(...d.propositions.map((p) => p.v)) + 1;
    d.propositions.push({ v, etat: 'brouillon', cree: court(le), titre: c.titre, presentation: c.presentation, lignes: c.lignes.map((l) => ({ ...l })), compris: c.compris, aPreciser: c.aPreciser, validite: '', conditions: c.conditions });
    noter(d, le, `Proposition version ${v} : brouillon repris de la version ${c.v}.`);
  },
  /** L'équipe note un accord reçu autrement (au téléphone, sur place) sur la version courante. Simulation : rien n'est signé. */
  recAccordEquipe(S, { id, le = '' }) { const d = prendre(S, id), c = d && couranteDe(d); if (!c) return; d.accordEquipe = { version: c.v, le: court(le) }; noter(d, le, `Accord du client sur la version ${c.v}, noté par l'équipe (simulation).`); },
  /** Répond à une question du client. */
  recRepondre(S, { id, question, texte, le = '' }) { const d = prendre(S, id); if (!d || !question) return; ((d.portail ||= {}).reponses ||= {})[question] = { texte: propre(texte, 800), le: court(le) }; noter(d, le, 'Réponse à une question du client.'); },
  /** Décide d'une demande de changement du client. Acceptée : les éléments concernés sont mis à jour ensemble ; refusée : rien ne change. */
  recDecider(S, { id, changement, type, valeur = {}, acceptee, texte = '', retenue = null, le = '' }) {
    const d = prendre(S, id); if (!d || !changement) return;
    ((d.portail ||= {}).decisions ||= {})[changement] = { acceptee: !!acceptee, texte: propre(texte, 600), le: court(le), type };
    if (!acceptee) { noter(d, le, `Demande du client refusée (${(TYPES_CHANGEMENT[type] || 'changement').toLowerCase()}) : la situation convenue est gardée.`); return; }
    if (type === 'effectif') d.projet.invitesConfirmes = entier(valeur.invites);
    if (retenue) MUTATIONS_RECEPTIONS.recRetenir(S, { ...retenue, le });
    else if (type === 'horaire') d.horaires = { ...d.horaires, ...(valeur.arrivee ? { arrivee: valeur.arrivee } : {}), ...(valeur.fin ? { fin: valeur.fin } : {}) };
    else if (type === 'espace') (d.espaces ||= {}).retenus = [...(valeur.espaces || [])];
    if (type !== 'horaire' && couranteDe(d)) d.aRevoir = `Changement accepté le ${fmt(court(le).slice(0, 10), { day: 'numeric', month: 'long' })} (${(TYPES_CHANGEMENT[type] || '').toLowerCase()}) : la proposition version ${d.courante} est à revoir.`;
    noter(d, le, `Demande du client acceptée : ${(TYPES_CHANGEMENT[type] || 'changement').toLowerCase()}.`);
  },
  /** Classe le dossier sans suite : ce qui était retenu est libéré, l'historique et la raison restent. */
  recSansSuite(S, { id, raison = '', le = '' }) {
    const d = prendre(S, id); if (!d) return; d.cloture = { etat: 'sans-suite', raison: propre(raison, 200), le: court(le) };
    if (d.retenue && ['option', 'ferme'].includes(d.retenue.etat)) d.retenue = { ...d.retenue, etat: 'liberee', raison: 'dossier classé sans suite', libereeLe: court(le) };
    noter(d, le, `Dossier classé sans suite : ${propre(raison, 200)}.`);
  },
  recRouvrir(S, { id, le = '' }) { const d = prendre(S, id); if (!d?.cloture) return; delete d.cloture; noter(d, le, 'Dossier rouvert. Aucun espace n\'est retenu : une nouvelle option demande une vérification.'); },
  recTerminer(S, { id, le = '' }) { const d = prendre(S, id); if (!d) return; d.cloture = { etat: 'terminee', le: court(le) }; noter(d, le, 'Réception terminée.'); },
};

/* ---------- Le suivi ---------- */
/**
 * Une ligne du suivi, relue depuis le dossier : ce qu'il faut pour le retrouver et comprendre où il en est.
 * @returns {{ id, client, occasion, intitule, quand, datee, retenue, invites, espaces, etape, phase, prochaine, echeance, attention, exemple }}
 */
export function resume(ctx, d, taches = []) {
  const maintenant = instantCtx(ctx), v = actionsClient(ctx.venues, d.id), e = etapeDe(d, v, maintenant), ret = etatRetenue(d, maintenant), att = attentesClient(d, v), pa = prochaineAction(d, v, { maintenant, auj: ctx.auj, taches });
  const ids = d.espaces?.retenus?.length ? d.espaces.retenus : d.espaces?.envisages || [], p = d.projet || {};
  const attention = att.changements.length ? 'Le client demande un changement' : att.questions.length ? 'Une question du client attend une réponse' : ret.etat === 'expiree' ? 'Option expirée : les espaces sont libres'
    : d.aRevoir ? 'Proposition à revoir' : ret.etat === 'option' && joursEntre(maintenant, ret.echeance) <= 2 ? 'L\'option arrive à échéance' : pa.retard ? 'Action en retard' : '';
  return { id: d.id, client: d.client?.nom || 'Sans nom', occasion: p.occasion || 'Réception', intitule: p.intitule || p.occasion || 'Réception',
    quand: d.jour ? jourLong(d.jour) : d.souhait?.date ? `${jourLong(d.souhait.date)} (souhaitée)` : d.souhait?.periode ? `${d.souhait.periode} (souhaitée)` : 'Date à définir', jour: d.jour || d.souhait?.date || '', datee: !!d.jour,
    invites: p.invitesConfirmes ? `${pluriel(p.invitesConfirmes, 'invité')} ${p.invitesConfirmes > 1 ? 'confirmés' : 'confirmé'}` : p.invitesAnnonces ? `${pluriel(p.invitesAnnonces, 'invité')} ${p.invitesAnnonces > 1 ? 'annoncés' : 'annoncé'}` : 'Effectif à préciser',
    espaces: ids.length ? `${nomsEspaces(ctx.lieux, ids).join(', ')}${d.espaces?.retenus?.length ? '' : ' (envisagé)'}` : 'Espace à choisir', etape: e, phase: e.phase, retenue: ret, prochaine: pa, echeance: ret.etat === 'option' ? ret.echeance : '', attention, exemple: d.source === 'demo' };
}
const joursEntre = (a, b) => (a && b ? Math.round((Date.parse(`${court(b).slice(0, 10)}T12:00:00Z`) - Date.parse(`${court(a).slice(0, 10)}T12:00:00Z`)) / 86400000) : 99);
export const FILTRES_SUIVI = [['tous', 'Tous'], ['echeance', 'Options à échéance'], ['relancer', 'À relancer'], ['client', 'Demandes du client']];
/**
 * Le suivi : les dossiers (et les demandes qui n'en ont pas encore) rangés par phase.
 * @param {object[]} dems les demandes de réception mises en forme ; @param {(id) => object[]} tachesDe les tâches d'un dossier
 * @returns {{ phases: { id, nom, cartes: object[] }[], total: number, trouves: number }}
 */
export function suivi(ctx, S, dems = [], { filtre = 'tous', recherche = '', tachesDe = () => [] } = {}) {
  const maintenant = instantCtx(ctx), q = simple(recherche), tous = dossiersDe(S).map((d) => resume(ctx, d, tachesDe(d.id)));
  const orphelines = dems.filter((x) => x.genre === 'reception' && !dossierDeDemande(S, x.id) && !['perdue'].includes(x.statut)).map((x) => ({ id: '', demande: x.id, client: x.qui, occasion: x.brut?.occasion || 'Réception', intitule: x.titre,
    quand: x.brut?.date ? `${jourLong(x.brut.date)} (souhaitée)` : x.brut?.periode ? `${x.brut.periode} (souhaitée)` : 'Date à définir', jour: x.brut?.date || '', datee: false, invites: x.brut?.invites ? `${x.brut.invites} invités annoncés` : 'Effectif à préciser', espaces: x.brut?.espace ? `${x.brut.espace} (envisagé)` : 'Espace à choisir',
    etape: { id: 'demande', libelle: 'Demande sans dossier', phase: 'a-qualifier' }, phase: 'a-qualifier', retenue: etatRetenue(null), prochaine: { texte: 'Créer le dossier', echeance: '', retard: false }, echeance: '', attention: x.statut === 'nouvelle' ? 'Demande sans réponse' : '', exemple: x.source === 'demo' }));
  const garde = (c) => (!q || simple(`${c.client} ${c.occasion} ${c.intitule} ${c.quand} ${c.espaces}`).includes(q))
    && (filtre === 'tous' || (filtre === 'echeance' && c.retenue.etat === 'option' && joursEntre(maintenant, c.echeance) <= 3) || (filtre === 'relancer' && (c.prochaine.retard || /relancer|expirée/i.test(c.prochaine.texte))) || (filtre === 'client' && /client/i.test(c.attention)));
  const l = [...tous, ...orphelines], vus = l.filter(garde).sort((a, b) => (a.jour || '9999').localeCompare(b.jour || '9999') || a.client.localeCompare(b.client));
  return { phases: PHASES.map(([id, nom]) => ({ id, nom, cartes: vus.filter((c) => c.phase === id) })), total: l.length, trouves: vus.length };
}

/* ---------- L'agenda et Aujourd'hui ---------- */
/**
 * Ce que les réceptions mettent dans l'agenda ce jour-là : visites, options encore valables, réceptions confirmées
 * (avec leur préparation et leur remise en état), et la fin d'une soirée commencée la veille.
 * @returns {{ type: 'visite'|'option'|'confirmee', dossier, titre, libelle, detail, heure }[]}
 */
export function receptionsDuJour(ctx, S, iso) {
  const maintenant = instantCtx(ctx), out = [];
  for (const d of dossiersDe(S)) { if (d.cloture?.etat === 'sans-suite') continue; const titre = d.projet?.intitule || 'Réception';
    if (d.visite?.date === iso) out.push({ type: 'visite', dossier: d.id, titre, libelle: d.visite.faite ? 'Visite faite' : 'Visite', detail: d.client?.nom || '', heure: d.visite.heure || '' });
    const ret = etatRetenue(d, maintenant); if (!['option', 'ferme'].includes(ret.etat)) continue;
    const ch = chronologie(d.jour, d.horaires), du = d.retenue.debut.slice(0, 10), au = d.retenue.fin.slice(0, 10); if (iso < du || iso > au) continue;
    const dit = (c) => ch.etapes.find((e) => e.cle === c), h = (c) => (dit(c) ? heure(dit(c).heure) : '');
    const detail = iso === d.jour ? [`préparation ${h('preparation')}`, `invités ${h('arrivee')}`, `fin ${h('fin')}${dit('fin')?.lendemain ? ' (le lendemain)' : ''}`, `remise en état jusqu'à ${h('remise')}${dit('remise')?.lendemain ? ' (le lendemain)' : ''}`].join(' · ')
      : `suite de la veille : fin ${h('fin')}, remise en état jusqu'à ${h('remise')}`;
    out.push({ type: ret.etat === 'ferme' ? 'confirmee' : 'option', dossier: d.id, titre, libelle: ret.etat === 'ferme' ? 'Réception confirmée' : `Option jusqu'au ${fmt(ret.echeance.slice(0, 10), { day: 'numeric', month: 'long' })} à ${heure(ret.echeance.slice(11, 16))}`,
      detail: `${nomsEspaces(ctx.lieux, d.retenue.espaces).join(', ')} · ${detail}`, heure: iso === d.jour ? dit('preparation')?.heure || '' : '00:00' }); }
  return out.sort((a, b) => String(a.heure).localeCompare(String(b.heure)));
}
/**
 * Ce qui demande une action aujourd'hui : visites du jour, options proches de leur échéance, demandes du client,
 * dossiers à relancer, préparatifs à terminer, réception du jour. Chaque ligne ouvre le dossier.
 * @returns {{ genre, dossier, texte, urgent }[]}
 */
export function prioritesReceptions(ctx, S, tachesDe = () => []) {
  const maintenant = instantCtx(ctx), out = [];
  for (const d of dossiersDe(S)) { const r = resume(ctx, d, tachesDe(d.id)), v = actionsClient(ctx.venues, d.id), att = attentesClient(d, v), nom = `${r.client}, ${r.occasion.toLowerCase()}`; if (r.phase === 'termine') continue;
    if (d.visite?.date === ctx.auj && !d.visite.faite) out.push({ genre: 'visite', dossier: d.id, texte: `Visite${d.visite.heure ? ` à ${heure(d.visite.heure)}` : ''} : ${nom}`, urgent: true });
    if (att.changements.length) out.push({ genre: 'client', dossier: d.id, texte: `${r.client} demande un changement (${att.changements.map((c) => (TYPES_CHANGEMENT[c.type] || '').toLowerCase()).join(', ')})`, urgent: true });
    if (att.questions.length) out.push({ genre: 'client', dossier: d.id, texte: `${r.client} a posé ${att.questions.length > 1 ? `${att.questions.length} questions` : 'une question'}`, urgent: true });
    if (r.etape.id === 'accord') out.push({ genre: 'client', dossier: d.id, texte: `${r.client} a donné son accord (simulation) : à confirmer par l'équipe`, urgent: true });
    if (r.retenue.etat === 'option' && joursEntre(maintenant, r.echeance) <= 2) out.push({ genre: 'echeance', dossier: d.id, texte: `Option de ${nom} : échéance ${instantDit(r.echeance)}`, urgent: joursEntre(maintenant, r.echeance) <= 0 });
    if (r.retenue.etat === 'expiree') out.push({ genre: 'echeance', dossier: d.id, texte: `Option expirée pour ${nom} : les espaces sont libres`, urgent: false });
    if (r.etape.id === 'confirmee' && d.jour === ctx.auj) out.push({ genre: 'jourj', dossier: d.id, texte: `Réception aujourd'hui : ${nom}`, urgent: true });
    else if (r.etape.id === 'confirmee' && d.jour > ctx.auj && joursEntre(maintenant, d.jour) <= 7) { const reste = tachesDe(d.id).filter((t) => !t.fait).length, manque = fichePreparation(ctx, d, v, tachesDe(d.id)).manques;
      if (reste || manque) out.push({ genre: 'preparatifs', dossier: d.id, texte: `${maj(nom)} dans ${pluriel(joursEntre(maintenant, d.jour), 'jour')} : ${[reste ? `${pluriel(reste, 'tâche')} à faire` : '', manque ? `${pluriel(manque, 'information')} ${manque > 1 ? 'manquent' : 'manque'}` : ''].filter(Boolean).join(', ')}`, urgent: joursEntre(maintenant, d.jour) <= 1 }); }
    else if (r.prochaine.retard && r.prochaine.origine === 'equipe') out.push({ genre: 'relance', dossier: d.id, texte: `${maj(nom)} : ${r.prochaine.texte.toLowerCase()} (en retard)`, urgent: false });
  }
  return out.sort((a, b) => (a.urgent ? 0 : 1) - (b.urgent ? 0 : 1));
}

/* ---------- Le jour J ---------- */
/**
 * La fiche de préparation : chaque information vient du dossier ; ce qui manque est dit (« À renseigner »).
 * @returns {{ sections: { titre, lignes: { label, valeur, manque }[] }[], manques: number, taches: object[] }}
 */
export function fichePreparation(ctx, d, v = {}, taches = []) {
  const p = d.projet || {}, c = couranteDe(d), accord = accordDe(d, v), ch = chronologie(d.jour, d.horaires), L = (label, valeur) => ({ label, valeur: valeur || 'À renseigner', manque: !valeur });
  const h = (cle) => { const e = ch.etapes.find((x) => x.cle === cle); return e ? `${heure(e.heure)}${e.lendemain ? ' (le lendemain)' : ''}` : ''; };
  const sections = [
    { titre: 'La réception', lignes: [L('Occasion', p.intitule || p.occasion), L('Date', d.jour ? maj(jourLong(d.jour)) : ''), L('Invités confirmés', p.invitesConfirmes ? String(p.invitesConfirmes) : ''), { label: 'Invités annoncés', valeur: p.invitesAnnonces ? String(p.invitesAnnonces) : 'Non précisé', manque: false },
      L('Proposition retenue', c ? `Version ${c.v} · ${c.titre} · ${euros(totalProposition(c))} (montants d'exemple)${accord ? ` · accord ${accord.par === 'client' ? 'du client' : 'noté par l\'équipe'}, simulation` : ' · sans accord'}` : '')] },
    { titre: 'Les espaces', lignes: [L('Espaces réservés', nomsEspaces(ctx.lieux, d.espaces?.retenus || []).join(', ')), L('Configuration', d.jourJ?.configuration)] },
    { titre: 'Les horaires', lignes: HORAIRES.map(([cle, lib]) => (cle === 'repas' ? { label: lib, valeur: h(cle) || 'Non précisé', manque: false } : L(lib, h(cle)))) },
    { titre: 'Les prestations', lignes: c ? c.lignes.map((l) => ({ label: l.libelle, valeur: `${String(l.qte).replace('.', ',')} ${l.unite || ''}`.trim(), manque: false })) : [L('Prestations', '')] },
    { titre: 'Les personnes', lignes: [L('Client', [d.client?.nom, d.client?.telephone].filter(Boolean).join(' · ')), ...(d.contacts || []).map((x) => ({ label: x.role || 'Contact', valeur: [x.nom, x.telephone].filter(Boolean).join(' · '), manque: false })), { label: 'Suivi côté restaurant', valeur: d.responsable || 'Non précisé', manque: false }] },
    { titre: 'À savoir', lignes: [{ label: 'Contraintes déclarées', valeur: p.contraintes || 'Aucune déclarée', manque: false }, L('Pour la cuisine', d.jourJ?.cuisine), L('Pour l\'accueil', d.jourJ?.accueil)] },
  ];
  return { sections, manques: sections.flatMap((s) => s.lignes).filter((l) => l.manque).length, taches: [...taches].sort((a, b) => (a.fait ? 1 : 0) - (b.fait ? 1 : 0) || String(a.echeance || '9').localeCompare(String(b.echeance || '9'))) };
}
/** Les tâches habituelles d'une réception (exemples), datées par rapport au jour J. Identifiants stables : les ajouter deux fois ne crée pas de doublon. */
export function tachesHabituelles(lieux, d, cree) {
  return (lieux?.taches || []).map((t, i) => ({ id: `tr-${d.id}-${i + 1}`, titre: t.titre, fait: false, cree, ...(d.jour ? { echeance: ajouter(d.jour, +t.jours || 0) } : {}), lien: { type: 'reception', id: d.id, libelle: d.projet?.intitule || 'Réception' } }));
}

/* ---------- Ce que voit le client ---------- */
/** Le code du lien du client (démonstration : dérivé de l'identifiant ; demain : un jeton tiré au sort par le serveur). */
export const codeReception = (id, telephone = '') => { let h = 2166136261; for (const c of `${id}|${String(telephone).replace(/\D/g, '')}|reception`) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36).padStart(6, '0').slice(0, 6); };
export const lienReception = (d) => `/votre-reception?d=${encodeURIComponent(d.id)}&c=${codeReception(d.id, d.client?.telephone)}`;
/**
 * Le dossier vu par le client : son projet, l'étape, la proposition courante, ce qui est convenu, la suite, ce qu'on
 * attend de lui, ses demandes et les réponses. Jamais les notes internes, ni l'historique, ni un autre dossier.
 */
export function vueClient(ctx, d, v = {}) {
  const maintenant = instantCtx(ctx), e = etapeDe(d, v, maintenant), ret = etatRetenue(d, maintenant), c = couranteDe(d), accord = accordDe(d, v), ch = chronologie(d.jour, d.horaires), p = d.projet || {};
  const etapes = { 'a-qualifier': ['Projet à l\'étude', 'Nous préparons votre projet avec vous.'], qualifie: ['Projet à l\'étude', 'Nous préparons votre proposition.'], brouillon: [c ? 'Nouvelle proposition en préparation' : 'Proposition en préparation', c ? `Une nouvelle version est en préparation. La version ${c.v} reste consultable.` : 'Nous préparons votre proposition.'],
    presentee: ['Proposition à consulter', 'Votre proposition est prête. Vous pouvez la consulter et donner votre accord.'], accord: ['À confirmer par l\'équipe', `Vous avez donné votre accord sur la version ${accord?.version} (simulation). La réception sera confirmée par l'équipe, après vérification des espaces.`],
    confirmee: ['Réception confirmée', 'Votre réception est confirmée : les espaces sont réservés.'], terminee: ['Réception terminée', 'Merci de nous avoir fait confiance.'], 'sans-suite': ['Projet sans suite', 'Ce projet n\'a pas eu de suite. Appelez-nous pour le reprendre.'] }[e.id];
  const convenu = [['Occasion', p.intitule || p.occasion], ['Date', d.jour ? maj(jourLong(d.jour)) : d.souhait?.date ? `${maj(jourLong(d.souhait.date))} (souhaitée, pas encore retenue)` : d.souhait?.periode ? `${d.souhait.periode} (souhaitée)` : ''],
    ['Invités', p.invitesConfirmes ? `${p.invitesConfirmes} (confirmés)` : p.invitesAnnonces ? `${p.invitesAnnonces} (annoncés)` : ''], ['Espaces', nomsEspaces(ctx.lieux, d.espaces?.retenus || []).join(', ')],
    ['Arrivée des invités', ch.etapes.find((x) => x.cle === 'arrivee') ? heure(ch.etapes.find((x) => x.cle === 'arrivee').heure) : ''], ['Fin de la réception', ch.etapes.find((x) => x.cle === 'fin') ? `${heure(ch.etapes.find((x) => x.cle === 'fin').heure)}${ch.etapes.find((x) => x.cle === 'fin').lendemain ? ' (le lendemain)' : ''}` : ''],
    ['Espaces retenus', ret.etat === 'ferme' ? 'Réservés pour vous' : ret.etat === 'option' ? `Retenus jusqu'au ${instantDit(ret.echeance)} (option)` : ret.etat === 'expiree' ? 'L\'option a expiré : les espaces ne sont plus retenus' : 'Pas encore retenus']].filter(([, x]) => x);
  const prochaines = e.id === 'presentee' ? ['Consultez la proposition.', 'Donnez votre accord, ou posez vos questions.'] : e.id === 'accord' ? ['L\'équipe vérifie les espaces et confirme la réception.'] : e.id === 'confirmee' ? ['Confirmez le nombre d\'invités quand vous le connaissez.', 'L\'équipe prépare votre réception.'] : e.phase === 'termine' ? [] : ['L\'équipe prépare votre proposition.'];
  return { id: d.id, intitule: p.intitule || 'Votre réception', etape: { id: e.id, libelle: etapes[0], phrase: etapes[1] }, convenu, prochaines, proposition: c ? { v: c.v, titre: c.titre, presentation: c.presentation, lignes: c.lignes, total: totalProposition(c), compris: c.compris, aPreciser: c.aPreciser, validite: c.validite, conditions: c.conditions, presenteeLe: c.presenteeLe } : null,
    accord, peutAccorder: e.id === 'presentee', partage: d.suivi?.partage || '',
    attendu: (d.portail?.infos || []).map((i) => ({ ...i, valeur: v.infos?.[i.id]?.valeur || '' })), questions: (v.questions || []).map((q) => ({ ...q, reponse: d.portail?.reponses?.[q.id] || null })),
    changements: (v.changements || []).map((x) => ({ ...x, decision: d.portail?.decisions?.[x.id] || null })), ouvert: e.phase !== 'termine' };
}
/** Une demande de changement du client est-elle recevable ? '' si oui. Elle reste une demande : rien n'est changé. */
export function refusChangement(d, type, valeur = {}) {
  if (!TYPES_CHANGEMENT[type]) return 'Choisissez ce que vous souhaitez changer.';
  if (type === 'effectif') { const n = entier(valeur.invites); if (!n) return 'Indiquez le nombre d\'invités.'; if (n === (d.projet?.invitesConfirmes || d.projet?.invitesAnnonces)) return 'C\'est déjà le nombre d\'invités prévu.'; }
  if (type === 'horaire' && !/^\d{1,2}:\d{2}$/.test(valeur.arrivee || '') && !/^\d{1,2}:\d{2}$/.test(valeur.fin || '')) return 'Indiquez la nouvelle heure d\'arrivée ou de fin.';
  if (type === 'espace' && !(valeur.espaces || []).length) return 'Choisissez l\'espace souhaité.';
  if (type === 'prestation' && !propre(valeur.texte)) return 'Décrivez la prestation à changer.';
  return '';
}
