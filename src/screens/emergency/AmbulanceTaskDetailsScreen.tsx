/**
 * ✅ PATROL APP - AMBULANCE TASK DETAILS SCREEN
 * Ambulance/EMS department emergency task details
 */

import React from 'react';
import TaskDetailsScreen, { TaskData, DepartmentConfig } from './TaskDetailsScreen';

// Ambulance-specific task data
const ambulanceTaskData: TaskData = {
  id: 'ambulance-task-001',
  type: 'ambulance',
  location: 'Central Park, Near Fountain Plaza',
  coordinates: { lat: 51.5100, lng: -0.1200 },
  urgency: 'URGENT',
  time: '12:05 PM',
  message: 'Cardiac arrest reported. 65-year-old male, unresponsive. Bystanders performing CPR. AED on scene. Need immediate advanced life support.',
  reporterName: 'Park Ranger Mike',
  reporterPhone: '+1 (555) 555-0300',
  assignedStation: 'EMS STATION 4 - CENTRAL',
  distance: '0.5 miles',
  eta: 'approx. 4 min',
};

// Ambulance department configuration
const ambulanceConfig: DepartmentConfig = {
  type: 'ambulance',
  primaryColor: '#059669',
  secondaryColor: '#10B981',
  headerTitle: 'EMS Task Details',
  icon: null,
  markerColor: '#059669',
};

// Additional jobs in queue
const ambulanceNextJobs: TaskData[] = [
  {
    id: 'ambulance-task-005',
    type: 'ambulance',
    location: 'Shopping Mall, Food Court Level 2',
    coordinates: { lat: 51.5080, lng: -0.1250 },
    urgency: 'HIGH',
    time: 'Today at 11:50 am',
    message: 'Elderly woman fallen, possible hip fracture. Conscious and alert, moderate pain.',
    reporterName: 'Mall Security',
    reporterPhone: '+1 (555) 555-0301',
    assignedStation: 'EMS STATION 4',
    distance: '0.4 miles',
    eta: 'approx. 5 min',
  },
  {
    id: 'ambulance-task-006',
    type: 'ambulance',
    location: 'Elementary School, 123 Education Lane',
    coordinates: { lat: 51.5060, lng: -0.1300 },
    urgency: 'MEDIUM',
    time: 'Today at 01:00 pm',
    message: 'Child with severe allergic reaction. Epinephrine administered by school nurse. Stable but needs transport.',
    reporterName: 'School Nurse',
    reporterPhone: '+1 (555) 555-0302',
    assignedStation: 'EMS STATION 4',
    distance: '0.9 miles',
    eta: 'approx. 8 min',
  },
];

const AmbulanceTaskDetailsScreen: React.FC = () => {
  return (
    <TaskDetailsScreen
      taskData={ambulanceTaskData}
      config={ambulanceConfig}
      nextJobs={ambulanceNextJobs}
    />
  );
};

export default AmbulanceTaskDetailsScreen;
