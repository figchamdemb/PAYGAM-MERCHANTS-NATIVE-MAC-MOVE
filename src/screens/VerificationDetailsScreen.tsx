/**
 * PAYGAM MERCHANT - VERIFICATION DETAILS SCREEN
 * KYC verification status showing verified address and ID
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const ChevronLeftIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#4B5563' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ShieldCheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#16A34A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
  </Svg>
);

const MapPinIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </Svg>
);

const PassportIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H6zm6 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 14H5v-.23c0-.62.28-1.2.76-1.58C7.47 16.82 9.64 16 12 16s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V20z" />
  </Svg>
);

const CheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#16A34A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CalendarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth={2} />
    <Path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// ==================== TYPES ====================
interface AddressHistory {
  id: string;
  street: string;
  city: string;
  dateRange: string;
}

// ==================== MAIN COMPONENT ====================
const VerificationDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Pulse animation for the status indicator
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Demo data
  const currentAddress = {
    street: '4582 Nexus Blvd, Suite 100',
    district: 'Tech District',
    city: 'San Francisco, CA 94107',
    verifiedDate: 'Oct 24, 2023',
  };

  const idDocument = {
    type: 'National ID Card',
    maskedId: '8921',
    verified: true,
  };

  const addressHistory: AddressHistory[] = [
    {
      id: '1',
      street: '1200 Market Street',
      city: 'Philadelphia, PA 19107',
      dateRange: '2021 - 2023',
    },
    {
      id: '2',
      street: '89 Ocean Drive',
      city: 'Miami, FL 33139',
      dateRange: '2019 - 2021',
    },
  ];

  const handleOkPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ChevronLeftIcon size={20} color="#4B5563" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verification Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Main Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Verification Status Banner */}
          <View style={styles.statusBanner}>
            <Animated.View
              style={[
                styles.statusDot,
                { transform: [{ scale: pulseAnim }] },
              ]}
            />
            <Text style={styles.statusText}>Account Fully Verified</Text>
          </View>

          {/* Current Address Section (Hero) */}
          <View style={styles.addressCard}>
            {/* Decorative Background */}
            <View style={styles.decorativeCircle} />
            
            <View style={styles.addressHeader}>
              <Text style={styles.sectionLabel}>CURRENT ADDRESS</Text>
              {/* Verified Badge */}
              <View style={styles.verifiedBadge}>
                <ShieldCheckIcon size={12} color="#16A34A" />
                <Text style={styles.verifiedText}>VERIFIED</Text>
              </View>
            </View>

            <View style={styles.addressContent}>
              <View style={styles.mapPinContainer}>
                <MapPinIcon size={20} color="#293454" />
              </View>
              <View style={styles.addressDetails}>
                <Text style={styles.streetAddress}>{currentAddress.street}</Text>
                <Text style={styles.districtText}>{currentAddress.district}</Text>
                <Text style={styles.cityText}>{currentAddress.city}</Text>
                <Text style={styles.verifiedDateText}>
                  Verified on {currentAddress.verifiedDate}
                </Text>
              </View>
            </View>
          </View>

          {/* ID Verification Section */}
          <View style={styles.idCard}>
            <Text style={styles.sectionLabel}>IDENTITY DOCUMENT</Text>
            
            <View style={styles.idContent}>
              <View style={styles.idLeft}>
                <View style={styles.passportIconContainer}>
                  <PassportIcon size={24} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.idType}>{idDocument.type}</Text>
                  <Text style={styles.idNumber}>ID: {idDocument.maskedId}</Text>
                </View>
              </View>
              <View style={styles.checkCircle}>
                <CheckIcon size={14} color="#16A34A" />
              </View>
            </View>
          </View>

          {/* Address History Section */}
          <View style={styles.historySection}>
            <Text style={styles.historySectionTitle}>Address History</Text>
            
            <View style={styles.timelineContainer}>
              {/* Vertical Line */}
              <View style={styles.timelineLine} />

              {addressHistory.map((address, index) => (
                <View key={address.id} style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.historyCard}>
                    <Text style={styles.historyStreet}>{address.street}</Text>
                    <Text style={styles.historyCity}>{address.city}</Text>
                    <View style={styles.dateRow}>
                      <CalendarIcon size={12} color="#9CA3AF" />
                      <Text style={styles.dateText}>{address.dateRange}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Button */}
        <View style={styles.bottomAction}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.okButton}
              onPress={handleOkPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
            >
              <Text style={styles.okButtonText}>OK</Text>
              <CheckIcon size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  safeArea: {
    flex: 1,
  },

  // Header
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#293454',
  },
  headerSpacer: {
    width: 40,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },

  // Status Banner
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },

  // Address Card
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 30,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    position: 'relative',
  },
  decorativeCircle: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(41, 52, 84, 0.05)',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    zIndex: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  addressContent: {
    flexDirection: 'row',
    gap: 16,
    zIndex: 10,
  },
  mapPinContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(41, 52, 84, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  addressDetails: {
    flex: 1,
  },
  streetAddress: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 26,
    marginBottom: 4,
  },
  districtText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  cityText: {
    fontSize: 14,
    color: '#6B7280',
  },
  verifiedDateText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },

  // ID Card
  idCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  idContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  idLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  passportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#293454',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#293454',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  idType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  idNumber: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 2,
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // History Section
  historySection: {
    marginBottom: 24,
  },
  historySectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#293454',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  timelineContainer: {
    paddingLeft: 16,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 25,
    top: 8,
    bottom: 8,
    width: 2,
    backgroundColor: '#E5E7EB',
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D1D5DB',
    borderWidth: 4,
    borderColor: '#F9FAFB',
    zIndex: 10,
    marginTop: 4,
  },
  historyCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyStreet: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  historyCity: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Bottom Action
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
  },
  okButton: {
    backgroundColor: '#293454',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#293454',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  okButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default VerificationDetailsScreen;
