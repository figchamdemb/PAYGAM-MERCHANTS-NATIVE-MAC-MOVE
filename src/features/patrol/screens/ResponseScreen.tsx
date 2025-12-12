/**
 * E-GOV-GUARDS-PORTAL - Emergency Response Screen
 * Screen 3: Active Response Mode
 * 
 * Features:
 * - Full-screen map with route polyline
 * - Turn-by-turn navigation strip
 * - Incident details overlay
 * - Status progression buttons (En Route → On Scene → Completed)
 * - Request Backup SOS
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Dimensions,
} from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../../config/colors';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

type ResponseStatus = 'EN_ROUTE' | 'ON_SCENE' | 'COMPLETED';

interface IncidentDetails {
    id: string;
    title: string;
    code: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    address: string;
    distance: string;
    eta: string;
    arrivalTime: string;
}

const MOCK_INCIDENT: IncidentDetails = {
    id: '1',
    title: 'Armed Robbery',
    code: '211',
    severity: 'Critical',
    address: '4502 W. Highland Ave, Sector 4',
    distance: '1.2 miles',
    eta: '4 min',
    arrivalTime: '12:42 PM',
};

const ResponseScreen: React.FC = () => {
    const navigation = useNavigation();
    const [currentStatus, setCurrentStatus] = useState<ResponseStatus>('EN_ROUTE');
    const [incident] = useState<IncidentDetails>(MOCK_INCIDENT);

    // Mock coordinates
    const officerLocation = { latitude: 13.4530, longitude: -16.5760 };
    const incidentLocation = { latitude: 13.4600, longitude: -16.5850 };

    // Route polyline coordinates
    const routeCoordinates = [
        officerLocation,
        { latitude: 13.4550, longitude: -16.5780 },
        { latitude: 13.4570, longitude: -16.5800 },
        { latitude: 13.4585, longitude: -16.5830 },
        incidentLocation,
    ];

    const handleStatusUpdate = (newStatus: ResponseStatus) => {
        setCurrentStatus(newStatus);
        if (newStatus === 'COMPLETED') {
            // Navigate to completion/report screen
            // navigation.navigate('ReportScreen', { incidentId: incident.id });
        }
    };

    const handleRequestBackup = () => {
        // Trigger SOS/backup request
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return colors.status.error;
            case 'High': return colors.status.warning;
            case 'Medium': return colors.status.info;
            default: return colors.status.online;
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Full Screen Map */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: (officerLocation.latitude + incidentLocation.latitude) / 2,
                    longitude: (officerLocation.longitude + incidentLocation.longitude) / 2,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
            >
                {/* Route Polyline */}
                <Polyline
                    coordinates={routeCoordinates}
                    strokeWidth={5}
                    strokeColor={colors.primary}
                    lineDashPattern={[0]}
                />

                {/* Officer Marker */}
                <Marker coordinate={officerLocation} title="Your Location">
                    <View style={styles.officerMarker}>
                        <Icon name="car-side" size={18} color={colors.primary} />
                    </View>
                </Marker>

                {/* Incident Marker */}
                <Marker coordinate={incidentLocation} title={incident.title}>
                    <View style={[styles.incidentMarker, { backgroundColor: getSeverityColor(incident.severity) }]}>
                        <Icon name="exclamation-triangle" size={18} color="#FFFFFF" />
                    </View>
                </Marker>
            </MapView>

            {/* Navigation Strip - Top */}
            <SafeAreaView style={styles.navStripContainer}>
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="chevron-left" size={20} color={colors.primary} />
                </TouchableOpacity>

                <View style={styles.navStrip}>
                    <View style={styles.navDetails}>
                        <Icon name="turn-right" size={14} color={colors.primary} style={{ marginRight: 8 }} />
                        <View>
                            <Text style={styles.navLabel}>Then Turn Right</Text>
                            <Text style={styles.navInstruction}>W. Highland Ave</Text>
                        </View>
                    </View>
                    <View style={styles.navDistance}>
                        <Text style={styles.navDistanceValue}>200</Text>
                        <Text style={styles.navDistanceUnit}>FEET</Text>
                    </View>
                </View>
            </SafeAreaView>

            {/* Incident Info Overlay */}
            <View style={styles.incidentOverlay}>
                <View style={styles.incidentCard}>
                    <View style={styles.incidentHeader}>
                        <View>
                            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(incident.severity) }]}>
                                <Text style={styles.severityText}>Severity: {incident.severity}</Text>
                            </View>
                            <Text style={styles.incidentTitle}>{incident.title}</Text>
                        </View>
                        <View style={styles.codeBox}>
                            <Text style={styles.codeLabel}>CODE</Text>
                            <Text style={styles.codeValue}>{incident.code}</Text>
                        </View>
                    </View>
                    <View style={styles.incidentAddress}>
                        <Icon name="map-marker-alt" size={14} color="#6B7280" style={{ marginRight: 6 }} />
                        <Text style={styles.incidentAddressText}>{incident.address}</Text>
                    </View>
                </View>
            </View>

            {/* Control Panel - Bottom */}
            <View style={styles.controlPanel}>
                {/* Trip Info */}
                <View style={styles.tripInfo}>
                    <View>
                        <Text style={styles.tripTime}>{incident.eta}</Text>
                        <Text style={styles.tripDetails}>{incident.distance} • {incident.arrivalTime} Arrival</Text>
                    </View>
                    <View style={styles.trafficStatus}>
                        <View style={styles.trafficDot} />
                        <Text style={styles.trafficText}>Live Traffic</Text>
                    </View>
                </View>

                {/* Status Action Buttons */}
                <View style={styles.actionGrid}>
                    {currentStatus === 'EN_ROUTE' && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.actionButtonPrimary]}
                            onPress={() => handleStatusUpdate('ON_SCENE')}
                        >
                            <Icon name="map-pin" size={20} color="#FFFFFF" />
                            <Text style={styles.actionButtonTextPrimary}>ARRIVED ON SCENE</Text>
                        </TouchableOpacity>
                    )}

                    {currentStatus === 'ON_SCENE' && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.actionButtonSuccess]}
                            onPress={() => handleStatusUpdate('COMPLETED')}
                        >
                            <Icon name="check-circle" size={20} color="#FFFFFF" />
                            <Text style={styles.actionButtonTextPrimary}>MARK COMPLETED</Text>
                        </TouchableOpacity>
                    )}

                    {currentStatus === 'COMPLETED' && (
                        <View style={[styles.actionButton, styles.actionButtonCompleted]}>
                            <Icon name="check-double" size={20} color="#10B981" />
                            <Text style={styles.actionButtonTextCompleted}>INCIDENT RESOLVED</Text>
                        </View>
                    )}
                </View>

                {/* SOS / Backup Button */}
                <TouchableOpacity style={styles.sosButton} onPress={handleRequestBackup}>
                    <Icon name="exclamation-triangle" size={18} color="#FFFFFF" />
                    <Text style={styles.sosButtonText}>REQUEST BACKUP</Text>
                </TouchableOpacity>

                {/* Status Indicator */}
                <View style={styles.statusIndicator}>
                    <View style={[styles.statusStep, currentStatus !== 'EN_ROUTE' && styles.statusStepCompleted]}>
                        <Text style={styles.statusStepText}>EN ROUTE</Text>
                    </View>
                    <View style={styles.statusDivider} />
                    <View style={[styles.statusStep, currentStatus === 'COMPLETED' && styles.statusStepCompleted]}>
                        <Text style={styles.statusStepText}>ON SCENE</Text>
                    </View>
                    <View style={styles.statusDivider} />
                    <View style={[styles.statusStep, currentStatus === 'COMPLETED' && styles.statusStepCompleted]}>
                        <Text style={styles.statusStepText}>COMPLETED</Text>
                    </View>
                </View>
            </View>
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

    // Markers
    officerMarker: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: colors.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    incidentMarker: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },

    // Navigation Strip
    navStripContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 16,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 20,
    },
    navStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 70,
        marginTop: 48,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    navDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    navInstruction: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    navDistance: {
        alignItems: 'flex-end',
    },
    navDistanceValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
    },
    navDistanceUnit: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#6B7280',
        letterSpacing: 1,
    },

    // Incident Overlay
    incidentOverlay: {
        position: 'absolute',
        top: 120,
        left: 16,
        right: 16,
        zIndex: 5,
    },
    incidentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    incidentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    severityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 4,
        alignSelf: 'flex-start',
    },
    severityText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    incidentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    codeBox: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    codeLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#9CA3AF',
        letterSpacing: 1,
    },
    codeValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#374151',
    },
    incidentAddress: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    incidentAddressText: {
        fontSize: 13,
        color: '#6B7280',
        flex: 1,
    },

    // Control Panel
    controlPanel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10,
    },
    tripInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    tripTime: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    tripDetails: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    trafficStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
    },
    trafficDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.status.online,
        marginRight: 6,
    },
    trafficText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },

    // Action Buttons
    actionGrid: {
        marginBottom: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 10,
    },
    actionButtonPrimary: {
        backgroundColor: colors.primary,
    },
    actionButtonSuccess: {
        backgroundColor: colors.status.success,
    },
    actionButtonCompleted: {
        backgroundColor: '#D1FAE5',
        borderWidth: 1,
        borderColor: '#10B981',
    },
    actionButtonTextPrimary: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    actionButtonTextCompleted: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#10B981',
        letterSpacing: 0.5,
    },

    // SOS Button
    sosButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.status.error,
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 12,
        gap: 8,
    },
    sosButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },

    // Status Indicator
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    statusStep: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: '#F3F4F6',
    },
    statusStepCompleted: {
        backgroundColor: '#D1FAE5',
    },
    statusStepText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#6B7280',
        letterSpacing: 0.5,
    },
    statusDivider: {
        width: 16,
        height: 2,
        backgroundColor: '#D1D5DB',
    },
});

export default ResponseScreen;
