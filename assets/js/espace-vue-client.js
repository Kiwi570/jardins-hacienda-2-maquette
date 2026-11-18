/* La fiche client (v7.7.6) : une fenêtre ouverte en touchant le nom d'un client, où qu'il apparaisse.
   Ce que l'agenda sait de lui (venues, à venir, absences, ses réservations) et ce que la maison note : habitué,
   allergies, préférences. Chaque changement est enregistré aussitôt (et s'annule). Les règles sont dans
   espace-clients.js ; ce fichier dessine et écoute. */
import { STATUTS, fmt, maj, heure, pluriel, typo } from './espace-regles.js?v=7';
import { ALLERGENES } from './espace-carte.js?v=7';
import { cleClient, marques, fiche } from './espace-clients.js?v=7';

export function creerClient(X) {
  const { root, $, $$, e, S, ctx, etat, agir } = X;
  let fen = null, retour = null, cle = null;

  /** Le nom d'un client, à toucher pour ouvrir sa fiche ; « Habitué » s'il l'est. */
  function nom(r) {
    const c = cleClient(r), n = e(r.nom || 'Sans nom');
    return c ? `<button type="button" class="esp-client" data-client="${e(c)}" aria-haspopup="dialog" aria-label="${n}, ouvrir sa fiche">${n}</button>${marques(S(), r).habitue ? ' <span class="esp-habitue">Habitué</span>' : ''}` : n;
  }
  /** Les allergies notées sur sa fiche, à montrer sur chacune de ses réservations (texte, sans balise). */
  const allergies = (r) => { const a = marques(S(), r).allergies; return a.length ? `Allergies\u00a0: ${a.join(', ').toLowerCase()}` : ''; };

  function contenu() {
    const f = fiche(ctx(), S(), cle);
    return `<header class="esp-modale__tete"><h2 id="client-titre">${e(f.nom)} <span class="esp-habitue" data-client-habitue${f.habitue ? '' : ' hidden'}>Habitué</span></h2><button type="button" class="esp-rond" data-fermer-client aria-label="Fermer">×</button></header>
      <div class="esp-fiche">
        <p class="esp-fiche__contact">${f.telephone ? `<a href="tel:${e(f.telephone.replace(/\s/g, ''))}">${e(f.telephone)}</a>` : 'Pas de téléphone noté.'}${f.exemple ? ' <span class="esp-source">Client d\'exemple, nom inventé</span>' : ''}</p>
        <ul class="esp-fiche__chiffres"><li><b>${f.venues}</b> ${f.venues > 1 ? 'venues' : 'venue'}</li><li><b>${f.aVenir}</b> à venir</li><li><b>${f.absences}</b> ${f.absences > 1 ? 'absences' : 'absence'}</li></ul>
        <form class="esp-fiche__form" data-form-client>
          <p><label class="esp-coche"><input type="checkbox" name="habitue"${f.habitue ? ' checked' : ''}><span>Habitué de la maison</span></label></p>
          <fieldset class="esp-champ"><legend>Allergies <small>elles s'affichent sur chacune de ses réservations et sur la feuille de service</small></legend>
            <div class="esp-puces">${ALLERGENES.map((a) => `<label class="esp-puce"><input type="checkbox" name="allergie" value="${e(a)}"${f.allergies.includes(a) ? ' checked' : ''}><span>${e(a)}</span></label>`).join('')}</div></fieldset>
          <p class="esp-champ"><label for="cl-note">Préférences et notes <small>table, vin, occasion…</small></label><textarea id="cl-note" name="note" rows="3" maxlength="400">${e(f.note)}</textarea></p>
          <p class="esp-fiche__etat" role="status" data-client-etat></p>
        </form>
        <h3>Dans l'agenda</h3>
        ${f.resas.length ? `<ol class="esp-fiche__histo">${f.resas.map((r) => `<li><span class="esp-fiche__quand"><b>${e(maj(fmt(r.date, { weekday: 'short', day: 'numeric', month: 'long' })))}</b> ${heure(r.heure)} · ${pluriel(+r.couverts, 'couvert')}${r.table ? ` · table ${e(r.table)}` : ''}${r.demande ? ` · ${e(typo(r.demande))}` : ''}</span><span class="esp-pastille esp-pastille--${r.statut}">${STATUTS[r.statut]}</span><button type="button" class="esp-bouton" data-voir-resa="${e(r.id)}" data-date="${r.date}" data-service="${r.service}" aria-label="Voir le service du ${e(fmt(r.date, { day: 'numeric', month: 'long' }))}">Voir</button></li>`).join('')}</ol>` : '<p class="esp-aide">Aucune réservation dans l\'agenda.</p>'}
        <p class="esp-aide">Démonstration\u00a0: l'agenda couvre la semaine passée et les quatre semaines à venir. Un vrai outil garde tout l'historique du client.</p>
      </div>`;
  }

  function fermer() { if (!fen || fen.hidden) return; noter(); fen.hidden = true; document.documentElement.classList.remove('esp-modale-ouverte'); X.rendre(); (retour && document.contains(retour) ? retour : $$(`[data-client="${CSS.escape(cle || '')}"]`, root).find((x) => x.offsetParent))?.focus?.(); }
  /* Enregistre ce qui a changé dans la fiche (rien si rien n'a changé). */
  function noter() {
    const f = $('[data-form-client]', fen); if (!f) return;
    const champs = { habitue: f.elements.habitue.checked, allergies: $$('input[name="allergie"]:checked', f).map((i) => i.value), note: f.elements.note.value }, avant = fiche(ctx(), S(), cle);
    if (champs.habitue === avant.habitue && champs.note.trim() === avant.note && champs.allergies.join('|') === avant.allergies.join('|')) return;
    if (agir('client', { cle, champs }, { msg: `Fiche de ${avant.nom} enregistrée.`, groupe: `client-${cle}` })) { $('[data-client-etat]', fen).textContent = 'Enregistré.'; $('[data-client-habitue]', fen).hidden = !champs.habitue; }
  }

  /** Ouvre la fiche du client `c` ; le focus revient à `depuis` à la fermeture. */
  function ouvrir(c, depuis) {
    if (!c) return; cle = c; retour = depuis || null;
    if (!fen) {
      fen = document.createElement('div'); fen.className = 'esp-modale esp-modale--petite esp-modale--fiche'; fen.hidden = true;
      fen.innerHTML = '<div class="esp-modale__fond" data-fermer-client></div><div class="esp-modale__boite" role="dialog" aria-modal="true" aria-labelledby="client-titre" data-client-boite></div>';
      root.append(fen);
      fen.addEventListener('click', (ev) => {
        if (ev.target.closest('[data-fermer-client]')) { fermer(); return; }
        const v = ev.target.closest('[data-voir-resa]');
        if (v) { const { voirResa, date, service } = v.dataset; fermer(); etat.jour = date; etat.ongletResas = 'service'; etat.serviceVu = service; etat.resaEditee = null; X.allerVue('resas'); X.viser($(`[data-esp-panneau-resas] [data-resa="${CSS.escape(voirResa)}"]`, root), 'center'); }
      });
      fen.addEventListener('change', (ev) => { if (ev.target.closest('[data-form-client]')) noter(); });
      fen.addEventListener('submit', (ev) => { ev.preventDefault(); ev.stopPropagation(); noter(); });
      /* Écouté sur la page entière : la fenêtre se ferme à Échap même si le focus en est sorti. */
      document.addEventListener('keydown', (ev) => {
        if (fen.hidden) return;
        if (ev.key === 'Escape') { ev.stopPropagation(); fermer(); }
        if (ev.key === 'Tab' && !fen.contains(document.activeElement)) { ev.preventDefault(); $('.esp-rond[data-fermer-client]', fen).focus(); return; }
        if (ev.key === 'Tab') { const f = $$('button, a[href], input, textarea', fen).filter((x) => x.offsetParent); if (ev.shiftKey && document.activeElement === f[0]) { ev.preventDefault(); f[f.length - 1].focus(); } else if (!ev.shiftKey && document.activeElement === f[f.length - 1]) { ev.preventDefault(); f[0].focus(); } }
      });
    }
    $('[data-client-boite]', fen).innerHTML = contenu();
    fen.hidden = false; document.documentElement.classList.add('esp-modale-ouverte'); $('.esp-rond[data-fermer-client]', fen).focus();
  }

  function clic(t) { const c = t.closest('[data-client]'); if (!c || c.closest('.esp-modale')) return false; ouvrir(c.dataset.client, c); return true; }
  return { nom, allergies, ouvrir, clic, fermer };
}
