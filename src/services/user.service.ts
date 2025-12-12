/**
 * ✅ USER SERVICE
 *
 * Handles all user-related API calls:
 * - Get user profile
 * - Update user profile
 * - Change password
 * - Upload profile photo
 */

import { ApiService } from './api';
import { API_ENDPOINTS } from '../config/constants';
import { User } from '../store/slices/authSlice';

// Request types
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * USER SERVICE METHODS
 */
export const UserService = {
  /**
   * Get user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await ApiService.get<User>(API_ENDPOINTS.USER.PROFILE);
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await ApiService.put<User>(
      API_ENDPOINTS.USER.UPDATE_PROFILE,
      data
    );
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    const response = await ApiService.post<{ message: string }>(
      API_ENDPOINTS.USER.CHANGE_PASSWORD,
      data
    );
    return response.data;
  },

  /**
   * Upload profile photo
   */
  uploadPhoto: async (imageUri: string): Promise<{ photoUrl: string }> => {
    const formData = new FormData();
    formData.append('photo', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);

    const response = await ApiService.post<{ photoUrl: string }>(
      API_ENDPOINTS.USER.UPLOAD_PHOTO,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};

export default UserService;
