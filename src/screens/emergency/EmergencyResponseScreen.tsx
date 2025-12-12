/**
 * ✅ PATROL APP - EMERGENCY RESPONSE SCREEN (BASE COMPONENT)
 * Navigation/En-Route screen with turn-by-turn directions and action controls
 * Used by Police, Fire, Ambulance, and Immigration departments
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// ==================== TYPES ====================
export interface IncidentData {
  id: string;
  type: 'police' | 'fire' | 'ambulance' | 'immigration';
  title: string;
  code: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  location: string;
  sector: string;
  eta: string;
  distance: string;
  arrivalTime: string;
  nextTurn: string;
  nextStreet: string;
  turnDistance: string;
}

export interface DepartmentConfig {
  type: 'police' | 'fire' | 'ambulance' | 'immigration';
  primaryColor: string;
  secondaryColor: string;
  headerBg: string;
  icon: React.ReactNode;
}

interface Props {
  incidentData: IncidentData;
  config: DepartmentConfig;
  remainingJobs?: number;
  onComplete?: () => void;
}

// ==================== SVG ICONS ====================
const ArrowRightIcon: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MapLayersIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.447-.894L15 7m0 13V7" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const NavigationIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#1E40AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
  </Svg>
);

const LocationPinIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BoltIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const WarningIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </Svg>
);

const CloseIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </Svg>
);

// ==================== MAIN COMPONENT ====================
const EmergencyResponseScreen: React.FC<Props> = ({ 
  incidentData, 
  config, 
  remainingJobs = 0,
  onComplete 
}) => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  
  const [status, setStatus] = useState<'en-route' | 'on-scene' | 'completed'>('en-route');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for live traffic indicator
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const handleEnRoute = () => {
    setStatus('en-route');
  };

  const handleOnScene = () => {
    setStatus('on-scene');
  };

  const handleComplete = () => {
    setStatus('completed');
    setShowCompletionModal(true);
  };

  const handleRequestBackup = () => {
    // Trigger backup request animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Show alert or navigate to backup request
    console.log('Backup requested for incident:', incidentData.id);
  };

  const handleProceedToNextJob = () => {
    setShowCompletionModal(false);
    navigation.goBack();
  };

  const handleGoToDashboard = () => {
    setShowCompletionModal(false);
    navigation.reset({
      index: 0,
      routes: [{ name: getDashboardName() }],
    });
  };

  const getDashboardName = () => {
    switch (config.type) {
      case 'police': return 'PoliceDashboard';
      case 'fire': return 'FireDashboard';
      case 'ambulance': return 'AmbulanceDashboard';
      case 'immigration': return 'ImmigrationDashboard';
      default: return 'Dashboard';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return '#EF4444';
      case 'High': return '#F59E0B';
      case 'Medium': return '#3B82F6';
      default: return '#10B981';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Map Background */}
      <View style={styles.mapBackground}>
        <Svg width="100%" height="100%" viewBox="0 0 400 800">
          {/* Background */}
          <Rect width="100%" height="100%" fill="#E5E7EB" />
          
          {/* Roads */}
          <Rect x="80" y="0" width="64" height="800" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="2" />
          <Rect x="0" y="160" width="400" height="64" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="2" />
          <Rect x="0" y="400" width="400" height="80" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="2" transform="rotate(-12, 0, 400)" />
          <Rect x="280" y="0" width="48" height="800" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="2" />
          
          {/* Park areas */}
          <Rect x="20" y="20" width="48" height="128" fill="#DCFCE7" rx="8" opacity="0.5" />
          <Rect x="280" y="500" width="100" height="100" fill="#E5E7EB" rx="8" opacity="0.5" />
          
          {/* Route line */}
          <Path 
            d="M 112 800 L 112 450 Q 112 400 160 390 L 350 340" 
            fill="none" 
            stroke="#3B82F6" 
            strokeWidth="8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            opacity="0.4"
          />
          <Path 
            d="M 112 800 L 112 450 Q 112 400 160 390 L 350 340" 
            fill="none" 
            stroke={config.primaryColor} 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeDasharray="10,5"
          />
          
          {/* Destination marker */}
          <Circle cx="350" cy="340" r="20" fill="#EF4444" opacity="0.2" />
          <Circle cx="350" cy="340" r="8" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
        </Svg>

        {/* Current Location Puck */}
        <View style={styles.locationPuck}>
          <View style={styles.directionCone} />
          <View style={styles.puckOuter}>
            <View style={[styles.puckInner, { backgroundColor: config.primaryColor }]} />
          </View>
        </View>
      </View>

      {/* Top Navigation Strip */}
      <View style={[styles.navStrip, { backgroundColor: config.headerBg }]}>
        <View style={styles.navContent}>
          <View style={styles.navIcon}>
            <ArrowRightIcon size={40} color="#FFFFFF" />
          </View>
          <View style={styles.navInfo}>
            <Text style={styles.navSubtitle}>{incidentData.nextTurn}</Text>
            <Text style={styles.navTitle}>{incidentData.nextStreet}</Text>
          </View>
          <View style={styles.navDistance}>
            <Text style={styles.navDistanceValue}>{incidentData.turnDistance}</Text>
            <Text style={styles.navDistanceUnit}>FEET</Text>
          </View>
        </View>
      </View>

      {/* Incident Info Overlay */}
      <View style={styles.incidentOverlay}>
        <View style={[styles.incidentCard, { borderLeftColor: getSeverityColor(incidentData.severity) }]}>
          <View style={styles.incidentHeader}>
            <View style={styles.incidentHeaderLeft}>
              <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(incidentData.severity) + '20' }]}>
                <Text style={[styles.severityText, { color: getSeverityColor(incidentData.severity) }]}>
                  Severity: {incidentData.severity}
                </Text>
              </View>
              <Text style={styles.incidentTitle}>{incidentData.title}</Text>
            </View>
            <View style={styles.codeBox}>
              <Text style={styles.codeLabel}>CODE</Text>
              <Text style={styles.codeValue}>{incidentData.code}</Text>
            </View>
          </View>
          <View style={styles.incidentLocation}>
            <LocationPinIcon size={16} color="#6B7280" />
            <Text style={styles.locationText}>{incidentData.location}, {incidentData.sector}</Text>
          </View>
        </View>
      </View>

      {/* Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.mapControlBtn}>
          <MapLayersIcon size={24} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapControlBtn}>
          <NavigationIcon size={24} color={config.primaryColor} />
        </TouchableOpacity>
      </View>

      {/* Bottom Control Panel */}
      <View style={styles.bottomPanel}>
        <View style={styles.dragHandle} />

        {/* Trip Info */}
        <View style={styles.tripInfo}>
          <View style={styles.tripInfoLeft}>
            <Text style={styles.tripEta}>{incidentData.eta}</Text>
            <Text style={styles.tripDetails}>{incidentData.distance} • {incidentData.arrivalTime} Arrival</Text>
          </View>
          <View style={styles.liveTraffic}>
            <Animated.View 
              style={[
                styles.liveTrafficDot,
                {
                  opacity: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                }
              ]}
            />
            <View style={styles.liveTrafficDotInner} />
            <Text style={styles.liveTrafficText}>Live Traffic</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={[
              styles.actionButton,
              status === 'en-route' 
                ? [styles.actionButtonActive, { backgroundColor: config.primaryColor }]
                : styles.actionButtonInactive
            ]}
            onPress={handleEnRoute}
          >
            <View style={styles.actionButtonContent}>
              <BoltIcon size={24} color={status === 'en-route' ? '#FFFFFF' : '#9CA3AF'} />
              <Text style={[
                styles.actionButtonText,
                status === 'en-route' ? styles.actionButtonTextActive : styles.actionButtonTextInactive
              ]}>
                En Route
              </Text>
            </View>
            {status === 'en-route' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.actionButton,
              status === 'on-scene' 
                ? [styles.actionButtonActive, { backgroundColor: config.primaryColor }]
                : styles.actionButtonInactive
            ]}
            onPress={status === 'en-route' ? handleOnScene : undefined}
          >
            <View style={styles.actionButtonContent}>
              <LocationPinIcon size={24} color={status === 'on-scene' ? '#FFFFFF' : '#9CA3AF'} />
              <Text style={[
                styles.actionButtonText,
                status === 'on-scene' ? styles.actionButtonTextActive : styles.actionButtonTextInactive
              ]}>
                On Scene
              </Text>
            </View>
            {status === 'on-scene' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Complete / SOS Button */}
        {status === 'on-scene' ? (
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={handleComplete}
          >
            <View style={styles.completeButtonIcon}>
              <CheckIcon size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.completeButtonText}>Mark Complete</Text>
          </TouchableOpacity>
        ) : (
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity 
              style={styles.sosButton}
              onPress={handleRequestBackup}
            >
              <View style={styles.sosButtonIcon}>
                <WarningIcon size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.sosButtonText}>Request Backup</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Safe Area Spacer */}
        <View style={styles.safeAreaSpacer} />
      </View>

      {/* Completion Modal */}
      <Modal
        visible={showCompletionModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalCloseBtn}
              onPress={() => setShowCompletionModal(false)}
            >
              <CloseIcon size={24} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.modalBody}>
              <View style={styles.successIcon}>
                <CheckIcon size={32} color="#10B981" />
              </View>
              <Text style={styles.modalTitle}>Task Completed!</Text>
              <Text style={styles.modalMessage}>
                Great job! The task has been marked as complete and logged in the system.
              </Text>

              <View style={styles.modalDivider} />

              {remainingJobs > 0 ? (
                <>
                  <Text style={styles.modalNextInfo}>
                    You have <Text style={styles.modalNextCount}>{remainingJobs} jobs</Text> in your queue. Proceed to next?
                  </Text>
                  <View style={styles.modalActions}>
                    <TouchableOpacity 
                      style={[styles.modalBtn, styles.modalBtnPrimary, { backgroundColor: config.primaryColor }]}
                      onPress={handleProceedToNextJob}
                    >
                      <Text style={styles.modalBtnPrimaryText}>Yes, Next Job</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.modalBtn, styles.modalBtnSecondary]}
                      onPress={handleGoToDashboard}
                    >
                      <Text style={styles.modalBtnSecondaryText}>Dashboard</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={[styles.modalBtn, styles.modalBtnPrimary, { backgroundColor: config.primaryColor }, { flex: 1 }]}
                    onPress={handleGoToDashboard}
                  >
                    <Text style={styles.modalBtnPrimaryText}>Return to Dashboard</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  // Map Background
  mapBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E5E7EB',
  },
  locationPuck: {
    position: 'absolute',
    bottom: '33%',
    left: 96,
    alignItems: 'center',
  },
  directionCone: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(30, 64, 175, 0.2)',
    marginBottom: -10,
  },
  puckOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  puckInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // Navigation Strip
  navStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24) + 10,
    paddingBottom: 16,
    paddingHorizontal: 16,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navIcon: {
    marginRight: 16,
  },
  navInfo: {
    flex: 1,
  },
  navSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  navTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  navDistance: {
    alignItems: 'flex-end',
  },
  navDistanceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  navDistanceUnit: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },

  // Incident Overlay
  incidentOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 130 : (StatusBar.currentHeight || 24) + 100,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  incidentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  incidentHeaderLeft: {
    flex: 1,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 6,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  incidentTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 28,
  },
  codeBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6B7280',
  },
  codeValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
  },
  incidentLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },

  // Map Controls
  mapControls: {
    position: 'absolute',
    right: 16,
    top: '45%',
    transform: [{ translateY: -50 }],
    gap: 12,
    zIndex: 10,
  },
  mapControlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  // Bottom Panel
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 16,
    zIndex: 30,
  },
  dragHandle: {
    width: 48,
    height: 5,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },

  // Trip Info
  tripInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tripInfoLeft: {},
  tripEta: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  tripDetails: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  liveTraffic: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveTrafficDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
  },
  liveTrafficDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  liveTrafficText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
    textTransform: 'uppercase',
  },

  // Action Grid
  actionGrid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  actionButtonActive: {
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  actionButtonContent: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 6,
  },
  actionButtonTextActive: {
    color: '#FFFFFF',
  },
  actionButtonTextInactive: {
    color: '#6B7280',
  },
  activeIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
  },

  // Complete Button
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 18,
    marginTop: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  completeButtonIcon: {
    backgroundColor: '#059669',
    padding: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // SOS Button
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 18,
    marginTop: 16,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sosButtonIcon: {
    backgroundColor: '#991B1B',
    padding: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  sosButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  safeAreaSpacer: {
    height: Platform.OS === 'ios' ? 24 : 16,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    alignItems: 'center',
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
  },
  modalNextInfo: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalNextCount: {
    color: '#1E40AF',
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalBtnPrimary: {
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalBtnSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  modalBtnSecondaryText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EmergencyResponseScreen;
