/* Gabarit commun des Jardins de l'Hacienda v6 « De midi à minuit » : head, en-tête avec l'horloge de la page (le fil),
   menu, pied de page de nuit, barre fixe du téléphone, voile « cloche » (la transition en assiette gardée de la v5,
   habillée de la couleur et des chiffres de l'heure d'arrivée), panneau d'intro (le monogramme de la maison).
   Les conventions data-* sont celles que lisent le socle JavaScript et l'audit (voir le README du socle). */
import { html, brut } from '../../outils/gabarit.mjs';

const navigation = (c) => c.site.navigation.filter((cle) => c.pages[cle] && (c.pages[cle].langues || c.langues).includes(c.l));

/* Heure et couleur de chaque page : l'horloge de l'en-tête, la couleur du voile et ses chiffres. */
export const HEURES = {
  accueil: { h: '12', m: '00', voile: '#f6f1e7' },
  'la-carte': { h: '12', m: '30', voile: '#f6f1e7' },
  receptions: { h: '19', m: '00', voile: '#f6f1e7' },
  reserver: { h: '21', m: '00', voile: '#f6f1e7' },
  'les-fetes': { h: '23', m: '30', voile: '#f6f1e7' },
  offrir: { h: '00', m: '00', voile: '#f6f1e7' },
  'infos-pratiques': { h: '--', m: '--', voile: '#f6f1e7', reelle: true },
  404: { h: '00', m: '00', voile: '#f6f1e7' },
};

/* Avant le premier affichage (après le script critique du socle) : moment réel à Moineville (jour, soir) et saison,
   pour les pages qui en dépendent (photos et textes). Sans JavaScript, la page garde son état par défaut. */
const MOMENT = `(function(){try{var d=document.documentElement,p={};new Intl.DateTimeFormat('fr-FR',{timeZone:'Europe/Paris',hour:'2-digit',minute:'2-digit',month:'numeric',hourCycle:'h23'}).formatToParts(new Date()).forEach(function(x){p[x.type]=x.value});var h=+p.hour,m=+p.month;var mo=h>=5&&h<17?'jour':'soir';try{var q=new URLSearchParams(location.search).get('moment');if(q==='jour'||q==='soir')mo=q;}catch(e){}d.setAttribute('data-moment',mo);if(d.hasAttribute('data-theme-auto')){d.setAttribute('data-theme',mo==='soir'?'nuit':'jour');if(mo==='soir'){d.style.setProperty('--ouverture-fond','#120c09');d.style.setProperty('--ouverture-texte','#f6efe2');}}var sa=m>=5&&m<=9?'ete':'hiver';try{var qs=new URLSearchParams(location.search).get('saison');if(qs==='ete'||qs==='hiver')sa=qs;}catch(e){}d.setAttribute('data-saison',sa);d.style.setProperty('--heure-reelle',"'"+p.hour+':'+p.minute+"'");}catch(e){}})();`;

function tete(c) {
  const p = c.page, cle = p.cle;
  const titre = c.s(`pages.${cle}.titre`), description = c.s(`pages.${cle}.description`);
  const ici = c.abs(c.url(cle));
  const imagePartage = c.abs(`/assets/partage/${p.partage === false ? 'accueil' : cle}-${c.l}.jpg`);
  const structure = c.donnees.structure ? JSON.stringify(c.donnees.structure).replace(/</g, '\\u003c') : '';
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titre}</title>
<meta name="description" content="${description}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${ici}">
<style>${brut(c.critique.css)}</style>
<script>${brut(c.critique.js)}</script>
<script>${brut(MOMENT)}</script>
${(c.site.polices || []).map((f) => html`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>\n`)}<link rel="stylesheet" href="${c.asset('css/socle.css')}">
${(c.page.modules || []).map((m) => html`<link rel="stylesheet" href="${c.asset('js/modules/' + m + '/module.css')}">\n`)}<link rel="stylesheet" href="${c.asset('css/site.css')}">
<link rel="modulepreload" href="${c.asset('js/site.js')}">
<link rel="modulepreload" href="${c.asset('js/socle/index.js')}">
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/SplitText.min.js" defer></script>
<script type="module" src="${c.asset('js/site.js')}"></script>
<meta name="theme-color" content="${c.site.couleurs.theme || c.site.couleurs.fond}">
<link rel="icon" href="/assets/images/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${c.site.nom}">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="${titre}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${ici}">
<meta property="og:image" content="${imagePartage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${c.s(`pages.${p.partage === false ? 'accueil' : cle}.partageAlt`)}">
<meta name="twitter:card" content="summary_large_image">
${structure ? html`<script type="application/ld+json">${brut(structure)}</script>` : ''}
</head>`;
}

/* L'horloge de la page : le fil qui relie les sections (l'accueil la fait rouler de 12:00 à 00:00 au défilement)
   et les pages (chacune a son heure). Décor : l'heure dite aux lecteurs d'écran est dans chaque section. */
function horloge(c) {
  const H = HEURES[c.page.cle] || HEURES.accueil;
  return html`<p class="horloge" data-horloge data-grille="fil" data-effet="heure" aria-hidden="true"${H.reelle ? brut(' data-horloge-reelle') : ''}><span class="horloge__h" data-horloge-h>${H.h}</span><span class="horloge__sep">:</span><span class="horloge__m" data-horloge-m>${H.m}</span></p>`;
}

function entete(c) {
  return html`<header data-entete>
  <div class="entete-rangee">
    <a class="entete-logo" href="${c.url('accueil')}" aria-label="${c.s('commun.accueilLogo')}" data-libelle="${c.libelle('accueil')}"${c.page.cle === 'accueil' ? brut(' aria-current="page"') : ''}>
      <img class="entete-logo__jour" src="/assets/images/logo-240.webp" alt="" width="40" height="37"><img class="entete-logo__nuit" src="/assets/images/logo-clair.png" alt="" width="40" height="40"><span>${c.site.nom}</span>
    </a>
    ${horloge(c)}
    <nav data-nav aria-label="${c.s('commun.navigation')}">
      <ul>${navigation(c).filter((k) => k !== 'accueil').map((k) => html`<li>${c.lien(k)}</li>`)}</ul>
    </nav>
    <div class="entete-actions">
      <a class="bouton bouton--entete" href="${c.url(c.site.actionEntete.page, c.site.actionEntete.ancre || '')}" data-libelle="${c.libelle(c.site.actionEntete.page)}" data-resa-cible>${c.t('commun.actionEntete')}</a>
      <button type="button" data-menu-bouton aria-controls="menu" aria-expanded="false" data-libelle-ouvrir="${c.s('commun.menu')}" data-libelle-fermer="${c.s('commun.fermer')}"><span data-libelle-bouton>${c.t('commun.menu')}</span></button>
      <a class="menu-sansjs" href="#menu" data-menu-lien>${c.t('commun.menu')}</a>
    </div>
  </div>
</header>
<script>/* Avant le premier affichage : rangées de la navigation (même règle que ajusterNav dans assets/js/socle/entete.js)
   et hauteur réelle de l'en-tête, pour que rien ne saute quand le JavaScript du site prend la main. */
(function () {
  var h = document.documentElement, u = document.querySelector('[data-nav] ul'), e = document.querySelector('[data-entete]');
  if (u) {
    var deborde = function () { return u.scrollWidth > u.clientWidth + 1; }, c = deborde();
    if (c && window.matchMedia('(min-width: 900px)').matches) {
      h.classList.add('nav-deux-rangees'); c = deborde();
      if (c) { h.classList.add('nav-deux-lignes'); var a = u.querySelector('a'); c = !a || u.getBoundingClientRect().height > a.getBoundingClientRect().height * 2.5; }
      if (c) h.classList.remove('nav-deux-rangees', 'nav-deux-lignes');
    }
    if (c) h.classList.add('nav-compacte');
  }
  if (e) h.style.setProperty('--entete-h', Math.round(e.getBoundingClientRect().height) + 'px');
})();</script>
<span id="menu-ferme" aria-hidden="true"></span>
<div id="menu" data-menu role="dialog" aria-modal="true" aria-label="${c.s('commun.menu')}">
  <p class="menu-sansjs-fermer"><a href="#menu-ferme">${c.t('commun.fermer')}</a></p>
  <ul>${navigation(c).map((k, i) => html`<li style="--i:${i}"><span class="menu-heure" aria-hidden="true">${(HEURES[k] || {}).reelle ? c.s('commun.maintenant') : `${HEURES[k].h}:${HEURES[k].m}`}</span>${c.lien(k, { classe: 'menu-lien' })}</li>`)}</ul>
  <p class="menu-actions">${c.lien('reserver', { ancre: 'formulaire', classe: 'bouton', texte: c.t('commun.actionMenu') })} <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a></p>
  <p><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></p>
</div>`;
}

function pied(c) {
  return html`<footer class="pied" id="pied">
  <div class="conteneur pied-grille">
    <div class="pied-maison">
      <img class="pied-logo" src="/assets/images/logo-clair.png" alt="" width="56" height="56" loading="lazy" decoding="async">
      <p><strong>${c.site.nom}</strong></p>
      <p>${c.site.contact.adresse}<br><a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a></p>
      <p class="pied-reseaux"><a href="${c.site.contact.facebook}" target="_blank" rel="noopener" aria-label="${c.s('commun.facebook')}">Facebook <span aria-hidden="true">↗</span></a> <a href="${c.site.contact.instagram}" target="_blank" rel="noopener" aria-label="${c.s('commun.instagram')}">Instagram <span aria-hidden="true">↗</span></a></p>
    </div>
    <div class="pied-venir">
      <p><strong>${c.t('commun.venirT')}</strong></p>
      <p>${c.t('commun.venir')}</p>
      <p>${c.lien('infos-pratiques', { ancre: 'acces', classe: 'lien-fleche', texte: c.t('commun.venirLien') })}</p>
    </div>
    <nav aria-label="${c.s('commun.sommaire')}">
      <p><strong>${c.t('commun.sommaire')}</strong></p>
      <ul>${navigation(c).map((k) => html`<li>${c.lien(k)}</li>`)}<li>${c.lien('reserver', { ancre: 'formulaire' })}</li></ul>
    </nav>
    <div>
      <p><strong>${c.t('commun.confort')}</strong></p>
      <ul>
        <li><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></li>
        <li><a href="#haut" data-sans-transition>${c.t('commun.retourHaut')}</a></li>
      </ul>
    </div>
  </div>
  <div class="conteneur pied-bas"><p>${c.t('commun.maquette')}</p><p>${c.t('commun.mentionIaPied')}</p><p>${c.t('commun.mentionsLegales')} · ${c.t('commun.confidentialite')}</p><p>© ${c.site.nom}</p></div>
</footer>`;
}

function barre(c) {
  const a = c.site.actionEntete;
  return html`<div data-barre-fixe>
  <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')}</a>
  <a class="bouton" href="${c.url(a.page, a.ancre || '')}" data-libelle="${c.libelle(a.page)}">${c.t('commun.actionEntete')}</a>
</div>`;
}

/* Voile « cloche » (assiette de la v5) : le dôme monte du clic à la couleur de l'heure d'arrivée, avec ses chiffres. */
const FORMES_VOILE = ['glisse', 'iris', 'vague', 'rideau', 'cloche'];
function voile(c) {
  const forme = FORMES_VOILE.includes(c.site.formeVoile) ? c.site.formeVoile : 'glisse';
  const H = HEURES[c.page.cle] || HEURES.accueil;
  return html`<script type="application/json" data-reservation-globale>${brut(JSON.stringify(c.donnees.reservation).replace(/<\//g, '<\\/'))}</script>
<div data-voile data-forme="${forme}" aria-hidden="true"><div class="voile-contenu"><span class="voile-logo" aria-hidden="true"></span><p class="voile-heure" data-voile-heure>${H.reelle ? '' : `${H.h}:${H.m}`}</p><span data-voile-libelle>${c.libelle(c.page.cle)}</span><span class="voile-trait" aria-hidden="true"></span></div></div>${c.page.cle === 'la-carte' ? brut(`<script>(function(){var e=document.querySelector('[data-voile-heure]');if(e&&document.documentElement.getAttribute('data-moment')==='soir')e.textContent='20:30';})();</script>`) : ''}`;
}

/* Chiffres de l'intro : de 00 à l'heure de la page (l'heure réelle pour Infos pratiques, posée par site.js). */
const rouleau = (h) => (h === '--' ? ['00', '06', '12', '18', '--'] : h === '00' ? ['00', '06', '12', '18', '00'] : ['00', String(Math.round(+h / 3)).padStart(2, '0'), String(Math.round(+h * 2 / 3)).padStart(2, '0'), String(+h - 1).padStart(2, '0'), h]);

export function page(c, contenu) {
  const H = HEURES[c.page.cle] || HEURES.accueil;
  return html`<!doctype html>
<html lang="${c.l}" data-v="${c.v}" data-page="${c.page.cle}" data-theme="${c.page.theme || 'jour'}"${c.page.themeAuto ? brut(' data-theme-auto') : ''} style="--voile-page:${H.voile}${c.page.theme === 'nuit' ? ';--ouverture-fond:#120c09;--ouverture-texte:#f6efe2' : ''}">
${tete(c)}
<body id="haut">
${voile(c)}
<div class="ouverture-panneau" data-ouverture aria-hidden="true">
  <p class="ouverture-objet" data-ouverture-objet><span class="ouverture-logo"></span></p>
  <p class="ouverture-nom">${c.site.nom}</p>
  <p class="ouverture-ligne">${c.t('commun.introLigne')}</p>
</div>
<a class="evitement" href="#contenu">${c.t('commun.evitement')}</a>
${entete(c)}
<main id="contenu" tabindex="-1"${c.page.sansAction ? brut(' data-sans-action') : ''}${c.page.sansEffet ? brut(' data-sans-effet') : ''}>
${contenu}
</main>
${pied(c)}
${barre(c)}
</body>
</html>`;
}
