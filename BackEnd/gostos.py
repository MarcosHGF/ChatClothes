import csv
import os
from collections import Counter
from models import ler_produtos

CAMINHO_GOSTOS = "databackend/gostos.csv"
os.makedirs(os.path.dirname(CAMINHO_GOSTOS), exist_ok=True)

def ler_gostos():
    if not os.path.exists(CAMINHO_GOSTOS):
        return []
    with open(CAMINHO_GOSTOS, newline='', encoding='utf-8') as f:
        return list(csv.DictReader(f))

def escrever_gostos(lista):
    with open(CAMINHO_GOSTOS, 'w', newline='', encoding='utf-8') as f:
        campos = ["usuario_id", "caracteristicas", "compras", "carrinho"]
        writer = csv.DictWriter(f, fieldnames=campos)
        writer.writeheader()
        writer.writerows(lista)

def atualizar_gosto(usuario_id, nova_caracteristica=None, nova_compra=None, novo_carrinho=None):
    gostos = ler_gostos()
    for g in gostos:
        if g["usuario_id"] == usuario_id:
            if nova_caracteristica:
                g["caracteristicas"] += "," + nova_caracteristica
            if nova_compra:
                g["compras"] += "," + nova_compra
            if novo_carrinho:
                g["carrinho"] += "," + novo_carrinho
            escrever_gostos(gostos)
            return
    # Novo registro
    novo = {
        "usuario_id": usuario_id,
        "caracteristicas": nova_caracteristica or "",
        "compras": nova_compra or "",
        "carrinho": novo_carrinho or ""
    }
    gostos.append(novo)
    escrever_gostos(gostos)

def gerar_recomendacoes(usuario_id):
    gostos = ler_gostos()
    for g in gostos:
        if g["usuario_id"] == usuario_id:
            palavras = g["caracteristicas"].split(",")
            mais_comuns = [p.strip().lower() for p, _ in Counter(palavras).most_common(3)]
            break
    else:
        return ["Nenhuma preferência registrada ainda."]

    produtos = ler_produtos()
    recomendados = []
    for p in produtos:
        if int(p["estoque"]) <= 0:
            continue
        if any(pc in p["tipo"].lower() or pc in p["cor"].lower() for pc in mais_comuns):
            recomendados.append(p)

    if not recomendados:
        return ["Nenhum produto disponível com base nas suas preferências."]

    mensagens = []
    for p in recomendados[:3]:
        mensagens.append(f"🛍 {p['tipo'].title()} {p['cor']} (Tamanho {p['tamanho']}) - R$ {p['preco']}")
    return mensagens
