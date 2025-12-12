/**
 * ✅ SERVICES BARREL EXPORT
 *
 * Central export file for all API services
 *
 * Usage:
 * import { AuthService, UserService, ReportsService } from '@/services';
 */

export { ApiService, default as api } from './api';
export { AuthService } from './auth.service';
export { UserService } from './user.service';
export {
  DigitalAddressService,
  EmergencyService,
  NearbyService,
  ReportsService,
  NotificationsService,
  ServicesService,
  LicensesService,
} from './citizen.service';

// Export types
export type {
  LoginRequest,
  SignupRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
  AuthResponse,
} from './auth.service';

export type {
  UpdateProfileRequest,
  ChangePasswordRequest,
} from './user.service';
