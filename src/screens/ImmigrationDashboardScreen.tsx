/**
 * ✅ PATROL APP - IMMIGRATION DASHBOARD SCREEN
 * Immigration department dashboard with sidebar menu
 * MFA Code: 222222
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const MenuIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
  </Svg>
);

const CloseIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </Svg>
);

const PassportIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M6 2C4.89 2 4 2.89 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V4C20 2.89 19.11 2 18 2H6ZM12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6ZM12 14C14.67 14 17 15.34 17 17V18H7V17C7 15.34 9.33 14 12 14Z" />
  </Svg>
);

const UserShieldIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7ZM12 18C10 18 8.2 17 7.4 15.6C7.6 14.2 9.6 13 12 13S16.4 14.2 16.6 15.6C15.8 17 14 18 12 18Z" />
  </Svg>
);

const DashboardIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
  </Svg>
);

const RouteIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M9 3L5 6.99H8V14H10V6.99H13L9 3ZM16 17.01V10H14V17.01H11L15 21L19 17.01H16Z" />
  </Svg>
);

const UsersIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </Svg>
);

const BusIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" />
  </Svg>
);

const SettingsIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </Svg>
);

const HelpIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
  </Svg>
);

const LogoutIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </Svg>
);

const MapLocationIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </Svg>
);

const ClipboardListIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
  </Svg>
);

const HeadsetIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
  </Svg>
);

const FileContractIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
  </Svg>
);

const CalendarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
  </Svg>
);

const BoltIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z" />
  </Svg>
);

const ClockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </Svg>
);

const FingerprintIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12zM14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1-1.4-1.39-2.17-3.24-2.17-5.22 0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29-.49-1.31-.73-2.61-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38z" />
  </Svg>
);

const QRCodeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2zM17 17h2v2h-2zM15 19h2v2h-2zM19 19h2v2h-2z" />
  </Svg>
);

const UserIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </Svg>
);

// Quick Action Card Component
interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  isPrimary?: boolean;
  onPress?: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, title, subtitle, isPrimary, onPress }) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.8}>
    {isPrimary ? (
      <LinearGradient colors={['#2563EB', '#1D4ED8']} style={styles.quickActionGradient}>
        <View style={styles.quickActionIconCircle}>{icon}</View>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
      </LinearGradient>
    ) : (
      <LinearGradient colors={['#334155', '#1E293B']} style={[styles.quickActionGradient, styles.quickActionSecondary]}>
        <View style={styles.quickActionIconCircleSecondary}>{icon}</View>
        <Text style={styles.quickActionTitleSecondary}>{title}</Text>
        <Text style={styles.quickActionSubtitleSecondary}>{subtitle}</Text>
      </LinearGradient>
    )}
  </TouchableOpacity>
);

// Status Card Component
interface StatusCardProps {
  label: string;
  value: string;
  color: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ label, value, color }) => (
  <View style={styles.statusCard}>
    <View style={[styles.statusDot, { backgroundColor: color, shadowColor: color }]} />
    <Text style={styles.statusLabel}>{label}</Text>
    <Text style={styles.statusValue}>{value}</Text>
  </View>
);

// Sidebar Menu Item
interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  isActive?: boolean;
  isDanger?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onPress, isActive, isDanger }) => (
  <TouchableOpacity 
    style={[styles.menuItem, isActive && styles.menuItemActive]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuIconWrapper}>
      {icon}
    </View>
    <Text style={[
      styles.menuLabel, 
      isActive && styles.menuLabelActive,
      isDanger && styles.menuLabelDanger
    ]}>{label}</Text>
  </TouchableOpacity>
);

// Activity Item Component
interface ActivityItemProps {
  color: string;
  title: string;
  description: string;
  time: string;
  isFirst?: boolean;
  isLast?: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ color, title, description, time, isFirst, isLast }) => (
  <View style={[
    styles.activityItem,
    !isLast && styles.activityItemBorder
  ]}>
    {/* Timeline line */}
    {!isFirst && <View style={styles.timelineLineTop} />}
    {!isLast && <View style={styles.timelineLineBottom} />}
    
    {/* Dot */}
    <View style={[styles.activityDot, { backgroundColor: color, shadowColor: color }]} />
    
    {/* Content */}
    <View style={styles.activityContent}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activityDescription}>{description}</Text>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
  </View>
);

const ImmigrationDashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;
  const alertPulse = useRef(new Animated.Value(1)).current;
  const alertOpacity = useRef(new Animated.Value(0)).current;

  // Simulate emergency alert after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEmergencyAlert(true);
      Animated.timing(alertOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(alertPulse, { toValue: 1.05, duration: 500, useNativeDriver: true }),
          Animated.timing(alertPulse, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      );
      pulse.start();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleAcceptEmergency = () => {
    setShowEmergencyAlert(false);
    navigation.navigate('ImmigrationTaskDetails');
  };

  const handleDismissAlert = () => {
    Animated.timing(alertOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowEmergencyAlert(false));
  };

  const openSidebar = () => {
    setSidebarVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -width * 0.75,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setSidebarVisible(false));
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Sign Out',
          style: 'destructive',
          onPress: () => {
            closeSidebar();
            setTimeout(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }, 300);
          },
        },
      ]
    );
  };

  // Open fingerprint scanner app
  const openFingerprintApp = async () => {
    try {
      const url = 'intent://scan/#Intent;scheme=fingerprint;package=com.fingerprint.scanner;end';
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'Fingerprint App',
          'No fingerprint scanner app found. Would you like to search for one?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Search', 
              onPress: () => Linking.openURL('market://search?q=fingerprint%20scanner') 
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open fingerprint app. Please install a fingerprint scanner app.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient colors={['#0F172A', '#1E293B', '#0F172A']} style={StyleSheet.absoluteFill} />

      {/* Sidebar Overlay */}
      {sidebarVisible && (
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.sidebarGradient}>
          {/* Sidebar Header */}
          <View style={styles.sidebarHeader}>
            <View style={styles.sidebarProfile}>
              <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.avatarGradient}>
                <UserShieldIcon size={24} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.sidebarProfileInfo}>
                <Text style={styles.sidebarName}>Officer Martinez</Text>
                <Text style={styles.sidebarBadge}>ID: #882-TC</Text>
              </View>
            </View>
            <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
              <CloseIcon size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Menu Items - Operations */}
          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>OPERATIONS</Text>
            <MenuItem 
              icon={<DashboardIcon size={18} color="#3B82F6" />} 
              label="Dashboard" 
              isActive 
              onPress={closeSidebar}
            />
            <MenuItem 
              icon={<RouteIcon size={18} color="#94A3B8" />} 
              label="Active Routes" 
              onPress={() => { closeSidebar(); setTimeout(() => navigation.navigate('ImmigrationDispatcher'), 300); }}
            />
            <MenuItem 
              icon={<UsersIcon size={18} color="#94A3B8" />} 
              label="Detainee Manifest" 
              onPress={() => { closeSidebar(); setTimeout(() => navigation.navigate('ImmigrationCaseReport'), 300); }}
            />
            <MenuItem 
              icon={<BusIcon size={18} color="#94A3B8" />} 
              label="Vehicle Status" 
              onPress={() => { closeSidebar(); setTimeout(() => navigation.navigate('ImmigrationDispatcher'), 300); }}
            />
          </View>

          {/* Menu Items - System */}
          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>ACCOUNT</Text>
            <MenuItem 
              icon={<UserIcon size={18} color="#94A3B8" />} 
              label="Profile" 
              onPress={() => { closeSidebar(); setTimeout(() => navigation.navigate('OfficerProfile', { department: 'immigration' }), 300); }}
            />
            <MenuItem 
              icon={<QRCodeIcon size={18} color="#94A3B8" />} 
              label="QR Scanner" 
              onPress={() => { closeSidebar(); setTimeout(() => navigation.navigate('QRScanner', { department: 'immigration' }), 300); }}
            />
            <MenuItem 
              icon={<SettingsIcon size={18} color="#94A3B8" />} 
              label="Settings" 
              onPress={() => { closeSidebar(); setTimeout(() => navigation.navigate('Settings', { department: 'immigration' }), 300); }}
            />
            <MenuItem 
              icon={<HelpIcon size={18} color="#94A3B8" />} 
              label="Help & Support" 
            />
          </View>

          {/* Sign Out */}
          <View style={styles.menuFooter}>
            <MenuItem 
              icon={<LogoutIcon size={18} color="#EF4444" />} 
              label="Sign Out" 
              onPress={handleSignOut}
              isDanger
            />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={openSidebar} style={styles.menuButton}>
            <MenuIcon size={20} color="#CBD5E1" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.greeting}>Welcome Back,</Text>
            <Text style={styles.officerName}>Officer Martinez</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.onlineDotContainer}>
              <View style={styles.onlineDotPing} />
              <View style={styles.onlineDot} />
            </View>
            <Text style={styles.statusText}>ON DUTY</Text>
          </View>
        </View>

        {/* Department Badge */}
        <View style={styles.departmentBadge}>
          <LinearGradient 
            colors={['#1E40AF', '#2563EB']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 0 }}
            style={styles.departmentGradient}
          >
            {/* Decorative element */}
            <View style={styles.departmentDecor} />
            
            <View style={styles.departmentContent}>
              <View style={styles.departmentIconContainer}>
                <PassportIcon size={22} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.departmentTitle}>IMMIGRATION RESPONSE</Text>
                <Text style={styles.departmentSubtitle}>Transport Unit • Sector 4</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Status Cards */}
        <View style={styles.statusRow}>
          <StatusCard label="Active" value="04" color="#3B82F6" />
          <StatusCard label="Pending" value="12" color="#F59E0B" />
          <StatusCard label="Done" value="28" color="#10B981" />
        </View>

        {/* Fingerprint Scanner Button */}
        <TouchableOpacity style={styles.fingerprintButton} onPress={openFingerprintApp} activeOpacity={0.8}>
          <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.fingerprintGradient}>
            <FingerprintIcon size={24} color="#FFFFFF" />
            <Text style={styles.fingerprintText}>Open Fingerprint App</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <BoltIcon size={14} color="#F59E0B" />
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        
        <View style={styles.quickActionsGrid}>
          <QuickAction
            icon={<MapLocationIcon size={20} color="#FFFFFF" />}
            title="Route Map"
            subtitle="Nav to Site"
            isPrimary
            onPress={() => navigation.navigate('ImmigrationDispatcher')}
          />
          <QuickAction
            icon={<ClipboardListIcon size={20} color="#3B82F6" />}
            title="Manifest"
            subtitle="Detainee List"
            onPress={() => navigation.navigate('ImmigrationCaseReport')}
          />
          <QuickAction
            icon={<BusIcon size={20} color="#10B981" />}
            title="Vehicle"
            subtitle="Check Status"
            onPress={() => navigation.navigate('ImmigrationDispatcher')}
          />
          <QuickAction
            icon={<HeadsetIcon size={20} color="#F59E0B" />}
            title="Dispatch"
            subtitle="Contact HQ"
            onPress={() => navigation.navigate('ImmigrationTeamRadio')}
          />
          <QuickAction
            icon={<FileContractIcon size={20} color="#A855F7" />}
            title="Reports"
            subtitle="Log Incident"
            onPress={() => navigation.navigate('ImmigrationCaseReport')}
          />
          <QuickAction
            icon={<CalendarIcon size={20} color="#06B6D4" />}
            title="Schedule"
            subtitle="My Shifts"
            onPress={() => navigation.navigate('PermitVisaLookup')}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <ClockIcon size={14} color="#94A3B8" />
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>
        
        <View style={styles.activityCard}>
          <ActivityItem
            color="#10B981"
            title="Transport Completed"
            description="Facility B to Processing Center"
            time="15 mins ago"
            isFirst
          />
          <ActivityItem
            color="#3B82F6"
            title="Check-in: Zone 4"
            description="Routine vehicle inspection passed"
            time="45 mins ago"
          />
          <ActivityItem
            color="#F59E0B"
            title="New Dispatch Order"
            description="Pickup scheduled at Sector 7"
            time="2 hours ago"
            isLast
          />
        </View>

        {/* Footer Info */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>Sentinel Patrol v2.1.0</Text>
          <Text style={styles.footerSubtext}>Secure Connection • Last Sync: Just now</Text>
        </View>
      </ScrollView>

      {/* Emergency Alert Modal */}
      {showEmergencyAlert && (
        <Animated.View style={[styles.alertOverlay, { opacity: alertOpacity }]}>
          <Animated.View style={[styles.alertContainer, { transform: [{ scale: alertPulse }] }]}>
            <LinearGradient colors={['#5B21B6', '#4C1D95']} style={styles.alertGradient}>
              <View style={styles.alertHeader}>
                <View style={styles.alertIconPulse}>
                  <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                    <Path d="M6 2C4.89 2 4 2.89 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V4C20 2.89 19.11 2 18 2H6ZM12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6ZM12 14C14.67 14 17 15.34 17 17V18H7V17C7 15.34 9.33 14 12 14Z" stroke="#FFFFFF" strokeWidth={2} fill="#A78BFA" />
                  </Svg>
                </View>
                <Text style={styles.alertTitle}>🛂 IMMIGRATION ALERT</Text>
              </View>
              <View style={styles.alertBody}>
                <Text style={styles.alertCode}>CODE IMM-7</Text>
                <Text style={styles.alertType}>Document Fraud Detection</Text>
                <Text style={styles.alertLocation}>📍 Border Checkpoint Gate 7</Text>
                <Text style={styles.alertTime}>Received: Just now</Text>
                <View style={styles.alertPriority}>
                  <Text style={styles.alertPriorityText}>PRIORITY: HIGH</Text>
                </View>
              </View>
              <View style={styles.alertActions}>
                <TouchableOpacity style={styles.alertAcceptButton} onPress={handleAcceptEmergency}>
                  <LinearGradient colors={['#7C3AED', '#6D28D9']} style={styles.alertAcceptGradient}>
                    <Text style={styles.alertAcceptText}>Accept & Respond</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.alertDismissButton} onPress={handleDismissAlert}>
                  <Text style={styles.alertDismissText}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0F172A' 
  },
  
  // Sidebar styles
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 10,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75,
    maxWidth: 320,
    zIndex: 20,
  },
  sidebarGradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 24) + 20,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(71,85,105,0.3)',
  },
  sidebarProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sidebarProfileInfo: {
    gap: 2,
  },
  sidebarName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  sidebarBadge: {
    fontSize: 12,
    color: '#94A3B8',
  },
  closeButton: {
    padding: 8,
  },
  menuSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  menuSectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
    gap: 12,
  },
  menuItemActive: {
    backgroundColor: 'rgba(37,99,235,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.2)',
  },
  menuIconWrapper: {
    width: 20,
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#94A3B8',
  },
  menuLabelActive: {
    color: '#3B82F6',
  },
  menuLabelDanger: {
    color: '#EF4444',
  },
  menuFooter: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(71,85,105,0.3)',
    paddingTop: 24,
  },
  
  // Main content styles
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 24) + 16,
    paddingBottom: 96,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerCenter: {
    flex: 1,
    paddingHorizontal: 16,
  },
  greeting: { 
    fontSize: 12, 
    color: '#94A3B8',
    fontWeight: '500',
  },
  officerName: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#FFFFFF', 
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16,185,129,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
    gap: 8,
  },
  onlineDotContainer: {
    width: 10,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDotPing: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    opacity: 0.4,
  },
  onlineDot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: '#10B981',
  },
  statusText: { 
    fontSize: 10, 
    fontWeight: '700', 
    color: '#10B981', 
    letterSpacing: 0.5,
  },
  
  // Department Badge
  departmentBadge: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  departmentGradient: {
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  departmentDecor: {
    position: 'absolute',
    right: -32,
    top: 0,
    bottom: 0,
    width: 96,
    backgroundColor: 'rgba(255,255,255,0.05)',
    transform: [{ skewX: '-12deg' }],
  },
  departmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    zIndex: 1,
  },
  departmentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  departmentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  departmentSubtitle: {
    fontSize: 12,
    color: '#BFDBFE',
    opacity: 0.8,
    marginTop: 2,
  },
  
  // Fingerprint Button
  fingerprintButton: { 
    marginBottom: 20, 
    borderRadius: 12, 
    overflow: 'hidden' 
  },
  fingerprintGradient: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 14, 
    paddingHorizontal: 20 
  },
  fingerprintText: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#FFFFFF', 
    marginLeft: 12 
  },
  
  // Status Cards
  statusRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statusCard: {
    flex: 1,
    backgroundColor: 'rgba(30,41,59,0.6)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(71,85,105,0.5)',
  },
  statusDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    marginBottom: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  statusLabel: { 
    fontSize: 10, 
    color: '#94A3B8', 
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statusValue: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#FFFFFF',
  },
  
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  quickAction: {
    width: (width - 40 - 24) / 3, // Account for padding and gaps
    aspectRatio: 0.8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  quickActionSecondary: {
    borderWidth: 1,
    borderColor: '#475569',
    shadowColor: '#000',
    shadowOpacity: 0.2,
  },
  quickActionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionIconCircleSecondary: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(71,85,105,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionTitle: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#FFFFFF', 
    textAlign: 'center',
  },
  quickActionSubtitle: { 
    fontSize: 9, 
    color: 'rgba(219,234,254,0.7)', 
    textAlign: 'center',
  },
  quickActionTitleSecondary: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#E2E8F0', 
    textAlign: 'center',
  },
  quickActionSubtitleSecondary: { 
    fontSize: 9, 
    color: '#94A3B8', 
    textAlign: 'center',
  },
  
  // Activity Card
  activityCard: {
    backgroundColor: 'rgba(30,41,59,0.4)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(71,85,105,0.5)',
    marginBottom: 32,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingLeft: 8,
    position: 'relative',
  },
  activityItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(71,85,105,0.5)',
  },
  timelineLineTop: {
    position: 'absolute',
    left: 13,
    top: 0,
    bottom: '50%',
    width: 2,
    backgroundColor: '#334155',
  },
  timelineLineBottom: {
    position: 'absolute',
    left: 13,
    top: '50%',
    bottom: 0,
    width: 2,
    backgroundColor: '#334155',
  },
  activityDot: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    marginTop: 4,
    marginRight: 16,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1,
  },
  activityContent: { 
    flex: 1,
  },
  activityTitle: { 
    fontSize: 14, 
    fontWeight: '500', 
    color: '#E2E8F0',
  },
  activityDescription: { 
    fontSize: 12, 
    color: '#94A3B8', 
    marginTop: 2,
  },
  activityTime: { 
    fontSize: 10, 
    color: '#64748B', 
    marginTop: 4,
  },
  
  // Footer
  footerInfo: { 
    alignItems: 'center', 
    marginTop: 8,
  },
  footerText: { 
    fontSize: 10, 
    fontWeight: '500', 
    color: '#475569',
  },
  footerSubtext: { 
    fontSize: 10, 
    color: '#334155', 
    marginTop: 4,
  },
  
  // Emergency Alert Styles
  alertOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  alertContainer: {
    width: width * 0.85,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  alertGradient: {
    padding: 24,
  },
  alertHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  alertIconPulse: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(139,92,246,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  alertBody: {
    alignItems: 'center',
    marginBottom: 24,
  },
  alertCode: {
    fontSize: 28,
    fontWeight: '900',
    color: '#C4B5FD',
    letterSpacing: 2,
    marginBottom: 8,
  },
  alertType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  alertLocation: {
    fontSize: 14,
    color: '#C4B5FD',
    marginBottom: 8,
  },
  alertTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
  },
  alertPriority: {
    backgroundColor: 'rgba(245,158,11,0.4)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  alertPriorityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  alertActions: {
    gap: 12,
  },
  alertAcceptButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  alertAcceptGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  alertAcceptText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  alertDismissButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  alertDismissText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
});

export default ImmigrationDashboardScreen;
