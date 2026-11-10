/* Les fêtes : ouverture scindée sur fond vin nuit (les deux dates et leurs comptes à rebours, la salle de Noël dans
   une arche en forme de cloche), le menu de la Saint-Sylvestre en accords mets et vins (module accords-mets-et-vins),
   le menu de Noël, les soirées passées. Menus et prix d'après les affiches du site actuel. */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: 'les-fetes', fichier: 'les-fetes', imagePartage: 'fetes-ouverture-1280.webp', modules: ['accords-mets-et-vins'] };

export default (c) => {
  const f = c.donnees.fetes, a = c.donnees.accords;
  const TYPES = { 'vin-rouge': 'Vin rouge', 'vin-blanc': 'Vin blanc', petillant: 'Bulles' };
  return html`
<section class="ouv-fetes" data-lueur id="debut" data-fil="gauche" data-grille="fil">
  <div class="conteneur ouv-fetes__grille">
    <div class="ouv-fetes__texte">
      <p class="surtitre" data-anime>${c.t('fetes.surtitre')}</p>
      <h1 data-anime="lettres">${c.t('fetes.titre')}</h1>
      <p class="masque-ecran-tres-bas" data-anime>${c.t('fetes.texte')}</p>
      <ul class="ouv-fetes__dates" data-info-cle>
        <li><span class="ouv-fetes__jour">${f.noel.jour}</span><span>${f.noel.titre} · ${f.noel.moment.toLowerCase()}</span><span class="ouv-fetes__decompte" data-effet="decompte" data-cible="${f.noel.date}" data-passe="${c.s('fetes.passe')}" data-aujourdhui="${c.s('fetes.aujourdhui')}">${c.t('fetes.dans')} <strong data-jours>—</strong> ${c.t('fetes.jours')}</span></li>
        <li><span class="ouv-fetes__jour">${f.sylvestre.jour}</span><span>${f.sylvestre.titre} · ${f.sylvestre.moment.toLowerCase()}</span><span class="ouv-fetes__decompte" data-effet="decompte" data-cible="${f.sylvestre.date}" data-passe="${c.s('fetes.passe')}" data-aujourdhui="${c.s('fetes.aujourdhui')}">${c.t('fetes.dans')} <strong data-jours>—</strong> ${c.t('fetes.jours')}</span></li>
      </ul>
      <p class="ouv-fetes__actions">${c.lien('reserver', { params: 'date=2026-12-31&service=soir', classe: 'bouton', texte: c.t('fetes.reserverSoiree'), attrs: 'data-action-principale' })} ${c.lien('reserver', { params: 'date=2026-12-25&service=midi', classe: 'bouton bouton--contour', texte: c.t('fetes.reserverNoel') })}</p>
      <p class="ouv-fetes__reception"><a href="${c.url('infos-pratiques', 'ecrire', 'sujet=reception')}">${c.t('fetes.vosFetes')}</a></p>
    </div>
    ${c.media({ nom: 'fetes-ouverture', alt: c.s('fetes.alt'), cadrage: '53% 35%', priorite: true, classe: 'ouv-fetes__arche', sizes: '(max-width: 760px) 90vw, 40vw', attrs: 'data-iris-centre data-fx="zoom" data-fx-force="14"' })}
  </div>
</section>

<section class="ame sylvestre" data-lueur id="saint-sylvestre" data-module="accords-mets-et-vins" data-fil="droite" aria-labelledby="ame-titre">
  ${c.media({ nom: 'grok/fetes-bougies', alt: '', classe: 'sylvestre__fond', sizes: '100vw', attrs: 'data-fx="parallaxe"' })}
  <div class="ame__grille socle-cadre">
    <div class="ame__tete">
      <p class="socle-surtitre">${c.t('fetes.sylvestreSurtitre')}</p>
      <h2 id="ame-titre" class="sylvestre__titre" data-effet="plume" data-grille="typo">${c.t('fetes.sylvestreTitre')}</h2>
      <p>${c.t('fetes.sylvestreTexte')}</p>
      <p class="sylvestre__prix" data-prix><strong>${c.t('fetes.menuPrix')}</strong> · <strong>${c.t('fetes.accordPrix')}</strong></p>
      <p class="sylvestre__dj">${c.t('fetes.dj')} · ${c.t('fetes.horaires')}</p>
    </div>
    <ul class="ame__liste" data-choisi="${a.choisi}">
      ${a.plats.map((p) => html`<li class="ame__plat" data-plat="${p.id}" data-type="${p.accord.type}" data-couleur="${p.accord.couleur}"${p.accord.verre ? html` data-verre="${p.accord.verre}"` : ''} style="--c: ${p.accord.couleur}">
        <span class="ame__pastille" aria-hidden="true"></span>
        <p class="ame__moment">${p.moment}</p>
        <h3 class="ame__nom">${p.plat}</h3>
        <p class="ame__detail">${p.detail}</p>
        <p class="ame__accord"><span class="ame__type">${TYPES[p.accord.type]}</span> · <span class="ame__boisson">${p.accord.nom}</span> · <span class="ame__region">${p.accord.region}</span></p>
      </li>`)}
    </ul>
    <div class="ame__scene">
      <figure class="ame__verre" aria-hidden="true"></figure>
      <div class="ame__fiche" aria-live="polite" aria-atomic="true"></div>
    </div>
  </div>
  <p class="socle-cadre sylvestre__actions">${c.lien('reserver', { params: 'date=2026-12-31&service=soir', classe: 'bouton', texte: c.t('fetes.reserverSoiree') })} <span class="sylvestre__alcool">${c.t('fetes.alcool')}</span></p>
</section>

<section class="noel clair" data-lueur id="noel" data-fil="gauche" aria-labelledby="noel-titre">
  <div class="conteneur noel__grille">
    <div class="noel__menu" data-anime="cascade">
      <p class="surtitre">${c.t('fetes.noelSurtitre')}</p>
      <h2 id="noel-titre">${c.t('fetes.noelTitre')}</h2>
      <ol class="noel__plats" data-effet="cloches">${f.noel.plats.map((p) => html`<li><strong>${p.nom}</strong>${p.detail ? html`<span>${p.detail}</span>` : ''}<svg class="noel__cloche" viewBox="0 0 120 70" aria-hidden="true" focusable="false"><path d="M8 62 Q 10 14 60 12 Q 110 14 112 62 Z" fill="#b8925a"/><path d="M4 62 H116" stroke="#7a5523" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="9" r="6" fill="#7a5523"/><path d="M28 44 Q 32 26 52 22" fill="none" stroke="#f3e2c0" stroke-width="4" stroke-linecap="round" opacity=".7"/></svg></li>`)}</ol>
      <p class="noel__prix" data-prix>${c.t('fetes.noelPrix')}</p>
      <p>${c.lien('reserver', { params: 'date=2026-12-25&service=midi', classe: 'bouton', texte: c.t('fetes.reserverNoel') })}</p>
    </div>
    ${c.media({ nom: 'cheminee', alt: c.s('accueil.cheminee.alt'), cadrage: '38% 45%', classe: 'noel__photo', sizes: '(max-width: 760px) 100vw, 45vw', attrs: 'data-anime="rideau"' })}
  </div>
  <p class="conteneur noel__acompte">${c.t('fetes.acompte')}</p>
</section>

<section class="passes" data-lueur id="passes" data-fil="droite" aria-labelledby="passes-titre">
  <div class="conteneur passes__grille">
    <div>
      <h2 id="passes-titre" data-anime="lignes">${c.t('fetes.passesTitre')}</h2>
      <p data-anime>${c.t('fetes.passesTexte')}</p>
      <ul class="passes__liste" data-anime="cascade">${f.passes.map((p) => html`<li><span class="passes__etat">${c.t('fetes.passe')}</span><strong>${p.titre}</strong><span>${p.jour}</span></li>`)}</ul>
    </div>
    ${c.media({ nom: 'recevoir-depart', alt: c.s('fetes.passesAlt'), classe: 'passes__photo', sizes: '(max-width: 760px) 100vw, 35vw', attrs: 'data-fx="parallaxe"' })}
  </div>
</section>
`;
};
