import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { motion, AnimatePresence } from 'framer-motion';
import { useConnection } from '../contexts/ConnectionContext';
import SpamLoadingSpinner from '../components/SpamLoadingSpinner';
import { MultiModelPredictionResult } from '../types';
import apiService from '../services/apiService';

// Sample messages for typing animation
const DEMO_MESSAGES = {
  spam: [
    "CONGRATULATIONS! You've won $1000! Click here to claim your prize NOW!",
    "URGENT: Your account will be suspended. Call 1-800-SCAM-NOW immediately!",
    "FREE iPhone 15! Limited time offer. Reply YES to claim your free gift!",
    "You have been selected for a cash prize of $5000. Text WINNER to 12345"
  ],
  ham: [
    "Hey, are we still meeting for lunch at 2pm? Let me know if you need to reschedule.",
    "Thanks for the great presentation today. The client was really impressed!",
    "Don't forget to pick up milk on your way home. See you tonight!",
    "Your package has been delivered. Thank you for choosing our service."
  ]
};

interface HomeScreenProps {
  onResult: (result: MultiModelPredictionResult) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onResult
}) => {
  const { isConnected, isChecking, error: connectionError, retryConnection } = useConnection();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const textInputRef = useRef<TextInput>(null);
  
  // Typing animation states
  const [currentText, setCurrentText] = useState('');
  const [currentMessageType, setCurrentMessageType] = useState<'spam' | 'ham'>('spam');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showResult, setShowResult] = useState(false);
  
  useEffect(() => {
    const onChange = (result: any) => {
      setScreenData(result.window);
    };
    
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  // Typing animation effect
  useEffect(() => {
    const messages = DEMO_MESSAGES[currentMessageType];
    const targetMessage = messages[currentMessageIndex];
    
    if (isTyping && currentText.length < targetMessage.length) {
      const timeout = setTimeout(() => {
        setCurrentText(targetMessage.slice(0, currentText.length + 1));
      }, 50 + Math.random() * 100);
      return () => clearTimeout(timeout);
    } else if (isTyping && currentText.length === targetMessage.length) {
      setShowResult(true);
      const timeout = setTimeout(() => {
        setShowResult(false);
        setIsTyping(false);
        const clearTimeout = setTimeout(() => {
          setCurrentText('');
          setCurrentMessageType(currentMessageType === 'spam' ? 'ham' : 'spam');
          setCurrentMessageIndex((prev) => 
            (prev + 1) % DEMO_MESSAGES[currentMessageType === 'spam' ? 'ham' : 'spam'].length
          );
          setIsTyping(true);
        }, 1000);
        return () => clearTimeout(clearTimeout);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [currentText, isTyping, currentMessageType, currentMessageIndex]);

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
      const result = await apiService.predictWithAllModels(inputText.trim());
      console.log('📝 Received multi-model prediction result:', result);
      
      // Add small delay for better UX
      setTimeout(() => {
        onResult(result);
        setIsLoading(false);
      }, 1000);

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

  const isDesktop = screenData.width > 768;

  // Show loading spinner while checking connection
  if (isChecking) {
    return (
      <div style={styles.loadingContainer}>
        <SpamLoadingSpinner 
          message="Connecting to server..." 
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
            {connectionError || "Cannot connect to server. Please ensure the backend is running."}
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
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Enhanced Animated Background */}
      <div style={styles.backgroundPattern}>
        <div style={styles.patternCircle1}></div>
        <div style={styles.patternCircle2}></div>
        <div style={styles.patternCircle3}></div>
        <div style={styles.patternCircle4}></div>
        <div style={styles.patternCircle5}></div>
        <div style={styles.floatingElement1}></div>
        <div style={styles.floatingElement2}></div>
      </div>
      
      <div style={styles.content}>
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
            Advanced AI analysis with 4 different models for accurate spam detection
          </motion.p>
        </div>
        
        {/* Live Typing Demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            ...styles.liveDemoSection,
            marginBottom: isDesktop ? 50 : 35,
            paddingLeft: isDesktop ? 20 : 15,
            paddingRight: isDesktop ? 20 : 15,
          }}
        >
          <div style={{
            ...styles.liveDemoContainer,
            padding: isDesktop ? '40px' : '30px 20px',
          }}>
            <div style={styles.demoInputContainer}>
              {/* Message Type Badge */}
              <motion.div
                key={currentMessageType}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  ...styles.messageTypeBadge,
                  backgroundColor: currentMessageType === 'spam' ? '#fee2e2' : '#ecfdf5',
                  color: currentMessageType === 'spam' ? '#dc2626' : '#059669',
                  border: `2px solid ${currentMessageType === 'spam' ? '#fca5a5' : '#86efac'}`,
                  fontSize: isDesktop ? 14 : 13,
                  padding: isDesktop ? '8px 20px' : '6px 16px',
                  minWidth: isDesktop ? 150 : 130,
                }}
              >
                {currentMessageType === 'spam' ? '🚀 Testing SPAM' : '💬 Testing HAM'}
              </motion.div>
              
              {/* Typing Input Box */}
              <div style={{
                ...styles.demoInputBox,
                borderColor: currentMessageType === 'spam' ? '#f87171' : '#4ade80',
                padding: isDesktop ? '20px 24px' : '16px 20px',
                minHeight: isDesktop ? 80 : 70,
              }}>
                <div style={{
                  ...styles.demoInputText,
                  fontSize: isDesktop ? 16 : 15,
                  lineHeight: isDesktop ? '24px' : '22px',
                }}>
                  {currentText}
                  <span style={{
                    ...styles.cursor,
                    opacity: isTyping ? 1 : 0
                  }}>|</span>
                </div>
              </div>
              
              {/* Live Result */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    ...styles.liveResult,
                    backgroundColor: currentMessageType === 'spam' ? '#fee2e2' : '#ecfdf5',
                    borderColor: currentMessageType === 'spam' ? '#f87171' : '#4ade80',
                    padding: isDesktop ? '16px 24px' : '14px 20px',
                    gap: isDesktop ? 15 : 12,
                  }}
                >
                  <div style={styles.resultIcon}>
                    {currentMessageType === 'spam' ? '🚨' : '✅'}
                  </div>
                  <div>
                    <div style={{
                      ...styles.resultText,
                      color: currentMessageType === 'spam' ? '#dc2626' : '#059669'
                    }}>
                      {currentMessageType === 'spam' ? 'SPAM DETECTED' : 'LEGITIMATE MESSAGE'}
                    </div>
                    <div style={styles.resultConfidence}>
                      Confidence: {currentMessageType === 'spam' ? '94%' : '92%'}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Input Section */}
        <div style={{
          width: '100%',
          maxWidth: 800,
          paddingHorizontal: isDesktop ? 20 : 15,
          marginBottom: isDesktop ? 30 : 20
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{
              textAlign: 'center',
              marginBottom: isDesktop ? 30 : 25,
            }}
          >
            <h2 style={styles.inputSectionTitle}>Enter Your SMS Text</h2>
            <p style={styles.inputSectionSubtitle}>Our AI will analyze it with 4 different models simultaneously</p>
          </motion.div>

          <div style={{
            ...styles.inputBox,
            borderColor: error ? '#ff6b6b' : '#e2e8f0',
            borderWidth: error ? 2 : 1,
            padding: isDesktop ? 20 : 15
          }}>
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
          </div>
        </div>

        {/* Examples */}
        <AnimatePresence>
          {showExamples && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                width: '100%',
                maxWidth: 800,
                marginBottom: 30,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: 15,
                padding: 20,
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                marginHorizontal: isDesktop ? 20 : 15
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
                fontSize: 14,
                maxWidth: 800,
                width: '100%',
                marginHorizontal: isDesktop ? 20 : 15
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analyze Button */}
        <div style={{
          width: '100%',
          maxWidth: 500,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: isDesktop ? 20 : 15
        }}>
          <motion.button
            onClick={handleSubmit}
            disabled={isLoading}
            whileHover={!isLoading ? { scale: 1.05 } : undefined}
            whileTap={!isLoading ? { scale: 0.95 } : undefined}
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
                <span>Analyzing with 4 models...</span>
                <span style={{ fontSize: 20 }}>⏳</span>
              </>
            ) : (
              <>
                <span>Analyze Text</span>
                <span style={{ fontSize: 20 }}>🔍</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </ScrollView>
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
    flex: 1,
    backgroundColor: '#f7fafc'
  } as React.CSSProperties,
  contentContainer: {
    minHeight: '100vh',
    backgroundColor: 'transparent'
  } as React.CSSProperties,
  content: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
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
    color: '#1a202c',
    textAlign: 'center',
    letterSpacing: '-0.5px',
    margin: 0,
  } as React.CSSProperties,
  subtitle: {
    color: '#64748b',
    textAlign: 'center',
    fontWeight: 500,
    letterSpacing: '0.3px',
    margin: 0,
  } as React.CSSProperties,
  
  // Live Demo Section
  liveDemoSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '100vw',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  
  liveDemoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(25px)',
    borderRadius: 20,
    padding: '30px 20px',
    maxWidth: 700,
    width: '100%',
    margin: '0 auto',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  
  demoInputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    alignItems: 'center',
  } as React.CSSProperties,
  
  messageTypeBadge: {
    padding: '8px 20px',
    borderRadius: 25,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    minWidth: 150,
    boxSizing: 'border-box',
  } as React.CSSProperties,
  
  demoInputBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: '16px 20px',
    width: '100%',
    maxWidth: 600,
    border: '3px solid',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    minHeight: 80,
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  
  demoInputText: {
    fontSize: 16,
    lineHeight: '24px',
    color: '#1f2937',
    width: '100%',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
  } as React.CSSProperties,
  
  cursor: {
    display: 'inline-block',
    width: '2px',
    marginLeft: '2px',
    color: '#3b82f6',
    animation: 'blink 1s infinite',
  } as React.CSSProperties,
  
  liveResult: {
    display: 'flex',
    alignItems: 'center',
    gap: 15,
    padding: '16px 20px',
    borderRadius: 16,
    border: '2px solid',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    maxWidth: 400,
    width: '100%',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  
  resultIcon: {
    fontSize: 24,
    flexShrink: 0,
  } as React.CSSProperties,
  
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  } as React.CSSProperties,
  
  resultConfidence: {
    fontSize: 14,
    color: '#6b7280',
    margin: 0,
  } as React.CSSProperties,
  
  // Input Section
  inputSectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    margin: '0 0 8px 0',
  } as React.CSSProperties,
  
  inputSectionSubtitle: {
    fontSize: 16,
    color: '#64748b',
    margin: 0,
  } as React.CSSProperties,
  
  inputBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 8,
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0'
  } as React.CSSProperties,
  
  textInput: {
    fontSize: 16,
    color: '#2d3748',
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: 'top',
    width: '100%',
    fontFamily: 'System',
    border: 'none',
    outline: 'none',
    resize: 'none'
  } as React.CSSProperties,
  
  characterCounter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    display: 'flex'
  } as React.CSSProperties,
  
  // Background pattern
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    overflow: 'hidden',
    zIndex: 1,
  } as React.CSSProperties,
  
  patternCircle1: {
    position: 'absolute',
    top: '10%',
    right: '20%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%)',
    animation: 'gentleFloat 20s ease-in-out infinite',
  } as React.CSSProperties,
  
  patternCircle2: {
    position: 'absolute',
    bottom: '20%',
    left: '10%',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.02) 0%, transparent 70%)',
    animation: 'gentleFloat 25s ease-in-out infinite reverse',
  } as React.CSSProperties,
  
  patternCircle3: {
    position: 'absolute',
    top: '50%',
    right: '5%',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.02) 0%, transparent 70%)',
    animation: 'gentleFloat 30s ease-in-out infinite',
  } as React.CSSProperties,
  
  patternCircle4: {
    position: 'absolute',
    bottom: '10%',
    right: '30%',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.03) 0%, transparent 70%)',
    animation: 'gentleFloat 18s ease-in-out infinite',
  } as React.CSSProperties,
  
  patternCircle5: {
    position: 'absolute',
    top: '30%',
    left: '5%',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.04) 0%, transparent 70%)',
    animation: 'gentleFloat 22s ease-in-out infinite reverse',
  } as React.CSSProperties,
  
  floatingElement1: {
    position: 'absolute',
    top: '20%',
    right: '10%',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'rgba(59, 130, 246, 0.4)',
    animation: 'gentleFloat 15s ease-in-out infinite',
  } as React.CSSProperties,
  
  floatingElement2: {
    position: 'absolute',
    bottom: '40%',
    left: '15%',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: 'rgba(168, 85, 247, 0.4)',
    animation: 'gentleFloat 12s ease-in-out infinite reverse',
  } as React.CSSProperties,
} as const;