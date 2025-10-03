import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { motion, AnimatePresence } from 'framer-motion';
import { useConnection } from '../contexts/ConnectionContext';
import SpamLoadingSpinner from '../components/SpamLoadingSpinner';
import { MLModel, PredictionResult } from '../types';
import apiService from '../services/apiService';

interface TextInputScreenProps {
  selectedModel: MLModel;
  onBack: () => void;
  onResult: (result: PredictionResult, text: string) => void;
}

export const TextInputScreen: React.FC<TextInputScreenProps> = ({
  selectedModel,
  onBack,
  onResult
}) => {
  const { isConnected, isChecking, error: connectionError, retryConnection } = useConnection();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const textInputRef = useRef<TextInput>(null);
  
  useEffect(() => {
    const onChange = (result: any) => {
      setScreenData(result.window);
    };
    
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);
  const exampleTexts = {
    spam: [
      "FREE! You've won £1000! Call 08001234567 now!",
      "URGENT: Claim ur prize b4 midnight! Txt WIN to 85233",
      "Guaranteed loan! £5000 available today! Apply: bit.ly/loan123",
      "HOT singles in your area! Text MEET to 85233. £1.50/msg"
    ],
    ham: [
      "Hey, running 15 minutes late. Start without me",
      "Can you pick up milk on your way home? Thanks",
      "Meeting moved to 2pm tomorrow. Conference room B",
      "Your appointment is confirmed for Tuesday at 3pm"
    ]
  };

  const handleSubmit = async () => {
    // Check connection first
    if (!isConnected) {
      setError('No server connection. Please check if backend is running.');
      return;
    }

    if (!inputText.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    if (inputText.length < 5) {
      setError('Text is too short for accurate analysis');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiService.predict({
        text: inputText.trim(),
        model: selectedModel.id
      });

      // apiService.predict returns PredictionResult directly
      console.log('📝 Received prediction result:', result);
      
      // Simulate processing time for better UX
      setTimeout(() => {
        onResult(result, inputText.trim());
        setIsLoading(false);
      }, Math.min(selectedModel.processingTime || 100, 2000));

    } catch (err) {
      console.error('❌ Prediction error:', err);
      setError(`Failed to analyze text: ${err.message || 'Please try again.'}`);
      setIsLoading(false);
    }
  };

  const handleExampleSelect = (text: string) => {
    setInputText(text);
    setShowExamples(false);
    setError(null);
    textInputRef.current?.focus();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.4
      }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.3,
        duration: 0.5
      }
    },
    focus: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.4
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)',
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    },
    loading: {
      scale: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  const exampleVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const exampleItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const isDesktop = screenData.width > 768;

  // Show connection error if not connected
  if (!isConnected) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <motion.View
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={styles.errorContent}
          >
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Connection Lost</Text>
            <Text style={styles.errorMessage}>
              {connectionError || "Lost connection to server during text input."}
            </Text>
            
            <motion.View
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <TouchableOpacity
                style={styles.retryButton}
                onPress={retryConnection}
                activeOpacity={0.8}
              >
                <Text style={styles.retryButtonText}>🔄 Retry Connection</Text>
              </TouchableOpacity>
            </motion.View>
            
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>← Go Back</Text>
            </TouchableOpacity>
          </motion.View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Background Particles - Temporarily disabled */}
      <View style={styles.particlesContainer}>
        {/* Particles temporarily disabled for debugging */}
      </View>

      {/* Content */}
      <View style={[styles.content, { padding: isDesktop ? 20 : 15 }]}>
        {/* Header */}
        <View style={[styles.header, {
          marginTop: isDesktop ? 40 : 20,
          marginBottom: isDesktop ? 40 : 30,
          paddingHorizontal: isDesktop ? 20 : 15
        }]}>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <View style={styles.titleContainer}>
              <Text style={[styles.mainTitle, {
                fontSize: isDesktop ? 28 : 22,
                lineHeight: isDesktop ? 32 : 26
              }]}>
                SMS Spam Detection Using Machine Learning and Deep Learning
              </Text>
            </View>
            <View style={{ marginBottom: isDesktop ? 16 : 12 }}>
              <Text style={[styles.title, { fontSize: isDesktop ? 24 : 20 }]}>
                Enter SMS Text
              </Text>
              <Text style={[styles.subtitle, { 
                fontSize: isDesktop ? 16 : 14,
                marginTop: 4
              }]}>
                Using {selectedModel.name} • {selectedModel.accuracy}% accuracy
              </Text>
            </View>
          </motion.div>
        </View>

        {/* Input Container */}
        <View style={[styles.inputContainer, {
          paddingHorizontal: isDesktop ? 0 : 10,
          marginBottom: isDesktop ? 30 : 20
        }]}>
          <View style={[styles.inputBox, {
            borderColor: error ? '#ff6b6b' : '#e2e8f0',
            borderWidth: error ? 2 : 1,
            padding: isDesktop ? 20 : 15
          }]}>
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              placeholder="Type or paste the SMS message you want to analyze..."
              placeholderTextColor="#a0aec0"
              value={inputText}
              onChangeText={(text) => {
                setInputText(text);
                setError(null);
              }}
              multiline
              numberOfLines={6}
              maxLength={1000}
            />
            
            {/* Character Counter */}
            <View style={styles.characterCounter}>
              <Text style={{
                fontSize: 12,
                color: inputText.length > 900 ? '#ff6b6b' : '#718096'
              }}>
                {inputText.length}/1000 characters
              </Text>
              
              <TouchableOpacity
                onPress={() => setShowExamples(!showExamples)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: '#667eea',
                  borderRadius: 15,
                }}
              >
                <Text style={{ color: '#ffffff', fontSize: 12 }}>
                  {showExamples ? 'Hide' : 'Show'} Examples
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Examples */}
        <AnimatePresence>
          {showExamples && (
            <motion.div
              variants={exampleVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              style={{
                width: '100%',
                marginBottom: 30,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: 15,
                padding: 20,
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#2d3748',
                marginBottom: 15,
                textAlign: 'center'
              }}>
                Try These Examples
              </Text>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: screenData.width > 768 ? '1fr 1fr' : '1fr',
                gap: 20 
              }}>
                <div>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#e53e3e',
                    marginBottom: 10
                  }}>
                    🚫 Spam Examples
                  </Text>
                  {exampleTexts.spam.map((text, index) => (
                    <motion.div
                      key={`spam-${index}`}
                      variants={exampleItemVariants}
                      onClick={() => handleExampleSelect(text)}
                      style={{
                        padding: 10,
                        marginBottom: 8,
                        backgroundColor: '#fef5f5',
                        borderRadius: 8,
                        cursor: 'pointer',
                        border: '1px solid #fbb6ce',
                        fontSize: 12,
                        lineHeight: 16,
                        color: '#2d3748'
                      }}
                    >
                      {text}
                    </motion.div>
                  ))}
                </div>
                
                <div>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#38a169',
                    marginBottom: 10
                  }}>
                    ✅ Legitimate Examples
                  </Text>
                  {exampleTexts.ham.map((text, index) => (
                    <motion.div
                      key={`ham-${index}`}
                      variants={exampleItemVariants}
                      onClick={() => handleExampleSelect(text)}
                      style={{
                        padding: 10,
                        marginBottom: 8,
                        backgroundColor: '#f0fff4',
                        borderRadius: 8,
                        cursor: 'pointer',
                        border: '1px solid #9ae6b4',
                        fontSize: 12,
                        lineHeight: 16,
                        color: '#2d3748'
                      }}
                    >
                      {text}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                backgroundColor: '#fef5f5',
                color: '#e53e3e',
                padding: 12,
                borderRadius: 10,
                marginBottom: 20,
                border: '1px solid #fbb6ce',
                textAlign: 'center',
                fontSize: 14
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <View style={[styles.buttonContainer, {
          paddingHorizontal: isDesktop ? 20 : 15
        }]}>
          <motion.button
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover={!isLoading ? "hover" : undefined}
            whileTap={!isLoading ? "tap" : undefined}
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              background: isLoading 
                ? 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              padding: '16px 32px',
              borderRadius: 50,
              fontSize: 18,
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              minWidth: screenData.width > 768 ? 200 : '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10
            }}
          >
            {isLoading ? (
              <>
                <span>Analyzing...</span>
                <span style={{ fontSize: 20 }}>⏳</span>
              </>
            ) : (
              <>
                <span>Analyze Text</span>
                <span style={{ fontSize: 20 }}>🔍</span>
              </>
            )}
          </motion.button>

          <motion.button
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            onClick={onBack}
            disabled={isLoading}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#4a5568',
              padding: '16px 24px',
              borderRadius: 50,
              fontSize: 16,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              border: '1px solid #e2e8f0',
              backdropFilter: 'blur(10px)',
              width: screenData.width > 768 ? 'auto' : '100%',
              marginTop: screenData.width > 768 ? 0 : 10
            }}
          >
            ← Back to Models
          </motion.button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContent: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxWidth: 400,
    width: '100%',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 15,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 15,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#4a5568',
    fontWeight: '500',
    fontSize: 14,
  },
  contentContainer: {
    minHeight: '100%'
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1
  },
  particles: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  content: {
    position: 'relative',
    zIndex: 2,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center'
  },
  header: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 600
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16
  },
  mainTitle: {
    fontWeight: 'bold',
    color: '#667eea',
    textAlign: 'center'
  },
  title: {
    fontWeight: 'bold',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 4
  },
  inputContainer: {
    width: '100%',
    maxWidth: 600
  },
  inputBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 8
  },
  textInput: {
    fontSize: 16,
    color: '#2d3748',
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: 'top',
    width: '100%',
    fontFamily: 'System'
  },
  characterCounter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 500,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
    marginTop: 20
  }
});
