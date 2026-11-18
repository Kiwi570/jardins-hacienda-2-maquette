/* L'aperçu des modifications de l'espace restaurateur (démonstration, v7.6.0), sur chaque page du site.
   Chargé avant tout le reste (premier import de site.js) : textes [data-edit], photos [data-edit-photo], ardoise,
   horaires et fermetures (les JSON que lisent le statut et la réservation), événements, la carte (v7.7.3), puis l'annonce et une
   petite pastille « Aperçu de vos modifications ». Ne fait rien si l'espace n'a rien changé. */
import { lire, estVide } from './espace-stock.js?v=7';
import { equipeDe } from './disponibilites.js?v=7';

const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const echap = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const sur = (f) => { try { f(); } catch (e) { console.warn('aperçu espace', e); } };
const json = (sc, f) => sur(() => { const d = JSON.parse(sc.textContent); const r = f(d) || d; sc.textContent = JSON.stringify(r); });

/** Pose une photo choisie dans l'espace : de la photothèque (nom + largeurs) ou envoyée depuis l'appareil (src). */
export function poserPhoto(fig, p) {
  const img = fig?.querySelector('img'); if (!img || !p) return;
  if (p.src || p.nom) {
    fig.querySelectorAll('source').forEach((s) => s.remove());
    if (p.src) { img.removeAttribute('srcset'); img.src = p.src; }
    else { const l = p.l?.length ? p.l : [640]; img.srcset = l.map((w) => `/assets/images/${p.nom}-${w}.webp ${w}w`).join(', '); img.src = `/assets/images/${p.nom}-${l.find((w) => w >= 1000) || l[l.length - 1]}.webp`; }
  }
  if (p.cadrage) { fig.style.setProperty('--cadrage', p.cadrage); fig.style.setProperty('--cadrage-mobile', p.cadrage); }
}

/** Les événements tels que l'espace les a laissés : ceux du site modifiés ou masqués, et les nouveaux. */
export function evenements(base, S) {
  const m = S.evenements?.modifs || {};
  return [...base.map((e) => ({ ...e, ...(m[e.id] || {}) })), ...(S.evenements?.ajouts || []).map((e) => ({ ...e, ...(m[e.id] || {}), nouveau: true }))]
    .sort((a, b) => a.debut.localeCompare(b.debut));
}

const S = lire();
if (!estVide(S) && !document.querySelector('[data-espace]')) {
  /* Textes */
  sur(() => { for (const el of $$('[data-edit]')) { const v = S.textes?.[el.dataset.edit]; if (v) el.textContent = v; } });
  /* Photos */
  sur(() => { for (const fig of $$('[data-edit-photo]')) poserPhoto(fig, S.photos?.[fig.dataset.editPhoto]); });

  /* L'ardoise de la semaine : le dos du polaroid (accueil) et l'ardoise de La carte. */
  if (S.ardoise) sur(() => {
    const lignes = (a) => a.lignes.filter((l) => l.plat).map((l) => `<li><span>${echap(l.plat)}</span><span data-prix>${echap(l.prix)}</span></li>`).join('');
    const j = S.ardoise.jour;
    const dos = document.querySelector('.ardoise-dos');
    if (dos && j) { dos.querySelector('.ardoise-dos__titre').textContent = j.titre; dos.querySelector('.ardoise-dos__liste').innerHTML = lignes(j); dos.querySelector('.ardoise-dos__mot').textContent = j.mot; }
    const sc = document.querySelector('script[data-ardoise]');
    if (sc) {
      json(sc, (d) => ({ ...d, jour: S.ardoise.jour || d.jour, soir: S.ardoise.soir || d.soir }));
      const surf = document.querySelector('.ardoise__surface');
      if (surf && j) {
        surf.querySelector('.ardoise__titre span').textContent = j.titre;
        surf.querySelector('.ardoise__liste').innerHTML = j.lignes.filter((l) => l.plat).map((l) => `<li><span class="ardoise__plat">${echap(l.plat)}</span><span class="ardoise__prix" data-prix>${echap(l.prix)}</span></li>`).join('');
        surf.querySelector('.ardoise__mot span').textContent = j.mot;
      }
    }
  });

  /* La carte (v7.7.3) : plats modifiés, retirés, ajoutés, allergènes, « épuisé aujourd'hui » ; l'en-tête de chaque
     rubrique (fourchette de prix, nombre de propositions) suit. Clé d'un plat : « rubrique/rang ». */
  if (S.carte && document.querySelector('[data-rubrique] .carte-resto__plat')) sur(() => {
    const c = S.carte, m = c.modifs || {}, ep = c.epuises || {};
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map((x) => [x.type, x.value])), auj = `${p.year}-${p.month}-${p.day}`;
    const prix = (v) => { if (v == null || v === '') return ''; const n = typeof v === 'number' ? v : /^\s*\d+(?:[.,]\d{1,2})?\s*$/.test(String(v)) ? parseFloat(String(v).replace(',', '.')) : null; return n == null ? String(v) : `${Number.isInteger(n) ? n : n.toFixed(2).replace('.', ',')} €`; };
    const ecrire = (li, x) => {
      li.removeAttribute('data-texte'); /* la recherche de la carte relit le texte affiché */
      if ('nom' in x) li.querySelector('.carte-resto__plat-nom').textContent = x.nom;
      if ('prix' in x) { const el = li.querySelector('.carte-resto__prix'); el.className = 'carte-resto__prix'; el.textContent = prix(x.prix); el.dataset.prix = typeof x.prix === 'number' ? x.prix : ''; }
      if ('description' in x) { let d = li.querySelector('.carte-resto__desc'); if (x.description) { if (!d) { d = document.createElement('p'); d.className = 'carte-resto__desc'; li.querySelector('.carte-resto__plat-ligne').after(d); } d.textContent = x.description; } else d?.remove(); }
      if ('vegetarien' in x) {
        li.dataset.filtres = [...new Set([...(li.dataset.filtres || '').split(' ').filter((f) => f && f !== 'vegetarien'), ...(x.vegetarien ? ['vegetarien'] : [])])].join(' ');
        const r = li.querySelector('.carte-resto__regime[title="Végétarien"]');
        if (x.vegetarien && !r) { let ul = li.querySelector('.carte-resto__etiquettes'); if (!ul) { ul = document.createElement('ul'); ul.className = 'carte-resto__etiquettes'; ul.setAttribute('aria-label', 'Régime et allergènes'); li.append(ul); } ul.insertAdjacentHTML('afterbegin', '<li class="carte-resto__regime" title="Végétarien"><svg class="carte-resto__picto" aria-hidden="true" focusable="false"><use href="#carte-vegetarien"></use></svg><span class="carte-resto__sr">Végétarien</span></li>'); }
        if (!x.vegetarien && r) { const ul = r.parentElement; r.remove(); if (!ul.children.length) ul.remove(); }
      }
      if ('allergenes' in x) { li.querySelector('.carte-resto__allergenes')?.remove(); if (x.allergenes?.length) { const a = document.createElement('p'); a.className = 'carte-resto__allergenes'; a.textContent = `Allergènes\u00a0: ${x.allergenes.join(', ').toLowerCase()}`; (li.querySelector('.carte-resto__desc') || li.querySelector('.carte-resto__plat-ligne')).after(a); } }
    };
    const epuiser = (li) => { li.classList.add('est-epuise'); li.querySelector('.carte-resto__plat-nom').insertAdjacentHTML('afterend', '<span class="carte-resto__epuise">Épuisé aujourd\'hui</span>'); };
    for (const sec of $$('[data-rubrique]')) {
      const rub = sec.dataset.rubrique, ul = sec.querySelector('.carte-resto__plats'), lis = $$('.carte-resto__plat', sec), modele = lis[0];
      lis.forEach((li, i) => { const cle = `${rub}/${i}`, x = m[cle]; if (x?.masque) { li.remove(); return; } if (x) ecrire(li, x); if (ep[cle] === auj) epuiser(li); });
      for (const a of (c.ajouts || []).filter((x) => x.rubrique === rub)) {
        if (!modele || !ul) continue;
        const li = modele.cloneNode(true); li.classList.remove('est-epuise'); li.dataset.filtres = ''; li.querySelector('.carte-resto__epuise')?.remove(); li.querySelector('.carte-resto__etiquettes')?.remove(); li.querySelector('.carte-resto__allergenes')?.remove();
        ecrire(li, { nom: a.nom, prix: a.prix, description: a.description, vegetarien: a.vegetarien, allergenes: a.allergenes }); ul.append(li);
        if (ep[`${rub}/+${a.id}`] === auj) epuiser(li);
      }
      /* L'en-tête de la rubrique, si elle a changé : « de 18 à 26 € · 6 propositions » (même règle que la page : sans les menus). */
      const change = Object.keys(m).some((k) => k.startsWith(`${rub}/`)) || (c.ajouts || []).some((x) => x.rubrique === rub);
      const detail = change && sec.querySelector('.rubrique-bande__detail'), reste = $$('.carte-resto__plat', sec);
      if (detail) { const n = reste.filter((li) => !/^menu/i.test(li.querySelector('.carte-resto__plat-nom')?.textContent || '')).map((li) => parseFloat((li.querySelector('.carte-resto__prix')?.textContent || '').replace(',', '.'))).filter((v) => Number.isFinite(v)), court = (v) => String(v).replace('.', ','); detail.textContent = `${n.length ? (Math.min(...n) === Math.max(...n) ? `${court(n[0])} €` : `de ${court(Math.min(...n))} à ${court(Math.max(...n))} €`) + ' · ' : ''}${reste.length} proposition${reste.length > 1 ? 's' : ''}`; }
    }
  });

  /* Horaires de la semaine et fermetures exceptionnelles : le statut « ouvert maintenant » les suit partout. */
  const sem = S.horaires?.semaine, exc = S.horaires?.exceptions || [];
  if (sem || exc.length) sur(() => {
    for (const sc of $$('script[data-horaires-accueil], script[data-horaires-pied], script[data-horaires]')) json(sc, (d) => {
      const a = d.adresses?.[0]; if (!a) return d;
      if (sem) a.semaine = sem;
      a.exceptions = [...(a.exceptions || []), ...exc.map((e) => ({ du: e.du, au: e.au, creneaux: [], motif: e.motif || 'Fermeture exceptionnelle' }))];
      return d;
    });
  });

  /* La réservation (v7.8.0) : ce que le restaurant a changé est posé tel quel dans les réglages de la page (`equipe`) ;
     la page Réserver, la mini-réservation et l'espace lisent ensuite les mêmes règles (disponibilites.js). Rien n'est
     recalculé ici : horaires déplacés, fermetures, services fermés ou complets, ouvertures exceptionnelles. */
  if (S.resa || sem || exc.length) for (const sr of $$('script[data-reservation], script[data-reservation-accueil], script[data-reservation-globale]')) json(sr, (R) => { R.equipe = equipeDe(S); return R; });

  /* Les événements : les billets de la page Les fêtes, la prochaine soirée de l'accueil, l'agenda de Réserver. */
  if (S.evenements) sur(() => {
    const liste = document.querySelector('.agd__liste');
    const base = liste ? $$('li.agd__date', liste).map((li) => ({ id: li.id.replace(/^date-/, ''), debut: li.dataset.debut })) : [];
    const m = S.evenements.modifs || {};
    if (liste) {
      const modele = liste.querySelector('li.agd__date');
      const remplir = (li, e) => {
        li.dataset.debut = e.debut; li.dataset.type = e.type;
        li.dataset.reserver = `/reserver?date=${e.debut.slice(0, 10)}&service=${e.service || 'soir'}#formulaire`;
        const t = li.querySelector('.agd__titre'); if (t) t.textContent = e.titre;
        let p = li.querySelector('.agd__texte[data-prix]');
        if (e.prix) { if (!p) { p = document.createElement('p'); p.className = 'agd__texte'; p.setAttribute('data-prix', ''); t?.after(p); } p.textContent = e.prix; } else p?.remove();
        poserPhoto(li.querySelector('figure'), { nom: e.src ? null : e.image, l: e.l, src: e.src, cadrage: e.cadrage });
      };
      for (const b of base) {
        const e = m[b.id], li = document.getElementById('date-' + b.id); if (!e || !li) continue;
        if (e.masque) { li.remove(); continue; }
        remplir(li, { ...b, ...e });
      }
      for (const e of S.evenements.ajouts || []) {
        const x = { ...e, ...(m[e.id] || {}) }; if (x.masque || !modele) continue;
        const li = modele.cloneNode(true); li.id = 'date-' + x.id; li.querySelector('.billet__menu')?.remove();
        remplir(li, x);
        const apres = $$('li.agd__date', liste).find((o) => (o.dataset.debut || '') > x.debut);
        liste.insertBefore(li, apres || null);
      }
    }
    /* L'espace garde la liste à jour (sans les photos) : la prochaine soirée de l'accueil et l'agenda de Réserver la lisent. */
    const L = (S.evenements.liste || []).filter((e) => !e.masque);
    const ps = document.querySelector('[data-prochaine-soiree] script');
    if (ps && L.length) json(ps, () => L.filter((e) => e.type !== 'Fête').map((e) => ({ t: e.titre, d: e.debut, p: e.prix })));
    /* Le prochain rendez-vous annoncé en haut de l'accueil lit la même liste (v7.8.0 : il gardait l'ancien titre). */
    const hr = document.querySelector('script[data-heros-agenda]');
    if (hr && L.length) json(hr, (base) => { const ancre = Object.fromEntries((base || []).map((x) => [x.id, x.a])); return L.map((e) => ({ id: e.id, t: e.titre, d: e.debut.slice(0, 10), a: ancre[e.id] || 'dates' })); });
    const ag = document.querySelector('script[data-agenda]');
    if (ag && L.length) json(ag, () => L.map((e) => ({ id: e.id, t: e.titre, d: e.debut, p: e.prix })));
  });

  /* L'annonce du restaurant, puis la pastille qui rappelle que ces changements ne se voient que dans ce navigateur. */
  sur(() => {
    const pile = document.createElement('div'); pile.className = 'apercu-pile';
    const a = S.annonce;
    let fermee = ''; try { fermee = sessionStorage.getItem('jh-annonce-fermee') || ''; } catch { /* rien */ }
    if (a?.active && a.texte && fermee !== a.texte) {
      pile.insertAdjacentHTML('beforeend', `<aside class="annonce-site" aria-label="Annonce du restaurant"><p class="annonce-site__sur">Annonce</p><p class="annonce-site__texte">${echap(a.texte)}</p><button type="button" class="annonce-site__fermer" aria-label="Fermer l'annonce">×</button></aside>`);
      pile.querySelector('.annonce-site__fermer').addEventListener('click', (ev) => { ev.currentTarget.closest('.annonce-site').remove(); try { sessionStorage.setItem('jh-annonce-fermee', a.texte); } catch { /* rien */ } });
    }
    pile.insertAdjacentHTML('beforeend', '<a class="apercu-espace" href="/espace"><span class="apercu-espace__point" aria-hidden="true"></span>Aperçu de vos modifications<span class="apercu-espace__lien">Votre espace</span></a>');
    document.body.append(pile);
    requestAnimationFrame(() => setTimeout(() => pile.classList.add('est-visible'), 900));
  });
}
