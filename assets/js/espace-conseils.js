/* « L'espace vous propose » (v7.7.4) : des suggestions tirées de l'état réel de l'espace, chacune avec le geste qui la
   règle. Et le bilan de la semaine. Fonctions pures (testées par `node --test _audit/tests/*.test.mjs`).
   Rien n'est deviné ni inventé : une suggestion n'existe que si les données la justifient (un service presque plein,
   une table pour demain sans réponse, une demande qui attend depuis plusieurs jours, une soirée proche sans prix, une
   fermeture proche que rien n'annonce). « Plus tard » la fait taire jusqu'au lendemain. */
import { CAPACITE, ajouter, fmt, maj, heure, pluriel, typo, servicesDe, ouvert, complet, resasDuJour, actives, couverts, evenements } from './espace-regles.js?v=7';
import { demandes, GENRES, recue } from './espace-demandes.js?v=7';

/* À partir de quand un service est « presque plein » : quatre cinquièmes de la capacité. */
export const SEUIL_PLEIN = 0.8;
const svMot = (sv) => (sv === 'midi' ? 'à midi' : 'au soir');
const joursEntre = (a, b) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86400000);

/**
 * @param {{ R: object, auj: string, site?: object[], demandes?: object[], produits?: object[], exceptions?: object[], agenda?: object[], pages?: object }} ctx
 * @param {object} S  l'état de l'espace
 * @returns {{ id: string, genre: string, titre: string, detail: string, bouton: string, action?: { nom: string, args: object, msg: string, lien?: string }, aller?: object }[]}
 */
export function conseils(ctx, S) {
  const { R, auj, pages = {} } = ctx, regles = { R, exceptions: ctx.exceptions || [] }, out = [];
  /* 1. Un service presque plein dans la semaine : le dire complet. */
  for (let k = 0; k <= 7; k++) { const iso = ajouter(auj, k), l = resasDuJour(ctx, S, iso);
    for (const s of servicesDe(R)) { if (!ouvert(regles, S, iso, s.id) || complet(S, iso, s.id)) continue; const c = couverts(l.filter((r) => r.service === s.id));
      if (c >= SEUIL_PLEIN * CAPACITE) out.push({ id: `plein-${iso}-${s.id}`, genre: 'complet', titre: `${maj(fmt(iso))} ${svMot(s.id)} : ${c} couverts sur ${CAPACITE}`, detail: 'Le service est presque plein. Le dire complet retire ce créneau de la réservation en ligne ; le restaurant reste ouvert.', bouton: 'Dire complet',
        action: { nom: 'complet', args: { date: iso, service: s.id, actif: true }, msg: 'Service complet : la réservation en ligne ne le propose plus.', lien: pages.reserver }, aller: { vue: 'resas', jour: iso } }); } }
  /* 2. Une table pour aujourd'hui ou demain qui attend encore sa réponse. */
  for (const iso of [auj, ajouter(auj, 1)]) { const l = resasDuJour(ctx, S, iso).filter((r) => r.statut === 'a-confirmer'); if (!l.length) continue;
    out.push({ id: `tables-${iso}`, genre: 'table', titre: `${pluriel(l.length, 'table')} pour ${iso === auj ? 'aujourd\'hui' : 'demain'} ${l.length > 1 ? 'attendent' : 'attend'} une réponse`, detail: l.slice(0, 3).map((r) => `${r.nom || 'Sans nom'}, ${pluriel(+r.couverts, 'couvert')} à ${heure(r.heure)}`).join(' · '), bouton: 'Répondre', aller: { vue: 'demandes', filtre: 'table' } }); }
  /* 3. Une demande (réception, traiteur, carte cadeau, question) sans réponse depuis deux jours ou plus : la plus ancienne. */
  const vieilles = demandes(ctx, S).filter((d) => d.statut === 'nouvelle' && joursEntre(String(d.cree).slice(0, 10), auj) >= 2).sort((a, b) => String(a.cree).localeCompare(String(b.cree)));
  if (vieilles.length) { const d = vieilles[0]; out.push({ id: `attente-${d.id}`, genre: d.genre, titre: `${d.qui} attend une réponse depuis ${recue(d.cree, auj).replace('il y a ', '')}`, detail: `${GENRES[d.genre].nom} : ${d.titre}.${vieilles.length > 1 ? ` ${pluriel(vieilles.length - 1, 'autre demande')} dans le même cas.` : ''}`, bouton: 'Ouvrir', aller: { vue: 'demandes', filtre: 'tout', demande: d.id } }); }
  /* 4. Une soirée dans les quinze jours, affichée sur le site, sans prix. */
  for (const x of evenements(ctx.agenda || [], S)) { const j = joursEntre(auj, x.debut.slice(0, 10)); if (x.masque || j < 0 || j > 15 || String(x.prix || '').trim()) continue;
    out.push({ id: `prix-${x.id}`, genre: 'evenement', titre: `« ${x.titre} » est ${j === 0 ? 'aujourd\'hui' : j === 1 ? 'demain' : `dans ${j} jours`} et n'a pas de prix`, detail: 'Le billet est sur le site sans tarif. Ajoutez-le, ou masquez la soirée en attendant.', bouton: 'Ajouter le prix', aller: { vue: 'site', onglet: 'soirees', editer: x.id } }); }
  /* 5. Une fermeture exceptionnelle dans les trois semaines, sans annonce affichée. */
  if (!S.annonce?.active) for (const f of S.horaires?.exceptions || []) { const j = joursEntre(auj, f.du); if (j < 0 || j > 21) continue;
    const texte = typo(f.du === f.au ? `Le restaurant sera fermé ${fmt(f.du)}. À très vite !` : `Le restaurant sera fermé du ${fmt(f.du, { day: 'numeric', month: 'long' })} au ${fmt(f.au, { day: 'numeric', month: 'long' })}. À très vite !`);
    out.push({ id: `annonce-${f.du}`, genre: 'annonce', titre: `Votre fermeture ${f.du === f.au ? `du ${fmt(f.du, { day: 'numeric', month: 'long' })}` : `du ${fmt(f.du, { day: 'numeric', month: 'long' })} au ${fmt(f.au, { day: 'numeric', month: 'long' })}`} n'est pas annoncée`, detail: `Afficher sur tout le site : « ${texte} »`, bouton: 'Afficher l\'annonce',
      action: { nom: 'annonce', args: { active: true, texte }, msg: 'Annonce affichée sur toutes les pages.', lien: pages.accueil }, aller: { vue: 'site', onglet: 'horaires', ancre: 't-annonce' } }); break; }
  const tu = S.conseils?.ignores || {};
  return out.filter((c) => tu[c.id] !== auj);
}

/** Le lundi de la semaine d'un jour. */
export const lundiDe = (iso) => { const [a, m, j] = iso.split('-').map(Number), d = new Date(Date.UTC(a, m - 1, j)); return ajouter(iso, -((d.getUTCDay() + 6) % 7)); };
/**
 * Le bilan d'une semaine, du lundi au dimanche : couverts par service et par jour, remplissage des services ouverts,
 * service le plus chargé, d'où viennent les réservations (site, téléphone, exemples de démonstration).
 */
export function bilanSemaine(ctx, S, lundi) {
  const regles = { R: ctx.R, exceptions: ctx.exceptions || [] }, svs = servicesDe(ctx.R), jours = [], origines = { site: 0, telephone: 0, demo: 0 };
  let total = 0, tables = 0, ouverts = 0, attente = 0, plus = null;
  for (let k = 0; k < 7; k++) { const iso = ajouter(lundi, k), l = resasDuJour(ctx, S, iso), jour = { iso, services: {} };
    for (const s of svs) { const ls = l.filter((r) => r.service === s.id), o = ouvert(regles, S, iso, s.id), c = couverts(ls); jour.services[s.id] = { ouvert: o, couverts: c, tables: actives(ls).length, complet: complet(S, iso, s.id) };
      total += c; tables += actives(ls).length; if (o) ouverts++; if (c && (!plus || c > plus.couverts)) plus = { iso, service: s.id, couverts: c }; }
    for (const r of actives(l)) origines[r.source === 'site' ? 'site' : r.source === 'telephone' ? 'telephone' : 'demo'] += 1;
    attente += l.filter((r) => r.statut === 'a-confirmer').length; jours.push(jour); }
  return { lundi, jours, couverts: total, tables, servicesOuverts: ouverts, remplissage: ouverts ? total / (ouverts * CAPACITE) : 0, plusCharge: plus, origines, aConfirmer: attente, capacite: CAPACITE };
}

export const MUTATIONS_CONSEILS = {
  /** « Plus tard » : la suggestion se tait pour la journée (les jours passés ne s'accumulent pas). */
  taireConseil(S, { id, date }) { const t = ((S.conseils ||= {}).ignores ||= {}); for (const k of Object.keys(t)) if (t[k] < date) delete t[k]; t[id] = date; },
};
