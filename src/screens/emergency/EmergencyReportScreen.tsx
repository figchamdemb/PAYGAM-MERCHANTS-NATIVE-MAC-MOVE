import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Switch,
    Alert,
    Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';

type EmergencyReportScreenProps = {
    serviceType: 'police' | 'fire' | 'ambulance';
};

type RouteParams = {
    params: EmergencyReportScreenProps;
};

const EmergencyReportScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const { theme, isDarkMode } = useTheme();
    const route = useRoute<RouteProp<RouteParams, 'params'>>();
    const { serviceType } = route.params || { serviceType: 'police' };

    const [selectedLocation, setSelectedLocation] = useState<'current' | 'home'>('current');
    const [alertNearbyHelpers, setAlertNearbyHelpers] = useState(false);
    const [incidentType, setIncidentType] = useState('accident');
    const [vehicleCount, setVehicleCount] = useState(2);
    const [selectedVehicles, setSelectedVehicles] = useState<string[]>(['4x4', 'saloon']);
    const [description, setDescription] = useState('');

    const serviceConfig = {
        police: { title: 'Police', color: '#3B82F6', headerBg: '#3B82F6' },
        fire: { title: 'Fire', color: '#EF4444', headerBg: '#EF4444' },
        ambulance: { title: 'Medical', color: '#10B981', headerBg: '#10B981' },
    };

    const config = serviceConfig[serviceType];

    const vehicleTypes = ['4x4', 'saloon', 'truck', 'van/bus', 'motorbike'];

    const handleSendAlert = () => {
        Alert.alert('Send Alert', 'Emergency alert will be sent to authorities.');
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    const toggleVehicleType = (type: string) => {
        if (selectedVehicles.includes(type)) {
            setSelectedVehicles(selectedVehicles.filter(v => v !== type));
        } else {
            setSelectedVehicles([...selectedVehicles, type]);
        }
    };

    // Icons
    const ArrowLeftIcon = () => (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M19 12H5M12 19l-7-7 7-7" />
        </Svg>
    );

    const ShieldIcon = () => (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </Svg>
    );

    const MapPinIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <Circle cx="12" cy="10" r="3" />
        </Svg>
    );

    const HomeIcon = () => (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <Path d="M9 22V12h6v10" />
        </Svg>
    );

    const BroadcastIcon = () => (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="12" r="2" />
            <Path d="M12 1v6m0 6v6M5 5l4 4m6 6l4 4M1 12h6m6 0h6M5 19l4-4m6-6l4-4" />
        </Svg>
    );

    const InfoIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="12" r="10" />
            <Path d="M12 16v-4M12 8h.01" />
        </Svg>
    );

    const AlertTriangleIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <Path d="M12 9v4M12 17h.01" />
        </Svg>
    );

    const ChevronDownIcon = () => (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M6 9l6 6 6-6" />
        </Svg>
    );

    const CameraIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <Circle cx="12" cy="13" r="4" />
        </Svg>
    );

    const MicIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <Path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
        </Svg>
    );

    const CheckIcon = () => (
        <Svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M20 6L9 17l-5-5" />
        </Svg>
    );

    const PaperPlaneIcon = () => (
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </Svg>
    );

    const CloseIcon = () => (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M18 6L6 18M6 6l12 12" />
        </Svg>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: config.headerBg }]}>
                <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
                    <ArrowLeftIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Report Emergency</Text>
                <TouchableOpacity style={styles.langButton}>
                    <Text style={styles.langButtonText}>EN</Text>
                    <View style={styles.langDot} />
                </TouchableOpacity>
            </View>

            <SafeAreaView style={styles.safeArea}>
                <KeyboardAwareScrollView 
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    enableOnAndroid={true}
                    enableAutomaticScroll={true}
                    extraScrollHeight={Platform.OS === 'ios' ? 100 : 120}
                    keyboardOpeningTime={0}
                >

                    {/* Service Banner */}
                    <View style={[styles.serviceBanner, { backgroundColor: config.color }]}>
                        <View style={styles.decorativeCircle1} />
                        <View style={styles.decorativeCircle2} />
                        <View style={styles.serviceBannerContent}>
                            <View style={styles.serviceIcon}>
                                <ShieldIcon />
                            </View>
                            <View>
                                <Text style={styles.serviceLabel}>SELECTED SERVICE</Text>
                                <Text style={styles.serviceTitle}>{config.title}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.formContent}>

                        {/* Location Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleRow}>
                                    <MapPinIcon />
                                    <Text style={styles.sectionTitle}>Location</Text>
                                </View>
                                <View style={styles.gpsActiveBadge}>
                                    <View style={styles.gpsDot} />
                                    <Text style={styles.gpsActiveText}>GPS ACTIVE</Text>
                                </View>
                            </View>

                            <View style={styles.sectionBody}>
                                {/* Current Location */}
                                <TouchableOpacity
                                    style={[
                                        styles.locationOption,
                                        selectedLocation === 'current' && styles.locationOptionSelected,
                                    ]}
                                    onPress={() => setSelectedLocation('current')}
                                >
                                    <View style={styles.radioOuter}>
                                        {selectedLocation === 'current' && <View style={styles.radioInner} />}
                                    </View>
                                    <View style={styles.locationInfo}>
                                        <Text style={styles.locationTitle}>Current Location</Text>
                                        <Text style={styles.locationCoords}>Lat: 13.4549° N, Long: 16.5790° W</Text>
                                        <Text style={styles.locationAccuracy}>ACCURACY: ±5 METERS</Text>
                                    </View>
                                    <View style={styles.miniMap}>
                                        <View style={styles.miniMapDot} />
                                    </View>
                                </TouchableOpacity>

                                {/* Home Address */}
                                <TouchableOpacity
                                    style={[styles.locationOption, selectedLocation === 'home' && styles.locationOptionSelected]}
                                    onPress={() => setSelectedLocation('home')}
                                >
                                    <View style={styles.radioOuter}>
                                        {selectedLocation === 'home' && <View style={styles.radioInner} />}
                                    </View>
                                    <View style={styles.locationInfo}>
                                        <Text style={styles.locationTitle}>Home Address</Text>
                                        <Text style={styles.locationCoords}>12 Kairaba Avenue, Serrekunda</Text>
                                    </View>
                                    <View style={styles.homeIconCircle}>
                                        <HomeIcon />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Alert Nearby Helpers Toggle */}
                        <View style={styles.alertToggleSection}>
                            <View style={styles.alertToggleLeft}>
                                <View style={styles.alertToggleTitleRow}>
                                    <View style={styles.broadcastIconCircle}>
                                        <BroadcastIcon />
                                    </View>
                                    <Text style={styles.alertToggleTitle}>Alert Nearby Helpers?</Text>
                                </View>
                                <Text style={styles.alertToggleDescription}>
                                    Broadcast SOS to verified volunteers within 1km.
                                </Text>
                            </View>
                            <Switch
                                value={alertNearbyHelpers}
                                onValueChange={setAlertNearbyHelpers}
                                trackColor={{ false: '#E2E8F0', true: '#FCA5A5' }}
                                thumbColor={alertNearbyHelpers ? '#B45309' : '#F1F5F9'}
                                ios_backgroundColor="#E2E8F0"
                            />
                        </View>

                        {/* Incident Details */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeaderSimple}>
                                <InfoIcon />
                                <Text style={styles.sectionTitleSimple}>Incident Details</Text>
                            </View>

                            <View style={styles.sectionBody}>
                                {/* Type Selector */}
                                <View style={styles.selectContainer}>
                                    <View style={styles.selectIcon}>
                                        <AlertTriangleIcon />
                                    </View>
                                    <View style={styles.selectField}>
                                        <Text style={styles.selectText}>
                                            {incidentType === 'accident' ? 'Car Accident' :
                                                incidentType === 'robbery' ? 'Robbery / Theft' :
                                                    incidentType === 'assault' ? 'Physical Assault' :
                                                        incidentType === 'suspicious' ? 'Suspicious Activity' : 'Other'}
                                        </Text>
                                    </View>
                                    <ChevronDownIcon />
                                </View>

                                {/* Vehicle Section (conditional) */}
                                {incidentType === 'accident' && (
                                    <View style={styles.vehicleSection}>
                                        {/* Vehicle Counter */}
                                        <View style={styles.vehicleCounterRow}>
                                            <Text style={styles.vehicleCounterLabel}>Vehicles Involved</Text>
                                            <View style={styles.counter}>
                                                <TouchableOpacity
                                                    style={styles.counterButton}
                                                    onPress={() => setVehicleCount(Math.max(1, vehicleCount - 1))}
                                                >
                                                    <Text style={styles.counterButtonText}>−</Text>
                                                </TouchableOpacity>
                                                <Text style={styles.counterValue}>{vehicleCount}</Text>
                                                <TouchableOpacity
                                                    style={styles.counterButton}
                                                    onPress={() => setVehicleCount(vehicleCount + 1)}
                                                >
                                                    <Text style={styles.counterButtonText}>+</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        {/* Vehicle Type Chips */}
                                        <View>
                                            <Text style={styles.chipSectionLabel}>VEHICLE TYPES</Text>
                                            <View style={styles.chipContainer}>
                                                {vehicleTypes.map((type) => (
                                                    <TouchableOpacity
                                                        key={type}
                                                        style={[
                                                            styles.chip,
                                                            selectedVehicles.includes(type) && styles.chipSelected,
                                                        ]}
                                                        onPress={() => toggleVehicleType(type)}
                                                    >
                                                        {selectedVehicles.includes(type) && (
                                                            <View style={styles.chipCheckIcon}>
                                                                <CheckIcon />
                                                            </View>
                                                        )}
                                                        <Text style={[
                                                            styles.chipText,
                                                            selectedVehicles.includes(type) && styles.chipTextSelected,
                                                        ]}>
                                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                )}

                                {/* Description */}
                                <TextInput
                                    style={styles.textarea}
                                    placeholder="Describe the emergency (Optional)..."
                                    placeholderTextColor="#94A3B8"
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    value={description}
                                    onChangeText={setDescription}
                                />

                                {/* Media Buttons */}
                                <View style={styles.mediaButtons}>
                                    <TouchableOpacity style={styles.mediaButton}>
                                        <CameraIcon />
                                        <Text style={styles.mediaButtonText}>Add Photo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.mediaButton}>
                                        <MicIcon />
                                        <Text style={styles.mediaButtonText}>Add Audio</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Disclaimer */}
                        <Text style={styles.disclaimer}>
                            By sending this alert, you consent to sharing your location data with emergency services. False reporting is a punishable offense under Gambian law.
                        </Text>

                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <CloseIcon />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.sendButton, { backgroundColor: config.color }]}
                    onPress={handleSendAlert}
                    activeOpacity={0.9}
                >
                    <View style={styles.sendButtonIcon}>
                        <PaperPlaneIcon />
                    </View>
                    <Text style={styles.sendButtonText}>SEND ALERT</Text>
                    <View style={styles.chevrons}>
                        <Text style={styles.chevron}>›</Text>
                        <Text style={styles.chevron}>›</Text>
                        <Text style={styles.chevron}>›</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        paddingTop: 32,
        paddingBottom: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    langButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    langButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    langDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4ADE80',
        borderWidth: 2,
        borderColor: '#3B82F6',
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 120,
    },
    serviceBanner: {
        paddingHorizontal: 24,
        paddingVertical: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
    },
    decorativeCircle1: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginRight: -40,
        marginTop: -40,
    },
    decorativeCircle2: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginLeft: -40,
        marginBottom: -40,
    },
    serviceBannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        zIndex: 1,
    },
    serviceIcon: {
        width: 56,
        height: 56,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    serviceLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.8)',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    serviceTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    formContent: {
        paddingHorizontal: 20,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        marginBottom: 20,
        overflow: 'hidden',
    },
    sectionHeader: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(248, 250, 252, 0.5)',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#334155',
    },
    gpsActiveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F0FDF4',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BBF7D0',
    },
    gpsDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#22C55E',
    },
    gpsActiveText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#166534',
    },
    sectionBody: {
        padding: 16,
        gap: 12,
    },
    locationOption: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    locationOptionSelected: {
        borderWidth: 2,
        borderColor: '#B45309',
        backgroundColor: 'rgba(254, 243, 199, 0.4)',
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#B45309',
    },
    locationInfo: {
        flex: 1,
    },
    locationTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    locationCoords: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 4,
    },
    locationAccuracy: {
        fontSize: 10,
        fontWeight: '700',
        color: '#B45309',
        letterSpacing: 0.5,
    },
    miniMap: {
        width: 64,
        height: 64,
        backgroundColor: '#E2E8F0',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        position: 'relative',
        overflow: 'hidden',
    },
    miniMapDot: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -6,
        marginLeft: -6,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#3B82F6',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    homeIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    alertToggleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF7ED',
        borderWidth: 1,
        borderColor: '#FED7AA',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    alertToggleLeft: {
        flex: 1,
        paddingRight: 16,
    },
    alertToggleTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    broadcastIconCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    alertToggleTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
    },
    alertToggleDescription: {
        fontSize: 11,
        color: '#64748B',
        lineHeight: 16,
    },
    sectionHeaderSimple: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionTitleSimple: {
        fontSize: 14,
        fontWeight: '700',
        color: '#334155',
    },
    selectContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingLeft: 12,
        paddingRight: 12,
        height: 56,
        marginBottom: 16,
    },
    selectIcon: {
        marginRight: 8,
    },
    selectField: {
        flex: 1,
    },
    selectText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },
    vehicleSection: {
        backgroundColor: 'rgba(254, 243, 199, 0.5)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FED7AA',
        padding: 12,
        marginBottom: 16,
        gap: 16,
    },
    vehicleCounterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    vehicleCounterLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#334155',
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        height: 36,
    },
    counterButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: '#F1F5F9',
    },
    counterButtonText: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
    },
    counterValue: {
        width: 40,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
    },
    chipSectionLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#64748B',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    chipSelected: {
        backgroundColor: '#B45309',
        borderColor: '#B45309',
        shadowColor: '#FED7AA',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
    },
    chipCheckIcon: {
        // Container for check icon
    },
    chipText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },
    chipTextSelected: {
        color: '#FFFFFF',
    },
    textarea: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        color: '#1E293B',
        minHeight: 96,
        marginBottom: 12,
    },
    mediaButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    mediaButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#F8FAFC',
    },
    mediaButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748B',
    },
    disclaimer: {
        fontSize: 10,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 16,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        padding: 16,
        paddingBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 10,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    cancelButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButton: {
        flex: 1,
        height: 56,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        shadowColor: '#78350F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
        position: 'relative',
        overflow: 'hidden',
    },
    sendButtonIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    sendButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
        marginLeft: -50,
        zIndex: 1,
    },
    chevrons: {
        flexDirection: 'row',
        paddingRight: 16,
        opacity: 0.8,
        zIndex: 1,
    },
    chevron: {
        fontSize: 12,
        color: '#FFFFFF',
    },
});

export default EmergencyReportScreen;
