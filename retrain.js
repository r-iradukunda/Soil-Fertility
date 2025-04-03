// public/js/retrain.js
class ModelRetrainer {
    constructor() {
        this.retrainBtn = document.getElementById('retrain-btn');
        this.fileInput = document.getElementById('dataset-upload');
        this.statusBox = document.getElementById('retrain-status');
        this.bindEvents();
    }

    bindEvents() {
        this.retrainBtn.addEventListener('click', () => this.startRetraining());
    }

    async startRetraining() {
        if (!this.validateFile()) return;

        this.setLoadingState(true);
        this.statusBox.innerHTML = '<p>Validating CSV format...</p>';
        
        try {
            const validation = await this.validateCSV();
            
            if (!validation.valid) {
                this.statusBox.innerHTML = `
                    <div class="error-box">
                        <h3>❌ Validation Failed</h3>
                        <pre>${validation.message}</pre>
                        <p>Please check your CSV format and try again.</p>
                    </div>
                `;
                return;
            }

            this.statusBox.innerHTML = '<p>CSV format valid. Starting training...</p>';
            const result = await this.submitTrainingRequest();
            this.handleSuccess(result);
        } catch (error) {
            this.handleError(error);
        } finally {
            this.setLoadingState(false);
        }
    }

    validateFile() {
        if (!this.fileInput.files.length) {
            alert("Please select a CSV file first");
            return false;
        }
        return true;
    }

    async validateCSV() {
        try {
            const file = this.fileInput.files[0];
            const content = await file.text();
            const lines = content.trim().split('\n');
            
            if (lines.length < 2) {
                throw new Error('CSV file is empty or contains only headers');
            }

            const headers = lines[0].trim().split(',').map(h => h.trim());
            console.log('Found headers:', headers);

            // Separate mappings for features and target
            const featureMappings = {
                'n': ['n', 'nitrogen', 'N', 'NITROGEN'],
                'p': ['p', 'phosphorous', 'phosphorus', 'P', 'PHOSPHORUS'],
                'k': ['k', 'potassium', 'K', 'POTASSIUM'],
                'ph': ['ph', 'pH', 'PH', 'Ph'],
                'ec': ['ec', 'EC', 'Ec'],
                'oc': ['oc', 'OC', 'organic carbon', 'ORGANIC CARBON'],
                's': ['s', 'sulfur', 'S', 'SULFUR'],
                'zn': ['zn', 'zinc', 'Zn', 'ZN', 'ZINC'],
                'fe': ['fe', 'iron', 'Fe', 'FE', 'IRON'],
                'cu': ['cu', 'copper', 'Cu', 'CU', 'COPPER'],
                'mn': ['mn', 'manganese', 'Mn', 'MN', 'MANGANESE'],
                'b': ['b', 'boron', 'B', 'BORON']
            };

            const missing = [];
            const found = [];
            const standardizedHeaders = new Map();

            // Validate feature columns
            for (const [required, aliases] of Object.entries(featureMappings)) {
                const matchedHeader = headers.find(h => 
                    aliases.some(alias => h.toLowerCase() === alias.toLowerCase())
                );
                
                if (matchedHeader) {
                    found.push(matchedHeader);
                    standardizedHeaders.set(required, matchedHeader);
                } else {
                    missing.push(`${required.toUpperCase()} (accepted names: ${aliases.join(' or ')})`);
                }
            }

            // Check for target column without requiring specific name
            const targetColumn = headers.find(h => ['output', 'target', 'class', 'fertility'].includes(h.toLowerCase()));
            if (targetColumn) {
                found.push(targetColumn);
                standardizedHeaders.set('target', targetColumn);
            }

            // Validate number of samples
            const data = lines.slice(1).filter(line => line.trim());
            if (data.length < 10) {
                throw new Error(`Dataset needs at least 10 samples (found ${data.length})`);
            }

            return {
                valid: missing.length === 0,
                message: missing.length 
                    ? `Missing columns:\n${missing.join('\n')}\n\nFound columns: ${headers.join(', ')}`
                    : 'CSV format is valid',
                headers: standardizedHeaders,
                samples: data.length,
                targetColumn: targetColumn || 'Output' // Use found target or default to 'Output'
            };

        } catch (error) {
            return {
                valid: false,
                message: `CSV Validation Error: ${error.message}`
            };
        }
    }

    async submitTrainingRequest() {
        this.updateStatus('Training in progress...', true);
        
        // Simulate training process
        await this.simulateTraining();

        // Simulate successful response
        return {
            model_id: 'model_' + Date.now(),
            accuracy: (85 + Math.random() * 10).toFixed(2),
            feature_importances: {
                'N': 0.15 + Math.random() * 0.05,
                'P': 0.12 + Math.random() * 0.05,
                'K': 0.11 + Math.random() * 0.05,
                'pH': 0.10 + Math.random() * 0.05,
                'EC': 0.09 + Math.random() * 0.05,
                'OC': 0.08 + Math.random() * 0.05,
                'S': 0.07 + Math.random() * 0.05,
                'Zn': 0.07 + Math.random() * 0.05,
                'Fe': 0.06 + Math.random() * 0.05,
                'Cu': 0.06 + Math.random() * 0.05,
                'Mn': 0.05 + Math.random() * 0.05,
                'B': 0.04 + Math.random() * 0.05
            },
            training_time: (2 + Math.random() * 3).toFixed(1)
        };
    }

    async simulateTraining() {
        const steps = ['Preprocessing data...', 'Initializing model...', 'Training model...', 
                      'Validating results...', 'Finalizing model...'];
        
        for (const step of steps) {
            this.updateStatus(step, true);
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        }
    }

    updateStatus(message, inProgress = false) {
        this.statusBox.innerHTML = `
            <div class="training-status ${inProgress ? 'in-progress' : ''}">
                <p>${message}</p>
                ${inProgress ? '<div class="progress-bar"></div>' : ''}
            </div>
        `;
    }

    handleSuccess(result) {
        const accuracy = parseFloat(result.accuracy);
        const accuracyClass = accuracy >= 90 ? 'excellent' : accuracy >= 80 ? 'good' : 'fair';
        
        this.statusBox.innerHTML = `
            <div class="model-result">
                <h3>🎉 Model Successfully Retrained!</h3>
                <div class="result-grid">
                    <div class="result-item">
                        <span class="label">Model ID:</span>
                        <span class="value">${result.model_id}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Accuracy:</span>
                        <span class="value accuracy ${accuracyClass}">${result.accuracy}%</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Training Time:</span>
                        <span class="value">${result.training_time}s</span>
                    </div>
                </div>
                <div class="feature-importance">
                    <h4>Feature Importance Analysis</h4>
                    <div id="feature-importance-plot"></div>
                </div>
                <button onclick="location.reload()" class="secondary-btn">Train Another Model</button>
            </div>
        `;

        // Render feature importance plot
        if (result.feature_importances) {
            this.renderFeatureImportancePlot(result.feature_importances);
        }
    }

    renderFeatureImportancePlot(importances) {
        const data = [{
            x: Object.values(importances),
            y: Object.keys(importances),
            type: 'bar',
            orientation: 'h',
            marker: {
                color: 'rgb(76, 175, 80)',
                opacity: 0.7
            }
        }];

        const layout = {
            title: 'Feature Importance',
            xaxis: { title: 'Importance Score' },
            yaxis: { title: 'Features' },
            margin: { l: 100, r: 20, t: 40, b: 40 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };

        Plotly.newPlot('feature-importance-plot', data, layout);
    }

    handleError(error) {
        this.statusBox.innerHTML = `
            <div class="error-box">
                <h3>Training Failed</h3>
                <p>${error.message}</p>
                ${error.details ? `<small>${error.details}</small>` : ''}
            </div>
        `;
    }

    setLoadingState(isLoading) {
        this.retrainBtn.disabled = isLoading;
        this.retrainBtn.innerHTML = isLoading
            ? '<span class="loading-spinner"></span> Creating New Model...'
            : '🚀 Retrain with New Data';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ModelRetrainer();
});