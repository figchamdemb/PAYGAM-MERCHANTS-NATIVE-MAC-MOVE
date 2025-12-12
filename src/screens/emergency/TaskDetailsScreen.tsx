/**
 * ✅ PATROL APP - TASK DETAILS SCREEN (BASE COMPONENT)
 * Reusable emergency task details with map, task info, and action buttons
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
  ScrollView,
  Animated,
  Dimensions,
  Linking,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle, Rect, Defs, Pattern } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// ==================== TYPES ====================
export interface TaskData {
  id: string;
  type: 'police' | 'fire' | 'ambulance' | 'immigration';
  location: string;
  coordinates: { lat: number; lng: number };
  urgency: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  time: string;
  message: string;
  reporterName: string;
  reporterPhone: string;
  assignedStation: string;
  distance: string;
  eta: string;
}

export interface DepartmentConfig {
  type: 'police' | 'fire' | 'ambulance' | 'immigration';
  primaryColor: string;
  secondaryColor: string;
  headerTitle: string;
  icon: React.ReactNode;
  markerColor: string;
}

interface Props {
  taskData: TaskData;
  config: DepartmentConfig;
  nextJobs?: TaskData[];
}

// ==================== SVG ICONS ====================
const ChevronLeftIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </Svg>
);

const CarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#1E40AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </Svg>
);

const PersonAlertIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </Svg>
);

const LocationArrowIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
  </Svg>
);

const MapPinIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </Svg>
);

const ClockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </Svg>
);

const ClipboardIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
  </Svg>
);

const FileIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
  </Svg>
);

const HomeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#1E40AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </Svg>
);

// ==================== MAIN COMPONENT ====================
const TaskDetailsScreen: React.FC<Props> = ({ taskData, config, nextJobs = [] }) => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'current' | 'next'>('current');
  const [stage, setStage] = useState<'accept' | 'start' | 'arrived'>('accept');
  const [jobs, setJobs] = useState<TaskData[]>(nextJobs);
  const [showToast, setShowToast] = useState(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [selectedCaseOption, setSelectedCaseOption] = useState<string | null>(null);
  const [showCaseConfirmation, setShowCaseConfirmation] = useState(false);
  
  const toastAnim = useRef(new Animated.Value(-100)).current;
  const patrolAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;

  // Case options based on department type
  const caseOptions = [
    { id: 'anti-crime', label: 'Transfer to Anti-Crime Unit', icon: '🔍', description: 'Pass case to specialized investigation team' },
    { id: 'general-station', label: 'Transfer to General Station', icon: '🏢', description: 'Hand over to nearest police station' },
    { id: 'investigation', label: 'Pending Investigation', icon: '📋', description: 'Suspect arrested, case under review' },
    { id: 'leave-open', label: 'Leave Case Open', icon: '⏳', description: 'Case remains active, ongoing monitoring' },
  ];

  // Pulse animation for emergency marker
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
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

  const showToastMessage = () => {
    setShowToast(true);
    Animated.sequence([
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(toastAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowToast(false));
  };

  const handleAcceptNow = () => {
    setStage('start');
  };

  const handleAcceptForNext = () => {
    const newJob = { ...taskData, id: `task-${Date.now()}` };
    setJobs([...jobs, newJob]);
    showToastMessage();
  };

  const handleStartNavigation = () => {
    // Open Google Maps with coordinates
    const url = `https://www.google.com/maps/dir/?api=1&destination=${taskData.coordinates.lat},${taskData.coordinates.lng}`;
    Linking.openURL(url);
    setStage('arrived');
  };

  const handleArrived = () => {
    // Navigate to department-specific Emergency Response screen
    const screenName = getEmergencyResponseScreenName();
    navigation.navigate(screenName, { 
      taskData, 
      config,
      remainingJobs: jobs.length 
    });
  };

  const getEmergencyResponseScreenName = () => {
    switch (config.type) {
      case 'police': return 'PoliceEmergencyResponse';
      case 'fire': return 'FireEmergencyResponse';
      case 'ambulance': return 'AmbulanceEmergencyResponse';
      case 'immigration': return 'ImmigrationEmergencyResponse';
      default: return 'PoliceEmergencyResponse';
    }
  };

  const handleRemoveJob = (jobId: string) => {
    setJobs(jobs.filter(job => job.id !== jobId));
  };

  const handleStartJobFromQueue = (job: TaskData) => {
    // Remove from queue and make it current
    setJobs(jobs.filter(j => j.id !== job.id));
    setActiveTab('current');
    setStage('start');
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'URGENT': return '#EF4444';
      case 'HIGH': return '#F59E0B';
      case 'MEDIUM': return '#3B82F6';
      default: return '#10B981';
    }
  };

  const handleOpenCase = () => {
    setShowCaseModal(true);
    Animated.spring(modalAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const handleCloseCaseModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowCaseModal(false);
      setSelectedCaseOption(null);
    });
  };

  const handleSelectCaseOption = (optionId: string) => {
    setSelectedCaseOption(optionId);
  };

  const handleConfirmCase = () => {
    if (selectedCaseOption) {
      setShowCaseModal(false);
      setShowCaseConfirmation(true);
      // Reset after showing confirmation
      setTimeout(() => {
        setShowCaseConfirmation(false);
        setSelectedCaseOption(null);
        // Navigate back or to dashboard
        navigation.goBack();
      }, 2500);
    }
  };

  const getSelectedOptionLabel = () => {
    const option = caseOptions.find(o => o.id === selectedCaseOption);
    return option ? option.label : '';
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Toast Notification */}
      {showToast && (
        <Animated.View style={[styles.toast, { transform: [{ translateY: toastAnim }] }]}>
          <View style={styles.toastIcon}>
            <Text style={styles.toastIconText}>✓</Text>
          </View>
          <View>
            <Text style={styles.toastTitle}>Success</Text>
            <Text style={styles.toastMessage}>Successfully added to next jobs</Text>
          </View>
        </Animated.View>
      )}

      {/* Header */}
      <View style={[styles.header, { backgroundColor: config.primaryColor }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <ChevronLeftIcon size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <TouchableOpacity style={styles.backToMapBtn}>
          <Text style={styles.backToMapText}>Back to Map</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'current' && styles.tabActive]}
          onPress={() => setActiveTab('current')}
        >
          <Text style={[styles.tabText, activeTab === 'current' && styles.tabTextActive]}>
            Current Task
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'next' && styles.tabActive]}
          onPress={() => setActiveTab('next')}
        >
          <Text style={[styles.tabText, activeTab === 'next' && styles.tabTextActive]}>
            Next Jobs
          </Text>
          {jobs.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{jobs.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'current' ? (
          <View style={styles.currentTaskView}>
            {/* Map */}
            <View style={styles.mapContainer}>
              <Svg width="100%" height="100%" viewBox="0 0 400 300">
                <Defs>
                  <Pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <Path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                  </Pattern>
                </Defs>
                <Rect width="100%" height="100%" fill="#F1F5F9" />
                <Rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Roads */}
                <Path d="M 200 0 L 200 300" stroke="#FFFFFF" strokeWidth="25" />
                <Path d="M 0 150 L 400 150" stroke="#FFFFFF" strokeWidth="25" />
                <Path d="M 100 0 L 100 300" stroke="#FFFFFF" strokeWidth="15" />
                
                {/* Park */}
                <Rect x="220" y="160" width="150" height="120" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1" rx="4" />
                
                {/* Route Line */}
                {stage !== 'accept' && (
                  <Path 
                    d="M 100 80 L 100 150 L 200 150 L 200 200" 
                    stroke={config.primaryColor} 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeDasharray="8,4"
                    fill="none"
                    opacity={0.8}
                  />
                )}
              </Svg>

              {/* Map Legend */}
              <View style={styles.mapLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: config.primaryColor }]} />
                  <Text style={styles.legendText}>Patrol Team</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                  <Text style={styles.legendText}>Emergency</Text>
                </View>
              </View>

              {/* Current Location Card */}
              <View style={styles.locationCard}>
                <Text style={styles.locationCardTitle}>CURRENT LOCATION</Text>
                <Text style={styles.locationCardText}>Trafalgar Square, London WC2N</Text>
                <View style={styles.locationCardDivider} />
                <Text style={styles.locationCardTitle}>DISTANCE</Text>
                <Text style={styles.locationCardText}>{taskData.distance} ({taskData.eta})</Text>
              </View>

              {/* Patrol Marker */}
              <View style={[styles.patrolMarker, { left: '25%', top: '26%' }]}>
                <View style={[styles.markerCircle, { borderColor: config.primaryColor }]}>
                  <CarIcon size={16} color={config.primaryColor} />
                </View>
                <View style={styles.markerLabel}>
                  <Text style={styles.markerLabelText}>You</Text>
                </View>
              </View>

              {/* Emergency Marker */}
              <View style={[styles.emergencyMarker, { left: '50%', top: '66%' }]}>
                <Animated.View 
                  style={[
                    styles.pulseRing, 
                    { 
                      transform: [{ scale: pulseAnim }],
                      opacity: pulseAnim.interpolate({
                        inputRange: [1, 1.5],
                        outputRange: [0.6, 0],
                      }),
                    }
                  ]} 
                />
                <View style={styles.emergencyCircle}>
                  <PersonAlertIcon size={20} color="#EF4444" />
                </View>
                <View style={[styles.markerLabel, styles.emergencyLabel]}>
                  <Text style={styles.emergencyLabelText}>Emergency</Text>
                </View>
              </View>
            </View>

            {/* Task Info Card */}
            <View style={styles.taskCard}>
              <View style={styles.dragHandle} />

              <View style={styles.taskHeader}>
                <View style={[styles.taskDot, { backgroundColor: config.primaryColor }]} />
                <Text style={styles.taskHeaderTitle}>EMERGENCY TASK DETAILS</Text>
              </View>

              <View style={styles.taskLocation}>
                <View style={styles.taskLocationIcon}>
                  <Text style={{ fontSize: 16 }}>👋</Text>
                </View>
                <View style={styles.taskLocationInfo}>
                  <Text style={styles.taskLocationLabel}>LOCATION</Text>
                  <Text style={styles.taskLocationText}>{taskData.location}</Text>
                  <Text style={[styles.taskUrgency, { color: getUrgencyColor(taskData.urgency) }]}>
                    {taskData.urgency}: {taskData.time}
                  </Text>
                </View>
              </View>

              <View style={styles.taskMessage}>
                <Text style={styles.taskMessageLabel}>MESSAGE FROM USER</Text>
                <View style={styles.taskMessageBox}>
                  <Text style={styles.taskMessageText}>{taskData.message}</Text>
                </View>
              </View>

              <View style={styles.taskDetails}>
                <View style={styles.taskDetailItem}>
                  <Text style={styles.taskDetailLabel}>NAME</Text>
                  <Text style={styles.taskDetailValue}>{taskData.reporterName}</Text>
                </View>
                <View style={styles.taskDetailItem}>
                  <Text style={styles.taskDetailLabel}>PHONE</Text>
                  <Text style={styles.taskDetailValue}>{taskData.reporterPhone}</Text>
                </View>
              </View>

              <View style={styles.taskStation}>
                <Text style={styles.taskDetailLabel}>ASSIGNED STATION</Text>
                <View style={styles.taskStationValue}>
                  <View style={styles.stationDot} />
                  <Text style={styles.taskDetailValue}>{taskData.assignedStation}</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                {stage === 'accept' && (
                  <>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.actionBtnPrimary, { backgroundColor: config.primaryColor }]}
                      onPress={handleAcceptNow}
                    >
                      <Text style={styles.actionBtnTextPrimary}>Accept Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.actionBtnSecondary, { borderColor: config.primaryColor }]}
                      onPress={handleAcceptForNext}
                    >
                      <Text style={[styles.actionBtnTextSecondary, { color: config.primaryColor }]}>
                        Accept for Next Job
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                {stage === 'start' && (
                  <>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.actionBtnPrimary, { backgroundColor: config.primaryColor }]}
                      onPress={handleStartNavigation}
                    >
                      <LocationArrowIcon size={16} color="#FFFFFF" />
                      <Text style={[styles.actionBtnTextPrimary, { marginLeft: 8 }]}>Start Moving Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.actionBtnCancel]}
                      onPress={() => setStage('accept')}
                    >
                      <Text style={styles.actionBtnTextCancel}>Cancel</Text>
                    </TouchableOpacity>
                  </>
                )}

                {stage === 'arrived' && (
                  <>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.actionBtnPrimary, { backgroundColor: '#10B981' }]}
                      onPress={handleArrived}
                    >
                      <Text style={styles.actionBtnTextPrimary}>You Arrived</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.actionBtnCancel]}
                      onPress={handleOpenCase}
                    >
                      <Text style={styles.actionBtnTextCancel}>Open A Case</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        ) : (
          <ScrollView style={styles.nextJobsView} showsVerticalScrollIndicator={false}>
            <Text style={styles.nextJobsTitle}>Your Next Jobs</Text>
            
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <View key={job.id} style={styles.jobCard}>
                  <View style={styles.jobCardHeader}>
                    <View>
                      <View style={styles.jobCardTitleRow}>
                        <Text style={styles.jobCardTitle}>Task #{job.id}</Text>
                        <View style={styles.jobCardBadge}>
                          <Text style={styles.jobCardBadgeText}>PENDING</Text>
                        </View>
                      </View>
                      <View style={styles.jobCardLocation}>
                        <MapPinIcon size={14} color="#94A3B8" />
                        <Text style={styles.jobCardLocationText}>{job.location}</Text>
                      </View>
                      <View style={styles.jobCardTime}>
                        <ClockIcon size={14} color="#94A3B8" />
                        <Text style={styles.jobCardTimeText}>{job.time}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.jobCardActions}>
                    <TouchableOpacity 
                      style={styles.jobCardRemoveBtn}
                      onPress={() => handleRemoveJob(job.id)}
                    >
                      <Text style={styles.jobCardRemoveBtnText}>Remove</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.jobCardStartBtn, { backgroundColor: config.primaryColor }]}
                      onPress={() => handleStartJobFromQueue(job)}
                    >
                      <Text style={styles.jobCardStartBtnText}>Start Task</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyStateIcon}>
                  <ClipboardIcon size={32} color="#94A3B8" />
                </View>
                <Text style={styles.emptyStateTitle}>No upcoming jobs</Text>
                <Text style={styles.emptyStateText}>You're all caught up!</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomNavItem}>
          <FileIcon size={24} color="#94A3B8" />
          <Text style={styles.bottomNavText}>Immigration</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomNavItem, styles.bottomNavItemActive]}>
          <View style={styles.bottomNavActiveIcon}>
            <HomeIcon size={24} color={config.primaryColor} />
          </View>
          <Text style={[styles.bottomNavText, { color: config.primaryColor }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem}>
          <CarIcon size={24} color="#94A3B8" />
          <Text style={styles.bottomNavText}>Car Info</Text>
        </TouchableOpacity>
      </View>

      {/* Open A Case Modal */}
      {showCaseModal && (
        <Animated.View 
          style={[
            styles.caseModalOverlay, 
            { 
              opacity: modalAnim,
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.caseModalBackdrop} 
            activeOpacity={1} 
            onPress={handleCloseCaseModal} 
          />
          <Animated.View 
            style={[
              styles.caseModalContainer,
              {
                transform: [{
                  translateY: modalAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0]
                  })
                }]
              }
            ]}
          >
            <View style={styles.caseModalHandle} />
            <Text style={styles.caseModalTitle}>📋 Open A Case</Text>
            <Text style={styles.caseModalSubtitle}>Select where to transfer or how to handle this case</Text>
            
            <View style={styles.caseOptionsContainer}>
              {caseOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.caseOption,
                    selectedCaseOption === option.id && styles.caseOptionSelected,
                    selectedCaseOption === option.id && { borderColor: config.primaryColor }
                  ]}
                  onPress={() => handleSelectCaseOption(option.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.caseOptionLeft}>
                    <Text style={styles.caseOptionIcon}>{option.icon}</Text>
                    <View style={styles.caseOptionText}>
                      <Text style={[
                        styles.caseOptionLabel,
                        selectedCaseOption === option.id && { color: config.primaryColor }
                      ]}>{option.label}</Text>
                      <Text style={styles.caseOptionDescription}>{option.description}</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.caseOptionRadio,
                    selectedCaseOption === option.id && styles.caseOptionRadioSelected,
                    selectedCaseOption === option.id && { borderColor: config.primaryColor, backgroundColor: config.primaryColor }
                  ]}>
                    {selectedCaseOption === option.id && (
                      <View style={styles.caseOptionRadioInner} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.caseModalActions}>
              <TouchableOpacity 
                style={styles.caseModalCancelBtn}
                onPress={handleCloseCaseModal}
              >
                <Text style={styles.caseModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.caseModalConfirmBtn,
                  { backgroundColor: selectedCaseOption ? config.primaryColor : '#CBD5E1' }
                ]}
                onPress={handleConfirmCase}
                disabled={!selectedCaseOption}
              >
                <Text style={styles.caseModalConfirmText}>Confirm Transfer</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      )}

      {/* Case Confirmation Toast */}
      {showCaseConfirmation && (
        <View style={styles.caseConfirmationOverlay}>
          <View style={styles.caseConfirmationCard}>
            <View style={[styles.caseConfirmationIcon, { backgroundColor: config.primaryColor + '20' }]}>
              <Text style={styles.caseConfirmationIconText}>✅</Text>
            </View>
            <Text style={styles.caseConfirmationTitle}>Case Transferred</Text>
            <Text style={styles.caseConfirmationText}>{getSelectedOptionLabel()}</Text>
            <Text style={styles.caseConfirmationSubtext}>Case #{taskData.id} has been recorded</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  
  // Toast
  toast: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
    left: 20,
    right: 20,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toastIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  toastIconText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  toastTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  toastMessage: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 24) + 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  backToMapBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  backToMapText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tabActive: {
    borderBottomColor: '#1E40AF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#1E40AF',
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  
  // Content
  content: {
    flex: 1,
    backgroundColor: '#EFF6FF',
  },
  
  // Current Task View
  currentTaskView: {
    flex: 1,
  },
  
  // Map
  mapContainer: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    position: 'relative',
  },
  mapLegend: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  locationCard: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    maxWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  locationCardTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  locationCardText: {
    fontSize: 10,
    color: '#6B7280',
    lineHeight: 14,
  },
  locationCardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },
  
  // Markers
  patrolMarker: {
    position: 'absolute',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    alignItems: 'center',
  },
  markerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  markerLabel: {
    marginTop: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  markerLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#374151',
  },
  emergencyMarker: {
    position: 'absolute',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(239, 68, 68, 0.4)',
    top: -10,
    left: -10,
  },
  emergencyCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1,
  },
  emergencyLabel: {
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  emergencyLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#EF4444',
  },
  
  // Task Card
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 12,
  },
  dragHandle: {
    width: 48,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  taskHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.5,
  },
  taskLocation: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  taskLocationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskLocationInfo: {
    flex: 1,
  },
  taskLocationLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 2,
  },
  taskLocationText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  taskUrgency: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  taskMessage: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    marginBottom: 12,
  },
  taskMessageLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 6,
  },
  taskMessageBox: {
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  taskMessageText: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },
  taskDetails: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    marginBottom: 12,
  },
  taskDetailItem: {
    flex: 1,
  },
  taskDetailLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  taskDetailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  taskStation: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    marginBottom: 16,
  },
  taskStationValue: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  stationDot: {
    width: 8,
    height: 8,
    backgroundColor: '#10B981',
    borderRadius: 2,
    marginRight: 6,
  },
  
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  actionBtnPrimary: {
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionBtnSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
  },
  actionBtnCancel: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  actionBtnTextPrimary: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionBtnTextSecondary: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionBtnTextCancel: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Next Jobs View
  nextJobsView: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  nextJobsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  jobCardHeader: {
    marginBottom: 12,
  },
  jobCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 8,
  },
  jobCardBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  jobCardBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E40AF',
  },
  jobCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  jobCardLocationText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
  },
  jobCardTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobCardTimeText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 6,
  },
  jobCardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  jobCardRemoveBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 6,
  },
  jobCardRemoveBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#EF4444',
  },
  jobCardStartBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  jobCardStartBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  
  // Bottom Nav
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  bottomNavItemActive: {},
  bottomNavActiveIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  bottomNavText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 4,
  },
  
  // Case Modal Styles
  caseModalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  caseModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  caseModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: height * 0.75,
  },
  caseModalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  caseModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  caseModalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  caseOptionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  caseOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  caseOptionSelected: {
    backgroundColor: '#EFF6FF',
  },
  caseOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  caseOptionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  caseOptionText: {
    flex: 1,
  },
  caseOptionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  caseOptionDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  caseOptionRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  caseOptionRadioSelected: {
    borderWidth: 0,
  },
  caseOptionRadioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  caseModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  caseModalCancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  caseModalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  caseModalConfirmBtn: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  caseModalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Case Confirmation
  caseConfirmationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  caseConfirmationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: width * 0.8,
    maxWidth: 320,
  },
  caseConfirmationIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  caseConfirmationIconText: {
    fontSize: 36,
  },
  caseConfirmationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  caseConfirmationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
    textAlign: 'center',
    marginBottom: 4,
  },
  caseConfirmationSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default TaskDetailsScreen;
