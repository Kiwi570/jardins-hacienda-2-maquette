/* Les Jardins de l'Hacienda · effets du projet. Le socle gère l'ouverture, le voile « cloche », l'en-tête, le menu,
   le mode calme, les boucles et la bibliothèque d'effets ; les modules de la bibliothèque (dossier modules/) sont
   chargés ici, page par page, et réglés sans être réécrits. Effets propres (data-effet) : plateau, signature, braises,
   decompte, carton, plume, numero (et ceux des modules : vapeur, carrousel…). */
import { demarrer, boucle, etat, versObjet, quand, aller } from './socle/index.js?v=5';

const gsap = window.gsap;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Modules de la bibliothèque : chemins écrits en clair pour que le générateur leur applique le numéro de version. */
const MODULES = {
  'plat-fumant': () => import('./modules/plat-fumant/module.js?v=5'),
  'objet-a-faire-tourner': () => import('./modules/objet-a-faire-tourner/module.js?v=5'),
  'assiette-qui-se-dresse': () => import('./modules/assiette-qui-se-dresse/module.js?v=5'),
  'carrousel-3d': () => import('./modules/carrousel-3d/module.js?v=5'),
  'ardoise-a-la-craie': () => import('./modules/ardoise-a-la-craie/module.js?v=5'),
  'carte-du-restaurant': () => import('./modules/carte-du-restaurant/module.js?v=5'),
  'accords-mets-et-vins': () => import('./modules/accords-mets-et-vins/module.js?v=5'),
  'horaires-ouvert-maintenant': () => import('./modules/horaires-ouvert-maintenant/module.js?v=5'),
  'plan-de-salle': () => import('./modules/plan-de-salle/module.js?v=5'),
  'reservation-de-table': () => import('./modules/reservation-de-table/module.js?v=5'),
  'carte-cadeau-qui-se-compose': () => import('./modules/carte-cadeau-qui-se-compose/module.js?v=5'),
};
/* Réglages des modules pour ce client (options d'init, jamais le code des modules). */
const OPTIONS = {
  'plat-fumant': { densite: 0.7, hauteur: 0.55, vitesse: 0.85, intensite: 1, qualite: 0.3 },
  'objet-a-faire-tourner': { repos: 0.22, defilement: 0.004, amorti: 1.2, lumiere: 'aucune' },
  /* Test « vrai visiteur » (la scène retenait 4 défilements) et fluidité : épinglage raccourci. */
  'assiette-qui-se-dresse': { longueur: 0.85 },
  /* v2 : l'ardoise s'écrit deux fois plus vite (le visiteur attendait les prix environ 4 s). */
  'ardoise-a-la-craie': { vitesse: 3 },
  /* Fluidité (audit, processeur ralenti 4 fois) : rotation au défilement réduite, sans retard. */
  'carrousel-3d': { tour: 72, lissage: 0, face: 75, inclinaison: -3 },
  'accords-mets-et-vins': { textes: { avec: 'Avec', signature: "Le vin de l'accord", groupe: 'Les plats du menu' } },
  'plan-de-salle': { reservation: '/reserver#formulaire', couverts: 2, textes: { choix: '{nom} · {zone} · {places} places. ', prise: 'Indisponible (simulation)' } },
  'carte-cadeau-qui-se-compose': { cachet: 'JH', min: 25, max: 200, textes: {
    pourQui: ', à remettre à {pour}',
    statut: 'Carte prête{pourQui}\u00a0: {quoi}, total {total}. Valable 6 mois\u00a0; pour la recevoir, appelez-nous au 06\u00a018\u00a021\u00a028\u00a010. {simule}',
  } },
};
const apis = {};

/* Soirées d'exception (Saint-Sylvestre : jeudi 31 décembre au soir). Le module ne connaît que des fermetures par jour de la
   semaine (M27) : le service fermé ce jour-là s'ouvre dans les réglages, et ses autres dates restent sans créneau libre
   (« complet »), sauf les dates d'exception. Sans exception déclarée, les réglages du JSON sont gardés tels quels. */
function reglagesResa(el) {
  let R = null; try { R = JSON.parse(el.querySelector('script[data-reservation]')?.textContent || 'null'); } catch {}
  const ex = (R && R.ouvertures_exceptionnelles) || [];
  if (!ex.length) return {};
  const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const jour = (iso) => JOURS[new Date(iso + 'T12:00:00Z').getUTCDay()];
  const F = R.fermetures || {}, S = { ...(F.services || {}) }, rouverts = [];
  for (const e of ex) { const j = jour(e.date); if ((S[j] || []).includes(e.service)) { S[j] = S[j].filter((x) => x !== e.service); rouverts.push([j, e.service]); } }
  const serviceDe = (t) => { const m = +t.slice(0, 2) * 60 + +t.slice(3, 5); return Object.entries(R.services || {}).find(([, v]) => { const d = +v.debut.slice(0, 2) * 60 + +v.debut.slice(3, 5), f = +v.fin.slice(0, 2) * 60 + +v.fin.slice(3, 5); return m >= d && m <= f; })?.[0]; };
  return {
    reglages: { ...R, fermetures: { ...F, services: S } },
    complet: (iso, t) => { const sv = serviceDe(t); return rouverts.some(([j, s2]) => j === jour(iso) && s2 === sv) && !ex.some((e) => e.date === iso && e.service === sv); },
  };
}

async function chargerModules() {
  for (const el of $$('[data-module]')) {
    const nom = el.dataset.module;
    if (!MODULES[nom] || nom === 'fil-conducteur') continue;
    try {
      const { init } = await MODULES[nom]();
      apis[nom] = await init(el, nom === 'reservation-de-table' ? { ...(OPTIONS[nom] || {}), ...reglagesResa(el) } : (OPTIONS[nom] || {}));
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
  libellesReservation();
  statutAccueil();
  reancrer();
}

/* v5 : arrivée par un lien vers une section (« Réceptions » → /#recevoir) : les modules ajoutent ensuite leurs
   épinglages (la table qui se dresse), qui poussent la section plus bas ; si le visiteur n'a pas encore bougé,
   la section est ramenée sous l'en-tête, après le recalcul des positions. */
let geste = false;
['wheel', 'touchmove', 'keydown'].forEach((t) => addEventListener(t, () => { if (performance.now() > 4000) geste = true; }, { passive: true }));
function reancrer() {
  if (!location.hash || location.hash.length < 2) return;
  let cible = null; try { cible = document.querySelector(decodeURIComponent(location.hash)); } catch {}
  if (!cible) return;
  const remettre = () => {
    if (geste) return;
    window.ScrollTrigger?.refresh();
    const eh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--entete-h')) || 0;
    if (Math.abs(cible.getBoundingClientRect().top - eh - 12) > 24) aller(cible, { instant: true });
  };
  setTimeout(remettre, 300); setTimeout(remettre, 1200);
}

/* Lien « Un plat végétarien ? » de l'ardoise : la carte se filtre (API du module carte-du-restaurant). */
/* v4 (famille recomposition) : quand on filtre la carte, les plats restants glissent à leur nouvelle place (FLIP)
   et ceux qui reviennent apparaissent ; les positions sont relevées juste avant le filtre du module. */
function recompositionCarte() {
  const carte = $('.carte-resto'); if (!carte || !gsap || etat.calme) return () => {};
  const plats = $$('.carte-resto__plat', carte);
  let avant = null;
  const relever = () => { avant = new Map(plats.filter((p) => !p.hidden).map((p) => [p, p.getBoundingClientRect()])); };
  const jouer = () => requestAnimationFrame(() => {
    if (!avant) return;
    for (const p of plats) {
      if (p.hidden) continue;
      const b = p.getBoundingClientRect(), a = avant.get(p);
      if (a) gsap.fromTo(p, { x: a.left - b.left, y: Math.max(-240, Math.min(240, a.top - b.top)) }, { x: 0, y: 0, duration: 0.55, ease: 'power3.out', clearProps: 'transform' });
      else gsap.fromTo(p, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'power2.out', clearProps: 'transform,opacity,visibility' });
    }
    avant = null;
  });
  const barre = $('.carte-resto__barre', carte);
  if (barre) { barre.addEventListener('click', (e) => { if (e.target.closest('[data-filtre], [data-tout-afficher]')) { relever(); setTimeout(jouer, 0); } }, true); }
  carte.dataset.effet = carte.dataset.effet || 'recomposition';
  return () => { relever(); setTimeout(jouer, 0); };
}

function filtresLiens() {
  const api = apis['carte-du-restaurant'];
  const avantFiltre = recompositionCarte();
  for (const a of $$('[data-filtre-lien]')) {
    a.addEventListener('click', (e) => {
      if (!api || !api.filtrer) return;
      e.preventDefault(); e.stopPropagation();
      history.pushState(null, '', a.getAttribute('href'));
      avantFiltre();
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
      const { init } = await import('./modules/fil-conducteur/module.js?v=5');
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
  const cv = $('[data-effet="braises"]');
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
    /* Le nombre de jours est écrit d'emblée (jamais « Dans 0 jours » sur une capture ou pour un lecteur pressé). */
    cible.textContent = n;
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
/* v5 : libellés du module de réservation accordés au site (le module les écrit en dur, M28) :
   « À compléter » devient une consigne, « Demande enregistrée » s'accorde avec la carte « Réservé »,
   et les soirs fermés rouverts pour une date d'exception (M27) disent « fermé » et non « complet ». */
function libellesReservation() {
  const resa = $('[data-module="reservation-de-table"]'); if (!resa) return;
  const form = $('[data-resa-form]', resa);
  let R = null; try { R = JSON.parse($('script[data-reservation]', resa)?.textContent || 'null'); } catch {}
  const ex = (R && R.ouvertures_exceptionnelles) || [];
  const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const fermesHebdo = ex.map((e) => [JOURS[new Date(e.date + 'T12:00:00Z').getUTCDay()], e.service]);
  const estFerme = (iso, sv) => !!iso && fermesHebdo.some(([j, s2]) => s2 === sv && j === JOURS[new Date(iso + 'T12:00:00Z').getUTCDay()]) && !ex.some((e) => e.date === iso && e.service === sv);
  const corriger = () => {
    for (const t of $$('.resa__recap-titre', resa)) if (t.textContent.trim() === 'À compléter') t.textContent = 'Choisissez le jour et l’heure';
    for (const t of $$('.resa__recap-sur', resa)) if (t.textContent.trim() === 'Demande enregistrée') t.textContent = 'Votre table est réservée';
    if (!form) return;
    const iso = form.elements.date?.value;
    for (const r of $$('[name="service"]', form)) {
      const note = r.closest('label')?.querySelector('[data-note]');
      if (note && note.textContent === 'complet' && estFerme(iso, r.value)) note.textContent = 'fermé';
    }
    const sv = $('[name="service"]:checked', form)?.value;
    if (estFerme(iso, sv)) for (const sm of $$('.resa__creneau small', form)) if (sm.textContent === 'complet') sm.textContent = 'fermé';
  };
  let attente = 0;
  new MutationObserver(() => { cancelAnimationFrame(attente); attente = requestAnimationFrame(corriger); }).observe(resa, { childList: true, subtree: true, characterData: true });
  corriger();
}

function confirmationsVisibles() {
  const resa = $('[data-module="reservation-de-table"]');
  if (resa) resa.addEventListener('reservation:envoyee', () => setTimeout(() => {
    /* v5 : la confirmation (carton sous la cloche) arrive au milieu de l'écran, jamais sous l'en-tête. */
    const el = $('[data-resa-recap]', resa); if (!el) return;
    const eh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--entete-h')) || 0, r = el.getBoundingClientRect();
    const libre = innerHeight - eh, dy = r.height < libre - 32 ? r.top - eh - (libre - r.height) / 2 : r.top - eh - 16;
    if (Math.abs(dy) > 4) aller(scrollY + dy);
  }, 450));
  /* v3 (regard neuf) : après « Vérifier », le premier champ manquant est amené à l'écran avec son message
     (le scrollIntoView du module est annulé par le défilement adouci du projet, voir M15). */
  const form = resa && $('[data-resa-form]', resa);
  if (form) {
    let envoi = 0, minuteur = 0;
    form.addEventListener('submit', () => { envoi = Date.now(); }, true);
    new MutationObserver(() => {
      if (Date.now() - envoi > 1200) return;
      clearTimeout(minuteur);
      minuteur = setTimeout(() => {
        const el = $('[aria-invalid="true"]', form); if (!el) return;
        const bloc = el.closest('fieldset, .resa__champ') || el, r = bloc.getBoundingClientRect();
        if (r.top > 90 && r.bottom < innerHeight - 90) return;
        aller(Math.max(0, scrollY + r.top - innerHeight / 3));
      }, 250);
    }).observe(form, { attributes: true, attributeFilter: ['aria-invalid'], subtree: true });
  }
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
    const H = await import('./modules/horaires-ouvert-maintenant/horaires-calcul.js?v=5');
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
      const { envol } = await import('./modules/envol-vers-le-panier/module.js?v=5');
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

/* ---------- v4 « Deux saisons, une maison » ---------- */
/* Saison : html[data-saison] (décidée avant l'affichage par le script critique), cadran braise et soleil à faire glisser
   avec élan, boutons Hiver et Été, interrupteur de l'en-tête ; choix gardé dans le navigateur. */
const SAISONS = ['hiver', 'ete'];
function poserSaison(s, { garder = true } = {}) {
  if (!SAISONS.includes(s)) return;
  /* Les photos de l'autre saison sont retirées du rendu après le fondu (la vapeur WebGL de l'hiver s'arrête l'été) ;
     celles de la saison choisie reviennent avant le fondu. */
  const photos = $$('[data-saison-photo]');
  let revenu = false;
  for (const el of photos) if (el.dataset.saisonPhoto === s && el.hidden) { el.hidden = false; revenu = true; }
  if (revenu) void document.body.offsetWidth;
  clearTimeout(poserSaison.t);
  poserSaison.t = setTimeout(() => { for (const el of photos) if (el.dataset.saisonPhoto !== document.documentElement.getAttribute('data-saison')) el.hidden = true; }, 1000);
  /* v5 : la bascule voulue par le visiteur part de son geste, en vague de lumière (soleil l'été, braise l'hiver). */
  const avant = document.documentElement.getAttribute('data-saison');
  if (garder && avant && avant !== s && !etat.calme) {
    const v = document.createElement('div'); v.className = 'vague-saison'; v.setAttribute('aria-hidden', 'true');
    v.style.setProperty('--x', (dernierGeste.x ?? innerWidth / 2) + 'px'); v.style.setProperty('--y', (dernierGeste.y ?? innerHeight / 2) + 'px');
    v.style.setProperty('--teinte', s === 'ete' ? 'rgba(255, 236, 170, .9)' : 'rgba(232, 110, 50, .85)');
    document.body.append(v); setTimeout(() => v.remove(), 1100);
  }
  document.documentElement.setAttribute('data-saison', s);
  if (garder) { try { localStorage.setItem('jh-saison', s); } catch {} }
  for (const b of $$('[data-saison-choix]')) b.setAttribute('aria-pressed', String(b.dataset.saisonChoix === s));
  for (const b of $$('[data-saison-bascule]')) { b.setAttribute('aria-pressed', String(s === 'ete')); b.setAttribute('aria-label', s === 'ete' ? 'Passer à l’hiver' : 'Passer à l’été'); }
  for (const el of $$('[data-saison-photo]')) el.style.removeProperty('opacity');
  placerCurseur(s === 'ete' ? 1 : 0);
  window.dispatchEvent(new CustomEvent('saison', { detail: s }));
}
let placerCurseur = () => {};
const dernierGeste = {};
addEventListener('pointerdown', (e) => { dernierGeste.x = e.clientX; dernierGeste.y = e.clientY; }, { capture: true, passive: true });
function saisons() {
  const s0 = document.documentElement.getAttribute('data-saison') || 'hiver';
  for (const b of $$('[data-saison-choix]')) b.addEventListener('click', () => poserSaison(b.dataset.saisonChoix));
  for (const b of $$('[data-saison-bascule]')) b.addEventListener('click', () => poserSaison(document.documentElement.getAttribute('data-saison') === 'ete' ? 'hiver' : 'ete'));
  const cadran = $('.cadran-saison'), svg = cadran && $('svg', cadran), curseur = cadran && $('[data-cadran-curseur]', cadran);
  if (svg && curseur) {
    /* Le curseur glisse sur l'arc (0 : braise, 1 : soleil) ; pendant le geste, les deux photos se fondent. */
    let p = s0 === 'ete' ? 1 : 0;
    placerCurseur = (x) => { p = Math.max(0, Math.min(1, x)); const a = Math.PI * (1 - p); curseur.setAttribute('transform', `translate(${120 + 100 * Math.cos(a)} ${120 - 100 * Math.sin(a)})`); cadran.style.setProperty('--p', p.toFixed(3)); };
    placerCurseur(p);
    const fondre = (x) => { for (const el of $$('[data-saison-photo]')) { el.hidden = false; el.style.visibility = 'visible'; el.style.opacity = String(el.dataset.saisonPhoto === 'ete' ? x : 1 - x); } };
    let actif = false, dernier = 0, vitesse = 0, tPrec = 0;
    const lire = (e) => { const r = svg.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width * 240 - 120, y = (e.clientY - r.top) / r.height * 132 - 120; return 1 - Math.atan2(-y, x) / Math.PI; };
    svg.addEventListener('pointerdown', (e) => { actif = true; svg.setPointerCapture(e.pointerId); dernier = lire(e); tPrec = performance.now(); vitesse = 0; placerCurseur(dernier); fondre(p); });
    svg.addEventListener('pointermove', (e) => { if (!actif) return; const x = lire(e), t = performance.now(); vitesse = (x - dernier) / Math.max(1, t - tPrec) * 1000; dernier = x; tPrec = t; placerCurseur(x); fondre(p); });
    const lacherCurseur = () => {
      if (!actif) return; actif = false;
      /* Élan : un geste vif emporte le curseur jusqu'au bout dans son sens, sinon il rejoint le plus proche. */
      const cible = Math.abs(vitesse) > 1.2 ? (vitesse > 0 ? 1 : 0) : p > 0.5 ? 1 : 0;
      for (const el of $$('[data-saison-photo]')) el.style.removeProperty('visibility');
      if (gsap && !etat.calme) gsap.to({ v: p }, { v: cible, duration: 0.45, ease: 'power3.out', onUpdate() { placerCurseur(this.targets()[0].v); fondre(p); }, onComplete: () => poserSaison(cible ? 'ete' : 'hiver') });
      else poserSaison(cible ? 'ete' : 'hiver');
    };
    svg.addEventListener('pointerup', lacherCurseur); svg.addEventListener('pointercancel', lacherCurseur);
    svg.addEventListener('click', (e) => { if (Math.abs(vitesse) < 0.01 && !actif) poserSaison(lire(e) > 0.5 ? 'ete' : 'hiver'); });
  }
  poserSaison(s0, { garder: false });
  /* Fluidité de la bascule : les photos de l'autre saison (ouverture, plongée) se chargent et se décodent au repos,
     pour que le fondu ne décode rien au moment du geste. */
  const prechargeur = () => { for (const img of $$('.ouv-saisons [data-saison-photo] img, .table__plongee [data-saison-photo] img')) { img.loading = 'eager'; img.decode?.().catch(() => {}); } };
  quand('pret', () => ('requestIdleCallback' in window ? requestIdleCallback(prechargeur, { timeout: 4000 }) : setTimeout(prechargeur, 2500)));
}

/* La table qui s'agrandit (famille recomposition) : 2, 12, 40 ou 120 invités ; la table s'allonge, les chaises se comptent,
   la grille de photos se recompose et l'espace qui convient s'affiche. Le lien préremplit la demande de réception. */
function tableAgrandit() {
  const z = $('[data-effet="table-agrandit"]'); if (!z) return;
  const paliers = $('input[type="range"]', z).dataset.paliers.split(',').map(Number);
  const curseur = $('input[type="range"]', z), sortie = $('[data-invites]', z), chaises = $('[data-chaises]', z), plateauT = $('.recevoir__plateau', z);
  const photos = $$('[data-photo]', z), lien = $('[data-lien-reception]', z);
  const NS = 'http://www.w3.org/2000/svg';
  const montrer = (i, anime = true) => {
    const n = paliers[i];
    curseur.value = String(i); curseur.setAttribute('aria-valuetext', `${n} invités`);
    sortie.textContent = String(n);
    for (const b of $$('[data-palier]', z)) b.setAttribute('aria-pressed', String(+b.dataset.palier === i));
    for (const e of $$('[data-espace]', z)) e.hidden = +e.dataset.espace !== i;
    /* Table : de 2 places (ronde) à une longue table ; une chaise dessinée par place jusqu'à 24, puis « × n ». */
    const l = [90, 300, 440, 480][i], x = 300 - l / 2;
    plateauT.setAttribute('x', String(x)); plateauT.setAttribute('width', String(l)); plateauT.setAttribute('rx', i === 0 ? '30' : '26');
    chaises.replaceChildren();
    const k = Math.min(n, 24), parRang = Math.ceil(k / 2);
    for (let j = 0; j < k; j++) {
      const rang = j < parRang ? 0 : 1, pos = rang ? j - parRang : j, nb = rang ? k - parRang : parRang;
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', String(x + (l * (pos + 0.5)) / nb)); c.setAttribute('cy', rang ? '160' : '60'); c.setAttribute('r', i === 3 ? '9' : '13');
      c.style.setProperty('--d', `${j * 18}ms`); chaises.append(c);
    }
    if (n > 24) { const t = document.createElementNS(NS, 'text'); t.setAttribute('x', '300'); t.setAttribute('y', '206'); t.setAttribute('text-anchor', 'middle'); t.textContent = `${n} couverts`; chaises.append(t); }
    /* Recomposition : la photo du palier passe en grand (FLIP). */
    const avant = photos.map((p) => p.getBoundingClientRect());
    photos.forEach((p) => p.classList.toggle('est-choisie', +p.dataset.photo === i));
    if (anime && gsap && !etat.calme) photos.forEach((p, k2) => {
      const b = p.getBoundingClientRect(), a = avant[k2];
      if (!b.width) return;
      gsap.fromTo(p, { x: a.left - b.left, y: a.top - b.top, scaleX: a.width / b.width, scaleY: a.height / b.height, transformOrigin: '0 0' }, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.6, ease: 'power3.out', clearProps: 'transform' });
    });
    if (lien) lien.href = lien.href.replace(/invites=\d+/, `invites=${n}`);
  };
  curseur.addEventListener('input', () => montrer(+curseur.value));
  for (const b of $$('[data-palier]', z)) b.addEventListener('click', () => montrer(+b.dataset.palier));
  montrer(+curseur.value, false);
}

/* Réserver (v4) : le formulaire d'abord, le plan ensuite et facultatif ; les couverts se règlent une seule fois
   (dans le formulaire : le plan les reprend pour estomper les tables trop petites) ; la table choisie revient au
   formulaire sans changer les couverts ; à la confirmation, une carte de placement se pose sous une cloche. */
function reservationV4() {
  const resa = $('[data-module="reservation-de-table"]'), plan = $('[data-module="plan-de-salle"]');
  if (!resa) return;
  const couvForm = $('[name="couverts"]', resa), couvPlan = plan && $('#pds-couverts', plan);
  const synchro = () => { if (couvForm && couvPlan && couvPlan.value !== couvForm.value) { couvPlan.value = couvForm.value; couvPlan.dispatchEvent(new Event('input', { bubbles: true })); couvPlan.dispatchEvent(new Event('change', { bubbles: true })); } };
  if (couvForm) { ['input', 'change'].forEach((t) => couvForm.addEventListener(t, synchro)); resa.addEventListener('click', (e) => { if (e.target.closest('[data-moins], [data-plus]')) setTimeout(synchro, 0); }); setTimeout(synchro, 300); }
  if (plan) plan.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="table="]'); if (!a) return;
    const u = new URL(a.href, location.href); u.searchParams.delete('couverts');
    if (couvForm && couvForm.value) u.searchParams.set('couverts', couvForm.value);
    a.href = u.pathname + u.search + u.hash;
  }, true);
  /* Plan agrandissable sur téléphone. */
  const scene = plan && $('.pds__scene', plan);
  if (scene && matchMedia('(max-width: 760px)').matches) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'pds__agrandir'; b.textContent = 'Agrandir le plan'; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => { const on = !scene.classList.contains('est-agrandi'); scene.classList.toggle('est-agrandi', on); b.setAttribute('aria-pressed', String(on)); b.textContent = on ? 'Réduire le plan' : 'Agrandir le plan'; });
    scene.before(b);
    /* v5 : sur téléphone, le plan d'abord ; la liste des tables se replie (« Voir les 12 tables »). */
    const liste = $('.pds__liste', plan);
    if (liste) {
      const n = $$('li', liste).length, t = document.createElement('button');
      t.type = 'button'; t.className = 'pds__agrandir pds__voir'; t.setAttribute('aria-expanded', 'false'); t.textContent = `Voir les ${n} tables`;
      liste.id ||= 'pds-liste'; t.setAttribute('aria-controls', liste.id); liste.classList.add('est-pliee');
      t.addEventListener('click', () => { const on = liste.classList.toggle('est-pliee') === false; t.setAttribute('aria-expanded', String(on)); t.textContent = on ? 'Masquer les tables' : `Voir les ${n} tables`; });
      liste.before(t);
    }
  }
  resa.addEventListener('reservation:envoyee', (e) => {
    const d = e.detail || {}, recap = $('[data-resa-recap]', resa); if (!recap) return;
    const jour = d.date ? new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(d.date + 'T12:00:00Z')) : '';
    const heure = d.heure ? d.heure.replace(':00', ' h').replace(':', ' h ') : '';
    const n = +d.couverts || 0;
    recap.querySelector('.placement')?.remove();
    const carte = document.createElement('div'); carte.className = 'placement'; carte.setAttribute('aria-hidden', 'true'); carte.dataset.effet = 'placement';
    const f = $('[data-resa-form]', resa), qui = f ? [f.elements.prenom?.value, f.elements.nom?.value].filter(Boolean).join(' ').trim() : '';
    carte.innerHTML = `<p class="placement__carton"><span>Réservé</span>${qui ? `<em>${qui.replace(/[<>&"]/g, '')}</em>` : ''}<strong>${jour}${heure ? ' · ' + heure : ''}</strong><span>${n} couvert${n > 1 ? 's' : ''}${d.table ? ' · table ' + d.table : ''}</span></p><svg class="placement__cloche" viewBox="0 0 120 70"><path d="M8 62 Q 10 14 60 12 Q 110 14 112 62 Z" fill="#b8925a"/><path d="M4 62 H116" stroke="#7a5523" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="9" r="6" fill="#7a5523"/></svg>`;
    recap.prepend(carte);
    /* Sur le plan aussi, la table choisie reçoit son petit carton « Réservé ». */
    /* Sur le plan aussi : l'étiquette posée sur la table choisie devient le carton « Réservé · jour · heure · couverts ». */
    const rep = d.table && $('.pds__repere');
    if (rep && !rep.hidden) {
      rep.classList.add('est-reserve');
      rep.querySelector('b').textContent = 'Réservé';
      const jc = d.date ? new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(d.date + 'T12:00:00Z')) : '';
      rep.querySelector('.pds__repere-etiquette > span').textContent = `${jc}${heure ? ' · ' + heure : ''} · ${n} couvert${n > 1 ? 's' : ''}`;
    }
    if (etat.calme) carte.classList.add('est-pose');
    else requestAnimationFrame(() => requestAnimationFrame(() => carte.classList.add('est-pose')));
  });
}

/* Infos pratiques (v4) : le cadran des horaires se manipule ; on choisit un jour, on fait glisser l'aiguille,
   et l'on lit si le restaurant est ouvert à ce moment-là (mêmes données et mêmes calculs que le module). */
async function cadranManipulable() {
  const sec = $('[data-module="horaires-ouvert-maintenant"]'), cadran = sec && $('.horaires__cadran', sec), src = sec && $('script[data-horaires]', sec);
  if (!cadran || !src || etat.calme) return;
  const H = await import('./modules/horaires-ouvert-maintenant/horaires-calcul.js?v=5');
  const a = H.preparer(JSON.parse(src.textContent)).adresses[0];
  const n0 = H.maintenant(a.fuseau);
  const jours = Array.from({ length: 7 }, (_, k) => H.ajouter(n0.iso, k));
  const zone = document.createElement('div'); zone.className = 'horaires__essai'; zone.dataset.effet = 'cadran-manipulable';
  zone.innerHTML = `<p class="horaires__essai-titre">Faites glisser l’aiguille pour un autre moment</p><div class="horaires__essai-jours" role="group" aria-label="Jour">${jours.map((iso, k) => `<button type="button" data-iso="${iso}" aria-pressed="${k === 0}">${k === 0 ? 'Aujourd’hui' : H.JOURS[H.jourDe(iso)].replace(/^./, (x) => x.toUpperCase())}</button>`).join('')}</div><label class="horaires__essai-heure"><span>Heure</span><input type="range" min="0" max="1425" step="15" value="${Math.round(n0.min / 15) * 15}"></label><p class="horaires__essai-reponse" aria-live="polite"></p>`;
  /* Dans la colonne du texte, sous le statut (la grille du module garde ses deux colonnes). */
  ($('[data-horaires-statut]', sec) || cadran).after(zone);
  /* Arrivée par un lien vers une section plus bas (#ecrire) : la zone ajoutée a poussé la section, on la ramène en haut. */
  if (location.hash && performance.now() < 8000) {
    let cible = null; try { cible = document.querySelector(decodeURIComponent(location.hash)); } catch {}
    if (cible && (cadran.compareDocumentPosition(cible) & Node.DOCUMENT_POSITION_FOLLOWING)) requestAnimationFrame(() => aller(cible, { instant: true }));
  }
  const curseur = $('input', zone), rep = $('.horaires__essai-reponse', zone);
  let iso = jours[0];
  const dire = () => {
    const m = +curseur.value, j = H.jour(a, iso), veille = H.jour(a, H.ajouter(iso, -1));
    const ouvert = j.creneaux.some((c) => c[0] <= m && m < c[1]) || veille.creneaux.some((c) => c[1] > 1440 && m < c[1] - 1440);
    const nom = iso === jours[0] ? 'Aujourd’hui' : H.JOURS[H.jourDe(iso)].replace(/^./, (x) => x.toUpperCase());
    rep.textContent = `${nom} à ${H.heure(m)}\u00a0: ${ouvert ? 'ouvert' : 'fermé'}`;
    rep.dataset.etat = ouvert ? 'ouvert' : 'ferme';
    curseur.setAttribute('aria-valuetext', H.heure(m));
    const aig = $('.horaires__aiguille', cadran); if (aig) aig.style.setProperty('--angle', (m / 1440 * 360).toFixed(2) + 'deg');
    if (essai) { centre.innerHTML = `<b>${H.heure(m).replace(' h ', ':').replace(/ h$/, ':00')}</b><span>${nom}</span>`; cadran.classList.add('est-essai'); }
  };
  /* Au premier geste, le centre du cadran montre le moment choisi (et non plus l'heure de Paris). */
  let essai = false;
  const centre = document.createElement('p'); centre.className = 'horaires__centre horaires__centre--essai'; centre.setAttribute('aria-hidden', 'true'); cadran.append(centre);
  zone.addEventListener('pointerdown', () => { essai = true; }, true); zone.addEventListener('keydown', () => { essai = true; }, true);
  cadran.addEventListener('pointerdown', () => { essai = true; }, true);
  /* Le module remet l'aiguille sur l'heure réelle à chaque minute : en mode essai, elle garde le moment choisi. */
  const aiguille = $('.horaires__aiguille', cadran);
  if (aiguille) new MutationObserver(() => { if (!essai) return; const v = (+curseur.value / 1440 * 360).toFixed(2) + 'deg'; if (aiguille.style.getPropertyValue('--angle') !== v) aiguille.style.setProperty('--angle', v); }).observe(aiguille, { attributes: true, attributeFilter: ['style'] });
  for (const b of $$('[data-iso]', zone)) b.addEventListener('click', () => { iso = b.dataset.iso; for (const x of $$('[data-iso]', zone)) x.setAttribute('aria-pressed', String(x === b)); dire(); });
  curseur.addEventListener('input', dire);
  /* Glisser l'aiguille directement sur le cadran (minuit en haut, sens des aiguilles d'une montre). */
  let actif = false;
  const lire = (e) => { const r = cadran.getBoundingClientRect(); const ang = Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))); return Math.round((((ang / (2 * Math.PI)) + 1) % 1) * 1440 / 15) * 15 % 1440; };
  cadran.style.touchAction = 'none'; cadran.style.cursor = 'grab';
  cadran.addEventListener('pointerdown', (e) => { actif = true; cadran.setPointerCapture(e.pointerId); curseur.value = String(lire(e)); dire(); });
  cadran.addEventListener('pointermove', (e) => { if (actif) { curseur.value = String(lire(e)); dire(); } });
  ['pointerup', 'pointercancel'].forEach((t) => cadran.addEventListener(t, () => { actif = false; }));
  setTimeout(dire, 1200);
}

/* Les fêtes : chaque plat du menu de Noël sort de sous sa cloche, l'un après l'autre, quand le menu arrive à l'écran. */
function cloches() {
  const liste = $('[data-effet="cloches"]'); if (!liste) return;
  const items = $$('li', liste);
  if (etat.calme || !('IntersectionObserver' in window)) { items.forEach((li) => li.classList.add('est-servi')); return; }
  const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { io.disconnect(); items.forEach((li, i) => setTimeout(() => li.classList.add('est-servi'), 250 + i * 380)); } }, { threshold: 0.35 });
  io.observe(liste);
}

/* Infos pratiques : la demande arrive préremplie depuis l'accueil (sujet, nombre d'invités). */
function demandePreremplie() {
  const f = $('[data-formulaire]'); if (!f) return;
  const q = new URLSearchParams(location.search), n = q.get('invites');
  const msg = f.querySelector('textarea'); if (n && msg && !msg.value) msg.value = `Réception pour ${n} personnes. `;
  const inv = f.querySelector('[name="invites"]'); if (n && inv && !inv.value && /^\d{1,3}$/.test(n)) inv.value = n;
}

demarrer({
  preparer() {
    preparerTitre();
    plateau3d();
    signature();
    braises();
    decomptes();
    ecritures();
    saisons();
    tableAgrandit();
    demandePreremplie();
    cloches();
    reservationV4();
    quand('pret', cadranManipulable);
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
    /* v3 : l'intro complète (environ 2,5 s) est pour l'accueil ; ailleurs elle passe trois fois plus vite. */
    if (!$('.ouv-saisons')) tl.timeScale(3);
    return tl;
  },
  arrivee() { formerTitre(0.15); },
  etatFinal() {
    const h = $('.ouv-accueil__titre'); if (h) { h.classList.add('est-forme', 'vu'); if (gsap && lettresTitre.length) gsap.set(lettresTitre, { clearProps: 'transform,opacity,textShadow' }); defaireTitre(); }
    for (const el of $$('[data-effet="plume"], [data-effet="numero"], [data-effet="carton"]')) el.style.setProperty('--ecrit', '0%');
    const nom = $('.chef__nom'); if (nom) nom.style.setProperty('--signature-reste', '0%');
  },
});
