/* Adaptateur entre les modules de la bibliothèque et le socle du projet (Jardins de l'Hacienda 2).
   Les modules importent '../../socle/socle.js' et appellent pret([...]) : dans le projet, GSAP, ScrollTrigger et
   SplitText sont déjà chargés par les pages (/assets/vendor/, scripts defer avant site.js), et le socle du projet gère
   lui-même les mesures (--entete-h, --barres-h), le mode calme (classe calme sur <html>), le défilement adouci et le
   ScrollTrigger.refresh() regroupé. Cet adaptateur ne charge donc rien : il renvoie le GSAP du projet, pour ne jamais
   avoir deux GSAP ni deux jeux de ScrollTrigger dans la page. Même API que socle/socle.js de la bibliothèque. */

import { aller } from './defilement.js?v=6';

const html = document.documentElement;
const mqReduit = matchMedia('(prefers-reduced-motion: reduce)');

let attente = 0;
function rafraichir() {
  cancelAnimationFrame(attente);
  attente = requestAnimationFrame(() => window.ScrollTrigger?.refresh());
}

/* Boucle qui s'arrête hors écran et onglet caché : fn(t, dt), comme dans la bibliothèque. */
function boucle(el, fn) {
  let visible = false, id = 0, avant = 0, fini = false;
  const tour = (t) => { if (!visible || fini || document.hidden || socle.calme) { id = 0; return; } const dt = avant ? Math.min(64, t - avant) : 16; avant = t; fn(t, dt); id = requestAnimationFrame(tour); };
  const relancer = () => { if (!id && visible && !document.hidden && !fini && !socle.calme) { avant = 0; id = requestAnimationFrame(tour); } };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; relancer(); }, { rootMargin: '100px' });
  io.observe(el);
  document.addEventListener('visibilitychange', relancer);
  return { arreter() { fini = true; io.disconnect(); cancelAnimationFrame(id); document.removeEventListener('visibilitychange', relancer); } };
}

export const socle = {
  gsap: null, ScrollTrigger: null, SplitText: null, Flip: null, OGL: null,
  /* Les modules font défiler la page par socle.lenis s'il existe, sinon par scrollTo « smooth », que le défilement
     adouci du projet annule aussitôt (confirmations restées hors de l'écran, test « vrai visiteur ») : on leur
     donne le défilement du projet, avec la même signature que Lenis. */
  lenis: { scrollTo: (y, { immediate = false } = {}) => aller(typeof y === 'number' ? y : y, { instant: immediate }) },
  get calme() { return mqReduit.matches || html.classList.contains('calme'); },
  get souris() { return matchMedia('(hover: hover) and (pointer: fine)').matches; },
  get telephone() { return innerWidth < 700; },
  webgl() {
    if (/[?&]sanswebgl\b/.test(location.search)) return false;
    try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
  },
  rafraichir,
  boucle,
  mesurer() {},
};

/* Les scripts defer (GSAP) s'exécutent avant les modules ; en secours, on attend leur arrivée (2 s au plus). */
function attendreGsap() {
  if (window.gsap) return Promise.resolve();
  return new Promise((ok) => {
    const t0 = performance.now();
    const pas = () => (window.gsap || performance.now() - t0 > 2000 ? ok() : requestAnimationFrame(pas));
    pas();
  });
}

export async function pret(besoins = []) {
  const voulus = besoins.map((b) => b.toLowerCase());
  if (voulus.length) await attendreGsap();
  const g = window.gsap || null;
  socle.gsap = g;
  if (g && window.ScrollTrigger && !socle.ScrollTrigger) { g.registerPlugin(window.ScrollTrigger); socle.ScrollTrigger = window.ScrollTrigger; }
  if (g && window.SplitText && !socle.SplitText) { g.registerPlugin(window.SplitText); socle.SplitText = window.SplitText; }
  return socle;
}
