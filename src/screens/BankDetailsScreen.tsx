/**
 * PAYGAM MERCHANT - BANK DETAILS SCREEN
 * Manage bank accounts for withdrawals
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
  Animated,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const ArrowLeftIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#4B5563' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BankBuildingIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M4 10h3v7H4zm6.5 0h3v7h-3zM2 19h20v3H2zm15-9h3v7h-3zm-5-9L2 6v2h20V6z" />
  </Svg>
);

const LandmarkIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L2 7h20L12 2zM2 22h20v-2H2v2zm4-4h2v-7H6v7zm5 0h2v-7h-2v7zm5 0h2v-7h-2v7z" fill={color} />
  </Svg>
);

const CheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PlusIcon: React.FC<{ size?: number; color?: string }> = ({ size = 28, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
  </Svg>
);

const CloseIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const BuildingIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
  </Svg>
);

const MoneyCheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M21 7H3c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H3V9h18v6zm-9-4c-1.1 0-2 .9-2 2h2v-2zm0-1c1.1 0 2-.9 2-2h-2v2z" />
  </Svg>
);

// ==================== TYPES ====================
interface BankAccount {
  id: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  sortCode: string;
  isSelected: boolean;
}

type AccountType = 'Current' | 'Savings';

// ==================== MAIN COMPONENT ====================
const BankDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const toastAnim = useRef(new Animated.Value(-100)).current;
  
  // Form state
  const [bankName, setBankName] = useState('');
  const [sortCode, setSortCode] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('Current');
  const [billingAddress, setBillingAddress] = useState('');
  
  // Bank accounts list
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      bankName: 'Barclays Bank',
      accountType: 'Business Account',
      accountNumber: '4582',
      sortCode: '20-14-55',
      isSelected: true,
    },
    {
      id: '2',
      bankName: 'HSBC UK',
      accountType: 'Savings Account',
      accountNumber: '9921',
      sortCode: '40-02-11',
      isSelected: false,
    },
  ]);

  const handleSelectBank = (id: string) => {
    setBankAccounts(prev =>
      prev.map(bank => ({
        ...bank,
        isSelected: bank.id === id,
      }))
    );
  };

  const showToast = () => {
    setToastVisible(true);
    Animated.sequence([
      Animated.timing(toastAnim, {
        toValue: 60,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.delay(2500),
      Animated.timing(toastAnim, {
        toValue: -100,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => setToastVisible(false));
  };

  const handleSaveBank = () => {
    if (!bankName.trim() || !sortCode.trim() || !accountNum.trim()) {
      Alert.alert('Required Fields', 'Please fill in all required fields');
      return;
    }

    const newBank: BankAccount = {
      id: Date.now().toString(),
      bankName: bankName.trim(),
      accountType: `${accountType} Account`,
      accountNumber: accountNum.slice(-4),
      sortCode: sortCode,
      isSelected: false,
    };

    setBankAccounts(prev => [...prev, newBank]);
    setModalVisible(false);
    resetForm();
    showToast();
    
    // Auto-select new bank
    setTimeout(() => handleSelectBank(newBank.id), 100);
  };

  const resetForm = () => {
    setBankName('');
    setSortCode('');
    setAccountNum('');
    setAccountType('Current');
    setBillingAddress('');
  };

  const formatSortCode = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 6)}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeftIcon size={20} color="#4B5563" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Bank Details</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.subtitle}>
            Select a bank account for withdrawals or add a new one.
          </Text>

          {/* Bank Cards */}
          {bankAccounts.map((bank) => (
            <TouchableOpacity
              key={bank.id}
              style={[
                styles.bankCard,
                bank.isSelected && styles.bankCardSelected,
              ]}
              onPress={() => handleSelectBank(bank.id)}
              activeOpacity={0.8}
            >
              <View style={styles.bankCardHeader}>
                <View style={styles.bankCardLeft}>
                  <View style={[
                    styles.bankIconContainer,
                    bank.isSelected && styles.bankIconContainerSelected,
                  ]}>
                    {bank.id === '1' ? (
                      <BankBuildingIcon size={22} color={bank.isSelected ? '#293454' : '#293454'} />
                    ) : (
                      <LandmarkIcon size={22} color={bank.isSelected ? '#6B7280' : '#6B7280'} />
                    )}
                  </View>
                  <View>
                    <Text style={styles.bankName}>{bank.bankName}</Text>
                    <Text style={styles.accountType}>{bank.accountType}</Text>
                  </View>
                </View>
                <View style={[
                  styles.selectionIndicator,
                  bank.isSelected && styles.selectionIndicatorSelected,
                ]}>
                  {bank.isSelected && <CheckIcon size={12} color="#FFFFFF" />}
                </View>
              </View>
              
              <View style={styles.bankCardDivider} />
              
              <View style={styles.bankCardDetails}>
                <View>
                  <Text style={styles.detailLabel}>ACCOUNT NUMBER</Text>
                  <Text style={styles.detailValue}> {bank.accountNumber}</Text>
                </View>
                <View style={styles.detailRight}>
                  <Text style={styles.detailLabel}>SORT CODE</Text>
                  <Text style={styles.detailValue}>{bank.sortCode}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.9}
        >
          <PlusIcon size={28} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Add Bank Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={() => setModalVisible(false)}
            />
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Bank</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <CloseIcon size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Modal Body */}
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {/* Bank Name */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>BANK NAME</Text>
                  <View style={styles.inputWithIcon}>
                    <BuildingIcon size={18} color="#9CA3AF" />
                    <TextInput
                      style={styles.inputWithIconField}
                      placeholder="e.g. Lloyds Bank"
                      placeholderTextColor="#9CA3AF"
                      value={bankName}
                      onChangeText={setBankName}
                    />
                  </View>
                </View>

                {/* Sort Code & Account Number */}
                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.formLabel}>SORT CODE</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="00-00-00"
                      placeholderTextColor="#9CA3AF"
                      value={sortCode}
                      onChangeText={(text) => setSortCode(formatSortCode(text))}
                      maxLength={8}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.formLabel}>ACCOUNT NO.</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="12345678"
                      placeholderTextColor="#9CA3AF"
                      value={accountNum}
                      onChangeText={setAccountNum}
                      maxLength={12}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Account Type */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>ACCOUNT TYPE</Text>
                  <View style={styles.accountTypeRow}>
                    <TouchableOpacity
                      style={[
                        styles.accountTypeButton,
                        accountType === 'Current' && styles.accountTypeButtonActive,
                      ]}
                      onPress={() => setAccountType('Current')}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.accountTypeText,
                        accountType === 'Current' && styles.accountTypeTextActive,
                      ]}>Current</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.accountTypeButton,
                        accountType === 'Savings' && styles.accountTypeButtonActive,
                      ]}
                      onPress={() => setAccountType('Savings')}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.accountTypeText,
                        accountType === 'Savings' && styles.accountTypeTextActive,
                      ]}>Savings</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Billing Address */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>BILLING ADDRESS</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Street, City, Postcode"
                    placeholderTextColor="#9CA3AF"
                    value={billingAddress}
                    onChangeText={setBillingAddress}
                    multiline
                    numberOfLines={2}
                    textAlignVertical="top"
                  />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSaveBank}
                  activeOpacity={0.9}
                >
                  <Text style={styles.submitButtonText}>Save Bank Details</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Success Toast */}
        {toastVisible && (
          <Animated.View
            style={[
              styles.toast,
              { transform: [{ translateY: toastAnim }] },
            ]}
          >
            <View style={styles.toastCheckIcon}>
              <CheckIcon size={12} color="#293454" />
            </View>
            <Text style={styles.toastText}>Bank added successfully!</Text>
          </Animated.View>
        )}
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

  // Header
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#293454',
  },
  editButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#293454',
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },

  // Bank Card
  bankCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bankCardSelected: {
    borderWidth: 2,
    borderColor: '#293454',
  },
  bankCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bankCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bankIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankIconContainerSelected: {
    backgroundColor: '#F3F4F6',
  },
  bankName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  accountType: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  selectionIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionIndicatorSelected: {
    backgroundColor: '#293454',
    borderColor: '#293454',
  },
  bankCardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
  },
  bankCardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 2,
  },
  detailRight: {
    alignItems: 'flex-end',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#293454',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#293454',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#293454',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 24,
  },

  // Form
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  formRow: {
    flexDirection: 'row',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  inputWithIconField: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    minHeight: 64,
    paddingTop: 12,
  },
  accountTypeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  accountTypeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  accountTypeButtonActive: {
    backgroundColor: '#293454',
    borderColor: '#293454',
  },
  accountTypeText: {
    fontSize: 14,
    color: '#4B5563',
  },
  accountTypeTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#293454',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#293454',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Toast
  toast: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#293454',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    alignSelf: 'center',
  },
  toastCheckIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4ADE80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default BankDetailsScreen;
