import sqlite3

def conectar_bd():
    """Cria o banco de dados e as tabelas se não existirem."""
    conn = sqlite3.connect("loja.db")
    cursor = conn.cursor()

    # Tabela de produtos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo TEXT NOT NULL,
            cor TEXT NOT NULL,
            tamanho TEXT NOT NULL,
            preco REAL NOT NULL,
            imagem TEXT,
            quantidade INTEGER NOT NULL
        )
    ''')

    # Tabela de clientes
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS clientes (
            celular TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            caracteristicas_pesquisadas TEXT
        )
    ''')

    # Tabela Vendas
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo_produto TEXT NOT NULL,
            cor_produto TEXT NOT NULL,
            tamanho_produto TEXT NOT NULL,
            quantidade_vendida INTEGER NOT NULL,
            data_venda TEXT NOT NULL,
            preco_unitario REAL NOT NULL,
            valor_total REAL NOT NULL,
            FOREIGN KEY (celular_cliente) REFERENCES clientes(celular)
        )
    ''')

    conn.commit()
    return conn
