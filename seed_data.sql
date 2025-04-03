-- Insert sample data
INSERT INTO soil_samples (sample_name, collection_date, location, latitude, longitude, notes)
VALUES
    ('Farm A - North Field', '2023-05-15', 'Iowa, USA', 41.8780, -93.0977, 'Corn field, conventional tillage'),
    ('Farm B - South Plot', '2023-06-02', 'California, USA', 36.7783, -119.4179, 'Organic almond orchard'),
    ('Research Plot 1', '2023-04-20', 'Punjab, India', 31.1471, 75.3412, 'Wheat research station'),
    ('Community Garden', '2023-07-10', 'Berlin, Germany', 52.5200, 13.4050, 'Urban agriculture project');

-- Insert soil parameters
INSERT INTO soil_parameters (
    sample_id, nitrogen, phosphorus, potassium, ph, ec, organic_carbon, 
    sulfur, zinc, iron, copper, manganese, boron, fertility_class
)
VALUES
    (1, 185.42, 15.73, 420.15, 6.82, 0.45, 1.25, 8.42, 0.85, 5.32, 0.92, 12.45, 0.35, 'Medium'),
    (2, 92.15, 8.62, 315.78, 7.15, 0.38, 2.45, 12.65, 1.25, 8.75, 1.15, 18.32, 0.52, 'High'),
    (3, 65.78, 5.32, 210.45, 5.95, 0.52, 0.85, 4.32, 0.42, 3.15, 0.65, 8.75, 0.18, 'Low'),
    (1, 210.25, 18.95, 480.32, 6.95, 0.48, 1.45, 9.15, 0.95, 6.15, 1.05, 14.25, 0.42, 'High'),
    (4, 120.45, 10.25, 350.78, 7.05, 0.42, 1.85, 7.85, 0.75, 4.95, 0.85, 10.75, 0.28, 'Medium');

-- Insert recommendations
INSERT INTO recommendations (fertility_class, recommendation_text)
VALUES
    ('Low', 'Apply balanced NPK fertilizer (10-10-10) at 50kg/acre. Incorporate organic compost (5 tons/acre) to improve soil structure. Consider liming if pH < 6.0.'),
    ('Medium', 'Apply targeted fertilizers based on specific nutrient deficiencies. Use 2-3 tons/acre of well-decomposed farmyard manure. Implement crop rotation with legumes.'),
    ('High', 'Maintain fertility with minimal inputs. Use 1 ton/acre compost for organic matter. Monitor nutrient levels quarterly. Consider cover cropping during off-seasons.');