/* L'assistant de la barre « Que voulez-vous faire ? » (v7.15.0) : retrouver, expliquer, préparer une action.
   Local, déterministe et explicable : des intentions reconnues par des motifs, des réponses calculées par les mêmes
   fonctions que les écrans (accueil, réceptions, commerce, bilans, tâches). Aucun service extérieur, aucune donnée gardée.
   Fonctions pures : rien n'est fait ici. Une réponse est une liste de propositions pour la barre :
     - une ligne d'en-tête (`entete`) : ce qui a été compris, la période et le contexte, ce qui a été trouvé ;
     - le bouton principal (`aller` : ouvrir le bon écran ; ou `action` : une action nommée, soumise aux mêmes règles
       que l'interface, dont le titre dit en toutes lettres ce qui va changer) ;
     - les dossiers qui justifient la réponse, chacun ouvrant son dossier, son onglet, sa date.
   Quand une précision manque (un jour, un service, une personne parmi plusieurs), l'assistant la demande : des choix
   sont proposés (`aChoisir`), aucun n'est validé d'office. Une intention non prise en charge est dite, avec ce qui est
   réellement disponible (`nonCompris`). Les intentions prises en charge sont listées dans `INTENTIONS` (et dans
   `_exploitation/assistant.md`). */
import { ajouter, fmt, maj, heure, pluriel, simplifier, servicesDe, ouvert, instantCtx } from './espace-regles.js?v=7';
import { lireDateDetail, lireService } from './espace-commandes.js?v=7';
import { prochainService, nomService, resumeService, cleService } from './espace-accueil.js?v=7';
import { aTraiter } from './espace-demandes.js?v=7';
import { dossiersDe, resume, etatRetenue } from './espace-receptions.js?v=7';
import { commandes, nomClient, momentTexte, ETATS, SUITES, refusCommerce, manqueDe, quantite, ouvertureRetraits, euros } from './commerce.js?v=7';
import { nouvelleTache } from './espace-taches.js?v=7';
import { periodes, periodeDite, bilan, indicateur } from './espace-bilans.js?v=7';
import { lundiDe } from './espace-conseils.js?v=7';

/** Les intentions réellement prises en charge (affichées dans l'aide et dans la documentation). */
export const INTENTIONS = [
  { id: 'briefing', nom: 'Préparer le briefing d\'un service', exemple: 'prépare le briefing de ce soir' },
  { id: 'retraits', nom: 'Montrer les commandes à retirer un jour donné', exemple: 'montre les commandes à retirer demain' },
  { id: 'demandes', nom: 'Lister les demandes qui attendent une décision', exemple: 'quelles demandes attendent une décision ?' },
  { id: 'options', nom: 'Lister les options de réception qui arrivent à échéance', exemple: 'quelles options arrivent à échéance cette semaine ?' },
  { id: 'dossier', nom: 'Retrouver le dossier d\'une personne', exemple: 'retrouve le dossier de Camille' },
  { id: 'bilan', nom: 'Afficher un bilan (le jour, la semaine, la semaine précédente)', exemple: 'affiche le bilan de la semaine' },
  { id: 'tache', nom: 'Créer une tâche simple', exemple: 'tâche : rappeler le fleuriste demain' },
  { id: 'blocage', nom: 'Expliquer ce qui bloque une commande', exemple: 'pourquoi la commande de Nadia est bloquée ?' },
];
/** Les exemples proposés à l'ouverture de la barre, selon la vue métier choisie (mêmes intentions, autre mise en avant). */
export function exemplesPour(vue = 'direction') {
  const E = Object.fromEntries(INTENTIONS.map((i) => [i.id, i.exemple]));
  return ({ direction: [E.demandes, E.options, E.bilan, E.dossier, E.briefing, 'fermer samedi soir', E.tache],
    accueil: [E.demandes, E.retraits, E.dossier, 'table pour 4 vendredi 20 h au nom de Martin', E.briefing, E.tache],
    salle: [E.briefing, 'plan de salle', 'complet demain midi', E.dossier, E.tache],
    cuisine: [E.briefing, E.retraits, E.blocage, 'épuisé : foie gras', E.tache] })[vue] || [E.briefing, E.demandes, E.bilan];
}

const jourLong = (iso) => fmt(iso, { weekday: 'long', day: 'numeric', month: 'long' });
const jourDit = (iso, auj) => (iso === auj ? `aujourd'hui, ${jourLong(iso)}` : iso === ajouter(auj, 1) ? `demain, ${jourLong(iso)}` : jourLong(iso));
const entete = (compris, detail, plus = {}) => ({ genre: 'reponse', entete: true, inactif: true, titre: compris, detail, ...plus });
const question = (titre, detail) => ({ genre: 'erreur', entete: true, inactif: true, aChoisir: true, titre, detail });
const choix = (titre, detail, completer) => ({ genre: 'aller', titre, detail, completer });
const erreur = (titre, detail, plus = {}) => ({ genre: 'erreur', titre, detail, inactif: true, ...plus });
const reglesDe = (ctx) => ({ R: ctx.R, exceptions: ctx.exceptions || [] });

/** Une période nommée dans la phrase : « cette semaine », « la semaine prochaine », « aujourd'hui », « demain », une date. */
export function lirePeriodeNommee(n, auj) {
  const lundi = lundiDe(auj);
  if (/\bsemaine (derniere|precedente|passee)\b/.test(n)) return { debut: ajouter(lundi, -7), fin: ajouter(lundi, -1), nom: 'la semaine précédente' };
  if (/\bsemaine (prochaine|suivante)\b/.test(n)) return { debut: ajouter(lundi, 7), fin: ajouter(lundi, 13), nom: 'la semaine prochaine' };
  if (/\b(cette|la|de la) semaine\b|\bsemaine\b/.test(n)) return { debut: lundi, fin: ajouter(lundi, 6), nom: 'cette semaine' };
  const d = lireDateDetail(n, auj); if (d.date) return { debut: d.date, fin: d.date, nom: jourDit(d.date, auj) };
  return null;
}

/**
 * @param {string} texte ce que le restaurateur a écrit
 * @param {{ ctx: object, S: object, salle: object, minute: number, demandes?: object[], clients?: object[], resas?: object[] }} o
 *        ctx : le contexte de l'espace ; demandes : la liste mise en forme de la rubrique Demandes ; clients : les fiches ;
 *        resas : les réservations à venir (pour retrouver une personne)
 * @returns {object[]} les propositions, ou [] si aucune intention de l'assistant n'est reconnue (la barre continue alors
 *          avec les ordres et la recherche habituels)
 */
export function assister(texte, { ctx, S = {}, salle = null, minute = 0, demandes = [], clients = [], resas = [] }) {
  const brut = String(texte || '').trim(), n = simplifier(brut); if (n.length < 3) return [];
  const auj = ctx.auj, dd = lireDateDetail(n, auj), sv = lireService(n);
  const dateFausse = () => (dd.erreur ? [erreur(`« ${dd.erreur} » : cette date n'existe pas`, 'Rien n\'est fait. Écrivez une date du calendrier, par exemple « demain » ou « le 5 décembre ».')] : null);

  /* ----- Créer une tâche simple (le système de tâches existant ; la proposition dit ce qui sera créé) ----- */
  const tm = brut.match(/^(?:(?:ajoute[rz]?|cr[ée]e[rz]?|note[rz]?|nouvelle)\s+(?:une\s+|la\s+)?t[âa]che|t[âa]che|todo|[àa] faire|rappelle[- ]moi(?:\s+de\s+|\s+d['’]\s*)?|pense[rz]?\s+[àa]|ne pas oublier(?:\s+de\s+|\s+d['’]\s*)?)\s*:?\s*(.*)$/i);
  if (tm) {
    if (dd.erreur) return dateFausse();
    const titre = String(tm[1] || '').replace(/\s+(?:pour\s+)?(?:(?:le|du|ce|d['’])\s*)?(?:aujourd['’]?hui|apr[èe]s[- ]demain|demain|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|\d{1,2}(?:er)?\s+(?:janvier|f[ée]vrier|mars|avril|mai|juin|juillet|ao[ûu]t|septembre|octobre|novembre|d[ée]cembre)(?:\s+\d{4})?|\d{1,2}\/\d{1,2}(?:\/\d{2,4})?|le\s+\d{1,2}(?:er)?)(?:\s+prochain)?\s*[.!]?$/i, '').replace(/[.!\s]+$/, '').trim();
    if (titre.length < 3) return [question('Quelle tâche faut-il noter ?', 'Écrivez-la après « tâche : », par exemple « tâche : rappeler le fleuriste demain ». Rien n\'est créé.')];
    const propre = maj(titre).slice(0, 140), tache = nouvelleTache({ id: 'a-definir', titre: propre, echeance: dd.date || '', cree: instantCtx(ctx) });
    return [entete('Compris : créer une tâche', `${dd.date ? `Échéance : ${jourDit(dd.date, auj)}.` : 'Sans échéance (aucun jour n\'est dit).'} Rien n'est créé tant que vous ne validez pas.`),
      { genre: 'tache', titre: `Créer la tâche « ${propre} »${dd.date ? `, pour ${jourDit(dd.date, auj)}` : ''}`, detail: `Elle s'ajoute aux tâches de l'équipe${ctx.connecte ? ' (sur cet appareil)' : ''}, dans Aujourd'hui. Vous pourrez la modifier, la terminer ou l'annuler.`,
        action: { nom: 'tacheAjouter', args: { tache }, msg: `Tâche ajoutée : « ${propre} ».` }, aller: { vue: 'jour', ancre: 't-taches' } }];
  }

  /* ----- Expliquer ce qui bloque une commande (les raisons sont celles des règles, mot pour mot) ----- */
  if (/^pourquoi\b|\b(bloque[es]?|refuse[es]?|coince[es]?)\b/.test(n) && /\b(commandes?|retraits?|traiteur|preparation|prete|remettre|valider)\b|\b[a-z]{1,4}\d?-[a-z0-9]+\b/.test(n)) {
    const cmd = commandes(demandes, S, ctx.lieux).filter((c) => !['retiree', 'annulee', 'refusee'].includes(c.etat));
    const mots = n.split(/[^a-z0-9-]+/).filter((w) => w.length >= 3 && !/^(pourquoi|commandes?|bloque[es]?|refuse[es]?|est|elle|peut|pas|pour|que|qui|les|des|une|la|le|de|ne|puis|valider|remettre|prete|marquer|retraits?)$/.test(w));
    const vues = cmd.filter((c) => mots.some((w) => simplifier(c.ref).includes(w) || simplifier(nomClient(c.client)).split(/[ .]/).some((p) => p.startsWith(w))));
    const l = vues.length ? vues : cmd;
    if (!cmd.length) return [entete('Compris : expliquer ce qui bloque une commande', 'Aucune commande en cours : rien n\'est bloqué.'), { genre: 'aller', titre: 'Ouvrir les commandes à emporter', detail: 'La rubrique Demandes, filtre Traiteur.', aller: { vue: 'demandes', filtre: 'traiteur' } }];
    if (l.length > 1 && !vues.length) return [question('De quelle commande parlez-vous ?', 'Choisissez la commande : l\'explication vient des règles de l\'espace. Rien n\'est fait.'), ...l.slice(0, 6).map((c) => choix(`${c.ref} · ${nomClient(c.client)}`, `${ETATS[c.etat]} · retrait ${jourLong(c.jour)}, ${momentTexte(c.moment)}`, `pourquoi la commande ${c.ref} est bloquée ?`))];
    return l.slice(0, 3).flatMap((c) => { const suite = SUITES[c.etat], regles = { auj, lieux: ctx.lieux, ouverture: ouvertureRetraits(ctx, S) }, manque = manqueDe(c);
      const refus = c.etat === 'recue' ? refusCommerce(S, 'cmdValider', { id: c.id, base: c, le: instantCtx(ctx) }, regles) : suite ? refusCommerce(S, 'cmdAvancer', { id: c.id, vers: suite.vers, le: instantCtx(ctx) }, regles) : '';
      return [entete(refus ? `La commande ${c.ref} est bloquée : « ${suite?.libelle || 'Valider la commande'} » est refusé` : `Rien ne bloque la commande ${c.ref}`,
        refus ? `${refus}${manque.length && !/reste à produire/i.test(refus) ? ` Reste à produire : ${manque.map((x) => `${x.nom}, ${quantite(x.quantite, x.unite)}`).join(' ; ')}.` : ''}` : `${ETATS[c.etat]} · retrait ${jourLong(c.jour)}, ${momentTexte(c.moment)}. Prochaine action possible : « ${suite?.libelle || 'aucune'} ».`),
        { genre: 'aller', titre: `Ouvrir la commande ${c.ref} · ${nomClient(c.client)}`, detail: refus ? 'Le dossier montre les disponibilités du jour et les actions possibles.' : 'Le dossier de la commande.', aller: { commande: c.id } }]; });
  }

  /* ----- Le briefing d'un service ----- */
  if (/\b(briefing|brief)\b|\bprepare[rz]?(?: moi)? le service\b|\bpreparer le service\b/.test(n)) {
    if (dd.erreur) return dateFausse();
    const ps = prochainService(ctx, S, minute), jour = dd.date || (sv ? auj : ps?.date || auj), tous = servicesDe(ctx.R).map((s) => s.id), ouverts = tous.filter((s) => ouvert(reglesDe(ctx), S, jour, s));
    const svs = sv ? [sv] : dd.date ? ouverts : ps ? [ps.service] : ouverts;
    const ligne = (s) => { const r = resumeService(ctx, S, salle, jour, s), nom = nomService(ctx, jour, s);
      return { genre: 'briefing', titre: `Ouvrir le briefing : ${nom.toLowerCase()}${jour === auj || jour === ajouter(auj, 1) ? `, ${jourLong(jour)}` : ''}`,
        detail: `${pluriel(r.confirmees + r.accueillies, 'réservation')} · ${pluriel(r.couvertsAttendus, 'couvert')} ${r.couvertsAttendus > 1 ? 'attendus' : 'attendu'}${r.grandes.length ? ` · ${pluriel(r.grandes.length, 'grande tablée').replace('grande tablées', 'grandes tablées')}` : ''}${r.demandes.length ? ` · ${pluriel(r.demandes.length, 'demande')} à traiter` : ''} · ${r.allergies.phrase}`, aller: { briefing: cleService(jour, s) } }; };
    if (!svs.length || (sv && !ouverts.includes(sv))) return [erreur(`Pas de service ${sv ? (sv === 'midi' ? 'le midi' : 'le soir') : ''} ${jourDit(jour, auj)}`.replace(/\s+/g, ' '), 'Ce service est fermé : il n\'y a pas de briefing à préparer. Rien n\'est fait.'),
      ...(ps ? [{ ...ligne.call(null, ps.service), titre: `Ouvrir le briefing du prochain service : ${nomService(ctx, ps.date, ps.service).toLowerCase()}`, aller: { briefing: cleService(ps.date, ps.service) } }] : [])];
    if (svs.length > 1) return [question(`Quel service, ${jourDit(jour, auj)} ?`, 'Le midi et le soir sont ouverts : choisissez. Rien n\'est fait.'), ...svs.map(ligne)];
    return [entete('Compris : préparer le briefing d\'un service', `${maj(nomService(ctx, jour, svs[0]).toLowerCase())}, ${jourLong(jour)}. Le briefing réunit les volumes, les grandes tablées, les informations signalées, les préparations et les tâches ; il s'imprime.`), ligne(svs[0])];
  }

  /* ----- Le bilan ----- */
  if (/\bbilans?\b/.test(n)) {
    if (dd.erreur) return dateFausse();
    const P = periodes(auj, dd.date || auj), cle = /\bsemaine (derniere|precedente|passee)\b/.test(n) ? 'precedente' : /\bsemaine\b|\bhebdo/.test(n) ? 'semaine' : dd.date || /\b(jour|journee)\b/.test(n) ? 'jour' : '';
    const ligne = (p) => { const b = bilan(ctx, S, p, { demandes, attente: aTraiter(ctx, S) }), v = (id) => indicateur(b, id)?.valeur, dit = (id, un, des) => (v(id) == null ? '' : `${v(id)} ${v(id) > 1 ? des : un}`);
      return { genre: 'bilan', titre: `Ouvrir le bilan ${p.cle === 'jour' ? 'du jour' : p.cle === 'semaine' ? 'de la semaine' : 'de la semaine précédente'} : ${periodeDite(p)}`,
        detail: [dit('resa-reserves', 'couvert réservé', 'couverts réservés'), dit('cmd-validees', 'commande validée', 'commandes validées'), dit('carte-emises', 'carte émise', 'cartes émises'), dit('suivi-demandes', 'demande à traiter', 'demandes à traiter')].filter(Boolean).join(' · ') || 'Chaque chiffre ouvre la liste des dossiers comptés.',
        aller: { bilan: { periode: p.cle, jour: p.debut } } }; };
    if (!cle) return [question('Quel bilan voulez-vous ?', 'Trois périodes sont proposées, chacune avec ses dates exactes. Rien n\'est fait.'), ...P.map(ligne)];
    return [entete('Compris : afficher un bilan', `Période : ${periodeDite(P.find((p) => p.cle === cle))}. Chaque chiffre a sa définition et ouvre les dossiers comptés.`), ligne(P.find((p) => p.cle === cle))];
  }

  /* ----- Les commandes à retirer un jour donné ----- */
  if ((/\b(commandes?|retraits?)\b/.test(n) && /\b(retir\w*|retraits?|remettre|a emporter|emporter|a preparer|preparer)\b/.test(n)) || /^(?:les |mes )?retraits?\b/.test(n)) {
    if (dd.erreur) return dateFausse();
    if (!dd.date) return [question('Les commandes à retirer quel jour ?', 'Précisez le jour. Rien n\'est fait.'), choix(`Aujourd'hui, ${jourLong(auj)}`, 'Les commandes dont le retrait est aujourd\'hui.', 'montre les commandes à retirer aujourd\'hui'), choix(`Demain, ${jourLong(ajouter(auj, 1))}`, 'Les commandes dont le retrait est demain.', 'montre les commandes à retirer demain')];
    const jour = dd.date, tout = commandes(demandes, S, ctx.lieux).filter((c) => c.jour === jour && (!sv || c.moment === sv)), l = tout.filter((c) => ['validee', 'preparation', 'prete'].includes(c.etat)), aDecider = tout.filter((c) => c.etat === 'recue');
    const ligne = (c) => ({ genre: 'commande', titre: `${c.ref} · ${nomClient(c.client)}`, detail: `${ETATS[c.etat]} · ${momentTexte(c.moment)} · ${c.lignes.map((x) => `${x.nom}, ${quantite(x.quantite, x.unite)}`).join(' ; ')}${typeof c.total === 'number' ? ` · ${euros(c.total)}` : ''}${manqueDe(c).length ? ' · il manque de la production' : ''}`, aller: { commande: c.id } });
    return [entete(`Compris : les commandes à retirer ${jourDit(jour, auj)}${sv ? `, ${momentTexte(sv)}` : ''}`,
      `${l.length ? `${pluriel(l.length, 'commande')} à retirer : ${['validee', 'preparation', 'prete'].map((e) => [l.filter((c) => c.etat === e).length, ETATS[e].toLowerCase()]).filter(([k]) => k).map(([k, e]) => `${k} ${e}`).join(', ')}.` : 'Aucune commande validée à retirer ce jour-là.'}${aDecider.length ? ` ${pluriel(aDecider.length, 'demande')} pour ce jour ${aDecider.length > 1 ? 'attendent' : 'attend'} encore une décision (non ${aDecider.length > 1 ? 'comptées' : 'comptée'}).` : ''}${ctx.connecte ? ' Les commandes sont suivies sur cet appareil.' : ''}`),
      { genre: 'aller', titre: `Ouvrir Préparation et retraits du ${jourLong(jour)}`, detail: 'Ce qu\'il faut produire, ce qui est prêt et ce qui reste à remettre.', aller: { commerce: { ecran: 'preparation', jour } } }, ...l.slice(0, 5).map(ligne), ...aDecider.slice(0, 2).map((c) => ({ ...ligne(c), detail: `Demande à décider · ${momentTexte(c.moment)}` }))];
  }

  /* ----- Les demandes qui attendent une décision ----- */
  if (/\bdemandes?\b.*\b(attend\w*|attente|decision|decider|repondre|reponse|traiter)\b|\bquelles? demandes\b|\b(a traiter|sans reponse)\b/.test(n)) {
    const att = aTraiter(ctx, S), total = att.tables.length + att.autres.length, vieilles = [...att.autres].sort((a, b) => String(a.cree).localeCompare(String(b.cree)));
    const NOMS = { reception: 'réception', traiteur: 'commande à emporter', cadeau: 'carte cadeau', question: 'question' };
    if (!total) return [entete('Compris : les demandes qui attendent une décision', 'Aucune : toutes les demandes ont une réponse.'), { genre: 'aller', titre: 'Ouvrir les demandes', detail: 'La rubrique Demandes, toutes activités.', aller: { vue: 'demandes', filtre: 'tout' } }];
    return [entete('Compris : les demandes qui attendent une décision', `En ce moment (${jourLong(auj)}) : ${pluriel(total, 'demande')}. ${[att.tables.length ? `${pluriel(att.tables.length, 'table')} à confirmer` : '', ...Object.keys(NOMS).map((g) => { const k = att.autres.filter((d) => d.genre === g).length; return k ? `${k} ${NOMS[g]}${k > 1 ? 's' : ''}`.replace('cartes cadeaus', 'cartes cadeaux').replace('carte cadeaus', 'cartes cadeaux') : ''; })].filter(Boolean).join(', ')}. C'est le même compte que la rubrique Demandes.`),
      { genre: 'aller', titre: 'Ouvrir les demandes à traiter', detail: 'La rubrique Demandes : celles qui attendent sont en tête.', aller: { vue: 'demandes', filtre: 'tout' } },
      ...att.tables.slice(0, 3).map((r) => ({ genre: 'resa', titre: `${r.nom || 'Sans nom'} · table pour ${+r.couverts || 0}`, detail: `À confirmer · ${jourLong(r.date)} à ${heure(r.heure)}`, aller: { vue: 'resas', onglet: 'service', jour: r.date, service: r.service, resa: r.id } })),
      ...vieilles.slice(0, 4).map((d) => ({ genre: 'demande', titre: `${d.qui} · ${maj(NOMS[d.genre] || 'demande')}`, detail: `${d.titre} · reçue le ${fmt(String(d.cree).slice(0, 10), { day: 'numeric', month: 'long' })}`, aller: d.genre === 'traiteur' ? { commande: d.id } : { vue: 'demandes', filtre: d.genre, demande: d.id } }))];
  }

  /* ----- Les options de réception qui arrivent à échéance ----- */
  if (/\boptions?\b/.test(n)) {
    if (dd.erreur) return dateFausse();
    if (ctx.exemples === false) return [erreur('Les options de réception ne sont pas disponibles ici', 'Les dossiers de réception ne sont pas encore partagés sur le site d\'essai connecté. Rien n\'est fait.')];
    const p = lirePeriodeNommee(n, auj) || { debut: lundiDe(auj), fin: ajouter(lundiDe(auj), 6), nom: 'cette semaine' }, maintenant = instantCtx(ctx);
    const l = dossiersDe(S).map((d) => ({ d, r: resume(ctx, d, []), e: etatRetenue(d, maintenant) })).filter((x) => ['option', 'expiree'].includes(x.e.etat) && x.e.echeance && x.e.echeance.slice(0, 10) >= p.debut && x.e.echeance.slice(0, 10) <= p.fin && x.r.phase !== 'termine')
      .sort((a, b) => a.e.echeance.localeCompare(b.e.echeance));
    const quand = (t) => `${jourLong(t.slice(0, 10))} à ${heure(t.slice(11, 16))}`;
    return [entete(`Compris : les options de réception à échéance ${p.nom}`, `Période : ${periodeDite(p)}. ${l.length ? `${pluriel(l.length, 'option')} : ${l.filter((x) => x.e.etat === 'option').length} encore ${l.filter((x) => x.e.etat === 'option').length > 1 ? 'valables' : 'valable'}, ${l.filter((x) => x.e.etat === 'expiree').length} déjà ${l.filter((x) => x.e.etat === 'expiree').length > 1 ? 'expirées' : 'expirée'}.` : 'Aucune option n\'arrive à échéance sur cette période.'} À l'échéance, les espaces sont libérés ; le dossier reste suivi.`),
      ...l.slice(0, 6).map((x) => ({ genre: 'dossier', titre: `${x.r.client} · ${x.r.intitule}`, detail: `${x.e.etat === 'option' ? 'Option valable jusqu\'au' : 'Option expirée le'} ${quand(x.e.echeance)} · ${x.r.quand}`, aller: { dossier: x.d.id, onglet: 'espaces' } })),
      { genre: 'aller', titre: 'Ouvrir le suivi des réceptions', detail: 'La rubrique Demandes, filtre Réceptions : tous les dossiers, par étape.', aller: { vue: 'demandes', filtre: 'reception' } }];
  }

  /* ----- Retrouver le dossier d'une personne ----- */
  const dm = brut.match(/^(?:retrouve[rz]?|cherche[rz]?|trouve[rz]?|ouvre|ouvrir|affiche[rz]?|montre[rz]?(?:[- ]moi)?)\s+(?:moi\s+)?(?:le |la |les |un |une )?(?:dossiers?|fiches?|commandes?|r[ée]servations?|r[ée]ceptions?|demandes?)\s+(?:de la |du |de |d['’]|au nom de )\s*(.+?)\s*[.?!]*$/i);
  if (dm) {
    const q = simplifier(dm[1]), mots = q.split(/[^a-z0-9]+/).filter((w) => w.length >= 2); if (!mots.length) return [question('Le dossier de qui ?', 'Écrivez un prénom ou un nom, par exemple « retrouve le dossier de Camille ». Rien n\'est fait.')];
    const va = (nom) => { const t = simplifier(nom).split(/[^a-z0-9]+/); return mots.every((w) => t.some((x) => x.startsWith(w))); }, tel = (t) => String(t || '').replace(/\D/g, '');
    /* Une personne : son nom et, quand il est connu, son téléphone (deux « Camille » sans même téléphone sont deux personnes). */
    const P = new Map(), cleDe = (nom, t) => `${simplifier(nom)}|${tel(t)}`, pose = (nom, t, d) => { if (!va(nom)) return; let k = cleDe(nom, t);
      /* Un dossier sans téléphone rejoint la personne du même nom si elle est seule à le porter. */
      if (!tel(t)) { const memes = [...P.keys()].filter((x) => x.split('|')[0] === simplifier(nom)); if (memes.length === 1) k = memes[0]; }
      else { const sans = `${simplifier(nom)}|`; if (P.has(sans)) { P.set(k, P.get(sans)); P.delete(sans); } }
      if (!P.has(k)) P.set(k, { nom, telephone: t || '', dossiers: [] }); const p = P.get(k); if (t && !p.telephone) p.telephone = t; p.dossiers.push(d); };
    for (const c of clients) pose(c.nom, c.telephone, { rang: 0, genre: 'client', titre: `Fiche client · ${c.nom}`, detail: [c.telephone || 'sans téléphone', c.prochaine ? `prochaine venue ${jourLong(c.prochaine.date)}` : c.venues ? pluriel(c.venues, 'venue') : '', c.habitue ? 'habitué' : ''].filter(Boolean).join(' · '), aller: { vue: 'clients', client: c.cle } });
    if (ctx.exemples !== false) for (const d of dossiersDe(S)) { const r = resume(ctx, d, []); pose(r.client, d.client?.telephone, { rang: 1, genre: 'dossier', titre: `Dossier de réception · ${r.intitule}`, detail: `${r.etape.libelle} · ${r.quand}`, aller: { dossier: d.id, onglet: 'projet' } }); }
    for (const c of commandes(demandes, S, ctx.lieux)) pose(nomClient(c.client), c.client?.telephone, { rang: 2, genre: 'commande', titre: `Commande ${c.ref}`, detail: `${ETATS[c.etat]} · retrait ${jourLong(c.jour)}, ${momentTexte(c.moment)}`, aller: { commande: c.id } });
    for (const d of demandes) { if (d.genre === 'traiteur' || (d.genre === 'reception' && ctx.exemples !== false && dossiersDe(S).some((x) => x.demande === d.id))) continue; pose(d.qui, d.telephone, { rang: 3, genre: 'demande', titre: `Demande · ${d.titre}`, detail: `Reçue le ${fmt(String(d.cree).slice(0, 10), { day: 'numeric', month: 'long' })}`, aller: { vue: 'demandes', filtre: d.genre, demande: d.id } }); }
    for (const r of resas) pose(r.nom, r.telephone, { rang: 4, genre: 'resa', titre: `Réservation · ${jourLong(r.date)} à ${heure(r.heure)}`, detail: `${pluriel(+r.couverts || 0, 'couvert')} · ${r.statut === 'a-confirmer' ? 'à confirmer' : r.statut === 'confirmee' ? 'confirmée' : r.statut === 'arrivee' ? 'arrivés' : r.statut}`, aller: { vue: 'resas', onglet: 'service', jour: r.date, service: r.service, resa: r.id } });
    const gens = [...P.values()].map((p) => ({ ...p, dossiers: p.dossiers.sort((a, b) => a.rang - b.rang) }));
    if (!gens.length) return [erreur(`Aucun dossier au nom de « ${dm[1].trim()} »`, 'Ni fiche client, ni dossier de réception, ni commande, ni demande, ni réservation à venir. Vérifiez l\'orthographe, ou essayez le téléphone. Rien n\'est fait.')];
    if (gens.length > 1) return [question(`Plusieurs personnes correspondent à « ${dm[1].trim()} » : laquelle ?`, 'Choisissez la personne : son premier dossier s\'ouvre. Rien n\'est ouvert d\'office.'),
      ...gens.slice(0, 6).map((p) => ({ ...p.dossiers[0], titre: `${p.nom}${p.telephone ? ` · ${p.telephone}` : ''}`, detail: `${p.dossiers.map((d) => d.titre.split(' · ')[0]).join(', ')}` }))];
    const p = gens[0];
    return [entete(`Compris : retrouver le dossier de ${p.nom}`, `${p.telephone ? `${p.telephone} · ` : ''}${pluriel(p.dossiers.length, 'élément')} : ${p.dossiers.map((d) => d.titre.split(' · ')[0].toLowerCase()).join(', ')}.`), ...p.dossiers.slice(0, 6).map(({ rang, ...d }) => d)];
  }
  return [];
}

/**
 * Quand rien n'a été compris (ni ordre, ni recherche, ni intention) : le dire, et proposer ce qui existe vraiment.
 * Rien n'est exécuté : chaque suggestion remplit le champ, que l'on relit avant de valider.
 */
export function nonCompris(texte, vue = 'direction') {
  const t = String(texte || '').trim(); if (t.length < 3) return [];
  return [question(`Je n'ai pas compris « ${t.slice(0, 60)}${t.length > 60 ? '…' : ''} »`, 'Rien n\'a été fait. Voici ce que je sais faire : choisissez une phrase, elle s\'écrit dans le champ.'),
    ...exemplesPour(vue).slice(0, 5).map((x) => choix(maj(x), 'Écrire cette phrase dans le champ', x))];
}
