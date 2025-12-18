/**
 * ✅ MAIN STACK NAVIGATOR - PAYGAM MERCHANT
 *
 * Stack-based navigation for the merchant app
 * Routes to Merchant Dashboards (General, Corporate, Fuel, Government)
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import types from shared types file
import { MainStackParamList } from './types';

// Re-export types for backward compatibility
export type { MainStackParamList } from './types';

// Import screens
import SelectAgencyScreen from '../features/auth/screens/SelectAgencyScreen';

// ====================================
// MERCHANT DASHBOARDS
// ====================================
import GeneralMerchantDashboard from '../screens/GeneralMerchantDashboard';
import CorporateMerchantDashboard from '../screens/CorporateMerchantDashboard';
import FuelMerchantDashboard from '../screens/FuelMerchantDashboard';
// Government uses Corporate dashboard for now (similar features)
const GovernmentMerchantDashboard = CorporateMerchantDashboard;

// ====================================
// PROFILE & SETTINGS
// ====================================
import ProfileScreen from '../features/profile/screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

// ====================================
// MERCHANT SCREENS
// ====================================
import FuelRedemptionScreen from '../screens/FuelRedemptionScreen';
import ReceivePaymentScreen from '../screens/ReceivePaymentScreen';
import WithdrawFundsScreen from '../screens/WithdrawFundsScreen';
import StandingOrderScreen from '../screens/StandingOrderScreen';
import ActionSuccessScreen from '../screens/ActionSuccessScreen';
import TransactionDetailsScreen from '../screens/TransactionDetailsScreen';
import BankDetailsScreen from '../screens/BankDetailsScreen';
import RegisterSubMerchantScreen from '../screens/RegisterSubMerchantScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import MerchantSupportScreen from '../screens/MerchantSupportScreen';
import MerchantReportsScreen from '../screens/MerchantReportsScreen';
import InitiateRefundScreen from '../screens/InitiateRefundScreen';
import VerificationDetailsScreen from '../screens/VerificationDetailsScreen';
import SettlementScreen from '../screens/SettlementScreen';
import ServiceManagementScreen from '../screens/ServiceManagementScreen';
import SubscriptionRequestsScreen from '../screens/SubscriptionRequestsScreen';
import MyStoreScreen from '../screens/MyStoreScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainStack: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="SelectAgency"
            screenOptions={{
                headerShown: false,
            }}
        >
            {/* ====================================
                MERCHANT TYPE SELECTION
            ==================================== */}
            <Stack.Screen name="SelectAgency" component={SelectAgencyScreen} />

            {/* ====================================
                MERCHANT DASHBOARDS
            ==================================== */}
            <Stack.Screen name="GeneralMerchantDashboard" component={GeneralMerchantDashboard} />
            <Stack.Screen name="CorporateMerchantDashboard" component={CorporateMerchantDashboard} />
            <Stack.Screen name="FuelMerchantDashboard" component={FuelMerchantDashboard} />
            <Stack.Screen name="GovernmentMerchantDashboard" component={GovernmentMerchantDashboard} />

            {/* ====================================
                PROFILE & SETTINGS
            ==================================== */}
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />

            {/* ====================================
                FUEL MERCHANT SCREENS
            ==================================== */}
            <Stack.Screen name="FuelRedemption" component={FuelRedemptionScreen} />

            {/* ====================================
                GENERAL MERCHANT SCREENS
            ==================================== */}
            <Stack.Screen name="ReceivePayment" component={ReceivePaymentScreen} />
            <Stack.Screen name="WithdrawFunds" component={WithdrawFundsScreen} />

            {/* ====================================
                CORPORATE MERCHANT SCREENS
            ==================================== */}
            <Stack.Screen name="StandingOrder" component={StandingOrderScreen} />

            {/* ====================================
                SHARED MERCHANT SCREENS
            ==================================== */}
            <Stack.Screen name="ActionSuccess" component={ActionSuccessScreen} />
            <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />
            <Stack.Screen name="BankDetails" component={BankDetailsScreen} />
            <Stack.Screen name="RegisterSubMerchant" component={RegisterSubMerchantScreen} />
            <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
            <Stack.Screen name="MerchantSupport" component={MerchantSupportScreen} />
            <Stack.Screen name="MerchantReports" component={MerchantReportsScreen} />
            <Stack.Screen name="InitiateRefund" component={InitiateRefundScreen} />
            <Stack.Screen name="VerificationDetails" component={VerificationDetailsScreen} />
            <Stack.Screen name="Settlement" component={SettlementScreen} />
            <Stack.Screen name="ServiceManagement" component={ServiceManagementScreen} />
            <Stack.Screen name="SubscriptionRequests" component={SubscriptionRequestsScreen} />
            <Stack.Screen name="MyStore" component={MyStoreScreen} />

            {/* ====================================
                SUCCESS SCREEN
            ==================================== */}
            <Stack.Screen name="SuccessScreen" component={ActionSuccessScreen} />
        </Stack.Navigator>
    );
};

export default MainStack;
