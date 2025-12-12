/**
 * E-GOV-GUARDS-PORTAL - Issue Ticket Screen
 * Screen 5: E-Ticket Issuance
 * 
 * Features:
 * - Violation type selector
 * - Driver/Vehicle information form
 * - Fine calculation
 * - Evidence (photo) upload
 * - QR code generation for ticket
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
    Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../../config/colors';
import { useNavigation } from '@react-navigation/native';

interface Violation {
    id: string;
    code: string;
    description: string;
    baseFine: number;
}

const VIOLATIONS: Violation[] = [
    { id: '1', code: 'SPD-01', description: 'Speeding (1-15 mph over)', baseFine: 150 },
    { id: '2', code: 'SPD-02', description: 'Speeding (16-25 mph over)', baseFine: 300 },
    { id: '3', code: 'SPD-03', description: 'Speeding (26+ mph over)', baseFine: 500 },
    { id: '4', code: 'STP-01', description: 'Running a stop sign', baseFine: 200 },
    { id: '5', code: 'SIG-01', description: 'Running a red light', baseFine: 350 },
    { id: '6', code: 'REG-01', description: 'Expired registration', baseFine: 250 },
    { id: '7', code: 'INS-01', description: 'No valid insurance', baseFine: 400 },
    { id: '8', code: 'LIC-01', description: 'Driving without license', baseFine: 500 },
];

const IssueTicketScreen: React.FC = () => {
    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedViolations, setSelectedViolations] = useState<string[]>([]);

    // Driver info
    const [driverName, setDriverName] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [plateNumber, setPlateNumber] = useState('');
    const [vehicleMake, setVehicleMake] = useState('');
    const [vehicleColor, setVehicleColor] = useState('');

    // Options
    const [courtAppearance, setCourtAppearance] = useState(false);
    const [photoEvidence, setPhotoEvidence] = useState(false);

    const toggleViolation = (id: string) => {
        setSelectedViolations(prev =>
            prev.includes(id)
                ? prev.filter(v => v !== id)
                : [...prev, id]
        );
    };

    const calculateTotal = () => {
        return selectedViolations.reduce((total, id) => {
            const violation = VIOLATIONS.find(v => v.id === id);
            return total + (violation?.baseFine || 0);
        }, 0);
    };

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
        else navigation.goBack();
    };

    const handleIssueTicket = () => {
        // Issue ticket and navigate to success
        // navigation.navigate('Success', { ... });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Icon name="chevron-left" size={18} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Issue E-Ticket</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${(currentStep / 4) * 100}%` }]} />
                </View>
                <Text style={styles.progressText}>Step {currentStep} of 4</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Step 1: Select Violations */}
                {currentStep === 1 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Select Violations</Text>
                        <Text style={styles.stepSubtitle}>Choose all applicable violations</Text>

                        {VIOLATIONS.map((violation) => {
                            const isSelected = selectedViolations.includes(violation.id);
                            return (
                                <TouchableOpacity
                                    key={violation.id}
                                    style={[styles.violationCard, isSelected && styles.violationCardSelected]}
                                    onPress={() => toggleViolation(violation.id)}
                                >
                                    <View style={styles.violationInfo}>
                                        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                                            {isSelected && <Icon name="check" size={12} color="#FFFFFF" />}
                                        </View>
                                        <View style={styles.violationDetails}>
                                            <Text style={styles.violationCode}>{violation.code}</Text>
                                            <Text style={styles.violationDesc}>{violation.description}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.violationFine}>D{violation.baseFine}</Text>
                                </TouchableOpacity>
                            );
                        })}

                        {selectedViolations.length > 0 && (
                            <View style={styles.totalContainer}>
                                <Text style={styles.totalLabel}>Estimated Total Fine</Text>
                                <Text style={styles.totalAmount}>D{calculateTotal()}</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Step 2: Driver Information */}
                {currentStep === 2 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Driver Information</Text>
                        <Text style={styles.stepSubtitle}>Enter driver and license details</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Driver Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Full name as on license"
                                placeholderTextColor="#9CA3AF"
                                value={driverName}
                                onChangeText={setDriverName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>License Number</Text>
                            <View style={styles.inputWithIcon}>
                                <TextInput
                                    style={styles.inputFlex}
                                    placeholder="Enter license number"
                                    placeholderTextColor="#9CA3AF"
                                    value={licenseNumber}
                                    onChangeText={setLicenseNumber}
                                    autoCapitalize="characters"
                                />
                                <TouchableOpacity style={styles.scanButton}>
                                    <Icon name="camera" size={16} color={colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* Step 3: Vehicle Information */}
                {currentStep === 3 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Vehicle Information</Text>
                        <Text style={styles.stepSubtitle}>Enter vehicle details</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Plate Number</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., BJL-4523"
                                placeholderTextColor="#9CA3AF"
                                value={plateNumber}
                                onChangeText={setPlateNumber}
                                autoCapitalize="characters"
                            />
                        </View>

                        <View style={styles.inputRow}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.inputLabel}>Make/Model</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g., Toyota Corolla"
                                    placeholderTextColor="#9CA3AF"
                                    value={vehicleMake}
                                    onChangeText={setVehicleMake}
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 0.6 }]}>
                                <Text style={styles.inputLabel}>Color</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g., Silver"
                                    placeholderTextColor="#9CA3AF"
                                    value={vehicleColor}
                                    onChangeText={setVehicleColor}
                                />
                            </View>
                        </View>

                        <View style={styles.optionRow}>
                            <View style={styles.optionInfo}>
                                <Icon name="camera" size={18} color={colors.primary} />
                                <Text style={styles.optionText}>Add photo evidence</Text>
                            </View>
                            <Switch
                                value={photoEvidence}
                                onValueChange={setPhotoEvidence}
                                trackColor={{ false: '#D1D5DB', true: colors.primary }}
                                thumbColor="#FFFFFF"
                            />
                        </View>
                    </View>
                )}

                {/* Step 4: Review & Issue */}
                {currentStep === 4 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Review Ticket</Text>
                        <Text style={styles.stepSubtitle}>Confirm all details before issuing</Text>

                        {/* Ticket Preview */}
                        <View style={styles.ticketPreview}>
                            <View style={styles.ticketHeader}>
                                <Icon name="shield-alt" size={24} color={colors.primary} />
                                <Text style={styles.ticketHeaderText}>E-GOV Traffic Citation</Text>
                            </View>

                            <View style={styles.ticketSection}>
                                <Text style={styles.ticketSectionTitle}>Violations</Text>
                                {selectedViolations.map(id => {
                                    const v = VIOLATIONS.find(v => v.id === id);
                                    return v ? (
                                        <View key={id} style={styles.ticketRow}>
                                            <Text style={styles.ticketLabel}>{v.code}</Text>
                                            <Text style={styles.ticketValue}>D{v.baseFine}</Text>
                                        </View>
                                    ) : null;
                                })}
                            </View>

                            <View style={styles.ticketSection}>
                                <Text style={styles.ticketSectionTitle}>Driver</Text>
                                <Text style={styles.ticketDetail}>{driverName || 'Not specified'}</Text>
                                <Text style={styles.ticketDetail}>License: {licenseNumber || 'N/A'}</Text>
                            </View>

                            <View style={styles.ticketSection}>
                                <Text style={styles.ticketSectionTitle}>Vehicle</Text>
                                <Text style={styles.ticketDetail}>{plateNumber} - {vehicleMake} ({vehicleColor})</Text>
                            </View>

                            <View style={styles.ticketTotal}>
                                <Text style={styles.ticketTotalLabel}>TOTAL FINE</Text>
                                <Text style={styles.ticketTotalAmount}>D{calculateTotal()}</Text>
                            </View>
                        </View>

                        <View style={styles.optionRow}>
                            <View style={styles.optionInfo}>
                                <Icon name="gavel" size={18} color={colors.status.warning} />
                                <Text style={styles.optionText}>Require court appearance</Text>
                            </View>
                            <Switch
                                value={courtAppearance}
                                onValueChange={setCourtAppearance}
                                trackColor={{ false: '#D1D5DB', true: colors.status.warning }}
                                thumbColor="#FFFFFF"
                            />
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Footer Actions */}
            <View style={styles.footer}>
                {currentStep < 4 ? (
                    <TouchableOpacity
                        style={[styles.nextButton, selectedViolations.length === 0 && currentStep === 1 && styles.buttonDisabled]}
                        onPress={handleNext}
                        disabled={selectedViolations.length === 0 && currentStep === 1}
                    >
                        <Text style={styles.nextButtonText}>Continue</Text>
                        <Icon name="arrow-right" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.issueButton} onPress={handleIssueTicket}>
                        <Icon name="file-invoice" size={18} color="#FFFFFF" />
                        <Text style={styles.issueButtonText}>ISSUE E-TICKET</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.dark,
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
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    placeholder: {
        width: 40,
    },

    // Progress
    progressContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    progressBar: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.accent,
        borderRadius: 2,
    },
    progressText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 8,
        textAlign: 'center',
    },

    // Content
    content: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 16,
    },
    stepContainer: {
        paddingBottom: 24,
    },
    stepTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    stepSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 20,
    },

    // Violations
    violationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    violationCardSelected: {
        borderColor: colors.primary,
        backgroundColor: '#EFF6FF',
    },
    violationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    checkboxSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    violationDetails: {
        flex: 1,
    },
    violationCode: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 2,
    },
    violationDesc: {
        fontSize: 14,
        color: '#374151',
    },
    violationFine: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    totalContainer: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    // Inputs
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#111827',
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    inputFlex: {
        flex: 1,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#111827',
    },
    scanButton: {
        padding: 14,
        backgroundColor: '#F3F4F6',
    },
    inputRow: {
        flexDirection: 'row',
        gap: 12,
    },

    // Options
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        marginTop: 12,
    },
    optionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    optionText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },

    // Ticket Preview
    ticketPreview: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    ticketHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        gap: 8,
    },
    ticketHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
    ticketSection: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    ticketSectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#9CA3AF',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    ticketRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    ticketLabel: {
        fontSize: 13,
        color: '#374151',
    },
    ticketValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#111827',
    },
    ticketDetail: {
        fontSize: 14,
        color: '#374151',
        marginTop: 2,
    },
    ticketTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        marginTop: 8,
    },
    ticketTotalLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#374151',
    },
    ticketTotalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.status.error,
    },

    // Footer
    footer: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 10,
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    buttonDisabled: {
        backgroundColor: '#9CA3AF',
    },
    issueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.status.success,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 10,
    },
    issueButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
});

export default IssueTicketScreen;
