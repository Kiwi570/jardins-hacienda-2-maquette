# Génère source/gabarits/cloches.svg : la cloche de verre (reprise de la maquette Lemoy, repère 400 x 430, assiette centrée en
# 200,352) et les plats à emporter dessinés en illustration, chacun posé au fond de l'assiette (pied vers y = 362).
import math, re

# Lancer depuis la racine du projet : python3 outils/dessiner-cloches.py
# La cloche (assiette, ombre, bord arrière, verre) vient de la maquette Lemoy : source/gabarits/cloche-verre.svg.
import os, sys
RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
lemoy = open(os.path.join(RACINE, 'source/gabarits/cloche-verre.svg')).read()

def f(x):
    return f'{x:.1f}'.rstrip('0').rstrip('.')

defs = '''<defs>
<radialGradient id="pl-coquille" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#e3ad6c"/><stop offset=".5" stop-color="#a8692f"/><stop offset="1" stop-color="#5c3417"/></radialGradient>
<linearGradient id="pl-creme" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf4dc"/><stop offset="1" stop-color="#ddd09f"/></linearGradient>
<linearGradient id="pl-pate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7d48c"/><stop offset=".55" stop-color="#e0a04a"/><stop offset="1" stop-color="#b8702a"/></linearGradient>
<radialGradient id="pl-pate-dome" cx=".42" cy=".3" r=".8"><stop offset="0" stop-color="#fbe2a4"/><stop offset=".45" stop-color="#eab35c"/><stop offset="1" stop-color="#bf7a30"/></radialGradient>
<linearGradient id="pl-pate-cote" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a9611f"/><stop offset=".3" stop-color="#d99a4a"/><stop offset=".7" stop-color="#cf8a3a"/><stop offset="1" stop-color="#8f4f17"/></linearGradient>
<linearGradient id="pl-viande" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d79a86"/><stop offset="1" stop-color="#b56f5e"/></linearGradient>
<linearGradient id="pl-foie" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6dcc0"/><stop offset=".6" stop-color="#ecc29c"/><stop offset="1" stop-color="#dba981"/></linearGradient>
<linearGradient id="pl-brioche" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8dca0"/><stop offset="1" stop-color="#e7b56a"/></linearGradient>
<linearGradient id="pl-saumon" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff9e6e"/><stop offset=".5" stop-color="#f7814f"/><stop offset="1" stop-color="#e86638"/></linearGradient>
<radialGradient id="pl-boeuf" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#e6787c"/><stop offset=".6" stop-color="#cc4f57"/><stop offset="1" stop-color="#9e3240"/></radialGradient>
<radialGradient id="pl-thon" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#d9405a"/><stop offset=".65" stop-color="#b3213d"/><stop offset="1" stop-color="#871530"/></radialGradient>
<radialGradient id="pl-citron" cx=".5" cy=".5" r=".55"><stop offset="0" stop-color="#fff3b0"/><stop offset=".75" stop-color="#f6d64e"/><stop offset="1" stop-color="#e3b62a"/></radialGradient>
<filter id="pl-flou" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="pl-flou-l" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.2"/></filter>
</defs>'''

def ombre(cx, cy, rx, ry, op=.32):
    return f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(rx)}" ry="{f(ry)}" fill="#3a2414" opacity="{op}" filter="url(#pl-flou)"/>'

# ---------- Escargots : cinq coquilles, l'ouverture pleine de crème d'ail persillée tournée vers nous.
def spirale(cx, cy, r0, r1, tours, ky=.82, pas=60):
    pts = []
    for i in range(pas + 1):
        t = i / pas
        ang = -math.pi / 2 + 2 * math.pi * tours * t
        r = r1 + (r0 - r1) * t
        pts.append((cx + r * math.cos(ang), cy + r * ky * math.sin(ang)))
    return 'M' + 'L'.join(f'{f(x)} {f(y)}' for x, y in pts)

def coquille(x, y, s=1, sens=1):
    t = f'translate({f(x)} {f(y)}) scale({f(s*sens)} {f(s)})'
    sp = spirale(-5, -6, 2, 25, 2.2)
    return f'''<g transform="{t}">
<path d="M-31 8C-36-12-20-31 2-30C22-29 33-14 31 3C29 15 17 21 1 21C-15 21-29 17-31 8Z" fill="url(#pl-coquille)"/>
<path d="{sp}" fill="none" stroke="#4a2a12" stroke-opacity=".6" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="{sp}" fill="none" stroke="#f7d6a2" stroke-opacity=".55" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" transform="translate(-1.6 -1.8)"/>
<ellipse cx="-12" cy="-18" rx="9" ry="3.6" fill="#fff" fill-opacity=".4" transform="rotate(-22 -12 -18)"/>
<ellipse cx="17" cy="11" rx="16.5" ry="9.5" fill="#6e3f1b"/>
<ellipse cx="17" cy="10" rx="14" ry="7.6" fill="url(#pl-creme)"/>
<path d="M7 9c3-3 6 1 9-2s7 1 10-1" fill="none" stroke="#5d8a37" stroke-width="2.4" stroke-linecap="round"/>
<circle cx="12" cy="12" r="1.4" fill="#4e7a2e"/><circle cx="22" cy="7" r="1.2" fill="#4e7a2e"/><circle cx="25" cy="12" r="1.1" fill="#6c9a43"/>
<ellipse cx="13" cy="7" rx="4" ry="1.6" fill="#fff" fill-opacity=".7"/>
</g>'''

def persil(x, y, s=1, r=0):
    return f'''<g transform="translate({f(x)} {f(y)}) rotate({r}) scale({f(s)})">
<path d="M0 0C6-6 12-8 20-8" fill="none" stroke="#4f7a2c" stroke-width="2" stroke-linecap="round"/>
<path d="M18-8c4-6 10-6 12-1c4-1 7 3 4 6c3 3-1 7-5 5c-2 4-8 3-8-1c-5 0-7-6-3-9z" fill="#5f9236"/>
<path d="M8-5c1-6 7-8 10-4c3-3 8 0 6 4c2 3-2 6-5 4c-2 3-7 2-7-1c-4 0-6-3-4-3z" fill="#6ea543"/>
<path d="M22-6l6 1M12-3l5 0" stroke="#3f6a24" stroke-width="1" stroke-linecap="round"/>
</g>'''

escargots = ombre(200, 362, 118, 18) + coquille(158, 322, .92, 1) + coquille(244, 320, .92, -1) + coquille(128, 348, 1, 1) + coquille(272, 348, 1, -1) + coquille(200, 356, 1.06, 1) + persil(286, 372, .9, -12) + persil(96, 366, .8, 190)

# ---------- Tourtes : la tourte dorée, bord festonné, cheminée au centre ; décor selon la tourte.
def tourte(decor):
    cx, top, rx, ry, h = 200, 316, 96, 27, 38
    side = f'M{cx-rx} {top}L{cx-rx} {top+h}A{rx} {ry} 0 0 0 {cx+rx} {top+h}L{cx+rx} {top}Z'
    dome = f'M{cx-rx} {top}C{cx-rx+4} {top-34} {cx-48} {top-50} {cx} {top-50}C{cx+48} {top-50} {cx+rx-4} {top-34} {cx+rx} {top}A{rx} {ry} 0 0 1 {cx-rx} {top}Z'
    out = ombre(200, 360, 112, 17) + f'<path d="{side}" fill="url(#pl-pate-cote)"/>'
    # feuilletage du flanc
    for k, o in enumerate((.45, .3, .38)):
        yy = top + 10 + k * 9
        out += f'<path d="M{cx-rx+1} {yy}A{rx-1} {ry} 0 0 0 {cx+rx-1} {yy}" fill="none" stroke="#f3c47e" stroke-opacity="{o}" stroke-width="1.6"/>'
    out += f'<path d="{dome}" fill="url(#pl-pate-dome)"/>'
    # bord festonné (coups de fourchette)
    n = 30
    for i in range(n + 1):
        a = math.pi * i / n
        x = cx - rx * math.cos(a) * .985
        y = top + ry * math.sin(a) * .985
        out += f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="5.2" ry="3.6" fill="#d38c3c" stroke="#a65f1f" stroke-opacity=".5" stroke-width=".8"/>'
    if decor == 'rosace':
        for i in range(10):
            a = -math.pi + math.pi * 2 * i / 10
            x1, y1 = cx + 14 * math.cos(a), top - 26 + 6 * math.sin(a)
            x2, y2 = cx + 82 * math.cos(a + .35), top - 8 + 22 * math.sin(a + .35)
            mx, my = cx + 52 * math.cos(a + .05), top - 20 + 15 * math.sin(a + .05)
            if y2 > top + 14: continue
            out += f'<path d="M{f(x1)} {f(y1)}Q{f(mx)} {f(my)} {f(x2)} {f(y2)}" fill="none" stroke="#b16a26" stroke-opacity=".55" stroke-width="1.8" stroke-linecap="round"/>'
            out += f'<path d="M{f(x1)} {f(y1-1.5)}Q{f(mx)} {f(my-1.5)} {f(x2)} {f(y2-1.5)}" fill="none" stroke="#ffe7b0" stroke-opacity=".45" stroke-width="1" stroke-linecap="round"/>'
    else:
        clip = f'<clipPath id="pl-dessus-{decor}"><path d="{dome}"/></clipPath>'
        out += clip + f'<g clip-path="url(#pl-dessus-{decor})">'
        for i in range(-5, 6):
            x = cx + i * 22
            out += f'<path d="M{x-46} {top+24}L{x+46} {top-56}" stroke="#b26c28" stroke-opacity=".5" stroke-width="9"/><path d="M{x-46} {top+24}L{x+46} {top-56}" stroke="#f2c57a" stroke-width="6.5"/>'
        for i in range(-5, 6):
            x = cx + i * 22
            out += f'<path d="M{x+46} {top+24}L{x-46} {top-56}" stroke="#b26c28" stroke-opacity=".5" stroke-width="9"/><path d="M{x+46} {top+24}L{x-46} {top-56}" stroke="#f6cf88" stroke-width="6.5"/>'
        out += '</g>'
    # cheminée et brillant de la dorure
    out += f'<ellipse cx="{cx}" cy="{top-30}" rx="9" ry="4.4" fill="#f7d79a"/><ellipse cx="{cx}" cy="{top-30}" rx="6" ry="2.8" fill="#6d3a12"/>'
    out += f'<ellipse cx="{cx-34}" cy="{top-30}" rx="30" ry="7" fill="#fff" opacity=".28" filter="url(#pl-flou-l)" transform="rotate(-8 {cx-34} {top-30})"/>'
    if decor == 'rosace':
        # petit escargot en pâte posé près de la cheminée
        out += f'''<g transform="translate({cx+30} {top-22}) scale(1.05)"><path d="M-14 6C-10 8 6 8 16 5C20 4 22 1 19 0" fill="#e9b15d" stroke="#a9651f" stroke-opacity=".6" stroke-width="1"/>
<circle cx="0" cy="-2" r="9" fill="#f0c071" stroke="#a9651f" stroke-opacity=".6" stroke-width="1"/><path d="M5-2a5 5 0 1 1-5-5a3 3 0 1 1 3 3" fill="none" stroke="#9c5a1c" stroke-width="1.3" stroke-linecap="round"/>
<path d="M17 1l3-6M19 2l5-4" stroke="#a9651f" stroke-width="1.2" stroke-linecap="round"/></g>'''
    else:
        out += persil(256, 356, .75, -8) + persil(140, 362, .7, 200)
        for (x, y) in ((118, 352), (132, 360), (268, 362), (284, 354), (300, 346), (104, 344)):
            out += f'<circle cx="{x}" cy="{y}" r="1.6" fill="#5f9236"/>'
    return out

# ---------- Pâté lorrain : le pâté feuilleté, l'entame montre la farce.
def pate_lorrain():
    out = ombre(200, 362, 124, 18)
    A, B = (92, 330), (246, 330)
    dx, dy, h = 56, -34, 50
    C, D = (B[0] + dx, B[1] + dy), (A[0] + dx, A[1] + dy)
    dessus = f'M{A[0]} {A[1]}C{A[0]-6} {A[1]-8} {D[0]-12} {D[1]+4} {D[0]} {D[1]}L{C[0]} {C[1]}C{C[0]+8} {C[1]+2} {B[0]+8} {B[1]-4} {B[0]} {B[1]}C{B[0]-50} {B[1]+5} {A[0]+50} {A[1]+5} {A[0]} {A[1]}Z'
    face = f'M{A[0]} {A[1]}C{A[0]+50} {A[1]+5} {B[0]-50} {B[1]+5} {B[0]} {B[1]}L{B[0]} {B[1]+h-4}C{B[0]-50} {B[1]+h+4} {A[0]+50} {A[1]+h+4} {A[0]} {A[1]+h-4}C{A[0]-5} {A[1]+h-18} {A[0]-5} {A[1]+14} {A[0]} {A[1]}Z'
    out += f'<path d="{face}" fill="url(#pl-pate)"/>'
    for k in range(5):
        y = A[1] + 10 + k * 8
        out += f'<path d="M{A[0]+2} {y}C{A[0]+60} {y+5} {B[0]-60} {y+5} {B[0]-2} {y}" fill="none" stroke="{"#fde6b4" if k % 2 == 0 else "#b8702a"}" stroke-opacity="{.55 if k % 2 == 0 else .3}" stroke-width="1.3"/>'
    cut = f'M{B[0]} {B[1]}L{C[0]} {C[1]}L{C[0]} {C[1]+h-6}L{B[0]} {B[1]+h-4}Z'
    inner = f'M{B[0]+6} {B[1]+2}L{C[0]-5} {C[1]+7}L{C[0]-5} {C[1]+h-14}L{B[0]+6} {B[1]+h-11}Z'
    out += f'<path d="{cut}" fill="#e5ad5e"/><path d="{inner}" fill="url(#pl-viande)"/>'
    for (x, y, r) in ((B[0]+14, B[1]+10, 2.6), (B[0]+26, B[1]+0, 2), (B[0]+38, B[1]+8, 2.4), (B[0]+18, B[1]+26, 2.2), (B[0]+34, B[1]-10, 1.8), (B[0]+44, B[1]+20, 1.8), (B[0]+28, B[1]+18, 1.5)):
        out += f'<circle cx="{x}" cy="{y}" r="{r}" fill="#8a4436" opacity=".55"/>'
    for (x, y) in ((B[0]+10, B[1]+20), (B[0]+30, B[1]+8), (B[0]+24, B[1]+32), (B[0]+44, B[1]+2)):
        out += f'<circle cx="{x}" cy="{y}" r="1.5" fill="#f6e2d6" opacity=".85"/>'
    out += f'<path d="{dessus}" fill="url(#pl-pate-dome)"/>'
    out += f'<clipPath id="pl-dessus-pate"><path d="{dessus}"/></clipPath><g clip-path="url(#pl-dessus-pate)">'
    for i in range(-4, 14):
        x0 = A[0] + i * 18
        out += f'<path d="M{x0} {A[1]+8}L{x0+56} {A[1]-40}" stroke="#a9611f" stroke-opacity=".5" stroke-width="1.6"/>'
        out += f'<path d="M{x0} {A[1]-40}L{x0+56} {A[1]+8}" stroke="#a9611f" stroke-opacity=".35" stroke-width="1.4"/>'
    out += '</g>'
    for (x, y) in ((150, 316), (214, 308)):
        out += f'<ellipse cx="{x}" cy="{y}" rx="7" ry="3.4" fill="#6f3a12"/><ellipse cx="{x}" cy="{y-1}" rx="9.5" ry="4.8" fill="none" stroke="#fae1a6" stroke-width="1.8"/>'
    out += f'<ellipse cx="160" cy="312" rx="50" ry="7" fill="#fff" opacity=".32" filter="url(#pl-flou-l)" transform="rotate(-12 160 312)"/>'
    out += persil(300, 372, .8, -14)
    return out

# ---------- Foie gras : deux tranches de terrine, brioche toastée, chutney et fleur de sel.
def foie_gras():
    out = ombre(196, 362, 120, 18)
    def tranche(x, y, r, s=1):
        return f'''<g transform="translate({x} {y}) rotate({r}) scale({s})">
<path d="M-38 -34L-22 -46L44 -46L28 -34Z" fill="#f7e2c8"/><path d="M-36 -35L-22 -44L42 -44L28 -35Z" fill="none" stroke="#f1d27c" stroke-width="2.4"/>
<path d="M28 -34L44 -46L44 -6L28 6Z" fill="#d7a780"/>
<rect x="-38" y="-34" width="66" height="40" rx="5" fill="url(#pl-foie)"/>
<path d="M-38 -30C-38 -33 -36 -34 -33 -34L23 -34C26 -34 28 -32 28 -29" fill="none" stroke="#f3d27c" stroke-width="3"/>
<path d="M-30 -18C-18 -24 -6 -12 6 -20S22 -16 24 -22" fill="none" stroke="#c98d6a" stroke-opacity=".6" stroke-width="1.5"/>
<path d="M-32 -4C-20 -10 -10 0 4 -6S18 -2 22 -8" fill="none" stroke="#c98d6a" stroke-opacity=".45" stroke-width="1.3"/>
<ellipse cx="-16" cy="-26" rx="14" ry="2.6" fill="#fff" opacity=".4"/>
<rect x="-30" y="-44" width="2.4" height="2.4" fill="#fff" transform="rotate(30 -30 -44)"/><rect x="-12" y="-42" width="2.2" height="2.2" fill="#fff" transform="rotate(30 -12 -42)"/><rect x="8" y="-45" width="2.4" height="2.4" fill="#fff" transform="rotate(30 8 -45)"/><rect x="20" y="-40" width="2" height="2" fill="#fff" transform="rotate(30 20 -40)"/>
</g>'''
    def toast(x, y, r):
        return f'''<g transform="translate({x} {y}) rotate({r})"><rect x="-24" y="-58" width="48" height="58" rx="10" fill="#a8622a"/><rect x="-20" y="-54" width="40" height="50" rx="8" fill="url(#pl-brioche)"/>
<circle cx="-6" cy="-36" r="1.8" fill="#d39a52"/><circle cx="7" cy="-26" r="1.5" fill="#d39a52"/><circle cx="-9" cy="-16" r="1.4" fill="#d39a52"/><circle cx="6" cy="-44" r="1.3" fill="#d39a52"/>
<path d="M-18 -50L18 -50" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/></g>'''
    out += toast(262, 352, 14) + toast(286, 360, 26)
    out += tranche(176, 352, -3) + tranche(118, 364, 2, .78)
    out += '''<g transform="translate(232 370)"><ellipse cx="0" cy="2" rx="17" ry="6" fill="#3f1416" opacity=".35" filter="url(#pl-flou-l)"/><path d="M-15 0C-16 -8 -6 -11 0 -9C6 -12 16 -8 14 0C13 6 -13 7 -15 0Z" fill="#6e2427"/>
<path d="M-8 -5C-4 -8 2 -8 6 -6" fill="none" stroke="#b9545a" stroke-width="2" stroke-linecap="round"/><circle cx="4" cy="-2" r="1.5" fill="#d8a06c"/><circle cx="-5" cy="1" r="1.2" fill="#d8a06c"/></g>'''
    out += persil(84, 360, .75, 200)
    return out

# ---------- Gravlax : la rosace de saumon, l'aneth et le quartier de citron.
def gravlax():
    out = ombre(200, 362, 118, 18)
    def rose(x, y, s):
        p = '''<path d="M-30 0C-34 -20 -20 -34 -4 -30C-14 -20 -14 -8 -6 2Z" fill="url(#pl-saumon)" stroke="#ffd2bb" stroke-width="1.6"/>
<path d="M30 0C34 -20 20 -34 4 -30C14 -20 14 -8 6 2Z" fill="url(#pl-saumon)" stroke="#ffd2bb" stroke-width="1.6"/>
<path d="M-16 -22C-12 -36 12 -38 16 -22C10 -30 -10 -30 -16 -22Z" fill="#f47a49" stroke="#ffd2bb" stroke-width="1.4"/>
<path d="M-10 -20C-8 -30 8 -31 10 -21C10 -14 -10 -13 -10 -20Z" fill="#e8673a"/>
<path d="M-6 -21C-4 -26 4 -26 5 -21" fill="none" stroke="#ffe0cf" stroke-width="1.4" stroke-linecap="round"/>
<path d="M-24 4C-26 -12 -14 -20 0 -20C14 -20 26 -12 24 4C14 9 -14 9 -24 4Z" fill="url(#pl-saumon)" stroke="#ffd2bb" stroke-width="1.8"/>
<path d="M-18 -4C-8 -10 8 -10 18 -4" fill="none" stroke="#ffe7d9" stroke-opacity=".8" stroke-width="1.4"/>
<path d="M-20 3C-8 -2 8 -2 20 3" fill="none" stroke="#ffe7d9" stroke-opacity=".6" stroke-width="1.2"/>
<ellipse cx="-10" cy="-12" rx="6" ry="2" fill="#fff" opacity=".45"/>'''
        return f'<g transform="translate({x} {y}) scale({s})">{p}</g>'
    def aneth(x, y, s, r):
        g = f'<g transform="translate({x} {y}) rotate({r}) scale({s})"><path d="M0 0C4 -10 10 -18 18 -24" fill="none" stroke="#3e6b2a" stroke-width="1.6" stroke-linecap="round"/>'
        for k in range(7):
            t = k / 7
            bx, by = 18 * t + 2, -24 * t
            g += f'<path d="M{f(bx)} {f(by)}l-7 -4M{f(bx)} {f(by)}l6 -6M{f(bx)} {f(by)}l-3 -8" stroke="#5c8f3a" stroke-width="1.1" stroke-linecap="round"/>'
        return g + '</g>'
    out += rose(200, 332, 1.05) + aneth(160, 352, 1.1, -40) + rose(148, 360, 1.15) + rose(246, 360, 1.15) + aneth(228, 334, 1.05, 20) + aneth(196, 322, .9, -10)
    out += '''<g transform="translate(298 362) rotate(-14)"><path d="M-24 0A24 15 0 0 0 24 0Z" fill="#f2cf4a"/><path d="M-21 0A21 12 0 0 0 21 0Z" fill="#fffbe6"/><path d="M-18 0A18 10 0 0 0 18 0Z" fill="url(#pl-citron)"/>
<path d="M0 0L-12 7M0 0L0 10M0 0L12 7" stroke="#fff8d0" stroke-width="1.4"/><path d="M-24 0L24 0" stroke="#e8c23c" stroke-width="2"/></g>'''
    for (x, y) in ((112, 368), (126, 374), (270, 376), (104, 358), (186, 376)):
        out += f'<circle cx="{x}" cy="{y}" r="1.6" fill="#c4373f"/>'
    for (x, y) in ((118, 352), (282, 380), (176, 378)):
        out += f'<circle cx="{x}" cy="{y}" r="2.2" fill="#6d8f3a"/>'
    return out

# ---------- Tatakis : les tranches en éventail, croûte saisie et cœur rosé (bœuf) ou rubis sous les sésames (thon).
def tataki(sorte):
    out = ombre(200, 360, 118, 17)
    if sorte == 'boeuf':
        out += '<ellipse cx="204" cy="366" rx="96" ry="12" fill="#3a1c10" opacity=".55"/><ellipse cx="180" cy="362" rx="40" ry="3" fill="#fff" opacity=".18"/>'
    coeur = 'url(#pl-boeuf)' if sorte == 'boeuf' else 'url(#pl-thon)'
    croute = '#4a2618' if sorte == 'boeuf' else '#c9a46a'
    bord = '#2e170e' if sorte == 'boeuf' else '#8a6a3c'
    n = 6
    for i in reversed(range(n)):
        x = 124 + i * 30
        y = 364 - abs(i - 2.5) * 2
        r = -16 + i * 6
        w, h = (30, 46) if sorte == 'boeuf' else (34, 44)
        out += f'<g transform="translate({x} {y}) rotate({r})">'
        out += f'<rect x="{-w/2-2}" y="{-h-2}" width="{w+4}" height="{h+4}" rx="{w/2.6}" fill="{bord}" transform="translate(5 3)"/>'
        out += f'<rect x="{-w/2}" y="{-h}" width="{w}" height="{h}" rx="{w/2.8}" fill="{croute}"/>'
        out += f'<rect x="{-w/2+5}" y="{-h+5}" width="{w-10}" height="{h-10}" rx="{w/4}" fill="{coeur}"/>'
        if sorte == 'thon':
            for k in range(14):
                a = 2 * math.pi * k / 14
                sx, sy = (w/2-2.5) * math.cos(a), -h/2 + (h/2-2.5) * math.sin(a)
                out += f'<ellipse cx="{f(sx)}" cy="{f(sy)}" rx="1.6" ry="1" fill="{"#2a1d14" if k % 3 == 0 else "#fff6dc"}" transform="rotate({f(math.degrees(a))} {f(sx)} {f(sy)})"/>'
            out += f'<path d="M{-w/2+9} {-h+14}C{-4} {-h+20} 4 {-h+12} {w/2-9} {-h+18}" fill="none" stroke="#e86a80" stroke-opacity=".5" stroke-width="1.4"/>'
        else:
            out += f'<path d="M{-w/2+8} {-h+16}C-3 {-h+22} 3 {-h+14} {w/2-8} {-h+20}" fill="none" stroke="#f3a3a3" stroke-opacity=".45" stroke-width="1.3"/>'
        out += f'<ellipse cx="{-w/5}" cy="{-h+9}" rx="{w/5}" ry="2.2" fill="#fff" opacity=".35"/>'
        out += '</g>'
    # oignon nouveau et sésame
    for (x, y) in ((136, 328), (190, 324), (244, 326), (272, 330), (164, 330), (218, 322)):
        out += f'<ellipse cx="{x}" cy="{y}" rx="4" ry="2.6" fill="none" stroke="#6fae45" stroke-width="1.8"/>'
    for (x, y, r) in ((128, 336, 20), (152, 324, -30), (206, 330, 50), (256, 320, 10), (178, 326, -10), (230, 330, 70), (284, 334, 30)):
        out += f'<ellipse cx="{x}" cy="{y}" rx="2" ry="1.1" fill="#fff4d6" transform="rotate({r} {x} {y})"/>'
    return out

vapeur = '''<symbol id="pl-vapeur" viewBox="0 0 400 430" overflow="visible"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-width="5" filter="url(#pl-flou-l)">
<path class="vapeur vapeur--1" d="M170 300C160 280 182 266 172 246C162 226 184 212 176 192"/>
<path class="vapeur vapeur--2" d="M204 296C194 276 216 262 206 242C196 222 218 208 210 188"/>
<path class="vapeur vapeur--3" d="M238 302C228 282 250 268 240 248C230 228 252 214 244 194"/></g></symbol>'''

plats = {
    'escargots': escargots,
    'tourte-escargots': tourte('rosace'),
    'tourte-grenouilles': tourte('croisillons'),
    'pate-lorrain': pate_lorrain(),
    'foie-gras': foie_gras(),
    'gravlax': gravlax(),
    'tataki-boeuf': tataki('boeuf'),
    'tataki-thon': tataki('thon'),
}
symboles = ''.join(f'<symbol id="pl-{k}" viewBox="0 0 400 430" overflow="visible">{v}</symbol>' for k, v in plats.items())
sprite = f'<svg class="sprite-cloches" aria-hidden="true" focusable="false" width="0" height="0" style="position:absolute">{defs}{lemoy}{symboles}{vapeur}</svg>'
sprite = re.sub(r'>\s+<', '><', sprite)
open(os.path.join(RACINE, 'source/gabarits/cloches.svg'), 'w').write(sprite + '\n')
if '--apercu' not in sys.argv:
    sys.exit(0)

# Aperçu : chaque plat en grand, sans verre puis sous la cloche.
cases = ''.join(f'''<figure><svg viewBox="0 56 400 374"><use href="#cl-assiette" width="400" height="430"/><use href="#cl-pied" width="400" height="430"/><use href="#cl-arriere" width="400" height="430"/><use href="#pl-{k}" width="400" height="430"/></svg><svg viewBox="0 56 400 374"><use href="#cl-assiette" width="400" height="430"/><use href="#cl-pied" width="400" height="430"/><use href="#cl-arriere" width="400" height="430"/><use href="#pl-{k}" width="400" height="430"/><use href="#cl-verre" width="400" height="430"/></svg><figcaption>{k}</figcaption></figure>''' for k in plats)
open(os.path.join(RACINE, '_apercu-cloches.html'), 'w').write(f'''<!doctype html><meta charset="utf-8"><style>body{{margin:0;background:#1d130e;color:#f6efe2;font:14px sans-serif;--courbe:cubic-bezier(.22,.7,.18,1)}}main{{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:10px}}figure{{margin:0;display:grid;grid-template-columns:1fr 1fr;gap:6px}}svg{{width:100%;overflow:visible}}figcaption{{grid-column:1/-1}}</style>{sprite}<main>{cases}</main>''')
print('aperçu : _apercu-cloches.html')
