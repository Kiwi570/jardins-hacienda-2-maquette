# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 12/11/2026 15:30:18 · 12 min · 2 page(s) · audit complet ciblé sur /,/receptions

## Résumé

- Statut : **78 échec(s)**
- Passe : `20261112-141822-complet-cible` · version ?v=7
- Échecs : **78**
- À regarder : **7**
- Non lancé : **1**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (5), mesures (104), balayage (2), films d’ouverture (4), films de transition (4), bords de l’écran (3), intro accélérable et passable (7), menu (1), clavier (2), liens et boutons (2), liens profonds (12), liens vers la page en cours (2), changements de hauteur (2), mode calme (4), bouton du mode calme (2), parcours du projet (1), tient dans l’écran (8), fluidité (4), défilement selon l’appareil (5), mouvement (4), effets du plan (22), souris immobile (2), vitesse (2), captures (1)

## Grille wouahou

| Point | État | Détail |
|---|---|---|
| 1. L’effet signature se manipule | ✓ présent | accueil |
| 2. L’intro devient la page | ✗ absent | sans objet d’ouverture : /, /infos-pratiques, /la-carte, /receptions, /reserver |
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
| **20261112-141822-complet-cible** (celle-ci) | complet | /,/receptions | toutes | 78 | 7 | 1 | échecs |

## Échecs

### grille : objet d’ouverture absent (points 2 et 3) (5)

- **grille : objet d’ouverture absent (points 2 et 3)** — `/` — aucun élément data-iris-centre : l’intro et le voile s’ouvrent alors depuis le centre de l’écran, pas depuis l’objet de la page
- **grille : objet d’ouverture absent (points 2 et 3)** — `/infos-pratiques` — aucun élément data-iris-centre : l’intro et le voile s’ouvrent alors depuis le centre de l’écran, pas depuis l’objet de la page
- **grille : objet d’ouverture absent (points 2 et 3)** — `/la-carte` — aucun élément data-iris-centre : l’intro et le voile s’ouvrent alors depuis le centre de l’écran, pas depuis l’objet de la page
- **grille : objet d’ouverture absent (points 2 et 3)** — `/receptions` — aucun élément data-iris-centre : l’intro et le voile s’ouvrent alors depuis le centre de l’écran, pas depuis l’objet de la page
- **grille : objet d’ouverture absent (points 2 et 3)** — `/reserver` — aucun élément data-iris-centre : l’intro et le voile s’ouvrent alors depuis le centre de l’écran, pas depuis l’objet de la page

### texte sous 12 px (3)

- **texte sous 12 px** — `/` — section#midi > div.heros__texte.conteneur:nth-of-type(2) > p.heros__lieu:nth-of-type(1) « RESTAURANT & LIEU DE RÉCEPTION À MOINEVILLE, À 19  » — 10.9 px _(390×844 normal, 375×667 normal, 320×568 normal, 768×1024 normal, 320×568 calme, 320×568 sansJs, +10)_
- **texte sous 12 px** — `/` — article.moment-carte:nth-of-type(3) > div.moment-carte__visuel.moment-carte__visuel--cadeau > div.carte-mini > span.carte-mini__mot:nth-of-type(4) « CARTE CADEAU » — 6.3 px _(390×844 normal, 375×667 normal, 320×568 normal, 844×390 normal, 768×1024 normal, 1024×768 normal, +46)_
- **texte sous 12 px** — `/` — article.moment-carte:nth-of-type(3) > div.moment-carte__visuel.moment-carte__visuel--cadeau > div.carte-mini > span.carte-mini__nom:nth-of-type(2) « Les Jardins de l'Hacienda » — 9.9 px _(320×568 normal, 1024×768 normal, 320×568 calme, 320×568 sansJs, 320×568 sansWebgl, 1024×768 sansJs, +2)_

### zone tactile sous 44 px (8)

- **zone tactile sous 44 px** — `/` — div.heros__texte.conteneur:nth-of-type(2) > div.heros__barre > p.heros__rdv:nth-of-type(2) > a « Soirée côte de bœuf, samedi 21 novembre 2026 » — 358 × 28 px _(390×844 normal, 375×667 normal, 320×568 normal, 844×390 normal, 768×1024 normal, 1024×768 normal, +18)_
- **zone tactile sous 44 px** — `/` — div.moment__grille.fx-fini > article.moment-carte:nth-of-type(1) > h3 > a.moment-carte__lien « Saint-Sylvestre » — 128 × 33 px _(390×844 normal, 375×667 normal, 320×568 normal, 844×390 normal, 768×1024 normal, 1024×768 normal, +12)_
- **zone tactile sous 44 px** — `/` — div.moment__grille.fx-fini > article.moment-carte:nth-of-type(2) > h3 > a.moment-carte__lien « Le menu de Noël » — 139 × 33 px _(390×844 normal, 375×667 normal, 320×568 normal, 844×390 normal, 768×1024 normal, 1024×768 normal, +12)_
- **zone tactile sous 44 px** — `/` — div.moment__grille.fx-fini > article.moment-carte:nth-of-type(3) > h3 > a.moment-carte__lien « La carte cadeau » — 130 × 33 px _(390×844 normal, 375×667 normal, 320×568 normal, 844×390 normal, 768×1024 normal, 1024×768 normal, +12)_
- **zone tactile sous 44 px** — `/` — form.mini-resa.feu__resa > div.feu__resa-haut:nth-of-type(1) > p.mini-resa__groupe:nth-of-type(2) > a « Plus de 10 personnes ? Demandez une réception. » — 272 × 42 px _(320×568 calme, 320×568 sansJs, 375×667 sansJs, 375×667 calme, 390×844 calme, 390×844 sansJs, +6)_
- **zone tactile sous 44 px** — `/` — div.moment__grille > article.moment-carte:nth-of-type(1) > h3 > a.moment-carte__lien « Saint-Sylvestre » — 128 × 33 px _(320×568 sansJs, 375×667 sansJs, 390×844 sansJs, 844×390 sansJs, 768×1024 sansJs, 1024×768 sansJs)_
- **zone tactile sous 44 px** — `/` — div.moment__grille > article.moment-carte:nth-of-type(2) > h3 > a.moment-carte__lien « Le menu de Noël » — 139 × 33 px _(320×568 sansJs, 375×667 sansJs, 390×844 sansJs, 844×390 sansJs, 768×1024 sansJs, 1024×768 sansJs)_
- **zone tactile sous 44 px** — `/` — div.moment__grille > article.moment-carte:nth-of-type(3) > h3 > a.moment-carte__lien « La carte cadeau » — 130 × 33 px _(320×568 sansJs, 375×667 sansJs, 390×844 sansJs, 844×390 sansJs, 768×1024 sansJs, 1024×768 sansJs)_

### texte coupé (19)

- **texte coupé** — `/` — ul.lieu-defile__piste > li.lieu-carte:nth-of-type(2) > h3.lieu-carte__titre > a.lieu-carte__lien « La terrasse → » — coupé par section#lieu > div.lieu-defile__cadre « LE LIEU Un endroit magique, en pleine nature À 19  » _(390×844 normal, 390×844 sansWebgl)_
- **texte coupé** — `/` — div.lieu-defile__cadre > ul.lieu-defile__piste > li.lieu-carte:nth-of-type(2) > p.lieu-carte__texte « Sous les paillotes, autour du brasero, pour les be » — coupé par section#lieu > div.lieu-defile__cadre « LE LIEU Un endroit magique, en pleine nature À 19  » _(390×844 normal, 768×1024 normal, 390×844 sansWebgl, 768×1024 sansWebgl)_
- **texte coupé** — `/` — ul.lieu-defile__piste > li.lieu-carte:nth-of-type(2) > h3.lieu-carte__titre > a.lieu-carte__lien « La terrasse → » — coupé par section#lieu > div.lieu-defile__cadre « LE LIEU Un endroit magique, en pleine nature Le re » _(375×667 normal, 320×568 normal, 320×568 sansWebgl, 375×667 sansWebgl)_
- **texte coupé** — `/` — div.lieu-defile__cadre > ul.lieu-defile__piste > li.lieu-carte:nth-of-type(2) > p.lieu-carte__texte « Sous les paillotes, autour du brasero, pour les be » — coupé par section#lieu > div.lieu-defile__cadre « LE LIEU Un endroit magique, en pleine nature Le re » _(375×667 normal, 320×568 normal, 320×568 sansWebgl, 375×667 sansWebgl)_
- **texte coupé** — `/` — section#lieu > div.lieu-defile__cadre > div.conteneur.lieu-defile__tete:nth-of-type(1) > p.surtitre:nth-of-type(1) « LE LIEU » — coupé par section#lieu > div.lieu-defile__cadre « LE LIEU Un endroit magique, en pleine nature Le re » _(844×390 normal, 844×390 sansWebgl)_
- **texte coupé** — `/` — div.lieu-defile__cadre > ul.lieu-defile__piste > li.lieu-carte:nth-of-type(1) > p.lieu-carte__texte « Les baies vitrées et les tables rondes en verre su » — coupé par section#lieu > div.lieu-defile__cadre « LE LIEU Un endroit magique, en pleine nature Le re » _(844×390 normal, 844×390 sansWebgl)_
- **texte coupé** — `/` — div.lieu-defile__cadre > ul.lieu-defile__piste > li.lieu-carte:nth-of-type(4) > p.lieu-carte__texte « Mariages, baptêmes, anniversaires, pots de départ  » — coupé par section#lieu > div.lieu-defile__cadre « LE LIEU Un endroit magique, en pleine nature Le re » _(844×390 normal, 844×390 sansWebgl)_
- **texte coupé** — `/` — ul.lieu-defile__piste > li.lieu-carte:nth-of-type(5) > h3.lieu-carte__titre > a.lieu-carte__lien « Le coin du feu → » — coupé par section#lieu > div.lieu-defile__cadre « LE LIEU Un endroit magique, en pleine nature Le re » _(844×390 normal, 1000×560 normal, 844×390 sansWebgl, 1000×560 sansWebgl)_
- **texte coupé** — `/` — li.lieu-carte:nth-of-type(5) > h3.lieu-carte__titre > a.lieu-carte__lien > span.lieu-carte__fleche « → » — coupé par section#lieu > div.lieu-defile__cadre « LE LIEU Un endroit magique, en pleine nature Le re » _(844×390 normal, 844×390 sansWebgl)_
- **texte coupé** — `/` — div.lieu-defile__cadre > ul.lieu-defile__piste > li.lieu-carte:nth-of-type(5) > p.lieu-carte__texte « L'hiver, la salle se resserre autour de la cheminé » — coupé par section#lieu > div.lieu-defile__cadre « LE LIEU Un endroit magique, en pleine nature Le re » _(844×390 normal, 1000×560 normal, 844×390 sansWebgl, 1000×560 sansWebgl)_
- **texte coupé** — `/` — div.lieu-defile__cadre > ul.lieu-defile__piste > li.lieu-carte:nth-of-type(3) > p.lieu-carte__texte « L'eau turquoise, les palmiers et les transats, de  » — coupé par section#lieu > div.lieu-defile__cadre « LE LIEU Un endroit magique, en pleine nature À 19  » _(1024×768 normal)_
- **texte coupé** — `/` — div.lieu-defile__cadre > ul.lieu-defile__piste > li.lieu-carte:nth-of-type(4) > p.lieu-carte__texte « Mariages, baptêmes, anniversaires, pots de départ  » — coupé par section#lieu > div.lieu-defile__cadre « LE LIEU Un endroit magique, en pleine nature À 19  » _(1280×720 normal, 1366×768 normal, 1440×900 normal, 1728×1000 normal, 1024×768 sansWebgl, 1280×720 sansWebgl, +2)_
- **texte coupé** — `/` — ul.lieu-defile__piste > li.lieu-carte:nth-of-type(4) > h3.lieu-carte__titre > a.lieu-carte__lien « Les réceptions → » — coupé par section#lieu > div.lieu-defile__cadre « LE LIEU Un endroit magique, en pleine nature À 19  » _(1440×900 normal)_
- **texte coupé** — `/` — li.lieu-carte:nth-of-type(4) > h3.lieu-carte__titre > a.lieu-carte__lien > span.lieu-carte__fleche « → » — coupé par section#lieu > div.lieu-defile__cadre « LE LIEU Un endroit magique, en pleine nature À 19  » _(1440×900 normal)_
- **texte coupé** — `/` — ul.lieu-defile__piste > li.lieu-carte:nth-of-type(1) > h3.lieu-carte__titre > a.lieu-carte__lien « Le restaurant → » — coupé par section#lieu > div.lieu-defile__cadre « LE LIEU Un endroit magique, en pleine nature À 19  » _(1920×1080 normal, 1440×900 sansWebgl, 1728×1000 sansWebgl)_
- **texte coupé** — `/` — div.lieu-defile__cadre > ul.lieu-defile__piste > li.lieu-carte:nth-of-type(1) > p.lieu-carte__texte « Les baies vitrées et les tables rondes en verre su » — coupé par section#lieu > div.lieu-defile__cadre « LE LIEU Un endroit magique, en pleine nature À 19  » _(1920×1080 normal, 1440×900 sansWebgl, 1728×1000 sansWebgl)_
- **texte coupé** — `/` — ul.lieu-defile__piste > li.lieu-carte:nth-of-type(5) > h3.lieu-carte__titre > a.lieu-carte__lien « Le coin du feu → » — coupé par section#lieu > div.lieu-defile__cadre « LE LIEU Un endroit magique, en pleine nature À 19  » _(1920×1080 normal)_
- **texte coupé** — `/` — div.lieu-defile__cadre > ul.lieu-defile__piste > li.lieu-carte:nth-of-type(5) > p.lieu-carte__texte « L'hiver, la salle se resserre autour de la cheminé » — coupé par section#lieu > div.lieu-defile__cadre « LE LIEU Un endroit magique, en pleine nature À 19  » _(1920×1080 normal)_
- **texte coupé** — `/` — li.lieu-carte:nth-of-type(1) > h3.lieu-carte__titre > a.lieu-carte__lien > span.lieu-carte__fleche « → » — coupé par section#lieu > div.lieu-defile__cadre « LE LIEU Un endroit magique, en pleine nature À 19  » _(1440×900 sansWebgl)_

### textes qui se chevauchent (30)

- **textes qui se chevauchent** — `/` — div.polaroid > div.polaroid__carte > div.polaroid__face.polaroid__face--avant:nth-of-type(1) > p.polaroid__legende « Au bord de la piscine, un jour d'été » — avec div.polaroid > div.polaroid__carte > div.polaroid__face.polaroid__face--dos:nth-of-type(2) > p.polaroid__dos-mot:nth-of-type(2) « Et les suggestions du chef, de vive voix » _(390×844 normal, 375×667 normal, 320×568 normal, 844×390 normal, 768×1024 normal, 320×568 calme, +14)_
- **textes qui se chevauchent** — `/` — div.polaroid__face.polaroid__face--dos:nth-of-type(2) > ul.polaroid__dos-liste > li:nth-of-type(1) > span:nth-of-type(1) « Œuf cocotte à la bourguignonne » — avec div.chef__table.est-arrivee:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--mot:nth-of-type(4) > span.etiquette__texte « Suggestions de vive voix » _(390×844 normal, 375×667 normal, 844×390 normal, 768×1024 normal, 1024×768 normal, 1000×560 normal, +30)_
- **textes qui se chevauchent** — `/` — div.polaroid__face.polaroid__face--dos:nth-of-type(2) > ul.polaroid__dos-liste > li:nth-of-type(2) > span:nth-of-type(1) « Poisson selon l'arrivage » — avec div.chef__table.est-arrivee:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--mot:nth-of-type(4) > span.etiquette__texte « Suggestions de vive voix » _(390×844 normal, 375×667 normal, 320×568 normal, 1024×768 normal, 1280×720 normal, 1366×768 normal, +12)_
- **textes qui se chevauchent** — `/` — div.polaroid > div.polaroid__carte > div.polaroid__face.polaroid__face--dos:nth-of-type(2) > p.polaroid__dos-mot:nth-of-type(2) « Et les suggestions du chef, de vive voix » — avec div.chef__table.est-arrivee:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--mot:nth-of-type(6) > span.etiquette__texte « Produits de saison » _(375×667 normal, 844×390 normal, 768×1024 normal, 1024×768 normal, 1000×560 normal, 375×667 calme, +9)_
- **textes qui se chevauchent** — `/` — div.polaroid > div.polaroid__carte > div.polaroid__face.polaroid__face--avant:nth-of-type(1) > p.polaroid__legende « Au bord de la piscine, un jour d'été » — avec div.polaroid__face.polaroid__face--dos:nth-of-type(2) > ul.polaroid__dos-liste > li:nth-of-type(4) > span:nth-of-type(1) « Tarte aux fruits de saison » _(320×568 normal, 320×568 calme, 320×568 sansJs, 320×568 sansWebgl)_
- **textes qui se chevauchent** — `/` — div.polaroid > div.polaroid__carte > div.polaroid__face.polaroid__face--avant:nth-of-type(1) > p.polaroid__legende « Au bord de la piscine, un jour d'été » — avec div.chef__table.est-arrivee:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--mot:nth-of-type(6) > span.etiquette__texte « Produits de saison » _(320×568 normal, 844×390 normal, 768×1024 normal, 320×568 calme, 320×568 sansWebgl, 844×390 calme, +3)_
- **textes qui se chevauchent** — `/` — div.polaroid > div.polaroid__carte > div.polaroid__face.polaroid__face--dos:nth-of-type(2) > p.polaroid__dos-titre:nth-of-type(1) « Cette semaine, à la carte » — avec div.chef__table.est-arrivee:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--mot:nth-of-type(1) > span.etiquette__texte « Une nouvelle carte chaque semaine » _(320×568 normal, 320×568 calme, 320×568 sansWebgl)_
- **textes qui se chevauchent** — `/` — div.polaroid > div.polaroid__carte > div.polaroid__face.polaroid__face--dos:nth-of-type(2) > p.polaroid__dos-titre:nth-of-type(1) « Cette semaine, à la carte » — avec div.chef__table.est-arrivee:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--mot:nth-of-type(3) > span.etiquette__texte « Fait maison » _(320×568 normal, 320×568 calme, 320×568 sansWebgl)_
- **textes qui se chevauchent** — `/` — div.polaroid__face.polaroid__face--dos:nth-of-type(2) > ul.polaroid__dos-liste > li:nth-of-type(4) > span:nth-of-type(2) « 9 € » — avec div.chef__table.est-arrivee:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--mot:nth-of-type(6) > span.etiquette__texte « Produits de saison » _(320×568 normal, 320×568 calme, 320×568 sansWebgl)_
- **textes qui se chevauchent** — `/` — div.polaroid > div.polaroid__carte > div.polaroid__face.polaroid__face--dos:nth-of-type(2) > p.polaroid__dos-mot:nth-of-type(2) « Et les suggestions du chef, de vive voix » — avec div.chef__table.est-arrivee:nth-of-type(1) > div.polaroid > button.polaroid__retourner > span.polaroid__retourner-texte « Retournez la photo » _(320×568 normal, 768×1024 normal, 320×568 calme, 320×568 sansWebgl, 768×1024 calme, 768×1024 sansWebgl)_
- **textes qui se chevauchent** — `/` — div.polaroid > div.polaroid__carte > div.polaroid__face.polaroid__face--dos:nth-of-type(2) > p.polaroid__dos-mot:nth-of-type(2) « Et les suggestions du chef, de vive voix » — avec div.chef__table.est-arrivee:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--photo:nth-of-type(5) > span.etiquette__texte « Girolles » _(844×390 normal, 768×1024 normal, 844×390 calme, 768×1024 calme, 844×390 sansWebgl, 768×1024 sansWebgl)_
- **textes qui se chevauchent** — `/` — div.chef__table.est-arrivee:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--mot:nth-of-type(4) > span.etiquette__texte « Suggestions de vive voix » — avec section#chef > div.conteneur.chef__grille > div.chef__texte:nth-of-type(2) > p:nth-of-type(3) « À la tête du restaurant, Régis Clauss met en valeu » _(844×390 normal, 844×390 calme, 844×390 sansWebgl)_
- **textes qui se chevauchent** — `/` — div.chef__table.est-arrivee:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--mot:nth-of-type(4) > span.etiquette__texte « Suggestions de vive voix » — avec section#chef > div.conteneur.chef__grille > div.chef__texte:nth-of-type(2) > p.chef__signature:nth-of-type(2) « Une signature culinaire entre tradition et créativ » _(1024×768 normal, 1000×560 normal, 1024×768 calme, 1000×560 calme, 1024×768 sansWebgl, 1000×560 sansWebgl)_
- **textes qui se chevauchent** — `/` — div.polaroid > div.polaroid__carte > div.polaroid__face.polaroid__face--dos:nth-of-type(2) > p.polaroid__dos-titre:nth-of-type(1) « Cette semaine, à la carte » — avec div.chef__table.est-arrivee:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--mot:nth-of-type(4) > span.etiquette__texte « Suggestions de vive voix » _(1728×1000 normal, 1920×1080 normal, 2560×1440 normal, 1728×1000 calme, 1920×1080 calme, 1728×1000 sansWebgl, +3)_
- **textes qui se chevauchent** — `/` — div.polaroid > div.polaroid__carte > div.polaroid__face.polaroid__face--avant:nth-of-type(1) > p.polaroid__legende « Au bord de la piscine, un jour d'été » — avec div.chef__table:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--mot:nth-of-type(6) > span.etiquette__texte « Produits de saison » _(320×568 sansJs, 844×390 sansJs, 768×1024 sansJs)_
- **textes qui se chevauchent** — `/` — div.polaroid > div.polaroid__carte > div.polaroid__face.polaroid__face--dos:nth-of-type(2) > p.polaroid__dos-titre:nth-of-type(1) « Cette semaine, à la carte » — avec div.chef__table:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--mot:nth-of-type(1) > span.etiquette__texte « Une nouvelle carte chaque semaine » _(320×568 sansJs)_
- **textes qui se chevauchent** — `/` — div.polaroid > div.polaroid__carte > div.polaroid__face.polaroid__face--dos:nth-of-type(2) > p.polaroid__dos-titre:nth-of-type(1) « Cette semaine, à la carte » — avec div.chef__table:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--mot:nth-of-type(3) > span.etiquette__texte « Fait maison » _(320×568 sansJs)_
- **textes qui se chevauchent** — `/` — div.polaroid__face.polaroid__face--dos:nth-of-type(2) > ul.polaroid__dos-liste > li:nth-of-type(2) > span:nth-of-type(1) « Poisson selon l'arrivage » — avec div.chef__table:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--mot:nth-of-type(4) > span.etiquette__texte « Suggestions de vive voix » _(320×568 sansJs, 375×667 sansJs, 390×844 sansJs, 1024×768 sansJs, 1280×720 sansJs, 1366×768 sansJs)_
- **textes qui se chevauchent** — `/` — div.polaroid__face.polaroid__face--dos:nth-of-type(2) > ul.polaroid__dos-liste > li:nth-of-type(4) > span:nth-of-type(2) « 9 € » — avec div.chef__table:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--mot:nth-of-type(6) > span.etiquette__texte « Produits de saison » _(320×568 sansJs)_
- **textes qui se chevauchent** — `/` — div.polaroid > div.polaroid__carte > div.polaroid__face.polaroid__face--dos:nth-of-type(2) > p.polaroid__dos-mot:nth-of-type(2) « Et les suggestions du chef, de vive voix » — avec div.chef__table:nth-of-type(1) > div.polaroid > button.polaroid__retourner > span.polaroid__retourner-texte « Retournez la photo » _(320×568 sansJs, 768×1024 sansJs)_
- **textes qui se chevauchent** — `/` — div.polaroid__face.polaroid__face--dos:nth-of-type(2) > ul.polaroid__dos-liste > li:nth-of-type(1) > span:nth-of-type(1) « Œuf cocotte à la bourguignonne » — avec div.chef__table:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--mot:nth-of-type(4) > span.etiquette__texte « Suggestions de vive voix » _(375×667 sansJs, 390×844 sansJs, 844×390 sansJs, 768×1024 sansJs, 1024×768 sansJs, 1000×560 sansJs, +6)_
- **textes qui se chevauchent** — `/` — div.polaroid > div.polaroid__carte > div.polaroid__face.polaroid__face--dos:nth-of-type(2) > p.polaroid__dos-mot:nth-of-type(2) « Et les suggestions du chef, de vive voix » — avec div.chef__table:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--mot:nth-of-type(6) > span.etiquette__texte « Produits de saison » _(375×667 sansJs, 844×390 sansJs, 768×1024 sansJs, 1024×768 sansJs, 1000×560 sansJs)_
- **textes qui se chevauchent** — `/` — div.polaroid > div.polaroid__carte > div.polaroid__face.polaroid__face--dos:nth-of-type(2) > p.polaroid__dos-mot:nth-of-type(2) « Et les suggestions du chef, de vive voix » — avec div.chef__table:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--photo:nth-of-type(5) > span.etiquette__texte « Girolles » _(844×390 sansJs, 768×1024 sansJs)_
- **textes qui se chevauchent** — `/` — div.chef__table:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--mot:nth-of-type(4) > span.etiquette__texte « Suggestions de vive voix » — avec section#chef > div.conteneur.chef__grille > div.chef__texte:nth-of-type(2) > p:nth-of-type(3) « À la tête du restaurant, Régis Clauss met en valeu » _(844×390 sansJs)_
- **textes qui se chevauchent** — `/` — div.chef__table:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--mot:nth-of-type(4) > span.etiquette__texte « Suggestions de vive voix » — avec section#chef > div.conteneur.chef__grille > div.chef__texte:nth-of-type(2) > p.chef__signature:nth-of-type(2) « Une signature culinaire entre tradition et créativ » _(1024×768 sansJs, 1000×560 sansJs)_
- **textes qui se chevauchent** — `/` — section#feu > div.feu__cadre > div.feu__tete > p.feu__sous:nth-of-type(1) « Au creux de la cheminée » — avec h2#feu-titre > span:nth-of-type(1) « Au coin » _(1024×768 sansJs, 1024×768 calme, 1280×720 sansJs, 1280×720 calme, 1366×768 sansJs, 1366×768 calme, +8)_
- **textes qui se chevauchent** — `/` — section#feu > div.feu__cadre > div.feu__tete > p.feu__sous:nth-of-type(1) « Au creux de la cheminée » — avec h2#feu-titre > span:nth-of-type(2) « du feu » _(1024×768 sansJs, 1024×768 calme, 1280×720 sansJs, 1280×720 calme, 1366×768 sansJs, 1366×768 calme, +8)_
- **textes qui se chevauchent** — `/` — h2#feu-titre > span:nth-of-type(1) « Au coin » — avec section#feu > div.feu__cadre > div.feu__tete > p.feu__legende:nth-of-type(2) « L'hiver, la salle se resserre autour de la cheminé » _(1024×768 sansJs, 1024×768 calme, 1000×560 sansJs, 1000×560 calme, 1280×720 sansJs, 1280×720 calme, +10)_
- **textes qui se chevauchent** — `/` — h2#feu-titre > span:nth-of-type(2) « du feu » — avec section#feu > div.feu__cadre > div.feu__tete > p.feu__legende:nth-of-type(2) « L'hiver, la salle se resserre autour de la cheminé » _(1024×768 sansJs, 1024×768 calme, 1000×560 sansJs, 1000×560 calme, 1280×720 sansJs, 1280×720 calme, +10)_
- **textes qui se chevauchent** — `/` — div.polaroid > div.polaroid__carte > div.polaroid__face.polaroid__face--dos:nth-of-type(2) > p.polaroid__dos-titre:nth-of-type(1) « Cette semaine, à la carte » — avec div.chef__table:nth-of-type(1) > ul.chef__etiquettes > li.etiquette.etiquette--mot:nth-of-type(4) > span.etiquette__texte « Suggestions de vive voix » _(1728×1000 sansJs, 1920×1080 sansJs, 2560×1440 sansJs)_

### élément recouvert (9)

- **élément recouvert** — `/` — div.polaroid__face.polaroid__face--dos:nth-of-type(2) > ul.polaroid__dos-liste > li:nth-of-type(1) > span:nth-of-type(2) « 14 € » — par section#chef > div.conteneur.chef__grille > div.chef__table.est-arrivee:nth-of-type(1) > ul.chef__etiquettes « Une nouvelle carte chaque semaine Cèpes Fait maiso » _(390×844 normal, 1366×768 normal, 1920×1080 normal)_
- **élément recouvert** — `/` — div.polaroid__face.polaroid__face--dos:nth-of-type(2) > ul.polaroid__dos-liste > li:nth-of-type(2) > span:nth-of-type(2) « 26 € » — par section#chef > div.conteneur.chef__grille > div.chef__table.est-arrivee:nth-of-type(1) > ul.chef__etiquettes « Une nouvelle carte chaque semaine Cèpes Fait maiso » _(390×844 normal, 768×1024 normal, 1366×768 normal, 1920×1080 normal)_
- **élément recouvert** — `/` — div.polaroid__face.polaroid__face--dos:nth-of-type(2) > ul.polaroid__dos-liste > li:nth-of-type(3) > span:nth-of-type(2) « 21 € » — par section#chef > div.conteneur.chef__grille > div.chef__table.est-arrivee:nth-of-type(1) > ul.chef__etiquettes « Une nouvelle carte chaque semaine Cèpes Fait maiso » _(390×844 normal, 768×1024 normal, 1366×768 normal, 1920×1080 normal)_
- **élément recouvert** — `/` — div.polaroid__face.polaroid__face--dos:nth-of-type(2) > ul.polaroid__dos-liste > li:nth-of-type(4) > span:nth-of-type(2) « 9 € » — par section#chef > div.conteneur.chef__grille > div.chef__table.est-arrivee:nth-of-type(1) > ul.chef__etiquettes « Une nouvelle carte chaque semaine Cèpes Fait maiso » _(390×844 normal, 768×1024 normal, 1366×768 normal, 1920×1080 normal)_
- **élément recouvert** — `/` — div.conteneur.chef__grille > div.chef__table.est-arrivee:nth-of-type(1) > div.polaroid > button.polaroid__retourner « Retournez la photo » — par section#chef > div.conteneur.chef__grille > div.chef__table.est-arrivee:nth-of-type(1) > ul.chef__etiquettes « Une nouvelle carte chaque semaine Cèpes Fait maiso » _(390×844 normal, 768×1024 normal, 1366×768 normal, 1920×1080 normal)_
- **élément recouvert** — `/` — div.conteneur > div.moment__grille.fx-fini > article.moment-carte:nth-of-type(1) > p.moment-carte__prix:nth-of-type(3) « 120 € le menu · 170 € avec l'accord mets et vins » — par div.moment__grille.fx-fini > article.moment-carte:nth-of-type(1) > h3 > a.moment-carte__lien « Saint-Sylvestre » _(390×844 normal, 768×1024 normal, 1366×768 normal, 1920×1080 normal)_
- **élément recouvert** — `/` — div.conteneur > div.moment__grille.fx-fini > article.moment-carte:nth-of-type(2) > p.moment-carte__prix:nth-of-type(3) « 79 € par personne, hors boissons » — par div.moment__grille.fx-fini > article.moment-carte:nth-of-type(2) > h3 > a.moment-carte__lien « Le menu de Noël » _(390×844 normal, 768×1024 normal, 1366×768 normal, 1920×1080 normal)_
- **élément recouvert** — `/` — div.conteneur > div.moment__grille.fx-fini > article.moment-carte:nth-of-type(3) > p.moment-carte__prix:nth-of-type(3) « De 25 à 200 € » — par div.moment__grille.fx-fini > article.moment-carte:nth-of-type(3) > h3 > a.moment-carte__lien « La carte cadeau » _(390×844 normal, 768×1024 normal, 1366×768 normal, 1920×1080 normal)_
- **élément recouvert** — `/` — div.polaroid__face.polaroid__face--dos:nth-of-type(2) > ul.polaroid__dos-liste > li:nth-of-type(1) > span:nth-of-type(2) « 14 € » — par li.etiquette.etiquette--photo:nth-of-type(2) > figure.media.etiquette__photo > picture > img _(768×1024 normal)_

### lien profond (1)

- **lien profond** — `/ → /receptions#espace-terrasse` — section cachée sous l'en-tête (58 px) _(390×844 lien profond)_

### positions non recalculées après un changement de hauteur (2)

- **positions non recalculées après un changement de hauteur** — `/` — décalage de 97 px _(1366×768)_
- **positions non recalculées après un changement de hauteur** — `/` — décalage de 96 px _(1366×768)_

### effet qui dérive sous la souris immobile (1)

- **effet qui dérive sous la souris immobile** — `/` — [data-souris] soleil — l’image change encore 1.1 % plus qu’au repos, 1,5 à 4,5 s après l’arrêt de la souris _(1366×768 souris)_

## À regarder

### grille : aucun titre ne fait l’événement (point 5) (3)

- **grille : aucun titre ne fait l’événement (point 5)** — `/` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"
- **grille : aucun titre ne fait l’événement (point 5)** — `/infos-pratiques` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"
- **grille : aucun titre ne fait l’événement (point 5)** — `/reserver` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"

### contraste sur image (1)

- **contraste sur image** — `/` — h1#heros-titre > span.heros__l1 « Les Jardins » — 2.80:1 sur les 10 % de la photo les moins favorables (minimum 3:1), ombre portée à vérifier _(390×844 normal)_

### retour avant : changement brusque (1)

- **retour avant : changement brusque** — `/la-carte` — à 58 ms (différence 32 %) (films/retour-avant-390.png) _(390×844 retour avant)_

### rechargement au milieu de la page (1)

- **rechargement au milieu de la page** — `/receptions` — écran différent à la même position après rechargement (7.8 %), voir comparaisons/rechargement-receptions-*.png _(1366×768)_

### effet qui ne bouge pas au défilement (1)

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
- Journal v7 : 12 étape(s) notée(s), 437 min de travail pour 395 min de budget, 0 min d’attente de l’utilisateur.
- Journal : « audit standard (deux passages) et corrections » 79 min pour 35 prévues.
- Journal : « test « vrai visiteur » (7 missions, deux formats) et « regard neuf » (agents séparés) » 48 min pour 30 prévues.
- Journal : « corrections d'après le visiteur et le regard neuf (assiette en vraie photo, agenda, Saint-Sylvestre, heures, typographie, ancres) » 45 min pour 30 prévues.
- Journal : « audit complet, corrections et contre-audit ciblé » 64 min pour 30 prévues.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Ouverture / (1366×768) : 2727 ms depuis le premier octet
- Ouverture /receptions (1366×768) : 2495 ms depuis le premier octet
- film de l'ouverture /receptions 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture / (390×844) : 2549 ms depuis le premier octet
- Ouverture /receptions (390×844) : 2478 ms depuis le premier octet
- Bords de l’écran : 171 images d’intro, 6 de voile et 76 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Tient dans l'écran /receptions : aucune section épinglée ou plein écran.
- Fluidité / 1366×768 (molette) : 1 % d'images lentes sur 378, tâche la plus longue 80 ms
- Fluidité /receptions 1366×768 (molette) : 1 % d'images lentes sur 271, tâche la plus longue 68 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1434, tâche la plus longue 0 ms
- Fluidité /receptions 390×844 (doigt) : 0 % d'images lentes sur 1341, tâche la plus longue 0 ms
- Vitesse / : 0.70 s de calcul au chargement (téléphone ralenti).
- Vitesse /receptions : 0.36 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --complet --seulement=fichiers,grille,mesures,parcours,mouvement
```
