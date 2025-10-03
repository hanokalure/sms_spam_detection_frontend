import React from 'react';
import { StyleSheet } from 'react-native';
import { motion } from 'framer-motion';

interface SpamLoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const SpamLoadingSpinner: React.FC<SpamLoadingSpinnerProps> = ({ 
  message = 'Connecting to server...', 
  size = 'medium' 
}) => {
  const getSize = () => {
    switch (size) {
      case 'small': return 40;
      case 'large': return 80;
      default: return 60;
    }
  };

  const iconSize = getSize();
  const containerSize = iconSize + 20;

  return (
    <motion.div style={{ ...styles.container, width: containerSize, height: containerSize }}>
      {/* Outer rotating ring */}
      <motion.div
        style={{
          ...styles.outerRing,
          width: iconSize,
          height: iconSize,
          borderRadius: iconSize / 2,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Inner shield icon */}
      <motion.div
        style={{ ...styles.shieldContainer, width: iconSize * 0.6, height: iconSize * 0.6 }}
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div style={{ ...styles.shieldIcon, fontSize: iconSize * 0.4 }}>🛡️</div>
      </motion.div>
      
      {/* Scanning lines */}
      <motion.div
        style={{
          ...styles.scanLine,
          width: iconSize * 0.8,
          top: iconSize * 0.3,
        }}
        animate={{
          y: [0, iconSize * 0.4, 0],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {message && (
        <motion.div
          style={{ ...styles.messageText, fontSize: size === 'small' ? 12 : size === 'large' ? 18 : 14 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {message}
        </motion.div>
      )}
      
      {/* Floating dots around the spinner */}
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          style={{
            ...styles.floatingDot,
            width: 6,
            height: 6,
            borderRadius: 3,
          }}
          animate={{
            x: [
              Math.cos((index * 120) * Math.PI / 180) * iconSize * 0.6,
              Math.cos((index * 120 + 360) * Math.PI / 180) * iconSize * 0.6,
            ],
            y: [
              Math.sin((index * 120) * Math.PI / 180) * iconSize * 0.6,
              Math.sin((index * 120 + 360) * Math.PI / 180) * iconSize * 0.6,
            ],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2
          }}
        />
      ))}
    </motion.div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative' as const,
  },
  outerRing: {
    position: 'absolute' as const,
    border: '3px solid #667eea',
    borderTopColor: '#764ba2',
    borderRightColor: 'transparent',
    borderBottomColor: '#f093fb',
    borderLeftColor: 'transparent',
  },
  shieldContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 50,
    position: 'absolute' as const,
  },
  shieldIcon: {
    textAlign: 'center' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLine: {
    position: 'absolute' as const,
    height: 2,
    backgroundColor: '#667eea',
    borderRadius: 1,
    boxShadow: '0 0 4px #667eea',
  },
  messageText: {
    position: 'absolute' as const,
    top: '100%',
    marginTop: 15,
    textAlign: 'center' as const,
    color: '#667eea',
    fontWeight: 600,
    letterSpacing: 0.5,
  },
  floatingDot: {
    position: 'absolute' as const,
    backgroundColor: '#f093fb',
    boxShadow: '0 0 3px #f093fb',
  },
};

export default SpamLoadingSpinner;