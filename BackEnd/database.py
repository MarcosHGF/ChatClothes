import sqlite3

def conectar_bd():
    """Cria o banco de dados e a tabela se não existirem."""
    conn = sqlite3.connect("loja.db")
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo TEXT NOT NULL,
            cor TEXT NOT NULL,
            tamanho TEXT NOT NULL,
            preco REAL NOT NULL,
            imagem TEXT NOT NULL,
            quantidade INTEGER NOT NULL
        )
    ''')

    conn.commit()
    return conn
