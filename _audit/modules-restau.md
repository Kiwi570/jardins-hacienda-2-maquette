# Test réel des 9 modules restaurant · Jardins de l'Hacienda (2)

Projet : `jardins-hacienda-2-maquette`, direction « La table du soir » (fond sombre). Bibliothèque : clone du 10 novembre 2026, outils de la skill v10.8.2.
Méthode : `_biblio/outils/assembler.mjs` des 9 modules avec la palette du client (`assemblages/hacienda2/`), puis `tester-module.mjs` sur l'assemblage (14 formats), puis report dans le projet sans réécrire les modules : code copié tel quel dans `assets/js/modules/<nom>/`, réglages par options d'`init`, variables CSS et fichiers JSON de contenu (`donnees/`), contenu réel du site actuel uniquement.

## Résultat de l'assemblage

| Passage | Résultat | Cause |
|---|---|---|
| 1 | échec : console (404), « réduire les animations », scénario | `data-source="exemple-accords.json"` recopié sans réécrire le chemin |
| 2 | échec : mêmes contrôles | `exemple-accords.json` non copié dans `assemblages/hacienda2/modules/accords-mets-et-vins/` |
| 3 | **tout vert** : 14 formats, réduire les animations, console 0 erreur, CLS 0,032, scénarios, texte 12 px, cibles 44 px | les deux contournements faits dans l'assemblage (chemin corrigé, fichier copié) |

Les deux défauts sont dans l'outil d'assemblage, pas dans les modules (voir « Corrections à reporter dans la bibliothèque »).

## Branchement sur le socle du projet (commun aux 9 modules)

- Les modules importent `../../socle/socle.js` et appellent `pret([...])`, qui charge son propre GSAP depuis `vendor/`. Dans un projet de la skill, GSAP est déjà chargé par les pages : deux GSAP et deux jeux de ScrollTrigger. Correction (intégration, pas les modules) : adaptateur `assets/js/socle/socle.js` qui expose la même API (`pret`, `socle.gsap`, `ScrollTrigger`, `calme`, `souris`, `telephone`, `boucle`, `rafraichir`) avec le GSAP du projet, sans rien charger.
- L'adaptateur fournit aussi `socle.lenis.scrollTo(y, { immediate })`, qui passe par `aller()` du socle du projet : sans lui, les défilements des modules (`scrollTo` « smooth ») étaient annulés par le défilement adouci du projet (voir M15).
- Modules copiés sous `assets/js/modules/` (et non `assets/modules/`) pour que `outils/generer.mjs` leur applique le `?v=N` de la version : sinon un visiteur garde l'ancien module après une mise à jour.
- Variables : les modules lisent `--couleur-fond|texte|accent|secondaire`, `--couleur-texte-doux|ligne|surface`, `--police-*`, `--rayon`, `--espace` ; reliées à celles du site dans `site.css`. **Piège** : les couleurs dérivées (`--couleur-texte-doux`, `--couleur-ligne`, `--couleur-surface`) calculées sur `:root` restent celles du fond sombre dans une section claire (descriptions de la carte presque invisibles sur la nappe) : il faut les redéfinir dans la section claire (`.clair`, `site.css`).
- Classes du socle des modules utilisées dans leur HTML : `socle-cadre`, `socle-surtitre`, `socle-bouton`, `socle-bouton--plein`, `socle-sr` ; reprises dans `site.css`.

## Fiches par module

Défauts trouvés par trois sources : l'audit standard et la passe des formats (« audit »), le test « vrai visiteur » (persona Claire, 8 missions sur téléphone et ordinateur, 15 réussies sur 16 au premier passage) et le regard neuf (agent qui n'a pas vu la construction). Les numéros M… renvoient au tableau des corrections plus bas.

### 1. plat-fumant · « Créé à part » (premier usage en projet)

- **Où** : ouverture de l'accueil, sur la vraie photo du site `restaurant-plat-deguster.png` (plat dressé devant la cheminée) ; second usage pour le boost « vapeur sur le plateau » (source fixe devant le plateau tournant).
- **Temps d'intégration** : 9 min (5 pour l'ouverture, 4 pour le plateau), plus 6 min de mesures de fluidité.
- **Réglages** : options `densite .9, hauteur .55, vitesse .85, intensite .95, qualite .35` (qualité baissée pour la fluidité) ; `data-vapeur=".5 .66 .42"` (ouverture), `".5 .82 .5"` (plateau) ; figure produite par `c.media` ; photo décalée à droite sur ordinateur pour que le titre ne couvre pas l'assiette.
- **Défauts** : (intégration) en simple calque de vapeur, la figure garde le fond de `.fumant` et masque ce qu'il y a dessous (M2). (Audit, fluidité) avec deux instances sur la page, la vapeur coûte environ un tiers des images lentes de l'accueil sur processeur ralenti ; la qualité 0,35 suffit à l'œil. (Visiteur, regard neuf) rien de négatif : « passez la main sur le plat » est cité parmi ce que l'on peut toucher.
- **Corrections** : figure transparente pour la variante calque (`site.css`) ; `qualite: .35`.
- **Verdict** : **prêt tel quel**, avec une documentation à compléter.
- **Améliorations proposées** : documenter la variante « calque » (M2) ; donner dans `NOTES.md` le coût mesuré (images lentes par instance) et conseiller `qualite ≤ .4` quand deux instances coexistent.

### 2. assiette-qui-se-dresse · « Créé à part » (premier usage en projet)

- **Où** : accueil, scène épinglée du métier (`data-grille="scene"`) : le chef dresse le suprême de pintade, crème de carotte et girolles (24 €), plat réel de la carte ; étapes tirées de la description de la carte ; mention « Dressage illustré ».
- **Temps d'intégration** : 16 min (12 de dessin adapté, 4 pour le défaut de `--ecran-h`), plus 5 min de réglage après le visiteur et la fluidité.
- **Réglages** : couleurs des dégradés (`g-tranche`, `g-jus`, `g-girolle`), girolles dessinées à la place des figues, pousses et fleur de sel retirées ; 4 étapes ; `longueur: 1.4` (au lieu de 2,4).
- **Défauts** : (intégration) scène à 0 px sans `--ecran-h` (M1). (Visiteur) sur ordinateur, la scène retenait 4 défilements : « la page semble bloquée » ; « l'illustration ne donne pas faim ». (Regard neuf) « dessinée comme une icône naïve, le suprême ressemble à un churros » : le style vectoriel plat jure à côté des vraies photos. (Audit, fluidité) les masques animés repeignent la scène à chaque image : un quart des images lentes de l'accueil ; passer chaque couche sur son calque (`will-change`) aggrave (trop de grands calques).
- **Corrections** : `--ecran-h` sur `:root` ; épinglage raccourci à 1,4 écran.
- **Verdict** : **à améliorer**.
- **Améliorations proposées** : `var(--ecran-h, 100svh)` (M1) ; longueur par défaut 1,4 ; un rendu plus réaliste (couches tirées de photos détourées du plat, ou trait gravé laiton) et un guide « adapter le dessin à un autre plat » ; masques moins coûteux (un seul masque par couche, chemins simplifiés).

### 3. ardoise-a-la-craie · tiré de la première Hacienda

- **Où** : page La carte, juste après l'ouverture ; titre « fabriqué » de la page (`data-grille="typo"`).
- **Temps d'intégration** : 5 min, plus 2 min pour le bâton de craie.
- **Réglages** : `donnees/ardoise.json` (4 plats de saison de la carte avec leurs prix) ; date « Cette semaine » ; `--ardoise-police: Caveat` ; lien « Un plat végétarien ? » qui filtre la carte voisine.
- **Défauts** : (audit) une fois les prix écrits, le bâton de craie reste posé sur un prix (« 9 € » recouvert à 1366×768). (Visiteur) la craie met environ 4 s à écrire les prix, le tableau reste vide en attendant. (Regard neuf) sur ordinateur, l'ardoise paraît presque vide (titre écrit petit sur un grand panneau) ; sur téléphone elle occupe un écran entier.
- **Corrections** : le bâton se retire 5,5 s après le début de l'écriture (`site.css`, animation sur `.ardoise.est-ecrit .ardoise__baton`).
- **Verdict** : **à améliorer**.
- **Améliorations proposées** : classe de fin d'écriture (`est-fini`) et bâton qui se range hors du texte (M14) ; prix écrits avant les noms ou vitesse réglable (`options.vitesse`) ; hauteur de l'ardoise proportionnée au nombre de lignes.

### 4. carte-du-restaurant · tiré de pizzalyght et de la première Hacienda

- **Où** : page La carte, section claire « Toute la carte ».
- **Temps d'intégration** : 8 min, plus 8 min pour le parcours « plat végétarien ».
- **Réglages** : `donnees/carte.json` (carte réelle complète, `vegetarien` sur le dhal et le houmous), filtres `vegetarien` et `a-partager`, mentions « allergènes à compléter » ; rendu par `rendreCarte()` à la génération.
- **Défauts** : (intégration) couleurs dérivées du fond sombre dans une section claire. (Audit) allergènes absents à 48 % : 2,74:1 (M6) ; symbole `carte-a-partager` en double (à regarder). (Visiteur) **mission ratée sur téléphone** : après « Un plat végétarien ? », le dhal et son prix restaient sous l'écran, à la place on voyait la photo de rubrique… une volaille ; au défilement suivant le nom passait sous la barre collée. Cause : le défilement du module (`scrollTo` « smooth ») est annulé par le défilement adouci du projet, et la photo de rubrique reste affichée sous un filtre (M15).
- **Corrections** : `.clair` redéfinit les couleurs dérivées ; le lien de l'ardoise filtre puis amène le premier plat filtré sous l'en-tête et la barre ; l'adaptateur fournit `socle.lenis.scrollTo` (défilement du projet) aux modules ; photo de rubrique masquée quand un filtre est actif (`site.css`) ; pastille « végétarien » sur le plateau de l'accueil.
- **Verdict** : **à améliorer** (la mission échouait avec le module tel quel).
- **Améliorations proposées** : `filtrer(liste, { aller: true })` qui amène le premier plat trouvé ; masquer la photo de rubrique sous un filtre (M15) ; contraste des allergènes absents (M6) ; symboles SVG à identifiant unique.

### 5. accords-mets-et-vins · tiré d'artic et de château Haut-Piquat

- **Où** : page Les fêtes, sur le vrai menu de la Saint-Sylvestre (5 temps, 4 vins de la formule accord et la coupe de Champagne).
- **Temps d'intégration** : 6 min, plus 5 min de corrections d'audit.
- **Réglages** : `donnees/accords.json` ; liste écrite dans la page ; `textes` (« Le vin de l'accord ») ; aucun mot du sommelier (l'affiche n'en donne pas).
- **Défauts** : (assemblage) `data-source` non réécrit, JSON non copié (A1, A2). (Audit) `role="radiogroup"` sur une liste : axe `listitem` (M8) ; type, vin et région se chevauchent quand la ligne passe sur deux lignes, avec ou sans JavaScript (M12) ; le bouton radio transparent qui couvre toute la fiche est signalé « élément recouvert » sur chaque titre de plat. (Regard neuf) « le verre prend la forme et la couleur du vin » cité parmi les points forts.
- **Corrections** : `role="none"` sur les `li` ; spans en `inline-block` et interligne 1,7 ; `data-superpose` posé sur les boutons radio après `init()` (superposition voulue).
- **Verdict** : **à améliorer** (corrections simples).
- **Améliorations proposées** : M8, M12 ; poser `data-superpose` sur `.ame__radio` dans le module ; un champ facultatif « mot du sommelier » mieux mis en valeur quand il manque (fiche moins vide).

### 6. horaires-ouvert-maintenant · tiré de pizzalyght

- **Où** : page Infos pratiques (« Ouvert maintenant ? ») ; et, après le test visiteur, le statut sur l'accueil.
- **Temps d'intégration** : 6 min, plus 6 min (statut de l'accueil, photo de repli).
- **Réglages** : `donnees/horaires.json` (RankEat du 1er novembre 2026, à confirmer ; fériés en « ouvert ») ; JSON et texte de la semaine écrits à la génération (`preparer()`, `rendreBloc()`).
- **Défauts** : (intégration) minuit affiché « 0 h » (M3). (Audit) en mode calme et sans JavaScript, le module retire le cadran : la section n'a plus aucun visuel (M16). (Visiteur) la réponse « Fermé · ouvre demain à 12 h » est claire, mais introuvable depuis l'accueil (3 gestes, limite du barème). (Regard neuf) le cadran se lit mais ne se manipule pas.
- **Corrections** : `heure()` renvoie « minuit » ; photo de repli affichée en mode calme et sans JavaScript ; statut calculé sur l'accueil avec `preparer()`, `statut()` et `maintenant()` du module (lien « Fermé · ouvre demain à 12 h » sous les boutons).
- **Verdict** : **à améliorer** (petites corrections) ; le calcul est solide.
- **Améliorations proposées** : M3 ; M16 (cadran statique en mode calme, ou visuel de repli prévu) ; un petit export `pastille(root)` pour afficher le statut ailleurs (accueil, menu) ; cadran manipulable (glisser l'aiguille pour voir « ouvert samedi à 20 h ? »).

### 7. plan-de-salle · « Créé à part » (premier usage en projet)

- **Où** : page Réserver, avant la réservation (« Choisissez votre table »).
- **Temps d'intégration** : 8 min, plus 4 min de corrections.
- **Réglages** : `donnees/salle.json` (12 tables d'un plan indicatif d'après les photos ; tables 3 et 6 « Déjà réservée (simulation) » ; terrasse de juin à septembre) ; `couverts: 2` ; `textes.choix` ; couleurs `--pds-*` (tables en bois sombre).
- **Défauts** : (intégration) annonce du choix collée (M4). (Audit) numéros des tables illisibles sur tables claires (M10) ; sans JavaScript, la section n'a plus de visuel. (Visiteur) passage obligé avant la date : le jour n'arrive qu'au 7e geste ; « Prise ce soir » affiché alors que le restaurant est fermé ce soir et qu'on réserve pour samedi ; numéros quasi illisibles. (Regard neuf) le panneau collant « Réserver cette table » cache des lignes de la liste en défilant ; le nombre de couverts se règle deux fois (plan puis formulaire). Point fort : « plan 3D filtrable, au-dessus de la barre outil interactif ».
- **Corrections** : `--pds-table` sombre ; lien « Réserver sans choisir de table » dans l'ouverture ; « Déjà réservée (simulation) » ; photo de la salle sans JavaScript.
- **Verdict** : **à améliorer**.
- **Améliorations proposées** : M4, M10 ; tables prises calculées pour la date et le service choisis (ou mention neutre) ; plan facultatif par défaut (« choisir ma table » après la date) ; marge sous le panneau collant égale à sa hauteur ; couverts partagés avec la réservation sans double réglage.

### 8. reservation-de-table · tiré de la première Hacienda et de pizzalyght

- **Où** : page Réserver (`#formulaire`, `data-grille="retour"`), préremplie par la table du plan.
- **Temps d'intégration** : 7 min, plus 8 min de corrections.
- **Réglages** : `donnees/reservation.json` (services, fermetures, 10 couverts au plus, terrasse de juin à septembre, `complets_simules`) ; textes de la démonstration repris dans la page.
- **Défauts** : (audit) services et créneaux fermés à 3,33:1 (M7) ; espaces insécables manquantes avant « ? » et « : » dans le formulaire recopié (à regarder). (Visiteur) samedi caché à droite dans la rangée des jours sur téléphone ; le « 4 » des couverts en Bodoni très fin se lit « /\| » ; après « Confirmer », le titre de la confirmation restait sous l'en-tête (téléphone) : même cause que M15, le `scrollBy` « smooth » est annulé par le défilement adouci. (Regard neuf) « Demande enregistrée » en vert, hors palette ; référence coupée en fin de ligne ; sans heure choisie, « Vérifier » n'affiche pas de message visible près du bouton.
- **Corrections** : couleur des puces fermées ; insécables ; jours sur deux lignes sur téléphone ; chiffres en police du texte ; défilement par l'adaptateur (`socle.lenis`) puis rattrapage après le `ScrollTrigger.refresh()` ; couleurs laiton et `overflow-wrap` sur le récapitulatif.
- **Verdict** : **à améliorer**.
- **Améliorations proposées** : M7, M17 ; textes du formulaire dans un fichier JSON (comme `textes` des autres modules) plutôt qu'en dur dans le HTML ; jours en grille par défaut sur téléphone ; couleur « envoyé » tirée de `--couleur-accent` ; message près du bouton quand un champ manque.

### 9. carte-cadeau-qui-se-compose · tiré de la première Hacienda et de beat-haechler

- **Où** : page Offrir (`#composer`, `data-grille="retour"`), titre fabriqué : le prénom écrit à la main.
- **Temps d'intégration** : 5 min, plus 8 min de corrections.
- **Réglages** : montants réels 25 à 200 € (pas de montant libre), cachet « JH », logo du client, conditions réelles (« valable 6 mois »), `textes.statut` (remise à confirmer) ; achat simulé.
- **Défauts** : (intégration) démonstration à l'identité d'un client (M5). (Audit) nom de la maison coupé (M11). (Visiteur) après « Offrir cette carte », le message « Carte prête » restait sous l'écran (deux formats) ; on ne sait pas comment la carte sera remise. (Regard neuf) « Carte cadeau » invisible sur la carte dorée (`.ccq__type` en `--ccq-or` sur une carte en `--couleur-secondaire` dorée) ; point fort : enveloppe et cachet, « au niveau du palmarès ».
- **Corrections** : nom sur deux lignes ; message amené à l'écran quand il apparaît, après le `refresh` ; `.ccq__type` en encre de la carte ; statut qui dit la validité et la remise à confirmer.
- **Verdict** : **à améliorer** (petites corrections) ; c'est le module le plus abouti des neuf.
- **Améliorations proposées** : M5, M11, M13 ; message de fin placé dans la scène, sous l'enveloppe ; option `remise` (retrait, e-mail, courrier) avec le champ qui va avec.

## Corrections à reporter dans la bibliothèque (rien n'a été modifié dans la bibliothèque pendant le projet)

| # | Fichier (bibliothèque) | Ligne | Défaut constaté | Changement proposé |
|---|---|---|---|---|
| A1 | `outils/assembler.mjs` | 90 | les fichiers `.json` d'un module (`exemple-accords.json`, `exemple-carte.json`, `exemple-horaires.json`, `exemple-ardoise-du-jour.json`) ne sont pas copiés : 404 et échec du test de l'assemblage | ajouter `json` à l'expression `/\.(css|js|json|jpe?g|png|webp|avif|svg|mp3|m4a|mp4)$/` |
| A2 | `outils/assembler.mjs` | 99 | `data-source="exemple-accords.json"` n'est pas rapporté au dossier du module (seuls `src`, `href`, `poster`, `data-src` et les images, sons, vidéos le sont) | ajouter `data-source` aux attributs et `json` aux extensions de la première expression |
| A3 | `outils/assembler.mjs` | 101 | les `id` sont préfixés (`m8-pds-parquet`) mais pas les références `url(#…)` (fill, stroke, mask, filter) ni `<use href="#…">` : sol du plan de salle vide, masques de l'assiette sans effet dans l'assemblage, sans que le test le voie | après le préfixe des `id`, remplacer aussi `url(#x)` et `href="#x"` par `url(#mK-x)` quand `x` est un id préfixé du bloc |
| M1 | `modules/assiette-qui-se-dresse/module.css` | 65 | dépend de `--ecran-h` (défini par `socle/socle.css` de la bibliothèque seulement) : dans un projet de la skill, la scène tombe à 0 px | écrire `var(--ecran-h, 100svh)` (repli), et citer la variable dans `NOTES.md` (« Usage ») |
| M2 | `modules/plat-fumant/module.css` | 4 | le fond de `.fumant` empêche d'utiliser la vapeur comme calque au-dessus d'un autre visuel | sortir le fond dans une classe de démonstration, ou documenter la variante « calque » (figure transparente, `pointer-events: none`) dans `NOTES.md` |
| M3 | `modules/horaires-ouvert-maintenant/horaires-calcul.js` | 12 | minuit affiché « 0 h » (« 19 h – 0 h ») | `if (m === 0) return 'minuit';` en tête de `heure()` (fait dans le projet) |
| M4 | `modules/plan-de-salle/module.js` | 13 | annonce `aria-live` du choix sans séparation : « 4 placesLa plus proche du feu » | gabarit `choix: '{nom} · {zone} · {places} places. '` (réglé dans le projet par l'option `textes.choix`) |
| M5 | `modules/carte-cadeau-qui-se-compose/index.html` | démonstration | identité d'un client dans la démonstration (« Les Jardins de l'Hacienda », « JH », « valable un an ») | remplacer par un nom neutre (« La Maison »), retirer la condition de validité inventée |
| S1 | `socle/socle.js` (modules) | `pret()` | charge son propre GSAP : dans un projet de la skill, deux GSAP | documenter dans le README l'adaptateur du projet (`assets/js/socle/socle.js` du projet, même API, GSAP de la page), ou faire chercher `window.gsap` avant de charger |
| M6 | `modules/carte-du-restaurant/module.css` | 67 | allergènes absents de la légende à 48 % du texte : 2,74:1 sur un fond clair (audit et axe : contraste insuffisant, 14 échecs par format) | passer à 70 % au moins, ou griser par un pictogramme barré plutôt que par la couleur ; réglé dans le projet par `"legende_complete": false` (aucun allergène n'est encore déclaré) |
| M7 | `modules/reservation-de-table/module.css` | 51 | services et créneaux fermés ou complets à 48 % du texte : 3,33:1 (audit : contraste insuffisant) | garder la couleur `--couleur-texte-doux` et marquer l'état par le barré et la bordure en tirets ; fait dans le projet (`site.css`) |
| M8 | `modules/accords-mets-et-vins/module.js` | 118 | la liste devient `role="radiogroup"` mais ses `<li>` restent des éléments de liste (axe : `listitem`) | poser `role="none"` sur chaque `li` au même endroit ; fait dans le projet après `init()` (`site.js`) |
| M9 | `modules/carrousel-3d/module.css` | 27 | les cartes de profil ne sont que `pointer-events: none` : une carte vue presque de côté reste un lien visible de 5 px de large (audit : zone tactile sous 44 px), et les textes des cartes voisines se chevauchent à 390 px | `visibility: hidden` sur `.c3d__carte:not(.est-de-face)` ; et `data-galerie` sur `.c3d__scene` dans le gabarit d'usage ; faits dans le projet |
| M10 | `modules/plan-de-salle/module.css` | 75 et 110 | le numéro d'une table prend la couleur du texte (`--couleur-texte`) alors que la table prend `--pds-table` : sur un thème sombre avec des tables claires, numéros illisibles (1,11:1) | variable `--pds-num` (par défaut `--couleur-texte`) et rappel dans `NOTES.md` que `--pds-table` doit contraster avec elle ; réglé dans le projet par des tables en bois sombre (`--pds-table: #4a3626`) |
| M11 | `modules/carte-cadeau-qui-se-compose/module.css` | 44 | le nom de la maison est sur une ligne (`nowrap`, `4.6cqi`) : un nom long (« Les Jardins de l'Hacienda ») dépasse et passe sous 12 px à 320 px | `white-space: normal` et `font-size: max(12px, 4.6cqi)` ; fait dans le projet |
| M12 | `modules/accords-mets-et-vins/module.css` | 29 | la ligne de l'accord (type · vin · région) passe sur deux lignes à 320-390 px avec un interligne trop serré : textes qui se chevauchent | `line-height: 1.6` sur `.ame__accord` ; fait dans le projet |
| M13 | `modules/carte-cadeau-qui-se-compose/module.css` | 43 | « Carte cadeau » (`.ccq__type`) en `--ccq-or` alors que la carte prend `--ccq-carte` (par défaut `--couleur-secondaire`) : sur une carte dorée, la mention disparaît (regard neuf, visiteur) | `.ccq__type { color: var(--ccq-encre) }`, filets seulement en `--ccq-or` ; fait dans le projet |
| M14 | `modules/ardoise-a-la-craie/module.js` | 112 | `est-ecrit` est posée au début de l'écriture et rien ne marque la fin : le bâton de craie (`.ardoise__baton`, `module.css` l. 56-59) reste posé sur le dernier prix (audit : élément recouvert) | ajouter `est-fini` en fin de timeline et ranger le bâton hors du texte (ou le masquer) ; dans le projet, animation CSS de retrait après 5,5 s |
| M15 | `modules/carte-du-restaurant/module.js` | 71 (et `carte-cadeau…/module.js` 189, `reservation-de-table/module.js` 177) | sans `socle.lenis`, les modules font défiler par `scrollTo`/`scrollBy` « smooth » ; dans un projet de la skill, le défilement adouci du socle et le `ScrollTrigger.refresh()` qui suit un changement de hauteur annulent ce défilement : plat filtré, confirmation de réservation et message de la carte cadeau restent hors de l'écran (visiteur : 1 mission ratée, 2 confirmations hors écran) | documenter que `socle.lenis.scrollTo(y, { immediate })` doit renvoyer vers le défilement du projet (fait dans l'adaptateur du projet avec `aller()`), et refaire le défilement après l'événement `rafraichi` ; et dans carte-du-restaurant, masquer `.carte-resto__photo` quand un filtre est actif |
| M16 | `modules/horaires-ouvert-maintenant/module.js` | 44 | en mode calme (et sans JavaScript, par le `noscript` du gabarit d'usage), le cadran est retiré : la section n'a plus aucun visuel (audit : section sans visuel) | cadran statique (aiguille posée, sans animation) en mode calme, ou visuel de repli prévu dans le gabarit ; dans le projet, photo affichée seulement en mode calme et sans JavaScript |
| M17 | `modules/reservation-de-table/module.css` | 34, 62, 75-77 | rangée des jours en défilement horizontal sur téléphone (le samedi caché à droite) ; chiffres des couverts en `--police-titres` (illisibles avec une didone fine) ; état « envoyé » en `seagreen`, hors palette | jours en grille de 4 colonnes sous 760 px ; chiffres en `--police-texte` ; couleur « envoyé » tirée de `--couleur-accent` ; faits dans le projet (`site.css`) |
| S2 | `socle/assets/js/socle/defilement.js` (socle de la skill) | 104 | `aller()` borne la cible par `mesures.pageH`, qui peut retarder sur un contenu qui vient de grandir (la page Offrir après l'ouverture du formulaire) : le défilement s'arrête trop haut | borner par `max(mesures.pageH, scrollHeight) - innerHeight` dans `aller()` ; fait dans le projet |

## Verdicts

| Module | Verdict | En une phrase |
|---|---|---|
| plat-fumant | **prêt tel quel** | Effet fort et juste ; documenter la variante calque et le coût de deux instances. |
| assiette-qui-se-dresse | **à améliorer** | Meilleure idée métier du site, mais un dessin naïf à côté des photos et un épinglage trop long par défaut. |
| ardoise-a-la-craie | **à améliorer** | Charmante ; le bâton reste posé sur un prix et l'écriture retient l'information. |
| carte-du-restaurant | **à améliorer** | Complète ; la mission « plat végétarien » échouait sur téléphone (défilement annulé, photo de viande sous le filtre). |
| accords-mets-et-vins | **à améliorer** | Le verre qui change est un point fort ; trois corrections d'accessibilité et de mise en page. |
| horaires-ouvert-maintenant | **à améliorer** | Calcul solide ; minuit, mode calme sans visuel, et un statut à exposer sur l'accueil. |
| plan-de-salle | **à améliorer** | Très bon effet ; il passe avant la date et annonce des tables prises sans tenir compte de la date. |
| reservation-de-table | **à améliorer** | Parcours complet ; jours cachés sur téléphone, couleurs et défilement de la confirmation. |
| carte-cadeau-qui-se-compose | **à améliorer** (petit) | Le plus abouti ; mention invisible sur carte dorée, message de fin hors écran. |

Un module prêt tel quel, huit à améliorer, dont la plupart pour des corrections de quelques lignes. Le défaut le plus coûteux est commun à trois modules : leur défilement (`scrollTo` « smooth ») ne passe pas par celui du projet (M15).

## Temps

Intégration des 9 modules : 70 min au premier passage (assemblage et tests compris), plus environ 50 min de corrections après l'audit, le visiteur et le regard neuf, dont 20 min pour le seul défaut de défilement M15.
