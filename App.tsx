import "./global.css"
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, Text, View } from "react-native";
import AuthTest from "./screens/AuthTest";
 
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <AuthTest />
    </SafeAreaProvider>
  );
}
