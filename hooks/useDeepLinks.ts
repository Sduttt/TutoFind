import { useEffect } from 'react';
import { Linking } from 'react-native';
import { supabase } from '../lib/supabase';
import { Routes } from '../navigation/routes';
import { navigationRef } from '../navigation/navigationRef';

export const useDeepLinks = () => {
  useEffect(() => {
    const handleDeepLink = async ({ url }: { url: string }) => {
      console.log('Deep link received:', url);
      // Handle Supabase auth tokens from URL
      if (url.includes('access_token') && url.includes('refresh_token')) {
        try {
          const hashIndex = url.indexOf('#');
          if (hashIndex !== -1) {
            const hash = url.substring(hashIndex + 1);
            const accessToken = hash.match(/access_token=([^&]*)/)?.[1];
            const refreshToken = hash.match(/refresh_token=([^&]*)/)?.[1];

            if (accessToken && refreshToken) {
              const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

              if (error) {
                console.error('Error setting session from deep link:', error);
              } else {
                console.log('Session set successfully from deep link');
                // Navigate to ResetPassword screen
                // Use a small timeout to ensure navigation container is ready
                const waitForNavigationReady = () => {
                  if (navigationRef.isReady()) {
                    console.log('Navigating to RESET_PASSWORD');
                    navigationRef.navigate(Routes.RESET_PASSWORD as never);
                  } else {
                    console.log('Navigation not ready, retrying...');
                    setTimeout(waitForNavigationReady, 50);
                  }
                };
                waitForNavigationReady();
              }
            }
          }
        } catch (error) {
          console.error('Error processing deep link:', error);
        }
      }
    };

    // Add listener for deep links
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check for initial URL (if app was closed)
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, session?.user?.id);

      if (event === 'PASSWORD_RECOVERY') {
        const waitForNavigationReady = () => {
          if (navigationRef.isReady()) {
            console.log('Event-based Navigating to RESET_PASSWORD');
            navigationRef.navigate(Routes.RESET_PASSWORD as never);
          } else {
            setTimeout(waitForNavigationReady, 50);
          }
        };
        waitForNavigationReady();
      }
    });

    return () => {
      subscription.remove();
      authSubscription.unsubscribe();
    };
  }, []);
};
