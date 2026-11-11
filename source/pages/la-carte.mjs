/* La carte · « la carte se met à l'heure » : la page s'ouvre au déjeuner ou au dîner selon l'heure réelle à Moineville
   (html[data-moment], posé avant le premier affichage) ; la bascule rallume toute la page (photo, texte, lumière).
   Ouverture en écran partagé (photo du service à gauche, heure géante dessus), la carte complète en grand index
   (module carte-du-restaurant, rendu ici depuis donnees/carte.json), la passe (les mains du chef, la vapeur), la fin. */
import { html, brut, fragment } from '../../outils/gabarit.mjs';
import { avecVideo } from '../gabarits/video.mjs';
import { rendreCarte } from '../../assets/js/modules/carte-du-restaurant/carte-rendu.js';

export const page = { cle: 'la-carte', fichier: 'la-carte', theme: 'jour', themeAuto: true, imagePartage: 'grok/assiette-midi-640.webp', modules: ['carte-du-restaurant'] };

export default (c) => {
  const carte = rendreCarte(c.donnees.carte).replace(/<figure class="carte-resto__photo">/g, '<figure class="carte-resto__photo" data-fx="vitesse" data-fx-force="3">');
  return html`
<section class="ouv-carte" id="debut" data-effet="moment">
  <div class="ouv-carte__photo">
    ${c.media({ nom: 'grok/assiette-midi', alt: c.s('carte.altJour'), cadrage: '50% 50%', priorite: true, classe: 'ouv-carte__img ouv-carte__img--jour', sizes: '(max-width: 760px) 100vw, 50vw' })}
    ${avecVideo(c.media({ nom: 'grok/assiette-soir', alt: c.s('carte.altSoir'), cadrage: '50% 50%', classe: 'ouv-carte__img ouv-carte__img--soir', sizes: '(max-width: 760px) 100vw, 50vw', }), 'boucle-vapeur', { masque: 'vapeur' })}
    <p class="heure-geante ouv-carte__heure" data-iris-centre data-grille="typo" data-effet="axes" aria-hidden="true"><span data-moment-seul="jour">${c.s('carte.heureJour')}</span><span data-moment-seul="soir">${c.s('carte.heureSoir')}</span></p>
  </div>
  <div class="ouv-carte__texte">
    <p class="surtitre"><span data-moment-seul="jour">${c.t('carte.surJour')}</span><span data-moment-seul="soir">${c.t('carte.surSoir')}</span></p>
    <h1 data-anime="lettres">${c.t('carte.titre')}</h1>
    <p class="masque-ecran-tres-bas"><span data-moment-seul="jour">${c.t('carte.texteJour')}</span><span data-moment-seul="soir">${c.t('carte.texteSoir')}</span></p>
    <p class="ouv-carte__info" data-info-cle data-prix>${c.t('carte.info')}</p>
    <p class="ouv-carte__actions">
      <a class="bouton" href="${c.url('reserver', 'formulaire', 'service=midi')}" data-libelle="${c.libelle('reserver')}" data-action-principale data-moment-seul="jour">${c.t('carte.reserverJour')}</a>
      <a class="bouton" href="${c.url('reserver', 'formulaire', 'service=soir')}" data-libelle="${c.libelle('reserver')}" data-action-principale data-moment-seul="soir">${c.t('carte.reserverSoir')}</a>
      <button type="button" class="bouton bouton--contour bascule-moment" data-bascule-moment><span data-moment-seul="jour">${c.t('carte.basculeSoir')}</span><span data-moment-seul="soir">${c.t('carte.basculeJour')}</span></button>
    </p>
  </div>
</section>

<section class="carte-resto" id="toute-la-carte" data-module="carte-du-restaurant" aria-labelledby="carte-titre">
  <header class="carte-resto__tete socle-cadre">
    <p class="socle-surtitre">${c.t('carte.carteSur')}</p>
    <h2 id="carte-titre" data-anime="lignes">${c.t('carte.carteTitre')}</h2>
    <p>${c.t('carte.carteTexte')}</p>
  </header>
  <div class="carte-resto__carte socle-cadre" data-carte>
${fragment(carte)}
  </div>
</section>

<section class="passe-chef" id="passe" aria-labelledby="passe-titre">
  ${c.media({ nom: 'grok/mains-chef', alt: c.s('carte.passeAlt'), cadrage: '62% 50%', classe: 'passe-chef__photo', sizes: '100vw', attrs: 'data-fx="parallaxe" data-fx-force="10"' })}
  <div class="conteneur passe-chef__texte">
    <p class="surtitre">${c.t('carte.passeSur')}</p>
    <h2 id="passe-titre" data-anime="lignes">${c.t('carte.passeTitre')}</h2>
    <p data-anime>${c.t('carte.passeTexte')}</p>
  </div>
</section>

<section class="fin-carte" id="fin" aria-labelledby="fin-titre">
  <div class="conteneur fin-carte__grille">
    <div>
      <h2 id="fin-titre" data-anime="lignes">${c.t('carte.finTitre')}</h2>
      <p data-anime>${c.t('carte.finTexte')}</p>
      <p class="statut"><span class="statut__point" aria-hidden="true"></span><a href="${c.url('infos-pratiques', 'horaires')}" data-libelle="${c.libelle('infos-pratiques')}" data-statut-accueil>${c.t('carte.horaires')}</a></p>
      <script type="application/json" data-reservation-accueil>${brut(JSON.stringify(c.donnees.reservation).replace(/<\//g, '<\\/'))}</script>
      <script type="application/json" data-horaires-accueil>${brut(JSON.stringify(c.donnees.horaires).replace(/<\//g, '<\\/'))}</script>
      <p class="fin-carte__actions">${c.lien('reserver', { ancre: 'formulaire', classe: 'bouton', texte: c.t('carte.reserverSoir') })} <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a></p>
    </div>
    <div class="fin-carte__vraies" data-anime="cascade">
      ${['carte-entrees', 'carte-plats', 'carte-desserts'].map((n) => c.media({ nom: n, alt: '', classe: 'fin-carte__vraie', sizes: '200px' }))}
    </div>
  </div>
</section>
`;
};
