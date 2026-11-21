/* Le mode connecté de l'espace (v7.9.0) : les réservations, les règles du jour et le plan ne sont plus dans ce
   navigateur, ils sont sur le serveur, partagés entre tous les appareils de l'équipe.
   Ce fichier tient un miroir de ce que le serveur a confirmé et le présente à l'espace sous la forme d'état qu'il
   connaît déjà : les écrans et les règles pures ne changent pas. Il n'invente rien :
   - une action sur une réservation part au serveur ; elle n'est « enregistrée » que quand il l'a confirmée ;
   - si le serveur refuse ou ne répond pas, rien n'est changé à l'écran, la raison est dite, la saisie est gardée ;
   - il n'y a aucun repli vers la mémoire du navigateur : une panne se voit.
   Ce qui n'est pas encore partagé (carte, textes, photos, soirées, autres demandes, fiche client) reste dans le dépôt
   local, comme avant, et l'espace le dit. */

const ACTIONS_RESA = ['statut', 'ajouterResa', 'modifierResa', 'placerResa', 'placerPlusieurs'];
const ACTIONS_REGLES = { complet: 'complet', fermer: 'fermer', ouvertureExceptionnelle: 'ouverture', horaires: 'semaine', ajouterFermeture: 'ajouterFermeture', retirerFermeture: 'retirerFermeture' };
/** « Paul Combiné » → prénom « Paul », nom « Combiné » ; un seul mot est un nom. */
export const nomEnDeux = (complet) => { const [premier, ...reste] = String(complet || '').trim().split(/\s+/); return reste.length ? { prenom: premier, nom: reste.join(' ') } : { prenom: '', nom: premier || '' }; };
const cleRequete = () => `esp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

/** Une réservation du serveur, sous la forme que les écrans de l'espace connaissent. */
export const versEcran = (r) => ({ id: r.id, reference: r.reference, date: r.date, service: r.service, heure: r.heure, couverts: r.couverts, nom: [r.prenom, r.nom].filter(Boolean).join(' ') || 'Sans nom',
  telephone: r.telephone, email: r.email, demande: [r.noteEquipe, r.noteClient].filter(Boolean).join(' · '), espace: r.espaceSouhaite || 'salle',
  statut: r.statut === 'demande' ? 'a-confirmer' : r.statut, source: r.origine === 'site' ? 'site' : 'telephone',
  /* table : celle que l'équipe a choisie ; une table seulement retenue par le serveur laisse la réservation « à placer ». */
  table: r.placement === 'placement' ? r.table : '', tableRetenue: r.table, tableSouhaitee: r.tableSouhaitee, version: r.version, clientId: r.clientId, derogation: r.derogation });

/**
 * @param {{ api: string, local: object, periode: () => { du: string, au: string }, surFin: Function, surEtat: Function, fetch?: Function }} o
 *   local : le dépôt du navigateur (pour ce qui n'est pas partagé) ; surFin({ ok, nom, message, note }) : une action
 *   serveur est terminée ; surEtat(etat) : l'état de la liaison a changé (voir `liaison()`).
 */
export function creerDepotServeur({ api, local, periode, surFin, surEtat, fetch: aller = (...a) => fetch(...a) }) {
  let cleGardee = null; /* la clé d'une création dont la réponse n'est pas arrivée : la même saisie renvoyée ne crée pas un doublon */
  let compte = null, droits = [], reservations = new Map(), regles = { reservation: null, equipe: {}, version: 0, tables: [] }, numero = 0, minuteur = 0, raison = '';
  const lien = { etat: 'deconnecte', enCours: 0, dernier: 0, message: '' }; /* deconnecte | charge | a-jour | hors-ligne | interdit */
  const dire = (plus) => { Object.assign(lien, plus); surEtat?.({ ...lien }); };

  async function appel(methode, chemin, { corps, cle } = {}) {
    let rep;
    try { rep = await aller(api + chemin, { method: methode, credentials: 'same-origin', headers: { ...(methode === 'GET' ? {} : { 'content-type': 'application/json' }), ...(cle ? { 'idempotency-key': cle } : {}) }, body: methode === 'GET' ? undefined : JSON.stringify(corps ?? {}) }); }
    catch { dire({ etat: compte ? 'hors-ligne' : lien.etat }); throw Object.assign(new Error('Pas de liaison avec le serveur : rien n\'a été enregistré. Vérifiez la connexion, puis réessayez.'), { code: 'RESEAU' }); }
    let json = null; try { json = await rep.json(); } catch { /* réponse sans JSON */ }
    if (rep.ok && json) return json;
    if (rep.status === 401 && compte) { compte = null; arreter(); dire({ etat: 'deconnecte', message: 'Votre session a expiré : reconnectez-vous.' }); }
    throw Object.assign(new Error(json?.erreur?.message || 'Le serveur n\'a pas répondu comme attendu : rien n\'a été enregistré.'), { code: json?.erreur?.code || 'SERVEUR', details: json?.erreur?.details || {}, statut: rep.status });
  }

  /* ---------- Le miroir : ce que le serveur a confirmé, rien d'autre ---------- */
  const poser = (l) => { for (const r of l) reservations.set(r.id, r); };
  async function charger() {
    dire({ etat: 'charge' });
    try {
      /* Les réglages d'abord (tous les rôles les lisent). Les réservations seulement si le compte en a le droit. */
      const reg = await appel('GET', '/reglages'); regles = { reservation: reg.reservation, equipe: reg.equipe || {}, version: reg.version, tables: reg.tables || [] };
      if (!droits.includes('reservations:lire')) { reservations = new Map(); dire({ etat: 'interdit', message: 'Votre compte ne donne pas accès aux réservations.' }); return true; }
      /* Le numéro de suivi est pris avant la lecture : un changement fait pendant le chargement sera relu, jamais manqué. */
      const suivi = await appel('GET', '/suivi?depuis=-1'), { du, au } = periode(), res = await appel('GET', `/reservations?du=${du}&au=${au}`);
      reservations = new Map(); poser(res.reservations); numero = suivi.numero;
      dire({ etat: 'a-jour', dernier: Date.now(), message: '' }); return true;
    } catch (e) { if (compte) dire({ etat: 'hors-ligne', message: e.message }); return false; }
  }
  /** Ce qui a changé ailleurs depuis la dernière fois ; rend true si le miroir a bougé. */
  async function actualiser() {
    if (!compte || lien.etat === 'interdit') return false;
    try {
      const s = await appel('GET', `/suivi?depuis=${numero}`); let change = s.reservations.length > 0;
      poser(s.reservations); numero = s.numero;
      if (s.regles) { const reg = await appel('GET', '/reglages'); regles = { reservation: reg.reservation, equipe: reg.equipe || {}, version: reg.version, tables: reg.tables || [] }; change = true; }
      dire({ etat: 'a-jour', dernier: Date.now(), message: '' }); return change;
    } catch { return false; }
  }
  function arreter() { clearInterval(minuteur); minuteur = 0; }
  function suivre(f, toutesLes = 5000) { arreter(); minuteur = setInterval(async () => { if (document.visibilityState === 'visible' && !lien.enCours && await actualiser()) f(); }, toutesLes); }

  /** L'état que lisent les écrans : le local pour ce qui n'est pas partagé, le serveur pour les réservations et les règles du jour. */
  function etat() {
    const S = { ...local.etat() }, E = regles.equipe || {}, l = [...reservations.values()].map(versEcran);
    S.resa = { ajouts: l, tables: Object.fromEntries(l.filter((r) => r.table).map((r) => [r.id, r.table])), fermes: E.fermes || {}, complets: E.complets || {}, ouvertures: E.ouvertures || [] };
    S.horaires = { ...(E.semaine ? { semaine: E.semaine } : {}), exceptions: E.fermetures || [] };
    return S;
  }

  /* ---------- Les actions : au serveur, et « enregistré » seulement quand il l'a dit ---------- */
  const versions = (id) => reservations.get(id)?.version;
  async function envoyer(nom, args) {
    if (nom === 'statut') { const r = await appel('POST', `/reservations/${args.id}/statut`, { corps: { statut: args.statut, version: versions(args.id), ...(args.derogation ? { derogation: args.derogation } : {}) } }); poser([r.reservation]); return { note: r.note === 'a-placer' ? 'Une table lui est retenue.' : r.note === 'sans-table' ? 'Confirmée par dérogation, sans table retenue.' : '' }; }
    if (nom === 'ajouterResa') { const x = args.resa;
      const r = await appel('POST', '/reservations', { cle: args.cle, corps: { date: x.date, service: x.service, heure: x.heure, couverts: x.couverts, ...nomEnDeux(x.nom), telephone: x.telephone || '', noteEquipe: x.demande || '', espace: x.espace || '' } });
      poser([r.reservation]); return { note: r.alerte === 'complet' ? 'Ce service est dit complet : elle s\'ajoute en plus, à votre décision.' : '' }; }
    if (nom === 'modifierResa') { const c = args.champs || {}, champs = {}, avant = reservations.get(args.id), vu = avant ? versEcran(avant) : {};
      for (const [k, v] of Object.entries(c)) { if (k === 'demande') champs.noteEquipe = v; else if (k === 'nom') { if (String(v).trim() !== vu.nom) Object.assign(champs, nomEnDeux(v)); } else if (['heure', 'service', 'couverts', 'telephone', 'date'].includes(k)) champs[k] = k === 'couverts' ? Math.round(+v) : v; }
      /* La note affichée réunit celle de l'équipe et celle du client : seule une note réellement changée est envoyée. */
      if ('demande' in c && String(c.demande).trim() === vu.demande) delete champs.noteEquipe; else if ('demande' in c) champs.noteClient = '';
      const r = await appel('PATCH', `/reservations/${args.id}`, { corps: { version: versions(args.id), champs } }); poser([r.reservation]); return { note: r.note || '' }; }
    if (nom === 'placerResa') { const r = await appel('PUT', `/reservations/${args.id}/table`, { corps: { table: args.table || '', version: versions(args.id) } }); poser([r.reservation]); await actualiser(); return {}; }
    if (nom === 'placerPlusieurs') { let faites = 0;
      for (const [id, table] of Object.entries(args.places || {})) { try { const r = await appel('PUT', `/reservations/${id}/table`, { corps: { table, version: versions(id) } }); poser([r.reservation]); faites++; await actualiser(); } catch (e) { if (!faites) throw e; return { note: `${faites} placée${faites > 1 ? 's' : ''} ; la suite a été refusée : ${e.message}` }; } }
      return {}; }
    /* Les règles du jour et de la semaine. Un service ou plusieurs (« fermer samedi » ferme le midi et le soir). */
    const operation = ACTIONS_REGLES[nom];
    /* L'écran désigne une fermeture par son rang dans la liste ; le serveur, par ses dates (le rang peut avoir bougé ailleurs). */
    if (operation === 'retirerFermeture') { const f = (regles.equipe.fermetures || [])[args.index]; if (!f) throw Object.assign(new Error('Cette fermeture n\'existe plus.'), { code: 'INTROUVABLE' }); args = { du: f.du, au: f.au }; }
    const etapes = operation === 'semaine' ? [{ semaine: args.semaine }] : operation === 'complet' || operation === 'fermer' ? (args.services || [args.service]).map((service) => ({ date: args.date, service, actif: args.actif })) : [operation === 'ouverture' ? { date: args.date, service: args.service, actif: args.actif !== false, note: args.note } : args];
    for (const a of etapes) { const r = await appel('POST', '/reglages/equipe', { corps: { version: regles.version, operation, args: a } }); regles = { ...regles, equipe: r.equipe, version: r.version }; }
    return {};
  }
  /**
   * Plusieurs déplacements, un par un, avec un bilan exact par réservation (v7.11.1, pour le repli de terrasse).
   * Ce n'est PAS une opération « tout ou rien » : chaque déplacement confirmé par le serveur est gardé. Au premier
   * incident (refus, réponse perdue), on s'arrête ; les suivants ne sont pas tentés.
   * - 'deplacee'   : écriture confirmée par le serveur (un rafraîchissement raté ensuite n'y change rien) ;
   * - 'refusee'    : refus explicite, avec sa raison ;
   * - 'non-tentee' : pas exécuté (arrêt du traitement), ou réponse perdue puis vérification faite : rien n'a été écrit ;
   * - 'a-verifier' : réponse perdue et état impossible à relire : on ne sait pas.
   * Un second appel pendant le premier ne lance rien (`occupe`).
   * @param {{ id: string, table: string }[]} liste
   * @returns {Promise<{ occupe?: boolean, refus?: string, resultats: { id, table, etat, raison }[] }>}
   */
  let serie = false;
  async function placerUnParUn(liste = []) {
    if (serie || lien.enCours) return { occupe: true, resultats: [] };
    if (lien.etat !== 'a-jour') return { refus: lien.etat === 'hors-ligne' ? 'Pas de liaison avec le serveur : rien n\'a été déplacé.' : 'Connectez-vous pour agir sur les réservations.', resultats: [] };
    serie = true; dire({ enCours: lien.enCours + 1 });
    const resultats = liste.map((x) => ({ id: x.id, table: String(x.table || ''), etat: 'non-tentee', raison: '' }));
    try {
      for (const x of resultats) {
        try { const r = await appel('PUT', `/reservations/${x.id}/table`, { corps: { table: x.table, version: versions(x.id) } }); poser([r.reservation]); x.etat = 'deplacee'; }
        catch (e) {
          if (e.code === 'RESEAU' || e.code === 'SERVEUR') {
            /* Réponse perdue : l'écriture a peut-être eu lieu. On relit l'état avant de conclure, sans rien relancer. */
            const relu = await charger().catch(() => false), r = reservations.get(x.id);
            if (relu && lien.etat === 'a-jour' && r) { const fait = String(r.table || '') === x.table && r.placement === 'placement';
              x.etat = fait ? 'deplacee' : 'non-tentee'; x.raison = fait ? 'La réponse s\'était perdue ; vérification faite : le déplacement est bien enregistré.' : 'La réponse du serveur s\'est perdue ; vérification faite : ce déplacement n\'a pas été enregistré.'; }
            else { x.etat = 'a-verifier'; x.raison = 'Sans réponse du serveur : on ne sait pas si ce déplacement a été enregistré. Vérifiez le plan avant de recommencer.'; }
          } else { if (e.code === 'CONFLIT_VERSION' && e.details?.reservation) poser([e.details.reservation]); x.etat = 'refusee'; x.raison = e.message; }
          break; /* arrêt au premier incident : les suivants restent « non tentés » */
        }
      }
      /* Remettre l'écran à jour ; si cela échoue, le bilan ne change pas (une écriture confirmée reste une réussite). */
      await actualiser().catch(() => false);
    } finally { serie = false; dire({ enCours: Math.max(0, lien.enCours - 1) }); }
    return { resultats };
  }
  function agir(nom, args = {}, meta = {}) {
    if (!ACTIONS_RESA.includes(nom) && !ACTIONS_REGLES[nom]) return local.agir(nom, args, meta);
    if (lien.etat !== 'a-jour' && lien.etat !== 'hors-ligne') { raison = lien.etat === 'interdit' ? 'Votre compte ne donne pas accès aux réservations.' : lien.etat === 'charge' ? 'Chargement en cours : un instant.' : 'Connectez-vous pour agir sur les réservations.'; return false; }
    if (lien.enCours) { raison = 'Un enregistrement est déjà en cours : un instant.'; return false; }
    if (nom === 'ajouterResa' && !args.cle) { const x = args.resa || {}, empreinte = JSON.stringify([x.date, x.service, x.heure, +x.couverts, x.nom, x.telephone]);
      if (cleGardee?.empreinte !== empreinte) cleGardee = { empreinte, cle: cleRequete() }; args = { ...args, cle: cleGardee.cle }; }
    raison = ''; dire({ enCours: lien.enCours + 1 });
    envoyer(nom, args).then((r) => { if (nom === 'ajouterResa') cleGardee = null; dire({ enCours: lien.enCours - 1, etat: 'a-jour', dernier: Date.now(), message: '' }); surFin?.({ ok: true, nom, args, meta, note: r?.note || '' }); },
      async (e) => { /* Refusé ou sans réponse : rien n'est changé. Sur un conflit, le miroir reprend ce que le serveur a. */
        if (e.code === 'CONFLIT_VERSION' && e.details?.reservation) poser([e.details.reservation]); else if (e.code === 'CONFLIT_VERSION' && e.details?.equipe) regles = { ...regles, equipe: e.details.equipe, version: e.details.version }; else if (e.code !== 'RESEAU') await actualiser();
        if (nom === 'ajouterResa' && e.code !== 'RESEAU' && e.code !== 'SERVEUR') cleGardee = null; /* refus net : rien n'a été créé */
        dire({ enCours: lien.enCours - 1 }); surFin?.({ ok: false, nom, args, meta, message: e.code === 'CONFLIT_VERSION' ? `${e.message.replace(/ : l[ae]s? voici à jour\.?$/, '')}. L'écran est à jour : refaites votre geste s'il est encore utile.` : e.message, code: e.code }); });
    return 'attente';
  }

  return {
    /* le même contrat que le dépôt local, pour les écrans */
    etat, resasSite: () => [], demandesSite: () => local.demandesSite(), venues: () => ({}), noterVenue: () => false, ecouter: (f) => local.ecouter(f), abonner: (f) => local.abonner(f),
    agir, placerUnParUn, raisonRefus: () => raison || local.raisonRefus(), noteAction: () => local.noteAction(), toutEffacer: (m) => local.toutEffacer(m), peutAnnuler: () => local.peutAnnuler(), annuler: () => local.annuler(),
    conflitsAnnulation: () => local.conflitsAnnulation(), gardesAnnulation: () => local.gardesAnnulation(), annulationPartielle: () => local.annulationPartielle(),
    /* ce que le mode connecté ajoute */
    connecte: true, reglages: () => regles.reservation, tables: () => regles.tables, compte: () => compte, droits: () => droits, liaison: () => ({ ...lien }), reservation: (id) => reservations.get(id) || null,
    async reprendre() { try { const s = await appel('GET', '/session'); compte = s.compte; droits = s.droits; return charger(); } catch { return false; } },
    async connecter(email, motDePasse) { const s = await appel('POST', '/session', { corps: { email, motDePasse } }); compte = s.compte; droits = s.droits; await charger(); return compte; },
    /** À la déconnexion, le miroir est vidé : aucune donnée client ne reste dans la page. */
    async deconnecter() { arreter(); try { await appel('DELETE', '/session', { corps: {} }); } catch { /* le serveur fermera la session à son échéance */ } compte = null; droits = []; reservations = new Map(); dire({ etat: 'deconnecte', message: '' }); },
    charger, actualiser, suivre, arreter,
  };
}
