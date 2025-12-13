/**
 * ✅ PATROL APP - POLICE DASHBOARD SCREEN
 * Police department dashboard with sidebar menu
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
  Modal,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';

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

const ShieldIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L4 5V11C4 16.25 7.4 21.14 12 22C16.6 21.14 20 16.25 20 11V5L12 2Z" fill={color} opacity={0.3} />
    <Path d="M12 2L4 5V11C4 16.25 7.4 21.14 12 22C16.6 21.14 20 16.25 20 11V5L12 2ZM12 20C8.5 19.22 6 14.94 6 11V6.4L12 4L18 6.4V11C18 14.94 15.5 19.22 12 20Z" fill={color} />
  </Svg>
);

const MapIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
  </Svg>
);

const AlertIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </Svg>
);

const CarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </Svg>
);

const RadioIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 6H8.3l8.26-3.34L15.88 1 3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-8 13c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
  </Svg>
);

const FileIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
  </Svg>
);

const UserIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </Svg>
);

const LogoutIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </Svg>
);

const PoliceIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
  </Svg>
);

const SettingsIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </Svg>
);

const HandcuffsIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </Svg>
);

const SearchIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
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

// Quick Action Card Component
interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  onPress?: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, title, subtitle, color, onPress }) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.8}>
    <LinearGradient colors={[color, color + 'CC']} style={styles.quickActionGradient}>
      <View style={styles.quickActionIcon}>{icon}</View>
      <Text style={styles.quickActionTitle}>{title}</Text>
      <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
    </LinearGradient>
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
    <View style={[styles.statusDot, { backgroundColor: color }]} />
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
    <View style={[styles.menuIconContainer, isDanger && { backgroundColor: 'rgba(239,68,68,0.2)' }]}>
      {icon}
    </View>
    <Text style={[styles.menuLabel, isDanger && { color: '#EF4444' }]}>{label}</Text>
  </TouchableOpacity>
);

const PoliceDashboardScreen: React.FC = () => {
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
      // Fade in animation
      Animated.timing(alertOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      // Pulse animation
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(alertPulse, {
            toValue: 1.05,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(alertPulse, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleAcceptEmergency = () => {
    setShowEmergencyAlert(false);
    navigation.navigate('PoliceTaskDetails');
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

  const openFingerprintApp = async () => {
    try {
      const url = 'intent://scan/#Intent;scheme=fingerprint;package=com.fingerprint.scanner;end';
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'Fingerprint App',
          'No fingerprint scanner app found. Would you like to search for one in the Play Store?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Search', onPress: () => Linking.openURL('market://search?q=fingerprint%20scanner') },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open fingerprint app. Please try again.');
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
                <PoliceIcon size={28} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.sidebarProfileInfo}>
                <Text style={styles.sidebarName}>Officer Johnson</Text>
                <Text style={styles.sidebarBadge}>Badge #12345</Text>
              </View>
            </View>
            <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
              <CloseIcon size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>NAVIGATION</Text>
            <MenuItem 
              icon={<ShieldIcon size={20} color="#3B82F6" />} 
              label="Dashboard" 
              isActive 
              onPress={closeSidebar}
            />
            <MenuItem 
              icon={<MapIcon size={20} color="#94A3B8" />} 
              label="Live Map" 
              onPress={() => { closeSidebar(); setTimeout(() => navigation.navigate('DispatcherMap'), 300); }}
            />
            <MenuItem 
              icon={<AlertIcon size={20} color="#94A3B8" />} 
              label="Dispatch" 
              onPress={() => { closeSidebar(); setTimeout(() => navigation.navigate('DispatcherMap'), 300); }}
            />
            <MenuItem 
              icon={<FileIcon size={20} color="#94A3B8" />} 
              label="Reports" 
              onPress={() => { closeSidebar(); setTimeout(() => navigation.navigate('IncidentReporting'), 300); }}
            />
            <MenuItem 
              icon={<CarIcon size={20} color="#94A3B8" />} 
              label="Traffic Ops" 
              onPress={() => { closeSidebar(); setTimeout(() => navigation.navigate('VehicleSearch'), 300); }}
            />
            <MenuItem 
              icon={<HandcuffsIcon size={20} color="#94A3B8" />} 
              label="Write Statement" 
              onPress={() => { closeSidebar(); setTimeout(() => navigation.navigate('WriteForCitizen'), 300); }}
            />
            <MenuItem 
              icon={<SearchIcon size={20} color="#94A3B8" />} 
              label="Search Cases" 
              onPress={() => { closeSidebar(); setTimeout(() => navigation.navigate('SearchCases'), 300); }}
            />
          </View>

          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>ACCOUNT</Text>
            <MenuItem 
              icon={<UserIcon size={20} color="#94A3B8" />} 
              label="Profile" 
              onPress={() => { closeSidebar(); setTimeout(() => navigation.navigate('OfficerProfile', { department: 'police' }), 300); }}
            />
            <MenuItem 
              icon={<QRCodeIcon size={20} color="#94A3B8" />} 
              label="QR Scanner" 
              onPress={() => { closeSidebar(); setTimeout(() => navigation.navigate('QRScanner', { department: 'police' }), 300); }}
            />
            <MenuItem 
              icon={<SettingsIcon size={20} color="#94A3B8" />} 
              label="Settings" 
              onPress={() => { closeSidebar(); setTimeout(() => navigation.navigate('Settings', { department: 'police' }), 300); }}
            />
          </View>

          {/* Sign Out */}
          <View style={styles.menuFooter}>
            <MenuItem 
              icon={<LogoutIcon size={20} color="#EF4444" />} 
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
            <MenuIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.greeting}>Welcome Back,</Text>
            <Text style={styles.officerName}>Officer Johnson</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.statusBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.statusText}>ON DUTY</Text>
            </View>
          </View>
        </View>

        {/* Department Badge */}
        <View style={styles.departmentBadge}>
          <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.departmentGradient}>
            <PoliceIcon size={24} color="#FFFFFF" />
            <Text style={styles.departmentText}>POLICE PATROL UNIT</Text>
          </LinearGradient>
        </View>

        {/* Status Cards */}
        <View style={styles.statusRow}>
          <StatusCard label="Active Calls" value="3" color="#EF4444" />
          <StatusCard label="Pending" value="7" color="#F59E0B" />
          <StatusCard label="Completed" value="12" color="#10B981" />
        </View>

        {/* Fingerprint Scanner Button */}
        <TouchableOpacity style={styles.fingerprintButton} onPress={openFingerprintApp} activeOpacity={0.8}>
          <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.fingerprintGradient}>
            <FingerprintIcon size={24} color="#FFFFFF" />
            <Text style={styles.fingerprintText}>Open Fingerprint App</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickAction
            icon={<MapIcon size={28} color="#FFFFFF" />}
            title="Live Map"
            subtitle="View patrol area"
            color="#3B82F6"
            onPress={() => navigation.navigate('DispatcherMap')}
          />
          <QuickAction
            icon={<AlertIcon size={28} color="#FFFFFF" />}
            title="Dispatch"
            subtitle="Active calls"
            color="#EF4444"
            onPress={() => navigation.navigate('DispatcherMap')}
          />
          <QuickAction
            icon={<CarIcon size={28} color="#FFFFFF" />}
            title="Traffic"
            subtitle="Issue tickets"
            color="#8B5CF6"
            onPress={() => navigation.navigate('VehicleSearch')}
          />
          <QuickAction
            icon={<RadioIcon size={28} color="#FFFFFF" />}
            title="Radio"
            subtitle="Communications"
            color="#10B981"
            onPress={() => navigation.navigate('TeamGridRadio')}
          />
          <QuickAction
            icon={<FileIcon size={28} color="#FFFFFF" />}
            title="Reports"
            subtitle="File reports"
            color="#F59E0B"
            onPress={() => navigation.navigate('IncidentReporting')}
          />
          <QuickAction
            icon={<UserIcon size={28} color="#FFFFFF" />}
            title="Statement"
            subtitle="Write for citizen"
            color="#6366F1"
            onPress={() => navigation.navigate('WriteForCitizen')}
          />
        </View>

        {/* Search Cases Section */}
        <Text style={styles.sectionTitle}>Case Management</Text>
        <TouchableOpacity 
          style={styles.searchCasesCard}
          onPress={() => navigation.navigate('SearchCases')}
          activeOpacity={0.8}
        >
          <LinearGradient colors={['#1E40AF', '#3B82F6']} style={styles.searchCasesGradient}>
            <View style={styles.searchCasesIcon}>
              <SearchIcon size={24} color="#FFFFFF" />
            </View>
            <View style={styles.searchCasesInfo}>
              <Text style={styles.searchCasesTitle}>Search Citizen Cases</Text>
              <Text style={styles.searchCasesSubtitle}>Look up cases by phone or case ID</Text>
            </View>
            <View style={styles.searchCasesArrow}>
              <Text style={{ color: '#FFFFFF', fontSize: 18 }}>→</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: '#10B981' }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Traffic Stop Completed</Text>
              <Text style={styles.activityTime}>10 minutes ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: '#3B82F6' }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Patrol Check-in: Zone 4</Text>
              <Text style={styles.activityTime}>25 minutes ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: '#F59E0B' }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Report Filed: Case #2847</Text>
              <Text style={styles.activityTime}>1 hour ago</Text>
            </View>
          </View>
        </View>

        {/* Footer Info */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>Sentinel Patrol v1.0.2</Text>
          <Text style={styles.footerSubtext}>Last sync: Just now</Text>
        </View>
      </ScrollView>

      {/* Emergency Alert Modal */}
      {showEmergencyAlert && (
        <Animated.View style={[styles.alertOverlay, { opacity: alertOpacity }]}>
          <Animated.View style={[styles.alertCard, { transform: [{ scale: alertPulse }] }]}>
            <View style={styles.alertHeader}>
              <View style={styles.alertPulseRing} />
              <View style={styles.alertIconContainer}>
                <AlertIcon size={32} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.alertTitle}>🚨 EMERGENCY ALERT</Text>
            <Text style={styles.alertSubtitle}>Armed Robbery in Progress</Text>
            <Text style={styles.alertLocation}>
              📍 Trafalgar Square, London WC2N 5DN
            </Text>
            <Text style={styles.alertUrgency}>URGENT - Respond Immediately</Text>
            <View style={styles.alertButtons}>
              <TouchableOpacity 
                style={styles.alertAcceptBtn}
                onPress={handleAcceptEmergency}
              >
                <Text style={styles.alertAcceptBtnText}>Accept & Respond</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.alertDismissBtn}
                onPress={handleDismissAlert}
              >
                <Text style={styles.alertDismissBtnText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  
  // Sidebar styles
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75,
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
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(71,85,105,0.3)',
  },
  sidebarProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarProfileInfo: {
    marginLeft: 12,
  },
  sidebarName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sidebarBadge: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  menuSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  menuSectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: 'rgba(59,130,246,0.15)',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(148,163,184,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E2E8F0',
    marginLeft: 12,
  },
  menuFooter: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(71,85,105,0.3)',
    paddingTop: 16,
  },
  
  // Main content styles
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 24) + 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(30,41,59,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(71,85,105,0.5)',
  },
  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },
  greeting: { fontSize: 12, color: '#94A3B8' },
  officerName: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginTop: 2 },
  headerRight: {},
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16,185,129,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
  },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 8 },
  statusText: { fontSize: 10, fontWeight: '700', color: '#10B981', letterSpacing: 1 },
  
  departmentBadge: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  departmentGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  departmentText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginLeft: 10,
  },
  
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  statusCard: {
    flex: 1,
    backgroundColor: 'rgba(30,41,59,0.6)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(71,85,105,0.5)',
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 8 },
  statusLabel: { fontSize: 11, color: '#94A3B8', marginBottom: 4 },
  statusValue: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  quickAction: {
    width: '31%',
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 110,
  },
  quickActionIcon: { marginBottom: 10 },
  quickActionTitle: { fontSize: 13, fontWeight: '600', color: '#FFFFFF', textAlign: 'center' },
  quickActionSubtitle: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2, textAlign: 'center' },
  activityCard: {
    backgroundColor: 'rgba(30,41,59,0.6)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(71,85,105,0.5)',
    marginBottom: 24,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(71,85,105,0.3)',
  },
  activityDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  activityContent: { flex: 1 },
  activityTitle: { fontSize: 14, fontWeight: '500', color: '#FFFFFF' },
  activityTime: { fontSize: 11, color: '#64748B', marginTop: 2 },
  footerInfo: { alignItems: 'center', marginTop: 8 },
  footerText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  footerSubtext: { fontSize: 10, color: '#475569', marginTop: 4 },
  
  // Emergency Alert Styles
  alertOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    padding: 20,
  },
  alertCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  alertHeader: {
    position: 'relative',
    marginBottom: 16,
  },
  alertPulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    top: -8,
    left: -8,
  },
  alertIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#EF4444',
    marginBottom: 8,
    textAlign: 'center',
  },
  alertSubtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  alertLocation: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 8,
    textAlign: 'center',
  },
  alertUrgency: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  alertButtons: {
    width: '100%',
    gap: 12,
  },
  alertAcceptBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  alertAcceptBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  alertDismissBtn: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
  },
  alertDismissBtnText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Search Cases Card Styles
  searchCasesCard: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  searchCasesGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  searchCasesIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchCasesInfo: {
    flex: 1,
    marginLeft: 16,
  },
  searchCasesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchCasesSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  searchCasesArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fingerprintButton: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fingerprintGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  fingerprintText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default PoliceDashboardScreen;
