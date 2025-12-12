/**
 * ✅ LIVE RESPONSE - PATROL APP
 * Main Application Entry Point
 * 
 * Department Dashboards based on MFA Code:
 * - 123456 → Police Dashboard
 * - 111111 → Fire Dashboard
 * - 222222 → Immigration Dashboard
 * - 000006 → Ambulance Dashboard
 * 
 * Emergency Flow:
 * Dashboard → TaskDetails → EmergencyResponse → Complete
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Core screens
import SplashScreenSimple from './screens/SplashScreenSimple';
import LoginScreenSimple from './screens/LoginScreenSimple';

// Department-specific dashboards
import PoliceDashboardScreen from './screens/PoliceDashboardScreen';
import FireDashboardScreen from './screens/FireDashboardScreen';
import ImmigrationDashboardScreen from './screens/ImmigrationDashboardScreen';
import AmbulanceDashboardScreen from './screens/AmbulanceDashboardScreen';
import DashboardScreen from './screens/DashboardScreen'; // Fallback

// Emergency Task Details Screens
import PoliceTaskDetailsScreen from './screens/emergency/PoliceTaskDetailsScreen';
import FireTaskDetailsScreen from './screens/emergency/FireTaskDetailsScreen';
import AmbulanceTaskDetailsScreen from './screens/emergency/AmbulanceTaskDetailsScreen';
import ImmigrationTaskDetailsScreen from './screens/emergency/ImmigrationTaskDetailsScreen';

// Emergency Response Screens (En-Route/Navigation)
import PoliceEmergencyResponseScreen from './screens/emergency/PoliceEmergencyResponseScreen';
import FireEmergencyResponseScreen from './screens/emergency/FireEmergencyResponseScreen';
import AmbulanceEmergencyResponseScreen from './screens/emergency/AmbulanceEmergencyResponseScreen';
import ImmigrationEmergencyResponseScreen from './screens/emergency/ImmigrationEmergencyResponseScreen';

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
            {/* Auth Flow */}
            <Stack.Screen name="Splash" component={SplashScreenSimple} />
            <Stack.Screen name="Login" component={LoginScreenSimple} />
            
            {/* Department Dashboards */}
            <Stack.Screen name="PoliceDashboard" component={PoliceDashboardScreen} />
            <Stack.Screen name="FireDashboard" component={FireDashboardScreen} />
            <Stack.Screen name="ImmigrationDashboard" component={ImmigrationDashboardScreen} />
            <Stack.Screen name="AmbulanceDashboard" component={AmbulanceDashboardScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            
            {/* Police Emergency Flow */}
            <Stack.Screen name="PoliceTaskDetails" component={PoliceTaskDetailsScreen} />
            <Stack.Screen name="PoliceEmergencyResponse" component={PoliceEmergencyResponseScreen} />
            
            {/* Fire Emergency Flow */}
            <Stack.Screen name="FireTaskDetails" component={FireTaskDetailsScreen} />
            <Stack.Screen name="FireEmergencyResponse" component={FireEmergencyResponseScreen} />
            
            {/* Ambulance Emergency Flow */}
            <Stack.Screen name="AmbulanceTaskDetails" component={AmbulanceTaskDetailsScreen} />
            <Stack.Screen name="AmbulanceEmergencyResponse" component={AmbulanceEmergencyResponseScreen} />
            
            {/* Immigration Emergency Flow */}
            <Stack.Screen name="ImmigrationTaskDetails" component={ImmigrationTaskDetailsScreen} />
            <Stack.Screen name="ImmigrationEmergencyResponse" component={ImmigrationEmergencyResponseScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
