import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Platform,
    KeyboardAvoidingView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../config/colors';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { mockVerifyOTP, MOCK_OTP } from '../../services/mockAuth';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';

// Types for navigation
type OTPVerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'OTPVerification'>;
type OTPVerificationScreenRouteProp = RouteProp<AuthStackParamList, 'OTPVerification'>;

const { width, height } = Dimensions.get('window');

const OTPVerificationScreen: React.FC = () => {
    const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
    const route = useRoute<OTPVerificationScreenRouteProp>();
    const dispatch = useDispatch();
    const { theme, isDarkMode } = useTheme();
    
    // Get mode from route params - 'login' for existing users, 'signup' for new registrations
    const mode = route.params?.mode || 'signup';
    const phoneNumber = route.params?.phoneNumber || '+2207123456';
    
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(45);
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleOtpChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const code = otp.join('');
        
        if (code.length !== 6) {
            Alert.alert('Invalid Code', 'Please enter all 6 digits');
            return;
        }

        setIsLoading(true);
        try {
            // Mock verification - use 123456 as valid code
            const result = await mockVerifyOTP('+2207123456', code);
            console.log('[OTP] Verification result:', result);

            if (result.success) {
                if (mode === 'login') {
                    // LOGIN MODE - Log in directly
                    console.log('[OTP] Login mode - logging in user');
                    dispatch(loginSuccess({
                        user: {
                            id: String(result.user?.id || 1),
                            email: result.user?.email || '',
                            phoneNumber: phoneNumber,
                            firstName: result.user?.firstName || 'User',
                            lastName: result.user?.lastName || '',
                        },
                        token: 'mock-token-' + Date.now(),
                        refreshToken: 'mock-refresh-token-' + Date.now(),
                    }));
                    Alert.alert('Success', 'Welcome back!');
                } else if (mode === 'reset') {
                    // RESET PASSWORD MODE - Navigate to reset password screen
                    console.log('[OTP] Reset mode - proceeding to password reset');
                    Alert.alert(
                        'Phone Verified!',
                        'Please enter your new password.',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    navigation.navigate('ResetPassword', { phoneNumber: phoneNumber });
                                },
                            },
                        ]
                    );
                } else {
                    // SIGNUP MODE - Proceed to registration steps
                    console.log('[OTP] Signup mode - proceeding to Personal Information step');
                    
                    // Navigate to SignupStep2 with any existing registration data
                    const existingData = route.params?.registrationData || {};
                    navigation.navigate('SignupStep2', {
                        registrationData: {
                            ...existingData,
                            firstName: existingData.firstName || result.user?.firstName || '',
                            lastName: existingData.lastName || result.user?.lastName || '',
                            email: existingData.email || result.user?.email || '',
                            phoneNumber: existingData.phoneNumber || phoneNumber,
                            userId: result.user ? String(result.user.id) : '1',
                        }
                    });
                    
                    Alert.alert(
                        'Phone Verified!',
                        'Please complete your personal information to finish registration.'
                    );
                }
            } else {
                Alert.alert('Invalid Code', result.message || `Use code: ${MOCK_OTP}`);
            }
        } catch (error) {
            console.error('[OTP] Error:', error);
            Alert.alert('Error', 'Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fill test OTP
    const fillTestOTP = () => {
        const testOtp = MOCK_OTP.split('');
        setOtp(testOtp);
    };

    // Icons
    const LocationIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 20 20" fill="#FFFFFF">
            <Path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </Svg>
    );

    const UserIcon = () => (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </Svg>
    );

    const ShieldIcon = () => (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </Svg>
    );

    const PhoneIcon = () => (
        <Svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </Svg>
    );

    const ArrowRightIcon = () => (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </Svg>
    );

    const RecaptchaIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </Svg>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />

            {/* BACKGROUND APP UI (Blurred) */}
            <View style={styles.backgroundUI}>
                {/* Fake Header */}
                <View style={styles.fakeHeader}>
                    <View style={styles.fakeHeaderContent}>
                        <View>
                            <Text style={styles.fakeHeaderLabel}>CURRENT LOCATION</Text>
                            <View style={styles.fakeHeaderLocation}>
                                <LocationIcon />
                                <Text style={styles.fakeHeaderLocationText}>Banjul, The Gambia</Text>
                            </View>
                        </View>
                        <View style={styles.fakeHeaderIcon}>
                            <UserIcon />
                        </View>
                    </View>
                </View>

                {/* Fake Map/Content Area */}
                <View style={styles.fakeContent}>
                    <View style={styles.fakeMapCircle1} />
                    <View style={styles.fakeMapCircle2} />

                    <View style={styles.fakeStatusCard}>
                        <View style={styles.fakeStatusIcon}>
                            <ShieldIcon />
                        </View>
                        <View>
                            <Text style={styles.fakeStatusTitle}>Guard Active</Text>
                            <Text style={styles.fakeStatusSubtitle}>Monitoring sector 4</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* DARK OVERLAY */}
            <View style={styles.overlay} />

            {/* OTP POPUP / BOTTOM SHEET */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.bottomSheetContainer}
            >
                <View style={styles.bottomSheet}>
                    {/* Drag Handle */}
                    <View style={styles.dragHandleContainer}>
                        <View style={styles.dragHandle} />
                    </View>

                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <View style={styles.iconCircle}>
                            <PhoneIcon />
                        </View>
                    </View>

                    {/* Text Content */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Verification Code</Text>
                        <Text style={styles.subtitle}>
                            We have sent the verification code to{'\n'}
                            <Text style={styles.phoneNumber}>+220 7*** *89</Text>
                        </Text>
                    </View>

                    {/* OTP Inputs */}
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                style={[
                                    styles.otpInput,
                                    digit ? styles.otpInputFilled : null,
                                    index === 0 ? styles.otpInputActive : null, // Simulate focus for first input
                                ]}
                                value={digit}
                                onChangeText={(text) => handleOtpChange(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="numeric"
                                maxLength={1}
                                selectTextOnFocus
                            />
                        ))}
                    </View>

                    {/* Timer */}
                    <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>
                            Resend code in <Text style={styles.timerValue}>00:{timer.toString().padStart(2, '0')}</Text>
                        </Text>
                    </View>

                    {/* Test OTP Helper */}
                    <TouchableOpacity style={styles.testOtpButton} onPress={fillTestOTP}>
                        <Text style={styles.testOtpText}>📱 Fill test code: 123456</Text>
                    </TouchableOpacity>

                    {/* Action Button */}
                    <TouchableOpacity 
                        style={[styles.verifyButton, isLoading && styles.verifyButtonDisabled]} 
                        onPress={handleVerify} 
                        activeOpacity={0.9}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <>
                                <Text style={styles.verifyButtonText}>Verify & Continue</Text>
                                <ArrowRightIcon />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* Recaptcha Badge */}
            <View style={styles.recaptchaBadge}>
                <View style={styles.recaptchaIcon}>
                    <RecaptchaIcon />
                </View>
                <Text style={styles.recaptchaText}>
                    protected by{'\n'}
                    <Text style={styles.recaptchaBold}>reCAPTCHA</Text>
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // gray-50
    },
    backgroundUI: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.5, // Simulate blur with opacity since blur is expensive/complex in RN without libraries
    },
    fakeHeader: {
        backgroundColor: '#B45309',
        paddingTop: Platform.OS === 'android' ? 48 : 60,
        paddingHorizontal: 24,
        paddingBottom: 32,
        borderBottomLeftRadius: 48,
        borderBottomRightRadius: 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    fakeHeaderContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    fakeHeaderLabel: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.8)',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    fakeHeaderLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    fakeHeaderLocationText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    fakeHeaderIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fakeContent: {
        flex: 1,
        padding: 24,
        position: 'relative',
    },
    fakeMapCircle1: {
        position: 'absolute',
        top: 40,
        left: 40,
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: '#DBEAFE', // blue-100
        opacity: 0.5,
    },
    fakeMapCircle2: {
        position: 'absolute',
        bottom: 80,
        right: 40,
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#DCFCE7', // green-100
        opacity: 0.5,
    },
    fakeStatusCard: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6', // gray-100
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    fakeStatusIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFEDD5', // orange-100
        alignItems: 'center',
        justifyContent: 'center',
    },
    fakeStatusTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937', // gray-800
    },
    fakeStatusSubtitle: {
        fontSize: 12,
        color: '#6B7280', // gray-500
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(17, 24, 39, 0.6)', // gray-900/60
        zIndex: 10,
    },
    bottomSheetContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        zIndex: 20,
    },
    bottomSheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 32,
        paddingBottom: Platform.OS === 'ios' ? 40 : 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 24,
    },
    dragHandleContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    dragHandle: {
        width: 48,
        height: 6,
        backgroundColor: '#E5E7EB', // gray-200
        borderRadius: 3,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF7ED', // orange-50
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827', // gray-900
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280', // gray-500
        textAlign: 'center',
        lineHeight: 20,
    },
    phoneNumber: {
        fontWeight: '600',
        color: '#1F2937', // gray-800
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 32,
        paddingHorizontal: 8,
    },
    otpInput: {
        width: 48,
        height: 56,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB', // gray-200
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937', // gray-800
        backgroundColor: '#FFFFFF',
    },
    otpInputFilled: {
        borderColor: '#B45309',
        backgroundColor: '#FFF7ED', // orange-50
        color: '#B45309',
    },
    otpInputActive: {
        borderColor: '#B45309',
        backgroundColor: '#FFF7ED', // orange-50
        color: '#B45309',
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    timerText: {
        fontSize: 14,
        color: '#6B7280', // gray-500
    },
    timerValue: {
        color: '#B45309',
        fontWeight: '700',
    },
    testOtpButton: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#FEF3C7',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F59E0B',
        alignItems: 'center',
    },
    testOtpText: {
        fontSize: 12,
        color: '#92400E',
        fontWeight: '500',
    },
    verifyButton: {
        width: '100%',
        backgroundColor: '#B45309',
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#FED7AA', // orange-200
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 4,
    },
    verifyButtonDisabled: {
        backgroundColor: '#D1D5DB',
    },
    verifyButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    recaptchaBadge: {
        position: 'absolute',
        bottom: 16,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 50,
        opacity: 0.8,
        transform: [{ scale: 0.8 }],
    },
    recaptchaIcon: {
        width: 24,
        height: 24,
        backgroundColor: '#3B82F6', // blue-500
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recaptchaText: {
        fontSize: 10,
        color: '#6B7280', // gray-500
        lineHeight: 12,
    },
    recaptchaBold: {
        fontWeight: '700',
    },
});

export default OTPVerificationScreen;
