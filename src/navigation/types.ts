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
    SelectAgency: undefined;
    ForgotPassword: undefined;
    ResetPassword: { phoneNumber: string };
    Signup: undefined;
    SignupStep2: { registrationData: RegistrationData };
    SignupStep3: { registrationData: RegistrationData };
    SignupStep4: { registrationData: RegistrationData };
    OTPVerification: { phoneNumber: string; registrationData?: RegistrationData };
    RegistrationComplete: { registrationData: RegistrationData };
    RegistrationStatus: undefined;
};

// ====================================
// MAIN STACK PARAM LIST  
// ====================================
export type MainStackParamList = {
    SelectAgency: undefined;
    PolicePatrolDashboard: undefined;
    FirePatrolDashboard: undefined;
    AmbulancePatrolDashboard: undefined;
    ImmigrationDashboard: undefined;
    MapScreen: undefined;
    ResponseScreen: { incidentId?: string };
    TrafficScreen: undefined;
    IssueTicketScreen: { vehicleData?: any };
    ReportsScreen: undefined;
    NewReport: undefined;
    TeamCommsScreen: undefined;
    ImmigrationScannerScreen: undefined;
    DatabaseSearchScreen: { query?: string };
    AdminMenuScreen: undefined;
    ProfileScreen: undefined;
    NotificationsScreen: undefined;
    DispatchDetails: { alert?: any };
    SuccessScreen: {
        title?: string;
        message?: string;
        transactionId?: string;
    };
};

// ====================================
// ROOT STACK PARAM LIST
// ====================================
export type RootStackParamList = {
    AuthStack: undefined;
    MainStack: undefined;
};
