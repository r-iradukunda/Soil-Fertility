# Soil Fertility Prediction System

## Overview
A machine learning system that classifies soil fertility levels (Less Fertile, Fertile, Highly Fertile) based on 12 key soil parameters.

## Key Features
- **Automated Classification**: Instant soil fertility predictions
- **Probability Scoring**: Confidence levels for each prediction
- **Continuous Learning**: Model improves with new data
- **Multiple Integration Options**: API or direct Python import

## Technical Components
### Data Processing
- Handles missing values automatically
- Normalizes features for optimal model performance
- Corrects class imbalances in training data

### Machine Learning
- Random Forest classifier (primary model)
- Logistic Regression (baseline model)
- Hyperparameter optimization

### Deployment
- Pre-trained models included
- Flask API for web services
- Docker support available

## Data Requirements
CSV files should contain these columns:
- N, P, K, pH, EC, OC, S, Zn, Fe, Cu, Mn, B (as features)
- Output (0-2 fertility class as target)

## Implementation Workflow
1. **Initial Setup**: Install dependencies and load pretrained models
2. **Predictions**: Classify new soil samples
3. **Retraining**: Update models with new field data

## Performance
- Typical accuracy: 85-92%
- Provides classification reports
- Includes feature importance analysis

## Applications
- Precision agriculture
- Soil health monitoring
- Agricultural research

## Maintenance
- Regular model updates recommended
- Version control for models
- Performance monitoring tools

link to video: https://youtu.be/mUXZ1L3esxA
link to website: https://r-iradukunda.github.io/Soil-Fertility/