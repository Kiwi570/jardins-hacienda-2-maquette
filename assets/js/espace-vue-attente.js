/* La liste d'attente dans l'espace restaurateur (v7.11.0) : l'onglet « Attente » de l'agenda.
   Les règles sont dans espace-attente.js (fonctions pures, testées) ; ici, l'écran : la liste filtrable, les demandes à qui
   une place peut être proposée, la proposition et sa réponse, l'inscription notée par l'équipe.
   Portée : démonstration, sur cet appareil. Les messages sont des aperçus : rien n'est envoyé. */
import { fmt, maj, heure, pluriel, typo, servicesDe, creneaux, ajouter } from './espace-regles.js?v=7';
import { ETATS_ATTENTE, SOUPLESSES, ESPACES_ATTENTE, DELAI_REPONSE, MARGE_AVANT_ARRIVEE, DELAI_DERNIERE_MINUTE, attenteAvecPossibles, trouverAttente, refusAttente, resaDepuisAttente, delaiProposition, messageProposition, quandDit } from './espace-attente.js?v=7';

const FILTRES = [['actives', 'En cours'], ['possibles', 'Place à proposer'], ['closes', 'Terminées'], ['toutes', 'Toutes']];
const EN_COURS = ['en-attente', 'proposee', 'expiree'];

export function creerAttente(X) {
  const { root, $, e, S, A, D, ctx, etat, agir, dire } = X;
  const liste = () => attenteAvecPossibles(ctx(), S(), D.salle);
  const jourDit = (iso) => maj(fmt(iso, { weekday: 'long', day: 'numeric', month: 'long' }));
  const souplesseDite = (x) => (!x.heure ? 'à n\'importe quelle heure du service' : x.souplesse >= 999 ? `vers ${heure(x.heure)}, tout le service convient` : x.souplesse ? `vers ${heure(x.heure)}, à ${x.souplesse === 30 ? 'une demi-heure' : 'une heure'} près` : `à ${heure(x.heure)} précisément`);
  const rangDit = (x) => (x.rang ? `${x.rang === 1 ? '1re' : `${x.rang}e`} inscrite pour ce ${x.periode === 'midi' ? 'midi' : 'soir'}` : '');

  /* Le bouton d'une proposition dit son délai : standard, ou « dernière minute » quand il reste moins d'une heure. */
  const hm = (instant) => heure(String(instant).slice(11, 16));
  function boutonsProposer(x, n, refaire = false) {
    const l = x.possibles.map((c) => ({ c, d: delaiProposition(x, c.heure, ctx().maintenant) })).filter((o) => o.d.mode).slice(0, n);
    return l.map(({ c, d }) => `<button type="button" class="esp-bouton esp-bouton--ok${d.mode === 'derniere-minute' ? ' esp-att__minute' : ''}" data-attente-proposer="${e(x.id)}" data-heure="${c.heure}" data-service="${c.service}" data-mode="${d.mode}"><span>${d.mode === 'derniere-minute' ? 'Dernière minute : proposer' : refaire ? 'Refaire une proposition :' : 'Proposer'} ${heure(c.heure)}</span><small>${d.mode === 'derniere-minute' ? `réponse sous ${d.minutes} min, avant ${hm(d.expire)}` : `réponse avant ${hm(d.expire)}`}</small></button>`).join('');
  }
  function carte(x) {
    const p = x.proposition || {}, tel = D.telephone || '', contact = [x.telephone, x.email].filter(Boolean).join(' · ');
    const boutons = boutonsProposer(x, 3), boutonsRefaire = boutonsProposer(x, 2, true), minute = /data-mode="derniere-minute"/.test(boutons + boutonsRefaire);
    const tropTard = x.possibles.length && !boutons ? '<p class="esp-att__rien">Il est trop tard pour proposer ces horaires : l\'heure d\'arrivée est là. Proposez un autre créneau.</p>' : '';
    const noteMinute = minute ? `<p class="esp-att__note-minute"><b>Dernière minute.</b> Il reste moins d'une heure avant l'arrivée : le délai habituel n'est plus possible. Le client aura ${DELAI_DERNIERE_MINUTE} minutes pour répondre, au plus tard jusqu'à l'heure d'arrivée.</p>` : '';
    const suite = x.etat === 'en-attente' ? (x.possibles.length
        ? (boutons ? `<p class="esp-att__possible"><b>Une place peut être proposée.</b> ${boutons}<span class="esp-att__place">${e(maj(x.possibles[0].placeNom))}${x.possibles[0].espace === 'terrasse' ? ', en terrasse' : ''}</span></p>${noteMinute}` : tropTard)
        : `<p class="esp-att__rien">${x.motif === 'place-prise' ? 'La place proposée a été prise avant sa réponse. ' : ''}Aucune place ne correspond pour l'instant à ce jour, cette heure et ce nombre de personnes.</p>`)
      : x.etat === 'proposee' ? `<p class="esp-att__propo"><b>Proposition préparée${p.mode === 'derniere-minute' ? ' en dernière minute' : ''}</b> pour ${heure(p.heure)}, valable jusqu'au ${e(quandDit(p.expire))}. La place n'est pas bloquée&nbsp;: elle sera revérifiée à l'acceptation.</p>
          <details class="esp-att__message"><summary>Voir le message <span class="esp-source">Aperçu, rien n'est envoyé</span></summary><p>${e(typo(messageProposition(x, tel)))}</p></details>
          <p class="esp-att__actions"><button type="button" class="esp-bouton esp-bouton--ok" data-attente-accepter="${e(x.id)}">Le client accepte</button><button type="button" class="esp-bouton esp-bouton--non" data-attente-reponse="${e(x.id)}" data-reponse="refusee">Le client refuse</button><button type="button" class="esp-bouton esp-bouton--discret" data-attente-reponse="${e(x.id)}" data-reponse="en-attente">Retirer la proposition</button></p>`
      : x.etat === 'expiree' ? `<p class="esp-att__propo est-expiree"><b>Proposition expirée</b> le ${e(quandDit(p.expire))}, sans réponse. La place n'avait pas été gardée.</p>
          <p class="esp-att__actions">${boutonsRefaire}<button type="button" class="esp-bouton" data-attente-reponse="${e(x.id)}" data-reponse="en-attente">Remettre en attente</button></p>${noteMinute}
          ${x.possibles.length ? tropTard && !boutonsRefaire ? tropTard : '' : '<p class="esp-att__rien">Aucune place ne correspond pour l\'instant.</p>'}`
      : x.etat === 'acceptee' ? `<p class="esp-att__propo est-acceptee"><b>Réservation créée</b> pour ${heure(p.heure || x.heure)}, ${pluriel(x.couverts, 'couvert')}. <button type="button" class="esp-lien" data-attente-voir="${e(x.resaId || '')}" data-date="${x.date}" data-service="${e(p.service || x.periode)}">Voir la réservation</button></p>`
      : x.etat === 'refusee' ? `<p class="esp-att__rien">Le client a décliné la proposition de ${heure(p.heure || x.heure)}.</p><p class="esp-att__actions"><button type="button" class="esp-bouton" data-attente-reponse="${e(x.id)}" data-reponse="en-attente">Remettre en attente</button></p>`
      : x.etat === 'perimee' ? '<p class="esp-att__rien">La date est passée : aucune place ne s\'est libérée.</p>' : '<p class="esp-att__rien">Inscription retirée.</p>';
    return `<li class="esp-att est-${x.etat}" data-attente="${e(x.id)}">
      <div class="esp-att__tete"><p class="esp-att__nom"><b>${e(x.nom)}</b> · ${pluriel(x.couverts, 'personne')} <span class="esp-pastille esp-pastille--att-${x.etat}">${ETATS_ATTENTE[x.etat]}</span>${x.source === 'demo' ? ' <span class="esp-source">Exemple</span>' : x.source === 'site' ? ' <span class="esp-source">Depuis le site</span>' : ''}</p>
        <p class="esp-att__souhait">${e(jourDit(x.date))}, ${x.periode === 'midi' ? 'le midi' : 'le soir'}, ${e(souplesseDite(x))}${x.espaces?.length ? ` · ${e(x.espaces.map((k) => ESPACES_ATTENTE[k]).join(' ou ').toLowerCase())}` : ''}</p>
        <p class="esp-att__meta">${[rangDit(x), `inscrit le ${e(quandDit(x.cree))}`, contact ? e(contact) : '', x.note ? `« ${e(x.note)} »` : ''].filter(Boolean).join(' · ')}</p></div>
      ${suite}
      ${EN_COURS.includes(x.etat) ? `<p class="esp-att__retirer"><button type="button" class="esp-lien" data-attente-reponse="${e(x.id)}" data-reponse="retiree">Le client se retire de la liste</button></p>` : ''}</li>`;
  }

  function formulaire() {
    const a = etat.attenteAjout || {}, svs = servicesDe(D.reservation), sv = a.periode || 'soir';
    return `<form class="esp-carte esp-att-form" data-form-attente aria-labelledby="t-att-form"><h3 id="t-att-form">Inscrire un client en liste d'attente</h3>
      <p class="esp-champ"><label for="at-nom">Nom</label><input id="at-nom" name="nom" required maxlength="60" autocomplete="off" value="${e(a.nom || '')}"></p>
      <p class="esp-champ"><label for="at-n">Personnes</label><input id="at-n" name="couverts" type="number" inputmode="numeric" min="1" max="60" required value="${e(a.couverts || 2)}"></p>
      <p class="esp-champ"><label for="at-tel">Téléphone</label><input id="at-tel" name="telephone" type="tel" autocomplete="off" value="${e(a.telephone || '')}"></p>
      <p class="esp-champ"><label for="at-mail">Adresse e-mail <small>à défaut de téléphone</small></label><input id="at-mail" name="email" type="email" autocomplete="off" value="${e(a.email || '')}"></p>
      <p class="esp-champ"><label for="at-date">Jour</label><input id="at-date" name="date" type="date" required min="${A.iso}" max="${ajouter(A.iso, 60)}" value="${e(a.date || A.iso)}"></p>
      <p class="esp-champ"><label for="at-sv">Période</label><select id="at-sv" name="periode" data-attente-periode>${svs.map((s) => `<option value="${s.id}"${s.id === sv ? ' selected' : ''}>${s.libelle}</option>`).join('')}</select></p>
      <p class="esp-champ"><label for="at-h">Heure souhaitée</label><select id="at-h" name="heure">${creneaux(D.reservation, sv).map((h) => `<option value="${h}"${h === (a.heure || (sv === 'midi' ? '12:30' : '20:00')) ? ' selected' : ''}>${heure(h)}</option>`).join('')}</select></p>
      <p class="esp-champ"><label for="at-s">Souplesse</label><select id="at-s" name="souplesse">${SOUPLESSES.map(([v, n]) => `<option value="${v}"${v === (a.souplesse ?? 30) ? ' selected' : ''}>${n}</option>`).join('')}</select></p>
      <fieldset class="esp-champ esp-champ--large esp-att-form__espaces"><legend>Espaces acceptés <small>rien de coché : peu importe</small></legend>${Object.entries(ESPACES_ATTENTE).map(([k, n]) => `<label><input type="checkbox" name="espaces" value="${k}"> ${n}</label>`).join('')}</fieldset>
      <p class="esp-champ esp-champ--large"><label for="at-note">Note <small>facultatif</small></label><input id="at-note" name="note" maxlength="140" autocomplete="off" value="${e(a.note || '')}"></p>
      <p class="esp-att-form__actions"><button type="submit" class="bouton">Inscrire en liste d'attente</button><button type="button" class="esp-bouton esp-bouton--discret" data-attente-fermer>Fermer</button></p>
      <p class="esp-aide">Une inscription n'est pas une réservation : aucune table n'est retenue. Le client sera prévenu si une place se libère.</p></form>`;
  }

  /** Dessine l'onglet dans `cible`. */
  function rendre(cible) {
    const tous = liste(), f = etat.filtreAttente || 'actives', jours = [...new Set(tous.filter((x) => EN_COURS.includes(x.etat)).map((x) => x.date))].sort(), jour = jours.includes(etat.jourAttente) ? etat.jourAttente : '';
    const nb = { actives: tous.filter((x) => EN_COURS.includes(x.etat)).length, possibles: tous.filter((x) => x.possibles.length).length, closes: tous.filter((x) => !EN_COURS.includes(x.etat)).length, toutes: tous.length };
    const vus = tous.filter((x) => (f === 'actives' ? EN_COURS.includes(x.etat) : f === 'possibles' ? x.possibles.length : f === 'closes' ? !EN_COURS.includes(x.etat) : true) && (!jour || x.date === jour));
    cible.innerHTML = typo(`<div class="esp-service-tete"><div><h3>Liste d'attente <span class="esp-source">Démonstration, sur cet appareil</span></h3>
          <p class="esp-service-tete__resume">${nb.actives ? `${pluriel(nb.actives, 'demande')} en cours${nb.possibles ? `, ${nb.possibles} à qui une place peut être proposée` : ''}` : 'Personne n\'attend de place.'}</p></div>
        <p class="esp-service-tete__outils"><button type="button" class="esp-bouton" data-attente-nouvelle aria-expanded="${!!etat.attenteAjout}">Inscrire un client</button></p></div>
      ${etat.attenteAjout ? formulaire() : ''}
      <div class="esp-att-filtres"><span class="esp-choix" role="group" aria-label="Filtrer la liste d'attente">${FILTRES.map(([id, nom]) => `<button type="button" class="esp-choix__b" data-filtre-attente="${id}" aria-pressed="${id === f}">${nom}${nb[id] ? ` <span class="esp-choix__n">${nb[id]}</span>` : ''}</button>`).join('')}</span>
        ${jours.length > 1 ? `<p class="esp-champ esp-att-filtres__jour"><label for="att-jour">Jour</label><select id="att-jour" data-attente-jour><option value="">Tous les jours</option>${jours.map((d) => `<option value="${d}"${d === jour ? ' selected' : ''}>${e(jourDit(d))}</option>`).join('')}</select></p>` : ''}</div>
      ${vus.length ? `<ol class="esp-att-liste" aria-label="Les inscriptions, la plus ancienne d'abord">${vus.map(carte).join('')}</ol>` : `<p class="esp-vide">${tous.length ? 'Aucune inscription dans ce filtre.' : 'Personne en liste d\'attente. Les inscriptions faites sur la page Réserver arrivent ici.'}</p>`}
      <p class="esp-aide esp-att-regle"><b>La règle&nbsp;:</b> une proposition ne bloque pas la place. Le client a ${DELAI_REPONSE / 60} heures pour répondre, au plus tard jusqu'à ${MARGE_AVANT_ARRIVEE === 60 ? 'une heure' : `${MARGE_AVANT_ARRIVEE} minutes`} avant l'arrivée. S'il reste moins que cela, la proposition devient « dernière minute »\u00a0: ${DELAI_DERNIERE_MINUTE} minutes pour répondre, au plus tard jusqu'à l'heure d'arrivée. À l'échéance, la proposition expire. La disponibilité est revérifiée au moment où le client accepte, et une seule réservation est créée. Délais d'exemple, à régler avec vous. Aucun message n'est envoyé&nbsp;: ce sont des aperçus.</p>`);
  }

  const revenir = (id) => { X.rendre(); const li = $(`[data-attente="${CSS.escape(id)}"]`, root); (li?.querySelector('button') || $('[data-filtre-attente][aria-pressed="true"]', root))?.focus({ preventScroll: true }); };
  function clic(t) {
    const fi = t.closest('[data-filtre-attente]'); if (fi) { etat.filtreAttente = fi.dataset.filtreAttente; X.rendre(); $(`[data-filtre-attente="${etat.filtreAttente}"]`, root)?.focus(); return true; }
    if (t.closest('[data-attente-nouvelle]')) { etat.attenteAjout = etat.attenteAjout ? null : {}; X.rendre(); (etat.attenteAjout ? $('#at-nom', root) : $('[data-attente-nouvelle]', root))?.focus(); return true; }
    if (t.closest('[data-attente-fermer]')) { etat.attenteAjout = null; X.rendre(); $('[data-attente-nouvelle]', root)?.focus(); return true; }
    const pr = t.closest('[data-attente-proposer]');
    if (pr) { const id = pr.dataset.attenteProposer, x = trouverAttente(ctx(), S(), id), h = pr.dataset.heure, maintenant = ctx().maintenant; if (!x) return true;
      /* Le délai est calculé au moment du clic, avec l'heure de la maison ; il est enregistré avec la proposition et ne bouge plus. */
      const d = delaiProposition(x, h, maintenant);
      if (!d.mode) { dire(`Il est trop tard pour proposer ${heure(h)} : c'est l'heure d'arrivée. Proposez un autre créneau.`); revenir(id); return true; }
      agir('attenteProposer', { id, heure: h, service: pr.dataset.service, faite: maintenant, expire: d.expire, mode: d.mode }, { msg: `Proposition ${d.mode === 'derniere-minute' ? 'de dernière minute ' : ''}préparée pour ${x.nom} : ${heure(h)}, valable jusqu'au ${quandDit(d.expire)}${d.mode === 'derniere-minute' ? ` (${d.minutes} minutes)` : ''}. Aucun message n'est envoyé.` }); revenir(id); return true; }
    const ac = t.closest('[data-attente-accepter]');
    if (ac) { const id = ac.dataset.attenteAccepter, x = trouverAttente(ctx(), S(), id); if (!x) return true;
      const refus = refusAttente(ctx(), S(), D.salle, 'attenteAccepter', { id });
      /* La place a été prise entre-temps : on le dit, et la demande revient en attente (rien n'est créé). */
      if (/prise entre-temps/.test(refus)) agir('attenteReponse', { id, reponse: 'en-attente', motif: 'place-prise' }, { msg: refus });
      else if (refus) dire(refus);
      else agir('attenteAccepter', { id, resa: resaDepuisAttente(x) }, { msg: `${x.nom} : réservation confirmée, ${fmt(x.date, { weekday: 'long', day: 'numeric', month: 'long' })} à ${heure(x.proposition.heure)}, ${pluriel(x.couverts, 'couvert')}.` });
      revenir(id); return true; }
    const rp = t.closest('[data-attente-reponse]');
    if (rp) { const id = rp.dataset.attenteReponse, v = rp.dataset.reponse, x = trouverAttente(ctx(), S(), id);
      agir('attenteReponse', { id, reponse: v }, { msg: `${x?.nom || 'Inscription'} : ${v === 'refusee' ? 'proposition déclinée' : v === 'retiree' ? 'retiré de la liste d\'attente' : 'de nouveau en attente'}.` }); revenir(id); return true; }
    const vr = t.closest('[data-attente-voir]');
    if (vr) { etat.jour = vr.dataset.date; etat.serviceVu = vr.dataset.service; etat.ongletResas = 'service'; X.rendre(); const li = $(`[data-esp-panneau-resas] [data-resa="${CSS.escape(vr.dataset.attenteVoir)}"]`, root); X.viser(li, 'center'); li?.querySelector('button, summary')?.focus({ preventScroll: true }); return true; }
    return false;
  }
  function soumettre(f) {
    if (!f.matches('[data-form-attente]')) return false;
    const d = new FormData(f), v = Object.fromEntries(d), id = `att-${Date.now().toString(36)}`;
    const entree = { id, cree: ctx().maintenant, nom: String(v.nom || '').trim(), telephone: String(v.telephone || '').trim(), email: String(v.email || '').trim(), couverts: Math.round(+v.couverts) || 0, date: v.date, periode: v.periode, heure: v.heure, souplesse: +v.souplesse || 0, espaces: d.getAll('espaces'), note: String(v.note || '').trim(), source: 'equipe' };
    etat.attenteAjout = { ...entree };
    if (agir('attenteAjouter', { entree }, { msg: `${entree.nom} : inscrit en liste d'attente, sur cet appareil.` })) { etat.attenteAjout = null; etat.filtreAttente = 'actives'; etat.jourAttente = ''; revenir(id); } else { X.rendre(); $('#at-nom', root)?.focus(); }
    return true;
  }
  function change(t) {
    const j = t.closest('[data-attente-jour]'); if (j) { etat.jourAttente = j.value; X.rendre(); $('[data-attente-jour]', root)?.focus(); return true; }
    const p = t.closest('[data-attente-periode]'); if (p) { const f = p.form, v = Object.fromEntries(new FormData(f)); etat.attenteAjout = { ...v, couverts: v.couverts, souplesse: +v.souplesse, heure: '' }; X.rendre(); $('#at-sv', root)?.focus(); return true; }
    return false;
  }
  return { rendre, clic, soumettre, change };
}
