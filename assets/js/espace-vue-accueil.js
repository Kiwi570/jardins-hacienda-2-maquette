/* La rubrique « Aujourd'hui » (v7.10.0) : le prochain service, les priorités, le fil de la journée, les tâches, et le
   briefing d'un service (« Préparer le service »). Tout est lu par espace-accueil.js dans les mêmes données que les
   autres rubriques : un compteur d'ici ouvre toujours la liste qui le compose.
   Les tâches et l'aperçu des vues métier sont gardés dans ce navigateur ; l'écran le dit. */
import { fmt, maj, heure, pluriel, typo, ajouter, servicesDe, hhmm } from './espace-regles.js?v=7';
import { accueil, resumeService, nomService, cleService, filDuJour, GRANDE_TABLEE } from './espace-accueil.js?v=7';
import { nouvelleTache, tachesDuJour, tachesLiees } from './espace-taches.js?v=7';

const VUES_METIER = [['direction', 'Direction', 'Tout : le service, ce qui attend une décision, la journée et les tâches.'], ['accueil', 'Accueil', 'D\'abord les demandes et les réponses à donner, puis le service.'],
  ['salle', 'Salle', 'Le service à venir, les tables à placer, les arrivées.'], ['cuisine', 'Cuisine', 'Les couverts, les grandes tablées, les allergies et les notes.']];
const ORDRE = { direction: ['service', 'priorites', 'fil', 'taches', 'site'], accueil: ['priorites', 'service', 'fil', 'taches', 'site'], salle: ['service', 'priorites', 'fil', 'taches'], cuisine: ['service', 'fil', 'taches'] };
const ETAT_TACHE = { retard: 'En retard', jour: 'Aujourd\'hui', venir: '', libre: '', faite: 'Terminée' };
const TYPE_LIEN = { demande: 'Demande', resa: 'Réservation', service: 'Service', client: 'Client' };

export function creerAccueil(X) {
  const { root, $, e, S, A, D, ctx, etat, agir, dire } = X;
  const C = () => ({ ...ctx(), agenda: D.agenda, pages: D.pages });
  const lireVue = () => { try { return sessionStorage.getItem('jh-espace-vue-metier') || 'direction'; } catch { return 'direction'; } };
  etat.vueMetier = lireVue(); etat.tacheEditee = null; etat.tacheLien = null; etat.briefing = null;
  const connecte = () => ctx().exemples === false;
  const dateCourte = (iso) => (iso === A.iso ? 'aujourd\'hui' : iso === ajouter(A.iso, 1) ? 'demain' : fmt(iso, { weekday: 'short', day: 'numeric', month: 'short' }));

  /* ---------- Zone A : le prochain service ---------- */
  function zoneService(p, vue) {
    if (!p) return `<section class="esp-carte esp-carte--large esp-acc__service" aria-labelledby="t-prochain"><p class="esp-acc__sur">Le prochain service</p><h3 id="t-prochain">Aucun service ouvert dans les quinze jours</h3>
      <p class="esp-vide">Les horaires et les fermetures se règlent dans Site. <button type="button" class="esp-lien" data-aller="site" data-onglet="horaires">Voir les horaires</button></p></section>`;
    const chiffre = (n, mot, plus = '') => `<li${plus}><b>${n}</b> <span>${mot}</span></li>`;
    const att = p.attentions, cuisine = vue === 'cuisine';
    return `<section class="esp-carte esp-carte--large esp-acc__service" aria-labelledby="t-prochain" data-prochain="${e(cleService(p.date, p.service))}">
      <p class="esp-acc__sur">${p.enCours ? 'Le service en cours' : 'Le prochain service'}</p>
      <h3 id="t-prochain">${e(p.nom)} <small>arrivées de ${heure(hhmm(servicesDe(ctx().R).find((s) => s.id === p.service).d))} à ${heure(hhmm(servicesDe(ctx().R).find((s) => s.id === p.service).f))}</small>${p.complet ? ' <span class="esp-pastille esp-pastille--a-confirmer">Complet</span>' : ''}</h3>
      <ul class="esp-acc__chiffres">
        ${chiffre(p.confirmees, p.confirmees > 1 ? 'réservations confirmées' : 'réservation confirmée')}
        ${chiffre(p.couvertsAttendus, p.couvertsAttendus > 1 ? 'couverts attendus' : 'couvert attendu')}
        ${p.accueillies ? chiffre(p.couvertsAccueillis, p.couvertsAccueillis > 1 ? 'personnes déjà accueillies' : 'personne déjà accueillie') : ''}
        ${cuisine ? '' : chiffre(p.demandes.length, p.demandes.length > 1 ? 'demandes à traiter' : 'demande à traiter', p.demandes.length ? ' class="est-alerte"' : '')}
        ${chiffre(p.grandes.length, p.grandes.length > 1 ? `grandes tablées (${GRANDE_TABLEE} couverts et plus)` : `grande tablée (${GRANDE_TABLEE} couverts et plus)`)}
        ${cuisine ? '' : chiffre(p.aPlacer.length, 'à placer en salle', p.aPlacer.length ? ' class="est-alerte"' : '')}
      </ul>
      ${att.length ? `<p class="esp-acc__savoir"><b>À savoir&nbsp;:</b> ${att.slice(0, cuisine ? 8 : 3).map((r) => `${e(r.nom || 'Sans nom')} (${e(typo([r.allergies.length ? `allergie : ${r.allergies.join(', ')}` : '', r.demande, r.noteClient].filter(Boolean).join(' ; ')))})`).join(' · ')}${att.length > (cuisine ? 8 : 3) ? ` · et ${att.length - (cuisine ? 8 : 3)} de plus dans le briefing` : ''}</p>` : ''}
      <p class="esp-acc__actions"><button type="button" class="bouton" data-briefing="${e(cleService(p.date, p.service))}">Préparer le service</button>
        <button type="button" class="esp-bouton" data-aller-service="${e(cleService(p.date, p.service))}" data-onglet-service="${vue === 'salle' ? 'salle' : 'service'}">${vue === 'salle' ? 'Ouvrir la salle' : 'Voir le service'}</button></p>
    </section>`;
  }

  /* ---------- Zone B : les priorités, puis les demandes qui attendent ---------- */
  function zonePriorites(a, vue) {
    /* Les demandes en attente sont listées juste dessous, la plus ancienne d'abord : elles ne sont pas répétées en priorité. */
    const { ligneResa } = X, att = X.enAttente(), autres = [...X.demandesEnAttente()].sort((x, y) => String(x.cree).localeCompare(String(y.cree))), total = att.length + autres.length;
    const DEMANDES = ['table', 'reception', 'traiteur', 'cadeau', 'question'];
    const l = a.priorites.filter((c) => (vue === 'salle' ? ['salle', 'complet', 'tache'].includes(c.genre) : !DEMANDES.includes(c.genre))), vus = l.slice(0, 4);
    const prio = vus.length ? `<ol class="esp-conseils__liste esp-prio">${vus.map((c) => `<li class="esp-conseil" data-conseil="${e(c.id)}"><div class="esp-conseil__texte"><p class="esp-conseil__titre">${e(typo(c.titre))}</p><p class="esp-conseil__detail">${e(typo(c.raison))}</p></div>
        <p class="esp-conseil__actions"><button type="button" class="esp-bouton esp-bouton--ok" ${c.directe ? `data-faire-priorite="${e(c.id)}"` : `data-faire-conseil="${e(c.id)}"`}>${e(c.bouton)}</button><button type="button" class="esp-bouton esp-bouton--discret" data-taire-conseil="${e(c.id)}">Plus tard</button></p></li>`).join('')}</ol>
        ${l.length > 4 ? `<p class="esp-aide esp-conseils__reste">Et ${pluriel(l.length - 4, 'autre point')} ensuite.</p>` : ''}` : '';
    const demandes = vue === 'salle' ? '' : `<div class="esp-acc__attente"><h4 id="t-attente">Les demandes qui attendent une réponse${total ? ` <span class="esp-acc__compte">${total}</span>` : ''}</h4>
        ${total ? `${att.length ? `<ul class="esp-resas">${att.slice(0, 4).map((r) => ligneResa(r, true)).join('')}</ul>` : ''}${autres.length ? `<ul class="esp-dems">${autres.slice(0, 4).map((d) => X.carteDemande(d)).join('')}</ul>` : ''}`
          : '<p class="esp-vide esp-vide--fete"><span class="esp-vide__sceau" aria-hidden="true"></span><span><b>Tout a une réponse.</b> Les prochaines demandes faites sur le site arriveront ici.</span></p>'}
        <p class="esp-plus"><button type="button" class="esp-lien" data-aller="demandes">${total > Math.min(att.length, 4) + Math.min(autres.length, 4) ? `Voir les ${total} demandes` : 'Ouvrir les demandes'}</button></p></div>`;
    return `<section class="esp-carte esp-carte--large esp-conseils esp-acc__priorites" aria-labelledby="t-priorites"><h3 id="t-priorites">Les priorités</h3>
      ${prio || (total && vue !== 'salle' ? '' : '<p class="esp-vide">Rien ne presse pour l\'instant. Ce qui demandera une décision apparaîtra ici.</p>')}${demandes}</section>`;
  }

  /* ---------- Zone C : le fil de la journée ---------- */
  function zoneFil(a, vue) {
    const l = a.fil.filter((x) => vue !== 'cuisine' || x.type !== 'reception' || x.ferme);
    return `<section class="esp-carte esp-acc__fil" aria-labelledby="t-fil"><h3 id="t-fil">Le fil de la journée</h3>
      ${l.length ? `<ol class="esp-fil">${l.map((x) => `<li class="esp-fil__item est-${x.type}${x.ferme ? '' : ' est-demande'}">
          <span class="esp-fil__heure">${x.heureConnue ? heure(x.heure) : (x.detail && /midi|soir/i.test(x.detail) ? e(x.detail.replace(/^(À|Le) /, '')) : 'Dans la journée')}</span>
          <span class="esp-fil__quoi"><span class="esp-fil__type">${e(x.libelleType)}</span><b>${e(x.titre)}</b>${x.detail && x.heureConnue ? `<small>${e(typo(x.detail))}</small>` : x.detail && !/^(À midi|Le soir)$/.test(x.detail) ? `<small>${e(typo(x.detail))}</small>` : ''}</span>
          ${x.statut ? `<span class="esp-pastille${x.ferme ? '' : ' esp-pastille--a-confirmer'}">${e(x.statut)}</span>` : ''}
          <button type="button" class="esp-lien" data-fil="${e(x.cle)}" aria-label="Ouvrir : ${e(x.titre)}">Ouvrir</button></li>`).join('')}</ol>`
        : `<p class="esp-vide">Journée calme&nbsp;: pas de service ni d'activité datée aujourd'hui.</p>
           <p class="esp-plus"><button type="button" class="esp-lien" data-aller="resas">Ouvrir l'agenda</button> <button type="button" class="esp-lien" data-aller="carte">Modifier la carte</button> <button type="button" class="esp-lien" data-tache-nouvelle>Ajouter une tâche</button></p>`}
      ${l.length ? '<p class="esp-plus"><button type="button" class="esp-lien" data-aller="resas">Ouvrir l\'agenda</button> <button type="button" class="esp-lien" data-aller="resas" data-onglet-resas="bilan">Voir le bilan de la semaine</button></p>' : ''}</section>`;
  }

  /* ---------- Zone D : les tâches ---------- */
  function formulaireTache(t) {
    const lien = t ? t.lien : etat.tacheLien, id = t ? t.id : 'nouvelle';
    return `<form class="esp-tache-form" data-form-tache="${e(id)}" aria-label="${t ? `Modifier la tâche : ${e(t.titre)}` : 'Nouvelle tâche'}">
      <p class="esp-champ esp-champ--large"><label for="tache-titre-${e(id)}">Ce qu'il y a à faire</label><input id="tache-titre-${e(id)}" name="titre" required maxlength="140" autocomplete="off" value="${e(t ? t.titre : etat.tacheLien?.titre || '')}" placeholder="Rappeler le fleuriste, vérifier la terrasse…"></p>
      <p class="esp-champ"><label for="tache-ech-${e(id)}">Pour le <small>facultatif</small></label><input id="tache-ech-${e(id)}" name="echeance" type="date" value="${e(t ? t.echeance || '' : etat.tacheLien?.echeance || '')}"></p>
      <p class="esp-champ"><label for="tache-qui-${e(id)}">Qui s'en occupe <small>facultatif</small></label><input id="tache-qui-${e(id)}" name="responsable" maxlength="40" autocomplete="off" value="${e(t?.responsable || '')}" placeholder="Un prénom"></p>
      ${lien ? `<p class="esp-tache-form__lien">Liée à&nbsp;: <b>${e(TYPE_LIEN[lien.type] || '')}</b> ${e(lien.libelle)}</p>` : ''}
      <p class="esp-tache-form__actions"><button type="submit" class="bouton">${t ? 'Enregistrer' : 'Ajouter la tâche'}</button><button type="button" class="esp-bouton esp-bouton--discret" data-tache-fermer>Fermer</button>${t ? `<button type="button" class="esp-bouton esp-bouton--discret esp-tache-form__suppr" data-tache-supprimer="${e(t.id)}">Supprimer</button>` : ''}</p>
    </form>`;
  }
  const ligneTache = (t) => (etat.tacheEditee === t.id ? `<li class="esp-tache est-edition" data-tache="${e(t.id)}">${formulaireTache(t)}</li>`
    : `<li class="esp-tache est-${t.etat}" data-tache="${e(t.id)}">
      <button type="button" class="esp-tache__coche" role="checkbox" aria-checked="${t.fait}" data-tache-fait="${e(t.id)}" aria-label="${t.fait ? 'Rouvrir' : 'Terminer'} : ${e(t.titre)}"><span aria-hidden="true"></span></button>
      <div class="esp-tache__texte"><p class="esp-tache__titre">${e(t.titre)}</p>
        <p class="esp-tache__meta">${[ETAT_TACHE[t.etat] ? `<span class="esp-pastille${t.etat === 'retard' ? ' esp-pastille--a-confirmer' : ''}">${ETAT_TACHE[t.etat]}</span>` : '', t.echeance && t.etat !== 'jour' ? `pour ${e(dateCourte(t.echeance))}` : '', t.responsable ? e(t.responsable) : '',
          t.lien ? `<button type="button" class="esp-lien" data-tache-lien="${e(t.id)}">${e(TYPE_LIEN[t.lien.type] || 'Voir')} : ${e(t.lien.libelle)}</button>` : ''].filter(Boolean).join(' <span aria-hidden="true">·</span> ')}</p></div>
      <button type="button" class="esp-lien esp-tache__modifier" data-tache-modifier="${e(t.id)}" aria-label="Modifier : ${e(t.titre)}">Modifier</button></li>`);
  function zoneTaches(a) {
    const l = a.taches, aFaire = l.filter((t) => !t.fait).length;
    return `<section class="esp-carte esp-acc__taches" aria-labelledby="t-taches"><h3 id="t-taches">Les tâches${aFaire ? ` <span class="esp-acc__compte">${aFaire}</span>` : ''} <span class="esp-source">Dans ce navigateur</span></h3>
      ${l.length ? `<ul class="esp-taches">${l.map(ligneTache).join('')}</ul>` : etat.tacheEditee === 'nouvelle' ? '' : '<p class="esp-vide">Aucune tâche. Notez ici ce qu\'il ne faut pas oublier avant le service.</p>'}
      ${etat.tacheEditee === 'nouvelle' ? formulaireTache(null) : '<p class="esp-plus"><button type="button" class="esp-bouton" data-tache-nouvelle>Ajouter une tâche</button></p>'}
      ${connecte() ? '<p class="esp-aide">Les tâches ne sont pas encore partagées entre vos appareils : elles restent sur celui-ci.</p>' : ''}</section>`;
  }

  function zoneSite() {
    const s = S(), ouv = (sv) => X.ouv(A.iso, sv), ouverts = ['midi', 'soir'].filter(ouv);
    return `<article class="esp-carte esp-acc__site" aria-labelledby="t-site"><h3 id="t-site">Sur le site en ce moment</h3>
      <ul class="esp-etat">
        <li><span class="esp-etat__point${s.annonce?.active ? ' est-on' : ''}"></span>${s.annonce?.active ? `Annonce affichée : « ${e(s.annonce.texte)} »` : 'Pas d\'annonce affichée'}</li>
        <li><span class="esp-etat__point${ouverts.length ? ' est-on' : ''}"></span>${ouverts.length ? `Ouvert aujourd'hui : ${ouverts.join(' et ')}` : 'Fermé aujourd\'hui'}</li>
        <li><span class="esp-etat__point${X.siteVide() ? '' : ' est-on'}"></span>${X.siteVide() ? 'Le site est tel que livré' : 'Vos modifications sont visibles sur le site (dans ce navigateur)'}</li>
      </ul>
      <p class="esp-plus"><button type="button" class="esp-lien" data-aller="site" data-onglet="horaires">Annonce et horaires</button> <button type="button" class="esp-lien" data-aller="carte">Modifier la carte</button></p></article>`;
  }

  function rendre() {
    const a = accueil(C(), S(), D.salle, A.min), vue = connecte() ? 'direction' : etat.vueMetier, nbDem = X.enAttenteTotal();
    const p = a.prochain, intro = p ? `${p.nom.toLowerCase().replace(/^./, (c) => c.toUpperCase())} : ${pluriel(p.confirmees, 'réservation')} ${p.confirmees > 1 ? 'confirmées' : 'confirmée'}, ${pluriel(p.couvertsAttendus, 'couvert')}` : 'Pas de service à venir';
    const zones = { service: () => zoneService(p, vue), priorites: () => zonePriorites(a, vue), fil: () => zoneFil(a, vue), taches: () => zoneTaches(a), site: () => zoneSite() };
    /* typo() : les espaces insécables de la typographie française, sur tout ce que la rubrique écrit. */
    X.corps('jour').innerHTML = typo(`
      <p class="esp-bonjour">${e(maj(fmt(A.iso)))}. ${e(intro)}${nbDem ? `, ${pluriel(nbDem, 'demande')} à traiter` : ''}.</p>
      ${connecte() ? '' : `<div class="esp-metier" role="group" aria-labelledby="t-metier"><p class="esp-metier__titre" id="t-metier">Voir comme <span class="esp-source">Aperçu</span></p>
        <p class="esp-metier__choix">${VUES_METIER.map(([id, nom]) => `<button type="button" class="esp-metier__bouton" data-vue-metier="${id}" aria-pressed="${id === vue}">${nom}</button>`).join('')}</p>
        <p class="esp-metier__aide">${e(VUES_METIER.find(([id]) => id === vue)[2])} Mêmes données pour tous : ce choix change la mise en avant, pas les droits.</p></div>`}
      <div class="esp-acc esp-acc--${vue}">${ORDRE[vue].map((z) => zones[z]()).join('')}</div>`);
    if (etat.tacheEditee) $(`[data-form-tache] [name="titre"]`, X.corps('jour'))?.focus({ preventScroll: true });
  }

  /* ---------- Le briefing d'un service ---------- */
  let fen = null, retour = null;
  function contenuBriefing() {
    const [iso, sv] = etat.briefing.split('|'), r = resumeService(C(), S(), D.salle, iso, sv), nom = nomService(C(), iso, sv), fil = filDuJour(C(), S(), iso).filter((x) => x.type !== 'service');
    const services = servicesDe(ctx().R), libre = tachesDuJour(S(), A.iso).filter((t) => !t.fait && !t.lien && (!t.echeance || t.echeance <= iso));
    const taches = [...r.taches, ...libre.filter((t) => !r.taches.some((x) => x.id === t.id))];
    const ligne = (x, plus = '') => `<li><button type="button" class="esp-lien" data-brief-resa="${e(x.id)}">${heure(x.heure)} · ${e(x.nom || 'Sans nom')}</button> <span>${pluriel(+x.couverts, 'couvert')}${x.table ? ` · table ${e(x.table)}` : ''}${plus}</span></li>`;
    const bloc = (titre, corps, vide) => `<section class="esp-brief__bloc"><h3>${titre}</h3>${corps || `<p class="esp-brief__vide">${vide}</p>`}</section>`;
    return `<header class="esp-modale__tete"><h2 id="brief-titre">Préparer le service</h2><button type="button" class="esp-rond" data-fermer-brief aria-label="Fermer">×</button></header>
      <div class="esp-brief" data-brief="${e(etat.briefing)}">
        <div class="esp-brief__quand"><button type="button" class="esp-rond" data-brief-jour="-1" aria-label="Jour précédent"><span aria-hidden="true">‹</span></button>
          <p><b>${e(maj(fmt(iso)))}</b> ${services.map((s) => `<button type="button" class="esp-brief__sv" data-brief-sv="${s.id}" aria-pressed="${s.id === sv}">${s.libelle}</button>`).join('')}</p>
          <button type="button" class="esp-rond" data-brief-jour="1" aria-label="Jour suivant"><span aria-hidden="true">›</span></button></div>
        ${!r.ouvert && !r.resas.length ? `<p class="esp-vide">${e(nom)} : pas de service. Choisissez un autre jour ou l'autre service.</p>` : `
        <ul class="esp-acc__chiffres esp-brief__chiffres"><li><b>${r.confirmees}</b> <span>${r.confirmees > 1 ? 'réservations confirmées' : 'réservation confirmée'}</span></li><li><b>${r.couvertsAttendus}</b> <span>${r.couvertsAttendus > 1 ? 'couverts attendus' : 'couvert attendu'}</span></li>
          ${r.accueillies ? `<li><b>${r.couvertsAccueillis}</b> <span>déjà accueillis</span></li>` : ''}<li><b>${r.demandes.length}</b> <span>${r.demandes.length > 1 ? 'demandes à traiter' : 'demande à traiter'}</span></li>${r.pic?.couverts ? `<li><b>${heure(hhmm(r.pic.t))}</b> <span>le plus chargé (${r.pic.couverts} à table)</span></li>` : ''}</ul>
        ${bloc(`Les grandes tablées <small>${GRANDE_TABLEE} couverts et plus</small>`, r.grandes.length ? `<ul class="esp-brief__liste">${r.grandes.map((x) => ligne(x)).join('')}</ul>` : '', 'Aucune pour ce service.')}
        ${bloc('Occasions, allergies et demandes particulières', r.attentions.length ? `<ul class="esp-brief__liste">${r.attentions.map((x) => ligne(x, ` — ${e(typo([x.allergies.length ? `allergie : ${x.allergies.join(', ')}` : '', x.demande, x.noteClient].filter(Boolean).join(' ; ')))}`)).join('')}</ul>` : '', 'Rien de noté sur les réservations de ce service.')}
        ${bloc('Ce qui reste à traiter', r.demandes.length || r.aPlacer.length ? `<ul class="esp-brief__liste">${r.demandes.map((x) => ligne(x, ' — demande à confirmer ou refuser')).join('')}${r.aPlacer.map((x) => ligne(x, ' — pas encore de table')).join('')}</ul>` : '', 'Toutes les demandes ont une réponse et chaque réservation a sa table.')}
        ${bloc('Installations à prévoir', r.placees ? `<p>${pluriel(r.placees, 'réservation')} ${r.placees > 1 ? 'ont' : 'a'} déjà ${r.placees > 1 ? 'leur' : 'sa'} table. <button type="button" class="esp-lien" data-brief-ouvrir="salle">Voir le plan de salle</button></p>` : '', 'Aucune table n\'est encore attribuée pour ce service.')}
        ${fil.length ? bloc('Aussi ce jour-là', `<ul class="esp-brief__liste">${fil.map((x) => `<li><b>${e(x.libelleType)}</b> ${e(x.titre)} <span>${e(x.statut)}</span></li>`).join('')}</ul>`, '') : ''}
        ${bloc('Les tâches', taches.length ? `<ul class="esp-brief__liste esp-brief__taches">${taches.map((t) => `<li class="${t.fait ? 'est-faite' : ''}"><span class="esp-brief__case" aria-hidden="true">${t.fait ? '✓' : ''}</span>${e(t.titre)}${t.responsable ? ` <span>(${e(t.responsable)})</span>` : ''}</li>`).join('')}</ul>` : '', 'Aucune tâche pour ce service.')}`}
        <p class="esp-brief__actions"><button type="button" class="bouton" data-brief-imprimer>Imprimer le briefing</button><button type="button" class="esp-bouton" data-brief-tache>Ajouter une tâche pour ce service</button>
          <button type="button" class="esp-bouton" data-brief-ouvrir="service">Ouvrir le service</button></p>
      </div>`;
  }
  function ouvrirBriefing(cle, depuis) {
    etat.briefing = cle; retour = depuis || document.activeElement;
    if (!fen) {
      fen = document.createElement('div'); fen.className = 'esp-modale esp-modale--brief'; fen.hidden = true;
      fen.innerHTML = '<div class="esp-modale__fond" data-fermer-brief></div><div class="esp-modale__boite" role="dialog" aria-modal="true" aria-labelledby="brief-titre" data-brief-boite></div>';
      root.append(fen);
      fen.addEventListener('click', (ev) => { const t = ev.target; let [iso, sv] = (etat.briefing || '|').split('|');
        if (t.closest('[data-fermer-brief]')) { fermerBriefing(); return; }
        const j = t.closest('[data-brief-jour]'), s = t.closest('[data-brief-sv]'), o = t.closest('[data-brief-ouvrir]'), rr = t.closest('[data-brief-resa]');
        if (j) { iso = ajouter(iso, +j.dataset.briefJour); etat.briefing = cleService(iso, sv); dessiner(`[data-brief-jour="${j.dataset.briefJour}"]`); return; }
        if (s) { etat.briefing = cleService(iso, s.dataset.briefSv); dessiner(`[data-brief-sv="${s.dataset.briefSv}"]`); return; }
        if (o || rr) { fermerBriefing(false); etat.jour = iso; etat.serviceVu = sv; etat.ongletResas = o ? o.dataset.briefOuvrir : 'service'; etat.resaEditee = null; X.allerVue('resas'); if (rr) X.viser($(`[data-esp-panneau-resas] [data-resa="${CSS.escape(rr.dataset.briefResa)}"]`, root), 'center'); return; }
        if (t.closest('[data-brief-imprimer]')) { imprimer(); return; }
        if (t.closest('[data-brief-tache]')) { fermerBriefing(false); nouvelleDepuis({ type: 'service', id: etat.briefing, libelle: nomService(C(), iso, sv), echeance: iso }); }
      });
      document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && fen && !fen.hidden) { ev.stopPropagation(); fermerBriefing(); } }, true);
    }
    fen.hidden = false; document.documentElement.classList.add('esp-modale-ouverte'); dessiner('[data-fermer-brief]');
  }
  function dessiner(focus) { const b = $('[data-brief-boite]', fen); b.innerHTML = typo(contenuBriefing()); (focus && $(focus, b) || $('[data-fermer-brief]', b))?.focus({ preventScroll: true }); }
  function fermerBriefing(rendreFocus = true) { if (!fen || fen.hidden) return; fen.hidden = true; etat.briefing = null; document.documentElement.classList.remove('esp-modale-ouverte'); if (rendreFocus) (retour?.isConnected ? retour : $('[data-briefing]', root))?.focus?.({ preventScroll: true }); }
  /** Le briefing imprimé : une page, le même contenu, sans boutons. */
  function imprimer() {
    document.querySelector('.esp-feuille')?.remove();
    const [iso, sv] = etat.briefing.split('|'), f = document.createElement('div'); f.className = 'esp-feuille esp-feuille--brief';
    const src = $('.esp-brief', fen).cloneNode(true); for (const x of src.querySelectorAll('.esp-brief__quand, .esp-brief__actions, button.esp-rond')) x.remove();
    for (const b of src.querySelectorAll('button')) { const s = document.createElement('span'); s.textContent = b.textContent; b.replaceWith(s); }
    f.innerHTML = `<header><p class="esp-feuille__maison">Les Jardins de l'Hacienda</p><h1>Briefing du service</h1><p class="esp-feuille__quand">${e(maj(fmt(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })))}, ${sv === 'midi' ? 'midi' : 'soir'}</p></header>`;
    f.append(src); document.body.append(f); document.documentElement.classList.add('esp-impression');
    const fin = () => { document.documentElement.classList.remove('esp-impression'); f.remove(); removeEventListener('afterprint', fin); };
    addEventListener('afterprint', fin);
    try { print(); } catch { fin(); dire('L\'impression n\'a pas pu démarrer sur ce navigateur.'); }
  }

  /* ---------- Les gestes ---------- */
  const idTache = () => `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  /** Ouvre le formulaire d'une nouvelle tâche dans « Aujourd'hui », déjà liée à un objet (une demande, un service…). */
  function nouvelleDepuis(lien) { etat.tacheLien = lien || null; etat.tacheEditee = 'nouvelle'; X.allerVue('jour'); X.viser($('#t-taches', root)?.closest('.esp-carte')); $('[data-form-tache] [name="titre"]', root)?.focus({ preventScroll: true }); }
  function ouvrirLien(l) {
    if (l.type === 'demande') X.executer({ aller: { vue: 'demandes', filtre: 'tout', demande: l.id } });
    else if (l.type === 'service') { const [iso, sv] = l.id.split('|'); X.executer({ aller: { vue: 'resas', onglet: 'service', jour: iso, service: sv } }); }
    else if (l.type === 'resa') { const r = X.trouverResa(l.id); if (r) X.executer({ aller: { vue: 'resas', onglet: 'service', jour: r.date, service: r.service, resa: r.id } }); else dire('Cette réservation n\'est plus dans l\'agenda.'); }
    else if (l.type === 'client') X.executer({ aller: { vue: 'clients', client: l.id } });
  }
  function clic(t) {
    const b = t.closest('[data-briefing]'); if (b) { ouvrirBriefing(b.dataset.briefing, b); return true; }
    const sv = t.closest('[data-aller-service]'); if (sv) { const [iso, s] = sv.dataset.allerService.split('|'); X.executer({ aller: { vue: 'resas', onglet: sv.dataset.ongletService || 'service', jour: iso, service: s } }); return true; }
    const m = t.closest('[data-vue-metier]'); if (m) { etat.vueMetier = m.dataset.vueMetier; try { sessionStorage.setItem('jh-espace-vue-metier', etat.vueMetier); } catch { /* rien */ } X.rendre(); $(`[data-vue-metier="${etat.vueMetier}"]`, root)?.focus({ preventScroll: true }); return true; }
    const p = t.closest('[data-faire-priorite]'); if (p) { const c = accueil(C(), S(), D.salle, A.min).priorites.find((x) => x.id === p.dataset.fairePriorite); if (c) X.executer({ action: c.action, aller: c.aller }); return true; }
    const f = t.closest('[data-fil]'); if (f) { const x = filDuJour(C(), S(), A.iso, A.min).find((y) => y.cle === f.dataset.fil); if (x) X.executer({ aller: x.aller }); return true; }
    if (t.closest('[data-tache-nouvelle]')) { etat.tacheLien = null; etat.tacheEditee = 'nouvelle'; if (etat.vue !== 'jour') X.allerVue('jour'); else X.rendre(); X.viser($('#t-taches', root)?.closest('.esp-carte')); $('[data-form-tache] [name="titre"]', root)?.focus({ preventScroll: true }); return true; }
    if (t.closest('[data-tache-fermer]')) { const id = etat.tacheEditee; etat.tacheEditee = null; etat.tacheLien = null; X.rendre(); (id && id !== 'nouvelle' ? $(`[data-tache-modifier="${CSS.escape(id)}"]`, root) : $('[data-tache-nouvelle]', root))?.focus({ preventScroll: true }); return true; }
    const mo = t.closest('[data-tache-modifier]'); if (mo) { etat.tacheEditee = mo.dataset.tacheModifier; X.rendre(); return true; }
    const fa = t.closest('[data-tache-fait]'); if (fa) { const id = fa.dataset.tacheFait, fait = fa.getAttribute('aria-checked') !== 'true';
      agir('tacheTerminer', { id, fait, le: A.iso }, { msg: fait ? 'Tâche terminée.' : 'Tâche rouverte.' }); X.rendre(); $(`[data-tache-fait="${CSS.escape(id)}"]`, root)?.focus({ preventScroll: true }); return true; }
    const su = t.closest('[data-tache-supprimer]'); if (su) { etat.tacheEditee = null; agir('tacheSupprimer', { id: su.dataset.tacheSupprimer }, { msg: 'Tâche supprimée.' }); X.rendre(); $('[data-tache-nouvelle]', root)?.focus({ preventScroll: true }); return true; }
    const li = t.closest('[data-tache-lien]'); if (li) { const x = tachesDuJour(S(), A.iso).find((y) => y.id === li.dataset.tacheLien) || (S().taches?.liste || []).find((y) => y.id === li.dataset.tacheLien); if (x?.lien) ouvrirLien(x.lien); return true; }
    const tp = t.closest('[data-tache-pour]'); if (tp) { const [type, ...reste] = tp.dataset.tachePour.split(':'); nouvelleDepuis({ type, id: reste.join(':'), libelle: tp.dataset.tacheLibelle || '', titre: tp.dataset.tacheTitre || '' }); return true; }
    return false;
  }
  function soumettre(f) {
    if (!f.matches('[data-form-tache]')) return false;
    const id = f.dataset.formTache, v = { titre: f.elements.titre.value, echeance: f.elements.echeance.value, responsable: f.elements.responsable.value };
    if (!v.titre.trim()) { f.elements.titre.focus(); dire('Écrivez ce qu\'il y a à faire.'); return true; }
    let ok, cible = id;
    if (id === 'nouvelle') { const lien = etat.tacheLien ? { type: etat.tacheLien.type, id: etat.tacheLien.id, libelle: etat.tacheLien.libelle } : null, tache = nouvelleTache({ id: idTache(), ...v, lien, cree: new Date().toISOString() });
      cible = tache.id; ok = agir('tacheAjouter', { tache }, { msg: 'Tâche ajoutée.' }); }
    else ok = agir('tacheModifier', { id, champs: v }, { msg: 'Tâche enregistrée.' });
    /* Refusée (mémoire du navigateur pleine, par exemple) : le formulaire reste ouvert avec sa saisie. */
    if (ok === false) return true;
    etat.tacheEditee = null; etat.tacheLien = null; X.rendre(); $(`[data-tache-modifier="${CSS.escape(cible)}"]`, root)?.focus({ preventScroll: true });
    return true;
  }
  /** Les tâches d'un objet, à montrer dans son dossier (une demande ouverte, par exemple). */
  function tachesDe(type, id, libelle, titre = '') {
    const l = tachesLiees(S(), type, id);
    return typo(`<div class="esp-dem__bloc esp-dem__taches"><p class="esp-champ__titre">Tâches de suivi</p>
      ${l.length ? `<ul class="esp-brief__liste esp-brief__taches">${l.map((t) => `<li class="${t.fait ? 'est-faite' : ''}"><button type="button" class="esp-tache__coche" role="checkbox" aria-checked="${t.fait}" data-tache-fait="${e(t.id)}" aria-label="${t.fait ? 'Rouvrir' : 'Terminer'} : ${e(t.titre)}"><span aria-hidden="true"></span></button>${e(t.titre)}${t.echeance ? ` <span>pour ${e(dateCourte(t.echeance))}</span>` : ''}${t.responsable ? ` <span>(${e(t.responsable)})</span>` : ''}</li>`).join('')}</ul>` : ''}
      <p><button type="button" class="esp-bouton esp-bouton--discret" data-tache-pour="${e(`${type}:${id}`)}" data-tache-libelle="${e(libelle)}" data-tache-titre="${e(titre)}">Ajouter une tâche de suivi</button></p></div>`);
  }
  return { rendre, clic, soumettre, ouvrirBriefing, fermerBriefing, nouvelleDepuis, tachesDe };
}
