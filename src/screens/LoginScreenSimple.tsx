/**
 * ✅ PATROL APP - SECURE LOGIN PORTAL (Sentinel Patrol Design)
 * Flow: Login → MFA → Success Animation → Dashboard
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
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const ShieldIcon: React.FC<{ size?: number; color?: string }> = ({ size = 50, color = '#1E40AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L4 5V11C4 16.25 7.4 21.14 12 22C16.6 21.14 20 16.25 20 11V5L12 2Z" fill={color} opacity={0.3} />
    <Path d="M12 2L4 5V11C4 16.25 7.4 21.14 12 22C16.6 21.14 20 16.25 20 11V5L12 2ZM12 20C8.5 19.22 6 14.94 6 11V6.4L12 4L18 6.4V11C18 14.94 15.5 19.22 12 20Z" fill={color} />
  </Svg>
);

const IdCardIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 18V6h16v12H4zm8-9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-4 6h8v-1c0-1.33-2.67-2-4-2s-4 .67-4 2v1z" />
  </Svg>
);

const LockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
  </Svg>
);

const EyeIcon: React.FC<{ size?: number; color?: string; closed?: boolean }> = ({ size = 20, color = '#94A3B8', closed = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    {closed ? (
      <Path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
    ) : (
      <Path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    )}
  </Svg>
);

const ArrowIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M10 17l5-5-5-5v10z" />
    <Path d="M5 12c0-.55.45-1 1-1h8v2H6c-.55 0-1-.45-1-1z" />
  </Svg>
);

const FingerprintIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#60A5FA' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15z" />
  </Svg>
);

const FaceIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z" />
  </Svg>
);

const ShieldCatIcon: React.FC<{ size?: number; color?: string }> = ({ size = 28, color = '#60A5FA' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" opacity={0.3} />
    <Path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83V6.31l6-2.25 6 2.25v4.78z" />
  </Svg>
);

const CheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </Svg>
);

// ==================== MAIN COMPONENT ====================
const LoginScreenSimple: React.FC = () => {
  const navigation = useNavigation<any>();
  
  // Form state
  const [badgeId, setBadgeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Focus states
  const [isBadgeFocused, setIsBadgeFocused] = useState(false);
  const [isPassFocused, setIsPassFocused] = useState(false);
  
  // View states
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;
  const successCheckAnim = useRef(new Animated.Value(0)).current;
  const successPingAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
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

      // Navigate to appropriate Dashboard based on MFA code after 3 seconds
      const timer = setTimeout(() => {
        // Route based on MFA code
        let targetScreen = 'Dashboard'; // Default fallback
        
        switch (mfaCode) {
          case '123456':
            targetScreen = 'PoliceDashboard';
            break;
          case '111111':
            targetScreen = 'FireDashboard';
            break;
          case '222222':
            targetScreen = 'ImmigrationDashboard';
            break;
          case '000006':
            targetScreen = 'AmbulanceDashboard';
            break;
          default:
            targetScreen = 'Dashboard';
        }
        
        navigation.replace(targetScreen);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigation, mfaCode, successCheckAnim, successPingAnim, loadingAnim]);

  const handleAuthenticate = () => {
    if (!badgeId.trim()) {
      Alert.alert('Error', 'Please enter your Badge ID');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your Password');
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

  const handleBiometric = () => {
    Alert.alert(
      'Biometric Authentication',
      'Place your finger on the sensor or look at the camera.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Simulate Success', onPress: () => setShowMFA(true) },
      ]
    );
  };

  // ==================== SUCCESS SCREEN ====================
  if (showSuccess) {
    return (
      <View style={styles.successContainer}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <LinearGradient colors={['#0F172A', '#1E293B', '#0F172A']} style={StyleSheet.absoluteFill} />

        <Animated.View style={[styles.successContent, { opacity: successCheckAnim }]}>
          <View style={styles.checkmarkContainer}>
            <Animated.View style={[styles.pingRing, { transform: [{ scale: successPingAnim }] }]} />
            <View style={styles.outerRing} />
            <Animated.View style={[styles.checkCircle, { transform: [{ scale: successCheckAnim }] }]}>
              <CheckIcon size={48} color="#FFFFFF" />
            </Animated.View>
          </View>

          <Text style={styles.successTitle}>ACCESS GRANTED</Text>
          <Text style={styles.successSubtitle}>Identity Verified // Level 4 Clearance</Text>

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
      <LinearGradient colors={['rgba(15,23,42,0.95)', 'rgba(30,41,59,0.9)', 'rgba(15,23,42,0.98)']} style={StyleSheet.absoluteFill} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          {/* Header */}
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <View style={styles.logoContainer}>
              <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.logoBg}>
                <ShieldIcon size={52} color="#1E40AF" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Sentinel Patrol</Text>
            <View style={styles.secureIndicator}>
              <View style={styles.secureDot} />
              <Text style={styles.secureText}>SYSTEM SECURE</Text>
            </View>
          </Animated.View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Badge ID */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>BADGE ID</Text>
              <View style={[styles.inputWrapper, isBadgeFocused && styles.inputFocused]}>
                <View style={styles.inputIcon}>
                  <IdCardIcon size={20} color={isBadgeFocused ? '#1E40AF' : '#94A3B8'} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Badge Number"
                  placeholderTextColor="#64748B"
                  value={badgeId}
                  onChangeText={setBadgeId}
                  autoCapitalize="characters"
                  onFocus={() => setIsBadgeFocused(true)}
                  onBlur={() => setIsBadgeFocused(false)}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <View style={[styles.inputWrapper, isPassFocused && styles.inputFocused]}>
                <View style={styles.inputIcon}>
                  <LockIcon size={20} color={isPassFocused ? '#1E40AF' : '#94A3B8'} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#64748B"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setIsPassFocused(true)}
                  onBlur={() => setIsPassFocused(false)}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                  <EyeIcon size={20} color="#94A3B8" closed={!showPassword} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Options */}
            <View style={styles.optionsRow}>
              <View style={styles.rememberContainer}>
                <Switch
                  value={rememberDevice}
                  onValueChange={setRememberDevice}
                  trackColor={{ false: '#475569', true: '#1E40AF' }}
                  thumbColor="#FFFFFF"
                  style={styles.switch}
                />
                <Text style={styles.rememberText}>Remember Device</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.helpText}>Dispatch Help?</Text>
              </TouchableOpacity>
            </View>

            {/* Auth Button */}
            <TouchableOpacity style={styles.authButton} onPress={handleAuthenticate} disabled={isLoading} activeOpacity={0.9}>
              <LinearGradient colors={['#1E40AF', '#1D4ED8']} style={styles.authButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.authButtonText}>AUTHENTICATE</Text>
                    <ArrowIcon size={20} color="#FFFFFF" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>RAPID ACCESS</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.biometricButton} onPress={handleBiometric} activeOpacity={0.8}>
              <View style={styles.biometricIconContainer}>
                <FingerprintIcon size={22} color="#60A5FA" />
              </View>
              <Text style={styles.biometricText}>Biometric Login</Text>
              <View style={styles.biometricDivider} />
              <FaceIcon size={20} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.securityInfo}>
              <Text style={styles.securityText}>SECURE CONNECTION // ENCRYPTED AES-256</Text>
              <Text style={styles.securityText}>ID: 884-29-XA // NODE: CENTRAL-01</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MFA Modal */}
      <Modal visible={showMFA} transparent animationType="fade" onRequestClose={() => setShowMFA(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.mfaModal}>
            <LinearGradient colors={['#1E40AF', '#60A5FA', '#1E40AF']} style={styles.mfaTopBar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            <View style={styles.mfaIconContainer}>
              <ShieldCatIcon size={32} color="#60A5FA" />
            </View>
            <Text style={styles.mfaTitle}>Security Verification</Text>
            <Text style={styles.mfaSubtitle}>Enter the 6-digit code sent to your device.</Text>
            <TextInput
              style={styles.mfaInput}
              placeholder="000000"
              placeholderTextColor="#475569"
              value={mfaCode}
              onChangeText={(text) => setMfaCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
              keyboardType="number-pad"
              maxLength={6}
              textAlign="center"
            />
            <TouchableOpacity style={styles.mfaVerifyButton} onPress={handleVerifyMFA} activeOpacity={0.9}>
              <LinearGradient colors={['#1E40AF', '#1D4ED8']} style={styles.mfaVerifyGradient}>
                <Text style={styles.mfaVerifyText}>VERIFY IDENTITY</Text>
              </LinearGradient>
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
  container: { flex: 1, backgroundColor: '#0F172A' },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 24) + 36,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  header: { alignItems: 'center', marginBottom: 32 },
  logoContainer: { marginBottom: 24 },
  logoBg: {
    width: 96, height: 96, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#334155',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 15,
  },
  title: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5 },
  secureIndicator: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
  secureDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  secureText: { fontSize: 10, fontWeight: '600', color: '#94A3B8', letterSpacing: 2 },
  formContainer: { marginTop: 8 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 10, fontWeight: '500', color: '#94A3B8', letterSpacing: 1.5, marginBottom: 8, marginLeft: 4 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(30,41,59,0.5)',
    borderRadius: 12, borderWidth: 1, borderColor: '#475569',
    paddingHorizontal: 16, height: 56,
  },
  inputFocused: { borderColor: '#1E40AF', borderWidth: 2 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#FFFFFF', fontWeight: '500' },
  eyeButton: { padding: 8 },
  optionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 24 },
  rememberContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  switch: { transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] },
  rememberText: { fontSize: 14, fontWeight: '500', color: '#94A3B8' },
  helpText: { fontSize: 14, fontWeight: '500', color: '#1E40AF' },
  authButton: {
    borderRadius: 12, overflow: 'hidden',
    shadowColor: '#1E3A8A', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  authButtonGradient: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  authButtonText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', letterSpacing: 1 },
  footer: { marginTop: 'auto', paddingTop: 24 },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#334155' },
  dividerText: { marginHorizontal: 16, fontSize: 9, fontWeight: '700', color: '#64748B', letterSpacing: 2 },
  biometricButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(30,41,59,0.4)',
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(71,85,105,0.5)',
    height: 56, paddingHorizontal: 20, gap: 16,
  },
  biometricIconContainer: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(30,64,175,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  biometricText: { fontSize: 15, fontWeight: '600', color: '#E2E8F0' },
  biometricDivider: { width: 1, height: 16, backgroundColor: '#475569', marginHorizontal: 4 },
  securityInfo: { alignItems: 'center', marginTop: 32, gap: 4 },
  securityText: { fontSize: 9, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', color: '#475569', letterSpacing: 0.5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.9)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  mfaModal: {
    width: '100%', maxWidth: 360,
    backgroundColor: '#1E293B', borderRadius: 16,
    borderWidth: 1, borderColor: '#475569',
    padding: 24, alignItems: 'center', overflow: 'hidden',
  },
  mfaTopBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 4 },
  mfaIconContainer: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(51,65,85,0.5)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#475569',
    marginBottom: 16, marginTop: 8,
  },
  mfaTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
  mfaSubtitle: { fontSize: 12, color: '#94A3B8', textAlign: 'center', marginBottom: 24 },
  mfaInput: {
    width: '100%', backgroundColor: 'rgba(15,23,42,0.5)',
    borderRadius: 12, borderWidth: 1, borderColor: '#475569',
    paddingVertical: 16, paddingHorizontal: 20,
    fontSize: 24, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#FFFFFF', letterSpacing: 16, marginBottom: 24,
  },
  mfaVerifyButton: { width: '100%', borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
  mfaVerifyGradient: { height: 48, justifyContent: 'center', alignItems: 'center' },
  mfaVerifyText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5 },
  mfaCancelButton: { paddingVertical: 8 },
  mfaCancelText: { fontSize: 11, fontWeight: '500', color: '#64748B', letterSpacing: 0.5 },
  successContainer: { flex: 1, backgroundColor: '#0F172A' },
  successContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  checkmarkContainer: { width: 128, height: 128, justifyContent: 'center', alignItems: 'center', marginBottom: 32 },
  pingRing: { position: 'absolute', width: 128, height: 128, borderRadius: 64, borderWidth: 4, borderColor: 'rgba(16,185,129,0.3)' },
  outerRing: { position: 'absolute', width: 128, height: 128, borderRadius: 64, borderWidth: 4, borderColor: 'rgba(16,185,129,0.5)' },
  checkCircle: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: '#10B981',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#10B981', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 30, elevation: 10,
  },
  successTitle: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', letterSpacing: 1, marginBottom: 8 },
  successSubtitle: { fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', color: '#10B981', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 48 },
  loadingBarContainer: { width: 256, height: 4, backgroundColor: '#1E293B', borderRadius: 2, overflow: 'hidden' },
  loadingBar: { width: '50%', height: '100%', backgroundColor: '#10B981', borderRadius: 2 },
  loadingText: { fontSize: 12, color: '#64748B', marginTop: 16 },
});

export default LoginScreenSimple;
