# Listas principais
tipos_roupa = ["vestido", "camiseta", "blusa", "calça", "bermuda", "brinco", "saia", "jaqueta"]
cores = ["preto", "branco", "azul", "vermelho", "verde", "amarelo", "rosa", "roxo", "cinza"]
tamanhos = ["p", "m", "g", "gg", "pp", "xg"]

# Dicionário de equivalência para cores
cor_equivalente = {
    "preta": "preto",
    "branca": "branco",
    "azuis": "azul",
    "vermelha": "vermelho",
    "vermelhas": "vermelho",
    "verdes": "verde",
    "amarela": "amarelo",
    "amarelas": "amarelo",
    "rosas": "rosa",
    "roxas": "roxo",
    "cinzas": "cinza"
}

# Dicionário de equivalência para nomes de roupas
tipo_equivalente = {
    "camisa": "camiseta",
    "camistas": "camiseta",
    "camista": "camiseta",
    "blusas": "blusa",
    "bermudas": "bermuda",
    "calças": "calça",
    "vestidos": "vestido",
    "brincos": "brinco",
    "saias": "saia",
    "jaquetas": "jaqueta"
}

def tokenizar_input(input_usuario):
    """Divide a entrada do usuário em tokens (palavras individuais)."""
    return input_usuario.lower().split()

def normalizar_token(token):
    """Normaliza o token para forma padrão usando dicionários."""
    token = cor_equivalente.get(token, token)
    token = tipo_equivalente.get(token, token)
    return token

def identificar_tokens(tokens):
    """Classifica os tokens encontrados em tipo, cor e tamanho."""
    tipo = None
    cor = None
    tamanho = None

    for token in tokens:
        token_normalizado = normalizar_token(token)

        if token_normalizado in tipos_roupa:
            tipo = token_normalizado
        elif token_normalizado in cores:
            cor = token_normalizado
        elif token_normalizado in tamanhos:
            tamanho = token_normalizado.upper()

    return tipo, cor, tamanho

def interpretar_busca(input_usuario):
    """Interpreta o input do usuário e retorna os filtros de busca."""
    tokens = tokenizar_input(input_usuario)
    tipo, cor, tamanho = identificar_tokens(tokens)

    if tipo or cor or tamanho:
        return {
            "tipo": tipo,
            "cor": cor,
            "tamanho": tamanho
        }
    else:
        return None
