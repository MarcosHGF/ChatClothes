from models import adicionar_produto, listar_produtos, buscar_produto

def menu():
    """Menu para interagir com o banco de dados."""
    while True:
        print("\n📌 Escolha uma opção:")
        # print("(id secreto) Adicionar Produto") # deixar para funcionarios
        print("1 Listar Produtos") # recomendação
        print("2 Buscar Produto")
        print("3 Politica de Trocas")
        print("4 Atendente Humana")
        print("5 Sair")
        opcao = input("Digite o número da opção: ")

        if opcao == "id_secreto":
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
            print('''🛍️ Política de Trocas
Você pode trocar seu produto em até 7 dias após o recebimento.

✅ Condições para troca:
A peça deve estar sem sinais de uso, com etiquetas e embalagem original.

É necessário apresentar a nota fiscal ou comprovante da compra.

Não trocamos produtos com cheiro, manchas, ajustes ou danificados por mau uso.

📦 Como solicitar a troca:
Entre em contato pelo nosso atendimento com o número do pedido e o motivo da troca.

Nossa equipe irá instruir sobre o envio da peça.

⚠️ Itens que não podem ser trocados:
Peças promocionais ou em liquidação.

Acessórios íntimos, como brincos, por motivo de higiene.''')
            
        elif opcao == "4":
            print("Encaminhando para atendente humana...")
            
        elif opcao == "5":
            print("👋 Saindo...")
            break
        else:
            print("❌ Opção inválida! Tente novamente.")

if __name__ == "__main__":
    menu()
