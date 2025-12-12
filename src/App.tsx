/**
 * ✅ LIVE RESPONSE - PATROL APP
 * Main Application Entry Point
 * 
 * Matches the working pattern from citizen-react-cli
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Simple screens (no Redux/FontAwesome dependencies - for testing)
import SplashScreenSimple from './screens/SplashScreenSimple';
import LoginScreenSimple from './screens/LoginScreenSimple';
import DashboardScreen from './screens/DashboardScreen';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Splash"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Splash" component={SplashScreenSimple} />
            <Stack.Screen name="Login" component={LoginScreenSimple} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
