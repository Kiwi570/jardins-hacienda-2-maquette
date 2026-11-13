/* Réceptions · « la grande table » (nouvelle page v6, vraies photos en v7, retours du client en v7.5) : en arrivant d'une autre
   page, le voile s'ouvre en lanières comme des palmes qui s'écartent (module rideau-en-lanieres) ; l'ouverture fait défiler les
   occasions (le mot du titre et la photo de l'arche) ; « Ce que l'on fête ici » par paliers au défilement ; « Cinq espaces, un
   seul domaine » en cartes qui défilent ; la demande en trois étapes sur fond clair (v7.5.8), dont le carton d'invitation se
   remplit et reçoit à l'envoi le tampon « Demande reçue » ; la terrasse qui s'allume ; « Ils ont dit oui aux Jardins ». */
import { existsSync } from 'node:fs';
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'receptions', fichier: 'receptions', theme: 'nuit', imagePartage: 'vraie/pergola-banquet-1280.webp', modules: ['rideau-en-lanieres'] };

/* v7.5 · « Ils ont dit oui aux Jardins » (idée de la maquette de référence du client, en plus ludique) : les vraies photos de
   mariages en polaroïds pincés sur un fil à linge ; la section reste à l'écran et le fil défile au défilement, les photos se
   balancent avec la vitesse ; une photo touchée s'ouvre en grand dans un album (flèches, clavier), avec des confettis. */
const OUI = [
  { cle: 'lanternes', image: 'vraie/mariage-lanternes', cadrage: '50% 45%', r: -4 },
  { cle: 'ceremonie', image: 'vraie/mariage-ceremonie', cadrage: '50% 60%', r: 3 },
  { cle: 'danse', image: 'vraie/mariage-danse', cadrage: '62% 40%', r: -2 },
  { cle: 'piece-montee', image: 'vraie/mariage-piece-montee', cadrage: '50% 50%', r: 4 },
  { cle: 'table-verte', image: 'vraie/mariage-table-verte', cadrage: '50% 40%', r: -3 },
  { cle: 'nid', image: 'vraie/mariage-nid', cadrage: '30% 50%', r: 2 },
  { cle: 'table-piscine', image: 'vraie/mariage-table-piscine', cadrage: '50% 60%', r: -4 },
  { cle: 'salle', image: 'vraie/mariage-salle', cadrage: '50% 55%', r: 3 },
  { cle: 'buffet', image: 'vraie/mariage-buffet', cadrage: '50% 50%', r: -2 },
  { cle: 'table-fleurie', image: 'vraie/mariage-table-fleurie', cadrage: '50% 55%', r: 4 },
];
/* v7.5.8 · « Demander une réception » sur fond clair : chaque occasion et chaque espace a sa vraie photo ; à gauche, le carton
   d'invitation se remplit et deux polaroïds montrent l'occasion et l'espace choisis. */
const DEMANDE_OCC = [
  { cle: 'mariages', image: 'vraie/table-piscine', cadrage: '50% 55%' },
  { cle: 'baptemes', image: 'recevoir-baptemes', cadrage: '55% 40%' },
  { cle: 'anniversaires', image: 'vraie/gateaux', cadrage: '50% 45%' },
  { cle: 'depart', image: 'recevoir-depart', cadrage: '55% 35%' },
  { cle: 'autre', image: 'vraie/piscine-paillotes', cadrage: '40% 62%' },
];
const DEMANDE_ESP = [
  { cle: 'salle', image: 'vraie/salle-pierre', cadrage: '60% 55%' },
  { cle: 'terrasse', image: 'vraie/brasero', cadrage: '45% 62%' },
  { cle: 'piscine', image: 'vraie/piscine-palmiers', cadrage: '55% 62%' },
];
const vignette = (nom, cadrage) => {
  const w = [480, 640].find((x) => existsSync(new URL(`../../assets/images/${nom}-${x}.webp`, import.meta.url)));
  if (!w) throw new Error(`Vignette introuvable : ${nom}`);
  return brut(`<img src="/assets/images/${nom}-${w}.webp" alt="" width="160" height="160" loading="lazy" decoding="async" style="--cadrage:${cadrage}">`);
};
const polaroid = (c, type, cle, defaut, liste, legende) => html`<div class="dm-pola dm-pola--${type}" data-apercu="${type}" data-cle="${cle}">
  <span class="dm-pola__scotch"></span>
  <div class="dm-pola__photos">
    ${[defaut, ...liste].map((p, i) => c.media({ nom: p.image, cadrage: p.cadrage, classe: `dm-pola__photo${i === 0 ? ' est-active' : ''}`, sizes: '(max-width: 760px) 44vw, 240px', attrs: `data-apercu-photo="${p.cle}"` }))}
  </div>
  <p class="dm-pola__legende" data-apercu-legende>${legende}</p>
</div>`;
const OCCASIONS = ['mariages', 'baptemes', 'anniversaires', 'depart'];
/* v7.5 · « Cinq espaces, un seul domaine » (section de la maquette de référence du client, le coin bar à la place du salon) :
   cartes qui défilent à l'horizontale (flèches, glisser, molette), fiche capacité, saison, ambiance. Capacités : fiche Bridebook
   de l'établissement (salle de réception 220, cocktail 140, restaurant 100, terrasse plus de 300 m²). */
const DOMAINE = [
  { cle: 'bar', image: 'vraie/bar-paillote', cadrage: '50% 55%', ete: true },
  { cle: 'reception', image: 'vraie/pergola-banquet', cadrage: '50% 50%' },
  { cle: 'restaurant', image: 'vraie/salle-soleil', cadrage: '50% 55%' },
  { cle: 'terrasse', image: 'vraie/brasero', cadrage: '45% 62%', ete: true },
  { cle: 'piscine', image: 'vraie/piscine-palmiers', cadrage: '55% 62%', ete: true },
];
/* v7.5 · « Ce que l'on fête ici » reprend le défilement de la « journée à l'Hacienda » de la maquette de référence du client :
   la section reste à l'écran, chaque palier de défilement amène une occasion (le nom en grand qui se resserre, la photo qui s'ouvre,
   le fond qui change de teinte), un anneau se remplit, les noms en bas à droite mènent à chaque occasion. */
const FETES = [
  { cle: 'mariages', image: 'vraie/table-piscine', alt: 'receptions.altMariages', cadrage: '50% 55%', fond: '#f4ede1' },
  { cle: 'anniversaires', image: 'vraie/gateaux', alt: 'receptions.altAnniversaires', cadrage: '50% 45%', fond: '#efdfc6' },
  { cle: 'depart', image: 'recevoir-depart', alt: 'receptions.altDepart', cadrage: '55% 40%', fond: '#dde4d1' },
  { cle: 'baptemes', image: 'recevoir-baptemes', alt: 'receptions.altBaptemes', cadrage: '55% 45%', fond: '#f1e0d6' },
];
/* v7.5 · L'ouverture fait défiler les occasions de « Ce que l'on fête ici » : le mot du titre et la photo de l'arche changent ensemble
   (mêmes photos que la section, dans le même ordre). */
const DIAPOS = [
  { cle: 'mariages', image: 'vraie/table-piscine', alt: 'receptions.altMariages', cadrage: '50% 55%' },
  { cle: 'anniversaires', image: 'vraie/gateaux', alt: 'receptions.altAnniversaires', cadrage: '50% 45%' },
  { cle: 'depart', image: 'recevoir-depart', alt: 'receptions.altDepart', cadrage: '55% 40%' },
  { cle: 'baptemes', image: 'recevoir-baptemes', alt: 'receptions.altBaptemes', cadrage: '55% 45%' },
];

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
  <div class="conteneur ouv-recep__grille">
    <div class="ouv-recep__contenu">
      <p class="surtitre">${c.t('receptions.sur')}</p>
      <h1 class="ouv-recep__titre" data-iris-centre>${c.t('receptions.titreAvant')} <span class="mot-tournant" data-grille="typo" data-effet="mot" data-mots="${mots.join('|')}"><span class="mot-tournant__mot">${mots[0]}</span></span></h1>
      <p class="ouv-recep__texte">${c.t('receptions.texte')}</p>
      <p class="ouv-recep__actions"><a class="bouton" href="#demande" data-action-principale data-sans-transition>${c.t('receptions.action')}</a> <a class="bouton bouton--contour bouton--clair" href="#espaces" data-sans-transition>${c.t('receptions.espacesLien')}</a></p>
      <p class="ouv-recep__info" data-info-cle><a href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a></p>
    </div>
    <div class="ouv-recep__visuel">
      <div class="ouv-recep__arche" data-recep-diapos data-fx="parallaxe" data-fx-force="5">
        ${DIAPOS.map((d, i) => c.media({ nom: d.image, alt: c.s(d.alt), cadrage: d.cadrage, priorite: i === 0, classe: `ouv-recep__diapo${i === 0 ? ' est-active' : ''}`, sizes: '(max-width: 760px) 80vw, 40vw', attrs: `data-diapo="${i}"` }))}
      </div>
      ${c.media({ nom: 'vraie/pergola-banquet', alt: c.s('receptions.altPergola'), cadrage: '50% 50%', classe: 'ouv-recep__rond', sizes: '(max-width: 760px) 34vw, 16vw' })}
      <div class="ouv-recep__fil" role="group" aria-label="${c.s('receptions.diapoGroupe')}">
        ${DIAPOS.map((d, i) => html`<button type="button" class="ouv-recep__puce${i === 0 ? ' est-active' : ''}" data-diapo-aller="${i}" aria-pressed="${i === 0 ? 'true' : 'false'}" aria-label="${c.s('receptions.' + d.cle)}"><span></span></button>`)}
        <button type="button" class="ouv-recep__pause" data-diapo-pause aria-pressed="false" aria-label="${c.s('receptions.diapoPause')}" data-pause="${c.s('receptions.diapoPause')}" data-reprendre="${c.s('receptions.diapoReprendre')}"><span class="heros__pause-icone" aria-hidden="true"></span></button>
      </div>
      <div class="sceau" aria-hidden="true">
        <svg class="sceau__texte" viewBox="0 0 200 200"><defs><path id="sceau-cercle" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0"/></defs><text><textPath href="#sceau-cercle" textLength="470">${c.s('receptions.sceau')}</textPath></text></svg>
        <span class="sceau__logo"></span>
      </div>
    </div>
  </div>
</section>

<section class="fetes-defile" id="occasions" data-fetes-defile aria-labelledby="occasions-titre">
  <div class="fetes-defile__collant">
    <div class="fetes-defile__tete conteneur">
      <h2 id="occasions-titre" class="fetes-defile__titre">${c.t('receptions.occasionsTitre')}</h2>
      <svg class="fetes-defile__anneau" viewBox="0 0 100 100" aria-hidden="true"><circle class="fetes-defile__anneau-fond" cx="50" cy="50" r="42"/><circle class="fetes-defile__anneau-trace" cx="50" cy="50" r="42" pathLength="1"/>${brut([0, 1, 2, 3].map((k) => `<circle class="fetes-defile__anneau-cran" cx="${50 + 42 * Math.sin(k * Math.PI / 2)}" cy="${50 - 42 * Math.cos(k * Math.PI / 2)}" r="5"/>`).join(''))}</svg>
    </div>
    <ol class="fetes-defile__liste" data-effet="fetes">
      ${FETES.map((f, i) => html`<li class="occ${i === 0 ? ' est-active' : ''}" data-occ="${f.cle}" style="--fete-fond:${f.fond}">
        <div class="occ__cadre conteneur">
          <h3 class="occ__mot">${c.t(`receptions.${f.cle}`)}</h3>
          ${c.media({ nom: f.image, alt: c.s(f.alt), cadrage: f.cadrage, classe: 'occ__image', sizes: '(max-width: 860px) 70vw, 50vw' })}
          <div class="occ__texte">
            <p class="occ__accroche">${c.t(`receptions.fetes.${f.cle}.accroche`)}</p>
            <p class="occ__desc">${c.t(`receptions.fetes.${f.cle}.texte`)}</p>
            <p class="occ__info">${c.t(`receptions.fetes.${f.cle}.info`)}</p>
            <a class="lien-fleche occ__lien" href="#demande" data-sans-transition data-occasion-choisir="${c.s(`receptions.${f.cle}`)}">${c.t(`receptions.fetes.${f.cle}.lien`)}</a>
          </div>
        </div>
      </li>`)}
    </ol>
    <nav class="fetes-defile__points" aria-label="${c.s('receptions.fetesNav')}"><ol>${FETES.map((f, i) => html`<li><button type="button" data-fete-aller="${i}" aria-current="${i === 0 ? 'true' : 'false'}">${c.t(`receptions.${f.cle}`)}</button></li>`)}</ol></nav>
  </div>
</section>

<section class="domaine" id="espaces" aria-labelledby="espaces-titre">
  <div class="conteneur domaine__tete">
    <div>
      <p class="surtitre">${c.t('receptions.espacesSur')}</p>
      <h2 id="espaces-titre" data-anime="lignes">${c.t('receptions.domaineTitre')}</h2>
    </div>
    <div class="domaine__commandes"><button type="button" class="domaine__fleche" data-domaine-prec aria-label="${c.s('receptions.domainePrec')}"><span aria-hidden="true">‹</span></button><button type="button" class="domaine__fleche" data-domaine-suiv aria-label="${c.s('receptions.domaineSuiv')}"><span aria-hidden="true">›</span></button></div>
  </div>
  <ul class="domaine__liste" data-galerie data-domaine data-effet="domaine" tabindex="0" aria-label="${c.s('receptions.domaineListe')}">
    ${DOMAINE.map((d, i) => html`<li class="domaine__carte" id="espace-${d.cle}" style="--i:${i}">
      <div class="domaine__photo-cadre">
        ${c.media({ nom: d.image, alt: c.s(`receptions.domaine.${d.cle}.alt`), cadrage: d.cadrage, classe: 'domaine__photo', sizes: '(max-width: 760px) 84vw, 36vw' })}
        ${d.ete ? html`<p class="domaine__badge" data-saison-seul="hiver">${c.t('receptions.fermeHiver')}</p>` : ''}
      </div>
      <h3 class="domaine__nom">${c.t(`receptions.domaine.${d.cle}.nom`)}</h3>
      <dl class="domaine__fiche">
        <div><dt>${c.t('receptions.capacite')}</dt><dd>${c.t(`receptions.domaine.${d.cle}.capacite`)}</dd></div>
        <div><dt>${c.t('receptions.saison')}</dt><dd>${c.t(`receptions.domaine.${d.cle}.saison`)}</dd></div>
        <div><dt>${c.t('receptions.ambiance')}</dt><dd>${c.t(`receptions.domaine.${d.cle}.ambiance`)}</dd></div>
      </dl>
    </li>`)}
  </ul>
  <div class="conteneur domaine__pied">
    <div class="domaine__fil" aria-hidden="true"><span data-domaine-fil></span></div>
    <p class="domaine__info">${c.t('receptions.domaineInfo')}</p>
  </div>
</section>

<section class="demande" aria-labelledby="demande-titre">
  <div class="conteneur" id="demande">
    <div class="demande__tete">
      <div>
        <p class="surtitre">${c.t('receptions.demandeSur')}</p>
        <h2 id="demande-titre" data-anime="lignes">${c.t('receptions.demandeTitre')}</h2>
      </div>
      <div class="demande__intro">
        <p>${c.t('receptions.demandeTexte')}</p>
        <p class="demande__appel">${c.t('receptions.demandeAppel')} <a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a></p>
      </div>
    </div>
    <div class="demande__grille">
      <div class="demande__apercu">
        <div class="demande__scene" aria-hidden="true" data-visuel data-superpose>
          ${polaroid(c, 'occasion', '', { cle: 'defaut', image: 'vraie/pergola-banquet', cadrage: '50% 50%' }, DEMANDE_OCC, c.s('receptions.apercuOccasion'))}
          ${polaroid(c, 'espace', 'indifferent', { cle: 'indifferent', image: 'vraie/enseigne', cadrage: '49% 40%' }, DEMANDE_ESP, c.s('receptions.indifferent'))}
          <div class="invitation" data-invitation data-effet="invitation">
            <span class="invitation__logo"></span>
            <p class="invitation__sur">${c.site.nom}</p>
            <p class="invitation__occasion est-vide" data-inv-occasion data-vide="${c.s('receptions.recap')}">${c.t('receptions.recap')}</p>
            <p class="invitation__orne"><span>✦</span></p>
            <p class="invitation__detail est-vide" data-inv-detail data-vide="${c.s('receptions.recapDetail')}">${c.t('receptions.recapDetail')}</p>
            <p class="invitation__lieu">${c.t('receptions.apercuLieu')}</p>
            <p class="invitation__tampon">${c.t('receptions.recu')}</p>
          </div>
        </div>
        <p class="demande__apercu-note">${c.t('receptions.apercuNote')}</p>
      </div>
      <div class="demande__carte">
        <ol class="demande__etapes" aria-hidden="true">${[1, 2, 3].map((n) => html`<li data-etape-num="${n}"><span class="demande__num">${n}</span><span class="demande__etape-nom">${c.t(`receptions.etape${n}`)}</span></li>`)}</ol>
        <form class="demande__form" data-demande action="#demande" novalidate data-occasion-manque="${c.s('receptions.occasionManque')}" data-date-ou-periode="${c.s('receptions.dateOuPeriode')}">
          <fieldset class="demande__etape" data-etape="1">
            <legend>${c.t('receptions.occasion')}</legend>
            <div class="demande__puces demande__puces--tuiles">
              ${DEMANDE_OCC.map((o) => html`<label class="tuile"><input type="radio" name="occasion" value="${c.s(`receptions.${o.cle}`)}" data-un="${c.s(`receptions.${o.cle}Un`)}" data-cle="${o.cle}"><span class="tuile__photo">${vignette(o.image, o.cadrage)}</span><span class="tuile__nom">${c.t(`receptions.${o.cle}`)}</span></label>`)}
            </div>
            <p class="demande__legende">${c.t('receptions.espace')}</p>
            <div class="demande__puces demande__puces--espaces">
              ${DEMANDE_ESP.map((o) => html`<label class="puce puce--photo"><input type="radio" name="espace" value="${c.s(`receptions.${o.cle}T`)}" data-cle="${o.cle}"><span>${vignette(o.image, o.cadrage)}${c.t(`receptions.${o.cle}T`)}</span></label>`)}
              <label class="puce puce--photo"><input type="radio" name="espace" value="${c.s('receptions.indifferent')}" data-cle="indifferent" checked><span><svg class="puce__icone" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="16.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/><circle cx="11.5" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><circle cx="24.5" cy="18" r="2"/></svg>${c.t('receptions.indifferent')}</span></label>
            </div>
            <p class="demande__nav"><button type="button" class="bouton" data-suivant>${c.t('receptions.suivant')} <span aria-hidden="true">→</span></button></p>
          </fieldset>
          <fieldset class="demande__etape" data-etape="2">
            <legend>${c.t('receptions.etape2')}</legend>
            <div class="demande__deux">
              <label><span>${c.t('receptions.date')}</span><input type="date" name="date" data-date-ou-periode></label>
              <label><span>${c.t('receptions.periode')}</span><select name="periode"><option value="">${c.t('receptions.periodeVide')}</option>${c.s('receptions.periodes').split('|').map((x) => html`<option>${x}</option>`)}</select></label>
            </div>
            <div class="demande__invites">
              <label><span>${c.t('receptions.invites')}</span><input type="number" name="invites" min="2" max="400" inputmode="numeric" required></label>
              <div class="demande__vite" role="group" aria-label="${c.s('receptions.invitesVite')}">${[20, 50, 100, 150].map((n) => html`<button type="button" data-invites-vite="${n}" aria-pressed="false" aria-label="${c.s('receptions.invitesEnviron', { n })}">${n}</button>`)}</div>
              <p class="demande__indice">${c.t('receptions.invitesIndice')}</p>
            </div>
            <label><span>${c.t('receptions.message')}</span><textarea name="message" rows="3" placeholder="${c.s('receptions.messageIndice')}"></textarea></label>
            <p class="demande__nav"><button type="button" class="bouton bouton--contour" data-precedent><span aria-hidden="true">←</span> ${c.t('receptions.precedent')}</button> <button type="button" class="bouton" data-suivant>${c.t('receptions.suivant')} <span aria-hidden="true">→</span></button></p>
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
            <p class="demande__nav"><button type="button" class="bouton bouton--contour" data-precedent><span aria-hidden="true">←</span> ${c.t('receptions.precedent')}</button> <button type="submit" class="bouton" data-grille="retour">${c.t('receptions.envoyer')}</button></p>
          </fieldset>
          <p class="demande__message" data-demande-message role="status" tabindex="-1" hidden>${c.t('receptions.merci')}</p>
        </form>
      </div>
    </div>
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

<section class="oui" id="ils-ont-dit-oui" data-oui aria-labelledby="oui-titre">
  <div class="oui__collant">
    <svg class="oui__guirlande" viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden="true"><path d="M0 10 Q300 80 600 30 T1200 20" pathLength="1"/>${brut(Array.from({ length: 13 }, (_, i) => { const x = 40 + i * 92; const y = 10 + Math.sin((i / 12) * Math.PI * 2.2) * 22 + 22; return `<circle class="oui__ampoule" cx="${x}" cy="${y.toFixed(1)}" r="6" style="--i:${i}"/>`; }).join(''))}</svg>
    <div class="conteneur oui__tete">
      <p class="surtitre">${c.t('receptions.oui.sur')}</p>
      <h2 id="oui-titre" class="oui__titre">${c.t('receptions.oui.titreAvant')} <em class="oui__oui">${c.t('receptions.oui.mot')}<svg viewBox="0 0 120 70" aria-hidden="true"><path d="M60 64 C10 40 2 18 22 8 C38 0 54 10 60 22 C66 10 82 0 98 8 C118 18 110 40 60 64 Z" pathLength="1"/></svg></em> ${c.t('receptions.oui.titreApres')}</h2>
      <p class="oui__consigne">${c.t('receptions.oui.consigne')}</p>
    </div>
    <div class="oui__fil" data-galerie>
      <svg class="oui__corde" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true"><path d="M-10 6 Q500 70 1010 6"/></svg>
      <ul class="oui__piste" data-oui-piste data-effet="oui" aria-label="${c.s('receptions.oui.liste')}">
        ${OUI.map((o, i) => html`<li class="oui__photo" style="--r:${o.r}deg;--i:${i}">
          <button type="button" class="oui__polaroid" data-oui-ouvrir="${i}" aria-label="${c.s('receptions.oui.ouvrir', { legende: c.s(`receptions.oui.photos.${o.cle}.legende`) })}">
            <span class="oui__pince" aria-hidden="true"></span>
            ${c.media({ nom: o.image, alt: c.s(`receptions.oui.photos.${o.cle}.alt`), cadrage: o.cadrage, classe: 'oui__image', sizes: '(max-width: 760px) 62vw, 22vw' })}
            <span class="oui__legende">${c.t(`receptions.oui.photos.${o.cle}.legende`)}</span>
          </button>
        </li>`)}
      </ul>
    </div>
    <div class="conteneur oui__pied" aria-hidden="true"><div class="oui__progres"><span data-oui-progres></span></div></div>
  </div>
  <dialog class="oui__album" data-oui-album aria-label="${c.s('receptions.oui.album')}">
    <div class="oui__album-cadre">
      <figure class="oui__album-photo"><img data-oui-img src="/assets/images/${OUI[0].image}-960.webp" alt="${c.s(`receptions.oui.photos.${OUI[0].cle}.alt`)}" width="960" height="640" loading="lazy" decoding="async"><figcaption><span data-oui-legende></span> <small data-oui-compte></small></figcaption></figure>
      <button type="button" class="oui__album-btn oui__album-btn--prec" data-oui-prec aria-label="${c.s('receptions.oui.prec')}"><span aria-hidden="true">‹</span></button>
      <button type="button" class="oui__album-btn oui__album-btn--suiv" data-oui-suiv aria-label="${c.s('receptions.oui.suiv')}"><span aria-hidden="true">›</span></button>
      <button type="button" class="oui__album-fermer" data-oui-fermer aria-label="${c.s('receptions.oui.fermer')}"><span aria-hidden="true">×</span></button>
      <div class="oui__album-confettis" aria-hidden="true" data-superpose>${brut(Array.from({ length: 22 }, (_, i) => `<span style="--x:${(i * 41) % 100}%;--d:${((i * 7) % 10) / 20}s;--c:${['#b8322c', '#e9cf8e', '#7f9a74', '#f2b8a0'][i % 4]};--r:${(i * 67) % 360}deg"></span>`).join(''))}</div>
    </div>
  </dialog>
  <script type="application/json" data-oui-donnees>${brut(JSON.stringify(OUI.map((o) => ({ src: `/assets/images/${o.image}-960.webp`, alt: c.s(`receptions.oui.photos.${o.cle}.alt`), legende: c.s(`receptions.oui.photos.${o.cle}.legende`) }))).replace(/</g, '\\u003c'))}</script>
  <script type="application/json" data-oui-textes>${brut(JSON.stringify({ compte: c.s('receptions.oui.compte') }))}</script>
</section>

`;
};
