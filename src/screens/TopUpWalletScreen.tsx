/**
 * TopUpWalletScreen.tsx
 * Top Up Wallet screen for PayGam Merchant App
 * 
 * Features:
 * - Multiple payment methods (Stripe, Mobile Banking, Offline Bank Transfer)
 * - Amount input
 * - Bank selection for offline transfer
 * - Bank details view
 * - Payment reference with timer
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Modal,
  Linking,
  Alert,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// Icons
const ArrowLeftIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const HistoryIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const WalletIcon = ({ size = 24, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 12V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V16"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18 12C18 13.1046 17.1046 14 16 14C14.8954 14 14 13.1046 14 12C14 10.8954 14.8954 10 16 10C17.1046 10 18 10.8954 18 12Z"
      stroke={color}
      strokeWidth={2}
    />
  </Svg>
);

const ChevronDownIcon = ({ size = 12, color = '#D1D5DB' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9L12 15L18 9"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const StripeIcon = ({ size = 24, color = '#6366F1' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"
      fill={color}
    />
  </Svg>
);

const MobileIcon = ({ size = 24, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="2" width="14" height="20" rx="2" stroke={color} strokeWidth={2} />
    <Path d="M12 18H12.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const BankIcon = ({ size = 24, color = '#F97316' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 21H21M3 10H21M5 6L12 3L19 6M4 10V21M20 10V21M8 14V17M12 14V17M16 14V17"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ArrowRightIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12H19M19 12L12 5M19 12L12 19"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CopyIcon = ({ size = 18, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="9" y="9" width="13" height="13" rx="2" stroke={color} strokeWidth={2} />
    <Path
      d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

const InfoIcon = ({ size = 18, color = '#EAB308' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M12 16V12M12 8H12.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const CheckIcon = ({ size = 32, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 13L9 17L19 7"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ClockIcon = ({ size = 18, color = '#FBBF24' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M12 6V12L16 14" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const ExclamationIcon = ({ size = 18, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M12 8V12M12 16H12.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

interface TopUpWalletScreenProps {
  navigation: any;
}

type PaymentMethod = 'stripe' | 'mobile' | 'offline';
type ViewState = 'main' | 'bank-list' | 'bank-details' | 'success';

interface Bank {
  id: string;
  name: string;
  accountNumber: string;
  color: string;
  initial: string;
}

interface Wallet {
  id: string;
  name: string;
  currency: string;
  balance: string;
  type: 'main' | 'usd' | 'gbp' | 'eur';
}

const TopUpWalletScreen: React.FC<TopUpWalletScreenProps> = ({ navigation }) => {
  const [amount, setAmount] = useState('500.00');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('offline');
  const [currentView, setCurrentView] = useState<ViewState>('main');
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [referenceCode, setReferenceCode] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('71:59:42');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet>({
    id: '1',
    name: 'Main Merchant Wallet',
    currency: 'GMD',
    balance: '125,750.00',
    type: 'main',
  });

  const wallets: Wallet[] = [
    { id: '1', name: 'Main Merchant Wallet', currency: 'GMD', balance: '125,750.00', type: 'main' },
    { id: '2', name: 'USD Wallet', currency: 'USD', balance: '2,450.50', type: 'usd' },
    { id: '3', name: 'GBP Wallet', currency: 'GBP', balance: '1,890.25', type: 'gbp' },
    { id: '4', name: 'EUR Wallet', currency: 'EUR', balance: '2,125.00', type: 'eur' },
  ];

  const banks: Bank[] = [
    { id: '1', name: 'Chase Bank', accountNumber: '0987654321', color: '#2563EB', initial: 'C' },
    { id: '2', name: 'Bank of America', accountNumber: '1234567890', color: '#DC2626', initial: 'B' },
    { id: '3', name: 'Wells Fargo', accountNumber: '5678901234', color: '#EAB308', initial: 'W' },
    { id: '4', name: 'Citibank', accountNumber: '4321098765', color: '#60A5FA', initial: 'C' },
    { id: '5', name: 'US Bank', accountNumber: '6789054321', color: '#1E40AF', initial: 'U' },
  ];

  const generateReferenceCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `NEX-555-${randomNum}`;
  };

  const handleProceed = () => {
    if (selectedMethod === 'offline') {
      setCurrentView('bank-list');
    } else if (selectedMethod === 'stripe') {
      Alert.alert('Stripe Checkout', 'Redirecting to Stripe Secure Checkout...');
    } else if (selectedMethod === 'mobile') {
      Alert.alert('Mobile Banking', 'Opening Mobile Banking App...');
      // You could use Linking.openURL to open a specific banking app
    }
  };

  const handleSelectBank = (bank: Bank) => {
    setSelectedBank(bank);
    setCurrentView('bank-details');
  };

  const handleSubmitTransfer = () => {
    setReferenceCode(generateReferenceCode());
    setCurrentView('success');
  };

  const handleCopy = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'Text copied to clipboard');
  };

  const handleGoBack = () => {
    if (currentView === 'bank-details') {
      setCurrentView('bank-list');
    } else if (currentView === 'bank-list') {
      setCurrentView('main');
    } else {
      navigation.goBack();
    }
  };

  const handleReturnToDashboard = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'GeneralMerchantDashboard' }],
    });
  };

  // Main Top Up View
  const renderMainView = () => (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeftIcon size={18} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Top Up Wallet</Text>
          
          <TouchableOpacity style={styles.headerButton}>
            <HistoryIcon size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Enter Amount</Text>
          <View style={styles.amountInputRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
            />
          </View>
        </View>
      </View>

      {/* Content Body */}
      <ScrollView 
        style={styles.contentBody}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Wallet Selector */}
        <TouchableOpacity 
          style={styles.walletSelector}
          onPress={() => setShowWalletModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.walletLeft}>
            <View style={styles.walletIconContainer}>
              <WalletIcon size={20} color="#293454" />
            </View>
            <View>
              <Text style={styles.walletLabel}>Target Wallet</Text>
              <Text style={styles.walletName}>{selectedWallet.name}</Text>
            </View>
          </View>
          <ChevronDownIcon size={16} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        
        {/* Stripe */}
        <TouchableOpacity 
          style={[
            styles.paymentMethod,
            selectedMethod === 'stripe' && styles.paymentMethodSelected
          ]}
          onPress={() => setSelectedMethod('stripe')}
        >
          <View style={[styles.methodIconContainer, { backgroundColor: '#EEF2FF' }]}>
            <StripeIcon size={22} color="#6366F1" />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Stripe / Card</Text>
            <Text style={styles.methodDescription}>Instant deposit via credit card</Text>
          </View>
          <View style={[
            styles.radioOuter,
            selectedMethod === 'stripe' && styles.radioOuterSelected
          ]}>
            {selectedMethod === 'stripe' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        {/* Mobile Banking */}
        <TouchableOpacity 
          style={[
            styles.paymentMethod,
            selectedMethod === 'mobile' && styles.paymentMethodSelected
          ]}
          onPress={() => setSelectedMethod('mobile')}
        >
          <View style={[styles.methodIconContainer, { backgroundColor: '#F0FDF4' }]}>
            <MobileIcon size={22} color="#22C55E" />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Mobile Banking App</Text>
            <Text style={styles.methodDescription}>Redirects to your banking app</Text>
          </View>
          <View style={[
            styles.radioOuter,
            selectedMethod === 'mobile' && styles.radioOuterSelected
          ]}>
            {selectedMethod === 'mobile' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        {/* Offline Bank Transfer */}
        <TouchableOpacity 
          style={[
            styles.paymentMethod,
            selectedMethod === 'offline' && styles.paymentMethodSelected
          ]}
          onPress={() => setSelectedMethod('offline')}
        >
          <View style={[styles.methodIconContainer, { backgroundColor: '#FFF7ED' }]}>
            <BankIcon size={22} color="#F97316" />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Offline Bank Transfer</Text>
            <Text style={styles.methodDescription}>Manual transfer to admin bank</Text>
          </View>
          <View style={[
            styles.radioOuter,
            selectedMethod === 'offline' && styles.radioOuterSelected
          ]}>
            {selectedMethod === 'offline' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <TouchableOpacity 
          style={styles.proceedButton}
          onPress={handleProceed}
          activeOpacity={0.9}
        >
          <Text style={styles.proceedButtonText}>Proceed to Top Up</Text>
          <ArrowRightIcon size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Bank List View
  const renderBankListView = () => (
    <View style={styles.bankListContainer}>
      <View style={styles.bankListHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <ArrowLeftIcon size={20} color="#293454" />
        </TouchableOpacity>
        <Text style={styles.bankListTitle}>Select Admin Bank</Text>
      </View>

      <ScrollView 
        style={styles.bankListContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.bankListDescription}>
          Please select one of our bank accounts to transfer the funds to.
        </Text>
        
        <View style={styles.bankGrid}>
          {banks.map((bank) => (
            <TouchableOpacity 
              key={bank.id}
              style={styles.bankCard}
              onPress={() => handleSelectBank(bank)}
              activeOpacity={0.8}
            >
              <View style={[styles.bankLogo, { backgroundColor: bank.color }]}>
                <Text style={styles.bankInitial}>{bank.initial}</Text>
              </View>
              <Text style={styles.bankName}>{bank.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  // Bank Details View
  const renderBankDetailsView = () => (
    <View style={styles.bankDetailsContainer}>
      {/* Header */}
      <View style={styles.bankDetailsHeader}>
        <TouchableOpacity 
          style={styles.bankDetailsBackButton}
          onPress={handleGoBack}
        >
          <ArrowLeftIcon size={18} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.bankDetailsHeaderContent}>
          <View style={styles.bankDetailsIcon}>
            <BankIcon size={28} color="#293454" />
          </View>
          <Text style={styles.bankDetailsTitle}>{selectedBank?.name}</Text>
          <Text style={styles.bankDetailsSubtitle}>PayGam Admin Account</Text>
        </View>
      </View>

      {/* Details Card */}
      <ScrollView 
        style={styles.bankDetailsBody}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bankDetailsContentContainer}
      >
        <View style={styles.detailsCard}>
          {/* Account Name */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>ACCOUNT NAME</Text>
            <View style={styles.detailValueRow}>
              <Text style={styles.detailValue}>PayGam Merchant Ltd</Text>
              <TouchableOpacity onPress={() => handleCopy('PayGam Merchant Ltd')}>
                <CopyIcon size={18} color="#293454" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Account Number */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>ACCOUNT NUMBER</Text>
            <View style={styles.detailValueRow}>
              <Text style={styles.detailValueLarge}>{selectedBank?.accountNumber}</Text>
              <TouchableOpacity onPress={() => handleCopy(selectedBank?.accountNumber || '')}>
                <CopyIcon size={18} color="#293454" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Amount */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>AMOUNT TO TRANSFER</Text>
            <View style={styles.detailValueRow}>
              <Text style={styles.detailValueAmount}>${amount}</Text>
              <TouchableOpacity onPress={() => handleCopy(`$${amount}`)}>
                <CopyIcon size={18} color="#293454" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Warning */}
          <View style={styles.warningBox}>
            <InfoIcon size={18} color="#EAB308" />
            <Text style={styles.warningText}>
              Please ensure you transfer the exact amount. The transaction will be verified manually by our team.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <TouchableOpacity 
          style={styles.proceedButton}
          onPress={handleSubmitTransfer}
          activeOpacity={0.9}
        >
          <Text style={styles.proceedButtonText}>I Have Transferred the Money</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Success View
  const renderSuccessView = () => (
    <View style={styles.successContainer}>
      <View style={styles.successIcon}>
        <CheckIcon size={36} color="#22C55E" />
      </View>

      <Text style={styles.successTitle}>Request Submitted!</Text>
      <Text style={styles.successDescription}>
        Please complete the transfer using the reference below within the time limit.
      </Text>

      {/* Reference Card */}
      <View style={styles.referenceCard}>
        <View style={styles.referenceCircle1} />
        <View style={styles.referenceCircle2} />
        
        <Text style={styles.referenceLabel}>PAYMENT REFERENCE</Text>
        <View style={styles.referenceCodeRow}>
          <Text style={styles.referenceCode}>{referenceCode}</Text>
          <TouchableOpacity onPress={() => handleCopy(referenceCode)}>
            <CopyIcon size={18} color="rgba(255, 255, 255, 0.8)" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.referenceDivider} />
        
        <View style={styles.referenceFooter}>
          <View>
            <Text style={styles.referenceFooterLabel}>Time Remaining</Text>
            <View style={styles.timerRow}>
              <ClockIcon size={16} color="#FBBF24" />
              <Text style={styles.timerText}>{timeRemaining}</Text>
            </View>
          </View>
          <View style={styles.referenceFooterRight}>
            <Text style={styles.referenceFooterLabel}>Mobile</Text>
            <Text style={styles.phoneNumber}>+1 (555) 000-0000</Text>
          </View>
        </View>
      </View>

      {/* Important Notice */}
      <View style={styles.importantNotice}>
        <ExclamationIcon size={18} color="#3B82F6" />
        <Text style={styles.importantText}>
          <Text style={styles.importantBold}>Important:</Text> You MUST include the reference code above in your bank transfer description/memo field. Failure to do so may delay your top-up.
        </Text>
      </View>

      {/* Return Button */}
      <TouchableOpacity 
        style={styles.returnButton}
        onPress={handleReturnToDashboard}
        activeOpacity={0.8}
      >
        <Text style={styles.returnButtonText}>Return to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );

  // Wallet Selection Modal
  const renderWalletModal = () => (
    <Modal
      visible={showWalletModal}
      animationType="slide"
      transparent
      onRequestClose={() => setShowWalletModal(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowWalletModal(false)}
      >
        <View style={styles.walletModalContent}>
          <View style={styles.walletModalHeader}>
            <Text style={styles.walletModalTitle}>Select Wallet</Text>
            <TouchableOpacity onPress={() => setShowWalletModal(false)}>
              <Text style={styles.walletModalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {wallets.map((wallet) => (
            <TouchableOpacity
              key={wallet.id}
              style={[
                styles.walletOption,
                selectedWallet.id === wallet.id && styles.walletOptionSelected,
              ]}
              onPress={() => {
                setSelectedWallet(wallet);
                setShowWalletModal(false);
              }}
            >
              <View style={styles.walletOptionLeft}>
                <View style={[
                  styles.walletOptionIcon,
                  { backgroundColor: wallet.type === 'main' ? '#E0F2FE' : 
                    wallet.type === 'usd' ? '#DCFCE7' : 
                    wallet.type === 'gbp' ? '#FEF3C7' : '#FCE7F3' }
                ]}>
                  <WalletIcon size={18} color={
                    wallet.type === 'main' ? '#0284C7' : 
                    wallet.type === 'usd' ? '#16A34A' : 
                    wallet.type === 'gbp' ? '#CA8A04' : '#DB2777'
                  } />
                </View>
                <View>
                  <Text style={styles.walletOptionName}>{wallet.name}</Text>
                  <Text style={styles.walletOptionBalance}>
                    {wallet.currency} {wallet.balance}
                  </Text>
                </View>
              </View>
              <View style={[
                styles.walletRadio,
                selectedWallet.id === wallet.id && styles.walletRadioSelected,
              ]}>
                {selectedWallet.id === wallet.id && (
                  <View style={styles.walletRadioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#293454" />
      
      {currentView === 'main' && renderMainView()}
      {currentView === 'bank-list' && renderBankListView()}
      {currentView === 'bank-details' && renderBankDetailsView()}
      {currentView === 'success' && renderSuccessView()}
      
      {renderWalletModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#293454',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  amountSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  amountLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencySymbol: {
    fontSize: 30,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    marginRight: 4,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    minWidth: 180,
  },
  contentBody: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: -24,
  },
  contentContainer: {
    paddingTop: 8,
    paddingBottom: 100,
  },
  walletSelector: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 24,
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  walletIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  walletName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#293454',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#293454',
    marginBottom: 16,
  },
  paymentMethod: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentMethodSelected: {
    borderColor: '#293454',
    borderWidth: 2,
  },
  methodIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  methodDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#293454',
    backgroundColor: '#293454',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  proceedButton: {
    backgroundColor: '#293454',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  
  // Bank List Styles
  bankListContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  bankListHeader: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankListTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#293454',
  },
  bankListContent: {
    flex: 1,
    padding: 24,
  },
  bankListDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  bankCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bankLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  bankInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bankName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  
  // Bank Details Styles
  bankDetailsContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  bankDetailsHeader: {
    backgroundColor: '#293454',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  bankDetailsBackButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  bankDetailsHeaderContent: {
    alignItems: 'center',
  },
  bankDetailsIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  bankDetailsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bankDetailsSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  bankDetailsBody: {
    flex: 1,
    marginTop: -24,
    paddingHorizontal: 24,
  },
  bankDetailsContentContainer: {
    paddingBottom: 120,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailItem: {
    marginBottom: 24,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 8,
  },
  detailValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  detailValueLarge: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 2,
  },
  detailValueAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#293454',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FEFCE8',
    borderRadius: 8,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FEF08A',
    alignItems: 'flex-start',
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#854D0E',
    lineHeight: 18,
  },
  
  // Success View Styles
  successContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#293454',
    marginBottom: 8,
  },
  successDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 32,
  },
  referenceCard: {
    width: '100%',
    backgroundColor: '#293454',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    overflow: 'hidden',
  },
  referenceCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  referenceCircle2: {
    position: 'absolute',
    bottom: -32,
    left: -32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  referenceLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1,
    marginBottom: 8,
  },
  referenceCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  referenceCode: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  referenceDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  referenceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  referenceFooterLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FBBF24',
    fontFamily: 'monospace',
  },
  referenceFooterRight: {
    alignItems: 'flex-end',
  },
  phoneNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  importantNotice: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  importantText: {
    flex: 1,
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 18,
  },
  importantBold: {
    fontWeight: '700',
  },
  returnButton: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  returnButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#293454',
  },
  // Wallet Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  walletModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
  },
  walletModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  walletModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  walletModalClose: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: '300',
  },
  walletOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  walletOptionSelected: {
    backgroundColor: '#F0F9FF',
  },
  walletOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  walletOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletOptionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  walletOptionBalance: {
    fontSize: 13,
    color: '#6B7280',
  },
  walletRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletRadioSelected: {
    borderColor: '#293454',
  },
  walletRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#293454',
  },
});

export default TopUpWalletScreen;
