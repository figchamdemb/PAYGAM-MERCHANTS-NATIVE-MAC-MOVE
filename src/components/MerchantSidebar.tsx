/**
 * PAYGAM MERCHANT - SIDEBAR COMPONENT
 * Reusable sidebar drawer for different merchant types
 * Types: general, corporate, fuel, government
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
  ScrollView,
  Image,
  Switch,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.85;

// ==================== SVG ICONS ====================
const HomeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </Svg>
);

const StoreIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
  </Svg>
);

const BellIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </Svg>
);

const BankIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M4 10h3v7H4zm6.5 0h3v7h-3zM2 19h20v3H2zm15-9h3v7h-3zm-5-9L2 6v2h20V6z" />
  </Svg>
);

const CurrencyIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12.89 11.1c-1.78-.59-2.64-.96-2.64-1.9 0-1.02 1.11-1.39 1.81-1.39 1.31 0 1.79.99 1.9 1.34l1.58-.67c-.15-.44-.82-1.91-2.66-2.23V5h-1.75v1.26c-2.6.56-2.62 2.85-2.62 2.96 0 2.27 2.25 2.91 3.35 3.31 1.58.56 2.28 1.07 2.28 2.03 0 1.13-1.05 1.61-1.98 1.61-1.82 0-2.34-1.87-2.4-2.09l-1.66.67c.63 2.19 2.28 2.78 3.02 2.96V19h1.75v-1.24c.52-.09 3.02-.59 3.02-3.22.01-1.39-.6-2.61-3-3.44z" />
  </Svg>
);

const IdCardIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 12H5v-2h6v2zm0-4H5v-2h6v2zm8 4h-6v-6h6v6z" />
  </Svg>
);

const GearIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </Svg>
);

const ChevronDownIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
  </Svg>
);

const ChevronUpIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
  </Svg>
);

const ChevronRightIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#D1D5DB' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </Svg>
);

const QRCodeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 11h2v2H3v-2zm8-6h2v4h-2V5zm-2 6h4v4h-2v-2H9v-2zm6 0h2v2h2v-2h2v2h-2v2h2v4h-2v2h-2v-2h-4v2h-2v-4h4v-2h2v-2h-2v-2zm4 8v-4h-2v4h2zm-4 0h-2v2h2v-2zM3 3v6h6V3H3zm4 4H5V5h2v2zm-4 8v6h6v-6H3zm4 4H5v-2h2v2zM15 3v6h6V3h-6zm4 4h-2V5h2v2z" />
  </Svg>
);

const UserPlusIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </Svg>
);

const ListIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
  </Svg>
);

const AddCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
  </Svg>
);

const UsersIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </Svg>
);

const ReceiptIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z" />
  </Svg>
);

const TicketIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#93C5FD' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-2-1.46c-1.19.69-2 1.99-2 3.46s.81 2.77 2 3.46V18H4v-2.54c1.19-.69 2-1.99 2-3.46 0-1.48-.8-2.77-1.99-3.46L4 6h16v2.54z" />
  </Svg>
);

const GasPumpIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#93C5FD' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
  </Svg>
);

const WifiIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
  </Svg>
);

const KeyIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
  </Svg>
);

const LockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
  </Svg>
);

const GlobeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </Svg>
);

const HeadsetIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
  </Svg>
);

const EditIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </Svg>
);

const LogoutIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </Svg>
);

const CloseIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </Svg>
);

const CheckCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#4ADE80' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </Svg>
);

// ==================== TYPES ====================
export type MerchantType = 'general' | 'corporate' | 'fuel' | 'government';

interface MerchantSidebarProps {
  visible: boolean;
  onClose: () => void;
  merchantType?: MerchantType;
  merchantName?: string;
  merchantId?: string;
  profileImage?: string;
}

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  screen?: string;
  badge?: number | string;
  badgeColor?: string;
  hasCheck?: boolean;
}

// ==================== MAIN COMPONENT ====================
const MerchantSidebar: React.FC<MerchantSidebarProps> = ({
  visible,
  onClose,
  merchantType = 'general',
  merchantName = 'Nexus Merchant',
  merchantId = 'NX-8829-MER',
  profileImage = 'https://i.pravatar.cc/150?img=11',
}) => {
  const navigation = useNavigation<any>();
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const [settingsExpanded, setSettingsExpanded] = useState(true);
  const [nfcEnabled, setNfcEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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

  const handleNavigation = (screen?: string) => {
    if (screen) {
      onClose();
      setTimeout(() => {
        navigation.navigate(screen);
      }, 300);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            onClose();
            setTimeout(() => {
              navigation.replace('Login');
            }, 300);
          },
        },
      ]
    );
  };

  // Menu items based on merchant type
  const getMainMenuItems = (): MenuItem[] => {
    const commonItems: MenuItem[] = [
      { id: 'home', icon: <HomeIcon size={18} color="#293454" />, label: 'Home', screen: 'Dashboard' },
    ];

    const typeSpecificItems: Record<MerchantType, MenuItem[]> = {
      general: [
        { id: 'qrcode', icon: <QRCodeIcon size={18} color="#293454" />, label: 'My QR Code', screen: 'ReceivePayment' },
        { id: 'kyc', icon: <IdCardIcon size={18} color="#293454" />, label: 'My KYC', badge: 'Approved', badgeColor: '#DCFCE7' },
        { id: 'store', icon: <StoreIcon size={18} color="#293454" />, label: 'My Store', screen: 'MyStore' },
        { id: 'register', icon: <UserPlusIcon size={18} color="#293454" />, label: 'Register Sub Merchant', screen: 'RegisterMerchant' },
        { id: 'services', icon: <ListIcon size={18} color="#293454" />, label: 'Service List', screen: 'ServiceList' },
        { id: 'create', icon: <AddCircleIcon size={18} color="#293454" />, label: 'Create Service', screen: 'CreateService' },
        { id: 'subscribers', icon: <UsersIcon size={18} color="#293454" />, label: 'Subscribers Request', screen: 'Subscribers', badge: 3, badgeColor: '#EF4444' },
        { id: 'history', icon: <ReceiptIcon size={18} color="#293454" />, label: 'Submission History', screen: 'TransactionHistory' },
        { id: 'bank', icon: <BankIcon size={18} color="#293454" />, label: 'Bank Account', screen: 'BankAccount' },
        { id: 'converter', icon: <CurrencyIcon size={18} color="#293454" />, label: 'Currency Converter', screen: 'CurrencyConverter' },
      ],
      corporate: [
        { id: 'register', icon: <StoreIcon size={18} color="#293454" />, label: 'Register Sub Merchant', screen: 'RegisterMerchant' },
        { id: 'notification', icon: <BellIcon size={18} color="#293454" />, label: 'Notification', screen: 'Notifications', badge: 3, badgeColor: '#EF4444' },
        { id: 'bank', icon: <BankIcon size={18} color="#293454" />, label: 'Bank Account', screen: 'BankAccount' },
        { id: 'converter', icon: <CurrencyIcon size={18} color="#293454" />, label: 'Currency Converter', screen: 'CurrencyConverter' },
        { id: 'kyc', icon: <IdCardIcon size={18} color="#293454" />, label: 'KYC Registration', screen: 'KYCRegistration' },
      ],
      fuel: [
        { id: 'soap', icon: <GasPumpIcon size={18} color="#93C5FD" />, label: 'Soap Merchant', screen: 'SoapMerchant' },
        { id: 'register', icon: <StoreIcon size={18} color="#93C5FD" />, label: 'Register Sub Merchant', screen: 'RegisterMerchant' },
        { id: 'notification', icon: <BellIcon size={18} color="#93C5FD" />, label: 'Notification', screen: 'Notifications', badge: 3, badgeColor: '#EF4444' },
        { id: 'coupon', icon: <TicketIcon size={18} color="#93C5FD" />, label: 'Priceless Coupon', screen: 'PricelessCoupon' },
        { id: 'transactions', icon: <ListIcon size={18} color="#93C5FD" />, label: 'Transaction List', screen: 'TransactionHistory' },
        { id: 'bank', icon: <BankIcon size={18} color="#93C5FD" />, label: 'Bank Account', screen: 'BankAccount' },
        { id: 'converter', icon: <CurrencyIcon size={18} color="#93C5FD" />, label: 'Currency Converter', screen: 'CurrencyConverter' },
        { id: 'kyc', icon: <IdCardIcon size={18} color="#93C5FD" />, label: 'KYC Registration', screen: 'KYCRegistration', hasCheck: true },
      ],
      government: [
        { id: 'register', icon: <StoreIcon size={18} color="#293454" />, label: 'Register Sub Merchant', screen: 'RegisterMerchant' },
        { id: 'notification', icon: <BellIcon size={18} color="#293454" />, label: 'Notification', screen: 'Notifications' },
        { id: 'bank', icon: <BankIcon size={18} color="#293454" />, label: 'Bank Account', screen: 'BankAccount' },
        { id: 'converter', icon: <CurrencyIcon size={18} color="#293454" />, label: 'Currency Converter', screen: 'CurrencyConverter' },
        { id: 'kyc', icon: <IdCardIcon size={18} color="#293454" />, label: 'KYC Registration', screen: 'KYCRegistration' },
      ],
    };

    return [...commonItems, ...typeSpecificItems[merchantType]];
  };

  const getMerchantBadges = () => {
    const badges: { label: string; color: string; bgColor: string }[] = [
      { label: 'Verified', color: '#4ADE80', bgColor: 'rgba(74, 222, 128, 0.2)' },
    ];

    if (merchantType === 'corporate') {
      badges.push({ label: 'Corporate', color: '#60A5FA', bgColor: 'rgba(96, 165, 250, 0.2)' });
    } else if (merchantType === 'fuel') {
      badges.push({ label: 'Fuel', color: '#F97316', bgColor: 'rgba(249, 115, 22, 0.2)' });
    } else if (merchantType === 'government') {
      badges.push({ label: 'Government', color: '#A855F7', bgColor: 'rgba(168, 85, 247, 0.2)' });
    }

    return badges;
  };

  const isFuelType = merchantType === 'fuel';
  const headerBgColor = isFuelType ? '#1f2842' : '#293454';
  const sidebarBgColor = isFuelType ? '#293454' : '#FFFFFF';
  const textColor = isFuelType ? '#FFFFFF' : '#374151';
  const subtextColor = isFuelType ? '#9CA3AF' : '#6B7280';
  const menuBgColor = isFuelType ? 'rgba(255,255,255,0.05)' : '#F9FAFB';

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.backdropTouchable} onPress={onClose} activeOpacity={1}>
            {/* Close button */}
            <View style={styles.closeButtonContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <CloseIcon size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Sidebar */}
        <Animated.View
          style={[
            styles.sidebar,
            { backgroundColor: sidebarBgColor, transform: [{ translateX: slideAnim }] },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { backgroundColor: headerBgColor }]}>
            <View style={styles.profileRow}>
              <View style={styles.profileImageContainer}>
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
                <View style={styles.onlineIndicator} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.merchantName}>{merchantName}</Text>
                <Text style={styles.merchantIdText}>Merchant ID: {merchantId}</Text>
                {merchantType !== 'fuel' && (
                  <TouchableOpacity style={styles.myAccountLink}>
                    <Text style={styles.myAccountText}>My Account</Text>
                    <ChevronRightIcon size={12} color="#93C5FD" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            {/* Badges */}
            <View style={styles.badgesRow}>
              {getMerchantBadges().map((badge, index) => (
                <View key={index} style={[styles.badge, { backgroundColor: badge.bgColor, borderColor: badge.color }]}>
                  {badge.label === 'Verified' && <CheckCircleIcon size={10} color={badge.color} />}
                  <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Menu Content */}
          <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
            {/* Main Navigation */}
            <View style={styles.menuSection}>
              {merchantType === 'general' && (
                <Text style={[styles.sectionLabel, { color: subtextColor }]}>ESSENTIALS</Text>
              )}
              {getMainMenuItems().map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, { backgroundColor: 'transparent' }]}
                  onPress={() => handleNavigation(item.screen)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIconContainer, { backgroundColor: isFuelType ? 'transparent' : 'rgba(41, 52, 84, 0.1)' }]}>
                    {item.icon}
                  </View>
                  <Text style={[styles.menuLabel, { color: textColor }]}>{item.label}</Text>
                  {item.badge && typeof item.badge === 'number' && (
                    <View style={[styles.notificationBadge, { backgroundColor: item.badgeColor }]}>
                      <Text style={styles.notificationBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                  {item.badge && typeof item.badge === 'string' && (
                    <View style={[styles.statusBadge, { backgroundColor: item.badgeColor }]}>
                      <Text style={styles.statusBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                  {item.hasCheck && <CheckCircleIcon size={14} color="#4ADE80" />}
                  {!item.badge && !item.hasCheck && <ChevronRightIcon size={14} color={isFuelType ? '#6B7280' : '#D1D5DB'} />}
                </TouchableOpacity>
              ))}
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: isFuelType ? 'rgba(255,255,255,0.1)' : '#F3F4F6' }]} />

            {/* Settings Section */}
            <View style={styles.menuSection}>
              <TouchableOpacity
                style={styles.settingsHeader}
                onPress={() => setSettingsExpanded(!settingsExpanded)}
                activeOpacity={0.7}
              >
                <View style={styles.settingsHeaderLeft}>
                  <View style={[styles.menuIconContainer, { backgroundColor: isFuelType ? 'transparent' : 'rgba(41, 52, 84, 0.1)' }]}>
                    <GearIcon size={18} color={isFuelType ? '#93C5FD' : '#293454'} />
                  </View>
                  <Text style={[styles.menuLabel, styles.settingsLabel, { color: textColor }]}>Settings</Text>
                </View>
                {settingsExpanded ? (
                  <ChevronUpIcon size={14} color={isFuelType ? '#FFFFFF' : '#293454'} />
                ) : (
                  <ChevronDownIcon size={14} color={isFuelType ? '#FFFFFF' : '#293454'} />
                )}
              </TouchableOpacity>

              {settingsExpanded && (
                <View style={[styles.settingsContent, { backgroundColor: menuBgColor }]}>
                  {/* Notifications Toggle */}
                  <View style={[styles.settingsItem, styles.settingsItemBorder, { borderColor: isFuelType ? 'rgba(255,255,255,0.05)' : '#F3F4F6' }]}>
                    <View style={styles.settingsItemLeft}>
                      <BellIcon size={14} color={subtextColor} />
                      <Text style={[styles.settingsItemLabel, { color: textColor }]}>
                        {isFuelType ? 'Enable Notifications' : 'Notifications'}
                      </Text>
                    </View>
                    <Switch
                      value={notificationsEnabled}
                      onValueChange={setNotificationsEnabled}
                      trackColor={{ false: '#E5E7EB', true: isFuelType ? '#4ADE80' : '#293454' }}
                      thumbColor="#FFFFFF"
                      style={styles.switch}
                    />
                  </View>

                  {/* Transaction PIN */}
                  <TouchableOpacity
                    style={[styles.settingsItem, styles.settingsItemBorder, { borderColor: isFuelType ? 'rgba(255,255,255,0.05)' : '#F3F4F6' }]}
                    onPress={() => handleNavigation('TransactionPIN')}
                  >
                    <View style={styles.settingsItemLeft}>
                      <KeyIcon size={14} color={subtextColor} />
                      <Text style={[styles.settingsItemLabel, { color: textColor }]}>
                        {isFuelType ? 'Transaction PIN' : 'Change Transaction PIN'}
                      </Text>
                    </View>
                    <ChevronRightIcon size={14} color={subtextColor} />
                  </TouchableOpacity>

                  {/* Change MPIN (non-fuel only) */}
                  {!isFuelType && (
                    <TouchableOpacity
                      style={[styles.settingsItem, styles.settingsItemBorder, { borderColor: '#F3F4F6' }]}
                      onPress={() => handleNavigation('ChangeMPIN')}
                    >
                      <View style={styles.settingsItemLeft}>
                        <LockIcon size={14} color={subtextColor} />
                        <Text style={[styles.settingsItemLabel, { color: textColor }]}>Change MPIN</Text>
                      </View>
                      <ChevronRightIcon size={14} color={subtextColor} />
                    </TouchableOpacity>
                  )}

                  {/* Language */}
                  <TouchableOpacity
                    style={[styles.settingsItem, styles.settingsItemBorder, { borderColor: isFuelType ? 'rgba(255,255,255,0.05)' : '#F3F4F6' }]}
                    onPress={() => handleNavigation('Language')}
                  >
                    <View style={styles.settingsItemLeft}>
                      <GlobeIcon size={14} color={subtextColor} />
                      <Text style={[styles.settingsItemLabel, { color: textColor }]}>
                        {isFuelType ? 'Language' : 'Select Language'}
                      </Text>
                    </View>
                    <View style={styles.settingsItemRight}>
                      <Text style={[styles.languageValue, { color: subtextColor }]}>English</Text>
                      {!isFuelType && <ChevronRightIcon size={14} color={subtextColor} />}
                    </View>
                  </TouchableOpacity>

                  {/* 24/7 Helpline (non-fuel) or 24 Hours Format (fuel) */}
                  {isFuelType ? (
                    <View style={[styles.settingsItem, styles.settingsItemBorder, { borderColor: 'rgba(255,255,255,0.05)' }]}>
                      <View style={styles.settingsItemLeft}>
                        <HeadsetIcon size={14} color={subtextColor} />
                        <Text style={[styles.settingsItemLabel, { color: textColor }]}>24 Hours Format</Text>
                      </View>
                      <Switch
                        value={false}
                        onValueChange={() => {}}
                        trackColor={{ false: '#6B7280', true: '#4ADE80' }}
                        thumbColor="#FFFFFF"
                        style={styles.switch}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[styles.settingsItem, styles.settingsItemBorder, { borderColor: '#F3F4F6' }]}
                      onPress={() => handleNavigation('Helpline')}
                    >
                      <View style={styles.settingsItemLeft}>
                        <HeadsetIcon size={14} color={subtextColor} />
                        <Text style={[styles.settingsItemLabel, { color: textColor }]}>24/7 Support</Text>
                      </View>
                      <ChevronRightIcon size={14} color={subtextColor} />
                    </TouchableOpacity>
                  )}

                  {/* NFC Toggle */}
                  <View style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                      <View style={{ transform: [{ rotate: '90deg' }] }}>
                        <WifiIcon size={14} color={subtextColor} />
                      </View>
                      <Text style={[styles.settingsItemLabel, { color: textColor }]}>
                        {isFuelType ? 'NFC Payment' : 'Enable NFC'}
                      </Text>
                    </View>
                    <Switch
                      value={nfcEnabled}
                      onValueChange={setNfcEnabled}
                      trackColor={{ false: '#E5E7EB', true: isFuelType ? '#4ADE80' : '#293454' }}
                      thumbColor="#FFFFFF"
                      style={styles.switch}
                    />
                  </View>
                </View>
              )}
            </View>

            <View style={{ height: 24 }} />
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { backgroundColor: isFuelType ? '#1f2842' : '#FFFFFF', borderTopColor: isFuelType ? 'rgba(255,255,255,0.1)' : '#F3F4F6' }]}>
            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: isFuelType ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2' }]}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <LogoutIcon size={18} color="#EF4444" />
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
            <Text style={[styles.versionText, { color: subtextColor }]}>App Version 2.4.0 (Build 202)</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  backdropTouchable: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 24) + 16,
    paddingRight: 16,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 24) + 16,
    right: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 24) + 16,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4ADE80',
    borderWidth: 2,
    borderColor: '#293454',
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
  merchantIdText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  myAccountLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  myAccountText: {
    fontSize: 12,
    color: '#93C5FD',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  menuContainer: {
    flex: 1,
  },
  menuSection: {
    paddingVertical: 8,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: 20,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 16,
  },
  notificationBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsLabel: {
    fontWeight: '700',
  },
  settingsContent: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingsItemBorder: {
    borderBottomWidth: 1,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsItemLabel: {
    fontSize: 14,
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageValue: {
    fontSize: 12,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  versionText: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default MerchantSidebar;
