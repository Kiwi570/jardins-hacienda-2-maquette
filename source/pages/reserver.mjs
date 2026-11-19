/* Réserver · « la page prend la lumière du service » : le formulaire d'abord (module reservation-de-table), la page
   claire pour un déjeuner, de nuit pour un dîner (html[data-service], au choix du service) ; l'heure géante suit.
   Ensuite, facultatif, le plan de la salle en 3D (module plan-de-salle) ; la table choisie revient au formulaire et
   son carton file jusqu'au récapitulatif ; à l'envoi, la carte de placement se pose sous la cloche (code gardé de la v5). */
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'reserver', fichier: 'reserver', theme: 'nuit', imagePartage: 'grok/terrasse-nuit-1280.webp', modules: ['plan-de-salle', 'reservation-de-table', 'envol-vers-le-panier'] };

const ETAPES = ['Quand', 'Combien', 'Où', 'Vous'];
const ICO_MIDI = '<svg viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.5M12 18.9v2.5M2.6 12h2.5M18.9 12h2.5M5.4 5.4l1.8 1.8M16.8 16.8l1.8 1.8M5.4 18.6l1.8-1.8M16.8 7.2l1.8-1.8"/></svg>';
const ICO_SOIR = '<svg viewBox="0 0 24 24" focusable="false"><path d="M19.4 14.7A7.9 7.9 0 1 1 9.3 4.6a6.3 6.3 0 0 0 10.1 10.1Z"/></svg>';
/* Photo d'une installation, dans la puce (contenu de phrase : une image seule, sans figure). */
const photoLieu = (nom, cadrage) => `<span class="resa__lieu-photo" aria-hidden="true"><img src="/assets/images/${nom}-640.webp" srcset="/assets/images/${nom}-640.webp 640w, /assets/images/${nom}-1280.webp 1280w" sizes="(max-width: 760px) 46vw, 240px" alt="" loading="lazy" decoding="async" style="object-position:${cadrage}"></span>`;

const DECOR = `<svg class="pds__svg" viewBox="0 0 1000 640" aria-hidden="true" focusable="false">
  <defs>
    <pattern id="pds-parquet" width="66" height="20" patternUnits="userSpaceOnUse"><rect class="pds__lame" width="66" height="20"/><path class="pds__joint" d="M0 19.5H66M24 0V20"/></pattern>
    <pattern id="pds-dalles" width="44" height="44" patternUnits="userSpaceOnUse"><rect class="pds__dalle" width="44" height="44"/><path class="pds__joint" d="M0 43.5H44M43.5 0V44"/></pattern>
    <radialGradient id="pds-braises" cx="0" cy=".5" r=".9"><stop offset="0" class="pds__lueur-a"/><stop offset="1" class="pds__lueur-b"/></radialGradient>
    <linearGradient id="pds-jour" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="pds__jour-a"/><stop offset="1" class="pds__jour-b"/></linearGradient>
  </defs>
  <rect width="1000" height="640" fill="url(#pds-dalles)"/>
  <rect class="pds__eau" x="926" y="40" width="54" height="560" rx="10"/>
  <g class="pds__plantes"><circle cx="740" cy="42" r="17"/><circle cx="902" cy="40" r="11"/><circle cx="740" cy="600" r="17"/><circle cx="902" cy="604" r="11"/><circle cx="740" cy="404" r="9"/></g>
  <rect x="20" y="20" width="680" height="600" fill="url(#pds-parquet)"/>
  <g class="pds__zones">
    <rect class="pds__zone" data-zone="cheminee" x="30" y="126" width="232" height="398" rx="18"/>
    <rect class="pds__zone" data-zone="fenetre" x="252" y="30" width="438" height="150" rx="18"/>
    <rect class="pds__zone" data-zone="grande-table" x="298" y="244" width="344" height="180" rx="18"/>
    <rect class="pds__zone" data-zone="terrasse" x="714" y="22" width="204" height="596" rx="18"/>
  </g>
  <path class="pds__lumiere" d="M262 24H688L650 212H300Z" fill="url(#pds-jour)"/>
  <ellipse cx="40" cy="330" rx="200" ry="160" fill="url(#pds-braises)"/>
  <g class="pds__cheminee"><rect x="20" y="270" width="42" height="120" rx="4"/><path class="pds__feu" d="M38 354C30 338 46 330 40 312C54 326 56 342 48 354ZM46 354C44 346 52 342 52 332C58 340 58 350 54 354Z"/></g>
  <g class="pds__bar"><rect x="36" y="568" width="224" height="36" rx="8"/><circle cx="66" cy="544" r="11"/><circle cx="116" cy="544" r="11"/><circle cx="166" cy="544" r="11"/><circle cx="216" cy="544" r="11"/></g>
  <path class="pds__mur" d="M420 620H20V20H700V226M700 434V620H520"/>
  <path class="pds__vitre" d="M262 20H684M700 232V428"/>
  <g class="pds__etiquettes">
    <text x="44" y="144">AU COIN DU FEU</text>
    <text x="470" y="200" text-anchor="middle">LES BAIES VITRÉES</text>
    <text x="470" y="414" text-anchor="middle">LA GRANDE TABLE</text>
    <text x="816" y="590" text-anchor="middle">TERRASSE</text>
    <text x="148" y="526" text-anchor="middle">BAR</text>
    <text x="470" y="606" text-anchor="middle">ENTRÉE</text>
  </g>
</svg>`;

export default (c) => {
  const s = c.donnees.salle;
  /* v7.8.1 : les places de chaque table du plan, pour retirer une table souhaitée devenue trop petite. */
  const reglages = JSON.stringify({ ...c.donnees.reservation, tables: Object.fromEntries(c.donnees.salle.tables.map((t) => [t.id, t.places])) }).replace(/</g, '\\u003c');
  const R = c.donnees.reservation.services, h = (t) => { const [a, m] = t.split(':').map(Number); return `${a}\u00a0h${m ? '\u00a0' + String(m).padStart(2, '0') : ''}`; };
  const plage = (sv) => `${h(R[sv].debut)} – ${h(R[sv].fin)}`;
  const lien = (t) => c.url('reserver', 'formulaire', `table=${t.id}&couverts=${t.places}&espace=${t.zone === 'terrasse' ? 'terrasse' : 'salle'}`);
  return html`
<section class="ouv-resa" id="debut" data-effet="service">
  <div class="ouv-resa__photo">
    ${c.media({ nom: 'vraie/salle-baies', alt: c.s('reserver.altMidi'), cadrage: '50% 50%', classe: 'ouv-resa__img ouv-resa__img--midi', sizes: '(max-width: 760px) 40vw, 30vw', attrs: 'data-fx="parallaxe" data-fx-force="6"' })}
    ${c.media({ nom: 'grok/assiette-soir', alt: c.s('reserver.altSoir'), cadrage: '50% 50%', priorite: true, classe: 'ouv-resa__img ouv-resa__img--soir', sizes: '(max-width: 760px) 40vw, 30vw', attrs: 'data-fx="parallaxe" data-fx-force="6"' })}
  </div>
  <div class="ouv-resa__texte">
    <p class="surtitre"><span class="ouv-resa__h-midi">${c.t('reserver.midi')}</span><span class="ouv-resa__h-soir">${c.t('reserver.soir')}</span></p>
    <h1 data-iris-centre>${c.t('reserver.titre')}</h1>
    <p class="masque-ecran-bas masque-petit">${c.t('reserver.texte')}</p>
    <p class="ouv-resa__actions"><a class="bouton" href="#formulaire" data-action-principale data-sans-transition>${c.t('reserver.action')}</a> <a class="bouton bouton--contour" href="#plan" data-sans-transition>${c.t('reserver.planLien')}</a> <a class="ouv-resa__tel" href="tel:${c.site.contact.telephoneLien}" data-info-cle>${c.t('reserver.info')}</a></p>
  </div>
</section>

<section class="resa" id="formulaire" data-module="reservation-de-table" data-grille="retour" data-voir-table="${c.s('reserver.voirTable')}" aria-labelledby="resa-titre">
  <script type="application/json" data-reservation>${brut(reglages)}</script>
  <noscript><style>.resa__jours{display:none}.resa__creneaux{min-height:0}.resa__compteur button{display:none}</style></noscript>
  <div class="resa__grille socle-cadre">
    <form class="resa__form" data-resa-form action="#" novalidate aria-labelledby="resa-titre">
      <header class="resa__tete">
        <p class="socle-surtitre">${c.t('reserver.formSur')}</p>
        <h2 id="resa-titre" data-anime="lignes">${c.t('reserver.formTitre')}</h2>
        <p class="resa__soiree" data-soiree hidden></p>
        <script type="application/json" data-agenda>${brut(JSON.stringify(c.donnees.agenda.dates.map((d) => ({ id: d.id, t: d.titre, d: d.debut, p: d.prix }))).replace(/<\//g, '<\\/'))}</script>
        <p class="resa__intro">${c.t('reserver.formTexte')}</p>
        <ol class="resa__progression" data-resa-progression hidden>
          ${ETAPES.map((e, k) => html`<li><button type="button" class="resa__pas" data-aller-etape="${k + 1}"><span class="resa__pas-n" aria-hidden="true">${k + 1}</span><span class="resa__pas-t">${e}</span></button></li>`)}
        </ol>
      </header>
      <div class="resa__etape" data-etape="1" role="group" aria-label="Étape 1 sur 4 : quand">
      <fieldset class="resa__champ" data-champ="date">
        <legend>Quel jour&#8239;?</legend>
        <div class="resa__jours" data-resa-jours aria-label="Les sept prochains jours" hidden></div>
        <div class="resa__cal" id="resa-cal" data-resa-cal hidden></div>
        <label class="resa__date resa__date--jour"><span>Ou une autre date</span><input type="date" id="resa-date" name="date" required></label>
      </fieldset>
      <fieldset class="resa__champ" data-champ="service">
        <legend>Quel service&#8239;?</legend>
        <div class="resa__puces">
          <label class="resa__puce resa__puce--service"><input type="radio" name="service" value="midi"><i class="resa__ico" aria-hidden="true">${brut(ICO_MIDI)}</i><span>Midi</span><small class="resa__puce-h">${plage('midi')}</small><small data-note></small></label>
          <label class="resa__puce resa__puce--service"><input type="radio" name="service" value="soir" checked><i class="resa__ico" aria-hidden="true">${brut(ICO_SOIR)}</i><span>Soir</span><small class="resa__puce-h">${plage('soir')}</small><small data-note></small></label>
        </div>
      </fieldset>
      </div>
      <div class="resa__etape" data-etape="2" role="group" aria-label="Étape 2 sur 4 : combien, à quelle heure">
      <div class="resa__champ" data-champ="couverts">
        <label class="resa__libelle" for="resa-couverts">Combien de personnes&#8239;?</label>
        <div class="resa__couverts-scene">
          <div class="resa__table" data-resa-table aria-hidden="true"></div>
          <div class="resa__couverts-cote">
            <div class="resa__compteur">
              <button type="button" data-moins aria-label="Une personne de moins">−</button>
              <input type="number" id="resa-couverts" name="couverts" min="1" max="10" value="2" inputmode="numeric">
              <button type="button" data-plus aria-label="Une personne de plus">+</button>
            </div>
            <p class="resa__couverts-mot" data-resa-couverts-mot hidden></p>
          </div>
        </div>
        <p class="resa__aide" data-resa-groupe hidden>Au-delà de 10 personnes, ${c.lien('receptions', { ancre: 'demande', texte: 'demandez une réception' })} ou appelez-nous au <a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a>.</p>
      </div>
      <fieldset class="resa__champ" data-champ="heure">
        <legend>À quelle heure&#8239;?</legend>
        <div class="resa__creneaux" data-resa-creneaux>
          <label class="resa__date"><span>Heure d'arrivée</span><select name="heure" id="resa-heure"><option value="">Choisir</option><optgroup label="Midi"><option value="12:00">12 h</option><option value="12:15">12 h 15</option><option value="12:30">12 h 30</option><option value="12:45">12 h 45</option><option value="13:00">13 h</option><option value="13:15">13 h 15</option><option value="13:30">13 h 30</option></optgroup><optgroup label="Soir"><option value="19:00">19 h</option><option value="19:15">19 h 15</option><option value="19:30">19 h 30</option><option value="19:45">19 h 45</option><option value="20:00">20 h</option><option value="20:15">20 h 15</option><option value="20:30">20 h 30</option><option value="20:45">20 h 45</option><option value="21:00">21 h</option><option value="21:15">21 h 15</option><option value="21:30">21 h 30</option></optgroup></select></label>
        </div>
        <p class="resa__aide" data-resa-creneaux-aide aria-live="polite"></p>
      </fieldset>
      </div>
      <div class="resa__etape" data-etape="3" role="group" aria-label="Étape 3 sur 4 : où">
      <fieldset class="resa__champ" data-champ="espace">
        <legend>Où souhaitez-vous vous installer&#8239;?</legend>
        <div class="resa__puces resa__puces--lieux">
          <label class="resa__puce resa__puce--lieu"><input type="radio" name="espace" value="salle" checked>${brut(photoLieu('vraie/salle-pierre', '50% 62%'))}<span>En salle</span><small data-note></small></label>
          <label class="resa__puce resa__puce--lieu"><input type="radio" name="espace" value="terrasse">${brut(photoLieu('vraie/piscine-pergola', '50% 60%'))}<span>En terrasse</span><small data-note></small></label>
        </div>
        <p class="resa__vers-plan"><span data-resa-table-choisie hidden></span> <a href="#plan" data-sans-transition>${c.t('reserver.versPlan')}</a></p>
      </fieldset>
      <details class="resa__plus">
      <summary>Une demande particulière&#8239;? <span class="resa__facultatif">(facultatif)</span></summary>
      <fieldset class="resa__champ" data-champ="demande">
        <legend class="sr-only">Une demande particulière</legend>
        <div class="resa__puces resa__puces--demandes">
          <label class="resa__puce"><input type="checkbox" name="demande" value="Une occasion à fêter"><span>Une occasion à fêter</span></label>
          <label class="resa__puce"><input type="checkbox" name="demande" value="Chaise haute"><span>Chaise haute</span></label>
          <label class="resa__puce"><input type="checkbox" name="demande" value="Allergie ou régime"><span>Allergie ou régime</span></label>
        </div>
        <label class="resa__date resa__date--large"><span>Précisez si besoin</span><textarea name="message" id="resa-message" rows="3"></textarea></label>
      </fieldset>
      </details>
      </div>
      <div class="resa__etape" data-etape="4" role="group" aria-label="Étape 4 sur 4 : vous">
      <fieldset class="resa__champ" data-champ="contact">
        <legend>Vos coordonnées</legend>
        <div class="resa__contact">
          <label class="resa__champ"><span>Prénom</span><input type="text" id="resa-prenom" name="prenom" autocomplete="given-name" required></label>
          <label class="resa__champ"><span>Nom</span><input type="text" id="resa-nom" name="nom" autocomplete="family-name" required></label>
          <label class="resa__champ"><span>Téléphone</span><input type="tel" id="resa-telephone" name="telephone" autocomplete="tel" required></label>
          <label class="resa__champ"><span>E-mail <span class="resa__facultatif">(facultatif)</span></span><input type="email" id="resa-email" name="email" autocomplete="email"></label>
        </div>
      </fieldset>
      <p class="resa__mention">Vos coordonnées servent seulement à confirmer la réservation. Disponibilités simulées pour la maquette.</p>
      </div>
      <div class="resa__nav" data-resa-nav>
        <button type="button" class="resa__retour" data-etape-retour hidden>Retour</button>
        <button type="button" class="resa__bouton resa__suivant" data-etape-suivante hidden>Continuer</button>
        <button type="submit" class="resa__bouton resa__envoi">Vérifier ma réservation</button>
      </div>
    </form>
    <aside class="resa__recap" data-resa-recap data-visuel aria-label="Récapitulatif de la réservation"></aside>
  </div>
</section>

<section class="pds" id="plan" data-module="plan-de-salle" data-reservation="${c.url('reserver', 'formulaire')}" data-effet="plan-3d" aria-labelledby="pds-titre">
  <div class="pds__grille socle-cadre">
    <div class="pds__tete">
      <p class="socle-surtitre">${c.t('reserver.planSur')}</p>
      <h2 id="pds-titre" data-anime="lignes">${c.t('reserver.planTitre')}</h2>
      <p>${c.t('reserver.planTexte')}</p>
      ${c.media({ nom: 'vraie/salle-soleil', alt: c.s('reserver.planPhotoAlt'), classe: 'pds__photo', sizes: '(max-width: 760px) 92vw, 40vw' })}
    </div>
    <div class="pds__outils">
      <div class="pds__filtres" role="group" aria-label="Zones de la salle" data-pds-filtres></div>
      <div class="pds__couverts">
        <label class="pds__libelle" for="pds-couverts">Couverts</label>
        <div class="pds__qte">
          <button type="button" data-pds-moins aria-label="Un couvert de moins" aria-controls="pds-couverts">−</button>
          <input type="number" id="pds-couverts" value="2" min="1" max="10" step="1" inputmode="numeric">
          <button type="button" data-pds-plus aria-label="Un couvert de plus" aria-controls="pds-couverts">+</button>
        </div>
      </div>
    </div>
    <div class="pds__scene" data-visuel><div class="pds__plan"><div class="pds__sol">${brut(DECOR)}</div></div></div>
    <div class="pds__panneau">
      <ul class="pds__liste">
        ${s.tables.map((t) => brut(`<li class="pds__item" data-table="${t.id}" data-zone="${t.zone}" data-places="${t.places}" data-forme="${t.forme}" data-x="${t.x}" data-y="${t.y}" data-l="${t.l}"${t.h ? ` data-h="${t.h}"` : ''}${t.prise ? ' data-prise' : ''}>`
          + (t.prise ? '<span class="pds__lien">' : `<a class="pds__lien" href="${lien(t).replace(/&/g, '&amp;')}">`)
          + `<span class="pds__num">${t.id}</span><span class="pds__texte"><span class="pds__nom">Table ${t.id}</span><span class="pds__info"><span class="pds__zone-nom">${s.zones[t.zone]}</span> · ${t.places}&nbsp;places</span>`
          + (t.prise ? `<span class="pds__etat">${t.prise}</span>` : t.note ? `<span class="pds__note">${t.note}</span>` : '')
          + `</span>${t.prise ? '</span>' : '</a>'}</li>`))}
      </ul>
      <div class="pds__action">
        <p class="pds__choix" aria-live="polite" data-pds-choix>Choisissez une table libre sur le plan ou dans la liste.</p>
        <a class="socle-bouton socle-bouton--plein pds__reserver" href="${c.url('reserver', 'formulaire')}" data-pds-reserver aria-disabled="true">Choisir cette table</a>
      </div>
    </div>
  </div>
</section>
`;
};
