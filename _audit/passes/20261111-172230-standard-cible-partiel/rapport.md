# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 11/11/2026 18:29:40 · 7 min · 2 page(s) · audit standard ciblé sur /,/infos-pratiques (étapes : fichiers, mesures, parcours, ecran, mouvement, fluidite)

## Résumé

- Statut : **1 échec(s)**
- Passe : `20261111-172230-standard-cible-partiel` · version ?v=7
- Échecs : **1**
- À regarder : **3**
- Non lancé : **0**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), mesures (28), balayage (2), intro accélérable et passable (7), menu (1), clavier (2), liens et boutons (2), liens profonds (12), liens vers la page en cours (2), changements de hauteur (2), mode calme (4), bouton du mode calme (2), parcours du projet (1), tient dans l’écran (5), fluidité (4), défilement selon l’appareil (5), mouvement (4), effets du plan (24), souris immobile (3)

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
| **20261111-172230-standard-cible-partiel** (celle-ci) | standard | /,/infos-pratiques | fichiers, mesures, parcours, ecran, mouvement, fluidite | 1 | 3 | 0 | échecs |

## Échecs

### section sans visuel (1)

- **section sans visuel** — `/` — section#apres-midi « 12 h – 19 hLes journées festivesDu mardi au jeudi, » _(768×1024 normal, 390×844 normal, 320×568 normal, 844×390 normal, 390×844 calme, 390×844 sansJs, +8)_

## À regarder

### fluidité (1)

- **fluidité** — `/` — 5 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

### effet qui ne bouge pas au défilement (2)

- **effet qui ne bouge pas au défilement** — `/` — button.bouton — carton : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/infos-pratiques` — span.heure-geante.ouv-infos__heure — axes : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_

## Non lancé

Tout a été lancé.


## Repères

- Numéro de version des fichiers : ?v=7
- Journal v7 : 8 étape(s) notée(s), 325 min de travail pour 230 min de budget, 0 min d’attente de l’utilisateur.
- Journal : « audit standard (deux passages) et corrections » 79 min pour 35 prévues.
- Journal : « test « vrai visiteur » (7 missions, deux formats) et « regard neuf » (agents séparés) » 48 min pour 30 prévues.
- Journal : « corrections d'après le visiteur et le regard neuf (assiette en vraie photo, agenda, Saint-Sylvestre, heures, typographie, ancres) » 45 min pour 30 prévues.
- Journal : « audit complet, corrections et contre-audit ciblé » 64 min pour 30 prévues.
- Audit standard : étapes lourdes sur /, /infos-pratiques.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Tient dans l'écran /infos-pratiques : aucune section épinglée ou plein écran.
- Fluidité /infos-pratiques 1366×768 (molette) : 0 % d'images lentes sur 236, tâche la plus longue 0 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1409, tâche la plus longue 0 ms
- Fluidité /infos-pratiques 390×844 (doigt) : 0 % d'images lentes sur 1414, tâche la plus longue 0 ms

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --pages=/ --seulement=fichiers,mesures
```
