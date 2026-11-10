# Les Jardins de l'Hacienda (2) · maquette v5 « Deux saisons, une maison »

Deuxième maquette du futur site des Jardins de l'Hacienda, restaurant et lieu de réception à Moineville (54), près de Metz.
Adresse prévue : https://jardins-hacienda-2-maquette.vercel.app. La maquette n'est pas reliée au site actuel.
Elle sert aussi de test réel aux 9 modules restaurant de la bibliothèque des maquettes : voir `_audit/modules-restau.md`.

## Les pages

| Page | Adresse | Ce qu'elle montre | Modules de la bibliothèque |
|---|---|---|---|
| Accueil | `/` | En six sections (7 écrans d'ordinateur en 1440 × 900) : ouverture « Au coin du feu l'hiver, au bord de la piscine l'été » avec le cadran braise et soleil qui fait basculer tout le site, le plat fumant l'hiver ou la piscine et ses reflets l'été, « ouvert maintenant » sous les boutons ; le plateau du chef à lancer (vrais plats et prix) ; la table qui se dresse avec de vraies assiettes, qui finit en plongée dans l'assiette (ou dans la piscine l'été) vers la carte ; les rendez-vous de la saison (Noël et Saint-Sylvestre avec comptes à rebours, ou journées festives, piscine, bar et pool parties) ; « Combien serez-vous ? », la table qui s'agrandit de 2 à 120 couverts et l'espace qui convient ; offrir et venir | plat-fumant, objet-a-faire-tourner, assiette-qui-se-dresse |
| La carte | `/la-carte` | L'ardoise de saison écrite vite, prix d'abord ; toute la carte avec prix, filtres (les plats se réorganisent sous les yeux), recherche ; fin « Une table vous attend » avec le prochain service | ardoise-a-la-craie, carte-du-restaurant |
| Les fêtes | `/les-fetes` | Noël (25 décembre au déjeuner, 79 €) révélé plat par plat sous les cloches ; Saint-Sylvestre (120 €, 170 € avec l'accord mets et vins) et le verre des accords ; comptes à rebours ; soirées passées « A eu lieu » | accords-mets-et-vins |
| Réserver | `/reserver` | Le jour, le service, l'heure et les couverts d'abord ; « Choisir ma table » ensuite, facultatif, sur le plan 3D (indicatif ; liste des tables puis plan agrandissable sur téléphone) ; à l'envoi, la carte de placement « Réservé · jour · heure · couverts » passe sous la cloche (réservation simulée) | plan-de-salle, reservation-de-table, envol-vers-le-panier |
| Offrir | `/offrir` | Carte cadeau de 25 à 200 €, composée en direct, scellée dans son enveloppe ; « Carte prête, à remettre à … », « Offrir une autre carte » ; remise : « appelez-nous au 06 18 21 28 10 » (achat simulé) | carte-cadeau-qui-se-compose |
| Infos pratiques | `/infos-pratiques` | Le numéro en grand, le cadran des horaires à manipuler (« Samedi à 20 h : ouvert »), l'accès, journées festives, piscine, bar ; demande de réception préremplie depuis l'accueil (`?sujet=reception&invites=40`) | horaires-ouvert-maintenant |
| Page introuvable | `/404` | « Table introuvable » | |

## Direction : « Deux saisons, une maison »

Le vrai slogan du lieu devient le moteur du site. Un cadran braise et soleil (ouverture de l'accueil) et un petit bouton flamme ou soleil (en-tête de toutes les pages) font basculer la maison : lumière et couleurs, photos, accroche, rendez-vous mis en avant, libellé du bouton principal (« Réserver au coin du feu » ou « Réserver en terrasse »).
- Par défaut, la saison réelle à Paris (mai à septembre : l'été ; sinon l'hiver), décidée avant l'affichage (`source/critique/critique.js`) ; le choix du visiteur est gardé dans son navigateur (`localStorage`, clé `jh-saison`, lecture et écriture dans un try/catch). Sans JavaScript et en mode calme : la saison du jour de la génération, complète.
- v5 : la bascule part du geste en vague de lumière ; l'été, l'en-tête, la barre du bas et le pied de page passent au bleu nuit, et La carte, Réserver et Offrir prennent leur photo d'été. « Réceptions » est dans le menu (lien vers « Combien serez-vous ? » de l'accueil).
- Ce qui relie les pages : la lueur de la saison au bord de chaque section (braise qui monte l'hiver, reflet d'eau l'été), à la place de la ficelle de la v3.
- Familles d'effets de l'accueil : ambiance qui change (signature), plongée, recomposition (table qui s'agrandit, carte filtrée), particules (braises, vapeur, reflets).
- Palette : fumée #15100c, braise #d8622a, laiton #b8925a, nappe #f3e7d3 ; l'été, eau #2c7f8f et soleil #f2b33d. Bodoni Moda (titres), Figtree (texte), Caveat (écriture à la main).
- Gardés de la v3 : la cloche de l'intro et du voile, le plat fumant, le plateau qu'on lance, le plan de salle qui préremplit la réservation, l'enveloppe scellée de la carte cadeau, le verre des accords.

## Mettre à jour le contenu

- Textes : `donnees/textes/fr.json`. Carte : `donnees/carte.json`. Ardoise : `donnees/ardoise.json` (à changer chaque semaine). Fêtes : `donnees/fetes.json` et `donnees/accords.json`. Horaires : `donnees/horaires.json`. Salle : `donnees/salle.json`. Réservation : `donnees/reservation.json`. Coordonnées : `donnees/site.json`.
- Puis `node outils/generer.mjs`, et les images de partage avec le pipeline de la bibliothèque (`node <bibliothèque>/images/partage.mjs`).
- Contrôle : `node _audit/audit.mjs` (standard), `--complet` pour la version finale.

## À fournir par l'établissement (à compléter)

- **Horaires d'ouverture** : ceux de la maquette viennent de l'annuaire RankEat (relevés le 1er novembre 2026), à confirmer ; fermetures exceptionnelles et congés ; horaires de la soirée du 31 décembre.
- **Mentions légales** : raison sociale, forme juridique, siège, SIRET, TVA, directeur de la publication ; hébergeur Vercel Inc. (adresse à vérifier sur vercel.com/legal) ; **politique de confidentialité**.
- **Allergènes** de chaque plat (information obligatoire) ; confirmation des plats végétariens (dhal, houmous).
- **Carte cadeau** : paiement en ligne et envoi éventuels (la maquette dit seulement d'appeler pour la recevoir).
- **Acomptes** des soirées (le site actuel indique encore « x € »).
- **Plan réel de la salle** (tables, places) : celui de la maquette est indicatif ; **capacités** de chaque espace (salle, terrasse, jardins, pergola).
- **Adresse e-mail** de contact ; stationnement.
- **Pool parties** : dates de l'été 2027.
- **Incohérences du site actuel à trancher** : le logo porte le numéro +33 609 386 764 (le site donne 06 18 21 28 10) ; la carte cadeau indique « 6 rue du Benelux · Chemin Valtier » (le site : 6 Vathier Haye) ; « Saison d'été jusqu'au 30/09/2024 » ; code postal 54000 dans une page.
- **Crédits photos** : photos du site actuel (dont « Le Studio » en filigrane sur certaines photos de réception) ; illustrations générées par IA (dossier `assets/images/grok/`).

## Faits retirés ou dits autrement (v4 : aucun « à compléter » hors du pied de page)

| Sujet | v3 | v4 |
|---|---|---|
| Stationnement | « à compléter » | retiré (aucune information dans le relevé) |
| Fermetures exceptionnelles | « à compléter » | retiré ; sous les horaires : « Horaires relevés le 1er novembre 2026 ; pour une date précise, appelez le restaurant. » |
| Horaires de la soirée (fêtes) | « à compléter » | « Horaires de la soirée donnés à la réservation. » |
| Montant de l'acompte | « à compléter » | « le restaurant vous en donne le montant à la réservation » |
| Remise de la carte cadeau | « Mode de remise (envoi, retrait) : à compléter » | « Pour la recevoir, appelez-nous au 06 18 21 28 10. » |
| Allergènes | « liste à compléter par le restaurant » | « Informations sur les allergènes disponibles sur demande » |
| Capacité des espaces (Recevoir) | — | aucun chiffre par espace ; « Le restaurant confirme avec vous la capacité de chaque espace. » (les paliers 2, 12, 40, 120 sont les tailles de groupe du visiteur, pas des capacités) |
| Saint-Sylvestre, premier plat | « Bouchée gourmande » | « Amuse-bouche » (relevé) ; les autres libellés du menu (« Éclats de truffe noire », « Filet de bœuf d'exception »…) sont ceux de l'affiche du restaurant (`recu/saint-sylvestre.jpg`) |
| Le Grand Buffet (soirées passées) | « Dimanches 16, 23 et 30 août 2026 » | « Les dimanches d'août 2026 » (relevé) |
| Villes voisines | Metz, Thionville, Luxembourg, Nancy | Metz, Thionville et Luxembourg (le site actuel ne cite pas Nancy) |
| Temps de trajet (Venir) | — | aucun ; seulement « entre Metz, Thionville et le Luxembourg » |
| Politique de confidentialité dans les formulaires | « à compléter » | retirée des formulaires (reste dans le pied de page) |

Deux illustrations Grok de la v4, avec la mention « Illustration générée » : la nappe de lin sous les assiettes (`grok/nappe-lin`) et l'eau de la piscine derrière les rendez-vous de l'été (`grok/eau-reflets`). La plongée, elle, se fait dans de vraies photos (l'assiette aux cèpes, la piscine illuminée).

## Réservation : la soirée du 31 décembre

Le restaurant est fermé le jeudi soir, sauf le 31 décembre (Saint-Sylvestre). `donnees/reservation.json` le dit par `ouvertures_exceptionnelles` ; comme le module ne connaît pas encore ce réglage (M27 dans `_audit/modules-restau.md`), `site.js` rouvre le jeudi soir pour cette date seulement et affiche les autres jeudis soir « complet » dans la maquette.

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
