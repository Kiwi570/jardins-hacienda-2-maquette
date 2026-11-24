// Réservation de table, une étape à la fois (v7.5.31) : 1 Quand (le jour en cartes de calendrier, ou « Plus tard » et
// son calendrier du mois ; midi ou soir), 2 Combien (les assiettes se posent autour de la table) et à quelle heure (une
// frise, la ligne d'or file jusqu'à l'heure choisie), 3 Où (salle ou terrasse, demande particulière), 4 Vous.
// À côté, le carton de table se remplit à mesure (chaque ligne y mène à son étape) ; vérification, confirmation, et le
// tampon « Réservé » à l'envoi simulé. Prérempli depuis l'adresse (?date=…&service=…&heure=…&couverts=…&espace=…, et
// table=… venu du plan de salle) ; brouillon gardé si l'on recharge la page.
// Tiré de jardins-hacienda-maquette/reserver-formulaire (champs, préremplissage, erreurs à côté du champ, envoi simulé)
// et de pizzalyght-maquette/panier (créneaux calculés à l'heure du lieu avec un délai, état relu, focus rendu après rendu).
// Sans JavaScript : un formulaire ordinaire d'un seul tenant (calendrier, liste d'heures, nombre). Mode calme : sans transition.
import { pret } from '../../socle/socle.js?v=7';
import { ajouterResaSite, ajouterDemandeSite, horloge as horlogeDemo, avecContexte, temporaire, refusEnregistrement } from '../../espace-stock.js?v=7';
// v7.8.0 : ouvertures, heures d'arrivée et « complet » viennent des règles communes au site et à l'espace.
import { etatService, arrivees, faisabilite, alternatives } from '../../disponibilites.js?v=7';
import { codeVenue } from '../../espace-venue.js?v=7';

const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const echap = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const enMin = (t) => { const [h, m] = String(t).split(':').map(Number); return h * 60 + (m || 0); };
const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const heure = (m) => { const h = Math.floor(m / 60), r = m % 60; return `${h} h${r ? ' ' + String(r).padStart(2, '0') : ''}`; };
const ajouter = (iso, n) => { const [a, m, j] = iso.split('-').map(Number); return new Date(Date.UTC(a, m - 1, j + n)).toISOString().slice(0, 10); };
const jourDe = (iso) => { const [a, m, j] = iso.split('-').map(Number); return new Date(Date.UTC(a, m - 1, j)).getUTCDay(); };
const dateLongue = (iso, o = { weekday: 'long', day: 'numeric', month: 'long' }) => { const [a, m, j] = iso.split('-').map(Number); return new Intl.DateTimeFormat('fr-FR', { ...o, timeZone: 'UTC' }).format(new Date(Date.UTC(a, m - 1, j))); };
const maj = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const court = (iso, o) => dateLongue(iso, o).replace('.', '');
function maintenant(fuseau) {
  /* v7.11.1 : dans un scénario de démonstration, la date et l'heure sont celles du scénario (les mêmes que dans l'espace). */
  const simulee = horlogeDemo(); if (simulee) return { iso: simulee.iso, min: simulee.min };
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: fuseau, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { iso: `${p.year}-${p.month}-${p.day}`, min: (+p.hour % 24) * 60 + +p.minute };
}
/** Nombre stable tiré d'un texte (FNV-1a) : complets simulés identiques d'un affichage à l'autre. */
const hache = (t) => { let h = 2166136261; for (const c of t) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0) % 100; };

const ICO = {
  midi: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.5M12 18.9v2.5M2.6 12h2.5M18.9 12h2.5M5.4 5.4l1.8 1.8M16.8 16.8l1.8 1.8M5.4 18.6l1.8-1.8M16.8 7.2l1.8-1.8"/></svg>',
  soir: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19.4 14.7A7.9 7.9 0 1 1 9.3 4.6a6.3 6.3 0 0 0 10.1 10.1Z"/></svg>',
  cal: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.6h17M8 3v4M16 3v4M8 13.5h2M14 13.5h2M8 17h2"/></svg>',
  crayon: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 20l1-4.2L15.6 5.2a2 2 0 0 1 2.8 0l.4.4a2 2 0 0 1 0 2.8L8.2 19 4 20Z"/><path d="M13.8 7l3.2 3.2"/></svg>',
};
/** Les étapes de chaque ligne du carton (et de chaque erreur). */
const ETAPE_DE = { date: 1, service: 1, couverts: 2, heure: 2, espace: 3, demande: 3, contact: 4 };
const QUOI = { date: 'le jour', heure: 'l\'heure', couverts: 'les couverts', espace: 'l\'installation', demande: 'la demande', contact: 'les coordonnées' };

/**
 * @param {HTMLElement} root  section[data-module="reservation-de-table"] : script[data-reservation] (réglages), form[data-resa-form], aside[data-resa-recap]
 * @param {object} [options]
 * @param {object} [options.reglages]  les réglages (sinon le JSON de la page)
 * @param {function} [options.envoyer] async (demande) => { reference } : l'envoi réel (par défaut, simulé)
 * @param {object} [options.tables]    { [numéro de table]: places } : pour retirer une table devenue trop petite
 * @param {function} [options.enregistrer] (demande) => booléen : l'enregistrement de la demande ; false : rien n'est annoncé comme envoyé
 * @param {function} [options.complet] (iso, 'HH:MM', couverts) => booléen : disponibilité réelle (par défaut, le JSON et la simulation)
 */
export async function init(root, options = {}) {
  const s = await pret([]);
  const form = root.querySelector('[data-resa-form]'), recap = root.querySelector('[data-resa-recap]');
  let R = options.reglages;
  if (!R) { try { R = JSON.parse(root.querySelector('script[data-reservation]')?.textContent || 'null'); } catch { R = null; } }
  if (!form || !recap || !R) return { detruire() {} };
  const o = { ...options };
  const fuseau = R.fuseau || 'Europe/Paris', delai = R.delai_minutes ?? 60, horizon = R.jours_a_l_avance ?? 60, maxi = R.couverts_max ?? 10;
  const services = Object.entries(R.services || {}).map(([id, v]) => ({ id, libelle: v.libelle || maj(id), d: enMin(v.debut), f: enMin(v.fin), pas: v.pas || 15 }));
  const F = R.fermetures || {};
  const $ = (sel) => form.querySelector(sel);
  const champ = (n) => form.elements.namedItem(n);
  const doux = () => s.calme ? 'auto' : 'smooth';
  root.classList.add('est-actif');
  if (s.calme) root.classList.add('est-calme');

  // ---------- Disponibilités ----------
  const ouvert = (iso, sid) => etatService(R, iso, sid).ouvert;
  function estComplet(iso, t, couverts, sid) {
    /* Ce que le restaurant a dit complet l'emporte toujours ; ensuite la disponibilité réelle (option), puis le JSON et la simulation. */
    /* v7.12.0 : la salle retenue par une réception (option encore valable ou réception confirmée) : le service n'est pas proposé. */
    if (sid && (etatService(R, iso, sid).complet || etatService(R, iso, sid).prive)) return true;
    if ((R.complets?.[iso] || []).includes(t)) return true;
    if (o.complet) return !!o.complet(iso, t, couverts);
    if (!R.complets_simules) return false;
    const m = enMin(t), pointe = (m >= 1200 && m <= 1245) || (m >= 750 && m <= 795), weekend = [5, 6].includes(jourDe(iso));
    return hache(iso + t) < (pointe ? 48 : 14) + (weekend ? 14 : 0) + Math.max(0, couverts - 4) * 6 - (ajouter(maintenant(fuseau).iso, 7) < iso ? 20 : 0);
  }
  /** Créneaux d'un service ce jour-là : { t, libelle, etat : 'libre' | 'complet' } ; les heures déjà passées (avec le délai) sont retirées. */
  function creneaux(iso, sid, couverts) {
    const sv = services.find((x) => x.id === sid); if (!sv || !ouvert(iso, sid)) return [];
    const n = maintenant(fuseau), out = [];
    for (const t of arrivees(R, iso, sid)) {
      const m = enMin(t); if (iso === n.iso && m < n.min + delai) continue;
      out.push({ t, libelle: heure(m), etat: estComplet(iso, t, couverts, sid) ? 'complet' : 'libre' });
    }
    return out;
  }
  const libres = (iso, sid, c) => creneaux(iso, sid, c).filter((x) => x.etat === 'libre').length;
  const reservable = (iso, c = 2) => services.some((sv) => libres(iso, sv.id, c) > 0);
  /** Un service ouvert, avec des heures encore à venir, mais plus aucune de libre : complet (v7.11.0). */
  const complet = (iso, sid, c = val().couverts) => { const l = creneaux(iso, sid, c); return l.length > 0 && l.every((x) => x.etat === 'complet'); };
  /* v7.12.1 : un espace retenu par une ou plusieurs réceptions n'est pas proposé ; l'autre le reste s'il est utilisable. */
  const enSaison = (e, iso) => !e.mois || !iso || e.mois.includes(+iso.slice(5, 7));
  const retenu = (e, iso, sid = val?.().service) => { if (!iso || !sid) return false; const x = etatService(R, iso, sid); return e.id === 'terrasse' ? !!x.terrassePrise : e.id === 'salle' ? !!x.sallePrise : false; };
  const espaceOk = (e, iso, sid) => enSaison(e, iso) && !retenu(e, iso, sid);

  // ---------- Champs ----------
  const dateEl = champ('date'), couvEl = champ('couverts');
  /* Aujourd'hui et le dernier jour réservable : relus au fil du temps (v7.8.1), une page restée ouverte après minuit ne garde plus la veille. */
  let auj = '', fin = '';
  function jourCourant() { const a = maintenant(fuseau).iso; if (a === auj) return false; auj = a; fin = ajouter(auj, horizon); dateEl.min = auj; dateEl.max = fin; return true; }
  jourCourant();
  couvEl.max = maxi;
  const val = () => {
    const fd = new FormData(form);
    return { date: fd.get('date') || '', service: fd.get('service') || '', heure: fd.get('heure') || '', couverts: Math.max(1, Math.min(maxi, parseInt(fd.get('couverts'), 10) || 2)),
      espace: fd.get('espace') || '', table: (fd.get('table') || '').trim(), demandes: fd.getAll('demande'), message: (fd.get('message') || '').trim(),
      prenom: (fd.get('prenom') || '').trim(), nom: (fd.get('nom') || '').trim(), telephone: (fd.get('telephone') || '').trim(), email: (fd.get('email') || '').trim() };
  };

  // ---------- 1 · Le jour : sept cartes de calendrier, puis « Plus tard » (le calendrier du mois) ----------
  const jours = root.querySelector('[data-resa-jours]'), cal = root.querySelector('[data-resa-cal]');
  let calOuvert = false, calMois = '';
  const dispo = (iso, c) => services.map((sv) => ({ sv, libre: libres(iso, sv.id, c) > 0 }));
  const dispoTexte = (d) => { const l = d.filter((x) => x.libre).map((x) => x.sv.libelle.toLowerCase()); return l.length ? `libre ${l.join(' et ')}` : ''; };
  function carte(iso, nom, pressee, attrs) {
    const d = dispo(iso, val().couverts), ok = d.some((x) => x.libre), ferme = !services.some((sv) => ouvert(iso, sv.id));
    const etiquette = `${nom ? nom + ', ' : ''}${dateLongue(iso)} : ${ok ? dispoTexte(d) : ferme ? 'fermé' : 'complet'}`;
    /* v7.11.0 : un jour complet reste choisissable : on y propose d'autres moments et la liste d'attente. Un jour fermé, non. */
    const plein = !ok && services.some((sv) => complet(iso, sv.id));
    return `<button type="button" class="resa__jour${plein ? ' est-complet' : ''}" ${attrs} aria-pressed="${pressee}" ${ok || plein ? '' : 'disabled'} aria-label="${echap(etiquette)}${plein ? ' : voir les autres possibilités' : ''}">`
      + `<span class="resa__jour-mois">${court(iso, { month: 'short' })}</span><b class="resa__jour-n">${+iso.slice(8)}</b><span class="resa__jour-nom">${nom === "Aujourd'hui" ? '<span class="resa__nom-long">Aujourd\'hui</span><span class="resa__nom-court">Auj.</span>' : nom || maj(court(iso, { weekday: 'short' }))}</span>`
      + `<span class="resa__jour-dispo">${ok ? d.map((x) => `<i class="resa__dispo${x.libre ? ' est-libre' : ''}">${ICO[x.sv.id] || ''}</i>`).join('') : `<small>${ferme ? 'fermé' : 'complet'}</small>`}</span></button>`;
  }
  function rendreJours() {
    if (!jours) return;
    const v = val(), sept = ajouter(auj, 6), loin = v.date > sept;
    jours.innerHTML = Array.from({ length: 7 }, (_, k) => { const iso = ajouter(auj, k); return carte(iso, k === 0 ? "Aujourd'hui" : k === 1 ? 'Demain' : '', iso === v.date, `data-jour="${iso}"`); }).join('')
      + (loin ? carte(v.date, '', true, 'data-resa-plus-tard aria-controls="resa-cal" aria-expanded="' + calOuvert + '"').replace('class="resa__jour"', 'class="resa__jour resa__jour--loin"')
        : `<button type="button" class="resa__jour resa__jour--plus" data-resa-plus-tard aria-controls="resa-cal" aria-expanded="${calOuvert}"><span class="resa__jour-ico">${ICO.cal}</span><span class="resa__jour-nom">Plus tard</span></button>`);
    jours.hidden = false;
  }
  function rendreCal() {
    if (!cal) return;
    const v = val();
    if (!calMois) calMois = (v.date && v.date > ajouter(auj, 6) ? v.date : ajouter(auj, 7)).slice(0, 7);
    const premier = `${calMois}-01`, [a, m] = calMois.split('-').map(Number), nb = new Date(Date.UTC(a, m, 0)).getUTCDate(), decale = (jourDe(premier) + 6) % 7;
    let cases = '<span></span>'.repeat(decale);
    for (let d = 1; d <= nb; d++) {
      const iso = `${calMois}-${String(d).padStart(2, '0')}`, plage = iso >= auj && iso <= fin, libre = plage && reservable(iso, v.couverts), ok = libre || (plage && services.some((sv) => complet(iso, sv.id, v.couverts)));
      cases += `<button type="button" class="resa__cal-j${iso === auj ? ' est-auj' : ''}" data-cal-jour="${iso}" aria-pressed="${iso === v.date}" ${ok ? '' : 'disabled'} aria-label="${echap(maj(dateLongue(iso)))}${libre ? '' : ok ? ' : complet, voir les autres possibilités' : plage ? ' : fermé' : ''}">${d}</button>`;
    }
    cal.innerHTML = `<div class="resa__cal-tete"><button type="button" class="resa__cal-nav" data-cal-mois="-1" ${calMois <= auj.slice(0, 7) ? 'disabled' : ''} aria-label="Mois précédent">‹</button>`
      + `<p class="resa__cal-titre" aria-live="polite">${maj(dateLongue(premier, { month: 'long', year: 'numeric' }))}</p>`
      + `<button type="button" class="resa__cal-nav" data-cal-mois="1" ${calMois >= fin.slice(0, 7) ? 'disabled' : ''} aria-label="Mois suivant">›</button></div>`
      + `<div class="resa__cal-noms" aria-hidden="true">${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((x) => `<span>${x}</span>`).join('')}</div><div class="resa__cal-grille">${cases}</div>`;
  }
  function ouvrirCal(on) {
    if (!cal) return;
    calOuvert = on; if (on) { calMois = ''; rendreCal(); }
    cal.hidden = !on; root.querySelector('[data-resa-plus-tard]')?.setAttribute('aria-expanded', String(on));
    if (on) { cal.classList.remove('est-ouvert'); void cal.offsetWidth; cal.classList.add('est-ouvert'); (cal.querySelector('[aria-pressed="true"]') || cal.querySelector('.resa__cal-j:not(:disabled)'))?.focus({ preventScroll: true }); }
  }

  // Services du jour : fermés ou sans créneau libre, désactivés ; on garde le choix s'il reste possible.
  function majServices() {
    const v = val();
    for (const r of form.querySelectorAll('input[name="service"]')) {
      const ok = !!v.date && libres(v.date, r.value, v.couverts) > 0; r.disabled = !ok;
      const note = r.closest('label')?.querySelector('[data-note]'); if (note) note.textContent = !v.date ? '' : ouvert(v.date, r.value) ? (ok ? '' : 'complet') : 'fermé';
    }
    const coche = form.querySelector('input[name="service"]:checked');
    if (v.date && (!coche || coche.disabled)) { const premier = form.querySelector('input[name="service"]:not(:disabled)'); if (premier) premier.checked = true; else if (coche) coche.checked = false; }
  }

  // ---------- 2 · Les couverts : les assiettes autour de la table ----------
  const groupe = root.querySelector('[data-resa-groupe]'), tableEl = root.querySelector('[data-resa-table]'), mot = root.querySelector('[data-resa-couverts-mot]');
  const MOTS = ['', 'Une table pour vous', 'Un dîner à deux', 'Une table pour trois', 'Une table pour quatre', 'Une table pour cinq', 'Une table pour six', 'Une tablée de sept', 'Une tablée de huit', 'Une tablée de neuf', 'Une grande tablée de dix'];
  function rendreTable(c) {
    if (!tableEl) return;
    if (!tableEl.childElementCount) tableEl.innerHTML = '<span class="resa__nappe"><span class="resa__centre"></span></span>' + Array.from({ length: maxi }, () => '<span class="resa__assiette"></span>').join('');
    const debut = c === 1 ? 180 : 270;
    tableEl.querySelectorAll('.resa__assiette').forEach((p, k) => {
      const on = k < c; p.classList.toggle('est-mise', on);
      if (on) p.style.setProperty('--a', `${debut + (k * 360) / c}deg`);
    });
    tableEl.style.setProperty('--n', c);
    if (mot) { const sv = val().service, t = MOTS[c] || `Une table pour ${c}`; mot.textContent = sv === 'midi' && c === 2 ? 'Un déjeuner à deux' : t; mot.hidden = false; }
  }
  /* Une table choisie sur le plan ne suit pas un nombre de couverts qu'elle ne peut pas asseoir (v7.8.1) : elle est
     retirée de la demande, et dit. Ce n'était qu'un souhait : le restaurant place la réservation. */
  let tableRetiree = '';
  function verifierTable(c) {
    const el = form.querySelector('[name="table"]'), t = el?.value, places = t ? +(o.tables || R.tables || {})[t] || 0 : 0;
    if (t && places && c > places) { el.value = ''; tableRetiree = `La table ${t} (${places} place${places > 1 ? 's' : ''}) ne convient pas pour ${c} personnes : elle n'est plus demandée, le restaurant vous placera.`; }
    else if (t) tableRetiree = '';
    const dit = root.querySelector('[data-resa-table-choisie]');
    if (dit && !el?.value) { dit.textContent = tableRetiree; dit.hidden = !tableRetiree; if (tableRetiree) dit.setAttribute('role', 'status'); }
  }
  function majCouverts(n) {
    const c = Math.max(1, Math.min(maxi, n)); couvEl.value = c;
    form.querySelector('[data-moins]').disabled = c <= 1; form.querySelector('[data-plus]').disabled = c >= maxi;
    if (groupe) groupe.hidden = c < maxi;
    rendreTable(c); verifierTable(c);
  }

  // ---------- 2 · L'heure : une frise, la ligne d'or file jusqu'à l'heure choisie ----------
  const zone = root.querySelector('[data-resa-creneaux]'), aideCr = root.querySelector('[data-resa-creneaux-aide]');
  let heurePerdue = '';
  function majFrise(defiler) {
    const frise = zone.querySelector('.resa__frise'); if (!frise) return;
    const labels = [...frise.querySelectorAll('.resa__creneau')], k = labels.findIndex((l) => l.querySelector('input:checked'));
    frise.style.setProperty('--k', Math.max(0, k)); frise.classList.toggle('est-choisie', k >= 0);
    labels.forEach((l, i) => l.classList.toggle('est-passe', k >= 0 && i < k));
    const piste = frise.querySelector('.resa__frise-piste');
    if (defiler && k >= 0 && piste.scrollWidth > piste.clientWidth + 2) { const l = labels[k]; piste.scrollTo({ left: l.offsetLeft - (piste.clientWidth - l.offsetWidth) / 2, behavior: doux() }); }
  }
  function rendreCreneaux() {
    const v = val(), focus = document.activeElement?.name === 'heure' ? document.activeElement.value : null;
    const liste = v.date && v.service ? creneaux(v.date, v.service, v.couverts) : [];
    const garde = liste.find((x) => x.t === v.heure && x.etat === 'libre') ? v.heure : '';
    if (v.heure && !garde && liste.some((x) => x.t === v.heure)) heurePerdue = v.heure;
    else if (garde || !v.heure) heurePerdue = garde ? '' : heurePerdue;
    zone.innerHTML = liste.length ? `<div class="resa__frise" style="--n:${liste.length}"><div class="resa__frise-piste"><div class="resa__frise-rail"><span class="resa__frise-ligne" aria-hidden="true"><span class="resa__frise-or"></span></span>`
      + liste.map((x) => `<label class="resa__creneau${x.etat === 'complet' ? ' est-complet' : ''}${x.t.endsWith(':00') ? ' est-pleine' : ''}"><input type="radio" name="heure" value="${x.t}" ${x.t === garde ? 'checked' : ''} ${x.etat === 'complet' ? 'disabled' : ''} required><i class="resa__point" aria-hidden="true"></i><span>${x.libelle}</span>${x.etat === 'complet' ? '<small>complet</small>' : ''}</label>`).join('')
      + '</div></div></div>' : '';
    const nLibres = liste.filter((x) => x.etat === 'libre').length;
    aideCr.textContent = !v.date ? 'Choisissez d\'abord une date.' : !v.service ? (services.some((sv) => ouvert(v.date, sv.id) && etatService(R, v.date, sv.id).prive) ? 'Ce jour-là, le restaurant accueille une réception. D\'autres possibilités sont proposées juste en dessous.' : services.some((sv) => complet(v.date, sv.id, v.couverts)) ? 'Ce jour-là est complet. D\'autres possibilités sont proposées juste en dessous.' : 'Ce jour-là, le restaurant est fermé ou complet : choisissez une autre date.') : !liste.length ? 'Plus de créneau pour ce service.' : !nLibres ? 'Ce service est complet : essayez l\'autre service ou un autre jour.'
      : heurePerdue && !garde ? `${heure(enMin(heurePerdue))} n'est plus libre pour ${v.couverts} personnes : choisissez une autre heure.` : `${nLibres} créneau${nLibres > 1 ? 'x' : ''} disponible${nLibres > 1 ? 's' : ''}${v.couverts >= 6 ? ` pour ${v.couverts} personnes` : ''}.`;
    majFrise(true);
    if (focus) (zone.querySelector(`input[value="${focus}"]:not(:disabled)`) || zone.querySelector('input:not(:disabled)'))?.focus({ preventScroll: true });
    rendreAlternatives();
  }

  /* ---------- v7.11.0 · Quand le choix n'est pas possible : d'autres possibilités, et la liste d'attente ----------
     Chaque proposition dit ce qui change ; tout le reste de la saisie est gardé. La liste d'attente n'est pas une
     réservation : elle le dit. Démonstration : l'inscription arrive dans l'espace de ce navigateur ; rien n'est envoyé.
     En mode connecté, la liste d'attente n'est pas proposée (le serveur ne la connaît pas encore). */
  /* La typographie française de ce que cette zone écrit : une espace insécable devant : ; ! ? */
  const fr = (h) => h.replace(/ ([:;!?])(?=[ <]|$)/g, '\u00a0$1');
  const zoneAlt = document.createElement('div'); zoneAlt.className = 'resa__alt'; zoneAlt.dataset.resaAlt = ''; zoneAlt.hidden = true; aideCr.after(zoneAlt);
  const connecte = !!document.querySelector('meta[name="jh-api"]');
  let alt = [], attente = null, attenteFaite = null;
  function souhaitImpossible() {
    const v = val(); if (!v.date) return null;
    /* Une heure précise qui n'est plus libre, dans un service encore ouvert. */
    if (v.service && heurePerdue && !v.heure && !complet(v.date, v.service)) return { date: v.date, service: v.service, heure: heurePerdue, espace: v.espace, complet: true, quoi: `${heure(enMin(heurePerdue))} n'est plus libre` };
    /* Un service complet ce jour-là : celui qu'on venait voir (adresse de la page), sinon le premier complet. */
    const voulu = [params.get('service'), 'soir', 'midi'].filter(Boolean), sid = voulu.find((x) => services.some((sv) => sv.id === x) && complet(v.date, x)) || services.find((sv) => complet(v.date, sv.id))?.id;
    if (sid && (!v.service || !libres(v.date, v.service, v.couverts))) return { date: v.date, service: sid, heure: '', espace: v.espace, complet: true, quoi: `le ${services.find((x) => x.id === sid).libelle.toLowerCase()} du ${dateLongue(v.date, { weekday: 'long', day: 'numeric', month: 'long' })} est complet` };
    return null;
  }
  function rendreAlternatives() {
    const s = souhaitImpossible();
    if (attenteFaite) { zoneAlt.hidden = false; zoneAlt.innerHTML = fr(`<p class="resa__alt-fait" role="status" tabindex="-1" data-resa-alt-fait><b>Vous êtes sur la liste d'attente</b> pour le ${echap(dateLongue(attenteFaite.date, { weekday: 'long', day: 'numeric', month: 'long' }))}, ${attenteFaite.periode === 'midi' ? 'le midi' : 'le soir'}, ${attenteFaite.couverts} personne${attenteFaite.couverts > 1 ? 's' : ''}. Ce n'est pas une réservation : aucune table n'est retenue. Si une place se libère, le restaurant vous prévient et vous laisse un délai pour répondre.</p><p class="resa__simule">Démonstration : rien n'a été envoyé. L'inscription est visible dans l'espace du restaurant, sur cet appareil.</p>`); return; }
    if (!s) { zoneAlt.hidden = true; zoneAlt.innerHTML = ''; alt = []; attente = null; return; }
    /* Le formulaire de liste d'attente est ouvert pour ce même souhait : on ne le redessine pas (la saisie est gardée). */
    const cle = `${s.date}|${s.service}|${s.heure}|${val().couverts}`;
    if (attente && zoneAlt.dataset.cle === cle && zoneAlt.querySelector('[data-resa-attente-form]')) return;
    zoneAlt.dataset.cle = cle;
    alt = alternatives(R, s, { auj, horizon, creneaux: (iso, sid) => creneaux(iso, sid, val().couverts), jour: (iso) => dateLongue(iso, { weekday: 'long', day: 'numeric', month: 'long' }) });
    const v = val();
    /* Là où se trouve le client : sous les services si le service est complet (étape « quand »), sous les heures si c'est une heure qui manque. */
    const ancre = s.heure ? aideCr : form.querySelector('[data-champ="service"]') || aideCr; if (zoneAlt.previousElementSibling !== ancre) ancre.after(zoneAlt);
    zoneAlt.hidden = false;
    zoneAlt.innerHTML = fr(`<p class="resa__alt-titre" id="resa-alt-titre">${echap(maj(s.quoi))}. Voici ce que nous pouvons vous proposer&nbsp;:</p>
      <ul class="resa__alt-liste" aria-labelledby="resa-alt-titre">${alt.map((a, i) => `<li><button type="button" class="resa__alt-choix" data-resa-alt-choix="${i}"><b>${echap(maj(a.titre))}</b><small>Ce qui change&nbsp;: ${echap(a.change)}.</small></button></li>`).join('')}
        ${s.complet && !connecte ? `<li><button type="button" class="resa__alt-choix resa__alt-choix--attente" data-resa-attente aria-expanded="${!!attente}"><b>M'inscrire sur la liste d'attente</b><small>Ce qui change&nbsp;: ce n'est pas une réservation. Vous êtes prévenu si une place se libère.</small></button></li>` : ''}</ul>
      ${alt.length || (s.complet && !connecte) ? '' : `<p class="resa__alt-rien">Aucune autre possibilité en ligne pour ces jours-là : appelez-nous${R.telephone ? ` au ${echap(R.telephone)}` : ''}.</p>`}
      ${attente ? `<div class="resa__attente" data-resa-attente-form role="group" aria-labelledby="resa-att-titre"><p class="resa__alt-titre" id="resa-att-titre">Liste d'attente : ${echap(dateLongue(s.date, { weekday: 'long', day: 'numeric', month: 'long' }))}, ${s.service === 'midi' ? 'le midi' : 'le soir'}, ${v.couverts} personne${v.couverts > 1 ? 's' : ''}</p>
        <p class="resa__attente-champ"><label for="att-heure">Heure souhaitée</label><select id="att-heure" data-att="heure">${arrivees(R, s.date, s.service).map((t) => `<option value="${t}"${t === (s.heure || attente.heure) ? ' selected' : ''}>${heure(enMin(t))}</option>`).join('')}</select></p>
        <p class="resa__attente-champ"><label for="att-souplesse">Votre souplesse</label><select id="att-souplesse" data-att="souplesse"><option value="0">À cette heure précise</option><option value="30" selected>À une demi-heure près</option><option value="60">À une heure près</option><option value="999">Tout le service me convient</option></select></p>
        <fieldset class="resa__attente-champ resa__attente-espaces"><legend>Où accepteriez-vous d'être installés&nbsp;?</legend>${espaces.filter((x) => espaceOk(x, s.date)).map((x) => `<label><input type="checkbox" data-att="espace" value="${echap(x.id)}" checked> ${echap(x.libelle)}</label>`).join('')}</fieldset>
        <p class="resa__attente-champ"><label for="att-prenom">Prénom</label><input id="att-prenom" data-att="prenom" autocomplete="given-name" value="${echap(v.prenom)}"></p>
        <p class="resa__attente-champ"><label for="att-nom">Nom</label><input id="att-nom" data-att="nom" autocomplete="family-name" value="${echap(v.nom)}"></p>
        <p class="resa__attente-champ"><label for="att-tel">Téléphone</label><input id="att-tel" data-att="telephone" type="tel" autocomplete="tel" inputmode="tel" value="${echap(v.telephone)}"></p>
        <p class="resa__attente-champ"><label for="att-mail">Adresse e-mail <small>à défaut de téléphone</small></label><input id="att-mail" data-att="email" type="email" autocomplete="email" value="${echap(v.email)}"></p>
        <p class="resa__attente-erreur" role="alert" data-att-erreur hidden></p>
        <p class="resa__attente-actions"><button type="button" class="bouton" data-resa-attente-envoyer>M'inscrire sur la liste d'attente</button><button type="button" class="bouton bouton--contour" data-resa-attente-fermer>Non merci</button></p>
        <p class="resa__alt-note">Une inscription n'est pas une réservation. Vos coordonnées servent seulement à vous prévenir.</p></div>` : ''}
      <p class="resa__alt-note">Ce que vous avez déjà saisi est gardé.</p>`);
  }
  const espaces = R.espaces || [];
  /* Les champs de la liste d'attente ne font pas partie de la demande de table : leurs saisies ne relancent pas le formulaire. */
  for (const t of ['input', 'change']) zoneAlt.addEventListener(t, (e) => e.stopPropagation());
  zoneAlt.addEventListener('click', (e) => {
    const c = e.target.closest('[data-resa-alt-choix]');
    if (c) { const a = alt[+c.dataset.resaAltChoix]; if (!a) return;
      heurePerdue = ''; attente = null;
      if (a.date !== dateEl.value) { dateEl.value = a.date; erreur(dateEl, ''); tout('date'); }
      const sv = form.querySelector(`input[name="service"][value="${a.service}"]`); if (sv && !sv.disabled && !sv.checked) { sv.checked = true; tout('service'); }
      if (a.espace) { poser('espace', a.espace); tout('autre'); }
      if (a.heure) { poser('heure', a.heure); tout('heure'); majFrise(true); }
      if (multi && a.heure) allerEtape(2, { focus: false });
      aideCr.textContent = `C'est noté : ${a.titre.charAt(0).toLowerCase() + a.titre.slice(1)}. Le reste de votre saisie est gardé.`;
      (form.querySelector('input[name="heure"]:checked') || form.querySelector('input[name="heure"]:not(:disabled)') || aideCr).focus?.({ preventScroll: true }); return; }
    if (e.target.closest('[data-resa-attente]')) { const s = souhaitImpossible(); attente = attente ? null : { heure: s?.heure || arrivees(R, s.date, s.service)[Math.floor(arrivees(R, s.date, s.service).length / 2)] }; rendreAlternatives(); (attente ? zoneAlt.querySelector('#att-heure') : zoneAlt.querySelector('[data-resa-attente]'))?.focus({ preventScroll: true }); return; }
    if (e.target.closest('[data-resa-attente-fermer]')) { attente = null; rendreAlternatives(); zoneAlt.querySelector('[data-resa-attente]')?.focus({ preventScroll: true }); return; }
    const env = e.target.closest('[data-resa-attente-envoyer]');
    if (env) { const s = souhaitImpossible(), q = (k) => zoneAlt.querySelector(`[data-att="${k}"]`), err = zoneAlt.querySelector('[data-att-erreur]'), dire = (m, el) => { err.textContent = m; err.hidden = false; el?.focus(); };
      if (!s) return; if (env.disabled) return;
      const nom = q('nom').value.trim(), prenom = q('prenom').value.trim(), telephone = q('telephone').value.trim(), email = q('email').value.trim();
      if (!nom && !prenom) return dire('Indiquez votre nom, pour que le restaurant sache qui prévenir.', q('prenom'));
      if (telephone.replace(/\D/g, '').length < 9 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return dire('Indiquez un téléphone ou une adresse e-mail : sans cela, le restaurant ne peut pas vous prévenir.', q('telephone'));
      const fiche = { genre: 'attente', date: s.date, periode: s.service, heure: q('heure').value, souplesse: +q('souplesse').value, espaces: [...zoneAlt.querySelectorAll('[data-att="espace"]:checked')].map((x) => x.value), couverts: val().couverts, prenom, nom, telephone, email, message: val().message };
      env.disabled = true; /* un double clic n'inscrit qu'une fois */
      if (ajouterDemandeSite(fiche) === false) { env.disabled = false; return dire(refusEnregistrement() || 'Votre inscription n\'a pas pu être enregistrée. Votre saisie est gardée : réessayez, ou appelez-nous.', env); }
      attenteFaite = fiche; attente = null; rendreAlternatives(); zoneAlt.querySelector('[data-resa-alt-fait]')?.focus({ preventScroll: true });
      root.dispatchEvent(new CustomEvent('reservation:attente', { detail: fiche, bubbles: true })); }
  });

  // ---------- 3 · Où : la terrasse hors saison est désactivée, avec sa raison ; la table venue du plan ----------
  function majEspaces() {
    const v = val();
    for (const r of form.querySelectorAll('input[name="espace"]')) {
      const e = (R.espaces || []).find((x) => x.id === r.value) || {}, ok = espaceOk(e, v.date); r.disabled = !ok;
      const note = r.closest('label')?.querySelector('[data-note]'); if (note) note.textContent = ok ? (e.note || '') : !enSaison(e, v.date) ? (e.hors_saison || 'pas à cette date') : 'retenue pour une réception ce jour-là';
    }
    const coche = form.querySelector('input[name="espace"]:checked');
    if (!coche || coche.disabled) { const premier = form.querySelector('input[name="espace"]:not(:disabled)'); if (premier) premier.checked = true; }
    const t = root.querySelector('[data-resa-table-choisie]'); if (t) { t.textContent = v.table ? `Table ${v.table}, souhaitée sur le plan.` : tableRetiree; t.hidden = !v.table && !tableRetiree; }
  }

  // ---------- Le carton de table ----------
  let etape = 'saisie', reference = '', envoi = null, avant = {};
  function texteDe(v) {
    const sv = services.find((x) => x.id === v.service), es = (R.espaces || []).find((x) => x.id === v.espace);
    return { date: v.date ? maj(dateLongue(v.date)) : '', service: sv ? (sv.id === 'midi' ? 'Déjeuner' : sv.id === 'soir' ? 'Dîner' : sv.libelle) : '', heure: v.heure ? heure(enMin(v.heure)) : '', couverts: `${v.couverts} couvert${v.couverts > 1 ? 's' : ''}`,
      espace: es ? es.libelle + (v.table ? ` · table ${v.table}` : '') : (v.table ? `Table ${v.table}` : ''), demande: [...v.demandes, v.message].filter(Boolean).join(' · '), contact: [[v.prenom, v.nom].filter(Boolean).join(' '), v.telephone].filter(Boolean).join(' · ') };
  }
  function rendreRecap() {
    const v = etape === 'envoye' && envoi ? envoi : val(), t = texteDe(v), verif = etape === 'verification', fini = etape === 'envoye';
    const neuf = (k) => !fini && t[k] && avant[k] !== undefined && avant[k] !== t[k] && !['contact', 'demande'].includes(k);
    const ligne = (k, lib, contenu) => `<li class="carton__ligne carton__ligne--${k}${t[k] ? '' : ' est-vide'}${neuf(k) ? ' est-neuf' : ''}">`
      + `<button type="button" class="carton__modifier" data-resa-modifier="${k}"${fini ? ' disabled' : ''}><span class="carton__lib">${lib}</span><span class="carton__val">${t[k] ? contenu : '<span class="carton__blanc">à compléter</span>'}</span>`
      + `${fini ? '' : `<span class="carton__crayon">${ICO.crayon}<span class="resa__sr">Modifier ${QUOI[k] || ''}</span></span>`}</button></li>`;
    const assiettes = `<span class="carton__assiettes" aria-hidden="true">${'<i></i>'.repeat(v.couverts)}</span>${echap(t.couverts)}`;
    /* Une demande reçue n'est pas une réservation confirmée : c'est le restaurant qui confirme (v7.8.1). */
    const sur = fini ? 'Votre demande est envoyée' : verif ? 'Tout est juste ?' : 'Votre réservation';
    recap.innerHTML = `<div class="resa__recap-corps carton${verif ? ' est-verif' : ''}${fini ? ' est-envoye' : ''}" tabindex="-1" data-resa-focus>`
      + `<p class="carton__maison" aria-hidden="true">Les Jardins de l'Hacienda</p><h3 class="resa__recap-sur carton__sur">${sur}</h3>`
      + `<ul class="carton__lignes">`
      + ligne('date', 'Le', `<span class="carton__date">${echap(t.date)}</span>${t.service ? `<span class="carton__service">${echap(t.service)}</span>` : ''}`)
      + ligne('heure', 'À', `<span class="carton__tampon">${echap(t.heure)}</span>`)
      + ligne('couverts', 'Pour', assiettes)
      + ligne('espace', 'Installés', echap(t.espace))
      + (t.demande ? ligne('demande', 'Une demande', echap(t.demande)) : '')
      + ligne('contact', 'Au nom de', echap(t.contact))
      + '</ul>'
      + (verif ? '<p class="carton__statut">Après l\'envoi\u00a0: <b>demande reçue</b>. Elle devient une réservation quand le restaurant la confirme.</p><button type="button" class="resa__bouton carton__confirmer" data-resa-confirmer>Envoyer ma demande</button><p class="resa__simule">Envoi simulé : rien ne part vers le restaurant dans cette démonstration.</p>' : '')
      + (fini ? `<p class="carton__reserve" aria-hidden="true" data-superpose><span>Demande reçue</span></p><p class="carton__ref">Référence <b>${reference}</b></p><p class="carton__suite">Statut\u00a0: <b>demande reçue</b>, en attente de confirmation. Le restaurant vous confirme votre table par message.</p>${connecte ? '' : `<p class="carton__venue"><a href="${echap(avecContexte(`/votre-venue?r=${encodeURIComponent(reference)}&c=${codeVenue(reference, v.telephone)}`))}">Suivre, modifier ou annuler ma demande</a></p>`}<p class="resa__simule">${echap(R.message_simule || 'Réservation simulée : rien n\'a été envoyé. Sur le site final, la demande part vers le restaurant, qui la confirme par message.')}</p>`
        + '<button type="button" class="resa__bouton resa__bouton--ligne" data-resa-nouvelle>Faire une autre réservation</button>' : '')
      + '</div>';
    avant = t;
  }
  // Ce que « Modifier » rejoint, dans l'ordre de préférence (le choix fait, sinon le premier possible).
  const CIBLES = { date: ['[data-jour][aria-pressed="true"]', '[data-resa-plus-tard][aria-pressed="true"]', '[data-jour]:not(:disabled)', 'input[name="date"]'], service: ['input[name="service"]:checked', 'input[name="service"]:not(:disabled)'],
    heure: ['input[name="heure"]:checked', 'input[name="heure"]:not(:disabled)', '[data-resa-creneaux-aide]'], couverts: ['input[name="couverts"]'], espace: ['input[name="espace"]:checked'],
    demande: ['textarea[name="message"]'], contact: ['input[name="prenom"]'] };
  function modifier(k) {
    etape = 'saisie'; root.classList.remove('est-verification'); rendreRecap();
    if (k === 'demande') { const d = root.querySelector('.resa__plus'); if (d) d.open = true; }
    allerEtape(ETAPE_DE[k] || 1, { focus: false });
    const el = (CIBLES[k] || ['input']).map((c) => root.querySelector(c)).find(Boolean);
    if (el) { if (el.matches('[data-resa-creneaux-aide]')) el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); }
    amener();
  }

  // Montre le carton en entier sous l'en-tête (collé, il peut être repoussé sous l'en-tête en bas du formulaire).
  function montrer() {
    const eh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--entete-h')) || 0, r = recap.getBoundingClientRect(), marge = 16;
    const dy = r.top < eh + marge ? r.top - eh - marge : r.bottom > innerHeight - marge ? Math.min(r.bottom - innerHeight + marge, r.top - eh - marge) : 0;
    if (dy) { if (s.lenis) s.lenis.scrollTo(scrollY + dy, { immediate: s.calme }); else scrollBy({ top: dy, behavior: doux() }); }
  }

  // ---------- Les étapes ----------
  const etapes = [...form.querySelectorAll('[data-etape]')], nb = etapes.length, multi = nb > 1;
  const prog = root.querySelector('[data-resa-progression]'), btnRetour = $('[data-etape-retour]'), btnSuite = $('[data-etape-suivante]'), btnEnvoi = $('button[type="submit"]');
  let pas = 1;
  // Ramène le haut du formulaire (la frise des étapes) à l'écran quand il est passé au-dessus.
  function amener() {
    const cible = prog && !prog.hidden ? prog : form, eh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--entete-h')) || 0, r = cible.getBoundingClientRect();
    if (r.top < eh + 8 || r.top > innerHeight * .6) { const y = scrollY + r.top - eh - 16; if (s.lenis) s.lenis.scrollTo(y, { immediate: s.calme }); else scrollTo({ top: y, behavior: doux() }); }
  }
  function allerEtape(n, { focus = true } = {}) {
    if (!multi) return;
    n = Math.max(1, Math.min(nb, n)); const avantPas = pas; pas = n; root.dataset.etape = n;
    for (const e of etapes) {
      const on = +e.dataset.etape === n; e.hidden = !on;
      e.classList.remove('est-entre', 'est-retour');
      if (on && n !== avantPas && !s.calme) { void e.offsetWidth; e.classList.add('est-entre'); if (n < avantPas) e.classList.add('est-retour'); }
    }
    if (prog) {
      prog.hidden = false; prog.style.setProperty('--avance', (n - 1) / (nb - 1));
      for (const b of prog.querySelectorAll('[data-aller-etape]')) { const k = +b.dataset.allerEtape, li = b.closest('li'); li.classList.toggle('est-fait', k < n); li.classList.toggle('est-courant', k === n); if (k === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); }
    }
    if (btnRetour) btnRetour.hidden = n === 1;
    if (btnSuite) { btnSuite.hidden = n === nb; btnSuite.textContent = n === nb - 1 ? 'Dernière étape' : 'Continuer'; }
    if (btnEnvoi) btnEnvoi.hidden = n !== nb;
    if (n === 2) majFrise(true);
    if (focus) {
      const e = etapes[n - 1], f = n === 1 ? e.querySelector('[data-jour][aria-pressed="true"], [data-resa-plus-tard][aria-pressed="true"], [data-jour]:not(:disabled)') : n === 2 ? e.querySelector('[data-plus], [data-moins]') : n === 3 ? e.querySelector('input[name="espace"]:checked') : e.querySelector('input[name="prenom"]');
      (f || e.querySelector('input, button'))?.focus({ preventScroll: true }); amener();
    }
  }

  // ---------- Vérification ----------
  function erreur(el, msg) {
    if (!el) return;
    const bloc = el.closest('fieldset, .resa__champ'), id = 'erreur-' + (el.name || el.id);
    let p = root.querySelector('#' + CSS.escape(id));
    if (!msg) { p?.remove(); el.removeAttribute('aria-invalid'); bloc?.classList.remove('est-erreur'); return; }
    if (!p) { p = document.createElement('p'); p.id = id; p.className = 'resa__erreur'; (bloc || el.parentElement).appendChild(p); }
    p.textContent = msg; el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', [...new Set([...(el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean), id])].join(' ')); bloc?.classList.add('est-erreur');
  }
  /** Les contrôles, avec l'étape de chacun : [étape, champ, message ou ''] */
  function controles() {
    const v = val();
    const date = !v.date ? 'Choisissez une date.' : v.date < auj || v.date > fin ? `Choisissez une date entre aujourd'hui et le ${dateLongue(fin, { day: 'numeric', month: 'long' })}.` : !reservable(v.date, v.couverts) ? 'Ce jour-là, le restaurant est fermé ou complet.' : '';
    const hEl = form.querySelector('input[name="heure"]:not(:disabled)') || form.querySelector('input[name="heure"]') || (aideCr.setAttribute('tabindex', '-1'), aideCr);
    const h = date ? '' : !v.heure ? (heurePerdue ? `${heure(enMin(heurePerdue))} n'est plus libre pour ${v.couverts} personnes : choisissez une autre heure.` : 'Choisissez une heure d\'arrivée.') : estComplet(v.date, v.heure, v.couverts) ? 'Ce créneau vient d\'être pris : choisissez-en un autre.' : '';
    return [[1, dateEl, date], [2, hEl, h],
      [4, champ('prenom'), v.prenom ? '' : 'Indiquez votre prénom.'], [4, champ('nom'), v.nom ? '' : 'Indiquez votre nom.'],
      [4, champ('telephone'), !v.telephone ? 'Indiquez un téléphone pour vous joindre le jour même.' : v.telephone.replace(/[^\d]/g, '').length < 9 ? 'Numéro à vérifier (10 chiffres).' : ''],
      [4, champ('email'), v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email) ? 'Adresse e-mail à vérifier (exemple : nom@domaine.fr).' : '']];
  }
  /** Vérifie les étapes jusqu'à `jusqua` (toutes par défaut) ; au premier problème, ouvre son étape et y met le focus. */
  function verifier(jusqua = nb) {
    let premier = null, ou = 0;
    for (const [n, el, m] of controles()) { if (multi && n > jusqua) continue; erreur(el, m); if (m && !premier) { premier = el; ou = n; } }
    if (premier) {
      if (multi && ou !== pas) allerEtape(ou, { focus: false });
      const cible = premier === dateEl && jours && !jours.hidden ? (jours.querySelector('[aria-pressed="true"]:not(:disabled), [data-jour]:not(:disabled)') || premier) : premier;
      if (multi) amener(); else premier.closest('fieldset, .resa__champ')?.scrollIntoView({ behavior: doux(), block: 'center' });
      cible.focus({ preventScroll: true });
    }
    return !premier;
  }
  function suivante() { if (verifier(pas)) allerEtape(pas + 1); }

  // ---------- Brouillon et adresse ----------
  /* v7.14.1 : le brouillon appartient à son contexte. Hors démonstration, la clé historique de l'onglet
     (`resa-brouillon:` + la page) ; dans un scénario, une clé à son nom. Un brouillon normal n'est jamais repris ni
     effacé par une démonstration ; un brouillon d'une démonstration recommencée depuis n'est pas relu. */
  const brouillonGarde = temporaire('resa-brouillon:' + location.pathname, { session: true });
  const GARDES = ['date', 'service', 'heure', 'couverts', 'espace', 'table', 'message', 'prenom', 'nom', 'telephone', 'email'];
  function poser(n, v) {
    const els = form.querySelectorAll(`[name="${n}"]`);
    if (!els.length) return;
    if (els[0].type === 'radio' || els[0].type === 'checkbox') els.forEach((e) => { e.checked = Array.isArray(v) ? v.includes(e.value) : e.value === v; });
    else els[0].value = v;
  }
  function sauver() { const v = val(); rappelSoiree(v); brouillonGarde.ecrire({ ...Object.fromEntries(GARDES.map((k) => [k, v[k]])), demandes: v.demandes }); }
  const params = new URLSearchParams(location.search);
  /* v7.13.0 : la réservation garde le lien avec la soirée d'où elle vient (« ?soiree=… »), tant que le jour et le service
     restent ceux de la soirée. Elle garde aussi le titre et le prix affichés à ce moment-là. Le lien n'ouvre aucune
     place : la demande passe par les mêmes règles de disponibilité que les autres. */
  const soireeDe = (v) => { const id = params.get('soiree'); if (!id || !v) return null;
    let L = []; try { L = JSON.parse(document.querySelector('script[data-agenda]')?.textContent || '[]'); } catch { L = []; }
    const x = L.find((d) => d.id === id); return x && String(x.d).slice(0, 10) === v.date && (!x.s || x.s === v.service) ? { id: x.id, titre: x.t || '', prix: x.p || '' } : null; };
  const rappelSoiree = (v) => { const el = document.querySelector('[data-soiree]'); if (el && params.get('soiree') && el.textContent) el.hidden = !soireeDe(v); };
  const depuisAdresse = ['date', 'service', 'heure', 'couverts', 'espace', 'demande', 'table'].some((k) => params.has(k));
  let brouillon = depuisAdresse ? null : brouillonGarde.lire(); if (!brouillon || typeof brouillon !== 'object' || Array.isArray(brouillon)) brouillon = null;
  const depart = brouillon || {};
  if (depuisAdresse) { for (const k of ['date', 'service', 'heure', 'couverts', 'espace', 'table']) if (params.has(k)) depart[k] = params.get(k); if (params.has('demande')) depart.demandes = params.get('demande').split(','); }
  // Table choisie sur un plan de salle (module plan-de-salle, ?table=…) : champ caché, montrée avec l'installation, envoyée avec la demande.
  if (depart.table) { depart.table = String(depart.table).slice(0, 24); if (!form.querySelector('[name="table"]')) { const h = document.createElement('input'); h.type = 'hidden'; h.name = 'table'; form.append(h); } }
  // Le brouillon ou l'adresse peut être ancien : on le revalide (date passée, heure plus possible).
  if (depart.date && (depart.date < auj || depart.date > fin)) delete depart.date;
  for (const k of GARDES) if (depart[k] !== undefined && k !== 'heure') poser(k, String(depart[k]));
  if (depart.demandes) poser('demande', depart.demandes);
  if (!dateEl.value) dateEl.value = Array.from({ length: horizon }, (_, k) => ajouter(auj, k)).find((iso) => reservable(iso)) || auj;

  // ---------- Câblage ----------
  function tout(depuis) {
    if (depuis !== 'heure') { majServices(); majEspaces(); rendreCreneaux(); }
    if (depuis === 'date' || depuis === 'couverts' || depuis === 'debut') { rendreJours(); if (calOuvert) rendreCal(); }
    if (depuis === 'service') rendreTable(+couvEl.value || 2);
    if (depuis === 'heure') majFrise(false);
    if (etape !== 'saisie') { etape = 'saisie'; root.classList.remove('est-verification'); }
    rendreRecap(); sauver();
  }
  majCouverts(+couvEl.value || 2); tout('debut');
  if (depart.heure) { poser('heure', depart.heure); majFrise(true); rendreRecap(); }
  if (multi) {
    form.classList.add('est-etapes');
    // Arrivée avec le jour et le service (accueil, agenda) : on commence aux couverts ; avec l'heure aussi, à l'installation.
    const v = val(), ok1 = depuisAdresse && params.has('date') && !controles()[0][2] && v.service;
    allerEtape(ok1 ? (params.has('heure') && v.heure ? 3 : 2) : 1, { focus: false });
  }

  form.addEventListener('change', (e) => {
    const n = e.target.name;
    if (n === 'couverts') majCouverts(parseInt(couvEl.value, 10) || 1);
    if (e.target.getAttribute('aria-invalid')) erreur(e.target, '');
    if (n === 'heure') { const h = form.querySelector('input[name="heure"]'); if (h) erreur(h, ''); heurePerdue = ''; }
    if (n === 'date' || n === 'couverts') { attenteFaite = null; attente = null; }
    tout(n === 'date' || n === 'couverts' ? n : n === 'heure' ? 'heure' : n === 'service' ? 'service' : 'autre');
  });
  form.addEventListener('input', (e) => { if (e.target.matches('textarea, input[type="text"], input[type="tel"], input[type="email"]')) { if (e.target.getAttribute('aria-invalid')) erreur(e.target, ''); rendreRecap(); sauver(); } });
  form.addEventListener('click', (e) => {
    const j = e.target.closest('[data-jour], [data-cal-jour]');
    if (j && !j.disabled) {
      const iso = j.dataset.jour || j.dataset.calJour; dateEl.value = iso; erreur(dateEl, ''); attenteFaite = null; attente = null;
      if (j.dataset.calJour) ouvrirCal(false);
      tout('date'); (form.querySelector(`[data-jour="${iso}"]`) || form.querySelector('[data-resa-plus-tard]'))?.focus({ preventScroll: true }); return;
    }
    const pt = e.target.closest('[data-resa-plus-tard]'); if (pt) { ouvrirCal(!calOuvert); return; }
    const cm = e.target.closest('[data-cal-mois]');
    if (cm && !cm.disabled) { const [a, m] = calMois.split('-').map(Number), d = new Date(Date.UTC(a, m - 1 + +cm.dataset.calMois, 1)); calMois = d.toISOString().slice(0, 7); rendreCal(); (cal.querySelector(`[data-cal-mois="${cm.dataset.calMois}"]:not(:disabled)`) || cal.querySelector('.resa__cal-j:not(:disabled)'))?.focus(); return; }
    if (e.target.closest('[data-moins]')) { majCouverts((+couvEl.value || 1) - 1); tout('couverts'); }
    if (e.target.closest('[data-plus]')) { majCouverts((+couvEl.value || 1) + 1); tout('couverts'); }
    if (e.target.closest('[data-etape-suivante]')) suivante();
    if (e.target.closest('[data-etape-retour]')) allerEtape(pas - 1);
  });
  cal?.addEventListener('keydown', (e) => { if (e.key === 'Escape') { ouvrirCal(false); form.querySelector('[data-resa-plus-tard]')?.focus(); } });
  // La frise des étapes : on revient en arrière librement ; en avant, seulement si les étapes d'avant sont justes.
  prog?.addEventListener('click', (e) => {
    const b = e.target.closest('[data-aller-etape]'); if (!b || etape === 'envoye') return;
    const k = +b.dataset.allerEtape; if (k <= pas) { allerEtape(k); return; }
    if (verifier(k - 1)) allerEtape(k);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (multi && pas < nb) { suivante(); return; } // Entrée dans un champ avant la dernière étape : on avance.
    if (!verifier()) return;
    etape = 'verification'; root.classList.add('est-verification'); rendreRecap();
    recap.querySelector('[data-resa-focus]')?.focus({ preventScroll: true }); montrer();
  });
  recap.addEventListener('click', async (e) => {
    const m = e.target.closest('[data-resa-modifier]'); if (m && !m.disabled) { modifier(m.dataset.resaModifier); return; }
    if (e.target.closest('[data-resa-confirmer]')) {
      if (!verifier()) { etape = 'saisie'; root.classList.remove('est-verification'); rendreRecap(); return; }
      const b = e.target.closest('[data-resa-confirmer]'), v = val();
      /* Dernière vérification, au moment de s'engager (v7.8.1) : la page a pu rester ouverte (l'heure choisie est passée,
         le délai n'est plus tenu, le jour a changé) ou le restaurant a pu fermer ou dire complet entre-temps. */
      jourCourant(); const mnt = maintenant(fuseau), possible = faisabilite(R, { date: v.date, service: v.service, heure: v.heure, couverts: v.couverts }, { auj: mnt.iso, minute: mnt.min, public: true });
      if (!possible.ok || estComplet(v.date, v.heure, v.couverts, v.service)) {
        etape = 'saisie'; root.classList.remove('est-verification'); rendreJours(); majServices(); rendreCreneaux(); rendreRecap();
        const ou = possible.raison === 'heure' || possible.raison === 'passee' || possible.ok ? 2 : 1; if (multi) allerEtape(ou, { focus: false });
        const cible = ou === 2 ? (form.querySelector('input[name="heure"]:not(:disabled)') || aideCr) : dateEl;
        erreur(cible, possible.ok ? 'Ce créneau vient d\'être pris : choisissez une autre heure.' : `${possible.message} Votre demande n'est pas partie : choisissez ${ou === 2 ? 'une autre heure' : 'un autre jour'}.`); cible.focus?.({ preventScroll: true }); montrer();
        return;
      }
      b.disabled = true; b.textContent = 'Envoi…';
      /* Aucune réussite avant un enregistrement réussi : la référence n'existe qu'une fois la demande enregistrée. */
      const echec = (m) => { b.disabled = false; b.textContent = 'Envoyer ma demande'; erreur(b, m); };
      /* v7.14.1 : la démonstration a été recommencée dans un autre onglet : cette page date d'avant, elle n'envoie rien. */
      /* v7.15.0 : de même si le contexte de l'onglet est indéterminable : rien n'est envoyé ni enregistré, la saisie reste. */
      { const refus = refusEnregistrement(); if (refus) { echec(refus); return; } }
      let ref = '';
      try { ref = (o.envoyer ? (await o.envoyer(v))?.reference : `R-${v.date.slice(5).replace('-', '')}-${String(1000 + Math.floor(Math.random() * 9000))}`) || ''; }
      catch (err) { echec(err?.pourClient || 'L\'envoi n\'a pas abouti. Votre saisie est gardée : réessayez, ou appelez-nous.'); return; }
      if (!ref) { echec('Le restaurant n\'a pas confirmé la réception. Votre saisie est gardée : réessayez, ou appelez-nous.'); return; }
      // Démonstration (v7.6.0) : la demande arrive dans l'agenda de l'espace restaurateur de ce navigateur (par le stockage, v7.7.0).
      const liee = soireeDe(v);
      const enregistre = o.enregistrer ? o.enregistrer({ id: ref, ...v, cree: new Date().toISOString() }) : ajouterResaSite({ id: ref, ...v, ...(liee ? { soiree: liee } : {}), cree: new Date().toISOString() });
      if (enregistre === false) { echec('Votre demande n\'a pas pu être enregistrée. Votre saisie est gardée : réessayez, ou appelez-nous.'); return; }
      reference = ref; envoi = v; etape = 'envoye'; root.classList.remove('est-verification'); root.classList.add('est-envoye');
      for (const el of form.elements) el.disabled = true;
      prog?.querySelectorAll('button').forEach((x) => { x.disabled = true; });
      brouillonGarde.effacer();
      rendreRecap(); recap.querySelector('[data-resa-focus]')?.focus({ preventScroll: true }); montrer();
      root.dispatchEvent(new CustomEvent('reservation:envoyee', { detail: { ...v, reference }, bubbles: true }));
      return;
    }
    if (e.target.closest('[data-resa-nouvelle]')) {
      etape = 'saisie'; root.classList.remove('est-envoye'); for (const el of form.elements) el.disabled = false;
      prog?.querySelectorAll('button').forEach((x) => { x.disabled = false; });
      for (const n of ['heure', 'message', 'demande', 'table']) form.querySelectorAll(`[name="${n}"]`).forEach((x) => { if (x.type === 'checkbox' || x.type === 'radio') x.checked = false; else x.value = ''; });
      avant = {}; majCouverts(+couvEl.value || 2); tout('date'); allerEtape(1);
    }
  });

  // Une autre fenêtre a pu changer le brouillon : on le relit au retour sur l'onglet (sans écraser une saisie en cours).
  const retour = () => { if (!document.hidden && etape === 'saisie') { if (jourCourant() && dateEl.value < auj) { dateEl.value = Array.from({ length: horizon }, (_, k) => ajouter(auj, k)).find((iso) => reservable(iso)) || auj; calMois = ''; } rendreJours(); majServices(); rendreCreneaux(); rendreRecap(); } };
  /* Même sans quitter l'onglet : les heures devenues trop proches et le changement de jour sont suivis chaque minute. */
  const minuteur = setInterval(retour, 60000);
  document.addEventListener('visibilitychange', retour);
  return { etat: () => ({ etape, pas, ...val() }), allerEtape, detruire() { clearInterval(minuteur); document.removeEventListener('visibilitychange', retour); root.classList.remove('est-actif', 'est-calme', 'est-verification', 'est-envoye'); } };
}
