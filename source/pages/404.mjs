/* 404 : « Cette page a fermé à minuit ». La terrasse la nuit, l'heure 00:00 et deux portes de sortie. */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: '404', fichier: '404', theme: 'nuit', imagePartage: 'grok/terrasse-nuit-1280.webp' };

export default (c) => html`
<section class="introuvable ecran" id="debut" data-lumiere="minuit">
  ${c.media({ nom: 'grok/terrasse-nuit', alt: c.s('p404.alt'), cadrage: '50% 50%', priorite: true, classe: 'introuvable__photo', sizes: '100vw', attrs: 'data-fx="zoom"' })}
  <div class="conteneur introuvable__texte">
    <p class="heure-geante heure-geante--nuit" data-iris-centre data-grille="typo fil" data-effet="axes" aria-hidden="true"><span class="hg__h">00</span><span class="hg__sep">:</span><span class="hg__m">00</span></p>
    <h1 data-anime="lignes">${c.t('p404.titre')}</h1>
    <p data-anime>${c.t('p404.texte')}</p>
    <p class="introuvable__actions" data-anime>${c.lien('accueil', { classe: 'bouton', texte: c.t('p404.accueil'), attrs: 'data-action-principale' })} ${c.lien('reserver', { ancre: 'formulaire', classe: 'bouton bouton--contour bouton--clair', texte: c.t('p404.reserver') })}</p>
  </div>
</section>
`;
