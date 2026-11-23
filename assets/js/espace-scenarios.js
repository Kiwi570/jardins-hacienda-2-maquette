/* « Lancer une démonstration » (v7.11.1) : les scénarios (cinq depuis la v7.12.0), en fonctions pures (testées par
   `node --test _audit/tests/*.test.mjs`).

   Un scénario, c'est : une date et une heure simulées, un état de départ préparé (réservations, tables, liste
   d'attente : toutes fictives, marquées « Exemple »), trois à cinq actions suggérées et une conclusion.
   - Les écrans et les règles sont ceux de la maquette : le scénario ne fait que préparer la situation.
   - Chaque étape est « faite » quand l'état le montre réellement (une réservation annulée, un groupe installé…) ou,
     pour une étape « regarder », quand l'écran a vraiment été ouvert (`vus`) : aucune conclusion sur de simples clics.
   - Les données vivent dans le contexte du scénario (voir espace-stock.js) : les données habituelles ne bougent pas.
   - Rien n'est envoyé, rien ne part vers un serveur : le lanceur n'existe pas en mode connecté. */
import { ajouter, ouvertSite, telephoneDemo } from './espace-regles.js?v=7';
import { terrasseOuverte, cleSalle } from './espace-salle.js?v=7';
import { exempleEte } from './espace-repli.js?v=7';
import { normaliser } from './espace-demandes.js?v=7';
import { MUTATIONS_RECEPTIONS, dossierDepuisDemande, idDossier, argsRetenue, accepteeDe, commerceDe, nomsEspaces, instantDit, etatRetenue, ligneDepuisOffre, totalProposition, euros } from './espace-receptions.js?v=7';
import { offre as offreCatalogue } from './espace-offres.js?v=7';
import { retenueActive } from './disponibilites.js?v=7';

const SOIR = 'soir', jourSemaine = (iso) => new Date(`${iso}T12:00:00Z`).getUTCDay();
/** Le prochain vendredi où le soir est ouvert (aujourd'hui compris) : le jour des scénarios 1, 2 et 4. */
export function prochainVendredi(R, reel) { for (let k = 0; k < 60; k++) { const d = ajouter(reel, k); if (jourSemaine(d) === 5 && ouvertSite(R, d, SOIR)) return d; } return reel; }
/** Le prochain samedi soir d'été (terrasse ouverte) : le jour du scénario 3. */
export function prochainSamediDEte(R, reel) { for (let k = 0; k < 400; k++) { const d = ajouter(reel, k); if (jourSemaine(d) === 6 && terrasseOuverte(d) && ouvertSite(R, d, SOIR)) return d; } return reel; }

const resa = (id, iso, heure, couverts, nom, statut = 'confirmee', demande = '') => ({ id, date: iso, service: SOIR, heure, couverts, nom, telephone: telephoneDemo(nom), demande, espace: 'salle', statut, source: 'demo' });
/* Les habitués des histoires : les mêmes personnes d'un scénario à l'autre. */
const COUPLE = 'Aurélie et Marc', WEBER = 'Famille Weber', CAMILLE = 'Camille R.', ROSE = 'Rose S.', CLARA = 'Clara M.', HUGO = 'Hugo et Léa';
const presenceDe = (c, id) => { const r = (c.S.resa?.ajouts || []).find((x) => x.id === id), st = c.S.resa?.statuts?.[id] || r?.statut, p = c.S.service?.presence?.[id]?.etat; return st !== 'arrivee' ? st : p || 'arrivee'; };
const vu = (c, cle) => !!c.vus?.[cle];
const tableDe = (c, id) => String(c.S.resa?.tables?.[id] ?? '');
const dehors = (t) => /^(10|11|12)(\+|$)|\+(10|11|12)$/.test(t);

export const SCENARIOS = [
  { id: 'service', numero: 1, titre: 'Le service commence', duree: '3 minutes',
    situation: 'Vendredi soir, 20 h 10. Deux tables sont installées, trois réservations arrivent, une table vient d\'être quittée.',
    montre: 'La différence entre un client arrivé, un groupe installé, une table vide et une table prête.',
    quand: (R, reel) => ({ iso: prochainVendredi(R, reel), min: 20 * 60 + 10 }), depart: { vue: 'resas', onglet: 'service' },
    etat(R, iso) {
      const l = [resa('sc1-hugo', iso, '19:00', 2, HUGO, 'arrivee', 'Pressés, séance de cinéma à 21 h'), resa('sc1-weber', iso, '20:00', 8, WEBER, 'arrivee', 'Une occasion à fêter'), resa('sc1-couple', iso, '20:15', 2, COUPLE, 'confirmee', 'Anniversaire de mariage'),
        resa('sc1-rose', iso, '20:30', 4, ROSE), resa('sc1-camille', iso, '20:30', 2, CAMILLE, 'confirmee', 'Allergie aux fruits à coque')];
      return { etat: { resa: { ajouts: l, tables: { 'sc1-hugo': '6', 'sc1-weber': '7', 'sc1-couple': '1', 'sc1-rose': '4', 'sc1-camille': '3' } },
        service: { presence: { 'sc1-hugo': { etat: 'installe', installeA: 19 * 60 + 5 }, 'sc1-weber': { etat: 'installe', installeA: 20 * 60 + 2 } }, tables: { [cleSalle(iso, SOIR)]: { 2: 'a-debarrasser' } } } } };
    },
    etapes: [
      { id: 'arrivee', texte: 'Dans Service, signalez l\'arrivée d\'Aurélie et Marc.', fait: (c) => ['arrivee', 'installe', 'parti'].includes(presenceDe(c, 'sc1-couple')) },
      { id: 'installer', texte: 'Installez-les : leur table 1 est prête.', fait: (c) => ['installe', 'parti'].includes(presenceDe(c, 'sc1-couple')) },
      { id: 'passage', texte: '« Des clients se présentent » : accueillez deux personnes sans réservation, et lisez pourquoi certaines tables ne conviennent pas.', fait: (c) => (c.S.resa?.ajouts || []).some((r) => r.source === 'passage') },
      { id: 'depart', texte: 'Hugo et Léa s\'en vont : notez leur départ.', fait: (c) => presenceDe(c, 'sc1-hugo') === 'parti' },
      { id: 'table', texte: 'Leur table 6 est à débarrasser : « Débarrassée », puis « Table prête ».', fait: (c) => presenceDe(c, 'sc1-hugo') === 'parti' && !c.S.service?.tables?.[cleSalle(c.iso, SOIR)]?.[6] },
    ],
    conclusion: () => 'Un client arrivé n\'est pas encore installé, et une table vide n\'est pas encore une table prête : l\'espace suit les deux, geste après geste.' },

  { id: 'attente', numero: 2, titre: 'Une place se libère', duree: '3 minutes',
    situation: 'Vendredi, 18 h 30. La grande table est réservée par la famille Weber. Deux tablées de neuf attendent une place pour ce soir.',
    montre: 'Une annulation profite à la liste d\'attente : proposition, échéance, acceptation, une seule réservation créée.',
    quand: (R, reel) => ({ iso: prochainVendredi(R, reel), min: 18 * 60 + 30 }), depart: { vue: 'resas', onglet: 'service' },
    etat(R, iso) {
      const l = [resa('sc2-couple', iso, '19:30', 2, COUPLE, 'confirmee', 'Anniversaire de mariage'), resa('sc2-rose', iso, '19:30', 4, ROSE), resa('sc2-weber', iso, '20:00', 8, WEBER, 'confirmee', 'Une occasion à fêter'), resa('sc2-clara', iso, '20:00', 5, CLARA), resa('sc2-camille', iso, '20:30', 2, CAMILLE, 'confirmee', 'Allergie aux fruits à coque')];
      const att = (id, cree, nom, heure, souplesse, note = '') => ({ id, cree, nom, telephone: telephoneDemo(nom), email: '', couverts: 9, date: iso, periode: SOIR, heure, souplesse, espaces: [], note, statut: 'en-attente', source: 'demo' });
      return { etat: { resa: { ajouts: l, tables: { 'sc2-couple': '1', 'sc2-rose': '4', 'sc2-weber': '7', 'sc2-clara': '5', 'sc2-camille': '3' } },
        attente: { liste: [att('sc2-lambert', `${ajouter(iso, -2)}T19:40:00`, 'Tablée Lambert', '20:00', 60, 'Un départ à la retraite'), att('sc2-sylvie', `${ajouter(iso, -1)}T09:05:00`, 'Les amis de Sylvie', '20:00', 999)] } } };
    },
    etapes: [
      { id: 'annuler', texte: 'Dans Service, la famille Weber annule : « Autres actions », puis « Le client annule ».', fait: (c) => (c.S.resa?.statuts?.['sc2-weber'] || '') === 'annulee' },
      { id: 'voir', texte: 'Ouvrez l\'onglet Attente : la tablée Lambert, la plus ancienne, peut recevoir la place.', fait: (c) => vu(c, 'attente-vue') && (c.S.resa?.statuts?.['sc2-weber'] || '') === 'annulee' },
      { id: 'proposer', texte: 'Préparez la proposition et lisez son échéance.', fait: (c) => !!c.S.attente?.suivi?.['sc2-lambert']?.proposition },
      { id: 'accepter', texte: '« Le client accepte » : la réservation est créée, une seule fois.', fait: (c) => c.S.attente?.suivi?.['sc2-lambert']?.statut === 'acceptee' && (c.S.resa?.ajouts || []).filter((r) => r.source === 'attente').length === 1 },
    ],
    variante: 'Pour montrer une expiration : recommencez le scénario, préparez la proposition, puis « Avancer de 15 minutes » jusqu\'à l\'échéance (19 h). Après 19 h, la proposition devient « dernière minute ».',
    conclusion: () => 'La tablée Lambert a sa réservation, l\'inscription est close, et la seconde tablée reste en attente : la liste d\'attente ne crée une réservation que lorsque tout est réuni.' },

  { id: 'terrasse', numero: 3, titre: 'La terrasse doit rentrer', duree: '3 minutes',
    situation: 'Un samedi de juin, 17 h. Quatre réservations sont prévues en terrasse ce soir, et l\'orage arrive.',
    montre: 'L\'outil propose, vous décidez : aperçu, ajustement, application, et ce qui reste à décider.',
    quand: (R, reel) => ({ iso: prochainSamediDEte(R, reel), min: 17 * 60 }), depart: { vue: 'resas', onglet: 'salle' },
    etat(R, iso) { const l = exempleEte({ R }, iso); return { etat: { resa: { ajouts: l.map(({ table, ...r }) => r), tables: Object.fromEntries(l.filter((r) => r.table).map((r) => [r.id, r.table])) } } }; },
    etapes: [
      { id: 'apercu', texte: 'Dans Salle, ouvrez « Préparer un repli en intérieur » : rien n\'est encore changé.', fait: (c) => vu(c, 'repli-ouvert') },
      { id: 'ajuster', texte: 'Changez une table proposée dans une liste (par exemple pour Inès et Paul).', fait: (c) => vu(c, 'repli-ajuste') },
      { id: 'appliquer', texte: '« Appliquer le repli », puis lisez le bilan réservation par réservation.', fait: (c) => [1, 3, 4].every((n) => { const t = tableDe(c, `ete-${c.iso}-${n}`); return t && !dehors(t); }) },
      { id: 'reste', texte: 'Retrouvez le résultat sur le plan : la tablée Marchand (8) reste à décider.', fait: (c) => [1, 3, 4].every((n) => { const t = tableDe(c, `ete-${c.iso}-${n}`); return t && !dehors(t); }) && vu(c, 'repli-bilan') },
    ],
    /* La conclusion compte ce qui est réellement en place : un ajustement peut avoir évité les tables rapprochées. */
    conclusion: (c) => { const rapprochees = [1, 3, 4].filter((n) => String(tableDe(c, `ete-${c.iso}-${n}`)).includes('+')).length;
      return `Trois réservations sont rentrées${rapprochees ? `, dont ${rapprochees === 1 ? 'une' : rapprochees === 2 ? 'deux' : 'trois'} sur deux tables rapprochées` : ''}. La tablée Marchand reste sans solution : l'outil le dit, la décision vous revient.`; } },

  { id: 'client', numero: 4, titre: 'Le client change ses plans', duree: '3 minutes',
    situation: 'Vendredi, 15 h. Camille R. a une table pour deux à 20 h 30 ce soir. Elle voudrait venir à quatre, à 21 h.',
    montre: 'Le client demande depuis sa page ; la réservation d\'origine est gardée ; l\'équipe décide.',
    quand: (R, reel) => ({ iso: prochainVendredi(R, reel), min: 15 * 60 }), depart: { vue: 'resas', onglet: 'service' },
    etat(R, iso) {
      const l = [resa('sc4-couple', iso, '19:30', 2, COUPLE, 'confirmee', 'Anniversaire de mariage'), resa('sc4-rose', iso, '19:30', 4, ROSE), resa('sc4-weber', iso, '20:00', 8, WEBER, 'confirmee', 'Une occasion à fêter'), resa('sc4-camille', iso, '20:30', 2, CAMILLE, 'confirmee', 'Allergie aux fruits à coque')];
      return { etat: { resa: { ajouts: l, tables: { 'sc4-couple': '1', 'sc4-rose': '4', 'sc4-weber': '7', 'sc4-camille': '3' } } } };
    },
    etapes: [
      { id: 'page', texte: 'Dans Service, ligne de Camille R. : « Autres actions », puis « Page du client » (nouvel onglet).', fait: (c) => vu(c, 'venue-ouverte') || !!c.venues['sc4-camille'] },
      { id: 'demande', texte: 'Sur sa page : « Changer l\'heure ou le nombre de personnes », 21 h pour 4.', fait: (c) => !!c.venues['sc4-camille']?.modif || !!c.venues['sc4-camille']?.reponse },
      { id: 'garde', texte: 'Revenez à l\'espace : la demande est là, et la réservation reste à 20 h 30 pour 2.', fait: (c) => vu(c, 'venue-demande-vue') || !!c.venues['sc4-camille']?.reponse },
      { id: 'decider', texte: '« Accepter le changement », puis regardez la page du client.', fait: (c) => !!c.venues['sc4-camille']?.reponse },
    ],
    variante: 'Pour montrer un refus : recommencez le scénario et choisissez « Refuser ». La page du client dit que la réservation initiale est maintenue.',
    conclusion: (c) => (c.venues['sc4-camille']?.reponse?.acceptee ? `Le changement est accepté : 21 h pour 4, dans l'espace comme sur la page du client. ${tableDe(c, 'sc4-camille') ? `La réservation est maintenant placée (${String(tableDe(c, 'sc4-camille')).includes('+') ? 'tables' : 'table'} ${tableDe(c, 'sc4-camille')}).` : 'La table 3, trop petite, a été retirée : la réservation est à replacer.'}` : 'Le changement est refusé : la réservation reste à 20 h 30 pour 2, et la page du client le lui dit.') },

  /* v7.12.0 · Une réception aux Jardins : de la demande à la fiche du jour J. La demande de Thomas B. (fictive) attend
     dans Demandes ; un mariage (fictif) est déjà confirmé le samedi d'avant, dans la même salle : c'est le conflit de
     la première variante. Les jours se comptent en semaines : l'horloge sait sauter à l'échéance, à la veille, au jour J. */
  { id: 'reception', numero: 5, titre: 'Une réception aux Jardins', duree: '6 minutes', sansDemandesDemo: true, dossier: idDossier('sc5-demande'),
    situation: 'Un mercredi, 10 h. Thomas B. demande la salle du restaurant pour les 40 ans de Julie : 40 invités, un samedi soir. Un mariage est déjà confirmé le samedi d\'avant.',
    montre: 'Une demande devient un dossier : proposition, option, accord du client, confirmation, préparation du jour J. L\'agenda et la réservation suivent.',
    quand: (R, reel) => ({ iso: prochainMercredi(reel), min: 10 * 60 }), depart: { vue: 'demandes', filtre: 'reception' },
    etat(R, iso, { lieux, salle } = {}) {
      const [s1, s2] = samedisDeReception(R, iso), le = (j, h) => `${ajouter(iso, j)}T${h}`;
      const demandes = [
        { id: 'sc5-demande', genre: 'reception', cree: `${le(-1, '18:40')}:00`, occasion: 'Un anniversaire', date: s2, invites: '40', espace: 'La salle du restaurant', message: 'Les 40 ans de Julie. Un dîner assis, puis une soirée dansante. Fin vers 1 h du matin.', prenom: 'Thomas', nom: 'B.', telephone: telephoneDemo('Thomas B.'), email: 'thomas@exemple.fr', source: 'demo' },
        { id: 'sc5-mariage', genre: 'reception', cree: `${le(-40, '11:00')}:00`, occasion: 'Un mariage', date: s1, invites: '80', espace: 'La salle du restaurant', message: 'Dîner et soirée.', prenom: 'Camille', nom: 'R.', telephone: telephoneDemo('Camille R.'), email: 'camille@exemple.fr', source: 'demo', statut: 'signe' }];
      /* Le mariage déjà confirmé : son dossier est construit par les mêmes gestes que ceux de l'écran (proposition présentée, accord noté, espaces réservés). */
      const S = { receptions: { dossiers: {} } }, m = dossierDepuisDemande(normaliser(demandes[1]), { cree: le(-38, '09:30'), lieux });
      MUTATIONS_RECEPTIONS.recCreer(S, { dossier: m });
      MUTATIONS_RECEPTIONS.recModifier(S, { id: m.id, champs: { projet: { invitesConfirmes: 80, intitule: 'Mariage · Camille et Hugo' }, qualifie: true } });
      MUTATIONS_RECEPTIONS.recProposition(S, { id: m.id, proposition: { titre: 'Mariage de Camille et Hugo', presentation: 'Dîner assis dans la salle du restaurant, puis soirée.', lignes: [{ id: 'l1', libelle: 'Menu de groupe, trois plats', description: 'Entrée, plat, dessert.', qte: 80, pu: 45, unite: 'par personne', exemple: true }], compris: 'Le service\nLa mise en place de la salle', aPreciser: 'Le gâteau' }, le: le(-30, '15:00') });
      MUTATIONS_RECEPTIONS.recPresenter(S, { id: m.id, le: le(-30, '15:10') }); MUTATIONS_RECEPTIONS.recAccordEquipe(S, { id: m.id, le: le(-24, '11:00') });
      MUTATIONS_RECEPTIONS.recRetenir(S, argsRetenue({ lieux }, salle, S.receptions.dossiers[m.id], { type: 'ferme', jour: s1, horaires: { arrivee: '18:00', repas: '20:00', fin: '02:00' }, espaces: ['restaurant'], le: le(-24, '11:05') }));
      return { etat: S, demandes };
    },
    etapes: [
      { id: 'dossier', texte: 'Dans Demandes, repérez la demande de Thomas B. et créez son dossier.', fait: (c) => !!dossierSc5(c) },
      { id: 'proposition', texte: 'Onglet Proposition : préparez une proposition (une ou deux prestations) et présentez-la au client.', fait: (c) => (dossierSc5(c)?.propositions || []).some((p) => !!p.presenteeLe) },
      { id: 'option', texte: 'Onglet Espaces et option : la salle du restaurant, arrivée à 19 h, fin à 1 h. Vérifiez, puis posez l\'option.', fait: (c) => ['option', 'ferme'].includes(dossierSc5(c)?.retenue?.etat) || (dossierSc5(c)?.historique || []).some((h) => /^Option posée/.test(h.quoi)) },
      { id: 'accord', texte: 'Onglet Client : ouvrez « Votre réception » (nouvel onglet) et donnez votre accord sur la proposition.', fait: (c) => { const d = dossierSc5(c); return !!d && (!!accepteeDe(d, c.venues[d.id] || {}) || d.retenue?.etat === 'ferme'); } },
      { id: 'confirmer', texte: 'Revenez à l\'espace : dans Espaces et option, confirmez la réception.', fait: (c) => dossierSc5(c)?.retenue?.etat === 'ferme' },
      { id: 'preparer', texte: 'Onglet Jour J : ajoutez les tâches habituelles et complétez une information pour l\'équipe.', fait: (c) => { const d = dossierSc5(c); return !!d && (c.S.taches?.liste || []).some((t) => t.lien?.type === 'reception' && t.lien.id === d.id) && !!(d.jourJ?.configuration || d.jourJ?.cuisine || d.jourJ?.accueil || d.projet?.invitesConfirmes); } },
      { id: 'fiche', texte: 'Ouvrez « Voir et imprimer la fiche » : le résumé du jour J, relu depuis le dossier.', fait: (c) => vu(c, 'rec-fiche') && dossierSc5(c)?.retenue?.etat === 'ferme' },
    ],
    variantes: [
      { titre: 'Un conflit', texte: 'Avant de poser l\'option, choisissez le samedi d\'avant : la salle est déjà réservée pour un mariage. Le conflit s\'affiche avant toute validation ; essayez la salle de réception ce jour-là, ou revenez au samedi demandé.' },
      { titre: 'Une option qui expire', texte: 'Une fois l\'option posée : « Aller à l\'échéance de l\'option ». Les espaces se libèrent, le dossier reste suivi, et reposer l\'option demande une nouvelle vérification.' },
      /* v7.12.1 : la variante va jusqu'au bout : changement accepté, version 2, nouvel accord, jour J à jour, version 1 intacte. */
      { titre: 'Un client qui change ses plans', texte: 'Une fois la réception confirmée : sur « Votre réception », demandez 60 invités. Onglet Client, l\'équipe accepte : les espaces restent réservés, et le dossier dit « Révision à préparer ». Onglet Proposition : « Préparer une nouvelle version », passez à 60 menus, « Présenter au client ». Sur sa page, le client voit la version 2 à côté de la version 1 acceptée, et donne son accord. La fiche du jour J passe alors à la version 2 ; la version 1 reste consultable, telle qu\'elle a été présentée. Pour montrer un refus : demandez d\'abord 120 invités, trop pour la salle.' },
    ],
    conclusion: (c) => { const d = dossierSc5(c), r = d.retenue, n = (c.S.taches?.liste || []).filter((t) => t.lien?.type === 'reception' && t.lien.id === d.id);
      return `La demande de Thomas B. est devenue une réception confirmée : ${nomsEspaces(c.lieux, r.espaces).join(', ')}, du ${instantDit(r.debut)} au ${instantDit(r.fin)}. L'agenda la montre${r.salle ? ', la page Réserver n\'ouvre plus ce soir-là' : ''}, et la fiche du jour J rassemble ce que l'équipe doit savoir (${n.length > 1 ? `${n.length} tâches` : n.length ? '1 tâche' : 'aucune tâche'}, dont ${n.filter((t) => t.fait).length} ${n.filter((t) => t.fait).length > 1 ? 'faites' : 'faite'}). ${commerceDe(d, c.venues[d.id] || {}).lignes.map((l) => l.texte).join(' ; ')}. Rien n'a été envoyé, signé ni encaissé.`; } },
  /* v7.13.0 : une offre se prépare une fois, se publie quand on le décide, et ce qui a été accepté garde son prix. */
  { id: 'offre', numero: 6, titre: 'Une offre prend vie', duree: '5 minutes', sansDemandesDemo: true,
    situation: 'Un mercredi, 10 h. Votre menu de groupe (un exemple, à 45 € par personne) est publié sur le site. La réception d\'Élise M., 40 personnes, a été acceptée à ce prix : 1 800 €. Vous décidez de passer le menu à 49 €.',
    montre: 'Le prix se prépare sans toucher au site, se vérifie dans un aperçu, se publie seul. La nouvelle proposition reprend 49 € ; celle qui a été acceptée reste à 1 800 €.',
    quand: (R, reel) => ({ iso: prochainMercredi(reel), min: 10 * 60 }), depart: { vue: 'carte', ongletCarte: 'catalogue' },
    etat(R, iso, { lieux } = {}) {
      const [s1, s2] = samedisDeReception(R, iso), le = (j, h) => `${ajouter(iso, j)}T${h}`;
      const demandes = [
        { id: 'sc6-ancienne', genre: 'reception', cree: `${le(-20, '09:15')}:00`, occasion: 'Un repas d\'entreprise', date: s1, invites: '40', espace: 'La salle du restaurant', message: 'Le repas de fin d\'année de l\'équipe.', prenom: 'Élise', nom: 'M.', telephone: telephoneDemo('Élise M.'), email: 'elise@exemple.fr', source: 'demo', statut: 'signe' },
        { id: 'sc6-nouvelle', genre: 'reception', cree: `${le(-1, '17:20')}:00`, occasion: 'Un anniversaire', date: s2, invites: '40', espace: 'La salle du restaurant', message: 'Les 60 ans de mon père, un déjeuner en famille.', prenom: 'Bruno', nom: 'K.', telephone: telephoneDemo('Bruno K.'), email: 'bruno@exemple.fr', source: 'demo' }];
      /* L'offre d'exemple est publiée, et montrée sur le site : c'est l'état d'avant toute modification (ce qui est là est en ligne). */
      const S = { receptions: { dossiers: {} }, offres: { modifs: { 'menu-groupe': { usages: { propositions: true, site: true } } } },
        /* Une soirée d'exemple, pour la variante « une réservation garde le lien avec sa soirée ». */
        evenements: { ajouts: [{ id: 'sc6-soiree', titre: 'Soirée truffe (exemple)', debut: prochainVendredi(R, ajouter(iso, 1)), type: 'Soirée', prix: '55 € hors boissons (exemple)', service: 'soir', image: 'vraie/salle-soir', cadrage: '50% 50%' }] } };
      S.evenements.liste = S.evenements.ajouts.map(({ id, titre, debut, type, prix, service }) => ({ id, titre, debut, type, prix, service, masque: false }));
      const menu = offreCatalogue(lieux, S, 'menu-groupe', 'publie');
      /* La réception d'Élise M. : proposition présentée puis acceptée à 45 € par personne, par les mêmes gestes que ceux de l'écran. */
      const a = dossierDepuisDemande(normaliser(demandes[0]), { cree: le(-19, '10:00'), lieux });
      MUTATIONS_RECEPTIONS.recCreer(S, { dossier: a });
      MUTATIONS_RECEPTIONS.recModifier(S, { id: a.id, champs: { projet: { invitesConfirmes: 40, intitule: 'Repas d\'entreprise · Élise M.' }, qualifie: true } });
      MUTATIONS_RECEPTIONS.recProposition(S, { id: a.id, proposition: { titre: 'Repas de fin d\'année', presentation: 'Un dîner assis dans la salle du restaurant.', lignes: [ligneDepuisOffre(menu, { id: 'l1', qte: 40, n: 0, le: le(-18, '14:00') })], compris: 'Le service\nLa mise en place de la salle', aPreciser: 'Les boissons' }, le: le(-18, '14:00') });
      MUTATIONS_RECEPTIONS.recPresenter(S, { id: a.id, le: le(-18, '14:10') }); MUTATIONS_RECEPTIONS.recAccordEquipe(S, { id: a.id, le: le(-15, '11:00') });
      /* La demande de Bruno K. a déjà son dossier, sans proposition : c'est elle qui recevra le nouveau prix. */
      const b = dossierDepuisDemande(normaliser(demandes[1]), { cree: le(0, '09:30'), lieux });
      MUTATIONS_RECEPTIONS.recCreer(S, { dossier: b });
      MUTATIONS_RECEPTIONS.recModifier(S, { id: b.id, champs: { projet: { invitesConfirmes: 40, intitule: 'Anniversaire · Bruno K.' }, qualifie: true } });
      return { etat: S, demandes };
    },
    etapes: [
      { id: 'retrouver', texte: 'Dans Offres, onglet « Tout le catalogue » : retrouvez « Menu de groupe, trois plats », publié à 45 € par personne.', fait: (c) => vu(c, 'offre-catalogue') || prixSc6(c) === 49 },
      { id: 'preparer', texte: '« Modifier » : passez le prix à 49, puis « Enregistrer en préparation ».', fait: (c) => prixSc6(c) === 49 || prixSc6(c, 'publie') === 49 },
      { id: 'apercu', texte: '« Voir l\'aperçu » (nouvel onglet) : la page Réceptions montre 49 €, sous le repère « Aperçu — non publié ». Puis « Voir la version publiée » : le site affiche toujours 45 €.', fait: (c) => (vu(c, 'offre-apercu') && vu(c, 'offre-site')) || prixSc6(c, 'publie') === 49 },
      { id: 'publier', texte: 'Revenez à l\'espace : « Publier cette offre », lisez le résumé, puis « Publier maintenant ». Elle seule est publiée.', fait: (c) => prixSc6(c, 'publie') === 49 && (c.S.publie?.historique || []).some((h) => h.perimetre === 'offre' && h.id === 'menu-groupe') },
      { id: 'nouvelle', texte: 'Dans Demandes, ouvrez le dossier de Bruno K., onglet Proposition : « Préparer une proposition », ajoutez « Menu de groupe, trois plats ». 40 personnes à 49 € : 1 960 €.', fait: (c) => nouvelleSc6(c) === 1960 },
      { id: 'ancienne', texte: 'Ouvrez le dossier d\'Élise M., onglet Proposition : la version acceptée est restée à 1 800 €.', fait: (c) => vu(c, 'offre-ancienne') && nouvelleSc6(c) === 1960 && ancienneSc6(c) === 1800 },
    ],
    variantes: [
      { titre: 'Un plat épuisé pour un seul service', texte: 'Dans Offres, onglet « La carte » : « Épuisé ce midi » sur un plat. La carte du site l\'indique aussitôt, sans publication. « Aller au service du soir » : le plat est de nouveau proposé, la réservation de tables n\'a pas bougé.' },
      { titre: 'Une réservation qui garde le lien avec sa soirée', texte: 'Sur le site, page Les fêtes : « Réserver » sur la Soirée truffe (exemple), puis envoyez la demande. Dans l\'agenda de l\'espace, la réservation porte le nom de la soirée ; dans Offres, onglet « Les soirées », la soirée compte une réservation liée, et changer sa date est refusé avec l\'explication.' },
      { titre: 'Une ancienne présentation restaurée', texte: 'Une fois le menu publié à 49 € : Site, onglet « Publication », « Voir ce que rétablirait le contenu d\'avant », puis « Reprendre en brouillon ». Le site reste à 49 € tant que vous ne publiez pas ; les propositions, les réservations et les accords ne changent pas.' },
    ],
    conclusion: (c) => `Le menu de groupe est passé de 45 € à 49 € par personne, et lui seul : le site l'affiche depuis la publication n° ${(c.S.publie?.historique || []).filter((h) => h.id === 'menu-groupe').pop()?.n || 1}. La nouvelle proposition pour Bruno K. reprend ce prix : ${euros(nouvelleSc6(c))} pour 40 personnes. La proposition acceptée par Élise M. est restée à ${euros(ancienneSc6(c))}. Ces montants sont des exemples ; rien n'a été envoyé, signé ni encaissé.` },
];
/* Scénario 6 : le prix du menu de groupe (en préparation ou publié), le total de la nouvelle proposition, celui de l'ancienne. */
const prixSc6 = (c, version = 'travail') => offreCatalogue(c.lieux, c.S, 'menu-groupe', version)?.prix;
const nouvelleSc6 = (c) => { const p = (c.S.receptions?.dossiers?.[idDossier('sc6-nouvelle')]?.propositions || []).find((x) => (x.lignes || []).some((l) => l.origine === 'menu-groupe' && l.pu === 49)); return p ? totalProposition(p) : 0; };
const ancienneSc6 = (c) => { const p = (c.S.receptions?.dossiers?.[idDossier('sc6-ancienne')]?.propositions || []).find((x) => x.v === 1); return p ? p.total ?? totalProposition(p) : 0; };
const dossierSc5 = (c) => c.S.receptions?.dossiers?.[idDossier('sc5-demande')] || null;
/** Le prochain mercredi (aujourd'hui compris) : le jour où commence le scénario 5. */
export function prochainMercredi(reel) { for (let k = 0; k < 7; k++) { const d = ajouter(reel, k); if (jourSemaine(d) === 3) return d; } return reel; }
/** Les deux samedis du scénario 5 : celui du mariage déjà confirmé (au moins 17 jours après le début), puis le suivant, que Thomas B. demande. */
export function samedisDeReception(R, iso) { let d = ajouter(iso, 17); while (jourSemaine(d) !== 6) d = ajouter(d, 1); return [d, ajouter(d, 7)]; }
export const scenario = (id) => SCENARIOS.find((s) => s.id === id) || null;

/**
 * Les sauts dans le temps d'un scénario qui dure des semaines (v7.12.0) : à l'échéance de l'option, à la veille, au jour J.
 * Un saut n'est proposé que vers l'avenir. Avancer l'horloge ne fait qu'avancer l'heure : ses conséquences (une option
 * qui expire) se déduisent de l'état ; rien n'est accepté, confirmé ni coché à la place de l'utilisateur.
 * @returns {{ cle, libelle, cible: { iso, min } | null, raison: string }[]}
 */
export function sauts(id, { S = {}, iso = '', min = 0 } = {}) {
  /* v7.13.0 : le scénario 6 n'a qu'un saut, dans la journée : le service du soir (« épuisé ce midi » ne s'y étend pas). */
  if (id === 'offre') return [{ cle: 'soir', libelle: 'Aller au service du soir', cible: min < 18 * 60 ? { iso, min: 19 * 60 } : null, raison: 'Vous êtes déjà au service du soir.' }];
  const s = scenario(id); if (!s?.dossier) return [];
  const d = S.receptions?.dossiers?.[s.dossier], ici = `${iso}T${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
  const vers = (t) => (t && t > ici ? { iso: t.slice(0, 10), min: +t.slice(11, 13) * 60 + +t.slice(14, 16) } : null);
  const option = d?.retenue?.etat === 'option' && retenueActive(d.retenue, ici);
  return [
    { cle: 'echeance', libelle: 'Aller à l\'échéance de l\'option', cible: option ? vers(d.retenue.echeance) : null, raison: option ? '' : d?.retenue?.etat === 'ferme' ? 'La réception est confirmée : plus d\'option.' : d?.retenue?.etat === 'option' ? 'L\'option a déjà expiré.' : 'Aucune option n\'est posée.' },
    { cle: 'veille', libelle: 'Aller à la veille', cible: d?.jour ? vers(`${ajouter(d.jour, -1)}T10:00`) : null, raison: d?.jour ? 'La veille est déjà passée.' : 'La date de la réception n\'est pas encore retenue.' },
    { cle: 'jourj', libelle: 'Aller au jour J', cible: d?.jour ? vers(`${d.jour}T${d.horaires?.preparation || '10:00'}`) : null, raison: d?.jour ? 'Le jour J est déjà là.' : 'La date de la réception n\'est pas encore retenue.' },
  ].map((x) => ({ ...x, raison: x.cible ? '' : x.raison }));
}

/** L'état de départ d'un scénario : { etat, venues, horloge }. `reel` : la vraie date du jour (le scénario se cale dessus). */
export function depart(id, R, reel, config = {}) { const s = scenario(id); if (!s) return null; const h = s.quand(R, reel), d = s.etat(R, h.iso, config); return { etat: d.etat, venues: d.venues || {}, demandes: d.demandes || [], horloge: h }; }

/**
 * Où en est le scénario, d'après l'état réel (et ce qui a été regardé, `vus`) : les étapes faites, la prochaine à essayer, la conclusion (seulement quand
 * toutes les étapes sont faites).
 * @returns {{ etapes: { id, texte, fait }[], faites: number, prochaine: object|null, fini: boolean, conclusion: string }}
 */
export function avancement(id, { S = {}, venues = {}, vus = {}, iso = '', lieux = null } = {}) {
  const s = scenario(id); if (!s) return null;
  const c = { S, venues, vus, iso, lieux }, etapes = s.etapes.map((e) => ({ id: e.id, texte: e.texte, fait: !!e.fait(c) }));
  const fini = etapes.every((e) => e.fait);
  return { etapes, faites: etapes.filter((e) => e.fait).length, prochaine: etapes.find((e) => !e.fait) || null, fini, conclusion: fini ? s.conclusion(c) : '' };
}

