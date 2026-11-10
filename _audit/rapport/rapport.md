# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 10/11/2026 20:03:15 · 23 min · 7 page(s) · audit complet

## Résumé

- Échecs : **2**
- À regarder : **8**
- Non lancé : **2**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (7), mesures (364), balayage (6), films d’ouverture (12), films de transition (12), bords de l’écran (7), intro accélérable et passable (7), menu (1), clavier (7), liens et boutons (7), liens profonds (11), liens vers la page en cours (6), changements de hauteur (5), mode calme (12), bouton du mode calme (2), parcours du projet (1), fluidité (12), défilement selon l’appareil (5), mouvement (12), effets du plan (16), souris immobile (4), vitesse (6), captures (1)

## Grille wouahou

| Point | État | Détail |
|---|---|---|
| 1. L’effet signature se manipule | ✓ présent | accueil |
| 2. L’intro devient la page | ✓ présent | objet d’ouverture sur 6 page(s), versObjet dans l’intro |
| 3. La transition reprend le motif | ✓ présent | voile en cloche |
| 4. Quelque chose relie les sections et les pages | ✓ présent | sur les 6 page(s) |
| 5. Un titre fait l’événement sur chaque page | ✓ présent | sur les 6 page(s) |
| 6. La scène est un geste du métier | ✓ présent | geste du métier sur / |
| 7. L’action principale a un retour physique | ✓ présent | sur /offrir, /reserver |

Le script vérifie les marques (`data-grille`, `data-iris-centre`, forme du voile, `versObjet`) ; la force et la justesse de chaque point se jugent sur les captures et les films.

## Échecs

### textes qui se chevauchent (2)

- **textes qui se chevauchent** — `/` — h2#rdv-titre > span:nth-of-type(1) > div.fx-mot-l:nth-of-type(6) > div.fx-lettre:nth-of-type(1) « f » — avec h2#rdv-titre > span:nth-of-type(1) > div.fx-mot-l:nth-of-type(6) > div.fx-lettre:nth-of-type(2) « e » _(1920×1080 sansWebgl)_
- **textes qui se chevauchent** — `/` — h2#rdv-titre > span:nth-of-type(1) > div.fx-mot-l:nth-of-type(6) > div.fx-lettre:nth-of-type(2) « e » — avec h2#rdv-titre > span:nth-of-type(1) > div.fx-mot-l:nth-of-type(6) > div.fx-lettre:nth-of-type(3) « u » _(1920×1080 sansWebgl)_

## À regarder

### clearProps « all » (1)

- **clearProps « all »** — assets/js/modules/carte-cadeau-qui-se-compose/module.js : efface aussi les variables CSS posées dans le HTML ; nommer les propriétés (clearProps: 'transform,opacity')

### identifiant en double (1)

- **identifiant en double** — `/la-carte` — symbol#carte-a-partager — id="carte-a-partager" _(390×844 normal, 1366×768 normal, 390×844 sansJs, 390×844 calme, 1366×768 sansJs, 1366×768 calme)_

### ouverture : changement brusque (2)

- **ouverture : changement brusque** — `/infos-pratiques` — à 848 ms (différence 35 %) (films/ouverture-infos-pratiques-1366.png) _(1366×768 film)_
- **ouverture : changement brusque** — `/la-carte` — à 878 ms (différence 23 %) (films/ouverture-la-carte-1366.png) _(1366×768 film)_

### retour avant : changement brusque (1)

- **retour avant : changement brusque** — `/la-carte` — à 47 ms (différence 62 %) (films/retour-avant-1366.png) _(1366×768 retour avant)_

### rechargement au milieu de la page (1)

- **rechargement au milieu de la page** — `/la-carte` — écran différent à la même position après rechargement (9.2 %), voir comparaisons/rechargement-la-carte-*.png _(1366×768)_

### fluidité (1)

- **fluidité** — `/` — 5 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

### effet qui ne bouge pas au défilement (1)

- **effet qui ne bouge pas au défilement** — `/` — div.cadran-saison — saison : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_

## Non lancé

- **parcours:hauteur** : page.evaluate: TypeError: Cannot read properties of null (reading 'scrollIntoView')
- **Safari (WebKit)** : WebKit ne peut pas s’installer ici : vérification à faire dans Safari sur le Mac (liste dans le rapport)

### À vérifier dans Safari sur le Mac (WebKit indisponible ici)

- Ouverture de chaque page : rien qui clignote, intro complète au premier chargement et au rechargement.
- Changement de page : le voile couvre l’écran, pas de page blanche ; retour arrière sans intro ni voile resté.
- Défilement : fluide (natif), en-tête qui se cache et revient sans clignoter, sections épinglées entières.
- Menu sur iPhone (mode Responsive de Safari) : ouverture, fermeture, page bloquée derrière.
- Polices, images, mention « Illustration générée », formulaires et barre fixe du bas.

## Repères

- Numéro de version des fichiers : ?v=5
- Journal v5 : 2 étape(s) notée(s), 23 min de travail pour 80 min de budget, 0 min d’attente de l’utilisateur.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Ouverture / (1366×768) : 2707 ms depuis le premier octet
- Ouverture /infos-pratiques (1366×768) : 983 ms depuis le premier octet
- film de l'ouverture /infos-pratiques 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /la-carte (1366×768) : 1052 ms depuis le premier octet
- Ouverture /les-fetes (1366×768) : 983 ms depuis le premier octet
- film de l'ouverture /les-fetes 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /offrir (1366×768) : 963 ms depuis le premier octet
- Ouverture /reserver (1366×768) : 1086 ms depuis le premier octet
- Ouverture / (390×844) : 2569 ms depuis le premier octet
- film de l'ouverture / 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /infos-pratiques (390×844) : 995 ms depuis le premier octet
- Ouverture /la-carte (390×844) : 1045 ms depuis le premier octet
- Ouverture /les-fetes (390×844) : 1008 ms depuis le premier octet
- Ouverture /offrir (390×844) : 932 ms depuis le premier octet
- Ouverture /reserver (390×844) : 1055 ms depuis le premier octet
- Bords de l’écran : 206 images d’intro, 46 de voile et 234 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Tient dans l'écran / : aucune section épinglée ou plein écran.
- Tient dans l'écran /infos-pratiques : aucune section épinglée ou plein écran.
- Tient dans l'écran /la-carte : aucune section épinglée ou plein écran.
- Tient dans l'écran /les-fetes : aucune section épinglée ou plein écran.
- Tient dans l'écran /offrir : aucune section épinglée ou plein écran.
- Tient dans l'écran /reserver : aucune section épinglée ou plein écran.
- Fluidité /infos-pratiques 1366×768 (molette) : 0 % d'images lentes sur 248, tâche la plus longue 0 ms
- Fluidité /la-carte 1366×768 (molette) : 1 % d'images lentes sur 285, tâche la plus longue 50 ms
- Fluidité /les-fetes 1366×768 (molette) : 0 % d'images lentes sur 229, tâche la plus longue 0 ms
- Fluidité /offrir 1366×768 (molette) : 0 % d'images lentes sur 126, tâche la plus longue 0 ms
- Fluidité /reserver 1366×768 (molette) : 1 % d'images lentes sur 231, tâche la plus longue 56 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1364, tâche la plus longue 76 ms
- Fluidité /infos-pratiques 390×844 (doigt) : 0 % d'images lentes sur 1368, tâche la plus longue 0 ms
- Fluidité /la-carte 390×844 (doigt) : 0 % d'images lentes sur 1367, tâche la plus longue 0 ms
- Fluidité /les-fetes 390×844 (doigt) : 0 % d'images lentes sur 1371, tâche la plus longue 0 ms
- Fluidité /offrir 390×844 (doigt) : 0 % d'images lentes sur 1369, tâche la plus longue 0 ms
- Fluidité /reserver 390×844 (doigt) : 0 % d'images lentes sur 1365, tâche la plus longue 0 ms
- Vitesse / : 0.97 s de calcul au chargement (téléphone ralenti).
- Vitesse /infos-pratiques : 0.29 s de calcul au chargement (téléphone ralenti).
- Vitesse /la-carte : 0.38 s de calcul au chargement (téléphone ralenti).
- Vitesse /les-fetes : 0.37 s de calcul au chargement (téléphone ralenti).
- Vitesse /offrir : 0.29 s de calcul au chargement (téléphone ralenti).
- Vitesse /reserver : 0.41 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --complet --seulement=fichiers,mesures,parcours
```

## Relances après ce rapport (10 novembre 2026, livraison v5)

- **Textes qui se chevauchent sur /** (lettres de « Les fêtes au coin du feu » pendant leur animation lettre par lettre, 1920×1080 sans WebGL) : le titre apparaît désormais ligne par ligne. Mesures de l'accueil relancées seules (`--complet --seulement=mesures --pages=/`, 13 tailles, tous les modes) : 0 échec.
- **parcours:hauteur sur /reserver** (non lancé : le script perd les boutons des jours que le module redessine, A1 dans `_audit/modules-restau.md`) : refait à la main en relisant la liste à chaque clic, 0 px de décalage.
- **Safari** : à vérifier sur le Mac (liste ci-dessus).
