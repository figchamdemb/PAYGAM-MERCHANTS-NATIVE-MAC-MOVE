/**
 * ✅ AUTH STACK NAVIGATOR - PAYGAM MERCHANT
 *
 * Authentication flow screens for Merchants
 * Uses @react-navigation/stack
 *
 * Screens:
 * - Splash (with Merchant Type Selection)
 * - Login
 * - Register
 * - Forgot Password
 * - Reset Password
 * - Merchant Dashboards
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../config/colors';

// Import types from shared types file (avoids circular imports)
import { AuthStackParamList } from './types';

// Auth Screens
import SplashScreenSimple from '../screens/SplashScreenSimple';
import LoginScreen from '../features/auth/screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';

// Merchant Dashboards
import GeneralMerchantDashboard from '../screens/GeneralMerchantDashboard';
import CorporateMerchantDashboard from '../screens/CorporateMerchantDashboard';
import FuelMerchantDashboard from '../screens/FuelMerchantDashboard';

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
        component={SplashScreenSimple}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
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
      
      {/* Merchant Dashboards - Navigated from Splash after merchant type selection */}
      <Stack.Screen
        name="GeneralMerchantDashboard"
        component={GeneralMerchantDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CorporateMerchantDashboard"
        component={CorporateMerchantDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FuelMerchantDashboard"
        component={FuelMerchantDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GovernmentMerchantDashboard"
        component={CorporateMerchantDashboard}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
