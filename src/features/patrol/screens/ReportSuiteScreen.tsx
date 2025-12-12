/**
 * E-GOV-GUARDS-PORTAL - Report Suite Screen
 * Screen 6: Incident Reporting
 * 
 * Features:
 * - Tab interface (Drafts/New Report/History)
 * - Step-by-step report form
 * - Evidence attachment (photos, audio)
 * - GPS location tagging
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
    FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../../config/colors';
import { useNavigation } from '@react-navigation/native';

type TabType = 'DRAFTS' | 'NEW' | 'HISTORY';
type ReportStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

interface Report {
    id: string;
    title: string;
    type: string;
    date: string;
    status: ReportStatus;
    location?: string;
}

const MOCK_REPORTS: Report[] = [
    { id: '1', title: 'Traffic Violation - Speeding', type: 'Traffic', date: 'Dec 9, 2024', status: 'SUBMITTED', location: 'Main St Junction' },
    { id: '2', title: 'Suspicious Activity Report', type: 'Patrol', date: 'Dec 8, 2024', status: 'APPROVED', location: 'Sector 4' },
    { id: '3', title: 'Vehicle Accident Report', type: 'Traffic', date: 'Dec 7, 2024', status: 'DRAFT', location: 'Highway 1' },
];

const REPORT_TYPES = [
    { id: 'traffic', label: 'Traffic Violation', icon: 'car', color: colors.agency.police.secondary },
    { id: 'incident', label: 'Incident Report', icon: 'exclamation-triangle', color: colors.status.warning },
    { id: 'arrest', label: 'Arrest Report', icon: 'user-lock', color: colors.status.error },
    { id: 'patrol', label: 'Patrol Log', icon: 'route', color: colors.primary },
    { id: 'evidence', label: 'Evidence Log', icon: 'camera', color: colors.status.info },
    { id: 'other', label: 'Other', icon: 'file-alt', color: '#6B7280' },
];

const ReportSuiteScreen: React.FC = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState<TabType>('NEW');
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(1);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');

    const getStatusColor = (status: ReportStatus) => {
        switch (status) {
            case 'DRAFT': return '#6B7280';
            case 'SUBMITTED': return colors.status.info;
            case 'APPROVED': return colors.status.success;
            case 'REJECTED': return colors.status.error;
        }
    };

    const handleStartReport = (typeId: string) => {
        setSelectedType(typeId);
        setCurrentStep(2);
    };

    const handleNextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            setSelectedType(null);
        }
    };

    const handleSubmit = () => {
        // Submit report
        setActiveTab('HISTORY');
        setSelectedType(null);
        setCurrentStep(1);
    };

    const renderReportCard = ({ item }: { item: Report }) => (
        <TouchableOpacity style={styles.reportCard}>
            <View style={styles.reportHeader}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
                <Text style={styles.reportDate}>{item.date}</Text>
            </View>
            <Text style={styles.reportTitle}>{item.title}</Text>
            <View style={styles.reportMeta}>
                <View style={styles.metaItem}>
                    <Icon name="tag" size={12} color="#6B7280" />
                    <Text style={styles.metaText}>{item.type}</Text>
                </View>
                {item.location && (
                    <View style={styles.metaItem}>
                        <Icon name="map-marker-alt" size={12} color="#6B7280" />
                        <Text style={styles.metaText}>{item.location}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Reports</Text>
                <TouchableOpacity style={styles.headerButton}>
                    <Icon name="filter" size={16} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                {(['DRAFTS', 'NEW', 'HISTORY'] as TabType[]).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.tabActive]}
                        onPress={() => { setActiveTab(tab); setSelectedType(null); setCurrentStep(1); }}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                            {tab === 'DRAFTS' ? 'Drafts' : tab === 'NEW' ? 'New Report' : 'History'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}
            <View style={styles.content}>
                {activeTab === 'NEW' && !selectedType ? (
                    // Report Type Selection
                    <ScrollView style={styles.typeGrid} showsVerticalScrollIndicator={false}>
                        <Text style={styles.sectionTitle}>Select Report Type</Text>
                        <View style={styles.typeContainer}>
                            {REPORT_TYPES.map((type) => (
                                <TouchableOpacity
                                    key={type.id}
                                    style={styles.typeCard}
                                    onPress={() => handleStartReport(type.id)}
                                >
                                    <View style={[styles.typeIcon, { backgroundColor: type.color + '20' }]}>
                                        <Icon name={type.icon} size={24} color={type.color} />
                                    </View>
                                    <Text style={styles.typeLabel}>{type.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                ) : activeTab === 'NEW' && selectedType ? (
                    // Report Form Stepper
                    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                        {/* Progress Steps */}
                        <View style={styles.stepper}>
                            {[1, 2, 3, 4].map((step) => (
                                <React.Fragment key={step}>
                                    <View style={[
                                        styles.stepCircle,
                                        currentStep >= step && styles.stepCircleActive
                                    ]}>
                                        {currentStep > step ? (
                                            <Icon name="check" size={12} color="#FFFFFF" />
                                        ) : (
                                            <Text style={[
                                                styles.stepNumber,
                                                currentStep >= step && styles.stepNumberActive
                                            ]}>{step}</Text>
                                        )}
                                    </View>
                                    {step < 4 && <View style={[
                                        styles.stepLine,
                                        currentStep > step && styles.stepLineActive
                                    ]} />}
                                </React.Fragment>
                            ))}
                        </View>

                        {/* Step Content */}
                        {currentStep === 1 && (
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Basic Information</Text>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Report Title</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter report title"
                                        placeholderTextColor="#6B7280"
                                        value={title}
                                        onChangeText={setTitle}
                                    />
                                </View>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Description</Text>
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        placeholder="Describe the incident..."
                                        placeholderTextColor="#6B7280"
                                        value={description}
                                        onChangeText={setDescription}
                                        multiline
                                        numberOfLines={4}
                                    />
                                </View>
                            </View>
                        )}

                        {currentStep === 2 && (
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Location</Text>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Location Address</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter location"
                                        placeholderTextColor="#6B7280"
                                        value={location}
                                        onChangeText={setLocation}
                                    />
                                </View>
                                <TouchableOpacity style={styles.gpsButton}>
                                    <Icon name="crosshairs" size={16} color={colors.primary} />
                                    <Text style={styles.gpsButtonText}>Use Current GPS Location</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {currentStep === 3 && (
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Evidence</Text>
                                <View style={styles.evidenceGrid}>
                                    <TouchableOpacity style={styles.evidenceButton}>
                                        <Icon name="camera" size={24} color={colors.primary} />
                                        <Text style={styles.evidenceText}>Photo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.evidenceButton}>
                                        <Icon name="video" size={24} color={colors.primary} />
                                        <Text style={styles.evidenceText}>Video</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.evidenceButton}>
                                        <Icon name="microphone" size={24} color={colors.primary} />
                                        <Text style={styles.evidenceText}>Audio</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.evidenceButton}>
                                        <Icon name="file-upload" size={24} color={colors.primary} />
                                        <Text style={styles.evidenceText}>File</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {currentStep === 4 && (
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Review & Submit</Text>
                                <View style={styles.reviewCard}>
                                    <View style={styles.reviewRow}>
                                        <Text style={styles.reviewLabel}>Title</Text>
                                        <Text style={styles.reviewValue}>{title || 'Not set'}</Text>
                                    </View>
                                    <View style={styles.reviewRow}>
                                        <Text style={styles.reviewLabel}>Location</Text>
                                        <Text style={styles.reviewValue}>{location || 'Not set'}</Text>
                                    </View>
                                    <View style={styles.reviewRow}>
                                        <Text style={styles.reviewLabel}>Type</Text>
                                        <Text style={styles.reviewValue}>
                                            {REPORT_TYPES.find(t => t.id === selectedType)?.label}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Navigation Buttons */}
                        <View style={styles.formActions}>
                            <TouchableOpacity style={styles.backButton} onPress={handlePrevStep}>
                                <Icon name="arrow-left" size={16} color="#6B7280" />
                                <Text style={styles.backButtonText}>Back</Text>
                            </TouchableOpacity>

                            {currentStep < 4 ? (
                                <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
                                    <Text style={styles.nextButtonText}>Next</Text>
                                    <Icon name="arrow-right" size={16} color="#FFFFFF" />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                    <Text style={styles.submitButtonText}>Submit Report</Text>
                                    <Icon name="check" size={16} color="#FFFFFF" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </ScrollView>
                ) : (
                    // Drafts or History List
                    <FlatList
                        data={MOCK_REPORTS.filter(r =>
                            activeTab === 'DRAFTS' ? r.status === 'DRAFT' : r.status !== 'DRAFT'
                        )}
                        renderItem={renderReportCard}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Icon name="file-alt" size={48} color="#D1D5DB" />
                                <Text style={styles.emptyText}>No reports found</Text>
                            </View>
                        }
                    />
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
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Tabs
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    tabActive: {
        backgroundColor: colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    tabTextActive: {
        color: '#FFFFFF',
    },

    // Content
    content: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },

    // Type Selection
    typeGrid: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    typeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    typeCard: {
        width: '47%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    typeIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    typeLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        textAlign: 'center',
    },

    // Form
    formContainer: {
        padding: 16,
    },
    stepper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    stepCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepCircleActive: {
        backgroundColor: colors.primary,
    },
    stepNumber: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#6B7280',
    },
    stepNumberActive: {
        color: '#FFFFFF',
    },
    stepLine: {
        width: 40,
        height: 2,
        backgroundColor: '#E5E7EB',
    },
    stepLineActive: {
        backgroundColor: colors.primary,
    },
    stepContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
    },
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
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#111827',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    gpsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EFF6FF',
        paddingVertical: 12,
        borderRadius: 10,
        gap: 8,
    },
    gpsButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
    },

    // Evidence
    evidenceGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    evidenceButton: {
        width: '47%',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingVertical: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    evidenceText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#6B7280',
        marginTop: 8,
    },

    // Review
    reviewCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
    },
    reviewRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    reviewLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    reviewValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },

    // Form Actions
    formActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    backButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 8,
    },
    backButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    nextButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    nextButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    submitButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.status.success,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    submitButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    // List
    listContent: {
        padding: 16,
    },
    reportCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    reportHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    reportDate: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    reportMeta: {
        flexDirection: 'row',
        gap: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#6B7280',
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#9CA3AF',
        marginTop: 12,
    },
});

export default ReportSuiteScreen;
