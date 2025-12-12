/**
 * EmergencyTrackingScreen - Live Emergency Tracking Interface
 * Features:
 * - Ambulance live tracking with map simulation
 * - Driver/Paramedic details with rating
 * - Real-time ETA and distance updates
 * - Pickup and destination locations
 * - Medical details display
 * - Tab switching between Emergency Case and Nearby SOS
 * - Animated markers and progress bar
 * - Bottom sheet with scrollable content
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Types
interface DriverInfo {
  name: string;
  role: string;
  vehicle: string;
  plateNumber: string;
  rating: number;
  avatar: string;
  phone: string;
}

interface LocationInfo {
  pickup: string;
  destination: string;
}

interface MedicalInfo {
  severity: 'Critical' | 'Moderate' | 'Stable';
  condition: string;
  patientInfo: string;
}

interface SOSUser {
  id: string;
  name: string;
  distance: string;
  eta: string;
  avatar: string;
  status: 'Requesting' | 'Waiting' | 'Responded';
  location: { top: number; left: number };
}

type EmergencyStatus = 'Assigned' | 'En Route' | 'Arriving' | 'On Scene' | 'Transporting' | 'Complete';
type ActiveTab = 'emergency' | 'sos';

// Mock Data
const mockDriver: DriverInfo = {
  name: 'Musa Bah',
  role: 'Paramedic',
  vehicle: 'Toyota HiAce',
  plateNumber: 'GRA 4521',
  rating: 4.9,
  avatar: 'https://i.pravatar.cc/150?img=13',
  phone: '+220 7654321',
};

const mockLocation: LocationInfo = {
  pickup: 'Kairaba Avenue, Near Traffic Lights',
  destination: 'Edward Francis Small Teaching Hospital',
};

const mockMedical: MedicalInfo = {
  severity: 'Critical',
  condition: 'Cardiac Symptoms',
  patientInfo: 'Male, 45',
};

const mockSOSUsers: SOSUser[] = [
  {
    id: '1',
    name: 'Fatou Jallow',
    distance: '0.5 km',
    eta: '2 min',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'Requesting',
    location: { top: 35, left: 30 },
  },
  {
    id: '2',
    name: 'Omar Ceesay',
    distance: '0.8 km',
    eta: '4 min',
    avatar: 'https://i.pravatar.cc/150?img=8',
    status: 'Waiting',
    location: { top: 55, left: 65 },
  },
  {
    id: '3',
    name: 'Mariama Touray',
    distance: '1.1 km',
    eta: '5 min',
    avatar: 'https://i.pravatar.cc/150?img=9',
    status: 'Requesting',
    location: { top: 25, left: 55 },
  },
];

// SVG Icons
const ArrowLeftIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke="#374151"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const PhoneIcon = ({ color = '#FFFFFF' }: { color?: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const MessageIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
      stroke="#4B5563"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ShareIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Circle cx={18} cy={5} r={3} stroke="#FFFFFF" strokeWidth={2} />
    <Circle cx={6} cy={12} r={3} stroke="#FFFFFF" strokeWidth={2} />
    <Circle cx={18} cy={19} r={3} stroke="#FFFFFF" strokeWidth={2} />
    <Path
      d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49"
      stroke="#FFFFFF"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

const AmbulanceIcon = ({ size = 24, color = '#B45309' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8H22L22 12H18V8Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 6H15V16H2V6Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15 10H22V16H15V10Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={6} cy={16} r={2} stroke={color} strokeWidth={1.5} />
    <Circle cx={18} cy={16} r={2} stroke={color} strokeWidth={1.5} />
    <Path d="M8 10H10M9 9V11" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

const StarIcon = () => (
  <Svg width={8} height={8} viewBox="0 0 24 24" fill="#FFFFFF">
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </Svg>
);

const SOSIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={10} stroke="#EF4444" strokeWidth={2} />
    <Path d="M12 8V12M12 16H12.01" stroke="#EF4444" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const EmergencyTrackingScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>('emergency');
  const [status, setStatus] = useState<EmergencyStatus>('En Route');
  const [eta, setEta] = useState(3);
  const [distance, setDistance] = useState(1.2);
  const [progress, setProgress] = useState(75);
  const [selectedSOS, setSelectedSOS] = useState<SOSUser | null>(null);
  
  // Animations
  const pulseAnim = useRef(new Animated.Value(0.5)).current;
  const markerAnim = useRef(new Animated.Value(0)).current;
  const bottomSheetAnim = useRef(new Animated.Value(0)).current;

  // Pulse animation for ambulance marker
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, []);

  // Marker position animation (simulating movement)
  useEffect(() => {
    const moveAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(markerAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(markerAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    moveAnimation.start();
    return () => moveAnimation.stop();
  }, []);

  // Bottom sheet entrance animation
  useEffect(() => {
    Animated.spring(bottomSheetAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  // Simulate ETA countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setEta((prev) => {
        if (prev <= 1) {
          setStatus('Arriving');
          return 1;
        }
        return prev;
      });
      setProgress((prev) => Math.min(prev + 1, 100));
      setDistance((prev) => Math.max(prev - 0.05, 0));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCall = (phone?: string) => {
    const phoneNumber = phone || '116';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleMessage = () => {
    // Implement messaging logic
    console.log('Open messaging');
  };

  const handleShareLocation = () => {
    // Implement share location logic
    console.log('Share location');
  };

  const handleCancelRequest = () => {
    // Implement cancel logic
    navigation.goBack();
  };

  const handleRespondSOS = (user: SOSUser) => {
    console.log('Responding to SOS:', user.name);
    setSelectedSOS(null);
  };

  const getStatusColor = (currentStatus: EmergencyStatus) => {
    switch (currentStatus) {
      case 'Assigned':
        return '#6B7280';
      case 'En Route':
        return '#B45309';
      case 'Arriving':
        return '#059669';
      case 'On Scene':
        return '#2563EB';
      case 'Transporting':
        return '#7C3AED';
      case 'Complete':
        return '#10B981';
      default:
        return '#B45309';
    }
  };

  const markerTranslateY = markerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const markerTranslateX = markerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0.5, 1.5],
    outputRange: [0.8, 0],
  });

  const bottomSheetTranslate = bottomSheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.5, 0],
  });

  const renderEmergencyCaseContent = () => (
    <>
      {/* Status Header */}
      <View style={styles.statusHeader}>
        <View>
          <Text style={styles.statusLabel}>Status</Text>
          <Text style={styles.statusTitle}>Arriving in {eta} mins</Text>
        </View>
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceLabel}>Distance</Text>
          <Text style={styles.distanceValue}>{distance.toFixed(1)} km</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]}>
          <View style={styles.progressGradient} />
        </View>
      </View>

      {/* Driver/Vehicle Card */}
      <View style={styles.driverCard}>
        <View style={styles.driverAvatarContainer}>
          <Image source={{ uri: mockDriver.avatar }} style={styles.driverAvatar} />
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{mockDriver.rating}</Text>
            <StarIcon />
          </View>
        </View>
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{mockDriver.name}</Text>
          <Text style={styles.driverRole}>
            {mockDriver.role} • {mockDriver.vehicle}
          </Text>
          <View style={styles.plateContainer}>
            <Text style={styles.plateNumber}>{mockDriver.plateNumber}</Text>
          </View>
        </View>
        <View style={styles.driverActions}>
          <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
            <MessageIcon />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => handleCall(mockDriver.phone)}
          >
            <PhoneIcon color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Trip Details */}
      <View style={styles.tripDetails}>
        {/* Connecting Line */}
        <View style={styles.connectingLine} />

        {/* Pickup */}
        <View style={styles.locationRow}>
          <View style={styles.locationIconContainer}>
            <View style={[styles.locationDot, styles.pickupDot]} />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>PICKUP LOCATION</Text>
            <Text style={styles.locationAddress}>{mockLocation.pickup}</Text>
          </View>
        </View>

        {/* Destination */}
        <View style={styles.locationRow}>
          <View style={styles.locationIconContainer}>
            <View style={[styles.locationDot, styles.destinationDot]} />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>DESTINATION</Text>
            <Text style={styles.locationAddress}>{mockLocation.destination}</Text>
          </View>
        </View>
      </View>

      {/* Medical Details */}
      <View style={styles.medicalSection}>
        <View style={styles.medicalHeader}>
          <Text style={styles.medicalTitle}>Medical Details</Text>
          <TouchableOpacity>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.medicalTags}>
          <View style={[styles.tag, styles.criticalTag]}>
            <Text style={styles.criticalTagText}>{mockMedical.severity}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{mockMedical.condition}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{mockMedical.patientInfo}</Text>
          </View>
        </View>
      </View>
    </>
  );

  const renderSOSContent = () => (
    <>
      {/* SOS Header */}
      <View style={styles.sosHeader}>
        <Text style={styles.sosTitle}>Nearby SOS Requests</Text>
        <Text style={styles.sosSubtitle}>
          {mockSOSUsers.length} people need assistance nearby
        </Text>
      </View>

      {/* SOS User List */}
      {mockSOSUsers.map((user) => (
        <TouchableOpacity
          key={user.id}
          style={[
            styles.sosUserCard,
            selectedSOS?.id === user.id && styles.sosUserCardSelected,
          ]}
          onPress={() => setSelectedSOS(user)}
        >
          <Image source={{ uri: user.avatar }} style={styles.sosAvatar} />
          <View style={styles.sosUserInfo}>
            <Text style={styles.sosUserName}>{user.name}</Text>
            <Text style={styles.sosUserDistance}>
              {user.distance} away • ETA {user.eta}
            </Text>
            <View
              style={[
                styles.sosStatusBadge,
                user.status === 'Requesting' && styles.sosStatusRequesting,
                user.status === 'Waiting' && styles.sosStatusWaiting,
              ]}
            >
              <Text style={styles.sosStatusText}>{user.status}</Text>
            </View>
          </View>
          <View style={styles.sosActions}>
            <TouchableOpacity
              style={styles.respondButton}
              onPress={() => handleRespondSOS(user)}
            >
              <Text style={styles.respondButtonText}>Respond</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}

      {/* SOS Info */}
      <View style={styles.sosInfoCard}>
        <SOSIcon size={24} />
        <View style={styles.sosInfoText}>
          <Text style={styles.sosInfoTitle}>Community Assistance</Text>
          <Text style={styles.sosInfoDescription}>
            Help fellow citizens in emergency. Your response can save lives.
          </Text>
        </View>
      </View>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} translucent />

      {/* Map Background */}
      <View style={styles.mapContainer}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000',
          }}
          style={styles.mapImage}
        />
        <View style={styles.mapOverlay} />

        {/* Route Line (SVG) */}
        <Svg style={styles.routeLine}>
          <Path
            d="M 170 200 Q 190 280 210 360"
            stroke="#B45309"
            strokeWidth={4}
            fill="none"
            strokeDasharray="8,4"
            strokeLinecap="round"
          />
        </Svg>

        {/* Ambulance Marker */}
        {activeTab === 'emergency' && (
          <Animated.View
            style={[
              styles.ambulanceMarker,
              {
                transform: [
                  { translateY: markerTranslateY },
                  { translateX: markerTranslateX },
                ],
              },
            ]}
          >
            {/* Pulse Ring */}
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: pulseOpacity,
                },
              ]}
            />
            {/* Marker */}
            <View style={styles.markerCircle}>
              <AmbulanceIcon size={20} color="#B45309" />
            </View>
            {/* Label */}
            <View style={styles.markerLabel}>
              <Text style={styles.markerLabelText}>EMS-04 ({eta} min)</Text>
            </View>
          </Animated.View>
        )}

        {/* SOS Markers */}
        {activeTab === 'sos' &&
          mockSOSUsers.map((user) => (
            <TouchableOpacity
              key={user.id}
              style={[
                styles.sosMarker,
                { top: `${user.location.top}%`, left: `${user.location.left}%` },
              ]}
              onPress={() => setSelectedSOS(user)}
            >
              <View
                style={[
                  styles.sosMarkerCircle,
                  selectedSOS?.id === user.id && styles.sosMarkerSelected,
                ]}
              >
                <SOSIcon size={16} />
              </View>
            </TouchableOpacity>
          ))}

        {/* User Location Marker */}
        <View style={styles.userMarker}>
          <View style={styles.userMarkerDot} />
        </View>
      </View>

      {/* Top Header */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <View style={styles.emergencyBadge}>
          <View style={styles.emergencyDot} />
          <Text style={styles.emergencyText}>Emergency Mode</Text>
        </View>
        <TouchableOpacity style={styles.emergencyCallButton} onPress={() => handleCall()}>
          <PhoneIcon color="#FFFFFF" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          { transform: [{ translateY: bottomSheetTranslate }] },
        ]}
      >
        {/* Drag Handle */}
        <View style={styles.dragHandleContainer}>
          <View style={styles.dragHandle} />
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'emergency' && styles.tabActive]}
            onPress={() => setActiveTab('emergency')}
          >
            <AmbulanceIcon
              size={16}
              color={activeTab === 'emergency' ? '#B45309' : '#9CA3AF'}
            />
            <Text
              style={[styles.tabText, activeTab === 'emergency' && styles.tabTextActive]}
            >
              Emergency Case
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'sos' && styles.tabActive]}
            onPress={() => setActiveTab('sos')}
          >
            <SOSIcon size={16} />
            <Text style={[styles.tabText, activeTab === 'sos' && styles.tabTextActive]}>
              Nearby SOS
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'emergency' ? renderEmergencyCaseContent() : renderSOSContent()}
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelRequest}>
            <Text style={styles.cancelButtonText}>Cancel Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={handleShareLocation}>
            <ShareIcon />
            <Text style={styles.shareButtonText}>Share Live Location</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  // Map Styles
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    // Gradient simulation
  },
  routeLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 5,
  },

  // Ambulance Marker
  ambulanceMarker: {
    position: 'absolute',
    top: '40%',
    left: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  pulseRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#B45309',
  },
  markerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#B45309',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 20,
  },
  markerLabel: {
    position: 'absolute',
    top: 48,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  markerLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1F2937',
  },

  // SOS Markers
  sosMarker: {
    position: 'absolute',
    zIndex: 10,
  },
  sosMarkerCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#EF4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  sosMarkerSelected: {
    backgroundColor: '#FEE2E2',
    borderWidth: 3,
  },

  // User Marker
  userMarker: {
    position: 'absolute',
    top: '60%',
    left: '55%',
    zIndex: 8,
  },
  userMarkerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },

  // Header
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 10 : 10,
    paddingBottom: 10,
    zIndex: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emergencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  emergencyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emergencyCallButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // Bottom Sheet
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 30,
  },
  dragHandleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  dragHandle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: '#FEF3C7',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
    marginLeft: 6,
  },
  tabTextActive: {
    color: '#B45309',
  },

  // Scroll Content
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },

  // Status Header
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  distanceContainer: {
    alignItems: 'flex-end',
  },
  distanceLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  distanceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B45309',
  },

  // Progress Bar
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#B45309',
    borderRadius: 4,
    position: 'relative',
  },
  progressGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Driver Card
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 24,
  },
  driverAvatarContainer: {
    position: 'relative',
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B45309',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 2,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 16,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  driverRole: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  plateContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 6,
  },
  plateNumber: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  driverActions: {
    flexDirection: 'row',
    gap: 8,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#B45309',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  // Trip Details
  tripDetails: {
    position: 'relative',
    paddingLeft: 8,
  },
  connectingLine: {
    position: 'absolute',
    left: 27,
    top: 12,
    bottom: 32,
    width: 2,
    borderLeftWidth: 2,
    borderLeftColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  locationRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  locationIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  locationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pickupDot: {
    backgroundColor: '#B45309',
    borderWidth: 4,
    borderColor: '#FEF3C7',
  },
  destinationDot: {
    backgroundColor: '#2563EB',
    borderWidth: 4,
    borderColor: '#DBEAFE',
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },

  // Medical Section
  medicalSection: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  medicalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  editButton: {
    fontSize: 12,
    fontWeight: '500',
    color: '#B45309',
  },
  medicalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  criticalTag: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  criticalTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#DC2626',
  },

  // SOS Content
  sosHeader: {
    marginBottom: 16,
  },
  sosTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  sosSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  sosUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sosUserCardSelected: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  sosAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  sosUserInfo: {
    flex: 1,
    marginLeft: 12,
  },
  sosUserName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  sosUserDistance: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  sosStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 6,
  },
  sosStatusRequesting: {
    backgroundColor: '#FEE2E2',
  },
  sosStatusWaiting: {
    backgroundColor: '#FEF3C7',
  },
  sosStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#B91C1C',
  },
  sosActions: {
    marginLeft: 8,
  },
  respondButton: {
    backgroundColor: '#B45309',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  respondButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sosInfoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  sosInfoText: {
    flex: 1,
    marginLeft: 12,
  },
  sosInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B91C1C',
  },
  sosInfoDescription: {
    fontSize: 12,
    color: '#7F1D1D',
    marginTop: 4,
    lineHeight: 18,
  },

  // Bottom Actions
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#B45309',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default EmergencyTrackingScreen;
