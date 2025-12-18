/**
 * PAYGAM MERCHANT - TRANSACTION DETAILS SCREEN
 * Receipt screen shown after successful wallet top-up via Stripe/Bank
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Animated,
  Image,
  Share,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Svg, { Path, Circle, Rect, G, Defs, ClipPath } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const ArrowLeftIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MoreVerticalIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="5" r="2" />
    <Circle cx="12" cy="12" r="2" />
    <Circle cx="12" cy="19" r="2" />
  </Svg>
);

const CheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 28, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CopyIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="9" y="9" width="13" height="13" rx="2" stroke={color} strokeWidth={2} />
    <Path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke={color} strokeWidth={2} />
  </Svg>
);

const VisaIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#293454' }) => (
  <Svg width={size} height={size * 0.6} viewBox="0 0 48 32" fill="none">
    <Rect width="48" height="32" rx="4" fill="#F3F4F6" />
    <Path d="M19.5 21H17L18.75 11H21.25L19.5 21Z" fill={color} />
    <Path d="M28.5 11.25C28 11.05 27.25 10.85 26.25 10.85C23.75 10.85 22 12.15 22 14C22 15.4 23.25 16.2 24.25 16.65C25.25 17.1 25.6 17.4 25.6 17.8C25.6 18.4 24.85 18.7 24.15 18.7C23.15 18.7 22.6 18.55 21.75 18.2L21.4 18.05L21 20.55C21.65 20.85 22.85 21.1 24.1 21.1C26.75 21.1 28.45 19.8 28.45 17.85C28.45 16.75 27.75 15.9 26.2 15.2C25.3 14.8 24.75 14.5 24.75 14.05C24.75 13.65 25.2 13.2 26.15 13.2C26.95 13.2 27.55 13.4 28 13.6L28.25 13.7L28.5 11.25Z" fill={color} />
    <Path d="M32.65 11H30.65C30.05 11 29.6 11.15 29.35 11.8L25.5 21H28.15L28.65 19.55H31.85L32.15 21H34.5L32.65 11ZM29.35 17.4C29.55 16.9 30.45 14.5 30.45 14.5C30.45 14.5 30.65 13.95 30.8 13.6L30.95 14.45C30.95 14.45 31.5 17 31.65 17.4H29.35Z" fill={color} />
    <Path d="M16.25 11L13.75 18.05L13.5 16.9C13 15.3 11.5 13.55 9.75 12.65L12 21H14.65L18.9 11H16.25Z" fill={color} />
  </Svg>
);

const ReceiptIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z" />
  </Svg>
);

const ShareIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
  </Svg>
);

const AlertCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M12 8v4M12 16h.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const RefundIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M1 4v6h6M23 20v-6h-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BankIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M4 10h3v7H4zm6.5 0h3v7h-3zM2 19h20v3H2zm15-9h3v7h-3zm-5-9L2 6v2h20V6z" />
  </Svg>
);

const StripeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#635BFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
  </Svg>
);

// ==================== TYPES ====================
type TransactionStatus = 'success' | 'pending' | 'failed';
type PaymentMethod = 'visa' | 'mastercard' | 'stripe' | 'bank';

interface RouteParams {
  transactionId?: string;
  amount?: number;
  currency?: string;
  status?: TransactionStatus;
  senderName?: string;
  senderAvatar?: string;
  paymentMethod?: PaymentMethod;
  cardLast4?: string;
  note?: string;
  date?: string;
  time?: string;
}

// ==================== MAIN COMPONENT ====================
const TransactionDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  
  // Default/Demo data
  const {
    transactionId = 'NX-8839202',
    amount = 1250.00,
    currency = 'USD',
    status = 'success',
    senderName = 'Alice Freeman',
    senderAvatar = 'https://i.pravatar.cc/150?img=32',
    paymentMethod = 'visa',
    cardLast4 = '4242',
    note = 'Invoice #402 - Web Design Services for Q3 Campaign.',
    date = 'Oct 24, 2023',
    time = '10:30 AM',
  } = route.params || {};

  // Animation
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getCurrencySymbol = () => {
    switch (currency) {
      case 'GMD': return 'D';
      case 'GBP': return '£';
      case 'EUR': return '€';
      default: return '$';
    }
  };

  const formatAmount = (value: number) => {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleCopyId = () => {
    // In real app: Clipboard.setString(transactionId);
    Alert.alert('Copied!', `Transaction ID #${transactionId} copied to clipboard`);
  };

  const handleShareReceipt = async () => {
    try {
      await Share.share({
        message: `Payment Receipt\n\nTransaction ID: #${transactionId}\nAmount: ${getCurrencySymbol()}${formatAmount(amount)}\nDate: ${date}  ${time}\nStatus: ${status.toUpperCase()}\n\nFrom: ${senderName}\nNote: ${note}\n\nPowered by PayGam`,
        title: 'Payment Receipt',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleReportIssue = () => {
    Alert.alert(
      'Report an Issue',
      'Would you like to report a problem with this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Report', onPress: () => navigation.navigate('HelpCenter') },
      ]
    );
  };

  const handleInitiateRefund = () => {
    // Extract initials from sender name
    const initials = senderName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    navigation.navigate('InitiateRefund', {
      transactionId,
      customerName: senderName,
      customerInitials: initials,
      originalAmount: amount,
      currency,
      date,
      time,
    });
  };

  const getPaymentMethodIcon = () => {
    switch (paymentMethod) {
      case 'visa':
        return <VisaIcon size={28} color="#293454" />;
      case 'stripe':
        return <StripeIcon size={20} color="#635BFF" />;
      case 'bank':
        return <BankIcon size={20} color="#293454" />;
      default:
        return <VisaIcon size={28} color="#293454" />;
    }
  };

  const getPaymentMethodLabel = () => {
    switch (paymentMethod) {
      case 'visa':
        return `Visa  ${cardLast4}`;
      case 'mastercard':
        return `Mastercard  ${cardLast4}`;
      case 'stripe':
        return 'Stripe Payment';
      case 'bank':
        return 'Bank Transfer';
      default:
        return `Card  ${cardLast4}`;
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          bgColor: 'rgba(34, 197, 94, 0.1)',
          textColor: '#22C55E',
          ringColor: 'rgba(34, 197, 94, 0.2)',
          label: 'Payment Success',
        };
      case 'pending':
        return {
          bgColor: 'rgba(245, 158, 11, 0.1)',
          textColor: '#F59E0B',
          ringColor: 'rgba(245, 158, 11, 0.2)',
          label: 'Processing',
        };
      case 'failed':
        return {
          bgColor: 'rgba(239, 68, 68, 0.1)',
          textColor: '#EF4444',
          ringColor: 'rgba(239, 68, 68, 0.2)',
          label: 'Payment Failed',
        };
      default:
        return {
          bgColor: 'rgba(34, 197, 94, 0.1)',
          textColor: '#22C55E',
          ringColor: 'rgba(34, 197, 94, 0.2)',
          label: 'Payment Success',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#293454" />
      
      {/* Background Header */}
      <View style={styles.headerBackground} />

      <SafeAreaView style={styles.safeArea}>
        {/* Navigation Bar */}
        <View style={styles.navbar}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeftIcon size={16} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text style={styles.navTitle}>Transaction Details</Text>
          
          <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
            <MoreVerticalIcon size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Receipt Card */}
          <View style={styles.receiptCard}>
            {/* Top Section: Status & Amount */}
            <View style={styles.statusSection}>
              <View style={[styles.statusIconContainer, { backgroundColor: statusConfig.bgColor }]}>
                <View style={[styles.statusIconRing, { borderColor: statusConfig.ringColor }]}>
                  <CheckIcon size={28} color={statusConfig.textColor} />
                </View>
              </View>
              
              <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
                <Text style={[styles.statusText, { color: statusConfig.textColor }]}>
                  {statusConfig.label}
                </Text>
              </View>
              
              <Text style={styles.amount}>
                {getCurrencySymbol()}{formatAmount(amount)}
              </Text>
              <Text style={styles.dateTime}>{date}  {time}</Text>
            </View>

            {/* Ticket Tear Effect */}
            <View style={styles.tearEffect}>
              <View style={styles.tearNotchLeft} />
              <View style={styles.tearLine} />
              <View style={styles.tearNotchRight} />
            </View>

            {/* Middle Section: Metadata */}
            <View style={styles.metadataSection}>
              {/* Transaction ID */}
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Transaction ID</Text>
                <View style={styles.metaValueRow}>
                  <Text style={styles.metaValue}>#{transactionId}</Text>
                  <TouchableOpacity onPress={handleCopyId} activeOpacity={0.7}>
                    <CopyIcon size={14} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sender */}
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Sender</Text>
                <View style={styles.metaValueRow}>
                  <Image 
                    source={{ uri: senderAvatar }}
                    style={styles.senderAvatar}
                  />
                  <Text style={styles.metaValue}>{senderName}</Text>
                </View>
              </View>

              {/* Payment Method */}
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Payment Method</Text>
                <View style={styles.metaValueRow}>
                  <View style={styles.paymentMethodIcon}>
                    {getPaymentMethodIcon()}
                  </View>
                  <Text style={styles.metaValue}>{getPaymentMethodLabel()}</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Note */}
              <View style={styles.noteSection}>
                <Text style={styles.metaLabel}>Payment Note</Text>
                <View style={styles.noteBox}>
                  <Text style={styles.noteText}>{note}</Text>
                </View>
              </View>
            </View>

            {/* Card Footer */}
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.footerLabel}>Total Amount</Text>
                <Text style={styles.footerAmount}>
                  {getCurrencySymbol()}{formatAmount(amount)}
                </Text>
              </View>
              <View style={styles.receiptIconContainer}>
                <ReceiptIcon size={24} color="#FFFFFF" />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShareReceipt}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
            >
              <ShareIcon size={20} color="#FFFFFF" />
              <Text style={styles.shareButtonText}>Share Receipt</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Refund Button - Only show for successful transactions */}
          {status === 'success' && (
            <TouchableOpacity
              style={styles.refundButton}
              onPress={handleInitiateRefund}
              activeOpacity={0.7}
            >
              <RefundIcon size={18} color="#293454" />
              <Text style={styles.refundButtonText}>Initiate Refund</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.reportButton}
            onPress={handleReportIssue}
            activeOpacity={0.7}
          >
            <AlertCircleIcon size={20} color="#6B7280" />
            <Text style={styles.reportButtonText}>Report an Issue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 288,
    backgroundColor: '#293454',
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  safeArea: {
    flex: 1,
  },

  // Navbar
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  // Receipt Card
  receiptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 15,
  },

  // Status Section
  statusSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  statusIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#293454',
    letterSpacing: -0.5,
  },
  dateTime: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },

  // Tear Effect
  tearEffect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 24,
    position: 'relative',
  },
  tearNotchLeft: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginLeft: -12,
  },
  tearLine: {
    flex: 1,
    height: 0,
    borderBottomWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E5E7EB',
  },
  tearNotchRight: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginRight: -12,
  },

  // Metadata Section
  metadataSection: {
    padding: 32,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  metaLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  metaValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#293454',
  },
  senderAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  paymentMethodIcon: {
    backgroundColor: '#F3F4F6',
    padding: 4,
    borderRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 24,
  },
  noteSection: {
    gap: 8,
  },
  noteBox: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  noteText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#293454',
    lineHeight: 22,
  },

  // Card Footer
  cardFooter: {
    backgroundColor: '#293454',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
  },
  footerAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  receiptIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 8,
  },

  // Bottom Actions
  bottomActions: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    backgroundColor: '#F9FAFB',
  },
  shareButton: {
    backgroundColor: '#293454',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#293454',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  refundButton: {
    marginTop: 12,
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  refundButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#293454',
  },
  reportButton: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
});

export default TransactionDetailsScreen;
