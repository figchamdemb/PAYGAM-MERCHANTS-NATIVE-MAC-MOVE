/**
 * NearbyDoctorsScreen
 * Mapped from: app/nearby/doctors/page.tsx
 *
 * Features:
 * - List of nearby doctors/clinics
 * - Map view toggle
 * - Sort by distance/rating/specialty
 * - Contact info
 * - Book appointment
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const NearbyDoctorsScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Nearby Doctors Screen</Text>
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

export default NearbyDoctorsScreen;
