/* La rubrique « Clients » (v7.10.0) : la liste de tous les clients que l'espace connaît, une recherche, et la même
   fiche que partout ailleurs (espace-vue-client.js) quand on touche un nom. La liste vient de espace-clients.js :
   réservations, demandes et notes de la maison. Deux personnes ne sont réunies que par leur téléphone. */
import { fmt, heure, pluriel, typo, ajouter } from './espace-regles.js?v=7';
import { correspond } from './espace-recherche.js?v=7';

const FILTRES = [['tous', 'Tous'], ['venir', 'Attendus bientôt'], ['habitues', 'Habitués'], ['demandes', 'Avec une demande']];

export function creerClients(X) {
  const { root, $, e, A, etat } = X;
  etat.rechercheClients = ''; etat.filtreClients = 'tous';
  const jour = (iso) => (iso === A.iso ? 'aujourd\'hui' : fmt(iso, { weekday: 'short', day: 'numeric', month: 'short' }));

  function lignes() {
    const tous = X.clients(), q = etat.rechercheClients.trim();
    const l = tous.filter((c) => (etat.filtreClients === 'venir' ? c.aVenir > 0 : etat.filtreClients === 'habitues' ? c.habitue : etat.filtreClients === 'demandes' ? c.demandes.length > 0 : true) && (q.length < 2 || correspond(q, c.nom, c.telephone)));
    if (!tous.length) return { n: 0, html: '<p class="esp-vide">Aucun client pour l\'instant. Ils apparaîtront ici avec les premières réservations et les premières demandes.</p>' };
    if (!l.length) return { n: 0, html: `<p class="esp-vide">Aucun client ne correspond${q.length >= 2 ? ` à « ${e(q)} »` : ' à ce filtre'}. <button type="button" class="esp-lien" data-clients-tout>Voir tous les clients</button></p>` };
    return { n: l.length, html: `<ul class="esp-clients">${l.map((c) => `<li class="esp-cli">
        <button type="button" class="esp-cli__nom esp-client" data-client="${e(c.cle)}" aria-haspopup="dialog" aria-label="${e(c.nom)}, ouvrir sa fiche">${e(c.nom)}</button>
        <span class="esp-cli__tel">${c.telephone ? e(c.telephone) : '<span class="esp-cli__sans">Sans téléphone</span>'}</span>
        <span class="esp-cli__marques">${c.habitue ? '<span class="esp-habitue">Habitué</span>' : ''}${c.allergies.length ? `<span class="esp-pastille esp-pastille--a-confirmer">Allergie : ${e(c.allergies.join(', '))}</span>` : ''}${c.exemple ? '<span class="esp-source">Exemple</span>' : ''}${c.semblables.length ? `<span class="esp-source esp-source--verifier">Même nom que ${c.semblables.length > 1 ? `${c.semblables.length} autres fiches` : 'une autre fiche'} : à vérifier</span>` : ''}</span>
        <span class="esp-cli__suite">${[c.aClarifier.length ? `Attendu ${e(jour(c.aClarifier[0].date))} à ${heure(c.aClarifier[0].heure)}, heure passée : à clarifier` : '', c.prochaine ? `Prochaine venue ${e(jour(c.prochaine.date))} à ${heure(c.prochaine.heure)}${c.prochaine.statut === 'a-confirmer' ? ' (à confirmer)' : ''}` : c.derniere ? `Dernière venue ${e(jour(c.derniere.date))}` : '', c.demandes.length ? pluriel(c.demandes.length, 'demande') : ''].filter(Boolean).join(' · ') || 'Pas de réservation dans l\'agenda'}</span>
      </li>`).join('')}</ul>` };
  }
  function rendre() {
    const r = lignes(), total = X.clients().length;
    X.corps('clients').innerHTML = typo(`
      <p class="esp-intro">${total ? `Sur la période affichée, du ${e(fmt(ajouter(A.iso, -7), { day: 'numeric', month: 'long' }))} au ${e(fmt(ajouter(A.iso, 28), { day: 'numeric', month: 'long' }))} : ${pluriel(total, 'client')} dans l'agenda, les demandes et vos notes. Touchez un nom pour ouvrir sa fiche.` : 'Les clients de vos réservations et de vos demandes.'}</p>
      <div class="esp-clients__outils"><p class="esp-champ esp-clients__champ"><label for="clients-recherche">Retrouver un client</label><input id="clients-recherche" type="search" data-clients-recherche value="${e(etat.rechercheClients)}" placeholder="Un nom ou un numéro de téléphone" autocomplete="off" enterkeyhint="search"></p>
        <p class="esp-filtres" role="group" aria-label="Filtrer les clients">${FILTRES.map(([id, nom]) => `<button type="button" class="esp-filtre" data-filtre-clients="${id}" aria-pressed="${id === etat.filtreClients}">${nom}</button>`).join('')}</p></div>
      <p class="esp-clients__compte" role="status" aria-live="polite" data-clients-compte>${r.n ? pluriel(r.n, 'client') : ''}</p>
      <div data-clients-liste>${r.html}</div>
      <p class="esp-aide">Deux fiches au même nom ne sont jamais réunies d'office : seul un même téléphone (06… ou +33 6…) ou l'identifiant du client les rassemble.${X.ctx().exemples === false ? ' Les notes et allergies d\'une fiche restent pour l\'instant sur cet appareil.' : ''}</p>`);
  }
  /* La frappe ne redessine que la liste : le champ garde son curseur. */
  root.addEventListener('input', (ev) => { const c = ev.target.closest?.('[data-clients-recherche]'); if (!c) return; etat.rechercheClients = c.value; const r = lignes(); $('[data-clients-liste]', root).innerHTML = typo(r.html); $('[data-clients-compte]', root).textContent = r.n ? pluriel(r.n, 'client') : ''; });
  function clic(t) {
    const f = t.closest('[data-filtre-clients]'); if (f) { etat.filtreClients = f.dataset.filtreClients; X.rendre(); $(`[data-filtre-clients="${etat.filtreClients}"]`, root)?.focus({ preventScroll: true }); return true; }
    if (t.closest('[data-clients-tout]')) { etat.rechercheClients = ''; etat.filtreClients = 'tous'; X.rendre(); $('#clients-recherche', root)?.focus({ preventScroll: true }); return true; }
    return false;
  }
  return { rendre, clic };
}
