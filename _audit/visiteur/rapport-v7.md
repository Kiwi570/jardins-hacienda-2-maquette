# Test « vrai visiteur » v7 : Les Jardins de l'Hacienda (maquette)

Je suis Claire, 38 ans, j'habite Thionville. Je cherche une sortie pour un samedi soir de novembre avec mon compagnon. Une soirée à thème me plairait. Je veux aussi savoir comment venir.

- Outil : `node _audit/visiteur.mjs`, lancé depuis la racine du projet, serveur local.
- Moment simulé : mercredi 11 novembre 2026, vers 16 h 30 (le restaurant est fermé à ce moment-là).
- Formats : téléphone 390x844 (tactile), puis ordinateur 1440x900.
- Barème : la mission 1 se fait sans aucun geste. Les autres se font en 3 gestes au plus et en 30 s au plus. Pour les missions 3 et 7, les champs du formulaire sont comptés à part.
- Les secondes viennent du journal (`journal.json`). Elles comprennent les temps de chargement et les attentes de l'outil.
- Toutes les captures sont dans `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/`.

## Tableau résumé

| Mission | Format | Réussie | Gestes | Secondes | Gêne principale |
|---|---|---|---|---|---|
| 1 arrivée | téléphone | oui | 0 | 6,7 | Le grand « 12:00 » n'a pas de sens alors qu'il est 16 h 26. Thionville et Metz ne sont pas cités. |
| 1 arrivée | ordinateur | oui | 0 | 6,7 | Le grand « 12:00 » intrigue. La photo d'été porte l'étiquette « Illustration générée ». |
| 2 prix | téléphone | oui | 2 | 6,3 | Rien de gênant. Les heures dans le menu (12:30 La carte…) ressemblent à des horaires. |
| 2 prix | ordinateur | oui | 1 | 12,4 | La page est lente à être prête. L'ardoise est encore presque vide. |
| 3 réserver | téléphone | oui, hors barème | 5 + 5 champs | 16,7 | 2 défilements, puis « Vérifier » et « Confirmer ». Le samedi choisi devient gris pâle. |
| 3 réserver | ordinateur | oui, hors barème | 5 + 5 champs | 18,4 | Même chose. « Vérifier » est sous le bas de l'écran. |
| 4 venir | téléphone | oui, hors barème | 5 | 9,9 | La distance arrive au 3e écran de la page Infos pratiques. Elle est à vol d'oiseau, sans temps de trajet. |
| 4 venir | ordinateur | oui, hors barème | 4 | 8,7 | Même chose. Le haut de page montre « Le ciel de Moineville » au lieu de l'accès. |
| 5 distinction | téléphone | oui | 3 | 15,8 | Tout ce qui distingue le lieu est estival (piscine, paillotes). Rien sur un soir d'hiver. |
| 5 distinction | ordinateur | oui | 3 | 14,7 | Même chose. Le texte sur la photo de piscine se lit mal. |
| 6 soirée | téléphone | oui, hors barème | 5 | 11,0 | La date et le prix arrivent au 4e geste. « Réserver » ouvre le formulaire de table ordinaire, sans rappel de la soirée. |
| 6 soirée | ordinateur | **non** | 3 (4 pour le clic) | 12,7 (15,0) | **Les soirées de novembre sont cachées derrière une photo.** La première soirée lisible est celle du 19 décembre. |
| 7 question | téléphone | oui, hors barème | 14 + 6 champs | 28,8 | Le formulaire est tout en bas de la page Infos pratiques. Après « Envoyer », le message de fin est hors de l'écran. |
| 7 question | ordinateur | oui, hors barème | 11 + 6 champs | 25,2 | Le formulaire est tout en bas de la page Infos pratiques. Il faut 4 étapes et défiler pour trouver « Continuer » et « Envoyer ». |

Bilan : 13 missions sur 14 aboutissent. 7 restent dans le barème. La seule mission ratée est la soirée à thème sur ordinateur, à cause d'un défaut de mise en page.

---

## Mission 1 : arrivée (premier écran seul, attente de 3,5 s)

### Téléphone : réussie (0 geste, 6,7 s)
- Ce que je comprends : « Les Jardins de l'Hacienda · restaurant et réceptions à Moineville ». La phrase dit « Midi au bord de l'eau, minuit au coin du feu. » Un point rouge indique « Il est 16 h 26 : fermé · ouvre demain à 12 h ». Deux boutons : « Réserver une table » et « Demander une réception ». En bas, une barre fixe propose « Appeler » et « Réserver ».
- Quoi et où : oui (un restaurant, à Moineville). Pour qui : ce n'est pas dit clairement. Je devine les repas et les fêtes de famille, à cause des réceptions.
- Ce qui m'a gênée :
  - Un énorme « 12:00 » est écrit sous la photo, et une pastille « 12:00 » est dans l'en-tête. Il est pourtant 16 h 26. Je ne sais pas ce que c'est : une horloge arrêtée ? un horaire ?
  - Sur téléphone, rien ne situe Moineville. Sur ordinateur, on lit « entre Metz, Thionville et le Luxembourg ».
  - La photo montre une piscine et des palmiers en plein soleil, alors qu'on est en novembre. L'étiquette « Illustration générée » me fait douter que ce soit le vrai lieu.
  - Le bouton « Touchez l'eau » n'est pas clair.
- Capture : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-arrivee-390x844/etape-2.jpg`

### Ordinateur : réussie (0 geste, 6,7 s)
- Ce que je comprends : « Restaurant et réceptions à Moineville, entre Metz, Thionville et le Luxembourg ». La cuisine de saison est celle du chef Régis Clauss, la carte change chaque semaine, il y a une piscine l'été et une cheminée l'hiver. Le menu du haut est clair (La carte, Réceptions, Les fêtes, Offrir, Infos pratiques, Réserver).
- Ce qui m'a gênée : le même grand « 12:00 » sans explication. La photo d'été porte aussi l'étiquette « Illustration générée ».
- Capture : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-arrivee-1440x900/etape-2.jpg`

## Mission 2 : trouver un prix

### Téléphone : réussie (2 gestes, 6,3 s)
- Chemin : Menu, puis La carte. En haut de la page : « Entrées de 9 à 21 € · plats de 21 à 26 € · menu enfant 16 € ».
- Ce qui m'a gênée : dans le menu, chaque lien a une heure devant lui (12:00 Accueil, 12:30 La carte, 19:00 Réceptions, 23:30 Les fêtes, 00:00 Offrir). On dirait des horaires d'ouverture. La page s'ouvre sur le déjeuner. Un geste de plus (« Passer au dîner ») confirme les mêmes prix le soir, le vendredi et le samedi.
- Captures : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-prix-390x844/etape-2.jpg`. Le dîner (3e geste, en plus) : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-prix-diner-390x844/etape-3.jpg`

### Ordinateur : réussie (1 geste, 12,4 s)
- Chemin : clic sur « La carte » dans l'en-tête. La ligne des prix est visible tout de suite.
- Ce qui m'a gênée : le journal compte 9 s pour ce seul clic (contre environ 2 s sur téléphone). La page met du temps à être prête. La grande ardoise est encore presque vide (« Œuf cocotte à l… ») : c'est une grande zone noire sans contenu.
- Capture : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-prix-1440x900/etape-1.jpg`

## Mission 3 : réserver une table pour 2, samedi soir, jusqu'à la confirmation

### Téléphone : réussie mais hors barème (5 gestes et 5 champs, 16,7 s)
- Chemin : 1. « Réserver une table » (premier écran) ; champ : samedi 14 nov. ; 2. défiler ; champ : 20 h (le service « Soir » et 2 personnes sont déjà choisis) ; 3. défiler ; champs : prénom, nom, téléphone ; 4. « Vérifier ma réservation » ; 5. « Confirmer la réservation ». Le message final dit : « Votre table est réservée — À samedi 14 novembre, 20 h, 2 couverts, en salle, référence R-1114-… ».
- Ce qui m'a gênée :
  - Il faut 2 défilements et 2 boutons de validation à la suite (Vérifier puis Confirmer).
  - Quand je touche « Sam 14 nov. », la pastille devient gris pâle avec un texte presque invisible. On croirait un jour désactivé. Avant, « Demain » était un disque noir bien net.
  - La page passe d'un coup en thème sombre quand le soir est choisi. Le créneau 20 h choisi se distingue à peine des autres.
  - « Aujourd'hui 11 nov. » est marqué « complet », alors que le restaurant est simplement fermé ce soir.
  - Le bouton « Faire une autre réservation » est très pâle sur le message final.
- Captures : choix du samedi `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-reserver-390x844/etape-3.jpg` ; créneau 20 h `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-reserver-390x844/etape-6.jpg` ; récapitulatif `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-reserver-390x844/etape-12.jpg` ; confirmation `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-reserver-390x844/etape-13.jpg`

### Ordinateur : réussie mais hors barème (5 gestes et 5 champs, 18,4 s)
- Chemin : « Réserver une table » ; samedi ; défiler ; 20 h ; prénom, nom, téléphone ; défiler ; « Vérifier » ; « Confirmer ». Le récapitulatif à droite suit bien mes choix.
- Ce qui m'a gênée : « Vérifier ma réservation » est sous le bas de l'écran (un défilement de plus). La double validation est la même que sur téléphone. Après la confirmation, la page remonte un peu toute seule. Le bouton « Faire une autre réservation » est presque invisible.
- Capture : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-reserver-1440x900/etape-10.jpg`

## Mission 4 : venir depuis Thionville, et savoir si c'est ouvert maintenant

### Téléphone : réussie mais hors barème (5 gestes, 9,9 s)
- « Ouvert maintenant ? » : je l'ai sans geste, dès l'accueil (« fermé · ouvre demain à 12 h »). C'est très bien.
- Adresse : au 2e geste (Menu, puis Infos pratiques) : « 6 Vathier Haye, 54580 Moineville ».
- Distance : au 5e geste seulement (3 défilements). La carte « Venir à Moineville » indique 24 km de Thionville, 19 km de Metz et 47 km de Luxembourg, par l'A31.
- Ce qui m'a gênée :
  - Entre l'adresse et la carte, il y a d'abord une grande heure (« Il est 16:33 à Moineville »), puis le bloc des horaires avec un curseur, puis une grande horloge de 24 h. L'accès arrive seulement au 3e écran.
  - La distance est « à vol d'oiseau ». Il n'y a pas de temps de trajet en voiture (« 25 min de Thionville »), et c'est ce que je cherche.
  - Sous la carte, on parle de piscine et de journées festives d'été. Ça ne m'aide pas en novembre.
  - Le pied de page (vu sur Infos pratiques) dit aussi « 24 km de Thionville », mais tout en bas.
- Captures : haut de la page Infos `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-venir-390x844/etape-3.jpg` ; carte `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-venir-390x844/etape-6.jpg`

### Ordinateur : réussie mais hors barème (4 gestes, 8,7 s)
- Chemin : Infos pratiques (adresse et « Fermé · ouvre demain à 12 h » dès le premier écran), puis 3 défilements jusqu'à la carte.
- Ce qui m'a gênée : la boîte « Le ciel de Moineville » (lever et coucher du soleil, curseur Midi / Crépuscule / Nuit) prend la place où j'attendais l'accès. Comme sur téléphone, l'horloge et les horaires passent avant. Sur la carte, l'étiquette « 24 km » est coincée entre deux lignes, et on ne sait pas tout de suite si c'est Thionville ou Luxembourg. La colonne de droite parle de piscine et du bar d'été.
- Captures : horaires `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-venir-1440x900/etape-3.jpg` ; carte `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-venir-1440x900/etape-6.jpg`

## Mission 5 : après 30 secondes, ce qui distingue ce restaurant

### Téléphone : réussie (3 gestes, 15,8 s)
- Ce que je retiens : c'est un coin du Sud en Lorraine. Il y a une piscine, des palmiers et des paillotes l'été. Le chef Régis Clauss change la carte chaque semaine selon le marché, et les plats coûtent de 21 à 26 €. L'hiver, on mange près des baies vitrées ou de la cheminée. Il y a aussi des journées festives.
- Ce qui m'a gênée : les trois premiers écrans parlent surtout de l'été (piscine, « L'été, la maison vit dehors », journées festives de juin à septembre). Pour un samedi soir de novembre, rien ne me donne envie avant la page Les fêtes. Le texte posé sur la photo de piscine se lit moyennement.
- Captures : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-distinction-390x844/etape-4.jpg`, `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-distinction-390x844/etape-7.jpg`, `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-distinction-390x844/etape-9.jpg`

### Ordinateur : réussie (3 gestes, 14,7 s)
- Même impression : piscine sous les palmiers, paillotes, carte du marché qui change chaque semaine, cheminée l'hiver.
- Ce qui m'a gênée : le grand « 15:00 » chevauche la photo. Le texte « De juin à septembre : la piscine… » est posé sur une photo chargée et se lit mal. Il n'y a rien sur les soirées d'hiver dans ces trois écrans.
- Captures : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-distinction-1440x900/etape-4.jpg`, `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-distinction-1440x900/etape-7.jpg`, `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-distinction-1440x900/etape-9.jpg`

## Mission 6 : la prochaine soirée à thème (date et prix), puis la réserver ou l'ajouter à l'agenda

### Téléphone : réussie mais hors barème (5 gestes, 11,0 s)
- Chemin : Menu, puis Les fêtes. Le haut de page dit « J-50 · Les fêtes au coin du feu · Réserver la Saint-Sylvestre · Saint-Sylvestre 120 €, Noël 79 € ». Au 3e geste, je lis « Prochaine date : Soirée côte de bœuf, dans 9 jours », mais sans date ni prix. Au 4e geste, je lis « Samedi 21 novembre 2026 · 50 € hors boissons ». Au 5e geste, « Réserver » ouvre le formulaire avec le 21 novembre et le soir. Autre essai : « Ajouter à mon agenda » affiche un tampon « Ajouté » (5 gestes, 10,7 s).
- Ce qui m'a gênée :
  - Le haut de la page pousse la Saint-Sylvestre (« J-50 »). On croit d'abord que c'est la prochaine fête, alors que la soirée côte de bœuf a lieu dans 10 jours.
  - « Dans 9 jours » est faux : du 11 au 21 novembre, il y a 10 jours.
  - La carte de la soirée ne donne pas d'heure de début (le menu de Noël en a une).
  - Après « Réserver », le formulaire est celui d'une table ordinaire. Il ne rappelle pas la soirée côte de bœuf ni son prix de 50 €, et propose des créneaux de 19 h à 21 h 30 comme un soir normal. Je ne suis pas sûre de réserver la soirée.
  - La photo au-dessus des dates (un couple de mariés) ne parle pas d'une soirée côte de bœuf.
- Captures : haut de page `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-soiree-390x844/etape-3.jpg` ; « Prochaine date » `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-soiree-390x844/etape-5.jpg` ; date et prix `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-soiree-390x844/etape-7.jpg` ; formulaire `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-soiree-390x844/etape-8.jpg` ; agenda `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-soiree-agenda-390x844/etape-5.jpg` ; formulaire sans rappel de la soirée `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-soiree-suite-390x844/etape-9.jpg`

### Ordinateur : ratée (3 gestes, 12,7 s ; 4 gestes, 15,0 s avec le clic)
- Chemin : Les fêtes, puis 2 défilements.
- Ce qui se passe : sous « NOVEMBRE 2026 », la colonne de droite reste vide. Les soirées de novembre (côte de bœuf le 21, raclette le 28, brunch le 29) sont tassées dans une colonne étroite à gauche, derrière la photo des mariés. On voit seulement des morceaux : « l'Hacienda, Moineville », « 50 € hors boissons », un bord rouge de bouton sous la photo. La première soirée lisible est la « Soirée libanaise, samedi 19 décembre 2026, 49 € ». Comme visiteuse, j'aurais répondu que la prochaine soirée est le 19 décembre, ce qui est faux. Le défaut est le même après une attente de 3 s et avec le filtre « Soirée ».
- L'outil a bien atteint le formulaire du 21 novembre au 4e geste. Mais il a cliqué sur le bouton à moitié caché sous la photo, et un vrai visiteur n'aurait pas visé ce bouton.
- Captures : liste cassée `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-soiree-1440x900/etape-5.jpg` ; formulaire `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-soiree-1440x900/etape-6.jpg` ; colonne vide `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-soiree-attente-1440x900/etape-8.jpg` ; avec le filtre Soirée `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-soiree-filtre-1440x900/etape-7.jpg`

## Mission 7 : question sur une allergie aux fruits à coque, jusqu'au message de fin

### Téléphone : réussie mais hors barème (14 gestes et 6 champs, 28,8 s)
- Chemin : Menu, puis Infos pratiques. Le formulaire « Nous écrire · Une question » n'est qu'au 6e défilement, tout en bas de la page. Ensuite : sujet « Une table (une date, un groupe, une allergie) » ; Continuer ; message ; Continuer ; prénom, nom, e-mail, case à cocher ; Continuer ; défiler ; Envoyer ; remonter. Le message de fin dit : « Merci, c'est noté ».
- Ce qui m'a gênée :
  - Aucun lien « Nous écrire » ou « Contact » dans le menu. J'ai trouvé le formulaire en fouillant la page Infos pratiques.
  - Il y a 4 étapes avec 3 « Continuer », puis il faut défiler pour trouver « Envoyer ».
  - Après « Envoyer », l'écran reste sur le pied de page. Le message de fin est au-dessus, hors de l'écran, et je ne sais pas si c'est parti avant de remonter.
  - Rien n'indique quand le restaurant répondra. Pour une allergie, rien ne m'invite à appeler.
  - Le rappel final affiche « Merci, Claire · Claire » (seulement le prénom).
- Captures : après « Envoyer » (message invisible) `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-question-390x844/etape-15.jpg` ; message de fin `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-question-390x844/etape-16.jpg`

### Ordinateur : réussie mais hors barème (11 gestes et 6 champs, 25,2 s)
- Chemin : Infos pratiques, 4 défilements jusqu'au formulaire. Sujet « Une table », défiler pour trouver « Continuer », message, Continuer, coordonnées et case, Continuer, défiler, Envoyer. Le message « Merci, c'est noté » s'affiche bien dans l'écran.
- Ce qui m'a gênée : le formulaire est enfoui tout en bas. À l'étape 1, « Continuer » est sous le bas de l'écran, et à l'étape 4 « Envoyer » aussi. Le titre « Merci, c'est noté » arrive collé sous l'en-tête.
- Captures : vérification `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-question-1440x900/etape-13.jpg` ; message de fin `/home/claude/v7/jardins-hacienda-2-maquette/_audit/visiteur/v7-question-1440x900/etape-15.jpg`

---

## Liste des gênes, de la plus grave à la plus légère

1. **Ordinateur, page Les fêtes : les soirées de novembre sont cachées derrière la photo.** La colonne « NOVEMBRE 2026 » reste vide. La côte de bœuf (21 nov., 50 €), la raclette et le brunch sont tassés dans une colonne étroite sous et derrière la photo des mariés. Le visiteur prend la soirée libanaise du 19 décembre pour la prochaine. Le bouton « Réserver » de la côte de bœuf est presque caché. (`v7-soiree-1440x900/etape-5.jpg`, `v7-soiree-filtre-1440x900/etape-7.jpg`)
2. **Le formulaire de question est enfoui.** Il est seulement en bas de Infos pratiques (6 écrans sur téléphone, 4 sur ordinateur), et le menu n'a aucun lien « Nous écrire ». Il faut ensuite 4 étapes, avec des boutons sous le bas de l'écran. Cela fait 14 gestes hors champs sur téléphone.
3. **Téléphone : après « Envoyer », le message de fin est hors de l'écran.** On reste sur le pied de page sans savoir si la question est partie. (`v7-question-390x844/etape-15.jpg`)
4. **Réserver une soirée à thème mène au formulaire de table ordinaire.** Il n'y a ni nom de la soirée, ni prix, ni menu imposé, ni heure de début. Les cartes des soirées n'ont pas d'heure non plus. Je ne sais pas si j'ai réservé la soirée ou une simple table.
5. **La distance depuis Thionville arrive trop tard et n'est pas utile.** Sur Infos pratiques, il faut 3 écrans (grande heure, horaires, horloge 24 h, « Le ciel de Moineville » sur ordinateur) avant la carte. La distance est seulement à vol d'oiseau, sans temps de trajet en voiture. Sur le premier écran du téléphone, aucune ville voisine n'est citée.
6. **La réservation demande trop de gestes.** Il faut 2 défilements, puis « Vérifier » et « Confirmer » (5 gestes hors champs). Sur ordinateur, « Vérifier » est sous le bas de l'écran.
7. **La page Les fêtes met en avant la Saint-Sylvestre (J-50) plutôt que la prochaine soirée**, qui a lieu dans 10 jours. La date et le prix de cette prochaine soirée n'arrivent qu'au 4e geste sur téléphone.
8. **L'état choisi est peu visible dans le formulaire de réservation.** Le samedi choisi devient gris pâle et ressemble à un jour désactivé. Le créneau 20 h choisi se distingue à peine sur le fond sombre.
9. **Toute la promesse visible est estivale.** Photo de piscine en plein soleil (marquée « Illustration générée »), « L'été, la maison vit dehors », journées festives de juin à septembre. En novembre, rien sur les soirées d'hiver dans les trois premiers écrans. L'étiquette « Illustration générée » fait douter que le lieu soit réel.
10. **Les grandes heures déroutent.** « 12:00 » en grand sur l'accueil alors qu'il est 16 h 26. Les heures devant chaque lien du menu (12:30 La carte, 23:30 Les fêtes, 00:00 Offrir) ressemblent à des horaires d'ouverture.
11. **Ordinateur, La carte : la page est lente à être prête.** 9 s dans le journal pour un clic. L'ardoise reste presque vide pendant ce temps.
12. **« Prochaine date : … dans 9 jours » est faux.** Il y a 10 jours du 11 au 21 novembre.
13. **« Aujourd'hui 11 nov. complet » dans le choix du jour**, alors que le restaurant est simplement fermé ce soir-là.
14. **Petits détails du message de fin et de la confirmation.** Aucun délai de réponse n'est donné. Le rappel affiche « Merci, Claire · Claire ». Le bouton « Faire une autre réservation » est presque invisible. Sur ordinateur, le titre « Merci, c'est noté » arrive collé sous l'en-tête.

### Remarques sur l'outil (pas des gênes du site)
- Les champs de date s'affichent au format américain (« 11/14/2026 », « mm/dd/yyyy »). Cela vient de la langue du navigateur sans fenêtre de l'outil. Un navigateur réglé en français affiche jj/mm/aaaa, donc ce point n'est pas compté comme une gêne.
- « cliquer Sam 14 » échoue parce que le texte du bouton est coupé par un retour à la ligne. « cliquer 14 nov » fonctionne.
- Dans les missions 3 et 7, je compte comme « champs » le choix du jour, de l'heure et du sujet, ainsi que la case à cocher.

---

## Suite donnée (v7)

- Soirée sur ordinateur (mission ratée) : l'agenda est réparé (chaque date dans la colonne de droite, la prochaine en premier) ; « Réserver » d'une date ouvre le formulaire au bon jour et rappelle la soirée au-dessus (« Pour : Soirée côte de bœuf, samedi 21 novembre · 50 € hors boissons »).
- « Dans 9 jours » : l'agenda compte en jours de calendrier.
- Une question : bouton « Une question ? » dès l'ouverture d'Infos pratiques ; après l'envoi, le message de fin revient à l'écran.
- Venir : l'adresse et les distances (Thionville, Metz, Luxembourg) sont dans le premier écran d'Infos pratiques, avec un lien « Venir » vers la carte d'accès.
- Réserver : double validation et « Vérifier » sous l'écran, gardés (logique de réservation de la v5).
