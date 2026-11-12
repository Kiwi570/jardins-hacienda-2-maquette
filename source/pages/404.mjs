/* 404 : « Cette page a fermé à minuit ». La salle est dans le noir ; une bougie suit la main et l'éclaire (module
   lumiere-au-pointeur, sur la vraie photo de la salle), l'heure 00:00 et deux portes de sortie. */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: '404', fichier: '404', theme: 'nuit', imagePartage: 'vraie/salle-pierre-1280.webp', modules: ['lumiere-au-pointeur'] };

export default (c) => html`
<section class="introuvable lum ecran" id="debut" data-lumiere="minuit" data-module="lumiere-au-pointeur" aria-labelledby="lum-titre">
  <div class="lum__fond" aria-hidden="true">${c.media({ nom: 'vraie/salle-pierre', alt: '', cadrage: '62% 58%', priorite: true, classe: 'introuvable__photo', sizes: '100vw' })}</div>
  <canvas class="lum__canvas" aria-hidden="true" data-audit-ignorer></canvas>
  <div class="lum__ombre" aria-hidden="true"></div>
  <div class="lum__voile" aria-hidden="true"></div>
  <div class="conteneur introuvable__texte lum__cadre">
    <h1 id="lum-titre" class="lum__titre" data-anime="lignes" data-iris-centre>${c.t('p404.titre')}</h1>
    <p class="lum__texte" data-anime>${c.t('p404.texte')}</p>
    <p class="introuvable__actions lum__actions" data-anime>${c.lien('accueil', { classe: 'bouton', texte: c.t('p404.accueil'), attrs: 'data-action-principale' })} ${c.lien('reserver', { ancre: 'formulaire', classe: 'bouton bouton--contour bouton--clair', texte: c.t('p404.reserver') })}</p>
    <div class="lum__indice indice" aria-hidden="true"><span class="lum__indice-souris">${c.t('p404.indice')}</span><span class="lum__indice-doigt">${c.t('p404.indiceDoigt')}</span></div>
  </div>
</section>
`;
