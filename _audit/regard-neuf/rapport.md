# Regard neuf : Les Jardins de l'Hacienda, maquette v6 « De midi à minuit »

J'ai regardé le site comme un directeur artistique qui le découvre, à partir des captures, des films, du relevé et de la bibliothèque. Les captures ont été prises le mercredi 11 novembre 2026 vers 1 h 26 (heure de Paris), donc le site affiche ses variantes de nuit.

Sources :
- captures figées : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/` ;
- planches de films : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/films/` ;
- films de l'accueil : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/apercu/` ;
- pour les états après envoi, qui n'existent pas dans les captures figées : les captures du test visiteur, dans `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/`.

## Verdict

**L'idée se voit en 5 secondes sur l'accueil, et c'est un vrai progrès sur la v5.**
- La grande heure « 12:00 » ouvre la page, avec « Midi au bord de l'eau, *minuit au coin du feu.* ».
- Le fond change de température au fil du défilement : crème, puis abricot, crépuscule, indigo, et enfin brun de braise.
- Les heures en grand (12 h 30, 14 h 30, 19 h, 21 h, 23 h 30, Minuit) changent de couleur avec le jour.

**Les pages intérieures, elles, ne tiennent pas la promesse.**
- On n'y trouve que deux gabarits d'ouverture :
  - photo sombre plein cadre, gros chiffre orange et texte en bas à gauche ;
  - fond crème, photo en arche et chiffre fin bleu canard.
- Environ huit images reviennent d'une page à l'autre :
  - la pergola de nuit, quatre fois ;
  - la salle à la cheminée, quatre fois ;
  - le plat à la bougie, l'assiette de légumes, la coupe à la truffe et la piscine, chacune deux ou trois fois.
- Le fil horaire se contredit :
  - le voile annonce « 12:30 », puis la page s'ouvre sur « 20:30 » ;
  - le voile annonce « 21:00 Réserver », puis la page s'ouvre sur « 12:30 » ;
  - le menu du téléphone n'est pas dans l'ordre des heures.

**Ce que la v6 apporte de plus fort, ce sont trois gestes du métier :**
- le verre des accords de la Saint-Sylvestre ;
- le plan de salle ;
- le cadran « Ouvert maintenant ? ».

**Elle ressemble trop aux trois maquettes précédentes.**
- Même gabarit de héros.
- Mêmes modules : cadran de 24 h, formulaire en étapes à pastilles, récapitulatif latéral, barre basse.

---

## Les cinq questions

### 1. Qu'est-ce que le visiteur peut toucher ?

**Accueil**
- **L'eau de la piscine du héros**, qui ondule sous le doigt (« Passez la main sur l'eau » / « Touchez l'eau »). Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-01.jpg`.
- **Les ampoules de la pergola** à 19 h (« Touchez une ampoule »). Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-06.jpg`.
- **Les braises du coin du feu** (« Passez la main sur les braises »). Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-10.jpg`.
- **La mini-réservation de 21 h** : pastilles de service, couverts « – 2 + », bouton « Réserver cette table ». Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-09.jpg`.
- **La galerie de 14 h 30**, qui avance avec le défilement. On ne la manipule pas directement.

**La carte**
- Les onglets collants (« Nos entrées 5 », « Nos plats 6 », « À partager 4 », « Nos desserts 5 »).
- Le filtre « Végétarien » et la recherche.
- Le bouton « Passer au déjeuner », qui fait basculer la page du soir au midi.
- Un bouton pause pour la vapeur animée du héros.

**Réceptions**
- Le formulaire en trois étapes, avec ses pastilles pour l'occasion et l'espace.
- Le carton qui se remplit au fil des choix.
- Les panneaux « Trois lieux, deux saisons », qui s'élargissent.

**Les fêtes**
- L'interrupteur « Cet hiver / Cet été ».
- Les plats du menu de la Saint-Sylvestre : en touchant un plat, le verre prend la forme et la couleur du vin de l'accord. Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/les-fetes-1366-03.jpg`.

**Offrir**
- La carte dorée du héros, sur fond de braises.
- Le composeur : montant de 25 à 200 €, nombre de cartes, « Pour », « De la part de », petit mot. La carte s'écrit en direct.

**Réserver**
- Les tuiles de jour, le service, les couverts, les créneaux, l'installation.
- Le plan de salle en perspective, avec 12 tables cliquables et des filtres. Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/reserver-1366-05.jpg`.

**Infos pratiques**
- Le cadran de 24 h, dont on fait glisser l'aiguille.
- Les pastilles des jours et le curseur d'heure, qui affichent « Aujourd'hui à 1 h 30 : fermé ». Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/infos-pratiques-1366-02.jpg`.

**404**
- Rien d'autre que deux boutons.

**Bilan.** Il y a de la matière à manipuler sur toutes les pages, sauf la 404 et La carte, où l'on ne fait que filtrer une liste.

### 2. Qu'est-ce qui relie les pages entre elles ?

**L'intro.** Une horloge « 00:00 » roule jusqu'à l'heure de la page :
- 12:00 pour l'Accueil ;
- 12:30 pour La carte ;
- 23:00 pour Les fêtes ;
- 00:00 pour Offrir.

L'horloge rapetisse, glisse vers l'objet de la page, puis un disque (iris) découvre la page. Elle dure environ 2,3 s et se rejoue à chaque arrivée directe. Planches :
- `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/films/ouverture-1366.jpg`
- `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/films/ouverture-390.jpg`
- `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/films/ouverture-offrir-1366.jpg`

**Le voile de transition.** C'est une cloche (un disque) de la couleur de l'heure : brique pour 12:30, violet pour 19:00, indigo pour 21:00. L'heure et le nom de la page y sont écrits. Le voile reste plein écran environ 1 s. Planches :
- `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/films/transition-vers-la-carte-1366.jpg`
- `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/films/transition-la-carte-vers-receptions-1366.jpg`

**Le fil.**
- La pastille horaire de l'en-tête suit la page (12 00, 20 30, 19 00, 23 00, 00 00, 12 30, 01 26).
- Chaque page s'ouvre sur sa grande heure.
- Le menu du téléphone donne une heure à chaque rubrique.
- Le pied de page affiche « 00:00 » partout.
- Le retour arrière est un simple fondu de 110 ms : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/films/retour-arrière-1366.jpg`.

**Le principe est bon, mais le fil se contredit :**
- **La carte.** Le voile, l'intro et le menu disent « 12:30 », puis la page s'ouvre sur « 20:30 ». Planches :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/films/transition-vers-la-carte-1366.jpg` (voile « 12:30 » de 0,46 à 1,6 s, puis « 20:30 ») ;
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/films/ouverture-la-carte-390.jpg`.
- **Réserver.** Le voile dit « 21:00 Réserver », puis la page s'ouvre en « 12:30 Au déjeuner ». Sources :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/films/ancre-receptions-1366.jpg` ;
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/reserver-1366-01.jpg`.
- **Le menu du téléphone** n'est pas chronologique : 12:00, 12:30, **23:00 Les fêtes, 19:00 Réceptions**, 00:00, Maintenant. Source : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/apercu/accueil-telephone.mp4`, vers 27,5 s.

### 3. Que se passe-t-il quand on fait l'action principale ?

**Réserver une table**

Depuis l'accueil, à 21 h :
1. On choisit le service et le nombre de couverts.
2. « Réserver cette table » lance le voile « 21:00 Réserver ».
3. La page Réserver s'ouvre déjà remplie.

Sur la page Réserver :
1. On choisit le jour, le service et l'heure, on remplit 4 champs, puis on clique sur « Vérifier ma réservation ».
2. Le récapitulatif de droite devient « Tout est juste ? Samedi 14 novembre, 20 h » avec « Confirmer la réservation ».
3. Après confirmation, un petit ticket crème « RÉSERVÉ · Claire Testeuse · samedi 14 novembre · 20 h · 2 couverts » se pose au-dessus du cadre « Votre table est réservée · Référence R-1114-6308 ».

Sources : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reserver-v2-1440x900/etape-13.jpg` et `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reserver-v2-1440x900/etape-16.jpg`.

Le retour physique existe (le ticket), mais il est modeste et lent :
- il faut deux clics (Vérifier, puis Confirmer) ;
- le plan de salle arrive **après** la confirmation ;
- le ticket ne mentionne pas la table.

**Demander une réception**

1. Le visiteur choisit l'occasion et l'espace, puis la date (ou une période) et le nombre d'invités, puis ses coordonnées.
2. Le carton se remplit : « Un baptême · Au printemps 2027 · 40 invités ».
3. Un tampon rouge « DEMANDE REÇUE » s'y imprime, avec un message « Merci ! ».

Source : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reception-v2-390x844/etape-17.jpg`.

C'est le meilleur retour du site. En revanche, **au repos, le carton est un grand rectangle vide** (voir le point 14).

**Offrir**

La carte se compose en direct, puis le total s'affiche (« Total 50 € »). L'envoi « dans son enveloppe », annoncé dans le texte, n'apparaît dans aucune capture : je ne peux pas le juger.

### 4. Qu'est-ce qui est spectaculaire au premier défilement ?

**Accueil : six familles d'effets. La barre des trois est franchie.**

1. **Typographie qui fait l'événement et intro qui devient la page.**
   - L'horloge roule de 00:00 à 12:00, puis se pose dans le héros.
   - Les heures en grand changent de couleur avec le jour.
   - Source : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/apercu/accueil-ordinateur.mp4`, de 0 à 2,5 s.
2. **Objets manipulables** : l'eau, les ampoules, les braises.
3. **Galerie de côté épinglée** (14 h 30) : piscine, bar, journées festives, pool parties, puis le panneau « 19 h ».
   - Planche : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/films/epinglage-1.jpg`.
   - C'est le module le plus générique de la page, comme le note aussi la grille au point 6.
4. **Transition de lumière.**
   - La pergola passe du crépuscule à la nuit et les guirlandes s'allument au défilement.
   - Les lignes horaires 19 h, 19 h 45 et 21 h s'éclairent une à une.
   - Tout le fond de page suit la journée.
   - Captures : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-05.jpg` et `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-07.jpg`.
5. **Révélation plein écran.** Le cadre « Au coin du feu » s'ouvre jusqu'aux bords et le titre s'écarte.
   - Captures : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-10.jpg` et `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-11.jpg`.
6. **Comptes à rebours** : « Dans 50 jours », « Dans 44 jours ».

**Pages d'onglet**

| Page | Effets vus | Jugement |
|---|---|---|
| La carte | Intro horloge, vapeur animée sur la photo, onglets collants, « Les mains du chef » en fondu | **Trop sage.** Après le héros, ce n'est qu'une liste avec photos à gauche : un « modèle de restaurant ». |
| Réceptions | Mot qui tourne (« un mariage / un baptême / un pot de départ »), panneaux d'espaces qui s'élargissent, carton tamponné | Correct, mais le héros n'est qu'une photo réutilisée. |
| Les fêtes | Compte à rebours J-50, interrupteur hiver/été, verre des accords | **La meilleure page intérieure.** Le verre est un vrai geste du métier. |
| Offrir | Intro qui s'envole vers la carte dorée, braises, carte qui s'écrit | Correct, mais la carte du composeur est plate et la colonne gauche reste vide. |
| Réserver | Plan de salle en perspective, ticket « Réservé » | Bon objet, mal placé dans le parcours. |
| Infos pratiques | Phrase-horloge « Il est 01:26 à Moineville », cadran à aiguille | Bon, mais le plan « Venir » est indigent (deux traits et trois points). |
| 404 | Aucun | À faire. |

### 5. Chaque page a-t-elle sa signature ? (ouvertures côte à côte)

| Page | Photo d'ouverture | Composition | Verdict |
|---|---|---|---|
| Accueil | Piscine en plein soleil, voile crème à gauche | Heure fine bleu canard, bloc texte à gauche | Signature |
| La carte | Plat en sauce, verre et bougie (**même photo** que la section 21 h de l'accueil) | Moitié photo, moitié texte ; « 20:30 » blanc gras dans un cartouche | Gabarit de restaurant ; photo déjà vue |
| Réceptions | Pergola de nuit (**même photo** qu'Infos pratiques, 404 et la section 19 h de l'accueil) | Plein cadre sombre, grosse heure orange, bloc en bas à gauche | **Doublon** |
| Les fêtes | Salle à la cheminée assombrie (**même photo** qu'Offrir, « Au coin du feu » et l'espace 01 de Réceptions) | Plein cadre sombre, gros chiffre orange, bloc en bas à gauche | **Doublon d'Offrir** |
| Offrir | Même salle, avec la carte dorée à droite | Identique aux Fêtes, plus la carte | **Doublon des Fêtes** |
| Réserver | Assiette de légumes en arche (**même photo** que 12 h 30 sur l'accueil) | Arche à gauche, heure fine bleu canard à droite, fond crème | Copie de la section 12 h 30 de l'accueil |
| Infos pratiques | Pergola de nuit | Plein cadre sombre, phrase-horloge en ligne, bloc en bas à gauche | **Doublon de Réceptions** |
| 404 (téléphone seul) | Pergola de nuit | Plein cadre sombre, « 00:00 » orange, bloc en bas | **Troisième doublon** |

Pour comparer :
- ouvertures sur ordinateur : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/*-1366-01.jpg` ;
- ouvertures sur téléphone : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/*-390-01.jpg`.

Sur téléphone, Réceptions, Infos pratiques et 404 sont interchangeables. Il en va de même pour Les fêtes et Offrir.

**Ouvertures à refaire et pistes**

| Page | Nouvelle ouverture proposée |
|---|---|
| Infos pratiques | Faire du cadran de 24 h le héros, en plein écran, sur un ciel qui suit l'heure réelle (nuit à 1 h 26, plein jour à midi), avec « Il est 01:26 à Moineville · fermé, rouvre à 12 h » au centre. Pas de photo. |
| Offrir | Gros plan sur la carte dorée posée sur une nappe, braises floues derrière, carte au centre de l'écran. Ou bien une enveloppe kraft cachetée qui s'ouvre au défilement. Plus la salle vue de loin. |
| Les fêtes | Table de réveillon dressée devant la cheminée (coupes, bougies, nappe). Le « J-50 » devient un éphéméride dont les feuillets tombent. |
| Réceptions | Garder la pergola, mais **au crépuscule, guirlandes éteintes**. Elles s'allument quand le mot change (mariage, baptême…). L'image de nuit reste réservée à l'accueil. |
| 404 | La pergola dont les ampoules s'éteignent une à une jusqu'à « 00:00 ». |
| La carte | Une signature après le héros : par exemple « l'ardoise de la semaine », écrite à la craie, qui bascule midi/soir. Ou une table vue de dessus où les assiettes se posent au défilement, prix en regard. |

### Ressemblance avec les trois dernières maquettes

**Oui, nettement.**
- **Même gabarit de héros** que Lo Componaïro, QD2A et agence ae :
  - surtitre en capitales ;
  - titre à empattement avec une seconde ligne en italique colorée ;
  - deux boutons pilules, l'un plein, l'autre au trait ;
  - ligne d'état à pastille ;
  - indice « Touchez / Passez la main ».
- **Même barre basse** « Appeler / Réserver » et **même pied de page** « Confort de lecture ».
- **Modules repris :**
  - le cadran de 24 h des Infos pratiques reprend celui de Lo Componaïro (« On vous attend de 17 h à 20 h 30 ») ;
  - l'heure qui règle la lumière reprend le soleil d'agence ae ;
  - le formulaire en étapes à pastilles reprend agence ae et Coup de Food ;
  - le récapitulatif latéral reprend Myrtille ;
  - le plan de salle reprend « Plan de table » de L'œil singulier.

Sources : `/home/claude/kiwi570/bibliotheque-maquettes/medias/*/debut-p1440.jpg`, `/home/claude/kiwi570/bibliotheque-maquettes/medias/locomponairo-maquette/ce-soir-p1440.jpg`, `/home/claude/kiwi570/bibliotheque-maquettes/medias/agence-ae-maquette/contact-rendez-vous-p1440.jpg`.

---

## À corriger avant de livrer (défaut visible ou faux)

**1. Le voile et l'intro annoncent une autre heure que la page**
- Où : La carte et Réserver, sur ordinateur et téléphone.
- Sources :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/films/transition-vers-la-carte-1366.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/films/ouverture-la-carte-390.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/films/ancre-receptions-1366.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/reserver-1366-01.jpg`
- Problème :
  - le voile et l'intro disent « 12:30 La carte », puis la page affiche « 20:30 » ;
  - le voile dit « 21:00 Réserver », puis la page affiche « 12:30 Au déjeuner ».
  - L'idée même du site (« chaque page a son heure ») se dément sous les yeux du visiteur.
- Correction : calculer l'heure de la page **une seule fois**, avant le voile. La même valeur doit alimenter le voile, l'intro, la pastille de l'en-tête, le menu et le héros.

**2. Le menu du téléphone n'est pas dans l'ordre des heures**
- Où : toutes les pages, téléphone. Source : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/apercu/accueil-telephone.mp4`, vers 27,5 s.
- Problème : le menu affiche 12:00, 12:30, 23:00 Les fêtes, puis 19:00 Réceptions. Le pied de page du téléphone suit un troisième ordre : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-390-15.jpg`.
- Correction : un seul ordre partout, celui de l'en-tête de l'ordinateur :
  - 12:00 Accueil ;
  - 12:30 La carte ;
  - 19:00 Réceptions ;
  - 23:00 Les fêtes ;
  - 00:00 Offrir ;
  - Maintenant, Infos pratiques.

**3. Les heures sont écrites de deux façons, et les fêtes ont deux heures**
- Où : Accueil, ordinateur. Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-01.jpg` (« 12:00 ») ;
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-02.jpg` (« 12 h 30 ») ;
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-12.jpg` (« 23 h 30 »).
- Problème :
  - « 12:00 » voisine avec « 12 h 30 », « 14 h 30 », « 19 h », puis « Minuit » en toutes lettres ;
  - les fêtes valent « 23 h 30 » sur l'accueil, mais « 23:00 » dans la pastille, le menu et la page Les fêtes ;
  - le coin du feu, qui devrait être « 23 h » selon le brief, n'a pas d'heure.
- Correction :
  - une seule notation pour les heures-titres, de préférence « 12:00 » partout comme sur l'horloge ;
  - « 23:00 » sur « Au coin du feu » ;
  - « 23:00 » ou « 23:30 », mais identique, pour les fêtes sur l'accueil et sur la page ;
  - garder « Minuit » seulement en écho à « 00:00 ».

**4. La section « 21 h · Le dîner » propose d'abord un déjeuner**
- Où : Accueil, ordinateur et téléphone. Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-09.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-390-08.jpg`
- Problème :
  - sous le titre « Le dîner », la pastille « Mercredi 11 · midi » est présélectionnée ;
  - la pastille « Toute l'année », à côté du bouton « Réserver cette table », ne veut rien dire à cet endroit.
- Correction :
  - présélectionner le prochain soir (« Vendredi 13 · soir »), ou renommer la section en « Le prochain service » ;
  - remplacer « Toute l'année » par l'état réel (« Ce soir : fermé · prochain dîner vendredi »), ou la supprimer.

**5. « Au coin du feu » : titre illisible et encart posé sur le foyer**
- Où : Accueil, ordinateur et téléphone. Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-10.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-11.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-390-10.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-390-11.jpg`
- Problème :
  - « Au coin » est écrit en crème sur le mur crème : il disparaît ;
  - l'encart sombre « L'hiver, la salle se resserre… » recouvre le foyer et les tables, c'est-à-dire le sujet de la photo.
- Correction :
  - « Au coin » en couleur braise, comme « du feu », ou assombrir le mur de 35 % sous le titre ;
  - déplacer l'encart en bas à gauche, hors du foyer, sans boîte (texte sur dégradé).

**6. 19 h sur téléphone : chiffre et lignes illisibles**
- Où : Accueil, téléphone. Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-390-05.jpg`.
- Problème : « 19 h » orange sur un ciel orange ; les lignes « 19 h 45 » et « 21 h » sont grisées au point d'être illisibles pendant la montée.
- Correction :
  - dégradé sombre sur le bas de la photo, sous le texte ;
  - les lignes à venir restent au moins à 60 % d'opacité ;
  - le chiffre « 19 h » prend un liseré ou passe en crème tant que le ciel est clair.

**7. Les mêmes photos reviennent sur toutes les pages**
- Où : tout le site.
- Inventaire :

| Photo | Nombre | Captures |
|---|---|---|
| Pergola de nuit | 4 | `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-07.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/receptions-1366-01.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/infos-pratiques-1366-01.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/404-390-01.jpg` |
| Salle à la cheminée | 4 | `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-11.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/les-fetes-1366-01.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/offrir-1366-01.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/receptions-1366-02.jpg` |
| Plat, verre et bougie | 2 | `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-09.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/la-carte-1366-01.jpg` |
| Assiette de légumes | 2 | `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-02.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/reserver-1366-01.jpg` |
| Coupe à la truffe | 2 | `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-12.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/les-fetes-1366-04.jpg` |
| Houmous | 2 | `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/la-carte-1366-05.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/les-fetes-1366-05.jpg` |
| Piscine | 3 | `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-01.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-04.jpg`, `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/receptions-1366-03.jpg` |

- Problème : la maison semble n'avoir que huit photos, et les pages se ressemblent.
- Correction :
  - une photo d'ouverture propre à chaque page (pistes de la question 5) ;
  - sur l'accueil, n'utiliser que des images qu'on ne retrouve pas en ouverture des pages ;
  - pour « Les soirées passées », une vraie photo de la soirée libanaise plutôt que le houmous de la carte.

**8. Ouvertures en double**
- Où : Réceptions, Infos pratiques et 404 d'un côté ; Les fêtes et Offrir de l'autre. Voir le tableau de la question 5.
- Correction : refaire au minimum Infos pratiques, Offrir et la 404, selon les pistes ci-dessus.

**9. Les fêtes : la photo d'ouverture tire la page vers le bas**
- Où : Les fêtes, ordinateur et téléphone. Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/les-fetes-1366-01.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/les-fetes-390-01.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/films/ouverture-les-fetes-1366.jpg`
- Problème : l'image est assombrie jusqu'à la boue. On ne voit ni le feu ni la fête. Le héros de la page la plus festive est le plus terne du site.
- Correction : une image de réveillon lumineuse (feu net, bougies, coupes, nappe blanche). Assombrir seulement le quart bas gauche, sous le texte.

**10. Plan de salle : la barre collante masque la liste**
- Où : Réserver, ordinateur. Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/reserver-1366-05.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/reserver-1366-06.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/reserver-1366-07.jpg`
- Problème :
  - l'encart « Choisissez une table libre… / Réserver cette table » recouvre successivement Table 1, Table 9, Table 10 et Table 11 ;
  - le bouton bordé de rouge pâle a l'air désactivé.
- Correction :
  - ancrer l'encart sous la liste, ou réserver sa hauteur en marge basse de la liste ;
  - bouton plein une fois une table choisie, intitulé « Choisir la table 4 ».

**11. Le choix de la table arrive après la confirmation**
- Où : Réserver, ordinateur et téléphone. Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/reserver-1366-04.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reserver-v2-1440x900/etape-18.jpg`
- Problème :
  - « Choisir ma table (facultatif) » se trouve sous « Vérifier ma réservation » ;
  - le récapitulatif n'a pas de ligne « Table » ;
  - après confirmation, le bouton du plan laisse croire qu'on va faire une seconde réservation.
- Correction :
  - placer le plan entre « Où souhaitez-vous vous installer ? » et « Vos coordonnées » ;
  - ajouter « Table : n° 4, baies vitrées » au récapitulatif et au ticket « Réservé » ;
  - fusionner « Vérifier » et « Confirmer » en un seul bouton.

**12. Réserver : « VOTRE RÉSERVATION » deux fois côte à côte, et un avertissement en guise d'introduction**
- Où : Réserver, ordinateur. Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/reserver-1366-02.jpg`.
- Problème :
  - même surtitre à gauche et dans le récapitulatif de droite ;
  - la phrase d'ouverture de la section est « Réservation simulée : rien n'est envoyé dans cette maquette. ».
- Correction :
  - à gauche, garder seulement « Le jour, l'heure, les couverts » ;
  - introduction utile : « Le midi du mercredi au dimanche (sauf samedi), le soir vendredi et samedi. » ;
  - l'avertissement passe en petit, sous le bouton.

**13. Réserver sur téléphone : vide sous le héros et photo hors sujet**
- Où : Réserver, téléphone et ordinateur. Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/reserver-390-01.jpg` (environ 130 px vides entre « 06 18 21 28 10 » et la photo suivante)
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/reserver-1366-02.jpg`
- Problème : la photo de la section montre une table en verre sur pied en racine, une chaise et un parquet. On dirait un catalogue de meubles, pas une salle de restaurant.
- Correction : supprimer cette photo (le plan de salle suffit), ou la remplacer par la salle dressée. Resserrer l'espace sous le héros.

**14. Réceptions : le carton est un grand rectangle vide au repos**
- Où : Réceptions, ordinateur et téléphone. Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/receptions-1366-04.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/receptions-1366-05.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/receptions-390-05.jpg`
- Problème :
  - environ 420 × 280 px de crème, avec « LES JARDINS DE L'HACIENDA — — » ;
  - sur ordinateur, le carton est en bas à gauche, loin des pastilles qui le remplissent (colonne de droite) ;
  - sur téléphone, il s'intercale entre les étapes et les choix.
- Correction :
  - pré-écrire le carton en gris (« Votre fête · à la date de votre choix · vos invités »), que les choix remplacent ;
  - sur ordinateur, le placer à côté des pastilles ;
  - sur téléphone, sous les pastilles, réduit à une bande.

**15. Réceptions : liste « période » blanche et date au format américain**
- Où : Réceptions, téléphone. Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/visiteur/reception-v2-periode-390x844/etape-9.jpg`.
- Problème :
  - le champ « Ou, si la date n'est pas fixée » est un menu natif blanc, au texte gris pâle à peine lisible, dans un formulaire sombre ;
  - « mm/dd/yyyy » s'affiche dans le champ de date.
- Correction :
  - styliser ce menu comme les autres champs ;
  - imposer `lang="fr"` et un affichage jj/mm/aaaa (ou des pastilles de mois) ;
  - vérifier sur un téléphone réglé en français.

**16. Numéro de téléphone coupé en fin de ligne**
- Où : Offrir, ordinateur. Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/offrir-1366-03.jpg`.
- Problème : « appelez-nous au 06 18 21 28 » en fin de ligne, puis « 10. » à la ligne suivante.
- Correction : espaces insécables dans tous les numéros (06 18 21 28 10), sur tout le site.

**17. Le houmous rangé sous « Planches pour 4 personnes »**
- Où : La carte, ordinateur et téléphone. Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/la-carte-1366-05.jpg`.
- Problème : l'introduction « Planches pour 4 personnes… Pour deux : 25 € » couvre aussi « Houmous 12 € », qui est une assiette.
- Correction : sortir le houmous des planches (sous-titre « Et aussi »), ou réécrire l'introduction : « Planches pour 4 (45 €), houmous à l'assiette ».

**18. Écarts avec le relevé (textes non sourcés et emphase)**
- Où : Les fêtes et La carte. Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/les-fetes-1366-03.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/la-carte-1366-04.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/la-carte-1366-05.jpg`
- Problème : ces textes sont absents du relevé.

| Texte du site | Ce que dit le relevé |
|---|---|
| « Velours de foie gras · Éclats de truffe noire » | « velours de foie gras », sans truffe |
| « Esturgeon délicatement poché » | « esturgeon poché » |
| « Filet de bœuf d'exception » | « filet de bœuf aux morilles, jus au café » |
| « Crémeux de yuzu et meringue délicatement brûlée » | « sablé breton au yuzu » |
| « Assortiment de charcuteries italiennes » | rien |
| « Menu enfant · Jusqu'à 10 ans : un plat et un dessert » | rien |
| « Supplément de 10 € par personne… Pour deux : 25 € » | rien |

  - « délicatement » apparaît deux fois sur le même menu ;
  - « d'exception » est de l'emphase de brochure.
- Correction :
  - s'en tenir au libellé du relevé : « Velours de foie gras », « Esturgeon poché, sauce citronnée au caviar et lentilles Béluga », « Filet de bœuf aux morilles, jus au café », « Sablé breton au yuzu » ;
  - pour la carte, vérifier chaque détail sur le site actuel ; ce qui n'y figure pas est retiré ou marqué « à confirmer » dans le README.

**19. Soirées passées barrées**
- Où : Les fêtes, ordinateur et téléphone. Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/les-fetes-1366-06.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/les-fetes-390-05.jpg`
- Problème : « Soirée libanaise » et « Le Grand Buffet » sont barrés. On lit « annulé », pas « a eu lieu ».
- Correction : retirer le barré. La pastille « A EU LIEU » et une date en gris suffisent.

**20. Soirées passées : une seule photo et un grand vide à droite**
- Où : Les fêtes, ordinateur. Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/les-fetes-1366-05.jpg`.
- Problème :
  - une vignette de 230 px à gauche (le houmous de la carte), puis plus de 900 px de noir à droite ;
  - au-dessus, une bande crème vide d'environ 150 px sous le menu de Noël.
- Correction :
  - deux visuels côte à côte, un par soirée (libanaise, grand buffet), sur toute la largeur ;
  - supprimer la bande crème vide.

**21. Offrir : colonne gauche vide et trois dessins de carte cadeau**
- Où : Offrir et Accueil, ordinateur. Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/offrir-1366-02.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/offrir-1366-03.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/offrir-1366-01.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-13.jpg`
- Problème :
  - sous l'aperçu de la carte, environ 500 px vides pendant qu'on remplit le formulaire à droite ;
  - la carte a trois dessins différents :
    - dorée « 100 € · Pour une soirée aux Jardins » sur l'accueil ;
    - dorée « 50 € · Les Jardins de l'Hacienda » dans le héros d'Offrir ;
    - ambre « 50 », chiffre à empattement, dans le composeur.
- Correction :
  - l'aperçu reste collé (sticky) au centre de la colonne gauche pendant tout le formulaire ;
  - un seul objet carte, la dorée du héros, réutilisé dans le composeur avec le nom, le mot et le montant qui s'y écrivent.

**22. Infos pratiques : le cadran flotte dans le vide**
- Où : Infos pratiques, ordinateur. Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/infos-pratiques-1366-02.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/infos-pratiques-1366-03.jpg`
- Problème : le cadran commence 400 px sous le titre. Au-dessus, la colonne gauche est vide sur un écran entier ; en dessous, encore environ 400 px de vide.
- Correction : aligner le haut du cadran sur « Ouvert maintenant ? » et le garder collé pendant que la liste des jours défile.

**23. Plan schématique : le trait vers Metz n'atteint pas le point**
- Où : Infos pratiques et Accueil, ordinateur. Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/infos-pratiques-1366-04.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-13.jpg`
- Problème : la ligne s'arrête environ 15 px avant le point « Metz ». Celle de Thionville touche le sien.
- Correction : prolonger la ligne jusqu'au point, et ajouter les durées (« Metz 25 min », « Thionville 20 min », « Luxembourg 45 min ») une fois vérifiées.

**24. L'intro rapetisse puis regrossit**
- Où : toutes les pages, ordinateur et téléphone. Sources :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/apercu/accueil-ordinateur.mp4`, de 1,5 à 2,1 s ;
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/films/ouverture-390.jpg`, de 1 483 à 2 154 ms ;
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/films/ouverture-la-carte-390.jpg`.
- Problème :
  - l'horloge tombe à environ 20 px, seule sur un écran vide pendant 0,5 s, puis réapparaît à 80 px dans le héros. On croit à un bug ;
  - aux Fêtes, « 23:00 » devient « J-50 » : l'objet ne correspond plus.
- Correction :
  - faire voler l'horloge directement à la taille et à la place exactes de l'heure du héros, sans rétrécir, avec l'iris qui s'ouvre autour d'elle ;
  - aux Fêtes, l'intro roule jusqu'à « J-50 » (ou le héros affiche « 23:00 » et le « J-50 » vient dessous).

**25. Tablette : le surtitre du héros déborde sur la photo**
- Où : Accueil, tablette. Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-768-01.jpg`.
- Problème :
  - « RESTAURANT ET RÉCEPTIONS À » passe sur le palmier, avec un contraste faible ;
  - le texte courant est posé sur l'eau claire ;
  - les palmiers de gauche sont fantomatiques sous le voile crème.
- Correction : limiter la colonne de texte à 60 % de la largeur, couper le surtitre en deux lignes, et monter le voile crème à 70 % d'opacité sous le bloc texte uniquement.

**26. Faute de sens sur Réceptions**
- Où : Réceptions, tablette (et ordinateur si le texte y apparaît). Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/receptions-768-01.jpg`.
- Problème : « la maison se dresse pour vous, en hiver comme en été ». Une maison ne « se dresse » pas pour quelqu'un.
- Correction : « la maison dresse la table pour vous, l'hiver comme l'été ».

**27. Prix des fêtes sur téléphone : point orphelin**
- Où : Les fêtes, téléphone. Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/les-fetes-390-02.jpg`.
- Problème : « 120 € le menu · » finit sur un point médian, avant « 170 € avec l'accord mets et vins » à la ligne.
- Correction : deux lignes sans séparateur sur téléphone, ou une espace insécable avant le point médian.

**28. Recherche de La carte : texte indicatif coupé**
- Où : La carte, ordinateur. Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/la-carte-1366-02.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/la-carte-1366-03.jpg`
- Problème : « Chercher : girolles, Sair ».
- Correction : « Chercher un plat » ou « girolles, risotto… », ou élargir le champ.

**29. 23 h 30 : colonnes décalées et ordre inversé**
- Où : Accueil, ordinateur. Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-12.jpg`.
- Problème :
  - la colonne « Le menu de Noël » démarre environ 20 px plus bas que « La Saint-Sylvestre » : on ne sait pas si c'est voulu ;
  - on lit « Dans 50 jours », puis « Dans 44 jours ».
- Correction : aligner les deux colonnes et mettre Noël (25 décembre, dans 44 jours) avant la Saint-Sylvestre. Même ordre dans le sous-titre du héros des Fêtes (`/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/les-fetes-1366-01.jpg`).

---

## À améliorer (goût, force)

**A. La carte n'a pas de scène à elle**
- Où : La carte, ordinateur et téléphone. Captures : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/la-carte-1366-01.jpg` à `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/la-carte-1366-09.jpg`.
- Le héros moitié photo, moitié texte et la liste à pointillés forment le « modèle de restaurant » reproché à la v5.
- Le cartouche « 20:30 » blanc gras, posé sur l'assiette, ressemble à un code temporel de vidéo.
- Proposition :
  - une « ardoise de la semaine » écrite à la main, qui bascule midi/soir avec un vrai geste (tirer un rideau, tourner l'ardoise) ;
  - « 20:30 » dans le style de nuit du site (chiffre orange), hors de l'assiette.

**B. Trop de styles d'heure différents**
- On en compte cinq : fine bleu canard, grasse condensée orange, grasse blanche en cartouche, fine orange, fine grise.
- Proposition : deux styles seulement, un de jour (fine, bleu canard) et un de nuit (grasse, braise).

**C. Le voile reste plein écran 1 s sur une couleur unie**
- Planches :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/films/transition-vers-la-carte-1366.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/films/transition-la-carte-vers-receptions-1366.jpg`
- Proposition :
  - réduire à 500–600 ms ;
  - faire porter au voile un ciel qui passe de l'heure de départ à l'heure d'arrivée (dégradé jour → nuit), au lieu d'un aplat brique ou violet.

**D. La première image est l'été, en novembre**
- Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-01.jpg`.
- Le visiteur de novembre cherche la cheminée, qui n'arrive qu'au 10e écran.
- Proposition : de novembre à mars, midi s'ouvre sur la salle au soleil d'hiver (piscine au loin, « fermée jusqu'en juin »). L'interrupteur de saison des Fêtes existe déjà : l'appliquer à l'accueil.

**E. « 12:00 » en grand à 1 h 26 du matin**
- Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-01.jpg`.
- On lit « il est midi et c'est fermé ».
- Proposition : la nuit, l'intro s'arrête une demi-seconde sur l'heure réelle (« 01:26 · la maison dort »), puis roule jusqu'à 12:00 avec « Rendez-vous à midi ».

**F. La galerie de 14 h 30 est le module le plus banal de l'accueil**
- Sources :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-04.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/films/epinglage-1.jpg`
- Ce sont quatre vignettes égales avec des légendes de 11 px.
- Proposition : une seule image panoramique de l'après-midi que la caméra parcourt (piscine → bar → paillotes), avec l'ombre des palmiers qui tourne à mesure que l'heure avance de 14 h 30 à 19 h. Les légendes sont accrochées aux lieux, pas aux vignettes.

**G. Les cadres à bordure, refusés en v5, reviennent sur Réserver**
- Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/reserver-1366-02.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/reserver-1366-03.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/reserver-1366-05.jpg`
- Tuiles de jours, tuiles de créneaux, champs, récapitulatif, liste des tables : tout est encadré.
- Proposition : jours et créneaux en texte sur une ligne (sélection = pastille pleine), récapitulatif sans cadre en forme de ticket, liste des tables sans bordure.

**H. Le plan « Venir » est indigent face à la barre de la bibliothèque**
- Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/infos-pratiques-1366-04.jpg`
  - `/home/claude/kiwi570/bibliotheque-maquettes/palmares/planches/carte.jpg`
- Deux traits et trois points, face aux cartes à calques de Surf FM ou au globe de Stanislas.
- Proposition : une carte stylisée Metz–Thionville–Luxembourg (Moselle, A31, frontière), avec le trajet en voiture qui se trace au défilement et les durées.

**I. La 404 réutilise une photo et n'a aucun effet**
- Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/404-390-01.jpg`.
- Le texte est bon. Elle n'est capturée que sur téléphone.
- Proposition : les ampoules de la pergola s'éteignent une à une, l'horloge s'arrête sur 00:00 ; « Revenir à midi » rallume tout.

**J. Le badge « Illustration générée » est partout**
- Il apparaît jusqu'à quatre fois par écran, sur la galerie et les espaces. Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-04.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/receptions-1366-02.jpg`
- Proposition : un seul badge, plus petit, par section ou par photo d'ouverture, et une ligne dans le pied de page. Il faut rester honnête sans brouiller l'image.

**K. Les vraies photos jurent avec les images générées**
- Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/infos-pratiques-1366-05.jpg` (terrasse violette, granuleuse)
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/receptions-1366-03.jpg` et `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/receptions-1366-04.jpg` (photo « Anniversaires » floue, gros plan d'un verre ; « Baptêmes » qui a l'air d'une photo de banque d'images)
- Proposition :
  - étalonner les vraies photos dans la même chaleur, ou choisir une photo de terrasse en lumière chaude ;
  - pour « Anniversaires », une table dressée ou un gâteau, sur place.

**L. Le mot qui tourne dans le héros de Réceptions**
- Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/receptions-1366-01.jpg`.
- Pris en pleine bascule, l'italique « un pot de départ » flotte plus bas que « Recevoir pour », à 30 % d'opacité, posé sur la table de la photo.
- Proposition : bascule verticale sur la même ligne de base, sans fondu sous 60 %.

**M. « Minuit » mélange Offrir et Venir**
- Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-13.jpg`.
- Une même section porte deux sujets.
- Proposition : « Minuit » = Offrir seul, en plein écran (la carte dorée qui brille dans le noir). « Venir » passe dans le pied de page, déjà en « 00:00 ».

**N. Accueil : petits vides**
- Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-03.jpg` : bande vide à droite de « Toute la carte », environ 150 px au-dessus de 14 h 30 ;
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-390-02.jpg` : bande vide au-dessus de « 12 h 30 », le visiteur croit la page finie.
- Proposition : resserrer, ou y placer les trois vignettes rondes.

**O. Les vignettes rondes reviennent**
- Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/accueil-1366-03.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/la-carte-1366-08.jpg`
- Les trois mêmes ronds reviennent comme décor.
- Proposition : les garder à un seul endroit.

**P. Ponctuation**
- Le point-virgule est collé au mot (« arrivée; ne », « d'abord; la table », « minuit; le midi »), alors que « ? » a bien son espace fine.
- Captures :
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/offrir-1366-03.jpg`
  - `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/reserver-390-01.jpg`
- Proposition : espace fine insécable avant « ; » et « ! » partout (« Merci ! »).

**Q. Le titre « Offrir une soirée » contredit son exemple**
- Capture : `/home/claude/v6/jardins-hacienda-2-maquette/_audit/regard-neuf/captures/offrir-1366-01.jpg`.
- L'exemple donné est « un déjeuner du dimanche ».
- Proposition : « Offrir une table aux Jardins », ou « Offrir un moment, de midi à minuit », qui reprend l'idée du site.

**R. Les mots du client**
- Le relevé cite « Au creux de la cheminée », l'expression du site actuel.
- Proposition : la reprendre en sous-titre de « Au coin du feu », pour que la maison se reconnaisse.

---

## Bien (à garder)

- **L'idée est lisible sur l'accueil** : grande heure, couleur du chiffre et température du fond qui suivent la journée, de la piscine à midi aux braises de minuit. C'est le saut que la v5 n'avait pas fait.
- **La pergola qui s'allume au défilement**, avec « Touchez une ampoule » et les lignes horaires (19 h, 19 h 45, 21 h) : une vraie transition de lumière, liée au métier de réception.
- **« Au coin du feu »**, le cadre qui s'ouvre en plein écran, une fois le titre et l'encart corrigés.
- **Le verre des accords de la Saint-Sylvestre** : le meilleur geste du site. Il est simple, juste, et il dit le métier.
- **Le plan de salle** en perspective, avec cheminée, bar, baies, terrasse indisponible en hiver et filtres : à garder, mais à placer avant la confirmation.
- **Le cadran « Ouvert maintenant ? »** et la phrase « Il est 01:26 à Moineville » : utiles et vivants.
- **Le carton de réception tamponné « DEMANDE REÇUE »** et le ticket « Réservé » : de vrais retours physiques.
- **Les données sont justes** :
  - adresse et téléphone ;
  - horaires (lundi et mardi fermés, samedi soir seul, dimanche 12 h–16 h) ;
  - prix de la carte (9–21 €, 21–26 €, enfant 16 €, planches 45 €) ;
  - Noël (79 €, menu exact) et Saint-Sylvestre (120 € et 170 €, DJ Laurent Geymet, vins) ;
  - carte cadeau (25 à 200 €, 6 mois) ;
  - journées festives, piscine, bar ;
  - acompte traité honnêtement (« le restaurant vous en donne le montant »).
- **Le texte de la 404** (« Cette page a fermé à minuit. La maison, elle, rouvre au prochain service. » et « Revenir à midi ») et la barre basse « Appeler / Réserver » sur téléphone.

---

## Suite donnée (v6)

Corrigé avant la livraison : 1 (une seule heure par page : voile, intro, horloge, ouverture), 2 (déjà corrigé avant ce regard : le menu suit l'ordre des heures ; le film de l'aperçu était antérieur), 3 (notation unique des heures, 23:00 sur le coin du feu, Les fêtes à 23:30 partout), 4 (prochain soir coché, « Toute l'année » retiré), 5 (titre lisible, légende hors du foyer), 6 (19:00 et étapes lisibles sur téléphone), 7 et 8 en partie (Infos pratiques, Offrir et la page fermée ont leur image ou leur cadrage), 9 (photo des Fêtes éclaircie), 12 (surtitre unique, introduction utile), 13 (photo de la salle recadrée sur les tables), 14 (carton pré-écrit), 15 (liste des périodes stylée ; le format mm/dd/yyyy vient du navigateur de test réglé en anglais), 16 (numéro insécable), 19 et 20 (soirées passées non barrées, mises à côté de leur photo), 24 (l'horloge de l'intro arrive à la taille de la grande heure), 25 (surtitre limité en tablette), 26 (« la maison dresse la table pour vous »), 27, 28, 29 (Noël avant la Saint-Sylvestre, colonnes alignées).

Gardé, et pourquoi :
- 10 (barre collante du plan de salle qui passe sur la liste) : comportement normal d'une barre collante sur fond plein ; 11 (plan après la confirmation, deux temps Vérifier puis Confirmer) : logique de réservation de la v5, à garder telle quelle ; le bouton du plan dit maintenant « Choisir cette table ».
- 17 et 18 (houmous sous « Planches pour 4 », détails de la carte et du menu de la Saint-Sylvestre absents du relevé résumé) : données de la carte et des fêtes de la v5, à garder ; listées dans le README pour vérification par l'établissement.
- 21 (aperçu de la carte cadeau) : il est déjà collant pendant le formulaire sur ordinateur ; les trois dessins de carte (accueil, ouverture, composeur) restent, le composeur étant le module gardé de la v5.
- 22 (cadran) : désormais collant à côté des horaires sur ordinateur ; 23 (trait vers Metz) : capture prise pendant que le trait se dessine au défilement, il finit sur le point.
- « À améliorer » : notés pour une version suivante (scène propre à La carte, ardoise de la semaine, vrai plan d'accès avec durées vérifiées, accueil d'hiver de novembre à mars, réduction des styles d'heure).
