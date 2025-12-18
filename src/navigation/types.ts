/**
 * ✅ NAVIGATION TYPES - SHARED TYPE DEFINITIONS
 * 
 * This file contains all navigation param list types
 * to avoid circular imports between screens and navigators
 */

// ====================================
// REGISTRATION DATA TYPE
// ====================================
export interface RegistrationData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    dateOfBirth?: string;
    nationalId?: string;
    tinNumber?: string;
    address?: {
        region?: string;
        city?: string;
        street?: string;
        houseNumber?: string;
        houseType?: string;
    };
    location?: {
        latitude?: number;
        longitude?: number;
    };
    profilePhoto?: string;
}

// ====================================
// AUTH STACK PARAM LIST
// ====================================
export type AuthStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    ResetPassword: { phoneNumber: string };
    Signup: undefined;
    SignupStep2: { registrationData: RegistrationData };
    SignupStep3: { registrationData: RegistrationData };
    SignupStep4: { registrationData: RegistrationData };
    OTPVerification: { phoneNumber: string; registrationData?: RegistrationData };
    RegistrationComplete: { registrationData: RegistrationData };
    RegistrationStatus: undefined;
    
    // Merchant Dashboards (navigated from Splash after merchant type selection)
    GeneralMerchantDashboard: undefined;
    CorporateMerchantDashboard: undefined;
    FuelMerchantDashboard: undefined;
    GovernmentMerchantDashboard: undefined;
};

// ====================================
// MAIN STACK PARAM LIST  
// ====================================
export type MainStackParamList = {
    SelectAgency: undefined;
    
    // Merchant Dashboards
    GeneralMerchantDashboard: undefined;
    CorporateMerchantDashboard: undefined;
    FuelMerchantDashboard: undefined;
    GovernmentMerchantDashboard: undefined;
    
    // Profile & Settings
    ProfileScreen: undefined;
    NotificationsScreen: undefined;
    EditProfile: undefined;
    
    // Success Screen
    SuccessScreen: {
        title?: string;
        message?: string;
        transactionId?: string;
    };
    
    // ====================================
    // MERCHANT SCREENS
    // ====================================
    // Fuel Merchant
    FuelRedemption: undefined;
    
    // General Merchant
    ReceivePayment: { amount?: number; currency?: string };
    WithdrawFunds: undefined;
    
    // Corporate Merchant
    StandingOrder: undefined;
    
    // Shared Merchant Screens
    ActionSuccess: {
        title?: string;
        message?: string;
        actionLabel?: string;
        amount?: number;
        currency?: string;
        transactionId?: string;
    };
    TransactionDetails: {
        transactionId?: string;
        amount?: number;
        currency?: string;
        status?: 'success' | 'pending' | 'failed';
        senderName?: string;
        senderAvatar?: string;
        paymentMethod?: 'visa' | 'mastercard' | 'stripe' | 'bank';
        cardLast4?: string;
        note?: string;
        date?: string;
        time?: string;
    };
    BankDetails: undefined;
    RegisterSubMerchant: undefined;
    HelpCenter: undefined;
    MerchantSupport: { merchantType?: 'general' | 'fuel' | 'corporate' };
    MerchantReports: { merchantType?: 'general' | 'fuel' | 'corporate'; merchantName?: string };
    InitiateRefund: {
        transactionId?: string;
        customerName?: string;
        customerInitials?: string;
        originalAmount?: number;
        currency?: string;
        date?: string;
        time?: string;
    };
    VerificationDetails: undefined;
    Settlement: { merchantType?: 'general' | 'fuel' | 'corporate' };
    ServiceManagement: undefined;
    SubscriptionRequests: undefined;
    MyStore: undefined;
};

// ====================================
// ROOT STACK PARAM LIST
// ====================================
export type RootStackParamList = {
    AuthStack: undefined;
    MainStack: undefined;
};
