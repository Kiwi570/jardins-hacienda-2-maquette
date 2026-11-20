/* « Votre venue aux Jardins » (v7.11.0) : la page du client pour UNE réservation. Statut, récapitulatif, informations
   pratiques, et ce qu'il peut faire : reconfirmer, demander un changement, compléter, annuler. Pas de compte client :
   on y arrive par le lien propre à la réservation (envoyé avec la confirmation et le rappel).
   Démonstration : la page lit les réservations de ce navigateur (assets/js/venue.js) ; rien n'est envoyé. Elle n'est
   pas dans le menu et n'est pas indexée. */
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'venue', fichier: 'votre-venue', theme: 'jour', imagePartage: 'vraie/salle-soleil-1280.webp', partage: false, sansEffet: true, sansAction: true, modules: [] };

export default (c) => {
  const donnees = JSON.stringify({ reservation: c.donnees.reservation, telephone: c.site.contact.telephone, telephoneLien: c.site.contact.telephoneLien, adresse: c.site.contact.adresse,
    liens: { reserver: c.url('reserver', 'formulaire'), infos: c.url('infos-pratiques') } }).replace(/</g, '\\u003c');
  return html`
<section class="venue" id="venue" data-venue aria-labelledby="venue-titre">
  <script type="application/json" data-venue-donnees>${brut(donnees)}</script>
  <div class="conteneur venue__cadre">
    <div class="venue__photo">${c.media({ nom: 'vraie/salle-soleil', alt: c.t('venue.photoAlt'), cadrage: '50% 58%', priorite: true, sizes: '(max-width: 800px) 100vw, 760px' })}</div>
    <p class="surtitre venue__sur">${c.t('venue.surtitre')}</p>
    <h1 id="venue-titre" class="venue__titre">${c.t('venue.titre')}</h1>
    <div class="venue__corps" data-venue-corps>
      <p class="venue__attente">${c.t('venue.chargement')}</p>
    </div>
    <noscript><p class="venue__attente">${c.t('venue.sansScript')} <a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a>.</p></noscript>
  </div>
</section>
`;
};
