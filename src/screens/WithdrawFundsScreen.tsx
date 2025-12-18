/**
 * PAYGAM MERCHANT - WITHDRAW FUNDS SCREEN
 * Withdrawal request screen for transferring funds from wallet
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
  Modal,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const BackArrowIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const WalletIcon: React.FC<{ size?: number; color?: string }> = ({ size = 28, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </Svg>
);

const ChevronDownIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
  </Svg>
);

const ClockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </Svg>
);

const BankIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M4 10h3v7H4zm6.5 0h3v7h-3zM2 19h20v3H2zm15-9h3v7h-3zm-5-9L2 6v2h20V6z" />
  </Svg>
);

const ShieldIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#60A5FA' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
  </Svg>
);

const AlertIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
  </Svg>
);

const CheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </Svg>
);

const CalculatorIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm1-4H6v-2h7v2zm0-4H6V7h7v2zm5 8h-3v-6h3v6z" />
  </Svg>
);

// ==================== TYPES ====================
type CurrencyType = 'USD' | 'GMD' | 'GBP';

interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  isDefault: boolean;
}

// ==================== MAIN COMPONENT ====================
const WithdrawFundsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>('USD');
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [accountModalVisible, setAccountModalVisible] = useState(false);

  // Get target dashboard from route params, default to GeneralMerchantDashboard
  const merchantType = route.params?.merchantType || 'general';
  
  const getTargetDashboard = () => {
    switch (merchantType) {
      case 'fuel': return 'FuelMerchantDashboard';
      case 'corporate': return 'CorporateMerchantDashboard';
      default: return 'GeneralMerchantDashboard';
    }
  };
  
  const balanceAnimValue = useRef(new Animated.Value(0)).current;
  const cardShimmer = useRef(new Animated.Value(0)).current;

  // Sample balance and accounts
  const walletBalance = 12450.85;
  const withdrawalFee = 2.50;
  
  const bankAccounts: BankAccount[] = [
    { id: '1', name: 'Primary Account', bankName: 'GTBank', accountNumber: '****4521', isDefault: true },
    { id: '2', name: 'Business Account', bankName: 'Zenith Bank', accountNumber: '****7832', isDefault: false },
  ];

  useEffect(() => {
    // Balance count animation
    Animated.timing(balanceAnimValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Card shimmer animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(cardShimmer, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(cardShimmer, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Set default account
    const defaultAccount = bankAccounts.find(acc => acc.isDefault);
    if (defaultAccount) {
      setSelectedAccount(defaultAccount);
    }
  }, []);

  const currencies: { key: CurrencyType; symbol: string; label: string; flag: string }[] = [
    { key: 'USD', symbol: '$', label: 'US Dollar', flag: '🇺🇸' },
    { key: 'GMD', symbol: 'D', label: 'Dalasi', flag: '🇬🇲' },
    { key: 'GBP', symbol: '£', label: 'British Pound', flag: '🇬🇧' },
  ];

  const currentCurrency = currencies.find(c => c.key === selectedCurrency);

  const handleQuickAmount = (value: string) => {
    if (value === '50%') {
      setAmount((walletBalance / 2).toFixed(2));
    } else if (value === 'Max') {
      setAmount((walletBalance - withdrawalFee).toFixed(2));
    } else {
      setAmount(value);
    }
  };

  const parsedAmount = parseFloat(amount) || 0;
  const totalDeduction = parsedAmount + withdrawalFee;
  const isValidAmount = parsedAmount > 0 && totalDeduction <= walletBalance;

  const handleWithdraw = () => {
    if (!isValidAmount || !selectedAccount) return;
    
    navigation.navigate('ActionSuccess', {
      type: 'withdrawal',
      amount: parsedAmount,
      currency: selectedCurrency,
      destination: selectedAccount.bankName,
      accountNumber: selectedAccount.accountNumber,
      navigateTo: getTargetDashboard(),
    });
  };

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
        <Text style={styles.headerTitle}>Withdraw Funds</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Wallet Balance Card */}
        <View style={styles.walletCard}>
          <LinearGradient
            colors={['#293454', '#1f2842', '#151a29']}
            style={styles.walletGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Decorative elements */}
            <Animated.View
              style={[
                styles.walletDecor,
                {
                  opacity: cardShimmer.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.05, 0.1],
                  }),
                },
              ]}
            />
            
            <View style={styles.walletHeader}>
              <View style={styles.walletIconContainer}>
                <WalletIcon size={24} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.walletLabel}>Available Balance</Text>
                <Text style={styles.walletSubtext}>Main Wallet</Text>
              </View>
            </View>
            
            <View style={styles.balanceRow}>
              <Text style={styles.currencySymbol}>{currentCurrency?.symbol}</Text>
              <Text style={styles.balanceAmount}>
                {walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>

            <View style={styles.walletFooter}>
              <View style={styles.lastUpdateBadge}>
                <ClockIcon size={12} color="rgba(255,255,255,0.6)" />
                <Text style={styles.lastUpdateText}>Updated just now</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Amount Input Section */}
        <View style={styles.inputCard}>
          <Text style={styles.sectionTitle}>Withdrawal Amount</Text>
          
          {/* Amount Input */}
          <View style={styles.amountInputContainer}>
            <TouchableOpacity
              style={styles.currencySelector}
              onPress={() => setCurrencyModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.currencyFlag}>{currentCurrency?.flag}</Text>
              <Text style={styles.currencyCode}>{selectedCurrency}</Text>
              <ChevronDownIcon size={16} color="#6B7280" />
            </TouchableOpacity>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
            />
          </View>

          {/* Quick Amount Buttons */}
          <View style={styles.quickAmountsContainer}>
            {['100', '50%', 'Max'].map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.quickAmountBtn,
                  amount === (value === '100' ? '100' : value === '50%' ? (walletBalance / 2).toFixed(2) : (walletBalance - withdrawalFee).toFixed(2)) && styles.quickAmountBtnActive,
                ]}
                onPress={() => handleQuickAmount(value)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.quickAmountText,
                  amount === (value === '100' ? '100' : value === '50%' ? (walletBalance / 2).toFixed(2) : (walletBalance - withdrawalFee).toFixed(2)) && styles.quickAmountTextActive,
                ]}>
                  {value === '100' ? `${currentCurrency?.symbol}100` : value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Destination Account */}
        <View style={styles.inputCard}>
          <Text style={styles.sectionTitle}>Destination Account</Text>
          
          <TouchableOpacity
            style={styles.accountSelector}
            onPress={() => setAccountModalVisible(true)}
            activeOpacity={0.7}
          >
            {selectedAccount ? (
              <View style={styles.selectedAccountInfo}>
                <View style={styles.bankIconContainer}>
                  <BankIcon size={18} color="#10B981" />
                </View>
                <View style={styles.accountDetails}>
                  <Text style={styles.accountName}>{selectedAccount.name}</Text>
                  <Text style={styles.accountBank}>{selectedAccount.bankName} • {selectedAccount.accountNumber}</Text>
                </View>
                {selectedAccount.isDefault && (
                  <View style={styles.defaultBadge}>
                    <CheckIcon size={10} color="#FFFFFF" />
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.selectAccountPlaceholder}>Select bank account</Text>
            )}
            <ChevronDownIcon size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Transaction Summary */}
        {parsedAmount > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Transaction Summary</Text>
            
            <View style={styles.summaryRow}>
              <View style={styles.summaryLabel}>
                <CalculatorIcon size={14} color="#6B7280" />
                <Text style={styles.summaryLabelText}>Withdrawal Amount</Text>
              </View>
              <Text style={styles.summaryValue}>
                {currentCurrency?.symbol}{parsedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <View style={styles.summaryLabel}>
                <ShieldIcon size={14} color="#60A5FA" />
                <Text style={styles.summaryLabelText}>Processing Fee</Text>
              </View>
              <Text style={styles.summaryValue}>
                {currentCurrency?.symbol}{withdrawalFee.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <View style={styles.summaryLabel}>
                <ClockIcon size={14} color="#6B7280" />
                <Text style={styles.summaryLabelText}>Estimated Arrival</Text>
              </View>
              <Text style={[styles.summaryValue, { color: '#10B981' }]}>1-2 Business Days</Text>
            </View>
            
            <View style={styles.summaryDivider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Deduction</Text>
              <Text style={styles.totalValue}>
                {currentCurrency?.symbol}{totalDeduction.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        )}

        {/* Warning Notice */}
        {parsedAmount > walletBalance && (
          <View style={styles.warningCard}>
            <AlertIcon size={18} color="#F59E0B" />
            <Text style={styles.warningText}>
              Insufficient balance. Maximum withdrawal is {currentCurrency?.symbol}
              {(walletBalance - withdrawalFee).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.withdrawButton, (!isValidAmount || !selectedAccount) && styles.withdrawButtonDisabled]}
          onPress={handleWithdraw}
          activeOpacity={0.8}
          disabled={!isValidAmount || !selectedAccount}
        >
          <LinearGradient
            colors={isValidAmount && selectedAccount ? ['#293454', '#1f2842'] : ['#9CA3AF', '#6B7280']}
            style={styles.withdrawGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.withdrawButtonText}>Request To Withdraw</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Currency Modal */}
      <Modal
        visible={currencyModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCurrencyModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setCurrencyModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            {currencies.map((currency) => (
              <TouchableOpacity
                key={currency.key}
                style={[
                  styles.modalOption,
                  selectedCurrency === currency.key && styles.modalOptionActive,
                ]}
                onPress={() => {
                  setSelectedCurrency(currency.key);
                  setCurrencyModalVisible(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.modalOptionFlag}>{currency.flag}</Text>
                <View style={styles.modalOptionInfo}>
                  <Text style={styles.modalOptionLabel}>{currency.label}</Text>
                  <Text style={styles.modalOptionCode}>{currency.key}</Text>
                </View>
                {selectedCurrency === currency.key && (
                  <View style={styles.checkCircle}>
                    <CheckIcon size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Account Modal */}
      <Modal
        visible={accountModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAccountModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setAccountModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Bank Account</Text>
            {bankAccounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.modalOption,
                  selectedAccount?.id === account.id && styles.modalOptionActive,
                ]}
                onPress={() => {
                  setSelectedAccount(account);
                  setAccountModalVisible(false);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.bankIconContainerModal}>
                  <BankIcon size={16} color="#10B981" />
                </View>
                <View style={styles.modalOptionInfo}>
                  <Text style={styles.modalOptionLabel}>{account.name}</Text>
                  <Text style={styles.modalOptionCode}>
                    {account.bankName} • {account.accountNumber}
                  </Text>
                </View>
                {selectedAccount?.id === account.id && (
                  <View style={styles.checkCircle}>
                    <CheckIcon size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
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
  content: {
    flex: 1,
    padding: 16,
  },

  // Wallet Card
  walletCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#293454',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  walletGradient: {
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  walletDecor: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  walletIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  walletLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  walletSubtext: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginRight: 4,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  walletFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  lastUpdateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lastUpdateText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },

  // Input Card
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingLeft: 4,
    marginBottom: 16,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  currencyFlag: {
    fontSize: 16,
  },
  currencyCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    paddingVertical: 16,
    paddingRight: 16,
  },
  quickAmountsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  quickAmountBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quickAmountBtnActive: {
    backgroundColor: 'rgba(41, 52, 84, 0.1)',
    borderColor: '#293454',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  quickAmountTextActive: {
    color: '#293454',
  },

  // Account Selector
  accountSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedAccountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bankIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  accountBank: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  defaultBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  selectAccountPlaceholder: {
    fontSize: 14,
    color: '#9CA3AF',
  },

  // Summary Card
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryLabelText: {
    fontSize: 13,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#293454',
  },

  // Warning Card
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
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
  withdrawButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  withdrawButtonDisabled: {
    opacity: 0.7,
  },
  withdrawGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  modalOptionActive: {
    backgroundColor: 'rgba(41, 52, 84, 0.1)',
    borderWidth: 2,
    borderColor: '#293454',
  },
  modalOptionFlag: {
    fontSize: 24,
    marginRight: 14,
  },
  modalOptionInfo: {
    flex: 1,
  },
  modalOptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalOptionCode: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#293454',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankIconContainerModal: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
});

export default WithdrawFundsScreen;
