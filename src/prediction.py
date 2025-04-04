import numpy as np
from model import load_model
import joblib

class SoilFertilityPredictor:
    def __init__(self, model_path, scaler_path):
        self.model = load_model(model_path)
        self.scaler = joblib.load(scaler_path)
        
    def preprocess_input(self, input_data):
        """Preprocess input data for prediction"""
        # Convert input to numpy array if it's not already
        if not isinstance(input_data, np.ndarray):
            input_data = np.array(input_data)
            
        # Reshape if single sample
        if len(input_data.shape) == 1:
            input_data = input_data.reshape(1, -1)
            
        # Scale features
        scaled_data = self.scaler.transform(input_data)
        
        return scaled_data
    
    def predict(self, input_data):
        """Make fertility prediction"""
        # Preprocess input
        processed_data = self.preprocess_input(input_data)
        
        # Make prediction
        prediction = self.model.predict(processed_data)
        probabilities = self.model.predict_proba(processed_data)
        
        # Map prediction to class label
        class_labels = {0: "Less Fertile", 1: "Fertile", 2: "Highly Fertile"}
        predicted_class = class_labels[prediction[0]]
        
        return {
            'class': predicted_class,
            'class_code': int(prediction[0]),
            'probabilities': {
                'Less Fertile': float(probabilities[0][0]),
                'Fertile': float(probabilities[0][1]),
                'Highly Fertile': float(probabilities[0][2])
            }
        }
    
    def predict_batch(self, input_data):
        """Make predictions for multiple samples"""
        # Preprocess input
        processed_data = self.preprocess_input(input_data)
        
        # Make predictions
        predictions = self.model.predict(processed_data)
        probabilities = self.model.predict_proba(processed_data)
        
        # Map predictions to class labels
        class_labels = {0: "Less Fertile", 1: "Fertile", 2: "Highly Fertile"}
        results = []
        
        for i in range(len(predictions)):
            results.append({
                'class': class_labels[predictions[i]],
                'class_code': int(predictions[i]),
                'probabilities': {
                    'Less Fertile': float(probabilities[i][0]),
                    'Fertile': float(probabilities[i][1]),
                    'Highly Fertile': float(probabilities[i][2])
                }
            })
            
        return results