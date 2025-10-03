import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useConnection } from '../contexts/ConnectionContext';
import SpamLoadingSpinner from '../components/SpamLoadingSpinner';
import apiService from '../services/apiService';
import { MLModel } from '../types';

interface ModelSelectionScreenProps {
  onModelSelect: (model: MLModel) => void;
  selectedModel: MLModel | null;
}

export const ModelSelectionScreen: React.FC<ModelSelectionScreenProps> = ({
  onModelSelect,
  selectedModel
}) => {
  const { isConnected, isChecking, error, retryConnection } = useConnection();
  const [models, setModels] = useState<any[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [screenData, setScreenData] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  useEffect(() => {
    const handleResize = () => {
      setScreenData({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load models when connected
  useEffect(() => {
    if (isConnected) {
      loadModels();
    }
  }, [isConnected]);

  const loadModels = async () => {
    setLoadingModels(true);
    try {
      const result = await apiService.getAvailableModels();
      if (result.success && result.data) {
        const modelData = Object.entries(result.data.available_models).map(([key, model]: [string, any]) => ({
          id: key,
          name: model.name,
          accuracy: model.accuracy,
          description: model.training_focus || 'Advanced spam detection',
          processingTime: getProcessingTimeForModel(model.name)
        }));
        setModels(modelData);
      }
    } catch (error) {
      console.error('Failed to load models:', error);
    } finally {
      setLoadingModels(false);
    }
  };

  const getProcessingTimeForModel = (modelName: string): number => {
    if (modelName.includes('SVM')) return 45;
    if (modelName.includes('CatBoost')) return 85;
    if (modelName.includes('CNN')) return 150;
    if (modelName.includes('BiLSTM')) return 200;
    return 100;
  };

  const isDesktop = screenData.width > 768;

  // Show loading spinner while checking connection or loading models
  if (isChecking || loadingModels) {
    return (
      <div style={styles.loadingContainer}>
        <SpamLoadingSpinner 
          message={isChecking ? "Connecting to server..." : "Loading AI models..."} 
          size="large" 
        />
      </div>
    );
  }

  // Show error state if not connected
  if (!isConnected) {
    return (
      <div style={styles.errorContainer}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={styles.errorContent}
        >
          <span style={styles.errorIcon}>⚠️</span>
          <h2 style={styles.errorTitle}>Connection Required</h2>
          <p style={styles.errorMessage}>
            {error || "Cannot connect to server. Please ensure the backend is running."}
          </p>
          
          <motion.button
            style={styles.retryButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={retryConnection}
          >
            <span style={styles.retryButtonText}>🔄 Retry Connection</span>
          </motion.button>
          
          <p style={styles.helpText}>
            💡 Start the backend server
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.contentContainer}>
        {/* Header */}
        <div style={{
          ...styles.header,
          marginTop: isDesktop ? 40 : 20,
          marginBottom: isDesktop ? 40 : 30,
          paddingLeft: isDesktop ? 20 : 15,
          paddingRight: isDesktop ? 20 : 15,
        }}>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={styles.titleContainer}
          >
            <h1 style={{
              ...styles.mainTitle,
              fontSize: isDesktop ? 32 : 24,
              lineHeight: isDesktop ? '38px' : '28px'
            }}>
              SMS Spam Detection Using Machine Learning and Deep Learning
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ ...styles.subtitle, fontSize: isDesktop ? 18 : 16 }}
          >
            Choose your AI model for spam detection
          </motion.p>
        </div>

        {/* Model Cards */}
        <motion.div 
          style={{
            ...styles.cardsContainer,
            flexDirection: isDesktop ? 'row' : 'column',
            paddingLeft: isDesktop ? 20 : 15,
            paddingRight: isDesktop ? 20 : 15,
            gap: 15
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {models.map((model, index) => (
            <motion.div
              key={model.id}
              style={styles.modelCardContainer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.button
                style={{
                  ...styles.modelCard,
                  ...(selectedModel?.id === model.id ? styles.selectedCard : {})
                }}
                onClick={() => {
                  const mlModel: MLModel = {
                    id: model.id,
                    name: model.name,
                    accuracy: model.accuracy,
                    description: model.description,
                    features: [],
                    processingTime: model.processingTime
                  };
                  onModelSelect(mlModel);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Model Icon */}
                <div style={styles.modelIconContainer}>
                  <span style={styles.modelIcon}>
                    {model.name.includes('SVM') ? '⚡' : 
                     model.name.includes('CatBoost') ? '🧠' :
                     model.name.includes('CNN') ? '🔬' : '🎯'}
                  </span>
                </div>
                
                {/* Model Info */}
                <div style={styles.modelName}>{model.name}</div>
                <div style={styles.modelAccuracy}>{model.accuracy}% Accuracy</div>
                <div style={styles.processingTime}>~{model.processingTime}ms avg processing</div>
                
                {/* Selection Indicator */}
                {selectedModel?.id === model.id && (
                  <motion.div
                    style={styles.selectionIndicator}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span style={styles.checkIcon}>✓</span>
                  </motion.div>
                )}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Continue Button */}
        {selectedModel && (
          <motion.div
            style={styles.buttonContainer}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.button
              style={{ ...styles.continueButton, width: isDesktop ? 200 : '90%' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (selectedModel) {
                  onModelSelect(selectedModel);
                }
              }}
            >
              <span style={styles.buttonText}>Continue</span>
              <span style={styles.buttonIcon}>→</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const styles = {
  // Loading and Error States
  loadingContainer: {
    display: 'flex',
    minHeight: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
  } as React.CSSProperties,
  errorContainer: {
    display: 'flex',
    minHeight: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    padding: 20,
  } as React.CSSProperties,
  errorContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: 400,
    width: '100%',
  } as React.CSSProperties,
  errorIcon: {
    fontSize: 48,
    marginBottom: 20,
  } as React.CSSProperties,
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 15,
    textAlign: 'center',
    margin: '0 0 15px 0',
  } as React.CSSProperties,
  errorMessage: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: '22px',
    margin: '0 0 25px 0',
  } as React.CSSProperties,
  retryButton: {
    backgroundColor: '#667eea',
    padding: '12px 30px',
    borderRadius: 25,
    marginBottom: 20,
    border: 'none',
    cursor: 'pointer',
  } as React.CSSProperties,
  retryButtonText: {
    color: 'white',
    fontWeight: 600,
    fontSize: 16,
  } as React.CSSProperties,
  helpText: {
    fontSize: 14,
    color: '#a0aec0',
    textAlign: 'center',
    fontStyle: 'italic',
    margin: 0,
  } as React.CSSProperties,
  
  // Main UI
  container: {
    minHeight: '100vh',
    backgroundColor: '#f7fafc',
    overflow: 'auto',
  } as React.CSSProperties,
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  } as React.CSSProperties,
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 15,
  } as React.CSSProperties,
  mainTitle: {
    fontWeight: 'bold',
    color: '#2d3748',
    textAlign: 'center',
    letterSpacing: '-0.5px',
    margin: 0,
  } as React.CSSProperties,
  subtitle: {
    color: '#718096',
    textAlign: 'center',
    fontWeight: 500,
    letterSpacing: '0.3px',
    margin: 0,
  } as React.CSSProperties,
  cardsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    marginBottom: 30,
  } as React.CSSProperties,
  modelCardContainer: {
    flex: 1,
    minHeight: 180,
    maxWidth: 250,
    alignSelf: 'center',
    margin: 8,
  } as React.CSSProperties,
  modelCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    border: '2px solid transparent',
    position: 'relative',
    height: 180,
    cursor: 'pointer',
  } as React.CSSProperties,
  selectedCard: {
    borderColor: '#667eea',
    backgroundColor: '#f8faff',
  } as React.CSSProperties,
  modelIconContainer: {
    marginBottom: 12,
  } as React.CSSProperties,
  modelIcon: {
    fontSize: 32,
  } as React.CSSProperties,
  modelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 8,
  } as React.CSSProperties,
  modelAccuracy: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: 4,
  } as React.CSSProperties,
  processingTime: {
    fontSize: 12,
    color: '#a0aec0',
    textAlign: 'center',
  } as React.CSSProperties,
  selectionIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#667eea',
    borderRadius: 12,
    width: 24,
    height: 24,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as React.CSSProperties,
  checkIcon: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  } as React.CSSProperties,
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px 30px',
  } as React.CSSProperties,
  continueButton: {
    backgroundColor: '#667eea',
    padding: '16px 32px',
    borderRadius: 25,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 8px rgba(102, 126, 234, 0.3)',
    border: 'none',
    cursor: 'pointer',
  } as React.CSSProperties,
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 600,
    marginRight: 8,
  } as React.CSSProperties,
  buttonIcon: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  } as React.CSSProperties,
};
