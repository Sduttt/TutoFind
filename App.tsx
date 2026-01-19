import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import SignupStack from './screens/auth/SignupStack';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider className="flex-1">
        <StatusBar barStyle="dark-content" />
        <SignupStack />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
