/* Les fêtes · « la saison décide » : la page s'ouvre sur la saison réelle (html[data-saison], posé avant le premier
   affichage ; ?saison=ete depuis l'accueil). L'hiver : le décompte géant de la Saint-Sylvestre sur la salle au feu, derrière
   une vitre givrée qui fond sous la main (module givre-webgl) ; les dates de la saison (module agenda-des-dates : soirées,
   brunch, Noël, Saint-Sylvestre, passées en dessous) ; le menu en accords mets et vins (module accords-mets-et-vins) ;
   Noël en dépliant de trois volets qui s'ouvre au défilement (module depliant-3d).
   L'été : la journée d'été heure par heure (journées festives, piscine, bar, pool parties). La bascule rallume la page. */
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'les-fetes', fichier: 'les-fetes', theme: 'nuit', imagePartage: 'vraie/affiche-sylvestre-960.webp', modules: ['agenda-des-dates'] };

export default (c) => {
  const f = c.donnees.fetes, a = c.donnees.accords, N = f.noel.plats;
  const TYPES = { 'vin-rouge': 'Vin rouge', 'vin-blanc': 'Vin blanc', petillant: 'Bulles' };
  /* v7.5.14 · La Saint-Sylvestre en scène : un verre par type de vin (flûte, verre à blanc, à rouge, tulipe), le vin y monte. */
  const a_ = a, VERRES = { petillant: 'flute', 'vin-blanc': 'blanc', 'vin-rouge': 'rouge' }, ROMAINS = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  const FORMES = {
    flute: { bol: 'M84 24 C82 70 82 118 88 146 C92 160 96 166 100 168 C104 166 108 160 112 146 C118 118 118 70 116 24 Z', eclat: 'M89 40 C87 80 88 118 92 140', niveau: 58, bas: 168 },
    blanc: { bol: 'M64 26 C60 76 64 124 80 150 C88 162 94 168 100 170 C106 168 112 162 120 150 C136 124 140 76 136 26 Z', eclat: 'M74 46 C71 86 76 120 86 142', niveau: 96, bas: 170 },
    rouge: { bol: 'M50 30 C42 92 50 140 72 164 C82 174 92 178 100 179 C108 178 118 174 128 164 C150 140 158 92 150 30 Z', eclat: 'M62 52 C58 98 64 134 78 156', niveau: 112, bas: 179 },
    tulipe: { bol: 'M70 30 C56 66 56 110 72 140 C82 158 92 164 100 165 C108 164 118 158 128 140 C144 110 144 66 130 30 Z', eclat: 'M78 50 C70 84 72 116 84 138', niveau: 94, bas: 165 },
  };
  const prixMenu = (c.s('fetes.menuPrix').match(/^(\d+\s*€)\s*(.*)$/) || []).slice(1), prixAccord = (c.s('fetes.accordPrix').match(/^(\d+\s*€)\s*(.*)$/) || []).slice(1);
  /* Jours de calendrier à Moineville, comme le compte à rebours de la page (et non des tranches de 24 h). */
  const auj = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const jours = Math.max(0, Math.round((Date.parse(f.sylvestre.date + 'T00:00:00Z') - Date.parse(auj + 'T00:00:00Z')) / 86400000));
  return html`
<section class="ouv-fetes" id="debut" data-effet="saison" aria-labelledby="fetes-h1">
  <span class="ouv-fetes__lueurs" aria-hidden="true"></span>
  <div class="conteneur ouv-fetes__grille">
    <div class="ouv-fetes__contenu">
      <p class="surtitre"><span data-saison-seul="hiver">${c.t('fetes.surHiver')}</span><span data-saison-seul="ete">${c.t('fetes.surEte')}</span></p>
      <h1 id="fetes-h1" data-iris-centre><span data-saison-seul="hiver">${c.t('fetes.titreHiver')}</span><span data-saison-seul="ete">${c.t('fetes.titreEte')}</span></h1>
      <p class="ouv-fetes__decompte" data-saison-seul="hiver"><span class="ouv-fetes__j" data-decompte-geant="${f.sylvestre.date}">J-${jours}</span> <span>${c.t('fetes.avantSylvestre')}</span></p>
      <p class="ouv-fetes__texte"><span data-saison-seul="hiver">${c.t('fetes.texteHiver')}</span><span data-saison-seul="ete">${c.t('fetes.texteEte')}</span></p>
      <p class="ouv-fetes__actions">
      <span data-saison-seul="hiver">${c.lien('reserver', { ancre: 'formulaire', params: 'date=2026-12-31&service=soir', classe: 'bouton', texte: c.t('fetes.reserverSoiree'), attrs: 'data-action-principale' })}</span>
      <span data-saison-seul="ete">${c.lien('reserver', { ancre: 'formulaire', classe: 'bouton', texte: c.t('fetes.reserverEte'), attrs: 'data-action-principale' })}</span>
      <span class="bascule-saison" role="group" aria-label="${c.s('fetes.bascule')}"><button type="button" data-saison-choix="hiver">${c.t('fetes.basculeHiver')}</button><button type="button" data-saison-choix="ete">${c.t('fetes.basculeEte')}</button></span>
    </p>
      <p class="ouv-fetes__info" data-info-cle><span data-saison-seul="hiver">${c.t('fetes.infoSylvestre')} ${c.t('fetes.menuPrix')} · ${c.t('fetes.infoNoel')} ${c.t('fetes.noelPrix')}</span><span data-saison-seul="ete">${c.t('fetes.festivesH')} · ${c.t('fetes.piscineH')} · ${c.t('fetes.barH')}</span></p>
    </div>
    <div class="ouv-fetes__visuel" data-saison-seul="hiver">
      <a class="affiche affiche--noel" href="#noel" data-sans-transition aria-label="${c.s('fetes.afficheNoel')}">${c.media({ nom: 'vraie/affiche-noel', alt: '', cadrage: '50% 50%', priorite: true, classe: 'affiche__photo', sizes: '(max-width: 760px) 46vw, 24vw' })}</a>
      <a class="affiche affiche--sylvestre" href="#saint-sylvestre" data-sans-transition aria-label="${c.s('fetes.afficheSylvestre')}">${c.media({ nom: 'vraie/affiche-sylvestre', alt: '', cadrage: '50% 50%', priorite: true, classe: 'affiche__photo', sizes: '(max-width: 760px) 52vw, 26vw' })}</a>
    </div>
    <div class="ouv-fetes__visuel ouv-fetes__visuel--ete" data-saison-seul="ete">
      ${c.media({ nom: 'vraie/piscine-paillotes', alt: c.s('fetes.altEte'), cadrage: '50% 55%', classe: 'ouv-fetes__arche', sizes: '(max-width: 760px) 80vw, 40vw', attrs: 'data-fx="parallaxe" data-fx-force="5"' })}
      ${c.media({ nom: 'vraie/lanternes', alt: c.s('fetes.altLanternes'), cadrage: '50% 50%', classe: 'ouv-fetes__rond', sizes: '(max-width: 760px) 34vw, 16vw' })}
    </div>
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
    <div class="dates__visuel" data-dates-visuel data-effet="dates-photo" aria-hidden="true">
      ${c.donnees.agenda.dates.filter((d, i, t) => t.findIndex((e) => e.image === d.image) === i).map((d, i) => c.media({ nom: d.image, alt: '', cadrage: d.cadrage, classe: `dates__img${i === 0 ? ' est-active' : ''}`, sizes: '(max-width: 760px) 92vw, 34vw', attrs: `data-dates-image="${d.image}"` }))}
      <div class="dates__badge"><span class="dates__jour" data-dates-jour></span><span class="dates__mois" data-dates-mois></span><span class="dates__nom" data-dates-nom></span></div>
    </div>
    <div class="dates__liste">
    <ol class="agd__liste">
      ${c.donnees.agenda.dates.map((d) => html`<li class="agd__date" id="date-${d.id}" data-debut="${d.debut}"${d.fin ? html` data-fin="${d.fin}"` : ''} data-type="${d.type}" data-image="${d.image}" data-lieu="${c.s('fetes.datesLieu')}" data-reserver="${c.url('reserver', 'formulaire', `date=${d.debut.slice(0, 10)}&service=${d.service}`)}">
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

<section class="noel-scene" id="noel" data-saison-seul="hiver" data-effet="noel" aria-labelledby="noel-titre">
  <div class="noel-scene__cadre" data-collant>
    <span class="noel-scene__neige" aria-hidden="true"><span style="--x:4%;--d:0s;--t:11s;--s:3px"></span><span style="--x:11%;--d:-3s;--t:9s;--s:2px"></span><span style="--x:18%;--d:-6s;--t:13s;--s:4px"></span><span style="--x:25%;--d:-1s;--t:10s;--s:2px"></span><span style="--x:33%;--d:-8s;--t:12s;--s:3px"></span><span style="--x:40%;--d:-4s;--t:9s;--s:2px"></span><span style="--x:47%;--d:-10s;--t:14s;--s:3px"></span><span style="--x:54%;--d:-2s;--t:11s;--s:2px"></span><span style="--x:61%;--d:-7s;--t:10s;--s:4px"></span><span style="--x:68%;--d:-5s;--t:13s;--s:2px"></span><span style="--x:75%;--d:-9s;--t:9s;--s:3px"></span><span style="--x:82%;--d:-3s;--t:12s;--s:2px"></span><span style="--x:89%;--d:-6s;--t:11s;--s:3px"></span><span style="--x:95%;--d:-1s;--t:10s;--s:2px"></span><span style="--x:8%;--d:-12s;--t:15s;--s:2px"></span><span style="--x:37%;--d:-11s;--t:12s;--s:3px"></span><span style="--x:71%;--d:-13s;--t:14s;--s:2px"></span><span style="--x:58%;--d:-14s;--t:13s;--s:3px"></span></span>
    <div class="conteneur noel-scene__grille">
      <div class="noel-scene__tete">
        <p class="surtitre">${c.t('fetes.noelSur')}</p>
        <h2 id="noel-titre">${c.t('fetes.noelTitre')}</h2>
        <p class="noel-scene__intro">${c.t('fetes.noelIntro2')}</p>
        <p class="noel-scene__prix" data-prix><strong>${f.noel.prix}</strong> ${f.noel.prixDetail}</p>
        <p class="noel-scene__actions">${c.lien('reserver', { ancre: 'formulaire', params: 'date=2026-12-25&service=midi', classe: 'bouton', texte: c.t('fetes.reserverNoel') })}</p>
        <p class="noel-scene__acompte">${c.t('fetes.acompte')}</p>
      </div>
      <div class="noel-carte" data-noel-carte>
        <div class="noel-carte__page">
          <p class="noel-carte__sur">${c.t('fetes.noelMenu')}</p>
          <span class="noel-carte__filet" aria-hidden="true"></span>
          <ol class="noel-carte__plats">
            ${N.map((pl, i) => html`<li style="--i:${i}"><span class="noel-carte__nom">${pl.nom}</span>${pl.detail ? html`<span class="noel-carte__detail">${pl.detail}</span>` : ''}</li>`)}
          </ol>
          <span class="noel-carte__filet" aria-hidden="true"></span>
          <p class="noel-carte__signe"><span class="noel-carte__logo" aria-hidden="true"></span>${c.site.nom}</p>
        </div>
        <div class="noel-carte__couverture" aria-hidden="true">
          <div class="noel-carte__face">${c.media({ nom: 'vraie/affiche-noel', alt: '', cadrage: '50% 12%', classe: 'noel-carte__affiche', sizes: '(max-width: 760px) 80vw, 26vw' })}<span class="noel-carte__brillant"></span></div>
          <div class="noel-carte__dos">${c.media({ nom: 'vraie/coupe-cheminee', alt: '', cadrage: '50% 45%', classe: 'noel-carte__photo', sizes: '(max-width: 760px) 80vw, 26vw' })}<p class="noel-carte__mot">${c.t('fetes.noelMot')}</p></div>
        </div>
      </div>
    </div>
    <p class="indice noel-scene__indice" aria-hidden="true">${c.t('fetes.noelIndice')}</p>
  </div>
</section>

<section class="ss" id="saint-sylvestre" data-saison-seul="hiver" data-ss data-accord="oui" aria-labelledby="ss-titre">
  <span class="sylvestre__pluie" aria-hidden="true"><span style="--x:6%;--y:12%;--d:0s"></span><span style="--x:14%;--y:70%;--d:-1.2s"></span><span style="--x:22%;--y:30%;--d:-2.1s"></span><span style="--x:31%;--y:85%;--d:-0.6s"></span><span style="--x:39%;--y:8%;--d:-1.7s"></span><span style="--x:47%;--y:55%;--d:-2.6s"></span><span style="--x:56%;--y:22%;--d:-0.3s"></span><span style="--x:63%;--y:78%;--d:-1.4s"></span><span style="--x:71%;--y:40%;--d:-2.2s"></span><span style="--x:79%;--y:10%;--d:-0.9s"></span><span style="--x:86%;--y:64%;--d:-1.9s"></span><span style="--x:93%;--y:33%;--d:-2.8s"></span><span style="--x:10%;--y:48%;--d:-3.1s"></span><span style="--x:52%;--y:92%;--d:-0.5s"></span><span style="--x:88%;--y:90%;--d:-2.4s"></span></span>
  <div class="ss__collant">
    <div class="conteneur ss__grille">
      <div class="ss__tete">
        <p class="surtitre">${c.t('fetes.sylvestreSur')}</p>
        <h2 id="ss-titre" class="ss__titre" data-anime="lignes">${c.t('fetes.ssTitre')} <em>${c.t('fetes.ssTitre2')}</em></h2>
        <p class="ss__intro">${c.t('fetes.ssIntro')}</p>
        <div class="ss__formule">
          <p class="ss__prix"><strong data-ss-prix data-sans="${prixMenu[0]}" data-avec="${prixAccord[0]}">${prixAccord[0]}</strong> <span data-ss-prix-detail data-sans="${prixMenu[1]}" data-avec="${prixAccord[1]}">${prixAccord[1]}</span></p>
          <label class="ss__bascule"><input type="checkbox" data-ss-accord checked><span class="ss__interrupteur" aria-hidden="true"><span></span></span><span>${c.t('fetes.ssBascule')}</span></label>
        </div>
        <p class="ss__dj"><span class="vinyle" aria-hidden="true"></span><span>${c.t('fetes.dj')}<br><small>${c.t('fetes.horaires')}</small></span></p>
        <p class="ss__actions">${c.lien('reserver', { ancre: 'formulaire', params: 'date=2026-12-31&service=soir', classe: 'bouton', texte: c.t('fetes.reserverSoiree') })}</p>
        <p class="ss__alcool">${c.t('fetes.alcool')}</p>
      </div>
      <div class="ss__scene" data-effet="saint-sylvestre">
        <ol class="ss__plats">
          ${a_.plats.map((p, i) => html`<li class="ss-plat${i === 0 ? ' est-actif' : ''}" data-ss-plat data-couleur="${p.accord.couleur}" data-verre="${p.accord.verre || VERRES[p.accord.type]}" data-type="${TYPES[p.accord.type]}" data-vin="${p.accord.nom}" data-region="${p.accord.region}" style="--c: ${p.accord.couleur}">
            <p class="ss-plat__rang" aria-hidden="true">${ROMAINS[i]}</p>
            <p class="ss-plat__moment">${p.moment}</p>
            <h3 class="ss-plat__nom">${p.plat}</h3>
            <p class="ss-plat__detail">${p.detail}</p>
            <p class="ss-plat__vin"><span class="ss-plat__goutte" aria-hidden="true"></span>${c.t('fetes.ssAccord')} <strong>${p.accord.nom}</strong> · ${p.accord.region}</p>
          </li>`)}
        </ol>
        <div class="ss__verre" aria-hidden="true">
          <span class="ss__halo"></span>
          <svg class="ss-verre" viewBox="0 0 200 320">
            <defs>${brut(Object.entries(FORMES).map(([k, d]) => `<clipPath id="ss-clip-${k}"><path d="${d.bol}"/></clipPath>`).join(''))}</defs>
            ${brut(Object.entries(FORMES).map(([k, d]) => `<g class="ss-verre__forme${k === 'flute' ? ' est-active' : ''}" data-forme="${k}"><g clip-path="url(#ss-clip-${k})"><rect class="ss-verre__vin" x="0" y="${d.niveau}" width="200" height="${200 - d.niveau}"/><rect class="ss-verre__reflet-vin" x="0" y="${d.niveau}" width="200" height="6"/>${k === 'flute' ? '<g class="ss-verre__bulles"><circle cx="96" cy="150" r="2"/><circle cx="104" cy="140" r="1.6"/><circle cx="100" cy="128" r="1.8"/><circle cx="94" cy="116" r="1.4"/><circle cx="106" cy="104" r="1.5"/></g>' : ''}</g><path class="ss-verre__bol" d="${d.bol}"/><path class="ss-verre__eclat" d="${d.eclat}"/><path class="ss-verre__pied" d="M100 ${d.bas} V280 M66 286 Q100 278 134 286"/></g>`).join(''))}
          </svg>
          <div class="ss__accord">
            <p class="ss__avec">${c.t('fetes.ssAvec')}</p>
            <p class="ss__type"><span class="ss-plat__goutte" aria-hidden="true"></span><span data-ss-type>${TYPES[a_.plats[0].accord.type]}</span></p>
            <p class="ss__vin" data-ss-vin>${a_.plats[0].accord.nom}</p>
            <p class="ss__region" data-ss-region>${a_.plats[0].accord.region}</p>
            <p class="ss__sans">${c.t('fetes.ssSans')}</p>
          </div>
        </div>
        <ol class="ss__table" aria-label="${c.s('fetes.ssTable')}">
          ${a_.plats.map((p, i) => html`<li><button type="button" class="ss__pas${i === 0 ? '' : ''}" data-ss-aller="${i}"${i === 0 ? brut(' aria-current="step"') : ''}><span class="ss__pas-rang" aria-hidden="true">${ROMAINS[i]}</span><span class="ss__pas-nom">${p.moment}</span></button></li>`)}
        </ol>
      </div>
    </div>
  </div>
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
