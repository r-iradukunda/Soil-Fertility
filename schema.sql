-- soil_samples table
CREATE TABLE soil_samples (
    id SERIAL PRIMARY KEY,
    sample_name VARCHAR(100) NOT NULL,
    collection_date DATE NOT NULL,
    location VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    notes TEXT
);

-- soil_parameters table
CREATE TABLE soil_parameters (
    id SERIAL PRIMARY KEY,
    sample_id INTEGER REFERENCES soil_samples(id),
    nitrogen DECIMAL(8, 2) CHECK (nitrogen BETWEEN 6 AND 383),  -- ppm
    phosphorus DECIMAL(8, 2) CHECK (phosphorus BETWEEN 2.9 AND 125),  -- ppm
    potassium DECIMAL(8, 2) CHECK (potassium BETWEEN 11 AND 887),  -- ppm
    ph DECIMAL(4, 2) CHECK (ph BETWEEN 0.9 AND 11.15),
    ec DECIMAL(4, 2) CHECK (ec BETWEEN 0.1 AND 0.95),  -- dS/m
    organic_carbon DECIMAL(5, 2) CHECK (organic_carbon BETWEEN 0.1 AND 24),  -- %
    sulfur DECIMAL(6, 2) CHECK (sulfur BETWEEN 0.64 AND 31),  -- ppm
    zinc DECIMAL(6, 2) CHECK (zinc BETWEEN 0.07 AND 42),  -- ppm
    iron DECIMAL(6, 2) CHECK (iron BETWEEN 0.21 AND 44),  -- ppm
    copper DECIMAL(5, 2) CHECK (copper BETWEEN 0.09 AND 3.02),  -- ppm
    manganese DECIMAL(6, 2) CHECK (manganese BETWEEN 0.11 AND 31),  -- ppm
    boron DECIMAL(5, 2) CHECK (boron BETWEEN 0.06 AND 2.82),  -- ppm
    fertility_class VARCHAR(20) CHECK (fertility_class IN ('Low', 'Medium', 'High')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- recommendations table
CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,
    fertility_class VARCHAR(20) REFERENCES soil_parameters(fertility_class),
    recommendation_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_soil_parameters_fertility ON soil_parameters(fertility_class);
CREATE INDEX idx_soil_samples_location ON soil_samples(location);