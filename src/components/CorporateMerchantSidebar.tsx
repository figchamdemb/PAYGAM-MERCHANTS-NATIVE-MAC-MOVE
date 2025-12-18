/**
 * PAYGAM MERCHANT - CORPORATE MERCHANT SIDEBAR
 * Sidebar drawer component for Corporate/Business Merchants
 * Features: Profile, Navigation Menu, Expandable Settings, Sign Out
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
const HomeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 22V12h6v10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const StoreIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9l2.25-3A2 2 0 016.9 5h10.2a2 2 0 011.65.86L21 9M3 9h18M3 9v10a2 2 0 002 2h14a2 2 0 002-2V9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 21V13h6v8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BellIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BankIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ExchangeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M7 10h14l-4-4M17 14H3l4 4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const IdCardIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth={2} />
    <Circle cx="8" cy="12" r="2" stroke={color} strokeWidth={2} />
    <Path d="M14 10h4M14 14h4" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const SettingsIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
    <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke={color} strokeWidth={2} />
  </Svg>
);

const UserIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const KeyIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth={2} />
    <Path d="M7 11V7a5 5 0 0110 0v4" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const GlobeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke={color} strokeWidth={2} />
  </Svg>
);

const WalletIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 12V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-1" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="16" cy="12" r="2" stroke={color} strokeWidth={2} />
  </Svg>
);

const HeadsetIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 18v-6a9 9 0 0118 0v6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const WifiIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LogoutIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#DC2626' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronUpIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 15l-6-6-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRightIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ==================== TYPES ====================
interface CorporateMerchantSidebarProps {
  visible: boolean;
  onClose: () => void;
  merchantName?: string;
  merchantId?: string;
  profileImage?: string;
}

// ==================== MAIN COMPONENT ====================
const CorporateMerchantSidebar: React.FC<CorporateMerchantSidebarProps> = ({
  visible,
  onClose,
  merchantName = 'Nexus Corp Ltd.',
  merchantId = 'NX-8829-MER',
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
          
          <View style={styles.avatarContainer}>
            <Image source={{ uri: profileImage }} style={styles.avatar} />
            <View style={styles.onlineDot} />
          </View>
          
          <Text style={styles.merchantName}>{merchantName}</Text>
          <Text style={styles.merchantId}>Merchant ID: <Text style={styles.merchantIdValue}>{merchantId}</Text></Text>
          
          <View style={styles.badgeRow}>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
            <View style={styles.corporateBadge}>
              <Text style={styles.corporateText}>Corporate</Text>
            </View>
          </View>
        </View>

        {/* Scrollable Menu */}
        <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
          {/* Main Navigation */}
          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('CorporateMerchantDashboard')}>
              <View style={styles.menuIconContainer}>
                <HomeIcon size={16} color="#293454" />
              </View>
              <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('RegisterShopMerchant')}>
              <View style={styles.menuIconContainer}>
                <StoreIcon size={16} color="#293454" />
              </View>
              <Text style={styles.menuItemText}>Register Sub Merchant</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('NotificationsScreen')}>
              <View style={styles.menuIconContainer}>
                <View>
                  <BellIcon size={16} color="#293454" />
                  <View style={styles.notificationDot} />
                </View>
              </View>
              <Text style={styles.menuItemText}>Notification</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('BankAccountScreen')}>
              <View style={styles.menuIconContainer}>
                <BankIcon size={16} color="#293454" />
              </View>
              <Text style={styles.menuItemText}>Bank Account</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('TopUpWallet')}>
              <View style={styles.menuIconContainer}>
                <WalletIcon size={16} color="#293454" />
              </View>
              <Text style={styles.menuItemText}>Top Up Wallet</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('CurrencyConverter')}>
              <View style={styles.menuIconContainer}>
                <ExchangeIcon size={16} color="#293454" />
              </View>
              <Text style={styles.menuItemText}>Currency Converter</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('KYCScreen')}>
              <View style={styles.menuIconContainer}>
                <IdCardIcon size={16} color="#293454" />
              </View>
              <Text style={styles.menuItemText}>KYC Registration</Text>
            </TouchableOpacity>
          </View>

          {/* Settings Section - Expandable */}
          <View style={styles.settingsSection}>
            <TouchableOpacity 
              style={styles.settingsHeader}
              onPress={() => setSettingsExpanded(!settingsExpanded)}
            >
              <View style={styles.settingsHeaderLeft}>
                <View style={styles.menuIconContainer}>
                  <SettingsIcon size={16} color="#293454" />
                </View>
                <Text style={styles.settingsHeaderText}>Settings</Text>
              </View>
              <View style={{ transform: [{ rotate: settingsExpanded ? '0deg' : '180deg' }] }}>
                <ChevronUpIcon size={12} color="#293454" />
              </View>
            </TouchableOpacity>

            {settingsExpanded && (
              <View style={styles.settingsCard}>
                <TouchableOpacity style={styles.settingsItem} onPress={() => handleNavigation('SettingsProfile')}>
                  <SettingsIcon size={14} color="#6B7280" />
                  <Text style={styles.settingsItemText}>Settings & Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem} onPress={() => handleNavigation('NotificationPrefs')}>
                  <BellIcon size={14} color="#6B7280" />
                  <Text style={styles.settingsItemText}>Notification Prefs</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem} onPress={() => handleNavigation('ChangePIN')}>
                  <KeyIcon size={14} color="#6B7280" />
                  <Text style={styles.settingsItemText}>Change Transaction PIN</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem} onPress={() => handleNavigation('ChangeMPIN')}>
                  <LockIcon size={14} color="#6B7280" />
                  <Text style={styles.settingsItemText}>Change MPIN</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem} onPress={() => handleNavigation('LanguageScreen')}>
                  <GlobeIcon size={14} color="#6B7280" />
                  <Text style={styles.settingsItemText}>Language</Text>
                  <Text style={styles.settingsValue}>EN</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsItem} onPress={() => handleNavigation('HelpCenter')}>
                  <HeadsetIcon size={14} color="#6B7280" />
                  <Text style={styles.settingsItemText}>24/7 Support</Text>
                </TouchableOpacity>

                <View style={[styles.settingsItem, styles.settingsItemLast]}>
                  <WifiIcon size={14} color="#6B7280" />
                  <Text style={styles.settingsItemText}>Enable NFC</Text>
                  <Switch
                    value={nfcEnabled}
                    onValueChange={setNfcEnabled}
                    trackColor={{ false: '#D1D5DB', true: '#293454' }}
                    thumbColor="#FFFFFF"
                    style={styles.switch}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Sign Out Button */}
          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <LogoutIcon size={16} color="#DC2626" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
            <Text style={styles.versionText}>App Version 2.4.0 (Build 102)</Text>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </Animated.View>

      {/* Close overlay area */}
      <TouchableOpacity 
        style={styles.closeArea} 
        onPress={onClose} 
        activeOpacity={1}
      />
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
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 32 : 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircle: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 64,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 0,
    width: 16,
    height: 16,
    backgroundColor: '#4ADE80',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#293454',
  },
  merchantName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  merchantId: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  merchantIdValue: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#86EFAC',
    textTransform: 'uppercase',
  },
  corporateBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  corporateText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#93C5FD',
    textTransform: 'uppercase',
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  menuSection: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  menuIconContainer: {
    width: 32,
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 2,
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 12,
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    paddingBottom: 8,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  settingsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#293454',
    marginLeft: 12,
  },
  settingsCard: {
    paddingLeft: 16,
    paddingRight: 8,
    marginTop: 4,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 44,
    paddingRight: 16,
  },
  settingsItemLast: {
    borderBottomWidth: 0,
  },
  settingsItemText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  settingsValue: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  switch: {
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
  },
  bottomActions: {
    padding: 16,
    marginTop: 8,
    marginBottom: 32,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
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
    marginTop: 16,
  },
  closeArea: {
    flex: 1,
    height: '100%',
  },
});

export default CorporateMerchantSidebar;
