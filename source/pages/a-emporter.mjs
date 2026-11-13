/* À emporter (v7.5, reprise de la page « À emporter » de la maquette de référence du client) : les incontournables des fêtes
   du chef, leurs prix, le panier (quantités, total, pastille flottante), le jour de retrait du 5 au 31 décembre calculé sur les
   vrais horaires d'ouverture (jours fermés grisés, midi ou soir selon le jour), commande simulée.
   Effet propre : à l'ajout, une pastille s'envole du produit vers la commande.
   v7.5.8 · Les produits en vitrine sous cloches de verre (reprise de la vitrine de la maquette Lemoy) : chaque plat dessiné en
   illustration (pas de photo détourée des produits pour l'instant), la cloche se soulève au survol, s'ouvre au toucher, et
   la vapeur monte des plats chauds. Dessins et cloche : source/gabarits/cloches.svg.
   v7.5.11 · Le tiroir de la commande : à chaque ajout (ou depuis la pastille), la commande s'ouvre dans un panneau à droite
   (dialog modal : Échap, clic à côté, focus gardé dedans puis rendu) ; le plat s'envole de sa cloche jusqu'à sa ligne.
   v7.5.12 · La commande se termine dans le panneau, en trois étapes (commande, retrait, coordonnées) : le formulaire de la
   section « Le retrait » y est déplacé au chargement (sans JavaScript, il reste dans la page). */
import { readFileSync, existsSync } from 'node:fs';
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'a-emporter', fichier: 'a-emporter', theme: 'jour', imagePartage: 'vraie/plat-cheminee-1280.webp', modules: [] };

const CLOCHES = readFileSync(new URL('../gabarits/cloches.svg', import.meta.url), 'utf8');
const CHAUDS = new Set(['escargots', 'tourte-escargots', 'tourte-grenouilles', 'pate-lorrain']);
const VAPEUR = '<svg class="emp-cloche__vapeur" viewBox="0 56 400 374" aria-hidden="true"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-width="5" filter="url(#pl-flou-l)"><path class="vapeur vapeur--1" d="M168 296C158 276 180 262 170 242C160 222 182 208 174 188"/><path class="vapeur vapeur--2" d="M204 290C194 270 216 256 206 236C196 216 218 202 210 182"/><path class="vapeur vapeur--3" d="M240 298C230 278 252 264 242 244C232 224 254 210 246 190"/></g></svg>';
/* Les plats en image (Grok, détourés par outils/detourer-plats.py) quand ils existent, sinon le dessin. */
const photoPlat = (id) => existsSync(new URL(`../../assets/images/grok/traiteur/${id}-800.webp`, import.meta.url));
const couche = (cls, id) => `<svg class="emp-cloche__${cls}" viewBox="0 56 400 374" aria-hidden="true"><use href="#${id}" width="400" height="430"/></svg>`;

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
  const textes = { articles: c.s('emporter.articles'), annonce: c.s('emporter.annonce'), moins: c.s('emporter.moins'), plus: c.s('emporter.plus'), retrait: c.s('emporter.retraitResume'), retraitPanier: c.s('emporter.retraitPanier'), retraitAChoisir: c.s('emporter.retraitAChoisir'), midi: c.s('emporter.midi').toLowerCase(), soir: c.s('emporter.soir').toLowerCase(), recap: c.s('emporter.recap'), simule: c.s('emporter.simule'), ajoute: c.s('emporter.ajoute'), ajouter: c.s('emporter.ajouter'), tiroirAjoute: c.s('emporter.tiroirAjoute'), tiroirNombre: c.s('emporter.tiroirNombre'), tiroirNombreUn: c.s('emporter.tiroirNombreUn'), tiroirRetirer: c.s('emporter.tiroirRetirer'), tiroirRetirerTexte: c.s('emporter.tiroirRetirerTexte'), tiroirUnite: c.s('emporter.tiroirUnite'), tiroirKg: c.s('emporter.tiroirKg'),
    produits: Object.fromEntries(E.produits.map((p) => [p.id, { nom: p.nom, prix: p.prix, unite: p.unite, vignette: photoPlat(p.id) ? `/assets/images/grok/traiteur/${p.id}-480.webp` : null }])) };
  const jourLong = (iso) => new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
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

<section class="emp-produits emp-vitrine" id="produits" aria-labelledby="produits-titre">
  ${brut(CLOCHES)}
  <div class="conteneur">
    <div class="emp-produits__tete">
      <div>
        <p class="surtitre">${c.t('emporter.produitsSur')}</p>
        <h2 id="produits-titre" data-anime="lignes">${c.t('emporter.produitsTitre')}</h2>
        <p class="emp-vitrine__chapeau">${c.t('emporter.vitrineChapeau')}</p>
      </div>
      <p class="emp-produits__note">${c.t('emporter.allergenes')}</p>
    </div>
    <ul class="emp-produits__grille" data-anime="cascade" data-effet="emporter">
      ${E.produits.map((p, i) => html`<li class="emp-produit" data-produit="${p.id}">
        <div class="emp-cloche" data-emp-cloche data-superpose>
          ${brut(couche('fond', 'cl-assiette') + couche('ombre', 'cl-pied') + couche('arriere', 'cl-arriere'))}
          ${photoPlat(p.id)
            ? html`<img class="emp-cloche__plat emp-cloche__plat--photo" src="/assets/images/grok/traiteur/${p.id}-800.webp" srcset="/assets/images/grok/traiteur/${p.id}-480.webp 480w, /assets/images/grok/traiteur/${p.id}-800.webp 800w" sizes="(max-width: 860px) 46vw, 22vw" alt="${c.s('emporter.illustration', { nom: p.nom })}" loading="lazy" decoding="async">`
            : html`<svg class="emp-cloche__plat" viewBox="0 56 400 374" role="img" aria-label="${c.s('emporter.illustration', { nom: p.nom })}"><use href="#pl-${p.id}" width="400" height="430"/></svg>`}
          ${brut((CHAUDS.has(p.id) ? VAPEUR : '') + couche('dome', 'cl-verre'))}
          ${photoPlat(p.id) ? html`<span class="mention-ia emp-cloche__mention">${c.t('commun.mentionIa')}</span>` : ''}
          <button type="button" class="emp-cloche__verre" aria-pressed="false" aria-label="${c.s('emporter.soulever', { nom: p.nom })}"></button>
        </div>
        <div class="emp-produit__corps">
          <p class="emp-produit__num">N° ${String(i + 1).padStart(2, '0')}</p>
          <h3 class="emp-produit__nom">${p.nom}</h3>
          <p class="emp-produit__meta"><span class="emp-produit__prix">${euros(p.prix)}</span>${p.unite === 'kg' ? html`<small>${c.t('emporter.parKg')}</small>` : ''}</p>
          <p class="emp-produit__texte">${p.texte}</p>
          <p class="emp-produit__bas">
            ${p.unite === 'kg' ? html`<label class="emp-produit__poids"><span class="visuellement-cache">${c.s('emporter.poidsDe', { nom: p.nom })}</span><select data-poids>${[0.5, 1, 1.5, 2].map((k) => html`<option value="${k}"${k === 1 ? brut(' selected') : ''}>${String(k).replace('.', ',')} kg</option>`)}</select></label>` : ''}
            <button type="button" class="emp-ajout" data-ajouter="${p.id}" aria-label="${c.s('emporter.ajouterA', { nom: p.nom })}"><span class="emp-ajout__plus" aria-hidden="true"></span><span data-ajouter-texte>${c.t('emporter.ajouter')}</span></button>
          </p>
        </div>
      </li>`)}
    </ul>
  </div>
</section>

<section class="emp-commande" id="commande" aria-labelledby="commande-titre">
  <div class="conteneur emp-commande__grille">
    <form class="emp-form" id="emp-commande-form" data-emp-form action="#commande" novalidate>
      <div class="emp-form__intro">
        <p class="surtitre">${c.t('emporter.commandeSur')}</p>
        <h2 id="commande-titre" data-anime="lignes">${c.t('emporter.retraitTitre')}</h2>
      </div>
      <div class="emp-form__etape" data-form-etape="retrait">
      <p class="emp-form__texte">${c.t('emporter.retraitTexte')}</p>
      ${calendrier(c, E)}
      <p class="emp-form__erreur" data-erreur="jour" hidden>${c.t('emporter.choisirJour')}</p>
      <fieldset class="emp-form__moment" data-emp-moment>
        <legend>${c.t('emporter.moment')}</legend>
        <label class="puce"><input type="radio" name="moment" value="midi" disabled><span>${c.t('emporter.midi')}</span></label>
        <label class="puce"><input type="radio" name="moment" value="soir" disabled><span>${c.t('emporter.soir')}</span></label>
      </fieldset>
      <p class="emp-form__erreur" data-erreur="moment" hidden>${c.t('emporter.choisirMoment')}</p>
      </div>
      <div class="emp-form__etape" data-form-etape="coordonnees">
      <fieldset class="emp-form__coord">
        <legend>${c.t('emporter.coordonnees')}</legend>
        <label><span>${c.t('emporter.prenom')}</span><input name="prenom" autocomplete="given-name" required></label>
        <label><span>${c.t('emporter.nom')}</span><input name="nom" autocomplete="family-name" required></label>
        <label><span>${c.t('emporter.telephone')}</span><input name="tel" type="tel" autocomplete="tel" required></label>
        <label><span>${c.t('emporter.email')}</span><input name="email" type="email" autocomplete="email"></label>
      </fieldset>
      <p class="emp-form__note">${c.t('emporter.donnees')} ${c.t('emporter.paiement')}</p>
      <p class="emp-form__erreur" data-erreur="panier" hidden>${c.t('emporter.choisirProduit')}</p>
      <button type="submit" class="bouton emp-form__envoyer">${c.t('emporter.valider')}</button>
      </div>
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
<dialog class="emp-tiroir" data-emp-tiroir aria-labelledby="tiroir-titre">
  <div class="emp-tiroir__voile" data-tiroir-fermer aria-hidden="true"></div>
  <div class="emp-tiroir__panneau">
    <div class="emp-tiroir__tete">
      <button type="button" class="emp-tiroir__retour" data-tiroir-retour aria-label="${c.s('emporter.tiroirRetour')}"><span aria-hidden="true">←</span></button>
      <div>
        <h2 id="tiroir-titre" class="emp-tiroir__titre" tabindex="-1" data-tiroir-titre data-panier="${c.s('emporter.panierTitre')}" data-retrait="${c.s('emporter.retraitTitre')}" data-coordonnees="${c.s('emporter.coordonnees')}" data-merci="${c.s('emporter.tiroirMerciTitre')}">${c.t('emporter.panierTitre')}</h2>
        <p class="emp-tiroir__nombre" data-tiroir-nombre></p>
      </div>
      <button type="button" class="emp-tiroir__fermer" data-tiroir-fermer autofocus aria-label="${c.s('emporter.tiroirFermer')}"><span aria-hidden="true">×</span></button>
    </div>
    <ol class="emp-tiroir__fil" aria-label="${c.s('emporter.tiroirEtapes')}">
      <li data-fil="panier"><span>1</span>${c.t('emporter.tiroirFilCommande')}</li>
      <li data-fil="retrait"><span>2</span>${c.t('emporter.tiroirFilRetrait')}</li>
      <li data-fil="coordonnees"><span>3</span>${c.t('emporter.tiroirFilCoordonnees')}</li>
    </ol>
    <p class="emp-tiroir__ajoute" data-tiroir-ajoute role="status" hidden></p>
    <div class="emp-tiroir__defile" data-defilable>
      <div class="emp-tiroir__vue" data-vue="panier">
        <ul class="emp-tiroir__lignes" data-tiroir-lignes></ul>
        <p class="emp-tiroir__vide" data-tiroir-vide hidden>${c.t('emporter.panierVide')}</p>
      </div>
      <div class="emp-tiroir__vue" data-vue="formulaire" data-tiroir-form></div>
    </div>
    <div class="emp-tiroir__pied">
      <p class="emp-tiroir__total"><span>${c.t('emporter.total')}</span><strong data-tiroir-total>0 €</strong></p>
      <p class="emp-tiroir__retrait" data-tiroir-retrait data-defaut="${c.s('emporter.tiroirRetrait', { debut: jourLong(E.debut), fin: jourLong(E.fin) })}">${c.s('emporter.tiroirRetrait', { debut: jourLong(E.debut), fin: jourLong(E.fin) })}</p>
      <a class="bouton emp-tiroir__valider" href="#commande" data-tiroir-valider data-pied="panier" data-sans-transition>${c.t('emporter.tiroirValider')}</a>
      <button type="button" class="bouton emp-tiroir__valider" data-tiroir-suite data-pied="retrait">${c.t('emporter.tiroirSuite')}</button>
      <button type="submit" form="emp-commande-form" class="bouton emp-tiroir__valider" data-pied="coordonnees">${c.t('emporter.valider')}</button>
      <button type="button" class="emp-tiroir__continuer" data-tiroir-fermer data-pied="panier merci">${c.t('emporter.tiroirContinuer')}</button>
    </div>
  </div>
</dialog>
<p class="visuellement-cache" aria-live="polite" data-emp-annonce></p>
<script type="application/json" data-emp-textes>${brut(JSON.stringify(textes).replace(/</g, '\\u003c'))}</script>
`;
};
