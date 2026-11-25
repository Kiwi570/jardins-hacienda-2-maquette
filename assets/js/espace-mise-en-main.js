/* « Préparer l'outil pour votre restaurant » (v7.16.0) : la mise en main des réglages existants. Règles pures.
   Ce module ne règle rien et ne garde rien : il RELIT, à chaque appel, les sources que lisent déjà les autres écrans
   (horaires, plan de salle, période et capacités des retraits, catalogue et publication, validité des cartes) et dit,
   pour chaque valeur, ce qu'on en sait vraiment :
     - « Non renseigné »               : la valeur n'existe pas ;
     - « Valeur d'exemple à confirmer » : la valeur vient de la maquette ou d'une démonstration, pas du restaurant ;
     - « Renseigné »                   : une valeur est là (reprise du site publié, ou enregistrée dans l'espace) ;
     - « Non disponible dans ce mode » : l'écran n'existe pas dans ce mode (site d'essai connecté).
   Une valeur présente n'est jamais dite « confirmée » : aucune décision du restaurant n'est enregistrée par l'outil.
   Chaque rubrique nomme l'écran existant où ses valeurs se modifient (`aller`), et dit précisément ce qui ne se modifie
   pas dans l'outil. Aucun formulaire, aucune copie de paramètre, aucune règle de disponibilité n'est ajoutée ici. */
import { SEMAINE, CAPACITE, heure, hhmm, fmt, pluriel, svDe, servicesDe } from './espace-regles.js?v=7';
import { tablesDe, assemblagesDe } from './espace-salle.js?v=7';
import { catalogue, enPreparation, offres } from './espace-offres.js?v=7';
import { emporterVitrine, cadeauxVitrine } from './espace-publie.js?v=7';
import { periodeRetraits, periodeTexte, capacites, validite, cartes, quantite } from './commerce.js?v=7';

export const TITRE = 'Préparer l\'outil pour votre restaurant';
export const ETATS = { vide: 'Non renseigné', exemple: 'Valeur d\'exemple à confirmer', renseigne: 'Renseigné', indisponible: 'Non disponible dans ce mode' };
export const RUBRIQUES = [['horaires', 'Horaires et services'], ['salles', 'Salles et capacités'], ['emporter', 'À emporter et retraits'], ['offres', 'Offres et tarifs'], ['cadeaux', 'Cartes cadeaux']];

const nb = (n) => String(n).replace('.', ',');
const euro = (n) => `${nb(Math.round(n * 100) / 100)} €`;
/** « du mardi au samedi », « mardi et mercredi », « lundi » : des jours de la semaine, dans l'ordre. */
function joursDits(jours) {
  const rangs = jours.map((j) => SEMAINE.indexOf(j)).sort((a, b) => a - b), blocs = [];
  for (const r of rangs) { const b = blocs.at(-1); if (b && r === b[1] + 1) b[1] = r; else blocs.push([r, r]); }
  return blocs.map(([a, b]) => (a === b ? SEMAINE[a] : b === a + 1 ? `${SEMAINE[a]} et ${SEMAINE[b]}` : `du ${SEMAINE[a]} au ${SEMAINE[b]}`)).join(', ');
}
/** Un service de la semaine, en clair : « du mardi au samedi, de 19 h à 23 h ». '' si le service n'est ouvert aucun jour. */
export function serviceDit(semaine, sv) {
  const par = new Map();
  for (const j of SEMAINE) { const p = (semaine?.[j] || []).find((c) => svDe(c) === sv); if (p) par.set(p, [...(par.get(p) || []), j]); }
  return [...par].map(([p, jours]) => { const [d, f] = p.split('-'); return `${joursDits(jours)}, de ${heure(d)} à ${f === '00:00' ? 'minuit' : heure(f)}`; }).join(' ; ');
}
const fermesDits = (semaine) => joursDits(SEMAINE.filter((j) => !(semaine?.[j] || []).length));

const ligne = (libelle, valeur, etat = '', plus = {}) => ({ libelle, valeur: String(valeur).replace(/^./, (x) => x.toUpperCase()), etat, ...plus });

/**
 * La mise en main : cinq rubriques, relues dans les sources réelles.
 * @param {object} c  { S, base: { semaine, exceptions }, salle, lieux, R, sources: { carte, agenda, lieux, produits… }, auj, connecte, scenario }
 * @returns {{ rubriques: object[], repere: { total, vide, exemple, renseigne, indisponible }, portee: string }}
 *   rubrique : { id, titre, sert, portee: { cle, texte }, lignes: { libelle, valeur, etat, note?, fixe? }[], manques: string[],
 *                limites: string[], actions: { libelle, aller, ouvrir?, filtre?, principal? }[] }
 */
export function miseEnMain(c) {
  const { S = {}, base = {}, salle = {}, lieux = {}, R = {}, sources = {}, auj = '', connecte = false, scenario = '' } = c;
  /* Où vont les changements : dit une fois par rubrique, d'après ce qui est réellement partagé. */
  const PORTEE = {
    demo: { cle: 'demo', texte: 'Dans cette démonstration : un changement reste dans ce scénario fictif.' },
    navigateur: { cle: 'navigateur', texte: 'Dans ce navigateur : un changement n\'est pas partagé avec un autre appareil.' },
    partage: { cle: 'partage', texte: 'Partagé avec l\'équipe : un changement est enregistré sur le serveur du site d\'essai.' },
    appareil: { cle: 'appareil', texte: 'Sur cet appareil seulement : sur le site d\'essai connecté, ces réglages ne sont pas encore partagés avec l\'équipe.' },
    fixe: { cle: 'fixe', texte: 'Valeurs de la maquette : elles se relisent ici, elles ne se modifient pas dans l\'outil.' },
  };
  const local = connecte ? PORTEE.appareil : scenario ? PORTEE.demo : PORTEE.navigateur;
  const rubriques = [];

  /* ----- 1. Horaires et services ----- */
  { const modifies = !!S.horaires?.semaine, sem = S.horaires?.semaine || base.semaine || {}, exc = [...(S.horaires?.exceptions || [])].filter((x) => !auj || (x.au || x.du) >= auj);
    const midi = serviceDit(sem, 'midi'), soir = serviceDit(sem, 'soir'), fermes = fermesDits(sem), sv = servicesDe(R), marge = R.derniere_arrivee_avant_fermeture || {};
    const origine = modifies ? 'Enregistrés dans l\'espace.' : 'Repris du site publié : à relire.';
    const lignes = [
      ligne('Service du midi', midi || 'Aucun jour ouvert le midi', midi ? 'renseigne' : 'vide', { note: origine }),
      ligne('Service du soir', soir || 'Aucun jour ouvert le soir', soir ? 'renseigne' : 'vide', { note: origine }),
      ...(fermes ? [ligne('Jours fermés', fermes.charAt(0).toUpperCase() + fermes.slice(1), '', { note: 'Déduit des deux lignes précédentes.' })] : []),
      ligne('Fermetures exceptionnelles à venir', exc.length ? exc.map((x) => (x.du === x.au || !x.au ? fmt(x.du, { day: 'numeric', month: 'long' }) : `du ${fmt(x.du, { day: 'numeric', month: 'long' })} au ${fmt(x.au, { day: 'numeric', month: 'long' })}`)).join(' ; ') : 'Aucune fermeture prévue', exc.length ? 'renseigne' : '', { note: exc.length ? '' : 'Ce n\'est pas un manque : vos congés s\'ajoutent quand vous les connaissez.' }),
      ligne('Heures d\'arrivée proposées', sv.map((s) => `${s.id === 'midi' ? 'le midi' : 'le soir'} de ${heure(hhmm(s.d))} à ${heure(hhmm(s.f))}, toutes les ${s.pas} min`).join(' ; ') || 'Non définies', sv.length ? 'exemple' : 'vide', { fixe: true, note: `Dernière arrivée ${[marge.midi != null ? `${marge.midi} min avant la fermeture le midi` : '', marge.soir != null ? `${marge.soir} min le soir` : ''].filter(Boolean).join(', ') || 'non précisée'} (déduit des horaires publiés).` }),
      ligne('Réservation en ligne', [R.couverts_max ? `jusqu'à ${pluriel(R.couverts_max, 'couvert')}` : '', R.delai_minutes != null ? `au plus tard ${R.delai_minutes} min avant` : '', R.jours_a_l_avance ? `jusqu'à ${R.jours_a_l_avance} jours à l'avance` : ''].filter(Boolean).join(', ') || 'Non définie', R.couverts_max || R.jours_a_l_avance ? 'exemple' : 'vide', { fixe: true }),
    ];
    rubriques.push({ id: 'horaires', titre: 'Horaires et services', sert: 'Pour vérifier vos jours et vos heures d\'ouverture : le statut « ouvert maintenant » du site, les services proposés à la réservation et les créneaux de retrait les suivent.',
      portee: connecte ? PORTEE.partage : scenario ? PORTEE.demo : PORTEE.navigateur, lignes,
      manques: [...(!midi && !soir ? ['Aucun service n\'est ouvert dans la semaine : le site afficherait « fermé » tous les jours.'] : [])],
      limites: ['Les heures d\'arrivée proposées, la dernière arrivée et les limites de la réservation en ligne ne se modifient pas encore dans l\'outil : ce sont des valeurs de la maquette, à confirmer avec vous.', 'Ce qui se règle au jour le jour reste dans Agenda, onglet Service : fermer un service, l\'ouvrir à titre exceptionnel, le déclarer complet.'],
      actions: [{ libelle: 'Ouvrir les horaires de la semaine', aller: { vue: 'site', onglet: 'horaires', ancre: 't-horaires' }, principal: true }, { libelle: 'Ouvrir les fermetures exceptionnelles', aller: { vue: 'site', onglet: 'horaires', ancre: 't-fermetures' } }] }); }

  /* ----- 2. Salles et capacités ----- */
  { const ete = `${(auj || '2026-07-01').slice(0, 4)}-07-15`, tables = tablesDe(salle, ete), dedans = tables.filter((t) => t.zone !== 'terrasse'), dehors = tables.filter((t) => t.zone === 'terrasse'), places = (l) => l.reduce((n, t) => n + t.places, 0), ass = assemblagesDe(salle, ete);
    const espaces = (lieux.espaces || []).filter((x) => !x.partie), avecCap = espaces.filter((x) => +x.capacite > 0), sansCap = espaces.filter((x) => !(+x.capacite > 0));
    const lignes = [
      ligne('Tables de la salle', dedans.length ? `${pluriel(dedans.length, 'table')}, ${pluriel(places(dedans), 'place')}` : 'Aucune table', dedans.length ? 'exemple' : 'vide', { fixe: true, note: 'Plan dessiné pour la maquette.' }),
      ligne('Tables de la terrasse', dehors.length ? `${pluriel(dehors.length, 'table')}, ${pluriel(places(dehors), 'place')}, de juin à septembre` : 'Aucune table', dehors.length ? 'exemple' : 'vide', { fixe: true, note: 'Saison reprise du site.' }),
      ligne('Tables qui se rapprochent', ass.length ? ass.map((a) => `${a.nom.toLowerCase()} (${pluriel(a.places, 'place')})`).join(' ; ') : 'Aucune', ass.length ? 'exemple' : '', { fixe: true }),
      ligne('Capacité par service', `${pluriel(CAPACITE, 'couvert')} (réservation en ligne et à la main)`, 'exemple', { fixe: true, note: 'Valeur de démonstration : elle ne doit pas devenir votre capacité réelle sans votre accord.' }),
      connecte ? ligne('Espaces de réception', 'Les dossiers de réception ne sont pas partagés sur le site d\'essai connecté.', 'indisponible')
        : ligne('Espaces de réception', avecCap.length ? avecCap.map((x) => `${x.nom} : ${x.capacite} personnes${x.cocktail ? ` (${x.cocktail} en cocktail)` : ''}`).join(' ; ') : 'Aucune capacité connue', avecCap.length ? 'renseigne' : 'vide', { fixe: true, note: avecCap.length ? 'Capacités reprises de la page Réceptions du site.' : '' }),
    ];
    rubriques.push({ id: 'salles', titre: 'Salles et capacités', sert: 'Pour vérifier que les tables, leurs places et la capacité d\'un service correspondent à votre salle : le placement, « complet » et les alternatives proposées au client en dépendent.',
      portee: PORTEE.fixe, lignes,
      manques: [...(!connecte && sansCap.length ? [`${pluriel(sansCap.length, 'espace')} de réception sans capacité connue (${sansCap.map((x) => x.nom).join(', ')}) : ${sansCap.length > 1 ? 'ils s\'affichent' : 'il s\'affiche'} « À renseigner ».`] : [])],
      limites: ['Le plan, le nombre de places, les tables qui se rapprochent et la capacité par service ne se modifient pas dans l\'outil dans cette version. Ils se changent dans la maquette, avec vos vraies valeurs.', 'Ce qui se règle au quotidien, dans Agenda, onglet Salle : rendre une table indisponible, rapprocher deux tables pour un service, replier la terrasse.'],
      actions: [{ libelle: 'Voir le plan de salle', aller: { vue: 'resas', onglet: 'salle' }, principal: true }] }); }

  /* ----- 3. À emporter et retraits ----- */
  { const p = periodeRetraits(S, lieux), cap = capacites(S), produits = emporterVitrine(lieux, S, ''), definies = produits.filter((o) => cap.production[o.id] != null), sansDelai = produits.filter((o) => o.vente?.delai === '' || o.vente?.delai == null);
    const lignes = [
      ligne('Période des retraits', p.debut && p.fin ? periodeTexte(p).replace(/^./, (x) => x.toUpperCase()) : 'Non renseignée', !p.debut || !p.fin ? 'vide' : p.reglee ? 'renseigne' : 'exemple', { note: p.debut && !p.reglee ? 'Réglage de départ, celui de la page livrée : à confirmer pour vos prochaines fêtes.' : p.reglee ? 'Enregistrée dans l\'espace.' : '' }),
      ligne('Créneaux de retrait', 'Midi et soir, les jours ouverts', '', { note: 'Ils suivent les horaires de la maison (rubrique 1) ; pas d\'heure précise de retrait dans cette version.' }),
      ligne('Commandes par créneau de retrait', cap.retraits == null ? 'Non définie : aucun plafond' : pluriel(cap.retraits, 'commande'), cap.retraits == null ? 'vide' : cap.exemple ? 'exemple' : 'renseigne'),
      ligne('Production par jour', !produits.length ? 'Aucun produit proposé à la commande' : definies.length ? produits.map((o) => `${o.nom} : ${cap.production[o.id] != null ? quantite(cap.production[o.id], o.unite) : 'non définie'}`).join(' ; ') : 'Non définie : aucun plafond', !produits.length || !definies.length ? 'vide' : cap.exemple ? 'exemple' : 'renseigne'),
      ligne('Produits proposés à la commande', produits.length ? `${pluriel(produits.length, 'produit')} sur la page À emporter` : 'Aucun', produits.length ? 'renseigne' : 'vide', { note: produits.length ? 'Leurs prix se relisent dans « Offres et tarifs ».' : '' }),
    ];
    rubriques.push({ id: 'emporter', titre: 'À emporter et retraits', sert: 'Pour vérifier quand vos clients peuvent commander et retirer, et combien vous pouvez préparer : la page À emporter et la validation des commandes appliquent ces limites.',
      portee: local, lignes,
      manques: [...(produits.length && definies.length && definies.length < produits.length ? [`${pluriel(produits.length - definies.length, 'produit')} sans capacité de production : rien n'y est limité.`] : []),
        ...(sansDelai.length ? [`Délai de commande non précisé pour ${pluriel(sansDelai.length, 'produit')} : seul un jour passé est refusé. Il se règle sur chaque produit, dans le catalogue.`] : [])],
      limites: [],
      actions: [{ libelle: 'Ouvrir la période des retraits', aller: { commerce: { ecran: 'preparation' } }, ouvrir: 'perOuvert', principal: true }, { libelle: 'Ouvrir les capacités', aller: { commerce: { ecran: 'preparation' } }, ouvrir: 'capOuvert' }, { libelle: 'Ouvrir les produits à emporter', aller: { vue: 'carte', onglet: 'catalogue' }, filtre: 'emporter' }] }); }

  /* ----- 4. Offres et tarifs ----- */
  { const tout = catalogue(sources, S, auj).filter((x) => !x.archive), prep = enPreparation(sources, S), publies = tout.filter((x) => x.publie), exemples = tout.filter((x) => x.exemple), sansPrix = tout.filter((x) => /à définir/i.test(x.prix));
    const parType = (t) => publies.filter((x) => x.type === t).length, detail = [[parType('plat'), 'plat', 'plats'], [parType('formule') + parType('prestation'), 'formule ou prestation', 'formules ou prestations'], [parType('soiree'), 'soirée', 'soirées'], [parType('emporter'), 'produit à emporter', 'produits à emporter'], [parType('cadeau'), 'carte cadeau', 'cartes cadeaux']].filter(([n]) => n).map(([n, un, des]) => `${n} ${n > 1 ? des : un}`).join(', ');
    const lignes = [
      ligne('Offres visibles', publies.length ? `${pluriel(publies.length, 'offre publiée').replace('offre publiées', 'offres publiées')}${detail ? ` : ${detail}` : ''}` : 'Aucune offre publiée', publies.length ? 'renseigne' : 'vide'),
      ligne('Brouillons et changements en préparation', prep.length ? `${pluriel(prep.length, 'changement')} à publier ou à abandonner : ${prep.slice(0, 3).map((x) => x.libelle).join(', ')}${prep.length > 3 ? '…' : ''}` : 'Aucun : tout ce qui est préparé est publié', '', { note: prep.length ? 'Rien n\'est en ligne tant que vous ne publiez pas.' : '' }),
      ligne('Montants marqués « Exemple »', exemples.length ? `${pluriel(exemples.length, 'offre')} : ${exemples.slice(0, 4).map((x) => `${x.nom} (${x.prix})`).join(' ; ')}${exemples.length > 4 ? '…' : ''}` : 'Aucun', exemples.length ? 'exemple' : '', { note: exemples.length ? 'Montants de démonstration : ils ne viennent pas du restaurant.' : '' }),
      ligne('Offres sans prix', sansPrix.length ? `${pluriel(sansPrix.length, 'offre')} : ${sansPrix.slice(0, 4).map((x) => x.nom).join(', ')}${sansPrix.length > 4 ? '…' : ''}` : 'Aucune', sansPrix.length ? 'vide' : ''),
    ];
    rubriques.push({ id: 'offres', titre: 'Offres et tarifs', sert: 'Pour vérifier ce que vos clients voient et à quel prix : la carte, les formules, les soirées, les produits à emporter. Un prix se prépare en brouillon, se relit en aperçu, puis se publie.',
      portee: local, lignes, manques: [],
      limites: ['Relire ici ne publie rien. Un nouveau prix ne change ni une proposition déjà acceptée, ni une commande déjà reçue : elles gardent le leur.'],
      actions: [{ libelle: 'Ouvrir tout le catalogue', aller: { vue: 'carte', onglet: 'catalogue' }, filtre: 'tout', principal: true }, { libelle: 'Ouvrir la publication', aller: { vue: 'site', onglet: 'publication' } }] }); }

  /* ----- 5. Cartes cadeaux ----- */
  { const proposees = cadeauxVitrine(lieux, S, ''), toutes = offres(lieux, S).filter((o) => o.type === 'cadeau' && !o.archive), v = validite(S), emises = cartes(S), datees = emises.filter((x) => x.expire);
    const lignes = [
      ligne('Cartes proposées sur la page Offrir', proposees.length ? `${pluriel(proposees.length, 'carte')} : ${proposees.map((o) => euro(o.prix)).join(', ')}` : toutes.length ? 'Aucune carte publiée' : 'Aucune carte dans le catalogue', proposees.length ? (proposees.some((o) => o.exemple) ? 'exemple' : 'renseigne') : 'vide', { note: proposees.length ? 'Montants repris de la page Offrir : à confirmer.' : '' }),
      ligne('Durée de validité des prochaines cartes', v ? `${v.mois} mois à partir de l'émission` : 'Non définie : les cartes seraient émises sans date de fin', !v ? 'vide' : v.exemple ? 'exemple' : 'renseigne', { note: 'Le site annonce « 6 mois » : à confirmer avant de l\'appliquer.' }),
      ligne('Cartes déjà émises', emises.length ? `${pluriel(emises.length, 'carte')}${datees.length ? `, dont ${datees.length} avec une date de fin` : ''}` : 'Aucune', '', { note: emises.length ? 'Elles gardent leur date de fin, leurs utilisations et leur historique, quel que soit le réglage.' : '' }),
    ];
    rubriques.push({ id: 'cadeaux', titre: 'Cartes cadeaux', sert: 'Pour vérifier les montants proposés et la durée de validité des prochaines cartes. Changer la durée ne touche pas aux cartes déjà émises.',
      portee: local, lignes, manques: [],
      limites: ['Le règlement d\'une carte est simulé (une note de l\'équipe) : rien n\'est encaissé.'],
      actions: [{ libelle: 'Ouvrir la validité des cartes', aller: { commerce: { ecran: 'cartes' } }, ouvrir: 'validite', principal: true }, { libelle: 'Ouvrir les cartes du catalogue', aller: { vue: 'carte', onglet: 'catalogue' }, filtre: 'cadeau' }] }); }

  const toutes = rubriques.flatMap((r) => r.lignes).filter((l) => l.etat), compte = (k) => toutes.filter((l) => l.etat === k).length;
  return { rubriques, repere: { total: toutes.length, vide: compte('vide'), exemple: compte('exemple'), renseigne: compte('renseigne'), indisponible: compte('indisponible') },
    portee: connecte ? 'essai' : scenario ? 'demo' : 'navigateur' };
}

/** Le repère de relecture, en une phrase : il dit exactement ce qu'il compte (des valeurs relues, pas une progression). */
export function repereDit(r) {
  const parts = [[r.exemple, `${r.exemple} ${r.exemple > 1 ? 'valeurs d\'exemple' : 'valeur d\'exemple'} à confirmer`], [r.vide, `${r.vide} non ${r.vide > 1 ? 'renseignées' : 'renseignée'}`], [r.renseigne, `${r.renseigne} ${r.renseigne > 1 ? 'renseignées' : 'renseignée'}`], [r.indisponible, `${r.indisponible} non ${r.indisponible > 1 ? 'disponibles' : 'disponible'} dans ce mode`]].filter(([n]) => n).map(([, t]) => t);
  return `${pluriel(r.total, 'valeur')} ${r.total > 1 ? 'relues' : 'relue'} dans vos réglages : ${parts.join(', ')}.`;
}
