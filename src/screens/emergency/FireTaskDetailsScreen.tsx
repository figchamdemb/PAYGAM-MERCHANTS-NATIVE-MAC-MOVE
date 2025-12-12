/**
 * ✅ PATROL APP - FIRE TASK DETAILS SCREEN
 * Fire department emergency task details
 */

import React from 'react';
import TaskDetailsScreen, { TaskData, DepartmentConfig } from './TaskDetailsScreen';

// Fire-specific task data
const fireTaskData: TaskData = {
  id: 'fire-task-001',
  type: 'fire',
  location: 'Industrial Park, Building 7, Sector 2',
  coordinates: { lat: 51.5200, lng: -0.0900 },
  urgency: 'URGENT',
  time: '12:15 PM',
  message: 'Structure fire reported at warehouse facility. Multiple floors involved. Possible trapped occupants. Hazardous materials on site - chemical storage area.',
  reporterName: 'Factory Supervisor',
  reporterPhone: '+1 (555) 555-0200',
  assignedStation: 'FIRE STATION 7 - INDUSTRIAL',
  distance: '1.2 miles',
  eta: 'approx. 8 min',
};

// Fire department configuration
const fireConfig: DepartmentConfig = {
  type: 'fire',
  primaryColor: '#DC2626',
  secondaryColor: '#EF4444',
  headerTitle: 'Fire Task Details',
  icon: null,
  markerColor: '#DC2626',
};

// Additional jobs in queue
const fireNextJobs: TaskData[] = [
  {
    id: 'fire-task-005',
    type: 'fire',
    location: 'Residential Complex, Oak Street',
    coordinates: { lat: 51.5150, lng: -0.0950 },
    urgency: 'HIGH',
    time: 'Today at 11:45 am',
    message: 'Kitchen fire reported on 3rd floor apartment. Smoke visible from exterior.',
    reporterName: 'Building Manager',
    reporterPhone: '+1 (555) 555-0201',
    assignedStation: 'FIRE STATION 7',
    distance: '0.6 miles',
    eta: 'approx. 6 min',
  },
  {
    id: 'fire-task-006',
    type: 'fire',
    location: 'Highway 101, Mile Marker 45',
    coordinates: { lat: 51.5250, lng: -0.0850 },
    urgency: 'HIGH',
    time: 'Today at 12:30 pm',
    message: 'Vehicle fire on highway. Traffic blocked. Fuel leak possible.',
    reporterName: 'Highway Patrol',
    reporterPhone: '+1 (555) 555-0202',
    assignedStation: 'FIRE STATION 7',
    distance: '2.1 miles',
    eta: 'approx. 12 min',
  },
];

const FireTaskDetailsScreen: React.FC = () => {
  return (
    <TaskDetailsScreen
      taskData={fireTaskData}
      config={fireConfig}
      nextJobs={fireNextJobs}
    />
  );
};

export default FireTaskDetailsScreen;
