import csv
from interprete import interpretar_busca

ARQUIVO_CSV = "data/loja.csv"

def ler_produtos():
    """Lê os produtos do arquivo CSV."""
    with open(ARQUIVO_CSV, newline='', encoding='utf-8') as f:
        return list(csv.DictReader(f))

def escrever_produtos(produtos):
    """Escreve a lista de produtos no CSV."""
    with open(ARQUIVO_CSV, 'w', newline='', encoding='utf-8') as f:
        campos = produtos[0].keys() if produtos else ["id", "tipo", "cor", "tamanho", "preco", "estacao", "imagem", "genero", "estoque", "vendas"]
        writer = csv.DictWriter(f, fieldnames=campos)
        writer.writeheader()
        writer.writerows(produtos)

def gerar_novo_id(produtos):
    """Gera o próximo ID disponível."""
    if not produtos:
        return 1
    return max(int(p["id"]) for p in produtos) + 1

def adicionar_produto(tipo, cor, tamanho, preco, imagem, quantidade):
    produtos = ler_produtos()
    novo_produto = {
        "id": gerar_novo_id(produtos),
        "tipo": tipo,
        "cor": cor,
        "tamanho": tamanho,
        "preco": preco,
        "estacao": "N/A",
        "imagem": imagem,
        "genero": "Unissex",
        "estoque": quantidade,
        "vendas": 0
    }
    produtos.append(novo_produto)
    escrever_produtos(produtos)
    print(f"✅ Produto '{tipo} {cor} {tamanho}' adicionado com sucesso!")

def listar_produtos():
    produtos = ler_produtos()
    produtos_disponiveis = [p for p in produtos if int(p["estoque"]) > 0]

    if not produtos_disponiveis:
        return "😞 Nenhum produto disponível no momento."

    resposta = "👕 Produtos disponíveis:\n"
    for p in produtos_disponiveis:
        resposta += f"\n🛍 ID: {p['id']} - {p['tipo']} - {p['cor']}, Tamanho {p['tamanho']}\n💲 Preço: R$ {float(p['preco']):.2f}\n📸 Imagem: {p['imagem']}\n📦 Estoque: {p['estoque']}\n"
    return resposta

def buscar_produto(input_usuario):
    filtros_info = interpretar_busca(input_usuario)
    if not isinstance(filtros_info, dict):
        return "❌ Erro: a interpretação da busca falhou. Nenhum filtro válido encontrado."

    tipo = filtros_info.get("tipo")
    cor = filtros_info.get("cor")
    tamanho = filtros_info.get("tamanho")

    produtos = ler_produtos()
    resultados = []

    for p in produtos:
        if int(p["estoque"]) <= 0:
            continue
        if tipo and tipo.lower() not in p["tipo"].lower():
            continue
        if cor and cor.lower() not in p["cor"].lower():
            continue
        if tamanho and tamanho.upper() != p["tamanho"].upper():
            continue
        resultados.append(p)

    if not resultados:
        return "🔍 Nenhum produto encontrado com os filtros aplicados."

    resposta = "🔍 Resultados encontrados:\n"
    for p in resultados:
        resposta += f"\n🛍 ID: {p['id']} - {p['tipo']} - {p['cor']}, Tamanho {p['tamanho']}\n💲 Preço: R$ {float(p['preco']):.2f}\n📸 Imagem: {p['imagem']}\n📦 Estoque: {p['estoque']}\n"
    return resposta

