/**
 * PAYGAM MERCHANT - STANDING ORDER SCREEN
 * Create new standing order / recurring payment for Corporate Merchants
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
  Switch,
  Image,
  Animated,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const ArrowLeftIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const HelpCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={1.5} />
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="17" r="1" fill={color} />
  </Svg>
);

const WalletIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </Svg>
);

const BankIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M4 10h3v7H4zm6.5 0h3v7h-3zM2 19h20v3H2zm15-9h3v7h-3zm-5-9L2 6v2h20V6z" />
  </Svg>
);

const ChevronDownIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UserPlusIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx="8.5" cy="7" r="4" />
    <Path d="M20 8v6M23 11h-6" />
  </Svg>
);

const PhoneIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
  </Svg>
);

const SearchIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={2} />
    <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const CheckCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </Svg>
);

const CheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 10, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const InvoiceIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
  </Svg>
);

const InfinityIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CalendarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
  </Svg>
);

const ArrowRightIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12h14M12 5l7 7-7 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ==================== TYPES ====================
interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  currency: string;
}

interface Beneficiary {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  isVerified: boolean;
  merchantId: string;
}

type Frequency = 'Weekly' | 'Bi-Weekly' | 'Monthly' | 'Quarterly';

// ==================== MAIN COMPONENT ====================
const StandingOrderScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  // State
  const [selectedAccount, setSelectedAccount] = useState<BankAccount>({
    id: '1',
    name: 'Business Current',
    accountNumber: '8832',
    balance: 24500.00,
    currency: 'USD',
  });
  
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 019-2834');
  const [searchedBeneficiary, setSearchedBeneficiary] = useState<Beneficiary | null>({
    id: '1',
    name: 'Emily Richardson',
    phone: '+1 (555) 019-2834',
    avatar: 'https://i.pravatar.cc/150?img=32',
    isVerified: true,
    merchantId: '88291',
  });
  const [beneficiarySelected, setBeneficiarySelected] = useState(true);
  
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('Monthly');
  const [untilFurtherNotice, setUntilFurtherNotice] = useState(false);
  const [endDate, setEndDate] = useState('');
  const [reference, setReference] = useState('');
  
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  
  // Animations
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handleSearch = () => {
    // Simulate search
    if (phoneNumber.trim()) {
      setSearchedBeneficiary({
        id: '1',
        name: 'Emily Richardson',
        phone: phoneNumber,
        avatar: 'https://i.pravatar.cc/150?img=32',
        isVerified: true,
        merchantId: '88291',
      });
      setBeneficiarySelected(true);
    }
  };

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

  const handleNext = () => {
    // Navigate to confirmation or next step
    navigation.navigate('ActionSuccess', {
      type: 'transfer',
      amount: amount || '0.00',
      currency: 'USD',
      destination: searchedBeneficiary?.name || '',
    });
  };

  const frequencies: Frequency[] = ['Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly'];

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'GMD': return 'D';
      case 'GBP': return '£';
      default: return '$';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      <KeyboardAvoidingView 
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeftIcon size={20} color="#6B7280" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>New Standing Order</Text>
          
          <TouchableOpacity style={styles.helpButton} activeOpacity={0.7}>
            <HelpCircleIcon size={22} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Step 1: Source Account */}
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <WalletIcon size={14} color="#293454" />
              <Text style={styles.sectionLabel}>PAY FROM</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.accountCard}
              activeOpacity={0.7}
              onPress={() => setShowAccountPicker(!showAccountPicker)}
            >
              <View style={styles.accountInfo}>
                <LinearGradient
                  colors={['#293454', '#1a2136']}
                  style={styles.accountIcon}
                >
                  <BankIcon size={20} color="#FFFFFF" />
                </LinearGradient>
                <View>
                  <Text style={styles.accountName}>{selectedAccount.name}</Text>
                  <Text style={styles.accountDetails}>
                    **** {selectedAccount.accountNumber}  <Text style={styles.accountBalance}>${selectedAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.chevronContainer}>
                <ChevronDownIcon size={12} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Step 2: Beneficiary Search */}
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <UserPlusIcon size={14} color="#293454" />
              <Text style={styles.sectionLabel}>BENEFICIARY</Text>
            </View>
            
            {/* Search Input */}
            <View style={styles.searchRow}>
              <View style={styles.searchInputContainer}>
                <PhoneIcon size={16} color="#9CA3AF" />
                <TextInput
                  style={styles.searchInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Search phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>
              <TouchableOpacity 
                style={styles.searchButton}
                onPress={handleSearch}
                activeOpacity={0.8}
              >
                <SearchIcon size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Found User Card */}
            {searchedBeneficiary && (
              <View style={styles.beneficiaryCard}>
                <View style={styles.beneficiaryInner}>
                  <View style={styles.avatarContainer}>
                    <Image 
                      source={{ uri: searchedBeneficiary.avatar }}
                      style={styles.avatar}
                    />
                    <View style={styles.onlineIndicator} />
                  </View>
                  <View style={styles.beneficiaryInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.beneficiaryName}>{searchedBeneficiary.name}</Text>
                      {searchedBeneficiary.isVerified && (
                        <CheckCircleIcon size={12} color="#293454" />
                      )}
                    </View>
                    <Text style={styles.beneficiaryDetails}>
                      Verified Merchant  ID: #{searchedBeneficiary.merchantId}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={[
                      styles.selectCheckbox,
                      beneficiarySelected && styles.selectCheckboxActive
                    ]}
                    onPress={() => setBeneficiarySelected(!beneficiarySelected)}
                    activeOpacity={0.7}
                  >
                    {beneficiarySelected && <CheckIcon size={10} color="#FFFFFF" />}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Step 3: Payment Details */}
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <InvoiceIcon size={14} color="#293454" />
              <Text style={styles.sectionLabel}>ORDER DETAILS</Text>
            </View>
            
            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.floatingLabel}>AMOUNT</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencyPrefix}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor="#D1D5DB"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Date and Frequency Row */}
            <View style={styles.twoColumnRow}>
              {/* Start Date */}
              <View style={styles.halfInput}>
                <Text style={styles.floatingLabel}>START DATE</Text>
                <TouchableOpacity style={styles.dateInput} activeOpacity={0.7}>
                  <TextInput
                    style={styles.dateText}
                    value={startDate}
                    onChangeText={setStartDate}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#9CA3AF"
                  />
                  <CalendarIcon size={16} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Frequency */}
              <View style={styles.halfInput}>
                <Text style={styles.floatingLabel}>FREQUENCY</Text>
                <TouchableOpacity 
                  style={styles.selectInput}
                  onPress={() => setShowFrequencyPicker(!showFrequencyPicker)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.selectText}>{frequency}</Text>
                  <ChevronDownIcon size={12} color="#9CA3AF" />
                </TouchableOpacity>
                
                {/* Frequency Dropdown */}
                {showFrequencyPicker && (
                  <View style={styles.dropdown}>
                    {frequencies.map((freq) => (
                      <TouchableOpacity
                        key={freq}
                        style={[
                          styles.dropdownItem,
                          frequency === freq && styles.dropdownItemActive
                        ]}
                        onPress={() => {
                          setFrequency(freq);
                          setShowFrequencyPicker(false);
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          frequency === freq && styles.dropdownItemTextActive
                        ]}>{freq}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Duration Toggle Card */}
            <View style={styles.durationCard}>
              <View style={styles.durationHeader}>
                <View style={styles.durationInfo}>
                  <View style={styles.infinityIconContainer}>
                    <InfinityIcon size={16} color="#293454" />
                  </View>
                  <View>
                    <Text style={styles.durationTitle}>Until further notice</Text>
                    <Text style={styles.durationSubtitle}>Recurring indefinitely</Text>
                  </View>
                </View>
                <Switch
                  value={untilFurtherNotice}
                  onValueChange={setUntilFurtherNotice}
                  trackColor={{ false: '#E5E7EB', true: '#293454' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#E5E7EB"
                />
              </View>

              {/* End Date */}
              {!untilFurtherNotice && (
                <View style={styles.endDateInput}>
                  <Text style={styles.floatingLabelWhite}>END DATE</Text>
                  <TouchableOpacity style={styles.dateInputWhite} activeOpacity={0.7}>
                    <TextInput
                      style={styles.dateText}
                      value={endDate}
                      onChangeText={setEndDate}
                      placeholder="DD/MM/YYYY"
                      placeholderTextColor="#9CA3AF"
                    />
                    <CalendarIcon size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Reference */}
            <View style={styles.inputGroup}>
              <Text style={styles.floatingLabel}>REFERENCE / REASON</Text>
              <TextInput
                style={styles.textInput}
                value={reference}
                onChangeText={setReference}
                placeholder="e.g. Monthly Wages"
                placeholderTextColor="#D1D5DB"
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action */}
        <View style={styles.bottomBar}>
          <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%' }}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <ArrowRightIcon size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  flex: {
    flex: 1,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'rgba(249, 250, 251, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(243, 244, 246, 0.5)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#293454',
    letterSpacing: -0.3,
  },
  helpButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 140,
  },

  // Sections
  section: {
    marginBottom: 32,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
  },

  // Account Card
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#293454',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  accountName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  accountDetails: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  accountBalance: {
    color: '#293454',
    fontWeight: '700',
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Search
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    paddingVertical: 14,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#293454',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#293454',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  // Beneficiary Card
  beneficiaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    borderWidth: 2,
    borderColor: '#293454',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  beneficiaryInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
    borderRadius: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  beneficiaryInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  beneficiaryName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  beneficiaryDetails: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  selectCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectCheckboxActive: {
    backgroundColor: '#293454',
  },

  // Input Groups
  inputGroup: {
    marginBottom: 16,
  },
  floatingLabel: {
    position: 'absolute',
    top: -8,
    left: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    fontSize: 10,
    fontWeight: '700',
    color: '#293454',
    letterSpacing: 0.5,
    zIndex: 1,
  },
  floatingLabelWhite: {
    position: 'absolute',
    top: -8,
    left: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    fontSize: 10,
    fontWeight: '700',
    color: '#293454',
    letterSpacing: 0.5,
    zIndex: 1,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '700',
    color: '#9CA3AF',
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    paddingVertical: 16,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // Two Column Row
  twoColumnRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
    position: 'relative',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateInputWhite: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  // Dropdown
  dropdown: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 100,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(41, 52, 84, 0.05)',
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  dropdownItemTextActive: {
    color: '#293454',
    fontWeight: '700',
  },

  // Duration Card
  durationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  durationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infinityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(41, 52, 84, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  durationSubtitle: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 1,
  },
  endDateInput: {
    marginTop: 16,
    position: 'relative',
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
  },
  nextButton: {
    backgroundColor: '#293454',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#293454',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default StandingOrderScreen;
