/**
 * PAYGAM MERCHANT - CORPORATE MERCHANT DASHBOARD
 * Main dashboard for Corporate/Business Merchants
 * Features: Multi-Currency Balance, Standing Orders, Search, FAB Menu
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
  Animated,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import CorporateMerchantSidebar from '../components/CorporateMerchantSidebar';

const { width, height } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const MenuIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 12h18M3 6h18M3 18h18" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const CubeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BellIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowUpIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#4ADE80' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 19V5M5 12l7-7 7 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DollarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EuroIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#BFDBFE' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 10h12M4 14h12M17.5 5.5C16.5 4.5 15 4 13.5 4 9.36 4 6 7.58 6 12s3.36 8 7.5 8c1.5 0 3-.5 4-1.5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PoundIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#BFDBFE' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 20H6M8 12h6M18 8a4 4 0 00-4-4c-2.5 0-4.5 1.5-5.5 4-.5 1.5-.5 3-.5 4s0 2.5-.5 4H6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const YenIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#BFDBFE' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 20v-8M12 12L5 4M12 12l7-8M6 12h12M6 16h12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SearchIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={2} />
    <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const FilterIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRightIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#D1D5DB' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BuildingIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#C2410C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const NetworkIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#7C3AED' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="2" width="14" height="6" rx="1" stroke={color} strokeWidth={2} />
    <Rect x="2" y="16" width="6" height="6" rx="1" stroke={color} strokeWidth={2} />
    <Rect x="16" y="16" width="6" height="6" rx="1" stroke={color} strokeWidth={2} />
    <Path d="M12 8v4M5 19h4M15 19h4M12 12h-7a1 1 0 00-1 1v3M12 12h7a1 1 0 011 1v3" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const PlusIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
  </Svg>
);

const HomeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 22V12h6v10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChartIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21.21 15.89A10 10 0 118 2.83" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M22 12A10 10 0 0012 2v10z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ExchangeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M7 10h14l-4-4M17 14H3l4 4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UserIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={2} />
    <Path d="M20 21a8 8 0 10-16 0" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const FileIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CloseIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const WalletIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 12V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-1" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="16" cy="12" r="2" stroke={color} strokeWidth={2} />
  </Svg>
);

// ==================== TYPES ====================
interface StandingOrder {
  id: string;
  name: string;
  initials?: string;
  avatar?: string;
  orderNumber: string;
  frequency: string;
  status: 'Active' | 'Review' | 'Paused';
  icon?: React.ReactNode;
  bgColor: string;
  textColor: string;
}

interface Currency {
  code: string;
  symbol: React.ReactNode;
  active: boolean;
}

// ==================== MOCK DATA ====================
const currencies: Currency[] = [
  { code: 'USD', symbol: <DollarIcon size={12} color="#293454" />, active: true },
  { code: 'EUR', symbol: <EuroIcon size={12} color="#BFDBFE" />, active: false },
  { code: 'GBP', symbol: <PoundIcon size={12} color="#BFDBFE" />, active: false },
  { code: 'JPY', symbol: <YenIcon size={12} color="#BFDBFE" />, active: false },
];

const standingOrders: StandingOrder[] = [
  {
    id: '1',
    name: 'Apex Logistics',
    initials: 'AL',
    orderNumber: '#SO-8832',
    frequency: 'Monthly',
    status: 'Active',
    bgColor: '#E0E7FF',
    textColor: '#293454',
  },
  {
    id: '2',
    name: 'BuildRight Const.',
    orderNumber: '#SO-9921',
    frequency: 'Weekly',
    status: 'Active',
    icon: <BuildingIcon size={20} color="#C2410C" />,
    bgColor: '#FFEDD5',
    textColor: '#C2410C',
  },
  {
    id: '3',
    name: 'Sarah Jenkins',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    orderNumber: '#SO-1102',
    frequency: 'Bi-Weekly',
    status: 'Review',
    bgColor: '#FEF3C7',
    textColor: '#D97706',
  },
  {
    id: '4',
    name: 'Tech Solutions Ltd',
    initials: 'TS',
    orderNumber: '#SO-4451',
    frequency: 'Monthly',
    status: 'Active',
    bgColor: '#DBEAFE',
    textColor: '#1D4ED8',
  },
  {
    id: '5',
    name: 'Global Net',
    orderNumber: '#SO-3321',
    frequency: 'Quarterly',
    status: 'Paused',
    icon: <NetworkIcon size={20} color="#7C3AED" />,
    bgColor: '#EDE9FE',
    textColor: '#7C3AED',
  },
];

// ==================== MAIN COMPONENT ====================
const CorporateMerchantDashboard: React.FC = () => {
  const navigation = useNavigation<any>();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [searchQuery, setSearchQuery] = useState('');
  const [fabExpanded, setFabExpanded] = useState(false);
  
  const fabRotation = useRef(new Animated.Value(0)).current;
  const fabMenuOpacity = useRef(new Animated.Value(0)).current;
  const fabMenuTranslate = useRef(new Animated.Value(20)).current;

  const toggleFab = () => {
    const toValue = fabExpanded ? 0 : 1;
    
    Animated.parallel([
      Animated.spring(fabRotation, {
        toValue,
        useNativeDriver: true,
        friction: 5,
      }),
      Animated.timing(fabMenuOpacity, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(fabMenuTranslate, {
        toValue: fabExpanded ? 20 : 0,
        useNativeDriver: true,
        friction: 6,
      }),
    ]).start();
    
    setFabExpanded(!fabExpanded);
  };

  const handleFabAction = (action: string) => {
    toggleFab();
    setTimeout(() => {
      switch (action) {
        case 'standing-order':
          navigation.navigate('CreateStandingOrder');
          break;
        case 'payment':
          navigation.navigate('CreatePayment');
          break;
        case 'invoice':
          navigation.navigate('CreateInvoice');
          break;
        case 'topup':
          navigation.navigate('TopUpWallet');
          break;
      }
    }, 200);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return { bg: '#DCFCE7', text: '#15803D' };
      case 'Review':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'Paused':
        return { bg: '#F3F4F6', text: '#6B7280' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const fabRotateInterpolate = fabRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#293454" />
      
      {/* Header Section */}
      <View style={styles.header}>
        {/* Status Bar Spacer */}
        <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }} />

        {/* Top Navigation */}
        <View style={styles.headerNav}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setSidebarVisible(true)}
          >
            <MenuIcon size={20} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>

          <View style={styles.brandContainer}>
            <View style={styles.brandIcon}>
              <CubeIcon size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.brandText}>NEXUSPAY CORP</Text>
          </View>

          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('NotificationsScreen')}
          >
            <BellIcon size={20} color="rgba(255,255,255,0.8)" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Balance Display */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Consolidated Liquidity</Text>
          <Text style={styles.balanceAmount}>
            $ 2,840,500<Text style={styles.balanceCents}>.00</Text>
          </Text>
          <View style={styles.growthBadge}>
            <ArrowUpIcon size={12} color="#4ADE80" />
            <Text style={styles.growthText}>+4.2% this month</Text>
          </View>
        </View>

        {/* Currency Selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.currencyContainer}
        >
          {currencies.map((currency) => (
            <TouchableOpacity
              key={currency.code}
              style={[
                styles.currencyButton,
                selectedCurrency === currency.code && styles.currencyButtonActive,
              ]}
              onPress={() => setSelectedCurrency(currency.code)}
            >
              <View style={[
                styles.currencyIcon,
                selectedCurrency === currency.code && styles.currencyIconActive,
              ]}>
                {currency.symbol}
              </View>
              <Text style={[
                styles.currencyText,
                selectedCurrency === currency.code && styles.currencyTextActive,
              ]}>
                {currency.code}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Search Card */}
        <View style={styles.searchCard}>
          <View style={styles.searchInputContainer}>
            <SearchIcon size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contractors, IDs..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.filterButton}>
              <FilterIcon size={16} color="#293454" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Standing Orders Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Standing Orders</Text>
          <TouchableOpacity onPress={() => navigation.navigate('StandingOrdersList')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Standing Orders List */}
        <ScrollView 
          style={styles.ordersList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 160 }}
        >
          {standingOrders.map((order) => {
            const statusStyle = getStatusStyle(order.status);
            return (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => navigation.navigate('StandingOrderDetails', { orderId: order.id })}
                activeOpacity={0.7}
              >
                <View style={styles.orderCardLeft}>
                  {order.avatar ? (
                    <Image source={{ uri: order.avatar }} style={styles.orderAvatar} />
                  ) : order.icon ? (
                    <View style={[styles.orderIconContainer, { backgroundColor: order.bgColor }]}>
                      {order.icon}
                    </View>
                  ) : (
                    <View style={[styles.orderInitialsContainer, { backgroundColor: order.bgColor }]}>
                      <Text style={[styles.orderInitials, { color: order.textColor }]}>
                        {order.initials}
                      </Text>
                    </View>
                  )}
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderName}>{order.name}</Text>
                    <Text style={styles.orderDetails}>ID: {order.orderNumber} • {order.frequency}</Text>
                  </View>
                </View>
                <View style={styles.orderCardRight}>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                      {order.status}
                    </Text>
                  </View>
                  <ChevronRightIcon size={12} color="#D1D5DB" />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* FAB Menu Items */}
      {fabExpanded && (
        <Animated.View 
          style={[
            styles.fabMenu,
            {
              opacity: fabMenuOpacity,
              transform: [{ translateY: fabMenuTranslate }],
            },
          ]}
        >
          <TouchableOpacity 
            style={styles.fabMenuItem}
            onPress={() => handleFabAction('topup')}
          >
            <View style={[styles.fabMenuIcon, { backgroundColor: '#F59E0B' }]}>
              <WalletIcon size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.fabMenuText}>Top Up Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.fabMenuItem}
            onPress={() => handleFabAction('standing-order')}
          >
            <View style={[styles.fabMenuIcon, { backgroundColor: '#4F46E5' }]}>
              <FileIcon size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.fabMenuText}>Standing Order</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.fabMenuItem}
            onPress={() => handleFabAction('payment')}
          >
            <View style={[styles.fabMenuIcon, { backgroundColor: '#059669' }]}>
              <ExchangeIcon size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.fabMenuText}>New Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.fabMenuItem}
            onPress={() => handleFabAction('invoice')}
          >
            <View style={[styles.fabMenuIcon, { backgroundColor: '#DC2626' }]}>
              <FileIcon size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.fabMenuText}>Create Invoice</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* FAB Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={toggleFab}
        activeOpacity={0.9}
      >
        <Animated.View style={{ transform: [{ rotate: fabRotateInterpolate }] }}>
          {fabExpanded ? (
            <CloseIcon size={24} color="#FFFFFF" />
          ) : (
            <PlusIcon size={24} color="#FFFFFF" />
          )}
        </Animated.View>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <HomeIcon size={20} color="#293454" />
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('AnalyticsScreen')}
        >
          <ChartIcon size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('TransfersScreen')}
        >
          <ExchangeIcon size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Transfers</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <UserIcon size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Sidebar */}
      <CorporateMerchantSidebar
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#293454',
    paddingBottom: 8,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    marginBottom: 24,
  },
  menuButton: {
    padding: 8,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#60A5FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    backgroundColor: '#EF4444',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#293454',
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  balanceLabel: {
    color: '#93C5FD',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1,
  },
  balanceCents: {
    fontSize: 24,
    color: '#93C5FD',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  growthText: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  currencyContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 12,
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A476B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  currencyButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  currencyIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyIconActive: {
    backgroundColor: '#EFF6FF',
  },
  currencyText: {
    color: '#BFDBFE',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  currencyTextActive: {
    color: '#293454',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    marginTop: -24,
    paddingHorizontal: 20,
    zIndex: 20,
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 24,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#374151',
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#293454',
  },
  viewAllText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
  ordersList: {
    flex: 1,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  orderCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  orderIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderInitialsContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderInitials: {
    fontSize: 18,
    fontWeight: '700',
  },
  orderInfo: {
    marginLeft: 16,
    flex: 1,
  },
  orderName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  orderDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  orderCardRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fabMenu: {
    position: 'absolute',
    bottom: 156,
    right: 20,
    alignItems: 'flex-end',
    gap: 12,
    zIndex: 100,
  },
  fabMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  fabMenuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fabMenuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  fab: {
    position: 'absolute',
    bottom: 96,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#293454',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 100,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    zIndex: 40,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  navTextActive: {
    color: '#293454',
  },
});

export default CorporateMerchantDashboard;
