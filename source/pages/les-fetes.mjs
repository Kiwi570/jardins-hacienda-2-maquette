/* Les fêtes · « la saison décide » : la page s'ouvre sur la saison réelle (html[data-saison], posé avant le premier
   affichage ; ?saison=ete depuis l'accueil). L'hiver : le décompte géant de la Saint-Sylvestre sur la salle au feu, derrière
   une vitre givrée qui fond sous la main (module givre-webgl) ; les dates de la saison (module agenda-des-dates : soirées,
   brunch, Noël, Saint-Sylvestre, passées en dessous) ; le menu en accords mets et vins (module accords-mets-et-vins) ;
   Noël en dépliant de trois volets qui s'ouvre au défilement (module depliant-3d).
   L'été : la journée d'été heure par heure (journées festives, piscine, bar, pool parties). La bascule rallume la page. */
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'les-fetes', fichier: 'les-fetes', theme: 'nuit', imagePartage: 'grok/salle-feu-1280.webp', modules: ['givre-webgl', 'agenda-des-dates', 'accords-mets-et-vins', 'depliant-3d'] };

export default (c) => {
  const f = c.donnees.fetes, a = c.donnees.accords, N = f.noel.plats;
  const TYPES = { 'vin-rouge': 'Vin rouge', 'vin-blanc': 'Vin blanc', petillant: 'Bulles' };
  /* Jours de calendrier à Moineville, comme le compte à rebours de la page (et non des tranches de 24 h). */
  const auj = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const jours = Math.max(0, Math.round((Date.parse(f.sylvestre.date + 'T00:00:00Z') - Date.parse(auj + 'T00:00:00Z')) / 86400000));
  return html`
<section class="ouv-fetes givre" id="debut" data-effet="saison" data-module="givre-webgl" aria-labelledby="fetes-h1">
  <div class="givre__fond" aria-hidden="true">
    ${c.media({ nom: 'grok/salle-feu', alt: '', cadrage: '50% 55%', priorite: true, classe: 'ouv-fetes__fond', sizes: '100vw', attrs: 'data-saison-seul="hiver"' })}
    ${c.media({ nom: 'vraie/piscine-palmiers', alt: '', cadrage: '50% 92%', classe: 'ouv-fetes__fond', sizes: '100vw', attrs: 'data-saison-seul="ete"' })}
  </div>
  <div class="givre__voile" aria-hidden="true"></div>
  <canvas class="givre__canvas" aria-hidden="true" data-audit-ignorer></canvas>
  <div class="givre__statique" aria-hidden="true"></div>
  <div class="conteneur ouv-fetes__contenu">
    <p class="heure-geante ouv-fetes__geant" data-iris-centre data-grille="typo" data-effet="axes" aria-hidden="true"><span data-saison-seul="hiver" data-decompte-geant="${f.sylvestre.date}">J-${jours}</span><span data-saison-seul="ete">${c.s('fetes.eteGeant')}</span></p>
    <p class="surtitre"><span data-saison-seul="hiver">${c.t('fetes.surHiver')}</span><span data-saison-seul="ete">${c.t('fetes.surEte')}</span></p>
    <h1 id="fetes-h1" data-givre-cible><span data-saison-seul="hiver">${c.t('fetes.titreHiver')}</span><span data-saison-seul="ete">${c.t('fetes.titreEte')}</span></h1>
    <p class="ouv-fetes__texte masque-ecran-tres-bas masque-telephone"><span data-saison-seul="hiver">${c.t('fetes.texteHiver')}</span><span data-saison-seul="ete">${c.t('fetes.texteEte')}</span></p>
    <p class="ouv-fetes__actions">
      <span data-saison-seul="hiver">${c.lien('reserver', { ancre: 'formulaire', params: 'date=2026-12-31&service=soir', classe: 'bouton', texte: c.t('fetes.reserverSoiree'), attrs: 'data-action-principale' })}</span>
      <span data-saison-seul="ete">${c.lien('reserver', { ancre: 'formulaire', classe: 'bouton', texte: c.t('fetes.reserverEte'), attrs: 'data-action-principale' })}</span>
      <span class="bascule-saison" role="group" aria-label="${c.s('fetes.bascule')}"><button type="button" data-saison-choix="hiver">${c.t('fetes.basculeHiver')}</button><button type="button" data-saison-choix="ete">${c.t('fetes.basculeEte')}</button></span>
    </p>
    <p class="ouv-fetes__info" data-info-cle><span data-saison-seul="hiver">${c.t('fetes.infoSylvestre')} ${c.t('fetes.menuPrix')} · ${c.t('fetes.infoNoel')} ${c.t('fetes.noelPrix')}</span><span data-saison-seul="ete">${c.t('fetes.festivesH')} · ${c.t('fetes.piscineH')} · ${c.t('fetes.barH')}</span></p>
    <p class="indice ouv-fetes__indice" aria-hidden="true" data-saison-seul="hiver"><span class="indice--souris">${c.t('fetes.indiceGivre')}</span><span class="indice--doigt">${c.t('fetes.indiceGivreDoigt')}</span></p>
  </div>
</section>

<section class="agd dates" id="dates" data-saison-seul="hiver" data-module="agenda-des-dates" data-grille="retour" aria-labelledby="agd-titre">
  <div class="conteneur">
    <div class="agd__tete">
      <p class="surtitre">${c.t('fetes.datesSur')}</p>
      <h2 class="agd__h2" id="agd-titre" data-anime="lignes">${c.t('fetes.datesTitre')}</h2>
      <p class="agd__prochaine" data-prochaine aria-live="polite"></p>
    </div>
    <div class="agd__outils">
      <div class="agd__filtres" role="group" aria-label="${c.s('fetes.datesFiltres')}"></div>
      <p class="agd__compte" data-compte aria-live="polite"></p>
    </div>
    <div class="dates__grille">
    ${c.media({ nom: 'vraie/danse', alt: c.s('fetes.datesPhotoAlt'), cadrage: '55% 50%', classe: 'dates__photo', sizes: '(max-width: 760px) 92vw, 30vw' })}
    <div class="dates__liste">
    <ol class="agd__liste">
      ${c.donnees.agenda.dates.map((d) => html`<li class="agd__date" id="date-${d.id}" data-debut="${d.debut}"${d.fin ? html` data-fin="${d.fin}"` : ''} data-type="${d.type}" data-lieu="${c.s('fetes.datesLieu')}" data-reserver="${c.url('reserver', 'formulaire', `date=${d.debut.slice(0, 10)}&service=${d.service}`)}">
        <h3 class="agd__titre">${d.titre}</h3>
        ${d.prix ? html`<p class="agd__texte" data-prix>${d.prix}</p>` : ''}
        ${d.ancre ? html`<p class="agd__texte"><a href="#${d.ancre}" data-sans-transition>${c.t('fetes.datesMenu')}</a></p>` : ''}
      </li>`)}
    </ol>
    </div>
    </div>
    <p class="agd__vide" hidden>${c.t('fetes.datesVide')}</p>
    <p class="dates__source">${c.t('fetes.datesSource')} ${c.lien('receptions', { ancre: 'demande', classe: 'lien-fleche', texte: c.t('fetes.reception') })}</p>
  </div>
</section>

<section class="d3d noel" id="noel" data-saison-seul="hiver" data-module="depliant-3d" data-epingle aria-labelledby="noel-titre">
  <div class="d3d__cadre socle-cadre">
    <div class="d3d__tete" data-tient>
      <div><p class="socle-surtitre">${c.t('fetes.noelSur')}</p><h2 class="d3d__titre" id="noel-titre" data-anime="lignes">${c.t('fetes.noelTitre')}</h2></div>
      <p class="d3d__intro">${c.t('fetes.noelIntro')}</p>
    </div>
    <div class="d3d__depliant" data-tient>
      <article class="d3d__volet">
        <span class="d3d__verso" aria-hidden="true"><span class="d3d__num">${c.t('fetes.noelDos')}</span><strong>${c.site.contact.telephone}</strong></span>
        <p class="d3d__num">${c.t('fetes.noelV1')}</p>
        <h3>${N[0].nom}</h3>
        <ul class="d3d__liste"><li>${N[1].nom} <em>${N[1].detail}</em></li></ul>
        ${c.media({ nom: 'vraie/coupe-cheminee', alt: '', cadrage: '50% 45%', classe: 'd3d__media', sizes: '(max-width: 760px) 90vw, 28vw' })}
      </article>
      <article class="d3d__volet">
        <p class="d3d__num">${c.t('fetes.noelV2')}</p>
        <h3>${N[2].nom}</h3>
        <ul class="d3d__liste"><li><em>${N[2].detail}</em></li><li>${N[3].nom} <em>${N[3].detail}</em></li></ul>
        ${c.media({ nom: 'vraie/salle-pierre', alt: '', cadrage: '70% 55%', classe: 'd3d__media', sizes: '(max-width: 760px) 90vw, 28vw' })}
      </article>
      <article class="d3d__volet">
        <span class="d3d__verso noel__couverture" aria-hidden="true"><span class="d3d__num">${c.t('fetes.noelSur')}</span><strong>${c.t('fetes.noelTitre')}</strong><span class="noel__couv-prix">${c.t('fetes.noelPrix')}</span></span>
        <p class="d3d__num">${c.t('fetes.noelV3')}</p>
        <h3>${N[4].nom}</h3>
        <ul class="d3d__liste"><li><em>${N[4].detail}</em></li></ul>
        <p class="noel__prix" data-prix>${c.t('fetes.noelPrix')}</p>
        <p class="noel__actions">${c.lien('reserver', { ancre: 'formulaire', params: 'date=2026-12-25&service=midi', classe: 'bouton', texte: c.t('fetes.reserverNoel') })}</p>
        <p class="noel__acompte">${c.t('fetes.acompte')}</p>
      </article>
    </div>
  </div>
</section>

<section class="ame sylvestre" id="saint-sylvestre" data-saison-seul="hiver" data-module="accords-mets-et-vins" aria-labelledby="ame-titre">
  <div class="ame__grille socle-cadre">
    <div class="ame__tete">
      <p class="socle-surtitre">${c.t('fetes.sylvestreSur')}</p>
      <h2 id="ame-titre" class="sylvestre__titre" data-anime="lignes">${c.t('fetes.sylvestreTitre')}</h2>
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

<section class="ete-heures" id="ete" data-saison-seul="ete" data-sans-visuel aria-labelledby="ete-titre">
  <div class="conteneur">
    <h2 id="ete-titre" data-anime="lignes">${c.t('fetes.eteTitre')}</h2>
    <ol class="ete-heures__liste">
      <li class="ete-heure" data-effet="ete-heure">
        <p class="ete-heure__h">${c.t('fetes.festivesH')}</p>
        <div><h3>${c.t('fetes.festivesT')}</h3><p>${c.t('fetes.festivesX')}</p></div>
        ${c.media({ nom: 'vraie/piscine-paillotes', alt: c.s('fetes.altFestives'), classe: 'ete-heure__photo', sizes: '(max-width: 760px) 40vw, 18vw' })}
      </li>
      <li class="ete-heure" data-effet="ete-heure">
        <p class="ete-heure__h">${c.t('fetes.piscineH')}</p>
        <div><h3>${c.t('fetes.piscineT')}</h3><p>${c.t('fetes.piscineX')}</p></div>
        ${c.media({ nom: 'vraie/piscine-palmiers', alt: '', classe: 'ete-heure__photo', sizes: '(max-width: 760px) 40vw, 18vw' })}
      </li>
      <li class="ete-heure" data-effet="ete-heure">
        <p class="ete-heure__h">${c.t('fetes.barH')}</p>
        <div><h3>${c.t('fetes.barT')}</h3><p>${c.t('fetes.barX')}</p></div>
        ${c.media({ nom: 'vraie/nid-piscine', alt: '', classe: 'ete-heure__photo', sizes: '(max-width: 760px) 40vw, 18vw' })}
      </li>
      <li class="ete-heure" data-effet="ete-heure">
        <p class="ete-heure__h">${c.t('fetes.poolH')}</p>
        <div><h3>${c.t('fetes.poolT')}</h3><p>${c.t('fetes.poolX')}</p></div>
        ${c.media({ nom: 'vraie/lanternes', alt: c.s('fetes.altPool'), classe: 'ete-heure__photo', sizes: '(max-width: 760px) 40vw, 18vw' })}
      </li>
    </ol>
    <p>${c.lien('receptions', { ancre: 'demande', classe: 'lien-fleche', texte: c.t('fetes.reception') })}</p>
  </div>
</section>
`;
};
