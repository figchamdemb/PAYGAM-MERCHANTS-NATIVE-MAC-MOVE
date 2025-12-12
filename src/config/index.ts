/**
 * ✅ CONFIG BARREL EXPORT
 *
 * Central export file for all configuration files
 *
 * Usage:
 * import { colors, spacing, typography } from '@/config';
 */

export { colors } from './colors';
export { spacing } from './spacing';
export { typography } from './typography';
export {
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
} from './constants';

export { default as constants } from './constants';
