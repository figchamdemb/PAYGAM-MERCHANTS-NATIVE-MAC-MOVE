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

// Police-Specific Feature Screens
import TrafficOpsANPRScreen from './screens/police/TrafficOpsANPRScreen';
import IncidentReportingScreen from './screens/police/IncidentReportingScreen';
import TeamGridRadioScreen from './screens/police/TeamGridRadioScreen';
import GlobalDatabaseSearchScreen from './screens/police/GlobalDatabaseSearchScreen';
import DispatcherMapScreen from './screens/police/DispatcherMapScreen';
import WriteForCitizenScreen from './screens/police/WriteForCitizenScreen';
import StatementFormScreen from './screens/police/StatementFormScreen';
import TrafficTicketScreen from './screens/police/TrafficTicketScreen';
import VehicleSearchScreen from './screens/police/VehicleSearchScreen';
import SearchCasesScreen from './screens/police/SearchCasesScreen';

// Fire-Specific Feature Screens
import FireDispatcherScreen from './screens/fire/FireDispatcherScreen';
import FireIncidentReportScreen from './screens/fire/FireIncidentReportScreen';
import FireTeamRadioScreen from './screens/fire/FireTeamRadioScreen';

// Ambulance-Specific Feature Screens
import AmbulanceDispatcherScreen from './screens/ambulance/AmbulanceDispatcherScreen';
import AmbulancePatientReportScreen from './screens/ambulance/AmbulancePatientReportScreen';
import AmbulanceTeamRadioScreen from './screens/ambulance/AmbulanceTeamRadioScreen';

// Immigration-Specific Feature Screens
import ImmigrationDispatcherScreen from './screens/immigration/ImmigrationDispatcherScreen';
import ImmigrationCaseReportScreen from './screens/immigration/ImmigrationCaseReportScreen';
import ImmigrationTeamRadioScreen from './screens/immigration/ImmigrationTeamRadioScreen';
import PermitVisaLookupScreen from './screens/immigration/PermitVisaLookupScreen';

// Officer Profile Screen (shared across all departments)
import OfficerProfileScreen from './screens/OfficerProfileScreen';

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
            
            {/* Police Feature Screens */}
            <Stack.Screen name="TrafficOpsANPR" component={TrafficOpsANPRScreen} />
            <Stack.Screen name="IncidentReporting" component={IncidentReportingScreen} />
            <Stack.Screen name="TeamGridRadio" component={TeamGridRadioScreen} />
            <Stack.Screen name="GlobalDatabaseSearch" component={GlobalDatabaseSearchScreen} />
            <Stack.Screen name="DispatcherMap" component={DispatcherMapScreen} />
            <Stack.Screen name="WriteForCitizen" component={WriteForCitizenScreen} />
            <Stack.Screen name="StatementForm" component={StatementFormScreen} />
            <Stack.Screen name="TrafficTicket" component={TrafficTicketScreen} />
            <Stack.Screen name="VehicleSearch" component={VehicleSearchScreen} />
            <Stack.Screen name="SearchCases" component={SearchCasesScreen} />
            
            {/* Fire Feature Screens */}
            <Stack.Screen name="FireDispatcher" component={FireDispatcherScreen} />
            <Stack.Screen name="FireIncidentReport" component={FireIncidentReportScreen} />
            <Stack.Screen name="FireTeamRadio" component={FireTeamRadioScreen} />
            
            {/* Ambulance Feature Screens */}
            <Stack.Screen name="AmbulanceDispatcher" component={AmbulanceDispatcherScreen} />
            <Stack.Screen name="AmbulancePatientReport" component={AmbulancePatientReportScreen} />
            <Stack.Screen name="AmbulanceTeamRadio" component={AmbulanceTeamRadioScreen} />
            
            {/* Immigration Feature Screens */}
            <Stack.Screen name="ImmigrationDispatcher" component={ImmigrationDispatcherScreen} />
            <Stack.Screen name="ImmigrationCaseReport" component={ImmigrationCaseReportScreen} />
            <Stack.Screen name="ImmigrationTeamRadio" component={ImmigrationTeamRadioScreen} />
            <Stack.Screen name="PermitVisaLookup" component={PermitVisaLookupScreen} />
            
            {/* Shared Screens */}
            <Stack.Screen name="OfficerProfile" component={OfficerProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
