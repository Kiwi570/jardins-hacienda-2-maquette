# Les 46 modules « restaurant » de la bibliothèque dans la v7

Bibliothèque au commit b5ce0ba (11 novembre 2026). 46 modules portent « restaurant » dans `convient_a`.
Règle suivie : un module par endroit, accroché à l'heure ou au geste de la page (jamais une suite de gadgets).

## Dans la maquette : 17 modules

| Module | Où | Ce qu'il fait ici |
|---|---|---|
| ardoise-a-la-craie | La carte, ouverture | L'ardoise de la semaine, à la craie (Caveat) ; « Passer au dîner » l'efface au chiffon et écrit celle du soir. `donnees/ardoise.json` |
| carte-du-restaurant | La carte | Toute la carte, filtres, recherche (v6) |
| assiette-qui-se-dresse | La carte, « Sur la passe » | Une vraie assiette du chef se dresse au défilement : la photo du site découpée en couches (purée, pièce rôtie, girolles, légumes, herbes) posées nettes sur la même assiette floue ; étapes sans cadres |
| plat-fumant | Accueil, 21 h | La vapeur monte de la vraie assiette devant la cheminée et s'écarte sous la main (remplace la boucle vidéo) |
| givre-webgl | Les fêtes, ouverture (hiver) | Le décompte de la Saint-Sylvestre derrière une vitre givrée qui fond sous la main ; installé seulement l'hiver |
| agenda-des-dates | Les fêtes, « Les prochaines dates » | Soirées des affiches du site, brunch, Noël, Saint-Sylvestre ; ajout à l'agenda, « Réserver » au bon jour, dates passées. `donnees/agenda.json` |
| accords-mets-et-vins | Les fêtes, Saint-Sylvestre | Le verre change de forme et de couleur (v6) |
| depliant-3d | Les fêtes, Noël | Le menu de Noël en trois volets qui s'ouvre au défilement, couverture d'abord |
| rideau-en-lanieres | Réceptions | Le voile violet de 19 h s'ouvre en palmes qui s'écartent (seulement à l'arrivée depuis une autre page, jamais après l'intro) |
| reservation-de-table | Réserver | (v6) habillé sans cadres : pastilles, ticket dentelé |
| plan-de-salle | Réserver | (v6) liste des tables en lignes |
| envol-vers-le-panier | Réserver | La carte de placement s'envole vers le récapitulatif (v6) |
| carte-cadeau-qui-se-compose | Offrir | (v6) |
| ciel-en-direct | Infos pratiques, ouverture | Le ciel réel de Moineville (soleil, lune, étoiles calculés) derrière la vraie enseigne détourée ; curseur pour une autre heure |
| horaires-ouvert-maintenant | Infos pratiques | Cadran des horaires (v6) |
| formulaire-par-etapes | Infos pratiques, « Une question » | Sujet en grandes cartes avec icône, message, coordonnées, vérification ; envoi simulé |
| lumiere-au-pointeur | Page fermée (404) | La salle dans le noir, une bougie suit la main |

## Déjà présents sous une autre forme (le site a son propre équivalent)

| Module | Équivalent dans la maquette |
|---|---|
| eau-qui-refracte | L'eau de midi (WebGL propre à l'accueil, ronds sous le doigt) |
| intro-vers-l-objet | L'intro « 00:00 → heure de la page » qui glisse jusqu'à la grande heure (socle, `versObjet`) |
| axes-au-defilement | Les chiffres des heures, larges et fins à midi, serrés et gras à minuit |
| fil-conducteur | L'horloge de l'en-tête qui suit la journée |
| transition-iris, transition-vague | La transition en assiette (cloche), désormais un ciel entre deux heures |
| galerie-horizontale-epinglee | Remplacée par le panorama de 14 h 30 (la galerie générique était le point faible de la v6) |
| objet-a-faire-tourner | Le cadran des horaires qu'on fait tourner |
| texte-grave-en-direct | La carte cadeau qui s'écrit en direct |

## Écartés, et pourquoi

| Module | Raison |
|---|---|
| temoignages-en-pile | Aucun vrai témoignage sur le site : rien n'est inventé |
| tarifs-a-rouleaux, composeur-de-formule | Pas de formules à prix composés sur le site (la carte a ses prix, les fêtes leurs menus) |
| catalogue-filtres-flip, panier-en-tiroir | Pas de vente en ligne |
| lecteur-reactif-au-son | Aucun extrait sonore fourni |
| manifeste-mot-a-mot, frise-tracee | Pas de texte de manifeste ni de chiffres à faire compter sur le site |
| document-a-feuilleter | Le menu qui se feuillette ferait doublon avec le dépliant de Noël ; à garder pour une carte des vins si le restaurant en fournit une |
| carte-a-calques | La carte d'accès est dessinée sur mesure (Moselle, A31, frontière, distances) ; à reprendre si l'on veut des calques (parkings, arrêts de bus) |
| fond-qui-se-consume, pluie-sur-vitre, revelation-a-l-encre, trame-photo | Effets d'ouverture : chaque page a déjà le sien (givre, ciel, ardoise, lanières, bougie) ; un de plus referait la « suite de gadgets » |
| carrousel-3d, cadenas-a-molettes, bac-a-feuilleter, planches-empilees | Gadgets sans geste du métier ici (le carrousel avait été retiré en v6) |
| telephone-epingle, visite-guidee | Pas d'application ni d'interface à présenter |

## Observations pour la bibliothèque

- givre-webgl et lumiere-au-pointeur demandent OGL : l'adaptateur du projet le charge à la demande (`assets/js/socle/socle.js`).
- givre-webgl redessinait son shader plein écran à chaque image (200 ms par image sur processeur ralenti) : la copie du projet ne redessine que si l'image change, jamais pendant le défilement, et démarre à demi-résolution (pleine résolution seulement si le rendu est rapide) ; à reprendre dans la bibliothèque.
- assiette-qui-se-dresse : sans `--ecran-h` défini, la scène épinglée fait 0 px (déjà signalé en v5). Le dessin plat est son point faible (refusé deux fois) ; la variante « vraie photo en couches » marche : couches détourées d'une seule photo (polygones adoucis, chacune sans les suivantes), fond = la même photo floue et assombrie, puis la photo nette à la fin. À documenter dans le module.
- lumiere-au-pointeur : dans une section en `display: grid`, son `justify-content: flex-end` pousse le texte à droite ; à forcer en colonne pleine.
- rideau-en-lanieres : à coordonner avec le voile du socle (il ne joue qu'à l'arrivée par le voile) ; le bouton « Passer » visible un instant est relevé par l'audit des transitions.
- formulaire-par-etapes et rideau-en-lanieres : `clearProps: 'all'` relevé par l'audit (à nommer).
- agenda-des-dates : le lien « Réserver » reçoit la date avec l'heure (`2026-12-25T12:00`) ; le formulaire du projet attend la date seule ; la phrase « Prochaine date : » sans espace insécable.
- ciel-en-direct : `mer: false` pour un lieu sans mer ; sous un premier plan détouré, la boîte de texte se remplace par un halo.
