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

// Types
type PolicePatrolDashboardNavigationProp = StackNavigationProp<any>;

interface IncomingAlert {
  id: string;
  title: string;
  location: string;
  description: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM';
  timeAgo: string;
  type: 'emergency' | 'traffic' | 'domestic';
}

interface ActiveAssignment {
  id: string;
  title: string;
  location: string;
  units: string[];
  startedAgo: string;
}

const PolicePatrolDashboardScreen: React.FC = () => {
  const navigation = useNavigation<PolicePatrolDashboardNavigationProp>();

  // State
  const [shiftDuration, setShiftDuration] = useState('04:12:30');
  const [incomingAlerts, setIncomingAlerts] = useState<IncomingAlert[]>([
    {
      id: '1',
      title: 'Emergency reported near Park Entrance',
      location: 'Trafalgar Square, London',
      description: 'Emergency reported near the park entrance. Caller indicates medical assistance may be required.',
      priority: 'URGENT',
      timeAgo: 'Just now',
      type: 'emergency',
    },
  ]);

  const [dispatchQueue, setDispatchQueue] = useState<IncomingAlert[]>([
    {
      id: '2',
      title: 'Domestic Disturbance',
      location: '124 West Avenue, Apt 4B',
      description: 'Caller reports shouting.',
      priority: 'HIGH',
      timeAgo: '2m ago',
      type: 'domestic',
    },
    {
      id: '3',
      title: 'Traffic Collision',
      location: 'Main St & 5th Ave',
      description: 'No injuries reported.',
      priority: 'MEDIUM',
      timeAgo: '15m ago',
      type: 'traffic',
    },
  ]);

  const [activeAssignment, setActiveAssignment] = useState<ActiveAssignment | null>({
    id: 'a1',
    title: 'Suspicious Activity',
    location: 'Central Park, North Gate',
    units: ['U1', 'K9'],
    startedAgo: '15m ago',
  });

  // Animation for incoming alert
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Bounce animation for incoming alert
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
    Alert.alert('Alert Accepted', 'You have accepted this dispatch.');
    // Move alert from queue to active
    const alert = dispatchQueue.find(a => a.id === alertId);
    if (alert) {
      setDispatchQueue(prev => prev.filter(a => a.id !== alertId));
      // In real app, would navigate to map/tracking screen
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
      case 'scan':
        navigation.navigate('PlateScan');
        break;
      case 'location':
        navigation.navigate('LogLocation');
        break;
      case 'directory':
        navigation.navigate('Directory');
        break;
    }
  };

  const handleRequestBackup = () => {
    Alert.alert(
      'Request Backup',
      'This will broadcast an emergency signal to all nearby units. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'REQUEST BACKUP',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Backup Requested', 'All nearby units have been notified.');
          },
        },
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return '#EF4444'; // red-500
      case 'HIGH':
        return '#EF4444'; // red-500
      case 'MEDIUM':
        return '#FB923C'; // orange-400
      default:
        return '#64748B'; // slate-500
    }
  };

  const getPriorityBorderColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return '#EF4444';
      case 'HIGH':
        return '#EF4444';
      case 'MEDIUM':
        return '#FB923C';
      default:
        return '#CBD5E1';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'tower-broadcast';
      case 'domestic':
        return 'triangle-exclamation';
      case 'traffic':
        return 'car-burst';
      default:
        return 'bell';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.police.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.officerInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=11' }}
                style={styles.avatar}
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View>
              <Text style={styles.officerName}>Sgt. Anderson</Text>
              <Text style={styles.officerUnit}>Unit 42 • Alpha Sector</Text>
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
        {/* Incoming Alert (Priority) */}
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
                    <Icon name={getAlertIcon(alert.type)} size={20} color="#DC2626" solid />
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
                  <Text style={styles.incomingAlertAction}>Tap to view details & accept</Text>
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
                <Icon name="person-running" size={20} color="#D97706" solid />
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
                      { backgroundColor: index === 0 ? '#DBEAFE' : '#E9D5FF' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.unitText,
                        { color: index === 0 ? '#1E40AF' : '#6B21A6' },
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
            <View style={[styles.quickActionIcon, { backgroundColor: '#DBEAFE' }]}>
              <Icon name="file-pen" size={18} color={colors.police.primary} solid />
            </View>
            <Text style={styles.quickActionText}>New Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('scan')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#E0E7FF' }]}>
              <Icon name="expand" size={18} color="#4F46E5" solid />
            </View>
            <Text style={styles.quickActionText}>Scan Plate</Text>
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
            onPress={() => handleQuickAction('directory')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#F1F5F9' }]}>
              <Icon name="address-book" size={18} color="#475569" solid />
            </View>
            <Text style={styles.quickActionText}>Directory</Text>
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
                    { backgroundColor: getPriorityBorderColor(alert.priority) },
                  ]}
                />
                <View style={styles.dispatchIconContainer}>
                  <View
                    style={[
                      styles.dispatchIcon,
                      {
                        backgroundColor:
                          alert.priority === 'URGENT' || alert.priority === 'HIGH'
                            ? '#FEE2E2'
                            : '#FED7AA',
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
                      <Text style={styles.acceptButtonText}>Accept</Text>
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
            <Text style={styles.emptyQueueText}>No other pending tasks.</Text>
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
          Press to broadcast emergency signal to all nearby units
        </Text>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="grid-2" size={20} color={colors.police.primary} solid />
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
    backgroundColor: '#F8FAFC', // slate-50
  },
  header: {
    backgroundColor: colors.police.primary,
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
    backgroundColor: '#4ADE80', // green-400
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.police.primary,
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
    color: '#93C5FD', // blue-300
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
    backgroundColor: '#EF4444',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.police.primary,
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
    color: '#93C5FD',
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
    backgroundColor: '#EF4444',
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
    color: '#DC2626',
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
    color: colors.police.primary,
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
    borderLeftColor: '#F59E0B', // amber-500
    position: 'relative',
  },
  activeStatusBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
  },
  activeStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
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
    backgroundColor: '#FEF3C7',
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
    color: '#DC2626',
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
    backgroundColor: colors.police.primary,
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
    backgroundColor: '#DC2626', // red-600
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
    color: colors.police.primary,
  },
  navMicrophone: {
    marginTop: -24,
  },
  microphoneButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.police.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#93C5FD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#F8FAFC',
  },
});

export default PolicePatrolDashboardScreen;
