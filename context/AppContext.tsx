import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { logger } from '@/lib/logger';

interface AppContextType {
  isConnected: boolean;
  appState: AppStateStatus;
  isOnline: boolean;
}

const AppContext = createContext<AppContextType>({
  isConnected: true,
  appState: 'active',
  isOnline: true,
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [appState, setAppState] = useState<AppStateStatus>('active');
  const appStateRef = useRef<AppStateStatus>('active');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      appStateRef.current = nextState;
      setAppState(nextState);
      logger.debug('App state changed:', nextState);
    });

    return () => subscription.remove();
  }, []);

  const value = useMemo(() => ({
    isConnected: true,
    appState,
    isOnline: appState === 'active',
  }), [appState]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppState = () => useContext(AppContext);
