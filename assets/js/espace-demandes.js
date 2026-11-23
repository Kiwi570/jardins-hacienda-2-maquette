/* Les demandes de l'espace restaurateur (v7.7.2) : tout ce que le site envoie arrive dans une seule liste.
   Fonctions pures, sans page ni stockage (testées par `node --test _audit/tests/*.test.mjs`).
   Cinq genres : la table (réservation à confirmer, espace-regles.js), la réception (mariage, anniversaire… suivie par
   étapes jusqu'à la signature), la commande traiteur, la carte cadeau, la question. Chaque demande a une étape, que le
   restaurateur fait avancer d'un geste ; « nouvelle » veut dire : elle attend une réponse.
   Et les messages envoyés aux clients : un modèle par situation, que le restaurant peut retoucher. */
import { ajouter, jourDe, fmt, maj, heure, pluriel, typo, aConfirmer, telephoneDemo } from './espace-regles.js?v=7';

export const GENRES = {
  table: { nom: 'Table', plusieurs: 'Tables' },
  reception: { nom: 'Réception', plusieurs: 'Réceptions', etapes: [['nouvelle', 'Nouvelle'], ['rappele', 'Rappelé'], ['visite', 'Visite faite'], ['devis', 'Devis envoyé'], ['signe', 'Signé']], fin: ['perdue', 'Sans suite'],
    suite: { nouvelle: 'J\'ai rappelé', rappele: 'Visite faite', visite: 'Devis envoyé', devis: 'C\'est signé' } },
  /* v7.14.0 : la commande à emporter et la carte cadeau se suivent dans leur dossier (commerce.js) ; l'étape montrée ici en découle. */
  traiteur: { nom: 'Traiteur', plusieurs: 'Traiteur', etapes: [['nouvelle', 'Demande reçue'], ['confirmee', 'Validée'], ['preparation', 'En préparation'], ['prete', 'Prête'], ['retiree', 'Retirée'], ['refusee', 'Refusée']], fin: ['annulee', 'Annulée'] },
  cadeau: { nom: 'Carte cadeau', plusieurs: 'Cartes cadeaux', etapes: [['nouvelle', 'Demande reçue'], ['validee', 'Validée'], ['reglee', 'Réglée (simulation)'], ['emise', 'Cartes émises'], ['envoyee', 'Envoyée (ancien suivi)'], ['refusee', 'Refusée'], ['annulee', 'Annulée']] },
  question: { nom: 'Question', plusieurs: 'Questions', etapes: [['nouvelle', 'Nouvelle'], ['repondue', 'Répondue']], suite: { nouvelle: 'J\'ai répondu' } },
};
export const libelleEtape = (genre, statut) => [...(GENRES[genre]?.etapes || []), GENRES[genre]?.fin].filter(Boolean).find(([id]) => id === statut)?.[1] || 'Nouvelle';
/** L'étape suivante d'une demande : { statut, libelle } ou null si elle est au bout. */
export function suite(genre, statut) {
  const g = GENRES[genre], l = g?.etapes || [], i = l.findIndex(([id]) => id === statut);
  return i >= 0 && i < l.length - 1 && g.suite?.[statut] ? { statut: l[i + 1][0], libelle: g.suite[statut] } : null;
}
const euros = (n) => `${String(Math.round(n * 100) / 100).replace('.', ',')} €`;
const jourLong = (iso) => fmt(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
/** « aujourd'hui », « hier », « il y a 3 jours » : depuis quand la demande attend. */
export function recue(cree, auj) {
  const j = Math.round((Date.parse(`${auj}T12:00:00Z`) - Date.parse(`${String(cree).slice(0, 10)}T12:00:00Z`)) / 86400000);
  return j <= 0 ? 'aujourd\'hui' : j === 1 ? 'hier' : `il y a ${j} jours`;
}

/* Démonstration : quelques demandes inventées, marquées « Exemple » à l'écran ; aucune n'est réelle.
   Les produits de la commande sont ceux de la page Traiteur (noms et prix du site). */
export function demandesDemo(auj, produits = []) {
  let mariage = ajouter(auj, 200); mariage = ajouter(mariage, (6 - jourDe(mariage) + 7) % 7);
  const p = produits.slice(0, 2), lignes = p.map((x, i) => ({ nom: x.nom, qte: i ? 1 : 2, prix: x.prix }));
  let retrait = ajouter(auj, 9); retrait = ajouter(retrait, (6 - jourDe(retrait) + 7) % 7);
  return [
    { id: 'demo-reception-1', genre: 'reception', cree: `${ajouter(auj, -1)}T18:40:00`, occasion: 'Un mariage', date: mariage, invites: '120', espace: 'Salle de réception', message: 'Vin d\'honneur au bord de la piscine, si le temps le permet.', prenom: 'Camille', nom: 'R.', telephone: telephoneDemo('Camille R.'), email: 'camille@exemple.fr' },
    { id: 'demo-reception-2', genre: 'reception', cree: `${ajouter(auj, -9)}T11:05:00`, occasion: 'Un anniversaire', periode: 'Printemps 2027', invites: '40', espace: 'Terrasse', message: '', prenom: 'Thomas', nom: 'B.', telephone: telephoneDemo('Thomas B.'), email: 'thomas@exemple.fr', statut: 'visite' },
    { id: 'demo-reception-3', genre: 'reception', cree: `${ajouter(auj, -16)}T09:30:00`, occasion: 'Un baptême', periode: 'Été 2027', invites: '35', espace: 'À voir ensemble', message: '', prenom: 'Sophie', nom: 'L.', telephone: telephoneDemo('Sophie L.'), email: 'sophie@exemple.fr', statut: 'devis' },
    ...(lignes.length ? [{ id: 'demo-traiteur-1', genre: 'traiteur', cree: `${auj}T08:15:00`, produits: lignes.map(({ nom, qte }) => ({ nom, qte })), total: lignes.reduce((n, l) => n + l.qte * l.prix, 0), jour: retrait, jourLibelle: fmt(retrait), moment: 'soir', prenom: 'Julien', nom: 'M.', telephone: telephoneDemo('Julien M.'), email: 'julien@exemple.fr' }] : []),
    { id: 'demo-cadeau-1', genre: 'cadeau', cree: `${ajouter(auj, -2)}T20:10:00`, montant: 100, quantite: 1, total: 100, pour: 'Léa', de: 'Hugo S.', mot: 'Joyeux anniversaire !' },
    { id: 'demo-question-1', genre: 'question', cree: `${ajouter(auj, -1)}T14:22:00`, sujet: 'Une allergie', message: 'Avez-vous des plats sans gluten ? Nous serions quatre samedi midi.', prenom: 'Claire', nom: 'D.', telephone: telephoneDemo('Claire D.'), email: 'claire@exemple.fr' },
  ].map((d) => ({ ...d, source: 'demo' }));
}

/** Une demande brute (du site ou de démonstration), mise à la forme de la liste : qui, un titre d'une ligne, les détails. */
export function normaliser(d) {
  const qui = [d.prenom, d.nom].filter(Boolean).join(' ').trim(), L = [];
  let titre = '', nomQui = qui;
  if (d.genre === 'reception') {
    const quand = d.date ? jourLong(d.date) : d.periode || '';
    titre = [d.occasion?.replace(/^une? /i, '').replace(/^./, (c) => c.toUpperCase()), d.invites ? `${d.invites} invités` : '', quand].filter(Boolean).join(' · ');
    L.push(['Occasion', d.occasion], ['Date', quand ? maj(quand) : ''], ['Invités', d.invites], ['Espace', d.espace], ['Message', d.message]);
  } else if (d.genre === 'traiteur') {
    /* v7.14.0 : une demande récente porte ses lignes (quantité et unité : « 2 pièces », « 1,5 kg ») ; on compte les produits, pas les quantités. */
    const L2 = Array.isArray(d.lignes) && d.lignes.length ? d.lignes : null, qu = (l) => `${String(l.quantite).replace('.', ',')} ${l.unite === 'kilo' ? 'kg' : l.unite === 'piece' ? (l.quantite > 1 ? 'pièces' : 'pièce') : l.unite === 'formule' ? (l.quantite > 1 ? 'formules' : 'formule') : '(unité à préciser)'}`;
    const n = L2 ? L2.length : (d.produits || []).length, retrait = [d.jourLibelle || (d.jour ? fmt(d.jour) : ''), d.moment === 'midi' ? 'à midi' : d.moment === 'soir' ? 'le soir' : ''].filter(Boolean).join(', ');
    titre = [pluriel(n, 'produit'), d.total != null ? euros(+d.total) : '', retrait ? `retrait ${retrait}` : ''].filter(Boolean).join(' · ');
    L.push(['Commande', L2 ? L2.map((x) => `${qu(x)} ${x.nom}`).join(', ') : (d.produits || []).map((x) => `${x.qte} × ${x.nom}`).join(', ')], ['Total', d.total != null ? euros(+d.total) : ''], ['Retrait', retrait ? maj(retrait) : ''], ['Remarque', d.remarque]);
  } else if (d.genre === 'cadeau') {
    /* v7.14.0 : l'acheteur (la personne à rappeler) est distinct de la signature « De la part de » et du bénéficiaire. La
       demande garde l'offre choisie (identifiant, intitulé, version publiée) ; une demande plus ancienne reste lisible. */
    const ach = d.acheteur || {};
    nomQui = ach.nom || d.de || qui;
    titre = `${pluriel(+d.quantite || 1, 'carte')} de ${euros(+d.montant || 0)}${d.pour ? ` pour ${d.pour}` : ''}`;
    L.push(['Offre', d.offre ? `${d.intitule || 'Carte cadeau'}${d.publication != null ? ` (version publiée n°\u00a0${d.publication})` : ''}` : ''], ['Montant', `${+d.quantite > 1 ? `${d.quantite} × ` : ''}${euros(+d.montant || 0)}`], ['Total', d.total != null && +d.quantite > 1 ? euros(+d.total) : ''],
      ['Acheteur', [ach.nom, ach.telephone, ach.email].filter(Boolean).join(' · ')], ['Pour', d.pour], ['De la part de', d.de], ['Le mot', d.mot]);
  } else if (d.genre === 'question') {
    titre = d.sujet || 'Une question';
    L.push(['Sujet', d.sujet], ['Message', d.message], ['Pour le', d.date ? maj(fmt(d.date)) : '']);
  }
  return { id: d.id, genre: d.genre, cree: d.cree, qui: nomQui || 'Sans nom', prenom: d.prenom || (d.acheteur?.nom || d.de || '').split(' ')[0] || '', telephone: d.telephone || d.tel || d.acheteur?.telephone || '', email: d.email || d.acheteur?.email || '', titre, lignes: L.filter(([, v]) => v), statut: d.statut || 'nouvelle', source: d.source === 'demo' ? 'demo' : 'site', brut: d };
}

/** Les demandes (hors tables) : démonstration et site, à l'étape où le restaurant les a laissées ; celles qui attendent d'abord, puis les plus récentes. */
export function demandes({ auj, demandes: site = [], produits = [], exemples = true, demandesDemo: avecDemo = true }, S) {
  /* v7.12.0 : un scénario qui apporte ses propres demandes (fictives) ne montre pas en plus les exemples habituels. */
  if (avecDemo === false) exemples = false;
  const st = S.demandes?.statuts || {}, notes = S.demandes?.notes || {};
  /* Mode connecté (exemples === false) : aucune demande inventée n'est montrée dans l'outil de l'équipe. */
  return [...(exemples === false ? [] : demandesDemo(auj, produits)), ...site].filter((d) => GENRES[d.genre] && d.genre !== 'table').map(normaliser)
    .map((d) => ({ ...d, statut: st[d.id] || d.statut, note: notes[d.id] || '' }))
    .sort((a, b) => (a.statut === 'nouvelle' ? 0 : 1) - (b.statut === 'nouvelle' ? 0 : 1) || String(b.cree).localeCompare(String(a.cree)));
}
/** Ce qui attend une réponse : les tables à confirmer et les demandes nouvelles. */
export function aTraiter(ctx, S) { return { tables: aConfirmer(ctx, S), autres: demandes(ctx, S).filter((d) => d.statut === 'nouvelle') }; }
/** Où en sont les réceptions : le nombre de demandes à chaque étape (celles sans suite à part). */
export function suiviReceptions(l) {
  const r = l.filter((d) => d.genre === 'reception');
  return [...GENRES.reception.etapes, GENRES.reception.fin].map(([id, nom]) => ({ id, nom, n: r.filter((d) => d.statut === id).length }));
}

/* ---------- Les messages aux clients (envoi simulé dans la démonstration) ---------- */
export const MODELES = {
  confirmation: { nom: 'Table confirmée', quand: 'Quand vous confirmez une réservation', texte: 'Bonjour {prénom}, votre table pour {couverts} est confirmée {jour} à {heure}. À très vite aux Jardins de l\'Hacienda !' },
  refus: { nom: 'Table refusée', quand: 'Quand vous refusez une réservation', texte: 'Bonjour {prénom}, nous sommes complets {jour} à {heure}. Appelez-nous au {téléphone} : nous trouverons un autre moment ensemble.' },
  reception: { nom: 'Réception : premier contact', quand: 'Quand vous avez rappelé pour une réception', texte: 'Bonjour {prénom}, merci pour votre demande ({occasion}). Comme convenu au téléphone, voici nos coordonnées : {téléphone}. Au plaisir de vous faire visiter les Jardins.' },
  traiteur: { nom: 'Commande confirmée', quand: 'Quand vous confirmez une commande traiteur', texte: 'Bonjour {prénom}, votre commande est confirmée : {commande}. Retrait {retrait}. Total : {total}, à régler sur place.' },
  cadeau: { nom: 'Carte cadeau envoyée', quand: 'Quand vous envoyez une carte cadeau', texte: 'Bonjour {prénom}, votre carte cadeau de {montant} pour {pour} est prête. Pour la recevoir, appelez-nous au {téléphone}.' },
};
export const modele = (S, cle) => S.messages?.[cle] || MODELES[cle]?.texte || '';
/** Remplit un modèle : {prénom}, {couverts}… ; une variable inconnue ou vide est laissée telle quelle, pour qu'on la voie. */
export const composer = (texte, vars = {}) => typo(String(texte || '').replace(/\{([^{}]+)\}/g, (m, k) => (vars[k] != null && vars[k] !== '' ? String(vars[k]) : m)));
const prenomDe = (nom) => { const p = String(nom || '').trim().split(/\s+/); return /^(famille|m\.|mme|monsieur|madame)$/i.test(p[0]) || p.length === 1 ? String(nom || '').trim() : p[0]; };
/** Les variables d'une réservation de table, pour les modèles « confirmation » et « refus ». */
export const variablesTable = (r, telephone) => ({ 'prénom': prenomDe(r.nom), couverts: String(r.couverts), jour: fmt(r.date), heure: heure(r.heure), 'téléphone': telephone });
/** Le message qui partirait pour une demande à l'étape donnée : { cle, texte } ou null s'il n'y en a pas. */
export function messageDemande(S, d, telephone) {
  const cle = d.genre === 'reception' ? 'reception' : d.genre === 'traiteur' ? 'traiteur' : d.genre === 'cadeau' ? 'cadeau' : null; if (!cle) return null;
  const b = d.brut || {}, vars = { 'prénom': d.prenom || d.qui, 'téléphone': telephone, occasion: (b.occasion || '').toLowerCase(), commande: (b.produits || []).map((x) => `${x.qte} × ${x.nom}`).join(', '),
    retrait: [b.jourLibelle || (b.jour ? fmt(b.jour) : ''), b.moment === 'midi' ? 'à midi' : b.moment === 'soir' ? 'le soir' : ''].filter(Boolean).join(', '), total: b.total != null ? euros(+b.total) : '', montant: b.montant != null ? euros(+b.montant) : '', pour: b.pour || '' };
  return { cle, texte: composer(modele(S, cle), vars) };
}
/** Un exemple pour l'aperçu de chaque modèle (prénom inventé, visiblement fictif). */
export const exempleModele = (cle, telephone) => ({ 'prénom': 'Claire', couverts: '4', jour: 'samedi 21 novembre', heure: '20 h', 'téléphone': telephone, occasion: 'un mariage', commande: '2 × Tourte aux escargots', retrait: 'samedi 5 décembre, le soir', total: '64 €', montant: '100 €', pour: 'Léa' });
