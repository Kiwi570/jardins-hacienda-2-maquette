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
   2. Chaque rubrique (et l'éditeur d'événement, l'ajout d'une réservation, la photothèque, la barre), à cinq tailles : les
      mesures de l'audit (débordement, textes sous 12 px, cibles de 44 px, textes coupés, contrastes, noms
      accessibles, typographie), axe-core, les recouvrements, puis un balayage de 320 à 1920 px.
   « Section sans visuel » n'est pas retenu ici : une rubrique d'outil n'est pas une section du site. */
import { readFileSync, existsSync } from 'node:fs';
import { installerOutils, defilerTout, mesurer, mesurerRecouvrements } from './page.mjs';

/* Les écrans à mesurer : les cinq rubriques, et pour « Site » chacun de ses onglets (v7.7.2). */
const VUES = ['jour', 'demandes', 'resas', 'carte:carte', 'carte:ardoise', 'site:soirees', 'site:horaires', 'site:textes', 'site:messages', 'site:photos'];
const P = '/espace';

export default async function ({ contexte, attendrePret, attendre, BASE, R, T }) {
  const axe = existsSync(new URL('./axe.min.js', import.meta.url)) ? readFileSync(new URL('./axe.min.js', import.meta.url), 'utf8') : '';
  const entrer = async (page) => {
    await page.goto(BASE + P, { waitUntil: 'load' }); await attendrePret(page);
    if (await page.locator('[data-esp-app]').isHidden()) await page.locator('[data-esp-connexion] button[type="submit"]').click();
    await page.locator('[data-esp-app]').waitFor({ state: 'visible', timeout: 5000 }); await attendre(500);
  };
  const aller = async (page, vue) => { const [v, onglet] = vue.split(':'); await page.locator(`[data-esp-vue="${v}"]`).click(); await attendre(400); if (onglet) { await page.locator(`[role="tab"][data-onglet="${onglet}"]`).click(); await attendre(350); } };

  /* ---------- 1. Réserver sur le site, puis confirmer dans l'espace ---------- */
  {
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
      await page.locator(`[data-esp-rendu="jour"] [data-resa="${demande.id}"] [data-statut="confirmee"]`).click(); await attendre(400);

      /* Dans l'agenda, au jour de la demande : confirmée ; « Complet » ferme le service sur la page Réserver. */
      await aller(page, 'resas');
      for (let i = 0; i < 6 && !(await page.locator(`[data-jour="${demande.date}"]`).count()); i++) { await page.locator('[data-semaine="7"]').click({ force: true }); await attendre(250); }
      await page.locator(`[data-jour="${demande.date}"]`).click(); await attendre(400);
      const agenda = await page.locator(`[data-esp-rendu="resas"] [data-resa="${demande.id}"]`).innerText().catch(() => '');
      if (!/Confirmée/.test(agenda)) R.echec('espace : réserver puis confirmer', `dans l’agenda du ${demande.date}, la demande n’est pas « Confirmée »`, lieu);
      await page.locator(`[data-complet="${demande.service}"]`).click(); await attendre(400);
      await page.goto(BASE + '/reserver#formulaire', { waitUntil: 'load' }); await attendrePret(page); await attendre(400);
      const complets = await page.evaluate((d) => (JSON.parse(document.querySelector('script[data-reservation]').textContent).complets?.[d] || []).length, demande.date);
      if (!complets) R.echec('espace : complet', 'le service dit « Complet » dans l’espace est encore proposé sur la page Réserver', { page: '/reserver', taille: taille.nom });
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
  for (const taille of ['390×844', '1366×768'].map(T)) {
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
  {
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
  {
    const taille = T('390×844'), lieu = { page: P, taille: taille.nom };
    const { ctx, page, erreurs } = await contexte({ taille });
    try {
      await entrer(page); await aller(page, 'carte:carte');
      const carte = () => page.evaluate(() => JSON.parse(localStorage.getItem('jh-espace:v1') || '{}').carte || {});
      const nomPlat = (await page.locator('[data-plat="plats/1"] [data-plat-nom]').innerText()).trim();
      await page.locator('[data-epuise="plats/1"]').click(); await attendre(400);
      const jour = Object.values((await carte()).epuises || {})[0];
      if (!/^\d{4}-\d\d-\d\d$/.test(jour || '') || !(await page.locator('[data-plat="plats/1"].est-epuise').count())) R.echec('espace : carte', `« Épuisé aujourd’hui » : date enregistrée « ${jour} », plat marqué ${await page.locator('[data-plat="plats/1"].est-epuise').count()}`, lieu);
      /* Un prix et des allergènes ; un plat ajouté. */
      await page.locator('[data-plat="entrees/0"] [data-editer-plat]').click(); await attendre(300);
      await page.locator('#pl-prix').fill('23,50'); await page.locator('[name="allergene"][value="Gluten"]').check(); await attendre(800);
      await page.locator('[data-ajouter-plat-carte="desserts"]').click(); await attendre(300);
      await page.locator('#pl-nom').fill('Tarte aux mirabelles'); await page.locator('#pl-prix').fill('9'); await attendre(800);
      const c = await carte();
      if (c.modifs?.['entrees/0']?.prix !== 23.5 || c.modifs['entrees/0'].allergenes?.join() !== 'Gluten' || c.ajouts?.[0]?.nom !== 'Tarte aux mirabelles') R.echec('espace : carte', `après les modifications : ${JSON.stringify(c).slice(0, 160)}`, lieu);
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
      const apres = await page.evaluate(() => ({ ep: Object.keys(JSON.parse(localStorage.getItem('jh-espace:v1') || '{}').carte?.epuises || {}).filter((k) => k === 'entrees/0').length, vue: !document.querySelector('[data-vue="carte"]').hidden }));
      if (!apres.ep || !apres.vue) R.echec('espace : carte', `« épuisé : foie gras » dans la barre : enregistré ${apres.ep}, rubrique Carte ouverte ${apres.vue}`, lieu);
      [...new Set(erreurs)].forEach((x) => R.echec('erreur de console ou ressource', x, lieu));
      R.ok('espace : la carte en main');
    } finally { await ctx.close(); }
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
  for (const taille of ['320×568', '390×844', '768×1024', '1366×768', '1920×1080'].map(T)) {
    const { ctx, page, erreurs } = await contexte({ taille });
    const complet = ['390×844', '1366×768'].includes(taille.nom);
    try {
      await entrer(page);
      for (const v of VUES) { await aller(page, v); await mesurerEcran(page, taille, `rubrique ${v}`, complet); }
      /* L'ajout d'une réservation, l'éditeur d'événement, la photothèque, le message « Annuler », le menu. */
      await aller(page, 'resas'); await page.locator('[data-ajouter]').first().click(); await attendre(350); await mesurerEcran(page, taille, 'ajout d’une réservation', complet);
      await aller(page, 'demandes'); await page.locator('[data-filtre-demandes="reception"]').click(); await attendre(250); await page.locator('[data-esp-rendu="demandes"] [data-ouvrir-demande]').first().click(); await attendre(400); await mesurerEcran(page, taille, 'demande de réception ouverte', complet);
      await page.locator('[data-filtre-demandes="table"]').click(); await attendre(250); await page.locator('.esp-resa__message summary').first().click(); await attendre(250); await mesurerEcran(page, taille, 'tables à confirmer et message', false);
      await aller(page, 'carte:carte'); await page.locator('[data-plat="entrees/0"] [data-editer-plat]').click(); await attendre(400); await mesurerEcran(page, taille, 'éditeur de plat', complet);
      await page.locator('[data-plat="entrees/0"] [data-editer-plat]').first().click(); await attendre(200);
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
  {
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
