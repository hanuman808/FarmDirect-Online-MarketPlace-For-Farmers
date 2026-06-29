from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import numpy as np
import pandas as pd
from predict import predict_price

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

# Load model and columns at startup for performance
try:
    model = joblib.load(os.path.join(MODELS_DIR, 'price_model.pkl'))
    model_columns = joblib.load(os.path.join(MODELS_DIR, 'columns.pkl'))
    print("Model and columns loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    model_columns = None

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate input
        required_fields = ["Commodity", "State", "Min Price", "Max Price"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}", "success": False}), 400

        # Prepare input for predict_price function
        input_data = {
            "Commodity": data["Commodity"],
            "State": data["State"],
            "Min Price": float(data["Min Price"]),
            "Max Price": float(data["Max Price"])
        }

        # Call the existing prediction logic
        price = predict_price(input_data)

        if isinstance(price, str):
            return jsonify({"error": price, "success": False}), 500

        return jsonify({
            "predicted_price": float(price),
            "success": True
        })

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": str(e), "success": False}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "model_loaded": model is not None})

if __name__ == '__main__':
    # Run on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
