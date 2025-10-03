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
    id: 'svm',
    name: 'SVM (Support Vector Machine)',
    description: 'Fast, reliable baseline with character n-grams. Excellent for real-time classification with consistent performance.',
    accuracy: 99.93,
    type: 'svm',
    features: [
      'Character N-grams',
      'Text Length Analysis',
      'Special Character Detection',
      'Fast Processing'
    ],
    processingTime: 50
  },
  {
    id: 'catboost',
    name: 'CatBoost (Gradient Boosting)',
    description: 'Advanced tree-based model with mixed features. Superior handling of complex patterns and edge cases.',
    accuracy: 99.81,
    type: 'catboost',
    features: [
      'Tree-based Learning',
      'Feature Engineering',
      'Pattern Recognition',
      'Edge Case Handling'
    ],
    processingTime: 120
  },
  {
    id: 'dl_cnn',
    name: 'DL CNN (PyTorch)',
    description: 'Deep learning CNN model with multiple convolutional layers and global max pooling for robust text features.',
    accuracy: 95.8,
    type: 'torch',
    features: [
      'Embedding + Conv1D stacks',
      'Global Max Pooling',
      'Dropout Regularization',
      'Good on complex spam patterns'
    ],
    processingTime: 150
  }
];
