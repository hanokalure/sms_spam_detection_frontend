import { PredictionRequest, PredictionResult, ApiResponse, MultiModelPredictionResult, ModelPredictionResult } from '../types';

class ApiService {
  private baseUrl: string;

  constructor() {
    // Use environment variable for backend URL, fallback to localhost for development
    // Expo uses EXPO_PUBLIC_ prefix
    this.baseUrl = process.env.EXPO_PUBLIC_API_URL || 
                   process.env.NEXT_PUBLIC_API_URL || 
                   process.env.REACT_APP_API_URL || 
                   'http://localhost:8000';
    console.log('🔧 API Service initialized with baseUrl:', this.baseUrl);
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  async predict(request: PredictionRequest): Promise<PredictionResult> {
    try {
      const response = await fetch(`${this.baseUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: request.text,
          model: request.model
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `HTTP error! status: ${response.status}`);
      }

      // FastAPI returns the prediction result directly
      const data = await response.json();
      console.log('📡 API Response received:', data);
      
      // Map FastAPI response format to frontend format
      const processing_time = request.model === 'svm' 
        ? 50 
        : request.model === 'xgboost' 
          ? 85 
          : request.model === 'distilbert_v2' 
            ? 150 
            : request.model === 'roberta' 
              ? 200 
              : 100;

      const result = {
        prediction: data.prediction.toLowerCase() as 'spam' | 'ham', // Convert SPAM/HAM to spam/ham
        confidence: data.confidence,
        processed_text: data.processed_text,
        features_detected: this.extractFeaturesFromText(request.text),
        processing_time
      };
      
      console.log('✅ Mapped prediction result:', result);
      return result;
    } catch (error) {
      console.error('❌ API Error in predict method:', error);
      console.error('Request details:', { text: request.text, model: request.model });
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      
      // Don't return mock data, let the error bubble up so we can see what's wrong
      throw error;
    }
  }

  async predictWithAllModels(text: string): Promise<MultiModelPredictionResult> {
    const startTime = Date.now();
    
    // Available models with their info
    const availableModels = [
      { id: 'svm', name: 'SVM (Support Vector Machine)', accuracy: 87 },
      { id: 'xgboost', name: 'XGBoost High-Accuracy', accuracy: 98 },
      { id: 'distilbert_v2', name: 'DistilBERT Deep Classifier', accuracy: 95 },
      { id: 'roberta', name: 'RoBERTa Ultimate Detector', accuracy: 96 }
    ];

    try {
      // Call all models simultaneously
      const promises = availableModels.map(async (model) => {
        try {
          const result = await this.predict({ text, model: model.id });
          const modelResult: ModelPredictionResult = {
            modelId: model.id,
            modelName: model.name,
            modelAccuracy: model.accuracy,
            prediction: result.prediction,
            confidence: result.confidence,
            processing_time: result.processing_time
          };
          return modelResult;
        } catch (error) {
          console.error(`Error with model ${model.id}:`, error);
          // Return a fallback result if individual model fails
          return {
            modelId: model.id,
            modelName: model.name,
            modelAccuracy: model.accuracy,
            prediction: 'ham' as 'spam' | 'ham',
            confidence: 0,
            processing_time: 0
          };
        }
      });

      const results = await Promise.all(promises);
      const endTime = Date.now();

      return {
        inputText: text,
        results,
        totalProcessingTime: endTime - startTime,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('❌ Multi-model prediction error:', error);
      throw new Error('Failed to analyze text with all models');
    }
  }

  async healthCheck(): Promise<{isHealthy: boolean, message?: string}> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout for faster failure on mobile
        signal: AbortSignal.timeout ? AbortSignal.timeout(10000) : undefined
      });
      if (response.ok) {
        return { isHealthy: true };
      } else {
        return { isHealthy: false, message: `Server returned ${response.status}` };
      }
    } catch (error) {
      console.error('Health check failed:', error);
      // Check if this is a CORS or network error (common on mobile/deployed apps)
      const errorMessage = error.name === 'TypeError' 
        ? 'Network error - backend not accessible'
        : 'Cannot connect to server';
      return { isHealthy: false, message: errorMessage };
    }
  }

  async getAvailableModels(): Promise<{success: boolean, data?: any, error?: string}> {
    try {
      const response = await fetch(`${this.baseUrl}/models`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Models info error:', error);
      return { success: false, error: error.message || 'Failed to fetch models' };
    }
  }

  private extractFeaturesFromText(text: string): any {
    return {
      has_currency: text.includes('$') || text.includes('£') || text.includes('€') ? 1 : 0,
      has_url: /https?:\/\//.test(text) || /www\./.test(text) ? 1 : 0,
      has_phone: /\d{10,}/.test(text) ? 1 : 0,
      has_shortcode: /\b\d{4,6}\b/.test(text) ? 1 : 0,
      exclamation_count: (text.match(/!/g) || []).length,
      spam_word_count: ['free', 'win', 'prize', 'urgent', 'call now', 'congratulations'].filter(
        word => text.toLowerCase().includes(word)
      ).length
    };
  }

  async getModelInfo(modelId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/models/${modelId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Model info error:', error);
      return null;
    }
  }

  private getMockPrediction(request: PredictionRequest): PredictionResult {
    // Mock prediction for development
    const isSpam = request.text.toLowerCase().includes('free') || 
                   request.text.toLowerCase().includes('win') ||
                   request.text.toLowerCase().includes('prize') ||
                   request.text.toLowerCase().includes('urgent');

    const confidence = Math.random() * 0.3 + (isSpam ? 0.7 : 0.4);

      const processing_time = request.model === 'svm' 
        ? 50 
        : request.model === 'xgboost' 
          ? 85 
          : request.model === 'distilbert_v2' 
            ? 150 
            : request.model === 'roberta' 
              ? 200 
              : 100;

      return {
      prediction: isSpam ? 'spam' : 'ham',
      confidence: Math.min(confidence, 0.999),
      processed_text: request.text.toLowerCase().replace(/[^a-z0-9\s]/g, ''),
      features_detected: {
        has_currency: request.text.includes('$') || request.text.includes('£') ? 1 : 0,
        has_url: /https?:\/\//.test(request.text) ? 1 : 0,
        has_phone: /\d{10,}/.test(request.text) ? 1 : 0,
        has_shortcode: /\b\d{4,6}\b/.test(request.text) ? 1 : 0,
        exclamation_count: (request.text.match(/!/g) || []).length,
        spam_word_count: ['free', 'win', 'prize', 'urgent', 'call now'].filter(
          word => request.text.toLowerCase().includes(word)
        ).length
      },
      processing_time
    };
  }

  // Simulate network delay for better UX testing
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ApiService();