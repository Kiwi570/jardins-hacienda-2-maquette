#!/usr/bin/env python3
"""Détoure les plats du Traiteur (images Grok sur fond blanc uni) pour les poser sous les cloches.

Usage, depuis la racine du projet :
  python3 outils/detourer-plats.py recu/traiteur-plats/traiteur-escargots-2.jpg escargots [--apercu]

- Fond : les pixels presque blancs reliés au bord de l'image, affinés par GrabCut (OpenCV) ; bord adouci, couleurs
  « dé-blanchies » sur la frange (le halo blanc disparaît sur le fond sombre de la vitrine).
- Recadre au plus près du plat, puis écrit assets/images/grok/traiteur/<id>-480.webp et -800.webp (avec transparence).
- --apercu : écrit aussi _suivi/detourage-<id>.jpg (le plat sur fond sombre et sur damier) pour contrôle.
"""
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage

RACINE = Path(__file__).resolve().parent.parent
LARGEURS = [480, 800]


def detourer(chemin):
    rgb = np.asarray(Image.open(chemin).convert('RGB')).astype(np.int16)
    h, w, _ = rgb.shape
    ecart = (255 - rgb.min(axis=2))                          # 0 = blanc pur
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    presque_blanc = (ecart < 26) & (sat < 22)
    # fond = presque blanc relié au bord
    etiquettes, _ = ndimage.label(presque_blanc)
    bord = np.unique(np.concatenate([etiquettes[0], etiquettes[-1], etiquettes[:, 0], etiquettes[:, -1]]))
    fond = np.isin(etiquettes, bord[bord > 0])
    # GrabCut : fond sûr au bord, fond probable = fond blanc, plat probable = le reste
    masque = np.where(fond, cv2.GC_PR_BGD, cv2.GC_PR_FGD).astype(np.uint8)
    m = max(4, min(h, w) // 60)
    masque[:m], masque[-m:], masque[:, :m], masque[:, -m:] = cv2.GC_BGD, cv2.GC_BGD, cv2.GC_BGD, cv2.GC_BGD
    coeur = ndimage.binary_erosion(~fond, iterations=6)
    masque[coeur] = cv2.GC_FGD
    bgr = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2BGR)
    bg, fg = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(bgr, masque, None, bg, fg, 4, cv2.GC_INIT_WITH_MASK)
    plat = np.isin(masque, (cv2.GC_FGD, cv2.GC_PR_FGD))
    # garder le plus grand ensemble (et ce qui le touche), boucher les trous
    lab, n = ndimage.label(plat)
    if n > 1:
        tailles = ndimage.sum(plat, lab, range(1, n + 1))
        garde = np.zeros(n + 1, bool); garde[1:] = tailles >= tailles.max() * 0.02
        plat = garde[lab]
    plat = ndimage.binary_fill_holes(plat)
    # bord adouci : alpha progressif sur une frange de 2 px, selon l'écart au blanc
    alpha = plat.astype(np.float32)
    frange = plat & ~ndimage.binary_erosion(plat, iterations=2)
    alpha[frange] = np.clip(ecart[frange] / 60.0, 0.25, 1.0)
    alpha = cv2.GaussianBlur(alpha, (0, 0), 0.7) * plat.astype(np.float32) + cv2.GaussianBlur(alpha, (0, 0), 0.7) * (~plat) * 0.6
    alpha = np.clip(alpha, 0, 1)
    # dé-blanchir la frange : c = (c - (1 - a) * 255) / a
    a3 = np.maximum(alpha[..., None], 1e-3)
    couleur = np.clip((rgb - (1 - a3) * 255) / a3, 0, 255)
    couleur = np.where(alpha[..., None] > 0.98, rgb, couleur)
    # ombre portée : le gris neutre et clair qui touche le fond devient une ombre douce et transparente
    neutre = plat & (sat < 16) & (rgb.min(axis=2) > 110)
    lab, n = ndimage.label(neutre)
    if n:
        voisin_fond = ndimage.binary_dilation(~plat, iterations=2)
        touche = np.unique(lab[voisin_fond & neutre])
        ombre = np.isin(lab, touche[touche > 0])
        clair = rgb[..., :3].mean(axis=2)
        a_ombre = np.clip((255 - clair) / 255 * 1.4, 0, 0.5)
        alpha = np.where(ombre, a_ombre, alpha)
        couleur = np.where(ombre[..., None], np.array([46, 30, 20]), couleur)
        alpha = cv2.GaussianBlur(alpha.astype(np.float32), (0, 0), 0.6)
    rgba = np.dstack([couleur, alpha * 255]).astype(np.uint8)
    img = Image.fromarray(rgba, 'RGBA')
    boite = img.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    marge = 6
    if boite:
        img = img.crop((max(0, boite[0] - marge), max(0, boite[1] - marge), min(w, boite[2] + marge), min(h, boite[3] + marge)))
    return img


def main():
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(1)
    source, ident = Path(sys.argv[1]), sys.argv[2]
    img = detourer(source)
    dossier = RACINE / 'assets/images/grok/traiteur'
    dossier.mkdir(parents=True, exist_ok=True)
    for L in LARGEURS:
        im = img if img.width <= L else img.resize((L, round(img.height * L / img.width)), Image.LANCZOS)
        im.save(dossier / f'{ident}-{L}.webp', 'WEBP', quality=86, method=6)
    print(f'{ident} : {img.width} x {img.height} → assets/images/grok/traiteur/{ident}-{{480,800}}.webp')
    if '--apercu' in sys.argv:
        W = img.width
        fond = Image.new('RGB', (W * 2 + 30, img.height + 20), (27, 18, 13))
        damier = Image.new('RGB', (W, img.height), (255, 255, 255))
        for y in range(0, img.height, 16):
            for x in range(0, W, 16):
                if (x // 16 + y // 16) % 2: damier.paste((205, 205, 205), (x, y, x + 16, y + 16))
        damier.paste(img, (0, 0), img)
        fond.paste(img, (10, 10), img); fond.paste(damier, (W + 20, 10))
        (RACINE / '_suivi').mkdir(exist_ok=True)
        fond.save(RACINE / f'_suivi/detourage-{ident}.jpg', quality=85)


if __name__ == '__main__':
    main()
