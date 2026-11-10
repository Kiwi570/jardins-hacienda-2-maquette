/* Page 404 : « Table introuvable », la planche vide et la cloche couchée (image Grok). */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: '404', fichier: '404', langues: ['fr'], partage: false };

export default (c) => html`
<section class="introuvable conteneur" data-lueur id="debut">
  <div class="introuvable__texte">
    <h1 data-anime="lettres">${c.t('introuvable.titre')}</h1>
    <p data-anime>${c.t('introuvable.texte')}</p>
    <p class="introuvable__actions" data-anime>${c.lien('accueil', { classe: 'bouton', texte: c.t('introuvable.retour'), attrs: 'data-action-principale' })} ${c.lien('la-carte', { classe: 'bouton bouton--contour', texte: c.t('introuvable.carte') })}</p>
  </div>
  ${c.media({ nom: 'grok/introuvable', alt: c.s('introuvable.alt'), priorite: true, classe: 'introuvable__photo', sizes: '(max-width: 760px) 100vw, 50vw', attrs: 'data-iris-centre data-fx="zoom"' })}
</section>
`;
