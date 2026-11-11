# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 10/11/2026 21:59:18 · 23 min · 7 page(s) · audit RAPIDE : ne vaut pas pour une livraison ciblé sur /,/la-carte,/les-fetes,/receptions,/reserver,/offrir,/infos-pratiques

## Résumé

- Statut : **196 échec(s)**
- Passe : `20261110-203603-rapide-cible` · version ?v=6
- Échecs : **196**
- À regarder : **19**
- Non lancé : **2**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (6), mesures (49), films d’ouverture (14), films de transition (14), bords de l’écran (7), intro accélérable et passable (7), menu (1), clavier (7), liens et boutons (7), liens profonds (15), liens vers la page en cours (7), changements de hauteur (6), mode calme (14), bouton du mode calme (2), parcours du projet (1), tient dans l’écran (2), films des épinglages (1), fluidité (14), défilement selon l’appareil (5), mouvement (14), effets du plan (25), souris immobile (5), vitesse (7), captures (1)

## Grille wouahou

| Point | État | Détail |
|---|---|---|
| 1. L’effet signature se manipule | ✓ présent | accueil |
| 2. L’intro devient la page | ✓ présent | objet d’ouverture sur 7 page(s), versObjet dans l’intro |
| 3. La transition reprend le motif | ✓ présent | voile en cloche |
| 4. Quelque chose relie les sections et les pages | ✓ présent | sur les 7 page(s) |
| 5. Un titre fait l’événement sur chaque page | ✓ présent | sur les 7 page(s) |
| 6. La scène est un geste du métier | ⚠ à regarder | galerie générique sur / ; geste du métier sur / |
| 7. L’action principale a un retour physique | ✓ présent | sur /, /offrir, /receptions, /reserver |

Le script vérifie les marques (`data-grille`, `data-iris-centre`, forme du voile, `versObjet`) ; la force et la justesse de chaque point se jugent sur les captures et les films.

## Passes de cette version (?v=6)

Chaque passe garde son rapport dans `_audit/passes/` : une relance ciblée ne fait pas disparaître la preuve d’une passe plus large.

| Passe | Niveau | Pages | Étapes | Échecs | À regarder | Non lancé | Statut |
|---|---|---|---|---:|---:|---:|---|
| 20261110-202351-rapide | rapide | toutes | toutes | 49 | 12 | 1 | échecs |
| **20261110-203603-rapide-cible** (celle-ci) | rapide | /,/la-carte,/les-fetes,/receptions,/reserver,/offrir,/infos-pratiques | toutes | 196 | 19 | 2 | échecs |

## Échecs

### image de partage (7)

- **image de partage** — `index.html` — fichier introuvable : /assets/partage/accueil-fr.jpg
- **image de partage** — `infos-pratiques.html` — fichier introuvable : /assets/partage/infos-pratiques-fr.jpg
- **image de partage** — `la-carte.html` — fichier introuvable : /assets/partage/la-carte-fr.jpg
- **image de partage** — `les-fetes.html` — fichier introuvable : /assets/partage/les-fetes-fr.jpg
- **image de partage** — `offrir.html` — fichier introuvable : /assets/partage/offrir-fr.jpg
- **image de partage** — `receptions.html` — fichier introuvable : /assets/partage/receptions-fr.jpg
- **image de partage** — `reserver.html` — fichier introuvable : /assets/partage/reserver-fr.jpg

### premier écran : information clé hors de l’écran (5)

- **premier écran : information clé hors de l’écran** — `/` — section#midi > div.midi__texte.conteneur:nth-of-type(2) > p.statut.midi__statut:nth-of-type(5) > span:nth-of-type(2) « Le midi du mercredi au dimanche (sauf le samedi),  » _(390×844 sansJs, 320×568 sansJs)_
- **premier écran : information clé hors de l’écran** — `/infos-pratiques` — section#debut > div.conteneur.ouv-infos__contenu > p.ouv-infos__actions:nth-of-type(4) > span.ouv-infos__adresse « 6 Vathier Haye, 54580 Moineville » _(320×568 sansJs)_
- **premier écran : information clé hors de l’écran** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu > p.ouv-fetes__info:nth-of-type(5) « 120 € le menu · 79 € par personne, hors boissons » _(390×844 sansJs, 320×568 sansJs)_
- **premier écran : information clé hors de l’écran** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > p.ouv-recep__info:nth-of-type(5) « Appeler 06 18 21 28 10 » _(390×844 sansJs, 320×568 sansJs)_
- **premier écran : information clé hors de l’écran** — `/reserver` — section#debut > div.ouv-resa__texte:nth-of-type(2) > p.ouv-resa__actions:nth-of-type(4) > a.ouv-resa__tel:nth-of-type(3) « 06 18 21 28 10 » _(320×568 sansJs)_

### contraste insuffisant (28)

- **contraste insuffisant** — `/infos-pratiques` — dl.horaires__semaine > div.horaires__jour.est-aujourdhui:nth-of-type(2) > dt > span.horaires__auj « · aujourd'hui » — 4.04:1 (minimum 4.5:1) _(390×844 normal, 1366×768 normal, 844×390 normal, 390×844 calme, 390×844 sansWebgl)_
- **contraste insuffisant** — `/la-carte` — section#debut > div.ouv-carte__photo:nth-of-type(1) > p.heure-geante.ouv-carte__heure > span:nth-of-type(1) « 12:30 » — 1.13:1 (minimum 3:1) _(320×568 sansJs)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t:nth-of-type(1) > text.pds__num — 1.56:1 (minimum 4.5:1) _(390×844 normal, 1366×768 normal, 390×844 calme, 844×390 normal, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t:nth-of-type(2) > text.pds__num — 1.56:1 (minimum 4.5:1) _(390×844 normal, 1366×768 normal, 390×844 calme, 844×390 normal, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t.est-prise:nth-of-type(3) > text.pds__num — 1.56:1 (minimum 4.5:1) _(390×844 normal, 1366×768 normal, 390×844 calme, 844×390 normal, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t:nth-of-type(4) > text.pds__num — 1.56:1 (minimum 4.5:1) _(390×844 normal, 1366×768 normal, 390×844 calme, 844×390 normal, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t:nth-of-type(5) > text.pds__num — 1.56:1 (minimum 4.5:1) _(390×844 normal, 1366×768 normal, 390×844 calme, 844×390 normal, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t.est-prise:nth-of-type(6) > text.pds__num — 1.56:1 (minimum 4.5:1) _(390×844 normal, 1366×768 normal, 390×844 calme, 844×390 normal, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t:nth-of-type(7) > text.pds__num — 1.56:1 (minimum 4.5:1) _(390×844 normal, 1366×768 normal, 390×844 calme, 844×390 normal, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t:nth-of-type(8) > text.pds__num — 1.56:1 (minimum 4.5:1) _(390×844 normal, 1366×768 normal, 390×844 calme, 844×390 normal, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t:nth-of-type(9) > text.pds__num — 1.56:1 (minimum 4.5:1) _(390×844 normal, 1366×768 normal, 390×844 calme, 844×390 normal, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t.est-prise:nth-of-type(10) > text.pds__num — 1.56:1 (minimum 4.5:1) _(390×844 normal, 1366×768 normal, 390×844 calme, 844×390 normal, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t.est-prise:nth-of-type(11) > text.pds__num — 1.56:1 (minimum 4.5:1) _(390×844 normal, 1366×768 normal, 390×844 calme, 844×390 normal, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — svg.pds__svg > g.pds__tables:nth-of-type(6) > g.pds__t.est-prise:nth-of-type(12) > text.pds__num — 1.56:1 (minimum 4.5:1) _(390×844 normal, 1366×768 normal, 390×844 calme, 844×390 normal, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — ul#pds-liste > li.pds__item:nth-of-type(1) > button.pds__lien > span.pds__num:nth-of-type(1) « 1 » — 1.56:1 (minimum 4.5:1) _(390×844 normal, 390×844 calme, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — ul#pds-liste > li.pds__item:nth-of-type(2) > button.pds__lien > span.pds__num:nth-of-type(1) « 2 » — 1.56:1 (minimum 4.5:1) _(390×844 normal, 390×844 calme, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — ul#pds-liste > li.pds__item:nth-of-type(4) > button.pds__lien > span.pds__num:nth-of-type(1) « 4 » — 1.56:1 (minimum 4.5:1) _(390×844 normal, 390×844 calme, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — ul#pds-liste > li.pds__item:nth-of-type(5) > button.pds__lien > span.pds__num:nth-of-type(1) « 5 » — 1.56:1 (minimum 4.5:1) _(390×844 normal, 390×844 calme, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — ul#pds-liste > li.pds__item:nth-of-type(7) > button.pds__lien > span.pds__num:nth-of-type(1) « 7 » — 1.56:1 (minimum 4.5:1) _(390×844 normal, 390×844 calme, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — ul#pds-liste > li.pds__item:nth-of-type(8) > button.pds__lien > span.pds__num:nth-of-type(1) « 8 » — 1.56:1 (minimum 4.5:1) _(390×844 normal, 390×844 calme, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — ul#pds-liste > li.pds__item:nth-of-type(9) > button.pds__lien > span.pds__num:nth-of-type(1) « 9 » — 1.56:1 (minimum 4.5:1) _(390×844 normal, 390×844 calme, 390×844 sansWebgl)_
- **contraste insuffisant** — `/reserver` — ul.pds__liste > li.pds__item:nth-of-type(1) > button.pds__lien > span.pds__num:nth-of-type(1) « 1 » — 1.56:1 (minimum 4.5:1) _(1366×768 normal, 844×390 normal)_
- **contraste insuffisant** — `/reserver` — ul.pds__liste > li.pds__item:nth-of-type(2) > button.pds__lien > span.pds__num:nth-of-type(1) « 2 » — 1.56:1 (minimum 4.5:1) _(1366×768 normal, 844×390 normal)_
- **contraste insuffisant** — `/reserver` — ul.pds__liste > li.pds__item:nth-of-type(4) > button.pds__lien > span.pds__num:nth-of-type(1) « 4 » — 1.56:1 (minimum 4.5:1) _(1366×768 normal, 844×390 normal)_
- **contraste insuffisant** — `/reserver` — ul.pds__liste > li.pds__item:nth-of-type(5) > button.pds__lien > span.pds__num:nth-of-type(1) « 5 » — 1.56:1 (minimum 4.5:1) _(1366×768 normal, 844×390 normal)_
- **contraste insuffisant** — `/reserver` — ul.pds__liste > li.pds__item:nth-of-type(7) > button.pds__lien > span.pds__num:nth-of-type(1) « 7 » — 1.56:1 (minimum 4.5:1) _(1366×768 normal, 844×390 normal)_
- **contraste insuffisant** — `/reserver` — ul.pds__liste > li.pds__item:nth-of-type(8) > button.pds__lien > span.pds__num:nth-of-type(1) « 8 » — 1.56:1 (minimum 4.5:1) _(1366×768 normal, 844×390 normal)_
- **contraste insuffisant** — `/reserver` — ul.pds__liste > li.pds__item:nth-of-type(9) > button.pds__lien > span.pds__num:nth-of-type(1) « 9 » — 1.56:1 (minimum 4.5:1) _(1366×768 normal, 844×390 normal)_

### accessibilité (axe) : color-contrast (1)

- **accessibilité (axe) : color-contrast** — `/infos-pratiques` — .horaires__auj — Elements must meet minimum color contrast ratio thresholds _(390×844 calme)_

### textes qui se chevauchent (25)

- **textes qui se chevauchent** — `/les-fetes` — div.ame__grille.socle-cadre > div.ame__tete:nth-of-type(1) > p.sylvestre__prix:nth-of-type(3) > strong:nth-of-type(1) « 120 € le menu » — avec div.ame__grille.socle-cadre > div.ame__tete:nth-of-type(1) > p.sylvestre__prix:nth-of-type(3) > strong:nth-of-type(2) « 170 € avec l'accord mets et vins » _(390×844 normal, 390×844 sansJs, 390×844 calme, 320×568 sansJs, 390×844 sansWebgl)_
- **textes qui se chevauchent** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu > p.heure-geante.ouv-fetes__geant:nth-of-type(1) > span:nth-of-type(1) « J-51 » — avec section#debut > div.conteneur.ouv-fetes__contenu > h1 > span:nth-of-type(1) « Les fêtes au coin du feu » _(844×390 normal)_
- **textes qui se chevauchent** — `/les-fetes` — ul.ame__liste > li.ame__plat:nth-of-type(2) > p.ame__accord:nth-of-type(3) > span.ame__type:nth-of-type(1) « Bulles » — avec ul.ame__liste > li.ame__plat:nth-of-type(2) > p.ame__accord:nth-of-type(3) > span.ame__boisson:nth-of-type(2) « Champagne blanc de blancs » _(390×844 sansJs, 320×568 sansJs)_
- **textes qui se chevauchent** — `/les-fetes` — ul.ame__liste > li.ame__plat:nth-of-type(2) > p.ame__accord:nth-of-type(3) > span.ame__boisson:nth-of-type(2) « Champagne blanc de blancs » — avec ul.ame__liste > li.ame__plat:nth-of-type(2) > p.ame__accord:nth-of-type(3) > span.ame__region:nth-of-type(3) « Champagne » _(390×844 sansJs)_
- **textes qui se chevauchent** — `/les-fetes` — ul.ame__liste > li.ame__plat:nth-of-type(4) > p.ame__accord:nth-of-type(3) > span.ame__type:nth-of-type(1) « Vin rouge » — avec ul.ame__liste > li.ame__plat:nth-of-type(4) > p.ame__accord:nth-of-type(3) > span.ame__boisson:nth-of-type(2) « Pomerol ou Côte-Rôtie » _(390×844 sansJs, 320×568 sansJs)_
- **textes qui se chevauchent** — `/les-fetes` — ul.ame__liste > li.ame__plat:nth-of-type(4) > p.ame__accord:nth-of-type(3) > span.ame__boisson:nth-of-type(2) « Pomerol ou Côte-Rôtie » — avec ul.ame__liste > li.ame__plat:nth-of-type(4) > p.ame__accord:nth-of-type(3) > span.ame__region:nth-of-type(3) « Bordeaux ou vallée du Rhône » _(390×844 sansJs)_
- **textes qui se chevauchent** — `/les-fetes` — ul.ame__liste > li.ame__plat:nth-of-type(1) > p.ame__accord:nth-of-type(3) > span.ame__type:nth-of-type(1) « Bulles » — avec ul.ame__liste > li.ame__plat:nth-of-type(1) > p.ame__accord:nth-of-type(3) > span.ame__boisson:nth-of-type(2) « Coupe de Champagne » _(320×568 sansJs)_
- **textes qui se chevauchent** — `/les-fetes` — ul.ame__liste > li.ame__plat:nth-of-type(1) > p.ame__accord:nth-of-type(3) > span.ame__boisson:nth-of-type(2) « Coupe de Champagne » — avec ul.ame__liste > li.ame__plat:nth-of-type(1) > p.ame__accord:nth-of-type(3) > span.ame__region:nth-of-type(3) « Servie avec l'amuse-bouche » _(320×568 sansJs)_
- **textes qui se chevauchent** — `/les-fetes` — ul.ame__liste > li.ame__plat:nth-of-type(3) > p.ame__accord:nth-of-type(3) > span.ame__type:nth-of-type(1) « Vin blanc » — avec ul.ame__liste > li.ame__plat:nth-of-type(3) > p.ame__accord:nth-of-type(3) > span.ame__boisson:nth-of-type(2) « Chablis premier cru » _(320×568 sansJs)_
- **textes qui se chevauchent** — `/les-fetes` — ul.ame__liste > li.ame__plat:nth-of-type(5) > p.ame__accord:nth-of-type(3) > span.ame__type:nth-of-type(1) « Vin blanc » — avec ul.ame__liste > li.ame__plat:nth-of-type(5) > p.ame__accord:nth-of-type(3) > span.ame__boisson:nth-of-type(2) « Jurançon moelleux » _(320×568 sansJs)_
- **textes qui se chevauchent** — `/les-fetes` — ul.ame__liste > li.ame__plat:nth-of-type(5) > p.ame__accord:nth-of-type(3) > span.ame__boisson:nth-of-type(2) « Jurançon moelleux » — avec ul.ame__liste > li.ame__plat:nth-of-type(5) > p.ame__accord:nth-of-type(3) > span.ame__region:nth-of-type(3) « Sud-Ouest, Jurançon » _(320×568 sansJs)_
- **textes qui se chevauchent** — `/offrir` — section#debut > div.conteneur.ouv-offrir__grille > div.ouv-offrir__texte:nth-of-type(1) > p.heure-geante.heure-geante--nuit:nth-of-type(1) « 00:00 » — avec section#debut > div.conteneur.ouv-offrir__grille > div.ouv-offrir__texte:nth-of-type(1) > h1 « Offrir une soirée » _(844×390 normal)_
- **textes qui se chevauchent** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > h1.ouv-recep__titre « Recevoir pour un anniversaire un pot de départ » — avec section#debut > div.conteneur.ouv-recep__contenu > p.masque-ecran-bas:nth-of-type(3) « La salle et sa cheminée, la terrasse et sa pergola » _(390×844 normal)_
- **textes qui se chevauchent** — `/receptions` — h1.ouv-recep__titre > span.mot-tournant > span.mot-tournant__boite > span.mot-tournant__mot:nth-of-type(3) « un anniversaire » — avec h1.ouv-recep__titre > span.mot-tournant > span.mot-tournant__boite > span.mot-tournant__mot:nth-of-type(4) « un pot de départ » _(390×844 normal, 844×390 normal, 390×844 sansWebgl)_
- **textes qui se chevauchent** — `/receptions` — h1.ouv-recep__titre > span.mot-tournant > span.mot-tournant__boite > span.mot-tournant__mot:nth-of-type(4) « un pot de départ » — avec section#debut > div.conteneur.ouv-recep__contenu > p.masque-ecran-bas:nth-of-type(3) « La salle et sa cheminée, la terrasse et sa pergola » _(390×844 normal)_
- **textes qui se chevauchent** — `/receptions` — article#espace-salle > figure.media.volet__photo > figcaption.mention-ia « Illustration générée » — avec div#volet-salle > p:nth-of-type(2) « Au chaud, autour du feu : les dîners de famille, l » _(390×844 normal, 844×390 normal, 390×844 calme, 390×844 sansJs, 320×568 sansJs, 390×844 sansWebgl)_
- **textes qui se chevauchent** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > p.heure-geante.heure-geante--nuit:nth-of-type(1) « 19:00 » — avec section#debut > div.conteneur.ouv-recep__contenu > h1.ouv-recep__titre « Recevoir pour un anniversaire un pot de départ » _(844×390 normal, 1366×768 normal)_
- **textes qui se chevauchent** — `/receptions` — article#espace-terrasse > figure.media.volet__photo > figcaption.mention-ia « Illustration générée » — avec article#espace-terrasse > button.volet__tete > span.volet__nom:nth-of-type(2) « La terrasse et la pergola » _(844×390 normal, 1366×768 normal)_
- **textes qui se chevauchent** — `/receptions` — article#espace-piscine > figure.media.volet__photo > figcaption.mention-ia « Illustration générée » — avec article#espace-piscine > button.volet__tete > span.volet__nom:nth-of-type(2) « La piscine et les jardins » _(844×390 normal, 1366×768 normal)_
- **textes qui se chevauchent** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > p.surtitre:nth-of-type(2) « RÉCEPTIONS » — avec section#debut > div.conteneur.ouv-recep__contenu > h1.ouv-recep__titre « Recevoir pour un anniversaire un pot de départ » _(1366×768 normal)_
- **textes qui se chevauchent** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > h1.ouv-recep__titre « Recevoir pour un anniversaire un pot de départ » — avec section#debut > div.conteneur.ouv-recep__contenu > p.ouv-recep__actions:nth-of-type(4) > a.bouton:nth-of-type(1) « Demander une réception » _(1366×768 normal)_
- **textes qui se chevauchent** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > h1.ouv-recep__titre « Recevoir pour un anniversaire un pot de départ » — avec section#debut > div.conteneur.ouv-recep__contenu > p.ouv-recep__actions:nth-of-type(4) > a.bouton.bouton--contour:nth-of-type(2) « Voir les espaces » _(1366×768 normal)_
- **textes qui se chevauchent** — `/receptions` — h1.ouv-recep__titre > span.mot-tournant > span.mot-tournant__boite > span.mot-tournant__mot:nth-of-type(4) « un pot de départ » — avec section#debut > div.conteneur.ouv-recep__contenu > p.ouv-recep__actions:nth-of-type(4) > a.bouton.bouton--contour:nth-of-type(2) « Voir les espaces » _(1366×768 normal)_
- **textes qui se chevauchent** — `/receptions` — article#espace-terrasse > figure.media.volet__photo > figcaption.mention-ia « Illustration générée » — avec div#volet-terrasse > p:nth-of-type(2) « La grande table sous les guirlandes : les mariages » _(390×844 calme, 390×844 sansJs, 320×568 sansJs)_
- **textes qui se chevauchent** — `/receptions` — article#espace-piscine > figure.media.volet__photo > figcaption.mention-ia « Illustration générée » — avec div#volet-piscine > p:nth-of-type(2) « Le cocktail sous les palmiers, au bord de l'eau :  » _(390×844 calme, 390×844 sansJs, 320×568 sansJs)_

### section sans visuel (7)

- **section sans visuel** — `/les-fetes` — section#passes « Les soirées passées A EU LIEU Soirée libanaise Sam » _(390×844 normal, 844×390 normal, 1366×768 normal, 390×844 sansJs, 390×844 calme, 320×568 sansJs, +1)_
- **section sans visuel** — `/les-fetes` — section#ete « L'été, de 12 h à minuit 12 h – 19 h Les journées f » _(390×844 normal, 844×390 normal, 1366×768 normal, 390×844 sansJs, 390×844 calme, 320×568 sansJs, +1)_
- **section sans visuel** — `/les-fetes` — section#saint-sylvestre « JEUDI 31 DÉCEMBRE, LE SOIR Le menu de la Saint-Syl » _(390×844 sansJs, 320×568 sansJs)_
- **section sans visuel** — `/receptions` — section#demande « VOTRE RÉCEPTION Demander une réception Trois étape » _(390×844 normal, 844×390 normal, 1366×768 normal, 390×844 calme, 390×844 sansJs, 320×568 sansJs, +1)_
- **section sans visuel** — `/reserver` — section#debut « 12:30 AU DÉJEUNER Votre table Le jour, le service, » _(390×844 normal, 390×844 calme, 390×844 sansWebgl)_
- **section sans visuel** — `/reserver` — section#formulaire « VOTRE RÉSERVATION Le jour, l'heure, les couverts R » _(390×844 normal, 1366×768 normal, 390×844 calme, 844×390 normal, 390×844 sansJs, 320×568 sansJs, +1)_
- **section sans visuel** — `/reserver` — section#debut « 20:00 AU DÎNER Votre table Le jour, le service, le » _(390×844 sansJs, 320×568 sansJs)_

### contraste sur image (5)

- **contraste sur image** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu > p.heure-geante.ouv-fetes__geant:nth-of-type(1) > span:nth-of-type(1) « J-51 » — 2.37:1 sur les 10 % de la photo les moins favorables (minimum 3:1) _(390×844 normal)_
- **contraste sur image** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu > p.heure-geante.ouv-fetes__geant:nth-of-type(1) > span:nth-of-type(1) « J-51 » — 1.57:1 sur les 10 % de la photo les moins favorables (minimum 3:1) _(1366×768 normal)_
- **contraste sur image** — `/offrir` — div.conteneur.ouv-offrir__grille > div.ouv-offrir__texte:nth-of-type(1) > p.masque-ecran-tres-bas:nth-of-type(3) > span:nth-of-type(1) « Un dîner au coin du feu, un déjeuner du dimanche : » — 4.50:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1) _(390×844 normal)_
- **contraste sur image** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > p.heure-geante.heure-geante--nuit:nth-of-type(1) « 19:00 » — 2.15:1 sur les 10 % de la photo les moins favorables (minimum 3:1) _(390×844 normal)_
- **contraste sur image** — `/receptions` — h1.ouv-recep__titre > span.mot-tournant > span.mot-tournant__boite > span.mot-tournant__mot:nth-of-type(4) « un pot de départ » — 1.33:1 sur les 10 % de la photo les moins favorables (minimum 3:1) _(390×844 normal)_

### texte coupé (3)

- **texte coupé** — `/receptions` — h1.ouv-recep__titre > span.mot-tournant > span.mot-tournant__boite > span.mot-tournant__mot:nth-of-type(3) « un anniversaire » — coupé par div.conteneur.ouv-recep__contenu > h1.ouv-recep__titre > span.mot-tournant > span.mot-tournant__boite « un anniversaire un pot de départ » _(390×844 normal, 844×390 normal, 1366×768 normal, 390×844 sansWebgl)_
- **texte coupé** — `/receptions` — h1.ouv-recep__titre > span.mot-tournant > span.mot-tournant__boite > span.mot-tournant__mot:nth-of-type(4) « un pot de départ » — coupé par div.conteneur.ouv-recep__contenu > h1.ouv-recep__titre > span.mot-tournant > span.mot-tournant__boite « un anniversaire un pot de départ » _(390×844 normal, 844×390 normal, 1366×768 normal, 390×844 sansWebgl)_
- **texte coupé** — `/receptions` — h1.ouv-recep__titre > span.mot-tournant > span.mot-tournant__boite > span.mot-tournant__mot:nth-of-type(1) « un mariage » — coupé par div.conteneur.ouv-recep__contenu > h1.ouv-recep__titre > span.mot-tournant > span.mot-tournant__boite « un mariage » _(390×844 calme, 390×844 sansJs, 320×568 sansJs)_

### élément recouvert (2)

- **élément recouvert** — `/receptions` — article#espace-salle > button.volet__tete « 01 La salle et sa cheminée » — par article#espace-salle > figure.media.volet__photo > figcaption.mention-ia « Illustration générée » _(390×844 normal, 1366×768 normal)_
- **élément recouvert** — `/receptions` — article#espace-terrasse > button.volet__tete « 02 La terrasse et la pergola » — par article#espace-terrasse > figure.media.volet__photo > figcaption.mention-ia « Illustration générée » _(390×844 normal, 1366×768 normal)_

### zone tactile sous 44 px (3)

- **zone tactile sous 44 px** — `/reserver` — div.resa__grille.socle-cadre > form.resa__form > details.resa__plus > summary « Une demande particulière ? (facultatif) » — 358 × 26 px _(390×844 normal, 390×844 calme, 844×390 normal, 390×844 sansJs, 390×844 sansWebgl)_
- **zone tactile sous 44 px** — `/reserver` — section#plan > div.pds__grille.socle-cadre > button.pds__agrandir « Agrandir le plan » — 358 × 32 px _(390×844 normal, 390×844 calme, 390×844 sansWebgl)_
- **zone tactile sous 44 px** — `/reserver` — section#plan > div.pds__grille.socle-cadre > div.pds__panneau:nth-of-type(4) > button.pds__agrandir.pds__voir « Voir les 12 tables » — 358 × 32 px _(390×844 normal, 390×844 calme, 390×844 sansWebgl)_

### ouverture : image blanche (107)

- **ouverture : image blanche** — `/la-carte` — à 1510 ms (films/ouverture-la-carte-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1507 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1531 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1557 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1582 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1608 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1630 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1642 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1654 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1667 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1683 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1700 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1717 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1733 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1751 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1768 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1784 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1805 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1818 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1833 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1852 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1867 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1884 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/les-fetes` — à 1901 ms (films/ouverture-les-fetes-1366.png) _(1366×768 film)_
- **ouverture : image blanche** — `/infos-pratiques` — à 1442 ms (films/ouverture-infos-pratiques-390.png) _(390×844 film)_
- **ouverture : image blanche** — `/infos-pratiques` — à 1458 ms (films/ouverture-infos-pratiques-390.png) _(390×844 film)_
- **ouverture : image blanche** — `/infos-pratiques` — à 1475 ms (films/ouverture-infos-pratiques-390.png) _(390×844 film)_
- **ouverture : image blanche** — `/infos-pratiques` — à 1510 ms (films/ouverture-infos-pratiques-390.png) _(390×844 film)_
- **ouverture : image blanche** — `/infos-pratiques` — à 1526 ms (films/ouverture-infos-pratiques-390.png) _(390×844 film)_
- **ouverture : image blanche** — `/infos-pratiques` — à 1543 ms (films/ouverture-infos-pratiques-390.png) _(390×844 film)_
- **ouverture : image blanche** — `/infos-pratiques` — à 1559 ms (films/ouverture-infos-pratiques-390.png) _(390×844 film)_
- **ouverture : image blanche** — `/infos-pratiques` — à 1575 ms (films/ouverture-infos-pratiques-390.png) _(390×844 film)_
- **ouverture : image blanche** — `/infos-pratiques` — à 1592 ms (films/ouverture-infos-pratiques-390.png) _(390×844 film)_
- **ouverture : image blanche** — `/infos-pratiques` — à 1608 ms (films/ouverture-infos-pratiques-390.png) _(390×844 film)_
- **ouverture : image blanche** — `/infos-pratiques` — à 1625 ms (films/ouverture-infos-pratiques-390.png) _(390×844 film)_
- **ouverture : image blanche** — `/infos-pratiques` — à 1643 ms (films/ouverture-infos-pratiques-390.png) _(390×844 film)_
- **ouverture : image blanche** — `/infos-pratiques` — à 1658 ms (films/ouverture-infos-pratiques-390.png) _(390×844 film)_
- **ouverture : image blanche** — `/infos-pratiques` — à 1675 ms (films/ouverture-infos-pratiques-390.png) _(390×844 film)_
- **ouverture : image blanche** — `/infos-pratiques` — à 1692 ms (films/ouverture-infos-pratiques-390.png) _(390×844 film)_
- **ouverture : image blanche** — `/infos-pratiques` — à 1709 ms (films/ouverture-infos-pratiques-390.png) _(390×844 film)_
- … et 67 autres (rapport.json)

### clavier (1)

- **clavier** — `/` — a « L'été aux Jardins » — le focus arrive sur un élément caché _(1366×768)_

### lien profond (1)

- **lien profond** — `/la-carte → /reserver?service=soir#formulaire` — choix « service=soir » non prérempli (valeur : midi) _(1366×768 lien profond)_

### fluidité (1)

- **fluidité** — `/` — 2 % d'images de plus de 50 ms, tâche la plus longue 368 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

## À regarder

### « à compléter » visible (2)

- **« à compléter » visible** — `infos-pratiques.html` — 1 fois hors du pied de page : remplacer par une phrase vraie qui oriente le visiteur (« Tarifs selon la saison, donnés à la réservation ») ou retirer l'élément, et le noter dans la fiche du README (sauf sens propre : « dossier à compléter »)
- **« à compléter » visible** — `receptions.html` — 1 fois hors du pied de page : remplacer par une phrase vraie qui oriente le visiteur (« Tarifs selon la saison, donnés à la réservation ») ou retirer l'élément, et le noter dans la fiche du README (sauf sens propre : « dossier à compléter »)

### clearProps « all » (1)

- **clearProps « all »** — assets/js/modules/carte-cadeau-qui-se-compose/module.js : efface aussi les variables CSS posées dans le HTML ; nommer les propriétés (clearProps: 'transform,opacity')

### grille : galerie horizontale générique (point 6) (1)

- **grille : galerie horizontale générique (point 6)** — `/` — le métier a-t-il son geste (feuilleter un bac, empiler des planches, tourner les pages, ouvrir un tiroir) ? Modules bac-a-feuilleter, planches-empilees ; si la rangée qui défile est le geste du métier, ajouter data-grille="scene"

### identifiant en double (1)

- **identifiant en double** — `/la-carte` — symbol#carte-a-partager — id="carte-a-partager" _(390×844 normal, 1366×768 normal, 390×844 calme, 390×844 sansJs)_

### contraste sur image (1)

- **contraste sur image** — `/la-carte` — section#debut > div.ouv-carte__photo:nth-of-type(1) > p.heure-geante.ouv-carte__heure > span:nth-of-type(2) « 20:30 » — 1.56:1 sur les 10 % de la photo les moins favorables (minimum 3:1), ombre portée à vérifier _(390×844 normal)_

### transition : changement brusque (2)

- **transition : changement brusque** — `/ → /la-carte` — à 406 ms (différence 23 %) (films/transition-vers-la-carte-1366.png) _(1366×768 film)_
- **transition : changement brusque** — `/ → /la-carte` — à 710 ms (différence 32 %) (films/transition-vers-la-carte-1366.png) _(1366×768 film)_

### retour avant : changement brusque (2)

- **retour avant : changement brusque** — `/la-carte` — à 137 ms (différence 22 %) (films/retour-avant-1366.png) _(1366×768 retour avant)_
- **retour avant : changement brusque** — `/la-carte` — à 79 ms (différence 43 %) (films/retour-avant-390.png) _(390×844 retour avant)_

### retour arrière : changement brusque (1)

- **retour arrière : changement brusque** — `/` — à 79 ms (différence 58 %) (films/retour-arrière-390.png) _(390×844 retour arrière)_

### rechargement au milieu de la page (1)

- **rechargement au milieu de la page** — `/la-carte` — écran différent à la même position après rechargement (15.5 %), voir comparaisons/rechargement-la-carte-*.png _(1366×768)_

### effet qui ne bouge pas au défilement (7)

- **effet qui ne bouge pas au défilement** — `/` — button.bouton — carton : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/infos-pratiques` — span.heure-geante.ouv-infos__heure — axes : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/la-carte` — section#debut.ouv-carte — moment : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/la-carte` — p.heure-geante.ouv-carte__heure — axes : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/offrir` — p.heure-geante.heure-geante--nuit — axes : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/receptions` — p.heure-geante.heure-geante--nuit — axes : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_
- **effet qui ne bouge pas au défilement** — `/receptions` — div.invitation — invitation : il ne bouge ni au défilement ni tout seul à cette taille (effet au survol, au clic, ou réservé à l'ordinateur ?) ; il ne compte pas comme effet de section _(1366×768 normal, 390×844 normal)_

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

- Numéro de version des fichiers : ?v=6
- Journal v6 : 2 étape(s) notée(s), 31 min de travail pour 35 min de budget, 2 min d’attente de l’utilisateur.
- Audit rapide : étapes lourdes sur /, /infos-pratiques, /la-carte, /les-fetes, /offrir, /receptions, /reserver.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Balayage des largeurs : non fait en audit rapide.
- Ouverture / (1366×768) : 2638 ms depuis le premier octet
- Ouverture /infos-pratiques (1366×768) : 2548 ms depuis le premier octet
- Ouverture /la-carte (1366×768) : 2503 ms depuis le premier octet
- Ouverture /les-fetes (1366×768) : 2491 ms depuis le premier octet
- film de l'ouverture /les-fetes 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /offrir (1366×768) : 2540 ms depuis le premier octet
- Ouverture /receptions (1366×768) : 2490 ms depuis le premier octet
- Ouverture /reserver (1366×768) : 2483 ms depuis le premier octet
- Ouverture / (390×844) : 2542 ms depuis le premier octet
- Ouverture /infos-pratiques (390×844) : 2509 ms depuis le premier octet
- film de l'ouverture /infos-pratiques 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /la-carte (390×844) : 2478 ms depuis le premier octet
- film de l'ouverture /la-carte 390×844 : réussi à la tentative 3 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /les-fetes (390×844) : 2530 ms depuis le premier octet
- Ouverture /offrir (390×844) : 2446 ms depuis le premier octet
- Ouverture /receptions (390×844) : 2476 ms depuis le premier octet
- Ouverture /reserver (390×844) : 2496 ms depuis le premier octet
- Bords de l’écran : 609 images d’intro, 25 de voile et 189 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Tient dans l'écran /infos-pratiques : aucune section épinglée ou plein écran.
- Tient dans l'écran /la-carte : aucune section épinglée ou plein écran.
- Tient dans l'écran /les-fetes : aucune section épinglée ou plein écran.
- Tient dans l'écran /offrir : aucune section épinglée ou plein écran.
- Tient dans l'écran /receptions : aucune section épinglée ou plein écran.
- Tient dans l'écran /reserver : aucune section épinglée ou plein écran.
- Fluidité /infos-pratiques 1366×768 (molette) : 0 % d'images lentes sur 220, tâche la plus longue 0 ms
- Fluidité /la-carte 1366×768 (molette) : 0 % d'images lentes sur 283, tâche la plus longue 0 ms
- Fluidité /les-fetes 1366×768 (molette) : 0 % d'images lentes sur 231, tâche la plus longue 0 ms
- Fluidité /offrir 1366×768 (molette) : 0 % d'images lentes sur 129, tâche la plus longue 0 ms
- Fluidité /receptions 1366×768 (molette) : 0 % d'images lentes sur 180, tâche la plus longue 0 ms
- Fluidité /reserver 1366×768 (molette) : 0 % d'images lentes sur 212, tâche la plus longue 0 ms
- Fluidité / 390×844 (doigt) : 1 % d'images lentes sur 868, tâche la plus longue 55 ms
- Fluidité /infos-pratiques 390×844 (doigt) : 0 % d'images lentes sur 1341, tâche la plus longue 0 ms
- Fluidité /la-carte 390×844 (doigt) : 0 % d'images lentes sur 1347, tâche la plus longue 0 ms
- Fluidité /les-fetes 390×844 (doigt) : 0 % d'images lentes sur 1419, tâche la plus longue 0 ms
- Fluidité /offrir 390×844 (doigt) : 0 % d'images lentes sur 1409, tâche la plus longue 0 ms
- Fluidité /receptions 390×844 (doigt) : 0 % d'images lentes sur 1341, tâche la plus longue 0 ms
- Fluidité /reserver 390×844 (doigt) : 0 % d'images lentes sur 1334, tâche la plus longue 0 ms
- Vitesse / : 0.75 s de calcul au chargement (téléphone ralenti).
- Vitesse /infos-pratiques : 0.38 s de calcul au chargement (téléphone ralenti).
- Vitesse /la-carte : 0.48 s de calcul au chargement (téléphone ralenti).
- Vitesse /les-fetes : 0.48 s de calcul au chargement (téléphone ralenti).
- Vitesse /offrir : 0.47 s de calcul au chargement (téléphone ralenti).
- Vitesse /receptions : 0.44 s de calcul au chargement (téléphone ralenti).
- Vitesse /reserver : 0.42 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --rapide --seulement=fichiers,mesures,films,parcours,fluidite
```
