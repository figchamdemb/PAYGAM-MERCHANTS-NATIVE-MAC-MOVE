/**
 * E-GOV-GUARDS-PORTAL - Command Map Screen
 * Screen 2: Main Patrol Dashboard
 * 
 * Features:
 * - Full-screen map with incident markers
 * - Officer status toggle (Online/Busy/Offline)
 * - Draggable bottom sheet with task list
 * - Quick action buttons
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    PanResponder,
    Dimensions,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Alert,
    ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../../config/colors';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useLocation } from '../../../shared/hooks/useLocation';

const { width, height } = Dimensions.get('window');
const BOTTOM_SHEET_MAX_HEIGHT = height * 0.6;
const BOTTOM_SHEET_MIN_HEIGHT = 180;

// Mock data for incidents
const MOCK_INCIDENTS = [
    {
        id: '1',
        title: 'Armed Robbery',
        type: 'ROBBERY',
        priority: 'HIGH',
        code: '211',
        location: { latitude: 13.4549, longitude: -16.5790, address: '4502 W. Highland Ave, Sector 4' },
        reportedAt: '10 min ago',
        status: 'PENDING',
    },
    {
        id: '2',
        title: 'Traffic Accident',
        type: 'TRAFFIC',
        priority: 'MEDIUM',
        code: '502',
        location: { latitude: 13.4600, longitude: -16.5850, address: 'Junction of Main St & 2nd Ave' },
        reportedAt: '25 min ago',
        status: 'PENDING',
    },
    {
        id: '3',
        title: 'Domestic Disturbance',
        type: 'DOMESTIC',
        priority: 'MEDIUM',
        code: '415',
        location: { latitude: 13.4520, longitude: -16.5720, address: '123 Palm Street, Unit 4B' },
        reportedAt: '35 min ago',
        status: 'PENDING',
    },
];

type OfficerStatus = 'ONLINE' | 'BUSY' | 'OFFLINE';
type TabType = 'CURRENT' | 'NEXT';

const MapScreen: React.FC = () => {
    const navigation = useNavigation();
    const mapRef = useRef<MapView>(null);
    const [officerStatus, setOfficerStatus] = useState<OfficerStatus>('ONLINE');
    const [activeTab, setActiveTab] = useState<TabType>('CURRENT');
    const [currentTask, setCurrentTask] = useState<any>(null);
    const [incidents, setIncidents] = useState(MOCK_INCIDENTS);
    const [mapReady, setMapReady] = useState(false);

    // Real GPS Location Hook - watches position continuously
    const {
        location,
        error: locationError,
        loading: locationLoading,
        refresh: refreshLocation,
        calculateDistanceTo,
        formatDistance,
    } = useLocation({ watchPosition: true, distanceFilter: 10 });

    // Bottom sheet animation
    const pan = useRef(new Animated.Value(0)).current;
    const sheetHeight = useRef(new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)).current;

    // Dynamic map region based on GPS
    const [mapRegion, setMapRegion] = useState<Region>({
        latitude: 13.4549,
        longitude: -16.5790,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    });

    // Update map region when location changes
    useEffect(() => {
        if (location && mapReady) {
            const newRegion: Region = {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            };
            setMapRegion(newRegion);
            // Animate to new position
            mapRef.current?.animateToRegion(newRegion, 500);
        }
    }, [location, mapReady]);

    // Show location error
    useEffect(() => {
        if (locationError) {
            Alert.alert('Location Error', locationError, [
                { text: 'Retry', onPress: refreshLocation },
                { text: 'Cancel', style: 'cancel' },
            ]);
        }
    }, [locationError, refreshLocation]);

    const getStatusColor = (status: OfficerStatus) => {
        switch (status) {
            case 'ONLINE': return colors.status.online;
            case 'BUSY': return colors.status.busy;
            case 'OFFLINE': return colors.status.offline;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH': return colors.status.error;
            case 'MEDIUM': return colors.status.warning;
            case 'LOW': return colors.status.info;
            default: return colors.status.info;
        }
    };

    const handleAcceptTask = (incident: any) => {
        setCurrentTask(incident);
        setActiveTab('CURRENT');
        // Calculate distance to incident
        if (location) {
            const distance = calculateDistanceTo(incident.location);
            if (distance) {
                Alert.alert(
                    'Task Accepted',
                    `Distance: ${formatDistance(distance)}`,
                    [{ text: 'Start Navigation', onPress: () => navigateToIncident(incident) }]
                );
            }
        }
    };

    const navigateToIncident = (incident: any) => {
        // @ts-ignore
        navigation.navigate('ResponseScreen', { incidentId: incident.id, incident });
    };

    const handleStatusChange = () => {
        const statusOrder: OfficerStatus[] = ['ONLINE', 'BUSY', 'OFFLINE'];
        const currentIndex = statusOrder.indexOf(officerStatus);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        setOfficerStatus(statusOrder[nextIndex]);
    };

    const handleOpenDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const handleCenterOnLocation = () => {
        if (location) {
            mapRef.current?.animateToRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 500);
        } else {
            refreshLocation();
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Loading Overlay */}
            {locationLoading && !location && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Getting your location...</Text>
                </View>
            )}

            {/* Map View */}
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={mapRegion}
                onMapReady={() => setMapReady(true)}
                showsUserLocation={false}
                showsMyLocationButton={false}
                showsCompass={true}
            >
                {/* Incident Markers */}
                {incidents.map((incident) => (
                    <Marker
                        key={incident.id}
                        coordinate={{
                            latitude: incident.location.latitude,
                            longitude: incident.location.longitude,
                        }}
                        title={incident.title}
                        description={incident.location.address}
                        onPress={() => handleAcceptTask(incident)}
                    >
                        <View style={[styles.markerContainer, { backgroundColor: getPriorityColor(incident.priority) }]}>
                            <Icon name="exclamation-triangle" size={14} color="#FFFFFF" />
                        </View>
                    </Marker>
                ))}

                {/* Officer Location Marker - Real GPS */}
                {location && (
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude
                        }}
                        title="Your Location"
                        description={`Accuracy: ${location.accuracy?.toFixed(0)}m`}
                    >
                        <View style={styles.officerMarker}>
                            <Icon name="car-side" size={16} color={colors.primary} />
                        </View>
                    </Marker>
                )}
            </MapView>

            {/* Top Header Overlay */}
            <SafeAreaView style={styles.headerOverlay}>
                <View style={styles.headerRow}>
                    {/* Menu Button */}
                    <TouchableOpacity style={styles.headerButton} onPress={handleOpenDrawer}>
                        <Icon name="bars" size={20} color={colors.primary} />
                    </TouchableOpacity>

                    {/* Status Badge */}
                    <TouchableOpacity style={styles.statusBadge} onPress={handleStatusChange}>
                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(officerStatus) }]} />
                        <Text style={styles.statusText}>{officerStatus}</Text>
                        <Icon name="chevron-down" size={12} color="#6B7280" />
                    </TouchableOpacity>

                    {/* Notification Button */}
                    <TouchableOpacity style={styles.headerButton}>
                        <Icon name="bell" size={20} color={colors.primary} />
                        <View style={styles.notificationBadge}>
                            <Text style={styles.notificationText}>3</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Quick Action Buttons */}
            <View style={styles.quickActions}>
                <TouchableOpacity style={styles.quickActionButton}>
                    <Icon name="location-arrow" size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.quickActionButton, styles.sosButton]}>
                    <Icon name="exclamation-triangle" size={18} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Bottom Sheet */}
            <Animated.View style={[styles.bottomSheet, { height: sheetHeight }]}>
                {/* Handle */}
                <View style={styles.sheetHandle}>
                    <View style={styles.handleBar} />
                </View>

                {/* Tab Buttons */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'CURRENT' && styles.tabButtonActive]}
                        onPress={() => setActiveTab('CURRENT')}
                    >
                        <Icon name="crosshairs" size={14} color={activeTab === 'CURRENT' ? '#FFFFFF' : '#6B7280'} />
                        <Text style={[styles.tabText, activeTab === 'CURRENT' && styles.tabTextActive]}>
                            Current Task
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'NEXT' && styles.tabButtonActive]}
                        onPress={() => setActiveTab('NEXT')}
                    >
                        <Icon name="list" size={14} color={activeTab === 'NEXT' ? '#FFFFFF' : '#6B7280'} />
                        <Text style={[styles.tabText, activeTab === 'NEXT' && styles.tabTextActive]}>
                            Next Jobs ({incidents.length})
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView style={styles.sheetContent} showsVerticalScrollIndicator={false}>
                    {activeTab === 'CURRENT' ? (
                        currentTask ? (
                            <View style={styles.currentTaskCard}>
                                <View style={styles.taskHeader}>
                                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(currentTask.priority) }]}>
                                        <Text style={styles.priorityText}>{currentTask.priority}</Text>
                                    </View>
                                    <Text style={styles.taskCode}>Code {currentTask.code}</Text>
                                </View>
                                <Text style={styles.taskTitle}>{currentTask.title}</Text>
                                <View style={styles.taskLocation}>
                                    <Icon name="map-marker-alt" size={12} color="#6B7280" />
                                    <Text style={styles.locationText}>{currentTask.location.address}</Text>
                                </View>
                                <TouchableOpacity style={styles.navigateButton}>
                                    <Icon name="route" size={16} color="#FFFFFF" />
                                    <Text style={styles.navigateButtonText}>START NAVIGATION</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.noTaskContainer}>
                                <Icon name="check-circle" size={48} color="#10B981" />
                                <Text style={styles.noTaskTitle}>All Clear</Text>
                                <Text style={styles.noTaskText}>No active task assigned</Text>
                            </View>
                        )
                    ) : (
                        // Next Jobs List
                        incidents.map((incident) => (
                            <TouchableOpacity
                                key={incident.id}
                                style={styles.incidentCard}
                                onPress={() => handleAcceptTask(incident)}
                            >
                                <View style={styles.incidentHeader}>
                                    <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(incident.priority) }]} />
                                    <View style={styles.incidentInfo}>
                                        <Text style={styles.incidentTitle}>{incident.title}</Text>
                                        <Text style={styles.incidentTime}>{incident.reportedAt}</Text>
                                    </View>
                                    <View style={styles.codeBox}>
                                        <Text style={styles.codeLabel}>CODE</Text>
                                        <Text style={styles.codeValue}>{incident.code}</Text>
                                    </View>
                                </View>
                                <View style={styles.incidentLocation}>
                                    <Icon name="map-marker-alt" size={12} color="#6B7280" />
                                    <Text style={styles.incidentLocationText}>{incident.location.address}</Text>
                                </View>
                                <TouchableOpacity style={styles.acceptButton}>
                                    <Text style={styles.acceptButtonText}>ACCEPT</Text>
                                    <Icon name="arrow-right" size={12} color="#FFFFFF" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },

    // Loading Overlay
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
    loadingText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginTop: 12,
        fontWeight: '500',
    },

    // Markers
    markerContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    officerMarker: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: colors.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    // Header
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 8,
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginRight: 8,
    },
    notificationBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: colors.status.error,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    // Quick Actions
    quickActions: {
        position: 'absolute',
        right: 16,
        bottom: BOTTOM_SHEET_MIN_HEIGHT + 20,
        gap: 12,
    },
    quickActionButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    sosButton: {
        backgroundColor: colors.status.error,
    },

    // Bottom Sheet
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10,
    },
    sheetHandle: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    handleBar: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D1D5DB',
    },

    // Tabs
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 8,
        marginBottom: 12,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
        gap: 6,
    },
    tabButtonActive: {
        backgroundColor: colors.primary,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    tabTextActive: {
        color: '#FFFFFF',
    },

    // Content
    sheetContent: {
        flex: 1,
        paddingHorizontal: 16,
    },

    // Current Task
    currentTaskCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    taskHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    priorityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    priorityText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    taskCode: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#374151',
    },
    taskTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    taskLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
    },
    locationText: {
        fontSize: 14,
        color: '#6B7280',
        flex: 1,
    },
    navigateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    navigateButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },

    // No Task
    noTaskContainer: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    noTaskTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 12,
    },
    noTaskText: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },

    // Incident Cards
    incidentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    incidentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    priorityIndicator: {
        width: 4,
        height: 40,
        borderRadius: 2,
        marginRight: 12,
    },
    incidentInfo: {
        flex: 1,
    },
    incidentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    incidentTime: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    codeBox: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: 'center',
    },
    codeLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#9CA3AF',
    },
    codeValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#374151',
    },
    incidentLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
        paddingLeft: 16,
    },
    incidentLocationText: {
        fontSize: 13,
        color: '#6B7280',
        flex: 1,
    },
    acceptButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 10,
        borderRadius: 8,
        gap: 6,
    },
    acceptButtonText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
});

export default MapScreen;
