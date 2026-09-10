#!/usr/bin/env python3
"""
Gera a geometria do mapa do site, num espaco de coordenadas unico.

    python3 scripts/gerar-mapa.py

Por que um espaco so: o mapa da pagina faz uma viagem continua, do Brasil
inteiro ate a rua da pousada, movendo uma camera. Se cada etapa tivesse a sua
propria projecao, a camera precisaria de um corte entre elas, e corte e
justamente o que tira a graca do movimento.

Fontes:
  Brasil, malha por unidade da federacao   IBGE, API de malhas v3
  Santa Catarina e municipios              malha IBGE 2024, ja projetada no
                                           projeto da SPS, aqui reprojetada

Saida: site/src/data/mapa-sc.js
"""

from pathlib import Path
import json
import math
import re
import subprocess
import sys

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / 'site' / 'src' / 'data' / 'mapa-sc.js'
SC_ORIGEM = Path('/Users/leonardofranco/Library/Mobile Documents/com~apple~CloudDocs/Claude/SPS/site/js/map-data.js')

IBGE = ('https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR'
        '?formato=application/vnd.geo+json&intrarregiao=UF&qualidade=intermediaria')

VB_W, VB_H = 1000, 640
MARGEM = 26          # respiro entre o Brasil e a borda do viewBox
CASAS = 2            # casas decimais das coordenadas geradas

# Tolerancia de simplificacao, em unidades do viewBox, por camada.
# A conta e sempre a mesma: qual e o menor detalhe que ainda aparece no zoom
# em que a camada e vista. Guardar detalhe abaixo disso e peso morto.
#   Brasil     visto em z=1, 1 unidade vale cerca de 1px
#   municipios vistos em z=6 e z=47
#   Itapema    e o assunto do zoom maximo, entao quase nao simplifica
TOLERANCIA = {'brasil': 1.2, 'muni': 0.12, 'itapema': 0.01}

# Projecao com que a malha de SC foi salva no projeto da SPS. Serve so para
# desfazer: daqui as coordenadas voltam a ser latitude e longitude.
SC_AX, SC_BX = 162.340287, 8796.882037
SC_AY, SC_BY = -9312.759979, -4364.821223


def merc(lat):
    """Mercator no eixo y, em radianos."""
    return math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))


def merc_x(lng):
    """Mercator no eixo x, em radianos.

    Precisa ser radiano igual ao y. Misturar grau no x com radiano no y
    esmaga o mapa numa faixa horizontal, porque um radiano vale 57,3 graus e
    a mesma escala aplicada aos dois achata um eixo na proporcao disso.
    """
    return math.radians(lng)


def desmerc(y):
    return math.degrees(2 * math.atan(math.exp(y)) - math.pi / 2)


def sc_para_geo(x, y):
    """Desfaz a projecao antiga: ponto do mapa da SPS vira latitude e longitude."""
    lng = (x - SC_BX) / SC_AX
    lat = desmerc((y - SC_BY) / SC_AY)
    return lat, lng


def baixar_brasil():
    destino = RAIZ / 'assets-raw' / 'brasil-uf.json'
    if destino.exists():
        print(f'  reaproveitando {destino.name}')
        return json.loads(destino.read_text())
    destino.parent.mkdir(parents=True, exist_ok=True)
    print('  baixando a malha do IBGE...')
    bruto = subprocess.run(['curl', '-s', '-m', '90', IBGE], capture_output=True, text=True).stdout
    if not bruto.strip().startswith('{'):
        sys.exit('O IBGE nao devolveu GeoJSON. Rode de novo com internet.')
    destino.write_text(bruto)
    return json.loads(bruto)


def simplificar(pontos, tol):
    """Ramer-Douglas-Peucker. Tira vertice que nao muda a silhueta."""
    if len(pontos) < 3:
        return pontos

    def distancia(p, a, b):
        (px, py), (ax, ay), (bx, by) = p, a, b
        dx, dy = bx - ax, by - ay
        if dx == 0 and dy == 0:
            return math.hypot(px - ax, py - ay)
        t = max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
        return math.hypot(px - (ax + t * dx), py - (ay + t * dy))

    # Iterativo de proposito: um contorno de milhares de pontos estoura a
    # pilha na versao recursiva.
    manter = [False] * len(pontos)
    manter[0] = manter[-1] = True
    pilha = [(0, len(pontos) - 1)]
    while pilha:
        ini, fim = pilha.pop()
        pior, indice = 0.0, -1
        for i in range(ini + 1, fim):
            d = distancia(pontos[i], pontos[ini], pontos[fim])
            if d > pior:
                pior, indice = d, i
        if pior > tol:
            manter[indice] = True
            pilha.append((ini, indice))
            pilha.append((indice, fim))
    return [p for p, k in zip(pontos, manter) if k]


def aneis(geometria):
    """Achata Polygon e MultiPolygon numa lista de aneis de coordenadas."""
    tipo, coords = geometria['type'], geometria['coordinates']
    if tipo == 'Polygon':
        return coords
    if tipo == 'MultiPolygon':
        return [anel for poligono in coords for anel in poligono]
    return []


def main():
    print('Brasil')
    brasil = baixar_brasil()

    # 1. Limites geograficos do pais, para calibrar a projecao.
    xs, ys = [], []
    for f in brasil['features']:
        for anel in aneis(f['geometry']):
            for lng, lat in anel:
                xs.append(merc_x(lng))
                ys.append(merc(lat))

    mx0, mx1 = min(xs), max(xs)
    m0, m1 = min(ys), max(ys)

    # Uma escala so para os dois eixos: Mercator so preserva forma se x e y
    # forem esticados igual, e os dois ja estao em radiano.
    escala = min((VB_W - 2 * MARGEM) / (mx1 - mx0), (VB_H - 2 * MARGEM) / (m1 - m0))
    cx = (VB_W - (mx1 - mx0) * escala) / 2
    cy = (VB_H - (m1 - m0) * escala) / 2

    def projetar(lat, lng):
        return (cx + (merc_x(lng) - mx0) * escala,
                cy + (m1 - merc(lat)) * escala)

    def caminho(anel, tol):
        pontos = simplificar([projetar(lat, lng) for lng, lat in anel], tol)
        if len(pontos) < 3:
            return ''
        partes = [f'{"M" if i == 0 else "L"}{x:.{CASAS}f} {y:.{CASAS}f}' for i, (x, y) in enumerate(pontos)]
        return ''.join(partes) + 'Z'

    estados = ''.join(
        caminho(anel, TOLERANCIA['brasil'])
        for f in brasil['features'] for anel in aneis(f['geometry'])
    )
    print(f'  {len(brasil["features"])} unidades da federacao, {len(estados)/1024:.0f} KB')

    # 2. Santa Catarina: desfaz a projecao antiga e refaz na nova.
    print('Santa Catarina')
    if not SC_ORIGEM.exists():
        sys.exit(f'Malha de SC nao encontrada em {SC_ORIGEM}')
    bruto = SC_ORIGEM.read_text()
    dados = json.loads(bruto[bruto.index('{'):].rsplit(';', 1)[0].strip())

    def reprojetar(d, tol):
        """Quebra em sub-caminhos, reprojeta ponto a ponto e simplifica cada um."""
        saida = []
        for trecho in re.findall(r'M[^M]*', d):
            fecha = 'Z' in trecho
            pontos = []
            for x, y in re.findall(r'[ML](-?[\d.]+)\s+(-?[\d.]+)', trecho):
                lat, lng = sc_para_geo(float(x), float(y))
                pontos.append(projetar(lat, lng))
            pontos = simplificar(pontos, tol)
            if len(pontos) < 2:
                continue
            saida.append(''.join(
                f'{"M" if i == 0 else "L"}{x:.{CASAS}f} {y:.{CASAS}f}' for i, (x, y) in enumerate(pontos)
            ) + ('Z' if fecha else ''))
        return ''.join(saida)

    sc_estado = reprojetar(dados['state'], TOLERANCIA['muni'])
    sc_muni = reprojetar(dados['muni'], TOLERANCIA['muni'])
    sc_itapema = reprojetar(dados['hl']['Itapema'], TOLERANCIA['itapema'])
    print(f'  contorno {len(sc_estado)/1024:.0f} KB, municipios {len(sc_muni)/1024:.0f} KB')

    # 3. Enquadramentos, calculados a partir da propria geometria.
    def caixa(d):
        nums = [float(n) for n in re.findall(r'-?\d+\.?\d*', d)]
        xs, ys = nums[0::2], nums[1::2]
        return min(xs), min(ys), max(xs), max(ys)

    sx0, sy0, sx1, sy1 = caixa(sc_estado)
    ix0, iy0, ix1, iy1 = caixa(sc_itapema)

    def vista(bx0, by0, bx1, by1, folga=1.35):
        largura, altura = (bx1 - bx0) * folga, (by1 - by0) * folga
        z = min(VB_W / largura, VB_H / altura)
        return {'cx': round((bx0 + bx1) / 2, 2), 'cy': round((by0 + by1) / 2, 2), 'z': round(z, 2)}

    vistas = {
        'brasil': {'cx': VB_W / 2, 'cy': VB_H / 2, 'z': 1},
        'estado': vista(sx0, sy0, sx1, sy1),
        'cidade': vista(ix0, iy0, ix1, iy1, folga=9),
    }
    print(f'  vistas: {json.dumps(vistas)}')

    corpo = f'''/**
 * GEOMETRIA DO MAPA
 * ---------------------------------------------------------------------------
 * ARQUIVO GERADO por scripts/gerar-mapa.py. Nao edite a mao.
 *
 * Brasil e Santa Catarina no MESMO espaco de coordenadas, viewBox {VB_W}x{VB_H},
 * projecao Mercator com a mesma escala nos dois eixos. E isso que permite a
 * camera viajar do pais ate a rua da pousada sem corte.
 *
 * Fontes: malha do IBGE por unidade da federacao para o pais, malha municipal
 * do IBGE 2024 para Santa Catarina.
 *
 * Conversao de coordenada para o mapa, usada por projetar() em mapa.js:
 *   x = {cx:.6f} + (radianos(longitude) - ({mx0:.6f})) * {escala:.6f}
 *   y = {cy:.6f} + ({m1:.6f} - mercY(latitude)) * {escala:.6f}
 *   onde mercY(lat) = ln(tan(PI/4 + radianos(lat)/2))
 *
 * Os dois eixos em radiano, de proposito: e o que mantem a forma. Grau no x
 * com radiano no y esmaga o mapa numa faixa horizontal.
 */

/** Parametros da projecao. Quem converte coordenada precisa deles. */
export const PROJECAO = {{
  mercMinX: {mx0:.8f},
  mercMax: {m1:.8f},
  escala: {escala:.8f},
  offsetX: {cx:.8f},
  offsetY: {cy:.8f},
  largura: {VB_W},
  altura: {VB_H},
}}

/** Enquadramentos da camera, calculados a partir da propria geometria. */
export const VISTAS = {json.dumps(vistas, indent=2).replace('"', '')}

export const MAPA = {{
  /** As 27 unidades da federacao, cada uma um caminho fechado. */
  brasil: {json.dumps(estados)},

  /** Contorno de Santa Catarina. Alimenta o traco que se desenha. */
  estado: {json.dumps(sc_estado)},

  /** Divisas municipais de Santa Catarina. */
  municipios: {json.dumps(sc_muni)},

  /** Contorno de Itapema, o municipio da pousada. */
  itapema: {json.dumps(sc_itapema)},
}}
'''
    SAIDA.write_text(corpo)
    print(f'\n{SAIDA.relative_to(RAIZ)}  {SAIDA.stat().st_size/1024:.0f} KB')


if __name__ == '__main__':
    main()
