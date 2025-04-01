from models import adicionar_produto, listar_produtos, buscar_produto

def menu():
    """Menu para interagir com o banco de dados."""
    while True:
        print("\n📌 Escolha uma opção:")
        print("(id secreto) Adicionar Produto") # deixar para funcionarios
        print("1 Listar Produtos") # 
        print("2 Buscar Produto")
        print("3 Politica de Trocas")
        print("4 Atendente Humana")
        print("5 Sair")
        opcao = input("Digite o número da opção: ")

        if opcao == "1":
            tipo = input("Tipo da peça: ")
            cor = input("Cor: ")
            tamanho = input("Tamanho: ")
            preco = float(input("Preço: "))
            imagem = input("URL da Imagem: ")
            quantidade = int(input("Quantidade em estoque: "))

            adicionar_produto(tipo, cor, tamanho, preco, imagem, quantidade)

        elif opcao == "1":
            print(listar_produtos())
            
        elif opcao == "2":
            termo = input("Digite o tipo, cor ou tamanho do produto que deseja buscar: ")
            print(buscar_produto(termo))
            
        elif opcao == "3":
            print("Descrição da politica de trocas")
            
        elif opcao == "4":
            print("Encaminhando para atendente humana...")
            
        elif opcao == "5":
            print("👋 Saindo...")
            break
        else:
            print("❌ Opção inválida! Tente novamente.")

if __name__ == "__main__":
    menu()
