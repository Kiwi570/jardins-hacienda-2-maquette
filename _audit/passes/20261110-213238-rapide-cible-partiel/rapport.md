# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 10/11/2026 22:37:01 · 4 min · 3 page(s) · audit RAPIDE : ne vaut pas pour une livraison ciblé sur /,/receptions,/reserver (étapes : fichiers, mesures, parcours)

## Résumé

- Statut : **8 échec(s)**
- Passe : `20261110-213238-rapide-cible-partiel` · version ?v=6
- Échecs : **8**
- À regarder : **3**
- Non lancé : **0**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), mesures (21), intro accélérable et passable (7), menu (1), clavier (3), liens et boutons (3), liens profonds (10), liens vers la page en cours (3), changements de hauteur (3), mode calme (6), bouton du mode calme (2), parcours du projet (1)

## Passes de cette version (?v=6)

Chaque passe garde son rapport dans `_audit/passes/` : une relance ciblée ne fait pas disparaître la preuve d’une passe plus large.

| Passe | Niveau | Pages | Étapes | Échecs | À regarder | Non lancé | Statut |
|---|---|---|---|---:|---:|---:|---|
| 20261110-202351-rapide | rapide | toutes | toutes | 49 | 12 | 1 | échecs |
| 20261110-203603-rapide-cible | rapide | /,/la-carte,/les-fetes,/receptions,/reserver,/offrir,/infos-pratiques | toutes | 196 | 19 | 2 | échecs |
| 20261110-210108-rapide-cible-partiel | rapide | /,/la-carte,/les-fetes,/receptions,/reserver,/offrir,/infos-pratiques | mesures, films, parcours, fluidite | 25 | 8 | 1 | échecs |
| 20261110-212010-rapide-cible-partiel | rapide | /,/la-carte,/les-fetes,/receptions,/reserver,/offrir,/infos-pratiques | mesures, parcours, fluidite | 6 | 1 | 0 | échecs |
| **20261110-213238-rapide-cible-partiel** (celle-ci) | rapide | /,/receptions,/reserver | fichiers, mesures, parcours | 8 | 3 | 0 | échecs |

## Échecs

### image de partage (7)

- **image de partage** — `index.html` — fichier introuvable : /assets/partage/accueil-fr.jpg
- **image de partage** — `infos-pratiques.html` — fichier introuvable : /assets/partage/infos-pratiques-fr.jpg
- **image de partage** — `la-carte.html` — fichier introuvable : /assets/partage/la-carte-fr.jpg
- **image de partage** — `les-fetes.html` — fichier introuvable : /assets/partage/les-fetes-fr.jpg
- **image de partage** — `offrir.html` — fichier introuvable : /assets/partage/offrir-fr.jpg
- **image de partage** — `receptions.html` — fichier introuvable : /assets/partage/receptions-fr.jpg
- **image de partage** — `reserver.html` — fichier introuvable : /assets/partage/reserver-fr.jpg

### textes qui se chevauchent (1)

- **textes qui se chevauchent** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > p.surtitre:nth-of-type(2) « RÉCEPTIONS » — avec section#debut > div.conteneur.ouv-recep__contenu > h1.ouv-recep__titre « Recevoir pour un pot de départ » _(1366×768 normal)_

## À regarder

### « à compléter » visible (2)

- **« à compléter » visible** — `infos-pratiques.html` — 1 fois hors du pied de page : remplacer par une phrase vraie qui oriente le visiteur (« Tarifs selon la saison, donnés à la réservation ») ou retirer l'élément, et le noter dans la fiche du README (sauf sens propre : « dossier à compléter »)
- **« à compléter » visible** — `receptions.html` — 1 fois hors du pied de page : remplacer par une phrase vraie qui oriente le visiteur (« Tarifs selon la saison, donnés à la réservation ») ou retirer l'élément, et le noter dans la fiche du README (sauf sens propre : « dossier à compléter »)

### clearProps « all » (1)

- **clearProps « all »** — assets/js/modules/carte-cadeau-qui-se-compose/module.js : efface aussi les variables CSS posées dans le HTML ; nommer les propriétés (clearProps: 'transform,opacity')

## Non lancé

Tout a été lancé.


## Repères

- Numéro de version des fichiers : ?v=6
- Journal v6 : 2 étape(s) notée(s), 31 min de travail pour 35 min de budget, 2 min d’attente de l’utilisateur.
- Audit rapide : étapes lourdes sur /, /receptions, /reserver.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Balayage des largeurs : non fait en audit rapide.

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --rapide --seulement=fichiers,mesures
```
