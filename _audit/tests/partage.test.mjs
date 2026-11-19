/* Le mode connecté de l'espace (v7.9.0), sans réseau : un faux serveur répond, on vérifie ce que l'espace en fait.
   Les garanties du vrai serveur (droits, concurrence, base) sont vérifiées ailleurs, sur PostgreSQL : serveur/tests/. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { creerDepotServeur, versEcran, nomEnDeux } from '../../assets/js/espace-serveur.js';

globalThis.document ||= { visibilityState: 'visible' };
const resa = (plus = {}) => ({ id: 'r1', reference: 'R-261127-AAAAA', date: '2026-11-27', service: 'soir', heure: '20:00', couverts: 2, prenom: 'Claire', nom: 'Essai', telephone: '06 12 34 56 78', email: '',
  noteClient: '', noteEquipe: '', espaceSouhaite: '', statut: 'demande', origine: 'site', table: null, placement: null, tableSouhaitee: '', version: 1, clientId: 'c1', derogation: null, ...plus });
const attendre = () => new Promise((r) => setTimeout(r, 5));

/** Un faux serveur : il garde ses réservations et répond comme l'API. `panne` le fait disparaître. */
function faux({ compte = { id: 'u1', email: 'accueil@essai.test', nom: 'Accueil', role: 'accueil' }, droits = ['reservations:lire', 'reservations:ecrire', 'reglages:lire', 'reglages:jour'] } = {}) {
  const etat = { reservations: [resa()], equipe: {}, version: 3, numero: 10, panne: false, appels: [], session: true, conflit: false, creations: new Map() };
  const rep = (statut, corps) => ({ ok: statut < 400, status: statut, json: async () => structuredClone(corps) }); /* une copie, comme une vraie réponse */
  const aller = async (url, o = {}) => {
    const methode = o.method || 'GET', chemin = url.replace('/api', ''), corps = o.body ? JSON.parse(o.body) : null; etat.appels.push({ methode, chemin, corps, cle: o.headers?.['idempotency-key'] });
    if (etat.panne) throw new TypeError('fetch failed');
    if (chemin === '/session' && methode === 'POST') { etat.session = true; return rep(200, { compte, droits }); }
    if (chemin === '/session' && methode === 'DELETE') { etat.session = false; return rep(200, { ok: true }); }
    if (!etat.session) return rep(401, { erreur: { code: 'NON_CONNECTE', message: 'Connectez-vous.' } });
    if (chemin === '/session') return rep(200, { compte, droits });
    if (chemin === '/reglages') return rep(200, { reservation: { services: {} }, equipe: etat.equipe, version: etat.version, tables: [{ id: '1', places: 2, active: true }] });
    if (chemin.startsWith('/reservations?')) return droits.includes('reservations:lire') ? rep(200, { reservations: etat.reservations }) : rep(403, { erreur: { code: 'INTERDIT', message: 'Votre compte n\'a pas ce droit.' } });
    if (chemin.startsWith('/suivi')) return rep(200, { numero: etat.numero, reservations: chemin.endsWith('-1') ? [] : etat.reservations, regles: false, clients: [] });
    const m = chemin.match(/^\/reservations\/([^/]+)(\/statut|\/table)?$/), r = m && etat.reservations.find((x) => x.id === m[1]);
    if (m && r) {
      if (etat.conflit || corps.version !== r.version) return rep(409, { erreur: { code: 'CONFLIT_VERSION', message: 'Cette réservation a été modifiée entre-temps : la voici à jour.', details: { reservation: { ...r, couverts: 6, version: r.version + 1 } } } });
      if (m[2] === '/statut') Object.assign(r, { statut: corps.statut, version: r.version + 1, ...(corps.statut === 'confirmee' ? { table: '1', placement: 'technique' } : { table: null, placement: null }) });
      else if (m[2] === '/table') Object.assign(r, { table: corps.table || '1', placement: corps.table ? 'placement' : 'technique', version: r.version + 1 });
      else Object.assign(r, corps.champs, { version: r.version + 1 });
      return rep(200, { reservation: { ...r } });
    }
    if (chemin === '/reservations' && methode === 'POST') { const cle = o.headers['idempotency-key']; if (!etat.creations.has(cle)) { const n = resa({ id: `r${etat.reservations.length + 1}`, ...corps, statut: 'confirmee', origine: 'telephone', table: '1', placement: 'technique' }); etat.reservations.push(n); etat.creations.set(cle, n); } return rep(201, { reservation: etat.creations.get(cle) }); }
    if (chemin === '/reglages/equipe') { if (corps.version !== etat.version) return rep(409, { erreur: { code: 'CONFLIT_VERSION', message: 'Les règles ont changé entre-temps.', details: { equipe: etat.equipe, version: etat.version } } }); etat.version++; etat.equipe = { ...etat.equipe, [corps.operation]: corps.args }; return rep(200, { equipe: etat.equipe, version: etat.version }); }
    return rep(404, { erreur: { code: 'INTROUVABLE', message: 'Introuvable.' } });
  };
  return { etat, aller };
}
function monter(serveur) {
  const fins = [], liens = [], localAgir = [];
  const local = { etat: () => ({ carte: { modifs: {} }, resa: { ajouts: [{ id: 'vieux-local' }] } }), agir: (...a) => { localAgir.push(a); return true; }, demandesSite: () => [], ecouter() {}, abonner() {}, raisonRefus: () => '', noteAction: () => '', toutEffacer: () => true, peutAnnuler: () => false, annuler() {}, conflitsAnnulation: () => [], gardesAnnulation: () => [], annulationPartielle: () => false };
  const depot = creerDepotServeur({ api: '/api', local, periode: () => ({ du: '2026-11-20', au: '2027-03-01' }), surFin: (r) => fins.push(r), surEtat: (l) => liens.push(l), fetch: serveur.aller });
  return { depot, fins, liens, localAgir };
}

test('une réservation du serveur prend la forme que les écrans connaissent', () => {
  const e = versEcran(resa({ noteEquipe: 'Chaise haute', noteClient: 'Anniversaire' }));
  assert.equal(e.nom, 'Claire Essai'); assert.equal(e.statut, 'a-confirmer'); assert.equal(e.source, 'site'); assert.equal(e.demande, 'Chaise haute · Anniversaire');
  /* une table seulement retenue par le serveur n'est pas « placée » : l'équipe n'a rien choisi */
  assert.equal(versEcran(resa({ table: '4', placement: 'technique' })).table, ''); assert.equal(versEcran(resa({ table: '4', placement: 'technique' })).tableRetenue, '4');
  assert.equal(versEcran(resa({ table: '4', placement: 'placement' })).table, '4');
  assert.deepEqual(nomEnDeux('Paul Combiné'), { prenom: 'Paul', nom: 'Combiné' }); assert.deepEqual(nomEnDeux('Dupont'), { prenom: '', nom: 'Dupont' }); assert.deepEqual(nomEnDeux('  Jean  de la Tour '), { prenom: 'Jean', nom: 'de la Tour' });
});

test('après la connexion, l\'état vient du serveur : rien de ce que le navigateur gardait pour les réservations', async () => {
  const s = faux(), { depot } = monter(s);
  await depot.connecter('accueil@essai.test', 'mot-de-passe');
  const S = depot.etat();
  assert.deepEqual(S.resa.ajouts.map((r) => r.id), ['r1']); assert.ok(!JSON.stringify(S.resa).includes('vieux-local'));
  assert.deepEqual(S.carte, { modifs: {} }); /* ce qui n'est pas partagé reste celui du navigateur */
  assert.equal(depot.liaison().etat, 'a-jour'); assert.deepEqual(depot.resasSite(), []);
  /* le mot de passe n'est gardé nulle part */
  assert.ok(!JSON.stringify({ c: depot.compte(), l: depot.liaison() }).includes('mot-de-passe'));
});

test('une action n\'est « enregistrée » qu\'après la réponse du serveur', async () => {
  const s = faux(), { depot, fins } = monter(s); await depot.connecter('a', 'b');
  assert.equal(depot.agir('statut', { id: 'r1', statut: 'confirmee' }, { msg: 'Confirmée.' }), 'attente');
  assert.equal(depot.etat().resa.ajouts[0].statut, 'a-confirmer', 'tant que le serveur n\'a pas répondu, l\'écran ne change pas');
  assert.equal(depot.liaison().enCours, 1); assert.equal(fins.length, 0);
  /* une seconde action pendant l'enregistrement est refusée, et dite */
  assert.equal(depot.agir('statut', { id: 'r1', statut: 'refusee' }), false); assert.match(depot.raisonRefus(), /déjà en cours/);
  await attendre();
  assert.equal(fins.length, 1); assert.equal(fins[0].ok, true); assert.equal(depot.etat().resa.ajouts[0].statut, 'confirmee'); assert.equal(depot.liaison().enCours, 0);
  assert.equal(s.etat.appels.filter((a) => a.chemin === '/reservations/r1/statut').length, 1);
  assert.equal(s.etat.appels.find((a) => a.chemin === '/reservations/r1/statut').corps.version, 1, 'la version connue part avec l\'action');
});

test('serveur en panne : rien n\'est changé, rien n\'est mis de côté, c\'est dit', async () => {
  const s = faux(), { depot, fins, localAgir } = monter(s); await depot.connecter('a', 'b');
  s.etat.panne = true;
  assert.equal(depot.agir('statut', { id: 'r1', statut: 'confirmee' }), 'attente'); await attendre();
  assert.equal(fins[0].ok, false); assert.equal(fins[0].code, 'RESEAU'); assert.match(fins[0].message, /rien n'a été enregistré/);
  assert.equal(depot.etat().resa.ajouts[0].statut, 'a-confirmer'); assert.equal(depot.liaison().etat, 'hors-ligne');
  assert.equal(localAgir.length, 0, 'aucun repli vers le dépôt du navigateur');
  /* le serveur revient : la même action passe */
  s.etat.panne = false; depot.agir('statut', { id: 'r1', statut: 'confirmee' }); await attendre();
  assert.equal(fins[1].ok, true); assert.equal(depot.liaison().etat, 'a-jour');
});

test('conflit : la version du serveur remplace celle de l\'écran, l\'action n\'est pas rejouée', async () => {
  const s = faux(), { depot, fins } = monter(s); await depot.connecter('a', 'b');
  s.etat.conflit = true;
  depot.agir('modifierResa', { id: 'r1', champs: { couverts: 4, nom: 'Claire Essai', demande: '' } }); await attendre();
  assert.equal(fins[0].ok, false); assert.equal(fins[0].code, 'CONFLIT_VERSION'); assert.match(fins[0].message, /refaites votre geste/);
  assert.equal(depot.etat().resa.ajouts[0].couverts, 6, 'l\'écran montre ce que le serveur a'); assert.equal(depot.etat().resa.ajouts[0].version, 2);
  assert.equal(s.etat.appels.filter((a) => a.methode === 'PATCH').length, 1);
});

test('modifier : seuls les champs réellement changés partent ; le nom garde son prénom', async () => {
  const s = faux(), { depot } = monter(s); await depot.connecter('a', 'b');
  s.etat.reservations[0].noteClient = 'Anniversaire';
  await depot.charger();
  depot.agir('modifierResa', { id: 'r1', champs: { heure: '20:30', couverts: '4', nom: 'Claire Essai', telephone: '06 12 34 56 78', demande: 'Anniversaire' } }); await attendre();
  const envoi = s.etat.appels.find((a) => a.methode === 'PATCH').corps.champs;
  assert.deepEqual(envoi, { heure: '20:30', couverts: 4, telephone: '06 12 34 56 78' }, 'ni le nom inchangé, ni la note du client recopiée en note de l\'équipe');
});

test('ajout au téléphone : la même saisie renvoyée après une réponse perdue ne crée pas un doublon', async () => {
  const s = faux(), { depot, fins } = monter(s); await depot.connecter('a', 'b');
  const nouvelle = { date: '2026-11-27', service: 'soir', heure: '19:30', couverts: 3, nom: 'Paul Combiné', telephone: '06 98 76 54 32', demande: '' };
  s.etat.panne = true; depot.agir('ajouterResa', { resa: { ...nouvelle, id: 'tel-1' } }); await attendre();
  s.etat.panne = false; depot.agir('ajouterResa', { resa: { ...nouvelle, id: 'tel-2' } }); await attendre();
  const cles = s.etat.appels.filter((a) => a.chemin === '/reservations' && a.methode === 'POST').map((a) => a.cle);
  assert.equal(cles.length, 2); assert.equal(cles[0], cles[1], 'la même clé pour la même saisie'); assert.ok(cles[0]);
  assert.equal(fins[1].ok, true); assert.equal(s.etat.reservations.filter((r) => r.nom === 'Combiné').length, 1);
  /* une autre saisie reçoit une autre clé */
  depot.agir('ajouterResa', { resa: { ...nouvelle, nom: 'Autre Client', id: 'tel-3' } }); await attendre();
  assert.notEqual(s.etat.appels.filter((a) => a.chemin === '/reservations' && a.methode === 'POST').at(-1).cle, cles[0]);
});

test('ce qui n\'est pas partagé reste une action du navigateur ; les règles du jour partent au serveur', async () => {
  const s = faux(), { depot, localAgir, fins } = monter(s); await depot.connecter('a', 'b');
  assert.equal(depot.agir('plat', { cle: 'entrees/x' }), true); assert.equal(localAgir.length, 1); assert.equal(localAgir[0][0], 'plat');
  assert.equal(depot.agir('complet', { date: '2026-11-27', service: 'soir', actif: true }), 'attente'); await attendre();
  assert.equal(fins[0].ok, true); assert.equal(localAgir.length, 1);
  const envoi = s.etat.appels.find((a) => a.chemin === '/reglages/equipe').corps;
  assert.deepEqual(envoi, { version: 3, operation: 'complet', args: { date: '2026-11-27', service: 'soir', actif: true } });
});

test('retirer une fermeture : désignée par ses dates, pas par son rang', async () => {
  const s = faux(), { depot, fins } = monter(s); s.etat.equipe = { fermetures: [{ du: '2026-12-24', au: '2026-12-25', motif: 'Noël' }, { du: '2027-01-01', au: '2027-01-01', motif: 'Jour de l\'an' }] };
  await depot.connecter('a', 'b');
  assert.deepEqual(depot.etat().horaires.exceptions.map((x) => x.du), ['2026-12-24', '2027-01-01']);
  depot.agir('retirerFermeture', { index: 1 }); await attendre();
  assert.deepEqual(s.etat.appels.find((a) => a.chemin === '/reglages/equipe').corps.args, { du: '2027-01-01', au: '2027-01-01' });
  /* un rang qui n'existe plus : refusé sans appel au serveur */
  const avant = s.etat.appels.length; depot.agir('retirerFermeture', { index: 7 }); await attendre();
  assert.equal(fins.at(-1).ok, false); assert.match(fins.at(-1).message, /n'existe plus/); assert.equal(s.etat.appels.filter((a) => a.chemin === '/reglages/equipe').length, 1);
  assert.ok(s.etat.appels.length >= avant);
});

test('un compte sans droit sur les réservations n\'en reçoit aucune ; la session expirée ramène à la connexion', async () => {
  const s = faux({ compte: { id: 'u3', email: 'edition@essai.test', nom: 'Édition', role: 'edition' }, droits: ['reglages:lire'] }), { depot } = monter(s);
  await depot.connecter('a', 'b');
  assert.equal(depot.liaison().etat, 'interdit'); assert.deepEqual(depot.etat().resa.ajouts, []);
  assert.ok(!s.etat.appels.some((a) => a.chemin.startsWith('/reservations')), 'les réservations ne sont même pas demandées');
  assert.equal(depot.agir('statut', { id: 'r1', statut: 'confirmee' }), false);
  const t = faux(), m = monter(t); await m.depot.connecter('a', 'b');
  t.etat.session = false; await m.depot.actualiser();
  assert.equal(m.depot.liaison().etat, 'deconnecte'); assert.match(m.depot.liaison().message, /session a expiré/); assert.equal(m.depot.compte(), null);
});

test('à la déconnexion, le miroir est vidé', async () => {
  const s = faux(), { depot } = monter(s); await depot.connecter('a', 'b');
  assert.equal(depot.etat().resa.ajouts.length, 1);
  await depot.deconnecter();
  assert.deepEqual(depot.etat().resa.ajouts, []); assert.equal(depot.compte(), null); assert.equal(depot.reservation('r1'), null);
});
