# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 10/11/2026 21:31:01 · 7 min · 1 page(s) · audit RAPIDE : ne vaut pas pour une livraison

## Résumé

- Statut : **49 échec(s)**
- Passe : `20261110-202351-rapide` · version ?v=6
- Échecs : **49**
- À regarder : **12**
- Non lancé : **1**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (6), mesures (7), films d’ouverture (2), films de transition (2), bords de l’écran (1), intro accélérable et passable (7), menu (1), clavier (1), liens et boutons (1), liens profonds (10), liens vers la page en cours (1), changements de hauteur (1), mode calme (2), bouton du mode calme (2), parcours du projet (1), tient dans l’écran (2), films des épinglages (1), fluidité (2), défilement selon l’appareil (5), mouvement (2), effets du plan (25), souris immobile (3), vitesse (1), captures (1)

## Grille wouahou

| Point | État | Détail |
|---|---|---|
| 1. L’effet signature se manipule | ✓ présent | accueil |
| 2. L’intro devient la page | ✓ présent | objet d’ouverture sur 7 page(s), versObjet dans l’intro |
| 3. La transition reprend le motif | ✓ présent | voile en cloche |
| 4. Quelque chose relie les sections et les pages | ✓ présent | sur les 7 page(s) |
| 5. Un titre fait l’événement sur chaque page | ✓ présent | sur les 7 page(s) |
| 6. La scène est un geste du métier | ⚠ à regarder | galerie générique sur / ; geste du métier sur / |
| 7. L’action principale a un retour physique | ✓ présent | sur /, /offrir, /receptions, /reserver |

Le script vérifie les marques (`data-grille`, `data-iris-centre`, forme du voile, `versObjet`) ; la force et la justesse de chaque point se jugent sur les captures et les films.

## Échecs

### image de partage (7)

- **image de partage** — `index.html` — fichier introuvable : /assets/partage/accueil-fr.jpg
- **image de partage** — `infos-pratiques.html` — fichier introuvable : /assets/partage/infos-pratiques-fr.jpg
- **image de partage** — `la-carte.html` — fichier introuvable : /assets/partage/la-carte-fr.jpg
- **image de partage** — `les-fetes.html` — fichier introuvable : /assets/partage/les-fetes-fr.jpg
- **image de partage** — `offrir.html` — fichier introuvable : /assets/partage/offrir-fr.jpg
- **image de partage** — `receptions.html` — fichier introuvable : /assets/partage/receptions-fr.jpg
- **image de partage** — `reserver.html` — fichier introuvable : /assets/partage/reserver-fr.jpg

### zone tactile sous 44 px (2)

- **zone tactile sous 44 px** — `/` — body#haut > header > div.entete-rangee > a.entete-logo — 40 × 44 px _(390×844 calme, 390×844 normal, 390×844 sansJs, 320×568 sansJs, 390×844 sansWebgl)_
- **zone tactile sous 44 px** — `/` — form.mini-resa > div.mini-resa__couverts > div.compteur > input — 43 × 35 px _(390×844 calme, 390×844 normal, 844×390 normal, 390×844 sansJs, 320×568 sansJs, 390×844 sansWebgl)_

### texte coupé (2)

- **texte coupé** — `/` — div.midi__texte.conteneur:nth-of-type(2) > h1.midi__titre > span.ligne-masque:nth-of-type(1) > span.midi__ligne « Midi au bord de l'eau, » — coupé par section#midi > div.midi__texte.conteneur:nth-of-type(2) > h1.midi__titre > span.ligne-masque:nth-of-type(1) « Midi au bord de l'eau, » _(390×844 calme, 1366×768 normal, 390×844 normal, 844×390 normal, 390×844 sansJs, 320×568 sansJs, +1)_
- **texte coupé** — `/` — div.midi__texte.conteneur:nth-of-type(2) > h1.midi__titre > span.ligne-masque:nth-of-type(2) > span.midi__ligne « minuit au coin du feu. » — coupé par section#midi > div.midi__texte.conteneur:nth-of-type(2) > h1.midi__titre > span.ligne-masque:nth-of-type(2) « minuit au coin du feu. » _(390×844 calme, 1366×768 normal, 390×844 normal, 844×390 normal, 390×844 sansJs, 320×568 sansJs, +1)_

### textes qui se chevauchent (10)

- **textes qui se chevauchent** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.heure-geante:nth-of-type(1) > span.hg__h:nth-of-type(1) « 12 » — avec div.midi__texte.conteneur:nth-of-type(2) > h1.midi__titre > span.ligne-masque:nth-of-type(1) > span.midi__ligne « Midi au bord de l'eau, » _(390×844 calme, 390×844 normal, 844×390 normal, 390×844 sansJs, 320×568 sansJs, 390×844 sansWebgl)_
- **textes qui se chevauchent** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.heure-geante:nth-of-type(1) > span.hg__sep:nth-of-type(2) « : » — avec div.midi__texte.conteneur:nth-of-type(2) > h1.midi__titre > span.ligne-masque:nth-of-type(1) > span.midi__ligne « Midi au bord de l'eau, » _(390×844 calme, 390×844 normal, 844×390 normal, 390×844 sansJs, 320×568 sansJs, 390×844 sansWebgl)_
- **textes qui se chevauchent** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.heure-geante:nth-of-type(1) > span.hg__m:nth-of-type(3) « 00 » — avec div.midi__texte.conteneur:nth-of-type(2) > h1.midi__titre > span.ligne-masque:nth-of-type(1) > span.midi__ligne « Midi au bord de l'eau, » _(390×844 calme, 390×844 normal, 844×390 normal, 390×844 sansJs, 320×568 sansJs, 390×844 sansWebgl)_
- **textes qui se chevauchent** — `/` — div.midi__texte.conteneur:nth-of-type(2) > h1.midi__titre > span.ligne-masque:nth-of-type(1) > span.midi__ligne « Midi au bord de l'eau, » — avec div.midi__texte.conteneur:nth-of-type(2) > h1.midi__titre > span.ligne-masque:nth-of-type(2) > span.midi__ligne « minuit au coin du feu. » _(390×844 calme, 1366×768 normal, 390×844 normal, 844×390 normal, 390×844 sansJs, 320×568 sansJs, +1)_
- **textes qui se chevauchent** — `/` — div.terrasse__cadre > div.terrasse__images:nth-of-type(1) > figure.media.terrasse__img:nth-of-type(1) > figcaption.mention-ia « Illustration générée » — avec div.terrasse__cadre > div.terrasse__images:nth-of-type(1) > figure.media.terrasse__img:nth-of-type(2) > figcaption.mention-ia « Illustration générée » _(390×844 calme, 390×844 sansJs, 320×568 sansJs)_
- **textes qui se chevauchent** — `/` — div.terrasse__cadre > div.terrasse__images:nth-of-type(1) > figure.media.terrasse__img:nth-of-type(1) > figcaption.mention-ia « Illustration générée » — avec div.terrasse__cadre > div.terrasse__images:nth-of-type(1) > figure.media.terrasse__img:nth-of-type(3) > figcaption.mention-ia « Illustration générée » _(390×844 calme, 390×844 sansJs, 320×568 sansJs)_
- **textes qui se chevauchent** — `/` — div.terrasse__cadre > div.terrasse__images:nth-of-type(1) > figure.media.terrasse__img:nth-of-type(2) > figcaption.mention-ia « Illustration générée » — avec div.terrasse__cadre > div.terrasse__images:nth-of-type(1) > figure.media.terrasse__img:nth-of-type(3) > figcaption.mention-ia « Illustration générée » _(390×844 calme, 390×844 sansJs, 320×568 sansJs)_
- **textes qui se chevauchent** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.heure-geante:nth-of-type(1) > span.hg__h:nth-of-type(1) « 12 » — avec section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.surtitre.midi__surtitre:nth-of-type(2) « RESTAURANT ET RÉCEPTIONS · MOINEVILLE, ENTRE METZ, » _(1366×768 normal)_
- **textes qui se chevauchent** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.heure-geante:nth-of-type(1) > span.hg__sep:nth-of-type(2) « : » — avec section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.surtitre.midi__surtitre:nth-of-type(2) « RESTAURANT ET RÉCEPTIONS · MOINEVILLE, ENTRE METZ, » _(1366×768 normal)_
- **textes qui se chevauchent** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.heure-geante:nth-of-type(1) > span.hg__m:nth-of-type(3) « 00 » — avec section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.surtitre.midi__surtitre:nth-of-type(2) « RESTAURANT ET RÉCEPTIONS · MOINEVILLE, ENTRE METZ, » _(1366×768 normal)_

### contraste insuffisant (7)

- **contraste insuffisant** — `/` — footer#pied > div.conteneur.pied-grille:nth-of-type(1) > div.pied-maison:nth-of-type(1) > p.pied-minuit:nth-of-type(1) « 00:00 » — 2.39:1 (minimum 3:1) _(390×844 calme, 1366×768 normal, 390×844 normal, 844×390 normal, 390×844 sansJs, 320×568 sansJs, +1)_
- **contraste insuffisant** — `/` — footer#pied > div.conteneur.pied-bas:nth-of-type(2) > p:nth-of-type(1) « Maquette : réservations, cartes cadeaux et demande » — 2.17:1 (minimum 4.5:1) _(390×844 calme, 1366×768 normal, 390×844 normal, 844×390 normal, 390×844 sansJs, 320×568 sansJs, +1)_
- **contraste insuffisant** — `/` — footer#pied > div.conteneur.pied-bas:nth-of-type(2) > p:nth-of-type(2) « Mentions légales : à compléter · Politique de conf » — 2.17:1 (minimum 4.5:1) _(390×844 calme, 1366×768 normal, 390×844 normal, 844×390 normal, 390×844 sansJs, 320×568 sansJs, +1)_
- **contraste insuffisant** — `/` — footer#pied > div.conteneur.pied-bas:nth-of-type(2) > p:nth-of-type(3) « © Les Jardins de l'Hacienda » — 2.17:1 (minimum 4.5:1) _(390×844 calme, 1366×768 normal, 390×844 normal, 844×390 normal, 390×844 sansJs, 320×568 sansJs, +1)_
- **contraste insuffisant** — `/` — header > div.entete-rangee > p.horloge > span.horloge__h:nth-of-type(1) « 12 » — 3.68:1 (minimum 4.5:1) _(390×844 normal)_
- **contraste insuffisant** — `/` — header > div.entete-rangee > p.horloge > span.horloge__sep:nth-of-type(2) « : » — 3.68:1 (minimum 4.5:1) _(390×844 normal)_
- **contraste insuffisant** — `/` — header > div.entete-rangee > p.horloge > span.horloge__m:nth-of-type(3) « 00 » — 3.68:1 (minimum 4.5:1) _(390×844 normal)_

### section sans visuel (1)

- **section sans visuel** — `/` — section#fetes « 23 h 30 Les menus des fêtes Jeudi 31 décembre, le  » _(390×844 calme, 1366×768 normal, 390×844 normal, 844×390 normal, 390×844 sansJs, 320×568 sansJs, +1)_

### accessibilité (axe) : color-contrast (1)

- **accessibilité (axe) : color-contrast** — `/` — .pied-minuit ; .pied-bas > p:nth-child(1) ; .pied-bas > p:nth-child(2) — Elements must meet minimum color contrast ratio thresholds _(390×844 calme)_

### accessibilité (axe) : link-name (1)

- **accessibilité (axe) : link-name** — `/` — .entete-logo — Links must have discernible text _(390×844 calme)_

### contraste sur image (3)

- **contraste sur image** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.heure-geante:nth-of-type(1) > span.hg__m:nth-of-type(3) « 00 » — 1.43:1 sur les 10 % de la photo les moins favorables (minimum 3:1) _(390×844 normal)_
- **contraste sur image** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.surtitre.midi__surtitre:nth-of-type(2) « RESTAURANT ET RÉCEPTIONS · MOINEVILLE, ENTRE METZ, » — 3.58:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1) _(1366×768 normal)_
- **contraste sur image** — `/` — div.midi__texte.conteneur:nth-of-type(2) > h1.midi__titre > span.ligne-masque:nth-of-type(2) > span.midi__ligne « minuit au coin du feu. » — 1.79:1 sur les 10 % de la photo les moins favorables (minimum 3:1) _(390×844 normal)_

### mini-resa (2)

- **mini-resa** — `/` — accueil → réserver : , couverts undefined _(390×844)_
- **mini-resa** — `/` — date undefined au lieu de 2026-11-11 _(390×844)_

### ne tient pas dans l’écran (9)

- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 85 px (à 4 % de la scène) _(1000×560 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.statut.midi__statut:nth-of-type(5) « Fermé · ouvre demain à 12 h » — coupé en bas de 37 px (à 4 % de la scène) _(1000×560 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > p.indice.midi__indice:nth-of-type(2) « PASSEZ LA MAIN SUR L'EAU » — coupé en bas de 71 px (à 4 % de la scène) _(1000×560 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 85 px (à 50 % de la scène) _(1000×560 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.statut.midi__statut:nth-of-type(5) « Fermé · ouvre demain à 12 h » — coupé en bas de 37 px (à 50 % de la scène) _(1000×560 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > p.indice.midi__indice:nth-of-type(2) « PASSEZ LA MAIN SUR L'EAU » — coupé en bas de 71 px (à 50 % de la scène) _(1000×560 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 85 px (à 96 % de la scène) _(1000×560 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.statut.midi__statut:nth-of-type(5) « Fermé · ouvre demain à 12 h » — coupé en bas de 37 px (à 96 % de la scène) _(1000×560 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > p.indice.midi__indice:nth-of-type(2) « PASSEZ LA MAIN SUR L'EAU » — coupé en bas de 71 px (à 96 % de la scène) _(1000×560 épinglé)_

### épinglage : image isolée différente (flash) (2)

- **épinglage : image isolée différente (flash)** — `/` — à 646 ms (films/epinglage-1.png) _(1366×768)_
- **épinglage : image isolée différente (flash)** — `/` — à 847 ms (films/epinglage-1.png) _(1366×768)_

### fluidité (2)

- **fluidité** — `/` — 5 % d'images de plus de 50 ms, tâche la plus longue 307 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_
- **fluidité** — `/` — 97 % d'images de plus de 50 ms, tâche la plus longue 122 ms _(390×844 défilement au doigt, processeur ralenti 4 fois)_

## À regarder

### « à compléter » visible (2)

- **« à compléter » visible** — `infos-pratiques.html` — 1 fois hors du pied de page : remplacer par une phrase vraie qui oriente le visiteur (« Tarifs selon la saison, donnés à la réservation ») ou retirer l'élément, et le noter dans la fiche du README (sauf sens propre : « dossier à compléter »)
- **« à compléter » visible** — `receptions.html` — 1 fois hors du pied de page : remplacer par une phrase vraie qui oriente le visiteur (« Tarifs selon la saison, donnés à la réservation ») ou retirer l'élément, et le noter dans la fiche du README (sauf sens propre : « dossier à compléter »)

### clearProps « all » (1)

- **clearProps « all »** — assets/js/modules/carte-cadeau-qui-se-compose/module.js : efface aussi les variables CSS posées dans le HTML ; nommer les propriétés (clearProps: 'transform,opacity')

### grille : galerie horizontale générique (point 6) (1)

- **grille : galerie horizontale générique (point 6)** — `/` — le métier a-t-il son geste (feuilleter un bac, empiler des planches, tourner les pages, ouvrir un tiroir) ? Modules bac-a-feuilleter, planches-empilees ; si la rangée qui défile est le geste du métier, ajouter data-grille="scene"

### transition : changement brusque (1)

- **transition : changement brusque** — `/ → /la-carte` — à 620 ms (différence 21 %) (films/transition-vers-la-carte-1366.png) _(1366×768 film)_

### retour avant : changement brusque (3)

- **retour avant : changement brusque** — `/la-carte` — à 81 ms (différence 66 %) (films/retour-avant-1366.png) _(1366×768 retour avant)_
- **retour avant : changement brusque** — `/la-carte` — à 106 ms (différence 22 %) (films/retour-avant-1366.png) _(1366×768 retour avant)_
- **retour avant : changement brusque** — `/la-carte` — à 82 ms (différence 50 %) (films/retour-avant-390.png) _(390×844 retour avant)_

### lien vers une ancre : changement brusque (2)

- **lien vers une ancre : changement brusque** — `/ → /reserver#formulaire` — à 357 ms (différence 21 %) (films/ancre-1366.png) _(1366×768 film)_
- **lien vers une ancre : changement brusque** — `/ → /reserver#formulaire` — à 697 ms (différence 43 %) (films/ancre-1366.png) _(1366×768 film)_

### effet qui ne bouge pas au défilement (2)

- **effet qui ne bouge pas au défilement** — `/` — button.bouton — carton : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/` — div.piste.apresmidi__piste — apres-midi : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(390×844 normal)_

## Non lancé

- **Safari (WebKit)** : WebKit ne peut pas s’installer ici : vérification à faire dans Safari sur le Mac (liste dans le rapport)

### À vérifier dans Safari sur le Mac (WebKit indisponible ici)

- Ouverture de chaque page : rien qui clignote, intro complète au premier chargement et au rechargement.
- Changement de page : le voile couvre l’écran, pas de page blanche ; retour arrière sans intro ni voile resté.
- Défilement : fluide (natif), en-tête qui se cache et revient sans clignoter, sections épinglées entières.
- Menu sur iPhone (mode Responsive de Safari) : ouverture, fermeture, page bloquée derrière.
- Polices, images, mention « Illustration générée », formulaires et barre fixe du bas.

## Repères

- Numéro de version des fichiers : ?v=6
- Journal v6 : 2 étape(s) notée(s), 31 min de travail pour 35 min de budget, 2 min d’attente de l’utilisateur.
- Audit rapide : étapes lourdes sur /.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Balayage des largeurs : non fait en audit rapide.
- Ouverture / (1366×768) : 2651 ms depuis le premier octet
- Ouverture / (390×844) : 2567 ms depuis le premier octet
- Bords de l’écran : 85 images d’intro, 2 de voile et 26 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Vitesse / : 0.78 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --rapide --seulement=fichiers,mesures,parcours,ecran,fluidite
```
