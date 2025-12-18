/**
 * PAYGAM MERCHANT - GENERAL MERCHANT DASHBOARD
 * Main dashboard for General/Retail Merchants
 * Features: Balance, Quick Actions, QR Payment, Recent Transactions
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import GeneralMerchantSidebar from '../components/GeneralMerchantSidebar';

const { width, height } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const MenuIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 12h18M3 6h18M3 18h18" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const StoreIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
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

const ArrowRightIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BellIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UserCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="8" r="4" />
    <Path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
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
interface Transaction {
  id: string;
  name: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

// ==================== MOCK DATA ====================
const mockTransactions: Transaction[] = [
  { id: '1', name: 'Customer Payment', type: 'credit', amount: 2500, currency: 'GMD', date: 'Today, 2:30 PM', status: 'completed' },
  { id: '2', name: 'Bank Settlement', type: 'debit', amount: 15000, currency: 'GMD', date: 'Today, 11:00 AM', status: 'completed' },
  { id: '3', name: 'Shop Purchase', type: 'credit', amount: 850, currency: 'GMD', date: 'Yesterday', status: 'completed' },
  { id: '4', name: 'QR Payment Received', type: 'credit', amount: 1200, currency: 'GMD', date: 'Yesterday', status: 'pending' },
  { id: '5', name: 'Withdrawal', type: 'debit', amount: 5000, currency: 'GMD', date: 'Dec 14', status: 'completed' },
];

// ==================== MAIN COMPONENT ====================
const GeneralMerchantDashboard: React.FC = () => {
  const navigation = useNavigation<any>();
  const [showBalance, setShowBalance] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('GMD');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  const balances = {
    GMD: 125750.00,
    USD: 2450.50,
    GBP: 1890.25,
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'receive':
        navigation.navigate('ReceivePayment');
        break;
      case 'settlement':
        navigation.navigate('Settlement', { merchantType: 'general' });
        break;
      case 'history':
        navigation.navigate('MerchantReports', { merchantType: 'general', merchantName: 'General Merchant' });
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarVisible(true)}>
            <MenuIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerTitle}>
            <StoreIcon size={20} color="#FFFFFF" />
            <Text style={styles.headerTitleText}>General Merchant</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('NotificationsScreen')}
          >
            <BellIcon size={22} color="#FFFFFF" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              {showBalance ? <EyeIcon size={20} color="#FFFFFF" /> : <EyeOffIcon size={20} color="#FFFFFF" />}
            </TouchableOpacity>
          </View>
          
          <Text style={styles.balanceAmount}>
            {showBalance ? `${selectedCurrency} ${formatAmount(balances[selectedCurrency as keyof typeof balances])}` : '••••••'}
          </Text>
          
          {/* Currency Selector */}
          <View style={styles.currencySelector}>
            {['GMD', 'USD', 'GBP'].map((currency) => (
              <TouchableOpacity
                key={currency}
                style={[
                  styles.currencyButton,
                  selectedCurrency === currency && styles.currencyButtonActive,
                ]}
                onPress={() => setSelectedCurrency(currency)}
              >
                <Text style={[
                  styles.currencyButtonText,
                  selectedCurrency === currency && styles.currencyButtonTextActive,
                ]}>
                  {currency}
                </Text>
              </TouchableOpacity>
            ))}
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
              onPress={() => handleQuickAction('receive')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#059669' }]}>
                <QRCodeIcon size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>Receive</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => handleQuickAction('settlement')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#3B82F6' }]}>
                <SendIcon size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>Settlement</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => handleQuickAction('history')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#8B5CF6' }]}>
                <HistoryIcon size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => handleQuickAction('settings')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#F59E0B' }]}>
                <SettingsIcon size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Merchant Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Merchant Services</Text>
          <View style={styles.servicesGrid}>
            <TouchableOpacity 
              style={styles.serviceCard}
              onPress={() => navigation.navigate('MyStore')}
            >
              <View style={[styles.serviceIcon, { backgroundColor: '#EEF2FF' }]}>
                <StoreIcon size={22} color="#4F46E5" />
              </View>
              <Text style={styles.serviceTitle}>My Store</Text>
              <Text style={styles.serviceDesc}>Manage products</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.serviceCard}
              onPress={() => navigation.navigate('ServiceManagement')}
            >
              <View style={[styles.serviceIcon, { backgroundColor: '#FEF3C7' }]}>
                <SettingsIcon size={22} color="#D97706" />
              </View>
              <Text style={styles.serviceTitle}>Services</Text>
              <Text style={styles.serviceDesc}>Your services</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.serviceCard}
              onPress={() => navigation.navigate('SubscriptionRequests')}
            >
              <View style={[styles.serviceIcon, { backgroundColor: '#DCFCE7' }]}>
                <ReceiveIcon size={22} color="#16A34A" />
              </View>
              <Text style={styles.serviceTitle}>Subscriptions</Text>
              <Text style={styles.serviceDesc}>Payment plans</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.serviceCard}
              onPress={() => navigation.navigate('MerchantSupport', { merchantType: 'general' })}
            >
              <View style={[styles.serviceIcon, { backgroundColor: '#FEE2E2' }]}>
                <BellIcon size={22} color="#DC2626" />
              </View>
              <Text style={styles.serviceTitle}>Support</Text>
              <Text style={styles.serviceDesc}>Get help</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Settlement', { merchantType: 'general' })}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsList}>
            {mockTransactions.slice(0, 4).map((transaction) => (
              <TouchableOpacity 
                key={transaction.id} 
                style={styles.transactionItem}
                onPress={() => navigation.navigate('TransactionDetails', {
                  transactionId: transaction.id,
                  amount: transaction.amount,
                  currency: transaction.currency,
                  status: transaction.status === 'completed' ? 'success' : transaction.status,
                  senderName: transaction.name,
                  date: transaction.date,
                })}
              >
                <View style={[
                  styles.transactionIcon,
                  { backgroundColor: transaction.type === 'credit' ? '#DCFCE7' : '#FEE2E2' }
                ]}>
                  {transaction.type === 'credit' ? (
                    <ReceiveIcon size={18} color="#16A34A" />
                  ) : (
                    <SendIcon size={18} color="#DC2626" />
                  )}
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionName}>{transaction.name}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={[
                    styles.transactionAmountText,
                    { color: transaction.type === 'credit' ? '#16A34A' : '#DC2626' }
                  ]}>
                    {transaction.type === 'credit' ? '+' : '-'}{transaction.currency} {formatAmount(transaction.amount)}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: transaction.status === 'completed' ? '#DCFCE7' : '#FEF3C7' }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: transaction.status === 'completed' ? '#16A34A' : '#D97706' }
                    ]}>
                      {transaction.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Sidebar */}
      <GeneralMerchantSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
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
    backgroundColor: '#059669',
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
  balanceCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  currencySelector: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  currencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  currencyButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  currencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  currencyButtonTextActive: {
    color: '#059669',
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
    color: '#059669',
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
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  serviceDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  transactionsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 15,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export default GeneralMerchantDashboard;
