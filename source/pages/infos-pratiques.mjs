/* Infos pratiques : le numéro de téléphone en très grand (il s'imprime chiffre à chiffre), le cadran des horaires
   avec « ouvert maintenant » (module horaires-ouvert-maintenant, horaires de RankEat validés par l'utilisateur,
   à confirmer), l'accès, les journées festives, et un formulaire de contact simulé (socle). */
import { html, brut, fragment } from '../../outils/gabarit.mjs';
import { preparer, rendreBloc } from '../../assets/js/modules/horaires-ouvert-maintenant/horaires-calcul.js';

export const page = { cle: 'infos-pratiques', fichier: 'infos-pratiques', imagePartage: 'infos-ouverture-1280.webp', modules: ['fil-conducteur', 'horaires-ouvert-maintenant'] };

export default (c) => {
  const h = c.donnees.horaires;
  const d = preparer(h);
  const json = JSON.stringify(h).replace(/<\//g, '<\\/');
  return html`
<section class="ouv-infos clair" id="debut" data-fil="gauche" data-grille="fil">
  <div class="conteneur ouv-infos__tete">
    <p class="surtitre" data-anime>${c.t('infos.surtitre')}</p>
    <h1 data-anime="lignes">${c.t('infos.titre')}</h1>
    <p class="ouv-infos__numero"><a href="tel:${c.site.contact.telephoneLien}" data-action-principale data-effet="numero" data-grille="typo">${c.site.contact.telephone}</a></p>
    <p class="ouv-infos__ligne"><span class="masque-ecran-tres-bas">${c.t('infos.texte')}</span> <span class="ouv-infos__adresse" data-info-cle>${c.t('infos.info')}</span></p>
  </div>
  ${c.media({ nom: 'infos-ouverture', alt: c.s('infos.alt'), cadrage: '47% 61%', priorite: true, classe: 'ouv-infos__bandeau', sizes: '100vw', attrs: 'data-iris-centre data-fx="parallaxe" data-fx-force="10"' })}
</section>

<section class="horaires socle-cadre" id="horaires" data-module="horaires-ouvert-maintenant" data-fil="droite" aria-labelledby="horaires-titre">
  <div class="horaires__grille">
    <div class="horaires__cadran" aria-hidden="true" data-effet="cadran" data-visuel></div>
    <div class="horaires__texte">
      <p class="socle-surtitre">${c.t('infos.horairesSurtitre')}</p>
      <h2 id="horaires-titre" data-anime="lignes">${c.t('infos.horairesTitre')}</h2>
      <div class="horaires__adresses" data-horaires-choix role="group" aria-label="Choisir une adresse" hidden></div>
      <p class="horaires__statut" data-horaires-statut><span class="horaires__pastille" aria-hidden="true"></span><span>Horaires de la semaine</span></p>
      <noscript><style>.horaires__cadran{display:none!important}.horaires__grille{grid-template-columns:minmax(0,1fr)!important}</style></noscript>
      <script type="application/json" data-horaires>${brut(json)}</script>
      <div class="horaires__texte-adresse" data-horaires-texte>${fragment(d.adresses.map((a) => rendreBloc(a, false)).join(''))}</div>
      <p class="horaires__note">${c.t('infos.horairesNote')}</p>
      ${c.media({ nom: 'recevoir-terrasse', alt: c.s('infos.horairesPhotoAlt'), classe: 'horaires__photo', sizes: '(max-width: 760px) 92vw, 40vw' })}
    </div>
  </div>
</section>

<section class="acces" id="acces" data-fil="gauche" aria-labelledby="acces-titre">
  <div class="acces__mots" data-fx="mots-geants" data-fx-force="18" aria-hidden="true" data-ruban data-visuel>
    <p data-fx-rangee>${c.t('infos.villes')} ${c.t('infos.villes')}</p>
  </div>
  <div class="conteneur acces__grille">
    <div>
      <p class="surtitre">${c.t('infos.accesSurtitre')}</p>
      <h2 id="acces-titre" data-anime="lignes">${c.t('infos.accesTitre')}</h2>
      <p data-anime>${c.t('infos.accesTexte')}</p>
      <p data-anime><a class="bouton bouton--contour" href="https://www.google.com/maps/search/?api=1&amp;query=6+Vathier+Haye+54580+Moineville" target="_blank" rel="noopener">${c.t('infos.itineraire')}</a></p>
    </div>
    <dl class="acces__regles" data-anime="cascade">
      <div><dt>${c.t('infos.festivesTitre')}</dt><dd>${c.t('infos.festivesTexte')}</dd></div>
      <div><dt>${c.t('infos.piscineTitre')}</dt><dd>${c.t('infos.piscineTexte')}</dd></div>
      <div><dt>${c.t('infos.barTitre')}</dt><dd>${c.t('infos.barTexte')}</dd></div>
    </dl>
  </div>
</section>

<section class="ecrire clair" id="ecrire" data-fil="droite" aria-labelledby="ecrire-titre">
  <div class="conteneur ecrire__grille">
    ${c.media({ nom: 'recevoir-mariages', alt: c.s('infos.ecrireAlt'), classe: 'ecrire__photo', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-anime="rideau"' })}
    <form class="ecrire__form" data-formulaire action="#ecrire" novalidate>
      <p class="surtitre">${c.t('infos.ecrireSurtitre')}</p>
      <h2 id="ecrire-titre" data-anime="lignes">${c.t('infos.ecrireTitre')}</h2>
      <p>${c.t('infos.ecrireTexte')}</p>
      <div class="ecrire__deux">
        <label><span>${c.t('infos.prenom')}</span><input type="text" name="prenom" autocomplete="given-name" required></label>
        <label><span>${c.t('infos.nom')}</span><input type="text" name="nom" autocomplete="family-name" required></label>
        <label><span>${c.t('infos.email')}</span><input type="email" name="email" autocomplete="email" required></label>
        <label><span>${c.t('infos.telephone')}</span><input type="tel" name="telephone" autocomplete="tel" required></label>
      </div>
      <label><span>${c.t('infos.sujet')}</span><select name="sujet">
        <option value="reservation">${c.t('infos.sujetReservation')}</option>
        <option value="mariage">${c.t('infos.sujetMariage')}</option>
        <option value="reception">${c.t('infos.sujetReception')}</option>
        <option value="evenement">${c.t('infos.sujetEvenement')}</option>
        <option value="autre">${c.t('infos.sujetAutre')}</option>
      </select></label>
      <label><span>${c.t('infos.message')}</span><textarea name="message" rows="4"></textarea></label>
      <p class="ecrire__rgpd">${c.t('infos.rgpd')}</p>
      <p><button type="submit" class="bouton">${c.t('infos.envoyer')}</button></p>
      <p class="ecrire__message" data-message-envoi role="status" hidden></p>
    </form>
  </div>
</section>
`;
};
