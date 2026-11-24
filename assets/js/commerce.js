/* Du catalogue à la remise au client (v7.14.0, consolidé en v7.14.1) : les commandes à emporter et les cartes cadeaux, en fonctions pures
   (testées par `node --test _audit/tests/*.test.mjs`). Le site et l'espace lisent les mêmes règles.

   Trois objets, bien séparés :
   - la COMMANDE À EMPORTER : née d'une demande du site, elle garde ses lignes (produit, quantité, unité, prix du moment) ;
     demande reçue → validée → en préparation → prête → retirée, ou refusée, ou annulée (avec un motif) ;
   - les CAPACITÉS : la production (une quantité par produit et par jour de retrait) et les retraits (un nombre de commandes
     par créneau). Elles n'ont rien à voir avec les tables du restaurant : une commande ne prend aucun couvert ;
   - la CARTE CADEAU : l'offre (catalogue), la demande, le règlement simulé, la carte émise (son code, sa valeur, son
     solde), ses utilisations. Une commande de deux cartes produit deux cartes distinctes.

   Rien ici n'est un paiement réel, un message envoyé ou une signature : les règlements sont des simulations notées par
   l'équipe, les codes sont des codes de démonstration. L'état est gardé dans ce navigateur (`S.commerce`) :
     { capacites: { production: { [offre]: n }, retraits: n, exemple }, validiteMois, exempleValidite,
       commandes: { [demande]: commande }, cadeaux: { [demande]: suivi }, cartes: { [id]: carte } }

   v7.14.1 : la PRODUCTION ENGAGÉE d'une commande est gardée à part de ses lignes (`commande.production.lots`) : corriger
   ce que le client retire, ou quand il le retire, ne réécrit jamais ce que l'équipe a déjà lancé en préparation. La
   PÉRIODE DES RETRAITS est un réglage (`S.commerce.retraits`), lu par le site et par l'espace avec la même règle. Une
   utilisation passée d'une carte se corrige même après son expiration, sans la réactiver. */
import { offresDeBase, offresDe } from './espace-publie.js?v=7';

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const net = (t, n = 200) => String(t ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
const arr = (n) => Math.round((+n || 0) * 100) / 100, arr3 = (n) => Math.round((+n || 0) * 1000) / 1000;
const nb = (n) => String(arr3(n)).replace('.', ',');
export const euros = (n) => `${String(arr(n)).replace('.', ',')} €`;
const NOMS_UNITE = { piece: ['pièce', 'pièces'], kilo: ['kg', 'kg'], formule: ['formule', 'formules'], personne: ['personne', 'personnes'], forfait: ['forfait', 'forfaits'], carte: ['carte', 'cartes'] };
/** Une quantité dite avec son unité : « 2 pièces », « 1,5 kg ». Sans unité connue, le nombre seul n'est jamais présenté comme des pièces. */
export const quantite = (q, unite) => { const u = NOMS_UNITE[unite]; return u ? `${nb(q)} ${+q > 1 ? u[1] : u[0]}` : `${nb(q)} (unité à préciser)`; };
const MOMENTS = { midi: 'à midi', soir: 'le soir' };
export const momentTexte = (m) => MOMENTS[m] || 'moment à préciser';
/* « 1er », comme on l'écrit : « jeudi 1er janvier », « du 1er au 15 ». */
const premier = (t) => String(t).replace(/(^|\s)1(?=\s|$)/, '$11er');
const jourTexte = (iso) => (ISO.test(iso || '') ? premier(new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`))) : 'date à préciser');
/* v7.15.0 : un instant dit en clair dans l'historique (« mercredi 25 novembre à 10 h », jamais « 2026-11-25T10:00 »). */
const instantTexte = (t) => { const x = String(t || ''), h = x.slice(11, 16); return `${jourTexte(x.slice(0, 10))}${/^\d{2}:\d{2}$/.test(h) ? ` à ${+h.slice(0, 2)} h${h.slice(3) === '00' ? '' : ` ${h.slice(3)}`}` : ''}`; };
export const retraitTexte = (c) => `${jourTexte(c.jour)}, ${momentTexte(c.moment)}`;
const commerce = (S) => (S.commerce ||= {});
const trace = (o, le, quoi, texte) => { (o.historique ||= []).push({ le: String(le || '').slice(0, 16), quoi, texte }); };

/* ====================================================================================================================
   Les commandes à emporter
   ==================================================================================================================== */
export const ETATS = { recue: 'Demande reçue', validee: 'Validée', preparation: 'En préparation', prete: 'Prête', retiree: 'Retirée', refusee: 'Refusée', annulee: 'Annulée' };
/** Le bon bouton au bon moment : l'étape suivante d'une commande, ou rien si elle est au bout. */
export const SUITES = { recue: { vers: 'validee', libelle: 'Valider la commande' }, validee: { vers: 'preparation', libelle: 'Lancer la préparation' }, preparation: { vers: 'prete', libelle: 'Marquer la commande prête' }, prete: { vers: 'retiree', libelle: 'Remettre au client' } };
export const PROCHAINE = { recue: 'À décider : valider ou refuser la demande.', validee: 'À préparer pour le retrait.', preparation: 'En cuisine : à marquer prête.', prete: 'Attend le client : à remettre au retrait.', retiree: 'Remise au client : plus rien à faire.', refusee: 'Refusée : plus rien à faire.', annulee: 'Annulée : plus rien à faire.' };
/* Ce qui compte dans les capacités : une commande validée, et elle seule, jusqu'à sa remise. */
const ENGAGEES = ['validee', 'preparation', 'prete', 'retiree'];
const STATUT = { recue: 'nouvelle', validee: 'confirmee', preparation: 'preparation', prete: 'prete', retiree: 'retiree', refusee: 'refusee', annulee: 'annulee' };
const DEPUIS_STATUT = { confirmee: 'validee', preparation: 'preparation', prete: 'prete', retiree: 'retiree', annulee: 'annulee', refusee: 'refusee' };
/** La référence d'une commande ou d'une demande : la même partout (site, espace, feuilles). */
export const reference = (id) => String(id || '').toUpperCase();

/** Toutes les offres à emporter que le restaurant a connues (livrées, publiées, en préparation) : pour relier une ancienne demande. */
function offresConnues(lieux, S) {
  const base = offresDeBase(lieux), l = [...offresDe(base, S?.publie?.offres), ...offresDe(base, S?.offres)], vus = new Map();
  for (const o of l) if (o.type === 'emporter') { const k = `${o.id}|${o.nom}`; if (!vus.has(k)) vus.set(k, o); }
  return [...vus.values()];
}
/**
 * Les lignes d'une demande venue du site. Une demande récente les porte déjà (produit, quantité, unité, prix du moment).
 * Une demande plus ancienne ne gardait que « 2 × Nom » et le total : la ligne est reliée à un produit seulement si un seul
 * produit porte exactement ce nom ; le prix n'est repris que s'il redonne exactement le total d'alors. Sinon, rien n'est
 * inventé : « lien au produit à préciser », « prix de l'époque non conservé ».
 */
export function lignesDeDemande(d, lieux, S) {
  if (Array.isArray(d.lignes) && d.lignes.length) return d.lignes.map((l) => ({ offre: String(l.offre || ''), nom: net(l.nom, 120), unite: NOMS_UNITE[l.unite] ? l.unite : '', prix: typeof l.prix === 'number' ? arr(l.prix) : null, quantite: arr3(l.quantite), total: typeof l.total === 'number' ? arr(l.total) : null, ...(l.detail ? { detail: net(l.detail, 60) } : {}) }));
  const connues = offresConnues(lieux, S);
  const l = (d.produits || []).map((x) => {
    const [nom, poids] = String(x.nom || '').split(' · '), kg = /^([\d.,]+)\s*kg$/i.exec(poids || ''), meme = connues.filter((o) => o.nom === nom), ids = new Set(meme.map((o) => o.id));
    const o = ids.size === 1 ? meme[0] : null, q = arr3((+x.qte || 0) * (kg ? parseFloat(kg[1].replace(',', '.')) : 1));
    return { offre: o ? o.id : '', nom: net(nom, 120), unite: kg ? 'kilo' : o ? o.unite : '', prix: null, quantite: q, total: null, ...(kg ? { detail: `${x.qte} × ${poids}` } : {}), _prix: o && typeof o.prix === 'number' ? o.prix : null };
  });
  const certain = l.length && l.every((x) => x._prix != null) && d.total != null && arr(l.reduce((s, x) => s + x._prix * x.quantite, 0)) === arr(d.total);
  return l.map(({ _prix, ...x }) => (certain ? { ...x, prix: _prix, total: arr(_prix * x.quantite) } : x));
}
/** La commande telle qu'elle est : celle que l'équipe a enregistrée, sinon la demande reçue, telle que le client l'a envoyée. */
export function commandeDe(d, S, lieux) {
  const c = S?.commerce?.commandes?.[d.id]; if (c) return { ...c, source: d.source || c.source };
  const b = d.brut || d;
  return { id: d.id, ref: reference(d.id), etat: 'recue', lignes: lignesDeDemande(b, lieux, S), total: b.total != null ? arr(b.total) : null, jour: b.jour || '', moment: b.moment || '', client: { prenom: net(b.prenom, 60), nom: net(b.nom, 60), telephone: net(b.telephone || b.tel, 30), email: net(b.email, 80) },
    remarque: net(b.remarque, 400), publication: b.publication ?? null, cree: b.cree || d.cree || '', historique: [{ le: String(b.cree || d.cree || '').slice(0, 16), quoi: 'recue', texte: 'Demande reçue depuis la page À emporter.' }], source: d.source || b.source || 'site' };
}
/** Toutes les commandes : celles des demandes reçues (`demandes` : la liste normalisée de l'espace), dans l'ordre du retrait. */
export function commandes(demandes, S, lieux) {
  return (demandes || []).filter((d) => d.genre === 'traiteur').map((d) => commandeDe(d, S, lieux)).sort((a, b) => `${a.jour}${a.moment === 'midi' ? 0 : 1}`.localeCompare(`${b.jour}${b.moment === 'midi' ? 0 : 1}`) || String(a.cree).localeCompare(String(b.cree)));
}
export const totalLignes = (lignes) => (lignes.every((l) => typeof l.prix === 'number') ? arr(lignes.reduce((s, l) => s + l.prix * l.quantite, 0)) : null);
export const nomClient = (c) => [c?.prenom, c?.nom].filter(Boolean).join(' ').trim() || 'Client à préciser';

/* ---------- Les capacités : la production (par produit et par jour) et les retraits (par créneau) ---------- */
/** Les capacités réglées. Une capacité non définie ne limite rien : elle est dite « non définie », jamais inventée. */
export function capacites(S) { const c = S?.commerce?.capacites || {}; return { production: c.production || {}, retraits: typeof c.retraits === 'number' ? c.retraits : null, exemple: !!c.exemple }; }
/* ---------- La production engagée (v7.14.1) ----------
   Trois informations, tenues séparées :
   - ce que le client doit recevoir : les lignes de la commande ;
   - quand il le retire : le jour et le créneau de la commande ;
   - ce que l'équipe a déjà engagé en préparation : des LOTS (produit, unité, quantité, jour de production), gardés dans
     `commande.production = { lots: [{ id, offre, nom, unite, jour, quantite, le, quoi }], aVerifier, rectifications }`.
   Corriger ou déplacer la commande ne réécrit jamais un lot ; seule une rectification explicite, motivée et tracée, le
   change. `quoi` : 'preparation' (au lancement), 'supplement' (ajout après le lancement), 'reprise' (commande d'avant la
   v7.14.1), 'ajout' (lot complété à la main par une rectification). */
const DEMARREES = ['preparation', 'prete', 'retiree'];
/* Une commande encore à honorer : ce qui lui manque en production reste RÉSERVÉ dans la capacité de son jour de retrait
   (v7.15.0 : aussi après le lancement, quand une rectification a ramené la production sous ce que le client retire). */
const ACTIVES = ['validee', 'preparation', 'prete'];
/** La préparation de cette commande a-t-elle commencé (elle a pu être annulée ensuite) ? */
export const preparationCommencee = (c) => !!c && (DEMARREES.includes(c.etat) || !!c.produite || !!c.production);
const lotsDeLignes = (c, le, quoi) => (c.lignes || []).map((l, i) => ({ id: `l${i + 1}`, offre: l.offre || '', nom: l.nom, unite: l.unite || '', jour: c.jour || '', quantite: arr3(l.quantite), le: String(le || '').slice(0, 16), quoi }));
/* Une commande corrigée après le début de sa préparation, avant la v7.14.1 : ses quantités ou son jour d'origine ont pu être écrasés. */
const corrigeeAvant = (c) => (c.historique || []).some((h) => h.quoi === 'correction');
const lanceeLe = (c) => (c.historique || []).find((h) => h.quoi === 'preparation')?.le || '';
/** Les lots de production d'une commande. Une commande d'avant la v7.14.1, pas encore reprise, est lue comme elle était comptée : ses lignes, à son jour. */
export function lotsDe(c) { return c?.production ? c.production.lots || [] : preparationCommencee(c) ? lotsDeLignes(c, lanceeLe(c), 'reprise') : []; }
/** La production de cette commande est-elle « à vérifier » (son historique ne permet pas de la reconstituer avec certitude) ? */
export const productionAVerifier = (c) => (c?.production ? !!c.production.aVerifier : preparationCommencee(c) && corrigeeAvant(c));
const cleProduit = (x) => x.offre || `nom:${x.nom}`;
const parProduit = (liste) => { const m = new Map(); for (const x of liste || []) { const k = cleProduit(x), y = m.get(k) || { offre: x.offre || '', nom: x.nom, unite: x.unite, quantite: 0 }; y.quantite = arr3(y.quantite + (+x.quantite || 0)); m.set(k, y); } return m; };
/** Une commande dont la préparation a commencé et à laquelle il manque de la production (après une rectification) : ce qui manque, produit par produit. Vide pour une commande terminée. */
export const manqueDe = (c) => (c && ['preparation', 'prete'].includes(c.etat) ? resteAProduire(c) : []);
/** Ce qu'il reste à lancer en production pour une commande : ses lignes, moins ce qui est déjà engagé pour elle, produit par produit. */
export function resteAProduire(c, lignes = c?.lignes) {
  const fait = parProduit(lotsDe(c));
  return [...parProduit(lignes).values()].map((x) => ({ ...x, quantite: Math.max(0, arr3(x.quantite - (fait.get(cleProduit(x))?.quantite || 0))) })).filter((x) => x.quantite > 0);
}
/**
 * Ce qui compte un jour donné. Pour un produit et un jour : les quantités RÉSERVÉES restant à produire (ce qui manque
 * encore à une commande validée, en préparation ou prête, à son jour de retrait : toute la commande avant le lancement,
 * le complément après une rectification) + les quantités ENGAGÉES en préparation (les lots, à leur jour de production). Le lancement fait passer d'une catégorie à l'autre : rien n'est compté deux fois.
 * Une demande non validée n'engage rien. Annulée avant la préparation, une commande libère tout ; annulée après, ses lots
 * restent comptés et son créneau de retrait est libéré. `sauf` : la commande que l'on modifie (sa réservation et son
 * créneau sont recalculés par l'appelant ; ses lots, eux, restent comptés : ils sont produits).
 */
export function engagements(S, jour, sauf = '') {
  const engagee = {}, reservee = {}, retraits = { midi: 0, soir: 0 }, aVerifier = [], plus = (o, k, q) => { o[k] = arr3((o[k] || 0) + q); };
  for (const c of Object.values(S?.commerce?.commandes || {})) {
    for (const l of lotsDe(c)) if (l.offre && l.jour === jour && l.quantite > 0) plus(engagee, l.offre, l.quantite);
    if (productionAVerifier(c)) aVerifier.push(c.ref);
    if (c.id === sauf || c.jour !== jour) continue;
    if (ACTIVES.includes(c.etat)) for (const r of resteAProduire(c)) if (r.offre) plus(reservee, r.offre, r.quantite);
    if (ENGAGEES.includes(c.etat) && c.moment) retraits[c.moment] = (retraits[c.moment] || 0) + 1;
  }
  const production = { ...engagee }; for (const [k, q] of Object.entries(reservee)) plus(production, k, q);
  return { production, engagee, reservee, retraits, aVerifier };
}
/**
 * Cette commande tient-elle dans les capacités de son jour de retrait ? `sauf` : la commande elle-même quand on la
 * modifie. Ce qui est demandé à la production, c'est seulement ce qui n'est pas déjà engagé pour elle (`demande` : le
 * supplément) ; ses lots restent comptés là où ils ont été produits. Renvoie { ok, refus: [phrases], production: [{
 * offre, nom, unite, aRemettre, dejaEngage, demande, engage, engagee, reservee, capacite, reste }], retrait, aVerifier }.
 */
export function disponibilite(S, { jour, moment, lignes = [], sauf = '' }) {
  const cap = capacites(S), e = engagements(S, jour, sauf), refus = [], production = [];
  const propre = sauf ? S?.commerce?.commandes?.[sauf] : null, deja = parProduit(propre ? lotsDe(propre) : []);
  for (const x of parProduit(lignes.filter((l) => l.offre)).values()) {
    const fait = deja.get(x.offre)?.quantite || 0, demande = Math.max(0, arr3(x.quantite - fait)), c = cap.production[x.offre], engage = e.production[x.offre] || 0;
    const ligne = { offre: x.offre, nom: x.nom, unite: x.unite, aRemettre: x.quantite, dejaEngage: fait, demande, engage, engagee: e.engagee[x.offre] || 0, reservee: e.reservee[x.offre] || 0 };
    if (typeof c !== 'number') { production.push({ ...ligne, capacite: null, reste: null }); continue; }
    const reste = Math.max(0, arr3(c - engage)); production.push({ ...ligne, capacite: c, reste });
    if (demande > reste) refus.push(reste > 0 ? `« ${x.nom} » : il ne reste que ${quantite(reste, x.unite)} à produire pour le ${jourTexte(jour)} (demande : ${quantite(demande, x.unite)}${fait ? ' en plus' : ''} ; capacité : ${quantite(c, x.unite)}).` : `« ${x.nom} » : la production du ${jourTexte(jour)} est complète (capacité ${quantite(c, x.unite)}).`);
  }
  const pris = moment ? e.retraits[moment] || 0 : 0, retrait = { engage: pris, capacite: cap.retraits, reste: cap.retraits == null ? null : Math.max(0, cap.retraits - pris) };
  if (cap.retraits != null && moment && pris >= cap.retraits) refus.push(`Les retraits du ${jourTexte(jour)}, ${momentTexte(moment)}, sont complets (${pris} sur ${cap.retraits}).`);
  return { ok: !refus.length, refus, production, retrait, aVerifier: e.aVerifier.filter((r) => r !== propre?.ref) };
}
/** Les créneaux de retrait complets un jour donné : ['soir'] ; vide si la capacité n'est pas définie. */
export function creneauxComplets(S, jour) { const cap = capacites(S).retraits, e = engagements(S, jour).retraits; return cap == null ? [] : ['midi', 'soir'].filter((m) => (e[m] || 0) >= cap); }

/**
 * Préparation et retraits d'un jour (et d'un créneau si on le précise). Par produit :
 * - ce que les clients retirent (`aRemettre`), réparti selon l'état des commandes : `aPreparer` (validées ou en
 *   préparation), `pret`, `remis` ;
 * - ce que l'équipe a engagé en production CE JOUR-LÀ (`engage` : les lots, y compris ceux d'une commande corrigée,
 *   déplacée ou annulée depuis), avec les `ecarts` quand ce qui est engagé n'est pas ce qui sera remis ce jour-là.
 * { produits: [{ offre, nom, unite, aRemettre, aPreparer, pret, remis, engage, capacite, commandes, ecarts }], commandes, aVerifier }.
 */
export function preparation(S, { jour = '', moment = '' } = {}) {
  const toutes = Object.values(S?.commerce?.commandes || {}), cap = capacites(S).production;
  const l = toutes.filter((c) => ENGAGEES.includes(c.etat) && (!jour || c.jour === jour) && (!moment || c.moment === moment));
  const par = new Map(), produit = (x) => { const k = cleProduit(x); if (!par.has(k)) par.set(k, { offre: x.offre || '', nom: x.nom, unite: x.unite, aRemettre: 0, aPreparer: 0, pret: 0, remis: 0, engage: 0, capacite: typeof cap[x.offre] === 'number' ? cap[x.offre] : null, commandes: [], ecarts: [] }); return par.get(k); };
  for (const c of l) for (const x of c.lignes || []) {
    const p = produit(x), ou = c.etat === 'retiree' ? 'remis' : c.etat === 'prete' ? 'pret' : 'aPreparer'; p[ou] = arr3(p[ou] + x.quantite); p.aRemettre = arr3(p.aRemettre + x.quantite); if (!p.commandes.includes(c.ref)) p.commandes.push(c.ref);
  }
  for (const c of toutes) {
    const tous = lotsDe(c).filter((x) => x.quantite > 0), lots = tous.filter((x) => !jour || x.jour === jour); if (!lots.length) continue;
    const remet = c.etat === 'annulee' ? new Map() : parProduit(c.lignes), total = parProduit(tous);
    for (const x of parProduit(lots).values()) {
      const p = produit(x), k = cleProduit(x), r = remet.get(k)?.quantite || 0; p.engage = arr3(p.engage + x.quantite);
      if (c.etat === 'annulee' || total.get(k).quantite !== r || lots.some((y) => cleProduit(y) === k && y.jour !== c.jour)) p.ecarts.push({ id: c.id, ref: c.ref, etat: c.etat, engage: x.quantite, aRemettre: r, manque: ACTIVES.includes(c.etat) ? Math.max(0, arr3(r - total.get(k).quantite)) : 0, retrait: c.jour, moment: c.moment, jours: [...new Set(lots.filter((y) => cleProduit(y) === k).map((y) => y.jour))] });
    }
  }
  return { produits: [...par.values()].sort((a, b) => a.nom.localeCompare(b.nom, 'fr')), commandes: l.sort((a, b) => `${a.jour}${a.moment === 'midi' ? 0 : 1}`.localeCompare(`${b.jour}${b.moment === 'midi' ? 0 : 1}`) || a.ref.localeCompare(b.ref)),
    aVerifier: toutes.filter(productionAVerifier).map((c) => ({ id: c.id, ref: c.ref })) };
}
/** Les jours où quelque chose est à préparer, à remettre ou déjà engagé en production. */
export function joursDeProduction(S) {
  const j = new Set(); for (const c of Object.values(S?.commerce?.commandes || {})) { if (ENGAGEES.includes(c.etat) && c.jour) j.add(c.jour); for (const l of lotsDe(c)) if (l.jour && l.quantite > 0) j.add(l.jour); }
  return [...j].sort();
}
/** Combien de commandes reprennent ce produit (pour dire ce qu'un archivage ne change pas). */
export const commandesDeOffre = (S, offre) => Object.values(S?.commerce?.commandes || {}).filter((c) => (c.lignes || []).some((l) => l.offre === offre)).length;

/** Les lignes saisies dans l'espace, mises au propre : [{ offre, nom, unite, prix, quantite, total }]. */
export function lignesPropres(lignes) {
  return (lignes || []).map((l) => { const q = arr3(l.quantite), prix = typeof l.prix === 'number' ? arr(l.prix) : null; return { offre: String(l.offre || ''), nom: net(l.nom, 120), unite: NOMS_UNITE[l.unite] ? l.unite : '', prix, quantite: q, total: prix == null ? null : arr(prix * q), ...(l.detail ? { detail: net(l.detail, 60) } : {}) }; }).filter((l) => l.nom && l.quantite > 0);
}
/**
 * Ce que change une modification, dit avant de l'enregistrer : produits, total, créneau. Avant la préparation, les
 * quantités sont « à préparer » ; après son lancement, elles sont « à remettre » : la production, elle, est dite à part
 * (`effetsProduction`).
 */
export function effetsModification(avant, apres) {
  const l = [], lancee = preparationCommencee(avant), mot = lancee ? 'à remettre' : 'à préparer', a = parProduit(avant.lignes), b = parProduit(apres.lignes);
  for (const [k, x] of b) { const o = a.get(k); if (!o) l.push(`Produit ajouté : ${x.nom}, ${quantite(x.quantite, x.unite)}.`); else if (o.quantite !== x.quantite) l.push(`${x.nom} : ${quantite(o.quantite, o.unite)} → ${quantite(x.quantite, x.unite)} ${mot}.`); }
  for (const [k, o] of a) if (!b.has(k)) l.push(lancee ? `Produit retiré de la commande : ${o.nom} (${quantite(o.quantite, o.unite)} ne seront pas remis).` : `Produit retiré : ${o.nom} (${quantite(o.quantite, o.unite)} ne sont plus à préparer).`);
  if (avant.jour !== apres.jour || avant.moment !== apres.moment) l.push(`Retrait : ${retraitTexte(avant)} → ${retraitTexte(apres)}.`);
  const ta = avant.total, tb = totalLignes(apres.lignes || []); if (tb != null && ta !== tb) l.push(`Total : ${ta == null ? 'non conservé' : euros(ta)} → ${euros(tb)}.`);
  if (net(avant.remarque, 400) !== net(apres.remarque, 400)) l.push('La remarque change.');
  return l;
}
/**
 * Ce qu'une correction fait à la production d'une commande dont la préparation a commencé :
 * `garde` : les phrases qui disent ce qui reste compté (un lot ne suit ni la quantité à remettre, ni le jour du retrait) ;
 * `supplement` : ce qu'il faut produire en plus, au nouveau jour de retrait (à contrôler dans les capacités) ;
 * `retour` : la commande était prête, elle repasse en préparation (le supplément n'est pas prêt tout seul).
 */
export function effetsProduction(c, apres) {
  if (!preparationCommencee(c) || ['retiree', 'refusee', 'annulee'].includes(c.etat)) return { garde: [], supplement: [], retour: false };
  const remet = parProduit(apres.lignes), tous = parProduit(lotsDe(c)), garde = [], vus = new Map();
  for (const x of lotsDe(c)) if (x.quantite > 0) { const k = `${cleProduit(x)}|${x.jour}`, y = vus.get(k) || { ...x, quantite: 0 }; y.quantite = arr3(y.quantite + x.quantite); vus.set(k, y); }
  for (const x of vus.values()) { const k = cleProduit(x), r = remet.get(k)?.quantite || 0, total = tous.get(k).quantite;
    if (total !== r || x.jour !== apres.jour) garde.push(`${x.nom} : la production déjà engagée le ${jourTexte(x.jour)} (${quantite(x.quantite, x.unite)}) reste comptée ce jour-là${total > r ? ` ; à remettre : ${r ? quantite(r, x.unite) : 'rien'}` : ''}.`); }
  /* Le supplément d'une correction : ce qu'elle ajoute à produire. Un complément déjà manquant (après une rectification)
     n'est pas engagé en passant : il reste réservé, jusqu'à ce que l'équipe l'engage. */
  const dejaManque = parProduit(resteAProduire(c));
  const supplement = resteAProduire(c, apres.lignes).map((x) => ({ ...x, jour: apres.jour, quantite: Math.max(0, arr3(x.quantite - (dejaManque.get(cleProduit(x))?.quantite || 0))) })).filter((x) => x.quantite > 0);
  return { garde, supplement, retour: c.etat === 'prete' && supplement.length > 0 };
}

/* ---------- La période des retraits (v7.14.1) ----------
   Un réglage de l'espace : `S.commerce.retraits = { debut, fin }` (bornes comprises). Sans réglage, la période livrée
   avec le site (`lieux.retraits`) s'applique. Rien n'est glissant : aucun jour ne s'ouvre tout seul. La même règle sert
   au calendrier du site, au dernier contrôle avant l'envoi, aux décisions de l'espace et aux phrases qui expliquent. */
const JOURS_SEMAINE = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const plusJours = (iso, n) => { const d = new Date(`${iso}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const dateExiste = (iso) => ISO.test(iso || '') && new Date(`${iso}T12:00:00Z`).toISOString().slice(0, 10) === iso;
const jourEntier = (iso) => (ISO.test(iso || '') ? premier(new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`))) : 'date à préciser');
/**
 * Les horaires qui décident des créneaux de retrait : la semaine telle que l'équipe l'a réglée (sinon celle du site) et
 * les fermetures exceptionnelles. `ctx` : { semaine, exceptions, connecte }. En mode connecté, les horaires viennent du
 * site d'essai : ce que ce navigateur a gardé d'une démonstration n'y est pas mêlé.
 */
export const ouvertureRetraits = (ctx = {}, S = {}) => ({ semaine: (!ctx.connecte && S.horaires?.semaine) || ctx.semaine || {}, fermetures: ctx.connecte ? [...(ctx.exceptions || [])] : [...(S.horaires?.exceptions || []), ...(ctx.exceptions || [])] });
/** La période des retraits en vigueur : celle réglée dans l'espace, sinon celle livrée avec le site. { debut, fin, reglee }. */
export function periodeRetraits(S, lieux) {
  const r = S?.commerce?.retraits, b = lieux?.retraits || {};
  return r && dateExiste(r.debut) && dateExiste(r.fin) && r.debut <= r.fin ? { debut: r.debut, fin: r.fin, reglee: true } : { debut: b.debut || '', fin: b.fin || '', reglee: false };
}
/** « du 5 au 31 décembre 2026 », « du 28 décembre 2026 au 10 janvier 2027 », « le 24 décembre 2026 ». */
export function periodeTexte(p) {
  if (!p?.debut || !p?.fin) return 'période à préciser'; if (p.debut === p.fin) return `le ${jourEntier(p.debut)}`;
  const f = (iso, o) => premier(new Intl.DateTimeFormat('fr-FR', { ...o, timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`))), memeAn = p.debut.slice(0, 4) === p.fin.slice(0, 4), memeMois = memeAn && p.debut.slice(5, 7) === p.fin.slice(5, 7);
  return `du ${memeMois ? f(p.debut, { day: 'numeric' }) : memeAn ? f(p.debut, { day: 'numeric', month: 'long' }) : jourEntier(p.debut)} au ${jourEntier(p.fin)}`;
}
/**
 * Les créneaux de retrait d'un jour, d'après les horaires de la maison (`ouverture` : { semaine, fermetures }) : midi
 * (un service qui commence avant 15 h), soir (à partir de 18 h). Un jour de fermeture exceptionnelle n'en a aucun.
 */
export function creneauxDuJour(ouverture, iso) {
  const o = ouverture || {}, f = (o.fermetures || []).find((x) => x && x.du <= iso && iso <= (x.au || x.du) && !(x.creneaux || []).length);
  if (f) return { midi: false, soir: false, motif: f.motif || 'Fermeture exceptionnelle' };
  const special = (o.fermetures || []).find((x) => x && x.du <= iso && iso <= (x.au || x.du) && (x.creneaux || []).length);
  const cr = special ? special.creneaux : (o.semaine || {})[JOURS_SEMAINE[new Date(`${iso}T12:00:00Z`).getUTCDay()]] || [];
  return { midi: cr.some((c) => String(c).slice(0, 5) < '15:00'), soir: cr.some((c) => String(c).slice(0, 5) >= '18:00'), motif: '' };
}
/**
 * Un retrait ce jour-là, à ce créneau, est-il possible ? '' si oui, sinon la phrase qui dit pourquoi. `auj` : la date de
 * référence (celle du scénario en démonstration) ; `delai` : le plus long délai de commande des produits choisis.
 * `moment` vide : on ne juge que le jour.
 */
export function refusRetrait(periode, ouverture, { jour, moment = '', auj = '', delai = 0 } = {}) {
  if (!dateExiste(jour)) return 'Le jour du retrait est à préciser.';
  if (!periode?.debut || !periode?.fin) return 'La période des retraits n\'est pas définie.';
  if (jour < periode.debut || jour > periode.fin) return `Le ${jourEntier(jour)} est hors de la période des retraits (${periodeTexte(periode)}).`;
  if (auj && jour < auj) return 'Ce jour de retrait est passé.';
  if (auj && delai > 0 && jour < plusJours(auj, delai)) return `Un produit de la commande se commande au moins ${delai} jour${delai > 1 ? 's' : ''} avant le retrait : le ${jourEntier(jour)} est trop proche.`;
  const c = creneauxDuJour(ouverture, jour);
  if (!c.midi && !c.soir) return c.motif ? `Le restaurant est fermé le ${jourEntier(jour)} (${c.motif}) : aucun retrait ce jour-là.` : `Le restaurant est fermé le ${jourTexte(jour)} : aucun retrait ce jour-là.`;
  if (moment && !c[moment]) return `Le ${jourTexte(jour)}, le restaurant n'est pas ouvert ${momentTexte(moment)} : choisissez l'autre créneau.`;
  return '';
}
/**
 * Le calendrier des retraits, jour par jour, sur toute la période : [{ iso, midi, soir, etat, pourquoi }], avec
 * `etat` : 'ouvert', 'ferme' (jour fermé), 'passe', 'delai' (trop proche pour les produits choisis), 'complet' (tous ses
 * créneaux sont pleins). `complets(iso)` : les créneaux déjà pleins ce jour-là (capacité de retrait).
 * `raison` dit pourquoi aucun retrait n'est possible : 'indefinie', 'terminee', 'aucun-jour', 'aucun-creneau', 'delai' ; '' sinon.
 */
export function calendrierRetraits(periode, ouverture, { auj = '', delai = 0, complets = () => [] } = {}) {
  const jours = []; if (!periode?.debut || !periode?.fin || periode.debut > periode.fin) return { jours, ouverts: 0, raison: 'indefinie', premier: '' };
  for (let iso = periode.debut, n = 0; iso <= periode.fin && n < 400; iso = plusJours(iso, 1), n++) {
    const c = creneauxDuJour(ouverture, iso), pleins = c.midi || c.soir ? complets(iso) || [] : [], midi = c.midi && !pleins.includes('midi'), soir = c.soir && !pleins.includes('soir');
    const etat = !c.midi && !c.soir ? 'ferme' : auj && iso < auj ? 'passe' : auj && delai > 0 && iso < plusJours(auj, delai) ? 'delai' : !midi && !soir ? 'complet' : 'ouvert';
    jours.push({ iso, midi, soir, prevus: { midi: c.midi, soir: c.soir }, etat, motif: c.motif || '' });
  }
  const ouverts = jours.filter((j) => j.etat === 'ouvert'), avenir = jours.filter((j) => j.etat !== 'passe' && (!auj || j.iso >= auj)), a = (e) => avenir.some((j) => j.etat === e);
  const raison = ouverts.length ? '' : !avenir.length ? 'terminee' : avenir.every((j) => j.etat === 'ferme') ? 'aucun-jour' : a('complet') ? 'aucun-creneau' : a('delai') ? 'delai' : 'aucun-jour';
  return { jours, ouverts: ouverts.length, raison, premier: ouverts[0]?.iso || '' };
}
/** La phrase qui explique, au client, pourquoi aucun retrait ne peut être choisi. */
export function raisonRetraitsTexte(raison, periode, delai = 0) {
  return ({ indefinie: 'La période des retraits n\'est pas encore annoncée.', terminee: `La période des retraits (${periodeTexte(periode)}) est terminée : les commandes à emporter ne sont plus prises pour l'instant.`,
    'aucun-jour': `Le restaurant est fermé pendant toute la période des retraits (${periodeTexte(periode)}) : aucun jour ne peut être proposé.`, 'aucun-creneau': 'Tous les créneaux de retrait sont complets : aucun jour ne peut plus être proposé.',
    delai: `Un produit de votre commande se commande au moins ${delai} jour${delai > 1 ? 's' : ''} avant le retrait : il ne reste aucun jour assez éloigné dans la période des retraits (${periodeTexte(periode)}).` })[raison] || '';
}

/* ====================================================================================================================
   Les cartes cadeaux
   ==================================================================================================================== */
export const ETATS_CADEAU = { recue: 'Demande reçue', validee: 'Validée', reglee: 'Réglée (simulation)', emise: 'Cartes émises', refusee: 'Refusée', annulee: 'Annulée', ancienne: 'Traitée avant le suivi des cartes' };
export const PROCHAINE_CADEAU = { recue: 'À décider : valider ou refuser la demande.', validee: 'Règlement simulé à enregistrer.', reglee: 'Cartes à émettre.', emise: 'Cartes émises : à remettre, puis à utiliser.', refusee: 'Refusée : plus rien à faire.', annulee: 'Annulée : plus rien à faire.', ancienne: 'Notée « carte envoyée » avant le suivi des cartes : aucune carte n\'a été émise ici.' };
const STATUT_CADEAU = { recue: 'nouvelle', validee: 'validee', reglee: 'reglee', emise: 'emise', refusee: 'refusee', annulee: 'annulee', ancienne: 'envoyee' };
export const ETATS_CARTE = { active: 'Active', epuisee: 'Épuisée', expiree: 'Expirée', desactivee: 'Désactivée' };

/**
 * L'offre qu'une demande de carte cadeau a choisie. Une demande récente la porte (identifiant stable, intitulé et version
 * publiée au moment du choix). Une demande plus ancienne ne gardait que le montant : elle est reliée seulement si la
 * correspondance est certaine (une carte livrée à ce montant, toujours à ce montant, et aucune autre offre à ce prix) ;
 * sinon, le lien reste « à préciser » : rien n'est deviné.
 */
export function lienOffreCadeau(d, lieux, S) {
  const b = d.brut || d; if (b.offre) return { offre: b.offre, intitule: b.intitule || 'Carte cadeau', publication: b.publication ?? null, certain: true };
  const base = offresDeBase(lieux), tous = [...offresDe(base, S?.publie?.offres), ...offresDe(base, S?.offres)].filter((o) => o.type === 'cadeau' && +o.prix === +b.montant), ids = new Set(tous.map((o) => o.id));
  const o = ids.size === 1 && base.some((x) => x.id === tous[0].id && +x.prix === +b.montant) ? tous[0] : null;
  return o ? { offre: o.id, intitule: o.nom, publication: null, certain: true } : { offre: '', intitule: '', publication: null, certain: false };
}
/** Le suivi d'une demande de carte cadeau : celui que l'équipe a enregistré, sinon la demande reçue telle qu'envoyée. */
export function cadeauDe(d, S, lieux) {
  const c = S?.commerce?.cadeaux?.[d.id]; if (c) return { ...c, source: d.source || c.source };
  const b = d.brut || d, lien = lienOffreCadeau(d, lieux, S), q = Math.max(1, Math.round(+b.quantite || 1)), a = b.acheteur || {};
  return { id: d.id, ref: reference(d.id), etat: 'recue', offre: lien.offre, intitule: lien.intitule, publication: lien.publication, lienCertain: lien.certain, montant: arr(b.montant), quantite: q, total: b.total != null ? arr(b.total) : arr(b.montant * q),
    pour: net(b.pour, 60), de: net(b.de, 60), mot: net(b.mot, 200), acheteur: { nom: net(a.nom, 80), telephone: net(a.telephone, 30), email: net(a.email, 80) }, reglement: null, cartes: [], cree: b.cree || d.cree || '',
    historique: [{ le: String(b.cree || d.cree || '').slice(0, 16), quoi: 'recue', texte: 'Demande reçue depuis la page Offrir.' }], source: d.source || b.source || 'site' };
}
export const cadeaux = (demandes, S, lieux) => (demandes || []).filter((d) => d.genre === 'cadeau').map((d) => cadeauDe(d, S, lieux)).sort((a, b) => String(b.cree).localeCompare(String(a.cree)));

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
/** Le code d'une carte : dérivé de son identifiant, toujours le même, et reconnaissable comme un code de démonstration. */
export function codeCarte(id, pris = []) {
  for (let essai = 0; essai < 50; essai++) {
    let h = 2166136261; for (const ch of `${id}#${essai}`) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
    let s = ''; for (let i = 0; i < 8; i++) { s += ALPHABET[h % ALPHABET.length]; h = Math.imul(h ^ (h >>> 13), 2654435761) >>> 0; }
    const code = `DEMO-${s.slice(0, 4)}-${s.slice(4)}`; if (!pris.includes(code)) return code;
  }
  return `DEMO-${String(id).replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(-8)}`;
}
/** Une date plus N mois (le dernier jour du mois si le quantième n'existe pas). */
export function ajouterMois(iso, n) { const [a, m, j] = iso.split('-').map(Number), d = new Date(Date.UTC(a, m - 1 + n, 1)), fin = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate(); d.setUTCDate(Math.min(j, fin)); return d.toISOString().slice(0, 10); }
/** Les utilisations d'une carte qui comptent (celles qui n'ont pas été annulées). */
export const utilisationsActives = (c) => (c?.utilisations || []).filter((u) => !u.annulee);
export const soldeCarte = (c) => arr((c?.valeur || 0) - utilisationsActives(c).reduce((s, u) => s + u.montant, 0));
/** L'état d'une carte, ce jour-là : désactivée, expirée (si une validité a été réglée), épuisée, sinon active. */
export function etatCarte(c, auj = '') { return c.desactivee ? 'desactivee' : c.expire && auj && c.expire < auj ? 'expiree' : soldeCarte(c) <= 0 ? 'epuisee' : 'active'; }
export const cartes = (S) => Object.values(S?.commerce?.cartes || {}).sort((a, b) => String(a.emise).localeCompare(String(b.emise)) || a.id.localeCompare(b.id));
/** Retrouve une carte par son code, écrit comme on veut (minuscules, espaces, sans tirets). */
export function carteParCode(S, saisie) { const n = (t) => String(t || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); const v = n(saisie); return v ? cartes(S).find((c) => n(c.code) === v || n(c.code) === `DEMO${v}`) || null : null; }
export const validite = (S) => { const v = S?.commerce?.validiteMois; return typeof v === 'number' && v > 0 ? { mois: v, exemple: !!S.commerce.exempleValidite } : null; };

/* ====================================================================================================================
   Aujourd'hui et la fiche du client
   ==================================================================================================================== */
/** Ce qui attend l'équipe aujourd'hui, côté traiteur et cadeaux. Rien de tout cela ne compte dans les couverts du restaurant. */
export function priorites(demandes, S, lieux, auj) {
  const cmd = commandes(demandes, S, lieux), cad = cadeaux(demandes, S, lieux);
  return {
    aDecider: cmd.filter((c) => c.etat === 'recue'),
    aPreparer: cmd.filter((c) => c.jour === auj && ['validee', 'preparation'].includes(c.etat)),
    pretes: cmd.filter((c) => c.etat === 'prete'),
    retraits: cmd.filter((c) => c.jour === auj && ENGAGEES.includes(c.etat)),
    cadeauxATraiter: cad.filter((c) => ['recue', 'validee'].includes(c.etat)),
    cartesAEmettre: cad.filter((c) => c.etat === 'reglee'),
    /* v7.15.0 : les commandes auxquelles il manque de la production (après une rectification) : un complément à engager. */
    aCompleter: cmd.filter((c) => manqueDe(c).length > 0),
    /* v7.14.1 : les commandes dont la production d'origine n'a pas pu être reprise avec certitude. */
    aVerifier: cmd.filter(productionAVerifier),
  };
}
const tel = (t) => String(t || '').replace(/\D/g, '').replace(/^33/, '0');
/**
 * Ce qui revient à un client dans sa fiche : ses commandes, les cadeaux qu'il a achetés, les cartes dont il est le
 * bénéficiaire. Le rattachement est sûr ou n'est pas : le téléphone ou l'e-mail du client, ou une association faite à la
 * main (`liens`). Un nom seul, une signature « De la part de » ou un prénom de bénéficiaire ne suffisent jamais.
 */
export function commerceDuClient(client, demandes, S, lieux) {
  const t = tel(client?.telephone), m = String(client?.email || '').toLowerCase().trim(), liens = S?.commerce?.liens || {};
  /* `client.demandes` : les demandes déjà rangées dans cette fiche par sa clé (son téléphone, ou la demande elle-même). */
  const siennes = new Set(client?.demandes || []), meme = (x) => (t && tel(x?.telephone) === t) || (m && String(x?.email || '').toLowerCase().trim() === m);
  const cmd = commandes(demandes, S, lieux).filter((c) => liens[`commande:${c.id}`] === client.id || (!liens[`commande:${c.id}`] && (siennes.has(c.id) || meme(c.client))));
  const cad = cadeaux(demandes, S, lieux).filter((c) => liens[`cadeau:${c.id}`] === client.id || (!liens[`cadeau:${c.id}`] && (siennes.has(c.id) || meme(c.acheteur))));
  const recues = cartes(S).filter((c) => liens[`carte:${c.id}`] === client.id);
  const achetees = cartes(S).filter((c) => cad.some((x) => x.id === c.demande));
  return { commandes: cmd, cadeaux: cad, cartesAchetees: achetees, cartesRecues: recues, utilisations: [...achetees, ...recues].filter((c, i, l) => l.indexOf(c) === i).flatMap((c) => (c.utilisations || []).map((u) => ({ ...u, carte: c.id, code: c.code }))) };
}

/* ====================================================================================================================
   Les actions (appliquées par le dépôt, après les règles `refusCommerce`)
   ==================================================================================================================== */
const statut = (S, id, s) => { ((S.demandes ||= {}).statuts ||= {})[id] = s; };
const commandeA = (S, id, base) => { const l = (commerce(S).commandes ||= {}); if (!l[id] && base) { const { source, ...b } = base; l[id] = JSON.parse(JSON.stringify({ ...b, id, ref: reference(id) })); } return l[id]; };
const cadeauA = (S, id, base) => { const l = (commerce(S).cadeaux ||= {}); if (!l[id] && base) { const { source, lienCertain, ...b } = base; l[id] = JSON.parse(JSON.stringify({ ...b, id, ref: reference(id) })); } return l[id]; };

/* Une rectification faite sur une carte expirée le dit : la carte ne redevient pas utilisable. */
const resteExpiree = (c, le) => (c.expire && String(le || '').slice(0, 10) > c.expire ? ` La carte reste expirée depuis le ${jourEntier(c.expire)} : son solde ne redevient pas utilisable, rien n'est remboursé.` : '');
const lotsTexte = (lots, avecJour = false) => (lots || []).filter((x) => x.quantite > 0).map((x) => `${x.nom}, ${quantite(x.quantite, x.unite)}${avecJour ? ` le ${jourTexte(x.jour)}` : ''}`).join(' ; ');
/* Donne ses lots à une commande d'avant la v7.14.1 (une seule fois). Renvoie true si quelque chose a été écrit. */
function reprendreProduction(c, le) {
  if (!c || c.production || !preparationCommencee(c)) return false;
  const flou = corrigeeAvant(c); c.production = { lots: lotsDeLignes(c, lanceeLe(c) || le, 'reprise'), ...(flou ? { aVerifier: true } : {}) }; c.produite = true;
  trace(c, le, 'reprise-production', flou ? 'Production historique à vérifier : cette commande a été corrigée après le début de sa préparation, avant que la production engagée soit gardée à part. Les quantités et le jour encore connus sont conservés ; ceux d\'origine ne sont pas reconstitués.' : `Production engagée reprise telle qu'elle était comptée : ${lotsTexte(c.production.lots, true) || 'aucune quantité'}.`);
  return true;
}
/** Une commande attend-elle sa reprise (production d'avant la v7.14.1) ? Pour ne lancer la reprise que s'il y a lieu. */
export const repriseProductionAFaire = (S) => Object.values(S?.commerce?.commandes || {}).some((c) => !c.production && preparationCommencee(c));

export const MUTATIONS_COMMERCE = {
  /** Valide une commande : elle entre dans les capacités de son jour de retrait (revérifiées juste avant, sur l'état frais). */
  cmdValider(S, { id, base, exception, le }) { const c = commandeA(S, id, base); if (!c || c.etat !== 'recue') return; c.etat = 'validee'; if (exception) c.horsPeriode = true; trace(c, le, 'validee', `Commande validée : retrait ${retraitTexte(c)}. Elle compte désormais dans la production et les retraits de ce jour.${exception ? ' Retrait accepté hors de la période ou des jours habituels, à titre exceptionnel.' : ''}`); statut(S, id, STATUT.validee); },
  cmdRefuser(S, { id, base, motif, le }) { const c = commandeA(S, id, base); if (!c || c.etat !== 'recue') return; c.etat = 'refusee'; c.motif = net(motif, 300); trace(c, le, 'refusee', `Demande refusée. Motif : ${c.motif}`); statut(S, id, STATUT.refusee); },
  /** Fait avancer une commande d'une étape : en préparation, prête, retirée. Le lancement de la préparation ENGAGE la
      production : les lignes du moment deviennent des lots, au jour pour lequel ils sont prévus (le jour du retrait à cet
      instant, pas l'heure du clic). « Prête » et « Retirée » n'engagent rien de plus. */
  cmdAvancer(S, { id, vers, le }) {
    const c = commerce(S).commandes?.[id]; if (!c || SUITES[c.etat]?.vers !== vers) return;
    c.etat = vers;
    if (vers === 'preparation') { c.produite = true; c.production ||= { lots: lotsDeLignes(c, le, 'preparation') }; }
    trace(c, le, vers, vers === 'preparation' ? `Préparation lancée. Engagé en production pour le ${jourTexte(c.jour)} : ${lotsTexte(c.production.lots) || 'aucune quantité'}.` : vers === 'prete' ? 'Commande prête : elle attend le client.' : 'Commande remise au client.'); statut(S, id, STATUT[vers]);
  },
  /** Annule une commande, avec son motif. Avant la préparation, tout est libéré ; après, les lots engagés restent comptés. */
  cmdAnnuler(S, { id, base, motif, le }) {
    const c = commandeA(S, id, base); if (!c || ['retiree', 'refusee', 'annulee'].includes(c.etat)) return;
    reprendreProduction(c, le);
    const avant = c.etat, lots = lotsDe(c).filter((x) => x.quantite > 0); c.etat = 'annulee'; c.motif = net(motif, 300);
    trace(c, le, 'annulee', `Commande annulée (elle était « ${ETATS[avant].toLowerCase()} »). Motif : ${c.motif}${lots.length ? ` La préparation avait commencé : la production engagée reste comptée (${lotsTexte(lots, true)}), le créneau de retrait est libéré.` : avant === 'recue' ? '' : ' La production et le créneau de retrait sont libérés.'}`); statut(S, id, STATUT.annulee);
  },
  /**
   * Modifie une commande : ses lignes, son retrait, sa remarque. Avant la préparation, le nouvel engagement remplace
   * l'ancien. Après son lancement, c'est une correction : ce qui est déjà engagé en production ne change pas ; seul un
   * supplément (une hausse, un produit ajouté) engage de nouveaux lots, au jour du retrait corrigé, et une commande prête
   * repasse alors en préparation. `exception` : l'équipe a choisi un retrait hors de la période ou d'un jour fermé.
   */
  cmdModifier(S, { id, base, lignes, jour, moment, remarque, motif, exception, le }) {
    const c = commandeA(S, id, base); if (!c || ['retiree', 'refusee', 'annulee'].includes(c.etat)) return;
    reprendreProduction(c, le);
    const apres = { lignes: lignes ? lignesPropres(lignes) : c.lignes, jour: jour ?? c.jour, moment: moment ?? c.moment, remarque: remarque ?? c.remarque }, effets = effetsModification(c, apres); if (!effets.length) return;
    const lancee = preparationCommencee(c), ep = effetsProduction(c, apres), bouge = apres.jour !== c.jour || apres.moment !== c.moment;
    c.lignes = apres.lignes; c.jour = apres.jour; c.moment = apres.moment; c.remarque = net(apres.remarque, 400); const t = totalLignes(c.lignes); if (t != null) c.total = t;
    if (bouge) { if (exception) c.horsPeriode = true; else delete c.horsPeriode; }
    for (const x of ep.supplement) c.production.lots.push({ id: `l${c.production.lots.length + 1}`, offre: x.offre, nom: x.nom, unite: x.unite || '', jour: c.jour, quantite: x.quantite, le: String(le || '').slice(0, 16), quoi: 'supplement' });
    if (ep.retour) { c.etat = 'preparation'; statut(S, id, STATUT.preparation); }
    trace(c, le, lancee ? 'correction' : 'modification', `${lancee ? 'Correction après le début de la préparation' : 'Commande modifiée'} : ${effets.join(' ')}${ep.garde.length ? ` Production conservée : ${ep.garde.join(' ')}` : ''}${ep.supplement.length ? ` Supplément engagé en production pour le ${jourTexte(c.jour)} : ${lotsTexte(ep.supplement)}.` : ''}${ep.retour ? ' La commande était prête : elle repasse en préparation, le supplément n\'est pas prêt.' : ''}${bouge && exception ? ' Retrait noté hors de la période ou des jours habituels, à titre exceptionnel.' : ''}${motif ? ` Motif : ${net(motif, 300)}` : ''}`);
  },
  /**
   * Rectifie la production enregistrée d'une commande (une erreur de saisie, un jour mal noté) : une action à part, avec
   * son motif, qui garde l'avant et l'après. `lot` : le lot rectifié ; vide, un lot est ajouté (production oubliée).
   * `op` : la clé de l'opération ; la même rectification renvoyée n'est appliquée qu'une fois.
   */
  cmdRectifier(S, { id, lot, offre, nom, unite, jour, quantite: q, motif, op, le }) {
    const c = commerce(S).commandes?.[id]; if (!c || !preparationCommencee(c)) return;
    reprendreProduction(c, le); const P = c.production, R = (P.rectifications ||= []); if (op && R.some((r) => r.op === op)) return;
    let x = P.lots.find((y) => y.id === lot), avant = null;
    if (x) avant = { jour: x.jour, quantite: x.quantite }; else { x = { id: `l${P.lots.length + 1}`, offre: String(offre || ''), nom: net(nom, 120), unite: NOMS_UNITE[unite] ? unite : '', jour: '', quantite: 0, le: String(le || '').slice(0, 16), quoi: 'ajout' }; P.lots.push(x); }
    x.jour = jour; x.quantite = arr3(q);
    R.push({ id: `r${R.length + 1}`, ...(op ? { op } : {}), le: String(le || '').slice(0, 16), lot: x.id, offre: x.offre, nom: x.nom, unite: x.unite, avant, apres: { jour: x.jour, quantite: x.quantite }, motif: net(motif, 300) });
    /* v7.15.0 : la commande doit rester cohérente. Si elle est encore à honorer et que la production engagée ne couvre
       plus ce que le client retire, le manque reste à produire (réservé au jour du retrait, aucun lot n'est inventé) et
       une commande prête repasse en préparation. Une commande retirée ou annulée garde son état : c'est de l'historique. */
    const manque = manqueDe(c), retour = c.etat === 'prete' && manque.length > 0; if (retour) { c.etat = 'preparation'; statut(S, id, STATUT.preparation); }
    trace(c, le, 'rectification', `Production rectifiée, ${x.nom} : ${avant ? `${quantite(avant.quantite, x.unite)} le ${jourTexte(avant.jour)}` : 'rien d\'enregistré'} → ${quantite(x.quantite, x.unite)} le ${jourTexte(x.jour)}. La commande du client ne change pas.${manque.length ? ` Il reste à produire pour l'honorer : ${lotsTexte(manque)} (réservé dans la capacité du ${jourTexte(c.jour)}).` : ''}${retour ? ' La commande était prête : elle repasse en préparation.' : ''} Motif : ${net(motif, 300)}`);
  },
  /**
   * Engage en production le complément qui manque à une commande (après une rectification) : ce qui était réservé au
   * jour du retrait devient un lot, ce même jour. Les mêmes pièces ne sont pas comptées deux fois. Renvoyée deux fois,
   * l'action n'a plus rien à engager.
   */
  cmdCompleter(S, { id, le }) {
    const c = commerce(S).commandes?.[id], manque = manqueDe(c); if (!c || !manque.length) return;
    for (const x of manque) c.production.lots.push({ id: `l${c.production.lots.length + 1}`, offre: x.offre, nom: x.nom, unite: x.unite || '', jour: c.jour, quantite: x.quantite, le: String(le || '').slice(0, 16), quoi: 'complement' });
    trace(c, le, 'complement', `Complément engagé en production pour le ${jourTexte(c.jour)} : ${lotsTexte(manque)}. La production engagée couvre de nouveau ce que le client retire.`);
  },
  /** Confirme la production d'une commande reprise « à vérifier » : les quantités et le jour enregistrés sont les bons. */
  cmdProductionVerifiee(S, { id, le }) {
    const c = commerce(S).commandes?.[id]; if (!c) return; reprendreProduction(c, le); if (!c.production?.aVerifier) return;
    delete c.production.aVerifier; trace(c, le, 'production-verifiee', `Production vérifiée par l'équipe : ${lotsTexte(c.production.lots.filter((x) => x.quantite > 0), true) || 'aucune quantité engagée'}.`);
  },
  /** Règle la période des retraits (bornes comprises). Vide : retour à la période livrée avec le site. Les commandes déjà acceptées ne bougent pas. */
  cmdRetraits(S, { debut, fin }) { const c = commerce(S); if (dateExiste(debut) && dateExiste(fin) && debut <= fin) c.retraits = { debut, fin }; else delete c.retraits; },
  /** Règle les capacités : une quantité par produit et par jour, un nombre de commandes par créneau de retrait. Vide : non définie. */
  cmdCapacites(S, { production, retraits, exemple }) {
    const c = (commerce(S).capacites ||= {});
    if (production) { c.production = Object.fromEntries(Object.entries({ ...(c.production || {}), ...production }).filter(([, v]) => typeof v === 'number' && v >= 0)); if (!Object.keys(c.production).length) delete c.production; }
    if (retraits !== undefined) { if (typeof retraits === 'number' && retraits >= 0) c.retraits = Math.round(retraits); else delete c.retraits; }
    if (exemple) c.exemple = true; else delete c.exemple;
    if (!Object.keys(c).length) delete S.commerce.capacites;
  },
  /**
   * Reprend les demandes traitées avant la v7.14.0 (une seule fois, sans rien inventer) : une commande « confirmée »
   * devient une commande validée avec ses lignes d'alors ; une carte cadeau notée « envoyée » est gardée comme telle,
   * sans règlement ni carte émise, car rien de cela n'avait été enregistré.
   */
  comReprendre(S, { commandes: l = [], cadeaux: g = [], le }) {
    for (const { id, statut: st, base } of l) { const etat = DEPUIS_STATUT[st]; if (!etat || commerce(S).commandes?.[id]) continue; const c = commandeA(S, id, base); c.etat = etat; if (['preparation', 'prete', 'retiree'].includes(etat)) c.produite = true; trace(c, le, 'reprise', `Commande reprise à l'étape « ${ETATS[etat].toLowerCase()} », telle qu'elle était suivie auparavant.`); reprendreProduction(c, le); }
    for (const { id, statut: st, base } of g) { if (st !== 'envoyee' || commerce(S).cadeaux?.[id]) continue; const c = cadeauA(S, id, base); c.etat = 'ancienne'; trace(c, le, 'reprise', 'Demande notée « carte envoyée » avant le suivi des cartes : aucun règlement ni aucune carte n\'avait été enregistré, rien n\'est ajouté.'); }
  },

  /**
   * Reprend la production des commandes suivies avant la v7.14.1 (une fois : une commande déjà reprise n'est plus touchée).
   * Sans correction dans son historique, ses lignes à son jour sont ce qui avait été lancé : elles deviennent ses lots.
   * Corrigée après le début de la préparation, ses quantités ou son jour d'origine ont pu être écrasés : ce qui est encore
   * connu est gardé, marqué « à vérifier », et rien n'est reconstitué.
   */
  comReprendreProduction(S, { le }) { for (const c of Object.values(commerce(S).commandes || {})) reprendreProduction(c, le); },

  /** Valide une demande de carte cadeau, avec l'acheteur à rappeler. */
  cadValider(S, { id, base, acheteur, le }) { const c = cadeauA(S, id, base); if (!c || c.etat !== 'recue') return; if (acheteur) c.acheteur = { nom: net(acheteur.nom, 80), telephone: net(acheteur.telephone, 30), email: net(acheteur.email, 80) }; c.etat = 'validee'; trace(c, le, 'validee', `Demande validée. Acheteur : ${[c.acheteur.nom, c.acheteur.telephone, c.acheteur.email].filter(Boolean).join(', ')}.`); statut(S, id, STATUT_CADEAU.validee); },
  cadRefuser(S, { id, base, motif, le }) { const c = cadeauA(S, id, base); if (!c || !['recue', 'validee'].includes(c.etat)) return; c.etat = 'refusee'; c.motif = net(motif, 300); trace(c, le, 'refusee', `Demande refusée. Motif : ${c.motif}`); statut(S, id, STATUT_CADEAU.refusee); },
  /** Note le règlement, simulé : rien n'est encaissé, c'est écrit tel quel. */
  cadRegler(S, { id, le }) { const c = commerce(S).cadeaux?.[id]; if (!c || c.etat !== 'validee') return; c.reglement = { le: String(le || '').slice(0, 16), montant: c.total, simule: true }; c.etat = 'reglee'; trace(c, le, 'reglee', `Règlement simulé enregistré : ${euros(c.total)}. Aucun paiement réel n'a eu lieu.`); statut(S, id, STATUT_CADEAU.reglee); },
  /** Émet les cartes d'une demande réglée : une carte distincte par exemplaire, chacune avec son code. Jamais deux fois. */
  cadEmettre(S, { id, le }) {
    const c = commerce(S).cadeaux?.[id]; if (!c || c.etat !== 'reglee' || (c.cartes || []).length) return;
    const tout = (commerce(S).cartes ||= {}), v = validite(S), jour = String(le || '').slice(0, 10);
    c.cartes = [];
    for (let k = 1; k <= c.quantite; k++) {
      const cid = `carte-${id}-${k}`;
      tout[cid] = { id: cid, code: codeCarte(cid, Object.values(tout).map((x) => x.code)), demande: id, rang: k, sur: c.quantite, offre: c.offre, intitule: c.intitule, valeur: c.montant, emise: String(le || '').slice(0, 16), expire: v && ISO.test(jour) ? ajouterMois(jour, v.mois) : null,
        pour: c.pour, de: c.de, mot: c.mot, acheteur: c.acheteur, utilisations: [], historique: [{ le: String(le || '').slice(0, 16), quoi: 'emise', texte: `Carte émise (${k} sur ${c.quantite}) : ${euros(c.montant)}. ${v ? `Valable jusqu'au ${jourTexte(ajouterMois(jour, v.mois))}.` : 'Validité non définie.'}` }] };
      c.cartes.push(cid);
    }
    c.etat = 'emise'; trace(c, le, 'emise', `${c.quantite > 1 ? `${c.quantite} cartes émises` : 'Carte émise'} : ${c.cartes.map((x) => tout[x].code).join(', ')}.`); statut(S, id, STATUT_CADEAU.emise);
  },
  cadAnnuler(S, { id, base, motif, le }) { const c = cadeauA(S, id, base); if (!c || !['recue', 'validee', 'reglee'].includes(c.etat)) return; const regle = c.etat === 'reglee'; c.etat = 'annulee'; c.motif = net(motif, 300); trace(c, le, 'annulee', `Demande annulée. Motif : ${c.motif}${regle ? ' Le règlement simulé est noté comme à rembourser : aucun remboursement réel n\'est fait ici.' : ''}`); statut(S, id, STATUT_CADEAU.annulee); },
  /** La validité des cartes émises à partir de maintenant, en mois ; vide : non définie. Les cartes déjà émises ne changent pas. */
  cadValidite(S, { mois, exemple }) { const c = commerce(S); if (typeof mois === 'number' && mois > 0) { c.validiteMois = Math.round(mois); if (exemple) c.exempleValidite = true; else delete c.exempleValidite; } else { delete c.validiteMois; delete c.exempleValidite; } },

  /** Utilise une carte, en partie ou en entier. `op` : la clé de l'opération (la même opération rejouée ne débite pas deux fois). */
  carteUtiliser(S, { carte, montant, ref, par, op, le }) {
    const c = commerce(S).cartes?.[carte]; if (!c || (op && c.utilisations.some((u) => u.op === op))) return;
    const m = arr(montant), u = { id: `u${c.utilisations.length + 1}`, le: String(le || '').slice(0, 16), montant: m, ref: net(ref, 80), par: net(par, 60), ...(op ? { op } : {}) };
    c.utilisations.push(u); trace(c, le, 'utilisation', `Utilisation de ${euros(m)}${u.ref ? ` (${u.ref})` : ''}${u.par ? `, notée par ${u.par}` : ''}. Solde : ${euros(soldeCarte(c))}.`);
  },
  /** Annule une utilisation, avec son motif : elle reste dans l'historique, barrée, et le solde est rétabli. */
  carteAnnulerUtilisation(S, { carte, utilisation, motif, par, le }) {
    const c = commerce(S).cartes?.[carte], u = c?.utilisations.find((x) => x.id === utilisation); if (!u || u.annulee) return;
    u.annulee = { le: String(le || '').slice(0, 16), motif: net(motif, 300), par: net(par, 60) }; trace(c, le, 'annulation', `Utilisation de ${euros(u.montant)} du ${instantTexte(u.le)} annulée. Motif : ${u.annulee.motif} Solde : ${euros(soldeCarte(c))}.${resteExpiree(c, le)}`);
  },
  /** Corrige une utilisation passée : l'ancienne est annulée (elle reste lisible), la nouvelle la remplace et le dit.
      C'est une rectification de l'historique : elle ne touche ni à la date d'expiration ni à l'état de la carte. */
  carteCorriger(S, { carte, utilisation, montant, motif, par, op, le }) {
    const c = commerce(S).cartes?.[carte], u = c?.utilisations.find((x) => x.id === utilisation); if (!u || u.annulee || (op && c.utilisations.some((x) => x.op === op))) return;
    const m = arr(montant), n = { id: `u${c.utilisations.length + 1}`, le: String(le || '').slice(0, 16), montant: m, ref: u.ref, par: net(par, 60), corrige: u.id, ...(op ? { op } : {}) };
    u.annulee = { le: n.le, motif: net(motif, 300), par: n.par, remplaceePar: n.id }; c.utilisations.push(n);
    trace(c, le, 'correction', `Utilisation du ${instantTexte(u.le)} corrigée : ${euros(u.montant)} → ${euros(m)}. Motif : ${u.annulee.motif} Solde : ${euros(soldeCarte(c))}.${resteExpiree(c, le)}`);
  },
  /** Désactive une carte (perdue, émise par erreur…) ou la réactive. Ses utilisations restent lisibles. */
  carteActiver(S, { carte, actif, motif, le }) {
    const c = commerce(S).cartes?.[carte]; if (!c) return;
    if (actif) { if (!c.desactivee) return; delete c.desactivee; trace(c, le, 'reactivee', 'Carte réactivée.'); } else { if (c.desactivee) return; c.desactivee = { le: String(le || '').slice(0, 16), motif: net(motif, 300) }; trace(c, le, 'desactivee', `Carte désactivée. Motif : ${c.desactivee.motif}`); }
  },
  /** Rattache à la main une commande, une demande de cadeau ou une carte reçue à une fiche client (ou retire ce lien). */
  comLier(S, { quoi, id, client }) { const l = (commerce(S).liens ||= {}), k = `${quoi}:${id}`; if (client) l[k] = String(client); else delete l[k]; if (!Object.keys(l).length) delete S.commerce.liens; },
};

/* L'état que produirait une rectification (calcul pur, pour juger les capacités avant d'écrire). */
function effetRectification(S, args) { const T = JSON.parse(JSON.stringify({ commerce: S.commerce || {}, demandes: S.demandes || {} })); MUTATIONS_COMMERCE.cmdRectifier(T, { ...args, op: '' }); return T; }
/**
 * Les règles consultées avant chaque action de commerce, sur l'état frais (celui que le navigateur vient de relire :
 * un autre onglet a pu agir entre-temps). '' si l'action peut se faire, sinon la phrase qui dit pourquoi.
 * `ctx` : { auj, lieux, ouverture } : le jour de l'espace (celui du scénario s'il y en a un), les données livrées (la
 * période de retrait de départ) et les horaires de la maison ({ semaine, fermetures }), pour juger un jour de retrait.
 */
export function refusCommerce(S, nom, args = {}, ctx = {}) {
  const auj = ctx.auj || '', K = S?.commerce || {};
  /* Un retrait hors de la période ou d'un jour fermé : l'équipe peut l'accepter, mais seulement par une décision explicite (`exception`). */
  const horsRetrait = (jour, moment) => (ctx.lieux || ctx.ouverture ? refusRetrait(periodeRetraits(S, ctx.lieux), ctx.ouverture, { jour, moment }) : '');
  if (nom === 'cmdRetraits') {
    const { debut, fin } = args; if (!debut && !fin) return '';
    if (!dateExiste(debut) || !dateExiste(fin)) return 'Écrivez les deux dates de la période, le premier et le dernier jour de retrait. Rien n\'a été changé.';
    if (debut > fin) return 'Le dernier jour de retrait est avant le premier : corrigez les dates. Rien n\'a été changé.';
    if (plusJours(debut, 366) < fin) return 'Une période de retrait couvre au plus un an : raccourcissez-la. Rien n\'a été changé.';
    return '';
  }
  if (nom === 'comReprendreProduction') return '';
  if (nom.startsWith('cmd') && nom !== 'cmdCapacites') {
    const c = K.commandes?.[args.id] || args.base; if (!c) return 'Cette commande est introuvable : elle a peut-être été effacée ailleurs.';
    const fini = ['retiree', 'refusee', 'annulee'].includes(c.etat), dit = `Cette commande est maintenant « ${ETATS[c.etat].toLowerCase()} » : l'écran a été mis à jour, rien d'autre n'a changé.`;
    if (nom === 'cmdValider') {
      if (c.etat !== 'recue') return dit;
      if (!c.lignes?.length) return 'Cette commande n\'a aucune ligne : ajoutez un produit avant de la valider.';
      if (!ISO.test(c.jour || '') || !MOMENTS[c.moment]) return 'Le jour et le créneau du retrait sont à préciser avant de valider.';
      if (auj && c.jour < auj) return `La date du retrait (${jourTexte(c.jour)}) est passée : modifiez-la avant de valider.`;
      const hors = horsRetrait(c.jour, c.moment); if (hors && !args.exception) return `${hors} La commande n'a pas été validée : convenez d'un autre retrait avec le client, refusez-la, ou acceptez ce retrait à titre exceptionnel.`;
      const d = disponibilite(S, { jour: c.jour, moment: c.moment, lignes: c.lignes, sauf: c.id }); if (!d.ok) return `${d.refus[0]} La commande n'a pas été validée.`;
      return '';
    }
    if (nom === 'cmdRefuser') return c.etat !== 'recue' ? dit : net(args.motif) ? '' : 'Écrivez le motif du refus : il est gardé dans l\'historique.';
    if (nom === 'cmdAvancer') {
      if (SUITES[c.etat]?.vers !== args.vers) return dit;
      /* v7.15.0 : ni « prête » ni « remise » tant qu'il manque de la production pour honorer la commande. */
      const manque = ['prete', 'retiree'].includes(args.vers) ? manqueDe(c) : [];
      return manque.length ? `Il reste à produire pour cette commande : ${lotsTexte(manque)}. Engagez le complément en production, ou corrigez ce que le client retire, avant de la ${args.vers === 'prete' ? 'marquer prête' : 'remettre'}.` : '';
    }
    if (nom === 'cmdCompleter') {
      if (!K.commandes?.[args.id] || !preparationCommencee(c)) return 'La préparation de cette commande n\'a pas commencé : il n\'y a pas de complément à engager.';
      if (fini) return dit;
      return manqueDe(c).length ? '' : 'La production engagée couvre déjà ce que le client retire : il n\'y a plus de complément à engager.';
    }
    if (nom === 'cmdAnnuler') return fini ? dit : net(args.motif) ? '' : 'Écrivez le motif de l\'annulation : il est gardé dans l\'historique.';
    if (nom === 'cmdModifier') {
      if (fini) return dit;
      const lignes = args.lignes ? lignesPropres(args.lignes) : c.lignes, jour = args.jour ?? c.jour, moment = args.moment ?? c.moment;
      if (!lignes.length) return 'Une commande garde au moins une ligne : pour tout retirer, annulez-la.';
      if (args.lignes && args.lignes.some((l) => !(+l.quantite > 0))) return 'Chaque quantité est un nombre plus grand que zéro.';
      if (!ISO.test(jour || '') || !MOMENTS[moment]) return 'Choisissez le jour et le créneau du retrait.';
      if (auj && jour < auj && jour !== c.jour) return 'Le nouveau jour de retrait est déjà passé.';
      if (preparationCommencee(c) && !net(args.motif)) return 'La préparation a commencé : écrivez le motif de cette correction, il est gardé dans l\'historique.';
      if (jour !== c.jour || moment !== c.moment) { const hors = horsRetrait(jour, moment); if (hors && !args.exception) return `${hors} La commande n'a pas été modifiée : choisissez un autre retrait, ou cochez le retrait exceptionnel.`; }
      /* Les capacités : avant la préparation, toute la commande ; après, seulement le supplément (ce qui est engagé le reste). */
      if (ENGAGEES.includes(c.etat)) { const d = disponibilite(S, { jour, moment, lignes, sauf: c.id }), memeCreneau = jour === c.jour && moment === c.moment, refus = d.refus.filter((r) => !(memeCreneau && r.startsWith('Les retraits du'))); if (refus.length) return `${refus[0]} La commande n'a pas été modifiée.`; }
      return '';
    }
    if (nom === 'cmdRectifier') {
      if (!K.commandes?.[args.id] || !preparationCommencee(c)) return 'La préparation de cette commande n\'a pas commencé : il n\'y a pas de production à rectifier.';
      const R = c.production?.rectifications || []; if (args.op && R.some((r) => r.op === args.op)) return 'Cette rectification est déjà enregistrée : elle n\'a pas été appliquée une seconde fois.';
      const lots = lotsDe(c), x = args.lot ? lots.find((y) => y.id === args.lot) : null;
      if (args.lot && !x) return 'Cette ligne de production est introuvable : l\'écran a été mis à jour, rien n\'a changé.';
      if (!x && !(args.offre && net(args.nom))) return 'Choisissez le produit concerné par la rectification.';
      if (!dateExiste(args.jour)) return 'Écrivez le jour de production concerné.';
      if (!(typeof args.quantite === 'number' && args.quantite >= 0)) return 'La quantité produite est un nombre, par exemple 4 ou 1,5 ; écrivez 0 si rien n\'a été produit.';
      if (!net(args.motif)) return 'Écrivez le motif de la rectification : il est gardé dans l\'historique, avec l\'avant et l\'après.';
      if (x && args.vu && (args.vu.jour !== x.jour || arr3(args.vu.quantite) !== x.quantite)) return `Cette production a changé ailleurs : elle est maintenant de ${quantite(x.quantite, x.unite)} le ${jourTexte(x.jour)}. Vérifiez, puis recommencez ; rien n'a été changé.`;
      const q = arr3(args.quantite); if (x && x.jour === args.jour && x.quantite === q) return 'Rien ne change : la quantité et le jour sont ceux déjà enregistrés.';
      if (!x && q <= 0) return 'Pour ajouter une production oubliée, écrivez une quantité plus grande que zéro.';
      /* La capacité est revérifiée sur l'état que la rectification produirait, les jours concernés : le lot (là où il
         était, là où il va) et, pour une commande encore à honorer, le complément qui resterait à produire au jour du
         retrait. Un jour n'est refusé que si la rectification y AJOUTE de la charge au-delà de sa capacité. */
      const offre = x ? x.offre : args.offre, unite = x ? x.unite : args.unite, cap = capacites(S).production[offre], nomP = x ? x.nom : net(args.nom);
      if (offre && typeof cap === 'number') {
        const apres = effetRectification(S, args);
        for (const j of [...new Set([x?.jour, args.jour, c.jour].filter(Boolean))]) {
          const a = engagements(S, j).production[offre] || 0, b = engagements(apres, j).production[offre] || 0;
          if (b > cap && b > a) return j === args.jour && (!x || args.jour !== x.jour || q > x.quantite)
            ? `« ${nomP} » : la capacité du ${jourTexte(j)} est de ${quantite(cap, unite)}, et la production déjà comptée ce jour-là est de ${quantite(arr3(a - (x && x.jour === j ? x.quantite : 0)), unite)}. Avec ${quantite(q, unite)} de plus, elle serait dépassée : rien n'a été changé.`
            : `« ${nomP} » : après cette rectification, il resterait ${quantite(arr3(b - a), unite)} de plus à produire pour le ${jourTexte(j)}, jour du retrait, où la capacité est de ${quantite(cap, unite)} (déjà ${quantite(a, unite)} comptés). Rien n'a été changé : corrigez d'abord ce que le client retire, ou le jour du retrait.`;
        }
      }
      return '';
    }
    if (nom === 'cmdProductionVerifiee') return productionAVerifier(c) ? '' : 'La production de cette commande n\'est pas à vérifier : rien n\'a changé.';
  }
  if (nom === 'cmdCapacites') { const p = Object.values(args.production || {}); return p.some((v) => v !== '' && v != null && !(typeof v === 'number' && v >= 0)) || (args.retraits != null && args.retraits !== '' && !(typeof args.retraits === 'number' && args.retraits >= 0)) ? 'Une capacité est un nombre positif ; laissez vide si elle n\'est pas définie.' : ''; }
  if (nom.startsWith('cad') && nom !== 'cadValidite') {
    const c = K.cadeaux?.[args.id] || args.base; if (!c) return 'Cette demande de carte cadeau est introuvable.';
    const dit = `Cette demande est maintenant « ${ETATS_CADEAU[c.etat].toLowerCase()} » : l'écran a été mis à jour, rien d'autre n'a changé.`;
    if (nom === 'cadValider') { if (c.etat !== 'recue') return dit; const a = args.acheteur || c.acheteur || {}; return net(a.nom) && (net(a.telephone) || net(a.email)) ? '' : 'Notez l\'acheteur (son nom, et un téléphone ou un e-mail) avant de valider : c\'est lui que l\'on rappelle.'; }
    if (nom === 'cadRefuser') return !['recue', 'validee'].includes(c.etat) ? dit : net(args.motif) ? '' : 'Écrivez le motif du refus : il est gardé dans l\'historique.';
    if (nom === 'cadRegler') return c.etat === 'validee' ? '' : c.etat === 'recue' ? 'Validez d\'abord la demande : le règlement s\'enregistre ensuite.' : dit;
    if (nom === 'cadEmettre') return c.etat === 'reglee' ? '' : c.etat === 'emise' ? 'Les cartes de cette demande sont déjà émises : aucune carte n\'a été créée une seconde fois.' : 'L\'émission est possible après la validation de la demande et l\'enregistrement du règlement simulé.';
    if (nom === 'cadAnnuler') return !['recue', 'validee', 'reglee'].includes(c.etat) ? (c.etat === 'emise' ? 'Les cartes sont émises : désactivez chaque carte concernée, la demande garde son historique.' : dit) : net(args.motif) ? '' : 'Écrivez le motif de l\'annulation : il est gardé dans l\'historique.';
  }
  if (nom === 'cadValidite') return args.mois === '' || args.mois == null || (typeof args.mois === 'number' && args.mois > 0 && args.mois <= 120) ? '' : 'La validité s\'écrit en mois, par exemple 6 ; laissez vide si elle n\'est pas définie.';
  if (nom.startsWith('carte')) {
    const c = K.cartes?.[args.carte]; if (!c) return 'Cette carte est introuvable : vérifiez son code.';
    const solde = soldeCarte(c), e = etatCarte(c, auj);
    /* Une NOUVELLE utilisation : seulement sur une carte active. */
    if (nom === 'carteUtiliser') {
      if (args.op && c.utilisations.some((u) => u.op === args.op)) return 'Cette opération est déjà enregistrée : rien n\'a été débité une seconde fois.';
      if (e === 'desactivee') return `Cette carte est désactivée (${c.desactivee.motif || 'sans motif noté'}) : elle ne peut pas être utilisée.`;
      if (e === 'expiree') return `Cette carte a expiré le ${jourTexte(c.expire)} : elle ne peut plus être utilisée.`;
      const m = arr(args.montant); if (!(typeof args.montant === 'number' && m > 0)) return 'Le montant utilisé est un nombre plus grand que zéro.';
      if (args.vu != null && arr(args.vu) !== solde) return `Le solde de cette carte a changé ailleurs : il est maintenant de ${euros(solde)}. Vérifiez, puis recommencez ; rien n'a été débité.`;
      if (e === 'epuisee') return 'Cette carte est épuisée : son solde est de 0 €.';
      return m > solde ? `Le solde de cette carte est de ${euros(solde)} : ${euros(m)} ne peuvent pas être utilisés. Rien n'a été débité.` : '';
    }
    /* Une RECTIFICATION de l'historique (corriger ou annuler une utilisation passée) : possible sur une carte active,
       épuisée ou expirée — elle ne change ni la date d'expiration ni l'état de la carte, et n'ouvre aucune nouvelle
       utilisation. Une carte désactivée est figée : on la réactive d'abord, par une décision explicite. */
    if (nom === 'carteCorriger' || nom === 'carteAnnulerUtilisation') {
      if (nom === 'carteCorriger' && args.op && c.utilisations.some((u) => u.op === args.op)) return 'Cette correction est déjà enregistrée : elle n\'a pas été appliquée une seconde fois.';
      const u = c.utilisations.find((x) => x.id === args.utilisation); if (!u || u.annulee) return `Cette utilisation a déjà été annulée ou corrigée : l'écran a été mis à jour, rien d'autre n'a changé.`;
      if (e === 'desactivee') return `Cette carte est désactivée (${c.desactivee.motif || 'sans motif noté'}) : son historique est figé. Réactivez-la d'abord pour rectifier une utilisation ; rien n'a été changé.`;
      if (!net(args.motif)) return nom === 'carteCorriger' ? 'Écrivez le motif de la correction : il est gardé dans l\'historique.' : 'Écrivez le motif de l\'annulation : il est gardé dans l\'historique.';
      if (nom === 'carteAnnulerUtilisation') return '';
      const m = arr(args.montant); if (!(typeof args.montant === 'number' && m > 0)) return 'Le montant corrigé est un nombre plus grand que zéro ; pour effacer l\'utilisation, annulez-la.';
      if (m === u.montant) return 'Le montant corrigé est le même que celui enregistré : rien n\'a été changé.';
      return m > arr(solde + u.montant) ? `Après correction, le montant dépasserait la valeur restante de la carte (${euros(arr(solde + u.montant))}). Rien n'a été changé.` : '';
    }
    if (nom === 'carteActiver') return args.actif ? '' : c.desactivee ? 'Cette carte est déjà désactivée.' : net(args.motif) ? '' : 'Écrivez le motif : il est gardé dans l\'historique de la carte.';
  }
  return '';
}
