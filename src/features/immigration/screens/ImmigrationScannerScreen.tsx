/**
 * E-GOV-GUARDS-PORTAL - Immigration Scanner Screen
 * Screen 9: Passport/ID Document Scanner
 * 
 * Features:
 * - Camera viewfinder for document scanning
 * - QR code scanning capability
 * - Digital passport result card
 * - Visa status verification
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../../config/colors';
import { useNavigation } from '@react-navigation/native';

type ScanMode = 'PASSPORT' | 'ID' | 'VISA' | 'QR';
type VerificationStatus = 'VALID' | 'EXPIRED' | 'FLAGGED' | 'PENDING';

interface ScanResult {
    type: 'passport' | 'id';
    name: string;
    nationality: string;
    documentNumber: string;
    dateOfBirth: string;
    expiryDate: string;
    status: VerificationStatus;
    visaStatus?: string;
    alerts?: string[];
    photo?: string;
}

const MOCK_RESULT: ScanResult = {
    type: 'passport',
    name: 'AMADOU SOWE',
    nationality: 'GAMBIA',
    documentNumber: 'P00123456',
    dateOfBirth: '15/03/1985',
    expiryDate: '22/08/2028',
    status: 'VALID',
    visaStatus: 'Tourist Visa - 30 Days',
};

const ImmigrationScannerScreen: React.FC = () => {
    const navigation = useNavigation();
    const [scanMode, setScanMode] = useState<ScanMode>('PASSPORT');
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);

    const handleScan = () => {
        setIsScanning(true);
        // Simulate scanning
        setTimeout(() => {
            setIsScanning(false);
            setScanResult(MOCK_RESULT);
        }, 2000);
    };

    const handleClearResult = () => {
        setScanResult(null);
    };

    const getStatusColor = (status: VerificationStatus) => {
        switch (status) {
            case 'VALID': return colors.status.success;
            case 'EXPIRED': return colors.status.error;
            case 'FLAGGED': return colors.status.warning;
            case 'PENDING': return colors.status.info;
        }
    };

    const getStatusIcon = (status: VerificationStatus) => {
        switch (status) {
            case 'VALID': return 'check-circle';
            case 'EXPIRED': return 'times-circle';
            case 'FLAGGED': return 'exclamation-triangle';
            case 'PENDING': return 'clock';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.agency.immigration.primary} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="chevron-left" size={18} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Icon name="passport" size={20} color="#FFFFFF" />
                    <Text style={styles.headerTitle}>Immigration Scanner</Text>
                </View>
                <TouchableOpacity style={styles.historyButton}>
                    <Icon name="history" size={18} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Scan Mode Tabs */}
            <View style={styles.modeContainer}>
                {(['PASSPORT', 'ID', 'VISA', 'QR'] as ScanMode[]).map((mode) => (
                    <TouchableOpacity
                        key={mode}
                        style={[styles.modeButton, scanMode === mode && styles.modeButtonActive]}
                        onPress={() => setScanMode(mode)}
                    >
                        <Icon
                            name={
                                mode === 'PASSPORT' ? 'passport' :
                                    mode === 'ID' ? 'id-card' :
                                        mode === 'VISA' ? 'stamp' : 'qrcode'
                            }
                            size={14}
                            color={scanMode === mode ? '#FFFFFF' : 'rgba(255,255,255,0.6)'}
                        />
                        <Text style={[styles.modeText, scanMode === mode && styles.modeTextActive]}>
                            {mode}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {!scanResult ? (
                    // Scanner View
                    <View style={styles.scannerContainer}>
                        <View style={styles.viewfinder}>
                            <View style={styles.viewfinderFrame}>
                                <View style={[styles.corner, styles.topLeft]} />
                                <View style={[styles.corner, styles.topRight]} />
                                <View style={[styles.corner, styles.bottomLeft]} />
                                <View style={[styles.corner, styles.bottomRight]} />

                                {isScanning && (
                                    <View style={styles.scanLine} />
                                )}
                            </View>

                            <Text style={styles.scanInstructions}>
                                {isScanning
                                    ? 'Scanning document...'
                                    : `Position ${scanMode.toLowerCase()} within the frame`}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.scanButton, isScanning && styles.scanButtonActive]}
                            onPress={handleScan}
                            disabled={isScanning}
                        >
                            <Icon name={isScanning ? 'spinner' : 'camera'} size={24} color="#FFFFFF" />
                            <Text style={styles.scanButtonText}>
                                {isScanning ? 'Scanning...' : 'TAP TO SCAN'}
                            </Text>
                        </TouchableOpacity>

                        {/* Manual Entry */}
                        <TouchableOpacity style={styles.manualButton}>
                            <Icon name="keyboard" size={16} color={colors.primary} />
                            <Text style={styles.manualButtonText}>Enter Manually</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    // Result View
                    <View style={styles.resultContainer}>
                        {/* Status Banner */}
                        <View style={[styles.statusBanner, { backgroundColor: getStatusColor(scanResult.status) }]}>
                            <Icon name={getStatusIcon(scanResult.status)} size={24} color="#FFFFFF" />
                            <Text style={styles.statusText}>Document {scanResult.status}</Text>
                        </View>

                        {/* Document Card */}
                        <View style={styles.documentCard}>
                            {/* Document Header */}
                            <View style={styles.documentHeader}>
                                <View style={styles.flagContainer}>
                                    <View style={styles.flag}>
                                        <View style={[styles.flagStripe, { backgroundColor: '#CE1126' }]} />
                                        <View style={[styles.flagStripe, { backgroundColor: '#0C1C8C' }]} />
                                        <View style={[styles.flagStripe, { backgroundColor: '#3A7728' }]} />
                                    </View>
                                </View>
                                <View style={styles.documentType}>
                                    <Text style={styles.documentTypeLabel}>
                                        {scanResult.type === 'passport' ? 'PASSPORT' : 'NATIONAL ID'}
                                    </Text>
                                    <Text style={styles.documentCountry}>{scanResult.nationality}</Text>
                                </View>
                            </View>

                            {/* Photo & Details */}
                            <View style={styles.documentBody}>
                                <View style={styles.photoPlaceholder}>
                                    <Icon name="user" size={40} color="#9CA3AF" />
                                </View>
                                <View style={styles.documentDetails}>
                                    <Text style={styles.holderName}>{scanResult.name}</Text>

                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Document No.</Text>
                                        <Text style={styles.detailValue}>{scanResult.documentNumber}</Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Date of Birth</Text>
                                        <Text style={styles.detailValue}>{scanResult.dateOfBirth}</Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Expiry Date</Text>
                                        <Text style={styles.detailValue}>{scanResult.expiryDate}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Visa Status */}
                            {scanResult.visaStatus && (
                                <View style={styles.visaSection}>
                                    <Icon name="stamp" size={14} color={colors.primary} />
                                    <Text style={styles.visaText}>{scanResult.visaStatus}</Text>
                                </View>
                            )}

                            {/* MRZ Zone */}
                            <View style={styles.mrzZone}>
                                <Text style={styles.mrzText}>P&lt;GMB{scanResult.name.replace(' ', '&lt;&lt;')}&lt;&lt;&lt;&lt;&lt;&lt;&lt;</Text>
                                <Text style={styles.mrzText}>{scanResult.documentNumber}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.actionButton} onPress={handleClearResult}>
                                <Icon name="redo" size={16} color={colors.primary} />
                                <Text style={styles.actionButtonText}>Scan Again</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButtonPrimary}>
                                <Icon name="database" size={16} color="#FFFFFF" />
                                <Text style={styles.actionButtonTextPrimary}>Full Check</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Quick Actions */}
                        <View style={styles.quickActions}>
                            <TouchableOpacity style={styles.quickAction}>
                                <Icon name="stamp" size={18} color="#6B7280" />
                                <Text style={styles.quickActionText}>Entry Stamp</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.quickAction}>
                                <Icon name="file-alt" size={18} color="#6B7280" />
                                <Text style={styles.quickActionText}>Report Issue</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.quickAction}>
                                <Icon name="user-lock" size={18} color="#6B7280" />
                                <Text style={styles.quickActionText}>Flag for Review</Text>
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
        backgroundColor: colors.agency.immigration.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
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
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Mode Tabs
    modeContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 8,
        marginBottom: 16,
    },
    modeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        gap: 6,
    },
    modeButtonActive: {
        backgroundColor: colors.agency.immigration.secondary,
    },
    modeText: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.6)',
    },
    modeTextActive: {
        color: '#FFFFFF',
    },

    // Content
    content: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },

    // Scanner
    scannerContainer: {
        padding: 20,
        alignItems: 'center',
    },
    viewfinder: {
        width: '100%',
        aspectRatio: 1.5,
        backgroundColor: '#1F2937',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginBottom: 24,
    },
    viewfinderFrame: {
        width: '80%',
        aspectRatio: 1.4,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderColor: colors.agency.immigration.primary,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderTopLeftRadius: 4,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderTopRightRadius: 4,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderBottomLeftRadius: 4,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 3,
        borderRightWidth: 3,
        borderBottomRightRadius: 4,
    },
    scanLine: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: colors.agency.immigration.secondary,
    },
    scanInstructions: {
        position: 'absolute',
        bottom: 20,
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
    },
    scanButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.agency.immigration.primary,
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 12,
        gap: 12,
        marginBottom: 16,
    },
    scanButtonActive: {
        backgroundColor: colors.agency.immigration.secondary,
    },
    scanButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    manualButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
    },
    manualButtonText: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
    },

    // Result
    resultContainer: {
        padding: 16,
    },
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 10,
        marginBottom: 16,
    },
    statusText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    // Document Card
    documentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    documentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    flagContainer: {
        marginRight: 12,
    },
    flag: {
        width: 32,
        height: 22,
        borderRadius: 3,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    flagStripe: {
        height: '33.33%',
    },
    documentType: {},
    documentTypeLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primary,
        letterSpacing: 1,
    },
    documentCountry: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    documentBody: {
        flexDirection: 'row',
        padding: 16,
    },
    photoPlaceholder: {
        width: 80,
        height: 100,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    documentDetails: {
        flex: 1,
    },
    holderName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    detailLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    detailValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
    },
    visaSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#EFF6FF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        gap: 8,
    },
    visaText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.primary,
    },
    mrzZone: {
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    mrzText: {
        fontFamily: 'monospace',
        fontSize: 11,
        color: '#374151',
        letterSpacing: 1,
    },

    // Actions
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
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
    quickActions: {
        flexDirection: 'row',
        gap: 12,
    },
    quickAction: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    quickActionText: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
        marginTop: 6,
        textAlign: 'center',
    },
});

export default ImmigrationScannerScreen;
