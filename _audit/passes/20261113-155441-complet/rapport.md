# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 13/11/2026 17:31:37 · 37 min · 9 page(s) · audit complet

## Résumé

- Statut : **5 échec(s)**
- Passe : `20261113-155441-complet` · version ?v=7
- Échecs : **5**
- À regarder : **34**
- Non lancé : **1**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (6), mesures (288), balayage (8), films d’ouverture (16), films de transition (16), bords de l’écran (9), intro accélérable et passable (7), menu (1), clavier (9), liens et boutons (9), liens profonds (16), liens vers la page en cours (8), changements de hauteur (7), mode calme (16), bouton du mode calme (2), parcours du projet (1), tient dans l’écran (8), fluidité (16), défilement selon l’appareil (5), mouvement (16), effets du plan (31), souris immobile (4), vitesse (8), captures (1)

## Grille wouahou

| Point | État | Détail |
|---|---|---|
| 1. L’effet signature se manipule | ✓ présent | accueil |
| 2. L’intro devient la page | ✓ présent | objet d’ouverture sur 8 page(s), versObjet dans l’intro |
| 3. La transition reprend le motif | ✓ présent | voile en cloche |
| 4. Quelque chose relie les sections et les pages | ✓ présent | sur les 8 page(s) |
| 5. Un titre fait l’événement sur chaque page | ⚠ à regarder | présent sur /la-carte, /offrir, /receptions ; absent sur /a-emporter, /, /infos-pratiques, /les-fetes, /reserver |
| 6. La scène est un geste du métier | ✓ présent | geste du métier sur /la-carte, /receptions |
| 7. L’action principale a un retour physique | ✓ présent | sur /, /les-fetes, /offrir, /receptions, /reserver |

Le script vérifie les marques (`data-grille`, `data-iris-centre`, forme du voile, `versObjet`) ; la force et la justesse de chaque point se jugent sur les captures et les films.

## Passes de cette version (?v=7)

Chaque passe garde son rapport dans `_audit/passes/` : une relance ciblée ne fait pas disparaître la preuve d’une passe plus large.

| Passe | Niveau | Pages | Étapes | Échecs | À regarder | Non lancé | Statut |
|---|---|---|---|---:|---:|---:|---|
| 20261111-143746-standard | standard | toutes | toutes | 59 | 11 | 9 | échecs |
| 20261111-145453-standard | standard | toutes | toutes | 18 | 16 | 1 | échecs |
| 20261111-152604-standard-partiel | standard | toutes | fichiers, mesures, parcours, ecran, mouvement | 8 | 19 | 1 | échecs |
| 20261111-154358-standard-partiel | standard | toutes | fichiers, mesures, parcours | 0 | 11 | 0 | complet |
| 20261111-160415-complet | complet | toutes | toutes | 7 | 17 | 1 | échecs |
| 20261111-164058-complet-cible-partiel | complet | /,/infos-pratiques,/les-fetes,/offrir | fichiers, mesures, ecran, fluidite, films | 8 | 7 | 0 | échecs |
| 20261111-165328-complet-cible-partiel | complet | /,/les-fetes | fichiers, mesures, fluidite | 1 | 5 | 0 | échecs |
| 20261111-170054-complet-cible-partiel | complet | /,/les-fetes | fichiers, fluidite | 1 | 3 | 0 | échecs |
| 20261111-170600-complet-cible-partiel | complet | /,/les-fetes | fichiers, fluidite | 0 | 3 | 0 | complet |
| 20261111-170737-standard-partiel | standard | toutes | fichiers | 0 | 0 | 0 | complet |
| 20261111-172230-standard-cible-partiel | standard | /,/infos-pratiques | fichiers, mesures, parcours, ecran, mouvement, fluidite | 1 | 3 | 0 | échecs |
| 20261111-173013-standard-cible-partiel | standard | / | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261111-174242-standard-cible-partiel | standard | / | fichiers, mesures, ecran, mouvement | 1 | 1 | 0 | échecs |
| 20261111-174438-standard-cible-partiel | standard | / | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261111-175350-standard-cible-partiel | standard | / | fichiers, mesures, parcours, ecran, mouvement, fluidite | 8 | 1 | 0 | échecs |
| 20261111-180131-standard-cible-partiel | standard | / | fichiers, mesures, parcours, ecran, fluidite | 0 | 1 | 0 | complet |
| 20261111-182021-complet | complet | toutes | toutes | 0 | 15 | 1 | complet |
| 20261111-185503-complet-cible-partiel | complet | /,/la-carte,/les-fetes,/receptions | fichiers, mesures, parcours | 3 | 2 | 0 | échecs |
| 20261111-190530-complet-cible-partiel | complet | /,/receptions | fichiers, mesures | 0 | 1 | 0 | complet |
| 20261112-134303-complet-partiel | complet | toutes | fichiers, mesures, parcours, ecran, mouvement | 13 | 0 | 6 | échecs |
| 20261112-141822-complet-cible | complet | /,/receptions | toutes | 78 | 7 | 1 | échecs |
| 20261112-143325-complet-partiel | complet | toutes | fichiers, grille, mesures, parcours, mouvement | 18 | 17 | 0 | échecs |
| 20261112-145451-complet-cible-partiel | complet | /,/infos-pratiques,/offrir,/reserver | fichiers, mesures, parcours, mouvement | 1 | 3 | 0 | échecs |
| 20261112-150636-standard-cible-partiel | standard | / | fichiers | 0 | 0 | 0 | complet |
| 20261112-151818-complet-cible-partiel | complet | / | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261112-153451-complet | complet | toutes | toutes | 18 | 13 | 26 | échecs |
| 20261112-155520-complet | complet | toutes | toutes | 35 | 7 | 71 | échecs |
| 20261112-160545-complet | complet | toutes | toutes | 73 | 24 | 1 | échecs |
| 20261112-164240-complet-partiel | complet | toutes | fichiers, mesures, films, parcours, ecran | 2 | 16 | 0 | échecs |
| 20261112-174546-complet-cible-partiel | complet | /receptions | fichiers, mesures, ecran, mouvement | 0 | 2 | 0 | complet |
| 20261112-174741-complet-cible-partiel | complet | /receptions | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261112-175857-complet-cible-partiel | complet | /receptions | fichiers, mesures, ecran, mouvement | 0 | 1 | 0 | complet |
| 20261112-181019-complet-partiel | complet | toutes | fichiers, mesures, ecran | 66 | 1 | 0 | échecs |
| 20261112-181917-complet-cible-partiel | complet | /receptions,/a-emporter,/la-carte | fichiers, mesures, ecran, mouvement | 1 | 3 | 0 | échecs |
| 20261112-182327-complet-cible-partiel | complet | /,/a-emporter | fichiers, mesures, ecran, mouvement | 4 | 0 | 0 | échecs |
| 20261112-182807-complet-cible-partiel | complet | /,/receptions | fichiers, mesures, ecran, mouvement | 1 | 2 | 0 | échecs |
| 20261112-183220-complet-cible-partiel | complet | /receptions | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261112-185751-complet-cible-partiel | complet | / | fichiers, mesures, ecran, mouvement | 8 | 0 | 0 | échecs |
| 20261112-190040-complet-cible-partiel | complet | / | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261112-194221-complet-cible-partiel | complet | / | fichiers, mesures, ecran, mouvement | 0 | 0 | 0 | complet |
| 20261113-125411-complet-cible-partiel | complet | /receptions,/infos-pratiques,/a-emporter | fichiers, mesures, ecran, mouvement | 3 | 2 | 0 | échecs |
| 20261113-125814-complet-cible-partiel | complet | /,/receptions | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261113-130027-complet-cible-partiel | complet | /receptions | fichiers, ecran, mouvement | 0 | 1 | 0 | complet |
| 20261113-132429-complet-cible-partiel | complet | /,/les-fetes,/a-emporter | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261113-140256-complet-partiel | complet | toutes | fichiers, mesures | 2 | 0 | 0 | échecs |
| 20261113-141152-complet-cible-partiel | complet | / | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261113-142428-complet-cible-partiel | complet | /a-emporter | fichiers, mesures, ecran, mouvement | 0 | 0 | 0 | complet |
| 20261113-143339-complet-cible-partiel | complet | /a-emporter | fichiers, mesures, ecran, mouvement | 1 | 0 | 0 | échecs |
| 20261113-143459-complet-cible-partiel | complet | /,/a-emporter | fichiers, mesures, ecran, mouvement | 0 | 0 | 0 | complet |
| 20261113-144446-complet-cible-partiel | complet | /a-emporter,/infos-pratiques | fichiers, mesures, ecran, mouvement | 25 | 1 | 0 | échecs |
| 20261113-144741-complet-cible-partiel | complet | /,/a-emporter | fichiers, mesures, mouvement | 1 | 1 | 0 | échecs |
| 20261113-145105-complet-cible-partiel | complet | /a-emporter | fichiers, mouvement | 0 | 0 | 0 | complet |
| 20261113-145126-complet-cible-partiel | complet | /les-fetes,/infos-pratiques | fichiers, mesures, ecran, mouvement | 0 | 1 | 0 | complet |
| 20261113-145835-complet-cible-partiel | complet | /les-fetes | fichiers, mesures, ecran, mouvement | 2 | 0 | 0 | échecs |
| 20261113-150013-complet-cible-partiel | complet | /,/les-fetes | fichiers, mesures | 2 | 0 | 0 | échecs |
| 20261113-150330-complet-cible-partiel | complet | / | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261113-150902-complet-partiel | complet | toutes | fichiers, mesures, ecran, mouvement | 0 | 3 | 0 | complet |
| **20261113-155441-complet** (celle-ci) | complet | toutes | toutes | 5 | 34 | 1 | échecs |

## Échecs

### premier écran : titre h1 invisible (1)

- **premier écran : titre h1 invisible** — `/404` — h1#lum-titre « Cette page a fermé à minuit. » _(1920×1080 normal, 2560×1440 normal)_

### ouverture : élément visible, caché puis réaffiché (flash) (1)

- **ouverture : élément visible, caché puis réaffiché (flash)** — `/a-emporter` — div.conteneur.ouv-traiteur__grille > div.ouv-traiteur__scene > p.ronde__legende _(1366×768 film, 390×844 film)_

### bouton du mode calme (2)

- **bouton du mode calme** — `/` — pas de retour à la section #apres-midi après le rechargement _(390×844 bouton réduire, 390×844 bouton rétablir)_
- **bouton du mode calme** — `/` — l’intro (ou son panneau) apparaît au rechargement dû au bouton _(390×844 bouton rétablir)_

### fluidité (1)

- **fluidité** — `/receptions` — 11 % d'images de plus de 50 ms, tâche la plus longue 129 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

## À regarder

### grille : aucun titre ne fait l’événement (point 5) (5)

- **grille : aucun titre ne fait l’événement (point 5)** — `/a-emporter` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"
- **grille : aucun titre ne fait l’événement (point 5)** — `/` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"
- **grille : aucun titre ne fait l’événement (point 5)** — `/infos-pratiques` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"
- **grille : aucun titre ne fait l’événement (point 5)** — `/les-fetes` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"
- **grille : aucun titre ne fait l’événement (point 5)** — `/reserver` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"

### grille : objet d’ouverture hors du premier écran (3)

- **grille : objet d’ouverture hors du premier écran** — `/la-carte` — 335 × 40 px visibles : l’intro et le voile s’ouvrent depuis le centre de l’écran à cette taille _(390×844)_
- **grille : objet d’ouverture hors du premier écran** — `/les-fetes` — 358 × 40 px visibles : l’intro et le voile s’ouvrent depuis le centre de l’écran à cette taille _(390×844)_
- **grille : objet d’ouverture hors du premier écran** — `/reserver` — 358 × 52 px visibles : l’intro et le voile s’ouvrent depuis le centre de l’écran à cette taille _(390×844)_

### transition : changement brusque (13)

- **transition : changement brusque** — `/ → /la-carte` — à 1668 ms (différence 21 %) (films/transition-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/ → /la-carte` — à 1754 ms (différence 35 %) (films/transition-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/a-emporter → /la-carte` — à 1663 ms (différence 33 %) (films/transition-a-emporter-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/a-emporter → /la-carte` — à 1747 ms (différence 33 %) (films/transition-a-emporter-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/infos-pratiques → /la-carte` — à 1671 ms (différence 34 %) (films/transition-infos-pratiques-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/infos-pratiques → /la-carte` — à 1765 ms (différence 31 %) (films/transition-infos-pratiques-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/la-carte → /receptions` — à 350 ms (différence 27 %) (films/transition-la-carte-vers-receptions-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/les-fetes → /la-carte` — à 1573 ms (différence 35 %) (films/transition-les-fetes-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/les-fetes → /la-carte` — à 1659 ms (différence 27 %) (films/transition-les-fetes-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/offrir → /la-carte` — à 1663 ms (différence 51 %) (films/transition-offrir-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/receptions → /la-carte` — à 1675 ms (différence 47 %) (films/transition-receptions-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/reserver → /la-carte` — à 1641 ms (différence 41 %) (films/transition-reserver-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/reserver → /la-carte` — à 1760 ms (différence 31 %) (films/transition-reserver-vers-la-carte-1366.png) _(1366×768 film)_

### retour arrière : changement brusque (2)

- **retour arrière : changement brusque** — `/` — à 544 ms (différence 28 %) (films/retour-arrière-1366.png) _(1366×768 retour arrière)_
- **retour arrière : changement brusque** — `/` — à 327 ms (différence 26 %) (films/retour-arrière-390.png) _(390×844 retour arrière)_

### bouton sans effet visible (2)

- **bouton sans effet visible** — `/les-fetes` — IPour commencer _(1366×768)_
- **bouton sans effet visible** — `/les-fetes` — IIEntrée _(1366×768)_

### rechargement au milieu de la page (3)

- **rechargement au milieu de la page** — `/infos-pratiques` — écran différent à la même position après rechargement (9.6 %), voir comparaisons/rechargement-infos-pratiques-*.png _(1366×768)_
- **rechargement au milieu de la page** — `/la-carte` — écran différent à la même position après rechargement (45.0 %), voir comparaisons/rechargement-la-carte-*.png _(1366×768)_
- **rechargement au milieu de la page** — `/reserver` — écran différent à la même position après rechargement (67.8 %), voir comparaisons/rechargement-reserver-*.png _(1366×768)_

### fluidité (3)

- **fluidité** — `/` — 7 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_
- **fluidité** — `/les-fetes` — 6 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_
- **fluidité** — `/offrir` — 4 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

### effet qui ne bouge pas au défilement (3)

- **effet qui ne bouge pas au défilement** — `/infos-pratiques` — div.plan-domaine__carte — plan-domaine : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/receptions` — div.invitation — invitation : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/reserver` — section#debut.ouv-resa — service : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_

## Non lancé

- **Safari (WebKit)** : WebKit ne peut pas s’installer ici : vérification à faire dans Safari sur le Mac (liste dans le rapport)

### À vérifier dans Safari sur le Mac (WebKit indisponible ici)

- Ouverture de chaque page : rien qui clignote, intro complète au premier chargement et au rechargement.
- Changement de page : le voile couvre l’écran, pas de page blanche ; retour arrière sans intro ni voile resté.
- Défilement : fluide (natif), en-tête qui se cache et revient sans clignoter, sections épinglées entières.
- Menu sur iPhone (mode Responsive de Safari) : ouverture, fermeture, page bloquée derrière.
- Polices, images, mention « Illustration générée », formulaires et barre fixe du bas.

## Repères

- Numéro de version des fichiers : ?v=7
- Journal v7 : 13 étape(s) notée(s), 532 min de travail pour 515 min de budget, 0 min d’attente de l’utilisateur.
- Journal : « audit standard (deux passages) et corrections » 79 min pour 35 prévues.
- Journal : « test « vrai visiteur » (7 missions, deux formats) et « regard neuf » (agents séparés) » 48 min pour 30 prévues.
- Journal : « corrections d'après le visiteur et le regard neuf (assiette en vraie photo, agenda, Saint-Sylvestre, heures, typographie, ancres) » 45 min pour 30 prévues.
- Journal : « audit complet, corrections et contre-audit ciblé » 64 min pour 30 prévues.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Ouverture / (1366×768) : 2686 ms depuis le premier octet
- Ouverture /a-emporter (1366×768) : 2608 ms depuis le premier octet
- Ouverture /infos-pratiques (1366×768) : 2558 ms depuis le premier octet
- Ouverture /la-carte (1366×768) : 2526 ms depuis le premier octet
- Ouverture /les-fetes (1366×768) : 2637 ms depuis le premier octet
- Ouverture /offrir (1366×768) : 2537 ms depuis le premier octet
- Ouverture /receptions (1366×768) : 2545 ms depuis le premier octet
- Ouverture /reserver (1366×768) : 2521 ms depuis le premier octet
- Ouverture / (390×844) : 2597 ms depuis le premier octet
- film de l'ouverture / 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /a-emporter (390×844) : 2523 ms depuis le premier octet
- film de l'ouverture /a-emporter 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /infos-pratiques (390×844) : 2524 ms depuis le premier octet
- Ouverture /la-carte (390×844) : 2504 ms depuis le premier octet
- Ouverture /les-fetes (390×844) : 2557 ms depuis le premier octet
- Ouverture /offrir (390×844) : 2475 ms depuis le premier octet
- Ouverture /receptions (390×844) : 2550 ms depuis le premier octet
- film de l'ouverture /receptions 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /reserver (390×844) : 2533 ms depuis le premier octet
- bords de l’écran /infos-pratiques 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Bords de l’écran : 558 images d’intro, 23 de voile et 263 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Changements de hauteur /a-emporter : aucun effet ScrollTrigger, rien à recalculer.
- Tient dans l'écran /a-emporter : aucune section épinglée ou plein écran.
- Tient dans l'écran /infos-pratiques : aucune section épinglée ou plein écran.
- Tient dans l'écran /la-carte : aucune section épinglée ou plein écran.
- Tient dans l'écran /les-fetes : aucune section épinglée ou plein écran.
- Tient dans l'écran /offrir : aucune section épinglée ou plein écran.
- Tient dans l'écran /receptions : aucune section épinglée ou plein écran.
- Tient dans l'écran /reserver : aucune section épinglée ou plein écran.
- Fluidité /a-emporter 1366×768 (molette) : 3 % d'images lentes sur 168, tâche la plus longue 130 ms
- Fluidité /infos-pratiques 1366×768 (molette) : 0 % d'images lentes sur 277, tâche la plus longue 0 ms
- Fluidité /la-carte 1366×768 (molette) : 2 % d'images lentes sur 374, tâche la plus longue 0 ms
- Fluidité /reserver 1366×768 (molette) : 1 % d'images lentes sur 226, tâche la plus longue 80 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1416, tâche la plus longue 51 ms
- Fluidité /a-emporter 390×844 (doigt) : 0 % d'images lentes sur 1438, tâche la plus longue 61 ms
- Fluidité /infos-pratiques 390×844 (doigt) : 0 % d'images lentes sur 1447, tâche la plus longue 112 ms
- Fluidité /la-carte 390×844 (doigt) : 0 % d'images lentes sur 1343, tâche la plus longue 0 ms
- Fluidité /les-fetes 390×844 (doigt) : 0 % d'images lentes sur 1434, tâche la plus longue 0 ms
- Fluidité /offrir 390×844 (doigt) : 0 % d'images lentes sur 1418, tâche la plus longue 0 ms
- Fluidité /receptions 390×844 (doigt) : 0 % d'images lentes sur 1435, tâche la plus longue 0 ms
- Fluidité /reserver 390×844 (doigt) : 0 % d'images lentes sur 1336, tâche la plus longue 0 ms
- Vitesse / : 0.76 s de calcul au chargement (téléphone ralenti).
- Vitesse /a-emporter : 0.73 s de calcul au chargement (téléphone ralenti).
- Vitesse /infos-pratiques : 0.39 s de calcul au chargement (téléphone ralenti).
- Vitesse /la-carte : 0.57 s de calcul au chargement (téléphone ralenti).
- Vitesse /les-fetes : 0.72 s de calcul au chargement (téléphone ralenti).
- Vitesse /offrir : 0.38 s de calcul au chargement (téléphone ralenti).
- Vitesse /receptions : 1.02 s de calcul au chargement (téléphone ralenti).
- Vitesse /reserver : 0.49 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --complet --pages=/,/404,/a-emporter,/receptions --seulement=fichiers,mesures,films,parcours,fluidite
```
