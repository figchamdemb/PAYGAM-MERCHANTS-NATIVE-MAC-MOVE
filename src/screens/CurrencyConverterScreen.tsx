/**
 * CurrencyConverterScreen.tsx
 * Currency Exchange/Converter screen for PayGam Merchant App
 * 
 * Features:
 * - Convert between USD and GMD currencies
 * - View current exchange rate
 * - Swap currencies
 * - View recent conversion history
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
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
    <Path
      d="M3 12C3 7.02944 7.02944 3 12 3"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

const SwapIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 16L3 12M3 12L7 8M3 12H21M17 8L21 12M21 12L17 16"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ChartIcon = ({ size = 24, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 3V21H21"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7 14L11 10L15 14L21 8"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ArrowRightIcon = ({ size = 24, color = '#FFFFFF' }) => (
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

const ShieldIcon = ({ size = 16, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ArrowDownIcon = ({ size = 20, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5V19M12 19L5 12M12 19L19 12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ArrowUpIcon = ({ size = 20, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 19V5M12 5L5 12M12 5L19 12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ChevronDownIcon = ({ size = 12, color = '#9CA3AF' }) => (
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

interface CurrencyConverterScreenProps {
  navigation: any;
}

interface ConversionHistory {
  id: string;
  type: 'buy' | 'sell';
  currency: string;
  amount: string;
  equivalent: string;
  date: string;
}

const CurrencyConverterScreen: React.FC<CurrencyConverterScreenProps> = ({ navigation }) => {
  const [fromAmount, setFromAmount] = useState('200');
  const [toAmount, setToAmount] = useState('13,570.00');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('GMD');
  
  const exchangeRate = 67.85;
  const fee = 0.5; // 0.5%
  
  const recentConversions: ConversionHistory[] = [
    {
      id: '1',
      type: 'buy',
      currency: 'GMD',
      amount: '+ 3,400 GMD',
      equivalent: '- $50.00 USD',
      date: 'Today, 10:23 AM',
    },
    {
      id: '2',
      type: 'sell',
      currency: 'GMD',
      amount: '+ $100.00 USD',
      equivalent: '- 6,750 GMD',
      date: 'Yesterday, 4:15 PM',
    },
  ];

  const handleAmountChange = (value: string) => {
    setFromAmount(value);
    const numValue = parseFloat(value) || 0;
    const converted = (numValue * exchangeRate).toFixed(2);
    setToAmount(converted.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount.replace(/,/g, ''));
    const numValue = parseFloat(toAmount.replace(/,/g, '')) || 0;
    const converted = (numValue / exchangeRate).toFixed(2);
    setToAmount(converted.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  };

  const handleConvert = () => {
    navigation.navigate('ActionSuccess', {
      title: 'Conversion Successful',
      message: `You have successfully converted ${fromAmount} ${fromCurrency} to ${toAmount} ${toCurrency}`,
      type: 'currency-conversion',
      navigateTo: 'CorporateMerchantDashboard',
    });
  };

  const calculateFee = () => {
    const amount = parseFloat(fromAmount) || 0;
    return (amount * (fee / 100)).toFixed(2);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#293454" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeftIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Currency Exchange</Text>
          
          <TouchableOpacity style={styles.headerButton}>
            <HistoryIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.liquidityLabel}>Total Liquidity</Text>
        <View style={styles.liquidityRow}>
          <Text style={styles.liquidityAmount}>$12,450.00 </Text>
          <Text style={styles.liquidityCurrency}>USD</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Converter Card */}
        <View style={styles.converterCard}>
          {/* From Section */}
          <View style={styles.currencySection}>
            <View style={styles.currencyLabelRow}>
              <Text style={styles.currencyLabel}>FROM WALLET</Text>
              <Text style={styles.balanceText}>Bal: $2,400.50</Text>
            </View>
            
            <View style={styles.currencyInputContainer}>
              <TouchableOpacity style={styles.currencySelector}>
                <View style={[styles.currencyFlag, { backgroundColor: '#DBEAFE' }]}>
                  <Text style={styles.flagEmoji}>🇺🇸</Text>
                </View>
                <Text style={styles.currencyCode}>{fromCurrency}</Text>
                <ChevronDownIcon size={12} color="#9CA3AF" />
              </TouchableOpacity>
              
              <TextInput
                style={styles.amountInput}
                value={fromAmount}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor="#D1D5DB"
              />
            </View>
          </View>

          {/* Swap Divider */}
          <View style={styles.swapDividerContainer}>
            <View style={styles.dividerLine} />
            <TouchableOpacity 
              style={styles.swapButton}
              onPress={handleSwapCurrencies}
              activeOpacity={0.8}
            >
              <SwapIcon size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* To Section */}
          <View style={styles.currencySection}>
            <View style={styles.currencyLabelRow}>
              <Text style={styles.currencyLabel}>TO WALLET</Text>
              <Text style={styles.balanceText}>Bal: GMD 45,200.00</Text>
            </View>
            
            <View style={styles.currencyInputContainer}>
              <TouchableOpacity style={styles.currencySelector}>
                <View style={[styles.currencyFlag, { backgroundColor: '#DCFCE7' }]}>
                  <Text style={styles.flagEmoji}>🇬🇲</Text>
                </View>
                <Text style={styles.currencyCode}>{toCurrency}</Text>
                <ChevronDownIcon size={12} color="#9CA3AF" />
              </TouchableOpacity>
              
              <Text style={styles.convertedAmount}>{toAmount}</Text>
            </View>
          </View>

          {/* Exchange Rate Info */}
          <View style={styles.rateInfoContainer}>
            <View style={styles.rateLeft}>
              <View style={styles.rateIconContainer}>
                <ChartIcon size={18} color="#293454" />
              </View>
              <View>
                <Text style={styles.rateLabel}>Current Rate</Text>
                <Text style={styles.rateValue}>1 USD ≈ {exchangeRate} GMD</Text>
              </View>
            </View>
            
            <View style={styles.rateRight}>
              <Text style={styles.feeLabel}>Fee ({fee}%)</Text>
              <Text style={styles.feeValue}>-${calculateFee()}</Text>
            </View>
          </View>
        </View>

        {/* Convert Button */}
        <TouchableOpacity 
          style={styles.convertButton}
          onPress={handleConvert}
          activeOpacity={0.9}
        >
          <Text style={styles.convertButtonText}>Convert Now</Text>
          <ArrowRightIcon size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.secureTextContainer}>
          <ShieldIcon size={14} color="#9CA3AF" />
          <Text style={styles.secureText}> Secure SSL Encrypted Transaction</Text>
        </View>

        {/* Recent Conversions */}
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Recent Conversions</Text>
          
          {recentConversions.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <View style={[
                  styles.historyIconContainer,
                  { backgroundColor: item.type === 'buy' ? '#F0FDF4' : '#EFF6FF' }
                ]}>
                  {item.type === 'buy' ? (
                    <ArrowDownIcon size={18} color="#22C55E" />
                  ) : (
                    <ArrowUpIcon size={18} color="#293454" />
                  )}
                </View>
                <View>
                  <Text style={styles.historyTitle}>
                    {item.type === 'buy' ? 'Bought' : 'Sold'} {item.currency}
                  </Text>
                  <Text style={styles.historyDate}>{item.date}</Text>
                </View>
              </View>
              
              <View style={styles.historyRight}>
                <Text style={styles.historyAmount}>{item.amount}</Text>
                <Text style={styles.historyEquivalent}>{item.equivalent}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#293454',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 96,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
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
  liquidityLabel: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  liquidityRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 16,
  },
  liquidityAmount: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  liquidityCurrency: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  scrollView: {
    flex: 1,
    marginTop: -64,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  converterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  currencySection: {
    marginBottom: 16,
  },
  currencyLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  currencyLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 1,
  },
  balanceText: {
    fontSize: 12,
    color: '#293454',
    fontWeight: '500',
  },
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
    gap: 8,
  },
  currencyFlag: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  flagEmoji: {
    fontSize: 18,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#293454',
    textAlign: 'right',
    paddingLeft: 12,
  },
  convertedAmount: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#9CA3AF',
    textAlign: 'right',
    paddingLeft: 12,
  },
  swapDividerContainer: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#293454',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  rateInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    marginTop: 8,
  },
  rateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rateIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(41, 52, 84, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  rateValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#293454',
  },
  rateRight: {
    alignItems: 'flex-end',
  },
  feeLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  feeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
  convertButton: {
    backgroundColor: '#293454',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 32,
    gap: 12,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  convertButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secureTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  secureText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  recentSection: {
    marginTop: 32,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#293454',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  historyDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#293454',
  },
  historyEquivalent: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
});

export default CurrencyConverterScreen;
