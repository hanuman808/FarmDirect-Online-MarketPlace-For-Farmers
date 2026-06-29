import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# Set directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')
GRAPHS_DIR = os.path.join(BASE_DIR, 'graphs')

# Create folders if not exist
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(GRAPHS_DIR, exist_ok=True)

def train_model():
    print("Loading dataset...")
    data_path = os.path.join(BASE_DIR, 'data.csv')
    df = pd.read_csv(data_path)

    # 1. Select relevant columns
    cols_to_use = ['Commodity', 'State', 'Min Price', 'Max Price', 'Modal Price']
    df = df[cols_to_use]

    # 2. Handle missing values
    df.dropna(inplace=True)

    print(f"Dataset size after cleaning: {df.shape}")

    # 3. Generate and Save Graphs
    print("Generating graphs...")
    sns.set(style="whitegrid")

    # a) Histogram of Modal Price
    plt.figure(figsize=(10, 6))
    sns.histplot(df['Modal Price'], bins=50, kde=True, color='teal')
    plt.title('Distribution of Modal Prices')
    plt.xlabel('Modal Price')
    plt.ylabel('Frequency')
    plt.savefig(os.path.join(GRAPHS_DIR, 'price_distribution.png'))
    plt.close()

    # b) Bar chart of top 10 commodities
    plt.figure(figsize=(12, 8))
    top_crops = df['Commodity'].value_counts().head(10)
    sns.barplot(x=top_crops.values, y=top_crops.index, palette='viridis')
    plt.title('Top 10 Commodities by Frequency')
    plt.xlabel('Count')
    plt.ylabel('Commodity')
    plt.savefig(os.path.join(GRAPHS_DIR, 'top_crops.png'))
    plt.close()

    # c) Scatter plot (Min Price vs Max Price)
    plt.figure(figsize=(10, 6))
    sns.scatterplot(x='Min Price', y='Max Price', data=df, alpha=0.5, color='orange')
    plt.title('Min Price vs Max Price Relation')
    plt.xlabel('Min Price')
    plt.ylabel('Max Price')
    plt.savefig(os.path.join(GRAPHS_DIR, 'min_max_relation.png'))
    plt.close()

    # 4. Convert categorical data using one-hot encoding
    print("Encoding categorical features...")
    # Features (X) and Target (y)
    X = df.drop('Modal Price', axis=1)
    y = df['Modal Price']

    # One-hot encode Commodity and State
    X = pd.get_dummies(X, columns=['Commodity', 'State'], drop_first=True)
    
    # Save feature columns for prediction alignment
    model_columns = list(X.columns)
    joblib.dump(model_columns, os.path.join(MODELS_DIR, 'columns.pkl'))

    # 5. Split dataset
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 6. Train RandomForestRegressor
    print("Training RandomForest model (this may take a moment)...")
    model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    # 7. Evaluate
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print("\n--- Model Evaluation Results ---")
    print(f"Mean Absolute Error (MAE): {mae:.2f}")
    print(f"R2 Score: {r2:.4f}")

    # 8. Save model
    joblib.dump(model, os.path.join(MODELS_DIR, 'price_model.pkl'))
    print(f"\nModel and columns saved successfully in {MODELS_DIR}")

if __name__ == "__main__":
    train_model()
