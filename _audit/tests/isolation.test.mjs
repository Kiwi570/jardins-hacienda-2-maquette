/* v7.14.1 · Des démonstrations isolées : les saisies temporaires des pages publiques (panier À emporter, brouillon de
   réservation) appartiennent à leur contexte. Le stockage du navigateur est simulé ; chaque « onglet » est une nouvelle
   instance du module espace-stock.js, chargée avec son adresse et sa mémoire de session. */
import test from 'node:test';
import assert from 'node:assert/strict';

function magasin({ refuseEcriture = false, refuseLecture = false } = {}) {
  const m = new Map();
  return { get length() { return m.size; }, key: (i) => [...m.keys()][i] ?? null,
    getItem(k) { if (refuseLecture) throw new Error('lecture refusée'); return m.has(k) ? m.get(k) : null; },
    setItem(k, v) { if (refuseEcriture) throw new Error('écriture refusée'); m.set(k, String(v)); },
    removeItem(k) { if (refuseLecture) throw new Error('lecture refusée'); m.delete(k); }, clear: () => m.clear(), dump: () => Object.fromEntries(m) };
}
const LOCAL = magasin(); let numero = 0;
globalThis.localStorage = LOCAL; globalThis.document = { querySelector: () => null, addEventListener() {} }; globalThis.addEventListener = () => {}; globalThis.removeEventListener = () => {};
/** Ouvre un « onglet » : une adresse, une mémoire de session, et le module chargé à neuf. */
async function onglet(recherche = '', session = magasin()) {
  globalThis.location = { search: recherche, origin: 'http://test', href: `http://test/a-emporter${recherche}`, pathname: '/a-emporter' }; globalThis.sessionStorage = session;
  const M = await import(`../../assets/js/espace-stock.js?onglet=${++numero}`); return { M, session };
}
const DEPART = { etat: { annonce: { active: false, texte: 'départ' } }, horloge: { iso: '2026-12-02', min: 600 } };
const PANIER_NORMAL = '[{"id":"tataki-boeuf","qte":2},{"id":"tourte-escargots","qte":1}]';

test('contexte normal : la clé historique, la valeur telle quelle (les paniers existants sont retrouvés à l\'identique)', async () => {
  LOCAL.clear(); LOCAL.setItem('hacienda-emporter', PANIER_NORMAL);
  const { M, session } = await onglet('');
  assert.equal(M.CONTEXTE, ''); assert.equal(M.etatDuContexte(), 'normal');
  const panier = M.temporaire('hacienda-emporter'), brouillon = M.temporaire('resa-brouillon:/reserver', { session: true });
  assert.equal(panier.cle, 'hacienda-emporter'); assert.equal(brouillon.cle, 'resa-brouillon:/reserver'); assert.equal(panier.persistant, true);
  assert.deepEqual(panier.lire(), JSON.parse(PANIER_NORMAL), 'le panier déjà là est relu sans conversion');
  assert.equal(panier.ecrire([{ id: 'gravlax', qte: 1 }]), true); assert.equal(LOCAL.getItem('hacienda-emporter'), '[{"id":"gravlax","qte":1}]', 'même format qu\'avant : un tableau');
  assert.equal(brouillon.ecrire({ message: 'près de la cheminée' }), true); assert.equal(session.getItem('resa-brouillon:/reserver'), '{"message":"près de la cheminée"}');
  assert.equal(M.scenarioRecommence(), false, 'hors démonstration, rien n\'est jamais « recommencé »');
  assert.equal(brouillon.effacer(), true); assert.equal(session.getItem('resa-brouillon:/reserver'), null); assert.equal(brouillon.lire(), null);
});

test('scénario : ses propres clés ; le panier normal n\'est ni lu, ni copié, ni effacé ; deux scénarios ne partagent rien', async () => {
  LOCAL.clear(); LOCAL.setItem('hacienda-emporter', PANIER_NORMAL);
  const sess = magasin(); sess.setItem('resa-brouillon:/reserver', '{"message":"brouillon habituel"}');
  const a = await onglet('?demo=commande', sess);
  assert.equal(a.M.CONTEXTE, 'commande'); assert.equal(a.M.etatDuContexte(), 'demo'); assert.equal(a.M.semer(DEPART), true);
  const panier = a.M.temporaire('hacienda-emporter'), brouillon = a.M.temporaire('resa-brouillon:/reserver', { session: true });
  assert.equal(panier.cle, 'jh-demo:commande:tmp:hacienda-emporter'); assert.equal(panier.lire(), null, 'la démonstration ne se remplit pas du panier normal'); assert.equal(brouillon.lire(), null, 'ni du brouillon habituel');
  assert.equal(panier.ecrire([{ id: 'escargots', qte: 2 }]), true); assert.equal(brouillon.ecrire({ message: 'brouillon de démonstration' }), true);
  assert.equal(panier.ecrire([]), true, 'le vidage après l\'envoi'); assert.deepEqual(panier.lire(), []); panier.ecrire([{ id: 'foie-gras', qte: 1 }]);
  assert.equal(LOCAL.getItem('hacienda-emporter'), PANIER_NORMAL, 'le panier normal est resté identique'); assert.equal(sess.getItem('resa-brouillon:/reserver'), '{"message":"brouillon habituel"}', 'le brouillon habituel aussi');
  /* Un onglet de la même session passe ensuite dans le scénario 8 : il a son panier à lui. */
  const b = await onglet('?demo=cadeau', sess); b.M.semer(DEPART);
  const panier8 = b.M.temporaire('hacienda-emporter'); assert.equal(panier8.lire(), null); panier8.ecrire([{ id: 'gravlax', qte: 1 }]);
  assert.deepEqual(a.M.temporaire('hacienda-emporter').lire(), [{ id: 'foie-gras', qte: 1 }]); assert.deepEqual(panier8.lire(), [{ id: 'gravlax', qte: 1 }]);
  /* Un second onglet du même scénario (même époque) relit le même panier. */
  const sess2 = magasin(); sess2.setItem('jh-demo', 'commande'); const a2 = await onglet('', sess2);
  assert.equal(a2.M.CONTEXTE, 'commande'); assert.deepEqual(a2.M.temporaire('hacienda-emporter').lire(), [{ id: 'foie-gras', qte: 1 }]);
  /* Quitter (« ?demo= ») : on retrouve les données normales, intactes. */
  const n = await onglet('?demo=', sess);
  assert.equal(n.M.CONTEXTE, ''); assert.deepEqual(n.M.temporaire('hacienda-emporter').lire(), JSON.parse(PANIER_NORMAL)); assert.deepEqual(n.M.temporaire('resa-brouillon:/reserver', { session: true }).lire(), { message: 'brouillon habituel' });
});

test('« Recommencer » : seul ce scénario est remis à zéro ; une ancienne page ne réinjecte rien et n\'envoie rien', async () => {
  LOCAL.clear(); LOCAL.setItem('hacienda-emporter', PANIER_NORMAL); LOCAL.setItem('jh-espace:v1', '{"annonce":{"active":false,"texte":"habituel"},"_schema":2}');
  const sA = magasin(), espace = await onglet('?demo=commande', sA); espace.M.semer(DEPART);
  const sB = magasin(); sB.setItem('jh-demo', 'commande'); const vieille = await onglet('', sB);   /* une page À emporter du scénario, ouverte avant */
  const sC = magasin(); sC.setItem('jh-demo', 'cadeau'); const huit = await onglet('', sC); huit.M.semer(DEPART); huit.M.temporaire('hacienda-emporter').ecrire([{ id: 'gravlax', qte: 1 }]);
  const panierVieux = vieille.M.temporaire('hacienda-emporter'), brouillonVieux = vieille.M.temporaire('resa-brouillon:/reserver', { session: true });
  panierVieux.ecrire([{ id: 'escargots', qte: 4 }]); brouillonVieux.ecrire({ message: 'ancien brouillon' });
  assert.equal(vieille.M.ajouterDemandeSite({ genre: 'traiteur', id: 'T-avant' }), true); assert.equal(vieille.M.scenarioRecommence(), false);
  /* L'espace recommence le scénario : ses données et ses saisies temporaires sont effacées, puis un nouveau départ est semé. */
  globalThis.sessionStorage = sA; assert.equal(espace.M.viderContexte(), true);
  assert.equal(LOCAL.getItem('jh-demo:commande:tmp:hacienda-emporter'), null); assert.equal(LOCAL.getItem('jh-demo:commande:espace-demandes:v1'), null);
  assert.ok(LOCAL.getItem('jh-demo:cadeau:tmp:hacienda-emporter').includes('gravlax'), 'le panier de l\'autre scénario n\'est pas touché');
  assert.equal(LOCAL.getItem('hacienda-emporter'), PANIER_NORMAL); assert.ok(LOCAL.getItem('jh-espace:v1').includes('habituel'), 'les données habituelles non plus');
  const neuf = await onglet('', sA); neuf.M.semer(DEPART); assert.equal(neuf.M.scenarioRecommence(), false, 'la page qui sème appartient au nouveau départ');
  /* L'ancienne page reconnaît la remise à zéro. */
  globalThis.sessionStorage = sB;
  assert.equal(vieille.M.scenarioRecommence(), true);
  assert.equal(panierVieux.ecrire([{ id: 'escargots', qte: 4 }]), false, 'son vieux panier n\'est pas réinjecté'); assert.equal(LOCAL.getItem('jh-demo:commande:tmp:hacienda-emporter'), null);
  assert.equal(brouillonVieux.ecrire({ message: 'ancien brouillon' }), false); assert.equal(brouillonVieux.lire(), null, 'son ancien brouillon (autre époque) n\'est plus relu');
  assert.equal(vieille.M.ajouterDemandeSite({ genre: 'traiteur', id: 'T-apres' }), false, 'son ancienne commande ne part pas dans le nouveau départ'); assert.equal(vieille.M.ajouterResaSite({ id: 'R-apres' }), false); assert.equal(vieille.M.noterVenue('x', { reconfirmee: 'x' }), false);
  assert.equal(LOCAL.getItem('jh-demo:commande:espace-demandes:v1'), null); assert.equal(LOCAL.getItem('jh-demo:commande:espace-resas:v1'), null);
  assert.match(vieille.M.MESSAGE_RECOMMENCE, /recommencée.*rechargez-la.*Rien n'a été envoyé/);
  /* Rechargée, elle repart du nouveau départ, vide. */
  const rechargee = await onglet('', sB); assert.equal(rechargee.M.scenarioRecommence(), false); assert.equal(rechargee.M.temporaire('hacienda-emporter').lire(), null); assert.equal(rechargee.M.temporaire('resa-brouillon:/reserver', { session: true }).lire(), null);
  /* Relancer un scénario depuis le lanceur (hors de son contexte) efface aussi ses saisies temporaires, et elles seules. */
  rechargee.M.temporaire('hacienda-emporter').ecrire([{ id: 'escargots', qte: 1 }]);
  const lanceur = await onglet('?demo=', magasin()); assert.equal(lanceur.M.viderScenario('commande'), true);
  assert.equal(LOCAL.getItem('jh-demo:commande:tmp:hacienda-emporter'), null); assert.ok(LOCAL.getItem('jh-demo:cadeau:tmp:hacienda-emporter')); assert.equal(LOCAL.getItem('hacienda-emporter'), PANIER_NORMAL);
});

test('contexte en panne : jamais de repli silencieux sur les données normales', async () => {
  LOCAL.clear(); LOCAL.setItem('hacienda-emporter', PANIER_NORMAL);
  /* L'onglet ne peut pas retenir la démonstration que son adresse demande : elle vaut pour la page (« fragile »). */
  const f = await onglet('?demo=commande', magasin({ refuseEcriture: true }));
  assert.equal(f.M.CONTEXTE, 'commande'); assert.equal(f.M.etatDuContexte(), 'fragile');
  const pf = f.M.temporaire('hacienda-emporter'); assert.equal(pf.cle, 'jh-demo:commande:tmp:hacienda-emporter'); assert.equal(pf.lire(), null); assert.equal(pf.ecrire([{ id: 'escargots', qte: 1 }]), true);
  assert.equal(LOCAL.getItem('hacienda-emporter'), PANIER_NORMAL); assert.equal(f.M.avecContexte('/offrir#carte'), '/offrir?demo=commande#carte'); assert.equal(f.M.porterContexte(), true);
  /* La mémoire de session est illisible et l'adresse ne dit rien : on ne sait pas → rien n'est lu ni écrit. */
  const i = await onglet('', magasin({ refuseLecture: true }));
  assert.equal(i.M.CONTEXTE, ''); assert.equal(i.M.etatDuContexte(), 'incertain');
  const pi = i.M.temporaire('hacienda-emporter'); assert.equal(pi.persistant, false); assert.equal(pi.lire(), null, 'le panier normal n\'est pas lu');
  assert.equal(pi.ecrire([{ id: 'gravlax', qte: 1 }]), false); assert.deepEqual(pi.lire(), [{ id: 'gravlax', qte: 1 }], 'la saisie reste sur la page'); assert.equal(pi.effacer(), false);
  assert.equal(LOCAL.getItem('hacienda-emporter'), PANIER_NORMAL, 'les données normales n\'ont pas bougé'); assert.equal(i.M.porterContexte(), false);
  /* Mais si l'adresse nomme le scénario, il vaut même sans mémoire de session lisible. */
  const i2 = await onglet('?demo=cadeau', magasin({ refuseLecture: true })); assert.equal(i2.M.CONTEXTE, 'cadeau'); assert.equal(i2.M.etatDuContexte(), 'fragile');
  /* Quitter explicitement reste possible. */
  const q = await onglet('?demo=', magasin({ refuseLecture: true })); assert.equal(q.M.etatDuContexte(), 'normal');
  /* Le navigateur refuse d'écrire (mémoire pleine) : l'écriture le dit, la valeur déjà gardée n'est pas abîmée. */
  const plein = await onglet('', magasin()); const pp = plein.M.temporaire('hacienda-emporter'); const poser = LOCAL.setItem; LOCAL.setItem = () => { throw new Error('plein'); };
  try { assert.equal(pp.ecrire([{ id: 'gravlax', qte: 9 }]), false); } finally { LOCAL.setItem = poser; }
  assert.equal(LOCAL.getItem('hacienda-emporter'), PANIER_NORMAL);
  /* En mode connecté (site d'essai), il n'y a pas de contexte de démonstration, quelle que soit l'adresse. */
  globalThis.document = { querySelector: (s) => (s.includes('jh-api') ? {} : null), addEventListener() {} };
  try { const c = await onglet('?demo=commande', magasin()); assert.equal(c.M.CONTEXTE, ''); assert.equal(c.M.etatDuContexte(), 'normal'); assert.equal(c.M.temporaire('hacienda-emporter').cle, 'hacienda-emporter'); }
  finally { globalThis.document = { querySelector: () => null, addEventListener() {} }; }
});

/* v7.15.0 · Correctif B : la décision de contexte vaut jusqu'au dernier enregistrement. */
test('contexte indéterminable : aucune écriture métier n\'atteint les données habituelles, par aucun chemin', async () => {
  LOCAL.clear(); LOCAL.setItem('hacienda-emporter', PANIER_NORMAL);
  LOCAL.setItem('jh-espace:v1', '{"annonce":{"active":false,"texte":"habituel"},"_schema":2}');
  LOCAL.setItem('jh-espace-demandes:v1', '[{"id":"T-habituelle","genre":"traiteur"}]'); LOCAL.setItem('jh-espace-resas:v1', '[{"id":"w-habituelle"}]'); LOCAL.setItem('jh-espace-venues:v1', '{"w-habituelle":{"reconfirmee":"2026-11-20T10:00:00.000Z"}}');
  const avant = JSON.stringify(LOCAL.dump());
  /* La mémoire de session est illisible, l'adresse ne nomme aucun scénario, la mémoire locale reste accessible. */
  const { M } = await onglet('', magasin({ refuseLecture: true }));
  assert.equal(M.CONTEXTE, ''); assert.equal(M.etatDuContexte(), 'incertain');
  assert.match(M.refusEnregistrement(), /ne permet pas de savoir/); assert.equal(M.refusEnregistrement(), M.MESSAGE_INCERTAIN);
  assert.equal(M.ajouterDemandeSite({ id: 'T-neuve', genre: 'traiteur', lignes: [{ nom: 'Escargots', qte: 2 }], total: 24 }), false, 'une commande à emporter');
  assert.equal(M.ajouterDemandeSite({ genre: 'cadeau', montant: 80 }), false, 'une carte cadeau');
  assert.equal(M.ajouterDemandeSite({ genre: 'reception', invites: '40' }), false, 'une demande de réception');
  assert.equal(M.ajouterResaSite({ id: 'w-neuve', date: '2026-12-04', heure: '20:00', couverts: 2, nom: 'Test' }), false, 'une réservation');
  assert.equal(M.noterVenue('w-habituelle', { annulee: '2026-11-24T10:00:00.000Z' }), false, 'une réponse du client');
  assert.equal(M.ecrire({ annonce: { active: true, texte: 'écrit par erreur' } }), false, 'l\'état de l\'espace');
  assert.equal(M.ecrireDemandesSite([]), false); assert.equal(M.ecrireResasSite([]), false); assert.equal(M.vider(), false, 'ni effacement');
  assert.equal(M.temporaire('hacienda-emporter').ecrire([]), false, 'ni vidage du panier');
  assert.equal(JSON.stringify(LOCAL.dump()), avant, 'toutes les données habituelles sont restées identiques, octet pour octet');
});

test('les cas préservés : démonstration nommée par l\'adresse, usage normal, ancienne page d\'un scénario recommencé', async () => {
  LOCAL.clear(); LOCAL.setItem('jh-espace-demandes:v1', '[{"id":"T-habituelle","genre":"traiteur"}]');
  const habituel = LOCAL.getItem('jh-espace-demandes:v1');
  /* 1. La mémoire de session est illisible mais l'adresse nomme le scénario : la démonstration fonctionne (« fragile »). */
  const f = await onglet('?demo=commande', magasin({ refuseLecture: true }));
  assert.equal(f.M.etatDuContexte(), 'fragile'); assert.equal(f.M.semer(DEPART), true); assert.equal(f.M.refusEnregistrement(), '');
  assert.notEqual(f.M.ajouterDemandeSite({ id: 'T-demo', genre: 'traiteur' }), false); assert.equal(f.M.demandesSite().length, 1);
  assert.equal(LOCAL.getItem('jh-espace-demandes:v1'), habituel, 'la demande est allée dans le scénario, pas dans les données habituelles');
  /* 2. L'usage normal enregistre comme avant. */
  const n = await onglet('');
  assert.equal(n.M.etatDuContexte(), 'normal'); assert.equal(n.M.refusEnregistrement(), ''); assert.notEqual(n.M.ajouterDemandeSite({ id: 'T-normale', genre: 'traiteur' }), false);
  assert.equal(n.M.demandesSite().length, 2);
  /* 3. Une page ouverte avant « Recommencer » reste arrêtée, avec son propre message. */
  const sess = magasin(), a = await onglet('?demo=commande', sess); a.M.semer(DEPART);
  const b = await onglet('', sess); b.M.semer(DEPART);
  assert.equal(a.M.scenarioRecommence(), true); assert.equal(a.M.refusEnregistrement(), a.M.MESSAGE_RECOMMENCE); assert.equal(a.M.ajouterDemandeSite({ id: 'T-ancienne', genre: 'traiteur' }), false);
  assert.equal(b.M.refusEnregistrement(), '');
  /* 4. L'adresse qui quitte la démonstration (« ?demo= ») vaut un usage normal, même si la mémoire de session est illisible. */
  const q = await onglet('?demo=', magasin({ refuseLecture: true })); assert.equal(q.M.etatDuContexte(), 'normal'); assert.equal(q.M.refusEnregistrement(), '');
});

test('v7.16.0 · au démarrage, l\'espace adopte le départ posé entre-temps par un autre onglet ; une page restée ouverte reste périmée', async () => {
  LOCAL.clear(); const sA = magasin(), sB = magasin();
  /* « Recommencer » vient d'effacer la démonstration : la page qui se charge ne lit aucune époque. */
  const neuve = await onglet('?demo=commande', sA); assert.equal(neuve.M.CONTEXTE, 'commande'); assert.equal(neuve.M.horloge(), null);
  /* Avant qu'elle ne sème, une ancienne page, rechargée en même temps, pose le nouveau départ. */
  const autre = await onglet('', sB.getItem('jh-demo') ? sB : (sB.setItem('jh-demo', 'commande'), sB)); assert.equal(autre.M.CONTEXTE, 'commande'); assert.equal(autre.M.semer(DEPART), true);
  /* La page neuve trouve un scénario déjà semé : elle ne sème pas. Sans adoption, elle se croirait périmée dès sa naissance et refuserait tout enregistrement. */
  assert.notEqual(neuve.M.horloge(), null); assert.equal(neuve.M.scenarioRecommence(), true); assert.equal(neuve.M.refusEnregistrement(), neuve.M.MESSAGE_RECOMMENCE);
  neuve.M.adopterEpoque(); assert.equal(neuve.M.scenarioRecommence(), false); assert.equal(neuve.M.refusEnregistrement(), ''); assert.equal(neuve.M.ajouterDemandeSite({ id: 'T-apres', genre: 'traiteur' }), true);
  /* La garde n'est pas affaiblie : un nouveau « Recommencer » ailleurs rend de nouveau cette page périmée, et elle n'écrit plus. */
  const troisieme = await onglet('', (() => { const s = magasin(); s.setItem('jh-demo', 'commande'); return s; })()); troisieme.M.viderContexte(); troisieme.M.semer(DEPART);
  assert.equal(neuve.M.scenarioRecommence(), true); assert.equal(neuve.M.refusEnregistrement(), neuve.M.MESSAGE_RECOMMENCE); assert.equal(neuve.M.ajouterDemandeSite({ id: 'T-ancienne', genre: 'traiteur' }), false); assert.equal(troisieme.M.lire().annonce.texte, 'départ');
});
