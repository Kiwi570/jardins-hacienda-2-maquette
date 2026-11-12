# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 12/11/2026 16:48:43 · 14 min · 8 page(s) · audit complet

## Résumé

- Statut : **18 échec(s)**
- Passe : `20261112-153451-complet` · version ?v=7
- Échecs : **18**
- À regarder : **13**
- Non lancé : **26**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (6), mesures (416), balayage (7), films d’ouverture (14), films de transition (8)

## Grille wouahou

| Point | État | Détail |
|---|---|---|
| 1. L’effet signature se manipule | ✓ présent | accueil |
| 2. L’intro devient la page | ✓ présent | objet d’ouverture sur 7 page(s), versObjet dans l’intro |
| 3. La transition reprend le motif | ✓ présent | voile en cloche |
| 4. Quelque chose relie les sections et les pages | ✓ présent | sur les 7 page(s) |
| 5. Un titre fait l’événement sur chaque page | ⚠ à regarder | présent sur /la-carte, /offrir, /receptions ; absent sur /, /infos-pratiques, /les-fetes, /reserver |
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
| 20261112-143325-complet-partiel | complet | toutes | fichiers, grille, mesures, parcours, mouvement | 18 | 17 | 0 | échecs |
| 20261112-145451-complet-cible-partiel | complet | /,/infos-pratiques,/offrir,/reserver | fichiers, mesures, parcours, mouvement | 1 | 3 | 0 | échecs |
| 20261112-150636-standard-cible-partiel | standard | / | fichiers | 0 | 0 | 0 | complet |
| 20261112-151818-complet-cible-partiel | complet | / | fichiers, mesures | 0 | 0 | 0 | complet |
| **20261112-153451-complet** (celle-ci) | complet | toutes | toutes | 18 | 13 | 26 | échecs |

## Échecs

### lien vers le site actuel (1)

- **lien vers le site actuel** — `index.html` — https://www.lesjardinsdelhacienda54.com/online-ordering

### texte sous 12 px (6)

- **texte sous 12 px** — `/` — div.conteneur.venir__grille > div.venir__plan.est-vu:nth-of-type(2) > svg.venir__carte > text.venir__pays:nth-of-type(1) — 9.0 px _(390×844 normal, 375×667 normal, 320×568 normal, 844×390 normal, 768×1024 normal, 1024×768 normal, +33)_
- **texte sous 12 px** — `/` — div.conteneur.venir__grille > div.venir__plan.est-vu:nth-of-type(2) > svg.venir__carte > text.venir__pays:nth-of-type(2) — 9.0 px _(390×844 normal, 375×667 normal, 320×568 normal, 844×390 normal, 768×1024 normal, 1024×768 normal, +33)_
- **texte sous 12 px** — `/` — div.conteneur.venir__grille > div.venir__plan.est-vu:nth-of-type(2) > svg.venir__carte > text.venir__note:nth-of-type(4) — 9.5 px _(390×844 normal, 375×667 normal, 320×568 normal, 844×390 normal, 768×1024 normal, 1024×768 normal, +33)_
- **texte sous 12 px** — `/` — div.conteneur.venir__grille > div.venir__plan:nth-of-type(2) > svg.venir__carte > text.venir__pays:nth-of-type(1) — 9.0 px _(320×568 sansJs, 375×667 sansJs, 390×844 sansJs, 844×390 sansJs, 768×1024 sansJs, 1024×768 sansJs, +7)_
- **texte sous 12 px** — `/` — div.conteneur.venir__grille > div.venir__plan:nth-of-type(2) > svg.venir__carte > text.venir__pays:nth-of-type(2) — 9.0 px _(320×568 sansJs, 375×667 sansJs, 390×844 sansJs, 844×390 sansJs, 768×1024 sansJs, 1024×768 sansJs, +7)_
- **texte sous 12 px** — `/` — div.conteneur.venir__grille > div.venir__plan:nth-of-type(2) > svg.venir__carte > text.venir__note:nth-of-type(4) — 9.5 px _(320×568 sansJs, 375×667 sansJs, 390×844 sansJs, 844×390 sansJs, 768×1024 sansJs, 1024×768 sansJs, +7)_

### premier écran : titre h1 invisible (1)

- **premier écran : titre h1 invisible** — `/404` — h1#lum-titre « Cette page a fermé à minuit. » _(1920×1080 normal)_

### contraste sur image (4)

- **contraste sur image** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.ouv-infos__actions:nth-of-type(4) > a.bouton.bouton--contour:nth-of-type(2) « Une question ? » — 4.05:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1) _(390×844 normal)_
- **contraste sur image** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.ouv-infos__actions:nth-of-type(4) > a.lien-fleche:nth-of-type(3) « Venir » — 4.05:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1) _(390×844 normal)_
- **contraste sur image** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.ouv-infos__actions:nth-of-type(4) > a.bouton.bouton--contour:nth-of-type(2) « Une question ? » — 4.12:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1) _(1366×768 normal)_
- **contraste sur image** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.ouv-infos__actions:nth-of-type(4) > a.lien-fleche:nth-of-type(3) « Venir » — 4.13:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1) _(1366×768 normal)_

### premier écran : bouton principal hors de l’écran (2)

- **premier écran : bouton principal hors de l’écran** — `/les-fetes` — div.ouv-fetes__contenu:nth-of-type(1) > p.ouv-fetes__actions:nth-of-type(4) > span:nth-of-type(1) > a.bouton « Réserver la Saint-Sylvestre » _(320×568 normal, 375×667 normal, 320×568 calme, 320×568 sansJs, 320×568 sansWebgl, 375×667 sansJs, +2)_
- **premier écran : bouton principal hors de l’écran** — `/receptions` — div.conteneur.ouv-recep__grille > div.ouv-recep__contenu:nth-of-type(1) > p.ouv-recep__actions:nth-of-type(3) > a.bouton:nth-of-type(1) « Demander une réception » _(320×568 normal, 375×667 normal, 320×568 sansJs, 320×568 calme, 375×667 calme, 320×568 sansWebgl, +2)_

### premier écran : information clé hors de l’écran (2)

- **premier écran : information clé hors de l’écran** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__grille > div.ouv-fetes__contenu:nth-of-type(1) > p.ouv-fetes__info:nth-of-type(5) « Saint-Sylvestre : 120 € le menu · Noël : 79 € par  » _(320×568 normal, 375×667 normal, 390×844 normal, 844×390 normal, 320×568 calme, 320×568 sansJs, +12)_
- **premier écran : information clé hors de l’écran** — `/receptions` — section#debut > div.conteneur.ouv-recep__grille > div.ouv-recep__contenu:nth-of-type(1) > p.ouv-recep__info:nth-of-type(4) « Appeler 06 18 21 28 10 » _(320×568 normal, 375×667 normal, 390×844 normal, 320×568 sansJs, 320×568 calme, 375×667 calme, +7)_

### textes qui se chevauchent (2)

- **textes qui se chevauchent** — `/offrir` — div.conteneur.ouv-offrir__grille > div.carte-cadeau-apercu.ouv-offrir__carte:nth-of-type(2) > div.cca__face > p.cca__nom:nth-of-type(1) « CARTE CADEAU » — avec div.conteneur.ouv-offrir__grille > div.carte-cadeau-apercu.ouv-offrir__carte:nth-of-type(2) > div.cca__face > p.cca__montant:nth-of-type(2) « 25 € » _(320×568 normal, 320×568 sansWebgl)_
- **textes qui se chevauchent** — `/offrir` — div.conteneur.ouv-offrir__grille > div.carte-cadeau-apercu.ouv-offrir__carte:nth-of-type(2) > div.cca__face > p.cca__nom:nth-of-type(1) « CARTE CADEAU » — avec div.conteneur.ouv-offrir__grille > div.carte-cadeau-apercu.ouv-offrir__carte:nth-of-type(2) > div.cca__face > p.cca__montant:nth-of-type(2) « 100 € » _(320×568 sansJs, 320×568 calme)_

## À regarder

### grille : aucun titre ne fait l’événement (point 5) (4)

- **grille : aucun titre ne fait l’événement (point 5)** — `/` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"
- **grille : aucun titre ne fait l’événement (point 5)** — `/infos-pratiques` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"
- **grille : aucun titre ne fait l’événement (point 5)** — `/les-fetes` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"
- **grille : aucun titre ne fait l’événement (point 5)** — `/reserver` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"

### grille : objet d’ouverture hors du premier écran (5)

- **grille : objet d’ouverture hors du premier écran** — `/infos-pratiques` — 356 × 41 px visibles : l’intro et le voile s’ouvrent depuis le centre de l’écran à cette taille _(1366×768)_
- **grille : objet d’ouverture hors du premier écran** — `/infos-pratiques` — 257 × 29 px visibles : l’intro et le voile s’ouvrent depuis le centre de l’écran à cette taille _(390×844)_
- **grille : objet d’ouverture hors du premier écran** — `/la-carte` — 335 × 40 px visibles : l’intro et le voile s’ouvrent depuis le centre de l’écran à cette taille _(390×844)_
- **grille : objet d’ouverture hors du premier écran** — `/les-fetes` — 358 × 40 px visibles : l’intro et le voile s’ouvrent depuis le centre de l’écran à cette taille _(390×844)_
- **grille : objet d’ouverture hors du premier écran** — `/reserver` — 358 × 52 px visibles : l’intro et le voile s’ouvrent depuis le centre de l’écran à cette taille _(390×844)_

### contraste sur image (2)

- **contraste sur image** — `/infos-pratiques` — section#debut > div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.ouv-infos__adresse:nth-of-type(3) « 6 Vathier Haye, 54580 Moineville À 24 km de Thionv » — 4.49:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(1366×768 normal)_
- **contraste sur image** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.ouv-infos__adresse:nth-of-type(3) > span.ouv-infos__distances « À 24 km de Thionville, 19 km de Metz, 47 km de Lux » — 4.48:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(1366×768 normal)_

### transition : changement brusque (1)

- **transition : changement brusque** — `/offrir → /la-carte` — à 1395 ms (différence 25 %) (films/transition-offrir-vers-la-carte-1366.png) _(1366×768 film)_

### retour avant : changement brusque (1)

- **retour avant : changement brusque** — `/la-carte` — à 76 ms (différence 38 %) (films/retour-avant-390.png) _(390×844 retour avant)_

## Non lancé

- **film de la transition depuis /infos-pratiques 390×844** : browser.newContext: Target page, context or browser has been closed (3 tentatives)
- **film de la transition depuis /la-carte 390×844** : browser.newContext: Target page, context or browser has been closed (3 tentatives)
- **film de la transition depuis /les-fetes 390×844** : browser.newContext: Target page, context or browser has been closed (3 tentatives)
- **film de la transition depuis /offrir 390×844** : browser.newContext: Target page, context or browser has been closed (3 tentatives)
- **film de la transition depuis /receptions 390×844** : browser.newContext: Target page, context or browser has been closed (3 tentatives)
- **film de la transition depuis /reserver 390×844** : browser.newContext: Target page, context or browser has been closed (3 tentatives)
- **bords de l’écran / 1366×768** : page.evaluate: Target page, context or browser has been closed (3 tentatives)
- **bords de l’écran /infos-pratiques 1366×768** : page.evaluate: Target page, context or browser has been closed (3 tentatives)
- **bords de l’écran /la-carte 1366×768** : page.evaluate: Target page, context or browser has been closed (3 tentatives)
- **bords de l’écran /les-fetes 1366×768** : page.evaluate: Target page, context or browser has been closed (3 tentatives)
- **bords de l’écran /offrir 1366×768** : page.evaluate: Target page, context or browser has been closed (3 tentatives)
- **bords de l’écran /receptions 1366×768** : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page (3 tentatives)
- **bords de l’écran /reserver 1366×768** : page.evaluate: Target page, context or browser has been closed (3 tentatives)
- **bords de l’écran / 1920×1080** : page.evaluate: Target page, context or browser has been closed (3 tentatives)
- **parcours:intro** : browser.newContext: Target page, context or browser has been closed
- **parcours:menu** : browser.newContext: Target page, context or browser has been closed
- **parcours:liens** : browser.newContext: Target page, context or browser has been closed
- **parcours:hauteur** : browser.newContext: Target page, context or browser has been closed
- **parcours:calme** : browser.newContext: Target page, context or browser has been closed
- **parcours:projet** : browser.newContext: Target page, context or browser has been closed
- **ecran** : browser.newContext: Target page, context or browser has been closed
- **fluidite** : browser.newContext: Target page, context or browser has been closed
- **mouvement** : browser.newContext: Target page, context or browser has been closed
- **vitesse** : browser.newContext: Target page, context or browser has been closed
- **captures** : browser.newContext: Target page, context or browser has been closed
- **Safari (WebKit)** : WebKit ne peut pas s’installer ici : vérification à faire dans Safari sur le Mac (liste dans le rapport)

### À vérifier dans Safari sur le Mac (WebKit indisponible ici)

- Ouverture de chaque page : rien qui clignote, intro complète au premier chargement et au rechargement.
- Changement de page : le voile couvre l’écran, pas de page blanche ; retour arrière sans intro ni voile resté.
- Défilement : fluide (natif), en-tête qui se cache et revient sans clignoter, sections épinglées entières.
- Menu sur iPhone (mode Responsive de Safari) : ouverture, fermeture, page bloquée derrière.
- Polices, images, mention « Illustration générée », formulaires et barre fixe du bas.

## Repères

- Numéro de version des fichiers : ?v=7
- Journal v7 : 13 étape(s) notée(s), 532 min de travail pour 515 min de budget, 0 min d’attente de l’utilisateur.
- Journal : « audit standard (deux passages) et corrections » 79 min pour 35 prévues.
- Journal : « test « vrai visiteur » (7 missions, deux formats) et « regard neuf » (agents séparés) » 48 min pour 30 prévues.
- Journal : « corrections d'après le visiteur et le regard neuf (assiette en vraie photo, agenda, Saint-Sylvestre, heures, typographie, ancres) » 45 min pour 30 prévues.
- Journal : « audit complet, corrections et contre-audit ciblé » 64 min pour 30 prévues.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Ouverture / (1366×768) : 2657 ms depuis le premier octet
- Ouverture /infos-pratiques (1366×768) : 2469 ms depuis le premier octet
- Ouverture /la-carte (1366×768) : 2483 ms depuis le premier octet
- Ouverture /les-fetes (1366×768) : 2375 ms depuis le premier octet
- Ouverture /offrir (1366×768) : 2434 ms depuis le premier octet
- Ouverture /receptions (1366×768) : 2456 ms depuis le premier octet
- Ouverture /reserver (1366×768) : 2428 ms depuis le premier octet
- Ouverture / (390×844) : 2597 ms depuis le premier octet
- Ouverture /infos-pratiques (390×844) : 2433 ms depuis le premier octet
- Ouverture /la-carte (390×844) : 2459 ms depuis le premier octet
- film de l'ouverture /la-carte 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /les-fetes (390×844) : 2491 ms depuis le premier octet
- Ouverture /offrir (390×844) : 2405 ms depuis le premier octet
- Ouverture /receptions (390×844) : 2463 ms depuis le premier octet
- Ouverture /reserver (390×844) : 2464 ms depuis le premier octet
- Bords de l’écran : 0 images d’intro, 0 de voile et 0 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --complet --seulement=fichiers,mesures,films,bords,parcours,ecran,fluidite,mouvement,vitesse,captures
```
