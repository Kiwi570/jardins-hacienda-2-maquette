/* L'écran « Bilans » (v7.15.0) : le jour choisi, la semaine en cours, la semaine précédente.
   Un écran d'Aujourd'hui (on y entre depuis Aujourd'hui, le menu Plus ou l'assistant ; la navigation principale ne change
   pas). Tous les chiffres viennent de espace-bilans.js, qui relit les dossiers des autres rubriques : chaque chiffre
   s'ouvre sur la liste des dossiers comptés, et chaque dossier ouvre son écran. Rien n'est calculé ici.
   « Non disponible » n'est jamais écrit « 0 » ; les montants gardent leur libellé exact. */
import { fmt, heure, hhmm, pluriel, typo, ajouter } from './espace-regles.js?v=7';
import { bilan, periodes, DOMAINES } from './espace-bilans.js?v=7';
import { aTraiter } from './espace-demandes.js?v=7';

const eu = (n) => `${String(Math.round((+n || 0) * 100) / 100).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} €`;
const LOCAL = { traiteur: 'Commandes suivies sur cet appareil', cadeaux: 'Cartes suivies sur cet appareil', suivi: 'Tâches gardées sur cet appareil' };

export function creerBilan(X) {
  const { root, $, e, S, A, ctx, etat } = X;
  const B = () => (etat.bilan ||= { periode: 'semaine', jour: A.iso, ouvert: '' });
  const calcul = () => { const k = B(), c = ctx(), P = periodes(A.iso, k.jour || A.iso), p = P.find((x) => x.cle === k.periode) || P[1];
    return { P, p, b: bilan(c, S(), p, { demandes: X.demandes(), attente: aTraiter(c, S()) }) }; };
  const valeur = (x) => (x.valeur == null ? '<span class="esp-bilan__nd">Non disponible</span>' : x.unite === 'taux' ? `${Math.round(x.valeur * 100)}<small> %</small>` : x.unite === 'euro' ? e(eu(x.valeur)) : String(x.valeur));
  const unite = (x) => (x.valeur == null || ['taux', 'euro'].includes(x.unite) ? '' : x.unite === 'couvert' ? (x.valeur > 1 ? 'couverts' : 'couvert') : pluriel(x.valeur, x.unite).replace(/^\d+ /, '').replace('règlement simulés', 'règlements simulés'));

  function tuile(x, ouvert) {
    const n = x.dossiers.length, det = [x.detail || '', x.unite === 'euro' && x.valeur != null ? 'utilisable (cartes actives)' : ''].filter(Boolean).join(' · ');
    return `<li class="esp-bilan__ind${x.sous ? ' est-sous' : ''}${x.valeur == null ? ' est-nd' : ''}"><button type="button" class="esp-bilan__tuile" data-bilan-ind="${e(x.id)}" aria-expanded="${ouvert}" aria-controls="bilan-detail-${e(x.domaine)}">
        <span class="esp-bilan__nom">${x.sous ? '<span class="esp-bilan__dont">dont</span> ' : ''}${e(x.libelle)}${x.portee === 'instant' ? ' <span class="esp-source">En ce moment</span>' : ''}${x.precision ? ` <span class="esp-source" data-bilan-precision>${e(x.precision)}</span>` : ''}</span>
        <span class="esp-bilan__valeur"><b>${valeur(x)}</b>${unite(x) ? ` <span>${e(unite(x))}</span>` : ''}</span>
        ${x.valeur == null ? `<span class="esp-bilan__raison">${e(x.raison || 'Cette mesure n\'est pas calculable ici.')}</span>` : det ? `<span class="esp-bilan__detail">${e(det)}</span>` : ''}
        ${x.montantLibelle ? `<span class="esp-bilan__montant">${e(x.montantLibelle)} : <b>${x.montant == null ? 'non disponible' : e(eu(x.montant))}</b></span>` : ''}
        ${(x.parts || []).filter((p) => p.cle !== 'utilisable').map((p) => `<span class="esp-bilan__montant esp-bilan__montant--hors">${e(p.libelle)} : <b>${e(eu(p.montant))}</b>${p.n ? ` (${pluriel(p.n, 'carte')})` : ''}</span>`).join('')}
        <span class="esp-bilan__voir">${ouvert ? 'Masquer le détail' : n ? `Voir ${x.unite === 'version' ? (n > 1 ? `les ${n} versions comptées` : 'la version comptée') : n > 1 ? `les ${n} dossiers comptés` : 'le dossier compté'}` : 'Comment est-ce compté ?'}</span></button></li>`;
  }
  function detail(x) {
    const d = x.definition, l = x.dossiers;
    return `<div class="esp-bilan__detailbloc" id="bilan-detail-${e(x.domaine)}" data-bilan-detail="${e(x.id)}" tabindex="-1" role="region" aria-label="Détail : ${e(x.libelle)}">
      <h5>${e(x.libelle)} : ${x.valeur == null ? 'non disponible' : x.unite === 'version' ? (l.length ? `${l.length} ${l.length > 1 ? 'versions comptées' : 'version comptée'}` : 'aucune version comptée') : `${l.length ? pluriel(l.length, 'dossier compté').replace('dossier comptés', 'dossiers comptés') : 'aucun dossier compté'}`}</h5>
      ${x.note ? `<p class="esp-bilan__note" data-bilan-note>${e(x.note)}</p>` : ''}
      ${x.aPart ? `<p class="esp-com-alerte">${e(x.aPart)}</p>` : ''}
      ${l.length ? `<ul class="esp-bilan__dossiers">${l.map((y, i) => `<li><span class="esp-bilan__dossier"><b>${e(y.titre)}</b><small>${e(y.detail)}</small></span><button type="button" class="esp-bouton" data-bilan-dossier="${i}" aria-label="Ouvrir : ${e(y.titre)}">Ouvrir</button></li>`).join('')}</ul>`
        : `<p class="esp-vide">${x.valeur == null ? e(x.raison || 'Non disponible.') : (x.unite === 'version' ? 'Aucune version n\'a été acceptée sur cette période : zéro est ici un vrai zéro.' : 'Aucun dossier ne correspond sur cette période : zéro est ici un vrai zéro.')}</p>`}
      <details class="esp-bilan__def" data-bilan-definition><summary>Comment est-ce compté ?</summary><dl>
        <dt>Ce qui est compté</dt><dd>${e(d.compte)}</dd><dt>Inclus</dt><dd>${e(d.inclus)}</dd><dt>Exclus</dt><dd>${e(d.exclus)}</dd>
        <dt>Date de rattachement</dt><dd>${e(d.date)}</dd><dt>Source</dt><dd>${e(d.source)}</dd><dt>Donnée manquante</dt><dd>${e(d.manquant)}</dd>
        ${x.taux ? `${x.commences ? `<dt>Jours commencés</dt><dd>${e(x.commences.debut === x.commences.fin ? fmt(x.commences.debut, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : `du ${fmt(x.commences.debut, { weekday: 'long', day: 'numeric', month: 'long' })} au ${fmt(x.commences.fin, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`)}</dd>` : ''}<dt>Calcul</dt><dd>${pluriel(x.taux.numerateur, 'couvert')} ${x.taux.numerateur > 1 ? 'notés arrivés' : 'noté arrivé'} ÷ ${pluriel(x.taux.denominateur, 'couvert')} (confirmés, arrivés ou absents) = ${Math.round(x.taux.valeur * 100)} %</dd>` : ''}</dl></details></div>`;
  }

  function rendre() {
    const k = B(), { P, p, b } = calcul(), c = ctx(), connecte = c.exemples === false, demo = !!c.scenario;
    X.corps('jour').innerHTML = typo(`
      <p class="esp-retour"><button type="button" class="esp-lien" data-bilan-retour><span aria-hidden="true">←</span> Aujourd'hui</button></p>
      <section class="esp-carte esp-carte--large esp-bilan" aria-labelledby="bilan-titre" data-bilan="${e(p.cle)}" data-bilan-debut="${e(p.debut)}" data-bilan-fin="${e(p.fin)}">
        <h3 id="bilan-titre" tabindex="-1">Bilan <small>${e(p.cle === 'jour' ? 'du jour' : p.cle === 'semaine' ? 'de la semaine' : 'de la semaine précédente')}</small></h3>
        <div class="esp-bilan__periodes" role="group" aria-label="Période du bilan">${P.map((x) => `<button type="button" class="esp-metier__bouton" data-bilan-periode="${x.cle}" aria-pressed="${x.cle === p.cle}">${e(x.nom)}</button>`).join('')}</div>
        ${p.cle === 'jour' ? `<p class="esp-bilan__jour"><button type="button" class="esp-rond" data-bilan-jour="-1" aria-label="Jour précédent"><span aria-hidden="true">‹</span></button>
          <label class="visuellement-cache" for="bilan-jour">Jour du bilan</label><input type="date" id="bilan-jour" value="${e(p.debut)}" data-bilan-date>
          <button type="button" class="esp-rond" data-bilan-jour="1" aria-label="Jour suivant"><span aria-hidden="true">›</span></button>${p.debut === A.iso ? '' : ' <button type="button" class="esp-lien" data-bilan-aujourdhui>Revenir à aujourd\'hui</button>'}</p>` : ''}
        <p class="esp-bilan__dates" data-bilan-dates><b>Période :</b> ${e(b.dite)}. <span class="esp-bilan__ref">Référence : ${e(fmt(A.iso, { weekday: 'long', day: 'numeric', month: 'long' }))}, ${heure(hhmm(A.min))}${demo ? ' (heure simulée du scénario)' : ' (heure de la maison)'}.</span></p>
        ${connecte ? '<p class="esp-note-demo"><span class="esp-source">Site d\'essai</span> Les réservations sont celles du serveur. Les commandes, les cartes cadeaux et les tâches restent sur cet appareil ; les dossiers de réception ne sont pas partagés. Une mesure indisponible est dite « Non disponible », jamais « 0 ».</p>'
          : `<p class="esp-note-demo"><span class="esp-source">Démonstration</span> ${demo ? 'Ces chiffres viennent des données fictives de ce scénario, et de lui seul.' : 'Ces chiffres viennent des exemples de la maquette : ils montrent ce que l\'outil calcule, pas l\'activité réelle du restaurant.'} Aucun montant n'est un encaissement.</p>`}
        ${DOMAINES.map(([id, nom]) => { const l = b.parDomaine[id], ouvert = l.find((x) => x.id === k.ouvert);
          return `<section class="esp-bilan__domaine" aria-labelledby="bilan-${id}" data-bilan-domaine="${id}"><h4 id="bilan-${id}">${e(nom)}${connecte && LOCAL[id] ? ` <span class="esp-source">Sur cet appareil</span>` : ''}</h4>
            <ul class="esp-bilan__grille">${l.map((x) => tuile(x, x.id === k.ouvert)).join('')}</ul>${ouvert ? detail(ouvert) : ''}</section>`; }).join('')}
        <p class="esp-aide">Un chiffre « en ce moment » décrit l'état actuel, quelle que soit la période choisie. Les autres se rattachent à la période par la date dite dans leur définition. Le remplissage service par service reste dans Agenda, onglet Bilan. <button type="button" class="esp-lien" data-aller="resas" data-onglet-resas="bilan">Ouvrir le remplissage de la semaine</button></p>
      </section>`);
  }
  function ouvrir(periode = 'semaine', jour = '') { etat.ecranJour = 'bilan'; etat.bilan = { periode: ['jour', 'semaine', 'precedente'].includes(periode) ? periode : 'semaine', jour: periode === 'jour' && /^\d{4}-\d{2}-\d{2}$/.test(jour) ? jour : A.iso, ouvert: '' };
    etat.dossier = null; etat.commerce = null; X.allerVue('jour', false); $('#bilan-titre', root)?.focus({ preventScroll: true }); }
  function clic(t) {
    if (t.closest('[data-bilan-ouvrir]')) { ouvrir(t.closest('[data-bilan-ouvrir]').dataset.bilanOuvrir || 'semaine'); return true; }
    if (etat.ecranJour !== 'bilan') return false;
    const k = B(), garder = (sel) => { X.rendre(); $(sel, root)?.focus({ preventScroll: true }); };
    if (t.closest('[data-bilan-retour]')) { etat.ecranJour = ''; X.rendre(); ($('[data-bilan-ouvrir]', X.corps('jour')) || $('#vue-jour', root))?.focus({ preventScroll: true }); scrollTo({ top: 0, behavior: 'instant' }); return true; }
    const p = t.closest('[data-bilan-periode]'); if (p) { k.periode = p.dataset.bilanPeriode; k.ouvert = ''; garder(`[data-bilan-periode="${k.periode}"]`); return true; }
    const j = t.closest('[data-bilan-jour]'); if (j) { k.jour = ajouter(k.jour || A.iso, +j.dataset.bilanJour); k.ouvert = ''; garder(`[data-bilan-jour="${j.dataset.bilanJour}"]`); return true; }
    if (t.closest('[data-bilan-aujourdhui]')) { k.jour = A.iso; k.ouvert = ''; garder('[data-bilan-date]'); return true; }
    const i = t.closest('[data-bilan-ind]'); if (i) { k.ouvert = k.ouvert === i.dataset.bilanInd ? '' : i.dataset.bilanInd; X.rendre(); const d = $(`[data-bilan-detail="${CSS.escape(k.ouvert)}"]`, root);
      if (d) { d.focus({ preventScroll: true }); d.scrollIntoView({ block: 'nearest', behavior: 'instant' }); } else $(`[data-bilan-ind="${CSS.escape(i.dataset.bilanInd)}"]`, root)?.focus({ preventScroll: true }); return true; }
    const d = t.closest('[data-bilan-dossier]'); if (d) { const x = calcul().b.indicateurs.find((y) => y.id === k.ouvert), y = x?.dossiers[+d.dataset.bilanDossier]; if (y) { etat.ecranJour = ''; X.executer({ aller: y.aller }); } return true; }
    return false;
  }
  function change(t) { if (etat.ecranJour !== 'bilan' || !t.matches?.('[data-bilan-date]')) return false; if (/^\d{4}-\d{2}-\d{2}$/.test(t.value)) { B().jour = t.value; B().ouvert = ''; X.rendre(); $('[data-bilan-date]', root)?.focus({ preventScroll: true }); } return true; }
  return { rendre, clic, change, ouvrir };
}
