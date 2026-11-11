# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 11/11/2026 20:05:06 · 10 min · 4 page(s) · audit complet ciblé sur /,/la-carte,/les-fetes,/receptions (étapes : fichiers, mesures, parcours)

## Résumé

- Statut : **3 échec(s)**
- Passe : `20261111-185503-complet-cible-partiel` · version ?v=7
- Échecs : **3**
- À regarder : **2**
- Non lancé : **0**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), mesures (208), balayage (4), intro accélérable et passable (7), menu (1), clavier (4), liens et boutons (4), liens profonds (16), liens vers la page en cours (4), changements de hauteur (4), mode calme (8), bouton du mode calme (2), parcours du projet (1)

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
| **20261111-185503-complet-cible-partiel** (celle-ci) | complet | /,/la-carte,/les-fetes,/receptions | fichiers, mesures, parcours | 3 | 2 | 0 | échecs |

## Échecs

### textes qui se chevauchent (3)

- **textes qui se chevauchent** — `/` — div.terrasse__cadre > div.terrasse__images:nth-of-type(1) > figure.media.terrasse__img:nth-of-type(1) > figcaption.mention-ia « Illustration générée » — avec div.terrasse__cadre > div.terrasse__images:nth-of-type(1) > figure.media.terrasse__img:nth-of-type(2) > figcaption.mention-ia « Illustration générée » _(390×844 normal, 844×390 normal, 375×667 normal, 320×568 normal, 768×1024 normal, 1024×768 normal, +20)_
- **textes qui se chevauchent** — `/` — div.terrasse__cadre > div.terrasse__images:nth-of-type(1) > figure.media.terrasse__img:nth-of-type(1) > figcaption.mention-ia « Illustration générée » — avec div.terrasse__cadre > div.terrasse__images:nth-of-type(1) > figure.media.terrasse__img:nth-of-type(3) > figcaption.mention-ia « Illustration générée » _(390×844 normal, 844×390 normal, 375×667 normal, 320×568 normal, 768×1024 normal, 1024×768 normal, +20)_
- **textes qui se chevauchent** — `/` — div.terrasse__cadre > div.terrasse__images:nth-of-type(1) > figure.media.terrasse__img:nth-of-type(2) > figcaption.mention-ia « Illustration générée » — avec div.terrasse__cadre > div.terrasse__images:nth-of-type(1) > figure.media.terrasse__img:nth-of-type(3) > figcaption.mention-ia « Illustration générée » _(390×844 normal, 844×390 normal, 375×667 normal, 320×568 normal, 768×1024 normal, 1024×768 normal, +20)_

## À regarder

### contraste sur image (1)

- **contraste sur image** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > p.heure-geante.heure-geante--nuit:nth-of-type(1) « 19:00 » — 2.35:1 sur les 10 % de la photo les moins favorables (minimum 3:1), ombre portée à vérifier _(1366×768 normal)_

### rechargement au milieu de la page (1)

- **rechargement au milieu de la page** — `/la-carte` — écran différent à la même position après rechargement (14.9 %), voir comparaisons/rechargement-la-carte-*.png _(1366×768)_

## Non lancé

Tout a été lancé.


## Repères

- Numéro de version des fichiers : ?v=7
- Journal v7 : 11 étape(s) notée(s), 384 min de travail pour 335 min de budget, 0 min d’attente de l’utilisateur.
- Journal : « audit standard (deux passages) et corrections » 79 min pour 35 prévues.
- Journal : « test « vrai visiteur » (7 missions, deux formats) et « regard neuf » (agents séparés) » 48 min pour 30 prévues.
- Journal : « corrections d'après le visiteur et le regard neuf (assiette en vraie photo, agenda, Saint-Sylvestre, heures, typographie, ancres) » 45 min pour 30 prévues.
- Journal : « audit complet, corrections et contre-audit ciblé » 64 min pour 30 prévues.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --complet --pages=/ --seulement=fichiers,mesures
```
