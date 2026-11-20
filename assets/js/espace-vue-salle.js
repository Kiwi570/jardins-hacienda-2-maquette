/* L'onglet « Salle » de « Réservations » (v7.7.6) : le plan de la salle pour un service.
   Les réservations du service en étiquettes ; on en touche une, puis une table (ou on la fait glisser dessus à la
   souris) : elle y est assise. Une table touchée seule dit qui s'y assoit. « Placer tout seul » assoit ce qui reste.
   Sur écran large, les tables sont à leur place sur le plan (celui de la page Réserver) ; sur téléphone, rangées par
   zone. Les règles sont dans espace-salle.js ; ce fichier dessine et écoute. */
import { typo, STATUTS, fmt, maj, heure, pluriel, servicesDe } from './espace-regles.js?v=7';
import { planDuService, libre, proposer, placerTout, placeDe, avisPlace, assemblagesPossibles, nomPlace, cleSalle, ETATS_TABLE } from './espace-salle.js?v=7';
import { refusInstallation } from './espace-presence.js?v=7';
import { repliTerrasse, soirDEte, exempleEte } from './espace-repli.js?v=7';
import { terrasseOuverte } from './espace-salle.js?v=7';

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

  const maj1 = (x) => x.replace(/^./, (c) => c.toUpperCase());
  function table(t, p, ch, prop) {
    const qui = t.occupant || t.resas[0], conflit = p.conflits.some((c) => c.table === t.id), avis = ch ? avisPlace(p, t, ch) : null, possible = !!avis?.ok;
    const genre = t.fermee ? 'fermee' : !t.resas.length ? 'libre' : t.resas.every((r) => r.statut === 'arrivee') ? 'arrivee' : t.resas.some((r) => r.statut === 'a-confirmer') ? 'attente' : 'prise';
    const etatDit = t.horsSaison ? 'fermée, la terrasse rouvre en juin' : ETATS_TABLE[t.etat].toLowerCase(), avec = qui?.via ? ` (rapprochée : ${nomPlace(qui.via)})` : '';
    const dit = `Table ${t.id}, ${t.places} places, ${t.zoneNom}, ${etatDit}${t.horsSaison ? '' : t.resas.length ? ` : ${t.resas.map((r) => `${nom(r)} à ${heure(r.heure)}, ${pluriel(+r.couverts, 'couvert')}${r.installe ? ', installés' : r.parti ? ', partis' : ''}`).join(' ; ')}${avec}` : ' : aucune réservation'}${conflit ? '. Deux réservations en même temps' : ''}${prop ? '. Proposée' : ''}${avis && !avis.ok ? `. Ne convient pas : ${avis.raison}` : ''}`;
    const marque = t.horsSaison || ['prete', 'occupee'].includes(t.etat) ? '' : ETATS_TABLE[t.etat];
    return `<button type="button" class="esp-table esp-table--${e(t.forme)} est-${genre} est-t-${t.etat}${possible ? ' est-possible' : ''}${prop ? ' est-proposee' : ''}${conflit ? ' est-conflit' : ''}${qui?.via ? ' est-rapprochee' : ''}${etat.tableVue === t.id ? ' est-vue' : ''}" data-table="${e(t.id)}" data-etat-de-table="${t.etat}" style="--x:${pct(t.x, 1000)};--y:${pct(t.y, 640)};--l:${pct(t.l, 1000)};--ht:${pct(t.h, 640)}" aria-label="${e(dit)}"${t.horsSaison ? ' aria-disabled="true"' : ''}${ch ? '' : ` aria-expanded="${etat.tableVue === t.id}"`}>
      <b>${e(t.id)}</b><small>${t.places} pl.</small>
      <span class="esp-table__qui">${t.horsSaison ? 'Fermée' : qui ? `${qui.installe ? 'Installés' : qui.statut === 'arrivee' && !qui.parti ? 'Arrivés' : heure(qui.heure)} · <span class="esp-table__nom">${e(nom(qui))} · </span>${+qui.couverts}${t.resas.length > 1 ? ` (+${t.resas.length - 1})` : ''}` : marque ? '' : 'Libre'}${conflit ? ' · à revoir' : ''}</span>${marque ? `<i class="esp-table__etat">${marque}</i>` : ''}${qui?.via ? `<i class="esp-table__lien" aria-hidden="true">+ ${e(qui.via.split('+').filter((x) => x !== t.id).join(', '))}</i>` : ''}${prop ? '<i class="esp-table__badge">Proposée</i>' : ''}</button>`;
  }

  function ficheTable(p) {
    const t = p.tables.find((x) => x.id === etat.tableVue); if (!t) return '';
    const libres = p.aPlacer.filter((r) => libre(t, r)), cle = cleSalle(etat.jour, p.service.service);
    const etats = t.horsSaison ? '' : `<p class="esp-salle__etats" data-tables-etat="${e(cle)}"><span>État de la table : <b class="esp-pastille esp-pastille--t-${t.etat}">${ETATS_TABLE[t.etat]}</b></span>
        ${t.etat === 'a-debarrasser' ? `<button type="button" class="esp-bouton" data-etat-table="${e(t.id)}" data-etat="a-preparer">Débarrassée</button>` : ''}${['a-debarrasser', 'a-preparer'].includes(t.etat) ? `<button type="button" class="esp-bouton esp-bouton--ok" data-etat-table="${e(t.id)}" data-etat="">Table prête</button>` : ''}
        ${t.etat === 'prete' ? `<button type="button" class="esp-bouton" data-etat-table="${e(t.id)}" data-etat="a-preparer">À préparer</button><button type="button" class="esp-bouton esp-bouton--discret" data-etat-table="${e(t.id)}" data-etat="indisponible">Rendre indisponible</button>` : ''}
        ${t.etat === 'indisponible' ? `<button type="button" class="esp-bouton" data-etat-table="${e(t.id)}" data-etat="">Rendre disponible</button>` : ''}<span class="esp-source">Sur cet appareil</span></p>`;
    return `<div class="esp-salle__fiche" data-fiche-table="${e(t.id)}"><h4>Table ${e(t.id)} <small>${t.places} places · ${e(t.zoneNom)}${t.note ? ` · ${e(t.note)}` : ''}</small></h4>
      ${etats}
      ${t.resas.length ? `<ul class="esp-salle__assis">${t.resas.map((r) => { const cap = r.via ? placeDe(p, r.via)?.places || t.places : t.places; return `<li><span><b>${heure(r.heure)}</b> ${e(nom(r))} · ${pluriel(+r.couverts, 'couvert')} <span class="esp-pastille esp-pastille--${r.statut}">${r.installe ? 'Installés' : r.parti ? 'Partis' : STATUTS[r.statut]}</span>${r.via ? ` <span class="esp-salle__rapprochee">${e(maj1(nomPlace(r.via)))} rapprochées, ${cap} places</span>` : ''}${+r.couverts > cap ? ` <span class="esp-salle__serre">${cap} places pour ${+r.couverts}</span>` : ''}</span>
          <span class="esp-salle__gestes">${r.installe ? `<button type="button" class="esp-bouton esp-bouton--ok" data-depart="${e(r.id)}">Noter le départ</button>` : r.statut === 'arrivee' && !r.parti && etat.jour === A.iso ? `<button type="button" class="esp-bouton esp-bouton--ok" data-installer="${e(r.id)}">Installer</button>` : ''}${r.installe || r.parti ? '' : `<button type="button" class="esp-bouton" data-retirer-table="${e(r.id)}">${r.via ? 'Séparer les tables' : 'Retirer de la table'}</button>`}</span></li>`; }).join('')}</ul>` : '<p class="esp-aide">Aucune réservation à cette table pour ce service.</p>'}
      ${libres.length && !t.fermee ? `<p class="esp-salle__asseoir"><span>Asseoir ici :</span>${libres.map((r) => `<button type="button" class="esp-bouton" data-asseoir="${e(r.id)}">${heure(r.heure)} · ${e(nom(r))} · ${+r.couverts} couv.</button>`).join('')}</p>` : ''}
      <p><button type="button" class="esp-bouton esp-bouton--discret" data-fermer-table>Fermer</button></p></div>`;
  }
  /* Une réservation est choisie : ce qui convient, ce qui ne convient pas et pourquoi, et les tables à rapprocher. */
  function aideChoix(p, ch) {
    if (!ch) return '';
    const avis = p.tables.map((t) => ({ t, a: avisPlace(p, t, ch) })), non = avis.filter((x) => !x.a.ok), ass = (p.assemblages || []).map((a) => ({ a, v: avisPlace(p, a, ch) }));
    return `<div class="esp-salle__choix" data-aide-choix><p><b>${e(nom(ch))}</b>, ${pluriel(+ch.couverts, 'couvert')} à ${heure(ch.heure)}${ch.table ? `, pour l'instant ${e(nomPlace(ch.table))}` : ''}. ${avis.some((x) => x.a.ok) ? `Tables qui conviennent : ${avis.filter((x) => x.a.ok).map((x) => x.t.id).join(', ')}.` : 'Aucune table seule ne convient.'}</p>
      ${ass.some((x) => x.v.ok) ? `<p class="esp-salle__assembler"><span>Rapprocher deux tables :</span>${ass.filter((x) => x.v.ok).map((x) => `<button type="button" class="esp-bouton" data-assembler="${e(x.a.id)}" aria-label="Rapprocher les ${e(nomPlace(x.a.id))} pour ${e(nom(ch))} : ${x.a.places} places">${e(maj1(nomPlace(x.a.id)))} · ${x.a.places} places</button>`).join('')}</p><p class="esp-aide">Aperçu : pendant ce repas, les deux tables ne peuvent plus servir séparément. Capacité fixée dans la configuration (exemple à valider).</p>` : ''}
      <details class="esp-salle__pourquoi"><summary>Pourquoi pas les autres ?</summary><ul>${[...non.map((x) => `<li><b>Table ${e(x.t.id)}</b> : ${e(x.a.raison)}</li>`), ...ass.filter((x) => !x.v.ok).map((x) => `<li><b>${e(maj1(nomPlace(x.a.id)))}</b> : ${e(x.v.raison)}</li>`)].join('') || '<li>Toutes les tables conviennent.</li>'}</ul></details></div>`;
  }

  /* Le repli de la terrasse : un aperçu, à ajuster, puis à appliquer. Fermer ne change rien. */
  function panneauRepli(p) {
    const o = etat.repli; if (!o) return '';
    if (o.bilan) return `<article class="esp-carte esp-repli" aria-labelledby="t-repli" data-repli tabindex="-1"><h3 id="t-repli">Repli en intérieur : ce qui a été fait</h3>
      <ul class="esp-repli__bilan">${o.bilan.faits.length ? `<li class="est-ok"><b>${pluriel(o.bilan.faits.length, 'réservation')} ${o.bilan.faits.length > 1 ? 'déplacées' : 'déplacée'} en salle</b> : ${o.bilan.faits.map((x) => `${e(x.nom)} (${e(x.vers)})`).join(', ')}.</li>` : '<li>Aucune réservation n\'a été déplacée.</li>'}
        ${o.bilan.refus.map((x) => `<li class="est-non"><b>${e(x.nom)} n'a pas été déplacé</b> : ${e(x.raison)}</li>`).join('')}
        ${o.bilan.restes.map((x) => `<li class="est-non"><b>${e(x)}</b></li>`).join('')}
        ${o.bilan.tables.length ? `<li>Tables de la terrasse rendues indisponibles pour ce service : ${o.bilan.tables.join(', ')}.</li>` : ''}</ul>
      <p class="esp-aide">Chaque déplacement peut être annulé avec « Annuler » (plusieurs fois de suite).</p>
      <p><button type="button" class="esp-bouton" data-repli-fermer>Fermer</button></p></article>`;
    const a = repliTerrasse(ctx(), S(), D.salle, etat.jour, p.service.service, o.choix || {});
    const ligne = (x) => `<li><span class="esp-repli__qui"><b>${heure(x.resa.heure)} · ${e(nom(x.resa))}</b> ${pluriel(+x.resa.couverts, 'couvert')}<small>${x.de ? `pour l'instant ${e(nomPlace(x.de))}` : 'avait demandé la terrasse, pas encore placée'}</small></span>
        <span class="esp-champ esp-repli__vers"><label for="repli-${e(x.resa.id)}">En salle</label><select id="repli-${e(x.resa.id)}" data-repli-choix="${e(x.resa.id)}">${x.options.map((op) => `<option value="${e(op.id)}"${op.id === x.vers ? ' selected' : ''}>${e(maj1(op.nom))} · ${op.places} places${op.id.includes('+') ? ' (à rapprocher)' : ''}</option>`).join('')}<option value="garder">La laisser en terrasse</option></select></span></li>`;
    return `<article class="esp-carte esp-repli" aria-labelledby="t-repli" data-repli tabindex="-1"><h3 id="t-repli">Préparer un repli en intérieur <span class="esp-source">Aperçu : rien n'est encore changé</span></h3>
      ${!a.concernees.length ? '<p class="esp-vide">Aucune réservation en terrasse pour ce service : rien à replier.</p>' : `
      <p class="esp-repli__resume">${pluriel(a.concernees.length, 'réservation')} en terrasse (${a.concernees.reduce((n, r) => n + (+r.couverts || 0), 0)} couverts) : ${a.propositions.length} ${a.propositions.length > 1 ? 'trouvent' : 'trouve'} une place en salle${a.sansSolution.length ? `, ${a.sansSolution.length} sans solution` : ''}${a.installes.length ? `, ${a.installes.length} déjà ${a.installes.length > 1 ? 'installées' : 'installée'}` : ''}${a.gardees.length ? `, ${a.gardees.length} ${a.gardees.length > 1 ? 'laissées' : 'laissée'} dehors` : ''}.</p>
      ${a.propositions.length ? `<h4>Places proposées en salle</h4><ul class="esp-repli__liste">${a.propositions.map(ligne).join('')}</ul>` : ''}
      ${a.gardees.length ? `<h4>Laissées en terrasse</h4><ul class="esp-repli__liste">${a.gardees.map((r) => `<li><span class="esp-repli__qui"><b>${heure(r.heure)} · ${e(nom(r))}</b> ${pluriel(+r.couverts, 'couvert')}</span><button type="button" class="esp-bouton" data-repli-reprendre="${e(r.id)}">Lui proposer une place en salle</button></li>`).join('')}</ul>` : ''}
      ${a.sansSolution.length ? `<h4>Sans solution en salle</h4><ul class="esp-repli__sans">${a.sansSolution.map((x) => `<li><b>${heure(x.resa.heure)} · ${e(nom(x.resa))}</b>, ${pluriel(+x.resa.couverts, 'couvert')} : ${e(x.raison)}</li>`).join('')}</ul>` : ''}
      ${a.conflits.length ? `<p class="esp-repli__conflit">Déjà à revoir avant le repli : ${a.conflits.map((c) => `table ${e(c.table)} (deux réservations en même temps)`).join(', ')}.</p>` : ''}
      ${a.decisions.length ? `<h4>Ce qui reste à décider</h4><ul class="esp-repli__decisions">${a.decisions.map((d) => `<li>${e(d)}</li>`).join('')}</ul>` : ''}
      <p class="esp-repli__option"><label><input type="checkbox" data-repli-fermer-terrasse${o.fermer === false ? '' : ' checked'}> Rendre les tables de la terrasse indisponibles pour ce service <span class="esp-source">Sur cet appareil</span></label></p>`}
      <p class="esp-repli__actions">${a.propositions.length ? `<button type="button" class="bouton" data-repli-appliquer>Appliquer le repli (${pluriel(a.propositions.length, 'déplacement')})</button>` : ''}<button type="button" class="esp-bouton esp-bouton--discret" data-repli-fermer>Fermer sans rien changer</button></p>
      <p class="esp-aide">Chaque déplacement est revérifié au moment d'être enregistré. Les clients ne sont pas prévenus automatiquement.</p></article>`;
  }
  function appliquerRepli() {
    const p = plan(), o = etat.repli, a = repliTerrasse(ctx(), S(), D.salle, etat.jour, p.service.service, o.choix || {}), faits = [], refus = [], tables = [];
    /* Mode connecté : un seul envoi au serveur, qui revérifie tout et répond pour l'ensemble (tout ou rien). */
    if (X.ctx().exemples === false) { agir('placerPlusieurs', { places: a.places }, { msg: `Repli appliqué : ${pluriel(a.propositions.length, 'réservation')} en salle.` }); etat.repli = null; return; }
    for (const x of a.propositions) {
      const r = agir('placerResa', { id: x.resa.id, table: x.vers }, { msg: `Repli : ${nom(x.resa)}, ${nomPlace(x.vers)}.` });
      if (r) faits.push({ nom: nom(x.resa), vers: nomPlace(x.vers) }); else refus.push({ nom: nom(x.resa), raison: X.raisonRefus?.() || 'la place a été prise entre-temps.' });
    }
    if (o.fermer !== false && X.ctx().exemples !== false) { const q = plan(); for (const t of q.tables.filter((x) => x.zone === 'terrasse' && !x.horsSaison && !x.resas.length && x.etat !== 'indisponible')) { if (agir('etatTable', { cle: cleSalle(etat.jour, q.service.service), table: t.id, etat: 'indisponible' }, { msg: `Table ${t.id} indisponible.` })) tables.push(t.id); } }
    etat.repli = { bilan: { faits, refus, tables, restes: [...a.sansSolution.map((x) => `${nom(x.resa)} (${+x.resa.couverts} couverts) reste sans solution : ${x.raison}`), ...a.installes.map((r) => `${nom(r)} est installé en terrasse : à déplacer de vive voix.`), ...a.gardees.map((r) => `${nom(r)} reste en terrasse, à votre demande.`)] } };
    dire(`Repli appliqué : ${pluriel(faits.length, 'réservation')} ${faits.length > 1 ? 'déplacées' : 'déplacée'}${refus.length ? `, ${refus.length} ${refus.length > 1 ? 'refusées' : 'refusée'}` : ''}${a.sansSolution.length ? `, ${a.sansSolution.length} sans solution` : ''}.`);
  }

  /** Dessine l'onglet dans `cible`. */
  function rendre(cible) {
    const p = plan(), sv = p.service, svs = servicesDe(D.reservation), ch = choisie(p), prop = ch ? proposer(p, ch) : null, tous = [...p.aPlacer, ...p.placees].sort((a, b) => a.debutMin - b.debutMin);
    if (!ch) etat.resaAPlacer = null;
    if (!terrasseOuverte(etat.jour)) etat.repli = null;
    const zones = [...new Set(p.tables.map((t) => t.zone))];
    const resume = [pluriel(sv.tables, 'réservation'), ...(!sv.tables ? [] : !p.aPlacer.length ? [sv.tables > 1 ? 'toutes placées' : 'placée'] : [p.placees.length ? `${p.placees.length} ${p.placees.length > 1 ? 'placées' : 'placée'}` : '', `${p.aPlacer.length} à placer`])].filter(Boolean).join(' · ');
    cible.innerHTML = `<div class="esp-service-tete"><div><h3 class="esp-service-tete__jour">${e(maj(fmt(etat.jour, { weekday: 'long', day: 'numeric', month: 'long' })))}${etat.jour === A.iso ? ' <span class="esp-pastille">Aujourd\'hui</span>' : ''}</h3>
          <p class="esp-service-tete__resume">${sv.ouvert || sv.resas.length ? e(resume) : 'Pas de service.'}</p></div>
        <p class="esp-service-tete__outils"><span class="esp-choix" role="group" aria-label="Le service à voir">${svs.map((s) => `<button type="button" class="esp-choix__b" data-service-vu="${s.id}" aria-pressed="${s.id === sv.service}">${s.libelle}</button>`).join('')}</span>
          ${p.aPlacer.length ? '<button type="button" class="esp-bouton" data-placer-tout>Placer tout seul</button>' : ''}
          ${terrasseOuverte(etat.jour) && (sv.ouvert || sv.resas.length) ? `<button type="button" class="esp-bouton" data-repli aria-expanded="${!!etat.repli}">Préparer un repli en intérieur</button>` : ''}</p></div>
      ${terrasseOuverte(etat.jour) ? typo(panneauRepli(p)) : ''}
      <article class="esp-carte esp-salle-carte" aria-labelledby="t-salle"><h3 id="t-salle">Plan de salle</h3>
        ${tous.length ? `<div class="esp-salle__resas" role="group" aria-label="Les réservations du service">${tous.map((r) => { const place = p.placees.includes(r); return `<button type="button" class="esp-etiquette${place ? ' est-placee' : ''}" data-choisir-resa="${e(r.id)}" aria-pressed="${etat.resaAPlacer === r.id}" draggable="true"><b>${heure(r.heure)}</b><span>${e(nom(r))} · ${+r.couverts} couv.</span><small>${place ? `table ${e(r.table)}` : 'à placer'}</small></button>`; }).join('')}</div>` : ''}
        <p class="esp-salle__consigne" role="status">${!tous.length ? (sv.ouvert ? 'Pas encore de réservation pour ce service.' : 'Pas de service ce jour-là.') : ch ? `Touchez une table pour ${e(nom(ch))} (${pluriel(+ch.couverts, 'couvert')}, ${heure(ch.heure)}).${prop ? ` La table ${e(prop.id)} est proposée.` : ' Aucune table libre n\'a assez de places\u00a0: rapprochez deux tables (ci-dessous) ou choisissez-en une plus petite.'}` : 'Touchez une réservation, puis une table. Ou une table, pour voir qui s\'y assoit.'}</p>
        <div class="esp-salle${ch ? ' est-en-choix' : ''}" data-salle>${FOND}${zones.map((z) => `<div class="esp-salle__zone" data-zone="${e(z)}"><h4>${e(D.salle.zones?.[z] || z)}</h4><div class="esp-salle__tables">${p.tables.filter((t) => t.zone === z).map((t) => table(t, p, ch, prop?.id === t.id)).join('')}</div></div>`).join('')}</div>
        <ul class="esp-salle__legende" aria-label="Légende"><li class="est-libre">Libre</li><li class="est-prise">Réservée</li><li class="est-arrivee">Arrivés ou installés</li><li class="est-a-remettre">À débarrasser ou à préparer</li><li class="est-fermee">Fermée ou indisponible</li></ul>
        ${typo(aideChoix(p, ch) + ficheTable(p))}
        <p class="esp-aide">Les tables sont celles du plan de la page Réserver\u00a0: un client qui a choisi sa table sur le site arrive déjà placé. ${terrasseOuverte(etat.jour) ? 'La terrasse est ouverte.' : 'La terrasse rouvre en juin.'}</p>
        ${X.ctx().exemples !== false ? `<p class="esp-plus"><button type="button" class="esp-lien" data-exemple-ete>${terrasseOuverte(etat.jour) ? 'Recharger l\'exemple d\'un soir d\'été' : 'Voir l\'exemple d\'un soir d\'été, terrasse ouverte (repli en cas de pluie)'}</button> <span class="esp-source">Exemple</span></p>` : ''}</article>`;
  }

  /** Assoit la réservation à la table (ou à l'assemblage), si elle y est libre ; sinon dit pourquoi. */
  function asseoir(idResa, idTable) {
    const p = plan(), r = [...p.aPlacer, ...p.placees].find((x) => x.id === idResa), t = placeDe(p, idTable);
    if (!r || !t) return false;
    const avis = avisPlace(p, t, r);
    if (!avis.ok && avis.genre !== 'serre') { dire(avis.genre === 'fermee' && (t.horsSaison || t.composantes?.some((c) => c.horsSaison)) ? 'La terrasse est fermée hors saison : elle rouvre en juin.' : avis.raison); return false; }
    if (String(r.table || '') === t.id) return false;
    const ok = agir('placerResa', { id: r.id, table: t.id }, { msg: `${nom(r)} : ${nomPlace(t.id)}${t.assemblage ? ` rapprochées (${t.places} places)` : ''}${t.places < +r.couverts ? ` (${t.places} places pour ${+r.couverts} couverts)` : ''}.` });
    /* Le groupe est déjà là : s'il peut être installé tout de suite, il l'est (sinon la raison s'affichera au moment d'installer). */
    if (ok === true && r.statut === 'arrivee' && !r.installe && !r.parti && etat.jour === A.iso) { const v = X.trouverResaDuJour(r.id); if (v && !refusInstallation(ctx(), S(), D.salle, v, A.min)) agir('installer', { id: r.id, minute: A.min }, { msg: `${nom(r)} : installés, ${nomPlace(t.id)}.` }); }
    return ok;
  }

  function clic(c) {
    const et = c.closest('[data-choisir-resa]');
    if (et) { const id = et.dataset.choisirResa; etat.resaAPlacer = etat.resaAPlacer === id ? null : id; etat.tableVue = null; X.rendre(); $(`[data-choisir-resa="${CSS.escape(id)}"]`, root)?.focus(); return true; }
    if (c.closest('[data-repli-appliquer]')) { appliquerRepli(); X.rendre(); $('[data-repli]', root)?.focus(); return true; }
    if (c.closest('[data-repli-fermer]')) { etat.repli = null; X.rendre(); $('[data-repli]', root)?.focus(); return true; }
    const rr = c.closest('[data-repli-reprendre]'); if (rr) { delete etat.repli.choix[rr.dataset.repliReprendre]; X.rendre(); $('[data-repli]', root)?.focus(); return true; }
    if (c.closest('button[data-repli]')) { etat.repli = etat.repli ? null : { choix: {} }; etat.resaAPlacer = null; etat.tableVue = null; X.rendre(); (etat.repli ? $('article[data-repli]', root) : $('button[data-repli]', root))?.focus(); return true; }
    if (c.closest('[data-exemple-ete]')) { const d = soirDEte(ctx()); if (!d) { dire('Aucun soir d\'été ouvert dans l\'année qui vient.'); return true; }
      agir('exempleEte', { resas: exempleEte(ctx(), d) }, { msg: `Exemple chargé : un samedi soir de juin, terrasse ouverte. Réservations d'exemple, noms inventés.` }); etat.jour = d; etat.serviceVu = 'soir'; etat.repli = { choix: {} }; etat.resaAPlacer = null; etat.tableVue = null; X.rendre(); $('article[data-repli]', root)?.focus(); return true; }
    const asb = c.closest('[data-assembler]'); if (asb) { if (etat.resaAPlacer && asseoir(etat.resaAPlacer, asb.dataset.assembler)) etat.resaAPlacer = null; X.rendre(); $(`[data-table="${CSS.escape(asb.dataset.assembler.split('+')[0])}"]`, root)?.focus({ preventScroll: true }); return true; }
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

  function change(t) {
    const ch = t.closest('[data-repli-choix]'); if (ch && etat.repli) { (etat.repli.choix ||= {})[ch.dataset.repliChoix] = ch.value; X.rendre(); ($(`[data-repli-choix="${CSS.escape(ch.dataset.repliChoix)}"]`, root) || $('article[data-repli]', root))?.focus(); return true; }
    const f = t.closest('[data-repli-fermer-terrasse]'); if (f && etat.repli) { etat.repli.fermer = f.checked; return true; }
    return false;
  }
  return { rendre, clic, asseoir, change };
}
