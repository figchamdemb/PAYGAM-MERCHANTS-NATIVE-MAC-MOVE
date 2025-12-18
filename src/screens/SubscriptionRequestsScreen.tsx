/**
 * PAYGAM MERCHANT - SUBSCRIPTION REQUESTS SCREEN
 * Manage subscription requests - approve, reject, request edits
 * For General merchants
 */

import React, { useState, useRef } from 'react';
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
  TextInput,
  Image,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const ArrowLeftIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SearchIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UserCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
  </Svg>
);

const CheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CloseIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EditIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TrashIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ClockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </Svg>
);

const CheckCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </Svg>
);

const PlusIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CalendarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
  </Svg>
);

// ==================== TYPES ====================
type TabType = 'requests' | 'approved';

interface SubscriptionRequest {
  id: string;
  userName: string;
  userAvatar?: string;
  email: string;
  service: string;
  plan: string;
  price: string;
  billingCycle: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  startDate?: string;
}

// ==================== MAIN COMPONENT ====================
const SubscriptionRequestsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<TabType>('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const fabScale = useRef(new Animated.Value(1)).current;

  // Demo data
  const pendingRequests: SubscriptionRequest[] = [
    {
      id: '1',
      userName: 'David Wilson',
      email: 'david.wilson@email.com',
      service: 'Premium Wash Package',
      plan: 'Monthly',
      price: 'D250',
      billingCycle: 'Monthly',
      requestDate: 'Dec 18, 2024',
      status: 'pending',
    },
    {
      id: '2',
      userName: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      service: 'Basic Maintenance',
      plan: 'Weekly',
      price: 'D75',
      billingCycle: 'Weekly',
      requestDate: 'Dec 17, 2024',
      status: 'pending',
    },
    {
      id: '3',
      userName: 'Michael Chen',
      email: 'm.chen@company.com',
      service: 'Full Detail Service',
      plan: 'Quarterly',
      price: 'D850',
      billingCycle: 'Quarterly',
      requestDate: 'Dec 16, 2024',
      status: 'pending',
    },
  ];

  const approvedSubscriptions: SubscriptionRequest[] = [
    {
      id: '4',
      userName: 'Emma Thompson',
      email: 'emma.t@email.com',
      service: 'Premium Wash Package',
      plan: 'Monthly',
      price: 'D250',
      billingCycle: 'Monthly',
      requestDate: 'Dec 10, 2024',
      status: 'approved',
      startDate: 'Dec 11, 2024',
    },
    {
      id: '5',
      userName: 'James Lee',
      email: 'james.lee@email.com',
      service: 'Basic Maintenance',
      plan: 'Weekly',
      price: 'D75',
      billingCycle: 'Weekly',
      requestDate: 'Dec 8, 2024',
      status: 'approved',
      startDate: 'Dec 9, 2024',
    },
  ];

  const handleFabPressIn = () => {
    Animated.spring(fabScale, { toValue: 0.9, useNativeDriver: true }).start();
  };

  const handleFabPressOut = () => {
    Animated.spring(fabScale, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleApprove = (id: string) => {
    Alert.alert('Approve Subscription', 'Are you sure you want to approve this subscription request?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Approve', style: 'default', onPress: () => console.log('Approved:', id) },
    ]);
  };

  const handleReject = (id: string) => {
    Alert.alert('Reject Subscription', 'Are you sure you want to reject this subscription request?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', style: 'destructive', onPress: () => console.log('Rejected:', id) },
    ]);
  };

  const handleRequestEdit = (id: string) => {
    Alert.alert('Request Edit', 'Send a request to the subscriber for additional information?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send Request', onPress: () => console.log('Edit requested:', id) },
    ]);
  };

  const handleCancelSubscription = (id: string) => {
    Alert.alert('Cancel Subscription', 'Are you sure you want to cancel this active subscription?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: () => console.log('Cancelled:', id) },
    ]);
  };

  const handleDeleteSubscription = (id: string) => {
    Alert.alert('Delete Subscription', 'This will permanently remove the subscription record.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => console.log('Deleted:', id) },
    ]);
  };

  const filteredPending = pendingRequests.filter(
    (r) =>
      r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApproved = approvedSubscriptions.filter(
    (r) =>
      r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPendingCard = (request: SubscriptionRequest) => (
    <View key={request.id} style={styles.requestCard}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          {request.userAvatar ? (
            <Image source={{ uri: request.userAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <UserCircleIcon size={40} color="#D1D5DB" />
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{request.userName}</Text>
            <Text style={styles.userEmail}>{request.email}</Text>
          </View>
        </View>
        <View style={styles.pendingBadge}>
          <ClockIcon size={12} color="#F59E0B" />
          <Text style={styles.pendingText}>Pending</Text>
        </View>
      </View>

      {/* Service Info */}
      <View style={styles.serviceInfo}>
        <View style={styles.serviceRow}>
          <Text style={styles.serviceLabel}>Service</Text>
          <Text style={styles.serviceValue}>{request.service}</Text>
        </View>
        <View style={styles.serviceRow}>
          <Text style={styles.serviceLabel}>Plan</Text>
          <Text style={styles.serviceValue}>{request.plan} - {request.price}</Text>
        </View>
        <View style={styles.serviceRow}>
          <Text style={styles.serviceLabel}>Requested</Text>
          <View style={styles.dateRow}>
            <CalendarIcon size={14} color="#6B7280" />
            <Text style={styles.dateText}>{request.requestDate}</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleRequestEdit(request.id)}
          activeOpacity={0.7}
        >
          <EditIcon size={14} color="#293454" />
          <Text style={styles.editButtonText}>Req.Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => handleReject(request.id)}
          activeOpacity={0.7}
        >
          <CloseIcon size={14} color="#FFFFFF" />
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.approveButton}
          onPress={() => handleApprove(request.id)}
          activeOpacity={0.7}
        >
          <CheckIcon size={14} color="#FFFFFF" />
          <Text style={styles.approveButtonText}>Approve</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderApprovedCard = (subscription: SubscriptionRequest) => (
    <View key={subscription.id} style={styles.requestCard}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          {subscription.userAvatar ? (
            <Image source={{ uri: subscription.userAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <UserCircleIcon size={40} color="#D1D5DB" />
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{subscription.userName}</Text>
            <Text style={styles.userEmail}>{subscription.email}</Text>
          </View>
        </View>
        <View style={styles.approvedBadge}>
          <CheckCircleIcon size={12} color="#22C55E" />
          <Text style={styles.approvedText}>Active</Text>
        </View>
      </View>

      {/* Service Info */}
      <View style={styles.serviceInfo}>
        <View style={styles.serviceRow}>
          <Text style={styles.serviceLabel}>Service</Text>
          <Text style={styles.serviceValue}>{subscription.service}</Text>
        </View>
        <View style={styles.serviceRow}>
          <Text style={styles.serviceLabel}>Plan</Text>
          <Text style={styles.serviceValue}>{subscription.plan} - {subscription.price}</Text>
        </View>
        <View style={styles.serviceRow}>
          <Text style={styles.serviceLabel}>Started</Text>
          <View style={styles.dateRow}>
            <CalendarIcon size={14} color="#22C55E" />
            <Text style={[styles.dateText, { color: '#22C55E' }]}>{subscription.startDate}</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.cardActionsApproved}>
        <TouchableOpacity
          style={styles.cancelSubButton}
          onPress={() => handleCancelSubscription(subscription.id)}
          activeOpacity={0.7}
        >
          <CloseIcon size={14} color="#F59E0B" />
          <Text style={styles.cancelSubButtonText}>Cancel Sub</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteSubscription(subscription.id)}
          activeOpacity={0.7}
        >
          <TrashIcon size={14} color="#EF4444" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#293454" />
      
      {/* Header */}
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.topNav}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeftIcon size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Subscription Requests</Text>
            <View style={styles.navButton} />
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <SearchIcon size={18} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search subscribers..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
          onPress={() => setActiveTab('requests')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>
            Requests ({filteredPending.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'approved' && styles.tabActive]}
          onPress={() => setActiveTab('approved')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'approved' && styles.tabTextActive]}>
            Approved ({filteredApproved.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'requests' ? (
          filteredPending.length > 0 ? (
            filteredPending.map(renderPendingCard)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No pending requests</Text>
              <Text style={styles.emptySubtext}>New subscription requests will appear here</Text>
            </View>
          )
        ) : filteredApproved.length > 0 ? (
          filteredApproved.map(renderApprovedCard)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No approved subscriptions</Text>
            <Text style={styles.emptySubtext}>Approved subscribers will appear here</Text>
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity
          style={styles.fab}
          onPressIn={handleFabPressIn}
          onPressOut={handleFabPressOut}
          activeOpacity={0.9}
        >
          <PlusIcon size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  // Header
  header: {
    backgroundColor: '#293454',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 50,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 12 : 12,
    paddingBottom: 12,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 44,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#293454',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },

  // Request Card
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    gap: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  userEmail: {
    fontSize: 12,
    color: '#6B7280',
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  approvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  approvedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22C55E',
  },

  // Service Info
  serviceInfo: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 16,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  serviceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },

  // Card Actions
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#293454',
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    borderRadius: 8,
  },
  rejectButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#22C55E',
    paddingVertical: 10,
    borderRadius: 8,
  },
  approveButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardActionsApproved: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelSubButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  cancelSubButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F59E0B',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },

  // FAB
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 40,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#293454',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
});

export default SubscriptionRequestsScreen;
