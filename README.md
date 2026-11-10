# Les Jardins de l'Hacienda (2) · maquette « La table du soir »

Deuxième maquette du futur site des Jardins de l'Hacienda, restaurant et lieu de réception à Moineville (54), près de Metz.
Adresse prévue : https://jardins-hacienda-2-maquette.vercel.app. La maquette n'est pas reliée au site actuel.
Elle sert aussi de test réel aux 9 modules restaurant de la bibliothèque des maquettes : voir `_audit/modules-restau.md`.

## Les pages

| Page | Adresse | Ce qu'elle montre | Modules de la bibliothèque |
|---|---|---|---|
| Accueil | `/` | Intro à la cloche, plat fumant, « ouvert maintenant » sous les boutons, bandeau des plats, plateau du chef à faire tourner, le chef dresse le suprême de pintade, la cheminée en plein écran, les fêtes, les réceptions en carrousel 3D, offrir, venir | plat-fumant, assiette-qui-se-dresse, objet-a-faire-tourner, carrousel-3d, fil-conducteur |
| La carte | `/la-carte` | L'ardoise de saison, toute la carte avec prix, filtres végétarien et à partager, recherche | ardoise-a-la-craie, carte-du-restaurant |
| Les fêtes | `/les-fetes` | Noël (25 décembre au déjeuner, 79 €) et Saint-Sylvestre (120 €, 170 € avec l'accord mets et vins), comptes à rebours, accords, soirées passées | accords-mets-et-vins |
| Réserver | `/reserver` | Plan de la salle en 3D (indicatif), puis réservation préremplie avec la table choisie (simulée) ; accès direct au formulaire sans choisir de table | plan-de-salle, reservation-de-table, envol-vers-le-panier |
| Offrir | `/offrir` | Carte cadeau de 25 à 200 €, composée en direct, scellée dans son enveloppe (achat simulé) | carte-cadeau-qui-se-compose |
| Infos pratiques | `/infos-pratiques` | Le numéro en grand, les horaires avec « ouvert maintenant », l'accès, journées festives, piscine, bar, demande simulée | horaires-ouvert-maintenant |
| Page introuvable | `/404` | « Table introuvable » | |

## Direction : « La table du soir »

Fond fumée #15100c, nappe #f3e7d3, braise #d8622a, laiton #b8925a. Bodoni Moda (titres), Figtree (texte), Caveat (écriture à la main).
Grille wouahou : plateau du chef à faire tourner (accueil), intro où la cloche rejoint le plat, voile en forme de cloche (`formeVoile: "cloche"`, ajoutée dans `assets/js/socle/voile.js`), ficelle de cuisine dans la marge (fil conducteur), un titre « fabriqué » par page (signature, craie, encre dorée, carton manuscrit, prénom sur la carte, numéro imprimé), l'assiette qui se dresse (scène épinglée), le carton de table qui file vers la réservation et l'enveloppe scellée (retour physique).

## Mettre à jour le contenu

- Textes : `donnees/textes/fr.json`. Carte : `donnees/carte.json`. Ardoise : `donnees/ardoise.json` (à changer chaque semaine). Fêtes : `donnees/fetes.json` et `donnees/accords.json`. Horaires : `donnees/horaires.json`. Salle : `donnees/salle.json`. Réservation : `donnees/reservation.json`. Coordonnées : `donnees/site.json`.
- Puis `node outils/generer.mjs`, et les images de partage avec le pipeline de la bibliothèque (`node <bibliothèque>/images/partage.mjs`).
- Contrôle : `node _audit/audit.mjs` (standard), `--complet` pour la version finale.

## À fournir par l'établissement (à compléter)

- **Horaires d'ouverture** : ceux de la maquette viennent de l'annuaire RankEat (mis à jour le 1er novembre 2026) et sont à confirmer ; fermetures exceptionnelles, congés, horaires de la soirée du 31 décembre.
- **Mentions légales** : raison sociale, forme juridique, siège, SIRET, TVA, directeur de la publication ; hébergeur Vercel Inc. (adresse à vérifier sur vercel.com/legal) ; **politique de confidentialité**.
- **Allergènes** de chaque plat (information obligatoire) ; confirmation des plats végétariens (dhal, houmous).
- **Carte cadeau** : mode de remise (envoi, retrait), paiement en ligne ; la maquette dit « le restaurant vous dit comment la recevoir (mode de remise à confirmer) ».
- **Acomptes** des soirées (le site actuel indique encore « x € »).
- **Plan réel de la salle** (tables, places) : celui de la maquette est indicatif.
- **Adresse e-mail** de contact ; stationnement ; capacité.
- **Incohérences du site actuel à trancher** : le logo porte le numéro +33 609 386 764 (le site donne 06 18 21 28 10) ; la carte cadeau indique « 6 rue du Benelux · Chemin Valtier » (le site : 6 Vathier Haye) ; « Saison d'été jusqu'au 30/09/2024 » ; code postal 54000 dans une page.
- **Crédits photos** : photos du site actuel (dont « Le Studio » en filigrane sur certaines photos de réception) ; illustrations générées par IA (dossier `assets/images/grok/`).

## À retirer à la mise en ligne définitive

- La consigne noindex : balise robots dans `source/gabarits/commun.mjs` et en-tête X-Robots-Tag dans `vercel.json`.
- Les simulations : réservation (et ses complets simulés : `complets_simules` dans `donnees/reservation.json`), tables prises du plan, carte cadeau, formulaire de demande. Les brancher sur de vrais services (`envoyer`, `complet` des modules).
- Les mentions « à compléter », « à confirmer », « simulé » et la ligne « Maquette » du pied de page.

## À garder

- La mention « Illustration générée » sur les images créées par IA.
- La mention « L'abus d'alcool est dangereux pour la santé, à consommer avec modération. » près des vins.
- Les données structurées (`donnees/structure.json`) : uniquement des informations réelles.

## Points réglementaires à vérifier

- Allergènes : affichage ou mise à disposition obligatoire (règlement INCO n° 1169/2011, décret n° 2015-447).
- Mention « maison » (foie gras, chutney, purée) : le « fait maison » est encadré (décret n° 2015-505).
- Alcool : mention sanitaire (loi Évin) sur les pages qui présentent des vins.
