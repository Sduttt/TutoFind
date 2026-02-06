import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from './routes';
import Screens from '../screens/screens';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from '../components/DrawerContent';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
      }}
      initialRouteName={Routes.STUDENT_HOME}
    >
      <Drawer.Screen
        name={Routes.STUDENT_HOME}
        component={Screens.STUDENT_HOME_SCREEN}
      />
    </Drawer.Navigator>
  );
};

const MainNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={Routes.SIGNUP}
    >
      <Stack.Screen name={Routes.SIGNIN} component={Screens.SIGNIN_SCREEN} />
      <Stack.Screen name={Routes.SIGNUP} component={Screens.SIGNUP_SCREEN} />
      <Stack.Screen
        name={Routes.ADD_USER_DETAILS}
        component={Screens.ADD_USER_DETAILS_SCREEN}
      />
      <Stack.Screen
        name={Routes.RESET_PASSWORD}
        component={Screens.RESET_PASSWORD_SCREEN}
      />
      <Stack.Screen
        name={Routes.TUTOR_DASHBOARD}
        component={Screens.USER_DASHBOARD_SCREEN}
      />
      <Stack.Screen
        name={Routes.CREATE_POST}
        component={Screens.CREATE_POST_SCREEN}
      />
      <Stack.Screen
        name={Routes.VIEW_POSTS}
        component={Screens.VIEW_POSTS_SCREEN}
      />
      <Stack.Screen
        name={Routes.STUDENT_HOME}
        component={Screens.STUDENT_HOME_SCREEN}
      />
      <Stack.Screen
        name={Routes.TUTOR_PROFILE}
        component={Screens.TUTOR_PROFILE_SCREEN}
      />
      <Stack.Screen
        name={Routes.UPDATE_USER_DETAILS}
        component={Screens.UPDATE_USER_DETAILS_SCREEN}
      />
      <Stack.Screen name={Routes.STUDENT_DRAWER} component={DrawerNavigation} />
    </Stack.Navigator>
  );
};

export default MainNavigation;
