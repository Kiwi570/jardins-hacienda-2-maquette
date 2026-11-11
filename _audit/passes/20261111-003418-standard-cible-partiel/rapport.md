# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 11/11/2026 01:39:43 · 5 min · 4 page(s) · audit standard ciblé sur /,/404,/les-fetes,/receptions (étapes : fichiers, mesures, parcours)

## Résumé

- Statut : **3 échec(s)**
- Passe : `20261111-003418-standard-cible-partiel` · version ?v=6
- Échecs : **3**
- À regarder : **1**
- Non lancé : **0**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), mesures (56), balayage (3), intro accélérable et passable (7), menu (1), clavier (4), liens et boutons (4), liens profonds (12), liens vers la page en cours (3), changements de hauteur (3), mode calme (6), bouton du mode calme (2), parcours du projet (1)

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
| **20261111-003418-standard-cible-partiel** (celle-ci) | standard | /,/404,/les-fetes,/receptions | fichiers, mesures, parcours | 3 | 1 | 0 | échecs |

## Échecs

### textes qui se chevauchent (1)

- **textes qui se chevauchent** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu > p.heure-geante.ouv-fetes__geant:nth-of-type(1) > span:nth-of-type(1) « J-50 » — avec section#debut > div.conteneur.ouv-fetes__contenu > h1 > span:nth-of-type(1) « Les fêtes au coin du feu » _(320×568 normal, 320×568 sansJs)_

### premier écran : information clé hors de l’écran (1)

- **premier écran : information clé hors de l’écran** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > p.ouv-recep__info:nth-of-type(5) « Appeler 06 18 21 28 10 » _(320×568 normal)_

### bouton du mode calme (1)

- **bouton du mode calme** — `/` — pas de retour à la section #diner après le rechargement _(390×844 bouton rétablir)_

## À regarder

### clearProps « all » (1)

- **clearProps « all »** — assets/js/modules/carte-cadeau-qui-se-compose/module.js : efface aussi les variables CSS posées dans le HTML ; nommer les propriétés (clearProps: 'transform,opacity')

## Non lancé

Tout a été lancé.


## Repères

- Numéro de version des fichiers : ?v=6
- Journal v6 : 8 étape(s) notée(s), 184 min de travail pour 160 min de budget, 195 min d’attente de l’utilisateur.
- Journal : « construction : contact et page de catégorie » 14 min pour 10 prévues.
- Journal : « audit rapide et corrections (images provisoires) » 76 min pour 35 prévues.
- Audit standard : étapes lourdes sur /, /les-fetes, /receptions.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --pages=/,/les-fetes,/receptions --seulement=fichiers,mesures,parcours
```
