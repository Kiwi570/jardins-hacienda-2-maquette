# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 11/11/2026 18:59:03 · 5 min · 1 page(s) · audit standard ciblé sur / (étapes : fichiers, mesures, parcours, ecran, mouvement, fluidite)

## Résumé

- Statut : **8 échec(s)**
- Passe : `20261111-175350-standard-cible-partiel` · version ?v=7
- Échecs : **8**
- À regarder : **1**
- Non lancé : **0**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), mesures (14), balayage (1), intro accélérable et passable (7), menu (1), clavier (1), liens et boutons (1), liens profonds (12), liens vers la page en cours (1), changements de hauteur (1), mode calme (2), bouton du mode calme (2), parcours du projet (1), tient dans l’écran (5), fluidité (2), défilement selon l’appareil (5), mouvement (2), effets du plan (24), souris immobile (3)

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
| **20261111-175350-standard-cible-partiel** (celle-ci) | standard | / | fichiers, mesures, parcours, ecran, mouvement, fluidite | 8 | 1 | 0 | échecs |

## Échecs

### texte sous 12 px (1)

- **texte sous 12 px** — `/` — div.conteneur.dejeuner__grille > div.dejeuner__visuel:nth-of-type(2) > p.indice.dejeuner__indice > span.indice--doigt:nth-of-type(2) « TOUCHEZ LA VAPEUR » — 11.5 px _(390×844 normal, 320×568 normal, 390×844 calme, 390×844 sansJs, 390×844 sansWebgl, 320×568 sansJs)_

### élément recouvert (5)

- **élément recouvert** — `/` — div.conteneur.dejeuner__grille > div.dejeuner__visuel:nth-of-type(2) > div.dejeuner__vraies > button.vraie.vraie--1:nth-of-type(1) « L'assiette de légumes de saison devant la cheminée » — par button.vraie.vraie--2:nth-of-type(2) > figure.media.vraie__photo > picture > img _(768×1024 normal)_
- **élément recouvert** — `/` — div.conteneur.dejeuner__grille > div.dejeuner__visuel:nth-of-type(2) > div.dejeuner__vraies > button.vraie.vraie--2:nth-of-type(2) « Une assiette du chef : pièce rôtie, cèpes et purée » — par button.vraie.vraie--3:nth-of-type(3) > figure.media.vraie__photo > picture > img _(768×1024 normal)_
- **élément recouvert** — `/` — div.conteneur.dejeuner__grille > div.dejeuner__visuel:nth-of-type(2) > div.dejeuner__vraies > button.vraie.vraie--3:nth-of-type(3) « Une assiette du chef sur céramique turquoise » — par div.conteneur.dejeuner__grille > div.dejeuner__visuel:nth-of-type(2) > div.dejeuner__vraies > button.vraie.vraie--4:nth-of-type(4) « Une assiette du chef : saumon en rose et petites f » _(768×1024 normal, 390×844 normal)_
- **élément recouvert** — `/` — div.conteneur.dejeuner__grille > div.dejeuner__visuel:nth-of-type(2) > div.dejeuner__vraies > button.vraie.vraie--1:nth-of-type(1) « L'assiette de légumes de saison devant la cheminée » — par div.conteneur.dejeuner__grille > div.dejeuner__visuel:nth-of-type(2) > div.dejeuner__vraies > button.vraie.vraie--2:nth-of-type(2) « Une assiette du chef : pièce rôtie, cèpes et purée » _(390×844 normal, 1366×768 normal)_
- **élément recouvert** — `/` — div.conteneur.dejeuner__grille > div.dejeuner__visuel:nth-of-type(2) > div.dejeuner__vraies > button.vraie.vraie--2:nth-of-type(2) « Une assiette du chef : pièce rôtie, cèpes et purée » — par div.conteneur.dejeuner__grille > div.dejeuner__visuel:nth-of-type(2) > div.dejeuner__vraies > button.vraie.vraie--3:nth-of-type(3) « Une assiette du chef sur céramique turquoise » _(390×844 normal)_

### positions non recalculées après un changement de hauteur (1)

- **positions non recalculées après un changement de hauteur** — `/` — décalage de 57 px _(1366×768)_

### fluidité (1)

- **fluidité** — `/` — 12 % d'images de plus de 50 ms, tâche la plus longue 113 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

## À regarder

### effet qui ne bouge pas au défilement (1)

- **effet qui ne bouge pas au défilement** — `/` — button.bouton — carton : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_

## Non lancé

Tout a été lancé.


## Repères

- Numéro de version des fichiers : ?v=7
- Journal v7 : 10 étape(s) notée(s), 357 min de travail pour 290 min de budget, 0 min d’attente de l’utilisateur.
- Journal : « audit standard (deux passages) et corrections » 79 min pour 35 prévues.
- Journal : « test « vrai visiteur » (7 missions, deux formats) et « regard neuf » (agents séparés) » 48 min pour 30 prévues.
- Journal : « corrections d'après le visiteur et le regard neuf (assiette en vraie photo, agenda, Saint-Sylvestre, heures, typographie, ancres) » 45 min pour 30 prévues.
- Journal : « audit complet, corrections et contre-audit ciblé » 64 min pour 30 prévues.
- Audit standard : étapes lourdes sur /.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1428, tâche la plus longue 0 ms

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --pages=/ --seulement=fichiers,mesures,parcours,fluidite
```
