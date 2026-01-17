import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import SignupStack from './screens/auth/SignupStack';

export default function App() {
  return (
    <SafeAreaProvider className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <SignupStack />
    </SafeAreaProvider>
  );
}
