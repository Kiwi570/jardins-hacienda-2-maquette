/* La fiche client (v7.7.6) : une fenêtre ouverte en touchant le nom d'un client, où qu'il apparaisse.
   Ce que l'agenda sait de lui (venues, à venir, absences, ses réservations) et ce que la maison note : habitué,
   allergies, préférences. Chaque changement est enregistré aussitôt (et s'annule). Les règles sont dans
   espace-clients.js ; ce fichier dessine et écoute. */
import { STATUTS, fmt, maj, heure, pluriel, typo } from './espace-regles.js?v=7';
import { ALLERGENES } from './espace-carte.js?v=7';
import { cleClient, marques, fiche, notesDe, changementsFiche, demandesDuClient } from './espace-clients.js?v=7';
import { GENRES, libelleEtape } from './espace-demandes.js?v=7';

export function creerClient(X) {
  const { root, $, $$, e, S, A, ctx, etat, agir } = X;
  let fen = null, retour = null, cle = null, ouverture = null;

  /** Le nom d'un client, à toucher pour ouvrir sa fiche ; « Habitué » s'il l'est. */
  function nom(r) {
    const c = cleClient(r), n = e(r.nom || 'Sans nom');
    return c ? `<button type="button" class="esp-client" data-client="${e(c)}" aria-haspopup="dialog" aria-label="${n}, ouvrir sa fiche">${n}</button>${marques(S(), r).habitue ? ' <span class="esp-habitue">Habitué</span>' : ''}` : n;
  }
  /** Les allergies notées sur sa fiche, à montrer sur chacune de ses réservations (texte, sans balise). */
  const allergies = (r) => { const a = marques(S(), r).allergies; return a.length ? `Allergies\u00a0: ${a.join(', ').toLowerCase()}` : ''; };

  function contenu() {
    const f = fiche(ctx(), S(), cle), dem = X.demandes ? demandesDuClient(X.demandes(), cle) : [];
    if (f.nom === 'Sans nom' && dem[0]) { f.nom = dem[0].qui; f.telephone ||= dem[0].telephone; }
    return `<header class="esp-modale__tete"><h2 id="client-titre">${e(f.nom)} <span class="esp-habitue" data-client-habitue${f.habitue ? '' : ' hidden'}>Habitué</span></h2><button type="button" class="esp-rond" data-fermer-client aria-label="Fermer">×</button></header>
      <div class="esp-fiche">
        <p class="esp-fiche__contact">${f.telephone ? `<a href="tel:${e(f.telephone.replace(/\s/g, ''))}">${e(f.telephone)}</a>` : 'Pas de téléphone noté.'}${f.exemple ? ' <span class="esp-source">Client d\'exemple, nom inventé</span>' : ''}</p>
        <p class="esp-fiche__periode">Sur la période affichée, du ${e(fmt(f.periode.du, { day: 'numeric', month: 'long' }))} au ${e(fmt(f.periode.au, { day: 'numeric', month: 'long' }))}\u00a0:</p>
        <ul class="esp-fiche__chiffres"><li><b>${f.venues}</b> ${f.venues > 1 ? 'venues' : 'venue'}</li><li><b>${f.aVenir}</b> à venir</li><li><b>${f.absences}</b> ${f.absences > 1 ? 'absences' : 'absence'}</li></ul>
        ${f.prochaine ? `<p class="esp-fiche__prochaine">Prochaine venue\u00a0: <b>${e(maj(fmt(f.prochaine.date, { weekday: 'long', day: 'numeric', month: 'long' })))} à ${heure(f.prochaine.heure)}</b>, ${pluriel(+f.prochaine.couverts, 'couvert')}${f.prochaine.statut === 'a-confirmer' ? ' (demande à confirmer)' : ''}.</p>` : ''}
        ${f.aClarifier.length ? `<p class="esp-fiche__clarifier">${f.aClarifier.map((r) => `Attendu ${r.date === A.iso ? 'aujourd\'hui' : e(fmt(r.date, { weekday: 'long', day: 'numeric', month: 'long' }))} à ${heure(r.heure)}, l'heure est passée\u00a0: <button type="button" class="esp-lien" data-voir-resa="${e(r.id)}" data-date="${r.date}" data-service="${r.service}">dire s'il est venu</button>`).join('<br>')}</p>` : ''}
        ${f.ancienne ? `<p class="esp-fiche__ancienne" data-ancienne><span class="esp-source">À vérifier</span> Une note existe sous le même nom, prise avant que les fiches soient distinguées\u00a0: ${e([f.ancienne.habitue ? 'habitué' : '', f.ancienne.allergies.length ? `allergies : ${f.ancienne.allergies.join(', ')}` : '', f.ancienne.note].filter(Boolean).join(' ; '))}. Elle n'est appliquée à personne tant que vous ne l'avez pas confirmé. <button type="button" class="esp-bouton" data-rattacher="${e(f.ancienne.cle)}">C'est bien cette personne</button></p>` : ''}
        <form class="esp-fiche__form" data-form-client>
          <p><label class="esp-coche"><input type="checkbox" name="habitue"${f.habitue ? ' checked' : ''}><span>Habitué de la maison</span></label></p>
          <fieldset class="esp-champ"><legend>Allergies <small>elles s'affichent sur chacune de ses réservations et sur la feuille de service</small></legend>
            <div class="esp-puces">${ALLERGENES.map((a) => `<label class="esp-puce"><input type="checkbox" name="allergie" value="${e(a)}"${f.allergies.includes(a) ? ' checked' : ''}><span>${e(a)}</span></label>`).join('')}</div></fieldset>
          <p class="esp-champ"><label for="cl-note">Préférences et notes <small>table, vin, occasion…</small></label><textarea id="cl-note" name="note" rows="3" maxlength="400">${e(f.note)}</textarea></p>
          <p class="esp-fiche__portee"><span class="esp-source">Sur cet appareil</span> Ces notes sont enregistrées sur cet appareil${X.ctx().exemples === false ? ' : elles ne sont pas encore partagées avec les autres' : ''}.</p>
          <p class="esp-fiche__etat" role="status" data-client-etat></p>
        </form>
        ${dem.length ? `<h3>Ses demandes</h3><ul class="esp-fiche__histo esp-fiche__demandes">${dem.map((d) => `<li><span class="esp-fiche__quand"><b>${e(GENRES[d.genre]?.nom || 'Demande')}</b> ${e(d.titre)}</span> <span class="esp-pastille">${e(libelleEtape(d.genre, d.statut))}</span> <button type="button" class="esp-lien" data-voir-demande-client="${e(d.id)}">Voir la demande</button></li>`).join('')}</ul>` : ''}
        <h3>Dans l'agenda</h3>
        ${f.resas.length ? `<ol class="esp-fiche__histo">${f.resas.map((r) => `<li><span class="esp-fiche__quand"><b>${e(maj(fmt(r.date, { weekday: 'short', day: 'numeric', month: 'long' })))}</b> ${heure(r.heure)} · ${pluriel(+r.couverts, 'couvert')}${r.table ? ` · table ${e(r.table)}` : ''}${r.demande ? ` · ${e(typo(r.demande))}` : ''}</span><span class="esp-pastille esp-pastille--${r.statut}">${STATUTS[r.statut]}</span><button type="button" class="esp-bouton" data-voir-resa="${e(r.id)}" data-date="${r.date}" data-service="${r.service}" aria-label="Voir le service du ${e(fmt(r.date, { day: 'numeric', month: 'long' }))}">Voir</button></li>`).join('')}</ol>` : '<p class="esp-aide">Aucune réservation dans l\'agenda.</p>'}
        <p class="esp-aide">${X.ctx().exemples === false ? 'L\'historique affiché couvre' : 'Démonstration\u00a0: l\'agenda couvre'} la semaine passée et les quatre semaines à venir.</p>
      </div>`;
  }

  function fermer() { if (!fen || fen.hidden) return; noter(); ouverture = null; fen.hidden = true; document.documentElement.classList.remove('esp-modale-ouverte'); X.rendre(); (retour && document.contains(retour) ? retour : $$(`[data-client="${CSS.escape(cle || '')}"]`, root).find((x) => x.offsetParent))?.focus?.(); }
  /* Enregistre ce que la personne a réellement changé depuis l'ouverture de la fiche, et rien d'autre (v7.8.1) : une
     fiche intacte n'écrit rien à sa fermeture, et une allergie notée ailleurs entre-temps n'est jamais effacée. Si le
     même champ a été changé ailleurs, la version enregistrée est gardée et montrée, et la fiche le dit. */
  function noter() {
    const f = $('[data-form-client]', fen); if (!f || !ouverture) return;
    const saisie = { habitue: f.elements.habitue.checked, allergies: $$('input[name="allergie"]:checked', f).map((i) => i.value), note: f.elements.note.value };
    const courant = notesDe(S(), cle), { champs, conflits } = changementsFiche(ouverture, saisie, courant), dit = $('[data-client-etat]', fen);
    if (champs && !agir('client', { cle, champs }, { msg: `Fiche de ${fiche(ctx(), S(), cle).nom} : notes enregistrées sur cet appareil.`, groupe: `client-${cle}` })) { dit.textContent = 'Non enregistré : votre navigateur a refusé.'; return; }
    if (!champs && !conflits.length) return;
    /* La fiche repart de ce qui est enregistré maintenant : les allergies ajoutées ailleurs apparaissent, un champ en conflit reprend sa valeur enregistrée. */
    const apres = notesDe(S(), cle);
    if (conflits.includes('note')) f.elements.note.value = apres.note; if (conflits.includes('habitue')) f.elements.habitue.checked = apres.habitue;
    for (const i of $$('input[name="allergie"]', f)) i.checked = apres.allergies.includes(i.value);
    ouverture = { habitue: apres.habitue, allergies: [...apres.allergies], note: apres.note }; $('[data-client-habitue]', fen).hidden = !apres.habitue;
    dit.textContent = conflits.length ? `${conflits.includes('note') ? 'Les préférences' : 'La mention « Habitué »'} ${conflits.length > 1 ? 'et la mention « Habitué » ont' : conflits.includes('note') ? 'ont' : 'a'} été modifiée${conflits.includes('note') ? 's' : ''} ailleurs pendant que la fiche était ouverte : la version enregistrée est affichée, la vôtre n'a pas été prise.` : 'Enregistré.';
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
        const ra = ev.target.closest('[data-rattacher]'); if (ra) { agir('rattacherNotes', { de: ra.dataset.rattacher, vers: cle }, { msg: 'Notes rattachées à cette fiche, sur cet appareil.' }); $('[data-client-boite]', fen).innerHTML = contenu(); X.rendre(); return; }
        const vd = ev.target.closest('[data-voir-demande-client]'); if (vd) { fermer(); X.executer({ aller: { vue: 'demandes', filtre: 'tout', demande: vd.dataset.voirDemandeClient } }); return; }
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
    /* L'état de la fiche à son ouverture : on n'enregistrera que ce qui s'en écarte. */
    { const n = notesDe(S(), cle); ouverture = { habitue: n.habitue, allergies: [...n.allergies], note: n.note }; }
    fen.hidden = false; document.documentElement.classList.add('esp-modale-ouverte'); $('.esp-rond[data-fermer-client]', fen).focus();
  }

  function clic(t) { const c = t.closest('[data-client]'); if (!c || c.closest('.esp-modale')) return false; ouvrir(c.dataset.client, c); return true; }
  return { nom, allergies, ouvrir, clic, fermer };
}
