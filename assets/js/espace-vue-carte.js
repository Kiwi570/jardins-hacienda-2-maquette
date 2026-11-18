/* La rubrique « Carte » de l'espace restaurateur (v7.7.3) : les écrans.
   Deux onglets : « La carte » (les plats du site, rubrique par rubrique) et « L'ardoise » (écrite à la craie).
   Sur chaque plat : « Épuisé aujourd'hui » d'un toucher (la carte du site l'indique aussitôt, le plat revient tout seul le
   lendemain), et « Modifier » qui ouvre le nom, le prix, la description, végétarien, les allergènes, « Sur la carte ».
   Tout s'enregistre au fil de la frappe et s'annule. Les règles sont dans espace-carte.js (fonctions pures). */
import { ALLERGENES, prixTexte, lirePrix, carteDe, platsDe } from './espace-carte.js?v=7';
import { pluriel } from './espace-regles.js?v=7';

const ONGLETS = [['carte', 'La carte'], ['ardoise', 'L\'ardoise']];

export function creerCarte(X) {
  const { root, $, $$, e, S, A, D, etat, agir, corps } = X;
  const carte = () => carteDe(D.carte, S(), A.iso);
  const champPrix = (v) => (typeof v === 'number' ? String(v).replace('.', ',') : v || '');

  function editeur(p) {
    return `<form class="esp-plat__form" data-form-plat="${e(p.cle)}" aria-label="Modifier ${e(p.nom)}">
      <p class="esp-champ esp-champ--large"><label for="pl-nom">Nom</label><input id="pl-nom" name="nom" value="${e(p.nom)}" required autocomplete="off"></p>
      <p class="esp-champ"><label for="pl-prix">Prix <small>un nombre, ou des mots (« Prix du marché »)</small></label><input id="pl-prix" name="prix" value="${e(champPrix(p.prix))}" autocomplete="off"></p>
      <p class="esp-champ esp-plat__vege"><label class="esp-coche"><input type="checkbox" name="vegetarien"${p.vegetarien ? ' checked' : ''}><span>Végétarien</span></label></p>
      <p class="esp-champ esp-champ--large"><label for="pl-desc">Description</label><textarea id="pl-desc" name="description" rows="2">${e(p.description)}</textarea></p>
      <fieldset class="esp-allergenes"><legend>Allergènes <small>Cochez ceux du plat : ils s'affichent sous sa description, sur le site. Rien n'est coché d'avance.</small></legend>
        <div class="esp-puces">${ALLERGENES.map((a) => `<label class="esp-puce"><input type="checkbox" name="allergene" value="${e(a)}"${p.allergenes.includes(a) ? ' checked' : ''}><span>${e(a)}</span></label>`).join('')}</div></fieldset>
      <p class="esp-plat__form-actions"><button type="button" class="esp-bascule" aria-pressed="${!p.masque}" data-plat-visible="${e(p.cle)}"><span class="esp-bascule__rail" aria-hidden="true"></span>Sur la carte</button><button type="button" class="esp-bouton" data-editer-plat="${e(p.cle)}">Fermer</button></p>
    </form>`;
  }
  function lignePlat(p) {
    const ouvert = etat.platEdite === p.cle;
    return `<li class="esp-plat${p.epuise ? ' est-epuise' : ''}${p.masque ? ' est-masque' : ''}${ouvert ? ' est-ouvert' : ''}" data-plat="${e(p.cle)}">
      <div class="esp-plat__texte"><p class="esp-plat__nom"><b data-plat-nom>${e(p.nom)}</b>${p.epuise ? ' <span class="esp-pastille esp-pastille--refusee">Épuisé aujourd\'hui</span>' : ''}${p.masque ? ' <span class="esp-pastille">Retiré de la carte</span>' : ''}${p.nouveau ? ' <span class="esp-pastille esp-pastille--confirmee">Nouveau</span>' : p.modifie ? ' <span class="esp-pastille esp-pastille--cours">Modifié</span>' : ''}</p>
        ${p.description ? `<p class="esp-plat__desc" data-plat-desc>${e(p.description)}</p>` : '<p class="esp-plat__desc" data-plat-desc hidden></p>'}
        <p class="esp-plat__plus" data-plat-plus${p.vegetarien || p.allergenes.length ? '' : ' hidden'}>${[p.vegetarien ? 'Végétarien' : '', p.allergenes.length ? `Allergènes : ${p.allergenes.join(', ').toLowerCase()}` : ''].filter(Boolean).join(' · ')}</p></div>
      <p class="esp-plat__prix" data-plat-prix>${e(prixTexte(p.prix))}</p>
      <p class="esp-plat__actions"><button type="button" class="esp-bascule" aria-pressed="${p.epuise}" data-epuise="${e(p.cle)}"${p.masque ? ' disabled' : ''}><span class="esp-bascule__rail" aria-hidden="true"></span>Épuisé aujourd'hui</button><button type="button" class="esp-bouton" data-editer-plat="${e(p.cle)}" aria-expanded="${ouvert}">Modifier</button></p>
      ${ouvert ? editeur(p) : ''}</li>`;
  }

  function rendre() {
    if (!ONGLETS.some(([id]) => id === etat.ongletCarte)) etat.ongletCarte = 'carte';
    const onglets = `<div class="esp-onglets" role="tablist" aria-label="La carte et l'ardoise">${ONGLETS.map(([id, nom]) => `<button type="button" class="esp-onglet" role="tab" id="onglet-carte-${id}" aria-selected="${id === etat.ongletCarte}" aria-controls="panneau-carte" tabindex="${id === etat.ongletCarte ? 0 : -1}" data-onglet="${id}" data-onglets-carte>${nom}</button>`).join('')}</div>`;
    if (etat.ongletCarte === 'ardoise') { corps('carte').innerHTML = `${onglets}<div class="esp-panneau" id="panneau-carte" role="tabpanel" aria-labelledby="onglet-carte-ardoise"><div class="esp-grille esp-grille--textes">${X.ardoiseHtml()}</div></div>`; return; }
    const c = carte(), tous = platsDe(c), sur = tous.filter((p) => !p.masque), ep = sur.filter((p) => p.epuise).length;
    corps('carte').innerHTML = `${onglets}<div class="esp-panneau" id="panneau-carte" role="tabpanel" aria-labelledby="onglet-carte-carte">
      <p class="esp-bonjour">${pluriel(sur.length, 'plat')} sur la carte${ep ? `, ${ep} épuisé${ep > 1 ? 's' : ''} aujourd'hui` : ''}. En plein service : un toucher sur « Épuisé aujourd'hui », la carte du site l'indique aussitôt et le plat revient tout seul demain. <a class="esp-voir" href="${e(D.pages.carte)}">Voir la carte sur le site</a></p>
      <p class="esp-filtres" role="group" aria-label="Aller à une rubrique">${c.map((r) => `<button type="button" class="esp-filtre" data-aller-rubrique="${e(r.id)}">${e(r.titre)}</button>`).join('')}</p>
      ${c.map((r) => `<section class="esp-rubrique" id="rub-${e(r.id)}" aria-labelledby="rub-t-${e(r.id)}">
        <header class="esp-rubrique__tete"><h3 id="rub-t-${e(r.id)}">${e(r.titre)} <small>${pluriel(r.plats.filter((p) => !p.masque).length, 'plat')}</small></h3><button type="button" class="esp-bouton" data-ajouter-plat-carte="${e(r.id)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><span>Ajouter un plat</span></button></header>
        <ul class="esp-plats">${r.plats.map(lignePlat).join('')}</ul></section>`).join('')}</div>`;
  }

  function clic(t) {
    const og = t.closest('[data-onglets-carte]'); if (og) { etat.ongletCarte = og.dataset.onglet; etat.platEdite = null; X.rendre(); $(`#onglet-carte-${etat.ongletCarte}`, root)?.focus(); return true; }
    const ar = t.closest('[data-aller-rubrique]'); if (ar) { X.viser($(`#rub-${CSS.escape(ar.dataset.allerRubrique)}`, root)); return true; }
    const ep = t.closest('[data-epuise]'); if (ep) {
      const cle = ep.dataset.epuise, on = ep.getAttribute('aria-pressed') !== 'true', p = platsDe(carte()).find((x) => x.cle === cle);
      agir('epuise', { cle, date: A.iso, actif: on }, { msg: on ? `« ${p.nom} » : épuisé aujourd'hui, la carte du site l'indique.` : `« ${p.nom} » est de nouveau proposé.`, lien: D.pages.carte });
      X.rendre(); $(`[data-epuise="${CSS.escape(cle)}"]`, root)?.focus(); return true;
    }
    const ed = t.closest('[data-editer-plat]'); if (ed) { const cle = ed.dataset.editerPlat, ouvrir = etat.platEdite !== cle; etat.platEdite = ouvrir ? cle : null; X.rendre(); (ouvrir ? $('#pl-nom', root) : $(`[data-plat="${CSS.escape(cle)}"] [data-editer-plat]`, root))?.focus(); return true; }
    const vi = t.closest('[data-plat-visible]'); if (vi) {
      const cle = vi.dataset.platVisible, on = vi.getAttribute('aria-pressed') !== 'true', p = platsDe(carte()).find((x) => x.cle === cle);
      agir('platVisible', { cle, visible: on }, { msg: on ? `« ${p.nom} » est de nouveau sur la carte.` : p.nouveau ? `« ${p.nom} » est supprimé.` : `« ${p.nom} » est retiré de la carte du site.`, lien: D.pages.carte });
      if (!on && p.nouveau) etat.platEdite = null;
      X.rendre(); ($(`[data-plat-visible="${CSS.escape(cle)}"]`, root) || $(`[data-ajouter-plat-carte="${CSS.escape(p.rubrique)}"]`, root))?.focus(); return true;
    }
    const aj = t.closest('[data-ajouter-plat-carte]'); if (aj) {
      const rubrique = aj.dataset.ajouterPlatCarte, id = Date.now().toString(36);
      if (agir('ajouterPlat', { rubrique, id, plat: { nom: 'Nouveau plat', description: '', prix: '' } }, { msg: 'Plat ajouté : écrivez son nom et son prix.', lien: D.pages.carte })) etat.platEdite = `${rubrique}/+${id}`;
      X.rendre(); const n = $('#pl-nom', root); n?.focus(); n?.select(); return true;
    }
    return false;
  }
  function saisie(t) {
    const f = t.closest('[data-form-plat]'); if (!f) return false;
    const cle = f.dataset.formPlat, nom = f.elements.nom.value.trim(), li = f.closest('[data-plat]');
    f.elements.nom.setAttribute('aria-invalid', String(!nom)); if (!nom) return true; /* un plat garde toujours un nom */
    const champs = { nom, prix: lirePrix(f.elements.prix.value), description: f.elements.description.value.trim(), vegetarien: f.elements.vegetarien.checked, allergenes: $$('[name="allergene"]:checked', f).map((x) => x.value) };
    /* La ligne du plat suit la frappe, sans redessiner (le champ garde le curseur). */
    $('[data-plat-nom]', li).textContent = nom; $('[data-plat-prix]', li).textContent = prixTexte(champs.prix);
    const d = $('[data-plat-desc]', li); d.textContent = champs.description; d.hidden = !champs.description;
    const plus = $('[data-plat-plus]', li); plus.textContent = [champs.vegetarien ? 'Végétarien' : '', champs.allergenes.length ? `Allergènes : ${champs.allergenes.join(', ').toLowerCase()}` : ''].filter(Boolean).join(' · '); plus.hidden = !plus.textContent;
    X.plusTard(() => agir('plat', { cle, champs, base: D.carte }, { msg: 'Carte enregistrée : visible sur le site, dans ce navigateur.', lien: D.pages.carte, groupe: `plat-${cle}` }));
    return true;
  }
  return { rendre, clic, saisie };
}
