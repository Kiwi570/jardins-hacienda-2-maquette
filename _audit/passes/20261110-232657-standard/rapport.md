# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 11/11/2026 00:52:40 · 26 min · 8 page(s) · audit standard

## Résumé

- Statut : **44 échec(s)**
- Passe : `20261110-232657-standard` · version ?v=6
- Échecs : **44**
- À regarder : **14**
- Non lancé : **1**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (6), mesures (112), balayage (7), films d’ouverture (14), films de transition (14), bords de l’écran (8), intro accélérable et passable (7), menu (1), clavier (8), liens et boutons (8), liens profonds (15), liens vers la page en cours (7), changements de hauteur (7), mode calme (14), bouton du mode calme (2), parcours du projet (1), tient dans l’écran (5), films des épinglages (1), fluidité (14), défilement selon l’appareil (5), mouvement (14), effets du plan (25), souris immobile (5), vitesse (7), captures (1)

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

## Passes de cette version (?v=6)

Chaque passe garde son rapport dans `_audit/passes/` : une relance ciblée ne fait pas disparaître la preuve d’une passe plus large.

| Passe | Niveau | Pages | Étapes | Échecs | À regarder | Non lancé | Statut |
|---|---|---|---|---:|---:|---:|---|
| 20261110-202351-rapide | rapide | toutes | toutes | 49 | 12 | 1 | échecs |
| 20261110-203603-rapide-cible | rapide | /,/la-carte,/les-fetes,/receptions,/reserver,/offrir,/infos-pratiques | toutes | 196 | 19 | 2 | échecs |
| 20261110-210108-rapide-cible-partiel | rapide | /,/la-carte,/les-fetes,/receptions,/reserver,/offrir,/infos-pratiques | mesures, films, parcours, fluidite | 25 | 8 | 1 | échecs |
| 20261110-212010-rapide-cible-partiel | rapide | /,/la-carte,/les-fetes,/receptions,/reserver,/offrir,/infos-pratiques | mesures, parcours, fluidite | 6 | 1 | 0 | échecs |
| 20261110-213238-rapide-cible-partiel | rapide | /,/receptions,/reserver | fichiers, mesures, parcours | 8 | 3 | 0 | échecs |
| **20261110-232657-standard** (celle-ci) | standard | toutes | toutes | 44 | 14 | 1 | échecs |

## Échecs

### premier écran : bouton principal hors de l’écran (2)

- **premier écran : bouton principal hors de l’écran** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.midi__actions:nth-of-type(5) > a.bouton:nth-of-type(1) « Réserver une table » _(320×568 normal, 1366×768 sansJs)_
- **premier écran : bouton principal hors de l’écran** — `/404` — section#debut > div.conteneur.introuvable__texte > p.introuvable__actions:nth-of-type(3) > a.bouton:nth-of-type(1) « Revenir à midi » _(1366×768 sansJs)_

### texte coupé (1)

- **texte coupé** — `/` — section#terrasse > div.terrasse__cadre > div.terrasse__texte.conteneur:nth-of-type(2) > p.saison-tag.saison-tag--nuit:nth-of-type(4) « La terrasse l'été, la salle et sa cheminée l'hiver » — coupé par section#terrasse > div.terrasse__cadre « Illustration générée Illustration générée Illustra » _(320×568 normal)_

### élément recouvert (1)

- **élément recouvert** — `/` — div.dejeuner__texte:nth-of-type(1) > ol.passe > li.passe__plat:nth-of-type(5) > span.passe__prix:nth-of-type(3) « 9 € » — par div.conteneur.dejeuner__grille > div.dejeuner__visuel:nth-of-type(2) > div.dejeuner__vraies > figure.media.vraie:nth-of-type(1) _(768×1024 normal)_

### premier écran : information clé hors de l’écran (2)

- **premier écran : information clé hors de l’écran** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu > p.ouv-fetes__info:nth-of-type(5) « 120 € le menu · 79 € par personne, hors boissons » _(320×568 normal)_
- **premier écran : information clé hors de l’écran** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > p.ouv-recep__info:nth-of-type(5) « Appeler 06 18 21 28 10 » _(320×568 normal)_

### positions non recalculées après un changement de hauteur (1)

- **positions non recalculées après un changement de hauteur** — `/` — ▶ — décalage de 2967 px _(1366×768)_

### ne tient pas dans l’écran (36)

- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 8 px (à 4 % de la scène) _(1000×560 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 8 px (à 50 % de la scène) _(1000×560 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 8 px (à 96 % de la scène) _(1000×560 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 69 px (à 4 % de la scène) _(1280×720 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > p.indice.midi__indice:nth-of-type(2) « PASSEZ LA MAIN SUR L'EAU » — coupé en bas de 55 px (à 4 % de la scène) _(1280×720 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 69 px (à 50 % de la scène) _(1280×720 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > p.indice.midi__indice:nth-of-type(2) « PASSEZ LA MAIN SUR L'EAU » — coupé en bas de 55 px (à 50 % de la scène) _(1280×720 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 69 px (à 96 % de la scène) _(1280×720 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > p.indice.midi__indice:nth-of-type(2) « PASSEZ LA MAIN SUR L'EAU » — coupé en bas de 55 px (à 96 % de la scène) _(1280×720 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 39 px (à 4 % de la scène) _(1366×768 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > p.indice.midi__indice:nth-of-type(2) « PASSEZ LA MAIN SUR L'EAU » — coupé en bas de 25 px (à 4 % de la scène) _(1366×768 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 39 px (à 50 % de la scène) _(1366×768 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > p.indice.midi__indice:nth-of-type(2) « PASSEZ LA MAIN SUR L'EAU » — coupé en bas de 25 px (à 50 % de la scène) _(1366×768 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 39 px (à 96 % de la scène) _(1366×768 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > p.indice.midi__indice:nth-of-type(2) « PASSEZ LA MAIN SUR L'EAU » — coupé en bas de 25 px (à 96 % de la scène) _(1366×768 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 152 px (à 4 % de la scène) _(1440×900 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.midi__actions:nth-of-type(5) « Réserver une table Demander une réception » — coupé en bas de 63 px (à 4 % de la scène) _(1440×900 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.midi__actions:nth-of-type(5) > a.bouton:nth-of-type(1) « Réserver une table » — coupé en bas de 63 px (à 4 % de la scène) _(1440×900 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.midi__actions:nth-of-type(5) > a.bouton.bouton--contour:nth-of-type(2) « Demander une réception » — coupé en bas de 63 px (à 4 % de la scène) _(1440×900 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > p.indice.midi__indice:nth-of-type(2) « PASSEZ LA MAIN SUR L'EAU » — coupé en bas de 138 px (à 4 % de la scène) _(1440×900 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 152 px (à 50 % de la scène) _(1440×900 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.midi__actions:nth-of-type(5) « Réserver une table Demander une réception » — coupé en bas de 63 px (à 50 % de la scène) _(1440×900 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.midi__actions:nth-of-type(5) > a.bouton:nth-of-type(1) « Réserver une table » — coupé en bas de 63 px (à 50 % de la scène) _(1440×900 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.midi__actions:nth-of-type(5) > a.bouton.bouton--contour:nth-of-type(2) « Demander une réception » — coupé en bas de 63 px (à 50 % de la scène) _(1440×900 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > p.indice.midi__indice:nth-of-type(2) « PASSEZ LA MAIN SUR L'EAU » — coupé en bas de 138 px (à 50 % de la scène) _(1440×900 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 152 px (à 96 % de la scène) _(1440×900 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.midi__actions:nth-of-type(5) « Réserver une table Demander une réception » — coupé en bas de 63 px (à 96 % de la scène) _(1440×900 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.midi__actions:nth-of-type(5) > a.bouton:nth-of-type(1) « Réserver une table » — coupé en bas de 63 px (à 96 % de la scène) _(1440×900 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.midi__actions:nth-of-type(5) > a.bouton.bouton--contour:nth-of-type(2) « Demander une réception » — coupé en bas de 63 px (à 96 % de la scène) _(1440×900 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > p.indice.midi__indice:nth-of-type(2) « PASSEZ LA MAIN SUR L'EAU » — coupé en bas de 138 px (à 96 % de la scène) _(1440×900 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 45 px (à 4 % de la scène) _(1920×1080 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > p.indice.midi__indice:nth-of-type(2) « PASSEZ LA MAIN SUR L'EAU » — coupé en bas de 31 px (à 4 % de la scène) _(1920×1080 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 45 px (à 50 % de la scène) _(1920×1080 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > p.indice.midi__indice:nth-of-type(2) « PASSEZ LA MAIN SUR L'EAU » — coupé en bas de 31 px (à 50 % de la scène) _(1920×1080 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 45 px (à 96 % de la scène) _(1920×1080 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > p.indice.midi__indice:nth-of-type(2) « PASSEZ LA MAIN SUR L'EAU » — coupé en bas de 31 px (à 96 % de la scène) _(1920×1080 épinglé)_

### fluidité (1)

- **fluidité** — `/` — 5 % d'images de plus de 50 ms, tâche la plus longue 314 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

## À regarder

### « à compléter » visible (2)

- **« à compléter » visible** — `infos-pratiques.html` — 1 fois hors du pied de page : remplacer par une phrase vraie qui oriente le visiteur (« Tarifs selon la saison, donnés à la réservation ») ou retirer l'élément, et le noter dans la fiche du README (sauf sens propre : « dossier à compléter »)
- **« à compléter » visible** — `receptions.html` — 1 fois hors du pied de page : remplacer par une phrase vraie qui oriente le visiteur (« Tarifs selon la saison, donnés à la réservation ») ou retirer l'élément, et le noter dans la fiche du README (sauf sens propre : « dossier à compléter »)

### clearProps « all » (1)

- **clearProps « all »** — assets/js/modules/carte-cadeau-qui-se-compose/module.js : efface aussi les variables CSS posées dans le HTML ; nommer les propriétés (clearProps: 'transform,opacity')

### grille : galerie horizontale générique (point 6) (1)

- **grille : galerie horizontale générique (point 6)** — `/` — le métier a-t-il son geste (feuilleter un bac, empiler des planches, tourner les pages, ouvrir un tiroir) ? Modules bac-a-feuilleter, planches-empilees ; si la rangée qui défile est le geste du métier, ajouter data-grille="scene"

### au retour avant, élément qui réapparaît en s’animant (1)

- **au retour avant, élément qui réapparaît en s’animant** — `/la-carte` — div.ouv-carte__photo > figure.media.ouv-carte__img > video.media-video.media-video--vapeur _(1366×768 retour avant)_

### retour arrière : changement brusque (1)

- **retour arrière : changement brusque** — `/` — à 72 ms (différence 65 %) (films/retour-arrière-390.png) _(390×844 retour arrière)_

### rechargement au milieu de la page (1)

- **rechargement au milieu de la page** — `/la-carte` — écran différent à la même position après rechargement (12.2 %), voir comparaisons/rechargement-la-carte-*.png _(1366×768)_

### effet qui ne bouge pas au défilement (7)

- **effet qui ne bouge pas au défilement** — `/` — button.bouton — carton : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/infos-pratiques` — span.heure-geante.ouv-infos__heure — axes : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/la-carte` — p.heure-geante.ouv-carte__heure — axes : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/offrir` — p.heure-geante.heure-geante--nuit — axes : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/receptions` — p.heure-geante.heure-geante--nuit — axes : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/receptions` — div.invitation — invitation : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/la-carte` — section#debut.ouv-carte — moment : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(390×844 normal)_

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
- Journal v6 : 6 étape(s) notée(s), 164 min de travail pour 135 min de budget, 2 min d’attente de l’utilisateur.
- Journal : « construction : contact et page de catégorie » 14 min pour 10 prévues.
- Journal : « audit rapide et corrections (images provisoires) » 76 min pour 35 prévues.
- Audit standard : étapes lourdes sur /, /infos-pratiques, /la-carte, /les-fetes, /offrir, /receptions, /reserver.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Ouverture / (1366×768) : 2667 ms depuis le premier octet
- Ouverture /infos-pratiques (1366×768) : 2535 ms depuis le premier octet
- Ouverture /la-carte (1366×768) : 2514 ms depuis le premier octet
- Ouverture /les-fetes (1366×768) : 2498 ms depuis le premier octet
- Ouverture /offrir (1366×768) : 2522 ms depuis le premier octet
- Ouverture /receptions (1366×768) : 2456 ms depuis le premier octet
- Ouverture /reserver (1366×768) : 2486 ms depuis le premier octet
- Ouverture / (390×844) : 2585 ms depuis le premier octet
- Ouverture /infos-pratiques (390×844) : 2489 ms depuis le premier octet
- Ouverture /la-carte (390×844) : 2493 ms depuis le premier octet
- Ouverture /les-fetes (390×844) : 2484 ms depuis le premier octet
- Ouverture /offrir (390×844) : 2451 ms depuis le premier octet
- Ouverture /receptions (390×844) : 2486 ms depuis le premier octet
- Ouverture /reserver (390×844) : 2465 ms depuis le premier octet
- bords de l’écran / 1920×1080 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Bords de l’écran : 661 images d’intro, 34 de voile et 217 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Tient dans l'écran /infos-pratiques : aucune section épinglée ou plein écran.
- Tient dans l'écran /la-carte : aucune section épinglée ou plein écran.
- Tient dans l'écran /les-fetes : aucune section épinglée ou plein écran.
- Tient dans l'écran /offrir : aucune section épinglée ou plein écran.
- Tient dans l'écran /receptions : aucune section épinglée ou plein écran.
- Tient dans l'écran /reserver : aucune section épinglée ou plein écran.
- Fluidité /infos-pratiques 1366×768 (molette) : 0 % d'images lentes sur 219, tâche la plus longue 0 ms
- Fluidité /la-carte 1366×768 (molette) : 0 % d'images lentes sur 289, tâche la plus longue 0 ms
- Fluidité /les-fetes 1366×768 (molette) : 0 % d'images lentes sur 226, tâche la plus longue 0 ms
- Fluidité /offrir 1366×768 (molette) : 0 % d'images lentes sur 128, tâche la plus longue 0 ms
- Fluidité /receptions 1366×768 (molette) : 0 % d'images lentes sur 187, tâche la plus longue 0 ms
- Fluidité /reserver 1366×768 (molette) : 0 % d'images lentes sur 213, tâche la plus longue 0 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1401, tâche la plus longue 76 ms
- Fluidité /infos-pratiques 390×844 (doigt) : 0 % d'images lentes sur 1345, tâche la plus longue 0 ms
- Fluidité /la-carte 390×844 (doigt) : 0 % d'images lentes sur 1347, tâche la plus longue 0 ms
- Fluidité /les-fetes 390×844 (doigt) : 0 % d'images lentes sur 1412, tâche la plus longue 0 ms
- Fluidité /offrir 390×844 (doigt) : 0 % d'images lentes sur 1412, tâche la plus longue 0 ms
- Fluidité /receptions 390×844 (doigt) : 0 % d'images lentes sur 1342, tâche la plus longue 0 ms
- Fluidité /reserver 390×844 (doigt) : 0 % d'images lentes sur 1335, tâche la plus longue 0 ms
- Vitesse / : 0.71 s de calcul au chargement (téléphone ralenti).
- Vitesse /infos-pratiques : 0.35 s de calcul au chargement (téléphone ralenti).
- Vitesse /la-carte : 0.41 s de calcul au chargement (téléphone ralenti).
- Vitesse /les-fetes : 0.42 s de calcul au chargement (téléphone ralenti).
- Vitesse /offrir : 0.36 s de calcul au chargement (téléphone ralenti).
- Vitesse /receptions : 0.41 s de calcul au chargement (téléphone ralenti).
- Vitesse /reserver : 0.40 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --pages=/,/404,/les-fetes,/receptions --seulement=fichiers,mesures,parcours,ecran,fluidite
```
