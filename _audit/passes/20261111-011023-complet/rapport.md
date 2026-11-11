# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 11/11/2026 02:42:12 · 32 min · 8 page(s) · audit complet

## Résumé

- Statut : **13 échec(s)**
- Passe : `20261111-011023-complet` · version ?v=6
- Échecs : **13**
- À regarder : **14**
- Non lancé : **1**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (6), mesures (416), balayage (7), films d’ouverture (14), films de transition (14), bords de l’écran (8), intro accélérable et passable (7), menu (1), clavier (8), liens et boutons (8), liens profonds (15), liens vers la page en cours (7), changements de hauteur (7), mode calme (14), bouton du mode calme (2), parcours du projet (1), tient dans l’écran (8), films des épinglages (1), fluidité (14), défilement selon l’appareil (5), mouvement (14), effets du plan (25), souris immobile (5), vitesse (7), captures (1)

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
| 20261110-232657-standard | standard | toutes | toutes | 44 | 14 | 1 | échecs |
| 20261111-000323-standard | standard | toutes | toutes | 10 | 15 | 1 | échecs |
| 20261111-003418-standard-cible-partiel | standard | /,/404,/les-fetes,/receptions | fichiers, mesures, parcours | 3 | 1 | 0 | échecs |
| 20261111-004006-standard-cible-partiel | standard | /,/les-fetes,/receptions | mesures, parcours | 0 | 0 | 0 | complet |
| **20261111-011023-complet** (celle-ci) | complet | toutes | toutes | 13 | 14 | 1 | échecs |

## Échecs

### textes qui se chevauchent (2)

- **textes qui se chevauchent** — `/` — section#feu > div.feu__cadre > p.heure-section.heure-section--nuit:nth-of-type(1) > span « 23:00 » — avec section#feu > div.feu__cadre > p.indice.feu__indice:nth-of-type(3) « PASSEZ LA MAIN SUR LES BRAISES » _(320×568 calme, 375×667 calme, 390×844 calme, 1024×768 calme, 1000×560 calme, 1280×720 calme, +3)_
- **textes qui se chevauchent** — `/receptions` — div#demande > div.demande__tete > div.invitation > p.invitation__occasion.est-vide:nth-of-type(2) « Votre fête » — avec div#demande > div.demande__tete > div.invitation > p.invitation__detail.est-vide:nth-of-type(3) « La date · vos invités · l'espace » _(1024×768 normal, 1000×560 normal, 1280×720 normal, 1366×768 normal, 1440×900 normal, 1728×1000 normal, +26)_

### contraste sur image (5)

- **contraste sur image** — `/404` — section#debut > div.conteneur.introuvable__texte > p.heure-geante.heure-geante--nuit:nth-of-type(1) > span.hg__h:nth-of-type(1) « 00 » — 2.99:1 sur les 10 % de la photo les moins favorables (minimum 3:1) _(390×844 normal)_
- **contraste sur image** — `/404` — section#debut > div.conteneur.introuvable__texte > p.heure-geante.heure-geante--nuit:nth-of-type(1) > span.hg__sep:nth-of-type(2) « : » — 2.40:1 sur les 10 % de la photo les moins favorables (minimum 3:1) _(390×844 normal)_
- **contraste sur image** — `/404` — section#debut > div.conteneur.introuvable__texte > p.heure-geante.heure-geante--nuit:nth-of-type(1) > span.hg__m:nth-of-type(3) « 00 » — 1.90:1 sur les 10 % de la photo les moins favorables (minimum 3:1) _(390×844 normal)_
- **contraste sur image** — `/infos-pratiques` — section#debut > div.conteneur.ouv-infos__contenu > p.surtitre:nth-of-type(1) « INFOS PRATIQUES » — 2.82:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1) _(1366×768 normal)_
- **contraste sur image** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu > p.heure-geante.ouv-fetes__geant:nth-of-type(1) > span:nth-of-type(1) « J-50 » — 2.79:1 sur les 10 % de la photo les moins favorables (minimum 3:1) _(1366×768 normal)_

### premier écran : bouton principal hors de l’écran (1)

- **premier écran : bouton principal hors de l’écran** — `/la-carte` — section#debut > div.ouv-carte__texte:nth-of-type(2) > p.ouv-carte__actions:nth-of-type(4) > a.bouton:nth-of-type(1) « Réserver un déjeuner » _(1000×560 sansJs)_

### premier écran : information clé hors de l’écran (2)

- **premier écran : information clé hors de l’écran** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu > p.ouv-fetes__info:nth-of-type(5) « Saint-Sylvestre : 120 € le menu · Noël : 79 € par  » _(375×667 normal, 375×667 calme, 375×667 sansWebgl)_
- **premier écran : information clé hors de l’écran** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > p.ouv-recep__info:nth-of-type(5) « Appeler 06 18 21 28 10 » _(375×667 normal, 375×667 calme, 375×667 sansWebgl)_

### ne tient pas dans l’écran (3)

- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 2 px (à 4 % de la scène) _(1000×560 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 2 px (à 50 % de la scène) _(1000×560 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — coupé en bas de 2 px (à 96 % de la scène) _(1000×560 épinglé)_

## À regarder

### clearProps « all » (1)

- **clearProps « all »** — assets/js/modules/carte-cadeau-qui-se-compose/module.js : efface aussi les variables CSS posées dans le HTML ; nommer les propriétés (clearProps: 'transform,opacity')

### grille : galerie horizontale générique (point 6) (1)

- **grille : galerie horizontale générique (point 6)** — `/` — le métier a-t-il son geste (feuilleter un bac, empiler des planches, tourner les pages, ouvrir un tiroir) ? Modules bac-a-feuilleter, planches-empilees ; si la rangée qui défile est le geste du métier, ajouter data-grille="scene"

### retour avant : changement brusque (2)

- **retour avant : changement brusque** — `/la-carte` — à 84 ms (différence 65 %) (films/retour-avant-1366.png) _(1366×768 retour avant)_
- **retour avant : changement brusque** — `/la-carte` — à 79 ms (différence 58 %) (films/retour-avant-390.png) _(390×844 retour avant)_

### au retour avant, élément qui réapparaît en s’animant (1)

- **au retour avant, élément qui réapparaît en s’animant** — `/la-carte` — div.ouv-carte__photo > figure.media.ouv-carte__img > video.media-video.media-video--vapeur _(1366×768 retour avant)_

### rechargement au milieu de la page (1)

- **rechargement au milieu de la page** — `/la-carte` — écran différent à la même position après rechargement (11.8 %), voir comparaisons/rechargement-la-carte-*.png _(1366×768)_

### fluidité (1)

- **fluidité** — `/` — 5 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

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
- Journal v6 : 8 étape(s) notée(s), 184 min de travail pour 160 min de budget, 195 min d’attente de l’utilisateur.
- Journal : « construction : contact et page de catégorie » 14 min pour 10 prévues.
- Journal : « audit rapide et corrections (images provisoires) » 76 min pour 35 prévues.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Ouverture / (1366×768) : 2566 ms depuis le premier octet
- Ouverture /infos-pratiques (1366×768) : 2492 ms depuis le premier octet
- Ouverture /la-carte (1366×768) : 2548 ms depuis le premier octet
- Ouverture /les-fetes (1366×768) : 2490 ms depuis le premier octet
- Ouverture /offrir (1366×768) : 2483 ms depuis le premier octet
- Ouverture /receptions (1366×768) : 2534 ms depuis le premier octet
- film de l'ouverture /receptions 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /reserver (1366×768) : 2472 ms depuis le premier octet
- Ouverture / (390×844) : 2586 ms depuis le premier octet
- Ouverture /infos-pratiques (390×844) : 2496 ms depuis le premier octet
- Ouverture /la-carte (390×844) : 2512 ms depuis le premier octet
- Ouverture /les-fetes (390×844) : 2498 ms depuis le premier octet
- film de l'ouverture /les-fetes 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /offrir (390×844) : 2486 ms depuis le premier octet
- Ouverture /receptions (390×844) : 2467 ms depuis le premier octet
- Ouverture /reserver (390×844) : 2496 ms depuis le premier octet
- bords de l’écran /les-fetes 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Bords de l’écran : 626 images d’intro, 30 de voile et 213 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Tient dans l'écran /infos-pratiques : aucune section épinglée ou plein écran.
- Tient dans l'écran /la-carte : aucune section épinglée ou plein écran.
- Tient dans l'écran /les-fetes : aucune section épinglée ou plein écran.
- Tient dans l'écran /offrir : aucune section épinglée ou plein écran.
- Tient dans l'écran /receptions : aucune section épinglée ou plein écran.
- Tient dans l'écran /reserver : aucune section épinglée ou plein écran.
- Fluidité /infos-pratiques 1366×768 (molette) : 0 % d'images lentes sur 235, tâche la plus longue 0 ms
- Fluidité /la-carte 1366×768 (molette) : 0 % d'images lentes sur 283, tâche la plus longue 0 ms
- Fluidité /les-fetes 1366×768 (molette) : 0 % d'images lentes sur 237, tâche la plus longue 0 ms
- Fluidité /offrir 1366×768 (molette) : 0 % d'images lentes sur 133, tâche la plus longue 0 ms
- Fluidité /receptions 1366×768 (molette) : 0 % d'images lentes sur 182, tâche la plus longue 0 ms
- Fluidité /reserver 1366×768 (molette) : 0 % d'images lentes sur 208, tâche la plus longue 0 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1413, tâche la plus longue 0 ms
- Fluidité /infos-pratiques 390×844 (doigt) : 0 % d'images lentes sur 1346, tâche la plus longue 0 ms
- Fluidité /la-carte 390×844 (doigt) : 0 % d'images lentes sur 1339, tâche la plus longue 0 ms
- Fluidité /les-fetes 390×844 (doigt) : 0 % d'images lentes sur 1425, tâche la plus longue 0 ms
- Fluidité /offrir 390×844 (doigt) : 0 % d'images lentes sur 1410, tâche la plus longue 0 ms
- Fluidité /receptions 390×844 (doigt) : 0 % d'images lentes sur 1335, tâche la plus longue 0 ms
- Fluidité /reserver 390×844 (doigt) : 0 % d'images lentes sur 1332, tâche la plus longue 0 ms
- Vitesse / : 0.77 s de calcul au chargement (téléphone ralenti).
- Vitesse /infos-pratiques : 0.41 s de calcul au chargement (téléphone ralenti).
- Vitesse /la-carte : 0.47 s de calcul au chargement (téléphone ralenti).
- Vitesse /les-fetes : 0.39 s de calcul au chargement (téléphone ralenti).
- Vitesse /offrir : 0.40 s de calcul au chargement (téléphone ralenti).
- Vitesse /receptions : 0.42 s de calcul au chargement (téléphone ralenti).
- Vitesse /reserver : 0.48 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --complet --pages=/,/404,/infos-pratiques,/la-carte,/les-fetes,/receptions --seulement=fichiers,mesures,ecran
```
