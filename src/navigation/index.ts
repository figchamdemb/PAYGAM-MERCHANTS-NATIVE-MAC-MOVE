/**
 * ✅ NAVIGATION BARREL EXPORT
 *
 * Central export file for all navigation components
 * NOTE: MainDrawer removed - using MainStack instead for patrol app
 */

export { AppNavigator } from './AppNavigator';
export { AuthStack } from './AuthStack';
export { MainStack } from './MainStack';
export { TabNavigator } from './TabNavigator';

// Export types from shared types file
export type { AuthStackParamList, MainStackParamList, RegistrationData, RootStackParamList } from './types';
