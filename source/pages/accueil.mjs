/* Accueil v7.4 : une journée à l'Hacienda, sans heures affichées (retour du client).
   L'ouverture garde ses quatre états (été ou hiver, midi ou soir) dans une mise en page de grande maison : le nom en grand,
   la carte et la réservation, la saison, le prochain rendez-vous, la bascule été/hiver et un bouton pause.
   Ensuite : le chef (polaroïd qui se retourne, étiquettes à déplacer), le déjeuner (la carte en cartes qui défilent,
   l'assiette qui fume collée à côté), le lieu (cartes qui filent vers la droite au défilement), l'été le panorama
   de la piscine, le coin du feu (la vraie cheminée ; la réservation arrive après l'ouverture du titre) et « En ce moment »
   (les vraies affiches de Noël et de la Saint-Sylvestre, la carte cadeau). La terrasse du soir est passée sur Réceptions. */
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'accueil', fichier: 'index', theme: 'jour', imagePartage: 'grok/midi-piscine-1280.webp', modules: ['plat-fumant'] };

/* 12 h 30 : quelques exemples de la carte, par rubrique (noms, prix et descriptions de donnees/carte.json). */
const EXEMPLES = {
  entrees: ['Foie gras de canard maison', 'Risotto de Saint-Jacques au riz noir', "L'os à moelle"],
  plats: ['Suprême de pintade', 'Dhal aux trois lentilles', 'Porc et ail confit'],
  desserts: ["Crème brûlée à la vanille de l'île Maurice", 'Brioche perdue', 'Figues rôties au miel'],
};
/* 12 h 30 : l'assiette devant la cheminée, puis trois vraies assiettes du chef ; chacune remplace la grande et fume à son tour
   (sources de vapeur en fractions de l'image : x, y, largeur). */
const ASSIETTES = [
  { nom: 'vraie/plat-cheminee', vapeur: '.46 .7 .42', cadrage: '50% 70%', alt: 'assiette1' },
  { nom: 'assiette-cepes', vapeur: '.5 .52 .52', cadrage: '50% 50%', alt: 'assiette2' },
  { nom: 'assiette-turquoise', vapeur: '.56 .52 .34', cadrage: '50% 50%', alt: 'assiette3' },
  { nom: 'assiette-saumon', vapeur: '.47 .45 .4', cadrage: '50% 50%', alt: 'assiette4' },
];
/* Le lieu : cinq cartes qui filent vers la droite au défilement (vraies photos du site). */
const LIEUX = [
  { cle: 'restaurant', image: 'vraie/salle-baies', cadrage: '40% 50%', page: 'la-carte' },
  { cle: 'terrasse', image: 'vraie/brasero', cadrage: '50% 60%', page: 'receptions', ancre: 'espaces' },
  { cle: 'piscine', image: 'vraie/piscine-paillotes', cadrage: '50% 55%', page: 'les-fetes', ancre: 'ete', params: 'saison=ete' },
  { cle: 'receptions', image: 'vraie/table-mariage', cadrage: '50% 45%', page: 'receptions' },
  { cle: 'feu', image: 'vraie/feu-salle', cadrage: '72% 50%', page: 'reserver', ancre: 'formulaire' },
];
/* Le chef : étiquettes posées autour du polaroïd (position en % de la table, angle), à déplacer du doigt. */
const ETIQUETTES = [
  { cle: 'semaine', x: 0, y: 1, r: -5 },
  { cle: 'cepes', photo: 'vraie/cepes', x: -2, y: 26, r: -9 },
  { cle: 'maison', x: 70, y: 4, r: 7 },
  { cle: 'voix', x: 72, y: 32, r: 4 },
  { cle: 'girolles', photo: 'vraie/assiette-girolles', x: 77, y: 56, r: 11 },
  { cle: 'saison', x: -4, y: 64, r: -6 },
];


/* Venir : les vraies positions projetées (x = (lon − 5,55) × 300, y = (49,75 − lat) × 455), les distances à vol d'oiseau
   calculées depuis Moineville (49,204 N 5,946 E). Les traits se dessinent à l'arrivée, une lueur file vers Moineville. */
const PV = (lat, lon) => [Math.round((lon - 5.55) * 300), Math.round((49.75 - lat) * 455)];
const cheminV = (pts) => 'M' + pts.map(([la, lo]) => PV(la, lo).join(' ')).join(' L ');
function carteVenir(c) {
  const ici = PV(49.204, 5.946);
  const villes = [
    { nom: 'Luxembourg', p: PV(49.6116, 6.1319), km: 47, dx: 10, dy: 5 },
    { nom: 'Thionville', p: PV(49.3579, 6.1683), km: 24, dx: 10, dy: 5 },
    { nom: 'Metz', p: PV(49.1193, 6.1757), km: 19, dx: 10, dy: 5 },
    { nom: 'Nancy', p: PV(48.6921, 6.1844), km: 60, dx: 10, dy: 5 },
  ];
  const courbe = (a, b) => { const mx = (a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.12, my = (a[1] + b[1]) / 2 - (b[0] - a[0]) * 0.12; return `M${a.join(' ')} Q ${Math.round(mx)} ${Math.round(my)} ${b.join(' ')}`; };
  const frontiere = cheminV([[49.58, 5.62], [49.52, 5.80], [49.48, 5.95], [49.465, 6.06], [49.462, 6.13], [49.49, 6.25], [49.47, 6.37], [49.45, 6.50]]);
  return `<svg class="venir__carte" viewBox="0 0 330 520" role="img" aria-label="${c.s('accueil.venir.carteAlt')}">
  <path class="venir__frontiere" d="${frontiere}" fill="none"/>
  <text class="venir__pays" x="12" y="40">LUXEMBOURG</text><text class="venir__pays" x="12" y="150">FRANCE</text>
  <path class="venir__moselle" d="${cheminV([[48.62, 6.17], [48.69, 6.19], [48.85, 6.12], [49.0, 6.13], [49.1193, 6.185], [49.25, 6.178], [49.3579, 6.176], [49.44, 6.36], [49.60, 6.42], [49.72, 6.45]])}" fill="none"/>
  ${villes.map((v, i) => { const d = courbe(ici, v.p); return `<path class="venir__trait" d="${d}" fill="none" pathLength="1" style="--i:${i}"/><circle class="venir__comete" r="3.2" style="--i:${i};offset-path:path('${courbe(v.p, ici)}')"/>`; }).join('')}
  ${villes.map((v, i) => `<g class="venir__ville" style="--i:${i}"><circle cx="${v.p[0]}" cy="${v.p[1]}" r="4.5"/><text x="${v.p[0] + v.dx}" y="${v.p[1] + v.dy}">${v.nom}<tspan class="venir__km" dx="6">${v.km} km</tspan></text></g>`).join('')}
  <circle class="venir__onde" cx="${ici[0]}" cy="${ici[1]}" r="9"/>
  <circle class="venir__ici" cx="${ici[0]}" cy="${ici[1]}" r="8"/>
  <text class="venir__ici-nom" x="${ici[0] - 14}" y="${ici[1] + 6}" text-anchor="end">Moineville</text>
  <text class="venir__note" x="12" y="510">${c.s('accueil.venir.note')}</text>
</svg>`;
}

const dateLongue = (iso) => new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso.slice(0, 10)}T12:00:00Z`));

export default (c) => {
  const plats = c.donnees.carte.rubriques.flatMap((r) => r.plats);
  const exemples = Object.entries(EXEMPLES).map(([cle, noms]) => ({ cle, plats: noms.map((n) => plats.find((p) => p.nom.startsWith(n))).filter(Boolean) }));
  const horaires = JSON.stringify(c.donnees.horaires).replace(/<\//g, '<\\/');
  const resa = JSON.stringify(c.donnees.reservation).replace(/<\//g, '<\\/');
  const f = c.donnees.fetes;
  /* Prochain rendez-vous : calculé ici au jour de la génération, recalculé au jour réel dans la page. */
  const auj = new Date().toISOString().slice(0, 10);
  const agenda = c.donnees.agenda.dates.map((d) => ({ t: d.titre, d: d.debut.slice(0, 10), a: d.ancre || 'dates' })).sort((a, b) => a.d.localeCompare(b.d));
  const rdv = agenda.find((d) => d.d >= auj);
  const ardoise = c.donnees.ardoise.jour;
  return html`
<script type="application/json" data-horaires-accueil>${brut(horaires)}</script>
<script type="application/json" data-reservation-accueil>${brut(resa)}</script>

<section class="heros ecran" id="midi" data-heure="12:00" data-lumiere="midi" data-plein-ecran aria-labelledby="heros-titre">
  <div class="heros__fond">
    <div class="midi__eau midi__eau--ete" data-grille="manipuler" data-effet="eau" data-souris>
      ${c.media({ nom: 'grok/midi-piscine', alt: c.s('accueil.midi.alt'), cadrage: '50% 50%', cadrageMobile: '58% 60%', classe: 'midi__photo', sizes: '100vw' })}
      <canvas class="midi__canvas" data-eau aria-hidden="true" data-audit-ignorer></canvas>
    </div>
    <div class="midi__eau midi__hiver" data-grille="manipuler" data-effet="soleil" data-souris>
      ${c.media({ nom: 'vraie/salle-panorama', alt: c.s('accueil.midi.altHiver'), cadrage: '56% 50%', cadrageMobile: '62% 55%', classe: 'midi__photo midi__photo--hiver-jour', sizes: '100vw' })}
      ${c.media({ nom: 'vraie/salle-nuit', alt: c.s('accueil.midi.altHiverSoir'), cadrage: '50% 55%', cadrageMobile: '62% 55%', classe: 'midi__photo midi__photo--hiver-soir', sizes: '100vw' })}
      ${c.media({ nom: 'grok/terrasse-nuit', alt: c.s('accueil.midi.altEteSoir'), cadrage: '50% 50%', cadrageMobile: '56% 50%', classe: 'midi__photo midi__photo--ete-soir', sizes: '100vw' })}
      <span class="midi__rayons" aria-hidden="true"></span>
      <span class="midi__soleil" aria-hidden="true"></span>
      <span class="mention-retouche midi__retouche" aria-hidden="true">${c.t('accueil.midi.retouche')}</span>
    </div>
  </div>
  <button type="button" class="heros__pause" data-heros-pause aria-pressed="false" aria-label="${c.s('accueil.heros.pause')}" data-pause="${c.s('accueil.heros.pause')}" data-reprendre="${c.s('accueil.heros.reprendre')}"><span class="heros__pause-icone" aria-hidden="true"></span></button>
  <div class="heros__texte conteneur">
    <p class="heros__lieu" data-anime="gsap">${c.t('accueil.heros.lieu')}</p>
    <h1 class="heros__titre" id="heros-titre" data-iris-centre><span class="heros__l1">${c.t('accueil.heros.titre1')}</span> <em class="heros__l2">${c.t('accueil.heros.titre2')}</em></h1>
    <p class="heros__intro" data-anime="gsap" data-t-ete-jour="${c.s('accueil.heros.introEte')}" data-t-hiver-soir="${c.s('accueil.heros.introHiverSoir')}" data-t-ete-soir="${c.s('accueil.heros.introEteSoir')}">${c.t('accueil.heros.intro')}</p>
    <p class="heros__actions" data-anime="gsap">
      ${c.lien('reserver', { ancre: 'formulaire', classe: 'bouton', texte: c.t('accueil.heros.reserver'), attrs: 'data-action-principale data-survol="magnetique"' })}
      ${c.lien('la-carte', { classe: 'bouton bouton--creme', texte: c.t('accueil.heros.carte'), attrs: 'data-survol="magnetique"' })}
    </p>
    <div class="heros__barre" data-anime="gsap">
      <p class="heros__saison"><span class="heros__point" aria-hidden="true"></span><span data-t-ete-jour="${c.s('accueil.heros.saisonEte')}" data-t-ete-soir="${c.s('accueil.heros.saisonEte')}">${c.t('accueil.heros.saisonHiver')}</span></p>
      <p class="heros__rdv"><span class="heros__rdv-libelle">${c.t('accueil.heros.rdv')}</span> ${rdv
        ? c.lien('les-fetes', { ancre: rdv.a, texte: html`<span data-heros-rdv>${rdv.t}, ${dateLongue(rdv.d)}</span>`, attrs: 'data-heros-rdv-lien' })
        : c.lien('les-fetes', { ancre: 'dates', texte: c.t('accueil.heros.rdvTous'), attrs: 'data-heros-rdv-lien' })}</p>
      ${c.lien('accueil', { params: 'saison=ete', classe: 'heros__bascule', texte: html`<span class="heros__interrupteur" aria-hidden="true"><span></span></span><span class="heros__bascule-texte" data-t-ete-jour="${c.s('accueil.heros.voirHiver')}" data-t-ete-soir="${c.s('accueil.heros.voirHiver')}">${c.t('accueil.heros.voirEte')}</span>`, attrs: `data-heros-bascule data-href-ete="${c.url('accueil', '', 'saison=hiver')}"` })}
      <script type="application/json" data-heros-agenda>${brut(JSON.stringify(agenda).replace(/<\//g, '<\\/'))}</script>
    </div>
  </div>
  <script>/* Ouverture : quatre états (été ou hiver, midi ou soir), posés avant le premier affichage ; seule l'image visible se charge tout de suite. */
(function(){var d=document.documentElement,sa=d.getAttribute('data-saison')==='ete'?'ete':'hiver',mo=d.getAttribute('data-moment')==='soir'?'soir':'jour',k=sa+'-'+mo;
var im=document.querySelector(k==='ete-jour'?'#midi .midi__eau--ete img':'#midi .midi__photo--'+k+' img');if(im){im.loading='eager';im.setAttribute('fetchpriority','high');}
var se=document.getElementById('midi');if(se)se.setAttribute('data-etat',k);if(mo==='soir'&&se)se.setAttribute('data-lumiere','feu');
if(sa==='ete'){var b=document.querySelector('[data-heros-bascule]');if(b)b.setAttribute('href',b.getAttribute('data-href-ete'));}
if(k==='hiver-jour')return;var a='data-t-'+k,l=document.querySelectorAll('#midi ['+a+']');for(var i=0;i<l.length;i++)l[i].textContent=l[i].getAttribute(a);})();</script>
</section>

<section class="chef" id="chef" data-heure="12:15" data-lumiere="chef" aria-labelledby="chef-titre">
  <div class="conteneur chef__grille">
    <div class="chef__table" data-chef-table>
      <div class="polaroid" data-polaroid>
        <div class="polaroid__carte">
          <div class="polaroid__face polaroid__face--avant">
            ${c.media({ nom: 'vraie/chef', alt: c.s('accueil.chef.alt'), cadrage: '50% 40%', classe: 'polaroid__photo', sizes: '(max-width: 760px) 64vw, 360px' })}
            <p class="polaroid__legende">${c.t('accueil.chef.legende')}</p>
          </div>
          <div class="polaroid__face polaroid__face--dos" data-face="dos" aria-hidden="true">
            <div class="ardoise-dos">
              <p class="ardoise-dos__date">${c.donnees.ardoise.date}</p>
              <p class="ardoise-dos__titre">${ardoise.titre}</p>
              <span class="ardoise-dos__trait" aria-hidden="true"></span>
              <ul class="ardoise-dos__liste">
                ${ardoise.lignes.map((l) => html`<li><span>${l.plat}</span><span data-prix>${l.prix}</span></li>`)}
              </ul>
              <p class="ardoise-dos__mot">${ardoise.mot}</p>
            </div>
          </div>
        </div>
        <button type="button" class="polaroid__retourner" data-polaroid-retourner aria-pressed="false" data-retourner="${c.s('accueil.chef.retourner')}" data-revoir="${c.s('accueil.chef.revoir')}"><span class="polaroid__retourner-texte">${c.t('accueil.chef.retourner')}</span></button>
      </div>
      <ul class="chef__etiquettes" aria-hidden="true" data-superpose>
        ${ETIQUETTES.map((e, i) => html`<li class="etiquette etiquette--${e.photo ? 'photo' : 'mot'} etiquette--${e.cle}" data-etiquette style="--x:${e.x}%;--y:${e.y}%;--r:${e.r}deg;--n:${i}">${e.photo ? c.media({ nom: e.photo, alt: '', cadrage: '50% 50%', classe: 'etiquette__photo', sizes: '120px' }) : ''}<span class="etiquette__texte">${c.t(`accueil.chef.etiquette.${e.cle}`)}</span></li>`)}
      </ul>
      <p class="indice chef__indice" aria-hidden="true"><span class="indice--souris">${c.t('accueil.chef.indice')}</span><span class="indice--doigt">${c.t('accueil.chef.indiceTactile')}</span></p>
    </div>
    <div class="chef__texte">
      <p class="surtitre">${c.t('accueil.chef.surtitre')}</p>
      <h2 id="chef-titre" data-anime="lignes">${c.t('accueil.chef.titre')}</h2>
      <p class="chef__signature" data-anime>${c.t('accueil.chef.signature')}</p>
      <p data-anime>${c.t('accueil.chef.texte1')}</p>
      <p data-anime>${c.t('accueil.chef.texte2')}</p>
      <p class="chef__actions">
        ${c.lien('la-carte', { classe: 'bouton bouton--creme', texte: c.t('accueil.chef.carte') })}
        <a class="bouton bouton--contour bouton--clair" href="${c.site.contact.instagram}" target="_blank" rel="noopener">${c.t('accueil.chef.instagram')}<span class="visuellement-cache"> ${c.t('accueil.chef.nouvelOnglet')}</span></a>
      </p>
    </div>
  </div>
</section>

<section class="dejeuner" id="dejeuner" data-heure="12:30" data-lumiere="dejeuner" aria-labelledby="dejeuner-titre">
  <div class="conteneur dejeuner__grille">
    <div class="dejeuner__tete">
      <p class="surtitre">${c.t('accueil.dejeuner.surtitre')}</p>
      <h2 id="dejeuner-titre" data-anime="lignes">${c.t('accueil.dejeuner.titre')}</h2>
      <p data-anime>${c.t('accueil.dejeuner.texte')}</p>
    </div>
    <div class="dejeuner__visuel">
      ${c.media({ nom: 'vraie/plat-cheminee', alt: c.s('accueil.diner.alt'), cadrage: '50% 70%', classe: 'dejeuner__assiette fumant', sizes: '(max-width: 760px) 92vw, 40vw', attrs: 'data-module="plat-fumant" data-vapeur=".46 .7 .42" data-plat-scene' })}
      <p class="indice dejeuner__indice" aria-hidden="true"><span class="indice--souris">${c.t('accueil.diner.indice')}</span><span class="indice--doigt">${c.t('accueil.diner.indiceTactile')}</span></p>
      <div class="dejeuner__vraies" data-effet="vraies" aria-label="${c.s('accueil.dejeuner.photos')}" role="group">
        ${ASSIETTES.map((a, i) => html`<button type="button" class="vraie vraie--${i + 1}" data-plat="${a.nom}" data-vapeur="${a.vapeur}" data-cadrage="${a.cadrage}" data-alt="${c.s(`accueil.dejeuner.${a.alt}`)}" aria-pressed="${i === 0 ? 'true' : 'false'}" aria-label="${c.s(`accueil.dejeuner.${a.alt}`)}">${c.media({ nom: a.nom, alt: '', cadrage: a.cadrage, classe: 'vraie__photo', sizes: '160px' })}</button>`)}
      </div>
    </div>
    <div class="dejeuner__cartes" data-effet="rubriques">
      ${exemples.map((r) => html`<article class="rubrique-carte" aria-labelledby="rubrique-${r.cle}">
        <h3 id="rubrique-${r.cle}">${c.t(`accueil.dejeuner.${r.cle}`)}</h3>
        <ul class="rubrique-carte__plats">
          ${r.plats.map((p) => html`<li class="plat-ligne">
            <p class="plat-ligne__tete"><span class="plat-ligne__nom">${p.nom}</span><span class="plat-ligne__points" aria-hidden="true"></span><span class="plat-ligne__prix" data-prix>${typeof p.prix === 'number' ? `${p.prix} €` : p.prix}</span></p>
            <p class="plat-ligne__desc">${p.description}</p>
          </li>`)}
        </ul>
      </article>`)}
      <p class="dejeuner__info" data-info>${c.t('accueil.dejeuner.info')}</p>
      <p class="dejeuner__actions">${c.lien('la-carte', { classe: 'bouton bouton--contour', texte: c.t('accueil.dejeuner.lien') })} <span class="saison-tag saison-tag--clair">${c.t('accueil.dejeuner.saison')}</span></p>
    </div>
  </div>
</section>

<section class="lieu-defile" id="lieu" data-heure="14:00" data-lumiere="lieu" data-effet="lieu" aria-labelledby="lieu-titre">
  <div class="lieu-defile__cadre" data-collant>
    <div class="conteneur lieu-defile__tete">
      <p class="surtitre">${c.t('accueil.lieu.surtitre')}</p>
      <h2 id="lieu-titre" data-anime="lignes">${c.t('accueil.lieu.titre')}</h2>
      <p class="lieu-defile__texte" data-anime>${c.t('accueil.lieu.texte')}</p>
    </div>
    <ul class="lieu-defile__piste" data-lieu-piste data-galerie>
      ${LIEUX.map((l) => html`<li class="lieu-carte">
        ${c.media({ nom: l.image, alt: c.s(`accueil.lieu.${l.cle}Alt`), cadrage: l.cadrage, classe: 'lieu-carte__photo', sizes: '(max-width: 760px) 78vw, 30vw' })}
        <h3 class="lieu-carte__titre">${c.lien(l.page, { ancre: l.ancre || '', params: l.params || '', classe: 'lieu-carte__lien', texte: html`${c.t(`accueil.lieu.${l.cle}T`)}<span class="lieu-carte__fleche" aria-hidden="true">→</span>` })}</h3>
        <p class="lieu-carte__texte">${c.t(`accueil.lieu.${l.cle}X`)}</p>
      </li>`)}
    </ul>
    <div class="lieu-defile__progres" aria-hidden="true"><span data-lieu-progres></span></div>
  </div>
</section>

<section class="apresmidi panorama" id="apres-midi" data-heure="14:30" data-lumiere="apresmidi" data-effet="panorama" data-saison-seul="ete" data-sans-visuel aria-labelledby="apresmidi-titre">
  <div class="panorama__cadre">
    <div class="panorama__piste" data-panorama-piste>
      ${c.media({ nom: 'vraie/piscine-pergola', alt: c.s('accueil.apresmidi.altPanorama'), cadrage: '50% 50%', classe: 'panorama__photo', sizes: '(max-width: 760px) 300vw, 160vw' })}
      <div class="panorama__soleil" aria-hidden="true"></div>
      <ol class="panorama__lieux" aria-label="${c.s('accueil.apresmidi.region')}">
        ${[
          { id: 'journees-festives', cle: 'festives', x: 22, y: 34, p: 0.12 },
          { id: 'bar', cle: 'bar', x: 47, y: 30, p: 0.38 },
          { id: 'piscine', cle: 'piscine', x: 70, y: 70, p: 0.62 },
          { id: 'pool-parties', cle: 'pool', x: 90, y: 50, p: 0.86 },
        ].map((l) => html`<li class="lieu" id="${l.id}" style="--x:${l.x}%;--y:${l.y}%" data-lieu="${l.p}"><span class="lieu__point" aria-hidden="true"></span><div class="lieu__texte"><p class="lieu__heure">${c.t(`accueil.apresmidi.${l.cle}H`)}</p><h3>${c.t(`accueil.apresmidi.${l.cle}T`)}</h3><p>${c.t(`accueil.apresmidi.${l.cle}X`)}</p></div></li>`)}
      </ol>
    </div>
    <div class="panorama__tete">
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

<section class="feu" id="feu" data-heure="19:00" data-lumiere="feu" data-fx="plein-ecran" data-fx-depart="inset(16% 22% 16% 22% round 18px)" style="--fx-longueur:290svh" aria-labelledby="feu-titre">
  <div class="feu__cadre" data-collant>
    ${c.media({ nom: 'vraie/feu-salle', alt: c.s('accueil.feu.altVraie'), cadrage: '62% 40%', cadrageMobile: '60% 30%', classe: 'feu__photo', sizes: '100vw', attrs: 'data-foyer=".7 .06 1 .8" data-foyer-mobile=".62 .03 1 .47"' })}
    <canvas class="feu__braises" data-braises data-effet="braises" data-souris aria-hidden="true" data-audit-ignorer></canvas>
    <div class="feu__tete" data-feu-tete>
      <p class="feu__sous" data-fx-apres>${c.t('accueil.feu.sous')}</p>
      <h2 class="feu__titre" id="feu-titre"><span data-fx-ecarte="g">${c.t('accueil.feu.motG')}</span> <span data-fx-ecarte="d">${c.t('accueil.feu.motD')}</span></h2>
      <p class="feu__legende" data-fx-apres>${c.t('accueil.feu.texte')}</p>
    </div>
    <form class="mini-resa feu__resa" data-mini-resa data-feu-resa data-services-nombre="4" action="${c.url('reserver', 'formulaire')}" method="get" aria-labelledby="feu-resa-titre">
      <div class="feu__resa-haut">
        <p class="feu__resa-titre" id="feu-resa-titre">${c.t('accueil.feu.resaTitre')}</p>
        <p class="mini-resa__groupe">${c.lien('receptions', { ancre: 'demande', texte: c.t('accueil.diner.groupe') })}</p>
      </div>
      <fieldset class="mini-resa__services">
        <legend>${c.t('accueil.diner.jour')}</legend>
        <div class="mini-resa__puces" data-services>
          <label class="puce"><input type="radio" name="service" value="soir" checked><span>Vendredi soir</span></label>
          <label class="puce"><input type="radio" name="service" value="soir"><span>Samedi soir</span></label>
          <label class="puce"><input type="radio" name="service" value="midi"><span>Dimanche midi</span></label>
        </div>
        <input type="hidden" name="date" value="">
      </fieldset>
      <div class="feu__resa-bas">
        <div class="mini-resa__couverts">
          <span class="mini-resa__libelle" id="mini-couverts">${c.t('accueil.diner.couverts')}</span>
          <div class="compteur" role="group" aria-labelledby="mini-couverts">
            <button type="button" data-moins aria-label="${c.s('accueil.diner.moins')}">−</button>
            <input type="number" name="couverts" min="1" max="10" value="2" inputmode="numeric" aria-labelledby="mini-couverts">
            <button type="button" data-plus aria-label="${c.s('accueil.diner.plus')}">+</button>
          </div>
        </div>
        <p class="mini-resa__envoi"><button type="submit" class="bouton" data-grille="retour" data-effet="carton">${c.t('accueil.diner.action')}</button></p>
      </div>
    </form>
    <p class="indice feu__indice" aria-hidden="true">${c.t('accueil.feu.indice')}</p>
  </div>
</section>

<section class="moment" id="fetes" data-heure="21:00" data-lumiere="moment" aria-labelledby="moment-titre">
  <div class="conteneur">
    <h2 id="moment-titre" class="moment__titre" data-anime="lignes">${c.t('accueil.moment.titre')}</h2>
    <div class="moment__grille" data-anime="cascade">
      ${c.lien('les-fetes', { ancre: 'saint-sylvestre', classe: 'moment-carte', attrs: 'aria-labelledby="moment-sylvestre"', texte: html`
        <div class="moment-carte__visuel">
          ${c.media({ nom: 'vraie/affiche-sylvestre', alt: c.s('accueil.moment.altSylvestre'), cadrage: '50% 14%', classe: 'moment-carte__photo', sizes: '(max-width: 760px) 92vw, 30vw' })}
          <p class="moment-carte__decompte" data-effet="decompte" data-cible="${f.sylvestre.date}" data-passe="${c.s('accueil.feu.passe')}" data-aujourdhui="${c.s('accueil.feu.aujourdhui')}">${c.t('accueil.feu.dans')} <span class="moment-carte__jours" data-jours>—</span> ${c.t('accueil.feu.jours')}</p>
        </div>
        <p class="moment-carte__date">${c.t('accueil.moment.sylvestreDate')}</p>
        <h3 id="moment-sylvestre">${c.t('accueil.moment.sylvestreT')}</h3>
        <p class="moment-carte__texte">${c.t('accueil.moment.sylvestreX')}</p>
        <p class="moment-carte__prix" data-prix>${c.t('accueil.moment.sylvestrePrix')}</p>
        <p class="moment-carte__plus" aria-hidden="true">${c.t('accueil.moment.decouvrir')} <span>→</span></p>
      ` })}
      ${c.lien('les-fetes', { ancre: 'noel', classe: 'moment-carte', attrs: 'aria-labelledby="moment-noel"', texte: html`
        <div class="moment-carte__visuel">
          ${c.media({ nom: 'vraie/affiche-noel', alt: c.s('accueil.moment.altNoel'), cadrage: '50% 10%', classe: 'moment-carte__photo', sizes: '(max-width: 760px) 92vw, 30vw' })}
          <p class="moment-carte__decompte" data-effet="decompte" data-cible="${f.noel.date}" data-passe="${c.s('accueil.feu.passe')}" data-aujourdhui="${c.s('accueil.feu.aujourdhui')}">${c.t('accueil.feu.dans')} <span class="moment-carte__jours" data-jours>—</span> ${c.t('accueil.feu.jours')}</p>
        </div>
        <p class="moment-carte__date">${c.t('accueil.moment.noelDate')}</p>
        <h3 id="moment-noel">${c.t('accueil.moment.noelT')}</h3>
        <p class="moment-carte__texte">${c.t('accueil.moment.noelX')}</p>
        <p class="moment-carte__prix" data-prix>${c.t('accueil.feu.noelX')}</p>
        <p class="moment-carte__plus" aria-hidden="true">${c.t('accueil.moment.decouvrir')} <span>→</span></p>
      ` })}
      ${c.lien('les-fetes', { ancre: 'dates', classe: 'moment-carte', attrs: 'aria-labelledby="moment-soirees"', texte: html`
        <div class="moment-carte__visuel">
          ${c.media({ nom: 'vraie/diner-feu', alt: c.s('accueil.moment.altSoirees'), cadrage: '60% 40%', classe: 'moment-carte__photo', sizes: '(max-width: 760px) 92vw, 30vw' })}
        </div>
        <p class="moment-carte__date">${c.t('accueil.moment.soireesDate')}</p>
        <h3 id="moment-soirees">${c.t('accueil.moment.soireesT')}</h3>
        <p class="moment-carte__texte">${c.t('accueil.moment.soireesX')}</p>
        <p class="moment-carte__prix" data-prix>${c.t('accueil.moment.soireesPrix')}</p>
        <p class="moment-carte__plus" aria-hidden="true">${c.t('accueil.moment.decouvrir')} <span>→</span></p>
      ` })}
    </div>
    <p class="moment__soirees" data-prochaine-soiree>
      <span data-soiree-texte>${c.t('accueil.feu.soirees')}</span>
      ${c.lien('les-fetes', { ancre: 'dates', classe: 'lien-fleche', texte: c.t('accueil.feu.dates') })}
      <script type="application/json">${brut(JSON.stringify(c.donnees.agenda.dates.filter((d) => d.type !== 'Fête').map((d) => ({ t: d.titre, d: d.debut, p: d.prix }))).replace(/<\//g, '<\\/'))}</script>
    </p>
  </div>
</section>

<section class="offrir-emporter" id="offrir-emporter" data-heure="22:00" data-lumiere="moment" aria-labelledby="oe-titre">
  <div class="conteneur">
    <p class="surtitre">${c.t('accueil.oe.surtitre')}</p>
    <h2 id="oe-titre" class="oe__titre" data-anime="lignes">${c.t('accueil.oe.titre')}</h2>
    <div class="oe__grille" data-anime="cascade">
      <article class="oe-carte">
        <div class="oe-carte__visuel">
          ${c.media({ nom: 'vraie/foie-gras-maison', alt: c.s('accueil.oe.altFoie'), cadrage: '50% 55%', classe: 'oe-carte__photo', sizes: '(max-width: 760px) 92vw, 44vw' })}
          <span class="oe-carte__sceau" aria-hidden="true">${c.t('accueil.oe.sceau')}</span>
        </div>
        <h3>${c.t('accueil.oe.emporterT')}</h3>
        <p class="oe-carte__texte">${c.t('accueil.oe.emporterX')}</p>
        <ul class="oe-carte__liste" aria-label="${c.s('accueil.oe.emporterListe')}">
          ${c.s('accueil.oe.incontournables').split('|').map((x) => html`<li>${x}</li>`)}
        </ul>
        <p class="oe-carte__actions"><a class="bouton" href="tel:${c.site.contact.telephoneLien}">${c.t('accueil.oe.commander')} ${c.site.contact.telephone}</a></p>
      </article>
      <article class="oe-carte">
        <div class="oe-carte__visuel oe-carte__visuel--cadeau" data-carte-luxe>
          <div class="carte-luxe" role="img" aria-label="${c.s('accueil.oe.altCarte')}" data-audit-ignorer>
            <span class="carte-luxe__reflet" aria-hidden="true"></span>
            <span class="carte-luxe__logo" aria-hidden="true"></span>
            <span class="carte-luxe__montant" aria-hidden="true" data-carte-montant>100 €</span>
            <span class="carte-luxe__titre" aria-hidden="true">${c.t('accueil.oe.carteTitre')}</span>
            <span class="carte-luxe__nom" aria-hidden="true">${c.site.nom}</span>
            <span class="carte-luxe__validite" aria-hidden="true">${c.t('accueil.oe.carteValidite')}</span>
          </div>
        </div>
        <h3>${c.t('accueil.oe.cadeauT')}</h3>
        <p class="oe-carte__texte">${c.t('accueil.oe.cadeauX')}</p>
        <div class="oe-carte__montants" role="group" aria-label="${c.s('accueil.oe.montants')}">
          ${[25, 50, 100, 150, 200].map((m) => html`<button type="button" class="oe-montant" data-montant="${m}" aria-pressed="${m === 100 ? 'true' : 'false'}">${m} €</button>`)}
        </div>
        <p class="oe-carte__actions">${c.lien('offrir', { classe: 'bouton bouton--contour', texte: c.t('accueil.oe.offrir') })}</p>
      </article>
    </div>
  </div>
</section>

<section class="venir" id="venir" data-heure="23:00" data-lumiere="moment" aria-labelledby="venir-titre">
  <div class="conteneur venir__grille">
    <div class="venir__texte">
      <p class="surtitre">${c.t('accueil.venir.surtitre')}</p>
      <h2 id="venir-titre" data-anime="lignes">${c.t('accueil.venir.titre')}</h2>
      <p data-anime>${c.t('accueil.venir.texte')}</p>
      <address class="venir__adresse">
        <strong>${c.site.nom}</strong><br>${c.site.contact.adresse}<br>
        <a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a>
      </address>
      <p class="statut venir__statut"><span class="statut__point" aria-hidden="true"></span><span data-statut-accueil>${c.t('accueil.midi.statutSansJs')}</span></p>
      <p class="venir__actions">
        ${c.lien('reserver', { ancre: 'formulaire', classe: 'bouton', texte: c.t('accueil.venir.reserver') })}
        <a class="bouton bouton--contour" href="https://www.google.com/maps/search/?api=1&amp;query=6+Vathier+Haye+54580+Moineville" target="_blank" rel="noopener">${c.t('accueil.venir.itineraire')}<span class="visuellement-cache"> ${c.t('accueil.oe.nouvelOnglet')}</span></a>
      </p>
    </div>
    <div class="venir__plan" data-venir>${brut(carteVenir(c))}</div>
  </div>
</section>
`;
};
