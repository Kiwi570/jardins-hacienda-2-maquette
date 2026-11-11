# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 10/11/2026 22:16:04 · 15 min · 7 page(s) · audit RAPIDE : ne vaut pas pour une livraison ciblé sur /,/la-carte,/les-fetes,/receptions,/reserver,/offrir,/infos-pratiques (étapes : mesures, films, parcours, fluidite)

## Résumé

- Statut : **25 échec(s)**
- Passe : `20261110-210108-rapide-cible-partiel` · version ?v=6
- Échecs : **25**
- À regarder : **8**
- Non lancé : **1**
- Contrôles passés : mesures (49), films d’ouverture (14), films de transition (14), intro accélérable et passable (7), menu (1), clavier (7), liens et boutons (7), liens profonds (15), liens vers la page en cours (7), changements de hauteur (6), mode calme (14), bouton du mode calme (2), parcours du projet (1), fluidité (14), défilement selon l’appareil (5)

## Passes de cette version (?v=6)

Chaque passe garde son rapport dans `_audit/passes/` : une relance ciblée ne fait pas disparaître la preuve d’une passe plus large.

| Passe | Niveau | Pages | Étapes | Échecs | À regarder | Non lancé | Statut |
|---|---|---|---|---:|---:|---:|---|
| 20261110-202351-rapide | rapide | toutes | toutes | 49 | 12 | 1 | échecs |
| 20261110-203603-rapide-cible | rapide | /,/la-carte,/les-fetes,/receptions,/reserver,/offrir,/infos-pratiques | toutes | 196 | 19 | 2 | échecs |
| **20261110-210108-rapide-cible-partiel** (celle-ci) | rapide | /,/la-carte,/les-fetes,/receptions,/reserver,/offrir,/infos-pratiques | mesures, films, parcours, fluidite | 25 | 8 | 1 | échecs |

## Échecs

### premier écran : information clé hors de l’écran (2)

- **premier écran : information clé hors de l’écran** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.statut.midi__statut:nth-of-type(5) > span:nth-of-type(2) « Le midi du mercredi au dimanche (sauf le samedi),  » _(320×568 sansJs)_
- **premier écran : information clé hors de l’écran** — `/reserver` — section#debut > div.ouv-resa__texte:nth-of-type(2) > p.ouv-resa__actions:nth-of-type(4) > a.ouv-resa__tel:nth-of-type(3) « 06 18 21 28 10 » _(320×568 sansJs)_

### contraste insuffisant (13)

- **contraste insuffisant** — `/la-carte` — section#debut > div.ouv-carte__photo:nth-of-type(1) > p.heure-geante.ouv-carte__heure > span:nth-of-type(1) « 12:30 » — 1.13:1 (minimum 3:1) _(320×568 sansJs)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t:nth-of-type(1) > text.pds__num — 1.56:1 (minimum 3:1) _(390×844 normal, 1366×768 normal, 844×390 normal, 390×844 calme, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t:nth-of-type(2) > text.pds__num — 1.56:1 (minimum 3:1) _(390×844 normal, 1366×768 normal, 844×390 normal, 390×844 calme, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t.est-prise:nth-of-type(3) > text.pds__num — 1.56:1 (minimum 3:1) _(390×844 normal, 1366×768 normal, 844×390 normal, 390×844 calme, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t:nth-of-type(4) > text.pds__num — 1.56:1 (minimum 3:1) _(390×844 normal, 1366×768 normal, 844×390 normal, 390×844 calme, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t:nth-of-type(5) > text.pds__num — 1.56:1 (minimum 3:1) _(390×844 normal, 1366×768 normal, 844×390 normal, 390×844 calme, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t.est-prise:nth-of-type(6) > text.pds__num — 1.56:1 (minimum 3:1) _(390×844 normal, 1366×768 normal, 844×390 normal, 390×844 calme, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t:nth-of-type(7) > text.pds__num — 1.56:1 (minimum 3:1) _(390×844 normal, 1366×768 normal, 844×390 normal, 390×844 calme, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t:nth-of-type(8) > text.pds__num — 1.56:1 (minimum 3:1) _(390×844 normal, 1366×768 normal, 844×390 normal, 390×844 calme, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t:nth-of-type(9) > text.pds__num — 1.56:1 (minimum 3:1) _(390×844 normal, 1366×768 normal, 844×390 normal, 390×844 calme, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t.est-prise:nth-of-type(10) > text.pds__num — 1.56:1 (minimum 3:1) _(390×844 normal, 1366×768 normal, 844×390 normal, 390×844 calme, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t.est-prise:nth-of-type(11) > text.pds__num — 1.56:1 (minimum 3:1) _(390×844 normal, 1366×768 normal, 844×390 normal, 390×844 calme, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t.est-prise:nth-of-type(12) > text.pds__num — 1.56:1 (minimum 3:1) _(390×844 normal, 1366×768 normal, 844×390 normal, 390×844 calme, 390×844 sansWebgl)_

### section sans visuel (2)

- **section sans visuel** — `/les-fetes` — section#saint-sylvestre « JEUDI 31 DÉCEMBRE, LE SOIR Le menu de la Saint-Syl » _(320×568 sansJs)_
- **section sans visuel** — `/reserver` — section#debut « 20:00 AU DÎNER Votre table Le jour, le service, le » _(320×568 sansJs)_

### textes qui se chevauchent (5)

- **textes qui se chevauchent** — `/offrir` — section#debut > div.conteneur.ouv-offrir__grille > div.ouv-offrir__texte:nth-of-type(1) > p.heure-geante.heure-geante--nuit:nth-of-type(1) « 00:00 » — avec section#debut > div.conteneur.ouv-offrir__grille > div.ouv-offrir__texte:nth-of-type(1) > h1 « Offrir une soirée » _(844×390 normal)_
- **textes qui se chevauchent** — `/receptions` — h1.ouv-recep__titre > span.mot-tournant > span.mot-tournant__boite > span.mot-tournant__mot.est-courant:nth-of-type(1) « un mariage » — avec h1.ouv-recep__titre > span.mot-tournant > span.mot-tournant__boite > span.mot-tournant__mot:nth-of-type(4) « un pot de départ » _(390×844 normal, 1366×768 normal, 390×844 sansWebgl)_
- **textes qui se chevauchent** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > h1.ouv-recep__titre « Recevoir pour un mariage un baptême un anniversair » — avec section#debut > div.conteneur.ouv-recep__contenu > p.ouv-recep__actions:nth-of-type(4) > a.bouton:nth-of-type(1) « Demander une réception » _(1366×768 normal)_
- **textes qui se chevauchent** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > h1.ouv-recep__titre « Recevoir pour un mariage un baptême un anniversair » — avec section#debut > div.conteneur.ouv-recep__contenu > p.ouv-recep__actions:nth-of-type(4) > a.bouton.bouton--contour:nth-of-type(2) « Voir les espaces » _(1366×768 normal)_
- **textes qui se chevauchent** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > p.heure-geante.heure-geante--nuit:nth-of-type(1) « 19:00 » — avec section#debut > div.conteneur.ouv-recep__contenu > h1.ouv-recep__titre « Recevoir pour un mariage un baptême un anniversair » _(844×390 normal)_

### élément recouvert (1)

- **élément recouvert** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > p.ouv-recep__actions:nth-of-type(4) > a.bouton.bouton--contour:nth-of-type(2) « Voir les espaces » — par h1.ouv-recep__titre > span.mot-tournant > span.mot-tournant__boite > span.mot-tournant__mot:nth-of-type(4) « un pot de départ » _(1366×768 normal)_

### lien profond (1)

- **lien profond** — `/la-carte → /reserver?service=soir#formulaire` — choix « service=soir » non prérempli (valeur : midi) _(1366×768 lien profond)_

### fluidité (1)

- **fluidité** — `/` — 2 % d'images de plus de 50 ms, tâche la plus longue 292 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

## À regarder

### identifiant en double (1)

- **identifiant en double** — `/la-carte` — symbol#carte-a-partager — id="carte-a-partager" _(390×844 normal, 1366×768 normal, 390×844 calme, 390×844 sansJs)_

### contraste sur image (1)

- **contraste sur image** — `/la-carte` — section#debut > div.ouv-carte__photo:nth-of-type(1) > p.heure-geante.ouv-carte__heure > span:nth-of-type(2) « 20:30 » — 2.35:1 sur les 10 % de la photo les moins favorables (minimum 3:1), ombre portée à vérifier _(390×844 normal)_

### ouverture : changement brusque (1)

- **ouverture : changement brusque** — `/` — à 2825 ms (différence 23 %) (films/ouverture-1366.png) _(1366×768 film)_

### transition : changement brusque (2)

- **transition : changement brusque** — `/ → /la-carte` — à 411 ms (différence 24 %) (films/transition-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/ → /la-carte` — à 761 ms (différence 31 %) (films/transition-vers-la-carte-1366.png) _(1366×768 film)_

### retour avant : changement brusque (2)

- **retour avant : changement brusque** — `/la-carte` — à 61 ms (différence 66 %) (films/retour-avant-1366.png) _(1366×768 retour avant)_
- **retour avant : changement brusque** — `/la-carte` — à 118 ms (différence 20 %) (films/retour-avant-1366.png) _(1366×768 retour avant)_

### rechargement au milieu de la page (1)

- **rechargement au milieu de la page** — `/la-carte` — écran différent à la même position après rechargement (15.7 %), voir comparaisons/rechargement-la-carte-*.png _(1366×768)_

## Non lancé

- **parcours:hauteur** : page.evaluate: TypeError: Cannot read properties of null (reading 'scrollIntoView')

## Repères

- Audit rapide : étapes lourdes sur /, /infos-pratiques, /la-carte, /les-fetes, /offrir, /receptions, /reserver.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Balayage des largeurs : non fait en audit rapide.
- Ouverture / (1366×768) : 2550 ms depuis le premier octet
- Ouverture /infos-pratiques (1366×768) : 2565 ms depuis le premier octet
- Ouverture /la-carte (1366×768) : 2529 ms depuis le premier octet
- Ouverture /les-fetes (1366×768) : 2479 ms depuis le premier octet
- Ouverture /offrir (1366×768) : 2491 ms depuis le premier octet
- Ouverture /receptions (1366×768) : 2489 ms depuis le premier octet
- Ouverture /reserver (1366×768) : 2445 ms depuis le premier octet
- Ouverture / (390×844) : 2540 ms depuis le premier octet
- Ouverture /infos-pratiques (390×844) : 2460 ms depuis le premier octet
- Ouverture /la-carte (390×844) : 2501 ms depuis le premier octet
- film de l'ouverture /la-carte 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /les-fetes (390×844) : 2472 ms depuis le premier octet
- Ouverture /offrir (390×844) : 2483 ms depuis le premier octet
- Ouverture /receptions (390×844) : 2500 ms depuis le premier octet
- film de l'ouverture /receptions 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /reserver (390×844) : 2484 ms depuis le premier octet
- Fluidité /infos-pratiques 1366×768 (molette) : 0 % d'images lentes sur 217, tâche la plus longue 0 ms
- Fluidité /la-carte 1366×768 (molette) : 0 % d'images lentes sur 269, tâche la plus longue 0 ms
- Fluidité /les-fetes 1366×768 (molette) : 0 % d'images lentes sur 237, tâche la plus longue 0 ms
- Fluidité /offrir 1366×768 (molette) : 0 % d'images lentes sur 132, tâche la plus longue 0 ms
- Fluidité /receptions 1366×768 (molette) : 0 % d'images lentes sur 178, tâche la plus longue 0 ms
- Fluidité /reserver 1366×768 (molette) : 1 % d'images lentes sur 209, tâche la plus longue 0 ms
- Fluidité / 390×844 (doigt) : 2 % d'images lentes sur 859, tâche la plus longue 74 ms
- Fluidité /infos-pratiques 390×844 (doigt) : 0 % d'images lentes sur 1343, tâche la plus longue 0 ms
- Fluidité /la-carte 390×844 (doigt) : 0 % d'images lentes sur 1338, tâche la plus longue 0 ms
- Fluidité /les-fetes 390×844 (doigt) : 0 % d'images lentes sur 1415, tâche la plus longue 0 ms
- Fluidité /offrir 390×844 (doigt) : 0 % d'images lentes sur 1414, tâche la plus longue 0 ms
- Fluidité /receptions 390×844 (doigt) : 0 % d'images lentes sur 1341, tâche la plus longue 0 ms
- Fluidité /reserver 390×844 (doigt) : 0 % d'images lentes sur 1332, tâche la plus longue 0 ms

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --rapide --seulement=fichiers,mesures,parcours,fluidite
```
