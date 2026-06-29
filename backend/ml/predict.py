import joblib
import pandas as pd
import numpy as np
import os

# Set directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

# Load the trained model and feature columns
try:
    model = joblib.load(os.path.join(MODELS_DIR, 'price_model.pkl'))
    model_columns = joblib.load(os.path.join(MODELS_DIR, 'columns.pkl'))
except FileNotFoundError:
    print("Error: Model files not found. Please run train.py first to train the model.")
    model = None
    model_columns = None

def predict_price(input_dict):
    """
    Predicts crop price based on input data.
    input_dict = {
        'Commodity': 'Potato',
        'State': 'Gujarat',
        'Min Price': 1000,
        'Max Price': 1500
    }
    """
    if model is None or model_columns is None:
        return "Model not found."

    # 1. Convert input dictionary to DataFrame
    input_df = pd.DataFrame([input_dict])

    # 2. One-hot encode categorical features
    input_df = pd.get_dummies(input_df, columns=['Commodity', 'State'])

    # 3. Align the categorical columns with the trained model columns
    # Reindex fills missing columns with 0 and ensures the order is identical
    input_df = input_df.reindex(columns=model_columns, fill_value=0)

    # 4. Predict
    prediction = model.predict(input_df)

    return np.round(prediction[0], 2)

if __name__ == "__main__":
    # Test sample input
    sample_input = {
        'Commodity': 'Potato',
        'State': 'Gujarat',
        'Min Price': 1000,
        'Max Price': 1500
    }

    if model:
        print(f"Sample Input: {sample_input}")
        prediction = predict_price(sample_input)
        print(f"Predicted Modal Price: {prediction}")
    else:
        print("\nEnsure you've trained the model by running 'python train.py' in this directory.")
