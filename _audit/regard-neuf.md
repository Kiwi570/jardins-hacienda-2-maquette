# Regard neuf : maquette v4 des Jardins de l'Hacienda (10 novembre 2026)

Avis d'un directeur artistique qui n'a pas vu la construction, uniquement d'après les films, les captures et l'usage du site servi sur http://localhost:4321. Le code source n'a pas été lu (seules la largeur de page et la position de quelques éléments ont été mesurées dans le navigateur pour expliquer un défaut sur téléphone).

Matériel regardé :
- les films `_audit/apercu/accueil-ordinateur.mp4` et `accueil-telephone.mp4` (planches d'images extraites) et `_audit/apercu/planche.jpg` ;
- mes captures de l'accueil en hiver et en été, ordinateur 1440 × 900 et téléphone 390 × 844 (émulation mobile réelle), en défilant à la molette, avec des positions resserrées dans « La table se dresse » ; les ouvertures et signatures des cinq pages intérieures (hiver et été, ordinateur et téléphone) ; le parcours de réservation complet, le plan de salle, la carte cadeau, le cadran des horaires, le lien « Réserver la soirée » des fêtes ;
- le relevé `_audit/releve.md` (comparé au texte affiché des pages) ;
- les planches du palmarès (ouverture, carte, offre, appel, outil interactif) ;
- les accueils de Lo Componaïro, QD2A et agence ae ;
- la v3 du même client, servie en local sur le port 4330 depuis `/home/claude/jardins-hacienda-2-maquette`.

Toutes les captures citées sont dans `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/` (chemins complets ci-dessous ; les fichiers `m-*.jpg` sont des planches de plusieurs captures, les `z-*.jpg` des agrandissements).

---

## 1. Réponses aux cinq questions

### Qu'est-ce que le visiteur peut toucher ?

- **Accueil** : le cadran « Hiver / Été » (on fait glisser la braise vers le soleil, ou on touche les pastilles), et le petit bouton flamme/soleil de l'en-tête qui fait la même chose ; le statut « Fermé · ouvre demain à 12 h » (lien vers les horaires) ; le plateau du chef, qu'on attrape et qu'on lance (il tourne avec de l'inertie et met en avant la rubrique qui passe devant) ; le curseur « Combien serez-vous ? » et ses pastilles 2 / 12 / 40 / 120 (la table dessinée s'allonge, la mosaïque de photos change) ; les boutons des fêtes, de la carte cadeau et de l'itinéraire.
- **La carte** : l'ardoise écrite à la main et le bouton « Un plat végétarien ? » ; des onglets collants par rubrique ; deux filtres (Végétarien, À partager) et un champ de recherche par ingrédient.
- **Les fêtes** : les plats de la Saint-Sylvestre (toucher un plat change la forme et la couleur du verre et affiche l'accord : Champagne, blanc de blancs, Chablis premier cru, Pomerol ou Côte-Rôtie, Jurançon moelleux, vérifiés un par un) ; les cloches du menu de Noël, qui se soulèvent au défilement.
- **Réserver** : jours (fermés barrés), service, heures (complètes barrées), couverts + / –, salle ou terrasse (barrée hors saison), demandes particulières, coordonnées, récapitulatif collant avec des liens « Modifier » ; le plan de salle en perspective, ses filtres (coin du feu, baies vitrées, grande table, terrasse) et ses tables à choisir, avec « Réserver cette table » qui renvoie au formulaire avec « En salle · table 2 ».
- **Offrir** : montant, nombre de cartes, « Pour », « De la part de » et un petit mot, qui s'écrivent en direct sur la carte dorée ; « Offrir cette carte » glisse la carte dans une enveloppe.
- **Infos pratiques** : un cadran 24 h dont on fait glisser l'aiguille, des pastilles de jour et un curseur d'heure qui répondent « Vendredi à 20 h : ouvert » ; le gros numéro de téléphone ; un formulaire de demande.

Il y a beaucoup à toucher, et c'est le point fort de la maquette. Mais presque tout existait déjà dans la v3 (voir § 2).

### Qu'est-ce qui relie les pages entre elles ?

- **La saison** devait être le fil : le choix est gardé d'une page à l'autre. En pratique, dans les pages intérieures, seuls la couleur des boutons (orange devient jaune, ou bleu canard) et l'icône de l'en-tête changent. Les textes, les photos et les fonds restent ceux de l'hiver (capture `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-ouv-e-ord.jpg`).
- **La métaphore de la table et de la cloche**, qui est le vrai fil : la cloche dorée du chargement, le plateau, la nappe, le carton « Votre table », le plan de salle, « Offrir une table », les cloches de Noël, le carton « Réservé » à la confirmation. C'est juste, mais sous-exploité : la cloche de la confirmation passe sous l'en-tête, celles de Noël sont des pictogrammes plats.
- **La transition entre pages** : une assiette ronde qui s'ouvre sur la photo de la page suivante (`/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-transitions.jpg`). C'est réussi.
- **Les invariants** : l'en-tête, le statut « Fermé · ouvre demain à 12 h », la barre « Appeler / Réserver » sur téléphone, le pied de page, et les liens des fêtes qui transmettent la date au formulaire (`?date=2026-12-31&service=soir`). Ce dernier lien est cassé pour la Saint-Sylvestre (point 1 de la liste).

### Que se passe-t-il quand il fait l'action principale (réserver) ?

1. Le bouton « Réserver au coin du feu » de l'accueil mène en haut de /reserver : on voit un en-tête « Votre table » avec un carton qui s'écrit à la main. Il faut encore toucher « Choisir le jour » pour arriver au formulaire (`/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-resa1.jpg`).
2. Le formulaire est sérieux. Les jours fermés sont barrés (mardi 10, lundi 16), le soir est fermé le mercredi, les heures complètes sont barrées et le nombre de créneaux libres s'affiche. Le récapitulatif collant se remplit au fil de la saisie, et un oubli est signalé (« Choisissez une heure d'arrivée. »).
3. « Vérifier ma réservation » transforme le récapitulatif en « Tout est juste ? — Vendredi 13 novembre, 19 h » avec « Confirmer la réservation » (`/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-resa2.jpg`).
4. Après confirmation, un petit carton « Réservé — vendredi 13 novembre · 19 h — 2 couverts » tombe de biais au-dessus du récapitulatif. Une cloche claire passe derrière, en partie cachée par l'en-tête. Le panneau devient « Demande enregistrée », avec la référence R-1113-…, et le formulaire se grise (`/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-rafale.jpg`).
5. Par le plan, on touche une table : une bulle s'affiche (« Table 2, 4 places, au coin du feu, la plus proche du feu »), puis « Réserver cette table » remonte au formulaire avec la table notée (`/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-plan.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-plan2.jpg`).

Verdict : la mécanique est solide, mais le moment final est petit (un carton de 190 px dans un coin) et dit deux choses contraires (« Réservé » puis « Demande enregistrée »). Surtout, **la Saint-Sylvestre ne se réserve pas** et, en été, « Réserver en terrasse » mène à une page « au coin du feu » où la terrasse est barrée.

### Qu'est-ce qui est spectaculaire au premier défilement de l'accueil ?

Il y a au moins cinq familles d'effets modernes :
1. **Ouverture mise en scène** : une cloche dorée et le nom sur fond fumée, puis la cloche se lève sur le héros (film, 0 à 3 s). Dans les pages intérieures, une assiette ronde s'ouvre en guise de transition.
2. **Objet physique qu'on manipule** : le plateau tournant qu'on lance, avec inertie et vapeur sur les assiettes (`/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-plateau.jpg`).
3. **Scène épinglée pilotée par le défilement** : « La table se dresse ». Les assiettes se posent sur la nappe, une liste de quatre étapes s'allume, puis l'assiette principale se déforme et s'agrandit jusqu'à remplir la carte « Entrez dans la carte de la semaine ».
4. **Particules et compteurs** : des braises montent dans la section des fêtes, et les comptes à rebours défilent (« Dans 45 jours », « Dans 51 jours »).
5. **Changement de thème en direct** : le cadran Hiver / Été change la photo, les titres, les boutons et la couleur d'accent ; la table de réception s'allonge selon le nombre d'invités.

Mais **le premier écran est immobile** une fois la cloche levée : seul le petit cadran attend une action. L'effet le plus ambitieux, la table qui se dresse, est le plus raté (nappe vide, assiette octogonale, étapes désynchronisées). Le changement de saison est un fondu d'environ 300 ms, sans moment (`/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-bascule.jpg`).

### Chaque page a-t-elle sa signature après l'ouverture ?

| Page | Signature après l'ouverture | Verdict |
|---|---|---|
| Accueil | plateau à lancer, table qui se dresse, table de réception qui s'allonge | oui, mais la table qui se dresse est ratée |
| La carte | ardoise écrite à la craie, filtres et recherche | oui, identique à la v3 |
| Les fêtes | verre qui prend la forme du vin de l'accord, cloches de Noël | oui, identique à la v3 pour le verre ; cloches maladroites |
| Réserver | carton « Votre table », plan de salle 3D, carton « Réservé » | oui ; plan peu lisible, confirmation modeste |
| Offrir | carte dorée qui se compose en direct, enveloppe | oui, mais ouverture presque noire et enveloppe invisible |
| Infos pratiques | numéro géant, cadran « Ouvert maintenant ? » | oui, mais la mise en page du cadran est cassée (régression par rapport à la v3) |

Chaque page a une signature, mais toutes viennent de la v3 (`/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-v3-signatures.jpg`). La v4 n'ajoute que le cadran des saisons et le curseur des invités.

---

## 2. En une ligne

- **L'accueil ressemble-t-il aux trois dernières maquettes ?** Oui. On y retrouve le même plan de héros (petites capitales « métier · lieu », grand titre à empattements avec une ligne en italique, deux boutons, une ligne d'état précédée d'un point) et le même gadget accompagné d'une consigne manuscrite. « Faites glisser : braise ou soleil » répond au « Faites glisser le soleil » d'agence ae, « Attrapez le plateau et lancez-le » au « Attrapez le tapuscrit » de QD2A, et le plateau à quatre quarts à la roue à quatre clés de Lo Componaïro. La barre « Appeler / Réserver » est la même (`/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-biblio-p.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-biblio-m.jpg`).
- **Et à la v3 ?** Oui, à quatre cinquièmes. Même photo de héros, même plateau, même scène épinglée en quatre étapes, mêmes cartes de fêtes, même carte cadeau, même carte de géographie, même pied de page ; ouvertures et signatures intérieures identiques. La v4 ajoute le cadran et les invités, et perd le grand « Au creux de la cheminée », seule photo de la salle et du feu sur l'accueil (`/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-v3-a.jpg` face à `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-acc-h-ord-a.jpg`).
- **Le premier écran donne-t-il faim ?** En hiver, à moitié : la belle assiette de légumes est repoussée en bas à droite, sous le titre fantôme et le cadran, et c'est une garniture plus qu'un plat généreux. En été, non : une piscine, un pylône électrique et pas une assiette.

---

## 3. Ce qu'un client exigeant relèverait (du plus grave au moins grave)

### 1. La Saint-Sylvestre ne peut pas être réservée en ligne
- **Constat** : « Réserver la soirée » (fêtes et accueil) mène à /reserver?date=2026-12-31&service=soir. Le formulaire affiche « Jeudi 31 décembre », mais le service passe à « Midi » et « Soir » est barré, « fermé », puisque le jeudi n'est ouvert qu'à midi dans les horaires de la semaine. Le soir le plus cher de l'année (120 € / 170 €) est inaccessible, et rien ne propose le menu ni l'accord mets et vins. On arrive en plus en haut de page et non sur le formulaire.
- **Capture** : `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/cap/lien-fetes-service.jpg` (et `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/cap/lien-fetes-form.jpg`)
- **Correction** : déclarer les dates d'exception (31 décembre soir ouvert, 25 décembre midi en menu unique) au-dessus des horaires de la semaine. Quand on vient d'un lien de fête, ouvrir directement le formulaire et afficher un bandeau « Saint-Sylvestre · menu à 120 € » avec un choix « avec l'accord mets et vins (170 €) », l'acompte éventuel et les heures d'arrivée de la soirée. Faire de même pour Noël (menu à 79 €).

### 2. Sur téléphone, l'accueil est plus large que l'écran : le menu disparaît
- **Constat** : sur un vrai téléphone (émulation mobile), la page d'accueil mesure 500 px de large au lieu de 390. Les assiettes de « La table se dresse », qui attendent hors du cadre à droite, et le plateau débordent. Conséquences : le bouton « Menu » de l'en-tête est hors de l'écran (x = 415 à 484 px), le bouton flamme est coupé et « Réserver » est tronqué dans la barre du bas pendant les premiers écrans. La v3 et les autres pages n'ont pas ce défaut. Les films de l'audit ne le montrent pas, parce qu'ils n'émulent pas un téléphone.
- **Captures** : `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/cap/acc-h-tel-arrivee.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/z-tel-barres.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-pin-h-tel.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-tel-v3-v4.jpg`
- **Correction** : découper le débordement au niveau de chaque section (plateau, nappe) et pas seulement du corps de page. Faire partir les assiettes du bord de la nappe plutôt que de l'extérieur de l'écran. Ajouter à l'audit une vérification en émulation mobile : largeur intérieure de 390 px à chaque position de défilement.

### 3. « La table se dresse », l'effet phare, est raté
- **Constat** :
  - en entrant dans la section, la nappe reste un carré crème vide pendant deux à trois secondes de défilement (film, de 28 à 33 s) : on croit à une image qui n'a pas chargé ;
  - les étapes ne suivent pas l'image : « 02 Les produits de saison » s'allume quand il n'y a que les couverts, « 04 » s'allume pendant que les assiettes volent encore, 01 et 03 ne tombent jamais au bon moment ;
  - à mi-course, l'assiette principale devient un octogone à pans coupés posé sur le couteau, une photo prise de biais au milieu d'assiettes vues d'en haut ;
  - la photo finale, agrandie, est molle et jaunie ;
  - en été, l'assiette se transforme en photo de nuit de la paillote violette, toujours en octogone ;
  - l'épinglage dure près de deux écrans pour quatre étapes.
- **Captures** : `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-film-nappe.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-acc-h-ord-b.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/z-table.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/cap/acc-e-tel-03-y2164.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-acc-e-ord-a.jpg`
- **Correction** :
  - ne jamais montrer la nappe nue : elle arrive déjà dressée (couverts, verres) ;
  - lier chaque étape à un seul changement visible : 01 couverts, 02 trois coupelles de produits, 03 l'assiette, 04 l'ardoise des suggestions ;
  - remplacer la découpe en polygone par un cercle qui devient un rectangle arrondi, ou par un fondu ;
  - n'utiliser que des photos d'assiettes vues d'en haut et bien détourées, et une photo en haute définition pour l'agrandissement ;
  - en été, garder un plat d'été et non le bâtiment ;
  - ramener l'épinglage à un écran environ.

### 4. L'été est un costume : la promesse « au bord de la piscine » s'arrête à l'accueil
- **Constat** : en mode Été, seuls le héros, la section « Les journées au bord de l'eau » et la couleur des boutons changent. L'en-tête et le bas de l'accueil restent fumée et braise. La carte, les fêtes, Offrir et les Infos sont identiques à l'hiver. Pire : « Réserver en terrasse » ouvre une page « Votre table — au coin du feu » sur une photo de cheminée, où « En terrasse » est barré (« de juin à septembre »), puisqu'on est en novembre.
- **Captures** : `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-ete-resa.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-ouv-e-ord.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-acc-e-ord-b.jpg`
- **Correction** : hors saison, remplacer le bouton par « La terrasse rouvre en juin » avec une date et un « Réserver en salle » secondaire. Donner une vraie version d'été à Réserver (carton « Votre table — en terrasse », photo de la pergola), à Offrir et à l'ouverture de la carte (plats d'été). Sinon, limiter le cadran à l'accueil et le dire clairement (« Aperçu de l'été »).

### 5. La v4 est une v3 retouchée, et ressemble à la bibliothèque
- **Constat** : même photo de héros (l'assiette de légumes devant la cheminée), même plateau au mot près, même scène épinglée à quatre étapes (le suprême de pintade dessiné est devenu des photos sur nappe), mêmes cartes de fêtes, carte cadeau, carte de géographie et pied de page. Les ouvertures de La carte, des Fêtes et de Réserver sont identiques, ainsi que l'ardoise, le verre et le cadran. Le plan du héros et le gadget à consigne manuscrite sont ceux de Lo Componaïro, QD2A et agence ae. La v4 a perdu le grand panneau « Au creux de la cheminée » (la salle, les fourrures, le feu), seule image du lieu en hiver.
- **Captures** : `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-v3-a.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-v3-b.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-v3-ouv.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-v3-signatures.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-biblio-p.jpg`
- **Correction** :
  - faire du cadran l'idée du héros plein écran, et non un gadget de coin : par exemple, la moitié feu et la moitié piscine se partagent l'écran, et la frontière suit le doigt ;
  - changer de photo de héros (la salle et le feu, ou une assiette tenue par le chef) ;
  - remettre un grand panneau « Au creux de la cheminée » ;
  - renouveler au moins deux ouvertures intérieures, Offrir et La carte.

### 6. Premier écran : hiérarchie, lisibilité et cadrage
- **Constat** :
  - la ligne de la saison inactive est un fantôme gris en italique illisible : « l'été » se fond dans le reflet du verre d'eau en hiver, et « l'hiver » se perd dans les palmes en été ;
  - le plat est relégué sous le cadran ;
  - l'arc du cadran ne correspond pas aux pastilles : il finit au-dessus de « Faites glisser » et non au-dessus de « Été » ;
  - le cadran est petit pour être l'idée du site ;
  - le héros d'été montre un pylône électrique et des fils juste derrière le titre ;
  - en été, le premier écran ne montre aucune nourriture.
- **Captures** : `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/cap/acc-h-ord-arrivee.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/cap/acc-e-ord-arrivee.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/z-poteau.jpg`
- **Correction** :
  - ligne inactive en contour ou en plus petit, mais lisible (contraste d'au moins 4,5 : 1), ou bien la retirer et laisser le cadran dire l'autre saison ;
  - recadrer ou retoucher la photo de piscine (retirer pylône et fils) ;
  - aligner les extrémités de l'arc sur les deux pastilles et doubler la taille du cadran ;
  - en été, ajouter dans le héros une assiette ou un cocktail au premier plan.

### 7. Infos pratiques : la mise en page des horaires est cassée
- **Constat** : le cadran 24 h et ses commandes occupent un écran seuls. Le surtitre « HORAIRES » est orphelin sous le cadran, le titre « Ouvert maintenant ? » arrive après le widget qu'il annonce, et le tableau des horaires n'occupe que la moitié gauche, avec 800 px vides à droite. La v3 avait le cadran à gauche et le titre et le tableau à droite. L'anneau du cadran ne dessine pas les plages d'ouverture, même pour le vendredi. L'horloge affiche 17:16 et le texte « 17 h 15 ».
- **Captures** : `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/cap/infos-pratiques-h-ord-01-y800.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/cap/infos-pratiques-h-ord-02-y1600.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/cap/v3-infos-pratiques-y800.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-offrir-action.jpg` (en bas à droite)
- **Correction** : rétablir la grille sur deux colonnes de la v3 (cadran à gauche ; surtitre, titre et tableau à droite). Peindre en braise les plages d'ouverture sur l'anneau (12 h à 14 h 30, 19 h à minuit). Arrondir l'heure affichée comme le texte.

### 8. La réservation n'a pas son moment, et le parcours fait un détour
- **Constat** :
  - le bouton du héros mène en haut de /reserver et non au formulaire : un clic de plus ;
  - à la confirmation, le carton « Réservé » est petit et placé dans un coin ;
  - la cloche passe sous l'en-tête et ne se voit qu'à moitié ;
  - « Réservé » contredit « Demande enregistrée » juste en dessous ;
  - rien ne rappelle le carton « Votre table » de l'ouverture ni le plan choisi.
- **Captures** : `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-rafale.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/z-confirm.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-resa1.jpg`
- **Correction** : faire pointer les boutons « Réserver » directement sur le formulaire. À la confirmation, ramener au centre le carton de l'ouverture, avec le nom écrit à la main (« Claire Martin · vendredi 13 nov., 19 h · 2 couverts ») ; il se pose à la table choisie sur le plan ou sur la nappe, et la cloche se lève au milieu du panneau, pas sous l'en-tête. Écrire « Demande envoyée : le restaurant vous rappelle pour confirmer » et supprimer « Réservé ».

### 9. Téléphone : héros muet, plan illisible, listes longues
- **Constat** :
  - sur téléphone, le héros de l'accueil n'a ni surtitre ni phrase : on ne lit nulle part « restaurant », « chef Régis Clauss » ou « Moineville » sur le premier écran ;
  - la barre « Appeler / Réserver » n'apparaît qu'après défilement (la v3 avait les deux) ;
  - sur Réserver, la liste des 12 tables précède un plan réduit à une vignette (« Agrandir le plan ») ;
  - sur Les fêtes, les cloches couvrent le titre « Le menu de Noël » (voir point 12).
- **Captures** : `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-tel-v3-v4.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-tel-fetes-resa.jpg`
- **Correction** : garder sous le titre une ligne « Restaurant du chef Régis Clauss · Moineville », montrer la barre dès l'arrivée, mettre le plan à pleine largeur avant la liste et replier la liste dans une feuille (« Voir les 12 tables »).

### 10. Le casting photo trahit le lieu
- **Constat** :
  - « 12 invités » affiche en grand la cabane des **douches** de la piscine, panneau « DOUCHES » en vue ;
  - la carte « Les pool parties » montre une torche en flammes ;
  - la vignette « Menu de Noël » est une image générée presque noire, sans rien de lisible ;
  - la Saint-Sylvestre est illustrée par un cocktail flanqué d'une truffe ;
  - « Nos entrées » (La carte) est recadré sur un moulin à poivre flou ;
  - la même salle aux fourrures et serviettes bleues revient sur Réserver (bandeau), à la fin de La carte (« Une table vous attend ») et au menu de Noël ;
  - la même table de réception à la rose revient sur l'accueil et sur Infos (« Une demande ») ;
  - la piscine et la paillote reviennent trois fois en été ;
  - en hiver, pour 40 invités, le site propose « La terrasse et les jardins », photos d'été à l'appui.
- **Captures** : `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/z-douches.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-recevoir.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-acc-e-ord-b.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-acc-h-ord-c.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/z-carte-entrees.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-carte-b.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-fetes.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-reserver.jpg`
- **Correction** :
  - pour 12 invités, la grande table de la salle ou la pergola dressée ;
  - pour les pool parties, la piscine animée de jour ;
  - pour Noël, le sapin, l'ours et le feu (la photo en arche des Fêtes), à la place de l'image noire ;
  - pour la Saint-Sylvestre, une flûte de Champagne et une assiette de fête, sans truffe posée à côté d'un cocktail ;
  - recadrer « Nos entrées » sur l'assiette ;
  - une seule apparition par photo de salle sur tout le site ;
  - pour les réceptions, rendre les espaces proposés dépendants de la saison (hiver : salle et cheminée ; 120 : privatisation).

### 11. Écarts avec le relevé
- **Constat** (texte affiché face à `_audit/releve.md`) :
  - À partager : « Supplément de 10 € par personne en plus. Pour deux : 25 €. » Le relevé ne connaît que « pour 4 : 45 € ».
  - Saint-Sylvestre : « Éclats de truffe noire » (sous le velours de foie gras), « Crémeux de yuzu et meringue délicatement brûlée » (sablé breton), « Filet de bœuf d'exception », « délicatement poché ». Ces ajouts ne figurent pas au relevé. Les prix (120 / 170 €), le DJ Laurent Geymet et les cinq accords sont justes.
  - Le Grand Buffet : « Dimanches 16, 23 et 30 août 2026 », quand le relevé dit « dimanches d'août » (les 2 et 9 ont disparu).
  - Infos : le bandeau défilant ajoute « Nancy », alors que le relevé et le reste du site disent « entre Metz, Thionville et le Luxembourg ».
  - Journées festives : « déjeuner jusqu'à 14 h 30, puis piscine… service boissons et snacking », « vestiaires et douches », « tenue correcte exigée ; l'établissement se réserve le droit d'admission ». Ces détails sont absents du relevé.
  - Les journées festives tombent le mardi, alors que le restaurant est indiqué fermé le mardi : le site ne l'explique pas.
  - Végétarien : le relevé précise qu'aucun plat n'est marqué sur le site. La carte l'assume (« d'après leur composition »), mais le plateau de l'accueil affiche les pastilles sans cette réserve.
  - Descriptions des planches (Libanaise, Charcuterie « italiennes », La Mer) : absentes du relevé, à sourcer.
  - Sont conformes : téléphone, adresse, horaires et leur date de relevé, menu de Noël et prix, carte cadeau (25 à 200 €, 6 mois, pas d'échange en espèces), acompte « par couvert », entrées 9 à 21 €, plats 21 à 26 €, menu enfant 16 €, desserts 9 à 11 €.
- **Captures** : `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-carte-a.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-fetes.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-offrir-infos.jpg`
- **Correction** : retirer chaque ajout non sourcé ou le marquer « à confirmer », écrire « dimanches d'août », supprimer « Nancy », et ajouter sous les journées festives « horaires d'été : le restaurant ouvre aussi le mardi ».

### 12. Les cloches de Noël cachent le menu
- **Constat** : des cloches plates, façon pictogramme, descendent sur le menu de Noël et recouvrent le titre (« Le menu de N[cloche]ël ») et les premiers plats pendant le défilement, surtout sur téléphone. Elles n'ont ni le modelé ni l'éclat de la cloche dorée du chargement.
- **Captures** : `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/cap/fetes-tel-02-y1800.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-noel.jpg`
- **Correction** : petites cloches dans la marge, à gauche de chaque plat, qui se lèvent sans jamais passer sur le texte ni sur le titre, dessinées comme la cloche dorée de l'ouverture.

### 13. Offrir : ouverture éteinte, dénouement invisible
- **Constat** : l'ouverture est un écran presque noir (photo de paquet cadeau à peine visible, carte sombre sur fond sombre). Après « Offrir cette carte », la carte glisse dans une enveloppe brune sur fond brun, qu'on ne voit presque pas, et aucune confirmation n'apparaît à l'écran. « De la part de Paul » est presque invisible sur la carte dorée, et « 75 caractères au plus » est en fait un compteur.
- **Captures** : `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/cap/offrir-h-ord-arrivee.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-offrir-action.jpg`
- **Correction** : ouvrir sur la carte dorée en grand, éclairée, sur la nappe crème. Une enveloppe en papier crème avec un cachet de cire braise, et à côté « Carte de 100 € pour Claire — à retirer au restaurant (simulation) ». Foncer la signature, et écrire « 75 caractères restants ».

### 14. Le texte parle des effets plutôt que de la cuisine
- **Constat** :
  - « avec deux vrais plats et leurs prix », « Des assiettes du chef, photographiées au restaurant, se posent une à une sur la nappe », « faites glisser, la table s'agrandit et l'espace qui convient s'affiche » : le site décrit ses gadgets ;
  - la même section dit « photographiées au restaurant » et porte une mention « Illustration générée » ;
  - « (nouvel onglet) » est imprimé en clair dans les liens (Itinéraire, Facebook, Instagram) ;
  - « Mentions légales : à compléter » est visible en pied de page ;
  - le champ de recherche coupe « girolles, Saint-… ».
- **Captures** : `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-acc-h-ord-a.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-acc-h-ord-d.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/z-carte-entrees.jpg`
- **Correction** : des phrases de cuisinier (« Cette semaine, Régis cuisine la pintade aux girolles et le risotto de Saint-Jacques au riz noir »), et une seule consigne d'usage, en Caveat, près de l'objet. Mettre « nouvel onglet » dans une icône avec un texte réservé aux lecteurs d'écran. Remplir les mentions, ou les sortir de la maquette.

### 15. Détails typographiques qui coûtent cher
- **Constat** :
  - la pastille « végétarien » du plateau (Nos plats, ordinateur) est écrasée en ovale et chevauche « Dhal aux trois lentilles » ;
  - le 4 du Bodoni, à fins déliés, se lit « 15 » dans « Dans 45 jours » et « 10 » dans « 40 invités » de loin ;
  - le € en Bodoni se lit « C » sur la carte cadeau (« 50 C ») ;
  - les comptes à rebours partent de zéro : on lit « Dans 0 jours » pendant l'animation (capture téléphone).
- **Captures** : `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/z-badge.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/z-chiffres-fetes.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/z-euro.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-acc-h-tel-b.jpg` (« Dans 0 jours », en bas de la première vignette)
- **Correction** : pastille sur une ligne, qui ne s'étire pas, placée sous le nom du plat ; chiffres et € en Figtree (chiffres tabulaires), ou Bodoni plus gras pour les chiffres ; pas d'animation de comptage sur un compte à rebours (afficher directement 45 et 51).

### 16. Longueurs et vides
- **Constat** : environ 250 px de noir vide entre le plateau et « La table se dresse », puis encore entre la table et les fêtes. Un trou de 70 px entre les heures et « 3 créneaux disponibles ». Les quatre cartes des « journées au bord de l'eau » ont une seule description : trois cartes à moitié vides. En bas d'accueil, la carte cadeau statique et le petit schéma « À Moineville » finissent mollement.
- **Captures** : `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-acc-h-ord-a.jpg` (en bas à droite), `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-acc-e-ord-b.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-acc-h-ord-d.jpg`
- **Correction** : resserrer les transitions sombres à 96 px au plus, donner une ligne utile à chaque carte d'été (horaires, prix d'entrée s'il est connu), et finir sur une vraie carte de trajets (temps de route vers Metz, Thionville et Luxembourg, à faire vérifier), au niveau des cartes du palmarès (calques, tracés), ou sur le panneau « Au creux de la cheminée ».

### 17. Plan de salle peu lisible
- **Constat** : « Choisir ma table » fait arriver sur un plan coupé par le bas de l'écran. Le plan est incliné, sombre, avec des numéros minuscules, et la colonne des 12 tables double l'information.
- **Captures** : `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-plan.jpg`, `/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-plan2.jpg`
- **Correction** : caler l'arrivée pour que le plan soit entier, réduire l'inclinaison, numéros deux fois plus grands, tables libres éclairées (braise) et indisponibles éteintes. La liste devient un menu replié.

### 18. Le changement de saison manque de théâtre
- **Constat** : le basculement est un fondu de 300 ms. Les textes et les boutons changent avant la photo (`/tmp/claude-0/-home-claude/c5628601-c2c4-57dc-9fbf-4bfd0d291763/scratchpad/regard4/m-bascule.jpg`), et l'en-tête reste brun fumée en été.
- **Correction** : une transition propre à la marque. La braise du cadran devient soleil, une vague claire balaie l'écran depuis le cadran, les braises de l'écran se changent en reflets d'eau en environ 900 ms, et l'en-tête prend le bleu nuit d'été.
