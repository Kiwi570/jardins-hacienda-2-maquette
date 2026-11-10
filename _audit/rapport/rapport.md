# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 10/11/2026 18:46:46 · 22 min · 7 page(s) · audit complet

## Résumé

- Échecs : **0**
- À regarder : **10**
- Non lancé : **3**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (7), mesures (364), balayage (6), films d’ouverture (11), films de transition (12), bords de l’écran (7), intro accélérable et passable (7), menu (1), clavier (7), liens et boutons (7), liens profonds (6), liens vers la page en cours (6), changements de hauteur (5), mode calme (12), bouton du mode calme (2), parcours du projet (1), fluidité (12), défilement selon l’appareil (5), mouvement (12), effets du plan (16), souris immobile (4), vitesse (6), captures (1)

## Grille wouahou

| Point | État | Détail |
|---|---|---|
| 1. L’effet signature se manipule | ✓ présent | accueil |
| 2. L’intro devient la page | ✓ présent | objet d’ouverture sur 6 page(s), versObjet dans l’intro |
| 3. La transition reprend le motif | ✓ présent | voile en cloche |
| 4. Quelque chose relie les sections et les pages | ✓ présent | sur les 6 page(s) |
| 5. Un titre fait l’événement sur chaque page | ✓ présent | sur les 6 page(s) |
| 6. La scène est un geste du métier | ✓ présent | geste du métier sur / |
| 7. L’action principale a un retour physique | ✓ présent | sur /offrir, /reserver |

Le script vérifie les marques (`data-grille`, `data-iris-centre`, forme du voile, `versObjet`) ; la force et la justesse de chaque point se jugent sur les captures et les films.

## Échecs

Aucun.

## À regarder

### clearProps « all » (1)

- **clearProps « all »** — assets/js/modules/carte-cadeau-qui-se-compose/module.js : efface aussi les variables CSS posées dans le HTML ; nommer les propriétés (clearProps: 'transform,opacity')

### identifiant en double (1)

- **identifiant en double** — `/la-carte` — symbol#carte-a-partager — id="carte-a-partager" _(390×844 normal, 1366×768 normal, 390×844 sansJs, 390×844 calme, 1366×768 sansJs, 1366×768 calme)_

### ouverture : changement brusque (3)

- **ouverture : changement brusque** — `/infos-pratiques` — à 825 ms (différence 40 %) (films/ouverture-infos-pratiques-1366.png) _(1366×768 film)_
- **ouverture : changement brusque** — `/la-carte` — à 879 ms (différence 27 %) (films/ouverture-la-carte-1366.png) _(1366×768 film)_
- **ouverture : changement brusque** — `/la-carte` — à 901 ms (différence 23 %) (films/ouverture-la-carte-1366.png) _(1366×768 film)_

### retour avant : changement brusque (2)

- **retour avant : changement brusque** — `/la-carte` — à 61 ms (différence 62 %) (films/retour-avant-1366.png) _(1366×768 retour avant)_
- **retour avant : changement brusque** — `/la-carte` — à 81 ms (différence 50 %) (films/retour-avant-390.png) _(390×844 retour avant)_

### rechargement au milieu de la page (1)

- **rechargement au milieu de la page** — `/la-carte` — écran différent à la même position après rechargement (6.2 %), voir comparaisons/rechargement-la-carte-*.png _(1366×768)_

### fluidité (1)

- **fluidité** — `/` — 5 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

### effet qui ne bouge pas au défilement (1)

- **effet qui ne bouge pas au défilement** — `/` — div.cadran-saison — saison : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_

## Non lancé

- **film de l'ouverture /reserver 390×844** : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page (3 tentatives)
- **parcours:hauteur** : page.evaluate: TypeError: Cannot read properties of null (reading 'scrollIntoView')
- **Safari (WebKit)** : WebKit ne peut pas s’installer ici : vérification à faire dans Safari sur le Mac (liste dans le rapport)

### À vérifier dans Safari sur le Mac (WebKit indisponible ici)

- Ouverture de chaque page : rien qui clignote, intro complète au premier chargement et au rechargement.
- Changement de page : le voile couvre l’écran, pas de page blanche ; retour arrière sans intro ni voile resté.
- Défilement : fluide (natif), en-tête qui se cache et revient sans clignoter, sections épinglées entières.
- Menu sur iPhone (mode Responsive de Safari) : ouverture, fermeture, page bloquée derrière.
- Polices, images, mention « Illustration générée », formulaires et barre fixe du bas.

## Repères

- Numéro de version des fichiers : ?v=4
- Journal v4 : 4 étape(s) notée(s), 41 min de travail pour 115 min de budget, 1 min d’attente de l’utilisateur.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Ouverture / (1366×768) : 2702 ms depuis le premier octet
- Ouverture /infos-pratiques (1366×768) : 939 ms depuis le premier octet
- Ouverture /la-carte (1366×768) : 1050 ms depuis le premier octet
- Ouverture /les-fetes (1366×768) : 962 ms depuis le premier octet
- Ouverture /offrir (1366×768) : 924 ms depuis le premier octet
- Ouverture /reserver (1366×768) : 975 ms depuis le premier octet
- Ouverture / (390×844) : 2560 ms depuis le premier octet
- Ouverture /infos-pratiques (390×844) : 934 ms depuis le premier octet
- Ouverture /la-carte (390×844) : 1009 ms depuis le premier octet
- Ouverture /les-fetes (390×844) : 937 ms depuis le premier octet
- Ouverture /offrir (390×844) : 948 ms depuis le premier octet
- bords de l’écran / 1920×1080 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Bords de l’écran : 208 images d’intro, 43 de voile et 236 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Tient dans l'écran / : aucune section épinglée ou plein écran.
- Tient dans l'écran /infos-pratiques : aucune section épinglée ou plein écran.
- Tient dans l'écran /la-carte : aucune section épinglée ou plein écran.
- Tient dans l'écran /les-fetes : aucune section épinglée ou plein écran.
- Tient dans l'écran /offrir : aucune section épinglée ou plein écran.
- Tient dans l'écran /reserver : aucune section épinglée ou plein écran.
- Fluidité /infos-pratiques 1366×768 (molette) : 0 % d'images lentes sur 243, tâche la plus longue 0 ms
- Fluidité /la-carte 1366×768 (molette) : 1 % d'images lentes sur 281, tâche la plus longue 59 ms
- Fluidité /les-fetes 1366×768 (molette) : 0 % d'images lentes sur 234, tâche la plus longue 0 ms
- Fluidité /offrir 1366×768 (molette) : 1 % d'images lentes sur 132, tâche la plus longue 0 ms
- Fluidité /reserver 1366×768 (molette) : 0 % d'images lentes sur 232, tâche la plus longue 0 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1421, tâche la plus longue 0 ms
- Fluidité /infos-pratiques 390×844 (doigt) : 0 % d'images lentes sur 1355, tâche la plus longue 0 ms
- Fluidité /la-carte 390×844 (doigt) : 0 % d'images lentes sur 1367, tâche la plus longue 0 ms
- Fluidité /les-fetes 390×844 (doigt) : 0 % d'images lentes sur 1366, tâche la plus longue 0 ms
- Fluidité /offrir 390×844 (doigt) : 0 % d'images lentes sur 1359, tâche la plus longue 0 ms
- Fluidité /reserver 390×844 (doigt) : 0 % d'images lentes sur 1364, tâche la plus longue 0 ms
- Vitesse / : 0.93 s de calcul au chargement (téléphone ralenti).
- Vitesse /infos-pratiques : 0.36 s de calcul au chargement (téléphone ralenti).
- Vitesse /la-carte : 0.49 s de calcul au chargement (téléphone ralenti).
- Vitesse /les-fetes : 0.34 s de calcul au chargement (téléphone ralenti).
- Vitesse /offrir : 0.31 s de calcul au chargement (téléphone ralenti).
- Vitesse /reserver : 0.43 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --complet --seulement=fichiers,films,parcours
```

## Relances après ce rapport (10 novembre 2026, livraison v4)

- **Film de l'ouverture /reserver 390×844** (non lancé ci-dessus : erreur de capture du navigateur, 3 tentatives) : relancé seul (`--complet --seulement=films --pages=/reserver`) : 0 échec, films d'ouverture (2) et de transition (2) passés.
- **parcours:hauteur sur /reserver** (non lancé) : le script marque les boutons des jours une fois, mais le module de réservation les redessine à chaque clic (A1 dans `_audit/modules-restau.md`). Même contrôle refait à la main en relisant la liste à chaque clic : 0 px de décalage après 12 clics.
- **Safari** : à vérifier sur le Mac (liste ci-dessus).
