/**
 * ✅ PATROL APP - DASHBOARD SCREEN
 * Main dashboard after successful login
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';

// ==================== SVG ICONS ====================
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

const DashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient colors={['#0F172A', '#1E293B', '#0F172A']} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
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

        {/* Status Cards */}
        <View style={styles.statusRow}>
          <StatusCard label="Active Calls" value="3" color="#EF4444" />
          <StatusCard label="Pending" value="7" color="#F59E0B" />
          <StatusCard label="Completed" value="12" color="#10B981" />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickAction
            icon={<MapIcon size={28} color="#FFFFFF" />}
            title="Live Map"
            subtitle="View patrol area"
            color="#3B82F6"
          />
          <QuickAction
            icon={<AlertIcon size={28} color="#FFFFFF" />}
            title="Dispatch"
            subtitle="Active calls"
            color="#EF4444"
          />
          <QuickAction
            icon={<CarIcon size={28} color="#FFFFFF" />}
            title="Traffic"
            subtitle="Issue tickets"
            color="#8B5CF6"
          />
          <QuickAction
            icon={<RadioIcon size={28} color="#FFFFFF" />}
            title="Radio"
            subtitle="Communications"
            color="#10B981"
          />
          <QuickAction
            icon={<FileIcon size={28} color="#FFFFFF" />}
            title="Reports"
            subtitle="File reports"
            color="#F59E0B"
          />
          <QuickAction
            icon={<UserIcon size={28} color="#FFFFFF" />}
            title="Profile"
            subtitle="Settings"
            color="#6366F1"
          />
        </View>

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
          <Text style={styles.footerText}>Sentinel Patrol v1.0.1</Text>
          <Text style={styles.footerSubtext}>Last sync: Just now</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 24) + 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {},
  greeting: { fontSize: 14, color: '#94A3B8' },
  officerName: { fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginTop: 4 },
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
  statusText: { fontSize: 11, fontWeight: '700', color: '#10B981', letterSpacing: 1 },
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
});

export default DashboardScreen;
