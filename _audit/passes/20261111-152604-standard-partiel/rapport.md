# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 11/11/2026 16:43:07 · 17 min · 8 page(s) · audit standard (étapes : fichiers, mesures, parcours, ecran, mouvement)

## Résumé

- Statut : **8 échec(s)**
- Passe : `20261111-152604-standard-partiel` · version ?v=7
- Échecs : **8**
- À regarder : **19**
- Non lancé : **1**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), mesures (112), balayage (7), intro accélérable et passable (7), menu (1), clavier (8), liens et boutons (8), liens profonds (16), liens vers la page en cours (7), changements de hauteur (3), mode calme (14), bouton du mode calme (2), parcours du projet (1), tient dans l’écran (10), films des épinglages (1), mouvement (14), effets du plan (24), souris immobile (4)

## Passes de cette version (?v=7)

Chaque passe garde son rapport dans `_audit/passes/` : une relance ciblée ne fait pas disparaître la preuve d’une passe plus large.

| Passe | Niveau | Pages | Étapes | Échecs | À regarder | Non lancé | Statut |
|---|---|---|---|---:|---:|---:|---|
| 20261111-143746-standard | standard | toutes | toutes | 59 | 11 | 9 | échecs |
| 20261111-145453-standard | standard | toutes | toutes | 18 | 16 | 1 | échecs |
| **20261111-152604-standard-partiel** (celle-ci) | standard | toutes | fichiers, mesures, parcours, ecran, mouvement | 8 | 19 | 1 | échecs |

## Échecs

### premier écran : titre h1 invisible (1)

- **premier écran : titre h1 invisible** — `/404` — h1#lum-titre « Cette page a fermé à minuit. » _(1366×768 normal)_

### premier écran : bouton principal hors de l’écran (1)

- **premier écran : bouton principal hors de l’écran** — `/404` — section#debut > div.conteneur.introuvable__texte:nth-of-type(4) > p.introuvable__actions.lum__actions:nth-of-type(3) > a.bouton:nth-of-type(1) « Revenir à midi » _(1366×768 normal)_

### contraste sur image (1)

- **contraste sur image** — `/404` — section#debut > div.conteneur.introuvable__texte:nth-of-type(4) > p.heure-geante.heure-geante--nuit:nth-of-type(1) > span.hg__m:nth-of-type(3) « 00 » — 2.27:1 sur les 10 % de la photo les moins favorables (minimum 3:1) _(390×844 normal)_

### textes qui se chevauchent (5)

- **textes qui se chevauchent** — `/les-fetes` — h2#agd-titre > div.fx-ligne-mask > div.fx-ligne « Les prochaines dates » — avec section#dates > div.conteneur > div.agd__tete:nth-of-type(1) > p.agd__prochaine:nth-of-type(2) « Prochaine date : Soirée côte de bœuf, dans 9 jours » _(1366×768 sansWebgl)_
- **textes qui se chevauchent** — `/les-fetes` — h2#agd-titre > div.fx-ligne-mask > div.fx-ligne « Les prochaines dates » — avec div.conteneur > div.agd__outils:nth-of-type(2) > div.agd__filtres > button.agd__filtre:nth-of-type(1) « Toutes » _(1366×768 sansWebgl)_
- **textes qui se chevauchent** — `/les-fetes` — h2#agd-titre > div.fx-ligne-mask > div.fx-ligne « Les prochaines dates » — avec div.conteneur > div.agd__outils:nth-of-type(2) > div.agd__filtres > button.agd__filtre:nth-of-type(2) « Soirée » _(1366×768 sansWebgl)_
- **textes qui se chevauchent** — `/les-fetes` — h2#agd-titre > div.fx-ligne-mask > div.fx-ligne « Les prochaines dates » — avec div.conteneur > div.agd__outils:nth-of-type(2) > div.agd__filtres > button.agd__filtre:nth-of-type(3) « Brunch » _(1366×768 sansWebgl)_
- **textes qui se chevauchent** — `/les-fetes` — h2#agd-titre > div.fx-ligne-mask > div.fx-ligne « Les prochaines dates » — avec div.conteneur > div.agd__outils:nth-of-type(2) > div.agd__filtres > button.agd__filtre:nth-of-type(4) « Fête » _(1366×768 sansWebgl)_

## À regarder

### clearProps « all » (2)

- **clearProps « all »** — assets/js/modules/formulaire-par-etapes/module.js : efface aussi les variables CSS posées dans le HTML ; nommer les propriétés (clearProps: 'transform,opacity')
- **clearProps « all »** — assets/js/modules/rideau-en-lanieres/module.js : efface aussi les variables CSS posées dans le HTML ; nommer les propriétés (clearProps: 'transform,opacity')

### journal du projet (1)

- **journal du projet** — aucune entrée pour la version 7 de donnees/site.json

### contraste sur image (9)

- **contraste sur image** — `/404` — h1#lum-titre « Cette page a fermé à minuit. » — 2.61:1 sur les 10 % de la photo les moins favorables (minimum 3:1), ombre portée à vérifier _(390×844 normal)_
- **contraste sur image** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.statut.ouv-infos__statut:nth-of-type(3) > span:nth-of-type(2) « Fermé · ouvre demain à 12 h » — 4.33:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(390×844 normal)_
- **contraste sur image** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.ouv-infos__actions:nth-of-type(4) > span.ouv-infos__adresse « 6 Vathier Haye, 54580 Moineville » — 3.75:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(390×844 normal)_
- **contraste sur image** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.statut.ouv-infos__statut:nth-of-type(3) > span:nth-of-type(2) « Fermé · ouvre demain à 12 h » — 3.68:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(1366×768 normal)_
- **contraste sur image** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.ouv-infos__actions:nth-of-type(4) > span.ouv-infos__adresse « 6 Vathier Haye, 54580 Moineville » — 3.01:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(1366×768 normal)_
- **contraste sur image** — `/la-carte` — div.ardoise.est-craie > div.ardoise__surface > p.ardoise__date:nth-of-type(1) > span « Cette semaine » — 4.25:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(390×844 normal)_
- **contraste sur image** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu:nth-of-type(4) > p.heure-geante.ouv-fetes__geant:nth-of-type(1) > span:nth-of-type(1) « J-50 » — 1.17:1 sur les 10 % de la photo les moins favorables (minimum 3:1), ombre portée à vérifier _(1366×768 normal)_
- **contraste sur image** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu:nth-of-type(4) > p.surtitre:nth-of-type(2) > span:nth-of-type(1) « CET HIVER » — 2.99:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(1366×768 normal)_
- **contraste sur image** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > p.heure-geante.heure-geante--nuit:nth-of-type(1) « 19:00 » — 2.89:1 sur les 10 % de la photo les moins favorables (minimum 3:1), ombre portée à vérifier _(1366×768 normal)_

### rechargement au milieu de la page (1)

- **rechargement au milieu de la page** — `/la-carte` — écran différent à la même position après rechargement (70.8 %), voir comparaisons/rechargement-la-carte-*.png _(1366×768)_

### effet qui ne bouge pas au défilement (6)

- **effet qui ne bouge pas au défilement** — `/` — button.bouton — carton : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/infos-pratiques` — span.heure-geante.ouv-infos__heure — axes : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/offrir` — p.heure-geante.heure-geante--nuit — axes : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/receptions` — p.heure-geante.heure-geante--nuit — axes : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/receptions` — div.invitation — invitation : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/les-fetes` — section#debut.ouv-fetes.givre — saison : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(390×844 normal)_

## Non lancé

- **parcours:hauteur** : page.reload: Timeout 30000ms exceeded.

## Repères

- Numéro de version des fichiers : ?v=7
- Audit standard : étapes lourdes sur /, /infos-pratiques, /la-carte, /les-fetes, /offrir, /receptions, /reserver.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Tient dans l'écran /infos-pratiques : aucune section épinglée ou plein écran.
- Tient dans l'écran /la-carte : aucune section épinglée ou plein écran.
- Tient dans l'écran /offrir : aucune section épinglée ou plein écran.
- Tient dans l'écran /receptions : aucune section épinglée ou plein écran.
- Tient dans l'écran /reserver : aucune section épinglée ou plein écran.

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --seulement=fichiers,mesures,parcours
```
