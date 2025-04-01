from database import conectar_bd
from interprete import interpretar_busca

def adicionar_produto(tipo, cor, tamanho, preco, imagem, quantidade):
    """Adiciona um produto ao banco de dados."""
    conn = conectar_bd()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO produtos (tipo, cor, tamanho, preco, imagem, quantidade)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (tipo, cor, tamanho, preco, imagem, quantidade))

    conn.commit()
    conn.close()
    print(f"✅ Produto '{tipo} {cor} {tamanho}' adicionado com sucesso!")

def listar_produtos():
    """Lista todos os produtos disponíveis."""
    conn = conectar_bd()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, tipo, cor, tamanho, preco, imagem, quantidade FROM produtos WHERE quantidade > 0")
    produtos = cursor.fetchall()
    conn.close()

    if not produtos:
        return "😞 Nenhum produto disponível no momento."

    resposta = "👕 Produtos disponíveis:\n"
    for p in produtos:
        resposta += f"\n🛍 ID: {p[0]} - {p[1]} - {p[2]}, Tamanho {p[3]}\n💲 Preço: R$ {p[4]:.2f}\n📸 Imagem: {p[5]}\n📦 Estoque: {p[6]}\n"
    return resposta

def buscar_produto(input_usuario):
    """Busca produtos no banco de dados de acordo com os filtros de busca."""
    filtros = interpretar_busca(input_usuario)
    
    if "Nenhum filtro válido encontrado" in filtros:
        return filtros

    tipo, cor, tamanho = None, None, None

    # Extrair os filtros da mensagem
    for filtro in filtros.split(", "):
        if "Tipo:" in filtro:
            tipo = filtro.split(": ")[1]
        if "Cor:" in filtro:
            cor = filtro.split(": ")[1]
        if "Tamanho:" in filtro:
            tamanho = filtro.split(": ")[1]
    
    conn = conectar_bd()
    cursor = conn.cursor()

    # Construção da consulta com base nos filtros
    query = "SELECT id, tipo, cor, tamanho, preco, imagem, quantidade FROM produtos WHERE quantidade > 0"
    params = []

    if tipo:
        query += " AND tipo LIKE ?"
        params.append(f"%{tipo}%")
    if cor:
        query += " AND cor LIKE ?"
        params.append(f"%{cor}%")
    if tamanho:
        query += " AND tamanho LIKE ?"
        params.append(f"%{tamanho}%")

    cursor.execute(query, tuple(params))
    produtos = cursor.fetchall()
    conn.close()

    if not produtos:
        return "🔍 Nenhum produto encontrado com os filtros aplicados."

    resposta = "🔍 Resultados encontrados:\n"
    for p in produtos:
        resposta += f"\n🛍 ID: {p[0]} - {p[1]} - {p[2]}, Tamanho {p[3]}\n💲 Preço: R$ {p[4]:.2f}\n📸 Imagem: {p[5]}\n📦 Estoque: {p[6]}\n"
    return resposta