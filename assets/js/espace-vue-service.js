/* L'onglet « Service » de la rubrique Réservations (v7.7.5) : les écrans.
   Le service d'un jour (midi ou soir) en frise : en haut, les couverts à table quart d'heure par quart d'heure et
   l'heure du coup de feu ; en dessous, une ligne par réservation, placée dans le temps sur ordinateur, en liste sur
   téléphone. Sur chaque ligne : « Arrivés », « Absent », « Modifier » (heure, couverts, nom, téléphone, note),
   « Annuler la réservation ». Et la feuille de service, à imprimer pour la salle et la cuisine.
   Les règles sont dans espace-service.js (fonctions pures). */
import { serviceDuJour, serviceCourant, gestes, heuresPossibles, dureeDe } from './espace-service.js?v=7';
import { STATUTS, fmt, maj, heure, hhmm, pluriel, typo, servicesDe } from './espace-regles.js?v=7';
import { tableApres } from './espace-salle.js?v=7';

const ICO_IMPR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8.5V4h10v4.5M7 17.5H5a1.5 1.5 0 0 1-1.5-1.5v-6A1.5 1.5 0 0 1 5 8.5h14a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-2M7 14h10v6H7z"/></svg>';

export function creerService(X) {
  const { root, $, e, S, A, D, ctx, etat, agir } = X;
  /* Le service montré : celui qu'on a choisi s'il a lieu ce jour-là, sinon celui du moment. */
  function svVu() {
    const c = etat.serviceVu, courant = serviceCourant(ctx(), S(), etat.jour, etat.jour === A.iso ? A.min : 0);
    if (!c || !servicesDe(D.reservation).some((s) => s.id === c)) return courant;
    const sv = serviceDuJour(ctx(), S(), etat.jour, c); return sv.ouvert || sv.resas.length ? c : courant;
  }
  const part = (sv, t) => `${(((t - sv.debut) / (sv.fin - sv.debut)) * 100).toFixed(2)}%`;

  function editeur(r) {
    const heures = heuresPossibles(ctx(), S(), r.date), connue = heures.some((h) => h.heure === r.heure);
    return `<form class="esp-frise__form" data-form-resa="${e(r.id)}" aria-label="Modifier la réservation de ${e(r.nom || 'ce client')}">
      <p class="esp-champ"><label for="mr-h">Heure</label><select id="mr-h" name="heure">${connue ? '' : `<option value="${e(r.heure)}" selected>${heure(r.heure)}</option>`}${heures.map((h) => `<option value="${h.heure}" data-sv="${h.service}"${h.heure === r.heure ? ' selected' : ''}>${heure(h.heure)} (${h.service})</option>`).join('')}</select></p>
      <p class="esp-champ"><label for="mr-c">Couverts</label><input id="mr-c" name="couverts" type="number" inputmode="numeric" min="1" max="60" value="${e(r.couverts)}"></p>
      <p class="esp-champ"><label for="mr-n">Nom</label><input id="mr-n" name="nom" value="${e(r.nom)}" autocomplete="off"></p>
      <p class="esp-champ"><label for="mr-t">Téléphone</label><input id="mr-t" name="telephone" type="tel" value="${e(r.telephone || '')}" autocomplete="off"></p>
      <p class="esp-champ esp-champ--large"><label for="mr-d">Note <small>allergie, chaise haute, occasion…</small></label><input id="mr-d" name="demande" value="${e(r.demande || '')}" autocomplete="off"></p>
      <p class="esp-frise__form-actions"><button type="submit" class="bouton">Enregistrer</button><button type="button" class="esp-bouton esp-bouton--discret" data-modifier-resa="${e(r.id)}">Fermer</button></p></form>`;
  }
  function ligne(r, sv) {
    const g = gestes(r, A.iso), ouverte = etat.resaEditee === r.id, hors = ['refusee', 'annulee', 'absente'].includes(r.statut);
    return `<li class="esp-frise__ligne est-${r.statut}${ouverte ? ' est-ouverte' : ''}" data-resa="${e(r.id)}">
      <div class="esp-frise__qui"><p class="esp-frise__heure">${heure(r.heure)}</p><div><p class="esp-frise__nom">${X.nomClient(r)} <span class="esp-pastille esp-pastille--${r.statut}">${STATUTS[r.statut]}</span></p>
        <p class="esp-frise__detail">${pluriel(+r.couverts, 'couvert')}${r.table ? ` · table ${e(r.table)}` : ''}${r.demande ? ` · <span class="esp-resa__demande">${e(r.demande)}</span>` : ''}${X.allergiesClient(r) ? ` · <span class="esp-resa__allergie">${e(X.allergiesClient(r))}</span>` : ''}</p></div></div>
      <div class="esp-frise__piste" aria-hidden="true">${hors ? '' : `<span class="esp-frise__bloc" style="--d:${part(sv, r.debutMin)};--l:${(((r.finMin - r.debutMin) / (sv.fin - sv.debut)) * 100).toFixed(2)}%"><b>${+r.couverts}</b></span>`}</div>
      <p class="esp-frise__actions">${g.map((x) => `<button type="button" class="esp-bouton${x.genre === 'ok' ? ' esp-bouton--ok' : x.genre === 'non' ? ' esp-bouton--non' : ''}" data-statut="${x.statut}" data-id="${e(r.id)}">${x.libelle}</button>`).join('')}<button type="button" class="esp-bouton esp-bouton--discret" data-modifier-resa="${e(r.id)}" aria-expanded="${ouverte}">Modifier</button></p>
      ${ouverte ? editeur(r) : ''}</li>`;
  }

  /** Dessine l'onglet dans `cible`. */
  function rendre(cible) {
    const id = svVu(), sv = serviceDuJour(ctx(), S(), etat.jour, id), svs = servicesDe(D.reservation), max = Math.max(6, sv.pic?.couverts || 0); /* la frise se lit par rapport au coup de feu du service */
    const heures = []; for (let t = Math.ceil(sv.debut / 60) * 60; t <= sv.fin; t += 60) heures.push(t);
    const maintenant = etat.jour === A.iso && A.min >= sv.debut && A.min <= sv.fin ? A.min : null;
    const resume = [pluriel(sv.couverts, 'couvert'), pluriel(sv.tables, 'table'), sv.arrives ? `${sv.arrives} arrivée${sv.arrives > 1 ? 's' : ''} sur ${sv.tables}` : '', sv.absents ? pluriel(sv.absents, 'absent') : '', sv.aConfirmer ? `${sv.aConfirmer} à confirmer` : ''].filter(Boolean).join(' · ');
    cible.innerHTML = `
      <div class="esp-service-tete"><div><h3>${e(maj(fmt(etat.jour)))}${etat.jour === A.iso ? ' <span class="esp-pastille">Aujourd\'hui</span>' : ''}</h3>
          <p class="esp-service-tete__resume">${sv.ouvert || sv.resas.length ? e(resume) : 'Pas de service.'}${sv.complet ? ' · <span class="esp-pastille esp-pastille--refusee">Complet</span>' : ''}</p></div>
        <p class="esp-service-tete__outils"><span class="esp-choix" role="group" aria-label="Le service à voir">${svs.map((s) => `<button type="button" class="esp-choix__b" data-service-vu="${s.id}" aria-pressed="${s.id === id}">${s.libelle}</button>`).join('')}</span>
          <button type="button" class="esp-bouton" data-imprimer-service>${ICO_IMPR}<span>Imprimer la feuille</span></button></p></div>
      ${sv.tables ? `<article class="esp-carte esp-charge" aria-labelledby="t-charge"><h3 id="t-charge">Couverts à table${sv.pic?.couverts ? ` <small>coup de feu à ${heure(hhmm(sv.pic.t))} : ${pluriel(sv.pic.couverts, 'couvert')}</small>` : ''}</h3>
        <div class="esp-charge__graphe" role="img" aria-label="Couverts à table, quart d'heure par quart d'heure, de ${heure(hhmm(sv.debut))} à ${heure(hhmm(sv.fin))}. Maximum : ${sv.pic?.couverts || 0} à ${heure(hhmm(sv.pic?.t || sv.debut))}.">
          ${sv.charge.map((c) => `<span class="esp-charge__barre${c === sv.pic ? ' est-pic' : ''}" style="--h:${(c.couverts / max).toFixed(3)}" data-info="${heure(hhmm(c.t))} · ${c.couverts} couv.">${c === sv.pic ? `<b>${c.couverts}</b>` : ''}</span>`).join('')}
          ${maintenant != null ? `<span class="esp-charge__maintenant" style="--d:${part(sv, maintenant)}"><span>maintenant</span></span>` : ''}</div>
        <p class="esp-charge__axe" aria-hidden="true">${heures.map((t) => `<span style="--d:${part(sv, t)}">${heure(hhmm(t))}</span>`).join('')}</p>
        <p class="esp-aide">Un repas compte ${dureeDe(id) / 60 === Math.floor(dureeDe(id) / 60) ? `${dureeDe(id) / 60} h` : `${Math.floor(dureeDe(id) / 60)} h ${dureeDe(id) % 60}`} à table : durée indicative, à régler avec vous.</p>
        <details class="esp-tableau"><summary>Voir en tableau</summary><div class="esp-table-defile" tabindex="0" role="group" aria-label="Couverts à table, en tableau"><table class="esp-bilan-table"><caption class="visuellement-cache">Couverts à table par quart d'heure</caption><thead><tr><th scope="col">Heure</th><th scope="col">Couverts à table</th></tr></thead><tbody>${sv.charge.map((c) => `<tr><th scope="row">${heure(hhmm(c.t))}</th><td>${c.couverts}</td></tr>`).join('')}</tbody></table></div></details></article>` : ''}
      ${sv.resas.length ? `<div class="esp-frise" style="--n:${heures.length}"><p class="esp-frise__axe" aria-hidden="true"><span></span><span class="esp-frise__heures">${heures.map((t) => `<span style="--d:${part(sv, t)}">${heure(hhmm(t))}</span>`).join('')}</span><span></span></p>
        <ol class="esp-frise__liste">${sv.resas.map((r) => ligne(r, sv)).join('')}</ol></div>`
        : `<p class="esp-vide">${sv.ouvert ? 'Pas encore de réservation pour ce service. <button type="button" class="esp-lien" data-onglet="agenda" data-onglets-resas>Noter une réservation dans l\'agenda</button>' : 'Pas de service ce jour-là.'}</p>`}`;
  }

  /** La feuille de service, pour la salle et la cuisine : une page, l'heure, le nom, les couverts, la note, une case à cocher. */
  function feuille() {
    const id = svVu(), sv = serviceDuJour(ctx(), S(), etat.jour, id), l = sv.resas.filter((r) => !['refusee', 'annulee'].includes(r.statut));
    return `<header><p class="esp-feuille__maison">Les Jardins de l'Hacienda</p><h1>Feuille de service</h1><p class="esp-feuille__quand">${e(maj(fmt(etat.jour, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })))}, ${id === 'midi' ? 'midi' : 'soir'} · ${pluriel(sv.couverts, 'couvert')} · ${pluriel(sv.tables, 'table')}${sv.pic?.couverts ? ` · coup de feu à ${heure(hhmm(sv.pic.t))}` : ''}</p></header>
      <table><thead><tr><th>Heure</th><th>Nom</th><th>Couv.</th><th>Note</th><th>Téléphone</th><th>Table</th><th>Arrivés</th></tr></thead>
      <tbody>${l.map((r) => `<tr><td>${heure(r.heure)}</td><td>${e(r.nom || 'Sans nom')}${r.statut === 'a-confirmer' ? ' <em>(à confirmer)</em>' : r.statut === 'absente' ? ' <em>(absent)</em>' : ''}</td><td>${+r.couverts}</td><td>${e(typo([r.demande, X.allergiesClient(r)].filter(Boolean).join(' · ')))}</td><td>${e(r.telephone || '')}</td><td>${e(r.table || '')}</td><td><span class="esp-feuille__case${r.statut === 'arrivee' ? ' est-cochee' : ''}"></span></td></tr>`).join('') || '<tr><td colspan="7">Aucune réservation.</td></tr>'}</tbody></table>
      <footer><p>Démonstration : réservations d'exemple, noms inventés.</p></footer>`;
  }
  function imprimer() {
    document.querySelector('.esp-feuille')?.remove();
    const f = document.createElement('div'); f.className = 'esp-feuille'; f.innerHTML = feuille(); document.body.append(f);
    document.documentElement.classList.add('esp-impression');
    const fin = () => { document.documentElement.classList.remove('esp-impression'); f.remove(); removeEventListener('afterprint', fin); };
    addEventListener('afterprint', fin);
    try { print(); } catch { fin(); X.dire('L\'impression n\'a pas pu démarrer sur ce navigateur.'); }
  }

  function clic(t) {
    const sv = t.closest('[data-service-vu]'); if (sv) { etat.serviceVu = sv.dataset.serviceVu; etat.resaEditee = null; X.rendre(); $(`[data-service-vu="${etat.serviceVu}"]`, root)?.focus(); return true; }
    if (t.closest('[data-imprimer-service]')) { imprimer(); return true; }
    const m = t.closest('[data-modifier-resa]'); if (m) { const id = m.dataset.modifierResa, ouvrir = etat.resaEditee !== id; etat.resaEditee = ouvrir ? id : null; X.rendre(); (ouvrir ? $('#mr-h', root) : $(`[data-resa="${CSS.escape(id)}"] [data-modifier-resa]`, root))?.focus(); return true; }
    return false;
  }
  function envoi(f) {
    if (!f.matches('[data-form-resa]')) return false;
    const id = f.dataset.formResa, v = Object.fromEntries(new FormData(f)), svChoisi = f.elements.heure.selectedOptions[0]?.dataset.sv;
    const champs = { heure: v.heure, couverts: v.couverts, nom: v.nom, telephone: v.telephone, demande: v.demande, ...(svChoisi ? { service: svChoisi } : {}) };
    /* La table ne convient plus après la modification (trop petite, prise à la nouvelle heure) : elle est retirée, et dit. */
    const r = servicesDe(D.reservation).flatMap((s) => serviceDuJour(ctx(), S(), etat.jour, s.id).resas).find((x) => x.id === id), ta = r ? tableApres(ctx(), S(), D.salle, r, champs) : { convient: true };
    if (!ta.convient) champs.table = '';
    if (agir('modifierResa', { id, champs }, { msg: ta.convient ? 'Réservation modifiée.' : `Réservation modifiée. La table ${ta.table} ne convient plus (${ta.raison}) : elle est à replacer.` })) { etat.resaEditee = null; if (svChoisi) etat.serviceVu = svChoisi; }
    X.rendre(); X.viser($(`[data-esp-panneau-resas] [data-resa="${CSS.escape(id)}"]`, root), 'center'); $(`[data-esp-panneau-resas] [data-resa="${CSS.escape(id)}"] [data-modifier-resa]`, root)?.focus({ preventScroll: true });
    return true;
  }
  return { rendre, clic, envoi, feuille, serviceVu: svVu };
}
