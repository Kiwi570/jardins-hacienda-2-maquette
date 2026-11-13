/* Les Jardins de l'Hacienda · v6 « De midi à minuit ». Le socle gère l'ouverture, le voile « cloche » (la transition
   en assiette de la v5), l'en-tête, le menu, le mode calme, les boucles et la bibliothèque d'effets ; les modules de la
   bibliothèque (dossier modules/) sont chargés ici, page par page, et réglés sans être réécrits.
   Effets propres (data-effet) : heure (horloge de l'en-tête), axes (chiffres variables), heure-section, eau (WebGL),
   passe, vraies, apres-midi, terrasse, guirlandes, carton, braises, decompte, carte-apercu. */
import { demarrer, boucle, etat, versObjet, quand, aller, partir, bloquerDefilement, debloquerDefilement } from './socle/index.js?v=7';

const gsap = window.gsap;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const html = document.documentElement;
const telephone = () => matchMedia('(max-width: 760px)').matches;

/* ---------- Heures des pages : couleur du voile et chiffres de l'heure d'arrivée ---------- */
const HEURES = {
  '/': ['12:00', '#0c6f7b'], '/la-carte': ['12:30', '#9c4a22'], '/receptions': ['19:00', '#24453e'], '/reserver': ['21:00', '#11201b'],
  '/les-fetes': ['23:30', '#2a120a'], '/offrir': ['00:00', '#120c09'], '/infos-pratiques': [null, '#1c1712'],
};
const cheminDe = (u) => { let p = u.pathname.replace(/\.html$/, '').replace(/\/index$/, '/'); if (p.length > 1) p = p.replace(/\/$/, ''); return p || '/'; };
function heureParis() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return `${p.hour}:${p.minute}`;
}
/* Une seule heure par page, calculée ici pour le voile, l'intro, l'horloge de l'en-tête et l'ouverture :
   La carte prend le déjeuner (12:30) ou le dîner (20:30) selon l'heure réelle à Moineville ; Réserver, l'heure du
   service demandé (?service=), sinon du prochain service ouvert (mêmes calculs que la mini-réservation). */
function momentDe(u) {
  const q = u.searchParams.get('moment'); if (q === 'jour' || q === 'soir') return q;
  const h = +heureParis().split(':')[0]; return h >= 5 && h < 17 ? 'jour' : 'soir';
}
function heurePage(u) {
  const chemin = cheminDe(u), h = HEURES[chemin]; if (!h) return null;
  if (chemin === '/la-carte') return [momentDe(u) === 'soir' ? '20:30' : '12:30', h[1]];
  if (chemin === '/reserver') {
    let sv = u.searchParams.get('service');
    if (sv !== 'midi' && sv !== 'soir') {
      try { const R = JSON.parse(($('[data-reservation-globale]') || $('[data-reservation-accueil]')).textContent); sv = prochainsServices(R, 1)[0]?.sv; } catch { sv = null; }
      if (!sv) sv = momentDe(u) === 'soir' ? 'soir' : 'midi';
    }
    return [sv === 'soir' ? '21:00' : '12:30', h[1]];
  }
  return h;
}
function preparerVoile(url) {
  let u; try { u = new URL(url, location.href); } catch { return; }
  if (u.origin !== location.origin) return;
  const h = heurePage(u); if (!h) return;
  /* Le voile est un ciel : la couleur de l'heure de départ en bas, celle de l'heure d'arrivée en haut. */
  const ici = heurePage(new URL(location.href));
  if (ici && ici[1]) html.style.setProperty('--voile-avant', ici[1]);
  html.style.setProperty('--voile-fond', '#f6f1e7');
  /* Le monogramme, le nom de la page et le filet d'or se posent pendant que le voile couvre l'écran. */
  html.classList.remove('voile-depart'); void html.offsetWidth; html.classList.add('voile-depart');
  const el = $('[data-voile-heure]'); if (el) el.textContent = h[0] || heureParis();
}
/* Page d'arrivée : l'intro roule jusqu'à la même heure, l'horloge de l'en-tête l'affiche. */
function heureDArrivee() {
  const h = heurePage(new URL(location.href)); if (!h || !h[0]) return;
  const [hh, mm] = h[0].split(':');
  const rh = $('[data-rouleau="h"]'), rm = $('[data-rouleau="m"]');
  if (rh) rh.lastElementChild.textContent = hh; if (rm) rm.lastElementChild.textContent = mm;
  const v = $('[data-voile-heure]'); if (v) v.textContent = h[0];
  if (!$('main [data-heure]')) { const a = $('[data-horloge-h]'), b = $('[data-horloge-m]'); if (a && b && !$('[data-horloge-reelle]')) { a.textContent = hh; b.textContent = mm; } }
  /* Accueil, la nuit et le matin (avant 11 h) : l'intro s'arrête d'abord sur l'heure réelle (« 01:26 · la maison dort »),
     puis roule jusqu'à midi (« Rendez-vous à midi »), au lieu d'afficher « 12:00 » à une heure où tout est fermé. */
  /* Accueil, la nuit et le matin (avant 11 h) : la ligne de l'intro le dit, sans heure (« La maison dort. Rendez-vous à midi. »). */
  if ($('.midi') && html.dataset.arrivee === 'intro') {
    const [rH, rM] = heureParis().split(':'); const t = +rH * 60 + +rM;
    if (t < 11 * 60) {
      const l = $('.ouverture-ligne'); if (l) l.textContent = `${t < 7 * 60 ? 'La maison dort' : 'La maison se prépare'}. Rendez-vous à midi.`;
      html.classList.add('intro-nuit');
    }
  }
}
function voileALHeure() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('data-sans-transition') || e.defaultPrevented) return;
    preparerVoile(a.href);
  }, true);
  /* Le voile d'arrivée (Infos pratiques) porte l'heure réelle. */
  const v = $('[data-voile-heure]'); if (v && !v.textContent.trim()) v.textContent = heureParis();
}

/* ---------- Modules de la bibliothèque (pages intérieures) ---------- */
const MODULES = {
  'carte-du-restaurant': () => import('./modules/carte-du-restaurant/module.js?v=7'),
  'accords-mets-et-vins': () => import('./modules/accords-mets-et-vins/module.js?v=7'),
  'horaires-ouvert-maintenant': () => import('./modules/horaires-ouvert-maintenant/module.js?v=7'),
  'plan-de-salle': () => import('./modules/plan-de-salle/module.js?v=7'),
  'reservation-de-table': () => import('./modules/reservation-de-table/module.js?v=7'),
  'carte-cadeau-qui-se-compose': () => import('./modules/carte-cadeau-qui-se-compose/module.js?v=7'),
  'ardoise-a-la-craie': () => import('./modules/ardoise-a-la-craie/module.js?v=7'),
  'assiette-qui-se-dresse': () => import('./modules/assiette-qui-se-dresse/module.js?v=7'),
  'plat-fumant': () => import('./modules/plat-fumant/module.js?v=7'),
  'depliant-3d': () => import('./modules/depliant-3d/module.js?v=7'),
  'givre-webgl': () => import('./modules/givre-webgl/module.js?v=7'),
  'agenda-des-dates': () => import('./modules/agenda-des-dates/module.js?v=7'),
  'ciel-en-direct': () => import('./modules/ciel-en-direct/module.js?v=7'),
  'formulaire-par-etapes': () => import('./modules/formulaire-par-etapes/module.js?v=7'),
  'rideau-en-lanieres': () => import('./modules/rideau-en-lanieres/module.js?v=7'),
  'lumiere-au-pointeur': () => import('./modules/lumiere-au-pointeur/module.js?v=7'),
};
const OPTIONS = {
  'ardoise-a-la-craie': { vitesse: 2 },
  'assiette-qui-se-dresse': { longueur: 1.4 },
  'givre-webgl': { delai: 900, force: 0.9 },
  'agenda-des-dates': { fuseau: 'Europe/Paris', textes: {
    prochaine: (t, q) => `Prochaine date\u00a0: ${t}, ${q}`,
    /* Jours de calendrier (comme les comptes à rebours de l'accueil) : une date sans heure commence à minuit. */
    dans: (j, h, m) => { if (j < 1 && !h && !m) return 'aujourd’hui'; const n = j + (h || m ? 1 : 0); return n <= 1 ? 'demain' : `dans ${n} jours`; },
  } },
  'lumiere-au-pointeur': { source: 'bougie', focus: [0.68, 0.46], repos: 'promenade', relief: 2.2 },
  'ciel-en-direct': { timeZone: 'Europe/Paris', lat: 49.204, lon: 5.946, mer: false, etoiles: 1.1 },
  'rideau-en-lanieres': { effet: 'ecarte', forme: 'feuille', nombre: 7, nombreTelephone: 5, coeur: 0, delai: 0.05, duree: 0.75, decalage: 0.05, unique: false },
  'plat-fumant': { densite: 1, hauteur: 0.85, vitesse: 0.9, intensite: 2.1, qualite: 0.3 },
  'accords-mets-et-vins': { textes: { avec: 'Avec', signature: "Le vin de l'accord", groupe: 'Les plats du menu' } },
  'plan-de-salle': { reservation: '/reserver#formulaire', couverts: 2, textes: { choix: '{nom} · {zone} · {places} places. ', prise: 'Indisponible (simulation)' } },
  'carte-cadeau-qui-se-compose': { cachet: 'JH', min: 25, max: 200, textes: {
    pourQui: ', à remettre à {pour}',
    statut: 'Carte prête{pourQui} : {quoi}, total {total}. Valable 6 mois ; pour la recevoir, appelez-nous au 06 18 21 28 10. {simule}',
  } },
};
const apis = {};
/* Soirées d'exception (Saint-Sylvestre : jeudi 31 décembre au soir) : le module ne connaît que des fermetures par jour
   de la semaine ; le service fermé ce jour-là s'ouvre dans les réglages, ses autres dates restent sans créneau libre. */
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
/* L'ardoise de La carte : celle du midi ou celle du soir, selon l'heure de la page (avant que le module l'écrive). */
function contenuArdoise(el, mo) {
  let A = null; try { A = JSON.parse($('script[data-ardoise]', el)?.textContent || 'null'); } catch {}
  return A && A[mo] ? { date: A.date, ...A[mo] } : null;
}
function ardoiseDuMoment(el) {
  const mo = html.dataset.moment === 'soir' ? 'soir' : 'jour', a = contenuArdoise(el, mo);
  if (!a || mo === 'jour') return;
  const t = $('.ardoise__titre > span', el), m = $('.ardoise__mot > span', el), li = $$('.ardoise__liste > li', el);
  if (t) t.textContent = a.titre; if (m) m.textContent = a.mot;
  a.lignes.forEach((l, i) => { if (li[i]) { $('.ardoise__plat', li[i]).textContent = l.plat; $('.ardoise__prix', li[i]).textContent = l.prix; } });
}
/* Agenda : le lien « Réserver » d'une date ouvre le formulaire au bon jour (la date seule, sans l'heure). */
function datesVersReservation(el) {
  for (const a of $$('a.agd__reserver', el)) { try { const u = new URL(a.href); const d = u.searchParams.get('date'); if (d) u.searchParams.set('date', d.slice(0, 10)); u.searchParams.delete('sujet'); const li = a.closest('[id^="date-"]'); if (li) u.searchParams.set('soiree', li.id.slice(5)); a.href = u.pathname + u.search + u.hash; } catch {} }
}
/* Réserver : arrivée depuis une date des fêtes (?soiree=…) : la soirée est rappelée au-dessus du formulaire. */
function rappelSoiree() {
  const el = $('[data-soiree]'), id = new URLSearchParams(location.search).get('soiree'); if (!el || !id) return;
  let L = []; try { L = JSON.parse($('script[data-agenda]').textContent); } catch {}
  const x = L.find((d) => d.id === id); if (!x) return;
  const jour = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(x.d.slice(0, 10) + 'T12:00:00Z'));
  el.textContent = `Pour\u00a0: ${x.t}, ${jour}${x.p ? ` · ${x.p}` : ''}.`; el.hidden = false;
}
/* Une question (Infos pratiques) : après l'envoi, le message de fin revient à l'écran. */
document.addEventListener('formulaire:envoye', (e) => { const fin = e.target.closest('[data-module="formulaire-par-etapes"]')?.querySelector('.fpe__fin'); if (fin) setTimeout(() => amenerDansEcran(fin, true), 120); });
let givreEnAttente = null;
function givreAuRepos() {
  let t = 0;
  const essayer = () => { clearTimeout(t); t = setTimeout(() => { if (scrollY < 40) { removeEventListener('scroll', essayer); givreHiver(); } }, 700); };
  addEventListener('scroll', essayer, { passive: true }); essayer();
}
async function givreHiver() {
  if (!givreEnAttente || html.dataset.saison !== 'hiver' || innerWidth < 761) return;
  const el = givreEnAttente; givreEnAttente = null;
  try { const { init } = await MODULES['givre-webgl'](); apis['givre-webgl'] = await init(el, OPTIONS['givre-webgl'] || {}); } catch (e) { console.warn('module givre-webgl', e); }
}
async function chargerModules() {
  for (const el of $$('[data-module]')) {
    const nom = el.dataset.module;
    if (!MODULES[nom]) continue;
    /* La vitre givrée n'existe que l'hiver : elle s'installe au premier passage à l'hiver (bascule de saison). */
    if (nom === 'givre-webgl' && html.dataset.saison === 'ete') { givreEnAttente = el; continue; }
    /* Sur téléphone, le givre reste figé (motif CSS du module) : le shader coûte trop au défilement.
       Sur ordinateur, il ne s'installe que le visiteur arrêté en haut de la page (jamais pendant un défilement). */
    if (nom === 'givre-webgl' && innerWidth < 761) continue;
    if (nom === 'givre-webgl') { givreEnAttente = el; givreAuRepos(); continue; }
    /* Les lanières ne prennent le relais que du voile (arrivée depuis une autre page) : jamais après l'intro. */
    if (nom === 'rideau-en-lanieres' && html.classList.contains('rdl-vu')) { el.remove(); continue; }
    try {
      if (nom === 'ardoise-a-la-craie') ardoiseDuMoment(el);
      const { init } = await MODULES[nom]();
      apis[nom] = await init(el, nom === 'reservation-de-table' ? { ...(OPTIONS[nom] || {}), ...reglagesResa(el) } : (OPTIONS[nom] || {}));
      if (nom === 'agenda-des-dates') datesVersReservation(el);
      if (nom === 'accords-mets-et-vins') {
        for (const li of el.querySelectorAll('.ame__liste > li')) li.setAttribute('role', 'none');
        for (const r of el.querySelectorAll('.ame__radio')) r.setAttribute('data-superpose', '');
      }
    } catch (e) { console.warn('module', nom, e); }
  }
  window.dispatchEvent(new CustomEvent('hacienda:modules'));
  /* Lien profond (page#section) : les modules (agenda, dépliant épinglé, carte…) changent les hauteurs après le premier
     placement ; si le visiteur n'a pas encore bougé, on revient sur la section visée. */
  if (location.hash && !aBouge) { const cible = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (cible) requestAnimationFrame(() => requestAnimationFrame(() => { window.ScrollTrigger?.refresh(); if (!aBouge) aller(cible, { instant: true }); })); }
}
let aBouge = false;
/* Lien profond : pendant 4 s, tant que le visiteur n'a pas bougé, la section visée reste en haut même si des blocs
   au-dessus changent de hauteur (cadran des horaires, modules, images). */
function garderAncre() {
  if (!location.hash) return;
  let cible = null; try { cible = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch {}
  if (!cible) return;
  const t0 = performance.now(); let h0 = document.documentElement.scrollHeight, attente = 0;
  const ro = new ResizeObserver(() => {
    if (aBouge || performance.now() - t0 > 4000) { ro.disconnect(); return; }
    const h = document.documentElement.scrollHeight; if (h === h0) return; h0 = h;
    cancelAnimationFrame(attente); attente = requestAnimationFrame(() => { if (!aBouge) aller(cible, { instant: true }); });
  });
  ro.observe(document.body);
}
['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((t) => addEventListener(t, () => { aBouge = true; }, { once: true, passive: true }));

/* ---------- Statut ouvert / fermé (module horaires : mêmes données et mêmes calculs partout) ---------- */
async function statuts() {
  const src = $('[data-horaires-accueil]') || $('[data-horaires-pied]'); const cibles = $$('[data-statut-accueil], [data-statut-accueil-bis], [data-statut-pied]');
  if (!src || !cibles.length) return;
  try {
    const H = await import('./modules/horaires-ouvert-maintenant/horaires-calcul.js?v=7');
    const a = H.preparer(JSON.parse(src.textContent)).adresses[0];
    const maj = () => {
      const st = H.statut(a, H.maintenant(a.fuseau));
      /* Le statut de l'ouverture dit l'heure réelle : la grande « 12:00 » est l'heure de la journée racontée, pas celle du visiteur. */
      const p2 = Object.fromEntries(new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', hour: 'numeric', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
      const reelle = `${+p2.hour}\u00a0h\u00a0${p2.minute}`;
      for (const c of cibles) { c.textContent = c.dataset.statutHeure ? `${c.dataset.statutHeure} ${reelle}\u00a0: ${st.texte.charAt(0).toLowerCase()}${st.texte.slice(1)}` : st.texte; const p = c.closest('.statut'); if (p) p.dataset.etat = st.etat === 'ferme' ? 'ferme' : st.etat === 'ouvert' ? 'ouvert' : st.etat; }
    };
    maj(); setInterval(maj, 60000);
  } catch (e) { console.warn('statut', e); }
}

/* ---------- La lumière de la journée (signature) : horloge de l'en-tête, couleur de l'en-tête, chiffres variables ---------- */
const TEINTES = { midi: [246, 241, 231], chef: [248, 243, 234], lieu: [239, 229, 211], moment: [244, 236, 224], venir: [244, 236, 224], dejeuner: [27, 19, 16], apresmidi: [242, 222, 178], terrasse: [19, 36, 31], diner: [17, 32, 27], feu: [18, 12, 9], fetes: [26, 15, 11], minuit: [14, 10, 8] };
const NUIT = new Set(['dejeuner', 'terrasse', 'diner', 'feu', 'fetes', 'minuit']);
const enMinutes = (h) => { const [a, b] = h.split(':').map(Number); return a * 60 + b; };
function axes(el, f) {
  /* f : 0 à midi, 1 à minuit. Large et fin le jour, serré et gras la nuit. */
  el.style.setProperty('--wdth', (100 - 25 * f).toFixed(1));
  el.style.setProperty('--wght', Math.round(260 + 440 * f));
}
function lumiere() {
  const sections = $$('main [data-heure]');
  const hEl = $('[data-horloge-h]'), mEl = $('[data-horloge-m]');
  const chiffres = $$('.heure-section, .heure-geante');
  if (!sections.length) {
    /* Pages intérieures : leurs chiffres prennent la forme de leur heure. */
    const H = heurePage(new URL(location.href)); const m = H && H[0] ? enMinutes(H[0]) : null;
    const f = m == null ? 0.5 : (m === 0 ? 1 : Math.max(0, Math.min(1, (m - 720) / 720)));
    chiffres.forEach((el) => axes(el, f));
    if ($('[data-horloge-reelle]') && hEl) { const maj = () => { const [h, mm] = heureParis().split(':'); hEl.textContent = h; mEl.textContent = mm; }; maj(); setInterval(maj, 20000); }
    return;
  }
  let reperes = [];
  const mesurer = () => {
    reperes = sections.map((s) => ({ top: s.getBoundingClientRect().top + scrollY, m: enMinutes(s.dataset.heure), l: s.dataset.lumiere }));
  };
  mesurer();
  if (window.ScrollTrigger) window.ScrollTrigger.addEventListener('refresh', mesurer);
  addEventListener('resize', mesurer);
  let dernierM = -1, dernierL = '', dernierF = -1;
  const maj = () => {
    const ref = scrollY + 1;
    let i = 0; while (i < reperes.length - 1 && reperes[i + 1].top <= ref) i++;
    const a = reperes[i], b = reperes[i + 1];
    const t = b ? Math.max(0, Math.min(1, (ref - a.top) / Math.max(1, b.top - a.top))) : 0;
    const m = Math.round(a.m + (b ? (b.m - a.m) * t : 0));
    if (m !== dernierM && hEl) { dernierM = m; hEl.textContent = String(Math.floor(m / 60) % 24).padStart(2, '0'); mEl.textContent = String(m % 60).padStart(2, '0'); }
    if (a.l !== dernierL) {
      dernierL = a.l;
      html.style.setProperty('--entete-fond', `rgb(${TEINTES[a.l].join(',')})`);
      html.style.setProperty('--entete-texte', NUIT.has(a.l) ? '#f6efe2' : '#1c1712');
      html.dataset.enteteTheme = NUIT.has(a.l) ? 'nuit' : 'jour';
      html.style.setProperty('--voile-fond', '#f6f1e7');
    }
    const f = Math.round(Math.max(0, Math.min(1, (m - 720) / 720)) * 50) / 50;
    if (f !== dernierF) { dernierF = f; chiffres.forEach((el) => axes(el, f)); }
  };
  maj();
  addEventListener('scroll', maj, { passive: true });
}

/* ---------- 12 h · l'eau de la piscine qui bouge sous le doigt (WebGL) ---------- */
const VERT = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
const FRAG = `precision mediump float;varying vec2 v;uniform sampler2D img;uniform vec2 ech,dec;uniform float t,horizon,asp,bande;uniform vec4 gouttes[10];
void main(){vec2 uv=vec2(v.x,1.-v.y);vec2 iu=vec2(uv.x,mix(bande,1.,uv.y))*ech+dec;
float eau=smoothstep(horizon-.03,horizon+.06,iu.y);
vec2 d=vec2(0.);float lum=0.;
for(int i=0;i<10;i++){vec4 g=gouttes[i];if(g.w<=0.)continue;float age=t-g.z;if(age<0.||age>3.2)continue;
vec2 q=(uv-g.xy)*vec2(asp,1.);float r=length(q);float front=age*.32;
float onde=sin(r*70.-age*9.)*exp(-age*1.3)*exp(-r*5.)*smoothstep(front+.02,front-.08,r)*g.w;
d+=normalize(q+1e-4)*onde*.012;lum+=onde*.18;}
float a=sin(iu.x*38.+t*1.3+sin(iu.y*24.-t)*1.7)*sin(iu.y*52.-t*1.1);
d+=vec2(a*.0018,a*.0026)*eau;
vec4 c=texture2D(img,iu+d*eau);
float caust=pow(max(0.,a),6.)*.12*eau;
gl_FragColor=vec4(c.rgb+vec3(lum*eau)+vec3(caust*.9,caust,caust),1.);}`;
/* L'hiver, l'ouverture est la salle aux baies vitrées : le soleil de midi suit la main (halo doux, sans WebGL),
   revient vers les baies quand la main quitte l'ouverture et s'arrête dès qu'il a rejoint sa cible. */
function soleil() {
  const zone = $('[data-effet="soleil"]');
  if (!zone || (html.dataset.saison === 'ete' && html.dataset.moment !== 'soir') || etat.calme) return;
  const sec = zone.closest('section') || zone;
  const REPOS = [0.72, 0.36];
  let cx = REPOS[0], cy = REPOS[1], tx = cx, ty = cy, raf = 0;
  const pas = () => {
    cx += (tx - cx) * 0.1; cy += (ty - cy) * 0.1;
    zone.style.setProperty('--sx', `${(cx * 100).toFixed(2)}%`); zone.style.setProperty('--sy', `${(cy * 100).toFixed(2)}%`);
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(pas) : 0;
  };
  const viser = (x, y) => { tx = x; ty = y; if (!raf) raf = requestAnimationFrame(pas); };
  const suivre = (e) => { const r = zone.getBoundingClientRect(); if (!r.width || !r.height) return; viser(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))); };
  sec.addEventListener('pointermove', suivre, { passive: true });
  sec.addEventListener('pointerdown', suivre, { passive: true });
  sec.addEventListener('pointerleave', () => viser(REPOS[0], REPOS[1]));
  zone.classList.add('soleil--actif');
}

function eau() {
  const zone = $('[data-effet="eau"]'), cv = zone && $('[data-eau]', zone), img = zone && $('img', zone);
  if (!cv || !img || etat.calme || html.dataset.saison !== 'ete' || html.dataset.moment === 'soir') return null;
  const gl = cv.getContext('webgl', { premultipliedAlpha: false, antialias: false, alpha: false });
  if (!gl) return null;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
  gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = Object.fromEntries(['img', 'ech', 'dec', 't', 'horizon', 'asp', 'gouttes', 'bande'].map((n) => [n, gl.getUniformLocation(pr, n)]));
  const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
  [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((k) => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  const gouttes = new Float32Array(40); let n = 0, temps = 0, iw = 1, ih = 1, w = 1, h = 1, pret = false;
  const dpr = () => Math.min(devicePixelRatio || 1, 1);
  const BANDE = 0.44;
  const taille = () => {
    /* Le canvas ne couvre que la bande d'eau (bas de la photo) : deux fois moins de pixels à calculer. */
    const r = cv.getBoundingClientRect(), f = zone.getBoundingClientRect();
    w = Math.max(1, Math.round(r.width * dpr())); h = Math.max(1, Math.round(r.height * dpr()));
    cv.width = w; cv.height = h; gl.viewport(0, 0, w, h);
    /* object-fit: cover de la figure entière, centré sur --cadrage : part de l'image visible. */
    const fw = f.width, fh = f.height, sc = Math.max(fw / iw, fh / ih), vw = fw / sc / iw, vh = fh / sc / ih;
    /* Même cadrage que la photo affichée : son object-position réel (celui du téléphone ou de l'ordinateur). */
    const op = getComputedStyle(img).objectPosition.split(' ').map((v) => (/%$/.test(v) ? parseFloat(v) / 100 : 0.5));
    gl.uniform2f(U.ech, vw, vh); gl.uniform2f(U.dec, (1 - vw) * (op[0] ?? 0.5), (1 - vh) * (op[1] ?? 0.5)); gl.uniform1f(U.asp, w / h); gl.uniform1f(U.bande, BANDE);
  };
  const charger = () => new Promise((ok) => {
    const src = img.currentSrc || img.src, im = new Image(); im.decoding = 'async';
    im.onload = () => { iw = im.naturalWidth; ih = im.naturalHeight; gl.bindTexture(gl.TEXTURE_2D, tex); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im); gl.uniform1i(U.img, 0); gl.uniform1f(U.horizon, 0.5); taille(); pret = true; ok(); };
    im.onerror = () => ok(); im.src = src;
  });
  const ajouter = (x, y, force = 1) => { derniereT = temps; const k = (n++ % 10) * 4; gouttes[k] = x; gouttes[k + 1] = y; gouttes[k + 2] = temps; gouttes[k + 3] = force; };
  let derniere = 0;
  const poser = (e) => {
    if (!pret) return;
    const r = cv.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    const t = performance.now(); if (t - derniere < (e.type === 'pointerdown' ? 0 : 70)) return; derniere = t;
    ajouter(x, y, e.type === 'pointerdown' ? 1.4 : 0.8);
  };
  const section = zone.closest('section');
  section.addEventListener('pointermove', poser, { passive: true });
  section.addEventListener('pointerdown', poser, { passive: true });
  new ResizeObserver(() => pret && taille()).observe(cv);
  let derniereT = -10, enDefilement = 0, impaire = false;
  addEventListener('scroll', () => { enDefilement = performance.now(); }, { passive: true });
  const leger = telephone() || matchMedia('(hover: none)').matches;
  const dessiner = (dt) => {
    if (!pret) return; temps += dt;
    /* Au toucher : l'eau ne bouge que quelques secondes après le geste ; pendant le défilement, l'image ne bouge pas. */
    const calme = leger && temps - derniereT > 3.4;
    cv.classList.toggle('est-actif', !calme);
    if (calme || performance.now() - enDefilement < 120 || section.classList.contains('est-en-pause')) return;
    impaire = !impaire; if (impaire) return;
    gl.uniform1f(U.t, temps); gl.uniform4fv(U.gouttes, gouttes); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  const lancer = () => { cv.classList.add('est-actif'); boucle(cv, (dt) => dessiner(dt), { lourde: true }); };
  /* Quelques gouttes d'elles-mêmes à l'ouverture : on voit tout de suite que l'eau se touche. */
  quand('pret', () => { if (!pret) return; lancer(); [[0.62, 0.78], [0.8, 0.7], [0.48, 0.86]].forEach(([x, y], i) => setTimeout(() => ajouter(x, y, 1.2), 300 + i * 650)); });
  return charger();
}

/* ---------- 12 h 30 · les plats arrivent sur la passe ; les vraies assiettes tournent ---------- */
function passe() {
  if (!gsap || !window.ScrollTrigger || etat.calme) return;
  const lignes = $$('.passe__plat');
  if (lignes.length) gsap.fromTo(lignes, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, stagger: 0.09, ease: 'power3.out', scrollTrigger: { trigger: '.passe', start: 'top 82%', once: true } });
  const vraies = $$('.vraie');
  if (vraies.length) gsap.fromTo(vraies, { rotate: -40, y: 30 }, { rotate: (i) => [-8, 6, -3][i] || 0, y: 0, ease: 'none', scrollTrigger: { trigger: '.dejeuner__visuel', start: 'top bottom', end: 'bottom 40%', scrub: 0.6 } });
}

function pisteTelephone() {
  const piste = $('.apresmidi__piste'); if (!piste || !gsap || !window.ScrollTrigger || etat.calme || !telephone()) return;
  gsap.fromTo(piste.children, { x: 90 }, { x: 0, ease: 'none', stagger: 0.04, scrollTrigger: { trigger: piste, start: 'top bottom', end: 'top 30%', scrub: 0.5 } });
}

/* ---------- 19 h · la terrasse s'allume : coucher du soleil au défilement, guirlandes qu'on allume ---------- */
/* Les halos sont posés par la page sur les vraies ampoules de l'image ; ici, le bon cadre (ordinateur ou téléphone)
   et l'ordre d'allumage, de gauche à droite comme on remonterait la guirlande. */
function guirlandes(svg) {
  const mq = matchMedia('(max-width: 760px) and (orientation: portrait)');
  const cadre = () => svg.setAttribute('viewBox', mq.matches ? svg.dataset.vueTelephone : svg.dataset.vue);
  cadre(); mq.addEventListener?.('change', cadre);
  return $$('.ampoule', svg);
}
function terrasse() {
  const sec = $('.terrasse'); if (!sec) return;
  const svg = $('.guirlandes', sec), etapes = $$('[data-etape]', sec);
  const ampoules = svg ? guirlandes(svg) : [];
  const touchees = new Set();
  ampoules.forEach((a) => a.addEventListener('pointerdown', () => { touchees.add(a); a.classList.add('est-allumee'); }));
  /* v7.5.15 · Fluidité : les fondus des deux images sont posés sur elles seules (couches composées), et la lumière des halos
     ne change que par paliers de 5 % : plus de recalcul de toute la scène ni de repeinte des guirlandes à chaque image. */
  const img2 = $('.terrasse__img--2', sec), img3 = $('.terrasse__img--3', sec);
  let pHalo = -1;
  const appliquer = (p) => {
    if (img2) img2.style.opacity = Math.max(0, Math.min(1, (p - 0.25) * 4)).toFixed(3);
    if (img3) img3.style.opacity = Math.max(0, Math.min(1, (p - 0.55) * 4)).toFixed(3);
    const q = Math.round(p * 20) / 20; if (q !== pHalo && svg) { pHalo = q; svg.style.setProperty('--p', q.toFixed(2)); }
    const k = p < 0.3 ? 0 : p < 0.62 ? 1 : 2;
    etapes.forEach((e, i) => e.classList.toggle('est-actif', i <= k));
    const allumees = Math.round(Math.max(0, Math.min(1, (p - 0.28) / 0.34)) * ampoules.length);
    ampoules.forEach((a, i) => a.classList.toggle('est-allumee', i < allumees || touchees.has(a)));
  };
  /* L'hiver, la terrasse ferme la page en clin d'œil : une seule image, la nuit, guirlandes allumées (pas de scène épinglée). */
  if (etat.calme || !gsap || !window.ScrollTrigger || sec.classList.contains('terrasse--clin')) { appliquer(1); return; }
  appliquer(0);
  gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.4, invalidateOnRefresh: true, onUpdate: (st) => appliquer(st.progress) } });
}

/* ---------- 14 h 30 · le panorama : la caméra parcourt la piscine, l'heure avance jusqu'à 19 h, la lumière dore ---------- */
function panorama() {
  const sec = $('.panorama'); if (!sec) return;
  /* L'après-midi au bord de l'eau : l'été seulement (masquée l'hiver, elle est dispensée du contrôle « un visuel par section »). */
  if (html.dataset.saison !== 'ete') return; sec.removeAttribute('data-sans-visuel');
  const h = $('[data-panorama-heure] span', sec), lieux = $$('[data-lieu]', sec);
  const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  const piste = $('[data-panorama-piste]', sec), legende = $('.panorama__legende', sec);
  const appliquer = (p) => {
    sec.style.setProperty('--p', p.toFixed(3));
    if (h) h.textContent = fmt(870 + Math.round((p * 270) / 15) * 15);
    /* Une légende ne s'allume que si son point est dans l'écran, et s'ouvre du côté où elle tient (jamais coupée). */
    const vw = document.documentElement.clientWidth, W = piste ? piste.offsetWidth : vw, tx = p * (vw - W);
    lieux.forEach((l) => {
      const x = (parseFloat(l.style.getPropertyValue('--x')) / 100) * W + tx, place = Math.min(320, vw * 0.7) + 60;
      const dedans = x > 24 && x < vw - 24;
      l.classList.toggle('est-allume', dedans && p >= +l.dataset.lieu - 0.14);
      l.dataset.cote = x + place > vw ? 'gauche' : 'droite';
    });
    /* Téléphone : la légende du lieu le plus près du centre s'écrit dans un bandeau en bas de l'image (jamais coupée). */
    if (legende && vw < 761) {
      const allumes = lieux.filter((l) => l.classList.contains('est-allume'));
      const proche = allumes.sort((a, b) => Math.abs((parseFloat(a.style.getPropertyValue('--x')) / 100) * W + tx - vw / 2) - Math.abs((parseFloat(b.style.getPropertyValue('--x')) / 100) * W + tx - vw / 2))[0];
      const id = proche ? proche.id : '';
      if (legende.dataset.lieu !== id) { legende.dataset.lieu = id; legende.innerHTML = proche ? $('.lieu__texte', proche).innerHTML : ''; }
    }
  };
  if (etat.calme || !gsap || !window.ScrollTrigger) { lieux.forEach((l) => l.classList.add('est-allume')); return; }
  sec.classList.add('est-actif');
  appliquer(0);
  gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.5, invalidateOnRefresh: true, onUpdate: (st) => appliquer(st.progress) } });
}

/* ---------- 21 h · réserver dans la page : prochains services ouverts, carte de placement qui s'envole ---------- */
function prochainsServices(R, nb = 6) {
  const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  const auj = `${p.year}-${p.month}-${p.day}`, mnt = +p.hour * 60 + +p.minute;
  const ajouter = (iso, n) => { const [a, m, j] = iso.split('-').map(Number); return new Date(Date.UTC(a, m - 1, j + n)).toISOString().slice(0, 10); };
  const ex = R.ouvertures_exceptionnelles || [];
  const sortie = [];
  for (let k = 0; k < 21 && sortie.length < nb; k++) {
    const iso = ajouter(auj, k), j = JOURS[new Date(iso + 'T12:00:00Z').getUTCDay()];
    for (const sv of ['midi', 'soir']) {
      const exc = ex.some((e) => e.date === iso && e.service === sv);
      const ferme = !exc && ((R.fermetures.jours || []).includes(j) || (R.fermetures.services[j] || []).includes(sv) || (R.fermetures.dates || []).includes(iso));
      if (ferme) continue;
      const fin = enMinutes(R.services[sv].fin);
      if (k === 0 && mnt + (R.delai_minutes || 0) > fin) continue;
      sortie.push({ iso, sv, j });
      if (sortie.length >= nb) break;
    }
  }
  return sortie;
}
function miniResa() {
  const form = $('[data-mini-resa]'), src = $('[data-reservation-accueil]');
  if (!form || !src) return;
  let R; try { R = JSON.parse(src.textContent); } catch { return; }
  const zone = $('[data-services]', form), date = form.elements.date;
  const services = prochainsServices(R, telephone() ? 6 : (+form.dataset.servicesNombre || 6));
  /* Sous « Le dîner » : le prochain soir est coché d'avance (le midi reste proposé). */
  const coche = Math.max(0, services.findIndex((s) => s.sv === 'soir'));
  if (services.length) {
    zone.innerHTML = services.map((s, i) => {
      const d = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(s.iso + 'T12:00:00Z'));
      return `<label class="puce"><input type="radio" name="service" value="${s.sv}" data-date="${s.iso}"${i === coche ? ' checked' : ''}><span>${d.replace(/^./, (x) => x.toUpperCase())} · ${s.sv}</span></label>`;
    }).join('');
  }
  const majDate = () => { const r = $('[name="service"]:checked', form); date.value = r?.dataset.date || ''; };
  form.addEventListener('change', majDate); majDate();
  const n = form.elements.couverts;
  form.addEventListener('click', (e) => {
    const b = e.target.closest('[data-moins], [data-plus]'); if (!b) return;
    n.value = String(Math.max(1, Math.min(10, (+n.value || 2) + (b.hasAttribute('data-plus') ? 1 : -1))));
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    majDate();
    const q = new URLSearchParams(); if (date.value) q.set('date', date.value);
    const sv = $('[name="service"]:checked', form)?.value; if (sv) q.set('service', sv);
    q.set('couverts', String(Math.max(1, Math.min(10, +n.value || 2))));
    const url = `/reserver?${q}#formulaire`;
    const bouton = $('[type="submit"]', form), r = bouton.getBoundingClientRect();
    preparerVoile(url);
    if (etat.calme || !gsap) { location.href = url; return; }
    /* Retour physique : la carte de placement part du bouton et file jusqu'au bouton Réserver de l'en-tête. */
    html.classList.remove('entete-cache');
    const cible = $$('[data-resa-cible], [data-barre-fixe] .bouton:last-child').find((x) => x.getBoundingClientRect().width > 0);
    const libelle = $('[name="service"]:checked', form)?.nextElementSibling?.textContent || '';
    const carton = document.createElement('div'); carton.className = 'carton-vol'; carton.setAttribute('aria-hidden', 'true');
    carton.textContent = `Table pour ${n.value} · ${libelle}`;
    carton.style.left = `${r.left}px`; carton.style.top = `${r.top}px`; document.body.append(carton);
    if (cible) {
      const c = cible.getBoundingClientRect(), cr = carton.getBoundingClientRect();
      await new Promise((ok) => gsap.timeline({ onComplete: ok })
        .fromTo(carton, { rotate: -4, scale: 1 }, { rotate: 6, scale: 1.04, duration: 0.18 })
        .to(carton, { x: c.left + c.width / 2 - (cr.left + cr.width / 2), y: c.top + c.height / 2 - (cr.top + cr.height / 2), scale: 0.3, rotate: 18, duration: 0.6, ease: 'power2.in' })
        .to(carton, { opacity: 0, duration: 0.12 }));
      cible.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 300 });
    }
    carton.remove();
    partir(new URL(url, location.href), 'Réserver', { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  });
}

/* ---------- 23 h · braises qui montent du feu ; le doigt les attise ---------- */
/* Le foyer de la cheminée (fractions du cadre) : mesuré sur la vraie photo par feuVivant, lu par les braises. */
const foyer = { x: 0.5, y: 0.62, l: 0.22 };

/* Le coin du feu, sur la vraie cheminée de la salle : les flammes ondulent (bandes de la photo décalées par une onde
   qui monte), la lueur vacille sur la salle, les braises partent du foyer. Tout se mesure dans le repère de la photo
   (object-fit: cover, recadrage réel) ; 30 images par seconde au plus, arrêté hors écran (boucle du socle). */
function feuVivant() {
  const fig = $('.feu__photo[data-foyer]'), img = fig && $('img', fig);
  if (!img || etat.calme) return;
  const cv = document.createElement('canvas'); cv.className = 'feu__flammes'; cv.setAttribute('aria-hidden', 'true');
  const lueur = document.createElement('span'); lueur.className = 'feu__lueur'; lueur.setAttribute('aria-hidden', 'true');
  fig.append(cv, lueur);
  const ctx = cv.getContext('2d'); if (!ctx) return;
  let z = null, k = 1;
  const mesurer = () => {
    const iw = img.naturalWidth, ih = img.naturalHeight, W = fig.offsetWidth, H = fig.offsetHeight;
    if (!iw || !ih || !W || !H) return;
    const zone = (ih > iw ? fig.dataset.foyerMobile : fig.dataset.foyer).split(' ').map(Number);
    const e = Math.max(W / iw, H / ih), dw = iw * e, dh = ih * e;
    const [px, py] = getComputedStyle(img).objectPosition.split(' ').map((v) => (v.endsWith('%') ? parseFloat(v) / 100 : 0.5));
    const ox = (W - dw) * px, oy = (H - dh) * py;
    const x0 = ox + zone[0] * dw, y0 = oy + zone[1] * dh, w = (zone[2] - zone[0]) * dw, h = (zone[3] - zone[1]) * dh;
    k = 1;
    z = { sx: zone[0] * iw, sy: zone[1] * ih, sw: (zone[2] - zone[0]) * iw, sh: (zone[3] - zone[1]) * ih, cw: Math.max(1, Math.round(w * k)), ch: Math.max(1, Math.round(h * k)) };
    cv.width = z.cw; cv.height = z.ch;
    cv.style.cssText = `left:${x0.toFixed(1)}px;top:${y0.toFixed(1)}px;width:${w.toFixed(1)}px;height:${h.toFixed(1)}px`;
    foyer.x = (x0 + w * 0.42) / W; foyer.y = (y0 + h * 0.6) / H; foyer.l = Math.min(0.22, (w / W) * 0.6);
    fig.style.setProperty('--foyer-x', `${(foyer.x * 100).toFixed(1)}%`); fig.style.setProperty('--foyer-y', `${(((y0 + h * 0.45) / H) * 100).toFixed(1)}%`);
  };
  if (img.complete) mesurer(); else img.addEventListener('load', mesurer, { once: true });
  new ResizeObserver(mesurer).observe(fig);
  img.addEventListener('load', mesurer);
  /* Vacillement : sinus de périodes sans rapport entre elles (jamais deux fois le même battement). */
  const vacille = (t) => 0.6 + 0.18 * Math.sin(t * 6.1) * Math.sin(t * 1.7 + 1.3) + 0.12 * Math.sin(t * 11.3 + 0.4) + 0.1 * Math.sin(t * 2.9 + 2.2);
  let dernier = 0;
  boucle(fig.closest('section'), (t) => {
    if (!z || t - dernier < 42) return; dernier = t;
    const s2 = t / 1000, v = vacille(s2);
    lueur.style.opacity = v.toFixed(3);
    const { cw, ch, sx, sy, sw, sh } = z, bande = 4;
    ctx.clearRect(0, 0, cw, ch);
    ctx.globalCompositeOperation = 'source-over';
    for (let y = 0; y < ch; y += bande) {
      const f = y / ch, haut = Math.pow(1 - f, 1.3);
      const dx = (Math.sin(y * 0.05 + s2 * 7.2) * 7 + Math.sin(y * 0.13 + s2 * 12.5) * 2.5) * haut * k;
      const dy = Math.sin(y * 0.03 + s2 * 5) * 2.2 * haut * k;
      ctx.drawImage(img, sx, sy + (y / ch) * sh, sw, (bande / ch) * sh + 0.5, dx, y + dy, cw, bande + 0.6);
    }
    /* Bords fondus : la bande d'image redessinée se perd dans la photo d'origine. */
    ctx.globalCompositeOperation = 'destination-in';
    const g = ctx.createRadialGradient(cw * 0.52, ch * 0.52, Math.min(cw, ch) * 0.2, cw * 0.52, ch * 0.52, Math.max(cw, ch) * 0.62);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch);
    /* Le feu respire : un souffle de lumière chaude sur les flammes. */
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.max(0, (v - 0.45) * 0.35);
    ctx.fillStyle = '#ff8a3c'; ctx.fillRect(0, 0, cw, ch);
    ctx.globalAlpha = 1;
  });
}

/* 12 h 30 : les petites assiettes ; un clic fait passer la sienne en grand, et la vapeur suit (module plat-fumant). */
function assiettes() {
  const scene = $('[data-plat-scene]'), boutons = $$('.vraie[data-plat]');
  if (!scene || !boutons.length) return;
  const img = $('img', scene), source = $('source', scene);
  const SRC = (nom, ws) => ws.map((w) => `/assets/images/${nom}-${w}.webp ${w}w`).join(', ');
  for (const b of boutons) {
    b.addEventListener('click', () => {
      if (b.getAttribute('aria-pressed') === 'true') return;
      for (const x of boutons) x.setAttribute('aria-pressed', String(x === b));
      const vignette = $('img', b);
      const set = vignette.getAttribute('srcset') || '', srcGrand = set.split(',').map((p) => p.trim().split(' ')[0]).pop() || vignette.src;
      scene.classList.add('fumant--change');
      setTimeout(() => {
        const fini = () => {
          scene.style.setProperty('--cadrage', b.dataset.cadrage || '50% 50%');
          apis['plat-fumant']?.sources?.(b.dataset.vapeur);
          scene.classList.remove('fumant--change');
        };
        img.addEventListener('load', fini, { once: true });
        if (source) source.srcset = set || srcGrand;
        img.srcset = set; img.src = srcGrand; img.alt = b.dataset.alt || '';
        if (img.complete) fini();
      }, etat.calme ? 0 : 260);
    });
  }
}

function braises() {
  const cv = $('[data-braises]'); if (!cv) return;
  const ctx = cv.getContext('2d'); const sec = cv.closest('section');
  let w = 1, h = 1, dpr = 1;
  const taille = () => { const r = cv.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 1.5); w = Math.max(1, r.width); h = Math.max(1, r.height); cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  taille(); new ResizeObserver(taille).observe(cv);
  const N = telephone() ? 26 : 46;
  const naitre = (b, haut = false) => { b.x = w * (foyer.x + (Math.random() - 0.5) * foyer.l); b.y = haut ? Math.random() * h : h * (foyer.y + Math.random() * 0.1); b.vx = (Math.random() - 0.5) * 14; b.vy = -(22 + Math.random() * 40); b.r = 0.8 + Math.random() * 2.2; b.vie = 0; b.max = 2.5 + Math.random() * 3; return b; };
  const p = Array.from({ length: N }, () => naitre({}, true));
  const souris = { x: -999, y: -999, f: 0 };
  sec.addEventListener('pointermove', (e) => { const r = cv.getBoundingClientRect(); souris.x = e.clientX - r.left; souris.y = e.clientY - r.top; souris.f = 1; }, { passive: true });
  sec.addEventListener('pointerdown', (e) => { const r = cv.getBoundingClientRect(); souris.x = e.clientX - r.left; souris.y = e.clientY - r.top; souris.f = 1.6; }, { passive: true });
  let visible = 1;
  if (sec.matches('[data-fx="plein-ecran"]') && gsap && window.ScrollTrigger && !etat.calme) gsap.fromTo(cv, { opacity: 0 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: '45% top', scrub: true, onUpdate: (st) => { visible = st.progress; } } });
  const dessiner = (dt) => {
    ctx.clearRect(0, 0, w, h);
    souris.f *= Math.exp(-dt * 2.2);
    for (const b of p) {
      b.vie += dt;
      const dx = b.x - souris.x, dy = b.y - souris.y, d2 = dx * dx + dy * dy;
      if (souris.f > 0.02 && d2 < 160 * 160) { const k = (1 - Math.sqrt(d2) / 160) * souris.f * 220; b.vx += (dx / (Math.sqrt(d2) + 1)) * k * dt; b.vy -= k * 0.9 * dt; }
      b.vx *= Math.exp(-dt * 0.8); b.x += (b.vx + Math.sin(b.vie * 3 + b.r) * 8) * dt; b.y += b.vy * dt;
      if (b.vie > b.max || b.y < -10) naitre(b);
      const a = Math.max(0, 1 - b.vie / b.max);
      ctx.fillStyle = `rgba(255, ${150 + Math.round(80 * a)}, 80, ${(0.85 * a).toFixed(2)})`;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r * (0.6 + a * 0.6), 0, 6.283); ctx.fill();
    }
  };
  boucle(cv, (dt) => { if (visible > 0.02 || etat.calme) dessiner(etat.calme ? 0 : dt); });
}

/* ---------- Comptes à rebours des fêtes (jours restants à l'heure de Paris) ---------- */
function joursAvant(iso) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  const [a, m, j] = iso.split('-').map(Number);
  return Math.round((Date.UTC(a, m - 1, j) - Date.UTC(+p.year, +p.month - 1, +p.day)) / 86400000);
}
function decomptes() {
  for (const el of $$('[data-effet="decompte"]')) {
    const n = joursAvant(el.dataset.cible), cible = $('[data-jours]', el);
    if (!cible) continue;
    if (n < 0) { el.textContent = el.dataset.passe || 'A eu lieu'; continue; }
    if (n === 0) { el.textContent = el.dataset.aujourdhui || "Aujourd'hui"; continue; }
    cible.textContent = n;
    if (etat.calme || !gsap || !window.ScrollTrigger) continue;
    const o = { v: Math.min(n + 40, 400) };
    gsap.to(o, { v: n, duration: 1.2, ease: 'power3.out', onUpdate: () => { cible.textContent = Math.round(o.v); }, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  }
  /* 23 h 30 : la prochaine date (soirées à thème et brunch des affiches du site), calculée au jour réel à Moineville. */
  const ps = $('[data-prochaine-soiree]'), txt = ps && $('[data-soiree-texte]', ps);
  if (ps && txt) {
    let L = []; try { L = JSON.parse($('script', ps).textContent); } catch {}
    const prochaine = L.filter((x) => joursAvant(x.d.slice(0, 10)) >= 0).sort((a, b) => a.d.localeCompare(b.d))[0];
    if (prochaine) {
      const jour = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(prochaine.d.slice(0, 10) + 'T12:00:00Z'));
      txt.textContent = `À venir\u00a0: ${prochaine.t}, ${jour}${prochaine.p ? ` · ${prochaine.p}` : ''}.`;
    }
  }
}

/* ---------- Minuit · la carte cadeau se redresse au défilement ---------- */
function carteApercu() {
  if (!gsap || !window.ScrollTrigger || etat.calme) return;
  for (const c of $$('[data-effet="carte-apercu"]').map((x) => $('.cca__objet', x) || $('.cca__face', x)).filter(Boolean)) {
    /* Le déclencheur est le cadre de la carte, jamais la carte qui tourne (sa boîte change quand elle se retourne). */
    const cadre = c.closest('[data-effet="carte-apercu"]') || c;
    gsap.fromTo(c, { '--ry': '-28deg', '--rx': '14deg' }, { '--ry': '10deg', '--rx': '-4deg', ease: 'none', scrollTrigger: { trigger: cadre, start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
    /* Offrir : le montant parcourt les cartes de la maison (25 à 200 €) pendant qu'elle se redresse. */
    const m = $('[data-montant-tournant]', c);
    if (m) { const v = [25, 50, 100, 150, 200]; ScrollTriggerSimple(cadre, (p) => { m.textContent = `${v[Math.min(4, Math.floor(p * 5))]} €`; }); }
  }
}
function ScrollTriggerSimple(el, f) { window.ScrollTrigger.create({ trigger: el, start: 'top 80%', end: 'bottom top', onUpdate: (st) => f(st.progress) }); }

/* ---------- Heures de section : les chiffres roulent jusqu'à leur place à l'arrivée ---------- */
function heuresSection() {
  if (!gsap || !window.ScrollTrigger || etat.calme) return;
  /* Pas dans un cadre collant (le coin du feu, la terrasse) : sa position change avec le défilement, et la scène l'anime déjà. */
  for (const el of $$('.heure-section span').filter((x) => !x.closest('[data-collant], [data-fx-apres]'))) gsap.fromTo(el, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
}


/* ===================== Pages intérieures ===================== */
const poserHorloge = (hm) => { const h = $('[data-horloge-h]'), m = $('[data-horloge-m]'); if (h && hm) { const [a, b] = hm.split(':'); h.textContent = a; m.textContent = b; } };
function rafraichir() { if (window.ScrollTrigger) requestAnimationFrame(() => window.ScrollTrigger.refresh()); }

/* La carte : « la carte se met à l'heure » ; la bascule rallume toute la page. */
function basculeMoment() {
  if (html.dataset.page !== 'la-carte') return;
  const poser = (mo) => {
    html.dataset.moment = mo;
    if (html.hasAttribute('data-theme-auto')) html.dataset.theme = mo === 'soir' ? 'nuit' : 'jour';
    html.style.setProperty('--entete-fond', mo === 'soir' ? '#120c09' : '#f6f1e7');
    html.style.setProperty('--entete-texte', mo === 'soir' ? '#f6efe2' : '#1c1712');
    html.dataset.enteteTheme = mo === 'soir' ? 'nuit' : 'jour';
    poserHorloge(mo === 'soir' ? '20:30' : '12:30');
    for (const el of $$('.heure-geante')) axes(el, mo === 'soir' ? 0.7 : 0.04);
  };
  poser(html.dataset.moment || 'jour');
  for (const b of $$('[data-bascule-moment]')) b.addEventListener('click', () => {
    html.classList.add('transition-moment');
    poser(html.dataset.moment === 'soir' ? 'jour' : 'soir');
    /* L'ardoise passe au chiffon et se réécrit pour l'autre service. */
    const mur = $('[data-module="ardoise-a-la-craie"]'), a = mur && contenuArdoise(mur, html.dataset.moment);
    if (a && apis['ardoise-a-la-craie']?.ecrire) apis['ardoise-a-la-craie'].ecrire(a);
    setTimeout(() => html.classList.remove('transition-moment'), 900);
    rafraichir();
  });
}

/* Les fêtes : « la saison décide » ; le décompte géant de la Saint-Sylvestre. */
function saisonFetes() {
  for (const el of $$('[data-decompte-geant]')) {
    const n = joursAvant(el.dataset.decompteGeant);
    el.textContent = n > 0 ? `J-${n}` : n === 0 ? 'Ce soir' : '2027';
    if (n > 0 && gsap && !etat.calme) { const o = { v: n + 30 }; gsap.to(o, { v: n, duration: 1.4, delay: 0.6, ease: 'power3.out', onUpdate: () => { el.textContent = `J-${Math.round(o.v)}`; } }); }
  }
  const choix = $$('[data-saison-choix]'); if (!choix.length) return;
  const poser = (sa) => {
    html.dataset.saison = sa;
    /* La section de l'autre saison est masquée : dispensée du contrôle « un visuel par section ». */
    for (const sec of $$('main > section[data-saison-seul]')) sec.toggleAttribute('data-sans-visuel', sec.dataset.saisonSeul !== sa);
    for (const b of choix) b.setAttribute('aria-pressed', String(b.dataset.saisonChoix === sa));
    const ete = sa === 'ete';
    html.dataset.theme = 'nuit';
    html.dataset.enteteTheme = ete ? 'jour' : 'nuit';
    try { const u = new URL(location.href); u.searchParams.set('saison', sa); history.replaceState(history.state, '', u); } catch {}
    for (const el of $$('.heure-geante')) axes(el, ete ? 0.1 : 0.8);
    poserHorloge(ete ? '15:30' : '23:30');
  };
  poser(html.dataset.saison || 'hiver');
  for (const b of choix) b.addEventListener('click', () => { html.classList.add('transition-moment'); poser(b.dataset.saisonChoix); givreHiver(); setTimeout(() => html.classList.remove('transition-moment'), 900); rafraichir(); });
}

/* Réceptions : le mot de l'occasion (un tour à l'arrivée, puis au toucher), les volets des espaces, la demande. */
function motTournant() {
  const zone = $('.mot-tournant[data-mots]'); if (!zone) return;
  const el = $('.mot-tournant__mot', zone), mots = zone.dataset.mots.split('|');
  const sec = zone.closest('section'), diapos = $$('[data-diapo]', sec), puces = $$('[data-diapo-aller]', sec), pause = $('[data-diapo-pause]', sec);
  /* v7.5 · Le mot et la photo de l'arche défilent ensemble, sur les quatre occasions ; fil de progression, choix et pause. */
  const DUREE = 2600;
  let i = 0, minuteur = 0, enPause = false, visible = true;
  sec.style.setProperty('--recep-duree', `${DUREE}ms`);
  const montrer = (k, anime = true) => {
    i = (k + mots.length) % mots.length;
    diapos.forEach((d, n) => d.classList.toggle('est-active', n === i));
    puces.forEach((p, n) => {
      p.classList.toggle('est-active', n === i); p.classList.toggle('est-vue', n < i);
      p.setAttribute('aria-pressed', n === i ? 'true' : 'false');
      if (n === i) { const b = p.firstElementChild; b.style.animation = 'none'; void b.offsetWidth; b.style.animation = ''; }
    });
    if (!anime || etat.calme || !gsap) { el.textContent = mots[i]; return; }
    gsap.killTweensOf(el);
    gsap.to(el, { yPercent: -18, opacity: 0, duration: 0.24, ease: 'power2.in', onComplete: () => { el.textContent = mots[i]; gsap.fromTo(el, { yPercent: 18, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }); } });
  };
  const arreter = () => { clearTimeout(minuteur); minuteur = 0; };
  const planifier = () => {
    arreter();
    const auto = !enPause && visible && !etat.calme && !document.hidden;
    sec.dataset.defile = auto ? 'on' : 'pause';
    if (auto) minuteur = setTimeout(() => { montrer(i + 1); planifier(); }, DUREE);
  };
  puces.forEach((p, n) => p.addEventListener('click', () => { montrer(n); planifier(); }));
  zone.style.cursor = 'pointer';
  zone.addEventListener('click', () => { montrer(i + 1); planifier(); });
  if (pause) pause.addEventListener('click', () => {
    enPause = !enPause;
    pause.setAttribute('aria-pressed', enPause ? 'true' : 'false');
    pause.setAttribute('aria-label', enPause ? pause.dataset.reprendre : pause.dataset.pause);
    if (!enPause) montrer(i + 1);
    planifier();
  });
  if (etat.calme) { sec.dataset.defile = 'pause'; return; }
  new IntersectionObserver(([e]) => { const avant = visible; visible = e.isIntersecting; if (visible && !avant) montrer(i, false); planifier(); }, { threshold: 0.25 }).observe(sec);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) montrer(i, false); planifier(); });
  quand('pret', () => { montrer(0, false); planifier(); });
}

/* Liens « Réserver un déjeuner / un dîner » : la date du prochain service de ce type, pour que le service choisi tienne. */
function liensService() {
  const src = $('[data-reservation-accueil]'); if (!src) return;
  let R; try { R = JSON.parse(src.textContent); } catch { return; }
  const services = prochainsServices(R, 12);
  for (const a of $$('a[href*="/reserver"][href*="service="]')) {
    const u = new URL(a.href, location.href); if (u.searchParams.has('date')) continue;
    const s = services.find((x) => x.sv === u.searchParams.get('service')); if (!s) continue;
    u.searchParams.set('date', s.iso); a.href = u.pathname + u.search + u.hash;
  }
}
function volets() {
  const zone = $('.volets'); if (!zone) return;
  const liste = $$('[data-volet]', zone); let touche = false;
  const ouvrir = (v) => liste.forEach((x) => { const o = x === v; x.classList.toggle('est-ouvert', o); $('.volet__tete', x).setAttribute('aria-expanded', String(o)); });
  const ordre = () => liste.slice().sort((a, b) => (+getComputedStyle(a).order) - (+getComputedStyle(b).order));
  liste.forEach((v) => { $('.volet__tete', v).addEventListener('click', () => { touche = true; ouvrir(v); rafraichir(); }); v.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { touche = true; ouvrir(v); } }); });
  ouvrir(ordre()[0]);
  if (etat.calme || !window.ScrollTrigger) return;
  window.ScrollTrigger.create({ trigger: zone, start: 'top 70%', end: 'bottom 40%', onUpdate: (st) => { if (touche) return; const o = ordre(); ouvrir(o[Math.min(o.length - 1, Math.floor(st.progress * o.length))]); } });
}
/* v7.5 · Réceptions, « Cinq espaces, un seul domaine » : flèches carte par carte, glisser à la souris, molette verticale qui fait
   défiler la rangée tant qu'elle n'est pas au bout, fil de progression, cartes qui arrivent en cascade. */
function domaine() {
  const sec = $('.domaine'), l = sec && $('[data-domaine]', sec); if (!l) return;
  const prec = $('[data-domaine-prec]', sec), suiv = $('[data-domaine-suiv]', sec), fil = $('[data-domaine-fil]', sec);
  const pas = () => { const c = l.querySelector('.domaine__carte'); return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(l).columnGap || 0) : l.clientWidth * 0.8; };
  const maj = () => {
    const max = l.scrollWidth - l.clientWidth;
    prec.disabled = l.scrollLeft <= 2; suiv.disabled = l.scrollLeft >= max - 2;
    fil.parentElement.style.setProperty('--domaine-vu', String(Math.min(1, (l.clientWidth + l.scrollLeft) / l.scrollWidth)));
  };
  const comportement = () => (etat.calme ? 'auto' : 'smooth');
  prec.addEventListener('click', () => l.scrollBy({ left: -pas(), behavior: comportement() }));
  suiv.addEventListener('click', () => l.scrollBy({ left: pas(), behavior: comportement() }));
  l.addEventListener('scroll', () => requestAnimationFrame(maj), { passive: true });
  addEventListener('resize', maj);
  l.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); suiv.click(); } if (e.key === 'ArrowLeft') { e.preventDefault(); prec.click(); } });
  /* Glisser à la souris (le tactile défile déjà tout seul). */
  let x0 = 0, s0 = 0, saisi = false, bouge = false;
  l.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' || e.button !== 0) return; saisi = true; bouge = false; x0 = e.clientX; s0 = l.scrollLeft; });
  addEventListener('pointermove', (e) => { if (!saisi) return; const dx = e.clientX - x0; if (Math.abs(dx) > 4) { bouge = true; l.classList.add('est-saisi'); } if (bouge) l.scrollLeft = s0 - dx; });
  addEventListener('pointerup', () => { if (!saisi) return; saisi = false; l.classList.remove('est-saisi'); if (bouge) { const p = pas(); l.scrollTo({ left: Math.round(l.scrollLeft / p) * p, behavior: comportement() }); } });
  l.addEventListener('click', (e) => { if (bouge) { e.preventDefault(); e.stopPropagation(); bouge = false; } }, true);
  l.addEventListener('dragstart', (e) => e.preventDefault());
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { sec.classList.add('est-vu'); o.disconnect(); } }, { threshold: 0.2 }).observe(sec);
  maj();
}

/* v7.5 · Réceptions, « Le plan du domaine » : un point touché montre la fiche du lieu (une seule fiche visible). */
function planDomaine() {
  const z = $('[data-plan-domaine]'); if (!z) return;
  const points = $$('[data-plan-point]', z), fiches = $$('[data-plan-fiche]', z);
  const montrer = (cle) => {
    points.forEach((p) => p.setAttribute('aria-pressed', String(p.dataset.planPoint === cle)));
    fiches.forEach((f) => { const ok = f.dataset.planFiche === cle; f.hidden = !ok; f.classList.toggle('est-active', ok); });
  };
  points.forEach((p) => p.addEventListener('click', () => montrer(p.dataset.planPoint)));
}

/* v7.5 · Accueil, « Ici on aime rire… » : la section s'anime une fois à son arrivée ; la note compte de 0 à 4,5. */
function devise() {
  const sec = $('[data-devise]'); if (!sec) return;
  const chiffre = $('[data-devise-chiffre]', sec), cible = +chiffre.dataset.deviseChiffre, texte = chiffre.textContent;
  if (etat.calme) { sec.classList.add('est-vu'); return; }
  new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return;
    o.disconnect(); sec.classList.add('est-vu');
    const t0 = performance.now(), duree = 1300;
    const pas = (t) => { const k = Math.min(1, (t - t0) / duree), v = cible * (1 - Math.pow(1 - k, 3)); chiffre.textContent = k < 1 ? v.toFixed(1).replace('.', ',') : texte; if (k < 1) requestAnimationFrame(pas); };
    requestAnimationFrame(pas);
  }, { threshold: 0.3 }).observe(sec);
}

/* v7.5 · Réceptions, « Ils ont dit oui » : le fil défile au défilement (section collée à l'écran), les photos se balancent avec la
   vitesse ; l'album s'ouvre sur la photo touchée (flèches, clavier, Échap), avec une pluie de confettis à chaque ouverture. */
function oui() {
  const sec = $('[data-oui]'); if (!sec) return;
  const piste = $('[data-oui-piste]', sec), progres = $('[data-oui-progres]', sec), album = $('[data-oui-album]', sec);
  let photos = [], T = {}; try { photos = JSON.parse($('[data-oui-donnees]', sec).textContent); T = JSON.parse($('[data-oui-textes]', sec).textContent); } catch {}
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { sec.classList.add('est-vu'); o.disconnect(); } }, { threshold: 0.25 }).observe(sec);
  /* Le fil qui défile. */
  if (!gsap || !window.ScrollTrigger || etat.calme) sec.classList.add('oui--libre');
  else {
    const distance = () => Math.max(0, piste.scrollWidth - document.documentElement.clientWidth);
    const hauteur = () => { sec.style.height = `calc(100svh + ${Math.round(distance() * 1.1)}px)`; };
    hauteur();
    window.ScrollTrigger.addEventListener('refreshInit', hauteur);
    let calme = 0;
    gsap.to(piste, { x: () => -distance(), ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true,
      onUpdate: (st) => {
        progres.style.setProperty('--p', (0.1 + 0.9 * st.progress).toFixed(3));
        const v = Math.max(-1, Math.min(1, st.getVelocity() / 2400));
        piste.style.setProperty('--vent', `${(v * 7).toFixed(2)}deg`);
        clearTimeout(calme); calme = setTimeout(() => piste.style.setProperty('--vent', '0deg'), 140);
      } } });
  }
  /* L'album. */
  if (!album || !album.showModal || !photos.length) return;
  const img = $('[data-oui-img]', album), leg = $('[data-oui-legende]', album), compte = $('[data-oui-compte]', album);
  let i = 0;
  const montrer = (k) => {
    i = (k + photos.length) % photos.length;
    img.src = photos[i].src; img.alt = photos[i].alt; leg.textContent = photos[i].legende;
    compte.textContent = (T.compte || '{n} / {total}').replace('{n}', i + 1).replace('{total}', photos.length);
  };
  const fete = () => { album.classList.remove('est-fete'); void album.offsetWidth; album.classList.add('est-fete'); };
  let retour = null;
  for (const b of $$('[data-oui-ouvrir]', sec)) b.addEventListener('click', () => { retour = b; montrer(+b.dataset.ouiOuvrir); album.showModal(); fete(); });
  $('[data-oui-prec]', album).addEventListener('click', () => montrer(i - 1));
  $('[data-oui-suiv]', album).addEventListener('click', () => montrer(i + 1));
  $('[data-oui-fermer]', album).addEventListener('click', () => album.close());
  album.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') montrer(i + 1); if (e.key === 'ArrowLeft') montrer(i - 1); });
  album.addEventListener('click', (e) => { if (e.target === album) album.close(); });
  album.addEventListener('close', () => { if (retour) retour.focus(); });
}

/* v7.5 · Accueil, « Carte de la semaine » : cinq paliers de défilement pendant que la carte reste à l'écran ; l'état (data-dej-etape)
   pilote la nappe, les rubriques posées et les assiettes ; en sortie de la scène, la table se lève. */
function carteSemaine() {
  const sec = $('#dejeuner'), scene = sec && $('[data-dej-scene]', sec); if (!scene) return;
  const carte = $('.dej-semaine', scene), collant = $('[data-dej-collant]', scene) || carte, cats = $$('[data-dej-cat]', scene), plats = $$('.dej-plat', sec);
  const actif = () => !etat.calme && matchMedia('(min-width: 861px)').matches;
  const SEUILS = [0.05, 0.2, 0.38, 0.56, 0.74];
  let etape = '';
  /* Chaque assiette posée sur la nappe est une vignette du dessous : elle part de sa place, monte en arc en grandissant et se pose ;
     au retour, elle redescend à sa place et la vignette réapparaît. */
  const vraies = $$('.vraie', sec);
  const voler = (p, aller) => {
    if (!!p._voulu === aller) return; p._voulu = aller;
    const v = vraies[+p.dataset.dejVraie]; if (!v) { p.classList.toggle('est-pose', aller); return; }
    const parent = p.offsetParent || p.parentElement, rp = parent.getBoundingClientRect(), rv = v.getBoundingClientRect();
    const pw = p.offsetWidth, pcx = rp.left + p.offsetLeft + pw / 2, pcy = rp.top + p.offsetTop + pw / 2;
    const dx = rv.left + rv.width / 2 - pcx, dy = rv.top + rv.height / 2 - pcy, sc = rv.width / pw, r = parseFloat(getComputedStyle(p).getPropertyValue('--r')) || 0;
    const depuis = { transform: `translate(${dx}px, ${dy}px) scale(${sc}) rotate(0deg)`, boxShadow: '0 6px 12px -6px rgba(0, 0, 0, .4)' };
    const milieu = { transform: `translate(${dx * 0.42}px, ${dy * 0.42 - 80}px) scale(${((sc + 1) / 2) * 1.12}) rotate(${r / 2}deg)`, boxShadow: '0 46px 60px -24px rgba(0, 0, 0, .6)' };
    const pose = { transform: `rotate(${r}deg)`, boxShadow: '0 24px 38px -18px rgba(0, 0, 0, .6)' };
    p.getAnimations().forEach((x) => x.cancel());
    if (aller) {
      v.classList.add('est-envolee'); p.classList.add('est-pose');
      p.animate([depuis, { ...milieu, offset: 0.55 }, pose], { duration: 850, easing: 'cubic-bezier(.3, .6, .3, 1)' });
    } else {
      p.animate([pose, { ...milieu, offset: 0.45 }, depuis], { duration: 700, easing: 'cubic-bezier(.5, 0, .5, 1)' }).finished
        .then(() => { if (!p._voulu) { p.classList.remove('est-pose'); v.classList.remove('est-envolee'); } }, () => {});
    }
  };
  /* e : palier de la table (0 à 5) ; apres : la scène est passée (la table se lève, les rubriques restent posées sur la carte). */
  const poser = (e, apres = false) => {
    const cle = `${e}${apres ? '+' : ''}`; if (cle === etape) return; etape = cle;
    sec.dataset.dejEtape = String(e);
    sec.classList.toggle('est-nappe', e >= 1); sec.classList.toggle('est-dresse', apres);
    cats.forEach((c, k) => { c.classList.toggle('est-pose', apres || e >= k + 2); c.classList.toggle('est-actif', !apres && e === k + 2); });
    plats.forEach((p, k) => voler(p, e >= k + 2));
  };
  /* Le bloc fixé (titre et carte) se centre dans l'écran ; s'il est trop haut, il se resserre. Réserve : la ligne de prix
     de la rubrique en cours. */
  let hautBloc = 0;
  const mesurer = () => {
    sec.classList.remove('est-serre', 'est-tres-serre');
    const dispo = innerHeight - 24, reserve = 30;
    let h = collant.offsetHeight + reserve;
    if (h > dispo) { sec.classList.add('est-serre'); h = collant.offsetHeight + reserve; }
    if (h > dispo) { sec.classList.add('est-tres-serre'); h = collant.offsetHeight + reserve; }
    hautBloc = Math.round(Math.max(12, (innerHeight - h) / 2));
    sec.style.setProperty('--dej-haut', `${hautBloc}px`);
    scene.style.setProperty('--dej-bloc-h', `${collant.offsetHeight}px`);
  };
  const haut = () => hautBloc || (parseFloat(getComputedStyle(html).getPropertyValue('--entete-h')) || 0) + 24;
  const course = () => Math.max(1, scene.offsetHeight - collant.offsetHeight);
  const maj = () => {
    if (!actif()) { delete sec.dataset.dejEtape; sec.classList.remove('est-nappe', 'est-serre', 'est-tres-serre'); sec.style.removeProperty('--dej-haut'); cats.forEach((c) => c.classList.add('est-pose', 'est-actif')); etape = ''; return; }
    const r = scene.getBoundingClientRect(), p = (haut() - r.top) / course();
    if (p > 1.02) poser(0, true); else poser(p < 0 ? 0 : SEUILS.filter((s) => p >= s).length);
  };
  let attente = false;
  addEventListener('scroll', () => { if (!attente) { attente = true; requestAnimationFrame(() => { attente = false; maj(); }); } }, { passive: true });
  addEventListener('resize', () => { mesurer(); etape = ''; maj(); });
  for (const b of $$('[data-dej-aller]', scene)) b.addEventListener('click', () => {
    if (!actif()) return;
    const k = +b.dataset.dejAller, y = scene.getBoundingClientRect().top + scrollY - haut() + course() * ((SEUILS[k + 1] + (SEUILS[k + 2] || 0.9)) / 2);
    aller(y);
  });
  mesurer(); maj();
}

/* v7.5 · À emporter : panier (un seul état, gardé dans le navigateur s'il le permet), jour et moment de retrait selon les horaires,
   pastille flottante, envol vers la commande à l'ajout, commande simulée avec récapitulatif. */
/* v7.5.14 · Le pied de page : le nom de la maison en très grand, chaque lettre se soulève sous la main (vague douce autour
   du pointeur), et retombe quand la main s'en va. Animations réduites ou écran tactile : rien ne bouge. */
function piedMarque() {
  const m = $('[data-pied-marque]'); if (!m || etat.calme || !matchMedia('(hover: hover)').matches) return;
  const texte = m.textContent;
  m.textContent = '';
  const lettres = [...texte].map((ch) => { const sp = document.createElement('span'); sp.textContent = ch; if (ch === ' ') sp.className = 'espace'; m.append(sp); return sp; });
  let centres = [], raf = 0, x = -1e4, y = -1e4;
  const mesurer = () => { centres = lettres.map((l) => { const r = l.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }); };
  const peindre = () => {
    raf = 0;
    lettres.forEach((l, i) => {
      const [cx, cy] = centres[i] || [0, 0];
      const d = Math.hypot((x - cx) / 1.4, (y - cy) * 1.6), k = Math.max(0, 1 - d / 220);
      l.style.transform = k ? `translateY(${(-k * 28).toFixed(1)}px) rotate(${((x - cx) / 220 * -6 * k).toFixed(2)}deg)` : '';
      l.style.color = k ? `color-mix(in oklab, #e9c46a ${Math.round(k * 100)}%, rgba(246, 239, 226, .1))` : '';
    });
  };
  m.addEventListener('pointerenter', mesurer);
  m.addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; if (!raf) raf = requestAnimationFrame(peindre); });
  m.addEventListener('pointerleave', () => { x = y = -1e4; if (!raf) raf = requestAnimationFrame(peindre); });
  addEventListener('scroll', () => { if (centres.length) centres = []; }, { passive: true });
  m.addEventListener('pointermove', () => { if (!centres.length) mesurer(); });
}

/* v7.5.14 · Évènements, la Saint-Sylvestre en scène : la section reste à l'écran, chaque palier de défilement sert un temps du
   dîner (numéro, plat, détail) ; à droite, le verre prend la forme et la couleur du vin de l'accord, le vin y monte. La bascule
   « Avec l'accord mets et vins » vide ou remplit le verre et fait passer le prix de 170 € à 120 €. La table des cinq temps, en
   bas, mène à chacun. Téléphone, animations réduites ou sans JavaScript : les cinq plats l'un sous l'autre, chacun avec son vin. */
function saintSylvestre() {
  const sec = $('[data-ss]'); if (!sec) return;
  const plats = $$('[data-ss-plat]', sec), pas = $$('[data-ss-aller]', sec), formes = $$('[data-forme]', sec), n = plats.length;
  const typeEl = $('[data-ss-type]', sec), vinEl = $('[data-ss-vin]', sec), regionEl = $('[data-ss-region]', sec), fiche = $('.ss__accord', sec);
  const bascule = $('[data-ss-accord]', sec), prix = $('[data-ss-prix]', sec), prixDetail = $('[data-ss-prix-detail]', sec);
  const scene = window.matchMedia('(min-width: 861px)');
  let actif = -1;
  const activer = (i) => {
    if (i === actif) return;
    actif = i;
    plats.forEach((p, k) => { p.classList.toggle('est-actif', k === i); p.classList.toggle('est-passe', k < i); });
    pas.forEach((b, k) => { b.classList.toggle('est-fait', k < i); if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    const p = plats[i];
    sec.style.setProperty('--vin', p.dataset.couleur);
    formes.forEach((f) => f.classList.toggle('est-active', f.dataset.forme === p.dataset.verre));
    typeEl.textContent = p.dataset.type; vinEl.textContent = p.dataset.vin; regionEl.textContent = p.dataset.region;
    if (!etat.calme && fiche.animate) fiche.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: 'cubic-bezier(.2,.8,.2,1)' });
    /* v7.5.15 · Au dessert, minuit : une pluie d'or et de paillettes traverse la scène, trois ondes dorées partent du verre et
       les bulles montent plus vite. Doux (aucun éclair) ; rejoué à chaque retour sur le dessert. */
    if (i === n - 1 && enScene()) minuit(); else sec.classList.remove('est-minuit');
  };
  const pluie = $('[data-ss-minuit]', sec), verre = $('.ss__verre', sec);
  const minuit = () => {
    sec.classList.add('est-minuit');
    if (!pluie || etat.calme) return;
    pluie.textContent = '';
    const couleurs = ['#f3d98f', '#e9c46a', '#fff3c4', '#d9a043', '#fbf4e6'];
    for (let k = 0; k < 64; k++) {
      const e = document.createElement('span');
      e.className = k % 3 ? 'ss__or' : 'ss__or ss__or--ruban';
      e.style.cssText = `--x:${(Math.random() * 100).toFixed(1)}%;--t:${(3.2 + Math.random() * 2.6).toFixed(2)}s;--r:${(Math.random() * .9).toFixed(2)}s;--b:${(Math.random() * 60 - 30).toFixed(0)}px;--c:${couleurs[k % couleurs.length]};--s:${(.6 + Math.random() * .9).toFixed(2)}`;
      pluie.append(e);
    }
    for (let k = 0; k < 3; k++) { const o = document.createElement('span'); o.className = 'ss__onde'; o.style.animationDelay = `${k * .55}s`; verre.append(o); setTimeout(() => o.remove(), 2600 + k * 550); }
    clearTimeout(pluie._fin); pluie._fin = setTimeout(() => { pluie.textContent = ''; }, 6400);
  };
  const accord = () => {
    const oui = bascule.checked;
    sec.dataset.accord = oui ? 'oui' : 'non';
    prix.textContent = oui ? prix.dataset.avec : prix.dataset.sans;
    prixDetail.textContent = oui ? prixDetail.dataset.avec : prixDetail.dataset.sans;
    if (!etat.calme && prix.animate) prix.animate([{ transform: 'scale(1.18)', color: '#fff3d4' }, { transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.2,1.4,.4,1)' });
  };
  bascule.addEventListener('change', accord);
  const enScene = () => scene.matches && !etat.calme;
  const course = () => Math.max(1, sec.offsetHeight - innerHeight);
  let attente = false;
  const maj = () => {
    attente = false;
    sec.classList.toggle('ss--scene', enScene());
    if (!enScene()) return;
    const p = Math.min(0.9999, Math.max(0, -sec.getBoundingClientRect().top / course()));
    sec.style.setProperty('--ss-p', p.toFixed(4));
    activer(Math.floor(p * n));
  };
  pas.forEach((b, k) => b.addEventListener('click', () => {
    if (!enScene()) { plats[k].scrollIntoView({ behavior: etat.calme ? 'auto' : 'smooth', block: 'center' }); activer(k); return; }
    aller(sec.getBoundingClientRect().top + scrollY + course() * ((k + 0.5) / n));
  }));
  addEventListener('scroll', () => { if (!attente) { attente = true; requestAnimationFrame(maj); } }, { passive: true });
  addEventListener('resize', maj);
  scene.addEventListener('change', maj);
  /* Hors scène (la liste), le verre suit le plat survolé ou parcouru au clavier. */
  plats.forEach((p, k) => { const suivre = () => { if (!enScene()) activer(k); }; p.addEventListener('pointerenter', suivre); p.addEventListener('focusin', suivre); });
  activer(0); accord(); maj();
}

/* v7.5.13 · Évènements, « Les prochaines dates » : la photo de gauche reste à l'écran et suit la date qu'on lit (celle qui
   passe au tiers haut de l'écran) : fondu entre les photos, la date en grand et le nom de la soirée sur la photo. */
function datesSync() {
  const sec = $('#dates'), visuel = sec && $('[data-dates-visuel]', sec); if (!visuel) return;
  const imgs = $$('[data-dates-image]', visuel), jour = $('[data-dates-jour]', visuel), mois = $('[data-dates-mois]', visuel), nom = $('[data-dates-nom]', visuel);
  const badge = $('.dates__badge', visuel);
  const fmtMois = new Intl.DateTimeFormat('fr-FR', { month: 'short', timeZone: 'UTC' });
  let courant = null, attente = false;
  const montrer = (li) => {
    if (!li || li === courant) return;
    if (courant) courant.classList.remove('est-lue');
    courant = li; li.classList.add('est-lue');
    imgs.forEach((im) => im.classList.toggle('est-active', im.dataset.datesImage === li.dataset.image));
    const d = new Date(`${li.dataset.debut.slice(0, 10)}T12:00:00Z`);
    jour.textContent = d.getUTCDate(); mois.textContent = fmtMois.format(d).replace('.', '');
    nom.textContent = $('.agd__titre', li)?.textContent || '';
    if (!etat.calme && badge.animate) badge.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' });
  };
  const choisir = () => {
    attente = false;
    const liste = $$('.agd__date', sec).filter((li) => !li.hidden && !li.closest('details:not([open])') && li.offsetParent);
    if (!liste.length) return;
    const repere = innerHeight * 0.38;
    let meilleur = liste[0];
    for (const li of liste) { const r = li.getBoundingClientRect(); if (r.top <= repere) meilleur = li; }
    montrer(meilleur);
  };
  addEventListener('scroll', () => { if (!attente) { attente = true; requestAnimationFrame(choisir); } }, { passive: true });
  sec.addEventListener('click', () => setTimeout(choisir, 60));
  new MutationObserver(() => { if (!attente) { attente = true; requestAnimationFrame(choisir); } }).observe(sec, { subtree: true, attributes: true, attributeFilter: ['hidden', 'open'], childList: true });
  choisir();
}

/* v7.5.15 · Offrir, la carte cadeau en vrai objet : elle s'incline vers la souris (sur toute l'ouverture), son reflet doré
   suit la main ; un toucher la retourne, un second la remet à l'endroit (Échap aussi). */
function carteObjet() {
  const w = $('[data-cca]'); if (!w) return;
  const sec = w.closest('section') || w, objet = $('.cca__objet', w), bouton = $('[data-cca-retourner]', w), dos = $('.cca__dos', w);
  let raf = 0, cible = [0, 0, 30, 25];
  const poser = () => { raf = 0; const [px, py, mx, my] = cible; objet.style.setProperty('--px', `${px.toFixed(2)}deg`); objet.style.setProperty('--py', `${py.toFixed(2)}deg`); w.style.setProperty('--mx', `${mx.toFixed(1)}%`); w.style.setProperty('--my', `${my.toFixed(1)}%`); };
  if (matchMedia('(hover: hover)').matches) {
    sec.addEventListener('pointermove', (e) => {
      const r = w.getBoundingClientRect(), x = (e.clientX - (r.left + r.width / 2)) / Math.max(r.width, 1), y = (e.clientY - (r.top + r.height / 2)) / Math.max(r.height, 1);
      const cx = Math.max(-1, Math.min(1, x)), cy = Math.max(-1, Math.min(1, y));
      cible = [cx * 16, -cy * 12, 50 + cx * 45, 50 + cy * 45];
      if (!raf) raf = requestAnimationFrame(poser);
    });
    sec.addEventListener('pointerleave', () => { cible = [0, 0, 30, 25]; if (!raf) raf = requestAnimationFrame(poser); });
  }
  const retourner = (oui) => {
    w.classList.add('est-tourne'); clearTimeout(w._t); w._t = setTimeout(() => w.classList.remove('est-tourne'), 1000);
    w.classList.toggle('est-retournee', oui); bouton.setAttribute('aria-pressed', String(oui)); dos.setAttribute('aria-hidden', String(!oui));
  };
  bouton.addEventListener('click', () => retourner(!w.classList.contains('est-retournee')));
  w.addEventListener('keydown', (e) => { if (e.key === 'Escape' && w.classList.contains('est-retournee')) retourner(false); });
}

/* v7.5.15 · Évènements, les affiches à prendre en main : inclinaison et reflet vers la souris ; on attrape une affiche, elle
   se soulève et suit la main (elle penche selon la vitesse), puis revient à sa place ; un clic la retourne (au dos, le menu),
   « Retourner l'affiche » ou Échap la remet à l'endroit. Une fois, après l'arrivée, la Saint-Sylvestre se tourne un peu
   pour montrer le geste. */
function affiches() {
  const toutes = $$('[data-affiche]'); if (!toutes.length) return;
  let touchee = false;
  for (const a of toutes) {
    const avant = $('[data-affiche-avant]', a), dos = $('.affiche__face--dos', a), retour = $('[data-affiche-retour]', a);
    const liens = $$('a, button', dos);
    /* Avec JavaScript, la face avant est un bouton (elle retourne l'affiche) ; sans, un lien vers la section. */
    avant.removeAttribute('href'); avant.setAttribute('role', 'button'); avant.tabIndex = 0;
    avant.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); avant.click(); } });
    let depart = null, tire = false, ignorer = false, dernier = null;
    const incliner = (e) => {
      if (depart || a.classList.contains('est-retournee')) return;
      const r = a.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      a.style.setProperty('--rx', `${(-y * 14).toFixed(2)}deg`); a.style.setProperty('--ry', `${(x * 18).toFixed(2)}deg`);
      a.style.setProperty('--mx', `${((x + .5) * 100).toFixed(1)}%`); a.style.setProperty('--my', `${((y + .5) * 100).toFixed(1)}%`);
    };
    const redresser = () => { a.style.setProperty('--rx', '0deg'); a.style.setProperty('--ry', '0deg'); };
    const retourner = (oui) => {
      a.classList.toggle('est-retournee', oui);
      avant.setAttribute('aria-expanded', String(oui)); dos.setAttribute('aria-hidden', String(!oui));
      liens.forEach((l) => { l.tabIndex = oui ? 0 : -1; });
      redresser();
      if (oui) setTimeout(() => retour.focus({ preventScroll: true }), 420); else avant.focus({ preventScroll: true });
    };
    a.addEventListener('pointermove', incliner);
    a.addEventListener('pointerleave', () => { if (!depart) redresser(); });
    avant.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      touchee = true; depart = { x: e.clientX, y: e.clientY }; tire = false; dernier = { x: e.clientX, t: performance.now() };
      avant.setPointerCapture(e.pointerId);
    });
    avant.addEventListener('pointermove', (e) => {
      if (!depart) return;
      const dx = e.clientX - depart.x, dy = e.clientY - depart.y;
      if (!tire && Math.hypot(dx, dy) < 7) return;
      if (!tire) { tire = true; a.classList.add('est-tenue'); redresser(); }
      const t = performance.now(), v = (e.clientX - dernier.x) / Math.max(8, t - dernier.t); dernier = { x: e.clientX, t };
      a.style.setProperty('--dx', `${dx}px`); a.style.setProperty('--dy', `${dy}px`);
      a.style.setProperty('--dr', `${Math.max(-14, Math.min(14, v * 9)).toFixed(2)}deg`);
    });
    const lacher = () => {
      if (!depart) return;
      depart = null;
      if (tire) { ignorer = true; a.classList.remove('est-tenue'); ['--dx', '--dy', '--dr'].forEach((k) => a.style.setProperty(k, k === '--dr' ? '0deg' : '0px')); }
    };
    avant.addEventListener('pointerup', lacher); avant.addEventListener('pointercancel', lacher);
    avant.addEventListener('click', (e) => {
      e.preventDefault();
      if (ignorer) { ignorer = false; return; }
      touchee = true; retourner(!a.classList.contains('est-retournee'));
    });
    avant.addEventListener('dragstart', (e) => e.preventDefault());
    retour.addEventListener('click', () => retourner(false));
    a.addEventListener('keydown', (e) => { if (e.key === 'Escape' && a.classList.contains('est-retournee')) retourner(false); });
  }
  /* L'indice : une fois, deux secondes après l'arrivée, si personne n'a encore touché une affiche. */
  const ss = $('.affiche--sylvestre');
  if (ss && !etat.calme) quand('pret', () => setTimeout(() => { if (touchee || !ss.offsetParent || scrollY > innerHeight * .5) return; ss.classList.add('est-indice'); setTimeout(() => ss.classList.remove('est-indice'), 1700); }, 1800));
}

/* v7.5.15 · Traiteur, « Le calendrier du retrait » : les portes s'ouvrent en cascade quand le calendrier arrive à l'écran ;
   un jour ouvert touché coche le même jour dans la commande (le panneau suit) et s'illumine, quelques éclats d'or en sortent.
   Un jour choisi dans le panneau s'allume aussi dans le calendrier. */
function aventCalendrier() {
  const sec = $('[data-avent]'); if (!sec) return;
  const choix = $('[data-avent-choix]', sec), modele = sec.dataset.choisi, ou = sec.dataset.ou, le = sec.dataset.le;
  const ouvrir = () => sec.classList.add('est-ouvert');
  if (etat.calme || !('IntersectionObserver' in window)) ouvrir();
  else { const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { ouvrir(); io.disconnect(); } }, { threshold: 0.2 }); io.observe($('.avent__mur', sec)); }
  const radio = (iso) => $(`[name="jour"][value="${iso}"]`);
  const auj = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date());
  for (const b of $$('[data-avent-jour]', sec)) if (b.dataset.aventJour < auj) { b.disabled = true; b.closest('li').classList.add('est-passe'); }
  const marquer = (iso) => {
    for (const b of $$('[data-avent-jour]', sec)) { const oui = b.dataset.aventJour === iso; b.setAttribute('aria-pressed', String(oui)); b.closest('li').classList.toggle('est-choisi', oui); }
    const r = iso && radio(iso);
    if (!r) return;
    const moments = [r.dataset.midi === '1' && 'midi', r.dataset.soir === '1' && 'soir'].filter(Boolean).map((x) => `${le} ${x}`).join(` ${ou} `);
    choix.textContent = modele.replace('{jour}', r.dataset.libelle).replace('{moments}', moments);
  };
  const eclats = (cellule) => {
    if (etat.calme || !cellule.animate) return;
    for (let k = 0; k < 12; k++) {
      const e = document.createElement('span'); e.className = 'avent__eclat'; cellule.append(e);
      const a = (k / 12) * Math.PI * 2 + Math.random() * .4, d = 40 + Math.random() * 46;
      e.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px) scale(.2)`, opacity: 0 }], { duration: 760 + Math.random() * 300, easing: 'cubic-bezier(.2,.8,.2,1)' }).onfinish = () => e.remove();
    }
  };
  sec.addEventListener('click', (e) => {
    const b = e.target.closest('[data-avent-jour]'); if (!b || b.disabled) return;
    const r = radio(b.dataset.aventJour); if (!r || r.disabled) return;
    r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true }));
    marquer(b.dataset.aventJour); eclats(b);
  });
  document.addEventListener('change', (e) => { if (e.target.name === 'jour' && e.target.checked && !sec.contains(e.target)) marquer(e.target.value); });
  const deja = $('[name="jour"]:checked'); if (deja) marquer(deja.value);
}

/* v7.5.15 · La carte, « Toute la carte » : la grande photo de gauche suit la rubrique lue (celle qui passe au tiers haut de
   l'écran) ; fondu enchaîné, numéro, nom, fourchette de prix et nombre de plats ; la rubrique lue est marquée d'un trait. */
function carteSynchro() {
  const visuel = $('[data-carte-visuel]'); if (!visuel) return;
  const sec = visuel.closest('.carte-resto'), imgs = $$('[data-carte-image]', visuel);
  const num = $('[data-carte-num]', visuel), nom = $('[data-carte-nom]', visuel), detail = $('[data-carte-detail]', visuel), badge = $('.carte-synchro__badge', visuel);
  let courant = null, attente = false;
  const montrer = (rub) => {
    if (!rub || rub === courant) return;
    if (courant) courant.classList.remove('est-lue');
    courant = rub; rub.classList.add('est-lue');
    const im = imgs.find((x) => x.dataset.carteImage === rub.dataset.rubrique) || imgs[0];
    imgs.forEach((x) => x.classList.toggle('est-active', x === im));
    num.textContent = im.dataset.numero; nom.textContent = im.dataset.titre; detail.textContent = im.dataset.detail;
    if (badge.animate) badge.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 560, easing: 'cubic-bezier(.2,.8,.2,1)' });
  };
  const choisir = () => {
    attente = false;
    if (!visuel.offsetParent) return;
    const liste = $$('.carte-resto__rubrique', sec).filter((r) => !r.hidden && r.offsetParent);
    if (!liste.length) return;
    const repere = innerHeight * 0.42;
    let meilleur = liste[0];
    for (const r of liste) if (r.getBoundingClientRect().top <= repere) meilleur = r;
    montrer(meilleur);
  };
  const demander = () => { if (!attente) { attente = true; requestAnimationFrame(choisir); } };
  addEventListener('scroll', demander, { passive: true });
  addEventListener('resize', demander);
  new MutationObserver(demander).observe(sec, { subtree: true, attributes: true, attributeFilter: ['hidden', 'aria-pressed'] });
  choisir();
}

/* v7.5.13 · Traiteur, « la ronde des cloches » : les cloches tournent en cercle (perspective calculée : position, taille,
   lumière et profondeur) ; celle de devant soulève son verre et donne nom et prix. Tour automatique toutes les 3,6 s quand la
   section est visible, en pause au survol ou au clavier ; flèches ; clic sur une cloche pour la faire venir, sur celle de
   devant pour la retrouver dans la vitrine. Animations réduites : pas de tour automatique, changement sans glissement. */
function rondeHero() {
  const sec = $('[data-ronde]'); if (!sec) return;
  const scene = $('.ronde', sec), items = $$('.ronde__cloche', sec), n = items.length; if (!n) return;
  const nomEl = $('[data-ronde-nom]', sec), prixEl = $('[data-ronde-prix]', sec), numEl = $('[data-ronde-num]', sec), legende = $('.ronde__legende', sec);
  const pas = (Math.PI * 2) / n;
  let phi = 0, cible = 0, actif = -1, raf = 0, survol = false, visible = true, dernier = performance.now() + 2600; /* premier tour après l'ouverture */
  let rx = 0, ry = 0;
  const mesurer = () => { rx = scene.clientWidth * 0.34; ry = scene.clientHeight * 0.12; };
  const placer = () => {
    items.forEach((el, i) => {
      const a = Math.PI / 2 + i * pas - phi, sin = Math.sin(a), k = (1 + sin) / 2;
      const x = Math.cos(a) * rx, y = sin * ry, s = 0.5 + 0.5 * Math.pow(k, 1.3);
      el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${s.toFixed(3)})`;
      el.style.zIndex = String(Math.round(k * 100));
      el.style.setProperty('--k', k.toFixed(3));
    });
    const i = ((Math.round(phi / pas) % n) + n) % n;
    if (i !== actif) {
      const premier = actif === -1; actif = i;
      items.forEach((el, j) => { el.classList.toggle('est-devant', j === i); el.querySelector('[data-ronde-bouton]').tabIndex = j === i ? 0 : -1; });
      const el = items[i];
      numEl.textContent = `N° ${el.dataset.num}`; nomEl.textContent = el.dataset.nom; prixEl.textContent = el.dataset.prix;
      if (!etat.calme && legende.animate && !premier) legende.animate([{ opacity: .5, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 480, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
  };
  const tourner = (t) => {
    raf = 0;
    if (!etat.calme && visible && !survol && t - dernier > 3600) { cible += pas; dernier = t; }
    phi += (cible - phi) * (etat.calme ? 1 : 0.075);
    if (Math.abs(cible - phi) < 0.0004) phi = cible;
    placer();
    if (visible && !etat.calme) raf = requestAnimationFrame(tourner);
  };
  const relancer = () => { if (!raf) raf = requestAnimationFrame(tourner); };
  const aller_ = (delta) => { cible = Math.round(cible / pas) * pas + delta * pas; dernier = performance.now(); relancer(); if (etat.calme) { phi = cible; placer(); } };
  $('[data-ronde-prec]', sec).addEventListener('click', () => aller_(-1));
  $('[data-ronde-suiv]', sec).addEventListener('click', () => aller_(1));
  items.forEach((el, i) => el.querySelector('[data-ronde-bouton]').addEventListener('click', () => {
    if (i !== actif) { let d = (i - actif) % n; if (d > n / 2) d -= n; if (d < -n / 2) d += n; aller_(d); return; }
    const carte = $(`#produits [data-produit="${el.dataset.id}"]`); if (!carte) return;
    aller(carte);
    const cl = $('.emp-cloche', carte);
    setTimeout(() => { cl.classList.add('est-levee'); setTimeout(() => cl.classList.remove('est-levee'), 2600); }, etat.calme ? 0 : 900);
  }));
  scene.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); aller_(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); aller_(-1); } });
  sec.addEventListener('pointerenter', () => { survol = true; });
  sec.addEventListener('pointerleave', () => { survol = false; dernier = performance.now(); });
  sec.addEventListener('focusin', () => { survol = true; });
  sec.addEventListener('focusout', () => { survol = false; });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting && !document.hidden; if (visible) { dernier = performance.now(); relancer(); } }, { threshold: 0.2 }).observe(scene);
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) relancer(); });
  addEventListener('resize', () => { mesurer(); placer(); });
  /* Au défilement, la ronde tourne avec la page, puis se pose sur le plat le plus proche. */
  let yAvant = scrollY, pose = 0;
  addEventListener('scroll', () => {
    const dy = scrollY - yAvant; yAvant = scrollY;
    if (etat.calme || !visible || !dy) return;
    cible += dy * 0.004; dernier = performance.now();
    clearTimeout(pose); pose = setTimeout(() => { cible = Math.round(cible / pas) * pas; relancer(); }, 240);
    relancer();
  }, { passive: true });
  mesurer(); placer(); relancer();
}

/* v7.5.8 · À emporter, la vitrine sous cloches : la cloche s'ouvre au toucher (ou au clavier) et se referme au second. */
function vitrineCloches() {
  for (const cl of $$('[data-emp-cloche]')) {
    const b = $('.emp-cloche__verre', cl);
    b.addEventListener('click', () => { const o = !cl.classList.contains('est-levee'); cl.classList.toggle('est-levee', o); b.setAttribute('aria-pressed', String(o)); });
  }
}
function emporter() {
  const src = $('[data-emp-textes]'); if (!src) return;
  let T; try { T = JSON.parse(src.textContent); } catch { return; }
  const CLE = 'hacienda-emporter';
  const form = $('[data-emp-form]'), lignesEl = $('[data-panier-lignes]'), vide = $('[data-panier-vide]'), totalEl = $('[data-panier-total]'), retraitEl = $('[data-panier-retrait]');
  const pastille = $('[data-emp-pastille]'), nbEl = $('[data-pastille-nombre]'), ptEl = $('[data-pastille-total]'), annonce = $('[data-emp-annonce]'), merci = $('[data-emp-merci]');
  const euros = (n) => `${(Math.round(n * 100) / 100).toLocaleString('fr-FR', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })} €`;
  const fmt = (t, v) => t.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? '');
  let lignes = [];
  try { lignes = JSON.parse(localStorage.getItem(CLE) || '[]').filter((l) => T.produits[l.id] && l.qte > 0); } catch { lignes = []; }
  const garder = () => { try { localStorage.setItem(CLE, JSON.stringify(lignes)); } catch {} };
  const prixLigne = (l) => T.produits[l.id].prix * (l.poids || 1) * l.qte;
  const nomLigne = (l) => T.produits[l.id].nom + (l.poids ? ` · ${String(l.poids).replace('.', ',')} kg` : '');
  const total = () => lignes.reduce((s, l) => s + prixLigne(l), 0);
  const nombre = () => lignes.reduce((s, l) => s + l.qte, 0);
  let commandeVue = false;
  /* v7.5.11 · Le tiroir de la commande, à droite : lignes avec vignette du plat, quantités, retrait d'une ligne, total. */
  const tiroir = $('[data-emp-tiroir]'), dansTiroir = (sel) => tiroir && $(sel, tiroir);
  const tLignes = dansTiroir('[data-tiroir-lignes]'), tVide = dansTiroir('[data-tiroir-vide]'), tTotal = dansTiroir('[data-tiroir-total]');
  const tNombre = dansTiroir('[data-tiroir-nombre]'), tAjoute = dansTiroir('[data-tiroir-ajoute]'), tPanneau = dansTiroir('.emp-tiroir__panneau');
  const cleLigne = (l) => `${l.id}|${l.poids || 0}`;
  const vignette = (id) => {
    const v = T.produits[id].vignette;
    if (v) { const i = document.createElement('img'); i.src = v; i.alt = ''; i.width = 64; i.height = 64; i.decoding = 'async'; return i; }
    const sv = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); sv.setAttribute('viewBox', '70 230 260 160'); sv.setAttribute('aria-hidden', 'true');
    const u = document.createElementNS('http://www.w3.org/2000/svg', 'use'); u.setAttribute('href', `#pl-${id}`); u.setAttribute('width', '400'); u.setAttribute('height', '430'); sv.append(u); return sv;
  };
  const changer = (l, delta) => { l.qte += delta; if (l.qte <= 0) lignes.splice(lignes.indexOf(l), 1); garder(); rendre(); };
  const rendreTiroir = (nouvelle) => {
    if (!tiroir) return;
    tLignes.replaceChildren(...lignes.map((l) => {
      const p = T.produits[l.id], nom = nomLigne(l);
      const li = document.createElement('li'); li.className = 'emp-tl' + (cleLigne(l) === nouvelle ? ' est-nouvelle' : ''); li.dataset.cle = cleLigne(l);
      li.innerHTML = '<span class="emp-tl__vignette"></span><span class="emp-tl__corps"><span class="emp-tl__nom"></span><span class="emp-tl__unite"></span></span><span class="emp-tl__prix"></span><span class="emp-tl__qte"><button type="button" data-action="moins"></button><span></span><button type="button" data-action="plus"></button></span><button type="button" class="emp-tl__retirer" data-action="retirer"></button>';
      li.querySelector('.emp-tl__vignette').append(vignette(l.id));
      li.querySelector('.emp-tl__nom').textContent = nom;
      li.querySelector('.emp-tl__unite').textContent = fmt(p.unite === 'kg' ? T.tiroirKg : T.tiroirUnite, { prix: euros(p.prix) });
      li.querySelector('.emp-tl__prix').textContent = euros(prixLigne(l));
      li.querySelector('.emp-tl__qte span').textContent = l.qte;
      const [m, pl, r] = li.querySelectorAll('button');
      m.textContent = '−'; pl.textContent = '+'; r.textContent = T.tiroirRetirerTexte;
      m.setAttribute('aria-label', fmt(T.moins, { nom })); pl.setAttribute('aria-label', fmt(T.plus, { nom })); r.setAttribute('aria-label', fmt(T.tiroirRetirer, { nom }));
      m.addEventListener('click', () => changer(l, -1)); pl.addEventListener('click', () => changer(l, 1)); r.addEventListener('click', () => changer(l, -l.qte));
      return li;
    }));
    tVide.hidden = lignes.length > 0;
    tTotal.textContent = euros(total());
    const n = nombre(); tNombre.textContent = n === 1 ? T.tiroirNombreUn : fmt(T.tiroirNombre, { n });
    majPied();
  };
  /* v7.5.12 · Les étapes du panneau : commande, retrait (calendrier et moment), coordonnées, puis le merci. */
  const ORDRE = ['panier', 'retrait', 'coordonnees'];
  const titreT = dansTiroir('[data-tiroir-titre]'), retourT = dansTiroir('[data-tiroir-retour]'), tRetrait = dansTiroir('[data-tiroir-retrait]');
  const pasActuel = () => (tiroir && tiroir.dataset.pas) || 'panier';
  const majPied = () => {
    if (!tiroir) return;
    const nom = pasActuel();
    for (const b of $$('[data-pied]', tiroir)) b.hidden = !b.dataset.pied.split(' ').includes(nom) || (nom === 'panier' && b.hasAttribute('data-tiroir-valider') && !lignes.length);
  };
  const etape = (nom, { focus = true } = {}) => {
    if (!tiroir) return;
    tiroir.dataset.pas = nom;
    titreT.textContent = titreT.dataset[nom];
    const k = ORDRE.indexOf(nom);
    for (const li of $$('[data-fil]', tiroir)) {
      const i = ORDRE.indexOf(li.dataset.fil);
      li.classList.toggle('est-fait', nom === 'merci' || i < k);
      if (li.dataset.fil === nom) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    }
    for (const d of $$('[data-form-etape]', form)) d.hidden = d.dataset.formEtape !== nom;
    retourT.hidden = nom === 'panier' || nom === 'merci';
    if (nom !== 'panier') tAjoute.hidden = true;
    majPied(); retrait();
    dansTiroir('.emp-tiroir__defile').scrollTop = 0;
    if (focus) titreT.focus({ preventScroll: true });
  };
  /* Après un rendu, le focus revient sur le même bouton de la même ligne (ou sur la fermeture si la ligne a disparu). */
  const garderFocus = (faire) => {
    const f = document.activeElement, li = f && f.closest && f.closest('.emp-tl'), action = f && f.dataset && f.dataset.action;
    faire();
    if (!li || !tiroir || !tiroir.open) return;
    const meme = $(`.emp-tl[data-cle="${CSS.escape(li.dataset.cle)}"] [data-action="${action}"]`, tiroir);
    (meme || $('.emp-tl [data-action="plus"]', tiroir) || $('.emp-tiroir__fermer', tiroir)).focus({ preventScroll: true });
  };
  let nouvelle = '';
  const rendre = () => garderFocus(() => { rendreListe(); rendreTiroir(nouvelle); nouvelle = ''; });
  const rendreListe = () => {
    lignesEl.replaceChildren(...lignes.map((l, k) => {
      const li = document.createElement('li'); li.className = 'emp-ligne';
      const nom = nomLigne(l);
      li.innerHTML = `<span class="emp-ligne__nom"></span><span class="emp-ligne__qte"><button type="button" data-moins></button><span></span><button type="button" data-plus></button></span><span class="emp-ligne__prix"></span>`;
      li.querySelector('.emp-ligne__nom').textContent = nom;
      const [m, p] = li.querySelectorAll('button');
      m.textContent = '−'; p.textContent = '+';
      m.setAttribute('aria-label', fmt(T.moins, { nom })); p.setAttribute('aria-label', fmt(T.plus, { nom }));
      li.querySelector('.emp-ligne__qte span').textContent = l.qte;
      li.querySelector('.emp-ligne__prix').textContent = euros(prixLigne(l));
      m.addEventListener('click', () => { l.qte--; if (l.qte <= 0) lignes.splice(k, 1); garder(); rendre(); });
      p.addEventListener('click', () => { l.qte++; garder(); rendre(); });
      return li;
    }));
    vide.hidden = lignes.length > 0;
    totalEl.textContent = euros(total());
    nbEl.textContent = nombre(); ptEl.textContent = euros(total());
    pastille.hidden = !lignes.length || commandeVue || !!(tiroir && tiroir.open);
  };
  /* Ouvrir et fermer le tiroir (dialog modal : focus gardé dedans, Échap ; le défilement de la page est bloqué). */
  let declencheur = null, minuteFermeture = 0;
  const ouvrir = (depuis, nom) => {
    if (!tiroir) return false;
    clearTimeout(minuteFermeture);
    declencheur = depuis || document.activeElement;
    if (nom || pasActuel() === 'merci') etape(nom || 'panier', { focus: false });
    if (!tiroir.open) {
      tiroir.showModal(); bloquerDefilement('tiroir');
      if (etat.calme) tiroir.classList.add('est-ouvert'); else requestAnimationFrame(() => requestAnimationFrame(() => tiroir.classList.add('est-ouvert')));
    }
    pastille.hidden = true;
    return true;
  };
  const fermer = (apres) => {
    if (!tiroir || !tiroir.open) return;
    tiroir.classList.remove('est-ouvert');
    const fin = () => { tiroir.close(); debloquerDefilement('tiroir'); tAjoute.hidden = true; rendre(); if (apres) apres(); else if (declencheur && declencheur.isConnected) declencheur.focus({ preventScroll: true }); };
    if (etat.calme) fin(); else minuteFermeture = setTimeout(fin, 420);
  };
  if (tiroir) {
    tiroir.addEventListener('cancel', (e) => { e.preventDefault(); fermer(); });
    for (const b of $$('[data-tiroir-fermer]', tiroir)) b.addEventListener('click', () => fermer());
    $('[data-tiroir-valider]', tiroir).addEventListener('click', (e) => { e.preventDefault(); if (lignes.length) etape('retrait'); });
    retourT.addEventListener('click', () => etape(ORDRE[Math.max(0, ORDRE.indexOf(pasActuel()) - 1)]));
    $('[data-tiroir-suite]', tiroir).addEventListener('click', () => {
      const jour = $('[name="jour"]:checked', form), moment = $('[name="moment"]:checked', form);
      $('[data-erreur="jour"]', form).hidden = !!jour; $('[data-erreur="moment"]', form).hidden = !!moment;
      if (jour && moment) { etape('coordonnees'); return; }
      const cible = !jour ? ($('[name="jour"]:not(:disabled)', form)) : $('[name="moment"]:not(:disabled)', form);
      $(`[data-erreur="${!jour ? 'jour' : 'moment'}"]`, form).scrollIntoView({ block: 'center', behavior: etat.calme ? 'auto' : 'smooth' });
      if (cible) cible.focus({ preventScroll: true });
    });
    /* Le formulaire de la section « Le retrait » passe dans le panneau ; la section disparaît de la page. */
    $('[data-tiroir-form]', tiroir).append(form);
    $('#commande').remove();
    pastille.addEventListener('click', (e) => { e.preventDefault(); ouvrir(pastille); });
  }
  /* Le plat s'envole de sa cloche jusqu'à sa vignette dans le tiroir (qui glisse encore : on vise sa position finale). */
  const envolPlat = (carte, cle) => {
    const src = $('.emp-cloche__plat', carte), cible = $(`.emp-tl[data-cle="${CSS.escape(cle)}"] .emp-tl__vignette`, tiroir);
    if (etat.calme || !src || !cible || !src.animate) return;
    const a = src.getBoundingClientRect(), b = cible.getBoundingClientRect();
    const tx = new DOMMatrixReadOnly(getComputedStyle(tPanneau).transform).m41;
    const clone = src.cloneNode(true);
    clone.removeAttribute('role'); clone.removeAttribute('aria-label'); clone.removeAttribute('srcset'); clone.setAttribute('aria-hidden', 'true'); clone.setAttribute('class', 'emp-vol-plat');
    Object.assign(clone.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px` });
    tiroir.append(clone);
    const echelle = (b.width * 0.9) / a.width;
    const dx = b.left - tx + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    cible.style.opacity = '0';
    clone.animate([
      { transform: 'translate(0, 0) scale(1)' },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 110}px) scale(${(1 + echelle) / 1.8})`, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(${echelle})` },
    ], { duration: 820, easing: 'cubic-bezier(.45, 0, .2, 1)' }).finished.then(() => { clone.remove(); cible.style.opacity = ''; }, () => { clone.remove(); cible.style.opacity = ''; });
  };
  const toucher = () => { if (etat.calme) return; pastille.classList.remove('est-touchee'); void pastille.offsetWidth; pastille.classList.add('est-touchee'); setTimeout(() => pastille.classList.remove('est-touchee'), 320); };
  const envol = (depuis) => {
    if (etat.calme || !depuis.animate) return toucher();
    const vers = (!pastille.hidden && pastille.getBoundingClientRect().width) ? pastille : $('.emp-panier__titre');
    const a = depuis.getBoundingClientRect(), b = vers.getBoundingClientRect();
    const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2, x1 = b.left + 26, y1 = b.top + b.height / 2;
    const v = document.createElement('span'); v.className = 'emp-vol'; v.setAttribute('aria-hidden', 'true'); document.body.append(v);
    const mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 140;
    v.animate([{ transform: `translate(${x0}px, ${y0}px) scale(1)` }, { transform: `translate(${mx}px, ${my}px) scale(1.25)`, offset: 0.5 }, { transform: `translate(${x1}px, ${y1}px) scale(.5)`, opacity: 0.6 }], { duration: 720, easing: 'cubic-bezier(.4, 0, .2, 1)' }).finished.then(() => { v.remove(); toucher(); }, () => v.remove());
  };
  for (const b of $$('[data-ajouter]')) b.addEventListener('click', () => {
    const id = b.dataset.ajouter, carte = b.closest('[data-produit]');
    const poids = T.produits[id].unite === 'kg' ? +($('[data-poids]', carte)?.value || 1) : 0;
    const l = lignes.find((x) => x.id === id && (x.poids || 0) === poids);
    if (l) l.qte++; else lignes.push(poids ? { id, poids, qte: 1 } : { id, qte: 1 });
    nouvelle = `${id}|${poids || 0}`; const cle = nouvelle;
    garder(); rendre();
    if (ouvrir(b, 'panier')) {
      tAjoute.textContent = fmt(T.tiroirAjoute, { nom: nomLigne({ id, poids }) }); tAjoute.hidden = false;
      envolPlat(carte, cle);
    } else envol(b);
    const txt = $('[data-ajouter-texte]', b); b.classList.add('est-ajoute'); txt.textContent = T.ajoute;
    clearTimeout(b._t); b._t = setTimeout(() => { b.classList.remove('est-ajoute'); txt.textContent = T.ajouter; }, 1400);
    if (!tiroir) annonce.textContent = fmt(T.annonce, { nom: nomLigne({ id, poids }), total: euros(total()) });
    $('[data-erreur="panier"]', form).hidden = true;
  });
  addEventListener('storage', (e) => { if (e.key !== CLE) return; try { lignes = JSON.parse(e.newValue || '[]'); } catch { lignes = []; } rendre(); });
  const sectionCommande = $('#commande');
  if (sectionCommande) new IntersectionObserver(([e]) => { commandeVue = e.isIntersecting; rendre(); }, { threshold: 0.12 }).observe(sectionCommande);
  /* Jour et moment : jours passés grisés à la date réelle, midi ou soir selon les horaires du jour choisi. */
  const auj = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date());
  const jours = $$('[name="jour"]', form), moments = $$('[name="moment"]', form);
  for (const j of jours) if (j.value < auj) { j.disabled = true; j.closest('label').classList.add('est-passe'); }
  const retrait = () => {
    const j = $('[name="jour"]:checked', form), m = $('[name="moment"]:checked', form);
    retraitEl.textContent = j && m ? fmt(T.retraitPanier, { retrait: fmt(T.retrait, { jour: j.dataset.libelle, moment: T[m.value] }) }) : T.retraitAChoisir;
    if (tRetrait) tRetrait.textContent = pasActuel() === 'panier' ? tRetrait.dataset.defaut : retraitEl.textContent;
  };
  form.addEventListener('change', (e) => {
    if (e.target.name === 'jour') {
      const j = e.target;
      for (const m of moments) { m.disabled = j.dataset[m.value] !== '1'; if (m.disabled) m.checked = false; }
      const ouverts = moments.filter((m) => !m.disabled); if (ouverts.length === 1) ouverts[0].checked = true;
      $('[data-erreur="jour"]', form).hidden = true;
    }
    if (e.target.name === 'moment') $('[data-erreur="moment"]', form).hidden = true;
    /* Un seul moment possible ce jour-là : il est coché d'office, son message d'erreur disparaît aussi. */
    if ($('[name="moment"]:checked', form)) $('[data-erreur="moment"]', form).hidden = true;
    retrait();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const manques = [];
    const err = (n, ok) => { $(`[data-erreur="${n}"]`, form).hidden = ok; if (!ok) manques.push(n); };
    err('panier', lignes.length > 0); err('jour', !!$('[name="jour"]:checked', form)); err('moment', !!$('[name="moment"]:checked', form));
    let premierChamp = null;
    for (const i of $$('input[required]', form)) { const ok = !!i.value.trim(); i.setAttribute('aria-invalid', ok ? 'false' : 'true'); if (!ok && !premierChamp) premierChamp = i; }
    if (manques.length || premierChamp) {
      if (tiroir && tiroir.open) {
        if (manques.includes('panier')) etape('panier');
        else if (manques.length) { etape('retrait', { focus: false }); const c = $(`[data-erreur="${manques[0]}"]`, form); c.hidden = false; c.scrollIntoView({ block: 'center' }); const i = $(manques[0] === 'jour' ? '[name="jour"]:not(:disabled)' : '[name="moment"]:not(:disabled)', form); if (i) i.focus({ preventScroll: true }); }
        else premierChamp.focus();
        return;
      }
      const cible = manques.includes('panier') ? $('#produits') : manques.length ? $(`[data-erreur="${manques[0]}"]`, form) : premierChamp;
      if (cible === premierChamp) premierChamp.focus(); else amenerDansEcran(cible, true);
      return;
    }
    const j = $('[name="jour"]:checked', form), m = $('[name="moment"]:checked', form);
    const produits = lignes.map((l) => `${l.qte} × ${nomLigne(l)}`).join(', ');
    merci.innerHTML = '<p><strong></strong></p><p></p>';
    merci.querySelector('strong').textContent = fmt(T.recap, { produits, total: euros(total()), retrait: fmt(T.retrait, { jour: j.dataset.libelle, moment: T[m.value] }) });
    merci.querySelector('p + p').textContent = T.simule;
    if (tiroir && tiroir.open) etape('merci', { focus: false });
    merci.hidden = false; merci.focus();
  });
  rendre(); if (tiroir) etape('panier', { focus: false }); retrait();
}

/* v7.5 · Réceptions, « Ce que l'on fête ici » : le défilement par paliers de la maquette de référence (une occasion par palier). */
function fetesDefile() {
  const sec = $('[data-fetes-defile]'); if (!sec) return;
  const fetes = $$('.occ', sec), points = $$('[data-fete-aller]', sec), collant = $('.fetes-defile__collant', sec);
  const anneau = $('.fetes-defile__anneau', sec); /* v7.5.15 · la progression posée sur l'anneau seul (pas de recalcul de toute la scène) */
  /* Un lien « Organiser un mariage » coche l'occasion dans la demande. */
  for (const a of $$('[data-occasion-choisir]', sec)) a.addEventListener('click', () => {
    const r = $$('[name="occasion"]').find((x) => x.value === a.dataset.occasionChoisir);
    if (r && !r.checked) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }
  });
  let idx = -1;
  const activer = (i) => {
    if (i === idx) return; idx = i;
    fetes.forEach((f, k) => { f.classList.toggle('est-active', k === i); if (!etat.calme) f.setAttribute('aria-hidden', String(k !== i)); });
    points.forEach((p, k) => p.setAttribute('aria-current', String(k === i)));
    collant.style.setProperty('--fete-fond-actif', getComputedStyle(fetes[i]).getPropertyValue('--fete-fond').trim());
  };
  if (etat.calme) { fetes.forEach((f) => f.classList.add('est-active')); return; }
  let attente = false;
  const course = () => Math.max(1, sec.offsetHeight - innerHeight);
  const maj = () => {
    attente = false;
    const p = Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / course()));
    if (anneau) anneau.style.setProperty('--fetes-p', p.toFixed(3));
    const i = Math.min(fetes.length - 1, Math.floor(p * fetes.length));
    activer(i);
    /* v7.5.15 · Dans son palier, la photo de la fête grandit jusqu'à occuper toute la moitié droite de l'écran, bord à bord. */
    const q = p * fetes.length - i, g = Math.min(1, Math.max(0, (q - 0.16) / 0.46));
    fetes[i].style.setProperty('--g', (g * g * (3 - 2 * g)).toFixed(4));
  };
  addEventListener('scroll', () => { if (!attente) { attente = true; requestAnimationFrame(maj); } }, { passive: true });
  addEventListener('resize', maj);
  maj();
  points.forEach((b, k) => b.addEventListener('click', () => aller(sec.getBoundingClientRect().top + scrollY + course() * ((k + 0.7) / fetes.length))));
}
function occasions() {
  if (!gsap || !window.ScrollTrigger || etat.calme) return;
  const l = $('.occasions__liste'); if (!l) return;
  gsap.fromTo(l, { '--decale': '90px' }, { '--decale': '0px', ease: 'none', scrollTrigger: { trigger: l, start: 'top bottom', end: 'bottom 40%', scrub: 0.5 } });
}
function demande() {
  const f = $('[data-demande]'); if (!f) return;
  const etapes = $$('[data-etape]', f), pastilles = $$('[data-etape-num]');
  const inv = $('[data-invitation]'), occ = $('[data-inv-occasion]', inv), det = $('[data-inv-detail]', inv), msg = $('[data-demande-message]', f);
  let k = 0;
  const montrer = (n, focus = true) => {
    k = n; etapes.forEach((e, i) => e.classList.toggle('est-courante', i === k));
    pastilles.forEach((p, i) => { p.classList.toggle('est-courant', i === k); p.classList.toggle('est-fait', i < k); });
    if (focus) { const c = $('input:not([type="radio"]), textarea, input[type="radio"]:checked', etapes[k]); c && c.focus({ preventScroll: true }); }
  };
  /* v7.5.8 · Le carton : le texte qui change arrive en douceur ; les polaroïds montrent l'occasion et l'espace choisis. */
  const ecrire = (el, texte, vide) => {
    if (el.textContent === texte) { el.classList.toggle('est-vide', vide); return; }
    el.textContent = texte; el.classList.toggle('est-vide', vide);
    if (!etat.calme && pret) el.animate([{ opacity: 0, transform: 'translateY(8px)' }], { duration: 450, easing: 'cubic-bezier(.2,.8,.2,1)' });
  };
  const apercus = $$('[data-apercu]');
  const apercu = (type, champ) => {
    const a = apercus.find((x) => x.dataset.apercu === type); if (!a) return;
    const cle = champ?.dataset.cle || '';
    if (a.dataset.cle === cle) return; a.dataset.cle = cle;
    const photos = $$('[data-apercu-photo]', a), cible = photos.find((x) => x.dataset.apercuPhoto === cle) || photos[0];
    photos.forEach((x) => x.classList.toggle('est-active', x === cible));
    const lg = $('[data-apercu-legende]', a); lg.textContent = champ ? champ.value : lg.dataset.vide || lg.textContent;
    if (!etat.calme && pret) { a.classList.remove('est-secoue'); void a.offsetWidth; a.classList.add('est-secoue'); }
  };
  for (const a of apercus) { const lg = $('[data-apercu-legende]', a); lg.dataset.vide = lg.textContent; }
  let pret = false;
  const recap = () => {
    const d = new FormData(f);
    const o = $('[name="occasion"]:checked', f)?.dataset.un || d.get('occasion') || '';
    ecrire(occ, o || occ.dataset.vide, !o);
    const date = d.get('date') ? new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(d.get('date') + 'T12:00:00Z')) : (d.get('periode') || '');
    const dt = [date, d.get('invites') ? `${d.get('invites')} invités` : '', d.get('espace') && d.get('espace') !== 'À voir ensemble' ? d.get('espace') : ''].filter(Boolean).join(' · ');
    ecrire(det, dt || det.dataset.vide, !dt);
    apercu('occasion', $('[name="occasion"]:checked', f));
    apercu('espace', $('[name="espace"]:checked', f));
  };
  /* Le nombre d'invités en un geste. */
  const vite = $$('[data-invites-vite]', f), champInv = f.elements.invites;
  const majVite = () => vite.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.invitesVite === champInv.value)));
  vite.forEach((b) => b.addEventListener('click', () => { champInv.value = b.dataset.invitesVite; champInv.dispatchEvent(new Event('input', { bubbles: true })); majVite(); }));
  champInv && champInv.addEventListener('input', majVite);
  const valide = (e) => {
    let ok = true;
    for (const c of $$('input[required], textarea[required]', e)) {
      const bon = c.value.trim() && (c.type !== 'tel' || /^[+\d][\d\s.]{8,}$/.test(c.value.trim())) && (c.type !== 'number' || (+c.value >= +(c.min || 0) && +c.value <= +(c.max || 1e9)));
      c.setAttribute('aria-invalid', String(!bon));
      let err = c.parentElement.querySelector('.demande__erreur');
      if (!bon && !err) { err = document.createElement('span'); err.className = 'demande__erreur'; err.id = `err-${c.name}`; err.textContent = 'À compléter pour continuer'; c.after(err); c.setAttribute('aria-describedby', err.id); }
      if (bon && err) { err.remove(); c.removeAttribute('aria-describedby'); }
      if (!bon && ok) { ok = false; c.focus(); }
    }
    /* L'occasion (aucune n'est cochée d'avance) et une date, ou à défaut une période (« Au printemps 2027 »). */
    const signaler = (c, bon, texte) => {
      const ancre = c.type === 'radio' ? c.closest('.demande__puces') : c;
      let err = ancre.nextElementSibling?.classList.contains('demande__erreur') ? ancre.nextElementSibling : null;
      if (!bon && !err) { err = document.createElement('span'); err.className = 'demande__erreur'; err.id = `err-${c.name}`; err.textContent = texte; ancre.after(err); c.setAttribute('aria-describedby', err.id); }
      if (bon && err) { err.remove(); c.removeAttribute('aria-describedby'); }
      c.setAttribute('aria-invalid', String(!bon));
      if (!bon && ok) { ok = false; c.focus(); }
    };
    const occasion = $('[name="occasion"]', e);
    if (occasion) signaler(occasion, !!$('[name="occasion"]:checked', f), f.dataset.occasionManque);
    const date = $('[data-date-ou-periode]', e);
    if (date) signaler(date, !!(date.value || f.elements.periode.value), f.dataset.dateOuPeriode);
    return ok;
  };
  f.addEventListener('input', recap); f.addEventListener('change', recap);
  f.addEventListener('change', (e) => {
    const c = e.target.name === 'occasion' ? e.target.closest('.demande__puces') : e.target.name === 'periode' ? $('[data-date-ou-periode]', f) : e.target.name === 'date' ? e.target : null;
    if (c && c.nextElementSibling?.classList.contains('demande__erreur')) { c.nextElementSibling.remove(); $$('[aria-invalid="true"]', c.closest('fieldset')).forEach((x) => { if (x.type === 'radio' || x.matches('[data-date-ou-periode]')) x.setAttribute('aria-invalid', 'false'); }); }
  });
  f.addEventListener('click', (e) => {
    if (e.target.closest('[data-suivant]')) { if (valide(etapes[k])) { montrer(Math.min(etapes.length - 1, k + 1)); rafraichir(); } }
    if (e.target.closest('[data-precedent]')) { montrer(Math.max(0, k - 1)); rafraichir(); }
  });
  let envoye = false;
  f.addEventListener('submit', (e) => {
    e.preventDefault(); if (envoye || !valide(etapes[k])) return;
    envoye = true; recap();
    $$('button', f).forEach((b) => { b.disabled = true; });
    inv.classList.add('est-tamponnee');
    msg.hidden = false; msg.focus({ preventScroll: true });
    if (!etat.calme && gsap) gsap.fromTo(inv, { y: 0, rotate: -2 }, { y: -10, rotate: 1, duration: 0.3, yoyo: true, repeat: 1 });
    /* Le carton tamponné s'il tient à l'écran avec le merci (ordinateur), sinon le merci d'abord (téléphone). */
    const r = inv.getBoundingClientRect(), m = msg.getBoundingClientRect();
    const haut = scrollY + r.top - 96, bas = scrollY + m.bottom - innerHeight + 110;
    const y = Math.max(haut, bas);
    if (Math.abs(y - scrollY) > 8) aller(y);
  });
  /* Arrivée depuis l'accueil ou les fêtes : ?occasion=…&invites=… préremplissent la demande. */
  const q = new URLSearchParams(location.search);
  if (q.get('invites') && /^\d{1,3}$/.test(q.get('invites'))) f.elements.invites.value = q.get('invites');
  montrer(0, false); recap(); majVite(); pret = true;
}

/* Réserver : la page prend la lumière du service choisi ; carte de placement sous la cloche (code gardé de la v5). */
function lumiereService() {
  const resa = $('[data-module="reservation-de-table"]'); if (!resa) return;
  const form = $('[data-resa-form]', resa);
  const poser = () => {
    const sv = $('[name="service"]:checked', form)?.value || new URLSearchParams(location.search).get('service') || 'soir';
    if (html.dataset.service === sv) return;
    html.classList.add('transition-moment'); setTimeout(() => html.classList.remove('transition-moment'), 900);
    html.dataset.service = sv;
    html.style.setProperty('--entete-fond', sv === 'midi' ? '#f6f1e7' : '#120c09');
    html.style.setProperty('--entete-texte', sv === 'midi' ? '#1c1712' : '#f6efe2');
    html.dataset.enteteTheme = sv === 'midi' ? 'jour' : 'nuit';
    poserHorloge(sv === 'midi' ? '12:30' : '21:00');
    for (const el of $$('.heure-geante')) axes(el, sv === 'midi' ? 0.04 : 0.66);
  };
  poser();
  form && form.addEventListener('change', poser);
  window.addEventListener('hacienda:modules', poser);
}
function amenerDansEcran(el, haut = false) {
  if (!el) return;
  const eh = parseFloat(getComputedStyle(html).getPropertyValue('--entete-h')) || 0, bas = parseFloat(getComputedStyle(html).getPropertyValue('--barres-h')) || 0;
  const r = el.getBoundingClientRect(); let dy = 0;
  if (haut || r.top < eh + 12) dy = r.top - eh - 16; else if (r.bottom > innerHeight - bas - 12) dy = Math.min(r.bottom - (innerHeight - bas - 16), r.top - eh - 16);
  if (Math.abs(dy) > 4) aller(scrollY + dy);
}
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
    for (const r of $$('[name="service"]', form)) { const note = r.closest('label')?.querySelector('[data-note]'); if (note && note.textContent === 'complet' && estFerme(iso, r.value)) note.textContent = 'fermé'; }
    const sv = $('[name="service"]:checked', form)?.value;
    if (estFerme(iso, sv)) for (const sm of $$('.resa__creneau small', form)) if (sm.textContent === 'complet') sm.textContent = 'fermé';
  };
  let attente = 0;
  new MutationObserver(() => { cancelAnimationFrame(attente); attente = requestAnimationFrame(corriger); }).observe(resa, { childList: true, subtree: true, characterData: true });
  corriger();
}
function reservationPlacement() {
  const resa = $('[data-module="reservation-de-table"]'), plan = $('[data-module="plan-de-salle"]'); if (!resa) return;
  const couvForm = $('[name="couverts"]', resa), couvPlan = plan && $('#pds-couverts', plan);
  const synchro = () => { if (couvForm && couvPlan && couvPlan.value !== couvForm.value) { couvPlan.value = couvForm.value; couvPlan.dispatchEvent(new Event('input', { bubbles: true })); couvPlan.dispatchEvent(new Event('change', { bubbles: true })); } };
  if (couvForm) { ['input', 'change'].forEach((t) => couvForm.addEventListener(t, synchro)); resa.addEventListener('click', (e) => { if (e.target.closest('[data-moins], [data-plus]')) setTimeout(synchro, 0); }); setTimeout(synchro, 300); }
  if (plan) plan.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="table="]'); if (!a) return;
    const u = new URL(a.href, location.href); u.searchParams.delete('couverts'); if (couvForm && couvForm.value) u.searchParams.set('couverts', couvForm.value); a.href = u.pathname + u.search + u.hash;
  }, true);
  const scene = plan && $('.pds__scene', plan);
  if (scene && telephone()) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'pds__agrandir'; b.textContent = 'Agrandir le plan'; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => { const on = !scene.classList.contains('est-agrandi'); scene.classList.toggle('est-agrandi', on); b.setAttribute('aria-pressed', String(on)); b.textContent = on ? 'Réduire le plan' : 'Agrandir le plan'; });
    scene.before(b);
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
    recap.querySelector('.placement')?.remove(); recap.querySelector('.placement__voir')?.remove();
    const carte = document.createElement('div'); carte.className = 'placement'; carte.setAttribute('aria-hidden', 'true'); carte.dataset.effet = 'placement';
    const f = $('[data-resa-form]', resa), qui = f ? [f.elements.prenom?.value, f.elements.nom?.value].filter(Boolean).join(' ').trim() : '';
    carte.innerHTML = `<p class="placement__carton"><span>Réservé</span>${qui ? `<em>${qui.replace(/[<>&"]/g, '')}</em>` : ''}<strong>${jour}${heure ? ' · ' + heure : ''}</strong><span>${n} couvert${n > 1 ? 's' : ''}${d.table ? ' · table ' + d.table : ''}</span></p><svg class="placement__cloche" viewBox="0 0 120 70"><path d="M8 62 Q 10 14 60 12 Q 110 14 112 62 Z" fill="#e9a23b"/><path d="M4 62 H116" stroke="#9a5a12" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="9" r="6" fill="#9a5a12"/></svg>`;
    recap.prepend(carte);
    const rep = d.table && $('.pds__repere');
    /* v7.5.15 · La table s'allume : sur le plan, la salle baisse la lumière, la table choisie garde la sienne, une bougie
       s'allume sous le carton « Réservé » ; un lien du récapitulatif y mène. */
    if (rep && !rep.hidden && plan) {
      plan.classList.add('est-allume');
      const lien = document.createElement('p'); lien.className = 'placement__voir';
      const a = document.createElement('a'); a.href = '#plan'; a.dataset.sansTransition = ''; a.textContent = resa.dataset.voirTable || 'Voir votre table sur le plan';
      a.addEventListener('click', (ev) => { ev.preventDefault(); const sc = $('.pds__scene', plan) || plan; const r = sc.getBoundingClientRect(); aller(scrollY + r.top - Math.max(0, (innerHeight - r.height) / 2)); });
      lien.append(a); carte.after(lien);
    }
    if (rep && !rep.hidden) { rep.classList.add('est-reserve'); rep.querySelector('b').textContent = 'Réservé'; const jc = d.date ? new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(d.date + 'T12:00:00Z')) : ''; rep.querySelector('.pds__repere-etiquette > span').textContent = `${jc}${heure ? ' · ' + heure : ''} · ${n} couvert${n > 1 ? 's' : ''}`; }
    if (etat.calme) carte.classList.add('est-pose'); else requestAnimationFrame(() => requestAnimationFrame(() => carte.classList.add('est-pose')));
    setTimeout(() => { const el = $('[data-resa-recap]', resa); if (!el) return; const eh = parseFloat(getComputedStyle(html).getPropertyValue('--entete-h')) || 0, r = el.getBoundingClientRect(); const libre = innerHeight - eh, dy = r.height < libre - 32 ? r.top - eh - (libre - r.height) / 2 : r.top - eh - 16; if (Math.abs(dy) > 4) aller(scrollY + dy); }, 450);
  });
  /* Arrivée avec une table choisie sur le plan : son carton file jusqu'au récapitulatif. */
  const table = new URLSearchParams(location.search).get('table'), recap = $('[data-resa-recap]');
  if (recap && plan && table && !etat.calme) quand('pret', async () => {
    try { const { envol } = await import('./modules/envol-vers-le-panier/module.js?v=7'); const depuis = $('.pds__repere', plan) || $(`[data-table="${CSS.escape(table)}"]`, plan); if (depuis) setTimeout(() => envol({ depuis, vers: recap, forme: 'carte' }), 900); } catch (e) { console.warn('envol', e); }
  });
}
function carteCadeauStatut() {
  const ccq = $('[data-module="carte-cadeau-qui-se-compose"]'), statut = ccq && $('[data-ccq-statut]', ccq);
  if (!statut) return; let attendu = false;
  ccq.addEventListener('ccq:valide', () => { attendu = true; });
  new MutationObserver(() => { if (!attendu || statut.hidden || !statut.textContent.trim()) return; attendu = false; setTimeout(() => amenerDansEcran(statut), 450); }).observe(statut, { attributes: true, childList: true, characterData: true, subtree: true });
}

/* Infos pratiques : l'heure réelle à Moineville, en chiffres géants qui tournent. */
function heureReelle() {
  const el = $('[data-heure-reelle]'); if (!el) return;
  /* Le curseur du ciel (Infos pratiques) choisit une autre heure : la grande heure la suit, puis revient à l'heure réelle. */
  const ciel = $('[data-module="ciel-en-direct"]'), choisie = ciel && $('[data-ced-heure]', ciel), drapeau = ciel && $('[data-ced-drapeau]', ciel);
  const maj = () => { const v = choisie && drapeau && !drapeau.hidden && /\d/.test(choisie.textContent) ? choisie.textContent : heureParis(); if (el.textContent !== v) el.textContent = v; };
  const carte = ciel && $('.ced__carte', ciel);
  if (carte) new MutationObserver(maj).observe(carte, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['hidden'] });
  maj(); setInterval(maj, 20000);
  const [h, m] = heureParis().split(':');
  const rh = $('[data-rouleau="h"]'), rm = $('[data-rouleau="m"]');
  if (rh) rh.lastElementChild.textContent = h; if (rm) rm.lastElementChild.textContent = m;
  const mm = +h * 60 + +m; axes(el, Math.max(0, Math.min(1, (mm - 720) / 720)));
}
async function cadranManipulable() {
  const sec = $('[data-module="horaires-ouvert-maintenant"]'), cadran = sec && $('.horaires__cadran', sec), src = sec && $('script[data-horaires]', sec);
  if (!cadran || !src || etat.calme) return;
  const H = await import('./modules/horaires-ouvert-maintenant/horaires-calcul.js?v=7');
  const a = H.preparer(JSON.parse(src.textContent)).adresses[0];
  const n0 = H.maintenant(a.fuseau);
  const jours = Array.from({ length: 7 }, (_, k) => H.ajouter(n0.iso, k));
  const zone = document.createElement('div'); zone.className = 'horaires__essai'; zone.dataset.effet = 'cadran-manipulable';
  zone.innerHTML = `<p class="horaires__essai-titre">Faites glisser l’aiguille pour un autre moment</p><div class="horaires__essai-jours" role="group" aria-label="Jour">${jours.map((iso, k) => `<button type="button" data-iso="${iso}" aria-pressed="${k === 0}">${k === 0 ? 'Aujourd’hui' : H.JOURS[H.jourDe(iso)].replace(/^./, (x) => x.toUpperCase())}</button>`).join('')}</div><label class="horaires__essai-heure"><span>Heure</span><input type="range" min="0" max="1425" step="15" value="${Math.round(n0.min / 15) * 15}"></label><p class="horaires__essai-reponse" aria-live="polite"></p>`;
  ($('[data-horaires-statut]', sec) || cadran).after(zone);
  const curseur = $('input', zone), rep = $('.horaires__essai-reponse', zone); let iso = jours[0], essai = false;
  const centre = document.createElement('p'); centre.className = 'horaires__centre horaires__centre--essai'; centre.setAttribute('aria-hidden', 'true'); cadran.append(centre);
  const dire = () => {
    const m = +curseur.value, j = H.jour(a, iso), veille = H.jour(a, H.ajouter(iso, -1));
    const ouvert = j.creneaux.some((c) => c[0] <= m && m < c[1]) || veille.creneaux.some((c) => c[1] > 1440 && m < c[1] - 1440);
    const nom = iso === jours[0] ? 'Aujourd’hui' : H.JOURS[H.jourDe(iso)].replace(/^./, (x) => x.toUpperCase());
    rep.textContent = `${nom} à ${H.heure(m)} : ${ouvert ? 'ouvert' : 'fermé'}`; rep.dataset.etat = ouvert ? 'ouvert' : 'ferme';
    curseur.setAttribute('aria-valuetext', H.heure(m));
    const aig = $('.horaires__aiguille', cadran); if (aig) aig.style.setProperty('--angle', (m / 1440 * 360).toFixed(2) + 'deg');
    if (essai) { centre.innerHTML = `<b>${H.heure(m).replace(' h ', ':').replace(/ h$/, ':00')}</b><span>${nom}</span>`; cadran.classList.add('est-essai'); }
  };
  zone.addEventListener('pointerdown', () => { essai = true; }, true); zone.addEventListener('keydown', () => { essai = true; }, true); cadran.addEventListener('pointerdown', () => { essai = true; }, true);
  const aiguille = $('.horaires__aiguille', cadran);
  if (aiguille) new MutationObserver(() => { if (!essai) return; const v = (+curseur.value / 1440 * 360).toFixed(2) + 'deg'; if (aiguille.style.getPropertyValue('--angle') !== v) aiguille.style.setProperty('--angle', v); }).observe(aiguille, { attributes: true, attributeFilter: ['style'] });
  for (const b of $$('[data-iso]', zone)) b.addEventListener('click', () => { iso = b.dataset.iso; for (const x of $$('[data-iso]', zone)) x.setAttribute('aria-pressed', String(x === b)); dire(); });
  curseur.addEventListener('input', dire);
  let actif = false;
  const lire = (e) => { const r = cadran.getBoundingClientRect(); const ang = Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))); return Math.round((((ang / (2 * Math.PI)) + 1) % 1) * 1440 / 15) * 15 % 1440; };
  cadran.style.touchAction = 'none'; cadran.style.cursor = 'grab';
  cadran.addEventListener('pointerdown', (e) => { actif = true; cadran.setPointerCapture(e.pointerId); curseur.value = String(lire(e)); dire(); });
  cadran.addEventListener('pointermove', (e) => { if (actif) { curseur.value = String(lire(e)); dire(); } });
  ['pointerup', 'pointercancel'].forEach((t) => cadran.addEventListener(t, () => { actif = false; }));
  setTimeout(dire, 1200); rafraichir();
}
function cloches() {
  const liste = $('[data-effet="cloches"]'); if (!liste) return;
  const items = $$('li', liste);
  if (etat.calme || !('IntersectionObserver' in window)) { items.forEach((li) => li.classList.add('est-servi')); return; }
  const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { io.disconnect(); items.forEach((li, i) => setTimeout(() => li.classList.add('est-servi'), 250 + i * 380)); } }, { threshold: 0.35 });
  io.observe(liste);
}
function eteHeures() {
  if (!gsap || !window.ScrollTrigger || etat.calme) return;
  for (const li of $$('.ete-heure')) gsap.fromTo(li, { x: 50, opacity: 0.2 }, { x: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: li, start: 'top 92%', end: 'top 60%', scrub: 0.5 } });
}

/* Boucles vidéo (eau, flamme, vapeur) : chargées à l'écran seulement, jamais en mode calme, en économie de données
   ni sur téléphone en portrait (l'image reste) ; pause hors écran et bouton pause discret. */
function videos() {
  const liste = $$('video.media-video[data-src]'); if (!liste.length) return;
  const eco = navigator.connection && (navigator.connection.saveData || /2g/.test(navigator.connection.effectiveType || ''));
  const portrait = matchMedia('(max-width: 760px) and (orientation: portrait)').matches;
  if (etat.calme || eco || portrait) { liste.forEach((v) => v.parentElement.querySelector('[data-video-pause]')?.remove()); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting) { if (!v.src) { v.src = v.dataset.src; v.addEventListener('playing', () => v.classList.add('est-lue'), { once: true }); } if (!v.dataset.pause) v.play().catch(() => {}); }
    else if (v.src) v.pause();
  }), { rootMargin: '120px' });
  liste.forEach((v) => io.observe(v));
  /* Retour arrière ou avant (page gardée en cache) : la boucle reprend sans refaire son fondu. */
  addEventListener('pageshow', (e) => { if (e.persisted) liste.forEach((v) => { if (v.src) { v.style.transition = 'none'; v.classList.add('est-lue'); } }); });
  for (const b of $$('[data-video-pause]')) b.addEventListener('click', () => {
    const v = b.parentElement.querySelector('video'); if (!v) return;
    const p = !v.dataset.pause; if (p) { v.dataset.pause = '1'; v.pause(); } else { delete v.dataset.pause; v.play().catch(() => {}); }
    b.setAttribute('aria-pressed', String(p)); b.setAttribute('aria-label', p ? b.dataset.libelleLecture : b.dataset.libellePause); b.firstElementChild.textContent = p ? '▶' : '❙❙';
  });
}

/* Retour à la section après le bouton du mode calme : le socle y va dès l'ouverture ; les polices et les images
   qui arrivent ensuite peuvent la pousser hors de l'écran (téléphone) : on y revient une fois la page posée. */
const retourCalme = (() => { try { return sessionStorage.getItem('socle:calme-retour'); } catch { return null; } })();
if (retourCalme) {
  /* Vérifié après chaque recalcul des scènes (ScrollTrigger) et à quelques instants après le chargement, pendant 3 s. */
  const t0 = performance.now();
  const revenir = () => {
    if (performance.now() - t0 > 3000) return;
    const el = document.getElementById(retourCalme); if (!el) return;
    const r = el.getBoundingClientRect(); if (r.top > innerHeight * 0.6 || r.bottom < 0) aller(el, { instant: true });
  };
  const apresRecalcul = () => requestAnimationFrame(() => requestAnimationFrame(revenir));
  if (window.ScrollTrigger) window.ScrollTrigger.addEventListener('refresh', apresRecalcul);
  addEventListener('load', () => [250, 700, 1400, 2200].forEach((d) => setTimeout(revenir, d)), { once: true });
}

/* ===================== v7.4 · accueil ===================== */
const HEROS_ENTREE = '.heros__lieu, .heros__titre, .heros__intro, .heros__actions, .heros__barre';
/* L'ouverture : pause des animations (eau, lumière, lent zoom de la photo), prochain rendez-vous au jour réel,
   bascule été/hiver qui garde le moment forcé (?moment=). */
function heros() {
  const sec = $('#midi.heros'); if (!sec) return;
  const b = $('[data-heros-pause]', sec);
  if (b) b.addEventListener('click', () => {
    const p = !sec.classList.contains('est-en-pause');
    sec.classList.toggle('est-en-pause', p);
    b.setAttribute('aria-pressed', String(p));
    b.setAttribute('aria-label', p ? b.dataset.reprendre : b.dataset.pause);
  });
  const lien = $('[data-heros-rdv-lien]', sec), txt = $('[data-heros-rdv]', sec), src = $('[data-heros-agenda]', sec);
  if (lien && txt && src) {
    let L = []; try { L = JSON.parse(src.textContent); } catch {}
    const p = L.filter((x) => joursAvant(x.d) >= 0).sort((a, z) => a.d.localeCompare(z.d))[0];
    if (p) {
      const j = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${p.d}T12:00:00Z`));
      txt.textContent = `${p.t}, ${j}`;
      const u = new URL(lien.getAttribute('href'), location.href); u.hash = p.a; lien.setAttribute('href', u.pathname + u.search + u.hash);
    }
  }
  const bas = $('[data-heros-bascule]', sec);
  if (bas) {
    const m = new URL(location.href).searchParams.get('moment');
    if (m) { const u = new URL(bas.getAttribute('href'), location.href); u.searchParams.set('moment', m); bas.setAttribute('href', u.pathname + u.search); }
    bas.addEventListener('click', () => bas.classList.add('est-bascule'));
  }
}

/* Le chef : le polaroïd se retourne (la carte de la semaine au dos), suit un peu la main ; les étiquettes se collent
   à l'arrivée et se déplacent du doigt, dans les limites de la table. */
function chef() {
  const table = $('[data-chef-table]'); if (!table) return;
  const pol = $('[data-polaroid]', table), btn = $('[data-polaroid-retourner]', table);
  if (pol && btn) {
    const avant = $('.polaroid__face--avant', pol), dos = $('.polaroid__face--dos', pol), txt = $('.polaroid__retourner-texte', btn);
    btn.addEventListener('click', () => {
      const r = !pol.classList.contains('est-retourne');
      pol.classList.toggle('est-retourne', r);
      btn.setAttribute('aria-pressed', String(r));
      if (txt) txt.textContent = r ? btn.dataset.revoir : btn.dataset.retourner;
      dos?.setAttribute('aria-hidden', String(!r)); avant?.setAttribute('aria-hidden', String(r));
    });
    if (matchMedia('(hover: hover)').matches && !etat.calme) {
      pol.addEventListener('pointermove', (e) => {
        const r = pol.getBoundingClientRect();
        pol.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width) - 0.5) * 12}deg`);
        pol.style.setProperty('--rx', `${-(((e.clientY - r.top) / r.height) - 0.5) * 8}deg`);
      });
      pol.addEventListener('pointerleave', () => { pol.style.setProperty('--ry', '0deg'); pol.style.setProperty('--rx', '0deg'); });
    }
  }
  if (!etat.calme && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { table.classList.add('est-arrivee'); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(table);
  } else table.classList.add('est-arrivee');
  let z = 1;
  for (const e of $$('[data-etiquette]', table)) {
    let x0 = 0, y0 = 0, dx = 0, dy = 0, px = 0, id = null;
    e.addEventListener('pointerdown', (ev) => {
      id = ev.pointerId; try { e.setPointerCapture(id); } catch {}
      x0 = ev.clientX - dx; y0 = ev.clientY - dy; px = ev.clientX;
      e.classList.add('est-tenue'); e.style.zIndex = String(++z);
    });
    e.addEventListener('pointermove', (ev) => {
      if (ev.pointerId !== id) return;
      const T = table.getBoundingClientRect(), R = e.getBoundingClientRect();
      const bx = R.left - dx, by = R.top - dy;
      const nx = Math.max(T.left - bx - 16, Math.min(T.right - (bx + R.width) + 16, ev.clientX - x0));
      const ny = Math.max(T.top - by - 16, Math.min(T.bottom - (by + R.height) + 16, ev.clientY - y0));
      const v = ev.clientX - px; px = ev.clientX; dx = nx; dy = ny;
      e.style.setProperty('--dx', `${dx}px`); e.style.setProperty('--dy', `${dy}px`);
      e.style.setProperty('--tilt', `${Math.max(-14, Math.min(14, v * 1.4))}deg`);
    });
    const lacher = (ev) => { if (ev.pointerId !== id) return; id = null; e.classList.remove('est-tenue'); e.style.setProperty('--tilt', '0deg'); };
    e.addEventListener('pointerup', lacher); e.addEventListener('pointercancel', lacher);
  }
}

/* 12 h 30 : les cartes de la carte arrivent l'une après l'autre au défilement, leurs pointillés se tracent. */
function rubriques() {
  const cartes = $$('.rubrique-carte:not(.dej-semaine)'); if (!cartes.length || !gsap || !window.ScrollTrigger || etat.calme) return;
  /* Le déclencheur est la colonne (jamais déplacée), décalée de la position de la carte (offsetTop ignore la translation) :
     au recalcul, la carte encore décalée de 90 px ne change pas sa position de départ. */
  const col = cartes[0].parentElement, sansBoite = getComputedStyle(col).display === 'contents';
  for (const c of cartes) {
    gsap.timeline({ scrollTrigger: sansBoite ? { trigger: c, start: 'top 92%', once: true } : { trigger: col, start: () => `top+=${c.offsetTop - col.offsetTop} 92%`, once: true, invalidateOnRefresh: true } })
      .fromTo(c, { y: 90, opacity: 0, rotate: 1.2 }, { y: 0, opacity: 1, rotate: 0, duration: 0.9, ease: 'power3.out' })
      .fromTo($$('.plat-ligne__points', c), { scaleX: 0 }, { scaleX: 1, duration: 0.8, stagger: 0.14, ease: 'power2.out' }, 0.3);
  }
}

/* Le lieu : la piste de cartes file vers la gauche (les cartes « défilent vers la droite ») pendant que le cadre reste collé ;
   la hauteur de la section suit la longueur de la piste. Sans animation : piste qui se fait glisser. */
function lieuDefile() {
  const sec = $('[data-effet="lieu"]'); if (!sec) return;
  const piste = $('[data-lieu-piste]', sec), barre = $('[data-lieu-progres]', sec);
  if (!piste || !gsap || !window.ScrollTrigger || etat.calme) { sec.classList.add('lieu-defile--libre'); return; }
  const distance = () => Math.max(0, piste.scrollWidth - document.documentElement.clientWidth);
  const hauteur = () => { sec.style.height = `calc(100svh + ${Math.round(distance() * 1.05)}px)`; };
  hauteur();
  window.ScrollTrigger.addEventListener('refreshInit', hauteur);
  gsap.to(piste, { x: () => -distance(), ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.5, invalidateOnRefresh: true,
    onUpdate: (st) => barre && barre.style.setProperty('--p', (0.08 + 0.92 * st.progress).toFixed(3)) } });
}

/* Au coin du feu : la scène plein écran du socle ouvre la photo et écarte les mots ; ensuite le titre remonte et se resserre,
   et le petit module de réservation arrive du bas. */
function feuResa() {
  const sec = $('#feu'), tete = sec && $('[data-feu-tete]', sec), resa = sec && $('[data-feu-resa]', sec);
  if (!tete || !resa || etat.calme || !gsap || !window.ScrollTrigger) return;
  const brancher = (tl) => {
    if (!tl || sec.dataset.suite) return; sec.dataset.suite = '1';
    const cadre = $('.feu__cadre', sec), titre = $('.feu__titre', tete), mots = $$('[data-fx-ecarte]', tete);
    const sous = $('.feu__sous', tete), leg = $('.feu__legende', tete), indice = $('.feu__indice', sec);
    const s = () => (telephone() ? 0.9 : 0.68);
    const rentre = () => titre.offsetHeight * (1 - s()) / 2;
    const dy = () => {
      const H = cadre.clientHeight, bas = H - resa.offsetHeight - parseFloat(getComputedStyle(resa).bottom || '0') - 12;
      return Math.max(bas * 0.5, 130) - H / 2;
    };
    tl.to(tete, { y: dy, ease: 'power2.inOut', duration: 0.5 }, 1.05);
    tl.to(titre, { scale: s, ease: 'power2.inOut', duration: 0.5 }, 1.05);
    if (sous) tl.to(sous, { y: rentre, ease: 'power2.inOut', duration: 0.5 }, 1.05);
    if (leg) tl.to(leg, { y: () => -rentre(), ease: 'power2.inOut', duration: 0.5 }, 1.05);
    tl.to(mots, { xPercent: (i, el) => (el.dataset.fxEcarte === 'g' ? -12 : 12), ease: 'power2.inOut', duration: 0.5 }, 1.05);
    if (indice) tl.to(indice, { autoAlpha: 0, duration: 0.2 }, 1.05);
    tl.fromTo(resa, { y: 80, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: 'power3.out', duration: 0.4 }, 1.22);
    tl.to({}, { duration: 0.35 });
    window.ScrollTrigger.refresh();
  };
  if (sec.fxTimeline) brancher(sec.fxTimeline); else sec.addEventListener('fx:pret', () => brancher(sec.fxTimeline), { once: true });
}

/* Offrir & emporter : la carte cadeau s'incline vers la main, son reflet suit ; les montants changent la carte.
   Venir : les traits du plan se dessinent à l'arrivée. */
function offrirEmporter() {
  const zone = $('[data-carte-luxe]'), carte = zone && $('.carte-luxe', zone);
  if (carte && matchMedia('(hover: hover)').matches && !etat.calme) {
    zone.addEventListener('pointermove', (e) => {
      const r = zone.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      carte.style.setProperty('--ry', `${((x - 0.5) * 18).toFixed(1)}deg`); carte.style.setProperty('--rx', `${(-(y - 0.5) * 12).toFixed(1)}deg`);
      carte.style.setProperty('--lx', `${Math.round(x * 100)}%`);
    });
    zone.addEventListener('pointerleave', () => { carte.style.removeProperty('--rx'); carte.style.removeProperty('--ry'); carte.style.setProperty('--lx', '30%'); });
  }
  const montant = $('[data-carte-montant]');
  for (const b of $$('.oe-montant')) b.addEventListener('click', () => {
    for (const x of $$('.oe-montant')) x.setAttribute('aria-pressed', String(x === b));
    if (!montant) return;
    montant.classList.add('est-change');
    setTimeout(() => { montant.textContent = `${b.dataset.montant} €`; montant.classList.remove('est-change'); }, etat.calme ? 0 : 200);
  });
  const plan = $('[data-venir]');
  if (plan) {
    if (etat.calme || !('IntersectionObserver' in window)) plan.classList.add('est-vu');
    else { const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { plan.classList.add('est-vu'); io.disconnect(); } }, { threshold: 0.35 }); io.observe(plan); }
  }
}

/* Les fêtes : la carte de Noël s'ouvre au défilement (cadre collant ; --p de 0 à 1 lu par le CSS). */
function noelScene() {
  const sec = $('[data-effet="noel"]'); if (!sec) return;
  if (etat.calme || !gsap || !window.ScrollTrigger) { sec.style.setProperty('--p', '1'); return; }
  const indice = $('.noel-scene__indice', sec);
  window.ScrollTrigger.create({ trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.4, invalidateOnRefresh: true,
    onUpdate: (st) => { sec.style.setProperty('--p', st.progress.toFixed(3)); if (indice) indice.style.opacity = String(Math.max(0, 1 - st.progress * 5)); } });
}

/* La Saint-Sylvestre : la lueur de la salle prend la couleur du vin du plat choisi. */
function sylvestreLueur() {
  const sec = $('[data-sylvestre]'); if (!sec) return;
  const maj = () => { const li = $('.ame__plat.est-choisi', sec) || $('.ame__plat', sec); const c = li && getComputedStyle(li).getPropertyValue('--c').trim(); if (c) sec.style.setProperty('--vin', c); };
  sec.addEventListener('change', () => requestAnimationFrame(maj));
  sec.addEventListener('click', () => setTimeout(maj, 60));
  setTimeout(maj, 1200);
}

/* Infos pratiques : la carte de visite s'incline vers la main ; la semaine d'un coup d'œil (aujourd'hui, maintenant,
   curseur d'heure qui allume les créneaux ouverts et le dit en toutes lettres). */
function infosSemaine() {
  const zone = $('[data-carte-visite]'), cv = zone && $('.carte-visite', zone);
  if (cv && matchMedia('(hover: hover)').matches && !etat.calme) {
    zone.addEventListener('pointermove', (e) => { const r = zone.getBoundingClientRect(); cv.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width) - 0.5) * 16}deg`); cv.style.setProperty('--rx', `${-(((e.clientY - r.top) / r.height) - 0.5) * 10}deg`); });
    zone.addEventListener('pointerleave', () => { cv.style.setProperty('--rx', '0deg'); cv.style.setProperty('--ry', '0deg'); });
  }
  const t = $('[data-semaine]'); if (!t) return;
  const range = $('[data-semaine-range]', t), bulle = $('[data-semaine-bulle]', t), lecture = $('[data-semaine-lecture]', t), curseur = $('.semaine__curseur', t), jours = $$('.semaine__jour', t);
  const NOMS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', weekday: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  const auj = NOMS[new Date(`${p.year}-${p.month}-${p.day}T12:00:00Z`).getUTCDay()], mnt = +p.hour * 60 + +p.minute;
  for (const j of jours) if (j.dataset.jour === auj) { j.classList.add('est-aujourdhui'); j.style.setProperty('--m', (mnt / 1440).toFixed(4)); $('.semaine__maintenant', j)?.style.setProperty('left', `${(mnt / 1440) * 100}%`); }
  const lisible = (m) => { const h = Math.floor(m / 60), mm = m % 60; return `${h} h${mm ? ' ' + String(mm).padStart(2, '0') : ''}`; };
  const hauteur = () => { const l = $('.semaine__jours', t); if (l) curseur.style.setProperty('--hauteur-jours', `${l.offsetHeight}px`); };
  const maj = (m) => {
    curseur.style.setProperty('--c', (m / 1440).toFixed(4)); bulle.textContent = lisible(m);
    const ouverts = [];
    for (const j of jours) {
      let ouvert = false;
      for (const c of $$('.semaine__creneau', j)) { const on = m >= +c.dataset.a && m < +c.dataset.b; c.classList.toggle('est-allume', on); ouvert ||= on; }
      j.classList.toggle('est-ouvert', ouvert); if (ouvert) ouverts.push(j.dataset.jour);
    }
    lecture.textContent = ouverts.length ? `À ${lisible(m)} : ouvert ${ouverts.length > 1 ? ouverts.slice(0, -1).join(', ') + ' et ' + ouverts.at(-1) : ouverts[0]}.` : `À ${lisible(m)} : fermé toute la semaine.`;
  };
  const depart = Math.round(mnt / 15) * 15; range.value = String(Math.min(1425, depart));
  hauteur(); addEventListener('resize', hauteur); maj(+range.value);
  range.addEventListener('input', () => maj(+range.value));
}

demarrer({
  preparer() {
    heureDArrivee();
    videos();
    voileALHeure();
    lumiere();
    passe();
    pisteTelephone();
    terrasse();
    panorama();
    soleil();
    heros();
    chef();
    rubriques();
    lieuDefile();
    miniResa();
    feuResa();
    offrirEmporter();
    noelScene();
    sylvestreLueur();
    infosSemaine();
    feuVivant();
    braises();
    assiettes();
    decomptes();
    carteApercu();
    heuresSection();
    statuts();
    basculeMoment();
    saisonFetes();
    motTournant();
    liensService();
    volets();
    occasions();
    fetesDefile();
    emporter();
    vitrineCloches();
    rondeHero();
    datesSync();
    carteSynchro();
    aventCalendrier();
    affiches();
    carteObjet();
    saintSylvestre();
    piedMarque();
    domaine();
    planDomaine();
    devise();
    carteSemaine();
    oui();
    demande();
    lumiereService();
    libellesReservation();
    reservationPlacement();
    carteCadeauStatut();
    heureReelle();
    cloches();
    eteHeures();
    quand('pret', cadranManipulable);
    garderAncre();
    rappelSoiree();
    chargerModules();
  },
  pret: [eau()].filter(Boolean),
  /* Intro (environ 2,2 s) : le monogramme de la maison se pose, le nom et la ligne apparaissent, puis l'écran s'ouvre
     en cercle depuis le centre (plus de chiffres : retour du client, « on enlève toutes les heures »). */
  jouer() {
    if (!gsap) return null;
    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
    const pause = html.classList.contains('intro-nuit') ? 0.7 : 0;
    tl.fromTo('[data-ouverture-objet]', { scale: 0.86, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.05);
    tl.fromTo('.ouverture-nom, .ouverture-ligne', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, 0.3);
    tl.to('.ouverture-nom, .ouverture-ligne', { opacity: 0, duration: 0.25, ease: 'power1.out' }, 1.0 + pause);
    versObjet(tl, { a: 1.1 + pause, duree: 0.4, ouverture: 0.75, echelleMin: 1, echelleMax: 1 });
    if ($('.heros__actions')) {
      tl.call(() => {
        $$('.heros [data-anime="gsap"]').forEach((e) => e.classList.add('vu'));
        gsap.fromTo(HEROS_ENTREE, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, delay: 0.15, ease: 'power3.out' });
      }, null, 1.5);
    }
    return tl;
  },
  arrivee() {
    if (!gsap || !$('.heros__actions')) return;
    $$('.heros [data-anime="gsap"]').forEach((e) => e.classList.add('vu'));
    gsap.fromTo(HEROS_ENTREE, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, delay: 0.3, ease: 'power3.out' });
  },
  etatFinal() {
    $$('.heros [data-anime="gsap"]').forEach((e) => e.classList.add('vu'));
    if (!gsap) return;
    gsap.set(HEROS_ENTREE, { clearProps: 'transform,opacity' });
  },
});
