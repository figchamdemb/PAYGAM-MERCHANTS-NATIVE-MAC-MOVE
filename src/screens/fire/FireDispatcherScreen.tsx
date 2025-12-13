/**
 * ✅ FIRE DISPATCHER SCREEN - SENTINEL PATROL
 * 
 * Dispatcher view for managing fire crews and emergencies
 * Features:
 * - Real-time map with fire crew locations
 * - Emergency management panel (Incoming/Accepted/In Progress)
 * - Fire crew assignment and tracking
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
  faFire,
  faChevronUp,
  faChevronDown,
  faLocationDot,
  faFireExtinguisher,
  faTruck,
  faPhone,
  faMapMarkerAlt,
  faCheck,
  faTimes,
  faHouseFire,
} from '@fortawesome/free-solid-svg-icons';

const { width, height } = Dimensions.get('window');

// Types
interface FireAlert {
  id: string;
  title: string;
  location: string;
  time: string;
  priority: 'critical' | 'urgent' | 'moderate';
  type: string;
  status: 'incoming' | 'accepted' | 'inProgress';
  details?: string;
}

interface FireCrew {
  id: string;
  name: string;
  code: string;
  status: 'available' | 'deployed' | 'offline';
  distance: string;
  position: { top: DimensionValue; left: DimensionValue };
}

// Mock data
const FIRE_ALERTS: FireAlert[] = [
  {
    id: '1',
    title: 'Building Fire - Commercial',
    location: 'Westfield Market, Serrekunda',
    time: '1m ago',
    priority: 'critical',
    type: 'structure',
    status: 'incoming',
    details: 'Multi-story building, possible persons trapped',
  },
  {
    id: '2',
    title: 'Vehicle Fire - Highway',
    location: 'Banjul Highway KM 15',
    time: '4m ago',
    priority: 'urgent',
    type: 'vehicle',
    status: 'incoming',
    details: 'Tanker truck, fuel leak reported',
  },
  {
    id: '3',
    title: 'Bush Fire - Residential Area',
    location: 'Fajara Golf Course',
    time: '10m ago',
    priority: 'moderate',
    type: 'wildfire',
    status: 'incoming',
    details: 'Spreading towards residential homes',
  },
];

const FIRE_CREWS: FireCrew[] = [
  {
    id: '1',
    name: 'Fire Engine 1',
    code: 'F1',
    status: 'available',
    distance: '0.5km',
    position: { top: '40%', left: '30%' },
  },
  {
    id: '2',
    name: 'Fire Engine 2',
    code: 'F2',
    status: 'deployed',
    distance: '1.8km',
    position: { top: '70%', left: '60%' },
  },
  {
    id: '3',
    name: 'Fire Engine 3',
    code: 'F3',
    status: 'available',
    distance: '2.5km',
    position: { top: '25%', left: '75%' },
  },
  {
    id: '4',
    name: 'Ladder Truck',
    code: 'LT',
    status: 'available',
    distance: '3.2km',
    position: { top: '55%', left: '20%' },
  },
];

const FireDispatcherScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAlertTab, setActiveAlertTab] = useState<'incoming' | 'accepted' | 'inProgress'>('incoming');
  const [alertPanelExpanded, setAlertPanelExpanded] = useState(true);
  const [alerts, setAlerts] = useState(FIRE_ALERTS);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [selectedCrews, setSelectedCrews] = useState<string[]>([]);
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
    setSelectedCrews([]);
    setShowAssignModal(true);
  };

  const toggleCrewSelection = (crewId: string) => {
    setSelectedCrews(prev =>
      prev.includes(crewId)
        ? prev.filter(id => id !== crewId)
        : [...prev, crewId]
    );
  };

  const confirmAssignment = () => {
    if (selectedCrews.length === 0) {
      Alert.alert('Select Crews', 'Please select at least one fire crew to deploy.');
      return;
    }
    
    if (selectedAlertId) {
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === selectedAlertId ? { ...alert, status: 'inProgress' as const } : alert
        )
      );
      
      const crewNames = FIRE_CREWS
        .filter(c => selectedCrews.includes(c.id))
        .map(c => c.name)
        .join(', ');
      
      Alert.alert(
        'Crews Deployed',
        `${crewNames} ${selectedCrews.length > 1 ? 'have' : 'has'} been deployed to the emergency.`
      );
    }
    
    setShowAssignModal(false);
    setSelectedAlertId(null);
    setSelectedCrews([]);
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
      case 'urgent': return '#F97316';
      case 'moderate': return '#FBBF24';
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
          <Text style={styles.headerTitle}>Fire Dispatch</Text>
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
          
          <View style={styles.fireStationArea}>
            <FontAwesomeIcon icon={faFireExtinguisher} size={20} color="#F97316" />
          </View>

          {/* Fire Alert Markers */}
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
              <FontAwesomeIcon icon={faFire} size={16} color="#FFFFFF" />
            </View>
          </View>

          <View style={[styles.alertMarkerSmall, { top: '60%', left: '65%' }]}>
            <FontAwesomeIcon icon={faHouseFire} size={12} color="#FFFFFF" />
          </View>

          {/* Fire Crew Markers */}
          {FIRE_CREWS.map(crew => (
            <View
              key={crew.id}
              style={[styles.crewMarker, { top: crew.position.top, left: crew.position.left }]}
            >
              <View style={styles.crewLabel}>
                <Text style={styles.crewLabelText}>{crew.name}</Text>
              </View>
              <View style={styles.crewDot}>
                <FontAwesomeIcon icon={faTruck} size={10} color="#FFFFFF" />
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
            <FontAwesomeIcon icon={faLocationArrow} size={16} color="#F97316" />
          </TouchableOpacity>
        </View>

        {/* Alert Panel */}
        <View style={styles.alertPanel}>
          <TouchableOpacity
            style={styles.alertPanelHeader}
            onPress={() => setAlertPanelExpanded(!alertPanelExpanded)}
          >
            <View style={styles.alertPanelHeaderLeft}>
              <FontAwesomeIcon icon={faFire} size={14} color="#FFFFFF" />
              <Text style={styles.alertPanelTitle}>Fire Emergencies</Text>
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
                    On Scene
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
                          <Text style={styles.alertAcceptButtonText}>Accept Emergency</Text>
                        </TouchableOpacity>
                      )}
                      {activeAlertTab === 'accepted' && (
                        <TouchableOpacity
                          style={[styles.alertActionButton, styles.alertAssignButton]}
                          onPress={() => openAssignModal(alert.id)}
                        >
                          <Text style={styles.alertAssignButtonText}>Deploy Fire Crews</Text>
                        </TouchableOpacity>
                      )}
                      {activeAlertTab === 'inProgress' && (
                        <View style={styles.progressInfo}>
                          <Text style={styles.progressText}>Fire Engine 1 • On Scene</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
                {filteredAlerts.length === 0 && (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No emergencies in this category</Text>
                  </View>
                )}
              </ScrollView>
            </>
          )}
        </View>

        {/* Crews Panel */}
        <View style={styles.crewsPanel}>
          <View style={styles.crewsPanelHeader}>
            <Text style={styles.crewsPanelTitle}>Fire Crews</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.crewsList}
          >
            {FIRE_CREWS.map(crew => (
              <View key={crew.id} style={styles.crewCard}>
                <View style={styles.crewCardLeft}>
                  <View
                    style={[
                      styles.crewAvatar,
                      crew.status === 'available' && styles.crewAvatarAvailable,
                      crew.status === 'deployed' && styles.crewAvatarDeployed,
                    ]}
                  >
                    <Text style={styles.crewAvatarText}>{crew.code}</Text>
                  </View>
                  <View>
                    <Text style={styles.crewCardName}>{crew.name}</Text>
                    <View style={styles.crewCardStatus}>
                      <View
                        style={[
                          styles.statusDot,
                          crew.status === 'available' && styles.statusDotAvailable,
                          crew.status === 'deployed' && styles.statusDotDeployed,
                        ]}
                      />
                      <Text style={styles.crewCardStatusText}>
                        {crew.status === 'available' ? 'Available' : 'Deployed'} • {crew.distance}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.crewCardActions}>
                  <TouchableOpacity style={styles.crewActionButton}>
                    <FontAwesomeIcon icon={faPhone} size={12} color="#F97316" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.crewActionButton}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} size={12} color="#F97316" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Assign Crew Modal */}
      <Modal
        visible={showAssignModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAssignModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.assignModal}>
            <View style={styles.assignModalHeader}>
              <Text style={styles.assignModalTitle}>Select Fire Crews</Text>
              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setShowAssignModal(false)}
              >
                <FontAwesomeIcon icon={faTimes} size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.assignModalSubtitle}>
              Tap to select fire crews to deploy. Crews sorted by distance.
            </Text>

            <ScrollView style={styles.crewListModal} showsVerticalScrollIndicator={false}>
              {FIRE_CREWS
                .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
                .map((crew) => (
                  <TouchableOpacity
                    key={crew.id}
                    style={[
                      styles.crewItemModal,
                      selectedCrews.includes(crew.id) && styles.crewItemSelected,
                    ]}
                    onPress={() => toggleCrewSelection(crew.id)}
                  >
                    <View style={styles.crewItemLeft}>
                      <View
                        style={[
                          styles.crewAvatarModal,
                          crew.status === 'available' && styles.crewAvatarAvailableModal,
                          crew.status === 'deployed' && styles.crewAvatarDeployedModal,
                        ]}
                      >
                        <Text style={styles.crewAvatarTextModal}>{crew.code}</Text>
                      </View>
                      <View style={styles.crewInfoModal}>
                        <Text style={styles.crewNameModal}>{crew.name}</Text>
                        <View style={styles.crewMetaModal}>
                          <View
                            style={[
                              styles.statusDotModal,
                              crew.status === 'available' && styles.statusDotAvailableModal,
                              crew.status === 'deployed' && styles.statusDotDeployedModal,
                            ]}
                          />
                          <Text style={styles.crewStatusModal}>
                            {crew.status === 'available' ? 'Available' : 'Deployed'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.crewItemRight}>
                      <Text style={styles.crewDistanceModal}>{crew.distance}</Text>
                      <View
                        style={[
                          styles.checkboxModal,
                          selectedCrews.includes(crew.id) && styles.checkboxCheckedModal,
                        ]}
                      >
                        {selectedCrews.includes(crew.id) && (
                          <FontAwesomeIcon icon={faCheck} size={12} color="#FFFFFF" />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </ScrollView>

            {selectedCrews.length > 0 && (
              <View style={styles.selectedCountContainer}>
                <Text style={styles.selectedCountText}>
                  {selectedCrews.length} crew{selectedCrews.length > 1 ? 's' : ''} selected
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.assignConfirmBtn,
                selectedCrews.length === 0 && styles.assignConfirmBtnDisabled,
              ]}
              onPress={confirmAssignment}
            >
              <Text style={styles.assignConfirmBtnText}>
                Deploy {selectedCrews.length > 0 ? `(${selectedCrews.length})` : ''} Crews
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
    backgroundColor: '#F97316',
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
  fireStationArea: {
    position: 'absolute',
    top: '10%',
    left: '50%',
    width: 50,
    height: 50,
    backgroundColor: '#FFEDD5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FED7AA',
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
    backgroundColor: '#F97316',
  },
  alertMarkerInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F97316',
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
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  crewMarker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  crewLabel: {
    backgroundColor: '#F97316',
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
  crewLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  crewDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F97316',
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
    backgroundColor: '#F97316',
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
    borderBottomColor: '#F97316',
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
  },
  alertTabText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  alertTabTextActive: {
    color: '#F97316',
    fontWeight: '600',
  },
  alertTabBadge: {
    backgroundColor: '#F97316',
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
    color: '#F97316',
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
    backgroundColor: '#FFEDD5',
  },
  alertAcceptButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#C2410C',
  },
  alertAssignButton: {
    backgroundColor: '#FFEDD5',
  },
  alertAssignButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#C2410C',
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
  crewsPanel: {
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
  crewsPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFF7ED',
  },
  crewsPanelTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F97316',
  },
  crewsList: {
    padding: 8,
    gap: 8,
  },
  crewCard: {
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
  crewCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  crewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crewAvatarAvailable: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  crewAvatarDeployed: {
    backgroundColor: '#FFEDD5',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  crewAvatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  crewCardName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  crewCardStatus: {
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
  statusDotDeployed: {
    backgroundColor: '#F97316',
  },
  crewCardStatusText: {
    fontSize: 10,
    color: '#64748B',
  },
  crewCardActions: {
    flexDirection: 'row',
    gap: 4,
  },
  crewActionButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#FFF7ED',
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
  crewListModal: {
    maxHeight: 350,
  },
  crewItemModal: {
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
  crewItemSelected: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  crewItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  crewAvatarModal: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crewAvatarAvailableModal: {
    backgroundColor: '#DCFCE7',
  },
  crewAvatarDeployedModal: {
    backgroundColor: '#FFEDD5',
  },
  crewAvatarTextModal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  crewInfoModal: {
    gap: 4,
  },
  crewNameModal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  crewMetaModal: {
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
  statusDotDeployedModal: {
    backgroundColor: '#F97316',
  },
  crewStatusModal: {
    fontSize: 13,
    color: '#64748B',
  },
  crewItemRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  crewDistanceModal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F97316',
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
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  selectedCountContainer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectedCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F97316',
  },
  assignConfirmBtn: {
    backgroundColor: '#F97316',
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

export default FireDispatcherScreen;
