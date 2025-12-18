/**
 * PAYGAM MERCHANT - NOTIFICATIONS SCREEN
 * Shows notifications list or empty state when no notifications
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
  SafeAreaView,
  ScrollView,
  Animated,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const ChevronLeftIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#374151' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SettingsIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#374151' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke={color} strokeWidth={2} />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
  </Svg>
);

const BellIcon: React.FC<{ size?: number; color?: string }> = ({ size = 80, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ZzzIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 12H14L4 20H14" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const RefreshIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const HomeIcon: React.FC<{ size?: number; color?: string; filled?: boolean }> = ({ size = 24, color = '#9CA3AF', filled }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
    <Path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChartIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BellFilledIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill={color}>
    <Path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
  </Svg>
);

const UserIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Notification Type Icons
const PaymentIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </Svg>
);

const AlertIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
  </Svg>
);

const SecurityIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
  </Svg>
);

const PromoIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#8B5CF6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
  </Svg>
);

const TransferIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />
  </Svg>
);

const RefundRequestIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#F97316' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M1 4v6h6M23 20v-6h-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRightIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 5l7 7-7 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TrashIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ==================== TYPES ====================
type NotificationType = 'payment' | 'alert' | 'security' | 'promo' | 'transfer' | 'refund';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  amount?: string;
  transactionId?: string;
  customerName?: string;
}

// ==================== DUMMY DATA ====================
const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'refund',
    title: 'Refund Request',
    message: 'Sarah Williams requested a refund for Transaction #TRX-84523',
    time: 'Just now',
    isRead: false,
    amount: '$125.00',
    transactionId: 'TRX-84523',
    customerName: 'Sarah Williams',
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Received',
    message: 'You received a payment from John Doe for Invoice #1234',
    time: '2 min ago',
    isRead: false,
    amount: '+$250.00',
  },
  {
    id: '3',
    type: 'transfer',
    title: 'Transfer Complete',
    message: 'Your withdrawal of $500.00 to GTBank has been processed',
    time: '15 min ago',
    isRead: false,
    amount: '-$500.00',
  },
  {
    id: '4',
    type: 'refund',
    title: 'Refund Request',
    message: 'Michael Brown requested a partial refund for Order #ORD-9281',
    time: '30 min ago',
    isRead: false,
    amount: '$75.50',
    transactionId: 'TRX-92810',
    customerName: 'Michael Brown',
  },
  {
    id: '5',
    type: 'security',
    title: 'New Login Detected',
    message: 'A new device logged into your account from Banjul, Gambia',
    time: '1 hour ago',
    isRead: true,
  },
  {
    id: '6',
    type: 'promo',
    title: 'Special Offer! ',
    message: 'Get 50% off on transaction fees this weekend only',
    time: '3 hours ago',
    isRead: true,
  },
  {
    id: '7',
    type: 'payment',
    title: 'Payment Received',
    message: 'Sarah Williams paid for Order #5678',
    time: '5 hours ago',
    isRead: true,
    amount: '+$89.99',
  },
  {
    id: '8',
    type: 'alert',
    title: 'Low Balance Warning',
    message: 'Your wallet balance is below $100. Consider topping up.',
    time: 'Yesterday',
    isRead: true,
  },
  {
    id: '9',
    type: 'transfer',
    title: 'Standing Order Executed',
    message: 'Monthly payment of $150.00 sent to Emily Richardson',
    time: 'Yesterday',
    isRead: true,
    amount: '-$150.00',
  },
  {
    id: '10',
    type: 'security',
    title: 'Password Changed',
    message: 'Your account password was successfully updated',
    time: '2 days ago',
    isRead: true,
  },
];

// ==================== MAIN COMPONENT ====================
const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  // State - toggle this to see empty state
  const [notifications, setNotifications] = useState<Notification[]>(DUMMY_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  
  // Animations
  const pulseAnim1 = useRef(new Animated.Value(1)).current;
  const pulseAnim2 = useRef(new Animated.Value(0.6)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animations for Zzz icons
    const pulse1 = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim1, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim1, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    const pulse2 = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim2, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim2, {
          toValue: 0.6,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    pulse1.start();
    pulse2.start();

    return () => {
      pulse1.stop();
      pulse2.stop();
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );
    
    // Navigate based on type
    if (notification.type === 'refund' && notification.transactionId) {
      // Extract initials from customer name
      const initials = notification.customerName
        ? notification.customerName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
        : 'CU';
      
      // Parse amount (remove $ and convert to number)
      const amount = notification.amount 
        ? parseFloat(notification.amount.replace(/[^0-9.]/g, '')) 
        : 0;
      
      navigation.navigate('InitiateRefund', {
        transactionId: notification.transactionId,
        customerName: notification.customerName || 'Customer',
        customerInitials: initials,
        originalAmount: amount,
        currency: 'USD',
        date: 'Today',
        time: notification.time,
      });
    } else {
      console.log('Notification pressed:', notification.id);
    }
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'payment':
        return <PaymentIcon size={20} color="#22C55E" />;
      case 'alert':
        return <AlertIcon size={20} color="#F59E0B" />;
      case 'security':
        return <SecurityIcon size={20} color="#EF4444" />;
      case 'promo':
        return <PromoIcon size={20} color="#8B5CF6" />;
      case 'transfer':
        return <TransferIcon size={20} color="#3B82F6" />;
      case 'refund':
        return <RefundRequestIcon size={20} color="#F97316" />;
      default:
        return <BellFilledIcon size={20} color="#293454" />;
    }
  };

  const getIconBackground = (type: NotificationType) => {
    switch (type) {
      case 'payment':
        return 'rgba(34, 197, 94, 0.1)';
      case 'alert':
        return 'rgba(245, 158, 11, 0.1)';
      case 'security':
        return 'rgba(239, 68, 68, 0.1)';
      case 'promo':
        return 'rgba(139, 92, 246, 0.1)';
      case 'transfer':
        return 'rgba(59, 130, 246, 0.1)';
      case 'refund':
        return 'rgba(249, 115, 22, 0.1)';
      default:
        return 'rgba(41, 52, 84, 0.1)';
    }
  };

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // ==================== EMPTY STATE ====================
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        {/* Decorative dots */}
        <View style={[styles.decorativeDot, styles.dot1]} />
        <View style={[styles.decorativeDot, styles.dot2]} />
        <View style={[styles.decorativeDot, styles.dot3]} />
        
        {/* Main circle */}
        <View style={styles.mainCircle}>
          <View style={styles.innerCircle} />
          <BellIcon size={80} color="#293454" />
          
          {/* Zzz animations */}
          <Animated.View style={[styles.zzz1, { opacity: pulseAnim1 }]}>
            <ZzzIcon size={20} color="#293454" />
          </Animated.View>
          <Animated.View style={[styles.zzz2, { opacity: pulseAnim2, transform: [{ scale: 0.75 }] }]}>
            <ZzzIcon size={20} color="#293454" />
          </Animated.View>
        </View>
      </View>

      {/* Text Content */}
      <View style={styles.textContent}>
        <Text style={styles.emptyTitle}>No notifications yet</Text>
        <Text style={styles.emptyMessage}>
          We will let you know when something important happens with your transactions or account.
        </Text>
      </View>

      {/* Refresh Button */}
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <RefreshIcon size={20} color="#FFFFFF" />
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  // ==================== NOTIFICATION LIST ====================
  const renderNotificationList = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#293454"
          colors={['#293454']}
        />
      }
    >
      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, activeTab === 'all' && styles.filterTabActive]}
          onPress={() => setActiveTab('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterTabText, activeTab === 'all' && styles.filterTabTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, activeTab === 'unread' && styles.filterTabActive]}
          onPress={() => setActiveTab('unread')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterTabText, activeTab === 'unread' && styles.filterTabTextActive]}>
            Unread
          </Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <View style={styles.filterActions}>
          <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.7}>
            <Text style={styles.actionLink}>Mark all read</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No unread notifications</Text>
        </View>
      ) : (
        <View style={styles.notificationsList}>
          {filteredNotifications.map((notification, index) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.isRead && styles.notificationCardUnread,
                index === filteredNotifications.length - 1 && styles.notificationCardLast,
              ]}
              onPress={() => handleNotificationPress(notification)}
              activeOpacity={0.7}
            >
              <View style={[styles.notificationIcon, { backgroundColor: getIconBackground(notification.type) }]}>
                {getNotificationIcon(notification.type)}
              </View>
              
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle} numberOfLines={1}>
                    {notification.title}
                  </Text>
                  {!notification.isRead && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notificationMessage} numberOfLines={2}>
                  {notification.message}
                </Text>
                <View style={styles.notificationFooter}>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                  {notification.amount && (
                    <Text style={[
                      styles.notificationAmount,
                      notification.amount.startsWith('+') ? styles.amountPositive : styles.amountNegative
                    ]}>
                      {notification.amount}
                    </Text>
                  )}
                </View>
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteNotification(notification.id)}
                activeOpacity={0.7}
              >
                <TrashIcon size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Clear All Button */}
      {filteredNotifications.length > 0 && (
        <TouchableOpacity
          style={styles.clearAllButton}
          onPress={handleClearAll}
          activeOpacity={0.7}
        >
          <TrashIcon size={18} color="#EF4444" />
          <Text style={styles.clearAllText}>Clear All Notifications</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ChevronLeftIcon size={24} color="#374151" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Notifications</Text>
        
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.7}
        >
          <SettingsIcon size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {notifications.length === 0 ? renderEmptyState() : renderNotificationList()}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <HomeIcon size={24} color="#9CA3AF" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Sales')}
          activeOpacity={0.7}
        >
          <ChartIcon size={24} color="#9CA3AF" />
          <Text style={styles.navLabel}>Sales</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <View style={styles.activeIndicator} />
          <BellFilledIcon size={24} color="#293454" />
          <Text style={styles.navLabelActive}>Alerts</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.7}
        >
          <UserIcon size={24} color="#9CA3AF" />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#293454',
  },

  // Main Content
  mainContent: {
    flex: 1,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 80,
  },
  illustrationContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  mainCircle: {
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  innerCircle: {
    position: 'absolute',
    width: 211,
    height: 211,
    borderRadius: 106,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  zzz1: {
    position: 'absolute',
    top: 32,
    right: 40,
  },
  zzz2: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  decorativeDot: {
    position: 'absolute',
    borderRadius: 50,
  },
  dot1: {
    top: 0,
    left: 0,
    width: 12,
    height: 12,
    backgroundColor: '#293454',
    opacity: 0.2,
  },
  dot2: {
    bottom: 16,
    right: 0,
    width: 16,
    height: 16,
    backgroundColor: '#293454',
    opacity: 0.1,
  },
  dot3: {
    bottom: 40,
    left: -16,
    width: 8,
    height: 8,
    backgroundColor: '#3B82F6',
    opacity: 0.3,
  },
  textContent: {
    alignItems: 'center',
    maxWidth: 280,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
    textAlign: 'center',
  },
  refreshButton: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#293454',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Filter Tabs
  filterTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterTabActive: {
    backgroundColor: '#293454',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  filterActions: {
    flex: 1,
    alignItems: 'flex-end',
  },
  actionLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#293454',
  },

  // Notifications List
  notificationsList: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  notificationCardUnread: {
    backgroundColor: 'rgba(41, 52, 84, 0.03)',
    borderLeftWidth: 3,
    borderLeftColor: '#293454',
  },
  notificationCardLast: {
    marginBottom: 0,
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#293454',
  },
  notificationMessage: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  notificationAmount: {
    fontSize: 13,
    fontWeight: '700',
  },
  amountPositive: {
    color: '#22C55E',
  },
  amountNegative: {
    color: '#EF4444',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },

  // No Results
  noResultsContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 15,
    color: '#9CA3AF',
  },

  // Clear All
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    height: Platform.OS === 'ios' ? 88 : 72,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    gap: 4,
    position: 'relative',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  navLabelActive: {
    fontSize: 10,
    fontWeight: '700',
    color: '#293454',
  },
  activeIndicator: {
    position: 'absolute',
    top: -12,
    width: 40,
    height: 4,
    backgroundColor: '#293454',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
});

export default NotificationsScreen;
