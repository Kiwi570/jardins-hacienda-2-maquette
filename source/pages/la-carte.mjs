/* La carte · « la carte se met à l'heure » (v7) : la page s'ouvre au déjeuner ou au dîner selon l'heure réelle à Moineville
   (html[data-moment], posé avant le premier affichage). L'ouverture est une scène à elle : l'ardoise de la semaine, écrite à
   la craie (module ardoise-a-la-craie) ; la bascule midi/soir efface l'ardoise au chiffon et la réécrit, et rallume la page.
   Puis la carte complète (module carte-du-restaurant, rendu ici depuis donnees/carte.json), la passe où une vraie
   assiette du chef se dresse au défilement (module assiette-qui-se-dresse, couches tirées de la photo du site), la fin. */
import { html, brut, fragment } from '../../outils/gabarit.mjs';
import { rendreCarte } from '../../assets/js/modules/carte-du-restaurant/carte-rendu.js';

export const page = { cle: 'la-carte', fichier: 'la-carte', theme: 'jour', themeAuto: true, imagePartage: 'grok/assiette-midi-640.webp', modules: ['ardoise-a-la-craie', 'carte-du-restaurant', 'assiette-qui-se-dresse'] };

/* La passe : la vraie photo d'une assiette du chef, découpée en couches (chacune posée au défilement sur la même
   assiette, floue et dans l'ombre, puis la photo nette) ; positions en % de la photo (centre de chaque couche). */
const COUCHES = [
  { nom: 'puree', de: 0, a: 0.18, ox: 33, oy: 69, h: 0.3 },
  { nom: 'viande', de: 0.18, a: 0.36, ox: 35, oy: 28, h: 0.7 },
  { nom: 'girolles', de: 0.36, a: 0.54, ox: 25, oy: 60, h: 0.6 },
  { nom: 'legumes', de: 0.54, a: 0.72, ox: 80, oy: 50, h: 0.6 },
  { nom: 'herbes', de: 0.72, a: 0.86, ox: 33, oy: 17, h: 0.5 },
  { nom: 'plat', de: 0.88, a: 0.98, ox: 50, oy: 50, h: 0 },
];
const TRAIT = '<svg class="ardoise__trait" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true"><path d="M4 16 C 90 6, 200 22, 396 10" pathLength="1" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';

export default (c) => {
  const carte = rendreCarte(c.donnees.carte).replace(/<figure class="carte-resto__photo">/g, '<figure class="carte-resto__photo" data-fx="vitesse" data-fx-force="3">');
  const a = c.donnees.ardoise, j = a.jour;
  const etapes = ['1', '2', '3', '4', '5'].map((n, i) => ({ de: [0, 0.18, 0.36, 0.54, 0.72][i], titre: c.s(`carte.etape${n}Titre`), texte: c.s(`carte.etape${n}Texte`) }));
  return html`
<section class="ouv-carte" id="debut" data-effet="moment" aria-labelledby="carte-h1">
  <div class="ouv-carte__grille">
    <div class="ouv-carte__texte">
      <p class="heure-section ouv-carte__heure" data-iris-centre aria-hidden="true"><span data-moment-seul="jour">${c.s('carte.heureJour')}</span><span data-moment-seul="soir">${c.s('carte.heureSoir')}</span></p>
      <p class="surtitre"><span data-moment-seul="jour">${c.t('carte.surJour')}</span><span data-moment-seul="soir">${c.t('carte.surSoir')}</span></p>
      <h1 id="carte-h1" data-anime="lettres">${c.t('carte.titre')}</h1>
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
      <div class="assiette__plat passe__fond" aria-hidden="true"><img src="/assets/images/vraie/passe/vide.webp" alt="" width="960" height="960" loading="lazy" decoding="async"></div>
      ${COUCHES.map((x) => html`<div class="assiette__element" data-de="${x.de}" data-a="${x.a}" style="--ox:${x.ox}%;--oy:${x.oy}%;--hauteur:${x.h}"><img src="/assets/images/vraie/passe/${x.nom}.webp" alt="" width="960" height="960" loading="lazy" decoding="async"></div>`)}
    </div>
    <ol class="assiette__etapes" data-tient>
      ${etapes.map((e) => html`<li data-de="${e.de}"><div><strong>${e.titre}</strong><span>${e.texte}</span></div></li>`)}
    </ol>
  </div>
</section>

<section class="fin-carte" id="fin" aria-labelledby="fin-titre">
  ${c.media({ nom: 'vraie/cepes', alt: c.s('carte.finAlt'), cadrage: '47% 44%', classe: 'fin-carte__photo', sizes: '100vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
  <div class="conteneur fin-carte__texte">
    <h2 id="fin-titre" data-anime="lignes">${c.t('carte.finTitre')}</h2>
    <p data-anime>${c.t('carte.finTexte')}</p>
    <p class="statut"><span class="statut__point" aria-hidden="true"></span><a href="${c.url('infos-pratiques', 'horaires')}" data-libelle="${c.libelle('infos-pratiques')}" data-statut-accueil>${c.t('carte.horaires')}</a></p>
    <script type="application/json" data-reservation-accueil>${brut(JSON.stringify(c.donnees.reservation).replace(/<\//g, '<\\/'))}</script>
    <script type="application/json" data-horaires-accueil>${brut(JSON.stringify(c.donnees.horaires).replace(/<\//g, '<\\/'))}</script>
    <p class="fin-carte__actions">${c.lien('reserver', { ancre: 'formulaire', params: 'service=midi', classe: 'bouton', texte: c.t('carte.reserverJour'), attrs: 'data-moment-seul="jour"' })}${c.lien('reserver', { ancre: 'formulaire', params: 'service=soir', classe: 'bouton', texte: c.t('carte.reserverSoir'), attrs: 'data-moment-seul="soir"' })} <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a></p>
  </div>
</section>
`;
};
