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

**La journée en main (v7.15.0)**

« Je comprends ce qui se passe, je sais ce qui mérite mon attention et je peux agir au bon endroit. » Deux correctifs préalables, puis Aujourd'hui, l'assistant, les bilans, les vues métiers et une visite guidée : autant de façons de consulter les mêmes dossiers, sans rien copier. Maquette locale ; les paiements et les messages restent simulés ; la recette connectée garde son fonctionnement partagé. Détail, vérifications et état par environnement : `_exploitation/livraison-v7.15.0.md`.

- **Une production rectifiée laisse une commande cohérente.** Une commande prête de quatre pièces, rectifiée à une : une pièce engagée, trois restant à produire, réservées dans la capacité du jour du retrait. La commande repasse « En préparation », le dossier explique le manque, « Marquer prête » et « Remettre au client » sont refusés ; « Engager le complément en production » transforme la réserve en lot, sans double compte. Aucun lot n'est inventé. Une commande retirée ou annulée garde son état.
- **Un contexte indéterminable n'enregistre rien.** Quand un onglet ne peut pas dire s'il est en démonstration, aucune demande, commande, réservation ou réponse de client n'atteint les données habituelles, au bouton comme à la touche Entrée : la saisie reste, la raison est dite, aucune réussite n'est annoncée. Les formulaires de contact, de réception et de carte cadeau n'annoncent plus de réussite quand l'enregistrement a échoué.
- **Aujourd'hui, en quelques secondes.** « Le prochain temps fort » (service, couverts selon les statuts connus, ce qui se passe aussi ce jour-là) ; des priorités expliquées (titre, raison, « Concerne », bouton), regroupées par situation, qui disparaissent quand la situation est réglée et non quand on les ouvre ; de nouvelles priorités pour les commandes (à compléter, à préparer, prêtes, retrait dépassé), les demandes à décider et les tâches à échéance ; un fil de la journée qui dit le niveau d'engagement de chaque ligne et montre les tâches du jour.
- **Un briefing plus utile.** Préparations et retraits du créneau, points à résoudre, ordre adapté à la vue ; impression propre sur plusieurs pages.
- **Un assistant dans « Que voulez-vous faire ? ».** Local et déterministe : préparer un briefing, montrer les commandes à retirer un jour, lister les demandes qui attendent, les options à échéance, retrouver le dossier d'une personne, afficher un bilan, créer une tâche, expliquer ce qui bloque une commande. Il dit ce qu'il a compris, cite les dossiers, demande ce qui manque, propose un choix quand plusieurs personnes correspondent, et dit quand il n'a pas compris. Rien n'est fait sans validation.
- **Des bilans vérifiables.** Le jour, la semaine, la semaine précédente, avec leurs dates. Dix-huit indicateurs (restaurant, réceptions, traiteur, cartes cadeaux, suivi), chacun avec sa définition et la liste des dossiers comptés. « Non disponible » n'est jamais écrit « 0 » ; aucun montant n'est présenté comme un encaissement ; le montant d'une proposition acceptée ne suit pas le catalogue ; le solde d'une carte expirée n'est pas utilisable.
- **Quatre vues métiers consolidées.** Direction, Accueil, Salle, Cuisine : ordre, raccourcis, priorités et briefing adaptés ; mêmes données, mêmes règles ; une présentation, pas des droits.
- **Une visite guidée de cinq à sept minutes**, en cinq étapes, à partir de trois des huit démonstrations, qui gardent leur contexte, leur heure et leurs données. Reprise à l'étape où l'on s'est arrêté ; aucune remise à zéro cachée.
- **Finitions :** « il ne reste que … à produire » (l'accord fautif a disparu), dates en clair dans l'historique des cartes, description de la page À emporter sans dates figées, remplissage « Non disponible » une semaine sans service ouvert.
- **Documents :** `regles-journee.md`, `indicateurs.md`, `assistant.md`, `visite-guidee.md` ; `limites.md`, `regles-commerce.md` et le guide des démonstrations mis à jour ; le compte rendu en ligne de la v7.14.1 est dans `livraison-v7.14.1.md`.

**Des démonstrations isolées, une préparation fiable (v7.14.1)**

Ferme les défauts relevés à la vérification de la v7.14.0. Aucune nouvelle activité : les paiements et les messages restent simulés ; la recette connectée garde son fonctionnement partagé. Détail, vérifications et état par environnement : `_exploitation/livraison-v7.14.1.md`.

- **Chaque contexte a son panier et son brouillon.** Le panier de la page À emporter et le brouillon de la page Réserver sont propres au site normal et à chaque démonstration : lecture, sauvegarde, autres onglets, vidage après l'envoi. Hors démonstration, les clés d'origine sont gardées : un panier ou un brouillon déjà présent est retrouvé tel quel. Une démonstration ne lit, ne copie et n'efface jamais le panier normal.
- **Plus de repli silencieux.** Si l'onglet ne peut pas retenir la démonstration, elle reste valable par l'adresse de la page et c'est dit ; si l'on ne sait pas dans quel contexte est l'onglet, rien n'est lu ni écrit dans les données habituelles.
- **Une ancienne page reconnaît un « Recommencer ».** Restée ouverte, elle remet sa commande à zéro, le dit, et n'envoie plus rien dans le nouveau départ.
- **Ce qui est préparé reste compté.** « Lancer la préparation » garde à part ce que la cuisine engage (produit, unité, quantité, jour). Réduire une quantité, déplacer le retrait, retirer ou remplacer un produit n'y touchent plus ; une hausse n'engage que le supplément, et une commande prête repasse alors en préparation. L'effet est dit avant d'enregistrer.
- **« Rectifier la production »**, une action à part : avant, après, effet sur la capacité, motif obligatoire, trace datée, pas de double application.
- **Les anciennes commandes sont reprises une fois**, sans rien inventer : celles qu'une correction passée a pu fausser portent « Production historique à vérifier ».
- **La période des retraits se règle dans l'espace** (Demandes, « Préparation et retraits »). Le site et l'espace la lisent avec la même règle : calendrier de la page (plusieurs mois si besoin), dernier contrôle avant l'envoi, décisions de l'équipe, phrases d'explication. Les commandes déjà acceptées ne bougent pas ; une demande en attente devenue incompatible demande une décision explicite. Sans aucun retrait possible, la page dit pourquoi.
- **Une utilisation passée se corrige sur une carte expirée**, avec un motif : le solde historique change, la carte reste expirée, aucune nouvelle utilisation n'est possible.
- **Démonstrations 7 et 8 :** quatre variantes ajoutées (commande corrigée, production rectifiée, période réglée, utilisation corrigée après l'expiration), sans nouvelle donnée fictive.
- **Documents :** `limites.md` réécrit en trois parties (limites actives, points corrigés, évolutions futures) ; le bilan en ligne de la v7.14.0 et l'incident du panier sont dans `livraison-v7.14.0.md`.

**Du catalogue à la remise au client (v7.14.0)**

Deux parcours complets, en maquette locale : une commande à emporter, de la page du site à la remise au client ; des cartes cadeaux, de la demande au solde. Les paiements et les messages restent simulés ; la recette connectée garde son fonctionnement partagé. Détail, règles, vérifications et état par environnement : `_exploitation/livraison-v7.14.0.md` et `_exploitation/regles-commerce.md`.

- **Les défauts de la v7.13.1 sont fermés.** L'annonce et le repère « Aperçu — non publié » ont leur propre bande en haut de la page : le contenu descend, rien n'est recouvert, à l'ordinateur comme en largeur de téléphone ; un rappel reste en bas pendant le défilement. Une carte cadeau publiée à 250 € va jusqu'à la demande reçue : le formulaire reconnaît l'offre choisie dans le catalogue publié (il n'y a plus de plage 25–200 € écrite dans le code) ; un montant hors catalogue est refusé. La demande garde l'offre (identifiant, intitulé, version publiée), le montant, la quantité, le total, la personnalisation et l'acheteur. Les textes « de 25 à 200 € », l'accueil et la page des fêtes suivent le catalogue.
- **Le catalogue traiteur se modifie.** Les huit produits à emporter sont des offres du catalogue : prix, unité (la pièce, le kilo), quantité minimale, pas, délai de commande, visuel, période, conditions. Préparer, voir en aperçu sur la vraie page, publier, reprendre depuis l'historique. La page À emporter et l'accueil lisent la version publiée ; un produit masqué ou archivé n'est plus proposé. Les propositions de réception reprennent ces produits depuis le catalogue publié.
- **La commande à emporter a son cycle.** Demande reçue, validée, en préparation, prête, retirée ; refus et annulation avec un motif ; le bon bouton au bon moment. Le dossier garde la référence (la même que sur le site), le client, les lignes avec leur unité et leur prix du moment, le total, le retrait, la remarque, l'historique. Une modification montre ses effets avant d'être enregistrée ; un changement du catalogue ne touche jamais une commande reçue.
- **Les capacités sont explicites.** Production (par produit et par jour), retraits (par créneau), restaurant (inchangé : une commande ne prend aucun couvert). Une demande non validée n'engage rien ; la validation revérifie sur l'état relu au dernier moment (deux onglets, une seule réussite) ; une commande compte une fois ; l'annulation libère selon l'étape. Le site applique les mêmes règles et le dit. Non réglée, une capacité ne limite rien ; les chiffres des démonstrations sont des exemples.
- **Préparation et retraits.** Les quantités regroupées par produit (à préparer, prêt, remis), par jour et par créneau ; une feuille de préparation et une fiche de retrait imprimables.
- **Les cartes cadeaux ont une identité.** Validation, règlement simulé noté explicitement, puis émission : une carte distincte par exemplaire, avec son code de démonstration, sa valeur, son solde, sa validité si elle est réglée. Utilisation partielle, dépassement refusé sans rien débiter, carte épuisée, expirée ou désactivée refusée clairement. Correction et annulation avec un motif, sans rien effacer ; pas de double débit (clé d'opération) ; entre deux onglets, l'écran dit ce qui est réellement enregistré.
- **Aujourd'hui et Clients.** Les demandes à décider, les préparations et retraits du jour, les cartes à émettre apparaissent dans Aujourd'hui, sans effet sur les couverts. La fiche du client réunit ses commandes, ses cadeaux, les cartes reçues, leurs utilisations ; le rattachement se fait par le téléphone, l'e-mail ou à la main, jamais sur un nom seul.
- **Deux démonstrations.** « Une commande jusqu'au retrait » (7) et « Un cadeau qui garde sa valeur » (8), avec leurs variantes ; le lanceur en propose huit.
- **Reprise.** Les produits livrés sont la version publiée de départ ; les anciennes demandes restent lisibles et ne sont reliées que si c'est certain ; aucun règlement ni aucun code n'est inventé pour le passé.

**Des accords cohérents, une publication maîtrisée (v7.13.1)**

Termine le lot des offres et corrige les incohérences relevées à sa vérification. Maquette locale ; la recette connectée garde son fonctionnement partagé. Détail, vérifications et état par environnement : `_exploitation/livraison-v7.13.1.md`.

- **Un accord reconnu partout.** Une seule règle de lecture des accords, par version exacte. Après un accord noté par l'équipe, l'avancement, la prochaine action, les boutons et la première confirmation disent la même chose, y compris après rechargement. Les boutons qui proposaient de noter l'accord une seconde fois ou de retirer une version acceptée disparaissent ; noter deux fois le même accord ne crée rien.
- **Une soirée recontrôlée au moment de publier.** Une réservation arrivée après la préparation d'un déplacement, une version reprise de l'historique ou un autre onglet : la publication est refusée avec le motif ; le brouillon, le site et les réservations ne changent pas. Revenir à la date publiée, que la garde refusait à tort, est de nouveau possible.
- **Les contenus du Site se préparent et se publient.** L'annonce (texte et affichage), les textes (page par page) et les photos (une par une) ont leur bandeau « Publié / En préparation », leur aperçu, leur publication ciblée et leur historique. Le repère de l'aperçu dit ce qu'il montre. Les horaires, les fermetures et les modèles de messages restent appliqués aussitôt. Ce qui était visible devient la version publiée, une seule fois.
- **Les cartes cadeaux dans le catalogue.** Les cinq montants de la page Offrir sont des offres du catalogue (`cadeau-<montant>`), avec nom, présentation, conditions et visibilité. La page Offrir lit la version publiée ; le formulaire de demande ne change pas. Aucune validité ni condition n'est inventée.
- **Vérifications.** 180 tests de règles (9 nouveaux), 12 tests du serveur, recette connectée locale (66 points), parcours `1-quindecies` étendu aux quatre travaux, lu à l'écran, à 1366 × 768 et à 390 × 844 (largeur mobile simulée), audit ciblé.

**Les offres prennent vie (v7.13.0)**

Quatrième étape de la feuille de route, en maquette locale au navigateur. Le site d'essai connecté garde son fonctionnement partagé. Détail, vérifications et limites : `_exploitation/livraison-v7.13.0.md` ; règles : `_exploitation/regles-offres.md`.

- **Un catalogue commun.** Rubrique Offres, onglet « Tout le catalogue » : formules, prestations, plats, soirées, produits à emporter. Les prestations de réception deviennent modifiables, sous leurs identifiants d'origine ; prix et unité explicites ; un prix vide vaut « à définir », jamais gratuit ; les montants d'exemple restent marqués. « Archiver » montre les usages avant d'agir et ne touche à aucune proposition ni réservation.
- **Préparer, puis publier.** La carte, l'ardoise, les soirées et les offres se modifient en préparation ; les pages du site lisent la version publiée. « Publier cette offre », « Publier les modifications de la carte », « Publier l'ardoise », « Publier cette soirée » : un résumé avant, un seul périmètre publié. Ce qui était visible avant cette version devient la version publiée, sans réinitialisation.
- **Un aperçu fidèle.** « Voir l'aperçu » ouvre la vraie page, sous le repère « Aperçu — non publié », sur ordinateur et sur écran étroit. Il ne publie rien.
- **Un historique.** Site, onglet « Publication » : ce qui attend, chaque publication, « Voir ce que cette version rétablirait », « Reprendre en brouillon ». La restauration ne touche ni aux réservations, ni aux services fermés, ni aux plats épuisés, ni aux accords.
- **« Épuisé ce midi », « Épuisé ce soir ».** Immédiat, sans publication, pour un seul service ; le plat revient au suivant. La réservation de tables n'est pas fermée.
- **Les soirées.** Une réservation prise depuis une soirée garde le lien, le titre et le prix du moment. Sous une réservation liée, la date et le service ne changent pas : le refus dit quoi faire, rien n'est déplacé, aucun message n'est annoncé. Publier une soirée n'ouvre aucun service.
- **Les offres dans les propositions.** Une ligne est une copie d'une offre publiée. Modifier ou archiver l'offre ne réécrit rien. « Actualiser depuis le catalogue… » montre les différences et garde les quantités et les adaptations. Exemple vérifié : 40 personnes à 45 €, acceptées, restent à 1 800 € ; le menu publié à 49 € donne 1 960 € pour une nouvelle proposition.
- **Les options d'avant la v7.12.1.** Elles retrouvent à l'ouverture ce qu'elles prennent de chaque espace, sans rien perdre ; sinon elles sont dites « À vérifier » et comptent comme prenant tout.
- **Une sixième démonstration.** « Une offre prend vie », avec trois variantes. Les cinq premières sont inchangées.
- **Site connecté.** Aucune offre d'exemple n'entre dans son catalogue ; publier une offre y reste local et ne change rien aux réservations partagées.
- **Vérifications.** 171 tests de fonctions (19 nouveaux), 12 tests du serveur, recette connectée locale (65 points), parcours `1-quindecies` à deux tailles d'écran, audit complet puis deux relances ciblées (0 échec, 0 à regarder sur la dernière). L'audit a aussi fait corriger un ancien défaut du plan de salle (étiquette d'assemblage sur le numéro d'une table, en tablette).

**Ce qui est convenu reste clair (v7.12.1)**

Mise à jour ciblée des réceptions, avant la v7.13.0. Les dossiers restent locaux ; accords, messages, signatures et paiements restent simulés. Détail, vérifications et limites : `_exploitation/livraison-v7.12.1.md` ; règles : `_exploitation/regles-receptions.md`.

- Une réception confirmée peut recevoir une révision : la version 2 se présente, le client peut l'accepter, les espaces restent réservés. Trois informations sont dites à part : « Espaces réservés », « Proposition acceptée : version 1 », « Version 2 présentée, accord attendu ».
- Un accord reste attaché à sa version : celui de la version 1 ne vaut jamais pour la version 2. Les accords sont gardés version par version, côté client comme côté équipe.
- Une version présentée garde un instantané de ce qu'elle affichait (destinataire, intitulé, date, effectif, espaces), en plus de ses prestations, prix et conditions. L'aperçu, l'impression et la page du client relisent cet instantané. Une version présentée avant cette mise à jour le dit : ces informations n'ont pas été conservées, elles ne sont pas reconstituées.
- Un changement accepté par l'équipe (effectif, espace, prestation) ne réécrit pas la proposition : il laisse une « révision à préparer », visible dans le dossier, dans Aujourd'hui, sur la page du client et sur la fiche du jour J. Créer un brouillon, ou l'abandonner, ne l'efface plus : elle est soldée quand une version plus récente est acceptée.
- Une version présentée et restée sans accord peut être retirée (révision refusée ou abandonnée) : elle reste consultable, la version acceptée avant elle redevient la référence, le changement déjà accepté reste acquis.
- Jour J : la « proposition retenue » est la version acceptée, jamais une version seulement présentée. Une section « À valider » dit ce qui attend ; les prestations acceptées et les prestations proposées sont listées séparément ; une phrase dit sur quelle base préparer. Tout se met à jour d'un bloc quand la nouvelle version est acceptée.
- Restaurant et réceptions : la fenêtre d'un service va jusqu'à la fin du dernier repas possible (un repas de 13 h 30 occupe sa table jusqu'à 15 h : une préparation à 14 h 45 est en conflit) ; elle suit les horaires du jour (ouverture exceptionnelle, horaires déplacés) et franchit minuit ; les zones retenues par plusieurs dossiers s'additionnent, selon la saison de la terrasse : la page Réserver ne propose plus un service dont tous les espaces utilisables sont pris, et propose encore l'espace resté libre.
- Scénario 5, variante « Un client qui change ses plans » : version 1 acceptée, confirmation, 60 invités, version 2, nouvel accord, jour J à jour, version 1 intacte.
- Tests : 12 de plus (`_audit/tests/convenu.test.mjs`) ; le parcours des réceptions rejoue la révision après confirmation, sur ordinateur et à 390 px ; un parcours de plus pour la page Réserver et les zones retenues.

**Les réceptions de A à Z (v7.12.0)**

Troisième des six étapes (`_exploitation/vision-et-feuille-de-route.md`). Promesse : « Je sais où en est chaque réception, ce qu'elle occupe, ce que le client attend et ce que l'équipe doit faire ensuite. » Maquette fonctionnelle locale : les dossiers de réception restent dans le navigateur, avec des données fictives. Détail, vérifications et limites : `_exploitation/livraison-v7.12.0.md` ; règles : `_exploitation/regles-receptions.md` ; pour présenter : `_exploitation/guide-demonstrations.md`.

- Demandes, filtre « Réceptions » : un suivi dédié (client et occasion, date souhaitée ou retenue, invités, espaces, étape, prochaine action, échéance, point d'attention), cinq phases (À qualifier, Proposition, Décision attendue, Préparation, Terminé), recherche et filtres. Aujourd'hui, l'Agenda et la fiche client ouvrent le même dossier.
- Un dossier unique par réception, créé depuis la demande sans rien ressaisir, jamais en double. Quatre parties (Projet, Personnes, Dates et espaces, Suivi) et trois avancements tenus séparés : commercial, retenue des espaces, préparation.
- Propositions versionnées : brouillon modifiable, lignes tirées d'un catalogue d'exemple ou saisies à la main, total calculé. Présenter fige la version ; toute modification crée une nouvelle version ; les anciennes restent consultables ; l'accord désigne une version précise. Aperçu client et impression marqués « Démonstration », sans les notes internes. La validité d'une proposition n'est pas l'échéance d'une option.
- Options et espaces : une option retient des espaces (et leurs tables) sur toute la période, préparation et remise en état comprises, y compris après minuit, jusqu'à une échéance. Les conflits sont montrés avant de valider (ressource, période, dossier ou réservation en cause) ; un replacement des réservations gênées est proposé en aperçu, appliqué par un geste explicite, avec son bilan. Un refus ne change rien. À l'échéance exacte, l'option ne retient plus rien ; recharger ne la prolonge pas ; la prolonger ou la réactiver revérifie tout.
- La même règle partout : Agenda, Service, Salle, placement, clients sans réservation, liste d'attente et page Réserver tiennent compte des espaces retenus. La page Réserver dit « Ce jour-là, le restaurant accueille une réception » quand le service est privatisé.
- « Votre réception aux Jardins » (`/votre-reception`) : le client retrouve son projet, la proposition en cours, ce qui est convenu et les prochaines étapes ; il peut donner un accord (simulé) sur une version identifiée, poser une question, donner une information demandée, demander un changement d'horaire, d'effectif, d'espace ou de prestation. Un changement reste une demande tant que l'équipe n'a pas décidé ; l'équipe voit les conséquences avant de répondre ; un refus conserve l'accord précédent. La confirmation de la réception est un geste explicite de l'équipe.
- Jour J : vue de préparation tirée du dossier, informations manquantes signalées, tâches habituelles ajoutées en un geste et visibles dans Aujourd'hui sans copie, fiche imprimable (le résumé en première page, le détail ensuite).
- Cinquième scénario de démonstration, « Une réception aux Jardins » : sept étapes, trois variantes (un conflit, une option qui expire, un client qui change ses plans), sauts d'horloge (échéance de l'option, veille, jour J). Avancer l'horloge n'accepte, ne confirme et ne coche rien.
- Ajustements de la v7.11.1 : un téléphone partagé par deux personnes ne donne plus les anciennes notes aux deux fiches (elles restent « À vérifier » jusqu'à un rattachement explicite) ; dans un scénario, le site public suit la même horloge que l'espace (badge « ouvert en ce moment ») ; le lanceur propose « Lancer depuis le début » et « Reprendre ».
- Site d'essai connecté : les dossiers de réception ne sont pas partagés ; ils y sont masqués, la page « Votre réception » le dit, et un dossier resté dans le navigateur n'y retient aucune table.
- Hypothèses d'exemple à confirmer par le restaurant (durées de préparation et de remise en état, durée d'une option, capacités, tables de chaque espace, prestations et montants) : tableau dans `_exploitation/a-valider.md`. Aucun taux de TVA, acompte ou condition d'annulation n'est inventé : ces champs restent « à renseigner ».
- Tests : 20 de plus (`_audit/tests/receptions.test.mjs`) ; un parcours de plus dans l'audit (les réceptions de bout en bout, sur ordinateur et à 390 px) ; quatre contrôles de plus dans la recette du site connecté.

**Le service, prêt à être présenté (v7.11.1)**

Trois corrections et de quoi montrer la v7.11.0 en quatre situations. Détail, vérifications et limites : `_exploitation/livraison-v7.11.1.md` ; mode d'emploi : `_exploitation/guide-demonstrations.md`.

- Fiches clients : les notes rangées sous une ancienne écriture du numéro (`t0612345678`, `t33612345678`, `t:33612345678`) rejoignent la fiche `t:+33612345678`. Contenus réunis sans doublon, reprise sans effet si on la rejoue, identifiant du serveur prioritaire. Un numéro non reconnu comme français n'est pas deviné : ses notes sont proposées « à vérifier » sur la fiche.
- Liste d'attente : une proposition ne naît plus expirée. Délai standard (2 h, au plus tard 1 h avant l'arrivée) s'il est encore à venir ; sinon un mode « Dernière minute », annoncé avant le clic (15 min, sans dépasser l'heure d'arrivée) ; à l'heure d'arrivée, plus de proposition. Mode et échéance enregistrés à la création ; expirée à l'échéance exacte ; le refus d'une acceptation dit si le délai est dépassé ou si la place a été prise.
- Repli de terrasse en mode connecté : il s'appliquait déjà déplacement par déplacement, mais l'écran et les documents annonçaient un « tout ou rien ». Le bilan dit maintenant, réservation par réservation : déplacée, refusée, non tentée, résultat à vérifier ; la phrase principale compte ce qui s'est réellement passé ; une réponse perdue fait relire l'état avant toute reprise ; un double clic ne lance pas deux séries ; « Reprendre le repli » ne porte que sur ce qui reste.
- « Lancer une démonstration » (barre du haut sur ordinateur, page Aujourd'hui et menu ⋯ sur téléphone ; absent du site d'essai connecté) : quatre scénarios de trois minutes, « Le service commence », « Une place se libère », « La terrasse doit rentrer », « Le client change ses plans ». Chacun a sa situation de départ, ses données fictives, sa date et son heure, trois à cinq actions suggérées et une conclusion qui n'apparaît qu'une fois les actions réellement faites.
- Un scénario a son espace de données à part : les données habituelles, les horaires et les fermetures ne sont ni lus ni modifiés ; un onglet ordinaire reste dans son contexte ; « Quitter la démonstration » rend l'espace habituel. « Recommencer ce scénario » n'efface que les données fictives du scénario.
- Horloge de démonstration : date et heure simulées, affichées dans le bandeau, « Avancer de 15 minutes ». Elles servent aux services ouverts, aux arrivées, aux retards, aux disponibilités, aux échéances et à la saison de la terrasse. La page Réserver et « Votre venue », ouvertes depuis un scénario, suivent ses données et son heure ; un rechargement garde la progression.
- Sur téléphone, le lien d'une ligne « En ce moment » d'Aujourd'hui passe sous le texte (il pouvait chevaucher une pastille repliée sur deux lignes).
- Tests : 13 de plus (`_audit/tests/presente.test.mjs`), dont le mode connecté joué avec un faux serveur ; un parcours de plus dans l'audit, les quatre scénarios de bout en bout sur ordinateur et à 390 px.

**Un service parfaitement accompagné (v7.11.0)**

Deuxième des six étapes (`_exploitation/vision-et-feuille-de-route.md`). Promesse : « Je sais qui arrive, où l'installer et quelle décision prendre ensuite. » Détail, scénarios et limites : `_exploitation/livraison-v7.11.0.md`.

- Cinq notions tenues séparées : la réservation, la liste d'attente, la présence du groupe (attendu, en retard, arrivé, installé, parti), l'affectation (table ou tables rapprochées), l'état de la table (prête, occupée, à débarrasser, à préparer, indisponible). Un groupe arrivé n'est pas installé ; une table vide n'est pas forcément prête ; la durée prévue ne libère pas une table ; un rappel sans réponse n'annule rien.
- Service : chaque ligne propose sa prochaine action ; retard annoncé, groupe incomplet, absence, annulation par le client. « Des clients se présentent » (sans réservation) : les tables prêtes avec leur raison, pourquoi les autres ne conviennent pas, installer, attendre sur place ou liste d'attente. Les tables à remettre en état : « Débarrassée », puis « Table prête ».
- Salle : état de chaque table, « Pourquoi pas les autres ? » pour une réservation choisie, tables à rapprocher (assemblages de la configuration, capacité dite, inutilisables séparément pendant le repas, « Séparer les tables »).
- Repli de terrasse : « Préparer un repli en intérieur » montre un aperçu (réservations concernées, places proposées, groupes installés, sans solution, décisions), s'ajuste, s'applique avec revérification et dit précisément ce qui a été fait. Fermer ne change rien. Hors saison, un exemple d'un soir d'été se charge.
- Liste d'attente : onglet « Attente » (filtres, ancienneté, places à proposer) et inscription depuis la page Réserver. Règle : la proposition ne bloque rien, la disponibilité est revérifiée à l'acceptation, une seule réservation est créée même au double clic ; une proposition expirée ou devenue impossible le dit.
- Réserver : un service complet ou une heure prise propose d'autres moments (autre heure, autre service, autre jour, autre espace), chacun disant ce qui change ; la saisie est gardée ; le récapitulatif annonce le statut attendu.
- « Votre venue aux Jardins » (nouvelle page, hors menu) : statut, récapitulatif, informations pratiques ; reconfirmer, demander un changement (la réservation initiale est gardée jusqu'à la décision de l'équipe), compléter, annuler. Pas de compte client.
- Rappels et reconfirmations : réglage du délai, aperçu du message avec le lien, reconfirmation visible dans le service. Tout est aperçu : rien n'est programmé ni envoyé.
- Aujourd'hui et le briefing : libellés harmonisés (Réservations, Couverts attendus, Tables attribuées, Demandes pour ce service ; « toutes activités confondues » pour le total), « En ce moment », nouvelles priorités, « Où en est le service », tables à rapprocher, liste d'attente ; « sans mention, on ne sait pas » pour les allergies.
- Ajustements de la v7.10.0 : identité client (identifiant stable, `06…` = `+33 6…`, jamais de fusion sur le seul nom, anciennes notes conservées, note sous un simple nom « à vérifier ») ; portée dite à l'écran (« sur cet appareil ») ; « Sur la période affichée » et prochaine venue avec l'heure ; « Vue : Direction ▾ » sur une ligne au téléphone ; exemples plausibles (une venue par jour et par personne).
- Mode connecté : réservations, tables et arrivées restent partagées ; installé, parti et état des tables sont notés sur l'appareil et l'écran le dit ; clients sans réservation, tables rapprochées, liste d'attente, « Votre venue » et rappels sont masqués. Aucun enregistrement local n'est présenté comme partagé.
- Site public : la pastille « Aperçu de vos modifications » fait 44 px de haut ; dans le service, « maintenant » ne passe plus sur le chiffre du coup de feu.
- Vérifié : 107 tests de règles (13 nouveaux), le parcours « 1 undecies » (cinq scénarios, ordinateur et téléphone), les 17 parcours existants, l'audit (0 échec après corrections), les tests du serveur (12) et la recette connectée.

**Toute la maison au même endroit (v7.10.0)**

Première des six étapes vers la maquette complète (`_exploitation/vision-et-feuille-de-route.md`). L'existant est gardé ; il est réorganisé autour de la prochaine action. Détail et parcours de test : `_exploitation/livraison-v7.10.0.md`.

- Navigation : **Aujourd'hui · Demandes · Agenda · Offres · Clients · Site**. « Réservations » devient Agenda, « Carte » devient Offres (la carte, l'ardoise et les soirées, dans un seul éditeur), Clients est nouveau. Au téléphone : **Aujourd'hui · Demandes · Service · Plus**.
- Aujourd'hui en quatre zones : le prochain service (réservations confirmées, couverts attendus, demandes à traiter, grandes tablées, à placer), les priorités (déduites des données, une par situation, avec l'action directe), le fil de la journée (services, soirées, réceptions datées, retraits traiteur) et les tâches.
- « Préparer le service » : un briefing pour la date et le service choisis (groupes, allergies et demandes notées, ce qui reste à traiter, installations, tâches), relié aux réservations, imprimable. Il n'invente rien : une information absente est dite absente.
- Tâches : créer, modifier, terminer, supprimer ; échéance, responsable et lien (une demande, un service) facultatifs ; retrouvées après rechargement. Une tâche de suivi s'ajoute depuis une demande et s'y affiche.
- Clients : la liste, une recherche, la même fiche que partout, avec maintenant les demandes du client. Deux personnes ne sont réunies que par leur téléphone ; sans téléphone, la liste le dit.
- Recherche dans « Que voulez-vous faire ? » : clients, réservations, demandes, soirées et plats, avec leur type, leur date et leur état ; chaque résultat ouvre le bon écran.
- Agenda : « Aussi ce jour-là » montre les soirées, les réceptions demandées (qui restent des demandes : rien n'est réservé) et les retraits traiteur. L'onglet Service change de jour sur place.
- Aperçu « Voir comme » Direction, Accueil, Salle, Cuisine (démonstration seulement) : même données, autre mise en avant ; ce n'est pas un contrôle d'accès.
- Démonstration : une personne d'exemple a le même téléphone dans ses réservations et ses demandes (Camille R. a une seule fiche).
- Mode connecté : inchangé pour les réservations (55 points de recette rejoués). Les tâches, comme la carte et les textes, restent sur l'appareil ; l'écran le dit.
- Site public, page À emporter sur téléphone : la légende de la ronde des plats (nom et prix) a un fond sombre, pour rester lisible quelle que soit la photo derrière (contraste signalé par l'audit).
- Vérifié : 94 tests de règles (7 nouveaux), un nouveau parcours « 1 decies » sur ordinateur et téléphone, les 16 parcours existants, la recette connectée, l'audit complet.

**La recette sur Vercel, préparée (v7.9.1)**

Rien ne change sur le site. Rien n'est créé chez un hébergeur.

- `serveur/hebergement/fonction.mjs` et `serveur/outils/construire-fonction.mjs` : l'API comme fonction hébergée, construite en un seul fichier (`api/index.mjs`) avec ses migrations et ses réglages de départ ; elle prépare seule une base vide, refuse les écritures venues d'un autre site, répond 503 sans base (jamais un succès).
- Les migrations prennent un verrou : deux démarrages au même instant ne se marchent pas dessus.
- Vérifié : un 12e test du serveur joue la fonction construite sur une base vide ; la recette dans le navigateur passe à travers elle (55 points, 0 échec).
- La branche git `recette` (jamais fusionnée dans `main`) porte le site construit en mode connecté et la fonction. Marche à suivre, coût affiché et retour arrière : `_exploitation/recette-vercel.md`.
- `.gitignore` : les fichiers `.env` ne peuvent plus être suivis par mégarde.

**L'Hacienda partagée (v7.9.0)**

Les mêmes réservations sur plusieurs appareils, avec des comptes, des droits et une base. **Implémenté et testé ; ni connecté, ni déployé, ni activé** : le site livré se comporte comme la v7.8.1 tant qu'aucun serveur n'est déclaré. Détail, preuves et limites : `_exploitation/avancement.md`.

- Nouveau dossier `serveur/` (non publié) : une API Node sans cadre et une base PostgreSQL. Modèle (`migrations/001_socle.sql`) : comptes, sessions, réglages versionnés, tables, clients, réservations versionnées, affectations de table, clés d'idempotence, journal, suivi des changements.
- Le serveur applique les mêmes règles que le site (`assets/js/disponibilites.js`), avec l'heure de Moineville lue chez lui. Le public envoie une **demande**, qui ne retient aucune table ; l'équipe **confirme**, et la table est retenue dans la même transaction.
- La capacité est garantie par la base : une contrainte interdit deux réservations sur la même table à des heures qui se chevauchent, même si deux appareils valident au même instant.
- Comptes et droits : mots de passe hachés, session par cookie que le script ne lit pas, trois rôles (direction, accueil, édition) contrôlés par le serveur à chaque appel.
- Pas de doublon (clé d'idempotence : dix envois de la même création donnent une réservation) ; pas d'écrasement (version : le second appareil reçoit un conflit et la réservation à jour).
- L'espace en mode connecté (`assets/js/espace-serveur.js`) : vraie connexion ; les réservations, le plan de salle, les complets, fermetures, ouvertures et horaires viennent du serveur ; « enregistré » n'est dit qu'après sa réponse ; état de liaison toujours visible (« Synchronisé à… », « Enregistrement… », « Hors connexion : rien ne s'enregistre ») ; les autres appareils suivent en quelques secondes ; un formulaire ouvert n'est jamais redessiné ; aucune réservation ni demande d'exemple ; à la déconnexion, plus aucun nom dans la page.
- La page Réserver en mode connecté : règles lues sur le serveur, demande envoyée au serveur, « envoyée » seulement avec sa référence, raison du refus dite au client, saisie gardée ; si le serveur ne répond pas, la page le dit et ne simule rien.
- Aucun repli local : une panne du serveur ne produit jamais un enregistrement dans le navigateur présenté comme partagé.
- Le mode connecté ne s'allume que si la page porte `<meta name="jh-api">` : `JH_API=/api node outils/generer.mjs`. Sans cette variable (construction livrée), rien ne change.
- Journal d'activité (qui, quoi, quand), sauvegarde et restauration logiques (`serveur/outils/`), essayées.
- Vérifié : 11 tests du serveur sur un vrai PostgreSQL (`serveur/tests/api.test.mjs`) ; 55 points dans quatre navigateurs indépendants (`serveur/tests/recette-navigateur.mjs`) ; 11 tests du mode connecté sans réseau (`_audit/tests/partage.test.mjs`) ; audit complet de toutes les pages (une mesure de contraste sur `/a-emporter`, page non modifiée, a échoué une fois puis passé seule : à regarder, voir `_exploitation/recette-v7.9.0.md`).
- Encore dans le navigateur seulement : carte, soirées, textes, photos, autres demandes, notes de la fiche client. Aucun message n'est envoyé aux clients ; l'écran de l'équipe le dit.
- `.vercelignore` et le générateur excluent `serveur` et `_exploitation` de la mise en ligne.
- Documents : `_exploitation/` (avancement, architecture, modèle et contrats, environnements, migrations, sauvegarde et restauration, mise en service et retour arrière, recette, limites, guide de l'équipe).

**Stabilisation avant le partage (v7.8.1)**
Les défauts de validation, de sauvegarde et de modifications concurrentes relevés sur la v7.8.0, rejoués puis corrigés (détail et preuves : `_exploitation/stabilisation-v7.8.1.md`). Tout reste dans le navigateur.
- Validation à chaque engagement, sur la réservation précise (`assets/js/espace-garde.js`, consulté par le dépôt avant tout enregistrement) : noter au téléphone, confirmer une demande, remettre une réservation annulée, refusée ou absente, modifier, asseoir à une table (une ou plusieurs). Confirmer une demande de midi après le passage de l'ouverture à 13 h est refusé, avec la marche à suivre.
- Une table qui ne convient plus n'est jamais gardée : trop petite après un changement de couverts, prise à la nouvelle heure, ou donnée entre-temps à quelqu'un d'autre pendant que la réservation était annulée. Elle est retirée dans le même enregistrement, la réservation redevient « à placer », le message le dit, et « Annuler » rend les deux ensemble. Asseoir sur une table prise, ou une réservation qui n'est plus active, est refusé.
- Page Réserver : dernière vérification au moment d'envoyer (heure devenue trop proche, jour changé, service fermé ou dit complet entre-temps) ; le jour suit minuit sans rechargement ; une table souhaitée sur le plan est retirée si elle ne peut pas asseoir le nombre de couverts, et c'est dit.
- Aucune réussite avant un enregistrement réussi : la page Réserver n'affiche l'envoi et la référence qu'une fois la demande enregistrée ; sinon elle le dit, garde la saisie et permet de reprendre. Les quatre autres formulaires signalent une demande qui n'a pas pu être transmise. « Tout remettre comme livré » et sa restauration disent un échec ou une restauration partielle.
- Une demande n'est pas une réservation : la page Réserver dit « Envoyer ma demande », « Votre demande est envoyée », « Demande reçue », « Le restaurant vous confirme votre table par message » (avant : « Votre table est réservée », « Réservé »).
- « Annuler » suit chaque élément d'une liste par son identifiant, champ par champ : une soirée retouchée dans un autre onglet n'est plus dupliquée, la version courante est gardée et l'écran nomme ce qui n'a pas pu être annulé. La liste des soirées publiée est recalculée depuis les données, jamais restaurée telle quelle.
- Fiche client : l'état est mémorisé à l'ouverture, seuls les champs réellement touchés sont enregistrés, une allergie s'ajoute ou se retire une par une ; fermer une fiche intacte n'écrit rien ; le même champ changé ailleurs est signalé et la version enregistrée gardée.
- Saisie au fil de l'eau : une file par champ partout (modèles de messages, notes des demandes, plats) ; sans clé, une écriture a désormais sa propre file.
- Le jour suit minuit dans l'espace. La mini-réservation de l'accueil dit qu'aucun service n'est ouvert au lieu de garder des choix écrits à la génération ; le rendez-vous annoncé en haut de l'accueil et la prochaine soirée disparaissent quand plus aucune soirée n'est visible.
- Les mêmes exceptions pour le public et l'équipe : le générateur pose les exceptions des horaires dans les réglages de la réservation (`fermetures.periodes`) et les ouvertures exceptionnelles dans les horaires. Nouveau bloc « À noter » sous les horaires de la semaine (Infos pratiques) : il annonce la Saint-Sylvestre et les soirées ouvertes par le restaurant. L'ancienne déduction qui changeait « complet » en « fermé » est retirée.
- La barre reconnaît la négation sans « ne » (« ferme pas vendredi soir ») et « ne ferme pas vendredi soir même si c'est complet » ; « plus complet vendredi soir » reste une vraie demande.
- Identifiants durables : chaque plat de `donnees/carte.json` porte un `id` ; il est désigné par « rubrique/identifiant » et plus par son rang. Les anciennes références d'un navigateur sont traduites à l'ouverture de l'espace ; le site lit les deux.
- Tests : soixante-seize, dont onze de stabilisation (`_audit/tests/stabilisation.test.mjs`). Nouveau parcours « stabilisation » dans le navigateur (enregistrement refusé puis repris, 11 h 10 pour midi, minuit, table de deux et dix couverts, listes vides, fiche ouverte dans deux onglets, deux modèles saisis coup sur coup). Pour la mise au point : `PARCOURS_ESPACE=1-nonies` ne joue qu'une étape.

**Lot A : une seule logique pour le site et l'équipe (v7.8.0)**
Premier lot du passage vers un outil d'exploitation (plan et état des lieux dans `_exploitation/`). Tout reste dans le navigateur : rien n'est encore partagé, envoyé ni payé.
- Les règles de disponibilité sont dans un seul fichier, `assets/js/disponibilites.js`, que lisent la page Réserver, la mini-réservation de l'accueil et tout l'espace : ouvertures, heures d'arrivée, « complet », faisabilité d'une réservation. L'aperçu ne recalcule plus rien : il pose ce que le restaurant a changé dans les réglages de la page (`equipe`).
- Corrigé sur le site public : un service dit « complet » dans l'espace restait proposé sur la page Réserver ; modifier les horaires de la semaine fermait la Saint-Sylvestre ; une ouverture déplacée à 13 h laissait proposer midi. Le contournement de `site.js` pour la Saint-Sylvestre est retiré ; les « complets simulés », qu'il rendait déjà sans effet, sont coupés (`complets_simules: false`) : seul le restaurant ferme un créneau.
- La dernière arrivée est distincte de la fermeture : réglage `derniere_arrivee_avant_fermeture` (60 min le midi, 150 min le soir, déduits des horaires publiés, à confirmer).
- Ouverture exceptionnelle depuis l'agenda : un service que la semaine tient fermé s'ouvre pour un jour (bascule « Ouverture exceptionnelle »), réservable aussitôt sur le site. L'agenda écrit pourquoi un service est fermé et ses vraies heures d'arrivée du jour.
- Garde-fou des réservations, dans le dépôt de données : une réservation impossible (fermé, heure qui n'est pas une arrivée, date passée ou inexistante, couverts hors limites) est refusée avec sa raison, d'où qu'elle vienne ; confirmer une demande pour un service fermé entre-temps est refusé. Un service dit complet reste ouvert à l'équipe, qui est prévenue.
- Les demandes en attente sont cherchées jusqu'à l'horizon de la réservation (60 jours) et au-delà pour celles déjà reçues ; avant : 28 jours.
- Plus de limite à 80 demandes (les plus anciennes étaient effacées sans avertissement).
- « Annuler » défait le dernier geste et lui seul : ce qui a été fait ensuite dans un autre onglet est gardé ; si la même chose a été retouchée, elle reste et l'écran le dit.
- Saisie au fil de l'eau : une écriture en attente par champ, toutes enregistrées avant de redessiner, de changer de rubrique ou de quitter la page. Avant, saisir deux champs à moins d'une demi-seconde perdait le premier.
- Une table qui ne convient plus après une modification (trop petite, prise à la nouvelle heure) est retirée, et dit.
- La barre ne remplace plus rien en silence : date ou heure impossible, couverts hors limites, phrase négative donnent une explication ; s'il manque l'heure ou les couverts, elle les demande ; si l'heure n'est pas une arrivée, elle propose des choix et n'en valide aucun d'office. « Midi et demi », « 20 h et quart », « 20 h moins le quart » sont compris.
- Le prochain rendez-vous annoncé en haut de l'accueil suit une soirée modifiée. La bascule de l'annonce ne bouge plus quand le navigateur refuse d'enregistrer.
- Reste incohérent, noté dans l'état des lieux : la section Saint-Sylvestre de « Les fêtes » et l'idée cadeau de « Offrir » ont leurs propres textes ; une ouverture exceptionnelle n'apparaît pas dans les horaires affichés.
- Tests : soixante-cinq, dont douze scénarios de régression (`_audit/tests/lot-a.test.mjs`). L'ancien contrôle de « Complet » lisait les données de la page et passait à tort : il regarde maintenant ce que voit le visiteur. Nouveau parcours « cohérence » dans l'espace et sur la page Réserver.

**Votre espace : le plan de salle et la fiche client (v7.7.6)**
- « Salle », nouvel onglet de « Réservations » (Agenda, Service, Salle, Bilan) : le plan de la salle pour le service choisi. Les tables sont celles du plan de la page Réserver (`donnees/salle.json`) : un client qui a choisi sa table sur le site arrive déjà placé.
- Placer : on touche une réservation, puis une table. Les tables libres et assez grandes s'entourent, la plus petite qui suffit est « Proposée ». À la souris, l'étiquette se glisse sur la table. Une table prise à cette heure-là refuse et dit par qui ; chaque geste s'annule.
- « Placer tout seul » assoit ce qui reste, les grandes tablées d'abord, sans jamais mettre deux tablées à la même table en même temps ; ce qui ne tient nulle part est nommé.
- Une table touchée dit qui s'y assoit pendant le service, propose « Asseoir ici » et « Retirer de la table ». Chaque état est écrit sous la table (libre, l'heure et les couverts, arrivés, fermée) et rappelé en légende ; deux réservations en même temps sur une table sont signalées « à revoir ».
- Sur écran large, chaque table est à sa place sur le plan (murs, baies vitrées, cheminée, bar, terrasse) ; sur téléphone, les tables sont rangées par zone, en gros boutons. La terrasse est fermée hors saison (juin à septembre), comme sur le site.
- La table suit la réservation : agenda, « Aujourd'hui », frise du service, feuille de service (colonne « Table »).
- La fiche client : le nom d'un client se touche partout où il apparaît. La fiche réunit ce que l'agenda sait (venues, à venir, absences, ses réservations, avec « Voir » pour ouvrir le service) et ce que la maison note : « Habitué de la maison », allergies (les quatorze allergènes), préférences. Tout est enregistré aussitôt et s'annule.
- Ce qui est noté suit le client : « Habitué » à côté de son nom, ses allergies sur chacune de ses réservations et sur la feuille de service. Un client se reconnaît à son téléphone, à défaut à son nom ; les clients d'exemple sont marqués « Client d'exemple, nom inventé » et gardent le même téléphone d'une réservation à l'autre.
- La barre comprend « plan de salle », « placer les tables ». L'onglet « Bilan de la semaine » s'appelle « Bilan » (quatre onglets tiennent sur un téléphone).
- Données : `assets/js/espace-salle.js` et `assets/js/espace-clients.js` (fonctions pures), actions `placerResa`, `placerPlusieurs`, `client` ; `resa.tables` et `clients` dans l'état.
- Tests : cinquante-trois. L'audit place une réservation à la table proposée, annule, place tout, vérifie la table dans la frise et sur la feuille, ouvre la fiche, note « Habitué » et une allergie, les retrouve sur la réservation et la feuille, libère la table ; il mesure le plan, la table ouverte et la fiche à cinq tailles.

**Votre espace : le service (v7.7.5)**
- « Service », nouvel onglet de « Réservations », entre l'agenda et le bilan : le service du jour choisi (midi ou soir, celui du moment d'office), ses couverts, ses tables, les arrivés et les absents.
- « Couverts à table » : quart d'heure par quart d'heure, combien de couverts sont assis ; le coup de feu est marqué et écrit (« coup de feu à 20 h 45 : 17 couverts »), un trait rouge dit « maintenant » pendant le service, et la vue en tableau donne les mêmes chiffres. Un repas compte 1 h 30 le midi et 2 h le soir : durées indicatives, écrites sous le graphique, à régler avec le restaurant.
- La frise : une ligne par réservation, posée sur les heures du service, de son arrivée à la fin du repas (sur ordinateur ; sur téléphone, la liste seule).
- Le jour même : « Arrivés » et « Absent ». Une table notée absente ne compte plus dans les couverts ni dans le remplissage ; le bilan de la semaine compte les absents. Un jour à venir : « Annuler la réservation ». Chaque geste s'annule, et « Remettre la réservation » ou « Pas encore arrivés » revient en arrière plus tard.
- « Modifier » une réservation, qu'elle vienne du site, du téléphone ou des exemples : heure (d'un service à l'autre aussi), couverts, nom, téléphone, note (allergie, chaise haute, occasion). L'agenda, « Aujourd'hui », les suggestions et le bilan suivent.
- « Imprimer la feuille » : la feuille de service du jour sur une page (heure, nom, couverts, note, téléphone, table, case « arrivés »), pour la salle et la cuisine ; elle porte « Démonstration : réservations d'exemple, noms inventés ».
- La barre comprend « service », « feuille de service », « coup de feu » ; « Aujourd'hui » a son lien « Voir le service en frise ».
- Données : `assets/js/espace-service.js` (fonctions pures : la frise, la charge, les gestes) et l'action `modifierResa` (`resa.modifs` dans l'état) ; statut « absente ».
- Tests : quarante-sept. L'audit note une table par la barre, la retrouve dans la frise, compare le résumé à la frise et le coup de feu à son tableau, modifie puis annule, retire puis remet la réservation, imprime la feuille, et mesure la frise et son formulaire à cinq tailles.

**Votre espace : l'espace qui propose (v7.7.4)**
- « L'espace vous propose », en tête d'« Aujourd'hui » : trois suggestions au plus, chacune avec le bouton qui la règle (annulable) et « Plus tard » (elle se tait jusqu'au lendemain). Une suggestion n'existe que si les données la justifient : un service à quatre cinquièmes de sa capacité (« Samedi 21 novembre au soir : 52 couverts sur 60 », bouton « Dire complet »), une table pour aujourd'hui ou demain sans réponse, une demande qui attend depuis deux jours ou plus, une soirée dans les quinze jours sans prix, une fermeture dans les trois semaines que rien n'annonce (bouton « Afficher l'annonce », avec son texte). Rien n'est deviné.
- Le bilan de la semaine, nouvel onglet de « Réservations » : couverts, remplissage des services ouverts, service le plus chargé, tables à confirmer ; service par service, une jauge sur la capacité (« presque plein » et « complet » écrits, pas seulement en couleur) ; la vue en tableau ; d'où viennent les réservations (site, téléphone, exemples). Les réservations de la démonstration étant des exemples, c'est écrit au-dessus des chiffres, avec la capacité de 60 couverts à remplacer par la vraie.
- La dictée dans la barre : un bouton micro écrit dans le champ ce qui est dit (reconnaissance de la parole du navigateur : Chrome, Edge, Safari) ; rien n'est lancé sans Entrée ou un toucher ; sans cette capacité, le bouton n'apparaît pas. Non vérifiée ici avec un vrai micro.
- Sur l'écran d'accueil : l'espace a son manifeste (`assets/espace-manifest.json`) et ses icônes tirées du logo ; « Installer sur cet appareil » (menu « Plus d'actions ») donne la marche à suivre pour iPhone, Android et ordinateur, et propose « Installer maintenant » quand le navigateur le permet. L'installation réelle est à essayer sur un téléphone.
- La barre comprend « bilan » ; une fenêtre ouverte (barre, photothèque, installation) passe devant le message du bas.
- Données : `assets/js/espace-conseils.js` (fonctions pures : les suggestions, le bilan) et l'action `taireConseil` ; une soirée créée puis complétée garde ses autres champs.
- Tests : quarante-deux. L'audit note un groupe de trente, vérifie la suggestion, « Dire complet » et son annulation, « Plus tard », le bilan contre son tableau, la fenêtre d'installation et le manifeste.

**Votre espace : la carte en main (v7.7.3)**
- La carte du site se modifie depuis l'espace (rubrique « Carte », onglet « La carte ») : les vingt plats, rubrique par rubrique, avec leur prix.
- « Épuisé aujourd'hui », d'un toucher, en plein service : la carte du site barre le plat et l'indique aussitôt ; le lendemain, il revient tout seul (la date enregistrée n'est plus celle du jour).
- « Modifier » ouvre le plat : nom, prix (un nombre, ou des mots comme « Prix du marché »), description, végétarien, et les quatorze allergènes à déclaration obligatoire. Rien n'est coché d'avance : ce que le restaurant coche s'affiche sous la description, sur le site. « Sur la carte » retire ou remet un plat ; « Ajouter un plat » en crée un en fin de rubrique. Tout s'enregistre au fil de la frappe et s'annule.
- Sur le site (`/la-carte`) : nom, prix, description, pictogramme végétarien, allergènes, plats retirés et ajoutés suivent ; l'en-tête de la rubrique modifiée (fourchette de prix, nombre de propositions) est recalculé avec la règle de la page ; la recherche et le filtre végétarien lisent la carte modifiée. La carte de la page d'accueil, elle, n'est pas modifiée par l'espace.
- L'ardoise à la craie (onglet « L'ardoise ») : plus de cadres autour des champs, l'écriture de la maison (Caveat), un trait sous chaque ligne ; sur téléphone, le nom du plat prend toute la largeur.
- La barre comprend la carte : « épuisé : foie gras », « plus de foie gras », « il reste du foie gras », « foie gras à 23 € ». Un plat inconnu n'est pas deviné.
- Données : `assets/js/espace-carte.js` (fonctions pures : la carte telle que l'espace l'a laissée, les prix, retrouver un plat) et quatre actions (`plat`, `ajouterPlat`, `platVisible`, `epuise`). Le fichier `donnees/carte.json` n'est jamais modifié : l'espace garde ce qui change, plat par plat (clé « rubrique/rang »).
- Tests : trente-six. L'audit modifie la carte dans l'espace et vérifie la carte du site (épuisé, prix, allergènes, plat ajouté, retour le lendemain).

**Votre espace : tout arrive ici (v7.7.2)**
- Les cinq formulaires du site arrivent dans l'espace. Jusqu'ici, seule la réservation de table y parvenait ; la demande de réception (page Réceptions), la commande traiteur (page Traiteur), la carte cadeau (page Offrir) et la question (page Infos pratiques) y arrivent aussi.
- Nouvelle rubrique « Demandes » : une seule liste, ce qui attend une réponse d'abord. Des filtres (Tout, Tables, Réceptions, Traiteur, Cartes cadeaux, Questions) avec le nombre à traiter. Une carte par demande : qui, quoi, depuis quand, et un bouton pour l'étape suivante. En l'ouvrant : les détails, appeler ou écrire, les étapes, le message au client, une note pour l'équipe.
- Le suivi des réceptions : chaque demande avance par étapes (nouvelle, rappelé, visite faite, devis envoyé, signé, ou sans suite), d'un geste, annulable ; le filtre « Réceptions » montre combien il y en a à chaque étape. La commande traiteur a les siennes (confirmée, prête, retirée), la carte cadeau (envoyée) et la question (répondue) aussi.
- L'arrivée en direct : une demande faite sur le site dans un autre onglet s'affiche dans l'espace resté ouvert (« Nouvelle demande depuis le site : … »), le nombre à traiter augmente, « Voir » ouvre la demande. Pour la présentation : deux fenêtres côte à côte.
- Le message au client : avant de confirmer une table, « Voir le message au client » montre le texte qui partira ; chaque demande ouverte montre le sien. Nouvel onglet « Messages » : cinq modèles à retoucher (table confirmée, table refusée, réception, commande, carte cadeau), avec les mots entre accolades remplis tout seuls et un aperçu. L'envoi reste simulé, et c'est écrit.
- Nouvelle organisation, cinq rubriques : Aujourd'hui, Demandes, Réservations, Carte, Site. « Site » regroupe en onglets les soirées, l'annonce et les horaires, les textes, les messages et les photos (les onglets se parcourent aux flèches) ; « Carte » porte l'ardoise de la semaine. La page « Textes et horaires », qui faisait plus de 4 000 px sur téléphone, n'existe plus.
- Sur téléphone, les horaires de la semaine ne sont plus un tableau à faire glisser : un jour par bloc.
- « Aujourd'hui » montre tout ce qui attend une réponse, tables et autres demandes ; la petite fête arrive quand tout a une réponse.
- Les demandes de démonstration (trois réceptions, une commande, une carte cadeau, une question) sont inventées et marquées « Exemple » ; les produits de la commande sont ceux de la page Traiteur. Celles qui viennent du site sont marquées « Depuis le site ».
- Données : une troisième entrée dans le stockage (`jh-espace-demandes:v1`), trois actions de plus (`etapeDemande`, `noteDemande`, `modeleMessage`), `ecouter()` dans le stockage (demain : un abonnement au serveur). « Tout remettre comme livré » efface aussi ces demandes, et « Annuler » les rend.
- Tests : vingt-huit. L'audit fait une demande de réception et une commande traiteur comme un visiteur, vérifie l'arrivée en direct, les étapes, le message retouché, et mesure chaque rubrique et chaque onglet.

**Votre espace : la barre « Que voulez-vous faire ? » (v7.7.1)**
- Une barre pour tout faire en une phrase : Cmd ou Ctrl + K (ou « / »), le bouton « Que voulez-vous faire ? » de la barre du haut sur ordinateur, un bouton rond rouge au-dessus des rubriques sur téléphone.
- On écrit comme on le dirait ; l'espace répond en toutes lettres, avec la date entière (« Fermer samedi 21 novembre au soir »), et Entrée ou un toucher lance l'action. Elle s'annule dix secondes, comme les autres.
- Ce qu'elle comprend : fermer ou rouvrir un service (« fermer samedi soir »), le dire complet (« complet demain midi »), créer une soirée (« ajouter une soirée raclette le 12 » crée le billet et l'ouvre pour le prix et la photo), poser une fermeture (« congés du 4 au 18 janvier »), afficher ou retirer l'annonce (« annonce : complet ce soir, merci ! »), noter une réservation prise au téléphone (« table pour 4 vendredi 20 h au nom de Martin »), ouvrir une rubrique (« horaires », « ardoise ») et retrouver un client par son nom. Dates comprises : aujourd'hui, demain, après-demain, un jour de la semaine, « le 12 », « 24 décembre », « 12/12 », « du 4 au 18 janvier ».
- Ce n'est pas une IA : ce sont des règles écrites, dans le navigateur (`assets/js/espace-commandes.js`, fonctions pures). Une phrase hors de ces familles n'est pas comprise : la barre le dit (« Pas compris ») ; champ vide, six exemples à toucher remplissent le champ sans rien lancer. Un service déjà fermé, ou un jour sans service, est dit tel quel au lieu d'être fermé deux fois.
- Ce que la barre ouvre ou crée est repéré d'un liseré d'or (la réservation notée, la carte des horaires, de l'ardoise ou de l'annonce).
- Une petite fête quand la dernière demande a reçu sa réponse : des assiettes dorées s'envolent une fois, « Tout a une réponse : bon service ! ».
- Des états vides qui disent quoi faire : « Pas encore de réservation » propose de noter une réservation prise au téléphone, « Aucun événement à venir » de créer une soirée, « Aucune fermeture prévue » d'indiquer les dates des congés.
- « Fermer » et « Complet » acceptent plusieurs services d'un coup (« fermer vendredi » ferme le midi et le soir en une seule action, donc un seul « Annuler »).
- Tests : vingt-deux (`node --test _audit/tests/*.test.mjs`), dont dix pour les phrases et les dates. Le parcours de l'audit essaie la barre au doigt et au clavier, l'annulation, la fête, et mesure la barre aux cinq tailles.

**Votre espace, le service en main : l'application et le filet (v7.7.0)**
- Une fois connecté, l'espace est une application : l'en-tête, le pied de page et la barre « Appeler / Réserver » du site s'effacent (sur téléphone, cette barre recouvrait « Confirmer » et « Refuser »). L'en-tête de l'espace devient la barre du haut : « Démonstration », l'état de l'enregistrement, « Voir le site » et le menu « Plus d'actions » (voir le site, se déconnecter, tout remettre comme livré).
- Sur téléphone et tablette, les cinq rubriques sont en bas de l'écran (Jour, Agenda, Soirées, Textes, Photos), avec le nombre de demandes en attente ; sur ordinateur, elles restent à gauche. Chaque rubrique s'ouvre en haut de page.
- Un geste égale une action, et chaque action s'annule : le message du bas dit ce qui vient d'être fait et propose « Annuler » pendant dix secondes (un filet d'or se vide) ; Ctrl ou Cmd + Z fait de même. « Refuser », « Supprimer » et « Tout remettre comme livré » ne sont plus définitifs. Les saisies qui se suivent dans un même champ ne font qu'un pas en arrière.
- L'enregistrement est visible : « Tout est enregistré », « En cours… » pendant la frappe, « Enregistré à 16 h 42 », « Non enregistré » si le navigateur refuse.
- Sur téléphone : « Confirmer » et « Refuser » en gros boutons côte à côte, le numéro du client sur 44 px de haut, « Semaine précédente » et « Semaine suivante » en toutes lettres sous les jours (les flèches étaient masquées : on ne pouvait pas changer de semaine) ; à 320 px, la ligne des jours se fait glisser.
- Une seule couche de données, prête pour le réel : `assets/js/espace-stock.js` est le seul fichier qui touche à la mémoire du navigateur (schéma numéroté, mise à niveau des données de la v7.6.0) ; `assets/js/espace-donnees.js` porte les seize actions nommées du restaurateur (fonctions pures) et le dépôt qui enregistre, prévient et annule ; `assets/js/espace-regles.js` porte les règles (horaires, ouvertures, réservations de démonstration, événements). La page Réserver passe par le stockage. Pour brancher une API, seul le stockage change.
- Les textes modifiés gardent la typographie française (espace insécable devant : ; ! ?).
- Tests : `node --test _audit/tests/*.test.mjs` (douze tests des règles, des actions, de l'annulation et du schéma). L'audit entre maintenant dans l'espace (`_audit/parcours-espace.mjs`) : « réserver sur le site, puis confirmer dans l'espace », « Complet » qui ferme le service sur Réserver, « Tout remettre comme livré » et son annulation, puis chaque rubrique mesurée à cinq tailles (débordement, textes sous 12 px, cibles de 44 px, contrastes, axe) et un balayage de 320 à 1920 px. Ces mesures ont trouvé dix-huit défauts, tous corrigés.
- Audit fourni : dans `_audit/audit.mjs`, le contrôle du menu attend la nouvelle adresse après le clic (il mesurait la page de départ et échouait à tort depuis `/espace`, déjà en v7.6.0).

**Votre espace : l'espace restaurateur en démonstration (v7.6.0)**
- Nouvelle page `/espace` (lien discret « Espace restaurateur (démo) » dans le pied de page) : connexion fictive déjà remplie, puis cinq rubriques dans les couleurs du site.
- Aujourd'hui : les réservations et les couverts du jour, midi et soir avec leur jauge, les demandes à confirmer (confirmer ou refuser d'un geste), le prochain événement, ce que le site montre en ce moment.
- Réservations : l'agenda de la semaine (un badge par jour pour ce qui attend), midi et soir côte à côte avec leurs réservations, « Complet » et « Fermé ce jour » (la réservation en ligne suit aussitôt), « Arrivés », et une réservation prise au téléphone. Les réservations de démonstration sont tirées des vrais horaires, avec des noms inventés.
- Une réservation faite sur la page Réserver arrive dans l'agenda, « Depuis le site », à confirmer.
- Événements : modifier, masquer ou créer une soirée (titre, genre, date, service, prix, photo de la photothèque ou de l'appareil, cadrage en touchant la photo), avec l'aperçu du billet ; la page Les fêtes, la prochaine soirée de l'accueil et le choix des dates de Réserver suivent.
- Textes et horaires : l'annonce affichée sur toutes les pages, les fermetures exceptionnelles, les horaires de la semaine (le statut « ouvert maintenant » et la réservation suivent), l'ardoise du midi et du soir (La carte et le dos de la photo du chef), six textes de l'accueil.
- Photos : six emplacements (le chef, Le Restaurant, la devise, les ouvertures de Les fêtes, Offrir et Infos pratiques) à remplacer et à cadrer.
- Tout reste dans le navigateur : sur le site, une pastille « Aperçu de vos modifications » le rappelle ; « Tout remettre comme livré » efface tout.

**Réserver, une étape à la fois (v7.5.31)**
- Le long formulaire devient quatre étapes, une seule à l'écran : 1 Quand, 2 Combien (et à quelle heure), 3 Où, 4 Vous. Une frise numérotée en haut montre où l'on en est (la ligne d'or avance, les étapes faites sont cochées et restent cliquables) ; « Retour » et « Continuer » en bas, et chaque étape se vérifie avant de passer à la suivante.
- Les sept prochains jours sont des cartes de calendrier (le mois en bandeau, le jour en grand) avec un soleil et une lune allumés quand le midi ou le soir a encore de la place ; « Plus tard » ouvre le calendrier du mois (les jours fermés ou complets grisés).
- Midi ou soir en deux grandes tuiles avec leurs heures d'ouverture.
- Les couverts : les assiettes se posent autour d'une table ronde et glissent pour se répartir quand on en ajoute (bougie au centre le soir, fleur le midi) ; une phrase suit (« Un dîner à deux », « Une tablée de huit »…). Sur téléphone, la table et le compteur sont côte à côte.
- Les heures sur une frise : une ligne d'or file jusqu'à l'heure choisie, les heures pleines en gras, les créneaux complets barrés.
- La salle ou la terrasse en photo (la terrasse grisée hors saison, « de juin à septembre ») ; un lien mène au plan pour choisir une table précise.
- Le récapitulatif devient un carton de table qui se remplit à mesure : la date écrite à l'encre, l'heure tamponnée, une assiette par couvert, l'installation, le nom ; chaque ligne ramène à son étape. À la confirmation, le tampon « Réservé » s'abat sur le carton, avec la référence.
- Sans JavaScript, le formulaire reste d'un seul tenant (calendrier, liste d'heures) ; arrivée depuis l'accueil ou l'agenda avec le jour et le service, on commence aux couverts.

**Accueil, la devise et les avis qui défilent (v7.5.30)**
- « Ce que nos clients retiennent » montre enfin des avis : dix vrais extraits publiés (Mariages.net, Bridebook, Google), avec le prénom, le mois, la source et les étoiles, sur des cartes qui défilent en continu (deux rangs en sens contraires sur un grand écran, un rang sur un écran bas ou un téléphone), arrêtées au survol ; les avis Google en anglais sont traduits et le disent. Sources et date du relevé dans donnees/avis.json et sous la section.
- Les trois cartes génériques (le cadre, l'assiette, l'accueil) laissent la place aux avis ; la section est plus compacte (551 px en 1288 × 628, 618 en 1366 × 768 : elle tient dans l'écran).

**Accueil, « Pour les fêtes » : le juste milieu (v7.5.29)**
- La section remplit exactement l'écran (563 px sur 563 en 1288 × 628, 703 sur 703 en 1366 × 768) au lieu de laisser voir la section suivante ; bandeaux plus hauts.
- Cartes claires (crème) qui ressortent sur le fond sombre ; spécialités en rouge brique, montants en pastilles blanches.
- La carte cadeau est mise en page sur 340 px et centrée dans son bandeau : sa validité tient sur deux lignes, le montant ne passe plus dessous.

**Accueil, « Pour les fêtes, ou pour faire plaisir » (v7.5.28)**
- Fond sombre (la nuit des fêtes, une lueur dorée en haut) : cartes en verre fumé cerclé d'or, titres crème, spécialités en or, montants de la carte cadeau en pastilles sombres (le choisi en or).
- Toute la section tient dans un écran d'ordinateur, sans défiler (557 px sur 563 disponibles en 1288 × 628 ; 684 sur 835 en 1440 × 900) : la photo en bandeau, les spécialités en une phrase au lieu de six étiquettes, des espacements resserrés. La carte cadeau garde sa mise en page et se réduit d'un bloc selon la hauteur de l'écran ; les deux bandeaux ont la même hauteur (titres alignés).

**Accueil, « Le Restaurant » (v7.5.27)**
- L'ancienne section « Au coin du feu » devient « Le Restaurant ». Le grand titre est « Le Restaurant », avec au-dessus « Au coin du feu » l'hiver et « Aux beaux jours » l'été ; le texte suit la saison.
- Photo : la vraie salle le soir, nette et en grand (table ronde en bois flotté, fauteuils crème, mur de pierre et ses bûches), recadrée pour ôter un serveur flou au bord. L'ancien gros plan (verres, feu, fourrure floue, image trop petite pour un grand écran) devient une petite photo encadrée, « Le coin du feu », dont les flammes ondulent et d'où partent les braises qu'on attise à la souris ; l'été, la piscine sous les palmiers, sans braises.
- Contenu : trois repères dessinés au trait (la cuisine de saison du chef Régis Clauss, une nouvelle carte chaque semaine, les tables près de la cheminée l'hiver ou la terrasse au bord de la piscine l'été ; la flamme vacille, le soleil tourne), les services de la semaine tirés des horaires (midi : mercredi, jeudi, vendredi et dimanche ; soir : vendredi et samedi) et l'état ouvert/fermé réel.
- Animation sur ordinateur : la photo s'ouvre toujours jusqu'au plein écran, « Le Restaurant » au centre (ses lignes se lèvent) ; puis le titre glisse à gauche, le texte, les repères et les services montent, la photo du feu et la réservation arrivent de la droite. Le titre n'est plus coupé en deux. Tablette et téléphone : la photo en tête, le titre posé sur son bas, puis le reste à la suite.

**Passe téléphone, téléphone à l'horizontale et tablette (v7.5.26)**
- Audit complet à toutes les tailles (téléphones de 320 à 390 px, téléphone à l'horizontale, tablettes, ordinateurs) et relecture des neuf pages écran par écran sur un écran d'iPhone (une centaine d'écrans). Premier passage : 25 échecs, tous sur téléphone, à l'horizontale ou sur tablette (les reprises page par page s'étaient faites sur ordinateur) ; après corrections : 0 échec.
- Accueil, « La carte de la semaine » : sur téléphone et tablette, les quatre assiettes de la scène (réservée à l'ordinateur) s'affichaient en grandes photos à la suite, près de trois écrans avant la carte ; elles sont masquées.
- Les fêtes, la Saint-Sylvestre : la mise en page restait en deux colonnes sur téléphone (le prix, l'interrupteur et le bouton dans une bande de 140 px, un mot par ligne, le titre coupé) ; une colonne. Chaque plat montre maintenant sa photo au-dessus de son nom sur téléphone (sur ordinateur, la grande assiette à côté de la liste suffit, ces photos ne se chargent pas).
- Infos pratiques : l'ouverture passe en une colonne sur téléphone (le titre cassé en quatre lignes et le bouton d'appel sur deux à côté de l'arche).
- Premier écran sur téléphone (Réceptions, Les fêtes, Infos pratiques, Traiteur) : le titre, le bouton principal et l'information clé (prix, dates, retrait, téléphone) tiennent sans défiler jusqu'au petit iPhone SE ; le paragraphe suit juste en dessous. Réceptions garde son arche en tête, plus petite ; Les fêtes ouvre sur le titre et l'éphéméride, les affiches suivent.
- Téléphone à l'horizontale : la carte de Noël se lit à plat, déjà ouverte (elle sortait de l'écran) ; « Ce que l'on fête ici » passe en deux colonnes (texte à gauche, photo à droite) ; Réceptions et Les fêtes donnent plus de place au texte.
- Petits réglages : le dos du polaroïd du chef (l'ardoise) tient dans une petite carte ; les cartes de la devise restent droites sur une colonne ; le cœur du « oui » ne touche plus le surtitre ; la légende des cloches du Traiteur passe sous le plat ; sur le plan du domaine, l'étiquette cachée d'un point ne capte plus le toucher du point voisin ; les tirets du diaporama des Réceptions gardent 44 px ; l'étoile de la couverture de Noël ne descend plus sous 12 px ; la carte de Noël sans animation prend la largeur de lecture.

**Dernier audit complet, ouvertures et transitions (v7.5.25)**
- Dernier audit complet sur ordinateur (toutes les étapes, neuf pages) et relecture des neuf pages écran par écran en 1440 × 900 (une centaine d'écrans), puis examen image par image des films d'ouverture, de transition et de retour. Résultat après corrections : 0 échec ; restent deux points « à regarder », voulus (le plan du domaine et le faire-part s'animent au toucher, pas au défilement). Les rechargements et les deux boutons de la Saint-Sylvestre signalés au premier passage viennent de l'ordre du test (filtres touchés avant de recharger, saison passée en été).
- Intro de chaque page : le monogramme et le nom n'apparaissent plus deux fois (ils se montraient au premier affichage, disparaissaient au départ de l'animation, puis revenaient) ; le panneau part vide et ils se posent une seule fois.
- Le titre sur lequel l'écran s'ouvre se lève pendant l'ouverture, à heure fixe (avant : à la toute fin de l'intro ; sur la 404, en grand écran, le titre manquait parfois un instant).
- Changement de page : la cloche crème se pose en fondu et se soulève en fondu régulier ; depuis ou vers une page sombre (l'accueil le soir, La carte, Réceptions), plus d'à-coup entre le noir et la crème.
- Accueil, « Carte de la semaine » : les places encore vides portent leur numéro à la craie (01 à 04), on voit tout de suite qu'une carte se remplit, au lieu de cadres vides.
- Fluidité des Fêtes et des Réceptions (défilement à la molette, processeur ralenti quatre fois) : de 5 à 7 % d'images lentes à 2 %. La Saint-Sylvestre ne recalcule plus toute sa scène à chaque image, la carte de Noël ne recalcule plus qu'elle-même, et la mention « Illustration générée » n'a plus de flou derrière elle.

**Audit complet du site et finitions (v7.5.24)**
- Audit complet sur ordinateur des neuf pages (toutes les étapes), puis relecture écran par écran de chaque page en 1440 × 900 et en 1288 × 628, et des versions « été » des Fêtes et des Réceptions, pour la cohérence d'ensemble après les reprises page par page (palette, cartes, boutons, photos, animations, parcours). Résultat après corrections : 0 échec. Les deux points « à regarder » restants sont voulus : le plan du domaine et le faire-part s'animent au toucher, pas au défilement. Les rechargements et deux boutons de la Saint-Sylvestre signalés au premier passage venaient de l'ordre du test (filtres touchés avant de recharger, saison passée en été).
- Le bouton du pied de page suit l'action de la page : « Demander une réception » sur Réceptions (déjà), « Composer ma commande » sur Traiteur, « Composer la carte cadeau » sur Offrir ; ailleurs « Réserver une table ».
- Réserver, le plan de la salle : parquet de chêne clair et dallage crème, à la place du sol rosé.
- Infos pratiques : « Venir à Moineville » ne laisse plus de grands vides entre les règles de l'été (serrées en haut de la colonne), et la vraie photo de la piscine et de la grande pergola les suit ; « Une question » montre la grande table dressée au bord de la piscine au soleil, à la place de la photo de nuit.
- Traiteur, sur un écran bas (1288 × 628) : les cloches suivent la hauteur de l'écran et le nom du produit ne passe plus sur le plat.
- Les fêtes l'été : le médaillon de « L'été au bord de l'eau » montre le bar sous la paillote, au soleil, à la place de la photo de nuit (lanternes et piscine violette).
- Changement de page : la cloche crème s'efface en se soulevant ; en arrivant sur une page sombre (La carte le soir), plus d'à-coup de la crème au noir.
- Accueil le soir : au retour arrière, la photo attend dans le noir chaud au lieu d'une case claire.

**La carte, sans ajout de plats (v7.5.23)**
- À la demande du client, la carte redevient une carte à lire : plus de « + » au bout des plats ni de carnet « Votre repas » dans la barre (code, styles et textes retirés). La carte ouverte, les photos, les étiquettes crème et or et la note des allergènes restent. Offrir garde la lecture de `?montant=` et `?mot=` dans l'adresse.

**La carte repensée (v7.5.22 : la carte ouverte, composer son repas, des photos qui vont ensemble)**
- Analyse approfondie de la page envoyée au client (9,2 écrans en 1440 × 900, 11,5 à 1288 × 628 ; le même gabarit photo et liste répété quatre fois) ; il a retenu les changements ci-dessous.
- La carte ouverte : les quatre rubriques en deux doubles pages de papier crème, comme une vraie carte posée ouverte sur la table (entrées | plats, puis à partager | desserts), avec une ombre de pliure au milieu ; chaque page a sa photo en bandeau, le numéro, la fourchette de prix et le nombre de plats posés dessus. Plus de grande photo fixée à gauche. « Toute la carte » passe d'environ 4,5 à 3 écrans ; la page de 9,2 à 7,8 écrans (de 11,5 à 9,5 à 1288 × 628). Onglets, filtre végétarien et recherche gardés.
- Des photos qui vont ensemble : les entrées montrent la vraie assiette du restaurant (le foie gras maison, sa briochette et son chutney, un verre de blanc), à la place de la terrine en plein jour ; « À partager » montre la planche « La Libanaise » (chaussons aux fromages, épinards et viande, labné ; image Grok demandée au client, dans la même lumière au coin du feu que les plats de la Saint-Sylvestre, mention « Illustration générée » ; document `_suivi/jardins-hacienda-carte-libanaise-grok.docx`, les trois versions reçues dans `recu/grok-carte/`, la deuxième retenue pour le bandeau) à la place du houmous de studio sur fond rose.
- Composer son repas : un « + » doré au bout de chaque plat qui a un prix ; le plat s'envole vers « Votre repas », dans la barre de la carte, qui s'ouvre en carnet de serveur (papier crème, écriture à la main) : les plats et les portions, « Pour 1 » ou « Pour 2 » (une planche à partager compte une fois), le total hors boissons ; « Réserver ce repas » ouvre la réservation au dîner pour le bon nombre de couverts ; « L'offrir en carte cadeau » ouvre Offrir avec le montant juste au-dessus du total et le repas écrit en petit mot sur la carte. Le carnet se referme quand on quitte la carte.
- Offrir lit désormais `?montant=` et `?mot=` (arrivée depuis La carte).
- Étiquettes « Végétarien » et « À partager » en crème et or (plus de rose). « Allergènes et régimes » devient une note discrète sous la carte, lisible dans les deux lumières de la page.
- Audit complet sur ordinateur de La carte et d'Offrir : 0 échec (reste à regarder : la position après un rechargement au milieu de la page, déjà signalée depuis le 10 novembre, due à la passe épinglée).

**Offrir repensée (v7.5.21 : une seule carte, partir d'une idée, la carte qui reste à l'écran, comment la recevoir)**
- Analyse approfondie de la page envoyée au client (3,5 écrans en 1440 × 900, 4,5 à 1288 × 628) ; il a retenu les changements ci-dessous.
- Une seule carte partout : la carte de l'ouverture n'est plus dorée, c'est la même carte vert de nuit et or, guillochée, à double filet, que celle qu'on compose plus bas, avec la même mise en page (logo et noms en haut, « Carte cadeau » en petites capitales dorées, le montant en grand en bas) ; toujours inclinable, reflet doré léger qui suit la main, retournable. La carte de l'accueil et celle des Fêtes prennent la même mise en page. Au dos, l'encre du mot passe en sépia (plus de bleu violet).
- Partir d'une idée, au-dessus des montants : une planche à partager (La Libanaise, la Charcuterie ou la Mer, 45 € la planche → 50 €), un dîner pour deux (œuf cocotte, suprême de pintade et crème brûlée, 96 € pour deux hors boissons → 100 €), la Saint-Sylvestre (le menu et l'accord mets et vins, 170 € par personne → 200 €), avec leur photo ; un toucher choisit le montant et écrit un mot suggéré sur la carte, jamais par-dessus un mot déjà écrit ; choisir un autre montant à la main relâche l'idée.
- La carte reste à l'écran pendant qu'on remplit le formulaire, même sur un écran bas (elle quittait l'écran à 1288 × 628 pendant qu'on écrivait le mot).
- « Pour la recevoir », en trois étapes à côté du bouton : la composer ici, appeler le 06 18 21 28 10 (lien d'appel) pour la recevoir, valable 6 mois sur toute la carte du chef, à présenter à l'arrivée ; la note du bas ne garde que « ne peut être échangée contre des espèces » et la mention de l'achat simulé.
- L'enveloppe aux couleurs du site : la doublure rayée saumon devient rouge à fins filets d'or.
- Audit complet sur ordinateur de la page : 0 échec ; accueil et Les fêtes revérifiés (fichiers et mesures) : 0 échec.

**La Saint-Sylvestre, chaque plat à côté de son verre (v7.5.20)**
- À droite de chaque temps du dîner, le plat lui-même en grand : l'amuse-bouche, le velours de foie gras aux éclats de truffe, l'esturgeon poché au caviar et aux lentilles Béluga, le filet de bœuf aux morilles, le sablé breton au yuzu. Le site du restaurant n'en a aucune photo : cinq images Grok demandées au client (document `_suivi/jardins-hacienda-saint-sylvestre-grok.docx`, originaux dans `recu/grok-saint-sylvestre/`), carrées, même assiette en grès brun, même angle, même lumière au coin du feu ; liseré blanc de Grok retiré au bord ; mention « Illustration générée » sur chacune.
- Le verre de l'accord est posé contre l'assiette, comme sur la table ; à chaque temps, l'assiette servie glisse vers la gauche et s'en va, la suivante arrive de la droite, le verre change de forme et se remplit. L'accord (type, vin, région) est écrit sous l'assiette. Au dessert, la pluie d'or de minuit tombe toujours autour du verre.
- Le titre de la section ne se coupe plus au trait d'union de « Saint-Sylvestre ». Sans JavaScript sur ordinateur, l'assiette et le verre restent à côté de la liste des plats.
- Audit complet sur ordinateur de la page : 0 échec.

**Les fêtes repensée, l'hiver (v7.5.19 : l'éphéméride, les billets, la vraie carte de Noël, la carte cadeau)**
- Analyse approfondie de la page envoyée au client (12 écrans en 1440 × 900, 13,6 à 1288 × 628) ; il a retenu les quatre changements ci-dessous.
- L'ouverture : « J-45 » n'est plus une petite pastille mais une grande éphéméride (reliure rouge, deux anneaux dorés, feuilles crème perforées) ; à l'arrivée, les pages des jours déjà passés s'arrachent une à une et tombent jusqu'au vrai nombre de jours avant la Saint-Sylvestre (« Plus que 45 jours avant la Saint-Sylvestre », calculé chaque jour à Moineville ; « C'est ce soir » le 31). Le choix « Cet hiver / Cet été » quitte le bouton principal et passe en petites capitales au-dessus du titre. À 1288 × 628, toute l'ouverture tient dans l'écran (les affiches étaient coupées en bas).
- Les prochaines dates : six grands billets, trois par mois, chacun avec sa vraie photo, le jour en grands chiffres dorés posé dessus, une ligne perforée et ses deux encoches, le titre, le jour en toutes lettres, le prix, « Réserver » et « Agenda » (fichier .ics) ; ils arrivent en cascade et se soulèvent au survol. Plus de photo unique collée à gauche, plus de « Les Jardins de l'Hacienda, Moineville » répété, plus de ligne rosée. La section passe de 2,6 à 1,8 écran (de 3,7 à 2,6 à 1288 × 628).
- La carte de Noël : sa propre couverture (velours vert sapin, double filet doré, houx, logo, « Menu de Noël », la date) à la place de l'affiche déjà vue à l'ouverture ; la carte plus grande (elle remplit la hauteur de l'écran) ; le menu en grand ; chaque plat s'écrit de gauche à droite à l'encre dorée, une étincelle au bout de la plume, puis son détail apparaît.
- Entre Noël et la Saint-Sylvestre, sur le fond crème des dates : « Pour Noël, offrez un moment aux Jardins ». La vraie carte cadeau (vert de nuit et or) sort de son enveloppe rouge cachetée quand on arrive, s'incline vers la main, et les montants (25 à 200 €) la changent ; « Offrir une carte cadeau » mène à la page Offrir.
- La page passe de 12 à 11,8 écrans malgré la section ajoutée.
- Audit complet sur ordinateur de la page : 0 échec.

**Réceptions, les espaces au défilement (v7.5.18)**
- « Cinq espaces, un seul domaine » sur ordinateur : la section reste à l'écran et la rangée des cinq espaces glisse de droite à gauche en descendant, au rythme de la molette (adouci) ; chaque photo glisse un peu moins vite que sa carte ; le fil doré suit. Les flèches et le clavier font descendre la page jusqu'à l'espace suivant ou précédent.
- Pour tout montrer dans l'écran, même bas (testé à 1288 × 628), le nom de l'espace se pose sur sa photo et la fiche se resserre (capacité et saison côte à côte, l'ambiance dessous) ; la photo prend la hauteur qui reste.
- Sur téléphone, sur un écran trop bas pour tout montrer (moins de 610 px de haut environ) et sans JavaScript : la rangée qui se fait glisser, comme avant.
- Audit complet sur ordinateur de la page : 0 échec, fluidité comprise.

**Réceptions repensée (v7.5.17 : un parcours, une palette, les vrais mariages en grand)**
- Analyse approfondie de la page envoyée au client ; il a retenu les trois changements ci-dessous.
- Le parcours suit le visiteur : l'ouverture, « Ce que l'on fête ici », les espaces, la terrasse au soir venu, « Ils ont dit oui », puis la demande en dernier (elle était au milieu de la page). Sur cette page, le pied de page invite à « Demander une réception » et mène au formulaire, à la place de « Réserver une table ».
- Une palette tenue : les occasions gardent toutes le fond crème de la maison ; les fonds pêche, sauge et rose inventés pour chacune sont retirés. « Ils ont dit oui » et la demande partagent le même fond crème.
- « Ils ont dit oui aux Jardins » : les polaroïds sur le fil à linge (trois écrans et demi fixés, photos petites) deviennent une grande mosaïque de neuf vraies photos de mariages (la cérémonie sous les palmiers en grand, la première danse, la grande tablée, la pièce montée, le repas au bord de l'eau, le nid, la salle dressée, les fleurs, le buffet), qui montent en cascade à l'arrivée ; un clic ouvre toujours l'album en grand (confettis, flèches, clavier, Échap). À côté du titre, la note Google : 4,5 sur 5, plus de 1 600 avis (les chiffres de l'accueil). La photo des lanternes quitte cette section.
- La page passe de 15,4 à 13,5 écrans sur ordinateur (1440 × 900).
- Audit complet sur ordinateur de la page : 0 échec (les légendes manuscrites restent lisibles sur chaque photo grâce au dégradé du bas).

**Retours du client, suite (v7.5.16 : le coin du feu en vraies photos)**
- Accueil, « Au coin du feu » : pas d'image générée ; la grande scène garde la vraie photo de la salle (les deux verres devant le feu), choix du client entre trois vraies photos du site. Les consignes Grok de la v7.5.15 sont abandonnées.
- Accueil, « Un endroit magique », carte « Le coin du feu » : la vraie salle près de la cheminée (feu allumé, bois rangé, table dressée en bois massif), photo du site recadrée sous la décoration de Noël, à la place de la photo des verres (qui reste dans la grande scène : plus de doublon sur la page).

**Audit complet et page par page (v7.5.15 : plus vivant, plus juste)**
- Audit complet sur ordinateur (toutes les étapes) et relecture de chaque page, écran par écran ; analyse page par page envoyée au client, qui a choisi les améliorations ci-dessous.
- La carte, « Toute la carte » : sur grand écran, une grande photo fixée à gauche suit la rubrique lue (fondu enchaîné, léger zoom), avec le numéro, le nom, la fourchette de prix et le nombre de plats calculés depuis la carte (le menu enfant hors fourchette) ; la photo du dessert à la peau de mouton remplacée par la coupe devant la cheminée. « Les mains du chef » : plus de grande photo floue au départ ; l'assiette est nette dans la pénombre et chaque élément s'allume à son tour. L'ancienne fin « Une table vous attend » est retirée (elle doublait l'invitation du pied de page).
- Traiteur, « Le calendrier du retrait » : un calendrier de l'Avent du 5 au 31 décembre (panneau laqué rouge cerclé d'or, 27 portes de papier numérotées qui s'ouvrent en cascade à l'arrivée) ; derrière chaque porte, le midi, le soir ou « Fermé » d'après les horaires ; le jour touché s'illumine (« Votre jour », éclats d'or) et devient le jour de retrait de la commande du panneau, et inversement.
- Évènements : les deux vraies affiches de l'ouverture, plus grandes, se prennent en main (inclinaison et reflet vers la souris, on les attrape et elles reviennent à leur place) et se retournent d'un clic : au dos, le menu en texte lisible, le prix et « Voir le menu » ; la Saint-Sylvestre se tourne un peu seule à l'arrivée pour montrer le geste. Saint-Sylvestre : au dessert, minuit, une pluie d'or et de rubans traverse la scène, trois ondes dorées partent du verre, les bulles accélèrent (aucun éclair). Dans les dates, la photo de Noël à la peau de mouton remplacée par l'assiette devant la cheminée.
- Réceptions, « Ce que l'on fête ici » : dans son palier, la photo de chaque fête part de sa carte et grandit jusqu'à occuper toute la moitié droite de l'écran, bord à bord (photos en portrait : la pleine largeur les aurait agrandies au-delà de leur définition) ; le texte reste à gauche. Pas de bandeau photo du pied de page sur cette page (il suivait le fil à linge de photos).
- Offrir : l'ouverture passe de la salle de nuit (très sombre) à la salle au soleil de midi ; la carte dorée devient un vrai objet : elle se redresse au défilement, s'incline vers la souris avec un reflet doré qui la suit et se retourne d'un toucher (au dos, « Votre petit mot s'écrit ici, de votre main », en écriture manuscrite).
- Réserver : à la confirmation, la salle du plan baisse la lumière, la table choisie devient dorée, une bougie s'allume sous le carton « Réservé » (flamme qui vacille, lueur au sol) ; « Voir votre table allumée sur le plan » dans le récapitulatif.
- Plus de mode calme (décision du 12 novembre 2026 pour les maquettes) : le bouton « Réduire les animations » quitte le pied de page et le menu, le réglage de l'appareil n'arrête plus les animations ; l'audit du projet en tient compte (config.sansModeCalme).
- Fluidité : « Recevoir, le soir venu » (fondus posés sur les images seules, halos par paliers) et « Ce que l'on fête ici » (progression posée sur l'anneau seul) : Réceptions passe d'environ 7 % à 3,6 % d'images lentes, processeur ralenti 4 fois ; calendrier de l'Avent allégé (2,2 %). La légende de la ronde des cloches ne clignote plus à l'ouverture (premier tour après l'arrivée).
- En attente : deux images Grok pour « Au coin du feu » (sans peau de mouton), consignes données.

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
