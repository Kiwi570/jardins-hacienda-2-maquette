# Ce qui a changé

Chaque version ajoute sa partie en tête de ce fichier, construite en comparant l'archive précédente et la nouvelle, jamais de mémoire.

## v7 — vraies photos, une scène par page, les modules restaurant de la bibliothèque

Comparaison de l'archive v6 (commit 0cc7532) et de la v7, fichier par fichier : 21 vraies photos du site actuel ajoutées en grand format (`assets/images/vraie/`, originaux dans `recu/site/`, choisies parmi les 366 images récupérées le 11 novembre 2026) et l'enseigne détourée ; 10 modules de la bibliothèque ajoutés (`assets/js/modules/` : ardoise-a-la-craie, assiette-qui-se-dresse, plat-fumant, givre-webgl, agenda-des-dates, depliant-3d, rideau-en-lanieres, ciel-en-direct, formulaire-par-etapes, lumiere-au-pointeur) avec OGL (`assets/vendor/ogl.min.js`) et la police Caveat (licence jointe) ; données ajoutées : `donnees/ardoise.json`, `donnees/agenda.json` ; les couches de la passe tirées d'une vraie photo (`assets/images/vraie/passe/`) ; les deux boucles vidéo quittent le site (gardées dans `recu/videos-v6/`). Sources modifiées : les 8 pages, le gabarit commun (pied de page), `site.js`, `site.css`, l'adaptateur `socle/socle.js` (OGL à la demande), `socle/voile.js`, `socle/ouverture.js`, `socle/transitions.js`, le script et le style critiques, `fr.json`, `site.json` (version 7), `images.json`, `plan-images.json`, `_audit/releve.md` (compléments du 11 novembre). Gardés tels quels dans leur logique : la réservation et sa carte de placement, le plan de salle, la carte cadeau et son enveloppe, la carte, les fêtes, les horaires, les accords de la Saint-Sylvestre, la transition en assiette, le statut ouvert ou fermé.

**De vraies photos de la maison partout**
- 12 h 30 : la salle au soleil de midi (tables rondes en verre, baies vitrées) à la place de l'assiette générée.
- 14 h 30 : un seul panorama de la piscine et de la grande pergola que l'on parcourt en défilant ; l'heure avance de 14:30 à 19:00, l'ombre gagne et la lumière dore ; les journées festives, le bar, la piscine et les pool parties s'allument à leur place sur la photo (la galerie de quatre vignettes est retirée).
- 21 h : la vraie assiette devant la cheminée ; la vapeur monte du plat et s'écarte sous la main (module plat-fumant ; plus de vidéo).
- Réceptions : la pergola dressée pour un mariage en ouverture ; les espaces en vraies photos (la salle et son mur de pierre, le brasero sous la pergola, la piscine sous les palmiers) ; « Mariages » et « Anniversaires » avec des photos nettes de la maison.
- Les fêtes l'été, Réserver, Infos pratiques, la page fermée : vraies photos (piscine, paillotes, lanternes au-dessus de l'eau la nuit, la salle).
- La mention « Illustration générée » reste sur chaque image générée, plus discrète ; une ligne du pied de page l'explique.

**Une scène à chaque page**
- La carte : l'ardoise de la semaine, écrite à la craie (celle du midi ou du soir selon l'heure réelle) ; « Passer au dîner » l'efface au chiffon et la réécrit. Sur la passe, une vraie assiette du chef se dresse au défilement : la photo du site, découpée en couches (purée, pièce rôtie, girolles, légumes, herbes), qui se posent nettes une à une sur la même assiette floue et dans l'ombre. La page finit sur une vraie assiette en grand.
- Les fêtes : le décompte de la Saint-Sylvestre derrière une vitre givrée qui fond sous la main ; les prochaines dates (soirée côte de bœuf le 21 novembre, raclette le 28, brunch le 29, soirée libanaise le 19 décembre, Noël, Saint-Sylvestre) avec l'ajout à l'agenda et « Réserver » au bon jour, les dates passées en dessous ; le menu de Noël en dépliant de trois volets qui s'ouvre au défilement.
- Réceptions : en arrivant d'une autre page, le voile violet de 19 h s'ouvre en palmes qui s'écartent sur la pergola.
- Infos pratiques : le vrai ciel de Moineville à l'heure qu'il est (soleil, lune et étoiles calculés pour le lieu ; un curseur pour voir une autre heure) au-dessus de la vraie enseigne ; une vraie carte d'accès (Moselle, A31, frontière ; 19 km de Metz, 24 km de Thionville, 47 km de Luxembourg à vol d'oiseau) ; « Une question » en quatre étapes avec de grandes cartes de choix.
- La page fermée : la salle dans le noir ; une bougie suit la main et l'éclaire.
- Offrir : « Offrir un moment aux Jardins » (le titre ne contredit plus l'exemple du déjeuner).

**L'accueil**
- La nuit et le matin, l'intro s'arrête d'abord sur l'heure réelle (« 01:26 · la maison dort. Rendez-vous à midi. ») avant de rouler jusqu'à midi.
- 23 h : « Au creux de la cheminée », les mots du site, au-dessus de « Au coin du feu ».
- 23 h 30 : sous Noël et la Saint-Sylvestre, la prochaine date à venir (calculée au jour réel).
- Minuit : offrir seul, en plein écran, la carte qui brille dans le noir ; « Venir » passe au pied de page (distances et lien vers l'accès).

**Partout**
- Deux styles d'heure seulement : le jour, fine et bleu canard ; à partir de 19 h, grasse et braise.
- La transition entre les pages est plus courte (le voile ne s'attarde plus) et devient un ciel : la couleur de l'heure de départ en bas, celle de l'heure d'arrivée en haut.
- Réserver sans cadres : jours et créneaux en texte, la sélection en pastille pleine, le récapitulatif en ticket à bords dentelés, la liste des tables en lignes.
- Une heure par page, partout : Les fêtes 23:30, Réserver 21:00 le soir (voile, en-tête et ouverture disent la même).
- Typographie : espace insécable avant « ; », « ! », « ? », point médian jamais en début de ligne.

**Après le test « vrai visiteur » (Claire, de Thionville, sept missions sur téléphone et sur ordinateur) et le regard neuf**
- Les dates des fêtes : chaque date dans sa colonne, comptée en jours de calendrier ; « Réserver » ouvre le formulaire au bon jour et rappelle la soirée choisie ; Noël et la Saint-Sylvestre sans heure inventée.
- Infos pratiques : l'adresse et les distances dès le premier écran, « Une question ? » et « Venir » en raccourcis ; l'enseigne à droite, le texte à gauche ; la grande heure suit l'heure choisie sur le ciel.
- La passe de La carte en vraie photo (le dessin était jugé plat) ; le bouton de fin suit le service affiché.
- Le message de fin d'« Une question » revient à l'écran ; « Faire une autre réservation » est lisible ; l'été, le logo des Fêtes reste visible ; la 404 reste lisible sur téléphone ; Réceptions s'ouvre plus clair.

**Après l'audit complet (13 tailles)**
- La vitre givrée ne se redessine que quand elle change, jamais pendant le défilement, et ne s'installe qu'au repos en haut de page : Les fêtes défilent sans à-coup sur un ordinateur lent.
- Les fêtes : Noël avant la Saint-Sylvestre ; le titre de la Saint-Sylvestre ne chevauche plus son texte ; les scènes épinglées tiennent sur les écrans bas.

## v6 — « De midi à minuit », refonte de A à Z

Comparaison de l'archive v5 (commit 9b8e0a0) et de la v6, fichier par fichier : 112 fichiers retirés (les images de la v5 refaites ou abandonnées, dont 9 illustrations générées : nappe de lin, eau de la piscine, braises, bougies, ouvertures de Réserver et d'Offrir… ; les polices Bodoni Moda, Caveat et Figtree ; 6 modules qui ne servent plus : ardoise à la craie, assiette qui se dresse, carrousel 3D, fil conducteur, objet à faire tourner, plat fumant ; `donnees/ardoise.json` et le fragment de l'assiette) ; 44 fichiers ajoutés (une page Réceptions, 10 nouvelles illustrations générées en 29 fichiers, 2 boucles vidéo, les polices Bricolage Grotesque et Instrument Serif avec leurs licences, les positions des ampoules de la terrasse, 2 images de partage) ; sources modifiées : toutes les pages, le gabarit commun, le socle (repris de la skill v10.9.2), `site.css` et `site.js` réécrits, `fr.json`, `site.json`, `carte.json`, `images.json`, `plan-images.json`. Gardés tels quels dans leur logique : la réservation et sa carte de placement, le plan de salle, la carte cadeau qui s'écrit et son enveloppe, la carte, les fêtes, les horaires, les accords de la Saint-Sylvestre, la transition en assiette, le statut ouvert ou fermé.

**Une nouvelle idée : une journée à l'Hacienda**
- L'accueil suit les vraies heures de la maison : 12 h la piscine (l'eau bouge sous le doigt), 12 h 30 le déjeuner (cinq plats de la carte avec leurs prix), 14 h 30 l'après-midi d'été (piscine, bar, journées festives, pool parties, de côté), 19 h la terrasse s'allume, 21 h le dîner (réserver dans la page), 23 h au coin du feu, 23 h 30 la Saint-Sylvestre et Noël avec leur compte à rebours, minuit offrir et venir.
- L'horloge de l'en-tête suit le défilement, et la lumière de la page passe du blanc de midi à la braise de minuit (couleur de l'en-tête, épaisseur des lettres).
- Chaque moment dit sa saison réelle : « Piscine et terrasse de juin à septembre », « Cet hiver ». Plus de cadran des deux saisons.
- 19 h, la terrasse s'allume : au défilement, le soleil se couche sur la grande table (trois états de la même image), puis les guirlandes s'allument ampoule après ampoule, sur les vraies ampoules de l'image ; on peut aussi les allumer du doigt.
- 23 h : la fenêtre de la salle s'ouvre jusqu'au plein écran ; les braises suivent la main.
- 21 h : choisir le prochain service ouvert et le nombre de couverts ; le carton s'envole vers la réservation, déjà remplie.

**Chaque page à son heure**
- La carte s'ouvre au déjeuner ou au dîner selon l'heure réelle à Moineville ; un bouton rallume la page à l'autre service (photo, texte, bouton « Réserver »).
- Les fêtes : l'hiver, un compte à rebours géant de la Saint-Sylvestre sur la salle au feu, le menu en accords mets et vins, Noël plat par plat sous sa cloche ; l'été, la journée d'été heure par heure.
- Réceptions, nouvelle page : le mot de l'occasion change dans le titre (mariage, baptême, anniversaire, pot de départ), trois espaces en volets (la salle d'abord l'hiver, la terrasse d'abord l'été), les vraies photos des fêtes, la demande en trois étapes et un carton d'invitation tamponné « Demande reçue ».
- Réserver prend la lumière du service choisi (claire au déjeuner, de nuit au dîner) ; Offrir s'ouvre à minuit au coin du feu ; Infos pratiques affiche l'heure réelle à Moineville et la photo de ce moment ; la page introuvable « a fermé à minuit ».
- Entre les pages, la transition en assiette prend la couleur et les chiffres de l'heure de la page d'arrivée.

**Images**
- Dix illustrations générées, toutes marquées « Illustration générée » : la piscine à midi, la terrasse au coucher du soleil, à l'heure bleue et la nuit (même cadrage), la salle et sa cheminée, deux assiettes, les mains du chef, le bar.
- Deux boucles vidéo : l'eau de la piscine et la vapeur du dîner (seule la fumée bouge, l'assiette reste nette). Pas de vidéo sur téléphone en portrait, en mode calme ou en économie de données.
- Les vraies photos du restaurant restent, en petit : les assiettes de la carte, les fêtes, la Saint-Sylvestre, les réceptions.

**Après le test « vrai visiteur » (une cliente de Thionville, sur téléphone puis sur ordinateur)**
- Arrivée : le nom et le lieu sont écrits dès le premier écran du téléphone ; le statut dit l'heure réelle (« Il est 0 h 58 : fermé · ouvre à 12 h »), la grande « 12:00 » restant l'heure de la journée racontée ; sur ordinateur, les deux boutons tiennent dans le premier écran.
- Le menu suit l'ordre des heures : La carte 12:30, Réceptions 19:00, Les fêtes 23:00, Offrir 00:00.
- Réceptions : une date, ou à défaut une période (« Au printemps 2027 », « Date à fixer ensemble »), dans une liste au style des autres champs ; aucune occasion cochée d'avance ; le carton dit « Un baptême » et l'année ; le merci reste à l'écran sur téléphone ; « Capacité de chaque espace et menus de groupe : sur demande, au 06 18 21 28 10 » ; la vraie photo du baptême.
- Réserver : le message d'erreur sous son champ, sans étirer le champ voisin ; une fois la table réservée, les choix restent lisibles (plus barrés comme un service fermé) ; la référence sur une ligne ; le plan dit « Choisir cette table ».
- La carte : la barre des rubriques monte tout en haut quand l'en-tête se cache ; les plats arrivent plus tôt sur téléphone ; « À partager » n'est plus aussi un filtre ; le bouton dit « Passer au dîner ».
- Les fêtes : chaque prix est nommé (« Saint-Sylvestre : 120 € le menu · Noël : 79 € par personne ») ; le compte à rebours compte les jours du calendrier (J-50, comme l'accueil) ; le menu de Noël reste lisible sous les cloches.
- Infos pratiques : sur téléphone, les horaires de la semaine avant le cadran.
- Finitions : l'eau de midi suit le cadrage de la photo du téléphone (plus de bande décalée à l'ouverture) ; « 14 h 30 » sur une ligne ; la terrasse épinglée moins longue ; les pool parties avec la vraie photo de la bouée licorne ; le pied de page sombre jusqu'en bas sur téléphone ; moins de vide au-dessus de « 12 h 30 » ; l'en-tête sur une seule rangée vers 1000 px.

**Après le regard neuf (un directeur artistique qui n'a pas vu la construction)**
- Une seule heure par page, partout : le voile, l'intro, l'horloge de l'en-tête et l'ouverture disent la même (La carte 20:30 le soir, 12:30 le jour ; Réserver, l'heure du service demandé ou du prochain service ouvert) ; l'horloge de l'intro arrive à la taille exacte de la grande heure (elle ne rétrécit plus pour regrossir).
- Une seule notation des heures sur l'accueil (12:00, 12:30, 14:30, 19:00, 21:00, 23:00, 23:30, 00:00) ; « 23:00 » sur la scène du coin du feu ; Les fêtes à 23:30 partout (accueil, menu, page).
- 21:00 : le prochain soir est coché d'avance sous « Le dîner » ; la pastille « Toute l'année » est retirée.
- 23:00 : « Au coin du feu » se lit sur le mur clair ; la légende passe en bas à gauche, hors du foyer.
- 23:30 : Noël (25 décembre) avant la Saint-Sylvestre, les deux colonnes alignées.
- 19:00 sur téléphone : l'heure et les étapes à venir se lisent sur le ciel du couchant.
- Les fêtes : la photo d'ouverture retrouve son feu (l'ombre seulement sous le texte) ; les soirées passées ne sont plus barrées et s'alignent à côté de leur photo ; « 120 € le menu » ne laisse plus de point seul en fin de ligne.
- Ouvertures qui ne se répètent plus : Infos pratiques le soir sur la terrasse à l'heure bleue, Offrir serré sur le feu de la cheminée, la page fermée serrée sur la grande table vide.
- Réserver : « Une table pour vous », les vrais jours et services en introduction (la mention « simulée » en fin de phrase) ; la photo de la salle recadrée sur les tables dressées.
- Réceptions : le carton est pré-écrit en gris (« Votre fête », « La date · vos invités · l'espace ») et se remplit au fil des choix ; « la maison dresse la table pour vous ».
- Le bouton « Réduire les animations » (et « Rétablir ») ramène toujours à la section où l'on était, même sur téléphone (correction du socle) ; la boucle de vapeur ne refait pas son fondu au retour arrière.
- Le numéro de téléphone ne se coupe plus en fin de ligne ; la recherche de la carte dit « Chercher un plat » ; le cadran d'Infos pratiques reste à côté des horaires.

**Faits**
- Retiré : « le repas pour 120 sous la pergola » (aucun chiffre de capacité sur le site actuel).

## v5 — les améliorations de l'audit UX et design

Comparaison de la v4 livrée et de la v5, fichier par fichier : aucun fichier retiré ; 13 fichiers d'images ajoutés (versions d'été des ouvertures de La carte, de Réserver et d'Offrir, lumière de l'eau de la piscine) ; sources modifiées : les 6 pages (`source/pages/`), le gabarit commun, `site.css`, `site.js`, `fr.json`, `site.json`, `plan-images.json`, pages régénérées. Les copies des modules et l'adaptateur du socle n'ont pas changé (seul le numéro `?v=5` de leurs imports).

**Réceptions et réservation**
- « Réceptions » entre dans le menu (en-tête, menu du téléphone, pied de page) : il mène à « Combien serez-vous ? » et à la demande préremplie.
- Tous les boutons « Réserver » (en-tête, barre du bas, accueil, fêtes, carte) mènent droit au formulaire.
- Formulaire plus court : service et couverts côte à côte, « Une demande particulière ? » repliée, la photo d'en-tête du formulaire retirée.
- Le récapitulatif dit « Choisissez le jour et l'heure » au lieu de « À compléter » ; après l'envoi, « Votre table est réservée », et la carte de placement porte votre nom ; elle arrive au milieu de l'écran, sous la cloche.
- Les jeudis soir disent « fermé » (et non « complet ») ; seul le 31 décembre au soir s'ouvre.
- Plan de salle moins incliné, numéros de tables plus grands ; sur téléphone, le plan à pleine largeur d'abord, la liste des tables repliée (« Voir les 12 tables »).

**Les deux saisons**
- La bascule part du geste en vague de lumière (soleil l'été, braise l'hiver) ; l'en-tête, la barre du bas et le pied de page passent au bleu nuit l'été.
- Le cadran est plus grand sur ordinateur ; sous les boutons d'été : « Terrasse et piscine de juin à septembre ; d'ici là, la salle et sa cheminée ».
- L'eau de la piscine bouge vraiment (lumière de l'eau qui glisse sur la photo d'été, illustration générée).
- La carte, Réserver et Offrir ont leur photo d'ouverture d'été (assiette en terrasse, table fleurie en terrasse, cocktails du bar) ; la lueur de saison est plus présente au bord des sections.

**Ton, typographie, rythme**
- Les textes parlent de cuisine : « Cette semaine, Régis Clauss cuisine le risotto de Saint-Jacques au riz noir, le suprême de pintade et les figues rôties au miel » ; la nappe de la table est dite « illustration générée ».
- Chiffres et euros en Figtree (comptes à rebours, montants des cartes cadeaux, nombre d'invités) : le 4 et le € de la didone se lisaient mal.
- Pastille « végétarien » sous le nom du plat ; chaque carte d'été a sa ligne utile (piscine, bar, pool parties).
- Fin d'accueil forte : la salle et sa cheminée (la piscine le soir, l'été) sous « Offrir et venir » ; marges resserrées entre les sections.
- Offrir s'allume : photo moins voilée, carte d'ouverture dorée.
- « (nouvel onglet) » n'est plus écrit en clair : une flèche ↗, et le texte reste pour les lecteurs d'écran.
- Audit complet de la version finale (7 pages, 13 tailles, tous les modes) : 0 échec après les corrections (ouverture sur écrans bas, jours de la réservation vers 1000 px, contraste du surtitre d'Offrir, visuel du formulaire, titre des fêtes ligne par ligne) ; fluidité de l'accueil 5 % d'images lentes sur ordinateur ralenti 4 fois, 0 % au doigt. Test visiteur (3e passe) : réserver en 11 à 13 gestes, baptême au formulaire en 2 à 3 gestes ; le lien « Réceptions » arrive sur sa section depuis toutes les pages.

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
