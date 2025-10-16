import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { AnimatePresence } from 'framer-motion';
import { ConnectionProvider } from './src/contexts/ConnectionContext';
import './src/styles/global.css';
import { HomeScreen } from './src/screens/HomeScreen';
import { AllResultsScreen } from './src/screens/AllResultsScreen';
import { MultiModelPredictionResult } from './src/types';

type AppScreen = 'home' | 'results';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [results, setResults] = useState<MultiModelPredictionResult | null>(null);

  const handleResult = useCallback((multiModelResult: MultiModelPredictionResult) => {
    setResults(multiModelResult);
    setCurrentScreen('results');
  }, []);

  const handleNewAnalysis = useCallback(() => {
    setCurrentScreen('home');
    setResults(null);
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onResult={handleResult}
          />
        );
      case 'results':
        return results ? (
          <AllResultsScreen
            results={results}
            onNewAnalysis={handleNewAnalysis}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <ConnectionProvider>
      <View style={styles.container}>
        <AnimatePresence mode="wait">
          {renderScreen()}
        </AnimatePresence>
        <StatusBar style="auto" />
      </View>
    </ConnectionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
});
