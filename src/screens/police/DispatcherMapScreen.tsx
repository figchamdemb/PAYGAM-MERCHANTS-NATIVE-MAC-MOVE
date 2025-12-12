/**
 * ✅ DISPATCHER MAP SCREEN - SENTINEL PATROL
 * 
 * Dispatcher view for managing patrol teams and alerts
 * Features:
 * - Real-time map with team locations
 * - Alert management panel (Incoming/Accepted/In Progress)
 * - Team assignment and tracking
 * - Search and map controls
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
  Dimensions,
  ScrollView,
  Animated,
  Image,
  DimensionValue,
  Modal,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Geolocation from '@react-native-community/geolocation';
import {
  faChevronLeft,
  faSearch,
  faBars,
  faPlus,
  faMinus,
  faLocationArrow,
  faTriangleExclamation,
  faChevronUp,
  faChevronDown,
  faLocationDot,
  faCar,
  faFileAlt,
  faPhone,
  faMapMarkerAlt,
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

const { width, height } = Dimensions.get('window');

// Types
interface Alert {
  id: string;
  title: string;
  location: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  type: string;
  status: 'incoming' | 'accepted' | 'inProgress';
}

interface Team {
  id: string;
  name: string;
  code: string;
  status: 'available' | 'busy' | 'offline';
  distance: string;
  position: { top: DimensionValue; left: DimensionValue };
}

// Mock data
const ALERTS: Alert[] = [
  {
    id: '1',
    title: 'Robbery in progress',
    location: 'Westred Road, Downtown',
    time: '2m ago',
    priority: 'high',
    type: 'robbery',
    status: 'incoming',
  },
  {
    id: '2',
    title: 'Traffic accident',
    location: 'Main St, Uptown',
    time: '5m ago',
    priority: 'medium',
    type: 'traffic',
    status: 'incoming',
  },
  {
    id: '3',
    title: 'Suspicious activity',
    location: 'Park Ave, Midtown',
    time: '12m ago',
    priority: 'low',
    type: 'suspicious',
    status: 'incoming',
  },
];

const TEAMS: Team[] = [
  {
    id: '1',
    name: 'Alpha Team',
    code: 'P1',
    status: 'available',
    distance: '0.5mi',
    position: { top: '40%', left: '30%' },
  },
  {
    id: '2',
    name: 'Bravo Squad',
    code: 'P2',
    status: 'busy',
    distance: '1.2mi',
    position: { top: '70%', left: '60%' },
  },
  {
    id: '3',
    name: 'Charlie Unit',
    code: 'P3',
    status: 'available',
    distance: '2.1mi',
    position: { top: '25%', left: '75%' },
  },
];

const DispatcherMapScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAlertTab, setActiveAlertTab] = useState<'incoming' | 'accepted' | 'inProgress'>('incoming');
  const [alertPanelExpanded, setAlertPanelExpanded] = useState(true);
  const [teamsPanelExpanded, setTeamsPanelExpanded] = useState(true);
  const [alerts, setAlerts] = useState(ALERTS);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // Animation
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

  const handleAcceptAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, status: 'accepted' as const } : alert
      )
    );
  };

  // Open assign team modal
  const openAssignModal = (alertId: string) => {
    setSelectedAlertId(alertId);
    setSelectedTeams([]);
    setShowAssignModal(true);
  };

  // Toggle team selection
  const toggleTeamSelection = (teamId: string) => {
    setSelectedTeams(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  // Confirm team assignment
  const confirmAssignment = () => {
    if (selectedTeams.length === 0) {
      Alert.alert('Select Teams', 'Please select at least one patrol team to assign.');
      return;
    }
    
    if (selectedAlertId) {
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === selectedAlertId ? { ...alert, status: 'inProgress' as const } : alert
        )
      );
      
      // Get selected team names for alert
      const teamNames = TEAMS
        .filter(t => selectedTeams.includes(t.id))
        .map(t => t.name)
        .join(', ');
      
      Alert.alert(
        'Teams Assigned',
        `${teamNames} ${selectedTeams.length > 1 ? 'have' : 'has'} been dispatched to the alert.`
      );
    }
    
    setShowAssignModal(false);
    setSelectedAlertId(null);
    setSelectedTeams([]);
  };

  const handleAssignTeam = (alertId: string, teamId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, status: 'inProgress' as const } : alert
      )
    );
  };

  // Request location permission
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs location access to show your position on the map.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Location permission error:', err);
        return false;
      }
    }
    return true;
  };

  // Handle getting current location
  const handleGetCurrentLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Location permission is required to center on your position.');
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          Alert.alert('Location Found', `Your position: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}\n\nMap centered on your location.`);
        },
        (error) => {
          console.error('Geolocation error:', error);
          Alert.alert('Location Error', 'Failed to get current location. Please try again.');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      console.error('handleGetCurrentLocation error:', error);
      Alert.alert('Error', 'Failed to get location. Please try again.');
    }
  };

  const filteredAlerts = alerts.filter(alert => alert.status === activeAlertTab);

  const getAlertCount = (status: 'incoming' | 'accepted' | 'inProgress') => {
    return alerts.filter(alert => alert.status === status).length;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesomeIcon icon={faChevronLeft} size={20} color="#475569" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Patrol Map</Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        {/* Simulated Map Background */}
        <View style={styles.mapBackground}>
          {/* Grid Lines */}
          <View style={[styles.roadHorizontal, { top: '33%' }]} />
          <View style={[styles.roadHorizontal, { top: '75%' }]} />
          <View style={[styles.roadVertical, { left: '25%' }]} />
          <View style={[styles.roadVertical, { left: '66%' }]} />
          
          {/* Areas */}
          <View style={styles.parkArea} />
          <View style={styles.waterArea} />

          {/* Alert Markers */}
          <View style={[styles.alertMarker, { top: '35%', left: '26%' }]}>
            <Animated.View
              style={[
                styles.alertPulse,
                { transform: [{ scale: pulseAnim }], opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.5],
                  outputRange: [0.5, 0],
                }) },
              ]}
            />
            <View style={styles.alertMarkerInner}>
              <FontAwesomeIcon icon={faCar} size={16} color="#FFFFFF" />
            </View>
          </View>

          <View style={[styles.alertMarkerSmall, { top: '60%', left: '65%' }]}>
            <FontAwesomeIcon icon={faFileAlt} size={12} color="#FFFFFF" />
          </View>

          {/* Team Markers */}
          {TEAMS.map(team => (
            <View
              key={team.id}
              style={[styles.teamMarker, { top: team.position.top, left: team.position.left }]}
            >
              <View style={styles.teamLabel}>
                <Text style={styles.teamLabelText}>{team.name}</Text>
              </View>
              <View style={styles.teamDot} />
            </View>
          ))}

          {/* My Location */}
          <View style={styles.myLocation}>
            <Animated.View
              style={[
                styles.myLocationPulse,
                { transform: [{ scale: pulseAnim }], opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.5],
                  outputRange: [0.3, 0],
                }) },
              ]}
            />
            <View style={styles.myLocationDot} />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <FontAwesomeIcon icon={faSearch} size={16} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search location..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.filterButton}>
              <FontAwesomeIcon icon={faBars} size={14} color="#475569" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomButton}>
              <FontAwesomeIcon icon={faPlus} size={16} color="#475569" />
            </TouchableOpacity>
            <View style={styles.zoomDivider} />
            <TouchableOpacity style={styles.zoomButton}>
              <FontAwesomeIcon icon={faMinus} size={16} color="#475569" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.locationButton} onPress={handleGetCurrentLocation}>
            <FontAwesomeIcon icon={faLocationArrow} size={16} color="#1E40AF" />
          </TouchableOpacity>
        </View>

        {/* Alert Panel */}
        <View style={styles.alertPanel}>
          {/* Header */}
          <TouchableOpacity
            style={styles.alertPanelHeader}
            onPress={() => setAlertPanelExpanded(!alertPanelExpanded)}
          >
            <View style={styles.alertPanelHeaderLeft}>
              <FontAwesomeIcon icon={faTriangleExclamation} size={14} color="#FFFFFF" />
              <Text style={styles.alertPanelTitle}>Alert Management</Text>
            </View>
            <FontAwesomeIcon
              icon={alertPanelExpanded ? faChevronUp : faChevronDown}
              size={12}
              color="rgba(255,255,255,0.8)"
            />
          </TouchableOpacity>

          {alertPanelExpanded && (
            <>
              {/* Tabs */}
              <View style={styles.alertTabs}>
                <TouchableOpacity
                  style={[styles.alertTab, activeAlertTab === 'incoming' && styles.alertTabActive]}
                  onPress={() => setActiveAlertTab('incoming')}
                >
                  <Text style={[styles.alertTabText, activeAlertTab === 'incoming' && styles.alertTabTextActive]}>
                    Incoming
                  </Text>
                  {getAlertCount('incoming') > 0 && (
                    <View style={styles.alertTabBadge}>
                      <Text style={styles.alertTabBadgeText}>{getAlertCount('incoming')}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.alertTab, activeAlertTab === 'accepted' && styles.alertTabActive]}
                  onPress={() => setActiveAlertTab('accepted')}
                >
                  <Text style={[styles.alertTabText, activeAlertTab === 'accepted' && styles.alertTabTextActive]}>
                    Accepted
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.alertTab, activeAlertTab === 'inProgress' && styles.alertTabActive]}
                  onPress={() => setActiveAlertTab('inProgress')}
                >
                  <Text style={[styles.alertTabText, activeAlertTab === 'inProgress' && styles.alertTabTextActive]}>
                    In Progress
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Alert List */}
              <ScrollView style={styles.alertList} showsVerticalScrollIndicator={false}>
                {filteredAlerts.map(alert => (
                  <View key={alert.id} style={styles.alertItem}>
                    {alert.priority === 'high' && <View style={styles.alertPriorityBar} />}
                    <View style={styles.alertItemHeader}>
                      <Text style={styles.alertItemTitle}>{alert.title}</Text>
                      <Text style={styles.alertItemTime}>{alert.time}</Text>
                    </View>
                    <View style={styles.alertItemLocation}>
                      <FontAwesomeIcon icon={faLocationDot} size={10} color="#9CA3AF" />
                      <Text style={styles.alertItemLocationText}>{alert.location}</Text>
                    </View>
                    <View style={styles.alertItemActions}>
                      {activeAlertTab === 'incoming' && (
                        <TouchableOpacity
                          style={[styles.alertActionButton, styles.alertAcceptButton]}
                          onPress={() => handleAcceptAlert(alert.id)}
                        >
                          <Text style={styles.alertAcceptButtonText}>Accept Alert</Text>
                        </TouchableOpacity>
                      )}
                      {activeAlertTab === 'accepted' && (
                        <TouchableOpacity
                          style={[styles.alertActionButton, styles.alertAssignButton]}
                          onPress={() => openAssignModal(alert.id)}
                        >
                          <Text style={styles.alertAssignButtonText}>Assign Team</Text>
                        </TouchableOpacity>
                      )}
                      {activeAlertTab === 'inProgress' && (
                        <View style={styles.progressInfo}>
                          <Text style={styles.progressText}>Alpha Team • ETA 3 min</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
                {filteredAlerts.length === 0 && (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No alerts in this category</Text>
                  </View>
                )}
              </ScrollView>
            </>
          )}
        </View>

        {/* Teams Panel */}
        <View style={styles.teamsPanel}>
          <View style={styles.teamsPanelHeader}>
            <Text style={styles.teamsPanelTitle}>Patrol Teams</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.teamsList}
          >
            {TEAMS.map(team => (
              <View key={team.id} style={styles.teamCard}>
                <View style={styles.teamCardLeft}>
                  <View
                    style={[
                      styles.teamAvatar,
                      team.status === 'available' && styles.teamAvatarAvailable,
                      team.status === 'busy' && styles.teamAvatarBusy,
                    ]}
                  >
                    <Text style={styles.teamAvatarText}>{team.code}</Text>
                  </View>
                  <View>
                    <Text style={styles.teamCardName}>{team.name}</Text>
                    <View style={styles.teamCardStatus}>
                      <View
                        style={[
                          styles.statusDot,
                          team.status === 'available' && styles.statusDotAvailable,
                          team.status === 'busy' && styles.statusDotBusy,
                        ]}
                      />
                      <Text style={styles.teamCardStatusText}>
                        {team.status === 'available' ? 'Available' : 'Busy'} • {team.distance}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.teamCardActions}>
                  <TouchableOpacity style={styles.teamActionButton}>
                    <FontAwesomeIcon icon={faPhone} size={12} color="#1E40AF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.teamActionButton}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} size={12} color="#1E40AF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Assign Team Modal */}
      <Modal
        visible={showAssignModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAssignModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.assignModal}>
            {/* Modal Header */}
            <View style={styles.assignModalHeader}>
              <Text style={styles.assignModalTitle}>Select Patrol Teams</Text>
              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setShowAssignModal(false)}
              >
                <FontAwesomeIcon icon={faTimes} size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.assignModalSubtitle}>
              Tap to select teams to dispatch to this alert. Teams are sorted by distance.
            </Text>

            {/* Team List */}
            <ScrollView style={styles.teamListModal} showsVerticalScrollIndicator={false}>
              {TEAMS
                .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
                .map((team) => (
                  <TouchableOpacity
                    key={team.id}
                    style={[
                      styles.teamItemModal,
                      selectedTeams.includes(team.id) && styles.teamItemSelected,
                    ]}
                    onPress={() => toggleTeamSelection(team.id)}
                  >
                    <View style={styles.teamItemLeft}>
                      <View
                        style={[
                          styles.teamAvatarModal,
                          team.status === 'available' && styles.teamAvatarAvailableModal,
                          team.status === 'busy' && styles.teamAvatarBusyModal,
                        ]}
                      >
                        <Text style={styles.teamAvatarTextModal}>{team.code}</Text>
                      </View>
                      <View style={styles.teamInfoModal}>
                        <Text style={styles.teamNameModal}>{team.name}</Text>
                        <View style={styles.teamMetaModal}>
                          <View
                            style={[
                              styles.statusDotModal,
                              team.status === 'available' && styles.statusDotAvailableModal,
                              team.status === 'busy' && styles.statusDotBusyModal,
                            ]}
                          />
                          <Text style={styles.teamStatusModal}>
                            {team.status === 'available' ? 'Available' : 'Busy'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.teamItemRight}>
                      <Text style={styles.teamDistanceModal}>{team.distance}</Text>
                      <View
                        style={[
                          styles.checkboxModal,
                          selectedTeams.includes(team.id) && styles.checkboxCheckedModal,
                        ]}
                      >
                        {selectedTeams.includes(team.id) && (
                          <FontAwesomeIcon icon={faCheck} size={12} color="#FFFFFF" />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Selected Count */}
            {selectedTeams.length > 0 && (
              <View style={styles.selectedCountContainer}>
                <Text style={styles.selectedCountText}>
                  {selectedTeams.length} team{selectedTeams.length > 1 ? 's' : ''} selected
                </Text>
              </View>
            )}

            {/* Assign Button */}
            <TouchableOpacity
              style={[
                styles.assignConfirmBtn,
                selectedTeams.length === 0 && styles.assignConfirmBtnDisabled,
              ]}
              onPress={confirmAssignment}
            >
              <Text style={styles.assignConfirmBtnText}>
                Dispatch {selectedTeams.length > 0 ? `(${selectedTeams.length})` : ''} Teams
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 24,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  liveText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },

  // Map Container
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  roadHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#D1D5DB',
  },
  roadVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 16,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#D1D5DB',
  },
  parkArea: {
    position: 'absolute',
    top: '10%',
    left: '50%',
    width: 100,
    height: 100,
    backgroundColor: 'rgba(220, 252, 231, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(187, 247, 208, 0.5)',
  },
  waterArea: {
    position: 'absolute',
    bottom: '10%',
    right: '10%',
    width: 120,
    height: 80,
    backgroundColor: 'rgba(219, 234, 254, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(191, 219, 254, 0.5)',
  },

  // Alert Markers
  alertMarker: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  alertPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EF4444',
  },
  alertMarkerInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  alertMarkerSmall: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },

  // Team Markers
  teamMarker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  teamLabel: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  teamLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  teamDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  // My Location
  myLocation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -32,
    marginTop: -32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myLocationPulse: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F6',
  },
  myLocationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  // Search
  searchContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 30,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#1F2937',
    paddingVertical: 4,
  },
  filterButton: {
    padding: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },

  // Map Controls
  mapControls: {
    position: 'absolute',
    top: 80,
    right: 16,
    gap: 12,
    zIndex: 30,
  },
  zoomControls: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  zoomButton: {
    padding: 12,
  },
  zoomDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  locationButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },

  // Alert Panel
  alertPanel: {
    position: 'absolute',
    top: 70,
    left: 16,
    width: width - 80,
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    zIndex: 30,
    maxHeight: height * 0.45,
  },
  alertPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#DC2626',
    padding: 12,
  },
  alertPanelHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertPanelTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  alertTabs: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  alertTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 4,
  },
  alertTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#DC2626',
    backgroundColor: 'rgba(254, 226, 226, 0.5)',
  },
  alertTabText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  alertTabTextActive: {
    color: '#DC2626',
    fontWeight: '600',
  },
  alertTabBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  alertTabBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  alertList: {
    maxHeight: 200,
  },
  alertItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    position: 'relative',
  },
  alertPriorityBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#EF4444',
  },
  alertItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  alertItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  alertItemTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  alertItemLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  alertItemLocationText: {
    fontSize: 11,
    color: '#64748B',
  },
  alertItemActions: {
    alignItems: 'flex-end',
  },
  alertActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  alertAcceptButton: {
    backgroundColor: '#FEE2E2',
  },
  alertAcceptButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B91C1C',
  },
  alertAssignButton: {
    backgroundColor: '#EFF6FF',
  },
  alertAssignButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E40AF',
  },
  progressInfo: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#475569',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Teams Panel
  teamsPanel: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    zIndex: 30,
  },
  teamsPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#F9FAFB',
  },
  teamsPanelTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E40AF',
  },
  teamsList: {
    padding: 8,
    gap: 8,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    minWidth: 200,
  },
  teamCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  teamAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamAvatarAvailable: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  teamAvatarBusy: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  teamAvatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  teamCardName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  teamCardStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotAvailable: {
    backgroundColor: '#22C55E',
  },
  statusDotBusy: {
    backgroundColor: '#EF4444',
  },
  teamCardStatusText: {
    fontSize: 10,
    color: '#64748B',
  },
  teamCardActions: {
    flexDirection: 'row',
    gap: 4,
  },
  teamActionButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  assignModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  assignModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  assignModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeModalBtn: {
    padding: 8,
  },
  assignModalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  teamListModal: {
    maxHeight: 350,
  },
  teamItemModal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  teamItemSelected: {
    borderColor: '#1E40AF',
    backgroundColor: '#EFF6FF',
  },
  teamItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  teamAvatarModal: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamAvatarAvailableModal: {
    backgroundColor: '#DCFCE7',
  },
  teamAvatarBusyModal: {
    backgroundColor: '#FEE2E2',
  },
  teamAvatarTextModal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  teamInfoModal: {
    gap: 4,
  },
  teamNameModal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  teamMetaModal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDotModal: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotAvailableModal: {
    backgroundColor: '#22C55E',
  },
  statusDotBusyModal: {
    backgroundColor: '#EF4444',
  },
  teamStatusModal: {
    fontSize: 13,
    color: '#64748B',
  },
  teamItemRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  teamDistanceModal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
  checkboxModal: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxCheckedModal: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  selectedCountContainer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectedCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
  assignConfirmBtn: {
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  assignConfirmBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  assignConfirmBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default DispatcherMapScreen;
