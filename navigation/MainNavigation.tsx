import { createStackNavigator } from '@react-navigation/stack';
import { useEffect } from 'react';
import { Routes } from './routes';
import Screens from '../screens/screens';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from '../components/DrawerContent';

import { UseAuthStore } from '../store/AuthStore';
import { View, ActivityIndicator } from 'react-native';

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
  const userId = UseAuthStore(state => state.userId);
  const isAuthResolved = UseAuthStore(state => state.isAuthResolved);
  const gender = UseAuthStore(state => state.data.gender);
  const user_type = UseAuthStore(state => state.data.user_type);
  const initializeAuth = UseAuthStore(state => state.initializeAuth);
  const subscribeToAuthChanges = UseAuthStore(state => state.subscribeToAuthChanges);

  useEffect(() => {
    initializeAuth();
    const unsubscribe = subscribeToAuthChanges();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [initializeAuth, subscribeToAuthChanges]);

  // console.log(
  //   'MainNavigation: userId:',
  //   userId,
  //   'isAuthResolved:',
  //   isAuthResolved,
  // );

  if (!isAuthResolved) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
      >
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={
        userId === null
            ? Routes.SIGNIN
            : !gender
              ? Routes.ADD_USER_DETAILS
              : user_type === 'tutor'
                ? Routes.TUTOR_DASHBOARD
                : Routes.STUDENT_DRAWER
      }
    >
      {userId === null ? (
        <Stack.Group>
          <Stack.Screen
            name={Routes.SIGNIN}
            component={Screens.SIGNIN_SCREEN}
          />
          <Stack.Screen
            name={Routes.SIGNUP}
            component={Screens.SIGNUP_SCREEN}
          />
          <Stack.Screen
            name={Routes.RESET_PASSWORD}
            component={Screens.RESET_PASSWORD_SCREEN}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen
            name={Routes.TUTOR_DASHBOARD}
            component={Screens.USER_DASHBOARD_SCREEN}
          />
          <Stack.Screen
            name={Routes.STUDENT_DRAWER}
            component={DrawerNavigation}
          />
          <Stack.Screen
            name={Routes.ADD_USER_DETAILS}
            component={Screens.ADD_USER_DETAILS_SCREEN}
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
          <Stack.Screen
            name={Routes.CHAT_SCREEN}
            component={Screens.CHAT_SCREEN as any}
          />
          <Stack.Screen
            name={Routes.CHAT_LIST_SCREEN}
            component={Screens.CHAT_LIST_SCREEN as any}
          />
          <Stack.Screen
            name={Routes.RESET_PASSWORD}
            component={Screens.RESET_PASSWORD_SCREEN}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default MainNavigation;
