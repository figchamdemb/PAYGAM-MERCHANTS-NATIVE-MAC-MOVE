/**
 * ✅ AUTH SLICE (REDUX)
 *
 * Manages user authentication state
 * Includes user info, tokens, and authentication status
 *
 * State:
 * - user: User object with all user data
 * - token: JWT access token
 * - refreshToken: JWT refresh token
 * - isAuthenticated: Boolean flag
 * - isLoading: Loading state for auth operations
 * - error: Error message if auth fails
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profilePhoto?: string;
  dateOfBirth?: string;
  nationalId?: string;
  address?: {
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
  roles?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  biometricEnabled: boolean;
  selectedAgency: 'POLICE' | 'FIRE' | 'AMBULANCE' | 'IMMIGRATION' | null;
  targetDashboard: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  biometricEnabled: false,
  selectedAgency: null,
  targetDashboard: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login success with optional target dashboard
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken: string; targetDashboard?: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      if (action.payload.targetDashboard) {
        state.targetDashboard = action.payload.targetDashboard;
      }
    },

    // Set selected agency
    setSelectedAgency: (
      state,
      action: PayloadAction<'POLICE' | 'FIRE' | 'AMBULANCE' | 'IMMIGRATION' | null>
    ) => {
      state.selectedAgency = action.payload;
    },

    // Set target dashboard
    setTargetDashboard: (state, action: PayloadAction<string | null>) => {
      state.targetDashboard = action.payload;
    },

    // Clear target dashboard (after navigation)
    clearTargetDashboard: (state) => {
      state.targetDashboard = null;
    },

    // Login start
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    // Login failure
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.biometricEnabled = false;
    },

    // Update user profile
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Update token (for refresh)
    updateToken: (state, action: PayloadAction<{ token: string; refreshToken: string }>) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Enable/disable biometric authentication
    setBiometric: (state, action: PayloadAction<boolean>) => {
      state.biometricEnabled = action.payload;
    },

    // Restore session (for app restart)
    restoreSession: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
  },
});

export const {
  loginSuccess,
  loginStart,
  loginFailure,
  logout,
  updateUser,
  updateToken,
  clearError,
  setBiometric,
  restoreSession,
  setSelectedAgency,
  setTargetDashboard,
  clearTargetDashboard,
} = authSlice.actions;

// Additional action for setting authenticated status
export const setAuthenticated = (isAuthenticated: boolean) => ({
  type: 'auth/setAuthenticated',
  payload: isAuthenticated,
});

export default authSlice.reducer;
