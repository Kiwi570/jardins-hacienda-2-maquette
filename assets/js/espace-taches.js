/* Les tâches de l'équipe (v7.10.0) : de petites choses à faire, avec une échéance et un responsable facultatifs, et un
   lien facultatif vers ce qu'elles concernent (une demande, une réservation, un service). Une tâche liée à un dossier le
   complète : elle n'en est jamais une copie. Fonctions pures, sans écran.
   Portée : comme la carte ou les textes, les tâches sont gardées dans ce navigateur (elles ne sont pas encore partagées). */

/** @typedef {{ id: string, titre: string, fait: boolean, cree: string, echeance?: string, responsable?: string, faitLe?: string, lien?: { type: 'demande'|'resa'|'service'|'client', id: string, libelle: string } }} Tache */

export const tachesDe = (S) => S.taches?.liste || [];
const propre = (t) => String(t ?? '').replace(/\s+/g, ' ').trim();

/** Une tâche prête à être enregistrée, ou null si elle n'a pas de titre. */
export function nouvelleTache({ id, titre, echeance = '', responsable = '', lien = null, cree }) {
  const t = propre(titre).slice(0, 140); if (!t || !id) return null;
  return { id, titre: t, fait: false, cree, ...(/^\d{4}-\d{2}-\d{2}$/.test(echeance) ? { echeance } : {}), ...(propre(responsable) ? { responsable: propre(responsable).slice(0, 40) } : {}),
    ...(lien?.type && lien?.id ? { lien: { type: lien.type, id: String(lien.id), libelle: propre(lien.libelle).slice(0, 120) } } : {}) };
}

/** Où en est une tâche par rapport à aujourd'hui : 'faite', 'retard', 'jour', 'venir' ou 'libre' (sans échéance). */
export const etatTache = (t, auj) => (t.fait ? 'faite' : !t.echeance ? 'libre' : t.echeance < auj ? 'retard' : t.echeance === auj ? 'jour' : 'venir');
const RANG = { retard: 0, jour: 1, libre: 2, venir: 3, faite: 4 };

/** Les tâches à montrer pour un jour : en retard, du jour, sans date, puis à venir ; celles terminées ce jour-là restent visibles, barrées. */
export function tachesDuJour(S, auj) {
  return tachesDe(S).filter((t) => !t.fait || t.faitLe === auj).map((t) => ({ ...t, etat: etatTache(t, auj) }))
    .sort((a, b) => RANG[a.etat] - RANG[b.etat] || String(a.echeance || '9').localeCompare(String(b.echeance || '9')) || String(a.cree).localeCompare(String(b.cree)));
}
/** Les tâches liées à un objet (une demande, une réservation, un service « date|service ») : celles à faire d'abord. */
export const tachesLiees = (S, type, id) => tachesDe(S).filter((t) => t.lien?.type === type && t.lien.id === String(id)).sort((a, b) => (a.fait ? 1 : 0) - (b.fait ? 1 : 0) || String(a.cree).localeCompare(String(b.cree)));
/** Les tâches en retard, les plus anciennes d'abord. */
export const tachesEnRetard = (S, auj) => tachesDe(S).filter((t) => etatTache(t, auj) === 'retard').sort((a, b) => a.echeance.localeCompare(b.echeance));

export const MUTATIONS_TACHES = {
  tacheAjouter(S, { tache }) { if (!tache?.id || !tache.titre || tachesDe(S).some((t) => t.id === tache.id)) return; ((S.taches ||= {}).liste ||= []).push(tache); },
  tacheModifier(S, { id, champs = {} }) {
    const t = tachesDe(S).find((x) => x.id === id); if (!t) return;
    if ('titre' in champs && propre(champs.titre)) t.titre = propre(champs.titre).slice(0, 140);
    if ('echeance' in champs) { if (/^\d{4}-\d{2}-\d{2}$/.test(champs.echeance || '')) t.echeance = champs.echeance; else delete t.echeance; }
    if ('responsable' in champs) { if (propre(champs.responsable)) t.responsable = propre(champs.responsable).slice(0, 40); else delete t.responsable; }
  },
  tacheTerminer(S, { id, fait = true, le = '' }) { const t = tachesDe(S).find((x) => x.id === id); if (!t) return; t.fait = !!fait; if (fait) t.faitLe = le; else delete t.faitLe; },
  tacheSupprimer(S, { id }) { if (!S.taches?.liste) return; S.taches.liste = S.taches.liste.filter((t) => t.id !== id); if (!S.taches.liste.length) delete S.taches; },
};
