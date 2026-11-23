/* Du catalogue à la remise au client (v7.14.0) : les commandes à emporter et les cartes cadeaux, en fonctions pures
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
       commandes: { [demande]: commande }, cadeaux: { [demande]: suivi }, cartes: { [id]: carte } } */
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
const jourTexte = (iso) => (ISO.test(iso || '') ? new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`)) : 'date à préciser');
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
/**
 * Ce qui est déjà engagé un jour de retrait. Une demande non validée n'engage rien ; une commande validée compte une
 * fois, jusqu'à sa remise ; annulée avant la préparation, elle libère tout ; annulée après (`produite`), ce qui a été
 * produit reste compté dans la production, et le créneau de retrait est libéré.
 */
export function engagements(S, jour, sauf = '') {
  const production = {}, retraits = { midi: 0, soir: 0 };
  for (const c of Object.values(S?.commerce?.commandes || {})) {
    if (c.id === sauf || c.jour !== jour) continue;
    const active = ENGAGEES.includes(c.etat);
    if (active || (c.etat === 'annulee' && c.produite)) for (const l of c.lignes || []) if (l.offre) production[l.offre] = arr3((production[l.offre] || 0) + l.quantite);
    if (active && c.moment) retraits[c.moment] = (retraits[c.moment] || 0) + 1;
  }
  return { production, retraits };
}
/**
 * Cette commande tient-elle dans les capacités de son jour de retrait ? `sauf` : la commande elle-même quand on la
 * modifie (son nouvel engagement remplace l'ancien). Renvoie { ok, refus: [phrases], production: [...], retrait }.
 */
export function disponibilite(S, { jour, moment, lignes = [], sauf = '' }) {
  const cap = capacites(S), e = engagements(S, jour, sauf), refus = [], production = [], voulu = new Map();
  for (const l of lignes) if (l.offre) { const x = voulu.get(l.offre) || { offre: l.offre, nom: l.nom, unite: l.unite, demande: 0 }; x.demande = arr3(x.demande + l.quantite); voulu.set(l.offre, x); }
  for (const x of voulu.values()) {
    const c = cap.production[x.offre]; if (typeof c !== 'number') { production.push({ ...x, engage: e.production[x.offre] || 0, capacite: null, reste: null }); continue; }
    const engage = e.production[x.offre] || 0, reste = Math.max(0, arr3(c - engage)); production.push({ ...x, engage, capacite: c, reste });
    if (x.demande > reste) refus.push(reste > 0 ? `« ${x.nom} » : il ne reste que ${quantite(reste, x.unite)} à produire pour le ${jourTexte(jour)} (${quantite(x.demande, x.unite)} demandés, capacité ${quantite(c, x.unite)}).` : `« ${x.nom} » : la production du ${jourTexte(jour)} est complète (capacité ${quantite(c, x.unite)}).`);
  }
  const pris = moment ? e.retraits[moment] || 0 : 0, retrait = { engage: pris, capacite: cap.retraits, reste: cap.retraits == null ? null : Math.max(0, cap.retraits - pris) };
  if (cap.retraits != null && moment && pris >= cap.retraits) refus.push(`Les retraits du ${jourTexte(jour)}, ${momentTexte(moment)}, sont complets (${pris} sur ${cap.retraits}).`);
  return { ok: !refus.length, refus, production, retrait };
}
/** Les créneaux de retrait complets un jour donné : ['soir'] ; vide si la capacité n'est pas définie. */
export function creneauxComplets(S, jour) { const cap = capacites(S).retraits, e = engagements(S, jour).retraits; return cap == null ? [] : ['midi', 'soir'].filter((m) => (e[m] || 0) >= cap); }

/**
 * Ce qu'il faut préparer : les quantités regroupées par produit, pour un jour (et un créneau si on le précise), à partir
 * des commandes validées. { produits: [{ offre, nom, unite, aPreparer, pret, remis, commandes }], commandes }.
 */
export function preparation(S, { jour = '', moment = '' } = {}) {
  const l = Object.values(S?.commerce?.commandes || {}).filter((c) => ENGAGEES.includes(c.etat) && (!jour || c.jour === jour) && (!moment || c.moment === moment));
  const par = new Map();
  for (const c of l) for (const x of c.lignes || []) {
    const k = x.offre || `nom:${x.nom}`, p = par.get(k) || { offre: x.offre, nom: x.nom, unite: x.unite, aPreparer: 0, pret: 0, remis: 0, commandes: [] };
    const ou = c.etat === 'retiree' ? 'remis' : c.etat === 'prete' ? 'pret' : 'aPreparer'; p[ou] = arr3(p[ou] + x.quantite); if (!p.commandes.includes(c.ref)) p.commandes.push(c.ref); par.set(k, p);
  }
  return { produits: [...par.values()].sort((a, b) => a.nom.localeCompare(b.nom, 'fr')), commandes: l.sort((a, b) => `${a.jour}${a.moment === 'midi' ? 0 : 1}`.localeCompare(`${b.jour}${b.moment === 'midi' ? 0 : 1}`) || a.ref.localeCompare(b.ref)) };
}
/** Combien de commandes reprennent ce produit (pour dire ce qu'un archivage ne change pas). */
export const commandesDeOffre = (S, offre) => Object.values(S?.commerce?.commandes || {}).filter((c) => (c.lignes || []).some((l) => l.offre === offre)).length;

/** Les lignes saisies dans l'espace, mises au propre : [{ offre, nom, unite, prix, quantite, total }]. */
export function lignesPropres(lignes) {
  return (lignes || []).map((l) => { const q = arr3(l.quantite), prix = typeof l.prix === 'number' ? arr(l.prix) : null; return { offre: String(l.offre || ''), nom: net(l.nom, 120), unite: NOMS_UNITE[l.unite] ? l.unite : '', prix, quantite: q, total: prix == null ? null : arr(prix * q), ...(l.detail ? { detail: net(l.detail, 60) } : {}) }; }).filter((l) => l.nom && l.quantite > 0);
}
/** Ce que change une modification, dit avant de l'enregistrer : produits, total, créneau, quantités à préparer. */
export function effetsModification(avant, apres) {
  const l = [], q = (c) => { const m = new Map(); for (const x of c.lignes || []) { const k = x.offre || x.nom, y = m.get(k) || { nom: x.nom, unite: x.unite, q: 0 }; y.q = arr3(y.q + x.quantite); m.set(k, y); } return m; }, a = q(avant), b = q(apres);
  for (const [k, x] of b) { const o = a.get(k); if (!o) l.push(`Produit ajouté : ${x.nom}, ${quantite(x.q, x.unite)}.`); else if (o.q !== x.q) l.push(`${x.nom} : ${quantite(o.q, o.unite)} → ${quantite(x.q, x.unite)} à préparer.`); }
  for (const [k, o] of a) if (!b.has(k)) l.push(`Produit retiré : ${o.nom} (${quantite(o.q, o.unite)} ne sont plus à préparer).`);
  if (avant.jour !== apres.jour || avant.moment !== apres.moment) l.push(`Retrait : ${retraitTexte(avant)} → ${retraitTexte(apres)}.`);
  const ta = avant.total, tb = totalLignes(apres.lignes || []); if (tb != null && ta !== tb) l.push(`Total : ${ta == null ? 'non conservé' : euros(ta)} → ${euros(tb)}.`);
  if (net(avant.remarque, 400) !== net(apres.remarque, 400)) l.push('La remarque change.');
  return l;
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

export const MUTATIONS_COMMERCE = {
  /** Valide une commande : elle entre dans les capacités de son jour de retrait (revérifiées juste avant, sur l'état frais). */
  cmdValider(S, { id, base, le }) { const c = commandeA(S, id, base); if (!c || c.etat !== 'recue') return; c.etat = 'validee'; trace(c, le, 'validee', `Commande validée : retrait ${retraitTexte(c)}. Elle compte désormais dans la production et les retraits de ce jour.`); statut(S, id, STATUT.validee); },
  cmdRefuser(S, { id, base, motif, le }) { const c = commandeA(S, id, base); if (!c || c.etat !== 'recue') return; c.etat = 'refusee'; c.motif = net(motif, 300); trace(c, le, 'refusee', `Demande refusée. Motif : ${c.motif}`); statut(S, id, STATUT.refusee); },
  /** Fait avancer une commande d'une étape : en préparation, prête, retirée. */
  cmdAvancer(S, { id, vers, le }) {
    const c = commerce(S).commandes?.[id]; if (!c || SUITES[c.etat]?.vers !== vers) return;
    c.etat = vers; if (vers === 'preparation') c.produite = true;
    trace(c, le, vers, vers === 'preparation' ? 'Préparation lancée.' : vers === 'prete' ? 'Commande prête : elle attend le client.' : 'Commande remise au client.'); statut(S, id, STATUT[vers]);
  },
  /** Annule une commande, avec son motif. Avant la préparation, tout est libéré ; après, ce qui a été produit reste compté. */
  cmdAnnuler(S, { id, base, motif, le }) {
    const c = commandeA(S, id, base); if (!c || ['retiree', 'refusee', 'annulee'].includes(c.etat)) return;
    const avant = c.etat; c.etat = 'annulee'; c.motif = net(motif, 300);
    trace(c, le, 'annulee', `Commande annulée (elle était « ${ETATS[avant].toLowerCase()} »). Motif : ${c.motif}${c.produite ? ' La préparation avait commencé : la production reste comptée, le créneau de retrait est libéré.' : avant === 'recue' ? '' : ' La production et le créneau de retrait sont libérés.'}`); statut(S, id, STATUT.annulee);
  },
  /** Modifie une commande : ses lignes, son retrait, sa remarque. Le nouvel engagement remplace l'ancien ; la trace dit ce qui a changé. */
  cmdModifier(S, { id, base, lignes, jour, moment, remarque, motif, le }) {
    const c = commandeA(S, id, base); if (!c || ['retiree', 'refusee', 'annulee'].includes(c.etat)) return;
    const apres = { lignes: lignes ? lignesPropres(lignes) : c.lignes, jour: jour ?? c.jour, moment: moment ?? c.moment, remarque: remarque ?? c.remarque }, effets = effetsModification(c, apres); if (!effets.length) return;
    c.lignes = apres.lignes; c.jour = apres.jour; c.moment = apres.moment; c.remarque = net(apres.remarque, 400); const t = totalLignes(c.lignes); if (t != null) c.total = t;
    trace(c, le, c.produite ? 'correction' : 'modification', `${c.produite ? 'Correction après le début de la préparation' : 'Commande modifiée'} : ${effets.join(' ')}${motif ? ` Motif : ${net(motif, 300)}` : ''}`);
  },
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
    for (const { id, statut: st, base } of l) { const etat = DEPUIS_STATUT[st]; if (!etat || commerce(S).commandes?.[id]) continue; const c = commandeA(S, id, base); c.etat = etat; if (['preparation', 'prete', 'retiree'].includes(etat)) c.produite = true; trace(c, le, 'reprise', `Commande reprise à l'étape « ${ETATS[etat].toLowerCase()} », telle qu'elle était suivie auparavant.`); }
    for (const { id, statut: st, base } of g) { if (st !== 'envoyee' || commerce(S).cadeaux?.[id]) continue; const c = cadeauA(S, id, base); c.etat = 'ancienne'; trace(c, le, 'reprise', 'Demande notée « carte envoyée » avant le suivi des cartes : aucun règlement ni aucune carte n\'avait été enregistré, rien n\'est ajouté.'); }
  },

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
    u.annulee = { le: String(le || '').slice(0, 16), motif: net(motif, 300), par: net(par, 60) }; trace(c, le, 'annulation', `Utilisation de ${euros(u.montant)} du ${u.le.replace('T', ' à ')} annulée. Motif : ${u.annulee.motif} Solde : ${euros(soldeCarte(c))}.`);
  },
  /** Corrige une utilisation : l'ancienne est annulée (elle reste lisible), la nouvelle la remplace et le dit. */
  carteCorriger(S, { carte, utilisation, montant, motif, par, op, le }) {
    const c = commerce(S).cartes?.[carte], u = c?.utilisations.find((x) => x.id === utilisation); if (!u || u.annulee || (op && c.utilisations.some((x) => x.op === op))) return;
    const m = arr(montant), n = { id: `u${c.utilisations.length + 1}`, le: String(le || '').slice(0, 16), montant: m, ref: u.ref, par: net(par, 60), corrige: u.id, ...(op ? { op } : {}) };
    u.annulee = { le: n.le, motif: net(motif, 300), par: n.par, remplaceePar: n.id }; c.utilisations.push(n);
    trace(c, le, 'correction', `Utilisation corrigée : ${euros(u.montant)} → ${euros(m)}. Motif : ${u.annulee.motif} Solde : ${euros(soldeCarte(c))}.`);
  },
  /** Désactive une carte (perdue, émise par erreur…) ou la réactive. Ses utilisations restent lisibles. */
  carteActiver(S, { carte, actif, motif, le }) {
    const c = commerce(S).cartes?.[carte]; if (!c) return;
    if (actif) { if (!c.desactivee) return; delete c.desactivee; trace(c, le, 'reactivee', 'Carte réactivée.'); } else { if (c.desactivee) return; c.desactivee = { le: String(le || '').slice(0, 16), motif: net(motif, 300) }; trace(c, le, 'desactivee', `Carte désactivée. Motif : ${c.desactivee.motif}`); }
  },
  /** Rattache à la main une commande, une demande de cadeau ou une carte reçue à une fiche client (ou retire ce lien). */
  comLier(S, { quoi, id, client }) { const l = (commerce(S).liens ||= {}), k = `${quoi}:${id}`; if (client) l[k] = String(client); else delete l[k]; if (!Object.keys(l).length) delete S.commerce.liens; },
};

/**
 * Les règles consultées avant chaque action de commerce, sur l'état frais (celui que le navigateur vient de relire :
 * un autre onglet a pu agir entre-temps). '' si l'action peut se faire, sinon la phrase qui dit pourquoi.
 * `ctx` : { auj } (le jour de l'espace, celui du scénario s'il y en a un).
 */
export function refusCommerce(S, nom, args = {}, ctx = {}) {
  const auj = ctx.auj || '', K = S?.commerce || {};
  if (nom.startsWith('cmd') && nom !== 'cmdCapacites') {
    const c = K.commandes?.[args.id] || args.base; if (!c) return 'Cette commande est introuvable : elle a peut-être été effacée ailleurs.';
    const fini = ['retiree', 'refusee', 'annulee'].includes(c.etat), dit = `Cette commande est maintenant « ${ETATS[c.etat].toLowerCase()} » : l'écran a été mis à jour, rien d'autre n'a changé.`;
    if (nom === 'cmdValider') {
      if (c.etat !== 'recue') return dit;
      if (!c.lignes?.length) return 'Cette commande n\'a aucune ligne : ajoutez un produit avant de la valider.';
      if (!ISO.test(c.jour || '') || !MOMENTS[c.moment]) return 'Le jour et le créneau du retrait sont à préciser avant de valider.';
      if (auj && c.jour < auj) return `La date du retrait (${jourTexte(c.jour)}) est passée : modifiez-la avant de valider.`;
      const d = disponibilite(S, { jour: c.jour, moment: c.moment, lignes: c.lignes, sauf: c.id }); if (!d.ok) return `${d.refus[0]} La commande n'a pas été validée.`;
      return '';
    }
    if (nom === 'cmdRefuser') return c.etat !== 'recue' ? dit : net(args.motif) ? '' : 'Écrivez le motif du refus : il est gardé dans l\'historique.';
    if (nom === 'cmdAvancer') return SUITES[c.etat]?.vers === args.vers ? '' : dit;
    if (nom === 'cmdAnnuler') return fini ? dit : net(args.motif) ? '' : 'Écrivez le motif de l\'annulation : il est gardé dans l\'historique.';
    if (nom === 'cmdModifier') {
      if (fini) return dit;
      const lignes = args.lignes ? lignesPropres(args.lignes) : c.lignes, jour = args.jour ?? c.jour, moment = args.moment ?? c.moment;
      if (!lignes.length) return 'Une commande garde au moins une ligne : pour tout retirer, annulez-la.';
      if (args.lignes && args.lignes.some((l) => !(+l.quantite > 0))) return 'Chaque quantité est un nombre plus grand que zéro.';
      if (!ISO.test(jour || '') || !MOMENTS[moment]) return 'Choisissez le jour et le créneau du retrait.';
      if (auj && jour < auj && jour !== c.jour) return 'Le nouveau jour de retrait est déjà passé.';
      if (c.produite && !net(args.motif)) return 'La préparation a commencé : écrivez le motif de cette correction, il est gardé dans l\'historique.';
      if (ENGAGEES.includes(c.etat)) { const d = disponibilite(S, { jour, moment, lignes, sauf: c.id }); if (!d.ok) return `${d.refus[0]} La commande n'a pas été modifiée.`; }
      return '';
    }
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
    if (nom === 'carteUtiliser' || nom === 'carteCorriger') {
      if (args.op && c.utilisations.some((u) => u.op === args.op)) return 'Cette opération est déjà enregistrée : rien n\'a été débité une seconde fois.';
      if (e === 'desactivee') return `Cette carte est désactivée (${c.desactivee.motif || 'sans motif noté'}) : elle ne peut pas être utilisée.`;
      if (e === 'expiree') return `Cette carte a expiré le ${jourTexte(c.expire)} : elle ne peut plus être utilisée.`;
      const m = arr(args.montant); if (!(typeof args.montant === 'number' && m > 0)) return 'Le montant utilisé est un nombre plus grand que zéro.';
      if (args.vu != null && arr(args.vu) !== solde) return `Le solde de cette carte a changé ailleurs : il est maintenant de ${euros(solde)}. Vérifiez, puis recommencez ; rien n'a été débité.`;
      if (nom === 'carteUtiliser') { if (e === 'epuisee') return 'Cette carte est épuisée : son solde est de 0 €.'; return m > solde ? `Le solde de cette carte est de ${euros(solde)} : ${euros(m)} ne peuvent pas être utilisés. Rien n'a été débité.` : ''; }
      const u = c.utilisations.find((x) => x.id === args.utilisation); if (!u || u.annulee) return 'Cette utilisation a déjà été annulée ou corrigée : l\'écran a été mis à jour.';
      if (!net(args.motif)) return 'Écrivez le motif de la correction : il est gardé dans l\'historique.';
      return m > arr(solde + u.montant) ? `Après correction, le montant dépasserait la valeur restante (${euros(arr(solde + u.montant))}). Rien n'a été changé.` : '';
    }
    if (nom === 'carteAnnulerUtilisation') { const u = c.utilisations.find((x) => x.id === args.utilisation); return !u || u.annulee ? 'Cette utilisation a déjà été annulée : l\'écran a été mis à jour.' : net(args.motif) ? '' : 'Écrivez le motif de l\'annulation : il est gardé dans l\'historique.'; }
    if (nom === 'carteActiver') return args.actif ? '' : c.desactivee ? 'Cette carte est déjà désactivée.' : net(args.motif) ? '' : 'Écrivez le motif : il est gardé dans l\'historique de la carte.';
  }
  return '';
}
