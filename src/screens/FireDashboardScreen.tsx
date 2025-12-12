/**
 * ✅ PATROL APP - FIRE RESCUE DASHBOARD SCREEN
 * Fire department dashboard with sidebar menu
 * MFA Code: 111111
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';

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

const FireIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
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

const TruckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
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

const SettingsIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </Svg>
);

const HydrantIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19 11h-1V8h2V6h-2.35c-.82-2.33-3.04-4-5.65-4S7.17 3.67 6.35 6H4v2h2v3H5c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v3H4v2h16v-2h-2v-3h1c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2zm-9 8H8v-3h2v3zm2 0v-3h2v3h-2z" />
  </Svg>
);

const LadderIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 5v14h3v-6h4v6h3V5h-3v6H6V5zm12 0v2h6V5zM15 9v2h6V9zm0 4v2h6v-2zm0 4v2h6v-2z" />
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

const FireDashboardScreen: React.FC = () => {
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
    navigation.navigate('FireTaskDetails');
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
    closeSidebar();
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }, 300);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient colors={['#0F172A', '#1E293B', '#0F172A']} style={StyleSheet.absoluteFill} />

      {/* Sidebar Overlay */}
      {sidebarVisible && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeSidebar} />
      )}

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.sidebarGradient}>
          <View style={styles.sidebarHeader}>
            <View style={styles.sidebarProfile}>
              <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.avatarGradient}>
                <FireIcon size={28} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.sidebarProfileInfo}>
                <Text style={styles.sidebarName}>Captain Rodriguez</Text>
                <Text style={styles.sidebarBadge}>Unit #FD-201</Text>
              </View>
            </View>
            <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
              <CloseIcon size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>NAVIGATION</Text>
            <MenuItem icon={<FireIcon size={20} color="#EF4444" />} label="Dashboard" isActive />
            <MenuItem icon={<MapIcon size={20} color="#94A3B8" />} label="Fire Map" />
            <MenuItem icon={<AlertIcon size={20} color="#94A3B8" />} label="Active Calls" />
            <MenuItem icon={<FileIcon size={20} color="#94A3B8" />} label="Incident Reports" />
          </View>

          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>ACCOUNT</Text>
            <MenuItem icon={<UserIcon size={20} color="#94A3B8" />} label="Profile" />
            <MenuItem icon={<SettingsIcon size={20} color="#94A3B8" />} label="Settings" />
          </View>

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
        <View style={styles.header}>
          <TouchableOpacity onPress={openSidebar} style={styles.menuButton}>
            <MenuIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.greeting}>Welcome Back,</Text>
            <Text style={styles.officerName}>Captain Rodriguez</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={[styles.statusBadge, { backgroundColor: 'rgba(239,68,68,0.2)', borderColor: 'rgba(239,68,68,0.3)' }]}>
              <View style={[styles.onlineDot, { backgroundColor: '#EF4444' }]} />
              <Text style={[styles.statusText, { color: '#EF4444' }]}>ON CALL</Text>
            </View>
          </View>
        </View>

        {/* Department Badge */}
        <View style={styles.departmentBadge}>
          <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.departmentGradient}>
            <FireIcon size={24} color="#FFFFFF" />
            <Text style={styles.departmentText}>FIRE RESCUE UNIT</Text>
          </LinearGradient>
        </View>

        {/* Status Cards */}
        <View style={styles.statusRow}>
          <StatusCard label="Active Fires" value="2" color="#EF4444" />
          <StatusCard label="En Route" value="3" color="#F59E0B" />
          <StatusCard label="Resolved" value="8" color="#10B981" />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickAction
            icon={<MapIcon size={28} color="#FFFFFF" />}
            title="Fire Map"
            subtitle="Active locations"
            color="#EF4444"
          />
          <QuickAction
            icon={<AlertIcon size={28} color="#FFFFFF" />}
            title="Dispatch"
            subtitle="Emergency calls"
            color="#F59E0B"
          />
          <QuickAction
            icon={<TruckIcon size={28} color="#FFFFFF" />}
            title="Units"
            subtitle="Fleet status"
            color="#8B5CF6"
          />
          <QuickAction
            icon={<RadioIcon size={28} color="#FFFFFF" />}
            title="Radio"
            subtitle="Communications"
            color="#10B981"
          />
          <QuickAction
            icon={<HydrantIcon size={28} color="#FFFFFF" />}
            title="Hydrants"
            subtitle="Water sources"
            color="#3B82F6"
          />
          <QuickAction
            icon={<FileIcon size={28} color="#FFFFFF" />}
            title="Reports"
            subtitle="File reports"
            color="#6366F1"
          />
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: '#EF4444' }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Structure Fire - Zone 3</Text>
              <Text style={styles.activityTime}>Active - 15 minutes ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: '#10B981' }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Rescue Completed - Highway 12</Text>
              <Text style={styles.activityTime}>45 minutes ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: '#F59E0B' }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Vehicle Fire Responded</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
        </View>

        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>Sentinel Patrol v1.0.2</Text>
          <Text style={styles.footerSubtext}>Last sync: Just now</Text>
        </View>
      </ScrollView>

      {/* Emergency Alert Modal */}
      {showEmergencyAlert && (
        <Animated.View style={[styles.alertOverlay, { opacity: alertOpacity }]}>
          <Animated.View style={[styles.alertContainer, { transform: [{ scale: alertPulse }] }]}>
            <LinearGradient colors={['#991B1B', '#7F1D1D']} style={styles.alertGradient}>
              <View style={styles.alertHeader}>
                <View style={styles.alertIconPulse}>
                  <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                    <Path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
                  </Svg>
                </View>
                <Text style={styles.alertTitle}>🔥 EMERGENCY DISPATCH</Text>
              </View>
              <View style={styles.alertBody}>
                <Text style={styles.alertCode}>CODE 10-70</Text>
                <Text style={styles.alertType}>Structure Fire - Industrial</Text>
                <Text style={styles.alertLocation}>📍 Industrial Park, Sector 2</Text>
                <Text style={styles.alertTime}>Received: Just now</Text>
                <View style={styles.alertPriority}>
                  <Text style={styles.alertPriorityText}>PRIORITY: CRITICAL</Text>
                </View>
              </View>
              <View style={styles.alertActions}>
                <TouchableOpacity style={styles.alertAcceptButton} onPress={handleAcceptEmergency}>
                  <LinearGradient colors={['#DC2626', '#B91C1C']} style={styles.alertAcceptGradient}>
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
  container: { flex: 1, backgroundColor: '#0F172A' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10 },
  sidebar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: width * 0.75, zIndex: 20 },
  sidebarGradient: { flex: 1, paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 24) + 20 },
  sidebarHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(71,85,105,0.3)' },
  sidebarProfile: { flexDirection: 'row', alignItems: 'center' },
  avatarGradient: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  sidebarProfileInfo: { marginLeft: 12 },
  sidebarName: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  sidebarBadge: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  closeButton: { padding: 8 },
  menuSection: { paddingHorizontal: 16, paddingTop: 24 },
  menuSectionTitle: { fontSize: 11, fontWeight: '600', color: '#64748B', letterSpacing: 1, marginBottom: 12, marginLeft: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, marginBottom: 4 },
  menuItemActive: { backgroundColor: 'rgba(239,68,68,0.15)' },
  menuIconContainer: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(148,163,184,0.1)', justifyContent: 'center', alignItems: 'center' },
  menuLabel: { fontSize: 14, fontWeight: '500', color: '#E2E8F0', marginLeft: 12 },
  menuFooter: { position: 'absolute', bottom: 40, left: 0, right: 0, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: 'rgba(71,85,105,0.3)', paddingTop: 16 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 24) + 20, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  menuButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(30,41,59,0.8)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(71,85,105,0.5)' },
  headerCenter: { flex: 1, marginLeft: 12 },
  greeting: { fontSize: 12, color: '#94A3B8' },
  officerName: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginTop: 2 },
  headerRight: {},
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16,185,129,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)' },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 8 },
  statusText: { fontSize: 10, fontWeight: '700', color: '#10B981', letterSpacing: 1 },
  departmentBadge: { marginBottom: 20, borderRadius: 12, overflow: 'hidden' },
  departmentGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 20 },
  departmentText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', letterSpacing: 1, marginLeft: 10 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  statusCard: { flex: 1, backgroundColor: 'rgba(30,41,59,0.6)', borderRadius: 12, padding: 16, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(71,85,105,0.5)' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 8 },
  statusLabel: { fontSize: 11, color: '#94A3B8', marginBottom: 4 },
  statusValue: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginBottom: 16, letterSpacing: 0.5 },
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 28 },
  quickAction: { width: '31%', marginBottom: 12, borderRadius: 16, overflow: 'hidden' },
  quickActionGradient: { padding: 16, alignItems: 'center', minHeight: 110 },
  quickActionIcon: { marginBottom: 10 },
  quickActionTitle: { fontSize: 13, fontWeight: '600', color: '#FFFFFF', textAlign: 'center' },
  quickActionSubtitle: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2, textAlign: 'center' },
  activityCard: { backgroundColor: 'rgba(30,41,59,0.6)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(71,85,105,0.5)', marginBottom: 24 },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(71,85,105,0.3)' },
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
    borderColor: '#EF4444',
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
    backgroundColor: 'rgba(239,68,68,0.3)',
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
    color: '#FCA5A5',
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
    color: '#FCA5A5',
    marginBottom: 8,
  },
  alertTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
  },
  alertPriority: {
    backgroundColor: 'rgba(239,68,68,0.4)',
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

export default FireDashboardScreen;
