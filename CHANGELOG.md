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

**Après le retour du client (v7.1 : la saison décide aussi de l'accueil)**
- L'hiver (d'octobre à avril), l'ouverture de l'accueil est la vraie salle aux baies vitrées : « Midi près des baies vitrées, minuit au coin du feu. » ; un halo de soleil suit la main. La piscine et son eau à toucher restent l'ouverture de l'été (mai à septembre, ou `?saison=ete`).
- L'hiver, le panorama de la piscine (14 h 30) disparaît de l'accueil ; 12 h 30 montre la salle et son mur de pierre ; Infos pratiques montre la salle au soleil au lieu de la piscine.
- 21 h : la vapeur de l'assiette devant la cheminée est nettement visible (plus dense, plus haute).

**Retours du client, suite (v7.2 : l'accueil d'hiver réordonné)**
- Ouverture d'hiver plus vive : la salle aux baies vitrées étalonnée (plus chaude, plus contrastée), voile crème limité à la colonne de texte (quelle que soit la largeur de l'écran), rayons de soleil qui entrent par les baies, halo plus visible.
- 12 h 30 : l'assiette devant la cheminée fume à la place de la photo de salle ; les petites assiettes sont des boutons : celle qu'on touche passe en grand et fume à son tour.
- 21 h : la salle au mur de pierre, étalonnée en lumière du soir ; fond vert nuit à la place du violet.
- L'hiver, « Au coin du feu » ouvre la soirée à 19 h (à la place de la terrasse) sur la vraie cheminée de la salle : les flammes ondulent, la lueur vacille sur la salle, les braises partent du foyer. La terrasse d'été passe tout en bas, en clin d'œil (« L'été, la terrasse s'allume »).
- Pied de page : le logo remplace la grande heure « 00:00 » ; une seule grande heure par ouverture de page.

**Audit complet et analyse (v7.3)**
- Audit complet sur 13 tailles : 0 échec ; les points « à regarder » traités (contrastes des ouvertures des Fêtes et de Réceptions, chevauchement des mentions de la terrasse) ; le retour arrière de l'accueil n'attend plus l'image d'ouverture (chargée tout de suite pour la saison du jour).
- Plus de violet nulle part : Réceptions, la terrasse, le voile de 19 h et le rideau de palmes passent au vert de nuit, comme le dîner.
- L'hiver, la terrasse qui ferme l'accueil est une seule image de nuit, guirlandes allumées, sans scène épinglée (un clin d'œil, plus trois écrans).
- Offrir s'ouvre sur une vraie photo : un dîner au coin du feu (la cheminée allumée au fond).
- La carte, « Sur la passe » : l'assiette d'attente garde la silhouette du plat, les couches se posent sans bord net.
- Accueil : moins de vide entre les fêtes et minuit ; l'ardoise de La carte un peu plus lisible sur téléphone.

**Retours du client (v7.4 : plus d'heures, ouverture midi et soir, carte cadeau de luxe)**
- Plus aucune heure affichée : ni horloge dans l'en-tête et le menu, ni grande heure en ouverture de page ou de section, ni chiffres dans le voile ; l'intro montre le monogramme de la maison ; le statut dit « Fermé · ouvre demain à 12 h » sans l'heure du moment. Restent les horaires d'ouverture, les dates et le curseur du ciel d'Infos pratiques (son heure est l'outil lui-même).
- L'ouverture de l'accueil a un état midi et un état soir : l'hiver, la même salle aux baies vitrées retouchée en soirée (lampes allumées, baies dans la nuit, mention « Photo de la salle retouchée en soirée ») ; l'été, la terrasse sous les guirlandes ; texte clair sur voile sombre, en-tête sombre.
- La section « Offrir » quitte l'accueil (la page Offrir reste).
- Offrir : la carte cadeau devient une carte de luxe : vert de nuit, guilloché doré, monogramme en filigrane, montant en dorure, double filet d'or, reflet qui passe ; formulaire à l'or.
- L'ouverture de l'accueil refaite d'après la référence du client : « Les Jardins / de l'Hacienda » en grand, la pastille « Restaurant & lieu de réception à Moineville, à 19 km de Metz », la phrase du chef selon la saison et le moment, « Réserver une table » et « Voir la carte », puis une barre : la saison, le prochain rendez-vous de l'agenda (calculé au jour réel, lien vers sa date) et la bascule « Voir l'été » / « Voir l'hiver » ; un bouton pause arrête l'eau, la lumière et le lent zoom de la photo. Les quatre photos (été ou hiver, midi ou soir) sont gardées.
- Nouvelle section « Le chef » : la photo de Régis Clauss en polaroïd qui se retourne (au dos, la carte de la semaine), des étiquettes à déplacer du doigt (cèpes, girolles, fait maison, produits de saison, une nouvelle carte chaque semaine, suggestions de vive voix), « La carte de la semaine » et « Les suggestions sur Instagram ».
- Le déjeuner : la carte en cartes « Nos entrées », « Nos plats », « Nos desserts » (trois plats chacune, pointillés et prix, description) qui arrivent au défilement ; l'assiette qui fume et ses petites assiettes restent collées à côté.
- Nouvelle section « Le lieu » : cinq cartes en vraies photos (le restaurant, la terrasse, la piscine, les réceptions, le coin du feu) qui filent vers la droite pendant le défilement, avec une barre de progression.
- Le dîner quitte l'accueil : son petit module de réservation arrive au coin du feu, une fois la photo ouverte et le titre écarté (le titre remonte, le module monte du bas).
- Les fêtes deviennent « En ce moment » : trois cartes claires, la Saint-Sylvestre et le menu de Noël avec leurs vraies affiches (décompte en jours sur l'image), la carte cadeau en petite carte vert et or ; la prochaine soirée en dessous.
- La terrasse « Recevoir, le soir venu » passe sur la page Réceptions, avec son animation complète (lumière d'or, heure bleue, nuit au défilement, guirlandes qui s'allument), sans heures.
- Contre-audit : l'intro et le voile s'ouvrent depuis le titre de chaque page (plus depuis la grande heure) ; Infos pratiques garde de jour un voile doux de la couleur du ciel sous le texte sombre ; la photo d'ouverture de Réserver bouge légèrement au défilement ; la validité de la carte cadeau d'Offrir passe à 12 px.

**Retours du client, suite (v7.5 : polices et sections de la référence, ouvertures des pages)**
- Les polices de la référence du client sur tout le site : Fraunces pour les titres, les noms de plats et les rubriques en italique, Manrope pour le texte (fichiers repris de la bibliothèque, licence OFL).
- Accueil : l'ouverture prend la vraie photo panoramique de la salle (mur de pierre, bûches, tables rondes en verre) ; le chef sur fond clair ; le déjeuner sur fond brun foncé ; « En ce moment » montre les soirées à thème à la place de la carte cadeau.
- Accueil, nouvelles sections en bas de page : « Offrir & emporter » (les incontournables des fêtes du site, en vraie photo, commande par téléphone en attendant de rebrancher la commande en ligne du site actuel sur le nouveau site ; la carte cadeau de luxe qui s'incline vers la main, montant à choisir) et « Venir » (le plan des vraies distances : Metz 19 km, Thionville 24, Luxembourg 47, Nancy 60, à vol d'oiseau ; les traits se dessinent, une lueur file vers Moineville).
- La carte : chaque rubrique dans une carte sable, photo collée à gauche, comme la référence.
- Réceptions : nouvelle ouverture, vert de nuit et or, la pergola dressée en grande arche sans voile sombre, la table au bord de la piscine en médaillon, un sceau doré qui tourne ; « Ce que l'on fête ici » juste en dessous.
- Les fêtes : nouvelle ouverture, nuit chaude et lueurs dorées, les vraies affiches de Noël et de la Saint-Sylvestre qui flottent (un clic mène au menu), le décompte en médaille dorée ; l'été, la piscine en arche et les lanternes ; plus de vitre givrée.
- Les fêtes, le menu de Noël : une carte de vœux qui s'ouvre au défilement sur un vert de sapin où tombe une neige dorée ; la couverture est la vraie affiche (un reflet y passe), elle tourne sur sa charnière, la photo de la coupe devant la cheminée apparaît à gauche et les cinq plats s'inscrivent un à un entre deux filets d'or (sur téléphone, la couverture se soulève vers le haut). Le dépliant 3D est retiré.
- Les fêtes, la Saint-Sylvestre : nuit dorée et paillettes qui scintillent ; la lueur de la salle prend la couleur du vin du plat choisi ; prix en médailles, vinyle du DJ qui tourne ; plats numérotés en chiffres romains dorés, le plat choisi éclairé de la couleur de son vin, titre en dorure.
- Transitions entre les pages aux couleurs du site : un papier crème qui monte du clic en cloche, le monogramme en terre cuite, le nom de la page en Fraunces italique et un filet d'or qui se posent, puis la cloche se soulève (plus de bleu canard ni de dégradés d'heures).
- Infos pratiques : nouvelle ouverture claire (l'enseigne sous le ciel bleu en arche, une carte de visite de la maison qui s'incline vers la main avec le statut ouvert ou fermé en direct, les distances en pastilles) ; le ciel calculé est retiré.
- Infos pratiques, horaires : la semaine d'un coup d'œil. Une piste par jour de 0 h à 24 h, les créneaux à leur place (midi en or, soir en terre cuite), le moment présent qui bat sur la piste du jour ; un curseur d'heure parcourt la semaine, allume les créneaux ouverts et le dit en toutes lettres (« À 20 h : ouvert vendredi et samedi »).
- Le dos du polaroïd du chef est l'ardoise de la semaine à la craie, dans son cadre de bois ; les étiquettes s'effacent quand on la lit.
- Contre-audit sur ordinateur (7 tailles, de 1000 × 560 à 2560 × 1440 ; le téléphone et les petits formats sont repris à l'audit de fin, à la demande du client) : l'ouverture de l'accueil tient dans un écran bas (rendez-vous sur une ligne) ; textes du plan de « Venir » et de la carte de visite à 12 px ; commande des incontournables par téléphone (plus de lien vers l'ancien site) ; échelle des horaires plus contrastée ; prix des fêtes dans le premier écran sans JavaScript ; voile des transitions en papier plus chaud, ombré sur les bords (il ne fait plus l'effet d'un écran blanc entre deux pages sombres) ; 404 alignée sur la colonne du site sur très grand écran ; rubrique courante de La carte sans fondu.
- La carte, le soir : les noms, prix et descriptions des plats restaient crème sur les cartes sable (le thème du soir éclaircit le texte de la page) ; le texte des cartes reste désormais foncé, matin comme soir, les titres de rubrique en terre cuite.
- Réceptions, ouverture : les occasions défilent. Le mot du titre (un mariage, un anniversaire, un pot de départ, un baptême) et la photo de l'arche changent ensemble toutes les 2,6 secondes, avec les photos de « Ce que l'on fête ici » ; un fil de quatre traits dorés sous l'arche montre l'occasion en cours, on peut en choisir une ou mettre en pause ; le médaillon rond montre la grande tablée sous la pergola. Sans animations, pas de défilement automatique.
- Réceptions, « Ce que l'on fête ici » : le défilement de la « journée à l'Hacienda » de la maquette de référence du client, dédié aux occasions. La section reste à l'écran pendant quatre écrans de défilement ; à chaque palier une occasion (Mariages, Anniversaires, Pots de départ, Baptêmes) : son nom en grand, en italique terre cuite, qui se resserre, sa photo qui s'ouvre depuis un cadre plus petit, une accroche, un texte (faits du site : salle et cheminée toute l'année, terrasse, pergola, piscine et jardins de juin à septembre, capacité et menus sur demande) et un lien « Organiser un… » qui coche l'occasion dans la demande ; le fond change de teinte (ivoire, sable, sauge, rose poudré), un anneau se remplit à côté du titre, les noms en bas à droite mènent à chaque occasion. Sans animations : les quatre occasions l'une sous l'autre.
- Nouvelle page « À emporter » (reprise de la page de la maquette de référence du client) : les huit incontournables des fêtes et leurs prix (escargots 18 €, tourtes 32 €, pâté lorrain 28 € le kg, foie gras 36 €, gravlax 22 €, tatakis 25 €), le panier (quantités, total, pastille flottante ; une pastille s'envole vers la commande à chaque ajout), le jour de retrait du 5 au 31 décembre selon les vrais horaires (jours fermés barrés, midi ou soir selon le jour), commande simulée avec récapitulatif. Lien « À emporter » dans le menu ; « Offrir & emporter » de l'accueil y mène.
- Réceptions : « Cinq espaces, un seul domaine » remplace les trois volets (« Trois lieux, deux saisons ») : cartes qui défilent (flèches, glisser, clavier), le coin bar à la place du salon de la référence, capacité, saison et ambiance de chaque espace, badge « Fermé l'hiver, rouvre en juin » l'hiver. Puis « Le plan du domaine » (dessin repris de la référence) : des points qui appellent, un lieu touché montre sa photo et sa fiche ; l'hiver, la terrasse et la piscine pâlissent sous la neige.
- Réceptions, « Ils ont dit oui aux Jardins » : dix vraies photos de mariages en polaroïds pincés sur un fil à linge, légendes manuscrites ; la section reste à l'écran et le fil défile, les photos se balancent avec la vitesse ; un clic ouvre l'album en grand sous une pluie de confettis (flèches, clavier, Échap) ; la guirlande s'allume, un cœur se trace autour du « oui ».
- Accueil, « Ici on aime rire… » : la vraie pancarte du bar scotchée de travers, la devise mot à mot avec les verbes surlignés au feutre, la note Google qui compte jusqu'à 4,5 et ses étoiles qui se remplissent (plus de 1 600 avis, relevé RankEat), le cadre, l'assiette et l'accueil en cartes inclinées, une pluie de confettis à l'arrivée.
- La carte : chaque morceau des cartes sable porte son fond (lecture du texte foncé garantie).
- Accueil, le déjeuner : une carte « Carte de la semaine » avant « Nos entrées ». Elle reste à l'écran pendant cinq paliers de défilement : une nappe de lin rayée se déroule sur l'assiette fumante, puis chaque rubrique (Entrées, Plats, À partager, Desserts) glisse et se pose dans sa place en pointillés pendant que son assiette tombe sur la nappe ; la rubrique en cours donne sa fourchette de prix et son nombre de plats (calculés depuis la carte). En sortie, la table se lève et l'assiette fumante revient ; un clic sur une rubrique mène à son palier. Animations réduites, téléphone ou sans JavaScript : les quatre rubriques d'un coup.
- Le déjeuner, suite : le titre de la section et la « Carte de la semaine » restent fixés ensemble, centrés dans l'écran (resserrés sur écran bas), l'image de droite à la même hauteur ; la nappe devient une table cosy (plateau de bois, nappe de lin écru posée de biais avec plis et ourlet cousu, bougie dont la flamme vacille) ; les assiettes posées sur la nappe sont les quatre vignettes du dessous, qui restent visibles puis s'envolent une à une de leur place, montent en arc en grandissant et se posent ; elles redescendent à leur place quand la table se lève.

**Retours du client, suite (v7.5.14 : la Saint-Sylvestre en scène, le nouveau pied de page)**
- Évènements, « Le menu de la Saint-Sylvestre » refait de A à Z : la section reste à l'écran et chaque palier de défilement sert un temps du dîner (numéro romain, plat, détail) ; à droite, le verre prend la forme et la couleur du vin de l'accord (flûte, blanc, rouge, tulipe), le vin y monte et les bulles du champagne remontent ; la fiche du vin (type, nom, région) suit. La bascule « Avec l'accord mets et vins » vide ou remplit le verre et fait passer le prix de 120 € à 170 €. La table des cinq temps, en bas, mène à chacun ; le DJ et la mention sur l'alcool restent. Téléphone, animations réduites ou sans JavaScript : les cinq plats l'un sous l'autre, chacun avec son vin.
- Pied de page refait sur toutes les pages : un bandeau de huit vraies photos de la maison qui défile en continu (pause au survol, immobile si les animations sont réduites), « À très vite, aux Jardins » avec le statut ouvert ou fermé en direct (le point vert bat quand c'est ouvert), « Réserver une table » et « Appeler » ; trois blocs : nous trouver (adresse, distances, horaires et accès), le site (la page en cours marquée d'un point doré), suivez-nous (Instagram, Facebook), confort de lecture et retour en haut ; le nom de la maison en très grand, dont les lettres se soulèvent et se dorent sous la souris ; les mentions en bas.
- Onglets : entre 900 et 1000 px de large, ils tiennent sur une seule rangée. Accueil, « Venir » : un peu d'air sous le titre.

**Retours du client, suite (v7.5.13 : deux ouvertures, les dates en images)**
- Infos pratiques : nouvelle ouverture dans le style de celle du Traiteur : fond crème, « Venez nous voir à Moineville » (fin en italique terre cuite), l'adresse et les distances, « Appeler le 06 18 21 28 10 » et « Une question ? », le statut ouvert ou fermé en direct sur la ligne d'info ; la salle aux baies vitrées en arche (l'enseigne, trop large pour une arche, aurait été coupée), le sceau rouge qui tourne.
- Traiteur : nouvelle ouverture « la ronde des cloches ». Sur une scène sombre et dorée, les six plats sous leurs cloches tournent en cercle (perspective calculée : taille, lumière, profondeur) ; celle de devant soulève son verre, son numéro, son nom et son prix s'affichent. La ronde avance seule toutes les 3,6 s, tourne avec le défilement puis se pose sur le plat le plus proche, s'arrête au survol ; flèches et clavier ; un clic fait venir une cloche, un clic sur celle de devant mène au plat dans la vitrine et soulève sa cloche. « Les fêtes du chef, à emporter » en crème et or ; la page passe en thème du soir.
- Évènements, « Les prochaines dates » : une vraie photo par soirée (côte de bœuf, raclette au coin du feu, brunch dans la salle, soirée libanaise, Noël, Saint-Sylvestre), fixée à gauche pendant qu'on lit les dates ; fondu enchaîné et léger zoom à chaque changement, la date en grand et le nom de la soirée sur la photo, la date lue marquée d'un trait rouge ; les filtres sont suivis.

**Retours du client, suite (v7.5.12 : toute la commande dans le panneau)**
- Traiteur : la commande se termine dans le panneau, en trois étapes avec un fil (1 Commande · 2 Retrait · 3 Coordonnées) et une flèche de retour : les plats et le total ; le calendrier de décembre et le moment du retrait, avec l'adresse et les horaires (un message si l'un manque ; un jour qui n'a qu'un moment le coche d'office) ; prénom, nom, téléphone et e-mail, puis « Valider ma commande ». Le merci et le récapitulatif s'affichent dans le panneau. En bas, le total et le retrait choisi restent visibles à chaque étape. Le formulaire est déplacé (et non recopié) dans le panneau : la section « Le retrait » quitte la page, elle reste seulement sans JavaScript.

**Retours du client, suite (v7.5.11 : le tiroir de la commande)**
- Traiteur : à chaque ajout, la commande s'ouvre dans un panneau qui glisse depuis la droite sur la page assombrie, et la photo du plat s'envole de sa cloche jusqu'à sa ligne. Bandeau « Ajouté à votre commande », chaque plat avec sa vignette sur une petite assiette, son prix à l'unité ou au kilo, ses quantités et « Retirer » ; total, rappel du retrait du 5 au 31 décembre, « Choisir le jour de retrait » (ferme le panneau et descend au calendrier) et « Continuer mes achats ». La pastille flottante ouvre aussi le panneau. Fermeture par la croix, Échap ou un clic à côté ; le focus reste dans le panneau puis revient au bouton d'origine ; la page derrière ne défile pas. Animations réduites : sans glissement ni envol.

**Retours du client, suite (v7.5.10 : les onglets en Fraunces, les plats du Traiteur en photo)**
- Les onglets du menu passent en Fraunces, comme le logo et les titres : l'onglet de la page en italique, doré quand l'en-tête est sombre, terre cuite quand il est clair, avec un filet fin qui se trace aussi au survol.
- Traiteur : six plats sous leur cloche en images générées (Grok) détourées et posées sur l'assiette, avec la mention « Illustration générée » en bas de chaque cloche : escargots dans leur plat en terre cuite, tourte aux escargots et son escargot en pâte, tourte aux grenouilles entamée, pâté lorrain et sa tranche, foie gras et brioche toastée, gravlax et aneth. Les deux tatakis gardent leur dessin (les images reçues ne convenaient pas). Détourage : `outils/detourer-plats.py` (fond blanc retiré, bord adouci, ombre gardée en ombre douce) ; originaux dans `recu/traiteur-plats-zip/`, consignes Grok dans `_suivi/jardins-hacienda-traiteur-plats-grok.docx`.

**Retours du client, suite (v7.5.9 : les onglets Traiteur et Évènements)**
- Le menu, le pied de page et les transitions disent « Traiteur » (au lieu de « À emporter ») et « Évènements » (au lieu de « Les fêtes ») ; les titres des deux pages dans le navigateur et leurs images de partage suivent, le surtitre de la page Traiteur aussi. Les adresses ne changent pas (`/a-emporter`, `/les-fetes`), pour ne casser aucun lien.

**Retours du client, suite (v7.5.8 : Réceptions réordonnée, le plan sur Infos pratiques, la vitrine sous cloches)**
- Réceptions, nouvel ordre : l'ouverture, « Ce que l'on fête ici », « Cinq espaces, un seul domaine », la demande de réception, la terrasse qui s'allume, « Ils ont dit oui aux Jardins ».
- Réceptions, la demande sur fond clair : le titre et l'intro sur une ligne avec « Plutôt de vive voix ? » et le téléphone ; le formulaire sur une carte de papier, les trois étapes numérotées et reliées (l'étape faite se coche) ; les occasions en tuiles avec leur vraie photo, les espaces en puces à vignette, le nombre d'invités en un geste (20, 50, 100, 150) avec la capacité de la salle de réception (220 invités, 140 en cocktail, fiche Bridebook). À gauche, le carton d'invitation (monogramme, double filet d'or, Moineville) se remplit, et deux polaroïds scotchés montrent l'occasion et l'espace choisis (la photo change, le polaroïd saute) ; à l'envoi, le tampon « Demande reçue ».
- « Le plan du domaine » quitte Réceptions pour Infos pratiques, juste après l'accès : l'entrée, le parking et chaque lieu à toucher.
- À emporter, la vitrine sous cloches (reprise de la vitrine de la maquette Lemoy) : fond sombre et chaud, quatre cloches de verre par rangée, numérotées de N° 01 à N° 08. Sous chaque cloche, le plat dessiné en illustration (le restaurant n'a pas encore de photos détourées de ses produits) : escargots à la crème d'ail, tourte aux escargots, tourte aux grenouilles, pâté lorrain entamé, foie gras et brioche, roses de gravlax, tatakis de bœuf et de thon. Au survol la cloche se soulève, la buée s'efface et un reflet balaie le verre ; au toucher elle s'ouvre et la vapeur monte des plats chauds. Bouton « + Ajouter » qui passe en « ✓ Ajouté » ; panier, poids du pâté lorrain et retrait inchangés. La photo du foie gras quitte la liste (une seule manière de montrer les produits).

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
