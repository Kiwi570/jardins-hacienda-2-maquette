/* La recette dans le navigateur (v7.9.0) : la chaîne partagée, jouée par de vrais écrans sur une vraie base PostgreSQL.
   Quatre navigateurs qui ne partagent rien (ni stockage, ni cookie) : un client sur le site, l'accueil sur ordinateur,
   la direction sur téléphone, un compte « édition ». Chaque point vérifié est dit ; un écart est un ÉCHEC.
   Lancer : node tests/recette-navigateur.mjs [dossier des captures]    (Playwright doit être installé sur la machine) */
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { pile } from './pile.mjs';
import { MOTS } from './outillage.mjs';

const require = createRequire(process.env.JH_PLAYWRIGHT || '/opt/npm-tools/node_modules/');
const { chromium } = require('playwright');
const captures = process.argv[2] || ''; if (captures) mkdirSync(captures, { recursive: true });
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));
const resultats = []; let echecs = 0;
const verifier = (quoi, ok, detail = '') => { resultats.push({ quoi, ok: !!ok, detail }); if (!ok) echecs++; console.log(`${ok ? 'ok   ' : 'ÉCHEC'} ${quoi}${ok || !detail ? '' : ` — ${detail}`}`); };
/* JH_FONCTION=chemin/vers/api/index.mjs : la même recette, l'API étant servie par la fonction hébergée construite. */
const P = await pile({ port: 4791, fonction: process.env.JH_FONCTION || '' }), BASE = P.adresse, nav = await chromium.launch();
const ecran = async (w, h, tactile = false) => { const c = await nav.newContext({ viewport: { width: w, height: h }, hasTouch: tactile, isMobile: tactile, locale: 'fr-FR', timezoneId: 'Europe/Paris', reducedMotion: 'reduce' }); const p = await c.newPage(); p.erreurs = []; p.on('pageerror', (e) => p.erreurs.push(e.message)); return p; };
const pret = async (p) => { await attendre(900); await p.mouse.click(5, 5).catch(() => {}); await p.keyboard.press('Escape').catch(() => {}); await attendre(1500); };
const iso = (k) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date(Date.now() + k * 864e5));
const vendredi = Array.from({ length: 14 }, (_, k) => iso(k + 2)).find((x) => new Date(x + 'T12:00:00Z').getUTCDay() === 5);
const api = (p, chemin, o = {}) => p.evaluate(async ([u, o]) => { const r = await fetch(u, { method: o.methode || 'GET', headers: o.corps ? { 'content-type': 'application/json' } : {}, body: o.corps ? JSON.stringify(o.corps) : undefined }); return { statut: r.status, corps: await r.json().catch(() => null) }; }, [`/api${chemin}`, o]);
const texte = async (p, sel) => (await p.locator(sel).first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
const toast = (p) => texte(p, '[data-esp-toast-texte]');
const photo = async (p, nom) => { if (captures) await p.screenshot({ path: `${captures}/${nom}.png` }); };

/** Le client, sur le site : une demande de table pour vendredi soir. */
async function demander(p, { prenom, nom, tel, envoyer = true }) {
  await p.goto('about:blank'); /* la même adresse avec une ancre ne recharge pas la page : on repart d'une page vide */
  await p.goto(`${BASE}/reserver?date=${vendredi}&service=soir#formulaire`, { waitUntil: 'load' }); await pret(p);
  if (await p.locator('.resa__panne').count()) return { panne: await texte(p, '.resa__panne') };
  await p.locator('input[name="heure"]:not(:disabled)').first().check({ force: true }); await attendre(200);
  for (let i = 0; i < 4 && await p.locator('[data-etape-suivante]').isVisible(); i++) { await p.locator('[data-etape-suivante]').click(); await attendre(450); }
  await p.fill('[name="prenom"]', prenom); await p.fill('[name="nom"]', nom); await p.fill('[name="telephone"]', tel);
  await p.locator('[data-resa-form] button[type="submit"]').click(); await attendre(600);
  if (envoyer) { await p.locator('[data-resa-confirmer]').click(); await attendre(1500); }
  return { recu: await texte(p, '[data-resa-recap]') };
}
async function connecter(p, role) {
  await p.goto(`${BASE}/espace`, { waitUntil: 'load' }); await pret(p);
  await p.fill('#esp-id', `${role}@essai.test`); await p.fill('#esp-mdp', MOTS[role]); await p.locator('[data-esp-connexion] button[type="submit"]').click(); await attendre(1800);
  return p.evaluate(() => document.documentElement.classList.contains('esp-dedans'));
}
/* v7.10.0 : au téléphone, Agenda, Offres, Clients et Site sont derrière « Plus ». */
const vue = async (p, v) => { if (!(await p.locator(`[data-esp-vue="${v}"]:visible`).count())) { await p.locator('[data-esp-plusnav-bouton]').click(); await attendre(250); } await p.locator(`[data-esp-vue="${v}"]:visible`).first().click(); await attendre(500); };
/** L'onglet Service du vendredi soir, dans Réservations. */
async function serviceDuVendredi(p) {
  await vue(p, 'resas'); await p.locator('[role="tab"][data-onglets-resas][data-onglet="agenda"]').click(); await attendre(300);
  for (let i = 0; i < 4 && !(await p.locator(`[data-jour="${vendredi}"]`).count()); i++) { await p.locator('[data-semaine="7"]').first().click(); await attendre(300); }
  await p.locator(`[data-jour="${vendredi}"]`).first().click(); await attendre(300);
  await p.locator('[role="tab"][data-onglets-resas][data-onglet="service"]').click(); await attendre(300);
  const soir = p.locator('[data-service-vu="soir"]'); if (await soir.count()) { await soir.first().click(); await attendre(300); }
}
/* Seulement ce qui est à l'écran : une rubrique qui n'est pas ouverte n'est pas redessinée, elle le sera à son ouverture. */
const ligne = (p, nom) => p.locator('[data-resa]:visible', { hasText: nom }).first();
const dit = async (p, nom) => (await ligne(p, nom).innerText({ timeout: 3000 }).catch(() => '')).replace(/\s+/g, ' ').trim();
const suivi = () => attendre(6500); /* le temps qu'un autre appareil relise ce qui a changé (toutes les 5 s) */

try {
  /* ---------- 1. Le client envoie sa demande ---------- */
  const client = await ecran(1280, 860);
  const d1 = await demander(client, { prenom: 'Claire', nom: 'Essai', tel: '06 12 34 56 78' });
  verifier('site : la demande est envoyée, avec la référence du serveur', /Votre demande est envoyée/i.test(d1.recu) && /Référence R-\d{6}-[A-Z0-9]+/.test(d1.recu), d1.recu.slice(0, 160));
  verifier('site : c\'est une demande, pas une table garantie', /Demande reçue/i.test(d1.recu) && !/table est réservée/i.test(d1.recu));
  verifier('site : rien n\'est gardé dans le navigateur du client', await client.evaluate(() => !Object.keys(localStorage).some((k) => /resa|demande/i.test(k))));
  await photo(client, '1-site-demande-envoyee');
  const lecturePublique = await api(client, `/reservations?du=${vendredi}&au=${vendredi}`), journalPublic = await api(client, '/journal'), suiviPublic = await api(client, '/suivi?depuis=0');
  verifier('public : aucune lecture des réservations, du suivi ni du journal', lecturePublique.statut === 401 && suiviPublic.statut === 401 && journalPublic.statut === 401, `${lecturePublique.statut}/${suiviPublic.statut}/${journalPublic.statut}`);
  const reglagesPublics = JSON.stringify((await api(client, '/public/reglages')).corps);
  verifier('public : les règles publiques ne contiennent ni nom ni téléphone', !/Essai|06 ?12/.test(reglagesPublics));

  /* ---------- 2. Deux appareils de l'équipe, qui ne partagent rien ---------- */
  const A = await ecran(1440, 900), B = await ecran(390, 844, true);
  await A.goto(`${BASE}/espace`, { waitUntil: 'load' }); await pret(A);
  verifier('espace : rien n\'est montré avant la connexion', !(await A.evaluate(() => document.documentElement.classList.contains('esp-dedans'))) && !/Essai/.test(await A.evaluate(() => document.body.innerText)));
  await A.fill('#esp-id', 'accueil@essai.test'); await A.fill('#esp-mdp', 'pas-le-bon'); await A.locator('[data-esp-connexion] button[type="submit"]').click(); await attendre(900);
  verifier('connexion : un mauvais mot de passe est refusé, sans dire lequel des deux est faux', /Identifiant ou mot de passe incorrect/.test(await texte(A, '[data-esp-connexion-message]')));
  await photo(A, '2-connexion-refusee');
  verifier('connexion : accueil sur ordinateur', await connecter(A, 'accueil'));
  verifier('connexion : direction sur téléphone', await connecter(B, 'direction'));
  verifier('session : rien de lisible par un script (ni jeton, ni mot de passe dans le stockage)', await A.evaluate(() => !document.cookie && ![...Object.keys(localStorage), ...Object.keys(sessionStorage)].some((k) => /session|jeton|mdp|resa/i.test(k)) && document.querySelector('#esp-mdp').value === ''));
  verifier('ordinateur : la demande du site est là, à confirmer', /À confirmer/.test(await dit(A, 'Claire Essai')), await dit(A, 'Claire Essai'));
  const fiche = (await api(B, `/reservations?du=${vendredi}&au=${vendredi}`)).corps.reservations.find((r) => r.nom === 'Essai'), ficheLue = await api(B, `/clients/${fiche.clientId}`), fichePublique = await api(client, `/clients/${fiche.clientId}`);
  verifier('public : la fiche du client, lisible par l\'équipe, est refusée au public', ficheLue.statut === 200 && fichePublique.statut === 401, `${ficheLue.statut}/${fichePublique.statut}`);
  await vue(B, 'demandes');
  verifier('téléphone : la même demande est là', /À confirmer/.test(await dit(B, 'Claire Essai')));
  verifier('espace : aucune réservation ni demande d\'exemple en mode connecté', !/Exemple/.test(await A.evaluate(() => document.querySelector('[data-esp-app]').innerText)) && !/Exemple/.test(await B.evaluate(() => document.querySelector('[data-esp-app]').innerText)));
  await photo(A, '3-ordinateur-demande-recue'); await photo(B, '3-telephone-demande-recue');

  /* ---------- 3. L'accueil confirme ; la direction le voit sans recharger ---------- */
  await ligne(A, 'Claire Essai').locator('[data-statut="confirmee"]').click(); await attendre(1500);
  const t3 = await toast(A);
  verifier('confirmer : dit « confirmée » après la réponse du serveur, sans promettre de message', /confirmée/i.test(t3) && /Aucun message n'est encore envoyé/.test(t3) && !/simulé/.test(t3), t3);
  verifier('confirmer : l\'état de liaison est visible', /Synchronisé à/.test(await texte(A, '[data-esp-sauve]')));
  await suivi();
  verifier('téléphone : la demande n\'attend plus (vu sans recharger)', !/À confirmer/.test(await dit(B, 'Claire Essai')), await dit(B, 'Claire Essai'));
  await serviceDuVendredi(B);
  verifier('téléphone : Claire Essai est confirmée au service du vendredi soir', /Attendu|Confirmée/i.test(await dit(B, 'Claire Essai')), await dit(B, 'Claire Essai')); /* v7.11.0 : une réservation confirmée à venir se lit « Attendu » dans le service */
  await photo(B, '4-telephone-confirmee');

  /* ---------- 4. La direction ajoute une réservation au téléphone ; l'accueil la voit ---------- */
  await B.locator('[role="tab"][data-onglets-resas][data-onglet="agenda"]').click(); await attendre(300);
  await B.locator('[data-ajouter]').first().click(); await attendre(300);
  await B.fill('#aj-nom', 'Paul Combiné'); await B.fill('#aj-tel', '06 98 76 54 32'); await B.selectOption('#aj-sv', 'soir'); await attendre(150);
  await B.selectOption('#aj-h', '20:00'); await B.fill('#aj-c', '3'); await B.fill('#aj-d', 'Chaise haute');
  await B.locator('[data-form-ajout] button[type="submit"]').click(); await attendre(1600);
  verifier('ajout au téléphone : enregistré par le serveur, formulaire refermé', /Réservation ajoutée/.test(await toast(B)) && !(await B.locator('[data-form-ajout]').count()), await toast(B));
  await serviceDuVendredi(A); await suivi();
  verifier('ordinateur : la réservation prise au téléphone est là', /3 couverts/.test(await dit(A, 'Paul Combiné')) && /Chaise haute/.test(await dit(A, 'Paul Combiné')), await dit(A, 'Paul Combiné'));

  /* ---------- 5. L'accueil modifie ; la direction le voit ---------- */
  await ligne(A, 'Paul Combiné').locator('[data-modifier-resa]').click(); await attendre(300);
  await A.fill('[data-form-resa] [name="couverts"]', '4'); await A.locator('[data-form-resa] button[type="submit"]').click(); await attendre(1600);
  verifier('modifier : enregistré par le serveur', /modifiée/i.test(await toast(A)) && /4 couverts/.test(await dit(A, 'Paul Combiné')), await toast(A));
  await serviceDuVendredi(B); await suivi();
  verifier('téléphone : la modification est visible (4 couverts)', /4 couverts/.test(await dit(B, 'Paul Combiné')));

  /* ---------- 6. La direction annule ; l'accueil remet ---------- */
  await ligne(B, 'Claire Essai').locator('[data-statut="annulee"]').click(); await attendre(1600);
  verifier('annuler : enregistré par le serveur', /annulée/i.test(await toast(B)), await toast(B));
  await suivi();
  verifier('ordinateur : l\'annulation est visible', /Annulée/i.test(await dit(A, 'Claire Essai')), await dit(A, 'Claire Essai'));
  await ligne(A, 'Claire Essai').locator('[data-statut="confirmee"]').click(); await attendre(1600);
  verifier('remettre : la réservation annulée est remise après une nouvelle vérification du serveur', /remise à/i.test(await toast(A)) && /Attendu|Confirmée/i.test(await dit(A, 'Claire Essai')), await toast(A));

  /* ---------- 7. Le placement en salle ---------- */
  await A.locator('[role="tab"][data-onglets-resas][data-onglet="salle"]').click(); await attendre(500);
  const placer = A.locator('[data-placer-tout]');
  if (await placer.count()) { await placer.click(); await attendre(2500); }
  const apresPlacement = (await api(A, `/reservations?du=${vendredi}&au=${vendredi}`)).corps.reservations.filter((r) => r.statut === 'confirmee');
  verifier('salle : « Placer tout seul » place les réservations confirmées, sur le serveur', apresPlacement.length === 2 && apresPlacement.every((r) => r.table && r.placement === 'placement') && new Set(apresPlacement.map((r) => r.table)).size === 2, JSON.stringify(apresPlacement.map((r) => [r.nom, r.table, r.placement])));
  await photo(A, '5-ordinateur-salle-placee');
  await B.locator('[role="tab"][data-onglets-resas][data-onglet="service"]').click(); await suivi();
  const tablePaul = apresPlacement.find((r) => r.nom === 'Combiné')?.table;
  verifier('téléphone : la table choisie est visible', new RegExp(`table ${tablePaul}\\b`).test(await dit(B, 'Paul Combiné')), await dit(B, 'Paul Combiné'));

  /* ---------- 8. Deux appareils sur la même réservation : le second est prévenu, rien n'est écrasé ---------- */
  await A.locator('[role="tab"][data-onglets-resas][data-onglet="service"]').click(); await attendre(300);
  /* v7.11.0 : ce que le serveur ne connaît pas encore est masqué, et ce qui reste sur l'appareil est dit. */
  const masques = await A.locator('#onglet-resas-attente, [data-passage], [data-rappels], [data-lien-venue], [data-attente-rappel]').count();
  verifier('v7.11.0 : liste d\'attente, clients sans réservation, rappels et page du client sont masqués en mode connecté', masques === 0, `${masques} élément(s) visibles`);
  verifier('v7.11.0 : la portée des installations et de l\'état des tables est dite', /restent notés sur cet appareil/.test(await texte(A, '.esp-portee')), await texte(A, '.esp-portee'));
  await A.locator('[role="tab"][data-onglets-resas][data-onglet="salle"]').click(); await attendre(300);
  const horsServeur = await A.locator('[data-assembler], [data-exemple-ete]').count();
  verifier('v7.11.0 : ni tables rapprochées ni exemple d\'été en mode connecté', horsServeur === 0, `${horsServeur} élément(s) visibles`);
  /* v7.11.1 : les scénarios de démonstration appartiennent à la démonstration. En mode connecté : pas de lanceur, et
     une adresse « ?demo= » n'ouvre aucun scénario, n'écrit rien à part et laisse l'espace partagé tel quel. */
  const lanceurs = await A.locator('[data-demo-lancer]:visible').count();
  const Sc = await A.context().newPage(); await Sc.goto(`${BASE}/espace?demo=service`, { waitUntil: 'load' }); await pret(Sc); await attendre(1200);
  const horsScenario = await Sc.evaluate(() => ({ scene: !!document.querySelector('[data-esp-scene][data-scenario]'), cles: Object.keys(localStorage).filter((k) => k.startsWith('jh-demo:')).length, session: sessionStorage.getItem('jh-demo') || '', fictifs: document.querySelectorAll('[data-resa^="sc1-"]').length }));
  await Sc.close();
  verifier('v7.11.1 : pas de « Lancer une démonstration » en mode connecté, et « ?demo= » n\'ouvre aucun scénario', lanceurs === 0 && !horsScenario.scene && !horsScenario.cles && !horsScenario.session && !horsScenario.fictifs, JSON.stringify({ lanceurs, ...horsScenario }));
  /* v7.12.0 : les dossiers de réception ne sont pas partagés. En mode connecté : le suivi le dit et ne propose rien,
     aucune option locale ne retient de table, et la page « Votre réception » dit qu'elle n'est pas reliée. Même un
     dossier fictif resté dans le navigateur (laissé par la démonstration) n'y change rien. */
  await A.evaluate(() => { const avant = localStorage.getItem('jh-espace:v1'); localStorage.setItem('essai-avant', avant ?? '∅'); let base = {}; try { base = JSON.parse(avant || '{}') || {}; } catch { /* rien */ } localStorage.setItem('jh-espace:v1', JSON.stringify({ ...base, receptions: { dossiers: { 'rec-fantome': { id: 'rec-fantome', demande: 'fantome', client: { nom: 'Fantôme Local', telephone: '0600000000' }, retenue: { etat: 'ferme', debut: '2020-01-01T00:00', fin: '2099-01-01T00:00', salle: true, tables: ['1', '2', '3', '4', '5', '6', '7', '8', '9'], espaces: ['restaurant'] } } } } })); });
  /* Dans un second onglet du même navigateur (même session, même stockage) : l'écran de l'accueil n'est pas dérangé. */
  const Rc = await A.context().newPage(); await Rc.goto(`${BASE}/espace`, { waitUntil: 'load' }); await pret(Rc);
  await vue(Rc, 'demandes'); await Rc.locator('[data-filtre-demandes="reception"]').click(); await attendre(400);
  const recConnecte = await Rc.evaluate(() => ({ avis: document.querySelector('[data-vue="demandes"]')?.innerText.replace(/\s+/g, ' ') || '', actifs: document.querySelectorAll('[data-rec-creer], [data-rec-carte], [data-rec-ouvrir], [data-rec-panneau], [data-rec-notice], [data-table-reception]').length }));
  verifier('v7.12.0 : le suivi des réceptions dit que les dossiers ne sont pas partagés, et ne propose aucune action', /Les dossiers de réception ne sont pas partagés/.test(recConnecte.avis) && recConnecte.actifs === 0 && !/Fantôme Local/.test(recConnecte.avis), JSON.stringify(recConnecte).slice(0, 300));
  await vue(Rc, 'resas'); await Rc.locator('[role="tab"][data-onglets-resas][data-onglet="salle"]').click(); await attendre(400);
  const salleConnecte = await Rc.evaluate(() => ({ retenues: [...document.querySelectorAll('.esp-table')].filter((t) => /réception/i.test(t.getAttribute('aria-label') || '')).length, notices: document.querySelectorAll('[data-rec-notice], [data-table-reception]').length }));
  verifier('v7.12.0 : un dossier resté dans le navigateur ne retient aucune table du plan partagé', salleConnecte.retenues === 0 && salleConnecte.notices === 0, JSON.stringify(salleConnecte));
  const Vr = await A.context().newPage(); await Vr.goto(`${BASE}/votre-reception?d=rec-fantome&c=0000`, { waitUntil: 'load' }); await attendre(1200);
  const vrTexte = await texte(Vr, '[data-reception-client]'); const vrOutils = await Vr.locator('[data-reception-accorder], [data-reception-outil], [data-reception-form]').count();
  const Rs = await A.context().newPage(); await Rs.goto(`${BASE}/reserver`, { waitUntil: 'load' }); await attendre(1500);
  const resaPrive = /accueille une réception/.test(await texte(Rs, 'main'));
  /* v7.13.0 : les offres restent dans ce navigateur ; elles ne touchent ni les réservations ni le planning partagés, et aucun tarif d'exemple n'entre dans le catalogue. */
  const avantOffres = JSON.stringify(await api(A, `/reservations?du=${vendredi}&au=${vendredi}`));
  await vue(Rc, 'carte'); await Rc.locator('#onglet-carte-catalogue').click(); await attendre(400);
  const catC = await Rc.evaluate(() => ({ exemples: document.querySelectorAll('[data-offre-exemple]').length, types: [...new Set([...document.querySelectorAll('[data-offre]')].map((x) => x.dataset.offreType))].sort().join() }));
  verifier('v7.13.0 : aucune offre d\'exemple dans le catalogue du site connecté', catC.exemples === 0 && !/formule|prestation/.test(catC.types) && /plat/.test(catC.types), JSON.stringify(catC));
  /* v7.13.1 : les cartes cadeaux (montants de la page Offrir) sont dans le catalogue ; l'annonce se prépare sans s'afficher. */
  const cadeauxC = await Rc.locator('[data-offre][data-offre-type="cadeau"]').count();
  await vue(Rc, 'site'); await Rc.locator('#onglet-horaires').click(); await attendre(300); await Rc.locator('#an-texte').fill('Annonce de recette'); await attendre(1300); await Rc.locator('[data-annonce-active]').click(); await attendre(500);
  const zoneC = await texte(Rc, '[data-pub-zone="annonce"]'), Pa = await A.context().newPage(); await Pa.goto(`${BASE}/la-carte`, { waitUntil: 'load' }); await attendre(1500); const annonceC = await Pa.locator('.annonce-site').count(); await Pa.close();
  verifier('v7.13.1 : cartes cadeaux au catalogue ; une annonce préparée ne s\'affiche pas sur le site avant sa publication', cadeauxC === 5 && /En préparation/.test(zoneC) && annonceC === 0, `${cadeauxC} cartes | ${zoneC.slice(0, 80)} | annonce sur le site : ${annonceC}`);
  await Rc.evaluate(() => { const d = JSON.parse(localStorage.getItem('jh-espace:v1') || '{}'); delete d.annonce; delete d.publie; localStorage.setItem('jh-espace:v1', JSON.stringify(d)); });
  await Rc.reload({ waitUntil: 'load' }); await pret(Rc); await vue(Rc, 'carte'); await Rc.locator('#onglet-carte-catalogue').click(); await attendre(400);
  await Rc.locator('[data-offre-nouvelle]').first().click(); await attendre(400); await Rc.locator('#of-nom').fill('Cocktail de recette'); await Rc.locator('#of-prix').fill('20'); await Rc.locator('[data-form-offre] button[type="submit"]').click(); await attendre(500);
  await Rc.locator('[data-pub-ouvrir]').first().click(); await attendre(300);
  const resumeC = await texte(Rc, '[data-pub-resume]'); await Rc.locator('[data-pub-confirmer]').click(); await attendre(600);
  const publieC = await Rc.evaluate(() => JSON.parse(localStorage.getItem('jh-espace:v1') || '{}').publie?.n || 0);
  verifier('v7.13.0 : publier une offre est dit local à ce navigateur, et ne change rien aux réservations partagées', /pas encore partagé entre vos appareils/.test(resumeC) && publieC === 1 && JSON.stringify(await api(A, `/reservations?du=${vendredi}&au=${vendredi}`)) === avantOffres, `${resumeC.slice(0, 140)} | n° ${publieC}`);
  await Rc.evaluate(() => { const d = JSON.parse(localStorage.getItem('jh-espace:v1') || '{}'); delete d.offres; delete d.publie; localStorage.setItem('jh-espace:v1', JSON.stringify(d)); });
  await Vr.close(); await Rs.close(); await Rc.close();
  verifier('v7.12.0 : « Votre réception » dit qu\'elle n\'est pas reliée et ne propose ni accord ni demande', /n'est pas reliée au restaurant/.test(vrTexte) && vrOutils === 0 && !/Fantôme/.test(vrTexte), vrTexte.slice(0, 240));
  verifier('v7.12.0 : la page Réserver n\'annonce aucune réception d\'après un dossier local', !resaPrive);
  await A.evaluate(() => { const avant = localStorage.getItem('essai-avant'); if (avant === '∅' || avant == null) localStorage.removeItem('jh-espace:v1'); else localStorage.setItem('jh-espace:v1', avant); localStorage.removeItem('essai-avant'); });
  await A.locator('[role="tab"][data-onglets-resas][data-onglet="service"]').click(); await attendre(300);
  await A.route('**/api/suivi**', (r) => r.abort()); /* l'ordinateur ne reçoit plus les nouvelles : son écran vieillit */
  await ligne(B, 'Paul Combiné').locator('[data-modifier-resa]').click(); await attendre(300);
  await B.fill('[data-form-resa] [name="couverts"]', '5'); await B.locator('[data-form-resa] button[type="submit"]').click(); await attendre(1600);
  await ligne(A, 'Paul Combiné').locator('[data-modifier-resa]').click(); await attendre(300);
  await A.fill('[data-form-resa] [name="couverts"]', '2'); await A.locator('[data-form-resa] button[type="submit"]').click(); await attendre(1800);
  const t8 = await toast(A);
  verifier('conflit : la seconde modification est refusée et le dit', /modifiée entre-temps|a changé|entre-temps/i.test(t8) && /refaites votre geste/.test(t8), t8);
  verifier('conflit : l\'écran reprend la version du serveur (5 couverts), rien n\'est écrasé', /5 couverts/.test(await dit(A, 'Paul Combiné')) && (await api(B, `/reservations?du=${vendredi}&au=${vendredi}`)).corps.reservations.find((r) => r.nom === 'Combiné').couverts === 5);
  await photo(A, '6-ordinateur-conflit');
  await A.unroute('**/api/suivi**');

  /* ---------- 9. Dix fois la même création : une seule réservation ---------- */
  const corps = { date: vendredi, service: 'soir', heure: '19:30', couverts: 2, prenom: 'Dix', nom: 'Fois', telephone: '06 55 55 55 55' };
  const dix = await client.evaluate(async (corps) => Promise.all(Array.from({ length: 10 }, () => fetch('/api/public/demandes', { method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': 'recette-dix-fois' }, body: JSON.stringify(corps) }).then((r) => r.json()))), corps);
  const nbDix = (await api(B, `/reservations?du=${vendredi}&au=${vendredi}`)).corps.reservations.filter((r) => r.nom === 'Fois').length;
  verifier('doublons : dix envois de la même demande donnent une seule réservation et une seule référence', nbDix === 1 && new Set(dix.map((x) => x.reference)).size === 1, `${nbDix} réservation(s), ${new Set(dix.map((x) => x.reference)).size} référence(s)`);

  /* ---------- 10. Le serveur tombe : aucune fausse réussite, aucun repli local ---------- */
  await suivi(); await A.locator('[role="tab"][data-onglets-resas][data-onglet="service"]').click(); await attendre(300);
  await P.couper();
  await ligne(A, 'Dix Fois').locator('[data-statut="confirmee"]').click(); await attendre(1800);
  const t10 = await toast(A), s10 = await texte(A, '[data-esp-sauve]');
  verifier('panne : la confirmation n\'est pas annoncée, la raison est dite', /rien n'a été enregistré/.test(t10) && !/confirmée/i.test(t10), t10);
  verifier('panne : l\'écran dit « hors connexion » et la réservation reste à confirmer', /Hors connexion/.test(s10) && /À confirmer|Demande à traiter/i.test(await dit(A, 'Dix Fois')), s10); /* v7.11.0 : une demande se lit « Demande à traiter » dans le service */
  verifier('panne : rien n\'a été mis de côté dans le navigateur pour faire croire à un enregistrement', await A.evaluate(() => ![...Object.keys(localStorage)].some((k) => /resa/i.test(k) && /Fois|confirmee/.test(localStorage.getItem(k) || ''))));
  await photo(A, '7-ordinateur-panne');
  const client2 = await ecran(1280, 860);
  const pendant = await client2.goto(`${BASE}/reserver`, { waitUntil: 'load', timeout: 5000 }).then(() => 'servi', () => 'injoignable');
  verifier('panne : le site entier ne répond plus sur le serveur de recette (rien n\'est simulé)', pendant === 'injoignable');
  await P.reprendre();
  /* Le site répond, mais l'API est coupée pour ce client : la page dit que la réservation en ligne ne répond pas. */
  await client2.route('**/api/public/reglages', (r) => r.abort());
  const sans = await demander(client2, { prenom: 'Marc', nom: 'Panne', tel: '06 44 44 44 44' });
  verifier('panne côté site : sans le serveur, la page le dit et ne propose aucun formulaire simulé', /ne répond pas pour le moment/.test(sans.panne || ''), JSON.stringify(sans).slice(0, 160));
  await photo(client2, '8-site-sans-serveur');
  await client2.unroute('**/api/public/reglages'); await client2.route('**/api/public/demandes', (r) => r.abort());
  const perdu = await demander(client2, { prenom: 'Marc', nom: 'Panne', tel: '06 44 44 44 44' });
  verifier('panne côté site : un envoi sans réponse n\'est pas dit « envoyé », la saisie est gardée', !/Demande reçue|Référence R-/.test(perdu.recu) && /n'a pas abouti/.test(await texte(client2, '[data-module="reservation-de-table"]')) && await client2.inputValue('[name="nom"]') === 'Panne', perdu.recu.slice(0, 120));
  await client2.unroute('**/api/public/demandes');
  await client2.locator('[data-resa-confirmer]').click(); await attendre(1600);
  verifier('reprise : le même envoi, relancé, aboutit', /Référence R-/.test(await texte(client2, '[data-resa-recap]')));

  /* ---------- 11. Après le redémarrage du serveur : tout est encore là, la session aussi ---------- */
  await A.reload({ waitUntil: 'load' }); await pret(A); await attendre(1200);
  verifier('durable : après l\'arrêt et la relance du serveur, l\'accueil retrouve sa session et ses réservations', await A.evaluate(() => document.documentElement.classList.contains('esp-dedans')));
  await serviceDuVendredi(A);
  const apres = await A.evaluate(() => [...document.querySelectorAll('[data-resa]')].filter((x) => x.offsetParent).map((x) => x.innerText).join(' ').replace(/\s+/g, ' '));
  verifier('durable : Claire Essai, Paul Combiné (5 couverts), Dix Fois et Marc Panne sont là', /Claire Essai/.test(apres) && /Paul Combiné/.test(apres) && /Dix Fois/.test(apres) && /Marc Panne/.test(apres) && /5 couverts/.test(await dit(A, 'Paul Combiné')), apres.slice(0, 200));
  await ligne(A, 'Dix Fois').locator('[data-statut="confirmee"]').click(); await attendre(1600);
  verifier('reprise : la confirmation refusée pendant la panne passe maintenant', /confirmée/i.test(await toast(A)));

  /* ---------- 12. Les droits ---------- */
  const C = await ecran(1280, 860);
  verifier('connexion : compte « édition »', await connecter(C, 'edition'));
  const lectureEdition = await api(C, `/reservations?du=${vendredi}&au=${vendredi}`), clientEdition = await api(C, `/clients/${fiche.clientId}`);
  verifier('édition : aucune réservation ni fiche client, à l\'écran comme par appel direct', lectureEdition.statut === 403 && clientEdition.statut === 403 && !/Essai|Combiné/.test(await C.evaluate(() => document.body.innerText)) && /Accès limité/.test(await texte(C, '[data-esp-sauve]')), `${lectureEdition.statut}/${clientEdition.statut}`);
  await photo(C, '9-edition-acces-limite');
  const idClaire = (await api(B, `/reservations?du=${vendredi}&au=${vendredi}`)).corps.reservations.find((r) => r.nom === 'Essai');
  const ecritEdition = await api(C, `/reservations/${idClaire.id}/statut`, { methode: 'POST', corps: { statut: 'annulee', version: idClaire.version } });
  verifier('édition : un appel direct pour annuler est refusé par le serveur', ecritEdition.statut === 403);
  const journalAccueil = await api(A, '/journal'), journalDirection = await api(B, '/journal');
  verifier('journal : réservé à la direction ; il garde qui a fait quoi', journalAccueil.statut === 403 && journalDirection.statut === 200 && journalDirection.corps.journal.length >= 8, `${journalAccueil.statut}/${journalDirection.statut}/${journalDirection.corps?.journal?.length}`);
  const horairesAccueil = await api(A, '/reglages/equipe', { methode: 'POST', corps: { version: 0, operation: 'semaine', args: { semaine: {} } } });
  verifier('horaires de la semaine : refusés à l\'accueil par le serveur', horairesAccueil.statut === 403);

  /* ---------- 13. Un service dit complet par l'équipe : le site le suit ---------- */
  await vue(B, 'resas'); await B.locator('[role="tab"][data-onglets-resas][data-onglet="agenda"]').click(); await attendre(300);
  const complet = B.locator('[data-complet="soir"]').first();
  if (await complet.count()) { await complet.click(); await attendre(1600); }
  const reglagesApres = (await api(client, '/public/reglages')).corps;
  verifier('complet : la direction dit le vendredi soir complet, le serveur l\'enregistre', !!reglagesApres.equipe?.complets?.[vendredi]?.soir || JSON.stringify(reglagesApres.equipe?.complets || {}).includes(vendredi), JSON.stringify(reglagesApres.equipe?.complets || {}).slice(0, 120));
  const refuse = await client.evaluate(async (corps) => { const r = await fetch('/api/public/demandes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(corps) }); return { statut: r.status, corps: await r.json() }; }, { ...corps, nom: 'Trop Tard', heure: '20:30' });
  verifier('complet : une nouvelle demande du site est refusée par le serveur, avec la raison', refuse.statut === 409 || refuse.statut === 422, `${refuse.statut} ${refuse.corps?.erreur?.message || ''}`);
  await client.goto(`${BASE}/reserver?date=${vendredi}&service=soir#formulaire`, { waitUntil: 'load' }); await pret(client);
  verifier('complet : la page Réserver ne propose plus ce service', await client.evaluate(() => { const s = document.querySelector('input[name="service"][value="soir"]'); return !!s && (s.disabled || !s.checked); }));
  await photo(client, '10-site-service-complet');

  /* ---------- 14. La déconnexion et la session expirée ---------- */
  await A.evaluate(() => document.querySelector('[data-esp-quitter]').click()); await attendre(900);
  const apresSortie = await api(A, `/reservations?du=${vendredi}&au=${vendredi}`);
  verifier('déconnexion : l\'écran de connexion revient, le serveur refuse l\'ancienne session, plus aucun nom à l\'écran', !(await A.evaluate(() => document.documentElement.classList.contains('esp-dedans'))) && apresSortie.statut === 401 && !/Essai|Combiné/.test(await A.evaluate(() => document.querySelector('[data-esp-app]').innerText)));
  await A.reload({ waitUntil: 'load' }); await pret(A);
  verifier('déconnexion : recharger ne rouvre pas l\'espace', !(await A.evaluate(() => document.documentElement.classList.contains('esp-dedans'))));
  await P.base.db.q('delete from sessions');
  await suivi(); await attendre(800); /* à sa prochaine relecture, le téléphone apprend que sa session n'existe plus */
  verifier('session expirée : l\'espace revient à la connexion et le dit', !(await B.evaluate(() => document.documentElement.classList.contains('esp-dedans'))) && /session a expiré/.test(await texte(B, '[data-esp-connexion-message]')), await texte(B, '[data-esp-connexion-message]'));
  await photo(B, '11-telephone-session-expiree');

  for (const [nom, p] of [['site', client], ['ordinateur', A], ['téléphone', B], ['édition', C]]) verifier(`aucune erreur de script : ${nom}`, !p.erreurs.length, p.erreurs.slice(0, 2).join(' | '));
} catch (e) { verifier('la recette est allée au bout', false, e.message.split('\n').slice(0, 4).join(' | ')); }
await nav.close(); await P.arreter();
console.log(`\n${resultats.length} points vérifiés, ${echecs} échec${echecs > 1 ? 's' : ''}.`);
process.exitCode = echecs ? 1 : 0; setTimeout(() => process.exit(), 1500).unref();
