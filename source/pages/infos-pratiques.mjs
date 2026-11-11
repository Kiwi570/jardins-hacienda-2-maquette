/* Infos pratiques · « l'heure qu'il est à Moineville » : l'heure réelle en chiffres géants (elle tourne), la photo de
   ce moment (la piscine le jour, la terrasse allumée le soir), le statut ouvert ou fermé et le téléphone ; puis le
   cadran des horaires qu'on fait tourner (module horaires-ouvert-maintenant, horaires RankEat à confirmer), l'accès,
   les règles de l'été, et un message simple (les réceptions ont leur page). */
import { html, brut, fragment } from '../../outils/gabarit.mjs';
import { preparer, rendreBloc } from '../../assets/js/modules/horaires-ouvert-maintenant/horaires-calcul.js';

export const page = { cle: 'infos-pratiques', fichier: 'infos-pratiques', theme: 'jour', themeAuto: true, imagePartage: 'grok/midi-piscine-1280.webp', modules: ['horaires-ouvert-maintenant'] };

export default (c) => {
  const h = c.donnees.horaires;
  const d = preparer(h);
  const json = JSON.stringify(h).replace(/<\//g, '<\\/');
  return html`
<section class="ouv-infos" id="debut" data-effet="heure-reelle">
  ${c.media({ nom: 'grok/midi-piscine', alt: c.s('infos.altJour'), cadrage: '50% 55%', priorite: true, classe: 'ouv-infos__fond', sizes: '100vw', attrs: 'data-moment-seul="jour"' })}
  ${c.media({ nom: 'grok/terrasse-bleue', alt: c.s('infos.altSoir'), cadrage: '50% 50%', classe: 'ouv-infos__fond', sizes: '100vw', attrs: 'data-moment-seul="soir"' })}
  <div class="conteneur ouv-infos__contenu">
    <p class="surtitre">${c.t('infos.sur')}</p>
    <p class="ouv-infos__ilest"><span>${c.t('infos.ilEst')}</span> <span class="heure-geante ouv-infos__heure" data-iris-centre data-grille="typo" data-effet="axes" data-heure-reelle aria-hidden="true">--:--</span> <span>${c.t('infos.aMoineville')}</span></p>
    <h1>${c.t('infos.titre')}</h1>
    <p class="statut ouv-infos__statut"><span class="statut__point" aria-hidden="true"></span><span data-statut-accueil>${c.t('infos.horairesSur')}</span></p>
    <script type="application/json" data-horaires-accueil>${brut(json)}</script>
    <p class="ouv-infos__actions"><a class="bouton" href="tel:${c.site.contact.telephoneLien}" data-action-principale>${c.t('commun.appeler')} ${c.site.contact.telephone}</a> <span class="ouv-infos__adresse" data-info-cle>${c.site.contact.adresse}</span></p>
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
      ${c.media({ nom: 'recevoir-terrasse', alt: c.s('infos.horairesPhotoAlt'), classe: 'horaires__photo', sizes: '(max-width: 760px) 92vw, 40vw' })}
    </div>
  </div>
</section>

<section class="acces" id="acces" aria-labelledby="acces-titre">
  <div class="conteneur acces__grille">
    <div>
      <p class="surtitre">${c.t('infos.accesSur')}</p>
      <h2 id="acces-titre" data-anime="lignes">${c.t('infos.accesTitre')}</h2>
      <p data-anime>${c.t('infos.accesTexte')}</p>
      <svg class="minuit__carte acces__carte" viewBox="0 0 360 230" role="img" aria-label="${c.s('infos.carteAlt')}" data-fx="trace">
        <path class="carte__route" d="M150 150 C 190 130 220 108 252 84" fill="none"/>
        <path class="carte__route" d="M150 150 C 190 160 230 172 270 188" fill="none"/>
        <path class="carte__route carte__route--fine" d="M252 84 C 252 60 250 40 246 18" fill="none"/>
        <circle cx="246" cy="18" r="4"/><text x="258" y="22">Luxembourg</text>
        <circle cx="252" cy="84" r="4"/><text x="264" y="88">Thionville</text>
        <circle cx="270" cy="188" r="4"/><text x="282" y="192">Metz</text>
        <circle class="carte__ici" cx="150" cy="150" r="7"/><text class="carte__ici-nom" x="138" y="146" text-anchor="end">Moineville</text>
        <text class="carte__note" x="12" y="222">Plan schématique</text>
      </svg>
      <p><a class="bouton bouton--contour" href="https://www.google.com/maps/search/?api=1&amp;query=6+Vathier+Haye+54580+Moineville" target="_blank" rel="noopener">${brut(c.s('infos.itineraire').replace(' (nouvel onglet)', '<span class="visuellement-cache"> (nouvel onglet)</span> <span aria-hidden="true">↗</span>'))}</a></p>
    </div>
    <dl class="acces__regles" data-anime="cascade">
      <div><dt>${c.t('infos.festivesTitre')}</dt><dd>${c.t('infos.festivesTexte')}</dd></div>
      <div><dt>${c.t('infos.piscineTitre')}</dt><dd>${c.t('infos.piscineTexte')}</dd></div>
      <div><dt>${c.t('infos.barTitre')}</dt><dd>${c.t('infos.barTexte')}</dd></div>
    </dl>
  </div>
</section>

<section class="ecrire" id="ecrire" aria-labelledby="ecrire-titre">
  <div class="conteneur ecrire__grille">
    ${c.media({ nom: 'ete-soir', alt: c.s('fetes.altSoirEte'), classe: 'ecrire__photo', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-anime="rideau"' })}
    <form class="ecrire__form" data-formulaire action="#ecrire" novalidate>
      <p class="surtitre">${c.t('infos.ecrireSur')}</p>
      <h2 id="ecrire-titre" data-anime="lignes">${c.t('infos.ecrireTitre')}</h2>
      <p>${c.t('infos.ecrireTexte')} ${c.lien('receptions', { ancre: 'demande', classe: 'lien-fleche', texte: c.t('infos.receptions') })}</p>
      <div class="ecrire__deux">
        <label><span>${c.t('infos.prenom')}</span><input type="text" name="prenom" autocomplete="given-name" required></label>
        <label><span>${c.t('infos.nom')}</span><input type="text" name="nom" autocomplete="family-name" required></label>
        <label><span>${c.t('infos.email')}</span><input type="email" name="email" autocomplete="email" required></label>
        <label><span>${c.t('infos.telephone')}</span><input type="tel" name="telephone" autocomplete="tel"></label>
      </div>
      <label><span>${c.t('infos.message')}</span><textarea name="message" rows="4" required></textarea></label>
      <p class="ecrire__rgpd">${c.t('infos.rgpd')} ${c.t('commun.confidentialiteForm')}</p>
      <p><button type="submit" class="bouton">${c.t('infos.envoyer')}</button></p>
      <p class="ecrire__message" data-message-envoi data-texte="${c.s('infos.envoye')}" role="status" tabindex="-1" hidden></p>
    </form>
  </div>
</section>
`;
};
