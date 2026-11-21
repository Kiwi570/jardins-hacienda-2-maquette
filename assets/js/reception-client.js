/* « Votre réception aux Jardins » (v7.12.0) : la page du client pour UN dossier (voir source/pages/votre-reception.mjs).
   Les règles sont dans espace-receptions.js (`vueClient` : ce que le client a le droit de voir ; jamais les notes
   internes, jamais un autre dossier). Démonstration : la page lit le dossier de ce navigateur et note ce que le client
   fait dans le stockage commun (`venues`, sous l'identifiant du dossier) ; l'espace du restaurant le voit aussitôt.
   Un accord donné ici est une simulation : il ne vaut ni signature ni paiement, et ne confirme rien. Rien n'est envoyé.
   En mode connecté, la page ne lit rien en local : elle renvoie vers le téléphone. */
import { lire, venues, noterVenue, ecouter, CONTEXTE, horloge as horlogeDemo, noterVu } from './espace-stock.js?v=7';
import { aujourdhui, fixerHorloge, fmt, heure, hhmm, typo } from './espace-regles.js?v=7';
import { dossierDe, actionsClient, vueClient, refusChangement, codeReception, euros, totalLigne, instantDit, TYPES_CHANGEMENT } from './espace-receptions.js?v=7';

const e = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const ETAT = { presentee: 'demande-recue', accord: 'modification-demandee', brouillon: 'demande-recue', 'a-qualifier': 'demande-recue', qualifie: 'demande-recue', confirmee: 'confirmee', terminee: 'passee', 'sans-suite': 'annulee' };

export function init(root) {
  const corps = root.querySelector('[data-reception-corps]'); let D; try { D = JSON.parse(root.querySelector('[data-reception-donnees]').textContent); } catch { return; }
  const q = new URLSearchParams(location.search), id = q.get('d') || '', code = q.get('c') || '';
  const connecte = !!document.querySelector('meta[name="jh-api"]');
  if (CONTEXTE && horlogeDemo()) fixerHorloge(() => horlogeDemo());
  const etat = { outil: '', type: 'effectif', message: '', erreur: '', accord: false };
  const tel = `<a href="tel:${e(D.telephoneLien)}">${e(D.telephone)}</a>`;
  const instant = () => { const m = aujourdhui(); return `${m.iso}T${hhmm(m.min)}`; };
  const demo = () => `<p class="venue__demo"><span>Démonstration</span> Cette page lit un dossier fictif enregistré dans ce navigateur. Aucun message n'est envoyé, rien n'est signé, rien n'est payé.${CONTEXTE && horlogeDemo() ? ` Scénario en cours : nous sommes le ${fmt(aujourdhui().iso, { weekday: 'long', day: 'numeric', month: 'long' })}, ${heure(hhmm(aujourdhui().min))} (heure simulée). <a class="venue__lien" href="/espace">Revenir à l'espace</a>` : ''}</p>`;
  const lireDossier = () => { const S = lire(), d = id ? dossierDe(S, id) : null, m = aujourdhui(); return d && codeReception(d.id, d.client?.telephone) === code ? { d, v: actionsClient(venues(), id), ctx: { auj: m.iso, minute: m.min, maintenant: `${m.iso}T${hhmm(m.min)}`, lieux: D.lieux, venues: venues() } } : null; };
  function introuvable() {
    corps.innerHTML = typo(`<div class="venue__carte venue__carte--vide" tabindex="-1" data-reception-focus data-reception-etat="introuvable"><p class="venue__etat venue__etat--annulee">Projet introuvable</p>
      <p>${connecte ? 'Sur ce site d\'essai, la page « Votre réception » n\'est pas reliée au restaurant : les dossiers de réception ne sont pas partagés.' : 'Nous ne retrouvons pas ce projet : le lien est incomplet, ou il a été ouvert sur un autre appareil que celui de la démonstration.'} Pour parler de votre réception, appelez-nous : ${tel}.</p>
      <p class="venue__actions"><a class="bouton" href="${e(D.liens.receptions)}">Découvrir nos réceptions</a></p></div>${connecte ? '' : demo()}`);
  }
  const champ = (label, idc, html, aide = '') => `<p class="venue__champ"><label for="${idc}">${label}${aide ? ` <small>${aide}</small>` : ''}</label>${html}</p>`;
  function rendre(focus) {
    if (connecte) { introuvable(); return; }
    const x = lireDossier(); if (!x) { introuvable(); return; }
    const vue = vueClient(x.ctx, x.d, x.v), p = vue.proposition, liste = (t) => String(t || '').split('\n').map((l) => l.trim()).filter(Boolean);
    const enAttente = vue.changements.filter((c) => !c.decision), repondues = vue.changements.filter((c) => c.decision);
    const voulu = (c) => { const v = c.valeur || {}; return c.type === 'effectif' ? `${v.invites} invités` : c.type === 'horaire' ? [v.arrivee ? `arrivée à ${heure(v.arrivee)}` : '', v.fin ? `fin à ${heure(v.fin)}` : ''].filter(Boolean).join(', ') : c.type === 'espace' ? (v.espaces || []).map((i) => D.lieux.espaces.find((s) => s.id === i)?.nom || i).join(', ') : v.texte || ''; };
    const outilQuestion = etat.outil !== 'question' ? '' : `<form class="venue__form" data-reception-form="question" aria-labelledby="rc-f-q"><h3 id="rc-f-q">Poser une question</h3>
        ${champ('Votre question', 'rc-question', '<textarea id="rc-question" name="texte" rows="3" maxlength="600" required></textarea>')}
        ${etat.erreur ? `<p class="venue__erreur" role="alert">${e(etat.erreur)}</p>` : ''}
        <p class="venue__actions"><button type="submit" class="bouton">Transmettre au restaurant</button><button type="button" class="bouton bouton--contour" data-reception-fermer>Fermer</button></p></form>`;
    const champsType = { effectif: champ('Nombre d\'invités souhaité', 'rc-invites', '<input id="rc-invites" name="invites" type="number" inputmode="numeric" min="1" required>'),
      horaire: `${champ('Nouvelle heure d\'arrivée', 'rc-arrivee', '<input id="rc-arrivee" name="arrivee" type="time">', 'laissez vide si elle ne change pas')}${champ('Nouvelle heure de fin', 'rc-fin', '<input id="rc-fin" name="fin" type="time">', 'laissez vide si elle ne change pas')}`,
      espace: `<fieldset class="venue__champ"><legend>L'espace souhaité</legend>${D.lieux.espaces.filter((s) => !s.partie).map((s) => `<label class="venue__choix"><input type="checkbox" name="espace" value="${e(s.id)}"> ${e(s.nom)}</label>`).join('')}</fieldset>`,
      prestation: champ('La prestation à changer', 'rc-prestation', '<textarea id="rc-prestation" name="texte" rows="3" maxlength="400" required></textarea>') };
    const outilChangement = etat.outil !== 'changement' ? '' : `<form class="venue__form" data-reception-form="changement" aria-labelledby="rc-f-c"><h3 id="rc-f-c">Demander un changement</h3>
        ${champ('Ce que vous souhaitez changer', 'rc-type', `<select id="rc-type" name="type" data-reception-type>${Object.entries(TYPES_CHANGEMENT).map(([k, n]) => `<option value="${k}"${k === etat.type ? ' selected' : ''}>${e(n)}</option>`).join('')}</select>`)}
        ${champsType[etat.type]}
        ${champ('Un mot pour le restaurant', 'rc-message', '<input id="rc-message" name="message" maxlength="200">', 'facultatif')}
        <p class="venue__note">C'est une demande : ce qui est convenu reste inchangé tant que le restaurant n'a pas répondu.</p>
        ${etat.erreur ? `<p class="venue__erreur" role="alert">${e(etat.erreur)}</p>` : ''}
        <p class="venue__actions"><button type="submit" class="bouton">Envoyer ma demande de changement</button><button type="button" class="bouton bouton--contour" data-reception-fermer>Ne rien changer</button></p></form>`;
    corps.innerHTML = typo(`<div class="venue__carte" tabindex="-1" data-reception-focus data-reception-etat="${vue.etape.id}">
        <p class="venue__etat venue__etat--${ETAT[vue.etape.id] || 'confirmee'}">${e(vue.etape.libelle)}</p>
        <p class="venue__phrase">${e(vue.etape.phrase)}</p>
        ${etat.message ? `<p class="venue__message" role="status">${e(etat.message)}</p>` : ''}
        ${enAttente.map((c) => `<p class="venue__info venue__info--attente" data-reception-attente="${e(c.id)}"><b>Changement demandé&nbsp;:</b> ${e((TYPES_CHANGEMENT[c.type] || '').toLowerCase())}, ${e(voulu(c))}. En attente de la réponse du restaurant ; ce qui est convenu ci-dessous reste valable.</p>`).join('')}
        <h2 class="venue__sous">Ce qui est convenu</h2>
        <dl class="venue__recap">${vue.convenu.map(([k, v]) => `<div><dt>${e(k)}</dt><dd>${e(v)}</dd></div>`).join('')}</dl>
        ${vue.partage ? `<p class="venue__info">${e(vue.partage)}</p>` : ''}
        ${vue.ouvert && !outilQuestion && !outilChangement ? `<p class="venue__actions"><button type="button" class="bouton bouton--contour" data-reception-outil="question">Poser une question</button><button type="button" class="bouton bouton--contour" data-reception-outil="changement">Demander un changement</button></p>` : ''}
        ${outilQuestion}${outilChangement}</div>
      ${p ? `<section class="venue__bloc" aria-labelledby="rc-prop" data-reception-proposition="${p.v}"><h2 id="rc-prop">La proposition <small>version ${p.v}</small></h2>
        <p class="venue__note">Présentée le ${e(instantDit(p.presenteeLe, true))}. Démonstration : montants d'exemple, sans valeur contractuelle.</p>
        <h3 class="venue__prop-titre">${e(p.titre)}</h3>${p.presentation ? `<p>${e(p.presentation)}</p>` : ''}
        <div class="venue__table"><table><caption class="visuellement-cache">Les prestations de la proposition</caption><thead><tr><th scope="col">Prestation</th><th scope="col">Quantité</th><th scope="col">Prix unitaire</th><th scope="col">Total</th></tr></thead>
          <tbody>${p.lignes.map((l) => `<tr><td><b>${e(l.libelle)}</b>${l.description ? `<br><span>${e(l.description)}</span>` : ''}</td><td>${e(String(l.qte).replace('.', ','))}${l.unite ? ` <span>${e(l.unite)}</span>` : ''}</td><td>${e(euros(l.pu))}</td><td>${e(euros(totalLigne(l)))}</td></tr>`).join('')}</tbody>
          <tfoot><tr><th scope="row" colspan="3">Total</th><td>${e(euros(p.total))}</td></tr></tfoot></table></div>
        ${liste(p.compris).length ? `<h3 class="venue__sous">Ce qui est compris</h3><ul class="venue__liste">${liste(p.compris).map((l) => `<li>${e(l)}</li>`).join('')}</ul>` : ''}
        ${liste(p.aPreciser).length ? `<h3 class="venue__sous">Ce qui reste à préciser</h3><ul class="venue__liste">${liste(p.aPreciser).map((l) => `<li>${e(l)}</li>`).join('')}</ul>` : ''}
        <p class="venue__note">Proposition valable ${p.validite ? `jusqu'au ${e(fmt(p.validite, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))}` : ': durée à préciser par le restaurant'}. ${e(p.conditions || 'Conditions (acompte, annulation) : à préciser par le restaurant.')}</p>
        ${vue.accord ? `<p class="venue__info" data-reception-accord="${vue.accord.version}"><b>Accord donné — simulation.</b> Vous avez donné votre accord sur la version ${vue.accord.version}, le ${e(instantDit(vue.accord.le, true))}. La réception sera confirmée par l'équipe, après vérification des espaces.</p>`
          : vue.peutAccorder ? (etat.accord ? `<div class="venue__form" role="group" aria-labelledby="rc-f-a"><h3 id="rc-f-a">Donner votre accord sur la version ${p.v} ?</h3><p class="venue__note">Simulation : cet accord ne vaut ni signature ni paiement. Il indique au restaurant que la proposition vous convient ; c'est l'équipe qui confirme la réception.</p>
              <p class="venue__actions"><button type="button" class="bouton" data-reception-accord-oui="${p.v}">Oui, je donne mon accord (simulation)</button><button type="button" class="bouton bouton--contour" data-reception-accord-non>Pas maintenant</button></p></div>`
            : `<p class="venue__actions"><button type="button" class="bouton" data-reception-accorder>Donner mon accord sur cette version</button></p>`) : ''}</section>` : ''}
      ${vue.prochaines.length ? `<section class="venue__bloc" aria-labelledby="rc-suite"><h2 id="rc-suite">Les prochaines étapes</h2><ol class="venue__liste">${vue.prochaines.map((l) => `<li>${e(l)}</li>`).join('')}</ol></section>` : ''}
      ${vue.attendu.length ? `<section class="venue__bloc" aria-labelledby="rc-attendu"><h2 id="rc-attendu">Ce que nous attendons de vous</h2>${vue.attendu.map((i) => (i.valeur ? `<p class="venue__info"><b>${e(i.libelle)}</b> : ${e(i.valeur)} <small>(transmis)</small></p>`
        : `<form class="venue__form" data-reception-form="info" data-info="${e(i.id)}">${champ(e(i.libelle), `rc-info-${e(i.id)}`, `<input id="rc-info-${e(i.id)}" name="valeur" maxlength="300" required>`)}<p class="venue__actions"><button type="submit" class="bouton">Transmettre</button></p></form>`)).join('')}</section>` : ''}
      ${vue.questions.length || repondues.length ? `<section class="venue__bloc" aria-labelledby="rc-echanges"><h2 id="rc-echanges">Vos demandes et les réponses du restaurant</h2><ul class="venue__echanges">
        ${[...repondues].reverse().map((c) => `<li data-reception-decision="${c.decision.acceptee ? 'acceptee' : 'refusee'}"><p><b>${e(TYPES_CHANGEMENT[c.type] || 'Changement')}</b> : ${e(voulu(c))}</p><p class="venue__info${c.decision.acceptee ? '' : ' venue__info--attente'}">${c.decision.acceptee ? 'Le restaurant a accepté ce changement : ce qui est convenu a été mis à jour.' : 'Le restaurant n\'a pas pu accepter ce changement : ce qui était convenu est maintenu.'}${c.decision.texte ? ` « ${e(c.decision.texte)} »` : ''}</p></li>`).join('')}
        ${[...vue.questions].reverse().map((qu) => `<li><p><b>Votre question</b> : ${e(qu.texte)}</p>${qu.reponse ? `<p class="venue__info"><b>Réponse du restaurant</b> : ${e(qu.reponse.texte)}</p>` : '<p class="venue__note">En attente de la réponse du restaurant.</p>'}</li>`).join('')}</ul></section>` : ''}
      <p class="venue__contact">Une question plus pressante&nbsp;? Appelez-nous : ${tel}.</p>${demo()}`);
    if (focus) corps.querySelector(focus)?.focus({ preventScroll: focus === '[data-reception-focus]' });
  }
  const dire = (m) => { etat.message = m; etat.outil = ''; etat.erreur = ''; etat.accord = false; rendre('[data-reception-focus]'); };
  root.addEventListener('click', (ev) => {
    const t = ev.target, o = t.closest('[data-reception-outil]');
    if (o) { etat.outil = o.dataset.receptionOutil; etat.erreur = ''; etat.message = ''; rendre(etat.outil === 'question' ? '#rc-question' : '#rc-type'); return; }
    if (t.closest('[data-reception-fermer]')) { const k = etat.outil; etat.outil = ''; etat.erreur = ''; rendre(`[data-reception-outil="${k}"]`); return; }
    if (t.closest('[data-reception-accorder]')) { etat.accord = true; rendre('[data-reception-accord-oui]'); return; }
    if (t.closest('[data-reception-accord-non]')) { etat.accord = false; rendre('[data-reception-accorder]'); return; }
    const oui = t.closest('[data-reception-accord-oui]'); if (oui) { const x = lireDossier(); if (!x) return; const vue = vueClient(x.ctx, x.d, x.v);
      /* L'accord porte sur la version affichée : si elle n'est plus la version courante, on le dit au lieu de l'enregistrer. */
      if (!vue.peutAccorder || vue.proposition?.v !== +oui.dataset.receptionAccordOui) { dire('La proposition a changé entre-temps : relisez la version affichée.'); return; }
      if (noterVenue(id, { accord: { version: vue.proposition.v, le: instant() } })) dire(`Merci : votre accord sur la version ${vue.proposition.v} est noté (simulation). L'équipe confirmera la réception après vérification des espaces.`); else dire('Votre accord n\'a pas pu être enregistré dans ce navigateur.'); }
  });
  root.addEventListener('change', (ev) => { if (ev.target.matches('[data-reception-type]')) { etat.type = ev.target.value; etat.erreur = ''; rendre('#rc-type'); } });
  root.addEventListener('submit', (ev) => {
    ev.preventDefault(); const f = ev.target.closest('[data-reception-form]'); if (!f) return; const x = lireDossier(); if (!x) return; const fd = new FormData(f), le = instant(), cle = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
    if (f.dataset.receptionForm === 'question') { const texte = String(fd.get('texte') || '').trim(); if (!texte) { etat.erreur = 'Écrivez votre question.'; rendre('#rc-question'); return; }
      if (noterVenue(id, { questions: [...x.v.questions, { id: `q-${cle}`, le, texte: texte.slice(0, 600) }] })) dire('Votre question est transmise au restaurant.'); return; }
    if (f.dataset.receptionForm === 'info') { const valeur = String(fd.get('valeur') || '').trim(); if (!valeur) return;
      if (noterVenue(id, { infos: { ...x.v.infos, [f.dataset.info]: { valeur: valeur.slice(0, 300), le } } })) dire('Merci : cette information est transmise au restaurant.'); return; }
    if (f.dataset.receptionForm === 'changement') { const type = String(fd.get('type') || ''), valeur = type === 'effectif' ? { invites: Math.round(+fd.get('invites') || 0) } : type === 'horaire' ? { arrivee: String(fd.get('arrivee') || ''), fin: String(fd.get('fin') || '') } : type === 'espace' ? { espaces: fd.getAll('espace').map(String) } : { texte: String(fd.get('texte') || '').trim().slice(0, 400) };
      const refus = refusChangement(x.d, type, valeur); if (refus) { etat.erreur = refus; rendre('[role="alert"]'); corps.querySelector('#rc-type')?.focus(); return; }
      if (noterVenue(id, { changements: [...x.v.changements, { id: `ch-${cle}`, le, type, valeur, message: String(fd.get('message') || '').trim().slice(0, 200) }] })) dire('Votre demande de changement est partie. Ce qui est convenu reste valable en attendant la réponse du restaurant.'); }
  });
  ecouter(() => { if (!etat.outil && !etat.accord) { etat.message = ''; rendre(); } });
  if (CONTEXTE) noterVu('rec-portail');
  rendre();
}
