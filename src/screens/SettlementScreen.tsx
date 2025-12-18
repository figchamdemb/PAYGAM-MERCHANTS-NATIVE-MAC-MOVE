/**
 * PAYGAM MERCHANT - SETTLEMENT SCREEN
 * Settlement/withdrawal screen for all merchant types
 * Features:
 * - To Wallet: Mobile money wallets (Africell, QMoney, Gamcel) with phone input
 * - To Bank: Bank account selection with dropdown
 * - Cashout: QR code generation for agent cashout with request list
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
  ScrollView,
  TextInput,
  Animated,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const ArrowLeftIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BellIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const WalletIcon = ({ size = 20, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </Svg>
);

const BankIcon = ({ size = 20, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z" />
  </Svg>
);

const CashoutIcon = ({ size = 20, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M6.5 10h-2v7h2v-7zm6 0h-2v7h2v-7zm8.5 9H2v2h19v-2zm-2.5-9h-2v7h2v-7zm-7-6.74L16.71 6H6.29l5.21-2.74m0-2.26L2 6v2h19V6l-9.5-5z" />
  </Svg>
);

const ChevronDownIcon = ({ size = 14, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SendIcon = ({ size = 14, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </Svg>
);

const CloseIcon = ({ size = 24, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckIcon = ({ size = 20, color = '#059669' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const QRCodeIcon = ({ size = 80, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2zM17 17h2v2h-2zM15 19h2v2h-2zM19 19h2v2h-2z" />
  </Svg>
);

const ClockIcon = ({ size = 18, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const PhoneIcon = ({ size = 18, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SearchIcon = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={2} />
    <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// ==================== TYPES ====================
type SettlementType = 'wallet' | 'bank' | 'cashout';
type MerchantType = 'general' | 'fuel' | 'corporate';
type CashoutStatus = 'pending' | 'approved' | 'redeemed' | 'expired';

interface WalletProvider {
  id: string;
  name: string;
  code: string;
  color: string;
  logo: string;
}

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  color: string;
}

interface CashoutRequest {
  id: string;
  amount: string;
  currency: string;
  status: CashoutStatus;
  createdAt: string;
  expiresAt: string;
  qrCode?: string;
}

interface RouteParams {
  merchantType?: MerchantType;
}

// ==================== DATA ====================
const WALLET_PROVIDERS: WalletProvider[] = [
  { id: '1', name: 'Africell Money', code: 'AFCM', color: '#FF6B00', logo: 'A' },
  { id: '2', name: 'QMoney', code: 'QMON', color: '#00A651', logo: 'Q' },
  { id: '3', name: 'Gamcel', code: 'GMCL', color: '#E31837', logo: 'G' },
];

const BANK_ACCOUNTS: BankAccount[] = [
  { id: '1', bankName: 'GTBank Gambia', accountNumber: '****4582', accountName: 'PayGam Merchant', color: '#FF6600' },
  { id: '2', bankName: 'Standard Chartered', accountNumber: '****7823', accountName: 'PayGam Business', color: '#0072CE' },
  { id: '3', bankName: 'Ecobank Gambia', accountNumber: '****3901', accountName: 'PayGam Ltd', color: '#003B7A' },
  { id: '4', bankName: 'Trust Bank Limited', accountNumber: '****6542', accountName: 'PayGam Store', color: '#00843D' },
  { id: '5', bankName: 'Access Bank', accountNumber: '****1234', accountName: 'PayGam Corp', color: '#F26522' },
];

const CASHOUT_REQUESTS: CashoutRequest[] = [
  { id: 'CSH-001', amount: '5,000.00', currency: 'GMD', status: 'approved', createdAt: 'Today 10:30 AM', expiresAt: '24 hours' },
  { id: 'CSH-002', amount: '2,500.00', currency: 'GMD', status: 'pending', createdAt: 'Today 09:15 AM', expiresAt: 'Pending approval' },
  { id: 'CSH-003', amount: '10,000.00', currency: 'GMD', status: 'redeemed', createdAt: 'Yesterday', expiresAt: 'Completed' },
  { id: 'CSH-004', amount: '3,000.00', currency: 'GMD', status: 'expired', createdAt: '2 days ago', expiresAt: 'Expired' },
];

// ==================== MAIN COMPONENT ====================
const SettlementScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as RouteParams | undefined;
  
  const merchantType: MerchantType = params?.merchantType || 'general';
  
  // State
  const [selectedCurrency, setSelectedCurrency] = useState('GMD');
  const [selectedType, setSelectedType] = useState<SettlementType>('bank');
  const [amount, setAmount] = useState('');
  
  // Wallet state
  const [selectedWallet, setSelectedWallet] = useState<WalletProvider | null>(null);
  const [walletPhone, setWalletPhone] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  
  // Bank state
  const [selectedBank, setSelectedBank] = useState<BankAccount>(BANK_ACCOUNTS[0]);
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankSearch, setBankSearch] = useState('');
  
  // Cashout state
  const [cashoutRequests, setCashoutRequests] = useState<CashoutRequest[]>(CASHOUT_REQUESTS);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedCashout, setSelectedCashout] = useState<CashoutRequest | null>(null);
  
  const buttonScale = useRef(new Animated.Value(1)).current;

  const currencies = ['GMD', 'USD', 'GBP', 'EUR'];
  
  const balances: Record<string, string> = {
    GMD: '142,500.00',
    USD: '2,850.00',
    GBP: '2,125.00',
    EUR: '2,450.00',
  };

  const isTypeAvailable = (type: SettlementType): boolean => {
    if (merchantType === 'general') return true;
    if (merchantType === 'fuel' || merchantType === 'corporate') {
      return type === 'bank';
    }
    return true;
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.98, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();
  };

  const getTargetDashboard = () => {
    if (merchantType === 'corporate') return 'CorporateMerchantDashboard';
    if (merchantType === 'fuel') return 'FuelMerchantDashboard';
    return 'GeneralMerchantDashboard';
  };

  const handleSendRequest = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (selectedType === 'wallet') {
      if (!selectedWallet) {
        Alert.alert('Error', 'Please select a wallet provider');
        return;
      }
      if (!walletPhone || walletPhone.length < 7) {
        Alert.alert('Error', 'Please enter a valid phone number');
        return;
      }
    }

    if (selectedType === 'cashout') {
      // Generate cashout request
      const newRequest: CashoutRequest = {
        id: `CSH-${Date.now().toString().slice(-3)}`,
        amount: parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 }),
        currency: selectedCurrency,
        status: 'pending',
        createdAt: 'Just now',
        expiresAt: 'Pending approval',
      };
      setCashoutRequests([newRequest, ...cashoutRequests]);
      Alert.alert('Success', 'Cashout request submitted. You will be notified when approved.');
      setAmount('');
      return;
    }

    navigation.navigate('ActionSuccess', {
      type: 'withdrawal',
      title: selectedType === 'wallet' ? 'Wallet Transfer Requested' : 'Bank Transfer Requested',
      message: selectedType === 'wallet' 
        ? `${selectedCurrency} ${amount} will be sent to ${selectedWallet?.name} (${walletPhone})`
        : `${selectedCurrency} ${amount} will be sent to ${selectedBank.bankName}`,
      amount: parseFloat(amount.replace(/,/g, '')) || 0,
      currency: selectedCurrency,
      navigateTo: getTargetDashboard(),
    });
  };

  const handleViewQR = (request: CashoutRequest) => {
    if (request.status === 'approved') {
      setSelectedCashout(request);
      setShowQRModal(true);
    } else if (request.status === 'pending') {
      Alert.alert('Pending', 'This request is still pending approval.');
    } else if (request.status === 'redeemed') {
      Alert.alert('Redeemed', 'This cashout has already been collected.');
    } else {
      Alert.alert('Expired', 'This cashout request has expired.');
    }
  };

  const getStatusColor = (status: CashoutStatus) => {
    switch (status) {
      case 'approved': return { bg: '#D1FAE5', text: '#059669' };
      case 'pending': return { bg: '#FEF3C7', text: '#D97706' };
      case 'redeemed': return { bg: '#DBEAFE', text: '#2563EB' };
      case 'expired': return { bg: '#FEE2E2', text: '#DC2626' };
    }
  };

  const filteredBanks = BANK_ACCOUNTS.filter(bank =>
    bank.bankName.toLowerCase().includes(bankSearch.toLowerCase())
  );

  // ==================== RENDER WALLET FORM ====================
  const renderWalletForm = () => (
    <View style={styles.formCard}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>SELECT WALLET PROVIDER</Text>
        <TouchableOpacity 
          style={styles.selector}
          onPress={() => setShowWalletModal(true)}
        >
          {selectedWallet ? (
            <View style={styles.selectorContent}>
              <View style={[styles.providerLogo, { backgroundColor: selectedWallet.color }]}>
                <Text style={styles.providerLogoText}>{selectedWallet.logo}</Text>
              </View>
              <View>
                <Text style={styles.selectorTitle}>{selectedWallet.name}</Text>
                <Text style={styles.selectorSubtitle}>Mobile Money</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.selectorPlaceholder}>Choose wallet provider</Text>
          )}
          <ChevronDownIcon size={16} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {selectedWallet && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>RECIPIENT PHONE NUMBER</Text>
          <View style={styles.phoneInputContainer}>
            <View style={styles.phonePrefix}>
              <Text style={styles.phonePrefixText}>+220</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="XXX XXXX"
              placeholderTextColor="#D1D5DB"
              keyboardType="phone-pad"
              value={walletPhone}
              onChangeText={setWalletPhone}
              maxLength={7}
            />
          </View>
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>AMOUNT</Text>
        <View style={styles.amountInputContainer}>
          <Text style={styles.amountCurrency}>{selectedCurrency}</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor="#D1D5DB"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
        <View style={styles.amountMeta}>
          <Text style={styles.feeText}>Fee: {selectedCurrency} 15.00</Text>
          <TouchableOpacity onPress={() => setAmount(balances[selectedCurrency].replace(/,/g, ''))}>
            <Text style={styles.maxText}>Max: {balances[selectedCurrency]}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSendRequest}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.submitButtonText}>Send to Wallet</Text>
          <SendIcon size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  // ==================== RENDER BANK FORM ====================
  const renderBankForm = () => (
    <View style={styles.formCard}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>DESTINATION ACCOUNT</Text>
        <TouchableOpacity 
          style={styles.selector}
          onPress={() => setShowBankModal(true)}
        >
          <View style={styles.selectorContent}>
            <View style={[styles.bankIcon, { backgroundColor: selectedBank.color + '20' }]}>
              <BankIcon size={18} color={selectedBank.color} />
            </View>
            <View>
              <Text style={styles.selectorTitle}>{selectedBank.bankName}</Text>
              <Text style={styles.selectorSubtitle}>Acct: {selectedBank.accountNumber}</Text>
            </View>
          </View>
          <ChevronDownIcon size={16} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>WITHDRAWAL AMOUNT</Text>
        <View style={styles.amountInputContainer}>
          <Text style={styles.amountCurrency}>{selectedCurrency}</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor="#D1D5DB"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
        <View style={styles.amountMeta}>
          <Text style={styles.feeText}>Fee: {selectedCurrency} 25.00</Text>
          <TouchableOpacity onPress={() => setAmount(balances[selectedCurrency].replace(/,/g, ''))}>
            <Text style={styles.maxText}>Max: {balances[selectedCurrency]}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSendRequest}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.submitButtonText}>Send Request</Text>
          <SendIcon size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  // ==================== RENDER CASHOUT FORM ====================
  const renderCashoutForm = () => (
    <View>
      {/* New Cashout Request */}
      <View style={styles.formCard}>
        <Text style={styles.formCardTitle}>New Cashout Request</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>CASHOUT AMOUNT</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.amountCurrency}>{selectedCurrency}</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#D1D5DB"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
          <View style={styles.amountMeta}>
            <Text style={styles.feeText}>Fee: {selectedCurrency} 50.00</Text>
            <TouchableOpacity onPress={() => setAmount(balances[selectedCurrency].replace(/,/g, ''))}>
              <Text style={styles.maxText}>Max: {balances[selectedCurrency]}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSendRequest}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={styles.submitButtonText}>Request Cashout</Text>
            <SendIcon size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Cashout Requests List */}
      <View style={styles.cashoutListSection}>
        <Text style={styles.sectionTitle}>Your Cashout Requests</Text>
        
        {cashoutRequests.map((request) => {
          const statusColors = getStatusColor(request.status);
          return (
            <TouchableOpacity
              key={request.id}
              style={styles.cashoutItem}
              onPress={() => handleViewQR(request)}
              activeOpacity={0.7}
            >
              <View style={styles.cashoutItemLeft}>
                <View style={[styles.cashoutIcon, { backgroundColor: statusColors.bg }]}>
                  {request.status === 'approved' ? (
                    <QRCodeIcon size={20} color={statusColors.text} />
                  ) : request.status === 'pending' ? (
                    <ClockIcon size={18} color={statusColors.text} />
                  ) : (
                    <CashoutIcon size={18} color={statusColors.text} />
                  )}
                </View>
                <View>
                  <Text style={styles.cashoutAmount}>{request.currency} {request.amount}</Text>
                  <Text style={styles.cashoutDate}>{request.createdAt}</Text>
                </View>
              </View>
              <View style={styles.cashoutItemRight}>
                <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                  <Text style={[styles.statusText, { color: statusColors.text }]}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Text>
                </View>
                {request.status === 'approved' && (
                  <Text style={styles.viewQRText}>Tap to view QR</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // ==================== WALLET PROVIDER MODAL ====================
  const renderWalletModal = () => (
    <Modal
      visible={showWalletModal}
      animationType="slide"
      transparent
      onRequestClose={() => setShowWalletModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Wallet Provider</Text>
            <TouchableOpacity onPress={() => setShowWalletModal(false)}>
              <CloseIcon size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {WALLET_PROVIDERS.map((provider) => (
            <TouchableOpacity
              key={provider.id}
              style={[
                styles.walletOption,
                selectedWallet?.id === provider.id && styles.walletOptionSelected,
              ]}
              onPress={() => {
                setSelectedWallet(provider);
                setShowWalletModal(false);
              }}
            >
              <View style={styles.walletOptionLeft}>
                <View style={[styles.providerLogo, { backgroundColor: provider.color }]}>
                  <Text style={styles.providerLogoText}>{provider.logo}</Text>
                </View>
                <View>
                  <Text style={styles.walletOptionName}>{provider.name}</Text>
                  <Text style={styles.walletOptionCode}>{provider.code} • Mobile Money</Text>
                </View>
              </View>
              {selectedWallet?.id === provider.id && (
                <CheckIcon size={22} color="#059669" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  // ==================== BANK SELECTION MODAL ====================
  const renderBankModal = () => (
    <Modal
      visible={showBankModal}
      animationType="slide"
      transparent
      onRequestClose={() => setShowBankModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Bank Account</Text>
            <TouchableOpacity onPress={() => setShowBankModal(false)}>
              <CloseIcon size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <SearchIcon size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search banks..."
              placeholderTextColor="#9CA3AF"
              value={bankSearch}
              onChangeText={setBankSearch}
            />
          </View>

          <ScrollView style={styles.bankList}>
            {filteredBanks.map((bank) => (
              <TouchableOpacity
                key={bank.id}
                style={[
                  styles.bankOption,
                  selectedBank.id === bank.id && styles.bankOptionSelected,
                ]}
                onPress={() => {
                  setSelectedBank(bank);
                  setShowBankModal(false);
                  setBankSearch('');
                }}
              >
                <View style={styles.bankOptionLeft}>
                  <View style={[styles.bankIcon, { backgroundColor: bank.color + '20' }]}>
                    <BankIcon size={18} color={bank.color} />
                  </View>
                  <View>
                    <Text style={styles.bankOptionName}>{bank.bankName}</Text>
                    <Text style={styles.bankOptionAccount}>{bank.accountName} • {bank.accountNumber}</Text>
                  </View>
                </View>
                {selectedBank.id === bank.id && (
                  <CheckIcon size={22} color="#059669" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // ==================== QR CODE MODAL ====================
  const renderQRModal = () => (
    <Modal
      visible={showQRModal}
      animationType="fade"
      transparent
      onRequestClose={() => setShowQRModal(false)}
    >
      <View style={styles.qrModalOverlay}>
        <View style={styles.qrModalContent}>
          <TouchableOpacity 
            style={styles.qrCloseButton}
            onPress={() => setShowQRModal(false)}
          >
            <CloseIcon size={24} color="#6B7280" />
          </TouchableOpacity>

          <Text style={styles.qrTitle}>Cashout QR Code</Text>
          <Text style={styles.qrSubtitle}>Show this to a PayGam Agent</Text>

          <View style={styles.qrCodeContainer}>
            <View style={styles.qrCode}>
              <QRCodeIcon size={160} color="#293454" />
            </View>
          </View>

          <View style={styles.qrDetails}>
            <View style={styles.qrDetailRow}>
              <Text style={styles.qrDetailLabel}>Amount</Text>
              <Text style={styles.qrDetailValue}>
                {selectedCashout?.currency} {selectedCashout?.amount}
              </Text>
            </View>
            <View style={styles.qrDetailRow}>
              <Text style={styles.qrDetailLabel}>Reference</Text>
              <Text style={styles.qrDetailValue}>{selectedCashout?.id}</Text>
            </View>
            <View style={styles.qrDetailRow}>
              <Text style={styles.qrDetailLabel}>Expires</Text>
              <Text style={[styles.qrDetailValue, { color: '#F59E0B' }]}>
                {selectedCashout?.expiresAt}
              </Text>
            </View>
          </View>

          <View style={styles.qrWarning}>
            <ClockIcon size={16} color="#F59E0B" />
            <Text style={styles.qrWarningText}>
              This QR code will expire after redemption or in 24 hours
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );

  // ==================== MAIN RENDER ====================
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#293454" />
      
      {/* Header */}
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.topNav}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeftIcon size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settlements</Text>
            <TouchableOpacity style={styles.navButton}>
              <BellIcon size={20} color="#FFFFFF" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Balance */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.currencyCode}>{selectedCurrency}</Text>
            <Text style={styles.balanceAmount}>
              {balances[selectedCurrency].split('.')[0]}
              <Text style={styles.balanceDecimal}>.{balances[selectedCurrency].split('.')[1]}</Text>
            </Text>
          </View>

          <View style={styles.currencyTabs}>
            {currencies.map((currency) => (
              <TouchableOpacity
                key={currency}
                style={[
                  styles.currencyTab,
                  selectedCurrency === currency && styles.currencyTabActive,
                ]}
                onPress={() => setSelectedCurrency(currency)}
              >
                <Text style={[
                  styles.currencyTabText,
                  selectedCurrency === currency && styles.currencyTabTextActive,
                ]}>
                  {currency}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Settlement Type Tabs */}
        <View style={styles.typeTabs}>
          {/* Wallet */}
          <TouchableOpacity
            style={[
              styles.typeTab,
              selectedType === 'wallet' && isTypeAvailable('wallet') && styles.typeTabActive,
              !isTypeAvailable('wallet') && styles.typeTabDisabled,
            ]}
            onPress={() => isTypeAvailable('wallet') && setSelectedType('wallet')}
            disabled={!isTypeAvailable('wallet')}
          >
            <View style={[
              styles.typeIcon,
              selectedType === 'wallet' && isTypeAvailable('wallet') && styles.typeIconActive,
            ]}>
              <WalletIcon size={20} color={selectedType === 'wallet' ? '#FFFFFF' : '#293454'} />
            </View>
            <Text style={[
              styles.typeLabel,
              selectedType === 'wallet' && styles.typeLabelActive,
              !isTypeAvailable('wallet') && styles.typeLabelDisabled,
            ]}>To Wallet</Text>
            <Text style={[styles.typeSubLabel, !isTypeAvailable('wallet') && styles.typeLabelDisabled]}>
              (General)
            </Text>
          </TouchableOpacity>

          {/* Bank */}
          <TouchableOpacity
            style={[
              styles.typeTab,
              selectedType === 'bank' && styles.typeTabActive,
            ]}
            onPress={() => setSelectedType('bank')}
          >
            <View style={[
              styles.typeIcon,
              selectedType === 'bank' && styles.typeIconActive,
            ]}>
              <BankIcon size={20} color={selectedType === 'bank' ? '#FFFFFF' : '#293454'} />
            </View>
            <Text style={[styles.typeLabel, selectedType === 'bank' && styles.typeLabelActive]}>
              To Bank
            </Text>
            <Text style={styles.typeSubLabel}>(Corporate)</Text>
          </TouchableOpacity>

          {/* Cashout */}
          <TouchableOpacity
            style={[
              styles.typeTab,
              selectedType === 'cashout' && isTypeAvailable('cashout') && styles.typeTabActive,
              !isTypeAvailable('cashout') && styles.typeTabDisabled,
            ]}
            onPress={() => isTypeAvailable('cashout') && setSelectedType('cashout')}
            disabled={!isTypeAvailable('cashout')}
          >
            <View style={[
              styles.typeIcon,
              selectedType === 'cashout' && isTypeAvailable('cashout') && styles.typeIconActive,
            ]}>
              <CashoutIcon size={20} color={selectedType === 'cashout' ? '#FFFFFF' : '#293454'} />
            </View>
            <Text style={[
              styles.typeLabel,
              selectedType === 'cashout' && styles.typeLabelActive,
              !isTypeAvailable('cashout') && styles.typeLabelDisabled,
            ]}>Cashout</Text>
            <Text style={[styles.typeSubLabel, !isTypeAvailable('cashout') && styles.typeLabelDisabled]}>
              (Agent)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form based on selected type */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>
            {selectedType === 'cashout' ? '' : 'New Request'}
          </Text>
          
          {selectedType === 'wallet' && renderWalletForm()}
          {selectedType === 'bank' && renderBankForm()}
          {selectedType === 'cashout' && renderCashoutForm()}
        </View>
      </ScrollView>

      {/* Modals */}
      {renderWalletModal()}
      {renderBankModal()}
      {renderQRModal()}
    </View>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#293454',
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 12 : 12,
    paddingBottom: 24,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  balanceSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#93C5FD',
    letterSpacing: 1,
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  currencyCode: {
    fontSize: 20,
    fontWeight: '500',
    color: '#93C5FD',
    marginRight: 8,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  balanceDecimal: {
    fontSize: 24,
    color: '#60A5FA',
  },
  currencyTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    padding: 4,
  },
  currencyTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  currencyTabActive: {
    backgroundColor: '#FFFFFF',
  },
  currencyTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  currencyTabTextActive: {
    color: '#293454',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  typeTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: -20,
    gap: 10,
  },
  typeTab: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  typeTabActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#293454',
  },
  typeTabDisabled: {
    opacity: 0.5,
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  typeIconActive: {
    backgroundColor: '#293454',
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  typeLabelActive: {
    color: '#293454',
  },
  typeLabelDisabled: {
    color: '#9CA3AF',
  },
  typeSubLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  formSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  formCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectorTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  selectorSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  selectorPlaceholder: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  providerLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerLogoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bankIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  phonePrefix: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  phonePrefixText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
  },
  amountCurrency: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  amountMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  feeText: {
    fontSize: 13,
    color: '#6B7280',
  },
  maxText: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: '500',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#293454',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Cashout List
  cashoutListSection: {
    marginTop: 24,
  },
  cashoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cashoutItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cashoutIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cashoutAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  cashoutDate: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  cashoutItemRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  viewQRText: {
    fontSize: 11,
    color: '#3B82F6',
    marginTop: 4,
  },
  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
  },
  bankList: {
    paddingHorizontal: 16,
  },
  walletOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  walletOptionSelected: {
    backgroundColor: '#F0FDF4',
  },
  walletOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  walletOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  walletOptionCode: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  bankOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  bankOptionSelected: {
    backgroundColor: '#F0FDF4',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  bankOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bankOptionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  bankOptionAccount: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  // QR Modal
  qrModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  qrModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  qrCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  qrSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 24,
  },
  qrCodeContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  qrCode: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrDetails: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  qrDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  qrDetailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  qrDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  qrWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    width: '100%',
  },
  qrWarningText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
  },
});

export default SettlementScreen;
