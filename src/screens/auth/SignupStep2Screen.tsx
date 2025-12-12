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
import DatePicker from 'react-native-date-picker';
import { useTheme } from '../../context/ThemeContext';
import { Svg, Path, Rect, Circle, Polyline } from 'react-native-svg';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList, RegistrationData } from '../../navigation/types';

type SignupStep2ScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignupStep2'>;
type SignupStep2ScreenRouteProp = RouteProp<AuthStackParamList, 'SignupStep2'>;

const SignupStep2Screen: React.FC = () => {
    const navigation = useNavigation<SignupStep2ScreenNavigationProp>();
    const route = useRoute<SignupStep2ScreenRouteProp>();
    const { theme, isDarkMode } = useTheme();
    const existingData = route.params?.registrationData || {};
    
    const [dateOfBirth, setDateOfBirth] = useState(existingData.dateOfBirth || '');
    const [nationalId, setNationalId] = useState(existingData.nationalId || '');
    const [tinNumber, setTinNumber] = useState(existingData.tinNumber || '');
    const [occupation, setOccupation] = useState(existingData.occupation || '');
    const [workingTime, setWorkingTime] = useState(existingData.workingTime || '');
    const [startTime, setStartTime] = useState(existingData.workingStartTime || '');
    const [endTime, setEndTime] = useState(existingData.workingEndTime || '');
    const [placeOfBirth, setPlaceOfBirth] = useState(existingData.placeOfBirth || '');
    
    // Date picker and dropdown states
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(2000, 0, 1));
    const [showWorkingTimeDropdown, setShowWorkingTimeDropdown] = useState(false);
    
    // Working time options
    const workingTimeOptions = [
        { label: '9:00 AM - 5:00 PM (Standard)', value: '9-5' },
        { label: '8:00 AM - 4:00 PM', value: '8-4' },
        { label: '6:00 AM - 2:00 PM (Morning Shift)', value: 'morning' },
        { label: '2:00 PM - 10:00 PM (Afternoon Shift)', value: 'afternoon' },
        { label: '10:00 PM - 6:00 AM (Night Shift)', value: 'night' },
        { label: 'Flexible Hours', value: 'flexible' },
        { label: 'Not Applicable', value: 'n/a' },
    ];

    const handleNext = () => {
        // Validate required fields
        if (!dateOfBirth.trim()) {
            Alert.alert('Required Field', 'Please enter your date of birth');
            return;
        }
        if (!nationalId.trim()) {
            Alert.alert('Required Field', 'Please enter your National ID');
            return;
        }

        console.log('[SignupStep2] Proceeding to Step 3 with:', {
            dateOfBirth,
            nationalId,
            tinNumber,
            occupation,
            workingTime,
            startTime,
            endTime,
            placeOfBirth,
        });
        
        // Navigate to Step 3 with combined data
        const updatedData: RegistrationData = {
            ...existingData,
            dateOfBirth,
            nationalId,
            tinNumber,
            occupation,
            workingTime,
            workingStartTime: startTime,
            workingEndTime: endTime,
            placeOfBirth,
        };
        
        navigation.navigate('SignupStep3', { registrationData: updatedData });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    // Icons
    const ArrowLeftIcon = () => (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M19 12H5M12 19l-7-7 7-7" />
        </Svg>
    );

    const CheckIcon = () => (
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <Polyline points="20 6 9 17 4 12" />
        </Svg>
    );

    const BriefcaseIcon = () => (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <Path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </Svg>
    );

    const MapPinIcon = () => (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <Circle cx="12" cy="10" r="3" />
        </Svg>
    );

    const ChevronDownIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M6 9l6 6 6-6" />
        </Svg>
    );

    const CalendarIcon = () => (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <Path d="M16 2v4M8 2v4M3 10h18" />
        </Svg>
    );

    const ArrowRightIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M5 12h14M12 5l7 7-7 7" />
        </Svg>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                    activeOpacity={0.7}
                >
                    <ArrowLeftIcon />
                </TouchableOpacity>
                <View style={styles.logo}>
                    <Text style={styles.logoText}>EG</Text>
                </View>
                <Text style={styles.headerTitle}>Create an Account</Text>
            </View>

            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>

                        {/* Progress Indicator */}
                        <View style={styles.progressSection}>
                            <View style={styles.progressRow}>
                                {/* Background Line */}
                                <View style={styles.progressLine} />
                                {/* Active Progress */}
                                <View style={styles.progressActive} />

                                {/* Step 1 - Done */}
                                <View style={[styles.stepCircle, styles.stepCircleDone]}>
                                    <CheckIcon />
                                </View>
                                {/* Step 2 - Done */}
                                <View style={[styles.stepCircle, styles.stepCircleDone]}>
                                    <CheckIcon />
                                </View>
                                {/* Step 3 - Active */}
                                <View style={[styles.stepCircle, styles.stepCircleActive]}>
                                    <Text style={styles.stepNumberActive}>3</Text>
                                </View>
                                {/* Step 4 - Pending */}
                                <View style={styles.stepCircle}>
                                    <Text style={styles.stepNumber}>4</Text>
                                </View>
                                {/* Step 5 - Pending */}
                                <View style={styles.stepCircle}>
                                    <Text style={styles.stepNumber}>5</Text>
                                </View>
                            </View>
                        </View>

                        {/* Form Container */}
                        <View style={styles.formContainer}>
                            <Text style={styles.formTitle}>Personal Information</Text>

                            <View style={styles.form}>
                                {/* Date of Birth */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Date of Birth</Text>
                                    <TouchableOpacity 
                                        style={styles.selectContainer}
                                        onPress={() => setShowDatePicker(true)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.selectInput, !dateOfBirth && { color: '#9CA3AF' }]}>
                                            {dateOfBirth || 'Select your date of birth'}
                                        </Text>
                                        <View style={styles.selectIcon}>
                                            <CalendarIcon />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                
                                {/* Date Picker Modal */}
                                <DatePicker
                                    modal
                                    open={showDatePicker}
                                    date={selectedDate}
                                    mode="date"
                                    title="Select Date of Birth"
                                    maximumDate={new Date()}
                                    minimumDate={new Date(1920, 0, 1)}
                                    onConfirm={(date) => {
                                        setShowDatePicker(false);
                                        setSelectedDate(date);
                                        const formatted = date.toISOString().split('T')[0];
                                        setDateOfBirth(formatted);
                                    }}
                                    onCancel={() => setShowDatePicker(false)}
                                />

                                {/* National ID */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>National ID</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your National ID"
                                        placeholderTextColor="#9CA3AF"
                                        value={nationalId}
                                        onChangeText={setNationalId}
                                    />
                                </View>

                                {/* TIN Number */}
                                <View style={styles.inputGroup}>
                                    <View style={styles.labelRow}>
                                        <Text style={styles.label}>TIN Number</Text>
                                        <Text style={styles.optional}>Optional</Text>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Tax Identification Number"
                                        placeholderTextColor="#9CA3AF"
                                        value={tinNumber}
                                        onChangeText={setTinNumber}
                                    />
                                </View>

                                {/* Occupation */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Occupation</Text>
                                    <View style={styles.inputWithIcon}>
                                        <View style={styles.inputIcon}>
                                            <BriefcaseIcon />
                                        </View>
                                        <TextInput
                                            style={styles.inputField}
                                            placeholder="e.g. Teacher, Engineer"
                                            placeholderTextColor="#9CA3AF"
                                            value={occupation}
                                            onChangeText={setOccupation}
                                        />
                                    </View>
                                </View>

                                {/* Working Time */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Working Time</Text>
                                    <TouchableOpacity 
                                        style={styles.selectContainer}
                                        onPress={() => setShowWorkingTimeDropdown(true)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.selectInput, !workingTime && { color: '#9CA3AF' }]}>
                                            {workingTimeOptions.find(opt => opt.value === workingTime)?.label || 'Select working time'}
                                        </Text>
                                        <View style={styles.selectIcon}>
                                            <ChevronDownIcon />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                
                                {/* Working Time Dropdown Modal */}
                                <Modal
                                    visible={showWorkingTimeDropdown}
                                    transparent={true}
                                    animationType="slide"
                                    onRequestClose={() => setShowWorkingTimeDropdown(false)}
                                >
                                    <TouchableOpacity 
                                        style={styles.modalOverlay}
                                        activeOpacity={1}
                                        onPress={() => setShowWorkingTimeDropdown(false)}
                                    >
                                        <View style={styles.dropdownModal}>
                                            <Text style={styles.dropdownTitle}>Select Working Time</Text>
                                            <FlatList
                                                data={workingTimeOptions}
                                                keyExtractor={(item) => item.value}
                                                renderItem={({ item }) => (
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.dropdownItem,
                                                            workingTime === item.value && styles.dropdownItemSelected
                                                        ]}
                                                        onPress={() => {
                                                            setWorkingTime(item.value);
                                                            // Auto-fill start/end times
                                                            if (item.value === '9-5') {
                                                                setStartTime('09:00');
                                                                setEndTime('17:00');
                                                            } else if (item.value === '8-4') {
                                                                setStartTime('08:00');
                                                                setEndTime('16:00');
                                                            } else if (item.value === 'morning') {
                                                                setStartTime('06:00');
                                                                setEndTime('14:00');
                                                            } else if (item.value === 'afternoon') {
                                                                setStartTime('14:00');
                                                                setEndTime('22:00');
                                                            } else if (item.value === 'night') {
                                                                setStartTime('22:00');
                                                                setEndTime('06:00');
                                                            }
                                                            setShowWorkingTimeDropdown(false);
                                                        }}
                                                    >
                                                        <Text style={[
                                                            styles.dropdownItemText,
                                                            workingTime === item.value && styles.dropdownItemTextSelected
                                                        ]}>
                                                            {item.label}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                            />
                                            <TouchableOpacity
                                                style={styles.dropdownCloseBtn}
                                                onPress={() => setShowWorkingTimeDropdown(false)}
                                            >
                                                <Text style={styles.dropdownCloseBtnText}>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                </Modal>

                                {/* Working Hours */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Working Hours</Text>
                                    <View style={styles.row}>
                                        <View style={styles.halfWidth}>
                                            <Text style={styles.miniLabel}>Start Time</Text>
                                            <TextInput
                                                style={styles.inputSmall}
                                                placeholder="09:00"
                                                placeholderTextColor="#9CA3AF"
                                                value={startTime}
                                                onChangeText={setStartTime}
                                            />
                                        </View>
                                        <View style={styles.halfWidth}>
                                            <Text style={styles.miniLabel}>End Time</Text>
                                            <TextInput
                                                style={styles.inputSmall}
                                                placeholder="17:00"
                                                placeholderTextColor="#9CA3AF"
                                                value={endTime}
                                                onChangeText={setEndTime}
                                            />
                                        </View>
                                    </View>
                                </View>

                                {/* Place of Birth */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Place of Birth</Text>
                                    <View style={styles.inputWithIcon}>
                                        <View style={styles.inputIcon}>
                                            <MapPinIcon />
                                        </View>
                                        <TextInput
                                            style={styles.inputField}
                                            placeholder="City/Town, Country"
                                            placeholderTextColor="#9CA3AF"
                                            value={placeOfBirth}
                                            onChangeText={setPlaceOfBirth}
                                        />
                                    </View>
                                </View>

                                {/* Action Buttons */}
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity
                                        style={styles.backBtn}
                                        onPress={handleBack}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.backBtnText}>Back</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.nextBtn}
                                        onPress={handleNext}
                                        activeOpacity={0.9}
                                    >
                                        <Text style={styles.nextBtnText}>Next Step</Text>
                                        <ArrowRightIcon />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={{ height: 32 }} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        backgroundColor: '#B45309',
        paddingVertical: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    backButton: {
        marginRight: 12,
        padding: 8,
        borderRadius: 20,
    },
    logo: {
        width: 32,
        height: 32,
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    logoText: {
        color: '#B45309',
        fontSize: 14,
        fontWeight: '700',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    safeArea: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    progressSection: {
        marginBottom: 32,
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
    },
    progressLine: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
    },
    progressActive: {
        position: 'absolute',
        top: '50%',
        left: 0,
        width: '50%',
        height: 4,
        backgroundColor: '#B45309',
        borderRadius: 2,
    },
    stepCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        zIndex: 1,
    },
    stepCircleDone: {
        backgroundColor: '#B45309',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    stepCircleActive: {
        backgroundColor: '#B45309',
        transform: [{ scale: 1.1 }],
        shadowColor: '#B45309',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 4,
        borderColor: 'rgba(180, 83, 9, 0.2)',
    },
    stepNumber: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
    },
    stepNumberActive: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    formContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 24,
    },
    form: {
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
    optional: {
        fontSize: 12,
        color: '#6B7280',
        fontStyle: 'italic',
    },
    miniLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: '#111827',
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingLeft: 12,
        paddingRight: 16,
        height: 48,
    },
    inputIcon: {
        marginRight: 8,
    },
    inputField: {
        flex: 1,
        fontSize: 14,
        color: '#111827',
    },
    selectContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingLeft: 16,
        paddingRight: 12,
        height: 48,
    },
    selectInput: {
        flex: 1,
        fontSize: 14,
        color: '#111827',
    },
    selectIcon: {
        marginLeft: 8,
    },
    inputSmall: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: '#111827',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
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
        borderRadius: 8,
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
        borderRadius: 8,
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

export default SignupStep2Screen;
