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

    /* v6 : réserver depuis l'accueil (au coin du feu en v7.4) : le service et les couverts arrivent dans la réservation. */
    await page.goto(BASE + '/', { waitUntil: 'load' });
    await attendrePret(page);
    /* v7.4 : le module est au coin du feu ; il arrive après l'ouverture du titre, à la fin de la scène. */
    await page.evaluate(() => { const s = document.getElementById('feu'); if (s) window.scrollTo(0, s.getBoundingClientRect().top + scrollY + s.offsetHeight - innerHeight - 4); });
    await attendre(1500);
    const choisi = await page.evaluate(() => { const r = document.querySelector('[data-mini-resa] [name="service"]:checked'); return r ? { d: r.dataset.date, s: r.value } : null; });
    await page.locator('[data-mini-resa] [data-plus]').click();
    await page.locator('[data-mini-resa] [type="submit"]').click();
    await page.waitForURL(/\/reserver/, { timeout: 8000 }).catch(() => {});
    await attendrePret(page); await attendre(800);
    const arrivee = await page.evaluate(() => ({ url: location.search, couverts: document.querySelector('[data-resa-form] [name="couverts"]')?.value, date: document.querySelector('[data-resa-form] [name="date"]')?.value }));
    if (!/couverts=3/.test(arrivee.url) || arrivee.couverts !== '3') R.echec('mini-resa', `accueil → réserver : ${arrivee.url}, couverts ${arrivee.couverts}`, { page: '/', taille: '390×844' });
    if (choisi && arrivee.date !== choisi.d) R.echec('mini-resa', `date ${arrivee.date} au lieu de ${choisi.d}`, { page: '/', taille: '390×844' });

    /* v6 : la carte se met à l'heure : la bascule change le moment et la photo. */
    await page.goto(BASE + '/la-carte', { waitUntil: 'load' });
    await attendrePret(page);
    const m0 = await page.evaluate(() => document.documentElement.dataset.moment);
    await page.locator('[data-bascule-moment]').click(); await attendre(300);
    const m1 = await page.evaluate(() => document.documentElement.dataset.moment);
    if (!m0 || m0 === m1) R.echec('moment', `bascule déjeuner/dîner : ${m0} → ${m1}`, { page: '/la-carte', taille: '390×844' });

    /* v6 : les fêtes, la saison décide (bouton Cet été). */
    await page.goto(BASE + '/les-fetes', { waitUntil: 'load' });
    await attendrePret(page);
    await page.locator('[data-saison-choix="ete"]').click(); await attendre(300);
    const ete = await page.evaluate(() => ({ s: document.documentElement.dataset.saison, vu: !!document.querySelector('#ete')?.offsetParent }));
    if (ete.s !== 'ete' || !ete.vu) R.echec('saison', `bascule vers l'été : saison ${ete.s}, section été visible ${ete.vu}`, { page: '/les-fetes', taille: '390×844' });

    /* v6 : demande de réception en trois étapes, carton tamponné à l'envoi, pas de double envoi. */
    await page.goto(BASE + '/receptions#demande', { waitUntil: 'load' });
    await attendrePret(page);
    const f = page.locator('[data-demande]');
    /* Aucune occasion cochée d'avance : « Continuer » doit bloquer, puis passer une fois le baptême choisi. */
    await f.locator('[data-etape="1"] [data-suivant]').click(); await attendre(200);
    const bloqueSansOccasion = await page.evaluate(() => document.querySelector('[data-demande] [data-etape="1"]').classList.contains('est-courante'));
    if (!bloqueSansOccasion) R.echec('demande', 'demande de réception : on passe à l’étape 2 sans avoir choisi l’occasion', { page: '/receptions', taille: '390×844' });
    await f.locator('[name="occasion"][data-un="Un baptême"]').check({ force: true }); await attendre(100);
    await f.locator('[data-etape="1"] [data-suivant]').click(); await attendre(200);
    /* Une période suffit quand la date n'est pas fixée. */
    await f.locator('[name="periode"]').selectOption({ index: 2 }); await f.locator('[name="invites"]').fill('40');
    await f.locator('[data-etape="2"] [data-suivant]').click(); await attendre(200);
    await f.locator('[name="prenom"]').fill('Claire'); await f.locator('[name="nom"]').fill('Martin'); await f.locator('[name="telephone"]').fill('06 12 34 56 78');
    await f.locator('[type="submit"]').click(); await attendre(700);
    const dem = await page.evaluate(() => ({ tampon: document.querySelector('[data-invitation]')?.classList.contains('est-tamponnee'), detail: document.querySelector('[data-inv-detail]')?.textContent, msg: !document.querySelector('[data-demande-message]')?.hidden, bloque: document.querySelector('[data-demande] [type="submit"]')?.disabled }));
    if (!dem.tampon || !dem.msg || !/40 invités/.test(dem.detail || '') || !/printemps 2027/i.test(dem.detail || '') || !dem.bloque) R.echec('demande', `demande de réception : tampon ${dem.tampon}, message ${dem.msg}, détail « ${dem.detail} », bouton bloqué ${dem.bloque}`, { page: '/receptions', taille: '390×844' });
  } finally {
    await ctx.close();
  }
}
