# Plan v4 « Deux saisons, une maison » (validé le 10/11 à 16 h 30 : direction 1, lueur hors marge, la table se dresse, site + 3 Grok)

Projet v4 : /home/claude/v4/jardins-hacienda-2-maquette (clone du dépôt, commit 832fc7a = v3). Bibliothèque : /home/claude/v4/bibliotheque-maquettes.
Garder : assets/js/modules/* (corrigés M1-M20) et assets/js/socle/socle.js (adaptateur), jamais remplacés par la bibliothèque.

## Saison (effet signature, famille ambiance-qui-change, data-effet="saison", data-grille="manipuler")
- html[data-saison="hiver"|"ete"] ; défaut = saison réelle à Paris (oct.-avril hiver, mai-sept. été) ; choix gardé en localStorage (try/catch) clé jh-saison.
- Cadran braise/soleil en demi-lune laiton (glisser, élan ; clavier flèches ; boutons « Hiver » « Été » accessibles) dans l'ouverture + mini-cadran dans l'en-tête (toutes pages).
- Bascule : variables CSS (palette), photos [data-hiver]/[data-ete] (deux figures, fondu), textes [data-saison-texte] (deux spans), bouton principal « Réserver au coin du feu » / « Réserver en terrasse », rendez-vous de la saison.
- Mode calme / sans JS : saison en cours complète (CSS par défaut = hiver en novembre : html sans JS → classe par défaut écrite à la génération selon la date de génération).
- Lien entre pages (point 4, data-grille="fil") : « lueur de saison » hors marge : braise qui monte du bas de chaque section (hiver), reflet d'eau qui ondule en haut (été). data-effet="lueur".

## Accueil (6 sections, 7 écrans max)
1. Ouverture : titre géant (moitié d'écran) « Au coin du feu l'hiver, au bord de la piscine l'été » ; cadran ; hiver = plat fumant (module plat-fumant) devant la cheminée ; été = terrasse-13 piscine + reflets (WebGL onde du socle ou caustiques CSS) ; boutons Réserver (libellé saisonnier) + Voir la carte ; statut ouvert + prochain service. data-iris-centre sur le plat / la piscine.
2. La carte de la semaine : plateau qu'on lance (objet-a-faire-tourner, gardé), vrais plats, végétarien.
3. La table se dresse (scène, data-grille="scene", famille plongee pour l'entrée ? non : plongée = transition vers la carte) : nappe (grok/nappe-lin), couverts dessinés, 3 vraies assiettes vues de dessus (restaurant-2 recadré, restaurant-33, terrasse-jardins-hacienda-6) qui se posent une à une ; module assiette-qui-se-dresse (mécanique épinglée), étapes vraies (produits de saison, carte de la semaine, service).
   Plongée (famille plongee, data-effet="plongee") : fin de la scène, on entre dans l'assiette centrale (hiver) ou dans l'eau (été, grok/eau-reflets) et on ressort sur « La carte » (lien).
4. Les rendez-vous de la saison : hiver Noël (25/12 déj., 79 €) + Saint-Sylvestre (31/12, 120 / 170 €) avec décomptes ; été journées festives (juin-sept., mar-mer-jeu, 12 h-19 h), piscine (dès 14 h 30 le dimanche), bar (dès 15 h 30 les journées festives, droit d'entrée), pool parties l'été (sans date). Particules : braises (hiver) / reflets (été).
5. Recevoir « la table qui s'agrandit » (famille recomposition, data-effet="table-agrandit") : curseur « Combien serez-vous ? » 2 → 12 → 40 → 120 ; table dessinée qui s'allonge, couverts qui se multiplient, la grille de photos se recompose ; espace qui convient (salle / grande table / terrasse / jardins et pergola) ; lien « Demander pour une réception » → /infos-pratiques?sujet=reception&invites=N#ecrire. Photos : mariages (pergola), baptême (parents-enfant), cocktail palmiers (terrasse-26), salle.
6. Offrir et venir : carte cadeau en aperçu (lien Offrir), accès (6 Vathier Haye, Moineville, entre Metz, Thionville, Luxembourg), pas de temps de trajet.
Retirés : mots géants, ficelle (fil-conducteur), carrousel 3D, cheminée plein écran.

## Pages
- La carte (titre propre « La carte de la semaine » ≠ accueil) : ardoise grande et rapide (prix d'abord ? module : vitesse 3), bâton rangé (M14) ; recomposition visible au filtre (grille qui se réorganise : FLIP CSS sur .carte-resto__plat) ; onglets fond plein + scroll-margin (B9) ; fin d'appel « Une table vous attend » + prochain service + Réserver (B10) ; allergènes : « Informations sur les allergènes disponibles sur demande ».
- Les fêtes : Noël plat par plat sous cloches (B12) ; Saint-Sylvestre verre des accords ; soirées passées « A eu lieu » (B11) ; libellés exacts (affiche : « Bouchée gourmande » EST sur l'affiche, vérifié) ; aucun « à compléter ».
- Réserver : formulaire d'abord (jour, service, heure, couverts) ; « Choisir ma table (facultatif) » ensuite ; couverts une seule fois (plan lit les couverts du formulaire) ; tables indisponibles « Indisponible (simulation) » ; retour physique : carte de placement « Réservé · samedi 20 h · 4 couverts » qui se pose sur la table du plan (ou sur la nappe si pas de table), la cloche la couvre puis se relève ; téléphone : liste des tables puis plan agrandissable.
- Offrir : une seule fourchette ; « Carte cadeau » lisible ; sous l'enveloppe « Carte prête, à remettre à {pour} » + « Offrir une autre carte » ; remise : « Pour la recevoir, appelez-nous au 06 18 21 28 10 ».
- Infos pratiques : cadran des horaires manipulable (glisser l'aiguille : jour + heure → ouvert/fermé) ; stationnement et fermetures exceptionnelles retirés (aucune info) ; demande préremplie (sujet, invités).
- Partout : photos variées (une fois par page, deux fois max sur le site), titres de pages propres, intro courte hors accueil, aucun « à compléter » hors pied de page.

## Contrôles
Audit complet final 0 échec ; fluidité (bascule comprise) ; visiteur 7 missions (faim sans geste ; ouvert ce soir ≤ 2 gestes ; samedi 20 h 4 pers. salle ≤ 3 gestes jusqu'à la date ; végétarien ; carte 100 € ; réception baptême 40 pers. ; voir le lieu en été) ; regard neuf vs 3 dernières + v3.
