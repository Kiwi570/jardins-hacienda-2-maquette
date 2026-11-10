# Test « vrai visiteur » : Les Jardins de l'Hacienda

**Visiteuse :** Claire, 42 ans, habite Metz. Elle veut dîner samedi soir à quatre (dont un couple d'amis végétariens) et offrir une carte cadeau de 50 € à sa sœur Julie.
**Quand :** mardi 10 novembre 2026, vers 14 h. Le « prochain samedi » est donc le 14 novembre.
**Comment :** captures d'écran uniquement, sans lire le code. Chaque suite démarre sur l'accueil et attend 3,5 s pour l'animation d'ouverture.

**Comment lire les chiffres :**
- Les secondes sont celles mesurées par l'outil. Elles comprennent les 3,5 s d'animation d'ouverture.
- Un clic ou un écran défilé compte pour un geste. Remplir un champ n'entre pas dans le barème, mais ces saisies sont notées.
- Barème : 3 gestes et 30 s au plus pour arriver à l'endroit qui répond. Pour réserver et offrir, la limite s'applique à l'arrivée sur le formulaire, puis on le remplit jusqu'à la confirmation.

---

## 1. Téléphone (390 × 844)

| Mission | Réussie | Gestes | Secondes | Ce qui a gêné | Capture de référence |
|---|---|---|---|---|---|
| 1. Premier écran | **Oui** | 0 | 6,8 | Le quoi et le où sont clairs : « Restaurant et réceptions · Moineville », cuisine de saison du chef Régis Clauss, au coin du feu, entre Metz et Thionville. En revanche, rien ne dit pour qui (couples, familles, groupes ?) ni à quel prix, et rien n'indique si c'est ouvert. La ligne « Saint-Sylvestre · jeudi 31 décembre » arrive sans explication. | `premier-ecran-390x844/etape-2.png` |
| 2. Prix | **Oui** | 1 (« Voir la carte ») | 9,4 | « Plats de 9 à 26 € · menu enfant 16 € » s'affiche tout de suite. Aucun prix ne figure sur le premier écran de l'accueil. Sur l'ardoise, la craie met environ 4 s à écrire les prix et le tableau reste vide en attendant. Le libellé « Plats de 9 à 26 € » contredit « Nos plats 16 à 26 € » sur l'accueil. | `prix-390x844/etape-3.png`, `prix-suite-390x844/etape-5.png` |
| 3. Réserver | **Oui, de justesse** | 2 pour entrer dans la réservation (plan de salle et nombre de couverts). Le choix du jour n'arrive qu'au 7e geste. 20 actions jusqu'à la confirmation, dont 4 champs. | 11,5 pour entrer, 21,4 pour voir les jours, 38,5 pour la confirmation | Le site impose d'abord de choisir une table sur un plan, avec 2 couverts par défaut : il faut cliquer + deux fois, défiler, choisir la table puis « Réserver cette table ». Les tables affichent « Prise ce soir » alors que le restaurant est fermé ce soir et que Claire réserve pour samedi. Le samedi est caché à droite dans une rangée qui défile de côté. La date s'affiche au format américain (11/14/2026). Le « 4 » du nombre de personnes, en police très fine, se lit comme « /\| ». Après « Confirmer », le titre de la confirmation est caché sous l'en-tête et il faut remonter pour le lire. | `reserver-390x844/etape-25.png` (juste après Confirmer), `reserver-390x844/etape-27.png` (confirmation lisible) |
| 4. Contact / venir | **Oui** | 2 (Menu, Infos pratiques) pour le téléphone et l'adresse, 3 pour les horaires | 9,7 (téléphone et adresse), 12,9 (horaires) | Le bouton « Appeler » est toujours visible en bas, c'est très bien. Le grand numéro s'écrit chiffre par chiffre : pendant 1 à 2 s, on lit « 06 18 21 28 » sans le « 10 ». Les horaires sont sous une horloge décorative. La photo de l'enseigne est coupée (« ardins de l'hac »). Le texte « Stationnement : à compléter » est visible. | `contact-390x844/etape-5.png`, `contact-390x844/etape-8.png` |
| 5. Ce qui le distingue | **Oui, mais faiblement** | 3 suffisent pour le coin du feu et le chef. Il en faut environ 11 pour les jardins, la piscine et les réceptions. | 23 pour 6 écrans, 29 pour 11 écrans | Dans les 30 premières secondes, Claire retient : un chef nommé, une carte de saison renouvelée chaque semaine, une salle au coin du feu et des plats à 16–26 €. Les vrais atouts (jardins, piscine, terrasse, réceptions) n'arrivent qu'au 9e écran environ. Pendant le défilement, on traverse des écrans presque vides (révélations lentes). L'assiette dessinée « Le chef dresse le suprême de pintade » est peu appétissante et retient 2 écrans. Sur le titre « Au creux de la cheminée », un trait lumineux passe sur « la » comme s'il était barré. | `difference-390x844/etape-7.png`, `difference-390x844/etape-16.png`, `difference-suite-390x844/etape-13.png` |
| 6. Ouvert maintenant ? | **Oui, de justesse** | 3 (Menu, Infos pratiques, défiler) | 11,5 | La réponse « Fermé · ouvre demain à 12 h » est claire, mais elle n'apparaît nulle part sur l'accueil ni dans le menu. Il faut 3 gestes, la limite du barème. | `ouvert-390x844/etape-5.png` |
| 7. Plat végétarien et son prix | **NON** | 3 (Voir la carte, défiler, « Un plat végétarien ? »), puis un 4e | 14,9 (17,1 avec le 4e geste) | Après le clic sur « Un plat végétarien ? », le filtre est actif mais le nom et le prix du plat restent sous le bas de l'écran. À leur place, on voit une **photo de volaille**. Au geste suivant, le nom du plat passe sous la barre de filtres qui reste collée en haut : on ne voit que la fin de la description et l'étiquette « Végétarien ». Sur l'accueil, « Dhal aux trois lentilles 21 € » apparaît dès le 2e écran, mais sans aucune mention végétarienne : Claire ne peut pas en être sûre. | `vegetarien-390x844/etape-6.png`, `vegetarien-390x844/etape-9.png` |
| 8. Carte cadeau 50 € | **Oui** | 3 pour le formulaire (Menu, Offrir, Composer la carte). Ensuite : clic sur 50 € (déjà choisi par défaut), 1 défilement, 2 champs (Pour : Julie, De la part de : Claire), « Offrir cette carte ». | 12 pour le formulaire, 18,1 pour l'envoi, 23,3 pour lire la confirmation | Après « Offrir cette carte », la page remonte sur une enveloppe cachetée « Pour Julie ». C'est joli, mais le message « Carte prête : une carte de 50 € pour Julie » est hors écran et il faut redescendre pour le trouver. On ne sait pas comment Julie recevra la carte (« Mode de remise (envoi, retrait) : à compléter »). Il n'y a ni e-mail, ni numéro de carte, ni « de la part de Claire » dans le message final. | `cadeau-390x844/etape-12.png`, `cadeau-390x844/etape-15.png` |

**Bilan téléphone : 7 missions réussies sur 8, dont 3 de justesse. La mission « végétarien » est un échec.**

---

## 2. Ordinateur (1440 × 900)

| Mission | Réussie | Gestes | Secondes | Ce qui a gêné | Capture de référence |
|---|---|---|---|---|---|
| 1. Premier écran | **Oui** | 0 | 7,9 | Même message que sur téléphone, avec un menu clair : La carte, Les fêtes, Offrir, Infos pratiques, Réserver. La photo du plat est un peu floue en grand. Rien ne dit pour qui, ni à quel prix, ni si c'est ouvert. | `premier-ecran-1440x900/etape-2.png` |
| 2. Prix | **Oui** | 1 | 9,6 | « Plats de 9 à 26 € · menu enfant 16 € » est bien visible à droite. Aucun prix sur l'accueil avant le 2e écran. | `prix-1440x900/etape-3.png` |
| 3. Réserver | **Oui, de justesse** | 2 pour entrer (plan de salle). Le choix du jour arrive au 7e geste. 18 actions jusqu'à la confirmation, dont 4 champs. | 11,7 pour entrer, 21,3 pour voir les jours, 35,4 pour la confirmation | Même détour obligé par le plan de salle avec 2 couverts par défaut. Les numéros des tables sur le plan sont quasi illisibles (clair sur clair). Le récapitulatif à droite est excellent, et la confirmation « Demande enregistrée · À samedi 14 novembre, 20 h · Référence » reste bien visible. Mêmes défauts que sur téléphone : « Prise ce soir » alors que c'est fermé, date au format 11/14/2026, « 4 » en police fine. | `reserver-1440x900/etape-23.png` |
| 4. Contact / venir | **Oui** | 1 (Infos pratiques) pour le téléphone et l'adresse, 2 pour les horaires | environ 9,6 (12,9 avec 2,5 s d'attente), 15,3 pour les horaires | Le grand numéro est très lisible. Le lien « Itinéraire » est présent. « Stationnement : à compléter » et « fermetures exceptionnelles à compléter » sont visibles. | `contact-1440x900/etape-4.png`, `contact-1440x900/etape-7.png` |
| 5. Ce qui le distingue | **Oui, mais faiblement** | 3 pour le chef, le coin du feu et la carte de la semaine. Environ 11 pour les jardins et la piscine. | 20,9 pour 6 écrans, 28,6 pour 11 écrans | Le bloc « Le chef dresse le suprême de pintade » reste figé pendant **4 défilements** : la page semble bloquée. L'illustration (un rouleau beige sur une traînée orange) ne donne pas faim. Le titre géant « Au creux de la chemin… » est coupé à droite et le mot « Au creux », blanc sur photo claire, se lit mal. Les jardins, la piscine et les réceptions arrivent seulement après environ 28 s. | `difference-1440x900/etape-16.png`, `difference-suite-1440x900/etape-4.png`, `difference-suite-1440x900/etape-10.png` |
| 6. Ouvert maintenant ? | **Oui** | 2 (Infos pratiques, défiler) | 12,8 | « Fermé · ouvre demain à 12 h » et le tableau de la semaine sont très clairs, mais rien ne s'affiche sur l'accueil. | `ouvert-1440x900/etape-4.png` |
| 7. Plat végétarien et son prix | **Oui** | 3 (Voir la carte, défiler, « Un plat végétarien ? ») | 14,5 | « Dhal aux trois lentilles · 21 € » est visible. À côté, la photo de la rubrique montre une **volaille**, ce qui trouble quand le filtre végétarien est actif. La ligne pointillée qui relie le nom au prix est mal placée : elle passe sous la description, loin du prix. | `vegetarien-1440x900/etape-6.png` |
| 8. Carte cadeau 50 € | **Oui** | 2 pour le formulaire (Offrir, Composer la carte). Ensuite : clic sur 50 €, 2 champs, 1 défilement, « Offrir cette carte ». | 12,1 pour le formulaire, 17,2 pour l'envoi, 22,1 pour lire la confirmation | Comme sur téléphone, la page remonte sur l'enveloppe et le message « Carte prête » est hors écran. Le mode de remise n'est pas indiqué. La mention « Carte cadeau » sur la carte dorée est presque invisible. | `cadeau-1440x900/etape-10.png`, `cadeau-1440x900/etape-13.png` |

**Bilan ordinateur : 8 missions réussies sur 8, dont 3 de justesse (réserver, différence, et ouvert, qui n'est pas visible sur l'accueil).**

---

## 3. Gênes classées et propositions

### Bloquantes (la mission échoue ou le visiteur ne peut pas aller au bout pour de vrai)

1. **Plat végétarien introuvable en 3 gestes sur téléphone, avec une photo de viande.** Après « Un plat végétarien ? », le nom et le prix restent sous le bas de l'écran. La seule image visible est une volaille, et au défilement suivant le nom passe sous la barre de filtres collée en haut.
   - Après le clic, faire défiler jusqu'au **premier plat filtré, nom et prix en haut de l'écran**, en tenant compte de la hauteur de la barre collante.
   - Quand le filtre « Végétarien » est actif, **remplacer la photo de volaille** par celle du dhal, ou ne pas l'afficher.
   - Réduire la hauteur de la photo de rubrique sur téléphone.
   - Ajouter une **pastille « Végétarien »** à côté du Dhal et du Houmous partout : bloc « Faites tourner le plateau » de l'accueil et ardoise.
2. **Carte cadeau : on ne sait pas comment Julie la recevra.** Le texte affiche « Mode de remise (envoi, retrait) : à compléter », sans champ e-mail, sans paiement et sans numéro de carte.
   - Ajouter un choix « **Recevoir par e-mail (PDF) / Envoyer à Julie par e-mail / Retirer au restaurant** » avec les champs qui vont avec.
   - Dans le message final, ajouter un **numéro de carte** et « de la part de Claire ».

### À corriger (la mission passe, mais de justesse ou avec une gêne réelle)

3. **Réserver : le jour n'arrive qu'au 7e geste.** Le plan de salle passe avant la date, avec 2 couverts par défaut.
   - Mettre **« Quel jour ? Combien ? Quelle heure ? » en premier**, en haut de la page Réserver.
   - Rendre le plan facultatif : « Choisir ma table (facultatif) ».
   - Faire mener le bouton « Réserver une table » de l'accueil **directement au formulaire**.
4. **« Prise ce soir » sur les tables**, alors que le restaurant est fermé ce soir et que Claire réserve pour samedi. Calculer les tables prises **pour la date choisie**, ou retirer la mention.
5. **Samedi caché** à droite dans la rangée des jours sur téléphone. Afficher les 7 jours sur deux lignes, ou mettre une puce « **Ce samedi** » en tête.
6. **Ouvert ou fermé : rien sur l'accueil.** Ajouter une **pastille « Fermé · ouvre demain à 12 h »** (ou « Ouvert jusqu'à 23 h ») sous le titre de l'accueil et dans le menu du téléphone.
7. **Confirmations hors écran.**
   - Réservation sur téléphone : le titre est caché sous l'en-tête. Faire défiler pour que **le haut du bloc de confirmation** soit visible.
   - Carte cadeau, sur les deux formats : le message « Carte prête » est sous l'écran. **Afficher le message juste sous l'enveloppe**, dans la partie visible.
8. **Les vrais atouts arrivent trop tard.** Jardins, piscine, terrasse et réceptions apparaissent au 9e–11e écran, soit environ 28 s.
   - Les **nommer dès le premier écran**, par exemple : « Cuisine de saison au coin du feu l'hiver, jardins et piscine l'été ».
   - Avancer le bloc « Recevoir aux Jardins ».
9. **Défilement bloqué sur ordinateur.** Le bloc « Le chef dresse le suprême de pintade » retient 4 défilements (2 sur téléphone), et l'illustration ne donne pas faim.
   - Ramener ce bloc à **1 écran**.
   - Le remplacer par une vraie photo du plat, ou par une courte vidéo.
10. **Titre « Au creux de la cheminée » mal lisible.**
    - Sur ordinateur, il est coupé à droite (« chemin… ») et écrit en blanc sur une photo claire : réduire sa taille et assombrir la photo sous le texte.
    - Sur téléphone, le trait lumineux barre le mot « la » : le retirer.
11. **Chiffre du nombre de personnes illisible.** Le « 4 », en police très fine, ressemble à « /\| ». Utiliser la **même police que les boutons** pour les chiffres du formulaire.
12. **Mentions « à compléter » visibles par le public** : stationnement, politique de confidentialité, mode de remise, fermetures exceptionnelles, horaires du 31 décembre. Les **remplir ou les masquer** avant la mise en ligne.

### Mineures

13. **Aucun prix sur le premier écran de l'accueil.** Ajouter une ligne « **Plats 16–26 € · menu enfant 16 €** » sous le texte d'accroche, ce qui répond aussi à « pour qui ».
14. **Libellés de prix incohérents** : « Plats de 9 à 26 € » sur la page carte, « Nos plats 16 à 26 € » sur l'accueil. Écrire « Entrées dès 9 €, plats 16 à 26 € ».
15. **Le grand numéro s'écrit chiffre par chiffre** sur Infos pratiques : pendant 1 à 2 s, il manque le « 10 ». Afficher le numéro complet tout de suite.
16. **Animations lentes qui retiennent l'information.**
    - L'ardoise à la craie met environ 4 s à écrire les prix.
    - La section des fêtes reste pâle environ 2 s sur téléphone.
    - Des écrans presque vides apparaissent pendant le défilement.
    - Proposition : afficher le texte tout de suite et garder l'animation pour le décor.
17. **Date au format américain** « 11/14/2026 » dans le champ date. Cela vient peut-être du navigateur de test : à vérifier sur un vrai téléphone en français et, au besoin, afficher « samedi 14 novembre » à côté.
18. **Numéros des tables sur le plan** quasi illisibles (clair sur clair) : les foncer.
19. **« Saint-Sylvestre · jeudi 31 décembre »** sous les boutons de l'accueil n'est ni un lien ni expliqué. En faire un lien vers « Les fêtes », avec le prix (120 €).
20. **Petits défauts visuels.**
    - Photo d'accueil un peu floue en grand écran.
    - Mention « Carte cadeau » presque invisible sur la carte dorée.
    - Photo de l'enseigne coupée sur téléphone.
    - Bande sombre d'environ 15 px sur le bord droit des sections claires sur ordinateur.
21. **Type de cuisine pas nommé.** Le nom « Hacienda » et une carte qui mêle bistrot de saison, « La Libanaise », houmous et dhal laissent un doute. Une phrase simple (« cuisine française de saison, quelques assiettes du monde à partager ») aiderait.

---

## 4. Remarques sur le test

- Deux difficultés viennent de l'outil et non du site, mais elles méritent d'être notées :
  - Le créneau « 20 h » n'a pas pu être cliqué par son texte exact (espace spéciale entre « 20 » et « h ») : il a fallu viser « 20 ».
  - Le champ « Nom » était confondu avec « Prénom ».
  - Ce point mérite d'être vérifié avec la commande vocale du téléphone.
- Points forts à garder :
  - Barre fixe « Appeler / Réserver » en bas du téléphone.
  - Récapitulatif de réservation qui se met à jour à droite sur ordinateur.
  - Champ « Allergie ou régime » utile pour les amis végétariens.
  - Tableau des horaires avec « aujourd'hui » repéré.
  - Montant de 50 € présélectionné sur la carte cadeau.

---

## 5. Relance après corrections (10 novembre 2026, vers 14 h 55)

| Mission | Format | Avant | Après | Correction |
|---|---|---|---|---|
| 7. Plat végétarien | 390 × 844 | **ratée** : nom et prix sous l'écran, photo de volaille | **réussie** en 3 gestes (Voir la carte, défiler, « Un plat végétarien ? »), 16,8 s attentes comprises : « Dhal aux trois lentilles · 21 € » et « Houmous · 12 € » juste sous la barre des filtres, étiquettes « Végétarien », aucune photo (`vegetarien-v2-390x844/etape-7.png`) | le lien filtre puis amène le premier plat sous l'en-tête et la barre, après le recalcul de la page ; photo de rubrique masquée sous un filtre ; « végétarien » sur le plateau de l'accueil |
| 6. Ouvert maintenant ? | les deux | 3 et 2 gestes | **0 geste** : « Fermé · ouvre demain à 12 h » sur le premier écran de l'accueil, en lien vers les horaires | statut calculé avec le module horaires |
| 3. Réserver | les deux | jour au 7e geste | jour au 2e geste : « Réserver sans choisir de table » dans l'ouverture de Réserver ; jours sur deux lignes sur téléphone (samedi visible) ; confirmation amenée sous l'en-tête | lien direct, grille des jours, défilement par le socle du projet |
| 8. Carte cadeau | les deux | message « Carte prête » hors écran | message amené dans l'écran quand le cachet est posé ; il dit la validité (6 mois) et que la remise est à confirmer | défilement après le recalcul de la page ; texte du statut |
| 5. Ce qui le distingue | les deux | jardins et piscine au 9e écran | cités dès la première phrase de l'accueil (« au coin du feu l'hiver, aux jardins et au bord de la piscine l'été ») ; scène de l'assiette raccourcie (1,4 écran au lieu de 2,4) | texte, réglage du module |

Autres gênes corrigées : prix harmonisés (« Entrées dès 9 € · plats de 21 à 26 € »), « Saint-Sylvestre · jeudi 31 décembre · 120 € » en lien vers Les fêtes, chiffres des couverts dans la police du texte, numéros des tables foncés, « Déjà réservée (simulation) » au lieu de « Prise ce soir », grand numéro écrit deux fois plus vite, « Carte cadeau » lisible sur la carte dorée, titre de la cheminée ombré.
Non corrigées (dans le résumé de livraison) : animations de l'ardoise et des révélations jugées lentes, dessin de l'assiette, mentions « à compléter » (volontaires, à remplir par le client), date du champ au format du navigateur de test (anglais), photo d'accueil un peu douce en très grand écran.
