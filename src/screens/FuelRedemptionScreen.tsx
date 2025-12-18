/**
 * PAYGAM MERCHANT - FUEL REDEMPTION SCREEN
 * Fuel coupon scanning and manual PIN entry for fuel redemption
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView,
  TextInput,
  ScrollView,
  Animated,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const BackArrowIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ScanIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M7 12h10M12 7v10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const KeypadIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 3c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1zM7 4c-.55 0-1 .45-1 1v7c0 .55.45 1 1 1s1-.45 1-1V5c0-.55-.45-1-1-1zM17 4c-.55 0-1 .45-1 1v7c0 .55.45 1 1 1s1-.45 1-1V5c0-.55-.45-1-1-1z" />
    <Circle cx="7" cy="18" r="2" fill={color} />
    <Circle cx="12" cy="18" r="2" fill={color} />
    <Circle cx="17" cy="18" r="2" fill={color} />
  </Svg>
);

const CheckCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 32, color = '#4ADE80' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </Svg>
);

const AlertCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#FCD34D' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </Svg>
);

const GasPumpIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#60A5FA' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
  </Svg>
);

const DropletIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#60A5FA' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
  </Svg>
);

const QuantityIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" />
  </Svg>
);

const UserIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#8B5CF6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </Svg>
);

const CameraIcon: React.FC<{ size?: number; color?: string }> = ({ size = 32, color = 'rgba(255,255,255,0.3)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 10c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM16 4l-1.4-1.75C14.22 1.84 13.65 1.5 13 1.5H9c-.65 0-1.22.34-1.6.75L6 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-4zm-4 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
  </Svg>
);

const ScanFrameIcon: React.FC = () => (
  <Svg width={200} height={200} viewBox="0 0 200 200" fill="none">
    {/* Top Left Corner */}
    <Path d="M0 40 L0 0 L40 0" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" fill="none" />
    {/* Top Right Corner */}
    <Path d="M160 0 L200 0 L200 40" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" fill="none" />
    {/* Bottom Left Corner */}
    <Path d="M0 160 L0 200 L40 200" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" fill="none" />
    {/* Bottom Right Corner */}
    <Path d="M160 200 L200 200 L200 160" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" fill="none" />
    {/* Center Cross */}
    <Line x1="90" y1="100" x2="110" y2="100" stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
    <Line x1="100" y1="90" x2="100" y2="110" stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
  </Svg>
);

// ==================== TYPES ====================
type TabType = 'scan' | 'manual';

interface CouponDetails {
  value: string;
  fuelType: string;
  volume: string;
  sender: string;
  senderPhone: string;
}

// ==================== MAIN COMPONENT ====================
const FuelRedemptionScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<TabType>('scan');
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [couponDetails, setCouponDetails] = useState<CouponDetails | null>(null);
  
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pinInputRefs = useRef<TextInput[]>([]);

  // Animate scan line
  useEffect(() => {
    if (activeTab === 'scan') {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [activeTab]);

  // Pulse animation for verified icon
  useEffect(() => {
    if (isVerified) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [isVerified]);

  const handlePinChange = (index: number, value: string) => {
    const newPinDigits = [...pinDigits];
    newPinDigits[index] = value;
    setPinDigits(newPinDigits);

    // Auto-focus next input
    if (value && index < 3) {
      pinInputRefs.current[index + 1]?.focus();
    }

    // Check if all digits entered
    if (index === 3 && value) {
      // Simulate verification
      setTimeout(() => {
        setIsVerified(true);
        setCouponDetails({
          value: '300.00',
          fuelType: 'Premium Petrol',
          volume: '15 Liters',
          sender: 'John Doe',
          senderPhone: '+220 7812345',
        });
      }, 500);
    }
  };

  const handlePinKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !pinDigits[index] && index > 0) {
      pinInputRefs.current[index - 1]?.focus();
    }
  };

  const handleRedeemCoupon = () => {
    if (!securityAnswer) {
      return;
    }
    // Navigate to success screen
    navigation.navigate('ActionSuccess', {
      type: 'fuel_redemption',
      amount: couponDetails?.value,
      fuelType: couponDetails?.fuelType,
      volume: couponDetails?.volume,
      navigateTo: 'FuelMerchantDashboard',
    });
  };

  const renderScanTab = () => (
    <View style={styles.scanContainer}>
      {/* Camera Preview Placeholder */}
      <View style={styles.cameraContainer}>
        <LinearGradient
          colors={['#1A1F2E', '#2A3142', '#1A1F2E']}
          style={styles.cameraPlaceholder}
        >
          {/* Scan Frame */}
          <View style={styles.scanFrameContainer}>
            <ScanFrameIcon />
            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [
                    {
                      translateY: scanLineAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-80, 80],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
          <View style={styles.cameraOverlay}>
            <CameraIcon size={48} color="rgba(255,255,255,0.3)" />
            <Text style={styles.cameraText}>Point camera at fuel coupon QR code</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionTitle}>Scan Fuel Coupon</Text>
        <Text style={styles.instructionText}>
          Position the QR code within the frame to automatically scan and verify the fuel coupon.
        </Text>
      </View>
    </View>
  );

  const renderManualTab = () => (
    <ScrollView style={styles.manualContainer} showsVerticalScrollIndicator={false}>
      {/* PIN Entry Section */}
      <View style={styles.pinSection}>
        <Text style={styles.pinTitle}>Enter Coupon PIN</Text>
        <Text style={styles.pinSubtitle}>Enter the 4-digit PIN from your fuel coupon</Text>
        
        <View style={styles.pinInputContainer}>
          {pinDigits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { if (ref) pinInputRefs.current[index] = ref; }}
              style={[
                styles.pinInput,
                digit ? styles.pinInputFilled : null,
                isVerified ? styles.pinInputVerified : null,
              ]}
              value={digit}
              onChangeText={(value) => handlePinChange(index, value.replace(/[^0-9]/g, '').slice(0, 1))}
              onKeyPress={({ nativeEvent }) => handlePinKeyPress(index, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              secureTextEntry
              selectTextOnFocus
              editable={!isVerified}
            />
          ))}
        </View>

        {/* Verification Status */}
        {isVerified && (
          <Animated.View style={[styles.verifiedBadge, { transform: [{ scale: pulseAnim }] }]}>
            <CheckCircleIcon size={20} color="#4ADE80" />
            <Text style={styles.verifiedText}>Coupon Verified</Text>
          </Animated.View>
        )}
      </View>

      {/* Security Question - shown after verification */}
      {isVerified && (
        <View style={styles.securitySection}>
          <View style={styles.securityHeader}>
            <AlertCircleIcon size={18} color="#FCD34D" />
            <Text style={styles.securityTitle}>Security Verification</Text>
          </View>
          <Text style={styles.securityQuestion}>What is the sender's favorite color?</Text>
          <TextInput
            style={styles.securityInput}
            value={securityAnswer}
            onChangeText={setSecurityAnswer}
            placeholder="Enter your answer"
            placeholderTextColor="#6B7280"
          />
        </View>
      )}

      {/* Coupon Details - shown after verification */}
      {isVerified && couponDetails && (
        <View style={styles.couponCard}>
          <View style={styles.couponHeader}>
            <Text style={styles.couponTitle}>Fuel Coupon Details</Text>
            <View style={styles.couponBadge}>
              <Text style={styles.couponBadgeText}>Valid</Text>
            </View>
          </View>

          <View style={styles.couponValueRow}>
            <Text style={styles.currencyLabel}>GMD</Text>
            <Text style={styles.couponValue}>{couponDetails.value}</Text>
          </View>

          <View style={styles.couponDetailsGrid}>
            <View style={styles.couponDetailItem}>
              <View style={[styles.detailIcon, { backgroundColor: 'rgba(96, 165, 250, 0.2)' }]}>
                <GasPumpIcon size={16} color="#60A5FA" />
              </View>
              <View>
                <Text style={styles.detailLabel}>Fuel Type</Text>
                <Text style={styles.detailValue}>{couponDetails.fuelType}</Text>
              </View>
            </View>

            <View style={styles.couponDetailItem}>
              <View style={[styles.detailIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <QuantityIcon size={16} color="#10B981" />
              </View>
              <View>
                <Text style={styles.detailLabel}>Volume</Text>
                <Text style={styles.detailValue}>{couponDetails.volume}</Text>
              </View>
            </View>

            <View style={[styles.couponDetailItem, styles.couponDetailFullWidth]}>
              <View style={[styles.detailIcon, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
                <UserIcon size={16} color="#8B5CF6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>Sent by</Text>
                <Text style={styles.detailValue}>{couponDetails.sender}</Text>
                <Text style={styles.detailSubtext}>{couponDetails.senderPhone}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <View style={{ height: 120 }} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#293454" />
      
      {/* Header */}
      <LinearGradient colors={['#293454', '#1f2842']} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <BackArrowIcon size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fuel Redemption</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'scan' && styles.tabActive]}
          onPress={() => setActiveTab('scan')}
          activeOpacity={0.7}
        >
          <ScanIcon size={18} color={activeTab === 'scan' ? '#FFFFFF' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 'scan' && styles.tabTextActive]}>
            Scan QR
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'manual' && styles.tabActive]}
          onPress={() => setActiveTab('manual')}
          activeOpacity={0.7}
        >
          <KeypadIcon size={18} color={activeTab === 'manual' ? '#FFFFFF' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 'manual' && styles.tabTextActive]}>
            Manual PIN
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {activeTab === 'scan' ? renderScanTab() : renderManualTab()}
      </View>

      {/* Bottom Action Bar */}
      {isVerified && activeTab === 'manual' && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.redeemButton, !securityAnswer && styles.redeemButtonDisabled]}
            onPress={handleRedeemCoupon}
            activeOpacity={0.8}
            disabled={!securityAnswer}
          >
            <LinearGradient
              colors={securityAnswer ? ['#4ADE80', '#22C55E'] : ['#6B7280', '#4B5563']}
              style={styles.redeemGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <GasPumpIcon size={20} color="#FFFFFF" />
              <Text style={styles.redeemButtonText}>Redeem Fuel Coupon</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 8,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#293454',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  
  // Scan Tab Styles
  scanContainer: {
    flex: 1,
    padding: 16,
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrameContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scanLine: {
    position: 'absolute',
    width: 180,
    height: 2,
    backgroundColor: '#4ADE80',
    shadowColor: '#4ADE80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  cameraOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  instructionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },

  // Manual Tab Styles
  manualContainer: {
    flex: 1,
    padding: 16,
  },
  pinSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  pinTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  pinSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  pinInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  pinInput: {
    width: 56,
    height: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1F2937',
  },
  pinInputFilled: {
    borderColor: '#293454',
    backgroundColor: 'rgba(41, 52, 84, 0.05)',
  },
  pinInputVerified: {
    borderColor: '#4ADE80',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderRadius: 20,
  },
  verifiedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22C55E',
  },

  // Security Section
  securitySection: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(252, 211, 77, 0.3)',
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  securityQuestion: {
    fontSize: 14,
    color: '#78350F',
    marginBottom: 12,
  },
  securityInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
  },

  // Coupon Card
  couponCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  couponTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  couponBadge: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  couponBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#22C55E',
    textTransform: 'uppercase',
  },
  couponValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 24,
  },
  currencyLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  couponValue: {
    fontSize: 40,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -1,
  },
  couponDetailsGrid: {
    gap: 12,
  },
  couponDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
  },
  couponDetailFullWidth: {
    width: '100%',
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  detailSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  redeemButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  redeemButtonDisabled: {
    opacity: 0.7,
  },
  redeemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  redeemButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default FuelRedemptionScreen;
