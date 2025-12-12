/**
 * ✅ APP NAVIGATOR (ROOT)
 *
 * Main navigation container
 * Manages authentication state and switches between auth flow and main app
 *
 * Flow:
 * - If user is NOT authenticated → AuthStack
 * - If user IS authenticated → MainStack (Stack-based navigation, no drawer)
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

import AuthStack from './AuthStack';
import MainStack from './MainStack';

const Stack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  // Get authentication state from Redux
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        ) : (
          <Stack.Screen name="MainStack" component={MainStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
