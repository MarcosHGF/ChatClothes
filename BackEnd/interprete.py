# Listas de tipos de roupas, cores e tamanhos
tipos_roupa = ["vestido", "camiseta", "blusa", "calça", "bermuda", "brinco", "saia", "jaqueta"]
cores = ["preto", "branco", "azul", "vermelho", "verde", "amarelo", "rosa", "roxo", "cinza"]
tamanhos = ["P", "M", "G", "GG", "PP", "XG"]

def tokenizar_input(input_usuario):
    """Divide a entrada do usuário em tokens (palavras individuais)."""
    return input_usuario.lower().split()

def identificar_tokens(tokens):
    """Classifica os tokens encontrados em tipo, cor e tamanho."""
    tipo = None
    cor = None
    tamanho = None

    for token in tokens:
        if token in tipos_roupa:
            tipo = token
        elif token in cores:
            cor = token
        elif token in tamanhos:
            tamanho = token

    return tipo, cor, tamanho

def interpretar_busca(input_usuario):
    """Interpreta o input do usuário e retorna os filtros de busca."""
    tokens = tokenizar_input(input_usuario)
    tipo, cor, tamanho = identificar_tokens(tokens)

    # Construir a mensagem de retorno com os filtros encontrados
    filtros = []
    if tipo:
        filtros.append(f"Tipo: {tipo}")
    if cor:
        filtros.append(f"Cor: {cor}")
    if tamanho:
        filtros.append(f"Tamanho: {tamanho}")
    
    if filtros:
        return "Filtros aplicados: " + ", ".join(filtros)
    else:
        return "Nenhum filtro válido encontrado. Tente novamente!"

