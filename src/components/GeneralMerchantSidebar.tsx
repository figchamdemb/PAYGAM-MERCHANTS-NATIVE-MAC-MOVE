/**
 * PAYGAM MERCHANT - GENERAL MERCHANT SIDEBAR
 * Sidebar drawer component for General/Retail Merchants
 * Features: Profile, QR Code, Business Tools, Finance, Settings, Sign Out
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
const SIDEBAR_WIDTH = width * 0.85 > 360 ? 360 : width * 0.85;

// ==================== SVG ICONS ====================
const QRCodeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#293454' }) => (
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

const IdCardClipIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="16" rx="2" stroke={color} strokeWidth={2} />
    <Circle cx="9" cy="12" r="2" stroke={color} strokeWidth={2} />
    <Path d="M15 10h3M15 14h3" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M9 3v2" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M15 3v2" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const StoreIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9l2.25-3A2 2 0 016.9 5h10.2a2 2 0 011.65.86L21 9M3 9h18M3 9v10a2 2 0 002 2h14a2 2 0 002-2V9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 21V13h6v8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UserPlusIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M19 8v6M22 11h-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ListCheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M11 6h9M11 12h9M11 18h9M4 6l1 1 3-3M4 12l1 1 3-3M4 18l1 1 3-3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CirclePlusIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M12 8v8M8 12h8" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const UsersIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const InvoiceIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BankIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ExchangeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M7 10h14l-4-4M17 14H3l4 4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BellIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EditIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const KeyIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
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

const WalletIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 12V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-1" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="16" cy="12" r="2" stroke={color} strokeWidth={2} />
  </Svg>
);
const HeadsetIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 18v-6a9 9 0 0118 0v6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const WifiIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SettingsIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
    <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LogoutIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#DC2626' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRightIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#D1D5DB' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronDownIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#059669' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M22 4L12 14.01l-3-3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CloseIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ==================== TYPES ====================
interface GeneralMerchantSidebarProps {
  visible: boolean;
  onClose: () => void;
  merchantName?: string;
  merchantId?: string;
  profileImage?: string;
}

// ==================== MAIN COMPONENT ====================
const GeneralMerchantSidebar: React.FC<GeneralMerchantSidebarProps> = ({
  visible,
  onClose,
  merchantName = 'Nexus Merchant',
  merchantId = '8839-2910-MER',
  profileImage = 'https://i.pravatar.cc/150?img=11',
}) => {
  const navigation = useNavigation<any>();
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Toggle states
  const [nfcEnabled, setNfcEnabled] = useState(true);
  const [settingsExpanded, setSettingsExpanded] = useState(true);

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
          <View style={styles.decorativeCircle} />
          
          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.merchantName}>{merchantName}</Text>
              <Text style={styles.merchantId}>ID: {merchantId}</Text>
              <View style={styles.verifiedBadge}>
                <CheckIcon size={10} color="#86EFAC" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Scrollable Menu */}
        <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
          {/* Section: Essentials */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Essentials</Text>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('QRCodeScreen')}>
              <View style={[styles.menuIconContainer, styles.menuIconPrimary]}>
                <QRCodeIcon size={18} color="#293454" />
              </View>
              <Text style={styles.menuItemText}>My QR Code</Text>
              <ChevronRightIcon size={12} color="#D1D5DB" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('KYCScreen')}>
              <View style={[styles.menuIconContainer, styles.menuIconPrimary]}>
                <IdCardClipIcon size={18} color="#293454" />
              </View>
              <Text style={styles.menuItemText}>My KYC</Text>
              <View style={styles.approvedBadge}>
                <Text style={styles.approvedText}>Approved</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Section: Business */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Business</Text>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('MyStoreScreen')}>
              <View style={styles.menuIconContainer}>
                <StoreIcon size={18} color="#6B7280" />
              </View>
              <Text style={styles.menuItemText}>My Store</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('RegisterShopMerchant')}>
              <View style={styles.menuIconContainer}>
                <UserPlusIcon size={18} color="#6B7280" />
              </View>
              <Text style={styles.menuItemText}>Register Sub Merchant</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('ServiceListScreen')}>
              <View style={styles.menuIconContainer}>
                <ListCheckIcon size={18} color="#6B7280" />
              </View>
              <Text style={styles.menuItemText}>Service List</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('CreateServiceScreen')}>
              <View style={styles.menuIconContainer}>
                <CirclePlusIcon size={18} color="#6B7280" />
              </View>
              <Text style={styles.menuItemText}>Create Service</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('SubscribersScreen')}>
              <View style={styles.menuIconContainer}>
                <UsersIcon size={18} color="#6B7280" />
              </View>
              <Text style={styles.menuItemText}>Subscribers Request</Text>
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Section: Finance */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Finance</Text>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('Settlement', { merchantType: 'general' })}>
              <View style={styles.menuIconContainer}>
                <InvoiceIcon size={18} color="#6B7280" />
              </View>
              <Text style={styles.menuItemText}>Submission History</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('BankAccountScreen')}>
              <View style={styles.menuIconContainer}>
                <BankIcon size={18} color="#6B7280" />
              </View>
              <Text style={styles.menuItemText}>Bank Account</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('TopUpWallet')}>
              <View style={styles.menuIconContainer}>
                <WalletIcon size={18} color="#6B7280" />
              </View>
              <Text style={styles.menuItemText}>Top Up Wallet</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('CurrencyConverter')}>
              <View style={styles.menuIconContainer}>
                <ExchangeIcon size={18} color="#6B7280" />
              </View>
              <Text style={styles.menuItemText}>Currency Converter</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Section: Settings - Expandable */}
          <View style={styles.menuSection}>
            <TouchableOpacity 
              style={styles.settingsHeader}
              onPress={() => setSettingsExpanded(!settingsExpanded)}
            >
              <Text style={styles.sectionTitle}>Settings</Text>
              <View style={{ transform: [{ rotate: settingsExpanded ? '180deg' : '0deg' }] }}>
                <ChevronDownIcon size={12} color="#293454" />
              </View>
            </TouchableOpacity>
            
            {settingsExpanded && (
              <View style={styles.settingsCard}>
                <TouchableOpacity style={styles.settingsItem} onPress={() => handleNavigation('SettingsProfile')}>
                  <SettingsIcon size={14} color="#9CA3AF" />
                  <Text style={styles.settingsItemText}>Settings & Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem} onPress={() => handleNavigation('NotificationsScreen')}>
                  <BellIcon size={14} color="#9CA3AF" />
                  <Text style={styles.settingsItemText}>Notifications</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem} onPress={() => handleNavigation('ChangePIN')}>
                  <KeyIcon size={14} color="#9CA3AF" />
                  <Text style={styles.settingsItemText}>Change Transaction PIN</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem} onPress={() => handleNavigation('ChangeMPIN')}>
                  <LockIcon size={14} color="#9CA3AF" />
                  <Text style={styles.settingsItemText}>Change MPIN</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem} onPress={() => handleNavigation('LanguageScreen')}>
                  <GlobeIcon size={14} color="#9CA3AF" />
                  <Text style={styles.settingsItemText}>Select Language</Text>
                  <Text style={styles.settingsValue}>English</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem} onPress={() => handleNavigation('HelpCenter')}>
                  <HeadsetIcon size={14} color="#9CA3AF" />
                  <Text style={styles.settingsItemText}>24/7 Helpline</Text>
                </TouchableOpacity>

                <View style={[styles.settingsItem, styles.settingsItemLast]}>
                  <WifiIcon size={14} color="#9CA3AF" />
                  <Text style={styles.settingsItemText}>Enable NFC</Text>
                  <Switch
                    value={nfcEnabled}
                    onValueChange={setNfcEnabled}
                    trackColor={{ false: '#E5E7EB', true: '#293454' }}
                    thumbColor="#FFFFFF"
                    style={styles.switch}
                  />
                </View>
              </View>
            )}
          </View>

          <View style={{ height: 6 }} />
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogoutIcon size={18} color="#DC2626" />
            <Text style={styles.signOutText}>Log Out</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>App Version 2.4.0 (Build 202)</Text>
        </View>
      </Animated.View>

      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <View style={styles.closeButtonInner}>
          <CloseIcon size={20} color="#FFFFFF" />
        </View>
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
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
  },
  backdropTouch: {
    flex: 1,
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 24,
  },
  header: {
    backgroundColor: '#293454',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 24 : 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircle: {
    position: 'absolute',
    bottom: -24,
    right: -24,
    width: 96,
    height: 96,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 48,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
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
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#86EFAC',
    marginLeft: 4,
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  menuSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconPrimary: {
    backgroundColor: 'rgba(41, 52, 84, 0.1)',
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 16,
  },
  approvedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  approvedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  notificationBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
    marginVertical: 4,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  settingsCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingsItemLast: {
    borderBottomWidth: 0,
  },
  settingsItemText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
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
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    borderRadius: 12,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 8,
  },
  versionText: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 12,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 56,
    right: 16,
  },
  closeButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GeneralMerchantSidebar;
