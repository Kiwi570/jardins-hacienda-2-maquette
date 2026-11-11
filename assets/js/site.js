/* Les Jardins de l'Hacienda · v6 « De midi à minuit ». Le socle gère l'ouverture, le voile « cloche » (la transition
   en assiette de la v5), l'en-tête, le menu, le mode calme, les boucles et la bibliothèque d'effets ; les modules de la
   bibliothèque (dossier modules/) sont chargés ici, page par page, et réglés sans être réécrits.
   Effets propres (data-effet) : heure (horloge de l'en-tête), axes (chiffres variables), heure-section, eau (WebGL),
   passe, vraies, apres-midi, terrasse, guirlandes, carton, braises, decompte, carte-apercu. */
import { demarrer, boucle, etat, versObjet, quand, aller, partir } from './socle/index.js?v=6';

const gsap = window.gsap;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const html = document.documentElement;
const telephone = () => matchMedia('(max-width: 760px)').matches;

/* ---------- Heures des pages : couleur du voile et chiffres de l'heure d'arrivée ---------- */
const HEURES = {
  '/': ['12:00', '#0c6f7b'], '/la-carte': ['12:30', '#9c4a22'], '/receptions': ['19:00', '#3b2c56'], '/reserver': ['21:00', '#1f1a35'],
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
    return [sv === 'soir' ? '20:00' : '12:30', h[1]];
  }
  return h;
}
function preparerVoile(url) {
  let u; try { u = new URL(url, location.href); } catch { return; }
  if (u.origin !== location.origin) return;
  const h = heurePage(u); if (!h) return;
  html.style.setProperty('--voile-fond', h[1]);
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
  'carte-du-restaurant': () => import('./modules/carte-du-restaurant/module.js?v=6'),
  'accords-mets-et-vins': () => import('./modules/accords-mets-et-vins/module.js?v=6'),
  'horaires-ouvert-maintenant': () => import('./modules/horaires-ouvert-maintenant/module.js?v=6'),
  'plan-de-salle': () => import('./modules/plan-de-salle/module.js?v=6'),
  'reservation-de-table': () => import('./modules/reservation-de-table/module.js?v=6'),
  'carte-cadeau-qui-se-compose': () => import('./modules/carte-cadeau-qui-se-compose/module.js?v=6'),
};
const OPTIONS = {
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
async function chargerModules() {
  for (const el of $$('[data-module]')) {
    const nom = el.dataset.module;
    if (!MODULES[nom]) continue;
    try {
      const { init } = await MODULES[nom]();
      apis[nom] = await init(el, nom === 'reservation-de-table' ? { ...(OPTIONS[nom] || {}), ...reglagesResa(el) } : (OPTIONS[nom] || {}));
      if (nom === 'accords-mets-et-vins') {
        for (const li of el.querySelectorAll('.ame__liste > li')) li.setAttribute('role', 'none');
        for (const r of el.querySelectorAll('.ame__radio')) r.setAttribute('data-superpose', '');
      }
    } catch (e) { console.warn('module', nom, e); }
  }
  window.dispatchEvent(new CustomEvent('hacienda:modules'));
}

/* ---------- Statut ouvert / fermé (module horaires : mêmes données et mêmes calculs partout) ---------- */
async function statuts() {
  const src = $('[data-horaires-accueil]'); const cibles = $$('[data-statut-accueil], [data-statut-accueil-bis]');
  if (!src || !cibles.length) return;
  try {
    const H = await import('./modules/horaires-ouvert-maintenant/horaires-calcul.js?v=6');
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
const TEINTES = { midi: [246, 241, 231], dejeuner: [243, 234, 217], apresmidi: [242, 222, 178], terrasse: [42, 33, 64], diner: [30, 24, 48], feu: [18, 12, 9], fetes: [26, 15, 11], minuit: [14, 10, 8] };
const NUIT = new Set(['terrasse', 'diner', 'feu', 'fetes', 'minuit']);
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
      html.style.setProperty('--voile-fond', NUIT.has(a.l) ? '#1a0f0b' : '#0c6f7b');
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
function eau() {
  const zone = $('[data-effet="eau"]'), cv = zone && $('[data-eau]', zone), img = zone && $('img', zone);
  if (!cv || !img || etat.calme) return null;
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
    if (calme || performance.now() - enDefilement < 120) return;
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
  const appliquer = (p) => {
    sec.style.setProperty('--p', p.toFixed(3));
    const k = p < 0.3 ? 0 : p < 0.62 ? 1 : 2;
    etapes.forEach((e, i) => e.classList.toggle('est-actif', i <= k));
    const allumees = Math.round(Math.max(0, Math.min(1, (p - 0.28) / 0.34)) * ampoules.length);
    ampoules.forEach((a, i) => a.classList.toggle('est-allumee', i < allumees || touchees.has(a)));
  };
  if (etat.calme || !gsap || !window.ScrollTrigger) { appliquer(1); return; }
  appliquer(0);
  gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.4, invalidateOnRefresh: true, onUpdate: (st) => appliquer(st.progress) } });
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
  const services = prochainsServices(R, 6);
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
function braises() {
  const cv = $('[data-braises]'); if (!cv) return;
  const ctx = cv.getContext('2d'); const sec = cv.closest('section');
  let w = 1, h = 1, dpr = 1;
  const taille = () => { const r = cv.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 1.5); w = Math.max(1, r.width); h = Math.max(1, r.height); cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  taille(); new ResizeObserver(taille).observe(cv);
  const N = telephone() ? 26 : 46;
  const naitre = (b, haut = false) => { b.x = w * (0.5 + (Math.random() - 0.5) * 0.22); b.y = haut ? Math.random() * h : h * (0.62 + Math.random() * 0.1); b.vx = (Math.random() - 0.5) * 14; b.vy = -(22 + Math.random() * 40); b.r = 0.8 + Math.random() * 2.2; b.vie = 0; b.max = 2.5 + Math.random() * 3; return b; };
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
}

/* ---------- Minuit · la carte cadeau se redresse au défilement ---------- */
function carteApercu() {
  if (!gsap || !window.ScrollTrigger || etat.calme) return;
  for (const c of $$('[data-effet="carte-apercu"] .cca__face')) {
    gsap.fromTo(c, { '--ry': '-28deg', '--rx': '14deg' }, { '--ry': '10deg', '--rx': '-4deg', ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
    /* Offrir : le montant parcourt les cartes de la maison (25 à 200 €) pendant qu'elle se redresse. */
    const m = $('[data-montant-tournant]', c);
    if (m) { const v = [25, 50, 100, 150, 200]; ScrollTriggerSimple(c, (p) => { m.textContent = `${v[Math.min(4, Math.floor(p * 5))]} €`; }); }
  }
}
function ScrollTriggerSimple(el, f) { window.ScrollTrigger.create({ trigger: el, start: 'top 80%', end: 'bottom top', onUpdate: (st) => f(st.progress) }); }

/* ---------- Heures de section : les chiffres roulent jusqu'à leur place à l'arrivée ---------- */
function heuresSection() {
  if (!gsap || !window.ScrollTrigger || etat.calme) return;
  for (const el of $$('.heure-section span')) gsap.fromTo(el, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
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
    try { const u = new URL(location.href); u.searchParams.set('saison', sa); history.replaceState(history.state, '', u); } catch {}
    for (const el of $$('.heure-geante')) axes(el, ete ? 0.1 : 0.8);
    poserHorloge(ete ? '15:30' : '23:00');
  };
  poser(html.dataset.saison || 'hiver');
  for (const b of choix) b.addEventListener('click', () => { html.classList.add('transition-moment'); poser(b.dataset.saisonChoix); setTimeout(() => html.classList.remove('transition-moment'), 900); rafraichir(); });
}

/* Réceptions : le mot de l'occasion (un tour à l'arrivée, puis au toucher), les volets des espaces, la demande. */
function motTournant() {
  const zone = $('.mot-tournant[data-mots]'); if (!zone) return;
  const el = $('.mot-tournant__mot', zone), mots = zone.dataset.mots.split('|'); let i = 0;
  const montrer = (k) => {
    i = (k + mots.length) % mots.length;
    if (etat.calme || !gsap) { el.textContent = mots[i]; return; }
    gsap.to(el, { yPercent: -14, opacity: 0, duration: 0.22, ease: 'power2.in', onComplete: () => { el.textContent = mots[i]; gsap.fromTo(el, { yPercent: 14, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.32, ease: 'power3.out' }); } });
  };
  if (etat.calme) return;
  /* Un tour des occasions à l'arrivée (moins de 4 s, puis le mot s'arrête sur « un mariage »), puis au toucher. */
  quand('pret', () => mots.forEach((_, k) => setTimeout(() => montrer(k + 1), 700 + 800 * k)));
  zone.style.cursor = 'pointer';
  zone.addEventListener('click', () => montrer(i + 1));
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
    pastilles.forEach((p, i) => p.classList.toggle('est-courant', i === k));
    if (focus) { const c = $('input:not([type="radio"]), textarea, input[type="radio"]:checked', etapes[k]); c && c.focus({ preventScroll: true }); }
  };
  const recap = () => {
    const d = new FormData(f);
    const o = $('[name="occasion"]:checked', f)?.dataset.un || d.get('occasion') || '';
    occ.textContent = o || occ.dataset.vide; occ.classList.toggle('est-vide', !o);
    const date = d.get('date') ? new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(d.get('date') + 'T12:00:00Z')) : (d.get('periode') || '');
    const dt = [date, d.get('invites') ? `${d.get('invites')} invités` : '', d.get('espace') && d.get('espace') !== 'À voir ensemble' ? d.get('espace') : ''].filter(Boolean).join(' · ');
    det.textContent = dt || det.dataset.vide; det.classList.toggle('est-vide', !dt);
  };
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
  montrer(0, false); recap();
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
    poserHorloge(sv === 'midi' ? '12:30' : '20:00');
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
    recap.querySelector('.placement')?.remove();
    const carte = document.createElement('div'); carte.className = 'placement'; carte.setAttribute('aria-hidden', 'true'); carte.dataset.effet = 'placement';
    const f = $('[data-resa-form]', resa), qui = f ? [f.elements.prenom?.value, f.elements.nom?.value].filter(Boolean).join(' ').trim() : '';
    carte.innerHTML = `<p class="placement__carton"><span>Réservé</span>${qui ? `<em>${qui.replace(/[<>&"]/g, '')}</em>` : ''}<strong>${jour}${heure ? ' · ' + heure : ''}</strong><span>${n} couvert${n > 1 ? 's' : ''}${d.table ? ' · table ' + d.table : ''}</span></p><svg class="placement__cloche" viewBox="0 0 120 70"><path d="M8 62 Q 10 14 60 12 Q 110 14 112 62 Z" fill="#e9a23b"/><path d="M4 62 H116" stroke="#9a5a12" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="9" r="6" fill="#9a5a12"/></svg>`;
    recap.prepend(carte);
    const rep = d.table && $('.pds__repere');
    if (rep && !rep.hidden) { rep.classList.add('est-reserve'); rep.querySelector('b').textContent = 'Réservé'; const jc = d.date ? new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(d.date + 'T12:00:00Z')) : ''; rep.querySelector('.pds__repere-etiquette > span').textContent = `${jc}${heure ? ' · ' + heure : ''} · ${n} couvert${n > 1 ? 's' : ''}`; }
    if (etat.calme) carte.classList.add('est-pose'); else requestAnimationFrame(() => requestAnimationFrame(() => carte.classList.add('est-pose')));
    setTimeout(() => { const el = $('[data-resa-recap]', resa); if (!el) return; const eh = parseFloat(getComputedStyle(html).getPropertyValue('--entete-h')) || 0, r = el.getBoundingClientRect(); const libre = innerHeight - eh, dy = r.height < libre - 32 ? r.top - eh - (libre - r.height) / 2 : r.top - eh - 16; if (Math.abs(dy) > 4) aller(scrollY + dy); }, 450);
  });
  /* Arrivée avec une table choisie sur le plan : son carton file jusqu'au récapitulatif. */
  const table = new URLSearchParams(location.search).get('table'), recap = $('[data-resa-recap]');
  if (recap && plan && table && !etat.calme) quand('pret', async () => {
    try { const { envol } = await import('./modules/envol-vers-le-panier/module.js?v=6'); const depuis = $('.pds__repere', plan) || $(`[data-table="${CSS.escape(table)}"]`, plan); if (depuis) setTimeout(() => envol({ depuis, vers: recap, forme: 'carte' }), 900); } catch (e) { console.warn('envol', e); }
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
  const maj = () => { el.textContent = heureParis(); };
  maj(); setInterval(maj, 20000);
  const [h, m] = heureParis().split(':');
  const rh = $('[data-rouleau="h"]'), rm = $('[data-rouleau="m"]');
  if (rh) rh.lastElementChild.textContent = h; if (rm) rm.lastElementChild.textContent = m;
  const mm = +h * 60 + +m; axes(el, Math.max(0, Math.min(1, (mm - 720) / 720)));
}
async function cadranManipulable() {
  const sec = $('[data-module="horaires-ouvert-maintenant"]'), cadran = sec && $('.horaires__cadran', sec), src = sec && $('script[data-horaires]', sec);
  if (!cadran || !src || etat.calme) return;
  const H = await import('./modules/horaires-ouvert-maintenant/horaires-calcul.js?v=6');
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

demarrer({
  preparer() {
    heureDArrivee();
    videos();
    voileALHeure();
    lumiere();
    passe();
    pisteTelephone();
    terrasse();
    miniResa();
    braises();
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
    demande();
    lumiereService();
    libellesReservation();
    reservationPlacement();
    carteCadeauStatut();
    heureReelle();
    cloches();
    eteHeures();
    quand('pret', cadranManipulable);
    chargerModules();
  },
  pret: [eau()].filter(Boolean),
  /* Intro (environ 2,4 s) : « 00:00 » sur le blanc de midi, les chiffres roulent jusqu'à l'heure de la page, puis
     ils glissent jusqu'à l'heure géante de l'ouverture ([data-iris-centre]) et l'écran s'ouvre depuis elle. */
  jouer() {
    if (!gsap) return null;
    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
    $$('[data-rouleau]').forEach((r, i) => {
      const n = r.children.length - 1;
      tl.fromTo(r.children, { yPercent: 0 }, { yPercent: -100 * n, duration: 0.85 + i * 0.12 }, 0.12);
    });
    tl.to('.ouverture-nom, .ouverture-ligne', { opacity: 0, duration: 0.25, ease: 'power1.out' }, 0.95);
    /* L'horloge de l'intro arrive à la taille exacte de l'heure géante (hauteur pour hauteur), sans rétrécir puis regrossir. */
    const cible = $('[data-iris-centre]'), objet = $('[data-ouverture-objet]');
    const ec = cible && objet && objet.getBoundingClientRect().height ? cible.getBoundingClientRect().height / objet.getBoundingClientRect().height : null;
    versObjet(tl, { a: 1.1, duree: 0.45, ouverture: 0.75, ...(ec ? { echelleMin: Math.min(ec, 3), echelleMax: Math.min(ec, 3) } : {}) });
    if ($('.midi__actions')) {
      tl.call(() => {
        $$('.midi [data-anime="gsap"]').forEach((e) => e.classList.add('vu'));
        gsap.fromTo('.midi__intro, .midi__actions, .midi__statut', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, delay: 0.2, ease: 'power3.out' });
      }, null, 1.5);
    }
    return tl;
  },
  arrivee() {
    if (!gsap || !$('.midi__actions')) return;
    $$('.midi [data-anime="gsap"]').forEach((e) => e.classList.add('vu'));
    gsap.fromTo('.midi__intro, .midi__actions, .midi__statut', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, delay: 0.3 });
  },
  etatFinal() {
    $$('.midi [data-anime="gsap"]').forEach((e) => e.classList.add('vu'));
    if (!gsap) return;
    gsap.set('.midi__intro, .midi__actions, .midi__statut', { clearProps: 'transform,opacity' });
  },
});
