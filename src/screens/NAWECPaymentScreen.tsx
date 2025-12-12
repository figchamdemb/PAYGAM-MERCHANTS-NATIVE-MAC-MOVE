/**
 * NAWECPaymentScreen - Payment checkout for NAWEC bills
 * Features: Payment method selection, card input, bill summary
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import ConfirmationModal from '../components/ConfirmationModal';
import { Svg, Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';

// SVG Icons
const ArrowLeftIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

const WalletIcon = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </Svg>
);

const BankIcon = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z" />
  </Svg>
);

const CreditCardIcon = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
  </Svg>
);

const LockIcon = ({ size = 16, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
  </Svg>
);

const ArrowRightIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M5 12h14M12 5l7 7-7 7" />
  </Svg>
);

const CheckCircleIcon = ({ size = 16, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </Svg>
);

const NAWECPaymentScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const [selectedMethod, setSelectedMethod] = useState('wallet');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handlePayment = () => {
    console.log('Processing payment with method:', selectedMethod);
    setShowConfirmation(true);
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />

      {/* Header */}
      <LinearGradient colors={['#B45309', '#92400e']} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerRight}>
          <View style={styles.nawecBadge}>
            <Text style={styles.nawecBadgeText}>NW</Text>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAwareScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={Platform.OS === 'ios' ? 100 : 120}
        keyboardOpeningTime={0}
      >
        {/* Bill Summary Card */}
        <View style={styles.billCard}>
          <View style={styles.billHeader}>
            <View>
              <Text style={styles.billLabel}>Total Amount Due</Text>
              <Text style={styles.billAmount}>$125.50</Text>
            </View>
            <View style={styles.overdueBadge}>
              <Text style={styles.overdueText}>Overdue</Text>
            </View>
          </View>
          <Text style={styles.dueDate}>Due Date: August 15, 2024</Text>

          <View style={styles.billDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Bill Number</Text>
              <Text style={styles.detailValue}>#90230816-001</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Meter Number</Text>
              <Text style={styles.detailValue}>123456890</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Service Type</Text>
              <Text style={styles.detailValue}>Electricity</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <View style={styles.paymentMethods}>
            {/* Mobile Wallet */}
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                selectedMethod === 'wallet' && styles.paymentMethodSelected,
              ]}
              onPress={() => setSelectedMethod('wallet')}
            >
              <View
                style={[
                  styles.methodIcon,
                  selectedMethod === 'wallet' && styles.methodIconSelected,
                ]}
              >
                <WalletIcon
                  size={20}
                  color={selectedMethod === 'wallet' ? '#FFFFFF' : '#6B7280'}
                />
              </View>
              <View style={styles.methodInfo}>
                <Text
                  style={[
                    styles.methodTitle,
                    selectedMethod === 'wallet' && styles.methodTitleSelected,
                  ]}
                >
                  Mobile Wallet
                </Text>
                <Text
                  style={[
                    styles.methodSubtitle,
                    selectedMethod === 'wallet' && styles.methodSubtitleSelected,
                  ]}
                >
                  QCell, Africell Money
                </Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedMethod === 'wallet' && styles.radioButtonSelected,
                ]}
              />
            </TouchableOpacity>

            {/* Bank Transfer */}
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                selectedMethod === 'bank' && styles.paymentMethodSelected,
              ]}
              onPress={() => setSelectedMethod('bank')}
            >
              <View
                style={[
                  styles.methodIcon,
                  selectedMethod === 'bank' && styles.methodIconSelected,
                ]}
              >
                <BankIcon
                  size={20}
                  color={selectedMethod === 'bank' ? '#FFFFFF' : '#6B7280'}
                />
              </View>
              <View style={styles.methodInfo}>
                <Text
                  style={[
                    styles.methodTitle,
                    selectedMethod === 'bank' && styles.methodTitleSelected,
                  ]}
                >
                  Bank Transfer
                </Text>
                <Text
                  style={[
                    styles.methodSubtitle,
                    selectedMethod === 'bank' && styles.methodSubtitleSelected,
                  ]}
                >
                  GTBank, Zenith, EcoBank
                </Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedMethod === 'bank' && styles.radioButtonSelected,
                ]}
              />
            </TouchableOpacity>

            {/* Credit/Debit Card */}
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                selectedMethod === 'card' && styles.paymentMethodSelected,
              ]}
              onPress={() => setSelectedMethod('card')}
            >
              <View
                style={[
                  styles.methodIcon,
                  selectedMethod === 'card' && styles.methodIconSelected,
                ]}
              >
                <CreditCardIcon
                  size={20}
                  color={selectedMethod === 'card' ? '#FFFFFF' : '#6B7280'}
                />
              </View>
              <View style={styles.methodInfo}>
                <Text
                  style={[
                    styles.methodTitle,
                    selectedMethod === 'card' && styles.methodTitleSelected,
                  ]}
                >
                  Credit / Debit Card
                </Text>
                <Text
                  style={[
                    styles.methodSubtitle,
                    selectedMethod === 'card' && styles.methodSubtitleSelected,
                  ]}
                >
                  Visa, Mastercard
                </Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedMethod === 'card' && styles.radioButtonSelected,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Card Details (shown when card is selected) */}
        {selectedMethod === 'card' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details</Text>

            <View style={styles.cardForm}>
              {/* Card Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <View style={styles.inputWrapper}>
                  <CreditCardIcon size={16} color="#9CA3AF" />
                  <TextInput
                    style={styles.input}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor="#9CA3AF"
                    value={cardNumber}
                    onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                    keyboardType="numeric"
                    maxLength={19}
                  />
                </View>
              </View>

              {/* Expiry and CVV */}
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="MM/YY"
                      placeholderTextColor="#9CA3AF"
                      value={expiryDate}
                      onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="123"
                      placeholderTextColor="#9CA3AF"
                      value={cvv}
                      onChangeText={setCvv}
                      keyboardType="numeric"
                      maxLength={4}
                      secureTextEntry
                    />
                    <LockIcon size={16} color="#9CA3AF" />
                  </View>
                </View>
              </View>

              {/* Cardholder Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cardholder Name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="John Doe"
                    placeholderTextColor="#9CA3AF"
                    value={cardholderName}
                    onChangeText={setCardholderName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Save Card Toggle */}
              <TouchableOpacity
                style={styles.saveCardRow}
                onPress={() => setSaveCard(!saveCard)}
              >
                <View
                  style={[styles.checkbox, saveCard && styles.checkboxChecked]}
                >
                  {saveCard && <CheckCircleIcon size={16} color="#FFFFFF" />}
                </View>
                <Text style={styles.saveCardText}>
                  Save card for future payments
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <LockIcon size={14} color="#10B981" />
          <Text style={styles.securityText}>
            Your payment information is encrypted and secure
          </Text>
        </View>

        {/* Pay Button */}
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay $125.50</Text>
          <ArrowRightIcon size={16} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Bottom spacing */}
        <View style={{ height: 60 }} />
      </KeyboardAwareScrollView>

      <ConfirmationModal
        visible={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          navigation.goBack();
        }}
        type="success"
        title="Payment Successful!"
        message="Your NAWEC bill payment of $125.50 has been processed successfully. A receipt has been sent to your email."
        actionText="Done"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  nawecBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nawecBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  billCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  billAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  overdueBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overdueText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  dueDate: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  billDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  paymentMethods: {
    gap: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  paymentMethodSelected: {
    borderColor: '#B45309',
    backgroundColor: '#FFFBEB',
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodIconSelected: {
    backgroundColor: '#B45309',
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  methodTitleSelected: {
    color: '#B45309',
  },
  methodSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  methodSubtitleSelected: {
    color: '#92400E',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  radioButtonSelected: {
    borderColor: '#B45309',
    backgroundColor: '#B45309',
  },
  cardForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 48,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  saveCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#B45309',
    borderColor: '#B45309',
  },
  saveCardText: {
    fontSize: 13,
    color: '#374151',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  securityText: {
    fontSize: 12,
    color: '#10B981',
  },
  payButton: {
    flexDirection: 'row',
    backgroundColor: '#B45309',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default NAWECPaymentScreen;
