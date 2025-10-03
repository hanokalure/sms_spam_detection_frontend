import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { AnimatePresence } from 'framer-motion';
import { ConnectionProvider } from './src/contexts/ConnectionContext';
import './src/styles/global.css';
import { ModelSelectionScreen } from './src/screens/ModelSelectionScreen';
import { TextInputScreen } from './src/screens/TextInputScreen';
import { ResultsScreen } from './src/screens/ResultsScreen';
import { MLModel, PredictionResult } from './src/types';

type AppScreen = 'modelSelection' | 'textInput' | 'results';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('modelSelection');
  const [selectedModel, setSelectedModel] = useState<MLModel | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleModelSelect = useCallback((model: MLModel) => {
    setSelectedModel(model);
    setCurrentScreen('textInput');
  }, []);

  const handleBackToModels = useCallback(() => {
    setCurrentScreen('modelSelection');
    setInputText('');
    setResult(null);
  }, []);

  const handleResult = useCallback((predictionResult: PredictionResult, text: string) => {
    setResult(predictionResult);
    setInputText(text);
    setCurrentScreen('results');
  }, []);

  const handleBackToInput = useCallback(() => {
    setCurrentScreen('textInput');
    setResult(null);
  }, []);

  const handleNewAnalysis = useCallback(() => {
    setCurrentScreen('textInput');
    setInputText('');
    setResult(null);
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'modelSelection':
        return (
          <ModelSelectionScreen
            onModelSelect={handleModelSelect}
            selectedModel={selectedModel}
          />
        );
      case 'textInput':
        return selectedModel ? (
          <TextInputScreen
            selectedModel={selectedModel}
            onBack={handleBackToModels}
            onResult={handleResult}
          />
        ) : null;
      case 'results':
        return selectedModel && result ? (
          <ResultsScreen
            selectedModel={selectedModel}
            result={result}
            inputText={inputText}
            onBack={handleBackToModels}
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
