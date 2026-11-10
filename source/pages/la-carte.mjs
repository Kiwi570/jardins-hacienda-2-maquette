/* La carte : ouverture claire (la nappe), l'ardoise de saison à la craie, puis toute la carte.
   Modules : ardoise-a-la-craie, carte-du-restaurant (rendue ici depuis donnees/carte.json par le rendu du module). */
import { html, brut, fragment } from '../../outils/gabarit.mjs';
import { rendreCarte } from '../../assets/js/modules/carte-du-restaurant/carte-rendu.js';

export const page = { cle: 'la-carte', fichier: 'la-carte', imagePartage: 'carte-ouverture-1280.webp', modules: ['fil-conducteur', 'ardoise-a-la-craie', 'carte-du-restaurant'] };

export default (c) => {
  const a = c.donnees.ardoise;
  /* Rendu du module, tel quel ; seules les photos de rubrique reçoivent l'effet « vitesse » de la bibliothèque. */
  const carte = rendreCarte(c.donnees.carte).replace(/<figure class="carte-resto__photo">/g, '<figure class="carte-resto__photo" data-fx="vitesse" data-fx-force="3">');
  return html`
<section class="ouv-carte clair" id="debut" data-fil="gauche" data-grille="fil">
  <div class="conteneur ouv-carte__tete">
    <p class="surtitre" data-anime>${c.t('carte.surtitre')}</p>
    <h1 class="ouv-carte__titre" data-anime="lettres">${c.t('carte.titre')}</h1>
    <div class="ouv-carte__ligne">
      <p class="ouv-carte__texte masque-ecran-tres-bas">${c.t('carte.texte')}</p>
      <p class="ouv-carte__actions">${c.lien('reserver', { classe: 'bouton', texte: c.t('carte.action'), attrs: 'data-action-principale' })}</p>
      <p class="ouv-carte__info" data-info-cle data-prix>${c.t('carte.info')}</p>
    </div>
  </div>
  ${c.media({ nom: 'carte-ouverture', alt: c.s('carte.alt'), cadrage: '54% 45%', priorite: true, classe: 'ouv-carte__bandeau', sizes: '100vw', attrs: 'data-anime="rideau" data-iris-centre' })}
</section>

<section class="ardoise-section ardoise-carte" id="ardoise" data-module="ardoise-a-la-craie" data-fil="droite" aria-labelledby="ardoise-titre">
  <div class="ardoise-section__grille socle-cadre">
    <div class="ardoise" data-grille="typo" data-effet="ardoise" data-visuel>
      <div class="ardoise__surface">
        <p class="ardoise__date" data-ardoise-date="${a.date}"><span>${a.date}</span></p>
        <p class="ardoise__titre"><span>${a.titre}</span></p>
        ${brut('<svg class="ardoise__trait" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true"><path d="M4 16 C 90 6, 200 22, 396 10" pathLength="1" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>')}
        <ul class="ardoise__liste">
          ${a.lignes.map((l) => html`<li><span class="ardoise__plat">${l.plat}</span><span class="ardoise__prix" data-prix>${l.prix}</span></li>`)}
        </ul>
        <p class="ardoise__mot"><span>${a.mot}</span></p>
      </div>
    </div>
    <div class="ardoise-section__texte">
      <p class="socle-surtitre">${c.t('carte.ardoiseSurtitre')}</p>
      <h2 id="ardoise-titre" data-anime="lignes">${c.t('carte.ardoiseTitre')}</h2>
      <p>${c.t('carte.ardoiseTexte')}</p>
      <p><a class="bouton bouton--contour" href="#toute-la-carte" data-filtre-lien="vegetarien" data-sans-transition>${c.t('carte.ardoiseVege')}</a></p>
    </div>
  </div>
</section>

<section class="plein-carte" id="assiette-du-chef" data-fx="plein-ecran" aria-labelledby="plein-carte-titre" data-gouttiere="#15100c">
  <div data-collant>
    ${c.media({ nom: 'carte-plein', alt: c.s('carte.pleinAlt'), classe: 'plein-carte__photo', sizes: '100vw' })}
    <h2 class="plein-carte__titre" id="plein-carte-titre"><span data-fx-ecarte="g">${c.t('carte.pleinG')}</span> <span data-fx-ecarte="d">${c.t('carte.pleinD')}</span></h2>
    <div class="plein-carte__apres" data-fx-apres>
      <p>${c.t('carte.pleinTexte')}</p>
    </div>
  </div>
</section>

<section class="carte-resto clair" id="toute-la-carte" data-module="carte-du-restaurant" data-fil="gauche" aria-labelledby="carte-titre">
  <header class="carte-resto__tete socle-cadre">
    <p class="socle-surtitre">${c.t('carte.carteSurtitre')}</p>
    <h2 id="carte-titre" data-anime="lignes">${c.t('carte.carteTitre')}</h2>
    <p>${c.t('carte.carteTexte')}</p>
  </header>
  <div class="carte-resto__carte socle-cadre" data-carte>
${fragment(carte)}
  </div>
</section>

<section class="fin-carte" id="fin" data-fil="droite">
  <div class="conteneur fin-carte__grille">
    <div>
      <h2 data-anime="lignes">${c.t('carte.finTitre')}</h2>
      <p data-anime>${c.t('carte.finTexte')}</p>
      <p class="fin-carte__actions" data-anime>${c.lien('reserver', { classe: 'bouton', texte: c.t('carte.action') })} ${c.lien('les-fetes', { classe: 'bouton bouton--contour', texte: c.t('carte.fetes') })}</p>
    </div>
    ${c.media({ nom: 'carte-desserts', alt: c.s('carte.finAlt'), classe: 'fin-carte__photo', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-fx="parallaxe"' })}
  </div>
</section>
`;
};
