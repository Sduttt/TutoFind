import "./global.css"
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, Text, View } from "react-native";
 
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
    </SafeAreaProvider>
  );
}
