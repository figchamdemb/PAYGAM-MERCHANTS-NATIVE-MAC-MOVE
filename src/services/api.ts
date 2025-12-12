/**
 * ✅ BASE API SERVICE (AXIOS)
 *
 * Configures Axios instance with:
 * - Base URL from environment
 * - Request/Response interceptors
 * - Token management
 * - Error handling
 *
 * All API services extend from this base configuration
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { API_CONFIG, STORAGE_KEYS, ERROR_MESSAGES } from '../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

/**
 * Create Axios instance with base configuration
 */
const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

/**
 * REQUEST INTERCEPTOR
 * Adds authentication token to all requests
 */
api.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    try {
      // Get token from secure storage (Keychain)
      const credentials = await Keychain.getGenericPassword({
        service: STORAGE_KEYS.ACCESS_TOKEN,
      });

      if (credentials && credentials.password) {
        // Add token to Authorization header
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${credentials.password}`,
        };
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Handles token refresh and error responses
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return successful response
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token
        const refreshTokenCredentials = await Keychain.getGenericPassword({
          service: STORAGE_KEYS.REFRESH_TOKEN,
        });

        if (refreshTokenCredentials && refreshTokenCredentials.password) {
          // Request new access token
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}/auth/refresh-token`,
            {
              refreshToken: refreshTokenCredentials.password,
            }
          );

          const { accessToken, refreshToken } = response.data;

          // Store new tokens
          await Keychain.setGenericPassword('token', accessToken, {
            service: STORAGE_KEYS.ACCESS_TOKEN,
          });
          await Keychain.setGenericPassword('refreshToken', refreshToken, {
            service: STORAGE_KEYS.REFRESH_TOKEN,
          });

          // Retry original request with new token
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${accessToken}`,
          };

          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        console.error('Token refresh failed:', refreshError);
        await clearAuthData();
        // Redirect to login (handled by navigation)
        return Promise.reject(refreshError);
      }
    }

    // Handle other error statuses
    const errorMessage = getErrorMessage(error);
    return Promise.reject({
      ...error,
      message: errorMessage,
    });
  }
);

/**
 * Get user-friendly error message from error response
 */
const getErrorMessage = (error: AxiosError): string => {
  if (!error.response) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  switch (error.response.status) {
    case 400:
      return error.response.data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 500:
    case 502:
    case 503:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return error.response.data?.message || ERROR_MESSAGES.UNKNOWN_ERROR;
  }
};

/**
 * Clear all authentication data
 */
const clearAuthData = async () => {
  try {
    await Keychain.resetGenericPassword({ service: STORAGE_KEYS.ACCESS_TOKEN });
    await Keychain.resetGenericPassword({ service: STORAGE_KEYS.REFRESH_TOKEN });
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

/**
 * API Helper Functions
 */
export const ApiService = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    api.get<T>(url, config),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    api.post<T>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    api.put<T>(url, data, config),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    api.patch<T>(url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    api.delete<T>(url, config),
};

export default api;
