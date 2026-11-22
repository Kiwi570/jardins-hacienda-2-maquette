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
   Portée : démonstration, sur cet appareil. Rien n'est envoyé, rien n'est signé, rien n'est encaissé.

   v7.12.1, « Ce qui est convenu reste clair ». Trois informations vivent côte à côte, sans se confondre :
   les espaces réservés ; la proposition ACCEPTÉE (la dernière version présentée qui a reçu un accord) ; la version
   présentée ensuite, qui ATTEND son accord. Un accord reste attaché à sa version (`accordsDe`) : il ne vaut jamais
   pour la suivante. Une réception confirmée peut donc recevoir une révision et son accord, sans que ses espaces
   soient libérés. Une version présentée garde un instantané de ce qu'elle affichait (`contexte` : destinataire, date,
   effectif, espaces) : le dossier peut changer, le document reste le même. Un changement accepté par l'équipe et que
   la proposition acceptée ne couvre pas reste dit « à réviser » tant qu'une version plus récente n'est pas acceptée. */
import { enMin, hhmm, ajouter, servicesDe, instantDe, seCroisent, retenueActive, occupationsActives, fenetreService, dureeRepas } from './disponibilites.js?v=7';
import { fmt, maj, heure, pluriel, instantCtx, etatDuService, evenements, fenetreDuService, prisesDuServiceCtx } from './espace-regles.js?v=7';
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
export const actionsClient = (venues, id) => ({ accord: null, accords: [], questions: [], infos: {}, changements: [], ...(venues?.[id] || {}) });

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
 * Ce que retiennent ces espaces : { espaces, tables, salle, terrasse, publics, capacite, inconnues }.
 * Une zone et ses tables sont la même ressource : « la salle du restaurant » contient « le coin du feu ». Choisir les
 * deux ne compte pas la capacité deux fois. salle, terrasse : tout l'espace que le site propose à la réservation est pris.
 */
export function ressources(lieux, salle, ids = []) {
  const choisis = [...new Set(ids)].map((id) => espaceDe(lieux, id)).filter(Boolean), tables = [...new Set(choisis.flatMap((e) => (e.tables || []).map(String)))];
  const utiles = choisis.filter((e) => !(e.partie && choisis.some((p) => p.id === e.partie)));
  const caps = utiles.map((e) => capaciteEspace(e, salle)), tout = (pub) => { const e = (lieux?.espaces || []).find((x) => x.public === pub); return !!e && (e.tables || []).length > 0 && e.tables.every((t) => tables.includes(String(t))); };
  /* v7.12.1 : ce que ces espaces prennent de chaque espace proposé à la réservation, et combien de tables il compte.
     Les retenues de plusieurs dossiers s'additionnent ainsi sans relire le plan (voir `prisesDuService`). */
  const publics = Object.fromEntries((lieux?.espaces || []).filter((x) => x.public && (x.tables || []).length).map((x) => [x.public, { tables: x.tables.map(String).filter((t) => tables.includes(t)), sur: x.tables.length }]));
  return { espaces: choisis.map((e) => e.id), tables, salle: tout('salle'), terrasse: tout('terrasse'), publics, capacite: caps.length && caps.every((c) => c != null) ? caps.reduce((a, b) => a + b, 0) : null, inconnues: utiles.filter((e, i) => caps[i] == null).map((e) => e.nom) };
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
 * Tous les accords donnés, version par version : { [version]: { version, le, par: 'client' | 'equipe' } }.
 * Celui du client (sa page) passe avant celui que l'équipe a noté. Un accord ne compte que pour une version présentée
 * et non retirée ; il reste attaché à cette version.
 */
export function accordsDe(d, v = {}) {
  const out = {}, presentee = (n) => (d?.propositions || []).some((p) => p.v === +n && p.etat === 'presentee');
  const pose = (n, le, par) => { if (!presentee(n) || (out[+n] && (out[+n].par === 'client' || par !== 'client'))) return; out[+n] = { version: +n, le: court(le), par }; };
  for (const x of [...(v.accords || []), ...(v.accord ? [v.accord] : [])]) if (x?.version) pose(x.version, x.le, 'client');
  for (const [n, x] of Object.entries(d?.accords || {})) pose(n, x?.le, 'equipe');
  if (d?.accordEquipe?.version) pose(d.accordEquipe.version, d.accordEquipe.le, 'equipe');
  return out;
}
/** La proposition acceptée : la plus récente des versions présentées qui a reçu un accord ({ proposition, accord }), ou null. */
export function accepteeDe(d, v = {}) {
  const acc = accordsDe(d, v), p = versionsDe(d).filter((x) => x.etat === 'presentee' && acc[x.v]).pop();
  return p ? { proposition: p, accord: acc[p.v] } : null;
}
/**
 * Ce qu'un changement accepté par l'équipe laisse à réviser : { version, le, motifs } ou null. `version` : la version
 * courante au moment du changement. La révision reste due tant qu'une version plus récente n'a pas été acceptée ;
 * préparer un brouillon, ou l'abandonner, ne l'efface pas. (Les dossiers de la v7.12.0 gardaient une simple phrase : elle est relue.)
 */
export function revisionDe(d, v = {}) {
  const r = d?.aRevoir; if (!r) return null;
  const x = typeof r === 'string' ? { version: +(/version (\d+)/.exec(r)?.[1] || d.courante || 0), le: '', motifs: [], texte: r } : { version: +r.version || 0, le: r.le || '', motifs: r.motifs || [] };
  const acc = accepteeDe(d, v); if (acc && acc.proposition.v > x.version) return null;
  return { ...x, texte: x.texte || `Changement accepté${x.le ? ` le ${fmt(x.le.slice(0, 10), { day: 'numeric', month: 'long' })}` : ''}${x.motifs.length ? ` (${x.motifs.join(' ; ')})` : ''} : ${x.version ? `la proposition version ${x.version}, établie avant, est à réviser` : 'une proposition reste à préparer'}.` };
}
/**
 * L'état commercial, dit en clair et séparé des espaces : ce qui est accepté, ce qui attend un accord, ce qui se
 * prépare, ce qui reste à réviser.
 * @returns {{ acceptee, attente, brouillon, revision, couverte: boolean, lignes: { cle, texte, detail }[] }}
 *   attente : la version courante quand elle n'a pas d'accord ; couverte : la révision due est portée par la version en attente ou le brouillon.
 */
export function commerceDe(d, v = {}) {
  const acceptee = accepteeDe(d, v), c = couranteDe(d), brouillon = brouillonDe(d), revision = revisionDe(d, v);
  const attente = c && !accordsDe(d, v)[c.v] ? c : null, porte = (p) => !!p && !!revision && p.v > revision.version, couverte = porte(attente) || porte(brouillon), lignes = [];
  if (acceptee) lignes.push({ cle: 'acceptee', texte: `Proposition acceptée : version ${acceptee.proposition.v}`, detail: `${euros(acceptee.proposition.total ?? totalProposition(acceptee.proposition))}${acceptee.proposition.contexte?.invites ? `, pour ${pluriel(acceptee.proposition.contexte.invites, 'invité')}` : ''} · accord ${acceptee.accord.par === 'client' ? 'du client' : 'noté par l\'équipe'} le ${instantDit(acceptee.accord.le)} (simulation)` });
  if (attente) lignes.push({ cle: 'attente', texte: `Version ${attente.v} présentée, accord attendu`, detail: `${euros(attente.total ?? totalProposition(attente))}${attente.contexte?.invites ? `, pour ${pluriel(attente.contexte.invites, 'invité')}` : ''}${acceptee ? ` · d'ici là, la version ${acceptee.proposition.v} reste la référence` : ''}` });
  if (brouillon) lignes.push({ cle: 'brouillon', texte: `Version ${brouillon.v} en préparation`, detail: acceptee ? `la version ${acceptee.proposition.v} acceptée reste la référence` : attente ? `la version ${attente.v} reste visible du client` : 'pas encore présentée au client' });
  if (revision && !couverte) lignes.push({ cle: 'revision', texte: 'Révision à préparer', detail: revision.texte });
  if (!lignes.length) lignes.push({ cle: 'aucune', texte: 'Aucune proposition', detail: 'rien n\'a encore été présenté au client' });
  return { acceptee, attente, brouillon, revision, couverte, lignes };
}
/**
 * Ce qu'une proposition affichait au moment où elle a été présentée : son instantané, ou null quand il n'a jamais été
 * enregistré (versions présentées avant la v7.12.1 : on ne le reconstitue pas).
 */
export const contexteDe = (p) => (p?.contexte && typeof p.contexte === 'object' ? p.contexte : null);
/** Ce qu'une proposition affiche du dossier, à cet instant : le destinataire, l'intitulé, la date, l'effectif, les espaces. */
export function contexteDuDossier(d, lieux = null) {
  const p = d?.projet || {}, ids = d?.espaces?.retenus?.length ? d.espaces.retenus : d?.espaces?.envisages || [];
  return { pour: propre(d?.client?.nom, 80), intitule: propre(p.intitule || p.occasion, 120), jour: d?.jour || d?.souhait?.date || '', souhaitee: !d?.jour && !!d?.souhait?.date, periode: !d?.jour && !d?.souhait?.date ? propre(d?.souhait?.periode, 80) : '',
    invites: entier(p.invitesConfirmes || p.invitesAnnonces), confirmes: !!p.invitesConfirmes, espaces: lieux ? nomsEspaces(lieux, ids) : [...ids], retenus: !!d?.espaces?.retenus?.length };
}
/** La ligne « Pour … » d'un document de proposition, d'après un contexte (instantané ou dossier du moment). */
export const contexteDit = (c) => [c.pour ? `Pour ${c.pour}` : '', c.jour ? `${maj(jourLong(c.jour))}${c.souhaitee ? ' (date souhaitée)' : ''}` : c.periode ? `${c.periode} (période souhaitée)` : '', c.invites ? `${pluriel(c.invites, 'invité')}${c.confirmes ? '' : ` ${c.invites > 1 ? 'annoncés' : 'annoncé'}`}` : ''].filter(Boolean).join(' · ');

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
    /* v7.12.1 : une révision en cours passe avant la préparation : terminer le brouillon, attendre l'accord, ou préparer la révision due. */
    const k = commerceDe(d, v);
    if (k.brouillon) return dit(`Terminer la version ${k.brouillon.v} et la présenter au client`);
    if (k.attente) return dit(`Attendre l'accord du client sur la version ${k.attente.v}, ou le relancer`, k.attente.validite || '');
    if (k.revision) return dit(`Préparer une nouvelle version de la proposition${k.revision.motifs.length ? ` (${k.revision.motifs.join(' ; ')})` : ''}`);
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
/** Les jours et services dont la fenêtre croise une période : [{ iso, service, libelle }]. La veille est regardée : un service peut finir après minuit. `fenetre` : la fenêtre effective du jour (horaires déplacés, ouvertures exceptionnelles). */
export function servicesTouches(R, periode, fenetre = (iso, sv) => fenetreService(R, iso, sv)) {
  const out = []; if (!periode?.debut || !periode?.fin) return out;
  for (let iso = ajouter(periode.debut.slice(0, 10), -1); iso <= periode.fin.slice(0, 10); iso = ajouter(iso, 1))
    for (const s of servicesDe(R)) { const f = fenetre(iso, s.id); if (f && seCroisent(f, periode)) out.push({ iso, service: s.id, libelle: `${fmt(iso, { weekday: 'long', day: 'numeric', month: 'long' })}, ${s.id === 'midi' ? 'le midi' : 'le soir'}` }); }
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
  /* Les réservations du restaurant, service par service. v7.12.1 : la fenêtre d'un service suit les horaires du jour
     et va jusqu'à la fin du dernier repas possible ; elle peut finir le lendemain. */
  const services = res.tables.length ? servicesTouches(ctx.R, periode, (iso, sv) => fenetreDuService(ctx, S, iso, sv)) : [];
  const libelleDe = (iso, sv) => `${fmt(iso, { weekday: 'long', day: 'numeric', month: 'long' })}, ${sv === 'midi' ? 'le midi' : 'le soir'}`, prises = new Set(res.tables), vues = new Set();
  const gene = (s, r) => { if (vues.has(r.id)) return; vues.add(r.id); resas.push({ ...s, resa: r, table: String(r.table) });
    non('resa', `${maj(nomPlace(r.table))} : ${r.nom || 'une réservation'}, ${s.libelle} à ${heure(r.heure)}, ${pluriel(+r.couverts, 'couvert')}${r.finMin > 1440 ? ' (repas jusqu\'après minuit)' : ''}.`); };
  for (const s of services) {
    const plan = planDuService(ctx, S, salle, s.iso, s.service), ouvertes = plan.tables.filter((t) => !t.horsSaison);
    for (const r of plan.placees) if ((parIdAss(plan, r.table) || [String(r.table)]).some((t) => prises.has(t))) gene(s, r);
    const restent = ouvertes.filter((t) => !prises.has(t.id) && !(t.reception && t.reception.id !== d?.id));
    if (plan.aPlacer.length && !restent.length) non('resa', `${pluriel(plan.aPlacer.length, 'réservation')} sans table ${s.libelle} : il ne resterait aucune table au restaurant.`);
    else if (plan.aPlacer.length) attentions.push(`${pluriel(plan.aPlacer.length, 'réservation')} sans table ${s.libelle} : il restera ${pluriel(restent.reduce((n, t) => n + t.places, 0), 'place')} au restaurant.`);
    const es = etatDuService(ctx, S, s.iso, s.service);
    /* Ce que la page Réserver proposera : calculé avec cette retenue ET celles des autres dossiers, selon la saison. */
    const avec = prisesDuServiceCtx(ctx, S, s.iso, s.service, [{ id: `${d?.id || 'projet'}#envisagee`, debut: periode.debut, fin: periode.fin, tables: res.tables, salle: res.salle, terrasse: res.terrasse, publics: res.publics }]);
    if (!es.ouvert) attentions.push(`Le restaurant est fermé ${s.libelle}${es.motif ? ` (${es.motif.toLowerCase()})` : ''} : la réception n'y change rien.`);
    else if (avec.tout) attentions.push(res.salle ? `Toute la salle est prise ${s.libelle} : la page Réserver n'ouvrira pas ce service.` : `Avec les autres réceptions, il ne restera aucune table ${s.libelle} : la page Réserver n'ouvrira pas ce service.`);
    else if (avec.salle) attentions.push(`Toute la salle est prise ${s.libelle} : la page Réserver ne proposera que la terrasse.`);
  }
  /* Un repas encore à table : une réservation placée sur une table retenue, dont le repas (de son heure d'arrivée à la
     fin de sa durée) croise la période, même hors de la fenêtre du service (arrivée notée tard par l'équipe). */
  if (res.tables.length) for (let iso = ajouter(periode.debut.slice(0, 10), -1); iso <= periode.fin.slice(0, 10); iso = ajouter(iso, 1)) for (const sv of servicesDe(ctx.R)) {
    if (services.some((x) => x.iso === iso && x.service === sv.id)) continue;
    const plan = planDuService(ctx, S, salle, iso, sv.id), s = { iso, service: sv.id, libelle: libelleDe(iso, sv.id) };
    for (const r of plan.placees) if ((parIdAss(plan, r.table) || [String(r.table)]).some((t) => prises.has(t)) && seCroisent({ debut: instantDe(iso, enMin(r.heure)), fin: instantDe(iso, enMin(r.heure) + dureeRepas(sv.id)) }, periode)) gene(s, r);
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
  return { id: d.id, type, jour, horaires: h, espaces: res.espaces, tables: res.tables, salle: res.salle, terrasse: res.terrasse, publics: res.publics, debut: ch.debut, fin: ch.fin, echeance: type === 'option' ? court(echeance) : '', le };
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
    } else if (d.retenue?.etat !== 'ferme') {
      /* La première confirmation attend un accord sur la version courante. Une réception déjà confirmée se déplace
         sans nouvel accord : sa révision commerciale se décide à part, les espaces restent réservés. */
      const cour = couranteDe(d); if (!cour) return 'Aucune proposition n\'a été présentée au client : présentez-en une avant de confirmer.';
      if (brouillonDe(d)) return `Une nouvelle version (${brouillonDe(d).v}) est en préparation : présentez-la, ou abandonnez-la, avant de confirmer.`;
      if (!accordDe(d, v)) return `Le client n'a pas donné son accord sur la version ${cour.v} : la confirmation attend son accord.`;
    }
    return '';
  }
  if (nom === 'recPresenter') { const b = brouillonDe(d); if (!b) return 'Il n\'y a pas de brouillon à présenter.'; if (!propre(b.titre)) return 'Donnez un titre à la proposition.'; if (!(b.lignes || []).some((l) => propre(l.libelle))) return 'Ajoutez au moins une prestation.'; return ''; }
  if (nom === 'recNouvelleVersion') return brouillonDe(d) ? 'Une nouvelle version est déjà en préparation.' : couranteDe(d) ? '' : 'Aucune proposition présentée à reprendre.';
  if (nom === 'recAccordEquipe') return !couranteDe(d) ? 'Aucune proposition n\'a été présentée.' : accordsDe(d, v)[d.courante] ? `La version ${d.courante} a déjà reçu un accord.` : '';
  if (nom === 'recRetirerVersion') { const c = couranteDe(d); if (!c || c.v !== +args.version) return 'Seule la dernière version présentée peut être retirée.'; if (accordsDe(d, v)[c.v]) return `La version ${c.v} a reçu un accord : elle ne se retire pas. Préparez plutôt une nouvelle version.`; return propre(args.raison) ? '' : 'Indiquez la raison : elle reste dans l\'historique.'; }
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
  const cour = couranteDe(d), acc = accepteeDe(d, actionsClient(ctx.venues, d.id));
  if (cour && ch.type !== 'horaire') lignes.push(`Proposition version ${cour.v}${acc?.proposition.v === cour.v ? ' (acceptée)' : ''} : elle a été établie avant ce changement${cour.contexte?.invites && ch.type === 'effectif' ? `, pour ${pluriel(cour.contexte.invites, 'invité')}` : ''}. Elle ne sera pas réécrite : si vous acceptez, une révision restera à préparer et à faire accepter.`);
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
    d.retenue = { etat: a.type, posee: avant?.posee && deja ? avant.posee : court(a.le), debut: a.debut, fin: a.fin, espaces: [...a.espaces], tables: [...a.tables], salle: !!a.salle, terrasse: !!a.terrasse, ...(a.publics ? { publics: a.publics } : {}), ...(a.type === 'option' ? { echeance: court(a.echeance) } : { confirmeeLe: court(a.le) }) };
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
    d.qualifie = true;
  },
  /** Abandonne le brouillon en cours (la version présentée reste la version courante). */
  recAbandonnerBrouillon(S, { id, le = '' }) { const d = prendre(S, id); if (!d) return; const b = brouillonDe(d); if (!b) return; d.propositions = d.propositions.filter((p) => p !== b); noter(d, le, `Brouillon de la version ${b.v} abandonné.`); },
  /** Présente le brouillon au client : il devient un instantané, et la version courante. */
  recPresenter(S, { id, le = '', espaces = null }) {
    const d = prendre(S, id), b = d && brouillonDe(d); if (!b) return;
    /* v7.12.1 : l'instantané de tout ce que le document affiche. Les accords déjà donnés restent attachés à leur version. */
    b.etat = 'presentee'; b.presenteeLe = court(le); b.total = totalProposition(b); b.contexte = { ...contexteDuDossier(d), ...(Array.isArray(espaces) ? { espaces: espaces.map((x) => propre(x, 60)).filter(Boolean).slice(0, 12) } : {}) }; d.courante = b.v;
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
  recAccordEquipe(S, { id, le = '' }) { const d = prendre(S, id), c = d && couranteDe(d); if (!c) return; (d.accords ||= {})[c.v] = { le: court(le) }; noter(d, le, `Accord du client sur la version ${c.v}, noté par l'équipe (simulation).`); },
  /** Retire la dernière version présentée, restée sans accord (révision refusée ou abandonnée) : elle reste consultable ; la version présentée avant elle redevient la version courante, avec ses accords. */
  recRetirerVersion(S, { id, version, raison = '', le = '' }) {
    const d = prendre(S, id), c = d && couranteDe(d); if (!c || c.v !== +version) return;
    c.etat = 'retiree'; c.retireeLe = court(le); c.raison = propre(raison, 200);
    d.courante = Math.max(0, ...d.propositions.filter((p) => p.etat === 'presentee').map((p) => p.v)) || null;
    noter(d, le, `Version ${c.v} retirée : ${propre(raison, 200)}.${d.courante ? ` La version ${d.courante} redevient la version courante.` : ''}`);
  },
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
    /* La proposition présentée n'est pas réécrite : ce qu'elle ne couvre plus est noté, jusqu'à l'accord sur une version plus récente. */
    if (type !== 'horaire' && couranteDe(d)) { const avant = typeof d.aRevoir === 'object' && d.aRevoir?.version === d.courante ? d.aRevoir.motifs || [] : [];
      const motif = type === 'effectif' ? `${pluriel(entier(valeur.invites), 'invité')}` : type === 'espace' ? 'l\'espace' : `une prestation${propre(valeur.texte) ? ` : ${propre(valeur.texte, 80)}` : ''}`;
      d.aRevoir = { version: d.courante, le: court(le), motifs: [...avant.filter((m) => !(type === 'effectif' && /invité/.test(m)) && !(type === 'espace' && m === 'l\'espace')), motif] }; }
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
  const maintenant = instantCtx(ctx), v = actionsClient(ctx.venues, d.id), e = etapeDe(d, v, maintenant), ret = etatRetenue(d, maintenant), att = attentesClient(d, v), pa = prochaineAction(d, v, { maintenant, auj: ctx.auj, taches }), k = commerceDe(d, v);
  const ids = d.espaces?.retenus?.length ? d.espaces.retenus : d.espaces?.envisages || [], p = d.projet || {};
  const attention = att.changements.length ? 'Le client demande un changement' : att.questions.length ? 'Une question du client attend une réponse' : ret.etat === 'expiree' ? 'Option expirée : les espaces sont libres'
    : k.revision && !k.couverte ? 'Proposition à réviser' : k.attente && k.acceptee ? `Version ${k.attente.v} : accord attendu` : ret.etat === 'option' && joursEntre(maintenant, ret.echeance) <= 2 ? 'L\'option arrive à échéance' : pa.retard ? 'Action en retard' : '';
  return { id: d.id, client: d.client?.nom || 'Sans nom', occasion: p.occasion || 'Réception', intitule: p.intitule || p.occasion || 'Réception',
    quand: d.jour ? jourLong(d.jour) : d.souhait?.date ? `${jourLong(d.souhait.date)} (souhaitée)` : d.souhait?.periode ? `${d.souhait.periode} (souhaitée)` : 'Date à définir', jour: d.jour || d.souhait?.date || '', datee: !!d.jour,
    invites: p.invitesConfirmes ? `${pluriel(p.invitesConfirmes, 'invité')} ${p.invitesConfirmes > 1 ? 'confirmés' : 'confirmé'}` : p.invitesAnnonces ? `${pluriel(p.invitesAnnonces, 'invité')} ${p.invitesAnnonces > 1 ? 'annoncés' : 'annoncé'}` : 'Effectif à préciser',
    espaces: ids.length ? `${nomsEspaces(ctx.lieux, ids).join(', ')}${d.espaces?.retenus?.length ? '' : ' (envisagé)'}` : 'Espace à choisir', etape: e, phase: e.phase, retenue: ret, commerce: k, prochaine: pa, echeance: ret.etat === 'option' ? ret.echeance : '', attention, exemple: d.source === 'demo' };
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
    /* v7.12.1 : ce qu'un changement accepté laisse à réviser, tant que rien n'est en préparation ni présenté. */
    if (r.commerce.revision && !r.commerce.couverte) out.push({ genre: 'relance', dossier: d.id, texte: `${maj(nom)} : proposition à réviser${r.commerce.revision.motifs.length ? ` (${r.commerce.revision.motifs.join(' ; ')})` : ''}`, urgent: false });
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
  const p = d.projet || {}, k = commerceDe(d, v), acc = k.acceptee, ap = acc?.proposition || null, ch = chronologie(d.jour, d.horaires), L = (label, valeur) => ({ label, valeur: valeur || 'À renseigner', manque: !valeur });
  const h = (cle) => { const e = ch.etapes.find((x) => x.cle === cle); return e ? `${heure(e.heure)}${e.lendemain ? ' (le lendemain)' : ''}` : ''; };
  const prestations = (x) => x.lignes.map((l) => ({ label: l.libelle, valeur: `${String(l.qte).replace('.', ',')} ${l.unite || ''}`.trim(), manque: false }));
  const invites = entier(p.invitesConfirmes || p.invitesAnnonces), pour = ap?.contexte?.invites || 0;
  /* v7.12.1 : ce qui reste à valider, dit à part. La fiche se prépare sur la base de ce qui est ACCEPTÉ ; une version
     seulement présentée n'est jamais la proposition retenue. */
  const aValider = [
    ...(k.attente ? [{ label: `Version ${k.attente.v} présentée`, valeur: `Accord du client attendu (${euros(k.attente.total ?? totalProposition(k.attente))}${k.attente.contexte?.invites ? `, pour ${pluriel(k.attente.contexte.invites, 'invité')}` : ''}). ${ap ? `D'ici là, préparez sur la base de la version ${ap.v} acceptée.` : 'Aucune version n\'est encore acceptée.'}` }] : []),
    ...(k.brouillon ? [{ label: `Version ${k.brouillon.v} en préparation`, valeur: `À terminer et à présenter au client.${ap ? ` La version ${ap.v} acceptée reste la référence.` : ''}` }] : []),
    ...(k.revision && !k.couverte ? [{ label: 'Proposition à réviser', valeur: k.revision.texte }] : []),
    ...(ap && pour && invites && pour !== invites ? [{ label: 'Effectif', valeur: `${pluriel(invites, 'invité')} ${p.invitesConfirmes ? (invites > 1 ? 'confirmés' : 'confirmé') : (invites > 1 ? 'annoncés' : 'annoncé')} ; les prestations acceptées (version ${ap.v}) sont établies pour ${pour}.` }] : []),
  ].map((l) => ({ ...l, manque: false, attente: true }));
  const sections = [
    { cle: 'reception', titre: 'La réception', lignes: [L('Occasion', p.intitule || p.occasion), L('Date', d.jour ? maj(jourLong(d.jour)) : ''), L('Invités confirmés', p.invitesConfirmes ? String(p.invitesConfirmes) : ''), { label: 'Invités annoncés', valeur: p.invitesAnnonces ? String(p.invitesAnnonces) : 'Non précisé', manque: false },
      ap ? { label: 'Proposition retenue', valeur: `Version ${ap.v} · ${ap.titre} · ${euros(ap.total ?? totalProposition(ap))} (montants d'exemple)${pour ? ` · établie pour ${pluriel(pour, 'invité')}` : ''} · accord ${acc.accord.par === 'client' ? 'du client' : 'noté par l\'équipe'}, simulation`, manque: false }
        : { label: 'Proposition retenue', valeur: k.attente ? `Aucune pour le moment : la version ${k.attente.v} est présentée, sans accord` : 'À renseigner', manque: true }] },
    ...(aValider.length ? [{ cle: 'a-valider', titre: 'À valider', lignes: aValider }] : []),
    { cle: 'espaces', titre: 'Les espaces', lignes: [L('Espaces réservés', nomsEspaces(ctx.lieux, d.espaces?.retenus || []).join(', ')), L('Configuration', d.jourJ?.configuration)] },
    { cle: 'horaires', titre: 'Les horaires', lignes: HORAIRES.map(([cle, lib]) => (cle === 'repas' ? { label: lib, valeur: h(cle) || 'Non précisé', manque: false } : L(lib, h(cle)))) },
    { cle: 'prestations', titre: ap ? `Les prestations acceptées (version ${ap.v})` : 'Les prestations', lignes: ap ? prestations(ap) : [{ label: 'Prestations', valeur: k.attente ? 'Aucune prestation acceptée pour le moment' : 'À renseigner', manque: true }] },
    ...(k.attente ? [{ cle: 'proposees', titre: `Les prestations proposées (version ${k.attente.v}, accord attendu)`, lignes: prestations(k.attente).map((l) => ({ ...l, attente: true })) }] : []),
    { cle: 'personnes', titre: 'Les personnes', lignes: [L('Client', [d.client?.nom, d.client?.telephone].filter(Boolean).join(' · ')), ...(d.contacts || []).map((x) => ({ label: x.role || 'Contact', valeur: [x.nom, x.telephone].filter(Boolean).join(' · '), manque: false })), { label: 'Suivi côté restaurant', valeur: d.responsable || 'Non précisé', manque: false }] },
    { cle: 'a-savoir', titre: 'À savoir', lignes: [{ label: 'Contraintes déclarées', valeur: p.contraintes || 'Aucune déclarée', manque: false }, L('Pour la cuisine', d.jourJ?.cuisine), L('Pour l\'accueil', d.jourJ?.accueil)] },
  ];
  /* En une phrase : ce qui est confirmé, ce qui attend, sur quelle base l'équipe prépare. */
  const base = `${d.retenue?.etat === 'ferme' ? 'Espaces réservés.' : 'Espaces non réservés.'} ${ap ? `Préparez sur la base de la version ${ap.v} acceptée${pour ? `, établie pour ${pluriel(pour, 'invité')}` : ''}.` : 'Aucune proposition n\'est encore acceptée.'}${aValider.length ? ` ${pluriel(aValider.length, 'point')} ${aValider.length > 1 ? 'restent' : 'reste'} à valider.` : ''}`;
  return { sections, base, aValider: aValider.length, acceptee: ap ? ap.v : 0, manques: sections.flatMap((s) => s.lignes).filter((l) => l.manque).length, taches: [...taches].sort((a, b) => (a.fait ? 1 : 0) - (b.fait ? 1 : 0) || String(a.echeance || '9').localeCompare(String(b.echeance || '9'))) };
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
  const maintenant = instantCtx(ctx), e = etapeDe(d, v, maintenant), ret = etatRetenue(d, maintenant), c = couranteDe(d), accord = accordDe(d, v), ch = chronologie(d.jour, d.horaires), p = d.projet || {}, k = commerceDe(d, v), ap = k.acceptee?.proposition || null;
  /* v7.12.1 : une réception confirmée peut recevoir une révision. La phrase dit les deux : ce qui est réservé, ce qui attend. */
  const suite = k.attente && ap ? ` Une nouvelle proposition (version ${k.attente.v}) attend votre accord ; la version ${ap.v}, que vous avez acceptée, reste la référence d'ici là.`
    : k.brouillon && ap ? ` L'équipe prépare une nouvelle version de la proposition ; la version ${ap.v}, que vous avez acceptée, reste la référence d'ici là.`
    : k.revision && !k.couverte ? ` Un changement a été accepté${k.revision.motifs.length ? ` (${k.revision.motifs.join(' ; ')})` : ''} : l'équipe doit encore mettre la proposition à jour${ap ? ` ; la version ${ap.v} reste la référence d'ici là` : ''}.` : '';
  const etapes = { 'a-qualifier': ['Projet à l\'étude', 'Nous préparons votre projet avec vous.'], qualifie: ['Projet à l\'étude', 'Nous préparons votre proposition.'], brouillon: [c ? 'Nouvelle proposition en préparation' : 'Proposition en préparation', c ? `Une nouvelle version est en préparation. La version ${c.v} reste consultable.` : 'Nous préparons votre proposition.'],
    presentee: ['Proposition à consulter', `Votre proposition est prête. Vous pouvez la consulter et donner votre accord.${ap && ap.v !== c?.v ? ` Votre accord sur la version ${ap.v} reste noté ; il ne vaut pas pour la version ${c.v}.` : ''}`], accord: ['À confirmer par l\'équipe', `Vous avez donné votre accord sur la version ${accord?.version} (simulation). La réception sera confirmée par l'équipe, après vérification des espaces.`],
    confirmee: ['Réception confirmée', `Votre réception est confirmée : les espaces sont réservés.${suite}`], terminee: ['Réception terminée', 'Merci de nous avoir fait confiance.'], 'sans-suite': ['Projet sans suite', 'Ce projet n\'a pas eu de suite. Appelez-nous pour le reprendre.'] }[e.id];
  const convenu = [['Occasion', p.intitule || p.occasion], ['Date', d.jour ? maj(jourLong(d.jour)) : d.souhait?.date ? `${maj(jourLong(d.souhait.date))} (souhaitée, pas encore retenue)` : d.souhait?.periode ? `${d.souhait.periode} (souhaitée)` : ''],
    ['Invités', p.invitesConfirmes ? `${p.invitesConfirmes} (confirmés)` : p.invitesAnnonces ? `${p.invitesAnnonces} (annoncés)` : ''], ['Espaces', nomsEspaces(ctx.lieux, d.espaces?.retenus || []).join(', ')],
    ['Arrivée des invités', ch.etapes.find((x) => x.cle === 'arrivee') ? heure(ch.etapes.find((x) => x.cle === 'arrivee').heure) : ''], ['Fin de la réception', ch.etapes.find((x) => x.cle === 'fin') ? `${heure(ch.etapes.find((x) => x.cle === 'fin').heure)}${ch.etapes.find((x) => x.cle === 'fin').lendemain ? ' (le lendemain)' : ''}` : ''],
    ['Espaces retenus', ret.etat === 'ferme' ? 'Réservés pour vous' : ret.etat === 'option' ? `Retenus jusqu'au ${instantDit(ret.echeance)} (option)` : ret.etat === 'expiree' ? 'L\'option a expiré : les espaces ne sont plus retenus' : 'Pas encore retenus'],
    ['Proposition acceptée', ap ? `Version ${ap.v}, ${euros(ap.total ?? totalProposition(ap))}${ap.contexte?.invites ? `, établie pour ${pluriel(ap.contexte.invites, 'invité')}` : ''} (accord donné le ${instantDit(k.acceptee.accord.le)}, simulation)` : ''],
    ['Proposition en attente', k.attente && ap ? `Version ${k.attente.v}, ${euros(k.attente.total ?? totalProposition(k.attente))} : votre accord est attendu` : k.revision && !k.couverte && ap ? 'Une version mise à jour est à préparer par le restaurant' : '']].filter(([, x]) => x);
  const revision = k.attente && ap ? ['Consultez la nouvelle version de la proposition.', 'Donnez votre accord, ou posez vos questions.'] : k.brouillon || (k.revision && !k.couverte) ? ['L\'équipe prépare une proposition mise à jour.'] : [];
  const prochaines = e.id === 'presentee' ? ['Consultez la proposition.', 'Donnez votre accord, ou posez vos questions.'] : e.id === 'accord' ? ['L\'équipe vérifie les espaces et confirme la réception.'] : e.id === 'confirmee' ? [...revision, ...(p.invitesConfirmes ? [] : ['Confirmez le nombre d\'invités quand vous le connaissez.']), 'L\'équipe prépare votre réception.'] : e.phase === 'termine' ? [] : ['L\'équipe prépare votre proposition.'];
  /* Chaque version montrée au client porte son instantané : `contexte` vaut null quand il n'a jamais été enregistré. */
  const voir = (x) => (x ? { v: x.v, titre: x.titre, presentation: x.presentation, lignes: x.lignes, total: x.total ?? totalProposition(x), compris: x.compris, aPreciser: x.aPreciser, validite: x.validite, conditions: x.conditions, presenteeLe: x.presenteeLe, contexte: contexteDe(x) } : null);
  return { id: d.id, intitule: p.intitule || 'Votre réception', etape: { id: e.id, libelle: etapes[0], phrase: etapes[1] }, convenu, prochaines, proposition: voir(c),
    /* La version acceptée, quand ce n'est pas celle qui est affichée : elle reste consultable, à l'identique. */
    acceptee: ap && ap.v !== c?.v ? { ...voir(ap), accord: k.acceptee.accord } : null, revision: k.revision && !k.couverte ? k.revision.texte : '',
    accord, peutAccorder: !!c && !accord && !k.brouillon && e.phase !== 'termine', partage: d.suivi?.partage || '',
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
