/**
 * ✅ PATROL APP - AMBULANCE EMERGENCY RESPONSE SCREEN
 * Ambulance/EMS department en-route/navigation screen
 */

import React from 'react';
import { useRoute } from '@react-navigation/native';
import EmergencyResponseScreen, { IncidentData, DepartmentConfig } from './EmergencyResponseScreen';

// Ambulance incident data
const ambulanceIncidentData: IncidentData = {
  id: 'ambulance-incident-001',
  type: 'ambulance',
  title: 'Cardiac Arrest',
  code: '10-52',
  severity: 'Critical',
  location: 'Central Park, Fountain Plaza',
  sector: 'District 3',
  eta: '3 min',
  distance: '0.8 miles',
  arrivalTime: '12:38 PM',
  nextTurn: 'Turn Left',
  nextStreet: 'Park Avenue',
  turnDistance: '150',
};

// Ambulance department configuration
const ambulanceConfig: DepartmentConfig = {
  type: 'ambulance',
  primaryColor: '#059669',
  secondaryColor: '#10B981',
  headerBg: '#064E3B',
  icon: null,
};

const AmbulanceEmergencyResponseScreen: React.FC = () => {
  const route = useRoute();
  const params = route.params as { remainingJobs?: number } | undefined;
  
  return (
    <EmergencyResponseScreen
      incidentData={ambulanceIncidentData}
      config={ambulanceConfig}
      remainingJobs={params?.remainingJobs || 2}
    />
  );
};

export default AmbulanceEmergencyResponseScreen;
