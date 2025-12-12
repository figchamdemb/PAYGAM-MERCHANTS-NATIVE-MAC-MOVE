/**
 * ✅ AUTHENTICATION SERVICE
 *
 * Handles all authentication-related API calls:
 * - Login
 * - Signup
 * - Logout
 * - Forgot Password
 * - Reset Password
 * - Email/OTP Verification
 */

import { ApiService } from './api';
import { API_ENDPOINTS } from '../config/constants';

// Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  nationalId?: string;
  dateOfBirth?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    profilePhoto?: string;
    roles?: string[];
  };
  token: string;
  refreshToken: string;
}

/**
 * AUTH SERVICE METHODS
 */
export const AuthService = {
  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await ApiService.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );
    return response.data;
  },

  /**
   * Register new user
   */
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await ApiService.post<AuthResponse>(
      API_ENDPOINTS.AUTH.SIGNUP,
      data
    );
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await ApiService.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  /**
   * Request password reset (sends OTP to email)
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    const response = await ApiService.post<{ message: string }>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data
    );
    return response.data;
  },

  /**
   * Reset password with OTP
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await ApiService.post<{ message: string }>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    );
    return response.data;
  },

  /**
   * Verify email with OTP
   */
  verifyEmail: async (data: VerifyOtpRequest): Promise<{ message: string }> => {
    const response = await ApiService.post<{ message: string }>(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      data
    );
    return response.data;
  },

  /**
   * Verify OTP code
   */
  verifyOtp: async (data: VerifyOtpRequest): Promise<{ valid: boolean }> => {
    const response = await ApiService.post<{ valid: boolean }>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      data
    );
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
    const response = await ApiService.post<{ token: string; refreshToken: string }>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      { refreshToken }
    );
    return response.data;
  },
};

export default AuthService;
