import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import uuid
from datetime import datetime
from utils import get_suggestions, validate_input_data

app = Flask(__name__)
CORS(app)

# Configuration
MODEL_DIR = "models/model_db"
os.makedirs(MODEL_DIR, exist_ok=True)

# Load initial model
INITIAL_MODEL_PATH = "models/initial_model.pkl"
model = joblib.load(INITIAL_MODEL_PATH)

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # Validate input data
        data = request.json
        errors = validate_input_data(data)
        if errors:
            return jsonify({"error": "Invalid input data", "details": errors}), 400
        
        # Prepare features in correct order
        features = ['N', 'P', 'K', 'pH', 'EC', 'OC', 'S', 'Zn', 'Fe', 'Cu', 'Mn', 'B']
        input_data = np.array([[data[feature] for feature in features]])
        
        # Make prediction
        prediction = model.predict(input_data)[0]
        proba = model.predict_proba(input_data)[0]
        confidence = np.max(proba)
        
        # Get suggestions based on prediction
        suggestions = get_suggestions(prediction, data)
        
        # Feature importances
        importances = model.feature_importances_.tolist()
        
        return jsonify({
            "class": int(prediction),
            "confidence": float(confidence),
            "suggestions": suggestions,
            "feature_importances": importances
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/retrain', methods=['POST'])
def retrain():
    try:
        if 'dataset' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
            
        file = request.files['dataset']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
            
        if not file.filename.endswith('.csv'):
            return jsonify({"error": "Only CSV files are allowed"}), 400
            
        # Read and preprocess data
        try:
            df = pd.read_csv(file)
            
            # Basic validation - adjust based on your dataset structure
            required_columns = ['N', 'P', 'K', 'pH', 'EC', 'OC', 'S', 'Zn', 'Fe', 'Cu', 'Mn', 'B', 'Fertility']
            if not all(col in df.columns for col in required_columns):
                missing = [col for col in required_columns if col not in df.columns]
                return jsonify({
                    "error": "Invalid dataset format",
                    "missing_columns": missing,
                    "required_columns": required_columns
                }), 400
                
            # Split data
            X = df.drop('Output', axis=1)
            y = df['Output']
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            # Train new model
            new_model = RandomForestClassifier(n_estimators=100, random_state=42)
            new_model.fit(X_train, y_train)
            
            # Evaluate
            y_pred = new_model.predict(X_test)
            accuracy = accuracy_score(y_test, y_pred)
            
            # Save the new model with timestamp and accuracy in filename
            model_id = str(uuid.uuid4())
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            model_filename = f"model_{timestamp}_acc_{accuracy:.2f}_{model_id}.pkl"
            model_path = os.path.join(MODEL_DIR, model_filename)
            joblib.dump(new_model, model_path)
            
            # Update the active model
            global model
            model = new_model
            
            return jsonify({
                "message": "Model retrained successfully",
                "accuracy": accuracy,
                "model_id": model_id,
                "feature_importances": new_model.feature_importances_.tolist(),
                "new_features": list(X.columns)
            })
            
        except Exception as e:
            return jsonify({"error": f"Error processing dataset: {str(e)}"}), 400
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Load or create initial model
    if not os.path.exists(INITIAL_MODEL_PATH):
        print("Initial model not found. Please train a model first.")
    
    app.run(host='0.0.0.0', port=5000)