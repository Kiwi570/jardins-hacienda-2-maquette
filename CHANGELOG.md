# Ce qui a changé

Chaque version ajoute sa partie en tête de ce fichier, construite en comparant l'archive précédente et la nouvelle, jamais de mémoire.

## v3 — sections claires, carrousel, finitions

Comparaison de l'archive v2 et de la v3, fichier par fichier : 12 fichiers source modifiés (`site.css`, `site.js`, quatre pages, `fr.json`, `site.json`, `images.json`, `plan-images.json`, deux images de baptême refaites), pages régénérées ; 3 images retirées (`recevoir-baptemes-960.webp`, la nouvelle photo est plus petite ; `infos-ouverture-mobile-640.webp` et `-1080.webp`, l'enseigne n'est plus recadrée pour le téléphone).

**Du clair pour casser le sombre**
- Accueil : « Faites tourner le plateau », « Recevoir aux Jardins » et « Venir aux Jardins » passent sur la nappe crème (encre brune, accent braise foncé).
- Réserver : le formulaire « Le jour, l'heure, les couverts » sur la nappe, comme une fiche ; le plan de salle reste en bois sombre.
- Infos pratiques : « Une demande » sur la nappe.

**Le carrousel « Recevoir aux Jardins »**
- Cartes plus grandes (jusqu'à 380 px), trois cartes visibles (celle de face et ses voisines qui s'estompent) au lieu de deux cartes isolées, légende seulement sous la carte de face, rotation plus douce.
- Baptêmes : une vraie photo de famille du site à la place d'une tablée de mariage.

**Finitions (regard neuf)**
- L'intro complète reste sur l'accueil ; sur les autres pages, elle passe trois fois plus vite.
- Titres plein écran (« Au creux de la cheminée », « Chaque semaine, une nouvelle carte ») : les mots qui s'écartent restent dans l'écran.
- Réserver : le bouton « Réserver cette table » en attente est lisible ; si un champ manque, il est ramené à l'écran avec son message.
- Offrir : le montant n'est plus dit deux fois (la carte de l'ouverture montre 50 €).
- Infos pratiques : l'enseigne n'est plus coupée sur téléphone (« les jardins de l'hacienda » en entier).
- Pied de page : sommaire sur deux colonnes sur téléphone ; mention « Illustration générée » plus discrète.

## v2 — ajustements d'effets

Comparaison de l'archive v1 et de la v2, fichier par fichier : 4 images ajoutées, 7 fichiers source modifiés (`site.css`, `site.js`, `assiette-pintade.html`, `la-carte.mjs`, `fr.json`, `site.json`, `plan-images.json`), pages régénérées, rien de retiré.

**L'accueil**
- La scène « Le chef dresse le suprême de pintade » est repeinte en gravure laiton et crème sur une assiette d'ardoise, dans l'esprit de la cloche, au lieu du dessin en couleurs.

**La carte**
- Nouvelle section entre l'ardoise et la carte : une assiette du chef (photo du site) qui s'ouvre jusqu'au plein écran, « Chaque semaine, une nouvelle carte ».
- L'ardoise s'écrit deux fois plus vite, et le bâton de craie se retire plus tôt.

**Réserver**
- Les tables indisponibles du plan affichent « Indisponible (simulation) » au lieu de « Prise ce soir » (faux pour un autre jour, et appliqué aussi à la terrasse fermée).
- Sur ordinateur, le panneau « Réserver cette table » est plus compact et cache moins la liste des tables.

**Fluidité**
- Pour garder l'accueil sous le seuil de 10 % d'images lentes : vapeur un peu plus légère, carrousel 3D qui tourne de 72° au défilement (au lieu de 90°).

**Technique**
- Numéro de version des fichiers : ?v=2.

## v1 — la base

Première version : pas d'archive précédente, cette partie décrit ce qui est livré.

**Les pages**
- 6 pages et une page introuvable : accueil, la carte, les fêtes, réserver, offrir, infos pratiques, « Table introuvable ».
- En français seul, sans son. Menu à 5 entrées et bouton « Réserver une table » toujours visible ; sur téléphone, menu plein écran avec « Réserver » et « Appeler ».

**La direction « La table du soir »**
- Fond fumée, nappe crème, braise et laiton ; titres en Bodoni Moda, texte en Figtree, mots écrits à la main en Caveat.
- Intro : une cloche de service en laiton s'ouvre sur le nom du restaurant puis rejoint le plat fumant de l'accueil ; le passage d'une page à l'autre se fait sous une cloche qui se pose et se relève.
- Une ficelle de cuisine court dans la marge de chaque page et se noue sur les objets clés.

**L'accueil**
- Plat fumant en ouverture (vapeur animée qui suit la souris), titre qui se condense dans la vapeur.
- Sous les boutons : « ouvert maintenant » (ou la prochaine ouverture), calculé d'après les horaires, et la Saint-Sylvestre à 120 €, en liens.
- Bandeau de plats en mots géants, plateau du chef en 3D à faire tourner (quatre plats, la vapeur au-dessus), le chef qui dresse le suprême de pintade aux girolles au défilement, la cheminée en plein écran avec ses braises, les fêtes avec leurs comptes à rebours, les réceptions en carrousel 3D, la carte cadeau, venir.

**Les fonctionnalités restaurant (9 modules de la bibliothèque, réglés sans être réécrits)**
- La carte : ardoise à la craie (4 plats de saison), toute la carte réelle avec ses prix, filtres « végétarien » et « à partager » (le lien de l'ardoise amène directement aux plats végétariens), recherche.
- Les fêtes : menu de Noël (25 décembre au déjeuner, 79 €) et Saint-Sylvestre (120 €, 170 € avec les vins), accords mets et vins plat par plat.
- Réserver : plan de la salle en 3D (indicatif), la table choisie file vers le formulaire de réservation, prérempli (réservation simulée) ; ou accès direct au formulaire sans choisir de table.
- Offrir : carte cadeau de 25 à 200 € composée en direct, prénom et mot sur la carte, scellée dans son enveloppe (achat simulé).
- Infos pratiques : « ouvert maintenant » d'après les horaires (à confirmer), le numéro en grand, l'accès, journées festives, piscine et bar, demande de renseignements (simulée).

**Images**
- Photos du site actuel (plats, salle, cheminée, terrasse, réceptions), recadrées et compressées en plusieurs tailles ; 7 illustrations générées par IA, signalées « Illustration générée ».
- Une image de partage par page (1200×630).

**Mise en ligne**
- Site statique pour Vercel, non indexé (noindex) tant que c'est une maquette.
- Contrôlé par l'audit standard et la passe des formats, et par un test « vrai visiteur ».
