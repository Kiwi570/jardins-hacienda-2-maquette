/* v7.14.1 : la période des retraits est un réglage de l'espace. La page porte la période livrée, les horaires de la
   semaine et les fermetures : le navigateur redessine les calendriers avec la même règle que l'espace (commerce.js).
   `periodeDite` : la période telle que les textes livrés l'écrivent, pour la remplacer là où elle est citée. */
export function baseRetraits(c) {
  const E = c.donnees.emporter, h = c.donnees.horaires.adresses[0], f = (iso, o) => new Intl.DateTimeFormat('fr-FR', { ...o, timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
  return { retraits: { debut: E.debut, fin: E.fin }, semaine: h.semaine, exceptions: h.exceptions || [], periodeDite: `du ${f(E.debut, E.debut.slice(0, 7) === E.fin.slice(0, 7) ? { day: 'numeric' } : { day: 'numeric', month: 'long' })} au ${f(E.fin, { day: 'numeric', month: 'long' })}` };
}
