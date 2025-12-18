/**
 * PAYGAM MERCHANT - CREATE STANDING ORDER SCREEN
 * Form to create new recurring payments for Corporate Merchants
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
  Switch,
  Image,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const ArrowLeftIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const HelpCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#9CA3AF' }) => (
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
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="8.5" cy="7" r="4" stroke={color} strokeWidth={2} />
    <Path d="M20 8v6M23 11h-6" stroke={color} strokeWidth={2} strokeLinecap="round" />
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

const InfinityIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowRightIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12h14M12 5l7 7-7 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CalendarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ==================== MAIN COMPONENT ====================
const CreateStandingOrderScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  // Form state
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 019-2834');
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [frequency, setFrequency] = useState('Monthly');
  const [reference, setReference] = useState('');
  const [untilFurtherNotice, setUntilFurtherNotice] = useState(false);
  const [beneficiaryFound, setBeneficiaryFound] = useState(true);
  const [beneficiarySelected, setBeneficiarySelected] = useState(true);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const frequencies = ['Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly'];

  // Generate date options for picker
  const generateDateOptions = (): string[] => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      dates.push(`${day}/${month}/${year}`);
    }
    return dates;
  };

  const dateOptions = generateDateOptions();

  const handleSearch = () => {
    // Search for beneficiary
    setBeneficiaryFound(true);
  };

  const handleNext = () => {
    // Navigate to confirmation or next step
    navigation.navigate('ActionSuccess', {
      title: 'Standing Order Created',
      message: 'Your recurring payment has been set up successfully.',
      type: 'standing-order',
      navigateTo: 'CorporateMerchantDashboard',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon size={20} color="#6B7280" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>New Standing Order</Text>
        
        <TouchableOpacity style={styles.helpButton}>
          <HelpCircleIcon size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Step 1: Source Account */}
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <WalletIcon size={14} color="#293454" />
              <Text style={styles.sectionLabel}>PAY FROM</Text>
            </View>
            
            <TouchableOpacity style={styles.accountCard}>
              <View style={styles.accountCardInner}>
                <View style={styles.accountIcon}>
                  <BankIcon size={20} color="#FFFFFF" />
                </View>
                <View style={styles.accountInfo}>
                  <Text style={styles.accountName}>Business Current</Text>
                  <Text style={styles.accountDetails}>
                    **** 8832 • <Text style={styles.accountBalance}>$24,500.00</Text>
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
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <SearchIcon size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Found User Card */}
            {beneficiaryFound && (
              <View style={[styles.beneficiaryCard, beneficiarySelected && styles.beneficiaryCardSelected]}>
                <View style={styles.beneficiaryInner}>
                  <View style={styles.beneficiaryAvatar}>
                    <Image 
                      source={{ uri: 'https://i.pravatar.cc/150?img=32' }} 
                      style={styles.avatarImage}
                    />
                    <View style={styles.onlineDot} />
                  </View>
                  <View style={styles.beneficiaryInfo}>
                    <View style={styles.beneficiaryNameRow}>
                      <Text style={styles.beneficiaryName}>Emily Richardson</Text>
                      <CheckCircleIcon size={12} color="#293454" />
                    </View>
                    <Text style={styles.beneficiaryDetails}>Verified Merchant • ID: #88291</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => setBeneficiarySelected(!beneficiarySelected)}
                  >
                    <View style={[styles.checkbox, beneficiarySelected && styles.checkboxSelected]}>
                      {beneficiarySelected && <CheckIcon size={10} color="#FFFFFF" />}
                    </View>
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
                <Text style={styles.currencySymbol}>$</Text>
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

            {/* Date & Frequency Row */}
            <View style={styles.row}>
              {/* Start Date */}
              <View style={[styles.inputGroup, styles.halfInput]}>
                <Text style={styles.floatingLabel}>START DATE</Text>
                <TouchableOpacity 
                  style={styles.dateInput}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text style={[styles.dateInputText, !startDate && { color: '#9CA3AF' }]}>
                    {startDate || 'DD/MM/YYYY'}
                  </Text>
                  <CalendarIcon size={16} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Frequency */}
              <View style={[styles.inputGroup, styles.halfInput]}>
                <Text style={styles.floatingLabel}>FREQUENCY</Text>
                <TouchableOpacity 
                  style={styles.selectInput}
                  onPress={() => setShowFrequencyPicker(!showFrequencyPicker)}
                >
                  <Text style={styles.selectText}>{frequency}</Text>
                  <ChevronDownIcon size={12} color="#9CA3AF" />
                </TouchableOpacity>
                
                {showFrequencyPicker && (
                  <View style={styles.pickerDropdown}>
                    {frequencies.map((freq) => (
                      <TouchableOpacity
                        key={freq}
                        style={[styles.pickerItem, freq === frequency && styles.pickerItemSelected]}
                        onPress={() => {
                          setFrequency(freq);
                          setShowFrequencyPicker(false);
                        }}
                      >
                        <Text style={[styles.pickerItemText, freq === frequency && styles.pickerItemTextSelected]}>
                          {freq}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Duration Toggle */}
            <View style={styles.durationCard}>
              <View style={styles.durationHeader}>
                <View style={styles.durationLeft}>
                  <View style={styles.infinityIconContainer}>
                    <InfinityIcon size={18} color="#293454" />
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
                />
              </View>

              {/* End Date (when not indefinite) */}
              {!untilFurtherNotice && (
                <View style={styles.endDateContainer}>
                  <Text style={styles.floatingLabelWhite}>END DATE</Text>
                  <TouchableOpacity 
                    style={styles.dateInputWhite}
                    onPress={() => setShowEndDatePicker(true)}
                  >
                    <Text style={[styles.dateInputTextWhite, !endDate && { color: '#9CA3AF' }]}>
                      {endDate || 'DD/MM/YYYY'}
                    </Text>
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
      </KeyboardAvoidingView>

      {/* Footer Action */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
          <ArrowRightIcon size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Start Date Picker Modal */}
      <Modal
        visible={showStartDatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStartDatePicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowStartDatePicker(false)}
        >
          <View style={styles.datePickerModal}>
            <View style={styles.datePickerHeader}>
              <Text style={styles.datePickerTitle}>Select Start Date</Text>
              <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                <Text style={styles.datePickerDone}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
              {dateOptions.map((date) => (
                <TouchableOpacity
                  key={date}
                  style={[styles.datePickerItem, startDate === date && styles.datePickerItemSelected]}
                  onPress={() => {
                    setStartDate(date);
                    setShowStartDatePicker(false);
                  }}
                >
                  <Text style={[styles.datePickerItemText, startDate === date && styles.datePickerItemTextSelected]}>
                    {date}
                  </Text>
                  {startDate === date && <CheckIcon size={14} color="#293454" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* End Date Picker Modal */}
      <Modal
        visible={showEndDatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEndDatePicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowEndDatePicker(false)}
        >
          <View style={styles.datePickerModal}>
            <View style={styles.datePickerHeader}>
              <Text style={styles.datePickerTitle}>Select End Date</Text>
              <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                <Text style={styles.datePickerDone}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
              {dateOptions.map((date) => (
                <TouchableOpacity
                  key={date}
                  style={[styles.datePickerItem, endDate === date && styles.datePickerItemSelected]}
                  onPress={() => {
                    setEndDate(date);
                    setShowEndDatePicker(false);
                  }}
                >
                  <Text style={[styles.datePickerItemText, endDate === date && styles.datePickerItemTextSelected]}>
                    {date}
                  </Text>
                  {endDate === date && <CheckIcon size={14} color="#293454" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
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
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  accountCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  accountIcon: {
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
  accountInfo: {
    gap: 4,
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
  searchRow: {
    flexDirection: 'row',
    gap: 8,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
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
  beneficiaryCard: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  beneficiaryCardSelected: {
    borderColor: '#293454',
    transform: [{ scale: 1.02 }],
  },
  beneficiaryInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
    borderRadius: 12,
    gap: 12,
  },
  beneficiaryAvatar: {
    position: 'relative',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineDot: {
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
  beneficiaryNameRow: {
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
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  checkboxContainer: {
    padding: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#293454',
  },
  inputGroup: {
    marginBottom: 16,
    position: 'relative',
  },
  halfInput: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  amountInput: {
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 8,
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
  dateInputText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  dateInputTextWhite: {
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  pickerDropdown: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pickerItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerItemSelected: {
    backgroundColor: '#F3F4F6',
  },
  pickerItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  pickerItemTextSelected: {
    color: '#293454',
    fontWeight: '700',
  },
  durationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  durationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationLeft: {
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
    marginTop: 2,
  },
  endDateContainer: {
    marginTop: 16,
    position: 'relative',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
  // Date Picker Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '60%',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#293454',
  },
  datePickerDone: {
    fontSize: 16,
    fontWeight: '600',
    color: '#293454',
  },
  datePickerScroll: {
    maxHeight: 350,
  },
  datePickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  datePickerItemSelected: {
    backgroundColor: '#EFF6FF',
  },
  datePickerItemText: {
    fontSize: 16,
    color: '#1F2937',
  },
  datePickerItemTextSelected: {
    fontWeight: '600',
    color: '#293454',
  },
});

export default CreateStandingOrderScreen;
