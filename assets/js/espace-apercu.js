/* L'aperçu des modifications de l'espace restaurateur (démonstration, v7.6.0), sur chaque page du site.
   Chargé avant tout le reste (premier import de site.js) : textes [data-edit], photos [data-edit-photo], ardoise,
   horaires et fermetures (les JSON que lisent le statut et la réservation), événements, la carte (v7.7.3), puis l'annonce et une
   petite pastille « Aperçu de vos modifications ». Ne fait rien si l'espace n'a rien changé. */
import { lire, estVide, CONTEXTE, horloge, noterVu } from './espace-stock.js?v=7';
/* v7.12.0 : une même horloge pour le scénario et ses pages publiques. Les calculs d'ouverture (badge « ouvert en ce
   moment », cadran, prochains services) lisent ce repère ; hors scénario il n'est pas posé : l'heure réelle sert. */
if (CONTEXTE && horloge()) globalThis.__jhHorloge = horloge;
import { equipeDe, exceptionsOuvertures, serviceCourant } from './disponibilites.js?v=7';
import { vuePublique, offresVitrine, cadeauxVitrine, preparations, estEpuise, UNITES } from './espace-publie.js?v=7';

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

/* v7.13.0 : les pages du site lisent la version PUBLIÉE. L'aperçu (« ?apercu=1 », gardé pour cet onglet jusqu'à
   « ?apercu=0 ») montre à la place ce qui est en préparation, avec son repère : il ne publie rien. */
const APERCU = (() => { const p = new URLSearchParams(location.search);
  try { if (p.has('apercu')) { if (p.get('apercu') === '1') sessionStorage.setItem('jh-apercu', '1'); else sessionStorage.removeItem('jh-apercu'); } return sessionStorage.getItem('jh-apercu') === '1'; } catch { return p.get('apercu') === '1'; } })();
const BRUT = lire(), S = vuePublique(BRUT, APERCU);
/* L'instant présent : celui du scénario de démonstration s'il y en a un (la même horloge que l'espace), sinon l'heure du restaurant. */
const instantPresent = (fuseau = 'Europe/Paris') => { const h = CONTEXTE ? horloge() : null; if (h) return `${h.iso}T${String(Math.floor(h.min / 60)).padStart(2, '0')}:${String(h.min % 60).padStart(2, '0')}`;
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: fuseau, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value])); return `${p.year}-${p.month}-${p.day}T${String(+p.hour % 24).padStart(2, '0')}:${p.minute}`; };
if ((!estVide(S) || APERCU) && !document.querySelector('[data-espace]')) {
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
    /* v7.13.0 : « épuisé » vaut pour un jour et un service ; le service en cours se lit sur l'horloge commune. */
    let reglages = null; try { reglages = JSON.parse(document.querySelector('script[data-reservation], script[data-reservation-accueil], script[data-reservation-globale]')?.textContent || 'null'); } catch { /* sans réglages : la limite habituelle entre midi et soir */ }
    const inst = instantPresent(reglages?.fuseau), auj = inst.slice(0, 10), sv = serviceCourant(reglages, +inst.slice(11, 13) * 60 + +inst.slice(14, 16));
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
    const epuiser = (li) => { li.classList.add('est-epuise'); li.querySelector('.carte-resto__plat-nom').insertAdjacentHTML('afterend', `<span class="carte-resto__epuise">Épuisé ${sv === 'midi' ? 'ce midi' : 'ce soir'}</span>`); };
    for (const sec of $$('[data-rubrique]')) {
      const rub = sec.dataset.rubrique, ul = sec.querySelector('.carte-resto__plats'), lis = $$('.carte-resto__plat', sec), modele = lis[0];
      /* v7.8.1 : un plat est reconnu à son identifiant, plus à son rang ; les anciennes clés « rubrique/rang » sont encore lues. */
      lis.forEach((li, i) => { const id = li.dataset.plat, cle = id && (`${rub}/${id}` in m || ep[`${rub}/${id}`] !== undefined) ? `${rub}/${id}` : `${rub}/${i}`, x = m[cle]; li.dataset.cle = id ? `${rub}/${id}` : cle; if (x?.masque) { li.remove(); return; } if (x) ecrire(li, x); if (estEpuise(ep[cle], auj, sv)) epuiser(li); });
      for (const a of (c.ajouts || []).filter((x) => x.rubrique === rub)) {
        if (!modele || !ul) continue;
        const li = modele.cloneNode(true); li.classList.remove('est-epuise'); li.dataset.filtres = ''; li.querySelector('.carte-resto__epuise')?.remove(); li.querySelector('.carte-resto__etiquettes')?.remove(); li.querySelector('.carte-resto__allergenes')?.remove();
        li.dataset.cle = `${rub}/+${a.id}`; li.dataset.plat = `+${a.id}`;
        ecrire(li, { nom: a.nom, prix: a.prix, description: a.description, vegetarien: a.vegetarien, allergenes: a.allergenes }); ul.append(li);
        if (estEpuise(ep[`${rub}/+${a.id}`], auj, sv)) epuiser(li);
      }
      /* v7.13.0 : l'ordre choisi dans l'espace (les plats qu'il ne nomme pas gardent leur place, à la suite). */
      const ordre = c.ordre?.[rub]; if (ordre?.length && ul) { const rang = (li) => { const k = ordre.indexOf(li.dataset.cle); return k < 0 ? 1e6 : k; }; $$('.carte-resto__plat', sec).map((li, k) => ({ li, k })).sort((a, b) => rang(a.li) - rang(b.li) || a.k - b.k).forEach((x) => ul.append(x.li)); }
      /* L'en-tête de la rubrique, si elle a changé : « de 18 à 26 € · 6 propositions » (même règle que la page : sans les menus). */
      const change = Object.keys(m).some((k) => k.startsWith(`${rub}/`)) || (c.ajouts || []).some((x) => x.rubrique === rub);
      const detail = change && sec.querySelector('.rubrique-bande__detail'), reste = $$('.carte-resto__plat', sec);
      if (detail) { const n = reste.filter((li) => !/^menu/i.test(li.querySelector('.carte-resto__plat-nom')?.textContent || '')).map((li) => parseFloat((li.querySelector('.carte-resto__prix')?.textContent || '').replace(',', '.'))).filter((v) => Number.isFinite(v)), court = (v) => String(v).replace('.', ','); detail.textContent = `${n.length ? (Math.min(...n) === Math.max(...n) ? `${court(n[0])} €` : `de ${court(Math.min(...n))} à ${court(Math.max(...n))} €`) + ' · ' : ''}${reste.length} proposition${reste.length > 1 ? 's' : ''}`; }
    }
  });

  /* Horaires de la semaine et fermetures exceptionnelles : le statut « ouvert maintenant » les suit partout. */
  /* Mode connecté (v7.9.0) : les horaires et la réservation viennent du serveur. Ce que ce navigateur a gardé d'une
     démonstration ne doit jamais se présenter comme la règle partagée : rien n'est injecté ici. */
  const CONNECTE = !!document.querySelector('meta[name="jh-api"]');
  const sem = CONNECTE ? null : S.horaires?.semaine, exc = CONNECTE ? [] : S.horaires?.exceptions || [];
  const ouv = CONNECTE ? [] : S.resa?.ouvertures || [];
  if (sem || exc.length || ouv.length) sur(() => {
    let R = null; try { R = JSON.parse(document.querySelector('script[data-reservation], script[data-reservation-accueil], script[data-reservation-globale]')?.textContent || 'null'); } catch { /* sans réglages : pas d'ouverture à expliquer */ }
    for (const sc of $$('script[data-horaires-accueil], script[data-horaires-pied], script[data-horaires]')) json(sc, (d) => {
      const a = d.adresses?.[0]; if (!a) return d;
      if (sem) a.semaine = sem;
      /* Les fermetures posées dans l'espace d'abord (elles l'emportent), puis ses ouvertures exceptionnelles, expliquées
         comme le fait le site pour la Saint-Sylvestre (v7.8.1), puis celles déjà publiées. */
      a.exceptions = [...exc.map((e) => ({ du: e.du, au: e.au, creneaux: [], motif: e.motif || 'Fermeture exceptionnelle' })), ...(R ? exceptionsOuvertures(R, a.semaine || {}, ouv) : []), ...(a.exceptions || [])];
      return d;
    });
  });

  /* La réservation (v7.8.0) : ce que le restaurant a changé est posé tel quel dans les réglages de la page (`equipe`) ;
     la page Réserver, la mini-réservation et l'espace lisent ensuite les mêmes règles (disponibilites.js). Rien n'est
     recalculé ici : horaires déplacés, fermetures, services fermés ou complets, ouvertures exceptionnelles. */
  /* v7.12.0 : l'instant présent (celui du scénario de démonstration s'il y en a un), pour savoir si une option retient encore ses espaces. */
  if (!CONNECTE && (S.resa || sem || exc.length || S.receptions)) for (const sr of $$('script[data-reservation], script[data-reservation-accueil], script[data-reservation-globale]')) json(sr, (R) => { R.equipe = equipeDe(S, [], instantPresent(R.fuseau)); return R; });

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
    /* v7.8.1 : une liste devenue vide est écrite vide ; le site retire alors l'annonce au lieu de garder l'ancienne. */
    if (ps) json(ps, () => L.filter((e) => e.type !== 'Fête').map((e) => ({ t: e.titre, d: e.debut, p: e.prix })));
    /* Le prochain rendez-vous annoncé en haut de l'accueil lit la même liste (v7.8.0 : il gardait l'ancien titre). */
    const hr = document.querySelector('script[data-heros-agenda]');
    if (hr) json(hr, (base) => { const ancre = Object.fromEntries((base || []).map((x) => [x.id, x.a])); return L.map((e) => ({ id: e.id, t: e.titre, d: e.debut.slice(0, 10), a: ancre[e.id] || 'dates' })); });
    const ag = document.querySelector('script[data-agenda]');
    if (ag) json(ag, () => L.map((e) => ({ id: e.id, t: e.titre, d: e.debut, p: e.prix, s: e.service || 'soir' })));
  });

  /* v7.13.0 : les offres que le restaurant montre sur le site (page Réceptions). Rien n'est affiché tant qu'aucune n'est publiée pour le site. */
  sur(() => {
    const gabarit = document.querySelector('template[data-offres-site-gabarit]'); if (!gabarit) return;
    let lignes = []; try { lignes = JSON.parse(document.querySelector('script[data-offres-base]')?.textContent || '[]'); } catch { /* sans base : seulement les offres créées dans l'espace */ }
    /* Site connecté : les offres d'exemple de la démonstration n'y existent pas ; seules celles que le restaurant a créées peuvent s'afficher. */
    if (document.querySelector('meta[name="jh-api"]')) lignes = lignes.filter((x) => !x.exemple);
    const l = offresVitrine({ lignes }, BRUT, instantPresent().slice(0, 10), APERCU);
    if (CONTEXTE) noterVu(APERCU ? 'offre-apercu' : 'offre-site');
    if (!l.length) return;
    /* Le bloc n'est posé dans la page que s'il a quelque chose à montrer. */
    const sec = gabarit.content.firstElementChild.cloneNode(true);
    const prix = (v) => `${Number.isInteger(v) ? v : Number(v).toFixed(2).replace('.', ',')}\u00a0€`;
    sec.querySelector('[data-offres-site-liste]').innerHTML = l.map((o) => `<li class="offres-site__offre" data-offre-site="${echap(o.id)}">${o.visuel?.nom ? `<img class="offres-site__photo" src="/assets/images/${echap(o.visuel.nom)}-640.webp" alt="${echap(o.visuel.alt || '')}" loading="lazy" width="640" height="427">` : ''}
      <h3 class="offres-site__nom">${echap(o.nom)}${o.exemple ? ' <span class="offres-site__exemple">Exemple</span>' : ''}</h3>${o.description ? `<p class="offres-site__desc">${echap(o.description)}</p>` : ''}
      <p class="offres-site__prix">${o.prix === '' || o.prix == null ? 'Prix sur demande' : `<b data-offre-site-prix>${prix(o.prix)}</b> ${echap(UNITES[o.unite] || '')}`}</p>${o.conditions ? `<p class="offres-site__conditions">${echap(o.conditions)}</p>` : ''}</li>`).join('');
    const mention = sec.querySelector('[data-offres-site-mention]'); if (mention) mention.hidden = !l.some((o) => o.exemple);
    gabarit.after(sec);
  });

  /* v7.13.1 : la page Offrir propose les cartes cadeaux publiées du catalogue (montants, visibilité, présentation).
     Sans changement dans l'espace, la page reste telle qu'elle est livrée. Le formulaire et son envoi ne changent pas. */
  sur(() => {
    const zone = document.querySelector('.ccq__montants .ccq__puces'), sc = document.querySelector('script[data-cadeaux-base]'); if (!zone || !sc || !BRUT.offres) return;
    let montants = []; try { montants = JSON.parse(sc.textContent); } catch { return; }
    const l = cadeauxVitrine({ cadeaux: montants }, BRUT, instantPresent().slice(0, 10), APERCU), avant = zone.querySelector('input:checked')?.value;
    const choisi = l.some((o) => String(o.prix) === avant) ? avant : String((l.find((o) => o.prix === 50) || l[0])?.prix ?? '');
    zone.innerHTML = l.map((o) => `<label class="ccq__puce" data-cadeau="${echap(o.id)}"><input type="radio" name="montant" value="${o.prix}"${String(o.prix) === choisi ? ' checked' : ''}><span>${Number.isInteger(o.prix) ? o.prix : String(o.prix).replace('.', ',')}\u00a0€</span></label>`).join('')
      || '<p class="ccq__presentation" data-cadeau-aucun>Aucune carte cadeau n\'est proposée en ligne pour le moment\u00a0: appelez-nous.</p>';
    const p = document.querySelector('[data-cadeau-presentation]');
    const dire = () => { const o = l.find((x) => String(x.prix) === zone.querySelector('input:checked')?.value); if (!p) return; p.textContent = o?.description ? `${o.nom}\u00a0: ${o.description}` : ''; p.hidden = !p.textContent; };
    zone.addEventListener('change', dire); dire();
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
    /* v7.11.1 : dans un scénario de démonstration, la pastille le dit et ramène à l'espace du scénario. */
    /* v7.13.0 : en aperçu, le repère dit que rien de ceci n'est publié, et ramène à la version publiée. */
    const ici = `${location.pathname}?apercu=0${location.hash}`;
    pile.insertAdjacentHTML('beforeend', APERCU ? `<div class="apercu-espace apercu-espace--non-publie" role="status" data-apercu-non-publie><span class="apercu-espace__point" aria-hidden="true"></span><b>Aperçu — non publié</b><span class="apercu-espace__detail" data-apercu-perimetre>${(() => { const q = preparations(BRUT); return q.length ? `Cet aperçu montre vos préparations\u00a0: ${echap(q.join(', '))}.` : 'Rien n\u2019est en préparation\u00a0: cette page est identique à la version publiée.'; })()} Vos visiteurs voient toujours la version publiée.</span><a class="apercu-espace__lien" href="${ici}" data-apercu-quitter>Voir la version publiée</a><a class="apercu-espace__lien" href="/espace">${CONTEXTE ? 'Revenir à l\'espace' : 'Votre espace'}</a></div>`
      : CONTEXTE ? '<a class="apercu-espace" href="/espace"><span class="apercu-espace__point" aria-hidden="true"></span>Démonstration en cours<span class="apercu-espace__lien">Revenir à l\'espace</span></a>' : '<a class="apercu-espace" href="/espace"><span class="apercu-espace__point" aria-hidden="true"></span>Version publiée, sur cet appareil<span class="apercu-espace__lien">Votre espace</span></a>');
    document.body.append(pile);
    requestAnimationFrame(() => setTimeout(() => pile.classList.add('est-visible'), 900));
  });
}
