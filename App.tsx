import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import SignupStack from './screens/auth/SignupStack';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';

export default function App() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, session?.user?.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider className="flex-1">
        <StatusBar barStyle="dark-content" />
        <SignupStack />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
