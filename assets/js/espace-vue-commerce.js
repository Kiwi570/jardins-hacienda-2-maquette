/* Du catalogue à la remise au client (v7.14.0, consolidé en v7.14.1) : les écrans des commandes à emporter et des cartes cadeaux.
   - le dossier d'une commande (référence, client, lignes, retrait, état, prochaine action, historique) ;
   - la préparation et les retraits (quantités regroupées par produit, commandes du jour, feuilles à imprimer, capacités) ;
   - le suivi d'une demande de carte cadeau (validation, règlement simulé, émission) ;
   - les cartes émises, et chaque carte (code, solde, utilisations, corrections).
   Les règles sont dans commerce.js (fonctions pures) ; ce fichier dessine et écoute, avec les outils de espace.js.
   v7.14.1 : la production engagée se lit à part de la commande (ses lots, la rectification, « à vérifier ») ; la période
   des retraits se règle dans « Préparation et retraits » ; une utilisation passée se corrige sur une carte expirée.
   Rien ici n'est un paiement réel ni un message envoyé : les règlements sont des simulations notées par l'équipe. */
import { typo, pluriel, fmt, maj } from './espace-regles.js?v=7';
import { UNITES, emporterVitrine } from './espace-publie.js?v=7';
import { lireNombre } from './espace-offres.js?v=7';
import { ETATS, SUITES, PROCHAINE, ETATS_CADEAU, PROCHAINE_CADEAU, ETATS_CARTE, commandes, cadeaux, cartes, capacites, disponibilite, preparation, effetsModification, totalLignes, quantite, euros, retraitTexte, momentTexte, nomClient, soldeCarte, etatCarte, carteParCode, validite, commandesDeOffre, priorites, commerceDuClient, lotsDe, manqueDe, productionAVerifier, preparationCommencee, effetsProduction, joursDeProduction, engagements, periodeRetraits, periodeTexte, refusRetrait, calendrierRetraits, ouvertureRetraits } from './commerce.js?v=7';

const PASTILLE = { recue: 'a-confirmer', validee: 'cours', preparation: 'cours', prete: 'confirmee', retiree: 'confirmee', refusee: 'refusee', annulee: 'refusee' };
const PASTILLE_CAD = { recue: 'a-confirmer', validee: 'cours', reglee: 'cours', emise: 'confirmee', refusee: 'refusee', annulee: 'refusee', ancienne: 'r-non-tentee' };
const PASTILLE_CARTE = { active: 'confirmee', epuisee: 'r-non-tentee', expiree: 'refusee', desactivee: 'refusee' };
const FINIES = ['retiree', 'refusee', 'annulee'];
const QUOI_LOT = { preparation: 'Préparation lancée', supplement: 'Supplément', complement: 'Complément', reprise: 'Repris de l\'ancien suivi', ajout: 'Ajouté par rectification' };

export function creerCommerce(X) {
  const { root, $, $$, e, S, A, D, etat, agir } = X;
  const C = () => (etat.commerce ||= {});
  const lieux = () => D.receptions, dem = () => X.demandes(), maintenant = () => String(X.ctx().maintenant).slice(0, 16);
  const toutes = () => commandes(dem(), S(), lieux()), commande = (id) => toutes().find((c) => c.id === id) || null;
  const tousCadeaux = () => cadeaux(dem(), S(), lieux()), cadeau = (id) => tousCadeaux().find((c) => c.id === id) || null;
  const carte = (id) => S().commerce?.cartes?.[id] || null;
  /* La période des retraits et les horaires qui décident des créneaux : les mêmes que ceux de la garde et du site. */
  const periode = () => periodeRetraits(S(), lieux()), ouverture = () => ouvertureRetraits(X.ctx(), S());
  const horsRetrait = (jour, moment) => refusRetrait(periode(), ouverture(), { jour, moment });
  const jourCourt = (iso) => (iso ? fmt(iso, { weekday: 'long', day: 'numeric', month: 'long' }) : 'date à préciser');
  const arr3 = (n) => Math.round((+n || 0) * 1000) / 1000;
  const quand = (le) => { const [j, h] = String(le || '').split('T'); return j ? `${fmt(j, { day: 'numeric', month: 'long' })}${h ? `, ${+h.slice(0, 2)} h${h.slice(3, 5) !== '00' ? ` ${h.slice(3, 5)}` : ''}` : ''}` : ''; };
  const jourDit = (iso) => (iso ? maj(fmt(iso, { weekday: 'long', day: 'numeric', month: 'long' })) : 'Date à préciser');
  const source = (x) => (x.source === 'demo' ? '<span class="esp-source">Exemple</span>' : '<span class="esp-source esp-source--site">Depuis le site</span>');
  const local = () => `<p class="esp-aide" data-com-local><span class="esp-pastille">Sur cet appareil</span> ${X.connecte ? 'Les commandes à emporter et les cartes cadeaux ne sont pas encore partagées entre vos appareils : elles sont gardées dans ce navigateur.' : 'Dans cette démonstration, tout est enregistré dans ce navigateur : aucun message ne part, aucun paiement n\'est encaissé.'}</p>`;
  const histo = (l) => `<ol class="esp-rec-histo" data-com-histo>${[...(l || [])].reverse().map((h) => `<li data-com-histo-quoi="${e(h.quoi)}"><time>${e(quand(h.le))}</time><span>${e(h.texte)}</span></li>`).join('')}</ol>`;
  const contact = (x) => `${x.telephone ? `<a class="esp-bouton" href="tel:${e(x.telephone.replace(/\s/g, ''))}">Appeler ${e(x.telephone)}</a>` : ''}${x.email ? `<a class="esp-bouton" href="mailto:${e(x.email)}">Écrire à ${e(x.email)}</a>` : ''}`;
  const motifHtml = (cle, titre, bouton, aide) => `<form class="esp-com-motif" data-com-motif="${cle}" novalidate><p class="esp-champ esp-champ--large"><label for="com-motif">${titre} <small>${aide}</small></label><textarea id="com-motif" name="motif" rows="2" required>${e(C().motifTexte || '')}</textarea></p>
    ${C().erreur ? `<p class="esp-erreur" role="alert" data-com-erreur>${e(C().erreur)}</p>` : ''}<p class="esp-com-actions"><button type="submit" class="bouton">${bouton}</button><button type="button" class="esp-bouton" data-com-motif-fermer>Ne rien changer</button></p></form>`;
  const retour = (vers, texte) => `<p class="esp-rec-retour"><button type="button" class="esp-lien" data-com-retour="${vers}"><span aria-hidden="true">←</span> ${texte}</button></p>`;
  const ouvrir = (ecran, id = '') => { etat.commerce = { ecran, id }; etat.dossier = null; X.allerVue('demandes'); $('#com-titre', root)?.focus({ preventScroll: true }); };
  const fermer = () => { etat.commerce = null; };
  /* Les actions : en cas de refus, la phrase des règles s'affiche dans l'écran ; l'état relu est celui qui a été enregistré. */
  const faire = (nom, args, msg) => { const restait = X.enAttenteTotal?.() || 0, ok = agir(nom, args, { msg }); C().erreur = ok ? '' : X.refus(); X.rendre(); if (!ok) $('[data-com-erreur]', root)?.focus?.();
    /* Comme pour les autres demandes : quand la dernière qui attendait reçoit sa décision, c'est dit. */
    if (ok && restait > 0 && !X.enAttenteTotal()) { X.dire('Tout a une réponse : bon service !'); X.feter?.(); }
    return ok; };

  /* ====================== La commande à emporter ====================== */
  const ligneHtml = (l) => `<tr><td>${e(l.nom)}${l.offre ? '' : ' <small class="esp-com-flou" data-cmd-lien-flou>lien au produit à préciser</small>'}</td><td>${e(quantite(l.quantite, l.unite))}${l.detail ? ` <small>(${e(l.detail)})</small>` : ''}</td>
    <td>${l.prix == null ? '<small class="esp-com-flou">prix de l\'époque non conservé</small>' : `${e(euros(l.prix))} ${e(UNITES[l.unite] || '')}`}</td><td class="esp-com-nombre">${l.total == null ? '—' : e(euros(l.total))}</td></tr>`;
  function dispoHtml(c) {
    if (!c.jour) return '';
    const d = disponibilite(S(), { jour: c.jour, moment: c.moment, lignes: c.lignes, sauf: c.id }), cap = capacites(S()), lancee = preparationCommencee(c);
    const prod = (x) => (x.capacite == null ? 'capacité de production non définie (aucune limite appliquée)'
      : lancee ? `à remettre ${e(quantite(x.aRemettre, x.unite))} ; déjà engagé pour cette commande ${e(quantite(x.dejaEngage, x.unite))}${x.demande ? ` ; <b>reste à produire ${e(quantite(x.demande, x.unite))}</b> (réservé dans la capacité, pas encore engagé)` : ''} ; production comptée ce jour ${e(quantite(arr3(x.engage + x.demande), x.unite))} sur ${e(quantite(x.capacite, x.unite))}`
      : `${e(quantite(x.demande, x.unite))} pour cette commande ; déjà comptés ailleurs ${e(quantite(x.engage, x.unite))} sur ${e(quantite(x.capacite, x.unite))}${x.demande > x.reste ? ` — <b>il manque ${e(quantite(arr3(x.demande - x.reste), x.unite))}</b>` : ''}`);
    return `<div class="esp-com-dispo" data-cmd-dispo="${d.ok ? 'ok' : 'refus'}"><p class="esp-champ__titre">Disponibilités du ${e(fmt(c.jour, { day: 'numeric', month: 'long' }))} ${cap.exemple ? '<span class="esp-pastille" data-cap-exemple>Capacités d\'exemple, à confirmer</span>' : ''}</p>
      <ul class="esp-pub__liste">${d.production.map((x) => `<li data-cmd-dispo-produit="${e(x.offre)}">${e(x.nom)} : ${prod(x)}</li>`).join('')}
        <li data-cmd-dispo-retrait>Retrait ${e(momentTexte(c.moment))} : ${d.retrait.capacite == null ? 'capacité du créneau non définie (aucune limite appliquée)' : `${d.retrait.engage} autre${d.retrait.engage > 1 ? 's' : ''} commande${d.retrait.engage > 1 ? 's' : ''} sur ${d.retrait.capacite}${d.retrait.reste <= 0 ? ' — <b>créneau complet</b>' : ''}`}</li></ul>
      ${d.aVerifier.length ? `<p class="esp-com-alerte" data-cmd-dispo-incertain><b>Capacité à confirmer :</b> la production historique de ${d.aVerifier.length > 1 ? 'commandes' : 'la commande'} ${e(d.aVerifier.join(', '))} est à vérifier. Ce qui est compté ici peut être incomplet.</p>` : ''}
      <p class="esp-aide">Une commande ne prend aucune table ni aucun couvert au restaurant : la production et les retraits ont leurs propres capacités.</p></div>`;
  }
  function editionHtml(c) {
    const ed = C().edition, pub = emporterVitrine(lieux(), S(), A.iso), effets = effetsEdition(c), lancee = preparationCommencee(c);
    return `<form class="esp-carte esp-com-edition" data-form-cmd="${e(c.id)}" novalidate aria-labelledby="cmd-ed-titre"><h4 id="cmd-ed-titre" tabindex="-1">${lancee ? 'Corriger la commande' : 'Modifier la commande'}</h4>
      ${lancee ? '<p class="esp-aide" data-cmd-ed-production>Vous corrigez ce que le client retire, et quand. Ce qui est déjà engagé en préparation ne change pas ici : une erreur de production se rectifie à part, dans « Production engagée ».</p>' : ''}
      <ul class="esp-com-lignes-ed">${ed.lignes.map((l, i) => `<li><span class="esp-com-lignes-ed__nom">${e(l.nom)} <small>${l.prix == null ? 'prix non conservé' : `${e(euros(l.prix))} ${e(UNITES[l.unite] || '')}`}</small></span>
        <label class="esp-com-lignes-ed__q"><span class="visuellement-cache">Quantité de ${e(l.nom)}</span><input name="q-${i}" data-cmd-q="${i}" inputmode="decimal" value="${e(l.q)}" autocomplete="off"><span>${e(l.unite === 'kilo' ? 'kg' : l.unite === 'piece' ? 'pièce(s)' : UNITES[l.unite] || '')}</span></label>
        <button type="button" class="esp-bouton esp-bouton--discret" data-cmd-retirer="${i}" aria-label="Retirer ${e(l.nom)} de la commande">Retirer</button></li>`).join('')}</ul>
      <p class="esp-champ esp-com-ajout"><label for="cmd-ajout">Ajouter un produit <small>du catalogue publié, au prix du moment</small></label><span class="esp-com-ajout__ligne"><select id="cmd-ajout" data-cmd-ajout>${pub.map((o) => `<option value="${e(o.id)}">${e(o.nom)} — ${e(euros(o.prix))} ${e(UNITES[o.unite] || '')}</option>`).join('')}</select><button type="button" class="esp-bouton" data-cmd-ajouter>Ajouter</button></span></p>
      <p class="esp-champ"><label for="cmd-jour">Jour du retrait</label><input id="cmd-jour" type="date" name="jour" value="${e(ed.jour)}" data-cmd-champ="jour"></p>
      <p class="esp-champ"><label for="cmd-moment">Créneau</label><select id="cmd-moment" name="moment" data-cmd-champ="moment"><option value="midi"${ed.moment === 'midi' ? ' selected' : ''}>Midi</option><option value="soir"${ed.moment === 'soir' ? ' selected' : ''}>Soir</option></select></p>
      <p class="esp-champ esp-champ--large"><label for="cmd-remarque">Remarque</label><textarea id="cmd-remarque" name="remarque" rows="2" data-cmd-champ="remarque">${e(ed.remarque)}</textarea></p>
      ${lancee ? `<p class="esp-champ esp-champ--large"><label for="cmd-motif">Motif de la correction <small>la préparation a commencé : il est gardé dans l'historique</small></label><textarea id="cmd-motif" name="motif" rows="2" data-cmd-champ="motif">${e(ed.motif || '')}</textarea></p>` : ''}
      <p class="esp-champ esp-champ--large esp-com-exception" data-cmd-exception-ligne${retraitChange(c) && horsRetrait(ed.jour, ed.moment) ? '' : ' hidden'}><label class="esp-case"><input type="checkbox" name="exception" data-cmd-champ="exception"${ed.exception ? ' checked' : ''}> <span>Retrait exceptionnel : accepter ce jour malgré tout <small>la décision est notée dans l'historique</small></span></label></p>
      <div class="esp-com-effets" data-cmd-effets aria-live="polite">${effets}</div>
      ${C().erreur ? `<p class="esp-erreur" role="alert" tabindex="-1" data-com-erreur>${e(C().erreur)}</p>` : ''}
      <p class="esp-com-actions"><button type="submit" class="bouton">Enregistrer ${lancee ? 'la correction' : 'la modification'}</button><button type="button" class="esp-bouton" data-cmd-edition-fermer>Fermer sans enregistrer</button></p></form>`;
  }
  const lignesEdition = () => C().edition.lignes.map((l) => ({ ...l, quantite: lireNombre(l.q) }));
  const retraitChange = (c) => { const ed = C().edition; return !!ed && (ed.jour !== c.jour || ed.moment !== c.moment); };
  /* Ce que la modification change, dit avant d'enregistrer : la commande, puis — si la préparation a commencé — la
     production (ce qui reste compté, le supplément), le retrait (période, jour fermé), et ce que les capacités en disent. */
  function effetsEdition(c) {
    const ed = C().edition, l = lignesEdition(), mauvaises = l.some((x) => !(typeof x.quantite === 'number' && x.quantite > 0));
    if (mauvaises) return '<p class="esp-erreur">Chaque quantité est un nombre plus grand que zéro (par exemple 2 ou 1,5).</p>';
    const apres = { lignes: l, jour: ed.jour, moment: ed.moment, remarque: ed.remarque }, ef = effetsModification(c, apres), ep = effetsProduction(c, apres), lancee = preparationCommencee(c);
    const d = ['validee', 'preparation', 'prete'].includes(c.etat) && ed.jour ? disponibilite(S(), { jour: ed.jour, moment: ed.moment, lignes: l, sauf: c.id }) : { ok: true, refus: [] };
    const refus = d.refus.filter((r) => !(!retraitChange(c) && r.startsWith('Les retraits du'))), hors = retraitChange(c) ? horsRetrait(ed.jour, ed.moment) : '';
    return `<p class="esp-champ__titre">Ce que cette ${lancee ? 'correction' : 'modification'} change</p>${ef.length ? `<ul class="esp-pub__liste" data-cmd-effets-commande>${ef.map((x) => `<li>${e(x)}</li>`).join('')}</ul>` : '<p class="esp-aide">Rien ne change pour l\'instant.</p>'}
      ${ef.length && lancee ? `<p class="esp-champ__titre">Ce que cela fait à la production</p><ul class="esp-pub__liste" data-cmd-effets-production>${[...ep.garde, ...ep.supplement.map((x) => `Supplément à produire pour le ${jourCourt(x.jour)} : ${x.nom}, ${quantite(x.quantite, x.unite)} (contrôlé dans la capacité de ce jour).`), ...(ep.retour ? ['La commande est prête : avec ce supplément, elle repasse en préparation.'] : [])].map((x) => `<li>${e(x)}</li>`).join('') || '<li>La production déjà engagée ne change pas.</li>'}</ul>` : ''}
      ${hors ? `<p class="esp-com-alerte" data-cmd-effets-hors>${e(hors)} ${ed.exception ? 'Vous l\'acceptez à titre exceptionnel.' : 'Cochez « Retrait exceptionnel » pour l\'accepter quand même.'}</p>` : ''}
      ${refus.length ? `<p class="esp-erreur" data-cmd-effets-refus>${refus.map(e).join(' ')}</p>` : (ef.length && !lancee && c.etat !== 'recue' ? '<p class="esp-aide">La production et le créneau de retrait sont revérifiés : le nouvel engagement remplace l\'ancien.</p>' : '')}`;
  }
  function ficheRetrait(c) {
    return `<header><p class="esp-feuille__maison">Les Jardins de l'Hacienda</p><h1>Fiche de retrait</h1><p class="esp-feuille__quand">${e(jourDit(c.jour))}, ${e(momentTexte(c.moment))}</p></header>
      <p class="esp-com-feuille__ref"><b>${e(c.ref)}</b> · ${e(nomClient(c.client))}${c.client.telephone ? ` · ${e(c.client.telephone)}` : ''}</p>
      <table><thead><tr><th>Produit</th><th>Quantité</th><th>Remis</th></tr></thead><tbody>${c.lignes.map((l) => `<tr><td>${e(l.nom)}</td><td>${e(quantite(l.quantite, l.unite))}${l.detail ? ` (${e(l.detail)})` : ''}</td><td><span class="esp-feuille__case"></span></td></tr>`).join('')}</tbody></table>
      <p class="esp-com-feuille__total">Total : <b>${c.total == null ? 'non conservé' : e(euros(c.total))}</b> — à régler au retrait (rien n'a été encaissé en ligne).</p>
      ${c.remarque ? `<p class="esp-com-feuille__remarque"><b>Remarque :</b> ${e(c.remarque)}</p>` : ''}<footer>État : ${e(ETATS[c.etat])}. Feuille imprimée depuis l'espace, ${e(quand(maintenant()))}.</footer>`;
  }
  /* ---------- La production engagée d'une commande (v7.14.1) : ses lots, la rectification, « à vérifier » ---------- */
  const nouvelleOpProd = () => `rp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  /* Les produits que l'on peut ajouter à la production : ceux du catalogue publié et ceux déjà connus de la commande. */
  function produitsConnus(c) { const m = new Map(); for (const x of [...lotsDe(c), ...c.lignes]) if (x.offre) m.set(x.offre, { offre: x.offre, nom: x.nom, unite: x.unite }); for (const o of emporterVitrine(lieux(), S(), A.iso)) if (!m.has(o.id)) m.set(o.id, { offre: o.id, nom: o.nom, unite: o.unite }); return [...m.values()]; }
  function effetsRectif(c) {
    const r = C().rectif, lot = lotsDe(c).find((x) => x.id === r.lot), p = lot || produitsConnus(c).find((x) => x.offre === r.offre), q = lireNombre(r.q);
    if (!p) return '<p class="esp-aide">Choisissez le produit concerné.</p>';
    if (!(typeof q === 'number' && q >= 0) || !r.jour) return '<p class="esp-erreur">Écrivez le jour de production et une quantité (0 si rien n\'a été produit).</p>';
    const cap = capacites(S()).production[p.offre], avant = lot ? `${quantite(lot.quantite, lot.unite)} le ${jourCourt(lot.jour)}` : 'rien d\'enregistré', l = [`Avant : ${avant}. Après : ${quantite(q, p.unite)} le ${jourCourt(r.jour)}.`];
    if (lot && lot.jour === r.jour && lot.quantite === arr3(q)) return '<p class="esp-aide">Rien ne change pour l\'instant.</p>';
    const jours = [...new Set([lot?.jour, r.jour].filter(Boolean))];
    for (const j of jours) { const compte = engagements(S(), j).production[p.offre] || 0, apres = arr3(compte - (lot && lot.jour === j ? lot.quantite : 0) + (r.jour === j ? q : 0));
      l.push(`Production comptée le ${jourCourt(j)} : ${quantite(compte, p.unite)} → ${quantite(apres, p.unite)}${typeof cap === 'number' ? ` sur ${quantite(cap, p.unite)}${apres > cap ? ' — la capacité serait dépassée : la rectification sera refusée' : ''}` : ' (capacité non définie)'}.`); }
    l.push('La commande du client (ce qu\'il retire, et quand) ne change pas.');
    /* v7.15.0 : si la production engagée ne couvre plus ce que le client retire, le dire avant d'enregistrer. */
    if (['preparation', 'prete'].includes(c.etat)) { const aRemettre = c.lignes.filter((x) => x.offre === p.offre).reduce((n, x) => n + x.quantite, 0), engage = arr3(lotsDe(c).filter((x) => x.offre === p.offre).reduce((n, x) => n + x.quantite, 0) - (lot ? lot.quantite : 0) + q), manque = Math.max(0, arr3(aRemettre - engage));
      if (manque > 0) l.push(`Le client retire toujours ${quantite(aRemettre, p.unite)} : ${quantite(manque, p.unite)} resteront à produire, réservés dans la capacité du ${jourCourt(c.jour)}.${c.etat === 'prete' ? ' La commande ne sera plus « prête » : elle repassera en préparation.' : ''} Vous pourrez ensuite engager ce complément, ou corriger ce que le client retire.`); }
    return `<p class="esp-champ__titre">Ce que cette rectification change</p><ul class="esp-pub__liste">${l.map((x) => `<li>${e(x)}</li>`).join('')}</ul>`;
  }
  function rectifHtml(c) {
    const r = C().rectif, lot = lotsDe(c).find((x) => x.id === r.lot), connus = lot ? [] : produitsConnus(c);
    return `<form class="esp-com-motif esp-com-rectif" data-form-rectifier="${e(r.lot || '')}" novalidate aria-labelledby="rectif-titre"><p class="esp-champ__titre" id="rectif-titre" tabindex="-1">${lot ? `Rectifier la production : ${e(lot.nom)}` : 'Ajouter une production oubliée'}</p>
      <p class="esp-aide">Pour une erreur d'enregistrement : une quantité mal notée, un jour de production inexact. L'avant et l'après sont gardés dans l'historique.</p>
      ${lot ? '' : `<p class="esp-champ"><label for="rectif-offre">Produit</label><select id="rectif-offre" name="offre" data-rectif-champ="offre">${connus.map((o) => `<option value="${e(o.offre)}"${o.offre === r.offre ? ' selected' : ''}>${e(o.nom)}</option>`).join('')}</select></p>`}
      <p class="esp-champ"><label for="rectif-jour">Jour de production</label><input id="rectif-jour" type="date" name="jour" value="${e(r.jour || '')}" data-rectif-champ="jour"></p>
      <p class="esp-champ"><label for="rectif-q">Quantité réellement engagée <small>${((lot || connus.find((o) => o.offre === r.offre))?.unite) === 'kilo' ? 'en kg' : 'dans l\'unité du produit'} ; 0 si rien n'a été produit</small></label><input id="rectif-q" name="q" inputmode="decimal" value="${e(r.q ?? '')}" autocomplete="off" data-rectif-champ="q"></p>
      <p class="esp-champ esp-champ--large"><label for="rectif-motif">Motif <small>obligatoire, gardé dans l'historique</small></label><textarea id="rectif-motif" name="motif" rows="2" data-rectif-champ="motif">${e(r.motif || '')}</textarea></p>
      <div class="esp-com-effets" data-rectif-effets aria-live="polite">${effetsRectif(c)}</div>
      ${C().erreur ? `<p class="esp-erreur" role="alert" tabindex="-1" data-com-erreur>${e(C().erreur)}</p>` : ''}
      <p class="esp-com-actions"><button type="submit" class="bouton">Enregistrer la rectification</button><button type="button" class="esp-bouton" data-prod-fermer>Ne rien changer</button></p></form>`;
  }
  function productionHtml(c) {
    if (!preparationCommencee(c)) return '';
    const k = C(), lots = lotsDe(c), flou = productionAVerifier(c), remet = new Map(), annulee = c.etat === 'annulee', manque = manqueDe(c);
    for (const x of c.lignes) remet.set(x.offre || `nom:${x.nom}`, arr3((remet.get(x.offre || `nom:${x.nom}`) || 0) + x.quantite));
    const lotHtml = (x) => { const r = annulee ? 0 : remet.get(x.offre || `nom:${x.nom}`) || 0;
      return `<li class="esp-com-ligne" data-prod-lot="${e(x.id)}"><p class="esp-com-ligne__qui"><b>${e(x.nom)}</b> : <span data-prod-quantite>${e(quantite(x.quantite, x.unite))}</span> <span class="esp-pastille${x.quoi === 'supplement' ? ' esp-pastille--cours' : ''}">${e(QUOI_LOT[x.quoi] || 'Engagé')}</span></p>
        <p class="esp-com-ligne__quoi">Produit pour le <b data-prod-jour>${e(jourCourt(x.jour))}</b>${x.le ? ` · noté le ${e(quand(x.le))}` : ''} · ${annulee ? 'commande annulée : rien à remettre' : `à remettre au client : ${r ? e(quantite(r, x.unite)) : 'rien'}${c.jour !== x.jour ? `, le ${e(jourCourt(c.jour))}` : ''}`}</p>
        ${k.rectif?.lot === x.id ? rectifHtml(c) : `<p class="esp-com-actions"><button type="button" class="esp-bouton esp-bouton--discret" data-prod-rectifier="${e(x.id)}">Rectifier la production</button></p>`}</li>`; };
    return `<section class="esp-carte esp-com-prod" data-cmd-production aria-labelledby="cmd-prod-titre"><h4 id="cmd-prod-titre">Production engagée ${flou ? '<span class="esp-pastille esp-pastille--a-confirmer" data-prod-a-verifier>Production historique à vérifier</span>' : ''}</h4>
      <p class="esp-aide">Ce que l'équipe a lancé en préparation, au jour pour lequel c'était prévu. Corriger la commande ou déplacer le retrait ne change pas ces quantités : elles restent comptées dans la production de leur jour.</p>
      ${flou ? `<div class="esp-com-alerte" data-prod-flou><p><b>À vérifier :</b> cette commande a été corrigée après le début de sa préparation, avant que la production soit gardée à part. Les quantités et le jour ci-dessous sont ceux connus aujourd'hui ; ceux d'origine n'ont pas été conservés, et rien n'a été reconstitué. Tant que ce n'est pas vérifié, les capacités de ces produits sont à confirmer.</p>
        <p class="esp-com-actions"><button type="button" class="esp-bouton esp-bouton--ok" data-prod-verifiee>Confirmer ces quantités</button><button type="button" class="esp-bouton" data-prod-rectifier="">Ajouter une production oubliée</button></p></div>` : ''}
      ${manque.length ? `<div class="esp-com-alerte" data-prod-manque><p><b>Il manque de la production pour honorer cette commande.</b> ${manque.map((x) => { const r = remet.get(x.offre || `nom:${x.nom}`) || 0; return `${e(x.nom)} : à remettre ${e(quantite(r, x.unite))} ; en production ${e(quantite(arr3(r - x.quantite), x.unite))} ; <b>reste à produire ${e(quantite(x.quantite, x.unite))}</b>.`; }).join(' ')} Ce reste est réservé dans la capacité du ${e(jourCourt(c.jour))} : aucune autre commande ne peut le prendre. La commande ne peut être ni marquée prête ni remise tant qu'il manque.</p>
        <p class="esp-com-actions"><button type="button" class="bouton" data-prod-complement>Engager le complément en production</button><button type="button" class="esp-bouton" data-cmd-modifier>Corriger ce que le client retire</button></p></div>` : ''}
      ${lots.length ? `<ul class="esp-com-cartes" data-prod-lots>${lots.map(lotHtml).join('')}</ul>` : '<p class="esp-vide">Aucune quantité engagée n\'est enregistrée pour cette commande.</p>'}
      ${k.rectif && !k.rectif.lot ? rectifHtml(c) : flou || FINIES.includes(c.etat) && !annulee ? '' : '<p class="esp-com-actions"><button type="button" class="esp-bouton esp-bouton--discret" data-prod-rectifier="">Ajouter une production oubliée</button></p>'}</section>`;
  }
  /* Ce que le client retire et ce qui est engagé ne disent plus la même chose : c'est dit en tête du dossier. */
  function ecartHtml(c) {
    if (!preparationCommencee(c) || c.etat === 'annulee') return '';
    const ep = effetsProduction({ ...c, etat: FINIES.includes(c.etat) ? 'prete' : c.etat }, c); if (!ep.garde.length) return '';
    /* v7.15.0 : quand c'est la production qui a été rectifiée à la baisse, le titre le dit (la commande, elle, n'a pas changé). */
    const manque = manqueDe(c);
    return `<p class="esp-com-alerte" data-cmd-ecart><b>${manque.length ? 'La production engagée ne couvre plus la commande.' : 'Commande corrigée après la préparation.'}</b> À remettre : ${e(c.lignes.map((l) => `${l.nom}, ${quantite(l.quantite, l.unite)}`).join(' ; '))}, ${e(retraitTexte(c))}. En cuisine : ${ep.garde.map((x) => e(x.replace(/ ; à remettre : [^.]*\./, '.'))).join(' ')}${manque.length ? ` Reste à produire : ${e(manque.map((x) => `${x.nom}, ${quantite(x.quantite, x.unite)}`).join(' ; '))}.` : ''}</p>`;
  }
  function rendreCommande() {
    const c = commande(C().id); if (!c) { fermer(); return false; }
    const s = SUITES[c.etat], k = C(), fini = FINIES.includes(c.etat), lie = S().commerce?.liens?.[`commande:${c.id}`], lancee = preparationCommencee(c);
    /* Le retrait demandé est-il encore possible (période réglée, jour fermé) ? Une demande en attente le signale avant
       validation, avec une décision explicite ; une commande déjà acceptée reste telle quelle, avec un repère. */
    const hors = fini || !c.jour ? '' : horsRetrait(c.jour, c.moment), aDecider = c.etat === 'recue' && hors && !k.edition && !k.motif;
    X.demoVu?.('cmd-dossier');
    X.corps('demandes').innerHTML = typo(`<div class="esp-rec-dossier esp-com" data-cmd="${e(c.id)}" data-cmd-etat="${c.etat}">${retour(k.depuis === 'preparation' ? 'preparation' : 'liste', k.depuis === 'preparation' ? 'Préparation et retraits' : 'Toutes les demandes')}
      <header class="esp-rec-tete"><h3 class="esp-rec-tete__titre" id="com-titre" tabindex="-1">Commande <span data-cmd-ref>${e(c.ref)}</span> ${source(c)}</h3>
        <p class="esp-rec-tete__sous">${e(nomClient(c.client))} · retrait ${e(retraitTexte(c))}</p></header>
      <ul class="esp-rec-etats esp-com-etats" aria-label="Où en est cette commande">
        <li><span class="esp-rec-etats__quoi">État</span><b class="esp-pastille esp-pastille--${PASTILLE[c.etat]}" data-cmd-pastille>${e(ETATS[c.etat])}</b>${c.motif ? `<span class="esp-rec-etats__detail">Motif : ${e(c.motif)}</span>` : ''}</li>
        <li><span class="esp-rec-etats__quoi">Retrait</span><b data-cmd-retrait>${e(jourDit(c.jour))}</b><span class="esp-rec-etats__detail">${e(momentTexte(c.moment))}</span></li>
        <li><span class="esp-rec-etats__quoi">Total</span><b data-cmd-total>${c.total == null ? 'Non conservé' : e(euros(c.total))}</b><span class="esp-rec-etats__detail">à régler au retrait ; rien n'est encaissé en ligne</span></li></ul>
      <p class="esp-rec-suite" data-cmd-suite><b>Prochaine action&nbsp;:</b> ${e(aDecider || (c.etat === 'recue' && hors) ? 'Le retrait demandé n\'est plus possible tel quel : à décider avec le client.' : manqueDe(c).length ? 'Engager le complément qui reste à produire, ou corriger ce que le client retire.' : PROCHAINE[c.etat])}</p>
      ${ecartHtml(c)}
      ${hors && c.etat !== 'recue' ? `<p class="esp-com-alerte" data-cmd-hors-note><b>Retrait hors des jours proposés aujourd'hui.</b> ${e(hors)} Cette commande déjà acceptée reste telle quelle : rien n'a été déplacé ni annulé.${c.horsPeriode ? ' Elle avait été acceptée à titre exceptionnel.' : ''}</p>` : ''}
      ${aDecider ? `<div class="esp-carte esp-com-alerte" data-cmd-hors><p><b>Retrait à revoir avant de valider.</b> ${e(hors)}</p><p class="esp-aide">Rien n'a été changé sur cette demande. Trois décisions possibles :</p>
        <p class="esp-com-actions"><button type="button" class="bouton" data-cmd-modifier>Convenir d'un autre retrait</button><button type="button" class="esp-bouton" data-cmd-exception>Accepter ce retrait à titre exceptionnel</button><button type="button" class="esp-bouton" data-cmd-motif="refuser">Refuser la demande</button></p></div>` : ''}
      ${k.erreur && !k.edition && !k.motif && !k.rectif ? `<p class="esp-erreur" role="alert" tabindex="-1" data-com-erreur>${e(k.erreur)}</p>` : ''}
      ${fini || k.edition || aDecider ? '' : `<p class="esp-com-actions" data-cmd-actions>${s && !(c.etat === 'recue' && hors) && !manqueDe(c).length ? `<button type="button" class="bouton" data-cmd-avancer="${s.vers}">${e(s.libelle)}</button>` : ''}
        ${c.etat === 'recue' ? '<button type="button" class="esp-bouton" data-cmd-motif="refuser">Refuser la demande</button>' : ''}
        <button type="button" class="esp-bouton" data-cmd-modifier>${lancee ? 'Corriger' : 'Modifier'}</button>
        <button type="button" class="esp-bouton esp-bouton--discret" data-cmd-motif="annuler">Annuler la commande</button>
        ${c.etat !== 'recue' ? `<button type="button" class="esp-bouton" data-cmd-fiche aria-expanded="${!!k.fiche}">Fiche de retrait</button>` : ''}</p>`}
      ${k.motif === 'refuser' ? motifHtml('cmdRefuser', 'Motif du refus', 'Refuser la demande', 'gardé dans l\'historique ; aucun message ne part tout seul') : k.motif === 'annuler' ? motifHtml('cmdAnnuler', 'Motif de l\'annulation', 'Annuler la commande', lancee ? 'la préparation a commencé : la production engagée restera comptée, le créneau de retrait sera libéré' : 'la production et le créneau seront libérés') : ''}
      ${k.fiche ? `<div class="esp-carte esp-com-feuille" data-cmd-fiche-apercu><div class="esp-com-feuille__papier">${ficheRetrait(c)}</div><p class="esp-com-actions"><button type="button" class="esp-bouton esp-bouton--ok" data-com-imprimer="retrait">Imprimer la fiche de retrait</button></p></div>` : ''}
      ${k.edition ? editionHtml(c) : ''}
      <section class="esp-carte" aria-labelledby="cmd-lignes-titre"><h4 id="cmd-lignes-titre">${lancee ? 'Ce que le client retire' : 'Ce qui est commandé'}</h4>
        <div class="esp-com-table"><table class="esp-com-lignes" data-cmd-lignes><thead><tr><th scope="col">Produit</th><th scope="col">Quantité</th><th scope="col">Prix conservé</th><th scope="col">Total</th></tr></thead>
          <tbody>${c.lignes.map(ligneHtml).join('')}</tbody><tfoot><tr><th scope="row" colspan="3">Total de la commande</th><td class="esp-com-nombre">${c.total == null ? 'non conservé' : e(euros(c.total))}</td></tr></tfoot></table></div>
        <p class="esp-aide">Les lignes et les prix sont ceux de la commande reçue : un changement du catalogue ne les modifie jamais.${c.publication != null ? ` Catalogue publié n°&nbsp;${e(c.publication)} au moment de la demande.` : ''}</p>
        ${c.remarque ? `<p data-cmd-remarque><b>Remarque du client :</b> ${e(c.remarque)}</p>` : ''}</section>
      ${productionHtml(c)}
      ${fini ? '' : `<section class="esp-carte" aria-label="Disponibilités">${dispoHtml(c)}</section>`}
      <section class="esp-carte" aria-labelledby="cmd-client-titre"><h4 id="cmd-client-titre">Le client</h4><p>${e(nomClient(c.client))}</p><p class="esp-dem__contact">${contact(c.client)}<button type="button" class="esp-bouton" data-voir-demande="${e(c.id)}">Voir la demande d'origine</button></p>
        ${lienClientHtml('commande', c.id, lie)}</section>
      <section class="esp-carte" aria-labelledby="cmd-histo-titre"><h4 id="cmd-histo-titre">Historique</h4>${histo(c.historique)}</section>${local()}</div>`);
    return true;
  }

  /* Le rattachement à une fiche client : proposé seulement à la main ; un nom seul ne rattache rien. */
  function lienClientHtml(quoi, id, lie) {
    const l = (X.clients?.() || []).filter((x) => x.id || x.cle), cle = (x) => x.cle || x.id, actuel = l.find((x) => cle(x) === lie);
    if (!l.length) return '';
    return `<form class="esp-com-lier" data-form-com-lier="${quoi}:${e(id)}" novalidate><p class="esp-champ"><label for="com-lier-${quoi}">Rattacher à une fiche client <small>à la main : un nom seul ne rattache rien</small></label>
      <select id="com-lier-${quoi}" name="client"><option value="">${actuel ? 'Retirer le rattachement' : 'Aucune fiche choisie'}</option>${l.slice(0, 80).map((x) => `<option value="${e(cle(x))}"${cle(x) === lie ? ' selected' : ''}>${e(x.nom || 'Sans nom')}${x.telephone ? ` · ${e(x.telephone)}` : ''}</option>`).join('')}</select></p>
      <p><button type="submit" class="esp-bouton">${actuel ? 'Changer le rattachement' : 'Rattacher'}</button>${actuel ? ` <span class="esp-aide" data-com-lie>Rattachée à ${e(actuel.nom)}.</span>` : ''}</p></form>`;
  }

  /* ====================== La préparation et les retraits ====================== */
  const joursEngages = () => joursDeProduction(S());
  const q0 = (n, u) => (n ? e(quantite(n, u)) : '—');
  /* Quand ce qui est engagé un jour n'est pas ce qui sera remis ce jour-là : la phrase qui le dit, commande par commande. */
  const ecartTexte = (x, u) => `${x.ref} : production engagée ${quantite(x.engage, u)}${x.jours?.length === 1 ? ` pour le ${fmt(x.jours[0], { day: 'numeric', month: 'long' })}` : ''} ; ${x.etat === 'annulee' ? 'commande annulée, rien à remettre' : `à remettre : ${x.aRemettre ? quantite(x.aRemettre, u) : 'rien'}${x.retrait && !(x.jours || []).includes(x.retrait) ? `, retrait le ${fmt(x.retrait, { day: 'numeric', month: 'long' })}` : ''}${x.manque ? ` ; reste à produire : ${quantite(x.manque, u)}` : ''}`}`;
  function feuillePreparation(p, jour, moment) {
    return `<header><p class="esp-feuille__maison">Les Jardins de l'Hacienda</p><h1>Feuille de préparation</h1><p class="esp-feuille__quand">${jour ? e(jourDit(jour)) : 'Tous les jours'}${moment ? `, ${e(momentTexte(moment))}` : ''}</p></header>
      <table><thead><tr><th>Produit</th><th>Reste à préparer</th><th>Prêt</th><th>Remis</th><th>Engagé en production${jour ? ' ce jour' : ''}</th><th>Commandes</th></tr></thead><tbody>${p.produits.map((x) => `<tr><td>${e(x.nom)}${x.ecarts.length ? `<br><small>${x.ecarts.map((y) => e(ecartTexte(y, x.unite))).join(' · ')}</small>` : ''}</td><td>${q0(x.aPreparer, x.unite)}</td><td>${q0(x.pret, x.unite)}</td><td>${q0(x.remis, x.unite)}</td><td>${q0(x.engage, x.unite)}${x.capacite != null && jour ? ` sur ${e(quantite(x.capacite, x.unite))}` : ''}</td><td>${e(x.commandes.join(', '))}</td></tr>`).join('') || '<tr><td colspan="6">Aucune commande validée.</td></tr>'}</tbody></table>
      ${p.aVerifier.length ? `<p class="esp-com-feuille__remarque"><b>Production historique à vérifier :</b> ${e(p.aVerifier.map((x) => x.ref).join(', '))}.</p>` : ''}
      <h2 class="esp-com-feuille__sous">Les commandes</h2>
      <table><thead><tr><th>Référence</th><th>Client</th><th>Retrait</th><th>Contenu</th><th>Remarque</th></tr></thead><tbody>${p.commandes.map((c) => `<tr><td>${e(c.ref)}</td><td>${e(nomClient(c.client))}</td><td>${e(retraitTexte(c))}</td><td>${e(c.lignes.map((l) => `${quantite(l.quantite, l.unite)} ${l.nom}`).join(' ; '))}</td><td>${e(c.remarque || '')}</td></tr>`).join('')}</tbody></table>
      <footer>Feuille imprimée depuis l'espace, ${e(quand(maintenant()))}. « Reste à préparer », « Prêt » et « Remis » : ce que les clients retirent. « Engagé en production » : ce que la cuisine a lancé, même si la commande a été corrigée ou annulée depuis.</footer>`;
  }
  /* ---------- La période des retraits (v7.14.1) : un réglage, dit avec ses effets avant d'être enregistré ---------- */
  function effetsPeriode(debut, fin) {
    const actuelle = periode(); if (!debut || !fin) return '<p class="esp-aide">Écrivez le premier et le dernier jour de retrait.</p>';
    if (debut > fin) return '<p class="esp-erreur">Le dernier jour est avant le premier : cette période sera refusée.</p>';
    const p = { debut, fin }, cal = calendrierRetraits(p, ouverture(), {}), ouverts = cal.jours.filter((j) => j.etat !== 'ferme'), l = [];
    l.push(`${periodeTexte(p).replace(/^./, (x) => x.toUpperCase())}, bornes comprises : ${ouverts.length ? `${pluriel(ouverts.length, 'jour')} avec un retrait possible` : 'aucun jour ouvert'}${cal.jours.length - ouverts.length ? `, ${pluriel(cal.jours.length - ouverts.length, 'jour fermé').replace('jour fermés', 'jours fermés')} d'après les horaires` : ''}.`);
    if (fin < A.iso) l.push('Cette période est déjà terminée : la page À emporter ne proposera aucun jour, et le dira.');
    else if (!ouverts.some((j) => j.iso >= A.iso)) l.push('Aucun jour ouvert ne reste dans cette période : la page À emporter le dira.');
    const hors = (c) => c.jour && (c.jour < debut || c.jour > fin), cmd = toutes();
    const gardees = cmd.filter((c) => ['validee', 'preparation', 'prete'].includes(c.etat) && hors(c)), attente = cmd.filter((c) => c.etat === 'recue' && hors(c));
    if (gardees.length) l.push(`${pluriel(gardees.length, 'commande')} déjà acceptée${gardees.length > 1 ? 's' : ''} ${gardees.length > 1 ? 'ont leur' : 'a son'} retrait hors de cette période (${gardees.map((c) => c.ref).join(', ')}) : ${gardees.length > 1 ? 'elles restent telles quelles' : 'elle reste telle quelle'}, à préparer et à remettre normalement.`);
    if (attente.length) l.push(`${pluriel(attente.length, 'demande')} en attente ${attente.length > 1 ? 'deviennent incompatibles' : 'devient incompatible'} (${attente.map((c) => c.ref).join(', ')}) : ${attente.length > 1 ? 'elles le diront' : 'elle le dira'} avant validation, avec la décision à prendre.`);
    if (debut === actuelle.debut && fin === actuelle.fin) l.push('C\'est la période déjà en vigueur : rien ne change.');
    return `<p class="esp-champ__titre">Ce que ce réglage change</p><ul class="esp-pub__liste">${l.map((x) => `<li>${e(x)}</li>`).join('')}</ul>`;
  }
  function periodeHtml() {
    const k = C(), p = periode(), depart = lieux().retraits || {}, ed = (k.periode ||= { debut: p.debut, fin: p.fin });
    return `<details class="esp-carte esp-com-periode" data-periode${k.perOuvert ? ' open' : ''}><summary>Période des retraits <span class="esp-pastille" data-periode-actuelle>${e(periodeTexte(p))}</span>${p.reglee ? '' : ' <span class="esp-pastille" data-periode-depart>Réglage de départ</span>'}</summary>
      <form data-form-periode novalidate><p class="esp-aide">Les jours que la page À emporter propose au client : du premier au dernier jour, tous deux compris. Dans cette période, les créneaux suivent les horaires de la maison (midi, soir, jours fermés, fermetures exceptionnelles) et le délai de commande de chaque produit. Aucun jour ne s'ouvre tout seul : la période reste celle écrite ici.</p>
        <p class="esp-champ"><label for="per-debut">Premier jour de retrait</label><input id="per-debut" type="date" name="debut" value="${e(ed.debut || '')}" data-periode-champ="debut"></p>
        <p class="esp-champ"><label for="per-fin">Dernier jour de retrait</label><input id="per-fin" type="date" name="fin" value="${e(ed.fin || '')}" data-periode-champ="fin"></p>
        <div class="esp-com-effets" data-periode-effets aria-live="polite">${effetsPeriode(ed.debut, ed.fin)}</div>
        ${k.erreur && k.perOuvert ? `<p class="esp-erreur" role="alert" tabindex="-1" data-com-erreur>${e(k.erreur)}</p>` : ''}
        <p class="esp-com-actions"><button type="submit" class="bouton">Enregistrer la période</button>${p.reglee && depart.debut ? `<button type="button" class="esp-bouton" data-periode-defaut>Revenir à la période de départ (${e(periodeTexte(depart))})</button>` : ''}</p>
        <p class="esp-aide">Pour l'équipe : un retrait hors période ou un jour fermé reste possible sur une commande, mais seulement par une décision explicite (« à titre exceptionnel »), notée dans l'historique. Le délai de commande d'un produit ne s'applique qu'au site.</p></form></details>`;
  }
  function capacitesHtml() {
    const cap = capacites(S()), pub = emporterVitrine(lieux(), S(), A.iso), k = C();
    return `<details class="esp-carte esp-com-capacites" data-cap${k.capOuvert ? ' open' : ''}><summary>Capacités de production et de retrait ${cap.exemple ? '<span class="esp-pastille" data-cap-exemple>Exemples à confirmer</span>' : Object.keys(cap.production).length || cap.retraits != null ? '' : '<span class="esp-pastille">Non définies</span>'}</summary>
      <form data-form-cap novalidate><p class="esp-aide">Une capacité vide n'est pas définie : rien n'est limité, et rien n'est inventé. Ces chiffres restent à confirmer par le restaurant.${cap.exemple ? ' Ceux-ci sont des exemples de démonstration.' : ''}</p>
        <p class="esp-champ"><label for="cap-retraits">Commandes par créneau de retrait <small>midi ou soir</small></label><input id="cap-retraits" name="retraits" inputmode="numeric" value="${cap.retraits ?? ''}" autocomplete="off"></p>
        <fieldset class="esp-com-cap-produits"><legend>Production par jour <small>dans l'unité de chaque produit ; compte ce qui est réservé et ce qui est engagé en préparation</small></legend>
          ${pub.map((o) => `<p class="esp-champ"><label for="cap-${e(o.id)}">${e(o.nom)} <small>${o.unite === 'kilo' ? 'en kg' : 'en pièces'}</small></label><input id="cap-${e(o.id)}" name="prod:${e(o.id)}" inputmode="decimal" value="${cap.production[o.id] != null ? e(String(cap.production[o.id]).replace('.', ',')) : ''}" autocomplete="off"></p>`).join('')}</fieldset>
        ${k.erreur && k.capOuvert && !k.perOuvert ? `<p class="esp-erreur" role="alert" tabindex="-1" data-com-erreur>${e(k.erreur)}</p>` : ''}
        <p class="esp-com-actions"><button type="submit" class="bouton">Enregistrer les capacités</button></p></form></details>`;
  }
  function rendrePreparation() {
    const k = C(), jours = joursEngages(), jour = k.jour === 'tous' ? '' : (jours.includes(k.jour) ? k.jour : jours.includes(A.iso) ? A.iso : jours.find((j) => j >= A.iso) || jours[0] || ''), moment = ['midi', 'soir'].includes(k.moment) ? k.moment : '';
    const p = preparation(S(), { jour, moment }); k.feuille = feuillePreparation(p, jour, moment);
    X.demoVu?.('cmd-preparation');
    X.corps('demandes').innerHTML = typo(`<div class="esp-rec-dossier esp-com" data-com-preparation>${retour('liste', 'Toutes les demandes')}
      <header class="esp-rec-tete"><h3 class="esp-rec-tete__titre" id="com-titre" tabindex="-1">Préparation et retraits</h3><p class="esp-rec-tete__sous">À partir des commandes validées. Une commande ne prend aucun couvert au restaurant.</p></header>
      ${p.aVerifier.length ? `<div class="esp-com-alerte" data-prep-a-verifier><p><b>Production historique à vérifier.</b> ${p.aVerifier.length > 1 ? 'Ces commandes ont été corrigées' : 'Cette commande a été corrigée'} après le début de la préparation, avant que la production soit gardée à part : les quantités engagées sont celles encore connues. Les capacités des produits concernés sont à confirmer.</p><p class="esp-com-actions">${p.aVerifier.map((x) => `<button type="button" class="esp-bouton" data-com-ouvrir="commande" data-com-id="${e(x.id)}" data-com-depuis="preparation">Vérifier ${e(x.ref)}</button>`).join('')}</p></div>` : ''}
      <div class="esp-barre"><p class="esp-filtres" role="group" aria-label="Jour du retrait">${[['tous', 'Tous les jours'], ...jours.map((j) => [j, `${maj(fmt(j, { weekday: 'short', day: 'numeric', month: 'short' }))}${j === A.iso ? ' (aujourd\'hui)' : ''}`])].map(([v, nom]) => `<button type="button" class="esp-filtre" aria-pressed="${(v === 'tous' && !jour) || v === jour}" data-prep-jour="${v}">${e(nom)}</button>`).join('')}</p>
        <p class="esp-filtres" role="group" aria-label="Créneau">${[['', 'Midi et soir'], ['midi', 'Midi'], ['soir', 'Soir']].map(([v, nom]) => `<button type="button" class="esp-filtre" aria-pressed="${v === moment}" data-prep-moment="${v}">${nom}</button>`).join('')}</p></div>
      <section class="esp-carte" aria-labelledby="prep-titre"><h4 id="prep-titre">Par produit : ce que les clients retirent, ce que la cuisine a engagé</h4>
        ${p.produits.length ? `<div class="esp-com-table"><table class="esp-com-lignes esp-com-lignes--prep" data-prep-produits><thead><tr><th scope="col">Produit</th><th scope="col">Reste à préparer</th><th scope="col">Prêt</th><th scope="col">Remis</th><th scope="col">Engagé en production${jour ? ' ce jour' : ''}</th></tr></thead>
          <tbody>${p.produits.map((x) => `<tr data-prep-produit="${e(x.offre)}"><td>${e(x.nom)} <small>${e(x.commandes.join(', '))}</small>${x.ecarts.length ? `<small class="esp-com-ecart" data-prep-ecart>${x.ecarts.map((y) => e(ecartTexte(y, x.unite))).join(' · ')}</small>` : ''}</td><td data-prep-a data-titre="Reste à préparer">${q0(x.aPreparer, x.unite)}</td><td data-prep-pret data-titre="Prêt">${q0(x.pret, x.unite)}</td><td data-prep-remis data-titre="Remis">${q0(x.remis, x.unite)}</td><td data-prep-engage data-titre="Engagé en production">${q0(x.engage, x.unite)}${x.capacite != null && jour ? ` <small>sur ${e(quantite(x.capacite, x.unite))}</small>` : ''}</td></tr>`).join('')}</tbody></table></div>
          <p class="esp-aide">« Reste à préparer », « Prêt », « Remis » : ce que les clients retirent ${jour ? 'ce jour-là' : ''}. « Engagé en production » : ce que la cuisine a lancé ${jour ? 'pour ce jour' : ''}, y compris pour une commande corrigée, déplacée ou annulée depuis.</p>
          <p class="esp-com-actions"><button type="button" class="esp-bouton esp-bouton--ok" data-com-imprimer="preparation">Imprimer la feuille de préparation</button></p>` : '<p class="esp-vide">Aucune commande validée pour ce choix. Les demandes reçues n\'entrent en préparation qu\'une fois validées.</p>'}</section>
      <section class="esp-carte" aria-labelledby="prep-cmd-titre"><h4 id="prep-cmd-titre">Les commandes ${jour ? `du ${e(fmt(jour, { day: 'numeric', month: 'long' }))}` : ''}</h4>
        ${k.erreur && !k.capOuvert ? `<p class="esp-erreur" role="alert" tabindex="-1" data-com-erreur>${e(k.erreur)}</p>` : ''}
        ${p.commandes.length ? `<ul class="esp-com-cartes" data-prep-commandes>${p.commandes.map((c) => { const s = SUITES[c.etat]; return `<li class="esp-com-ligne" data-prep-commande="${e(c.id)}"><p class="esp-com-ligne__qui"><b>${e(c.ref)}</b> · ${e(nomClient(c.client))} <span class="esp-pastille esp-pastille--${PASTILLE[c.etat]}">${e(ETATS[c.etat])}</span></p>
          <p class="esp-com-ligne__quoi">${e(retraitTexte(c))} · ${e(c.lignes.map((l) => `${quantite(l.quantite, l.unite)} ${l.nom}`).join(' ; '))}${c.remarque ? ` · <i>${e(c.remarque)}</i>` : ''}</p>
          <p class="esp-com-actions">${s ? `<button type="button" class="esp-bouton esp-bouton--ok" data-cmd-avancer="${s.vers}" data-cmd-id="${e(c.id)}">${e(s.libelle)}</button>` : ''}<button type="button" class="esp-bouton" data-com-ouvrir="commande" data-com-id="${e(c.id)}" data-com-depuis="preparation">Ouvrir la commande</button></p></li>`; }).join('')}</ul>` : '<p class="esp-vide">Aucune commande à préparer ou à remettre pour ce choix.</p>'}</section>
      ${periodeHtml()}${capacitesHtml()}${local()}</div>`);
    return true;
  }

  /* ====================== La demande de carte cadeau ====================== */
  function rendreCadeau() {
    const c = cadeau(C().id); if (!c) { fermer(); return false; }
    const k = C(), tout = S().commerce?.cartes || {}, v = validite(S()), lie = S().commerce?.liens?.[`cadeau:${c.id}`], a = k.acheteur || c.acheteur;
    X.demoVu?.('cad-dossier');
    X.corps('demandes').innerHTML = typo(`<div class="esp-rec-dossier esp-com" data-cad="${e(c.id)}" data-cad-etat="${c.etat}">${retour(k.depuis === 'cartes' ? 'cartes' : 'liste', k.depuis === 'cartes' ? 'Cartes cadeaux émises' : 'Toutes les demandes')}
      <header class="esp-rec-tete"><h3 class="esp-rec-tete__titre" id="com-titre" tabindex="-1">Carte cadeau, demande <span data-cad-ref>${e(c.ref)}</span> ${source(c)}</h3>
        <p class="esp-rec-tete__sous">${e(pluriel(c.quantite, 'carte'))} de ${e(euros(c.montant))}${c.pour ? ` pour ${e(c.pour)}` : ''}</p></header>
      <ul class="esp-rec-etats esp-com-etats" aria-label="Où en est cette demande">
        <li><span class="esp-rec-etats__quoi">État</span><b class="esp-pastille esp-pastille--${PASTILLE_CAD[c.etat]}" data-cad-pastille>${e(ETATS_CADEAU[c.etat])}</b>${c.motif ? `<span class="esp-rec-etats__detail">Motif : ${e(c.motif)}</span>` : ''}</li>
        <li><span class="esp-rec-etats__quoi">Règlement</span><b data-cad-reglement>${c.reglement ? `Simulé, ${e(euros(c.reglement.montant))}` : 'Non enregistré'}</b><span class="esp-rec-etats__detail">${c.reglement ? `noté le ${e(quand(c.reglement.le))} ; aucun paiement réel` : 'rien n\'est encaissé en ligne'}</span></li>
        <li><span class="esp-rec-etats__quoi">Total</span><b data-cad-total>${e(euros(c.total))}</b><span class="esp-rec-etats__detail">${c.quantite > 1 ? `${c.quantite} × ${e(euros(c.montant))}` : 'une carte'}</span></li></ul>
      <p class="esp-rec-suite" data-cad-suite><b>Prochaine action&nbsp;:</b> ${e(PROCHAINE_CADEAU[c.etat])}</p>
      ${k.erreur && !k.motif ? `<p class="esp-erreur" role="alert" tabindex="-1" data-com-erreur>${e(k.erreur)}</p>` : ''}
      ${c.etat === 'recue' ? `<form class="esp-carte esp-com-acheteur" data-form-cad-valider="${e(c.id)}" novalidate aria-labelledby="cad-ach-titre"><h4 id="cad-ach-titre">L'acheteur <small>la personne à rappeler ; ce n'est ni le bénéficiaire, ni la signature</small></h4>
        <p class="esp-champ"><label for="cad-ach-nom">Nom</label><input id="cad-ach-nom" name="nom" value="${e(a.nom || '')}" autocomplete="off"></p>
        <p class="esp-champ"><label for="cad-ach-tel">Téléphone</label><input id="cad-ach-tel" name="telephone" type="tel" value="${e(a.telephone || '')}" autocomplete="off"></p>
        <p class="esp-champ"><label for="cad-ach-email">E-mail</label><input id="cad-ach-email" name="email" type="email" value="${e(a.email || '')}" autocomplete="off"></p>
        <p class="esp-com-actions"><button type="submit" class="bouton">Valider la demande</button><button type="button" class="esp-bouton" data-cad-motif="refuser">Refuser la demande</button></p></form>` : ''}
      ${c.etat === 'validee' ? `<p class="esp-com-actions" data-cad-actions><button type="button" class="bouton" data-cad-regler>Enregistrer le règlement simulé (${e(euros(c.total))})</button><button type="button" class="esp-bouton" data-cad-motif="refuser">Refuser la demande</button><button type="button" class="esp-bouton esp-bouton--discret" data-cad-motif="annuler">Annuler</button></p><p class="esp-aide">Le règlement est une simulation : il note que le client a réglé, sans rien encaisser.</p>` : ''}
      ${c.etat === 'reglee' ? `<p class="esp-com-actions" data-cad-actions><button type="button" class="bouton" data-cad-emettre>Émettre ${c.quantite > 1 ? `les ${c.quantite} cartes` : 'la carte'}</button><button type="button" class="esp-bouton esp-bouton--discret" data-cad-motif="annuler">Annuler</button></p>
        <p class="esp-aide" data-cad-validite>${v ? `Validité réglée : ${v.mois} mois à partir de l'émission${v.exemple ? ' (exemple à confirmer)' : ''}.` : 'Validité non définie : les cartes seront émises sans date de fin. Elle se règle dans « Cartes cadeaux émises ».'}</p>` : ''}
      ${k.motif === 'refuser' ? motifHtml('cadRefuser', 'Motif du refus', 'Refuser la demande', 'gardé dans l\'historique') : k.motif === 'annuler' ? motifHtml('cadAnnuler', 'Motif de l\'annulation', 'Annuler la demande', c.reglement ? 'le règlement simulé sera noté « à rembourser »' : 'gardé dans l\'historique') : ''}
      ${c.cartes?.length ? `<section class="esp-carte" aria-labelledby="cad-cartes-titre"><h4 id="cad-cartes-titre">${pluriel(c.cartes.length, 'carte émise').replace('carte émises', 'cartes émises')}</h4><ul class="esp-com-cartes" data-cad-cartes>${c.cartes.map((id) => carteLigne(tout[id])).join('')}</ul></section>` : ''}
      <section class="esp-carte" aria-labelledby="cad-detail-titre"><h4 id="cad-detail-titre">La demande</h4>
        <dl class="esp-dem__details"><div><dt>Offre choisie</dt><dd data-cad-offre>${c.offre ? `${e(c.intitule)}${c.publication != null ? ` <small>(version publiée n°&nbsp;${e(c.publication)})</small>` : ''}` : '<span class="esp-com-flou">lien à l\'offre à préciser</span>'}</dd></div>
          <div><dt>Montant</dt><dd>${c.quantite > 1 ? `${c.quantite} × ` : ''}${e(euros(c.montant))}</dd></div>
          <div><dt>Acheteur</dt><dd data-cad-acheteur>${[c.acheteur.nom, c.acheteur.telephone, c.acheteur.email].filter(Boolean).map(e).join(' · ') || '<span class="esp-com-flou">à préciser avant de valider</span>'}</dd></div>
          <div><dt>Bénéficiaire</dt><dd>${e(c.pour) || '<span class="esp-com-flou">non précisé</span>'}</dd></div><div><dt>De la part de</dt><dd>${e(c.de) || '<span class="esp-com-flou">non précisé</span>'}</dd></div>${c.mot ? `<div><dt>Le mot</dt><dd>${e(c.mot)}</dd></div>` : ''}</dl>
        <p class="esp-dem__contact">${contact(c.acheteur)}<button type="button" class="esp-bouton" data-voir-demande="${e(c.id)}">Voir la demande d'origine</button></p>${lienClientHtml('cadeau', c.id, lie)}</section>
      <section class="esp-carte" aria-labelledby="cad-histo-titre"><h4 id="cad-histo-titre">Historique</h4>${histo(c.historique)}</section>${local()}</div>`);
    return true;
  }

  /* ====================== Les cartes émises ====================== */
  const carteLigne = (c) => { const et = etatCarte(c, A.iso); return `<li class="esp-com-ligne" data-carte="${e(c.id)}"><p class="esp-com-ligne__qui"><b class="esp-com-code" data-carte-code>${e(c.code)}</b> <span class="esp-pastille esp-pastille--${PASTILLE_CARTE[et]}">${e(ETATS_CARTE[et])}</span></p>
    <p class="esp-com-ligne__quoi">Valeur ${e(euros(c.valeur))} · solde <b data-carte-solde>${e(euros(soldeCarte(c)))}</b>${c.pour ? ` · pour ${e(c.pour)}` : ''} · carte ${c.rang} sur ${c.sur} · émise le ${e(quand(c.emise))}${c.expire ? ` · valable jusqu'au ${e(fmt(c.expire, { day: 'numeric', month: 'long', year: 'numeric' }))}` : ' · validité non définie'}</p>
    <p class="esp-com-actions"><button type="button" class="esp-bouton" data-com-ouvrir="carte" data-com-id="${e(c.id)}">Ouvrir la carte</button></p></li>`; };
  function rendreCartes() {
    const k = C(), l = cartes(S()), v = validite(S()), trouve = k.code ? carteParCode(S(), k.code) : null;
    X.demoVu?.('cad-cartes');
    X.corps('demandes').innerHTML = typo(`<div class="esp-rec-dossier esp-com" data-com-cartes>${retour('liste', 'Toutes les demandes')}
      <header class="esp-rec-tete"><h3 class="esp-rec-tete__titre" id="com-titre" tabindex="-1">Cartes cadeaux émises</h3><p class="esp-rec-tete__sous">${l.length ? `${pluriel(l.length, 'carte')}, chacune avec son code, sa valeur et son solde.` : 'Aucune carte n\'a encore été émise.'}</p></header>
      <form class="esp-carte esp-com-chercher" data-form-carte-code novalidate><p class="esp-champ"><label for="carte-code">Retrouver une carte par son code</label><input id="carte-code" name="code" value="${e(k.code || '')}" placeholder="DEMO-XXXX-XXXX" autocomplete="off" autocapitalize="characters"></p>
        <p class="esp-com-actions"><button type="submit" class="bouton">Chercher</button></p>${k.code && !trouve ? '<p class="esp-erreur" role="alert" data-carte-introuvable>Aucune carte ne porte ce code. Vérifiez-le sur la carte du client.</p>' : ''}</form>
      <section class="esp-carte" aria-labelledby="cartes-titre"><h4 id="cartes-titre">Toutes les cartes</h4>${l.length ? `<ul class="esp-com-cartes" data-cartes>${l.map(carteLigne).join('')}</ul>` : '<p class="esp-vide">Une carte est émise depuis sa demande, après la validation et l\'enregistrement du règlement simulé.</p>'}</section>
      <form class="esp-carte" data-form-cad-validite novalidate aria-labelledby="val-titre"><h4 id="val-titre">Validité des cartes ${v?.exemple ? '<span class="esp-pastille" data-val-exemple>Exemple à confirmer</span>' : ''}</h4>
        <p class="esp-aide">${v ? `Les prochaines cartes seront valables ${v.mois} mois à partir de leur émission.` : 'Non définie : les cartes sont émises sans date de fin, et rien n\'expire tout seul.'} Les cartes déjà émises ne changent pas. Le site annonce « 6 mois » : à confirmer par le restaurant avant de l'appliquer ici.</p>
        <p class="esp-champ"><label for="val-mois">Durée en mois <small>vide : non définie</small></label><input id="val-mois" name="mois" inputmode="numeric" value="${v ? v.mois : ''}" autocomplete="off"></p>
        ${k.erreur ? `<p class="esp-erreur" role="alert" tabindex="-1" data-com-erreur>${e(k.erreur)}</p>` : ''}<p class="esp-com-actions"><button type="submit" class="esp-bouton">Enregistrer la validité</button></p></form>${local()}</div>`);
    return true;
  }
  const nouvelleOp = () => `op-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  function rendreCarte() {
    const c = carte(C().id); if (!c) { etat.commerce = { ecran: 'cartes' }; return rendreCartes(); }
    const k = C(), et = etatCarte(c, A.iso), solde = soldeCarte(c), g = cadeau(c.demande), lie = S().commerce?.liens?.[`carte:${c.id}`]; k.op ||= nouvelleOp(); k.vuAffiche = solde;   /* le solde affiché : s'il a changé ailleurs avant l'envoi, c'est dit */
    const m = lireNombre(k.montant ?? ''), apres = typeof m === 'number' && m > 0 ? Math.round((solde - m) * 100) / 100 : null;
    X.demoVu?.('cad-carte');
    const usage = (u) => `<li class="esp-com-usage${u.annulee ? ' est-annulee' : ''}" data-usage="${e(u.id)}"><p><time>${e(quand(u.le))}</time> · <b>${e(euros(u.montant))}</b>${u.ref ? ` · ${e(u.ref)}` : ''}${u.par ? ` · noté par ${e(u.par)}` : ''}${u.corrige ? ' · <span class="esp-pastille">Correction</span>' : ''}
        ${u.annulee ? ` <span class="esp-pastille esp-pastille--refusee">${u.annulee.remplaceePar ? 'Corrigée' : 'Annulée'}</span> <small>le ${e(quand(u.annulee.le))} : ${e(u.annulee.motif)}</small>` : ''}</p>
      ${u.annulee || et === 'desactivee' ? '' : `<p class="esp-com-actions"><button type="button" class="esp-bouton esp-bouton--discret" data-usage-corriger="${e(u.id)}">Corriger</button><button type="button" class="esp-bouton esp-bouton--discret" data-usage-annuler="${e(u.id)}">Annuler cette utilisation</button></p>`}
      ${k.usage?.id === u.id && et === 'expiree' ? '<p class="esp-aide" data-usage-historique>Rectification de l\'historique : la carte reste expirée, sa date de fin ne change pas, rien n\'est remboursé.</p>' : ''}
      ${k.usage?.id === u.id ? `<form class="esp-com-motif" data-form-usage="${k.usage.quoi}" novalidate>${k.usage.quoi === 'corriger' ? `<p class="esp-champ"><label for="usage-montant">Montant corrigé <small>en euros</small></label><input id="usage-montant" name="montant" inputmode="decimal" value="${e(k.usage.montant ?? String(u.montant).replace('.', ','))}" autocomplete="off"></p>` : ''}
        <p class="esp-champ esp-champ--large"><label for="usage-motif">Motif <small>gardé dans l'historique ; l'utilisation d'origine reste lisible</small></label><textarea id="usage-motif" name="motif" rows="2">${e(k.usage.motif || '')}</textarea></p>
        ${k.erreur ? `<p class="esp-erreur" role="alert" tabindex="-1" data-com-erreur>${e(k.erreur)}</p>` : ''}<p class="esp-com-actions"><button type="submit" class="bouton">${k.usage.quoi === 'corriger' ? 'Enregistrer la correction' : 'Annuler cette utilisation'}</button><button type="button" class="esp-bouton" data-usage-fermer>Ne rien changer</button></p></form>` : ''}</li>`;
    X.corps('demandes').innerHTML = typo(`<div class="esp-rec-dossier esp-com" data-carte-ecran="${e(c.id)}" data-carte-etat="${et}">${retour('cartes', 'Cartes cadeaux émises')}
      <header class="esp-rec-tete"><h3 class="esp-rec-tete__titre" id="com-titre" tabindex="-1">Carte <span class="esp-com-code" data-carte-code>${e(c.code)}</span></h3>
        <p class="esp-rec-tete__sous">Code de démonstration · carte ${c.rang} sur ${c.sur}${c.pour ? ` · pour ${e(c.pour)}` : ''}${c.de ? ` · de la part de ${e(c.de)}` : ''}</p></header>
      <ul class="esp-rec-etats esp-com-etats" aria-label="Où en est cette carte">
        <li><span class="esp-rec-etats__quoi">État</span><b class="esp-pastille esp-pastille--${PASTILLE_CARTE[et]}" data-carte-pastille>${e(ETATS_CARTE[et])}</b>${c.desactivee ? `<span class="esp-rec-etats__detail">${e(c.desactivee.motif)}</span>` : ''}</li>
        <li><span class="esp-rec-etats__quoi">${et === 'expiree' ? 'Solde à l\'expiration' : 'Solde'}</span><b class="esp-com-solde" data-carte-solde>${e(euros(solde))}</b><span class="esp-rec-etats__detail">valeur initiale ${e(euros(c.valeur))}${et === 'expiree' ? ' ; solde historique, non utilisable' : et === 'desactivee' ? ' ; non utilisable' : ''}</span></li>
        <li><span class="esp-rec-etats__quoi">Validité</span><b data-carte-validite>${c.expire ? `Jusqu'au ${e(fmt(c.expire, { day: 'numeric', month: 'long', year: 'numeric' }))}` : 'Non définie'}</b><span class="esp-rec-etats__detail">émise le ${e(quand(c.emise))}</span></li></ul>
      ${et === 'active' ? `<form class="esp-carte esp-com-utiliser" data-form-carte-utiliser="${e(c.id)}" novalidate aria-labelledby="util-titre"><h4 id="util-titre">Utiliser cette carte</h4>
        <p class="esp-champ"><label for="util-montant">Montant utilisé <small>en euros ; au plus ${e(euros(solde))}</small></label><input id="util-montant" name="montant" inputmode="decimal" value="${e(k.montant ?? '')}" autocomplete="off" data-util-champ="montant"></p>
        <p class="esp-champ"><label for="util-ref">Référence <small>l'addition, la table, le jour</small></label><input id="util-ref" name="ref" value="${e(k.ref ?? '')}" autocomplete="off" data-util-champ="ref"></p>
        <p class="esp-champ"><label for="util-par">Noté par</label><input id="util-par" name="par" value="${e(k.par ?? '')}" autocomplete="off" data-util-champ="par"></p>
        <p class="esp-com-apres" data-util-apres aria-live="polite">${apresHtml(solde, m, apres)}</p>
        ${k.erreur && !k.usage && !k.motif ? `<p class="esp-erreur" role="alert" tabindex="-1" data-com-erreur>${e(k.erreur)}</p>` : ''}
        <p class="esp-com-actions"><button type="submit" class="bouton">Confirmer l'utilisation</button></p>
        <p class="esp-aide">Utilisation simulée : aucune réservation n'est débitée toute seule, aucun paiement n'est encaissé.</p></form>`
        : `<p class="esp-rec-suite" data-carte-bloquee>${et === 'epuisee' ? 'Cette carte est épuisée : son solde est de 0 €.' : et === 'expiree' ? `Cette carte a expiré le ${e(fmt(c.expire, { day: 'numeric', month: 'long', year: 'numeric' }))} : elle ne peut plus être utilisée.` : `Cette carte est désactivée : elle ne peut pas être utilisée. ${e(c.desactivee?.motif || '')}`}</p>${k.erreur && !k.usage && !k.motif ? `<p class="esp-erreur" role="alert" tabindex="-1" data-com-erreur>${e(k.erreur)}</p>` : ''}`}
      <section class="esp-carte" aria-labelledby="usages-titre"><h4 id="usages-titre">Utilisations</h4>
        ${c.utilisations.some((u) => !u.annulee) && et === 'expiree' ? '<p class="esp-com-note-carte" data-carte-note-historique>Carte expirée : aucune nouvelle utilisation n\'est possible. Une utilisation passée peut encore être corrigée ou annulée, avec un motif : la carte reste expirée.</p>' : ''}
        ${c.utilisations.some((u) => !u.annulee) && et === 'desactivee' ? '<p class="esp-com-note-carte" data-carte-note-historique>Carte désactivée : son historique est figé. Pour corriger ou annuler une utilisation, réactivez-la d\'abord.</p>' : ''}
        ${c.utilisations.length ? `<ol class="esp-com-usages" data-usages>${c.utilisations.map(usage).join('')}</ol>` : '<p class="esp-vide">Cette carte n\'a pas encore été utilisée.</p>'}</section>
      <section class="esp-carte" aria-labelledby="carte-liens-titre"><h4 id="carte-liens-titre">Liens</h4>
        <dl class="esp-dem__details"><div><dt>Offre</dt><dd>${c.offre ? e(c.intitule) : '<span class="esp-com-flou">lien à l\'offre à préciser</span>'}</dd></div><div><dt>Acheteur</dt><dd>${[c.acheteur?.nom, c.acheteur?.telephone].filter(Boolean).map(e).join(' · ') || '—'}</dd></div><div><dt>Bénéficiaire</dt><dd>${e(c.pour) || 'non précisé'}</dd></div>${c.mot ? `<div><dt>Le mot</dt><dd>${e(c.mot)}</dd></div>` : ''}</dl>
        <p class="esp-com-actions">${g ? `<button type="button" class="esp-bouton" data-com-ouvrir="cadeau" data-com-id="${e(c.demande)}" data-com-depuis="cartes">Ouvrir la demande ${e(g.ref)}</button>` : ''}
          ${c.desactivee ? '<button type="button" class="esp-bouton" data-carte-reactiver>Réactiver la carte</button>' : '<button type="button" class="esp-bouton esp-bouton--discret" data-carte-motif="desactiver">Désactiver la carte</button>'}</p>
        ${k.motif === 'desactiver' ? motifHtml('carteActiver', 'Motif de la désactivation', 'Désactiver la carte', 'carte perdue, émise par erreur… ; ses utilisations restent lisibles') : ''}
        <div data-carte-beneficiaire>${lienClientHtml('carte', c.id, lie).replace('Rattacher à une fiche client', 'Fiche client du bénéficiaire')}</div></section>
      <section class="esp-carte" aria-labelledby="carte-histo-titre"><h4 id="carte-histo-titre">Historique</h4>${histo(c.historique)}</section>${local()}</div>`);
    return true;
  }
  const apresHtml = (solde, m, apres) => (m === '' ? `Solde actuel : <b>${e(euros(solde))}</b>.` : m === null || !(m > 0) ? '<span class="esp-erreur">Le montant est un nombre plus grand que zéro, par exemple 20 ou 12,50.</span>' : apres < 0 ? `<span class="esp-erreur" data-util-depasse>Ce montant dépasse le solde (${e(euros(solde))}) : il sera refusé.</span>` : `Solde après cette utilisation : <b data-util-solde-apres>${e(euros(apres))}</b>.`);

  /* ====================== Les accès : la liste des demandes, Aujourd'hui, la fiche client ====================== */
  /** Le bouton d'une carte de demande (traiteur ou carte cadeau) : il ouvre le dossier, avec son état. */
  function boutonDemande(d) {
    if (d.genre === 'traiteur') { const c = commande(d.id); return c ? `<button type="button" class="esp-bouton${c.etat === 'recue' ? ' esp-bouton--ok' : ''}" data-com-ouvrir="commande" data-com-id="${e(d.id)}">${c.etat === 'recue' ? 'Décider\u00a0: ouvrir la commande' : 'Ouvrir la commande'}</button>` : ''; }
    if (d.genre === 'cadeau') { const c = cadeau(d.id); return c ? `<button type="button" class="esp-bouton${c.etat === 'recue' ? ' esp-bouton--ok' : ''}" data-com-ouvrir="cadeau" data-com-id="${e(d.id)}">${c.etat === 'recue' ? 'Décider\u00a0: ouvrir la demande' : c.etat === 'reglee' ? 'Émettre les cartes' : 'Ouvrir la demande'}</button>` : ''; }
    return '';
  }
  /** Les deux vues secondaires, depuis la rubrique Demandes. */
  function acces() {
    const p = priorites(dem(), S(), lieux(), A.iso), n = Object.values(S().commerce?.commandes || {}).filter((c) => ['validee', 'preparation'].includes(c.etat)).length, nc = cartes(S()).length;
    return `<p class="esp-com-acces" data-com-acces><button type="button" class="esp-bouton" data-com-ouvrir="preparation">Préparation et retraits${n ? ` <span class="esp-filtre__n" aria-label="${n} à préparer">${n}</span>` : ''}</button>
      <button type="button" class="esp-bouton" data-com-ouvrir="cartes">Cartes cadeaux émises${nc ? ` <span class="esp-filtre__n" aria-label="${nc} cartes">${nc}</span>` : ''}${p.cartesAEmettre.length ? ` <span class="esp-pastille esp-pastille--a-confirmer">${pluriel(p.cartesAEmettre.length, 'demande')} à émettre</span>` : ''}</button></p>`;
  }
  /** Le bloc « Traiteur et cadeaux » de la rubrique Aujourd'hui : ce qui attend l'équipe, sans effet sur les couverts. */
  /* v7.15.0 : `sansDemandes` — les demandes à décider sont déjà listées juste au-dessus (« Les demandes qui attendent une
     réponse ») ; `production` — la vue Cuisine ne garde que ce qui se prépare et se remet. */
  function aujourdhui({ sansDemandes = false, production = false } = {}) {
    const p = priorites(dem(), S(), lieux(), A.iso), l = [];
    if (sansDemandes || production) { p.aDecider = []; p.cadeauxATraiter = p.cadeauxATraiter.filter((c) => c.etat !== 'recue'); }
    if (production) { p.cadeauxATraiter = []; p.cartesAEmettre = []; }
    const cmd = (c, quoi) => `<li class="esp-com-ligne" data-auj-cmd="${e(c.id)}"><p class="esp-com-ligne__qui"><b>${e(c.ref)}</b> · ${e(nomClient(c.client))} <span class="esp-pastille esp-pastille--${PASTILLE[c.etat]}">${e(ETATS[c.etat])}</span></p><p class="esp-com-ligne__quoi">${e(quoi)} · ${e(c.lignes.map((x) => `${quantite(x.quantite, x.unite)} ${x.nom}`).join(' ; '))}</p><p class="esp-com-actions"><button type="button" class="esp-bouton" data-com-ouvrir="commande" data-com-id="${e(c.id)}">Ouvrir</button></p></li>`;
    const cad = (c, quoi) => `<li class="esp-com-ligne" data-auj-cad="${e(c.id)}"><p class="esp-com-ligne__qui"><b>${e(c.ref)}</b> · ${e(c.acheteur.nom || c.de || 'Acheteur à préciser')} <span class="esp-pastille esp-pastille--${PASTILLE_CAD[c.etat]}">${e(ETATS_CADEAU[c.etat])}</span></p><p class="esp-com-ligne__quoi">${e(quoi)} · ${e(pluriel(c.quantite, 'carte'))} de ${e(euros(c.montant))}</p><p class="esp-com-actions"><button type="button" class="esp-bouton" data-com-ouvrir="cadeau" data-com-id="${e(c.id)}">Ouvrir</button></p></li>`;
    if (p.aDecider.length) l.push(`<h4>Demandes traiteur à décider</h4><ul class="esp-com-cartes" data-auj="a-decider">${p.aDecider.map((c) => cmd(c, `Retrait ${retraitTexte(c)}`)).join('')}</ul>`);
    if (p.retraits.length) l.push(`<h4>Préparations et retraits du jour</h4><ul class="esp-com-cartes" data-auj="retraits">${p.retraits.map((c) => cmd(c, `Retrait ${momentTexte(c.moment)}`)).join('')}</ul>`);
    const attente = p.pretes.filter((c) => c.jour !== A.iso); if (attente.length) l.push(`<h4>Commandes prêtes, en attente de retrait</h4><ul class="esp-com-cartes" data-auj="pretes">${attente.map((c) => cmd(c, `Retrait ${retraitTexte(c)}`)).join('')}</ul>`);
    if (p.cadeauxATraiter.length) l.push(`<h4>Demandes de cartes cadeaux à traiter</h4><ul class="esp-com-cartes" data-auj="cadeaux">${p.cadeauxATraiter.map((c) => cad(c, c.etat === 'recue' ? 'À valider' : 'Règlement simulé à enregistrer')).join('')}</ul>`);
    if (p.cartesAEmettre.length) l.push(`<h4>Cartes à émettre</h4><ul class="esp-com-cartes" data-auj="a-emettre">${p.cartesAEmettre.map((c) => cad(c, 'Réglée : cartes à émettre')).join('')}</ul>`);
    if (p.aCompleter?.length) l.push(`<h4>Commandes à compléter</h4><ul class="esp-com-cartes" data-auj="a-completer">${p.aCompleter.map((c) => cmd(c, `Il reste à produire : ${manqueDe(c).map((x) => `${x.nom}, ${quantite(x.quantite, x.unite)}`).join(' ; ')}`)).join('')}</ul>`);
    if (p.aVerifier?.length) l.push(`<h4>Production historique à vérifier</h4><ul class="esp-com-cartes" data-auj="a-verifier">${p.aVerifier.map((c) => cmd(c, 'Corrigée après la préparation, avant le suivi de la production : quantités engagées à confirmer')).join('')}</ul>`);
    if (!l.length) return '';
    return typo(`<section class="esp-carte esp-com-auj" aria-labelledby="com-auj-titre" data-com-auj><h3 id="com-auj-titre" class="esp-com-auj__titre">${production ? 'Préparations traiteur' : 'Traiteur et cartes cadeaux'}</h3>
      <p class="esp-aide">Ces commandes ne prennent ni table ni couvert : elles ne changent pas le remplissage du restaurant.</p>${l.join('')}
      <p class="esp-com-actions"><button type="button" class="esp-bouton" data-com-ouvrir="preparation">Préparation et retraits</button>${production ? '' : '<button type="button" class="esp-bouton" data-com-ouvrir="cartes">Cartes cadeaux émises</button>'}</p></section>`);
  }
  /** Dans la fiche d'un client : ses commandes, les cadeaux qu'il a achetés, les cartes reçues, leurs utilisations. */
  function fiche(client) {
    const f = commerceDuClient(client, dem(), S(), lieux()); if (!f.commandes.length && !f.cadeaux.length && !f.cartesRecues.length) return '';
    const actions = [...f.commandes.filter((c) => !FINIES.includes(c.etat)).map((c) => `${c.ref} : ${PROCHAINE[c.etat]}`), ...f.cadeaux.filter((c) => ['recue', 'validee', 'reglee'].includes(c.etat)).map((c) => `${c.ref} : ${PROCHAINE_CADEAU[c.etat]}`)];
    return typo(`<section class="esp-com-fiche" data-com-fiche aria-labelledby="com-fiche-titre"><h4 id="com-fiche-titre">Traiteur et cartes cadeaux</h4>
      ${f.commandes.length ? `<p class="esp-champ__titre">Commandes à emporter (${f.commandes.length})</p><ul class="esp-com-cartes" data-fiche-commandes>${f.commandes.map((c) => `<li class="esp-com-ligne"><p class="esp-com-ligne__qui"><b>${e(c.ref)}</b> <span class="esp-pastille esp-pastille--${PASTILLE[c.etat]}">${e(ETATS[c.etat])}</span></p><p class="esp-com-ligne__quoi">Retrait ${e(retraitTexte(c))} · ${c.total == null ? 'total non conservé' : e(euros(c.total))}</p><p class="esp-com-actions"><button type="button" class="esp-bouton" data-com-ouvrir="commande" data-com-id="${e(c.id)}">Ouvrir</button></p></li>`).join('')}</ul>` : ''}
      ${f.cadeaux.length ? `<p class="esp-champ__titre">Cartes cadeaux achetées (${f.cadeaux.length} demande${f.cadeaux.length > 1 ? 's' : ''})</p><ul class="esp-com-cartes" data-fiche-cadeaux>${f.cadeaux.map((c) => `<li class="esp-com-ligne"><p class="esp-com-ligne__qui"><b>${e(c.ref)}</b> <span class="esp-pastille esp-pastille--${PASTILLE_CAD[c.etat]}">${e(ETATS_CADEAU[c.etat])}</span></p><p class="esp-com-ligne__quoi">${e(pluriel(c.quantite, 'carte'))} de ${e(euros(c.montant))}${c.pour ? ` pour ${e(c.pour)}` : ''}${f.cartesAchetees.filter((x) => x.demande === c.id).length ? ` · soldes : ${f.cartesAchetees.filter((x) => x.demande === c.id).map((x) => euros(soldeCarte(x))).map(e).join(', ')}` : ''}</p><p class="esp-com-actions"><button type="button" class="esp-bouton" data-com-ouvrir="cadeau" data-com-id="${e(c.id)}">Ouvrir</button></p></li>`).join('')}</ul>` : ''}
      ${f.cartesRecues.length ? `<p class="esp-champ__titre">Cartes reçues en cadeau (${f.cartesRecues.length})</p><ul class="esp-com-cartes" data-fiche-recues>${f.cartesRecues.map(carteLigne).join('')}</ul>` : ''}
      ${f.utilisations.length ? `<p class="esp-champ__titre">Utilisations</p><ul class="esp-pub__liste" data-fiche-utilisations>${f.utilisations.map((u) => `<li${u.annulee ? ' class="esp-com-usage est-annulee"' : ''}>${e(quand(u.le))} : ${e(euros(u.montant))} sur ${e(u.code)}${u.ref ? ` (${e(u.ref)})` : ''}${u.annulee ? ' — annulée' : ''}</li>`).join('')}</ul>` : ''}
      ${actions.length ? `<p class="esp-champ__titre">Prochaines actions</p><ul class="esp-pub__liste" data-fiche-actions>${actions.map((x) => `<li>${e(x)}</li>`).join('')}</ul>` : ''}
      <p class="esp-aide">Rattachées par le téléphone ou l'e-mail de la fiche, ou à la main. Un nom seul ne rattache rien.</p></section>`);
  }

  /* ====================== Les gestes ====================== */
  function rendre() { const k = etat.commerce; if (!k?.ecran) return false; return ({ commande: rendreCommande, preparation: rendrePreparation, cadeau: rendreCadeau, cartes: rendreCartes, carte: rendreCarte })[k.ecran]?.() || false; }
  function imprimer(html) {
    document.querySelector('.esp-feuille')?.remove(); const f = document.createElement('div'); f.className = 'esp-feuille esp-feuille--commerce'; f.innerHTML = typo(html); document.body.append(f);
    document.documentElement.classList.add('esp-impression');
    const fin = () => { document.documentElement.classList.remove('esp-impression'); f.remove(); removeEventListener('afterprint', fin); };
    addEventListener('afterprint', fin);
    try { print(); } catch { fin(); X.dire('L\'impression n\'a pas pu démarrer sur ce navigateur.'); }
  }
  function clic(t) {
    if (t.closest('[data-voir-demande]')) { etat.commerce = null; return false; }
    const o = t.closest('[data-com-ouvrir]');
    if (o) { if (o.closest('.esp-modale')) X.fermerClient?.(); ouvrir(o.dataset.comOuvrir, o.dataset.comId || ''); if (o.dataset.comDepuis) C().depuis = o.dataset.comDepuis; X.rendre(); $('#com-titre', root)?.focus({ preventScroll: true }); return true; }
    const r = t.closest('[data-com-retour]');
    if (r) { const vers = r.dataset.comRetour; if (vers === 'liste') fermer(); else etat.commerce = { ecran: vers }; X.rendre(); ($('#com-titre', root) || $('[data-com-acces] button', root))?.focus({ preventScroll: true }); return true; }
    const k = etat.commerce; if (!k?.ecran && !t.closest('[data-cmd-avancer]')) return false;
    const av = t.closest('[data-cmd-avancer]');
    if (av) {
      const id = av.dataset.cmdId || k?.id, c = commande(id), vers = av.dataset.cmdAvancer; if (!c) return true;
      if (vers === 'validee') faire('cmdValider', { id, base: c, le: maintenant() }, `Commande ${c.ref} validée : elle entre en préparation pour le ${fmt(c.jour, { day: 'numeric', month: 'long' })}. Aucun message n'est parti.`);
      else faire('cmdAvancer', { id, vers, le: maintenant() }, vers === 'preparation' ? `Commande ${c.ref} en préparation : ses quantités sont engagées en production pour le ${fmt(c.jour, { day: 'numeric', month: 'long' })}.` : `Commande ${c.ref} : ${ETATS[vers].toLowerCase()}.`);
      $('#com-titre', root)?.focus({ preventScroll: true }); return true;
    }
    if (!k) return false;
    /* Une demande dont le retrait n'est plus proposé : l'accepter quand même est une décision à part, notée comme telle. */
    if (t.closest('[data-cmd-exception]')) { const c = commande(k.id); if (c) faire('cmdValider', { id: k.id, base: c, exception: true, le: maintenant() }, `Commande ${c.ref} validée à titre exceptionnel pour le ${fmt(c.jour, { day: 'numeric', month: 'long' })} : c'est noté dans l'historique. Aucun message n'est parti.`); $('#com-titre', root)?.focus({ preventScroll: true }); return true; }
    /* La production engagée : rectifier un lot, en ajouter un oublié, confirmer une production « à vérifier ». */
    const pr = t.closest('[data-prod-rectifier]');
    if (pr) { const c = commande(k.id), lot = c && lotsDe(c).find((x) => x.id === pr.dataset.prodRectifier), connus = c ? produitsConnus(c) : [];
      k.rectif = lot ? { lot: lot.id, jour: lot.jour, q: String(lot.quantite).replace('.', ','), motif: '', op: nouvelleOpProd(), vu: { jour: lot.jour, quantite: lot.quantite } } : { lot: '', offre: connus[0]?.offre || '', jour: c?.jour || '', q: '', motif: '', op: nouvelleOpProd() };
      k.erreur = ''; k.edition = null; k.motif = null; X.rendre(); $('#rectif-titre', root)?.focus(); return true; }
    if (t.closest('[data-prod-complement]')) { const c = commande(k.id), manque = c ? manqueDe(c) : []; if (c) faire('cmdCompleter', { id: k.id, le: maintenant() }, `Complément engagé en production pour ${c.ref} : ${manque.map((x) => `${x.nom}, ${quantite(x.quantite, x.unite)}`).join(' ; ')}. La commande peut reprendre son cours.`); $('#com-titre', root)?.focus({ preventScroll: true }); return true; }
    if (t.closest('[data-prod-fermer]')) { k.rectif = null; k.erreur = ''; X.rendre(); $('#cmd-prod-titre', root)?.scrollIntoView({ block: 'nearest' }); $('[data-prod-rectifier]', root)?.focus(); return true; }
    if (t.closest('[data-prod-verifiee]')) { const c = commande(k.id); if (c) faire('cmdProductionVerifiee', { id: k.id, le: maintenant() }, `Production de ${c.ref} vérifiée : les quantités enregistrées sont confirmées.`); $('#com-titre', root)?.focus({ preventScroll: true }); return true; }
    if (t.closest('[data-periode-defaut]')) { k.perOuvert = true; if (faire('cmdRetraits', { debut: '', fin: '' }, `Période des retraits : retour au réglage de départ (${periodeTexte(lieux().retraits)}). Les commandes déjà acceptées ne changent pas.`)) k.periode = null; X.rendre(); $('[data-periode] summary', root)?.focus(); return true; }
    const mo = t.closest('[data-cmd-motif], [data-cad-motif], [data-carte-motif]'); if (mo) { k.motif = mo.dataset.cmdMotif || mo.dataset.cadMotif || mo.dataset.carteMotif; k.erreur = ''; k.edition = null; X.rendre(); $('#com-motif', root)?.focus(); return true; }
    if (t.closest('[data-com-motif-fermer]')) { k.motif = null; k.erreur = ''; X.rendre(); $('#com-titre', root)?.focus({ preventScroll: true }); return true; }
    if (t.closest('[data-cmd-fiche]')) { k.fiche = !k.fiche; X.rendre(); $(k.fiche ? '[data-com-imprimer]' : '[data-cmd-fiche]', root)?.focus(); return true; }
    const im = t.closest('[data-com-imprimer]'); if (im) { const c = commande(k.id); imprimer(im.dataset.comImprimer === 'retrait' && c ? ficheRetrait(c) : k.feuille || ''); return true; }
    if (t.closest('[data-cmd-modifier]')) { const c = commande(k.id); k.edition = { lignes: c.lignes.map((l) => ({ ...l, q: String(l.quantite).replace('.', ',') })), jour: c.jour, moment: c.moment || 'soir', remarque: c.remarque || '', motif: '', exception: false }; k.motif = null; k.rectif = null; k.erreur = ''; X.rendre(); $('#cmd-ed-titre', root)?.focus(); return true; }
    if (t.closest('[data-cmd-edition-fermer]')) { k.edition = null; k.erreur = ''; X.rendre(); $('[data-cmd-modifier]', root)?.focus(); return true; }
    const rt = t.closest('[data-cmd-retirer]'); if (rt && k.edition) { k.edition.lignes.splice(+rt.dataset.cmdRetirer, 1); X.rendre(); $('#cmd-ed-titre', root)?.focus(); return true; }
    if (t.closest('[data-cmd-ajouter]') && k.edition) { const o = emporterVitrine(lieux(), S(), A.iso).find((x) => x.id === $('[data-cmd-ajout]', root)?.value); if (o) { const deja = k.edition.lignes.find((l) => l.offre === o.id && l.prix === o.prix); if (deja) deja.q = String((lireNombre(deja.q) || 0) + (o.vente?.pas || 1)).replace('.', ','); else k.edition.lignes.push({ offre: o.id, nom: o.nom, unite: o.unite, prix: o.prix, q: String(o.vente?.min || 1).replace('.', ',') }); } X.rendre(); $('[data-cmd-ajout]', root)?.focus(); return true; }
    const pj = t.closest('[data-prep-jour]'); if (pj) { k.jour = pj.dataset.prepJour; X.rendre(); $(`[data-prep-jour="${CSS.escape(k.jour)}"]`, root)?.focus(); return true; }
    const pm = t.closest('[data-prep-moment]'); if (pm) { k.moment = pm.dataset.prepMoment; X.rendre(); $(`[data-prep-moment="${k.moment}"]`, root)?.focus(); return true; }
    if (t.closest('[data-cad-regler]')) { const c = cadeau(k.id); faire('cadRegler', { id: k.id, le: maintenant() }, `Règlement simulé enregistré pour ${c.ref} : ${euros(c.total)}. Aucun paiement réel n'a eu lieu.`); $('[data-cad-emettre]', root)?.focus(); return true; }
    if (t.closest('[data-cad-emettre]')) { const c = cadeau(k.id); if (faire('cadEmettre', { id: k.id, le: maintenant() }, `${c.quantite > 1 ? `${c.quantite} cartes distinctes émises` : 'Carte émise'} pour ${c.ref}. Aucun message n'est parti.`)) $('[data-cad-cartes] button', root)?.focus(); return true; }
    if (t.closest('[data-carte-reactiver]')) { faire('carteActiver', { carte: k.id, actif: true, le: maintenant() }, 'Carte réactivée.'); return true; }
    const uc = t.closest('[data-usage-corriger], [data-usage-annuler]'); if (uc) { k.usage = { id: uc.dataset.usageCorriger || uc.dataset.usageAnnuler, quoi: uc.dataset.usageCorriger ? 'corriger' : 'annuler', op: nouvelleOp() }; k.erreur = ''; X.rendre(); $(uc.dataset.usageCorriger ? '#usage-montant' : '#usage-motif', root)?.focus(); return true; }
    if (t.closest('[data-usage-fermer]')) { k.usage = null; k.erreur = ''; X.rendre(); $('#com-titre', root)?.focus({ preventScroll: true }); return true; }
    return false;
  }
  function soumettre(f) {
    const k = etat.commerce;
    if (f.matches('[data-form-com-lier]')) { const [quoi, id] = f.dataset.formComLier.split(/:(.*)/s); faire('comLier', { quoi, id, client: f.elements.client.value }, f.elements.client.value ? 'Rattachement enregistré : il apparaît dans la fiche du client.' : 'Rattachement retiré.'); return true; }
    if (!k) return false;
    if (f.matches('[data-com-motif]')) {
      const nom = f.dataset.comMotif, motif = f.elements.motif.value; k.motifTexte = motif; const c = nom.startsWith('cmd') ? commande(k.id) : nom.startsWith('cad') ? cadeau(k.id) : null;
      const ok = nom === 'carteActiver' ? faire(nom, { carte: k.id, actif: false, motif, le: maintenant() }, 'Carte désactivée : elle ne peut plus être utilisée. Ses utilisations restent lisibles.')
        : faire(nom, { id: k.id, base: c, motif, le: maintenant() }, nom === 'cmdRefuser' ? `Demande ${c.ref} refusée. Aucun message n'est parti : prévenez le client.` : nom === 'cmdAnnuler' ? `Commande ${c.ref} annulée. Aucun message n'est parti : prévenez le client.` : nom === 'cadRefuser' ? `Demande ${c.ref} refusée.` : `Demande ${c.ref} annulée.`);
      if (ok) { k.motif = null; k.motifTexte = ''; X.rendre(); $('#com-titre', root)?.focus({ preventScroll: true }); } else $('#com-motif', root)?.focus();
      return true;
    }
    if (f.matches('[data-form-cmd]')) {
      const c = commande(k.id), ed = k.edition, l = lignesEdition();
      if (l.some((x) => !(typeof x.quantite === 'number' && x.quantite > 0))) { k.erreur = 'Chaque quantité est un nombre plus grand que zéro (par exemple 2 ou 1,5).'; X.rendre(); $('[data-com-erreur]', root)?.focus(); return true; }
      const lignes = l.map(({ q, ...x }) => x);
      if (!effetsModification(c, { lignes, jour: ed.jour, moment: ed.moment, remarque: ed.remarque }).length) { k.edition = null; k.erreur = ''; X.dire('Rien n\'a changé : la commande reste telle quelle.'); X.rendre(); return true; }
      const lancee = preparationCommencee(c), ep = effetsProduction(c, { lignes, jour: ed.jour, moment: ed.moment }), bouge = ed.jour !== c.jour || ed.moment !== c.moment;
      /* Le message dit ce qui a réellement changé : la commande, et ce que devient la production. */
      const dit = !lancee ? `Commande ${c.ref} modifiée : l'historique garde ce qui a changé.` : `Commande ${c.ref} corrigée. ${ep.supplement.length ? `Supplément engagé en production${ep.retour ? ' : la commande repasse en préparation' : ''}.` : 'La production déjà engagée reste comptée, telle quelle.'}`;
      if (faire('cmdModifier', { id: k.id, base: c, lignes, jour: ed.jour, moment: ed.moment, remarque: ed.remarque, motif: ed.motif, exception: bouge && !!ed.exception, le: maintenant() }, dit)) { k.edition = null; X.rendre(); $('#com-titre', root)?.focus({ preventScroll: true }); }
      return true;
    }
    if (f.matches('[data-form-rectifier]')) {
      const r = k.rectif, c = commande(k.id); if (!r || !c) return true; const lot = lotsDe(c).find((x) => x.id === r.lot), p = lot || produitsConnus(c).find((x) => x.offre === r.offre), q = lireNombre(r.q);
      r.jour = f.elements.jour.value; r.q = f.elements.q.value; r.motif = f.elements.motif.value; if (f.elements.offre) r.offre = f.elements.offre.value;   /* la saisie est gardée si l'action est refusée */
      const q2 = lireNombre(r.q);
      if (faire('cmdRectifier', { id: k.id, lot: r.lot, offre: p?.offre || '', nom: p?.nom || '', unite: p?.unite || '', jour: r.jour, quantite: typeof q2 === 'number' ? q2 : NaN, motif: r.motif, op: r.op, vu: r.vu, le: maintenant() }, `Production de ${c.ref} rectifiée${p ? ` (${p.nom})` : ''} : l'avant et l'après sont dans l'historique. La commande du client n'a pas changé.`)) { k.rectif = null; const m = manqueDe(commande(k.id) || {}); if (m.length) X.dire(`Production de ${c.ref} rectifiée. Il reste à produire pour l'honorer : ${m.map((x) => `${x.nom}, ${quantite(x.quantite, x.unite)}`).join(' ; ')}. La commande est en préparation.`); X.rendre(); $('#cmd-prod-titre', root)?.scrollIntoView({ block: 'nearest' }); $('#com-titre', root)?.focus({ preventScroll: true }); }
      return true;
    }
    if (f.matches('[data-form-periode]')) {
      k.perOuvert = true; const debut = f.elements.debut.value, fin = f.elements.fin.value; k.periode = { debut, fin };
      if (faire('cmdRetraits', { debut, fin }, debut && fin ? `Période des retraits enregistrée : ${periodeTexte({ debut, fin })}. La page À emporter la suit ; les commandes déjà acceptées ne changent pas.` : '')) { k.periode = null; X.rendre(); $('[data-periode] summary', root)?.focus(); }
      return true;
    }
    if (f.matches('[data-form-cap]')) {
      k.capOuvert = true; k.perOuvert = false; const production = {}; let mauvais = false;
      for (const el of f.elements) if (el.name?.startsWith('prod:')) { const v = lireNombre(el.value); if (v === null) mauvais = true; production[el.name.slice(5)] = v === '' ? null : v; }
      const r = lireNombre(f.elements.retraits.value); if (r === null || mauvais) { k.erreur = 'Une capacité est un nombre positif, par exemple 12 ou 2,5 ; laissez vide si elle n\'est pas définie.'; X.rendre(); $('[data-com-erreur]', root)?.focus(); return true; }
      faire('cmdCapacites', { production, retraits: r === '' ? null : r, exemple: false }, 'Capacités enregistrées : elles s\'appliquent aux prochaines validations, sur le site comme ici.'); return true;
    }
    if (f.matches('[data-form-cad-valider]')) {
      const c = cadeau(k.id), acheteur = { nom: f.elements.nom.value, telephone: f.elements.telephone.value, email: f.elements.email.value }; k.acheteur = acheteur;
      if (faire('cadValider', { id: k.id, base: c, acheteur, le: maintenant() }, `Demande ${c.ref} validée : le règlement simulé reste à enregistrer.`)) { k.acheteur = null; $('[data-cad-regler]', root)?.focus(); }
      return true;
    }
    if (f.matches('[data-form-carte-code]')) { const code = f.elements.code.value.trim(); const c = carteParCode(S(), code); if (c) { etat.commerce = { ecran: 'carte', id: c.id }; X.rendre(); $('#com-titre', root)?.focus({ preventScroll: true }); } else { k.code = code; X.rendre(); $('#carte-code', root)?.focus(); } return true; }
    if (f.matches('[data-form-cad-validite]')) { const m = lireNombre(f.elements.mois.value); faire('cadValidite', { mois: m === '' ? null : m === null ? -1 : m, exemple: false }, m === '' ? 'Validité non définie : les prochaines cartes n\'auront pas de date de fin.' : `Validité enregistrée : ${m} mois pour les prochaines cartes.`); return true; }
    if (f.matches('[data-form-carte-utiliser]')) {
      const c = carte(k.id), m = lireNombre(f.elements.montant.value), solde = soldeCarte(c);
      k.montant = f.elements.montant.value; k.ref = f.elements.ref.value; k.par = f.elements.par.value;
      /* La même opération (double clic, formulaire renvoyé) garde sa clé : elle ne débite pas deux fois. `vu` : le solde affiché. */
      if (faire('carteUtiliser', { carte: k.id, montant: typeof m === 'number' ? m : NaN, ref: k.ref, par: k.par, op: k.op, vu: k.vuAffiche ?? solde, le: maintenant() }, typeof m === 'number' ? `Utilisation de ${euros(m)} enregistrée sur ${c.code} : il reste ${euros(Math.round((solde - m) * 100) / 100)}.` : '')) { k.montant = ''; k.ref = ''; k.op = nouvelleOp(); X.rendre(); $('#com-titre', root)?.focus({ preventScroll: true }); }
      else { if (typeof m === 'number' && m > solde) X.demoVu?.('cad-refus'); $('[data-com-erreur]', root)?.focus(); }
      return true;
    }
    if (f.matches('[data-form-usage]')) {
      const u = k.usage, c = carte(k.id), motif = f.elements.motif.value, expiree = etatCarte(c, A.iso) === 'expiree'; u.motif = motif; if (f.elements.montant) u.montant = f.elements.montant.value;   /* la saisie est gardée si l'action est refusée */
      const ok = f.dataset.formUsage === 'corriger' ? (() => { const m = lireNombre(f.elements.montant.value); return faire('carteCorriger', { carte: k.id, utilisation: u.id, montant: typeof m === 'number' ? m : NaN, motif, par: k.par || '', op: u.op, le: maintenant() }, expiree ? `Utilisation corrigée sur ${c.code} : l'ancienne reste lisible. La carte reste expirée, son solde n'est pas utilisable.` : `Utilisation corrigée sur ${c.code} : l'ancienne reste lisible dans l'historique.`); })()
        : faire('carteAnnulerUtilisation', { carte: k.id, utilisation: u.id, motif, par: k.par || '', le: maintenant() }, expiree ? `Utilisation annulée sur ${c.code} : l'historique garde la trace. La carte reste expirée, son solde n'est pas utilisable.` : `Utilisation annulée sur ${c.code} : le solde est rétabli, l'historique garde la trace.`);
      if (ok) { k.usage = null; X.rendre(); $('#com-titre', root)?.focus({ preventScroll: true }); }
      return true;
    }
    return false;
  }
  /** La saisie en direct : les effets d'une modification, le solde après une utilisation (sans rien enregistrer). */
  function saisie(t) {
    const k = etat.commerce; if (!k) return false;
    if (k.edition && t.closest('[data-form-cmd]')) {
      if (t.dataset.cmdQ != null) k.edition.lignes[+t.dataset.cmdQ].q = t.value; else if (t.dataset.cmdChamp) k.edition[t.dataset.cmdChamp] = t.type === 'checkbox' ? t.checked : t.value; else return false;
      const z = $('[data-cmd-effets]', root), c = commande(k.id); if (z && c) z.innerHTML = typo(effetsEdition(c));
      /* La case « retrait exceptionnel » n'apparaît que si le retrait choisi sort de la période ou tombe un jour fermé. */
      const ex = $('[data-cmd-exception-ligne]', root); if (ex && c) { ex.hidden = !(retraitChange(c) && horsRetrait(k.edition.jour, k.edition.moment)); if (ex.hidden && k.edition.exception) { k.edition.exception = false; const b = $('input', ex); if (b) b.checked = false; } }
      return true;
    }
    if (k.rectif && t.dataset.rectifChamp) { k.rectif[t.dataset.rectifChamp] = t.value; const z = $('[data-rectif-effets]', root), c = commande(k.id); if (z && c) z.innerHTML = typo(effetsRectif(c)); return true; }
    if (t.dataset.periodeChamp) { (k.periode ||= {})[t.dataset.periodeChamp] = t.value; k.perOuvert = true; const z = $('[data-periode-effets]', root); if (z) z.innerHTML = typo(effetsPeriode(k.periode.debut, k.periode.fin)); return true; }
    if (t.dataset.utilChamp) { k[t.dataset.utilChamp] = t.value; const c = carte(k.id), z = $('[data-util-apres]', root); if (c && z && t.dataset.utilChamp === 'montant') { const solde = soldeCarte(c), m = lireNombre(t.value); z.innerHTML = typo(apresHtml(solde, m, typeof m === 'number' ? Math.round((solde - m) * 100) / 100 : null)); } return true; }
    return false;
  }
  return { rendre, clic, soumettre, saisie, ouvrir, fermer, boutonDemande, acces, aujourdhui, fiche, commandesDeOffre: (id) => commandesDeOffre(S(), id) };
}
