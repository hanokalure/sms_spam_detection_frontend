import { PredictionRequest, PredictionResult, ApiResponse } from '../types';

class ApiService {
  private baseUrl: string;

  constructor() {
    // FastAPI backend URL (no /api suffix needed)
    this.baseUrl = 'http://localhost:8000';
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
      
      // Map FastAPI response format to frontend format
      return {
        prediction: data.prediction.toLowerCase() as 'spam' | 'ham', // Convert SPAM/HAM to spam/ham
        confidence: data.confidence,
        processed_text: data.processed_text,
        features_detected: this.extractFeaturesFromText(request.text),
        processing_time: data.model_name === 'SVM' ? 50 : 120
      };
    } catch (error) {
      console.error('API Error:', error);
      
      // Return mock data for development/testing
      if (process.env.NODE_ENV === 'development') {
        return this.getMockPrediction(request);
      }
      
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  async getAvailableModels(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/models`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Models info error:', error);
      return null;
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
      processing_time: request.model === 'svm' ? 50 : 120
    };
  }

  // Simulate network delay for better UX testing
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ApiService();