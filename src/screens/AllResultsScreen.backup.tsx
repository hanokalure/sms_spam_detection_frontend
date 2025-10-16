import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { motion, AnimatePresence } from 'framer-motion';
import { MultiModelPredictionResult } from '../types';

interface AllResultsScreenProps {
  results: MultiModelPredictionResult;
  onNewAnalysis: () => void;
}

export const AllResultsScreen: React.FC<AllResultsScreenProps> = ({
  results,
  onNewAnalysis
}) => {
  const [showInputText, setShowInputText] = useState(false);
  const { width: screenWidth } = Dimensions.get('window');
  const isDesktop = screenWidth > 768;
  const isMobile = screenWidth <= 768;

  // Calculate overall consensus
  const spamCount = results.results.filter(r => r.prediction === 'spam').length;
  const hamCount = results.results.filter(r => r.prediction === 'ham').length;
  const overallPrediction = spamCount > hamCount ? 'spam' : 'ham';
  const consensusPercentage = Math.round((Math.max(spamCount, hamCount) / results.results.length) * 100);

  const getModelIcon = (modelId: string) => {
    switch (modelId) {
      case 'svm': return '⚡';
      case 'xgboost': return '🎯';
      case 'distilbert_v2': return '🧠';
      case 'roberta': return '🔬';
      default: return '🤖';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return '#10B981'; // Green
    if (confidence >= 0.7) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: isMobile ? 1 : 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: isMobile ? 0.3 : 0.6,
        ease: isMobile ? 'easeOut' : [0.6, -0.05, 0.01, 0.99],
        staggerChildren: isMobile ? 0.05 : 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: isMobile ? 20 : 30, scale: isMobile ? 1 : 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: isMobile ? 0.4 : 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, {
        backgroundColor: overallPrediction === 'spam' ? '#fdf2f2' : '#f0fff4'
      }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Animated Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          backgroundColor: overallPrediction === 'spam' 
            ? ['#fdf2f2', '#fed7d7', '#fdf2f2'] 
            : ['#f0fff4', '#c6f6d5', '#f0fff4']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0
        }}
      />
      
      {/* Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={[
          styles.content,
          {
            paddingHorizontal: isMobile ? 16 : 24,
            paddingVertical: isMobile ? 20 : 40
          }
        ]}
      >
        {/* Header */}
        <View style={[
          styles.header,
          {
            marginBottom: isMobile ? 24 : 32
          }
        ]}>
          <View style={styles.titleContainer}>
            <Text style={[
              styles.mainTitle,
              {
                fontSize: isDesktop ? 28 : 22,
                lineHeight: isDesktop ? 32 : 26
              }
            ]}>
              SMS Spam Detection Results
            </Text>
          </View>
          <Text style={[
            styles.subtitle,
            { 
              fontSize: isDesktop ? 16 : 14,
              paddingHorizontal: isMobile ? 8 : 0,
              marginTop: 4
            }
          ]}>
            Analysis completed with 4 AI models • Processing time: {results.totalProcessingTime}ms
          </Text>
        </View>

        {/* Overall Result Summary */}
        <motion.div
          variants={cardVariants}
          style={[
            styles.summaryCard,
            {
              backgroundColor: overallPrediction === 'spam' 
                ? 'rgba(254, 245, 245, 0.95)' 
                : 'rgba(240, 255, 244, 0.95)',
              borderColor: overallPrediction === 'spam' ? '#fc8181' : '#68d391',
              paddingHorizontal: isMobile ? 20 : 40,
              paddingVertical: isMobile ? 25 : 35,
              marginHorizontal: isMobile ? 16 : 0,
              marginBottom: isMobile ? 20 : 30
            }
          ]}
        >
          {/* Result Icon */}
          <View style={{
            alignItems: 'center',
            marginBottom: 20
          }}>
            <Text style={{ fontSize: 60 }}>
              {overallPrediction === 'spam' ? '🚫' : '✅'}
            </Text>
          </View>

          {/* Overall Result */}
          <Text style={{
            fontSize: isDesktop ? 28 : 22,
            fontWeight: 'bold',
            color: overallPrediction === 'spam' ? '#c53030' : '#2f855a',
            marginBottom: isMobile ? 8 : 10,
            textAlign: 'center'
          }}>
            {overallPrediction === 'spam' ? 'SPAM DETECTED' : 'NOT SPAM (HAM)'}
          </Text>

          <Text style={{
            fontSize: isDesktop ? 16 : 14,
            color: overallPrediction === 'spam' ? '#742a2a' : '#1a365d',
            marginBottom: isMobile ? 15 : 20,
            textAlign: 'center',
            lineHeight: isDesktop ? 20 : 18
          }}>
            {consensusPercentage}% model consensus • {spamCount} models detected spam, {hamCount} detected ham
          </Text>

          {/* Show Input Text Toggle */}
          <TouchableOpacity
            onPress={() => setShowInputText(!showInputText)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: overallPrediction === 'spam' ? '#fc8181' : '#68d391',
              alignSelf: 'center'
            }}
          >
            <Text style={{ 
              color: overallPrediction === 'spam' ? '#c53030' : '#2f855a',
              fontSize: 12,
              fontWeight: '500'
            }}>
              {showInputText ? 'Hide' : 'Show'} Original Text
            </Text>
          </TouchableOpacity>

          {/* Original Text */}
          <AnimatePresence>
            {showInputText && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  marginTop: 15,
                  padding: 15,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 10,
                  border: `1px solid ${overallPrediction === 'spam' ? '#fbb6ce' : '#9ae6b4'}`
                }}
              >
                <Text style={{
                  fontSize: 14,
                  color: '#2d3748',
                  lineHeight: 18,
                  fontStyle: 'italic'
                }}>
                  "{results.inputText}"
                </Text>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Individual Model Results */}
        <motion.div
          variants={cardVariants}
          style={{
            marginBottom: 30
          }}
        >
          <Text style={[
            styles.sectionTitle,
            {
              fontSize: isDesktop ? 22 : 18,
              marginBottom: isMobile ? 16 : 20,
              textAlign: 'center',
              marginHorizontal: isMobile ? 16 : 0
            }
          ]}>
            Individual Model Results
          </Text>

          <View style={{
            flexDirection: isDesktop ? 'row' : 'column',
            flexWrap: 'wrap',
            paddingHorizontal: isMobile ? 16 : 0,
            justifyContent: 'space-between'
          }}>
            {results.results.map((result, index) => (
              <motion.div
                key={result.modelId}
                variants={cardVariants}
                transition={{ delay: index * 0.1 }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 16,
                  padding: isMobile ? 16 : 20,
                  border: `2px solid ${result.prediction === 'spam' ? '#fc8181' : '#68d391'}`,
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  width: isDesktop ? '48%' : '100%',
                  marginBottom: 16
                }}>
              >
                {/* Background Pattern */}
                <View style={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: result.prediction === 'spam' 
                    ? 'rgba(252, 129, 129, 0.1)' 
                    : 'rgba(104, 211, 145, 0.1)'
                }} />

                {/* Model Icon & Name */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12
                }}>
                  <Text style={{ fontSize: 24, marginRight: 8 }}>
                    {getModelIcon(result.modelId)}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: isDesktop ? 16 : 14,
                      fontWeight: 'bold',
                      color: '#1e293b',
                      marginBottom: 2
                    }}>
                      {result.modelName}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: '#64748b'
                    }}>
                      {result.modelAccuracy}% accuracy
                    </Text>
                  </View>
                </View>

                {/* Prediction Result */}
                <View style={{
                  backgroundColor: result.prediction === 'spam' ? '#fee2e2' : '#ecfdf5',
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: result.prediction === 'spam' ? '#fca5a5' : '#86efac'
                }}>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Text style={{
                      fontSize: isDesktop ? 16 : 14,
                      fontWeight: 'bold',
                      color: result.prediction === 'spam' ? '#dc2626' : '#059669'
                    }}>
                      {result.prediction === 'spam' ? 'SPAM' : 'HAM'}
                    </Text>
                    <Text style={{
                      fontSize: 20
                    }}>
                      {result.prediction === 'spam' ? '🚨' : '✅'}
                    </Text>
                  </View>
                </View>

                {/* Confidence */}
                <View style={{
                  marginBottom: 8
                }}>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: '500',
                      color: '#4a5568'
                    }}>
                      Confidence
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: getConfidenceColor(result.confidence)
                    }}>
                      {(result.confidence * 100).toFixed(1)}%
                  </Text>
                  </View>
                  
                {/* Confidence Bar */}
                  <View style={{
                    height: 6,
                    backgroundColor: '#e2e8f0',
                    borderRadius: 3,
                    overflow: 'hidden'
                  }}>
                    <View
                      style={{
                        height: '100%',
                        width: `${result.confidence * 100}%`,
                        backgroundColor: getConfidenceColor(result.confidence),
                        borderRadius: 3
                      }}
                    />
                  </View>
                </View>

                {/* Processing Time */}
                <Text style={{
                  fontSize: 11,
                  color: '#a0aec0',
                  textAlign: 'center'
                }}>
                  Processed in {result.processing_time || 'N/A'}ms
                </Text>
              </motion.div>
            ))}
          </View>
        </motion.div>

        {/* Action Button */}
        <View style={[
          styles.buttonContainer,
          {
            marginHorizontal: isMobile ? 16 : 0,
            gap: isMobile ? 12 : 16,
            flexDirection: isMobile ? 'column' : 'row'
          }
        ]}>
          <TouchableOpacity
            onPress={onNewAnalysis}
            style={{
              backgroundColor: '#667eea',
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 25,
              minWidth: isDesktop ? 200 : '100%',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#667eea',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 15,
              elevation: 8
            }}
          >
            <Text style={{
              color: '#ffffff',
              fontSize: 18,
              fontWeight: 'bold'
            }}>New Analysis 🔍</Text>
          </TouchableOpacity>
        </View>
      </motion.div>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    minHeight: '100%'
  },
  content: {
    position: 'relative',
    zIndex: 2,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxWidth: 1000,
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
  subtitle: {
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 4
  },
  summaryCard: {
    borderRadius: 25,
    borderWidth: 3,
    alignItems: 'center',
    maxWidth: 600,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 35,
    elevation: 15
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 500,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
    marginBottom: 30
  }
});