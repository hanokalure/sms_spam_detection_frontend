export interface MLModel {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  type: 'svm' | 'catboost' | 'torch';
  features: string[];
  processingTime: number; // in milliseconds
}

export interface PredictionRequest {
  text: string;
  model: string;
}

export interface PredictionResult {
  prediction: 'spam' | 'ham';
  confidence: number;
  processed_text?: string;
  features_detected?: {
    has_currency?: number;
    has_url?: number;
    has_phone?: number;
    has_shortcode?: number;
    exclamation_count?: number;
    spam_word_count?: number;
    [key: string]: any;
  };
  processing_time?: number;
}

export interface ModelPredictionResult {
  modelId: string;
  modelName: string;
  modelAccuracy: number;
  prediction: 'spam' | 'ham';
  confidence: number;
  processing_time?: number;
}

export interface MultiModelPredictionResult {
  inputText: string;
  results: ModelPredictionResult[];
  totalProcessingTime: number;
  timestamp: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: number;
}

export interface AnimationConfig {
  duration: number;
  delay?: number;
  ease?: string;
}

export interface ParticleConfig {
  count: number;
  color: string[];
  size: {
    min: number;
    max: number;
  };
  speed: {
    min: number;
    max: number;
  };
}

export interface NavigationState {
  selectedModel: MLModel | null;
  inputText: string;
  result: PredictionResult | null;
  isLoading: boolean;
}

export const ML_MODELS: MLModel[] = [
  {
    id: 'xgboost',
    name: 'XGBoost High-Accuracy',
    description: 'Advanced gradient boosting model with superior feature engineering. Excellent for complex spam patterns with high accuracy.',
    accuracy: 98,
    type: 'svm',
    features: [
      'Gradient Boosting',
      'Feature Engineering',
      'Pattern Recognition',
      'High Accuracy'
    ],
    processingTime: 85
  },
  {
    id: 'svm',
    name: 'SVM (Support Vector Machine)',
    description: 'Fast, reliable baseline with character n-grams. Excellent for real-time classification with consistent performance.',
    accuracy: 87,
    type: 'svm',
    features: [
      'Character N-grams',
      'Text Length Analysis',
      'Special Character Detection',
      'Fast Processing'
    ],
    processingTime: 50
  }
];
