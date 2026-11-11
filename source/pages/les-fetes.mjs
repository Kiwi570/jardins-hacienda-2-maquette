/* Les fêtes · « la saison décide » : la page s'ouvre sur la saison réelle (html[data-saison], posé avant le premier
   affichage ; ?saison=ete depuis l'accueil). L'hiver : le décompte géant de la Saint-Sylvestre sur la salle au feu,
   le menu en accords mets et vins (module accords-mets-et-vins), Noël plat par plat sous sa cloche, les soirées passées.
   L'été : la journée d'été heure par heure (journées festives, piscine, bar, pool parties). La bascule rallume la page. */
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'les-fetes', fichier: 'les-fetes', theme: 'nuit', imagePartage: 'grok/salle-feu-1280.webp', modules: ['accords-mets-et-vins'] };

export default (c) => {
  const f = c.donnees.fetes, a = c.donnees.accords;
  const TYPES = { 'vin-rouge': 'Vin rouge', 'vin-blanc': 'Vin blanc', petillant: 'Bulles' };
  const cloche = '<svg class="noel__cloche" viewBox="0 0 120 70" aria-hidden="true" focusable="false"><path d="M8 62 Q 10 14 60 12 Q 110 14 112 62 Z" fill="#e9a23b"/><path d="M4 62 H116" stroke="#9a5a12" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="9" r="6" fill="#9a5a12"/><path d="M28 44 Q 32 26 52 22" fill="none" stroke="#fff3d6" stroke-width="4" stroke-linecap="round" opacity=".7"/></svg>';
  /* Jours de calendrier à Moineville, comme le compte à rebours de la page (et non des tranches de 24 h). */
  const auj = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const jours = Math.max(0, Math.round((Date.parse(f.sylvestre.date + 'T00:00:00Z') - Date.parse(auj + 'T00:00:00Z')) / 86400000));
  return html`
<section class="ouv-fetes" id="debut" data-effet="saison">
  ${c.media({ nom: 'grok/salle-feu', alt: c.s('fetes.altHiver'), cadrage: '50% 55%', priorite: true, classe: 'ouv-fetes__fond', sizes: '100vw', attrs: 'data-saison-seul="hiver"' })}
  ${c.media({ nom: 'grok/bar-apres-midi', alt: c.s('fetes.altEte'), cadrage: '50% 60%', classe: 'ouv-fetes__fond', sizes: '100vw', attrs: 'data-saison-seul="ete"' })}
  <canvas class="ouv-fetes__braises" data-braises data-effet="braises" data-souris aria-hidden="true" data-audit-ignorer></canvas>
  <div class="conteneur ouv-fetes__contenu">
    <p class="heure-geante ouv-fetes__geant" data-iris-centre data-grille="typo" data-effet="axes" aria-hidden="true"><span data-saison-seul="hiver" data-decompte-geant="${f.sylvestre.date}">J-${jours}</span><span data-saison-seul="ete">${c.s('fetes.eteGeant')}</span></p>
    <p class="surtitre"><span data-saison-seul="hiver">${c.t('fetes.surHiver')}</span><span data-saison-seul="ete">${c.t('fetes.surEte')}</span></p>
    <h1><span data-saison-seul="hiver">${c.t('fetes.titreHiver')}</span><span data-saison-seul="ete">${c.t('fetes.titreEte')}</span></h1>
    <p class="ouv-fetes__texte masque-ecran-tres-bas masque-telephone"><span data-saison-seul="hiver">${c.t('fetes.texteHiver')}</span><span data-saison-seul="ete">${c.t('fetes.texteEte')}</span></p>
    <p class="ouv-fetes__actions">
      <span data-saison-seul="hiver">${c.lien('reserver', { ancre: 'formulaire', params: 'date=2026-12-31&service=soir', classe: 'bouton', texte: c.t('fetes.reserverSoiree'), attrs: 'data-action-principale' })}</span>
      <span data-saison-seul="ete">${c.lien('reserver', { ancre: 'formulaire', classe: 'bouton', texte: c.t('fetes.reserverEte'), attrs: 'data-action-principale' })}</span>
      <span class="bascule-saison" role="group" aria-label="${c.s('fetes.bascule')}"><button type="button" data-saison-choix="hiver">${c.t('fetes.basculeHiver')}</button><button type="button" data-saison-choix="ete">${c.t('fetes.basculeEte')}</button></span>
    </p>
    <p class="ouv-fetes__info" data-info-cle><span data-saison-seul="hiver">${c.t('fetes.infoSylvestre')} ${c.t('fetes.menuPrix')} · ${c.t('fetes.infoNoel')} ${c.t('fetes.noelPrix')}</span><span data-saison-seul="ete">${c.t('fetes.festivesH')} · ${c.t('fetes.piscineH')} · ${c.t('fetes.barH')}</span></p>
  </div>
</section>

<section class="ame sylvestre" id="saint-sylvestre" data-saison-seul="hiver" data-module="accords-mets-et-vins" aria-labelledby="ame-titre">
  <div class="ame__grille socle-cadre">
    <div class="ame__tete">
      <p class="socle-surtitre">${c.t('fetes.sylvestreSur')}</p>
      <h2 id="ame-titre" class="sylvestre__titre" data-anime="lettres">${c.t('fetes.sylvestreTitre')}</h2>
      <p>${c.t('fetes.sylvestreTexte')}</p>
      <p class="sylvestre__prix" data-prix><strong>${c.t('fetes.menuPrix')}</strong>&nbsp;· <strong>${c.t('fetes.accordPrix')}</strong></p>
<svg class="ame__statique" viewBox="0 0 120 200" aria-hidden="true" data-visuel><path d="M30 10 h60 c0 50 -10 78 -30 86 c-20 -8 -30 -36 -30 -86 Z M60 96 V176 M34 182 H86" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M33 40 h54 c-2 30 -10 46 -27 52 c-17 -6 -25 -22 -27 -52 Z" fill="currentColor" opacity=".55"/></svg>
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
  <p class="socle-cadre sylvestre__actions">${c.lien('reserver', { ancre: 'formulaire', params: 'date=2026-12-31&service=soir', classe: 'bouton', texte: c.t('fetes.reserverSoiree') })} <span class="sylvestre__alcool">${c.t('fetes.alcool')}</span></p>
</section>

<section class="noel" id="noel" data-saison-seul="hiver" aria-labelledby="noel-titre">
  <div class="conteneur noel__grille">
    <div class="noel__menu">
      <p class="surtitre">${c.t('fetes.noelSur')}</p>
      <h2 id="noel-titre" data-anime="lignes">${c.t('fetes.noelTitre')}</h2>
      <ol class="noel__plats" data-effet="cloches">${f.noel.plats.map((p) => html`<li><strong>${p.nom}</strong>${p.detail ? html`<span>${p.detail}</span>` : ''}${brut(cloche)}</li>`)}</ol>
      <p class="noel__prix" data-prix>${c.t('fetes.noelPrix')}</p>
      <p>${c.lien('reserver', { ancre: 'formulaire', params: 'date=2026-12-25&service=midi', classe: 'bouton', texte: c.t('fetes.reserverNoel') })}</p>
      <p class="noel__acompte">${c.t('fetes.acompte')}</p>
    </div>
    ${c.media({ nom: 'sylvestre-coupe', alt: c.s('fetes.coupeAlt'), cadrage: '50% 50%', classe: 'noel__photo', sizes: '(max-width: 760px) 70vw, 30vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
  </div>
</section>

<section class="passes" id="passes" data-saison-seul="hiver" aria-labelledby="passes-titre">
  <div class="conteneur passes__grille">
    <h2 id="passes-titre" data-anime="lignes">${c.t('fetes.passesTitre')}</h2>
    ${c.media({ nom: 'carte-partager', alt: c.s('fetes.passesAlt'), classe: 'passes__photo', sizes: '(max-width: 760px) 90vw, 360px' })}
    <ul class="passes__liste" data-anime="cascade">${f.passes.map((p) => html`<li><span class="passes__etat">${c.t('fetes.passe')}</span><strong>${p.titre}</strong><span>${p.jour}</span></li>`)}</ul>
    <p data-anime>${c.t('fetes.passesTexte')} ${c.lien('receptions', { ancre: 'demande', classe: 'lien-fleche', texte: c.t('fetes.reception') })}</p>
  </div>
</section>

<section class="ete-heures" id="ete" data-saison-seul="ete" data-sans-visuel aria-labelledby="ete-titre">
  <div class="conteneur">
    <h2 id="ete-titre" data-anime="lignes">${c.t('fetes.eteTitre')}</h2>
    <ol class="ete-heures__liste">
      <li class="ete-heure" data-effet="ete-heure">
        <p class="ete-heure__h">${c.t('fetes.festivesH')}</p>
        <div><h3>${c.t('fetes.festivesT')}</h3><p>${c.t('fetes.festivesX')}</p></div>
        ${c.media({ nom: 'ete-festives', alt: c.s('fetes.altFestives'), classe: 'ete-heure__photo', sizes: '(max-width: 760px) 40vw, 18vw' })}
      </li>
      <li class="ete-heure" data-effet="ete-heure">
        <p class="ete-heure__h">${c.t('fetes.piscineH')}</p>
        <div><h3>${c.t('fetes.piscineT')}</h3><p>${c.t('fetes.piscineX')}</p></div>
        ${c.media({ nom: 'recevoir-piscine', alt: '', classe: 'ete-heure__photo', sizes: '(max-width: 760px) 40vw, 18vw' })}
      </li>
      <li class="ete-heure" data-effet="ete-heure">
        <p class="ete-heure__h">${c.t('fetes.barH')}</p>
        <div><h3>${c.t('fetes.barT')}</h3><p>${c.t('fetes.barX')}</p></div>
        ${c.media({ nom: 'ete-bar', alt: '', classe: 'ete-heure__photo', sizes: '(max-width: 760px) 40vw, 18vw' })}
      </li>
      <li class="ete-heure" data-effet="ete-heure">
        <p class="ete-heure__h">${c.t('fetes.poolH')}</p>
        <div><h3>${c.t('fetes.poolT')}</h3><p>${c.t('fetes.poolX')}</p></div>
        ${c.media({ nom: 'ete-plongee', alt: c.s('fetes.altPool'), classe: 'ete-heure__photo', sizes: '(max-width: 760px) 40vw, 18vw' })}
      </li>
    </ol>
    <p>${c.lien('receptions', { ancre: 'demande', classe: 'lien-fleche', texte: c.t('fetes.reception') })}</p>
  </div>
</section>
`;
};
