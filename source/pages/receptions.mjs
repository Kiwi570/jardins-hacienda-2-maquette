/* Réceptions · « la grande table » (nouvelle page v6, vraies photos en v7) : en arrivant d'une autre page, le voile
   s'ouvre en lanières comme des palmes qui s'écartent (module rideau-en-lanieres) sur la pergola dressée, le mot de l'occasion qui
   change dans le titre (mariage, baptême, anniversaire, pot de départ), trois espaces en volets qui s'ouvrent
   (la salle d'abord l'hiver, la terrasse d'abord l'été), ce que l'on fête ici (vraies photos), puis la demande
   en trois étapes ; à l'envoi, un carton d'invitation reçoit le tampon « Demande reçue ». */
import { html, brut } from '../../outils/gabarit.mjs';
import { avecVideo } from '../gabarits/video.mjs';

export const page = { cle: 'receptions', fichier: 'receptions', theme: 'nuit', imagePartage: 'vraie/pergola-banquet-1280.webp', modules: ['rideau-en-lanieres'] };

const ESPACES = [
  { cle: 'salle', image: 'vraie/salle-pierre', cadrage: '60% 55%', saison: 'hiver' },
  { cle: 'terrasse', image: 'vraie/brasero', cadrage: '45% 62%', saison: 'ete' },
  { cle: 'piscine', image: 'vraie/piscine-palmiers', cadrage: '55% 62%', saison: 'ete' },
];
const OCCASIONS = ['mariages', 'baptemes', 'anniversaires', 'depart'];

/* v7.4 · « Recevoir, le soir venu » (venue de l'accueil) : la terrasse passe de la lumière d'or à l'heure bleue puis à la nuit
   au défilement, les guirlandes s'allument une à une. Un halo posé sur chaque vraie ampoule de l'image (positions relevées
   sur terrasse-nuit, en pixels de la source 1792 × 1008), au cadre de l'image : ordinateur ou recadrage téléphone. */
const guirlandes = (a) => {
  const [W, H] = a.source, m = a.mobile.join(' ');
  const bulbes = a.ampoules.map(([x, y], i) => `<g class="ampoule" style="--i:${i}"><circle class="halo" cx="${x}" cy="${y}" r="30"/><circle class="coeur" cx="${x}" cy="${y}" r="5.5"/><circle class="cible" cx="${x}" cy="${y}" r="18"/></g>`).join('');
  return `<svg class="guirlandes" data-effet="guirlandes" viewBox="0 0 ${W} ${H}" data-vue="0 0 ${W} ${H}" data-vue-telephone="${m}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" data-audit-ignorer><defs><radialGradient id="halo-ampoule"><stop offset="0" stop-color="#fff0c2" stop-opacity=".95"/><stop offset=".28" stop-color="#ffc766" stop-opacity=".5"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient></defs>${bulbes}</svg>`;
};

export default (c) => {
  const mots = c.s('receptions.mots').split('|');
  return html`
<script>try{var d=document.documentElement;if(d.getAttribute('data-arrivee')!=='voile'||d.classList.contains('calme'))d.classList.add('rdl-vu')}catch(e){}</script>
<div class="rdl" data-module="rideau-en-lanieres" aria-hidden="true">
  <div class="rdl__lanieres"></div>
  <button type="button" class="rdl__passer socle-bouton">${c.t('receptions.passerOuverture')}</button>
</div>
<section class="ouv-recep" id="debut">
  ${c.media({ nom: 'vraie/pergola-banquet', alt: c.s('receptions.alt'), cadrage: '50% 52%', priorite: true, classe: 'ouv-recep__fond', sizes: '100vw', attrs: 'data-fx="zoom" data-fx-force="10"' })}
  <div class="conteneur ouv-recep__contenu">
    <p class="surtitre">${c.t('receptions.sur')}</p>
    <h1 class="ouv-recep__titre" data-iris-centre>${c.t('receptions.titreAvant')} <span class="mot-tournant" data-grille="typo" data-effet="mot" data-mots="${mots.join('|')}"><span class="mot-tournant__mot">${mots[0]}</span></span></h1>
    <p class="masque-ecran-bas masque-telephone">${c.t('receptions.texte')}</p>
    <p class="ouv-recep__actions"><a class="bouton" href="#demande" data-action-principale data-sans-transition>${c.t('receptions.action')}</a> <a class="bouton bouton--contour bouton--clair" href="#espaces" data-sans-transition>${c.t('receptions.espacesLien')}</a></p>
    <p class="ouv-recep__info" data-info-cle><a href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a></p>
  </div>
</section>

<section class="terrasse" id="terrasse" data-scene data-entete-cache data-grille="scene" aria-labelledby="terrasse-titre">
  <div class="terrasse__cadre" data-collant>
    <div class="terrasse__images" data-effet="terrasse">
      ${c.media({ nom: 'grok/terrasse-or', alt: c.s('accueil.terrasse.alt1'), cadrage: '50% 50%', classe: 'terrasse__img terrasse__img--1', sizes: '100vw' })}
      ${c.media({ nom: 'grok/terrasse-bleue', alt: c.s('accueil.terrasse.alt2'), cadrage: '50% 50%', classe: 'terrasse__img terrasse__img--2', sizes: '100vw' })}
      ${c.media({ nom: 'grok/terrasse-nuit', alt: c.s('accueil.terrasse.alt3'), cadrage: '50% 50%', classe: 'terrasse__img terrasse__img--3', sizes: '100vw' })}
      ${brut(guirlandes(c.donnees.ampoules))}
    </div>
    <div class="terrasse__texte conteneur">
      <p class="surtitre">${c.t('accueil.terrasse.surtitreHiver')}</p>
      <h2 id="terrasse-titre">${c.t('accueil.terrasse.titre')}</h2>
      <ol class="terrasse__etapes">
        <li data-etape="1">${c.t('accueil.terrasse.e1')}</li>
        <li data-etape="2">${c.t('accueil.terrasse.e2')}</li>
        <li data-etape="3">${c.t('accueil.terrasse.e3')}</li>
      </ol>
      <p class="terrasse__fin">
        <a class="bouton" href="#demande" data-sans-transition>${c.t('accueil.terrasse.action')}</a>
        <a class="bouton bouton--contour bouton--clair" href="#espaces" data-sans-transition>${c.t('accueil.terrasse.espaces')}</a>
      </p>
      <p class="saison-tag saison-tag--nuit">${c.t('accueil.terrasse.saison')}</p>
    </div>
    <p class="indice terrasse__indice" aria-hidden="true">${c.t('accueil.terrasse.indice')}</p>
  </div>
</section>

<section class="espaces" id="espaces" aria-labelledby="espaces-titre">
  <div class="conteneur espaces__tete">
    <p class="surtitre">${c.t('receptions.espacesSur')}</p>
    <h2 id="espaces-titre" data-anime="lignes">${c.t('receptions.espacesTitre')}</h2>
    <p class="espaces__info" data-info>${c.t('receptions.espacesInfo')}</p>
  </div>
  <div class="volets" data-effet="volets">
    ${ESPACES.map((e, i) => html`<article class="volet${i === 0 ? ' est-ouvert' : ''}" data-volet data-saison-ordre="${e.saison}" id="espace-${e.cle}">
      ${((m) => e.video ? avecVideo(m, e.video) : m)(c.media({ nom: e.image, alt: c.s(`receptions.alt${e.cle[0].toUpperCase()}${e.cle.slice(1)}`), cadrage: e.cadrage, classe: 'volet__photo', sizes: '(max-width: 760px) 100vw, 60vw' }))}
      <button type="button" class="volet__tete" aria-expanded="${i === 0 ? 'true' : 'false'}" aria-controls="volet-${e.cle}"><span class="volet__num">0${i + 1}</span><span class="volet__nom">${c.t(`receptions.${e.cle}T`)}</span></button>
      <div class="volet__texte" id="volet-${e.cle}"><p class="saison-tag saison-tag--nuit">${c.t(`receptions.${e.cle}S`)}</p><p>${c.t(`receptions.${e.cle}X`)}</p></div>
    </article>`)}
  </div>
</section>

<section class="occasions" id="occasions" aria-labelledby="occasions-titre">
  <div class="conteneur">
    <h2 id="occasions-titre" data-anime="lignes">${c.t('receptions.occasionsTitre')}</h2>
    <ul class="occasions__liste" data-effet="occasions">
      <li>${c.media({ nom: 'vraie/table-piscine', alt: c.s('receptions.altMariages'), classe: 'occasion__photo', sizes: '(max-width: 760px) 44vw, 22vw' })}<span>${c.t('receptions.mariages')}</span></li>
      <li>${c.media({ nom: 'vraie/gateaux', alt: c.s('receptions.altAnniversaires'), classe: 'occasion__photo', sizes: '(max-width: 760px) 44vw, 22vw' })}<span>${c.t('receptions.anniversaires')}</span></li>
      <li>${c.media({ nom: 'recevoir-depart', alt: c.s('receptions.altDepart'), classe: 'occasion__photo', sizes: '(max-width: 760px) 44vw, 22vw' })}<span>${c.t('receptions.depart')}</span></li>
      <li>${c.media({ nom: 'recevoir-baptemes', alt: c.s('receptions.altBaptemes'), classe: 'occasion__photo', sizes: '(max-width: 760px) 44vw, 22vw' })}<span>${c.t('receptions.baptemes')}</span></li>
    </ul>
  </div>
</section>

<section class="demande" aria-labelledby="demande-titre">
  <div class="conteneur demande__grille" id="demande">
    <div class="demande__tete">
      <p class="surtitre">${c.t('receptions.demandeSur')}</p>
      <h2 id="demande-titre" data-anime="lignes">${c.t('receptions.demandeTitre')}</h2>
      <p>${c.t('receptions.demandeTexte')}</p>
      <ol class="demande__etapes" aria-hidden="true"><li data-etape-num="1">${c.t('receptions.etape1')}</li><li data-etape-num="2">${c.t('receptions.etape2')}</li><li data-etape-num="3">${c.t('receptions.etape3')}</li></ol>
      <div class="invitation" data-invitation aria-hidden="true" data-effet="invitation" data-visuel>
        <p class="invitation__sur">${c.site.nom}</p>
        <p class="invitation__occasion est-vide" data-inv-occasion data-vide="${c.s('receptions.recap')}">${c.t('receptions.recap')}</p>
        <p class="invitation__detail est-vide" data-inv-detail data-vide="${c.s('receptions.recapDetail')}">${c.t('receptions.recapDetail')}</p>
        <p class="invitation__tampon">${c.t('receptions.recu')}</p>
      </div>
    </div>
    <form class="demande__form" data-demande action="#demande" novalidate data-occasion-manque="${c.s('receptions.occasionManque')}" data-date-ou-periode="${c.s('receptions.dateOuPeriode')}">
      <fieldset class="demande__etape" data-etape="1">
        <legend>${c.t('receptions.occasion')}</legend>
        <div class="demande__puces">
          ${['mariages', 'baptemes', 'anniversaires', 'depart'].map((o) => html`<label class="puce"><input type="radio" name="occasion" value="${c.s(`receptions.${o}`)}" data-un="${c.s(`receptions.${o}Un`)}"><span>${c.t(`receptions.${o}`)}</span></label>`)}
          <label class="puce"><input type="radio" name="occasion" value="${c.s('receptions.autre')}" data-un="${c.s('receptions.autreUn')}"><span>${c.t('receptions.autre')}</span></label>
        </div>
        <p class="demande__legende">${c.t('receptions.espace')}</p>
        <div class="demande__puces">
          ${['salle', 'terrasse', 'piscine'].map((o) => html`<label class="puce"><input type="radio" name="espace" value="${c.s(`receptions.${o}T`)}"><span>${c.t(`receptions.${o}T`)}</span></label>`)}
          <label class="puce"><input type="radio" name="espace" value="${c.s('receptions.indifferent')}" checked><span>${c.t('receptions.indifferent')}</span></label>
        </div>
        <p class="demande__nav"><button type="button" class="bouton" data-suivant>${c.t('receptions.suivant')}</button></p>
      </fieldset>
      <fieldset class="demande__etape" data-etape="2">
        <legend>${c.t('receptions.etape2')}</legend>
        <div class="demande__deux">
          <label><span>${c.t('receptions.date')}</span><input type="date" name="date" data-date-ou-periode></label>
          <label><span>${c.t('receptions.periode')}</span><select name="periode"><option value="">${c.t('receptions.periodeVide')}</option>${c.s('receptions.periodes').split('|').map((x) => html`<option>${x}</option>`)}</select></label>
          <label><span>${c.t('receptions.invites')}</span><input type="number" name="invites" min="2" max="400" inputmode="numeric" required></label>
        </div>
        <label><span>${c.t('receptions.message')}</span><textarea name="message" rows="3" placeholder="${c.s('receptions.messageIndice')}"></textarea></label>
        <p class="demande__nav"><button type="button" class="bouton bouton--contour" data-precedent>${c.t('receptions.precedent')}</button> <button type="button" class="bouton" data-suivant>${c.t('receptions.suivant')}</button></p>
      </fieldset>
      <fieldset class="demande__etape" data-etape="3">
        <legend>${c.t('receptions.etape3')}</legend>
        <div class="demande__deux">
          <label><span>${c.t('receptions.prenom')}</span><input type="text" name="prenom" autocomplete="given-name" required></label>
          <label><span>${c.t('receptions.nom')}</span><input type="text" name="nom" autocomplete="family-name" required></label>
          <label><span>${c.t('receptions.telephone')}</span><input type="tel" name="telephone" autocomplete="tel" required></label>
          <label><span>${c.t('receptions.email')}</span><input type="email" name="email" autocomplete="email"></label>
        </div>
        <p class="demande__rgpd">${c.t('receptions.rgpd')} ${c.t('commun.confidentialiteForm')}</p>
        <p class="demande__nav"><button type="button" class="bouton bouton--contour" data-precedent>${c.t('receptions.precedent')}</button> <button type="submit" class="bouton" data-grille="retour">${c.t('receptions.envoyer')}</button></p>
      </fieldset>
      <p class="demande__message" data-demande-message role="status" tabindex="-1" hidden>${c.t('receptions.merci')}</p>
    </form>
  </div>
</section>
`;
};
