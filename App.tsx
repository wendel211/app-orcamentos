import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { initDatabase } from './src/database/db';
import RootNavigator from './src/navigation/RootNavigator';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import SplashScreen from './src/modules/common/screens/SplashScreen';
import { AuthProvider } from './src/modules/auth/contexts/AuthContext';

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    // Initialize database
    initDatabase().then(() => setDbReady(true));

    // Keep splash screen for at least 3 seconds to let user read
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash || !dbReady || !fontsLoaded) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
