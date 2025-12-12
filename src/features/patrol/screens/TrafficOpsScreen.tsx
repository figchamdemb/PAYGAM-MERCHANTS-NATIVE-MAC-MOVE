/**
 * E-GOV-GUARDS-PORTAL - Traffic Operations Screen
 * Screen 4: Traffic Enforcement
 * 
 * Features:
 * - Camera viewfinder for plate scanning
 * - Manual plate/license entry
 * - Search results with status colors
 * - Quick action buttons (Issue Ticket, Run Full Check)
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../../config/colors';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

type SearchMode = 'PLATE' | 'LICENSE';
type ResultStatus = 'CLEAR' | 'WARNING' | 'ALERT';

interface SearchResult {
    id: string;
    type: 'vehicle' | 'driver';
    plateNumber?: string;
    licenseNumber?: string;
    owner?: string;
    make?: string;
    model?: string;
    year?: string;
    color?: string;
    status: ResultStatus;
    alerts: string[];
    registrationExpiry?: string;
    insuranceExpiry?: string;
}

const MOCK_VEHICLE_RESULT: SearchResult = {
    id: '1',
    type: 'vehicle',
    plateNumber: 'BJL-4523',
    owner: 'Ousman Jallow',
    make: 'Toyota',
    model: 'Corolla',
    year: '2019',
    color: 'Silver',
    status: 'WARNING',
    alerts: ['Registration expires in 30 days'],
    registrationExpiry: '2025-01-15',
    insuranceExpiry: '2025-06-30',
};

const TrafficOpsScreen: React.FC = () => {
    const navigation = useNavigation();
    const [searchMode, setSearchMode] = useState<SearchMode>('PLATE');
    const [searchValue, setSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
    const [showCamera, setShowCamera] = useState(false);

    const handleSearch = () => {
        if (!searchValue.trim()) return;

        setIsSearching(true);
        // Simulate API call
        setTimeout(() => {
            setIsSearching(false);
            setSearchResult(MOCK_VEHICLE_RESULT);
        }, 1500);
    };

    const handleScanPlate = () => {
        setShowCamera(true);
        // Simulate plate recognition
        setTimeout(() => {
            setShowCamera(false);
            setSearchValue('BJL-4523');
            handleSearch();
        }, 2000);
    };

    const getStatusColor = (status: ResultStatus) => {
        switch (status) {
            case 'CLEAR': return colors.status.success;
            case 'WARNING': return colors.status.warning;
            case 'ALERT': return colors.status.error;
        }
    };

    const getStatusIcon = (status: ResultStatus) => {
        switch (status) {
            case 'CLEAR': return 'check-circle';
            case 'WARNING': return 'exclamation-triangle';
            case 'ALERT': return 'times-circle';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="chevron-left" size={18} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Traffic Operations</Text>
                <TouchableOpacity style={styles.historyButton}>
                    <Icon name="history" size={18} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Camera/Scanner Section */}
                <View style={styles.scannerSection}>
                    {showCamera ? (
                        <View style={styles.cameraPreview}>
                            <View style={styles.scanFrame}>
                                <View style={[styles.scanCorner, styles.topLeft]} />
                                <View style={[styles.scanCorner, styles.topRight]} />
                                <View style={[styles.scanCorner, styles.bottomLeft]} />
                                <View style={[styles.scanCorner, styles.bottomRight]} />
                            </View>
                            <Text style={styles.scanningText}>Scanning...</Text>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.cameraTrigger} onPress={handleScanPlate}>
                            <Icon name="camera" size={32} color={colors.primary} />
                            <Text style={styles.cameraTriggerText}>Tap to Scan Plate</Text>
                            <Text style={styles.cameraTriggerSubtext}>Position vehicle plate in frame</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Search Mode Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, searchMode === 'PLATE' && styles.tabActive]}
                        onPress={() => setSearchMode('PLATE')}
                    >
                        <Icon name="car" size={16} color={searchMode === 'PLATE' ? '#FFFFFF' : '#6B7280'} />
                        <Text style={[styles.tabText, searchMode === 'PLATE' && styles.tabTextActive]}>
                            Plate Number
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, searchMode === 'LICENSE' && styles.tabActive]}
                        onPress={() => setSearchMode('LICENSE')}
                    >
                        <Icon name="id-card" size={16} color={searchMode === 'LICENSE' ? '#FFFFFF' : '#6B7280'} />
                        <Text style={[styles.tabText, searchMode === 'LICENSE' && styles.tabTextActive]}>
                            License Number
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Manual Search Input */}
                <View style={styles.searchSection}>
                    <View style={styles.inputWrapper}>
                        <Icon name="search" size={18} color="#6B7280" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={searchMode === 'PLATE' ? 'Enter plate number (e.g., BJL-4523)' : 'Enter license number'}
                            placeholderTextColor="#6B7280"
                            value={searchValue}
                            onChangeText={setSearchValue}
                            autoCapitalize="characters"
                        />
                        {searchValue.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchValue('')}>
                                <Icon name="times-circle" size={18} color="#6B7280" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[styles.searchButton, !searchValue.trim() && styles.searchButtonDisabled]}
                        onPress={handleSearch}
                        disabled={!searchValue.trim() || isSearching}
                    >
                        {isSearching ? (
                            <Text style={styles.searchButtonText}>Searching...</Text>
                        ) : (
                            <>
                                <Icon name="search" size={16} color="#FFFFFF" />
                                <Text style={styles.searchButtonText}>SEARCH</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Search Result */}
                {searchResult && (
                    <View style={styles.resultSection}>
                        {/* Status Header */}
                        <View style={[styles.resultHeader, { backgroundColor: getStatusColor(searchResult.status) }]}>
                            <Icon name={getStatusIcon(searchResult.status)} size={24} color="#FFFFFF" />
                            <Text style={styles.resultStatusText}>
                                {searchResult.status === 'CLEAR' ? 'Vehicle Clear' :
                                    searchResult.status === 'WARNING' ? 'Warning Found' : 'Alert - Action Required'}
                            </Text>
                        </View>

                        {/* Result Details */}
                        <View style={styles.resultCard}>
                            {/* Plate/Owner Info */}
                            <View style={styles.resultRow}>
                                <View style={styles.resultItem}>
                                    <Text style={styles.resultLabel}>PLATE</Text>
                                    <Text style={styles.resultValue}>{searchResult.plateNumber}</Text>
                                </View>
                                <View style={styles.resultItem}>
                                    <Text style={styles.resultLabel}>OWNER</Text>
                                    <Text style={styles.resultValue}>{searchResult.owner}</Text>
                                </View>
                            </View>

                            {/* Vehicle Info */}
                            <View style={styles.resultRow}>
                                <View style={styles.resultItem}>
                                    <Text style={styles.resultLabel}>VEHICLE</Text>
                                    <Text style={styles.resultValue}>
                                        {searchResult.year} {searchResult.make} {searchResult.model}
                                    </Text>
                                </View>
                                <View style={styles.resultItem}>
                                    <Text style={styles.resultLabel}>COLOR</Text>
                                    <Text style={styles.resultValue}>{searchResult.color}</Text>
                                </View>
                            </View>

                            {/* Expiry Dates */}
                            <View style={styles.resultRow}>
                                <View style={styles.resultItem}>
                                    <Text style={styles.resultLabel}>REGISTRATION</Text>
                                    <Text style={[styles.resultValue, searchResult.status === 'WARNING' && styles.warningText]}>
                                        {searchResult.registrationExpiry}
                                    </Text>
                                </View>
                                <View style={styles.resultItem}>
                                    <Text style={styles.resultLabel}>INSURANCE</Text>
                                    <Text style={styles.resultValue}>{searchResult.insuranceExpiry}</Text>
                                </View>
                            </View>

                            {/* Alerts */}
                            {searchResult.alerts.length > 0 && (
                                <View style={styles.alertsSection}>
                                    <Text style={styles.alertsTitle}>Alerts</Text>
                                    {searchResult.alerts.map((alert, index) => (
                                        <View key={index} style={styles.alertItem}>
                                            <Icon name="exclamation-circle" size={14} color={colors.status.warning} />
                                            <Text style={styles.alertText}>{alert}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.actionButton}>
                                <Icon name="file-alt" size={18} color={colors.primary} />
                                <Text style={styles.actionButtonText}>Issue Ticket</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButtonPrimary}>
                                <Icon name="database" size={18} color="#FFFFFF" />
                                <Text style={styles.actionButtonTextPrimary}>Full Check</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.dark,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.background.dark,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    historyButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    content: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },

    // Scanner Section
    scannerSection: {
        backgroundColor: '#1F2937',
        marginHorizontal: 16,
        marginTop: 20,
        borderRadius: 16,
        overflow: 'hidden',
    },
    cameraPreview: {
        height: 180,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111827',
    },
    scanFrame: {
        width: 240,
        height: 80,
        position: 'relative',
    },
    scanCorner: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderColor: colors.primary,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 3,
        borderLeftWidth: 3,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 3,
        borderRightWidth: 3,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 3,
        borderRightWidth: 3,
    },
    scanningText: {
        color: colors.primary,
        marginTop: 16,
        fontWeight: '600',
    },
    cameraTrigger: {
        height: 180,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraTriggerText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
    },
    cameraTriggerSubtext: {
        color: '#6B7280',
        fontSize: 12,
        marginTop: 4,
    },

    // Tabs
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 20,
        gap: 8,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        gap: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    tabActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    tabTextActive: {
        color: '#FFFFFF',
    },

    // Search Section
    searchSection: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 14,
        marginBottom: 12,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: '#111827',
    },
    searchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    searchButtonDisabled: {
        backgroundColor: '#9CA3AF',
    },
    searchButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },

    // Result Section
    resultSection: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 32,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 10,
        marginBottom: 12,
    },
    resultStatusText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    resultRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    resultItem: {
        flex: 1,
    },
    resultLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#9CA3AF',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    resultValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    warningText: {
        color: colors.status.warning,
    },
    alertsSection: {
        backgroundColor: '#FEF3C7',
        borderRadius: 10,
        padding: 12,
        marginTop: 4,
    },
    alertsTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#92400E',
        marginBottom: 8,
    },
    alertItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    alertText: {
        fontSize: 13,
        color: '#92400E',
        flex: 1,
    },

    // Action Buttons
    actionButtons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 16,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.primary,
        gap: 8,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
    },
    actionButtonPrimary: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    actionButtonTextPrimary: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default TrafficOpsScreen;
