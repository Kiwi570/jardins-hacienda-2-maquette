/* La rubrique « Demandes » de l'espace restaurateur (v7.7.2) et l'onglet « Messages » : les écrans.
   Tout ce que le site envoie arrive ici : tables à confirmer, réceptions (suivies par étapes), commandes traiteur,
   cartes cadeaux, questions. Une carte par demande : qui, quoi, depuis quand ; un bouton pour l'étape suivante ; en
   l'ouvrant, les détails, les étapes, le message qui part au client (envoi simulé) et une note pour l'équipe.
   Les règles sont dans espace-demandes.js (fonctions pures) ; ce fichier dessine et écoute, avec les outils de espace.js. */
import { cleDemande } from './espace-clients.js?v=7';
import { GENRES, libelleEtape, suite, recue, demandes as demandesDe, aTraiter, MODELES, modele, composer, variablesTable, messageDemande, exempleModele } from './espace-demandes.js?v=7';
import { pluriel, typo } from './espace-regles.js?v=7';

const ICO = {
  table: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.6h17M8 3v4M16 3v4M8 13.5h2M14 13.5h2M8 17h2"/>',
  reception: '<path d="M8 3.5h8l-1 7a3 3 0 0 1-6 0l-1-7ZM12 13.5v6M8.5 20h7"/><path d="M8.6 7.5h6.8"/>',
  traiteur: '<path d="M6 8.5h12l-1 11H7l-1-11ZM9 8.5V7a3 3 0 0 1 6 0v1.5"/>',
  cadeau: '<rect x="4" y="9.5" width="16" height="10.5" rx="1.5"/><path d="M3 6.5h18v3H3zM12 6.5V20M12 6.5c-1.5-3.5-5-3-4.5-.6.3 1.2 2.5 1 4.5.6Zm0 0c1.5-3.5 5-3 4.5-.6-.3 1.2-2.5 1-4.5.6Z"/>',
  question: '<path d="M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H11l-4.5 3.5V16.5a2 2 0 0 1-2-2v-8Z"/><path d="M10 9a2 2 0 1 1 2.8 1.8c-.6.3-.8.7-.8 1.4M12 14.2v.1"/>',
};
const ico = (g) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICO[g] || ICO.question}</svg>`;
const FILTRES = [['tout', 'Tout'], ['table', 'Tables'], ['reception', 'Réceptions'], ['traiteur', 'Traiteur'], ['cadeau', 'Cartes cadeaux'], ['question', 'Questions']];
const FINIES = ['signe', 'retiree', 'envoyee', 'repondue'], PERDUES = ['perdue', 'annulee'];
const classePastille = (s) => (s === 'nouvelle' ? 'a-confirmer' : FINIES.includes(s) ? 'confirmee' : PERDUES.includes(s) ? 'refusee' : 'cours');

export function creerDemandes(X) {
  const { root, $, e, S, A, D, ctx, etat, agir, corps, ligneResa } = X;
  const liste = () => demandesDe(ctx(), S());
  const attente = () => aTraiter(ctx(), S());
  const bulle = (texte, cle) => `<div class="esp-bulle"><p class="esp-bulle__sur">Le message au client <span>(envoi simulé)</span></p><p class="esp-bulle__texte">${e(texte)}</p>${cle ? `<p><button type="button" class="esp-lien" data-aller="site" data-onglet="messages" data-modele="${cle}">Retoucher ce modèle</button></p>` : ''}</div>`;

  /** La carte d'une demande. Compacte (rubrique Aujourd'hui) : l'en-tête mène à la rubrique Demandes. */
  function carte(d, { compacte = false } = {}) {
    const g = GENRES[d.genre], s = suite(d.genre, d.statut), ouverte = !compacte && etat.demandeOuverte === d.id, msg = ouverte ? messageDemande(S(), d, D.telephone) : null;
    const src = d.source === 'demo' ? '<span class="esp-source">Exemple</span>' : '<span class="esp-source esp-source--site">Depuis le site</span>';
    const tete = `<span class="esp-dem__ico">${ico(d.genre)}</span><span class="esp-dem__qui"><span class="esp-dem__nom">${e(d.qui)} ${src}</span><span class="esp-dem__titre">${e(g.nom)} · ${e(d.titre)}</span></span>
      <span class="esp-dem__etat"><span class="esp-pastille esp-pastille--${classePastille(d.statut)}">${e(libelleEtape(d.genre, d.statut))}</span><span class="esp-dem__recue">reçue ${e(recue(d.cree, A.iso))}</span></span>`;
    const etapes = !ouverte ? '' : `<div class="esp-dem__bloc"><p class="esp-champ__titre" id="et-${e(d.id)}">Où elle en est</p>
      <ol class="esp-etapes" aria-labelledby="et-${e(d.id)}">${g.etapes.map(([id, nom], i) => `<li><button type="button" class="esp-etape${g.etapes.findIndex(([x]) => x === d.statut) >= i ? ' est-faite' : ''}" data-etape-demande="${e(d.id)}" data-statut="${id}"${d.statut === id ? ' aria-current="step"' : ''}><span class="esp-etape__n" aria-hidden="true">${i + 1}</span>${nom}</button></li>`).join('')}</ol>
      ${g.fin ? `<p><button type="button" class="esp-bouton esp-bouton--discret" data-etape-demande="${e(d.id)}" data-statut="${g.fin[0]}" aria-pressed="${d.statut === g.fin[0]}">${g.fin[1]}</button></p>` : ''}</div>`;
    const corpsCarte = !ouverte ? '' : `<div class="esp-dem__corps" id="dem-${e(d.id)}">
      <dl class="esp-dem__details">${d.lignes.map(([k, v]) => `<div><dt>${e(k)}</dt><dd>${e(v)}</dd></div>`).join('')}</dl>
      ${d.telephone || d.email ? `<p class="esp-dem__contact">${d.telephone ? `<a class="esp-bouton" href="tel:${e(d.telephone.replace(/\s/g, ''))}">Appeler ${e(d.telephone)}</a>` : ''}${d.email ? `<a class="esp-bouton" href="mailto:${e(d.email)}">Écrire à ${e(d.email)}</a>` : ''}${cleDemande(d) && d.qui !== 'Sans nom' ? `<button type="button" class="esp-bouton" data-client="${e(cleDemande(d))}" aria-haspopup="dialog">Retrouver ce client</button>` : ''}</p>` : ''}
      ${etapes}${msg ? bulle(msg.texte, msg.cle) : ''}
      <p class="esp-champ esp-champ--large"><label for="note-${e(d.id)}">Note pour l'équipe</label><textarea id="note-${e(d.id)}" rows="2" data-note-demande="${e(d.id)}" placeholder="Rappeler après 18 h, budget évoqué…">${e(d.note)}</textarea></p>
      ${X.tachesDe ? X.tachesDe('demande', d.id, `${d.qui} · ${g.nom}`, `Rappeler ${d.prenom || d.qui}`) : ''}</div>`;
    return `<li class="esp-dem est-${d.statut}${ouverte ? ' est-ouverte' : ''}" data-demande="${e(d.id)}">
      <button type="button" class="esp-dem__tete" ${compacte ? `data-voir-demande="${e(d.id)}"` : `data-ouvrir-demande="${e(d.id)}" aria-expanded="${ouverte}"${ouverte ? ` aria-controls="dem-${e(d.id)}"` : ''}`}>${tete}</button>
      ${s || X.boutonDossier?.(d) ? `<p class="esp-dem__actions">${s ? `<button type="button" class="esp-bouton${d.statut === 'nouvelle' ? ' esp-bouton--ok' : ''}" data-etape-demande="${e(d.id)}" data-statut="${s.statut}"${d.statut === 'nouvelle' ? ' data-repondre' : ''}>${e(s.libelle)}</button>` : ''}${compacte ? '' : X.boutonDossier?.(d) || ''}</p>` : ''}
      ${corpsCarte}</li>`;
  }
  /** Une table à confirmer, avec le message qui partira au client. */
  const table = (r) => ligneResa(r, true).replace(/<\/li>\s*$/, `<details class="esp-resa__message"><summary>Voir le message au client</summary>${bulle(composer(modele(S(), 'confirmation'), variablesTable(r, D.telephone)), 'confirmation')}</details></li>`);

  function rendre() {
    const l = liste(), att = attente(), f = etat.filtreDemandes || 'tout', nb = att.tables.length + att.autres.length;
    const compte = { tout: nb, table: att.tables.length, ...Object.fromEntries(['reception', 'traiteur', 'cadeau', 'question'].map((g) => [g, att.autres.filter((d) => d.genre === g).length])) };
    const voir = l.filter((d) => f === 'tout' || d.genre === f), neuves = voir.filter((d) => d.statut === 'nouvelle'), autres = voir.filter((d) => d.statut !== 'nouvelle');
    const tables = f === 'tout' || f === 'table' ? att.tables : [];
    /* v7.12.0 : le filtre « Réceptions » montre le suivi des dossiers, phase par phase ; les demandes qui n'ont pas encore de dossier y figurent. */
    const suivi = f === 'reception' ? (X.suiviReceptions?.() || '') : '';
    corps('demandes').innerHTML = `
      <p class="esp-bonjour">${nb ? `${pluriel(nb, 'demande')} ${nb > 1 ? 'attendent' : 'attend'} une réponse.` : 'Tout a une réponse.'} ${ctx().exemples === false ? 'Les demandes de table du site arrivent ici, sur tous vos appareils. Réception, traiteur, carte cadeau et question ne sont pas encore partagées.' : 'Les cinq formulaires du site arrivent ici : table, réception, traiteur, carte cadeau, question.'}</p>
      <div class="esp-filtres" role="group" aria-label="Filtrer les demandes">${FILTRES.map(([id, nom]) => `<button type="button" class="esp-filtre" data-filtre-demandes="${id}" aria-pressed="${id === f}">${nom}${compte[id] ? `<span class="esp-filtre__n" aria-label="${compte[id]} à traiter">${compte[id]}</span>` : ''}</button>`).join('')}</div>
      ${suivi}
      ${f === 'reception' && ctx().exemples !== false ? '<h3 class="esp-sous">Les demandes reçues</h3>' : '<h3 class="esp-sous">À traiter</h3>'}
      ${tables.length || neuves.length ? `${tables.length ? `<ul class="esp-resas esp-resas--demandes">${tables.map(table).join('')}</ul>` : ''}${neuves.length ? `<ul class="esp-dems">${neuves.map((d) => carte(d)).join('')}</ul>` : ''}`
        : `<p class="esp-vide esp-vide--fete"><span class="esp-vide__sceau" aria-hidden="true"></span><span><b>Tout a une réponse.</b> ${f === 'tout' ? 'Les prochaines demandes faites sur le site arriveront ici.' : 'Rien à traiter dans cette catégorie.'}</span></p>`}
      ${f === 'table' ? '<p class="esp-plus"><button type="button" class="esp-lien" data-aller="resas">Voir toutes les réservations dans l\'agenda</button></p>' : ''}
      ${autres.length ? `<h3 class="esp-sous">En cours et terminées</h3><ul class="esp-dems">${autres.map((d) => carte(d)).join('')}</ul>` : ''}`;
  }

  /** L'onglet « Messages » : un modèle par situation, son aperçu avec un exemple. */
  function rendreMessages() {
    const s = S();
    corps('messages').innerHTML = `<p class="esp-aide esp-aide--haut">Le texte que reçoit le client quand vous répondez. Dans cette démonstration, rien ne part : l'aperçu montre le message tel qu'il serait envoyé.</p>
      <form class="esp-modeles" data-form-messages>${Object.entries(MODELES).map(([cle, m]) => { const t = modele(s, cle);
        return `<article class="esp-carte esp-modele" id="modele-${cle}" aria-labelledby="mt-${cle}"><h3 id="mt-${cle}">${e(typo(m.nom))}</h3><p class="esp-aide">${e(m.quand)}.</p>
          <p class="esp-champ esp-champ--large"><label for="mo-${cle}">Votre texte <small>Les mots entre accolades sont remplis tout seuls : ${[...m.texte.matchAll(/\{([^{}]+)\}/g)].map((x) => `{${x[1]}}`).filter((v, i, a) => a.indexOf(v) === i).join(', ')}</small></label><textarea id="mo-${cle}" name="${cle}" rows="4">${e(typo(t))}</textarea></p>
          ${s.messages?.[cle] ? `<p><button type="button" class="esp-lien" data-retablir-modele="${cle}">Revenir au texte d'origine</button></p>` : ''}
          <div class="esp-bulle" aria-live="off"><p class="esp-bulle__sur">Aperçu <span>(exemple)</span></p><p class="esp-bulle__texte" data-apercu-modele="${cle}">${e(composer(t, exempleModele(cle, D.telephone)))}</p></div></article>`; }).join('')}</form>`;
  }

  function clic(t) {
    const o = t.closest('[data-ouvrir-demande]'); if (o) { const id = o.dataset.ouvrirDemande; etat.demandeOuverte = etat.demandeOuverte === id ? null : id; X.rendre(); $(`[data-ouvrir-demande="${CSS.escape(id)}"]`, root)?.focus(); return true; }
    const v = t.closest('[data-voir-demande]'); if (v) { etat.demandeOuverte = v.dataset.voirDemande; etat.filtreDemandes = 'tout'; X.allerVue('demandes'); X.viser($(`[data-demande="${CSS.escape(etat.demandeOuverte)}"]`, root), 'center'); return true; }
    const f = t.closest('[data-filtre-demandes]'); if (f) { etat.filtreDemandes = f.dataset.filtreDemandes; X.rendre(); $(`[data-filtre-demandes="${etat.filtreDemandes}"]`, root)?.focus(); return true; }
    const et = t.closest('[data-etape-demande]'); if (et) {
      const id = et.dataset.etapeDemande, statut = et.dataset.statut, d = liste().find((x) => x.id === id); if (!d || d.statut === statut) return true;
      const restait = X.enAttenteTotal(), msg = messageDemande(S(), d, D.telephone);
      const ok = agir('etapeDemande', { id, statut }, { msg: `${GENRES[d.genre].nom} de ${d.qui} : ${libelleEtape(d.genre, statut).toLowerCase()}.${msg && d.statut === 'nouvelle' && !PERDUES.includes(statut) ? ' Le client reçoit un message (simulé).' : ''}` });
      X.rendre();
      if (ok && restait > 0 && !X.enAttenteTotal()) { X.dire('Tout a une réponse : bon service !', { annuler: true }); X.feter(); }
      ($(`[data-demande="${CSS.escape(id)}"] button`, root) || $(`#vue-${etat.vue}`, root))?.focus({ preventScroll: true });
      return true;
    }
    const rm = t.closest('[data-retablir-modele]'); if (rm) { const cle = rm.dataset.retablirModele; agir('modeleMessage', { cle, texte: '' }, { msg: 'Message d\'origine rétabli.' }); X.rendre(); $(`#mo-${cle}`, root)?.focus(); return true; }
    return false;
  }
  function saisie(t) {
    if (t.matches('[data-note-demande]')) { const id = t.dataset.noteDemande; X.plusTard(() => agir('noteDemande', { id, note: t.value }, { msg: 'Note enregistrée.', groupe: `note-${id}` }), `note-${id}`); return true; }
    if (t.closest('[data-form-messages]')) { const cle = t.name; $(`[data-apercu-modele="${cle}"]`, root).textContent = composer(typo(t.value), exempleModele(cle, D.telephone)); X.plusTard(() => agir('modeleMessage', { cle, texte: t.value, defaut: MODELES[cle].texte }, { msg: 'Message enregistré.', groupe: `modele-${cle}` }), `modele-${cle}`); return true; }
    return false;
  }
  return { rendre, rendreMessages, carte, clic, saisie, liste, attente };
}
