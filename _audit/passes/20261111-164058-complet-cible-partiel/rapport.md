# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 11/11/2026 17:52:26 · 11 min · 4 page(s) · audit complet ciblé sur /,/infos-pratiques,/les-fetes,/offrir (étapes : fichiers, mesures, ecran, fluidite, films)

## Résumé

- Statut : **8 échec(s)**
- Passe : `20261111-164058-complet-cible-partiel` · version ?v=7
- Échecs : **8**
- À regarder : **7**
- Non lancé : **0**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), mesures (208), balayage (4), films d’ouverture (8), films de transition (8), tient dans l’écran (15), films des épinglages (1), fluidité (8), défilement selon l’appareil (5)

## Passes de cette version (?v=7)

Chaque passe garde son rapport dans `_audit/passes/` : une relance ciblée ne fait pas disparaître la preuve d’une passe plus large.

| Passe | Niveau | Pages | Étapes | Échecs | À regarder | Non lancé | Statut |
|---|---|---|---|---:|---:|---:|---|
| 20261111-143746-standard | standard | toutes | toutes | 59 | 11 | 9 | échecs |
| 20261111-145453-standard | standard | toutes | toutes | 18 | 16 | 1 | échecs |
| 20261111-152604-standard-partiel | standard | toutes | fichiers, mesures, parcours, ecran, mouvement | 8 | 19 | 1 | échecs |
| 20261111-154358-standard-partiel | standard | toutes | fichiers, mesures, parcours | 0 | 11 | 0 | complet |
| 20261111-160415-complet | complet | toutes | toutes | 7 | 17 | 1 | échecs |
| **20261111-164058-complet-cible-partiel** (celle-ci) | complet | /,/infos-pratiques,/les-fetes,/offrir | fichiers, mesures, ecran, fluidite, films | 8 | 7 | 0 | échecs |

## Échecs

### textes qui se chevauchent (7)

- **textes qui se chevauchent** — `/les-fetes` — h2#ame-titre > div.fx-mot-l:nth-of-type(1) > div.fx-lettre:nth-of-type(1) « L » — avec h2#ame-titre > div.fx-mot-l:nth-of-type(1) > div.fx-lettre:nth-of-type(2) « e » _(1366×768 normal)_
- **textes qui se chevauchent** — `/les-fetes` — h2#ame-titre > div.fx-mot-l:nth-of-type(2) > div.fx-lettre:nth-of-type(1) « m » — avec h2#ame-titre > div.fx-mot-l:nth-of-type(2) > div.fx-lettre:nth-of-type(2) « e » _(1366×768 normal)_
- **textes qui se chevauchent** — `/les-fetes` — h2#ame-titre > div.fx-mot-l:nth-of-type(2) > div.fx-lettre:nth-of-type(2) « e » — avec h2#ame-titre > div.fx-mot-l:nth-of-type(2) > div.fx-lettre:nth-of-type(3) « n » _(1366×768 normal)_
- **textes qui se chevauchent** — `/les-fetes` — h2#ame-titre > div.fx-mot-l:nth-of-type(2) > div.fx-lettre:nth-of-type(3) « n » — avec h2#ame-titre > div.fx-mot-l:nth-of-type(2) > div.fx-lettre:nth-of-type(4) « u » _(1366×768 normal)_
- **textes qui se chevauchent** — `/les-fetes` — h2#ame-titre > div.fx-mot-l:nth-of-type(3) > div.fx-lettre:nth-of-type(1) « d » — avec h2#ame-titre > div.fx-mot-l:nth-of-type(3) > div.fx-lettre:nth-of-type(2) « e » _(1366×768 normal)_
- **textes qui se chevauchent** — `/les-fetes` — h2#ame-titre > div.fx-mot-l:nth-of-type(4) > div.fx-lettre:nth-of-type(1) « l » — avec h2#ame-titre > div.fx-mot-l:nth-of-type(4) > div.fx-lettre:nth-of-type(2) « a » _(1366×768 normal)_
- **textes qui se chevauchent** — `/les-fetes` — h2#ame-titre > div.fx-mot-l:nth-of-type(5) > div.fx-lettre:nth-of-type(1) « S » — avec h2#ame-titre > div.fx-mot-l:nth-of-type(5) > div.fx-lettre:nth-of-type(2) « a » _(1366×768 normal)_

### fluidité (1)

- **fluidité** — `/les-fetes` — 8 % d'images de plus de 50 ms, tâche la plus longue 284 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

## À regarder

### clearProps « all » (2)

- **clearProps « all »** — assets/js/modules/formulaire-par-etapes/module.js : efface aussi les variables CSS posées dans le HTML ; nommer les propriétés (clearProps: 'transform,opacity')
- **clearProps « all »** — assets/js/modules/rideau-en-lanieres/module.js : efface aussi les variables CSS posées dans le HTML ; nommer les propriétés (clearProps: 'transform,opacity')

### contraste sur image (3)

- **contraste sur image** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu:nth-of-type(4) > p.heure-geante.ouv-fetes__geant:nth-of-type(1) > span:nth-of-type(1) « J-50 » — 1.17:1 sur les 10 % de la photo les moins favorables (minimum 3:1), ombre portée à vérifier _(1366×768 normal)_
- **contraste sur image** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu:nth-of-type(4) > p.surtitre:nth-of-type(2) > span:nth-of-type(1) « CET HIVER » — 2.60:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(1366×768 normal)_
- **contraste sur image** — `/les-fetes` — h1#fetes-h1 > span:nth-of-type(1) « Les fêtes au coin du feu » — 2.84:1 sur les 10 % de la photo les moins favorables (minimum 3:1), ombre portée à vérifier _(1366×768 normal)_

### retour arrière : changement brusque (1)

- **retour arrière : changement brusque** — `/` — à 79 ms (différence 66 %) (films/retour-arrière-390.png) _(390×844 retour arrière)_

### fluidité (1)

- **fluidité** — `/` — 4 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

## Non lancé

Tout a été lancé.


## Repères

- Numéro de version des fichiers : ?v=7
- Journal v7 : 4 étape(s) notée(s), 89 min de travail pour 105 min de budget, 0 min d’attente de l’utilisateur.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Ouverture / (1366×768) : 2594 ms depuis le premier octet
- Ouverture /infos-pratiques (1366×768) : 2561 ms depuis le premier octet
- Ouverture /les-fetes (1366×768) : 2630 ms depuis le premier octet
- film de l'ouverture /les-fetes 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /offrir (1366×768) : 2530 ms depuis le premier octet
- Ouverture / (390×844) : 2619 ms depuis le premier octet
- Ouverture /infos-pratiques (390×844) : 2488 ms depuis le premier octet
- Ouverture /les-fetes (390×844) : 2496 ms depuis le premier octet
- Ouverture /offrir (390×844) : 2510 ms depuis le premier octet
- Tient dans l'écran /infos-pratiques : aucune section épinglée ou plein écran.
- Tient dans l'écran /offrir : aucune section épinglée ou plein écran.
- Fluidité /infos-pratiques 1366×768 (molette) : 0 % d'images lentes sur 238, tâche la plus longue 0 ms
- Fluidité /offrir 1366×768 (molette) : 0 % d'images lentes sur 130, tâche la plus longue 0 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1424, tâche la plus longue 70 ms
- Fluidité /infos-pratiques 390×844 (doigt) : 0 % d'images lentes sur 1417, tâche la plus longue 0 ms
- Fluidité /les-fetes 390×844 (doigt) : 0 % d'images lentes sur 1341, tâche la plus longue 0 ms
- Fluidité /offrir 390×844 (doigt) : 0 % d'images lentes sur 1416, tâche la plus longue 0 ms

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --complet --pages=/,/les-fetes --seulement=fichiers,mesures,fluidite
```
