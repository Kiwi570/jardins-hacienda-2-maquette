/* Les règles consultées avant chaque action sur une réservation (v7.8.1), en fonctions pures (testées par
   `node --test _audit/tests/*.test.mjs`). Le dépôt de données les appelle avant d'enregistrer, d'où que vienne l'action :
   formulaire, barre, suggestion, glisser sur le plan. Demain, le serveur appellera les mêmes.

   Chaque engagement est revérifié sur la réservation précise (date, service, heure, couverts, règles du jour, table) :
   - noter une réservation au téléphone ;
   - confirmer une demande, ou remettre une réservation annulée, refusée ou absente ;
   - modifier une réservation ;
   - asseoir une réservation à une table, ou plusieurs d'un coup.
   Une table qui ne convient plus (trop petite, prise entre-temps, fermée) n'est jamais gardée : elle est retirée dans
   le même enregistrement et la réservation redevient « à placer » ; la note le dit. */
import { CAPACITE, enMin, heure, verifierResa, trouverResa } from './espace-regles.js?v=7';
import { dureeDe } from './espace-service.js?v=7';
import { planDuService, libre, tableApres, placeDe, avisPlace } from './espace-salle.js?v=7';
import { refusInstallation } from './espace-presence.js?v=7';
import { refusAttente } from './espace-attente.js?v=7';
import { refusReception } from './espace-receptions.js?v=7';
import { refusOffre } from './espace-offres.js?v=7';
import { refusCommerce } from './commerce.js?v=7';

const INACTIFS = ['refusee', 'annulee', 'absente'];
const minutes = (r) => ({ ...r, debutMin: enMin(r.heure), finMin: enMin(r.heure) + dureeDe(r.service) });

/** Peut-on asseoir cette réservation à cette table ? '' si oui, sinon la phrase qui dit pourquoi. */
export function refusPlacement(ctx, S, salle, r, table) {
  if (!r) return 'Cette réservation est introuvable : elle a peut-être été supprimée ailleurs.';
  if (INACTIFS.includes(r.statut)) return 'Cette réservation n\'est plus active : remettez-la d\'abord.';
  const t = placeDe(planDuService(ctx, S, salle, r.date, r.service), table);
  if (!t) return `${String(table).includes('+') ? `L'assemblage ${table}` : `La table ${table}`} n'est pas sur le plan.`;
  if (t.fermee) { const c = t.assemblage ? t.composantes.find((x) => x.fermee) : t; return c.horsSaison ? 'La terrasse est fermée hors saison : elle rouvre en juin.' : c.reception ? `La table ${c.id} est retenue pour une réception (${c.reception.intitule}${c.reception.type === 'option' ? ', option' : ''}).` : `La table ${c.id} est indisponible pour ce service.`; }
  if (!libre(t, minutes(r))) {
    const c = (t.assemblage ? t.composantes : [t]).find((x) => !libre(x, minutes(r))), a = c.resas.find((x) => x.id !== r.id && x.debutMin < minutes(r).finMin && minutes(r).debutMin < x.finMin) || c.resas.find((x) => x.id !== r.id);
    return `La table ${c.id} est prise à cette heure-là (${a?.nom || 'une autre réservation'}, ${heure(a?.heure || r.heure)}).`;
  }
  return '';
}

/**
 * Ce que les règles disent d'une action : { refus, suites, note }.
 * refus : la phrase qui dit pourquoi l'action est impossible ('' si elle est possible) ;
 * suites : les actions à enregistrer avec elle ; note : ce qu'elles ont fait, à dire à l'écran.
 * `salle` : le plan (donnees/salle.json) ; sans lui, les tables ne sont pas contrôlées.
 */
export function reglesAction(ctx, S, salle, nom, args = {}) {
  /* v7.12.0 : les dossiers de réception. Poser, déplacer, prolonger, confirmer : les conflits sont revérifiés ici, au moment d'enregistrer. */
  if (/^rec[A-Z]/.test(nom)) return { refus: refusReception(ctx, S, salle, nom, args), suites: [], note: '' };
  /* v7.13.0 : les offres, la publication, et les soirées déjà réservées (une date ne change pas sous des réservations). */
  /* v7.14.0 : commandes à emporter, capacités, cartes cadeaux (commerce.js), sur l'état frais. */
  if (/^(cmd|cad|carte|com)[A-Z]/.test(nom)) return { refus: refusCommerce(S, nom, args, { auj: ctx.auj }), suites: [], note: '' };
  if (/^off[A-Z]/.test(nom) || ['offre', 'evenement', 'supprimerEvenement'].includes(nom)) return { refus: refusOffre(S, nom, args, { resas: ctx.resasSoirees ? ctx.resasSoirees(S) : [] }), suites: [], note: '' };
  const r0 = reglesDeBase(ctx, S, salle, nom, args);
  /* v7.11.0 : une réservation qui n'est plus « arrivée » n'est plus installée ni partie : sa présence est effacée avec elle. */
  if (!r0.refus && nom === 'statut' && args.statut !== 'arrivee' && S.service?.presence?.[args.id]?.etat) return { ...r0, suites: [...r0.suites, { nom: 'presenceRetirer', args: { id: args.id } }] };
  return r0;
}
function reglesDeBase(ctx, S, salle, nom, args = {}) {
  const oui = { refus: '', suites: [], note: '' }, non = (refus) => ({ refus, suites: [], note: '' });
  /* La table d'une réservation qui change ou revient : gardée si elle convient encore, sinon retirée. */
  const table = (r, champs, pourquoi, places = true) => {
    if (!salle || !r?.table) return oui;
    const ta = tableApres(ctx, S, salle, r, champs, { places });
    return ta.convient ? oui : { refus: '', suites: [{ nom: 'placerResa', args: { id: r.id, table: '' } }], note: `La table ${ta.table} ${pourquoi(ta.raison)} : la réservation est à placer.` };
  };
  if (nom === 'ajouterResa') {
    const r = args.resa || {}; if (r.id && trouverResa(ctx, S, r.id)) return non('Cette réservation est déjà notée.');
    const v = verifierResa(ctx, S, r); return v.ok ? oui : non(`Réservation impossible : ${v.message}`);
  }
  if (nom === 'modifierResa') {
    const r = trouverResa(ctx, S, args.id), c = args.champs || {}; if (!r) return non('Cette réservation est introuvable : elle a peut-être été supprimée ailleurs.');
    const bouge = ('heure' in c && c.heure !== r.heure) || ('service' in c && c.service !== r.service), n = 'couverts' in c ? Math.round(+c.couverts) : +r.couverts;
    if (!Number.isFinite(n) || n < 1 || n > CAPACITE) return non(`Modification impossible : ${n > CAPACITE ? `${n} couverts, c'est plus que la salle (${CAPACITE}).` : 'il faut au moins un couvert.'}`);
    if (bouge) { const v = verifierResa(ctx, S, { ...r, ...c, couverts: n }); if (!v.ok) return non(`Modification impossible : ${v.message}`); }
    /* La table n'est remise en cause que si l'heure, le service ou le nombre de couverts change. */
    return bouge || n > +r.couverts ? table(r, { ...c, couverts: n }, (raison) => `ne convient plus (${raison})`, n > +r.couverts) : oui;
  }
  if (nom === 'statut' && ['confirmee', 'arrivee'].includes(args.statut)) {
    const r = trouverResa(ctx, S, args.id); if (!r) return oui;
    /* Confirmer ou remettre une réservation à venir : la réservation précise doit encore être possible (heure d'arrivée comprise). */
    if (args.statut === 'confirmee' && r.date >= ctx.auj) { const v = verifierResa(ctx, S, r); if (!v.ok) return non(`Confirmation impossible : ${v.raison === 'ferme' ? `${(v.message || 'le service est fermé').replace(/\.$/, '').toLowerCase()}. Rouvrez le service, ou refusez la demande.` : `${heure(r.heure)} n'est plus une heure d'arrivée ce jour-là. ${v.message} Modifiez l'heure de la réservation, ou refusez la demande.`}`); }
    /* Une réservation qui revient (annulée, refusée, absente) ne reprend pas une table donnée entre-temps. */
    return INACTIFS.includes(r.statut) ? table({ ...r, statut: args.statut }, {}, (raison) => (/prise/.test(raison) ? 'a été donnée entre-temps' : `ne convient plus (${raison})`), false) : oui;
  }
  /* v7.11.0 : la liste d'attente (revérification au moment de l'acceptation). */
  if (nom.startsWith('attente')) { const refus = refusAttente(ctx, S, salle, nom, args); return refus ? non(refus) : oui; }
  /* v7.11.0 : l'accueil pendant le service. */
  if (nom === 'installer' && salle) { const refus = refusInstallation(ctx, S, salle, trouverResa(ctx, S, args.id), args.minute ?? ctx.minute ?? 0); return refus ? non(refus) : oui; }
  if (nom === 'depart') { const r = trouverResa(ctx, S, args.id); if (!r) return non('Cette réservation est introuvable.'); return r.statut === 'arrivee' && S.service?.presence?.[r.id]?.etat === 'installe' ? oui : non('Ce groupe n\'est pas installé : il n\'y a pas de départ à noter.'); }
  if (nom === 'passage' && salle) {
    const r = args.resa || {}; if (trouverResa(ctx, S, r.id)) return non('Ce groupe est déjà noté.');
    if (!(+r.couverts >= 1) || +r.couverts > CAPACITE) return non('Indiquez le nombre de personnes.');
    if (r.table) { const plan = planDuService(ctx, S, salle, r.date, r.service, args.minute ?? ctx.minute ?? 0), t = placeDe(plan, r.table), m = enMin(r.heure);
      const avis = t ? avisPlace(plan, t, { id: r.id, couverts: r.couverts, debutMin: m, finMin: m + dureeDe(r.service) }, { maintenant: !!args.installer }) : { ok: false, genre: 'fermee', raison: 'Cette table n\'est pas sur le plan.' };
      if (!avis.ok && avis.genre !== 'serre') return non(avis.raison); }
    return oui;
  }
  if (nom === 'placerResa' && args.table && salle) { const refus = refusPlacement(ctx, S, salle, trouverResa(ctx, S, args.id), args.table); return refus ? non(refus) : oui; }
  if (nom === 'placerPlusieurs' && salle) {
    /* Chaque placement est contrôlé sur l'état où les précédents sont déjà posés : deux réservations ne peuvent pas recevoir la même table. */
    let etat = S;
    for (const [id, t] of Object.entries(args.places || {})) {
      if (!t) continue;
      const refus = refusPlacement(ctx, etat, salle, trouverResa(ctx, etat, id), t); if (refus) return non(refus);
      etat = { ...etat, resa: { ...(etat.resa || {}), tables: { ...(etat.resa?.tables || {}), [id]: String(t) } } };
    }
    return oui;
  }
  return oui;
}

/** Le garde-fou seul : '' si l'action est possible, sinon la phrase qui dit pourquoi (sans contrôle des tables). */
export const gardeMetier = (ctx, S, nom, args) => reglesAction(ctx, S, null, nom, args).refus;
