# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 11/11/2026 03:00:58 · 5 min · 3 page(s) · audit standard ciblé sur /,/la-carte,/reserver (étapes : fichiers, films, parcours)

## Résumé

- Statut : **1 échec(s)**
- Passe : `20261111-015529-standard-cible-partiel` · version ?v=6
- Échecs : **1**
- À regarder : **5**
- Non lancé : **0**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), films d’ouverture (6), films de transition (6), intro accélérable et passable (7), menu (1), clavier (3), liens et boutons (3), liens profonds (13), liens vers la page en cours (3), changements de hauteur (3), mode calme (6), bouton du mode calme (2), parcours du projet (1)

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
| 20261111-011023-complet | complet | toutes | toutes | 13 | 14 | 1 | échecs |
| 20261111-014244-complet-cible-partiel | complet | /,/404,/infos-pratiques,/la-carte,/les-fetes,/receptions | fichiers, mesures, ecran | 0 | 1 | 0 | complet |
| 20261111-015044-standard-cible-partiel | standard | /offrir | fichiers, parcours | 0 | 0 | 0 | complet |
| **20261111-015529-standard-cible-partiel** (celle-ci) | standard | /,/la-carte,/reserver | fichiers, films, parcours | 1 | 5 | 0 | échecs |

## Échecs

### bouton du mode calme (1)

- **bouton du mode calme** — `/` — pas de retour à la section #diner après le rechargement _(390×844 bouton rétablir)_

## À regarder

### retour avant : changement brusque (2)

- **retour avant : changement brusque** — `/la-carte` — à 81 ms (différence 65 %) (films/retour-avant-1366.png) _(1366×768 retour avant)_
- **retour avant : changement brusque** — `/la-carte` — à 79 ms (différence 58 %) (films/retour-avant-390.png) _(390×844 retour avant)_

### au retour avant, élément qui réapparaît en s’animant (1)

- **au retour avant, élément qui réapparaît en s’animant** — `/la-carte` — div.ouv-carte__photo > figure.media.ouv-carte__img > video.media-video.media-video--vapeur _(1366×768 retour avant)_

### retour arrière : changement brusque (1)

- **retour arrière : changement brusque** — `/` — à 81 ms (différence 65 %) (films/retour-arrière-390.png) _(390×844 retour arrière)_

### rechargement au milieu de la page (1)

- **rechargement au milieu de la page** — `/la-carte` — écran différent à la même position après rechargement (11.8 %), voir comparaisons/rechargement-la-carte-*.png _(1366×768)_

## Non lancé

Tout a été lancé.


## Repères

- Numéro de version des fichiers : ?v=6
- Journal v6 : 11 étape(s) notée(s), 336 min de travail pour 250 min de budget, 195 min d’attente de l’utilisateur.
- Journal : « construction : contact et page de catégorie » 14 min pour 10 prévues.
- Journal : « audit rapide et corrections (images provisoires) » 76 min pour 35 prévues.
- Journal : « audit standard, test « vrai visiteur » (deux passages), regard neuf et corrections » 107 min pour 35 prévues.
- Audit standard : étapes lourdes sur /, /la-carte, /reserver.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Ouverture / (1366×768) : 2673 ms depuis le premier octet
- Ouverture /la-carte (1366×768) : 2513 ms depuis le premier octet
- Ouverture /reserver (1366×768) : 2480 ms depuis le premier octet
- Ouverture / (390×844) : 2540 ms depuis le premier octet
- Ouverture /la-carte (390×844) : 2503 ms depuis le premier octet
- Ouverture /reserver (390×844) : 2494 ms depuis le premier octet

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --pages=/ --seulement=fichiers,parcours
```
