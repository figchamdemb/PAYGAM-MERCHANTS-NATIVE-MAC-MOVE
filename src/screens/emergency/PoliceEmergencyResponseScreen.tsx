/**
 * ✅ PATROL APP - POLICE EMERGENCY RESPONSE SCREEN
 * Police department en-route/navigation screen
 */

import React from 'react';
import { useRoute } from '@react-navigation/native';
import EmergencyResponseScreen, { IncidentData, DepartmentConfig } from './EmergencyResponseScreen';

// Police incident data
const policeIncidentData: IncidentData = {
  id: 'police-incident-001',
  type: 'police',
  title: 'Armed Robbery',
  code: '211',
  severity: 'Critical',
  location: '4502 W. Highland Ave',
  sector: 'Sector 4',
  eta: '4 min',
  distance: '1.2 miles',
  arrivalTime: '12:42 PM',
  nextTurn: 'Then Turn Right',
  nextStreet: 'W. Highland Ave',
  turnDistance: '200',
};

// Police department configuration
const policeConfig: DepartmentConfig = {
  type: 'police',
  primaryColor: '#1E40AF',
  secondaryColor: '#3B82F6',
  headerBg: '#0F172A',
  icon: null,
};

const PoliceEmergencyResponseScreen: React.FC = () => {
  const route = useRoute();
  const params = route.params as { remainingJobs?: number } | undefined;
  
  return (
    <EmergencyResponseScreen
      incidentData={policeIncidentData}
      config={policeConfig}
      remainingJobs={params?.remainingJobs || 2}
    />
  );
};

export default PoliceEmergencyResponseScreen;
