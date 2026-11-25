/* L'écran « Préparer l'outil pour votre restaurant » (v7.16.0).
   Un écran d'Aujourd'hui, facultatif, sans rubrique nouvelle : on y entre par le menu « … », « Plus » sur téléphone,
   la rubrique Site, Aujourd'hui (vue Direction), l'assistant ou la fin de la visite guidée.
   Il ne contient aucun champ : chaque rubrique résume les valeurs actuelles (espace-mise-en-main.js, qui relit les
   sources réelles à chaque affichage) et ouvre l'écran EXISTANT où elles se modifient. Ce sont les éditeurs existants qui
   valident, refusent et enregistrent ; ouvrir un écran ne coche rien ici, et un refus n'y change rien. */
import { typo } from './espace-regles.js?v=7';
import { miseEnMain, repereDit, ETATS, TITRE } from './espace-mise-en-main.js?v=7';

export function creerMise(X) {
  const { root, $, e, S, A, D, ctx, etat } = X;
  const R = D.reservation;
  const calcul = () => { const c = ctx(); return miseEnMain({ S: S(), base: { semaine: D.horaires.semaine, exceptions: D.horaires.exceptions || [] }, salle: D.salle, lieux: D.receptions, R,
    sources: { carte: D.carte, agenda: D.agenda, lieux: D.receptions, produits: D.produits, ardoise: D.ardoise, textes: D.textes, photos: D.photos }, auj: A.iso, connecte: c.exemples === false, scenario: c.scenario || '' }); };
  const pastille = (k) => (k ? `<span class="esp-mise__etat esp-mise__etat--${k}" data-mise-etat="${k}">${e(ETATS[k])}</span>` : '');
  const PORTEE = { demo: 'Démonstration', navigateur: 'Ce navigateur', partage: 'Partagé avec l\'équipe', appareil: 'Sur cet appareil', fixe: 'Lecture seule' };

  function rubrique(r, i) {
    return `<section class="esp-mise__rubrique" aria-labelledby="mise-${r.id}" data-mise="${r.id}">
      <h4 id="mise-${r.id}" tabindex="-1"><span class="esp-mise__num" aria-hidden="true">${i + 1}</span> ${e(r.titre)} <span class="esp-source${r.portee.cle === 'partage' ? ' esp-source--site' : ''}" data-mise-portee="${r.portee.cle}">${e(PORTEE[r.portee.cle])}</span></h4>
      <p class="esp-mise__sert">${e(r.sert)}</p>
      <dl class="esp-mise__lignes">${r.lignes.map((l) => `<div class="esp-mise__ligne${l.fixe ? ' est-fixe' : ''}" data-mise-ligne><dt>${e(l.libelle)}</dt><dd><span class="esp-mise__valeur">${e(l.valeur).replace(/(\d) (h|min|€|mois)(?![a-zé])/g, '$1\u00a0$2')}</span> ${pastille(l.etat)}${l.fixe ? ' <span class="esp-mise__fixe">Non modifiable dans l\'outil</span>' : ''}${l.note ? `<small>${e(l.note)}</small>` : ''}</dd></div>`).join('')}</dl>
      ${r.manques.length ? `<div class="esp-mise__manques" data-mise-manques><p class="esp-champ__titre">À compléter ou à confirmer</p><ul>${r.manques.map((m) => `<li>${e(m)}</li>`).join('')}</ul></div>` : ''}
      ${r.limites.length ? `<ul class="esp-mise__limites">${r.limites.map((m) => `<li>${e(m)}</li>`).join('')}</ul>` : ''}
      <p class="esp-mise__portee">${e(r.portee.texte)}</p>
      <p class="esp-mise__actions">${r.actions.map((a, j) => `<button type="button" class="${a.principal ? 'bouton' : 'esp-bouton'}" data-mise-aller="${r.id}:${j}">${e(a.libelle)}</button>`).join('')}</p></section>`;
  }
  function rendre() {
    const m = calcul(), c = ctx(), connecte = c.exemples === false;
    X.corps('jour').innerHTML = typo(`
      <p class="esp-retour"><button type="button" class="esp-lien" data-mise-retour-jour><span aria-hidden="true">←</span> Aujourd'hui</button></p>
      <section class="esp-carte esp-carte--large esp-mise" aria-labelledby="mise-titre" data-mise-ecran>
        <h3 id="mise-titre" tabindex="-1">${e(TITRE)}</h3>
        <p class="esp-mise__intro">Un parcours facultatif, à faire dans l'ordre que vous voulez. Rien ne se règle sur cette page : chaque rubrique résume les valeurs actuelles et ouvre l'écran où elles se modifient. Revenez ici ensuite : le résumé relit les valeurs.</p>
        ${connecte ? '<p class="esp-note-demo"><span class="esp-source">Site d\'essai</span> Les horaires sont ceux du serveur, partagés avec l\'équipe. Les capacités, la période des retraits, les offres et les cartes cadeaux restent sur cet appareil : ce ne sont pas des réglages partagés.</p>'
          : `<p class="esp-note-demo"><span class="esp-source">Démonstration</span> ${c.scenario ? 'Ce que vous changez ici reste dans ce scénario fictif.' : 'Ce que vous changez reste dans ce navigateur : la maquette n\'a pas de serveur.'} Une valeur présente n'est pas une valeur confirmée par le restaurant.</p>`}
        <p class="esp-mise__repere" data-mise-repere role="status">${e(repereDit(m.repere))}</p>
        <nav class="esp-mise__sommaire" aria-label="Les cinq rubriques de la mise en main"><ol>${m.rubriques.map((r) => { const n = r.lignes.filter((l) => ['vide', 'exemple'].includes(l.etat)).length; return `<li><a href="#mise-${r.id}" data-mise-vers="${r.id}">${e(r.titre)}</a> <span>${n ? `${n} à relire` : 'rien à signaler'}</span></li>`; }).join('')}</ol></nav>
        ${m.rubriques.map(rubrique).join('')}
        <div class="esp-mise__legende"><p class="esp-champ__titre">Ce que disent les mentions</p><dl>
          <div><dt>${pastille('vide')}</dt><dd>La valeur n'existe pas : rien n'est limité ni annoncé à sa place.</dd></div>
          <div><dt>${pastille('exemple')}</dt><dd>La valeur vient de la maquette ou d'une démonstration, pas de vous.</dd></div>
          <div><dt>${pastille('renseigne')}</dt><dd>Une valeur est là (reprise du site publié, ou enregistrée ici). Cela ne veut pas dire qu'elle a été confirmée.</dd></div>
          <div><dt>${pastille('indisponible')}</dt><dd>L'écran n'existe pas dans ce mode.</dd></div></dl></div>
      </section>`);
  }
  function ouvrir(vers = '') { etat.ecranJour = 'mise'; etat.miseRetour = false; etat.dossier = null; etat.commerce = null; X.allerVue('jour', false);
    const cible = vers ? $(`#mise-${CSS.escape(vers)}`, root) : $('#mise-titre', root); cible?.focus({ preventScroll: true }); if (vers && cible) cible.scrollIntoView({ block: 'start', behavior: 'instant' }); else scrollTo({ top: 0, behavior: 'instant' }); }
  function clic(t) {
    if (t.closest('[data-mise-ouvrir]')) { ouvrir(); return true; }
    if (t.closest('[data-mise-revenir]')) { ouvrir(etat.miseDepuis || ''); return true; }
    if (etat.ecranJour !== 'mise') return false;
    if (t.closest('[data-mise-retour-jour]')) { etat.ecranJour = ''; X.rendre(); $('#vue-jour', root)?.focus({ preventScroll: true }); scrollTo({ top: 0, behavior: 'instant' }); return true; }
    const v = t.closest('[data-mise-vers]'); if (v) { const h = $(`#mise-${CSS.escape(v.dataset.miseVers)}`, root); h?.focus({ preventScroll: true }); h?.scrollIntoView({ block: 'start', behavior: 'instant' }); return true; }
    const b = t.closest('[data-mise-aller]'); if (b) { const [id, j] = b.dataset.miseAller.split(':'), a = calcul().rubriques.find((r) => r.id === id)?.actions[+j]; if (!a) return true;
      /* On ouvre l'écran existant, sur le bon onglet ; le chemin du retour est gardé, et rien n'est noté comme « fait ». */
      etat.ecranJour = ''; etat.miseDepuis = id; etat.miseRetour = true;
      if (a.filtre) etat.filtreOffres = a.filtre;
      X.executer({ aller: a.aller });
      if (a.ouvrir === 'perOuvert' || a.ouvrir === 'capOuvert') { etat.commerce.perOuvert = a.ouvrir === 'perOuvert'; etat.commerce.capOuvert = a.ouvrir === 'capOuvert'; X.rendre(); const d = $(a.ouvrir === 'perOuvert' ? '[data-periode]' : '[data-cap]', root); d?.scrollIntoView({ block: 'start', behavior: 'instant' }); $('summary', d)?.focus({ preventScroll: true }); }
      else if (a.ouvrir === 'validite') { const f = $('[data-form-cad-validite]', root); f?.scrollIntoView({ block: 'start', behavior: 'instant' }); $('#val-mois', root)?.focus({ preventScroll: true }); }
      else if (a.aller.onglet === 'salle') $('#onglet-resas-salle, [data-onglet="salle"]', root)?.focus({ preventScroll: true });
      return true; }
    return false;
  }
  /** Le lien de retour, affiché au-dessus de l'écran ouvert depuis la mise en main (jamais sur la mise en main elle-même). */
  const retourHtml = () => (etat.miseRetour && etat.ecranJour !== 'mise' ? typo(`<button type="button" class="esp-lien" data-mise-revenir><span aria-hidden="true">←</span> Revenir à « ${e(TITRE)} »</button>`) : '');
  return { rendre, clic, ouvrir, retourHtml };
}
