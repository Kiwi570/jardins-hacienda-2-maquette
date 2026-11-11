# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 11/11/2026 17:39:48 · 36 min · 8 page(s) · audit complet

## Résumé

- Statut : **7 échec(s)**
- Passe : `20261111-160415-complet` · version ?v=7
- Échecs : **7**
- À regarder : **17**
- Non lancé : **1**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (7), mesures (416), balayage (7), films d’ouverture (14), films de transition (14), bords de l’écran (8), intro accélérable et passable (7), menu (1), clavier (8), liens et boutons (8), liens profonds (16), liens vers la page en cours (7), changements de hauteur (7), mode calme (14), bouton du mode calme (2), parcours du projet (1), tient dans l’écran (16), films des épinglages (1), fluidité (14), défilement selon l’appareil (5), mouvement (14), effets du plan (24), souris immobile (4), vitesse (7), captures (1)

## Grille wouahou

| Point | État | Détail |
|---|---|---|
| 1. L’effet signature se manipule | ✓ présent | accueil |
| 2. L’intro devient la page | ✓ présent | objet d’ouverture sur 7 page(s), versObjet dans l’intro |
| 3. La transition reprend le motif | ✓ présent | voile en cloche |
| 4. Quelque chose relie les sections et les pages | ✓ présent | sur les 7 page(s) |
| 5. Un titre fait l’événement sur chaque page | ✓ présent | sur les 7 page(s) |
| 6. La scène est un geste du métier | ✓ présent | geste du métier sur /, /la-carte |
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
| **20261111-160415-complet** (celle-ci) | complet | toutes | toutes | 7 | 17 | 1 | échecs |

## Échecs

### premier écran : bouton principal hors de l’écran (2)

- **premier écran : bouton principal hors de l’écran** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.ouv-infos__actions:nth-of-type(5) > a.bouton:nth-of-type(1) « Appeler 06 18 21 28 10 » _(844×390 normal, 844×390 calme, 844×390 sansWebgl)_
- **premier écran : bouton principal hors de l’écran** — `/offrir` — div.conteneur.ouv-offrir__grille > div.ouv-offrir__texte:nth-of-type(1) > p.ouv-offrir__actions:nth-of-type(4) > a.bouton « Composer la carte » _(1000×560 sansJs)_

### ouverture (1)

- **ouverture** — `/les-fetes` — la page ne signale jamais qu’elle est prête (html.pret) _(1920×1080 normal)_

### premier écran : information clé hors de l’écran (2)

- **premier écran : information clé hors de l’écran** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu:nth-of-type(4) > p.ouv-fetes__info:nth-of-type(5) « Saint-Sylvestre : 120 € le menu · Noël : 79 € par  » _(1000×560 sansJs)_
- **premier écran : information clé hors de l’écran** — `/offrir` — div.conteneur.ouv-offrir__grille > div.ouv-offrir__texte:nth-of-type(1) > p.ouv-offrir__actions:nth-of-type(4) > span.ouv-offrir__info « De 25 à 200 € · valable 6 mois » _(1000×560 sansJs)_

### épinglage : image isolée différente (flash) (1)

- **épinglage : image isolée différente (flash)** — `/les-fetes` — à 2379 ms (films/epinglage-les-fetes-1.png) _(1366×768)_

### fluidité (1)

- **fluidité** — `/les-fetes` — 8 % d'images de plus de 50 ms, tâche la plus longue 300 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

## À regarder

### clearProps « all » (2)

- **clearProps « all »** — assets/js/modules/formulaire-par-etapes/module.js : efface aussi les variables CSS posées dans le HTML ; nommer les propriétés (clearProps: 'transform,opacity')
- **clearProps « all »** — assets/js/modules/rideau-en-lanieres/module.js : efface aussi les variables CSS posées dans le HTML ; nommer les propriétés (clearProps: 'transform,opacity')

### contraste sur image (5)

- **contraste sur image** — `/la-carte` — div.ardoise.est-craie > div.ardoise__surface > p.ardoise__date:nth-of-type(1) > span « Cette semaine » — 4.19:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(390×844 normal)_
- **contraste sur image** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu:nth-of-type(4) > p.heure-geante.ouv-fetes__geant:nth-of-type(1) > span:nth-of-type(1) « J-50 » — 1.17:1 sur les 10 % de la photo les moins favorables (minimum 3:1), ombre portée à vérifier _(1366×768 normal)_
- **contraste sur image** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu:nth-of-type(4) > p.surtitre:nth-of-type(2) > span:nth-of-type(1) « CET HIVER » — 2.56:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(1366×768 normal)_
- **contraste sur image** — `/les-fetes` — h1#fetes-h1 > span:nth-of-type(1) « Les fêtes au coin du feu » — 2.88:1 sur les 10 % de la photo les moins favorables (minimum 3:1), ombre portée à vérifier _(1366×768 normal)_
- **contraste sur image** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > p.heure-geante.heure-geante--nuit:nth-of-type(1) « 19:00 » — 2.35:1 sur les 10 % de la photo les moins favorables (minimum 3:1), ombre portée à vérifier _(1366×768 normal)_

### lien vers une ancre : changement brusque (1)

- **lien vers une ancre : changement brusque** — `/receptions → /reserver#formulaire` — à 1260 ms (différence 25 %) (films/ancre-receptions-1366.png) _(1366×768 film)_

### rechargement au milieu de la page (1)

- **rechargement au milieu de la page** — `/la-carte` — écran différent à la même position après rechargement (15.8 %), voir comparaisons/rechargement-la-carte-*.png _(1366×768)_

### fluidité (2)

- **fluidité** — `/` — 9 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_
- **fluidité** — `/offrir` — 7 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

### effet qui ne bouge pas au défilement (6)

- **effet qui ne bouge pas au défilement** — `/` — button.bouton — carton : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/infos-pratiques` — span.heure-geante.ouv-infos__heure — axes : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/offrir` — p.heure-geante.heure-geante--nuit — axes : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/receptions` — p.heure-geante.heure-geante--nuit — axes : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/receptions` — div.invitation — invitation : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/les-fetes` — section#debut.ouv-fetes.givre — saison : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(390×844 normal)_

## Non lancé

- **Safari (WebKit)** : WebKit ne peut pas s’installer ici : vérification à faire dans Safari sur le Mac (liste dans le rapport)

### À vérifier dans Safari sur le Mac (WebKit indisponible ici)

- Ouverture de chaque page : rien qui clignote, intro complète au premier chargement et au rechargement.
- Changement de page : le voile couvre l’écran, pas de page blanche ; retour arrière sans intro ni voile resté.
- Défilement : fluide (natif), en-tête qui se cache et revient sans clignoter, sections épinglées entières.
- Menu sur iPhone (mode Responsive de Safari) : ouverture, fermeture, page bloquée derrière.
- Polices, images, mention « Illustration générée », formulaires et barre fixe du bas.

## Repères

- Numéro de version des fichiers : ?v=7
- Journal v7 : 4 étape(s) notée(s), 89 min de travail pour 105 min de budget, 0 min d’attente de l’utilisateur.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Ouverture / (1366×768) : 2569 ms depuis le premier octet
- Ouverture /infos-pratiques (1366×768) : 2536 ms depuis le premier octet
- Ouverture /la-carte (1366×768) : 2567 ms depuis le premier octet
- Ouverture /les-fetes (1366×768) : 2667 ms depuis le premier octet
- Ouverture /offrir (1366×768) : 2511 ms depuis le premier octet
- film de l'ouverture /offrir 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /receptions (1366×768) : 2546 ms depuis le premier octet
- Ouverture /reserver (1366×768) : 2512 ms depuis le premier octet
- Ouverture / (390×844) : 2592 ms depuis le premier octet
- Ouverture /infos-pratiques (390×844) : 2472 ms depuis le premier octet
- Ouverture /la-carte (390×844) : 2505 ms depuis le premier octet
- Ouverture /les-fetes (390×844) : 2484 ms depuis le premier octet
- Ouverture /offrir (390×844) : 2482 ms depuis le premier octet
- Ouverture /receptions (390×844) : 2467 ms depuis le premier octet
- film de l'ouverture /receptions 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /reserver (390×844) : 2492 ms depuis le premier octet
- bords de l’écran /les-fetes 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Bords de l’écran : 508 images d’intro, 11 de voile et 209 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Tient dans l'écran /infos-pratiques : aucune section épinglée ou plein écran.
- Tient dans l'écran /la-carte : aucune section épinglée ou plein écran.
- Tient dans l'écran /offrir : aucune section épinglée ou plein écran.
- Tient dans l'écran /receptions : aucune section épinglée ou plein écran.
- Tient dans l'écran /reserver : aucune section épinglée ou plein écran.
- Fluidité /infos-pratiques 1366×768 (molette) : 0 % d'images lentes sur 248, tâche la plus longue 0 ms
- Fluidité /la-carte 1366×768 (molette) : 1 % d'images lentes sur 382, tâche la plus longue 51 ms
- Fluidité /receptions 1366×768 (molette) : 0 % d'images lentes sur 192, tâche la plus longue 0 ms
- Fluidité /reserver 1366×768 (molette) : 0 % d'images lentes sur 223, tâche la plus longue 53 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1437, tâche la plus longue 0 ms
- Fluidité /infos-pratiques 390×844 (doigt) : 0 % d'images lentes sur 1419, tâche la plus longue 0 ms
- Fluidité /la-carte 390×844 (doigt) : 0 % d'images lentes sur 1334, tâche la plus longue 0 ms
- Fluidité /les-fetes 390×844 (doigt) : 0 % d'images lentes sur 1359, tâche la plus longue 0 ms
- Fluidité /offrir 390×844 (doigt) : 0 % d'images lentes sur 1408, tâche la plus longue 0 ms
- Fluidité /receptions 390×844 (doigt) : 0 % d'images lentes sur 1345, tâche la plus longue 0 ms
- Fluidité /reserver 390×844 (doigt) : 0 % d'images lentes sur 1343, tâche la plus longue 0 ms
- Vitesse / : 1.01 s de calcul au chargement (téléphone ralenti).
- Vitesse /infos-pratiques : 0.36 s de calcul au chargement (téléphone ralenti).
- Vitesse /la-carte : 0.58 s de calcul au chargement (téléphone ralenti).
- Vitesse /les-fetes : 0.39 s de calcul au chargement (téléphone ralenti).
- Vitesse /offrir : 0.39 s de calcul au chargement (téléphone ralenti).
- Vitesse /receptions : 0.55 s de calcul au chargement (téléphone ralenti).
- Vitesse /reserver : 0.49 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --complet --pages=/,/infos-pratiques,/les-fetes,/offrir --seulement=fichiers,mesures,ecran,fluidite
```
