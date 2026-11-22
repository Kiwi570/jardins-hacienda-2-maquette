# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 22/11/2026 18:04:10 · 72 min · 12 page(s) · audit complet

## Résumé

- Statut : **2 échec(s)**
- Passe : `20261122-155236-complet` · version ?v=7
- Échecs : **2**
- À regarder : **21**
- Non lancé : **2**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (6), mesures (468), balayage (11), films d’ouverture (22), films de transition (22), bords de l’écran (12), intro accélérable et passable (7), menu (1), clavier (12), liens et boutons (12), liens profonds (16), liens vers la page en cours (11), changements de hauteur (7), espace : réserver puis confirmer (1), espace : barre « Que voulez-vous faire ? » (2), espace : tout arrive ici (1), espace : la carte en main (1), espace : suggestions, bilan, écran d’accueil (1), espace : service (1), espace : plan de salle et fiche client (1), cohérence : mêmes règles pour le site et l’équipe (1), stabilisation v7.8.1 (1), toute la maison v7.10.0 (1366×768) (1), toute la maison v7.10.0 (390×844) (1), espace : un service parfaitement accompagné (1366×768) (1), espace : un service parfaitement accompagné (390×844) (1), espace : démonstrations (1366×768) (1), espace : démonstrations (390×844) (1), espace : réceptions (1366×768) (1), espace : réceptions (390×844) (1), espace : réserver et réceptions (390×844) (1), espace : mesures (5), tient dans l’écran (8), espace : balayage (1), parcours du projet (1), fluidité (22), défilement selon l’appareil (5), mouvement (22), effets du plan (37), souris immobile (3), vitesse (11), captures (1)

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
| 20261119-041608-complet | complet | toutes | toutes | 1 | 18 | 1 | échecs |
| 20261119-051222-complet-cible-partiel | complet | /,/a-emporter | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261120-170845-complet | complet | toutes | toutes | 1 | 37 | 1 | échecs |
| 20261120-180634-complet-cible-partiel | complet | /a-emporter | fichiers, mesures | 0 | 0 | 0 | complet |
| 20261120-180808-complet-cible | complet | /espace | toutes | 0 | 7 | 1 | complet |
| 20261120-194323-standard-cible | standard | /espace | toutes | 2 | 6 | 1 | échecs |
| 20261120-195320-standard-cible-partiel | standard | /espace | parcours | 2 | 0 | 0 | échecs |
| 20261120-202024-complet | complet | toutes | toutes | 4 | 21 | 2 | échecs |
| 20261120-212726-complet-partiel | complet | toutes | fichiers, mesures, films, parcours | 3 | 6 | 0 | échecs |
| 20261120-221320-complet-cible-partiel | complet | /,/votre-venue,/espace | fichiers, mesures, parcours | 0 | 0 | 0 | complet |
| 20261121-001212-complet | complet | toutes | toutes | 0 | 19 | 3 | INCOMPLET |
| 20261121-013335-complet-partiel | complet | toutes | fichiers, bords, parcours | 11 | 6 | 1 | échecs |
| 20261121-020646-complet-partiel | complet | toutes | fichiers, parcours | 0 | 6 | 0 | complet |
| 20261121-183049-complet-cible | complet | /votre-reception,/votre-venue | toutes | 0 | 5 | 7 | INCOMPLET |
| 20261121-184813-complet | complet | toutes | toutes | 0 | 19 | 1 | complet |
| **20261122-155236-complet** (celle-ci) | complet | toutes | toutes | 2 | 21 | 2 | échecs |

## Échecs

### maison (1366×768) : priorités (1)

- **maison (1366×768) : priorités** — `/espace` — 5 réservations à placer, et aucune priorité ne le dit _(1366×768)_

### maison (390×844) : priorités (1)

- **maison (390×844) : priorités** — `/espace` — 5 réservations à placer, et aucune priorité ne le dit _(390×844)_

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

- **rechargement au milieu de la page** — `/infos-pratiques` — écran différent à la même position après rechargement (10.0 %), voir comparaisons/rechargement-infos-pratiques-*.png _(1366×768)_
- **rechargement au milieu de la page** — `/la-carte` — écran différent à la même position après rechargement (46.2 %), voir comparaisons/rechargement-la-carte-*.png _(1366×768)_
- **rechargement au milieu de la page** — `/les-fetes` — écran différent à la même position après rechargement (8.7 %), voir comparaisons/rechargement-les-fetes-*.png _(1366×768)_
- **rechargement au milieu de la page** — `/reserver` — écran différent à la même position après rechargement (56.0 %), voir comparaisons/rechargement-reserver-*.png _(1366×768)_

### fluidité (4)

- **fluidité** — `/` — 9 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_
- **fluidité** — `/la-carte` — 3 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_
- **fluidité** — `/les-fetes` — 8 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_
- **fluidité** — `/receptions` — 7 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

### effet qui ne bouge pas au défilement (3)

- **effet qui ne bouge pas au défilement** — `/infos-pratiques` — div.plan-domaine__carte — plan-domaine : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/receptions` — div.invitation — invitation : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/` — button.bouton — carton : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(390×844 normal)_

## Non lancé

- **parcours:projet** : parcours:projet : plus de 1500 s
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
- Ouverture / (1366×768) : 2588 ms depuis le premier octet
- Ouverture /a-emporter (1366×768) : 2453 ms depuis le premier octet
- Ouverture /espace (1366×768) : 2390 ms depuis le premier octet
- Ouverture /infos-pratiques (1366×768) : 2539 ms depuis le premier octet
- Ouverture /la-carte (1366×768) : 2526 ms depuis le premier octet
- Ouverture /les-fetes (1366×768) : 2619 ms depuis le premier octet
- Ouverture /offrir (1366×768) : 2520 ms depuis le premier octet
- Ouverture /receptions (1366×768) : 2503 ms depuis le premier octet
- Ouverture /reserver (1366×768) : 2469 ms depuis le premier octet
- Ouverture /votre-reception (1366×768) : 2433 ms depuis le premier octet
- Ouverture /votre-venue (1366×768) : 2438 ms depuis le premier octet
- Ouverture / (390×844) : 2523 ms depuis le premier octet
- Ouverture /a-emporter (390×844) : 2430 ms depuis le premier octet
- film de l'ouverture /a-emporter 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /espace (390×844) : 2442 ms depuis le premier octet
- Ouverture /infos-pratiques (390×844) : 2495 ms depuis le premier octet
- Ouverture /la-carte (390×844) : 2407 ms depuis le premier octet
- Ouverture /les-fetes (390×844) : 2521 ms depuis le premier octet
- Ouverture /offrir (390×844) : 2506 ms depuis le premier octet
- Ouverture /receptions (390×844) : 2520 ms depuis le premier octet
- Ouverture /reserver (390×844) : 2459 ms depuis le premier octet
- Ouverture /votre-reception (390×844) : 2424 ms depuis le premier octet
- Ouverture /votre-venue (390×844) : 2393 ms depuis le premier octet
- film de l'ouverture /votre-venue 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- bords de l’écran /receptions 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Bords de l’écran : 738 images d’intro, 28 de voile et 343 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Changements de hauteur /a-emporter : aucun effet ScrollTrigger, rien à recalculer.
- Changements de hauteur /espace : aucun effet ScrollTrigger, rien à recalculer.
- Changements de hauteur /votre-reception : aucun effet ScrollTrigger, rien à recalculer.
- Changements de hauteur /votre-venue : aucun effet ScrollTrigger, rien à recalculer.
- Mode calme retiré de la maquette (config.sansModeCalme) : étape sans objet.
- Tient dans l'écran /a-emporter : aucune section épinglée ou plein écran.
- Tient dans l'écran /espace : aucune section épinglée ou plein écran.
- Tient dans l'écran /infos-pratiques : aucune section épinglée ou plein écran.
- Tient dans l'écran /la-carte : aucune section épinglée ou plein écran.
- Tient dans l'écran /les-fetes : aucune section épinglée ou plein écran.
- Tient dans l'écran /offrir : aucune section épinglée ou plein écran.
- Tient dans l'écran /receptions : aucune section épinglée ou plein écran.
- Tient dans l'écran /reserver : aucune section épinglée ou plein écran.
- Tient dans l'écran /votre-reception : aucune section épinglée ou plein écran.
- Tient dans l'écran /votre-venue : aucune section épinglée ou plein écran.
- Fluidité /a-emporter 1366×768 (molette) : 2 % d'images lentes sur 212, tâche la plus longue 84 ms
- Fluidité /espace 1366×768 (molette) : 1 % d'images lentes sur 170, tâche la plus longue 0 ms
- Fluidité /infos-pratiques 1366×768 (molette) : 0 % d'images lentes sur 281, tâche la plus longue 64 ms
- Fluidité /offrir 1366×768 (molette) : 2 % d'images lentes sur 225, tâche la plus longue 0 ms
- Fluidité /reserver 1366×768 (molette) : 2 % d'images lentes sur 223, tâche la plus longue 66 ms
- Fluidité /votre-reception 1366×768 (molette) : 1 % d'images lentes sur 176, tâche la plus longue 0 ms
- Fluidité /votre-venue 1366×768 (molette) : 0 % d'images lentes sur 172, tâche la plus longue 0 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1436, tâche la plus longue 0 ms
- Fluidité /a-emporter 390×844 (doigt) : 0 % d'images lentes sur 1441, tâche la plus longue 0 ms
- Fluidité /espace 390×844 (doigt) : 0 % d'images lentes sur 1348, tâche la plus longue 0 ms
- Fluidité /infos-pratiques 390×844 (doigt) : 0 % d'images lentes sur 1439, tâche la plus longue 0 ms
- Fluidité /la-carte 390×844 (doigt) : 0 % d'images lentes sur 1359, tâche la plus longue 0 ms
- Fluidité /les-fetes 390×844 (doigt) : 0 % d'images lentes sur 1347, tâche la plus longue 64 ms
- Fluidité /offrir 390×844 (doigt) : 0 % d'images lentes sur 1433, tâche la plus longue 0 ms
- Fluidité /receptions 390×844 (doigt) : 0 % d'images lentes sur 1373, tâche la plus longue 0 ms
- Fluidité /reserver 390×844 (doigt) : 0 % d'images lentes sur 1346, tâche la plus longue 0 ms
- Fluidité /votre-reception 390×844 (doigt) : 0 % d'images lentes sur 1349, tâche la plus longue 0 ms
- Fluidité /votre-venue 390×844 (doigt) : 0 % d'images lentes sur 1357, tâche la plus longue 0 ms
- Vitesse / : 0.92 s de calcul au chargement (téléphone ralenti).
- Vitesse /a-emporter : 0.73 s de calcul au chargement (téléphone ralenti).
- Vitesse /espace : 0.33 s de calcul au chargement (téléphone ralenti).
- Vitesse /infos-pratiques : 0.52 s de calcul au chargement (téléphone ralenti).
- Vitesse /la-carte : 0.71 s de calcul au chargement (téléphone ralenti).
- Vitesse /les-fetes : 0.71 s de calcul au chargement (téléphone ralenti).
- Vitesse /offrir : 0.61 s de calcul au chargement (téléphone ralenti).
- Vitesse /receptions : 0.93 s de calcul au chargement (téléphone ralenti).
- Vitesse /reserver : 0.48 s de calcul au chargement (téléphone ralenti).
- Vitesse /votre-reception : 0.44 s de calcul au chargement (téléphone ralenti).
- Vitesse /votre-venue : 0.34 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --complet --seulement=fichiers,parcours
```
