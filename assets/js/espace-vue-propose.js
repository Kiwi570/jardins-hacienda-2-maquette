/* « L'espace vous propose » et le bilan de la semaine (v7.7.4) : les écrans.
   - La carte des suggestions, en tête d'« Aujourd'hui » : trois au plus, chacune avec son bouton (le geste est fait,
     annulable) et « Plus tard » (elle se tait jusqu'au lendemain).
   - Le bilan de la semaine, onglet de « Réservations » : quatre chiffres, puis service par service une jauge sur la
     capacité, la vue en tableau, et d'où viennent les réservations. Les réservations de démonstration sont des
     exemples : c'est écrit au-dessus des chiffres.
   Les règles sont dans espace-conseils.js (fonctions pures). */
import { conseils, bilanSemaine, lundiDe, SEUIL_PLEIN } from './espace-conseils.js?v=7';
import { ajouter, fmt, maj, pluriel, typo } from './espace-regles.js?v=7';

const ETINCELLE = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9L12 3.5ZM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"/></svg>';

export function creerPropose(X) {
  const { root, $, e, S, A, D, ctx, etat, agir } = X;
  const liste = () => conseils({ ...ctx(), agenda: D.agenda, pages: D.pages }, S());

  /** La carte « L'espace vous propose » (vide s'il n'y a rien à proposer). */
  function carteConseils() {
    const l = liste(); if (!l.length) return '';
    return `<article class="esp-carte esp-carte--large esp-conseils" aria-labelledby="t-conseils"><h3 id="t-conseils"><span class="esp-conseils__ico">${ETINCELLE}</span>L'espace vous propose</h3>
      <ul class="esp-conseils__liste">${l.slice(0, 3).map((c) => `<li class="esp-conseil" data-conseil="${e(c.id)}"><div class="esp-conseil__texte"><p class="esp-conseil__titre">${e(typo(c.titre))}</p><p class="esp-conseil__detail">${e(typo(c.detail))}</p></div>
        <p class="esp-conseil__actions"><button type="button" class="esp-bouton esp-bouton--ok" data-faire-conseil="${e(c.id)}">${e(c.bouton)}</button><button type="button" class="esp-bouton esp-bouton--discret" data-taire-conseil="${e(c.id)}">Plus tard</button></p></li>`).join('')}</ul>
      ${l.length > 3 ? `<p class="esp-aide esp-conseils__reste">Et ${pluriel(l.length - 3, 'autre suggestion')} ensuite.</p>` : ''}</article>`;
  }

  /** Le bilan de la semaine du jour choisi dans l'agenda, dessiné dans `cible`. */
  function rendreBilan(cible) {
    const lundi = lundiDe(etat.jour), b = bilanSemaine(ctx(), S(), lundi), dim = ajouter(lundi, 6);
    const svNom = (sv) => (sv === 'midi' ? 'midi' : 'soir'), pc = (v) => `${Math.round(v * 100)} %`;
    const lignes = b.jours.flatMap((j) => Object.entries(j.services).filter(([, s]) => s.ouvert || s.couverts).map(([sv, s]) => ({ iso: j.iso, sv, ...s, part: Math.min(1, s.couverts / b.capacite) })));
    const fermes = b.jours.filter((j) => !Object.values(j.services).some((s) => s.ouvert || s.couverts)).map((j) => fmt(j.iso, { weekday: 'long' }));
    const tuile = (titre, valeur, detail) => `<div class="esp-tuile"><p class="esp-tuile__titre">${titre}</p><p class="esp-tuile__valeur">${valeur}</p><p class="esp-tuile__detail">${detail}</p></div>`;
    const o = b.origines, nbO = o.site + o.telephone + o.demo;
    cible.innerHTML = `
      <div class="esp-semaine esp-semaine--bilan"><button type="button" class="esp-rond" data-semaine="-7" aria-label="Semaine précédente"><span aria-hidden="true">‹</span><span class="esp-semaine__mot" aria-hidden="true">Semaine précédente</span></button>
        <h3 class="esp-semaine__titre">Semaine du ${e(fmt(lundi, { day: 'numeric', month: lundi.slice(5, 7) === dim.slice(5, 7) ? undefined : 'long' }))} au ${e(fmt(dim, { day: 'numeric', month: 'long' }))}</h3>
        <button type="button" class="esp-rond" data-semaine="7" aria-label="Semaine suivante"><span aria-hidden="true">›</span><span class="esp-semaine__mot" aria-hidden="true">Semaine suivante</span></button></div>
      <p class="esp-note-demo"><span class="esp-source">Démonstration</span> Les réservations de cette semaine sont des exemples : ces chiffres montrent ce que l'outil calcule, pas l'activité réelle du restaurant. La capacité (${b.capacite} couverts par service) est à remplacer par la vôtre.</p>
      <div class="esp-tuiles">
        ${tuile('Couverts', b.couverts, `${pluriel(b.tables, 'table')} dans la semaine`)}
        ${tuile('Remplissage', pc(b.remplissage), `sur ${pluriel(b.servicesOuverts, 'service')} ouvert${b.servicesOuverts > 1 ? 's' : ''}`)}
        ${tuile('Le plus chargé', b.plusCharge ? `${b.plusCharge.couverts}<small> couv.</small>` : '—', b.plusCharge ? `${e(fmt(b.plusCharge.iso, { weekday: 'long', day: 'numeric' }))}, ${svNom(b.plusCharge.service)}` : 'aucune réservation')}
        ${tuile('À confirmer', b.aConfirmer, b.aConfirmer ? 'cette semaine' : 'tout est à jour')}
      </div>
      <div class="esp-grille esp-grille--bilan">
        <article class="esp-carte esp-carte--large" aria-labelledby="t-jauges"><h3 id="t-jauges">Service par service</h3>
          ${lignes.length ? `<ul class="esp-jauges">${lignes.map((x) => `<li class="esp-jauge${x.part >= SEUIL_PLEIN ? ' est-pleine' : ''}"><span class="esp-jauge__nom">${e(maj(fmt(x.iso, { weekday: 'long', day: 'numeric' })))} <small>${svNom(x.sv)}</small></span><span class="esp-jauge__barre" aria-hidden="true" style="--v:${x.part.toFixed(3)}"></span><span class="esp-jauge__valeur"><b>${x.couverts}</b> / ${b.capacite}${x.complet ? ' <span class="esp-pastille esp-pastille--refusee">Complet</span>' : x.part >= SEUIL_PLEIN ? ' <span class="esp-pastille esp-pastille--a-confirmer">Presque plein</span>' : ''}</span></li>`).join('')}</ul>` : '<p class="esp-vide">Aucun service ouvert cette semaine.</p>'}
          ${fermes.length ? `<p class="esp-aide esp-jauges__fermes">Fermé : ${e(fermes.join(', '))}.</p>` : ''}
          <details class="esp-tableau"><summary>Voir en tableau</summary><div class="esp-table-defile" tabindex="0" role="group" aria-label="Couverts de la semaine, en tableau"><table class="esp-bilan-table"><caption class="visuellement-cache">Couverts par jour et par service</caption>
            <thead><tr><th scope="col">Jour</th><th scope="col">Midi</th><th scope="col">Soir</th><th scope="col">Total</th></tr></thead>
            <tbody>${b.jours.map((j) => `<tr><th scope="row">${e(maj(fmt(j.iso, { weekday: 'long', day: 'numeric' })))}</th>${['midi', 'soir'].map((sv) => `<td>${j.services[sv]?.ouvert || j.services[sv]?.couverts ? j.services[sv].couverts : 'fermé'}</td>`).join('')}<td>${Object.values(j.services).reduce((n, s) => n + s.couverts, 0)}</td></tr>`).join('')}</tbody>
            <tfoot><tr><th scope="row">Semaine</th>${['midi', 'soir'].map((sv) => `<td>${b.jours.reduce((n, j) => n + (j.services[sv]?.couverts || 0), 0)}</td>`).join('')}<td>${b.couverts}</td></tr></tfoot></table></div></details>
        </article>
        <article class="esp-carte" aria-labelledby="t-origines"><h3 id="t-origines">D'où viennent les réservations</h3>
          ${nbO ? `<ul class="esp-origines"><li><b>${o.site}</b><span>depuis le site</span></li><li><b>${o.telephone}</b><span>au téléphone</span></li><li><b>${o.demo}</b><span>exemples de démonstration</span></li></ul>` : '<p class="esp-vide">Aucune réservation cette semaine.</p>'}
          <p class="esp-aide">Faites une réservation sur la page Réserver, ou notez-en une prise au téléphone : elle apparaît ici.</p>
        </article>
      </div>`;
  }

  function clic(t) {
    const f = t.closest('[data-faire-conseil]'); if (f) { const c = liste().find((x) => x.id === f.dataset.faireConseil); if (!c) return true;
      if (c.action) { agir(c.action.nom, c.action.args, { msg: c.action.msg, lien: c.action.lien }); X.rendre(); ($('[data-faire-conseil]', root) || $(`#vue-${etat.vue}`, root))?.focus({ preventScroll: true }); } else X.executer({ aller: c.aller });
      return true; }
    const p = t.closest('[data-taire-conseil]'); if (p) { agir('taireConseil', { id: p.dataset.taireConseil, date: A.iso }, { msg: 'Entendu : cette suggestion revient demain si elle est toujours vraie.' }); X.rendre(); ($('[data-faire-conseil]', root) || $(`#vue-${etat.vue}`, root))?.focus({ preventScroll: true }); return true; }
    return false;
  }
  return { carteConseils, rendreBilan, clic, liste };
}
