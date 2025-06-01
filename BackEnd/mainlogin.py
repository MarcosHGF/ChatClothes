from usuarios import cadastrar_usuario, login_usuario
from gostos import atualizar_gosto
from gostos import gerar_recomendacoes

print("📲 Bem-vindo ao ChatClothes!")

id_user = input("Digite seu número de celular (somente números): ")
senha = input("Digite sua senha: ")
usuario = login_usuario(id_user, senha)


if not usuario:
    print("🔐 Você não está cadastrado. Vamos fazer isso agora!")
    numero = id_user
    instagram = input("Digite seu Instagram: ")
    nome = input("Digite seu nome: ")
    tamanho = input("Tamanho que você usa (P, M, G...): ")
    genero = input("Seu gênero (Masculino, Feminino, etc.): ")
    senha = input("Crie uma senha: ")

    print(cadastrar_usuario(id_user, numero, instagram, nome, tamanho, genero, senha))
    usuario = login_usuario(id_user, senha)




print(f"\n🎉 Olá, {usuario['nome']}! Que bom ter você aqui.")
print("\n✨ Com base no seu perfil, recomendamos para você:")

recomendacoes = gerar_recomendacoes(usuario["id"])
for r in recomendacoes:
    print(f"👉 {r}")


# AÇÕES DO USUÁRIO
while True:
    print("\nO que você deseja fazer?")
    print("1 - Buscar produto")
    print("2 - Adicionar ao carrinho")
    print("3 - Finalizar compra")
    print("4 - Sair")
    escolha = input("Escolha uma opção: ")

    if escolha == "1":
        termo = input("Digite o tipo/cor/tamanho do produto: ")
    
        # Separar e registrar gostos por palavra
        palavras = termo.lower().replace(",", "").split()
        for palavra in palavras:
            atualizar_gosto(usuario["id"], nova_caracteristica=palavra)
    
            print(f"🔍 Produto '{termo}' pesquisado. Registrado no seu perfil.")
    
            # Gerar recomendações imediatamente após busca
            print("\n✨ Com base no seu perfil, recomendamos para você:")
            recomendacoes = gerar_recomendacoes(usuario["id"])
        
        for r in recomendacoes:
            print(f"👉 {r}")


    elif escolha == "2":
        item = input("Digite o nome do produto para adicionar ao carrinho: ")
        atualizar_gosto(usuario["id"], novo_carrinho=item)
        print(f"🛒 '{item}' adicionado ao seu carrinho.")

    elif escolha == "3":
        compra = input("Digite o nome do produto comprado: ")
        atualizar_gosto(usuario["id"], nova_compra=compra)
        print(f"💰 Compra registrada: '{compra}'.")

    elif escolha == "4":
        print("👋 Até logo!")
        break

    else:
        print("❌ Opção inválida.")
