/**
 * BloodDonationConfirmationScreen - Blood Donation Success Confirmation
 * Based on HTML/Tailwind design provided
 * Features: Success message, ticket card with QR code, appointment details
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../context/ThemeContext';

const BloodDonationConfirmationScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();

  const handleSaveImage = () => {
    // Placeholder for save image functionality
    // TODO: Implement save image functionality
  };

  const handleDone = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />
      {/* Decorative Header Background */}
      <View style={styles.headerBackground}>
        <View style={styles.headerPattern} />
        <View style={styles.headerCircle1} />
        <View style={styles.headerCircle2} />
      </View>

      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
          <Icon name="times" size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Confirmation</Text>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="share-alt" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={[styles.mainContent, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>
        {/* Success Message */}
        <View style={styles.successSection}>
          <View style={styles.successIconContainer}>
            <Icon name="check" size={32} color="#B45309" />
          </View>
          <Text style={[styles.successTitle, { color: theme.colors.text }]}>Thank You!</Text>
          <Text style={[styles.successSubtitle, { color: theme.colors.textSecondary }]}>Your donation has been scheduled.</Text>
        </View>

        {/* Ticket Card */}
        <View style={[styles.ticketCard, { backgroundColor: theme.colors.card }]}>
          {/* QR Section with Scallop Effect */}
          <View style={styles.qrSection}>
            {/* Scallop decorations */}
            <View style={styles.scallopLeft} />
            <View style={styles.scallopRight} />

            <View style={styles.qrContainer}>
              <Image
                source={{
                  uri: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=EGOV-CITIZEN-Ref-GG8921-TypeO+',
                }}
                style={styles.qrCode}
                resizeMode="contain"
              />
            </View>

            <View style={styles.referenceContainer}>
              <Text style={styles.referenceLabel}>Reference ID</Text>
              <Text style={styles.referenceId}>GG-8921</Text>
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.detailsSection}>
            {/* Blood Type Reminder */}
            <View style={styles.bloodTypeReminder}>
              <View style={styles.bloodTypeIcon}>
                <Icon name="tint" size={16} color="#DC2626" />
              </View>
              <View>
                <Text style={styles.bloodTypeLabel}>Donor Blood Type</Text>
                <Text style={styles.bloodTypeValue}>O Positive (O+)</Text>
              </View>
            </View>

            {/* Info Grid */}
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Date</Text>
                <View style={styles.infoValue}>
                  <Icon name="calendar" size={12} color="#B45309" />
                  <Text style={styles.infoValueText}>Tue, 13 Jun</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Time</Text>
                <View style={styles.infoValue}>
                  <Icon name="clock" size={12} color="#B45309" />
                  <Text style={styles.infoValueText}>10:00 AM</Text>
                </View>
              </View>
              <View style={[styles.infoItem, styles.infoItemFull]}>
                <Text style={styles.infoLabel}>Location</Text>
                <View style={styles.infoValue}>
                  <Icon name="map-marker" size={12} color="#B45309" />
                  <Text style={styles.infoValueText}>Edward Francis Small Teaching Hospital</Text>
                </View>
              </View>
            </View>

            {/* Gamification / Raffle Message */}
            <View style={styles.raffleSection}>
              <View style={styles.raffleDecoration} />
              <View style={styles.raffleContent}>
                <Icon name="trophy" size={20} color="#B45309" />
                <View style={styles.raffleText}>
                  <Text style={styles.raffleTitle}>You&apos;re in the draw!</Text>
                  <Text style={styles.raffleDescription}>
                    Thanks for donating! You&apos;ve earned{' '}
                    <Text style={styles.rafflePoints}>50 pts</Text>. If you win our weekly raffle,
                    we will call you directly.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Important Note */}
        <View style={styles.noteSection}>
          <Icon name="info-circle" size={14} color="#9CA3AF" />
          <Text style={styles.noteText}>
            <Text style={styles.noteBold}>Requirement:</Text> Please ensure your medical information
            is registered in the app. Only donors with verified medical records can proceed at the
            venue.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarContent}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveImage}>
            <Text style={styles.saveButtonText}>Save Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // gray-50
  },
  // Decorative Header Background
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 256, // h-64
    backgroundColor: '#B45309', // amber-700
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  headerPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    // Pattern would be implemented with a background image or SVG
  },
  headerCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 80,
    // Note: 'filter' is not supported in React Native. Use opacity or blur effects via libraries if needed
  },
  headerCircle2: {
    position: 'absolute',
    top: 80,
    left: -40,
    width: 128,
    height: 128,
    backgroundColor: 'rgba(251, 191, 36, 0.1)', // orange-300
    borderRadius: 64,
    // Note: 'filter' is not supported in React Native. Use opacity or blur effects via libraries if needed
  },
  // Navbar
  navbar: {
    position: 'relative',
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    // Note: 'backdropFilter' is not supported in React Native
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  // Main Content
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  // Success Section
  successSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#FED7AA', // orange-100
    marginTop: 4,
  },
  // Ticket Card
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  // QR Section with Scallop Effect
  qrSection: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderStyle: 'dashed',
    position: 'relative',
  },
  scallopLeft: {
    position: 'absolute',
    bottom: -10,
    left: -10,
    width: 20,
    height: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
  },
  scallopRight: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 20,
    height: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(180, 83, 9, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  qrCode: {
    width: 160,
    height: 160,
    opacity: 0.9,
  },
  referenceContainer: {
    alignItems: 'center',
  },
  referenceLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  referenceId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  // Details Section
  detailsSection: {
    padding: 24,
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
  },
  // Blood Type Reminder
  bloodTypeReminder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  bloodTypeIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bloodTypeLabel: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  bloodTypeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  // Info Grid
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  infoItem: {
    width: '50%',
    marginBottom: 16,
  },
  infoItemFull: {
    width: '100%',
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 4,
  },
  // Raffle Section
  raffleSection: {
    backgroundColor: 'rgba(255, 251, 235, 0.5)',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  raffleDecoration: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 48,
    height: 48,
    backgroundColor: 'rgba(180, 83, 9, 0.1)',
    borderRadius: 24,
    // Note: 'filter' is not supported in React Native
  },
  raffleContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  raffleText: {
    flex: 1,
    marginLeft: 12,
  },
  raffleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  raffleDescription: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
  },
  rafflePoints: {
    fontWeight: 'bold',
    color: '#B45309',
  },
  // Note Section
  noteSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  noteText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    marginLeft: 12,
    flex: 1,
  },
  noteBold: {
    fontWeight: '600',
    color: '#374151',
  },
  // Bottom Action Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
    paddingBottom: 32, // safe area
  },
  bottomBarContent: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  doneButton: {
    flex: 2,
    backgroundColor: '#B45309',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  doneButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default BloodDonationConfirmationScreen;
