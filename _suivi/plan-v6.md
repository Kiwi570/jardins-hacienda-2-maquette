# Plan v6 « De midi à minuit » (10 novembre 2026)

Réponses : direction A ; 6 pages + Réceptions ; 10 images Grok + 3 boucles ; midi à minuit, saison affichée.
Garder (code, pas l'habillage) : réservation et carte de placement, plan de salle, carte cadeau qui s'écrit et enveloppe,
données (carte, fêtes, horaires, accords), accords de la Saint-Sylvestre, transition en assiette (voile « cloche »), statut ouvert/fermé.
Retirer : capacité « 120 sous la pergola » (absente du relevé), cadran de saison, plateau, assiette dessinée, ardoise, nappe vide, cadres à bordure.

## Accueil : une journée, réglée sur les heures de la maison (9 écrans ordinateur)
| Heure | Section | Ce qu'on voit et fait | Effet au défilement | Saison affichée |
|---|---|---|---|---|
| 12 h | Ouverture | Piscine à midi plein écran ; l'eau ondule sous le doigt (WebGL) ; « 12:00 » géant ; titre « Midi au bord de l'eau, minuit au coin du feu » ; Réserver une table · Demander une réception ; statut réel | eau, titre, lumière qui commence à dorer | Piscine : de juin à septembre |
| 12 h 30 | Le déjeuner | La carte de la semaine : plats et prix réels qui arrivent sur la passe, assiette de midi, 3 vraies photos en petit | passe (lignes en cascade), parallaxe | Toute l'année |
| 14 h 30 → 18 h | L'après-midi | Rangée qui avance de côté : piscine (dim. 14 h 30), bar (15 h 30, journées festives), journées festives (mar.-jeu. 12 h-19 h), pool parties ; la lumière dore | défilement horizontal, chiffres qui roulent | De juin à septembre |
| 19 h | La terrasse s'allume | Scène épinglée : la même table de réception passe de l'or à l'heure bleue puis à la nuit, les ampoules s'allument une à une (toucher pour allumer) ; mariages, baptêmes, anniversaires, pots de départ → Réceptions | ambiance, guirlandes | Terrasse l'été, salle l'hiver |
| 21 h | Le dîner | Assiette du soir + vapeur ; réserver dans la page (jour, service, couverts) ; la carte de placement s'envole vers Réserver | vapeur, carton | Toute l'année |
| 23 h | Au coin du feu | La fenêtre éclairée de la salle s'ouvre jusqu'au plein écran ; flamme ; braises qu'on attise ; Saint-Sylvestre (décompte) et Noël | plein écran, braises | Cet hiver |
| Minuit | Offrir et venir | Carte cadeau (25 à 200 €, 6 mois) ; adresse, carte d'accès, statut ; pied de page de nuit | carte qui s'écrit, tracé | Toute l'année |

Intro (2,4 s) : 0 s fond blanc de midi, « 00:00 » au centre ; 0,5 s les chiffres roulent jusqu'à « 12:00 » et la lumière s'ouvre derrière ;
1,2 s « 12:00 » glisse à sa place dans l'ouverture (versObjet) ; 1,6 s la piscine se découvre depuis la ligne d'eau, l'eau bouge ;
2 s titre ligne par ligne ; 2,4 s boutons et statut.

## Grille wouahou
1. Manipuler : l'eau de midi (ondes au doigt) ; à 23 h les braises qu'on attise.
2. L'intro devient la page : « 12:00 » de l'intro devient l'heure géante de l'ouverture.
3. Voile : la transition en assiette gardée, habillée de la couleur de l'heure d'arrivée et de ses chiffres.
4. Fil : l'heure et la lumière (horloge de l'en-tête qui suit le défilement ; chaque page a son heure).
5. Typo : chiffres de l'heure en Bricolage Grotesque variable (larges et fins à midi, serrés et gras à minuit).
6. Scène : la terrasse s'allume (épinglée, geste : allumer).
7. Retour : carte de placement qui s'envole ; carton sous la cloche (Réserver) ; carton d'invitation tamponné (Réceptions) ; enveloppe (Offrir).
8. Familles : ambiance-qui-change (signature), webgl, defilement-horizontal, plein-ecran, particules (+ video-pilotee si terrasse-crepuscule est bonne).

## Pages (ouverture et signature propres)
- La carte (12 h 30 ou 20 h 30, heure réelle) : écran partagé, « Le déjeuner » / « Le dîner » selon l'heure, bascule qui rallume la page ; carte en grand index typographique, filtres (module) ; photo du service.
- Les fêtes (23 h) : décompte géant de la Saint-Sylvestre sur la salle au feu (hiver) / la piscine en fête (été) ; bascule Cet hiver / Cet été ; Noël plat par plat sous cloche ; accords qui remplissent le verre ; soirées passées « a eu lieu ».
- Réceptions (19 h, nouvelle) : panorama de la terrasse de nuit ; trois espaces en volets (salle et cheminée, terrasse et pergola, piscine et jardins) avec leur saison ; demande en 3 étapes ; carton d'invitation tamponné.
- Réserver (heure du service choisi) : formulaire d'abord ; la page prend la lumière du service (midi clair, soir nuit) ; plan de salle ; carton sous la cloche.
- Offrir (minuit) : la carte qui s'écrit à la lueur du feu ; enveloppe ; texte selon la saison.
- Infos pratiques (heure réelle) : « Il est 21 h 04 à Moineville » en chiffres géants, photo de l'heure, statut, cadran des horaires, accès, contact.
- 404 : « Cette page a fermé à minuit ».
