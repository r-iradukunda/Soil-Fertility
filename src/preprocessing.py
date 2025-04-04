import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor

def load_and_preprocess_data(filepath):
    # Load data
    df = pd.read_csv(filepath)
    
    # Handle missing values using RandomForestRegressor
    threshold = 0.5 * len(df)
    df.dropna(axis=1, thresh=threshold, inplace=True)
    
    for col in df.columns:
        if df[col].isnull().sum() > 0:
            X = df.dropna().drop(columns=[col])
            y = df.dropna()[col]
            model = RandomForestRegressor()
            model.fit(X, y)
            df.loc[df[col].isnull(), col] = model.predict(df[df[col].isnull()].drop(columns=[col]))
    
    return df

def split_and_scale_data(df, target_col='Output'):
    # Split features and target
    X = df.drop(columns=[target_col])
    y = df[target_col]
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Handle class imbalance with SMOTE
    smote = SMOTE(random_state=42)
    X_train_res, y_train_res = smote.fit_resample(X_train_scaled, y_train)
    
    return X_train_res, X_test_scaled, y_train_res, y_test, scaler