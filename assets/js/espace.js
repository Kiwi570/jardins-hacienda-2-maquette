/* L'espace restaurateur (démonstration, v7.6.0) : connexion fictive, puis cinq rubriques rendues ici.
   Aujourd'hui (le service du jour, ce qui attend une réponse, le prochain événement), Réservations (l'agenda de la
   semaine, confirmer, refuser, fermer un service, le dire complet, ajouter une réservation prise au téléphone),
   Événements (modifier, masquer, créer, avec la photothèque), Textes et horaires (annonce, horaires de la semaine,
   fermetures exceptionnelles, ardoise, textes du site), Photos (remplacer depuis la photothèque ou l'appareil, cadrer).
   Tout est enregistré dans ce navigateur (espace-stock.js) et visible sur le site (espace-apercu.js). Les réservations
   de démonstration sont tirées des vrais horaires ; celles faites sur la page Réserver arrivent en « à confirmer ». */
import { lire, changer, vider, resasSite, estVide } from './espace-stock.js?v=7';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const e = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const SEMAINE = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const enMin = (t) => { const [h, m] = String(t).split(':').map(Number); return h * 60 + (m || 0); };
const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const heure = (t) => { const m = enMin(t), h = Math.floor(m / 60) % 24, r = m % 60; return `${h} h${r ? ' ' + String(r).padStart(2, '0') : ''}`; };
const ajouter = (iso, n) => { const [a, m, j] = iso.split('-').map(Number); return new Date(Date.UTC(a, m - 1, j + n)).toISOString().slice(0, 10); };
const jourDe = (iso) => { const [a, m, j] = iso.split('-').map(Number); return new Date(Date.UTC(a, m - 1, j)).getUTCDay(); };
const fmt = (iso, o = { weekday: 'long', day: 'numeric', month: 'long' }) => { const [a, m, j] = iso.split('-').map(Number); return new Intl.DateTimeFormat('fr-FR', { ...o, timeZone: 'UTC' }).format(new Date(Date.UTC(a, m - 1, j))); };
const maj = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const hache = (t) => { let h = 2166136261; for (const c of t) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
/* Typographie française des messages : espace insécable devant : ; ! ? et dans les guillemets. */
const typo = (t) => String(t).replace(/ ([:;!?»])/g, '\u00a0$1').replace(/« /g, '«\u00a0');
const svDe = (creneau) => (enMin(creneau.split('-')[0]) < 17 * 60 ? 'midi' : 'soir');
function aujourdhui() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { iso: `${p.year}-${p.month}-${p.day}`, min: +p.hour * 60 + +p.minute };
}
const ICO = {
  midi: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.5M12 18.9v2.5M2.6 12h2.5M18.9 12h2.5M5.4 5.4l1.8 1.8M16.8 16.8l1.8 1.8M5.4 18.6l1.8-1.8M16.8 7.2l1.8-1.8"/></svg>',
  soir: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.4 14.7A7.9 7.9 0 1 1 9.3 4.6a6.3 6.3 0 0 0 10.1 10.1Z"/></svg>',
  tel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5h2.6l1.5 4-2 1.3a11 11 0 0 0 6.5 6.5l1.3-2 4 1.5v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  oeil: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
};
const CAPACITE = 60;
const STATUTS = { 'a-confirmer': 'À confirmer', confirmee: 'Confirmée', arrivee: 'Arrivés', refusee: 'Refusée', annulee: 'Annulée' };

export function init(root) {
  let D; try { D = JSON.parse($('script[data-esp-donnees]', root).textContent); } catch { return; }
  const R = D.reservation, A = aujourdhui();
  const toast = $('[data-esp-toast]', root);
  let minuteurToast;
  function dire(msg, lien) {
    toast.innerHTML = `<span>${e(typo(msg))}</span>${lien ? ` <a href="${e(lien)}">Voir sur le site</a>` : ''}`;
    toast.classList.add('est-visible'); clearTimeout(minuteurToast); minuteurToast = setTimeout(() => toast.classList.remove('est-visible'), 3600);
  }
  /** Enregistre et le dit ; si le navigateur refuse (mémoire pleine), le dit aussi. */
  function garder(f, msg, lien) {
    const ok = changer(f);
    if (ok) dire(msg || 'Enregistré : visible sur le site, dans ce navigateur.', lien); else dire('Ce navigateur refuse d\'enregistrer (mémoire pleine ou stockage bloqué). Essayez une photo de la photothèque plutôt qu\'une photo envoyée.');
    return ok;
  }

  // ---------- Horaires et ouvertures (les mêmes règles que la page Réserver, plus les changements de l'espace) ----------
  const services = Object.entries(R.services).map(([id, s]) => ({ id, d: enMin(s.debut), f: enMin(s.fin), pas: s.pas || 15, libelle: id === 'midi' ? 'Midi' : 'Soir' }));
  function ouvert(iso, sv) {
    const S = lire(), j = JOURS[jourDe(iso)];
    if ([...(D.horaires.exceptions || []), ...(S.horaires?.exceptions || [])].some((x) => (x.du || x.date) <= iso && iso <= (x.au || x.date))) return false;
    if ((S.resa?.fermes?.[iso] || []).includes(sv)) return false;
    if (S.horaires?.semaine) return (S.horaires.semaine[j] || []).some((c) => svDe(c) === sv);
    const F = R.fermetures || {};
    return !(F.jours || []).includes(j) && !(F.dates || []).includes(iso) && !((F.services || {})[j] || []).includes(sv);
  }
  const complet = (iso, sv) => (lire().resa?.complets?.[iso] || []).includes(sv);
  const creneaux = (sv) => { const s = services.find((x) => x.id === sv); const l = []; for (let m = s.d; m <= s.f; m += s.pas) l.push(hhmm(m)); return l; };

  // ---------- Les réservations : démonstration (tirées des horaires), ajoutées au téléphone, venues du site ----------
  const NOMS = ['Camille R.', 'Julien M.', 'Sophie L.', 'Thomas B.', 'Léa K.', 'Nicolas F.', 'Claire D.', 'Antoine P.', 'Manon G.', 'Hugo S.', 'Sarah V.', 'Maxime T.', 'Chloé N.', 'Lucas H.', 'Émilie W.', 'Paul-Henri C.', 'Inès A.', 'Romain J.', 'Famille Weber', 'Aurélie et Marc'];
  const DEMANDES = ['', '', 'Anniversaire', '', '', 'Chaise haute', '', 'Près de la cheminée', '', 'Allergie aux fruits à coque', '', '', 'Une occasion à fêter', ''];
  function demo(iso, sv) {
    if (iso < ajouter(A.iso, -7) || iso > ajouter(A.iso, 28)) return [];
    // Démonstration : seulement sur les services ouverts d'après les règles du site (pas après une fermeture décidée ici).
    const F = R.fermetures || {}, j = JOURS[jourDe(iso)];
    if ((F.jours || []).includes(j) || (F.dates || []).includes(iso) || ((F.services || {})[j] || []).includes(sv)) return [];
    const h = hache(iso + sv), we = [5, 6].includes(jourDe(iso)), loin = iso > ajouter(A.iso, 10);
    const n = Math.max(0, (2 + (h % 5) + (we ? 3 : 0)) - (loin ? 3 : 0)), cr = creneaux(sv), out = [];
    for (let i = 0; i < n; i++) {
      const k = hache(iso + sv + i), t = cr[(k >>> 3) % cr.length];
      // Quelques demandes en attente seulement, dans les jours qui viennent (comme un vrai lundi matin).
      const statut = iso < A.iso ? 'arrivee' : iso > A.iso && iso <= ajouter(A.iso, 6) && k % 13 === 0 ? 'a-confirmer' : 'confirmee';
      out.push({ id: `demo-${iso}-${sv}-${i}`, date: iso, service: sv, heure: t, couverts: 2 + (k % 5) - (k % 7 === 0 ? 1 : 0), nom: NOMS[(k + i * 7) % NOMS.length], telephone: `06 ${String(10 + (k % 89)).padStart(2, '0')} ${String(k % 97).padStart(2, '0')} ${String((k >>> 4) % 99).padStart(2, '0')} ${String((k >>> 8) % 99).padStart(2, '0')}`, demande: DEMANDES[(k >>> 5) % DEMANDES.length], espace: 'salle', statut, source: 'demo' });
    }
    return out;
  }
  function resas(iso) {
    const S = lire(), st = S.resa?.statuts || {};
    const site = resasSite().filter((r) => r.date === iso).map((r) => ({ id: r.id, date: r.date, service: r.service, heure: r.heure, couverts: r.couverts, nom: [r.prenom, r.nom].filter(Boolean).join(' '), telephone: r.telephone, demande: [...(r.demandes || []), r.message].filter(Boolean).join(' · '), espace: r.espace, table: r.table, statut: 'a-confirmer', source: 'site' }));
    const tel = (S.resa?.ajouts || []).filter((r) => r.date === iso);
    return [...services.flatMap((s) => demo(iso, s.id)), ...tel, ...site].map((r) => ({ ...r, statut: st[r.id] || r.statut })).sort((a, b) => a.heure.localeCompare(b.heure));
  }
  const actives = (l) => l.filter((r) => !['refusee', 'annulee'].includes(r.statut));
  const couverts = (l) => actives(l).reduce((n, r) => n + (+r.couverts || 0), 0);
  function aConfirmer() { const l = []; for (let k = 0; k <= 28; k++) l.push(...resas(ajouter(A.iso, k)).filter((r) => r.statut === 'a-confirmer')); return l; }
  function statut(id, s) {
    garder((S) => { (S.resa ||= {}).statuts ||= {}; S.resa.statuts[id] = s; }, s === 'confirmee' ? 'Réservation confirmée : le client reçoit un message (simulé).' : s === 'refusee' ? 'Réservation refusée : le client est prévenu (simulé).' : s === 'arrivee' ? 'Bonne table !' : 'Enregistré.');
    rendre();
  }

  // ---------- Rendu des réservations ----------
  const assiettes = (n) => `<span class="esp-assiettes" aria-hidden="true">${'<i></i>'.repeat(Math.min(n, 10))}</span>`;
  function ligneResa(r, avecJour) {
    const actions = r.statut === 'a-confirmer' ? `<button type="button" class="esp-bouton esp-bouton--ok" data-statut="confirmee" data-id="${r.id}">Confirmer</button><button type="button" class="esp-bouton esp-bouton--non" data-statut="refusee" data-id="${r.id}">Refuser</button>`
      : r.statut === 'confirmee' && r.date === A.iso ? `<button type="button" class="esp-bouton" data-statut="arrivee" data-id="${r.id}">Arrivés</button>`
      : '';
    const src = r.source === 'site' ? '<span class="esp-source esp-source--site">Depuis le site</span>' : r.source === 'telephone' ? '<span class="esp-source">Au téléphone</span>' : '';
    return `<li class="esp-resa est-${r.statut}">
      <p class="esp-resa__heure">${avecJour ? `<small>${e(maj(fmt(r.date, { weekday: 'short', day: 'numeric', month: 'short' })))}</small>` : ''}${heure(r.heure)}</p>
      <div class="esp-resa__qui"><p class="esp-resa__nom">${e(r.nom || 'Sans nom')} ${src}</p><p class="esp-resa__detail">${assiettes(+r.couverts)}<span>${r.couverts} couvert${r.couverts > 1 ? 's' : ''}</span>${r.table ? `<span>· table ${e(r.table)}</span>` : ''}${r.espace === 'terrasse' ? '<span>· terrasse</span>' : ''}${r.demande ? `<span class="esp-resa__demande">· ${e(r.demande)}</span>` : ''}</p>
        ${r.telephone ? `<p class="esp-resa__tel"><a href="tel:${e(r.telephone.replace(/\s/g, ''))}">${ICO.tel}<span>${e(r.telephone)}</span></a></p>` : ''}</div>
      <p class="esp-resa__statut"><span class="esp-pastille esp-pastille--${r.statut}">${STATUTS[r.statut]}</span></p>
      <div class="esp-resa__actions">${actions}</div>
    </li>`;
  }

  // ---------- Événements ----------
  function evenements() {
    const S = lire(), m = S.evenements?.modifs || {};
    return [...D.agenda.map((x) => ({ ...x, ...(m[x.id] || {}) })), ...(S.evenements?.ajouts || []).map((x) => ({ ...x, ...(m[x.id] || {}), nouveau: true }))].sort((a, b) => a.debut.localeCompare(b.debut));
  }
  /** Garde aussi la liste à jour (sans photo) pour la prochaine soirée de l'accueil et l'agenda de Réserver. */
  const listeEv = (S) => { const m = S.evenements?.modifs || {}; return [...D.agenda.map((x) => ({ ...x, ...(m[x.id] || {}) })), ...(S.evenements?.ajouts || []).map((x) => ({ ...x, ...(m[x.id] || {}) }))].sort((a, b) => a.debut.localeCompare(b.debut)).map(({ id, titre, debut, type, prix, service, masque }) => ({ id, titre, debut, type, prix, service, masque: !!masque })); };
  const imgSrc = (o, w = 640) => o.src || `/assets/images/${o.image || o.nom}-${w}.webp`;
  const largeurs = (nom) => D.phototheque.find((p) => p.nom === nom)?.l || D.photos.find((p) => p.nom === nom)?.l || [640];
  const vignette = (nom) => { const l = largeurs(nom); return `/assets/images/${nom}-${l.find((w) => w >= 480) || l[l.length - 1]}.webp`; };

  // ---------- Vues ----------
  let vue = 'jour', jourChoisi = A.iso, evEdite = null, ajoutOuvert = false;
  const corps = (v) => $(`[data-esp-rendu="${v}"]`, root);

  function rendreJour() {
    const l = resas(A.iso), midi = l.filter((r) => r.service === 'midi'), soir = l.filter((r) => r.service === 'soir'), att = aConfirmer();
    const prochain = evenements().find((x) => !x.masque && x.debut >= A.iso);
    const S = lire();
    const tuile = (titre, valeur, detail, cls = '') => `<div class="esp-tuile ${cls}"><p class="esp-tuile__titre">${titre}</p><p class="esp-tuile__valeur">${valeur}</p><p class="esp-tuile__detail">${detail}</p></div>`;
    const sv = (s, lst) => !ouvert(A.iso, s) ? tuile(s === 'midi' ? 'Ce midi' : 'Ce soir', 'Fermé', 'Pas de service aujourd\'hui') : tuile(s === 'midi' ? 'Ce midi' : 'Ce soir', `${couverts(lst)}<small> / ${CAPACITE}</small>`, `${actives(lst).length} table${actives(lst).length > 1 ? 's' : ''}${complet(A.iso, s) ? ' · complet' : ''}`, 'esp-tuile--jauge" style="--jauge:' + Math.min(1, couverts(lst) / CAPACITE));
    corps('jour').innerHTML = `
      <div class="esp-tuiles">
        ${tuile('Aujourd\'hui', actives(l).length, `réservation${actives(l).length > 1 ? 's' : ''} · ${couverts(l)} couverts`)}
        ${sv('midi', midi)}${sv('soir', soir)}
        ${tuile('À confirmer', att.length, att.length ? 'demandes en attente' : 'tout est à jour', att.length ? 'esp-tuile--alerte' : '')}
      </div>
      <div class="esp-grille esp-grille--jour">
        <article class="esp-carte esp-carte--large" aria-labelledby="t-attente"><h3 id="t-attente">Ce qui attend une réponse</h3>
          ${att.length ? `<ul class="esp-resas">${att.slice(0, 6).map((r) => ligneResa(r, true)).join('')}</ul>${att.length > 6 ? `<p class="esp-plus"><button type="button" class="esp-lien" data-aller="resas">Voir les ${att.length} demandes</button></p>` : ''}` : '<p class="esp-vide">Rien en attente : toutes les demandes ont une réponse.</p>'}
        </article>
        <article class="esp-carte" aria-labelledby="t-service"><h3 id="t-service">Le service d'aujourd'hui</h3>
          ${actives(l).length ? `<ul class="esp-resas esp-resas--court">${actives(l).slice(0, 6).map((r) => ligneResa(r)).join('')}</ul>` : '<p class="esp-vide">Aucune réservation aujourd\'hui.</p>'}
          <p class="esp-plus"><button type="button" class="esp-lien" data-aller="resas">Ouvrir l'agenda</button></p>
        </article>
        ${prochain ? `<article class="esp-carte esp-carte--ev" aria-labelledby="t-ev"><h3 id="t-ev">Prochain événement</h3>
          <div class="esp-ev-mini"><img src="${e(imgSrc(prochain))}" alt="" style="object-position:${e(prochain.cadrage || '50% 50%')}" loading="lazy"><div><p class="esp-ev-mini__type">${e(prochain.type)} · ${e(maj(fmt(prochain.debut.slice(0, 10))))}</p><p class="esp-ev-mini__titre">${e(prochain.titre)}</p><p class="esp-ev-mini__prix">${e(prochain.prix)}</p></div></div>
          <p class="esp-plus"><button type="button" class="esp-lien" data-aller="evenements" data-editer="${e(prochain.id)}">Modifier</button></p></article>` : ''}
        <article class="esp-carte" aria-labelledby="t-site"><h3 id="t-site">Sur le site en ce moment</h3>
          <ul class="esp-etat">
            <li><span class="esp-etat__point${S.annonce?.active ? ' est-on' : ''}"></span>${S.annonce?.active ? `Annonce affichée : « ${e(S.annonce.texte)} »` : 'Pas d\'annonce affichée'}</li>
            <li><span class="esp-etat__point${ouvert(A.iso, 'midi') || ouvert(A.iso, 'soir') ? ' est-on' : ''}"></span>${ouvert(A.iso, 'midi') || ouvert(A.iso, 'soir') ? `Ouvert aujourd'hui : ${['midi', 'soir'].filter((s) => ouvert(A.iso, s)).join(' et ')}` : 'Fermé aujourd\'hui'}</li>
            <li><span class="esp-etat__point${estVide(S) ? '' : ' est-on'}"></span>${estVide(S) ? 'Le site est tel que livré' : 'Vos modifications sont visibles sur le site (dans ce navigateur)'}</li>
          </ul>
          <p class="esp-plus"><button type="button" class="esp-lien" data-aller="textes">Annonce et horaires</button></p>
        </article>
      </div>`;
  }

  function rendreResas() {
    const lundi = ajouter(jourChoisi, -((jourDe(jourChoisi) + 6) % 7));
    const jours = Array.from({ length: 7 }, (_, k) => ajouter(lundi, k));
    const l = resas(jourChoisi);
    const colonne = (s) => {
      const lst = l.filter((r) => r.service === s.id), ouv = ouvert(jourChoisi, s.id), fermeIci = (lire().resa?.fermes?.[jourChoisi] || []).includes(s.id), plein = complet(jourChoisi, s.id), passe = jourChoisi < A.iso;
      return `<section class="esp-service${ouv ? '' : ' est-ferme'}" aria-labelledby="sv-${s.id}">
        <header class="esp-service__tete"><span class="esp-ico-sv" aria-hidden="true">${ICO[s.id]}</span><h4 id="sv-${s.id}">${s.libelle} <small>${heure(hhmm(s.d))} – ${heure(hhmm(s.f))}</small></h4>
          <p class="esp-service__jauge" style="--jauge:${Math.min(1, couverts(lst) / CAPACITE)}"><span>${couverts(lst)} / ${CAPACITE} couverts</span></p></header>
        ${passe ? '' : `<p class="esp-bascules">${ouv || fermeIci ? `<button type="button" class="esp-bascule" aria-pressed="${plein}" data-complet="${s.id}" ${ouv ? '' : 'disabled'}><span class="esp-bascule__rail" aria-hidden="true"></span>Complet</button><button type="button" class="esp-bascule" aria-pressed="${fermeIci}" data-fermer="${s.id}"><span class="esp-bascule__rail" aria-hidden="true"></span>Fermé ce jour</button>` : '<span class="esp-note">Fermé d\'après vos horaires</span>'}</p>`}
        ${lst.length ? `<ul class="esp-resas">${lst.map((r) => ligneResa(r)).join('')}</ul>` : `<p class="esp-vide">${ouv ? 'Pas encore de réservation.' : 'Pas de service.'}</p>`}
      </section>`;
    };
    corps('resas').innerHTML = `
      <div class="esp-semaine">
        <button type="button" class="esp-rond" data-semaine="-7" aria-label="Semaine précédente">‹</button>
        <ol class="esp-semaine__jours">${jours.map((iso) => { const n = couverts(resas(iso)), att = resas(iso).filter((r) => r.statut === 'a-confirmer').length; return `<li><button type="button" class="esp-jour${iso === A.iso ? ' est-auj' : ''}" data-jour="${iso}" aria-pressed="${iso === jourChoisi}"><span class="esp-jour__nom">${e(fmt(iso, { weekday: 'short' }).replace('.', ''))}</span><b>${+iso.slice(8)}</b><span class="esp-jour__n">${n ? `${n} couv.` : '—'}</span>${att ? `<span class="esp-jour__att" aria-label="${att} à confirmer">${att}</span>` : ''}</button></li>`; }).join('')}</ol>
        <button type="button" class="esp-rond" data-semaine="7" aria-label="Semaine suivante">›</button>
      </div>
      <div class="esp-jourtete"><h3>${e(maj(fmt(jourChoisi)))}${jourChoisi === A.iso ? ' <span class="esp-pastille">Aujourd\'hui</span>' : ''}</h3>
        <button type="button" class="bouton esp-ajouter" data-ajouter aria-expanded="${ajoutOuvert}">${ICO.plus}<span>Ajouter une réservation</span></button></div>
      ${ajoutOuvert ? `<form class="esp-carte esp-form-ajout" data-form-ajout aria-label="Nouvelle réservation prise au téléphone">
        <p class="esp-champ"><label for="aj-nom">Nom</label><input id="aj-nom" name="nom" required autocomplete="off"></p>
        <p class="esp-champ"><label for="aj-tel">Téléphone</label><input id="aj-tel" name="telephone" type="tel" autocomplete="off"></p>
        <p class="esp-champ"><label for="aj-sv">Service</label><select id="aj-sv" name="service">${services.map((s) => `<option value="${s.id}"${ouvert(jourChoisi, s.id) ? '' : ' disabled'}>${s.libelle}</option>`).join('')}</select></p>
        <p class="esp-champ"><label for="aj-h">Heure</label><select id="aj-h" name="heure">${services.map((s) => creneaux(s.id).map((t) => `<option value="${t}" data-sv="${s.id}">${heure(t)}</option>`).join('')).join('')}</select></p>
        <p class="esp-champ"><label for="aj-c">Couverts</label><input id="aj-c" name="couverts" type="number" min="1" max="30" value="2"></p>
        <p class="esp-champ esp-champ--large"><label for="aj-d">Note</label><input id="aj-d" name="demande" placeholder="Anniversaire, chaise haute…" autocomplete="off"></p>
        <p class="esp-form-ajout__actions"><button type="submit" class="bouton">Enregistrer</button><button type="button" class="esp-bouton esp-bouton--discret" data-ajouter>Annuler</button></p>
      </form>` : ''}
      <div class="esp-services">${services.map(colonne).join('')}</div>`;
    const f = $('[data-form-ajout]', root);
    if (f) { const sv = f.elements.service, h = f.elements.heure; const filtre = () => { for (const o of h.options) o.hidden = o.dataset.sv !== sv.value; if (h.selectedOptions[0]?.hidden) h.value = [...h.options].find((o) => !o.hidden)?.value; }; const premier = [...sv.options].find((o) => !o.disabled); if (premier) sv.value = premier.value; filtre(); sv.addEventListener('change', filtre); }
  }

  function rendreEvenements() {
    const l = evenements();
    if (evEdite) return rendreEditeur(l.find((x) => x.id === evEdite) || { id: evEdite, titre: '', debut: ajouter(A.iso, 14), type: 'Soirée', prix: '', service: 'soir', image: 'vraie/salle-pierre', l: largeurs('vraie/salle-pierre'), cadrage: '50% 50%', nouveau: true });
    const venir = l.filter((x) => x.debut.slice(0, 10) >= A.iso), passes = l.filter((x) => x.debut.slice(0, 10) < A.iso);
    const carte = (x) => `<li class="esp-ev${x.masque ? ' est-masque' : ''}"><img class="esp-ev__photo" src="${e(imgSrc(x))}" alt="" style="object-position:${e(x.cadrage || '50% 50%')}" loading="lazy">
      <div class="esp-ev__texte"><p class="esp-ev__type">${e(x.type)}${x.debut.slice(0, 10) < A.iso ? ' · passé' : ''}${x.nouveau ? ' · <span class="esp-pastille">Nouveau</span>' : ''}${x.masque ? ' · <span class="esp-pastille esp-pastille--refusee">Masqué</span>' : ''}</p><h4 class="esp-ev__titre">${e(x.titre)}</h4><p class="esp-ev__date">${e(maj(fmt(x.debut.slice(0, 10))))} · ${x.service === 'midi' ? 'midi' : 'soir'}</p>${x.prix ? `<p class="esp-ev__prix">${e(x.prix)}</p>` : ''}</div>
      <p class="esp-ev__actions"><button type="button" class="esp-bouton" data-editer="${e(x.id)}">Modifier</button><button type="button" class="esp-bascule" aria-pressed="${!x.masque}" data-visible="${e(x.id)}"><span class="esp-bascule__rail" aria-hidden="true"></span>Sur le site</button></p></li>`;
    corps('evenements').innerHTML = `<div class="esp-barre"><p class="esp-barre__texte">Ils s'affichent sur la page Les fêtes, dans « Prochaine soirée » de l'accueil et dans le choix des dates de la réservation.</p><button type="button" class="bouton esp-ajouter" data-nouvel-ev>${ICO.plus}<span>Nouvel événement</span></button></div>
      <h3 class="esp-sous">À venir</h3><ul class="esp-evs">${venir.map(carte).join('') || '<li class="esp-vide">Aucun événement à venir.</li>'}</ul>
      ${passes.length ? `<h3 class="esp-sous">Passés</h3><ul class="esp-evs esp-evs--passes">${passes.map(carte).join('')}</ul>` : ''}`;
  }
  function rendreEditeur(x) {
    corps('evenements').innerHTML = `<p><button type="button" class="esp-lien esp-retour" data-fermer-ev>← Tous les événements</button></p>
      <form class="esp-editeur" data-editeur data-id="${e(x.id)}" aria-label="${x.nouveau && !x.titre ? 'Nouvel événement' : 'Modifier l\'événement'}">
        <div class="esp-editeur__champs esp-carte">
          <p class="esp-champ esp-champ--large"><label for="ev-titre">Titre</label><input id="ev-titre" name="titre" value="${e(x.titre)}" required placeholder="Soirée raclette"></p>
          <p class="esp-champ"><label for="ev-type">Genre</label><select id="ev-type" name="type">${['Soirée', 'Brunch', 'Fête', 'Concert', 'Atelier'].map((t) => `<option${t === x.type ? ' selected' : ''}>${t}</option>`).join('')}</select></p>
          <p class="esp-champ"><label for="ev-date">Date</label><input id="ev-date" name="debut" type="date" value="${e(x.debut.slice(0, 10))}" required></p>
          <p class="esp-champ"><label for="ev-sv">Service</label><select id="ev-sv" name="service"><option value="midi"${x.service === 'midi' ? ' selected' : ''}>Midi</option><option value="soir"${x.service !== 'midi' ? ' selected' : ''}>Soir</option></select></p>
          <p class="esp-champ esp-champ--large"><label for="ev-prix">Prix</label><input id="ev-prix" name="prix" value="${e(x.prix)}" placeholder="39 € hors boissons"></p>
          <div class="esp-champ esp-champ--large"><p class="esp-champ__titre">Photo <small>(touchez la photo pour choisir le point à garder au centre)</small></p>
            <button type="button" class="esp-cadreur" data-cadreur style="--fx:${e((x.cadrage || '50% 50%').split(' ')[0])};--fy:${e((x.cadrage || '50% 50%').split(' ')[1])}" aria-label="Cadrer la photo : touchez le point à garder au centre, ou utilisez les flèches"><img src="${e(imgSrc(x, 1280))}" alt="" style="object-position:${e(x.cadrage || '50% 50%')}"><span class="esp-cadreur__mire" aria-hidden="true"></span></button>
            <p class="esp-editeur__photo-actions"><button type="button" class="esp-bouton" data-choisir-photo="ev">Changer la photo</button></p></div>
          <p class="esp-editeur__actions"><button type="submit" class="bouton">Enregistrer</button>${x.nouveau && x.titre ? '<button type="button" class="esp-bouton esp-bouton--non" data-supprimer-ev>Supprimer</button>' : ''}</p>
        </div>
        <div class="esp-editeur__apercu"><p class="esp-champ__titre">Sur la page Les fêtes</p>
          <article class="esp-billet" data-billet><img src="${e(imgSrc(x))}" alt="" style="object-position:${e(x.cadrage || '50% 50%')}"><span class="esp-billet__perfo" aria-hidden="true"></span><p class="esp-billet__date"></p><p class="esp-billet__titre"></p><p class="esp-billet__prix"></p></article></div>
      </form>`;
    const f = $('[data-editeur]', root);
    f._photo = { image: x.src ? null : x.image, l: x.l || largeurs(x.image), src: x.src || null, cadrage: x.cadrage || '50% 50%' };
    apercuBillet(f);
  }
  function apercuBillet(f) {
    const b = $('[data-billet]', f), v = Object.fromEntries(new FormData(f)), p = f._photo;
    $('.esp-billet__date', b).textContent = v.debut ? maj(fmt(v.debut)) + (v.service === 'midi' ? ', au déjeuner' : ', le soir') : '';
    $('.esp-billet__titre', b).textContent = v.titre || 'Titre de l\'événement';
    $('.esp-billet__prix', b).textContent = v.prix;
    const src = p.src || `/assets/images/${p.image}-640.webp`;
    for (const img of $$('img', f)) { img.src = img.closest('[data-cadreur]') ? (p.src || `/assets/images/${p.image}-${p.l.find((w) => w >= 1000) || p.l[p.l.length - 1]}.webp`) : src; img.style.objectPosition = p.cadrage; }
    const [fx, fy] = p.cadrage.split(' '); const c = $('[data-cadreur]', f); c.style.setProperty('--fx', fx); c.style.setProperty('--fy', fy);
  }

  function rendreTextes() {
    const S = lire(), an = S.annonce || {}, sem = S.horaires?.semaine || D.horaires.semaine, exc = [...(S.horaires?.exceptions || [])];
    const ard = { jour: S.ardoise?.jour || D.ardoise.jour, soir: S.ardoise?.soir || D.ardoise.soir };
    const plage = (j, sv) => (sem[j] || []).find((c) => svDe(c) === sv);
    const defauts = { midi: ['12:00', '14:30'], soir: ['19:00', '23:00'] };
    const ligneH = (j) => `<tr><th scope="row">${maj(j)}</th>${['midi', 'soir'].map((sv) => { const p = plage(j, sv), [d, f] = p ? p.split('-') : defauts[sv]; return `<td><div class="esp-plage${p ? '' : ' est-off'}"><label class="esp-coche"><input type="checkbox" name="${j}-${sv}"${p ? ' checked' : ''}><span>${sv === 'midi' ? 'Midi' : 'Soir'}</span></label><input type="time" name="${j}-${sv}-d" value="${d}" aria-label="${maj(j)} ${sv}, ouverture" step="900"${p ? '' : ' disabled'}><span aria-hidden="true">–</span><input type="time" name="${j}-${sv}-f" value="${f === '00:00' ? '23:59' : f}" aria-label="${maj(j)} ${sv}, fermeture" step="900"${p ? '' : ' disabled'}></div></td>`; }).join('')}</tr>`;
    const ardoise = (k, nom) => `<fieldset class="esp-ardoise" data-ardoise="${k}"><legend>${nom}</legend>
      <p class="esp-champ"><label for="ar-${k}-t">Titre</label><input id="ar-${k}-t" name="titre" value="${e(ard[k].titre)}"></p>
      <ol class="esp-ardoise__lignes">${ard[k].lignes.map((l, i) => `<li><input name="plat" value="${e(l.plat)}" aria-label="Plat ${i + 1}"><input name="prix" value="${e(l.prix)}" aria-label="Prix du plat ${i + 1}" class="esp-prix"><button type="button" class="esp-rond esp-rond--petit" data-retirer-plat aria-label="Retirer ce plat">×</button></li>`).join('')}</ol>
      <p><button type="button" class="esp-bouton" data-ajouter-plat>${ICO.plus}<span>Ajouter un plat</span></button></p>
      <p class="esp-champ"><label for="ar-${k}-m">Le mot du chef</label><input id="ar-${k}-m" name="mot" value="${e(ard[k].mot)}"></p></fieldset>`;
    corps('textes').innerHTML = `<div class="esp-grille esp-grille--textes">
      <article class="esp-carte" aria-labelledby="t-annonce"><h3 id="t-annonce">L'annonce</h3><p class="esp-aide">Un petit mot qui apparaît sur toutes les pages : une fermeture, une soirée complète, le menu de la Saint-Valentin…</p>
        <form data-form-annonce><p><button type="button" class="esp-bascule" aria-pressed="${!!an.active}" data-annonce-active><span class="esp-bascule__rail" aria-hidden="true"></span>Afficher l'annonce</button></p>
        <p class="esp-champ esp-champ--large"><label for="an-texte">Texte <small data-compte>${(an.texte || '').length} / 160</small></label><textarea id="an-texte" name="texte" maxlength="160" rows="3" placeholder="Fermeture annuelle du 4 au 18 janvier : à très vite !">${e(an.texte || '')}</textarea></p></form>
        <div class="esp-annonce-apercu" aria-hidden="true"><p class="annonce-site__sur">Annonce</p><p data-annonce-apercu>${e(an.texte || 'Fermeture annuelle du 4 au 18 janvier : à très vite !')}</p></div>
      </article>
      <article class="esp-carte" aria-labelledby="t-fermetures"><h3 id="t-fermetures">Fermetures exceptionnelles</h3><p class="esp-aide">Le site affiche « fermé » ces jours-là et la réservation ne les propose plus.</p>
        <ul class="esp-fermetures">${exc.map((x, i) => `<li><span><b>${e(x.du === x.au ? maj(fmt(x.du)) : `Du ${fmt(x.du, { day: 'numeric', month: 'long' })} au ${fmt(x.au, { day: 'numeric', month: 'long' })}`)}</b>${x.motif ? ` · ${e(x.motif)}` : ''}</span><button type="button" class="esp-bouton esp-bouton--discret" data-retirer-fermeture="${i}">Retirer</button></li>`).join('') || '<li class="esp-vide">Aucune fermeture prévue.</li>'}</ul>
        <form class="esp-form-fermeture" data-form-fermeture><p class="esp-champ"><label for="fe-du">Du</label><input id="fe-du" name="du" type="date" min="${A.iso}" required></p><p class="esp-champ"><label for="fe-au">Au</label><input id="fe-au" name="au" type="date" min="${A.iso}"></p><p class="esp-champ esp-champ--large"><label for="fe-motif">Motif (affiché)</label><input id="fe-motif" name="motif" placeholder="Congés annuels"></p><p><button type="submit" class="bouton">Ajouter la fermeture</button></p></form>
      </article>
      <article class="esp-carte esp-carte--large" aria-labelledby="t-horaires"><h3 id="t-horaires">Horaires de la semaine</h3><p class="esp-aide">Le statut « ouvert maintenant » du site et les services proposés à la réservation suivent ces horaires.</p>
        <form data-form-horaires><div class="esp-table-defile"><table class="esp-horaires"><caption class="visuellement-cache">Horaires du midi et du soir, jour par jour</caption><thead><tr><th scope="col">Jour</th><th scope="col">Midi</th><th scope="col">Soir</th></tr></thead><tbody>${SEMAINE.map(ligneH).join('')}</tbody></table></div></form>
      </article>
      <article class="esp-carte esp-carte--large" aria-labelledby="t-ardoise"><h3 id="t-ardoise">L'ardoise de la semaine</h3><p class="esp-aide">Elle s'affiche sur La carte et au dos de la photo du chef, à l'accueil.</p>
        <form class="esp-ardoises" data-form-ardoise>${ardoise('jour', 'Le midi')}${ardoise('soir', 'Le soir')}</form>
      </article>
      <article class="esp-carte esp-carte--large" aria-labelledby="t-textes"><h3 id="t-textes">Les textes du site</h3>
        <form class="esp-textes" data-form-textes>${D.textes.map((t, i) => `<div class="esp-texte"><p class="esp-texte__lieu">${e(t.lieu)} <a href="${e(t.url)}" class="esp-voir">${ICO.oeil}<span>Voir</span></a></p><p class="esp-champ esp-champ--large"><label for="tx-${i}">${e(t.libelle)}</label>${t.long ? `<textarea id="tx-${i}" name="${e(t.cle)}" rows="3">${e(S.textes?.[t.cle] || t.defaut)}</textarea>` : `<input id="tx-${i}" name="${e(t.cle)}" value="${e(S.textes?.[t.cle] || t.defaut)}">`}</p>${S.textes?.[t.cle] ? `<p><button type="button" class="esp-lien" data-retablir-texte="${e(t.cle)}">Revenir au texte d'origine</button></p>` : ''}</div>`).join('')}</form>
      </article></div>`;
  }

  function rendrePhotos() {
    const S = lire();
    corps('photos').innerHTML = `<p class="esp-aide esp-aide--haut">Remplacez une photo par une autre de votre photothèque ou de votre téléphone, puis touchez-la pour choisir le point à garder au centre.</p>
      <ul class="esp-photos">${D.photos.map((p) => { const m = S.photos?.[p.id] || {}, nom = m.src ? null : (m.nom || p.nom), cad = m.cadrage || p.cadrage, [fx, fy] = cad.split(' ');
        return `<li class="esp-photo"><button type="button" class="esp-cadreur" data-cadreur-slot="${p.id}" style="--fx:${fx};--fy:${fy}" aria-label="Cadrer : ${e(p.lieu)}, ${e(p.libelle)}. Touchez le point à garder au centre, ou utilisez les flèches"><img src="${e(m.src || vignette(nom))}" alt="" style="object-position:${e(cad)}" loading="lazy"><span class="esp-cadreur__mire" aria-hidden="true"></span></button>
          <div class="esp-photo__texte"><p class="esp-photo__lieu">${e(p.lieu)}</p><h3 class="esp-photo__titre">${e(p.libelle)}</h3>${S.photos?.[p.id] ? '<p><span class="esp-pastille">Modifiée</span></p>' : ''}</div>
          <p class="esp-photo__actions"><button type="button" class="esp-bouton" data-choisir-photo="${p.id}">Changer</button>${S.photos?.[p.id] ? `<button type="button" class="esp-bouton esp-bouton--discret" data-retablir-photo="${p.id}">Rétablir</button>` : ''}<a class="esp-voir" href="${e(p.url)}">${ICO.oeil}<span>Voir</span></a></p></li>`; }).join('')}</ul>`;
  }

  function rendre() {
    ({ jour: rendreJour, resas: rendreResas, evenements: rendreEvenements, textes: rendreTextes, photos: rendrePhotos })[vue]();
    const n = aConfirmer().length, b = $('[data-esp-badge="resas"]', root);
    b.hidden = !n; b.textContent = n; b.setAttribute('aria-label', `${n} à confirmer`);
    const l = resas(A.iso);
    $('[data-esp-bonjour]', root).textContent = `${maj(fmt(A.iso))}\u00a0: ${actives(l).length} réservation${actives(l).length > 1 ? 's' : ''} aujourd'hui${n ? `, ${n} demande${n > 1 ? 's' : ''} à confirmer` : ''}.`;
  }
  function allerVue(v, focus = true) {
    vue = v; try { sessionStorage.setItem('jh-espace-vue', v); } catch { /* rien */ }
    for (const s of $$('.esp-vue', root)) s.hidden = s.dataset.vue !== v;
    for (const b of $$('[data-esp-vue]', root)) { if (b.dataset.espVue === v) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); }
    rendre();
    const t = $(`#vue-${v}`, root);
    if (focus && t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); const y = t.getBoundingClientRect().top; if (y < 0 || y > innerHeight * .5) scrollTo({ top: scrollY + y - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--entete-h')) || 64) - 90, behavior: 'smooth' }); }
  }

  // ---------- La photothèque (et l'envoi depuis l'appareil) ----------
  let pourQui = null, retourFocus = null;
  const modale = document.createElement('div');
  modale.className = 'esp-modale'; modale.hidden = true;
  modale.innerHTML = `<div class="esp-modale__fond" data-fermer-modale></div><div class="esp-modale__boite" role="dialog" aria-modal="true" aria-labelledby="modale-titre">
    <header class="esp-modale__tete"><h2 id="modale-titre">Choisir une photo</h2><button type="button" class="esp-rond" data-fermer-modale aria-label="Fermer">×</button></header>
    <p class="esp-modale__envoi"><label class="bouton esp-fichier">Depuis mon appareil<input type="file" accept="image/*" data-fichier></label><span class="esp-aide">La photo est réduite et gardée dans ce navigateur.</span></p>
    <ul class="esp-phototheque">${D.phototheque.map((p) => `<li><button type="button" class="esp-vignette" data-photo="${p.nom}"><img src="/assets/images/${p.nom}-640.webp" alt="${e(p.nom.split('/')[1].replace(/-/g, ' '))}" loading="lazy"></button></li>`).join('')}</ul></div>`;
  root.append(modale);
  function ouvrirModale(qui, depuis) { pourQui = qui; retourFocus = depuis; modale.hidden = false; document.documentElement.classList.add('esp-modale-ouverte'); $('.esp-vignette', modale)?.focus(); }
  function fermerModale() { modale.hidden = true; document.documentElement.classList.remove('esp-modale-ouverte'); retourFocus?.focus?.(); }
  function choisie(photo) {
    if (pourQui === 'ev') { const f = $('[data-editeur]', root); if (f) { f._photo = { ...f._photo, ...photo, image: photo.nom || null, src: photo.src || null }; apercuBillet(f); } fermerModale(); return; }
    const slot = pourQui;
    const ok = garder((S) => { (S.photos ||= {})[slot] = { ...(S.photos[slot] || {}), nom: photo.nom || null, l: photo.l || null, src: photo.src || null }; }, 'Photo changée : visible sur le site, dans ce navigateur.', D.photos.find((p) => p.id === slot)?.url);
    fermerModale(); if (ok) rendre();
  }
  function reduire(fichier) {
    return new Promise((ok, non) => {
      const lecteur = new FileReader();
      lecteur.onload = () => { const img = new Image(); img.onload = () => { const k = Math.min(1, 1400 / Math.max(img.width, img.height)), c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); ok(c.toDataURL('image/jpeg', .8)); }; img.onerror = non; img.src = lecteur.result; };
      lecteur.onerror = non; lecteur.readAsDataURL(fichier);
    });
  }
  modale.addEventListener('click', (ev) => {
    if (ev.target.closest('[data-fermer-modale]')) { fermerModale(); return; }
    const v = ev.target.closest('[data-photo]'); if (v) { const nom = v.dataset.photo; choisie({ nom, l: largeurs(nom) }); }
  });
  modale.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') fermerModale();
    if (ev.key === 'Tab') { const f = $$('button, input, [href]', modale).filter((x) => !x.closest('[hidden]') && x.offsetParent); if (!f.length) return; if (ev.shiftKey && document.activeElement === f[0]) { ev.preventDefault(); f[f.length - 1].focus(); } else if (!ev.shiftKey && document.activeElement === f[f.length - 1]) { ev.preventDefault(); f[0].focus(); } }
  });
  $('[data-fichier]', modale).addEventListener('change', async (ev) => { const f = ev.target.files?.[0]; if (!f) return; try { choisie({ src: await reduire(f) }); } catch { dire('Cette photo ne s\'ouvre pas : essayez un fichier JPEG ou PNG.'); } ev.target.value = ''; });

  // ---------- Cadrage : toucher la photo, ou les flèches ----------
  function cadrer(btn, x, y) {
    const c = `${Math.round(x)}% ${Math.round(y)}%`; btn.style.setProperty('--fx', `${Math.round(x)}%`); btn.style.setProperty('--fy', `${Math.round(y)}%`); $('img', btn).style.objectPosition = c;
    if (btn.dataset.cadreurSlot) garder((S) => { const id = btn.dataset.cadreurSlot, p = D.photos.find((q) => q.id === id); (S.photos ||= {})[id] = { nom: p.nom, l: largeurs(p.nom), ...(S.photos[id] || {}), cadrage: c }; }, 'Cadrage enregistré.');
    else { const f = btn.closest('[data-editeur]'); if (f) { f._photo.cadrage = c; apercuBillet(f); } }
  }
  root.addEventListener('pointerdown', (ev) => {
    const btn = ev.target.closest('[data-cadreur], [data-cadreur-slot]'); if (!btn) return;
    const r = btn.getBoundingClientRect(); cadrer(btn, ((ev.clientX - r.left) / r.width) * 100, ((ev.clientY - r.top) / r.height) * 100);
  });
  root.addEventListener('keydown', (ev) => {
    const btn = ev.target.closest('[data-cadreur], [data-cadreur-slot]'); if (!btn || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(ev.key)) return;
    ev.preventDefault(); const x = parseFloat(btn.style.getPropertyValue('--fx')) || 50, y = parseFloat(btn.style.getPropertyValue('--fy')) || 50, d = 5;
    cadrer(btn, Math.max(0, Math.min(100, x + (ev.key === 'ArrowRight' ? d : ev.key === 'ArrowLeft' ? -d : 0))), Math.max(0, Math.min(100, y + (ev.key === 'ArrowDown' ? d : ev.key === 'ArrowUp' ? -d : 0))));
  });

  // ---------- Les clics ----------
  root.addEventListener('click', (ev) => {
    const t = ev.target;
    const nav = t.closest('[data-esp-vue]'); if (nav) { evEdite = null; allerVue(nav.dataset.espVue); return; }
    const al = t.closest('[data-aller]'); if (al) { if (al.dataset.editer) evEdite = al.dataset.editer; allerVue(al.dataset.aller); return; }
    const st = t.closest('[data-statut]'); if (st) { statut(st.dataset.id, st.dataset.statut); return; }
    const j = t.closest('[data-jour]'); if (j) { jourChoisi = j.dataset.jour; rendre(); $(`[data-jour="${jourChoisi}"]`, root)?.focus(); return; }
    const sm = t.closest('[data-semaine]'); if (sm) { jourChoisi = ajouter(jourChoisi, +sm.dataset.semaine); rendre(); $(`[data-semaine="${sm.dataset.semaine}"]`, root)?.focus(); return; }
    const aj = t.closest('[data-ajouter]'); if (aj) { ajoutOuvert = !ajoutOuvert; rendre(); (ajoutOuvert ? $('#aj-nom', root) : $('[data-ajouter]', root))?.focus(); return; }
    const cp = t.closest('[data-complet]'); if (cp) { const sv = cp.dataset.complet, on = cp.getAttribute('aria-pressed') !== 'true'; garder((S) => { const c = ((S.resa ||= {}).complets ||= {}); c[jourChoisi] = [...new Set([...(c[jourChoisi] || []).filter((x) => x !== sv), ...(on ? [sv] : [])])]; }, on ? 'Service complet : la réservation en ligne ne le propose plus.' : 'Le service est de nouveau proposé.', D.pages.reserver); rendre(); $(`[data-complet="${sv}"]`, root)?.focus(); return; }
    const fm = t.closest('[data-fermer]'); if (fm) { const sv = fm.dataset.fermer, on = fm.getAttribute('aria-pressed') !== 'true'; garder((S) => { const c = ((S.resa ||= {}).fermes ||= {}); c[jourChoisi] = [...new Set([...(c[jourChoisi] || []).filter((x) => x !== sv), ...(on ? [sv] : [])])]; }, on ? 'Service fermé ce jour-là : plus de réservation en ligne.' : 'Service rouvert.', D.pages.reserver); rendre(); $(`[data-fermer="${sv}"]`, root)?.focus(); return; }
    // Événements
    const ed = t.closest('[data-editer]'); if (ed) { evEdite = ed.dataset.editer; rendre(); $('#ev-titre', root)?.focus(); return; }
    if (t.closest('[data-nouvel-ev]')) { evEdite = 'ev-' + Date.now().toString(36); rendre(); $('#ev-titre', root)?.focus(); return; }
    if (t.closest('[data-fermer-ev]')) { const id = evEdite; evEdite = null; rendre(); $(`[data-editer="${id}"]`, root)?.focus(); return; }
    const vis = t.closest('[data-visible]'); if (vis) { const id = vis.dataset.visible, on = vis.getAttribute('aria-pressed') !== 'true'; garder((S) => { const m = ((S.evenements ||= {}).modifs ||= {}); m[id] = { ...(m[id] || {}), masque: !on }; S.evenements.liste = listeEv(S); }, on ? 'Événement affiché sur le site.' : 'Événement masqué sur le site.', D.pages.fetes); rendre(); $(`[data-visible="${id}"]`, root)?.focus(); return; }
    if (t.closest('[data-supprimer-ev]')) { const id = evEdite; garder((S) => { S.evenements.ajouts = (S.evenements.ajouts || []).filter((x) => x.id !== id); delete S.evenements.modifs?.[id]; S.evenements.liste = listeEv(S); }, 'Événement supprimé.'); evEdite = null; rendre(); return; }
    const cph = t.closest('[data-choisir-photo]'); if (cph) { ouvrirModale(cph.dataset.choisirPhoto, cph); return; }
    const rph = t.closest('[data-retablir-photo]'); if (rph) { garder((S) => { delete S.photos?.[rph.dataset.retablirPhoto]; }, 'Photo d\'origine rétablie.'); rendre(); return; }
    // Textes et horaires
    const ann = t.closest('[data-annonce-active]'); if (ann) { const on = ann.getAttribute('aria-pressed') !== 'true', txt = $('#an-texte', root).value.trim() || 'Fermeture annuelle du 4 au 18 janvier : à très vite !'; garder((S) => { S.annonce = { active: on, texte: txt }; }, on ? 'Annonce affichée sur toutes les pages.' : 'Annonce retirée.', D.pages.accueil); ann.setAttribute('aria-pressed', String(on)); if (on && !$('#an-texte', root).value.trim()) { $('#an-texte', root).value = txt; } return; }
    const rf = t.closest('[data-retirer-fermeture]'); if (rf) { garder((S) => { S.horaires.exceptions.splice(+rf.dataset.retirerFermeture, 1); }, 'Fermeture retirée.'); rendre(); return; }
    if (t.closest('[data-ajouter-plat]')) { const ol = $('.esp-ardoise__lignes', t.closest('[data-ardoise]')), n = ol.children.length + 1; ol.insertAdjacentHTML('beforeend', `<li><input name="plat" aria-label="Plat ${n}" placeholder="Nouveau plat"><input name="prix" aria-label="Prix du plat ${n}" class="esp-prix" placeholder="00 €"><button type="button" class="esp-rond esp-rond--petit" data-retirer-plat aria-label="Retirer ce plat">×</button></li>`); ol.lastElementChild.querySelector('input').focus(); return; }
    if (t.closest('[data-retirer-plat]')) { const li = t.closest('li'), fs = li.closest('[data-ardoise]'); li.remove(); sauverArdoise(); $('[data-ajouter-plat]', fs)?.focus(); return; }
    const rt = t.closest('[data-retablir-texte]'); if (rt) { garder((S) => { delete S.textes?.[rt.dataset.retablirTexte]; }, 'Texte d\'origine rétabli.'); rendre(); return; }
    if (t.closest('[data-esp-quitter]')) { try { sessionStorage.removeItem('jh-espace-session'); } catch { /* rien */ } montrer(false); return; }
  });

  // ---------- Saisie : enregistrée au fil de l'eau ----------
  let minuteur;
  const plus_tard = (f) => { clearTimeout(minuteur); minuteur = setTimeout(f, 500); };
  function sauverArdoise() {
    const f = $('[data-form-ardoise]', root); if (!f) return;
    const lire1 = (k) => { const fs = $(`[data-ardoise="${k}"]`, f); return { titre: fs.querySelector('[name="titre"]').value, lignes: $$('.esp-ardoise__lignes li', fs).map((li) => ({ plat: li.querySelector('[name="plat"]').value.trim(), prix: li.querySelector('[name="prix"]').value.trim() })).filter((l) => l.plat || l.prix), mot: fs.querySelector('[name="mot"]').value }; };
    garder((S) => { S.ardoise = { jour: lire1('jour'), soir: lire1('soir') }; }, 'Ardoise enregistrée.', D.pages.carte);
  }
  function sauverHoraires() {
    const f = $('[data-form-horaires]', root); if (!f) return;
    const sem = Object.fromEntries(SEMAINE.map((j) => [j, ['midi', 'soir'].filter((sv) => f.elements[`${j}-${sv}`].checked).map((sv) => { const fin = f.elements[`${j}-${sv}-f`].value; return `${f.elements[`${j}-${sv}-d`].value}-${fin === '23:59' ? '00:00' : fin}`; })]));
    for (const j of SEMAINE) for (const sv of ['midi', 'soir']) { const on = f.elements[`${j}-${sv}`].checked; f.elements[`${j}-${sv}`].closest('.esp-plage').classList.toggle('est-off', !on); f.elements[`${j}-${sv}-d`].disabled = !on; f.elements[`${j}-${sv}-f`].disabled = !on; }
    garder((S) => { (S.horaires ||= {}).semaine = sem; }, 'Horaires enregistrés : le statut du site et la réservation les suivent.', D.pages.infos);
  }
  root.addEventListener('input', (ev) => {
    const t = ev.target;
    if (t.id === 'an-texte') { $('[data-compte]', root).textContent = `${t.value.length} / 160`; $('[data-annonce-apercu]', root).textContent = t.value || '…'; plus_tard(() => garder((S) => { S.annonce = { ...(S.annonce || {}), texte: t.value.trim() }; }, 'Annonce enregistrée.')); return; }
    if (t.closest('[data-form-ardoise]')) { plus_tard(sauverArdoise); return; }
    if (t.closest('[data-form-textes]')) { const cle = t.name, v = t.value.trim(), def = D.textes.find((x) => x.cle === cle)?.defaut; plus_tard(() => garder((S) => { S.textes ||= {}; if (!v || v === def) delete S.textes[cle]; else S.textes[cle] = v; }, 'Texte enregistré : visible sur le site, dans ce navigateur.', D.textes.find((x) => x.cle === cle)?.url)); return; }
    if (t.closest('[data-editeur]')) apercuBillet(t.closest('[data-editeur]'));
  });
  root.addEventListener('change', (ev) => { if (ev.target.closest('[data-form-horaires]')) sauverHoraires(); });
  root.addEventListener('submit', (ev) => {
    ev.preventDefault(); const f = ev.target;
    if (f.matches('[data-esp-connexion]')) { try { sessionStorage.setItem('jh-espace-session', '1'); } catch { /* rien */ } montrer(true); return; }
    if (f.matches('[data-form-ajout]')) {
      const v = Object.fromEntries(new FormData(f)); if (!v.nom.trim()) { f.elements.nom.focus(); return; }
      garder((S) => { ((S.resa ||= {}).ajouts ||= []).push({ id: 'tel-' + Date.now().toString(36), date: jourChoisi, service: v.service, heure: v.heure, couverts: Math.max(1, +v.couverts || 2), nom: v.nom.trim(), telephone: v.telephone.trim(), demande: v.demande.trim(), espace: 'salle', statut: 'confirmee', source: 'telephone' }); }, 'Réservation ajoutée à l\'agenda.');
      ajoutOuvert = false; rendre(); $('[data-ajouter]', root)?.focus(); return;
    }
    if (f.matches('[data-form-fermeture]')) {
      const du = f.elements.du.value, au = f.elements.au.value && f.elements.au.value >= du ? f.elements.au.value : du; if (!du) return;
      garder((S) => { ((S.horaires ||= {}).exceptions ||= []).push({ du, au, motif: f.elements.motif.value.trim() || 'Fermeture exceptionnelle' }); S.horaires.exceptions.sort((a, b) => a.du.localeCompare(b.du)); }, 'Fermeture ajoutée : le site affichera « fermé » ces jours-là.', D.pages.infos);
      rendre(); return;
    }
    if (f.matches('[data-editeur]')) {
      const v = Object.fromEntries(new FormData(f)); if (!v.titre.trim()) { f.elements.titre.focus(); return; }
      const id = f.dataset.id, p = f._photo, base = D.agenda.find((x) => x.id === id);
      const champs = { titre: v.titre.trim(), type: v.type, debut: v.debut, service: v.service, prix: v.prix.trim(), image: p.image || base?.image || 'vraie/salle-pierre', l: p.l, src: p.src || null, cadrage: p.cadrage };
      const ok = garder((S) => {
        S.evenements ||= {};
        if (base) { (S.evenements.modifs ||= {})[id] = { ...(S.evenements.modifs[id] || {}), ...champs }; }
        else { S.evenements.ajouts ||= []; const i = S.evenements.ajouts.findIndex((x) => x.id === id); const x = { id, ...champs }; if (i >= 0) S.evenements.ajouts[i] = x; else S.evenements.ajouts.push(x); }
        S.evenements.liste = listeEv(S);
      }, 'Événement enregistré : visible sur la page Les fêtes.', D.pages.fetes);
      if (ok) { evEdite = null; rendre(); $(`[data-editer="${id}"]`, root)?.focus(); }
    }
  });

  // ---------- Connexion ----------
  function montrer(dedans) {
    $('[data-esp-connexion]', root).hidden = dedans; $('[data-esp-app]', root).hidden = !dedans;
    root.classList.toggle('est-connecte', dedans);
    if (dedans) { let v = 'jour'; try { v = sessionStorage.getItem('jh-espace-vue') || 'jour'; } catch { /* rien */ } allerVue(v, false); $('[data-esp-vue][aria-current]', root)?.focus({ preventScroll: true }); }
    else { $('[data-esp-bonjour]', root).textContent = 'Réservations, événements, textes, horaires et photos\u00a0: le restaurant gère son site d\'ici, sans toucher au code.'; $('#esp-id', root)?.focus({ preventScroll: true }); }
  }
  let session = false; try { session = sessionStorage.getItem('jh-espace-session') === '1'; } catch { /* rien */ }
  if (session) montrer(true);
  // Bouton « Tout remettre comme livré » : dans la vue Textes, en bas.
  root.addEventListener('click', (ev) => { if (ev.target.closest('[data-tout-effacer]')) { vider(); dire('Tout est revenu comme à la livraison.'); rendre(); } });
}
