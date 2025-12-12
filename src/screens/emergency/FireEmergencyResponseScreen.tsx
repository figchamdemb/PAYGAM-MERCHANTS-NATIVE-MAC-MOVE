/**
 * ✅ PATROL APP - FIRE EMERGENCY RESPONSE SCREEN
 * Fire department en-route/navigation screen
 */

import React from 'react';
import { useRoute } from '@react-navigation/native';
import EmergencyResponseScreen, { IncidentData, DepartmentConfig } from './EmergencyResponseScreen';

// Fire incident data
const fireIncidentData: IncidentData = {
  id: 'fire-incident-001',
  type: 'fire',
  title: 'Structure Fire',
  code: '10-70',
  severity: 'Critical',
  location: 'Industrial Park, Building 7',
  sector: 'Sector 2',
  eta: '6 min',
  distance: '1.8 miles',
  arrivalTime: '12:48 PM',
  nextTurn: 'Continue Straight',
  nextStreet: 'Industrial Blvd',
  turnDistance: '500',
};

// Fire department configuration
const fireConfig: DepartmentConfig = {
  type: 'fire',
  primaryColor: '#DC2626',
  secondaryColor: '#EF4444',
  headerBg: '#7F1D1D',
  icon: null,
};

const FireEmergencyResponseScreen: React.FC = () => {
  const route = useRoute();
  const params = route.params as { remainingJobs?: number } | undefined;
  
  return (
    <EmergencyResponseScreen
      incidentData={fireIncidentData}
      config={fireConfig}
      remainingJobs={params?.remainingJobs || 2}
    />
  );
};

export default FireEmergencyResponseScreen;
