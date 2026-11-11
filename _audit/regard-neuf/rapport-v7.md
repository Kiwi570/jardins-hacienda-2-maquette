# Regard neuf : Les Jardins de l'Hacienda, maquette v7 « De midi à minuit »

J'ai regardé le site comme un client exigeant et un directeur artistique qui le découvre. Je me suis appuyé sur mes captures, sur le relevé (`/home/claude/v7/jardins-hacienda-2-maquette/_audit/releve.md`), sur le rapport v6 et sur la bibliothèque.

**Quand et comment j'ai fait les captures**
- Le mercredi 11 novembre 2026, entre 16 h 26 et 16 h 50, heure de Paris. Le site affiche donc « fermé · ouvre demain à 12 h » et La carte est au déjeuner.
- L'intro de nuit a été filmée à une heure simulée : jeudi 12 novembre, 1 h 26.
- Toutes les captures sont dans `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/` :
  - un dossier par page et par format, avec sa planche (`<page>-1366.jpg`, `<page>-390.jpg`) ;
  - `films/` pour l'intro, les transitions, la bascule de La carte et l'envoi de la carte cadeau ;
  - `resa-1366/` et `resa-390/` pour le parcours « réserver une table » ;
  - les fichiers `zoom-*.jpg` pour les gros plans.
- Le site a été régénéré pendant mon audit, à 16 h 43 : `site.css` et toutes les pages HTML ont changé, mais pas par moi. Mes captures par écran datent d'avant, mes films et le parcours de réservation d'après. J'ai donc refait à 16 h 50 les captures des défauts principaux sur la version régénérée, dans `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/recontrole/`. Tous les points « À corriger » vérifiés de cette façon sont toujours là, sauf la carte « pool parties » (point 9), qui ne dépasse plus à la position finale.
- Une bande claire d'environ 15 px apparaît au bord droit de presque toutes les captures. C'est la place que le navigateur de test garde pour la barre de défilement. Je ne la compte pas comme un défaut.

## Verdict

**Ce que la v7 apporte**
- Les pages intérieures ont enfin des gestes à elles :
  - l'ardoise de La carte, qui s'efface et se réécrit à la craie quand on passe du midi au soir ;
  - le ciel de Moineville sur l'enseigne détourée, dans Infos pratiques ;
  - l'enveloppe cachetée de la carte cadeau ;
  - le dépliant du menu de Noël ;
  - le panorama réel de 14:30, où l'horloge avance.
- Le voile entre deux pages est court. C'est un ciel qui passe d'une heure à l'autre, et il dit la même heure que la page d'arrivée (12:30 La carte, 19:00 Réceptions, 00:00 Offrir).
- L'intro de nuit (« 01:26 · La maison dort. Rendez-vous à midi. ») est juste et belle.

**Ce qui ne va pas**
- Quatre ouvertures gardent le même gabarit sombre : Réceptions, Les fêtes, Offrir et 404, toutes avec un gros chiffre orange. Les fêtes et Offrir s'ouvrent sur la même image générée de cheminée.
- Les photos sombres reviennent : Réceptions, Les fêtes, Offrir et l'ouverture d'été.
- « Les mains du chef » est une illustration plate, de la famille de « la nappe vide » que le client refuse.
- L'agenda des Fêtes est cassé sur ordinateur.
- Deux horaires de fête sont inventés.
- Le fil horaire se contredit encore à deux endroits.

**L'accueil**
- L'idée se lit en 5 secondes.
- Mais il s'ouvre sur une villa générée qui ne ressemble pas à la maison.

---

## Les cinq questions

### 1. Qu'est-ce que le visiteur peut toucher ?

| Page | Ce qu'on touche | Capture |
|---|---|---|
| Accueil | **L'eau** de la piscine (« Passez la main sur l'eau »). L'onde est discrète sur ma capture. | `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/souris-accueil-eau.jpg` |
| Accueil | **Les ampoules** de la pergola à 19:00 (« Touchez une ampoule »). | `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366/06.jpg` |
| Accueil | **La vapeur** de l'assiette de 21:00 (« Passez la main dans la vapeur »). | `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366/09.jpg` |
| Accueil | **Les braises** du coin du feu (« Passez la main sur les braises »). | `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366/10.jpg` |
| Accueil | **La mini-réservation** : six services datés, couverts « – 2 + », bouton « Réserver cette table ». | `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/resa-1366/01-voile-0.jpg` |
| La carte | **« Passer au dîner / Passer au déjeuner »** : toute la page passe en nuit, l'ardoise s'efface puis se réécrit à la craie, ligne par ligne. | `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/films/bascule-carte.jpg` |
| La carte | Onglets collants, filtre « Végétarien », recherche. Les étapes 01 à 04 de « Les mains du chef » dressent l'assiette au défilement. | `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/la-carte-1366/02.jpg` |
| Les fêtes | **« Passez la main sur la vitre givrée »** : je ne vois aucune trace après le passage de la souris. | `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/souris-fetes-givre.jpg` |
| Les fêtes | Interrupteur « Cet hiver / Cet été », filtres de l'agenda, « Ajouter à mon agenda ». | `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/fetes-ete-1366-0.jpg` |
| Les fêtes | **Le verre des accords** : on touche un plat, le verre change de vin. | `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/les-fetes-1366/05.jpg` |
| Les fêtes | **Le dépliant de Noël**, qui s'ouvre au défilement. | `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/les-fetes-1366/07.jpg` |
| Réceptions | Trois volets d'espaces, demande en trois étapes, carton qui se remplit. | `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/receptions-1366/03.jpg` |
| Réserver | Jours en ronds, service, couverts, créneaux, installation, « Modifier » sur chaque ligne du ticket. | `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/reserver-1366/01.jpg` |
| Réserver | **Plan de salle** : 12 tables, filtres, « Agrandir le plan » sur téléphone. | `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/reserver-1366/04.jpg` |
| Offrir | Montant, nombre, « Pour », « De la part de », petit mot : la carte s'écrit (« Pour Julie · Pour un dîner au coin du feu · De la part de Marc »). « Offrir cette carte » la glisse dans une **enveloppe cachetée « JH »**. | `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/films/offrir-envoi.jpg` |
| Infos pratiques | **Le ciel de Moineville** (curseur, puis Midi / Crépuscule / Nuit / Maintenant) recolore le ciel derrière l'enseigne. | `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/infos-2230-1366-0.jpg` |
| Infos pratiques | Cadran de 24 h à aiguille, jours et curseur d'heure, bouton « Itinéraire », formulaire « Une question » en 4 étapes. | `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/infos-1300-1366-1.jpg` |
| 404 | **« Promenez la bougie dans la salle »** : la lumière suit la souris. | `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/souris-404.jpg` |

**Bilan**
- Chaque page a maintenant quelque chose à manipuler, et ce sont souvent des gestes du métier : la craie, le verre, l'enveloppe, le plan, le ciel.
- Deux effets ne se voient pas sur mes captures : la vitre givrée et, presque, l'eau.

### 2. Qu'est-ce qui relie les pages entre elles ?

**L'intro**
- De nuit, l'horloge s'arrête une seconde sur l'heure réelle : « 01:26 · La maison dort. Rendez-vous à midi. ».
- Elle roule ensuite jusqu'à 12:00 et se pose à la taille et à la place exactes de l'heure du héros.
- Un disque s'ouvre ensuite sur la page. Le tout dure environ 2,1 s.
- Film : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/films/intro-nuit.jpg`.

**Le voile**
- C'est un disque qui monte du bas puis couvre l'écran d'un ciel en dégradé, avec l'heure et le nom de la page.
- Il dure environ 0,5 s, puis il s'ouvre en rideau ou en disque. L'heure du voile est celle de l'ouverture de la page :
  - 12:30 La carte : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/films/trans-accueil-vers-carte.jpg` ;
  - 19:00 Réceptions : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/films/trans-carte-vers-receptions.jpg` ;
  - 00:00 Offrir : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/films/trans-fetes-vers-offrir.jpg`.

**Le fil**
- La pastille de l'en-tête suit le défilement : 12:00 en haut de l'accueil, 21:38 au dîner.
- Le menu du téléphone est enfin dans l'ordre des heures : 12:00, 12:30, 19:00, 23:30, 00:00, Maintenant. Capture : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/menu-390-3.jpg`.
- Le pied de page affiche « 00:00 » partout.

**Il reste deux contradictions** (voir le point 8 de « À corriger ») :
- Les fêtes : le voile et le menu disent 23:30, mais l'en-tête affiche 23:00 dès l'arrivée.
- Accueil vers Réserver : le voile affiche 20:00, puis 21:00 pendant une image, puis de nouveau 20:00.

### 3. Que se passe-t-il quand on réserve une table ?

Parcours complet : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/resa-1366.jpg` (ordinateur) et `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/resa-390.jpg` (téléphone).

1. **À l'accueil, à 21:00**
   - « Vendredi 13 · soir » est déjà coché. Je passe à 3 couverts et je clique sur « Réserver cette table ».
   - Une étiquette « Table pour 3 · Vendredi 13 · soir » s'envole du bouton : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/resa-1366/01-voile-0.jpg`.
2. **Le voile** « 20:00 Réserver » couvre l'écran au bout d'environ 1 s. Film : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/films/trans-accueil-vers-reserver.jpg`.
3. **La page Réserver**
   - Elle s'ouvre en mode nuit, directement sur le formulaire.
   - Le formulaire est déjà rempli : vendredi 13 novembre, soir, 3 couverts, en salle.
   - Capture : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/resa-1366/07-arrivee.jpg`.
4. **La vérification**
   - Je choisis 19 h et je remplis prénom, nom et téléphone, puis je clique sur « Vérifier ma réservation ».
   - Le ticket de droite devient « Tout est juste ? Vendredi 13 novembre, 19 h » et affiche « Confirmer la réservation ».
   - Le bouton « Vérifier » reste actif à gauche : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/resa-1366/14-avant-confirmer.jpg`.
5. **La confirmation**
   - Une carte « RÉSERVÉ · Claire Testeuse · vendredi 13 novembre · 19 h · 3 couverts » tombe au-dessus du ticket.
   - Une cloche orange dessinée la recouvre, puis se soulève.
   - Le ticket affiche « Votre table est réservée · À vendredi 13 novembre, 19 h · 3 couverts · en salle. Référence R-1113-6387 ».
   - Le formulaire se grise.
   - Captures : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/resa-1366/18-confirme-3.jpg` et `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/resa-1366/25-fin.jpg`.

**Jugement**
- Le retour physique est bon : envol, ticket, carte « Réservé ».
- Mais il reste lourd :
  - il faut deux clics, avec deux boutons actifs à la fois ;
  - le plan de salle arrive après la confirmation, et le ticket ne cite aucune table ;
  - la cloche est un aplat orange de clip-art ;
  - le bouton « Faire une autre réservation » est presque invisible.

**Les autres actions**
- Offrir : la carte s'écrit sous les yeux, puis part dans son enveloppe cachetée. C'est un très bon retour. Mais je ne vois aucune phrase de confirmation dans l'écran : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/films/offrir-envoi-8.jpg`.

### 4. Qu'est-ce qui est spectaculaire au premier défilement de l'accueil ?

Planche demi-écran : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366-demi.jpg`.

1. **L'intro devient la page.** L'horloge 01:26 roule jusqu'à 12:00 et se pose dans le héros : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/films/intro-nuit.jpg`.
2. **14:30, le panorama épinglé.**
   - C'est une vraie photo de la piscine et des paillotes, parcourue au défilement.
   - L'horloge avance de 14:30 à 18:45, et les repères (journées festives, bar, piscine, pool parties) sont accrochés aux lieux.
   - Le progrès est net sur la galerie de la v6.
   - Captures : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366-demi/05.jpg` à `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366-demi/09.jpg`.
3. **19:00, la terrasse s'allume.** On passe du crépuscule à la nuit, les guirlandes s'allument et les lignes 19:00, 19:45 et 21:00 s'éclairent : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366-demi/11.jpg` puis `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366-demi/14.jpg`.
4. **23:00, « Au creux de la cheminée · Au coin du feu ».** La fenêtre s'ouvre jusqu'au plein écran, le titre s'écarte et les braises volent : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366-demi/21.jpg`.
5. **Les comptes à rebours** « Dans 44 jours » (Noël) et « Dans 50 jours » (Saint-Sylvestre), justes au 11 novembre.
6. **La carte dorée qui brille à 00:00.**
7. **Le fond de page suit la journée** : crème, indigo, puis braise.

**Jugement**
- La barre des trois familles d'effets est franchie.
- Trois réserves :
  - les trois moments les plus forts (12:00, 19:00, 23:00) reposent sur des images générées ;
  - 12:30 est plat : une liste dans un cadre noir ;
  - la lumière du panorama dore à peine. J'ai mesuré la moyenne des couleurs : le rouge monte de 109 à 135 entre 14:45 et 18:45, et l'œil ne le remarque presque pas.

### 5. Chaque page a-t-elle sa signature ?

Ouvertures côte à côte :
- ordinateur : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/ouvertures-1366.jpg` ;
- téléphone : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/ouvertures-390.jpg`.

| Page | Ouverture | Verdict ouverture | Signature après l'ouverture |
|---|---|---|---|
| Accueil | Piscine générée, voile crème à gauche, « 12:00 » fin bleu canard | Propre, mais grammaire déjà vue | Panorama 14:30, terrasse, feu |
| La carte | Ardoise accrochée au mur, écrite à la craie | **Signature** | Liste classique, puis « Les mains du chef » en dessin plat |
| Réceptions | Pergola dressée, photo de jour assombrie, « 19:00 » orange gras | **Gabarit sombre** | Volets des espaces, carton tamponné |
| Les fêtes | Cheminée générée sous un voile gris, « J-50 » orange gras | **Gabarit sombre, même image qu'Offrir** | Verre des accords, dépliant de Noël |
| Offrir | Même cheminée générée, « 00:00 » orange gras, carte dorée | **Gabarit sombre, doublon des Fêtes** | Enveloppe cachetée |
| Réserver | Crème, salle en arche, « 12:30 » fin bleu canard | **Copie de la section 12:30 de l'accueil** | Plan de salle, ticket |
| Infos pratiques | Enseigne détourée sous le ciel calculé, « Il est 16:27 à Moineville » | **Signature** | Cadran, carte d'accès |
| 404 | Salle sombre éclairée à la bougie, « 00:00 » orange gras | **Gabarit sombre** (bonne idée de bougie) | — |

**Constat**
- Seules La carte et Infos pratiques ont une ouverture qui n'appartient qu'à elles.
- Sur téléphone, Réceptions, Les fêtes, Offrir et 404 donnent quatre écrans sombres, avec le chiffre orange à la même hauteur et le même bloc dessous.
- Après l'ouverture, en revanche, presque chaque page a son geste.
- Plusieurs images reviennent d'une page à l'autre :
  - la cheminée générée, trois fois : accueil 23:00, Les fêtes, Offrir ;
  - la salle « pierre », trois fois : 404, Les fêtes (dépliant), Réceptions ;
  - la salle au soleil, deux fois : accueil 12:30, Réserver ;
  - la coupe devant le feu, deux fois : accueil 23:30, dépliant de Noël.

**Ressemblance avec les trois maquettes précédentes, en une ligne :** oui, en grande partie. On retrouve la grammaire de Lo Componaïro et d'agence ae (surtitre en capitales, titre à empattement avec une deuxième ligne en italique colorée, deux pilules plein et contour, ligne d'état à pastille, consigne « Passez la main ») et la composition de QD2A (voile crème à gauche, photo à droite). Seuls la grande heure « 12:00 » et l'eau la distinguent. Sources : `/home/claude/kiwi570/bibliotheque-maquettes/medias/locomponairo-maquette/debut-p1440.jpg`, `/home/claude/kiwi570/bibliotheque-maquettes/medias/qd2a-maquette/debut-p1440.jpg`, `/home/claude/kiwi570/bibliotheque-maquettes/medias/agence-ae-maquette/debut-p1440.jpg`.

---

## Suivi du rapport v6 : « À améliorer » A à R

| Point v6 | État | Ce que je vois |
|---|---|---|
| A. La carte sans scène | **En partie** | L'ouverture est réglée : ardoise et bascule à la craie, « 20:30 » en orange de nuit. Après, on retrouve la liste de restaurant habituelle, puis une illustration plate (« À corriger », point 3). `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/la-carte-1366/00.jpg` |
| B. Trop de styles d'heure | **Pas réglé** | On compte encore au moins six styles : fin bleu canard, gras orange condensé, fin crème du voile, fin gris du pied de page, à empattement noir avec halo blanc (Infos), et « 12 h – 19 h » en sans-empattement bleu (été). `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/fetes-ete-1366-1.jpg` |
| C. Voile plein écran 1 s, aplat | **Réglé** | Environ 0,5 s, ciel en dégradé entre l'heure de départ et l'heure d'arrivée. Reste le clignotement 20:00 / 21:00 (« À corriger », point 8). |
| D. L'été en novembre | **Pas réglé** | L'accueil s'ouvre toujours sur la piscine en plein soleil. Seule la pastille « Piscine et terrasse de juin à septembre » le signale. |
| E. « 12:00 » à 1 h 26 | **Réglé** | « 01:26 · La maison dort. Rendez-vous à midi. » |
| F. Galerie 14:30 banale | **Réglé en grande partie** | Un seul panorama réel, horloge qui avance, repères accrochés aux lieux. Restent : la carte coupée au bord, la consigne qui chevauche une carte sur téléphone, la lumière qui change à peine. |
| G. Cadres à bordure sur Réserver | **En partie** | Les jours sont des ronds sans bord, les champs n'ont qu'un trait dessous, le récapitulatif est un ticket perforé. Il reste des cadres : les créneaux en pastilles grises, l'encart du plan, la section du plan sur fond gris. |
| H. Plan « Venir » indigent | **En partie** | Vraie carte schématique : Moselle, A31, frontière, Luxembourg, distances. Ni durées ni trajet tracé. `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/infos-pratiques-1366/03.jpg` |
| I. 404 sans effet | **En partie** | La bougie qu'on promène est bien vue. Mais la photo est celle de la salle déjà vue ailleurs, et l'idée rappelle « La servante est restée allumée » de QD2A (planche `/home/claude/kiwi570/bibliotheque-maquettes/palmares/planches/page-404.jpg`). |
| J. Badge « Illustration générée » partout | **Réglé**, sauf un défaut | Un badge par image, plus une ligne dans le pied de page. Sur Les fêtes, le badge est illisible (« À corriger », point 16). |
| K. Vraies photos et images générées qui jurent | **En partie** | L'accueil alterne image générée léchée (12:00, 19:00, 23:00) et vraie photo documentaire (12:30, 14:30, 21:00), et ça se voit. La photo « Baptêmes » ressemble toujours à une photo de banque d'images. `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/receptions-1366/02.jpg` |
| L. Mot qui tourne dans Réceptions | **Réglé** | Le mot change sur la même ligne de base : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/films/trans-carte-vers-receptions.jpg` |
| M. « Minuit » mélange Offrir et Venir | **Réglé** | 00:00, c'est Offrir seul. « Venir » est passé dans le pied de page. |
| N. Petits vides de l'accueil | **En partie** | Vides encore présents (« À corriger », point 22). |
| O. Vignettes rondes répétées | **Réglé** | Elles ne restent qu'à 12:30. |
| P. Point-virgule collé | **Pas réglé** | Huit cas relevés (« À corriger », point 20). |
| Q. « Offrir une soirée » | **Réglé** | « Offrir un moment aux Jardins ». |
| R. « Au creux de la cheminée » | **Réglé** | C'est le sous-titre de « Au coin du feu ». |

---

## À corriger avant de livrer

**1. Les fêtes : l'agenda est cassé sur ordinateur**
- Où : Les fêtes, section « Les prochaines dates », 1366 × 768.
- Captures :
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/les-fetes-1366/01.jpg`
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/les-fetes-1366/02.jpg`
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/les-fetes-1366/03.jpg`
- Problème :
  - les dates de novembre sont rangées dans la colonne étroite de gauche, sous la photo collante des mariés, qui glisse par-dessus ;
  - « 21 NOV » (côte de bœuf) et « 29 » (brunch) se voient à travers la photo ;
  - la raclette est écrasée sur 410 px (« Soirée / raclette », « Samedi 28 / novembre / 2026 ») ;
  - le bouton « Ajouter à mon agenda » touche la photo ;
  - « 50 € hors / boissons » reste orphelin sous la photo ;
  - pendant ce temps, la colonne de droite est vide sous « NOVEMBRE 2026 ».
- Proposition : toutes les dates dans la colonne de droite, mois par mois. La photo reste collante à gauche, sans aucune date dessous. Sur téléphone, la mise en page est correcte : la garder.

**2. Horaires inventés pour Noël et la Saint-Sylvestre, et contradiction sur la même page**
- Où : Les fêtes, agenda, ordinateur et téléphone.
- Captures :
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/les-fetes-1366/02.jpg` (« Vendredi 25 décembre 2026 · 12:00 – 16:00 ») ;
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/les-fetes-1366/03.jpg` (« Jeudi 31 décembre 2026 · 19:00 – 01:00 ») ;
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/les-fetes-1366/05.jpg` (« Horaires de la soirée donnés à la réservation »).
- Problème :
  - ces heures ne sont pas dans le relevé ;
  - le vendredi, le relevé donne 12 h – 14 h 30 et non 16 h ;
  - 15 cm plus bas, la page dit que les horaires sont « donnés à la réservation ».
- Proposition : afficher « au déjeuner » et « le soir », sans heures. Le fichier d'agenda à télécharger peut garder une plage, mais elle ne doit pas s'afficher.

**3. « Les mains du chef » : une illustration plate, catégorie refusée par le client**
- Où : La carte, section « Sur la passe », ordinateur et téléphone.
- Captures :
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/la-carte-1366/06.jpg`
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/la-carte-1366/07.jpg`
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/la-carte-390/07.jpg`
- Problème :
  - une assiette vectorielle sur fond noir, avec la crème de carotte en aplat orange et des girolles en forme de fleurs ;
  - au premier écran, l'assiette est vide sauf une forme orange qui ressemble à un bout de doigt ;
  - c'est exactement « la nappe vide » : un dessin plat à la place d'un vrai plat.
- Proposition : le même mouvement en quatre étapes, mais sur une vraie photo de plat. Il y en a une aux girolles dans `assets/images/vraie/assiette-girolles-*.webp` : quatre recadrages qui se resserrent dessus. Sinon, retirer la section et finir sur « Une table vous attend ».

**4. Les photos sombres reviennent en ouverture**
- Où : Réceptions, Les fêtes (hiver et été), Offrir. Ordinateur et téléphone.
- Captures :
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/receptions-1366/00.jpg` et `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/receptions-390/00.jpg`
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/les-fetes-1366/00.jpg` et `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/les-fetes-390/00.jpg`
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/offrir-1366/00.jpg`
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/fetes-ete-1366-0.jpg`
- Problème :
  - Réceptions : une pergola dressée en plein jour, assombrie jusqu'à la boue sur toute la moitié basse ;
  - Les fêtes : la cheminée sous un voile gris, on ne voit ni la fête ni le feu ;
  - été : un pylône électrique et ses fils au premier plan, sur une photo de piscine assombrie.
  - Le client a écrit « jamais de photos sombres ».
- Proposition :
  - Réceptions : la pergola au crépuscule, guirlandes allumées. Les photos existent (lanternes au-dessus de la piscine la nuit).
  - Les fêtes : une table de réveillon claire.
  - Été : une photo sans pylône, en plein soleil (piscine et paillotes). Assombrir seulement le quart sous le texte.

**5. L'accueil s'ouvre sur une maison qui n'est pas la maison**
- Où : Accueil, 12:00, 19:00 et 23:00, ordinateur et téléphone.
- Captures :
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366/00.jpg` (villa blanchie, arcades, toit de tuiles) ;
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366/03.jpg` (la vraie piscine : paillotes, terrasse en bois) ;
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366-demi/21.jpg` (salle rustique à poutres, générée) ;
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/reserver-1366/00.jpg` (la vraie salle : tables en verre, fauteuils crème).
- Problème :
  - les trois moments les plus forts sont des images générées ;
  - elles montrent une autre architecture que celle des vraies photos plus bas sur la même page ;
  - le badge est honnête, mais le client ne reconnaîtra pas sa maison dans les 5 premières secondes ;
  - le README annonce « une vraie photo de la maison dans chaque section », ce qui est faux pour trois sections sur huit.
- Proposition : 12:00 sur une vraie photo de la piscine et des paillotes (la série professionnelle existe), avec l'effet d'eau par-dessus. 19:00 sur la vraie pergola dressée. Pour 23:00, une vraie photo de la salle le soir. Sinon, une image générée retouchée à partir d'une vraie photo, et non inventée.

**6. Infos pratiques : l'adresse passe sur l'enseigne**
- Où : Infos pratiques, ouverture, ordinateur, à toutes les heures.
- Captures :
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/infos-1300-1366-0.jpg`
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/infos-2230-1366-0.jpg`
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/zoom-infos-adresse.jpg`
- Problème : « 54580 Moineville » chevauche le panneau « les jardins de l'hacienda ». À 13:00, c'est du texte foncé sur un panneau foncé, illisible. À 22:30, c'est du blanc posé sur les lettres.
- Proposition : terminer le bloc de texte 40 px au-dessus du panneau. Soit on remonte le texte, soit on descend l'enseigne de 60 px.

**7. Infos pratiques : le ciel choisi contredit la grande phrase**
- Où : Infos pratiques, ouverture, ordinateur.
- Captures : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/infos-1300-1366-0.jpg` et `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/infos-2230-1366-0.jpg`.
- Problème :
  - le panneau dit « 13:00 · heure choisie » et le ciel est en plein midi, mais le titre dit « Il est 16:31 à Moineville » et le statut « Fermé · ouvre demain à 12 h » ;
  - à 22:30, même chose sous un ciel étoilé ;
  - l'écran affiche deux heures qui se contredisent.
- Proposition : quand le visiteur choisit une autre heure, la phrase devient « À 22:30 à Moineville », le statut suit l'heure choisie, et un lien « revenir à maintenant » ramène l'heure réelle.

**8. Le fil horaire se contredit encore deux fois**
- Où : vers Les fêtes, et de l'accueil vers Réserver. Ordinateur.
- Captures :
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/films/trans-carte-vers-fetes.jpg` (voile « 23:30 Les fêtes ») ;
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/zoom-fetes-entete.jpg` (en-tête « 23:00 » à l'arrivée) ;
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/menu-390-3.jpg` (menu « 23:30 Les fêtes ») ;
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/films/trans-accueil-vers-reserver-05.jpg`, `-06.jpg`, `-07.jpg`, `-08.jpg` (même dossier `films/`, voile « 20:00 », « 20:00 », « 21:00 », « 20:00 »).
- Problème :
  - Les fêtes valent 23:30 dans le voile et le menu, mais 23:00 dans la pastille de la page ;
  - vers Réserver, le voile clignote sur 21:00 pendant une image ;
  - la section de départ s'appelle « 21:00 · Le dîner », et la page d'arrivée est à « 20:00 ».
- Proposition : une seule valeur par page, calculée une fois. 23:30 pour Les fêtes partout, en-tête compris. Le voile d'arrivée ne doit jamais réafficher l'heure de départ. Choisir 21:00 ou 20:00 pour le dîner, mais la même valeur sur l'accueil et sur Réserver.

**9. Panorama de 14:30 : une carte coupée, une consigne qui chevauche**
- Où : Accueil, 14:30 à 18:45, ordinateur et téléphone.
- Captures :
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366-demi/09.jpg` et `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/zoom-accueil-poolparties.jpg` (« annoncée|s » coupé au bord droit) ;
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-390/03.jpg`, `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-390/05.jpg` et `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/zoom-accueil-390-defiler.jpg`.
- Problème :
  - à 18:45, la carte « Les pool parties » dépassait de l'écran. Sur la version régénérée, à 19:00, elle tient mais touche le bord droit, sans marge : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/recontrole/accueil-1366-1.jpg` ;
  - le chevauchement sur téléphone est toujours là après la régénération : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/recontrole/accueil-390-1.jpg` ;
  - sur téléphone, « FAITES DÉFILER : L'APRÈS-MIDI AVANCE JUSQU'À 19 H » passe sous les cartes « Les journées festives » et « Les pool parties » et colle au bord gauche, sans marge ;
  - un repère rond est coupé à moitié au bord gauche.
- Proposition : garder chaque carte à au moins 24 px des bords, quelle que soit la position du panorama. Sur téléphone, placer la consigne sous le titre, avec 16 px de marge, ou la masquer dès qu'une carte s'affiche.

**10. 12:30 : les plats collés aux bords du cadre noir**
- Où : Accueil, « La carte de la semaine », ordinateur et téléphone.
- Captures :
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366/01.jpg`
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/zoom-accueil-ardoise.jpg`
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-390/01.jpg`
- Problème : « Risotto… » touche le bord gauche du cadre et « 21 € » touche le bord droit. Le cadre n'a aucune marge intérieure, on dirait une erreur de mise en page.
- Proposition : une marge intérieure de 28 px. Mieux : reprendre ici une petite version de l'ardoise de La carte (cadre bois, craie), ce qui relierait les deux pages.

**11. Réserver : bouton invisible et deux boutons actifs**
- Où : Réserver, après « Vérifier » puis « Confirmer », ordinateur et téléphone.
- Captures :
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/resa-1366/14-avant-confirmer.jpg` et `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/resa-390/14-avant-confirmer.jpg`
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/resa-1366/25-fin.jpg` et `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/zoom-resa-autre.jpg`
- Problème :
  - après « Vérifier », on voit « Vérifier ma réservation » et « Confirmer la réservation » côte à côte, tous deux rouges et actifs ;
  - après la confirmation, « Faire une autre réservation » est crème sur crème, presque invisible, même 4 s après.
- Proposition : griser « Vérifier » dès que le ticket demande confirmation, ou fusionner les deux étapes. Donner à « Faire une autre réservation » un contour brun foncé, bien lisible.

**12. Réserver : l'encart du plan cache la liste des tables (déjà signalé en v6, point 10)**
- Où : Réserver, plan de salle, ordinateur.
- Captures : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/reserver-1366/04.jpg` et `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/recontrole/reserver-1366-0.jpg`. Sur la seconde, après la régénération, l'encart cache la table 1 et coupe le titre « Table 2 ».
- Problème :
  - l'encart « Choisissez une table libre… / Choisir cette table » couvre la table 4 ;
  - il coupe la ligne « Indisponible (simulation) » de la table 3 ;
  - son bouton, bordé de rouge pâle, a l'air désactivé.
- Proposition : réserver la hauteur de l'encart sous la liste, ou le placer au-dessus des filtres. Bouton plein une fois une table choisie : « Choisir la table 4 ».

**13. La carte : un dîner proposé au déjeuner, et une bande crème entre deux sections sombres**
- Où : La carte, fin de page, au déjeuner, ordinateur et téléphone.
- Captures : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/la-carte-1366/08.jpg` et `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/la-carte-390/08.jpg`.
- Problème :
  - la page est en mode midi (« Réserver un déjeuner » en haut) et le statut dit « ouvre demain à 12 h », mais le bouton final dit « Réserver un dîner » ;
  - une bande crème d'environ 18 px sépare la section noire de la passe et la photo sombre.
- Proposition : le bouton suit le moment (« Réserver un déjeuner » à midi). Supprimer la bande, ou la passer dans la couleur du fond sombre.

**14. 404 sur téléphone : texte illisible sur le coussin éclairé**
- Où : 404, 390 × 844.
- Captures : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/404-390/00.jpg` et `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/zoom-404-390-texte.jpg`.
- Problème : « La maison, elle, » est écrit en blanc sur le coussin clair que la bougie éclaire.
- Proposition : au repos, placer la bougie loin du texte (en haut à droite), et poser un dégradé sombre sous le bloc de texte.

**15. Les fêtes en été : le logo disparaît de l'en-tête**
- Où : Les fêtes, `?saison=ete`, ordinateur.
- Captures : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/fetes-ete-1366-0.jpg` et `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/zoom-fetes-ete-logo.jpg`.
- Problème : quand l'en-tête devient crème, le logo rond reste en version claire, donc crème sur crème. On ne voit plus que « Les Jardins de l'Hacienda ».
- Proposition : basculer aussi le logo quand l'en-tête change de couleur.

**16. Les fêtes : le badge « Illustration générée » est illisible**
- Où : Les fêtes, ouverture, ordinateur.
- Captures : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/les-fetes-1366/00.jpg` et `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/zoom-fetes-badge.jpg`.
- Problème : gris foncé sur brun foncé, sans fond. La mention doit rester lisible : c'est une question d'honnêteté.
- Proposition : le même badge que sur l'accueil (pastille noire, texte blanc).

**17. Effet raté : la vitre givrée des Fêtes**
- Où : Les fêtes, ouverture, ordinateur.
- Capture : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/souris-fetes-givre.jpg` (après le passage de la souris au centre gauche).
- Problème : la consigne invite à passer la main sur la vitre, mais l'image ne change pas. Le givre n'est visible que dans le coin haut droit.
- Proposition : un givre net sur tout le pourtour de l'image, et une trace claire qui reste quelques secondes sous le doigt. Sinon, retirer la consigne.

**18. Offrir : colonne vide, trois cartes différentes, trait parasite, pas de confirmation**
- Où : Offrir et Accueil, ordinateur et téléphone.
- Captures :
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/offrir-1366/02.jpg` (environ 600 × 300 px de noir à gauche de « Total / Offrir cette carte ») ;
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366/12.jpg`, `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/offrir-1366/00.jpg`, `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/offrir-390/00.jpg` et `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/offrir-1366/01.jpg` (trois dessins de carte) ;
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/films/offrir-envoi-8.jpg` et `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/zoom-offrir-trait.jpg`.
- Problème :
  - l'aperçu de la carte n'est pas collant à 1366 × 768 ;
  - il y a trois cartes : dorée « 100 € · Pour un moment aux Jardins » sur l'accueil, dorée « 50 € » (« 25 € » sur téléphone) dans le héros, ambre « 50 » à empattement dans le composeur ;
  - après l'envoi, un petit trait jaune traîne sur l'enveloppe ;
  - aucune phrase ne dit que c'est fait.
- Proposition :
  - un seul objet : la carte dorée du héros, réutilisée dans le composeur ;
  - un aperçu qui reste collé pendant tout le formulaire ;
  - retirer le trait ;
  - sous l'enveloppe, une phrase « Votre carte pour Julie est prête. Pour la recevoir : 06 18 21 28 10. ».

**19. Point médian orphelin en fin de ligne (déjà signalé en v6, point 27)**
- Où : Les fêtes sur téléphone, Accueil 23:30 sur ordinateur.
- Captures : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/les-fetes-390/05.jpg` (« 120 € le menu · ») et `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366/11.jpg` (« …mets et vins · » puis « DJ Laurent Geymet » à la ligne).
- Proposition : coller le point médian au mot précédent avec une espace insécable et couper après lui, ou passer à la ligne sans séparateur.

**20. Point-virgule collé au mot (point P de la v6, non réglé)**
- Où : tout le site. Cas relevés :
  - « dimanche; l'hiver » : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366/02.jpg`
  - « minuit; le midi » : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366/08.jpg`
  - « IA; toutes » : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366/14.jpg`
  - « arrivée; ne » : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/offrir-1366/02.jpg`
  - « 2026; pour » : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/infos-pratiques-1366/02.jpg`
  - « exigée; l'établissement » : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/infos-pratiques-1366/03.jpg`
  - « soirées; le restaurant » : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/les-fetes-1366/07.jpg`
  - « d'abord; » : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/reserver-390/00.jpg`
- Proposition : une espace fine insécable avant « ; », comme avant « ? » et « : ».

**21. Textes de La carte absents du relevé (déjà signalé en v6, points 17 et 18)**
- Où : La carte, ordinateur et téléphone.
- Captures : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/la-carte-1366/03.jpg`, `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/la-carte-1366/04.jpg` et `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/la-carte-1366/00.jpg`.
- Problème : ces textes ne sont pas dans le relevé, qui ne donne que « desserts 9 à 11 € » :
  - « Jusqu'à 10 ans : un plat et un dessert » ;
  - « Assortiment de charcuteries italiennes » ;
  - « Supplément de 10 € par personne en plus. Pour deux : 25 € » ;
  - les noms des desserts : « Crème brûlée à la vanille de l'île Maurice », « Tarte aux fruits de saison », « Le Gourmand », « Figues rôties au miel ». La « Tarte aux fruits de saison » est aussi écrite sur l'ardoise.
  - Le houmous reste sous « Planches pour 4 personnes ».
- Proposition : compléter le relevé à partir du site actuel, ou retirer ces textes. Sortir le houmous des planches (sous-titre « Et aussi »).

**22. Zones mortes (contrainte du client)**
- Captures :
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366/02.jpg` : environ 95 px vides sous la pastille de 12:30 ;
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366/12.jpg` : environ 200 px de brun vide entre « Toutes les dates » et 00:00 ;
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-390/09.jpg` : un écran presque vide (noir, puis un mur blanc nu au début de « Au coin du feu ») ;
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-390/12.jpg` : environ 180 px vides après « Toutes les dates » ;
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/receptions-1366/03.jpg` : la colonne de droite est vide sous « Continuer », le carton est un grand rectangle crème en bas à gauche ;
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/reserver-390/00.jpg` : environ 120 px vides sous « 06 18 21 28 10 » (v6, point 13) ;
  - `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/offrir-1366/02.jpg` : voir le point 18.
- Proposition :
  - resserrer les marges de section à 64 px au plus ;
  - sur téléphone, ouvrir « Au coin du feu » directement sur le foyer, pas sur le mur ;
  - à Réceptions, placer le carton à droite, sous les pastilles qui le remplissent.

**23. « Dans 9 jours » au lieu de 10**
- Où : Les fêtes, « Les prochaines dates », ordinateur et téléphone.
- Captures : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/les-fetes-1366/01.jpg` et `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/les-fetes-390/01.jpg`.
- Problème :
  - le mercredi 11 novembre, la page dit « Prochaine date : Soirée côte de bœuf, dans 9 jours » ;
  - or le samedi 21 novembre est dans 10 jours ;
  - l'accueil compte en jours de calendrier (« Dans 44 jours » pour le 25 décembre, ce qui est juste) ;
  - l'agenda compte en heures écoulées, arrondies vers le bas.
  - Deux pages donnent donc deux façons de compter.
- Proposition : compter en jours de calendrier partout, à l'heure de Paris.

---

## À améliorer (goût, force)

**A. Infos pratiques : une suite de modules en cadres, sur fonds crème et brun alternés**
- Captures : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/infos-pratiques-1366.jpg` (planche), `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/infos-pratiques-1366/04.jpg`.
- On enchaîne : ciel dans une boîte, cadran sur crème, carte sur brun, formulaire à tuiles grises sur crème, pied brun. C'est la phrase même du client : « gadgets rangés dans des cadres sur fonds crème et brun alternés ».
- Proposition :
  - le ciel n'est plus une boîte : un simple curseur posé sur l'image, en bas ;
  - le cadran garde la nuit du ciel au lieu de repasser au crème ;
  - le formulaire « Une question » quitte la page (un lien « Écrire » suffit, le téléphone est la vraie action).

**B. Quatre ouvertures au même gabarit, des images en double**
- Voir la question 5.
- Proposition :
  - Réceptions : la pergola au crépuscule, en clair ;
  - Offrir : un gros plan de la carte dorée sur la nappe, sans la salle ;
  - 404 : sa propre image, par exemple la terrasse de nuit, lanternes éteintes ;
  - Réserver : la salle dressée pour le service du jour, pas l'arche de l'accueil.
  - La cheminée générée doit rester à un seul endroit.

**C. Les styles d'heure**
- Garder deux styles :
  - jour : fin, bleu canard ;
  - nuit : gras, orange.
- Le voile, le pied de page et Infos pratiques doivent reprendre l'un des deux selon l'heure. « 12 h – 19 h » (été) passe en « 12:00 – 19:00 ».

**D. Novembre**
- L'accueil ouvre sur la piscine en plein soleil alors que le visiteur cherche le feu et les fêtes.
- Proposition : de novembre à mars, 12:00 sur la vraie salle au soleil d'hiver, près des baies (« l'hiver, près des baies vitrées » est déjà écrit à 12:30). La piscine passe dans le panorama de 14:30, avec la mention « de juin à septembre ».

**E. La réservation en deux temps, et une cloche de clip-art**
- Captures : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/resa-1366/18-confirme-3.jpg`, `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/resa-1366/26-fin-dessous.jpg`.
- Proposition :
  - le plan de salle se place entre « Où souhaitez-vous vous installer ? » et « Vos coordonnées » ;
  - la table apparaît sur le ticket (« Table 4 · baies vitrées ») ;
  - un seul bouton ;
  - la cloche devient une vraie cloche en métal (photo ou rendu), ou disparaît : la carte « Réservé » qui tombe suffit.

**F. L'agenda sur téléphone**
- Capture : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/les-fetes-390/02.jpg`.
- Six dates, donc douze gros boutons empilés (« Ajouter à mon agenda » et « Réserver »), et « Les Jardins de l'Hacienda, Moineville » répété six fois.
- Proposition : une icône « agenda » discrète, un seul bouton plein, et supprimer le lieu, qui est évident.

**G. Le panorama de 14:30**
- Captures : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366-demi/05.jpg` et `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/accueil-1366-demi/09.jpg`.
- Le tiers haut de la photo est délavé par le fondu crème, et la lumière ne dore presque pas.
- Les cartes en verre sombre ressemblent à des bulles d'application.
- Proposition : une lumière nettement plus chaude vers 18:45, avec des ombres plus longues. Des étiquettes plus légères, en texte sur un trait, accrochées au lieu.

**H. La carte d'accès**
- Capture : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/infos-pratiques-1366/03.jpg`.
- La carte est juste mais immobile.
- Proposition : le trajet en voiture se trace au défilement, avec les durées une fois vérifiées. La légende ne doit pas croiser le tracé de la Moselle, qui passe sur « · tracés simplifiés ».

**I. L'intro de nuit sur fond crème**
- Capture : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/films/intro-nuit-1.jpg`.
- « La maison dort » s'écrit sur un fond de plein jour.
- Proposition : à 1 h 26, l'intro commence sur un fond de nuit qui s'éclaircit pendant que l'horloge roule jusqu'à midi.

**J. « J-50 » sans complément**
- Capture : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/les-fetes-1366/00.jpg`.
- On ne sait pas de quoi c'est le compte. La ligne de prix met la Saint-Sylvestre avant Noël, alors que le paragraphe juste au-dessus met Noël d'abord.
- Proposition : « J-50 · Saint-Sylvestre », et Noël d'abord partout.

**K. Le dépliant de Noël**
- Captures : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/les-fetes-1366/08.jpg`, `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/les-fetes-390/07.jpg`.
- Le volet « Le cœur du repas » montre la salle en plein jour, aux fauteuils crème, sans rien de Noël.
- La coupe est celle de l'accueil à 23:30.
- La note « acompte… pour les soirées » est posée sous un déjeuner.
- Proposition : le foie gras ou une table de fête. Pour l'acompte : « Un acompte par couvert peut être demandé ».

**L. Réceptions**
- Captures : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/receptions-1366/02.jpg`, `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/receptions-1366/03.jpg`.
- « Baptêmes » ressemble à une photo de banque d'images, et « Anniversaires » montre une pièce montée de mariage.
- Proposition : des photos prises sur place, ou trois photos au lieu de quatre.

**M. La 404 trop proche de QD2A**
- Une lumière seule dans le noir, comme « La servante est restée allumée ».
- Proposition : garder la bougie, mais sur la terrasse et ses lanternes, qui s'éteignent une à une jusqu'à 00:00.

**N. Le héros de l'accueil**
- Il reprend la grammaire des trois maquettes précédentes (voir la question 5).
- Proposition : retirer le surtitre en capitales et la deuxième ligne en italique colorée. « 12:00 » seul, très grand, et la phrase dessous en une seule voix.

**O. Le plan de salle de nuit**
- Capture : `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/resa-1366/26-fin-dessous.jpg`.
- Les tables 4, 5 et 6 se lisent mal sous le faisceau blanc des baies. La nuit, la lumière vient de la salle, pas du dehors.
- Proposition : retirer le faisceau la nuit et éclairer les tables par de petites bougies.

---

## Bien (à garder)

- **L'intro de nuit** : « 01:26 · La maison dort. Rendez-vous à midi. », puis l'horloge qui roule et se pose exactement sur l'heure du héros. `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/films/intro-nuit.jpg`
- **Le voile court en ciel dégradé**, avec la même heure que la page (12:30, 19:00, 00:00). `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/films/trans-accueil-vers-carte.jpg`
- **L'ardoise de La carte** : accrochée au mur par une ficelle, elle s'efface et se réécrit à la craie au passage midi/soir, et toute la page passe en nuit. C'est la meilleure ouverture du site. `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/films/bascule-carte.jpg`
- **Le ciel de Moineville sur l'enseigne détourée** : vraie photo, lever 07:40 et coucher 17:02 justes (j'ai refait le calcul : 07:39 et 17:02). `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/infos-1720-1366-0.jpg`
- **Le panorama réel de 14:30**, avec son horloge qui avance et ses repères accrochés aux lieux.
- **La terrasse qui s'allume à 19:00** et **« Au creux de la cheminée · Au coin du feu »** en plein écran.
- **Le verre des accords** de la Saint-Sylvestre et **le dépliant de Noël**, dont le menu est exact.
- **La carte cadeau qui s'écrit**, puis **l'enveloppe cachetée « JH »**. `/home/claude/v7/jardins-hacienda-2-maquette/_audit/regard-neuf/v7/films/offrir-envoi.jpg`
- **La réservation pré-remplie depuis l'accueil**, l'étiquette qui s'envole et la carte « Réservé ».
- **Le plan de salle** : coin du feu, baies, grande table, terrasse fermée l'hiver.
- **Le mot qui tourne dans Réceptions**, désormais sur la même ligne.
- **Le menu du téléphone dans l'ordre des heures.**
- **La bougie de la 404** et son texte (« Cette page a fermé à minuit. »).
- **Les données justes** :
  - adresse, téléphone et horaires du relevé ;
  - prix de la carte (9 à 21 €, 21 à 26 €, enfant 16 €, planches 45 €, houmous 12 €) ;
  - Noël (vendredi 25 décembre, 79 €, menu exact) ;
  - Saint-Sylvestre (jeudi 31 décembre, 120 € et 170 €, DJ Laurent Geymet, menu de l'affiche) ;
  - soirées côte de bœuf (21 novembre, 50 €), raclette (28 novembre, 39 €), brunch (29 novembre, 50 €), libanaise (19 décembre, 49 €) ;
  - carte cadeau de 25 à 200 €, valable 6 mois ;
  - distances 19, 24 et 47 km ;
  - comptes à rebours de l'accueil justes au 11 novembre (44 et 50 jours ; voir le point 23 pour « dans 9 jours »).
- **Le badge « Illustration générée » discret**, un par image, avec une ligne dans le pied de page (sauf sur Les fêtes, point 16).

---

## Suite donnée (v7)

Corrigé avant la livraison :
- 1 (agenda) : la liste est dans sa propre colonne (les titres de mois et les dates passées que le module ajoute restent à droite) ; la photo reste collante à gauche.
- 2 (heures inventées) : Noël et la Saint-Sylvestre sont des dates sans heure dans l'agenda ; plus d'heure de fin.
- 3 (« Les mains du chef » plate) : le dessin est remplacé par une vraie photo du site, découpée en couches (purée, pièce rôtie, girolles, légumes, herbes) qui se posent nettes sur la même assiette floue et dans l'ombre, puis la photo entière.
- 4 (ouvertures sombres) : la pergola de Réceptions est éclaircie (voile seulement sous le texte) ; l'été des Fêtes est recadré sous le pylône.
- 6 et 7 (Infos) : l'enseigne passe à droite et se fond dans le ciel, le texte garde la gauche ; l'adresse a sa ligne avec les distances ; la grande heure suit l'heure choisie sur le curseur du ciel, puis revient à l'heure réelle.
- 8 (fil horaire) : Les fêtes valent 23:30 partout (en-tête compris) ; Réserver le soir vaut 21:00 partout (voile, en-tête, ouverture, comme le dîner de l'accueil).
- 9 : légendes du panorama placées du côté où elles tiennent ; sur téléphone, un bandeau en bas de l'image donne la légende du lieu au centre ; la consigne s'efface sur téléphone.
- 10 : le cadre noir des plats de 12 h 30 venait d'un nom de classe partagé avec la passe de La carte (renommée).
- 11 (en partie) : le ticket du récapitulatif garde ses couleurs claires, « Faire une autre réservation » est lisible ; la double validation Vérifier / Confirmer est la logique de réservation de la v5, gardée.
- 13 : « Réserver un déjeuner » ou « un dîner » selon le service affiché ; le fond des scènes épinglées est sombre.
- 14 : 404 sur téléphone, voile plus dense sous le texte et ombre portée.
- 15 : l'été, le logo de l'en-tête passe en version de jour.
- 16 et 17 : la vitre givrée repasse au-dessus du dégradé (visible), la mention « Illustration générée » au-dessus du givre.
- 19 et 20 : espace insécable normale avant « ; », « ! », « ? » (l'espace fine se voyait à peine) et point médian collé au mot qui le précède.
- 23 : l'agenda compte en jours de calendrier (« dans 10 jours »), comme l'accueil.

Gardé, et pourquoi :
- 5 (12:00, 19:00 et 23:00 en images générées) : l'eau de midi (WebGL sur la moitié basse de l'image) et la terrasse qui s'allume (trois lumières dans un même cadre) ont besoin de ces images ; aucune vraie photo n'a l'eau sur la moitié basse ni trois états identiques. La maison réelle est dans toutes les autres sections de l'accueil (salle, panorama, assiette, Saint-Sylvestre).
- 12 (encart collant du plan de salle) et 22 (zones mortes) : relevés pour la suite.
- 18 (Offrir) et 21 (textes de La carte) : modules et données gardés de la v5 ; la liste à confirmer est dans le README.
