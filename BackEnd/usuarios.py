import csv
import os
import hashlib

CAMINHO_USUARIOS = "databackend/usuarios.csv"
os.makedirs(os.path.dirname(CAMINHO_USUARIOS), exist_ok=True)


def hash_senha(senha):
    return hashlib.sha256(senha.encode()).hexdigest()

def ler_usuarios():
    if not os.path.exists(CAMINHO_USUARIOS):
        return []
    with open(CAMINHO_USUARIOS, newline='', encoding='utf-8') as f:
        return list(csv.DictReader(f))

def escrever_usuarios(usuarios):
    with open(CAMINHO_USUARIOS, 'w', newline='', encoding='utf-8') as f:
        campos = ["id", "numero", "instagram", "nome", "tamanho", "genero", "recomendacao", "senha"]
        writer = csv.DictWriter(f, fieldnames=campos)
        writer.writeheader()
        writer.writerows(usuarios)

def cadastrar_usuario(id, numero, instagram, nome, tamanho, genero, senha):
    usuarios = ler_usuarios()
    for u in usuarios:
        if u["id"] == id:
            return "⚠️ Usuário já cadastrado."
    novo = {
        "id": id,
        "numero": numero,
        "instagram": instagram,
        "nome": nome,
        "tamanho": tamanho,
        "genero": genero,
        "recomendacao": "",
        "senha": hash_senha(senha)
    }
    usuarios.append(novo)
    escrever_usuarios(usuarios)
    return "✅ Usuário cadastrado com sucesso."

def login_usuario(id, senha):
    usuarios = ler_usuarios()
    senha_hashed = hash_senha(senha)
    for u in usuarios:
        if u["id"] == id and u["senha"] == senha_hashed:
            return u
    return None
