/* L'aperçu des modifications de l'espace restaurateur (démonstration, v7.6.0), sur chaque page du site.
   Chargé avant tout le reste (premier import de site.js) : textes [data-edit], photos [data-edit-photo], ardoise,
   horaires et fermetures (les JSON que lisent le statut et la réservation), événements, puis l'annonce et une
   petite pastille « Aperçu de vos modifications ». Ne fait rien si l'espace n'a rien changé. */
import { lire, estVide } from './espace-stock.js?v=7';

const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const jourDe = (iso) => { const [a, m, j] = iso.split('-').map(Number); return new Date(Date.UTC(a, m - 1, j)).getUTCDay(); };
const ajouter = (iso, n) => { const [a, m, j] = iso.split('-').map(Number); return new Date(Date.UTC(a, m - 1, j + n)).toISOString().slice(0, 10); };
const enMin = (t) => { const [h, m] = String(t).split(':').map(Number); return h * 60 + (m || 0); };
const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const echap = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const svDe = (creneau) => (enMin(creneau.split('-')[0]) < 17 * 60 ? 'midi' : 'soir');
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

  /* La réservation : services fermés ou complets ce jour-là, fermetures, jours de la semaine sans service. */
  const sr = document.querySelector('script[data-reservation]');
  if (sr && (S.resa || sem || exc.length)) json(sr, (R) => {
    const F = R.fermetures ||= {}; F.dates ||= []; F.services ||= {}; F.par_date ||= {}; R.complets ||= {};
    for (const e of exc) for (let iso = e.du; iso <= e.au; iso = ajouter(iso, 1)) F.dates.push(iso);
    for (const [iso, l] of Object.entries(S.resa?.fermes || {})) F.par_date[iso] = [...(F.par_date[iso] || []), ...l];
    for (const [iso, l] of Object.entries(S.resa?.complets || {})) for (const sv of l) {
      const s = R.services?.[sv]; if (!s) continue;
      for (let m = enMin(s.debut); m <= enMin(s.fin); m += s.pas || 15) (R.complets[iso] ||= []).push(hhmm(m));
    }
    if (sem) {
      F.jours = JOURS.filter((j) => !(sem[j] || []).length);
      F.services = Object.fromEntries(JOURS.map((j) => [j, ['midi', 'soir'].filter((sv) => !(sem[j] || []).some((c) => svDe(c) === sv))]).filter(([, l]) => l.length));
      R.ouvertures_exceptionnelles = [];
    }
    return R;
  });

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
