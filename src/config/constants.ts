/**
 * ✅ APP CONSTANTS
 *
 * Global constants used throughout the app
 * API endpoints, app info, storage keys, etc.
 *
 * Usage:
 * import { API_BASE_URL, STORAGE_KEYS } from '@/config/constants';
 */

// Environment variables (replace with actual values or use react-native-config)
export const ENV = {
  API_BASE_URL: __DEV__
    ? 'http://localhost:8080/api/v1' // Development
    : 'https://api.egov.gm/v1', // Production
  GOOGLE_MAPS_API_KEY: '', // Add your Google Maps API key
  GOOGLE_OAUTH_CLIENT_ID: '', // Add your Google OAuth client ID
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: ENV.API_BASE_URL,
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    VERIFY_OTP: '/auth/verify-otp',
  },

  // User
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
    UPLOAD_PHOTO: '/user/upload-photo',
  },

  // Digital Address
  DIGITAL: {
    ADDRESSES: '/digital-address/addresses',
    REGISTER: '/digital-address/register',
    VERIFY: '/digital-address/verify',
    LANDLORD_CERT: '/digital-address/landlord-certificate',
  },

  // Emergency
  EMERGENCY: {
    CONTACTS: '/emergency/contacts',
    REPORT: '/emergency/report',
  },

  // Nearby Services
  NEARBY: {
    HOSPITALS: '/nearby/hospitals',
    DOCTORS: '/nearby/doctors',
    PHARMACIES: '/nearby/pharmacies',
    BANKS: '/nearby/banks',
  },

  // Reports
  REPORTS: {
    LIST: '/reports',
    CREATE: '/reports',
    DETAILS: '/reports/:id',
    UPDATE: '/reports/:id',
    DELETE: '/reports/:id',
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/mark-all-read',
  },

  // Services
  SERVICES: {
    LIST: '/services',
    APPLY: '/services/apply',
    TRACK: '/services/track/:id',
  },

  // Licenses
  LICENSES: {
    LIST: '/licenses',
    RENEW: '/licenses/:id/renew',
    DOWNLOAD: '/licenses/:id/download',
  },
};

// Storage Keys (for AsyncStorage and Keychain)
export const STORAGE_KEYS = {
  // Auth
  ACCESS_TOKEN: '@egov:accessToken',
  REFRESH_TOKEN: '@egov:refreshToken',
  USER_DATA: '@egov:userData',
  BIOMETRIC_ENABLED: '@egov:biometricEnabled',

  // App State
  FIRST_LAUNCH: '@egov:firstLaunch',
  ONBOARDING_COMPLETED: '@egov:onboardingCompleted',
  LANGUAGE: '@egov:language',
  THEME: '@egov:theme',

  // Cache
  LOCATION_CACHE: '@egov:locationCache',
  SERVICES_CACHE: '@egov:servicesCache',
};

// App Information
export const APP_INFO = {
  NAME: 'eGov Gambia',
  VERSION: '1.0.0',
  BUILD_NUMBER: '1',
  SUPPORT_EMAIL: 'support@egov.gm',
  SUPPORT_PHONE: '+220-123-4567',
  WEBSITE: 'https://egov.gm',
  PRIVACY_POLICY: 'https://egov.gm/privacy',
  TERMS_OF_SERVICE: 'https://egov.gm/terms',
};

// Screen Names (for navigation)
export const SCREEN_NAMES = {
  // Auth
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  FORGOT_PASSWORD: 'ForgotPassword',
  RESET_PASSWORD: 'ResetPassword',

  // Main
  DASHBOARD: 'Dashboard',
  SERVICES: 'Services',
  SCHEDULE: 'Schedule',
  PROFILE: 'Profile',

  // Digital
  DIGITAL_HOME: 'DigitalHome',
  ADDRESS_LIST: 'AddressList',
  ADDRESS_DETAIL: 'AddressDetail',
  REGISTER_ADDRESS: 'RegisterAddress',
  LANDLORD_CERT: 'LandlordCert',

  // Emergency
  EMERGENCY_CONTACTS: 'EmergencyContacts',
  EMERGENCY_SERVICE: 'EmergencyService',

  // Nearby
  NEARBY_HOME: 'NearbyHome',
  NEARBY_DOCTORS: 'NearbyDoctors',
  NEARBY_HOSPITAL: 'NearbyHospital',
  NEARBY_PHARMACY: 'NearbyPharmacy',

  // Reports
  REPORTS_LIST: 'ReportsList',
  NEW_REPORT: 'NewReport',

  // Other
  NOTIFICATIONS: 'Notifications',
  HELP: 'Help',
  QA: 'QA',
  TRACKING: 'Tracking',
  LICENSE: 'License',
};

// Validation Rules
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL_CHAR: true,
  },
  PHONE: {
    MIN_LENGTH: 7,
    MAX_LENGTH: 15,
  },
  EMAIL: {
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  OTP: {
    LENGTH: 6,
    EXPIRY_MINUTES: 10,
  },
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_REGION: {
    latitude: 13.4549, // Banjul, Gambia
    longitude: -16.5790,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  MARKER_TYPES: {
    HOSPITAL: 'hospital',
    DOCTOR: 'doctor',
    PHARMACY: 'pharmacy',
    BANK: 'bank',
    POLICE: 'police',
    FIRE: 'fire',
  },
};

// Date/Time Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  FULL: 'MMMM DD, YYYY',
  SHORT: 'MM/DD/YYYY',
  TIME: 'HH:mm',
  DATETIME: 'MMM DD, YYYY HH:mm',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  REPORT_UPDATE: 'report_update',
  SERVICE_UPDATE: 'service_update',
  APPOINTMENT_REMINDER: 'appointment_reminder',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'Resource not found.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  PASSWORD_RESET: 'Password reset successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  REPORT_SUBMITTED: 'Report submitted successfully!',
  APPLICATION_SUBMITTED: 'Application submitted successfully!',
};

export default {
  ENV,
  API_CONFIG,
  API_ENDPOINTS,
  STORAGE_KEYS,
  APP_INFO,
  SCREEN_NAMES,
  VALIDATION,
  PAGINATION,
  MAP_CONFIG,
  DATE_FORMATS,
  NOTIFICATION_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
