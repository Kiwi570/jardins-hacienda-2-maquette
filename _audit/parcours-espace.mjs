/* Parcours de l'espace restaurateur (v7.7.0). L'audit général ne voit que l'écran de connexion de /espace : ce
   parcours entre dans l'espace.
   1. Réserver sur le site, puis confirmer dans l'espace : la demande arrive « Depuis le site », se confirme d'un
      geste, « Annuler » la remet en attente, « Complet » ferme le service sur la page Réserver, « Tout remettre comme
      livré » efface tout et s'annule.
   1 bis (v7.7.1). La barre « Que voulez-vous faire ? » : « fermer samedi soir » ferme le service et s'annule,
      « ajouter une soirée raclette le 12 » ouvre le billet créé, un exemple touché remplit le champ sans rien lancer,
      Échap rend le focus ; puis la petite fête quand la dernière demande a sa réponse.
   1 ter (v7.7.2). Tout arrive ici : la demande de réception, la commande traiteur, la carte cadeau et la question
      faites sur le site arrivent dans « Demandes » ; une demande faite dans un autre onglet s'affiche en direct, « Voir »
      l'ouvre ; une réception avance d'étape et s'annule ; le message au client suit le modèle retouché.
   1 quater (v7.7.3). La carte en main : « Épuisé aujourd'hui » se voit sur la carte du site ; un prix et des allergènes
      modifiés aussi ; un plat ajouté apparaît en fin de rubrique ; la barre comprend « épuisé : foie gras ».
   1 quinquies (v7.7.4). L'espace vous propose : un service presque plein est signalé, « Dire complet » le règle et
      s'annule, « Plus tard » fait taire la suggestion ; le bilan de la semaine compte comme son tableau ; la fenêtre
      « Sur l'écran d'accueil » s'ouvre et se ferme à Échap.
   1 sexies (v7.7.5). Le service : une réservation notée au téléphone apparaît dans la frise, ses couverts comptent
      dans le résumé et le coup de feu ; « Modifier » change les couverts et la note, et s'annule ; « Annuler la
      réservation » (ou « Absent » le jour même) retire ses couverts, « Remettre » les rend ; la feuille de service
      s'imprime avec elle ; la barre comprend « feuille de service ».
   1 septies (v7.7.6). Le plan de salle et la fiche client : une réservation touchée puis la table proposée, elle y
      est assise, « Annuler » la relève ; « Placer tout seul » assoit tout le monde sans deux tablées à la même table ;
      la table dit qui s'y assoit, « Retirer de la table » la libère ; la fiche client s'ouvre au nom, « Habitué » et
      une allergie s'y notent, se voient sur la réservation et sur la feuille de service ; Échap rend le focus.
   1 octies (v7.8.0, lot A). La cohérence : les mêmes règles pour le site et l'équipe. Une ouverture déplacée à 13 h ne
      laisse plus proposer midi sur Réserver ; la Saint-Sylvestre reste ouverte quand les horaires changent ; un mardi
      ouvert exceptionnellement depuis l'agenda se réserve sur le site ; la barre refuse une table un jour fermé, une date
      qui n'existe pas, et demande l'heure quand elle n'est pas une arrivée, sans rien valider d'office ; deux onglets :
      « Annuler » ne défait que son propre geste ; deux champs saisis coup sur coup sont tous deux enregistrés ; un
      enregistrement refusé par le navigateur le dit et ne confirme rien.
   1 decies (v7.10.0). Toute la maison au même endroit : la navigation, Aujourd'hui (priorité, compteurs), une demande,
   la fiche client, le service, le briefing, les tâches (créées, liées, terminées, retrouvées après rechargement), la
   recherche, Offres et Site, l'aperçu des vues métier ; sur ordinateur et sur téléphone.
   1 septdecies (v7.14.1). Des démonstrations isolées, une préparation fiable : un panier normal, un brouillon normal
      et un état habituel restent identiques pendant et après deux démonstrations (lancer, envoyer, reprendre,
      recommencer, quitter) ; une ancienne page ne réinjecte ni n'envoie rien ; un contexte ou un stockage en panne
      n'écrit rien dans les données normales ; une commande prête, réduite, déplacée, rectifiée puis annulée garde sa
      production ; la période des retraits se règle et le site la suit ; une utilisation se corrige sur une carte expirée.
   1 nonies (v7.8.1). La stabilisation, dans le navigateur. Page Réserver : la demande n'est dite envoyée qu'une fois
      enregistrée (un enregistrement refusé garde la saisie et permet de reprendre), l'écran dit « demande », pas
      « réservation confirmée » ; une heure devenue trop proche est refusée au moment d'envoyer ; une table de deux
      souhaitée sur le plan est retirée quand on passe à dix couverts. Accueil : plus aucun service ouvert, plus aucune
      soirée visible, les choix et l'annonce écrits à la génération ne sont pas gardés ; une ouverture exceptionnelle
      posée dans l'espace est dite dans les horaires. Espace : une fiche client restée ouverte n'efface pas l'allergie
      notée dans un autre onglet ; deux modèles de message modifiés coup sur coup sont tous deux enregistrés ; après
      minuit, « Aujourd'hui » passe au lendemain sans rechargement.
   2. Chaque rubrique (et l'éditeur d'événement, l'ajout d'une réservation, la photothèque, la barre), à cinq tailles : les
      mesures de l'audit (débordement, textes sous 12 px, cibles de 44 px, textes coupés, contrastes, noms
      accessibles, typographie), axe-core, les recouvrements, puis un balayage de 320 à 1920 px.
   « Section sans visuel » n'est pas retenu ici : une rubrique d'outil n'est pas une section du site. */
import { readFileSync, existsSync } from 'node:fs';
import { installerOutils, defilerTout, mesurer, mesurerRecouvrements } from './page.mjs';

/* Les écrans à mesurer : les cinq rubriques, et pour « Site » chacun de ses onglets (v7.7.2). */
const VUES = ['jour', 'demandes', 'resas:agenda', 'resas:service', 'resas:salle', 'resas:bilan', 'carte:carte', 'carte:ardoise', 'carte:catalogue', 'site:publication', 'site:soirees', 'site:horaires', 'site:textes', 'site:messages', 'site:photos'];
const P = '/espace';

export default async function ({ contexte, attendrePret, attendre, BASE, R, T }) {
  /* Pour la mise au point : PARCOURS_ESPACE=1-nonies ne joue que cette étape (plusieurs séparées par des virgules). Sans la variable, tout est joué. */
  const SEUL = process.env.PARCOURS_ESPACE ? process.env.PARCOURS_ESPACE.split(',') : null;
  const axe = existsSync(new URL('./axe.min.js', import.meta.url)) ? readFileSync(new URL('./axe.min.js', import.meta.url), 'utf8') : '';
  const entrer = async (page) => {
    await page.goto(BASE + P, { waitUntil: 'load' }); await attendrePret(page);
    if (await page.locator('[data-esp-app]').isHidden()) await page.locator('[data-esp-connexion] button[type="submit"]').click();
    await page.locator('[data-esp-app]').waitFor({ state: 'visible', timeout: 5000 }); await attendre(500);
  };
  /* v7.10.0 : au téléphone, Agenda, Offres, Clients et Site sont derrière « Plus » ; « Site, Soirées » mène à Offres. */
  const aller = async (page, vue) => { const [v, onglet] = vue.split(':'), lien = page.locator(`[data-esp-vue="${v}"]:visible`).first();
    if (!(await lien.count())) { await page.locator('[data-esp-plusnav-bouton]').click(); await attendre(250); }
    await page.locator(`[data-esp-vue="${v}"]:visible`).first().click(); await attendre(400);
    if (onglet) { await page.locator(`[role="tab"][data-onglet="${onglet}"]:visible`).first().click(); await attendre(350); } };

  /* ---------- 1. Réserver sur le site, puis confirmer dans l'espace ---------- */
  if (!SEUL || SEUL.includes('1')) {
    const taille = T('390×844'), lieu = { page: P, taille: taille.nom };
    const { ctx, page, erreurs } = await contexte({ taille });
    try {
      await page.goto(BASE + '/reserver#formulaire', { waitUntil: 'load' }); await attendrePret(page);
      await page.locator('[data-resa-form] [data-jour]:not(:disabled)').first().click(); await attendre(250);
      await page.locator('[data-etape-suivante]').click(); await attendre(500);
      await page.locator('[data-resa-form] input[name="heure"]:not(:disabled)').first().check({ force: true }); await attendre(250);
      await page.locator('[data-etape-suivante]').click(); await attendre(500);
      await page.locator('[data-etape-suivante]').click(); await attendre(500);
      await page.fill('[name="prenom"]', 'Claire'); await page.fill('[name="nom"]', 'Essai'); await page.fill('[name="telephone"]', '06 00 00 00 00'); await page.fill('[name="email"]', 'claire@exemple.fr');
      await page.locator('[data-resa-form] button[type="submit"]').click(); await attendre(700);
      await page.locator('[data-resa-confirmer]').click(); await attendre(1800);
      const demande = await page.evaluate(() => JSON.parse(localStorage.getItem('jh-espace-resas:v1') || '[]')[0] || null);
      if (!demande) { R.echec('espace : réserver puis confirmer', 'la demande faite sur Réserver n’arrive pas dans la mémoire de l’espace', lieu); return; }

      await entrer(page);
      const ligne = page.locator(`[data-esp-rendu="jour"] [data-resa="${demande.id}"]`).first();
      const vue = await ligne.innerText().catch(() => '');
      if (!/Claire Essai/.test(vue) || !/Depuis le site/.test(vue) || !/À confirmer/.test(vue)) R.echec('espace : réserver puis confirmer', `la demande n’attend pas dans « Aujourd’hui » (« ${vue.replace(/\s+/g, ' ').slice(0, 90)} »)`, lieu);
      const statut = () => page.evaluate((id) => JSON.parse(localStorage.getItem('jh-espace:v1') || '{}').resa?.statuts?.[id] || '', demande.id);
      const badge = () => page.locator('[data-esp-badge="demandes"]').innerText().then(Number).catch(() => 0);
      const avant = await badge();
      await ligne.locator('[data-statut="confirmee"]').click(); await attendre(500);
      if (await statut() !== 'confirmee' || await badge() !== avant - 1) R.echec('espace : réserver puis confirmer', `« Confirmer » : statut « ${await statut()} », demandes en attente ${avant} → ${await badge()}`, lieu);
      if (!(await page.locator('[data-esp-annuler]').isVisible())) R.echec('espace : annuler', '« Annuler » n’est pas proposé après une action', lieu);
      if (!/Enregistré à \d/.test(await page.locator('[data-esp-sauve]').innerText())) R.echec('espace : enregistrement', 'l’état « Enregistré à … » ne s’affiche pas après une action', lieu);
      await page.locator('[data-esp-annuler]').click(); await attendre(500);
      if (await statut() !== '' || await badge() !== avant) R.echec('espace : annuler', `après « Annuler » : statut « ${await statut()} », demandes en attente ${await badge()} (attendu ${avant})`, lieu);
      await page.locator(`[data-esp-rendu="jour"] [data-resa="${demande.id}"] [data-statut="confirmee"]`).first().click(); await attendre(400);

      /* Dans l'agenda, au jour de la demande : confirmée ; « Complet » ferme le service sur la page Réserver. */
      await aller(page, 'resas');
      for (let i = 0; i < 6 && !(await page.locator(`[data-jour="${demande.date}"]`).count()); i++) { await page.locator('[data-semaine="7"]').click({ force: true }); await attendre(250); }
      await page.locator(`[data-jour="${demande.date}"]`).click(); await attendre(400);
      const agenda = await page.locator(`[data-esp-rendu="resas"] [data-resa="${demande.id}"]`).innerText().catch(() => '');
      if (!/Confirmée/.test(agenda)) R.echec('espace : réserver puis confirmer', `dans l’agenda du ${demande.date}, la demande n’est pas « Confirmée »`, lieu);
      await page.locator(`[data-complet="${demande.service}"]`).click(); await attendre(400);
      /* v7.8.0 : on regarde ce que voit le visiteur (le service désactivé, noté « complet »), plus seulement les données de la page :
         l'ancien contrôle lisait le JSON et passait alors que le service restait proposé. */
      await page.goto(`${BASE}/reserver?date=${demande.date}&service=${demande.service}#formulaire`, { waitUntil: 'load' }); await attendrePret(page); await attendre(600);
      const vu = await page.evaluate((sv) => { const f = document.querySelector('[data-resa-form]'), r = f?.querySelector(`[name="service"][value="${sv}"]`); return { date: f?.elements.date?.value, desactive: !!r?.disabled, note: r?.closest('label')?.querySelector('[data-note]')?.textContent || '', libres: [...(f?.querySelectorAll('input[name="heure"]:not(:disabled)') || [])].length, choisi: f?.querySelector('[name="service"]:checked')?.value || '' }; }, demande.service);
      if (vu.date !== demande.date || !vu.desactive || vu.note !== 'complet' || vu.choisi === demande.service) R.echec('espace : complet', `le service dit « Complet » dans l’espace est encore proposé sur la page Réserver (${JSON.stringify(vu)})`, { page: '/reserver', taille: taille.nom });
      if (!(await page.locator('.apercu-espace').count())) R.echec('espace : aperçu', 'la pastille « Aperçu de vos modifications » manque sur le site', { page: '/reserver', taille: taille.nom });

      /* Tout remettre comme livré : tout s'efface ; « Annuler » rend tout. */
      await entrer(page);
      await page.locator('[data-esp-plus]').click(); await attendre(250);
      await page.locator('[data-tout-effacer]').click(); await attendre(500);
      const vide = await page.evaluate(() => !localStorage.getItem('jh-espace:v1') && !localStorage.getItem('jh-espace-resas:v1'));
      if (!vide) R.echec('espace : tout remettre comme livré', 'il reste des modifications ou des demandes dans la mémoire', lieu);
      await page.locator('[data-esp-annuler]').click(); await attendre(500);
      if (await statut() !== 'confirmee' || !(await page.evaluate(() => localStorage.getItem('jh-espace-resas:v1')))) R.echec('espace : annuler', '« Annuler » après « Tout remettre comme livré » ne rend pas les modifications', lieu);
      /* Le menu se ferme à Échap et rend le focus à son bouton. */
      await page.locator('[data-esp-plus]').click(); await attendre(200); await page.keyboard.press('Escape'); await attendre(200);
      const menu = await page.evaluate(() => ({ ferme: document.querySelector('[data-esp-plus-panneau]').hidden, focus: document.activeElement?.matches('[data-esp-plus]') }));
      if (!menu.ferme || !menu.focus) R.echec('espace : menu', `Échap : menu fermé ${menu.ferme}, focus rendu au bouton ${menu.focus}`, lieu);
      [...new Set(erreurs)].forEach((x) => R.echec('erreur de console ou ressource', x, lieu));
      R.ok('espace : réserver puis confirmer');
    } finally { await ctx.close(); }
  }

  /* ---------- 1 bis. La barre « Que voulez-vous faire ? », au doigt puis au clavier ; la fête ---------- */
  for (const taille of (!SEUL || SEUL.includes('1-bis') ? ['390×844', '1366×768'] : []).map(T)) {
    const lieu = { page: P, taille: taille.nom }, tel = taille.w < 1000;
    const { ctx, page, erreurs } = await contexte({ taille });
    try {
      await entrer(page);
      const ouvrir = async () => { if (tel) await page.locator('.esp-fab').click(); else await page.keyboard.press('Control+k'); await attendre(350); };
      const memoire = () => page.evaluate(() => JSON.parse(localStorage.getItem('jh-espace:v1') || '{}'));
      const ecrire = async (t) => { await page.locator('#barre-champ').fill(t); await attendre(250); };
      await ouvrir();
      if (!(await page.evaluate(() => document.activeElement?.id === 'barre-champ'))) R.echec('espace : barre', `${tel ? 'le bouton rond' : 'Ctrl + K'} n’ouvre pas la barre sur son champ`, lieu);
      /* Un exemple touché remplit le champ et montre ce qui est compris, sans rien lancer. */
      await page.locator('[data-exemple]').first().click(); await attendre(250);
      const ex = await page.evaluate(() => ({ champ: document.querySelector('#barre-champ').value, n: document.querySelectorAll('[data-option]').length, vide: !localStorage.getItem('jh-espace:v1') }));
      if (!ex.champ || !ex.n || !ex.vide) R.echec('espace : barre', `un exemple touché : champ « ${ex.champ} », ${ex.n} proposition(s), rien de lancé ${ex.vide}`, lieu);
      /* « fermer samedi soir » : la proposition dit la date entière ; Entrée ferme le service ; « Annuler » le rouvre. */
      await ecrire('fermer samedi soir');
      const prop = await page.locator('[data-option][aria-selected="true"]').innerText().catch(() => '');
      if (!/Fermer samedi \d{1,2} \S+ au soir/.test(prop)) R.echec('espace : barre', `« fermer samedi soir » compris comme « ${prop.replace(/\s+/g, ' ').slice(0, 80)} »`, lieu);
      await page.keyboard.press('Enter'); await attendre(500);
      const f = (await memoire()).resa?.fermes || {}, jour = Object.keys(f)[0];
      if (Object.keys(f).length !== 1 || f[jour].join() !== 'soir' || new Date(jour + 'T12:00:00Z').getUTCDay() !== 6) R.echec('espace : barre', `« fermer samedi soir » a enregistré ${JSON.stringify(f)}`, lieu);
      const agenda = await page.evaluate((j) => ({ vue: !document.querySelector('[data-vue="resas"]').hidden, jour: document.querySelector(`[data-jour="${j}"]`)?.getAttribute('aria-pressed'), barre: document.querySelector('.esp-cmd').hidden }), jour);
      if (!agenda.vue || agenda.jour !== 'true' || !agenda.barre) R.echec('espace : barre', `après l’action : agenda ouvert ${agenda.vue}, jour choisi ${agenda.jour}, barre fermée ${agenda.barre}`, lieu);
      await page.locator('[data-esp-annuler]').click(); await attendre(400);
      if (Object.keys((await memoire()).resa?.fermes || {}).length) R.echec('espace : barre', '« Annuler » ne rouvre pas le service fermé depuis la barre', lieu);
      /* « ajouter une soirée raclette le 12 » : le billet est créé et s'ouvre pour le prix et la photo. */
      await ouvrir(); await ecrire('ajouter une soirée raclette le 12'); await page.keyboard.press('Enter'); await attendre(600);
      const ev = await page.evaluate(() => ({ titre: document.querySelector('#ev-titre')?.value, date: document.querySelector('#ev-date')?.value, n: (JSON.parse(localStorage.getItem('jh-espace:v1') || '{}').evenements?.ajouts || []).length }));
      if (ev.titre !== 'Soirée raclette' || !/-12$/.test(ev.date || '') || ev.n !== 1) R.echec('espace : barre', `« ajouter une soirée raclette le 12 » : titre « ${ev.titre} », date ${ev.date}, ${ev.n} événement(s) créé(s)`, lieu);
      await page.locator('[data-esp-annuler]').click(); await attendre(400);
      if (((await memoire()).evenements?.ajouts || []).length) R.echec('espace : barre', '« Annuler » ne retire pas la soirée créée depuis la barre', lieu);
      /* Une phrase inconnue le dit ; Échap ferme et rend le focus. */
      await ouvrir(); await ecrire('xyzzy quux');
      if (!/Rien trouvé/.test(await page.locator('[data-barre-aide]').innerText().catch(() => ''))) R.echec('espace : barre', 'une phrase inconnue ne dit pas « Rien trouvé »', lieu);
      await page.keyboard.press('Escape'); await attendre(250);
      const fin = await page.evaluate(() => ({ ferme: document.querySelector('.esp-cmd').hidden, focus: document.activeElement && document.activeElement !== document.body, bloque: document.documentElement.classList.contains('esp-modale-ouverte') }));
      if (!fin.ferme || !fin.focus || fin.bloque) R.echec('espace : barre', `Échap : barre fermée ${fin.ferme}, focus rendu ${fin.focus}, page encore bloquée ${fin.bloque}`, lieu);
      /* La fête : la dernière demande reçoit sa réponse. */
      await aller(page, 'jour'); let fete = false;
      for (let i = 0; i < 30 && await page.locator('[data-esp-rendu="jour"] [data-repondre]').count(); i++) { await page.locator('[data-esp-rendu="jour"] [data-repondre]').first().click(); await attendre(150); fete = fete || !!(await page.locator('.esp-fete').count()); }
      /* v7.14.0 : une commande à emporter et une carte cadeau se décident dans leur dossier, pas d'un seul geste. */
      for (let i = 0; i < 6 && await page.locator('[data-esp-rendu="jour"] .esp-dem [data-com-ouvrir]').count(); i++) {
        const b = page.locator('[data-esp-rendu="jour"] .esp-dem [data-com-ouvrir]').first(), quoi = await b.getAttribute('data-com-ouvrir'); await b.click(); await attendre(400);
        if (quoi === 'commande') await page.locator('[data-cmd-avancer="validee"]').click();
        else { await page.locator('#cad-ach-nom').fill('Hugo S. (exemple)'); await page.locator('#cad-ach-tel').fill('06 00 00 00 02'); await page.locator('[data-form-cad-valider] button[type="submit"]').click(); }
        await attendre(250); fete = fete || !!(await page.locator('.esp-fete').count()); await aller(page, 'jour');
      }
      const tout = await page.locator('[data-esp-rendu="jour"] .esp-vide--fete').innerText().catch(() => '');
      if (!/Tout a une réponse/.test(tout) || !fete) R.echec('espace : tout a une réponse', `message « ${tout.slice(0, 60)} », fête lancée ${fete}`, lieu);
      [...new Set(erreurs)].forEach((x) => R.echec('erreur de console ou ressource', x, lieu));
      R.ok('espace : barre « Que voulez-vous faire ? »');
    } finally { await ctx.close(); }
  }

  /* ---------- 1 ter. Tout arrive ici : les cinq formulaires du site, l'arrivée en direct, les étapes, le message ---------- */
  if (!SEUL || SEUL.includes('1-ter')) {
    const taille = T('1366×768'), lieu = { page: P, taille: taille.nom };
    const { ctx, page, erreurs } = await contexte({ taille });
    try {
      await entrer(page);
      const genres = () => page.evaluate(() => JSON.parse(localStorage.getItem('jh-espace-demandes:v1') || '[]').map((d) => d.genre));
      const avant = await page.locator('[data-esp-badge="demandes"]').innerText().then(Number).catch(() => 0);
      /* Dans un autre onglet du même navigateur : une demande de réception, faite comme un visiteur. */
      const site = await ctx.newPage();
      await site.goto(BASE + '/receptions#demande', { waitUntil: 'load' }); await attendrePret(site);
      const f = site.locator('[data-demande]');
      await f.locator('[name="occasion"][data-un="Un baptême"]').check({ force: true }); await attendre(100);
      await f.locator('[data-etape="1"] [data-suivant]').click(); await attendre(200);
      await f.locator('[name="periode"]').selectOption({ index: 2 }); await f.locator('[name="invites"]').fill('40');
      await f.locator('[data-etape="2"] [data-suivant]').click(); await attendre(200);
      await f.locator('[name="prenom"]').fill('Claire'); await f.locator('[name="nom"]').fill('Essai'); await f.locator('[name="telephone"]').fill('06 12 34 56 78');
      await f.locator('[type="submit"]').click(); await attendre(700);
      /* L'espace, resté ouvert, l'annonce aussitôt ; « Voir » ouvre la demande. */
      await page.bringToFront(); await attendre(400);
      const direct = await page.evaluate(() => ({ texte: document.querySelector('[data-esp-toast-texte]').textContent, voir: !document.querySelector('[data-esp-toast-action]').hidden }));
      if (!/Nouvelle demande depuis le site/.test(direct.texte) || !/Claire Essai/.test(direct.texte) || !direct.voir) R.echec('espace : arrivée en direct', `message « ${direct.texte.slice(0, 80)} », bouton « Voir » ${direct.voir}`, lieu);
      if (await page.locator('[data-esp-badge="demandes"]').innerText().then(Number).catch(() => 0) !== avant + 1) R.echec('espace : arrivée en direct', 'le nombre de demandes à traiter n’augmente pas quand une demande arrive', lieu);
      await page.locator('[data-esp-toast-action]').click(); await attendre(500);
      const ouverte = await page.locator('[data-esp-rendu="demandes"] .esp-dem.est-ouverte').innerText().catch(() => '');
      if (!/Claire Essai/.test(ouverte) || !/Depuis le site/.test(ouverte) || !/40 invités/.test(ouverte) || !/Le message au client/.test(ouverte)) R.echec('espace : demandes', `« Voir » n’ouvre pas la demande arrivée (« ${ouverte.replace(/\s+/g, ' ').slice(0, 90)} »)`, lieu);
      /* Une réception avance d'étape, d'un geste, et s'annule. */
      const id = await page.locator('[data-esp-rendu="demandes"] .esp-dem.est-ouverte').getAttribute('data-demande');
      const etape = () => page.evaluate((i) => JSON.parse(localStorage.getItem('jh-espace:v1') || '{}').demandes?.statuts?.[i] || '', id);
      await page.locator(`[data-esp-rendu="demandes"] [data-demande="${id}"] [data-repondre]`).click(); await attendre(400);
      if (await etape() !== 'rappele') R.echec('espace : demandes', `« J’ai rappelé » enregistre l’étape « ${await etape()} »`, lieu);
      await page.locator('[data-esp-annuler]').click(); await attendre(400);
      if (await etape() !== '') R.echec('espace : demandes', '« Annuler » ne remet pas la réception à « Nouvelle »', lieu);
      /* Le message au client suit le modèle retouché dans Site > Messages. */
      await aller(page, 'site:messages'); await page.locator('#mo-confirmation').fill('Merci {prénom}, à {jour} !'); await attendre(900);
      const apercu = await page.locator('[data-apercu-modele="confirmation"]').innerText();
      await aller(page, 'demandes'); await page.locator('[data-filtre-demandes="table"]').click(); await attendre(250);
      const message = await page.locator('.esp-resa__message .esp-bulle__texte').first().textContent().catch(() => '');
      if (!/^Merci Claire, à samedi 21 novembre\s!$/.test(apercu) || !/^Merci \S+.*, à \S+ \d+ \S+\s!$/.test(message)) R.echec('espace : messages', `aperçu « ${apercu} », message d’une table « ${message} »`, lieu);
      /* Les trois autres formulaires : la commande traiteur (faite comme un visiteur), la carte cadeau et la question (à l'envoi du module). */
      await site.bringToFront();
      await site.goto(BASE + '/a-emporter', { waitUntil: 'load' }); await attendrePret(site);
      await site.locator('[data-ajouter]').first().click({ force: true }); await attendre(500);
      await site.evaluate(() => { const fo = document.querySelector('[data-emp-form]'); const j = fo.querySelector('[name="jour"]:not(:disabled)'); j.checked = true; j.dispatchEvent(new Event('change', { bubbles: true })); });
      await attendre(250);
      await site.evaluate(() => { const fo = document.querySelector('[data-emp-form]'); const m = fo.querySelector('[name="moment"]:not(:disabled)'); if (m) { m.checked = true; m.dispatchEvent(new Event('change', { bubbles: true })); } for (const i of fo.querySelectorAll('input[required]')) if (!['radio', 'checkbox'].includes(i.type) && !i.value) i.value = i.type === 'email' ? 'claire@exemple.fr' : i.type === 'tel' ? '06 12 34 56 78' : 'Essai'; fo.requestSubmit(); });
      await attendre(500);
      await site.goto(BASE + '/offrir', { waitUntil: 'load' }); await attendrePret(site);
      await site.evaluate(() => document.querySelector('[data-module="carte-cadeau-qui-se-compose"]').dispatchEvent(new CustomEvent('ccq:valide', { bubbles: true, detail: { montant: 50, quantite: 1, total: 50, pour: 'Léa', de: 'Claire', mot: '' } })));
      await site.goto(BASE + '/infos-pratiques', { waitUntil: 'load' }); await attendrePret(site);
      await site.evaluate(() => document.querySelector('[data-module="formulaire-par-etapes"]').dispatchEvent(new CustomEvent('formulaire:envoye', { bubbles: true, detail: { valeurs: { sujet: 'autre', message: 'Avez-vous une chaise haute ?', prenom: 'Claire', nom: 'Essai', email: 'claire@exemple.fr' }, resume: [{ champs: [{ nom: 'sujet', valeur: 'Autre chose' }] }] } })));
      await attendre(300);
      const recus = (await genres()).sort().join(', ');
      if (recus !== 'cadeau, question, reception, traiteur') R.echec('espace : tout arrive ici', `demandes venues du site : ${recus || 'aucune'} (attendu : réception, traiteur, carte cadeau, question)`, lieu);
      await site.close(); await page.bringToFront(); await page.locator('[data-filtre-demandes="tout"]').click(); await attendre(300);
      const liste = await page.locator('[data-esp-rendu="demandes"]').innerText();
      for (const [mot, quoi] of [[/Traiteur · 1 produit/, 'la commande traiteur'], [/Carte cadeau · 1 carte de 50 € pour Léa/, 'la carte cadeau'], [/Question · Autre chose/, 'la question']]) if (!mot.test(liste)) R.echec('espace : tout arrive ici', `${quoi} n’apparaît pas dans « Demandes »`, lieu);
      [...new Set(erreurs)].forEach((x) => R.echec('erreur de console ou ressource', x, lieu));
      R.ok('espace : tout arrive ici');
    } finally { await ctx.close(); }
  }

  /* ---------- 1 quater. La carte en main : épuisé aujourd'hui, prix, allergènes, plat ajouté ; la carte du site suit ---------- */
  if (!SEUL || SEUL.includes('1-quater')) {
    const taille = T('390×844'), lieu = { page: P, taille: taille.nom };
    const { ctx, page, erreurs } = await contexte({ taille });
    try {
      await entrer(page); await aller(page, 'carte:carte');
      const carte = () => page.evaluate(() => JSON.parse(localStorage.getItem('jh-espace:v1') || '{}').carte || {});
      const nomPlat = (await page.locator('[data-plat="plats/poisson-selon-l-arrivage"] [data-plat-nom]').innerText()).trim();
      await page.locator('[data-epuise="plats/poisson-selon-l-arrivage"]').click(); await attendre(400);
      const jour = Object.values((await carte()).epuises || {})[0];
      if (!/^\d{4}-\d\d-\d\d\/(midi|soir)$/.test(jour || '') || !(await page.locator('[data-plat="plats/poisson-selon-l-arrivage"].est-epuise').count())) R.echec('espace : carte', `« Épuisé aujourd’hui » : date enregistrée « ${jour} », plat marqué ${await page.locator('[data-plat="plats/poisson-selon-l-arrivage"].est-epuise').count()}`, lieu);
      /* Un prix et des allergènes ; un plat ajouté. */
      await page.locator('[data-plat="entrees/foie-gras-de-canard-maison"] [data-editer-plat]').click(); await attendre(300);
      await page.locator('#pl-prix').fill('23,50'); await page.locator('[name="allergene"][value="Gluten"]').check(); await attendre(800);
      await page.locator('[data-ajouter-plat-carte="desserts"]').click(); await attendre(300);
      await page.locator('#pl-nom').fill('Tarte aux mirabelles'); await page.locator('#pl-prix').fill('9'); await attendre(800);
      const c = await carte();
      if (c.modifs?.['entrees/foie-gras-de-canard-maison']?.prix !== 23.5 || c.modifs['entrees/foie-gras-de-canard-maison'].allergenes?.join() !== 'Gluten' || c.ajouts?.[0]?.nom !== 'Tarte aux mirabelles') R.echec('espace : carte', `après les modifications : ${JSON.stringify(c).slice(0, 160)}`, lieu);
      /* v7.13.0 : avant la publication, le site garde le prix et les plats publiés ; « épuisé », lui, est immédiat. */
      await page.goto(BASE + '/la-carte', { waitUntil: 'load' }); await attendrePret(page); await attendre(300);
      const avantPub = await page.evaluate(() => ({ prix: document.querySelector('#carte-entrees .carte-resto__prix')?.textContent, ajout: [...document.querySelectorAll('#carte-desserts .carte-resto__plat')].at(-1)?.textContent || '', epuise: document.querySelectorAll('#carte-plats .carte-resto__plat.est-epuise').length, apercu: !!document.querySelector('[data-apercu-non-publie]') }));
      if (avantPub.prix === '23,50 €' || /Tarte aux mirabelles/.test(avantPub.ajout) || avantPub.epuise !== 1 || avantPub.apercu) R.echec('espace : carte', `avant la publication, le site montre déjà le brouillon ou oublie « épuisé » : ${JSON.stringify(avantPub)}`, { page: '/la-carte', taille: taille.nom });
      /* L'aperçu montre le brouillon, avec son repère, et ne publie rien. */
      await page.goto(BASE + '/la-carte?apercu=1', { waitUntil: 'load' }); await attendrePret(page); await attendre(300);
      const enApercu = await page.evaluate(() => ({ prix: document.querySelector('#carte-entrees .carte-resto__prix')?.textContent, repere: document.querySelector('[data-apercu-non-publie]')?.textContent || '', n: JSON.parse(localStorage.getItem('jh-espace:v1') || '{}').publie?.n || 0 }));
      if (enApercu.prix !== '23,50 €' || !/Aperçu — non publié/.test(enApercu.repere) || enApercu.n !== 0) R.echec('espace : carte', `l’aperçu ne montre pas le brouillon sous son repère, ou a publié : ${JSON.stringify(enApercu)}`, { page: '/la-carte?apercu=1', taille: taille.nom });
      await page.goto(BASE + '/la-carte?apercu=0', { waitUntil: 'load' }); await attendrePret(page);
      await entrer(page); await aller(page, 'carte:carte');
      await page.locator('#panneau-carte > .esp-pub [data-pub-ouvrir]').click(); await attendre(300);
      const resume = (await page.locator('[data-pub-resume] .esp-pub__liste').innerText()).replace(/\s+/g, ' ');
      if (!/Foie gras/.test(resume) || !/Tarte aux mirabelles/.test(resume)) R.echec('espace : carte', `le résumé avant publication : « ${resume.slice(0, 200)} »`, lieu);
      await page.locator('[data-pub-confirmer]').click(); await attendre(500);
      if (!(await page.locator('#panneau-carte > [data-pub-net]').count())) R.echec('espace : carte', 'après « Publier maintenant », la carte n’est pas dite publiée', lieu);
      /* La carte du site suit, une fois publiée. */
      await page.goto(BASE + '/la-carte', { waitUntil: 'load' }); await attendrePret(page); await attendre(300);
      const site = await page.evaluate(() => ({ prix: document.querySelector('#carte-entrees .carte-resto__prix')?.textContent, allergenes: document.querySelector('#carte-entrees .carte-resto__plat .carte-resto__allergenes')?.textContent || '',
        epuise: [...document.querySelectorAll('#carte-plats .carte-resto__plat.est-epuise .carte-resto__plat-nom')].map((x) => x.textContent), ajout: [...document.querySelectorAll('#carte-desserts .carte-resto__plat')].at(-1)?.textContent || '', detail: document.querySelector('#carte-entrees .rubrique-bande__detail')?.textContent || '' }));
      if (site.prix !== '23,50 €' || !/Allergènes\s: gluten/.test(site.allergenes)) R.echec('espace : carte', `sur le site, le premier plat : prix « ${site.prix} », « ${site.allergenes} »`, { page: '/la-carte', taille: taille.nom });
      if (site.epuise.join() !== nomPlat) R.echec('espace : carte', `sur le site, épuisé aujourd’hui : ${site.epuise.join(', ') || 'aucun plat'} (attendu : ${nomPlat})`, { page: '/la-carte', taille: taille.nom });
      if (!/Tarte aux mirabelles/.test(site.ajout) || !/9 €/.test(site.ajout)) R.echec('espace : carte', `sur le site, le plat ajouté n’est pas en fin de desserts (« ${site.ajout.slice(0, 60)} »)`, { page: '/la-carte', taille: taille.nom });
      if (!/à 23,5 €/.test(site.detail)) R.echec('espace : carte', `sur le site, l’en-tête des entrées ne suit pas le prix (« ${site.detail} »)`, { page: '/la-carte', taille: taille.nom });
      /* Demain, le plat épuisé revient : la date enregistrée n'est plus celle du jour. */
      await page.evaluate(() => { const d = JSON.parse(localStorage.getItem('jh-espace:v1')); for (const k of Object.keys(d.carte.epuises)) d.carte.epuises[k] = '2000-01-01'; localStorage.setItem('jh-espace:v1', JSON.stringify(d)); });
      await page.reload({ waitUntil: 'load' }); await attendrePret(page); await attendre(300);
      if (await page.locator('.carte-resto__plat.est-epuise').count()) R.echec('espace : carte', 'un plat épuisé un autre jour reste indiqué épuisé sur le site', { page: '/la-carte', taille: taille.nom });
      /* La barre : « épuisé : foie gras ». */
      await entrer(page); await page.locator('.esp-fab').click(); await attendre(350);
      await page.locator('#barre-champ').fill('épuisé : foie gras'); await attendre(250); await page.keyboard.press('Enter'); await attendre(500);
      const apres = await page.evaluate(() => ({ ep: Object.keys(JSON.parse(localStorage.getItem('jh-espace:v1') || '{}').carte?.epuises || {}).filter((k) => k === 'entrees/foie-gras-de-canard-maison').length, vue: !document.querySelector('[data-vue="carte"]').hidden }));
      if (!apres.ep || !apres.vue) R.echec('espace : carte', `« épuisé : foie gras » dans la barre : enregistré ${apres.ep}, rubrique Carte ouverte ${apres.vue}`, lieu);
      [...new Set(erreurs)].forEach((x) => R.echec('erreur de console ou ressource', x, lieu));
      R.ok('espace : la carte en main');
    } finally { await ctx.close(); }
  }

  /* ---------- 1 quinquies. L'espace vous propose ; le bilan de la semaine ; sur l'écran d'accueil ---------- */
  if (!SEUL || SEUL.includes('1-quinquies')) {
    const taille = T('1366×768'), lieu = { page: P, taille: taille.nom };
    const { ctx, page, erreurs } = await contexte({ taille });
    try {
      await entrer(page);
      const etat = () => page.evaluate(() => JSON.parse(localStorage.getItem('jh-espace:v1') || '{}'));
      /* Un groupe de trente noté samedi soir : le service passe les quatre cinquièmes de la capacité. */
      await page.keyboard.press('Control+k'); await attendre(350);
      await page.locator('#barre-champ').fill('table pour 30 samedi 20 h au nom de Groupe Essai'); await attendre(250); await page.keyboard.press('Enter'); await attendre(500);
      await aller(page, 'jour');
      const plein = page.locator('[data-esp-rendu="jour"] [data-faire-conseil^="plein-"]').first();
      const titre = await page.locator('[data-esp-rendu="jour"] [data-conseil^="plein-"] .esp-conseil__titre').first().innerText().catch(() => '');
      if (!/Samedi \d+ \S+ au soir\s: \d+ couverts sur \d+/.test(titre)) R.echec('espace : suggestions', `le service presque plein n’est pas signalé (« ${titre} »)`, lieu);
      await plein.click(); await attendre(400);
      const jour = Object.keys((await etat()).resa?.complets || {})[0];
      if (!jour || (await etat()).resa.complets[jour].join() !== 'soir' || await page.locator('[data-esp-rendu="jour"] [data-conseil^="plein-"]').count()) R.echec('espace : suggestions', `« Dire complet » : enregistré ${JSON.stringify((await etat()).resa?.complets)}, suggestion encore là ${await page.locator('[data-esp-rendu="jour"] [data-conseil^="plein-"]').count()}`, lieu);
      await page.locator('[data-esp-annuler]').click(); await attendre(400);
      if (Object.keys((await etat()).resa?.complets || {}).length || !(await page.locator('[data-esp-rendu="jour"] [data-conseil^="plein-"]').count())) R.echec('espace : suggestions', '« Annuler » ne rend pas le service ni la suggestion', lieu);
      /* « Plus tard » : la suggestion se tait pour la journée. */
      const id = await page.locator('[data-esp-rendu="jour"] [data-conseil]').first().getAttribute('data-conseil');
      await page.locator(`[data-esp-rendu="jour"] [data-taire-conseil="${id}"]`).click(); await attendre(400);
      if (!(await etat()).conseils?.ignores?.[id] || await page.locator(`[data-esp-rendu="jour"] [data-conseil="${id}"]`).count()) R.echec('espace : suggestions', '« Plus tard » ne fait pas taire la suggestion', lieu);
      /* Le bilan de la semaine : le chiffre des couverts est celui du tableau. */
      await aller(page, 'resas:agenda'); await page.locator(`[data-jour="${jour}"]`).click().catch(() => {}); await attendre(250); await aller(page, 'resas:bilan');
      await page.locator('.esp-tableau summary').click(); await attendre(250);
      const bilan = await page.evaluate(() => ({ tuile: +document.querySelector('[data-bilan] .esp-tuile__valeur').textContent, pied: +document.querySelector('.esp-bilan-table tfoot td:last-child').textContent, lignes: [...document.querySelectorAll('.esp-bilan-table tbody td:last-child')].reduce((n, td) => n + +td.textContent, 0), demo: /Démonstration/.test(document.querySelector('.esp-note-demo')?.textContent || ''), tel: document.querySelector('.esp-origines li:nth-child(2) b')?.textContent, pleine: document.querySelectorAll('.esp-jauge.est-pleine').length }));
      if (!bilan.tuile || bilan.tuile !== bilan.pied || bilan.pied !== bilan.lignes) R.echec('espace : bilan', `couverts : ${bilan.tuile} en tuile, ${bilan.pied} en pied de tableau, ${bilan.lignes} en additionnant les jours`, lieu);
      if (!bilan.demo) R.echec('espace : bilan', 'le bilan ne dit pas que ses chiffres sont de démonstration', lieu);
      if (bilan.tel !== '1' || !bilan.pleine) R.echec('espace : bilan', `réservation au téléphone comptée ${bilan.tel}, service presque plein marqué ${bilan.pleine}`, lieu);
      /* Sur l'écran d'accueil : la fenêtre s'ouvre, Échap la ferme et rend le focus. */
      await page.locator('[data-esp-plus]').click(); await attendre(250); await page.locator('[data-esp-installer]').click(); await attendre(350);
      const ouvert = await page.locator('.esp-modale--petite [role="dialog"]').isVisible().catch(() => false);
      await page.keyboard.press('Escape'); await attendre(250);
      const fin = await page.evaluate(() => ({ ferme: document.querySelector('.esp-modale--petite').hidden, focus: document.activeElement?.matches('[data-esp-plus]'), manifeste: document.querySelector('link[rel="manifest"]')?.getAttribute('href') || '' }));
      if (!ouvert || !fin.ferme || !fin.focus) R.echec('espace : écran d’accueil', `fenêtre ouverte ${ouvert}, fermée à Échap ${fin.ferme}, focus rendu ${fin.focus}`, lieu);
      const man = fin.manifeste ? await page.evaluate(async (u) => { try { const m = await (await fetch(u)).json(); const ic = await Promise.all((m.icons || []).map(async (i) => (await fetch(i.src)).ok)); return { ok: m.start_url === '/espace' && m.display === 'standalone', icones: ic.length >= 2 && ic.every(Boolean) }; } catch (e) { return { erreur: String(e) }; } }, fin.manifeste) : { erreur: 'aucun lien' };
      if (!man.ok || !man.icones) R.echec('espace : écran d’accueil', `manifeste : ${JSON.stringify(man)}`, lieu);
      [...new Set(erreurs)].forEach((x) => R.echec('erreur de console ou ressource', x, lieu));
      R.ok('espace : suggestions, bilan, écran d’accueil');
    } finally { await ctx.close(); }
  }

  /* ---------- 1 sexies. Le service : la frise, modifier, annuler ou absent, la feuille ---------- */
  if (!SEUL || SEUL.includes('1-sexies')) {
    const taille = T('1366×768'), lieu = { page: P, taille: taille.nom };
    const { ctx, page, erreurs } = await contexte({ taille });
    try {
      await entrer(page);
      const etat = () => page.evaluate(() => JSON.parse(localStorage.getItem('jh-espace:v1') || '{}'));
      await page.keyboard.press('Control+k'); await attendre(350);
      await page.locator('#barre-champ').fill('table pour 4 samedi 20 h au nom de Service Essai'); await attendre(250); await page.keyboard.press('Enter'); await attendre(500);
      const r = ((await etat()).resa?.ajouts || []).at(-1);
      if (!r) { R.echec('espace : service', 'la réservation notée par la barre n’est pas enregistrée', lieu); return; }
      await aller(page, 'resas:agenda'); await page.locator(`[data-jour="${r.date}"]`).click().catch(() => {}); await attendre(250); await aller(page, 'resas:service');
      await page.locator('[data-service-vu="soir"]').click().catch(() => {}); await attendre(350);
      const L = `[data-esp-panneau-resas] [data-resa="${r.id}"]`;
      const lire = () => page.evaluate((sel) => { const n = (t) => +(String(t || '').match(/\d+/) || [0])[0], txt = (q) => document.querySelector(q)?.textContent || '';
        /* v7.11.0 : le résumé commence par le nombre de réservations ; les couverts sont le nombre qui précède « couvert ». */
        return { resume: +((txt('.esp-service-tete__resume').match(/(\d+)\s*couverts?/) || [0, 0])[1]), blocs: [...document.querySelectorAll('[data-esp-panneau-resas] .esp-frise__bloc b')].reduce((a, b) => a + +b.textContent, 0), pic: n(txt('.esp-charge__barre.est-pic b')), tableau: Math.max(0, ...[...document.querySelectorAll('.esp-charge .esp-bilan-table tbody td')].map((td) => +td.textContent)), ligne: (document.querySelector(sel)?.innerText || '').replace(/\s+/g, ' ') }; }, L);
      const a = await lire();
      if (!/Service Essai/.test(a.ligne) || !/4 couverts/.test(a.ligne)) R.echec('espace : service', `la réservation n’est pas dans la frise (« ${a.ligne.slice(0, 80)} »)`, lieu);
      if (!a.resume || a.resume !== a.blocs) R.echec('espace : service', `le résumé annonce ${a.resume} couverts, la frise en porte ${a.blocs}`, lieu);
      if (!a.pic || a.pic !== a.tableau) R.echec('espace : service', `coup de feu : ${a.pic} sur le graphique, ${a.tableau} dans son tableau`, lieu);
      /* Modifier : six couverts et une note ; « Annuler » rend la réservation comme elle était. */
      await page.locator(`${L} [data-modifier-resa]`).first().click(); await attendre(350);
      const focus = await page.evaluate(() => document.activeElement?.id);
      await page.locator('#mr-c').fill('6'); await page.locator('#mr-d').fill('Allergie : arachide'); await page.locator('[data-form-resa] button[type="submit"]').click(); await attendre(500);
      const b = await lire(), m = (await etat()).resa?.modifs?.[r.id];
      if (focus !== 'mr-h') R.echec('espace : service', `« Modifier » ne place pas le focus dans le formulaire (${focus})`, lieu);
      if (+m?.couverts !== 6 || !/6 couverts/.test(b.ligne) || !/arachide/.test(b.ligne) || b.resume !== a.resume + 2) R.echec('espace : service', `modifier : enregistré ${JSON.stringify(m)}, ligne « ${b.ligne.slice(0, 80)} », résumé ${b.resume} (attendu ${a.resume + 2})`, lieu);
      await page.locator('[data-esp-annuler]').click(); await attendre(400);
      const c = await lire();
      if ((await etat()).resa?.modifs?.[r.id] || c.resume !== a.resume) R.echec('espace : service', '« Annuler » ne rend pas la réservation comme elle était', lieu);
      /* Annuler la réservation (un jour à venir) ou la noter absente (le jour même) : ses couverts ne comptent plus. */
      const geste = (await page.locator(`${L} [data-statut="annulee"]`).count()) ? 'annulee' : 'absente';
      /* Le jour même (un samedi, « samedi » désigne aujourd'hui), « Le client annule » est rangé dans « Autres actions » : on l'ouvre. */
      if (!(await page.locator(`${L} [data-statut="${geste}"]`).isVisible())) { await page.locator(`${L} .esp-frise__plus > summary`).click(); await attendre(200); }
      await page.locator(`${L} [data-statut="${geste}"]`).click(); await attendre(450);
      const d = await lire(), st = (await etat()).resa?.statuts?.[r.id];
      if (st !== geste || d.resume !== a.resume - 4 || !/Remettre la réservation/.test(d.ligne)) R.echec('espace : service', `« ${geste} » : statut ${st}, résumé ${d.resume} (attendu ${a.resume - 4}), ligne « ${d.ligne.slice(0, 80)} »`, lieu);
      await page.locator(`${L} [data-statut="confirmee"]`).click(); await attendre(450);
      const f = await lire();
      if ((await etat()).resa?.statuts?.[r.id] !== 'confirmee' || f.resume !== a.resume) R.echec('espace : service', '« Remettre la réservation » ne rend pas ses couverts', lieu);
      /* La feuille de service : imprimée avec la réservation, puis retirée de la page. */
      await page.evaluate(() => { window.print = () => { window.__feuille = { texte: document.querySelector('.esp-feuille')?.innerText || '', mode: document.documentElement.classList.contains('esp-impression') }; }; });
      await page.locator('[data-imprimer-service]').click(); await attendre(250);
      await page.evaluate(() => dispatchEvent(new Event('afterprint'))); await attendre(150);
      const fe = await page.evaluate(() => ({ ...(window.__feuille || {}), reste: !!document.querySelector('.esp-feuille') || document.documentElement.classList.contains('esp-impression') }));
      if (!/Feuille de service/i.test(fe.texte || '') || !/Service Essai/.test(fe.texte || '') || !/Démonstration/.test(fe.texte || '') || !fe.mode || fe.reste) R.echec('espace : feuille de service', `imprimée « ${(fe.texte || '').replace(/\s+/g, ' ').slice(0, 70)} », mode impression ${fe.mode}, encore là après ${fe.reste}`, lieu);
      /* La barre comprend « feuille de service ». */
      await aller(page, 'jour'); await page.keyboard.press('Control+k'); await attendre(350);
      await page.locator('#barre-champ').fill('feuille de service'); await attendre(250); await page.keyboard.press('Enter'); await attendre(500);
      if (!(await page.locator('[role="tab"][data-onglet="service"][aria-selected="true"]').isVisible().catch(() => false))) R.echec('espace : service', 'la barre n’ouvre pas l’onglet « Service » pour « feuille de service »', lieu);
      [...new Set(erreurs)].forEach((x) => R.echec('erreur de console ou ressource', x, lieu));
      R.ok('espace : service');
    } finally { await ctx.close(); }
  }

  /* ---------- 1 septies. Le plan de salle et la fiche client ---------- */
  if (!SEUL || SEUL.includes('1-septies')) {
    const taille = T('1366×768'), lieu = { page: P, taille: taille.nom };
    const { ctx, page, erreurs } = await contexte({ taille });
    try {
      await entrer(page);
      const etat = () => page.evaluate(() => JSON.parse(localStorage.getItem('jh-espace:v1') || '{}'));
      await page.keyboard.press('Control+k'); await attendre(350);
      await page.locator('#barre-champ').fill('table pour 4 samedi 20 h au nom de Salle Essai'); await attendre(250); await page.keyboard.press('Enter'); await attendre(500);
      const r = ((await etat()).resa?.ajouts || []).at(-1);
      if (!r) { R.echec('espace : plan de salle', 'la réservation notée par la barre n’est pas enregistrée', lieu); return; }
      await aller(page, 'resas:agenda'); await page.locator(`[data-jour="${r.date}"]`).click().catch(() => {}); await attendre(250); await aller(page, 'resas:salle');
      await page.locator('[data-service-vu="soir"]').click().catch(() => {}); await attendre(350);
      const Pn = '[data-esp-panneau-resas]', chip = page.locator(`${Pn} [data-choisir-resa="${r.id}"]`);
      const lire = () => page.evaluate(() => ({ aPlacer: [...document.querySelectorAll('[data-esp-panneau-resas] [data-choisir-resa] small')].filter((x) => /à placer/.test(x.textContent)).length, etiquettes: document.querySelectorAll('[data-esp-panneau-resas] [data-choisir-resa]').length, conflits: document.querySelectorAll('.esp-table.est-conflit').length, resume: document.querySelector('.esp-service-tete__resume')?.textContent || '' }));
      /* Une réservation touchée : une seule table proposée, assez grande, en salle. */
      await chip.click(); await attendre(350);
      const prop = await page.evaluate(() => { const l = [...document.querySelectorAll('.esp-table.est-proposee')]; return { n: l.length, id: l[0]?.dataset.table, dit: l[0]?.getAttribute('aria-label') || '', consigne: document.querySelector('.esp-salle__consigne')?.textContent || '', choisie: document.querySelector('[data-choisir-resa][aria-pressed="true"]')?.dataset.choisirResa }; });
      const places = +(prop.dit.match(/(\d+) places/) || [0, 0])[1];
      if (prop.n !== 1 || places < 4 || /Terrasse/.test(prop.dit) || !/Salle Essai/.test(prop.consigne) || prop.choisie !== r.id) R.echec('espace : plan de salle', `table proposée : ${prop.n} (« ${prop.dit.slice(0, 70)} »), consigne « ${prop.consigne.slice(0, 70)} »`, lieu);
      await page.locator(`${Pn} [data-table="${prop.id}"]`).click(); await attendre(450);
      const assise = await page.evaluate((id) => document.querySelector(`[data-table="${id}"]`)?.getAttribute('aria-label') || '', prop.id);
      if ((await etat()).resa?.tables?.[r.id] !== prop.id || !/Salle Essai/.test(assise) || !new RegExp(`table\\s${prop.id}`).test(await chip.innerText())) R.echec('espace : plan de salle', `la réservation n’est pas assise à la table ${prop.id} (enregistré ${JSON.stringify((await etat()).resa?.tables)}, table « ${assise.slice(0, 80)} »)`, lieu);
      await page.locator('[data-esp-annuler]').click(); await attendre(400);
      if ((await etat()).resa?.tables?.[r.id] || !/à placer/.test(await chip.innerText())) R.echec('espace : plan de salle', '« Annuler » ne relève pas la réservation de sa table', lieu);
      /* Placer tout seul : tout le monde assis (ou dit sans table), jamais deux tablées ensemble. */
      const avant = await lire();
      await page.locator('[data-placer-tout]').click(); await attendre(500);
      const apres = await lire(), tables = (await etat()).resa?.tables || {}, toast = await page.locator('[data-esp-toast-texte]').innerText().catch(() => '');
      if (!avant.aPlacer || apres.conflits || Object.keys(tables).length + apres.aPlacer !== avant.aPlacer || (apres.aPlacer ? !/Sans table/.test(toast) : !/toutes placées|placée/.test(apres.resume))) R.echec('espace : plan de salle', `« Placer tout seul » : ${avant.aPlacer} à placer avant, ${Object.keys(tables).length} assises, ${apres.aPlacer} restent, ${apres.conflits} conflit(s), résumé « ${apres.resume} », message « ${toast.slice(0, 60)} »`, lieu);
      const table = tables[r.id];
      /* L'onglet « Service » et la feuille portent la table. */
      await aller(page, 'resas:service'); await page.locator('[data-service-vu="soir"]').click().catch(() => {}); await attendre(350);
      const ligne = (await page.locator(`${Pn} [data-resa="${r.id}"]`).innerText().catch(() => '')).replace(/\s+/g, ' ');
      if (table && !new RegExp(`table ${table}\\b`).test(ligne)) R.echec('espace : plan de salle', `la frise ne dit pas la table (« ${ligne.slice(0, 90)} »)`, lieu);
      /* La fiche client : ouverte au nom, « Habitué » et une allergie notés, visibles sur la réservation et la feuille. */
      await page.locator(`${Pn} [data-resa="${r.id}"] [data-client]`).click(); await attendre(450);
      const fen = await page.evaluate(() => { const d = document.querySelector('.esp-modale--fiche [role="dialog"]'); return { ouverte: !!d && !d.closest('.esp-modale').hidden, titre: d?.querySelector('h2')?.textContent || '', focus: document.activeElement?.matches('[data-fermer-client]') }; });
      if (!fen.ouverte || !/Salle Essai/.test(fen.titre) || !fen.focus) R.echec('espace : fiche client', `fenêtre ouverte ${fen.ouverte}, titre « ${fen.titre} », focus sur « Fermer » ${fen.focus}`, lieu);
      await page.locator('[data-form-client] input[name="habitue"]').check(); await attendre(200);
      await page.locator('[data-form-client] input[value="Gluten"]').check(); await attendre(300);
      const note = Object.values((await etat()).clients || {})[0];
      if (!note?.habitue || (note.allergies || []).join() !== 'Gluten' || !/Enregistré/.test(await page.locator('[data-client-etat]').innerText())) R.echec('espace : fiche client', `ce qui est noté n’est pas enregistré (${JSON.stringify(note)})`, lieu);
      await page.keyboard.press('Escape'); await attendre(450);
      const fin = await page.evaluate((sel) => ({ fermee: document.querySelector('.esp-modale--fiche').hidden, focus: document.activeElement?.matches('.esp-client'), ligne: (document.querySelector(sel)?.innerText || '').replace(/\s+/g, ' ') }), `${Pn} [data-resa="${r.id}"]`);
      if (!fin.fermee || !fin.focus || !/Habitué/.test(fin.ligne) || !/Allergies : gluten/.test(fin.ligne)) R.echec('espace : fiche client', `fermée à Échap ${fin.fermee}, focus rendu ${fin.focus}, ligne « ${fin.ligne.slice(0, 110)} »`, lieu);
      await page.evaluate(() => { window.print = () => { window.__feuille = [...document.querySelectorAll('.esp-feuille tbody tr')].map((tr) => [...tr.cells].map((td) => td.textContent.replace(/\s+/g, ' ').trim())); }; });
      await page.locator('[data-imprimer-service]').click(); await attendre(250); await page.evaluate(() => dispatchEvent(new Event('afterprint'))); await attendre(150);
      const rang = (await page.evaluate(() => window.__feuille || [])).find((c) => /Salle Essai/.test(c[1] || '')) || [];
      if (!/Allergies : gluten/.test(rang[3] || '') || (table && rang[5] !== table)) R.echec('espace : fiche client', `la feuille de service ne porte pas l’allergie ou la table (${JSON.stringify(rang)})`, lieu);
      /* La table dit qui s'y assoit ; « Retirer de la table » la libère. */
      await aller(page, 'resas:salle'); await page.locator('[data-service-vu="soir"]').click().catch(() => {}); await attendre(350);
      if (table) {
        await page.locator(`${Pn} [data-table="${table}"]`).click(); await attendre(400);
        const fiche = (await page.locator('[data-fiche-table]').innerText().catch(() => '')).replace(/\s+/g, ' ');
        await page.locator(`[data-fiche-table] [data-retirer-table="${r.id}"]`).click(); await attendre(450);
        if (!/Salle Essai/.test(fiche) || (await etat()).resa?.tables?.[r.id] !== '' || !/à placer/.test(await chip.innerText())) R.echec('espace : plan de salle', `fiche de la table « ${fiche.slice(0, 80)} », après « Retirer » : ${JSON.stringify((await etat()).resa?.tables?.[r.id])}`, lieu);
      }
      /* La barre comprend « plan de salle ». */
      await aller(page, 'jour'); await page.keyboard.press('Control+k'); await attendre(350);
      await page.locator('#barre-champ').fill('plan de salle'); await attendre(250); await page.keyboard.press('Enter'); await attendre(500);
      if (!(await page.locator('[role="tab"][data-onglet="salle"][aria-selected="true"]').isVisible().catch(() => false))) R.echec('espace : plan de salle', 'la barre n’ouvre pas l’onglet « Salle » pour « plan de salle »', lieu);
      [...new Set(erreurs)].forEach((x) => R.echec('erreur de console ou ressource', x, lieu));
      R.ok('espace : plan de salle et fiche client');
    } finally { await ctx.close(); }
  }

  /* ---------- 1 octies. La cohérence (lot A) ---------- */
  if (!SEUL || SEUL.includes('1-octies')) {
    const taille = T('1366×768'), lieu = { page: P, taille: taille.nom };
    const { ctx, page, erreurs } = await contexte({ taille });
    try {
      await entrer(page);
      const etat = () => page.evaluate(() => JSON.parse(localStorage.getItem('jh-espace:v1') || '{}'));
      const poser = (S) => page.evaluate((x) => { if (x) localStorage.setItem('jh-espace:v1', JSON.stringify({ ...x, _schema: 2 })); else localStorage.removeItem('jh-espace:v1'); }, S);
      const jours = await page.evaluate(() => { const iso = (k) => { const d = new Date(Date.now() + k * 864e5); return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(d); }; const l = Array.from({ length: 14 }, (_, k) => iso(k + 2)), j = (x) => new Date(x + 'T12:00:00Z').getUTCDay(); return { mercredi: l.find((x) => j(x) === 3), mardi: l.find((x) => j(x) === 2), vendredi: l.find((x) => j(x) === 5) }; });
      const publique = async (date, service) => { await page.goto(`${BASE}/reserver?date=${date}&service=${service}#formulaire`, { waitUntil: 'load' }); await attendrePret(page); await attendre(600);
        return page.evaluate((sv) => { const f = document.querySelector('[data-resa-form]'), r = f?.querySelector(`[name="service"][value="${sv}"]`); return { date: f?.elements.date?.value, ouvert: !!r && !r.disabled, note: r?.closest('label')?.querySelector('[data-note]')?.textContent || '', heures: f?.querySelector('[name="service"]:checked')?.value === sv ? [...f.querySelectorAll('input[name="heure"]')].map((x) => x.value) : [] }; }, service); };
      const SEM = { lundi: [], mardi: [], mercredi: ['13:00-14:30'], jeudi: ['12:00-14:30'], vendredi: ['12:00-14:30', '19:00-00:00'], samedi: ['19:00-00:00'], dimanche: ['12:00-16:00'] };
      /* Horaires déplacés à 13 h le mercredi : le site ne propose plus midi ; la Saint-Sylvestre reste ouverte. */
      await poser({ horaires: { semaine: SEM } });
      const mer = await publique(jours.mercredi, 'midi');
      if (!mer.ouvert || mer.heures[0] !== '13:00' || mer.heures.some((h) => h < '13:00')) R.echec('cohérence : ouverture à 13 h', `la page Réserver propose encore ${mer.heures.slice(0, 3).join(', ')} un mercredi qui ouvre à 13 h`, { page: '/reserver', taille: taille.nom });
      const an = new Date().getFullYear(), syl = [`${an}-12-31`, `${an + 1}-12-31`].find((d) => d === '2026-12-31');
      if (syl && Date.now() < Date.parse('2026-11-02')) R.regarder('cohérence : Saint-Sylvestre', 'la date est au-delà de l’horizon de réservation : non vérifiée dans la page', lieu);
      else if (syl && Date.now() < Date.parse('2026-12-31')) { const s = await publique(syl, 'soir'); if (!s.ouvert || !s.heures.length) R.echec('cohérence : Saint-Sylvestre', `le soir du 31 décembre n’est plus proposé sur Réserver quand les horaires de la semaine ont été modifiés (${JSON.stringify(s)})`, { page: '/reserver', taille: taille.nom }); }
      /* Dans l'espace, le même mercredi : l'ajout au téléphone ne propose pas midi non plus. */
      await entrer(page); await aller(page, 'resas:agenda');
      for (let i = 0; i < 3 && !(await page.locator(`[data-jour="${jours.mercredi}"]`).count()); i++) { await page.locator('[data-semaine="7"]').click({ force: true }); await attendre(250); }
      await page.locator(`[data-jour="${jours.mercredi}"]`).click(); await attendre(300); await page.locator('[data-ajouter]').first().click(); await attendre(300);
      const heuresEspace = await page.evaluate(() => [...document.querySelectorAll('#aj-h option[data-sv="midi"]')].map((o) => o.value));
      if (heuresEspace[0] !== '13:00' || heuresEspace.join() !== mer.heures.join()) R.echec('cohérence : ouverture à 13 h', `l’espace propose ${heuresEspace.join(', ')} et le site ${mer.heures.join(', ')}`, lieu);
      /* Un mardi ouvert exceptionnellement depuis l'agenda : réservable sur le site ; retiré, il ne l'est plus. */
      await poser(null); await entrer(page); await aller(page, 'resas:agenda');
      for (let i = 0; i < 3 && !(await page.locator(`[data-jour="${jours.mardi}"]`).count()); i++) { await page.locator('[data-semaine="7"]').click({ force: true }); await attendre(250); }
      await page.locator(`[data-jour="${jours.mardi}"]`).click(); await attendre(300);
      await page.locator('[data-ouvrir-exc="soir"]').click(); await attendre(400);
      const colonne = (await page.locator('#sv-soir').innerText().catch(() => '')).replace(/\s+/g, ' ');
      if (!/Ouverture exceptionnelle/.test(colonne) || !/arrivées de 19 h à 21 h 30/.test(colonne) || ((await etat()).resa?.ouvertures || []).length !== 1) R.echec('cohérence : ouverture exceptionnelle', `l’agenda ne montre pas le service ouvert (« ${colonne} »)`, lieu);
      const mar = await publique(jours.mardi, 'soir');
      if (!mar.ouvert || mar.heures[0] !== '19:00') R.echec('cohérence : ouverture exceptionnelle', `le mardi soir ouvert depuis l’agenda n’est pas réservable sur le site (${JSON.stringify(mar)})`, { page: '/reserver', taille: taille.nom });
      await entrer(page);
      /* La barre : un jour fermé, une date qui n'existe pas, une heure qui n'est pas une arrivée. Rien n'est noté d'office. */
      const dire = async (phrase, entree = true) => { await page.keyboard.press('Control+k'); await attendre(300); await page.locator('#barre-champ').fill(phrase); await attendre(250);
        const l = await page.evaluate(() => [...document.querySelectorAll('#barre-liste [data-option]')].map((li) => ({ titre: li.querySelector('b')?.textContent || '', inactive: li.classList.contains('est-inactive'), choisie: li.getAttribute('aria-selected') === 'true' })));
        if (entree) { await page.keyboard.press('Enter'); await attendre(350); } const ouverte = await page.locator('#barre-champ').isVisible(); if (ouverte) { await page.keyboard.press('Escape'); await attendre(250); } return { l, ouverte }; };
      await poser(null); await entrer(page);
      const nb = async () => ((await etat()).resa?.ajouts || []).length;
      const ferme = await dire('table pour 4 lundi 20 h au nom de Essai');
      if (!/Pas de service/.test(ferme.l[0]?.titre || '') || await nb()) R.echec('cohérence : barre', `un lundi, fermé : « ${ferme.l[0]?.titre} », ${await nb()} réservation(s) notée(s)`, lieu);
      const fev = await dire('fermer le 31 février');
      if (!/n'existe pas/.test(fev.l[0]?.titre || '') || !fev.ouverte || Object.keys((await etat()).resa?.fermes || {}).length) R.echec('cohérence : barre', `« fermer le 31 février » : « ${fev.l[0]?.titre} », barre restée ouverte ${fev.ouverte}`, lieu);
      const h = await dire('table pour 4 vendredi 20 h 10 au nom de Essai');
      if (!/n'est pas une heure d'arrivée/.test(h.l[0]?.titre || '') || h.l.length < 3 || h.l.some((x) => x.choisie) || await nb() || !h.ouverte) R.echec('cohérence : barre', `une heure qui n’est pas une arrivée : « ${h.l.map((x) => x.titre).join(' | ').slice(0, 120)} », choix d’office ${h.l.some((x) => x.choisie)}, ${await nb()} notée(s)`, lieu);
      /* Le choix fait à la main, lui, est noté. */
      await page.keyboard.press('Control+k'); await attendre(300); await page.locator('#barre-champ').fill('table pour 4 vendredi 20 h 10 au nom de Essai'); await attendre(250);
      await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter'); await attendre(450);
      const notee = ((await etat()).resa?.ajouts || [])[0];
      if (!notee || !['20:00', '20:15'].includes(notee.heure) || +notee.couverts !== 4) R.echec('cohérence : barre', `le choix fait aux flèches n’est pas noté (${JSON.stringify(notee)})`, lieu);
      /* Deux onglets : « Annuler » dans le premier ne défait pas ce que le second a fait ensuite. */
      const autre = await ctx.newPage(); await autre.goto(BASE + P, { waitUntil: 'load' }); await attendrePret(autre);
      await aller(page, 'site:horaires'); await page.locator('[data-annonce-active]').click(); await attendre(350);
      await autre.evaluate(() => { const S = JSON.parse(localStorage.getItem('jh-espace:v1') || '{}'); (S.resa ||= {}).fermes = { '2027-01-05': ['midi'] }; localStorage.setItem('jh-espace:v1', JSON.stringify(S)); }); await attendre(350);
      await page.locator('[data-esp-annuler]').click(); await attendre(450);
      const apres = await etat();
      if (apres.annonce?.active || apres.resa?.fermes?.['2027-01-05']?.join() !== 'midi' || !(apres.resa?.ajouts || []).length) R.echec('cohérence : annuler', `« Annuler » a défait autre chose que son geste : annonce ${JSON.stringify(apres.annonce)}, fermeture posée ailleurs ${JSON.stringify(apres.resa?.fermes)}`, lieu);
      await autre.close();
      /* Deux champs saisis coup sur coup (moins d'une demi-seconde) : les deux sont enregistrés. */
      await aller(page, 'site:textes');
      const champs = await page.evaluate(() => [...document.querySelectorAll('[data-form-textes] textarea, [data-form-textes] input[type="text"], [data-form-textes] input:not([type])')].slice(0, 2).map((c) => c.name));
      if (champs.length === 2) {
        await page.locator(`[data-form-textes] [name="${champs[0]}"]`).fill('Premier texte du lot A'); await page.locator(`[data-form-textes] [name="${champs[1]}"]`).fill('Second texte du lot A'); await attendre(900);
        const t = (await etat()).textes || {};
        if (t[champs[0]] !== 'Premier texte du lot A' || t[champs[1]] !== 'Second texte du lot A') R.echec('cohérence : saisie', `deux champs saisis coup sur coup : enregistrés ${JSON.stringify(t)}`, lieu);
        /* Un champ saisi puis la rubrique quittée aussitôt : enregistré quand même. */
        await page.locator(`[data-form-textes] [name="${champs[0]}"]`).fill('Texte quitté aussitôt'); await page.locator('[data-esp-vue="jour"]').click(); await attendre(200);
        if (((await etat()).textes || {})[champs[0]] !== 'Texte quitté aussitôt') R.echec('cohérence : saisie', 'un champ saisi puis la rubrique quittée aussitôt n’est pas enregistré', lieu);
      } else R.regarder('cohérence : saisie', 'moins de deux textes modifiables : saisie rapide non vérifiée', lieu);
      /* Le navigateur refuse d'enregistrer : c'est dit, rien n'est confirmé, l'écran ne change pas. */
      await aller(page, 'site:horaires');
      await page.evaluate(() => { Storage.prototype.setItem = function () { throw new DOMException('plein', 'QuotaExceededError'); }; });
      const pressee = await page.locator('[data-annonce-active]').getAttribute('aria-pressed');
      await page.locator('[data-annonce-active]').click(); await attendre(450);
      const refus = await page.evaluate(() => ({ message: document.querySelector('[data-esp-toast-texte]')?.textContent || '', statut: document.querySelector('[data-esp-sauve]')?.dataset.etat || '', annulable: !document.querySelector('[data-esp-annuler]')?.hidden }));
      if (!/refuse d'enregistrer/.test(refus.message) || refus.statut !== 'refus' || refus.annulable || /Annonce (affichée|retirée)/.test(refus.message)) R.echec('cohérence : refus', `enregistrement refusé : message « ${refus.message.slice(0, 70)} », statut ${refus.statut}, « Annuler » proposé ${refus.annulable} (bascule ${pressee})`, lieu);
      [...new Set(erreurs)].filter((x) => !/QuotaExceeded|plein/.test(x)).forEach((x) => R.echec('erreur de console ou ressource', x, lieu));
      R.ok('cohérence : mêmes règles pour le site et l’équipe');
    } finally { await ctx.close(); }
  }

  /* ---------- 1 nonies. La stabilisation (v7.8.1) ---------- */
  if (!SEUL || SEUL.includes('1-nonies')) {
    const taille = T('1366×768'), lieu = { page: P, taille: taille.nom }, pub = (page) => ({ page, taille: taille.nom });
    const { ctx, page, erreurs } = await contexte({ taille });
    try {
      const etat = () => page.evaluate(() => JSON.parse(localStorage.getItem('jh-espace:v1') || '{}'));
      const poser = (S) => page.evaluate((x) => { if (x) localStorage.setItem('jh-espace:v1', JSON.stringify({ ...x, _schema: 2 })); else localStorage.removeItem('jh-espace:v1'); }, S);
      const iso = (k) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date(Date.now() + k * 864e5));
      const vendredi = Array.from({ length: 14 }, (_, k) => iso(k + 2)).find((x) => new Date(x + 'T12:00:00Z').getUTCDay() === 5);
      /* A. Réserver : un enregistrement refusé ne dit pas « envoyée », garde la saisie et permet de reprendre. */
      await page.goto(`${BASE}/reserver?date=${vendredi}&service=soir#formulaire`, { waitUntil: 'load' }); await attendrePret(page); await attendre(500);
      await page.locator('input[name="heure"]:not(:disabled)').first().check({ force: true }); await attendre(200);
      for (let i = 0; i < 4 && await page.locator('[data-etape-suivante]').isVisible(); i++) { await page.locator('[data-etape-suivante]').click(); await attendre(450); }
      await page.fill('[name="prenom"]', 'Claire'); await page.fill('[name="nom"]', 'Reprise'); await page.fill('[name="telephone"]', '06 00 00 00 00');
      await page.locator('[data-resa-form] button[type="submit"]').click(); await attendre(600);
      const bouton = (await page.locator('[data-resa-confirmer]').innerText()).trim();
      await page.evaluate(() => { const vrai = Storage.prototype.setItem; window.__vrai = vrai; Storage.prototype.setItem = function (k, v) { if (String(k).startsWith('jh-espace-resas')) throw new DOMException('plein', 'QuotaExceededError'); return vrai.call(this, k, v); }; });
      await page.locator('[data-resa-confirmer]').click(); await attendre(900);
      const refus = await page.evaluate(() => ({ envoye: document.querySelector('[data-module="reservation-de-table"]')?.classList.contains('est-envoye'), texte: document.querySelector('[data-resa-recap]')?.innerText.replace(/\s+/g, ' ') || '', nom: document.querySelector('[name="nom"]')?.value, memoire: JSON.parse(localStorage.getItem('jh-espace-resas:v1') || '[]').length, bouton: document.querySelector('[data-resa-confirmer]')?.disabled }));
      if (refus.envoye || /Référence|Demande reçue/.test(refus.texte) || !/n'a pas pu être enregistrée/.test(refus.texte) || refus.nom !== 'Reprise' || refus.memoire || refus.bouton) R.echec('stabilisation : réussite avant enregistrement', `enregistrement refusé : dit envoyé ${refus.envoye}, texte « ${refus.texte.slice(-110)} », saisie gardée ${refus.nom === 'Reprise'}, bouton bloqué ${refus.bouton}`, pub('/reserver'));
      await page.evaluate(() => { Storage.prototype.setItem = window.__vrai; });
      await page.locator('[data-resa-confirmer]').click(); await attendre(1500);
      const reussi = await page.evaluate(() => ({ texte: document.querySelector('[data-resa-recap]')?.innerText.replace(/\s+/g, ' ') || '', memoire: JSON.parse(localStorage.getItem('jh-espace-resas:v1') || '[]') }));
      if (!/Votre demande est envoyée/i.test(reussi.texte) || !/Demande reçue/i.test(reussi.texte) || !/Référence R-/.test(reussi.texte) || /table est réservée/i.test(reussi.texte) || reussi.memoire.length !== 1 || !/Envoyer ma demande/.test(bouton)) R.echec('stabilisation : demande et réservation', `après reprise : « ${reussi.texte.slice(0, 120)} », ${reussi.memoire.length} demande(s) en mémoire, bouton « ${bouton} »`, pub('/reserver'));
      await page.evaluate(() => { localStorage.removeItem('jh-espace-resas:v1'); sessionStorage.clear(); });
      /* B. Réserver : une table de deux souhaitée sur le plan, puis dix couverts : la table est retirée et c'est dit. */
      await page.goto(`${BASE}/reserver?date=${vendredi}&service=soir&table=1&couverts=2#formulaire`, { waitUntil: 'load' }); await attendrePret(page); await attendre(500);
      const avantTable = await page.evaluate(() => document.querySelector('[data-resa-form] [name="table"]')?.value);
      await page.evaluate(() => { const c = document.querySelector('[data-resa-form] [name="couverts"]'); c.value = '10'; c.dispatchEvent(new Event('input', { bubbles: true })); c.dispatchEvent(new Event('change', { bubbles: true })); }); await attendre(400);
      const apresTable = await page.evaluate(() => ({ table: document.querySelector('[data-resa-form] [name="table"]')?.value, couverts: document.querySelector('[data-resa-form] [name="couverts"]')?.value, dit: [...document.querySelectorAll('[data-resa-table-choisie]')].map((x) => x.textContent).join(' ') }));
      if (avantTable !== '1' || apresTable.table !== '' || apresTable.couverts !== '10' || !/table 1 \(2 places\) ne convient pas pour 10 personnes/.test(apresTable.dit)) R.echec('stabilisation : table incompatible', `table avant « ${avantTable} », après ${JSON.stringify(apresTable)}`, pub('/reserver'));
      await page.evaluate(() => sessionStorage.clear());
      /* C. Réserver : l'heure choisie devient trop proche pendant que la page reste ouverte : refusée au moment d'envoyer. */
      const jour = Array.from({ length: 14 }, (_, k) => iso(k + 1)).find((x) => [3, 4, 5, 0].includes(new Date(x + 'T12:00:00Z').getUTCDay()));
      const heureLocale = (h, m) => new Date(`${jour}T${String(h - 1).padStart(2, '0')}:${String(m).padStart(2, '0')}:00Z`); /* Paris est à UTC+1 de fin octobre à fin mars */
      const hiver = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', hour: '2-digit', hour12: false }).format(heureLocale(10, 0)) === '10';
      if (hiver) {
        await page.clock.install({ time: heureLocale(10, 0) });
        await page.goto(`${BASE}/reserver?date=${jour}&service=midi#formulaire`, { waitUntil: 'load' }); await page.clock.runFor(4000); await attendre(300);
        await page.locator('input[name="heure"][value="12:00"]').check({ force: true }); await page.clock.runFor(300);
        for (let i = 0; i < 4 && await page.locator('[data-etape-suivante]').isVisible(); i++) { await page.locator('[data-etape-suivante]').click(); await page.clock.runFor(700); }
        await page.fill('[name="prenom"]', 'Claire'); await page.fill('[name="nom"]', 'Retard'); await page.fill('[name="telephone"]', '06 00 00 00 00');
        await page.locator('[data-resa-form] button[type="submit"]').click(); await page.clock.runFor(800);
        await page.clock.setFixedTime(heureLocale(11, 10));
        await page.locator('[data-resa-confirmer]').click(); await page.clock.runFor(900); await attendre(200);
        const tard = await page.evaluate(() => ({ envoye: document.querySelector('[data-module="reservation-de-table"]')?.classList.contains('est-envoye'), erreur: [...document.querySelectorAll('[data-resa-form] [role="alert"], [data-resa-form] .resa__erreur, [data-resa-form] [data-erreur]')].map((x) => x.textContent).join(' ').replace(/\s+/g, ' '), midi: !!document.querySelector('input[name="heure"][value="12:00"]:not(:disabled)'), memoire: JSON.parse(localStorage.getItem('jh-espace-resas:v1') || '[]').length }));
        if (tard.envoye || tard.memoire || tard.midi || !/n'est pas partie/.test(tard.erreur)) R.echec('stabilisation : validation finale', `à 11 h 10, pour midi : envoyée ${tard.envoye}, ${tard.memoire} en mémoire, midi encore proposé ${tard.midi}, message « ${tard.erreur.slice(0, 110)} »`, pub('/reserver'));
        /* Après minuit, la page ne garde pas la veille : le premier jour proposé est le lendemain. */
        await page.clock.setFixedTime(new Date(heureLocale(10, 0).getTime() + 864e5)); await page.clock.runFor(61000); await attendre(200);
        const lendemain = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date(heureLocale(10, 0).getTime() + 864e5));
        const min = await page.evaluate(() => ({ min: document.querySelector('[data-resa-form] [name="date"]')?.min, date: document.querySelector('[data-resa-form] [name="date"]')?.value }));
        if (min.min !== lendemain || min.date < lendemain) R.echec('stabilisation : minuit', `le lendemain, la page Réserver garde le ${min.min} comme premier jour (date choisie ${min.date}), attendu ${lendemain}`, pub('/reserver'));
      } else R.regarder('stabilisation : validation finale', 'heure d’été : le scénario de 11 h 10 n’a pas été rejoué dans le navigateur (il l’est par les tests unitaires)', pub('/reserver'));
    } finally { await ctx.close(); }
    const { ctx: ctx2, page: p2, erreurs: err2 } = await contexte({ taille });
    try {
      const page = p2, etat = () => page.evaluate(() => JSON.parse(localStorage.getItem('jh-espace:v1') || '{}'));
      const poser = async (S) => { await page.goto(BASE + '/404', { waitUntil: 'load' }).catch(() => {}); await page.evaluate((x) => { if (x) localStorage.setItem('jh-espace:v1', JSON.stringify({ ...x, _schema: 2 })); else localStorage.removeItem('jh-espace:v1'); }, S); };
      const iso = (k) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date(Date.now() + k * 864e5));
      /* D. Accueil : tout est fermé trois semaines, toutes les soirées sont masquées : rien d'ancien n'est gardé. */
      const agenda = await page.goto(BASE + P, { waitUntil: 'load' }).then(() => page.evaluate(() => JSON.parse(document.querySelector('[data-esp-donnees]').textContent).agenda.map((e) => ({ id: e.id, titre: e.titre, debut: e.debut, type: e.type, prix: e.prix }))));
      await poser({ horaires: { exceptions: [{ du: iso(0), au: iso(40), motif: 'Congés annuels' }] }, evenements: { modifs: Object.fromEntries(agenda.map((e) => [e.id, { masque: true }])), liste: agenda.map((e) => ({ ...e, masque: true })) } });
      await page.goto(BASE + '/', { waitUntil: 'load' }); await attendrePret(page); await attendre(700);
      const vide = await page.evaluate(() => { const f = document.querySelector('[data-mini-resa]'); return { choix: f ? f.querySelectorAll('[name="service"]').length : -1, message: f?.querySelector('.mini-resa__vide')?.textContent || '', bouton: f ? [...f.querySelectorAll('button[type="submit"]')].every((b) => b.disabled) : null, rdv: [...document.querySelectorAll('[data-heros-rdv-lien]')].filter((x) => !x.hidden && x.offsetParent).length, soiree: [...document.querySelectorAll('[data-prochaine-soiree]')].filter((x) => !x.hidden && x.offsetParent).length }; });
      if (vide.choix !== 0 || !/Aucun service/.test(vide.message) || vide.bouton !== true) R.echec('stabilisation : mini-réservation vide', `tout fermé : ${vide.choix} choix gardés, message « ${vide.message.slice(0, 60)} », bouton désactivé ${vide.bouton}`, { page: '/', taille: taille.nom });
      if (vide.rdv || vide.soiree) R.echec('stabilisation : annonce gardée', `toutes les soirées masquées : rendez-vous du haut de page encore affiché ${vide.rdv}, prochaine soirée encore affichée ${vide.soiree}`, { page: '/', taille: taille.nom });
      /* E. Une ouverture exceptionnelle posée dans l'espace est dite dans les horaires affichés. */
      const mardi = Array.from({ length: 14 }, (_, k) => iso(k + 1)).find((x) => new Date(x + 'T12:00:00Z').getUTCDay() === 2);
      await poser({ resa: { ouvertures: [{ date: mardi, service: 'soir', note: 'Soirée privée' }] } });
      await page.goto(BASE + '/infos-pratiques', { waitUntil: 'load' }); await attendrePret(page); await attendre(700);
      const noter = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
      if (!/Soirée privée/.test(noter)) R.echec('stabilisation : ouverture exceptionnelle', 'l’ouverture exceptionnelle posée dans l’espace n’est pas dite dans les horaires de la page Infos pratiques', { page: '/infos-pratiques', taille: taille.nom });
      /* F. Espace : une fiche client restée ouverte n'efface pas l'allergie notée dans un autre onglet. */
      await poser(null); await entrer(page); await aller(page, 'resas:agenda');
      const jours = await page.evaluate(() => [...document.querySelectorAll('[data-esp-rendu="resas"] [data-jour]')].map((b) => b.dataset.jour));
      let cle = '';
      for (const j of jours) { await page.locator(`[data-esp-rendu="resas"] [data-jour="${j}"]`).first().click().catch(() => {}); await attendre(200); cle = await page.evaluate(() => document.querySelector('[data-esp-rendu="resas"] [data-client]')?.dataset.client || ''); if (cle) break; }
      if (cle) {
        await page.locator(`[data-esp-rendu="resas"] [data-client="${cle}"]`).first().click(); await attendre(400);
        const autre = await ctx2.newPage(); await autre.goto(BASE + '/404', { waitUntil: 'load' }).catch(() => {});
        await autre.evaluate((c) => { const S = JSON.parse(localStorage.getItem('jh-espace:v1') || '{}'); (S.clients ||= {})[c] = { allergies: ['Arachides'] }; S._schema = 2; localStorage.setItem('jh-espace:v1', JSON.stringify(S)); }, cle); await attendre(400);
        await page.keyboard.press('Escape'); await attendre(400);
        const apres = (await etat()).clients?.[cle];
        if (apres?.allergies?.join() !== 'Arachides') R.echec('stabilisation : fiche client', `fermer une fiche intacte a écrasé l’allergie notée ailleurs (${JSON.stringify(apres)})`, lieu);
        /* Rouverte, « Habitué » coché : seul ce champ part, l'allergie reste. */
        await page.locator(`[data-esp-rendu="resas"] [data-client="${cle}"]`).first().click(); await attendre(400);
        await page.locator('[data-form-client] input[name="habitue"]').check(); await attendre(300); await page.keyboard.press('Escape'); await attendre(300);
        const fin = (await etat()).clients?.[cle];
        if (!fin?.habitue || fin.allergies?.join() !== 'Arachides') R.echec('stabilisation : fiche client', `après « Habitué » : ${JSON.stringify(fin)}`, lieu);
        await autre.close();
      } else R.regarder('stabilisation : fiche client', 'aucune réservation cette semaine : la fiche n’a pas été rejouée dans le navigateur', lieu);
      /* G. Deux modèles de message modifiés coup sur coup : les deux sont enregistrés. */
      await aller(page, 'site:messages');
      const modeles = await page.evaluate(() => [...document.querySelectorAll('[data-form-messages] textarea')].slice(0, 2).map((t) => t.name));
      if (modeles.length === 2) {
        await page.locator(`[data-form-messages] [name="${modeles[0]}"]`).fill('Premier modèle {prenom}'); await page.locator(`[data-form-messages] [name="${modeles[1]}"]`).fill('Second modèle {prenom}'); await attendre(900);
        const msg = (await etat()).messages || {};
        if (msg[modeles[0]] !== 'Premier modèle {prenom}' || msg[modeles[1]] !== 'Second modèle {prenom}') R.echec('stabilisation : saisie des messages', `deux modèles modifiés coup sur coup : enregistrés ${JSON.stringify(msg).slice(0, 140)}`, lieu);
      } else R.regarder('stabilisation : saisie des messages', 'moins de deux modèles de message : non rejoué', lieu);
      /* H. Après minuit, « Aujourd'hui » passe au lendemain sans rechargement. */
      await aller(page, 'jour');
      const avant = await page.evaluate(() => document.querySelector('[data-esp-rendu="jour"]')?.innerText.slice(0, 200) || '');
      await page.clock.install({ time: new Date() }); await page.clock.setFixedTime(new Date(Date.now() + 864e5)); await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange'))); await attendre(400);
      const lendemain = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(Date.now() + 864e5));
      const apresMinuit = await page.evaluate(() => document.querySelector('.esp-bonjour')?.innerText.replace(/\s+/g, ' ').slice(0, 200) || '');
      if (!apresMinuit.toLowerCase().includes(lendemain.toLowerCase())) R.echec('stabilisation : minuit', `le lendemain, « Aujourd’hui » dit encore « ${apresMinuit.slice(0, 80)} » (attendu ${lendemain})`, lieu);
      [...new Set(err2)].forEach((x) => R.echec('erreur de console ou ressource', x, lieu));
      R.ok('stabilisation v7.8.1');
    } finally { await ctx2.close(); }
  }

  /* ---------- 1 decies. Toute la maison au même endroit (v7.10.0) ----------
     Le parcours de démonstration : Aujourd'hui → priorité → demande → fiche client → agenda et service → briefing et
     tâche → retour à Aujourd'hui avec l'état à jour ; puis Offres et Site, la recherche, et le rechargement. Joué sur
     ordinateur et sur téléphone (où la barre du bas est Aujourd'hui, Demandes, Service, Plus). */
  for (const taille of (!SEUL || SEUL.includes('1-decies') ? ['1366×768', '390×844'] : []).map(T)) {
    const lieu = { page: P, taille: taille.nom }, tel = taille.w < 1000, ou = `maison (${taille.nom})`;
    const { ctx, page, erreurs } = await contexte({ taille });
    try {
      const texte = async (sel) => (await page.locator(sel).first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
      const vueOuverte = () => page.evaluate(() => document.querySelector('.esp-vue:not([hidden])')?.dataset.vue);
      const toast = () => texte('[data-esp-toast-texte]');
      await page.goto(BASE + P, { waitUntil: 'load' }); await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
      await entrer(page);
      /* La navigation : six rubriques sur ordinateur ; quatre entrées au téléphone, les autres dans « Plus ». */
      const nav = await page.evaluate(() => [...document.querySelectorAll('.esp-nav__liste > li')].filter((li) => li.offsetParent).map((li) => li.innerText.replace(/\s+/g, ' ').trim().replace(/ \d+$/, '')));
      const attendu = tel ? ['Jour', 'Demandes', 'Service', 'Plus'] : ['Aujourd\'hui', 'Demandes', 'Agenda', 'Offres', 'Clients', 'Site'];
      if (nav.join('|') !== attendu.join('|')) R.echec(`${ou} : navigation`, `rubriques visibles « ${nav.join(' · ')} », attendu « ${attendu.join(' · ')} »`, lieu);
      for (const v of ['demandes', 'resas', 'carte', 'clients', 'site', 'jour']) { await aller(page, v); if (await vueOuverte() !== v || !(await texte(`[data-esp-rendu="${v}"]`))) R.echec(`${ou} : navigation`, `la rubrique « ${v} » ne s'ouvre pas ou est vide`, lieu); }
      /* Aujourd'hui : les quatre zones, et des compteurs qui correspondent aux listes. */
      for (const [id, nom] of [['t-prochain', 'le prochain service'], ['t-priorites', 'les priorités'], ['t-fil', 'le fil de la journée'], ['t-taches', 'les tâches']]) if (!(await page.locator(`[data-esp-rendu="jour"] #${id}`).count())) R.echec(`${ou} : Aujourd'hui`, `la zone « ${nom} » manque`, lieu);
      const acc = await page.evaluate(() => { const c = [...document.querySelectorAll('[data-prochain] .esp-acc__chiffres li')].map((li) => [li.querySelector('span').textContent.trim(), +li.querySelector('b').textContent]); return { cle: document.querySelector('[data-prochain]')?.dataset.prochain, chiffres: Object.fromEntries(c), demandes: document.querySelectorAll('#t-attente ~ ul > li').length, badge: +(document.querySelector('[data-esp-badge="demandes"]:not([hidden])')?.textContent || 0), compte: +(document.querySelector('#t-attente .esp-acc__compte')?.textContent || 0) }; });
      if (!acc.cle) R.echec(`${ou} : Aujourd'hui`, 'pas de prochain service affiché', lieu);
      if (acc.compte !== acc.badge) R.echec(`${ou} : compteurs`, `l'accueil annonce ${acc.compte} demandes, la rubrique Demandes ${acc.badge}`, lieu);
      const [jourSv, sv] = (acc.cle || '|').split('|');
      /* Une priorité mène à son objet : les réservations sans table → le plan de salle du bon service. */
      const aPlacer = Object.entries(acc.chiffres).find(([k]) => /sans table/.test(k))?.[1] ?? 0, prio = page.locator(`[data-esp-rendu="jour"] [data-faire-priorite^="placer-"]`);
      /* La priorité « à placer » n'existe que pour un service d'aujourd'hui ou de demain (règle de l'accueil) : un dimanche
         après le déjeuner, le prochain service est mercredi, et l'accueil ne presse pas de placer trois jours à l'avance. */
      const demain = await page.evaluate(() => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date(Date.now() + 86400000)));
      if (aPlacer > 0 && jourSv <= demain && !(await prio.count())) R.echec(`${ou} : priorités`, `${aPlacer} réservations à placer ${jourSv}, et aucune priorité ne le dit`, lieu);
      if (jourSv > demain && await prio.count()) R.echec(`${ou} : priorités`, `le prochain service est le ${jourSv} : l'accueil ne devrait pas presser de placer si tôt`, lieu);
      if (await prio.count()) { await prio.first().click(); await attendre(500);
        const ici = await page.evaluate(() => ({ vue: document.querySelector('.esp-vue:not([hidden])')?.dataset.vue, onglet: document.querySelector('[data-onglets-resas][aria-selected="true"]')?.dataset.onglet, aPlacer: document.querySelectorAll('[data-plan-salle] [data-resa-a-placer], [data-plan-salle] [data-a-placer] li').length }));
        if (ici.vue !== 'resas' || ici.onglet !== 'salle') R.echec(`${ou} : priorités`, `« Placer en salle » ouvre ${ici.vue}/${ici.onglet}`, lieu);
        const tout = page.locator('[data-placer-tout]'); if (await tout.count()) { await tout.click(); await attendre(600); }
        await aller(page, 'jour');
        const apres = await page.evaluate(() => +([...document.querySelectorAll('[data-prochain] .esp-acc__chiffres li')].find((li) => /placer/.test(li.textContent))?.querySelector('b').textContent ?? -1));
        if (!(apres < aPlacer)) R.echec(`${ou} : priorités`, `après « Placer tout seul », l'accueil annonce encore ${apres} réservations à placer (avant : ${aPlacer})`, lieu);
        if (apres === 0 && await page.locator('[data-esp-rendu="jour"] [data-faire-priorite^="placer-"]').count()) R.echec(`${ou} : priorités`, 'plus rien à placer, mais la priorité est encore là', lieu);
      }
      /* Une demande → la fiche du client → son agenda. */
      await aller(page, 'demandes'); await page.locator('[data-filtre="reception"], [data-filtre-demandes="reception"]').first().click().catch(() => {}); await attendre(300);
      await page.locator('[data-ouvrir-demande="demo-reception-1"]').click(); await attendre(350);
      const dem = await texte('[data-esp-rendu="demandes"] [data-demande="demo-reception-1"]');
      for (const mot of ['Camille R.', 'Réception', 'Nouvelle', 'Note pour l\'équipe', 'Tâches de suivi']) if (!dem.toLowerCase().replace(/’/g, '\'').includes(mot.toLowerCase())) R.echec(`${ou} : demande`, `la demande ouverte ne montre pas « ${mot} »`, lieu);
      await page.locator('[data-demande="demo-reception-1"] [data-tache-pour]').click(); await attendre(400);
      if (await vueOuverte() !== 'jour' || !/Camille R\./.test(await texte('[data-form-tache]'))) R.echec(`${ou} : tâche de suivi`, 'le formulaire ne s\'ouvre pas dans Aujourd\'hui, lié à la demande', lieu);
      await page.fill('[data-form-tache] [name="titre"]', 'Rappeler Camille pour la visite'); await page.fill('[data-form-tache] [name="responsable"]', 'Régis'); await page.locator('[data-form-tache] button[type="submit"]').click(); await attendre(400);
      if (!/Tâche ajoutée/.test(await toast()) || !/Rappeler Camille pour la visite/.test(await texte('.esp-taches'))) R.echec(`${ou} : tâche`, 'la tâche créée n\'apparaît pas dans Aujourd\'hui', lieu);
      await page.locator('.esp-taches [data-tache-lien]').first().click(); await attendre(450);
      if (await vueOuverte() !== 'demandes' || !/Rappeler Camille pour la visite/.test(await texte('[data-demande="demo-reception-1"] .esp-dem__taches'))) R.echec(`${ou} : tâche liée`, 'le lien de la tâche n\'ouvre pas la demande, ou la demande ne montre pas sa tâche', lieu);
      await page.locator('[data-demande="demo-reception-1"] [data-client]').first().click(); await attendre(400);
      const fiche = await texte('[data-client-boite]');
      if (!/Camille R\./.test(fiche) || !/Ses demandes/.test(fiche) || !/Mariage/.test(fiche) || !/Dans l'agenda/.test(fiche)) R.echec(`${ou} : fiche client`, `la fiche ne réunit pas la demande et l'agenda : « ${fiche.slice(0, 120)} »`, lieu);
      const venue = page.locator('[data-client-boite] [data-voir-resa]').first(), quand = await venue.getAttribute('data-date').catch(() => null);
      if (quand) { await venue.click(); await attendre(500);
        const ici = await page.evaluate(() => ({ vue: document.querySelector('.esp-vue:not([hidden])')?.dataset.vue, onglet: document.querySelector('[data-onglets-resas][aria-selected="true"]')?.dataset.onglet, titre: document.querySelector('.esp-service-tete h3')?.innerText.replace(/\s+/g, ' ') || '' }));
        if (ici.vue !== 'resas' || ici.onglet !== 'service') R.echec(`${ou} : fiche → agenda`, `une venue de la fiche ouvre ${ici.vue}/${ici.onglet}`, lieu);
      } else { await page.keyboard.press('Escape'); await attendre(200); R.echec(`${ou} : fiche client`, 'aucune venue à ouvrir depuis la fiche de Camille R.', lieu); }
      /* Le service : la date se change sur place ; « Préparer le service » ouvre le briefing du service affiché. */
      if (tel) { await page.locator('[data-esp-service]').click(); await attendre(450); if (await vueOuverte() !== 'resas' || !(await page.locator('[data-service]').count())) R.echec(`${ou} : Service`, 'le bouton « Service » n\'ouvre pas le service', lieu); }
      else { await aller(page, 'resas'); await page.locator('[data-onglets-resas][data-onglet="service"]').click(); await attendre(350); }
      const avant = await texte('.esp-service-tete h3'); await page.locator('.esp-service-tete [data-jour-pas="1"]').click(); await attendre(350); const apresJour = await texte('.esp-service-tete h3'); await page.locator('.esp-service-tete [data-jour-pas="-1"]').click(); await attendre(350);
      if (avant === apresJour || await texte('.esp-service-tete h3') !== avant) R.echec(`${ou} : Service`, 'les boutons « jour précédent / suivant » ne changent pas la date affichée', lieu);
      await aller(page, 'jour'); await page.locator('[data-esp-rendu="jour"] [data-briefing]').click(); await attendre(450);
      const brief = await page.evaluate(() => ({ cle: document.querySelector('.esp-brief')?.dataset.brief, texte: document.querySelector('.esp-brief')?.innerText.replace(/\s+/g, ' ') || '', conf: +([...document.querySelectorAll('.esp-brief__chiffres li')].find((li) => /réservation/.test(li.textContent))?.querySelector('b').textContent ?? -1), focus: !!document.activeElement?.closest('.esp-modale--brief') }));
      if (brief.cle !== acc.cle) R.echec(`${ou} : briefing`, `le briefing ouvert est celui de « ${brief.cle} », le prochain service est « ${acc.cle} »`, lieu);
      const confAccueil = Object.entries(acc.chiffres).find(([k]) => /^réservations?$/.test(k))?.[1];
      if (brief.conf !== confAccueil) R.echec(`${ou} : briefing`, `le briefing compte ${brief.conf} réservations, l'accueil ${confAccueil}`, lieu);
      for (const mot of ['grandes tablées', 'Occasions, allergies', 'Ce qui reste à traiter', 'Installations', 'Les tâches']) if (!brief.texte.includes(mot)) R.echec(`${ou} : briefing`, `la partie « ${mot} » manque`, lieu);
      if (!brief.focus) R.echec(`${ou} : briefing`, 'le focus n\'entre pas dans la fenêtre', lieu);
      const debord = await page.evaluate(() => { const b = document.querySelector('.esp-modale--brief .esp-modale__boite').getBoundingClientRect(); return b.right > innerWidth + 1 || b.left < -1; }); if (debord) R.echec(`${ou} : briefing`, 'la fenêtre dépasse de l\'écran', lieu);
      await page.locator('[data-brief-tache]').click(); await attendre(400);
      await page.fill('[data-form-tache] [name="titre"]', 'Sortir les chauffages de terrasse'); await page.locator('[data-form-tache] button[type="submit"]').click(); await attendre(400);
      await page.locator('[data-esp-rendu="jour"] [data-briefing]').click(); await attendre(400);
      if (!/Sortir les chauffages de terrasse/.test(await texte('.esp-brief'))) R.echec(`${ou} : briefing`, 'la tâche ajoutée pour ce service n\'est pas dans son briefing', lieu);
      await page.keyboard.press('Escape'); await attendre(250);
      if (await page.locator('.esp-modale--brief:not([hidden])').count()) R.echec(`${ou} : briefing`, 'Échap ne ferme pas le briefing', lieu);
      /* Terminer une tâche, recharger : tout est retrouvé. */
      await page.locator('.esp-tache', { hasText: 'Sortir les chauffages' }).locator('[data-tache-fait]').click(); await attendre(350);
      await page.locator('.esp-tache', { hasText: 'Rappeler Camille' }).locator('[data-tache-modifier]').click(); await attendre(250); await page.fill('[data-form-tache] [name="titre"]', 'Rappeler Camille R. pour la visite'); await page.locator('[data-form-tache] button[type="submit"]').click(); await attendre(350);
      await page.reload({ waitUntil: 'load' }); await attendrePret(page);
      const taches = await page.evaluate(() => [...document.querySelectorAll('.esp-tache')].map((li) => [li.querySelector('.esp-tache__titre')?.textContent, li.querySelector('[data-tache-fait]')?.getAttribute('aria-checked')]));
      if (JSON.stringify(taches) !== JSON.stringify([['Rappeler Camille R. pour la visite', 'false'], ['Sortir les chauffages de terrasse', 'true']])) R.echec(`${ou} : tâches`, `après rechargement : ${JSON.stringify(taches)}`, lieu);
      /* La recherche : la fiche d'abord, puis les réservations dites comme telles ; un résultat ouvre le bon écran ; rien trouvé est dit. */
      const chercher = async (q) => { await page.locator(tel ? '[data-esp-quoi]:visible' : '[data-esp-quoi]:visible').first().click(); await attendre(300); await page.fill('#barre-champ', q); await attendre(300); return (await page.locator('#barre-liste li').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ')); };
      const rc = await chercher('camille');
      if (!/Fiche client/.test(rc[0] || '') || !rc.some((x) => /Réservation ·/.test(x)) || !rc.some((x) => /Réception/.test(x))) R.echec(`${ou} : recherche`, `« camille » : ${JSON.stringify(rc.map((x) => x.slice(0, 50)))}`, lieu);
      await page.keyboard.press('Enter'); await attendre(500);
      if (await vueOuverte() !== 'clients' || !/Camille R\./.test(await texte('.esp-modale--fiche:not([hidden]) #client-titre'))) R.echec(`${ou} : recherche`, 'Entrée sur la fiche trouvée n\'ouvre pas Clients avec la fiche', lieu);
      await page.keyboard.press('Escape'); await attendre(250);
      const rs = await chercher('raclette'); if (!rs.some((x) => /Soirée/.test(x))) R.echec(`${ou} : recherche`, `« raclette » ne trouve pas la soirée : ${JSON.stringify(rs)}`, lieu);
      await page.keyboard.press('Enter'); await attendre(500);
      const offre = await page.evaluate(() => ({ vue: document.querySelector('.esp-vue:not([hidden])')?.dataset.vue, onglet: document.querySelector('[data-onglets-carte][aria-selected="true"]')?.dataset.onglet, titre: document.querySelector('#ev-titre')?.value || '' }));
      if (offre.vue !== 'carte' || offre.onglet !== 'soirees' || !/raclette/i.test(offre.titre)) R.echec(`${ou} : recherche → offre`, `la soirée trouvée ouvre ${offre.vue}/${offre.onglet} « ${offre.titre} »`, lieu);
      await chercher('zzzzqq'); if (!/Rien trouvé pour « zzzzqq »/.test(await texte('[data-barre-aide]'))) R.echec(`${ou} : recherche`, 'une recherche sans résultat ne le dit pas', lieu);
      await page.keyboard.press('Escape'); await attendre(200);
      /* Offres et Site : un seul éditeur pour les soirées ; les outils du site sont toujours là. */
      await aller(page, 'carte'); const onglets = await texte('[data-esp-rendu="carte"] [role="tablist"]');
      if (!/La carte/.test(onglets) || !/L'ardoise/.test(onglets) || !/Les soirées/.test(onglets)) R.echec(`${ou} : Offres`, `onglets « ${onglets} »`, lieu);
      await aller(page, 'site'); const site = await texte('[data-esp-rendu="site"] [role="tablist"]');
      for (const mot of ['Annonce et horaires', 'Textes', 'Messages', 'Photos']) if (!site.includes(mot)) R.echec(`${ou} : Site`, `l'onglet « ${mot} » manque`, lieu);
      await page.locator('[data-esp-rendu="site"] [role="tab"][data-onglet="soirees"]').click(); await attendre(400);
      const renvoi = await page.evaluate(() => ({ vue: document.querySelector('.esp-vue:not([hidden])')?.dataset.vue, onglet: document.querySelector('[data-onglets-carte][aria-selected="true"]')?.dataset.onglet, editeurs: document.querySelectorAll('[data-esp-panneau] .esp-evs, [data-esp-panneau] [data-nouvel-evenement]').length }));
      if (renvoi.vue !== 'carte' || renvoi.onglet !== 'soirees') R.echec(`${ou} : Site → Offres`, `« Soirées » dans Site ouvre ${renvoi.vue}/${renvoi.onglet}`, lieu);
      /* Les vues métier : un aperçu qui change la mise en avant, pas les données. */
      await aller(page, 'jour');
      for (const [v, absent] of [['cuisine', 't-priorites'], ['salle', 't-attente'], ['accueil', null], ['direction', null]]) { if (tel && !(await page.locator('[data-metier-tel]').evaluate((d) => d.open))) { await page.locator('[data-metier-tel] > summary').click(); await attendre(150); } await page.locator(`[data-vue-metier="${v}"]:visible`).click(); await attendre(300);
        const vu = await page.evaluate((a) => ({ presse: [...document.querySelectorAll('[data-vue-metier][aria-pressed="true"]')].find((b) => b.offsetParent)?.dataset.vueMetier || document.querySelector('[data-vue-metier][aria-pressed="true"]')?.dataset.vueMetier, la: a ? !!document.getElementById(a) : false, service: !!document.getElementById('t-prochain') }), absent);
        if (vu.presse !== v || vu.la || !vu.service) R.echec(`${ou} : vues métier`, `« ${v} » : ${JSON.stringify(vu)}`, lieu); }
      const large = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (large > 1) R.echec(`${ou} : débordement`, `Aujourd'hui dépasse de ${large} px`, lieu);
      [...new Set(erreurs)].forEach((x) => R.echec('erreur de console ou ressource', x, lieu));
      R.ok(`toute la maison v7.10.0 (${taille.nom})`);
    } finally { await ctx.close(); }
  }

  /* Les mesures d'un écran (voir « 2. ») servent aussi aux parcours de la v7.11.0 : déclarées avant eux. */
  const noter = (liste, taille, ou) => liste.filter((x) => x.controle !== 'section sans visuel').forEach((x) => R.ajouter(x.niveau || 'echec', x.controle, `${ou} : ${x.detail}`, { page: P, taille: taille.nom, selecteur: x.selecteur }));

  /* ---------- 1 undecies. Un service parfaitement accompagné (v7.11.0) ----------
     Les cinq scénarios de démonstration, sur ordinateur et sur téléphone, à une heure fixée (un vendredi ou un samedi
     soir, pour que le service du jour soit celui de l'histoire) :
     1. une alternative pertinente côté client, et l'inscription en liste d'attente (un double clic n'inscrit qu'une fois) ;
     2. une annulation qui profite à la liste d'attente : proposition, acceptation revérifiée, une seule réservation ;
        et une proposition expirée ;
     3. un service avec réservations et clients sans réservation : retard, arrivée, installation, tables rapprochées,
        départ, table à débarrasser puis prête ;
     4. une terrasse réorganisée (exemple d'un soir d'été) : aperçu, ajustement, application, fermeture sans effet ;
     5. un client modifie sa venue depuis sa page : la réservation initiale est gardée jusqu'à la décision. */
  for (const taille of (!SEUL || SEUL.includes('1-undecies') ? ['1366×768', '390×844'] : []).map(T)) {
    const lieu = { page: P, taille: taille.nom }, tel = taille.w < 1000, ou = `service accompagné (${taille.nom})`;
    /* Le prochain vendredi ou samedi, à l'heure de Paris. */
    const paris = (d) => Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short', hourCycle: 'h23' }).formatToParts(d).map((x) => [x.type, x.value]));
    let jour = new Date(); while (!['Fri', 'Sat'].includes(paris(jour).weekday)) jour = new Date(jour.getTime() + 86400000);
    const iso = `${paris(jour).year}-${paris(jour).month}-${paris(jour).day}`, a = (hm) => [`${iso}T${hm}:00+01:00`, `${iso}T${hm}:00+02:00`].map((x) => new Date(x)).find((d) => `${paris(d).hour}:${paris(d).minute}` === hm);
    const { ctx, page, erreurs } = await contexte({ taille });
    try {
      const texte = async (sel, pg = page) => (await pg.locator(sel).first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
      const toast = () => texte('[data-esp-toast-texte]');
      const ligne = (nom) => page.locator('[data-esp-panneau-resas] [data-resa]', { hasText: nom }).first();
      const autre = async (nom, sel) => { const li = ligne(nom); if (!(await li.locator('.esp-frise__plus').evaluate((d) => d.open))) await li.locator('.esp-frise__plus > summary').click(); await li.locator(sel).click(); await attendre(350); };
      const onglet = async (id) => { await aller(page, 'resas'); await page.locator(`[role="tab"][data-onglets-resas][data-onglet="${id}"]`).click(); await attendre(400); };
      const debordement = async (pg, quoi) => { const d = await pg.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth); if (d > 1) R.echec(`${ou} : débordement`, `${quoi} déborde de ${d} px`, lieu); };
      await page.clock.setFixedTime(a('18:05'));
      await page.goto(BASE + P, { waitUntil: 'load' }); await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });

      /* ===== Scénario 1 : côté client, un soir complet ===== */
      await page.evaluate((d) => localStorage.setItem('jh-espace:v1', JSON.stringify({ _schema: 2, resa: { complets: { [d]: ['soir'] } } })), iso);
      await page.goto(`${BASE}/reserver?date=${iso}&service=soir&couverts=4#formulaire`, { waitUntil: 'load' }); await attendrePret(page); await attendre(900);
      const alt = page.locator('[data-resa-alt]');
      if (!(await alt.isVisible())) R.echec(`${ou} : alternatives`, 'un soir complet ne propose aucune alternative là où se trouve le client', { page: '/reserver', taille: taille.nom });
      else {
        const choix = await page.evaluate(() => [...document.querySelectorAll('[data-resa-alt-choix]')].map((b) => b.innerText.replace(/\s+/g, ' ')));
        if (!choix.length || !choix.every((c) => /Ce qui change/.test(c))) R.echec(`${ou} : alternatives`, `chaque proposition doit dire ce qui change : « ${choix.join(' | ')} »`, { page: '/reserver', taille: taille.nom });
        if (!(await page.locator('[data-resa-attente]').count())) R.echec(`${ou} : alternatives`, 'la liste d\'attente n\'est pas proposée pour un service complet', { page: '/reserver', taille: taille.nom });
        await debordement(page, 'Réserver, alternatives');
        /* La liste d'attente : contrôlée, dite « pas une réservation », inscrite une seule fois. */
        await page.locator('[data-resa-attente]').click(); await attendre(300);
        await page.locator('#att-prenom').fill('Louise'); await page.locator('#att-nom').fill('Essai'); await page.locator('[data-resa-attente-envoyer]').click(); await attendre(250);
        if (!/téléphone ou une adresse/.test(await texte('[data-att-erreur]'))) R.echec(`${ou} : liste d'attente`, 'une inscription sans moyen de prévenir le client n\'est pas refusée', { page: '/reserver', taille: taille.nom });
        if (await page.locator('#att-prenom').inputValue() !== 'Louise') R.echec(`${ou} : liste d'attente`, 'la saisie est perdue après une erreur', { page: '/reserver', taille: taille.nom });
        await page.locator('#att-tel').fill('06 11 22 33 44'); await page.locator('[data-resa-attente-envoyer]').dblclick(); await attendre(450);
        const inscrits = await page.evaluate(() => JSON.parse(localStorage.getItem('jh-espace-demandes:v1') || '[]').filter((d) => d.genre === 'attente'));
        if (inscrits.length !== 1) R.echec(`${ou} : liste d'attente`, `${inscrits.length} inscriptions après un double clic (attendu : 1)`, { page: '/reserver', taille: taille.nom });
        if (!/pas une réservation/.test(await texte('[data-resa-alt]'))) R.echec(`${ou} : liste d'attente`, 'la confirmation ne dit pas que ce n\'est pas une réservation', { page: '/reserver', taille: taille.nom });
        if (await page.evaluate(() => JSON.parse(localStorage.getItem('jh-espace-resas:v1') || '[]').length)) R.echec(`${ou} : liste d'attente`, 'une inscription en liste d\'attente a créé une réservation', { page: '/reserver', taille: taille.nom });
        /* Choisir une alternative : seul ce qui est annoncé change, le nombre de personnes est gardé. (Même adresse avec une ancre : on repart d'une page vide pour qu'elle soit rechargée.) */
        await page.goto('about:blank'); await page.goto(`${BASE}/reserver?date=${iso}&service=soir&couverts=4#formulaire`, { waitUntil: 'load' }); await attendrePret(page); await attendre(900);
        const annonce = await texte('[data-resa-alt-choix="0"]'); await page.locator('[data-resa-alt-choix="0"]').click(); await attendre(600);
        const apres = await page.evaluate(() => { const d = new FormData(document.querySelector('[data-resa-form]')); return { date: d.get('date'), service: d.get('service'), heure: d.get('heure'), couverts: d.get('couverts'), alt: !document.querySelector('[data-resa-alt]').hidden }; });
        if (!apres.heure || apres.couverts !== '4' || apres.alt) R.echec(`${ou} : alternatives`, `après « ${annonce} » : ${JSON.stringify(apres)}`, { page: '/reserver', taille: taille.nom });
      }

      /* ===== Scénario 2 : une annulation profite à la liste d'attente ===== */
      await page.evaluate(() => localStorage.removeItem('jh-espace:v1'));
      await entrer(page); await onglet('attente');
      const etats = () => page.evaluate(() => Object.fromEntries([...document.querySelectorAll('[data-attente]')].map((li) => [li.dataset.attente, li.className.replace(/.*est-/, '')])));
      await page.locator('[data-filtre-attente="toutes"]').click(); await attendre(250);
      let e2 = await etats();
      if (e2['att-demo-1'] !== 'expiree') R.echec(`${ou} : liste d'attente`, `la proposition d'hier devrait être expirée (${e2['att-demo-1']})`, lieu);
      if (!Object.values(e2).length || !Object.keys(e2).some((k) => /^A-|^a-/i.test(k))) R.echec(`${ou} : liste d'attente`, 'l\'inscription faite sur le site n\'arrive pas dans la liste de l\'équipe', lieu);
      if (await page.locator('[data-attente="att-demo-2"] [data-attente-proposer]').count()) R.echec(`${ou} : liste d'attente`, 'une place est proposée à la tablée de neuf alors que la grande table est prise', lieu);
      if (!/revérifiée/.test(await texte('.esp-att-regle'))) R.echec(`${ou} : liste d'attente`, 'la règle de la proposition n\'est pas affichée', lieu);
      await mesurerEcran(page, taille, 'liste d\'attente', false);
      await onglet('service'); await autre('Famille Weber', '[data-statut="annulee"]');
      await onglet('attente'); await page.locator('[data-filtre-attente="toutes"]').click(); await attendre(250);
      const proposer = page.locator('[data-attente="att-demo-2"] [data-attente-proposer]').first();
      if (!(await proposer.count())) R.echec(`${ou} : liste d'attente`, 'après l\'annulation de la grande tablée, aucune place n\'est proposée à la plus ancienne demande compatible', lieu);
      else {
        await proposer.click(); await attendre(400);
        if ((await etats())['att-demo-2'] !== 'proposee' || !/n'est pas bloquée/.test(await texte('[data-attente="att-demo-2"]'))) R.echec(`${ou} : liste d'attente`, 'la proposition n\'est pas suivie, ou ne dit pas que la place n\'est pas bloquée', lieu);
        if (!/Aucun message n'est envoyé/.test(await toast())) R.echec(`${ou} : liste d'attente`, `le message de proposition doit rester un aperçu : « ${await toast()} »`, lieu);
        /* La seconde tablée reçoit aussi une proposition (rien n'est bloqué) ; la première accepte, au double clic. */
        await page.locator('[data-attente="att-demo-3"] [data-attente-proposer]').first().click(); await attendre(350);
        await page.locator('[data-attente="att-demo-2"] [data-attente-accepter]').dblclick(); await attendre(500);
        const nb = await page.evaluate(() => (JSON.parse(localStorage.getItem('jh-espace:v1') || '{}').resa?.ajouts || []).filter((r) => r.source === 'attente').length);
        if (nb !== 1) R.echec(`${ou} : liste d'attente`, `${nb} réservations créées par une acceptation (attendu : 1)`, lieu);
        if ((await etats())['att-demo-2'] !== 'acceptee') R.echec(`${ou} : liste d'attente`, 'l\'inscription acceptée n\'est pas close', lieu);
        /* La seconde accepte à son tour : la place est prise, c'est dit, rien n'est créé, elle revient en attente. */
        await page.locator('[data-attente="att-demo-3"] [data-attente-accepter]').click(); await attendre(450);
        if (!/prise entre-temps/.test(await toast()) || (await etats())['att-demo-3'] !== 'en-attente') R.echec(`${ou} : liste d'attente`, `une acceptation devenue impossible doit le dire et revenir en attente : « ${await toast()} », état ${(await etats())['att-demo-3']}`, lieu);
        await page.locator('[data-attente="att-demo-2"] [data-attente-voir]').click(); await attendre(500);
        if (!(await ligne('Tablée Lambert').count())) R.echec(`${ou} : liste d'attente`, 'la réservation créée n\'apparaît pas dans le service', lieu);
      }

      /* ===== Scénario 3 : le service, avec et sans réservation ===== */
      await page.evaluate(() => { localStorage.clear(); sessionStorage.removeItem('jh-espace-vue'); }); await page.clock.setFixedTime(a('20:05')); await entrer(page); await aller(page, 'jour');
      if (tel) { const h = await page.evaluate(() => { const d = document.querySelector('[data-metier-tel] > summary'), o = document.querySelector('.esp-metier--ordi'); return { h: d?.getBoundingClientRect().height || 0, ordi: !!o?.offsetParent, haut: document.querySelector('[data-prochain]')?.getBoundingClientRect().top + scrollY }; });
        if (!h.h || h.h > 60 || h.ordi) R.echec(`${ou} : téléphone`, `le choix de la vue doit tenir sur une ligne (${Math.round(h.h)} px, bloc complet ${h.ordi ? 'visible' : 'masqué'})`, lieu);
        if (h.haut > 420) R.echec(`${ou} : téléphone`, `le service commence à ${Math.round(h.haut)} px du haut de la page`, lieu); }
      for (const mot of ['réservation', 'couverts attendus', 'sans table']) if (!(await texte('[data-prochain] .esp-acc__chiffres')).includes(mot)) R.echec(`${ou} : Aujourd'hui`, `le libellé « ${mot} » manque dans le service`, lieu);
      if (!/toutes activités confondues/.test(await texte('.esp-bonjour'))) R.echec(`${ou} : Aujourd'hui`, 'le total des demandes ne précise pas « toutes activités confondues »', lieu);
      await onglet('service');
      const p0 = await ligne('Aurélie et Marc').getAttribute('data-presence');
      if (p0 !== 'retard') R.echec(`${ou} : service`, `à 20 h 05, la table de 19 h 30 devrait être « en retard » (${p0})`, lieu);
      await ligne('Aurélie et Marc').locator('.esp-frise__principal').click(); await attendre(400);
      if (await ligne('Aurélie et Marc').getAttribute('data-presence') !== 'arrive') R.echec(`${ou} : service`, 'après « Signaler l\'arrivée », le groupe devrait être « arrivé, à installer »', lieu);
      await ligne('Aurélie et Marc').locator('[data-choisir-table]').click(); await attendre(450);
      if (!(await page.locator('[data-aide-choix]').count())) R.echec(`${ou} : salle`, 'la réservation choisie n\'explique pas quelles tables conviennent', lieu);
      await page.locator('[data-salle] [data-table="1"]').click(); await attendre(450);
      if (await page.locator('[data-salle] [data-table="1"]').getAttribute('data-etat-de-table') !== 'occupee') R.echec(`${ou} : salle`, 'un groupe arrivé puis placé sur une table prête devrait y être installé (table occupée)', lieu);
      /* Deux tables rapprochées pour cinq couverts. */
      await page.locator('[data-choisir-resa]', { hasText: 'Famille Weber' }).click(); await attendre(300);
      if (!/Pourquoi pas les autres/.test(await texte('[data-aide-choix]'))) R.echec(`${ou} : salle`, 'le plan ne dit pas pourquoi les autres tables ne conviennent pas', lieu);
      const ass = page.locator('[data-assembler="8+9"]');
      if (!(await ass.count())) R.echec(`${ou} : assemblage`, 'les tables 8 et 9 ne sont pas proposées à une tablée de huit', lieu);
      else { await ass.click(); await attendre(450);
        const t = await page.evaluate(() => ({ t8: document.querySelector('[data-table="8"]').className, t9: document.querySelector('[data-table="9"]').className, ou: [...document.querySelectorAll('[data-choisir-resa]')].find((b) => /Weber/.test(b.textContent))?.innerText.replace(/\s+/g, ' ') }));
        if (!/est-rapprochee/.test(t.t8) || !/est-rapprochee/.test(t.t9) || !/8\+9/.test(t.ou || '')) R.echec(`${ou} : assemblage`, `les deux tables devraient être marquées rapprochées : ${JSON.stringify(t)}`, lieu);
        /* Une table de l'assemblage ne se donne plus séparément à la même heure. */
        await page.locator('[data-choisir-resa]', { hasText: 'Camille R.' }).click(); await attendre(250); await page.locator('[data-salle] [data-table="9"]').click(); await attendre(350);
        if (!/rapprochée|prise|réservée/.test(await toast())) R.echec(`${ou} : assemblage`, `une table rapprochée a pu être donnée à part : « ${await toast()} »`, lieu);
        await page.locator('[data-choisir-resa]', { hasText: 'Camille R.' }).click(); await attendre(200); }
      await mesurerEcran(page, taille, 'plan de salle v7.11', false); await debordement(page, 'le plan de salle');
      /* Des clients se présentent. */
      await onglet('service'); await page.locator('[data-passage]').click(); await attendre(350);
      await page.locator('#pa-n').fill('2'); await attendre(250);
      const places = await page.locator('.esp-passage__places button').count(), raisons = await page.evaluate(() => document.querySelector('.esp-passage__pourquoi')?.textContent.replace(/\s+/g, ' ') || '');
      if (!places) R.echec(`${ou} : sans réservation`, 'aucune table n\'est proposée à deux personnes un soir où il reste des tables prêtes', lieu);
      if (!/table 1|Table 1/.test(raisons) || !/occupée/.test(raisons)) R.echec(`${ou} : sans réservation`, `la table occupée devrait être écartée avec sa raison : « ${raisons.slice(0, 160)} »`, lieu);
      await mesurerEcran(page, taille, 'des clients se présentent', false);
      await page.locator('#pa-nom').fill('Couple de passage'); await page.locator('.esp-passage__places button').first().click(); await attendre(450);
      if (await ligne('Couple de passage').getAttribute('data-presence') !== 'installe') R.echec(`${ou} : sans réservation`, 'le groupe installé n\'apparaît pas « installé » dans le service', lieu);
      await page.locator('[data-passage]').click(); await attendre(300); await page.locator('#pa-n').fill('3'); await page.locator('#pa-nom').fill('Trois amis'); await page.locator('.esp-passage__autres button[value=""]').click(); await attendre(450);
      if (await ligne('Trois amis').getAttribute('data-presence') !== 'arrive') R.echec(`${ou} : sans réservation`, 'un groupe qui attend sur place devrait être « arrivé, à installer »', lieu);
      /* Le départ : la table n'est pas « prête » pour autant. */
      await ligne('Aurélie et Marc').locator('[data-depart]').click(); await attendre(450);
      const t1 = () => page.evaluate(() => document.querySelector('[data-table-etat="1"]')?.innerText.replace(/\s+/g, ' ') || '');
      if (!/À débarrasser/i.test(await t1())) R.echec(`${ou} : tables`, `après un départ, la table 1 devrait être « à débarrasser » : « ${await t1()} »`, lieu);
      await page.locator('[data-table-etat="1"] [data-etat="a-preparer"]').click(); await attendre(350);
      if (!/À préparer/i.test(await t1())) R.echec(`${ou} : tables`, `« Débarrassée » devrait donner « à préparer » : « ${await t1()} »`, lieu);
      await page.locator('[data-table-etat="1"] [data-etat=""]').click(); await attendre(350);
      if (await page.locator('[data-table-etat="1"]').count()) R.echec(`${ou} : tables`, '« Table prête » devrait retirer la table de la liste à remettre en état', lieu);
      await mesurerEcran(page, taille, 'service v7.11', false); await debordement(page, 'le service');
      /* Le briefing et Aujourd'hui suivent. */
      await aller(page, 'jour');
      if (!/installé|à installer/.test(await texte('[data-acc-presence]'))) R.echec(`${ou} : Aujourd'hui`, `l'accueil ne dit pas où en est le service : « ${await texte('[data-acc-presence]')} »`, lieu);
      await page.locator('[data-esp-rendu="jour"] [data-briefing]').click(); await attendre(450);
      const brief = await texte('.esp-brief');
      for (const mot of ['Où en est le service', 'Tables à rapprocher', 'Sans mention, on ne sait pas']) if (!brief.includes(mot)) R.echec(`${ou} : briefing`, `la partie « ${mot} » manque`, lieu);
      await page.keyboard.press('Escape'); await attendre(250);

      /* ===== Scénario 5 : le client modifie sa venue (avant le scénario 4, qui change de jour) ===== */
      await onglet('service');
      const li5 = ligne('Camille R.'); if (!(await li5.locator('.esp-frise__plus').evaluate((d) => d.open))) await li5.locator('.esp-frise__plus > summary').click();
      const href = await li5.locator('[data-lien-venue]').getAttribute('href');
      /* La page du client est ouverte dans l'après-midi : le site demande une heure de délai pour une nouvelle heure d'arrivée. */
      const client = await ctx.newPage(); await client.clock.setFixedTime(a('16:00')); await client.goto(BASE + href, { waitUntil: 'load' }); await attendre(1200);
      const etatClient = () => client.locator('[data-venue-etat]').getAttribute('data-venue-etat').catch(() => 'introuvable');
      if (await etatClient() !== 'confirmee') R.echec(`${ou} : votre venue`, `la page du client devrait montrer « confirmée » (${await etatClient()})`, { page: '/votre-venue', taille: taille.nom });
      else {
        await client.locator('[data-venue-outil="modifier"]').click(); await client.locator('#venue-heure').selectOption('21:00'); await client.locator('#venue-couverts').fill('4'); await client.locator('[data-venue-form] button[type="submit"]').click(); await attendre(700);
        if (await etatClient() !== 'modification-demandee') R.echec(`${ou} : votre venue`, `après la demande, l'état devrait être « modification demandée » (${await etatClient()})`, { page: '/votre-venue', taille: taille.nom });
        const garde = await texte('[data-esp-panneau-resas] [data-resa][data-presence]:has([data-modif-client])');
        if (!/20 h 30/.test(garde) || !/2 couverts/.test(garde) || !/demande un changement/.test(garde)) R.echec(`${ou} : votre venue`, `l'espace doit garder la réservation initiale et montrer la demande : « ${garde.slice(0, 200)} »`, lieu);
        await page.locator('[data-venue-reponse][data-accepte="1"]').click(); await attendre(700);
        const apres5 = await texte('[data-esp-panneau-resas] [data-resa]:has-text("Camille R.")');
        if (!/21 h/.test(apres5) || !/4 couverts/.test(apres5)) R.echec(`${ou} : votre venue`, `après acceptation, la réservation devrait être à 21 h pour 4 : « ${apres5.slice(0, 160)} »`, lieu);
        if (await etatClient() !== 'modifiee') R.echec(`${ou} : votre venue`, `la page du client devrait dire « modifiée » (${await etatClient()})`, { page: '/votre-venue', taille: taille.nom });
        await client.locator('[data-venue-outil="completer"]').click(); await client.locator('#venue-info').fill('Une poussette'); await client.locator('[data-venue-form] button[type="submit"]').click(); await attendre(700);
        if (!/Une poussette/.test(await texte('[data-esp-panneau-resas] [data-resa]:has-text("Camille R.")'))) R.echec(`${ou} : votre venue`, 'la précision du client n\'arrive pas sur la réservation', lieu);
        await client.locator('[data-venue-reconfirmer]').click(); await attendre(600);
        if (!/Reconfirmée/.test(await texte('[data-esp-panneau-resas] [data-resa]:has-text("Camille R.")'))) R.echec(`${ou} : votre venue`, 'la reconfirmation du client n\'est pas visible dans le service', lieu);
        await mesurerEcran(client, taille, 'votre venue', false); await debordement(client, 'Votre venue');
        await client.locator('[data-venue-outil="annuler"]').click(); await client.locator('[data-venue-annuler-oui]').click(); await attendre(800);
        if (await etatClient() !== 'annulee' || await client.locator('[data-venue-outil]').count()) R.echec(`${ou} : votre venue`, 'après annulation, la page devrait dire « annulée » et ne plus proposer d\'action', { page: '/votre-venue', taille: taille.nom });
        if (await ligne('Camille R.').getAttribute('data-presence') !== 'annulee') R.echec(`${ou} : votre venue`, 'l\'annulation du client n\'annule pas la réservation dans l\'espace', lieu);
      }
      /* Un lien faux ne montre rien. */
      await client.goto(`${BASE}${href.replace(/c=.*/, 'c=000000')}`, { waitUntil: 'load' }); await attendre(900);
      if (!/introuvable/i.test(await texte('[data-venue-corps]', client))) R.echec(`${ou} : votre venue`, 'un lien au mauvais code montre une réservation', { page: '/votre-venue', taille: taille.nom });
      await client.close();
      /* Les rappels : un réglage, un aperçu, rien d'envoyé. */
      await page.locator('[data-rappels] > summary').click(); await attendre(300);
      const rappels = await texte('[data-rappels]');
      if (!/rien n'est envoyé/i.test(rappels) || !/aperçu/i.test(rappels) || !/ce n'est pas une annulation/.test(rappels)) R.echec(`${ou} : rappels`, `les rappels doivent se dire « aperçu » et ne rien annuler : « ${rappels.slice(0, 200)} »`, lieu);
      await page.locator('[data-rappel-delai]').selectOption('48'); await attendre(400);
      if (await page.evaluate(() => JSON.parse(localStorage.getItem('jh-espace:v1') || '{}').rappels?.delai) !== 48) R.echec(`${ou} : rappels`, 'le réglage du rappel n\'est pas enregistré', lieu);

      /* ===== Scénario 4 : la terrasse réorganisée ===== */
      await onglet('salle'); await page.locator('[data-exemple-ete]').click(); await attendre(600);
      const repli = await texte('article[data-repli]');
      if (!/rien n'est encore changé/.test(repli) || !/Sans solution en salle/.test(repli) || !/Tablée Marchand/.test(repli)) R.echec(`${ou} : repli`, `l'aperçu du repli est incomplet : « ${repli.slice(0, 220)} »`, lieu);
      const avantRepli = await page.evaluate(() => localStorage.getItem('jh-espace:v1'));
      await mesurerEcran(page, taille, 'repli de terrasse', false); await debordement(page, 'le repli');
      /* Ajuster, puis fermer : rien ne change. */
      const sel = page.locator('[data-repli-choix]').nth(1), autreOption = await sel.evaluate((x) => [...x.options].map((o) => o.value).find((v) => v !== x.value && v !== 'garder'));
      if (autreOption) { await sel.selectOption(autreOption); await attendre(350); if (await page.locator('[data-repli-choix]').nth(1).inputValue() !== autreOption) R.echec(`${ou} : repli`, 'un ajustement n\'est pas gardé dans l\'aperçu', lieu); }
      await page.locator('[data-repli-fermer]').click(); await attendre(350);
      if (await page.evaluate(() => localStorage.getItem('jh-espace:v1')) !== avantRepli) R.echec(`${ou} : repli`, 'fermer l\'aperçu a changé l\'état', lieu);
      await page.locator('button[data-repli]').click(); await attendre(400); await page.locator('[data-repli-appliquer]').click(); await attendre(700);
      const bilan = await texte('article[data-repli]');
      if (!/3 réservations déplacées\./.test(bilan) || !/Tablée Marchand.*reste sans solution/.test(bilan) || (await page.locator('[data-repli-resultat="deplacee"]').count()) !== 3) R.echec(`${ou} : repli`, `le résultat doit dire précisément ce qui a été fait et ce qui reste : « ${bilan.slice(0, 260)} »`, lieu);
      const dehors = await page.evaluate(() => [...document.querySelectorAll('[data-choisir-resa]')].filter((b) => /table 1[012]\b|tables? 10/.test(b.innerText)).map((b) => b.innerText.replace(/\s+/g, ' ')));
      if (dehors.length !== 1 || !/Marchand/.test(dehors[0])) R.echec(`${ou} : repli`, `seule la tablée sans solution devrait rester en terrasse : ${JSON.stringify(dehors)}`, lieu);

      /* ===== Identité client : la période est dite, la prochaine venue a une heure ===== */
      await aller(page, 'clients');
      if (!/Sur la période affichée/.test(await texte('[data-esp-rendu="clients"] .esp-intro'))) R.echec(`${ou} : clients`, 'la liste des clients ne dit pas sur quelle période elle porte', lieu);
      await page.locator('#clients-recherche').fill('Famille Weber'); await attendre(350); await page.locator('[data-clients-liste] [data-client]').first().click(); await attendre(450);
      const fiche = await texte('[data-client-boite]');
      if (!/Sur la période affichée/.test(fiche) || !/sur cet appareil/i.test(fiche)) R.echec(`${ou} : fiche client`, `la fiche doit dire la période des chiffres et la portée des notes : « ${fiche.slice(0, 200)} »`, lieu);
      await page.keyboard.press('Escape'); await attendre(200);
      [...new Set(erreurs)].forEach((x) => R.echec('erreur de console ou ressource', x, lieu));
      R.ok(`espace : un service parfaitement accompagné (${taille.nom})`);
    } catch (err) { R.echec(`${ou} : parcours interrompu`, String(err.message || err).replace(/\u001b\[[0-9;]*m/g, '').replace(/\s+/g, ' ').slice(0, 420), lieu);
    } finally { await ctx.close(); }
  }

  /* ---------- 1 duodecies. Le service, prêt à être présenté (v7.11.1) ----------
     « Lancer une démonstration » : les quatre scénarios joués de bout en bout, sur ordinateur et à 390 px. Pour
     chacun : la situation de départ permet le parcours, les étapes se cochent d'après les actions réelles, la
     conclusion n'apparaît qu'à la fin, le scénario se recommence à l'identique. Et autour : les données habituelles
     restent intactes, un onglet ordinaire reste dans son contexte, un rechargement garde la progression et l'heure
     simulée, la page du client et la page Réserver suivent le scénario. Aucune horloge truquée par le test : c'est
     l'horloge de démonstration de la maquette qui est vérifiée. */
  for (const taille of (!SEUL || SEUL.includes('1-duodecies') ? ['1366×768', '390×844'] : []).map(T)) {
    const lieu = { page: P, taille: taille.nom }, tel = taille.w < 1000, ou = `démonstration (${taille.nom})`;
    const { ctx, page, erreurs } = await contexte({ taille });
    try {
      const texte = async (sel, pg = page) => (await pg.locator(sel).first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
      const toast = () => texte('[data-esp-toast-texte]');
      const ligne = (nom) => page.locator('[data-esp-panneau-resas] [data-resa]', { hasText: nom }).first();
      const autre = async (nom, sel) => { const li = ligne(nom); if (!(await li.locator('.esp-frise__plus').evaluate((d) => d.open))) await li.locator('.esp-frise__plus > summary').click(); await li.locator(sel).click(); await attendre(350); };
      const onglet = async (id) => { await aller(page, 'resas'); await page.locator(`[role="tab"][data-onglets-resas][data-onglet="${id}"]`).click(); await attendre(400); };
      const scene = () => page.evaluate(() => { const z = document.querySelector('[data-esp-scene]'); return { la: !!z && !z.hidden, scenario: z?.dataset.scenario || '', finie: !!z?.classList.contains('est-finie'), heure: z?.querySelector('[data-scene-heure] .esp-long')?.textContent.replace(/\s+/g, ' ').trim() || '', essayer: z?.querySelector('[data-scene-essayer]')?.textContent.replace(/\s+/g, ' ').trim() || '', faites: z?.querySelectorAll('.esp-scene__etapes li.est-faite').length ?? -1, etapes: z?.querySelectorAll('.esp-scene__etapes li').length ?? -1, hauteur: Math.round(z?.getBoundingClientRect().height || 0) }; });
      const attendu = async (quoi, n, fin = false) => { const s = await scene(); if (s.faites !== n || s.finie !== fin) R.echec(`${ou} : étapes`, `${quoi} : ${s.faites} étape(s) faite(s) sur ${s.etapes}, attendu ${n}${fin ? ' et la conclusion' : ''} (« ${s.essayer.slice(0, 90)} »)`, lieu); return s; };
      const stock = (pg = page) => pg.evaluate(() => Object.fromEntries(Object.keys(localStorage).sort().map((k) => [k, localStorage.getItem(k)])));
      /* Une action qui change de page (lien, « Recommencer », « Quitter ») : on attend le NOUVEAU document, repéré par
         l'absence de la marque posée sur l'ancien, puis l'espace prêt. Aucun délai fixe. */
      const changerDePage = async (pg, action, pret = () => !!document.querySelector('[data-esp-app]') && !document.querySelector('[data-esp-app]').hidden) => {
        await pg.evaluate(() => { window.__ancienne = true; }); await action();
        await pg.waitForFunction(() => !window.__ancienne && document.readyState === 'complete', null, { timeout: 15000 });
        await pg.waitForFunction(pret, null, { timeout: 15000 }); await attendre(500); };
      const lancer = async (id) => { if (await page.locator('[data-scene-etapes]').count()) { if (!(await page.locator('[data-scene-etapes]').evaluate((d) => d.open))) await page.locator('[data-scene-etapes] > summary').click(); await page.locator('[data-scene-etapes] [data-demo-lancer]').click(); } else await page.locator('[data-demo-lancer]:visible').first().click(); await attendre(350); await changerDePage(page, () => page.locator(`[data-demo-choisir="${id}"]`).click()); };
      const recommencer = async () => { if (!(await page.locator('[data-scene-etapes]').evaluate((d) => d.open))) await page.locator('[data-scene-etapes] > summary').click(); await changerDePage(page, () => page.locator('[data-scene-recommencer]').click()); };
      const debordement = async (pg, quoi) => { const d = await pg.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth); if (d > 1) R.echec(`${ou} : débordement`, `${quoi} déborde de ${d} px`, lieu); };

      /* ===== Avant : l'espace habituel, avec une modification à retrouver intacte ===== */
      await page.goto(BASE + P, { waitUntil: 'load' }); await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); }); await entrer(page); await aller(page, 'jour');
      await page.locator('[data-esp-rendu="jour"] [data-tache-nouvelle]').first().click(); await attendre(250); await page.locator('[data-form-tache] [name="titre"]').fill('Tâche de mon espace habituel'); await page.locator('[data-form-tache] button[type="submit"]').click(); await attendre(400);
      const habituel = await stock();
      if (!habituel['jh-espace:v1']?.includes('Tâche de mon espace habituel')) R.echec(`${ou} : préparation`, 'la tâche de l\'espace habituel n\'est pas enregistrée', lieu);
      /* Le lanceur : facile à trouver, quatre scénarios, clavier. */
      if ((await page.locator('[data-demo-lancer]:visible').count()) !== 1) R.echec(`${ou} : lanceur`, `« Lancer une démonstration » devrait être visible une fois sur Aujourd'hui (${await page.locator('[data-demo-lancer]:visible').count()})`, lieu);
      await page.locator('[data-demo-lancer]:visible').first().click(); await attendre(350);
      const choix = await page.evaluate(() => ({ n: document.querySelectorAll('[data-demo-choisir]').length, focus: !!document.activeElement?.closest('.esp-modale--demo'), titres: [...document.querySelectorAll('.esp-demo-carte h3')].map((h) => h.textContent.trim()) }));
      if (choix.n !== 8 || !choix.focus) R.echec(`${ou} : lanceur`, `${choix.n} scénarios proposés (attendu 8), focus ${choix.focus ? 'dans' : 'hors de'} la fenêtre`, lieu);
      /* v7.12.0 : les commandes disent ce qu'elles font. Rien n'a encore été joué : « Lancer depuis le début » partout, aucun « Reprendre ». */
      const libelles = await page.evaluate(() => ({ debut: [...document.querySelectorAll('[data-demo-choisir]')].map((b) => b.textContent.trim()), reprendre: document.querySelectorAll('[data-demo-reprendre]').length }));
      if (libelles.debut.some((t) => t !== 'Lancer depuis le début') || libelles.reprendre) R.echec(`${ou} : lanceur`, `avant tout lancement : ${JSON.stringify(libelles)}`, lieu);
      await mesurerEcran(page, taille, 'choix des scénarios', false);
      await page.keyboard.press('Escape'); await attendre(250);
      if (await page.locator('.esp-modale--demo:not([hidden])').count()) R.echec(`${ou} : lanceur`, 'Échap ne ferme pas le choix des scénarios', lieu);

      /* ===== Scénario 1 : le service commence ===== */
      await lancer('service');
      const depart1 = await stock(); let s = await scene();
      if (!s.la || s.scenario !== 'service' || !/20 h 10/.test(s.heure) || !/Vendredi/.test(s.heure)) R.echec(`${ou} : scénario 1`, `bandeau attendu « Le service commence », un vendredi à 20 h 10 : ${JSON.stringify(s)}`, lieu);
      if (!/À essayer maintenant/.test(s.essayer) || !/Aurélie et Marc/.test(s.essayer)) R.echec(`${ou} : scénario 1`, `la première indication manque : « ${s.essayer} »`, lieu);
      if (depart1['jh-espace:v1'] !== habituel['jh-espace:v1']) R.echec(`${ou} : isolation`, 'lancer un scénario a modifié les données habituelles', lieu);
      if (!Object.keys(depart1).some((k) => k.startsWith('jh-demo:service:'))) R.echec(`${ou} : isolation`, `le scénario n'a pas son propre espace de données : ${Object.keys(depart1).join(', ')}`, lieu);
      if (await page.locator('[data-tout-effacer]:visible').count()) R.echec(`${ou} : scénario 1`, '« Tout remettre comme livré » reste proposé pendant un scénario', lieu);
      if (tel) { if (s.hauteur > 300) R.echec(`${ou} : téléphone`, `le bandeau de démonstration fait ${s.hauteur} px de haut`, lieu);
        const nav = await page.evaluate(() => { const n = document.querySelector('.esp-nav__liste').getBoundingClientRect(); return n.bottom <= innerHeight + 1 && n.height > 40; }); if (!nav) R.echec(`${ou} : téléphone`, 'la navigation du bas n\'est plus utilisable pendant un scénario', lieu); }
      await mesurerEcran(page, taille, 'scénario 1, départ', false); await debordement(page, 'le scénario 1');
      await attendu('au départ', 0);
      await ligne('Aurélie et Marc').locator('.esp-frise__principal').click(); await attendre(400); await attendu('après l\'arrivée', 1);
      const annonce = await page.evaluate(() => ({ region: document.querySelector('[data-esp-scene]')?.getAttribute('role') === 'region' && /Le service commence/.test(document.querySelector('[data-esp-scene]')?.getAttribute('aria-label') || ''), dit: document.querySelector('[data-esp-scene] + [role="status"]')?.textContent || '' }));
      if (!annonce.region || !/À essayer maintenant.*Installez-les/.test(annonce.dit)) R.echec(`${ou} : accessibilité`, `le bandeau doit être une région nommée et annoncer la nouvelle indication : ${JSON.stringify(annonce)}`, lieu);
      if (await ligne('Aurélie et Marc').getAttribute('data-presence') !== 'arrive') R.echec(`${ou} : scénario 1`, 'après l\'arrivée, le groupe devrait être « arrivé, à installer »', lieu);
      await ligne('Aurélie et Marc').locator('[data-installer]').click(); await attendre(400); await attendu('après l\'installation', 2);
      await page.locator('[data-passage]').click(); await attendre(300); await page.locator('#pa-n').fill('2'); await attendre(250);
      const raisons = await page.evaluate(() => document.querySelector('.esp-passage__pourquoi')?.textContent.replace(/\s+/g, ' ') || '');
      if (!/Table 2.{0,40}à débarrasser/i.test(raisons) || !/occupée/.test(raisons)) R.echec(`${ou} : scénario 1`, `les raisons devraient citer la table à débarrasser et une table occupée : « ${raisons.slice(0, 200)} »`, lieu);
      await page.locator('.esp-passage__places button').first().click(); await attendre(450); await attendu('après l\'accueil sans réservation', 3);
      await ligne('Hugo et Léa').locator('[data-depart]').click(); await attendre(450); await attendu('après le départ', 4);
      await page.locator('[data-table-etat="6"] [data-etat="a-preparer"]').click(); await attendre(350); await attendu('table débarrassée, pas encore prête', 4);
      await page.locator('[data-table-etat="6"] [data-etat=""]').click(); await attendre(350); s = await attendu('table prête', 5, true);
      if (!/C'est fait/.test(s.essayer) || !/table vide n'est pas encore une table prête/.test(s.essayer)) R.echec(`${ou} : scénario 1`, `la conclusion attendue manque : « ${s.essayer} »`, lieu);
      /* Rechargement : la progression et l'heure simulée sont gardées ; avancer l'heure aussi. */
      await page.reload({ waitUntil: 'load' }); await attendrePret(page); await attendre(600); s = await attendu('après rechargement', 5, true);
      await page.locator('[data-scene-avancer]').click(); await attendre(400); s = await scene(); if (!/20 h 25/.test(s.heure)) R.echec(`${ou} : horloge`, `« Avancer de 15 minutes » devrait donner 20 h 25 : « ${s.heure} »`, lieu);
      await page.reload({ waitUntil: 'load' }); await attendrePret(page); await attendre(600); s = await scene(); if (!/20 h 25/.test(s.heure)) R.echec(`${ou} : horloge`, `l'heure simulée n'est pas gardée au rechargement : « ${s.heure} »`, lieu);
      /* Recommencer : le même point de départ, et lui seul. */
      await recommencer(); const redepart1 = await stock(); s = await attendu('après « Recommencer »', 0);
      if (!/20 h 10/.test(s.heure)) R.echec(`${ou} : recommencer`, `l'heure devrait revenir à 20 h 10 : « ${s.heure} »`, lieu);
      /* v7.14.1 : chaque départ d'un scénario porte une nouvelle « époque » (une page restée ouverte reconnaît ainsi un « Recommencer ») : tout le reste doit être identique, et l'époque doit avoir changé. */
      const sansEpoque = (k, v) => (/:horloge:v1$/.test(k) && v ? JSON.stringify({ ...JSON.parse(v), epoque: '' }) : v);
      for (const k of Object.keys(depart1).filter((x) => x.startsWith('jh-demo:service:'))) if (sansEpoque(k, redepart1[k]) !== sansEpoque(k, depart1[k])) R.echec(`${ou} : recommencer`, `« ${k} » ne retrouve pas son état de départ`, lieu);
      if (!JSON.parse(redepart1['jh-demo:service:horloge:v1'] || '{}').epoque || JSON.parse(redepart1['jh-demo:service:horloge:v1']).epoque === JSON.parse(depart1['jh-demo:service:horloge:v1'] || '{}').epoque) R.echec(`${ou} : recommencer`, '« Recommencer » devrait ouvrir un nouveau départ (une nouvelle époque du scénario)', lieu);
      if (redepart1['jh-espace:v1'] !== habituel['jh-espace:v1']) R.echec(`${ou} : recommencer`, '« Recommencer » a touché aux données habituelles', lieu);

      /* ===== Scénario 2 : une place se libère (et l'expiration, en avançant l'heure) ===== */
      await lancer('attente'); s = await scene();
      if (s.scenario !== 'attente' || !/18 h 30/.test(s.heure)) R.echec(`${ou} : scénario 2`, `attendu « Une place se libère » à 18 h 30 : ${JSON.stringify(s)}`, lieu);
      await onglet('attente');
      if (await page.locator('[data-attente="sc2-lambert"] [data-attente-proposer]').count()) R.echec(`${ou} : scénario 2`, 'une place est proposée avant l\'annulation : le scénario ne montrerait rien', lieu);
      await onglet('service'); await autre('Famille Weber', '[data-statut="annulee"]'); await attendu('après l\'annulation', 1);
      await onglet('attente'); await attendu('liste d\'attente ouverte', 2);
      const bouton = await texte('[data-attente="sc2-lambert"] [data-attente-proposer]');
      if (!/Proposer 20 h/.test(bouton) || !/réponse avant 19 h/.test(bouton)) R.echec(`${ou} : scénario 2`, `le bouton devrait dire « Proposer 20 h, réponse avant 19 h » : « ${bouton} »`, lieu);
      if (await page.locator('[data-attente="sc2-sylvie"] [data-attente-proposer]').count() !== 1 && !(await page.locator('[data-attente="sc2-sylvie"]').count())) R.echec(`${ou} : scénario 2`, 'la seconde tablée n\'apparaît pas', lieu);
      await page.locator('[data-attente="sc2-lambert"] [data-attente-proposer]').first().click(); await attendre(400); await attendu('proposition préparée', 3);
      if (!/valable jusqu'au vendredi .* à 19 h\b/.test(await texte('[data-attente="sc2-lambert"]'))) R.echec(`${ou} : scénario 2`, `l'échéance devrait être 19 h : « ${(await texte('[data-attente="sc2-lambert"]')).slice(0, 220)} »`, lieu);
      await page.locator('[data-attente="sc2-lambert"] [data-attente-accepter]').dblclick(); await attendre(500); s = await attendu('acceptée', 4, true);
      const creees = await page.evaluate(() => (JSON.parse(localStorage.getItem('jh-demo:attente:espace:v1') || '{}').resa?.ajouts || []).filter((r) => r.source === 'attente').length);
      if (creees !== 1) R.echec(`${ou} : scénario 2`, `${creees} réservations créées après un double clic (attendu : 1)`, lieu);
      await mesurerEcran(page, taille, 'scénario 2, liste d\'attente', false);
      /* La variante : recommencer, proposer, avancer l'heure jusqu'à l'échéance exacte. */
      await recommencer(); await onglet('service'); await autre('Famille Weber', '[data-statut="annulee"]'); await onglet('attente');
      await page.locator('[data-attente="sc2-lambert"] [data-attente-proposer]').first().click(); await attendre(350);
      await page.locator('[data-scene-avancer]').click(); await attendre(350);
      if (!(await page.locator('[data-attente="sc2-lambert"] [data-attente-accepter]').count())) R.echec(`${ou} : expiration`, 'à 18 h 45, la proposition (échéance 19 h) devrait encore pouvoir être acceptée', lieu);
      await page.locator('[data-scene-avancer]').click(); await attendre(350); /* 19 h : l'échéance exacte */
      const expiree = await texte('[data-attente="sc2-lambert"]');
      if (!/Proposition expirée/.test(expiree) || await page.locator('[data-attente="sc2-lambert"] [data-attente-accepter]').count()) R.echec(`${ou} : expiration`, `à 19 h pile, la proposition devrait être expirée : « ${expiree.slice(0, 200)} »`, lieu);
      if (!/Dernière minute/.test(expiree) || !/réponse sous 15 min, avant 19 h 15/.test(expiree)) R.echec(`${ou} : dernière minute`, `à 19 h, seule une proposition de dernière minute (15 min) devrait être offerte : « ${expiree.slice(0, 260)} »`, lieu);
      await page.locator('[data-attente="sc2-lambert"] [data-attente-proposer][data-mode="derniere-minute"]').first().click(); await attendre(400);
      const minute = await texte('[data-attente="sc2-lambert"]');
      if (!/en dernière minute/.test(minute) || !/à 19 h 15/.test(minute)) R.echec(`${ou} : dernière minute`, `la proposition devrait être dite « dernière minute », valable jusqu'à 19 h 15 : « ${minute.slice(0, 220)} »`, lieu);
      await page.reload({ waitUntil: 'load' }); await attendrePret(page); await attendre(600); await onglet('attente');
      if (!/à 19 h 15/.test(await texte('[data-attente="sc2-lambert"]'))) R.echec(`${ou} : dernière minute`, 'un rechargement a changé l\'échéance de la proposition', lieu);
      /* La page Réserver, dans le même onglet, suit le scénario (son jour et son heure). */
      const isoScenario = await page.evaluate(() => JSON.parse(localStorage.getItem('jh-demo:attente:horloge:v1')).iso);
      await page.goto(`${BASE}/reserver#formulaire`, { waitUntil: 'load' }); await attendrePret(page); await attendre(800);
      const reserver = await page.evaluate(() => ({ jour: document.querySelector('[data-jour]')?.dataset.jour, pastille: document.querySelector('.apercu-espace')?.textContent.replace(/\s+/g, ' ') || '' }));
      if (reserver.jour !== isoScenario || !/Démonstration en cours/.test(reserver.pastille)) R.echec(`${ou} : continuité`, `la page Réserver devrait partir du jour du scénario (${isoScenario}) et le dire : ${JSON.stringify(reserver)}`, { page: '/reserver', taille: taille.nom });
      await page.goto(BASE + P, { waitUntil: 'load' }); await attendrePret(page); await attendre(600);
      if ((await scene()).scenario !== 'attente') R.echec(`${ou} : continuité`, 'revenir du site à l\'espace fait sortir du scénario', lieu);

      /* ===== Scénario 3 : la terrasse doit rentrer ===== */
      await lancer('terrasse'); s = await scene();
      if (s.scenario !== 'terrasse' || !/Samedi \d+ (juin|juillet|août|septembre), 17 h/.test(s.heure)) R.echec(`${ou} : scénario 3`, `attendu un samedi d'été à 17 h : ${JSON.stringify(s)}`, lieu);
      if (!(await page.locator('button[data-repli]').count())) R.echec(`${ou} : scénario 3`, 'le plan de salle ne propose pas le repli : la terrasse devrait être ouverte ce jour-là', lieu);
      const avant3 = (await stock())['jh-demo:terrasse:espace:v1'];
      await page.locator('button[data-repli]').click(); await attendre(400); await attendu('aperçu ouvert', 1);
      const apercu = await texte('article[data-repli]');
      if (!/rien n'est encore changé/.test(apercu) || !/Tablée Marchand/.test(apercu) || !/Sans solution en salle/.test(apercu) || !/à rapprocher/.test(apercu)) R.echec(`${ou} : scénario 3`, `l'aperçu devrait montrer des places, un assemblage et un groupe sans solution : « ${apercu.slice(0, 240)} »`, lieu);
      const sel = page.locator('[data-repli-choix]').nth(1), autreOption = await sel.evaluate((x) => [...x.options].map((o) => o.value).find((v) => v !== x.value && v !== 'garder'));
      await sel.selectOption(autreOption); await attendre(350); await attendu('choix ajusté', 2);
      if ((await stock())['jh-demo:terrasse:espace:v1'] !== avant3) R.echec(`${ou} : scénario 3`, 'l\'aperçu et l\'ajustement ont modifié des réservations avant l\'application', lieu);
      await mesurerEcran(page, taille, 'scénario 3, aperçu du repli', false);
      await page.locator('[data-repli-appliquer]').dblclick(); await attendre(700); s = await attendu('repli appliqué', 4, true);
      const bilan3 = await texte('article[data-repli]');
      if (!/3 réservations déplacées\./.test(bilan3) || (await page.locator('[data-repli-resultat="deplacee"]').count()) !== 3 || !/Tablée Marchand.*reste sans solution/.test(bilan3)) R.echec(`${ou} : scénario 3`, `le bilan devrait compter trois déplacements réels et la tablée restante : « ${bilan3.slice(0, 260)} »`, lieu);
      await page.locator('[data-repli-fermer]').click(); await attendre(300);
      const plan3 = await page.evaluate(() => [...document.querySelectorAll('[data-choisir-resa]')].map((b) => b.innerText.replace(/\s+/g, ' ')));
      if (plan3.filter((x) => /table 1[012]\b|10\+11/.test(x)).length !== 1 || !plan3.some((x) => /Marchand/.test(x) && /10\+11/.test(x))) R.echec(`${ou} : scénario 3`, `sur le plan, seule la tablée Marchand devrait rester en terrasse : ${JSON.stringify(plan3)}`, lieu);

      /* v7.12.0 · « Reprendre » : le scénario 2, laissé avec une proposition de dernière minute à 19 h, se retrouve tel quel ;
         le badge « ouvert en ce moment » des pages publiques suit son heure (un vendredi à 19 h : la maison est ouverte). */
      if (!(await page.locator('[data-scene-etapes]').evaluate((d) => d.open))) await page.locator('[data-scene-etapes] > summary').click();
      await page.locator('[data-scene-etapes] [data-demo-lancer]').click(); await attendre(350);
      const cmd = await page.evaluate(() => ({ reprendre: [...document.querySelectorAll('[data-demo-reprendre]')].map((b) => b.dataset.demoReprendre).sort(), debut: document.querySelectorAll('[data-demo-choisir]').length }));
      if (cmd.debut !== 8 || cmd.reprendre.join() !== 'attente,service,terrasse') R.echec(`${ou} : lanceur`, `« Reprendre » devrait être proposé pour les trois scénarios déjà lancés, « Lancer depuis le début » pour tous : ${JSON.stringify(cmd)}`, lieu);
      await changerDePage(page, () => page.locator('[data-demo-reprendre="attente"]').click()); s = await scene();
      if (s.scenario !== 'attente' || !/19 h/.test(s.heure) || s.faites !== 3) R.echec(`${ou} : reprendre`, `« Reprendre » devrait garder la progression du scénario 2 (3 étapes, 19 h) : ${JSON.stringify(s)}`, lieu);
      await page.goto(`${BASE}/infos-pratiques`, { waitUntil: 'load' }); await attendrePret(page); await attendre(1500);
      const badge = await page.evaluate(() => { const c = document.querySelector('[data-statut-pied]'); return { etat: c?.closest('.statut')?.dataset.etat || '', texte: c?.textContent.replace(/\s+/g, ' ').trim() || '' }; });
      if (badge.etat !== 'ouvert') R.echec(`${ou} : horloge publique`, `dans le scénario 2 (un vendredi à 19 h), le statut des pages publiques devrait dire « ouvert » : ${JSON.stringify(badge)}`, { page: '/infos-pratiques', taille: taille.nom });
      await page.goto(BASE + P, { waitUntil: 'load' }); await attendrePret(page); await attendre(600);
      /* Dans le scénario en cours, « Reprendre » ferme simplement la fenêtre : rien n'est rechargé ni effacé. */
      if (!(await page.locator('[data-scene-etapes]').evaluate((d) => d.open))) await page.locator('[data-scene-etapes] > summary').click();
      await page.locator('[data-scene-etapes] [data-demo-lancer]').click(); await attendre(350); await page.locator('[data-demo-reprendre="attente"]').click(); await attendre(350);
      if (await page.locator('.esp-modale--demo:not([hidden])').count() || (await scene()).faites !== 3) R.echec(`${ou} : reprendre`, '« Reprendre » le scénario en cours devrait fermer la fenêtre sans rien changer', lieu);

      /* ===== Scénario 4 : le client change ses plans (accepté, puis refusé en recommençant) ===== */
      for (const accepte of [true, false]) {
        if (accepte) await lancer('client'); else await recommencer();
        s = await scene(); if (s.scenario !== 'client' || !/15 h/.test(s.heure)) R.echec(`${ou} : scénario 4`, `attendu « Le client change ses plans » à 15 h : ${JSON.stringify(s)}`, lieu);
        const li = ligne('Camille R.'); if (!(await li.locator('.esp-frise__plus').evaluate((d) => d.open))) await li.locator('.esp-frise__plus > summary').click();
        const href = await li.locator('[data-lien-venue]').getAttribute('href');
        if (!/[?&]demo=client/.test(href)) R.echec(`${ou} : continuité`, `le lien vers la page du client ne porte pas le scénario : ${href}`, lieu);
        await li.locator('[data-lien-venue]').evaluate((a) => a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })) || true).catch(() => {}); /* l'étape est notée au clic ; la page est ouverte ci-dessous dans un onglet du test */
        const client = await ctx.newPage(); await client.goto(BASE + href, { waitUntil: 'load' }); await attendre(1200);
        const etatClient = () => client.locator('[data-venue-etat]').getAttribute('data-venue-etat').catch(() => 'introuvable');
        if (await etatClient() !== 'confirmee' || !/heure simulée/.test(await texte('.venue__demo', client))) R.echec(`${ou} : scénario 4`, `la page du client devrait montrer la réservation confirmée du scénario, à son heure simulée (${await etatClient()})`, { page: '/votre-venue', taille: taille.nom });
        await client.locator('[data-venue-outil="modifier"]').click(); await client.locator('#venue-heure').selectOption('21:00'); await client.locator('#venue-couverts').fill('4'); await client.locator('[data-venue-form] button[type="submit"]').click(); await attendre(800);
        const garde = await texte('[data-esp-panneau-resas] [data-resa]:has([data-modif-client])');
        if (!/20 h 30/.test(garde) || !/2 couverts/.test(garde) || !/21 h, 4 couverts/.test(garde)) R.echec(`${ou} : scénario 4`, `l'espace doit garder 20 h 30 pour 2 et montrer la demande : « ${garde.slice(0, 200)} »`, lieu);
        await attendu('demande reçue dans l\'espace', 3);
        await page.locator(`[data-venue-reponse][data-accepte="${accepte ? '1' : ''}"]`).click(); await attendre(800); s = await attendu(accepte ? 'changement accepté' : 'changement refusé', 4, true);
        const apres = await texte('[data-esp-panneau-resas] [data-resa]:has-text("Camille R.")'), pageClient = await texte('.venue__carte', client);
        if (accepte && (!/21 h/.test(apres) || !/4 couverts/.test(apres) || await etatClient() !== 'modifiee' || !/accepté/.test(s.essayer))) R.echec(`${ou} : scénario 4`, `accepté : l'espace (« ${apres.slice(0, 80)} »), la page du client (${await etatClient()}) et la conclusion (« ${s.essayer.slice(0, 80)} ») devraient concorder`, lieu);
        if (!accepte && (!/20 h 30/.test(apres) || !/2 couverts/.test(apres) || !/n'a pas pu accepter/.test(pageClient) || !/refusé/.test(s.essayer))) R.echec(`${ou} : scénario 4`, `refusé : la réservation doit rester à 20 h 30 pour 2, et la page du client le dire : « ${apres.slice(0, 80)} » / « ${pageClient.slice(0, 120)} »`, lieu);
        if (accepte) { await mesurerEcran(client, taille, 'votre venue, dans un scénario', false);
          /* Aller-retour : depuis la page du client, « Revenir à l'espace » reste dans le scénario. */
          await changerDePage(client, () => client.locator('.venue__demo a').click());
          const retour = await client.evaluate(() => document.querySelector('[data-esp-scene]')?.dataset.scenario || ''); if (retour !== 'client') R.echec(`${ou} : continuité`, `revenir de la page du client à l'espace fait sortir du scénario (« ${retour} »)`, lieu); }
        await client.close();
      }

      /* « Lancer » un scénario déjà joué repart de son début (ici le scénario 2, laissé avec une proposition de dernière minute). */
      await lancer('attente'); s = await attendu('scénario 2 relancé depuis le choix', 0);
      if (!/18 h 30/.test(s.heure)) R.echec(`${ou} : relancer`, `« Lancer » un scénario déjà joué devrait le reprendre au début (18 h 30) : « ${s.heure} »`, lieu);
      if ((await stock())['jh-espace:v1'] !== habituel['jh-espace:v1']) R.echec(`${ou} : relancer`, 'relancer un scénario a touché aux données habituelles', lieu);

      /* ===== Un onglet ordinaire, en même temps : il reste dans son contexte, avec ses données ===== */
      const normal = await ctx.newPage(); await normal.goto(BASE + P, { waitUntil: 'load' }); await attendrePret(normal);
      if (await normal.locator('[data-esp-app]').isHidden()) await normal.locator('[data-esp-connexion] button[type="submit"]').click(); await attendre(700);
      const vuNormal = await normal.evaluate(() => ({ scenario: document.querySelector('[data-esp-scene]')?.dataset.scenario || '', tache: document.body.innerText.includes('Tâche de mon espace habituel'), camille: [...document.querySelectorAll('[data-resa]')].some((x) => /^sc\d-/.test(x.dataset.resa)) }));
      if (vuNormal.scenario || !vuNormal.tache || vuNormal.camille) R.echec(`${ou} : isolation`, `un onglet ordinaire devrait montrer l'espace habituel, sans scénario : ${JSON.stringify(vuNormal)}`, lieu);
      await normal.close();
      const fin = await stock();
      if (fin['jh-espace:v1'] !== habituel['jh-espace:v1'] || fin['jh-espace-resas:v1'] !== habituel['jh-espace-resas:v1'] || fin['jh-espace-venues:v1'] !== habituel['jh-espace-venues:v1']) R.echec(`${ou} : isolation`, 'après les quatre scénarios, les données habituelles ont changé', lieu);
      /* Quitter : l'espace habituel, dans le même onglet. */
      if (!(await page.locator('[data-scene-etapes]').evaluate((d) => d.open))) await page.locator('[data-scene-etapes] > summary').click();
      await changerDePage(page, () => page.locator('[data-scene-etapes] [data-scene-quitter]').click());
      const quitte = await page.evaluate(() => ({ scenario: document.querySelector('[data-esp-scene]')?.dataset.scenario || '', tache: document.body.innerText.includes('Tâche de mon espace habituel'), invite: [...document.querySelectorAll('[data-demo-lancer]')].some((b) => b.offsetParent) }));
      if (quitte.scenario || !quitte.tache || !quitte.invite) R.echec(`${ou} : quitter`, `après « Quitter la démonstration », on devrait retrouver l'espace habituel : ${JSON.stringify(quitte)}`, lieu);
      [...new Set(erreurs)].forEach((x) => R.echec('erreur de console ou ressource', x, lieu));
      R.ok(`espace : démonstrations (${taille.nom})`);
    } catch (err) { R.echec(`${ou} : parcours interrompu`, String(err.message || err).replace(/\u001b\[[0-9;]*m/g, '').replace(/\s+/g, ' ').slice(0, 420), lieu);
    } finally { await ctx.close(); }
  }

  /* ---------- 1 terdecies. Les réceptions de A à Z (v7.12.0) ----------
     Le cinquième scénario, « Une réception aux Jardins », joué de bout en bout sur ordinateur et à 390 px : la demande
     devient un dossier (un seul), une proposition est préparée, vue telle que le client la voit, puis présentée ; le
     conflit du samedi d'avant apparaît avant toute validation et la saisie est gardée ; l'option est posée ; l'agenda
     et la page Réserver la reflètent ; le client donne son accord (simulation) sur « Votre réception » ; l'équipe
     confirme ; le jour J se prépare ; la fiche s'ouvre. Puis les variantes : le client change ses plans (refus, puis
     acceptation), et l'option qui expire quand l'horloge atteint son échéance. Autour : les données habituelles
     intactes, le rechargement, le même dossier ouvert depuis l'Agenda, Aujourd'hui et la fiche client, les notes
     internes absentes de la page du client. */
  for (const taille of (!SEUL || SEUL.includes('1-terdecies') ? ['1366×768', '390×844'] : []).map(T)) {
    const lieu = { page: P, taille: taille.nom }, ou = `réceptions (${taille.nom})`;
    const { ctx, page, erreurs } = await contexte({ taille });
    try {
      const texte = async (sel, pg = page) => (await pg.locator(sel).first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
      const toast = () => texte('[data-esp-toast-texte]');
      const scene = () => page.evaluate(() => { const z = document.querySelector('[data-esp-scene]'); return { scenario: z?.dataset.scenario || '', finie: !!z?.classList.contains('est-finie'), heure: z?.querySelector('[data-scene-heure] .esp-long')?.textContent.replace(/\s+/g, ' ').trim() || '', essayer: z?.querySelector('[data-scene-essayer]')?.textContent.replace(/\s+/g, ' ').trim() || '', faites: z?.querySelectorAll('.esp-scene__etapes li.est-faite').length ?? -1 }; });
      const attendu = async (quoi, n, fin = false) => { const s = await scene(); if (s.faites !== n || s.finie !== fin) R.echec(`${ou} : étapes`, `${quoi} : ${s.faites} étape(s) faite(s) sur 7, attendu ${n}${fin ? ' et la conclusion' : ''} (« ${s.essayer.slice(0, 110)} »)`, lieu); return s; };
      const stock = () => page.evaluate(() => Object.fromEntries(Object.keys(localStorage).sort().map((k) => [k, localStorage.getItem(k)])));
      const changerDePage = async (pg, action) => { await pg.evaluate(() => { window.__ancienne = true; }); await action(); await pg.waitForFunction(() => !window.__ancienne && document.readyState === 'complete', null, { timeout: 15000 });
        await pg.waitForFunction(() => !!document.querySelector('[data-esp-app]') && !document.querySelector('[data-esp-app]').hidden, null, { timeout: 15000 }); await attendre(500); };
      const change = async (sel, v, pg = page) => { await pg.locator(sel).fill(v); await pg.locator(sel).dispatchEvent('change'); await attendre(300); };
      const onglet = async (id) => { await page.locator(`#rec-onglet-${id}`).click(); await attendre(350); };
      const etats = () => page.evaluate(() => ({ etape: document.querySelector('[data-rec-etape]')?.dataset.recEtape || '', retenue: document.querySelector('[data-rec-retenue]')?.dataset.recRetenue || '' }));
      const dossierS = () => page.evaluate(() => JSON.parse(localStorage.getItem('jh-demo:reception:espace:v1') || '{}').receptions?.dossiers?.['rec-sc5-demande'] || null);
      const debordement = async (pg, quoi) => { const d = await pg.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth); if (d > 1) R.echec(`${ou} : débordement`, `${quoi} déborde de ${d} px`, lieu); };
      const ouvrirEtapes = async () => { if (!(await page.locator('[data-scene-etapes]').evaluate((d) => d.open))) await page.locator('[data-scene-etapes] > summary').click(); await attendre(200); };

      /* ===== Avant : l'espace habituel ; les demandes de réception d'exemple y ont leur suivi ===== */
      await page.goto(BASE + P, { waitUntil: 'load' }); await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); }); await entrer(page); await aller(page, 'demandes');
      await page.locator('[data-filtre-demandes="reception"]').click(); await attendre(400);
      const phases = await page.evaluate(() => [...document.querySelectorAll('.esp-rec-phase__titre')].map((h) => h.childNodes[0].textContent.trim()));
      if (phases.join(' · ') !== 'À qualifier · Proposition · Décision attendue · Préparation · Terminé') R.echec(`${ou} : suivi`, `phases attendues : À qualifier · Proposition · Décision attendue · Préparation · Terminé ; vues : ${phases.join(' · ')}`, lieu);
      await page.locator('[data-rec-recherche]').fill('mariage'); await attendre(300);
      const trouve = await page.evaluate(() => ({ n: document.querySelectorAll('[data-rec-carte]').length, compte: document.querySelector('[data-rec-compte]')?.textContent || '', focus: document.activeElement?.matches('[data-rec-recherche]') }));
      if (trouve.n !== 1 || !/1 sur 3/.test(trouve.compte) || !trouve.focus) R.echec(`${ou} : suivi`, `la recherche « mariage » devrait garder une carte sur trois, sans quitter le champ : ${JSON.stringify(trouve)}`, lieu);
      await page.locator('[data-rec-recherche]').fill(''); await attendre(250);
      await mesurerEcran(page, taille, 'suivi des réceptions', false); await debordement(page, 'le suivi');
      const habituel = await stock();

      /* ===== Le scénario 5 ===== */
      await page.locator('[data-demo-lancer]:visible').first().click().catch(async () => { await aller(page, 'jour'); await page.locator('[data-demo-lancer]:visible').first().click(); }); await attendre(350);
      await changerDePage(page, () => page.locator('[data-demo-choisir="reception"]').click());
      let s = await scene();
      if (s.scenario !== 'reception' || !/Mercredi .*, 10 h/.test(s.heure) || !/Thomas B\./.test(s.essayer)) R.echec(`${ou} : scénario 5`, `attendu « Une réception aux Jardins », un mercredi à 10 h : ${JSON.stringify(s)}`, lieu);
      const cartes = await page.evaluate(() => [...document.querySelectorAll('[data-rec-carte]')].map((c) => `${c.dataset.recCarte}|${c.closest('.esp-rec-phase').querySelector('h3').childNodes[0].textContent.trim()}`));
      if (cartes.join() !== 'sc5-demande|À qualifier,rec-sc5-mariage|Préparation') R.echec(`${ou} : scénario 5`, `au départ : la demande de Thomas B. à qualifier, le mariage en préparation, et rien d'autre : ${cartes.join()}`, lieu);
      await attendu('au départ', 0);
      /* 1. La demande devient un dossier : un seul, même en insistant. */
      /* Deux clics coup sur coup sur le même bouton : un seul dossier. */
      await page.evaluate(() => { const b = document.querySelector('[data-rec-carte="sc5-demande"] .esp-rec-carte__creer button'); b.click(); b.click(); }); await attendre(600); await attendu('dossier créé', 1);
      if (Object.keys((await page.evaluate(() => JSON.parse(localStorage.getItem('jh-demo:reception:espace:v1')).receptions.dossiers))).length !== 2) R.echec(`${ou} : dossier`, 'un double clic sur « Créer le dossier » ne doit créer qu\'un dossier', lieu);
      const repris = await page.evaluate(() => ({ titre: document.querySelector('#rec-titre')?.textContent.trim(), focus: document.activeElement?.id, client: document.querySelector('#rec-client')?.value, annonces: document.querySelector('#rec-annonces')?.value, attentes: document.querySelector('#rec-attentes')?.value, souhait: document.querySelector('#rec-souhait')?.value }));
      if (!/Anniversaire · Thomas B\./.test(repris.titre) || repris.client !== 'Thomas B.' || repris.annonces !== '40' || !/40 ans de Julie/.test(repris.attentes) || !repris.souhait) R.echec(`${ou} : dossier`, `le dossier devrait reprendre la demande sans ressaisie : ${JSON.stringify(repris)}`, lieu);
      if (repris.focus !== 'rec-titre') R.echec(`${ou} : focus`, `à l'ouverture du dossier, le focus devrait être sur son titre (« ${repris.focus} »)`, lieu);
      let e = await etats(); if (e.etape !== 'a-qualifier' || e.retenue !== 'aucune') R.echec(`${ou} : dossier`, `un dossier neuf est à qualifier et ne retient rien : ${JSON.stringify(e)}`, lieu);
      await change('#rec-notes', 'NOTE-INTERNE budget serré'); await change('#rec-partage', 'Parking gratuit sur place.');
      await mesurerEcran(page, taille, 'dossier, onglet Projet', false); await debordement(page, 'le dossier');
      /* 2. La proposition : brouillon, aperçu client, présentation. Elle ne retient rien. */
      await onglet('proposition'); await page.locator('[data-rec-proposition-creer]').click(); await attendre(400);
      await page.locator('[data-rec-catalogue]').selectOption('menu-groupe'); await page.locator('[data-rec-ligne-ajouter]').click(); await attendre(400);
      await page.locator('[data-rec-catalogue]').selectOption('privatisation'); await page.locator('[data-rec-ligne-ajouter]').click(); await attendre(400);
      let total = await texte('[data-rec-total]'); if (!/^2\s?200\s?€$/.test(total)) R.echec(`${ou} : proposition`, `40 × 45 € + 400 € devraient faire 2 200 € : « ${total} »`, lieu);
      await change('#pl-qte-0', '42'); total = await texte('[data-rec-total]'); if (!/^2\s?290\s?€$/.test(total)) R.echec(`${ou} : proposition`, `42 × 45 € + 400 € devraient faire 2 290 € : « ${total} »`, lieu);
      await change('#pr-compris', 'Le service\nLa mise en place de la salle');
      await mesurerEcran(page, taille, 'proposition, brouillon', false); await debordement(page, 'la proposition');
      await page.locator('[data-rec-brouillon] [data-rec-apercu]').click(); await attendre(450);
      const doc = await page.evaluate(() => ({ texte: document.querySelector('.esp-modale--doc .esp-doc')?.innerText.replace(/\s+/g, ' ') || '', focus: !!document.activeElement?.closest('.esp-modale--doc') }));
      if (!/Démonstration · proposition d'exemple, sans valeur contractuelle/i.test(doc.texte) || !/2\s?290\s?€/.test(doc.texte) || /NOTE-INTERNE/.test(doc.texte) || !doc.focus) R.echec(`${ou} : document`, `l'aperçu client doit être marqué « démonstration », porter le total, taire les notes internes et prendre le focus : ${JSON.stringify(doc).slice(0, 300)}`, lieu);
      await mesurerEcran(page, taille, 'proposition, aperçu client', false);
      await page.keyboard.press('Escape'); await attendre(300); if (await page.locator('.esp-modale--doc:not([hidden])').count()) R.echec(`${ou} : document`, 'Échap ne ferme pas l\'aperçu', lieu);
      await page.locator('[data-rec-presenter]').click(); await attendre(500); await attendu('proposition présentée', 2);
      e = await etats(); if (e.etape !== 'presentee' || e.retenue !== 'aucune') R.echec(`${ou} : proposition`, `une proposition présentée ne retient aucun espace : ${JSON.stringify(e)}`, lieu);
      /* 3. Les espaces. D'abord le conflit du samedi d'avant, vu avant de valider ; la saisie est gardée. */
      await onglet('espaces'); const s2 = await page.locator('#rf-jour').inputValue(), s1 = new Date(Date.parse(`${s2}T12:00:00Z`) - 7 * 86400000).toISOString().slice(0, 10);
      await change('#rf-arrivee', '19:00'); await change('#rf-fin', '01:00'); await change('#rf-jour', s1);
      let verif = await page.evaluate(() => ({ etat: document.querySelector('[data-rec-verif]')?.dataset.recVerif, texte: document.querySelector('[data-rec-verif]')?.innerText.replace(/\s+/g, ' ') || '' }));
      if (verif.etat !== 'conflit' || !/La salle du restaurant : déjà réservé du samedi .* à 16 h au dimanche .* à 3 h pour « Mariage · Camille et Hugo »/.test(verif.texte)) R.echec(`${ou} : conflit`, `le conflit devrait nommer l'espace, la période et le dossier, avant toute validation : ${JSON.stringify(verif).slice(0, 320)}`, lieu);
      await mesurerEcran(page, taille, 'espaces, conflit', false);
      await page.locator('[data-rec-retenir="option"]').click(); await attendre(500);
      e = await etats(); const garde = await page.locator('#rf-jour').inputValue();
      if (e.retenue !== 'aucune' || garde !== s1 || !/Mariage · Camille et Hugo/.test(await toast())) R.echec(`${ou} : conflit`, `une validation impossible garde le dossier et la saisie, et dit pourquoi : ${JSON.stringify({ e, garde, toast: await toast() })}`, lieu);
      /* Une autre solution : la salle de réception est libre ce samedi-là ; puis retour à la date demandée. */
      await page.locator('[data-rec-form="espace"][value="restaurant"]').uncheck(); await attendre(300); await page.locator('[data-rec-form="espace"][value="salle-reception"]').check(); await attendre(300);
      if (await page.locator('[data-rec-verif]').getAttribute('data-rec-verif') !== 'libre') R.echec(`${ou} : conflit`, 'la salle de réception devrait être libre le samedi du mariage', lieu);
      await page.locator('[data-rec-form="espace"][value="salle-reception"]').uncheck(); await attendre(300); await page.locator('[data-rec-form="espace"][value="restaurant"]').check(); await attendre(300); await change('#rf-jour', s2);
      verif = await page.evaluate(() => ({ etat: document.querySelector('[data-rec-verif]')?.dataset.recVerif, texte: document.querySelector('[data-rec-verif]')?.innerText.replace(/\s+/g, ' ') || '' }));
      if (verif.etat !== 'libre' || !/du samedi .* à 17 h au dimanche .* à 2 h \(la soirée finit le lendemain\)/.test(verif.texte)) R.echec(`${ou} : option`, `la période devrait aller de la préparation (17 h) à la remise en état (2 h le lendemain) : ${JSON.stringify(verif).slice(0, 300)}`, lieu);
      await page.locator('[data-rec-retenir="option"]').dblclick(); await attendre(600); await attendu('option posée', 3);
      e = await etats(); const ret = (await dossierS()).retenue;
      if (e.retenue !== 'option' || ret.debut !== `${s2}T17:00` || ret.tables.length !== 9 || !ret.salle || !/T18:00$/.test(ret.echeance)) R.echec(`${ou} : option`, `l'option devrait retenir les neuf tables de la salle, de 17 h à 2 h, jusqu'à une échéance à 18 h : ${JSON.stringify({ e, ret })}`, lieu);
      if ((await dossierS()).historique.filter((h) => /^Option/.test(h.quoi)).length !== 1) R.echec(`${ou} : option`, 'un double clic ne doit poser qu\'une option', lieu);
      await mesurerEcran(page, taille, 'espaces, option posée', false);
      /* L'agenda, la salle et la page Réserver reflètent l'option. */
      await aller(page, 'resas'); for (let k = 0; k < 6 && !(await page.locator(`[data-jour="${s2}"]`).count()); k++) { await page.locator('[data-semaine="7"]').click(); await attendre(250); }
      if (!/Option/.test(await texte(`[data-jour="${s2}"]`))) R.echec(`${ou} : agenda`, 'la semaine devrait marquer « Option » le samedi de la réception', lieu);
      await page.locator(`[data-jour="${s2}"]`).click(); await attendre(400);
      const ligne = await page.evaluate(() => { const li = document.querySelector('.esp-fil__item.est-option'); return li ? li.innerText.replace(/\s+/g, ' ') : ''; });
      if (!/RÉCEPTION · OPTION/i.test(ligne) || !/Option jusqu'au/.test(ligne) || !/préparation 17 h · invités 19 h · fin 1 h \(le lendemain\) · remise en état jusqu'à 2 h/.test(ligne)) R.echec(`${ou} : agenda`, `la ligne de l'agenda devrait dire « option », son échéance, la préparation et la remise en état : « ${ligne.slice(0, 260)} »`, lieu);
      await mesurerEcran(page, taille, 'agenda, jour d\'une option', false);
      /* Le plan de salle de ce soir-là : les neuf tables sont retenues, et le disent. */
      await page.locator('[role="tab"][data-onglets-resas][data-onglet="salle"]').click(); await attendre(450);
      const salle = await page.evaluate(() => ({ notice: document.querySelector('.esp-salle-carte [data-rec-notice]')?.innerText.replace(/\s+/g, ' ') || '', retenues: [...document.querySelectorAll('.esp-table')].filter((t) => /retenue pour une réception/.test(t.getAttribute('aria-label') || '')).length }));
      if (!/Réception · option/i.test(salle.notice) || !/toute la salle du restaurant est retenue/.test(salle.notice) || salle.retenues !== 9) R.echec(`${ou} : plan de salle`, `le plan devrait dire que la salle est retenue (9 tables) : ${JSON.stringify(salle).slice(0, 260)}`, lieu);
      await mesurerEcran(page, taille, 'plan de salle, tables retenues par une option', false);
      await page.locator('[role="tab"][data-onglets-resas][data-onglet="agenda"]').click(); await attendre(400);
      await page.locator('.esp-fil__item.est-option [data-activite]').click(); await attendre(500);
      if (await page.locator('[data-rec-dossier]').getAttribute('data-rec-dossier') !== 'rec-sc5-demande') R.echec(`${ou} : un seul dossier`, 'l\'agenda devrait ouvrir le dossier de Thomas B.', lieu);
      await page.goto(`${BASE}/reserver?date=${s2}&service=soir#formulaire`, { waitUntil: 'load' }); await attendrePret(page); await attendre(1500);
      const reserver = await texte('[data-resa-creneaux-aide]'); if (!/accueille une réception/.test(reserver)) R.echec(`${ou} : page Réserver`, `le soir de l'option, la page Réserver devrait dire que le restaurant accueille une réception : « ${reserver} »`, { page: '/reserver', taille: taille.nom });
      /* Recharger : le dossier ouvert, la progression et l'heure sont gardés. */
      await page.goto(BASE + P, { waitUntil: 'load' }); await attendrePret(page); await attendre(700); await attendu('après un tour sur le site', 3);
      if (await page.locator('[data-rec-dossier]').count() !== 1) R.echec(`${ou} : rechargement`, 'au retour dans l\'espace, le dossier ouvert devrait l\'être encore', lieu);
      /* 4. Le client : sa page, sans les notes internes ; l'accord (simulation) ne confirme rien. */
      await onglet('client'); const href = await page.locator('[data-lien-reception]').getAttribute('href');
      if (!/^\/votre-reception\?d=rec-sc5-demande&c=[a-z0-9]{6}&demo=reception$/.test(href)) R.echec(`${ou} : continuité`, `le lien de la page du client devrait porter le dossier, son code et le scénario : ${href}`, lieu);
      const client = await ctx.newPage(); client.on('pageerror', (x) => erreurs.push(`page du client : ${x.message}`)); await client.goto(BASE + href, { waitUntil: 'load' }); await attendrePret(client); await attendre(1200);
      const etatClient = () => client.locator('[data-reception-etat]').getAttribute('data-reception-etat').catch(() => 'introuvable');
      const vue = await client.evaluate(() => document.querySelector('[data-reception-client]').innerText.replace(/\s+/g, ' '));
      if (await etatClient() !== 'presentee' || !/Proposition à consulter/.test(vue) || !/2\s?290\s?€/.test(vue) || !/Parking gratuit sur place/.test(vue) || /NOTE-INTERNE|Camille|Mariage/.test(vue) || !/heure simulée/.test(vue)) R.echec(`${ou} : page du client`, `la page devrait montrer la proposition, l'information partagée et l'heure simulée, sans note interne ni autre dossier : « ${vue.slice(0, 300)} »`, { page: '/votre-reception', taille: taille.nom });
      await mesurerEcran(client, taille, 'votre réception, proposition à consulter', false); await debordement(client, 'la page du client');
      await client.locator('[data-reception-accorder]').click(); await attendre(300); await client.locator('[data-reception-accord-oui]').click(); await attendre(900);
      if (await etatClient() !== 'accord' || !/À confirmer par l'équipe/.test(await texte('.venue__etat', client))) R.echec(`${ou} : accord`, `après l'accord, la page du client devrait dire « À confirmer par l'équipe » (${await etatClient()})`, { page: '/votre-reception', taille: taille.nom });
      await attendu('accord du client', 4); e = await etats();
      if (e.etape !== 'accord' || e.retenue !== 'option' || !/Accord du client — simulation \(version 1\)/.test(await texte('[data-rec-etape]'))) R.echec(`${ou} : accord`, `l'accord est une simulation sur la version 1 ; il ne confirme rien : ${JSON.stringify(e)}`, lieu);
      /* 5. La confirmation par l'équipe. */
      await onglet('espaces'); const conditions = await page.evaluate(() => [...document.querySelectorAll('.esp-rec-conditions li')].map((li) => li.classList.contains('est-ok')));
      if (conditions.join() !== 'true,true,true') R.echec(`${ou} : confirmation`, `les trois conditions devraient être remplies : ${conditions.join()}`, lieu);
      await page.locator('.esp-rec-confirmer [data-rec-retenir="ferme"]').click(); await attendre(700); await attendu('réception confirmée', 5);
      e = await etats(); if (e.etape !== 'confirmee' || e.retenue !== 'ferme' || await etatClient() !== 'confirmee') R.echec(`${ou} : confirmation`, `la réception devrait être confirmée des deux côtés : ${JSON.stringify(e)} / ${await etatClient()}`, lieu);
      if (!/Rien n'est envoyé/.test(await toast())) R.echec(`${ou} : confirmation`, `le message devrait dire que rien n'est envoyé : « ${await toast()} »`, lieu);
      /* 6 et 7. Le jour J : les tâches, une information, la fiche. */
      await onglet('jourj'); await page.evaluate(() => { const b = document.querySelector('[data-rec-taches]'); b.click(); b.click(); }); await attendre(600);
      if (await page.locator('.esp-dem__taches li').count() !== 6) R.echec(`${ou} : jour J`, `six tâches habituelles attendues, même après un double clic : ${await page.locator('.esp-dem__taches li').count()}`, lieu);
      await attendu('tâches seules', 5); await change('#jj-cuisine', 'Menu arrêté le 10 : sans fruits à coque pour deux invités.'); await attendu('une information pour l\'équipe', 6);
      await onglet('jourj'); await mesurerEcran(page, taille, 'dossier, onglet Jour J', false); await debordement(page, 'l\'onglet Jour J');
      await page.locator('[data-rec-fiche]').click(); await attendre(450);
      const fiche = await texte('.esp-modale--doc .esp-doc');
      if (!/FICHE DU JOUR J/i.test(fiche) || !/Réception confirmée/.test(fiche) || !/17 h Préparation/.test(fiche) || !/1 h \(le lendemain\) Fin de la réception/.test(fiche) || !/sans fruits à coque/.test(fiche) || !/Invités confirmés À renseigner/.test(fiche) || /NOTE-INTERNE/.test(fiche)) R.echec(`${ou} : fiche du jour J`, `la fiche devrait relire le dossier et dire ce qui manque : « ${fiche.slice(0, 420)} »`, lieu);
      await mesurerEcran(page, taille, 'fiche du jour J', false); await page.keyboard.press('Escape'); await attendre(300);
      s = await attendu('fiche consultée', 7, true);
      if (!/réception confirmée : La salle du restaurant, du samedi .* à 17 h au dimanche .* à 2 h/.test(s.essayer) || !/Rien n'a été envoyé, signé ni encaissé/.test(s.essayer)) R.echec(`${ou} : conclusion`, `la conclusion devrait décrire le résultat obtenu : « ${s.essayer} »`, lieu);
      /* Le même dossier depuis Aujourd'hui (la tâche du jour J) et depuis la fiche client. */
      await aller(page, 'clients'); await page.locator('[data-client]', { hasText: 'Thomas B.' }).first().click(); await attendre(450);
      if (!(await page.locator('[data-fiche-dossiers] [data-rec-ouvrir="rec-sc5-demande"]').count())) R.echec(`${ou} : un seul dossier`, 'la fiche du client devrait lister sa réception', lieu);
      else { await page.locator('[data-fiche-dossiers] [data-rec-ouvrir]').click(); await attendre(500); if (await page.locator('[data-rec-dossier]').getAttribute('data-rec-dossier') !== 'rec-sc5-demande' || await page.locator('.esp-modale--fiche:not([hidden])').count()) R.echec(`${ou} : un seul dossier`, 'depuis la fiche client, le même dossier devrait s\'ouvrir (et la fiche se fermer)', lieu); }

      /* ===== Variante : le client change ses plans ===== */
      const avant = JSON.stringify(await dossierS());
      await client.locator('[data-reception-outil="changement"]').click(); await attendre(300); await client.locator('#rc-invites').fill('120'); await client.locator('[data-reception-form="changement"] button[type="submit"]').click(); await attendre(900);
      if (!/En attente de la réponse du restaurant/.test(await texte('[data-reception-attente]', client)) || !/40 \(annoncés\)/.test(await texte('.venue__recap', client))) R.echec(`${ou} : changement`, 'la page du client devrait dire la demande en attente et garder ce qui est convenu', { page: '/votre-reception', taille: taille.nom });
      if (JSON.stringify(await dossierS()) !== avant) R.echec(`${ou} : changement`, 'la demande du client a modifié le dossier avant toute décision', lieu);
      await aller(page, 'jour'); const prio = await page.evaluate(() => [...document.querySelectorAll('[data-faire-priorite]')].map((b) => b.closest('li, article, div')?.innerText.replace(/\s+/g, ' ') || '').find((t) => /demande un changement/.test(t)) || '');
      if (!/Thomas B\. demande un changement/.test(prio)) { R.echec(`${ou} : Aujourd'hui`, `la demande du client devrait remonter dans les priorités : « ${prio.slice(0, 160)} » ; vues : ${(await page.evaluate(() => [...document.querySelectorAll('.esp-conseil__actions')].map((p) => p.closest('li')?.innerText.replace(/\s+/g, ' ').slice(0, 70)).join(' ¦ '))).slice(0, 300)}`, lieu); await aller(page, 'demandes'); await page.locator('[data-filtre-demandes="reception"]').click(); await attendre(300); await page.locator('[data-rec-ouvrir="rec-sc5-demande"]').first().click(); await attendre(400); await onglet('client'); }
      else { await page.locator('[data-faire-priorite^="rec-client-"]').first().click(); await attendre(500); if (await page.locator('[data-rec-panneau]').getAttribute('data-rec-panneau') !== 'client') R.echec(`${ou} : Aujourd'hui`, 'la priorité devrait ouvrir le dossier sur l\'onglet Client', lieu); }
      const cons = await texte('[data-rec-consequences]');
      if (!/Invités : 40 → 120/.test(cons) || !/Capacité des espaces retenus : 100\. Elle serait dépassée/.test(cons)) R.echec(`${ou} : changement`, `les conséquences devraient être dites avant d'accepter : « ${cons.slice(0, 240)} »`, lieu);
      await mesurerEcran(page, taille, 'dossier, demande de changement', false);
      await page.locator('[data-rec-decider] button[value="oui"]').click(); await attendre(500);
      if (!/capacité de 100/.test(await toast()) || JSON.stringify(await dossierS()) !== avant) R.echec(`${ou} : changement`, `accepter 120 invités devrait être refusé, sans rien changer : « ${await toast()} »`, lieu);
      await page.locator('[data-rec-decider] button[value="non"]').click(); await attendre(700);
      let dS = await dossierS(); if (dS.retenue.etat !== 'ferme' || dS.projet.invitesConfirmes !== 0 || !/n'a pas pu accepter/.test(await texte('[data-reception-decision="refusee"]', client))) R.echec(`${ou} : changement`, 'un refus garde la réception confirmée telle quelle, et la page du client le dit', lieu);
      await client.locator('[data-reception-outil="changement"]').click(); await attendre(300); await client.locator('#rc-invites').fill('60'); await client.locator('[data-reception-form="changement"] button[type="submit"]').click(); await attendre(900);
      await attendre(400); await page.locator('[data-rec-decider] button[value="oui"]').click(); await attendre(700); dS = await dossierS();
      if (dS.projet.invitesConfirmes !== 60 || dS.retenue.etat !== 'ferme' || !dS.aRevoir || !/60 \(confirmés\)/.test(await texte('.venue__recap', client)) || !/a accepté/.test(await texte('[data-reception-decision="acceptee"]', client))) R.echec(`${ou} : changement`, `accepter 60 invités met à jour l'effectif des deux côtés, garde la réception confirmée et marque la proposition « à revoir » : ${JSON.stringify({ n: dS.projet.invitesConfirmes, r: dS.retenue.etat, aRevoir: dS.aRevoir })}`, lieu);
      await mesurerEcran(client, taille, 'votre réception, confirmée, avec ses demandes', false);

      /* ===== v7.12.1 · Ce qui est convenu reste clair : la révision après la confirmation =====
         60 invités sont acceptés ; la version 1 (40 menus, 2 290 €) reste acceptée et intacte ; une version 2 est
         préparée, présentée, acceptée par le client ; le jour J suit ; les espaces restent réservés tout du long. */
      const commerce = () => page.evaluate(() => ({ cles: document.querySelector('[data-rec-commerce]')?.dataset.recCommerce || '', texte: document.querySelector('[data-rec-commerce]')?.innerText.replace(/\s+/g, ' ') || '', suite: document.querySelector('[data-rec-suite]')?.innerText.replace(/\s+/g, ' ') || '', revision: document.querySelector('[data-rec-revision]')?.innerText.replace(/\s+/g, ' ') || '' }));
      const jourJ = () => page.evaluate(() => { const t = (c) => document.querySelector(`[data-rec-section="${c}"]`)?.innerText.replace(/\s+/g, ' ') || ''; return { base: document.querySelector('[data-rec-base]')?.innerText.replace(/\s+/g, ' ') || '', reception: t('reception'), aValider: t('a-valider'), prestations: t('prestations'), proposees: t('proposees'), pastille: document.querySelector('[data-rec-a-valider]')?.dataset.recAValider || '' }; });
      const lieuClient = { page: '/votre-reception', taille: taille.nom };
      let k = await commerce();
      if (k.cles !== 'acceptee revision' || !/Proposition acceptée : version 1/.test(k.texte) || !/Révision à préparer/.test(k.texte) || !/60 invités/.test(k.revision) || !/La version 1 acceptée reste la référence/.test(k.revision) || !/Préparer une nouvelle version de la proposition \(60 invités\)/.test(k.suite)) R.echec(`${ou} : révision`, `après l'acceptation des 60 invités, le dossier devrait dire « Proposition acceptée : version 1 » et « Révision à préparer » : ${JSON.stringify(k).slice(0, 420)}`, lieu);
      if (await client.locator('[data-reception-focus]').getAttribute('data-reception-revision') !== 'due' || !/l'équipe doit encore mettre la proposition à jour ; la version 1 reste la référence/.test(await texte('.venue__phrase', client))) R.echec(`${ou} : révision`, `la page du client devrait dire qu'une mise à jour de la proposition est attendue : « ${(await texte('.venue__phrase', client)).slice(0, 220)} »`, lieuClient);
      await onglet('jourj'); let jj = await jourJ();
      if (!/Version 1 · .* 2 290 €.* établie pour 40 invités/.test(jj.reception) || !/Proposition à réviser/.test(jj.aValider) || !/60 invités confirmés ; les prestations acceptées \(version 1\) sont établies pour 40/.test(jj.aValider) || jj.pastille !== '2') R.echec(`${ou} : révision`, `le jour J devrait garder la version 1 et signaler ce qui reste à valider : ${JSON.stringify(jj).slice(0, 420)}`, lieu);
      /* Un brouillon créé puis abandonné n'efface pas la révision due. */
      await page.locator('[data-rec-revision] [data-rec-onglet="proposition"]').click(); await attendre(400);
      if (await page.locator('[data-rec-panneau]').getAttribute('data-rec-panneau') !== 'proposition') R.echec(`${ou} : révision`, '« Ouvrir la proposition » devrait mener à l\'onglet Proposition', lieu);
      await page.locator('[data-rec-nouvelle-version]').click(); await attendre(500); await page.locator('[data-rec-abandonner]').click(); await attendre(500); k = await commerce();
      if (k.cles !== 'acceptee revision' || (await dossierS()).projet.invitesConfirmes !== 60) R.echec(`${ou} : révision`, `un brouillon abandonné ne doit effacer ni la révision due ni le changement accepté : ${JSON.stringify(k).slice(0, 240)}`, lieu);
      /* La version 2 : 60 menus, présentée. */
      await page.locator('[data-rec-nouvelle-version]').click(); await attendre(500); await change('#pl-qte-0', '60');
      if (!/3\s?100\s?€/.test(await texte('[data-rec-total]')) || (await commerce()).cles !== 'acceptee brouillon') R.echec(`${ou} : révision`, `la version 2 devrait totaliser 3 100 € et le dossier dire « Version 2 en préparation » : ${await texte('[data-rec-total]')} / ${(await commerce()).cles}`, lieu);
      const retAvant = JSON.stringify((await dossierS()).retenue);
      await page.locator('[data-rec-presenter]').click(); await attendre(700); k = await commerce(); e = await etats(); dS = await dossierS();
      if (e.etape !== 'confirmee' || e.retenue !== 'ferme' || JSON.stringify(dS.retenue) !== retAvant || k.cles !== 'acceptee attente' || !/Version 2 présentée, accord attendu/.test(k.texte) || !/Attendre l'accord du client sur la version 2/.test(k.suite)) R.echec(`${ou} : révision`, `présenter la version 2 ne libère rien et ne confirme rien de plus : ${JSON.stringify({ e, cles: k.cles, suite: k.suite }).slice(0, 320)}`, lieu);
      const versions = await page.evaluate(() => [...document.querySelectorAll('[data-rec-version]')].map((li) => `${li.dataset.recVersion}:${li.dataset.recVersionEtat}`).join(' '));
      if (versions !== '2:attente 1:acceptee' || !(await page.locator('[data-rec-retirer-ouvrir]').count())) R.echec(`${ou} : révision`, `la liste devrait dire la version 2 en attente et la version 1 acceptée, et proposer de retirer la version 2 : ${versions}`, lieu);
      await mesurerEcran(page, taille, 'dossier, version 2 en attente d\'accord', false); await debordement(page, 'l\'onglet Proposition avec deux versions');
      /* Le document de la version 1 : resté tel qu'il a été présenté (40 invités, 2 290 €), alors que le dossier dit 60. */
      await page.locator('[data-rec-version="1"] [data-rec-apercu]').click(); await attendre(450);
      const doc1 = await texte('.esp-modale--doc .esp-doc');
      if (!(await page.locator('.esp-modale--doc [data-doc-contexte="instantane"]').count()) || !/Proposition version 1 · présentée le/.test(doc1) || !/Pour Thomas B\. · .* · 40 invités annoncés/.test(doc1) || !/42 par personne/.test(doc1) || !/2\s?290\s?€/.test(doc1) || /60/.test(doc1.replace(/2026/g, ''))) R.echec(`${ou} : instantané`, `le document de la version 1 devrait rester à 40 invités et 2 290 € : « ${doc1.slice(0, 420)} »`, lieu);
      await mesurerEcran(page, taille, 'proposition version 1, instantané', false); await page.keyboard.press('Escape'); await attendre(300);
      /* Le jour J : la version 1 reste la base ; la version 2 est « à valider ». */
      await onglet('jourj'); jj = await jourJ();
      if (!/Préparez sur la base de la version 1 acceptée, établie pour 40 invités\. 2 points restent à valider/.test(jj.base) || !/Version 2 présentée Accord du client attendu \(3 100 €, pour 60 invités\)/.test(jj.aValider) || !/ACCEPTÉES \(VERSION 1\).*42 par personne/i.test(jj.prestations) || !/PROPOSÉES \(VERSION 2, ACCORD ATTENDU\).*60 par personne/i.test(jj.proposees) || !/Version 1 · /.test(jj.reception)) R.echec(`${ou} : jour J`, `une version seulement présentée ne doit pas devenir la proposition retenue : ${JSON.stringify(jj).slice(0, 520)}`, lieu);
      await mesurerEcran(page, taille, 'dossier, jour J avec une révision en attente', false); await debordement(page, 'le jour J avec une révision en attente');
      await page.locator('[data-rec-fiche]').click(); await attendre(450); const fiche2 = await texte('.esp-modale--doc .esp-doc');
      if (!/À VALIDER AVANT LE JOUR J/i.test(fiche2) || !/Préparez sur la base de la version 1 acceptée/.test(fiche2) || !/Version 2 présentée/.test(fiche2)) R.echec(`${ou} : fiche du jour J`, `la fiche imprimable devrait signaler ce qui reste à valider : « ${fiche2.slice(0, 420)} »`, lieu);
      await mesurerEcran(page, taille, 'fiche du jour J, révision en attente', false); await page.keyboard.press('Escape'); await attendre(300);
      /* La page du client : la version 2 à accepter, la version 1 acceptée toujours consultable. */
      await attendre(500);
      const cl2 = await client.evaluate(() => ({ etat: document.querySelector('[data-reception-etat]')?.dataset.receptionEtat, v: document.querySelector('[data-reception-proposition]')?.dataset.receptionProposition, acc: document.querySelector('[data-reception-acceptee]')?.dataset.receptionAcceptee, attente: document.querySelector('[data-reception-attente-version]')?.innerText.replace(/\s+/g, ' ') || '', bouton: !!document.querySelector('[data-reception-accorder]'), phrase: document.querySelector('.venue__phrase')?.innerText.replace(/\s+/g, ' ') || '', recap: document.querySelector('.venue__recap')?.innerText.replace(/\s+/g, ' ') || '' }));
      if (cl2.etat !== 'confirmee' || cl2.v !== '2' || cl2.acc !== '1' || !cl2.bouton || !/Version 2 présentée : votre accord est attendu/.test(cl2.attente) || !/il ne vaut pas pour celle-ci/.test(cl2.attente) || !/Une nouvelle proposition \(version 2\) attend votre accord/.test(cl2.phrase) || !/Proposition acceptée Version 1, 2 290 €/.test(cl2.recap) || !/Proposition en attente Version 2, 3 100 €/.test(cl2.recap)) R.echec(`${ou} : révision`, `la page du client devrait montrer la version 2 à accepter et la version 1 acceptée : ${JSON.stringify(cl2).slice(0, 520)}`, lieuClient);
      await client.locator('.venue__details summary').click(); await attendre(300);
      const acc1 = await texte('[data-reception-acceptee]', client);
      if (!/Établie pour 40 invités/.test(acc1) || !/42 par personne/.test(acc1) || !/2\s?290\s?€/.test(acc1)) R.echec(`${ou} : instantané`, `sur la page du client, la version 1 acceptée devrait rester à 40 invités : « ${acc1.slice(0, 300)} »`, lieuClient);
      await mesurerEcran(client, taille, 'votre réception, version 2 en attente d\'accord', false); await debordement(client, 'la page du client avec deux versions');
      await client.locator('[data-reception-accorder]').click(); await attendre(300);
      if (!/elle deviendra la proposition retenue\. Vos espaces restent réservés/.test(await texte('.venue__form', client))) R.echec(`${ou} : révision`, `la confirmation de l'accord devrait dire ce qu'il change : « ${(await texte('.venue__form', client)).slice(0, 240)} »`, lieuClient);
      await mesurerEcran(client, taille, 'votre réception, accord sur la version 2', false);
      await client.locator('[data-reception-accord-oui]').click(); await attendre(900);
      const cl3 = await client.evaluate(() => ({ msg: document.querySelector('.venue__message')?.innerText.replace(/\s+/g, ' ') || '', accord: document.querySelector('[data-reception-accord]')?.dataset.receptionAccord, bouton: !!document.querySelector('[data-reception-accorder]'), acc: !!document.querySelector('[data-reception-acceptee]'), recap: document.querySelector('.venue__recap')?.innerText.replace(/\s+/g, ' ') || '' }));
      if (!/accord sur la version 2 est noté \(simulation\)\. Elle devient la proposition retenue/.test(cl3.msg) || cl3.accord !== '2' || cl3.bouton || cl3.acc || !/Proposition acceptée Version 2, 3 100 €, établie pour 60 invités/.test(cl3.recap) || /Proposition en attente/.test(cl3.recap)) R.echec(`${ou} : révision`, `après l'accord, la version 2 devrait être la proposition acceptée du client : ${JSON.stringify(cl3).slice(0, 420)}`, lieuClient);
      /* L'espace suit, d'un bloc : proposition acceptée, jour J, prestations ; les espaces n'ont pas bougé. */
      await attendre(600); k = await commerce(); jj = await jourJ(); e = await etats(); dS = await dossierS();
      if (k.cles !== 'acceptee' || !/Proposition acceptée : version 2/.test(k.texte) || k.revision || jj.aValider || jj.proposees || !/Version 2 · .*3 100 €.*établie pour 60 invités/.test(jj.reception) || !/ACCEPTÉES \(VERSION 2\).*60 par personne/i.test(jj.prestations) || !/Préparez sur la base de la version 2 acceptée, établie pour 60 invités\.$/.test(jj.base) || e.etape !== 'confirmee' || JSON.stringify(dS.retenue) !== retAvant) R.echec(`${ou} : jour J`, `l'accord sur la version 2 devrait mettre à jour la proposition retenue et le jour J ensemble, sans toucher aux espaces : ${JSON.stringify({ cles: k.cles, jj, e }).slice(0, 560)}`, lieu);
      await mesurerEcran(page, taille, 'dossier, jour J après l\'accord sur la version 2', false);
      const accords = await page.evaluate(() => (JSON.parse(localStorage.getItem('jh-demo:reception:espace-venues:v1') || '{}')['rec-sc5-demande']?.accords || []).map((a) => a.version).join(','));
      if (accords !== '1,2') R.echec(`${ou} : accords`, `les accords devraient être gardés version par version (1 puis 2) : « ${accords} »`, lieu);
      /* La version 1, encore : toujours consultable, toujours intacte. */
      await onglet('proposition');
      const v1 = await page.evaluate(() => ({ etat: document.querySelector('[data-rec-version="1"]')?.dataset.recVersionEtat, texte: document.querySelector('[data-rec-version="1"]')?.innerText.replace(/\s+/g, ' ') || '' }));
      if (v1.etat !== 'ancienne' || !/2\s?290\s?€ · pour 40 invités/.test(v1.texte) || !/Acceptée, puis remplacée/.test(v1.texte) || !/Accord du client — simulation/.test(v1.texte)) R.echec(`${ou} : instantané`, `la version 1 devrait rester dans la liste, avec son accord et ses 40 invités : ${JSON.stringify(v1).slice(0, 300)}`, lieu);
      await page.locator('[data-rec-version="1"] [data-rec-apercu]').click(); await attendre(450);
      if (!/40 invités annoncés/.test(await texte('.esp-modale--doc .esp-doc')) || !/2\s?290\s?€/.test(await texte('.esp-modale--doc .esp-doc'))) R.echec(`${ou} : instantané`, 'après l\'accord sur la version 2, le document de la version 1 devrait être inchangé', lieu);
      await page.keyboard.press('Escape'); await attendre(300);
      /* Une révision refusée : une version 3 est présentée, puis retirée. La version 2, acceptée, redevient la référence ;
         la version retirée reste dans la liste ; une version acceptée, elle, ne se retire pas. */
      if (await page.locator('[data-rec-retirer-ouvrir]').count()) R.echec(`${ou} : retrait`, 'une version qui a reçu un accord ne devrait pas pouvoir être retirée', lieu);
      await page.locator('[data-rec-nouvelle-version]').click(); await attendre(500); await change('#pl-qte-0', '65'); await page.locator('[data-rec-presenter]').click(); await attendre(700);
      if ((await commerce()).cles !== 'acceptee attente' || !(await client.locator('[data-reception-accorder]').count())) R.echec(`${ou} : retrait`, `une version 3 présentée devrait attendre son accord, à côté de la version 2 acceptée : ${(await commerce()).cles}`, lieu);
      await page.locator('[data-rec-retirer-ouvrir]').click(); await attendre(300); await mesurerEcran(page, taille, 'dossier, retirer une version', false);
      await page.locator('[data-rec-retirer] button[type="submit"]').click(); await attendre(400);
      if ((await dossierS()).courante !== 3) R.echec(`${ou} : retrait`, 'sans raison, la version ne devrait pas être retirée', lieu);
      await page.locator('#rec-retrait').fill('Le client préfère en rester à 60 invités'); await page.locator('[data-rec-retirer] button[type="submit"]').click(); await attendre(700);
      k = await commerce(); dS = await dossierS(); const listeV = await page.evaluate(() => [...document.querySelectorAll('[data-rec-version]')].map((li) => `${li.dataset.recVersion}:${li.dataset.recVersionEtat}`).join(' '));
      if (k.cles !== 'acceptee' || !/Proposition acceptée : version 2/.test(k.texte) || dS.courante !== 2 || listeV !== '3:retiree 2:acceptee 1:ancienne' || JSON.stringify(dS.retenue) !== retAvant || dS.projet.invitesConfirmes !== 60) R.echec(`${ou} : retrait`, `après le retrait de la version 3, la version 2 acceptée devrait redevenir la référence, sans rien changer d'autre : ${JSON.stringify({ cles: k.cles, courante: dS.courante, listeV })}`, lieu);
      await attendre(500);
      if (await client.locator('[data-reception-accorder]').count() || await client.locator('[data-reception-proposition]').getAttribute('data-reception-proposition') !== '2') R.echec(`${ou} : retrait`, 'la page du client devrait revenir à la version 2 acceptée, sans accord à donner', lieuClient);
      await client.close();

      /* ===== Variante : une option qui expire (en recommençant, jusqu'à l'option) ===== */
      await ouvrirEtapes(); await changerDePage(page, () => page.locator('[data-scene-recommencer]').click()); await attendu('après « Recommencer »', 0);
      if ((await stock())['jh-demo:reception:espace-venues:v1']) R.echec(`${ou} : recommencer`, 'l\'accord et les demandes du client devraient être effacés avec le scénario', lieu);
      await page.locator('[data-rec-carte="sc5-demande"] .esp-rec-carte__creer button').click(); await attendre(500); await onglet('espaces'); await change('#rf-arrivee', '19:00'); await change('#rf-fin', '01:00');
      await page.locator('[data-rec-retenir="option"]').click(); await attendre(600); e = await etats(); if (e.retenue !== 'option') R.echec(`${ou} : expiration`, `l'option devrait être posée : ${JSON.stringify(e)}`, lieu);
      await ouvrirEtapes(); const sautsVus = await page.evaluate(() => [...document.querySelectorAll('[data-scene-saut]')].map((b) => `${b.textContent.trim()}|${b.getAttribute('aria-disabled') || ''}`));
      if (sautsVus.join(' ; ') !== 'Aller à l\'échéance de l\'option| ; Aller à la veille| ; Aller au jour J|') R.echec(`${ou} : horloge`, `les trois sauts dans le temps devraient être proposés : ${sautsVus.join(' ; ')}`, lieu);
      await page.locator('[data-scene-saut="echeance"]').click(); await attendre(600); s = await scene(); e = await etats();
      if (!/18 h/.test(s.heure) || e.retenue !== 'expiree' || e.etape !== 'a-qualifier' && e.etape !== 'qualifie') R.echec(`${ou} : expiration`, `à l'échéance (18 h), l'option devrait être expirée et le dossier inchangé par ailleurs : ${JSON.stringify({ heure: s.heure, e })}`, lieu);
      if (!/Option expirée/.test(await texte('[data-rec-suite]')) || !/a expiré/.test(await texte('[data-rec-retenue-phrase]'))) R.echec(`${ou} : expiration`, 'le dossier devrait dire que l\'option a expiré et rester suivi', lieu);
      dS = await dossierS(); if (!dS || dS.cloture || dS.retenue.etat !== 'option') R.echec(`${ou} : expiration`, 'l\'expiration ne doit ni supprimer ni classer le dossier (elle se déduit de l\'heure)', lieu);
      await page.goto(`${BASE}/reserver?date=${s2}&service=soir#formulaire`, { waitUntil: 'load' }); await attendrePret(page); await attendre(1500);
      if (/accueille une réception/.test(await texte('[data-resa-creneaux-aide]'))) R.echec(`${ou} : expiration`, 'une fois l\'option expirée, la page Réserver devrait rouvrir ce soir-là', { page: '/reserver', taille: taille.nom });
      await page.goto(BASE + P, { waitUntil: 'load' }); await attendrePret(page); await attendre(700);
      if (!/18 h/.test((await scene()).heure) || (await etats()).retenue !== 'expiree') R.echec(`${ou} : rechargement`, 'recharger ne doit ni reculer l\'heure ni prolonger l\'option', lieu);
      /* Reposer l'option : une nouvelle vérification, une nouvelle échéance. */
      await onglet('espaces'); await page.locator('[data-rec-retenir="option"]').click(); await attendre(600);
      if ((await etats()).retenue !== 'option' || (await dossierS()).retenue.echeance <= dS.retenue.echeance) R.echec(`${ou} : expiration`, `une nouvelle option devrait être posée, avec une échéance plus lointaine (« ${await toast()} »)`, lieu);
      /* Le jour J atteint sans confirmation : rien n'est confirmé ni coché à la place de l'équipe. */
      await ouvrirEtapes(); await page.locator('[data-scene-saut="jourj"]').click(); await attendre(600); e = await etats(); s = await scene();
      if (e.etape === 'confirmee' || e.retenue === 'ferme' || s.finie || !/Samedi/.test(s.heure)) R.echec(`${ou} : horloge`, `avancer au jour J ne doit rien confirmer : ${JSON.stringify({ e, heure: s.heure })}`, lieu);

      /* ===== Une réception qui dérange des réservations déjà prises : le replacement, proposé puis appliqué par un geste explicite =====
         Dans le scénario 1 (un vendredi soir de service, des tables prises), une petite réception au coin du feu : les
         réservations des tables 1 et 3 sont en conflit ; un replacement est proposé (aperçu), appliqué, et son bilan est dit. */
      await ouvrirEtapes(); await page.locator('[data-scene-etapes] [data-demo-lancer]').click(); await attendre(350); await changerDePage(page, () => page.locator('[data-demo-choisir="service"]').click());
      const vendredi = await page.evaluate(() => JSON.parse(localStorage.getItem('jh-demo:service:horloge:v1')).iso);
      await aller(page, 'demandes'); await page.locator('[data-filtre-demandes="reception"]').click(); await attendre(350);
      await page.locator('[data-rec-carte="demo-reception-3"] .esp-rec-carte__creer button').click(); await attendre(500); await change('#rec-annonces', '6');
      await onglet('espaces'); await change('#rf-jour', vendredi); await change('#rf-arrivee', '20:30'); await change('#rf-fin', '23:00'); await page.locator('[data-rec-form="espace"][value="coin-feu"]').check(); await attendre(350);
      const gene = await page.evaluate(() => ({ etat: document.querySelector('[data-rec-verif]')?.dataset.recVerif, conflits: [...document.querySelectorAll('[data-rec-conflit="resa"]')].map((li) => li.textContent.replace(/\s+/g, ' ')), repl: document.querySelector('[data-rec-repl]')?.innerText.replace(/\s+/g, ' ') || '' }));
      if (gene.etat !== 'conflit' || gene.conflits.length !== 2 || !gene.conflits.some((t) => /Table 1 : Aurélie et Marc/.test(t)) || !gene.conflits.some((t) => /Table 3 : Camille R\./.test(t)) || !/Un aperçu : rien n'est changé/.test(gene.repl)) R.echec(`${ou} : replacement`, `les deux réservations des tables 1 et 3 devraient être en conflit, avec un replacement proposé : ${JSON.stringify(gene).slice(0, 420)}`, lieu);
      const tablesAvant = await page.evaluate(() => JSON.stringify(JSON.parse(localStorage.getItem('jh-demo:service:espace:v1')).resa.tables));
      await mesurerEcran(page, taille, 'espaces, replacement proposé', false);
      if (await page.evaluate(() => JSON.stringify(JSON.parse(localStorage.getItem('jh-demo:service:espace:v1')).resa.tables)) !== tablesAvant) R.echec(`${ou} : replacement`, 'l\'aperçu du replacement a déplacé des réservations', lieu);
      await page.locator('[data-rec-replacer]').click(); await attendre(700);
      const apres = await page.evaluate(() => ({ bilan: document.querySelector('[data-rec-bilan]')?.innerText.replace(/\s+/g, ' ') || '', etat: document.querySelector('[data-rec-verif]:not([data-rec-bilan])')?.dataset.recVerif, tables: JSON.parse(localStorage.getItem('jh-demo:service:espace:v1')).resa.tables }));
      if (!/2 réservations déplacées\./.test(apres.bilan) || apres.etat !== 'libre' || ['1', '2', '3'].includes(String(apres.tables['sc1-couple'])) || ['1', '2', '3'].includes(String(apres.tables['sc1-camille']))) R.echec(`${ou} : replacement`, `après l'application : un bilan précis, les deux réservations ailleurs, le coin du feu libre : ${JSON.stringify(apres).slice(0, 380)}`, lieu);

      /* ===== Autour : les données habituelles, quitter ===== */
      const fin = await stock();
      for (const k of ['jh-espace:v1', 'jh-espace-resas:v1', 'jh-espace-demandes:v1', 'jh-espace-venues:v1']) if (fin[k] !== habituel[k]) R.echec(`${ou} : isolation`, `« ${k} » a changé pendant le scénario`, lieu);
      await ouvrirEtapes(); await changerDePage(page, () => page.locator('[data-scene-etapes] [data-scene-quitter]').click());
      if ((await scene()).scenario || await page.locator('[data-rec-dossier]').count()) R.echec(`${ou} : quitter`, 'après « Quitter la démonstration », ni scénario ni dossier fictif ne devraient rester à l\'écran', lieu);
      [...new Set(erreurs)].forEach((x) => R.echec('erreur de console ou ressource', x, lieu));
      R.ok(`espace : réceptions (${taille.nom})`);
    } catch (err) { R.echec(`${ou} : parcours interrompu`, String(err.message || err).replace(/\u001b\[[0-9;]*m/g, '').replace(/\s+/g, ' ').slice(0, 420), lieu);
    } finally { await ctx.close(); }
  }

  /* ---------- 1 quaterdecies. Le restaurant et les réceptions, vus de la page Réserver (v7.12.1) ----------
     Plusieurs dossiers retiennent chacun une zone du restaurant. Hors saison de terrasse, les trois zones intérieures
     font tout ce qui est utilisable : la page Réserver ne propose plus ce soir-là, même si aucun dossier ne retient
     « toute la salle ». Deux zones sur trois : le service reste proposé. En été, la salle entièrement retenue n'est
     plus proposée, la terrasse le reste ; salle et terrasse retenues : le service est privatisé.
     Les dossiers sont construits par les mêmes règles que l'espace, puis posés dans le stockage de démonstration. */
  for (const taille of (!SEUL || SEUL.includes('1-quaterdecies') ? ['390×844'] : []).map(T)) {
    const ou = `réserver et réceptions (${taille.nom})`, lieu = { page: '/reserver', taille: taille.nom };
    try {
      globalThis.document ||= { visibilityState: 'visible' };
      const racine = new URL('../', import.meta.url), lireD = (f) => JSON.parse(readFileSync(new URL(`donnees/${f}`, racine), 'utf8'));
      const { MUTATIONS_RECEPTIONS, dossierDepuisDemande, argsRetenue } = await import(new URL('assets/js/espace-receptions.js', racine).href), { normaliser } = await import(new URL('assets/js/espace-demandes.js', racine).href);
      const LIEUX = lireD('receptions.json'), SALLE = lireD('salle.json'), zones = [['a', 'coin-feu'], ['b', 'baies'], ['c', 'grande-table']];
      const etat = (jour, l, maintenant) => { const S = { _schema: 2, receptions: { dossiers: {} } };
        for (const [i, z] of l) { const d = dossierDepuisDemande(normaliser({ id: `zone-${i}`, genre: 'reception', cree: `${maintenant}:00`, occasion: 'Un anniversaire', date: jour, invites: '4', prenom: 'Zone', nom: i.toUpperCase(), telephone: `06 00 00 00 0${zones.findIndex((x) => x[0] === i) + 1}`, source: 'demo' }), { cree: maintenant, lieux: LIEUX });
          MUTATIONS_RECEPTIONS.recCreer(S, { dossier: d }); MUTATIONS_RECEPTIONS.recRetenir(S, argsRetenue({ lieux: LIEUX }, SALLE, S.receptions.dossiers[d.id], { type: 'ferme', jour, horaires: { arrivee: '19:00', fin: '01:00' }, espaces: [z], le: maintenant })); }
        return S; };
      const voir = async (S, jour, horloge) => { const { ctx, page, erreurs } = await contexte({ taille });
        try { await ctx.addInitScript((x) => { localStorage.setItem('jh-espace:v1', x); }, JSON.stringify(S)); await page.clock.setFixedTime(new Date(horloge));
          await page.goto(`${BASE}/reserver?date=${jour}&service=soir#formulaire`, { waitUntil: 'load' }); await attendrePret(page); await attendre(900);
          const r = await page.evaluate(() => ({ aide: document.querySelector('[data-resa-creneaux-aide]')?.textContent.replace(/\s+/g, ' ') || '', libres: document.querySelectorAll('input[name="heure"]:not(:disabled)').length,
            espaces: Object.fromEntries([...document.querySelectorAll('input[name="espace"]')].map((x) => [x.value, `${x.disabled ? 'retiré' : 'proposé'}${x.checked ? ', coché' : ''} · ${x.closest('label')?.querySelector('[data-note]')?.textContent || ''}`])) }));
          [...new Set(erreurs)].forEach((x) => R.echec('erreur de console ou ressource', x, lieu)); return r; } finally { await ctx.close(); } };
      const NOV = '2026-11-22T10:00:00+01:00', JUIN = '2027-06-20T10:00:00+02:00', DEC = '2026-12-12', JUIL = '2027-07-10';
      let r = await voir(etat(DEC, zones, '2026-11-22T10:00'), DEC, NOV);
      if (!/le restaurant accueille une réception/.test(r.aide) || r.libres !== 0) R.echec(`${ou} : zones réunies`, `trois dossiers retiennent les trois zones intérieures, terrasse hors saison : aucune disponibilité ne devrait être annoncée : ${JSON.stringify(r).slice(0, 300)}`, lieu);
      r = await voir(etat(DEC, zones.slice(0, 2), '2026-11-22T10:00'), DEC, NOV);
      if (r.libres < 1 || /accueille une réception/.test(r.aide) || !/^proposé/.test(r.espaces.salle || '')) R.echec(`${ou} : réception partielle`, `deux zones sur trois : le service devrait rester proposé en salle : ${JSON.stringify(r).slice(0, 300)}`, lieu);
      r = await voir(etat(JUIL, zones, '2027-06-20T10:00'), JUIL, JUIN);
      if (r.libres < 1 || !/^retiré · retenue pour une réception ce jour-là/.test(r.espaces.salle || '') || !/^proposé, coché/.test(r.espaces.terrasse || '')) R.echec(`${ou} : la saison`, `en juillet, salle entièrement retenue : la terrasse devrait rester proposée, la salle non : ${JSON.stringify(r).slice(0, 300)}`, lieu);
      r = await voir(etat(JUIL, [...zones, ['t', 'terrasse']], '2027-06-20T10:00'), JUIL, JUIN);
      if (!/le restaurant accueille une réception/.test(r.aide) || r.libres !== 0) R.echec(`${ou} : la saison`, `en juillet, salle et terrasse retenues : le service devrait être privatisé : ${JSON.stringify(r).slice(0, 300)}`, lieu);
      R.ok(`espace : réserver et réceptions (${taille.nom})`);
    } catch (err) { R.echec(`${ou} : parcours interrompu`, String(err.message || err).replace(/\u001b\[[0-9;]*m/g, '').replace(/\s+/g, ' ').slice(0, 420), lieu); }
  }

  /* ---------- 1 quindecies (v7.13.0). Les offres prennent vie : la sixième démonstration, de bout en bout ----------
     Une offre d'exemple publiée à 45 €, une proposition acceptée pour 40 personnes à 1 800 €. Le prix passe à 49 € en
     préparation : le site garde 45 € (même après rechargement), l'aperçu montre 49 € sous son repère, la publication ne
     publie que cette offre, la nouvelle proposition vaut 1 960 €, l'ancienne reste à 1 800 €. Autour : les cas d'erreur
     (prix, unité, période) près du champ, « épuisé » pour un seul service, une réservation qui garde le lien avec sa
     soirée, une date de soirée refusée sous une réservation, l'historique et la reprise en brouillon, l'archivage d'une
     offre utilisée, les données habituelles intactes. */
  for (const taille of (!SEUL || SEUL.includes('1-quindecies') ? ['1366×768', '390×844'] : []).map(T)) {
    const lieu = { page: P, taille: taille.nom }, ou = `offres (${taille.nom})`;
    const { ctx, page, erreurs } = await contexte({ taille });
    try {
      const texte = async (sel, pg = page) => (await pg.locator(sel).first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
      const toast = () => texte('[data-esp-toast-texte]');
      const faites = () => page.locator('[data-esp-scene] .esp-scene__etapes li.est-faite').count();
      const attendu = async (quoi, n) => { const f = await faites(); if (f !== n) R.echec(`${ou} : étapes`, `${quoi} : ${f} étape(s) faite(s) sur 6, attendu ${n} (« ${(await texte('[data-scene-essayer]')).slice(0, 110)} »)`, lieu); };
      const etat = () => page.evaluate(() => JSON.parse(localStorage.getItem('jh-demo:offre:espace:v1') || '{}'));
      const debordement = async (pg, quoi) => { const d = await pg.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth); if (d > 1) R.echec(`${ou} : débordement`, `${quoi} déborde de ${d} px`, lieu); };
      const site = async (chemin) => { const g = await ctx.newPage(), [avant, ancre] = chemin.split('#'); await g.goto(`${BASE}${avant}${avant.includes('?') ? '&' : '?'}demo=offre${ancre ? `#${ancre}` : ''}`, { waitUntil: 'load' }); await attendrePret(g); await attendre(500); return g; };
      const ongletOffres = async (id) => { await page.locator(`#onglet-carte-${id}`).click(); await attendre(400); };
      const prixSite = async (g) => texte('[data-offre-site="menu-groupe"] [data-offre-site-prix]', g);
      /* Les données habituelles, posées avant : elles ne doivent pas bouger. */
      await page.goto(BASE + '/la-carte', { waitUntil: 'load' }); await page.evaluate(() => localStorage.setItem('jh-espace:v1', JSON.stringify({ _schema: 2, annonce: { active: false, texte: 'Témoin des données habituelles' } })));
      const habituel = await page.evaluate(() => localStorage.getItem('jh-espace:v1'));
      await page.goto(`${BASE}${P}?demo=offre`, { waitUntil: 'load' }); await attendrePret(page);
      if (await page.locator('[data-esp-app]').isHidden()) await page.locator('[data-esp-connexion] button[type="submit"]').click();
      await page.locator('[data-esp-app]').waitFor({ state: 'visible', timeout: 5000 }); await attendre(700);
      /* 1. Retrouver l'offre publiée. */
      const depart = await texte('[data-offre="menu-groupe"]');
      if (!/Exemple/.test(depart) || !/Publiée/.test(depart) || !/45 € par personne/.test(depart)) R.echec(`${ou} : catalogue`, `l’offre de départ : « ${depart.slice(0, 160)} »`, lieu);
      await attendu('à l’ouverture', 1); await debordement(page, 'le catalogue');
      const types = await page.locator('[data-offres] [data-offre]').evaluateAll((l) => [...new Set(l.map((x) => x.dataset.offreType))].sort().join());
      if (types !== 'cadeau,emporter,formule,plat,prestation,soiree') R.echec(`${ou} : catalogue`, `le catalogue commun ne réunit pas tous les métiers (${types})`, lieu);
      /* 2. Préparer 49 € ; les cas d'erreur restent près du champ, la saisie est gardée. */
      await page.locator('[data-offre="menu-groupe"] [data-offre-editer]').click(); await attendre(400);
      for (const [champ, saisir, motif] of [['prix', async () => page.locator('#of-prix').fill('quarante-neuf'), /nombre positif/], ['unite', async () => { await page.locator('#of-prix').fill('49'); await page.locator('#of-unite').selectOption(''); }, /unité/], ['periode', async () => { await page.locator('#of-unite').selectOption('personne'); await page.locator('#of-du').fill('2026-12-20'); await page.locator('#of-au').fill('2026-12-01'); }, /avant de commencer/]]) {
        await saisir(); await page.locator('[data-form-offre] button[type="submit"]').click(); await attendre(350);
        const e = await texte(`[data-of-erreur="${champ}"]`), pris = (await etat()).offres?.modifs?.['menu-groupe']?.prix;
        if (!motif.test(e) || pris === 49 || !(await page.locator('[data-form-offre]').count())) R.echec(`${ou} : erreurs`, `${champ} invalide : message « ${e.slice(0, 90)} », prix enregistré ${pris}, formulaire ouvert ${await page.locator('[data-form-offre]').count()}`, lieu);
      }
      if ((await page.locator('#of-prix').inputValue()) !== '49') R.echec(`${ou} : erreurs`, 'après une erreur, la saisie du prix n’est pas gardée', lieu);
      await page.locator('#of-du').fill(''); await page.locator('#of-au').fill(''); await page.locator('[data-form-offre] button[type="submit"]').click(); await attendre(500);
      const prep = await texte('[data-offre="menu-groupe"]');
      if (!/Modification en préparation/.test(prep) || !/49 € par personne/.test(prep) || !/pas encore sur le site/.test(prep)) R.echec(`${ou} : préparation`, `après « Enregistrer en préparation » : « ${prep.slice(0, 200)} »`, lieu);
      await attendu('prix préparé', 2); await debordement(page, 'l’offre en préparation');
      /* 3. L'aperçu : 49 € sous son repère ; le site normal : 45 €, même après rechargement. */
      const [ap] = await Promise.all([ctx.waitForEvent('page'), page.locator('[data-pub="offre:menu-groupe"] [data-pub-apercu]').click()]); await ap.waitForLoadState('load'); await attendrePret(ap); await attendre(600);
      const vuA = { prix: await prixSite(ap), repere: await texte('[data-apercu-non-publie]', ap), exemple: await texte('[data-offres-site-mention]', ap), n: (await etat()).publie?.n || 0 };
      if (vuA.prix !== '49 €' || !/Aperçu — non publié/.test(vuA.repere) || !/Exemples de démonstration/.test(vuA.exemple) || vuA.n !== 0) R.echec(`${ou} : aperçu`, `l’aperçu : ${JSON.stringify(vuA)}`, { page: '/receptions?apercu=1', taille: taille.nom });
      await debordement(ap, 'l’aperçu de la page Réceptions');
      const cible = await ap.locator('[data-apercu-non-publie] a').evaluateAll((l) => l.map((a) => { const r = a.getBoundingClientRect(); return Math.round(r.height); }));
      if (cible.some((h) => h < 44)) R.echec(`${ou} : aperçu`, `les liens du repère font moins de 44 px de haut (${cible.join(', ')})`, { page: '/receptions?apercu=1', taille: taille.nom });
      await ap.locator('[data-apercu-quitter]').click(); await ap.waitForLoadState('load'); await attendrePret(ap); await attendre(600);
      const p45 = await prixSite(ap); await ap.reload({ waitUntil: 'load' }); await attendrePret(ap); await attendre(600);
      if (p45 !== '45 €' || (await prixSite(ap)) !== '45 €' || (await ap.locator('[data-apercu-non-publie]').count())) R.echec(`${ou} : site`, `avant la publication, le site normal affiche « ${p45} », puis « ${await prixSite(ap)} » après rechargement (attendu 45 €), repère d’aperçu ${await ap.locator('[data-apercu-non-publie]').count()}`, { page: '/receptions', taille: taille.nom });
      await page.bringToFront(); await page.reload({ waitUntil: 'load' }); await attendrePret(page); await attendre(700);
      if (!/49 € par personne/.test(await texte('[data-offre="menu-groupe"] [data-offre-prix]'))) R.echec(`${ou} : préparation`, 'après rechargement de l’espace, le prix en préparation n’est plus 49 €', lieu);
      await attendu('aperçu et site vus', 3);
      /* Un autre brouillon, pour vérifier que la publication ne l'emporte pas. */
      await page.locator('[data-offre="aperitif"] [data-offre-editer]').click(); await attendre(300); await page.locator('#of-prix').fill('14'); await page.locator('[data-form-offre] button[type="submit"]').click(); await attendre(500);
      /* 4. Publier cette offre, et elle seule. */
      await page.locator('[data-pub="offre:menu-groupe"] [data-pub-ouvrir]').click(); await attendre(350);
      const resume = await texte('[data-pub="offre:menu-groupe"] [data-pub-resume]');
      if (!/45 € → 49 €/.test(resume) || !/Apéritif et bouchées/.test(await texte('[data-pub-reste]')) || !/dans ce navigateur/.test(resume)) R.echec(`${ou} : publication`, `le résumé avant de publier : « ${resume.slice(0, 260)} »`, lieu);
      if ((await page.evaluate(() => document.activeElement?.id)) !== 'pub-titre') R.echec(`${ou} : clavier`, 'à l’ouverture du résumé, le focus n’est pas sur son titre', lieu);
      await debordement(page, 'le résumé de publication');
      /* Une sauvegarde refusée par le navigateur : pas de faux succès, l'erreur est dite près du bouton, rien n'est publié. */
      await page.evaluate(() => { window.__poser = Storage.prototype.setItem; Storage.prototype.setItem = function () { throw new Error('stockage plein'); }; });
      await page.locator('[data-pub-confirmer]').click(); await attendre(500);
      const refusee = { erreur: await texte('[data-pub-erreur]'), toast: await toast(), ouvert: await page.locator('[data-pub-resume]').count() };
      await page.evaluate(() => { Storage.prototype.setItem = window.__poser; });
      if (!/refusé d'enregistrer/.test(refusee.erreur) || /Publié/.test(refusee.toast) || !refusee.ouvert || (await etat()).publie?.n) R.echec(`${ou} : erreurs`, `sauvegarde refusée : message « ${refusee.erreur.slice(0, 120)} », toast « ${refusee.toast.slice(0, 80)} », résumé ouvert ${refusee.ouvert}, publication n° ${(await etat()).publie?.n || 0}`, lieu);
      await page.locator('[data-pub-confirmer]').click(); await attendre(600);
      const S4 = await etat(), pub = S4.publie?.offres?.modifs || {};
      if (pub['menu-groupe']?.prix !== 49 || pub.aperitif || S4.offres?.modifs?.aperitif?.prix !== 14 || S4.publie?.n !== 1) R.echec(`${ou} : publication`, `après publication : publié ${JSON.stringify(pub)}, en préparation ${JSON.stringify(S4.offres?.modifs)}, n° ${S4.publie?.n}`, lieu);
      if (!/Publié/.test(await toast()) || !/Publiée/.test(await texte('[data-offre="menu-groupe"] .esp-offre__etats')) || !/Modification en préparation/.test(await texte('[data-offre="aperitif"] .esp-offre__etats'))) R.echec(`${ou} : publication`, `à l’écran : « ${await toast()} », menu « ${await texte('[data-offre="menu-groupe"] .esp-offre__etats')} », apéritif « ${await texte('[data-offre="aperitif"] .esp-offre__etats')} »`, lieu);
      await ap.reload({ waitUntil: 'load' }); await attendrePret(ap); await attendre(600);
      if ((await prixSite(ap)) !== '49 €') R.echec(`${ou} : site`, `après la publication, le site affiche « ${await prixSite(ap)} » (attendu 49 €)`, { page: '/receptions', taille: taille.nom });
      await ap.close(); await attendu('offre publiée', 4);
      /* 5. La nouvelle proposition : 40 personnes à 49 €. */
      await aller(page, 'demandes'); await page.locator('[data-rec-ouvrir="rec-sc6-nouvelle"]').first().click(); await attendre(600);
      await page.locator('#rec-onglet-proposition').click(); await attendre(300); await page.locator('[data-rec-proposition-creer]').click(); await attendre(400);
      const choix = await page.locator('[data-rec-catalogue] option').evaluateAll((l) => l.map((x) => x.textContent.replace(/\s+/g, ' ')).join(' | '));
      if (!/Menu de groupe, trois plats · 49 € par personne/.test(choix) || !/Apéritif et bouchées · 12 € par personne/.test(choix)) R.echec(`${ou} : proposition`, `les offres proposées ne sont pas les versions publiées : ${choix.slice(0, 220)}`, lieu);
      await page.locator('[data-rec-catalogue]').selectOption('menu-groupe'); await page.locator('[data-rec-ligne-ajouter]').click(); await attendre(500);
      const total = await texte('[data-rec-total]');
      if (total !== '1 960 €' || !/Copié du catalogue/.test(await texte('[data-rec-origine]'))) R.echec(`${ou} : proposition`, `la nouvelle proposition : total « ${total} » (attendu 1 960 €), origine « ${await texte('[data-rec-origine]')} »`, lieu);
      await attendu('nouvelle proposition', 5); await debordement(page, 'la nouvelle proposition');
      /* 6. L'ancienne proposition, acceptée : toujours 1 800 €. */
      await page.locator('[data-rec-retour]').first().click(); await attendre(500); await page.locator('[data-rec-ouvrir="rec-sc6-ancienne"]').first().click(); await attendre(600);
      await page.locator('#rec-onglet-proposition').click(); await attendre(500);
      const ancienne = await texte('[data-rec-situation]');
      if (!/Proposition acceptée/.test(ancienne) || !/1 800 €/.test(ancienne)) R.echec(`${ou} : proposition`, `l’ancienne proposition : « ${ancienne.slice(0, 160)} »`, lieu);
      await attendu('ancienne proposition rouverte', 6);
      const fin = await texte('[data-esp-scene]');
      if (!/1 960 €/.test(fin) || !/1 800 €/.test(fin) || !/exemples/.test(fin)) R.echec(`${ou} : conclusion`, `la conclusion : « ${fin.slice(-260)} »`, lieu);
      /* Variante : épuisé pour un seul service (immédiat, sans publication), puis le service du soir. */
      await aller(page, 'carte:carte'); const cle = 'plats/poisson-selon-l-arrivage', nAvant = (await etat()).publie.n;
      await page.locator(`[data-epuise="${cle}"]`).click(); await attendre(500);
      const g1 = await site('/la-carte'), ep1 = await g1.locator('.carte-resto__plat.est-epuise').evaluateAll((l) => l.map((x) => x.innerText.replace(/\s+/g, ' ')).join(' || ')); await g1.close();
      const S7 = await etat();
      if (S7.carte?.epuises?.[cle] !== `${S7.carte?.epuises?.[cle]?.slice(0, 10)}/midi` || S7.publie.n !== nAvant || !/Poisson selon l'arrivage/.test(ep1) || !/Épuisé ce midi/.test(ep1)) R.echec(`${ou} : épuisé`, `« Épuisé ce midi » : enregistré ${JSON.stringify(S7.carte?.epuises)}, publication n° ${S7.publie.n} (attendu ${nAvant}), sur le site « ${ep1.slice(0, 90)} »`, lieu);
      const g2 = await site('/reserver'), jours = await g2.locator('[data-resa-form] [data-jour]:not(:disabled)').count(); await g2.close();
      if (!jours) R.echec(`${ou} : épuisé`, 'un plat épuisé a fermé la réservation de tables', { page: '/reserver', taille: taille.nom });
      if (!(await page.locator('[data-scene-etapes]').evaluate((d) => d.open))) await page.locator('[data-scene-etapes] > summary').click(); await attendre(200);
      await page.locator('[data-scene-saut="soir"]').click(); await attendre(700);
      const g3 = await site('/la-carte'), ep3 = await g3.locator('.carte-resto__plat.est-epuise').count(); await g3.close();
      if (ep3 || (await page.locator(`[data-plat="${cle}"].est-epuise`).count()) || !/Épuisé ce soir/.test(await texte(`[data-epuise="${cle}"]`))) R.echec(`${ou} : épuisé`, `au service du soir, le plat est encore épuisé (site ${ep3}, espace ${await page.locator(`[data-plat="${cle}"].est-epuise`).count()}), bouton « ${await texte(`[data-epuise="${cle}"]`)} »`, lieu);
      /* Variante : une réservation prise depuis une soirée garde son lien ; la date de la soirée ne change pas sous elle. */
      const g4 = await site('/les-fetes'), lien = await g4.locator('#date-sc6-soiree a.agd__reserver').getAttribute('href').catch(() => ''); await g4.close();
      if (!/soiree=sc6-soiree/.test(lien || '')) R.echec(`${ou} : soirée`, `le lien de réservation de la soirée ne porte pas son identifiant (« ${lien} »)`, { page: '/les-fetes', taille: taille.nom });
      const g5 = await site(lien || '/reserver'), rappel = await texte('[data-soiree]', g5);
      for (let k = 0; k < 4 && !(await g5.locator('[name="prenom"]').isVisible().catch(() => false)); k++) { const h = g5.locator('[data-resa-form] input[name="heure"]:not(:disabled)').first(); if (await h.isVisible().catch(() => false)) await h.check({ force: true }).catch(() => {}); await g5.locator('[data-etape-suivante]').click().catch(() => {}); await attendre(500); }
      await g5.fill('[name="prenom"]', 'Lina'); await g5.fill('[name="nom"]', 'Essai'); await g5.fill('[name="telephone"]', '06 00 00 00 00'); await g5.fill('[name="email"]', 'lina@exemple.fr');
      await g5.locator('[data-resa-form] button[type="submit"]').click(); await attendre(700); await g5.locator('[data-resa-confirmer]').click(); await attendre(1800);
      const resas = await g5.evaluate(() => JSON.parse(localStorage.getItem('jh-demo:offre:espace-resas:v1') || '[]')); await g5.close();
      if (!/Soirée truffe/.test(rappel) || resas.length !== 1 || resas[0].soiree?.id !== 'sc6-soiree' || !/Soirée truffe/.test(resas[0].soiree?.titre || '')) R.echec(`${ou} : soirée`, `la réservation depuis la soirée : rappel « ${rappel} », ${resas.length} réservation(s), lien ${JSON.stringify(resas[0]?.soiree || null)}`, { page: '/reserver', taille: taille.nom });
      await page.reload({ waitUntil: 'load' }); await attendrePret(page); await attendre(700); await aller(page, 'carte:soirees');
      if (!/1 réservation liée/.test(await texte('.esp-ev:has([data-editer="sc6-soiree"])'))) R.echec(`${ou} : soirée`, `la soirée ne compte pas sa réservation liée : « ${(await texte('.esp-ev:has([data-editer="sc6-soiree"])')).slice(0, 160)} »`, lieu);
      await page.locator('[data-editer="sc6-soiree"]').click(); await attendre(400);
      const d0 = await page.locator('#ev-date').inputValue(), d1 = new Date(Date.parse(`${d0}T12:00:00Z`) + 7 * 86400000).toISOString().slice(0, 10);
      await page.locator('#ev-date').fill(d1); await page.locator('#ev-titre').fill('Soirée truffe noire (exemple)'); await page.locator('[data-editeur] button[type="submit"]').click(); await attendre(500);
      const refus = await texte('[data-ev-erreur]'), S8 = await etat();
      if (!/ne les déplacerait pas/.test(refus) || !/aucun message ne partirait/.test(refus) || (await page.locator('#ev-titre').inputValue()) !== 'Soirée truffe noire (exemple)' || S8.evenements.ajouts[0].debut.slice(0, 10) !== d0) R.echec(`${ou} : soirée`, `changer la date d’une soirée réservée : message « ${refus.slice(0, 140)} », titre saisi « ${await page.locator('#ev-titre').inputValue()} », date enregistrée ${S8.evenements.ajouts[0].debut}`, lieu);
      await debordement(page, 'l’éditeur de soirée et son refus');
      await page.locator('#ev-date').fill(d0); await page.locator('[data-editeur] button[type="submit"]').click(); await attendre(600);
      if ((await etat()).evenements.ajouts.length !== 1) R.echec(`${ou} : soirée`, 'modifier le titre a créé une deuxième soirée', lieu);
      const g6 = await site('/les-fetes'), titreSite = await texte('#date-sc6-soiree .agd__titre', g6); await g6.close();
      if (titreSite !== 'Soirée truffe (exemple)') R.echec(`${ou} : soirée`, `le nouveau titre est sur le site avant la publication (« ${titreSite} »)`, { page: '/les-fetes', taille: taille.nom });
      await page.locator('[data-pub="soiree:sc6-soiree"] [data-pub-ouvrir]').click(); await attendre(300); await page.locator('[data-pub-confirmer]').click(); await attendre(600);
      const g7 = await site('/les-fetes'), titreApres = await texte('#date-sc6-soiree .agd__titre', g7); await g7.close();
      const liee = await page.evaluate(() => JSON.parse(localStorage.getItem('jh-demo:offre:espace-resas:v1') || '[]')[0]);
      if (titreApres !== 'Soirée truffe noire (exemple)' || liee?.date !== d0 || liee?.soiree?.titre !== 'Soirée truffe (exemple)') R.echec(`${ou} : soirée`, `après « Publier cette soirée » : titre du site « ${titreApres} », réservation ${JSON.stringify({ date: liee?.date, soiree: liee?.soiree })}`, lieu);
      /* Variante : l'historique, et une ancienne version reprise en brouillon sans toucher au reste. */
      await aller(page, 'site:publication'); await debordement(page, 'l’onglet Publication');
      const histo = await page.locator('[data-histo-n]').count(), attentes = await page.locator('[data-attente-pub]').evaluateAll((l) => l.map((x) => x.dataset.attentePub).join());
      if (histo !== 2 || attentes !== 'offre:aperitif') R.echec(`${ou} : historique`, `${histo} publication(s) dans l’historique (attendu 2), en attente « ${attentes} » (attendu offre:aperitif)`, lieu);
      const temoin = async () => { const S = await etat(); return JSON.stringify([S.receptions, S.carte?.epuises, S.resa || null, await page.evaluate(() => localStorage.getItem('jh-demo:offre:espace-resas:v1'))]); }, avantReprise = await temoin();
      await page.locator('[data-histo-n="1"] [data-histo-voir][data-histo-cote="avant"]').click(); await attendre(400);
      const retablit = await texte('[data-histo-detail]');
      if (!/49 € → 45 €/.test(retablit) || !/en brouillon/.test(retablit)) R.echec(`${ou} : historique`, `« Voir ce que rétablirait le contenu d’avant » : « ${retablit.slice(0, 200)} »`, lieu);
      await page.locator('[data-histo-reprendre]').click(); await attendre(600);
      const S9 = await etat();
      if (S9.publie.offres.modifs['menu-groupe'].prix !== 49 || S9.offres.modifs['menu-groupe']?.prix !== undefined || (await temoin()) !== avantReprise || !(await page.locator('[data-attente-pub="offre:menu-groupe"]').count())) R.echec(`${ou} : historique`, `après « Reprendre en brouillon » : publié ${S9.publie.offres.modifs['menu-groupe'].prix} €, brouillon ${JSON.stringify(S9.offres.modifs['menu-groupe'] || null)}, le reste intact ${(await temoin()) === avantReprise}, en attente ${await page.locator('[data-attente-pub="offre:menu-groupe"]').count()}`, lieu);
      const g8 = await site('/receptions'), encore = await prixSite(g8); await g8.close();
      if (encore !== '49 €') R.echec(`${ou} : historique`, `une version reprise en brouillon a changé le site (« ${encore} »)`, { page: '/receptions', taille: taille.nom });
      /* Une publication faite ailleurs pendant que le résumé est ouvert (un autre onglet) : refusée, expliquée, rien n'est publié. */
      await page.locator('[data-pub="offre:menu-groupe"] [data-pub-ouvrir]').click(); await attendre(350);
      const g10 = await site('/la-carte'); await g10.evaluate(() => { const k = 'jh-demo:offre:espace:v1', d = JSON.parse(localStorage.getItem(k)); d.publie.n += 1; localStorage.setItem(k, JSON.stringify(d)); }); await g10.close(); await attendre(500);
      await page.locator('[data-pub-confirmer]').click(); await attendre(500);
      const conflit = await texte('[data-pub-erreur]'), S9b = await etat();
      if (!/publié ailleurs/.test(conflit) || !/Rien n'a été publié/.test(conflit) || S9b.publie.offres.modifs['menu-groupe'].prix !== 49) R.echec(`${ou} : erreurs`, `publication concurrente : message « ${conflit.slice(0, 140)} », prix publié ${S9b.publie.offres.modifs['menu-groupe'].prix}`, lieu);
      await page.locator('[data-pub-annuler]').click(); await attendre(300);
      await page.locator('[data-pub="offre:menu-groupe"] [data-pub-abandonner]').click(); await attendre(500);
      /* L'archivage d'une offre utilisée : ses usages sont montrés, rien n'est annulé. */
      await aller(page, 'carte:catalogue'); await page.locator('[data-offre="menu-groupe"] [data-offre-archiver]').click(); await attendre(400);
      const usages = await texte('[data-offre-archive-panneau]');
      if (!/Reprise dans 2 propositions/.test(usages) || !/Affichée sur le site/.test(usages) || !/Aucune réservation, aucun dossier, aucun accord/.test(usages)) R.echec(`${ou} : archivage`, `les usages avant d’archiver : « ${usages.slice(0, 260)} »`, lieu);
      await debordement(page, 'le panneau d’archivage');
      const dossiersAvant = JSON.stringify((await etat()).receptions); await page.locator('[data-offre-archiver-oui]').click(); await attendre(500);
      const S10 = await etat(), g9 = await site('/receptions'), bloc = await g9.locator('[data-offres-site]:not([hidden])').count(); await g9.close();
      if (!S10.offres.archives?.['menu-groupe'] || JSON.stringify(S10.receptions) !== dossiersAvant || bloc || !/Archivée/.test(await texte('[data-offre="menu-groupe"] .esp-offre__etats'))) R.echec(`${ou} : archivage`, `après « Archiver cette offre » : archives ${JSON.stringify(S10.offres.archives || null)}, dossiers intacts ${JSON.stringify(S10.receptions) === dossiersAvant}, bloc du site ${bloc}`, lieu);
      /* ===== v7.13.1 · Des accords cohérents, une publication maîtrisée ===== */
      /* A. Le dossier accepté d'Élise M. : avancement, prochaine action et boutons disent la même chose. */
      const dossierVu = async () => ({ etape: await page.locator('[data-rec-etape]').first().getAttribute('data-rec-etape'), texte: await texte('[data-rec-dossier]'), noter: await page.locator('[data-rec-accord-equipe]').count(), retirer: await page.locator('[data-rec-retirer-ouvrir]').count() });
      await aller(page, 'demandes'); await page.locator('[data-rec-ouvrir="rec-sc6-ancienne"]').first().click(); await attendre(600); await page.locator('#rec-onglet-proposition').click(); await attendre(400);
      const elise = await dossierVu();
      if (elise.etape !== 'accord' || !/Proposition acceptée : version 1/.test(elise.texte) || !/Prochaine action : Confirmer la réception/.test(elise.texte) || /Attendre l'accord/.test(elise.texte) || elise.noter || elise.retirer) R.echec(`${ou} : accord`, `le dossier accepté n’est pas cohérent : étape « ${elise.etape} », noter ${elise.noter}, retirer ${elise.retirer}, « ${elise.texte.slice(0, 220)} »`, lieu);
      /* Un accord noté par l'équipe sur le dossier de Bruno K. : présenté, puis accepté, puis rechargé. */
      await page.locator('[data-rec-retour]').first().click(); await attendre(400); await page.locator('[data-rec-ouvrir="rec-sc6-nouvelle"]').first().click(); await attendre(600); await page.locator('#rec-onglet-proposition').click(); await attendre(400);
      await page.locator('[data-rec-presenter]').click(); await attendre(600); const presente = await dossierVu();
      if (presente.etape !== 'presentee' || presente.noter !== 1 || presente.retirer !== 1) R.echec(`${ou} : accord`, `version présentée : étape « ${presente.etape} », boutons noter ${presente.noter}, retirer ${presente.retirer} (attendu 1 et 1)`, lieu);
      await page.locator('[data-rec-accord-equipe]').click(); await attendre(600); const accepte = await dossierVu();
      await page.reload({ waitUntil: 'load' }); await attendrePret(page); await attendre(700); await aller(page, 'demandes'); await page.locator('[data-rec-ouvrir="rec-sc6-nouvelle"]').first().click(); await attendre(600); await page.locator('#rec-onglet-proposition').click(); await attendre(400);
      const relu = await dossierVu();
      for (const [quand, x] of [['après l’accord noté', accepte], ['après rechargement', relu]]) if (x.etape !== 'accord' || !/Proposition acceptée : version 1/.test(x.texte) || !/Confirmer la réception/.test(x.texte) || x.noter || x.retirer) R.echec(`${ou} : accord`, `${quand} : étape « ${x.etape} », noter ${x.noter}, retirer ${x.retirer}, « ${x.texte.slice(0, 200)} »`, lieu);
      await debordement(page, 'le dossier accepté'); await page.locator('[data-rec-retour]').first().click(); await attendre(400);
      /* B. Un déplacement de soirée préparé avant l'arrivée de la réservation : refusé au moment de publier. */
      const avantB = await etat(), d2 = new Date(Date.parse(`${d0}T12:00:00Z`) + 14 * 86400000).toISOString().slice(0, 10);
      await page.evaluate((d) => { const k = 'jh-demo:offre:espace:v1', S = JSON.parse(localStorage.getItem(k)); S.evenements.ajouts.find((x) => x.id === 'sc6-soiree').debut = d; localStorage.setItem(k, JSON.stringify(S)); }, d2);
      await page.reload({ waitUntil: 'load' }); await attendrePret(page); await attendre(700); await aller(page, 'carte:soirees');
      await page.locator('[data-pub="soiree:sc6-soiree"] [data-pub-ouvrir]').click(); await attendre(350); await page.locator('[data-pub-confirmer]').click(); await attendre(600);
      const refusB = await texte('[data-pub-erreur]'), apresB = await etat(), g11 = await site('/les-fetes'), dateSite = await g11.locator('#date-sc6-soiree').getAttribute('data-debut'); await g11.close();
      if (!/a reçu 1 réservation/.test(refusB) || !/Sa date ne peut plus être modifiée/.test(refusB) || !/brouillon est conservé/.test(refusB) || apresB.publie.n !== avantB.publie.n || apresB.evenements.ajouts[0].debut.slice(0, 10) !== d2 || (dateSite || '').slice(0, 10) !== d0 || (await page.evaluate(() => JSON.parse(localStorage.getItem('jh-demo:offre:espace-resas:v1') || '[]')[0]?.date)) !== d0)
        R.echec(`${ou} : soirée`, `publier un déplacement sous une réservation : message « ${refusB.slice(0, 160)} », publication n° ${apresB.publie.n} (attendu ${avantB.publie.n}), brouillon ${apresB.evenements.ajouts[0].debut}, site ${dateSite}`, lieu);
      await page.locator('[data-pub-annuler]').click(); await attendre(300); await page.locator('[data-pub="soiree:sc6-soiree"] [data-pub-abandonner]').click(); await attendre(500);
      if ((await etat()).evenements.ajouts[0].debut.slice(0, 10) !== d0) R.echec(`${ou} : soirée`, 'abandonner le déplacement ne ramène pas la soirée à sa date publiée', lieu);
      /* C. Site : l'annonce, un texte et une photo se préparent, se voient dans l'aperçu, se publient un par un. */
      const accueil = async (chemin) => { const g = await site(chemin), x = { annonce: await g.locator('.annonce-site__texte').count() ? await texte('.annonce-site__texte', g) : '', titre: await texte('[data-edit="accueil.chef.titre"]', g), photo: await g.locator('[data-edit-photo="accueil-chef"] img').getAttribute('src').catch(() => ''), repere: await texte('[data-apercu-non-publie]', g) }; await debordement(g, `la page ${chemin}`); await g.close(); return x; };
      const siteAvant = await accueil('/');
      await aller(page, 'site:horaires'); await page.locator('#an-texte').fill('Fermeture annuelle du 4 au 18 janvier.'); await attendre(1300); await page.locator('[data-annonce-active]').click(); await attendre(500);
      await aller(page, 'site:textes'); await page.locator('[data-form-textes] [name="accueil.chef.titre"]').fill('Un titre préparé pour l’essai'); await attendre(1300);
      const autre = await page.evaluate(() => [...document.querySelectorAll('[data-form-textes] [name]')].map((x) => x.name).find((n) => !n.startsWith('accueil.')));
      if (autre) { await page.locator(`[data-form-textes] [name="${autre}"]`).fill('Un autre texte, sur une autre page'); await attendre(1300); }
      await aller(page, 'site:photos'); await page.locator('[data-choisir-photo="accueil-chef"]').click(); await attendre(500); await page.locator('.esp-phototheque [data-photo]').nth(3).click(); await attendre(700);
      const zones = { photo: await texte('[data-pub-zone="photo:accueil-chef"]') }; await aller(page, 'site:textes'); zones.textes = await texte('[data-pub-zone="textes"]'); await aller(page, 'site:horaires'); zones.annonce = await texte('[data-pub-zone="annonce"]');
      if (!/En préparation/.test(zones.annonce) || !/Publier l'annonce/.test(zones.annonce) || !/Publier les textes de la page Accueil/.test(zones.textes) || !/Publier cette photo/.test(zones.photo)) R.echec(`${ou} : site`, `les préparations ne sont pas dites à côté des éditeurs : ${JSON.stringify(zones).slice(0, 300)}`, lieu);
      await debordement(page, 'Site, annonce en préparation');
      const normal = await accueil('/'), apercu = await accueil('/?apercu=1'), autrePage = await site('/la-carte'), annonceAilleurs = await autrePage.locator('.annonce-site').count(); await autrePage.close();
      if (normal.annonce || normal.titre !== siteAvant.titre || normal.photo !== siteAvant.photo || normal.repere || annonceAilleurs) R.echec(`${ou} : site`, `le site normal montre une préparation : ${JSON.stringify(normal).slice(0, 240)}, annonce sur une autre page ${annonceAilleurs}`, { page: '/', taille: taille.nom });
      if (!/Fermeture annuelle/.test(apercu.annonce) || !/Un titre préparé/.test(apercu.titre) || apercu.photo === siteAvant.photo || !/Aperçu — non publié/.test(apercu.repere) || !/l'annonce/.test(apercu.repere) || !/les textes/.test(apercu.repere) || !/les photos/.test(apercu.repere)) R.echec(`${ou} : site`, `l’aperçu ne montre pas les préparations ou ne dit pas son périmètre : ${JSON.stringify(apercu).slice(0, 320)}`, { page: '/?apercu=1', taille: taille.nom });
      /* Publier l'annonce : elle seule. */
      await page.locator('[data-pub-zone="annonce"] [data-pub-ouvrir]').click(); await attendre(350); const resumeAnnonce = await texte('[data-pub-resume]');
      if (!/Toutes les pages du site/.test(resumeAnnonce) || !/Fermeture annuelle/.test(resumeAnnonce) || !/Reste en préparation/.test(resumeAnnonce)) R.echec(`${ou} : site`, `le résumé avant de publier l’annonce : « ${resumeAnnonce.slice(0, 260)} »`, lieu);
      await page.locator('[data-pub-confirmer]').click(); await attendre(600); const apresAnnonce = await accueil('/');
      if (!/Fermeture annuelle/.test(apresAnnonce.annonce) || apresAnnonce.titre !== siteAvant.titre || apresAnnonce.photo !== siteAvant.photo) R.echec(`${ou} : site`, `après « Publier l’annonce » : ${JSON.stringify(apresAnnonce).slice(0, 240)} (le texte et la photo ne devaient pas suivre)`, { page: '/', taille: taille.nom });
      await aller(page, 'site:textes'); await page.locator('[data-pub="textes:accueil"] [data-pub-ouvrir]').click(); await attendre(350); await page.locator('[data-pub-confirmer]').click(); await attendre(600);
      await aller(page, 'site:photos'); await page.locator('[data-pub-zone="photo:accueil-chef"] [data-pub-ouvrir]').click(); await attendre(350); await page.locator('[data-pub-confirmer]').click(); await attendre(600);
      const publie = await accueil('/'), Sc = await etat();
      if (!/Un titre préparé/.test(publie.titre) || publie.photo === siteAvant.photo || (autre && Sc.publie.textes?.[autre]) || (autre && !Sc.textes?.[autre])) R.echec(`${ou} : site`, `après la publication du texte et de la photo : ${JSON.stringify(publie).slice(0, 200)} ; l’autre page publiée à tort : ${!!(autre && Sc.publie.textes?.[autre])}`, { page: '/', taille: taille.nom });
      /* Reprendre l'annonce d'avant : en préparation seulement ; rien d'opérationnel ne bouge. */
      await aller(page, 'site:publication'); const temoinC = JSON.stringify([Sc.receptions, Sc.carte?.epuises, Sc.resa || null, Sc.horaires || null]);
      const nAnnonce = await page.locator('[data-histo-n]').evaluateAll((l) => l.find((x) => /L'annonce/.test(x.querySelector('.esp-histo__tete').textContent))?.dataset.histoN);
      await page.locator(`[data-histo-n="${nAnnonce}"] [data-histo-voir][data-histo-cote="avant"]`).click(); await attendre(400); await page.locator('[data-histo-reprendre]').click(); await attendre(600);
      const Sd = await etat(), apresReprise = await accueil('/');
      if (!/Fermeture annuelle/.test(apresReprise.annonce) || Sd.annonce?.active || JSON.stringify([Sd.receptions, Sd.carte?.epuises, Sd.resa || null, Sd.horaires || null]) !== temoinC || !(await page.locator('[data-attente-pub="annonce:"]').count())) R.echec(`${ou} : site`, `reprendre l’annonce d’avant : site « ${apresReprise.annonce} », brouillon ${JSON.stringify(Sd.annonce || null)}, le reste intact ${JSON.stringify([Sd.receptions, Sd.carte?.epuises, Sd.resa || null, Sd.horaires || null]) === temoinC}`, lieu);
      await debordement(page, 'l’onglet Publication, contenus du Site');
      /* D. Les cartes cadeaux : dans le catalogue, puis sur la page Offrir. */
      const offrir = async (chemin) => { const g = await site(chemin), x = { puces: await g.locator('.ccq__puce').evaluateAll((l) => l.map((y) => y.innerText.replace(/\s+/g, ' ').trim()).join(' | ')), coche: await g.locator('.ccq__puce input:checked').getAttribute('value').catch(() => '') }; await debordement(g, `la page ${chemin}`); return { g, ...x }; };
      await aller(page, 'carte:catalogue'); await page.locator('[data-offre-filtre="cadeau"]').click(); await attendre(400);
      const cadeaux = await page.locator('[data-offre][data-offre-type="cadeau"]').evaluateAll((l) => l.map((x) => x.dataset.offre).join());
      if (cadeaux !== 'cadeau-25,cadeau-50,cadeau-100,cadeau-150,cadeau-200' || !/sert pour : la page Offrir/.test(await texte('[data-offre="cadeau-50"]'))) R.echec(`${ou} : cadeaux`, `les cartes cadeaux du catalogue : ${cadeaux} ; « ${(await texte('[data-offre="cadeau-50"]')).slice(0, 120)} »`, lieu);
      await page.locator('[data-offre="cadeau-25"] [data-offre-editer]').click(); await attendre(400); await page.locator('[data-form-offre] [name="site"]').uncheck(); await page.locator('[data-form-offre] button[type="submit"]').click(); await attendre(500);
      const o1 = await offrir('/offrir#composer'); await o1.g.close(); const o2 = await offrir('/offrir?apercu=1#composer'); await o2.g.close();
      if (o1.puces !== '25 € | 50 € | 100 € | 150 € | 200 €' || o2.puces !== '50 € | 100 € | 150 € | 200 €') R.echec(`${ou} : cadeaux`, `avant la publication : page Offrir « ${o1.puces} », aperçu « ${o2.puces} »`, { page: '/offrir', taille: taille.nom });
      await page.locator('[data-pub="offre:cadeau-25"] [data-pub-ouvrir]').click(); await attendre(350); const resumeCadeau = await texte('[data-pub-resume]'); await page.locator('[data-pub-confirmer]').click(); await attendre(600);
      const o3 = await offrir('/offrir#composer'); await o3.g.locator('.ccq__puce:has(input[value="100"])').click(); await attendre(500); const totalV1 = await texte('[data-ccq-total]', o3.g); await o3.g.close();
      if (!/Page Offrir/.test(resumeCadeau) || !/masquée sur la page Offrir/.test(resumeCadeau) || o3.puces !== '50 € | 100 € | 150 € | 200 €' || o3.coche !== '50' || !/100/.test(totalV1)) R.echec(`${ou} : cadeaux`, `après publication : résumé « ${resumeCadeau.slice(0, 160)} », page Offrir « ${o3.puces} », coché ${o3.coche}, totalV1 « ${totalV1} »`, { page: '/offrir', taille: taille.nom });
      /* Les données habituelles n'ont pas bougé. */
      if ((await page.evaluate(() => localStorage.getItem('jh-espace:v1'))) !== habituel) R.echec(`${ou} : isolation`, 'la démonstration a modifié les données habituelles', lieu);
      [...new Set(erreurs)].forEach((x) => R.echec('erreur de console ou ressource', x, lieu));
      R.ok(`espace : ${ou}`);
    } finally { await ctx.close(); }
  }

  /* ---------- 1-sexdecies. v7.14.0 : du catalogue à la remise au client (ordinateur et largeur de téléphone) ----------
     Lot 0 (annonce et aperçu sans recouvrement, carte cadeau à 250 €), puis les démonstrations 7 et 8 suivies comme un
     utilisateur, avec leurs variantes : dernière capacité demandée deux fois (deux onglets), annulation, changement de
     prix après la commande, créneau complet vu du site, double clic, dépassement refusé, correction tracée. */
  for (const taille of (!SEUL || SEUL.includes('1-sexdecies') ? ['1366×768', '390×844'] : []).map(T)) {
    const lieu = { page: P, taille: taille.nom }, ou = `commerce (${taille.nom})`;
    const { ctx, page, erreurs } = await contexte({ taille });
    try {
      const texte = async (sel, pg = page) => (await pg.locator(sel).first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
      const toast = () => texte('[data-esp-toast-texte]'), refus = (pg = page) => texte('[data-com-erreur]', pg);
      const faites = (pg = page) => pg.locator('[data-esp-scene] .esp-scene__etapes li.est-faite').count();
      const debordement = async (pg, quoi) => { const d = await pg.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth); if (d > 1) R.echec(`${ou} : débordement`, `${quoi} déborde de ${d} px`, lieu); };
      const faux = (titre, cond, detail) => { if (!cond) R.echec(`${ou} : ${titre}`, String(detail).slice(0, 420), lieu); };
      let demo = 'offre';
      const etat = () => page.evaluate((d) => JSON.parse(localStorage.getItem(`jh-demo:${d}:espace:v1`) || '{}'), demo);
      const demandes = () => page.evaluate((d) => JSON.parse(localStorage.getItem(`jh-demo:${d}:espace-demandes:v1`) || '[]'), demo);
      const site = async (chemin, pause = 600) => { const g = await ctx.newPage(), [avant, ancre] = chemin.split('#'); await g.goto(`${BASE}${avant}${avant.includes('?') ? '&' : '?'}demo=${demo}${ancre ? `#${ancre}` : ''}`, { waitUntil: 'load' }); await attendrePret(g); await attendre(pause); return g; };
      const ouvrirDemo = async (id, pg = page) => { demo = id; await pg.goto(`${BASE}${P}?demo=${id}`, { waitUntil: 'load' }); await attendrePret(pg); if (await pg.locator('[data-esp-app]').isHidden()) await pg.locator('[data-esp-connexion] button[type="submit"]').click(); await pg.locator('[data-esp-app]').waitFor({ state: 'visible', timeout: 5000 }); await attendre(700); };
      await page.goto(BASE + '/la-carte', { waitUntil: 'load' }); await page.evaluate(() => localStorage.setItem('jh-espace:v1', JSON.stringify({ _schema: 2, annonce: { active: false, texte: 'Témoin des données habituelles' } })));
      const habituel = await page.evaluate(() => localStorage.getItem('jh-espace:v1'));

      /* ===== Lot 0 · A. L'annonce et le repère d'aperçu ont leur place : rien n'est recouvert, après l'animation d'ouverture. ===== */
      await ouvrirDemo('offre'); await aller(page, 'site:horaires');
      await page.locator('#an-texte').fill('Fermeture annuelle du 4 au 18 janvier : toute l\'équipe vous retrouve le mardi 19 janvier au déjeuner, avec la nouvelle carte d\'hiver du chef.'); await attendre(1300); await page.locator('[data-annonce-active]').click(); await attendre(500);
      const ac = await site('/?apercu=1'); await ac.waitForFunction(() => document.documentElement.classList.contains('intro-finie') || !document.documentElement.matches('[data-arrivee="intro"]'), null, { timeout: 15000 }).catch(() => {}); await attendre(900);
      const pose = await ac.evaluate(() => { const r = (sel) => { const x = document.querySelector(sel)?.getBoundingClientRect(); return x ? { haut: Math.round(x.top), bas: Math.round(x.bottom), l: Math.round(x.width) } : null; }; const bande = r('[data-bandeaux]');
        const sous = [...document.querySelectorAll('main :is(h1, h2, p, a, button)')].filter((el) => { const x = el.getBoundingClientRect(), cs = getComputedStyle(el); return x.width > 4 && x.height > 4 && cs.visibility !== 'hidden' && +cs.opacity > 0.05 && x.top < bande.bas - 1 && x.bottom > bande.haut + 1 && (el.textContent || '').trim(); }).map((el) => (el.textContent || '').trim().slice(0, 30));
        return { bande, entete: r('[data-entete]'), h1: r('main h1'), sous, repere: document.querySelector('[data-apercu-non-publie]')?.textContent.replace(/\s+/g, ' ').trim() || '', liens: [...document.querySelectorAll('[data-apercu-non-publie] a')].map((a) => [a.textContent.trim(), Math.round(a.getBoundingClientRect().height)]), annonce: document.querySelector('.annonce-site__texte')?.textContent || '', rappel: document.querySelector('.apercu-pile')?.classList.contains('est-visible') }; });
      faux('aperçu', pose.bande && !pose.sous.length && pose.bande.haut >= pose.entete.bas - 1 && pose.h1.haut >= pose.bande.bas, `la bande d'aperçu recouvre du contenu : ${JSON.stringify(pose)}`);
      faux('aperçu', /Aperçu — non publié/.test(pose.repere) && /l'annonce/.test(pose.repere) && pose.liens.length === 2 && pose.liens.every(([t, h]) => h >= 44) && /Voir la version publiée/.test(pose.liens[0][0]) && /Revenir à l'espace/.test(pose.liens[1][0]) && /mardi 19 janvier/.test(pose.annonce) && !pose.rappel, `repère, liens ou annonce : ${JSON.stringify(pose)}`);
      await debordement(ac, 'l’accueil en aperçu'); await ac.evaluate(() => scrollTo(0, 1400)); await attendre(900);
      faux('aperçu', await ac.evaluate(() => document.querySelector('.apercu-pile')?.classList.contains('est-visible') && /Aperçu — non publié/.test(document.querySelector('[data-apercu-rappel]')?.textContent || '')), 'une fois la bande sortie de l’écran, le rappel « Aperçu — non publié » devrait rester visible');
      await ac.locator('.annonce-site__fermer').evaluate((b) => b.click()); await attendre(400); faux('aperçu', !(await ac.locator('.annonce-site').count()) && (await ac.locator('[data-apercu-non-publie]').count()) === 1, 'fermer l’annonce ne doit pas retirer le repère d’aperçu'); await ac.close();
      const an = await site('/'); faux('aperçu', !(await an.locator('.annonce-site, [data-apercu-non-publie]').count()), 'sans publication, le site normal ne montre ni l’annonce préparée ni le repère'); await an.close();

      /* ===== Lot 0 · B et C. Une carte cadeau publiée à 250 € va jusqu'à la demande reçue ; un montant hors catalogue est refusé. ===== */
      await aller(page, 'carte:catalogue');
      await page.locator('[data-offre="cadeau-200"] [data-offre-editer]').click(); await attendre(350); await page.locator('#of-prix').fill('250'); await page.locator('[data-form-offre] button[type="submit"]').click(); await attendre(600);
      await page.locator('[data-offre="cadeau-200"] [data-pub-ouvrir]').first().click(); await attendre(350); await page.locator('[data-pub-confirmer]').first().click(); await attendre(700);
      const of = await site('/offrir#composer', 1800), puces = (await of.locator('.ccq__puce').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').trim()).join('|');
      await of.locator('.ccq__puce[data-cadeau="cadeau-200"]').click(); await of.locator('#ccq-qte').fill('2'); await of.locator('#ccq-pour').fill('Léa'); await of.locator('#ccq-de').fill('Hugo'); await of.locator('#ccq-ach-nom').fill('Hugo Simon (exemple)'); await of.locator('#ccq-ach-tel').fill('06 00 00 00 02'); await attendre(300);
      await debordement(of, 'la page Offrir'); await of.locator('.ccq__offrir').click(); await attendre(4500);
      const env = { erreur: await texte('[data-ccq-erreur="montant"]', of), statut: await texte('[data-ccq-statut]', of) }, dc = (await demandes()).filter((d) => d.genre === 'cadeau').pop() || {};
      faux('cadeau 250 €', puces === '25 €|50 €|100 €|150 €|250 €' && !env.erreur && /2 cartes de 250 €, total 500 €/.test(env.statut), `page Offrir « ${puces} », erreur « ${env.erreur} », statut « ${env.statut} »`);
      faux('cadeau 250 €', dc.montant === 250 && dc.quantite === 2 && dc.total === 500 && dc.offre === 'cadeau-200' && dc.intitule === 'Carte cadeau de 250 €' && dc.publication >= 1 && dc.acheteur?.nom === 'Hugo Simon (exemple)' && dc.pour === 'Léa' && dc.de === 'Hugo', `la demande reçue : ${JSON.stringify(dc)}`);
      await of.reload({ waitUntil: 'load' }); await attendrePret(of); await attendre(1500); await of.evaluate(() => { const r = document.querySelector('.ccq__puce input'); r.value = '60'; r.checked = true; r.dispatchEvent(new Event('input', { bubbles: true })); }); await of.locator('.ccq__offrir').click(); await attendre(900);
      faux('cadeau 250 €', /n’est pas proposé/.test(await texte('[data-ccq-erreur="montant"]', of)), 'un montant hors du catalogue publié (60 €) devrait être refusé'); await of.close();
      const acc = await site('/'); faux('cadeau 250 €', (await acc.locator('.oe-montant').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').trim()).join('|') === '25 €|50 €|100 €|150 €|250 €' && !/25 à 200/.test(await acc.evaluate(() => document.body.textContent)), 'les montants de l’accueil devraient suivre le catalogue publié'); await acc.close();
      await page.reload({ waitUntil: 'load' }); await attendrePret(page); await attendre(900); await aller(page, 'demandes'); await page.locator(`[data-demande="${dc.id}"] [data-com-ouvrir="cadeau"]`).click(); await attendre(450);
      faux('cadeau 250 €', /Carte cadeau de 250 €/.test(await texte('[data-cad-offre]')) && /version publiée n° \d/.test(await texte('[data-cad-offre]')) && /500 €/.test(await texte('[data-cad-total]')) && /Hugo Simon/.test(await texte('[data-cad-acheteur]')), `le suivi de la demande : « ${await texte('[data-cad-offre]')} », « ${await texte('[data-cad-total]')} »`); await debordement(page, 'le suivi d’une demande de carte');

      /* ===== Démonstration 7 · Une commande jusqu'au retrait ===== */
      await ouvrirDemo('commande');
      faux('démo 7', /Démonstration 7 sur 8/.test(await texte('[data-esp-scene]')) && /2 déc/.test(await texte('[data-scene-heure]')) && (await page.locator('[data-offre-type="emporter"]').count()) === 8 && (await faites()) === 1, `au départ : « ${(await texte('[data-esp-scene]')).slice(0, 160)} », ${await faites()} étape(s)`);
      faux('démo 7', /18 € la pièce/.test(await texte('[data-offre="emporter-escargots"] [data-offre-prix]')) && /28 € le kilo/.test(await texte('[data-offre="emporter-pate-lorrain"] [data-offre-prix]')), 'les unités du catalogue traiteur devraient être explicites'); await debordement(page, 'le catalogue à emporter');
      const cmdSite = async (escargots, kg) => { const g = await site('/a-emporter#produits', 1500);
        if (escargots) { await g.locator('[data-ajouter="escargots"]').click(); await attendre(1100); for (let k = 1; k < escargots; k++) { await g.locator('.emp-tl [data-action="plus"]').first().click(); await attendre(200); } await g.locator('.emp-tiroir__continuer').click({ force: true }); await attendre(650); }
        if (kg) { await g.locator('[data-produit="pate-lorrain"] [data-poids]').selectOption(String(kg)); await g.locator('[data-ajouter="pate-lorrain"]').click(); await attendre(1100); }
        return g; };
      const g7 = await cmdSite(2, 1.5); const tir = { lignes: (await g7.locator('.emp-tl').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ')).join(' / '), total: await texte('[data-tiroir-total]', g7) };
      faux('démo 7', /2 pièces/.test(tir.lignes) && /1,5 kg/.test(tir.lignes) && /18 € la pièce/.test(tir.lignes) && /28 € le kg/.test(tir.lignes) && /78/.test(tir.total), `le panier : ${JSON.stringify(tir)}`);
      await g7.locator('[data-tiroir-valider]').click(); await attendre(450);
      faux('démo 7', await g7.evaluate(() => [...document.querySelectorAll('[name="jour"]')].filter((x) => x.value < '2026-12-02').every((x) => x.disabled) && !document.querySelector('[name="jour"][value="2026-12-05"]').disabled), 'les jours passés devraient être refusés, le samedi 5 décembre proposé');
      await g7.evaluate(() => document.querySelector('[name="jour"][value="2026-12-05"]').click()); await attendre(350); await g7.evaluate(() => document.querySelector('[name="moment"][value="soir"]').click()); await attendre(250); await g7.locator('[data-tiroir-suite]').click(); await attendre(450);
      await g7.locator('[name="prenom"]').fill('Julie'); await g7.locator('[name="nom"]').fill('Martin (exemple)'); await g7.locator('[name="tel"]').fill('06 00 00 00 01'); await g7.locator('[name="remarque"]').fill('Sans persil.'); await attendre(250);
      const rel = await texte('[data-emp-relecture]', g7); await debordement(g7, 'le panneau de commande');
      await g7.locator('.emp-tiroir__pied button[type="submit"]').click(); await attendre(800);
      const merci = await texte('[data-emp-merci]', g7), ref = await texte('[data-emp-ref]', g7); await g7.close();
      faux('démo 7', /2 pièces/.test(rel) && /1,5 kg/.test(rel) && /78/.test(rel) && /samedi 5 décembre/.test(rel) && /doit encore être validée/.test(merci) && /^T-[A-Z0-9]+$/.test(ref), `relecture « ${rel.slice(0, 160)} », confirmation « ${merci.slice(0, 160)} », référence « ${ref} »`);
      const id7 = `T-${ref.slice(2).toLowerCase()}`, d7 = (await demandes()).find((d) => d.id === id7) || {};
      faux('démo 7', d7.cree === '2026-12-02T10:00:00' && d7.total === 78 && d7.lignes?.length === 2 && d7.lignes[1].unite === 'kilo' && d7.lignes[1].quantite === 1.5 && d7.lignes[1].total === 42 && d7.remarque === 'Sans persil.', `la demande enregistrée (horloge du scénario, lignes, unités) : ${JSON.stringify(d7).slice(0, 300)}`);
      await page.bringToFront(); await attendre(1100); await aller(page, 'demandes');
      await page.locator(`[data-demande="${id7}"] [data-com-ouvrir="commande"]`).click(); await attendre(450);
      const dossier = { ref: await texte('[data-cmd-ref]'), total: await texte('[data-cmd-total]'), retrait: await texte('[data-cmd-retrait]'), lignes: await texte('[data-cmd-lignes] tbody'), dispo: await texte('[data-cmd-dispo]'), actions: await texte('[data-cmd-actions]') };
      faux('démo 7', dossier.ref === ref && /78 €/.test(dossier.total) && /Samedi 5 décembre/.test(dossier.retrait) && /2 pièces 18 € la pièce 36 €/.test(dossier.lignes) && /1,5 kg .*28 € le kilo 42 €/.test(dossier.lignes), `le dossier ne reprend pas la commande du site : ${JSON.stringify(dossier)}`);
      faux('démo 7', /déjà comptés ailleurs 4 pièces sur 6 pièces/.test(dossier.dispo) && /1 autre commande sur 2/.test(dossier.dispo) && /exemple/i.test(dossier.dispo) && /aucune table ni aucun couvert/.test(dossier.dispo) && /Valider la commande/.test(dossier.actions) && !/Lancer la préparation|Remettre/.test(dossier.actions), `disponibilités ou boutons : ${JSON.stringify(dossier)}`);
      faux('démo 7', (await faites()) === 3, `après l'ouverture du dossier : ${await faites()} étape(s) sur 6`); await debordement(page, 'le dossier d’une commande');
      /* La dernière capacité demandée par deux commandes : le second onglet affichait encore Nadia B. comme possible. */
      const o2 = await ctx.newPage(); await ouvrirDemo('commande', o2); await aller(o2, 'demandes'); await o2.locator('[data-demande="sc7-nadia"] [data-com-ouvrir="commande"]').first().click(); await attendre(450);
      const avant2 = await texte('[data-cmd-dispo]', o2);
      await page.bringToFront(); await page.locator('[data-cmd-avancer="validee"]').click(); await attendre(600);
      faux('démo 7', /validée/.test(await toast()) && /Aucun message/.test(await toast()) && /Validée/.test(await texte('[data-cmd-pastille]')) && (await page.locator('[data-esp-toast-annuler]:visible').count()) === 0 && (await faites()) === 4, `validation : « ${await toast()} », ${await faites()} étape(s)`);
      await o2.bringToFront(); await o2.locator('[data-cmd-avancer="validee"]').click(); await attendre(600);
      const r2 = await refus(o2), e2 = await etat();
      faux('dernière capacité', /4 pièces sur 6/.test(avant2) && /production du samedi 5 décembre est complète/.test(r2) && /n'a pas été validée/.test(r2) && /Demande reçue/.test(await texte('[data-cmd-pastille]', o2)) && !e2.commerce.commandes['sc7-nadia'] && e2.commerce.commandes[id7].etat === 'validee', `second onglet : avant « ${avant2.slice(0, 120)} », refus « ${r2} », enregistré ${JSON.stringify(Object.keys(e2.commerce.commandes))}`);
      await o2.close(); await page.bringToFront();
      /* Le créneau complet, vu du site : mêmes règles. */
      const g8 = await cmdSite(0, 1); await g8.locator('[data-tiroir-valider]').click(); await attendre(400); await g8.evaluate(() => document.querySelector('[name="jour"][value="2026-12-05"]').click()); await attendre(350);
      faux('créneau complet', /retraits du soir sont complets/.test(await texte('[data-emp-creneau-note]', g8)) && await g8.locator('[name="moment"][value="soir"]').isDisabled(), `le site devrait refuser le samedi soir : « ${await texte('[data-emp-creneau-note]', g8)} »`); await g8.close();
      /* Une annulation avant la préparation libère la production et le créneau. */
      await page.locator('[data-com-retour]').click(); await attendre(350); await page.locator('[data-demande="sc7-marc"] [data-com-ouvrir="commande"]').first().click(); await attendre(450);
      await page.locator('[data-cmd-motif="annuler"]').click(); await attendre(300); await page.locator('[data-com-motif] button[type="submit"]').click(); await attendre(350); const sansMotif = await refus();
      await page.locator('#com-motif').fill('Le client a annulé par téléphone.'); await page.locator('[data-com-motif] button[type="submit"]').click(); await attendre(600);
      const e3 = await etat(), marc = e3.commerce.commandes['sc7-marc'];
      faux('annulation', /motif/.test(sansMotif) && marc.etat === 'annulee' && /libérés/.test(marc.historique.at(-1).texte) && /Annulée/.test(await texte('[data-cmd-pastille]')) && !(await page.locator('[data-cmd-actions]').count()), `annulation : sans motif « ${sansMotif} », état ${marc.etat}, « ${marc.historique.at(-1).texte} »`);
      /* Préparation : quantités regroupées, étapes, feuilles. */
      await page.locator('[data-com-retour]').click(); await attendre(350); await page.locator('[data-com-ouvrir="preparation"]').click(); await attendre(450);
      const prep = await texte('[data-prep-produits] tbody'); faux('préparation', /Escargots[^—]*6 pièces/.test(prep) && /Pâté lorrain[^—]*1,5 kg/.test(prep) && !/foie/i.test(prep), `quantités à préparer : « ${prep} »`); await debordement(page, 'la préparation');
      await page.locator(`[data-prep-commande="${id7}"] [data-cmd-avancer="preparation"]`).click(); await attendre(450); await page.locator(`[data-prep-commande="${id7}"] [data-cmd-avancer="prete"]`).click(); await attendre(450);
      await page.evaluate(() => { window.print = () => { window.__imprime = (document.querySelector('.esp-feuille')?.innerText || '').replace(/\s+/g, ' '); }; }); await page.locator('[data-com-imprimer="preparation"]').click(); await attendre(250);
      const feuille = await page.evaluate(() => window.__imprime || ''); faux('préparation', /Feuille de préparation/.test(feuille) && /4 pièces/.test(feuille) && /2 pièces/.test(feuille) && /1,5 kg/.test(feuille) && feuille.includes(ref) && (await faites()) === 5, `feuille de préparation « ${feuille.slice(0, 200)} », ${await faites()} étape(s)`);
      await page.locator(`[data-prep-commande="${id7}"] [data-com-ouvrir="commande"]`).click(); await attendre(450); await page.locator('[data-cmd-fiche]').click(); await attendre(300);
      const fiche = await texte('[data-cmd-fiche-apercu]'); await page.locator('[data-com-imprimer="retrait"]').click(); await attendre(250); const imprimee = await page.evaluate(() => window.__imprime || '');
      faux('retrait', /Fiche de retrait/.test(fiche) && fiche.includes(ref) && /Julie Martin/.test(fiche) && /Samedi 5 décembre, le soir/.test(fiche) && /2 pièces/.test(fiche) && /1,5 kg/.test(fiche) && /Sans persil/.test(fiche) && /Fiche de retrait/.test(imprimee), `fiche de retrait « ${fiche.slice(0, 220)} »`); await debordement(page, 'la fiche de retrait');
      await page.locator('[data-cmd-avancer="retiree"]').click(); await attendre(600);
      const e4 = await etat(), k7 = e4.commerce.commandes[id7], fin7 = await texte('[data-scene-essayer]');
      faux('démo 7', k7.etat === 'retiree' && k7.historique.map((h) => h.quoi).join() === 'recue,validee,preparation,prete,retiree' && (await faites()) === 6 && fin7.includes(ref) && /6 pièces d'escargots engagées sur 6/.test(fin7) && /Rien n'a été envoyé ni encaissé/.test(fin7) && !e4.resa?.ajouts?.length, `fin : ${k7.etat}, historique ${k7.historique.map((h) => h.quoi).join()}, conclusion « ${fin7.slice(0, 200)} »`);
      /* Un prix qui change après la commande : le site suit, la commande reçue ne bouge pas. */
      await aller(page, 'carte'); await page.locator('[data-offre="emporter-escargots"] [data-offre-editer]').click(); await attendre(350); await page.locator('#of-prix').fill('20'); await page.locator('[data-form-offre] button[type="submit"]').click(); await attendre(500);
      await page.locator('[data-offre="emporter-escargots"] [data-pub-ouvrir]').first().click(); await attendre(300); await page.locator('[data-pub-confirmer]').first().click(); await attendre(600);
      const g9 = await site('/a-emporter#produits', 1200), prixSite = await texte('[data-produit="escargots"] .emp-produit__prix', g9); await g9.close();
      await aller(page, 'demandes'); await page.locator(`[data-demande="${id7}"] [data-com-ouvrir="commande"]`).click(); await attendre(450);
      faux('prix après commande', /20/.test(prixSite) && /18 € la pièce 36 €/.test(await texte('[data-cmd-lignes] tbody')) && /78 €/.test(await texte('[data-cmd-total]')), `site « ${prixSite} », commande « ${await texte('[data-cmd-lignes] tbody')} »`);
      /* La fiche du client : la commande une fois, pas de fusion sur le nom. */
      await page.locator('[data-voir-demande]').click(); await attendre(450); if (!(await page.locator(`[data-demande="${id7}"] [data-client]:visible`).count())) { await page.locator(`[data-demande="${id7}"] [data-ouvrir-demande]`).click(); await attendre(300); }
      await page.locator(`[data-demande="${id7}"] [data-client]`).first().click(); await attendre(450);
      const fc = await texte('[data-com-fiche]'); faux('fiche client', /Commandes à emporter \(1\)/.test(fc) && fc.includes(ref) && /Retirée/.test(fc) && !(await page.locator('.esp-fiche__demandes li').count()), `fiche : « ${fc.slice(0, 200)} »`); await debordement(page, 'la fiche du client');
      await page.locator('button[data-fermer-client]').first().click(); await attendre(300);

      /* ===== Démonstration 8 · Un cadeau qui garde sa valeur ===== */
      await ouvrirDemo('cadeau');
      faux('démo 8', /Démonstration 8 sur 8/.test(await texte('[data-esp-scene]')) && (await faites()) === 0, `au départ : ${await faites()} étape(s)`);
      await page.locator('[data-demande="sc8-cadeau"] [data-com-ouvrir="cadeau"]').first().click(); await attendre(450);
      faux('démo 8', /Hugo S\./.test(await texte('[data-cad-acheteur]')) && /100 €/.test(await texte('[data-cad-total]')) && /Non enregistré/.test(await texte('[data-cad-reglement]')) && !(await page.locator('[data-cad-emettre], [data-cad-regler]').count()) && (await faites()) === 1, `la demande : « ${await texte('.esp-com-etats')} »`);
      await page.locator('[data-form-cad-valider] button[type="submit"]').click(); await attendre(500); faux('démo 8', !(await page.locator('[data-cad-emettre]').count()) && (await page.locator('[data-cad-regler]').count()) === 1 && (await faites()) === 2, 'après la validation : seul le règlement simulé devrait être proposé');
      await page.locator('[data-cad-regler]').click(); await attendre(500); faux('démo 8', /Simulé, 100 €/.test(await texte('[data-cad-reglement]')) && /Aucun paiement réel/.test(await toast()) && /exemple à confirmer/.test(await texte('[data-cad-validite]')) && (await faites()) === 3, `règlement : « ${await texte('[data-cad-reglement]')} », « ${await toast()} »`);
      await page.locator('[data-cad-emettre]').dblclick(); await attendre(700);
      const e5 = await etat(), l8 = Object.values(e5.commerce.cartes || {});
      faux('deux cartes', l8.length === 2 && l8.every((c) => c.valeur === 50 && /^DEMO-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(c.code)) && l8[0].code !== l8[1].code && (await page.locator('[data-cad-cartes] li').count()) === 2 && (await faites()) === 4, `cartes émises : ${JSON.stringify(l8.map((c) => [c.code, c.valeur]))}`); await debordement(page, 'les cartes émises d’une demande');
      await page.locator('[data-cad-cartes] [data-com-ouvrir="carte"]').first().click(); await attendre(450);
      await page.locator('#util-montant').fill('20'); await page.locator('#util-ref').fill('Déjeuner du mercredi'); await page.locator('#util-par').fill('Régis'); await attendre(250);
      const avantUse = await texte('[data-util-apres]'); await page.locator('[data-form-carte-utiliser] button[type="submit"]').dblclick(); await attendre(700);
      const e6 = await etat(), s6 = Object.values(e6.commerce.cartes).map((c) => [c.utilisations.length, 50 - c.utilisations.filter((u) => !u.annulee).reduce((t, u) => t + u.montant, 0)]);
      faux('utilisation', /30 €/.test(avantUse) && JSON.stringify(s6) === '[[1,30],[0,50]]' && /30 €/.test(await texte('[data-carte-solde]')) && (await faites()) === 5, `après 20 € (double clic) : ${JSON.stringify(s6)}, affiché « ${await texte('[data-carte-solde]')} »`);
      await page.locator('#util-montant').fill('35'); await attendre(250); const prevu = await texte('[data-util-apres]'); await page.locator('[data-form-carte-utiliser] button[type="submit"]').click(); await attendre(600);
      const fin8 = await texte('[data-scene-essayer]');
      faux('dépassement', /dépasse le solde/.test(prevu) && /35 € ne peuvent pas être utilisés/.test(await refus()) && /Rien n'a été débité/.test(await refus()) && /30 €/.test(await texte('[data-carte-solde]')) && (await faites()) === 6 && /solde 30 €/.test(fin8) && /solde 50 €/.test(fin8) && /Aucun paiement réel/.test(fin8), `refus « ${await refus()} », conclusion « ${fin8.slice(0, 220)} »`); await debordement(page, 'une carte cadeau');
      /* Conflit entre deux onglets : le second affichait encore 30 €. */
      const o3 = await ctx.newPage(); await o3.goto(page.url(), { waitUntil: 'load' }); await attendrePret(o3); await attendre(900); await aller(o3, 'demandes'); await o3.locator('[data-com-ouvrir="cartes"]').click(); await attendre(350); await o3.locator('[data-cartes] [data-com-ouvrir="carte"]').first().click(); await attendre(400); await o3.locator('#util-montant').fill('25'); await attendre(200);
      await page.bringToFront(); await page.locator('#util-montant').fill('10'); await page.locator('[data-form-carte-utiliser] button[type="submit"]').click(); await attendre(600);
      await o3.bringToFront(); await o3.locator('[data-form-carte-utiliser] button[type="submit"]').click(); await attendre(600);
      faux('conflit', /(a changé ailleurs : il est maintenant de 20 €|Le solde de cette carte est de 20 €)/.test(await refus(o3)) && /[Rr]ien n'a été débité/.test(await refus(o3)) && /20 €/.test(await texte('[data-carte-solde]', o3)) && Object.values((await etat()).commerce.cartes)[0].utilisations.length === 2, `second onglet : « ${await refus(o3)} », solde affiché « ${await texte('[data-carte-solde]', o3)} »`); await o3.close(); await page.bringToFront();
      /* Correction tracée : l'ancienne reste lisible, la nouvelle la remplace ; la saisie est gardée si le motif manque. */
      await page.reload({ waitUntil: 'load' }); await attendrePret(page); await attendre(900); await aller(page, 'demandes'); await page.locator('[data-com-ouvrir="cartes"]').click(); await attendre(350); await page.locator('[data-cartes] [data-com-ouvrir="carte"]').first().click(); await attendre(400);
      await page.locator('[data-usage-corriger]').first().click(); await attendre(300); await page.locator('#usage-montant').fill('15'); await page.locator('[data-form-usage] button[type="submit"]').click(); await attendre(400);
      const sansMotif8 = await refus(), garde = await page.locator('#usage-montant').inputValue(); await page.locator('#usage-motif').fill('Addition de 15 € et non de 20 €.'); await page.locator('[data-form-usage] button[type="submit"]').click(); await attendre(600);
      const e7 = await etat(), c8 = Object.values(e7.commerce.cartes)[0];
      faux('correction', /motif/.test(sansMotif8) && garde === '15' && c8.utilisations.length === 3 && c8.utilisations[0].annulee?.remplaceePar === 'u3' && c8.utilisations[2].corrige === 'u1' && /25 €/.test(await texte('[data-carte-solde]')) && (await page.locator('[data-usages] li.est-annulee').count()) === 1, `correction : sans motif « ${sansMotif8} », saisie gardée « ${garde} », ${JSON.stringify(c8.utilisations.map((u) => [u.id, u.montant, !!u.annulee]))}`);
      /* L'offre archivée après l'émission : les cartes gardent leur valeur et leur solde. */
      await aller(page, 'carte:catalogue'); await page.locator('[data-offre="cadeau-50"] [data-offre-archiver]').click(); await attendre(300); await page.locator('[data-offre-archiver-oui]').click(); await attendre(500);
      await aller(page, 'demandes'); await page.locator('[data-com-ouvrir="cartes"]').click(); await attendre(350);
      const apresArch = (await page.locator('[data-cartes] li').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ')).join(' / ');
      faux('offre archivée', (apresArch.match(/Active/g) || []).length === 2 && /solde 25 €/.test(apresArch) && /solde 50 €/.test(apresArch), `cartes après l'archivage : « ${apresArch.slice(0, 260)} »`); await debordement(page, 'la liste des cartes');
      await page.locator('#carte-code').fill(c8.code.toLowerCase().replace(/-/g, ' ')); await page.locator('[data-form-carte-code] button[type="submit"]').click(); await attendre(450); faux('code', (await texte('[data-carte-code]')) === c8.code, 'une carte devrait se retrouver par son code, écrit en minuscules et sans tirets');
      /* Aujourd'hui : rien ne compte dans les couverts ; les demandes à traiter y sont. */
      await aller(page, 'jour'); await debordement(page, 'Aujourd’hui');
      /* Recommencer remet le scénario à son départ ; quitter rend les données habituelles, intactes. */
      await page.locator('[data-scene-etapes] summary').click(); await attendre(250); await page.locator('[data-scene-recommencer]').click(); await attendre(1200);
      const e8 = await etat(); faux('remise à zéro', !Object.keys(e8.commerce?.cartes || {}).length && !e8.commerce?.cadeaux && (await faites()) === 0, `après « Recommencer » : ${JSON.stringify(e8.commerce || {}).slice(0, 160)}, ${await faites()} étape(s)`);
      if ((await page.evaluate(() => localStorage.getItem('jh-espace:v1'))) !== habituel) R.echec(`${ou} : isolation`, 'les démonstrations ont modifié les données habituelles', lieu);
      [...new Set(erreurs)].forEach((x) => R.echec('erreur de console ou ressource', x, lieu));
      R.ok(`espace : ${ou}`);
    } finally { await ctx.close(); }
  }

  /* ---------- 1-septdecies. v7.14.1 : des démonstrations isolées, une préparation fiable (ordinateur et largeur de téléphone) ----------
     A. L'isolation, en partant de données déjà là : un panier normal non vide, un brouillon normal de réservation, un état
        habituel de l'espace, des paniers distincts dans deux scénarios ; puis lancer, modifier, envoyer, reprendre,
        recommencer, quitter — et comparer. Une ancienne page ne réinjecte rien ; un contexte ou un stockage en panne
        n'écrit rien dans les données normales.
     B. La production engagée : une commande prête, réduite, déplacée, rectifiée, annulée ; ce qui est préparé reste compté.
     C. La période des retraits : réglée dans l'espace, suivie par la page À emporter (deux mois, contrôle final, aucune disponibilité).
     D. Une utilisation corrigée sur une carte expirée : solde historique, carte toujours expirée.
     Toutes les données sont fictives et créées ici, dans le navigateur de test. */
  for (const taille of (!SEUL || SEUL.includes('1-septdecies') ? ['1366×768', '390×844'] : []).map(T)) {
    const lieu = { page: P, taille: taille.nom }, ou = `consolidation (${taille.nom})`, tel = taille.w < 1000;
    const { ctx, page, erreurs } = await contexte({ taille });
    try {
      const texte = async (sel, pg = page) => (await pg.locator(sel).first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
      const toast = () => texte('[data-esp-toast-texte]'), refus = (pg = page) => texte('[data-com-erreur]', pg);
      const debordement = async (pg, quoi) => { const d = await pg.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth); if (d > 1) R.echec(`${ou} : débordement`, `${quoi} déborde de ${d} px`, lieu); };
      const faux = (titre, cond, detail) => { if (!cond) R.echec(`${ou} : ${titre}`, String(detail).slice(0, 460), lieu); };
      const stock = (pg = page) => pg.evaluate(() => ({ L: Object.fromEntries(Object.keys(localStorage).sort().map((k) => [k, localStorage.getItem(k)])), S: Object.fromEntries(Object.keys(sessionStorage).sort().map((k) => [k, sessionStorage.getItem(k)])) }));
      const ouvrirSite = async (chemin, demo = null, pg = null, pause = 1400) => { const g = pg || await ctx.newPage(), [avant, ancre] = chemin.split('#'); await g.goto(`${BASE}${avant}${demo === null ? '' : `${avant.includes('?') ? '&' : '?'}demo=${demo}`}${ancre ? `#${ancre}` : ''}`, { waitUntil: 'load' }); await attendrePret(g); await attendre(pause); return g; };
      const ouvrirDemo = async (id, pg = page) => { await pg.goto(`${BASE}${P}?demo=${id}`, { waitUntil: 'load' }); await attendrePret(pg); if (await pg.locator('[data-esp-app]').isHidden()) await pg.locator('[data-esp-connexion] button[type="submit"]').click(); await pg.locator('[data-esp-app]').waitFor({ state: 'visible', timeout: 5000 }); await attendre(700); };
      const etat = (demo) => page.evaluate((d) => JSON.parse(localStorage.getItem(`jh-demo:${d}:espace:v1`) || '{}'), demo);
      const ajouter = async (g, id) => { await g.locator(`[data-ajouter="${id}"]`).click(); await attendre(1100); await g.locator('.emp-tiroir__continuer').click({ force: true }); await attendre(600); };
      const panierVu = (g) => g.evaluate(() => [...document.querySelectorAll('[data-tiroir-lignes] .emp-tl')].map((x) => x.dataset.cle).join(','));
      const brouillon = (g, t) => g.evaluate((t) => { const el = document.querySelector('[data-resa-form] [name="message"]'); if (t !== undefined) { el.value = t; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); } return el.value; }, t);
      const changerDePage = async (pg, action) => { await pg.evaluate(() => { window.__ancienne = true; }); await action(); await pg.waitForFunction(() => !window.__ancienne && document.readyState === 'complete' && !!document.querySelector('[data-esp-app]') && !document.querySelector('[data-esp-app]').hidden, null, { timeout: 15000 }); await attendre(600); };
      const TEMOIN = JSON.stringify({ _schema: 2, annonce: { active: false, texte: 'Témoin des données habituelles' }, commerce: { capacites: { production: { 'emporter-tataki-boeuf': 9 } } } });

      /* ===== A · 0. Les données habituelles, présentes AVANT tout : un panier, un brouillon, un état de l'espace ===== */
      await page.goto(BASE + '/la-carte', { waitUntil: 'load' }); await page.evaluate((t) => { localStorage.clear(); sessionStorage.clear(); localStorage.setItem('jh-espace:v1', t); }, TEMOIN);
      await ouvrirSite('/a-emporter#produits', null, page); await ajouter(page, 'tataki-boeuf'); await page.locator('[data-ajouter="tataki-boeuf"]').click(); await attendre(1100); await page.locator('.emp-tiroir__continuer').click({ force: true }); await attendre(500); await ajouter(page, 'tourte-escargots');
      await ouvrirSite('/reserver#formulaire', null, page); await brouillon(page, 'Brouillon habituel : une table près de la cheminée'); await attendre(400);
      const normal = await stock();
      faux('préparation', normal.L['hacienda-emporter'] === '[{"id":"tataki-boeuf","qte":2},{"id":"tourte-escargots","qte":1}]' && /table près de la cheminée/.test(normal.S['resa-brouillon:/reserver'] || '') && normal.L['jh-espace:v1'] === TEMOIN, `les données habituelles de départ ne sont pas celles attendues : ${JSON.stringify(normal).slice(0, 380)}`);
      const intact = async (quand, pg = page) => { const s = await stock(pg); faux('données habituelles', s.L['hacienda-emporter'] === normal.L['hacienda-emporter'] && s.L['jh-espace:v1'] === normal.L['jh-espace:v1'] && !s.L['jh-espace-demandes:v1'] && !s.L['jh-espace-resas:v1'], `${quand} : le panier normal, l'état habituel ou les demandes habituelles ont changé (${JSON.stringify({ panier: s.L['hacienda-emporter'], demandes: s.L['jh-espace-demandes:v1'] || '' }).slice(0, 300)})`); return s; };
      /* Un onglet ordinaire, laissé ouvert sur la page À emporter : il ne doit jamais recevoir le panier d'une démonstration. */
      const ordinaire = await ouvrirSite('/a-emporter#produits'); const vuOrdinaire = await panierVu(ordinaire);
      faux('préparation', vuOrdinaire === 'tataki-boeuf|0,tourte-escargots|0', `l'onglet ordinaire devrait montrer le panier normal : « ${vuOrdinaire} »`);

      /* ===== A · 1. Démonstration 7 : son panier est le sien ; une commande envoyée ne touche à rien d'habituel ===== */
      await ouvrirDemo('commande');
      const g = await ouvrirSite('/a-emporter#produits', 'commande');
      faux('isolation', (await panierVu(g)) === '' && !(await g.locator('[data-emp-memoire]').isVisible()), `la démonstration ne doit pas se remplir du panier normal : « ${await panierVu(g)} »`);
      await ajouter(g, 'escargots'); await g.locator('[data-ajouter="escargots"]').click(); await attendre(1100);
      await g.locator('[data-tiroir-valider]').click(); await attendre(450); await g.evaluate(() => document.querySelector('[name="jour"][value="2026-12-05"]').click()); await attendre(350); await g.evaluate(() => document.querySelector('[name="moment"][value="soir"]').click()); await attendre(250); await g.locator('[data-tiroir-suite]').click(); await attendre(450);
      await g.locator('[name="prenom"]').fill('Julie'); await g.locator('[name="nom"]').fill('Martin (exemple)'); await g.locator('[name="tel"]').fill('06 00 00 00 01'); await g.locator('.emp-tiroir__pied button[type="submit"]').click(); await attendre(800);
      const ref = await texte('[data-emp-ref]', g), s1 = await intact('après une commande envoyée dans la démonstration 7', g);
      faux('envoi', /^T-[A-Z0-9]+$/.test(ref) && JSON.parse(s1.L['jh-demo:commande:tmp:hacienda-emporter'] || '{}').valeur?.length === 0 && (JSON.parse(s1.L['jh-demo:commande:espace-demandes:v1'] || '[]').some((d) => d.id === `T-${ref.slice(2).toLowerCase()}`)), `la commande devrait être partie dans le scénario, et son panier vidé : réf « ${ref} », ${JSON.stringify(s1.L['jh-demo:commande:tmp:hacienda-emporter'])}`);
      faux('isolation', (await panierVu(ordinaire)) === vuOrdinaire, `l'onglet ordinaire a reçu le panier de la démonstration : « ${await panierVu(ordinaire)} »`);

      /* ===== A · 2 et 3. Deux scénarios, deux paniers ; deux onglets du même scénario se suivent, les autres non ===== */
      await g.reload({ waitUntil: 'load' }); await attendrePret(g); await attendre(1200); await ajouter(g, 'foie-gras');
      const h = await ouvrirSite('/a-emporter#produits', 'cadeau'); faux('deux scénarios', (await panierVu(h)) === '', `la démonstration 8 ne doit pas voir le panier de la 7 : « ${await panierVu(h)} »`); await ajouter(h, 'gravlax');
      const g2 = await ouvrirSite('/a-emporter#produits', 'commande'); faux('même scénario', (await panierVu(g2)) === 'foie-gras|0', `un second onglet du scénario devrait reprendre son panier : « ${await panierVu(g2)} »`);
      await g.bringToFront(); await ajouter(g, 'tourte-grenouilles'); await attendre(500);
      const vus = { g2: await panierVu(g2), h: await panierVu(h), ordinaire: await panierVu(ordinaire) };
      faux('onglets', vus.g2 === 'foie-gras|0,tourte-grenouilles|0' && vus.h === 'gravlax|0' && vus.ordinaire === vuOrdinaire, `la synchronisation doit rester dans le contexte : ${JSON.stringify(vus)}`);
      const s2 = await intact('avec deux scénarios ouverts', g);
      faux('deux scénarios', /foie-gras/.test(s2.L['jh-demo:commande:tmp:hacienda-emporter']) && /gravlax/.test(s2.L['jh-demo:cadeau:tmp:hacienda-emporter']) && !/gravlax/.test(s2.L['jh-demo:commande:tmp:hacienda-emporter']), `chaque scénario devrait garder son panier : ${JSON.stringify([s2.L['jh-demo:commande:tmp:hacienda-emporter'], s2.L['jh-demo:cadeau:tmp:hacienda-emporter']]).slice(0, 300)}`);
      /* Le brouillon de réservation d'une démonstration, dans le même onglet que le brouillon habituel. */
      await ouvrirSite('/reserver#formulaire', 'commande', page);
      faux('brouillon', (await brouillon(page)) === '', `la démonstration ne doit pas reprendre le brouillon habituel : « ${await brouillon(page)} »`);
      await brouillon(page, 'Brouillon de la démonstration 7'); await attendre(400);
      const s3 = await stock(); faux('brouillon', s3.S['resa-brouillon:/reserver'] === normal.S['resa-brouillon:/reserver'] && /démonstration 7/.test(s3.S['jh-demo:commande:tmp:resa-brouillon:/reserver'] || ''), `le brouillon habituel ne doit pas être réécrit : ${JSON.stringify(s3.S).slice(0, 320)}`);

      /* ===== A · 4. « Reprendre » conserve le scénario ===== */
      await page.goto(`${BASE}${P}?demo=`, { waitUntil: 'load' }); await attendrePret(page); if (await page.locator('[data-esp-app]').isHidden()) await page.locator('[data-esp-connexion] button[type="submit"]').click(); await attendre(800);
      await aller(page, 'jour'); await page.locator('[data-demo-lancer]:visible').first().click(); await attendre(400);
      await changerDePage(page, () => page.locator('[data-demo-reprendre="commande"]').click());
      const s4 = await intact('après « Reprendre »');
      faux('reprendre', /tourte-grenouilles/.test(s4.L['jh-demo:commande:tmp:hacienda-emporter'] || '') && JSON.parse(s4.L['jh-demo:commande:espace-demandes:v1'] || '[]').length === 4 && /démonstration 7/.test(s4.S['jh-demo:commande:tmp:resa-brouillon:/reserver'] || ''), `« Reprendre » devrait garder le panier, la commande envoyée et le brouillon du scénario : ${JSON.stringify(s4.L['jh-demo:commande:tmp:hacienda-emporter'])}`);

      /* ===== A · 5 et 6. « Recommencer » remet à zéro CE scénario ; une ancienne page ne réinjecte rien, n'envoie rien ===== */
      /* Une ancienne page de réservation du scénario, restée ouverte avec une demande prête à partir. */
      const rv = await ouvrirSite('/reserver#formulaire', 'commande');
      await rv.locator('[data-resa-form] [data-jour]:not(:disabled)').first().click(); await attendre(250); await rv.locator('[data-etape-suivante]').click(); await attendre(500);
      await rv.locator('[data-resa-form] input[name="heure"]:not(:disabled)').first().check({ force: true }); await attendre(250); await rv.locator('[data-etape-suivante]').click(); await attendre(500); await rv.locator('[data-etape-suivante]').click(); await attendre(500);
      await rv.fill('[name="prenom"]', 'Ancien'); await rv.fill('[name="nom"]', 'Brouillon (exemple)'); await rv.fill('[name="telephone"]', '06 00 00 00 09'); await rv.fill('[name="email"]', 'ancien@exemple.fr'); await rv.locator('[data-resa-form] button[type="submit"]').click(); await attendre(700);
      await page.bringToFront(); if (!(await page.locator('[data-scene-etapes]').evaluate((d) => d.open))) await page.locator('[data-scene-etapes] > summary').click();
      await changerDePage(page, () => page.locator('[data-scene-recommencer]').click());
      const s5 = await intact('après « Recommencer »');
      faux('recommencer', !s5.L['jh-demo:commande:tmp:hacienda-emporter'] && !s5.S['jh-demo:commande:tmp:resa-brouillon:/reserver'] && JSON.parse(s5.L['jh-demo:commande:espace-demandes:v1'] || '[]').length === 3 && /gravlax/.test(s5.L['jh-demo:cadeau:tmp:hacienda-emporter'] || ''), `« Recommencer » doit effacer le panier et le brouillon de CE scénario, et lui seul : ${JSON.stringify({ sept: s5.L['jh-demo:commande:tmp:hacienda-emporter'] || '', huit: s5.L['jh-demo:cadeau:tmp:hacienda-emporter'] || '' }).slice(0, 260)}`);
      await attendre(600);
      const vieux = { panier: await panierVu(g), dit: await texte('[data-emp-memoire]', g) };
      faux('ancienne page', vieux.panier === '' && /a été recommencée/.test(vieux.dit) && /remise à zéro/.test(vieux.dit), `l'ancienne page du scénario devrait reconnaître la remise à zéro : ${JSON.stringify(vieux)}`);
      await g.bringToFront(); await g.locator('[data-ajouter="escargots"]').click(); await attendre(900);
      const s6 = await intact('après un ajout depuis une ancienne page', g);
      faux('ancienne page', !s6.L['jh-demo:commande:tmp:hacienda-emporter'] && (await panierVu(g)) === '', `une ancienne page ne doit rien réinjecter dans le nouveau départ : ${JSON.stringify(s6.L['jh-demo:commande:tmp:hacienda-emporter'] || '')}, « ${await panierVu(g)} »`);
      await rv.bringToFront(); await rv.locator('[data-resa-confirmer]').click(); await attendre(900);
      const envoiVieux = { erreur: (await rv.locator('[data-resa-form] [role="alert"], .resa__erreur').allInnerTexts()).join(' ').replace(/\s+/g, ' '), envoye: await rv.locator('.est-envoye').count(), resas: (await stock(rv)).L['jh-demo:commande:espace-resas:v1'] || '' };
      faux('ancienne page', /a été recommencée/.test(envoiVieux.erreur) && !envoiVieux.envoye && !envoiVieux.resas, `une ancienne page ne doit pas envoyer son ancien brouillon : ${JSON.stringify(envoiVieux).slice(0, 300)}`);
      await rv.close(); await g2.close();

      /* ===== A · 7. « Quitter » : le brouillon et le panier habituels sont retrouvés tels quels ===== */
      await page.bringToFront(); if (!(await page.locator('[data-scene-etapes]').evaluate((d) => d.open))) await page.locator('[data-scene-etapes] > summary').click();
      await changerDePage(page, () => page.locator('[data-scene-quitter]').click());
      await ouvrirSite('/reserver#formulaire', null, page);
      faux('quitter', (await brouillon(page)) === 'Brouillon habituel : une table près de la cheminée', `le brouillon habituel devrait être retrouvé après la démonstration : « ${await brouillon(page)} »`);
      await ouvrirSite('/a-emporter#produits', null, page); faux('quitter', (await panierVu(page)) === vuOrdinaire && (await panierVu(ordinaire)) === vuOrdinaire, `le panier habituel devrait être retrouvé : « ${await panierVu(page)} »`);
      const fin = await intact('après avoir quitté la démonstration'); faux('quitter', fin.S['resa-brouillon:/reserver'] === normal.S['resa-brouillon:/reserver'], 'le brouillon habituel a été modifié');
      await g.close(); await h.close(); await ordinaire.close();

      /* ===== A · 8. Un contexte ou un stockage en panne n'écrit rien dans les données normales, et le dit ===== */
      /* a) L'onglet ne peut pas retenir la démonstration (mémoire de session en écriture refusée) : elle vaut pour la page, par l'adresse. */
      const f1 = await ctx.newPage(); await f1.addInitScript(() => { const poser = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (this === sessionStorage) throw new DOMException('refusé', 'QuotaExceededError'); return poser.call(this, k, v); }; });
      await ouvrirSite('/a-emporter#produits', 'commande', f1);
      const fragile = { panier: await panierVu(f1), note: await texte('[data-contexte-fragile]', f1) };
      faux('contexte fragile', fragile.panier === '' && /mémoire de cet onglet est indisponible/.test(fragile.note), `sans mémoire d'onglet, la démonstration ne doit pas retomber sur le panier normal, et doit le dire : ${JSON.stringify(fragile)}`);
      await ajouter(f1, 'escargots'); const sf = await intact('avec une mémoire d\'onglet refusée', f1);
      faux('contexte fragile', /escargots/.test(sf.L['jh-demo:commande:tmp:hacienda-emporter'] || ''), 'le panier de la démonstration devrait être gardé sous sa propre clé');
      await f1.locator('a[href="/offrir"], a[href$="/offrir"]').first().evaluate((a) => a.click()); await f1.waitForURL(/offrir/, { timeout: 10000 }).catch(() => {}); await attendre(600);
      faux('contexte fragile', /[?&]demo=commande/.test(f1.url()), `les liens devraient porter la démonstration dans leur adresse : ${f1.url()}`); await f1.close();
      /* b) La mémoire de session est illisible : on ne sait pas si l'onglet est en démonstration → rien n'est lu ni écrit. */
      const f2 = await ctx.newPage(); await f2.addInitScript(() => { const lire = Storage.prototype.getItem; Storage.prototype.getItem = function (k) { if (this === sessionStorage) throw new DOMException('refusé', 'SecurityError'); return lire.call(this, k); }; });
      await ouvrirSite('/a-emporter#produits', null, f2);
      const flou = { panier: await panierVu(f2), dit: await texte('[data-emp-memoire]', f2) };
      faux('contexte incertain', flou.panier === '' && /rien n'est lu ni écrit dans vos données habituelles/.test(flou.dit), `contexte incertain : le panier normal ne doit pas être lu, et la page doit le dire : ${JSON.stringify(flou)}`);
      await ajouter(f2, 'gravlax'); await intact('avec une mémoire de session illisible', f2); faux('contexte incertain', (await panierVu(f2)) === 'gravlax|0', 'la commande devrait rester utilisable sur la page'); await f2.close();
      /* c) Usage normal, navigateur plein : l'ajout reste sur la page, c'est dit, et le panier gardé n'est pas abîmé. */
      const f3 = await ctx.newPage(); await f3.addInitScript(() => { const poser = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (this === localStorage && k === 'hacienda-emporter' && window.__plein) throw new DOMException('plein', 'QuotaExceededError'); return poser.call(this, k, v); }; });
      await ouvrirSite('/a-emporter#produits', null, f3); await f3.evaluate(() => { window.__plein = true; }); await ajouter(f3, 'gravlax');
      const plein = await intact('avec un navigateur plein', f3); faux('stockage plein', /indisponible/.test(await texte('[data-emp-memoire]', f3)) && /gravlax/.test(await panierVu(f3)) && plein.L['hacienda-emporter'] === normal.L['hacienda-emporter'], `stockage plein : « ${await texte('[data-emp-memoire]', f3)} »`); await debordement(f3, 'la page À emporter avec son message'); await f3.close();

      /* ===== B. La production engagée (démonstration 7, repartie de son début) ===== */
      await ouvrirDemo('commande'); await aller(page, 'demandes');
      await page.locator('[data-demande="sc7-paul"] [data-com-ouvrir="commande"]:visible').first().click(); await attendre(450);
      await page.locator('[data-cmd-avancer="preparation"]').click(); await attendre(500);
      const lance = { toast: await toast(), lots: await texte('[data-prod-lots]') };
      faux('lancement', /engagées en production pour le 5 décembre/.test(lance.toast) && /4 pièces/.test(lance.lots) && /samedi 5 décembre/.test(lance.lots) && /Préparation lancée/.test(lance.lots), `le lancement devrait engager 4 pièces pour le samedi 5 : ${JSON.stringify(lance).slice(0, 300)}`);
      await page.locator('[data-cmd-avancer="prete"]').click(); await attendre(450);
      /* Au clavier : « Corriger » s'ouvre à Entrée, le titre du formulaire reçoit le focus. */
      await page.locator('[data-cmd-modifier]').focus(); await page.keyboard.press('Enter'); await attendre(400);
      faux('clavier', await page.evaluate(() => document.activeElement?.id === 'cmd-ed-titre'), 'ouvrir « Corriger » au clavier devrait amener le focus sur le formulaire');
      await page.locator('[data-cmd-q="0"]').fill('1'); await attendre(300);
      const ef = await texte('[data-cmd-effets]');
      faux('effets', /4 pièces → 1 pièce à remettre/.test(ef) && /production déjà engagée le samedi 5 décembre \(4 pièces\) reste comptée/.test(ef) && /à remettre : 1 pièce/.test(ef), `l'effet devrait être dit avant d'enregistrer : « ${ef.slice(0, 300)} »`);
      await page.locator('#cmd-jour').focus(); await page.keyboard.press('Enter'); await attendre(450);
      const sansMotif = await refus(), gardee = await page.locator('[data-cmd-q="0"]').inputValue();
      faux('motif', /motif de cette correction/.test(sansMotif) && gardee === '1' && (await etat('commande')).commerce.commandes['sc7-paul'].lignes[0].quantite === 4, `sans motif : « ${sansMotif} », saisie gardée « ${gardee} »`);
      await page.locator('#cmd-motif').fill('Le client n\'en retire qu\'une.'); await page.locator('[data-form-cmd] button[type="submit"]').click(); await attendre(600);
      const e1 = (await etat('commande')).commerce, k1 = e1.commandes['sc7-paul'], dit1 = { toast: await toast(), ecart: await texte('[data-cmd-ecart]'), dispo: await texte('[data-cmd-dispo]'), etatVu: await texte('[data-cmd-pastille]') };
      faux('réduction', k1.lignes[0].quantite === 1 && k1.total === 18 && k1.etat === 'prete' && k1.production.lots[0].quantite === 4 && k1.production.lots[0].jour === '2026-12-05' && /production déjà engagée reste comptée/.test(dit1.toast) && /À remettre : Escargots à la crème d'ail, 1 pièce/.test(dit1.ecart) && /\(4 pièces\) reste comptée/.test(dit1.ecart) && /production comptée ce jour 4 pièces sur 6 pièces/.test(dit1.dispo), `après la réduction : ${JSON.stringify({ lignes: k1.lignes[0].quantite, lots: k1.production.lots, ...dit1 }).slice(0, 420)}`);
      await debordement(page, 'le dossier d’une commande corrigée');
      /* Une nouvelle commande qui dépasserait la capacité du samedi reste refusée (4 engagés + 2 de Nadia = 6 : elle passe ; 3 de plus non). */
      await page.locator('[data-com-retour]').click(); await attendre(350); await page.locator('[data-demande="sc7-nadia"] [data-com-ouvrir="commande"]:visible').first().click(); await attendre(450);
      await page.locator('[data-cmd-modifier]').click(); await attendre(350); await page.locator('[data-cmd-q="0"]').fill('3'); await page.locator('[data-form-cmd] button[type="submit"]').click(); await attendre(500);
      await page.locator('[data-cmd-avancer="validee"]').click(); await attendre(500);
      faux('capacité', /il ne reste que 2 pièces à produire pour le samedi 5 décembre/.test(await refus()) && !(await etat('commande')).commerce.commandes['sc7-nadia']?.etat?.match(/validee/), `3 escargots de plus le samedi devraient être refusés (4 préparés restent comptés) : « ${await refus()} »`);
      /* Le retrait déplacé au dimanche midi : rien ne s'ajoute à la production du dimanche ; le créneau suit. */
      await page.locator('[data-com-retour]').click(); await attendre(350); await page.locator('[data-demande="sc7-paul"] [data-com-ouvrir="commande"]:visible').first().click(); await attendre(450);
      await page.locator('[data-cmd-modifier]').click(); await attendre(350); await page.locator('#cmd-jour').fill('2026-12-06'); await page.locator('#cmd-moment').selectOption('midi'); await page.locator('#cmd-motif').fill('Il passe dimanche midi.'); await attendre(250);
      const ef2 = await texte('[data-cmd-effets]'); await page.locator('[data-form-cmd] button[type="submit"]').click(); await attendre(600);
      const k2 = (await etat('commande')).commerce.commandes['sc7-paul'], lots2 = await texte('[data-prod-lots]');
      faux('déplacement', /samedi 5 décembre, le soir → dimanche 6 décembre, à midi/.test(ef2) && /reste comptée ce jour-là/.test(ef2) && k2.jour === '2026-12-06' && k2.moment === 'midi' && k2.production.lots.length === 1 && k2.production.lots[0].jour === '2026-12-05' && /à remettre au client : 1 pièce, le dimanche 6 décembre/.test(lots2), `après le déplacement : ${JSON.stringify({ jour: k2.jour, lots: k2.production.lots }).slice(0, 260)}, « ${lots2.slice(0, 160)} »`);
      /* La rectification : une action à part, au clavier, avec son motif ; un double envoi ne l'applique qu'une fois. */
      await page.locator('[data-prod-rectifier="l1"]').focus(); await page.keyboard.press('Enter'); await attendre(400);
      faux('clavier', await page.evaluate(() => document.activeElement?.id === 'rectif-titre'), 'ouvrir « Rectifier la production » au clavier devrait amener le focus sur son formulaire');
      await page.locator('#rectif-q').fill('3'); await attendre(250); const efR = await texte('[data-rectif-effets]');
      await page.locator('[data-form-rectifier] button[type="submit"]').click(); await attendre(450); const sansMotifR = await refus();
      await page.locator('#rectif-motif').fill('Trois pièces seulement ont été cuites.'); await page.locator('[data-form-rectifier] button[type="submit"]').dblclick(); await attendre(700);
      const k3 = (await etat('commande')).commerce.commandes['sc7-paul'];
      faux('rectification', /Avant : 4 pièces le samedi 5 décembre\. Après : 3 pièces/.test(efR) && /4 pièces → 3 pièces sur 6 pièces/.test(efR) && /motif de la rectification/.test(sansMotifR) && k3.production.lots[0].quantite === 3 && k3.production.rectifications.length === 1 && k3.production.rectifications[0].avant.quantite === 4 && k3.lignes[0].quantite === 1 && /rectifiée/.test(await toast()) && /Production rectifiée/.test(await texte('[data-com-histo] li')), `rectification : effets « ${efR.slice(0, 160)} », sans motif « ${sansMotifR} », ${JSON.stringify(k3.production).slice(0, 220)}`);
      /* Préparation et retraits lit les mêmes informations : 3 pièces engagées le 5, à remettre 1 pièce le 6. */
      await page.locator('[data-com-retour]').click(); await attendre(350); await page.locator('[data-com-ouvrir="preparation"]:visible').first().click(); await attendre(450); await page.locator('[data-prep-jour="2026-12-05"]').click(); await attendre(350);
      const prep5 = await texte('[data-prep-produits]'); await debordement(page, 'préparation et retraits');
      faux('préparation', /production engagée 3 pièces pour le 5 décembre ; à remettre : 1 pièce, retrait le 6 décembre/.test(prep5) && /3 pièces sur 6 pièces/.test(prep5), `le tableau du 5 décembre : « ${prep5.slice(0, 300)} »`);
      await page.locator('[data-prep-jour="2026-12-06"]').click(); await attendre(350); const prep6 = await texte('[data-prep-produits]');
      faux('préparation', /1 pièce/.test(await texte('[data-prep-pret]')) && /—/.test(await texte('[data-prep-engage]')), `le dimanche 6 : 1 pièce prête à remettre, aucune production : « ${prep6.slice(0, 200)} »`);
      if (tel) faux('téléphone', await page.evaluate(() => getComputedStyle(document.querySelector('[data-prep-engage]'), '::before').content.includes('Engagé')), 'sur téléphone, chaque quantité du tableau devrait porter le nom de sa colonne');
      /* L'annulation : les lots restent, le créneau est libéré. */
      await page.locator('[data-prep-commande="sc7-paul"] [data-com-ouvrir="commande"]').click(); await attendre(450); await page.locator('[data-cmd-motif="annuler"]').click(); await attendre(300); await page.locator('#com-motif').fill('Finalement annulée.'); await page.locator('[data-com-motif] button[type="submit"]').click(); await attendre(600);
      const k4 = (await etat('commande')).commerce.commandes['sc7-paul'], histo4 = await texte('[data-com-histo] li');
      faux('annulation', k4.etat === 'annulee' && k4.production.lots[0].quantite === 3 && /production engagée reste comptée \(Escargots à la crème d'ail, 3 pièces le samedi 5 décembre\)/.test(histo4) && /créneau de retrait est libéré/.test(histo4), `après l'annulation : ${k4.etat}, « ${histo4.slice(0, 220)} »`);

      /* ===== C. La période des retraits : réglée dans l'espace, suivie par le site ===== */
      const site7 = await ouvrirSite('/a-emporter#calendrier', 'commande');
      const cal = (pg) => pg.evaluate(() => { const l = [...document.querySelectorAll('[name="jour"]')], o = l.filter((x) => !x.disabled); return { radios: l.length, ouverts: o.length, premier: o[0]?.value || '', dernier: o.at(-1)?.value || '', mois: document.querySelector('.emp-calendrier__mois')?.textContent || '', titres: document.querySelectorAll('.emp-calendrier__titre-mois').length, avent: document.querySelectorAll('.avent__case').length, sur: document.querySelector('.avent .surtitre')?.textContent || '', info: document.querySelector('.ouv-traiteur__info')?.textContent || '' }; });
      const c0 = await cal(site7);
      faux('période de départ', c0.ouverts === 19 && c0.premier === '2026-12-05' && c0.dernier === '2026-12-31' && c0.mois === 'décembre 2026' && c0.avent === 27 && /5 au 31 décembre/.test(c0.sur), `la page devrait proposer le 5–31 décembre 2026 au départ : ${JSON.stringify(c0)}`);
      await page.bringToFront(); await page.locator('[data-com-retour]').click(); await attendre(350); if (!(await page.locator('[data-com-preparation]').count())) { await page.locator('[data-com-ouvrir="preparation"]:visible').first().click(); await attendre(450); }
      /* Au clavier : le réglage s'ouvre à Entrée sur son titre. */
      await page.locator('[data-periode] > summary').focus(); await page.keyboard.press('Enter'); await attendre(300);
      faux('clavier', await page.locator('[data-periode]').evaluate((d) => d.open), 'la période des retraits devrait s’ouvrir au clavier');
      const regler = async (debut, fin2) => { await page.bringToFront(); await page.locator('#per-debut').fill(debut); await page.locator('#per-fin').fill(fin2); await attendre(250); const effets = await texte('[data-periode-effets]'); await page.locator('[data-form-periode] button[type="submit"]').click(); await attendre(500); return { effets, toast: await toast(), refus: await refus(), actuelle: await texte('[data-periode-actuelle]') }; };
      const inv = await regler('2026-12-20', '2026-12-10');
      faux('période invalide', /sera refusée/.test(inv.effets) && /avant le premier/.test(inv.refus) && /du 5 au 31 décembre 2026/.test(inv.actuelle) && !(await etat('commande')).commerce.retraits, `une période à l'envers devrait être refusée : ${JSON.stringify(inv).slice(0, 300)}`);
      const p1 = await regler('2026-12-28', '2027-01-10');
      faux('période réglée', /Du 28 décembre 2026 au 10 janvier 2027, bornes comprises/.test(p1.effets) && /SC7-MARC/.test(p1.effets) && /reste telle quelle/.test(p1.effets) && /SC7-NADIA/.test(p1.effets) && /avant validation/.test(p1.effets) && /enregistrée : du 28 décembre 2026 au 10 janvier 2027/.test(p1.toast) && /28 décembre 2026 au 10 janvier 2027/.test(p1.actuelle), `le réglage devrait dire son effet puis s'enregistrer : ${JSON.stringify(p1).slice(0, 420)}`);
      await debordement(page, 'le réglage de la période');
      /* La page déjà ouverte suit sans rechargement ; rechargée, ses textes citent la nouvelle période. */
      await site7.bringToFront(); await attendre(700); const c1 = await cal(site7);
      faux('page ouverte', c1.premier === '2026-12-30' && c1.dernier === '2027-01-10' && c1.titres === 2 && /décembre 2026 – janvier 2027/.test(c1.mois) && c1.avent === 14, `la page déjà ouverte devrait suivre la nouvelle période : ${JSON.stringify(c1)}`);
      await site7.reload({ waitUntil: 'load' }); await attendrePret(site7); await attendre(1500); const c2 = await cal(site7);
      faux('période sur le site', c2.ouverts === 10 && /28 décembre 2026 au 10 janvier 2027/i.test(c2.sur) && /28 décembre 2026 au 10 janvier 2027/.test(c2.info) && /dimanche 10 janvier/.test(await site7.locator('[data-tiroir-retrait]').first().textContent()), `les deux bornes et les textes devraient suivre : ${JSON.stringify(c2)}`); await debordement(site7, 'la page À emporter sur deux mois');
      /* Une commande pour janvier ; pendant la saisie, la période est raccourcie : le jour choisi est retiré, avec la raison. */
      await ajouter(site7, 'escargots'); await site7.locator('[data-ajouter="escargots"]').click(); await attendre(1100); await site7.locator('[data-tiroir-valider]').click(); await attendre(450);
      await site7.evaluate(() => document.querySelector('[name="jour"][value="2027-01-08"]').click()); await attendre(350); await site7.evaluate(() => document.querySelector('[name="moment"][value="soir"]').click()); await attendre(250); await site7.locator('[data-tiroir-suite]').click(); await attendre(450);
      await site7.locator('[name="prenom"]').fill('Julie'); await site7.locator('[name="nom"]').fill('Martin (exemple)'); await site7.locator('[name="tel"]').fill('06 00 00 00 01');
      await regler('2026-12-28', '2027-01-05'); await site7.bringToFront(); await attendre(500); await site7.locator('.emp-tiroir__pied button[type="submit"]').click(); await attendre(800);
      const perdu = { dit: await texte('[data-erreur="jour"]', site7), merci: await site7.locator('[data-emp-merci]').isVisible(), demandes: JSON.parse((await stock(site7)).L['jh-demo:commande:espace-demandes:v1'] || '[]').length };
      faux('contrôle final', /vendredi 8 janvier n'est plus proposé au retrait : il est hors de la période des retraits \(du 28 décembre 2026 au 5 janvier 2027\)/.test(perdu.dit) && !perdu.merci && perdu.demandes === 3, `un jour sorti de la période pendant la saisie ne doit pas partir, et la raison doit être dite : ${JSON.stringify(perdu).slice(0, 320)}`);
      await site7.evaluate(() => document.querySelector('[name="jour"][value="2027-01-02"]').click()); await attendre(350); await site7.locator('[data-tiroir-suite]').click().catch(() => {}); await attendre(400); await site7.locator('.emp-tiroir__pied button[type="submit"]').click(); await attendre(800);
      faux('contrôle final', /^T-/.test(await texte('[data-emp-ref]', site7)) && /samedi 2 janvier/.test(await texte('[data-emp-merci]', site7)), `un jour resté dans la période devrait partir : « ${(await texte('[data-emp-merci]', site7)).slice(0, 140)} »`);
      /* Une commande déjà validée hors de la nouvelle période reste traitable ; une demande en attente demande une décision. */
      await page.bringToFront(); await page.locator('[data-com-retour]').click(); await attendre(350); await page.locator('[data-demande="sc7-marc"] [data-com-ouvrir="commande"]:visible').first().click(); await attendre(450);
      const marc = { note: await texte('[data-cmd-hors-note]'), etatVu: await texte('[data-cmd-pastille]') }; await page.locator('[data-cmd-avancer="preparation"]').click(); await attendre(450);
      faux('commande préservée', /reste telle quelle/.test(marc.note) && /Validée/.test(marc.etatVu) && (await etat('commande')).commerce.commandes['sc7-marc'].etat === 'preparation' && (await etat('commande')).commerce.commandes['sc7-marc'].jour === '2026-12-11', `la commande de Marc L. (11 décembre) devrait rester validée et traitable : ${JSON.stringify(marc).slice(0, 260)}`);
      await page.locator('[data-com-retour]').click(); await attendre(350); if (await page.locator('[data-com-preparation]').count()) { await page.locator('[data-com-retour]').click(); await attendre(350); }
      await page.locator('[data-demande="sc7-nadia"] [data-com-ouvrir="commande"]:visible').first().click(); await attendre(450);
      const nadia = { alerte: await texte('[data-cmd-hors]'), valider: await page.locator('[data-cmd-actions] [data-cmd-avancer="validee"]').count(), boutons: (await page.locator('[data-cmd-hors] button').allInnerTexts()).join(' | ') };
      faux('demande incompatible', /Retrait à revoir avant de valider/.test(nadia.alerte) && /hors de la période des retraits/.test(nadia.alerte) && !nadia.valider && /Convenir d'un autre retrait/.test(nadia.boutons) && /à titre exceptionnel/.test(nadia.boutons) && /Refuser/.test(nadia.boutons), `la demande de Nadia B. devrait demander une décision explicite : ${JSON.stringify(nadia).slice(0, 320)}`);
      if (tel) faux('cibles', (await page.locator('[data-cmd-hors] button').evaluateAll((l) => l.map((b) => Math.round(b.getBoundingClientRect().height)))).every((x) => x >= 44), 'sur téléphone, les trois décisions devraient mesurer au moins 44 px'); await debordement(page, 'une demande au retrait hors période');
      await page.locator('[data-cmd-exception]').focus(); await page.keyboard.press('Enter'); await attendre(600);
      const kn = (await etat('commande')).commerce.commandes['sc7-nadia'];
      faux('décision explicite', kn.etat === 'validee' && kn.horsPeriode === true && /à titre exceptionnel/.test(kn.historique.at(-1).texte) && /acceptée à titre exceptionnel/.test(await texte('[data-cmd-hors-note]')), `accepter à titre exceptionnel devrait être noté : ${JSON.stringify({ etat: kn.etat, hors: kn.horsPeriode }).slice(0, 200)}`);
      /* Plus aucune disponibilité : période terminée (le scénario est au 2 décembre 2026), puis période faite de jours fermés. */
      await page.locator('[data-com-retour]').click(); await attendre(350); await page.locator('[data-com-ouvrir="preparation"]:visible').first().click(); await attendre(450); if (!(await page.locator('[data-periode]').evaluate((d) => d.open))) await page.locator('[data-periode] > summary').click();
      const p2 = await regler('2026-11-01', '2026-11-20'); await site7.bringToFront(); await site7.reload({ waitUntil: 'load' }); await attendrePret(site7); await attendre(1200);
      const term = { cal: await cal(site7), dit: await texte('[data-emp-sans-retrait]', site7), avent: await texte('[data-avent-note]', site7) };
      faux('période terminée', /déjà terminée/.test(p2.effets) && term.cal.ouverts === 0 && /est terminée : les commandes à emporter ne sont plus prises/.test(term.dit) && /est terminée/.test(term.avent), `période terminée : ${JSON.stringify(term).slice(0, 360)}`); await debordement(site7, 'la page À emporter sans retrait possible');
      await regler('2026-12-07', '2026-12-08'); await site7.bringToFront(); await site7.reload({ waitUntil: 'load' }); await attendrePret(site7); await attendre(1200);
      faux('aucun jour ouvert', /fermé pendant toute la période des retraits/.test(await texte('[data-emp-sans-retrait]', site7)), `période de jours fermés : « ${await texte('[data-emp-sans-retrait]', site7)} »`);
      /* Retour au réglage de départ ; la démonstration et l'usage normal suivent chacun leur horloge. */
      await page.bringToFront(); await page.locator('[data-periode-defaut]').click(); await attendre(500);
      faux('retour au départ', /retour au réglage de départ \(du 5 au 31 décembre 2026\)/.test(await toast()) && !(await etat('commande')).commerce.retraits, `« Revenir à la période de départ » : « ${await toast()} »`);
      await regler('2026-11-27', '2026-12-31'); await site7.bringToFront(); await site7.reload({ waitUntil: 'load' }); await attendrePret(site7); await attendre(1200);
      const horlogeDemo = await site7.evaluate(() => [...document.querySelectorAll('[name="jour"]')].filter((x) => x.disabled).map((x) => x.value).join(','));
      faux('horloge du scénario', horlogeDemo === '2026-11-27,2026-11-28,2026-11-29', `en démonstration (2 décembre 2026), les jours d'avant devraient être passés : « ${horlogeDemo} »`); await site7.close();
      const reelle = await ctx.newPage(); await reelle.clock.setFixedTime(new Date('2026-11-28T10:00:00+01:00')); await reelle.goto(`${BASE}/a-emporter?demo=#calendrier`, { waitUntil: 'load' }); await attendre(1500);
      await reelle.evaluate(() => { const d = JSON.parse(localStorage.getItem('jh-espace:v1')); d.commerce.retraits = { debut: '2026-11-27', fin: '2026-12-31' }; localStorage.setItem('jh-espace:v1', JSON.stringify(d)); }); await reelle.reload({ waitUntil: 'load' }); await attendre(1500);
      const horlogeReelle = await reelle.evaluate(() => [...document.querySelectorAll('[name="jour"]')].filter((x) => x.disabled).map((x) => x.value).join(','));
      faux('horloge normale', horlogeReelle === '2026-11-27', `hors démonstration, à la date du jour (28 novembre 2026), seul le 27 devrait être passé : « ${horlogeReelle} »`);
      await reelle.evaluate((t) => localStorage.setItem('jh-espace:v1', t), TEMOIN); await reelle.close();

      /* ===== D. Une utilisation corrigée sur une carte expirée (démonstration 8) ===== */
      await ouvrirDemo('cadeau'); await aller(page, 'demandes'); await page.locator('[data-demande="sc8-cadeau"] [data-com-ouvrir="cadeau"]:visible').first().click(); await attendre(450);
      await page.locator('[data-form-cad-valider] button[type="submit"]').click(); await attendre(450); await page.locator('[data-cad-regler]').click(); await attendre(450); await page.locator('[data-cad-emettre]').click(); await attendre(500);
      await page.locator('[data-cad-cartes] [data-com-ouvrir="carte"]').first().click(); await attendre(450);
      await page.locator('#util-montant').fill('20'); await page.locator('#util-ref').fill('Déjeuner (exemple)'); await page.locator('[data-form-carte-utiliser] button[type="submit"]').click(); await attendre(600);
      faux('utilisation', /30 €/.test(await texte('[data-carte-solde]')), `après 20 € : « ${await texte('[data-carte-solde]')} »`);
      /* Le saut d'horloge du scénario : le lendemain de la fin de validité. */
      if (!(await page.locator('[data-scene-etapes]').evaluate((d) => d.open))) await page.locator('[data-scene-etapes] > summary').click();
      const variantes = await texte('.esp-scene__variantes .esp-scene__sous'); await page.locator('[data-scene-saut="expiration"]').click(); await attendre(600);
      if (tel && await page.locator('[data-scene-etapes]').evaluate((d) => d.open)) await page.locator('[data-scene-etapes] > summary').click();
      const exp = { etatVu: await texte('[data-carte-pastille]'), bloquee: await texte('[data-carte-bloquee]'), formulaire: await page.locator('[data-form-carte-utiliser]').count(), note: await texte('[data-carte-note-historique]'), boutons: await page.locator('[data-usage-corriger]').count(), solde: await texte('.esp-com-etats li:nth-child(2)') };
      faux('carte expirée', /Cinq variantes/i.test(variantes) && /Expirée/.test(exp.etatVu) && /a expiré/.test(exp.bloquee) && !exp.formulaire && /aucune nouvelle utilisation/.test(exp.note) && /la carte reste expirée/.test(exp.note) && exp.boutons === 1 && /Solde à l'expiration/i.test(exp.solde) && /non utilisable/.test(exp.solde), `la carte devrait être expirée, sans formulaire d'utilisation, avec la correction possible : ${JSON.stringify(exp).slice(0, 420)}`);
      await page.locator('[data-usage-corriger]').focus(); await page.keyboard.press('Enter'); await attendre(400);
      faux('clavier', await page.evaluate(() => document.activeElement?.id === 'usage-montant'), 'ouvrir « Corriger » au clavier devrait amener le focus sur le montant');
      await page.locator('#usage-montant').fill('15'); await page.locator('[data-form-usage] button[type="submit"]').click(); await attendre(450); const sansMotifD = await refus(), gardeD = await page.locator('#usage-montant').inputValue();
      await page.locator('#usage-motif').fill('L\'addition était de 15 €, pas de 20 €.'); await page.locator('[data-form-usage] button[type="submit"]').dblclick(); await attendre(700);
      const cartesD = Object.values((await etat('cadeau')).commerce.cartes), c1D = cartesD.find((x) => x.utilisations.length), apres = { toast: await toast(), etatVu: await texte('[data-carte-pastille]'), solde: await texte('[data-carte-solde]'), validite: await texte('[data-carte-validite]'), formulaire: await page.locator('[data-form-carte-utiliser]').count(), histo: await texte('[data-com-histo] li') };
      faux('correction historique', /motif/.test(sansMotifD) && gardeD === '15' && c1D.utilisations.length === 2 && c1D.utilisations[0].annulee?.remplaceePar === 'u2' && c1D.utilisations[1].montant === 15 && !c1D.desactivee && /35 €/.test(apres.solde) && /Expirée/.test(apres.etatVu) && !apres.formulaire && /La carte reste expirée/.test(apres.toast) && /20 € → 15 €/.test(apres.histo) && /reste expirée/.test(apres.histo) && (await page.locator('[data-usages] li.est-annulee').count()) === 1, `correction après expiration : ${JSON.stringify({ sansMotifD, gardeD, usages: c1D.utilisations.map((u) => [u.id, u.montant, !!u.annulee]), ...apres }).slice(0, 460)}`);
      faux('expiration inchangée', c1D.expire === cartesD.find((x) => !x.utilisations.length).expire && /Jusqu'au/.test(apres.validite), `la date de fin ne doit pas changer : ${c1D.expire}, « ${apres.validite} »`); await debordement(page, 'une carte expirée corrigée');
      await intact('à la fin du parcours');
      [...new Set(erreurs)].forEach((x) => R.echec('erreur de console ou ressource', x, lieu));
      R.ok(`espace : ${ou}`);
    } catch (err) { R.echec(`${ou} : parcours interrompu`, String(err?.message || err).slice(0, 400), lieu);
    } finally { await ctx.close(); }
  }

  /* ---------- 2. Chaque rubrique, mesurée dans l'espace ---------- */
  async function mesurerEcran(page, taille, ou, complet) {
    await page.evaluate(installerOutils);
    await page.evaluate(defilerTout, { pas: 0.8, pause: 60 }).catch(() => {});
    const res = await page.evaluate(mesurer, { galeriesStatiques: false, tactile: taille.tactile, structure: complet, textesEtrangers: [], francais: taille.nom === '1366×768' });
    noter(res.problemes, taille, ou);
    if (complet) {
      noter(await page.evaluate(mesurerRecouvrements, 60).catch(() => []), taille, ou);
      if (axe) {
        await page.addScriptTag({ content: axe });
        const v = await page.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa'], resultTypes: ['violations'] })).violations.map((x) => ({ id: x.id, aide: x.help, impact: x.impact, noeuds: x.nodes.slice(0, 3).map((n) => n.target.join(' ')) })));
        v.forEach((x) => R.ajouter(x.impact === 'minor' ? 'regarder' : 'echec', `accessibilité (axe) : ${x.id}`, `${ou} : ${x.aide}`, { page: P, taille: taille.nom, selecteur: x.noeuds.join(' ; ') }));
      }
    }
  }
  for (const taille of (!SEUL || SEUL.includes('2') ? ['320×568', '390×844', '768×1024', '1366×768', '1920×1080'] : []).map(T)) {
    const { ctx, page, erreurs } = await contexte({ taille });
    const complet = ['390×844', '1366×768'].includes(taille.nom);
    try {
      await entrer(page);
      for (const v of VUES) { await aller(page, v); await mesurerEcran(page, taille, `rubrique ${v}`, complet); }
      /* L'ajout d'une réservation, l'éditeur d'événement, la photothèque, le message « Annuler », le menu. */
      await aller(page, 'resas:agenda'); await page.locator('[data-ajouter]').first().click(); await attendre(350); await mesurerEcran(page, taille, 'ajout d’une réservation', complet);
      /* L'onglet « Service » un jour où il y a du monde, puis son formulaire « Modifier ». */
      { const jours = await page.evaluate(() => [...document.querySelectorAll('[data-esp-rendu="resas"] [data-jour]')].map((b) => b.dataset.jour)); let trouve = false;
        for (const j of jours) { await aller(page, 'resas:agenda'); await page.locator(`[data-esp-rendu="resas"] [data-jour="${j}"]`).first().click().catch(() => {}); await attendre(200); await aller(page, 'resas:service'); if (await page.locator('[data-esp-panneau-resas] [data-modifier-resa]').count()) { trouve = true; break; } }
        if (trouve) { await mesurerEcran(page, taille, 'service : la frise', complet); await page.locator('[data-esp-panneau-resas] [data-modifier-resa]').first().click(); await attendre(350); await mesurerEcran(page, taille, 'service : modifier une réservation', complet); await page.locator('[data-form-resa] [data-modifier-resa]').click(); await attendre(200);
          /* La fiche client, puis le plan de salle : une réservation choisie, tout le monde placé, une table ouverte. */
          await page.locator('[data-esp-panneau-resas] [data-client]').first().click(); await attendre(450); await mesurerEcran(page, taille, 'fiche client', complet); await page.keyboard.press('Escape'); await attendre(300);
          await aller(page, 'resas:salle'); await page.locator('[data-esp-panneau-resas] [data-choisir-resa]').first().click(); await attendre(350); await mesurerEcran(page, taille, 'plan de salle : une réservation choisie', complet);
          await page.locator('[data-placer-tout]').click(); await attendre(450); await page.locator('[data-esp-panneau-resas] .esp-table:is(.est-prise, .est-attente, .est-arrivee)').first().click(); await attendre(450); await mesurerEcran(page, taille, 'plan de salle : une table ouverte', complet);
          await page.locator('[data-fermer-table]').click(); await attendre(200); }
        else R.regarder('espace : service', 'aucun jour de la semaine n’a de réservation à montrer : la frise n’a pas été mesurée', { page: P, taille: taille.nom }); }
      await aller(page, 'demandes'); await page.locator('[data-filtre-demandes="reception"]').click(); await attendre(250); await page.locator('[data-esp-rendu="demandes"] [data-ouvrir-demande]').first().click(); await attendre(400);
      /* Un message passager encore affiché peut s'effacer pendant la mesure : lu à moitié transparent, il donnait un faux « contraste insuffisant » selon l'instant. On attend qu'il soit parti de lui-même. */
      await page.waitForFunction(() => { const t = document.querySelector('.esp-toast'); return !t || getComputedStyle(t).visibility === 'hidden'; }, null, { timeout: 14000 }).catch(() => {});
      await mesurerEcran(page, taille, 'demande de réception ouverte', complet);
      await page.locator('[data-filtre-demandes="table"]').click(); await attendre(250); await page.locator('.esp-resa__message summary').first().click(); await attendre(250); await mesurerEcran(page, taille, 'tables à confirmer et message', false);
      await aller(page, 'carte:carte'); await page.locator('[data-plat="entrees/foie-gras-de-canard-maison"] [data-editer-plat]').click(); await attendre(400); await mesurerEcran(page, taille, 'éditeur de plat', complet);
      await page.locator('[data-plat="entrees/foie-gras-de-canard-maison"] [data-editer-plat]').first().click(); await attendre(200);
      await aller(page, 'site:soirees'); await page.locator('.esp-ev [data-editer]').first().click(); await attendre(450); await mesurerEcran(page, taille, 'éditeur d’événement', complet);
      await page.locator('[data-choisir-photo="ev"]').click(); await attendre(500); await mesurerEcran(page, taille, 'photothèque', complet);
      await page.keyboard.press('Escape'); await attendre(250);
      await aller(page, 'jour'); await page.locator('[data-statut="refusee"]').first().click(); await attendre(700); await mesurerEcran(page, taille, 'message « Annuler »', false);
      const toast = await page.evaluate(() => { const t = document.querySelector('[data-esp-toast]').getBoundingClientRect(), n = document.querySelector('.esp-nav').getBoundingClientRect(), fixe = getComputedStyle(document.querySelector('.esp-nav')).position === 'fixed'; return { dehors: t.left < 0 || t.right > innerWidth + 1 || t.bottom > innerHeight, surNav: fixe && t.bottom > n.top + 1 }; });
      if (toast.dehors || toast.surNav) R.echec('espace : message du bas', toast.dehors ? 'le message sort de l’écran' : 'le message recouvre la barre des rubriques', { page: P, taille: taille.nom });
      await page.locator('[data-esp-annuler]').click(); await attendre(300);
      await page.locator('[data-esp-plus]').click(); await attendre(300); await mesurerEcran(page, taille, 'menu « Plus d’actions »', false);
      const pan = await page.evaluate(() => { const r = document.querySelector('[data-esp-plus-panneau]').getBoundingClientRect(); return r.left < 0 || r.right > document.documentElement.clientWidth + 1; });
      if (pan) R.echec('espace : menu', 'le menu « Plus d’actions » sort de l’écran', { page: P, taille: taille.nom });
      await page.keyboard.press('Escape'); await attendre(200);
      await page.locator('[data-esp-plus]').click(); await attendre(250); await page.locator('[data-esp-installer]').click(); await attendre(400); await mesurerEcran(page, taille, 'fenêtre « Sur l’écran d’accueil »', complet);
      await page.keyboard.press('Escape'); await attendre(250);
      /* La barre : les exemples, puis une proposition. */
      await page.locator('[data-esp-quoi]:visible').first().click(); await attendre(400); await mesurerEcran(page, taille, 'barre : exemples', complet);
      await page.locator('#barre-champ').fill('table pour 4 vendredi 20 h au nom de Martin'); await attendre(300); await mesurerEcran(page, taille, 'barre : proposition', false);
      const cmd = await page.evaluate(() => { const r = document.querySelector('.esp-cmd__boite').getBoundingClientRect(); return r.left < 0 || r.right > document.documentElement.clientWidth + 1 || r.bottom > innerHeight + 1; });
      if (cmd) R.echec('espace : barre', 'la barre sort de l’écran', { page: P, taille: taille.nom });
      await page.keyboard.press('Escape');
      [...new Set(erreurs)].forEach((x) => R.echec('erreur de console ou ressource', x, { page: P, taille: taille.nom }));
      R.ok('espace : mesures');
    } finally { await ctx.close(); }
  }

  /* ---------- 3. Balayage de 320 à 1920 px : aucun débordement horizontal, rubrique par rubrique ---------- */
  if (!SEUL || SEUL.includes('3')) {
    const { ctx, page } = await contexte({ taille: { nom: 'balayage', w: 320, h: 800, tactile: false } });
    try {
      await entrer(page);
      for (const v of VUES) {
        await aller(page, v); const fautes = [];
        for (let w = 320; w <= 1920; w += 40) {
          await page.setViewportSize({ width: w, height: 800 }); await attendre(60);
          const d = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth);
          if (d > 1) fautes.push(w);
        }
        if (fautes.length) R.echec('débordement horizontal', `rubrique ${v} — largeurs : ${fautes.length > 6 ? `${fautes[0]} à ${fautes.at(-1)} px (${fautes.length} largeurs)` : fautes.join(', ') + ' px'}`, { page: P, taille: 'balayage 320–1920' });
      }
      R.ok('espace : balayage');
    } finally { await ctx.close(); }
  }
}
