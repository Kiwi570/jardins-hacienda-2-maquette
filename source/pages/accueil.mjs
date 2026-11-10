/* Accueil des Jardins de l'Hacienda, direction « La table du soir ».
   Modules de la bibliothèque : plat-fumant (ouverture), objet-a-faire-tourner (plateau du chef), assiette-qui-se-dresse
   (le chef dresse le suprême de pintade), carrousel-3d (réceptions), fil-conducteur (ficelle de cuisine, init dans site.js).
   Effets propres (data-effet) : plateau, signature, braises, decompte, ficelle. */
import { readFileSync } from 'node:fs';
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'accueil', fichier: 'index', imagePartage: 'ouverture-plat-1280.webp', modules: ['fil-conducteur', 'plat-fumant', 'objet-a-faire-tourner', 'assiette-qui-se-dresse', 'carrousel-3d'] };

const assiette = readFileSync(new URL('../fragments/assiette-pintade.html', import.meta.url), 'utf8');
const prix = (p) => (typeof p === 'number' ? `${p} €` : p);
const fourchette = (r) => {
  const n = r.plats.filter((p) => !/enfant/i.test(p.nom)).map((p) => p.prix).filter((p) => typeof p === 'number');
  return `${Math.min(...n)} à ${Math.max(...n)} €`;
};
/* Quatre rubriques du plateau : deux vrais plats chacune (les plus représentatifs de la saison). */
const CHOIX = { entrees: [1, 0], plats: [2, 4], 'a-partager': [0, 3], desserts: [4, 2] };
const PHOTOS = { entrees: 'plateau-entree', plats: 'plateau-plat', 'a-partager': 'plateau-partager', desserts: 'plateau-dessert' };
const RECEPTIONS = [
  ['mariages', 'recevoir-mariages', 'mariage'], ['baptemes', 'recevoir-baptemes', 'reception'], ['anniversaires', 'recevoir-anniversaires', 'reception'],
  ['depart', 'recevoir-depart', 'reception'], ['salle', 'recevoir-salle', 'reception'], ['cheminee', 'recevoir-cheminee', 'reception'],
  ['terrasse', 'recevoir-terrasse', 'evenement'], ['piscine', 'recevoir-piscine', 'evenement'],
];
/* Carte d'accès : coordonnées réelles projetées (x = (lon - 5,80) × 900, y = (49,70 - lat) × 480). */
const VILLES = [
  { nom: 'Luxembourg', x: 299, y: 42 }, { nom: 'Thionville', x: 331, y: 164 }, { nom: 'Metz', x: 338, y: 278 }, { nom: 'Nancy', x: 346, y: 484 },
];
const MOINEVILLE = { x: 131, y: 238 };

export default (c) => {
  const carte = c.donnees.carte;
  const rubriques = carte.rubriques.map((r) => ({ ...r, plats2: (CHOIX[r.id] || [0, 1]).map((i) => r.plats[i]) }));
  return html`
<section class="ouv-accueil" id="debut" data-fil="gauche" data-grille="fil">
  ${c.media({ nom: 'ouverture-plat', alt: c.s('accueil.hero.alt'), cadrage: '51% 64%', cadrageMobile: '50% 70%', priorite: true, classe: 'fumant ouv-accueil__photo', sizes: '100vw', attrs: 'data-module="plat-fumant" data-vapeur=".5 .66 .42" data-iris-centre data-effet="vapeur" data-souris' })}
  <div class="ouv-accueil__texte">
    <p class="surtitre" data-anime>${c.t('accueil.hero.surtitre')}</p>
    <h1 class="ouv-accueil__titre" data-anime="gsap" data-effet="titre-vapeur">${c.t('accueil.hero.titre')}</h1>
    <p class="ouv-accueil__intro masque-ecran-tres-bas" data-anime>${c.t('accueil.hero.texte')}</p>
    <p class="ouv-accueil__actions">
      ${c.lien('reserver', { classe: 'bouton', texte: c.t('accueil.hero.action'), attrs: 'data-action-principale data-survol="magnetique"' })}
      ${c.lien('la-carte', { classe: 'bouton bouton--contour', texte: c.t('accueil.hero.carte') })}
    </p>
    <p class="ouv-accueil__info" data-info-cle><a href="/infos-pratiques#horaires" class="ouv-accueil__statut" data-statut-accueil>${c.t('accueil.hero.horaires')}</a> <span class="ouv-accueil__fetes"><span aria-hidden="true">·</span> ${c.lien('les-fetes', { texte: c.t('accueil.hero.info') })}</span></p>
    <script type="application/json" data-horaires-accueil>${brut(JSON.stringify(c.donnees.horaires).replace(/<\//g, '<\\/'))}</script>
  </div>
  <p class="ouv-accueil__indice" aria-hidden="true">${c.t('accueil.hero.indice')}</p>
</section>

<section class="ruban-plats" id="plats-semaine" aria-labelledby="ruban-titre">
  <h2 id="ruban-titre" class="visuellement-cache">${c.t('accueil.ruban.titre')}</h2>
  <div class="ruban-plats__mots" data-fx="mots-geants" data-fx-force="22" aria-hidden="true" data-ruban data-visuel data-audit-ignorer>
    <p data-fx-rangee>${c.t('accueil.ruban.rangee1')} ${c.t('accueil.ruban.rangee1')}</p>
    <p data-fx-rangee data-sens="-1" class="ruban-plats__evide">${c.t('accueil.ruban.rangee2')} ${c.t('accueil.ruban.rangee2')}</p>
  </div>
</section>

<section class="plateau" id="plateau" data-fil="droite" data-grille="manipuler">
  <div class="conteneur plateau__grille">
    <div class="plateau__texte">
      <p class="surtitre">${c.t('accueil.plateau.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('accueil.plateau.titre')}</h2>
      <p data-anime>${c.t('accueil.plateau.texte')}</p>
      <ol class="plateau__rubriques" data-anime="cascade">
        ${rubriques.map((r, i) => html`<li class="plateau__rubrique" data-quart="${i}">
          <p class="plateau__rubrique-tete"><span class="plateau__rubrique-nom">${r.titre}</span><span class="plateau__fourchette" data-prix>${fourchette(r)}</span></p>
          <ul>${r.plats2.map((p) => html`<li><span>${p.nom}</span>${p.vegetarien ? html` <span class="plateau__vege">${c.t('accueil.plateau.vege')}</span>` : ''} <span class="plateau__prix" data-prix>${prix(p.prix)}</span></li>`)}</ul>
        </li>`)}
      </ol>
      <p data-anime>${c.lien('la-carte', { classe: 'bouton', texte: c.t('accueil.plateau.toute') })}</p>
    </div>
    <div class="oat plateau__objet" data-module="objet-a-faire-tourner" role="img" aria-label="${c.s('accueil.plateau.region')}" data-effet="plateau" data-souris>
      <div class="oat__objet"><div class="plateau__disque">
        ${rubriques.map((r, i) => html`<div class="plateau__part" style="--q:${i}">${c.media({ nom: PHOTOS[r.id], alt: '', classe: 'plateau__photo', sizes: '(max-width: 760px) 40vw, 18vw' })}<span class="plateau__etiquette">${r.titre}</span></div>`)}
        <span class="plateau__centre" aria-hidden="true"><img src="/assets/images/logo-clair.png" alt="" width="64" height="64"></span>
      </div></div>
      <figure class="fumant plateau__vapeur" data-module="plat-fumant" data-vapeur=".5 .82 .5" aria-hidden="true"><img src="/assets/images/transparent.png" alt="" width="400" height="400"></figure>
      <span class="oat__reflet" aria-hidden="true"></span>
      <p class="oat__indice" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M20 12a8 8 0 1 1-2.34-5.66" /><path d="M20 4v4h-4" /></svg>${c.t('accueil.plateau.indice')}</p>
    </div>
  </div>
  <p class="conteneur plateau__photos">${c.t('accueil.plateau.photos')}</p>
</section>

<section class="assiette chef" id="chef" data-module="assiette-qui-se-dresse" data-epingle data-scene data-grille="scene" aria-labelledby="assiette-titre">
  <div class="assiette__cadre socle-cadre">
    <div class="assiette__texte" data-tient>
      <p class="socle-surtitre">${c.t('accueil.chef.surtitre')}</p>
      <h2 class="assiette__titre" id="assiette-titre">${c.t('accueil.chef.titre')}</h2>
      <p class="assiette__intro masque-ecran-bas">${c.t('accueil.chef.intro')}</p>
      <p class="chef__signature" data-effet="signature" data-grille="typo"><span class="chef__nom" data-texte="${c.s('accueil.chef.signature')}">${c.t('accueil.chef.signature')}</span><span class="chef__role">${c.t('accueil.chef.signatureLegende')}</span></p>
    </div>
    <div class="assiette__scene" data-tient role="img" aria-label="${c.s('accueil.chef.scene')}">
      ${brut(assiette)}
    </div>
    <div class="assiette__suite" data-tient>
      <ol class="assiette__etapes">
        <li data-de="0"><div><strong>${c.t('accueil.chef.e1')}</strong><span>${c.t('accueil.chef.e1t')}</span></div></li>
        <li data-de=".2"><div><strong>${c.t('accueil.chef.e2')}</strong><span>${c.t('accueil.chef.e2t')}</span></div></li>
        <li data-de=".42"><div><strong>${c.t('accueil.chef.e3')}</strong><span>${c.t('accueil.chef.e3t')}</span></div></li>
        <li data-de=".6"><div><strong>${c.t('accueil.chef.e4')}</strong><span>${c.t('accueil.chef.e4t')}</span></div></li>
      </ol>
      <p class="chef__prix" data-prix>${c.t('accueil.chef.prix')}</p>
      <p class="chef__mention">${c.t('accueil.chef.mention')}</p>
    </div>
  </div>
</section>

<section class="cheminee" id="cheminee" data-fx="plein-ecran" aria-labelledby="cheminee-titre" data-gouttiere="#15100c">
  <div data-collant>
    ${c.media({ nom: 'cheminee', alt: c.s('accueil.cheminee.alt'), cadrage: '38% 45%', classe: 'cheminee__photo', sizes: '100vw' })}
    <canvas class="cheminee__braises" width="480" height="320" aria-hidden="true" data-effet="braises" data-audit-ignorer></canvas>
    <h2 class="cheminee__titre" id="cheminee-titre"><span data-fx-ecarte="g">${c.t('accueil.cheminee.g')}</span> <span data-fx-ecarte="d">${c.t('accueil.cheminee.d')}</span></h2>
    <div class="cheminee__apres" data-fx-apres>
      <p>${c.t('accueil.cheminee.texte')}</p>
      <p class="cheminee__legende">${c.t('accueil.cheminee.legende')}</p>
    </div>
  </div>
</section>

<section class="fetes-accueil" id="fetes" data-fil="gauche" aria-labelledby="fetes-titre">
  ${c.media({ nom: 'grok/fetes-braises', alt: '', classe: 'fetes-accueil__fond', sizes: '100vw', attrs: 'data-fx="parallaxe" data-fx-force="12"' })}
  <div class="conteneur fetes-accueil__contenu">
    <p class="surtitre">${c.t('accueil.fetes.surtitre')}</p>
    <h2 id="fetes-titre" data-anime="lettres">${c.t('accueil.fetes.titre')}</h2>
    <div class="fetes-accueil__cartes" data-anime="cascade">
      <article class="fete-carte" data-date="${c.donnees.fetes.noel.debut}">
        <p class="fete-carte__quand">${c.t('accueil.fetes.noelQuand')}</p>
        <h3>${c.t('accueil.fetes.noel')}</h3>
        <p class="fete-carte__decompte" data-effet="decompte" data-cible="${c.donnees.fetes.noel.date}">${c.t('accueil.fetes.dans')} <strong data-jours>—</strong> ${c.t('accueil.fetes.jours')}</p>
        <p class="fete-carte__prix" data-prix>${c.t('accueil.fetes.noelPrix')}</p>
        ${c.lien('reserver', { params: 'date=2026-12-25&service=midi', classe: 'bouton bouton--contour', texte: c.t('accueil.fetes.reserver') })}
      </article>
      <article class="fete-carte fete-carte--sylvestre" data-date="${c.donnees.fetes.sylvestre.debut}">
        <p class="fete-carte__quand">${c.t('accueil.fetes.sylvestreQuand')}</p>
        <h3>${c.t('accueil.fetes.sylvestre')}</h3>
        <p class="fete-carte__decompte" data-effet="decompte" data-cible="${c.donnees.fetes.sylvestre.date}">${c.t('accueil.fetes.dans')} <strong data-jours>—</strong> ${c.t('accueil.fetes.jours')}</p>
        <p class="fete-carte__prix" data-prix>${c.t('accueil.fetes.sylvestrePrix')}</p>
        ${c.lien('reserver', { params: 'date=2026-12-31&service=soir', classe: 'bouton bouton--contour', texte: c.t('accueil.fetes.reserver') })}
      </article>
    </div>
    <p>${c.lien('les-fetes', { classe: 'bouton', texte: c.t('accueil.fetes.voir') })}</p>
  </div>
</section>

<section class="c3d recevoir" id="recevoir" data-module="carrousel-3d" data-fil="droite" aria-labelledby="c3d-titre">
  <div class="c3d__tete socle-cadre">
    <p class="socle-surtitre">${c.t('accueil.recevoir.surtitre')}</p>
    <h2 class="c3d__titre" id="c3d-titre" data-anime="lignes">${c.t('accueil.recevoir.titre')}</h2>
    <p class="c3d__intro">${c.t('accueil.recevoir.texte')}</p>
  </div>
  <div class="c3d__scene" data-galerie tabindex="0" role="region" aria-label="${c.s('accueil.recevoir.region')}" data-effet="carrousel">
    <ul class="c3d__cylindre">
      ${RECEPTIONS.map(([cle, img, sujet]) => html`<li class="c3d__carte"><a class="c3d__lien" href="${c.url('infos-pratiques', 'ecrire', `sujet=${sujet}`)}" data-libelle="${c.libelle('infos-pratiques')}">${c.media({ nom: img, alt: c.s(`recevoir.${cle}`), classe: 'c3d__media', sizes: '260px' })}<span class="c3d__nom">${c.t(`recevoir.${cle}`)}</span><span class="c3d__ligne">${c.t(`recevoir.${cle}Ligne`)}</span></a></li>`)}
    </ul>
  </div>
  <div class="c3d__commandes">
    <button type="button" class="c3d__prec" aria-label="${c.s('accueil.recevoir.precedent')}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
    <p class="c3d__indice" aria-hidden="true">${c.t('accueil.recevoir.indice')}</p>
    <button type="button" class="c3d__suiv" aria-label="${c.s('accueil.recevoir.suivant')}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
  </div>
</section>

<section class="offrir-accueil" id="offrir" data-fil="gauche" aria-labelledby="offrir-titre">
  <div class="conteneur offrir-accueil__grille">
    ${c.media({ nom: 'offrir-soiree', alt: c.s('accueil.offrir.alt'), classe: 'offrir-accueil__photo', sizes: '(max-width: 760px) 100vw, 50vw', attrs: 'data-fx="vitesse" data-fx-force="4"' })}
    <div class="offrir-accueil__texte">
      <p class="surtitre">${c.t('accueil.offrir.surtitre')}</p>
      <h2 id="offrir-titre" data-anime="lignes">${c.t('accueil.offrir.titre')}</h2>
      <p data-anime>${c.t('accueil.offrir.texte')}</p>
      <div class="mini-carte" aria-hidden="true" data-survol="incline" data-visuel><span class="mini-carte__mono"><img src="/assets/images/logo-clair.png" alt="" width="40" height="40"></span><span class="mini-carte__type">${c.t('accueil.offrir.carte')}</span><span class="mini-carte__montant">50 €</span></div>
      <p data-anime>${c.lien('offrir', { classe: 'bouton', texte: c.t('accueil.offrir.action'), attrs: 'data-survol="magnetique"' })}</p>
    </div>
  </div>
</section>

<section class="venir" id="venir" data-fil="droite" aria-labelledby="venir-titre">
  <div class="conteneur venir__grille">
    <div>
      <p class="surtitre">${c.t('accueil.venir.surtitre')}</p>
      <h2 id="venir-titre" data-anime="lignes">${c.t('accueil.venir.titre')}</h2>
      <p data-anime>${c.t('accueil.venir.texte')}</p>
      <p class="venir__adresse" data-anime>${c.site.contact.adresse}<br><a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a></p>
      <p class="venir__actions" data-anime>
        ${c.lien('infos-pratiques', { classe: 'bouton', texte: c.t('accueil.venir.infos') })}
        <a class="bouton bouton--contour" href="https://www.google.com/maps/search/?api=1&amp;query=6+Vathier+Haye+54580+Moineville" target="_blank" rel="noopener">${c.t('accueil.venir.itineraire')}</a>
      </p>
    </div>
    <svg class="venir__carte" viewBox="0 0 420 520" role="img" aria-label="${c.s('accueil.venir.carte')}" data-fx="trace" data-visuel>
      ${VILLES.map((v) => brut(`<path data-fx-trait d="M${MOINEVILLE.x} ${MOINEVILLE.y} Q ${(MOINEVILLE.x + v.x) / 2} ${(MOINEVILLE.y + v.y) / 2 - 30} ${v.x} ${v.y}" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="1 0" opacity=".55"/>`))}
      ${VILLES.map((v) => brut(`<g class="venir__ville"><circle cx="${v.x}" cy="${v.y}" r="5"/><text x="${v.x - 10}" y="${v.y + 5}" text-anchor="end">${v.nom}</text></g>`))}
      ${brut(`<g class="venir__ici" data-repere><circle cx="${MOINEVILLE.x}" cy="${MOINEVILLE.y}" r="14"/><circle cx="${MOINEVILLE.x}" cy="${MOINEVILLE.y}" r="5"/><text x="${MOINEVILLE.x + 20}" y="${MOINEVILLE.y - 14}">Moineville</text></g>`)}
    </svg>
  </div>
</section>
<template data-fil-objet><g class="ficelle-noeud"><circle r="6"/><path d="M0 0 C 8 -10, 16 -12, 22 -20 M0 0 C 10 -4, 18 -2, 26 -6" fill="none" stroke-width="2.4" stroke-linecap="round"/></g></template>
`;
};
