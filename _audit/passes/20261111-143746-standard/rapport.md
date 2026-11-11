# Rapport d’audit

Projet : `jardins-hacienda-2-maquette` · 11/11/2026 15:52:46 · 15 min · 8 page(s) · audit standard

## Résumé

- Statut : **59 échec(s)**
- Passe : `20261111-143746-standard` · version ?v=7
- Échecs : **59**
- À regarder : **11**
- Non lancé : **9**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (6), mesures (112), balayage (7), films d’ouverture (14), films de transition (14), bords de l’écran (8), intro accélérable et passable (7), menu (1), clavier (8), liens et boutons (8), liens profonds (16), liens vers la page en cours (7), changements de hauteur (6)

## Grille wouahou

| Point | État | Détail |
|---|---|---|
| 1. L’effet signature se manipule | ✓ présent | accueil |
| 2. L’intro devient la page | ✗ absent | sans objet d’ouverture : /la-carte |
| 3. La transition reprend le motif | ✓ présent | voile en cloche |
| 4. Quelque chose relie les sections et les pages | ✓ présent | sur les 7 page(s) |
| 5. Un titre fait l’événement sur chaque page | ✓ présent | sur les 7 page(s) |
| 6. La scène est un geste du métier | ✓ présent | geste du métier sur /, /la-carte |
| 7. L’action principale a un retour physique | ✓ présent | sur /, /les-fetes, /offrir, /receptions, /reserver |

Le script vérifie les marques (`data-grille`, `data-iris-centre`, forme du voile, `versObjet`) ; la force et la justesse de chaque point se jugent sur les captures et les films.

## Échecs

### grille : objet d’ouverture absent (points 2 et 3) (1)

- **grille : objet d’ouverture absent (points 2 et 3)** — `/la-carte` — aucun élément data-iris-centre : l’intro et le voile s’ouvrent alors depuis le centre de l’écran, pas depuis l’objet de la page

### texte sous 12 px (14)

- **texte sous 12 px** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — 10.5 px _(768×1024 normal, 390×844 normal, 320×568 normal, 844×390 normal, 390×844 calme, 1366×768 normal, +8)_
- **texte sous 12 px** — `/` — div.terrasse__cadre > div.terrasse__images:nth-of-type(1) > figure.media.terrasse__img:nth-of-type(1) > figcaption.mention-ia « Illustration générée » — 10.5 px _(768×1024 normal, 390×844 normal, 320×568 normal, 844×390 normal, 1366×768 normal, 1920×1080 normal, +2)_
- **texte sous 12 px** — `/` — section#feu > div.feu__cadre > figure.media.feu__photo > figcaption.mention-ia « Illustration générée » — 10.5 px _(768×1024 normal, 390×844 normal, 320×568 normal, 844×390 normal, 390×844 calme, 1366×768 normal, +8)_
- **texte sous 12 px** — `/` — div.terrasse__cadre > div.terrasse__images:nth-of-type(1) > figure.media.terrasse__img:nth-of-type(3) > figcaption.mention-ia « Illustration générée » — 10.5 px _(390×844 calme, 390×844 sansJs, 1366×768 calme, 1366×768 sansJs, 320×568 sansJs, 844×390 calme)_
- **texte sous 12 px** — `/infos-pratiques` — div.conteneur.acces__grille > div > svg.acces__carte > text.carte__pays:nth-of-type(1) — 10.0 px _(390×844 normal, 320×568 normal, 768×1024 normal, 844×390 normal, 1366×768 normal, 390×844 calme, +8)_
- **texte sous 12 px** — `/infos-pratiques` — div.conteneur.acces__grille > div > svg.acces__carte > text.carte__pays:nth-of-type(2) — 10.0 px _(390×844 normal, 320×568 normal, 768×1024 normal, 844×390 normal, 1366×768 normal, 390×844 calme, +8)_
- **texte sous 12 px** — `/infos-pratiques` — div.conteneur.acces__grille > div > svg.acces__carte > text.carte__pays:nth-of-type(3) — 10.0 px _(390×844 normal, 320×568 normal, 768×1024 normal, 844×390 normal, 1366×768 normal, 390×844 calme, +8)_
- **texte sous 12 px** — `/infos-pratiques` — div.conteneur.acces__grille > div > svg.acces__carte > text.carte__eau:nth-of-type(4) — 11.0 px _(390×844 normal, 320×568 normal, 768×1024 normal, 844×390 normal, 1366×768 normal, 390×844 calme, +8)_
- **texte sous 12 px** — `/infos-pratiques` — div.conteneur.acces__grille > div > svg.acces__carte > text.carte__a31:nth-of-type(5) — 11.0 px _(390×844 normal, 320×568 normal, 768×1024 normal, 844×390 normal, 1366×768 normal, 390×844 calme, +8)_
- **texte sous 12 px** — `/infos-pratiques` — div.conteneur.acces__grille > div > svg.acces__carte > text.carte__note:nth-of-type(13) — 10.0 px _(390×844 normal, 320×568 normal, 768×1024 normal, 844×390 normal, 1366×768 normal, 390×844 calme, +8)_
- **texte sous 12 px** — `/la-carte` — section#passe > div.assiette__cadre.socle-cadre > div.assiette__scene:nth-of-type(2) > span.mention-ia.passe__mention « Dressage dessiné d’après la carte » — 10.5 px _(390×844 normal, 320×568 normal, 768×1024 normal, 844×390 normal, 1366×768 normal, 390×844 calme, +8)_
- **texte sous 12 px** — `/les-fetes` — section#debut > div.givre__fond:nth-of-type(1) > figure.media.ouv-fetes__fond:nth-of-type(1) > figcaption.mention-ia « Illustration générée » — 10.5 px _(390×844 normal, 320×568 normal, 844×390 normal, 768×1024 normal, 1366×768 normal, 1920×1080 normal, +8)_
- **texte sous 12 px** — `/offrir` — section#debut > figure.media.ouv-offrir__fond > figcaption.mention-ia « Illustration générée » — 10.5 px _(320×568 normal, 390×844 normal, 768×1024 normal, 844×390 normal, 1366×768 normal, 390×844 calme, +8)_
- **texte sous 12 px** — `/reserver` — section#debut > div.ouv-resa__photo:nth-of-type(1) > figure.media.ouv-resa__img:nth-of-type(2) > figcaption.mention-ia « Illustration générée » — 10.5 px _(390×844 sansJs, 1366×768 sansJs, 320×568 sansJs)_

### texte coupé (7)

- **texte coupé** — `/` — li#bar > div.lieu__texte > p.lieu__heure:nth-of-type(1) « Dès 15 h 30 » — coupé par section#apres-midi > div.panorama__cadre « 12 h – 19 h Les journées festives Du mardi au jeud » _(768×1024 normal)_
- **texte coupé** — `/` — li#bar > div.lieu__texte > h3 « Le bar » — coupé par section#apres-midi > div.panorama__cadre « 12 h – 19 h Les journées festives Du mardi au jeud » _(768×1024 normal)_
- **texte coupé** — `/` — li#bar > div.lieu__texte > p:nth-of-type(2) « Dès 15 h 30 les journées festives, avec droit d'en » — coupé par section#apres-midi > div.panorama__cadre « 12 h – 19 h Les journées festives Du mardi au jeud » _(768×1024 normal)_
- **texte coupé** — `/` — li#journees-festives > div.lieu__texte > p.lieu__heure:nth-of-type(1) « 12 h – 19 h » — coupé par section#apres-midi > div.panorama__cadre « 12 h – 19 h Les journées festives Du mardi au jeud » _(390×844 normal, 390×844 sansWebgl)_
- **texte coupé** — `/` — li#journees-festives > div.lieu__texte > h3 « Les journées festives » — coupé par section#apres-midi > div.panorama__cadre « 12 h – 19 h Les journées festives Du mardi au jeud » _(390×844 normal, 320×568 normal, 390×844 sansWebgl)_
- **texte coupé** — `/` — li#journees-festives > div.lieu__texte > p:nth-of-type(2) « Du mardi au jeudi, de 12 h à 19 h, de juin à septe » — coupé par section#apres-midi > div.panorama__cadre « 12 h – 19 h Les journées festives Du mardi au jeud » _(390×844 normal, 320×568 normal, 390×844 sansWebgl)_
- **texte coupé** — `/infos-pratiques` — div.fpe__progression:nth-of-type(1) > ol.fpe__reperes > li.fpe__repere:nth-of-type(3) > span.fpe__nom:nth-of-type(2) « Coordonnées » — le contenu dépasse de son cadre _(768×1024 normal, 844×390 normal, 844×390 calme)_

### contraste insuffisant (9)

- **contraste insuffisant** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » — 3.57:1 (minimum 4.5:1) _(768×1024 normal, 390×844 normal, 320×568 normal, 844×390 normal, 390×844 calme, 1366×768 normal, +8)_
- **contraste insuffisant** — `/` — div.terrasse__cadre > div.terrasse__images:nth-of-type(1) > figure.media.terrasse__img:nth-of-type(1) > figcaption.mention-ia « Illustration générée » — 3.57:1 (minimum 4.5:1) _(768×1024 normal, 390×844 normal, 320×568 normal, 844×390 normal, 1366×768 normal, 1920×1080 normal, +2)_
- **contraste insuffisant** — `/` — section#feu > div.feu__cadre > figure.media.feu__photo > figcaption.mention-ia « Illustration générée » — 3.57:1 (minimum 4.5:1) _(768×1024 normal, 390×844 normal, 320×568 normal, 844×390 normal, 390×844 calme, 1366×768 normal, +8)_
- **contraste insuffisant** — `/` — div.terrasse__cadre > div.terrasse__images:nth-of-type(1) > figure.media.terrasse__img:nth-of-type(3) > figcaption.mention-ia « Illustration générée » — 3.57:1 (minimum 4.5:1) _(390×844 calme, 390×844 sansJs, 1366×768 calme, 1366×768 sansJs, 320×568 sansJs, 844×390 calme)_
- **contraste insuffisant** — `/infos-pratiques` — div.horaires__grille > div.horaires__texte:nth-of-type(2) > div.horaires__essai:nth-of-type(2) > p.horaires__essai-reponse:nth-of-type(2) « Aujourd’hui à 15 h 45 : fermé » — 2.21:1 (minimum 4.5:1) _(390×844 normal, 320×568 normal, 768×1024 normal, 844×390 normal, 1366×768 normal, 1920×1080 normal, +2)_
- **contraste insuffisant** — `/infos-pratiques` — section#debut > div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.surtitre:nth-of-type(1) « INFOS PRATIQUES » — 1.02:1 (minimum 4.5:1) _(390×844 sansJs, 1366×768 sansJs)_
- **contraste insuffisant** — `/infos-pratiques` — h1#infos-h1 « Horaires, accès et contact » — 1.02:1 (minimum 3:1) _(390×844 sansJs, 1366×768 sansJs, 320×568 sansJs)_
- **contraste insuffisant** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.statut.ouv-infos__statut:nth-of-type(3) > span:nth-of-type(2) « Horaires » — 1.02:1 (minimum 4.5:1) _(390×844 sansJs, 1366×768 sansJs, 320×568 sansJs)_
- **contraste insuffisant** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.ouv-infos__actions:nth-of-type(4) > span.ouv-infos__adresse « 6 Vathier Haye, 54580 Moineville » — 1.02:1 (minimum 4.5:1) _(390×844 sansJs, 1366×768 sansJs, 320×568 sansJs)_

### section sans visuel (5)

- **section sans visuel** — `/` — section#minuit « 00:00 MINUIT, AU COIN DU FEU Offrir un moment, de  » _(768×1024 normal, 390×844 normal, 320×568 normal, 844×390 normal, 390×844 calme, 1366×768 normal, +8)_
- **section sans visuel** — `/la-carte` — section#debut « 12:30 LE DÉJEUNER La carte de la semaine À midi, s » _(390×844 normal, 320×568 normal, 768×1024 normal, 1366×768 normal, 390×844 calme, 390×844 sansJs, +6)_
- **section sans visuel** — `/la-carte` — section#debut « 12:30 LE DÉJEUNER La carte de la semaine Entrées d » _(844×390 normal, 844×390 calme)_
- **section sans visuel** — `/les-fetes` — section#dates « CET HIVER Les prochaines dates Prochaine date : So » _(390×844 normal, 320×568 normal, 844×390 normal, 768×1024 normal, 1366×768 normal, 1920×1080 normal, +5)_
- **section sans visuel** — `/les-fetes` — section#dates « CET HIVER Les prochaines dates Soirée côte de bœuf » _(390×844 sansJs, 1366×768 sansJs, 320×568 sansJs)_

### mention « Illustration générée » trop petite (7)

- **mention « Illustration générée » trop petite** — `/` — section#midi > div.midi__eau:nth-of-type(1) > figure.media.midi__photo > figcaption.mention-ia « Illustration générée » _(768×1024 normal, 390×844 normal, 320×568 normal, 844×390 normal, 390×844 calme, 1366×768 normal, +8)_
- **mention « Illustration générée » trop petite** — `/` — div.terrasse__cadre > div.terrasse__images:nth-of-type(1) > figure.media.terrasse__img:nth-of-type(1) > figcaption.mention-ia « Illustration générée » _(768×1024 normal, 390×844 normal, 320×568 normal, 844×390 normal, 1366×768 normal, 1920×1080 normal, +2)_
- **mention « Illustration générée » trop petite** — `/` — section#feu > div.feu__cadre > figure.media.feu__photo > figcaption.mention-ia « Illustration générée » _(768×1024 normal, 390×844 normal, 320×568 normal, 844×390 normal, 390×844 calme, 1366×768 normal, +8)_
- **mention « Illustration générée » trop petite** — `/` — div.terrasse__cadre > div.terrasse__images:nth-of-type(1) > figure.media.terrasse__img:nth-of-type(3) > figcaption.mention-ia « Illustration générée » _(390×844 calme, 390×844 sansJs, 1366×768 calme, 1366×768 sansJs, 320×568 sansJs, 844×390 calme)_
- **mention « Illustration générée » trop petite** — `/les-fetes` — section#debut > div.givre__fond:nth-of-type(1) > figure.media.ouv-fetes__fond:nth-of-type(1) > figcaption.mention-ia « Illustration générée » _(390×844 normal, 320×568 normal, 844×390 normal, 768×1024 normal, 1366×768 normal, 1920×1080 normal, +8)_
- **mention « Illustration générée » trop petite** — `/offrir` — section#debut > figure.media.ouv-offrir__fond > figcaption.mention-ia « Illustration générée » _(320×568 normal, 390×844 normal, 768×1024 normal, 844×390 normal, 1366×768 normal, 390×844 calme, +8)_
- **mention « Illustration générée » trop petite** — `/reserver` — section#debut > div.ouv-resa__photo:nth-of-type(1) > figure.media.ouv-resa__img:nth-of-type(2) > figcaption.mention-ia « Illustration générée » _(390×844 sansJs, 1366×768 sansJs, 320×568 sansJs)_

### textes qui se chevauchent (7)

- **textes qui se chevauchent** — `/infos-pratiques` — div.fpe__progression:nth-of-type(1) > ol.fpe__reperes > li.fpe__repere:nth-of-type(3) > span.fpe__nom:nth-of-type(2) « Coordonnées » — avec div.fpe__progression:nth-of-type(1) > ol.fpe__reperes > li.fpe__repere:nth-of-type(4) > span.fpe__num:nth-of-type(1) « 4 » _(768×1024 normal)_
- **textes qui se chevauchent** — `/la-carte` — div.ardoise.est-craie > div.ardoise__surface > p.ardoise__date:nth-of-type(1) > span « Cette semaine » — avec div.ardoise.est-craie > div.ardoise__surface > h2.ardoise__titre > span « Ce midi, à la carte » _(768×1024 normal, 844×390 normal, 1366×768 normal, 1920×1080 normal, 1366×768 sansWebgl)_
- **textes qui se chevauchent** — `/la-carte` — div.ardoise > div.ardoise__surface > p.ardoise__date:nth-of-type(1) > span « Cette semaine » — avec div.ardoise > div.ardoise__surface > h2.ardoise__titre > span « Ce midi, à la carte » _(1366×768 sansJs, 1366×768 calme, 844×390 calme)_
- **textes qui se chevauchent** — `/les-fetes` — div.d3d__depliant:nth-of-type(2) > article.d3d__volet:nth-of-type(3) > span.d3d__verso.noel__couverture > span.d3d__num:nth-of-type(1) « VENDREDI 25 DÉCEMBRE, AU DÉJEUNER » — avec div.d3d__cadre.socle-cadre > div.d3d__depliant:nth-of-type(2) > article.d3d__volet:nth-of-type(3) > p.noel__prix:nth-of-type(2) « 79 € par personne, hors boissons » _(844×390 normal)_
- **textes qui se chevauchent** — `/les-fetes` — div.d3d__depliant:nth-of-type(2) > article.d3d__volet:nth-of-type(3) > span.d3d__verso.noel__couverture > strong « Le menu de Noël » — avec div.d3d__depliant:nth-of-type(2) > article.d3d__volet:nth-of-type(3) > p.noel__actions:nth-of-type(3) > a.bouton « Réserver le déjeuner de Noël » _(844×390 normal)_
- **textes qui se chevauchent** — `/les-fetes` — div.d3d__depliant:nth-of-type(2) > article.d3d__volet:nth-of-type(3) > span.d3d__verso.noel__couverture > span.noel__couv-prix:nth-of-type(2) « 79 € par personne, hors boissons » — avec div.d3d__depliant:nth-of-type(2) > article.d3d__volet:nth-of-type(3) > p.noel__actions:nth-of-type(3) > a.bouton « Réserver le déjeuner de Noël » _(844×390 normal)_
- **textes qui se chevauchent** — `/les-fetes` — div.d3d__depliant:nth-of-type(2) > article.d3d__volet:nth-of-type(3) > span.d3d__verso.noel__couverture > span.noel__couv-prix:nth-of-type(2) « 79 € par personne, hors boissons » — avec div.d3d__cadre.socle-cadre > div.d3d__depliant:nth-of-type(2) > article.d3d__volet:nth-of-type(3) > p.noel__acompte:nth-of-type(4) « Un acompte par couvert peut être demandé pour les  » _(844×390 normal)_

### accessibilité (axe) : color-contrast (1)

- **accessibilité (axe) : color-contrast** — `/infos-pratiques` — a[data-action-principale=""] — Elements must meet minimum color contrast ratio thresholds _(390×844 calme, 1366×768 calme)_

### contraste sur image (4)

- **contraste sur image** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu:nth-of-type(4) > p.heure-geante.ouv-fetes__geant:nth-of-type(1) > span:nth-of-type(1) « J-50 » — 1.17:1 sur les 10 % de la photo les moins favorables (minimum 3:1) _(1366×768 normal)_
- **contraste sur image** — `/les-fetes` — section#debut > div.conteneur.ouv-fetes__contenu:nth-of-type(4) > p.surtitre:nth-of-type(2) > span:nth-of-type(1) « CET HIVER » — 2.60:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1) _(1366×768 normal)_
- **contraste sur image** — `/les-fetes` — h1#fetes-h1 > span:nth-of-type(1) « Les fêtes au coin du feu » — 2.83:1 sur les 10 % de la photo les moins favorables (minimum 3:1) _(1366×768 normal)_
- **contraste sur image** — `/receptions` — section#debut > div.conteneur.ouv-recep__contenu > p.heure-geante.heure-geante--nuit:nth-of-type(1) « 19:00 » — 2.89:1 sur les 10 % de la photo les moins favorables (minimum 3:1) _(1366×768 normal)_

### premier écran : information clé hors de l’écran (1)

- **premier écran : information clé hors de l’écran** — `/offrir` — div.conteneur.ouv-offrir__grille > div.ouv-offrir__texte:nth-of-type(1) > p.ouv-offrir__actions:nth-of-type(4) > span.ouv-offrir__info « De 25 à 200 € · valable 6 mois » _(320×568 normal, 320×568 sansJs)_

### transition : élément qui apparaît puis disparaît (1)

- **transition : élément qui apparaît puis disparaît** — `/la-carte → /receptions` — main#contenu > div.rdl > button.rdl__passer.socle-bouton « Passer l’ouverture » _(1366×768 film, 390×844 film)_

### lien profond (2)

- **lien profond** — `/ → /les-fetes#saint-sylvestre` — section pas en haut de l'écran (553 px) _(1366×768 lien profond)_
- **lien profond** — `/reserver → /infos-pratiques#acces` — section pas en haut de l'écran (298 px) _(1366×768 lien profond)_

## À regarder

### clearProps « all » (2)

- **clearProps « all »** — assets/js/modules/formulaire-par-etapes/module.js : efface aussi les variables CSS posées dans le HTML ; nommer les propriétés (clearProps: 'transform,opacity')
- **clearProps « all »** — assets/js/modules/rideau-en-lanieres/module.js : efface aussi les variables CSS posées dans le HTML ; nommer les propriétés (clearProps: 'transform,opacity')

### journal du projet (1)

- **journal du projet** — aucune entrée pour la version 7 de donnees/site.json

### contraste sur image (6)

- **contraste sur image** — `/infos-pratiques` — section#debut > div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.surtitre:nth-of-type(1) « INFOS PRATIQUES » — 4.37:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(390×844 normal)_
- **contraste sur image** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.ouv-infos__ilest:nth-of-type(2) > span.heure-geante.ouv-infos__heure:nth-of-type(2) « 15:38 » — 1.40:1 sur les 10 % de la photo les moins favorables (minimum 3:1), ombre portée à vérifier _(390×844 normal)_
- **contraste sur image** — `/infos-pratiques` — section#debut > div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.surtitre:nth-of-type(1) « INFOS PRATIQUES » — 4.44:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(1366×768 normal)_
- **contraste sur image** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.ouv-infos__ilest:nth-of-type(2) > span.heure-geante.ouv-infos__heure:nth-of-type(2) « 15:38 » — 1.44:1 sur les 10 % de la photo les moins favorables (minimum 3:1), ombre portée à vérifier _(1366×768 normal)_
- **contraste sur image** — `/infos-pratiques` — div.ced__cadre.conteneur:nth-of-type(2) > div.ced__texte.ouv-infos__contenu:nth-of-type(1) > p.ouv-infos__actions:nth-of-type(4) > span.ouv-infos__adresse « 6 Vathier Haye, 54580 Moineville » — 1.05:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(1366×768 normal)_
- **contraste sur image** — `/la-carte` — div.ardoise.est-craie > div.ardoise__surface > p.ardoise__date:nth-of-type(1) > span « Cette semaine » — 4.14:1 sur les 10 % de la photo les moins favorables (minimum 4.5:1), ombre portée à vérifier _(390×844 normal)_

### typographie française (1)

- **typographie française** — `/les-fetes` — section#dates > div.conteneur > div.agd__tete:nth-of-type(1) > p.agd__prochaine:nth-of-type(2) « Prochaine date : Soirée côte de bœuf, dans 9 jours » — espace insécable manquante avant ou après « : » _(1366×768 normal)_

### rechargement au milieu de la page (1)

- **rechargement au milieu de la page** — `/la-carte` — écran différent à la même position après rechargement (70.8 %), voir comparaisons/rechargement-la-carte-*.png _(1366×768)_

## Non lancé

- **parcours:hauteur** : browserContext.close: Protocol error (Target.disposeBrowserContext): Failed to find context with id BCAAFC6E17D3164EB7BC463E77259095
- **parcours:calme** : browser.newContext: Target page, context or browser has been closed
- **parcours:projet** : browser.newContext: Target page, context or browser has been closed
- **ecran** : browser.newContext: Target page, context or browser has been closed
- **fluidite** : browser.newContext: Target page, context or browser has been closed
- **mouvement** : browser.newContext: Target page, context or browser has been closed
- **vitesse** : browser.newContext: Target page, context or browser has been closed
- **captures** : browser.newContext: Target page, context or browser has been closed
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
- Ouverture / (1366×768) : 2583 ms depuis le premier octet
- Ouverture /infos-pratiques (1366×768) : 2523 ms depuis le premier octet
- Ouverture /la-carte (1366×768) : 2509 ms depuis le premier octet
- Ouverture /les-fetes (1366×768) : 2501 ms depuis le premier octet
- Ouverture /offrir (1366×768) : 2497 ms depuis le premier octet
- Ouverture /receptions (1366×768) : 2534 ms depuis le premier octet
- Ouverture /reserver (1366×768) : 2477 ms depuis le premier octet
- Ouverture / (390×844) : 2557 ms depuis le premier octet
- Ouverture /infos-pratiques (390×844) : 2480 ms depuis le premier octet
- Ouverture /la-carte (390×844) : 2503 ms depuis le premier octet
- Ouverture /les-fetes (390×844) : 2502 ms depuis le premier octet
- Ouverture /offrir (390×844) : 2495 ms depuis le premier octet
- Ouverture /receptions (390×844) : 2502 ms depuis le premier octet
- Ouverture /reserver (390×844) : 2493 ms depuis le premier octet
- bords de l’écran /la-carte 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- bords de l’écran /les-fetes 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- bords de l’écran /offrir 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Bords de l’écran : 530 images d’intro, 18 de voile et 214 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --seulement=fichiers,grille,mesures,films,parcours,ecran,fluidite,mouvement,vitesse,captures
```
