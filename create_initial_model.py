import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load your dataset - replace with your actual dataset
# This should match the structure expected by your frontend
df = pd.read_csv('data/dataset1.csv')

# Assuming the dataset has columns: N, P, K, pH, EC, OC, S, Zn, Fe, Cu, Mn, B, Fertility
X = df.drop('Fertility', axis=1)
y = df['Fertility']

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Save model
joblib.dump(model, 'models/initial_model.pkl')

print("Initial model created and saved.")