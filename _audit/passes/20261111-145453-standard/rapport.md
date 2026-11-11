# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 11/11/2026 16:23:44 · 29 min · 8 page(s) · audit standard

## Résumé

- Statut : **18 échec(s)**
- Passe : `20261111-145453-standard` · version ?v=7
- Échecs : **18**
- À regarder : **16**
- Non lancé : **1**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (7), mesures (112), balayage (7), films d’ouverture (14), films de transition (14), bords de l’écran (8), intro accélérable et passable (7), menu (1), clavier (8), liens et boutons (8), liens profonds (16), liens vers la page en cours (7), changements de hauteur (7), mode calme (14), bouton du mode calme (2), parcours du projet (1), tient dans l’écran (8), films des épinglages (1), fluidité (14), défilement selon l’appareil (5), mouvement (14), effets du plan (23), souris immobile (4), vitesse (7), captures (1)

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
| **20261111-145453-standard** (celle-ci) | standard | toutes | toutes | 18 | 16 | 1 | échecs |

## Échecs

### texte coupé (1)

- **texte coupé** — `/` — li#journees-festives > div.lieu__texte > p:nth-of-type(2) « Du mardi au jeudi, de 12 h à 19 h, de juin à septe » — coupé par section#apres-midi > div.panorama__cadre « 12 h – 19 h Les journées festives Du mardi au jeud » _(390×844 normal, 320×568 normal, 390×844 sansWebgl)_

### accessibilité (axe) : color-contrast (1)

- **accessibilité (axe) : color-contrast** — `/infos-pratiques` — a[data-action-principale=""] — Elements must meet minimum color contrast ratio thresholds _(390×844 calme, 1366×768 calme)_

### contraste insuffisant (4)

- **contraste insuffisant** — `/infos-pratiques` — section#debut > div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.surtitre:nth-of-type(1) « INFOS PRATIQUES » — 1.02:1 (minimum 4.5:1) _(390×844 sansJs, 1366×768 sansJs)_
- **contraste insuffisant** — `/infos-pratiques` — h1#infos-h1 « Horaires, accès et contact » — 1.02:1 (minimum 3:1) _(390×844 sansJs, 1366×768 sansJs, 320×568 sansJs)_
- **contraste insuffisant** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.statut.ouv-infos__statut:nth-of-type(3) > span:nth-of-type(2) « Horaires » — 1.02:1 (minimum 4.5:1) _(390×844 sansJs, 1366×768 sansJs, 320×568 sansJs)_
- **contraste insuffisant** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.ouv-infos__actions:nth-of-type(4) > span.ouv-infos__adresse « 6 Vathier Haye, 54580 Moineville » — 1.02:1 (minimum 4.5:1) _(390×844 sansJs, 1366×768 sansJs, 320×568 sansJs)_

### textes qui se chevauchent (2)

- **textes qui se chevauchent** — `/la-carte` — div.ardoise.est-craie > div.ardoise__surface > p.ardoise__date:nth-of-type(1) > span « Cette semaine » — avec div.ardoise.est-craie > div.ardoise__surface > h2.ardoise__titre > span « Ce midi, à la carte » _(768×1024 normal, 844×390 normal, 1366×768 normal, 1920×1080 normal, 1366×768 sansWebgl)_
- **textes qui se chevauchent** — `/la-carte` — div.ardoise > div.ardoise__surface > p.ardoise__date:nth-of-type(1) > span « Cette semaine » — avec div.ardoise > div.ardoise__surface > h2.ardoise__titre > span « Ce midi, à la carte » _(1366×768 sansJs, 1366×768 calme, 844×390 calme)_

### lien profond (1)

- **lien profond** — `/reserver → /infos-pratiques#acces` — section pas en haut de l'écran (298 px) _(1366×768 lien profond)_

### ne tient pas dans l’écran (2)

- **ne tient pas dans l’écran** — `/les-fetes` — div.d3d__cadre.socle-cadre > div.d3d__depliant:nth-of-type(2) > article.d3d__volet:nth-of-type(3) > p.noel__acompte:nth-of-type(4) « Un acompte par couvert peut être demandé pour les  » — coupé en bas de 28 px (à 50 % de la scène) _(1000×560 épinglé)_
- **ne tient pas dans l’écran** — `/les-fetes` — div.d3d__cadre.socle-cadre > div.d3d__depliant:nth-of-type(2) > article.d3d__volet:nth-of-type(3) > p.noel__acompte:nth-of-type(4) « Un acompte par couvert peut être demandé pour les  » — coupé en bas de 26 px (à 96 % de la scène) _(1000×560 épinglé)_

### fluidité (3)

- **fluidité** — `/` — 13 % d'images de plus de 50 ms, tâche la plus longue 202 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_
- **fluidité** — `/les-fetes` — 8 % d'images de plus de 50 ms, tâche la plus longue 277 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_
- **fluidité** — `/les-fetes` — 88 % d'images de plus de 50 ms, tâche la plus longue 117 ms _(390×844 défilement au doigt, processeur ralenti 4 fois)_

### section sans effet au défilement (2)

- **section sans effet au défilement** — `/la-carte` — section#passe.assiette.passe — aucun élément data-effet (bibliothèque : data-anime="lignes|mots|lettres|cascade|rideau", data-fx ; ou effet du projet marqué data-effet) _(1366×768 normal, 390×844 normal)_
- **section sans effet au défilement** — `/les-fetes` — section#noel.d3d.noel — aucun élément data-effet (bibliothèque : data-anime="lignes|mots|lettres|cascade|rideau", data-fx ; ou effet du projet marqué data-effet) _(1366×768 normal, 390×844 normal)_

### effet du plan absent (2)

- **effet du plan absent** — « apres-midi » : aucun élément data-effet="apres-midi"
- **effet du plan absent** — « cloches » : aucun élément data-effet="cloches"

## À regarder

### clearProps « all » (2)

- **clearProps « all »** — assets/js/modules/formulaire-par-etapes/module.js : efface aussi les variables CSS posées dans le HTML ; nommer les propriétés (clearProps: 'transform,opacity')
- **clearProps « all »** — assets/js/modules/rideau-en-lanieres/module.js : efface aussi les variables CSS posées dans le HTML ; nommer les propriétés (clearProps: 'transform,opacity')

### journal du projet (1)

- **journal du projet** — aucune entrée pour la version 7 de donnees/site.json

### typographie française (1)

- **typographie française** — `/` — section#fetes > div.conteneur > p.fetes-hiver__soirees:nth-of-type(2) > span « À venir : Soirée côte de bœuf, samedi 21 novembre  » — espace insécable manquante avant ou après « : » _(1366×768 normal)_

### contraste sur image (7)

- **contraste sur image** — `/infos-pratiques` — section#debut > div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.surtitre:nth-of-type(1) « INFOS PRATIQUES » — 3.93:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(390×844 normal)_
- **contraste sur image** — `/infos-pratiques` — section#debut > div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.surtitre:nth-of-type(1) « INFOS PRATIQUES » — 4.04:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(1366×768 normal)_
- **contraste sur image** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.ouv-infos__actions:nth-of-type(4) > span.ouv-infos__adresse « 6 Vathier Haye, 54580 Moineville » — 1.05:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(1366×768 normal)_
- **contraste sur image** — `/la-carte` — div.ardoise.est-craie > div.ardoise__surface > p.ardoise__date:nth-of-type(1) > span « Cette semaine » — 4.25:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(390×844 normal)_
- **contraste sur image** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu:nth-of-type(4) > p.heure-geante.ouv-fetes__geant:nth-of-type(1) > span:nth-of-type(1) « J-50 » — 1.17:1 sur les 10 % de la photo les moins favorables (minimum 3:1), ombre portée à vérifier _(1366×768 normal)_
- **contraste sur image** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu:nth-of-type(4) > p.surtitre:nth-of-type(2) > span:nth-of-type(1) « CET HIVER » — 3.04:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(1366×768 normal)_
- **contraste sur image** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > p.heure-geante.heure-geante--nuit:nth-of-type(1) « 19:00 » — 2.89:1 sur les 10 % de la photo les moins favorables (minimum 3:1), ombre portée à vérifier _(1366×768 normal)_

### rechargement au milieu de la page (1)

- **rechargement au milieu de la page** — `/la-carte` — écran différent à la même position après rechargement (70.8 %), voir comparaisons/rechargement-la-carte-*.png _(1366×768)_

### effet qui ne bouge pas au défilement (4)

- **effet qui ne bouge pas au défilement** — `/` — button.bouton — carton : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/offrir` — p.heure-geante.heure-geante--nuit — axes : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/receptions` — p.heure-geante.heure-geante--nuit — axes : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/receptions` — div.invitation — invitation : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_

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
- Audit standard : étapes lourdes sur /, /infos-pratiques, /la-carte, /les-fetes, /offrir, /receptions, /reserver.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Ouverture / (1366×768) : 2590 ms depuis le premier octet
- Ouverture /infos-pratiques (1366×768) : 2522 ms depuis le premier octet
- Ouverture /la-carte (1366×768) : 2518 ms depuis le premier octet
- Ouverture /les-fetes (1366×768) : 2583 ms depuis le premier octet
- Ouverture /offrir (1366×768) : 2505 ms depuis le premier octet
- Ouverture /receptions (1366×768) : 2532 ms depuis le premier octet
- Ouverture /reserver (1366×768) : 2478 ms depuis le premier octet
- Ouverture / (390×844) : 2512 ms depuis le premier octet
- film de l'ouverture / 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /infos-pratiques (390×844) : 2483 ms depuis le premier octet
- film de l'ouverture /infos-pratiques 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /la-carte (390×844) : 2411 ms depuis le premier octet
- Ouverture /les-fetes (390×844) : 2523 ms depuis le premier octet
- Ouverture /offrir (390×844) : 2491 ms depuis le premier octet
- film de l'ouverture /offrir 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /receptions (390×844) : 2490 ms depuis le premier octet
- film de l'ouverture /receptions 390×844 : réussi à la tentative 3 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /reserver (390×844) : 2486 ms depuis le premier octet
- Bords de l’écran : 546 images d’intro, 16 de voile et 201 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Tient dans l'écran /infos-pratiques : aucune section épinglée ou plein écran.
- Tient dans l'écran /la-carte : aucune section épinglée ou plein écran.
- Tient dans l'écran /offrir : aucune section épinglée ou plein écran.
- Tient dans l'écran /receptions : aucune section épinglée ou plein écran.
- Tient dans l'écran /reserver : aucune section épinglée ou plein écran.
- Fluidité /infos-pratiques 1366×768 (molette) : 0 % d'images lentes sur 235, tâche la plus longue 0 ms
- Fluidité /la-carte 1366×768 (molette) : 2 % d'images lentes sur 379, tâche la plus longue 67 ms
- Fluidité /offrir 1366×768 (molette) : 1 % d'images lentes sur 127, tâche la plus longue 0 ms
- Fluidité /receptions 1366×768 (molette) : 0 % d'images lentes sur 184, tâche la plus longue 0 ms
- Fluidité /reserver 1366×768 (molette) : 0 % d'images lentes sur 225, tâche la plus longue 0 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1428, tâche la plus longue 56 ms
- Fluidité /infos-pratiques 390×844 (doigt) : 0 % d'images lentes sur 1424, tâche la plus longue 0 ms
- Fluidité /la-carte 390×844 (doigt) : 0 % d'images lentes sur 1339, tâche la plus longue 0 ms
- Fluidité /offrir 390×844 (doigt) : 0 % d'images lentes sur 1417, tâche la plus longue 0 ms
- Fluidité /receptions 390×844 (doigt) : 0 % d'images lentes sur 1346, tâche la plus longue 0 ms
- Fluidité /reserver 390×844 (doigt) : 0 % d'images lentes sur 1342, tâche la plus longue 0 ms
- Vitesse / : 0.93 s de calcul au chargement (téléphone ralenti).
- Vitesse /infos-pratiques : 0.38 s de calcul au chargement (téléphone ralenti).
- Vitesse /la-carte : 0.67 s de calcul au chargement (téléphone ralenti).
- Vitesse /les-fetes : 0.52 s de calcul au chargement (téléphone ralenti).
- Vitesse /offrir : 0.39 s de calcul au chargement (téléphone ralenti).
- Vitesse /receptions : 0.53 s de calcul au chargement (téléphone ralenti).
- Vitesse /reserver : 0.41 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --seulement=fichiers,mesures,parcours,ecran,fluidite,mouvement
```
