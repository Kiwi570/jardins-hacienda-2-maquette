/* Accueil v4 « Deux saisons, une maison » (plan journée) : le cadran braise et soleil fait basculer tout le site.
   Six sections : ouverture des saisons, la carte de la semaine (plateau à lancer), la table qui se dresse et finit en plongée
   dans l'assiette (ou dans l'eau l'été) vers la carte, les rendez-vous de la saison, la table qui s'agrandit (recevoir), offrir et venir.
   Modules : plat-fumant, objet-a-faire-tourner, assiette-qui-se-dresse (vraies assiettes posées sur la nappe).
   Effets propres (data-effet) : saison, lueur, reflets, plateau, table, plongee, decompte, braises, table-agrandit. */
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'accueil', fichier: 'index', imagePartage: 'ouverture-plat-1280.webp', modules: ['plat-fumant', 'objet-a-faire-tourner', 'assiette-qui-se-dresse'] };

const prix = (p) => (typeof p === 'number' ? `${p} €` : p);
const fourchette = (r) => {
  const n = r.plats.filter((p) => !/enfant/i.test(p.nom)).map((p) => p.prix).filter((p) => typeof p === 'number');
  return `${Math.min(...n)} à ${Math.max(...n)} €`;
};
const CHOIX = { entrees: [1, 0], plats: [2, 4], 'a-partager': [0, 3], desserts: [4, 2] };
const PHOTOS = { entrees: 'plateau-entree', plats: 'plateau-plat', 'a-partager': 'plateau-partager', desserts: 'plateau-dessert' };
/* Carte d'accès : coordonnées réelles projetées (x = (lon - 5,80) × 900, y = (49,70 - lat) × 480). */
const VILLES = [{ nom: 'Luxembourg', x: 299, y: 42 }, { nom: 'Thionville', x: 331, y: 164 }, { nom: 'Metz', x: 338, y: 278 }];
const MOINEVILLE = { x: 131, y: 238 };
/* La table vue de dessus (viewBox 1000) : trois assiettes, deux verres, les couverts. */
const ASSIETTES = [
  { nom: 'assiette-saumon', x: 270, y: 300, r: 150, de: 0.16, a: 0.32 },
  { nom: 'assiette-cepes', x: 560, y: 560, r: 205, de: 0.3, a: 0.48 },
  { nom: 'assiette-turquoise', x: 770, y: 250, r: 135, de: 0.46, a: 0.62 },
];
const PALIERS = [[2, 'table-deux', 'espace2'], [12, 'table-douze', 'espace12'], [40, 'table-quarante', 'espace40'], [120, 'table-cent-vingt', 'espace120']];

const saison = (c, cle) => html`<span data-saison-seul="hiver">${c.t(`v4.${cle}Hiver`)}</span><span data-saison-seul="ete">${c.t(`v4.${cle}Ete`)}</span>`;

function table(c) {
  const img = (a) => `<svg viewBox="0 0 1000 1000" aria-hidden="true" focusable="false"><defs><clipPath id="clip-${a.nom}"><circle cx="${a.x}" cy="${a.y}" r="${a.r}"/></clipPath></defs>`
    + `<circle cx="${a.x}" cy="${a.y}" r="${a.r + 16}" fill="#f7f1e6"/><circle cx="${a.x}" cy="${a.y}" r="${a.r + 16}" fill="none" stroke="#d9cbb3" stroke-width="2"/>`
    + `<image href="/assets/images/${a.nom}-640.webp" x="${a.x - a.r}" y="${a.y - a.r}" width="${a.r * 2}" height="${a.r * 2}" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip-${a.nom})"/></svg>`;
  const couverts = '<svg viewBox="0 0 1000 1000" aria-hidden="true" focusable="false"><g fill="#b8925a">'
    + '<rect x="318" y="430" width="10" height="300" rx="5"/><rect x="306" y="430" width="34" height="70" rx="8" opacity=".9"/>'
    + '<rect x="806" y="440" width="12" height="320" rx="6"/><path d="M806 440 q24 30 12 120 h-12z" opacity=".85"/></g></svg>';
  const verres = '<svg viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">'
    + '<circle cx="470" cy="190" r="52" fill="rgba(255,255,255,.35)" stroke="#e8dcc4" stroke-width="4"/><circle cx="455" cy="175" r="14" fill="rgba(255,255,255,.75)"/>'
    + '<circle cx="580" cy="150" r="44" fill="rgba(216,98,42,.18)" stroke="#e8dcc4" stroke-width="4"/><circle cx="568" cy="138" r="11" fill="rgba(255,255,255,.7)"/></svg>';
  return html`<div class="assiette__element" data-de="-.12" data-a="0" style="--hauteur:.4">${brut(couverts)}</div>
    <div class="assiette__element" data-de="0" data-a=".14" style="--hauteur:.5;--ox:52%;--oy:17%">${brut(verres)}</div>
    ${ASSIETTES.map((a) => html`<div class="assiette__element" data-de="${a.de}" data-a="${a.a}" style="--ox:${a.x / 10}%;--oy:${a.y / 10}%">${brut(img(a))}</div>`)}`;
}

export default (c) => {
  const carte = c.donnees.carte;
  const rubriques = carte.rubriques.map((r) => ({ ...r, plats2: (CHOIX[r.id] || [0, 1]).map((i) => r.plats[i]) }));
  const f = c.donnees.fetes;
  return html`
<section class="ouv-saisons" id="debut" data-lueur>
  <div class="ouv-saisons__photos" data-iris-centre>
    <div class="ouv-saisons__photo-saison" data-saison-photo="hiver">
      ${c.media({ nom: 'ouverture-plat', alt: c.s('v4.altHiver'), cadrage: '51% 64%', cadrageMobile: '50% 70%', priorite: true, classe: 'fumant ouv-saisons__photo', sizes: '100vw', attrs: 'data-module="plat-fumant" data-vapeur=".5 .66 .42" data-effet="vapeur" data-souris' })}
    </div>
    <div class="ouv-saisons__photo-saison" data-saison-photo="ete">
      ${c.media({ nom: 'ete-ouverture', alt: c.s('v4.altEte'), cadrage: '50% 60%', classe: 'ouv-saisons__photo', sizes: '100vw' })}
      <span class="reflets" data-effet="reflets" aria-hidden="true"><img src="/assets/images/grok/eau-lumiere-1280.webp" alt="" width="1280" height="854" loading="lazy" decoding="async"></span>
    </div>
  </div>
  <div class="ouv-saisons__texte">
    <p class="surtitre">${c.t('v4.surtitre')}</p>
    <h1 class="ouv-saisons__titre" data-grille="typo"><span class="ouv-saisons__ligne" data-ligne="hiver">${c.t('v4.titreHiver')}</span> <span class="ouv-saisons__ligne" data-ligne="ete">${c.t('v4.titreEte')}</span></h1>
    <p class="ouv-saisons__intro masque-ecran-tres-bas">${saison(c, 'intro')}</p>
    <div class="cadran-saison" data-effet="saison" data-grille="manipuler" role="group" aria-label="${c.s('v4.cadranTitre')}">
      <svg class="cadran-saison__arc" viewBox="0 0 240 132" aria-hidden="true" focusable="false">
        <defs><linearGradient id="cadran-degrade" x1="0" x2="1"><stop offset="0" stop-color="#d8622a"/><stop offset=".5" stop-color="#b8925a"/><stop offset="1" stop-color="#f2b33d"/></linearGradient></defs>
        <path d="M20 120 A100 100 0 0 1 220 120" fill="none" stroke="url(#cadran-degrade)" stroke-width="10" stroke-linecap="round"/>
        <path d="M20 120 A100 100 0 0 1 220 120" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="1" stroke-dasharray="2 9"/>
        <g class="cadran-saison__braise" transform="translate(20 120)"><path d="M0 -14 C 8 -6, 7 2, 0 6 C -7 2, -8 -6, 0 -14 Z" fill="#d8622a"/></g>
        <g class="cadran-saison__soleil" transform="translate(220 120)"><circle r="7" fill="#f2b33d"/><g stroke="#f2b33d" stroke-width="2" stroke-linecap="round"><path d="M0 -13v-4M0 13v4M-13 0h-4M13 0h4M9 -9l3 -3M-9 9l-3 3M9 9l3 3M-9 -9l-3 -3"/></g></g>
        <g class="cadran-saison__curseur" data-cadran-curseur><circle r="17" fill="#f3e7d3" stroke="#b8925a" stroke-width="3"/><circle class="cadran-saison__coeur" r="8"/></g>
      </svg>
      <p class="cadran-saison__boutons">
        <button type="button" data-saison-choix="hiver" aria-pressed="false">${c.t('v4.hiver')}</button>
        <span class="cadran-saison__indice" aria-hidden="true">${c.t('v4.cadranIndice')}</span>
        <button type="button" data-saison-choix="ete" aria-pressed="false">${c.t('v4.ete')}</button>
      </p>
    </div>
    <p class="ouv-saisons__actions">
      ${c.lien('reserver', { ancre: 'formulaire', classe: 'bouton', texte: brut(`<span data-saison-seul="hiver">${c.s('v4.reserverHiver')}</span><span data-saison-seul="ete">${c.s('v4.reserverEte')}</span>`), attrs: 'data-action-principale data-survol="magnetique"' })}
      ${c.lien('la-carte', { classe: 'bouton bouton--contour', texte: c.t('v4.voirCarte') })}
    </p>
    <p class="ouv-saisons__note" data-saison-seul="ete">${c.t('v4.noteEte')}</p>
    <p class="ouv-saisons__info" data-info-cle><a href="/infos-pratiques#horaires" class="ouv-saisons__statut" data-statut-accueil>${c.t('v4.horaires')}</a></p>
    <script type="application/json" data-horaires-accueil>${brut(JSON.stringify(c.donnees.horaires).replace(/<\//g, '<\\/'))}</script>
  </div>
</section>

<section class="plateau clair" id="plateau" data-lueur data-grille="fil">
  <div class="conteneur plateau__grille">
    <div class="plateau__texte">
      <p class="surtitre">${c.t('v4.carteSurtitre')}</p>
      <h2 data-anime="lignes">${c.t('v4.carteTitre')}</h2>
      <p data-anime>${c.t('v4.carteTexte')}</p>
      <ol class="plateau__rubriques" data-anime="cascade">
        ${rubriques.map((r, i) => html`<li class="plateau__rubrique" data-quart="${i}">
          <p class="plateau__rubrique-tete"><span class="plateau__rubrique-nom">${r.titre}</span><span class="plateau__fourchette" data-prix>${fourchette(r)}</span></p>
          <ul>${r.plats2.map((p) => html`<li><span>${p.nom}</span>${p.vegetarien ? html` <span class="plateau__vege">${c.t('accueil.plateau.vege')}</span>` : ''} <span class="plateau__prix" data-prix>${prix(p.prix)}</span></li>`)}</ul>
        </li>`)}
      </ol>
    </div>
    <div class="oat plateau__objet" data-module="objet-a-faire-tourner" role="img" aria-label="${c.s('accueil.plateau.region')}" data-effet="plateau" data-souris>
      <div class="oat__objet"><div class="plateau__disque">
        ${rubriques.map((r, i) => html`<div class="plateau__part" style="--q:${i}">${c.media({ nom: PHOTOS[r.id], alt: '', classe: 'plateau__photo', sizes: '(max-width: 760px) 40vw, 18vw' })}<span class="plateau__etiquette">${r.titre}</span></div>`)}
        <span class="plateau__centre" aria-hidden="true"><img src="/assets/images/logo-clair.png" alt="" width="64" height="64"></span>
      </div></div>
      <span class="oat__reflet" aria-hidden="true"></span>
      <p class="oat__indice" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M20 12a8 8 0 1 1-2.34-5.66" /><path d="M20 4v4h-4" /></svg>${c.t('accueil.plateau.indice')}</p>
    </div>
  </div>
</section>

<section class="table-dressee" id="table" data-lueur>
  <div class="assiette table" data-module="assiette-qui-se-dresse" data-epingle data-scene data-grille="scene" data-effet="table" aria-labelledby="table-titre">
    <div class="assiette__cadre socle-cadre">
      <div class="assiette__texte" data-tient>
        <p class="socle-surtitre">${c.t('v4.tableSurtitre')}</p>
        <h2 class="assiette__titre" id="table-titre">${c.t('v4.tableTitre')}</h2>
        <p class="assiette__intro masque-ecran-bas">${c.t('v4.tableIntro')}</p>
      </div>
      <div class="table__lieu" data-tient>
        <div class="assiette__scene table__nappe" role="img" aria-label="${c.s('v4.tableScene')}">
          ${c.media({ nom: 'grok/nappe-lin', alt: '', classe: 'table__lin', sizes: '(max-width: 899px) 100vw, 50vw' })}
          ${table(c)}
        </div>
        <div class="assiette__element table__plongee" data-de=".7" data-a="1" data-effet="plongee" style="--hauteur:0">
          <div class="table__plongee-photo" data-saison-photo="hiver">${c.media({ nom: 'assiette-cepes', alt: '', classe: 'table__plongee-image', sizes: '(max-width: 899px) 100vw, 56vw' })}</div>
          <div class="table__plongee-photo" data-saison-photo="ete">${c.media({ nom: 'ete-plongee', alt: '', classe: 'table__plongee-image', sizes: '(max-width: 899px) 100vw, 56vw' })}</div>
          <div class="table__plongee-texte">
            <h3 id="plongee-titre">${saison(c, 'plongee')}</h3>
            <p data-prix>${c.t('v4.plongeeTexte')}</p>
            <p>${c.lien('la-carte', { classe: 'bouton', texte: c.t('v4.plongeeAction') })}</p>
          </div>
        </div>
      </div>
      <div class="assiette__suite" data-tient>
        <ol class="assiette__etapes">
          <li data-de="0"><div><strong>${c.t('v4.e1')}</strong><span>${c.t('v4.e1t')}</span></div></li>
          <li data-de=".16"><div><strong>${c.t('v4.e2')}</strong><span>${c.t('v4.e2t')}</span></div></li>
          <li data-de=".3"><div><strong>${c.t('v4.e3')}</strong><span>${c.t('v4.e3t')}</span></div></li>
          <li data-de=".46"><div><strong>${c.t('v4.e4')}</strong><span>${c.t('v4.e4t')}</span></div></li>
        </ol>
        <p class="table__mention">${c.t('v4.tableMention')}</p>
      </div>
    </div>
  </div>
</section>

<section class="rdv" id="rendez-vous" data-lueur aria-labelledby="rdv-titre">
  <div class="rdv__eau" data-saison-photo="ete">${c.media({ nom: 'grok/eau-reflets', alt: '', classe: 'rdv__eau-image', sizes: '100vw' })}</div>
  <canvas class="rdv__braises" width="480" height="320" aria-hidden="true" data-effet="braises" data-audit-ignorer></canvas>
  <div class="conteneur rdv__contenu">
    <p class="surtitre">${saison(c, 'rdvSurtitre')}</p>
    <h2 id="rdv-titre" data-anime="lignes">${saison(c, 'rdvTitre')}</h2>
    <div class="rdv__cartes" data-saison-seul="hiver">
      <article class="fete-carte" data-date="${f.noel.debut}">
        ${c.media({ nom: 'noel-carte', alt: '', classe: 'fete-carte__photo', sizes: '(max-width: 760px) 100vw, 22vw' })}
        <p class="fete-carte__quand">${c.t('accueil.fetes.noelQuand')}</p>
        <h3>${c.t('accueil.fetes.noel')}</h3>
        <p class="fete-carte__decompte" data-effet="decompte" data-cible="${f.noel.date}">${c.t('accueil.fetes.dans')} <strong data-jours>—</strong> ${c.t('accueil.fetes.jours')}</p>
        <p class="fete-carte__prix" data-prix>${c.t('accueil.fetes.noelPrix')}</p>
        ${c.lien('reserver', { ancre: 'formulaire', params: 'date=2026-12-25&service=midi', classe: 'bouton bouton--contour', texte: c.t('accueil.fetes.reserver') })}
      </article>
      <article class="fete-carte fete-carte--sylvestre" data-date="${f.sylvestre.debut}">
        ${c.media({ nom: 'sylvestre-coupe', alt: '', classe: 'fete-carte__photo', sizes: '(max-width: 760px) 100vw, 22vw' })}
        <p class="fete-carte__quand">${c.t('accueil.fetes.sylvestreQuand')}</p>
        <h3>${c.t('accueil.fetes.sylvestre')}</h3>
        <p class="fete-carte__decompte" data-effet="decompte" data-cible="${f.sylvestre.date}">${c.t('accueil.fetes.dans')} <strong data-jours>—</strong> ${c.t('accueil.fetes.jours')}</p>
        <p class="fete-carte__prix" data-prix>${c.t('accueil.fetes.sylvestrePrix')}</p>
        ${c.lien('reserver', { ancre: 'formulaire', params: 'date=2026-12-31&service=soir', classe: 'bouton bouton--contour', texte: c.t('accueil.fetes.reserver') })}
      </article>
    </div>
    <div class="rdv__cartes rdv__cartes--ete" data-saison-seul="ete">
      <article class="ete-carte">${c.media({ nom: 'ete-festives', alt: c.s('v4.festives'), classe: 'ete-carte__photo', sizes: '(max-width: 760px) 100vw, 30vw' })}<h3>${c.t('v4.festives')}</h3><p class="ete-carte__quand">${c.t('v4.festivesQuand')}</p><p>${c.t('v4.festivesTexte')}</p></article>
      <article class="ete-carte">${c.media({ nom: 'recevoir-piscine', alt: c.s('v4.piscine'), classe: 'ete-carte__photo', sizes: '(max-width: 760px) 100vw, 30vw' })}<h3>${c.t('v4.piscine')}</h3><p class="ete-carte__quand">${c.t('v4.piscineQuand')}</p><p>${c.t('v4.piscineTexte')}</p></article>
      <article class="ete-carte">${c.media({ nom: 'ete-bar', alt: c.s('v4.bar'), classe: 'ete-carte__photo', sizes: '(max-width: 760px) 100vw, 30vw' })}<h3>${c.t('v4.bar')}</h3><p class="ete-carte__quand">${c.t('v4.barQuand')}</p><p>${c.t('v4.barTexte')}</p></article>
      <article class="ete-carte">${c.media({ nom: 'ete-poolparty', alt: c.s('v4.poolParties'), classe: 'ete-carte__photo', sizes: '(max-width: 760px) 100vw, 30vw' })}<h3>${c.t('v4.poolParties')}</h3><p class="ete-carte__quand">${c.t('v4.poolPartiesQuand')}</p><p>${c.t('v4.poolPartiesTexte')}</p></article>
    </div>
    <p class="rdv__actions"><span data-saison-seul="hiver">${c.lien('les-fetes', { classe: 'bouton', texte: c.t('accueil.fetes.voir') })}</span><span data-saison-seul="ete">${c.lien('reserver', { ancre: 'formulaire', classe: 'bouton', texte: c.t('v4.eteAction') })}</span></p>
  </div>
</section>

<section class="recevoir clair" id="recevoir" data-lueur aria-labelledby="recevoir-titre">
  <div class="conteneur recevoir__grille" data-effet="table-agrandit">
    <div class="recevoir__texte">
      <p class="surtitre">${c.t('v4.recevoirSurtitre')}</p>
      <h2 id="recevoir-titre" data-anime="lignes">${c.t('v4.recevoirTitre')}</h2>
      <p>${c.t('v4.recevoirTexte')}</p>
      <label class="recevoir__curseur"><span class="recevoir__nombre"><output data-invites>40</output> ${c.t('v4.recevoirInvites')}</span>
        <input type="range" min="0" max="3" step="1" value="2" data-paliers="${PALIERS.map((p) => p[0]).join(',')}" aria-label="${c.s('v4.recevoirCurseur')}" aria-valuetext="40 ${c.s('v4.recevoirInvites')}"></label>
      <p class="recevoir__paliers">${PALIERS.map(([n], i) => html`<button type="button" data-palier="${i}" aria-pressed="${i === 2 ? 'true' : 'false'}">${n}</button>`)}</p>
      <p class="recevoir__espace" aria-live="polite">${PALIERS.map(([n, , cle], i) => html`<span data-espace="${i}"${i === 2 ? '' : brut(' hidden')}>${c.t(`v4.${cle}`)}</span>`)}</p>
      <p class="recevoir__note">${c.t('v4.recevoirNote')}</p>
      <p><a class="bouton" href="${c.url('infos-pratiques', 'ecrire', 'sujet=reception&invites=40')}" data-lien-reception>${c.t('v4.recevoirAction')}</a></p>
    </div>
    <div class="recevoir__scene">
      <svg class="recevoir__table" viewBox="0 0 600 220" aria-hidden="true" focusable="false"><rect class="recevoir__plateau" x="60" y="80" width="480" height="60" rx="30"/><g class="recevoir__chaises" data-chaises></g></svg>
      <ul class="recevoir__photos" data-galerie>
        ${PALIERS.map(([n, img], i) => html`<li data-photo="${i}"${i === 2 ? brut(' class="est-choisie"') : ''}>${c.media({ nom: img, alt: c.s(`v4.espace${n}`), classe: 'recevoir__photo', sizes: '(max-width: 760px) 50vw, 30vw' })}</li>`)}
      </ul>
    </div>
  </div>
</section>

<section class="offrir-venir" id="offrir" data-lueur aria-labelledby="offrir-titre">
  <div class="offrir-venir__fond" data-saison-photo="hiver">${c.media({ nom: 'cheminee', alt: '', cadrage: '40% 50%', classe: 'offrir-venir__image', sizes: '100vw' })}</div>
  <div class="offrir-venir__fond" data-saison-photo="ete">${c.media({ nom: 'ete-soir', alt: '', classe: 'offrir-venir__image', sizes: '100vw' })}</div>
  <div class="conteneur offrir-venir__grille">
    <div class="offrir-venir__offrir">
      <p class="surtitre">${c.t('v4.offrirSurtitre')}</p>
      <h2 id="offrir-titre" data-anime="lignes">${c.t('v4.offrirTitre')}</h2>
      <div class="mini-carte" aria-hidden="true" data-survol="incline" data-visuel><span class="mini-carte__mono"><img src="/assets/images/logo-clair.png" alt="" width="40" height="40"></span><span class="mini-carte__type">${c.t('v4.carte')}</span><span class="mini-carte__montant">50 €</span></div>
      <p data-prix>${c.t('v4.offrirTexte')}</p>
      <p>${c.lien('offrir', { classe: 'bouton', texte: c.t('v4.offrirAction') })}</p>
    </div>
    <div class="offrir-venir__venir" id="venir">
      <p class="surtitre">${c.t('v4.venirSurtitre')}</p>
      <h2 data-anime="lignes">${c.t('v4.venirTitre')}</h2>
      <p>${c.t('v4.venirTexte')}</p>
      <svg class="venir__carte" viewBox="0 0 420 320" role="img" aria-label="${c.s('v4.carteAcces')}" data-fx="trace" data-visuel>
        ${VILLES.map((v) => brut(`<path data-fx-trait d="M${MOINEVILLE.x} ${MOINEVILLE.y} Q ${(MOINEVILLE.x + v.x) / 2} ${(MOINEVILLE.y + v.y) / 2 - 30} ${v.x} ${v.y}" fill="none" stroke="currentColor" stroke-width="2" opacity=".55"/>`))}
        ${VILLES.map((v) => brut(`<g class="venir__ville"><circle cx="${v.x}" cy="${v.y}" r="5"/><text x="${v.x - 10}" y="${v.y + 5}" text-anchor="end">${v.nom}</text></g>`))}
        ${brut(`<g class="venir__ici" data-repere><circle cx="${MOINEVILLE.x}" cy="${MOINEVILLE.y}" r="14"/><circle cx="${MOINEVILLE.x}" cy="${MOINEVILLE.y}" r="5"/><text x="${MOINEVILLE.x - 20}" y="${MOINEVILLE.y + 40}">Moineville</text></g>`)}
      </svg>
      <p class="venir__adresse">${c.site.contact.adresse}<br><a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a></p>
      <p class="venir__actions">${c.lien('infos-pratiques', { classe: 'bouton bouton--contour', texte: c.t('v4.venirInfos') })} <a class="bouton bouton--contour" href="https://www.google.com/maps/search/?api=1&amp;query=6+Vathier+Haye+54580+Moineville" target="_blank" rel="noopener">${brut(c.s('v4.itineraire').replace(' (nouvel onglet)', '<span class="visuellement-cache"> (nouvel onglet)</span>'))}</a></p>
    </div>
  </div>
</section>
`;
};
