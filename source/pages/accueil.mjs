/* Accueil v6 « De midi à minuit » : une journée à l'Hacienda, réglée sur les vraies heures de la maison.
   12 h la piscine (l'eau bouge sous le doigt), 12 h 30 le déjeuner (la salle au soleil), 14 h 30 l'après-midi d'été
   (un panorama de la piscine que l'on parcourt jusqu'à 19 h), 19 h la terrasse s'allume (scène), 21 h le dîner (la vraie
   assiette, sa vapeur qu'on écarte : module plat-fumant ; réserver dans la page), 23 h au coin du feu (plein écran, braises),
   minuit offrir (venir est au pied de page). La lumière de la page passe du blanc de midi à la braise ; l'horloge de l'en-tête suit. */
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'accueil', fichier: 'index', theme: 'jour', imagePartage: 'grok/midi-piscine-1280.webp', modules: ['plat-fumant'] };

/* Carte de la semaine : les plats réels mis en avant au déjeuner (noms et prix du relevé). */
const PASSE = ['Risotto de Saint-Jacques au riz noir', 'Foie gras de canard maison', 'Suprême de pintade', 'Dhal aux trois lentilles', "L'os à moelle"];

/* Les guirlandes de la terrasse : un halo posé sur chaque vraie ampoule de l'image (positions relevées sur
   terrasse-nuit, en pixels de la source 1792 × 1008). Même cadre que l'image : viewBox de la source sur ordinateur,
   celui du recadrage téléphone (data-vue-telephone) quand la version téléphone de l'image s'affiche. */
const guirlandes = (a) => {
  const [W, H] = a.source, m = a.mobile.join(' ');
  const bulbes = a.ampoules.map(([x, y], i) => `<g class="ampoule" style="--i:${i}"><circle class="halo" cx="${x}" cy="${y}" r="30"/><circle class="coeur" cx="${x}" cy="${y}" r="5.5"/><circle class="cible" cx="${x}" cy="${y}" r="18"/></g>`).join('');
  return `<svg class="guirlandes" data-effet="guirlandes" viewBox="0 0 ${W} ${H}" data-vue="0 0 ${W} ${H}" data-vue-telephone="${m}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" data-audit-ignorer><defs><radialGradient id="halo-ampoule"><stop offset="0" stop-color="#fff0c2" stop-opacity=".95"/><stop offset=".28" stop-color="#ffc766" stop-opacity=".5"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient></defs>${bulbes}</svg>`;
};
/* L'après-midi : les lieux sur la photo de la piscine (positions en % de l'image), et le moment du parcours où chacun s'allume. */
/* 12 h 30 : l'assiette devant la cheminée, puis trois vraies assiettes du chef ; chacune remplace la grande et fume à son tour
   (sources de vapeur en fractions de l'image : x, y, largeur). */
const ASSIETTES = [
  { nom: 'vraie/plat-cheminee', vapeur: '.46 .7 .42', cadrage: '50% 70%', alt: 'assiette1' },
  { nom: 'assiette-cepes', vapeur: '.5 .52 .52', cadrage: '50% 50%', alt: 'assiette2' },
  { nom: 'assiette-turquoise', vapeur: '.56 .52 .34', cadrage: '50% 50%', alt: 'assiette3' },
  { nom: 'assiette-saumon', vapeur: '.47 .45 .4', cadrage: '50% 50%', alt: 'assiette4' },
];
const LIEUX = [
  { id: 'journees-festives', cle: 'festives', x: 22, y: 34, p: 0.12 },
  { id: 'bar', cle: 'bar', x: 47, y: 30, p: 0.38 },
  { id: 'piscine', cle: 'piscine', x: 70, y: 70, p: 0.62 },
  { id: 'pool-parties', cle: 'pool', x: 90, y: 50, p: 0.86 },
];
const heure = (texte, classe = '') => html`<p class="heure-section ${classe}" data-effet="heure-section"><span>${texte}</span></p>`;

export default (c) => {
  const plats = c.donnees.carte.rubriques.flatMap((r) => r.plats);
  const passe = PASSE.map((n) => plats.find((p) => p.nom.startsWith(n))).filter(Boolean);
  const horaires = JSON.stringify(c.donnees.horaires).replace(/<\//g, '<\\/');
  const resa = JSON.stringify(c.donnees.reservation).replace(/<\//g, '<\\/');
  const f = c.donnees.fetes;
  return html`
<script type="application/json" data-horaires-accueil>${brut(horaires)}</script>
<script type="application/json" data-reservation-accueil>${brut(resa)}</script>

<section class="midi ecran" id="midi" data-heure="12:00" data-lumiere="midi" data-plein-ecran>
  <div class="midi__eau" data-saison-seul="ete" data-grille="manipuler" data-effet="eau" data-souris>
    ${c.media({ nom: 'grok/midi-piscine', alt: c.s('accueil.midi.alt'), cadrage: '50% 50%', cadrageMobile: '50% 60%', classe: 'midi__photo', sizes: '100vw' })}
    <canvas class="midi__canvas" data-eau aria-hidden="true" data-audit-ignorer></canvas>
  </div>
  <div class="midi__eau midi__hiver" data-saison-seul="hiver" data-grille="manipuler" data-effet="soleil" data-souris>
    ${c.media({ nom: 'vraie/salle-midi', alt: c.s('accueil.midi.altHiver'), cadrage: '50% 55%', classe: 'midi__photo', sizes: '100vw' })}
    <span class="midi__rayons" aria-hidden="true"></span>
    <span class="midi__soleil" aria-hidden="true"></span>
  </div>
  <div class="midi__texte conteneur">
    <p class="heure-geante" data-iris-centre data-grille="typo" data-effet="axes" aria-hidden="true"><span class="hg__h">12</span><span class="hg__sep">:</span><span class="hg__m">00</span></p>
    <p class="surtitre midi__surtitre"><strong class="midi__nom">${c.site.nom}</strong> · ${c.t('accueil.midi.surtitreCourt')}<span class="midi__lieu-long">${c.t('accueil.midi.surtitreLong')}</span></p>
    <h1 class="midi__titre" data-anime="lignes"><span data-texte-ete="${c.s('accueil.midi.titre1')}">${c.t('accueil.midi.titre1Hiver')}</span> <em>${c.t('accueil.midi.titre2')}</em></h1>
    <p class="statut midi__statut" data-anime="gsap"><span class="statut__point" aria-hidden="true"></span><span data-statut-accueil data-statut-heure="${c.s('accueil.midi.ilEst')}" data-info-cle>${c.t('accueil.midi.statutSansJs')}</span></p>
    <p class="midi__intro masque-ecran-bas" data-anime="gsap">${c.t('accueil.midi.texte')}</p>
    <p class="midi__actions" data-anime="gsap">
      ${c.lien('reserver', { ancre: 'formulaire', classe: 'bouton', texte: c.t('accueil.midi.reserver'), attrs: 'data-action-principale data-survol="magnetique"' })}
      ${c.lien('receptions', { ancre: 'demande', classe: 'bouton bouton--contour', texte: c.t('accueil.midi.reception'), attrs: 'data-survol="magnetique"' })}
    </p>
  </div>
  <p class="saison-tag midi__saison" data-texte-ete="${c.s('accueil.midi.saison')}">${c.t('accueil.midi.saisonHiver')}</p>
  <p class="indice midi__indice" aria-hidden="true"><span class="indice--souris" data-texte-ete="${c.s('accueil.midi.indice')}">${c.t('accueil.midi.indiceHiver')}</span><span class="indice--doigt" data-texte-ete="${c.s('accueil.midi.indiceTactile')}">${c.t('accueil.midi.indiceTactileHiver')}</span></p>
  <script>(function(){var ete=document.documentElement.getAttribute('data-saison')==='ete';var im=document.querySelector(ete?'#midi .midi__eau:not(.midi__hiver) img':'#midi .midi__hiver img');if(im){im.loading='eager';im.setAttribute('fetchpriority','high');}if(!ete)return;var l=document.querySelectorAll('#midi [data-texte-ete]');for(var i=0;i<l.length;i++)l[i].textContent=l[i].getAttribute('data-texte-ete');})();</script>
</section>

<section class="dejeuner" id="dejeuner" data-heure="12:30" data-lumiere="dejeuner" aria-labelledby="dejeuner-titre">
  <div class="conteneur dejeuner__grille">
    <div class="dejeuner__texte">
      ${heure(c.s('accueil.dejeuner.heure'))}
      <p class="surtitre">${c.t('accueil.dejeuner.surtitre')}</p>
      <h2 id="dejeuner-titre" data-anime="lignes">${c.t('accueil.dejeuner.titre')}</h2>
      <p data-anime>${c.t('accueil.dejeuner.texte')}</p>
      <ol class="passe" data-effet="passe">
        ${passe.map((p, i) => html`<li class="passe__plat" style="--i:${i}"><span class="passe__nom">${p.nom}</span><span class="passe__points" aria-hidden="true"></span><span class="passe__prix" data-prix>${p.prix} €</span></li>`)}
      </ol>
      <p class="dejeuner__info" data-info>${c.t('accueil.dejeuner.info')}</p>
      <p class="dejeuner__actions">${c.lien('la-carte', { classe: 'bouton bouton--contour', texte: c.t('accueil.dejeuner.lien') })} <span class="saison-tag saison-tag--clair">${c.t('accueil.dejeuner.saison')}</span></p>
    </div>
    <div class="dejeuner__visuel">
      ${c.media({ nom: 'vraie/plat-cheminee', alt: c.s('accueil.diner.alt'), cadrage: '50% 70%', classe: 'dejeuner__assiette fumant', sizes: '(max-width: 760px) 92vw, 42vw', attrs: 'data-module="plat-fumant" data-vapeur=".46 .7 .42" data-plat-scene' })}
      <p class="indice dejeuner__indice" aria-hidden="true"><span class="indice--souris">${c.t('accueil.diner.indice')}</span><span class="indice--doigt">${c.t('accueil.diner.indiceTactile')}</span></p>
      <div class="dejeuner__vraies" data-effet="vraies" aria-label="${c.s('accueil.dejeuner.photos')}" role="group">
        ${ASSIETTES.map((a, i) => html`<button type="button" class="vraie vraie--${i + 1}" data-plat="${a.nom}" data-vapeur="${a.vapeur}" data-cadrage="${a.cadrage}" data-alt="${c.s(`accueil.dejeuner.${a.alt}`)}" aria-pressed="${i === 0 ? 'true' : 'false'}" aria-label="${c.s(`accueil.dejeuner.${a.alt}`)}">${c.media({ nom: a.nom, alt: '', cadrage: a.cadrage, classe: 'vraie__photo', sizes: '160px' })}</button>`)}
      </div>
    </div>
  </div>
</section>

<section class="apresmidi panorama" id="apres-midi" data-heure="14:30" data-lumiere="apresmidi" data-effet="panorama" data-saison-seul="ete" data-sans-visuel aria-labelledby="apresmidi-titre">
  <div class="panorama__cadre">
    <div class="panorama__piste" data-panorama-piste>
      ${c.media({ nom: 'vraie/piscine-pergola', alt: c.s('accueil.apresmidi.altPanorama'), cadrage: '50% 50%', classe: 'panorama__photo', sizes: '(max-width: 760px) 300vw, 160vw' })}
      <div class="panorama__soleil" aria-hidden="true"></div>
      <ol class="panorama__lieux" aria-label="${c.s('accueil.apresmidi.region')}">
        ${LIEUX.map((l) => html`<li class="lieu" id="${l.id}" style="--x:${l.x}%;--y:${l.y}%" data-lieu="${l.p}"><span class="lieu__point" aria-hidden="true"></span><div class="lieu__texte"><p class="lieu__heure">${c.t(`accueil.apresmidi.${l.cle}H`)}</p><h3>${c.t(`accueil.apresmidi.${l.cle}T`)}</h3><p>${c.t(`accueil.apresmidi.${l.cle}X`)}</p></div></li>`)}
      </ol>
    </div>
    <div class="panorama__tete">
      <p class="heure-section" data-effet="heure-section" data-panorama-heure><span>${c.s('accueil.apresmidi.heure')}</span></p>
      <div>
        <p class="surtitre">${c.t('accueil.apresmidi.surtitre')}</p>
        <h2 id="apresmidi-titre" data-anime="lignes">${c.t('accueil.apresmidi.titre')}</h2>
        <p class="panorama__texte"><span class="masque-ecran-bas">${c.t('accueil.apresmidi.texte')}</span> ${c.lien('les-fetes', { ancre: 'ete', params: 'saison=ete', classe: 'lien-fleche', texte: c.t('accueil.apresmidi.lien') })}</p>
      </div>
    </div>
    <div class="panorama__legende" aria-live="polite"></div>
    <p class="indice panorama__indice" aria-hidden="true">${c.t('accueil.apresmidi.indice')}</p>
  </div>
</section>

<section class="terrasse" id="terrasse" data-heure="19:00" data-lumiere="terrasse" data-scene data-entete-cache data-grille="scene" aria-labelledby="terrasse-titre">
  <div class="terrasse__cadre" data-collant>
    <div class="terrasse__images" data-effet="terrasse">
      ${c.media({ nom: 'grok/terrasse-or', alt: c.s('accueil.terrasse.alt1'), cadrage: '50% 50%', classe: 'terrasse__img terrasse__img--1', sizes: '100vw' })}
      ${c.media({ nom: 'grok/terrasse-bleue', alt: c.s('accueil.terrasse.alt2'), cadrage: '50% 50%', classe: 'terrasse__img terrasse__img--2', sizes: '100vw' })}
      ${c.media({ nom: 'grok/terrasse-nuit', alt: c.s('accueil.terrasse.alt3'), cadrage: '50% 50%', classe: 'terrasse__img terrasse__img--3', sizes: '100vw' })}
      ${brut(guirlandes(c.donnees.ampoules))}
    </div>
    <div class="terrasse__texte conteneur">
      ${heure(c.s('accueil.terrasse.heure'), 'heure-section--nuit')}
      <p class="surtitre" data-texte-hiver="${c.s('accueil.terrasse.surtitreHiver')}">${c.t('accueil.terrasse.surtitre')}</p>
      <h2 id="terrasse-titre">${c.t('accueil.terrasse.titre')}</h2>
      <ol class="terrasse__etapes">
        <li data-etape="1"><b>${c.t('accueil.terrasse.e1H')}</b> ${c.t('accueil.terrasse.e1')}</li>
        <li data-etape="2"><b>${c.t('accueil.terrasse.e2H')}</b> ${c.t('accueil.terrasse.e2')}</li>
        <li data-etape="3"><b>${c.t('accueil.terrasse.e3H')}</b> ${c.t('accueil.terrasse.e3')}</li>
      </ol>
      <p class="terrasse__fin">
        ${c.lien('receptions', { ancre: 'demande', classe: 'bouton', texte: c.t('accueil.terrasse.action') })}
        ${c.lien('receptions', { ancre: 'espaces', classe: 'bouton bouton--contour bouton--clair', texte: c.t('accueil.terrasse.espaces') })}
      </p>
      <p class="saison-tag saison-tag--nuit">${c.t('accueil.terrasse.saison')}</p>
    </div>
    <p class="indice terrasse__indice" aria-hidden="true">${c.t('accueil.terrasse.indice')}</p>
  </div>
</section>

<section class="diner" id="diner" data-heure="21:00" data-lumiere="diner" aria-labelledby="diner-titre">
  <div class="conteneur diner__grille">
    <div class="diner__visuel">
      ${c.media({ nom: 'vraie/salle-soir', alt: c.s('accueil.diner.altSalle'), cadrage: '30% 55%', classe: 'diner__assiette', sizes: '(max-width: 760px) 92vw, 40vw', attrs: 'data-anime="rideau"' })}
    </div>
    <div class="diner__texte">
      ${heure(c.s('accueil.diner.heure'), 'heure-section--nuit')}
      <p class="surtitre">${c.t('accueil.diner.surtitre')}</p>
      <h2 id="diner-titre" data-anime="lignes">${c.t('accueil.diner.titre')}</h2>
      <p data-anime>${c.t('accueil.diner.texte')}</p>
      <form class="mini-resa" data-mini-resa action="${c.url('reserver', 'formulaire')}" method="get">
        <fieldset class="mini-resa__services">
          <legend>${c.t('accueil.diner.jour')}</legend>
          <div class="mini-resa__puces" data-services data-anime="cascade">
            <label class="puce"><input type="radio" name="service" value="soir" checked><span>Vendredi soir</span></label>
            <label class="puce"><input type="radio" name="service" value="soir"><span>Samedi soir</span></label>
            <label class="puce"><input type="radio" name="service" value="midi"><span>Dimanche midi</span></label>
          </div>
          <input type="hidden" name="date" value="">
        </fieldset>
        <div class="mini-resa__couverts">
          <span class="mini-resa__libelle" id="mini-couverts">${c.t('accueil.diner.couverts')}</span>
          <div class="compteur" role="group" aria-labelledby="mini-couverts">
            <button type="button" data-moins aria-label="${c.s('accueil.diner.moins')}">−</button>
            <input type="number" name="couverts" min="1" max="10" value="2" inputmode="numeric" aria-labelledby="mini-couverts">
            <button type="button" data-plus aria-label="${c.s('accueil.diner.plus')}">+</button>
          </div>
        </div>
        <p class="mini-resa__envoi"><button type="submit" class="bouton" data-grille="retour" data-effet="carton">${c.t('accueil.diner.action')}</button></p>
        <p class="mini-resa__groupe">${c.lien('receptions', { ancre: 'demande', texte: c.t('accueil.diner.groupe') })}</p>
      </form>
    </div>
  </div>
</section>

<section class="feu" id="feu" data-heure="23:00" data-lumiere="feu" data-fx="plein-ecran" data-fx-depart="inset(16% 22% 16% 22% round 18px)" style="--fx-longueur:190svh" aria-labelledby="feu-titre">
  <div class="feu__cadre" data-collant>
    ${c.media({ nom: 'vraie/feu-salle', alt: c.s('accueil.feu.altVraie'), cadrage: '62% 40%', cadrageMobile: '60% 30%', classe: 'feu__photo', sizes: '100vw', attrs: 'data-foyer=".7 .06 1 .8" data-foyer-mobile=".62 .03 1 .47"' })}
    <canvas class="feu__braises" data-braises data-effet="braises" data-souris aria-hidden="true" data-audit-ignorer></canvas>
    <p class="heure-section heure-section--nuit feu__heure" data-fx-apres aria-hidden="true"><span data-texte-hiver="19:00">${c.s('accueil.feu.heure')}</span></p>
    <p class="feu__sous" data-fx-apres>${c.t('accueil.feu.sous')}</p>
    <h2 class="feu__titre" id="feu-titre"><span data-fx-ecarte="g">${c.t('accueil.feu.motG')}</span> <span data-fx-ecarte="d">${c.t('accueil.feu.motD')}</span></h2>
    <p class="feu__legende" data-fx-apres>${c.t('accueil.feu.texte')} <span class="saison-tag saison-tag--nuit">${c.t('accueil.feu.saison')}</span></p>
    <p class="indice feu__indice" aria-hidden="true">${c.t('accueil.feu.indice')}</p>
  </div>
</section>

<section class="fetes-hiver" id="fetes" data-heure="23:30" data-lumiere="fetes" aria-labelledby="fetes-titre">
  <div class="conteneur">
    ${heure('23:30', 'heure-section--nuit')}
    <h2 id="fetes-titre" class="visuellement-cache">${c.t('accueil.feu.lien')}</h2>
    <div class="fetes-hiver__grille" data-anime="cascade">
      ${c.media({ nom: 'sylvestre-coupe', alt: c.s('accueil.feu.coupeAlt'), cadrage: '50% 50%', classe: 'fete__photo', sizes: '(max-width: 760px) 60vw, 22vw' })}
      <article class="fete">
        <p class="fete__sur">${c.t('accueil.feu.noelSur')}</p>
        <h3>${c.t('accueil.feu.noelT')}</h3>
        <p class="fete__decompte" data-effet="decompte" data-cible="${f.noel.date}" data-passe="${c.s('accueil.feu.passe')}" data-aujourdhui="${c.s('accueil.feu.aujourdhui')}">${c.t('accueil.feu.dans')} <span class="fete__jours" data-jours>—</span> ${c.t('accueil.feu.jours')}</p>
        <p class="fete__prix" data-prix>${c.t('accueil.feu.noelX')}</p>
        ${c.lien('les-fetes', { ancre: 'noel', classe: 'lien-fleche', texte: c.t('accueil.feu.noelT') })}
      </article>
      <article class="fete">
        <p class="fete__sur">${c.t('accueil.feu.sylvestreSur')}</p>
        <h3>${c.t('accueil.feu.sylvestreT')}</h3>
        <p class="fete__decompte" data-effet="decompte" data-cible="${f.sylvestre.date}" data-passe="${c.s('accueil.feu.passe')}" data-aujourdhui="${c.s('accueil.feu.aujourdhui')}">${c.t('accueil.feu.dans')} <span class="fete__jours" data-jours>—</span> ${c.t('accueil.feu.jours')}</p>
        <p class="fete__prix" data-prix>${c.t('accueil.feu.sylvestreX')}</p>
        ${c.lien('les-fetes', { ancre: 'saint-sylvestre', classe: 'lien-fleche', texte: c.t('accueil.feu.sylvestreT') })}
      </article>
    </div>
    <p class="fetes-hiver__soirees" data-prochaine-soiree>
      <span data-soiree-texte>${c.t('accueil.feu.soirees')}</span>
      ${c.lien('les-fetes', { ancre: 'dates', classe: 'lien-fleche', texte: c.t('accueil.feu.dates') })}
      <script type="application/json">${brut(JSON.stringify(c.donnees.agenda.dates.filter((d) => d.type !== 'Fête').map((d) => ({ t: d.titre, d: d.debut, p: d.prix }))).replace(/<\//g, '<\\/'))}</script>
    </p>
  </div>
</section>

<section class="minuit" id="minuit" data-heure="24:00" data-lumiere="minuit" aria-labelledby="minuit-titre">
  <div class="conteneur minuit__grille">
    <div class="minuit__offrir">
      ${heure(c.s('accueil.minuit.heure'), 'heure-section--nuit')}
      <p class="surtitre">${c.t('accueil.minuit.surtitre')}</p>
      <h2 id="minuit-titre" data-anime="lignes">${c.t('accueil.minuit.titre')}</h2>
      <p data-anime>${c.t('accueil.minuit.texte')}</p>
      <p>${c.lien('offrir', { classe: 'bouton', texte: c.t('accueil.minuit.action') })}</p>
    </div>
    <div class="carte-cadeau-apercu" data-effet="carte-apercu" data-visuel aria-hidden="true">
      <div class="cca__face">
        <img src="/assets/images/logo-clair.png" alt="" width="56" height="56">
        <p class="cca__nom">${c.t('accueil.minuit.carteNom')}</p>
        <p class="cca__montant">${c.t('accueil.minuit.carteMontant')}</p>
        <p class="cca__pour">${c.t('accueil.minuit.cartePour')}</p>
      </div>
    </div>
  </div>
</section>
<script>/* L'hiver : le coin du feu ouvre la soirée à 19 h (à la place de la terrasse), la terrasse d'été passe tout en bas, en clin d'œil. */
(function(){var d=document.documentElement;if(d.getAttribute('data-saison')==='ete')return;var t=document.getElementById('terrasse'),m=document.getElementById('minuit'),f=document.getElementById('feu'),di=document.getElementById('diner');if(!t||!m||!f||!di)return;
di.parentNode.insertBefore(f,di);f.setAttribute('data-heure','19:00');m.parentNode.insertBefore(t,m.nextSibling);t.setAttribute('data-heure','24:00');t.classList.add('terrasse--clin');
var l=document.querySelectorAll('#terrasse [data-texte-hiver], #feu [data-texte-hiver]');for(var i=0;i<l.length;i++)l[i].textContent=l[i].getAttribute('data-texte-hiver');})();</script>
`;
};
