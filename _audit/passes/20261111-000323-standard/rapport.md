# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 11/11/2026 01:28:53 · 26 min · 8 page(s) · audit standard

## Résumé

- Statut : **10 échec(s)**
- Passe : `20261111-000323-standard` · version ?v=6
- Échecs : **10**
- À regarder : **15**
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
| 20261110-232657-standard | standard | toutes | toutes | 44 | 14 | 1 | échecs |
| **20261111-000323-standard** (celle-ci) | standard | toutes | toutes | 10 | 15 | 1 | échecs |

## Échecs

### premier écran : bouton principal hors de l’écran (2)

- **premier écran : bouton principal hors de l’écran** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.midi__actions:nth-of-type(5) > a.bouton:nth-of-type(1) « Réserver une table » _(844×390 normal, 1366×768 sansJs, 844×390 calme)_
- **premier écran : bouton principal hors de l’écran** — `/404` — section#debut > div.conteneur.introuvable__texte > p.introuvable__actions:nth-of-type(3) > a.bouton:nth-of-type(1) « Revenir à midi » _(1366×768 sansJs)_

### texte sous 12 px (2)

- **texte sous 12 px** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.surtitre.midi__surtitre:nth-of-type(2) > strong.midi__nom « LES JARDINS DE L'HACIENDA » — 11.5 px _(390×844 normal, 320×568 normal, 390×844 calme, 390×844 sansJs, 390×844 sansWebgl, 320×568 sansJs)_
- **texte sous 12 px** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.surtitre.midi__surtitre:nth-of-type(2) « LES JARDINS DE L'HACIENDA · RESTAURANT ET RÉCEPTIO » — 11.5 px _(390×844 normal, 320×568 normal, 390×844 calme, 390×844 sansJs, 390×844 sansWebgl, 320×568 sansJs)_

### premier écran : information clé hors de l’écran (2)

- **premier écran : information clé hors de l’écran** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu > p.ouv-fetes__info:nth-of-type(5) « Saint-Sylvestre : 120 € le menu · Noël : 79 € par  » _(320×568 normal)_
- **premier écran : information clé hors de l’écran** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > p.ouv-recep__info:nth-of-type(5) « Appeler 06 18 21 28 10 » _(320×568 normal)_

### textes qui se chevauchent (3)

- **textes qui se chevauchent** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu > p.heure-geante.ouv-fetes__geant:nth-of-type(1) > span:nth-of-type(1) « J-50 » — avec section#debut > div.conteneur.ouv-fetes__contenu > h1 > span:nth-of-type(1) « Les fêtes au coin du feu » _(320×568 normal, 320×568 sansJs)_
- **textes qui se chevauchent** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > h1.ouv-recep__titre « Recevoir pour un mariage » — avec section#debut > div.conteneur.ouv-recep__contenu > p.ouv-recep__actions:nth-of-type(4) > a.bouton:nth-of-type(1) « Demander une réception » _(1366×768 normal)_
- **textes qui se chevauchent** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > h1.ouv-recep__titre « Recevoir pour un mariage » — avec section#debut > div.conteneur.ouv-recep__contenu > p.ouv-recep__actions:nth-of-type(4) > a.bouton.bouton--contour:nth-of-type(2) « Voir les espaces » _(1366×768 normal)_

### zone tactile sous 44 px (1)

- **zone tactile sous 44 px** — `/receptions` — fieldset.demande__etape:nth-of-type(2) > div.demande__deux > label:nth-of-type(2) > select « Choisir une période Cet hiver Au printemps 2027 À  » — 358 × 22 px _(390×844 sansJs, 320×568 sansJs)_

## À regarder

### clearProps « all » (1)

- **clearProps « all »** — assets/js/modules/carte-cadeau-qui-se-compose/module.js : efface aussi les variables CSS posées dans le HTML ; nommer les propriétés (clearProps: 'transform,opacity')

### grille : galerie horizontale générique (point 6) (1)

- **grille : galerie horizontale générique (point 6)** — `/` — le métier a-t-il son geste (feuilleter un bac, empiler des planches, tourner les pages, ouvrir un tiroir) ? Modules bac-a-feuilleter, planches-empilees ; si la rangée qui défile est le geste du métier, ajouter data-grille="scene"

### retour avant : changement brusque (2)

- **retour avant : changement brusque** — `/la-carte` — à 85 ms (différence 65 %) (films/retour-avant-1366.png) _(1366×768 retour avant)_
- **retour avant : changement brusque** — `/la-carte` — à 72 ms (différence 57 %) (films/retour-avant-390.png) _(390×844 retour avant)_

### au retour avant, élément qui réapparaît en s’animant (1)

- **au retour avant, élément qui réapparaît en s’animant** — `/la-carte` — div.ouv-carte__photo > figure.media.ouv-carte__img > video.media-video.media-video--vapeur _(1366×768 retour avant)_

### retour arrière : changement brusque (1)

- **retour arrière : changement brusque** — `/` — à 87 ms (différence 68 %) (films/retour-arrière-390.png) _(390×844 retour arrière)_

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
- Audit standard : étapes lourdes sur /, /infos-pratiques, /la-carte, /les-fetes, /offrir, /receptions, /reserver.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Ouverture / (1366×768) : 2560 ms depuis le premier octet
- film de l'ouverture / 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /infos-pratiques (1366×768) : 2513 ms depuis le premier octet
- Ouverture /la-carte (1366×768) : 2537 ms depuis le premier octet
- Ouverture /les-fetes (1366×768) : 2464 ms depuis le premier octet
- Ouverture /offrir (1366×768) : 2468 ms depuis le premier octet
- Ouverture /receptions (1366×768) : 2487 ms depuis le premier octet
- Ouverture /reserver (1366×768) : 2447 ms depuis le premier octet
- Ouverture / (390×844) : 2523 ms depuis le premier octet
- Ouverture /infos-pratiques (390×844) : 2483 ms depuis le premier octet
- film de l'ouverture /infos-pratiques 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /la-carte (390×844) : 2512 ms depuis le premier octet
- Ouverture /les-fetes (390×844) : 2476 ms depuis le premier octet
- Ouverture /offrir (390×844) : 2462 ms depuis le premier octet
- Ouverture /receptions (390×844) : 2479 ms depuis le premier octet
- Ouverture /reserver (390×844) : 2475 ms depuis le premier octet
- film de l'ouverture /reserver 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- bords de l’écran / 1920×1080 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Bords de l’écran : 719 images d’intro, 33 de voile et 216 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Tient dans l'écran /infos-pratiques : aucune section épinglée ou plein écran.
- Tient dans l'écran /la-carte : aucune section épinglée ou plein écran.
- Tient dans l'écran /les-fetes : aucune section épinglée ou plein écran.
- Tient dans l'écran /offrir : aucune section épinglée ou plein écran.
- Tient dans l'écran /receptions : aucune section épinglée ou plein écran.
- Tient dans l'écran /reserver : aucune section épinglée ou plein écran.
- Fluidité /infos-pratiques 1366×768 (molette) : 0 % d'images lentes sur 217, tâche la plus longue 0 ms
- Fluidité /la-carte 1366×768 (molette) : 0 % d'images lentes sur 282, tâche la plus longue 0 ms
- Fluidité /les-fetes 1366×768 (molette) : 0 % d'images lentes sur 226, tâche la plus longue 0 ms
- Fluidité /offrir 1366×768 (molette) : 0 % d'images lentes sur 130, tâche la plus longue 0 ms
- Fluidité /receptions 1366×768 (molette) : 0 % d'images lentes sur 182, tâche la plus longue 0 ms
- Fluidité /reserver 1366×768 (molette) : 0 % d'images lentes sur 212, tâche la plus longue 0 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1401, tâche la plus longue 0 ms
- Fluidité /infos-pratiques 390×844 (doigt) : 0 % d'images lentes sur 1341, tâche la plus longue 0 ms
- Fluidité /la-carte 390×844 (doigt) : 0 % d'images lentes sur 1333, tâche la plus longue 0 ms
- Fluidité /les-fetes 390×844 (doigt) : 0 % d'images lentes sur 1424, tâche la plus longue 0 ms
- Fluidité /offrir 390×844 (doigt) : 0 % d'images lentes sur 1461, tâche la plus longue 0 ms
- Fluidité /receptions 390×844 (doigt) : 0 % d'images lentes sur 1346, tâche la plus longue 0 ms
- Fluidité /reserver 390×844 (doigt) : 0 % d'images lentes sur 1342, tâche la plus longue 0 ms
- Vitesse / : 0.82 s de calcul au chargement (téléphone ralenti).
- Vitesse /infos-pratiques : 0.40 s de calcul au chargement (téléphone ralenti).
- Vitesse /la-carte : 0.48 s de calcul au chargement (téléphone ralenti).
- Vitesse /les-fetes : 0.41 s de calcul au chargement (téléphone ralenti).
- Vitesse /offrir : 0.40 s de calcul au chargement (téléphone ralenti).
- Vitesse /receptions : 0.44 s de calcul au chargement (téléphone ralenti).
- Vitesse /reserver : 0.46 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --pages=/,/404,/les-fetes,/receptions --seulement=fichiers,mesures
```
