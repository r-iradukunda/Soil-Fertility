def validate_input_data(data):
    """Validate the input data for prediction"""
    required_fields = ['N', 'P', 'K', 'pH', 'EC', 'OC', 'S', 'Zn', 'Fe', 'Cu', 'Mn', 'B']
    errors = {}
    
    # Check all required fields are present
    for field in required_fields:
        if field not in data:
            errors[field] = "Missing field"
            continue
            
        try:
            value = float(data[field])
        except ValueError:
            errors[field] = "Must be a number"
            continue
            
        # Add any range validations here if needed
        # Example for pH:
        if field == 'pH' and (value < 0 or value > 14):
            errors[field] = "pH must be between 0 and 14"
            
    return errors

def get_suggestions(prediction, soil_data):
    """Generate suggestions based on soil fertility prediction and values"""
    suggestions = []
    
    # Fertility class suggestions
    fertility_suggestions = [
        "Your soil needs improvement. Consider adding organic matter and balanced fertilizers.",
        "Your soil is moderately fertile. Regular monitoring and maintenance is recommended.",
        "Your soil is highly fertile. Maintain current practices with minimal intervention."
    ]
    suggestions.append(fertility_suggestions[prediction])
    
    # Specific nutrient suggestions
    if soil_data['N'] < 50:
        suggestions.append("Nitrogen levels are low. Consider adding nitrogen-rich fertilizers.")
    elif soil_data['N'] > 200:
        suggestions.append("Nitrogen levels are high. Reduce nitrogen inputs to prevent runoff.")
        
    if soil_data['P'] < 10:
        suggestions.append("Phosphorus levels are low. Add phosphorus fertilizer or bone meal.")
        
    if soil_data['K'] < 100:
        suggestions.append("Potassium levels are low. Consider adding potash or wood ash.")
        
    if soil_data['pH'] < 5.5:
        suggestions.append("Soil is too acidic. Consider adding lime to raise pH.")
    elif soil_data['pH'] > 7.5:
        suggestions.append("Soil is too alkaline. Consider adding sulfur to lower pH.")
        
    if soil_data['OC'] < 0.5:
        suggestions.append("Organic carbon is low. Add compost or manure to improve soil structure.")
        
    return " ".join(suggestions)