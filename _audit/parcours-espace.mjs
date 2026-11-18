/* Parcours de l'espace restaurateur (v7.7.0). L'audit général ne voit que l'écran de connexion de /espace : ce
   parcours entre dans l'espace.
   1. Réserver sur le site, puis confirmer dans l'espace : la demande arrive « Depuis le site », se confirme d'un
      geste, « Annuler » la remet en attente, « Complet » ferme le service sur la page Réserver, « Tout remettre comme
      livré » efface tout et s'annule.
   2. Chaque rubrique (et l'éditeur d'événement, l'ajout d'une réservation, la photothèque), à cinq tailles : les
      mesures de l'audit (débordement, textes sous 12 px, cibles de 44 px, textes coupés, contrastes, noms
      accessibles, typographie), axe-core, les recouvrements, puis un balayage de 320 à 1920 px.
   « Section sans visuel » n'est pas retenu ici : une rubrique d'outil n'est pas une section du site. */
import { readFileSync, existsSync } from 'node:fs';
import { installerOutils, defilerTout, mesurer, mesurerRecouvrements } from './page.mjs';

const VUES = ['jour', 'resas', 'evenements', 'textes', 'photos'];
const P = '/espace';

export default async function ({ contexte, attendrePret, attendre, BASE, R, T }) {
  const axe = existsSync(new URL('./axe.min.js', import.meta.url)) ? readFileSync(new URL('./axe.min.js', import.meta.url), 'utf8') : '';
  const entrer = async (page) => {
    await page.goto(BASE + P, { waitUntil: 'load' }); await attendrePret(page);
    if (await page.locator('[data-esp-app]').isHidden()) await page.locator('[data-esp-connexion] button[type="submit"]').click();
    await page.locator('[data-esp-app]').waitFor({ state: 'visible', timeout: 5000 }); await attendre(500);
  };
  const aller = async (page, v) => { await page.locator(`[data-esp-vue="${v}"]`).click(); await attendre(450); };

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
      const badge = () => page.locator('[data-esp-badge="resas"]').innerText().then(Number).catch(() => 0);
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
      await aller(page, 'evenements'); await page.locator('.esp-ev [data-editer]').first().click(); await attendre(450); await mesurerEcran(page, taille, 'éditeur d’événement', complet);
      await page.locator('[data-choisir-photo="ev"]').click(); await attendre(500); await mesurerEcran(page, taille, 'photothèque', complet);
      await page.keyboard.press('Escape'); await attendre(250);
      await aller(page, 'jour'); await page.locator('[data-statut="refusee"]').first().click(); await attendre(700); await mesurerEcran(page, taille, 'message « Annuler »', false);
      const toast = await page.evaluate(() => { const t = document.querySelector('[data-esp-toast]').getBoundingClientRect(), n = document.querySelector('.esp-nav').getBoundingClientRect(), fixe = getComputedStyle(document.querySelector('.esp-nav')).position === 'fixed'; return { dehors: t.left < 0 || t.right > innerWidth + 1 || t.bottom > innerHeight, surNav: fixe && t.bottom > n.top + 1 }; });
      if (toast.dehors || toast.surNav) R.echec('espace : message du bas', toast.dehors ? 'le message sort de l’écran' : 'le message recouvre la barre des rubriques', { page: P, taille: taille.nom });
      await page.locator('[data-esp-annuler]').click(); await attendre(300);
      await page.locator('[data-esp-plus]').click(); await attendre(300); await mesurerEcran(page, taille, 'menu « Plus d’actions »', false);
      const pan = await page.evaluate(() => { const r = document.querySelector('[data-esp-plus-panneau]').getBoundingClientRect(); return r.left < 0 || r.right > document.documentElement.clientWidth + 1; });
      if (pan) R.echec('espace : menu', 'le menu « Plus d’actions » sort de l’écran', { page: P, taille: taille.nom });
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
