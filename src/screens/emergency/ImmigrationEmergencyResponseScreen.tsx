/**
 * ✅ PATROL APP - IMMIGRATION EMERGENCY RESPONSE SCREEN
 * Immigration department en-route/navigation screen
 */

import React from 'react';
import { useRoute } from '@react-navigation/native';
import EmergencyResponseScreen, { IncidentData, DepartmentConfig } from './EmergencyResponseScreen';

// Immigration incident data
const immigrationIncidentData: IncidentData = {
  id: 'immigration-incident-001',
  type: 'immigration',
  title: 'Document Fraud',
  code: 'IMM-7',
  severity: 'High',
  location: 'Port of Entry, Terminal B',
  sector: 'Gate 7',
  eta: '2 min',
  distance: '0.3 miles',
  arrivalTime: '12:35 PM',
  nextTurn: 'Turn Right',
  nextStreet: 'Terminal Access Road',
  turnDistance: '100',
};

// Immigration department configuration
const immigrationConfig: DepartmentConfig = {
  type: 'immigration',
  primaryColor: '#7C3AED',
  secondaryColor: '#8B5CF6',
  headerBg: '#4C1D95',
  icon: null,
};

const ImmigrationEmergencyResponseScreen: React.FC = () => {
  const route = useRoute();
  const params = route.params as { remainingJobs?: number } | undefined;
  
  return (
    <EmergencyResponseScreen
      incidentData={immigrationIncidentData}
      config={immigrationConfig}
      remainingJobs={params?.remainingJobs || 2}
    />
  );
};

export default ImmigrationEmergencyResponseScreen;
