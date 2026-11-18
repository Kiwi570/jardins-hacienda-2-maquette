/* La barre « Que voulez-vous faire ? » de l'espace restaurateur (v7.7.1) : comprendre une phrase et proposer l'action.
   Fonctions pures, sans page ni stockage (testées par `node --test _audit/tests/*.test.mjs`).
   comprendre('fermer samedi soir', ctx) renvoie des propositions : ce qui va se passer, écrit en toutes lettres avec la
   date entière, et l'action nommée de espace-donnees.js à lancer (ou la rubrique à ouvrir). Rien n'est fait ici :
   l'écran (espace.js) lance l'action choisie, qui reste annulable comme les autres.
   Phrases comprises : fermer ou rouvrir un service, le dire complet, ajouter une soirée, poser une fermeture (du … au …),
   afficher ou retirer l'annonce, noter une réservation prise au téléphone, ouvrir une rubrique, retrouver un client.
   v7.7.2 : les rubriques sont Aujourd'hui, Demandes, Réservations, Carte et Site (avec ses onglets).
   v7.7.3 : la carte. « épuisé : côte de bœuf », « plus de foie gras », « foie gras à 23 € ». */
import { JOURS, ajouter, jourDe, fmt, maj, heure, hhmm, enMin, typo, pluriel, simplifier, servicesDe, creneaux, ouvert, complet } from './espace-regles.js?v=7';
import { carteDe, trouverPlat, prixTexte, lirePrix } from './espace-carte.js?v=7';
export { simplifier };

const MOIS = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
const RE_MOIS = MOIS.join('|'), RE_JOURS = JOURS.join('|');
const iso = (a, m, j) => { const d = new Date(Date.UTC(a, m - 1, j)); return d.getUTCMonth() === m - 1 && d.getUTCDate() === j ? d.toISOString().slice(0, 10) : null; };
/** Le prochain jour à ce quantième : ce mois-ci s'il n'est pas passé, sinon le mois suivant. */
function prochainQuantieme(j, auj) {
  const [a, m] = auj.split('-').map(Number);
  for (let k = 0; k < 13; k++) { const d = iso(a + Math.floor((m - 1 + k) / 12), ((m - 1 + k) % 12) + 1, j); if (d && d >= auj) return d; }
  return null;
}
const jourMois = (j, mois, annee, auj) => { const m = MOIS.indexOf(mois) + 1, a = +auj.slice(0, 4); if (annee) return iso(+annee, m, j); const d = iso(a, m, j); return d && d >= auj ? d : iso(a + 1, m, j); };

/** La date dite dans une phrase (déjà simplifiée), à partir d'aujourd'hui : « demain », « samedi », « le 12 », « 24 décembre », « 12/12 ». */
export function lireDate(n, auj) {
  let m;
  if (/\bapres[- ]demain\b/.test(n)) return ajouter(auj, 2);
  if (/\bdemain\b/.test(n)) return ajouter(auj, 1);
  if (/\b(aujourd'?hui|ce (midi|soir|jour))\b/.test(n)) return auj;
  if ((m = n.match(new RegExp(`\\b(\\d{1,2})(?:er)? (${RE_MOIS})(?: (\\d{4}))?\\b`)))) return jourMois(+m[1], m[2], m[3], auj);
  if ((m = n.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/))) { const a = m[3] ? (m[3].length === 2 ? 2000 + +m[3] : +m[3]) : null; if (a) return iso(a, +m[2], +m[1]); const d = iso(+auj.slice(0, 4), +m[2], +m[1]); return d && d >= auj ? d : iso(+auj.slice(0, 4) + 1, +m[2], +m[1]); }
  if ((m = n.match(new RegExp(`\\b(${RE_JOURS})( prochain)?\\b`)))) { let k = (JOURS.indexOf(m[1]) - jourDe(auj) + 7) % 7; if (!k && m[2]) k = 7; return ajouter(auj, k); }
  if ((m = n.match(/\ble (\d{1,2})(?:er)?\b(?! ?(?:h|:|heures?|personnes?|couverts?|pers)\b)/))) return prochainQuantieme(+m[1], auj);
  return null;
}
/** Une période « du 4 au 18 janvier », « du 28 décembre au 3 janvier ». */
export function lirePeriode(n, auj) {
  const m = n.match(new RegExp(`\\bdu (\\d{1,2})(?:er)?(?: (${RE_MOIS}))? au (\\d{1,2})(?:er)?(?: (${RE_MOIS}))?(?: (\\d{4}))?`)); if (!m) return null;
  const moisFin = m[4] || m[2]; if (!moisFin) { const du = prochainQuantieme(+m[1], auj); if (!du) return null; const au = prochainQuantieme(+m[3], du); return au ? { du, au } : null; }
  const au0 = jourMois(+m[3], moisFin, m[5], auj); if (!au0) return null;
  let du = jourMois(+m[1], m[2] || moisFin, m[5], auj), au = au0; if (!du) return null;
  if (du > au) { /* à cheval sur deux années : la fin est l'année d'après, ou le début l'année d'avant */ const a = +du.slice(0, 4); au = iso(a + 1, MOIS.indexOf(moisFin) + 1, +m[3]) || au; if (du > au) du = iso(+au.slice(0, 4) - 1, MOIS.indexOf(m[2] || moisFin) + 1, +m[1]); }
  return du && au && du <= au ? { du, au } : null;
}
export const lireService = (n) => (/\b(midi|dejeuner|brunch)\b/.test(n) ? 'midi' : /\b(soir|soiree|diner|nuit)\b/.test(n) ? 'soir' : null);
/** « 20h », « 20 h 30 », « 12:30 », « midi et demi » → « 20:00 ». */
export function lireHeure(n) {
  const m = n.match(/\b(\d{1,2}) ?(?:h|:|heures?) ?(\d{2})?\b/); if (m && +m[1] < 24) return hhmm(+m[1] * 60 + (+m[2] || 0));
  return null;
}
const dateLongue = (d) => fmt(d);
const quand = (d, svs) => `${dateLongue(d)}${svs.length === 1 ? (svs[0] === 'midi' ? ' à midi' : ' au soir') : ''}`;
const propre = (t) => maj(String(t || '').replace(/\s+/g, ' ').trim());

const RUBRIQUES = [
  [/\b(aujourd'?hui|accueil|tableau|jour)\b/, 'jour', 'Ouvrir « Aujourd\'hui »', 'Le service du jour et les demandes en attente.'],
  [/\b(service|frise|coup de feu|feuille|imprimer|absents?)\b/, 'resas', 'Ouvrir le service en frise', 'Les couverts à table, arrivés, absent, la feuille de service à imprimer.', null, 'service'],
  [/\b(bilan|chiffres|statistiques?|stats|remplissage)\b/, 'resas', 'Ouvrir le bilan de la semaine', 'Couverts, remplissage, service le plus chargé.', null, 'bilan'],
  [/\b(agenda|reservations?|resas?|planning|semaine)\b/, 'resas', 'Ouvrir les réservations', 'L\'agenda de la semaine, midi et soir.'],
  [/\b(demandes?|boite|a traiter)\b/, 'demandes', 'Ouvrir les demandes', 'Tout ce que le site envoie : tables, réceptions, traiteur, cartes cadeaux, questions.', null, null, 'tout'],
  [/\b(receptions?|mariages?|bapteme|anniversaires?|seminaires?)\b/, 'demandes', 'Ouvrir les demandes de réception', 'Mariages, anniversaires, baptêmes : où en est chacune.', null, null, 'reception'],
  [/\b(traiteur|commandes?|emporter)\b/, 'demandes', 'Ouvrir les commandes traiteur', 'À confirmer, à préparer, à remettre.', null, null, 'traiteur'],
  [/\b(cadeaux?|cartes? cadeaux?)\b/, 'demandes', 'Ouvrir les cartes cadeaux', 'Celles qui attendent d\'être envoyées.', null, null, 'cadeau'],
  [/\b(questions?)\b/, 'demandes', 'Ouvrir les questions', 'Celles qui attendent une réponse.', null, null, 'question'],
  [/\b(evenements?|soirees?|fetes?|billets?)\b/, 'site', 'Ouvrir les soirées', 'Modifier, masquer ou créer une soirée.', null, 'soirees'],
  [/\b(horaires?|ouverture)\b/, 'site', 'Ouvrir les horaires de la semaine', 'Le statut « ouvert maintenant » et la réservation les suivent.', 't-horaires', 'horaires'],
  [/\b(ardoise|plats? du jour|suggestions?)\b/, 'carte', 'Ouvrir l\'ardoise de la semaine', 'Le midi et le soir, plat par plat.', 't-ardoise', 'ardoise'],
  [/\b(carte|menu|plats?|prix|allergenes?)\b/, 'carte', 'Ouvrir la carte', 'Plats, prix, allergènes, « épuisé aujourd\'hui ».', null, 'carte'],
  [/\b(annonce|bandeau)\b/, 'site', 'Ouvrir l\'annonce', 'Un petit mot sur toutes les pages du site.', 't-annonce', 'horaires'],
  [/\b(messages?|sms|modeles?)\b/, 'site', 'Ouvrir les messages aux clients', 'Le texte que reçoit le client quand vous répondez.', null, 'messages'],
  [/\b(textes?|ecrire|phrase)\b/, 'site', 'Ouvrir les textes du site', 'Six textes de l\'accueil.', null, 'textes'],
  [/\b(photos?|images?|phototheque)\b/, 'site', 'Ouvrir les photos', 'Remplacer et cadrer six photos du site.', null, 'photos'],
];
/** Où aller : la rubrique, et s'il y a lieu l'onglet de « Site », la carte à repérer, le filtre des demandes. */
const vers = (vue, ancre, onglet, filtre) => ({ vue, ...(ancre ? { ancre } : {}), ...(onglet ? { onglet } : {}), ...(filtre ? { filtre } : {}) });
export const EXEMPLES = ['fermer samedi soir', 'ajouter une soirée raclette le 12', 'épuisé : foie gras', 'complet demain midi', 'annonce : complet ce soir, merci !', 'congés du 4 au 18 janvier', 'table pour 4 vendredi 20 h au nom de Martin'];

/**
 * @param {string} texte  ce que le restaurateur a écrit
 * @param {{ auj: string, R: object, S: object, exceptions?: object[], resas?: object[], pages?: object }} ctx
 *        auj : aujourd'hui (AAAA-MM-JJ) ; R : réglages de la réservation ; S : l'état de l'espace ; resas : les réservations à venir (recherche par nom)
 * @returns {{ genre: string, titre: string, detail: string, action?: { nom: string, args: object, msg: string, lien?: string }, aller?: object, inactif?: boolean }[]}
 */
export function comprendre(texte, ctx) {
  const brut = String(texte || '').trim(), n = simplifier(brut), out = [];
  if (n.length < 2) return out;
  const { auj, R, S = {}, pages = {} } = ctx, regles = { R, exceptions: ctx.exceptions || [] };
  const date = lireDate(n, auj), sv = lireService(n), tous = servicesDe(R).map((s) => s.id);
  const ouverts = (d, l) => l.filter((s) => ouvert(regles, S, d, s));

  /* L'annonce d'abord (« annonce : complet ce soir ») : sa phrase peut contenir « complet », « fermé » ou une date. */
  const an = brut.match(/^(?:annonce[rz]?|affiche[rz]?|message|bandeau)\s*:?\s+(.{3,})$/i);
  const retirerAnnonce = /^(retirer|enlever|masquer|couper|supprimer) (l'|la |mon |notre )?(annonce|bandeau|message)\b/.test(n);
  /* Une fermeture exceptionnelle : « congés du 4 au 18 janvier ». */
  const periode = an || retirerAnnonce ? null : lirePeriode(n, auj);
  if (an || retirerAnnonce) { /* traité plus bas */ }
  else if (periode && /\b(fermeture|ferme|fermer|conges?|vacances|travaux)\b/.test(n)) {
    const motif = /\bconges?|vacances\b/.test(n) ? 'Congés annuels' : /\btravaux\b/.test(n) ? 'Travaux' : 'Fermeture exceptionnelle';
    out.push({ genre: 'fermeture', titre: `Fermer du ${fmt(periode.du, { day: 'numeric', month: 'long' })} au ${fmt(periode.au, { day: 'numeric', month: 'long', year: 'numeric' })}`, detail: `${motif} : le site affichera « fermé » et la réservation ne proposera plus ces jours.`,
      action: { nom: 'ajouterFermeture', args: { ...periode, motif }, msg: 'Fermeture ajoutée : le site affichera « fermé » ces jours-là.', lien: pages.infos }, aller: vers('site', 't-fermetures', 'horaires') });
  }
  /* Rouvrir, fermer, complet : un jour, un service (ou les deux). */
  else if (date && /^(rouvrir|reouvrir|ouvrir|rouvre)\b/.test(n)) {
    const fermes = (sv ? [sv] : tous).filter((s) => (S.resa?.fermes?.[date] || []).includes(s));
    out.push(fermes.length ? { genre: 'ouvrir', titre: `Rouvrir ${quand(date, fermes)}`, detail: 'La réservation en ligne proposera de nouveau ce service.', action: { nom: 'fermer', args: { date, services: fermes, actif: false }, msg: 'Service rouvert.', lien: pages.reserver }, aller: { vue: 'resas', jour: date } }
      : { genre: 'ouvrir', titre: `Rien à rouvrir ${quand(date, sv ? [sv] : tous)}`, detail: 'Ce service n\'a pas été fermé depuis l\'agenda. Pour un jour habituellement fermé, changez les horaires de la semaine.', aller: vers('site', 't-horaires', 'horaires') });
  } else if (date && /\b(fermer|ferme|fermeture|fermons)\b/.test(n)) {
    const l = ouverts(date, sv ? [sv] : tous);
    out.push(l.length ? { genre: 'fermer', titre: `Fermer ${quand(date, l)}`, detail: 'Plus de réservation en ligne pour ce service ; les réservations déjà prises restent dans l\'agenda.', action: { nom: 'fermer', args: { date, services: l, actif: true }, msg: 'Service fermé ce jour-là : plus de réservation en ligne.', lien: pages.reserver }, aller: { vue: 'resas', jour: date } }
      : { genre: 'fermer', titre: `Déjà fermé ${quand(date, sv ? [sv] : tous)}`, detail: 'Il n\'y a pas de service ouvert à fermer ce jour-là.', aller: { vue: 'resas', jour: date }, inactif: true });
  } else if (date && /\bcomplete?s?\b/.test(n)) {
    const plus = /\b(plus|pas|rouvrir|liberer|de nouveau)\b/.test(n), l = ouverts(date, sv ? [sv] : tous).filter((s) => complet(S, date, s) === plus);
    out.push(l.length ? { genre: 'complet', titre: plus ? `Proposer de nouveau ${quand(date, l)}` : `Dire complet ${quand(date, l)}`, detail: plus ? 'La réservation en ligne proposera de nouveau ce service.' : 'La réservation en ligne ne proposera plus ce service ; le restaurant reste ouvert.', action: { nom: 'complet', args: { date, services: l, actif: !plus }, msg: plus ? 'Le service est de nouveau proposé.' : 'Service complet : la réservation en ligne ne le propose plus.', lien: pages.reserver }, aller: { vue: 'resas', jour: date } }
      : { genre: 'complet', titre: plus ? `Aucun service complet ${quand(date, sv ? [sv] : tous)}` : `Rien à dire complet ${quand(date, sv ? [sv] : tous)}`, detail: plus ? 'Rien à changer.' : 'Le service est fermé ce jour-là, ou déjà complet.', aller: { vue: 'resas', jour: date }, inactif: true });
  }
  /* La carte (v7.7.3) : « épuisé : côte de bœuf », « plus de foie gras », « il reste du foie gras », « foie gras à 23 € ». */
  if (ctx.carte && !out.length && !an && !retirerAnnonce) {
    const carte = carteDe(ctx.carte, S, auj), allerCarte = (cle) => ({ vue: 'carte', onglet: 'carte', plat: cle });
    const ep = n.match(/^(?:epuisee?s?|rupture(?: de)?|plus d[e']|il n'y a plus d[e']|termine|fini)\s*:?\s*(.+)$/), remis = n.match(/^(?:il reste|de nouveau|remettre|encore)\s*:?\s*(?:du |de la |des |de l'|le |la |les )?(.+)$/);
    const px = brut.match(/^(?:prix\s+(?:du |de la |des |de l'|de )?)?(.+?)\s+(?:à|a|:|=|passe à|passe a)\s*(\d+(?:[.,]\d{1,2})?)\s*(?:€|euros?)?$/i);
    if (ep || remis) {
      const p = trouverPlat(carte, (ep || remis)[1]);
      if (p) out.push(ep ? (p.epuise ? { genre: 'carte', titre: `« ${p.nom} » est déjà épuisé aujourd'hui`, detail: 'Il reviendra tout seul demain.', aller: allerCarte(p.cle), inactif: true }
          : { genre: 'carte', titre: `Dire « ${p.nom} » épuisé aujourd'hui`, detail: 'La carte du site l\'indique aussitôt ; demain, le plat revient tout seul.', action: { nom: 'epuise', args: { cle: p.cle, date: auj, actif: true }, msg: `« ${p.nom} » : épuisé aujourd'hui, la carte du site l'indique.`, lien: pages.carte }, aller: allerCarte(p.cle) })
        : (p.epuise ? { genre: 'carte', titre: `Remettre « ${p.nom} » à la carte dès maintenant`, detail: 'Il n\'est plus indiqué épuisé sur le site.', action: { nom: 'epuise', args: { cle: p.cle, date: auj, actif: false }, msg: `« ${p.nom} » est de nouveau proposé.`, lien: pages.carte }, aller: allerCarte(p.cle) }
          : { genre: 'carte', titre: `« ${p.nom} » n'est pas épuisé`, detail: 'Rien à changer.', aller: allerCarte(p.cle), inactif: true }));
    } else if (px) {
      const p = trouverPlat(carte, px[1]), v = lirePrix(px[2]);
      if (p && !date) out.push({ genre: 'carte', titre: `Passer « ${p.nom} » à ${prixTexte(v)}`, detail: `Aujourd'hui : ${prixTexte(p.prix) || 'sans prix'}. La carte du site suit aussitôt.`, action: { nom: 'plat', args: { cle: p.cle, champs: { prix: v } }, msg: `« ${p.nom} » : ${prixTexte(v)} sur la carte.`, lien: pages.carte }, aller: allerCarte(p.cle) });
    }
  }
  /* Une soirée : « ajouter une soirée raclette le 12 ». */
  const ev = brut.match(/^(?:(?:ajoute[rz]?|cr[ée]e[rz]?|nouvel(?:le)?|nouveau|programme[rz]?|organise[rz]?|pr[ée]voir)\s+)?(?:une?\s+|le\s+|la\s+)?((?:soir[ée]e|brunch|concert|atelier|f[êe]te|d[îi]ner|d[ée]jeuner|[ée]v[ée]nement)\b.*)$/i);
  if (ev && date && !out.length && !an && !retirerAnnonce) {
    const titre = propre(ev[1].replace(new RegExp(`\\s+(?:(?:pour |a partir du |à partir du )?le \\d|du \\d|ce (?:soir|midi)|demain|apr[èe]s[- ]demain|aujourd'?hui|(?:${RE_JOURS})\\b|\\d{1,2}(?:er)? (?:${RE_MOIS.replace(/e/g, '[eéèû]').replace(/u/g, '[uû]')})|\\d{1,2}\\/\\d).*$`, 'i'), ''));
    const type = /brunch/i.test(titre) ? 'Brunch' : /concert/i.test(titre) ? 'Concert' : /atelier/i.test(titre) ? 'Atelier' : /f[êe]te/i.test(titre) ? 'Fête' : 'Soirée', service = type === 'Brunch' || sv === 'midi' ? 'midi' : 'soir';
    const id = `ev-${date}-${simplifier(titre).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24)}`;
    if (titre.length > 2) out.push({ genre: 'evenement', titre: `Créer « ${titre} », ${dateLongue(date)}${service === 'midi' ? ' au déjeuner' : ' au soir'}`, detail: 'Le billet s\'ajoute sur la page Les fêtes ; vous complétez ensuite le prix et la photo.',
      action: { nom: 'evenement', args: { id, champs: { titre, type, debut: date, service, prix: '', image: 'vraie/salle-pierre', cadrage: '50% 50%' } }, msg: `« ${titre} » est sur le site : ajoutez le prix et la photo.`, lien: pages.fetes }, aller: { vue: 'site', onglet: 'soirees', editer: id } });
  }
  if (retirerAnnonce) out.push(S.annonce?.active ? { genre: 'annonce', titre: 'Retirer l\'annonce du site', detail: `« ${S.annonce.texte} »`, action: { nom: 'annonce', args: { active: false }, msg: 'Annonce retirée.', lien: pages.accueil }, aller: vers('site', 't-annonce', 'horaires') }
    : { genre: 'annonce', titre: 'Aucune annonce n\'est affichée', detail: 'Rien à retirer.', aller: vers('site', 't-annonce', 'horaires'), inactif: true });
  else if (an) { const t = typo(propre(an[1])).slice(0, 160); out.push({ genre: 'annonce', titre: 'Afficher cette annonce sur tout le site', detail: `« ${t} »`, action: { nom: 'annonce', args: { active: true, texte: t }, msg: 'Annonce affichée sur toutes les pages.', lien: pages.accueil }, aller: vers('site', 't-annonce', 'horaires') }); }
  /* Une réservation prise au téléphone : « table pour 4 vendredi 20 h au nom de Martin ». */
  if (!out.length && /^(reserver|reserve|reservation|resa|table|noter|ajouter une (reservation|table|resa))\b/.test(n)) {
    const c = n.match(/\bpour (\d{1,2})\b(?! ?h)/) || n.match(/\b(\d{1,2}) ?(?:personnes?|couverts?|pers|pax|p)\b/), nb = c ? Math.max(1, Math.min(30, +c[1])) : 2;
    const nom = (brut.match(/\bau nom de\s+(.+?)(?:\s+(?:pour|le|à|a|vers)\s|$)/i) || brut.match(/\b(?:pour|de)\s+((?:M\.|Mme|Monsieur|Madame|Famille)\s+\p{Lu}[\p{L}'-]+)/u)
      /* ou le nom écrit juste après le verbe, avec sa majuscule : « réserver Dupont 2 personnes dimanche midi » */
      || brut.match(/^\S+\s+(?:une\s+table\s+)?(?:pour\s+)?((?:(?:M\.|Mme|Famille)\s+)?\p{Lu}[\p{Ll}'-]+(?:\s\p{Lu}[\p{Ll}'-]+)?)(?=\s|$)/u) || [])[1];
    const d = date || auj, h0 = lireHeure(n), svr = h0 ? (enMin(h0) < 17 * 60 ? 'midi' : 'soir') : sv || ouverts(d, tous)[0] || tous[0], cr = creneaux(R, svr);
    /* L'heure dite si elle est dans le service, sinon le créneau le plus proche (ou le premier). */
    const h = h0 ? cr.reduce((a, b) => (Math.abs(enMin(b) - enMin(h0)) < Math.abs(enMin(a) - enMin(h0)) ? b : a), cr[0]) : cr[0];
    if (!ouvert(regles, S, d, svr)) out.push({ genre: 'resa', titre: `Pas de service ${quand(d, [svr])}`, detail: 'Choisissez un autre jour, ou rouvrez ce service dans l\'agenda.', aller: { vue: 'resas', jour: d }, inactif: true });
    else out.push({ genre: 'resa', titre: `Noter ${nom ? propre(nom) : 'une table'}, ${pluriel(nb, 'couvert')}, ${dateLongue(d)} à ${heure(h)}`, detail: `${nom ? '' : 'Sans nom pour l\'instant. '}Réservation prise au téléphone, confirmée d'office${h0 && h !== h0 ? ` (créneau le plus proche de ${heure(h0)})` : ''}.`,
      action: { nom: 'ajouterResa', args: { resa: { date: d, service: svr, heure: h, couverts: nb, nom: nom ? propre(nom) : 'Sans nom', telephone: '', demande: '', espace: 'salle', statut: 'confirmee', source: 'telephone' } }, msg: 'Réservation ajoutée à l\'agenda.' }, aller: { vue: 'resas', jour: d } });
  }
  /* Ouvrir une rubrique. */
  if (!out.length || out.every((p) => p.inactif)) for (const [re, vue, titre, detail, ancre, onglet, filtre] of RUBRIQUES) if (re.test(n) && !out.some((p) => p.titre === titre)) out.push({ genre: 'aller', titre, detail, aller: vers(vue, ancre, onglet, filtre) });
  if (/\b(voir|ouvrir) le site\b|^site$/.test(n)) out.push({ genre: 'site', titre: 'Voir le site', detail: 'Avec vos modifications, dans ce navigateur.', aller: { url: pages.accueil || '/' } });
  if (date && !out.some((p) => p.action || p.aller?.jour)) out.push({ genre: 'aller', titre: `Ouvrir l'agenda du ${dateLongue(date)}`, detail: 'Les réservations du midi et du soir.', aller: { vue: 'resas', jour: date } });
  /* Retrouver un client par son nom, dans les quatre semaines qui viennent. */
  if (ctx.resas?.length && n.length >= 3 && !out.some((p) => p.action)) {
    const mots = n.split(' ').filter((w) => w.length >= 3);
    for (const r of ctx.resas.filter((x) => mots.some((w) => simplifier(x.nom).split(/[ .]/).some((p) => p.startsWith(w)))).slice(0, 4))
      out.push({ genre: 'client', titre: `${r.nom} · ${dateLongue(r.date)} à ${heure(r.heure)}`, detail: `${pluriel(+r.couverts, 'couvert')}${r.demande ? ` · ${r.demande}` : ''} · ${r.statut === 'a-confirmer' ? 'à confirmer' : r.statut === 'confirmee' ? 'confirmée' : r.statut === 'arrivee' ? 'arrivés' : 'refusée'}`, aller: { vue: 'resas', jour: r.date, resa: r.id } });
  }
  return out.slice(0, 6);
}
