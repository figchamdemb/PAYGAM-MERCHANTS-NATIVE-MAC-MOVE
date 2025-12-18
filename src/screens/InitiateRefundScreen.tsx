/**
 * PAYGAM MERCHANT - INITIATE REFUND SCREEN
 * Allows merchants to initiate full or partial refunds for transactions
 */

import React, { useState, useRef } from 'react';
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
  TextInput,
  KeyboardAvoidingView,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const ArrowLeftIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const InfoIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M12 16v-4M12 8h.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const LockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth={2} />
    <Path d="M7 11V7a5 5 0 0110 0v4" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const CommentIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const RefundIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M1 4v6h6M23 20v-6h-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ==================== TYPES ====================
interface RouteParams {
  transactionId?: string;
  customerName?: string;
  customerInitials?: string;
  originalAmount?: number;
  currency?: string;
  date?: string;
  time?: string;
}

// ==================== MAIN COMPONENT ====================
const InitiateRefundScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  // Get transaction data from route params or use defaults
  const {
    transactionId = 'TRX-84920',
    customerName = 'John Doe',
    customerInitials = 'JD',
    originalAmount = 1250.00,
    currency = 'USD',
    date = 'Oct 24',
    time = '10:30 AM',
  } = route.params || {};

  // State
  const [refundAmount, setRefundAmount] = useState(originalAmount.toFixed(2));
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleMaxAmount = () => {
    setRefundAmount(originalAmount.toFixed(2));
  };

  const handleReset = () => {
    setRefundAmount(originalAmount.toFixed(2));
  };

  const handleConfirmRefund = () => {
    const amount = parseFloat(refundAmount);
    
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid refund amount.');
      return;
    }

    if (amount > originalAmount) {
      Alert.alert('Invalid Amount', `Refund amount cannot exceed ${getCurrencySymbol()}${formatAmount(originalAmount)}`);
      return;
    }

    if (!password.trim()) {
      Alert.alert('Password Required', 'Please enter your merchant password to authorize this refund.');
      return;
    }

    Alert.alert(
      'Confirm Refund',
      `Are you sure you want to refund ${getCurrencySymbol()}${formatAmount(amount)} to ${customerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => processRefund(amount),
        },
      ]
    );
  };

  const processRefund = async (amount: number) => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      navigation.navigate('ActionSuccess', {
        title: 'Refund Initiated',
        message: `${getCurrencySymbol()}${formatAmount(amount)} will be refunded to ${customerName}`,
        transactionId: `RF-${Date.now()}`,
        amount: amount,
        currency: currency,
      });
    }, 2000);
  };

  const refundTotal = parseFloat(refundAmount) || 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeftIcon size={20} color="#293454" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Initiate Refund</Text>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => Alert.alert('Refund Info', 'Refunds are typically processed within 3-5 business days. Partial refunds are allowed up to the original transaction amount.')}
            activeOpacity={0.7}
          >
            <InfoIcon size={20} color="#293454" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Transaction Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryContent}>
                {/* Decorative Background Elements */}
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />
                
                <View style={styles.summaryInner}>
                  {/* Avatar */}
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{customerInitials}</Text>
                  </View>
                  
                  {/* Customer Info */}
                  <Text style={styles.customerName}>{customerName}</Text>
                  <Text style={styles.transactionRef}>Transaction #{transactionId}</Text>
                  
                  {/* Amount */}
                  <Text style={styles.originalAmount}>
                    {getCurrencySymbol()}{formatAmount(originalAmount)}
                  </Text>
                  
                  {/* Status Badge */}
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Completed • {date}, {time}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Refund Form */}
            <View style={styles.form}>
              {/* Amount Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Refund Amount</Text>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencyPrefix}>{getCurrencySymbol()}</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={refundAmount}
                    onChangeText={setRefundAmount}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity
                    style={styles.maxButton}
                    onPress={handleMaxAmount}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.maxButtonText}>MAX</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.amountInfo}>
                  <Text style={styles.amountInfoText}>
                    Max refundable: <Text style={styles.amountInfoBold}>{getCurrencySymbol()}{formatAmount(originalAmount)}</Text>
                  </Text>
                  <TouchableOpacity onPress={handleReset} activeOpacity={0.7}>
                    <Text style={styles.resetText}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Reason Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Reason for Refund</Text>
                <View style={styles.textareaContainer}>
                  <TextInput
                    style={styles.textarea}
                    value={reason}
                    onChangeText={setReason}
                    placeholder="e.g. Customer returned damaged item..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                  <View style={styles.textareaIcon}>
                    <CommentIcon size={18} color="#9CA3AF" />
                  </View>
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Merchant Password</Text>
                <View style={styles.passwordContainer}>
                  <View style={styles.lockIconContainer}>
                    <LockIcon size={18} color="#9CA3AF" />
                  </View>
                  <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your transaction PIN"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                  />
                </View>
                <Text style={styles.passwordHint}>Required to authorize this transaction.</Text>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Action Bar */}
          <View style={styles.bottomBar}>
            <View style={styles.refundTotal}>
              <Text style={styles.refundTotalLabel}>Refund Total:</Text>
              <Text style={styles.refundTotalAmount}>
                {getCurrencySymbol()}{formatAmount(refundTotal)}
              </Text>
            </View>
            
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={[styles.confirmButton, isProcessing && styles.confirmButtonDisabled]}
                onPress={handleConfirmRefund}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
                disabled={isProcessing}
              >
                <RefundIcon size={18} color="#FFFFFF" />
                <Text style={styles.confirmButtonText}>
                  {isProcessing ? 'Processing...' : 'Confirm Refund'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
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
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#293454',
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 24,
  },
  summaryContent: {
    backgroundColor: '#293454',
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    top: -16,
    right: -16,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -16,
    left: -16,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryInner: {
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  transactionRef: {
    fontSize: 14,
    color: '#93C5FD',
    marginBottom: 16,
  },
  originalAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  statusBadge: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  statusText: {
    fontSize: 12,
    color: '#BBF7D0',
    fontWeight: '500',
  },

  // Form
  form: {
    gap: 24,
  },
  inputGroup: {
    marginBottom: 0,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },

  // Amount Input
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  currencyPrefix: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    paddingVertical: 16,
  },
  maxButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  maxButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#293454',
    letterSpacing: 0.5,
  },
  amountInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  amountInfoText: {
    fontSize: 12,
    color: '#6B7280',
  },
  amountInfoBold: {
    fontWeight: '600',
    color: '#374151',
  },
  resetText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#293454',
  },

  // Textarea
  textareaContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textarea: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 40,
    fontSize: 15,
    color: '#1F2937',
    minHeight: 88,
  },
  textareaIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },

  // Password
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  lockIconContainer: {
    paddingLeft: 16,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1F2937',
  },
  passwordHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    paddingHorizontal: 4,
  },

  // Bottom Bar
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  refundTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  refundTotalLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  refundTotalAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#293454',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#293454',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#1e3a5f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default InitiateRefundScreen;
