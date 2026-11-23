/* Offrir · la carte cadeau s'écrit aux Jardins. Ouverture (v7.5.15) : la salle au soleil de midi, la carte dorée en vrai
   objet (elle se redresse au défilement, s'incline vers la souris avec un reflet qui la suit, se retourne d'un toucher :
   au dos, la place du mot écrit à la main) ; le texte change avec la saison. Puis la carte se compose
   (module carte-cadeau-qui-se-compose, montants du site actuel) et part dans son enveloppe (code gardé de la v5).
   v7.5.21 · une seule carte partout (vert de nuit et or, comme l'accueil, Les fêtes et la carte composée) ; partir d'une
   idée ; la carte reste à l'écran pendant qu'on écrit ; « Pour la recevoir » en trois étapes ; l'enveloppe rouge et or. */
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'offrir', fichier: 'offrir', theme: 'nuit', imagePartage: 'vraie/salle-midi-1280.webp', modules: ['carte-cadeau-qui-se-compose'] };

/* v7.5.21 · Partir d'une idée : trois moments avec les vrais prix de la carte et des fêtes ; un toucher choisit le montant
   et écrit un mot suggéré sur la carte. */
const IDEES = [
  { cle: 'Planche', montant: 50, image: 'carte-partager-480' },
  { cle: 'Diner', montant: 100, image: 'carte-plats-480' },
  { cle: 'Sylvestre', montant: 200, image: 'vraie/affiche-sylvestre-480' },
];

export default (c) => html`
<section class="ouv-offrir" id="debut">
  ${c.media({ nom: 'vraie/salle-midi', alt: c.s('offrir.alt'), cadrage: '46% 50%', cadrageMobile: '50% 40%', priorite: true, classe: 'ouv-offrir__fond', sizes: '100vw', attrs: 'data-edit-photo="offrir-ouverture"' })}
  <div class="conteneur ouv-offrir__grille">
    <div class="ouv-offrir__texte">
      <p class="surtitre">${c.t('offrir.sur')}</p>
      <h1 data-anime="lettres">${c.t('offrir.titre')}</h1>
      <p class="masque-ecran-tres-bas"><span data-saison-seul="hiver">${c.t('offrir.texteHiver')}</span><span data-saison-seul="ete">${c.t('offrir.texteEte')}</span></p>
      <p class="ouv-offrir__actions"><a class="bouton" href="#composer" data-action-principale data-sans-transition>${c.t('offrir.action')}</a> <span class="ouv-offrir__info" data-info-cle data-prix>${c.t('offrir.info')}</span></p>
    </div>
    <div class="carte-cadeau-apercu ouv-offrir__carte" data-effet="carte-apercu" data-iris-centre data-grille="manipuler" data-cca>
      <div class="cca__objet">
        <div class="cca__face" aria-hidden="true">
          <div class="cca__haut"><img src="/assets/images/logo-clair.png" alt="" width="56" height="56"><span class="cca__noms"><span class="cca__nom">${c.t('offrir.carte')}</span><span class="cca__pour">${c.site.nom}</span><span class="cca__validite">${c.t('offrir.validite')}</span></span></div>
          <p class="cca__montant" data-montant-tournant>100 €</p>
          <span class="cca__brillance"></span>
        </div>
        <div class="cca__dos" data-face="dos" aria-hidden="true">
          <p class="cca__dos-sur">${c.t('offrir.dosSur')}</p>
          <p class="cca__dos-mot">${c.t('offrir.dosMot')}</p>
          <p class="cca__dos-bas"><span>${c.t('offrir.validite')}</span><span class="cca__dos-signe">${c.t('offrir.dosSigne')}</span></p>
        </div>
      </div>
      <button type="button" class="cca__retourner" data-cca-retourner aria-pressed="false" aria-label="${c.s('offrir.retourner')}"></button>
    </div>
  </div>
  <p class="indice ouv-offrir__indice" aria-hidden="true"><span class="indice--souris">${c.t('offrir.indice')}</span><span class="indice--doigt">${c.t('offrir.indiceTactile')}</span></p>
</section>

<section class="ccq offrir-composer" id="composer" data-module="carte-cadeau-qui-se-compose" data-cachet="JH" data-grille="retour" aria-labelledby="ccq-titre">
  <div class="ccq__grille socle-cadre">
    <div class="ccq__tete">
      <p class="socle-surtitre">${c.t('offrir.composerSur')}</p>
      <h2 id="ccq-titre" data-anime="lignes">${c.t('offrir.composerTitre')}</h2>
      <p>${c.t('offrir.composerTexte')}</p>
    </div>
    <div class="ccq__scene" aria-hidden="true">
      <div class="ccq__plateau"><div class="ccq__paquet"><div class="ccq__carte">
        <svg class="ccq__cadre" viewBox="0 0 160 100" preserveAspectRatio="none"><rect x="3.2" y="3.2" width="153.6" height="93.6" rx="5" ry="5" pathLength="1"/></svg>
        <div class="ccq__carte-haut">
          <span class="ccq__logo"><img src="/assets/images/logo-clair.png" alt="" width="48" height="48"></span>
          <span class="ccq__noms"><span class="ccq__type">${c.t('offrir.carte')}</span><span class="ccq__maison">${c.site.nom}</span><span class="ccq__validite">${c.t('offrir.validite')}</span></span>
          <span class="ccq__quantite" data-ccq-quantite hidden>× 1</span>
        </div>
        <div class="ccq__carte-bas">
          <p class="ccq__montant"><span data-ccq-montant>50</span><span class="ccq__devise">€</span></p>
          <div class="ccq__dedicace" data-grille="typo"><p class="ccq__pour" data-ccq-pour></p><p class="ccq__mot" data-ccq-mot></p><p class="ccq__de" data-ccq-de></p></div>
        </div>
        <span class="ccq__filigrane" aria-hidden="true"></span>
        <span class="ccq__reflet"></span>
      </div></div></div>
      <p class="ccq__ticket" data-ccq-ticket>Une carte de 50 €</p>
    </div>
    <form class="ccq__form" action="#composer" method="get" novalidate>
      <div class="ccq__champ idees" role="group" aria-labelledby="idees-titre">
        <p class="ccq__libelle" id="idees-titre">${c.t('offrir.ideesTitre')}</p>
        <div class="idees__liste">
          ${IDEES.map((d) => html`<button type="button" class="idee" data-idee-montant="${d.montant}" data-idee-mot="${c.s(`offrir.idee${d.cle}Mot`)}" aria-pressed="false">
            <img class="idee__photo" src="/assets/images/${d.image}.webp" alt="" width="64" height="64" loading="lazy">
            <span class="idee__texte"><span class="idee__titre">${c.t(`offrir.idee${d.cle}T`)}</span><span class="idee__prix">${c.t(`offrir.idee${d.cle}P`)}</span></span>
            <span class="idee__montant">${d.montant} €</span>
          </button>`)}
        </div>
        <p class="ccq__aide idees__aide">${c.t('offrir.ideesAide')}</p>
      </div>
      <fieldset class="ccq__champ ccq__montants">
        <legend class="ccq__libelle">Montant</legend>
        <div class="ccq__puces">
          ${c.donnees.cadeaux.montants.map((m) => html`<label class="ccq__puce" data-cadeau="cadeau-${m}"><input type="radio" name="montant" value="${m}"${m === 50 ? html` checked` : ''}><span>${m} €</span></label>`)}
        </div>
        <p class="ccq__presentation" data-cadeau-presentation hidden></p>
        <script type="application/json" data-cadeaux-base>${brut(JSON.stringify(c.donnees.cadeaux.montants))}</script>
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
      <fieldset class="ccq__champ ccq__acheteur" data-cadeau-acheteur>
        <legend class="ccq__libelle">Vos coordonnées <span class="ccq__facultatif">pour vous rappeler</span></legend>
        <div class="ccq__deux">
          <div class="ccq__champ"><label class="ccq__libelle" for="ccq-ach-nom">Votre nom</label><input type="text" id="ccq-ach-nom" name="acheteur_nom" maxlength="60" autocomplete="name"></div>
          <div class="ccq__champ"><label class="ccq__libelle" for="ccq-ach-tel">Téléphone</label><input type="tel" id="ccq-ach-tel" name="acheteur_tel" maxlength="20" autocomplete="tel" inputmode="tel"></div>
        </div>
        <div class="ccq__champ"><label class="ccq__libelle" for="ccq-ach-email">E-mail <span class="ccq__facultatif">facultatif</span></label><input type="email" id="ccq-ach-email" name="acheteur_email" maxlength="80" autocomplete="email"></div>
      </fieldset>
      <p class="ccq__total"><span>Total</span><output data-ccq-total for="ccq-qte">50 €</output></p>
      <p class="socle-sr" aria-live="polite" data-ccq-annonce></p>
      <div class="ccq__actions">
        <button type="submit" class="socle-bouton socle-bouton--plein ccq__offrir">Offrir cette carte</button>
        <button type="button" class="socle-bouton" data-ccq-reprendre hidden>Offrir une autre carte</button>
      </div>
      <p class="ccq__statut" role="status" data-ccq-statut hidden></p>
      <div class="ccq__recevoir">
        <p class="ccq__libelle">${c.t('offrir.etapesTitre')}</p>
        <ol class="etapes-cadeau">
          <li><span class="etapes-cadeau__n" aria-hidden="true">1</span><span>${c.t('offrir.etape1')}</span></li>
          <li><span class="etapes-cadeau__n" aria-hidden="true">2</span><span>${c.t('offrir.etape2')} <a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a> ${c.t('offrir.etape2b')}</span></li>
          <li><span class="etapes-cadeau__n" aria-hidden="true">3</span><span>${c.t('offrir.etape3')}</span></li>
        </ol>
      </div>
      <p class="ccq__note">${c.t('offrir.note')} ${c.t('offrir.simule')}</p>
    </form>
  </div>
</section>
`;
