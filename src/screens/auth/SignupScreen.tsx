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
  ActivityIndicator,
} from 'react-native';
import { Svg, Path, Rect, Circle } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { mockRegister, mockSendOTP } from '../../services/mockAuth';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { theme, isDarkMode } = useTheme();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAccount = async () => {
    // Validate fields
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      const result = await mockRegister({
        firstName,
        lastName,
        username,
        phone: '+2207123456', // TODO: Get from previous screen
        email,
        password,
      });

      console.log('[Signup] Registration result:', result);

      if (result.success) {
        // Send OTP to verify phone
        await mockSendOTP('+2207123456');
        
        Alert.alert(
          'Account Created!',
          'Please verify your phone number. Use OTP: 123456',
          [{ text: 'OK', onPress: () => navigation.navigate('OTPVerification') }]
        );
      } else {
        Alert.alert('Error', result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('[Signup] Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  // Icons
  const ArrowLeftIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 19l-7-7 7-7M19 12H5" />
    </Svg>
  );

  const ShieldCheckIcon = () => (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <Path d="M9 12l2 2 4-4" />
    </Svg>
  );

  const CheckIcon = () => (
    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 6L9 17l-5-5" />
    </Svg>
  );

  const UserIcon = ({ color = "#9CA3AF" }: { color?: string }) => (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  );

  const PhoneIcon = () => (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  );

  const CheckCircleIcon = () => (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <Path d="M9 11l3 3L22 4" />
    </Svg>
  );

  const MailIcon = ({ color = "#9CA3AF" }: { color?: string }) => (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect width="20" height="16" x="2" y="4" rx="2" />
      <Path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </Svg>
  );

  const LockIcon = ({ color = "#9CA3AF" }: { color?: string }) => (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  );

  const EyeSlashIcon = () => (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <Path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <Path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <Path d="M2 2l20 20" />
    </Svg>
  );

  const ArrowRightIcon = () => (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
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
          <Text style={styles.logoText}>GG</Text>
        </View>
        <Text style={styles.headerTitle}>Create Account</Text>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>

            {/* Card Container */}
            <View style={styles.card}>

              {/* Logo/Brand Area */}
              <View style={styles.brandSection}>
                <View style={styles.brandIcon}>
                  <ShieldCheckIcon />
                </View>
                <Text style={styles.brandTitle}>EGOV-CITIZEN</Text>
                <Text style={styles.brandSubtitle}>Citizen Registration</Text>
              </View>

              {/* Stepper */}
              <View style={styles.stepperSection}>
                <View style={styles.stepperRow}>
                  {/* Connecting Line */}
                  <View style={styles.stepperLine} />
                  <View style={styles.stepperProgress} />

                  {/* Step 1 - Active */}
                  <View style={[styles.stepCircle, styles.stepCircleActive]}>
                    <Text style={styles.stepNumberActive}>1</Text>
                  </View>
                  {/* Step 2 */}
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepNumber}>2</Text>
                  </View>
                  {/* Step 3 */}
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepNumber}>3</Text>
                  </View>
                  {/* Step 4 */}
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepNumber}>4</Text>
                  </View>
                  {/* Step 5 */}
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepNumber}>5</Text>
                  </View>
                </View>
                <View style={styles.stepperLabels}>
                  <Text style={[styles.stepLabel, styles.stepLabelActive]}>Account</Text>
                  <Text style={styles.stepLabel}>Verify</Text>
                  <Text style={styles.stepLabel}>Personal</Text>
                  <Text style={styles.stepLabel}>Profile</Text>
                  <Text style={styles.stepLabel}>Address</Text>
                </View>
              </View>

              {/* Form Content */}
              <View style={styles.formContent}>

                {/* Status Badge */}
                <View style={styles.verifiedBadge}>
                  <View style={styles.verifiedIcon}>
                    <CheckIcon />
                  </View>
                  <Text style={styles.verifiedText}>Phone verified successfully</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                  {/* First & Last Name */}
                  <View style={styles.row}>
                    <View style={styles.halfWidth}>
                      <Text style={styles.label}>First Name</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="E.g. Lamin"
                        placeholderTextColor="#9CA3AF"
                        value={firstName}
                        onChangeText={setFirstName}
                      />
                    </View>
                    <View style={styles.halfWidth}>
                      <Text style={styles.label}>Last Name</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="E.g. Jallow"
                        placeholderTextColor="#9CA3AF"
                        value={lastName}
                        onChangeText={setLastName}
                      />
                    </View>
                  </View>

                  {/* Username */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Username</Text>
                    <View style={styles.inputWithIcon}>
                      <View style={styles.inputIcon}>
                        <UserIcon color={username ? "#B45309" : "#9CA3AF"} />
                      </View>
                      <TextInput
                        style={styles.inputField}
                        placeholder="Choose a username"
                        placeholderTextColor="#9CA3AF"
                        value={username}
                        onChangeText={setUsername}
                      />
                    </View>
                  </View>

                  {/* Phone (Read Only) */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <View style={[styles.inputWithIcon, styles.inputReadonly]}>
                      <View style={styles.inputIcon}>
                        <PhoneIcon />
                      </View>
                      <TextInput
                        style={[styles.inputField, styles.inputFieldReadonly]}
                        value="+220 776 1234"
                        editable={false}
                      />
                      <View style={styles.verifiedIconRight}>
                        <CheckCircleIcon />
                      </View>
                    </View>
                  </View>

                  {/* Email */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.inputWithIcon}>
                      <View style={styles.inputIcon}>
                        <MailIcon color={email ? "#B45309" : "#9CA3AF"} />
                      </View>
                      <TextInput
                        style={styles.inputField}
                        placeholder="name@example.com"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                      />
                    </View>
                  </View>

                  {/* Password */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputWithIcon}>
                      <View style={styles.inputIcon}>
                        <LockIcon color={password ? "#B45309" : "#9CA3AF"} />
                      </View>
                      <TextInput
                        style={styles.inputField}
                        placeholder="••••••••"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                      />
                      <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <EyeSlashIcon />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.helperText}>
                      Must be at least 8 characters with numbers & symbols.
                    </Text>
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                    onPress={handleCreateAccount}
                    activeOpacity={0.9}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <Text style={styles.submitButtonText}>Create Account</Text>
                        <ArrowRightIcon />
                      </>
                    )}
                  </TouchableOpacity>

                  {/* Login Link */}
                  <Text style={styles.footerText}>
                    Already have an account?{' '}
                    <Text style={styles.footerLink} onPress={handleLogin}>Log in</Text>
                  </Text>
                </View>
              </View>
            </View>

            {/* Footer Info */}
            <View style={styles.footer}>
              <Text style={styles.footerCopyright}>© 2024 EGOV-CITIZEN. All rights reserved.</Text>
              <View style={styles.footerLinks}>
                <Text style={styles.footerLinkSmall}>Privacy Policy</Text>
                <Text style={styles.footerLinkSmall}>Terms of Service</Text>
              </View>
            </View>
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
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
    borderRadius: 20,
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
  logoText: {
    color: '#B45309',
    fontSize: 14,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
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
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    maxWidth: 448,
    alignSelf: 'center',
    width: '100%',
  },
  brandSection: {
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
  },
  brandIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  stepperSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  stepperLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
  },
  stepperProgress: {
    position: 'absolute',
    top: '50%',
    left: 0,
    width: '20%',
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
    borderWidth: 4,
    borderColor: '#FFFFFF',
    zIndex: 1,
  },
  stepCircleActive: {
    backgroundColor: '#B45309',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  stepNumberActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepperLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  stepLabelActive: {
    color: '#B45309',
  },
  formContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  verifiedIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  form: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
    gap: 6,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingLeft: 12,
    paddingRight: 12,
    height: 44,
  },
  inputReadonly: {
    backgroundColor: '#F3F4F6',
  },
  inputIcon: {
    marginRight: 8,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  inputFieldReadonly: {
    color: '#6B7280',
  },
  verifiedIconRight: {
    marginLeft: 8,
  },
  eyeButton: {
    padding: 4,
  },
  helperText: {
    fontSize: 10,
    color: '#6B7280',
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: '#B45309',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  footerLink: {
    color: '#B45309',
    fontWeight: '600',
  },
  footer: {
    marginTop: 32,
    marginBottom: 16,
    alignItems: 'center',
  },
  footerCopyright: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 16,
  },
  footerLinkSmall: {
    fontSize: 10,
    color: '#9CA3AF',
  },
});

export default SignupScreen;
