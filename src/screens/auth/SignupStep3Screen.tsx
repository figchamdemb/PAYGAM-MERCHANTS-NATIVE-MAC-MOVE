import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Modal,
    FlatList,
} from 'react-native';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList, RegistrationData } from '../../navigation/types';

type SignupStep3ScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignupStep3'>;
type SignupStep3ScreenRouteProp = RouteProp<AuthStackParamList, 'SignupStep3'>;

const SignupStep3Screen: React.FC = () => {
    const navigation = useNavigation<SignupStep3ScreenNavigationProp>();
    const route = useRoute<SignupStep3ScreenRouteProp>();
    const { theme, isDarkMode } = useTheme();
    const existingData = route.params?.registrationData || {};
    
    // Profile/Extended Information fields
    const [nextOfKinPhone, setNextOfKinPhone] = useState(existingData.nextOfKinPhone || '');
    const [nextOfKinEmail, setNextOfKinEmail] = useState(existingData.nextOfKinEmail || '');
    const [address, setAddress] = useState(existingData.address || '');
    const [district, setDistrict] = useState(existingData.district || '');
    const [region, setRegion] = useState(existingData.region || '');
    const [postalCode, setPostalCode] = useState(existingData.postalCode || '');
    const [employerName, setEmployerName] = useState(existingData.employerName || '');
    const [employmentStatus, setEmploymentStatus] = useState(existingData.employmentStatus || '');
    const [showEmploymentDropdown, setShowEmploymentDropdown] = useState(false);
    
    // Employment status options
    const employmentOptions = [
        { label: 'Employed (Full-time)', value: 'employed_fulltime' },
        { label: 'Employed (Part-time)', value: 'employed_parttime' },
        { label: 'Self-Employed', value: 'self_employed' },
        { label: 'Business Owner', value: 'business_owner' },
        { label: 'Unemployed', value: 'unemployed' },
        { label: 'Student', value: 'student' },
        { label: 'Retired', value: 'retired' },
        { label: 'Homemaker', value: 'homemaker' },
        { label: 'Other', value: 'other' },
    ];

    const handleNext = () => {
        // Validate required fields
        if (!nextOfKinPhone.trim()) {
            Alert.alert('Required Field', 'Please enter next of kin phone number');
            return;
        }
        if (!district.trim()) {
            Alert.alert('Required Field', 'Please enter your district');
            return;
        }
        if (!region.trim()) {
            Alert.alert('Required Field', 'Please enter your region');
            return;
        }

        console.log('[SignupStep3] Proceeding to Step 4 with profile data');
        
        // Navigate to Step 4 (Address) with combined data
        const updatedData: RegistrationData = {
            ...existingData,
            nextOfKinPhone,
            nextOfKinEmail,
            address,
            district,
            region,
            postalCode,
            employerName,
            employmentStatus,
        };
        
        navigation.navigate('SignupStep4', { registrationData: updatedData });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    // Icons
    const ArrowLeftIcon = () => (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M19 12H5M12 19l-7-7 7-7" />
        </Svg>
    );

    const ShieldIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="#B45309">
            <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </Svg>
    );

    const CheckIcon = () => (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M20 6L9 17l-5-5" />
        </Svg>
    );

    const CalendarIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <Path d="M16 2v4M8 2v4M3 10h18" />
        </Svg>
    );

    const IdCardIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Rect width="20" height="14" x="2" y="5" rx="2" />
            <Path d="M8 11h1M8 15h1" />
        </Svg>
    );

    const HashIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />
        </Svg>
    );

    const BriefcaseIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <Path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </Svg>
    );

    const ClockIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="12" r="10" />
            <Path d="M12 6v6l4 2" />
        </Svg>
    );

    const MapPinIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <Circle cx="12" cy="10" r="3" />
        </Svg>
    );

    const ChevronDownIcon = () => (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M6 9l6 6 6-6" />
        </Svg>
    );

    const ArrowRightIcon = () => (
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M5 12h14M12 5l7 7-7 7" />
        </Svg>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <ArrowLeftIcon />
                    </TouchableOpacity>
                    <View style={styles.headerBrand}>
                        <View style={styles.logo}>
                            <ShieldIcon />
                        </View>
                        <Text style={styles.headerTitle}>EGOV-CITIZEN</Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <Text style={styles.helpButton}>Help</Text>
                </TouchableOpacity>
            </View>

            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent}>

                        {/* Progress Stepper */}
                        <View style={styles.progressSection}>
                            <View style={styles.progressRow}>
                                {/* Step 1 - Done */}
                                <View style={styles.stepContainer}>
                                    <View style={[styles.stepCircle, styles.stepCircleDone]}>
                                        <CheckIcon />
                                    </View>
                                    <Text style={[styles.stepLabel, styles.stepLabelActive]}>Account</Text>
                                </View>
                                <View style={[styles.progressLine, styles.progressLineActive]} />

                                {/* Step 2 - Done */}
                                <View style={styles.stepContainer}>
                                    <View style={[styles.stepCircle, styles.stepCircleDone]}>
                                        <CheckIcon />
                                    </View>
                                    <Text style={[styles.stepLabel, styles.stepLabelActive]}>Verify</Text>
                                </View>
                                <View style={[styles.progressLine, styles.progressLineActive]} />

                                {/* Step 3 - Done */}
                                <View style={styles.stepContainer}>
                                    <View style={[styles.stepCircle, styles.stepCircleDone]}>
                                        <CheckIcon />
                                    </View>
                                    <Text style={[styles.stepLabel, styles.stepLabelActive]}>Personal</Text>
                                </View>
                                <View style={[styles.progressLine, styles.progressLineActive]} />

                                {/* Step 4 - Active */}
                                <View style={styles.stepContainer}>
                                    <View style={[styles.stepCircle, styles.stepCircleActive]}>
                                        <Text style={styles.stepNumberActive}>4</Text>
                                    </View>
                                    <Text style={[styles.stepLabel, styles.stepLabelBold]}>Profile</Text>
                                </View>
                                <View style={styles.progressLine} />

                                {/* Step 5 - Pending */}
                                <View style={styles.stepContainer}>
                                    <View style={styles.stepCircle}>
                                        <Text style={styles.stepNumber}>5</Text>
                                    </View>
                                    <Text style={styles.stepLabel}>Address</Text>
                                </View>
                            </View>
                        </View>

                        {/* Form Card */}
                        <View style={styles.card}>
                            {/* Card Header */}
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Profile Information</Text>
                                <Text style={styles.cardSubtitle}>Contact and employment details.</Text>
                            </View>

                            {/* Form */}
                            <View style={styles.form}>
                                {/* Next of Kin Phone */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>
                                        Next of Kin Phone <Text style={styles.required}>*</Text>
                                    </Text>
                                    <View style={styles.inputWithIcon}>
                                        <View style={styles.inputIcon}>
                                            <MapPinIcon />
                                        </View>
                                        <TextInput
                                            style={styles.inputField}
                                            placeholder="+220 XXXXXXX"
                                            placeholderTextColor="#9CA3AF"
                                            keyboardType="phone-pad"
                                            value={nextOfKinPhone}
                                            onChangeText={setNextOfKinPhone}
                                        />
                                    </View>
                                </View>

                                {/* Next of Kin Email */}
                                <View style={styles.inputGroup}>
                                    <View style={styles.labelRow}>
                                        <Text style={styles.label}>Next of Kin Email</Text>
                                        <Text style={styles.optional}>Optional</Text>
                                    </View>
                                    <View style={styles.inputWithIcon}>
                                        <View style={styles.inputIcon}>
                                            <MapPinIcon />
                                        </View>
                                        <TextInput
                                            style={styles.inputField}
                                            placeholder="email@example.com"
                                            placeholderTextColor="#9CA3AF"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            value={nextOfKinEmail}
                                            onChangeText={setNextOfKinEmail}
                                        />
                                    </View>
                                </View>

                                {/* Address */}
                                <View style={styles.inputGroup}>
                                    <View style={styles.labelRow}>
                                        <Text style={styles.label}>Address</Text>
                                        <Text style={styles.optional}>Optional</Text>
                                    </View>
                                    <View style={styles.inputWithIcon}>
                                        <View style={styles.inputIcon}>
                                            <MapPinIcon />
                                        </View>
                                        <TextInput
                                            style={styles.inputField}
                                            placeholder="Street address"
                                            placeholderTextColor="#9CA3AF"
                                            value={address}
                                            onChangeText={setAddress}
                                        />
                                    </View>
                                </View>

                                {/* District and Region */}
                                <View style={styles.row}>
                                    <View style={styles.halfWidth}>
                                        <Text style={styles.label}>
                                            District <Text style={styles.required}>*</Text>
                                        </Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="e.g. Kanifing"
                                            placeholderTextColor="#9CA3AF"
                                            value={district}
                                            onChangeText={setDistrict}
                                        />
                                    </View>
                                    <View style={styles.halfWidth}>
                                        <Text style={styles.label}>
                                            Region <Text style={styles.required}>*</Text>
                                        </Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="e.g. Greater Banjul"
                                            placeholderTextColor="#9CA3AF"
                                            value={region}
                                            onChangeText={setRegion}
                                        />
                                    </View>
                                </View>

                                {/* Postal Code */}
                                <View style={styles.inputGroup}>
                                    <View style={styles.labelRow}>
                                        <Text style={styles.label}>Postal Code</Text>
                                        <Text style={styles.optional}>Optional</Text>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. 00000"
                                        placeholderTextColor="#9CA3AF"
                                        value={postalCode}
                                        onChangeText={setPostalCode}
                                    />
                                </View>

                                {/* Employer Name */}
                                <View style={styles.inputGroup}>
                                    <View style={styles.labelRow}>
                                        <Text style={styles.label}>Employer Name</Text>
                                        <Text style={styles.optional}>Optional</Text>
                                    </View>
                                    <View style={styles.inputWithIcon}>
                                        <View style={styles.inputIcon}>
                                            <BriefcaseIcon />
                                        </View>
                                        <TextInput
                                            style={styles.inputField}
                                            placeholder="Company or organization"
                                            placeholderTextColor="#9CA3AF"
                                            value={employerName}
                                            onChangeText={setEmployerName}
                                        />
                                    </View>
                                </View>

                                {/* Employment Status */}
                                <View style={styles.inputGroup}>
                                    <View style={styles.labelRow}>
                                        <Text style={styles.label}>Employment Status</Text>
                                        <Text style={styles.optional}>Optional</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.inputWithIcon}
                                        onPress={() => setShowEmploymentDropdown(true)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.inputIcon}>
                                            <BriefcaseIcon />
                                        </View>
                                        <Text style={[styles.inputField, { paddingVertical: 14 }, !employmentStatus && { color: '#9CA3AF' }]}>
                                            {employmentOptions.find(opt => opt.value === employmentStatus)?.label || 'Select employment status'}
                                        </Text>
                                        <View style={styles.selectIcon}>
                                            <ChevronDownIcon />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                
                                {/* Employment Status Dropdown Modal */}
                                <Modal
                                    visible={showEmploymentDropdown}
                                    transparent={true}
                                    animationType="slide"
                                    onRequestClose={() => setShowEmploymentDropdown(false)}
                                >
                                    <TouchableOpacity 
                                        style={styles.modalOverlay}
                                        activeOpacity={1}
                                        onPress={() => setShowEmploymentDropdown(false)}
                                    >
                                        <View style={styles.dropdownModal}>
                                            <Text style={styles.dropdownTitle}>Select Employment Status</Text>
                                            <FlatList
                                                data={employmentOptions}
                                                keyExtractor={(item) => item.value}
                                                renderItem={({ item }) => (
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.dropdownItem,
                                                            employmentStatus === item.value && styles.dropdownItemSelected
                                                        ]}
                                                        onPress={() => {
                                                            setEmploymentStatus(item.value);
                                                            setShowEmploymentDropdown(false);
                                                        }}
                                                    >
                                                        <Text style={[
                                                            styles.dropdownItemText,
                                                            employmentStatus === item.value && styles.dropdownItemTextSelected
                                                        ]}>
                                                            {item.label}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                            />
                                            <TouchableOpacity
                                                style={styles.dropdownCloseBtn}
                                                onPress={() => setShowEmploymentDropdown(false)}
                                            >
                                                <Text style={styles.dropdownCloseBtnText}>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                </Modal>

                                {/* Action Buttons */}
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
                                        <Text style={styles.backBtnText}>Back</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                                        <Text style={styles.nextBtnText}>Next Step</Text>
                                        <ArrowRightIcon />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.footer}>© 2023 EGOV-CITIZEN. Secure Registration.</Text>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        backgroundColor: '#B45309',
        paddingVertical: 16,
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
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
        borderRadius: 20,
    },
    headerBrand: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logo: {
        width: 32,
        height: 32,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    helpButton: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        fontWeight: '500',
    },
    safeArea: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 16,
        paddingBottom: 32,
    },
    progressSection: {
        marginBottom: 32,
        marginTop: 8,
        paddingHorizontal: 8,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    stepContainer: {
        alignItems: 'center',
        gap: 4,
    },
    stepCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    stepCircleDone: {
        backgroundColor: '#B45309',
    },
    stepCircleActive: {
        backgroundColor: '#B45309',
        shadowColor: '#B45309',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 4,
        borderColor: 'rgba(180, 83, 9, 0.2)',
    },
    stepNumber: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
    },
    stepNumberActive: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    stepLabel: {
        fontSize: 10,
        fontWeight: '500',
        color: '#9CA3AF',
    },
    stepLabelActive: {
        color: '#B45309',
    },
    stepLabelBold: {
        color: '#B45309',
        fontWeight: '700',
    },
    progressLine: {
        height: 2,
        flex: 1,
        backgroundColor: '#D1D5DB',
        alignSelf: 'center',
        marginHorizontal: 4,
        borderRadius: 1,
    },
    progressLineActive: {
        backgroundColor: '#B45309',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        overflow: 'hidden',
    },
    cardHeader: {
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    form: {
        padding: 24,
        gap: 20,
    },
    inputGroup: {
        gap: 6,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    labelUpper: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 6,
    },
    required: {
        color: '#EF4444',
    },
    optional: {
        fontSize: 12,
        color: '#9CA3AF',
        fontStyle: 'italic',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: '#111827',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingLeft: 12,
        paddingRight: 12,
        height: 44,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    inputIcon: {
        marginRight: 8,
    },
    inputField: {
        flex: 1,
        fontSize: 14,
        color: '#111827',
    },
    selectIcon: {
        marginLeft: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    halfWidth: {
        flex: 1,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    backBtn: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    backBtnText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '600',
    },
    nextBtn: {
        flex: 1,
        backgroundColor: '#B45309',
        borderRadius: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#78350F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    nextBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        textAlign: 'center',
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 24,
        marginBottom: 16,
    },
    // Dropdown Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    dropdownModal: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '60%',
    },
    dropdownTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 16,
        textAlign: 'center',
    },
    dropdownItem: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 4,
    },
    dropdownItemSelected: {
        backgroundColor: '#FEF3C7',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#374151',
    },
    dropdownItemTextSelected: {
        color: '#B45309',
        fontWeight: '600',
    },
    dropdownCloseBtn: {
        marginTop: 12,
        paddingVertical: 14,
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        alignItems: 'center',
    },
    dropdownCloseBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
});

export default SignupStep3Screen;
