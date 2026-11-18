/* La barre « Que voulez-vous faire ? » de l'espace restaurateur (v7.7.1) : la fenêtre, le champ et la liste.
   Cmd ou Ctrl + K (ou « / » hors d'un champ), ou le bouton de la barre du haut, ou le bouton rond sur téléphone.
   On écrit « fermer samedi soir » : la phrase est comprise par espace-commandes.js, la proposition dit en toutes
   lettres ce qui va se passer, Entrée ou un toucher la lance (et elle s'annule comme les autres actions).
   Champ vide : des exemples à toucher, qui remplissent le champ sans rien lancer. */
import { EXEMPLES } from './espace-commandes.js?v=7';
import { typo } from './espace-regles.js?v=7';

const e = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const ICONES = {
  fermer: '<path d="M6 6l12 12M18 6L6 18"/>', ouvrir: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', complet: '<circle cx="12" cy="12" r="8.5"/><path d="M8 12h8"/>',
  fermeture: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.6h17M8 3v4M16 3v4M9.5 13l5 5M14.5 13l-5 5"/>',
  evenement: '<path d="M4 8.5V6a1.5 1.5 0 0 1 1.5-1.5h13A1.5 1.5 0 0 1 20 6v2.5a2.5 2.5 0 0 0 0 5V18a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18v-4.5a2.5 2.5 0 0 0 0-5Z"/><path d="M12 9v6M9 12h6"/>',
  annonce: '<path d="M4 10v4h3l6 4V6l-6 4H4ZM16.5 9a4 4 0 0 1 0 6"/>', resa: '<path d="M6.6 3.5h2.6l1.5 4-2 1.3a11 11 0 0 0 6.5 6.5l1.3-2 4 1.5v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"/>',
  client: '<circle cx="12" cy="8.5" r="3.6"/><path d="M4.8 20a7.2 7.2 0 0 1 14.4 0"/>', aller: '<path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5"/>', site: '<path d="M8 16L16 8M9.5 8H16v6.5"/>',
  loupe: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
};
const ico = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONES[k] || ICONES.aller}</svg>`;

/**
 * @param {HTMLElement} root  la section de l'espace
 * @param {{ comprendre: (texte: string) => object[], executer: (proposition: object) => void, actif: () => boolean }} o
 */
export function installerBarre(root, { comprendre, executer, actif }) {
  const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
  for (const k of root.querySelectorAll('[data-esp-quoi-touche]')) k.textContent = mac ? '⌘ K' : 'Ctrl K';
  const el = document.createElement('div');
  el.className = 'esp-cmd'; el.hidden = true;
  el.innerHTML = `<div class="esp-cmd__fond" data-fermer-barre></div>
    <div class="esp-cmd__boite" role="dialog" aria-modal="true" aria-labelledby="barre-titre">
      <h2 id="barre-titre" class="visuellement-cache">Que voulez-vous faire ?</h2>
      <div class="esp-cmd__champ"><span class="esp-cmd__loupe">${ico('loupe')}</span>
        <input id="barre-champ" type="text" role="combobox" aria-expanded="false" aria-controls="barre-liste" aria-autocomplete="list" aria-label="Que voulez-vous faire ?" placeholder="Que voulez-vous faire ?" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go">
        <button type="button" class="esp-rond" data-fermer-barre aria-label="Fermer">×</button></div>
      <ul class="esp-cmd__liste" id="barre-liste" role="listbox" aria-label="Ce que l'espace a compris" hidden></ul>
      <p class="esp-cmd__aide" role="status" aria-live="polite" data-barre-aide hidden></p>
      <div class="esp-cmd__exemples" data-barre-exemples><p class="esp-cmd__sur">Écrivez comme vous le diriez. Par exemple\u00a0:</p>
        <ul>${EXEMPLES.map((x) => `<li><button type="button" class="esp-cmd__exemple" data-exemple="${e(x)}">${e(typo(x))}</button></li>`).join('')}</ul></div>
    </div>`;
  root.append(el);
  const champ = el.querySelector('#barre-champ'), liste = el.querySelector('#barre-liste'), aide = el.querySelector('[data-barre-aide]'), exemples = el.querySelector('[data-barre-exemples]');
  let props = [], choisi = -1, retour = null;

  function rendre() {
    const texte = champ.value.trim();
    props = texte.length >= 2 ? comprendre(texte) : [];
    choisi = props.length ? Math.max(0, props.findIndex((p) => !p.inactif)) : -1;
    liste.hidden = !props.length; champ.setAttribute('aria-expanded', String(!!props.length));
    liste.innerHTML = props.map((p, i) => `<li class="esp-cmd__option${p.inactif ? ' est-inactive' : ''}${p.action ? ' est-action' : ''}" role="option" id="barre-o-${i}" data-option="${i}" aria-selected="${i === choisi}">
      <span class="esp-cmd__ico">${ico(p.genre)}</span><span class="esp-cmd__quoi"><b>${e(p.titre)}</b><small>${e(p.detail)}</small></span>
      <span class="esp-cmd__entree" aria-hidden="true">${p.action ? 'Faire' : 'Ouvrir'}</span></li>`).join('');
    if (choisi >= 0) champ.setAttribute('aria-activedescendant', `barre-o-${choisi}`); else champ.removeAttribute('aria-activedescendant');
    exemples.hidden = texte.length >= 2;
    aide.hidden = !(texte.length >= 2 && !props.length);
    if (!aide.hidden) aide.textContent = 'Pas compris. Dites-le autrement, par exemple « fermer samedi soir », ou écrivez le nom d\'un client.';
  }
  function choisir(i) {
    if (!props.length) return; choisi = (i + props.length) % props.length;
    for (const li of liste.children) li.setAttribute('aria-selected', String(+li.dataset.option === choisi));
    champ.setAttribute('aria-activedescendant', `barre-o-${choisi}`); liste.children[choisi]?.scrollIntoView({ block: 'nearest' });
  }
  function ouvrir(depuis) {
    if (!el.hidden) return; retour = depuis || document.activeElement;
    el.hidden = false; document.documentElement.classList.add('esp-modale-ouverte'); champ.value = ''; rendre(); champ.focus();
  }
  function fermer(rendreFocus = true) {
    if (el.hidden) return; el.hidden = true; document.documentElement.classList.remove('esp-modale-ouverte');
    if (rendreFocus) retour?.focus?.({ preventScroll: true });
  }
  function lancer(i = choisi) { const p = props[i]; if (!p) return; fermer(false); executer(p); }

  champ.addEventListener('input', rendre);
  el.addEventListener('click', (ev) => {
    if (ev.target.closest('[data-fermer-barre]')) { fermer(); return; }
    const ex = ev.target.closest('[data-exemple]'); if (ex) { champ.value = ex.dataset.exemple; rendre(); champ.focus(); return; }
    const o = ev.target.closest('[data-option]'); if (o) lancer(+o.dataset.option);
  });
  el.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') { ev.preventDefault(); fermer(); return; }
    if (ev.target === champ && ev.key === 'ArrowDown') { ev.preventDefault(); choisir(choisi + 1); return; }
    if (ev.target === champ && ev.key === 'ArrowUp') { ev.preventDefault(); choisir(choisi - 1); return; }
    if (ev.target === champ && ev.key === 'Enter') { ev.preventDefault(); lancer(); return; }
    if (ev.key === 'Tab') { const f = [...el.querySelectorAll('input, button')].filter((x) => x.offsetParent); if (!f.length) return; if (ev.shiftKey && document.activeElement === f[0]) { ev.preventDefault(); f[f.length - 1].focus(); } else if (!ev.shiftKey && document.activeElement === f[f.length - 1]) { ev.preventDefault(); f[0].focus(); } }
  });
  root.addEventListener('click', (ev) => { const b = ev.target.closest('[data-esp-quoi]'); if (b) ouvrir(b); });
  document.addEventListener('keydown', (ev) => {
    if (!actif() || !el.hidden) return;
    const dansChamp = ev.target.closest?.('input, textarea, select, [contenteditable]');
    if (((ev.ctrlKey || ev.metaKey) && !ev.shiftKey && !ev.altKey && ev.key.toLowerCase() === 'k') || (ev.key === '/' && !dansChamp && !ev.ctrlKey && !ev.metaKey)) { ev.preventDefault(); ouvrir(); }
  });
  return { ouvrir, fermer };
}
