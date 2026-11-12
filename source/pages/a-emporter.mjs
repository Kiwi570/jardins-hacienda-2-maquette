/* À emporter (v7.5, reprise de la page « À emporter » de la maquette de référence du client) : les incontournables des fêtes
   du chef, leurs prix, le panier (quantités, total, pastille flottante), le jour de retrait du 5 au 31 décembre calculé sur les
   vrais horaires d'ouverture (jours fermés grisés, midi ou soir selon le jour), commande simulée.
   Effet propre : à l'ajout, une pastille s'envole du produit vers la commande. */
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'a-emporter', fichier: 'a-emporter', theme: 'jour', imagePartage: 'vraie/plat-cheminee-1280.webp', modules: [] };

const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const euros = (n) => `${String(n).replace('.', ',')}\u00a0€`;

/* Services ouverts un jour donné, d'après donnees/horaires.json : midi (créneau qui commence avant 15 h), soir (à partir de 18 h). */
function services(horaires, iso) {
  const jour = JOURS[new Date(`${iso}T12:00:00Z`).getUTCDay()];
  const creneaux = horaires.adresses[0].semaine[jour] || [];
  return { midi: creneaux.some((c) => c.slice(0, 5) < '15:00'), soir: creneaux.some((c) => c.slice(0, 5) >= '18:00') };
}

function calendrier(c, E) {
  const [a, m] = E.debut.split('-').map(Number);
  const decalage = (new Date(Date.UTC(a, m - 1, 1)).getUTCDay() + 6) % 7;
  const nbJours = new Date(Date.UTC(a, m, 0)).getUTCDate();
  const d0 = +E.debut.slice(8), d1 = +E.fin.slice(8);
  const cases = [];
  for (let i = 0; i < decalage; i++) cases.push(html`<span class="emp-jour emp-jour--vide" aria-hidden="true"></span>`);
  for (let j = 1; j <= nbJours; j++) {
    const iso = `${a}-${String(m).padStart(2, '0')}-${String(j).padStart(2, '0')}`;
    const s = services(c.donnees.horaires, iso);
    const libelle = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
    if (j < d0 || j > d1) cases.push(html`<span class="emp-jour emp-jour--hors" aria-hidden="true"><span>${j}</span></span>`);
    else if (!s.midi && !s.soir) cases.push(html`<span class="emp-jour emp-jour--ferme" aria-hidden="true" title="${c.s('emporter.ferme')}"><span>${j}</span></span>`);
    else cases.push(html`<label class="emp-jour"><input type="radio" name="jour" value="${iso}" data-libelle="${libelle}" data-midi="${s.midi ? 1 : 0}" data-soir="${s.soir ? 1 : 0}"><span>${j}</span><span class="visuellement-cache">${libelle}</span></label>`);
  }
  return html`<fieldset class="emp-calendrier" data-emp-calendrier data-visuel>
    <legend>${c.t('emporter.jour')} <span class="emp-calendrier__mois">${c.t('emporter.mois')}</span></legend>
    <div class="emp-calendrier__tete" aria-hidden="true">${c.s('emporter.joursSemaine').split(' ').map((n) => html`<span>${n}</span>`)}</div>
    <div class="emp-calendrier__jours">${cases}</div>
  </fieldset>`;
}

export default (c) => {
  const E = c.donnees.emporter;
  const textes = { articles: c.s('emporter.articles'), annonce: c.s('emporter.annonce'), moins: c.s('emporter.moins'), plus: c.s('emporter.plus'), retrait: c.s('emporter.retraitResume'), retraitPanier: c.s('emporter.retraitPanier'), retraitAChoisir: c.s('emporter.retraitAChoisir'), midi: c.s('emporter.midi').toLowerCase(), soir: c.s('emporter.soir').toLowerCase(), recap: c.s('emporter.recap'), simule: c.s('emporter.simule'), ajoute: c.s('emporter.ajoute'), ajouter: c.s('emporter.ajouter'), produits: Object.fromEntries(E.produits.map((p) => [p.id, { nom: p.nom, prix: p.prix, unite: p.unite }])) };
  return html`
<section class="ouv-emp" id="debut">
  <div class="conteneur ouv-emp__grille">
    <div class="ouv-emp__contenu">
      <p class="surtitre">${c.t('emporter.sur')}</p>
      <h1 class="ouv-emp__titre" data-iris-centre>${c.t('emporter.titre')} <em>${c.t('emporter.titre2')}</em></h1>
      <p class="ouv-emp__texte">${c.t('emporter.texte')}</p>
      <p class="ouv-emp__actions"><a class="bouton" href="#produits" data-action-principale data-sans-transition>${c.t('emporter.action')}</a></p>
      <p class="ouv-emp__info" data-info-cle>${c.t('emporter.info')}</p>
    </div>
    <div class="ouv-emp__visuel">
      ${c.media({ nom: 'vraie/plat-cheminee', alt: c.s('emporter.alt'), cadrage: '36% 62%', priorite: true, classe: 'ouv-emp__arche', sizes: '(max-width: 760px) 80vw, 34vw', attrs: 'data-fx="parallaxe" data-fx-force="5"' })}
      <div class="sceau sceau--emp" aria-hidden="true">
        <svg class="sceau__texte" viewBox="0 0 200 200"><defs><path id="sceau-emp" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0"/></defs><text><textPath href="#sceau-emp" textLength="470">${c.s('emporter.sceau')}</textPath></text></svg>
        <span class="sceau__logo"></span>
      </div>
    </div>
  </div>
</section>

<section class="emp-produits" id="produits" aria-labelledby="produits-titre">
  <div class="conteneur">
    <div class="emp-produits__tete">
      <div>
        <p class="surtitre">${c.t('emporter.produitsSur')}</p>
        <h2 id="produits-titre" data-anime="lignes">${c.t('emporter.produitsTitre')}</h2>
      </div>
      <p class="emp-produits__note">${c.t('emporter.allergenes')}</p>
    </div>
    <ul class="emp-produits__grille" data-anime="cascade" data-effet="emporter">
      ${E.produits.map((p) => html`<li class="emp-produit${p.photo ? ' emp-produit--photo' : ''}" data-produit="${p.id}">
        ${p.photo ? c.media({ nom: p.photo, alt: c.s('emporter.photoFoie'), cadrage: '50% 60%', classe: 'emp-produit__photo', sizes: '(max-width: 760px) 92vw, 30vw' }) : ''}
        <div class="emp-produit__corps">
          <p class="emp-produit__ligne"><span class="emp-produit__nom">${p.nom}</span><span class="emp-produit__points" aria-hidden="true"></span><span class="emp-produit__prix">${euros(p.prix)}${p.unite === 'kg' ? html` <small>${c.t('emporter.parKg')}</small>` : ''}</span></p>
          <p class="emp-produit__texte">${p.texte}${p.format ? html` <span class="emp-produit__format">${p.format}</span>` : ''}</p>
          <p class="emp-produit__bas">
            ${p.unite === 'kg' ? html`<label class="emp-produit__poids"><span class="visuellement-cache">${c.s('emporter.poidsDe', { nom: p.nom })}</span><select data-poids>${[0.5, 1, 1.5, 2].map((k) => html`<option value="${k}"${k === 1 ? brut(' selected') : ''}>${String(k).replace('.', ',')} kg</option>`)}</select></label>` : ''}
            <button type="button" class="bouton emp-produit__ajouter" data-ajouter="${p.id}" aria-label="${c.s('emporter.ajouterA', { nom: p.nom })}"><span data-ajouter-texte>${c.t('emporter.ajouter')}</span></button>
          </p>
        </div>
      </li>`)}
    </ul>
  </div>
</section>

<section class="emp-commande" id="commande" aria-labelledby="commande-titre">
  <div class="conteneur emp-commande__grille">
    <form class="emp-form" data-emp-form action="#commande" novalidate>
      <p class="surtitre">${c.t('emporter.commandeSur')}</p>
      <h2 id="commande-titre" data-anime="lignes">${c.t('emporter.retraitTitre')}</h2>
      <p class="emp-form__texte">${c.t('emporter.retraitTexte')}</p>
      ${calendrier(c, E)}
      <p class="emp-form__erreur" data-erreur="jour" hidden>${c.t('emporter.choisirJour')}</p>
      <fieldset class="emp-form__moment" data-emp-moment>
        <legend>${c.t('emporter.moment')}</legend>
        <label class="puce"><input type="radio" name="moment" value="midi" disabled><span>${c.t('emporter.midi')}</span></label>
        <label class="puce"><input type="radio" name="moment" value="soir" disabled><span>${c.t('emporter.soir')}</span></label>
      </fieldset>
      <p class="emp-form__erreur" data-erreur="moment" hidden>${c.t('emporter.choisirMoment')}</p>
      <fieldset class="emp-form__coord">
        <legend>${c.t('emporter.coordonnees')}</legend>
        <label><span>${c.t('emporter.prenom')}</span><input name="prenom" autocomplete="given-name" required></label>
        <label><span>${c.t('emporter.nom')}</span><input name="nom" autocomplete="family-name" required></label>
        <label><span>${c.t('emporter.telephone')}</span><input name="tel" type="tel" autocomplete="tel" required></label>
        <label><span>${c.t('emporter.email')}</span><input name="email" type="email" autocomplete="email"></label>
      </fieldset>
      <p class="emp-form__note">${c.t('emporter.donnees')} ${c.t('emporter.paiement')}</p>
      <p class="emp-form__erreur" data-erreur="panier" hidden>${c.t('emporter.choisirProduit')}</p>
      <button type="submit" class="bouton">${c.t('emporter.valider')}</button>
      <div class="emp-form__merci" data-emp-merci role="status" tabindex="-1" hidden></div>
    </form>
    <aside class="emp-panier" data-emp-panier aria-labelledby="panier-titre">
      <h2 id="panier-titre" class="emp-panier__titre">${c.t('emporter.panierTitre')}</h2>
      <p class="emp-panier__vide" data-panier-vide>${c.t('emporter.panierVide')}</p>
      <ul class="emp-panier__lignes" data-panier-lignes></ul>
      <p class="emp-panier__total"><span>${c.t('emporter.total')}</span><strong data-panier-total>0 €</strong></p>
      <p class="emp-panier__retrait" data-panier-retrait>${c.t('emporter.retraitAChoisir')}</p>
    </aside>
  </div>
</section>

<a class="emp-pastille" href="#commande" data-emp-pastille data-sans-transition hidden aria-label="${c.s('emporter.pastille')}"><span class="emp-pastille__nombre" data-pastille-nombre>0</span><span data-pastille-total>0 €</span></a>
<p class="visuellement-cache" aria-live="polite" data-emp-annonce></p>
<script type="application/json" data-emp-textes>${brut(JSON.stringify(textes).replace(/</g, '\\u003c'))}</script>
`;
};
