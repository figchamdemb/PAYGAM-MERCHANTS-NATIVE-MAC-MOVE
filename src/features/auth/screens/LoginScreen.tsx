import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../store/slices/authSlice';

const { width, height } = Dimensions.get('window');

type LoginScreenNavigationProp = StackNavigationProp<any>;

/**
 * DEMO ACCESS CODES:
 * Police:     123456 → Goes to Police Dashboard
 * Fire:       000006 → Goes to Fire Dashboard  
 * Ambulance:  111111 → Goes to Ambulance Dashboard
 * Immigration: 222222 → Goes to Immigration Dashboard
 * Any other 6-digit code → Goes to Select Agency screen
 */

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch();

  const [badgeId, setBadgeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mfaVisible, setMfaVisible] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isBadgeFocused, setIsBadgeFocused] = useState(false);
  const [isPassFocused, setIsPassFocused] = useState(false);

  const handleAuthenticate = () => {
    if (!badgeId || !password) {
      Alert.alert('Error', 'Please enter Badge ID and Password');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMfaVisible(true);
    }, 1500);
  };

  const handleVerifyMFA = () => {
    if (mfaCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }
    
    setMfaVisible(false);
    setShowSuccess(true);
    
    // Dispatch login success to Redux - this sets isAuthenticated = true
    dispatch(loginSuccess({
      user: {
        id: badgeId,
        email: `${badgeId}@patrol.gov`,
        firstName: 'Officer',
        lastName: badgeId,
        roles: ['PATROL_OFFICER'],
      },
      token: 'demo-token-' + Date.now(),
      refreshToken: 'demo-refresh-' + Date.now(),
    }));
    
    setTimeout(() => {
      setShowSuccess(false);
      // Navigation will happen automatically due to isAuthenticated change
      // The AppNavigator will switch to PatrolDrawer -> SelectAgency screen
    }, 2500);
  };

  const handleBiometricLogin = () => {
    Alert.alert('Biometric Login', 'Place finger on sensor or look at camera.');
  };

  if (showSuccess) {
    return (
      <View style={styles.successContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?q=80&w=2531&auto=format&fit=crop',
          }}
          style={styles.backgroundImage}
          blurRadius={5}
        >
          <View style={styles.overlay} />
          <View style={styles.successContent}>
            <View style={styles.checkmarkContainer}>
              <View style={styles.pingCircle} />
              <View style={styles.staticCircle} />
              <View style={styles.checkIconContainer}>
                <Icon name="check" size={40} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.successTitle}>ACCESS GRANTED</Text>
            <Text style={styles.successSubtitle}>
              Identity Verified // Level 4 Clearance
            </Text>
            <View style={styles.loadingBarContainer}>
              <View style={styles.loadingBar} />
            </View>
            <Text style={styles.loadingText}>Loading Dashboard...</Text>
          </View>
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?q=80&w=2531&auto=format&fit=crop',
        }}
        style={styles.backgroundImage}
        blurRadius={3}
      >
        <View style={styles.overlay} />
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.header}>
                <View style={styles.logoContainer}>
                  <Icon name="shield-alt" size={40} color="#1E40AF" />
                </View>
                <Text style={styles.appTitle}>Sentinel Patrol</Text>
                <View style={styles.systemStatus}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>SYSTEM SECURE</Text>
                </View>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>BADGE ID</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      isBadgeFocused && styles.inputWrapperFocused,
                    ]}
                  >
                    <View style={styles.inputIcon}>
                      <Icon
                        name="id-card"
                        size={16}
                        color={isBadgeFocused ? '#1E40AF' : '#94A3B8'}
                      />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Badge Number"
                      placeholderTextColor="#64748B"
                      value={badgeId}
                      onChangeText={setBadgeId}
                      onFocus={() => setIsBadgeFocused(true)}
                      onBlur={() => setIsBadgeFocused(false)}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>PASSWORD</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      isPassFocused && styles.inputWrapperFocused,
                    ]}
                  >
                    <View style={styles.inputIcon}>
                      <Icon
                        name="lock"
                        size={16}
                        color={isPassFocused ? '#1E40AF' : '#94A3B8'}
                      />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor="#64748B"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setIsPassFocused(true)}
                      onBlur={() => setIsPassFocused(false)}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Icon
                        name={showPassword ? 'eye-slash' : 'eye'}
                        size={16}
                        color="#94A3B8"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.optionsRow}>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setRememberDevice(!rememberDevice)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        rememberDevice && styles.checkboxChecked,
                      ]}
                    >
                      <View
                        style={[
                          styles.checkboxKnob,
                          rememberDevice && styles.checkboxKnobChecked,
                        ]}
                      />
                    </View>
                    <Text style={styles.checkboxLabel}>Remember Device</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={styles.helpLink}>Dispatch Help?</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.authButton}
                  onPress={handleAuthenticate}
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.authButtonText}>AUTHENTICATE</Text>
                      <Icon name="sign-in-alt" size={16} color="#FFFFFF" />
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>RAPID ACCESS</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.biometricButton}
                  onPress={handleBiometricLogin}
                >
                  <View style={styles.bioIconBg}>
                    <Icon name="fingerprint" size={16} color="#60A5FA" />
                  </View>
                  <Text style={styles.bioText}>Biometric Login</Text>
                  <View style={styles.verticalDivider} />
                  <Icon name="expand" size={16} color="#94A3B8" />
                </TouchableOpacity>

                <View style={styles.secureInfo}>
                  <Text style={styles.secureText}>
                    SECURE CONNECTION // ENCRYPTED AES-256
                  </Text>
                  <Text style={styles.secureText}>
                    ID: 884-29-XA // NODE: CENTRAL-01
                  </Text>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>

      <Modal
        visible={mfaVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMfaVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderDecor} />
            <View style={styles.modalIconContainer}>
              <Icon name="user-shield" size={24} color="#60A5FA" />
            </View>
            <Text style={styles.modalTitle}>Security Verification</Text>
            <Text style={styles.modalSubtitle}>
              Enter the 6-digit code sent to your device.
            </Text>
            <TextInput
              style={styles.mfaInput}
              placeholder="000000"
              placeholderTextColor="#334155"
              keyboardType="number-pad"
              maxLength={6}
              value={mfaCode}
              onChangeText={setMfaCode}
            />
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerifyMFA}
            >
              <Text style={styles.verifyButtonText}>VERIFY IDENTITY</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setMfaVisible(false)}
            >
              <Text style={styles.cancelButtonText}>CANCEL REQUEST</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  systemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  statusText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 12,
    height: 56,
  },
  inputWrapperFocused: {
    borderColor: '#1E40AF',
    borderWidth: 2,
  },
  inputIcon: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    height: '100%',
  },
  eyeIcon: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#334155',
    padding: 2,
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#1E40AF',
  },
  checkboxKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  checkboxKnobChecked: {
    alignSelf: 'flex-end',
  },
  checkboxLabel: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  helpLink: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
  authButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 12,
  },
  footer: {
    marginTop: 32,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155',
  },
  dividerText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginHorizontal: 16,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.5)',
    borderRadius: 12,
    marginBottom: 24,
  },
  bioIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(30, 64, 175, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bioText: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '600',
  },
  verticalDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#475569',
    marginHorizontal: 16,
  },
  secureInfo: {
    alignItems: 'center',
  },
  secureText: {
    color: '#475569',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#475569',
  },
  modalHeaderDecor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#3B82F6',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderWidth: 1,
    borderColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 24,
    textAlign: 'center',
  },
  mfaInput: {
    width: '100%',
    height: 64,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 12,
    color: '#FFFFFF',
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 24,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  verifyButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  checkmarkContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  pingCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  staticCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  checkIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  successSubtitle: {
    color: '#34D399',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 32,
  },
  loadingBarContainer: {
    width: 200,
    height: 4,
    backgroundColor: '#1E293B',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  loadingBar: {
    width: '50%',
    height: '100%',
    backgroundColor: '#10B981',
  },
  loadingText: {
    color: '#64748B',
    fontSize: 12,
  },
});

export default LoginScreen;
