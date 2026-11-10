# Regard neuf : maquette des Jardins de l'Hacienda (10 novembre 2026)

Avis d'un directeur artistique, uniquement d'après les captures. Le code source n'a pas été lu.

**Date des captures.** Le dossier `_audit/rapport/captures/` a été vidé pendant le relevage (relance de l'audit). J'ai donc fait mes propres captures, toutes hors du navigateur de l'audit, dans `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard/` :

- `caps/` et `films/` (ouvertures et transitions) : prises entre 14 h 20 et 14 h 33, **donc avant 14 h 35**.
- `action/` (réserver et offrir filmés) : vers 14 h 30, donc avant 14 h 35 aussi.
- `caps2/` (ordinateur, toutes les pages) : prises entre 14 h 37 et 14 h 40, **après les corrections**. Je m'en suis servi pour vérifier les points de l'accueil, de La carte et de Réserver.

Je me suis aussi appuyé sur les captures du test « vrai visiteur » (`_audit/visiteur/`) et sur la planche `_audit/apercu/planche.jpg`. Les noms de capture cités ci-dessous renvoient à ces dossiers, avec la largeur 1366 ou 390.

---

## Les cinq questions

**1. Qu'est-ce que le visiteur peut toucher ?**
- Accueil : le plateau tournant « Faites tourner le plateau ». On l'attrape et on le lance, et il garde son élan (indiqué par l'étiquette « Attrapez le plateau et lancez-le »). On peut aussi passer la main sur le plat du premier écran (vapeur), et faire tourner le carrousel 3D « Recevoir aux Jardins » avec ses flèches.
- La carte : des onglets collants (entrées, plats, à partager, desserts), les filtres « Végétarien » et « À partager », et une recherche par ingrédient.
- Les fêtes : on touche un plat et le verre prend la forme et la couleur du vin de l'accord.
- Réserver : le plan de salle en 3D. On choisit une table, ce qui filtre par espace et par nombre de couverts (« Trop petite pour 4 »), puis on choisit le jour, le service et l'heure. Les jours et heures pleins sont barrés.
- Offrir : on choisit le montant et le nombre de cartes, et on écrit un mot. La carte dorée se compose en direct.
- Infos pratiques : un cadran 24 h « Ouvert maintenant ? ». Il se lit, mais ne se manipule pas.

La matière à toucher est riche et elle vient vraiment du métier. Le point faible est sa finition, pas l'idée.

**2. Qu'est-ce qui relie les pages entre elles ?**
- **Intro.** Sur chaque page chargée directement : la cloche dorée, puis « Les Jardins de l'Hacienda » pendant environ 1,3 s. La cloche va ensuite vers l'objet de la page et s'ouvre en cercle : la carte de placement sur Réserver, l'arche photo sur Les fêtes, le crème de La carte, le numéro de téléphone sur Infos pratiques.
- **Voile entre deux pages.** Une forme de cloche sombre, avec la petite cloche et le nom de la page (« La carte », « Les fêtes »), puis une ouverture ronde. La transition reprend bien le motif.
- **Fil conducteur.** Une ficelle couleur braise court sur le bord gauche puis le bord droit, avec un point-repère et des pointillés pour la suite. Elle est présente sur toutes les pages.

Le lien entre les pages est réel et cohérent. Seul défaut : l'intro complète de 2,3 à 2,6 s revient sur chaque page intérieure chargée directement (voir A2).

**3. Que se passe-t-il quand il fait l'action principale ?**
- **Offrir** (`action/offrir-clic-1366.png`) : la carte glisse dans une enveloppe, le rabat se ferme, un cachet de cire « JH » se pose, puis « Pour Léa » s'écrit à la main. C'est un vrai retour physique, au niveau du palmarès.
- **Réserver** (`action/reserver-confirmer-1366.png`, `visiteur/reserver-1440x900/etape-23.png`) : l'encadré récapitulatif change seulement de texte en moins de 200 ms. Il affiche « Demande enregistrée — À samedi 14 novembre, 20 h », avec un liseré vert. Aucun objet ne bouge : pas de carte de placement qui se pose, pas de table qui s'allume sur le plan. Sur téléphone, la confirmation reste hors de l'écran : après le clic, le visiteur voit le pied de page (`visiteur/reserver-390x844/etape-25.png`). **C'est trop sage pour l'action n° 1 du site.**

**4. Qu'est-ce qui est spectaculaire au premier défilement de l'accueil ? Chaque page intérieure a-t-elle une famille d'effets moderne ?**
- **Accueil.** Il réunit au moins quatre familles :
  - typographie géante qui défile (bandeau « Rouget · Os à moelle · Suprême », en plein et en contour) ;
  - réaction au pointeur (vapeur, « Passez la main sur le plat ») ;
  - image qui s'ouvre en plein écran (« Au creux de la cheminée ») ;
  - carrousel 3D (Recevoir) ;
  - braises en particules.
  Le compte est bon. En revanche, le premier écran reste un « hero » classique : photo, titre moyen et deux boutons.
- **Pages intérieures :**
  - Réserver : 3D (plan incliné). Oui.
  - Infos pratiques : typographie géante qui défile (bandeau des villes) et numéro géant. Oui.
  - Offrir : carte qui bouge et reflet métallique. Oui, mais discret.
  - Les fêtes : le verre qui change (c'est une mécanique du métier) et un fond de braises floues. C'est limite : aucune famille de la liste ne s'y voit nettement.
  - **La carte : aucune famille moderne ne se voit sur les captures.** L'ardoise à la craie et les onglets ne comptent pas.

**5. Chaque page a-t-elle sa signature après l'ouverture ?**
Oui, globalement, et c'est la vraie qualité de la maquette :
- accueil : le plateau et le dressage ;
- La carte : l'ardoise ;
- Les fêtes : le verre de l'accord et le décompte ;
- Réserver : le plan de salle ;
- Offrir : la carte et l'enveloppe ;
- Infos pratiques : le cadran et le numéro géant.

Les ouvertures sont variées : crème et titre italique, bordeaux avec arche, fumée avec carte de placement, fumée centrée, crème avec numéro géant.

Il y a quand même des répétitions :
- **les titres** de l'accueil sont repris tels quels en tête des pages (« Les fêtes à table », « Offrir une table ») ;
- **la même photo de la salle** (cheminée, ours en peluche, sapin) revient au moins quatre fois ;
- **la même intro** joue avant chaque page.

---

## Points relevés

Gravité : **À corriger avant livraison**, **À améliorer**, **Mineur**.

### À corriger avant livraison

| # | Page / format | Capture | Constat | Correction proposée |
|---|---|---|---|---|
| A1 | Réserver / 1366 et 390 | `caps2/reserver-1366-03`, `caps2/reserver-1366-04` (après 14 h 35), `caps/reserver-390-02`, `caps/reserver-390-03` | Le panneau collant « Choisissez une table libre… / Réserver cette table » **recouvre la liste des tables**. Les tables 8, 9 et 10 sont masquées sur ordinateur, les tables 2 et 3 sur téléphone. Le défaut est toujours là après 14 h 35. | Mettre le panneau au-dessus de la liste, sans le rendre collant par-dessus. Ou le coller en bas de l'écran, avec une marge en bas de la liste égale à sa hauteur. Sur téléphone, en faire une barre fine au-dessus de la barre « Appeler / Réserver ». |
| A2 | Réserver / tous formats | `action/reserver-confirmer-1366`, `visiteur/reserver-390x844/etape-25` | **Pas de retour physique** à la confirmation : seul le texte change. Sur téléphone, la confirmation reste hors de l'écran. | Faire défiler jusqu'à la confirmation. Animer un objet du métier : la carte de placement « Réservé — Claire Martin, samedi 20 h » se pose sur la table 2 du plan, ou la table choisie s'allume en braise. Durée 0,8 à 1,2 s. |
| A3 | Accueil / 1366 et 390 | `caps2/accueil-1366-09`, `caps/accueil-1366-10`, `caps/accueil-390-07`, `caps/accueil-390-08` | « **Au creux de la cheminée** » : « cheminée » est **coupé au bord droit**. « Au creux » est illisible, en blanc fin sur les chaises et les verres (on lit « Au c eux »). Sur téléphone, le titre déborde de l'image qui s'ouvre et se perd. | Garder le titre entier dans l'écran, avec une marge de 6 vw. Ajouter un voile sombre en dégradé sous le texte, ou passer le titre en Bodoni plus gras avec une ombre douce. Sur téléphone, mettre le titre sur deux lignes au-dessus de l'image, et non à cheval sur son bord. |
| A4 | Accueil / tous formats | `caps/accueil-1366-05` à `-08` (planche `planche-accueil-a.png`), `caps/accueil-390-05` | La scène épinglée « Le chef dresse le suprême de pintade » est la meilleure idée métier du site, mais elle est **dessinée comme une icône naïve**. Le suprême ressemble à un churros côtelé, la sauce à une virgule orange, les girolles à des fleurs. L'écart avec les photos du site est flagrant. | Remplacer le dessin par des photos détourées superposées : crème de carotte tirée à la cuillère, suprême doré, girolles, sauce. Ou garder du dessin, mais en trait gravé couleur laiton, dans l'esprit de l'ardoise. |
| A5 | Réserver / 1366 et 390 | `visiteur/reserver-1440x900/etape-23`, `visiteur/reserver-390x844/etape-27` | La référence « **R-** / 1114-3902 » est coupée en fin de ligne. Le libellé « Demande enregistrée » est en **vert**, une couleur absente de la direction (fumée, crème, braise, laiton). | Empêcher la coupure de la référence (`nowrap`). Passer le libellé en laiton ou en braise. |
| A6 | Réserver / tous formats | `caps/reserver-1366-02`, `caps/reserver-1366-06` | **Le nombre de couverts se règle deux fois**, une fois dans « Plan de la salle » et une fois dans « Combien de personnes ? ». | N'en garder qu'un : celui du plan, repris en lecture seule dans le formulaire avec un lien « Modifier ». |
| A7 | La carte / 1366 | `caps/la-carte-1366-*` (planches `planche-carte-a.png` et `planche-carte-b.png`) | **Aucune famille d'effets moderne visible** sur La carte, alors que la grille en exige au moins une par page intérieure. | Faire s'ouvrir la photo du bandeau en plein écran au défilement (le plat en grand, puis il se range). Ou faire bouger les noms de plats selon la vitesse de défilement dans les onglets collants. |
| A8 | La carte, Les fêtes / tous formats | `caps/la-carte-1366-05`, `caps/les-fetes-390-03` | **Informations absentes du relevé**, à confirmer ou à retirer : « Planches pour 4, supplément 10 € par personne, pour deux : 25 € » ; « Menu enfant jusqu'à 10 ans : un plat et un dessert » ; « Bouchée gourmande » et « Velours… Éclats de… » dans la Saint-Sylvestre ; « Nancy » sur la carte d'accès. | Si ces détails ne viennent pas du site actuel, les retirer ou les marquer « à confirmer ». |

### À améliorer

| # | Page / format | Capture | Constat | Correction proposée |
|---|---|---|---|---|
| B1 | Toutes les pages intérieures / tous formats | `films/ouverture-*-1366.png` | L'intro complète (cloche et nom du restaurant, 2,3 à 2,6 s avant le contenu) **rejoue à chaque page** chargée directement. Sur la quatrième page, c'est une attente, plus une surprise. | Garder l'intro longue pour l'accueil. Sur une page intérieure chargée directement, ne montrer que la cloche et le nom de la page pendant 0,8 s, comme le voile de transition. |
| B2 | Accueil / 1366 | `caps2/accueil-1366-01`, `apercu/planche.jpg` | Le premier écran est **en dessous des ouvertures du palmarès**. Le titre est moyen (environ 60 px), on voit une photo, deux boutons et la consigne « Passez la main sur le plat ». | Faire un titre géant qui occupe la moitié de l'écran, avec le plat qui fume à travers les lettres. Ou faire de la cloche de l'intro le cadre du plat, qu'elle découvre en se levant. |
| B3 | Toutes les pages | accueil `-10` ; fêtes `-01` et `-04` ; réserver `-05` ; visiteur | La **même photo de la salle** (cheminée, ours, sapin) sert sur l'accueil, l'arche des fêtes, le menu de Noël et Réserver. Sur La carte, la photo du dessert en verre revient deux fois. | Varier les images : terrasse et piscine pour Réserver, gros plan d'un plat de fête pour Noël. Une photo ne doit servir qu'une fois par page. |
| B4 | Réserver / 1366 et 390 | `caps/reserver-1366-01`, `caps/reserver-390-01` | La carte de placement de l'en-tête répète le titre (« Votre table » deux fois dans le même écran). | Écrire sur la carte « Réservé · au coin du feu » ou « Table 2 · 4 couverts ». |
| B5 | Réserver / 1366 | `caps/reserver-1366-02` | Le bouton « Réserver cette table » désactivé (texte brun sur brun) est presque invisible. Il a l'air cassé plutôt qu'en attente. | Garder un contour crème à 40 %, et ajouter la mention « Choisissez d'abord une table ». |
| B6 | Réserver / 390 | `caps/reserver-390-02` | Sur téléphone, le plan est trop petit : les numéros de table font environ 6 px et sont impossibles à viser. | Agrandir le plan à toute la largeur sur un tap, avec un zoom à deux doigts. Ou mettre la liste en premier et le plan en vignette. |
| B7 | Réserver / 1366 | `action/reserver-verifier-1366` | Si l'heure n'est pas choisie, « Vérifier ma réservation » n'affiche **aucun message visible** près du bouton. | Faire défiler jusqu'au champ manquant, le cercler en braise et afficher « Choisissez une heure ». |
| B8 | La carte / 1366 et 390 | `caps/la-carte-1366-02`, `caps/la-carte-390-02` | L'ardoise reste presque vide (« De saison à… » écrit petit) sur un grand panneau vert, et sur téléphone elle occupe un écran entier. | Écrire les quatre plats de saison à la craie, en grand, au fil du défilement. Sur téléphone, réduire sa hauteur de moitié. |
| B9 | La carte / 1366 | `caps/la-carte-1366-04`, `-05`, `-07` | Sous les onglets collants, les noms de plats, les prix et les étiquettes passent à moitié et se coupent. | Donner aux onglets un fond crème plein, une ombre légère, et une marge de défilement égale à leur hauteur. |
| B10 | La carte / 1366 | `caps/la-carte-1366-09`, `-10` | La fin de page « Une table vous attend » est plate : un vide, une photo répétée, deux boutons. Elle est en dessous du palmarès « appel ». | Faire un appel plein écran : photo de la salle au soir, « Une table vous attend ce vendredi » avec le prochain service ouvert, et les boutons Réserver et Appeler. |
| B11 | Les fêtes / 1366 et 390 | `caps/les-fetes-1366-06`, `caps/les-fetes-390-06` | Les soirées passées sont **barrées**, ce qui se lit comme « annulé ». | Les mettre en gris avec la mention « A eu lieu », sans barrer. |
| B12 | Les fêtes / 1366 | `caps/les-fetes-1366-04`, `-05` | Le menu de Noël est une liste sage à côté d'une photo de salle. C'est l'offre la plus chère du mois, elle mérite mieux. | Révéler les plats un par un, cloche par cloche, et utiliser une vraie photo de plat de fête. |
| B13 | Accueil / 1366 et 390 | `caps/accueil-1366-14`, `caps/accueil-390-11` | Carrousel « Recevoir » : les légendes en perspective sont illisibles (« Mariages » sur la carte de gauche), le carrousel est petit dans un grand vide, et la photo des « Baptêmes » montre une tablée de mariage. | Agrandir le carrousel à 80 % de la largeur. Ne garder la légende que sur la carte de face. Mettre une photo juste par type d'événement. |
| B14 | Offrir / 1366 et 390 | `caps/offrir-1366-02`, `caps/offrir-390-02` | Sur la carte dorée, la mention « Carte cadeau » est quasi invisible (clair sur or). | Passer le texte en brun foncé ou le graver en relief. |
| B15 | Offrir / 1366 | `caps/offrir-1366-01` | L'en-tête dit « 25 → 200 € » sur la carte **et** « De 25 à 200 € » à côté du bouton. La photo de fond est si sombre qu'elle ne sert à rien. | Ne garder qu'une des deux mentions. Éclaircir la photo du paquet ou la retirer. |
| B16 | Offrir / 1366 | `action/offrir-fin-1366` | Après l'enveloppe, aucune phrase de confirmation n'est visible dans l'écran, et le formulaire reste modifiable comme si rien ne s'était passé. | Ajouter sous l'enveloppe : « Carte prête — à remettre à Léa », avec un bouton « Offrir une autre carte ». |
| B17 | Infos pratiques / 390 | `caps/infos-pratiques-390-01` | La photo de l'enseigne est recadrée en « ardins de l'hac ». | Recadrer pour le téléphone sur le monogramme et le mot entier, ou passer l'image en format plus haut. |
| B18 | Accueil et pages intérieures | `caps2/accueil-1366-01`, `caps/les-fetes-1366-01`, `caps/offrir-1366-01` | Les titres de section de l'accueil sont repris tels quels en titre de page (« Les fêtes à table », « Offrir une table »). | Garder la section de l'accueil comme accroche, et donner à chaque page son propre titre, par exemple « Noël et la Saint-Sylvestre au coin du feu ». |

### Mineur

| # | Page / format | Capture | Constat | Correction proposée |
|---|---|---|---|---|
| C1 | Accueil / 1366 et 390 | `caps2/accueil-1366-03`, `caps/accueil-390-03` | L'étiquette inclinée « Attrapez le plateau et lancez-le » mord sur le bas du plateau et est coupée par le bord de l'écran. | La remonter sous le titre, ou à droite du plateau, sans chevauchement. |
| C2 | Accueil / 390 | `caps/accueil-390-04` | La signature « Régis Cla… » est coupée tant que l'écriture n'est pas finie. | Lancer l'écriture plus tôt, ou afficher le nom entier en mode calme. |
| C3 | Réserver / 1366 | `caps/reserver-1366-06` | Grand vide entre la ligne des heures et « 3 créneaux disponibles ». | Resserrer à 16 px. |
| C4 | Les fêtes / 1366 | `caps/les-fetes-1366-07` | Le pied de page, identique sur six pages, est très long sur téléphone (`caps/accueil-390-14`, `caps/accueil-390-15`). | Mettre le sommaire sur deux colonnes sur téléphone. |
| C5 | Tous | – | « Illustration générée » apparaît sur les en-têtes de Réserver, Offrir, Les fêtes et la page 404. C'est honnête, mais l'étiquette est visible sur presque chaque premier écran. | Garder la mention, mais en plus petit et plus discret (opacité 60 %). |

### Ce qui est au niveau ou au-dessus du palmarès

- **Offrir** (composition de la carte puis enveloppe et cachet) : au niveau des sections « calculateur » et « tarifs » du palmarès.
- **Réserver** (plan de salle en 3D filtrable, créneaux pleins barrés, récapitulatif collant) : au-dessus de « outil interactif », une fois A1, A2 et A6 corrigés.
- **Les fêtes** (le verre qui prend la forme et la couleur du vin) : une mécanique propre au métier, rare.
- **Infos pratiques** (cadran 24 h « Ouvert maintenant ? » et numéro géant) : au niveau de la section « contact ».
- La cloche comme motif d'intro et de transition : cohérente du début à la fin.
