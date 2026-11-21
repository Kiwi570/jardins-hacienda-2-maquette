/* « Votre venue aux Jardins » (v7.11.0) : la page du client pour UNE réservation (voir source/pages/votre-venue.mjs).
   Les règles sont dans espace-venue.js (fonctions pures, testées). Démonstration : la page lit les réservations de ce
   navigateur et note ce que le client fait dans le stockage commun ; l'espace du restaurant le voit aussitôt.
   Rien n'est envoyé. En mode connecté, la page ne lit rien en local : elle renvoie vers le téléphone. */
import { lire, resasSite, venues, noterVenue, ecouter, CONTEXTE, horloge as horlogeDemo } from './espace-stock.js?v=7';
import { equipeDe } from './disponibilites.js?v=7';
import { trouverResa, aujourdhui, fixerHorloge, fmt, maj, heure, hhmm, typo, pluriel } from './espace-regles.js?v=7';
import { codeVenue, etatVenue, actionsVenue, heuresVenue, refusModifVenue } from './espace-venue.js?v=7';
import { nomPlace } from './espace-salle.js?v=7';

const e = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function init(root) {
  const corps = root.querySelector('[data-venue-corps]'); let D; try { D = JSON.parse(root.querySelector('[data-venue-donnees]').textContent); } catch { return; }
  const q = new URLSearchParams(location.search), id = q.get('r') || '', code = q.get('c') || '', R = D.reservation;
  const connecte = !!document.querySelector('meta[name="jh-api"]');
  /* v7.11.1 : ouverte depuis un scénario de démonstration, la page lit ses données et son heure simulée. */
  if (CONTEXTE && horlogeDemo()) fixerHorloge(() => horlogeDemo());
  const etat = { outil: '', message: '', erreur: '' };
  const tel = `<a href="tel:${e(D.telephoneLien)}">${e(D.telephone)}</a>`;
  const pied = `<section class="venue__bloc" aria-labelledby="venue-pratique"><h2 id="venue-pratique">Informations pratiques</h2>
      <ul class="venue__pratique"><li><b>Adresse</b> ${e(D.adresse)}</li><li><b>Téléphone</b> ${tel}</li><li><a class="venue__lien" href="${e(D.liens.infos)}">Accès, horaires et stationnement</a></li></ul></section>
    <section class="venue__bloc" aria-labelledby="venue-conditions"><h2 id="venue-conditions">Conditions</h2>
      <p>Les conditions d'annulation et de retard seront précisées ici par le restaurant. En cas d'empêchement, prévenez-nous dès que possible.</p></section>`;
  const demo = () => `<p class="venue__demo"><span>Démonstration</span> Cette page lit les réservations enregistrées dans ce navigateur. Aucun message n'est envoyé.${CONTEXTE && horlogeDemo() ? ` Scénario en cours\u00a0: nous sommes le ${fmt(aujourdhui().iso, { weekday: 'long', day: 'numeric', month: 'long' })}, ${heure(hhmm(aujourdhui().min))} (heure simulée). <a class="venue__lien" href="/espace">Revenir à l'espace</a>` : ''}</p>`;

  function lireResa() {
    const maintenant = aujourdhui(), S = lire(), ctx = { R, auj: maintenant.iso, site: resasSite(), exceptions: [], scenario: CONTEXTE };
    const r = id ? trouverResa(ctx, S, id) : null;
    return { r: r && codeVenue(r.id, r.telephone) === code ? r : null, S, maintenant, v: venues()[id] || {}, equipe: equipeDe(S, []) };
  }
  function introuvable() {
    corps.innerHTML = typo(`<div class="venue__carte venue__carte--vide" tabindex="-1" data-venue-focus><p class="venue__etat venue__etat--annulee">Réservation introuvable</p>
      <p>${connecte ? 'Sur ce site d\'essai, la page « Votre venue » n\'est pas encore reliée au restaurant.' : 'Nous ne retrouvons pas cette réservation : le lien est incomplet, ou il a été ouvert sur un autre appareil que celui de la démonstration.'} Pour voir, modifier ou annuler votre réservation, appelez-nous : ${tel}.</p>
      <p class="venue__actions"><a class="bouton" href="${e(D.liens.reserver)}">Réserver une table</a></p></div>${pied}${connecte ? '' : demo()}`);
  }
  function rendre(focus) {
    if (connecte) { introuvable(); return; }
    const { r, v, maintenant, equipe } = lireResa(); if (!r) { introuvable(); return; }
    const ev = etatVenue(r, v, maintenant.iso, maintenant.min), actions = actionsVenue(r, v, maintenant.iso, maintenant.min), heures = heuresVenue(R, r, { auj: maintenant.iso, minute: maintenant.min, equipe });
    const ligne = (k, val) => (val ? `<div><dt>${k}</dt><dd>${val}</dd></div>` : '');
    const outil = etat.outil === 'modifier' && actions.includes('modifier') ? `<form class="venue__form" data-venue-form="modifier" aria-labelledby="venue-f-modif"><h3 id="venue-f-modif">Demander un changement</h3>
          <p class="venue__champ"><label for="venue-heure">Heure d'arrivée</label><select id="venue-heure" name="heure">${heures.map((h) => `<option value="${h.heure}" data-sv="${h.service}"${h.heure === r.heure ? ' selected' : ''}>${e(h.libelle)}</option>`).join('')}</select></p>
          <p class="venue__champ"><label for="venue-couverts">Nombre de personnes</label><input id="venue-couverts" name="couverts" type="number" inputmode="numeric" min="1" max="${R.couverts_max ?? 10}" value="${e(r.couverts)}" required></p>
          <p class="venue__note">C'est une demande : votre réservation actuelle (${heure(r.heure)}, ${pluriel(+r.couverts, 'personne')}) est gardée tant que le restaurant n'a pas répondu.</p>
          ${etat.erreur ? `<p class="venue__erreur" role="alert">${e(etat.erreur)}</p>` : ''}
          <p class="venue__actions"><button type="submit" class="bouton">Envoyer ma demande de changement</button><button type="button" class="bouton bouton--contour" data-venue-fermer>Ne rien changer</button></p></form>`
      : etat.outil === 'completer' && actions.includes('completer') ? `<form class="venue__form" data-venue-form="completer" aria-labelledby="venue-f-comp"><h3 id="venue-f-comp">Ajouter une information</h3>
          <p class="venue__champ"><label for="venue-info">Allergie, occasion, chaise haute, accès… <small>280 caractères au plus</small></label><textarea id="venue-info" name="texte" rows="3" maxlength="280" required>${e(v.complement?.texte || '')}</textarea></p>
          ${etat.erreur ? `<p class="venue__erreur" role="alert">${e(etat.erreur)}</p>` : ''}
          <p class="venue__actions"><button type="submit" class="bouton">Transmettre au restaurant</button><button type="button" class="bouton bouton--contour" data-venue-fermer>Fermer</button></p></form>`
      : etat.outil === 'annuler' && actions.includes('annuler') ? `<div class="venue__form" role="group" aria-labelledby="venue-f-ann"><h3 id="venue-f-ann">Annuler votre réservation du ${e(fmt(r.date, { weekday: 'long', day: 'numeric', month: 'long' }))} à ${heure(r.heure)}&nbsp;?</h3>
          <p class="venue__note">La table sera rendue. Pour revenir, il faudra faire une nouvelle demande.</p>
          <p class="venue__actions"><button type="button" class="bouton" data-venue-annuler-oui>Oui, annuler ma réservation</button><button type="button" class="bouton bouton--contour" data-venue-fermer>Non, je la garde</button></p></div>` : '';
    corps.innerHTML = typo(`<div class="venue__carte" tabindex="-1" data-venue-focus data-venue-etat="${ev.etat}">
        <p class="venue__etat venue__etat--${ev.etat}">${e(ev.libelle)}</p>
        <p class="venue__phrase">${e(ev.phrase)}</p>
        ${etat.message ? `<p class="venue__message" role="status">${e(etat.message)}</p>` : ''}
        ${v.reconfirmee && ev.etat !== 'annulee' ? '<p class="venue__info">Vous avez confirmé votre venue. Merci&nbsp;!</p>' : ''}
        ${v.modif ? `<p class="venue__info venue__info--attente"><b>Changement demandé&nbsp;:</b> ${heure(v.modif.heure)}, ${pluriel(+v.modif.couverts, 'personne')}. En attente de la réponse du restaurant. <button type="button" class="venue__lien" data-venue-retirer>Retirer ma demande de changement</button></p>` : ''}
        ${v.reponse && v.reponse.acceptee === false && !v.modif ? '<p class="venue__info venue__info--attente">Le restaurant n\'a pas pu accepter le changement demandé : votre réservation initiale est maintenue.</p>' : ''}
        <dl class="venue__recap">${ligne('Date', e(maj(fmt(r.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))))}${ligne('Heure d\'arrivée', heure(r.heure))}${ligne('Personnes', String(+r.couverts))}${ligne('Au nom de', e(r.nom || ''))}
          ${ligne('Installation', r.table ? e(maj(nomPlace(r.table))) : r.espace === 'terrasse' ? 'En terrasse, selon la météo' : 'En salle')}${ligne('Vos précisions', e([r.demande, v.complement?.texte && !String(r.demande || '').includes(v.complement.texte) ? v.complement.texte : ''].filter(Boolean).join(' · ')))}${ligne('Référence', e(r.id))}</dl>
        ${actions.length && !outil ? `<p class="venue__actions">${actions.includes('reconfirmer') ? '<button type="button" class="bouton" data-venue-reconfirmer>Je confirme ma venue</button>' : ''}${actions.includes('modifier') ? '<button type="button" class="bouton bouton--contour" data-venue-outil="modifier">Changer l\'heure ou le nombre de personnes</button>' : ''}${actions.includes('completer') ? '<button type="button" class="bouton bouton--contour" data-venue-outil="completer">Ajouter une information</button>' : ''}${actions.includes('annuler') ? '<button type="button" class="venue__lien" data-venue-outil="annuler">Annuler ma réservation</button>' : ''}</p>` : ''}
        ${outil}
        ${!actions.length ? `<p class="venue__note">Pour toute question, appelez-nous : ${tel}. <a class="venue__lien" href="${e(D.liens.reserver)}">Faire une nouvelle demande</a></p>` : ''}
      </div>
      <p class="venue__contact">Une question, un retard&nbsp;? Appelez-nous : ${tel}.</p>${pied}${demo()}`);
    if (focus) corps.querySelector(focus)?.focus({ preventScroll: focus === '[data-venue-focus]' });
  }
  const dire = (m) => { etat.message = m; etat.outil = ''; etat.erreur = ''; rendre('[data-venue-focus]'); };
  const maintenantIso = () => new Date().toISOString();
  corps.addEventListener('click', (ev) => {
    const t = ev.target, o = t.closest('[data-venue-outil]');
    if (o) { etat.outil = o.dataset.venueOutil; etat.message = ''; etat.erreur = ''; rendre('.venue__form select, .venue__form textarea, .venue__form button'); return; }
    if (t.closest('[data-venue-fermer]')) { const k = etat.outil; etat.outil = ''; etat.erreur = ''; rendre(`[data-venue-outil="${k}"]`); return; }
    if (t.closest('[data-venue-reconfirmer]')) { if (noterVenue(id, { reconfirmee: maintenantIso() })) dire('Merci : votre venue est confirmée de votre côté.'); else dire('Votre confirmation n\'a pas pu être enregistrée : appelez-nous.'); return; }
    if (t.closest('[data-venue-annuler-oui]')) { if (noterVenue(id, { annulee: maintenantIso(), modif: null })) dire('Votre réservation est annulée. Le restaurant est prévenu.'); else dire('L\'annulation n\'a pas pu être enregistrée : appelez-nous.'); return; }
    if (t.closest('[data-venue-retirer]')) { if (noterVenue(id, { modif: null })) dire('Votre demande de changement est retirée : votre réservation ne change pas.'); return; }
  });
  corps.addEventListener('submit', (ev) => {
    ev.preventDefault(); const f = ev.target.closest('[data-venue-form]'); if (!f) return;
    const { r, maintenant, equipe } = lireResa(); if (!r) { introuvable(); return; }
    if (f.dataset.venueForm === 'modifier') {
      const modif = { heure: f.elements.heure.value, service: f.elements.heure.selectedOptions[0]?.dataset.sv || r.service, couverts: Math.round(+f.elements.couverts.value) || 0, cree: maintenantIso() };
      const refus = refusModifVenue(R, r, modif, { auj: maintenant.iso, minute: maintenant.min, equipe });
      if (refus) { etat.erreur = refus; rendre('.venue__erreur'); corps.querySelector('#venue-heure')?.focus(); return; }
      if (noterVenue(id, { modif, reponse: null })) dire('Votre demande de changement est partie. Votre réservation actuelle est gardée en attendant la réponse.'); else { etat.erreur = 'Votre demande n\'a pas pu être enregistrée : appelez-nous.'; rendre('.venue__erreur'); }
    } else {
      const texte = String(f.elements.texte.value || '').trim().slice(0, 280); if (!texte) { etat.erreur = 'Écrivez votre précision.'; rendre('#venue-info'); return; }
      if (noterVenue(id, { complement: { texte, cree: maintenantIso() } })) dire('Merci : votre précision est transmise au restaurant.'); else { etat.erreur = 'Votre précision n\'a pas pu être enregistrée : appelez-nous.'; rendre('.venue__erreur'); }
    }
  });
  /* L'espace du restaurant répond (dans un autre onglet) : la page se met à jour sans perdre une saisie en cours. */
  ecouter(() => { if (!etat.outil) { etat.message = ''; rendre(); } });
  rendre();
}
