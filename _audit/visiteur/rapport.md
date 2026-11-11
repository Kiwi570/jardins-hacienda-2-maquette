# Test « vrai visiteur » : Les Jardins de l'Hacienda (maquette)

Persona : Claire, 38 ans, Thionville. Elle cherche un dîner à deux un samedi soir et prépare le baptême de sa fille au printemps (environ 40 invités). Elle consulte d'abord le site sur son téléphone (390×844), puis sur son ordinateur (1440×900).
Visite faite le mercredi 11 novembre 2026 vers 0 h 30 (heure de Paris).

Comment lire les mesures :
- **Gestes** : un écran défilé ou un clic compte pour un geste. Les champs remplis sont comptés à part.
- **Secondes** : temps du parcours mesuré par l'outil. Les chargements et les attentes après chaque clic sont comptés, les captures ne le sont pas.
- **Barème** : la mission 1 doit réussir sans aucun geste, les autres en 3 gestes au plus et en 30 s au plus.

## Tableau mission × format

| Mission | Format | Réussie ? | Gestes | Secondes | Chemin suivi |
|---|---|---|---|---|---|
| 1. Arrivée | Téléphone | **Partiellement** : on ne sait pas où c'est, et le nom n'est pas écrit | 0 | 3,2 | Premier écran seul |
| 1. Arrivée | Ordinateur | Oui | 0 | 3,2 | Premier écran seul |
| 2. Prix | Téléphone | Oui | 1 (accueil) ou 2 (page carte) | 4,3 / 6,2 | Défiler 1 écran sur l'accueil (5 plats avec leurs prix) ; ou Menu, puis « La carte » (fourchettes de prix en tête de page) |
| 2. Prix | Ordinateur | Oui | 1 | 6,7 | « La carte » dans l'en-tête |
| 3. Réserver (2 pers., samedi soir) | Téléphone | Oui : confirmation obtenue, mais **hors barème** | 1 pour atteindre le formulaire ; 8 jusqu'à la confirmation, + 4 champs | 18,6 | « Réserver une table », Sam, Soir, défiler, 20 h, défiler, 4 champs, « Vérifier ma réservation », « Confirmer la réservation » |
| 3. Réserver | Ordinateur | Oui : confirmation obtenue, mais **hors barème** | 1 pour atteindre le formulaire ; 7 jusqu'à la confirmation, + 4 champs | 18,5 | « Réserver » dans l'en-tête, Sam, Soir, défiler, 20 h, 4 champs, Vérifier, Confirmer |
| 4. Venir / joindre | Téléphone | Oui pour le téléphone et l'adresse ; **horaires complets hors barème** | 2 (téléphone et adresse) ; 4 (semaine complète) | 6,3 / 8,7 | Menu, « Infos pratiques », puis 2 écrans défilés |
| 4. Venir / joindre | Ordinateur | Oui | 1 (téléphone et adresse) ; 3 (semaine complète) | 6,5 / 8,0 | « Infos pratiques », puis 2 écrans défilés |
| 5. Ce qui le distingue | Téléphone | Oui | 16 écrans | 32,7 | Défilement de tout l'accueil |
| 5. Ce qui le distingue | Ordinateur | Oui | 14 écrans | 27,7 | Défilement de tout l'accueil |
| 6. La carte (plats et prix) | Téléphone | Oui, mais **hors barème** | 2 pour atteindre la page ; 4 pour voir les premiers plats ; 9 pour toute la carte | 7,2 / 9,6 / 15,5 | Menu, « La carte », puis défilement |
| 6. La carte | Ordinateur | Oui | 2 pour voir les premiers plats ; 6 pour toute la carte | 6,9 / 9,8 | « La carte », puis défilement |
| 7. Réception (baptême, 40 pers.) | Téléphone | Oui : demande envoyée, mais **hors barème** et avec une date inventée | 1 pour atteindre le formulaire ; 6 jusqu'à l'envoi, + 7 champs | 15,4 | « Demander une réception » (premier écran), Baptêmes, défiler, Continuer, date + invités + mot, Continuer, 4 champs, « Envoyer ma demande » |
| 7. Réception | Ordinateur | Oui : demande envoyée, mais **hors barème** et avec une date inventée | 2 pour atteindre le formulaire ; 6 jusqu'à l'envoi, + 7 champs | 16,9 | « Réceptions », « Demander une réception », Baptêmes, Continuer, Continuer, Envoyer |

Le samedi soir était bien proposé : samedi 14 novembre, créneaux de 19 h à 21 h 30, midi fermé. J'ai réservé à 20 h. Le site a affiché la référence R-1114-6727 sur téléphone et R-1114-3661 sur ordinateur.

## Ce qui a gêné, mission par mission

### 1. Arrivée (de quoi s'agit-il, pour qui, où ?)

**Ordinateur.** Le premier écran répond bien à la question. On y lit :
- « Les Jardins de l'Hacienda » ;
- « Restaurant et réceptions · Moineville, entre Metz, Thionville et le Luxembourg » ;
- « La cuisine de saison du chef Régis Clauss… ».

Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/arrivee-1440x900/etape-0.jpg`

**Téléphone.** Le premier écran affiche seulement le monogramme « H », une grande horloge « 12:00 », le slogan « Midi au bord de l'eau, minuit au coin du feu. », l'état « Fermé · ouvre à 12 h » et les deux boutons.
- Le nom n'est écrit nulle part.
- Le mot « restaurant » n'apparaît pas.
- La ville n'apparaît pas.

Les boutons « Réserver une table » et « Demander une réception » laissent deviner qu'il s'agit d'un restaurant qui fait aussi des réceptions. En revanche, la photo de piscine et de palmiers fait plutôt penser à un club de plage ou à un hôtel, et Claire ne peut pas savoir que l'établissement est près de chez elle. Même après 4 s d'attente, le titre et la phrase du chef visibles sur ordinateur n'apparaissent pas.
Captures :
- `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/arrivee-390x844/etape-0.jpg`
- `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/arrivee-attente-390x844/etape-2.jpg`

**Sur les deux formats :**
- **Heure trompeuse.** La visite a lieu à 0 h 30, mais l'écran affiche « 12:00 » en très grand à côté de « Fermé · ouvre à 12 h ». On lit « il est midi et c'est fermé ». La petite horloge de l'en-tête change d'une page à l'autre (12:00, 20:30, 12:30, 19:00, 23:00) et n'indique la vraie heure que sur Infos pratiques.
- **Mauvaise saison.** En novembre, la première image montre la piscine en plein été. L'ambiance de la cheminée, qui correspond à ce que Claire cherche ce soir, n'arrive qu'au 9e écran sur téléphone.
- **Boutons sous la ligne de flottaison sur ordinateur.** « Réserver une table » et « Demander une réception » sont sous le premier écran. Il faut défiler pour les voir.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/distinction-1440x900/etape-3.jpg`
- **Mention « Illustration générée ».** Elle figure sur presque toutes les photos. C'est honnête pour une maquette, mais pour une vraie cliente, cela fait douter de l'endroit.

### 2. Prix

**Téléphone.**
- Sur l'accueil, un seul écran défilé suffit pour voir cinq plats avec leur prix : Risotto de Saint-Jacques 21 €, Foie gras de canard maison 21 €, Suprême de pintade 24 €, Dhal aux trois lentilles 21 €, L'os à moelle 9 €.
- La ligne de synthèse « Entrées de 9 à 21 € · plats de 21 à 26 € · menu enfant 16 € » est en partie cachée sous la barre fixe « Appeler / Réserver ».
- Au-dessus de « 12 h 30 », une bande vide d'environ 200 px fait croire que la page est finie.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/prix-accueil-390x844/etape-1.jpg`
- Par le menu puis « La carte », la synthèse des prix est lisible en haut de page.
  Captures : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/prix-390x844/etape-2.jpg` (menu), `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/prix-390x844/etape-3.jpg`
- Les prix des fêtes affichés sur l'accueil (Saint-Sylvestre 120 € le menu, 170 € avec l'accord mets et vins ; Noël 79 € par personne, hors boissons) n'arrivent qu'au 12e écran.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/distinction-390x844/etape-36.jpg`

**Ordinateur.**
- La synthèse est visible dès l'arrivée sur la page « La carte ».
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/prix-1440x900/etape-1.jpg`
- Sur la page « Les fêtes », le bandeau « 120 € le menu · 79 € par personne, hors boissons » place côte à côte les prix de deux menus différents sans les nommer. On croit lire un seul menu à deux prix.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/fetes-1440x900/etape-2.jpg`

### 3. Réserver une table pour 2, samedi soir

Le parcours est clair. Les jours sont présentés sous forme de pastilles, le lundi et le mardi sont barrés « fermé », le midi du samedi est barré, et les créneaux du soir sont lisibles. Le récapitulatif « Tout est juste ? » rassure.

Ce qui a gêné :
- **Trop d'étapes.**
  - Le formulaire s'ouvre sur « Aujourd'hui / Midi » : il faut changer le jour, puis le service.
  - Il faut cliquer « Vérifier ma réservation », puis encore « Confirmer la réservation ».
  - Au total : 8 gestes sur téléphone et 7 sur ordinateur, en plus des champs.
  Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reserver-390x844/etape-2.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reserver-390x844/etape-5.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reserver-390x844/etape-8.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reserver-390x844/etape-15.jpg`
- **Date au format américain.** Le champ « Ou une autre date » affiche 11/14/2026. Le problème vient peut-être du navigateur de test : il faut vérifier sur un vrai téléphone réglé en français.
  Captures : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reserver-390x844/etape-5.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reserver-1440x900/etape-5.jpg`
- **Message d'erreur mal placé.** Si le nom est oublié, « Indiquez votre nom. » s'affiche sous le champ E-mail, loin du champ Nom.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reserver-erreur-390x844/etape-9.jpg`
- **Choix de la table après la confirmation.** La section « Choisir ma table (facultatif) », avec le plan de la salle, se trouve sous le bouton de confirmation. On la découvre une fois la réservation faite.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reserver-390x844/etape-16.jpg`
- **Choix barrés après confirmation (ordinateur).** « Soir », « 20 h » et « En salle » s'affichent barrés, avec une bordure rouge en pointillés. On croit que la réservation a été annulée.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reserver-1440x900/etape-15.jpg`
- **Référence coupée.** Sur téléphone, la référence se coupe en « R- » / « 1114-6727 » sur deux lignes.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reserver-390x844/etape-16.jpg`
- **Raccourci peu visible.** Le bloc de l'accueil « Votre table pour le prochain service » (« Samedi 14 · soir », « Réserver cette table ») est un excellent raccourci, mais il n'apparaît qu'au 7e ou 8e écran.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/distinction-390x844/etape-21.jpg`

### 4. Venir / joindre

**Téléphone.**
- La barre fixe « Appeler » permet d'appeler sans aucun geste, ce qui est très bien.
- Le premier écran d'Infos pratiques montre « Appeler 06 18 21 28 10 », l'adresse « 6 Vathier Haye, 54580 Moineville » et l'état « Fermé · ouvre à 12 h ».
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/venir-390x844/etape-3.jpg`
- Les horaires de la semaine sont repoussés sous un grand cadran décoratif. Il faut deux écrans de plus pour les lire : lundi et mardi fermé ; mercredi et jeudi 12 h – 14 h 30 ; vendredi 12 h – 14 h 30 et 19 h – minuit ; samedi 19 h – minuit ; dimanche 12 h – 16 h.
  Captures : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/venir-390x844/etape-5.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/venir-390x844/etape-7.jpg`
- Petits défauts sur cette page :
  - Le cadran indique 00:34 alors que le curseur affiche « Aujourd'hui à 0 h 30 : fermé ».
  - Le trait du plan schématique s'arrête avant Metz ; le dessin était peut-être encore en cours d'animation.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/venir-390x844/etape-8.jpg`

**Ordinateur.** Tout est clair en 1 à 3 gestes.
Captures : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/venir-1440x900/etape-2.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/venir-1440x900/etape-6.jpg`

**À préciser.** Les « Journées festives d'été » ont lieu le mardi, le mercredi et le jeudi, de 12 h à 19 h, alors que le tableau des horaires indique le mardi fermé. Le site note « Horaires relevés le 1er novembre 2026 », mais rien ne dit que ce sont les horaires d'hiver.

### 5. Ce qui le distingue (après environ 30 s sur l'accueil)

Ce que Claire retient :
1. Le principe « midi au bord de l'eau, minuit au coin du feu ». L'été, il y a la piscine sous les palmiers, le bar sous la paillote, les journées festives et les pool parties. L'hiver, on dîne dans la salle, autour de la cheminée.
2. La cuisine de saison du chef Régis Clauss, avec une carte renouvelée chaque semaine et des prix raisonnables (entrées de 9 à 21 €, plats de 21 à 26 €).
3. Un vrai lieu de réception : terrasse sous une pergola avec guirlandes, salle avec cheminée, piscine. On y fête mariages, baptêmes, anniversaires et pots de départ.
4. Les fêtes de fin d'année : Saint-Sylvestre avec DJ, déjeuner de Noël.
5. La carte cadeau, de 25 à 200 €.

L'ensemble donne une identité nette, différente d'un restaurant classique.

Ce qui a gêné :
- **Lieu tardif sur téléphone.** Le lieu n'apparaît qu'au 13e écran, dans le bloc « Venir ».
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/distinction-390x844/etape-39.jpg`
- **Défilement qui semble bloqué.** La section « Recevoir, le soir venu » reste figée pendant 3 à 4 écrans : on a l'impression que la page ne défile plus.
  Captures : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/distinction-1440x900/etape-15.jpg` à `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/distinction-1440x900/etape-24.jpg` ; sur téléphone, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/distinction-390x844/etape-12.jpg` à `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/distinction-390x844/etape-18.jpg`
- **Titre coupé sur ordinateur.** Le grand titre « 14 h 30 » passe sur deux lignes, « 14 h » puis « 30 ».
- **Carte d'été coupée.** Dans le carrousel d'été, la première carte est déjà coupée (« …anche ») quand on arrive dessus.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/distinction-1440x900/etape-9.jpg`
- **Image « Les pool parties ».** C'est un gros plan de flammes, flou et sans rapport avec une piscine.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/distinction-1440x900/etape-12.jpg`
- **Mention coupée par le cadre arrondi.** Sur téléphone, la mention « Illustr… » est coupée par le cadre en arche de la photo.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/distinction-390x844/etape-24.jpg`
- **Bande claire sous le pied de page sur téléphone.** Une bande beige vide apparaît sous le pied de page sombre.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/distinction-390x844/etape-48.jpg`

### 6. La carte (plats et prix)

**Ce qui est affiché, tel quel.**

| Rubrique | Plats et prix |
|---|---|
| Entrées | Foie gras de canard maison 21 € ; Risotto de Saint-Jacques au riz noir 21 € ; Rouget en vinaigrette 18 € ; L'os à moelle 9 € ; Œuf cocotte à la bourguignonne 14 € |
| Plats | Pièce de boucher « Prix du marché » ; Poisson selon l'arrivage 26 € ; Suprême de pintade 24 € ; Porc et ail confit 24 € ; Dhal aux trois lentilles 21 € (végétarien) ; Menu enfant 16 € (jusqu'à 10 ans : un plat et un dessert) |
| À partager | La Libanaise 45 € ; La Charcuterie 45 € ; La Mer 45 € ; Houmous 12 € |
| Desserts | Crème brûlée à la vanille de l'île Maurice 10 € ; Tarte aux fruits de saison 9 € ; Le Gourmand 11 € ; Brioche perdue 10 € ; Figues rôties au miel 10 € |

Ces prix concordent avec la synthèse « Entrées de 9 à 21 € · plats de 21 à 26 € · menu enfant 16 € ».

Ce qui a gêné :
- **Plats trop bas sur téléphone.** La grande photo et l'introduction repoussent les plats : le premier prix lisible arrive au 4e geste.
  Captures : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/carte-390x844/etape-4.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/carte-390x844/etape-6.jpg`
- **Barre d'onglets fixe défaillante (téléphone et ordinateur).**
  - Quand l'en-tête se cache, une bande du contenu reste visible au-dessus de la barre.
  - Des descriptions de plats sont coupées en deux par la barre.
  - Sur téléphone, cette barre et la barre « Appeler / Réserver » mangent environ 30 % de l'écran.
  Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/carte-390x844/etape-14.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/carte-390x844/etape-16.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/carte-1440x900/etape-5.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/carte-1440x900/etape-11.jpg`
- **« À partager » en double.** C'est à la fois un onglet et un filtre, ce qui est déroutant.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/carte-390x844/etape-4.jpg`
- **Rubrique « À partager » incohérente.** L'introduction dit « Planches pour 4 personnes. Supplément de 10 € par personne en plus. Pour deux : 25 €. », mais le Houmous à 12 € est une « Assiette de houmous ». Et « Pour deux : 25 € » est ambigu : par planche ou par personne ?
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/carte-1440x900/etape-9.jpg`
- **Onglet actif en retard (ordinateur).** L'onglet actif reste sur « Nos entrées » alors que « Nos plats » est déjà à l'écran.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/carte-1440x900/etape-5.jpg`
- **Quelle carte ?** « La carte de la semaine » apparaît sous « Le déjeuner » sur l'accueil et sous « Le dîner » sur la page Carte, avec les mêmes plats. Le bouton « Voir la carte au déjeuner » laisse pourtant croire qu'elles diffèrent. On ne sait plus quelle carte on lit.

### 7. Demander une réception (baptême, environ 40 personnes, au printemps)

**Accès.** Il est très bon sur téléphone : le bouton du premier écran mène directement au formulaire en trois étapes. Sur ordinateur, il faut passer par « Réceptions » puis « Demander une réception ».

Ce qui a gêné :
- **Date précise obligatoire.** Claire sait seulement que ce sera « au printemps ». Sans date, le formulaire bloque avec « À compléter pour continuer ». Elle a dû inventer une date (dimanche 18 avril 2027). Le champ affiche en plus mm/dd/yyyy, au format américain.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reception-sans-date-390x844/etape-7.jpg`
- **Ni capacité ni prix.** Sur la page Réceptions, rien n'indique combien de personnes chaque espace peut accueillir, ni un prix ou un exemple de menu de réception. Claire ne sait pas si 40 invités tiennent dans la salle, ni quel budget prévoir. Il manque aussi une indication de saison : la terrasse et la piscine ne sont ouvertes que de juin à septembre, donc au printemps, seule la salle convient.
  Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reception-page-390x844/etape-5.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reception-page-1440x900/etape-4.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reception-page-1440x900/etape-6.jpg`
- **Titre tourné vers le mariage.** Le titre de la page est « Recevoir pour un mariage ». Pour un baptême, on se demande si la page nous concerne. De plus, la photo « Baptêmes » de la rubrique « Ce que l'on fête ici » montre seulement une piscine.
  Captures : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reception-page-1440x900/etape-2.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reception-page-1440x900/etape-8.jpg`
- **Formulaire pré-réglé sur « Mariages ».** Il faut changer l'occasion.
- **Récapitulatif imprécis.** La carte récapitulative indique « Baptêmes » au pluriel pour un seul événement, et la date « dimanche 18 avril » sans l'année. Le tampon « DEMANDE REÇUE » est clair.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reception-390x844/etape-17.jpg`
- **« Merci » hors de l'écran.** Après l'envoi sur téléphone, le message de remerciement est sous le bas de l'écran ; il faut défiler pour le voir.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reception-suite-390x844/etape-14.jpg`
- **Bande claire au-dessus du formulaire.** Après le saut vers le formulaire, une bande beige de la section précédente reste en haut de l'écran.
  Captures : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reception-1440x900/etape-3.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reception-390x844/etape-2.jpg`

## Corrections recommandées (de la plus importante à la moins importante)

1. **Premier écran du téléphone : dire qui et où.** Ajouter, comme sur ordinateur, « Les Jardins de l'Hacienda · Restaurant et réceptions · Moineville, entre Metz, Thionville et le Luxembourg », avec une ligne sur le chef et la carte de saison.
2. **Formulaire de réception : accepter une période.** Remplacer la date obligatoire par une période (mois ou saison), ou ajouter une case « date flexible ». Afficher les dates au format jj/mm/aaaa.
3. **Page Réceptions : donner les chiffres utiles.** Indiquer la capacité de chaque espace (repas assis, cocktail), un ordre de prix par personne ou un exemple de menu, et la saison d'ouverture de chaque espace. Remplacer le titre « Recevoir pour un mariage » par un titre qui couvre toutes les occasions (mariage, baptême, anniversaire…).
4. **Raccourcir la réservation.**
   - Partir du prochain service du soir quand on vient de « Réserver un dîner ».
   - Afficher plus haut le raccourci « Samedi 14 · soir » de l'accueil.
   - Fusionner « Vérifier » et « Confirmer ».
   - Placer le message d'erreur sous le champ concerné.
   - Placer « Choisir ma table » avant la confirmation.
   - Ne plus barrer les choix une fois la réservation confirmée.
5. **Page Carte sur téléphone.**
   - Réduire la photo et l'introduction pour que les premiers plats apparaissent dès le 2e écran.
   - Coller la barre d'onglets tout en haut quand l'en-tête se cache, sans contenu visible au-dessus.
   - Retirer le filtre « À partager », qui fait doublon avec l'onglet.
6. **Horloges.** Ne pas afficher une grande « 12:00 » à côté de « Fermé · ouvre à 12 h ». Soit l'horloge de l'en-tête donne l'heure réelle partout, soit elle porte un libellé (« à midi », « le soir »). Les heures du menu (12:00 Accueil, 23:00 Les fêtes, 19:00 Réceptions…) ressemblent à des horaires et ne sont pas dans l'ordre.
7. **Page Les fêtes.**
   - Nommer chaque prix dans le bandeau : « Saint-Sylvestre 120 € (170 € avec accords) · Noël 79 € ».
   - Rendre lisibles les plats du menu de Noël, aujourd'hui en gris très pâle tant qu'on n'a pas soulevé les cloches.
     Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/fetes-1440x900/etape-8.jpg`
   - Corriger « J-51 » (voir plus bas).
8. **Accueil sur ordinateur.** Remonter « Réserver une table » et « Demander une réception » dans le premier écran.
9. **Infos pratiques sur téléphone.** Placer le tableau des horaires de la semaine avant le cadran décoratif. Préciser s'il s'agit des horaires d'hiver.
10. **Rubrique « À partager ».** Clarifier « Planches pour 4 personnes… Pour deux : 25 € » et la place du Houmous à 12 €.
11. **Finitions.**
    - Empêcher la coupure de « 14 h 30 » sur ordinateur et de la référence « R-… » sur téléphone.
    - Raccourcir le passage figé de « Recevoir, le soir venu ».
    - Remplacer l'image floue des pool parties.
    - Supprimer la bande vide sous le pied de page sur téléphone et la bande vide au-dessus de « 12 h 30 ».
    - Écrire « Baptême » au singulier sur le récapitulatif.
    - Harmoniser l'espace avant « ? » (« Combien serez-vous? », « Quel service? » contre « Quel jour ? »).
12. **Avant la mise en ligne.** Remplacer les photos « Illustration générée » par de vraies photos, et compléter les mentions légales et la politique de confidentialité (affichées « à compléter »).

## Ce qui m'a paru faux, incohérent ou cassé

- **Compte à rebours faux.** La page Les fêtes affiche « J-51 » pour la Saint-Sylvestre, alors que l'accueil indique « Dans 50 jours ». Du 11 novembre au 31 décembre, il y a 50 jours : « J-51 » est faux.
  Captures : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/fetes-1440x900/etape-2.jpg` et `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/distinction-390x844/etape-36.jpg`
- **« 12:00 » à 0 h 30.** La grande horloge affiche 12:00 alors que la visite a lieu à 0 h 30, à côté de « Fermé · ouvre à 12 h ». Les horloges de l'en-tête diffèrent selon la page.
- **Bande claire à droite sur ordinateur.** Les images pleine largeur et les sections sombres s'arrêtent à environ 15 px du bord droit, laissant une bande claire. Il s'agit peut-être de la place réservée à la barre de défilement ; elle se verrait sur un Mac.
  Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/arrivee-1440x900/etape-0.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/distinction-1440x900/etape-21.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/venir-1440x900/etape-6.jpg`
- **Barre d'onglets de la carte.** Une bande de contenu reste visible au-dessus de la barre fixe et des descriptions sont coupées (voir mission 6).
- **Réservation confirmée qui paraît annulée.** Sur ordinateur, les choix sont barrés après la confirmation.
- **Bandeau des fêtes ambigu.** « 120 € le menu · 79 € par personne, hors boissons » mélange deux menus.
- **« Planches pour 4 personnes ».** Le Houmous à 12 € figure sous ce titre alors qu'il s'agit d'une assiette.
- **Dates au format américain.** 11/14/2026, 04/18/2027 et mm/dd/yyyy dans les champs de date. C'est peut-être le navigateur de test : à vérifier sur un vrai téléphone réglé en français.
- **Défauts d'affichage.**
  - « 14 h / 30 » coupé sur ordinateur.
  - Référence « R- / 1114-… » coupée sur téléphone.
  - Mention « Illustr… » coupée par le cadre arrondi.
  - Bande vide sous le pied de page sur téléphone.
  - Première carte du carrousel d'été déjà coupée.
  - Trait vers Metz inachevé sur le plan d'Infos pratiques (téléphone ; animation peut-être en cours).
- **Horaires contradictoires.** Le mardi est indiqué fermé dans le tableau, mais les journées festives d'été ont lieu le mardi, sans préciser qu'il s'agit d'horaires saisonniers.
- **Champs de maquette.** Les mentions légales et la politique de confidentialité sont « à compléter » (normal pour une maquette).

Rien de cassé côté liens : tous les boutons et liens essayés ont mené au bon endroit, et aucune erreur de page n'a été relevée par l'outil.

## Notes sur l'outil (pas des gênes de visiteur)

- `cliquer Sam 14` ne trouve rien : le libellé passe à la ligne. `cliquer Sam` fonctionne.
- `cliquer 20 h` ne trouve rien : le libellé contient une espace insécable. `cliquer 20` fonctionne.
- `remplir Nom=…` remplit le champ « Prénom », parce que l'étiquette contient « nom ». Il faut écrire `remplir ^Nom$=…`.

---

## Corrections faites après ce test (v6)

| Gêne relevée | Correction |
|---|---|
| Arrivée sur téléphone sans nom ni lieu | « Les Jardins de l'Hacienda · restaurant et réceptions à Moineville » sous la grande heure |
| « 12:00 » affiché à 0 h 30 à côté de « Fermé » | le statut dit l'heure réelle : « Il est 0 h 58 : fermé · ouvre à 12 h » ; la grande heure reste celle de la journée racontée |
| Heures du menu dans le désordre | menu dans l'ordre des heures (La carte 12:30, Réceptions 19:00, Les fêtes 23:00, Offrir 00:00) |
| Boutons sous la ligne de flottaison sur ordinateur | ouverture resserrée : les deux boutons dans le premier écran de 1000 × 560 à 1920 × 1080 |
| Date précise obligatoire pour une réception | une date, ou une période (« Au printemps 2027 », « Date à fixer ensemble ») |
| Formulaire pré-réglé sur « Mariages », « Baptêmes » au pluriel, date sans année | aucune occasion cochée d'avance ; le carton dit « Un baptême » et l'année |
| « Merci » hors de l'écran sur téléphone | la page défile jusqu'au merci |
| Ni capacité ni prix des réceptions | « Capacité de chaque espace et menus de groupe : sur demande, au 06 18 21 28 10 » (aucun chiffre dans le relevé) |
| Photo « Baptêmes » = une piscine | la vraie photo du baptême |
| Erreur « Indiquez votre nom. » sous l'e-mail | message sous son champ |
| Choix barrés après confirmation | choix lisibles, non barrés, une fois la table réservée |
| Référence coupée « R- / 1114-… » | référence sur une ligne |
| Barre des rubriques de la carte : bande au-dessus, descriptions coupées | la barre monte tout en haut quand l'en-tête se cache |
| Plats trop bas sur téléphone | photo d'ouverture plus courte |
| « À partager » à la fois onglet et filtre | le filtre est retiré |
| « Voir la carte au déjeuner » laisse croire à deux cartes | « Passer au déjeuner », « Passer au dîner » |
| Bandeau des fêtes « 120 € le menu · 79 € par personne » | « Saint-Sylvestre : 120 € le menu · Noël : 79 € par personne, hors boissons » |
| J-51 contre « Dans 50 jours » | jours de calendrier partout (J-50) |
| Menu de Noël illisible sous les cloches | texte lisible avant que la cloche se lève |
| Horaires de la semaine sous le cadran (téléphone) | horaires avant le cadran |
| « 14 h / 30 » coupé ; terrasse figée 3 à 4 écrans ; image floue des pool parties ; bande claire sous le pied de page ; vide au-dessus de « 12 h 30 » ; mention coupée par l'arche | heure sur une ligne ; terrasse plus courte ; vraie photo de la bouée licorne ; pied sombre jusqu'en bas ; vide réduit ; mention en haut de l'arche |

Non corrigé, et pourquoi :
- Dates au format américain (11/14/2026) : c'est le navigateur de test, réglé en anglais ; un téléphone réglé en français affiche jj/mm/aaaa (la page est déclarée en français).
- Bande claire de 15 px à droite sur ordinateur : la place de la barre de défilement, que le navigateur de test n'affiche pas ; sous Windows, la barre s'y dessine ; sur Mac au pavé tactile, aucune place n'est réservée.
- Réservation en deux temps (« Vérifier », puis « Confirmer ») et choix de la table après la confirmation : logique de réservation de la v5, à garder telle quelle.
- Capacités, prix des réceptions, horaires d'été : absents du relevé, à fournir par l'établissement (README).
- « Planches pour 4 personnes… Pour deux : 25 € » et le houmous à 12 € : texte du site actuel, gardé tel quel.

---

## Deuxième passage

Rejoué le mercredi 11 novembre 2026 vers 1 h 25 (heure de Paris), toujours dans la peau de Claire, avec `node _audit/visiteur.mjs`. J'ai regardé chaque capture. Les résultats sont dans les dossiers suffixés `-v2`.

Comment lire les mesures : un écran défilé ou un clic compte pour un geste ; les champs remplis sont comptés à part. Barème : la mission 1 sans aucun geste, les autres en 3 gestes au plus et en 30 s au plus.

### Tableau mission × format

| Mission | Format | Réussie ? | Gestes | Secondes | Chemin suivi |
|---|---|---|---|---|---|
| Arrivée (v2) | Téléphone | **Oui.** Le nom, la nature du lieu, la ville et les deux boutons sont dans le premier écran | 0 | 3,1 | Premier écran seul |
| Arrivée (v2) | Ordinateur | **Oui.** Le nom, la nature du lieu, le lieu (« entre Metz, Thionville et le Luxembourg »), le chef et les deux boutons sont dans le premier écran | 0 | 3,1 | Premier écran seul |
| Carte (v2) | Téléphone | **Oui, dans le barème** | 2 jusqu'aux fourchettes de prix ; **3 jusqu'au premier plat avec son prix** (Foie gras de canard maison 21 €) | 6,1 / 7,3 | Menu, « La carte », défiler 1 écran |
| Réception baptême « au printemps » (v2) | Téléphone | **Oui.** Demande envoyée sans date précise, mais **hors barème** (6 gestes) | 1 jusqu'au formulaire ; 6 jusqu'à l'envoi, + 7 champs | 15,5 | « Demander une réception » (premier écran), Baptêmes, défiler, Continuer, période « Au printemps 2027 » + 40 invités + un mot, Continuer, 4 champs, « Envoyer ma demande » |
| Réserver, 2 pers., samedi 20 h (v2) | Ordinateur | **Oui.** Confirmation obtenue, mais **hors barème** (7 gestes) | 1 jusqu'au formulaire ; 7 jusqu'à la confirmation, + 4 champs | 17,6 | « Réserver » (en-tête), Sam, Soir, défiler, 20 h, 4 champs, « Vérifier ma réservation », « Confirmer la réservation » |
| Réserver avec le nom oublié exprès (v2) | Ordinateur | Oui : l'erreur s'affiche sous le champ Nom | 6 jusqu'à l'erreur, + 3 champs | 15,5 | Même chemin, sans le nom, puis « Vérifier ma réservation » |

Référence affichée à la confirmation : R-1114-6308.

### Ce qui est corrigé et vérifié

- **Arrivée sur téléphone.** Sous la grande heure, on lit « Les Jardins de l'Hacienda · Restaurant et réceptions à Moineville ». Les boutons « Réserver une table » et « Demander une réception » sont dans l'écran.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/arrivee-v2-390x844/etape-0.jpg`
- **Arrivée sur ordinateur.** Tout tient dans le premier écran : nom, « restaurant et réceptions à Moineville, entre Metz, Thionville et le Luxembourg », la phrase du chef et les deux boutons.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/arrivee-v2-1440x900/etape-0.jpg`
- **Heure.** Le statut dit maintenant l'heure réelle : « Il est 1 h 23 : fermé · ouvre à 12 h ». On ne lit plus « il est midi et c'est fermé ».
- **Menu.** Les entrées sont dans l'ordre des heures : 12:00 Accueil, 12:30 La carte, 19:00 Réceptions, 23:00 Les fêtes, 00:00 Offrir, « Maintenant » Infos pratiques.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/carte-v2-390x844/etape-2.jpg`
- **Page Carte sur téléphone.**
  - Les fourchettes de prix (« Entrées de 9 à 21 € · plats de 21 à 26 € · menu enfant 16 € ») sont dans le premier écran, et le premier plat avec son prix arrive au 3e geste.
  - Quand l'en-tête se cache, la barre des rubriques monte tout en haut, sans bande de contenu au-dessus. Avec la barre « Appeler / Réserver », elle occupe environ 21 % de l'écran, contre 30 % au premier passage.
  - Le filtre « À partager » a disparu (il reste « Végétarien »).
  - Le bouton s'appelle maintenant « Passer au déjeuner ».
  Captures : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/carte-v2-390x844/etape-4.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/carte-v2-390x844/etape-6.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/carte-v2-390x844/etape-8.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/carte-v2-390x844/etape-10.jpg`
- **Formulaire de réception.**
  - Aucune occasion n'est cochée d'avance. Le carton affiche « Un baptême », puis « Au printemps 2027 · 40 invités » et le tampon « DEMANDE REÇUE ».
  - Après l'envoi, la page défile jusqu'au « Merci ! … le restaurant vous rappellerait pour préparer votre réception », qui est bien dans l'écran.
  Captures : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reception-v2-periode-390x844/etape-3.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reception-v2-390x844/etape-15.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reception-v2-390x844/etape-17.jpg`
- **Réservation sur ordinateur.**
  - Le message « Indiquez votre nom. » s'affiche sous le champ Nom, qui est entouré de rouge.
  - Une fois la table réservée, les choix ne sont plus barrés : « Soir », « 20 h » et « En salle » restent cerclés et les autres options sont estompées. On ne croit plus à une annulation.
  - La référence tient sur une ligne.
  Captures : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reserver-v2-erreur-1440x900/etape-9.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reserver-v2-1440x900/etape-16.jpg`

### Ce qui gêne encore

1. **La liste « Ou, si la date n'est pas fixée » est presque illisible** (téléphone et ordinateur). C'est la gêne principale de ce passage.
   - Elle s'affiche comme une liste blanche du navigateur, sans le style des autres champs. Elle mesure environ 20 px de haut, contre environ 48 px pour les autres.
   - Son texte crème sur fond blanc ne se lit pas : ni « Choisir une période » ni « Au printemps 2027 » une fois choisi.
   - Claire, qui cherche justement à dire « au printemps », risque de ne pas voir cette option. Elle remplirait alors une fausse date dans le champ « Date souhaitée », qui est placé avant et entouré de rouge.
   Captures : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reception-v2-periode-390x844/etape-6.jpg` (vide), `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reception-v2-periode-390x844/etape-9.jpg` (choisie), `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reception-v2-liste-1440x900/etape-4.jpg` (ordinateur)
2. **Trop de gestes pour réserver ou envoyer une demande.**
   - Réservation : 7 gestes. La page s'ouvre sur « Aujourd'hui / Midi » ; il faut choisir le samedi, puis le soir, puis « Vérifier », puis « Confirmer ».
   - Réception : 6 gestes, à cause de trois étapes avec « Continuer ».
   La correspondance a gardé ce choix exprès (logique de la v5), mais les deux missions restent hors barème.
3. **La grande heure de l'accueil.**
   - Le « 12:00 » du premier écran et la pastille « 12:00 » de l'en-tête restent plus visibles que la petite ligne « Il est 1 h 23 ». La confusion est bien moindre, mais l'œil lit d'abord « 12:00 ».
   - La pastille de l'en-tête change selon la page et le choix fait : 12:30 au début du formulaire de réservation, 20:00 après avoir choisi le soir, 20:30 sur la carte, 19:00 sur Réceptions.
   Captures : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/arrivee-v2-390x844/etape-0.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reserver-v2-1440x900/etape-2.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reserver-v2-1440x900/etape-16.jpg`
4. **Bande beige au-dessus du formulaire de réception.** Après le saut vers le formulaire (téléphone et ordinateur), une bande de la section précédente reste sous l'en-tête. Elle mesure environ 90 px quand on remonte d'un écran sur téléphone.
   Captures : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reception-v2-390x844/etape-17.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reception-v2-liste-1440x900/etape-4.jpg`
5. **Dates au format américain.** Les champs de date affichent mm/dd/yyyy, et la réservation affiche 11/14/2026. La correspondance l'attribue au navigateur de test ; c'est à vérifier sur un vrai téléphone réglé en français.
6. **« Réserver cette table » après la confirmation.** Le choix de la table est toujours placé sous la confirmation. Son bouton « Réserver cette table » laisse croire qu'on va faire une seconde réservation.
   Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reserver-v2-1440x900/etape-18.jpg`
7. **Ponctuation.** L'espace avant « ? » manque toujours dans « Quel jour? », « Quel service? », « Combien de personnes? », « À quelle heure? » et « Une demande particulière? ». Elle est présente dans « Tout est juste ? » et « Quelle occasion ? ».

### Nouveau et cassé

- **Liste des périodes illisible** (voir le point 1 ci-dessus). C'est le seul vrai défaut nouveau de ce passage.
- **Champ Prénom déformé quand l'erreur s'affiche.** Sur ordinateur, quand « Indiquez votre nom. » apparaît sous le champ Nom, le champ Prénom voisin s'étire : il devient plus haut (environ 70 px au lieu de 48 px) et descend, si bien que les deux champs ne sont plus alignés.
  Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reserver-v2-erreur-1440x900/etape-9.jpg`
- **Photo d'arrivée sur téléphone coupée pendant les premières secondes.** La photo montre une cassure horizontale : les palmiers sur le ciel en haut, puis un autre cadrage des bâtiments en dessous, en partie dédoublé. Vers 9 s, l'image redevient nette et entière. Ce défaut était déjà visible au premier passage, mais je ne l'avais pas signalé.
  Captures : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/arrivee-v2-390x844/etape-0.jpg` (3 s), `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/arrivee-v2-attente-390x844/etape-2.jpg` (6 s), `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/arrivee-v2-attente-390x844/etape-4.jpg` (9 s, nette)

Aucune erreur de page dans les journaux, aucun geste en échec, aucun lien cassé.

### Corrections faites après le deuxième passage

- Liste « Ou, si la date n'est pas fixée » : même champ que les autres (fond sombre, texte clair, 48 px de haut, flèche dessinée), options lisibles.
- Bande de la section précédente au-dessus du formulaire de réception : l'ancre #demande est posée à l'intérieur de la section (sa marge haute couvre l'espace sous l'en-tête).
- Champ Prénom étiré par l'erreur du champ Nom : les champs restent alignés en haut.
- « Réserver cette table » sous la réservation confirmée : le bouton du plan dit « Choisir cette table ».
- Photo de midi « cassée » pendant les premières secondes sur téléphone : l'eau en WebGL lisait le cadrage de l'ordinateur ; elle lit maintenant le cadrage réel de la photo affichée (et la photo prend bien le cadrage du téléphone).
- Gardé : l'espace avant « ? » est une espace fine insécable (typographie française), plus étroite que l'espace insécable des messages du module ; la pastille d'heure de l'en-tête suit l'heure de chaque page et du service choisi (c'est l'idée de la v6) ; la réservation en deux temps et la demande en trois étapes (logique gardée de la v5).
