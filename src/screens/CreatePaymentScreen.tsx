/**
 * PAYGAM MERCHANT - CREATE PAYMENT SCREEN
 * Corporate Merchant New Payment
 * Features: User search, Amount, Currency selection, Payment details, PIN confirmation
 */

import React, { useState } from 'react';
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
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const BackIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const HistoryIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SearchIcon = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={2} />
    <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const QRCodeIcon = ({ size = 24, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="7" height="7" stroke={color} strokeWidth={2} />
    <Rect x="14" y="3" width="7" height="7" stroke={color} strokeWidth={2} />
    <Rect x="3" y="14" width="7" height="7" stroke={color} strokeWidth={2} />
    <Rect x="14" y="14" width="3" height="3" fill={color} />
    <Rect x="18" y="14" width="3" height="3" fill={color} />
    <Rect x="14" y="18" width="3" height="3" fill={color} />
    <Rect x="18" y="18" width="3" height="3" fill={color} />
  </Svg>
);

const CheckCircleIcon = ({ size = 20, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronDownIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowRightIcon = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12h14M12 5l7 7-7 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LockIcon = ({ size = 28, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth={2} />
    <Path d="M7 11V7a5 5 0 0110 0v4" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const FingerprintIcon = ({ size = 28, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 018 4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M5 19.5C5.5 18 6 15 6 12c0-3.5 2.5-6 6-6 1.5 0 3 .5 4 1.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M8.5 22c.5-2 1-5 1-8.5a2.5 2.5 0 015 0c0 5-1 8-1 8" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M14 18c.5-2 .5-4 .5-6a.5.5 0 00-1 0" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M17 18c1-2 2-6 2-10" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M22 22c0-2.5-.5-5-.5-8" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const BackspaceIcon = ({ size = 24, color = '#374151' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M18 9l-6 6M12 9l6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ==================== TYPES ====================
interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface Recipient {
  id: string;
  name: string;
  initials: string;
  accountId: string;
  type: string;
}

interface Category {
  id: string;
  label: string;
}

// ==================== MOCK DATA ====================
const currencies: Currency[] = [
  { code: 'GMD', symbol: 'D', name: 'Gambian Dalasi' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'XOF', symbol: 'CFA', name: 'CFA Franc' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

const categories: Category[] = [
  { id: 'vendor', label: 'Vendor Payment' },
  { id: 'salary', label: 'Salary / Wage' },
  { id: 'refund', label: 'Refund' },
  { id: 'logistics', label: 'Logistics' },
  { id: 'other', label: 'Other' },
];

// ==================== MAIN COMPONENT ====================
const CreatePaymentScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [recipient, setRecipient] = useState<Recipient | null>({
    id: '8839201',
    name: 'John Doe Enterprises',
    initials: 'JD',
    accountId: '8839201',
    type: 'Corporate Client',
  });
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [paymentTitle, setPaymentTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [note, setNote] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState<string[]>([]);

  const availableBalance = 124500.00;

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = [...pin, digit];
      setPin(newPin);
      
      if (newPin.length === 4) {
        // Simulate PIN verification
        setTimeout(() => {
          setShowPinModal(false);
          setPin([]);
          navigation.navigate('ActionSuccess', {
            title: 'Payment Sent!',
            message: `${selectedCurrency.symbol}${amount} has been sent to ${recipient?.name}`,
            actionText: 'Back to Dashboard',
            navigateTo: 'CorporateMerchantDashboard',
          });
        }, 500);
      }
    }
  };

  const handlePinDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const handleBiometric = () => {
    // Simulate biometric auth
    setTimeout(() => {
      setShowPinModal(false);
      setPin([]);
      navigation.navigate('ActionSuccess', {
        title: 'Payment Sent!',
        message: `${selectedCurrency.symbol}${amount} has been sent to ${recipient?.name}`,
        actionText: 'Back to Dashboard',
        navigateTo: 'CorporateMerchantDashboard',
      });
    }, 500);
  };

  const formatAmount = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    return cleaned;
  };

  const displayTotal = parseFloat(amount || '0').toFixed(2);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#293454" />
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }} />
          
          {/* Top Navigation */}
          <View style={styles.headerNav}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.goBack()}
            >
              <BackIcon size={22} color="#FFFFFF" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>New Payment</Text>
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.navigate('TransactionHistory')}
            >
              <HistoryIcon size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Balance Display */}
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
            <Text style={styles.balanceAmount}>
              {selectedCurrency.symbol}{availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Pay To Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Pay To</Text>
            <View style={styles.searchContainer}>
              <View style={styles.searchIconContainer}>
                <SearchIcon size={18} color="#9CA3AF" />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Search username, ID, or phone..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity style={styles.qrButton}>
                <QRCodeIcon size={22} color="#293454" />
              </TouchableOpacity>
            </View>

            {/* Selected Recipient */}
            {recipient && (
              <View style={styles.recipientCard}>
                <View style={styles.recipientAvatar}>
                  <Text style={styles.recipientInitials}>{recipient.initials}</Text>
                </View>
                <View style={styles.recipientInfo}>
                  <Text style={styles.recipientName}>{recipient.name}</Text>
                  <Text style={styles.recipientDetails}>ID: {recipient.accountId} • {recipient.type}</Text>
                </View>
                <CheckCircleIcon size={20} color="#22C55E" />
              </View>
            )}
          </View>

          {/* Amount Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Amount</Text>
            <View style={styles.amountRow}>
              {/* Currency Selector */}
              <TouchableOpacity 
                style={styles.currencySelector}
                onPress={() => setShowCurrencyPicker(true)}
              >
                <Text style={styles.currencySelectorText}>{selectedCurrency.code}</Text>
                <ChevronDownIcon size={14} color="#6B7280" />
              </TouchableOpacity>
              
              {/* Amount Input */}
              <View style={styles.amountInputContainer}>
                <View style={styles.amountPrefix}>
                  <Text style={styles.amountPrefixText}>{selectedCurrency.symbol}</Text>
                </View>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor="#D1D5DB"
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={(text) => setAmount(formatAmount(text))}
                />
              </View>
            </View>
          </View>

          {/* Payment Details Section */}
          <View style={styles.section}>
            {/* Payment Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PAYMENT TITLE</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Q3 Service Payment"
                placeholderTextColor="#9CA3AF"
                value={paymentTitle}
                onChangeText={setPaymentTitle}
              />
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CATEGORY / REASON</Text>
              <TouchableOpacity 
                style={styles.selectInput}
                onPress={() => setShowCategoryPicker(true)}
              >
                <Text style={[
                  styles.selectInputText,
                  !selectedCategory && styles.selectInputPlaceholder,
                ]}>
                  {selectedCategory?.label || 'Select a reason'}
                </Text>
                <ChevronDownIcon size={14} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Note */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>NOTE (OPTIONAL)</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Add a reference note..."
                placeholderTextColor="#9CA3AF"
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Payment</Text>
            <Text style={styles.totalAmount}>{selectedCurrency.symbol}{displayTotal}</Text>
          </View>
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={() => setShowPinModal(true)}
            activeOpacity={0.9}
          >
            <Text style={styles.submitButtonText}>Proceed to Pay</Text>
            <ArrowRightIcon size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Currency Picker Modal */}
      <Modal
        visible={showCurrencyPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCurrencyPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Currency</Text>
            
            {currencies.map((currency) => (
              <TouchableOpacity
                key={currency.code}
                style={[
                  styles.pickerItem,
                  selectedCurrency.code === currency.code && styles.pickerItemActive,
                ]}
                onPress={() => {
                  setSelectedCurrency(currency);
                  setShowCurrencyPicker(false);
                }}
              >
                <View style={styles.pickerItemLeft}>
                  <View style={[
                    styles.currencyBadge,
                    selectedCurrency.code === currency.code && styles.currencyBadgeActive,
                  ]}>
                    <Text style={[
                      styles.currencyBadgeText,
                      selectedCurrency.code === currency.code && styles.currencyBadgeTextActive,
                    ]}>
                      {currency.symbol}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.pickerItemTitle}>{currency.code}</Text>
                    <Text style={styles.pickerItemSubtitle}>{currency.name}</Text>
                  </View>
                </View>
                {selectedCurrency.code === currency.code && (
                  <CheckCircleIcon size={22} color="#293454" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Category</Text>
            
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.pickerItem,
                  selectedCategory?.id === category.id && styles.pickerItemActive,
                ]}
                onPress={() => {
                  setSelectedCategory(category);
                  setShowCategoryPicker(false);
                }}
              >
                <Text style={styles.pickerItemTitle}>{category.label}</Text>
                {selectedCategory?.id === category.id && (
                  <CheckCircleIcon size={22} color="#293454" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* PIN Modal */}
      <Modal
        visible={showPinModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPinModal(false)}
      >
        <View style={styles.pinModalOverlay}>
          <TouchableOpacity 
            style={styles.pinModalBackdrop}
            activeOpacity={1}
            onPress={() => setShowPinModal(false)}
          />
          <View style={styles.pinModalContent}>
            <View style={styles.modalHandle} />
            
            {/* Lock Icon */}
            <View style={styles.pinIconContainer}>
              <LockIcon size={28} color="#293454" />
            </View>
            
            <Text style={styles.pinTitle}>Confirm Transaction</Text>
            <Text style={styles.pinSubtitle}>Enter your 4-digit PIN to authorize</Text>

            {/* PIN Dots */}
            <View style={styles.pinDotsContainer}>
              {[0, 1, 2, 3].map((index) => (
                <View
                  key={index}
                  style={[
                    styles.pinDot,
                    pin.length > index && styles.pinDotFilled,
                  ]}
                />
              ))}
            </View>

            {/* Numeric Keypad */}
            <View style={styles.keypad}>
              {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['bio', '0', 'del']].map((row, rowIndex) => (
                <View key={rowIndex} style={styles.keypadRow}>
                  {row.map((key) => (
                    <TouchableOpacity
                      key={key}
                      style={styles.keypadButton}
                      onPress={() => {
                        if (key === 'bio') {
                          handleBiometric();
                        } else if (key === 'del') {
                          handlePinDelete();
                        } else {
                          handlePinInput(key);
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      {key === 'bio' ? (
                        <FingerprintIcon size={28} color="#293454" />
                      ) : key === 'del' ? (
                        <BackspaceIcon size={24} color="#374151" />
                      ) : (
                        <Text style={styles.keypadButtonText}>{key}</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>

            {/* Confirm Button */}
            <TouchableOpacity 
              style={[
                styles.confirmButton,
                pin.length < 4 && styles.confirmButtonDisabled,
              ]}
              disabled={pin.length < 4}
              onPress={() => {}}
            >
              <Text style={styles.confirmButtonText}>Confirm Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  
  // Header
  header: {
    backgroundColor: '#293454',
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  balanceContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#93C5FD',
    letterSpacing: 1,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  
  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 200,
  },
  
  // Sections
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 10,
    marginLeft: 4,
  },
  
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIconContainer: {
    paddingLeft: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#374151',
  },
  qrButton: {
    paddingRight: 16,
  },
  
  // Recipient Card
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
  },
  recipientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#293454',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipientInitials: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  recipientInfo: {
    flex: 1,
    marginLeft: 12,
  },
  recipientName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#293454',
    marginBottom: 2,
  },
  recipientDetails: {
    fontSize: 12,
    color: '#6B7280',
  },
  
  // Amount Row
  amountRow: {
    flexDirection: 'row',
    gap: 12,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  currencySelectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  amountInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  amountPrefix: {
    paddingLeft: 16,
  },
  amountPrefixText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6B7280',
  },
  amountInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    paddingRight: 16,
    fontSize: 24,
    fontWeight: '700',
    color: '#293454',
  },
  
  // Input Groups
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 14,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectInputText: {
    fontSize: 14,
    color: '#374151',
  },
  selectInputPlaceholder: {
    color: '#9CA3AF',
  },
  
  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#293454',
  },
  submitButton: {
    backgroundColor: '#293454',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pickerModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  modalHandle: {
    width: 48,
    height: 5,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  pickerItemActive: {
    backgroundColor: '#EFF6FF',
  },
  pickerItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pickerItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  pickerItemSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  currencyBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyBadgeActive: {
    backgroundColor: '#293454',
  },
  currencyBadgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
  currencyBadgeTextActive: {
    color: '#FFFFFF',
  },
  
  // PIN Modal
  pinModalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  pinModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  pinModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  pinIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  pinTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  pinSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
  },
  pinDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 28,
    marginBottom: 28,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  pinDotFilled: {
    backgroundColor: '#293454',
    borderColor: '#293454',
  },
  keypad: {
    maxWidth: 280,
    alignSelf: 'center',
    marginBottom: 24,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 12,
  },
  keypadButton: {
    width: 70,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypadButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
  },
  confirmButton: {
    backgroundColor: '#293454',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default CreatePaymentScreen;
