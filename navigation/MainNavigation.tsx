import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from './routes';
import Screens from '../screens/screens';

const Stack = createStackNavigator();

const MainNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={Routes.SIGNUP}
    >
      <Stack.Screen name={Routes.SIGNIN} component={Screens.SIGNIN_SCREEN} />
      <Stack.Screen name={Routes.SIGNUP} component={Screens.SIGNUP_SCREEN} />
    </Stack.Navigator>
  );
};

export default MainNavigation;
