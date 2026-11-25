/* Les bilans (v7.15.0) : des chiffres compréhensibles et vérifiables. Fonctions pures, sans écran ni stockage.
   Une même réalité, plusieurs façons de la consulter : chaque indicateur est calculé à partir des dossiers que les autres
   rubriques affichent (réservations, dossiers de réception, commandes, cartes cadeaux, demandes, tâches), par les mêmes
   fonctions de lecture. Rien n'est copié ni gardé : un bilan se recalcule à chaque affichage.
   Chaque indicateur porte sa définition (`DEFINITIONS`) : ce qui est compté, les statuts inclus et exclus, la date qui
   le rattache à la période, sa source et le traitement d'une donnée manquante ; et la liste des dossiers comptés
   (`dossiers`), pour les retrouver depuis le chiffre.
   Une valeur `null` veut dire « non disponible » (elle n'est jamais affichée comme un zéro) ; `0` veut dire zéro connu.
   Les montants gardent leur libellé exact : aucun n'est un chiffre d'affaires encaissé. */
import { ajouter, fmt, heure, pluriel, resasDuJour, instantCtx } from './espace-regles.js?v=7';
import { lundiDe } from './espace-conseils.js?v=7';
import { dossiersDe, resume, etatRetenue, accordsDe, versionsDe, totalProposition } from './espace-receptions.js?v=7';
import { commandes, cadeaux, cartes, etatCarte, soldeCarte, utilisationsActives, nomClient, retraitTexte, ETATS, ETATS_CARTE } from './commerce.js?v=7';
import { tachesDe } from './espace-taches.js?v=7';

const arr = (n) => Math.round((+n || 0) * 100) / 100;
const jourDit = (iso) => fmt(iso, { weekday: 'long', day: 'numeric', month: 'long' });
const dans = (p, iso) => !!iso && String(iso).slice(0, 10) >= p.debut && String(iso).slice(0, 10) <= p.fin;
const quandDit = (t) => (t ? `${fmt(String(t).slice(0, 10), { day: 'numeric', month: 'long' })}${String(t).length > 10 ? ` à ${heure(String(t).slice(11, 16))}` : ''}` : 'date inconnue');

/** Les périodes proposées : le jour choisi, la semaine en cours (lundi → dimanche) et la précédente, d'après la date de référence. */
export function periodes(auj, jour = auj) {
  const lundi = lundiDe(auj);
  return [{ cle: 'jour', nom: 'Le jour', debut: jour, fin: jour }, { cle: 'semaine', nom: 'Cette semaine', debut: lundi, fin: ajouter(lundi, 6) }, { cle: 'precedente', nom: 'La semaine précédente', debut: ajouter(lundi, -7), fin: ajouter(lundi, -1) }];
}
/** La période dite avec ses dates exactes : « mercredi 2 décembre 2026 », « du lundi 30 novembre au dimanche 6 décembre 2026 ». */
export const periodeDite = (p) => (p.debut === p.fin ? fmt(p.debut, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  : `du ${fmt(p.debut, { weekday: 'long', day: 'numeric', month: 'long', ...(p.debut.slice(0, 4) === p.fin.slice(0, 4) ? {} : { year: 'numeric' }) })} au ${fmt(p.fin, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`);
/** Un taux honnête : null (non disponible) si le dénominateur est nul ou inconnu ; sinon { valeur (0 à 1), numerateur, denominateur }. */
export const taux = (numerateur, denominateur) => (typeof numerateur === 'number' && typeof denominateur === 'number' && denominateur > 0 ? { valeur: numerateur / denominateur, numerateur, denominateur } : null);

/**
 * Les définitions : une par indicateur. Elles sont affichées sous le chiffre (« Comment est-ce compté ? »), reprises dans
 * `_exploitation/indicateurs.md` et vérifiées par les tests. `portee` : 'periode' (rattaché à la période par sa date) ou
 * 'instant' (état au moment où le bilan est consulté, indépendant de la période : c'est dit à l'écran).
 */
export const DEFINITIONS = {
  'resa-reserves': { domaine: 'restaurant', libelle: 'Couverts réservés', portee: 'periode', compte: 'La somme des couverts des réservations tenues.', inclus: 'Réservations confirmées et réservations dont le groupe est noté arrivé.', exclus: 'Demandes encore à confirmer, réservations refusées, annulées ou notées absentes ; liste d\'attente ; commandes à emporter.', date: 'La date de venue de la réservation.', source: 'L\'agenda des réservations (statut de chaque réservation).', manquant: 'Une réservation sans nombre de couverts compte pour zéro couvert et reste listée.' },
  'resa-recus': { domaine: 'restaurant', libelle: 'Couverts notés arrivés', portee: 'periode', compte: 'La somme des couverts des groupes dont l\'arrivée a été notée.', inclus: 'Réservations au statut « Arrivés » (installées ou parties comprises).', exclus: 'Réservations confirmées dont l\'arrivée n\'a pas été notée : on ne sait pas si elles sont venues.', date: 'La date de venue de la réservation.', source: 'Le statut noté pendant le service.', manquant: 'Non disponible tant que la période n\'a pas commencé. Une arrivée non renseignée ne prouve pas une absence : elle n\'est simplement pas comptée, et ce chiffre est un minimum connu.' },
  'resa-annulees': { domaine: 'restaurant', libelle: 'Réservations annulées', portee: 'periode', compte: 'Le nombre de réservations annulées, et leurs couverts.', inclus: 'Réservations au statut « Annulée ».', exclus: 'Demandes refusées par le restaurant ; absences.', date: 'La date de venue prévue.', source: 'Le statut de la réservation.', manquant: 'La date de l\'annulation elle-même n\'est pas gardée : le rattachement se fait à la date de venue prévue.' },
  'resa-absentes': { domaine: 'restaurant', libelle: 'Absences notées', portee: 'periode', compte: 'Le nombre de réservations notées absentes, et leurs couverts.', inclus: 'Réservations au statut « Absents ».', exclus: 'Retards ; réservations dont l\'arrivée n\'est simplement pas notée.', date: 'La date de venue prévue.', source: 'Le statut noté par l\'équipe.', manquant: 'Une absence non notée n\'apparaît pas : zéro veut dire « aucune absence notée ».' },
  'resa-venue': { domaine: 'restaurant', libelle: 'Part des couverts notés arrivés', portee: 'periode', precision: 'Sur les jours commencés', compte: 'Un pourcentage d\'avancement : les couverts notés arrivés, divisés par les couverts des réservations tenues ou notées absentes, sur les jours déjà commencés de la période.', inclus: 'Numérateur : couverts des groupes notés arrivés. Dénominateur : couverts confirmés + notés arrivés + notés absents. Seuls les jours déjà commencés comptent, aujourd\'hui compris en entier : le service du soir pèse dans le dénominateur dès le matin.', exclus: 'Jours à venir ; demandes à confirmer, refusées, annulées.', date: 'La date de venue, dans la période affichée (ses dates exactes sont écrites en haut du bilan).', source: 'Les statuts de l\'agenda.', manquant: 'Une arrivée non renseignée ne prouve pas une absence : ce pourcentage dit où en sont les arrivées connues à ce stade, pas un taux de présence définitif. Non disponible si le dénominateur est nul (aucun couvert sur les jours commencés) : aucun pourcentage n\'est affiché.' },
  'rec-en-cours': { domaine: 'receptions', libelle: 'Dossiers en cours', portee: 'instant', compte: 'Le nombre de dossiers de réception ouverts.', inclus: 'Dossiers à qualifier, en proposition, en attente de décision ou en préparation.', exclus: 'Dossiers classés sans suite ou terminés ; demandes de réception qui n\'ont pas encore de dossier (comptées dans « Demandes à traiter » si elles sont nouvelles).', date: 'Aucune : c\'est l\'état au moment de la consultation, quelle que soit la période choisie.', source: 'Les dossiers de réception.', manquant: 'Non disponible quand les dossiers ne sont pas accessibles dans ce mode.' },
  'rec-options': { domaine: 'receptions', libelle: 'Options à échéance', portee: 'periode', compte: 'Le nombre d\'options dont l\'échéance tombe dans la période.', inclus: 'Options encore valables et options déjà expirées, si leur échéance est dans la période.', exclus: 'Réceptions confirmées, espaces libérés, dossiers sans option.', date: 'La date d\'échéance de l\'option.', source: 'La retenue d\'espaces du dossier.', manquant: 'Une option sans date d\'échéance ne peut pas être rattachée : elle est listée à part.' },
  'rec-acceptees': { domaine: 'receptions', libelle: 'Versions de propositions acceptées', portee: 'periode', note: 'Un même dossier peut apparaître avec plusieurs versions acceptées (une première, puis une autre). Le montant additionne les versions comptées : il ne représente pas nécessairement la valeur actuelle des réceptions confirmées, et ce ne sont pas des encaissements.', compte: 'Le nombre de versions de proposition qui ont reçu un accord pendant la période, et la somme des montants de ces versions.', inclus: 'Accord simulé du client ou accord noté par l\'équipe, sur une version présentée. Si un dossier a vu accepter une version puis une autre, chacune est comptée, à la date de son accord.', exclus: 'Propositions en préparation, présentées sans accord, versions retirées.', date: 'La date de l\'accord. Elle doit être connue.', source: 'Le dossier (la version acceptée garde son contenu et son total).', manquant: 'Un accord sans date connue n\'est rattaché à aucune période : il est signalé à part, sans être compté. Le montant de chaque version est celui qu\'elle a gardé, jamais recalculé avec le catalogue actuel ; leur somme n\'est ni la valeur courante des réceptions confirmées, ni un encaissement.' },
  'cmd-validees': { domaine: 'traiteur', libelle: 'Commandes validées', portee: 'periode', compte: 'Le nombre de commandes acceptées par l\'équipe, et le montant des commandes concernées.', inclus: 'Commandes validées, en préparation, prêtes ou retirées.', exclus: 'Demandes non décidées, refusées, commandes annulées.', date: 'Le jour de retrait de la commande (bilan opérationnel).', source: 'Le dossier de chaque commande (lignes et prix conservés).', manquant: 'Une commande dont un prix d\'époque n\'est pas conservé n\'a pas de total : elle est comptée, et son montant est dit « non disponible ».' },
  'cmd-a-preparer': { domaine: 'traiteur', libelle: 'À préparer', portee: 'periode', compte: 'Les commandes validées qui ne sont pas encore prêtes.', inclus: 'Commandes validées ou en préparation.', exclus: 'Prêtes, retirées, annulées, non décidées.', date: 'Le jour de retrait.', source: 'L\'état de la commande.', manquant: 'Détail de « Commandes validées » : ne pas additionner les deux.' },
  'cmd-pretes': { domaine: 'traiteur', libelle: 'Prêtes', portee: 'periode', compte: 'Les commandes prêtes qui attendent le client.', inclus: 'Commandes à l\'état « Prête ».', exclus: 'Toutes les autres.', date: 'Le jour de retrait.', source: 'L\'état de la commande.', manquant: 'Détail de « Commandes validées » : ne pas additionner les deux.' },
  'cmd-retirees': { domaine: 'traiteur', libelle: 'Retirées', portee: 'periode', compte: 'Les commandes remises au client.', inclus: 'Commandes à l\'état « Retirée ».', exclus: 'Toutes les autres.', date: 'Le jour de retrait prévu de la commande.', source: 'L\'état de la commande.', manquant: 'Détail de « Commandes validées » : ne pas additionner les deux.' },
  'carte-emises': { domaine: 'cadeaux', libelle: 'Cartes émises', portee: 'periode', compte: 'Le nombre de cartes cadeaux émises, et la valeur des cartes émises.', inclus: 'Chaque carte, une fois, à son émission (désactivée ou expirée depuis comprise : l\'émission a eu lieu).', exclus: 'Demandes de carte non encore émises.', date: 'La date d\'émission de la carte.', source: 'Les cartes émises.', manquant: 'La valeur émise n\'est pas un encaissement : le règlement est simulé.' },
  'carte-utilisations': { domaine: 'cadeaux', libelle: 'Utilisations enregistrées', portee: 'periode', compte: 'Le nombre d\'utilisations notées sur les cartes, et leur montant.', inclus: 'Utilisations enregistrées et non annulées (après correction, le montant corrigé).', exclus: 'Utilisations annulées.', date: 'La date de l\'utilisation.', source: 'L\'historique de chaque carte.', manquant: 'Une utilisation consomme une valeur déjà émise : ne pas l\'additionner à la valeur des cartes émises.' },
  'cad-reglements': { domaine: 'cadeaux', libelle: 'Règlements simulés', portee: 'periode', compte: 'Le nombre de règlements simulés notés sur les demandes de cartes, et leur montant.', inclus: 'Demandes de carte dont le règlement simulé est enregistré.', exclus: 'Demandes reçues ou validées sans règlement noté.', date: 'La date du règlement simulé.', source: 'La demande de carte cadeau.', manquant: 'Rien n\'est encaissé : c\'est une note de l\'équipe, dans cette maquette.' },
  'carte-soldes': { domaine: 'cadeaux', libelle: 'Soldes des cartes', portee: 'instant', compte: 'La somme des soldes, séparée selon l\'état de la carte.', inclus: 'Solde utilisable : cartes actives. Solde non utilisable : cartes expirées et cartes désactivées, chacune à part.', exclus: 'Cartes épuisées (solde nul).', date: 'Aucune : c\'est l\'état au moment de la consultation.', source: 'Les cartes émises et leurs utilisations.', manquant: 'Le solde d\'une carte expirée ou désactivée est un solde historique : il n\'est jamais compté dans le solde utilisable.' },
  'suivi-demandes': { domaine: 'suivi', libelle: 'Demandes à traiter', portee: 'instant', compte: 'Ce qui attend une réponse de l\'équipe.', inclus: 'Demandes de table à confirmer (à venir) et demandes nouvelles : réceptions, commandes, cartes cadeaux, questions.', exclus: 'Demandes déjà décidées ou en cours de suivi.', date: 'Aucune : c\'est l\'état au moment de la consultation. C\'est le même compte que celui de la rubrique Demandes.', source: 'La rubrique Demandes.', manquant: '—' },
  'suivi-taches': { domaine: 'suivi', libelle: 'Tâches arrivées à échéance', portee: 'periode', compte: 'Les tâches non terminées dont l\'échéance tombe dans la période.', inclus: 'Tâches à faire avec une échéance dans la période (dont celles déjà en retard).', exclus: 'Tâches terminées ; tâches sans échéance.', date: 'L\'échéance de la tâche.', source: 'Les tâches de l\'équipe (sur cet appareil).', manquant: 'Une tâche sans échéance n\'est rattachée à aucune période.' },
};
export const DOMAINES = [['restaurant', 'Restaurant'], ['receptions', 'Réceptions'], ['traiteur', 'Traiteur'], ['cadeaux', 'Cartes cadeaux'], ['suivi', 'Suivi']];

const ind = (id, plus) => ({ id, ...DEFINITIONS[id], definition: DEFINITIONS[id], valeur: null, dossiers: [], ...plus });
const indisponible = (id, raison) => ind(id, { valeur: null, raison });
const STATUT_RESA = { 'a-confirmer': 'à confirmer', confirmee: 'confirmée', arrivee: 'arrivés', absente: 'absents', refusee: 'refusée', annulee: 'annulée' };

/**
 * Le bilan d'une période.
 * @param {object} ctx  le contexte de l'espace (R, auj, site, exemples, scenario, lieux, venues, maintenant, connecte)
 * @param {object} S    l'état de l'espace
 * @param {{ debut: string, fin: string }} periode
 * @param {{ demandes?: object[], attente?: { tables: object[], autres: object[] } }} sources  les demandes mises en forme
 *        et ce qui attend une réponse (les mêmes listes que la rubrique Demandes)
 * @returns {{ periode, dite, instant, indicateurs: object[], parDomaine: Record<string, object[]> }}
 */
export function bilan(ctx, S, periode, { demandes = [], attente = null } = {}) {
  const p = { debut: periode.debut, fin: periode.fin }, auj = ctx.auj, instant = instantCtx(ctx), out = [];
  const jours = []; for (let d = p.debut; d <= p.fin && jours.length < 62; d = ajouter(d, 1)) jours.push(d);

  /* ----- Restaurant : chaque réservation se rapporte à sa date de venue ----- */
  const resas = jours.flatMap((iso) => resasDuJour(ctx, S, iso)), nb = (l) => l.reduce((n, r) => n + (+r.couverts || 0), 0);
  const ligneResa = (r) => ({ type: 'resa', id: r.id, titre: `${r.nom || 'Sans nom'} · ${pluriel(+r.couverts || 0, 'couvert')}`, detail: `${jourDit(r.date)} à ${heure(r.heure)} · ${STATUT_RESA[r.statut] || r.statut}`, aller: { vue: 'resas', onglet: 'service', jour: r.date, service: r.service, resa: r.id } });
  const de = (...st) => resas.filter((r) => st.includes(r.statut));
  const tenues = de('confirmee', 'arrivee'), recues = de('arrivee'), annulees = de('annulee'), absentes = de('absente');
  out.push(ind('resa-reserves', { valeur: nb(tenues), unite: 'couvert', detail: `${pluriel(tenues.length, 'réservation')}`, dossiers: tenues.map(ligneResa) }));
  out.push(p.debut > auj ? indisponible('resa-recus', 'La période n\'a pas encore commencé : aucune arrivée ne peut être notée.')
    : ind('resa-recus', { valeur: nb(recues), unite: 'couvert', detail: `${pluriel(recues.length, 'groupe')} ${recues.length > 1 ? 'notés arrivés' : 'noté arrivé'}${p.fin >= auj ? ' à ce stade' : ''}`, dossiers: recues.map(ligneResa) }));
  out.push(ind('resa-annulees', { valeur: annulees.length, unite: 'réservation', detail: annulees.length ? pluriel(nb(annulees), 'couvert') : '', dossiers: annulees.map(ligneResa) }));
  out.push(ind('resa-absentes', { valeur: absentes.length, unite: 'réservation', detail: absentes.length ? pluriel(nb(absentes), 'couvert') : '', dossiers: absentes.map(ligneResa) }));
  { const commences = resas.filter((r) => r.date <= auj), num = nb(commences.filter((r) => r.statut === 'arrivee')), den = nb(commences.filter((r) => ['confirmee', 'arrivee', 'absente'].includes(r.statut))), t = taux(num, den);
    out.push(t ? ind('resa-venue', { valeur: t.valeur, taux: t, unite: 'taux', detail: `${num} sur ${pluriel(den, 'couvert')}`, commences: { debut: p.debut, fin: p.fin < auj ? p.fin : auj }, dossiers: commences.filter((r) => ['confirmee', 'arrivee', 'absente'].includes(r.statut)).map(ligneResa) })
      : indisponible('resa-venue', p.debut > auj ? 'La période n\'a pas encore commencé.' : 'Aucun couvert réservé sur les jours commencés : pas de pourcentage.')); }

  /* ----- Réceptions : les dossiers eux-mêmes, relus (jamais copiés) ----- */
  if (ctx.exemples === false) { const raison = 'Les dossiers de réception ne sont pas encore partagés sur le site d\'essai connecté.'; out.push(indisponible('rec-en-cours', raison), indisponible('rec-options', raison), indisponible('rec-acceptees', raison)); }
  else { const dossiers = dossiersDe(S), R = dossiers.map((d) => ({ d, r: resume(ctx, d, []) }));
    const ligne = ({ d, r }, detail, onglet = 'projet') => ({ type: 'reception', id: d.id, titre: `${r.client} · ${r.intitule}`, detail, aller: { dossier: d.id, onglet } });
    const ouverts = R.filter((x) => x.r.phase !== 'termine');
    out.push(ind('rec-en-cours', { valeur: ouverts.length, unite: 'dossier', dossiers: ouverts.map((x) => ligne(x, `${x.r.etape.libelle} · ${x.r.quand}`)) }));
    const options = [], sansDate = [];
    for (const x of R) { const e = etatRetenue(x.d, instant); if (!['option', 'expiree'].includes(e.etat)) continue; if (!e.echeance) { sansDate.push(x); continue; }
      if (dans(p, e.echeance)) options.push(ligne(x, `${e.etat === 'option' ? 'Option valable' : 'Option expirée'} · échéance ${quandDit(e.echeance)}`, 'espaces')); }
    out.push(ind('rec-options', { valeur: options.length, unite: 'option', dossiers: options, ...(sansDate.length ? { aPart: `${pluriel(sansDate.length, 'option')} sans date d'échéance : non ${sansDate.length > 1 ? 'rattachées' : 'rattachée'} à une période.` } : {}) }));
    /* Une acceptation : une version présentée + un accord. La date de l'accord rattache à la période ; le montant est celui gardé par la version. */
    const acceptees = [], inconnues = []; let montant = 0;
    for (const x of R) { const acc = accordsDe(x.d, ctx.venues?.[x.d.id] || {});
      for (const v of versionsDe(x.d)) { const a = acc[v.v]; if (!a || v.etat !== 'presentee') continue; const total = typeof v.total === 'number' ? v.total : totalProposition(v);
        if (!a.le) { inconnues.push(x); continue; } if (!dans(p, a.le)) continue;
        montant = arr(montant + total); acceptees.push({ ...ligne(x, `Version ${v.v} acceptée le ${quandDit(a.le)} (${a.par === 'client' ? 'accord simulé du client' : 'accord noté par l\'équipe'}) · ${String(arr(total)).replace('.', ',')} €`, 'proposition'), montant: total }); } }
    out.push(ind('rec-acceptees', { valeur: acceptees.length, unite: 'version', montant, montantLibelle: 'Somme des montants de ces versions', dossiers: acceptees, ...(inconnues.length ? { aPart: `${pluriel(inconnues.length, 'accord')} sans date connue : non ${inconnues.length > 1 ? 'comptés' : 'compté'}.` } : {}) })); }

  /* ----- Traiteur : chaque commande se rapporte à son jour de retrait ; une commande n'est comptée qu'une fois ----- */
  { const cmd = commandes(demandes, S, ctx.lieux).filter((c) => dans(p, c.jour));
    const ligne = (c) => ({ type: 'commande', id: c.id, titre: `${c.ref} · ${nomClient(c.client)}`, detail: `${ETATS[c.etat] || c.etat} · retrait ${retraitTexte(c)}${typeof c.total === 'number' ? ` · ${String(arr(c.total)).replace('.', ',')} €` : ' · montant non disponible'}`, aller: { commande: c.id }, montant: typeof c.total === 'number' ? c.total : null });
    const de2 = (...e) => cmd.filter((c) => e.includes(c.etat)), val = de2('validee', 'preparation', 'prete', 'retiree'), sansTotal = val.filter((c) => typeof c.total !== 'number').length;
    out.push(ind('cmd-validees', { valeur: val.length, unite: 'commande', montant: sansTotal === val.length && val.length ? null : arr(val.reduce((s, c) => s + (typeof c.total === 'number' ? c.total : 0), 0)), montantLibelle: 'Montant des commandes concernées', dossiers: val.map(ligne),
      ...(sansTotal ? { aPart: `${pluriel(sansTotal, 'commande')} sans total (prix d'époque non conservé) : ${sansTotal > 1 ? 'comptées' : 'comptée'}, hors montant.` } : {}) }));
    out.push(ind('cmd-a-preparer', { valeur: de2('validee', 'preparation').length, unite: 'commande', sous: 'cmd-validees', dossiers: de2('validee', 'preparation').map(ligne) }));
    out.push(ind('cmd-pretes', { valeur: de2('prete').length, unite: 'commande', sous: 'cmd-validees', dossiers: de2('prete').map(ligne) }));
    out.push(ind('cmd-retirees', { valeur: de2('retiree').length, unite: 'commande', sous: 'cmd-validees', dossiers: de2('retiree').map(ligne) })); }

  /* ----- Cartes cadeaux : une émission et une utilisation sont deux événements, chacun à sa date ; jamais additionnés ----- */
  { const toutes = cartes(S), eu = (n) => `${String(arr(n)).replace('.', ',')} €`;
    const ligne = (c, detail) => ({ type: 'carte', id: c.id, titre: `Carte ${c.code}`, detail, aller: { commerce: { ecran: 'carte', id: c.id } } });
    const emises = toutes.filter((c) => dans(p, c.emise));
    out.push(ind('carte-emises', { valeur: emises.length, unite: 'carte', montant: arr(emises.reduce((s, c) => s + (+c.valeur || 0), 0)), montantLibelle: 'Valeur des cartes émises', dossiers: emises.map((c) => ({ ...ligne(c, `Émise le ${quandDit(c.emise)} · valeur ${eu(c.valeur)} · ${ETATS_CARTE[etatCarte(c, auj)].toLowerCase()}`), montant: +c.valeur || 0 })) }));
    const usages = toutes.flatMap((c) => utilisationsActives(c).filter((u) => dans(p, u.le)).map((u) => ({ c, u })));
    out.push(ind('carte-utilisations', { valeur: usages.length, unite: 'utilisation', montant: arr(usages.reduce((s, x) => s + (+x.u.montant || 0), 0)), montantLibelle: 'Utilisations enregistrées', dossiers: usages.map(({ c, u }) => ({ ...ligne(c, `Utilisation de ${eu(u.montant)} le ${quandDit(u.le)}${u.ref ? ` (${u.ref})` : ''}`), montant: +u.montant || 0 })) }));
    const regl = cadeaux(demandes, S, ctx.lieux).filter((c) => c.reglement?.le && dans(p, c.reglement.le));
    out.push(ind('cad-reglements', { valeur: regl.length, unite: 'règlement simulé', montant: arr(regl.reduce((s, c) => s + (+c.reglement.montant || 0), 0)), montantLibelle: 'Règlements simulés', dossiers: regl.map((c) => ({ type: 'cadeau', id: c.id, titre: `${c.ref} · ${c.acheteur?.nom || c.de || 'Acheteur à préciser'}`, detail: `Règlement simulé de ${eu(c.reglement.montant)} le ${quandDit(c.reglement.le)} : rien n'est encaissé`, aller: { commerce: { ecran: 'cadeau', id: c.id } }, montant: +c.reglement.montant || 0 })) }));
    /* Les soldes : par état de carte. Seul le solde des cartes actives est utilisable. */
    const par = (etat) => toutes.filter((c) => etatCarte(c, auj) === etat), somme = (l) => arr(l.reduce((s, c) => s + soldeCarte(c), 0)), actives = par('active'), expirees = par('expiree'), desactivees = par('desactivee');
    out.push(ind('carte-soldes', { valeur: toutes.length ? somme(actives) : null, unite: 'euro', ...(toutes.length ? {} : { raison: 'Aucune carte n\'est émise : aucun solde à calculer.' }),
      parts: toutes.length ? [{ cle: 'utilisable', libelle: 'Solde utilisable (cartes actives)', montant: somme(actives), n: actives.length }, { cle: 'expire', libelle: 'Solde historique des cartes expirées (non utilisable)', montant: somme(expirees), n: expirees.length }, { cle: 'desactive', libelle: 'Solde des cartes désactivées (non utilisable)', montant: somme(desactivees), n: desactivees.length }] : [],
      dossiers: [...actives, ...expirees, ...desactivees].map((c) => ligne(c, `${ETATS_CARTE[etatCarte(c, auj)]} · solde ${eu(soldeCarte(c))}${etatCarte(c, auj) === 'active' ? '' : ' (non utilisable)'}`)) })); }

  /* ----- Suivi ----- */
  if (attente) { const t = attente.tables || [], a = attente.autres || [];
    out.push(ind('suivi-demandes', { valeur: t.length + a.length, unite: 'demande', dossiers: [...t.map((r) => ({ type: 'resa', id: r.id, titre: `${r.nom || 'Sans nom'} · table pour ${+r.couverts || 0}`, detail: `À confirmer · ${jourDit(r.date)} à ${heure(r.heure)}`, aller: { vue: 'resas', onglet: 'service', jour: r.date, service: r.service, resa: r.id } })),
      ...a.map((d) => ({ type: 'demande', id: d.id, titre: `${d.qui} · ${d.titre}`, detail: `Nouvelle demande, reçue le ${quandDit(d.cree)}`, aller: { vue: 'demandes', filtre: d.genre, demande: d.id } }))] })); }
  else out.push(indisponible('suivi-demandes', 'Les demandes ne sont pas disponibles dans ce contexte.'));
  { const l = tachesDe(S).filter((t) => !t.fait && t.echeance && dans(p, t.echeance)), retard = l.filter((t) => t.echeance < auj).length;
    out.push(ind('suivi-taches', { valeur: l.length, unite: 'tâche', detail: l.length ? (retard ? `dont ${retard} en retard` : 'aucune en retard') : '', dossiers: l.map((t) => ({ type: 'tache', id: t.id, titre: t.titre, detail: `Échéance ${jourDit(t.echeance)}${t.echeance < auj ? ' · en retard' : ''}${t.responsable ? ` · ${t.responsable}` : ''}`, aller: { vue: 'jour', ancre: 't-taches' } })) })); }

  const parDomaine = Object.fromEntries(DOMAINES.map(([d]) => [d, out.filter((x) => x.domaine === d)]));
  return { periode: p, dite: periodeDite(p), instant, indicateurs: out, parDomaine };
}
/** Un indicateur par son identifiant. */
export const indicateur = (b, id) => b.indicateurs.find((x) => x.id === id) || null;
