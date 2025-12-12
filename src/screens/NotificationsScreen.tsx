/**
 * NotificationsScreen - Notifications list with audio alerts
 * Shows all notifications with option to play audio alerts
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { StackNavigationProp } from '@react-navigation/stack';

// ============ SVG ICON COMPONENTS ============

const ArrowLeftIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12L12 19M5 12L12 5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BellIcon = ({ size = 24, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PlayIcon = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M8 5v14l11-7z" />
  </Svg>
);

const PauseIcon = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Rect x="6" y="4" width="4" height="16" rx="1" />
    <Rect x="14" y="4" width="4" height="16" rx="1" />
  </Svg>
);

const PoliceIcon = ({ size = 24, color = '#1E3A8A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
  </Svg>
);

const FireIcon = ({ size = 24, color = '#DC2626' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 12.9a2.1 2.1 0 100 4.2 2.1 2.1 0 000-4.2zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
  </Svg>
);

const AmbulanceIcon = ({ size = 24, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z" />
  </Svg>
);

const CheckIcon = ({ size = 24, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M9 12l2 2 4-4" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const AlertIcon = ({ size = 24, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2L2 22h20L12 2zM12 9v4M12 17h.01" />
  </Svg>
);

const PaymentIcon = ({ size = 24, color = '#0077B6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Rect x="1" y="4" width="22" height="16" rx="2" />
    <Path d="M1 10h22" stroke="#FFFFFF" strokeWidth={2} />
  </Svg>
);

const MeterIcon = ({ size = 24, color = '#059669' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const HomeIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </Svg>
);

const FineIcon = ({ size = 24, color = '#DC2626' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="16" rx="2" stroke={color} strokeWidth={2} />
    <Path d="M7 8h10M7 12h6M12 12v4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Circle cx="17" cy="15" r="2.5" fill={color} />
  </Svg>
);

// Dummy notification data
const DUMMY_NOTIFICATIONS = [
  {
    id: '1',
    type: 'fine',
    title: 'Traffic Fine - Pending Payment',
    message: 'You have a pending traffic fine of GMD 1,500 for speeding violation. Due date: Dec 15, 2024.',
    time: '1 hour ago',
    hasAudio: false,
    isRead: false,
    referenceNumber: 'TRF-20231210-001',
  },
  {
    id: '2',
    type: 'fine',
    title: 'Vehicle Fine Reminder',
    message: 'Final reminder: GMD 1,500 parking fine overdue. Pay now to avoid additional penalties.',
    time: '2 hours ago',
    hasAudio: false,
    isRead: false,
    referenceNumber: 'TRF-20231209-002',
  },
  {
    id: '3',
    type: 'police',
    title: 'Police Alert Dispatched',
    message: 'Your police emergency report has been received. Unit Alpha-7 is en route to your location.',
    time: '2 minutes ago',
    hasAudio: true,
    isRead: false,
    referenceNumber: 'POL-20231207-001',
  },
  {
    id: '4',
    type: 'fire',
    title: 'Fire Brigade Responding',
    message: 'Fire emergency acknowledged. Serekunda Fire Station is dispatching a team.',
    time: '15 minutes ago',
    hasAudio: true,
    isRead: false,
    referenceNumber: 'FIR-20231207-002',
  },
  {
    id: '5',
    type: 'ambulance',
    title: 'Ambulance Dispatched',
    message: 'Medical team from Royal Victoria Hospital is on the way. ETA: 8 minutes.',
    time: '1 hour ago',
    hasAudio: true,
    isRead: true,
    referenceNumber: 'AMB-20231207-003',
  },
  {
    id: '6',
    type: 'payment',
    title: 'Payment Successful',
    message: 'Your NAWEC bill payment of D 1,250.00 has been processed successfully.',
    time: '3 hours ago',
    hasAudio: false,
    isRead: true,
    referenceNumber: 'PAY-20231207-004',
  },
  {
    id: '7',
    type: 'meter',
    title: 'Meter Reading Submitted',
    message: 'Your electricity meter reading of 45,678 kWh has been recorded.',
    time: '5 hours ago',
    hasAudio: false,
    isRead: true,
    referenceNumber: 'MTR-20231207-005',
  },
  {
    id: '8',
    type: 'alert',
    title: 'Are You OK Check',
    message: 'You missed your scheduled check-in. Your emergency contacts have been notified.',
    time: 'Yesterday',
    hasAudio: true,
    isRead: true,
    referenceNumber: 'CHK-20231206-001',
  },
  {
    id: '9',
    type: 'success',
    title: 'Report Submitted',
    message: 'Your incident report has been submitted successfully and is being reviewed.',
    time: 'Yesterday',
    hasAudio: false,
    isRead: true,
    referenceNumber: 'RPT-20231206-002',
  },
  {
    id: '10',
    type: 'police',
    title: 'Case Update',
    message: 'Your case #POL-20231205-001 has been assigned to Officer Jallow.',
    time: '2 days ago',
    hasAudio: false,
    isRead: true,
    referenceNumber: 'POL-20231205-001',
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'police':
      return { Icon: PoliceIcon, color: '#1E3A8A', bgColor: '#EFF6FF' };
    case 'fire':
      return { Icon: FireIcon, color: '#DC2626', bgColor: '#FEF2F2' };
    case 'ambulance':
      return { Icon: AmbulanceIcon, color: '#EF4444', bgColor: '#FEF2F2' };
    case 'payment':
      return { Icon: PaymentIcon, color: '#0077B6', bgColor: '#E0F2FE' };
    case 'meter':
      return { Icon: MeterIcon, color: '#059669', bgColor: '#ECFDF5' };
    case 'alert':
      return { Icon: AlertIcon, color: '#F59E0B', bgColor: '#FFFBEB' };
    case 'success':
      return { Icon: CheckIcon, color: '#10B981', bgColor: '#ECFDF5' };
    case 'fine':
      return { Icon: FineIcon, color: '#DC2626', bgColor: '#FEF2F2' };
    default:
      return { Icon: BellIcon, color: '#6B7280', bgColor: '#F3F4F6' };
  }
};

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { theme } = useTheme();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainDrawer' }],
    });
  };

  const handlePlayAudio = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
      console.log('Stopping audio for:', id);
    } else {
      setPlayingId(id);
      console.log('Playing audio for:', id);
      setTimeout(() => {
        setPlayingId((currentId) => (currentId === id ? null : currentId));
      }, 3000);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const renderNotification = ({ item }: { item: typeof DUMMY_NOTIFICATIONS[0] }) => {
    const config = getNotificationIcon(item.type);
    const isPlaying = playingId === item.id;

    return (
      <TouchableOpacity
        style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
        onPress={() => markAsRead(item.id)}
        activeOpacity={0.7}
      >
        {!item.isRead && <View style={styles.unreadDot} />}
        <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
          <config.Icon size={22} color={config.color} />
        </View>
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={[styles.notificationTitle, !item.isRead && styles.unreadTitle]}>
              {item.title}
            </Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </View>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.referenceNumber}>Ref: {item.referenceNumber}</Text>
        </View>
        {item.hasAudio && (
          <TouchableOpacity
            style={[styles.audioButton, { backgroundColor: config.color }]}
            onPress={() => handlePlayAudio(item.id)}
          >
            {isPlaying ? <PauseIcon size={16} color="#FFFFFF" /> : <PlayIcon size={16} color="#FFFFFF" />}
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeftIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <TouchableOpacity style={styles.homeButton} onPress={handleHome}>
          <HomeIcon size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      {unreadCount > 0 && (
        <View style={[styles.unreadBadge, { backgroundColor: theme.colors.secondary }]}>
          <Text style={styles.unreadBadgeText}>
            {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
          </Text>
        </View>
      )}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <BellIcon size={60} color={theme.colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Notifications</Text>
            <Text style={[styles.emptyMessage, { color: theme.colors.textSecondary }]}>
              You're all caught up! New notifications will appear here.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E3A8A',
    paddingTop: 48,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  homeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadge: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FCD34D',
  },
  unreadBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  unreadCard: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    zIndex: 10,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    marginRight: 8,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: '700',
    color: '#111827',
  },
  notificationTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  notificationMessage: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 6,
  },
  referenceNumber: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  audioButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginTop: 16,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
});

export default NotificationsScreen;
