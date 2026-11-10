# Ce qui a changé

Chaque version ajoute sa partie en tête de ce fichier, construite en comparant l'archive précédente et la nouvelle, jamais de mémoire.

## v4 — « Deux saisons, une maison », de A à Z

Comparaison de l'archive v3 (commit 832fc7a) et de la v4, fichier par fichier : aucun fichier retiré ; 47 fichiers d'images ajoutés, toutes tailles comprises (l'été : terrasse, piscine, bar, pool party ; trois assiettes vues de dessus ; les tables de 2 à 120 ; la Saint-Sylvestre ; deux illustrations générées, nappe de lin et eau de la piscine), une photo changée (`table-deux` : une table de la salle au lieu de la cheminée de Noël), les autres images refaites par le pipeline de la skill v10.9 ; sources modifiées : les 7 pages (`source/pages/`), le gabarit commun, `critique.js`, `site.css`, `site.js`, `fr.json`, `carte.json`, `accords.json`, `site.json`, `plan-images.json`, pages régénérées ; outils de génération et d'audit repris de la skill v10.9. Les copies des modules et l'adaptateur du socle n'ont pas changé (seul le numéro `?v=4` de leurs imports).

**Une nouvelle structure : deux saisons, une maison**
- Le slogan du lieu devient le moteur du site : un cadran braise et soleil, à faire glisser (ou les boutons « Hiver » et « Été »), et un petit bouton flamme ou soleil dans l'en-tête de chaque page. Toute la maison bascule : lumière, couleurs, photos, accroche, rendez-vous mis en avant, bouton « Réserver au coin du feu » ou « Réserver en terrasse ».
- Par défaut la saison réelle (novembre : l'hiver) ; le choix du visiteur est gardé dans son navigateur. Sans JavaScript et en mode calme : la saison du jour, complète.
- Entre les pages, la lueur de la saison au bord des sections (braise l'hiver, reflet d'eau l'été) remplace la ficelle.

**Accueil : de 10 sections (11 000 px) à 6 sections (7 écrans en 1440 × 900)**
- Ouverture : un titre sur la moitié de l'écran, « Au coin du feu l'hiver, au bord de la piscine l'été » ; le plat fumant devant la cheminée, ou la piscine aux palmiers avec des reflets sur l'eau ; statut « ouvert maintenant » et prochain service sous les boutons. Sur téléphone : titre en haut, plat au milieu, cadran et boutons en bas.
- La carte de la semaine : le plateau du chef à lancer, gardé, avec les rubriques en deux colonnes ; la vapeur du centre du plateau est retirée (une seule vapeur, celle du plat de l'ouverture, pour la fluidité).
- La table se dresse : le dressage dessiné de la v3 est remplacé par trois vraies assiettes du restaurant, vues de dessus, qui se posent une à une sur une nappe de lin (illustration générée) ; la scène finit en plongée dans l'assiette aux cèpes (l'été : dans la piscine illuminée) et s'ouvre sur « Entrez dans la carte de la semaine ».
- Les rendez-vous de la saison : Noël et Saint-Sylvestre avec leurs comptes à rebours et les braises ; l'été, sur l'eau de la piscine (illustration générée), journées festives (juin à septembre, mardi à jeudi, 12 h à 19 h), piscine (dimanche dès 14 h 30), bar (dès 15 h 30 les journées festives, avec droit d'entrée), pool parties.
- Recevoir : « Combien serez-vous ? » remplace le carrousel 3D ; la table s'allonge de 2 à 120 couverts, la grille de photos se recompose, l'espace qui convient s'affiche, et « Demander pour une réception » préremplit la demande des infos pratiques.
- Offrir et venir sur un seul écran : la carte cadeau dorée en aperçu, l'adresse et la carte d'accès (sans temps de trajet).
- Retirés : bandeau de mots géants, ficelle, carrousel 3D, cheminée en plein écran.
- Photos : la salle décorée pour Noël n'apparaît plus qu'une fois sur l'accueil, sur la carte du menu de Noël ; l'été a sa moitié du site (terrasse, piscine, palmiers, bar, pool parties).

**La carte**
- L'ardoise s'écrit trois fois plus vite ; le bâton de craie se range à la fin.
- Les plats se réorganisent sous les yeux quand on filtre (végétarien, à partager).
- Fin de page : « Une table vous attend », le prochain service et le bouton de réservation.
- Allergènes : « Informations sur les allergènes disponibles sur demande ».

**Les fêtes**
- Le menu de Noël se révèle plat par plat, chacun sous sa cloche.
- Saint-Sylvestre : « Amuse-bouche » (et non « Bouchée gourmande »), verre des accords gardé.
- Plus aucun « à compléter » : horaires de la soirée et acompte « donnés à la réservation ».
- En tête de page, « Baptême, anniversaire, mariage : demander une réception » mène à la demande des infos pratiques.
- Le Grand Buffet : « Les dimanches d'août 2026 », comme au relevé.

**Réserver**
- Le jour, le service, l'heure et les couverts d'abord ; « Choisir ma table » ensuite, facultatif.
- Les couverts se règlent une seule fois (le plan lit ceux du formulaire) ; tables indisponibles : « Indisponible (simulation) ».
- À l'envoi, une carte de placement « Réservé · samedi 14 novembre · 20 h · 4 couverts · table 2 » passe sous la cloche, qui se relève ; sur le plan, l'étiquette posée sur la table devient le même carton.
- Sur téléphone, la liste des tables d'abord, puis le plan agrandissable.
- « Réserver la soirée » de la Saint-Sylvestre arrive sur le jeudi 31 décembre au soir, ouvert (il tombait sur un service fermé, celui des jeudis ordinaires).
- L'été, la page le dit : « en terrasse, l'été », la terrasse et la piscine de juin à septembre, la salle le reste de l'année.

**Offrir**
- Sous l'enveloppe : « Carte prête, à remettre à … », puis « Offrir une autre carte » ; remise : « Pour la recevoir, appelez-nous au 06 18 21 28 10. »

**Infos pratiques**
- Le cadran des horaires se manipule : on choisit un jour, on fait glisser l'aiguille, « Samedi à 20 h : ouvert » ; le centre du cadran montre le moment choisi.
- Stationnement et fermetures exceptionnelles retirés (aucune information vraie) ; la demande de réception arrive préremplie depuis l'accueil (sujet, nombre d'invités), avec deux champs de plus : date souhaitée, nombre d'invités.
- Bandeau des villes : Metz, Thionville, Luxembourg (Nancy retirée, absente du site actuel).

**Partout**
- Aucun « à compléter » hors du pied de page (voir la fiche du README : faits retirés ou dits autrement).
- Les comptes à rebours affichent directement le nombre de jours.
- La carte cadeau dorée partout (accueil et Offrir), « Carte cadeau » lisible.
- Petits téléphones : nom de la maison sur deux lignes dans l'en-tête, le bouton Menu toujours dans l'écran.
- Audit complet de la version finale (7 pages, 13 tailles, tous les modes) : 0 échec, 10 points à regarder ; fluidité de l'accueil sous le seuil (7 % d'images lentes sur ordinateur ralenti 4 fois, 0 % au doigt). Test « vrai visiteur » : les 7 missions dans le barème, sur téléphone et sur ordinateur.

## v3 — sections claires, carrousel, finitions

Comparaison de l'archive v2 et de la v3, fichier par fichier : 12 fichiers source modifiés (`site.css`, `site.js`, quatre pages, `fr.json`, `site.json`, `images.json`, `plan-images.json`, deux images de baptême refaites), pages régénérées ; 3 images retirées (`recevoir-baptemes-960.webp`, la nouvelle photo est plus petite ; `infos-ouverture-mobile-640.webp` et `-1080.webp`, l'enseigne n'est plus recadrée pour le téléphone).

**Du clair pour casser le sombre**
- Accueil : « Faites tourner le plateau », « Recevoir aux Jardins » et « Venir aux Jardins » passent sur la nappe crème (encre brune, accent braise foncé).
- Réserver : le formulaire « Le jour, l'heure, les couverts » sur la nappe, comme une fiche ; le plan de salle reste en bois sombre.
- Infos pratiques : « Une demande » sur la nappe.

**Le carrousel « Recevoir aux Jardins »**
- Cartes plus grandes (jusqu'à 380 px), trois cartes visibles (celle de face et ses voisines qui s'estompent) au lieu de deux cartes isolées, légende seulement sous la carte de face, rotation plus douce.
- Baptêmes : une vraie photo de famille du site à la place d'une tablée de mariage.

**Finitions (regard neuf)**
- L'intro complète reste sur l'accueil ; sur les autres pages, elle passe trois fois plus vite.
- Titres plein écran (« Au creux de la cheminée », « Chaque semaine, une nouvelle carte ») : les mots qui s'écartent restent dans l'écran.
- Réserver : le bouton « Réserver cette table » en attente est lisible ; si un champ manque, il est ramené à l'écran avec son message.
- Offrir : le montant n'est plus dit deux fois (la carte de l'ouverture montre 50 €).
- Infos pratiques : l'enseigne n'est plus coupée sur téléphone (« les jardins de l'hacienda » en entier).
- Pied de page : sommaire sur deux colonnes sur téléphone ; mention « Illustration générée » plus discrète.

## v2 — ajustements d'effets

Comparaison de l'archive v1 et de la v2, fichier par fichier : 4 images ajoutées, 7 fichiers source modifiés (`site.css`, `site.js`, `assiette-pintade.html`, `la-carte.mjs`, `fr.json`, `site.json`, `plan-images.json`), pages régénérées, rien de retiré.

**L'accueil**
- La scène « Le chef dresse le suprême de pintade » est repeinte en gravure laiton et crème sur une assiette d'ardoise, dans l'esprit de la cloche, au lieu du dessin en couleurs.

**La carte**
- Nouvelle section entre l'ardoise et la carte : une assiette du chef (photo du site) qui s'ouvre jusqu'au plein écran, « Chaque semaine, une nouvelle carte ».
- L'ardoise s'écrit deux fois plus vite, et le bâton de craie se retire plus tôt.

**Réserver**
- Les tables indisponibles du plan affichent « Indisponible (simulation) » au lieu de « Prise ce soir » (faux pour un autre jour, et appliqué aussi à la terrasse fermée).
- Sur ordinateur, le panneau « Réserver cette table » est plus compact et cache moins la liste des tables.

**Fluidité**
- Pour garder l'accueil sous le seuil de 10 % d'images lentes : vapeur un peu plus légère, carrousel 3D qui tourne de 72° au défilement (au lieu de 90°).

**Technique**
- Numéro de version des fichiers : ?v=2.

## v1 — la base

Première version : pas d'archive précédente, cette partie décrit ce qui est livré.

**Les pages**
- 6 pages et une page introuvable : accueil, la carte, les fêtes, réserver, offrir, infos pratiques, « Table introuvable ».
- En français seul, sans son. Menu à 5 entrées et bouton « Réserver une table » toujours visible ; sur téléphone, menu plein écran avec « Réserver » et « Appeler ».

**La direction « La table du soir »**
- Fond fumée, nappe crème, braise et laiton ; titres en Bodoni Moda, texte en Figtree, mots écrits à la main en Caveat.
- Intro : une cloche de service en laiton s'ouvre sur le nom du restaurant puis rejoint le plat fumant de l'accueil ; le passage d'une page à l'autre se fait sous une cloche qui se pose et se relève.
- Une ficelle de cuisine court dans la marge de chaque page et se noue sur les objets clés.

**L'accueil**
- Plat fumant en ouverture (vapeur animée qui suit la souris), titre qui se condense dans la vapeur.
- Sous les boutons : « ouvert maintenant » (ou la prochaine ouverture), calculé d'après les horaires, et la Saint-Sylvestre à 120 €, en liens.
- Bandeau de plats en mots géants, plateau du chef en 3D à faire tourner (quatre plats, la vapeur au-dessus), le chef qui dresse le suprême de pintade aux girolles au défilement, la cheminée en plein écran avec ses braises, les fêtes avec leurs comptes à rebours, les réceptions en carrousel 3D, la carte cadeau, venir.

**Les fonctionnalités restaurant (9 modules de la bibliothèque, réglés sans être réécrits)**
- La carte : ardoise à la craie (4 plats de saison), toute la carte réelle avec ses prix, filtres « végétarien » et « à partager » (le lien de l'ardoise amène directement aux plats végétariens), recherche.
- Les fêtes : menu de Noël (25 décembre au déjeuner, 79 €) et Saint-Sylvestre (120 €, 170 € avec les vins), accords mets et vins plat par plat.
- Réserver : plan de la salle en 3D (indicatif), la table choisie file vers le formulaire de réservation, prérempli (réservation simulée) ; ou accès direct au formulaire sans choisir de table.
- Offrir : carte cadeau de 25 à 200 € composée en direct, prénom et mot sur la carte, scellée dans son enveloppe (achat simulé).
- Infos pratiques : « ouvert maintenant » d'après les horaires (à confirmer), le numéro en grand, l'accès, journées festives, piscine et bar, demande de renseignements (simulée).

**Images**
- Photos du site actuel (plats, salle, cheminée, terrasse, réceptions), recadrées et compressées en plusieurs tailles ; 7 illustrations générées par IA, signalées « Illustration générée ».
- Une image de partage par page (1200×630).

**Mise en ligne**
- Site statique pour Vercel, non indexé (noindex) tant que c'est une maquette.
- Contrôlé par l'audit standard et la passe des formats, et par un test « vrai visiteur ».
