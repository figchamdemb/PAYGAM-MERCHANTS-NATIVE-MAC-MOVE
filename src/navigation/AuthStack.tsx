/**
 * ✅ AUTH STACK NAVIGATOR - PATROL EDITION
 *
 * Authentication flow screens for Officers
 * Uses @react-navigation/stack
 *
 * Screens:
 * - Splash
 * - Login (Badge + Password)
 * - SelectAgency (Police/Fire/Ambulance/Immigration)
 * - Forgot Password
 * - Reset Password
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../config/colors';

// Import types from shared types file (avoids circular imports)
import { AuthStackParamList } from './types';

// Auth Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../features/auth/screens/LoginScreen';
import SelectAgencyScreen from '../features/auth/screens/SelectAgencyScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';

// Re-export types for backward compatibility
export type { AuthStackParamList } from './types';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.text.inverse,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: colors.background.secondary,
        },
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectAgency"
        component={SelectAgencyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
