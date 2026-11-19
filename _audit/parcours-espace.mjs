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
const VUES = ['jour', 'demandes', 'resas:agenda', 'resas:service', 'resas:salle', 'resas:bilan', 'carte:carte', 'carte:ardoise', 'site:soirees', 'site:horaires', 'site:textes', 'site:messages', 'site:photos'];
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
  const aller = async (page, vue) => { const [v, onglet] = vue.split(':'); await page.locator(`[data-esp-vue="${v}"]`).click(); await attendre(400); if (onglet) { await page.locator(`[role="tab"][data-onglet="${onglet}"]`).click(); await attendre(350); } };

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
      if (!/Pas compris/.test(await page.locator('[data-barre-aide]').innerText().catch(() => ''))) R.echec('espace : barre', 'une phrase inconnue ne dit pas « Pas compris »', lieu);
      await page.keyboard.press('Escape'); await attendre(250);
      const fin = await page.evaluate(() => ({ ferme: document.querySelector('.esp-cmd').hidden, focus: document.activeElement && document.activeElement !== document.body, bloque: document.documentElement.classList.contains('esp-modale-ouverte') }));
      if (!fin.ferme || !fin.focus || fin.bloque) R.echec('espace : barre', `Échap : barre fermée ${fin.ferme}, focus rendu ${fin.focus}, page encore bloquée ${fin.bloque}`, lieu);
      /* La fête : la dernière demande reçoit sa réponse. */
      await aller(page, 'jour'); let fete = false;
      for (let i = 0; i < 30 && await page.locator('[data-esp-rendu="jour"] [data-repondre]').count(); i++) { await page.locator('[data-esp-rendu="jour"] [data-repondre]').first().click(); await attendre(150); fete = fete || !!(await page.locator('.esp-fete').count()); }
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
      if (!/^\d{4}-\d\d-\d\d$/.test(jour || '') || !(await page.locator('[data-plat="plats/poisson-selon-l-arrivage"].est-epuise').count())) R.echec('espace : carte', `« Épuisé aujourd’hui » : date enregistrée « ${jour} », plat marqué ${await page.locator('[data-plat="plats/poisson-selon-l-arrivage"].est-epuise').count()}`, lieu);
      /* Un prix et des allergènes ; un plat ajouté. */
      await page.locator('[data-plat="entrees/foie-gras-de-canard-maison"] [data-editer-plat]').click(); await attendre(300);
      await page.locator('#pl-prix').fill('23,50'); await page.locator('[name="allergene"][value="Gluten"]').check(); await attendre(800);
      await page.locator('[data-ajouter-plat-carte="desserts"]').click(); await attendre(300);
      await page.locator('#pl-nom').fill('Tarte aux mirabelles'); await page.locator('#pl-prix').fill('9'); await attendre(800);
      const c = await carte();
      if (c.modifs?.['entrees/foie-gras-de-canard-maison']?.prix !== 23.5 || c.modifs['entrees/foie-gras-de-canard-maison'].allergenes?.join() !== 'Gluten' || c.ajouts?.[0]?.nom !== 'Tarte aux mirabelles') R.echec('espace : carte', `après les modifications : ${JSON.stringify(c).slice(0, 160)}`, lieu);
      /* La carte du site suit. */
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
        return { resume: n(txt('.esp-service-tete__resume')), blocs: [...document.querySelectorAll('[data-esp-panneau-resas] .esp-frise__bloc b')].reduce((a, b) => a + +b.textContent, 0), pic: n(txt('.esp-charge__barre.est-pic b')), tableau: Math.max(0, ...[...document.querySelectorAll('.esp-charge .esp-bilan-table tbody td')].map((td) => +td.textContent)), ligne: (document.querySelector(sel)?.innerText || '').replace(/\s+/g, ' ') }; }, L);
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

  /* ---------- 2. Chaque rubrique, mesurée dans l'espace ---------- */
  const noter = (liste, taille, ou) => liste.filter((x) => x.controle !== 'section sans visuel').forEach((x) => R.ajouter(x.niveau || 'echec', x.controle, `${ou} : ${x.detail}`, { page: P, taille: taille.nom, selecteur: x.selecteur }));
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
      await aller(page, 'demandes'); await page.locator('[data-filtre-demandes="reception"]').click(); await attendre(250); await page.locator('[data-esp-rendu="demandes"] [data-ouvrir-demande]').first().click(); await attendre(400); await mesurerEcran(page, taille, 'demande de réception ouverte', complet);
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
