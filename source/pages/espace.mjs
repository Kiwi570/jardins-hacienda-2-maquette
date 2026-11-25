/* Espace restaurateur (v7.6.0, application en v7.7.0) : la démonstration de l'outil que le restaurant aurait pour gérer son site.
   Connexion fictive, puis cinq rubriques : Aujourd'hui, Réservations (agenda, confirmer, refuser, fermer un service),
   Événements, Textes et horaires (annonce, horaires, fermetures, ardoise, textes), Photos (remplacer, cadrer).
   Tout est enregistré dans ce navigateur (localStorage) et s'affiche sur le site grâce à assets/js/espace-apercu.js ;
   une réservation faite sur /reserver arrive dans l'agenda. Le contenu des rubriques est rendu par assets/js/espace.js.
   v7.7.0 : une fois connecté, l'en-tête de l'espace devient la barre de l'application (état de l'enregistrement, voir le
   site, plus d'actions) ; les rubriques passent en bas de l'écran sur téléphone ; le message du bas porte « Annuler ».
   v7.7.1 : la barre « Que voulez-vous faire ? » (bouton de la barre du haut, bouton rond sur téléphone, Cmd ou Ctrl + K). */
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

/* Les rubriques : identifiant, nom, nom court (barre du bas, sur téléphone), icône. v7.7.2 : cinq rubriques ; « Site » regroupe
   en onglets les soirées, l'annonce et les horaires, les textes, les messages et les photos (dessinés par espace.js). */
const VUES = [
  ['jour', 'Aujourd\'hui', 'Jour', '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></svg>'],
  ['demandes', 'Demandes', 'Demandes', '<svg viewBox="0 0 24 24"><path d="M4 13.5V6.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7M4 13.5h4.5l1.2 2.5h4.6l1.2-2.5H20M4 13.5v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/></svg>'],
  ['resas', 'Agenda', 'Agenda', '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.6h17M8 3v4M16 3v4M8 13.5h2M14 13.5h2M8 17h2"/></svg>'],
  ['carte', 'Offres', 'Offres', '<svg viewBox="0 0 24 24"><path d="M6 3.5h9.5L19 7v13.5H6zM15 3.5V7.5h4M9 11.5h6.5M9 14.8h6.5M9 18h4"/></svg>'],
  ['clients', 'Clients', 'Clients', '<svg viewBox="0 0 24 24"><circle cx="9" cy="8.5" r="3.3"/><path d="M2.8 19.5a6.2 6.2 0 0 1 12.4 0M16 5.6a3.1 3.1 0 0 1 0 5.9M17.6 14.3a5.6 5.6 0 0 1 3.6 5.2"/></svg>'],
  ['site', 'Site', 'Site', '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M3.5 9h17M6.5 7h.1M9 7h.1M7 13h6M7 16h10"/></svg>'],
];
const ICO_LOUPE = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>';
const ICO_SERVICE = '<svg viewBox="0 0 24 24"><path d="M4 17.5h16M5.5 17.5a6.5 6.5 0 0 1 13 0M12 8V6M10 6h4M3 20.5h18"/></svg>';
const ICO_BILAN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 19.5h15M7.5 16.5v-5M12 16.5v-9M16.5 16.5v-6.5"/></svg>';
const ICO_REGLAGES = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h11M19 17h1"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="17" r="2"/></svg>';
const ICO_PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>';

export default (c) => {
  const D = c.donnees, h = D.horaires.adresses[0], T = tailles();
  const donnees = {
    agenda: D.agenda.dates,
    ardoise: D.ardoise,
    horaires: { semaine: h.semaine, exceptions: h.exceptions || [] },
    reservation: { services: D.reservation.services, fermetures: D.reservation.fermetures, couverts_max: D.reservation.couverts_max, espaces: D.reservation.espaces.map((e) => ({ id: e.id, libelle: e.libelle, ...(e.mois ? { mois: e.mois } : {}) })), jours_a_l_avance: D.reservation.jours_a_l_avance,
      /* v7.8.0 : tout ce que lisent les règles communes (disponibilites.js), comme sur la page Réserver. */
      ouvertures_exceptionnelles: D.reservation.ouvertures_exceptionnelles || [], derniere_arrivee_avant_fermeture: D.reservation.derniere_arrivee_avant_fermeture || {}, delai_minutes: D.reservation.delai_minutes },
    photos: PHOTOS.map((p) => ({ ...p, l: T[p.nom.split('/')[1]] || [640], url: c.url(p.page, p.ancre) })),
    textes: TEXTES.map((t) => ({ ...t, defaut: c.s(t.cle), url: c.url(t.page, t.ancre) })),
    phototheque: phototheque(T),
    /* v7.7.2 : les produits de la page Traiteur (demandes de démonstration) et le téléphone du restaurant (messages aux clients). */
    produits: D.emporter.produits.map((p) => ({ id: p.id, nom: p.nom, prix: p.prix, unite: p.unite })),
    /* v7.7.3 : la carte du site (rubriques et plats), que l'espace modifie sans toucher au fichier. */
    carte: D.carte.rubriques.map((r) => ({ id: r.id, titre: r.titre, plats: r.plats.map((p) => ({ id: p.id, nom: p.nom, description: p.description || '', prix: p.prix ?? '', vegetarien: !!p.vegetarien })) })),
    telephone: c.site.contact.telephone,
    /* v7.7.6 : les tables du plan de la page Réserver, pour le plan de salle de l'espace. */
    salle: { zones: D.salle.zones, assemblages: (D.salle.assemblages || []).map((a) => ({ tables: a.tables, places: a.places })), tables: D.salle.tables.map((t) => ({ id: t.id, zone: t.zone, places: t.places, forme: t.forme, x: t.x, y: t.y, l: t.l, ...(t.h ? { h: t.h } : {}), ...(t.note ? { note: t.note } : {}) })) },
    /* v7.12.0 : les espaces de réception et leurs hypothèses de démonstration (donnees/receptions.json). */
    receptions: { espaces: D.receptions.espaces, durees: D.receptions.durees, taches: D.receptions.taches, lignes: D.receptions.lignes, cadeaux: D.cadeaux.montants,
      /* v7.14.0 : les produits de la page À emporter, base du catalogue traiteur (et la période de retrait annoncée). */
      emporter: D.emporter.produits.map((p) => ({ id: p.id, nom: p.nom, texte: p.texte, prix: p.prix, unite: p.unite })), retraits: { debut: D.emporter.debut, fin: D.emporter.fin } },
    pages: { emporter: c.url('a-emporter', 'produits'), offrir: c.url('offrir', 'composer'), receptions: c.url('receptions'), fetes: c.url('les-fetes', 'dates'), carte: c.url('la-carte'), accueil: c.url('accueil'), reserver: c.url('reserver', 'formulaire'), infos: c.url('infos-pratiques') },
  };
  return html`
<section class="espace" id="espace" data-espace aria-labelledby="espace-titre">
  ${brut(`<script>try{if(sessionStorage.getItem('jh-espace-session')==='1')document.documentElement.classList.add('esp-dedans')}catch(e){}</script>`)}
  <div class="conteneur espace__cadre">
    <header class="esp-tete">
      <p class="esp-tete__sur"><span class="esp-demo"><span class="esp-long">Démonstration</span><span class="esp-court">Démo</span></span> <span class="esp-tete__maison">Les Jardins de l'Hacienda</span></p>
      <h1 id="espace-titre" class="esp-tete__titre">Votre <em>espace</em></h1>
      <p class="esp-tete__texte">Réservations, événements, textes, horaires et photos&nbsp;: le restaurant gère son site d'ici, sans toucher au code.</p>
      <div class="esp-outils" data-esp-outils hidden>
        <button type="button" class="esp-quoi" data-esp-quoi><span class="esp-quoi__ico" aria-hidden="true">${brut(ICO_LOUPE)}</span><span>Que voulez-vous faire&nbsp;?</span><kbd class="esp-quoi__touche" data-esp-quoi-touche aria-hidden="true">Ctrl K</kbd></button>
        <p class="esp-sauve" data-esp-sauve data-etat="ok"><span class="esp-sauve__point" aria-hidden="true"></span><span data-esp-sauve-texte>Tout est enregistré</span></p>
        <button type="button" class="esp-outils__demo" data-demo-lancer hidden>Lancer une démonstration</button>
        <a class="esp-outils__site" href="${c.url('accueil')}">Voir le site <span aria-hidden="true">↗</span></a>
        <div class="esp-menu">
          <button type="button" class="esp-rond esp-menu__bouton" data-esp-plus aria-expanded="false" aria-controls="esp-menu-panneau" aria-label="Plus d'actions">${brut(ICO_PLUS)}</button>
          <div class="esp-menu__panneau" id="esp-menu-panneau" data-esp-plus-panneau hidden>
            <a href="${c.url('accueil')}">Voir le site <span aria-hidden="true">↗</span></a>
            <button type="button" data-bilan-ouvrir="semaine">Bilans</button>
            <button type="button" data-mise-ouvrir>Préparer l'outil pour votre restaurant</button>
            <button type="button" data-visite-lancer data-demo-seulement>Visite guidée</button>
            <button type="button" data-demo-lancer data-demo-menu>Lancer une démonstration</button>
            <button type="button" data-esp-installer>Installer sur cet appareil</button>
            <button type="button" data-esp-quitter>Se déconnecter</button>
            <button type="button" class="esp-menu__danger" data-tout-effacer>Tout remettre comme livré</button>
          </div>
        </div>
      </div>
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
          ${VUES.map(([id, nom, court, ico], i) => html`<li${['jour', 'demandes'].includes(id) ? '' : brut(' class="esp-nav__ordi"')}><button type="button" class="esp-nav__lien" data-esp-vue="${id}"${i === 0 ? brut(' aria-current="page"') : ''}><span class="esp-ico" aria-hidden="true">${brut(ico)}</span><span class="esp-long">${nom}</span><span class="esp-court">${court}</span><span class="esp-nav__badge" data-esp-badge="${id}" hidden></span></button></li>`)}
          <li class="esp-nav__tel"><button type="button" class="esp-nav__lien" data-esp-service><span class="esp-ico" aria-hidden="true">${brut(ICO_SERVICE)}</span><span class="esp-court">Service</span></button></li>
          <li class="esp-nav__tel"><button type="button" class="esp-nav__lien" data-esp-plusnav-bouton aria-expanded="false" aria-controls="esp-plusnav"><span class="esp-ico" aria-hidden="true">${brut(ICO_PLUS)}</span><span class="esp-court">Plus</span></button></li>
        </ul>
        <div class="esp-plusnav" id="esp-plusnav" data-esp-plusnav hidden>
          <p class="esp-plusnav__titre">Les autres rubriques</p>
          <ul>${VUES.filter(([id]) => !['jour', 'demandes'].includes(id)).map(([id, nom, , ico]) => html`<li><button type="button" class="esp-plusnav__lien" data-esp-vue="${id}"><span class="esp-ico" aria-hidden="true">${brut(ico)}</span>${nom}</button></li>`)}
            <li><button type="button" class="esp-plusnav__lien esp-plusnav__lien--raccourci" data-aller="carte" data-onglet-carte="carte"><span class="esp-ico" aria-hidden="true">${brut(VUES[3][3])}</span>Modifier la carte</button></li>
            <li><button type="button" class="esp-plusnav__lien esp-plusnav__lien--raccourci" data-bilan-ouvrir="semaine"><span class="esp-ico" aria-hidden="true">${brut(ICO_BILAN)}</span>Bilans</button></li>
            <li><button type="button" class="esp-plusnav__lien esp-plusnav__lien--raccourci" data-mise-ouvrir><span class="esp-ico" aria-hidden="true">${brut(ICO_REGLAGES)}</span>Préparer l'outil pour votre restaurant</button></li></ul>
        </div>
      </nav>
      <button type="button" class="esp-fab" data-esp-quoi aria-label="Que voulez-vous faire ?"><span aria-hidden="true">${brut(ICO_LOUPE)}</span></button>
      <div class="esp-vues">
        ${VUES.map(([id, nom], i) => html`<section class="esp-vue" data-vue="${id}" aria-labelledby="vue-${id}"${i ? brut(' hidden') : ''}>
          <h2 class="esp-vue__titre" id="vue-${id}" tabindex="-1">${nom}</h2>
          <div class="esp-vue__corps" data-esp-rendu="${id}"></div>
        </section>`)}
      </div>
    </div>
    <div class="esp-toast" data-esp-toast>
      <p class="esp-toast__texte" role="status" aria-live="polite" data-esp-toast-texte></p>
      <a class="esp-toast__lien" data-esp-toast-lien href="${c.url('accueil')}" hidden>Voir sur le site</a>
      <button type="button" class="esp-toast__annuler esp-toast__action" data-esp-toast-action hidden>Voir</button>
      <button type="button" class="esp-toast__annuler" data-esp-annuler hidden>Annuler</button>
    </div>
  </div>
  <script type="application/json" data-esp-donnees>${brut(JSON.stringify(donnees).replace(/<\//g, '<\\/'))}</script>
</section>
`;
};
