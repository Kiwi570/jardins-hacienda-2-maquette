/* « Votre réception aux Jardins » (v7.12.0) : la page du client pour UN dossier de réception, dans la continuité de
   « Votre venue ». Son projet et sa date, l'étape, la proposition courante, ce qui est convenu, les prochaines étapes,
   ce que l'on attend de lui, ses demandes et les réponses du restaurant. Il peut donner un accord (simulation), poser
   une question, renseigner une information, demander un changement : l'équipe décide.
   Démonstration : la page lit le dossier de ce navigateur (assets/js/reception-client.js) ; rien n'est envoyé, rien
   n'est signé, rien n'est payé. Elle n'est pas dans le menu et n'est pas indexée. */
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'votrereception', fichier: 'votre-reception', theme: 'jour', imagePartage: 'vraie/pergola-banquet-1280.webp', partage: false, sansEffet: true, sansAction: true, modules: [] };

export default (c) => {
  const L = c.donnees.receptions;
  const donnees = JSON.stringify({ lieux: { espaces: L.espaces, durees: L.durees }, telephone: c.site.contact.telephone, telephoneLien: c.site.contact.telephoneLien, adresse: c.site.contact.adresse,
    liens: { receptions: c.url('receptions'), infos: c.url('infos-pratiques') } }).replace(/</g, '\\u003c');
  return html`
<section class="venue venue--reception" id="reception" data-reception-client aria-labelledby="reception-titre">
  <script type="application/json" data-reception-donnees>${brut(donnees)}</script>
  <div class="conteneur venue__cadre">
    <div class="venue__photo">${c.media({ nom: 'vraie/pergola-banquet', alt: c.t('votreReception.photoAlt'), cadrage: '50% 50%', priorite: true, sizes: '(max-width: 800px) 100vw, 760px' })}</div>
    <p class="surtitre venue__sur">${c.t('votreReception.surtitre')}</p>
    <h1 id="reception-titre" class="venue__titre">${c.t('votreReception.titre')}</h1>
    <div class="venue__corps" data-reception-corps>
      <p class="venue__attente">${c.t('votreReception.chargement')}</p>
    </div>
    <noscript><p class="venue__attente">${c.t('votreReception.sansScript')} <a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a>.</p></noscript>
  </div>
</section>
`;
};
