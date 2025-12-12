/**
 * ✅ PATROL APP - IMMIGRATION TASK DETAILS SCREEN
 * Immigration department emergency task details
 */

import React from 'react';
import TaskDetailsScreen, { TaskData, DepartmentConfig } from './TaskDetailsScreen';

// Immigration-specific task data
const immigrationTaskData: TaskData = {
  id: 'immigration-task-001',
  type: 'immigration',
  location: 'Port of Entry, Terminal B, Gate 7',
  coordinates: { lat: 51.4700, lng: -0.4500 },
  urgency: 'URGENT',
  time: '12:20 PM',
  message: 'Suspected fraudulent travel documents detected at passport control. Individual detained for further questioning. Interpol alert flagged.',
  reporterName: 'Border Agent Chen',
  reporterPhone: '+1 (555) 555-0400',
  assignedStation: 'IMMIGRATION POST 1 - TERMINAL B',
  distance: '0.2 miles',
  eta: 'approx. 3 min',
};

// Immigration department configuration
const immigrationConfig: DepartmentConfig = {
  type: 'immigration',
  primaryColor: '#7C3AED',
  secondaryColor: '#8B5CF6',
  headerTitle: 'Immigration Task Details',
  icon: null,
  markerColor: '#7C3AED',
};

// Additional jobs in queue
const immigrationNextJobs: TaskData[] = [
  {
    id: 'immigration-task-005',
    type: 'immigration',
    location: 'International Arrivals, Terminal A',
    coordinates: { lat: 51.4720, lng: -0.4520 },
    urgency: 'HIGH',
    time: 'Today at 11:40 am',
    message: 'Family group claiming asylum at arrival. Need interpreter and case officer assistance.',
    reporterName: 'Immigration Officer',
    reporterPhone: '+1 (555) 555-0401',
    assignedStation: 'IMMIGRATION POST 1',
    distance: '0.3 miles',
    eta: 'approx. 4 min',
  },
  {
    id: 'immigration-task-006',
    type: 'immigration',
    location: 'Cargo Area, Warehouse District',
    coordinates: { lat: 51.4680, lng: -0.4480 },
    urgency: 'HIGH',
    time: 'Today at 01:30 pm',
    message: 'Customs flagged suspicious container. Possible human trafficking concern. Specialized unit requested.',
    reporterName: 'Customs Agent',
    reporterPhone: '+1 (555) 555-0402',
    assignedStation: 'IMMIGRATION POST 1',
    distance: '0.8 miles',
    eta: 'approx. 7 min',
  },
];

const ImmigrationTaskDetailsScreen: React.FC = () => {
  return (
    <TaskDetailsScreen
      taskData={immigrationTaskData}
      config={immigrationConfig}
      nextJobs={immigrationNextJobs}
    />
  );
};

export default ImmigrationTaskDetailsScreen;
