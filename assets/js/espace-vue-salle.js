/* L'onglet « Salle » de « Réservations » (v7.7.6) : le plan de la salle pour un service.
   Les réservations du service en étiquettes ; on en touche une, puis une table (ou on la fait glisser dessus à la
   souris) : elle y est assise. Une table touchée seule dit qui s'y assoit. « Placer tout seul » assoit ce qui reste.
   Sur écran large, les tables sont à leur place sur le plan (celui de la page Réserver) ; sur téléphone, rangées par
   zone. Les règles sont dans espace-salle.js ; ce fichier dessine et écoute. */
import { STATUTS, fmt, maj, heure, pluriel, servicesDe } from './espace-regles.js?v=7';
import { planDuService, libre, proposer, placerTout } from './espace-salle.js?v=7';

const FOND = `<svg class="esp-salle__fond" viewBox="0 0 1000 640" aria-hidden="true" focusable="false">
  <rect class="esp-salle__sol" x="20" y="20" width="680" height="600" rx="6"/>
  <rect class="esp-salle__dehors" x="714" y="22" width="204" height="596" rx="18"/>
  <rect class="esp-salle__eau" x="926" y="40" width="54" height="560" rx="10"/>
  <g class="esp-salle__zones"><rect x="30" y="126" width="232" height="398" rx="18"/><rect x="252" y="30" width="438" height="150" rx="18"/><rect x="298" y="244" width="344" height="180" rx="18"/></g>
  <rect class="esp-salle__feu" x="20" y="270" width="42" height="120" rx="4"/>
  <rect class="esp-salle__bar" x="36" y="568" width="224" height="36" rx="8"/>
  <path class="esp-salle__mur" d="M420 620H20V20H700V226M700 434V620H520"/>
  <path class="esp-salle__vitre" d="M262 20H684M700 232V428"/>
  <g class="esp-salle__noms"><text x="44" y="150">AU COIN DU FEU</text><text x="470" y="204" text-anchor="middle">LES BAIES VITRÉES</text><text x="470" y="412" text-anchor="middle">LA GRANDE TABLE</text><text x="816" y="596" text-anchor="middle">TERRASSE</text><text x="148" y="592" text-anchor="middle">BAR</text><text x="470" y="610" text-anchor="middle">ENTRÉE</text></g>
</svg>`;

export function creerSalle(X) {
  const { root, $, e, S, A, D, ctx, etat, agir, dire } = X;
  const pct = (v, sur) => `${((v / sur) * 100).toFixed(2)}%`;
  const plan = () => planDuService(ctx(), S(), D.salle, etat.jour, X.serviceVu());
  const nom = (r) => r.nom || 'Sans nom';
  const choisie = (p) => [...p.aPlacer, ...p.placees].find((r) => r.id === etat.resaAPlacer) || null;

  function table(t, p, ch, prop) {
    const qui = t.resas[0], conflit = p.conflits.some((c) => c.table === t.id), possible = ch && libre(t, ch) && t.places >= (+ch.couverts || 1);
    const genre = t.fermee ? 'fermee' : !t.resas.length ? 'libre' : t.resas.every((r) => r.statut === 'arrivee') ? 'arrivee' : t.resas.some((r) => r.statut === 'a-confirmer') ? 'attente' : 'prise';
    const dit = `Table ${t.id}, ${t.places} places, ${t.zoneNom} : ${t.fermee ? 'fermée, la terrasse rouvre en juin' : t.resas.length ? t.resas.map((r) => `${nom(r)} à ${heure(r.heure)}, ${pluriel(+r.couverts, 'couvert')}`).join(' ; ') : 'libre'}${conflit ? '. Deux réservations en même temps' : ''}${prop ? '. Proposée' : ''}`;
    return `<button type="button" class="esp-table esp-table--${e(t.forme)} est-${genre}${possible ? ' est-possible' : ''}${prop ? ' est-proposee' : ''}${conflit ? ' est-conflit' : ''}${etat.tableVue === t.id ? ' est-vue' : ''}" data-table="${e(t.id)}" style="--x:${pct(t.x, 1000)};--y:${pct(t.y, 640)};--l:${pct(t.l, 1000)};--ht:${pct(t.h, 640)}" aria-label="${e(dit)}"${t.fermee ? ' aria-disabled="true"' : ''}${ch ? '' : ` aria-expanded="${etat.tableVue === t.id}"`}>
      <b>${e(t.id)}</b><small>${t.places} pl.</small>
      <span class="esp-table__qui">${t.fermee ? 'Fermée' : qui ? `${qui.statut === 'arrivee' ? 'Arrivés' : heure(qui.heure)} · <span class="esp-table__nom">${e(nom(qui))} · </span>${+qui.couverts}${t.resas.length > 1 ? ` (+${t.resas.length - 1})` : ''}` : 'Libre'}${conflit ? ' · à revoir' : ''}</span>${prop ? '<i class="esp-table__badge">Proposée</i>' : ''}</button>`;
  }

  function ficheTable(p) {
    const t = p.tables.find((x) => x.id === etat.tableVue); if (!t) return '';
    const libres = p.aPlacer.filter((r) => libre(t, r));
    return `<div class="esp-salle__fiche" data-fiche-table="${e(t.id)}"><h4>Table ${e(t.id)} <small>${t.places} places · ${e(t.zoneNom)}${t.note ? ` · ${e(t.note)}` : ''}</small></h4>
      ${t.resas.length ? `<ul class="esp-salle__assis">${t.resas.map((r) => `<li><span><b>${heure(r.heure)}</b> ${e(nom(r))} · ${pluriel(+r.couverts, 'couvert')} <span class="esp-pastille esp-pastille--${r.statut}">${STATUTS[r.statut]}</span>${+r.couverts > t.places ? ` <span class="esp-salle__serre">${t.places} places pour ${+r.couverts}</span>` : ''}</span><button type="button" class="esp-bouton" data-retirer-table="${e(r.id)}">Retirer de la table</button></li>`).join('')}</ul>` : '<p class="esp-aide">Libre pour ce service.</p>'}
      ${libres.length ? `<p class="esp-salle__asseoir"><span>Asseoir ici\u00a0:</span>${libres.map((r) => `<button type="button" class="esp-bouton" data-asseoir="${e(r.id)}">${heure(r.heure)} · ${e(nom(r))} · ${+r.couverts} couv.</button>`).join('')}</p>` : ''}
      <p><button type="button" class="esp-bouton esp-bouton--discret" data-fermer-table>Fermer</button></p></div>`;
  }

  /** Dessine l'onglet dans `cible`. */
  function rendre(cible) {
    const p = plan(), sv = p.service, svs = servicesDe(D.reservation), ch = choisie(p), prop = ch ? proposer(p, ch) : null, tous = [...p.aPlacer, ...p.placees].sort((a, b) => a.debutMin - b.debutMin);
    if (!ch) etat.resaAPlacer = null;
    const zones = [...new Set(p.tables.map((t) => t.zone))];
    const resume = [pluriel(sv.tables, 'réservation'), ...(!sv.tables ? [] : !p.aPlacer.length ? [sv.tables > 1 ? 'toutes placées' : 'placée'] : [p.placees.length ? `${p.placees.length} ${p.placees.length > 1 ? 'placées' : 'placée'}` : '', `${p.aPlacer.length} à placer`])].filter(Boolean).join(' · ');
    cible.innerHTML = `<div class="esp-service-tete"><div><h3 class="esp-service-tete__jour">${e(maj(fmt(etat.jour, { weekday: 'long', day: 'numeric', month: 'long' })))}${etat.jour === A.iso ? ' <span class="esp-pastille">Aujourd\'hui</span>' : ''}</h3>
          <p class="esp-service-tete__resume">${sv.ouvert || sv.resas.length ? e(resume) : 'Pas de service.'}</p></div>
        <p class="esp-service-tete__outils"><span class="esp-choix" role="group" aria-label="Le service à voir">${svs.map((s) => `<button type="button" class="esp-choix__b" data-service-vu="${s.id}" aria-pressed="${s.id === sv.service}">${s.libelle}</button>`).join('')}</span>
          ${p.aPlacer.length ? '<button type="button" class="esp-bouton" data-placer-tout>Placer tout seul</button>' : ''}</p></div>
      <article class="esp-carte esp-salle-carte" aria-labelledby="t-salle"><h3 id="t-salle">Plan de salle</h3>
        ${tous.length ? `<div class="esp-salle__resas" role="group" aria-label="Les réservations du service">${tous.map((r) => { const place = p.placees.includes(r); return `<button type="button" class="esp-etiquette${place ? ' est-placee' : ''}" data-choisir-resa="${e(r.id)}" aria-pressed="${etat.resaAPlacer === r.id}" draggable="true"><b>${heure(r.heure)}</b><span>${e(nom(r))} · ${+r.couverts} couv.</span><small>${place ? `table ${e(r.table)}` : 'à placer'}</small></button>`; }).join('')}</div>` : ''}
        <p class="esp-salle__consigne" role="status">${!tous.length ? (sv.ouvert ? 'Pas encore de réservation pour ce service.' : 'Pas de service ce jour-là.') : ch ? `Touchez une table pour ${e(nom(ch))} (${pluriel(+ch.couverts, 'couvert')}, ${heure(ch.heure)}).${prop ? ` La table ${e(prop.id)} est proposée.` : ' Aucune table libre n\'a assez de places\u00a0: choisissez-en une plus petite ou rapprochez des tables.'}` : 'Touchez une réservation, puis une table. Ou une table, pour voir qui s\'y assoit.'}</p>
        <div class="esp-salle${ch ? ' est-en-choix' : ''}" data-salle>${FOND}${zones.map((z) => `<div class="esp-salle__zone" data-zone="${e(z)}"><h4>${e(D.salle.zones?.[z] || z)}</h4><div class="esp-salle__tables">${p.tables.filter((t) => t.zone === z).map((t) => table(t, p, ch, prop?.id === t.id)).join('')}</div></div>`).join('')}</div>
        <ul class="esp-salle__legende" aria-label="Légende"><li class="est-libre">Libre</li><li class="est-prise">Réservée</li><li class="est-arrivee">Arrivés</li><li class="est-fermee">Fermée</li></ul>
        ${ficheTable(p)}
        <p class="esp-aide">Les tables sont celles du plan de la page Réserver\u00a0: un client qui a choisi sa table sur le site arrive déjà placé. La terrasse rouvre en juin.</p></article>`;
  }

  /** Assoit la réservation à la table, si elle y est libre. */
  function asseoir(idResa, idTable) {
    const p = plan(), r = [...p.aPlacer, ...p.placees].find((x) => x.id === idResa), t = p.tables.find((x) => x.id === idTable);
    if (!r || !t) return false;
    if (t.fermee) { dire('La terrasse est fermée hors saison : elle rouvre en juin.'); return false; }
    if (!libre(t, r)) { const a = t.resas.find((x) => x.id !== r.id); dire(`La table ${t.id} est prise à cette heure-là (${nom(a)}, ${heure(a.heure)}).`); return false; }
    if (String(r.table || '') === t.id) return false;
    return agir('placerResa', { id: r.id, table: t.id }, { msg: `${nom(r)} : table ${t.id}${t.places < +r.couverts ? ` (${t.places} places pour ${+r.couverts} couverts)` : ''}.` });
  }

  function clic(c) {
    const et = c.closest('[data-choisir-resa]');
    if (et) { const id = et.dataset.choisirResa; etat.resaAPlacer = etat.resaAPlacer === id ? null : id; etat.tableVue = null; X.rendre(); $(`[data-choisir-resa="${CSS.escape(id)}"]`, root)?.focus(); return true; }
    const tb = c.closest('[data-table]');
    if (tb) {
      const id = tb.dataset.table;
      if (etat.resaAPlacer) { if (asseoir(etat.resaAPlacer, id)) etat.resaAPlacer = null; }
      else if (tb.getAttribute('aria-disabled') === 'true') dire('La terrasse est fermée hors saison : elle rouvre en juin.');
      else etat.tableVue = etat.tableVue === id ? null : id;
      X.rendre(); $(`[data-table="${CSS.escape(id)}"]`, root)?.focus({ preventScroll: true });
      /* La fiche de la table s'ouvre sous le plan : on y descend. */
      if (etat.tableVue === id) $('[data-fiche-table]', root)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      return true;
    }
    const rt = c.closest('[data-retirer-table]');
    if (rt) { const p = plan(), r = p.placees.find((x) => x.id === rt.dataset.retirerTable); if (r) agir('placerResa', { id: r.id, table: '' }, { msg: `${nom(r)} n'a plus de table.` }); X.rendre(); $(`[data-table="${CSS.escape(etat.tableVue || '')}"]`, root)?.focus(); return true; }
    const as = c.closest('[data-asseoir]');
    if (as) { asseoir(as.dataset.asseoir, etat.tableVue); X.rendre(); $(`[data-table="${CSS.escape(etat.tableVue || '')}"]`, root)?.focus(); return true; }
    if (c.closest('[data-fermer-table]')) { const id = etat.tableVue; etat.tableVue = null; X.rendre(); $(`[data-table="${CSS.escape(id || '')}"]`, root)?.focus(); return true; }
    if (c.closest('[data-placer-tout]')) {
      const p = plan(), { places, restes } = placerTout(p), n = Object.keys(places).length;
      if (!n) dire('Aucune table libre ne convient aux réservations qui restent.');
      else agir('placerPlusieurs', { places }, { msg: `${n > 1 ? `${n} réservations placées` : '1 réservation placée'}.${restes.length ? ` Sans table : ${restes.map(nom).join(', ')}.` : ''}` });
      etat.resaAPlacer = null; X.rendre(); $('[data-salle] [data-table]', root)?.focus(); return true;
    }
    return false;
  }

  /* À la souris : une étiquette se glisse sur une table. */
  let glissee = null;
  root.addEventListener('dragstart', (ev) => { const et = ev.target.closest?.('[data-choisir-resa]'); if (!et) return; glissee = et.dataset.choisirResa; ev.dataTransfer.effectAllowed = 'move'; ev.dataTransfer.setData('text/plain', glissee); $('[data-salle]', root)?.classList.add('est-en-choix'); });
  root.addEventListener('dragover', (ev) => { if (glissee && ev.target.closest?.('[data-table]')) { ev.preventDefault(); ev.dataTransfer.dropEffect = 'move'; } });
  root.addEventListener('drop', (ev) => { const tb = ev.target.closest?.('[data-table]'); if (!glissee || !tb) return; ev.preventDefault(); const id = glissee; glissee = null; asseoir(id, tb.dataset.table); etat.resaAPlacer = null; X.rendre(); });
  root.addEventListener('dragend', () => { glissee = null; if (!etat.resaAPlacer) $('[data-salle]', root)?.classList.remove('est-en-choix'); });

  return { rendre, clic, asseoir };
}
