/**
 * PAYGAM MERCHANT - FUEL MERCHANT SIDEBAR
 * Sidebar drawer component for Fuel Station Merchants
 * Features: Profile, Navigation Menu, Settings, Sign Out
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  ScrollView,
  Animated,
  Image,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.85 > 320 ? 320 : width * 0.85;

// ==================== SVG ICONS ====================
const HomeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#93C5FD' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 22V12h6v10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const GasPumpIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#93C5FD' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
  </Svg>
);

const StoreIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#93C5FD' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9l2.25-3A2 2 0 016.9 5h10.2a2 2 0 011.65.86L21 9M3 9h18M3 9v10a2 2 0 002 2h14a2 2 0 002-2V9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 21V13h6v8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BellIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#93C5FD' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TicketIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#93C5FD' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4V7a2 2 0 012-2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ListIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#93C5FD' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BankIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#93C5FD' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ExchangeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#93C5FD' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M7 10h14l-4-4M17 14H3l4 4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const IdCardIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#93C5FD' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth={2} />
    <Circle cx="8" cy="12" r="2" stroke={color} strokeWidth={2} />
    <Path d="M14 10h4M14 14h4" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const CheckCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#4ADE80' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M22 4L12 14.01l-3-3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SettingsIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
    <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke={color} strokeWidth={2} />
  </Svg>
);

const UserEditIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth={2} />
    <Path d="M7 11V7a5 5 0 0110 0v4" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const GlobeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke={color} strokeWidth={2} />
  </Svg>
);

const WalletIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#93C5FD' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 12V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-1" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="16" cy="12" r="2" stroke={color} strokeWidth={2} />
  </Svg>
);

const DollarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#93C5FD' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ClockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const WifiIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LogoutIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#F87171' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRightIcon: React.FC<{ size?: number; color?: string }> = ({ size = 10, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CloseIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ==================== TYPES ====================
interface FuelMerchantSidebarProps {
  visible: boolean;
  onClose: () => void;
  merchantName?: string;
  merchantId?: string;
  profileImage?: string;
}

// ==================== MAIN COMPONENT ====================
const FuelMerchantSidebar: React.FC<FuelMerchantSidebarProps> = ({
  visible,
  onClose,
  merchantName = 'Dilip Kumar',
  merchantId = 'NX-8821',
  profileImage = 'https://i.pravatar.cc/150?img=11',
}) => {
  const navigation = useNavigation<any>();
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Toggle states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [is24HourFormat, setIs24HourFormat] = useState(false);
  const [nfcEnabled, setNfcEnabled] = useState(true);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleNavigation = (screen: string, params?: any) => {
    onClose();
    setTimeout(() => {
      navigation.navigate(screen, params);
    }, 300);
  };

  const handleSignOut = () => {
    onClose();
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Splash' }],
      });
    }, 300);
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.backdropTouch} onPress={onClose} activeOpacity={1} />
      </Animated.View>

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: profileImage }} style={styles.avatar} />
              <View style={styles.onlineDot} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.merchantName}>{merchantName}</Text>
              <Text style={styles.merchantId}>Merchant ID: {merchantId}</Text>
              <TouchableOpacity style={styles.accountLink}>
                <Text style={styles.accountLinkText}>My Account</Text>
                <ChevronRightIcon size={10} color="#93C5FD" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Scrollable Menu */}
        <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
          {/* Main Navigation */}
          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('FuelMerchantDashboard')}>
              <View style={styles.menuIconContainer}>
                <HomeIcon size={18} color="#93C5FD" />
              </View>
              <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('FuelRedemption')}>
              <View style={styles.menuIconContainer}>
                <GasPumpIcon size={18} color="#93C5FD" />
              </View>
              <Text style={styles.menuItemText}>Fuel Redemption</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('UpdateFuelPrices')}>
              <View style={styles.menuIconContainer}>
                <DollarIcon size={18} color="#93C5FD" />
              </View>
              <Text style={styles.menuItemText}>Update Fuel Prices</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('RegisterShopMerchant')}>
              <View style={styles.menuIconContainer}>
                <StoreIcon size={18} color="#93C5FD" />
              </View>
              <Text style={styles.menuItemText}>Register Sub Merchant</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('NotificationsScreen')}>
              <View style={styles.menuIconContainer}>
                <BellIcon size={18} color="#93C5FD" />
              </View>
              <Text style={styles.menuItemText}>Notification</Text>
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('CouponScreen')}>
              <View style={styles.menuIconContainer}>
                <TicketIcon size={18} color="#93C5FD" />
              </View>
              <Text style={styles.menuItemText}>Priceless Coupon</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('Settlement', { merchantType: 'fuel' })}>
              <View style={styles.menuIconContainer}>
                <ListIcon size={18} color="#93C5FD" />
              </View>
              <Text style={styles.menuItemText}>Transaction List</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('BankAccountScreen')}>
              <View style={styles.menuIconContainer}>
                <BankIcon size={18} color="#93C5FD" />
              </View>
              <Text style={styles.menuItemText}>Bank Account</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('TopUpWallet')}>
              <View style={styles.menuIconContainer}>
                <WalletIcon size={18} color="#93C5FD" />
              </View>
              <Text style={styles.menuItemText}>Top Up Wallet</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('CurrencyConverter')}>
              <View style={styles.menuIconContainer}>
                <ExchangeIcon size={18} color="#93C5FD" />
              </View>
              <Text style={styles.menuItemText}>Currency Converter</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('KYCScreen')}>
              <View style={styles.menuIconContainer}>
                <IdCardIcon size={18} color="#93C5FD" />
              </View>
              <Text style={styles.menuItemText}>KYC Registration</Text>
              <CheckCircleIcon size={14} color="#4ADE80" />
            </TouchableOpacity>
          </View>

          {/* Settings Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Settings</Text>
            <View style={styles.settingsCard}>
              {/* Settings & Profile */}
              <TouchableOpacity style={styles.settingsItem} onPress={() => handleNavigation('SettingsProfile')}>
                <View style={styles.settingsItemLeft}>
                  <SettingsIcon size={14} color="#9CA3AF" />
                  <Text style={styles.settingsItemText}>Settings & Profile</Text>
                </View>
                <ChevronRightIcon size={12} color="#6B7280" />
              </TouchableOpacity>

              {/* Notification Enable */}
              <View style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <BellIcon size={14} color="#9CA3AF" />
                  <Text style={styles.settingsItemText}>Enable Notifications</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#4B5563', true: '#22C55E' }}
                  thumbColor="#FFFFFF"
                  style={styles.switch}
                />
              </View>

              {/* Transaction PIN */}
              <TouchableOpacity style={styles.settingsItem} onPress={() => handleNavigation('ChangePIN')}>
                <View style={styles.settingsItemLeft}>
                  <LockIcon size={14} color="#9CA3AF" />
                  <Text style={styles.settingsItemText}>Transaction PIN</Text>
                </View>
                <ChevronRightIcon size={12} color="#6B7280" />
              </TouchableOpacity>

              {/* Language */}
              <TouchableOpacity style={styles.settingsItem} onPress={() => handleNavigation('LanguageScreen')}>
                <View style={styles.settingsItemLeft}>
                  <GlobeIcon size={14} color="#9CA3AF" />
                  <Text style={styles.settingsItemText}>Language</Text>
                </View>
                <Text style={styles.settingsValue}>English</Text>
              </TouchableOpacity>

              {/* 24 Hours Format */}
              <View style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <ClockIcon size={14} color="#9CA3AF" />
                  <Text style={styles.settingsItemText}>24 Hours Format</Text>
                </View>
                <Switch
                  value={is24HourFormat}
                  onValueChange={setIs24HourFormat}
                  trackColor={{ false: '#4B5563', true: '#22C55E' }}
                  thumbColor="#FFFFFF"
                  style={styles.switch}
                />
              </View>

              {/* NFC Payment */}
              <View style={[styles.settingsItem, styles.settingsItemLast]}>
                <View style={styles.settingsItemLeft}>
                  <WifiIcon size={14} color="#9CA3AF" />
                  <Text style={styles.settingsItemText}>NFC Payment</Text>
                </View>
                <Switch
                  value={nfcEnabled}
                  onValueChange={setNfcEnabled}
                  trackColor={{ false: '#4B5563', true: '#22C55E' }}
                  thumbColor="#FFFFFF"
                  style={styles.switch}
                />
              </View>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogoutIcon size={18} color="#F87171" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>App Version 2.4.0</Text>
        </View>
      </Animated.View>

      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <CloseIcon size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    flexDirection: 'row',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  backdropTouch: {
    flex: 1,
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: '#293454',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 24,
  },
  header: {
    backgroundColor: '#1F2842',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 24 : 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    backgroundColor: '#4ADE80',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#1F2842',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  merchantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  merchantId: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  accountLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  accountLinkText: {
    fontSize: 12,
    color: '#93C5FD',
    marginRight: 4,
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  menuSection: {
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  menuIconContainer: {
    width: 24,
    alignItems: 'center',
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 16,
  },
  notificationBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  settingsSection: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  settingsSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  settingsCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingsItemLast: {
    borderBottomWidth: 0,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  settingsValue: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#1F2842',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: 14,
    borderRadius: 12,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F87171',
    marginLeft: 8,
  },
  versionText: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 56,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FuelMerchantSidebar;
