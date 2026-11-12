# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 12/11/2026 15:52:47 · 19 min · 8 page(s) · audit complet (étapes : fichiers, grille, mesures, parcours, mouvement)

## Résumé

- Statut : **18 échec(s)**
- Passe : `20261112-143325-complet-partiel` · version ?v=7
- Échecs : **18**
- À regarder : **17**
- Non lancé : **0**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (6), mesures (416), balayage (7), intro accélérable et passable (7), menu (1), clavier (8), liens et boutons (8), liens profonds (16), liens vers la page en cours (7), changements de hauteur (7), mode calme (14), bouton du mode calme (2), parcours du projet (1), mouvement (14), effets du plan (22), souris immobile (3)

## Grille wouahou

| Point | État | Détail |
|---|---|---|
| 1. L’effet signature se manipule | ✓ présent | accueil |
| 2. L’intro devient la page | ✓ présent | objet d’ouverture sur 7 page(s), versObjet dans l’intro |
| 3. La transition reprend le motif | ✓ présent | voile en cloche |
| 4. Quelque chose relie les sections et les pages | ✓ présent | sur les 7 page(s) |
| 5. Un titre fait l’événement sur chaque page | ⚠ à regarder | présent sur /la-carte, /les-fetes, /offrir, /receptions ; absent sur /, /infos-pratiques, /reserver |
| 6. La scène est un geste du métier | ✓ présent | geste du métier sur /la-carte, /receptions |
| 7. L’action principale a un retour physique | ✓ présent | sur /, /les-fetes, /offrir, /receptions, /reserver |

Le script vérifie les marques (`data-grille`, `data-iris-centre`, forme du voile, `versObjet`) ; la force et la justesse de chaque point se jugent sur les captures et les films.

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
| 20261112-134303-complet-partiel | complet | toutes | fichiers, mesures, parcours, ecran, mouvement | 13 | 0 | 6 | échecs |
| 20261112-141822-complet-cible | complet | /,/receptions | toutes | 78 | 7 | 1 | échecs |
| **20261112-143325-complet-partiel** (celle-ci) | complet | toutes | fichiers, grille, mesures, parcours, mouvement | 18 | 17 | 0 | échecs |

## Échecs

### textes qui se chevauchent (2)

- **textes qui se chevauchent** — `/` — section#feu > div.feu__cadre > div.feu__tete > p.feu__sous:nth-of-type(1) « Au creux de la cheminée » — avec h2#feu-titre > span:nth-of-type(1) « Au coin » _(1440×900 sansJs, 1440×900 calme, 1728×1000 sansJs, 1728×1000 calme, 1920×1080 calme, 1920×1080 sansJs, +2)_
- **textes qui se chevauchent** — `/` — section#feu > div.feu__cadre > div.feu__tete > p.feu__sous:nth-of-type(1) « Au creux de la cheminée » — avec h2#feu-titre > span:nth-of-type(2) « du feu » _(1440×900 sansJs, 1440×900 calme, 1728×1000 sansJs, 1728×1000 calme, 1920×1080 calme, 1920×1080 sansJs, +2)_

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

### positions non recalculées après un changement de hauteur (2)

- **positions non recalculées après un changement de hauteur** — `/` — décalage de 97 px _(1366×768)_
- **positions non recalculées après un changement de hauteur** — `/` — décalage de 96 px _(1366×768)_

### section sans effet au défilement (1)

- **section sans effet au défilement** — `/reserver` — section#debut.ouv-resa — ses effets (service) ne bougent pas, ou sont cachés à cette taille _(1366×768 normal, 390×844 normal)_

## À regarder

### grille : aucun titre ne fait l’événement (point 5) (3)

- **grille : aucun titre ne fait l’événement (point 5)** — `/` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"
- **grille : aucun titre ne fait l’événement (point 5)** — `/infos-pratiques` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"
- **grille : aucun titre ne fait l’événement (point 5)** — `/reserver` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"

### grille : objet d’ouverture hors du premier écran (5)

- **grille : objet d’ouverture hors du premier écran** — `/infos-pratiques` — 289 × 41 px visibles : l’intro et le voile s’ouvrent depuis le centre de l’écran à cette taille _(1366×768)_
- **grille : objet d’ouverture hors du premier écran** — `/infos-pratiques` — 208 × 29 px visibles : l’intro et le voile s’ouvrent depuis le centre de l’écran à cette taille _(390×844)_
- **grille : objet d’ouverture hors du premier écran** — `/la-carte` — 280 × 40 px visibles : l’intro et le voile s’ouvrent depuis le centre de l’écran à cette taille _(390×844)_
- **grille : objet d’ouverture hors du premier écran** — `/receptions` — 358 × 41 px visibles : l’intro et le voile s’ouvrent depuis le centre de l’écran à cette taille _(390×844)_
- **grille : objet d’ouverture hors du premier écran** — `/reserver` — 358 × 52 px visibles : l’intro et le voile s’ouvrent depuis le centre de l’écran à cette taille _(390×844)_

### contraste sur image (2)

- **contraste sur image** — `/infos-pratiques` — section#debut > div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.surtitre:nth-of-type(1) « INFOS PRATIQUES » — 4.37:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(390×844 normal)_
- **contraste sur image** — `/infos-pratiques` — section#debut > div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.surtitre:nth-of-type(1) « INFOS PRATIQUES » — 4.48:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(1366×768 normal)_

### rechargement au milieu de la page (3)

- **rechargement au milieu de la page** — `/la-carte` — écran différent à la même position après rechargement (67.7 %), voir comparaisons/rechargement-la-carte-*.png _(1366×768)_
- **rechargement au milieu de la page** — `/receptions` — écran différent à la même position après rechargement (7.8 %), voir comparaisons/rechargement-receptions-*.png _(1366×768)_
- **rechargement au milieu de la page** — `/reserver` — écran différent à la même position après rechargement (70.0 %), voir comparaisons/rechargement-reserver-*.png _(1366×768)_

### effet qui ne bouge pas au défilement (3)

- **effet qui ne bouge pas au défilement** — `/receptions` — div.invitation — invitation : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/reserver` — section#debut.ouv-resa — service : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/les-fetes` — section#debut.ouv-fetes.givre — saison : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(390×844 normal)_

### effet qui dérive sous la souris immobile (1)

- **effet qui dérive sous la souris immobile** — `/` — [data-souris] soleil — léger changement (0.4 %) 1,5 à 4,5 s après l’arrêt de la souris _(1366×768 souris)_

## Non lancé

Tout a été lancé.


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
node _audit/audit.mjs --complet --pages=/,/infos-pratiques,/offrir,/reserver --seulement=fichiers,mesures,parcours,mouvement
```
