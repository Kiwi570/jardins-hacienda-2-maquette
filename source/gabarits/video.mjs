/* Boucles vidéo (Grok Imagine) posées dans une figure .media : seulement si le fichier existe dans assets/videos/.
   La vidéo ne se charge qu'à l'écran, hors mode calme, hors économie de données et hors téléphone en portrait
   (site.js) ; l'image de la figure reste dessous (première image identique), avec un bouton pause discret.
   position : cadrage de la vidéo quand l'image a été recadrée autrement ; masque : classe qui ne garde de la vidéo
   que ce qui bouge (vapeur, flamme de bougie), l'image nette reste visible partout ailleurs. */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { brut, texteBrut } from '../../outils/gabarit.mjs';

const racine = join(new URL('.', import.meta.url).pathname, '../..');
export const videoExiste = (nom) => existsSync(join(racine, 'assets/videos', `${nom}.mp4`));

export function avecVideo(media, nom, { libellePause = 'Mettre la vidéo en pause', libelleLecture = 'Relancer la vidéo', position = '', masque = '' } = {}) {
  const h = texteBrut(media);
  if (!nom || !videoExiste(nom)) return media;
  const v = `<video class="media-video${masque ? ` media-video--${masque}` : ''}"${position ? ` style="object-position:${position}"` : ''} data-src="/assets/videos/${nom}.mp4" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video><button type="button" class="video-pause" data-video-pause data-pause-pour="" aria-pressed="false" data-libelle-pause="${libellePause}" data-libelle-lecture="${libelleLecture}" aria-label="${libellePause}"><span aria-hidden="true">❙❙</span></button>`;
  return brut(h.replace('</picture>', `</picture>${v}`));
}
