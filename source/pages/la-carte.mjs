/* La carte · « la carte se met à l'heure » (v7) : la page s'ouvre au déjeuner ou au dîner selon l'heure réelle à Moineville
   (html[data-moment], posé avant le premier affichage). L'ouverture est une scène à elle : l'ardoise de la semaine, écrite à
   la craie (module ardoise-a-la-craie) ; la bascule midi/soir efface l'ardoise au chiffon et la réécrit, et rallume la page.
   Puis la carte complète (module carte-du-restaurant, rendu ici depuis donnees/carte.json), la passe où une vraie
   assiette du chef se dresse au défilement (module assiette-qui-se-dresse, couches tirées de la photo du site). v7.5.15 :
   l'ancienne fin « Une table vous attend » est retirée, l'invitation du pied de page la remplace (plus de doublon). */
import { html, brut, fragment, texteBrut } from '../../outils/gabarit.mjs';
import { rendreCarte } from '../../assets/js/modules/carte-du-restaurant/carte-rendu.js';

export const page = { cle: 'la-carte', fichier: 'la-carte', theme: 'jour', themeAuto: true, imagePartage: 'grok/assiette-midi-640.webp', modules: ['ardoise-a-la-craie', 'carte-du-restaurant', 'assiette-qui-se-dresse'] };

/* La passe : la vraie photo d'une assiette du chef, découpée en couches (chacune posée au défilement sur la même
   assiette encore dans l’ombre, nette (v7.5.15 : plus de flou), puis la photo en pleine lumière) ; positions en % de la photo. */
const COUCHES = [
  { nom: 'puree', de: 0, a: 0.18, ox: 33, oy: 69, h: 0.3 },
  { nom: 'viande', de: 0.18, a: 0.36, ox: 35, oy: 28, h: 0.7 },
  { nom: 'girolles', de: 0.36, a: 0.54, ox: 25, oy: 60, h: 0.6 },
  { nom: 'legumes', de: 0.54, a: 0.72, ox: 80, oy: 50, h: 0.6 },
  { nom: 'herbes', de: 0.72, a: 0.86, ox: 33, oy: 17, h: 0.5 },
  { nom: 'plat', de: 0.88, a: 0.98, ox: 50, oy: 50, h: 0 },
];
const TRAIT = '<svg class="ardoise__trait" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true"><path d="M4 16 C 90 6, 200 22, 396 10" pathLength="1" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';

/* v7.5.15 · « Toute la carte » : une grande photo fixée à gauche qui change à chaque rubrique (fondu et léger zoom), le numéro,
   le nom, la fourchette de prix et le nombre de plats posés dessus. Les petites photos des rubriques restent pour le téléphone. */
const VISUELS = {
  entrees: { nom: 'vraie/foie-gras-maison', cadrage: '50% 55%' },
  plats: { nom: 'carte-plats', cadrage: '50% 50%' },
  partager: { nom: 'carte-partager', cadrage: '50% 50%' },
  desserts: { nom: 'vraie/coupe-cheminee', cadrage: '45% 40%' },
};
function visuelCarte(c) {
  const rub = c.donnees.carte.rubriques.filter((r) => VISUELS[r.id]);
  const fourchette = (r) => { const v = r.plats.filter((x) => !/^menu/i.test(x.nom)).map((x) => x.prix).filter((x) => typeof x === 'number'); return v.length ? (Math.min(...v) === Math.max(...v) ? `${Math.min(...v)} €` : `de ${Math.min(...v)} à ${Math.max(...v)} €`) : ''; };
  return html`<aside class="carte-synchro__visuel" data-carte-visuel data-effet="carte-photo" aria-hidden="true">
    ${rub.map((r, i) => html`<div class="carte-synchro__img${i ? '' : ' est-active'}" data-carte-image="${r.id}" data-numero="${String(i + 1).padStart(2, '0')}" data-titre="${r.titre}" data-detail="${[fourchette(r), `${r.plats.length} ${r.plats.length > 1 ? 'propositions' : 'proposition'}`].filter(Boolean).join(' · ')}">${c.media({ nom: VISUELS[r.id].nom, alt: '', cadrage: VISUELS[r.id].cadrage, sizes: '(max-width: 1100px) 1px, 40vw' })}</div>`)}
    <p class="carte-synchro__badge"><span class="carte-synchro__num" data-carte-num>01</span><span class="carte-synchro__nom" data-carte-nom>${rub[0].titre}</span><span class="carte-synchro__detail" data-carte-detail></span></p>
  </aside>`;
}

export default (c) => {
  const carte = rendreCarte(c.donnees.carte).replace(/<figure class="carte-resto__photo">/g, '<figure class="carte-resto__photo" data-fx="vitesse" data-fx-force="3">')
    .replace('<div class="carte-resto__corps">', `<div class="carte-resto__corps carte-synchro">${texteBrut(visuelCarte(c))}`)
    /* La grande photo de gauche sert de visuel à toutes les rubriques sur grand écran (leurs petites photos restent au téléphone). */
    .replace(/<section class="carte-resto__rubrique"/g, '<section class="carte-resto__rubrique" data-sans-visuel');
  const a = c.donnees.ardoise, j = a.jour;
  const etapes = ['1', '2', '3', '4', '5'].map((n, i) => ({ de: [0, 0.18, 0.36, 0.54, 0.72][i], titre: c.s(`carte.etape${n}Titre`), texte: c.s(`carte.etape${n}Texte`) }));
  return html`
<section class="ouv-carte" id="debut" data-effet="moment" aria-labelledby="carte-h1">
  <div class="ouv-carte__grille">
    <div class="ouv-carte__texte">
      <p class="surtitre"><span data-moment-seul="jour">${c.t('carte.surJour')}</span><span data-moment-seul="soir">${c.t('carte.surSoir')}</span></p>
      <h1 id="carte-h1" data-anime="lettres" data-iris-centre>${c.t('carte.titre')}</h1>
      <p class="masque-ecran-tres-bas"><span data-moment-seul="jour">${c.t('carte.texteJour')}</span><span data-moment-seul="soir">${c.t('carte.texteSoir')}</span></p>
      <p class="ouv-carte__info" data-info-cle data-prix>${c.t('carte.info')}</p>
      <p class="ouv-carte__actions">
        <a class="bouton" href="${c.url('reserver', 'formulaire', 'service=midi')}" data-libelle="${c.libelle('reserver')}" data-action-principale data-moment-seul="jour">${c.t('carte.reserverJour')}</a>
        <a class="bouton" href="${c.url('reserver', 'formulaire', 'service=soir')}" data-libelle="${c.libelle('reserver')}" data-action-principale data-moment-seul="soir">${c.t('carte.reserverSoir')}</a>
        <button type="button" class="bouton bouton--contour bascule-moment" data-bascule-moment><span data-moment-seul="jour">${c.t('carte.basculeSoir')}</span><span data-moment-seul="soir">${c.t('carte.basculeJour')}</span></button>
      </p>
    </div>
    <div class="ouv-carte__mur" data-module="ardoise-a-la-craie">
      <div class="ardoise" data-grille="typo" data-visuel aria-live="polite">
        <div class="ardoise__surface">
          <p class="ardoise__date" data-ardoise-date="${a.date}"><span>${a.date}</span></p>
          <h2 class="ardoise__titre"><span>${j.titre}</span></h2>
          ${brut(TRAIT)}
          <ul class="ardoise__liste">
            ${j.lignes.map((l) => html`<li><span class="ardoise__plat">${l.plat}</span><span class="ardoise__prix" data-prix>${l.prix}</span></li>`)}
          </ul>
          <p class="ardoise__mot"><span>${j.mot}</span></p>
        </div>
      </div>
      <script type="application/json" data-ardoise>${brut(JSON.stringify(a).replace(/<\//g, '<\\/'))}</script>
      <p class="ouv-carte__lien"><a href="#toute-la-carte" data-sans-transition>${c.t('carte.versCarte')}</a></p>
      <script type="application/json" data-reservation-accueil>${brut(JSON.stringify(c.donnees.reservation).replace(/<\//g, '<\\/'))}</script>
      <script type="application/json" data-horaires-accueil>${brut(JSON.stringify(c.donnees.horaires).replace(/<\//g, '<\\/'))}</script>
    </div>
  </div>
</section>

<section class="carte-resto" id="toute-la-carte" data-module="carte-du-restaurant" aria-labelledby="carte-titre">
  <header class="carte-resto__tete socle-cadre">
    <p class="socle-surtitre">${c.t('carte.carteSur')}</p>
    <h2 id="carte-titre" data-anime="lignes">${c.t('carte.carteTitre')}</h2>
    <p>${c.t('carte.carteTexte')}</p>
  </header>
  <div class="carte-resto__carte socle-cadre" data-carte>
${fragment(carte)}
  </div>
</section>

<section class="assiette passe-chef" id="passe" data-module="assiette-qui-se-dresse" data-epingle data-grille="scene" aria-labelledby="passe-titre">
  <div class="assiette__cadre socle-cadre">
    <div class="assiette__texte" data-tient>
      <p class="socle-surtitre">${c.t('carte.passeSur')}</p>
      <h2 class="assiette__titre" id="passe-titre" data-anime="lignes">${c.t('carte.passeTitre')}</h2>
      <p class="assiette__intro">${c.t('carte.passeTexte')}</p>
    </div>
    <div class="assiette__scene passe__scene" data-tient role="img" aria-label="${c.s('carte.passeScene')}">
      <div class="assiette__plat passe__fond" aria-hidden="true"><img src="/assets/images/vraie/passe/ombre.webp" alt="" width="960" height="960" loading="lazy" decoding="async"></div>
      ${COUCHES.map((x) => html`<div class="assiette__element" data-de="${x.de}" data-a="${x.a}" style="--ox:${x.ox}%;--oy:${x.oy}%;--hauteur:${x.h}"><img src="/assets/images/vraie/passe/${x.nom}.webp" alt="" width="960" height="960" loading="lazy" decoding="async"></div>`)}
    </div>
    <ol class="assiette__etapes" data-tient>
      ${etapes.map((e) => html`<li data-de="${e.de}"><div><strong>${e.titre}</strong><span>${e.texte}</span></div></li>`)}
    </ol>
  </div>
</section>

`;
};
