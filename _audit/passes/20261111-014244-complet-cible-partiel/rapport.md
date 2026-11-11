# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 11/11/2026 02:50:34 · 8 min · 6 page(s) · audit complet ciblé sur /,/404,/infos-pratiques,/la-carte,/les-fetes,/receptions (étapes : fichiers, mesures, ecran)

## Résumé

- Statut : **tout a tourné, aucun échec**
- Passe : `20261111-014244-complet-cible-partiel` · version ?v=6
- Échecs : **0**
- À regarder : **1**
- Non lancé : **0**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), mesures (312), balayage (5), tient dans l’écran (8), films des épinglages (1)

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
| **20261111-014244-complet-cible-partiel** (celle-ci) | complet | /,/404,/infos-pratiques,/la-carte,/les-fetes,/receptions | fichiers, mesures, ecran | 0 | 1 | 0 | complet |

## Échecs

Aucun.

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
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Tient dans l'écran /infos-pratiques : aucune section épinglée ou plein écran.
- Tient dans l'écran /la-carte : aucune section épinglée ou plein écran.
- Tient dans l'écran /les-fetes : aucune section épinglée ou plein écran.
- Tient dans l'écran /receptions : aucune section épinglée ou plein écran.

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`
