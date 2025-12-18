/**
 * ✅ PAYGAM MERCHANT APP
 * Main Application Entry Point
 * 
 * Merchant Types:
 * - General Merchant (Retail, Shops)
 * - Corporate Merchant (Businesses)
 * - Fuel Merchant (Gas Stations)
 * 
 * Flow:
 * Splash → Select Merchant Type → Merchant Dashboard
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

// Merchant Dashboards
import GeneralMerchantDashboard from './screens/GeneralMerchantDashboard';
import CorporateMerchantDashboard from './screens/CorporateMerchantDashboard';
import FuelMerchantDashboard from './screens/FuelMerchantDashboard';

// Merchant Feature Screens
import ReceivePaymentScreen from './screens/ReceivePaymentScreen';
import WithdrawFundsScreen from './screens/WithdrawFundsScreen';
import FuelRedemptionScreen from './screens/FuelRedemptionScreen';
import TransactionDetailsScreen from './screens/TransactionDetailsScreen';
import ActionSuccessScreen from './screens/ActionSuccessScreen';
import BankDetailsScreen from './screens/BankDetailsScreen';
import RegisterSubMerchantScreen from './screens/RegisterSubMerchantScreen';
import HelpCenterScreen from './screens/HelpCenterScreen';
import SettlementScreen from './screens/SettlementScreen';
import ServiceManagementScreen from './screens/ServiceManagementScreen';
import SubscriptionRequestsScreen from './screens/SubscriptionRequestsScreen';
import MyStoreScreen from './screens/MyStoreScreen';
import StandingOrderScreen from './screens/StandingOrderScreen';
import CreateStandingOrderScreen from './screens/CreateStandingOrderScreen';
import CurrencyConverterScreen from './screens/CurrencyConverterScreen';
import TopUpWalletScreen from './screens/TopUpWalletScreen';
import UpdateFuelPricesScreen from './screens/UpdateFuelPricesScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import CreateInvoiceScreen from './screens/CreateInvoiceScreen';
import CreatePaymentScreen from './screens/CreatePaymentScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import GeneralRegistrationScreen from './screens/GeneralRegistrationScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import OTPVerificationScreen from './screens/OTPVerificationScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';

// Shared Screens
import ProfileScreen from './features/profile/screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import SettingsProfileScreen from './screens/SettingsProfileScreen';
import VerificationDetailsScreen from './screens/VerificationDetailsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import MerchantReportsScreen from './screens/MerchantReportsScreen';
import InitiateRefundScreen from './screens/InitiateRefundScreen';
import MerchantSupportScreen from './screens/MerchantSupportScreen';

// Merchant Type Selection
import SelectAgencyScreen from './features/auth/screens/SelectAgencyScreen';

// Placeholder screens for navigation targets that don't have dedicated screens yet
import PlaceholderScreen from './screens/PlaceholderScreen';

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
            <Stack.Screen name="SignUp" component={GeneralRegistrationScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="SelectAgency" component={SelectAgencyScreen} />
            
            {/* Merchant Dashboards */}
            <Stack.Screen name="GeneralMerchantDashboard" component={GeneralMerchantDashboard} />
            <Stack.Screen name="CorporateMerchantDashboard" component={CorporateMerchantDashboard} />
            <Stack.Screen name="FuelMerchantDashboard" component={FuelMerchantDashboard} />
            <Stack.Screen name="GovernmentMerchantDashboard" component={CorporateMerchantDashboard} />
            
            {/* Merchant Feature Screens */}
            <Stack.Screen name="ReceivePayment" component={ReceivePaymentScreen} />
            <Stack.Screen name="WithdrawFunds" component={WithdrawFundsScreen} />
            <Stack.Screen name="FuelRedemption" component={FuelRedemptionScreen} />
            <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />
            <Stack.Screen name="ActionSuccess" component={ActionSuccessScreen} />
            <Stack.Screen name="BankDetails" component={BankDetailsScreen} />
            <Stack.Screen name="RegisterSubMerchant" component={RegisterSubMerchantScreen} />
            <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
            <Stack.Screen name="Settlement" component={SettlementScreen} />
            <Stack.Screen name="ServiceManagement" component={ServiceManagementScreen} />
            <Stack.Screen name="SubscriptionRequests" component={SubscriptionRequestsScreen} />
            <Stack.Screen name="MyStore" component={MyStoreScreen} />
            <Stack.Screen name="StandingOrder" component={StandingOrderScreen} />
            <Stack.Screen name="CreateStandingOrder" component={CreateStandingOrderScreen} />
            
            {/* Shared Screens */}
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="SettingsProfile" component={SettingsProfileScreen} />
            <Stack.Screen name="VerificationDetails" component={VerificationDetailsScreen} />
            <Stack.Screen name="SettingsLanguage" component={PlaceholderScreen} />
            <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
            <Stack.Screen name="QRScanner" component={QRScannerScreen} />
            <Stack.Screen name="MerchantReports" component={MerchantReportsScreen} />
            <Stack.Screen name="InitiateRefund" component={InitiateRefundScreen} />
            <Stack.Screen name="MerchantSupport" component={MerchantSupportScreen} />
            
            {/* Sidebar Menu Screens - Map navigation targets */}
            <Stack.Screen name="QRCodeScreen" component={ReceivePaymentScreen} />
            <Stack.Screen name="MyStoreScreen" component={MyStoreScreen} />
            <Stack.Screen name="ServiceListScreen" component={ServiceManagementScreen} />
            <Stack.Screen name="CreateServiceScreen" component={ServiceManagementScreen} />
            <Stack.Screen name="SubscribersScreen" component={SubscriptionRequestsScreen} />
            <Stack.Screen name="RegisterShopMerchant" component={RegisterSubMerchantScreen} />
            <Stack.Screen name="BankAccountScreen" component={BankDetailsScreen} />
            
            {/* Placeholder screens for features not yet implemented */}
            <Stack.Screen name="KYCScreen" component={VerificationDetailsScreen} />
            <Stack.Screen name="CurrencyConverter" component={CurrencyConverterScreen} />
            <Stack.Screen name="TopUpWallet" component={TopUpWalletScreen} />
            <Stack.Screen name="UpdateFuelPrices" component={UpdateFuelPricesScreen} />
            <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
            <Stack.Screen name="CreateInvoice" component={CreateInvoiceScreen} />
            <Stack.Screen name="CreatePayment" component={CreatePaymentScreen} />
            <Stack.Screen name="CouponScreen" component={PlaceholderScreen} />
            <Stack.Screen name="ChangePIN" component={PlaceholderScreen} />
            <Stack.Screen name="ChangeMPIN" component={PlaceholderScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
