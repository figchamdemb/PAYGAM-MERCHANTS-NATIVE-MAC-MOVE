const fs = require('fs');
const path = require('path');

const screenTemplate = (screenName, mappedFrom, features) => `/**
 * ${screenName}
 * Mapped from: ${mappedFrom}
 *
 * Features:
${features.map(f => ` * - ${f}`).join('\n')}
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

const ${screenName}: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>${screenName.replace(/([A-Z])/g, ' $1').trim()}</Text>
          <Text style={styles.subtitle}>
            Placeholder - Ready for UI design implementation
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default ${screenName};
`;

const screens = [
  // Digital screens
  {
    name: 'DigitalHomeScreen',
    path: 'digital/DigitalHomeScreen.tsx',
    mappedFrom: 'app/digital/page.tsx',
    features: ['Digital Address Registration', 'Digital Address Lookup', 'Landlord Certificate', 'Property Verification']
  },
  {
    name: 'AddressListScreen',
    path: 'digital/AddressListScreen.tsx',
    mappedFrom: 'app/digital/address/page.tsx',
    features: ['List of registered addresses', 'Search/filter addresses', 'Add new address button', 'Address cards with status']
  },
  {
    name: 'AddressDetailScreen',
    path: 'digital/AddressDetailScreen.tsx',
    mappedFrom: 'app/digital/address/[id]/page.tsx',
    features: ['Full address details', 'Digital code + QR code', 'Interactive map', 'Share address', 'Download certificate']
  },
  {
    name: 'RegisterAddressScreen',
    path: 'digital/RegisterAddressScreen.tsx',
    mappedFrom: 'app/digital/address/register/page.tsx',
    features: ['Location selection (map)', 'Address details form', 'Property type selection', 'Document upload', 'Verification']
  },
  {
    name: 'LandlordCertScreen',
    path: 'digital/LandlordCertScreen.tsx',
    mappedFrom: 'app/digital/landlord-certificate/page.tsx',
    features: ['Request landlord certificate', 'View existing certificates', 'Download/share certificate', 'QR code scanner']
  },
  // Emergency screens
  {
    name: 'EmergencyContactsScreen',
    path: 'emergency/EmergencyContactsScreen.tsx',
    mappedFrom: 'app/emergency-contacts/page.tsx',
    features: ['Emergency numbers (Police, Fire, Ambulance)', 'Quick call buttons', 'SOS button', 'Location sharing']
  },
  {
    name: 'EmergencyServiceScreen',
    path: 'emergency/EmergencyServiceScreen.tsx',
    mappedFrom: 'app/emergency/[service]/page.tsx',
    features: ['Service details', 'Contact information', 'Nearest location on map', 'Call/Navigate buttons']
  },
  // Nearby screens
  {
    name: 'NearbyHomeScreen',
    path: 'nearby/NearbyHomeScreen.tsx',
    mappedFrom: 'app/nearby/page.tsx',
    features: ['Service categories (Hospitals, Doctors, Pharmacies, Banks)', 'Map view with markers', 'List view', 'Filter by distance']
  },
  {
    name: 'NearbyDoctorsScreen',
    path: 'nearby/NearbyDoctorsScreen.tsx',
    mappedFrom: 'app/nearby/doctors/page.tsx',
    features: ['List of nearby doctors/clinics', 'Map view toggle', 'Sort by distance/rating/specialty', 'Contact info', 'Book appointment']
  },
  {
    name: 'NearbyHospitalScreen',
    path: 'nearby/NearbyHospitalScreen.tsx',
    mappedFrom: 'app/nearby/hospital/page.tsx',
    features: ['List of nearby hospitals', 'Emergency services', 'Contact info', 'Directions']
  },
  {
    name: 'NearbyPharmacyScreen',
    path: 'nearby/NearbyPharmacyScreen.tsx',
    mappedFrom: 'app/nearby/pharmacy/page.tsx',
    features: ['List of nearby pharmacies', '24/7 availability indicator', 'Contact info', 'Directions']
  },
  {
    name: 'NearbyHelpScreen',
    path: 'nearby/NearbyHelpScreen.tsx',
    mappedFrom: 'app/nearby-help/page.tsx',
    features: ['Help and support for nearby services', 'How to use location features', 'FAQ']
  },
  {
    name: 'NearbyServiceScreen',
    path: 'nearby/NearbyServiceScreen.tsx',
    mappedFrom: 'app/nearby/[service]/page.tsx',
    features: ['Dynamic service details', 'Service information', 'Contact and location']
  },
  // Reports screens
  {
    name: 'ReportsListScreen',
    path: 'reports/ReportsListScreen.tsx',
    mappedFrom: 'app/reports/page.tsx',
    features: ['List of submitted reports', 'Filter by status/date/type', 'Search bar', 'New Report button']
  },
  {
    name: 'NewReportScreen',
    path: 'reports/NewReportScreen.tsx',
    mappedFrom: 'app/reports/new/page.tsx',
    features: ['Report type dropdown', 'Title and description', 'Camera/Gallery image picker', 'Location picker', 'Submit']
  },
  // Company screens
  {
    name: 'AddCompanyScreen',
    path: 'company/AddCompanyScreen.tsx',
    mappedFrom: 'app/add-company/page.tsx',
    features: ['Company name', 'Company type', 'Registration number', 'Address', 'Document upload']
  },
  // Admin screens
  {
    name: 'AdminDashboardScreen',
    path: 'admin/AdminDashboardScreen.tsx',
    mappedFrom: 'app/admin/dashboard/page.tsx',
    features: ['Admin statistics', 'User management', 'Report management', 'System settings']
  },
  // Other screens (root level)
  {
    name: 'ProfileScreen',
    path: 'ProfileScreen.tsx',
    mappedFrom: 'app/profile/page.tsx',
    features: ['Profile photo', 'Personal information', 'Security settings', 'Biometric toggle', 'Change password', 'Logout']
  },
  {
    name: 'NotificationsScreen',
    path: 'NotificationsScreen.tsx',
    mappedFrom: 'app/notifications/page.tsx',
    features: ['List of notifications', 'Unread badge count', 'Filter (All/Unread/Read)', 'Pull to refresh']
  },
  {
    name: 'ScheduleScreen',
    path: 'ScheduleScreen.tsx',
    mappedFrom: 'app/schedule/page.tsx',
    features: ['Calendar view', 'List of appointments', 'Filter by service type', 'Add appointment', 'Cancel/Reschedule']
  },
  {
    name: 'ServicesScreen',
    path: 'ServicesScreen.tsx',
    mappedFrom: 'app/services/page.tsx',
    features: ['Grid of service categories', 'Digital Services', 'Emergency', 'Nearby Services', 'Reports', 'Settings']
  },
  {
    name: 'HelpScreen',
    path: 'HelpScreen.tsx',
    mappedFrom: 'app/help/page.tsx',
    features: ['FAQ section', 'Contact support', 'Live chat', 'Tutorial videos']
  },
  {
    name: 'QAScreen',
    path: 'QAScreen.tsx',
    mappedFrom: 'app/qa/page.tsx',
    features: ['Questions & Answers', 'Search functionality', 'Categories']
  },
  {
    name: 'TrackingScreen',
    path: 'TrackingScreen.tsx',
    mappedFrom: 'app/tracking/page.tsx',
    features: ['Track submitted applications', 'Status updates', 'Timeline view']
  },
  {
    name: 'LicenseScreen',
    path: 'LicenseScreen.tsx',
    mappedFrom: 'app/license/page.tsx',
    features: ['View/renew licenses', 'Download certificates', 'Payment integration']
  }
];

const basePath = path.join(__dirname, 'src', 'screens');

screens.forEach(screen => {
  const fullPath = path.join(basePath, screen.path);
  const content = screenTemplate(screen.name, screen.mappedFrom, screen.features);

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✓ Created: ${screen.path}`);
});

console.log(`\n✅ Created ${screens.length} placeholder screens successfully!`);
