/**
 * ✅ PATROL APP - POLICE TASK DETAILS SCREEN
 * Police department emergency task details
 */

import React from 'react';
import TaskDetailsScreen, { TaskData, DepartmentConfig } from './TaskDetailsScreen';

// Police-specific task data
const policeTaskData: TaskData = {
  id: 'police-task-001',
  type: 'police',
  location: 'Trafalgar Square, London WC2N 5DN',
  coordinates: { lat: 51.5080, lng: -0.1281 },
  urgency: 'URGENT',
  time: '12:00 PM',
  message: 'Armed robbery in progress at local convenience store. Suspect described as male, dark clothing, armed with knife. Multiple witnesses on scene.',
  reporterName: 'John Doe',
  reporterPhone: '+1 (555) 555-0100',
  assignedStation: 'STATION 3 - CENTRAL',
  distance: '0.3 miles',
  eta: 'approx. 5 min',
};

// Police department configuration
const policeConfig: DepartmentConfig = {
  type: 'police',
  primaryColor: '#1E40AF',
  secondaryColor: '#3B82F6',
  headerTitle: 'Police Task Details',
  icon: null,
  markerColor: '#1E40AF',
};

// Additional jobs in queue
const policeNextJobs: TaskData[] = [
  {
    id: 'police-task-005',
    type: 'police',
    location: 'Downtown Market, West End',
    coordinates: { lat: 51.5120, lng: -0.1350 },
    urgency: 'HIGH',
    time: 'Today at 11:30 am',
    message: 'Shoplifting report at electronics store.',
    reporterName: 'Store Manager',
    reporterPhone: '+1 (555) 555-0101',
    assignedStation: 'STATION 3',
    distance: '0.8 miles',
    eta: 'approx. 10 min',
  },
  {
    id: 'police-task-006',
    type: 'police',
    location: 'Westside Plaza, High Street',
    coordinates: { lat: 51.5085, lng: -0.1400 },
    urgency: 'MEDIUM',
    time: 'Today at 01:15 pm',
    message: 'Vehicle break-in reported in parking lot.',
    reporterName: 'Security Guard',
    reporterPhone: '+1 (555) 555-0102',
    assignedStation: 'STATION 3',
    distance: '1.2 miles',
    eta: 'approx. 15 min',
  },
];

const PoliceTaskDetailsScreen: React.FC = () => {
  return (
    <TaskDetailsScreen
      taskData={policeTaskData}
      config={policeConfig}
      nextJobs={policeNextJobs}
    />
  );
};

export default PoliceTaskDetailsScreen;
