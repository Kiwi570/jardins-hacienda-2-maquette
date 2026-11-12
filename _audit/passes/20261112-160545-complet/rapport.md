# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 12/11/2026 17:35:32 · 30 min · 8 page(s) · audit complet

## Résumé

- Statut : **73 échec(s)**
- Passe : `20261112-160545-complet` · version ?v=7
- Échecs : **73**
- À regarder : **24**
- Non lancé : **1**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (6), mesures (256), balayage (7), films d’ouverture (14), films de transition (14), bords de l’écran (8), intro accélérable et passable (7), menu (1), clavier (8), liens et boutons (8), liens profonds (16), liens vers la page en cours (7), changements de hauteur (7), mode calme (14), bouton du mode calme (2), parcours du projet (1), tient dans l’écran (8), fluidité (14), défilement selon l’appareil (5), mouvement (14), effets du plan (23), souris immobile (4), vitesse (7), captures (1)

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
| 20261112-153451-complet | complet | toutes | toutes | 18 | 13 | 26 | échecs |
| 20261112-155520-complet | complet | toutes | toutes | 35 | 7 | 71 | échecs |
| **20261112-160545-complet** (celle-ci) | complet | toutes | toutes | 73 | 24 | 1 | échecs |

## Échecs

### lien vers le site actuel (1)

- **lien vers le site actuel** — `index.html` — https://www.lesjardinsdelhacienda54.com/online-ordering

### texte sous 12 px (10)

- **texte sous 12 px** — `/` — div.conteneur.venir__grille > div.venir__plan.est-vu:nth-of-type(2) > svg.venir__carte > text.venir__pays:nth-of-type(1) — 9.0 px _(1024×768 normal, 1366×768 normal, 1000×560 normal, 1280×720 normal, 1440×900 normal, 1920×1080 normal, +18)_
- **texte sous 12 px** — `/` — div.conteneur.venir__grille > div.venir__plan.est-vu:nth-of-type(2) > svg.venir__carte > text.venir__pays:nth-of-type(2) — 9.0 px _(1024×768 normal, 1366×768 normal, 1000×560 normal, 1280×720 normal, 1440×900 normal, 1920×1080 normal, +18)_
- **texte sous 12 px** — `/` — div.conteneur.venir__grille > div.venir__plan.est-vu:nth-of-type(2) > svg.venir__carte > text.venir__note:nth-of-type(4) — 9.5 px _(1024×768 normal, 1366×768 normal, 1000×560 normal, 1280×720 normal, 1440×900 normal, 1920×1080 normal, +18)_
- **texte sous 12 px** — `/` — div.conteneur.venir__grille > div.venir__plan:nth-of-type(2) > svg.venir__carte > text.venir__pays:nth-of-type(1) — 9.0 px _(1024×768 sansJs, 1000×560 sansJs, 1280×720 sansJs, 1366×768 sansJs, 1440×900 sansJs, 1728×1000 sansJs, +2)_
- **texte sous 12 px** — `/` — div.conteneur.venir__grille > div.venir__plan:nth-of-type(2) > svg.venir__carte > text.venir__pays:nth-of-type(2) — 9.0 px _(1024×768 sansJs, 1000×560 sansJs, 1280×720 sansJs, 1366×768 sansJs, 1440×900 sansJs, 1728×1000 sansJs, +2)_
- **texte sous 12 px** — `/` — div.conteneur.venir__grille > div.venir__plan:nth-of-type(2) > svg.venir__carte > text.venir__note:nth-of-type(4) — 9.5 px _(1024×768 sansJs, 1000×560 sansJs, 1280×720 sansJs, 1366×768 sansJs, 1440×900 sansJs, 1728×1000 sansJs, +2)_
- **texte sous 12 px** — `/infos-pratiques` — div.conteneur.ouv-infos2__grille > div.ouv-infos2__visuel:nth-of-type(2) > div.carte-visite > span.carte-visite__ligne:nth-of-type(3) « 6 Vathier Haye, 54580 Moineville » — 9.3 px _(1024×768 normal, 1000×560 normal, 1280×720 normal, 1366×768 normal, 1024×768 sansJs, 1024×768 calme, +10)_
- **texte sous 12 px** — `/infos-pratiques` — div.conteneur.ouv-infos2__grille > div.ouv-infos2__visuel:nth-of-type(2) > div.carte-visite > span.carte-visite__ligne.carte-visite__tel:nth-of-type(4) « 06 18 21 28 10 » — 9.3 px _(1024×768 normal, 1000×560 normal, 1280×720 normal, 1366×768 normal, 1024×768 sansJs, 1024×768 calme, +10)_
- **texte sous 12 px** — `/infos-pratiques` — div.ouv-infos2__visuel:nth-of-type(2) > div.carte-visite > span.carte-visite__statut:nth-of-type(5) > span:nth-of-type(2) « Fermé · ouvre demain à 12 h » — 8.5 px _(1024×768 normal, 1000×560 normal, 1280×720 normal, 1366×768 normal, 1440×900 normal, 1728×1000 normal, +18)_
- **texte sous 12 px** — `/infos-pratiques` — div.ouv-infos2__visuel:nth-of-type(2) > div.carte-visite > span.carte-visite__statut:nth-of-type(5) > span:nth-of-type(2) « Horaires » — 8.5 px _(1024×768 sansJs, 1000×560 sansJs, 1280×720 sansJs, 1366×768 sansJs, 1440×900 sansJs, 1728×1000 sansJs, +2)_

### premier écran : titre h1 invisible (1)

- **premier écran : titre h1 invisible** — `/404` — h1#lum-titre « Cette page a fermé à minuit. » _(2560×1440 normal)_

### textes qui se chevauchent (2)

- **textes qui se chevauchent** — `/infos-pratiques` — div.conteneur.ouv-infos2__grille > div.ouv-infos2__visuel:nth-of-type(2) > div.carte-visite > span.carte-visite__nom:nth-of-type(2) « Les Jardins de l'Hacienda » — avec div.conteneur.ouv-infos2__grille > div.ouv-infos2__visuel:nth-of-type(2) > div.carte-visite > span.carte-visite__ligne:nth-of-type(3) « 6 Vathier Haye, 54580 Moineville » _(1024×768 normal, 1000×560 normal, 1280×720 normal, 1366×768 normal, 1440×900 normal, 1728×1000 normal, +26)_
- **textes qui se chevauchent** — `/infos-pratiques` — div.conteneur.ouv-infos2__grille > div.ouv-infos2__visuel:nth-of-type(2) > div.carte-visite > span.carte-visite__ligne:nth-of-type(3) « 6 Vathier Haye, 54580 Moineville » — avec div.conteneur.ouv-infos2__grille > div.ouv-infos2__visuel:nth-of-type(2) > div.carte-visite > span.carte-visite__ligne.carte-visite__tel:nth-of-type(4) « 06 18 21 28 10 » _(1024×768 normal, 1280×720 normal, 1366×768 normal, 1440×900 normal, 1728×1000 normal, 1920×1080 normal, +22)_

### contraste insuffisant (7)

- **contraste insuffisant** — `/infos-pratiques` — div.conteneur > div.semaine__tableau:nth-of-type(2) > div.semaine__echelle:nth-of-type(1) > span:nth-of-type(1) « 0 h » — 4.23:1 (minimum 4.5:1) _(1024×768 normal, 1000×560 normal, 1280×720 normal, 1366×768 normal, 1440×900 normal, 1728×1000 normal, +26)_
- **contraste insuffisant** — `/infos-pratiques` — div.conteneur > div.semaine__tableau:nth-of-type(2) > div.semaine__echelle:nth-of-type(1) > span:nth-of-type(2) « 6 h » — 4.23:1 (minimum 4.5:1) _(1024×768 normal, 1000×560 normal, 1280×720 normal, 1366×768 normal, 1440×900 normal, 1728×1000 normal, +26)_
- **contraste insuffisant** — `/infos-pratiques` — div.conteneur > div.semaine__tableau:nth-of-type(2) > div.semaine__echelle:nth-of-type(1) > span:nth-of-type(3) « 12 h » — 4.23:1 (minimum 4.5:1) _(1024×768 normal, 1000×560 normal, 1280×720 normal, 1366×768 normal, 1440×900 normal, 1728×1000 normal, +26)_
- **contraste insuffisant** — `/infos-pratiques` — div.conteneur > div.semaine__tableau:nth-of-type(2) > div.semaine__echelle:nth-of-type(1) > span:nth-of-type(4) « 18 h » — 4.23:1 (minimum 4.5:1) _(1024×768 normal, 1000×560 normal, 1280×720 normal, 1366×768 normal, 1440×900 normal, 1728×1000 normal, +26)_
- **contraste insuffisant** — `/infos-pratiques` — div.conteneur > div.semaine__tableau:nth-of-type(2) > div.semaine__echelle:nth-of-type(1) > span:nth-of-type(5) « 24 h » — 4.23:1 (minimum 4.5:1) _(1024×768 normal, 1000×560 normal, 1280×720 normal, 1366×768 normal, 1440×900 normal, 1728×1000 normal, +26)_
- **contraste insuffisant** — `/la-carte` — div.carte-resto__carte.socle-cadre > div.carte-resto__barre:nth-of-type(1) > nav.carte-resto__rubriques > a.carte-resto__lien:nth-of-type(4) « Nos desserts 5 » — 2.83:1 (minimum 4.5:1) _(1728×1000 normal)_
- **contraste insuffisant** — `/la-carte` — div.carte-resto__barre:nth-of-type(1) > nav.carte-resto__rubriques > a.carte-resto__lien:nth-of-type(4) > small « 5 » — 2.83:1 (minimum 4.5:1) _(1728×1000 normal)_

### section sans visuel (2)

- **section sans visuel** — `/infos-pratiques` — section#horaires « HORAIRES Ouvert maintenant ? Fermé · ouvre demain  » _(1024×768 normal, 1000×560 normal, 1280×720 normal, 1366×768 normal, 1440×900 normal, 1728×1000 normal, +18)_
- **section sans visuel** — `/infos-pratiques` — section#horaires « HORAIRES Ouvert maintenant ? Horaires 0 h 6 h 12 h » _(1024×768 sansJs, 1000×560 sansJs, 1280×720 sansJs, 1366×768 sansJs, 1440×900 sansJs, 1728×1000 sansJs, +2)_

### accessibilité (axe) : color-contrast (1)

- **accessibilité (axe) : color-contrast** — `/infos-pratiques` — .semaine__echelle > span:nth-child(1) ; .semaine__echelle > span:nth-child(2) ; .semaine__echelle > span:nth-child(3) — Elements must meet minimum color contrast ratio thresholds _(1366×768 calme)_

### premier écran : information clé hors de l’écran (1)

- **premier écran : information clé hors de l’écran** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__grille > div.ouv-fetes__contenu:nth-of-type(1) > p.ouv-fetes__info:nth-of-type(5) « Saint-Sylvestre : 120 € le menu · Noël : 79 € par  » _(1000×560 sansJs, 1280×720 sansJs)_

### lien vers une ancre : image blanche (31)

- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 367 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 379 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 393 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 409 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 426 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 443 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 460 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 476 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 495 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 518 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 684 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 693 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 715 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 738 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 780 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 804 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 814 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 825 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 841 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 876 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 891 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 908 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 927 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 948 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 971 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 1003 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 1018 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 1034 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 1050 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 1069 ms (films/ancre-receptions-1366.png) _(1366×768 film)_
- **lien vers une ancre : image blanche** — `/receptions → /reserver#formulaire` — à 1079 ms (films/ancre-receptions-1366.png) _(1366×768 film)_

### bouton du mode calme (2)

- **bouton du mode calme** — `/` — pas de retour à la section #apres-midi après le rechargement _(390×844 bouton réduire, 390×844 bouton rétablir)_
- **bouton du mode calme** — `/` — l’intro (ou son panneau) apparaît au rechargement dû au bouton _(390×844 bouton rétablir)_

### ne tient pas dans l’écran (15)

- **ne tient pas dans l’écran** — `/` — section#midi > div.heros__texte.conteneur:nth-of-type(2) > div.heros__barre > p.heros__rdv:nth-of-type(2) « Prochain rendez-vous : Soirée côte de bœuf, samedi » — coupé en bas de 14 px (à 4 % de la scène) _(1024×640 épinglé)_
- **ne tient pas dans l’écran** — `/` — div.heros__texte.conteneur:nth-of-type(2) > div.heros__barre > p.heros__rdv:nth-of-type(2) > a « Soirée côte de bœuf, samedi 21 novembre 2026 » — coupé en bas de 14 px (à 4 % de la scène) _(1024×640 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.heros__texte.conteneur:nth-of-type(2) > div.heros__barre > a.heros__bascule « Voir l'été » — coupé en bas de 4 px (à 4 % de la scène) _(1024×640 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.heros__texte.conteneur:nth-of-type(2) > div.heros__barre > p.heros__rdv:nth-of-type(2) « Prochain rendez-vous : Soirée côte de bœuf, samedi » — coupé en bas de 14 px (à 50 % de la scène) _(1024×640 épinglé)_
- **ne tient pas dans l’écran** — `/` — div.heros__texte.conteneur:nth-of-type(2) > div.heros__barre > p.heros__rdv:nth-of-type(2) > a « Soirée côte de bœuf, samedi 21 novembre 2026 » — coupé en bas de 14 px (à 50 % de la scène) _(1024×640 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.heros__texte.conteneur:nth-of-type(2) > div.heros__barre > a.heros__bascule « Voir l'été » — coupé en bas de 4 px (à 50 % de la scène) _(1024×640 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.heros__texte.conteneur:nth-of-type(2) > div.heros__barre > p.heros__rdv:nth-of-type(2) « Prochain rendez-vous : Soirée côte de bœuf, samedi » — coupé en bas de 14 px (à 96 % de la scène) _(1024×640 épinglé)_
- **ne tient pas dans l’écran** — `/` — div.heros__texte.conteneur:nth-of-type(2) > div.heros__barre > p.heros__rdv:nth-of-type(2) > a « Soirée côte de bœuf, samedi 21 novembre 2026 » — coupé en bas de 14 px (à 96 % de la scène) _(1024×640 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.heros__texte.conteneur:nth-of-type(2) > div.heros__barre > a.heros__bascule « Voir l'été » — coupé en bas de 4 px (à 96 % de la scène) _(1024×640 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.heros__texte.conteneur:nth-of-type(2) > div.heros__barre > p.heros__rdv:nth-of-type(2) « Prochain rendez-vous : Soirée côte de bœuf, samedi » — coupé en bas de 8 px (à 4 % de la scène) _(1366×768 épinglé)_
- **ne tient pas dans l’écran** — `/` — div.heros__texte.conteneur:nth-of-type(2) > div.heros__barre > p.heros__rdv:nth-of-type(2) > a « Soirée côte de bœuf, samedi 21 novembre 2026 » — coupé en bas de 8 px (à 4 % de la scène) _(1366×768 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.heros__texte.conteneur:nth-of-type(2) > div.heros__barre > p.heros__rdv:nth-of-type(2) « Prochain rendez-vous : Soirée côte de bœuf, samedi » — coupé en bas de 8 px (à 50 % de la scène) _(1366×768 épinglé)_
- **ne tient pas dans l’écran** — `/` — div.heros__texte.conteneur:nth-of-type(2) > div.heros__barre > p.heros__rdv:nth-of-type(2) > a « Soirée côte de bœuf, samedi 21 novembre 2026 » — coupé en bas de 8 px (à 50 % de la scène) _(1366×768 épinglé)_
- **ne tient pas dans l’écran** — `/` — section#midi > div.heros__texte.conteneur:nth-of-type(2) > div.heros__barre > p.heros__rdv:nth-of-type(2) « Prochain rendez-vous : Soirée côte de bœuf, samedi » — coupé en bas de 8 px (à 96 % de la scène) _(1366×768 épinglé)_
- **ne tient pas dans l’écran** — `/` — div.heros__texte.conteneur:nth-of-type(2) > div.heros__barre > p.heros__rdv:nth-of-type(2) > a « Soirée côte de bœuf, samedi 21 novembre 2026 » — coupé en bas de 8 px (à 96 % de la scène) _(1366×768 épinglé)_

## À regarder

### grille : aucun titre ne fait l’événement (point 5) (4)

- **grille : aucun titre ne fait l’événement (point 5)** — `/` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"
- **grille : aucun titre ne fait l’événement (point 5)** — `/infos-pratiques` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"
- **grille : aucun titre ne fait l’événement (point 5)** — `/les-fetes` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"
- **grille : aucun titre ne fait l’événement (point 5)** — `/reserver` — absent de cette page : titre fabriqué par le métier, axe de police animé ou titre joué avec l’image (modules axes-au-defilement, titre-cousu, texte-grave-en-direct), marqué data-grille="typo"

### grille : objet d’ouverture hors du premier écran (3)

- **grille : objet d’ouverture hors du premier écran** — `/la-carte` — 335 × 40 px visibles : l’intro et le voile s’ouvrent depuis le centre de l’écran à cette taille _(390×844)_
- **grille : objet d’ouverture hors du premier écran** — `/les-fetes` — 358 × 40 px visibles : l’intro et le voile s’ouvrent depuis le centre de l’écran à cette taille _(390×844)_
- **grille : objet d’ouverture hors du premier écran** — `/reserver` — 358 × 52 px visibles : l’intro et le voile s’ouvrent depuis le centre de l’écran à cette taille _(390×844)_

### transition : changement brusque (10)

- **transition : changement brusque** — `/ → /la-carte` — à 1461 ms (différence 30 %) (films/transition-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/infos-pratiques → /la-carte` — à 1422 ms (différence 30 %) (films/transition-infos-pratiques-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/infos-pratiques → /la-carte` — à 1495 ms (différence 23 %) (films/transition-infos-pratiques-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/les-fetes → /la-carte` — à 1437 ms (différence 36 %) (films/transition-les-fetes-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/les-fetes → /la-carte` — à 1490 ms (différence 23 %) (films/transition-les-fetes-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/offrir → /la-carte` — à 1439 ms (différence 36 %) (films/transition-offrir-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/receptions → /la-carte` — à 1381 ms (différence 37 %) (films/transition-receptions-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/receptions → /la-carte` — à 1447 ms (différence 30 %) (films/transition-receptions-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/reserver → /la-carte` — à 1539 ms (différence 30 %) (films/transition-reserver-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/reserver → /la-carte` — à 1625 ms (différence 29 %) (films/transition-reserver-vers-la-carte-1366.png) _(1366×768 film)_

### retour arrière : changement brusque (1)

- **retour arrière : changement brusque** — `/` — à 385 ms (différence 28 %) (films/retour-arrière-1366.png) _(1366×768 retour arrière)_

### rechargement au milieu de la page (3)

- **rechargement au milieu de la page** — `/infos-pratiques` — écran différent à la même position après rechargement (6.2 %), voir comparaisons/rechargement-infos-pratiques-*.png _(1366×768)_
- **rechargement au milieu de la page** — `/la-carte` — écran différent à la même position après rechargement (46.6 %), voir comparaisons/rechargement-la-carte-*.png _(1366×768)_
- **rechargement au milieu de la page** — `/reserver` — écran différent à la même position après rechargement (69.9 %), voir comparaisons/rechargement-reserver-*.png _(1366×768)_

### fluidité (1)

- **fluidité** — `/receptions` — 4 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

### effet qui ne bouge pas au défilement (2)

- **effet qui ne bouge pas au défilement** — `/receptions` — div.invitation — invitation : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/reserver` — section#debut.ouv-resa — service : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_

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
- Ouverture / (1366×768) : 2597 ms depuis le premier octet
- Ouverture /infos-pratiques (1366×768) : 2498 ms depuis le premier octet
- Ouverture /la-carte (1366×768) : 2389 ms depuis le premier octet
- Ouverture /les-fetes (1366×768) : 2496 ms depuis le premier octet
- Ouverture /offrir (1366×768) : 2464 ms depuis le premier octet
- Ouverture /receptions (1366×768) : 2542 ms depuis le premier octet
- Ouverture /reserver (1366×768) : 2429 ms depuis le premier octet
- Ouverture / (390×844) : 2542 ms depuis le premier octet
- Ouverture /infos-pratiques (390×844) : 2459 ms depuis le premier octet
- Ouverture /la-carte (390×844) : 2440 ms depuis le premier octet
- Ouverture /les-fetes (390×844) : 2485 ms depuis le premier octet
- Ouverture /offrir (390×844) : 2442 ms depuis le premier octet
- Ouverture /receptions (390×844) : 2471 ms depuis le premier octet
- Ouverture /reserver (390×844) : 2457 ms depuis le premier octet
- bords de l’écran /receptions 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Bords de l’écran : 551 images d’intro, 20 de voile et 209 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Tient dans l'écran /infos-pratiques : aucune section épinglée ou plein écran.
- Tient dans l'écran /la-carte : aucune section épinglée ou plein écran.
- Tient dans l'écran /les-fetes : aucune section épinglée ou plein écran.
- Tient dans l'écran /offrir : aucune section épinglée ou plein écran.
- Tient dans l'écran /receptions : aucune section épinglée ou plein écran.
- Tient dans l'écran /reserver : aucune section épinglée ou plein écran.
- Fluidité / 1366×768 (molette) : 2 % d'images lentes sur 464, tâche la plus longue 76 ms
- Fluidité /infos-pratiques 1366×768 (molette) : 0 % d'images lentes sur 223, tâche la plus longue 0 ms
- Fluidité /la-carte 1366×768 (molette) : 1 % d'images lentes sur 372, tâche la plus longue 0 ms
- Fluidité /les-fetes 1366×768 (molette) : 0 % d'images lentes sur 336, tâche la plus longue 0 ms
- Fluidité /offrir 1366×768 (molette) : 0 % d'images lentes sur 132, tâche la plus longue 0 ms
- Fluidité /reserver 1366×768 (molette) : 0 % d'images lentes sur 212, tâche la plus longue 0 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1417, tâche la plus longue 0 ms
- Fluidité /infos-pratiques 390×844 (doigt) : 0 % d'images lentes sur 1348, tâche la plus longue 0 ms
- Fluidité /la-carte 390×844 (doigt) : 0 % d'images lentes sur 1339, tâche la plus longue 0 ms
- Fluidité /les-fetes 390×844 (doigt) : 0 % d'images lentes sur 1422, tâche la plus longue 0 ms
- Fluidité /offrir 390×844 (doigt) : 0 % d'images lentes sur 1422, tâche la plus longue 0 ms
- Fluidité /receptions 390×844 (doigt) : 0 % d'images lentes sur 1422, tâche la plus longue 0 ms
- Fluidité /reserver 390×844 (doigt) : 0 % d'images lentes sur 1342, tâche la plus longue 0 ms
- Vitesse / : 0.74 s de calcul au chargement (téléphone ralenti).
- Vitesse /infos-pratiques : 0.27 s de calcul au chargement (téléphone ralenti).
- Vitesse /la-carte : 0.47 s de calcul au chargement (téléphone ralenti).
- Vitesse /les-fetes : 0.50 s de calcul au chargement (téléphone ralenti).
- Vitesse /offrir : 0.32 s de calcul au chargement (téléphone ralenti).
- Vitesse /receptions : 0.52 s de calcul au chargement (téléphone ralenti).
- Vitesse /reserver : 0.42 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --complet --seulement=fichiers,mesures,parcours,ecran
```
