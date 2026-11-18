/* La couche de données de l'espace restaurateur (v7.7.0) : tout ce que l'espace lit ou change passe par ici.
   - MUTATIONS : chaque geste du restaurateur est une action nommée, une fonction pure qui modifie une copie de l'état
     (testées par `node --test _audit/tests/*.test.mjs`).
   - creerDepot(stockage) : garde l'état en mémoire, applique une action, l'enregistre par le stockage (espace-stock.js
     aujourd'hui, une API demain : même contrat lire / ecrire / vider / resasSite / ecrireResasSite / demandesSite /
     ecrireDemandesSite / ecouter), prévient les
     abonnés, et sait revenir en arrière (« Annuler »).
   Pour passer au réel : remplacer le stockage ; les écrans et les actions ne changent pas. */
import * as stockLocal from './espace-stock.js?v=7';
import { listeEvenements, typo } from './espace-regles.js?v=7';
import { MUTATIONS_CARTE } from './espace-carte.js?v=7';
import { MUTATIONS_CONSEILS } from './espace-conseils.js?v=7';
export { estVide } from './espace-stock.js?v=7';

const basculer = (liste = [], valeur, actif) => [...new Set([...liste.filter((x) => x !== valeur), ...(actif ? [valeur] : [])])];
const sansVide = (o, k) => { if (o[k] && !Object.keys(o[k]).length) delete o[k]; };

export const MUTATIONS = {
  /* Réservations */
  statut(S, { id, statut }) { ((S.resa ||= {}).statuts ||= {})[id] = statut; },
  /* Un service (`service`) ou plusieurs d'un coup (`services`), pour un jour. */
  complet(S, { date, service, services, actif }) { const c = ((S.resa ||= {}).complets ||= {}); for (const sv of services || [service]) c[date] = basculer(c[date], sv, actif); if (!c[date].length) delete c[date]; },
  fermer(S, { date, service, services, actif }) { const c = ((S.resa ||= {}).fermes ||= {}); for (const sv of services || [service]) c[date] = basculer(c[date], sv, actif); if (!c[date].length) delete c[date]; },
  ajouterResa(S, { resa }) { ((S.resa ||= {}).ajouts ||= []).push(resa); },
  /* Annonce, fermetures, horaires, ardoise, textes */
  annonce(S, { active, texte }) { S.annonce = { active: active ?? !!S.annonce?.active, texte: texte ?? S.annonce?.texte ?? '' }; },
  ajouterFermeture(S, { du, au, motif }) {
    const l = ((S.horaires ||= {}).exceptions ||= []);
    l.push({ du, au: au && au >= du ? au : du, motif: (motif || '').trim() || 'Fermeture exceptionnelle' }); l.sort((a, b) => a.du.localeCompare(b.du));
  },
  retirerFermeture(S, { index }) { S.horaires?.exceptions?.splice(index, 1); if (S.horaires && !S.horaires.exceptions?.length) delete S.horaires.exceptions; },
  horaires(S, { semaine }) { (S.horaires ||= {}).semaine = semaine; },
  ardoise(S, { ardoise }) { S.ardoise = ardoise; },
  /* Les textes sont gardés avec la typographie française ; le texte d'origine (ou un champ vidé) ne laisse rien. */
  texte(S, { cle, valeur, defaut }) { S.textes ||= {}; const v = typo((valeur || '').trim()); if (!v || v === typo(defaut || '')) delete S.textes[cle]; else S.textes[cle] = v; sansVide(S, 'textes'); },
  /* Demandes (réceptions, traiteur, cartes cadeaux, questions) : l'étape où elles en sont, une note du restaurant */
  etapeDemande(S, { id, statut }) { ((S.demandes ||= {}).statuts ||= {})[id] = statut; },
  noteDemande(S, { id, note }) { const n = ((S.demandes ||= {}).notes ||= {}), v = (note || '').trim(); if (v) n[id] = v; else delete n[id]; sansVide(S.demandes, 'notes'); sansVide(S, 'demandes'); },
  /* Les messages aux clients : un modèle retouché ; le texte d'origine (ou un champ vidé) ne laisse rien */
  modeleMessage(S, { cle, texte, defaut }) { S.messages ||= {}; const v = typo((texte || '').trim()); if (!v || v === typo(defaut || '')) delete S.messages[cle]; else S.messages[cle] = v; sansVide(S, 'messages'); },
  /* La carte (v7.7.3) : plat, ajouterPlat, platVisible, epuise (espace-carte.js) */
  ...MUTATIONS_CARTE,
  /* « L'espace vous propose » (v7.7.4) : taireConseil (espace-conseils.js) */
  ...MUTATIONS_CONSEILS,
  /* Photos */
  photo(S, { emplacement, photo }) { (S.photos ||= {})[emplacement] = { ...(S.photos[emplacement] || {}), nom: photo.nom || null, l: photo.l || null, src: photo.src || null }; },
  cadrage(S, { emplacement, cadrage, origine }) { (S.photos ||= {})[emplacement] = { ...origine, ...(S.photos[emplacement] || {}), cadrage }; },
  retablirPhoto(S, { emplacement }) { delete S.photos?.[emplacement]; sansVide(S, 'photos'); },
  /* Événements : `agenda` est la liste livrée avec le site ; la liste résumée suit pour l'accueil et Réserver. */
  evenement(S, { id, champs, agenda }) {
    S.evenements ||= {};
    if (agenda.some((x) => x.id === id)) (S.evenements.modifs ||= {})[id] = { ...(S.evenements.modifs[id] || {}), ...champs };
    else { const l = (S.evenements.ajouts ||= []), i = l.findIndex((x) => x.id === id), x = { id, ...champs }; if (i >= 0) l[i] = { ...l[i], ...x }; else l.push(x); }
    S.evenements.liste = listeEvenements(agenda, S);
  },
  visibilite(S, { id, visible, agenda }) { const m = ((S.evenements ||= {}).modifs ||= {}); m[id] = { ...(m[id] || {}), masque: !visible }; S.evenements.liste = listeEvenements(agenda, S); },
  supprimerEvenement(S, { id, agenda }) {
    if (!S.evenements) return;
    S.evenements.ajouts = (S.evenements.ajouts || []).filter((x) => x.id !== id); delete S.evenements.modifs?.[id];
    S.evenements.liste = listeEvenements(agenda, S);
  },
};

/** Applique une action à une copie de l'état et la renvoie (fonction pure). */
export function appliquer(etat, nom, args) {
  if (!MUTATIONS[nom]) throw new Error(`Action inconnue : ${nom}`);
  const copie = JSON.parse(JSON.stringify(etat || {})); MUTATIONS[nom](copie, args || {}); return copie;
}

const DELAI_GROUPE = 10000, PILE_MAX = 30;

export function creerDepot(stockage = stockLocal, horloge = () => Date.now()) {
  let etat = stockage.lire();
  const pile = [], abonnes = new Set();
  const prevenir = (quoi) => { for (const f of abonnes) f(quoi); };
  /* Garde de quoi revenir en arrière. Les saisies qui se suivent (même `groupe`) ne font qu'un seul pas en arrière. */
  function retenir(avant, { groupe, libelle } = {}) {
    const dernier = pile[pile.length - 1], t = horloge();
    if (groupe && dernier && dernier.groupe === groupe && t - dernier.t < DELAI_GROUPE) { dernier.t = t; dernier.libelle = libelle || dernier.libelle; return; }
    pile.push({ ...avant, groupe, libelle, t }); if (pile.length > PILE_MAX) pile.shift();
  }
  return {
    /** L'état courant (ne pas le modifier : passer par agir). */
    etat: () => etat,
    resasSite: () => stockage.resasSite(),
    demandesSite: () => stockage.demandesSite?.() || [],
    /** Recharge l'état quand il a changé ailleurs (autre onglet) et prévient ; renvoie de quoi arrêter l'écoute. */
    ecouter(f) { return stockage.ecouter ? stockage.ecouter((quoi) => { if (quoi === 'etat') etat = stockage.lire(); f(quoi); }) : () => {}; },
    abonner(f) { abonnes.add(f); return () => abonnes.delete(f); },
    /** Applique une action et l'enregistre. Renvoie false si le stockage refuse (rien n'est changé). */
    agir(nom, args, meta) {
      const suivant = appliquer(etat, nom, args);
      if (!stockage.ecrire(suivant)) { prevenir({ type: 'refus', nom }); return false; }
      retenir({ etat }, meta); etat = suivant; prevenir({ type: 'action', nom, t: horloge() });
      return true;
    },
    /** Efface tout ce que l'espace a changé et les demandes venues du site (« Tout remettre comme livré »). */
    toutEffacer(meta) {
      retenir({ etat, site: stockage.resasSite(), demandes: stockage.demandesSite?.() || [] }, meta); stockage.vider(); etat = {}; prevenir({ type: 'action', nom: 'toutEffacer', t: horloge() });
    },
    peutAnnuler: () => pile.length > 0,
    /** Revient à l'état d'avant la dernière action. Renvoie son libellé, ou false s'il n'y a rien à annuler. */
    annuler() {
      const p = pile.pop(); if (!p) return false;
      if (!stockage.ecrire(p.etat)) { pile.push(p); prevenir({ type: 'refus', nom: 'annuler' }); return false; }
      if (p.site) stockage.ecrireResasSite(p.site);
      if (p.demandes) stockage.ecrireDemandesSite?.(p.demandes);
      etat = p.etat; prevenir({ type: 'annulation', t: horloge() });
      return p.libelle || true;
    },
  };
}
