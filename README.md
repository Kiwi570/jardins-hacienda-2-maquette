# Les Jardins de l'Hacienda (2) · maquette v7 « De midi à minuit »

Maquette du futur site des Jardins de l'Hacienda, restaurant et lieu de réception à Moineville (54), entre Metz, Thionville et le Luxembourg.
Adresse : https://jardins-hacienda-2-maquette.vercel.app (à mettre dans le module Wix « Intégrer un site »). La maquette n'est pas reliée au site actuel.
La v6 est une refonte complète : nouvelle direction, nouvelle base (socle de la skill v10.9.2), nouvelles images ; la logique des modules de la v5 est gardée.
La v7 garde l'idée et la met au propre : une vraie photo de la maison dans chaque section (366 images récupérées sur le site actuel, une vingtaine retenues), une scène propre à chaque page, et 17 modules restaurant de la bibliothèque placés chacun à son heure (10 de plus qu'en v6).

## L'idée

L'accueil raconte une journée à l'Hacienda, sans afficher d'heures (retour du client, v7.4).
L'ouverture, sur le modèle donné par le client : le nom en grand, la pastille du lieu (19 km de Metz), la phrase du chef,
« Réserver une table » et « Voir la carte », puis la saison, le prochain rendez-vous de l'agenda et la bascule été/hiver ;
un bouton pause arrête les animations. Elle a quatre états, posés avant le premier affichage selon la saison et le moment
réels (`data-saison`, `data-moment`) : l'été à midi la piscine (l'eau bouge sous le doigt), l'été le soir la terrasse sous
les guirlandes, l'hiver à midi la vraie salle aux baies vitrées, l'hiver le soir la même salle retouchée en soirée.
`?saison=ete|hiver` et `?moment=jour|soir` forcent l'un ou l'autre pour la présentation.
Ensuite : le chef (polaroïd de Régis Clauss qui se retourne, étiquettes à déplacer), le déjeuner (la carte en cartes qui
défilent, l'assiette qui fume collée à côté), le lieu (cinq cartes qui filent au défilement), l'été le panorama de la
piscine, « Le Restaurant » (la vraie salle le soir qui s'ouvre en plein écran, le titre qui glisse à gauche avec les repères et les services de la semaine, la photo du coin du feu animée d'où partent les braises, puis la réservation ; v7.5.27), « En ce moment »
(vraies affiches de Noël et de la Saint-Sylvestre, soirées à thème), « Offrir & emporter » (incontournables des fêtes,
carte cadeau) et « Venir » (plan des distances). La terrasse du soir est sur la page Réceptions.
Polices (v7.5, référence du client) : Fraunces pour les titres, Manrope pour le texte.
L'intro montre le monogramme de la maison, puis l'écran s'ouvre en cercle.

## Les pages, chacune à son heure

| Page | Adresse | Idée | Modules de la bibliothèque |
|---|---|---|---|
| Accueil | `/` | La journée à l'Hacienda (ci-dessus) | plat-fumant |
| La carte | `/la-carte` | « La carte se met à l'heure » : déjeuner ou dîner selon l'heure réelle à Moineville ; la bascule rallume toute la page ; la carte ouverte : deux doubles pages crème (entrées | plats, à partager | desserts), chaque rubrique avec sa photo en bandeau (numéro, fourchette de prix, nombre de plats), filtres, recherche, étiquettes crème et or (v7.5.22) ; « Les mains du chef » : l'assiette nette dans la pénombre, chaque élément s'allume à son tour | carte-du-restaurant |
| Évènements (onglet, v7.5.9 ; ex « Les fêtes ») | `/les-fetes` | « La saison décide » (choix hiver ou été en petites capitales au-dessus du titre) : l'hiver, l'éphéméride de la Saint-Sylvestre dont les pages des jours passés s'arrachent jusqu'au vrai nombre de jours (v7.5.19) et les vraies affiches de Noël et de la Saint-Sylvestre en ouverture, à prendre en main et à retourner (le menu au dos ; v7.5.15), les prochaines dates en six grands billets avec leur vraie photo, le jour en grand, le prix, « Réserver » et l'agenda (v7.5.19), la carte de Noël qui s'ouvre au défilement, avec sa couverture de velours vert et or et ses plats qui s'écrivent à l'encre dorée (v7.5.19), « Pour Noël, offrez un moment aux Jardins » : la carte cadeau qui sort de son enveloppe rouge (v7.5.19), la Saint-Sylvestre en scène : un palier par temps du dîner, le plat en grand (image générée, v7.5.20) et à côté le verre qui prend la forme et la couleur du vin, la bascule de l'accord et le prix (v7.5.14) ; l'été (`?saison=ete`), la journée d'été | agenda-des-dates, accords-mets-et-vins |
| Réceptions | `/receptions` | L'ouverture fait défiler les occasions (le mot du titre et la photo de l'arche) ; « Ce que l'on fête ici » par paliers au défilement (une occasion par écran, sa photo grandit jusqu'à la moitié de l'écran bord à bord ; v7.5.15) ; « Cinq espaces, un seul domaine » (coin bar, salle de réception, restaurant, terrasse, piscine) : sur ordinateur, la section reste à l'écran et les cartes glissent de droite à gauche en descendant (v7.5.18), sur téléphone elles se font glisser au doigt ; la terrasse qui s'allume au défilement ; « Ils ont dit oui » : neuf vrais mariages en grande mosaïque, la note Google (4,5 sur 5, plus de 1 600 avis), album en grand au clic (v7.5.17) ; la demande en dernier, en trois étapes, son carton d'invitation qui se remplit et ses polaroïds qui suivent les choix ; le pied de page invite à « Demander une réception » ; un seul fond crème du début à la fin (v7.5.17) | — |
| Réserver | `/reserver` | « La lumière du service » : claire pour un déjeuner, de nuit pour un dîner ; la réservation en quatre étapes (jours en cartes de calendrier, assiettes autour de la table, heures sur une frise) et le carton de table qui se remplit, tamponné « Réservé » à la fin (v7.5.31) ; plan de la salle facultatif (parquet de chêne clair ; v7.5.24) ; à la confirmation, la table choisie s'allume sur le plan (bougie, salle qui baisse la lumière ; v7.5.15) | reservation-de-table, plan-de-salle, envol-vers-le-panier |
| Traiteur (onglet, v7.5.9 ; ex « À emporter ») | `/a-emporter` | La ronde des cloches en ouverture (les six plats tournent, celle de devant se soulève ; v7.5.13), puis les incontournables des fêtes du chef en vitrine sous cloches de verre, « Le calendrier du retrait » en calendrier de l'Avent (du 5 au 31 décembre, les portes s'ouvrent en cascade, le jour touché passe dans la commande ; v7.5.15) (huit plats dessinés, leurs prix ; la cloche se soulève, s'ouvre, la vapeur monte), le panier dans un panneau qui s'ouvre à droite à chaque ajout (le plat s'y envole ; quantités, retrait d'une ligne, total), la pastille flottante, le jour de retrait du 5 au 31 décembre selon les horaires d'ouverture, midi ou soir, commande simulée ; une pastille s'envole vers la commande à chaque ajout | — |
| Offrir | `/offrir` | La salle au soleil de midi en ouverture, la carte cadeau en vrai objet, la même vert de nuit et or que partout sur le site (elle s'incline vers la souris, reflet qui suit, se retourne : au dos, la place du mot écrit à la main ; v7.5.15, v7.5.21) ; partir d'une idée (une planche à partager, un dîner pour deux, la Saint-Sylvestre, avec les vrais prix) qui choisit le montant et écrit un mot ; la carte cadeau s'écrit sous vos yeux et reste à l'écran pendant qu'on remplit le formulaire, puis part dans son enveloppe rouge et or ; « Pour la recevoir » en trois étapes (v7.5.21) | carte-cadeau-qui-se-compose |
| Infos pratiques | `/infos-pratiques` | « Venez nous voir à Moineville » en ouverture (la salle aux baies vitrées en arche, statut en direct, appeler ; v7.5.13), la semaine des horaires d'un coup d'œil avec son curseur d'heure, l'accès (les règles de l'été et la vraie photo de la piscine et de la pergola ; v7.5.24), le plan du domaine à toucher (l'entrée, le parking, chaque lieu), une question (la grande table au bord de la piscine, au soleil ; v7.5.24) | formulaire-par-etapes |
| Page fermée | `/404` | « Cette page a fermé à minuit » | — |
| Votre espace (démo) | `/espace` | L'espace restaurateur : connexion fictive, puis Aujourd'hui, Réservations (agenda de la semaine, confirmer, refuser, fermer un service, complet, ajout au téléphone), Événements (modifier, masquer, créer, photothèque), Textes et horaires (annonce, horaires, fermetures, ardoise, textes), Photos (remplacer, cadrer). Les changements restent dans le navigateur et s'affichent sur le site ; une réservation faite sur Réserver arrive dans l'agenda (v7.6.0). Une fois connecté, c'est une application : rubriques en bas sur téléphone, « Annuler » dix secondes après chaque action, enregistrement visible (v7.7.0), barre « Que voulez-vous faire ? » qui comprend « fermer samedi soir » (v7.7.1), rubrique « Demandes » où arrivent les cinq formulaires du site, suivi des réceptions, messages aux clients (v7.7.2), carte modifiable avec « épuisé aujourd'hui » et allergènes, ardoise à la craie (v7.7.3), suggestions à un geste, bilan de la semaine, dictée, installation sur l'écran d'accueil (v7.7.4). Lien discret dans le pied de page. | — |

Transition entre les pages (v7.5) : un papier crème qui monte en cloche depuis le clic, le monogramme en terre cuite, le nom de la page et un filet d'or, puis la cloche se soulève.

## Mettre à jour le contenu

- Textes : `donnees/textes/fr.json`. Carte : `donnees/carte.json`. Ardoise de la semaine (midi et soir) : `donnees/ardoise.json`. Dates des fêtes et soirées : `donnees/agenda.json`. Fêtes : `donnees/fetes.json`, `donnees/accords.json`. Horaires : `donnees/horaires.json`. Salle : `donnees/salle.json`. Réservation : `donnees/reservation.json`. Coordonnées : `donnees/site.json`.
- Images : `plan-images.json` puis le pipeline de la bibliothèque (`node <bibliothèque>/images/produire.mjs plan-images.json`) ; plus de boucle vidéo en v7 : la vapeur du dîner est dessinée en direct sur la vraie photo (module plat-fumant) et l'eau de midi est un effet WebGL ; les boucles de la v6 sont gardées dans `recu/videos-v6/`.
- Puis `node outils/generer.mjs`, les images de partage (`node <bibliothèque>/images/partage.mjs`), et l'audit (`node _audit/audit.mjs`, `--complet` pour la version finale).

## À fournir par l'établissement (à compléter)

- **Horaires d'ouverture** : ceux de la maquette viennent de l'annuaire RankEat (relevés le 1er novembre 2026), à confirmer ; fermetures exceptionnelles et congés ; horaires de la soirée du 31 décembre.
- **Mentions légales** : raison sociale, forme juridique, siège, SIRET, TVA, directeur de la publication ; hébergeur Vercel Inc. (adresse à vérifier sur vercel.com/legal) ; **politique de confidentialité**.
- **Allergènes** de chaque plat (information obligatoire) ; confirmation des plats végétariens (dhal, houmous : d'après leur composition).
- **Capacités** de chaque espace (salle, terrasse et pergola, piscine et jardins) : la v5 écrivait « le repas pour 120 sous la pergola », chiffre absent du site actuel, retiré en v6.
- **Acomptes** des soirées (le site actuel indique encore « x € ») ; **carte cadeau** : paiement et envoi éventuels.
- **Plan réel de la salle** (tables, places) : celui de la maquette est indicatif.
- **Adresse e-mail** de contact ; stationnement ; **dates des pool parties** de l'été 2027.
- **Incohérences du site actuel à trancher** : le logo porte le numéro +33 609 386 764 (le site donne 06 18 21 28 10) ; la carte cadeau indique « 6 rue du Benelux · Chemin Valtier » (le site : 6 Vathier Haye) ; « Saison d'été jusqu'au 30/09/2024 » ; code postal 54000 dans une page.
- **Vidéos en meilleure définition** (facultatif) : Grok a livré les boucles en 672 × 448 px. La flamme (salle et cheminée) et le crépuscule sur la terrasse, trop flous en grand, ne sont pas utilisés (originaux dans `recu/videos/`) ; en 1280 px ou plus, la flamme pourrait animer l'ouverture d'Offrir et la scène « Au coin du feu ».
- **Incontournables des fêtes** (v7.5) : la liste vient de la page « Commandes en ligne » du site actuel. La maquette ne renvoie pas vers l'ancien site : la page « À emporter » (v7.5, reprise de la maquette de référence du client) présente les huit produits avec leurs prix, le panier et le retrait du 5 au 31 décembre (commande simulée). À confirmer : prix, format du foie gras, allergènes, heures de retrait (la maquette suit les horaires d'ouverture : midi le mercredi, jeudi, vendredi et dimanche, soir le vendredi et le samedi), paiement, délai de commande.
- **Capacités des espaces** (v7.5) : reprises de la fiche Bridebook de l'établissement (salle de réception jusqu'à 220 invités, 140 en cocktail ; salle du restaurant 100 assis ; salon 50 ; terrasse de plus de 300 m²) ; coin bar et piscine : sur demande ; stationnement : à confirmer. Plan du domaine schématique, à valider.
- **Note Google** (v7.5) : 4,5 sur 5, 1 652 avis d'après RankEat (fiche du 1er novembre 2026) ; l'accueil affiche « plus de 1 600 avis ».
- **Distance de Nancy** (v7.5) : 60 km à vol d'oiseau, calculée comme les autres (Metz, Thionville, Luxembourg).
- **Textes de la carte à confirmer** : le menu de la Saint-Sylvestre est confirmé par l'affiche du site (v7). Restent à vérifier sur le site actuel ou avec le chef : « Supplément de 10 € par personne… Pour deux : 25 € » (À partager), « Jusqu'à 10 ans : un plat et un dessert » (menu enfant), « Assortiment de charcuteries italiennes ».
- **Ardoise de la semaine** : les huit plats des ardoises du midi et du soir sont des plats de la carte, choisis pour la maquette ; au restaurant de dire ce qu'il veut y écrire chaque semaine (`donnees/ardoise.json`).
- **Dates des soirées** (`donnees/agenda.json`) : relevées sur les affiches du site le 11 novembre 2026 ; heures de début non indiquées sur les affiches.
- **Crédits** : photos du site actuel (dossier `assets/images/vraie/` en grand format, originaux dans `recu/site/`, et les petits formats de la v5) ; illustrations générées par IA (dossier `assets/images/grok/`, boucles `assets/videos/`), toutes marquées « Illustration générée », et une ligne du pied de page l'explique. Les plats de la vitrine du Traiteur sont des images générées par Grok, détourées (`assets/images/grok/traiteur/`, `outils/detourer-plats.py`) et marquées « Illustration générée » ; les deux tatakis restent dessinés en SVG (`source/gabarits/cloches.svg`, cloche de verre reprise de la maquette Lemoy). Toutes sont à remplacer par des photos détourées des vrais produits quand le restaurant les fournira (même outil : fond blanc uni, vue de trois quarts). L'enseigne d'Infos pratiques est la photo du site détourée (ciel retiré) pour laisser voir le ciel calculé.

## Faits retirés ou dits autrement

| Sujet | Dans la maquette |
|---|---|
| Capacité des espaces | aucun chiffre (retiré de la v5) |
| Stationnement, fermetures exceptionnelles | retirés ; sous les horaires : « Horaires relevés le 1er novembre 2026 ; pour une date précise, appelez le restaurant. » |
| Horaires de la soirée du 31 décembre | « Horaires de la soirée donnés à la réservation. » |
| Montant de l'acompte | « le restaurant vous en donne le montant à la réservation » |
| Remise de la carte cadeau | « Pour la recevoir, appelez-nous au 06 18 21 28 10. » |
| Allergènes | « Informations sur les allergènes disponibles sur demande » |
| Dates des pool parties | « Les dates sont annoncées sur Instagram. » |
| Assiettes générées | jamais présentées comme un plat de la carte : les plats gardent leurs noms et leurs prix à côté, l'image porte « Illustration générée » |

## L'espace restaurateur (démonstration, v7.7.4)

- Pour la présentation : ouvrir `/espace`, « Entrer dans mon espace » (identifiant et mot de passe déjà remplis). L'espace devient une application : barre du haut (état de l'enregistrement, « Voir le site », « Plus d'actions »), cinq rubriques à gauche sur ordinateur et en bas de l'écran sur téléphone : Aujourd'hui, Demandes, Réservations, Carte, Site (soirées, annonce et horaires, textes, messages, photos en onglets). Confirmer ou refuser une demande, puis « Annuler » dans le message du bas (dix secondes, ou Ctrl/Cmd + Z). Dans « Carte », toucher « Épuisé aujourd'hui » sur un plat, puis « Voir sur le site » : le plat est barré sur la carte. Ouvrir la barre « Que voulez-vous faire ? » (Cmd ou Ctrl + K, le bouton de la barre du haut, ou le bouton rond rouge sur téléphone) et écrire « fermer samedi soir » ou « ajouter une soirée raclette le 12 » : la proposition dit ce qui va se passer, Entrée le fait. Changer une photo, l'annonce ou l'ardoise, puis « Voir le site » : la pastille « Aperçu de vos modifications » rappelle que ces changements ne se voient que dans ce navigateur. Faire une réservation sur Réserver, puis revenir dans l'espace : elle attend dans « Aujourd'hui », dans « Demandes » et dans l'agenda, « Depuis le site ». Le meilleur moment de la présentation : deux fenêtres côte à côte, l'espace à droite ; à gauche, faire une demande de réception sur la page Réceptions : elle s'affiche à droite dans la seconde (« Nouvelle demande depuis le site »), « Voir » l'ouvre avec ses étapes et le message au client.
- « Tout remettre comme livré » (menu « Plus d'actions », en haut à droite) efface tout ; « Annuler » le rend.
- Fichiers :
  - `source/pages/espace.mjs` : la page, les emplacements de photos et les textes modifiables. Sur le site, `data-edit="clé"` marque un texte modifiable et `data-edit-photo="emplacement"` une photo.
  - `assets/js/espace.js` : les écrans (il dessine et écoute, rien d'autre).
  - `assets/js/espace-donnees.js` : la couche de données. Chaque geste est une action nommée (`MUTATIONS`), le dépôt (`creerDepot`) l'enregistre, prévient les écrans et sait annuler.
  - `assets/js/espace-regles.js` : les règles, en fonctions pures (horaires, ouvertures, réservations de démonstration, événements).
  - `assets/js/espace-demandes.js` : les demandes (réception, traiteur, carte cadeau, question), leurs étapes et les messages aux clients, en fonctions pures ; `assets/js/espace-vue-demandes.js` : la rubrique « Demandes » et l'onglet « Messages ». Les demandes de démonstration sont inventées et marquées « Exemple ».
  - `assets/js/espace-carte.js` : la carte du site telle que l'espace l'a laissée (plats modifiés, ajoutés, retirés, épuisés pour un jour), en fonctions pures ; `assets/js/espace-vue-carte.js` : la rubrique « Carte » (la carte et l'ardoise). `donnees/carte.json` n'est jamais modifié par l'espace.
  - `assets/js/espace-conseils.js` : « L'espace vous propose » (suggestions tirées de l'état réel) et le bilan de la semaine, en fonctions pures ; `assets/js/espace-vue-propose.js` : leurs écrans. `assets/espace-manifest.json` et `assets/images/espace-192.png`, `espace-512.png` : l'installation sur l'écran d'accueil (liés depuis la seule page `/espace`).
  - `assets/js/espace-commandes.js` : les phrases que la barre comprend, en fonctions pures (des règles écrites, pas une IA) ; `assets/js/espace-barre.js` : la fenêtre de la barre. Pour faire comprendre une nouvelle phrase : l'ajouter dans `comprendre()`, avec son test dans `_audit/tests/commandes.test.mjs`.
  - `assets/js/espace-stock.js` : le seul fichier qui touche à la mémoire du navigateur (localStorage, clés `jh-espace:v1`, `jh-espace-resas:v1` et `jh-espace-demandes:v1`, schéma numéroté dans `_schema`). Les cinq formulaires du site y écrivent (`ajouterResaSite`, `ajouterDemandeSite`) ; `ecouter()` prévient l'espace quand une demande arrive d'un autre onglet.
  - `assets/js/espace-apercu.js` : l'aperçu sur chaque page du site, chargé avant tout.
- À essayer sur de vrais appareils (non vérifiable ici) : la dictée de la barre avec un micro, l'installation sur l'écran d'accueil d'un iPhone et d'un téléphone Android, Safari.
- Les réservations de démonstration sont tirées des vrais horaires, avec des noms inventés ; aucune n'est réelle. La jauge compte sur 60 couverts par service : valeur de démonstration, à remplacer par la capacité donnée par le restaurant.
- Vérifier : `node --test _audit/tests/*.test.mjs` (règles, actions, annulation, schéma, phrases de la barre, demandes et messages, carte, suggestions et bilan), puis `node _audit/audit.mjs --complet --pages=/espace`. L'audit général ne voit que l'écran de connexion ; `_audit/parcours-espace.mjs` entre dans l'espace (réserver sur le site puis confirmer, la barre au doigt et au clavier, les cinq formulaires du site et l'arrivée en direct, chaque rubrique et chaque onglet mesurés à cinq tailles, balayage de 320 à 1920 px).
- Pour un vrai outil : mêmes écrans et mêmes actions ; seul `espace-stock.js` se remplace (même contrat : lire, ecrire, vider, resasSite, ecrireResasSite, ajouterResaSite, demandesSite, ecrireDemandesSite, ajouterDemandeSite, ecouter). Les messages aux clients (confirmation, refus…) sont simulés : il faudra un envoi d'e-mails ou de SMS côté serveur. Le contenu part vers GitHub (Vercel republie le site en une à deux minutes) et les réservations vers une base de données, avec une vraie connexion et les e-mails aux clients.

## À retirer à la mise en ligne définitive

- La consigne noindex : balise robots dans `source/gabarits/commun.mjs` et en-tête X-Robots-Tag dans `vercel.json`.
- L'espace restaurateur de démonstration (`/espace`, son lien dans le pied de page, `espace-apercu.js`) s'il n'est pas remplacé par le vrai.
- Les simulations : réservation et complets simulés (`complets_simules` dans `donnees/reservation.json`), tables prises du plan, carte cadeau, demande de réception, message.
- Les mentions « à compléter », « à confirmer », « simulé » et la ligne « Maquette » du pied de page.

## À garder

- La mention « Illustration générée » sur les images et vidéos créées par IA.
- La mention « L'abus d'alcool est dangereux pour la santé, à consommer avec modération. » près des vins.
