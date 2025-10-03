import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { getSuccessParticles, getErrorParticles, getBackgroundParticles } from '../animations/particles';
import { MLModel, PredictionResult } from '../types';

interface ResultsScreenProps {
  selectedModel: MLModel;
  result: PredictionResult;
  inputText: string;
  onBack: () => void;
  onNewAnalysis: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  selectedModel,
  result,
  inputText,
  onBack,
  onNewAnalysis
}) => {
  const [particlesLoaded, setParticlesLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
    setParticlesLoaded(true);
  }, []);

  const { width: screenWidth } = Dimensions.get('window');
  const isDesktop = screenWidth > 768;
  const isMobile = screenWidth <= 768;

  const isSpam = result.prediction === 'spam';
  const confidencePercentage = (result.confidence * 100).toFixed(1);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return '#10B981'; // Green
    if (confidence >= 0.7) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const getConfidenceDescription = (confidence: number) => {
    if (confidence >= 0.95) return 'Very High';
    if (confidence >= 0.85) return 'High';
    if (confidence >= 0.75) return 'Good';
    if (confidence >= 0.60) return 'Moderate';
    return 'Low';
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

  const resultCardVariants = {
    hidden: { opacity: 0, y: isMobile ? 20 : 50, scale: isMobile ? 1 : 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: isMobile ? 0.4 : 0.7,
        ease: 'easeOut'
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.3,
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: {
      width: `${result.confidence * 100}%`,
      transition: {
        delay: 0.5,
        duration: 1.5,
        ease: 'easeOut'
      }
    }
  };

  const detailsVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      overflow: 'hidden'
    },
    visible: {
      opacity: 1,
      height: 'auto',
      overflow: 'visible',
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, {
        backgroundColor: isSpam ? '#fdf2f2' : '#f0fff4'
      }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Animated Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          backgroundColor: isSpam ? ['#fdf2f2', '#fed7d7', '#fdf2f2'] : ['#f0fff4', '#c6f6d5', '#f0fff4']
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
      
      {/* Background Particles - Temporarily disabled */}
      <View style={styles.particlesContainer}>
        {/* Particles temporarily disabled for debugging */}
      </View>

      {/* Content */}
      <View style={[
        styles.content,
        {
          paddingHorizontal: isMobile ? 16 : 24,
          paddingVertical: isMobile ? 20 : 40
        }
      ]}>
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
              SMS Spam Detection
            </Text>
          </View>
          <View style={{ marginBottom: isDesktop ? 16 : 12 }}>
            <Text style={[
              styles.title,
              { 
                fontSize: isDesktop ? 24 : 20,
                lineHeight: isDesktop ? 28 : 24
              }
            ]}>
              Analysis Complete
            </Text>
            <Text style={[
              styles.subtitle,
              { 
                fontSize: isDesktop ? 16 : 14,
                paddingHorizontal: isMobile ? 8 : 0,
                marginTop: 4
              }
            ]}>
              {selectedModel.name} • Processing time: {result.processing_time || selectedModel.processingTime}ms
            </Text>
          </View>
        </View>

        {/* Main Result Card */}
        <View style={[
          styles.resultCard,
          {
            backgroundColor: isSpam 
              ? 'rgba(254, 245, 245, 0.95)' 
              : 'rgba(240, 255, 244, 0.95)',
            borderColor: isSpam ? '#fc8181' : '#68d391',
            paddingHorizontal: isMobile ? 20 : 40,
            paddingVertical: isMobile ? 25 : 35,
            marginHorizontal: isMobile ? 16 : 0
          }
        ]}>
          {/* Background Pattern */}
          <View style={[styles.backgroundPattern, {
            backgroundColor: isSpam 
              ? 'rgba(252, 129, 129, 0.1)' 
              : 'rgba(104, 211, 145, 0.1)'
          }]} />

          {/* Result Icon */}
          <View style={{
            alignItems: 'center',
            marginBottom: 20
          }}>
            <Text style={{ fontSize: 80 }}>
              {isSpam ? '🚫' : '✅'}
            </Text>
          </View>

          {/* Result Text */}
          <Text style={{
            fontSize: isDesktop ? 32 : 24,
            fontWeight: 'bold',
            color: isSpam ? '#c53030' : '#2f855a',
            marginBottom: isMobile ? 8 : 10,
            textAlign: 'center'
          }}>
            {isSpam ? 'SPAM DETECTED' : 'NOT SPAM (HAM)'}
          </Text>

          <Text style={{
            fontSize: isDesktop ? 18 : 16,
            color: isSpam ? '#742a2a' : '#1a365d',
            marginBottom: isMobile ? 20 : 30,
            textAlign: 'center',
            lineHeight: isDesktop ? 22 : 20
          }}>
            {isSpam 
              ? 'This message appears to be spam or potentially malicious'
              : 'This message appears to be legitimate and safe (HAM)'
            }
          </Text>

        </View>



        {/* Action Buttons */}
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

          <TouchableOpacity
            onPress={onBack}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              paddingHorizontal: 24,
              paddingVertical: 16,
              borderRadius: 25,
              borderWidth: 1,
              borderColor: '#e2e8f0',
              width: isDesktop ? 'auto' : '100%',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{
              color: '#4a5568',
              fontSize: 16
            }}>← Back to Model</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    justifyContent: 'flex-start',
    maxWidth: 900,
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
  resultCard: {
    borderRadius: 25,
    marginBottom: 30,
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
  backgroundPattern: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75
  },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    marginBottom: 30,
    maxWidth: 600,
    width: '100%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5
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
