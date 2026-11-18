/* Espace restaurateur (v7.6.0) : la démonstration de l'outil que le restaurant aurait pour gérer son site.
   Connexion fictive, puis cinq rubriques : Aujourd'hui, Réservations (agenda, confirmer, refuser, fermer un service),
   Événements, Textes et horaires (annonce, horaires, fermetures, ardoise, textes), Photos (remplacer, cadrer).
   Tout est enregistré dans ce navigateur (localStorage) et s'affiche sur le site grâce à assets/js/espace-apercu.js ;
   une réservation faite sur /reserver arrive dans l'agenda. Le contenu des rubriques est rendu par assets/js/espace.js. */
import { readdirSync } from 'node:fs';
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'espace', fichier: 'espace', theme: 'jour', imagePartage: 'vraie/salle-soleil-1280.webp', partage: false, sansEffet: true, sansAction: true, modules: [] };

/* Les photos de la maison proposées dans la photothèque : nettes et claires (sans affiches ni photos de nuit). */
const ECARTEES = new Set(['affiche-noel', 'affiche-sylvestre', 'buffet-nuit', 'lanternes', 'mariage-lanternes', 'salle-nuit', 'salle-soir']);
function tailles() {
  const dossier = new URL('../../assets/images/vraie/', import.meta.url), t = {};
  for (const f of readdirSync(dossier)) {
    const m = f.match(/^(.+?)-(\d+)\.webp$/); if (!m || m[1].endsWith('-mobile')) continue;
    (t[m[1]] ||= []).push(+m[2]);
  }
  for (const k in t) t[k].sort((a, b) => a - b);
  return t;
}
function phototheque(t) {
  return Object.entries(t).filter(([n, l]) => l.includes(640) && !ECARTEES.has(n)).map(([n, l]) => ({ nom: `vraie/${n}`, l }));
}

/* Les emplacements de photos que le restaurant peut changer (chacun porte data-edit-photo sur le site). */
const PHOTOS = [
  { id: 'accueil-chef', page: 'accueil', ancre: 'chef', lieu: 'Accueil', libelle: 'Le chef', nom: 'vraie/chef', cadrage: '50% 40%' },
  { id: 'accueil-restaurant', page: 'accueil', ancre: 'feu', lieu: 'Accueil', libelle: 'Le Restaurant, en grand', nom: 'vraie/salle-resto', cadrage: '46% 58%' },
  { id: 'fetes-ouverture', page: 'les-fetes', ancre: '', lieu: 'Les fêtes', libelle: 'Photo d\'ouverture', nom: 'vraie/piscine-paillotes', cadrage: '50% 55%' },
  { id: 'accueil-devise', page: 'accueil', ancre: 'devise', lieu: 'Accueil', libelle: 'Ce que nos clients retiennent', nom: 'vraie/pancarte-bar', cadrage: '42% 50%' },
  { id: 'offrir-ouverture', page: 'offrir', ancre: '', lieu: 'Offrir', libelle: 'Photo d\'ouverture', nom: 'vraie/salle-midi', cadrage: '50% 50%' },
  { id: 'infos-ouverture', page: 'infos-pratiques', ancre: '', lieu: 'Infos pratiques', libelle: 'Photo d\'ouverture', nom: 'vraie/salle-baies', cadrage: '38% 55%' },
];
/* Les textes modifiables (chacun porte data-edit sur le site). */
const TEXTES = [
  { cle: 'accueil.heros.lieu', page: 'accueil', ancre: '', lieu: 'Accueil · ouverture', libelle: 'La ligne sous le logo' },
  { cle: 'accueil.chef.titre', page: 'accueil', ancre: 'chef', lieu: 'Accueil · le chef', libelle: 'Titre' },
  { cle: 'accueil.chef.texte1', page: 'accueil', ancre: 'chef', lieu: 'Accueil · le chef', libelle: 'Premier paragraphe', long: true },
  { cle: 'accueil.chef.texte2', page: 'accueil', ancre: 'chef', lieu: 'Accueil · le chef', libelle: 'Second paragraphe', long: true },
  { cle: 'accueil.feu.texteHiver', page: 'accueil', ancre: 'feu', lieu: 'Accueil · Le Restaurant', libelle: 'Présentation (l\'hiver)', long: true },
  { cle: 'accueil.venir.texte', page: 'accueil', ancre: 'venir', lieu: 'Accueil · venir', libelle: 'Où nous trouver', long: true },
];

const VUES = [
  ['jour', 'Aujourd\'hui', '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></svg>'],
  ['resas', 'Réservations', '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.6h17M8 3v4M16 3v4M8 13.5h2M14 13.5h2M8 17h2"/></svg>'],
  ['evenements', 'Événements', '<svg viewBox="0 0 24 24"><path d="M4 8.5V6a1.5 1.5 0 0 1 1.5-1.5h13A1.5 1.5 0 0 1 20 6v2.5a2.5 2.5 0 0 0 0 5V18a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18v-4.5a2.5 2.5 0 0 0 0-5Z"/><path d="M14.5 5v14" stroke-dasharray="2 2.2"/></svg>'],
  ['textes', 'Textes et horaires', '<svg viewBox="0 0 24 24"><path d="M5 6.5h14M5 11h14M5 15.5h9"/><circle cx="18" cy="17.5" r="3"/><path d="M18 16v1.6l1 .8"/></svg>'],
  ['photos', 'Photos', '<svg viewBox="0 0 24 24"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><circle cx="9" cy="10.5" r="1.8"/><path d="M4 17l5-4.5 3.5 3 3-2.5 4.5 4"/></svg>'],
];

export default (c) => {
  const D = c.donnees, h = D.horaires.adresses[0], T = tailles();
  const donnees = {
    agenda: D.agenda.dates,
    ardoise: D.ardoise,
    horaires: { semaine: h.semaine, exceptions: h.exceptions || [] },
    reservation: { services: D.reservation.services, fermetures: D.reservation.fermetures, couverts_max: D.reservation.couverts_max, espaces: D.reservation.espaces.map((e) => ({ id: e.id, libelle: e.libelle })), jours_a_l_avance: D.reservation.jours_a_l_avance },
    photos: PHOTOS.map((p) => ({ ...p, l: T[p.nom.split('/')[1]] || [640], url: c.url(p.page, p.ancre) })),
    textes: TEXTES.map((t) => ({ ...t, defaut: c.s(t.cle), url: c.url(t.page, t.ancre) })),
    phototheque: phototheque(T),
    pages: { fetes: c.url('les-fetes', 'dates'), carte: c.url('la-carte'), accueil: c.url('accueil'), reserver: c.url('reserver', 'formulaire'), infos: c.url('infos-pratiques') },
  };
  return html`
<section class="espace" id="espace" data-espace aria-labelledby="espace-titre">
  <div class="conteneur espace__cadre">
    <header class="esp-tete">
      <p class="esp-tete__sur"><span class="esp-demo">Démonstration</span> <span>Les Jardins de l'Hacienda</span></p>
      <h1 id="espace-titre" class="esp-tete__titre">Votre <em>espace</em></h1>
      <p class="esp-tete__texte" data-esp-bonjour>Réservations, événements, textes, horaires et photos&nbsp;: le restaurant gère son site d'ici, sans toucher au code.</p>
    </header>

    <form class="esp-connexion" data-esp-connexion action="#" aria-labelledby="esp-connexion-titre">
      <div class="esp-connexion__carte">
        <span class="esp-connexion__sceau" aria-hidden="true">JH</span>
        <h2 id="esp-connexion-titre">Se connecter</h2>
        <p class="esp-connexion__texte">Espace de démonstration&nbsp;: l'identifiant et le mot de passe sont déjà remplis. Vos modifications restent dans ce navigateur et s'affichent sur le site, pour vous seul.</p>
        <p class="esp-champ"><label for="esp-id">Identifiant</label><input id="esp-id" name="identifiant" value="hacienda" autocomplete="username"></p>
        <p class="esp-champ"><label for="esp-mdp">Mot de passe</label><input id="esp-mdp" type="password" name="mdp" value="demonstration" autocomplete="current-password"></p>
        <button class="bouton esp-connexion__bouton" type="submit">Entrer dans mon espace</button>
        <noscript><p class="esp-connexion__texte">L'espace restaurateur fonctionne avec JavaScript.</p></noscript>
      </div>
      ${c.media({ nom: 'vraie/salle-soleil', alt: c.s('reserver.planPhotoAlt'), cadrage: '50% 45%', classe: 'esp-connexion__photo', sizes: '(max-width: 900px) 92vw, 50vw' })}
    </form>

    <div class="esp-app" data-esp-app hidden>
      <nav class="esp-nav" aria-label="Rubriques de l'espace">
        <ul class="esp-nav__liste">
          ${VUES.map(([id, nom, ico], i) => html`<li><button type="button" class="esp-nav__lien" data-esp-vue="${id}"${i === 0 ? brut(' aria-current="page"') : ''}><span class="esp-ico" aria-hidden="true">${brut(ico)}</span><span>${nom}</span><span class="esp-nav__badge" data-esp-badge="${id}" hidden></span></button></li>`)}
        </ul>
        <p class="esp-nav__pied"><a class="esp-nav__site" href="${c.url('accueil')}">Voir le site <span aria-hidden="true">↗</span></a><button type="button" class="esp-nav__quitter" data-esp-quitter>Se déconnecter</button></p>
        <p class="esp-nav__reset"><button type="button" class="esp-lien" data-tout-effacer>Tout remettre comme livré</button></p>
      </nav>
      <div class="esp-vues">
        ${VUES.map(([id, nom], i) => html`<section class="esp-vue" data-vue="${id}" aria-labelledby="vue-${id}"${i ? brut(' hidden') : ''}>
          <h2 class="esp-vue__titre" id="vue-${id}">${nom}</h2>
          <div class="esp-vue__corps" data-esp-rendu="${id}"></div>
        </section>`)}
      </div>
    </div>
    <p class="esp-toast" data-esp-toast role="status" aria-live="polite"></p>
  </div>
  <script type="application/json" data-esp-donnees>${brut(JSON.stringify(donnees).replace(/<\//g, '<\\/'))}</script>
</section>
`;
};
