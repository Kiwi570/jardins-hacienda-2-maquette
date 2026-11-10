# Test « vrai visiteur » : Les Jardins de l'Hacienda

Date du test : mardi 10 novembre 2026, vers 17 h (le restaurant est fermé ce soir-là).
Personas : (a) un couple de Thionville qui veut dîner samedi soir ; (b) une mère qui prépare un baptême, 40 invités ; (c) quelqu'un qui cherche un cadeau.
J'ai jugé seulement sur les captures. Les secondes viennent du script, telles quelles. Un autre audit tournait en même temps, donc elles peuvent être gonflées.
Captures : `_audit/visiteur/<mission>-<taille>/etape-<k>.png`.

## Téléphone (390 × 844)

| Mission | Réussie | Gestes | Secondes | Capture de référence |
|---|---|---|---|---|
| 1. avoir-faim | **non** (partielle : donne faim, mais ne dit pas où) | 0 | 3,3 | avoir-faim-390x844/etape-0.png |
| 2. ouvert | oui | 0 (statut visible dès l'arrivée) ; 2 pour voir le tableau des horaires | 3,3 (8,1 pour le tableau) | avoir-faim-390x844/etape-0.png ; ouvert-suite-390x844/etape-2.png |
| 3. reserver | oui | jour visible en 2, choisi au 3e ; confirmation en 14 | 10,0 pour le jour ; 25,7 pour la confirmation | reserver-jour-390x844/etape-3.png ; reserver-390x844/etape-15.png |
| 4. vegetarien | oui | 1 (accueil, un défilement) ; 4 en passant par « Voir la carte » | 4,6 | vegetarien-390x844/etape-1.png ; vegetarien-humain-390x844/etape-4.png |
| 5. cadeau | **non (hors barème)** : montant au 4e geste ; confirmation obtenue | 4 jusqu'au montant ; 9 jusqu'à la confirmation | 11,1 jusqu'au montant ; 18,8 au clic, 21,8 avec le message | cadeau-montant-390x844/etape-4.png ; cadeau-390x844/etape-11.png |
| 6. bapteme | **non (hors barème)** : formulaire au 7e geste ; prérempli en partie | 7 jusqu'au formulaire ; 14 jusqu'à l'envoi | 12,9 ; 16,7 | bapteme-formulaire-390x844/etape-3.png ; bapteme-390x844/etape-10.png |
| 7. ete | oui (mais la page se décale) | 1 | 5,9 | ete-390x844/etape-1.png |

## Ordinateur (1440 × 900)

| Mission | Réussie | Gestes | Secondes | Capture de référence |
|---|---|---|---|---|
| 1. avoir-faim | oui | 0 | 3,4 | avoir-faim-1440x900/etape-0.png |
| 2. ouvert | oui | 0 (statut visible dès l'arrivée) | 3,4 (8,7 après un clic sur le statut) | avoir-faim-1440x900/etape-0.png ; ouvert-1440x900/etape-1.png |
| 3. reserver | oui | jour visible en 2, choisi au 3e ; confirmation en 13 | 10,2 pour le jour ; 23,1 pour la confirmation | reserver-jour-1440x900/etape-3.png ; reserver-1440x900/etape-13.png |
| 4. vegetarien | oui | 1 (accueil, un défilement) ; 3 par la carte | 4,1 (9,9 par la carte) | vegetarien-1440x900/etape-1.png ; vegetarien-carte-1440x900/etape-3.png |
| 5. cadeau | oui | 2 jusqu'au montant ; 7 jusqu'à la confirmation | 8,3 ; 19,6 avec 3 s d'attente du message | cadeau-montant-1440x900/etape-2.png ; cadeau-1440x900/etape-10.png |
| 6. bapteme | **non (hors barème)** : formulaire au 8e geste ; prérempli en partie | 8 jusqu'au formulaire ; 14 jusqu'à l'envoi | 12,4 ; 15,0 | bapteme-formulaire-1440x900/etape-3.png ; bapteme-1440x900/etape-9.png |
| 7. ete | oui | 1 | 5,9 | ete-1440x900/etape-1.png |

Aucune mission ne dépasse 30 s. La réservation sur téléphone (25,7 s) est la plus proche de la limite.
Aucune erreur JavaScript n'a été relevée pendant les parcours.

## Ce qui a gêné, mission par mission

### 1. avoir-faim (0 geste)
Téléphone :
- La photo de l'assiette donne faim (légumes colorés, viande, bougie).
- L'en-tête est coupé à droite. Le bouton Menu est hors de l'écran. Le geste « menu » échoue sur l'accueil, même après un défilement : la page glisse de côté (menu-test-390x844, menu-test2-390x844).
- L'écran ne dit pas où on est. Il n'y a ni « restaurant », ni Moineville, ni Metz. La petite ligne et la phrase d'accroche qu'on voit sur ordinateur n'apparaissent pas. Le couple de Thionville ne sait pas si c'est près de chez lui.
- La 2e ligne du titre, « au bord de la piscine l'été », est en gris sur la photo. Elle est peu lisible.
- Le bas de l'écran est noir et vide, sur environ 80 px. La barre Appeler / Réserver n'apparaît pas sur l'accueil, au départ.

Ordinateur :
- Le message est clair : « Restaurant et réceptions · Moineville », le chef, « entre Metz, Thionville et le Luxembourg ».
- La photo fait l'effet d'une double exposition : un verre fantôme passe par-dessus l'assiette. L'ensemble est un peu trouble.
- « au bord de la piscine l'été » est gris sur le verre. C'est peu lisible.
- La phrase d'accroche passe sur l'assiette colorée. Ça se lit, mais c'est chargé.
- « Faites glisser : braise ou soleil » est minuscule, en italique et peu contrasté.

### 2. ouvert (0 geste)
- C'est bien : « Fermé · ouvre demain à 12 h » se voit dès l'arrivée, sur les deux formats.
- Le lien du statut ouvre une grande horloge, mais pas la réponse. Le tableau des horaires est un écran plus bas : il faut un 2e geste sur téléphone. Sur ordinateur, le titre « Ouvert maintenant ? » est coupé en bas de l'écran.
- L'aiguille ne montre pas l'heure affichée. Il est 17 h 07, mais l'aiguille pointe vers 15 h sur téléphone et vers 13 h sur ordinateur. C'est peut-être une animation trop lente.
- Le cadran est un anneau gris uniforme. Les heures d'ouverture n'y figurent pas.

### 3. reserver (jour au 2e geste ; 13 à 14 gestes au total)
- Le bouton « Réserver au coin du feu » est bien visible. Le bouton « Choisir le jour » mène droit aux jours.
- Le lien tombe un peu trop haut : la photo décorative et le titre occupent l'écran. Sur ordinateur, les jours sont collés au bas de l'écran.
- « Demain » est présélectionné. Le récapitulatif affiche « Midi » avant tout choix. On peut se tromper de jour.
- Le champ « Ou une autre date » affiche 11/14/2026, au format américain. C'est peut-être dû au navigateur de test : à vérifier sur un vrai téléphone.
- Sur téléphone, après les coordonnées, le bouton « Vérifier ma réservation » est sous le pli. Il faut encore défiler. Le récapitulatif est placé sous ce bouton.
- Il faut deux clics, « Vérifier » puis « Confirmer » : cela ajoute un geste.
- Après confirmation sur ordinateur, les choix du formulaire apparaissent barrés (« En salle » est barré). On peut croire que la réservation est annulée.
- Sur téléphone, la référence est coupée sur deux lignes (« R- / 1114-3035 »).
- Le bouton « Vérifier » reste affiché, pâle, au-dessus de la confirmation. C'est un peu confus.

### 4. vegetarien (1 geste)
- C'est bien : dès le 1er défilement de l'accueil, on voit « Dhal aux trois lentilles · végétarien · 21 € » et « Houmous · végétarien ».
- La pastille « végétarien » est petite, en vert sur beige. Sur ordinateur, celle du Dhal est déformée : un ovale haut chevauche le mot « lentilles ».
- Par « Voir la carte » sur téléphone : après un défilement, le bouton « Un plat végétarien ? » est caché sous la barre Appeler / Réserver. Il faut un geste de plus (4 au lieu de 3).
- L'ardoise « De saison à la carte » s'écrit à la craie, lentement. Sur ordinateur, elle est vide au premier passage. Sur téléphone, la craie est petite et peu lisible.
- Après le filtre, sur ordinateur, le titre « Nos plats » est collé sous la barre de filtres.
- « Houmous 12 € » est rangé sous « À partager : planches pour 4 personnes… Pour deux : 25 € ». Le prix réel est flou.
- Sur ordinateur, sur le plateau tournant, l'étiquette « À partager » est rognée à gauche.

### 5. cadeau (montant au 4e geste sur téléphone, au 2e sur ordinateur)
- Sur téléphone, le menu est inatteignable depuis l'accueil. Il faut faire un détour : « Voir la carte », puis Menu, puis « Offrir », puis « Composer la carte ». Sur l'accueil, la carte cadeau n'arrive qu'au 6e défilement.
- Le libellé « Offrir » du menu est vague. « Carte cadeau » serait plus direct.
- Après « Offrir cette carte », la page remonte seule vers l'enveloppe, puis redescend environ 3 s plus tard vers le message. Sans attendre, on ne voit aucune confirmation. Ce va-et-vient désoriente.
- Le message dit « Pour la recevoir, appelez-nous ». On ne sait pas si la carte est achetée ou seulement réservée.
- Sur ordinateur, le haut de la page est très sombre : la photo de fond est presque invisible. L'aperçu de la carte, à gauche, ne suit pas le défilement : la moitié gauche reste vide à côté du bouton « Offrir cette carte ». Ce bouton est sous le pli.
- Sur téléphone, le numéro est coupé en fin de ligne (« 06 18 / 21 28 10 »).

### 6. bapteme (formulaire au 7e geste sur téléphone, au 8e sur ordinateur)
- Le menu n'a pas de lien « Réceptions », alors que l'accroche dit « Restaurant et réceptions ». « Les fêtes » ne parle que de Noël et de la Saint-Sylvestre : la mère qui prépare un baptême s'y trompe (fetes-scan-390x844).
- Le bloc « Combien serez-vous ? » n'arrive qu'au 5e écran de l'accueil sur téléphone, au 6e sur ordinateur. Le curseur et les boutons 2 / 12 / 40 / 120 sont agréables.
- Le bouton « Demander pour une réception » tombe un écran trop haut, sur les blocs « Piscine » et « Accès bar ». Il faut encore défiler pour voir le formulaire.
- Le formulaire arrive prérempli en partie : sujet « Réception privée », message « Réception pour 40 personnes. ». C'est bien. Mais rien ne dit « baptême », et il n'y a ni champ date ni champ type d'événement.
- Pour 40 invités, on propose « La terrasse et les jardins », en novembre.
- Sur ordinateur, le dessin « 40 couverts » montre 24 ronds.
- Le message final dit « elle partira vers le client ». Or le visiteur est le client : il faudrait dire « vers le restaurant ». Aucun délai de réponse n'est annoncé.

### 7. ete (1 geste)
- La bascule « Été » est immédiate. La photo montre la piscine, les palmiers et les paillotes. C'est réussi.
- Sur téléphone, après la bascule, toute la page se décale d'environ 20 px. Le texte est rogné à gauche (« Hiver », le titre, les paragraphes) et une bande noire apparaît à droite. Le décalage reste en défilant (ete-defiler-390x844/etape-2.png).
- En novembre, on propose « Réserver en terrasse », alors que la terrasse est barrée dans le formulaire (ouverte de juin à septembre).
- Sur ordinateur, la ligne « Restaurant et réceptions · Moineville » est peu lisible sur le ciel. Un poteau et des fils électriques gâchent un peu la photo.

## Les 3 gênes à corriger en premier

1. **Téléphone : l'accueil déborde en largeur.** Le bouton Menu est hors de l'écran et inatteignable. L'en-tête est coupé. En mode été, tout est décalé et rogné. Cela coûte la mission cadeau (4 gestes au lieu de 3) et bloque toute navigation depuis l'accueil.
2. **Les réceptions sont introuvables.** Le menu n'a pas d'entrée « Réceptions », et « Les fêtes » est ambigu. Le formulaire est à 7 ou 8 gestes. Le lien tombe un écran trop haut. Il manque les champs date et type d'événement. Le message final parle de « client ».
3. **Téléphone : le premier écran ne dit ni quoi ni où.** On ne voit ni « restaurant » ni « Moineville / près de Metz ». La 2e ligne du titre est grise et peu lisible. Sur l'accueil, le bas de l'écran est vide, sans la barre Appeler / Réserver.

## Seconde passe (après corrections)

Mêmes outil et règles, sans lire le code. Missions suffixées « -v2 ».

| Mission | Format | Réussie | Gestes | Secondes | Capture de référence |
|---|---|---|---|---|---|
| 1. avoir-faim | 390x844 | oui | 0 | 3,4 | avoir-faim-v2-390x844/etape-0.png |
| (contrôle Menu sur l'accueil) | 390x844 | oui, le menu s'ouvre | 1 | — | menu-v2-390x844/etape-1.png |
| 5. cadeau | 390x844 | oui | montant au 3e ; confirmation en 8 | 9,5 jusqu'au montant ; 15,3 au clic, 18,4 avec le message | cadeau-montant-v2-390x844/etape-3.png ; cadeau-v2-390x844/etape-11.png |
| 6. bapteme | 390x844 | oui | formulaire au 3e ; envoi en 12 | 9,5 ; 13,0 | bapteme-formulaire-v2-390x844/etape-3.png ; bapteme-v2-390x844/etape-12.png |
| 6. bapteme | 1440x900 | oui | formulaire au 2e ; envoi en 11 | 9,2 ; 14,3 | bapteme-formulaire-v2-1440x900/etape-2.png ; bapteme-v2-1440x900/etape-11.png |
| 7. ete (contrôle) | 390x844 | oui, plus de décalage | 1 | 7,1 | ete-v2-390x844/etape-1.png ; ete-defiler-v2-390x844/etape-2.png |

Ce qui est corrigé :
- Sur téléphone, l'accueil ne déborde plus. L'en-tête est entier et le bouton Menu s'ouvre au 1er geste.
- La barre Appeler / Réserver est visible dès l'arrivée.
- Le premier écran dit « Restaurant et réceptions · Moineville ».
- Le mode été ne décale plus la page, ni au départ ni en défilant.
- Cadeau sur téléphone : Menu, puis « Offrir », puis « Composer la carte ». Le montant arrive au 3e geste : c'est dans le barème.
- Baptême : « Les fêtes », puis « Baptême, anniversaire, mariage : demander une réception ». Le lien tombe juste sur le formulaire, au 3e geste sur téléphone et au 2e sur ordinateur.
- Le formulaire a maintenant « Date souhaitée » et « Nombre d'invités ». Le sujet « Réception privée » est prérempli.

Ce qui gêne encore :
- Premier écran sur téléphone : la petite ligne est fine et collée sous l'en-tête. Elle ne cite ni Metz ni Thionville. La 2e ligne du titre reste grise et peu lisible.
- Le menu n'a toujours pas d'entrée « Réceptions ». Le lien vers les réceptions est caché sous « Fin d'année / Les fêtes », en simple lien souligné, sous les deux boutons de Noël.
- Par ce lien, le formulaire n'est pas prérempli avec le nombre d'invités : « Nombre d'invités » est vide. Le type d'événement ne figure que dans l'exemple grisé du message.
- La date affiche « mm/dd/yyyy » puis « 05/16/2027 », au format américain. C'est peut-être dû au navigateur de test : à vérifier sur un vrai téléphone.
- Le message final dit toujours « elle partira vers le client ». Aucun délai de réponse n'est annoncé.
- Cadeau : la page remonte seule vers l'enveloppe, puis redescend environ 3 s plus tard vers le message. C'est le même va-et-vient qu'avant. Le message dit encore « pour la recevoir, appelez-nous ».
- Été : au 1er défilement, la barre du bas est en train d'apparaître. Ses boutons sont coupés en bas de l'écran (ete-defiler-v2-390x844/etape-2.png).

Nouvel ordre des gênes à corriger :
1. Les réceptions : pas d'entrée dans le menu, et le lien est caché sous « Fin d'année ».
2. Le message final des formulaires : « vers le client » ; pour le cadeau, « appelez-nous », avec le va-et-vient de la page.
3. Le premier écran sur téléphone : la 2e ligne du titre est peu lisible, et ni Metz ni Thionville ne sont cités.

## Notes sur l'outil (pas des défauts du site)
- « remplir Nom=… » remplit le champ « Prénom », parce qu'il contient « nom ». J'ai utilisé « remplir ^Nom=… ».
- « cliquer 20 h » ne trouve pas le créneau, à cause de l'espace insécable. J'ai cliqué avec l'espace insécable.
- Les dossiers « -scan », « menu-test », « -attente » et « -suite » sont des repérages et des preuves. Ils ne comptent pas comme des missions.
