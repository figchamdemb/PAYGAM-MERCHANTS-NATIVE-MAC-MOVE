/**
 * ✅ MAIN STACK NAVIGATOR
 *
 * Stack-based navigation for the main app (no drawer library)
 * Uses simple stack navigation for stability
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import types from shared types file (avoids circular imports)
import { MainStackParamList } from './types';

// Re-export types for backward compatibility
export type { MainStackParamList } from './types';

// Import screens
import SelectAgencyScreen from '../features/auth/screens/SelectAgencyScreen';
import PolicePatrolDashboardScreen from '../features/patrol/screens/PolicePatrolDashboardScreen';
import FirePatrolDashboardScreen from '../features/patrol/screens/FirePatrolDashboardScreen';
import AmbulancePatrolDashboardScreen from '../features/patrol/screens/AmbulancePatrolDashboardScreen';
import MapScreen from '../features/patrol/screens/MapScreen';
import ResponseScreen from '../features/patrol/screens/ResponseScreen';
import TrafficOpsScreen from '../features/patrol/screens/TrafficOpsScreen';
import IssueTicketScreen from '../features/patrol/screens/IssueTicketScreen';
import ReportSuiteScreen from '../features/patrol/screens/ReportSuiteScreen';
import SuccessScreen from '../features/patrol/screens/SuccessScreen';
import DispatchDetailsScreen from '../features/patrol/screens/DispatchDetailsScreen';
import TeamCommsScreen from '../features/team/screens/TeamCommsScreen';
import AdminMenuScreen from '../features/admin/screens/AdminMenuScreen';
import ImmigrationScannerScreen from '../features/immigration/screens/ImmigrationScannerScreen';
import DatabaseSearchScreen from '../features/search/screens/DatabaseSearchScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainStack: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="SelectAgency"
            screenOptions={{
                headerShown: false,
            }}
        >
            {/* Agency Selection */}
            <Stack.Screen name="SelectAgency" component={SelectAgencyScreen} />

            {/* Agency Dashboards */}
            <Stack.Screen name="PolicePatrolDashboard" component={PolicePatrolDashboardScreen} />
            <Stack.Screen name="FirePatrolDashboard" component={FirePatrolDashboardScreen} />
            <Stack.Screen name="AmbulancePatrolDashboard" component={AmbulancePatrolDashboardScreen} />
            <Stack.Screen name="ImmigrationDashboard" component={ImmigrationScannerScreen} />

            {/* Patrol Operations */}
            <Stack.Screen name="MapScreen" component={MapScreen} />
            <Stack.Screen name="ResponseScreen" component={ResponseScreen} />
            <Stack.Screen name="TrafficScreen" component={TrafficOpsScreen} />
            <Stack.Screen name="IssueTicketScreen" component={IssueTicketScreen} />
            <Stack.Screen name="ReportsScreen" component={ReportSuiteScreen} />
            <Stack.Screen name="NewReport" component={ReportSuiteScreen} />
            <Stack.Screen name="DispatchDetails" component={DispatchDetailsScreen} />

            {/* Team */}
            <Stack.Screen name="TeamCommsScreen" component={TeamCommsScreen} />

            {/* Immigration */}
            <Stack.Screen name="ImmigrationScannerScreen" component={ImmigrationScannerScreen} />

            {/* Search */}
            <Stack.Screen name="DatabaseSearchScreen" component={DatabaseSearchScreen} />

            {/* Admin */}
            <Stack.Screen name="AdminMenuScreen" component={AdminMenuScreen} />

            {/* Profile & Settings */}
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />

            {/* Success */}
            <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
        </Stack.Navigator>
    );
};

export default MainStack;
