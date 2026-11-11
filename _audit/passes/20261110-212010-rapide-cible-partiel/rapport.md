# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 10/11/2026 22:31:58 · 12 min · 7 page(s) · audit RAPIDE : ne vaut pas pour une livraison ciblé sur /,/la-carte,/les-fetes,/receptions,/reserver,/offrir,/infos-pratiques (étapes : mesures, parcours, fluidite)

## Résumé

- Statut : **6 échec(s)**
- Passe : `20261110-212010-rapide-cible-partiel` · version ?v=6
- Échecs : **6**
- À regarder : **1**
- Non lancé : **0**
- Contrôles passés : mesures (49), intro accélérable et passable (7), menu (1), clavier (7), liens et boutons (7), liens profonds (15), liens vers la page en cours (7), changements de hauteur (7), mode calme (14), bouton du mode calme (2), parcours du projet (1), fluidité (14), défilement selon l’appareil (5)

## Passes de cette version (?v=6)

Chaque passe garde son rapport dans `_audit/passes/` : une relance ciblée ne fait pas disparaître la preuve d’une passe plus large.

| Passe | Niveau | Pages | Étapes | Échecs | À regarder | Non lancé | Statut |
|---|---|---|---|---:|---:|---:|---|
| 20261110-202351-rapide | rapide | toutes | toutes | 49 | 12 | 1 | échecs |
| 20261110-203603-rapide-cible | rapide | /,/la-carte,/les-fetes,/receptions,/reserver,/offrir,/infos-pratiques | toutes | 196 | 19 | 2 | échecs |
| 20261110-210108-rapide-cible-partiel | rapide | /,/la-carte,/les-fetes,/receptions,/reserver,/offrir,/infos-pratiques | mesures, films, parcours, fluidite | 25 | 8 | 1 | échecs |
| **20261110-212010-rapide-cible-partiel** (celle-ci) | rapide | /,/la-carte,/les-fetes,/receptions,/reserver,/offrir,/infos-pratiques | mesures, parcours, fluidite | 6 | 1 | 0 | échecs |

## Échecs

### premier écran : information clé hors de l’écran (3)

- **premier écran : information clé hors de l’écran** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.statut.midi__statut:nth-of-type(5) > span:nth-of-type(2) « Fermé · ouvre demain à 12 h » _(390×844 calme, 390×844 normal, 390×844 sansWebgl)_
- **premier écran : information clé hors de l’écran** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.statut.midi__statut:nth-of-type(5) > span:nth-of-type(2) « Le midi du mercredi au dimanche (sauf le samedi),  » _(320×568 sansJs)_
- **premier écran : information clé hors de l’écran** — `/reserver` — section#debut > div.ouv-resa__texte:nth-of-type(2) > p.ouv-resa__actions:nth-of-type(4) > a.ouv-resa__tel:nth-of-type(3) « 06 18 21 28 10 » _(320×568 sansJs)_

### textes qui se chevauchent (1)

- **textes qui se chevauchent** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > p.surtitre:nth-of-type(2) « RÉCEPTIONS » — avec section#debut > div.conteneur.ouv-recep__contenu > h1.ouv-recep__titre « Recevoir pour un pot de départ » _(1366×768 normal)_

### texte coupé (1)

- **texte coupé** — `/reserver` — section#debut > div.ouv-resa__photo:nth-of-type(1) > figure.media.ouv-resa__img:nth-of-type(2) > figcaption.mention-ia « Illustration générée » — coupé par section#debut > div.ouv-resa__photo:nth-of-type(1) > figure.media.ouv-resa__img:nth-of-type(2) « Illustration générée » _(320×568 sansJs)_

### clavier (1)

- **clavier** — `/` — a « L'été aux Jardins » — le focus arrive sur un élément caché _(1366×768)_

## À regarder

### rechargement au milieu de la page (1)

- **rechargement au milieu de la page** — `/la-carte` — écran différent à la même position après rechargement (15.7 %), voir comparaisons/rechargement-la-carte-*.png _(1366×768)_

## Non lancé

Tout a été lancé.


## Repères

- Audit rapide : étapes lourdes sur /, /infos-pratiques, /la-carte, /les-fetes, /offrir, /receptions, /reserver.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Balayage des largeurs : non fait en audit rapide.
- Fluidité / 1366×768 (molette) : 2 % d'images lentes sur 430, tâche la plus longue 201 ms
- Fluidité /infos-pratiques 1366×768 (molette) : 0 % d'images lentes sur 218, tâche la plus longue 0 ms
- Fluidité /la-carte 1366×768 (molette) : 0 % d'images lentes sur 275, tâche la plus longue 0 ms
- Fluidité /les-fetes 1366×768 (molette) : 0 % d'images lentes sur 229, tâche la plus longue 0 ms
- Fluidité /offrir 1366×768 (molette) : 0 % d'images lentes sur 130, tâche la plus longue 0 ms
- Fluidité /receptions 1366×768 (molette) : 0 % d'images lentes sur 181, tâche la plus longue 0 ms
- Fluidité /reserver 1366×768 (molette) : 0 % d'images lentes sur 213, tâche la plus longue 0 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1444, tâche la plus longue 0 ms
- Fluidité /infos-pratiques 390×844 (doigt) : 0 % d'images lentes sur 1347, tâche la plus longue 0 ms
- Fluidité /la-carte 390×844 (doigt) : 0 % d'images lentes sur 1336, tâche la plus longue 0 ms
- Fluidité /les-fetes 390×844 (doigt) : 0 % d'images lentes sur 1419, tâche la plus longue 0 ms
- Fluidité /offrir 390×844 (doigt) : 0 % d'images lentes sur 1413, tâche la plus longue 0 ms
- Fluidité /receptions 390×844 (doigt) : 0 % d'images lentes sur 1344, tâche la plus longue 0 ms
- Fluidité /reserver 390×844 (doigt) : 0 % d'images lentes sur 1332, tâche la plus longue 0 ms

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --rapide --pages=/,/receptions,/reserver --seulement=fichiers,mesures,parcours
```
