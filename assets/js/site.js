/* Les Jardins de l'Hacienda · effets du projet. Le socle gère l'ouverture, le voile « cloche », l'en-tête, le menu,
   le mode calme, les boucles et la bibliothèque d'effets ; les modules de la bibliothèque (dossier modules/) sont
   chargés ici, page par page, et réglés sans être réécrits. Effets propres (data-effet) : plateau, signature, braises,
   decompte, carton, plume, numero (et ceux des modules : vapeur, carrousel…). */
import { demarrer, boucle, etat, versObjet, quand, aller } from './socle/index.js?v=1';

const gsap = window.gsap;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Modules de la bibliothèque : chemins écrits en clair pour que le générateur leur applique le numéro de version. */
const MODULES = {
  'plat-fumant': () => import('./modules/plat-fumant/module.js?v=1'),
  'objet-a-faire-tourner': () => import('./modules/objet-a-faire-tourner/module.js?v=1'),
  'assiette-qui-se-dresse': () => import('./modules/assiette-qui-se-dresse/module.js?v=1'),
  'carrousel-3d': () => import('./modules/carrousel-3d/module.js?v=1'),
  'ardoise-a-la-craie': () => import('./modules/ardoise-a-la-craie/module.js?v=1'),
  'carte-du-restaurant': () => import('./modules/carte-du-restaurant/module.js?v=1'),
  'accords-mets-et-vins': () => import('./modules/accords-mets-et-vins/module.js?v=1'),
  'horaires-ouvert-maintenant': () => import('./modules/horaires-ouvert-maintenant/module.js?v=1'),
  'plan-de-salle': () => import('./modules/plan-de-salle/module.js?v=1'),
  'reservation-de-table': () => import('./modules/reservation-de-table/module.js?v=1'),
  'carte-cadeau-qui-se-compose': () => import('./modules/carte-cadeau-qui-se-compose/module.js?v=1'),
};
/* Réglages des modules pour ce client (options d'init, jamais le code des modules). */
const OPTIONS = {
  'plat-fumant': { densite: 0.9, hauteur: 0.55, vitesse: 0.85, intensite: 0.95, qualite: 0.35 },
  'objet-a-faire-tourner': { repos: 0.22, defilement: 0.004, amorti: 1.2 },
  /* Test « vrai visiteur » (la scène retenait 4 défilements) et fluidité : épinglage raccourci. */
  'assiette-qui-se-dresse': { longueur: 1.4 },
  /* Fluidité (audit, processeur ralenti 4 fois) : rotation au défilement réduite, sans retard. */
  'carrousel-3d': { tour: 90, lissage: 0 },
  'accords-mets-et-vins': { textes: { avec: 'Avec', signature: "Le vin de l'accord", groupe: 'Les plats du menu' } },
  'plan-de-salle': { reservation: '/reserver#formulaire', couverts: 2, textes: { choix: '{nom} · {zone} · {places} places. ' } },
  'carte-cadeau-qui-se-compose': { cachet: 'JH', min: 25, max: 200, textes: {
    statut: 'Carte prête\u00a0: {quoi}{pourQui}, total {total}. Valable 6 mois, à présenter à l’arrivée\u00a0; le restaurant vous dit comment la recevoir (mode de remise à confirmer). {simule}',
  } },
};
const apis = {};

async function chargerModules() {
  for (const el of $$('[data-module]')) {
    const nom = el.dataset.module;
    if (!MODULES[nom] || nom === 'fil-conducteur') continue;
    try {
      const { init } = await MODULES[nom]();
      apis[nom] = await init(el, OPTIONS[nom] || {});
      /* Accords : la liste devient un groupe de boutons radio (role="radiogroup") ; ses <li> ne sont plus des
         éléments de liste pour les lecteurs d'écran (axe « listitem »). */
      if (nom === 'accords-mets-et-vins') for (const li of el.querySelectorAll('.ame__liste > li')) li.setAttribute('role', 'none');
      /* Le bouton radio transparent couvre toute la fiche du plat (choix d'un clic) : superposition voulue. */
      if (nom === 'accords-mets-et-vins') for (const r of el.querySelectorAll('.ame__radio')) r.setAttribute('data-superpose', '');
    } catch (e) { console.warn('module', nom, e); }
  }
  plateau();
  envolCarton();
  filtresLiens();
  confirmationsVisibles();
  statutAccueil();
}

/* Lien « Un plat végétarien ? » de l'ardoise : la carte se filtre (API du module carte-du-restaurant). */
function filtresLiens() {
  const api = apis['carte-du-restaurant'];
  for (const a of $$('[data-filtre-lien]')) {
    a.addEventListener('click', (e) => {
      if (!api || !api.filtrer) return;
      e.preventDefault(); e.stopPropagation();
      history.pushState(null, '', a.getAttribute('href'));
      api.filtrer([a.dataset.filtreLien]);
      /* Test « vrai visiteur » : le premier plat filtré (nom et prix) arrive en haut, sous l'en-tête et la barre collée. */
      /* Après le ScrollTrigger.refresh() que déclenche la carte raccourcie (il remettrait la page où elle était). */
      setTimeout(() => {
        const plat = $('.carte-resto__plat:not([hidden])'); if (!plat) return;
        const eh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--entete-h')) || 0;
        const barre = $('.carte-resto__barre'), bh = barre ? barre.offsetHeight : 0;
        const y = plat.getBoundingClientRect().top + scrollY - eh - bh - 16;
        aller(Math.max(0, y));
      }, 450);
    });
  }
  const f = new URLSearchParams(location.search).get('filtre');
  if (f && api && api.filtrer) api.filtrer([f]);
}

/* Ficelle de cuisine (module fil-conducteur) : construite après l'ouverture, jamais pendant l'intro. */
function ficelle() {
  const main = $('main');
  if (!main || !$('[data-fil]', main)) return;
  quand('pret', async () => {
    try {
      const { init } = await import('./modules/fil-conducteur/module.js?v=1');
      main.dataset.module = 'fil-conducteur';
      await init(main, { onde: 8, boucle: 30, regard: 0.6, rail: false, lissage: 0 });
    } catch (e) { console.warn('fil', e); }
  });
}

/* Plateau du chef : la rubrique qui passe devant (en bas du plateau) s'allume dans la liste. */
function plateau() {
  const oat = $('.plateau__objet'), api = apis['objet-a-faire-tourner'];
  if (!oat || !api || !api.etat) return;
  const lignes = $$('.plateau__rubrique');
  let avant = -1, compte = 0;
  const maj = () => {
    const a = (api.etat.angle * 180) / Math.PI;
    let meilleur = 0, ecart = 999;
    for (let q = 0; q < 4; q++) {
      const pos = (((q * 90 + a) % 360) + 360) % 360;
      const d = Math.abs(pos - 180);
      if (d < ecart) { ecart = d; meilleur = q; }
    }
    if (meilleur !== avant) { avant = meilleur; lignes.forEach((l, i) => l.classList.toggle('est-devant', i === meilleur)); }
  };
  maj();
  if (etat.calme) return;
  boucle(oat, () => { if (++compte % 6 === 0) maj(); });
}

/* Signature du chef : le nom s'écrit à la main (découpe qui s'ouvre) quand la section arrive. */
function signature() {
  const nom = $('.chef__nom');
  if (!nom || !gsap || !window.ScrollTrigger) return;
  if (etat.calme) { nom.style.setProperty('--signature-reste', '0%'); return; }
  gsap.fromTo(nom, { '--signature-reste': '102%' }, { '--signature-reste': '0%', ease: 'none',
    scrollTrigger: { trigger: '.chef', start: 'top 85%', end: 'top 25%', scrub: 0.6 } });
}

/* Braises qui montent au-dessus de la salle (canvas léger, seulement à l'écran). */
function braises() {
  const cv = $('.cheminee__braises');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const n = matchMedia('(max-width: 760px)').matches ? 18 : 30;
  const p = Array.from({ length: n }, (_, i) => ({ x: Math.random() * 480, y: 320 - Math.random() * 320, v: 14 + Math.random() * 26, r: .8 + Math.random() * 1.8, o: Math.random() * 6.28 }));
  const dessiner = (t, dt) => {
    ctx.clearRect(0, 0, 480, 320);
    for (const b of p) {
      b.y -= (b.v * dt) / 1000; b.x += Math.sin(t / 700 + b.o) * 0.25;
      if (b.y < -6) { b.y = 326; b.x = Math.random() * 480; }
      const a = Math.max(0, Math.min(1, b.y / 320));
      ctx.fillStyle = `rgba(255, ${140 + Math.round(70 * a)}, 70, ${(0.15 + 0.75 * a).toFixed(2)})`;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.283); ctx.fill();
    }
  };
  dessiner(0, 0);
  boucle(cv, (dt, t) => dessiner(t * 1000, dt * 1000));
}

/* Comptes à rebours des fêtes : jours restants à l'heure de Paris, le chiffre défile à l'arrivée. */
function joursAvant(iso) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  const auj = Date.UTC(+p.year, +p.month - 1, +p.day);
  const [a, m, j] = iso.split('-').map(Number);
  return Math.round((Date.UTC(a, m - 1, j) - auj) / 86400000);
}
function decomptes() {
  for (const el of $$('[data-effet="decompte"]')) {
    const n = joursAvant(el.dataset.cible), cible = $('[data-jours]', el);
    if (!cible) continue;
    if (n < 0) { el.textContent = el.dataset.passe || 'A eu lieu'; continue; }
    if (n === 0) { el.textContent = el.dataset.aujourdhui || "Aujourd'hui"; continue; }
    if (etat.calme || !gsap || !window.ScrollTrigger) { cible.textContent = n; continue; }
    const o = { v: 0 };
    cible.textContent = '0';
    gsap.to(o, { v: n, duration: 1.4, ease: 'power2.out', onUpdate: () => { cible.textContent = Math.round(o.v); },
      scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    gsap.fromTo(el, { '--decompte': 0 }, { '--decompte': 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'bottom 30%', scrub: true } });
  }
}

/* Réserver : à l'arrivée avec une table choisie sur le plan, le carton de la table file jusqu'au récapitulatif. */
/* Test « vrai visiteur » : la confirmation (réservation, carte cadeau) est amenée à l'écran, sous l'en-tête. */
function amenerDansEcran(el, haut = false) {
  if (!el) return;
  const eh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--entete-h')) || 0;
  const bas = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--barres-h')) || 0;
  const r = el.getBoundingClientRect();
  let dy = 0;
  if (haut || r.top < eh + 12) dy = r.top - eh - 16;
  else if (r.bottom > innerHeight - bas - 12) dy = Math.min(r.bottom - (innerHeight - bas - 16), r.top - eh - 16);
  if (Math.abs(dy) > 4) aller(scrollY + dy);
}
function confirmationsVisibles() {
  const resa = $('[data-module="reservation-de-table"]');
  if (resa) resa.addEventListener('reservation:envoyee', () => setTimeout(() => amenerDansEcran($('[data-resa-recap]', resa), true), 450));
  const ccq = $('[data-module="carte-cadeau-qui-se-compose"]');
  const statut = ccq && $('[data-ccq-statut]', ccq);
  if (statut) {
    let attendu = false;
    ccq.addEventListener('ccq:valide', () => { attendu = true; });
    /* Le message arrive quand le cachet est posé : on l'amène à l'écran à ce moment-là. */
    new MutationObserver(() => {
      if (!attendu || statut.hidden || !statut.textContent.trim()) return;
      /* Après le ScrollTrigger.refresh() que déclenche la nouvelle hauteur (il remettrait la page où elle était). */
      attendu = false; setTimeout(() => amenerDansEcran(statut), 450);
    }).observe(statut, { attributes: true, childList: true, characterData: true, subtree: true });
  }
}

/* Accueil : « ouvert maintenant » calculé avec le module horaires (mêmes données que la page Infos pratiques). */
async function statutAccueil() {
  const lien = $('[data-statut-accueil]'), src = $('[data-horaires-accueil]');
  if (!lien || !src) return;
  try {
    const H = await import('./modules/horaires-ouvert-maintenant/horaires-calcul.js?v=1');
    const d = H.preparer(JSON.parse(src.textContent));
    const a = d.adresses[0];
    const maj = () => { const st = H.statut(a, H.maintenant(a.fuseau)); lien.textContent = st.texte; lien.dataset.etat = st.etat; };
    maj(); setInterval(maj, 60000);
  } catch (e) { console.warn('statut', e); }
}

async function envolCarton() {
  const recap = $('[data-resa-recap]'), plan = $('[data-module="plan-de-salle"]');
  const table = new URLSearchParams(location.search).get('table');
  if (!recap || !plan || !table || etat.calme) return;
  quand('pret', async () => {
    try {
      const { envol } = await import('./modules/envol-vers-le-panier/module.js?v=1');
      const depuis = $('.pds__repere', plan) || $(`[data-table="${CSS.escape(table)}"]`, plan) || $('.carton', document);
      if (!depuis) return;
      setTimeout(() => envol({ depuis, vers: recap, forme: 'carte' }), 900);
    } catch (e) { console.warn('envol', e); }
  });
}

/* Plume dorée : le titre du menu s'écrit à l'encre (fêtes), le numéro s'imprime chiffre à chiffre (infos). */
function ecritures() {
  if (!gsap || !window.ScrollTrigger) return;
  for (const el of $$('[data-effet="plume"], [data-effet="numero"], [data-effet="carton"]')) {
    if (etat.calme) { el.style.setProperty('--ecrit', '0%'); continue; }
    gsap.fromTo(el, { '--ecrit': '101%' }, { '--ecrit': '0%', duration: el.dataset.effet === 'numero' ? 0.8 : 1.3, ease: el.dataset.effet === 'numero' ? 'steps(14)' : 'power2.inOut', delay: 0.15,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  }
}

/* Boost « plateau en vraie 3D » : le plateau bascule de 52° à 16° pendant qu'il arrive. */
function plateau3d() {
  const objet = $('.plateau__objet > .oat__objet');
  if (!objet || !gsap || !window.ScrollTrigger || etat.calme) return;
  gsap.fromTo(objet, { '--incl': '54deg' }, { '--incl': '16deg', ease: 'none', scrollTrigger: { trigger: '.plateau', start: 'top 90%', end: 'center 55%', scrub: 0.5 } });
}

/* Boost « titre dans la vapeur » : le titre est découpé en lettres (mots insécables, même hauteur), puis chaque
   lettre se condense depuis la vapeur, de la droite (le plat) vers la gauche. */
let lettresTitre = [];
function preparerTitre() {
  const h = $('.ouv-accueil__titre');
  if (!h || h.dataset.decoupe) return;
  h.dataset.decoupe = '1';
  const mots = h.textContent.split(/(\s+)/);
  h.setAttribute('aria-label', h.textContent.trim());
  h.textContent = '';
  for (const m of mots) {
    if (/^\s+$/.test(m)) { h.append(' '); continue; }
    const mot = document.createElement('span'); mot.className = 'mot'; mot.setAttribute('aria-hidden', 'true');
    for (const ch of m) { const l = document.createElement('span'); l.className = 'lettre'; l.textContent = ch; mot.append(l); }
    h.append(mot);
  }
  lettresTitre = $$('.lettre', h);
}
/* Une fois formé, le titre redevient un texte simple (lettres découpées retirées : lecture, sélection, mesures). */
function defaireTitre() {
  const h = $('.ouv-accueil__titre');
  if (!h || !h.dataset.decoupe || !h.getAttribute('aria-label')) return;
  h.textContent = h.getAttribute('aria-label'); h.removeAttribute('aria-label'); delete h.dataset.decoupe; lettresTitre = [];
}
function formerTitre(delai = 0) {
  const h = $('.ouv-accueil__titre');
  if (!h) return;
  if (!gsap || etat.calme || !lettresTitre.length) { h.classList.add('est-forme', 'vu'); defaireTitre(); return; }
  gsap.set(lettresTitre, { opacity: 0, y: 22, scaleY: 1.3, textShadow: '0 -10px 22px rgba(243,231,211,.95)' });
  h.classList.add('est-forme', 'vu');
  gsap.to(lettresTitre, { opacity: 1, y: 0, scaleY: 1, textShadow: '0 0 0px rgba(243,231,211,0)', duration: 0.95, ease: 'power2.out', delay: delai, stagger: { each: 0.035, from: 'end' },
    onComplete: () => { gsap.set(lettresTitre, { clearProps: 'transform,opacity,textShadow' }); defaireTitre(); } });
}

demarrer({
  preparer() {
    preparerTitre();
    plateau3d();
    signature();
    braises();
    decomptes();
    ecritures();
    ficelle();
    chargerModules();
  },
  /* Intro (environ 2 s) : la cloche, le nom qui s'écrit, un fil de vapeur ; puis la cloche rejoint l'objet
     d'ouverture de la page ([data-iris-centre] : le plat fumant sur l'accueil) et l'écran s'ouvre depuis lui. */
  jouer() {
    if (!gsap) return null;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    /* La cloche et le nom sont visibles dès la première image (style critique) : rien n'est caché puis remontré. */
    tl.fromTo('.ouverture-trait', { scaleX: 0 }, { scaleX: 1, duration: 0.6 }, 0.1)
      .fromTo('.ouverture-vapeur', { scaleY: 0, opacity: 0.9 }, { scaleY: 1, opacity: 0, duration: 1.1, ease: 'sine.out' }, 0.15)
      .to('.ouverture-nom, .ouverture-ligne, .ouverture-trait', { opacity: 0, duration: 0.3 }, 0.95);
    versObjet(tl, { a: 1.0 });
    /* Le titre se forme pendant que l'écran s'ouvre, hors de la timeline (elle ne s'allonge pas). */
    tl.call(() => formerTitre(0), null, 1.45);
    return tl;
  },
  arrivee() { formerTitre(0.15); },
  etatFinal() {
    const h = $('.ouv-accueil__titre'); if (h) { h.classList.add('est-forme', 'vu'); if (gsap && lettresTitre.length) gsap.set(lettresTitre, { clearProps: 'transform,opacity,textShadow' }); defaireTitre(); }
    for (const el of $$('[data-effet="plume"], [data-effet="numero"], [data-effet="carton"]')) el.style.setProperty('--ecrit', '0%');
    const nom = $('.chef__nom'); if (nom) nom.style.setProperty('--signature-reste', '0%');
  },
});
