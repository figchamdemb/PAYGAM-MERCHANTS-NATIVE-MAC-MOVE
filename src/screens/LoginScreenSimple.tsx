/**
 * PAYGAM MERCHANT - LOGIN SCREEN
 * Modern login portal with bottom sheet design
 * Flow: Login  MFA  Success Animation  Dashboard
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  Animated,
  ImageBackground,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const WalletIcon: React.FC<{ size?: number; color?: string }> = ({ size = 32, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </Svg>
);

const LockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
  </Svg>
);

const EyeIcon: React.FC<{ size?: number; color?: string; closed?: boolean }> = ({ size = 20, color = '#9CA3AF', closed = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    {closed ? (
      <Path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
    ) : (
      <Path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    )}
  </Svg>
);

const ArrowRightIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
  </Svg>
);

const ChevronDownIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
  </Svg>
);

const CheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </Svg>
);

const ShieldCatIcon: React.FC<{ size?: number; color?: string }> = ({ size = 32, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" opacity={0.3} />
    <Path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83V6.31l6-2.25 6 2.25v4.78z" />
  </Svg>
);

// ==================== MAIN COMPONENT ====================
const LoginScreenSimple: React.FC = ({ route }: any) => {
  const navigation = useNavigation<any>();
  
  // Get the selected merchant type from navigation params (supports both formats)
  const merchantType = route?.params?.merchantRoute || route?.params?.merchantType || 'GeneralMerchantDashboard';
  
  // Form state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Focus states
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isPassFocused, setIsPassFocused] = useState(false);
  
  // Keyboard state
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  // View states
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;
  const successCheckAnim = useRef(new Animated.Value(0)).current;
  const successPingAnim = useRef(new Animated.Value(0.8)).current;

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 12,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (showSuccess) {
      // Check mark animation
      Animated.spring(successCheckAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Ping animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(successPingAnim, {
            toValue: 1.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(successPingAnim, {
            toValue: 0.8,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Loading bar animation
      Animated.loop(
        Animated.timing(loadingAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();

      // Navigate to the selected Merchant Dashboard after 3 seconds
      const timer = setTimeout(() => {
        // Navigate to the dashboard based on selected merchant type
        navigation.replace(merchantType);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigation, mfaCode, successCheckAnim, successPingAnim, loadingAnim]);

  const handleLogin = () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setShowMFA(true);
    }, 1500);
  };

  const handleVerifyMFA = () => {
    if (mfaCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }
    setShowMFA(false);
    setShowSuccess(true);
  };

  const handleSignup = () => {
    navigation.navigate('SignUp');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  // ==================== SUCCESS SCREEN ====================
  if (showSuccess) {
    return (
      <View style={styles.successContainer}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <LinearGradient colors={['#293454', '#1a2238', '#293454']} style={StyleSheet.absoluteFill} />

        <Animated.View style={[styles.successContent, { opacity: successCheckAnim }]}>
          <View style={styles.checkmarkContainer}>
            <Animated.View style={[styles.pingRing, { transform: [{ scale: successPingAnim }] }]} />
            <View style={styles.outerRing} />
            <Animated.View style={[styles.checkCircle, { transform: [{ scale: successCheckAnim }] }]}>
              <CheckIcon size={48} color="#FFFFFF" />
            </Animated.View>
          </View>

          <Text style={styles.successTitle}>Login Successful</Text>
          <Text style={styles.successSubtitle}>Welcome back, Merchant</Text>

          <View style={styles.loadingBarContainer}>
            <Animated.View 
              style={[styles.loadingBar, {
                transform: [{
                  translateX: loadingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-width * 0.5, width * 0.5],
                  }),
                }],
              }]} 
            />
          </View>
          <Text style={styles.loadingText}>Loading Dashboard...</Text>
        </Animated.View>
      </View>
    );
  }

  // ==================== MAIN LOGIN SCREEN ====================
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Background Image Section - Hide when keyboard is visible on Android */}
      {!keyboardVisible && (
        <View style={styles.backgroundSection}>
          <LinearGradient colors={['#293454', '#1a2238']} style={styles.backgroundGradient}>
            {/* Decorative circles */}
            <View style={styles.decorCircle1} />
            <View style={styles.decorCircle2} />
            
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoBox}>
                <WalletIcon size={32} color="#FFFFFF" />
              </View>
            </View>
          </LinearGradient>
          
          {/* Overlay */}
          <View style={styles.backgroundOverlay} />
        </View>
      )}

      {/* Bottom Sheet Content */}
      <KeyboardAvoidingView 
        style={keyboardVisible ? styles.bottomSheetKeyboard : styles.bottomSheet}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View 
          style={[
            styles.bottomSheetInner,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false} 
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {/* Header Text */}
            <View style={styles.headerSection}>
              <Text style={styles.title}>Login to pay or{'\n'}accept money!</Text>
              <Text style={styles.subtitle}>Welcome back, Merchant.</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Phone Number Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PHONE NUMBER</Text>
                <View style={[styles.inputWrapper, isPhoneFocused && styles.inputFocused]}>
                  {/* Country Code */}
                  <TouchableOpacity style={styles.countryCode} activeOpacity={0.8}>
                    <Text style={styles.countryCodeText}>+220</Text>
                    <ChevronDownIcon size={10} color="#64748B" />
                  </TouchableOpacity>
                  {/* Input */}
                  <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    placeholderTextColor="#9CA3AF"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    onFocus={() => setIsPhoneFocused(true)}
                    onBlur={() => setIsPhoneFocused(false)}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <View style={[styles.inputWrapper, isPassFocused && styles.inputFocused]}>
                  <View style={styles.lockIconContainer}>
                    <LockIcon size={18} color={isPassFocused ? '#293454' : '#9CA3AF'} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    onFocus={() => setIsPassFocused(true)}
                    onBlur={() => setIsPassFocused(false)}
                  />
                  <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                    <EyeIcon size={20} color="#9CA3AF" closed={!showPassword} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity 
                style={styles.loginButton} 
                onPress={handleLogin} 
                disabled={isLoading} 
                activeOpacity={0.9}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Login</Text>
                    <ArrowRightIcon size={18} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer Links */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have an account?{' '}
                <Text style={styles.signupLink} onPress={handleSignup}>Signup</Text>
              </Text>
              
              <View style={styles.termsContainer}>
                <TouchableOpacity>
                  <Text style={styles.termsText}>Terms & Conditions</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* MFA Modal */}
      <Modal visible={showMFA} transparent animationType="fade" onRequestClose={() => setShowMFA(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.mfaModal}>
            <LinearGradient colors={['#293454', '#4a5a8a', '#293454']} style={styles.mfaTopBar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            <View style={styles.mfaIconContainer}>
              <ShieldCatIcon size={32} color="#293454" />
            </View>
            <Text style={styles.mfaTitle}>Security Verification</Text>
            <Text style={styles.mfaSubtitle}>Enter the 6-digit code sent to your device.</Text>
            <TextInput
              style={styles.mfaInput}
              placeholder="000000"
              placeholderTextColor="#9CA3AF"
              value={mfaCode}
              onChangeText={(text) => setMfaCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
              keyboardType="number-pad"
              maxLength={6}
              textAlign="center"
            />
            <TouchableOpacity style={styles.mfaVerifyButton} onPress={handleVerifyMFA} activeOpacity={0.9}>
              <Text style={styles.mfaVerifyText}>VERIFY IDENTITY</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mfaCancelButton} onPress={() => setShowMFA(false)}>
              <Text style={styles.mfaCancelText}>CANCEL REQUEST</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#293454',
  },
  
  // Background Section
  backgroundSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.45,
  },
  backgroundGradient: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: 50,
    left: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(41, 52, 84, 0.8)',
  },
  logoContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 24) + 40,
    alignSelf: 'center',
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  
  // Bottom Sheet
  bottomSheetWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: height * 0.75,
  },
  bottomSheet: {
    flex: 1,
    marginTop: height * 0.35,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 20,
  },
  bottomSheetKeyboard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  bottomSheetInner: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 24,
  },
  
  // Header Section
  headerSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#293454',
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  
  // Form
  form: {
    gap: 20,
  },
  inputGroup: {},
  inputLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    height: 56,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  inputFocused: {
    borderColor: '#293454',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    height: '100%',
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    gap: 6,
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#293454',
  },
  lockIconContainer: {
    paddingLeft: 16,
    paddingRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#293454',
    fontWeight: '500',
    paddingHorizontal: 16,
    height: '100%',
  },
  eyeButton: {
    padding: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#293454',
  },
  
  // Login Button
  loginButton: {
    backgroundColor: '#293454',
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    shadowColor: '#293454',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  
  // Footer
  footer: {
    marginTop: 'auto',
    paddingTop: 24,
    alignItems: 'center',
    gap: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
  },
  signupLink: {
    color: '#293454',
    fontWeight: '700',
  },
  termsContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
    alignItems: 'center',
  },
  termsText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  
  // MFA Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(41, 52, 84, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  mfaModal: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 20,
  },
  mfaTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  mfaIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  mfaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#293454',
    marginBottom: 8,
  },
  mfaSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  mfaInput: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#293454',
    letterSpacing: 16,
    marginBottom: 24,
  },
  mfaVerifyButton: {
    width: '100%',
    backgroundColor: '#293454',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#293454',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  mfaVerifyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  mfaCancelButton: {
    paddingVertical: 8,
  },
  mfaCancelText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  
  // Success Screen
  successContainer: {
    flex: 1,
    backgroundColor: '#293454',
  },
  successContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  checkmarkContainer: {
    width: 128,
    height: 128,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  pingRing: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: 'rgba(74, 222, 128, 0.3)',
  },
  outerRing: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: 'rgba(74, 222, 128, 0.5)',
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#4ADE80',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4ADE80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#93C5FD',
    marginBottom: 48,
  },
  loadingBarContainer: {
    width: 256,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBar: {
    width: '50%',
    height: '100%',
    backgroundColor: '#4ADE80',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 12,
    color: '#93C5FD',
    marginTop: 16,
  },
});

export default LoginScreenSimple;
