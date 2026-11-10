/* Offrir : ouverture centrée sur le kraft et la cire (Grok), la carte cadeau qui flotte ; puis la carte se compose
   (module carte-cadeau-qui-se-compose, montants du site actuel, sans montant libre) et part dans son enveloppe. */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: 'offrir', fichier: 'offrir', imagePartage: 'grok/offrir-ouverture-1280.webp', modules: ['fil-conducteur', 'carte-cadeau-qui-se-compose'] };

const MONTANTS = [25, 50, 100, 150, 200];

export default (c) => html`
<section class="ouv-offrir" id="debut" data-fil="gauche" data-grille="fil">
  ${c.media({ nom: 'grok/offrir-ouverture', alt: c.s('offrir.alt'), cadrage: '62% 50%', priorite: true, classe: 'ouv-offrir__fond', sizes: '100vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
  <div class="conteneur ouv-offrir__centre">
    <p class="surtitre" data-anime>${c.t('offrir.surtitre')}</p>
    <h1 data-anime="lettres">${c.t('offrir.titre')}</h1>
    <p class="masque-ecran-tres-bas" data-anime>${c.t('offrir.texte')}</p>
    <div class="ouv-offrir__carte" data-iris-centre aria-hidden="true" data-fx="vitesse" data-fx-force="5" data-visuel>
      <img src="/assets/images/logo-clair.png" alt="" width="44" height="44"><span class="ouv-offrir__type">${c.t('accueil.offrir.carte')}</span><span class="ouv-offrir__montant">50 €</span>
    </div>
    <p class="ouv-offrir__actions"><a class="bouton" href="#composer" data-action-principale data-sans-transition>${c.t('offrir.action')}</a> <span class="ouv-offrir__info" data-info-cle data-prix>${c.t('offrir.info')}</span></p>
  </div>
</section>

<section class="ccq offrir-composer" id="composer" data-module="carte-cadeau-qui-se-compose" data-cachet="JH" data-fil="droite" data-grille="retour" aria-labelledby="ccq-titre">
  <div class="ccq__grille socle-cadre">
    <div class="ccq__tete">
      <p class="socle-surtitre">${c.t('offrir.composerSurtitre')}</p>
      <h2 id="ccq-titre" data-anime="lignes">${c.t('offrir.composerTitre')}</h2>
      <p>${c.t('offrir.composerTexte')}</p>
    </div>
    <div class="ccq__scene" aria-hidden="true">
      <div class="ccq__plateau"><div class="ccq__paquet"><div class="ccq__carte">
        <svg class="ccq__cadre" viewBox="0 0 160 100" preserveAspectRatio="none"><rect x="3.2" y="3.2" width="153.6" height="93.6" rx="5" ry="5" pathLength="1"/></svg>
        <div class="ccq__carte-haut">
          <span class="ccq__logo"><img src="/assets/images/logo-clair.png" alt="" width="48" height="48"></span>
          <span class="ccq__noms"><span class="ccq__type">${c.t('accueil.offrir.carte')}</span><span class="ccq__maison">${c.site.nom}</span></span>
          <span class="ccq__quantite" data-ccq-quantite hidden>× 1</span>
        </div>
        <div class="ccq__carte-bas">
          <p class="ccq__montant"><span data-ccq-montant>50</span><span class="ccq__devise">€</span></p>
          <div class="ccq__dedicace" data-grille="typo"><p class="ccq__pour" data-ccq-pour></p><p class="ccq__mot" data-ccq-mot></p><p class="ccq__de" data-ccq-de></p></div>
        </div>
        <span class="ccq__reflet"></span>
      </div></div></div>
      <p class="ccq__ticket" data-ccq-ticket>Une carte de 50 €</p>
    </div>
    <form class="ccq__form" action="#composer" method="get" novalidate>
      <fieldset class="ccq__champ ccq__montants">
        <legend class="ccq__libelle">Montant</legend>
        <div class="ccq__puces">
          ${MONTANTS.map((m) => html`<label class="ccq__puce"><input type="radio" name="montant" value="${m}"${m === 50 ? html` checked` : ''}><span>${m} €</span></label>`)}
        </div>
        <p class="ccq__erreur" id="ccq-erreur-montant" data-ccq-erreur="montant" aria-live="polite"></p>
      </fieldset>
      <div class="ccq__champ">
        <label class="ccq__libelle" for="ccq-qte">Nombre de cartes</label>
        <div class="ccq__qte">
          <button type="button" data-ccq-moins aria-label="Une carte de moins" aria-controls="ccq-qte">−</button>
          <input type="number" id="ccq-qte" name="quantite" value="1" min="1" max="10" step="1" inputmode="numeric">
          <button type="button" data-ccq-plus aria-label="Une carte de plus" aria-controls="ccq-qte">+</button>
        </div>
      </div>
      <div class="ccq__deux">
        <div class="ccq__champ"><label class="ccq__libelle" for="ccq-pour">Pour</label><input type="text" id="ccq-pour" name="pour" maxlength="30" autocomplete="off" placeholder="Prénom"></div>
        <div class="ccq__champ"><label class="ccq__libelle" for="ccq-de">De la part de</label><input type="text" id="ccq-de" name="de" maxlength="30" autocomplete="given-name" placeholder="Votre prénom"></div>
      </div>
      <div class="ccq__champ">
        <label class="ccq__libelle" for="ccq-mot">Un petit mot <span class="ccq__facultatif">facultatif</span></label>
        <textarea id="ccq-mot" name="mot" rows="2" maxlength="120" aria-describedby="ccq-reste"></textarea>
        <p class="ccq__aide" id="ccq-reste"><span data-ccq-reste>120</span> caractères au plus</p>
      </div>
      <p class="ccq__total"><span>Total</span><output data-ccq-total for="ccq-qte">50 €</output></p>
      <p class="socle-sr" aria-live="polite" data-ccq-annonce></p>
      <div class="ccq__actions">
        <button type="submit" class="socle-bouton socle-bouton--plein ccq__offrir">Offrir cette carte</button>
        <button type="button" class="socle-bouton" data-ccq-reprendre hidden>Composer une autre carte</button>
      </div>
      <p class="ccq__statut" role="status" data-ccq-statut hidden></p>
      <p class="ccq__note">${c.t('offrir.conditions')} ${c.t('offrir.remise')} ${c.t('offrir.simule')}</p>
    </form>
  </div>
</section>
`;
