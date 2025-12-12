/**
 * ✅ PATROL APP - EMERGENCY SCREENS INDEX
 * Export all emergency-related screens
 */

// Base Components
export { default as TaskDetailsScreen } from './TaskDetailsScreen';
export { default as EmergencyResponseScreen } from './EmergencyResponseScreen';

// Police
export { default as PoliceTaskDetailsScreen } from './PoliceTaskDetailsScreen';
export { default as PoliceEmergencyResponseScreen } from './PoliceEmergencyResponseScreen';

// Fire
export { default as FireTaskDetailsScreen } from './FireTaskDetailsScreen';
export { default as FireEmergencyResponseScreen } from './FireEmergencyResponseScreen';

// Ambulance
export { default as AmbulanceTaskDetailsScreen } from './AmbulanceTaskDetailsScreen';
export { default as AmbulanceEmergencyResponseScreen } from './AmbulanceEmergencyResponseScreen';

// Immigration
export { default as ImmigrationTaskDetailsScreen } from './ImmigrationTaskDetailsScreen';
export { default as ImmigrationEmergencyResponseScreen } from './ImmigrationEmergencyResponseScreen';

// Types
export type { TaskData, DepartmentConfig } from './TaskDetailsScreen';
export type { IncidentData, DepartmentConfig as ResponseConfig } from './EmergencyResponseScreen';
