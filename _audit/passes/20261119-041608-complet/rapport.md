# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 19/11/2026 06:07:51 · 52 min · 10 page(s) · audit complet

## Résumé

- Statut : **1 échec(s)**
- Passe : `20261119-041608-complet` · version ?v=7
- Échecs : **1**
- À regarder : **18**
- Non lancé : **1**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (6), mesures (390), balayage (9), films d’ouverture (18), films de transition (18), bords de l’écran (10), intro accélérable et passable (7), menu (1), clavier (10), liens et boutons (10), liens profonds (16), liens vers la page en cours (9), changements de hauteur (7), espace : réserver puis confirmer (1), espace : barre « Que voulez-vous faire ? » (2), espace : tout arrive ici (1), espace : la carte en main (1), espace : suggestions, bilan, écran d’accueil (1), espace : service (1), espace : plan de salle et fiche client (1), cohérence : mêmes règles pour le site et l’équipe (1), stabilisation v7.8.1 (1), espace : mesures (5), espace : balayage (1), parcours du projet (1), tient dans l’écran (8), fluidité (18), défilement selon l’appareil (5), mouvement (18), effets du plan (37), souris immobile (3), vitesse (9), captures (1)

## Grille wouahou

| Point | État | Détail |
|---|---|---|
| 1. L’effet signature se manipule | ✓ présent | accueil et 2 autre(s) page(s) |
| 2. L’intro devient la page | ✓ présent | objet d’ouverture sur 8 page(s), versObjet dans l’intro |
| 3. La transition reprend le motif | ✓ présent | voile en cloche |
| 4. Quelque chose relie les sections et les pages | ✓ présent | sur les 8 page(s) |
| 5. Un titre fait l’événement sur chaque page | ⚠ à regarder | présent sur /la-carte, /offrir, /receptions ; absent sur /a-emporter, /, /infos-pratiques, /les-fetes, /reserver |
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
| 20261112-153451-complet | complet | toutes | toutes | 18 | 13 | 26 | échecs |
| 20261112-155520-complet | complet | toutes | toutes | 35 | 7 | 71 | échecs |
| 20261112-160545-complet | complet | toutes | toutes | 73 | 24 | 1 | échecs |
| 20261112-164240-complet-partiel | complet | toutes | fichiers, mesures, films, parcours, ecran | 2 | 16 | 0 | échecs |
| 20261112-174546-complet-cible-partiel | complet | /receptions | fichiers, mesures, ecran, mouvement | 0 | 2 | 0 | complet |
| 20261112-174741-complet-cible-partiel | complet | /receptions | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261112-175857-complet-cible-partiel | complet | /receptions | fichiers, mesures, ecran, mouvement | 0 | 1 | 0 | complet |
| 20261112-181019-complet-partiel | complet | toutes | fichiers, mesures, ecran | 66 | 1 | 0 | échecs |
| 20261112-181917-complet-cible-partiel | complet | /receptions,/a-emporter,/la-carte | fichiers, mesures, ecran, mouvement | 1 | 3 | 0 | échecs |
| 20261112-182327-complet-cible-partiel | complet | /,/a-emporter | fichiers, mesures, ecran, mouvement | 4 | 0 | 0 | échecs |
| 20261112-182807-complet-cible-partiel | complet | /,/receptions | fichiers, mesures, ecran, mouvement | 1 | 2 | 0 | échecs |
| 20261112-183220-complet-cible-partiel | complet | /receptions | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261112-185751-complet-cible-partiel | complet | / | fichiers, mesures, ecran, mouvement | 8 | 0 | 0 | échecs |
| 20261112-190040-complet-cible-partiel | complet | / | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261112-194221-complet-cible-partiel | complet | / | fichiers, mesures, ecran, mouvement | 0 | 0 | 0 | complet |
| 20261113-125411-complet-cible-partiel | complet | /receptions,/infos-pratiques,/a-emporter | fichiers, mesures, ecran, mouvement | 3 | 2 | 0 | échecs |
| 20261113-125814-complet-cible-partiel | complet | /,/receptions | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261113-130027-complet-cible-partiel | complet | /receptions | fichiers, ecran, mouvement | 0 | 1 | 0 | complet |
| 20261113-132429-complet-cible-partiel | complet | /,/les-fetes,/a-emporter | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261113-140256-complet-partiel | complet | toutes | fichiers, mesures | 2 | 0 | 0 | échecs |
| 20261113-141152-complet-cible-partiel | complet | / | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261113-142428-complet-cible-partiel | complet | /a-emporter | fichiers, mesures, ecran, mouvement | 0 | 0 | 0 | complet |
| 20261113-143339-complet-cible-partiel | complet | /a-emporter | fichiers, mesures, ecran, mouvement | 1 | 0 | 0 | échecs |
| 20261113-143459-complet-cible-partiel | complet | /,/a-emporter | fichiers, mesures, ecran, mouvement | 0 | 0 | 0 | complet |
| 20261113-144446-complet-cible-partiel | complet | /a-emporter,/infos-pratiques | fichiers, mesures, ecran, mouvement | 25 | 1 | 0 | échecs |
| 20261113-144741-complet-cible-partiel | complet | /,/a-emporter | fichiers, mesures, mouvement | 1 | 1 | 0 | échecs |
| 20261113-145105-complet-cible-partiel | complet | /a-emporter | fichiers, mouvement | 0 | 0 | 0 | complet |
| 20261113-145126-complet-cible-partiel | complet | /les-fetes,/infos-pratiques | fichiers, mesures, ecran, mouvement | 0 | 1 | 0 | complet |
| 20261113-145835-complet-cible-partiel | complet | /les-fetes | fichiers, mesures, ecran, mouvement | 2 | 0 | 0 | échecs |
| 20261113-150013-complet-cible-partiel | complet | /,/les-fetes | fichiers, mesures | 2 | 0 | 0 | échecs |
| 20261113-150330-complet-cible-partiel | complet | / | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261113-150902-complet-partiel | complet | toutes | fichiers, mesures, ecran, mouvement | 0 | 3 | 0 | complet |
| 20261113-155441-complet | complet | toutes | toutes | 5 | 34 | 1 | échecs |
| 20261113-163915-complet | complet | toutes | toutes | 6 | 42 | 1 | échecs |
| 20261113-171418-complet-cible-partiel | complet | /,/la-carte,/offrir,/les-fetes | fichiers, mesures, parcours | 21 | 3 | 0 | échecs |
| 20261113-172355-complet-cible-partiel | complet | /,/la-carte,/offrir,/les-fetes | fichiers, mesures, parcours | 0 | 3 | 0 | complet |
| 20261113-174741-complet-cible-partiel | complet | / | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261116-211215-complet-cible-partiel | complet | /receptions | fichiers, mesures, ecran, mouvement, parcours, fluidite | 17 | 1 | 0 | échecs |
| 20261116-211809-complet-cible-partiel | complet | /receptions | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261116-213806-complet-cible-partiel | complet | /receptions | fichiers, mesures, ecran, mouvement, parcours, fluidite | 0 | 1 | 0 | complet |
| 20261116-220603-complet-cible-partiel | complet | /les-fetes | fichiers, mesures, ecran, mouvement, parcours, fluidite | 13 | 2 | 0 | échecs |
| 20261116-221119-complet-cible-partiel | complet | /les-fetes | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261116-222520-complet-cible-partiel | complet | /les-fetes | fichiers, mesures, mouvement | 1 | 0 | 0 | échecs |
| 20261116-222642-complet-cible-partiel | complet | /les-fetes | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261116-223849-complet-cible-partiel | complet | /les-fetes | fichiers, mesures, ecran, mouvement, parcours, fluidite | 0 | 2 | 0 | complet |
| 20261116-230730-complet-cible-partiel | complet | /offrir | fichiers, mesures, ecran, mouvement, parcours, fluidite | 3 | 0 | 0 | échecs |
| 20261116-231105-complet-cible-partiel | complet | /offrir | fichiers, mesures | 1 | 0 | 0 | échecs |
| 20261116-231152-complet-cible-partiel | complet | /offrir | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261116-231329-complet-cible-partiel | complet | /,/les-fetes,/offrir | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261116-232750-complet-cible-partiel | complet | /la-carte,/offrir | fichiers, mesures, ecran, mouvement, parcours, fluidite | 5 | 2 | 0 | échecs |
| 20261116-233440-complet-cible-partiel | complet | /la-carte | fichiers, mesures, mouvement | 0 | 0 | 0 | complet |
| 20261116-233550-complet-cible-partiel | complet | /la-carte,/offrir | ecran, parcours, fluidite | 0 | 1 | 0 | complet |
| 20261116-234054-complet-cible-partiel | complet | /la-carte | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261116-235631-complet-cible-partiel | complet | /la-carte | fichiers, mesures, mouvement | 0 | 0 | 0 | complet |
| 20261117-003653-complet | complet | toutes | toutes | 1 | 27 | 7 | échecs |
| 20261117-011258-complet-partiel | complet | toutes | fichiers, mesures, films, mouvement, vitesse, captures | 0 | 4 | 0 | complet |
| 20261117-013107-complet-cible-partiel | complet | / | fichiers, films | 0 | 0 | 0 | complet |
| 20261117-191328-complet | complet | toutes | toutes | 1 | 20 | 1 | échecs |
| 20261117-195317-complet-cible-partiel | complet | /,/404,/la-carte,/receptions,/offrir,/les-fetes,/a-emporter,/infos-pratiques,/reserver | fichiers, mesures, films, mouvement | 0 | 2 | 1 | INCOMPLET |
| 20261117-200655-complet-cible-partiel | complet | /offrir | fichiers, films | 0 | 0 | 0 | complet |
| 20261117-200744-complet-cible-partiel | complet | /les-fetes,/receptions | fichiers, fluidite | 0 | 2 | 0 | complet |
| 20261117-201136-complet-cible-partiel | complet | /les-fetes,/receptions | fichiers, mouvement, fluidite | 0 | 1 | 0 | complet |
| 20261117-203829-complet | complet | toutes | toutes | 25 | 17 | 1 | échecs |
| 20261117-212657-complet-cible-partiel | complet | /,/a-emporter,/infos-pratiques,/les-fetes,/receptions | fichiers, mesures | 11 | 0 | 0 | échecs |
| 20261117-213426-complet-cible-partiel | complet | /,/a-emporter,/infos-pratiques,/les-fetes,/receptions | fichiers, mesures | 1 | 0 | 0 | échecs |
| 20261117-214049-complet-cible-partiel | complet | /,/infos-pratiques | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261117-214329-complet-cible-partiel | complet | /,/a-emporter,/infos-pratiques,/les-fetes,/receptions | fichiers, mouvement, parcours, ecran | 0 | 5 | 0 | complet |
| 20261118-094136-complet-cible-partiel | complet | / | fichiers, mesures, mouvement, ecran | 1 | 1 | 0 | échecs |
| 20261118-094456-complet-cible-partiel | complet | / | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261118-095509-complet-cible-partiel | complet | / | fichiers, mesures | 25 | 0 | 0 | échecs |
| 20261118-095658-complet-cible-partiel | complet | / | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261118-100823-complet-cible-partiel | complet | / | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261118-101243-complet-cible-partiel | complet | / | fichiers, mesures, mouvement | 23 | 21 | 0 | échecs |
| 20261118-101542-complet-cible-partiel | complet | / | fichiers, mesures, mouvement | 1 | 21 | 0 | échecs |
| 20261118-101831-complet-cible-partiel | complet | / | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261118-103829-complet-cible | complet | /reserver | toutes | 21 | 11 | 1 | échecs |
| 20261118-104440-complet-cible-partiel | complet | /,/reserver | fichiers, mesures, parcours | 0 | 1 | 0 | complet |
| 20261118-105115-complet-cible-partiel | complet | /reserver | fichiers, mesures, parcours | 1 | 1 | 0 | échecs |
| 20261118-105429-complet-cible-partiel | complet | /,/reserver | fichiers, mesures, parcours | 1 | 1 | 0 | échecs |
| 20261118-110021-complet-cible-partiel | complet | / | fichiers, mesures | 1 | 0 | 0 | échecs |
| 20261118-143909-complet-cible-partiel | complet | /espace,/,/reserver,/les-fetes,/la-carte,/offrir,/infos-pratiques | fichiers, mesures, parcours | 1 | 8 | 0 | échecs |
| 20261118-145343-complet-cible-partiel | complet | /,/espace | fichiers, mesures | 2 | 0 | 0 | échecs |
| 20261118-145637-complet-cible-partiel | complet | /espace | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261118-152736-complet-cible-partiel | complet | /espace | parcours | 19 | 3 | 0 | échecs |
| 20261118-153534-complet-cible-partiel | complet | /espace | parcours | 0 | 0 | 0 | complet |
| 20261118-154029-complet-cible | complet | /espace | toutes | 0 | 6 | 1 | complet |
| 20261118-160628-complet-cible-partiel | complet | /espace | parcours | 0 | 2 | 0 | complet |
| 20261118-161244-complet-cible | complet | /espace | toutes | 0 | 7 | 1 | complet |
| 20261118-164648-complet-cible-partiel | complet | /espace | parcours | 0 | 0 | 1 | INCOMPLET |
| 20261118-164935-complet-cible-partiel | complet | /espace | parcours | 0 | 5 | 0 | complet |
| 20261118-165744-complet-cible | complet | /espace | toutes | 0 | 8 | 1 | complet |
| 20261118-172118-complet-cible-partiel | complet | /espace | parcours | 0 | 4 | 0 | complet |
| 20261118-173045-complet-cible | complet | /espace | toutes | 0 | 6 | 1 | complet |
| 20261118-174933-complet-cible-partiel | complet | /espace | fichiers, parcours | 0 | 6 | 0 | complet |
| 20261118-180329-complet-cible | complet | /espace | toutes | 0 | 5 | 1 | complet |
| 20261118-182237-complet-cible-partiel | complet | /espace | parcours | 0 | 0 | 0 | complet |
| 20261118-183523-complet-cible | complet | /espace | toutes | 1 | 7 | 1 | échecs |
| 20261118-185249-complet-cible-partiel | complet | /,/espace | fichiers, fluidite | 0 | 1 | 0 | complet |
| 20261118-190011-complet-cible-partiel | complet | /espace | parcours | 1 | 4 | 0 | échecs |
| 20261118-191449-complet-cible | complet | /espace | toutes | 0 | 7 | 1 | complet |
| 20261118-200451-complet-cible-partiel | complet | /espace | parcours | 0 | 0 | 0 | complet |
| 20261118-202124-complet | complet | toutes | toutes | 0 | 22 | 1 | complet |
| 20261119-025710-complet-cible-partiel | complet | /espace | parcours | 0 | 0 | 1 | INCOMPLET |
| 20261119-030455-complet | complet | toutes | toutes | 0 | 17 | 3 | INCOMPLET |
| 20261119-034425-complet-partiel | complet | toutes | fichiers, films, parcours | 0 | 6 | 0 | complet |
| **20261119-041608-complet** (celle-ci) | complet | toutes | toutes | 1 | 18 | 1 | échecs |

## Échecs

### contraste sur image (1)

- **contraste sur image** — `/a-emporter` — div.conteneur.ouv-traiteur__grille > div.ouv-traiteur__scene:nth-of-type(2) > p.ronde__legende:nth-of-type(1) > span.ronde__prix:nth-of-type(3) « 32 € » — 2.35:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1) _(390×844 normal)_

## À regarder

### grille : aucun titre ne fait l’événement (point 5) (5)

- **grille : aucun titre ne fait l’événement (point 5)** — `/a-emporter` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"
- **grille : aucun titre ne fait l’événement (point 5)** — `/` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"
- **grille : aucun titre ne fait l’événement (point 5)** — `/infos-pratiques` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"
- **grille : aucun titre ne fait l’événement (point 5)** — `/les-fetes` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"
- **grille : aucun titre ne fait l’événement (point 5)** — `/reserver` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"

### grille : objet d’ouverture hors du premier écran (3)

- **grille : objet d’ouverture hors du premier écran** — `/la-carte` — 335 × 40 px visibles : l’intro et le voile s’ouvrent depuis le centre de l’écran à cette taille _(390×844)_
- **grille : objet d’ouverture hors du premier écran** — `/les-fetes` — 358 × 40 px visibles : l’intro et le voile s’ouvrent depuis le centre de l’écran à cette taille _(390×844)_
- **grille : objet d’ouverture hors du premier écran** — `/reserver` — 358 × 52 px visibles : l’intro et le voile s’ouvrent depuis le centre de l’écran à cette taille _(390×844)_

### bouton sans effet visible (2)

- **bouton sans effet visible** — `/les-fetes` — IPour commencer _(1366×768)_
- **bouton sans effet visible** — `/les-fetes` — IIEntrée _(1366×768)_

### rechargement au milieu de la page (4)

- **rechargement au milieu de la page** — `/infos-pratiques` — écran différent à la même position après rechargement (9.1 %), voir comparaisons/rechargement-infos-pratiques-*.png _(1366×768)_
- **rechargement au milieu de la page** — `/la-carte` — écran différent à la même position après rechargement (51.5 %), voir comparaisons/rechargement-la-carte-*.png _(1366×768)_
- **rechargement au milieu de la page** — `/les-fetes` — écran différent à la même position après rechargement (8.6 %), voir comparaisons/rechargement-les-fetes-*.png _(1366×768)_
- **rechargement au milieu de la page** — `/reserver` — écran différent à la même position après rechargement (8.6 %), voir comparaisons/rechargement-reserver-*.png _(1366×768)_

### fluidité (1)

- **fluidité** — `/` — 3 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

### effet qui ne bouge pas au défilement (3)

- **effet qui ne bouge pas au défilement** — `/infos-pratiques` — div.plan-domaine__carte — plan-domaine : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/receptions` — div.invitation — invitation : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/` — button.bouton — carton : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(390×844 normal)_

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
- Journal v7 : 13 étape(s) notée(s), 532 min de travail pour 515 min de budget, 0 min d’attente de l’utilisateur.
- Journal : « audit standard (deux passages) et corrections » 79 min pour 35 prévues.
- Journal : « test « vrai visiteur » (7 missions, deux formats) et « regard neuf » (agents séparés) » 48 min pour 30 prévues.
- Journal : « corrections d'après le visiteur et le regard neuf (assiette en vraie photo, agenda, Saint-Sylvestre, heures, typographie, ancres) » 45 min pour 30 prévues.
- Journal : « audit complet, corrections et contre-audit ciblé » 64 min pour 30 prévues.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Ouverture / (1366×768) : 2533 ms depuis le premier octet
- Ouverture /a-emporter (1366×768) : 2408 ms depuis le premier octet
- Ouverture /espace (1366×768) : 2359 ms depuis le premier octet
- Ouverture /infos-pratiques (1366×768) : 2410 ms depuis le premier octet
- film de l'ouverture /infos-pratiques 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /la-carte (1366×768) : 2367 ms depuis le premier octet
- Ouverture /les-fetes (1366×768) : 2498 ms depuis le premier octet
- Ouverture /offrir (1366×768) : 2410 ms depuis le premier octet
- Ouverture /receptions (1366×768) : 2478 ms depuis le premier octet
- Ouverture /reserver (1366×768) : 2405 ms depuis le premier octet
- Ouverture / (390×844) : 2520 ms depuis le premier octet
- Ouverture /a-emporter (390×844) : 2458 ms depuis le premier octet
- Ouverture /espace (390×844) : 2350 ms depuis le premier octet
- Ouverture /infos-pratiques (390×844) : 2431 ms depuis le premier octet
- film de l'ouverture /infos-pratiques 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /la-carte (390×844) : 2359 ms depuis le premier octet
- film de l'ouverture /la-carte 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /les-fetes (390×844) : 2428 ms depuis le premier octet
- Ouverture /offrir (390×844) : 2416 ms depuis le premier octet
- film de l'ouverture /offrir 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /receptions (390×844) : 2475 ms depuis le premier octet
- Ouverture /reserver (390×844) : 2392 ms depuis le premier octet
- Bords de l’écran : 745 images d’intro, 23 de voile et 289 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Changements de hauteur /a-emporter : aucun effet ScrollTrigger, rien à recalculer.
- Changements de hauteur /espace : aucun effet ScrollTrigger, rien à recalculer.
- Mode calme retiré de la maquette (config.sansModeCalme) : étape sans objet.
- Tient dans l'écran /a-emporter : aucune section épinglée ou plein écran.
- Tient dans l'écran /espace : aucune section épinglée ou plein écran.
- Tient dans l'écran /infos-pratiques : aucune section épinglée ou plein écran.
- Tient dans l'écran /la-carte : aucune section épinglée ou plein écran.
- Tient dans l'écran /les-fetes : aucune section épinglée ou plein écran.
- Tient dans l'écran /offrir : aucune section épinglée ou plein écran.
- Tient dans l'écran /receptions : aucune section épinglée ou plein écran.
- Tient dans l'écran /reserver : aucune section épinglée ou plein écran.
- Fluidité /a-emporter 1366×768 (molette) : 0 % d'images lentes sur 233, tâche la plus longue 54 ms
- Fluidité /espace 1366×768 (molette) : 0 % d'images lentes sur 173, tâche la plus longue 0 ms
- Fluidité /infos-pratiques 1366×768 (molette) : 0 % d'images lentes sur 273, tâche la plus longue 0 ms
- Fluidité /la-carte 1366×768 (molette) : 1 % d'images lentes sur 332, tâche la plus longue 0 ms
- Fluidité /les-fetes 1366×768 (molette) : 0 % d'images lentes sur 493, tâche la plus longue 52 ms
- Fluidité /offrir 1366×768 (molette) : 1 % d'images lentes sur 225, tâche la plus longue 0 ms
- Fluidité /receptions 1366×768 (molette) : 1 % d'images lentes sur 553, tâche la plus longue 0 ms
- Fluidité /reserver 1366×768 (molette) : 0 % d'images lentes sur 215, tâche la plus longue 0 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1429, tâche la plus longue 0 ms
- Fluidité /a-emporter 390×844 (doigt) : 0 % d'images lentes sur 1424, tâche la plus longue 0 ms
- Fluidité /espace 390×844 (doigt) : 0 % d'images lentes sur 1336, tâche la plus longue 0 ms
- Fluidité /infos-pratiques 390×844 (doigt) : 0 % d'images lentes sur 1416, tâche la plus longue 0 ms
- Fluidité /la-carte 390×844 (doigt) : 0 % d'images lentes sur 1345, tâche la plus longue 0 ms
- Fluidité /les-fetes 390×844 (doigt) : 0 % d'images lentes sur 1421, tâche la plus longue 0 ms
- Fluidité /offrir 390×844 (doigt) : 0 % d'images lentes sur 1397, tâche la plus longue 0 ms
- Fluidité /receptions 390×844 (doigt) : 0 % d'images lentes sur 1347, tâche la plus longue 0 ms
- Fluidité /reserver 390×844 (doigt) : 0 % d'images lentes sur 1334, tâche la plus longue 0 ms
- Vitesse / : 0.57 s de calcul au chargement (téléphone ralenti).
- Vitesse /a-emporter : 0.40 s de calcul au chargement (téléphone ralenti).
- Vitesse /espace : 0.22 s de calcul au chargement (téléphone ralenti).
- Vitesse /infos-pratiques : 0.28 s de calcul au chargement (téléphone ralenti).
- Vitesse /la-carte : 0.36 s de calcul au chargement (téléphone ralenti).
- Vitesse /les-fetes : 0.52 s de calcul au chargement (téléphone ralenti).
- Vitesse /offrir : 0.31 s de calcul au chargement (téléphone ralenti).
- Vitesse /receptions : 0.43 s de calcul au chargement (téléphone ralenti).
- Vitesse /reserver : 0.28 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --complet --pages=/,/a-emporter --seulement=fichiers,mesures
```
