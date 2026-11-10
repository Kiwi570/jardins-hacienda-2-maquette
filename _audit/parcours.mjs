/* Parcours propres aux Jardins de l'Hacienda (2) : carte cadeau (total), filtre végétarien de la carte,
   table choisie sur le plan qui passe à la réservation, statut « ouvert maintenant », comptes à rebours. */
export default async function ({ contexte, attendrePret, attendre, BASE, R, T }) {
  const { ctx, page } = await contexte({ taille: T('390×844') });
  try {
    /* Carte cadeau : 100 € × 2 = 200 €. */
    await page.goto(BASE + '/offrir', { waitUntil: 'load' });
    await attendrePret(page);
    await page.locator('input[name="montant"][value="100"]').check({ force: true });
    await page.locator('[data-ccq-plus]').click();
    await attendre(400);
    const total = await page.locator('[data-ccq-total]').textContent();
    if (!/200/.test(total || '')) R.echec('carte-cadeau', `total affiché « ${total} » au lieu de 200 € (100 € × 2)`, { page: '/offrir', taille: '390×844' });

    /* Carte : le filtre végétarien ne garde que le dhal et le houmous. */
    await page.goto(BASE + '/la-carte', { waitUntil: 'load' });
    await attendrePret(page);
    await page.locator('[data-filtre="vegetarien"]').first().click();
    await attendre(500);
    const vege = await page.evaluate(() => [...document.querySelectorAll('.carte-resto__plat')].filter((p) => p.offsetParent !== null).map((p) => p.querySelector('.carte-resto__plat-nom').textContent.trim()));
    if (vege.length !== 2 || !vege.some((n) => /Dhal/.test(n))) R.echec('carte', `filtre végétarien : ${vege.join(', ') || 'aucun plat'} (attendu : dhal et houmous)`, { page: '/la-carte', taille: '390×844' });

    /* Plan de salle → réservation : la table 2 pour 4 arrive préremplie. */
    await page.goto(BASE + '/reserver?table=2&couverts=4&espace=salle#formulaire', { waitUntil: 'load' });
    await attendrePret(page);
    await attendre(600);
    const resa = await page.evaluate(() => ({ couverts: document.querySelector('[name="couverts"]').value, recap: (document.querySelector('[data-resa-recap]') || {}).textContent || '' }));
    if (resa.couverts !== '4') R.echec('reservation', `couverts ${resa.couverts} au lieu de 4 depuis le plan`, { page: '/reserver', taille: '390×844' });
    if (!/table 2/i.test(resa.recap)) R.echec('reservation', 'la table choisie sur le plan n’apparaît pas dans le récapitulatif', { page: '/reserver', taille: '390×844' });

    /* Horaires : un statut est affiché (horaires fournis). */
    await page.goto(BASE + '/infos-pratiques', { waitUntil: 'load' });
    await attendrePret(page);
    const statut = await page.locator('[data-horaires-statut]').textContent();
    if (!/(Ouvert|Fermé|Ferme)/i.test(statut || '')) R.echec('horaires', `statut « ${statut} »`, { page: '/infos-pratiques', taille: '390×844' });

    /* Comptes à rebours : jours restants à l'heure de Paris. */
    await page.goto(BASE + '/les-fetes', { waitUntil: 'load' });
    await attendrePret(page);
    await attendre(2200);
    const jours = await page.evaluate(() => [...document.querySelectorAll('[data-effet="decompte"]')].map((e) => {
      const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
      const [a, m, j] = e.dataset.cible.split('-').map(Number);
      return { attendu: Math.round((Date.UTC(a, m - 1, j) - Date.UTC(+p.year, +p.month - 1, +p.day)) / 86400000), affiche: (e.querySelector('[data-jours]') || {}).textContent };
    }));
    for (const x of jours) if (String(x.attendu) !== String(x.affiche).trim()) R.regarder('decompte', `affiché ${x.affiche}, attendu ${x.attendu}`, { page: '/les-fetes', taille: '390×844' });

    /* v4 : la saison bascule (bouton Été), reste choisie d'une page à l'autre, et le bouton principal change de libellé. */
    await page.goto(BASE + '/', { waitUntil: 'load' });
    await attendrePret(page);
    await page.locator('[data-saison-choix="ete"]').click();
    await attendre(400);
    const ete = await page.evaluate(() => ({ s: document.documentElement.dataset.saison, bouton: document.querySelector('[data-action-principale]')?.innerText.trim() }));
    if (ete.s !== 'ete' || !/terrasse/i.test(ete.bouton || '')) R.echec('saison', `bascule vers l'été : saison ${ete.s}, bouton « ${ete.bouton} »`, { page: '/', taille: '390×844' });
    await page.goto(BASE + '/la-carte', { waitUntil: 'load' });
    await attendrePret(page);
    const garde = await page.evaluate(() => document.documentElement.dataset.saison);
    if (garde !== 'ete') R.echec('saison', `saison non gardée d'une page à l'autre (${garde})`, { page: '/la-carte', taille: '390×844' });
    await page.evaluate(() => { try { localStorage.removeItem('jh-saison'); } catch {} });
    /* v4 : la table qui s'agrandit (120 invités : les jardins et la pergola, lien prérempli). */
    await page.goto(BASE + '/', { waitUntil: 'load' });
    await attendrePret(page);
    await page.locator('[data-palier="3"]').click();
    await attendre(300);
    const rec = await page.evaluate(() => ({ espace: [...document.querySelectorAll('[data-espace]')].find((e) => !e.hidden)?.textContent, lien: document.querySelector('[data-lien-reception]')?.getAttribute('href') }));
    if (!/pergola/i.test(rec.espace || '') || !/invites=120/.test(rec.lien || '')) R.echec('recevoir', `120 invités : « ${rec.espace} », lien ${rec.lien}`, { page: '/', taille: '390×844' });
  } finally { await ctx.close(); }
}
