/* La recherche transversale (v7.10.0) : retrouver un client, une réservation, une demande, une soirée ou un plat.
   Simple et déterministe : chaque mot tapé doit commencer un mot du nom, de l'intitulé ou du téléphone. Fonctions pures.
   Les réservations par nom sont déjà trouvées par la barre (espace-commandes.js) : ici, le reste. */
import { simplifier, fmt, pluriel } from './espace-regles.js?v=7';
import { GENRES, libelleEtape } from './espace-demandes.js?v=7';

const mots = (t) => simplifier(t).split(/[^a-z0-9]+/).filter(Boolean);
const chiffres = (t) => String(t || '').replace(/\D/g, '');
/** Chaque mot cherché commence-t-il un mot du texte (ou une suite de chiffres du téléphone) ? */
export function correspond(recherche, texte, telephone = '') {
  const q = mots(recherche), t = mots(texte), tel = chiffres(telephone);
  return q.length > 0 && q.every((w) => (/^\d{3,}$/.test(w) ? tel.includes(w) : t.some((x) => x.startsWith(w))));
}
const jour = (iso) => fmt(iso, { weekday: 'long', day: 'numeric', month: 'long' });

/**
 * @param {string} texte
 * @param {{ clients?: object[], demandes?: object[], evenements?: object[], plats?: { cle, nom, rubrique, prix }[], auj: string }} index
 * @returns {{ genre: string, type: string, titre: string, detail: string, aller: object }[]}  au plus `max`, clients d'abord
 */
export function rechercher(texte, { clients = [], demandes = [], evenements = [], plats = [], auj }, max = 6) {
  const n = simplifier(texte); if (n.length < 2 || !mots(n).some((w) => w.length >= 2)) return [];
  const out = [];
  for (const c of clients) { if (!correspond(n, c.nom, c.telephone)) continue;
    const quoi = [c.prochaine ? `prochaine venue ${jour(c.prochaine.date)}` : c.aVenir ? '' : c.venues ? `${pluriel(c.venues, 'venue')}` : '', c.demandes.length ? pluriel(c.demandes.length, 'demande') : '', c.habitue ? 'habitué' : ''].filter(Boolean).join(' · ');
    out.push({ genre: 'client', type: 'Client', titre: `${c.nom}${c.telephone ? ` · ${c.telephone}` : ''}`, detail: `Fiche client${quoi ? ` · ${quoi}` : ''}${c.parNom ? ' · sans téléphone' : ''}`, aller: { vue: 'clients', client: c.cle } }); }
  for (const d of demandes) { if (!correspond(n, `${d.qui} ${d.titre} ${GENRES[d.genre]?.nom || ''}`, d.telephone)) continue;
    out.push({ genre: 'demande', type: 'Demande', titre: `${d.qui} · ${GENRES[d.genre]?.nom || 'Demande'}`, detail: `${d.titre} · ${libelleEtape(d.genre, d.statut)}`, aller: { vue: 'demandes', filtre: d.genre, demande: d.id } }); }
  for (const x of evenements) { if (String(x.debut).slice(0, 10) < auj || !correspond(n, `${x.titre} ${x.type || ''}`)) continue;
    out.push({ genre: 'evenement', type: 'Soirée', titre: x.titre, detail: `${x.type || 'Soirée'} · ${jour(String(x.debut).slice(0, 10))}${x.masque ? ' · masquée sur le site' : ''}`, aller: { vue: 'carte', onglet: 'soirees', editer: x.id } }); }
  for (const p of plats) { if (!correspond(n, p.nom)) continue;
    out.push({ genre: 'carte', type: 'Carte', titre: p.nom, detail: `Carte · ${p.rubrique}${p.prix ? ` · ${p.prix}` : ''}`, aller: { vue: 'carte', onglet: 'carte', plat: p.cle } }); }
  return out.slice(0, max);
}
