import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/apiService';

interface ConnectionContextType {
  isConnected: boolean;
  isChecking: boolean;
  error: string | null;
  checkConnection: () => Promise<void>;
  retryConnection: () => Promise<void>;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
};

interface ConnectionProviderProps {
  children: ReactNode;
}

export const ConnectionProvider: React.FC<ConnectionProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      const result = await apiService.healthCheck();
      setIsConnected(result.isHealthy);
      
      if (!result.isHealthy) {
        setError(result.message);
      }
    } catch (err) {
      setIsConnected(false);
      setError('Failed to connect to server');
      console.error('Connection check failed:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const retryConnection = async () => {
    await checkConnection();
  };

  // Initial connection check
  useEffect(() => {
    checkConnection();
    
    // Set up periodic health checks every 30 seconds when connected
    const interval = setInterval(() => {
      if (isConnected) {
        checkConnection();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Removed auto-retry mechanism - only retry when user clicks retry button

  return (
    <ConnectionContext.Provider 
      value={{
        isConnected,
        isChecking,
        error,
        checkConnection,
        retryConnection
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};