/**
 * PAYGAM MERCHANT - ACTION SUCCESS SCREEN
 * Thank you / success confirmation screen for completed transactions
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView,
  Animated,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const CheckCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 80, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M8 12l3 3 5-6" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

const CopyIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
  </Svg>
);

const CalendarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
  </Svg>
);

const ClockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </Svg>
);

const BankIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M4 10h3v7H4zm6.5 0h3v7h-3zM2 19h20v3H2zm15-9h3v7h-3zm-5-9L2 6v2h20V6z" />
  </Svg>
);

const GasPumpIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
  </Svg>
);

const ShareIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
  </Svg>
);

const DownloadIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
  </Svg>
);

// ==================== TYPES ====================
type SuccessType = 'payment' | 'withdrawal' | 'fuel_redemption' | 'transfer' | 'general';

interface RouteParams {
  type?: SuccessType;
  amount?: string | number;
  currency?: string;
  destination?: string;
  accountNumber?: string;
  fuelType?: string;
  volume?: string;
  transactionId?: string;
  navigateTo?: string;
  title?: string;
  message?: string;
  actionText?: string;
}

// ==================== MAIN COMPONENT ====================
const ActionSuccessScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  
  const {
    type = 'general',
    amount = '0.00',
    currency = 'USD',
    destination = '',
    accountNumber = '',
    fuelType = '',
    volume = '',
    transactionId = `TXN${Date.now().toString().slice(-8)}`,
    navigateTo = 'GeneralMerchantDashboard',
    title,
    message,
    actionText,
  } = route.params || {};

  // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringScale1 = useRef(new Animated.Value(0.8)).current;
  const ringScale2 = useRef(new Animated.Value(0.8)).current;
  const ringOpacity1 = useRef(new Animated.Value(0.5)).current;
  const ringOpacity2 = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Icon pop-in animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Content fade-in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 300,
      useNativeDriver: true,
    }).start();

    // Pulse animation for icon
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Ring animations
    const ringAnimation1 = Animated.loop(
      Animated.parallel([
        Animated.timing(ringScale1, {
          toValue: 1.5,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacity1, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    const ringAnimation2 = Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.parallel([
          Animated.timing(ringScale2, {
            toValue: 1.5,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity2, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    ringAnimation1.start();
    ringAnimation2.start();

    return () => {
      pulseAnimation.stop();
      ringAnimation1.stop();
      ringAnimation2.stop();
    };
  }, []);

  const getSuccessTitle = () => {
    switch (type) {
      case 'withdrawal':
        return 'Withdrawal Requested!';
      case 'fuel_redemption':
        return 'Fuel Redeemed!';
      case 'payment':
        return 'Payment Successful!';
      case 'transfer':
        return 'Transfer Complete!';
      default:
        return 'Transaction Successful!';
    }
  };

  const getSuccessMessage = () => {
    switch (type) {
      case 'withdrawal':
        return 'Your withdrawal request has been submitted successfully. Funds will arrive in 1-2 business days.';
      case 'fuel_redemption':
        return 'Fuel coupon has been successfully redeemed. Please proceed to pump.';
      case 'payment':
        return 'Payment has been received successfully. Thank you for using PayGam!';
      case 'transfer':
        return 'Money has been sent successfully to the recipient.';
      default:
        return 'Your transaction has been completed successfully.';
    }
  };

  const getCurrencySymbol = () => {
    switch (currency) {
      case 'GMD': return 'D';
      case 'GBP': return '£';
      default: return '$';
    }
  };

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleBackToDashboard = () => {
    // Reset navigation stack and go to the appropriate dashboard
    navigation.reset({
      index: 0,
      routes: [{ name: navigateTo }],
    });
  };

  const handleViewDetails = () => {
    navigation.navigate('TransactionHistory');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#293454" />
      
      <LinearGradient
        colors={['#293454', '#1f2842', '#151a29']}
        style={styles.gradient}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Success Icon with Rings */}
          <View style={styles.iconSection}>
            {/* Animated Rings */}
            <Animated.View
              style={[
                styles.ring,
                {
                  transform: [{ scale: ringScale1 }],
                  opacity: ringOpacity1,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.ring,
                styles.ring2,
                {
                  transform: [{ scale: ringScale2 }],
                  opacity: ringOpacity2,
                },
              ]}
            />
            
            {/* Success Icon */}
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  transform: [
                    { scale: scaleAnim },
                    { scale: pulseAnim },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={['#4ADE80', '#22C55E', '#16A34A']}
                style={styles.iconGradient}
              >
                <CheckCircleIcon size={48} color="#FFFFFF" />
              </LinearGradient>
            </Animated.View>
          </View>

          {/* Success Message */}
          <Animated.View style={[styles.messageSection, { opacity: fadeAnim }]}>
            <Text style={styles.successTitle}>{getSuccessTitle()}</Text>
            <Text style={styles.successMessage}>{getSuccessMessage()}</Text>
          </Animated.View>

          {/* Transaction Summary Card */}
          <Animated.View style={[styles.summaryCard, { opacity: fadeAnim }]}>
            {/* Amount */}
            <View style={styles.amountSection}>
              <Text style={styles.amountLabel}>
                {type === 'fuel_redemption' ? 'Redeemed Value' : 'Amount'}
              </Text>
              <View style={styles.amountRow}>
                <Text style={styles.currencySymbol}>{getCurrencySymbol()}</Text>
                <Text style={styles.amountValue}>
                  {typeof amount === 'number' 
                    ? amount.toLocaleString('en-US', { minimumFractionDigits: 2 })
                    : parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })
                  }
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Transaction Details */}
            <View style={styles.detailsSection}>
              {/* Transaction ID */}
              <View style={styles.detailRow}>
                <View style={styles.detailLabel}>
                  <CopyIcon size={14} color="#6B7280" />
                  <Text style={styles.detailLabelText}>Transaction ID</Text>
                </View>
                <TouchableOpacity style={styles.detailValueRow}>
                  <Text style={styles.detailValue}>{transactionId}</Text>
                  <CopyIcon size={12} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Date */}
              <View style={styles.detailRow}>
                <View style={styles.detailLabel}>
                  <CalendarIcon size={14} color="#6B7280" />
                  <Text style={styles.detailLabelText}>Date</Text>
                </View>
                <Text style={styles.detailValue}>{formatDate()}</Text>
              </View>

              {/* Time */}
              <View style={styles.detailRow}>
                <View style={styles.detailLabel}>
                  <ClockIcon size={14} color="#6B7280" />
                  <Text style={styles.detailLabelText}>Time</Text>
                </View>
                <Text style={styles.detailValue}>{formatTime()}</Text>
              </View>

              {/* Destination (for withdrawals/transfers) */}
              {(type === 'withdrawal' || type === 'transfer') && destination && (
                <View style={styles.detailRow}>
                  <View style={styles.detailLabel}>
                    <BankIcon size={14} color="#6B7280" />
                    <Text style={styles.detailLabelText}>Account</Text>
                  </View>
                  <Text style={styles.detailValue}>
                    {destination} {accountNumber}
                  </Text>
                </View>
              )}

              {/* Fuel details (for fuel redemption) */}
              {type === 'fuel_redemption' && (
                <>
                  {fuelType && (
                    <View style={styles.detailRow}>
                      <View style={styles.detailLabel}>
                        <GasPumpIcon size={14} color="#6B7280" />
                        <Text style={styles.detailLabelText}>Fuel Type</Text>
                      </View>
                      <Text style={styles.detailValue}>{fuelType}</Text>
                    </View>
                  )}
                  {volume && (
                    <View style={styles.detailRow}>
                      <View style={styles.detailLabel}>
                        <GasPumpIcon size={14} color="#6B7280" />
                        <Text style={styles.detailLabelText}>Volume</Text>
                      </View>
                      <Text style={styles.detailValue}>{volume}</Text>
                    </View>
                  )}
                </>
              )}
            </View>

            {/* Status Badge */}
            <View style={styles.statusSection}>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Completed</Text>
              </View>
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View style={[styles.quickActions, { opacity: fadeAnim }]}>
            <TouchableOpacity style={styles.quickActionBtn} activeOpacity={0.7}>
              <ShareIcon size={18} color="#293454" />
              <Text style={styles.quickActionText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionBtn} activeOpacity={0.7}>
              <DownloadIcon size={18} color="#293454" />
              <Text style={styles.quickActionText}>Download</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>

        {/* Bottom Buttons */}
        <Animated.View style={[styles.bottomButtons, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleBackToDashboard}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleViewDetails}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>View Transaction History</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#293454',
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 40 : (StatusBar.currentHeight || 24) + 20,
    paddingBottom: 20,
  },
  
  // Icon Section
  iconSection: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 160,
    marginBottom: 24,
  },
  ring: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(74, 222, 128, 0.5)',
  },
  ring2: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: '#4ADE80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Message Section
  messageSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#9CA3AF',
    marginRight: 4,
  },
  amountValue: {
    fontSize: 40,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 20,
  },
  detailsSection: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabelText: {
    fontSize: 13,
    color: '#6B7280',
  },
  detailValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusSection: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  quickActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Bottom Buttons
  bottomButtons: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#293454',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default ActionSuccessScreen;
