from flask import Flask, render_template
import pandas as pd

app = Flask(__name__)

# Caminho para os dados fictícios
DATA_PATH = "data/fakedata.csv"

@app.route('/')
def index():
    # Carregar os dados fictícios
    data = pd.read_csv(DATA_PATH)

    # Processar dados para o dashboard
    total_vendas = data['vendas'].sum()
    total_estoque = data['estoque'].sum()
    media_preco = data['preco'].mean()

    # Converter DataFrame para dicionário para passar ao template
    produtos = data.to_dict(orient='records')

    return render_template(
        'index.html',
        produtos=produtos,
        total_vendas=total_vendas,
        total_estoque=total_estoque,
        media_preco=round(media_preco, 2)
    )

if __name__ == '__main__':
    app.run(debug=True)