/* L'onglet « Service » de la rubrique Réservations (v7.7.5) : les écrans.
   Le service d'un jour (midi ou soir) en frise : en haut, les couverts à table quart d'heure par quart d'heure et
   l'heure du coup de feu ; en dessous, une ligne par réservation, placée dans le temps sur ordinateur, en liste sur
   téléphone. Sur chaque ligne : « Arrivés », « Absent », « Modifier » (heure, couverts, nom, téléphone, note),
   « Annuler la réservation ». Et la feuille de service, à imprimer pour la salle et la cuisine.
   Les règles sont dans espace-service.js (fonctions pures). */
import { serviceDuJour, serviceCourant, gestes, heuresPossibles, dureeDe } from './espace-service.js?v=7';
import { STATUTS, fmt, maj, heure, hhmm, pluriel, typo, servicesDe } from './espace-regles.js?v=7';
import { accueilDuService, pourUnPassage, resaDePassage, tablesDeLaResa, ditPresence, PRESENCES } from './espace-presence.js?v=7';
import { cleSalle, nomPlace, ETATS_TABLE } from './espace-salle.js?v=7';
import { compatiblesPour, listeAttente } from './espace-attente.js?v=7';
import { DELAIS_RAPPEL, delaiRappel, rappelDe, messageRappel, lienVenue } from './espace-venue.js?v=7';

const ICO_IMPR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8.5V4h10v4.5M7 17.5H5a1.5 1.5 0 0 1-1.5-1.5v-6A1.5 1.5 0 0 1 5 8.5h14a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-2M7 14h10v6H7z"/></svg>';

export function creerService(X) {
  const { root, $, e, S, A, D, ctx, etat, agir } = X;
  /* Le service montré : celui qu'on a choisi s'il a lieu ce jour-là, sinon celui du moment. */
  function svVu() {
    const c = etat.serviceVu, courant = serviceCourant(ctx(), S(), etat.jour, etat.jour === A.iso ? A.min : 0);
    if (!c || !servicesDe(D.reservation).some((s) => s.id === c)) return courant;
    const sv = serviceDuJour(ctx(), S(), etat.jour, c); return sv.ouvert || sv.resas.length ? c : courant;
  }
  const part = (sv, t) => `${(((t - sv.debut) / (sv.fin - sv.debut)) * 100).toFixed(2)}%`;

  function editeur(r) {
    const heures = heuresPossibles(ctx(), S(), r.date), connue = heures.some((h) => h.heure === r.heure);
    return `<form class="esp-frise__form" data-form-resa="${e(r.id)}" aria-label="Modifier la réservation de ${e(r.nom || 'ce client')}">
      <p class="esp-champ"><label for="mr-h">Heure</label><select id="mr-h" name="heure">${connue ? '' : `<option value="${e(r.heure)}" selected>${heure(r.heure)}</option>`}${heures.map((h) => `<option value="${h.heure}" data-sv="${h.service}"${h.heure === r.heure ? ' selected' : ''}>${heure(h.heure)} (${h.service})</option>`).join('')}</select></p>
      <p class="esp-champ"><label for="mr-c">Couverts</label><input id="mr-c" name="couverts" type="number" inputmode="numeric" min="1" max="60" value="${e(r.couverts)}"></p>
      <p class="esp-champ"><label for="mr-n">Nom</label><input id="mr-n" name="nom" value="${e(r.nom)}" autocomplete="off"></p>
      <p class="esp-champ"><label for="mr-t">Téléphone</label><input id="mr-t" name="telephone" type="tel" value="${e(r.telephone || '')}" autocomplete="off"></p>
      <p class="esp-champ esp-champ--large"><label for="mr-d">Note <small>allergie, chaise haute, occasion…</small></label><input id="mr-d" name="demande" value="${e(r.demande || '')}" autocomplete="off"></p>
      <p class="esp-frise__form-actions"><button type="submit" class="bouton">Enregistrer</button><button type="button" class="esp-bouton esp-bouton--discret" data-modifier-resa="${e(r.id)}">Fermer</button></p></form>`;
  }
  /* v7.11.0 : chaque ligne dit où en est le groupe et propose sa prochaine action ; les autres restent à portée. */
  const BOUTON = {
    accepter: (r, a) => `data-statut="confirmee" data-id="${e(r.id)}" data-repondre`, refuser: (r) => `data-statut="refusee" data-id="${e(r.id)}"`, proposer: (r) => `data-proposer-horaire="${e(r.id)}"`,
    arrivee: (r) => `data-statut="arrivee" data-id="${e(r.id)}"`, absent: (r) => `data-statut="absente" data-id="${e(r.id)}"`, annuler: (r) => `data-statut="annulee" data-id="${e(r.id)}"`,
    'pas-arrive': (r) => `data-statut="confirmee" data-id="${e(r.id)}"`, remettre: (r) => `data-statut="confirmee" data-id="${e(r.id)}"`,
    installer: (r) => `data-installer="${e(r.id)}"`, 'choisir-table': (r) => `data-choisir-table="${e(r.id)}"`, depart: (r) => `data-depart="${e(r.id)}"`,
    desinstaller: (r) => `data-presence-retirer="${e(r.id)}"`, revenir: (r) => `data-presence-retirer="${e(r.id)}" data-vers="installe"`,
    retard: (r) => `data-outil-ligne="retard" data-id="${e(r.id)}"`, incomplet: (r) => `data-outil-ligne="incomplet" data-id="${e(r.id)}"`,
  };
  const bouton = (r, a, principal) => `<button type="button" class="esp-bouton${a.genre === 'ok' ? ' esp-bouton--ok' : a.genre === 'non' ? ' esp-bouton--non' : ''}${principal ? ' esp-frise__principal' : ''}" ${BOUTON[a.action](r, a)}>${e(a.libelle)}</button>`;
  function outilLigne(r) {
    const o = etat.outilLigne; if (!o || o.id !== r.id) return '';
    return o.type === 'retard' ? `<form class="esp-frise__outil" data-form-retard="${e(r.id)}" aria-label="Retard annoncé par ${e(r.nom || 'ce client')}"><p class="esp-champ"><label for="outil-retard">Retard annoncé</label><select id="outil-retard" name="minutes">${[[0, 'Aucun retard annoncé'], [10, '10 minutes'], [15, '15 minutes'], [20, '20 minutes'], [30, '30 minutes'], [45, '45 minutes']].map(([v, n]) => `<option value="${v}"${v === (r.retardAnnonce || 15) ? ' selected' : ''}>${n}</option>`).join('')}</select></p>
        <p class="esp-frise__form-actions"><button type="submit" class="bouton">Noter</button><button type="button" class="esp-bouton esp-bouton--discret" data-outil-fermer>Fermer</button></p><p class="esp-aide">La table est gardée ; l'alerte de retard se déclenche plus tard d'autant.</p></form>`
      : `<form class="esp-frise__outil" data-form-incomplet="${e(r.id)}" aria-label="Groupe incomplet : ${e(r.nom || 'ce client')}"><p class="esp-champ"><label for="outil-presents">Personnes déjà là <small>sur ${+r.couverts}</small></label><input id="outil-presents" name="presents" type="number" inputmode="numeric" min="0" max="${+r.couverts}" value="${e(r.presents || Math.max(1, +r.couverts - 1))}"></p>
        <p class="esp-frise__form-actions"><button type="submit" class="bouton">Noter</button><button type="button" class="esp-bouton esp-bouton--discret" data-outil-fermer>Fermer</button></p><p class="esp-aide">0 : le groupe est au complet. Le nombre de couverts réservés ne change pas.</p></form>`;
  }
  function ligne(r, sv) {
    const V = X.venues(), ouverte = etat.resaEditee === r.id, hors = ['refusee', 'annulee', 'absent'].includes(r.presence), demande = r.presence === 'demande';
    const autres = demande ? [] : r.autres, visibles = demande ? [r.principale, ...r.autres] : [r.principale].filter(Boolean);
    return `<li class="esp-frise__ligne est-${r.statut} est-p-${r.presence}${ouverte ? ' est-ouverte' : ''}" data-resa="${e(r.id)}" data-presence="${r.presence}">
      <div class="esp-frise__qui"><p class="esp-frise__heure">${heure(r.heure)}</p><div><p class="esp-frise__nom">${X.nomClient(r)} <span class="esp-pastille esp-pastille--${r.statut} esp-pastille--p-${r.presence}">${e(ditPresence(r) || PRESENCES[r.presence] || STATUTS[r.statut])}</span>${r.source === 'passage' ? ' <span class="esp-source">Sans réservation</span>' : r.source === 'attente' ? ' <span class="esp-source">Liste d\'attente</span>' : ''}${V[r.id]?.reconfirmee && ['attendu', 'retard'].includes(r.presence) ? ' <span class="esp-source esp-source--ok">Reconfirmée</span>' : ''}</p>
        <p class="esp-frise__detail">${pluriel(+r.couverts, 'couvert')}${r.table ? ` · ${e(nomPlace(r.table))}` : hors || demande ? '' : ' · pas encore de table'}${r.demande ? ` · <span class="esp-resa__demande">${e(r.demande)}</span>` : ''}${X.allergiesClient(r) ? ` · <span class="esp-resa__allergie">${e(X.allergiesClient(r))}</span>` : ''}</p></div></div>
      <div class="esp-frise__piste" aria-hidden="true">${hors ? '' : `<span class="esp-frise__bloc" style="--d:${part(sv, r.debutMin)};--l:${(((r.finMin - r.debutMin) / (sv.fin - sv.debut)) * 100).toFixed(2)}%"><b>${+r.couverts}</b></span>`}</div>
      <div class="esp-frise__actions">${visibles.map((a, i) => bouton(r, a, i === 0)).join('')}
        <button type="button" class="esp-bouton esp-bouton--discret" data-modifier-resa="${e(r.id)}" aria-expanded="${ouverte}">Modifier</button>
        ${autres.length || (X.lienVenue && X.lienVenue(r)) ? `<details class="esp-frise__plus"><summary class="esp-bouton esp-bouton--discret">Autres actions</summary><p>${autres.map((a) => bouton(r, a, false)).join('')}${X.lienVenue ? X.lienVenue(r) : ''}</p></details>` : ''}</div>
      ${V[r.id]?.modif && !hors ? `<p class="esp-frise__modif" data-modif-client="${e(r.id)}"><span><b>Le client demande un changement&nbsp;:</b> ${heure(V[r.id].modif.heure)}, ${pluriel(+V[r.id].modif.couverts, 'couvert')} (au lieu de ${heure(r.heure)}, ${pluriel(+r.couverts, 'couvert')}). La réservation actuelle est gardée tant que vous n'avez pas répondu.</span>
        <span class="esp-frise__modif-actions"><button type="button" class="esp-bouton esp-bouton--ok" data-venue-reponse="${e(r.id)}" data-accepte="1">Accepter le changement</button><button type="button" class="esp-bouton esp-bouton--non" data-venue-reponse="${e(r.id)}" data-accepte="">Refuser</button></span></p>` : ''}
      ${outilLigne(r)}${ouverte ? editeur(r) : ''}</li>`;
  }
  /* Rappels et reconfirmations : le réglage, où en est chaque réservation, l'aperçu du message. Rien n'est envoyé. */
  function zoneRappels(acc) {
    if (X.ctx().exemples === false) return '';
    const V = X.venues(), d = delaiRappel(S()), l = acc.lignes.filter((r) => r.statut === 'confirmee' && r.date >= A.iso && r.source !== 'passage'); if (!acc.plan.service.tables && !l.length) return '';
    const jour = (r) => (r.date === A.iso ? 'ce ' + (r.service === 'midi' ? 'midi' : 'soir') : fmt(r.date, { weekday: 'long', day: 'numeric', month: 'long' }));
    return `<details class="esp-carte esp-rappels" data-rappels${etat.rappelsOuverts ? ' open' : ''}><summary><h3>Rappels et reconfirmations <span class="esp-source">Aperçu : rien n'est envoyé</span></h3><span class="esp-rappels__resume">${l.length ? `${l.filter((r) => V[r.id]?.reconfirmee).length} ${l.filter((r) => V[r.id]?.reconfirmee).length > 1 ? 'venues reconfirmées' : 'venue reconfirmée'} sur ${l.length}` : 'Aucune réservation confirmée'}</span></summary>
      <p class="esp-champ esp-rappels__reglage"><label for="rappel-delai">Rappeler le client</label><select id="rappel-delai" data-rappel-delai>${DELAIS_RAPPEL.map(([v, n]) => `<option value="${v}"${v === d ? ' selected' : ''}>${n}</option>`).join('')}</select></p>
      ${l.length && d ? `<ul class="esp-rappels__liste">${l.map((r) => { const rp = rappelDe(S(), r, V[r.id], A.iso), url = `${location.origin}${lienVenue(r)}`;
        return `<li><span class="esp-rappels__qui"><b>${heure(r.heure)} · ${e(r.nom || 'Sans nom')}</b> <span class="esp-pastille${rp.reconfirmee ? ' esp-pastille--p-installe' : rp.etat === 'du' ? ' esp-pastille--p-arrive' : ''}">${e(rp.libelle)}</span><small>${rp.reconfirmee ? '' : rp.etat === 'prepare' ? `Partirait le ${e(fmt(rp.du, { weekday: 'long', day: 'numeric', month: 'long' }))}. ` : 'Sans réponse, la réservation reste confirmée : ce n\'est pas une annulation. '}</small></span>
          <details class="esp-att__message"><summary>Voir le message</summary><p>${e(typo(messageRappel(r, { lien: url, telephone: D.telephone, jour: jour(r) })))}</p></details></li>`; }).join('')}</ul>` : `<p class="esp-aide">${d ? 'Aucune réservation confirmée à rappeler pour ce service.' : 'Aucun rappel n\'est prévu.'}</p>`}
      <p class="esp-aide"><b>Les mots&nbsp;:</b> « préparé », le texte est prêt ; « programmé », une date d'envoi est fixée ; « envoyé », le message est parti. Ici, en démonstration, tout est un <b>aperçu</b>&nbsp;: aucun rappel n'est programmé ni envoyé. Délai d'exemple, à régler avec vous.</p></details>`;
  }

  /* La clé d'un passage est tirée à l'ouverture du panneau : un double clic sur « installer » ne note qu'un groupe, deux panneaux ouverts à la suite en notent deux. */
  const nouvelleCle = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  /* « Des clients se présentent » : sans réservation. On dit ce qui est possible maintenant, table par table. */
  function passage(id) {
    const p = etat.passage; if (!p) return '';
    const n = Math.max(1, Math.round(+p.couverts) || 2), o = pourUnPassage(ctx(), S(), D.salle, { couverts: n, service: id, minute: A.min });
    return `<article class="esp-carte esp-passage" aria-labelledby="t-passage" data-passage-carte><h3 id="t-passage">Des clients se présentent <span class="esp-source">Sur cet appareil</span></h3>
      <form class="esp-passage__form" data-form-passage>
        <p class="esp-champ"><label for="pa-n">Personnes</label><input id="pa-n" name="couverts" type="number" inputmode="numeric" min="1" max="20" value="${n}" data-passage-couverts></p>
        <p class="esp-champ"><label for="pa-nom">Nom <small>facultatif</small></label><input id="pa-nom" name="nom" maxlength="60" autocomplete="off" value="${e(p.nom || '')}"></p>
        <p class="esp-champ esp-champ--large"><label for="pa-note">Une contrainte <small>facultatif : poussette, allergie, pressés…</small></label><input id="pa-note" name="demande" maxlength="120" autocomplete="off" value="${e(p.demande || '')}"></p>
        <p class="esp-passage__heure">Arrivée notée à ${heure(hhmm(A.min))}, pour ${pluriel(n, 'personne')}.</p>
        <div class="esp-passage__choix" data-passage-choix aria-live="polite">
          ${o.places.length ? `<h4>Les installer maintenant</h4><ul class="esp-passage__places">${o.places.slice(0, 5).map((x) => `<li><button type="submit" class="esp-bouton esp-bouton--ok" name="table" value="${e(x.id)}">${e(x.nom.replace(/^./, (c) => c.toUpperCase()))}</button><span>${e(x.zone)} · ${e(x.raison)}${x.assemblage ? ' Deux tables à rapprocher.' : ''}</span></li>`).join('')}</ul>`
            : `<p class="esp-passage__rien"><b>Aucune table prête pour ${pluriel(n, 'personne')} en ce moment.</b>${o.prochaine ? ` D'après les durées prévues, la table ${e(o.prochaine.id)} pourrait se libérer vers ${heure(o.prochaine.heure)} : c'est une estimation, pas un engagement.` : ''}</p>`}
          <details class="esp-passage__pourquoi"><summary>Pourquoi pas les autres tables ?</summary><ul>${o.refus.map((x) => `<li><b>${e(nomPlace(x.id).replace(/^./, (c) => c.toUpperCase()))}</b> : ${e(x.raison)}</li>`).join('')}</ul></details>
          <h4>Ou bien</h4>
          <p class="esp-passage__autres"><button type="submit" class="esp-bouton" name="table" value="">Ils attendent sur place</button><button type="button" class="esp-bouton" data-passage-attente>Les inscrire en liste d'attente</button><button type="button" class="esp-bouton esp-bouton--discret" data-passage-fermer>Fermer sans rien noter</button></p>
        </div></form></article>`;
  }
  /* Les tables qui demandent un geste, et le compte des autres. */
  function zoneTables(acc) {
    const n = (k) => (acc.tables[k] || []).filter((t) => !t.horsSaison).length, l = acc.aRemettre, cle = cleSalle(etat.jour, acc.plan.service.service);
    if (!acc.plan.service.tables && !l.length) return '';
    return `<article class="esp-carte esp-tables-etat" aria-labelledby="t-tables-etat" data-tables-etat="${e(cle)}"><h3 id="t-tables-etat">Les tables <small>${[`${n('prete')} ${n('prete') > 1 ? 'prêtes' : 'prête'}`, n('occupee') ? `${n('occupee')} ${n('occupee') > 1 ? 'occupées' : 'occupée'}` : '', l.length ? `${l.length} à remettre en état` : '', n('indisponible') ? `${n('indisponible')} ${n('indisponible') > 1 ? 'indisponibles' : 'indisponible'}` : ''].filter(Boolean).join(' · ')}</small></h3>
      ${l.length ? `<ul class="esp-tables-etat__liste">${l.map((t) => `<li data-table-etat="${e(t.id)}"><span><b>Table ${e(t.id)}</b> <span class="esp-pastille esp-pastille--t-${t.etat}">${ETATS_TABLE[t.etat]}</span></span>
          <span class="esp-tables-etat__actions">${t.etat === 'a-debarrasser' ? `<button type="button" class="esp-bouton" data-etat-table="${e(t.id)}" data-etat="a-preparer">Débarrassée</button>` : ''}<button type="button" class="esp-bouton esp-bouton--ok" data-etat-table="${e(t.id)}" data-etat="">Table prête</button></span></li>`).join('')}</ul>` : '<p class="esp-aide">Aucune table à remettre en état.</p>'}
      ${acc.bloquees.length ? `<ul class="esp-tables-etat__alertes">${acc.bloquees.map((b) => `<li><b>${heure(b.resa.heure)} · ${e(b.resa.nom || 'Sans nom')}</b> : la table ${e(b.table.id)} n'est pas prête (${e(b.raison)}).</li>`).join('')}</ul>` : ''}
      <p class="esp-plus"><button type="button" class="esp-lien" data-onglet="salle" data-onglets-resas>Ouvrir le plan de salle</button></p></article>`;
  }
  function zoneAttente(id) {
    if (!X.attenteActive?.()) return '';
    const tous = listeAttente(ctx(), S()).filter((x) => x.date === etat.jour && x.periode === id && ['en-attente', 'proposee', 'expiree'].includes(x.etat)); if (!tous.length) return '';
    const comp = compatiblesPour(ctx(), S(), D.salle, etat.jour, id);
    return `<p class="esp-attente-rappel" data-attente-rappel><b>Liste d'attente pour ce service&nbsp;:</b> ${pluriel(tous.length, 'demande')}${comp.length ? `, dont ${comp.length} à qui une place peut être proposée maintenant` : ', aucune place à proposer pour l\'instant'}. <button type="button" class="esp-lien" data-onglet="attente" data-onglets-resas>Ouvrir la liste d'attente</button></p>`;
  }

  /** Dessine l'onglet dans `cible`. */
  function rendre(cible) {
    const id = svVu(), acc = accueilDuService(ctx(), S(), D.salle, etat.jour, id, etat.jour === A.iso ? A.min : 0), sv = acc.plan.service, svs = servicesDe(D.reservation), max = Math.max(6, sv.pic?.couverts || 0); /* la frise se lit par rapport au coup de feu du service */
    const jourMeme = etat.jour === A.iso, local = X.ctx().exemples !== false, P = (k) => (acc.parPresence[k] || []).length;
    if (!jourMeme || !local) etat.passage = null;
    const heures = []; for (let t = Math.ceil(sv.debut / 60) * 60; t <= sv.fin; t += 60) heures.push(t);
    const maintenant = etat.jour === A.iso && A.min >= sv.debut && A.min <= sv.fin ? A.min : null;
    const resume = [pluriel(sv.tables, 'réservation'), `${pluriel(sv.couverts, 'couvert')} attendus`.replace(/^1 couvert attendus/, '1 couvert attendu'), P('retard') ? `${P('retard')} en retard` : '', P('arrive') ? `${P('arrive')} à installer` : '', P('installe') ? `${P('installe')} ${P('installe') > 1 ? 'installés' : 'installé'}` : '', P('parti') ? `${P('parti')} ${P('parti') > 1 ? 'partis' : 'parti'}` : '', sv.absents ? pluriel(sv.absents, 'absent') : '', sv.aConfirmer ? `${pluriel(sv.aConfirmer, 'demande')} pour ce service` : '', P('non-traitee') ? `${P('non-traitee')} à préciser` : ''].filter(Boolean).join(' · ');
    cible.innerHTML = `
      <div class="esp-service-tete"><div><h3><button type="button" class="esp-rond esp-rond--petit" data-jour-pas="-1" aria-label="Jour précédent"><span aria-hidden="true">‹</span></button> ${e(maj(fmt(etat.jour)))} <button type="button" class="esp-rond esp-rond--petit" data-jour-pas="1" aria-label="Jour suivant"><span aria-hidden="true">›</span></button>${etat.jour === A.iso ? ' <span class="esp-pastille">Aujourd\'hui</span>' : ''}</h3>
          <p class="esp-service-tete__resume">${sv.ouvert || sv.resas.length ? e(resume) : 'Pas de service.'}${sv.complet ? ' · <span class="esp-pastille esp-pastille--refusee">Complet</span>' : ''}</p></div>
        <p class="esp-service-tete__outils"><span class="esp-choix" role="group" aria-label="Le service à voir">${svs.map((s) => `<button type="button" class="esp-choix__b" data-service-vu="${s.id}" aria-pressed="${s.id === id}">${s.libelle}</button>`).join('')}</span>
          ${jourMeme && local && (sv.ouvert || sv.resas.length) ? `<button type="button" class="esp-bouton esp-bouton--ok" data-passage aria-expanded="${!!etat.passage}">Des clients se présentent</button>` : ''}
          <button type="button" class="esp-bouton" data-briefing="${etat.jour}|${id}">Préparer le service</button>
          <button type="button" class="esp-bouton" data-imprimer-service>${ICO_IMPR}<span>Imprimer la feuille</span></button></p></div>
      ${typo(passage(id) + zoneAttente(id))}
      ${sv.tables ? `<article class="esp-carte esp-charge" aria-labelledby="t-charge"><h3 id="t-charge">Couverts à table${sv.pic?.couverts ? ` <small>coup de feu à ${heure(hhmm(sv.pic.t))} : ${pluriel(sv.pic.couverts, 'couvert')}</small>` : ''}</h3>
        <div class="esp-charge__graphe" role="img" aria-label="Couverts à table, quart d'heure par quart d'heure, de ${heure(hhmm(sv.debut))} à ${heure(hhmm(sv.fin))}. Maximum : ${sv.pic?.couverts || 0} à ${heure(hhmm(sv.pic?.t || sv.debut))}.">
          ${sv.charge.map((c) => `<span class="esp-charge__barre${c === sv.pic ? ' est-pic' : ''}" style="--h:${(c.couverts / max).toFixed(3)}" data-info="${heure(hhmm(c.t))} · ${c.couverts} couv.">${c === sv.pic ? `<b>${c.couverts}</b>` : ''}</span>`).join('')}
          ${maintenant != null ? `<span class="esp-charge__maintenant${(maintenant - sv.debut) / (sv.fin - sv.debut) > 0.6 ? ' est-fin' : ''}" style="--d:${part(sv, maintenant)}"><span>maintenant</span></span>` : ''}</div>
        <p class="esp-charge__axe" aria-hidden="true">${heures.map((t) => `<span style="--d:${part(sv, t)}">${heure(hhmm(t))}</span>`).join('')}</p>
        <p class="esp-aide">Un repas compte ${dureeDe(id) / 60 === Math.floor(dureeDe(id) / 60) ? `${dureeDe(id) / 60} h` : `${Math.floor(dureeDe(id) / 60)} h ${dureeDe(id) % 60}`} à table : durée indicative, à régler avec vous.</p>
        <details class="esp-tableau"><summary>Voir en tableau</summary><div class="esp-table-defile" tabindex="0" role="group" aria-label="Couverts à table, en tableau"><table class="esp-bilan-table"><caption class="visuellement-cache">Couverts à table par quart d'heure</caption><thead><tr><th scope="col">Heure</th><th scope="col">Couverts à table</th></tr></thead><tbody>${sv.charge.map((c) => `<tr><th scope="row">${heure(hhmm(c.t))}</th><td>${c.couverts}</td></tr>`).join('')}</tbody></table></div></details></article>` : ''}
      ${sv.resas.length ? `<div class="esp-frise" style="--n:${heures.length}"><p class="esp-frise__axe" aria-hidden="true"><span></span><span class="esp-frise__heures">${heures.map((t) => `<span style="--d:${part(sv, t)}">${heure(hhmm(t))}</span>`).join('')}</span><span></span></p>
        <ol class="esp-frise__liste">${acc.lignes.map((r) => ligne(r, sv)).join('')}</ol></div>${local ? typo(zoneTables(acc) + zoneRappels(acc)) : ''}
        ${local ? '<p class="esp-aide esp-portee"><span class="esp-source">Sur cet appareil</span> Arrivées, installations, départs et état des tables sont notés sur cet appareil.</p>' : '<p class="esp-aide esp-portee"><span class="esp-source">Sur cet appareil</span> Les réservations et leurs tables sont partagées. Installations, départs et état des tables restent notés sur cet appareil pour l\'instant.</p>' + zoneTables(acc)}`
        : `<p class="esp-vide">${sv.ouvert ? 'Pas encore de réservation pour ce service. <button type="button" class="esp-lien" data-onglet="agenda" data-onglets-resas>Noter une réservation dans l\'agenda</button>' : 'Pas de service ce jour-là.'}</p>`}`;
    if (cible.querySelector('[data-modif-client]')) X.demoVu?.('venue-demande-vue');
  }

  /** La feuille de service, pour la salle et la cuisine : une page, l'heure, le nom, les couverts, la note, une case à cocher. */
  function feuille() {
    const id = svVu(), sv = serviceDuJour(ctx(), S(), etat.jour, id), l = sv.resas.filter((r) => !['refusee', 'annulee'].includes(r.statut));
    return `<header><p class="esp-feuille__maison">Les Jardins de l'Hacienda</p><h1>Feuille de service</h1><p class="esp-feuille__quand">${e(maj(fmt(etat.jour, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })))}, ${id === 'midi' ? 'midi' : 'soir'} · ${pluriel(sv.couverts, 'couvert')} · ${pluriel(sv.tables, 'table')}${sv.pic?.couverts ? ` · coup de feu à ${heure(hhmm(sv.pic.t))}` : ''}</p></header>
      <table><thead><tr><th>Heure</th><th>Nom</th><th>Couv.</th><th>Note</th><th>Téléphone</th><th>Table</th><th>Arrivés</th></tr></thead>
      <tbody>${l.map((r) => `<tr><td>${heure(r.heure)}</td><td>${e(r.nom || 'Sans nom')}${r.statut === 'a-confirmer' ? ' <em>(à confirmer)</em>' : r.statut === 'absente' ? ' <em>(absent)</em>' : ''}</td><td>${+r.couverts}</td><td>${e(typo([r.demande, X.allergiesClient(r)].filter(Boolean).join(' · ')))}</td><td>${e(r.telephone || '')}</td><td>${e(r.table || '')}</td><td><span class="esp-feuille__case${r.statut === 'arrivee' ? ' est-cochee' : ''}"></span></td></tr>`).join('') || '<tr><td colspan="7">Aucune réservation.</td></tr>'}</tbody></table>
      <footer><p>Démonstration : réservations d'exemple, noms inventés.</p></footer>`;
  }
  function imprimer() {
    document.querySelector('.esp-feuille')?.remove();
    const f = document.createElement('div'); f.className = 'esp-feuille'; f.innerHTML = feuille(); document.body.append(f);
    document.documentElement.classList.add('esp-impression');
    const fin = () => { document.documentElement.classList.remove('esp-impression'); f.remove(); removeEventListener('afterprint', fin); };
    addEventListener('afterprint', fin);
    try { print(); } catch { fin(); X.dire('L\'impression n\'a pas pu démarrer sur ce navigateur.'); }
  }

  function clic(t) {
    const sv = t.closest('[data-service-vu]'); if (sv) { etat.serviceVu = sv.dataset.serviceVu; etat.resaEditee = null; X.rendre(); $(`[data-service-vu="${etat.serviceVu}"]`, root)?.focus(); return true; }
    if (t.closest('[data-imprimer-service]')) { imprimer(); return true; }
    if (t.closest('[data-lien-venue]')) { X.demoVu?.('venue-ouverte'); return false; } /* le lien s'ouvre normalement ; l'étape du scénario est notée */
    /* v7.11.0 : l'accueil pendant le service. */
    const vr = t.closest('[data-venue-reponse]'); if (vr) { X.repondreVenue(vr.dataset.venueReponse, !!vr.dataset.accepte); X.rendre(); $(`[data-esp-panneau-resas] [data-resa="${CSS.escape(vr.dataset.venueReponse)}"] .esp-frise__principal`, root)?.focus({ preventScroll: true }); return true; }
    const revenir = (id) => { X.rendre(); const li = $(`[data-esp-panneau-resas] [data-resa="${CSS.escape(id)}"]`, root); (li?.querySelector('.esp-frise__principal') || li?.querySelector('summary') || $(`[data-table="${CSS.escape(etat.tableVue || '')}"]`, root))?.focus({ preventScroll: true }); };
    const ins = t.closest('[data-installer]'); if (ins) { const r = X.trouverResaDuJour(ins.dataset.installer); agir('installer', { id: ins.dataset.installer, minute: A.min }, { msg: `${r?.nom || 'Le groupe'} : installé, ${nomPlace(r?.table || '')}.` }); revenir(ins.dataset.installer); return true; }
    const dep = t.closest('[data-depart]'); if (dep) { const id = dep.dataset.depart, r = X.trouverResaDuJour(id), acc = accueilDuService(ctx(), S(), D.salle, etat.jour, svVu(), A.min), tables = r ? tablesDeLaResa(acc.plan, r) : [];
      agir('depart', { id, minute: A.min, cle: cleSalle(etat.jour, svVu()), tables }, { msg: `${r?.nom || 'Le groupe'} est parti. ${tables.length > 1 ? `Tables ${tables.join(' et ')} à débarrasser` : tables.length ? `Table ${tables[0]} à débarrasser` : ''}.` }); revenir(id); return true; }
    const pr = t.closest('[data-presence-retirer]'); if (pr) { agir('presenceRetirer', { id: pr.dataset.presenceRetirer, vers: pr.dataset.vers || '' }, { msg: pr.dataset.vers ? 'Le groupe est de nouveau à table.' : 'Le groupe attend de nouveau sa table.' }); revenir(pr.dataset.presenceRetirer); return true; }
    const ct = t.closest('[data-choisir-table]'); if (ct) { etat.resaAPlacer = ct.dataset.choisirTable; etat.tableVue = null; etat.ongletResas = 'salle'; X.rendre(); $('[data-salle]', root)?.scrollIntoView({ block: 'nearest' }); $(`[data-choisir-resa="${CSS.escape(etat.resaAPlacer)}"]`, root)?.focus({ preventScroll: true }); return true; }
    const ol = t.closest('[data-outil-ligne]'); if (ol) { etat.outilLigne = { id: ol.dataset.id, type: ol.dataset.outilLigne }; etat.resaEditee = null; X.rendre(); $('.esp-frise__outil select, .esp-frise__outil input', root)?.focus(); return true; }
    if (t.closest('[data-outil-fermer]')) { const id = etat.outilLigne?.id; etat.outilLigne = null; if (id) revenir(id); else X.rendre(); return true; }
    const et = t.closest('[data-etat-table]'); if (et) { const id = et.dataset.etatTable, v = et.dataset.etat, cle = et.closest('[data-tables-etat]')?.dataset.tablesEtat || cleSalle(etat.jour, svVu());
      agir('etatTable', { cle, table: id, etat: v }, { msg: `Table ${id} : ${(ETATS_TABLE[v || 'prete']).toLowerCase()}.` }); X.rendre(); ($(`[data-table-etat="${CSS.escape(id)}"] button`, root) || $('[data-fiche-table] [data-etat-table]', root) || $('[data-tables-etat] button', root) || $(`[data-table="${CSS.escape(id)}"]`, root))?.focus({ preventScroll: true }); return true; }
    if (t.closest('[data-passage]')) { etat.passage = etat.passage ? null : { couverts: 2, cle: nouvelleCle() }; X.rendre(); (etat.passage ? $('#pa-n', root) : $('[data-passage]', root))?.focus(); return true; }
    if (t.closest('[data-passage-fermer]')) { etat.passage = null; X.rendre(); $('[data-passage]', root)?.focus(); return true; }
    if (t.closest('[data-passage-attente]')) { const f = $('[data-form-passage]', root), v = Object.fromEntries(new FormData(f)); etat.attenteAjout = { nom: v.nom || '', couverts: v.couverts, date: A.iso, periode: svVu(), note: v.demande || '' }; etat.passage = null; etat.ongletResas = 'attente'; X.rendre(); $('[data-form-attente] [name="nom"]', root)?.focus(); return true; }
    const ph = t.closest('[data-proposer-horaire]'); if (ph) { etat.resaEditee = ph.dataset.proposerHoraire; etat.outilLigne = null; X.rendre(); $('#mr-h', root)?.focus(); return true; }
    const m = t.closest('[data-modifier-resa]'); if (m) { const id = m.dataset.modifierResa, ouvrir = etat.resaEditee !== id; etat.resaEditee = ouvrir ? id : null; X.rendre(); (ouvrir ? $('#mr-h', root) : $(`[data-resa="${CSS.escape(id)}"] [data-modifier-resa]`, root))?.focus(); return true; }
    return false;
  }
  function envoi(f, ev) {
    if (f.matches('[data-form-retard]')) { const id = f.dataset.formRetard, m = +f.elements.minutes.value; agir('retardAnnonce', { id, minutes: m }, { msg: m ? `Retard annoncé : ${m} minutes. La table est gardée.` : 'Plus de retard annoncé.' }); etat.outilLigne = null; X.rendre(); $(`[data-esp-panneau-resas] [data-resa="${CSS.escape(id)}"] .esp-frise__principal`, root)?.focus({ preventScroll: true }); return true; }
    if (f.matches('[data-form-incomplet]')) { const id = f.dataset.formIncomplet, n = Math.round(+f.elements.presents.value) || 0; agir('groupeIncomplet', { id, presents: n }, { msg: n ? `Groupe incomplet : ${n} ${n > 1 ? 'personnes sont là' : 'personne est là'}.` : 'Groupe au complet.' }); etat.outilLigne = null; X.rendre(); $(`[data-esp-panneau-resas] [data-resa="${CSS.escape(id)}"] .esp-frise__principal`, root)?.focus({ preventScroll: true }); return true; }
    if (f.matches('[data-form-passage]')) {
      const v = Object.fromEntries(new FormData(f)), table = ev?.submitter?.name === 'table' ? ev.submitter.value : '', p = etat.passage || { cle: nouvelleCle() }, sv = svVu();
      const resa = resaDePassage({ cle: p.cle, auj: A.iso, minute: A.min, service: sv, couverts: v.couverts, nom: v.nom, demande: v.demande, table });
      if (agir('passage', { resa, installer: !!table, minute: A.min }, { msg: table ? `${pluriel(resa.couverts, 'personne')} sans réservation : installées, ${nomPlace(table)}.`.replace('1 personne sans réservation : installées', '1 personne sans réservation : installée') : `${pluriel(resa.couverts, 'personne')} sans réservation : elles attendent sur place.`.replace('1 personne sans réservation : elles attendent', '1 personne sans réservation : elle attend') })) etat.passage = null;
      X.rendre(); X.viser($(`[data-esp-panneau-resas] [data-resa="${CSS.escape(resa.id)}"]`, root), 'center'); ($(`[data-esp-panneau-resas] [data-resa="${CSS.escape(resa.id)}"] .esp-frise__principal`, root) || $('[data-passage]', root))?.focus({ preventScroll: true }); return true;
    }
    if (!f.matches('[data-form-resa]')) return false;
    const id = f.dataset.formResa, v = Object.fromEntries(new FormData(f)), svChoisi = f.elements.heure.selectedOptions[0]?.dataset.sv;
    const champs = { heure: v.heure, couverts: v.couverts, nom: v.nom, telephone: v.telephone, demande: v.demande, ...(svChoisi ? { service: svChoisi } : {}) };
    /* Si la table ne convient plus, les règles du dépôt la retirent dans le même enregistrement et le disent (v7.8.1). */
    if (agir('modifierResa', { id, champs }, { msg: 'Réservation modifiée.' })) { etat.resaEditee = null; if (svChoisi) etat.serviceVu = svChoisi; }
    X.rendre(); X.viser($(`[data-esp-panneau-resas] [data-resa="${CSS.escape(id)}"]`, root), 'center'); $(`[data-esp-panneau-resas] [data-resa="${CSS.escape(id)}"] [data-modifier-resa]`, root)?.focus({ preventScroll: true });
    return true;
  }
  root.addEventListener('change', (ev) => { const c = ev.target.closest?.('[data-rappel-delai]'); if (!c) return; etat.rappelsOuverts = true; agir('rappelReglage', { delai: +c.value }, { msg: +c.value ? `Rappel : ${c.selectedOptions[0].textContent.toLowerCase()}. Réglage noté sur cet appareil ; aucun message n'est envoyé.` : 'Aucun rappel ne sera proposé.' }); X.rendre(); $('[data-rappel-delai]', root)?.focus(); });
  root.addEventListener('toggle', (ev) => { if (ev.target.matches?.('[data-rappels]')) etat.rappelsOuverts = ev.target.open; }, true);
  /* Le nombre de personnes change : les tables possibles sont recalculées, sans perdre la saisie. */
  root.addEventListener('input', (ev) => { const c = ev.target.closest?.('[data-passage-couverts]'); if (!c || !etat.passage) return; const f = c.form, v = Object.fromEntries(new FormData(f)); Object.assign(etat.passage, { couverts: v.couverts, nom: v.nom, demande: v.demande });
    const tmp = document.createElement('div'); tmp.innerHTML = typo(passage(svVu())); const neuf = tmp.querySelector('[data-passage-choix]'), heureDite = tmp.querySelector('.esp-passage__heure'); if (neuf) $('[data-passage-choix]', root).replaceWith(neuf); if (heureDite) $('.esp-passage__heure', root).replaceWith(heureDite); });
  return { rendre, clic, envoi, feuille, serviceVu: svVu };
}
