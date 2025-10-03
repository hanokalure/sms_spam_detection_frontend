import React, { useState, useEffect, memo, useCallback } from 'react';
import { Text, Dimensions, View, StyleSheet, TouchableOpacity } from 'react-native';
import { motion } from 'framer-motion';
import { MLModel } from '../types';

interface ModelCardProps {
  model: MLModel;
  isSelected: boolean;
  onSelect: (model: MLModel) => void;
  index: number;
}

const ModelCardComponent: React.FC<ModelCardProps> = ({
  model, 
  isSelected, 
  onSelect, 
  index 
}) => {
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  
  useEffect(() => {
    const onChange = (result: any) => {
      setScreenData(result.window);
    };
    
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);
  
  const isDesktop = screenData.width > 768;
  
  const handleSelect = useCallback(() => {
    onSelect(model);
  }, [model, onSelect]);
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.2,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    },
    hover: {
      scale: 1.05,
      y: -10,
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  const accuracyBarVariants = {
    hidden: { width: 0 },
    visible: { 
      width: `${model.accuracy}%`,
      transition: {
        duration: 1.5,
        delay: index * 0.2 + 0.5,
        ease: 'easeOut'
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.2 + 0.8 + i * 0.1,
        duration: 0.4
      }
    })
  };

  return (
    <TouchableOpacity
      onPress={handleSelect}
      style={[
        styles.card,
        {
          backgroundColor: isSelected ? '#667eea' : '#ffffff',
          borderColor: isSelected ? '#4c51bf' : '#e2e8f0',
          borderWidth: isSelected ? 3 : 1,
          padding: isDesktop ? 24 : 20,
          margin: isDesktop ? 12 : 8,
          minHeight: isDesktop ? 280 : 250,
          maxWidth: isDesktop ? 400 : '100%'
        }
      ]}
      activeOpacity={0.8}
    >
      <View style={{ flex: 1 }}>
        {/* Background Pattern */}
        <View style={[styles.backgroundPattern, {
          backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'rgba(102, 126, 234, 0.1)'
        }]} />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.modelName, {
            color: isSelected ? '#ffffff' : '#1a202c'
          }]}>
            {model.name}
          </Text>
          
          {/* Accuracy Display */}
          <View style={styles.accuracyContainer}>
            <Text style={[styles.accuracyLabel, {
              color: isSelected ? '#e2e8f0' : '#4a5568'
            }]}>
              Accuracy:
            </Text>
            <Text style={[styles.accuracyValue, {
              color: isSelected ? '#ffffff' : '#2d3748'
            }]}>
              {model.accuracy}
            </Text>
          </View>
          
          {/* Accuracy Bar */}
          <View style={[styles.accuracyBarContainer, {
            backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : '#e2e8f0'
          }]}>
            <View style={[styles.accuracyBar, {
              width: `${model.accuracy}%`,
              backgroundColor: isSelected ? '#ffffff' : '#48bb78'
            }]} />
          </View>
        </View>
        
        {/* Description */}
        <Text style={[styles.description, {
          color: isSelected ? '#e2e8f0' : '#4a5568'
        }]}>
          {model.description}
        </Text>
        
        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={[styles.featuresTitle, {
            color: isSelected ? '#cbd5e0' : '#718096'
          }]}>
            KEY FEATURES
          </Text>
          {model.features.map((feature, i) => (
            <View key={feature} style={styles.featureItem}>
              <View style={[styles.featureDot, {
                backgroundColor: isSelected ? '#ffffff' : '#667eea'
              }]} />
              <Text style={[styles.featureText, {
                color: isSelected ? '#f7fafc' : '#2d3748'
              }]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>
        
        {/* Processing Time */}
        <View style={styles.footer}>
          <Text style={[styles.processingTime, {
            color: isSelected ? '#cbd5e0' : '#718096'
          }]}>
            Avg. Processing: {model.processingTime}ms
          </Text>
          
          {isSelected && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    width: '100%',
    position: 'relative',
    overflow: 'hidden'
  },
  backgroundPattern: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 100,
    height: 100,
    borderRadius: 50
  },
  header: {
    marginBottom: 16
  },
  modelName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8
  },
  accuracyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  accuracyLabel: {
    fontSize: 14,
    marginRight: 8
  },
  accuracyValue: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  accuracyBarContainer: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden'
  },
  accuracyBar: {
    height: '100%',
    borderRadius: 3
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16
  },
  featuresContainer: {
    marginBottom: 12
  },
  featuresTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 1
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  featureDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 8
  },
  featureText: {
    fontSize: 12
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto'
  },
  processingTime: {
    fontSize: 11
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkmarkText: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: 'bold'
  }
});

// Memoize the component to prevent unnecessary re-renders
export const ModelCard = memo(ModelCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.model.id === nextProps.model.id &&
    prevProps.index === nextProps.index
  );
});
