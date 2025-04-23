import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
import math  # For handling NaN and Infinity

app = Flask(__name__)
CORS(app)

# Load data from CSV using pandas
def load_data_from_csv(file_path):
    df = pd.read_csv(file_path)
    
    # Ensure numeric columns exist and replace NaN/invalid values with defaults
    numeric_columns = ["vendas", "estoque", "preco"]
    for col in numeric_columns:
        if col not in df.columns:
            df[col] = 0  # Initialize column if missing
        else:
            df[col] = df[col].apply(
                lambda x: 0 if (pd.isna(x) or math.isnan(x) if isinstance(x, float) else False) else x
            )
    
    return df.to_dict(orient='records')

# Save data back to CSV
def save_data_to_csv(file_path, data):
    df = pd.DataFrame(data)
    df.to_csv(file_path, index=False)

# Load data from CSV
file_path = "../../data/loja.csv"
clothing_items = load_data_from_csv(file_path)

@app.route('/api/clothing', methods=['GET'])
def get_clothing():
    return jsonify(clothing_items)

@app.route('/api/sell/<int:item_id>', methods=['POST'])
def sell_item(item_id):
    global clothing_items
    item = next((item for item in clothing_items if item["id"] == item_id), None)
    if not item:
        return jsonify({"error": "Item not found"}), 404

    if item["estoque"] <= 0:
        return jsonify({"error": "Item out of stock"}), 400

    # Decrement stock and increment sales
    item["estoque"] -= 1
    item["vendas"] = item.get("vendas", 0) + 1  # Ensure 'vendas' is initialized to 0 if missing

    # Save updated data back to CSV
    save_data_to_csv(file_path, clothing_items)

    return jsonify({"message": "Sale registered successfully", "item": item})

if __name__ == '__main__':
    app.run(debug=True)