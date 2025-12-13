/**
 * ✅ IMMIGRATION DISPATCHER SCREEN - SENTINEL PATROL
 * 
 * Dispatcher view for managing immigration officers and border alerts
 * Features:
 * - Real-time map with officer locations
 * - Alert management panel (Incoming/Accepted/In Progress)
 * - Officer team assignment and tracking
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
  faPassport,
  faChevronUp,
  faChevronDown,
  faLocationDot,
  faIdCard,
  faUserShield,
  faPhone,
  faMapMarkerAlt,
  faCheck,
  faTimes,
  faPlaneDeparture,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';

const { width, height } = Dimensions.get('window');

// Types
interface ImmigrationAlert {
  id: string;
  title: string;
  location: string;
  time: string;
  priority: 'critical' | 'urgent' | 'routine';
  type: string;
  status: 'incoming' | 'accepted' | 'inProgress';
  details?: string;
}

interface ImmigrationTeam {
  id: string;
  name: string;
  code: string;
  status: 'available' | 'assigned' | 'offline';
  distance: string;
  position: { top: DimensionValue; left: DimensionValue };
}

// Mock data
const IMMIGRATION_ALERTS: ImmigrationAlert[] = [
  {
    id: '1',
    title: 'Suspected Fraudulent Passport',
    location: 'Banjul Airport - Terminal 1',
    time: '2m ago',
    priority: 'critical',
    type: 'document',
    status: 'incoming',
    details: 'Male passenger, flight from Lagos - passport irregularities detected',
  },
  {
    id: '2',
    title: 'Overstayed Visa - Border Crossing',
    location: 'Farafenni Border Post',
    time: '5m ago',
    priority: 'urgent',
    type: 'visa',
    status: 'incoming',
    details: 'Senegalese national, visa expired 3 months ago',
  },
  {
    id: '3',
    title: 'Permit Verification Request',
    location: 'Senegambia Immigration Office',
    time: '12m ago',
    priority: 'routine',
    type: 'permit',
    status: 'incoming',
    details: 'Work permit verification for employer',
  },
];

const IMMIGRATION_TEAMS: ImmigrationTeam[] = [
  {
    id: '1',
    name: 'Border Unit Alpha',
    code: 'IA',
    status: 'available',
    distance: '0.3km',
    position: { top: '40%', left: '30%' },
  },
  {
    id: '2',
    name: 'Border Unit Bravo',
    code: 'IB',
    status: 'assigned',
    distance: '1.2km',
    position: { top: '70%', left: '60%' },
  },
  {
    id: '3',
    name: 'Airport Team',
    code: 'AT',
    status: 'available',
    distance: '2.0km',
    position: { top: '25%', left: '75%' },
  },
  {
    id: '4',
    name: 'Mobile Patrol',
    code: 'MP',
    status: 'available',
    distance: '4.5km',
    position: { top: '55%', left: '20%' },
  },
];

const ImmigrationDispatcherScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAlertTab, setActiveAlertTab] = useState<'incoming' | 'accepted' | 'inProgress'>('incoming');
  const [alertPanelExpanded, setAlertPanelExpanded] = useState(true);
  const [alerts, setAlerts] = useState(IMMIGRATION_ALERTS);
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

  const openAssignModal = (alertId: string) => {
    setSelectedAlertId(alertId);
    setSelectedTeams([]);
    setShowAssignModal(true);
  };

  const toggleTeamSelection = (teamId: string) => {
    setSelectedTeams(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const confirmAssignment = () => {
    if (selectedTeams.length === 0) {
      Alert.alert('Select Teams', 'Please select at least one immigration team to assign.');
      return;
    }
    
    if (selectedAlertId) {
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === selectedAlertId ? { ...alert, status: 'inProgress' as const } : alert
        )
      );
      
      const teamNames = IMMIGRATION_TEAMS
        .filter(t => selectedTeams.includes(t.id))
        .map(t => t.name)
        .join(', ');
      
      Alert.alert(
        'Team Assigned',
        `${teamNames} ${selectedTeams.length > 1 ? 'have' : 'has'} been assigned to handle the case.`
      );
    }
    
    setShowAssignModal(false);
    setSelectedAlertId(null);
    setSelectedTeams([]);
  };

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#DC2626';
      case 'urgent': return '#F59E0B';
      case 'routine': return '#0EA5E9';
      default: return '#64748B';
    }
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
          <Text style={styles.headerTitle}>Immigration Dispatch</Text>
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
          <View style={[styles.roadHorizontal, { top: '33%' }]} />
          <View style={[styles.roadHorizontal, { top: '75%' }]} />
          <View style={[styles.roadVertical, { left: '25%' }]} />
          <View style={[styles.roadVertical, { left: '66%' }]} />
          
          <View style={styles.borderPostArea}>
            <FontAwesomeIcon icon={faShieldHalved} size={20} color="#1E40AF" />
          </View>

          {/* Immigration Alert Markers */}
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
              <FontAwesomeIcon icon={faPassport} size={16} color="#FFFFFF" />
            </View>
          </View>

          <View style={[styles.alertMarkerSmall, { top: '60%', left: '65%' }]}>
            <FontAwesomeIcon icon={faIdCard} size={12} color="#FFFFFF" />
          </View>

          {/* Immigration Team Markers */}
          {IMMIGRATION_TEAMS.map(team => (
            <View
              key={team.id}
              style={[styles.teamMarker, { top: team.position.top, left: team.position.left }]}
            >
              <View style={styles.teamLabel}>
                <Text style={styles.teamLabelText}>{team.name}</Text>
              </View>
              <View style={styles.teamDot}>
                <FontAwesomeIcon icon={faUserShield} size={10} color="#FFFFFF" />
              </View>
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
          <TouchableOpacity
            style={styles.alertPanelHeader}
            onPress={() => setAlertPanelExpanded(!alertPanelExpanded)}
          >
            <View style={styles.alertPanelHeaderLeft}>
              <FontAwesomeIcon icon={faPassport} size={14} color="#FFFFFF" />
              <Text style={styles.alertPanelTitle}>Immigration Alerts</Text>
            </View>
            <FontAwesomeIcon
              icon={alertPanelExpanded ? faChevronUp : faChevronDown}
              size={12}
              color="rgba(255,255,255,0.8)"
            />
          </TouchableOpacity>

          {alertPanelExpanded && (
            <>
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
                    Processing
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.alertList} showsVerticalScrollIndicator={false}>
                {filteredAlerts.map(alert => (
                  <View key={alert.id} style={styles.alertItem}>
                    <View style={[styles.alertPriorityBar, { backgroundColor: getPriorityColor(alert.priority) }]} />
                    <View style={styles.alertItemHeader}>
                      <Text style={styles.alertItemTitle}>{alert.title}</Text>
                      <Text style={styles.alertItemTime}>{alert.time}</Text>
                    </View>
                    {alert.details && (
                      <Text style={styles.alertDetails}>{alert.details}</Text>
                    )}
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
                          <Text style={styles.alertAcceptButtonText}>Accept Case</Text>
                        </TouchableOpacity>
                      )}
                      {activeAlertTab === 'accepted' && (
                        <TouchableOpacity
                          style={[styles.alertActionButton, styles.alertAssignButton]}
                          onPress={() => openAssignModal(alert.id)}
                        >
                          <Text style={styles.alertAssignButtonText}>Assign Officers</Text>
                        </TouchableOpacity>
                      )}
                      {activeAlertTab === 'inProgress' && (
                        <View style={styles.progressInfo}>
                          <Text style={styles.progressText}>Border Unit Alpha • Processing</Text>
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
            <Text style={styles.teamsPanelTitle}>Immigration Teams</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.teamsList}
          >
            {IMMIGRATION_TEAMS.map(team => (
              <View key={team.id} style={styles.teamCard}>
                <View style={styles.teamCardLeft}>
                  <View
                    style={[
                      styles.teamAvatar,
                      team.status === 'available' && styles.teamAvatarAvailable,
                      team.status === 'assigned' && styles.teamAvatarAssigned,
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
                          team.status === 'assigned' && styles.statusDotAssigned,
                        ]}
                      />
                      <Text style={styles.teamCardStatusText}>
                        {team.status === 'available' ? 'Available' : 'On Assignment'} • {team.distance}
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
            <View style={styles.assignModalHeader}>
              <Text style={styles.assignModalTitle}>Assign Immigration Officers</Text>
              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setShowAssignModal(false)}
              >
                <FontAwesomeIcon icon={faTimes} size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.assignModalSubtitle}>
              Tap to select teams to assign to this case. Teams sorted by distance.
            </Text>

            <ScrollView style={styles.teamListModal} showsVerticalScrollIndicator={false}>
              {IMMIGRATION_TEAMS
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
                          team.status === 'assigned' && styles.teamAvatarAssignedModal,
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
                              team.status === 'assigned' && styles.statusDotAssignedModal,
                            ]}
                          />
                          <Text style={styles.teamStatusModal}>
                            {team.status === 'available' ? 'Available' : 'On Assignment'}
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

            {selectedTeams.length > 0 && (
              <View style={styles.selectedCountContainer}>
                <Text style={styles.selectedCountText}>
                  {selectedTeams.length} team{selectedTeams.length > 1 ? 's' : ''} selected
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.assignConfirmBtn,
                selectedTeams.length === 0 && styles.assignConfirmBtnDisabled,
              ]}
              onPress={confirmAssignment}
            >
              <Text style={styles.assignConfirmBtnText}>
                Assign {selectedTeams.length > 0 ? `(${selectedTeams.length})` : ''} Teams
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
    backgroundColor: '#1E40AF',
  },
  liveText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
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
  borderPostArea: {
    position: 'absolute',
    top: '10%',
    left: '50%',
    width: 50,
    height: 50,
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#BFDBFE',
  },
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
    backgroundColor: '#1E40AF',
  },
  alertMarkerInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E40AF',
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
  teamMarker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  teamLabel: {
    backgroundColor: '#1E40AF',
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
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E40AF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
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
    backgroundColor: '#1E40AF',
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
    borderBottomColor: '#1E40AF',
    backgroundColor: 'rgba(30, 64, 175, 0.1)',
  },
  alertTabText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  alertTabTextActive: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  alertTabBadge: {
    backgroundColor: '#1E40AF',
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
  alertDetails: {
    fontSize: 11,
    color: '#1E40AF',
    fontWeight: '500',
    marginBottom: 4,
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
    backgroundColor: '#DBEAFE',
  },
  alertAcceptButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E40AF',
  },
  alertAssignButton: {
    backgroundColor: '#DBEAFE',
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
    backgroundColor: '#EFF6FF',
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
  teamAvatarAssigned: {
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#BFDBFE',
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
  statusDotAssigned: {
    backgroundColor: '#1E40AF',
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
    backgroundColor: '#EFF6FF',
  },
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
  teamAvatarAssignedModal: {
    backgroundColor: '#DBEAFE',
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
  statusDotAssignedModal: {
    backgroundColor: '#1E40AF',
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

export default ImmigrationDispatcherScreen;
