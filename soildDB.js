class SoilDatabase {
  constructor() {
    this.dbName = 'SoilFertilityDB';
    this.dbVersion = 1;
    this.db = null;
  }

  async open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create soil samples store
        if (!db.objectStoreNames.contains('samples')) {
          const samplesStore = db.createObjectStore('samples', { keyPath: 'id', autoIncrement: true });
          samplesStore.createIndex('location', 'location', { unique: false });
        }
        
        // Create parameters store
        if (!db.objectStoreNames.contains('parameters')) {
          const paramsStore = db.createObjectStore('parameters', { keyPath: 'id', autoIncrement: true });
          paramsStore.createIndex('sampleId', 'sampleId', { unique: false });
          paramsStore.createIndex('fertilityClass', 'fertilityClass', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  async addSample(sampleData, parameters) {
    const transaction = this.db.transaction(['samples', 'parameters'], 'readwrite');
    const samplesStore = transaction.objectStore('samples');
    const paramsStore = transaction.objectStore('parameters');

    return new Promise((resolve, reject) => {
      // Add sample first
      const sampleRequest = samplesStore.add(sampleData);

      sampleRequest.onsuccess = (event) => {
        const sampleId = event.target.result;
        
        // Add parameters with sampleId reference
        const paramsWithId = { ...parameters, sampleId };
        const paramsRequest = paramsStore.add(paramsWithId);

        paramsRequest.onsuccess = () => {
          resolve({ sampleId, paramId: paramsRequest.result });
        };

        paramsRequest.onerror = (e) => {
          reject(e.target.error);
        };
      };

      sampleRequest.onerror = (e) => {
        reject(e.target.error);
      };
    });
  }

  async getSamplesWithParams() {
    const transaction = this.db.transaction(['samples', 'parameters']);
    const samplesStore = transaction.objectStore('samples');
    const paramsStore = transaction.objectStore('parameters');
    const paramsIndex = paramsStore.index('sampleId');

    return new Promise((resolve, reject) => {
      const samplesRequest = samplesStore.getAll();

      samplesRequest.onsuccess = async (event) => {
        const samples = event.target.result;
        const results = [];

        for (const sample of samples) {
          const paramsRequest = paramsIndex.getAll(sample.id);
          
          await new Promise((innerResolve) => {
            paramsRequest.onsuccess = (e) => {
              results.push({
                ...sample,
                parameters: e.target.result[0] || null
              });
              innerResolve();
            };
          });
        }

        resolve(results);
      };

      samplesRequest.onerror = (e) => {
        reject(e.target.error);
      };
    });
  }

  // Add more methods as needed...
}

// Initialize and export a singleton instance
const soilDB = new SoilDatabase();
export default soilDB;