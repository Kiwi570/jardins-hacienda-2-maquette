# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 12/11/2026 14:55:02 · 12 min · 8 page(s) · audit complet (étapes : fichiers, mesures, parcours, ecran, mouvement)

## Résumé

- Statut : **13 échec(s)**
- Passe : `20261112-134303-complet-partiel` · version ?v=7
- Échecs : **13**
- À regarder : **0**
- Non lancé : **6**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), mesures (416), balayage (7), intro accélérable et passable (7), menu (1), clavier (8), liens et boutons (8), liens profonds (4)

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
| 20261111-185503-complet-cible-partiel | complet | /,/la-carte,/les-fetes,/receptions | fichiers, mesures, parcours | 3 | 2 | 0 | échecs |
| 20261111-190530-complet-cible-partiel | complet | /,/receptions | fichiers, mesures | 0 | 1 | 0 | complet |
| **20261112-134303-complet-partiel** (celle-ci) | complet | toutes | fichiers, mesures, parcours, ecran, mouvement | 13 | 0 | 6 | échecs |

## Échecs

### contraste insuffisant (10)

- **contraste insuffisant** — `/infos-pratiques` — h1#infos-h1 « Horaires, accès et contact » — 1.21:1 (minimum 3:1) _(320×568 normal, 375×667 normal, 390×844 normal, 768×1024 normal, 1024×768 normal, 1000×560 normal, +30)_
- **contraste insuffisant** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.statut.ouv-infos__statut:nth-of-type(2) > span:nth-of-type(2) « Fermé · ouvre demain à 12 h » — 1.21:1 (minimum 4.5:1) _(320×568 normal, 375×667 normal, 390×844 normal, 844×390 normal, 768×1024 normal, 1024×768 normal, +33)_
- **contraste insuffisant** — `/infos-pratiques` — section#debut > div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.ouv-infos__adresse:nth-of-type(3) « 6 Vathier Haye, 54580 Moineville À 24 km de Thionv » — 1.21:1 (minimum 4.5:1) _(320×568 normal, 375×667 normal, 390×844 normal, 768×1024 normal, 1024×768 normal, 1000×560 normal, +30)_
- **contraste insuffisant** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.ouv-infos__adresse:nth-of-type(3) > span.ouv-infos__distances « À 24 km de Thionville, 19 km de Metz, 47 km de Lux » — 1.21:1 (minimum 4.5:1) _(320×568 normal, 375×667 normal, 390×844 normal, 768×1024 normal, 1024×768 normal, 1000×560 normal, +30)_
- **contraste insuffisant** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.ouv-infos__actions:nth-of-type(4) > a.bouton.bouton--contour:nth-of-type(2) « Une question ? » — 1.21:1 (minimum 4.5:1) _(320×568 normal, 375×667 normal, 390×844 normal, 844×390 normal, 768×1024 normal, 1024×768 normal, +33)_
- **contraste insuffisant** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.ouv-infos__actions:nth-of-type(4) > a.lien-fleche:nth-of-type(3) « Venir » — 1.21:1 (minimum 4.5:1) _(320×568 normal, 375×667 normal, 390×844 normal, 768×1024 normal, 1024×768 normal, 1000×560 normal, +30)_
- **contraste insuffisant** — `/infos-pratiques` — section#debut > div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.surtitre:nth-of-type(1) « INFOS PRATIQUES » — 1.21:1 (minimum 4.5:1) _(390×844 normal, 768×1024 normal, 1024×768 normal, 1000×560 normal, 1280×720 normal, 1366×768 normal, +24)_
- **contraste insuffisant** — `/infos-pratiques` — h1#infos-h1 « Horaires, accès et contact » — 1.21:1 (minimum 4.5:1) _(844×390 normal, 844×390 calme, 844×390 sansWebgl)_
- **contraste insuffisant** — `/infos-pratiques` — section#debut > div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.ouv-infos__adresse:nth-of-type(3) « 6 Vathier Haye, 54580 Moineville » — 1.21:1 (minimum 4.5:1) _(844×390 normal, 844×390 calme, 844×390 sansWebgl)_
- **contraste insuffisant** — `/reserver` — div.resa__grille.socle-cadre > aside.resa__recap > div.resa__recap-corps > p.resa__recap-sur « VOTRE RÉSERVATION » — 4.46:1 (minimum 4.5:1) _(320×568 normal, 375×667 normal, 390×844 normal, 844×390 normal, 768×1024 normal, 1024×768 normal, +33)_

### accessibilité (axe) : color-contrast (2)

- **accessibilité (axe) : color-contrast** — `/infos-pratiques` — .ced__texte > .surtitre ; span[data-statut-accueil=""] ; .ouv-infos__adresse — Elements must meet minimum color contrast ratio thresholds _(390×844 calme, 1366×768 calme)_
- **accessibilité (axe) : color-contrast** — `/reserver` — .resa__recap-sur — Elements must meet minimum color contrast ratio thresholds _(390×844 calme, 1366×768 calme)_

### texte sous 12 px (1)

- **texte sous 12 px** — `/offrir` — div.ccq__carte > div.ccq__carte-haut:nth-of-type(1) > span.ccq__noms:nth-of-type(2) > span.ccq__validite:nth-of-type(3) « Valable 6 mois · toute la carte » — 10.0 px _(320×568 normal, 375×667 normal, 390×844 normal, 844×390 normal, 768×1024 normal, 1024×768 normal, +46)_

## À regarder

Rien.

## Non lancé

- **parcours:liens** : page.evaluate: Target page, context or browser has been closed
- **parcours:hauteur** : browser.newContext: Target page, context or browser has been closed
- **parcours:calme** : browser.newContext: Target page, context or browser has been closed
- **parcours:projet** : browser.newContext: Target page, context or browser has been closed
- **ecran** : browser.newContext: Target page, context or browser has been closed
- **mouvement** : browser.newContext: Target page, context or browser has been closed

## Repères

- Numéro de version des fichiers : ?v=7
- Journal v7 : 12 étape(s) notée(s), 437 min de travail pour 395 min de budget, 0 min d’attente de l’utilisateur.
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
node _audit/audit.mjs --complet --seulement=fichiers,mesures,parcours,ecran,mouvement
```
