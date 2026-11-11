# Les Jardins de l'Hacienda (2) · maquette v7 « De midi à minuit »

Maquette du futur site des Jardins de l'Hacienda, restaurant et lieu de réception à Moineville (54), entre Metz, Thionville et le Luxembourg.
Adresse : https://jardins-hacienda-2-maquette.vercel.app (à mettre dans le module Wix « Intégrer un site »). La maquette n'est pas reliée au site actuel.
La v6 est une refonte complète : nouvelle direction, nouvelle base (socle de la skill v10.9.2), nouvelles images ; la logique des modules de la v5 est gardée.
La v7 garde l'idée et la met au propre : une vraie photo de la maison dans chaque section (366 images récupérées sur le site actuel, une vingtaine retenues), une scène propre à chaque page, et 17 modules restaurant de la bibliothèque placés chacun à son heure (10 de plus qu'en v6).

## L'idée

L'accueil est une journée à l'Hacienda, réglée sur les vraies heures de la maison : 12 h la piscine (l'eau bouge sous le doigt),
12 h 30 le déjeuner (la salle au soleil, la carte de la semaine et ses prix), 14 h 30 l'après-midi d'été (un panorama de la piscine que l'on parcourt,
l'heure avance jusqu'à 19 h et la lumière dore ; piscine, bar, journées festives, pool parties accrochés à leur place), 19 h la terrasse s'allume
(le soleil se couche sur la table de réception, les guirlandes s'allument), 21 h le dîner (la vraie assiette devant la cheminée, sa vapeur qu'on écarte
de la main ; réserver dans la page), 23 h au coin du feu (« Au creux de la cheminée » : la fenêtre de la salle s'ouvre jusqu'au plein écran, les braises
qu'on attise), 23 h 30 Noël, la Saint-Sylvestre et la prochaine soirée à thème, minuit offrir (venir est au pied de page).
La nuit et le matin (avant 11 h), l'intro s'arrête d'abord sur l'heure réelle (« 01:26 · la maison dort ») avant de rouler jusqu'à midi.
La lumière de la page passe du blanc de midi à la braise de minuit ; l'horloge de l'en-tête suit le défilement. Chaque moment dit sa saison réelle
(« Piscine et terrasse de juin à septembre », « Cet hiver »).
La saison décide aussi de l'accueil : d'octobre à avril, l'ouverture de 12 h est la salle aux baies vitrées (un halo de soleil suit la main),
le panorama de la piscine disparaît, le coin du feu ouvre la soirée à 19 h et la terrasse d'été ferme la page en clin d'œil ;
de mai à septembre, la piscine et son eau à toucher, puis la journée dans l'ordre. 12 h 30 : l'assiette qui fume et les petites assiettes à toucher. `?saison=ete` ou
`?saison=hiver` force l'une ou l'autre pour la présentation.

## Les pages, chacune à son heure

| Page | Adresse | Idée | Modules de la bibliothèque |
|---|---|---|---|
| Accueil | `/` | La journée, de 12 h à minuit (ci-dessus) | — (effets propres) |
| La carte | `/la-carte` | « La carte se met à l'heure » : déjeuner ou dîner selon l'heure réelle à Moineville ; la bascule rallume toute la page ; la carte en grand index, filtres, recherche | carte-du-restaurant |
| Les fêtes | `/les-fetes` | « La saison décide » : l'hiver, le décompte géant de la Saint-Sylvestre, le menu en accords mets et vins, Noël plat par plat sous sa cloche, les soirées passées ; l'été (`?saison=ete`), la journée d'été heure par heure | accords-mets-et-vins |
| Réceptions | `/receptions` | Nouvelle page : le mot de l'occasion qui change dans le titre, trois espaces en volets (la salle d'abord l'hiver, la terrasse d'abord l'été), demande en trois étapes et carton d'invitation tamponné | — |
| Réserver | `/reserver` | « La lumière du service » : claire pour un déjeuner, de nuit pour un dîner ; plan de la salle facultatif ; carte de placement sous la cloche | reservation-de-table, plan-de-salle, envol-vers-le-panier |
| Offrir | `/offrir` | « Minuit, au coin du feu » : la carte cadeau s'écrit à la lueur du feu, puis part dans son enveloppe | carte-cadeau-qui-se-compose |
| Infos pratiques | `/infos-pratiques` | « Il est 21 h 04 à Moineville » : l'heure réelle en grand, la photo de ce moment, le statut, le cadran des horaires à faire tourner, l'accès, l'été | horaires-ouvert-maintenant |
| Page fermée | `/404` | « Cette page a fermé à minuit » | — |

Transition entre les pages : la transition en assiette de la v5 (voile « cloche »), plus courte en v7 ; le voile est un ciel, de la couleur de l'heure de départ (en bas) à celle de l'heure d'arrivée (en haut), avec les chiffres de l'heure d'arrivée.

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
- **Textes de la carte à confirmer** : le menu de la Saint-Sylvestre est confirmé par l'affiche du site (v7). Restent à vérifier sur le site actuel ou avec le chef : « Supplément de 10 € par personne… Pour deux : 25 € » (À partager), « Jusqu'à 10 ans : un plat et un dessert » (menu enfant), « Assortiment de charcuteries italiennes ».
- **Ardoise de la semaine** : les huit plats des ardoises du midi et du soir sont des plats de la carte, choisis pour la maquette ; au restaurant de dire ce qu'il veut y écrire chaque semaine (`donnees/ardoise.json`).
- **Dates des soirées** (`donnees/agenda.json`) : relevées sur les affiches du site le 11 novembre 2026 ; heures de début non indiquées sur les affiches.
- **Crédits** : photos du site actuel (dossier `assets/images/vraie/` en grand format, originaux dans `recu/site/`, et les petits formats de la v5) ; illustrations générées par IA (dossier `assets/images/grok/`, boucles `assets/videos/`), toutes marquées « Illustration générée », et une ligne du pied de page l'explique. L'enseigne d'Infos pratiques est la photo du site détourée (ciel retiré) pour laisser voir le ciel calculé.

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

## À retirer à la mise en ligne définitive

- La consigne noindex : balise robots dans `source/gabarits/commun.mjs` et en-tête X-Robots-Tag dans `vercel.json`.
- Les simulations : réservation et complets simulés (`complets_simules` dans `donnees/reservation.json`), tables prises du plan, carte cadeau, demande de réception, message.
- Les mentions « à compléter », « à confirmer », « simulé » et la ligne « Maquette » du pied de page.

## À garder

- La mention « Illustration générée » sur les images et vidéos créées par IA.
- La mention « L'abus d'alcool est dangereux pour la santé, à consommer avec modération. » près des vins.
