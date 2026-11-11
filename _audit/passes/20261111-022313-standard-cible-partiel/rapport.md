# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 11/11/2026 03:25:41 · 2 min · 1 page(s) · audit standard ciblé sur / (étapes : parcours)

## Résumé

- Statut : **1 échec(s)**
- Passe : `20261111-022313-standard-cible-partiel` · version ?v=6
- Échecs : **1**
- À regarder : **1**
- Non lancé : **0**
- Contrôles passés : intro accélérable et passable (7), menu (1), clavier (1), liens et boutons (1), liens profonds (10), liens vers la page en cours (1), changements de hauteur (1), mode calme (2), bouton du mode calme (2), parcours du projet (1)

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
| 20261111-015529-standard-cible-partiel | standard | /,/la-carte,/reserver | fichiers, films, parcours | 1 | 5 | 0 | échecs |
| 20261111-020131-standard-cible-partiel | standard | / | fichiers, parcours | 1 | 1 | 0 | échecs |
| 20261111-020356-standard-cible-partiel | standard | / | parcours | 1 | 1 | 0 | échecs |
| 20261111-020737-standard-cible-partiel | standard | / | parcours | 0 | 0 | 0 | complet |
| 20261111-021014-standard-cible-partiel | standard | / | fichiers, parcours | 0 | 1 | 0 | complet |
| 20261111-021240-standard-cible-partiel | standard | / | fichiers, parcours | 1 | 1 | 0 | échecs |
| 20261111-021518-standard-cible-partiel | standard | / | parcours | 1 | 1 | 0 | échecs |
| 20261111-021748-standard-cible-partiel | standard | / | parcours | 0 | 1 | 0 | complet |
| 20261111-022014-standard-cible-partiel | standard | / | parcours | 0 | 1 | 0 | complet |
| **20261111-022313-standard-cible-partiel** (celle-ci) | standard | / | parcours | 1 | 1 | 0 | échecs |

## Échecs

### bouton du mode calme (1)

- **bouton du mode calme** — `/` — pas de retour à la section #diner après le rechargement _(390×844 bouton rétablir)_

## À regarder

### lien vers une ancre : changement brusque (1)

- **lien vers une ancre : changement brusque** — `/ → /reserver#formulaire` — à 302 ms (différence 27 %) (films/ancre-1366.png) _(1366×768 film)_

## Non lancé

Tout a été lancé.


## Repères

- Audit standard : étapes lourdes sur /.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.

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
