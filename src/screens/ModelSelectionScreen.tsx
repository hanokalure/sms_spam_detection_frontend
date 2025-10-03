import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { motion } from 'framer-motion';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { ModelCard } from '../components/ModelCard';
import { getBackgroundParticles, clickParticles } from '../animations/particles';
import { MLModel, ML_MODELS } from '../types';

interface ModelSelectionScreenProps {
  onModelSelect: (model: MLModel) => void;
  selectedModel: MLModel | null;
}

export const ModelSelectionScreen: React.FC<ModelSelectionScreenProps> = ({
  onModelSelect,
  selectedModel
}) => {
  const [particlesLoaded, setParticlesLoaded] = useState(false);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  
  useEffect(() => {
    const onChange = (result: any) => {
      setScreenData(result.window);
    };
    
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
    setParticlesLoaded(true);
  }, []);

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: 'easeOut'
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5
      }
    }
  };

  const continueButtonVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 1.0,
        ease: 'easeOut'
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
    }
  };

  const isDesktop = screenData.width > 768;

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
          <View style={styles.titleContainer}>
            <Text style={[styles.mainTitle, {
              fontSize: isDesktop ? 32 : 24,
              lineHeight: isDesktop ? 38 : 28
            }]}>
              SMS Spam Detection Using Machine Learning and Deep Learning
            </Text>
          </View>
          
          <Text style={[styles.subtitle, { fontSize: isDesktop ? 18 : 16 }]}>
            Select the machine learning model that best fits your needs
          </Text>
        </View>

        {/* Model Cards */}
        <View style={[styles.cardsContainer, {
          flexDirection: isDesktop ? 'row' : 'column',
          paddingHorizontal: isDesktop ? 0 : 10
        }]}>
          {ML_MODELS.map((model, index) => (
            <View
              key={model.id}
              style={{ flex: isDesktop ? 1 : undefined, maxWidth: isDesktop ? 400 : '100%' }}
            >
              <ModelCard
                model={model}
                isSelected={selectedModel?.id === model.id}
                onSelect={onModelSelect}
                index={index}
              />
            </View>
          ))}
        </View>

        {/* Continue Button */}
        {selectedModel && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.continueButton, { width: isDesktop ? 200 : '100%' }]}
              onPress={() => {
                if (selectedModel) {
                  onModelSelect(selectedModel);
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Continue</Text>
              <Text style={styles.buttonIcon}>→</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Model Comparison */}
        <View style={[styles.comparisonContainer, {
          padding: isDesktop ? 20 : 15,
          marginHorizontal: isDesktop ? 0 : 10,
          marginBottom: 30
        }]}>
          <Text style={styles.comparisonTitle}>Quick Comparison</Text>
          
          <View style={[styles.comparisonGrid, {
            flexDirection: isDesktop ? 'row' : 'column'
          }]}>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonModelTitle}>SVM Model</Text>
              <Text style={styles.comparisonModelDesc}>
                ⚡ Fastest processing • 🎯 Highest accuracy • 📊 Real-time ready
              </Text>
            </View>
            
            <View style={[styles.comparisonItem, { marginTop: isDesktop ? 0 : 15 }]}>
              <Text style={styles.comparisonModelTitle}>CatBoost Model</Text>
              <Text style={styles.comparisonModelDesc}>
                🧠 Advanced learning • 🔍 Pattern detection • 🛡️ Edge case handling
              </Text>
            </View>
          </View>
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
    justifyContent: 'flex-start'
  },
  header: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 800
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16
  },
  mainTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    // Using color instead of gradient since gradient text doesn't work well in RN
    color: '#667eea'
  },
  subtitle: {
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 600,
    paddingHorizontal: 20
  },
  cardsContainer: {
    width: '100%',
    maxWidth: 900,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 20
  },
  continueButton: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8
  },
  buttonIcon: {
    color: '#ffffff',
    fontSize: 20
  },
  comparisonContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    width: '100%',
    maxWidth: 600,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 5
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 12
  },
  comparisonGrid: {
    justifyContent: 'space-between'
  },
  comparisonItem: {
    flex: 1,
    alignItems: 'center'
  },
  comparisonModelTitle: {
    fontWeight: 'bold',
    color: '#4c51bf',
    fontSize: 14,
    marginBottom: 4
  },
  comparisonModelDesc: {
    color: '#4a5568',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18
  }
});
