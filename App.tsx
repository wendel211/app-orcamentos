import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
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
  const [error, setError] = useState<string | null>(null);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize database
        await initDatabase();
        setDbReady(true);
      } catch (e) {
        console.error('Falha ao inicializar o banco de dados:', e);
        setError('Erro ao carregar o banco de dados. Por favor, reinicie o app.');
      }
    }

    prepare();

    // Keep splash screen for at least 3 seconds to let user read
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 20 }}>
        <ActivityIndicator size="large" color="#EF4444" />
        <View style={{ marginTop: 20 }}>
          <View style={{ backgroundColor: '#FEE2E2', padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#EF4444' }}>
            <ActivityIndicator size="small" color="#EF4444" style={{ marginBottom: 8 }} />
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', marginRight: 8 }} />
                <Text style={{ fontSize: 16, fontWeight: 'bold' as any, color: '#991B1B' }}>Ops! Algo deu errado</Text>
              </View>
              <Text style={{ fontSize: 14, color: '#B91C1C', lineHeight: 20 }}>{error}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (showSplash || !dbReady || !fontsLoaded) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
