/* Infos pratiques · « l'heure qu'il est à Moineville » : l'heure réelle en chiffres géants, le vrai ciel de Moineville à
   cette heure (soleil, lune, étoiles calculés : module ciel-en-direct) au-dessus de la vraie enseigne détourée ; le statut
   ouvert ou fermé et le téléphone ; puis le cadran des horaires (module horaires-ouvert-maintenant, horaires RankEat à
   confirmer), le plan d'accès (coordonnées réelles, Moselle, A31, distances à vol d'oiseau), les règles de l'été, et
   « Une question » en quatre étapes (module formulaire-par-etapes ; les réceptions ont leur page). */
import { html, brut, fragment } from '../../outils/gabarit.mjs';
import { preparer, rendreBloc } from '../../assets/js/modules/horaires-ouvert-maintenant/horaires-calcul.js';

export const page = { cle: 'infos-pratiques', fichier: 'infos-pratiques', theme: 'jour', themeAuto: true, imagePartage: 'vraie/enseigne-1280.webp', modules: ['ciel-en-direct', 'horaires-ouvert-maintenant', 'formulaire-par-etapes'] };

/* Une question : les sujets en grandes cartes (une icône par carte, sinon le texte se chevauche sur téléphone). */
const ICONE = (d) => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const SUJETS = [
  { v: 'table', c: 'Table', icone: ICONE('<circle cx="12" cy="12" r="7"/><path d="M3 4v6M5 4v6M3 7h2M4 10v10M20 4c-1.5 1-2 3-2 6h2v10"/>') },
  { v: 'reception', c: 'Reception', icone: ICONE('<path d="M8 3h8l-1 7a3 3 0 0 1-6 0Z"/><path d="M12 13v6M8 21h8"/>') },
  { v: 'carte-cadeau', c: 'Cadeau', icone: ICONE('<rect x="3" y="8" width="18" height="13" rx="1.5"/><path d="M3 12h18M12 8v13M12 8c-2-4-6-4-6-1s6 1 6 1Zm0 0c2-4 6-4 6-1s-6 1-6 1Z"/>') },
  { v: 'autre', c: 'Autre', icone: ICONE('<path d="M4 5h16v11H9l-5 4Z"/><path d="M8 9h8M8 12h5"/>') },
];

/* Le plan d'accès : coordonnées réelles projetées (1 km = 6 unités ; x = (lon − 5,70) × 434, y = (49,72 − lat) × 666). */
const P = (lat, lon) => [Math.round((lon - 5.70) * 434), Math.round((49.72 - lat) * 666)];
const chemin = (pts) => 'M' + pts.map(([la, lo]) => P(la, lo).join(' ')).join(' L ');
function carteAcces(c) {
  const ici = P(49.204, 5.946);
  const villes = [
    { nom: 'Luxembourg', p: P(49.6116, 6.1319), km: 47, dx: 10, dy: -6 },
    { nom: 'Thionville', p: P(49.3579, 6.1683), km: 24, dx: 10, dy: 4 },
    { nom: 'Metz', p: P(49.1193, 6.1757), km: 19, dx: 10, dy: 4 },
  ];
  const moselle = chemin([[49.05, 6.10], [49.1193, 6.185], [49.20, 6.175], [49.25, 6.178], [49.3579, 6.176], [49.41, 6.25], [49.44, 6.36], [49.47, 6.37], [49.60, 6.42], [49.70, 6.45]]);
  const a31 = chemin([[49.07, 6.17], [49.1193, 6.16], [49.25, 6.15], [49.36, 6.14], [49.47, 6.12], [49.55, 6.13], [49.6116, 6.1319]]);
  const frontiere = chemin([[49.56, 5.70], [49.52, 5.80], [49.48, 5.95], [49.465, 6.06], [49.462, 6.13], [49.49, 6.25], [49.47, 6.37]]);
  const traits = villes.map((v) => { const mx = (ici[0] + v.p[0]) / 2, my = (ici[1] + v.p[1]) / 2; return `<path class="carte__vol" d="M${ici.join(' ')} L ${v.p.join(' ')}" fill="none"/><text class="carte__km" x="${mx - 6}" y="${my - 5}" text-anchor="end">${v.km} km</text>`; }).join('');
  return `<svg class="acces__carte" viewBox="0 0 340 460" role="img" aria-label="${c.s('infos.carteAlt')}" data-fx="trace">
  <path class="carte__frontiere" d="${frontiere}" fill="none"/>
  <text class="carte__pays" x="10" y="56">LUXEMBOURG</text><text class="carte__pays" x="10" y="300">FRANCE</text><text class="carte__pays" x="246" y="36">ALLEM.</text>
  <path class="carte__moselle" d="${moselle}" fill="none"/><text class="carte__eau" x="${P(49.25, 6.2)[0] + 8}" y="${P(49.25, 6.2)[1]}">Moselle</text>
  <path class="carte__route" d="${a31}" fill="none"/><text class="carte__a31" x="${P(49.30, 6.14)[0] - 8}" y="${P(49.30, 6.14)[1]}" text-anchor="end">A31</text>
  ${traits}
  ${villes.map((v) => `<circle class="carte__ville" cx="${v.p[0]}" cy="${v.p[1]}" r="4.5"/><text class="carte__nom" x="${v.p[0] + v.dx}" y="${v.p[1] + v.dy}">${v.nom}</text>`).join('')}
  <circle class="carte__ici" cx="${ici[0]}" cy="${ici[1]}" r="8"/><text class="carte__ici-nom" x="${ici[0] - 12}" y="${ici[1] + 4}" text-anchor="end">Moineville</text>
  <text class="carte__note" x="8" y="452">${c.s('infos.carteNote')}</text>
</svg>`;
}

export default (c) => {
  const h = c.donnees.horaires;
  const d = preparer(h);
  const json = JSON.stringify(h).replace(/<\//g, '<\\/');
  return html`
<section class="ouv-infos ced" id="debut" data-effet="heure-reelle" data-module="ciel-en-direct" aria-labelledby="infos-h1">
  <div class="ced__ciel" aria-hidden="true"><canvas class="ced__toile" data-audit-ignorer></canvas></div>
  ${c.media({ nom: 'vraie/enseigne-premier-plan', alt: c.s('infos.altEnseigne'), cadrage: '50% 100%', cadrageMobile: '50% 100%', priorite: true, classe: 'ouv-infos__enseigne', sizes: '100vw' })}
  <div class="ced__cadre conteneur">
    <div class="ced__texte ouv-infos__contenu">
      <p class="surtitre">${c.t('infos.sur')}</p>
      <h1 id="infos-h1" data-iris-centre>${c.t('infos.titre')}</h1>
      <p class="statut ouv-infos__statut"><span class="statut__point" aria-hidden="true"></span><span data-statut-accueil>${c.t('infos.horairesSur')}</span></p>
      <script type="application/json" data-horaires-accueil>${brut(json)}</script>
      <p class="ouv-infos__adresse" data-info-cle>${c.site.contact.adresse}<br><span class="ouv-infos__distances">${c.t('infos.distances')}</span></p>
      <p class="ouv-infos__actions"><a class="bouton" href="tel:${c.site.contact.telephoneLien}" data-action-principale>${c.t('commun.appeler')} ${c.site.contact.telephone}</a> <a class="bouton bouton--contour" href="#ecrire" data-sans-transition>${c.t('infos.questionLien')}</a> <a class="lien-fleche" href="#acces" data-sans-transition>${c.t('infos.accesLien')}</a></p>
    </div>
    <div class="ced__carte" role="group" aria-labelledby="ced-carte-titre">
      <p class="ced__carte-haut"><span id="ced-carte-titre">${c.t('infos.cielTitre')}</span><span data-ced-phase></span></p>
      <p class="ced__heure"><span data-ced-heure>--:--</span><em class="ced__drapeau" data-ced-drapeau hidden>${c.t('infos.cielChoisie')}</em></p>
      <p class="ced__soleil"><span>${c.t('infos.cielLever')} <b data-ced-lever></b></span><span>${c.t('infos.cielCoucher')} <b data-ced-coucher></b></span></p>
      <div class="ced__reglage">
        <label for="ced-curseur">${c.t('infos.cielCurseur')}</label>
        <input class="ced__curseur" id="ced-curseur" type="range" min="0" max="1435" step="5" data-ced-curseur>
        <div class="ced__raccourcis" role="group" aria-label="${c.s('infos.cielMoments')}">
          <button type="button" data-ced-moment="midi">${c.t('infos.cielMidi')}</button>
          <button type="button" data-ced-moment="crepuscule">${c.t('infos.cielCrepuscule')}</button>
          <button type="button" data-ced-moment="nuit">${c.t('infos.cielNuit')}</button>
          <button type="button" data-ced-maintenant aria-pressed="true">${c.t('infos.cielMaintenant')}</button>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="horaires socle-cadre" id="horaires" data-module="horaires-ouvert-maintenant" aria-labelledby="horaires-titre">
  <div class="horaires__grille">
    <div class="horaires__cadran" aria-hidden="true" data-effet="cadran" data-visuel></div>
    <div class="horaires__texte">
      <p class="socle-surtitre">${c.t('infos.horairesSur')}</p>
      <h2 id="horaires-titre" data-anime="lignes">${c.t('infos.horairesTitre')}</h2>
      <div class="horaires__adresses" data-horaires-choix role="group" aria-label="Choisir une adresse" hidden></div>
      <p class="horaires__statut" data-horaires-statut><span class="horaires__pastille" aria-hidden="true"></span><span>Horaires de la semaine</span></p>
      <noscript><style>.horaires__cadran{display:none!important}.horaires__grille{grid-template-columns:minmax(0,1fr)!important}</style></noscript>
      <script type="application/json" data-horaires>${brut(json)}</script>
      <div class="horaires__texte-adresse" data-horaires-texte>${fragment(d.adresses.map((a) => rendreBloc(a, false)).join(''))}</div>
      <p class="horaires__note">${c.t('infos.horairesNote')}</p>
      ${c.media({ nom: 'vraie/piscine-paillotes', alt: c.s('infos.horairesPhotoAlt'), classe: 'horaires__photo', sizes: '(max-width: 760px) 92vw, 40vw', attrs: 'data-saison-seul="ete"' })}
      ${c.media({ nom: 'vraie/salle-soleil', alt: c.s('infos.horairesPhotoAltHiver'), cadrage: '46% 50%', classe: 'horaires__photo', sizes: '(max-width: 760px) 92vw, 40vw', attrs: 'data-saison-seul="hiver"' })}
    </div>
  </div>
</section>

<section class="acces" id="acces" aria-labelledby="acces-titre">
  <div class="conteneur acces__grille">
    <div>
      <p class="surtitre">${c.t('infos.accesSur')}</p>
      <h2 id="acces-titre" data-anime="lignes">${c.t('infos.accesTitre')}</h2>
      <p data-anime>${c.t('infos.accesTexte')}</p>
      ${brut(carteAcces(c))}
      <p><a class="bouton bouton--contour" href="https://www.google.com/maps/search/?api=1&amp;query=6+Vathier+Haye+54580+Moineville" target="_blank" rel="noopener">${brut(c.s('infos.itineraire').replace(' (nouvel onglet)', '<span class="visuellement-cache"> (nouvel onglet)</span> <span aria-hidden="true">↗</span>'))}</a></p>
    </div>
    <dl class="acces__regles" data-anime="cascade">
      <div><dt>${c.t('infos.festivesTitre')}</dt><dd>${c.t('infos.festivesTexte')}</dd></div>
      <div><dt>${c.t('infos.piscineTitre')}</dt><dd>${c.t('infos.piscineTexte')}</dd></div>
      <div><dt>${c.t('infos.barTitre')}</dt><dd>${c.t('infos.barTexte')}</dd></div>
    </dl>
  </div>
</section>

<section class="ecrire fpe" id="ecrire" data-module="formulaire-par-etapes" aria-labelledby="ecrire-titre">
  <div class="conteneur ecrire__grille">
    <div class="ecrire__intro">
      <p class="surtitre">${c.t('infos.ecrireSur')}</p>
      <h2 id="ecrire-titre" data-anime="lignes">${c.t('infos.ecrireTitre')}</h2>
      <p>${c.t('infos.ecrireTexte')} ${c.lien('receptions', { ancre: 'demande', classe: 'lien-fleche', texte: c.t('infos.receptions') })}</p>
      ${c.media({ nom: 'vraie/buffet-nuit', alt: c.s('infos.ecrirePhotoAlt'), cadrage: '40% 55%', classe: 'ecrire__photo', sizes: '(max-width: 760px) 100vw, 36vw', attrs: 'data-anime="rideau"' })}
    </div>
    <div class="fpe__carton">
      <form class="fpe__form" action="#ecrire" novalidate>
        <fieldset class="fpe__etape" data-etape="${c.s('infos.etapeSujet')}">
          <legend class="fpe__legende"><h3 class="fpe__titre">${c.t('infos.questionSujet')}</h3></legend>
          <div class="fpe__groupe fpe__cartes" data-libelle="${c.s('infos.etapeSujet')}">
            ${SUJETS.map((x) => html`<label class="fpe__carte"><input type="radio" name="sujet" value="${x.v}" required><span class="fpe__icone" aria-hidden="true">${brut(x.icone)}</span><span class="fpe__carte-titre">${c.t(`infos.sujet${x.c}`)}</span><span class="fpe__carte-texte">${c.t(`infos.sujet${x.c}X`)}</span></label>`)}
          </div>
        </fieldset>
        <fieldset class="fpe__etape" data-etape="${c.s('infos.etapeMessage')}">
          <legend class="fpe__legende"><h3 class="fpe__titre">${c.t('infos.questionMessage')}</h3></legend>
          <div class="fpe__champ"><label for="q-message">${c.t('infos.message')}</label><textarea id="q-message" name="message" rows="5" required minlength="10" data-libelle="${c.s('infos.message')}"></textarea></div>
          <div class="fpe__champ"><label for="q-date">${c.t('infos.dateFacultative')}</label><input id="q-date" type="date" name="date" data-libelle="${c.s('infos.dateFacultative')}"></div>
        </fieldset>
        <fieldset class="fpe__etape" data-etape="${c.s('infos.etapeCoordonnees')}">
          <legend class="fpe__legende"><h3 class="fpe__titre">${c.t('infos.questionCoordonnees')}</h3></legend>
          <div class="fpe__deux">
            <div class="fpe__champ"><label for="q-prenom">${c.t('infos.prenom')}</label><input id="q-prenom" type="text" name="prenom" autocomplete="given-name" required data-libelle="${c.s('infos.prenom')}"></div>
            <div class="fpe__champ"><label for="q-nom">${c.t('infos.nom')}</label><input id="q-nom" type="text" name="nom" autocomplete="family-name" required data-libelle="${c.s('infos.nom')}"></div>
          </div>
          <div class="fpe__champ"><label for="q-email">${c.t('infos.email')}</label><input id="q-email" type="email" name="email" autocomplete="email" required data-libelle="${c.s('infos.email')}"></div>
          <div class="fpe__champ"><label for="q-tel">${c.t('infos.telephoneFacultatif')}</label><input id="q-tel" type="tel" name="telephone" autocomplete="tel" data-libelle="${c.s('infos.telephone')}"></div>
          <label class="fpe__case"><input type="checkbox" name="accord" required data-hors-recap><span>${c.t('infos.rgpd')} ${c.t('commun.confidentialiteForm')}</span></label>
        </fieldset>
        <fieldset class="fpe__etape" data-etape="${c.s('infos.etapeRecap')}" data-recap>
          <legend class="fpe__legende"><h3 class="fpe__titre">${c.t('infos.questionRecap')}</h3></legend>
          <div class="fpe__recap"></div>
        </fieldset>
        <div class="fpe__nav"><button type="button" class="bouton bouton--contour" data-precedent>${c.t('infos.retour')}</button><button type="button" class="bouton" data-suivant>${c.t('infos.continuer')}</button><button type="submit" class="bouton">${c.t('infos.envoyer')}</button></div>
      </form>
      <div class="fpe__fin" hidden>
        <h3 tabindex="-1">${c.t('infos.merciTitre')}</h3>
        <p>${c.t('infos.envoye')}</p>
        <p data-resume></p>
        <p><button type="button" class="bouton bouton--contour" data-recommencer>${c.t('infos.nouvelle')}</button></p>
      </div>
    </div>
  </div>
</section>
`;
};
