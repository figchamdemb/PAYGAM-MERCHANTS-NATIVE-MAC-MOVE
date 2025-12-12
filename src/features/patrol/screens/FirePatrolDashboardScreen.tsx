import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
  SafeAreaView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { colors } from '../../../config/colors';

const { width } = Dimensions.get('window');

// Fire service theme colors
const FIRE_COLORS = {
  primary: '#DC2626', // red-600
  secondary: '#EA580C', // orange-600
  light: '#FEE2E2', // red-50
  badge: '#991B1B', // red-800
};

// Types
type FirePatrolDashboardNavigationProp = StackNavigationProp<any>;

interface IncomingAlert {
  id: string;
  title: string;
  location: string;
  description: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM';
  timeAgo: string;
  type: 'fire' | 'rescue' | 'hazmat';
}

interface ActiveAssignment {
  id: string;
  title: string;
  location: string;
  units: string[];
  startedAgo: string;
}

const FirePatrolDashboardScreen: React.FC = () => {
  const navigation = useNavigation<FirePatrolDashboardNavigationProp>();

  // State
  const [shiftDuration, setShiftDuration] = useState('04:12:30');
  const [incomingAlerts, setIncomingAlerts] = useState<IncomingAlert[]>([
    {
      id: '1',
      title: 'Structure Fire - Residential Building',
      location: 'Oak Street Apartments, Unit 204',
      description: 'Multiple calls reporting smoke and flames from 2nd floor apartment.',
      priority: 'URGENT',
      timeAgo: 'Just now',
      type: 'fire',
    },
  ]);

  const [dispatchQueue, setDispatchQueue] = useState<IncomingAlert[]>([
    {
      id: '2',
      title: 'Vehicle Fire',
      location: 'Highway 101, Mile Marker 34',
      description: 'Car fire on shoulder, no injuries.',
      priority: 'HIGH',
      timeAgo: '3m ago',
      type: 'fire',
    },
    {
      id: '3',
      title: 'Medical Assist',
      location: 'Downtown Mall',
      description: 'Person trapped in elevator.',
      priority: 'MEDIUM',
      timeAgo: '12m ago',
      type: 'rescue',
    },
  ]);

  const [activeAssignment, setActiveAssignment] = useState<ActiveAssignment | null>({
    id: 'a1',
    title: 'Brush Fire',
    location: 'Forest Park, East Trail',
    units: ['E1', 'T2'],
    startedAgo: '22m ago',
  });

  // Animation for incoming alert
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (incomingAlerts.length > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -10,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [incomingAlerts]);

  // Handlers
  const handleIncomingAlertPress = (alert: IncomingAlert) => {
    navigation.navigate('DispatchDetails', { alert });
  };

  const handleAcceptAlert = (alertId: string) => {
    Alert.alert('Alert Accepted', 'Your unit has been dispatched.');
    const alert = dispatchQueue.find(a => a.id === alertId);
    if (alert) {
      setDispatchQueue(prev => prev.filter(a => a.id !== alertId));
    }
  };

  const handleViewDetails = (alertId: string) => {
    const alert = dispatchQueue.find(a => a.id === alertId);
    if (alert) {
      navigation.navigate('DispatchDetails', { alert });
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'report':
        navigation.navigate('NewReport');
        break;
      case 'equipment':
        navigation.navigate('EquipmentCheck');
        break;
      case 'location':
        navigation.navigate('LogLocation');
        break;
      case 'hydrant':
        navigation.navigate('HydrantMap');
        break;
    }
  };

  const handleRequestBackup = () => {
    Alert.alert(
      'Request Backup',
      'This will send an emergency signal to all available fire units. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'REQUEST BACKUP',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Backup Requested', 'All available units have been notified.');
          },
        },
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return '#DC2626';
      case 'HIGH':
        return '#EA580C';
      case 'MEDIUM':
        return '#F59E0B';
      default:
        return '#64748B';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'fire':
        return 'fire-flame-curved';
      case 'rescue':
        return 'hand-holding-medical';
      case 'hazmat':
        return 'radiation';
      default:
        return 'bell';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={FIRE_COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.officerInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=33' }}
                style={styles.avatar}
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View>
              <Text style={styles.officerName}>Lt. Rodriguez</Text>
              <Text style={styles.officerUnit}>Engine 5 • Station 12</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="bell" size={20} color="#FFFFFF" solid />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Shift Status Card */}
        <View style={styles.shiftCard}>
          <View style={styles.shiftItem}>
            <Text style={styles.shiftLabel}>SHIFT STATUS</Text>
            <View style={styles.shiftStatus}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>ON DUTY</Text>
            </View>
          </View>
          <View style={styles.shiftItem}>
            <Text style={styles.shiftLabel}>DURATION</Text>
            <Text style={styles.shiftDuration}>{shiftDuration}</Text>
          </View>
          <View style={styles.shiftDivider} />
          <View style={styles.shiftItem}>
            <Text style={styles.shiftLabel}>BATTERY</Text>
            <Icon name="battery-three-quarters" size={14} color="#FFFFFF" solid />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Incoming Alert */}
        {incomingAlerts.map((alert) => (
          <Animated.View
            key={alert.id}
            style={[styles.incomingAlertCard, { transform: [{ translateY: bounceAnim }] }]}
          >
            <TouchableOpacity
              onPress={() => handleIncomingAlertPress(alert)}
              activeOpacity={0.9}
            >
              <View style={styles.incomingAlertLeft} />
              <View style={styles.incomingAlertContent}>
                <View style={styles.incomingAlertIconContainer}>
                  <View style={styles.pulseRing} />
                  <View style={styles.pulseRing2} />
                  <View style={styles.incomingAlertIcon}>
                    <Icon name={getAlertIcon(alert.type)} size={20} color={FIRE_COLORS.primary} solid />
                  </View>
                </View>
                <View style={styles.incomingAlertText}>
                  <View style={styles.incomingAlertHeader}>
                    <Text style={styles.incomingAlertTitle}>INCOMING DISPATCH</Text>
                    <View style={styles.urgentBadge}>
                      <Text style={styles.urgentText}>URGENT</Text>
                    </View>
                  </View>
                  <Text style={styles.incomingAlertDescription}>{alert.title}</Text>
                  <Text style={styles.incomingAlertAction}>Tap to view details & respond</Text>
                </View>
                <Icon name="chevron-right" size={16} color="#CBD5E1" solid />
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Active Assignment */}
        {activeAssignment && (
          <View style={styles.activeCard}>
            <View style={styles.activeStatusBadge}>
              <Text style={styles.activeStatusText}>IN PROGRESS</Text>
            </View>
            <View style={styles.activeContent}>
              <View style={styles.activeIconContainer}>
                <Icon name="fire-flame-curved" size={20} color="#EA580C" solid />
              </View>
              <View style={styles.activeInfo}>
                <Text style={styles.activeTitle}>{activeAssignment.title}</Text>
                <Text style={styles.activeLocation}>
                  <Icon name="location-dot" size={12} color="#94A3B8" solid />{' '}
                  {activeAssignment.location}
                </Text>
              </View>
            </View>
            <View style={styles.activeFooter}>
              <View style={styles.unitsContainer}>
                {activeAssignment.units.map((unit, index) => (
                  <View
                    key={index}
                    style={[
                      styles.unitBadge,
                      { backgroundColor: index === 0 ? '#FEE2E2' : '#FED7AA' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.unitText,
                        { color: index === 0 ? '#991B1B' : '#C2410C' },
                      ]}
                    >
                      {unit}
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={styles.activeTime}>Started {activeAssignment.startedAgo}</Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('report')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#FEE2E2' }]}>
              <Icon name="file-pen" size={18} color={FIRE_COLORS.primary} solid />
            </View>
            <Text style={styles.quickActionText}>New Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('equipment')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFEDD5' }]}>
              <Icon name="helmet-safety" size={18} color="#EA580C" solid />
            </View>
            <Text style={styles.quickActionText}>Equipment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('location')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#D1FAE5' }]}>
              <Icon name="location-crosshairs" size={18} color="#059669" solid />
            </View>
            <Text style={styles.quickActionText}>Log Location</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('hydrant')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#DBEAFE' }]}>
              <Icon name="fire-extinguisher" size={18} color="#1E40AF" solid />
            </View>
            <Text style={styles.quickActionText}>Hydrant Map</Text>
          </TouchableOpacity>
        </View>

        {/* Dispatch Queue */}
        <View style={styles.queueHeader}>
          <Text style={styles.sectionTitle}>Dispatch Queue</Text>
          {dispatchQueue.length > 0 && (
            <View style={styles.queueBadge}>
              <Text style={styles.queueBadgeText}>{dispatchQueue.length} NEW</Text>
            </View>
          )}
        </View>

        {dispatchQueue.length > 0 ? (
          <View style={styles.dispatchList}>
            {dispatchQueue.map((alert) => (
              <View key={alert.id} style={styles.dispatchCard}>
                <View
                  style={[
                    styles.dispatchLeftBorder,
                    { backgroundColor: getPriorityColor(alert.priority) },
                  ]}
                />
                <View style={styles.dispatchIconContainer}>
                  <View
                    style={[
                      styles.dispatchIcon,
                      {
                        backgroundColor:
                          alert.priority === 'URGENT' ? '#FEE2E2' : '#FFEDD5',
                      },
                    ]}
                  >
                    <Icon
                      name={getAlertIcon(alert.type)}
                      size={12}
                      color={getPriorityColor(alert.priority)}
                      solid
                    />
                  </View>
                </View>
                <View style={styles.dispatchContent}>
                  <View style={styles.dispatchHeader}>
                    <Text style={styles.dispatchTitle}>{alert.title}</Text>
                    <Text style={styles.dispatchTime}>{alert.timeAgo}</Text>
                  </View>
                  <Text style={styles.dispatchDescription} numberOfLines={1}>
                    {alert.location}. {alert.description}
                  </Text>
                  <View style={styles.dispatchActions}>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() => handleAcceptAlert(alert.id)}
                    >
                      <Text style={styles.acceptButtonText}>Respond</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() => handleViewDetails(alert.id)}
                    >
                      <Text style={styles.detailsButtonText}>Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyQueue}>
            <Text style={styles.emptyQueueText}>No other pending calls.</Text>
          </View>
        )}

        {/* SOS Button */}
        <TouchableOpacity style={styles.sosButton} onPress={handleRequestBackup}>
          <View style={styles.sosIconContainer}>
            <Icon name="tower-broadcast" size={16} color="#FFFFFF" solid />
          </View>
          <Text style={styles.sosText}>REQUEST BACKUP</Text>
        </TouchableOpacity>
        <Text style={styles.sosHint}>
          Press to broadcast emergency signal to all available units
        </Text>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="grid-2" size={20} color={FIRE_COLORS.primary} solid />
          <Text style={[styles.navText, styles.navTextActive]}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Map')}>
          <Icon name="map" size={20} color="#94A3B8" solid />
          <Text style={styles.navText}>Map</Text>
        </TouchableOpacity>

        <View style={styles.navMicrophone}>
          <TouchableOpacity style={styles.microphoneButton}>
            <Icon name="microphone" size={20} color="#FFFFFF" solid />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Tasks')}>
          <Icon name="clipboard-list" size={20} color="#94A3B8" solid />
          <Text style={styles.navText}>Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Icon name="user-shield" size={20} color="#94A3B8" solid />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: FIRE_COLORS.primary,
    paddingTop: Platform.OS === 'ios' ? 48 : 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  officerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    backgroundColor: '#4ADE80',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: FIRE_COLORS.primary,
  },
  officerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  officerUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FECACA',
  },
  notificationButton: {
    padding: 8,
    borderRadius: 20,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    backgroundColor: '#FCD34D',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: FIRE_COLORS.primary,
  },
  shiftCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  shiftItem: {
    alignItems: 'center',
  },
  shiftLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FECACA',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  shiftStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: '#4ADE80',
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  shiftDuration: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  shiftDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
    marginTop: -24,
    position: 'relative',
    zIndex: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 96,
  },
  incomingAlertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#FCA5A5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    position: 'relative',
    overflow: 'hidden',
  },
  incomingAlertLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    backgroundColor: FIRE_COLORS.primary,
  },
  incomingAlertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  incomingAlertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FCA5A5',
    opacity: 0.2,
  },
  pulseRing2: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FCA5A5',
    opacity: 0.1,
  },
  incomingAlertIcon: {
    zIndex: 10,
  },
  incomingAlertText: {
    flex: 1,
  },
  incomingAlertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  incomingAlertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  urgentBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  urgentText: {
    fontSize: 10,
    fontWeight: '700',
    color: FIRE_COLORS.primary,
  },
  incomingAlertDescription: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 4,
  },
  incomingAlertAction: {
    fontSize: 10,
    fontWeight: '700',
    color: FIRE_COLORS.primary,
  },
  activeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#EA580C',
    position: 'relative',
  },
  activeStatusBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
  },
  activeStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C2410C',
  },
  activeContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 16,
  },
  activeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeInfo: {
    flex: 1,
  },
  activeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  activeLocation: {
    fontSize: 14,
    color: '#64748B',
  },
  activeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  unitsContainer: {
    flexDirection: 'row',
    gap: -8,
  },
  unitBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  unitText: {
    fontSize: 10,
    fontWeight: '700',
  },
  activeTime: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  quickActionButton: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  queueBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  queueBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: FIRE_COLORS.primary,
  },
  dispatchList: {
    gap: 12,
  },
  dispatchCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    gap: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  dispatchLeftBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  dispatchIconContainer: {
    marginTop: 4,
  },
  dispatchIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dispatchContent: {
    flex: 1,
  },
  dispatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  dispatchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  dispatchTime: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
  },
  dispatchDescription: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  dispatchActions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: FIRE_COLORS.primary,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  detailsButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  emptyQueue: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyQueueText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  sosButton: {
    backgroundColor: FIRE_COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 32,
    marginBottom: 8,
    shadowColor: '#FCA5A5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  sosIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  sosHint: {
    textAlign: 'center',
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 16,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 50,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
  },
  navTextActive: {
    fontWeight: '700',
    color: FIRE_COLORS.primary,
  },
  navMicrophone: {
    marginTop: -24,
  },
  microphoneButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: FIRE_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FCA5A5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#F8FAFC',
  },
});

export default FirePatrolDashboardScreen;
