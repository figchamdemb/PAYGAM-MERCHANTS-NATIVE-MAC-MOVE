/**
 * PAYGAM MERCHANT - FUEL MERCHANT DASHBOARD
 * Main dashboard for Fuel Station Merchants
 * Features: Daily Sales, Pump Stats, Quick Actions, Recent Transactions
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
  Alert,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import FuelMerchantSidebar from '../components/FuelMerchantSidebar';

const { width, height } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const MenuIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 12h18M3 6h18M3 18h18" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const GasPumpIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
  </Svg>
);

const DropletIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChartIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 20V10M12 20V4M6 20v-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const WalletIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v3" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M18 12a2 2 0 100 4h3v-4h-3z" stroke={color} strokeWidth={2} />
  </Svg>
);

const SendIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ReceiveIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3v15m0 0l-5-5m5 5l5-5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 21h18" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const QRCodeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="7" height="7" stroke={color} strokeWidth={2} />
    <Rect x="14" y="3" width="7" height="7" stroke={color} strokeWidth={2} />
    <Rect x="3" y="14" width="7" height="7" stroke={color} strokeWidth={2} />
    <Rect x="14" y="14" width="3" height="3" fill={color} />
    <Rect x="18" y="14" width="3" height="3" fill={color} />
    <Rect x="14" y="18" width="3" height="3" fill={color} />
    <Rect x="18" y="18" width="3" height="3" fill={color} />
    <Rect x="5" y="5" width="3" height="3" fill={color} />
    <Rect x="16" y="5" width="3" height="3" fill={color} />
    <Rect x="5" y="16" width="3" height="3" fill={color} />
  </Svg>
);

const HistoryIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
    <Path d="M12 7v5l3 3" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const SettingsIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
    <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke={color} strokeWidth={2} />
  </Svg>
);

const BellIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowUpIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#16A34A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 19V5M5 12l7-7 7 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronDownIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EyeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth={2} />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
  </Svg>
);

const EyeOffIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M1 1l22 22" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// ==================== TYPES ====================
interface PumpData {
  id: string;
  name: string;
  fuelType: 'Petrol' | 'Diesel' | 'Premium';
  todaySales: number;
  litresSold: number;
  status: 'active' | 'inactive';
}

interface Transaction {
  id: string;
  pumpId: string;
  amount: number;
  litres: number;
  fuelType: string;
  time: string;
  paymentMethod: string;
}

// ==================== MOCK DATA ====================
const mockPumps: PumpData[] = [
  { id: '1', name: 'Pump 1', fuelType: 'Petrol', todaySales: 45000, litresSold: 520, status: 'active' },
  { id: '2', name: 'Pump 2', fuelType: 'Petrol', todaySales: 38500, litresSold: 445, status: 'active' },
  { id: '3', name: 'Pump 3', fuelType: 'Diesel', todaySales: 62000, litresSold: 680, status: 'active' },
  { id: '4', name: 'Pump 4', fuelType: 'Premium', todaySales: 28000, litresSold: 280, status: 'inactive' },
];

const mockTransactions: Transaction[] = [
  { id: '1', pumpId: '1', amount: 2500, litres: 28.9, fuelType: 'Petrol', time: '2:30 PM', paymentMethod: 'Card' },
  { id: '2', pumpId: '3', amount: 4500, litres: 49.3, fuelType: 'Diesel', time: '2:15 PM', paymentMethod: 'Cash' },
  { id: '3', pumpId: '2', amount: 1850, litres: 21.4, fuelType: 'Petrol', time: '1:45 PM', paymentMethod: 'Mobile' },
  { id: '4', pumpId: '1', amount: 3200, litres: 37.0, fuelType: 'Petrol', time: '1:20 PM', paymentMethod: 'Card' },
];

// ==================== MAIN COMPONENT ====================
const FuelMerchantDashboard: React.FC = () => {
  const navigation = useNavigation<any>();
  const [showBalance, setShowBalance] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<'GMD' | 'USD' | 'EUR' | 'GBP'>('GMD');
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  
  const currencies = [
    { key: 'GMD', symbol: 'D', label: 'Dalasi', flag: '🇬🇲' },
    { key: 'USD', symbol: '$', label: 'US Dollar', flag: '🇺🇸' },
    { key: 'EUR', symbol: '€', label: 'Euro', flag: '🇪🇺' },
    { key: 'GBP', symbol: '£', label: 'British Pound', flag: '🇬🇧' },
  ];
  
  const currentCurrency = currencies.find(c => c.key === selectedCurrency);
  
  const todayStats = {
    totalSales: 173500,
    totalLitres: 1925,
    transactions: 89,
    growth: 12.5,
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'redemption':
        navigation.navigate('FuelRedemption');
        break;
      case 'withdraw':
        navigation.navigate('WithdrawFunds', { merchantType: 'fuel' });
        break;
      case 'history':
        navigation.navigate('MerchantReports', { merchantType: 'fuel', merchantName: 'Shell Fuel Station' });
        break;
      case 'settings':
        navigation.navigate('SettingsProfile');
        break;
      default:
        Alert.alert('Coming Soon', `${action} feature coming soon`);
    }
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2 });
  };

  const getFuelColor = (fuelType: string) => {
    switch (fuelType) {
      case 'Petrol': return '#16A34A';
      case 'Diesel': return '#2563EB';
      case 'Premium': return '#9333EA';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarVisible(true)}>
            <MenuIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerTitle}>
            <GasPumpIcon size={20} color="#FFFFFF" />
            <Text style={styles.headerTitleText}>Fuel Station</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('NotificationsScreen')}
          >
            <BellIcon size={22} color="#FFFFFF" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>5</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Daily Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsLabel}>Today's Sales</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                  gap: 6,
                }}
                onPress={() => setCurrencyModalVisible(true)}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>{currentCurrency?.flag} {selectedCurrency}</Text>
                <ChevronDownIcon size={14} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                {showBalance ? <EyeIcon size={20} color="#FFFFFF" /> : <EyeOffIcon size={20} color="#FFFFFF" />}
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.statsAmount}>
            {showBalance ? `${selectedCurrency} ${formatAmount(todayStats.totalSales)}` : '••••••'}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{showBalance ? todayStats.totalLitres.toLocaleString() : '••••'}</Text>
              <Text style={styles.statLabel}>Litres Sold</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{showBalance ? todayStats.transactions : '••'}</Text>
              <Text style={styles.statLabel}>Transactions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.growthBadge}>
                <ArrowUpIcon size={12} color="#16A34A" />
                <Text style={styles.growthText}>+{todayStats.growth}%</Text>
              </View>
              <Text style={styles.statLabel}>vs Yesterday</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => handleQuickAction('redemption')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#4F46E5' }]}>
                <QRCodeIcon size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>Redeem</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => handleQuickAction('withdraw')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#059669' }]}>
                <SendIcon size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>Withdraw</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => handleQuickAction('history')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#F59E0B' }]}>
                <ChartIcon size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => handleQuickAction('settings')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#6B7280' }]}>
                <SettingsIcon size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pump Status */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pump Status</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Manage</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pumpsContainer}
          >
            {mockPumps.map((pump) => (
              <View key={pump.id} style={styles.pumpCard}>
                <View style={styles.pumpHeader}>
                  <View style={[styles.pumpIconBg, { backgroundColor: getFuelColor(pump.fuelType) + '20' }]}>
                    <GasPumpIcon size={18} color={getFuelColor(pump.fuelType)} />
                  </View>
                  <View style={[
                    styles.pumpStatusDot,
                    { backgroundColor: pump.status === 'active' ? '#16A34A' : '#EF4444' }
                  ]} />
                </View>
                <Text style={styles.pumpName}>{pump.name}</Text>
                <Text style={[styles.pumpFuelType, { color: getFuelColor(pump.fuelType) }]}>{pump.fuelType}</Text>
                <Text style={styles.pumpSales}>GMD {(pump.todaySales / 1000).toFixed(1)}K</Text>
                <Text style={styles.pumpLitres}>{pump.litresSold}L sold</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Fuel Prices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Prices</Text>
          <View style={styles.pricesCard}>
            <View style={styles.priceItem}>
              <View style={[styles.priceIcon, { backgroundColor: '#DCFCE7' }]}>
                <DropletIcon size={18} color="#16A34A" />
              </View>
              <View style={styles.priceInfo}>
                <Text style={styles.priceLabel}>Petrol</Text>
                <Text style={styles.priceValue}>GMD 86.50/L</Text>
              </View>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceItem}>
              <View style={[styles.priceIcon, { backgroundColor: '#DBEAFE' }]}>
                <DropletIcon size={18} color="#2563EB" />
              </View>
              <View style={styles.priceInfo}>
                <Text style={styles.priceLabel}>Diesel</Text>
                <Text style={styles.priceValue}>GMD 91.25/L</Text>
              </View>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceItem}>
              <View style={[styles.priceIcon, { backgroundColor: '#F3E8FF' }]}>
                <DropletIcon size={18} color="#9333EA" />
              </View>
              <View style={styles.priceInfo}>
                <Text style={styles.priceLabel}>Premium</Text>
                <Text style={styles.priceValue}>GMD 100.00/L</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Sales */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Sales</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Settlement', { merchantType: 'fuel' })}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.salesList}>
            {mockTransactions.map((transaction) => (
              <TouchableOpacity 
                key={transaction.id} 
                style={styles.saleItem}
                onPress={() => navigation.navigate('TransactionDetails', {
                  transactionId: transaction.id,
                  amount: transaction.amount,
                  currency: 'GMD',
                  status: 'success',
                  senderName: `${transaction.pumpId} - ${transaction.fuelType}`,
                  date: `Today, ${transaction.time}`,
                })}
              >
                <View style={[styles.saleIcon, { backgroundColor: getFuelColor(transaction.fuelType) + '20' }]}>
                  <GasPumpIcon size={18} color={getFuelColor(transaction.fuelType)} />
                </View>
                <View style={styles.saleInfo}>
                  <Text style={styles.salePump}>Pump {transaction.pumpId}</Text>
                  <Text style={styles.saleDetails}>{transaction.litres}L {transaction.fuelType} • {transaction.paymentMethod}</Text>
                </View>
                <View style={styles.saleAmount}>
                  <Text style={styles.saleAmountText}>GMD {formatAmount(transaction.amount)}</Text>
                  <Text style={styles.saleTime}>{transaction.time}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Sidebar */}
      <FuelMerchantSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

      {/* Currency Selector Modal */}
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
                  setSelectedCurrency(currency.key as 'GMD' | 'USD' | 'EUR' | 'GBP');
                  setCurrencyModalVisible(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.currencyFlag}>{currency.flag}</Text>
                <View style={styles.currencyInfo}>
                  <Text style={[
                    styles.modalOptionText,
                    selectedCurrency === currency.key && styles.modalOptionTextActive,
                  ]}>
                    {currency.label}
                  </Text>
                  <Text style={styles.currencyCode}>{currency.key}</Text>
                </View>
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
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  statsCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  statsAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 163, 74, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  growthText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4ADE80',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    alignItems: 'center',
    width: (width - 60) / 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  pumpsContainer: {
    paddingRight: 20,
    gap: 12,
  },
  pumpCard: {
    width: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pumpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pumpIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pumpStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pumpName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  pumpFuelType: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  pumpSales: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  pumpLitres: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  pricesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  priceItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  priceIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceInfo: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
  priceDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  salesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  saleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  saleIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saleInfo: {
    flex: 1,
    marginLeft: 12,
  },
  salePump: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  saleDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  saleAmount: {
    alignItems: 'flex-end',
  },
  saleAmountText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#16A34A',
  },
  saleTime: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  // Currency Modal Styles
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
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  modalOptionText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  modalOptionTextActive: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  currencyFlag: {
    fontSize: 24,
    marginRight: 14,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});

export default FuelMerchantDashboard;
