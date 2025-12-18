/**
 * PAYGAM MERCHANT - MY STORE SCREEN
 * Store details and location management
 * For General and Fuel merchants
 */

import React, { useRef } from 'react';
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
  Image,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const ArrowLeftIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CogIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </Svg>
);

const CheckCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </Svg>
);

const StarIcon: React.FC<{ size?: number; color?: string; half?: boolean }> = ({ size = 14, color = '#FBBF24', half = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={half ? 'none' : color}>
    {half ? (
      <>
        <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" stroke={color} strokeWidth={2} fill="none" />
        <Path d="M12 17.27V2l-2.81 6.63L2 9.24l5.46 4.73L5.82 21z" fill={color} />
      </>
    ) : (
      <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    )}
  </Svg>
);

const MapMarkerIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </Svg>
);

const PhoneIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </Svg>
);

const EmailIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </Svg>
);

const MapMarkedIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
  </Svg>
);

const PlusIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRightIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#D1D5DB' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const InfoCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </Svg>
);

const PenIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </Svg>
);

// ==================== TYPES ====================
interface StoreInfo {
  name: string;
  category: string;
  since: string;
  rating: number;
  reviews: number;
  visits: string;
  status: 'Open' | 'Closed';
  isVerified: boolean;
  coverImage: string;
  logoImage: string;
  address: {
    street: string;
    city: string;
  };
  phone: string;
  email: string;
}

// ==================== MAIN COMPONENT ====================
const MyStoreScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const fabScale = useRef(new Animated.Value(1)).current;

  // Demo store data
  const storeInfo: StoreInfo = {
    name: 'Nexus Café & Bistro',
    category: 'Food & Beverage',
    since: '2019',
    rating: 4.8,
    reviews: 154,
    visits: '12k',
    status: 'Open',
    isVerified: true,
    coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000',
    logoImage: 'https://images.unsplash.com/photo-1559969143-b2defc575dc6?w=200',
    address: {
      street: '452 Innovation Blvd, Suite 100',
      city: 'Financial District, NY 10005',
    },
    phone: '+1 (555) 123-4567',
    email: 'merchant@nexuspay.com',
  };

  const handleFabPressIn = () => {
    Animated.spring(fabScale, { toValue: 0.9, useNativeDriver: true }).start();
  };

  const handleFabPressOut = () => {
    Animated.spring(fabScale, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleUpdateLocation = () => {
    Alert.alert('Update Location', 'Navigate to location update screen');
  };

  const handleAddBranch = () => {
    Alert.alert('Add Branch', 'Navigate to add new branch screen');
  };

  const handleSendChangeRequest = () => {
    Alert.alert('Change Request', 'Send request to admin for sensitive changes');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} size={14} color="#FBBF24" />);
    }
    if (hasHalf) {
      stars.push(<StarIcon key="half" size={14} color="#FBBF24" half />);
    }
    return stars;
  };

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
            <Text style={styles.headerTitle}>My Store</Text>
            <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
              <CogIcon size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: storeInfo.coverImage }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={styles.coverGradient} />

          {/* Verified Badge */}
          {storeInfo.isVerified && (
            <View style={styles.verifiedBadge}>
              <CheckCircleIcon size={12} color="#FFFFFF" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}

          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Image
                source={{ uri: storeInfo.logoImage }}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Business Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.infoLeft}>
              <Text style={styles.storeName}>{storeInfo.name}</Text>
              <Text style={styles.storeCategory}>
                {storeInfo.category}  Since {storeInfo.since}
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <View style={styles.starsRow}>
                {renderStars(storeInfo.rating)}
              </View>
              <Text style={styles.ratingText}>({storeInfo.rating})</Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{storeInfo.visits}</Text>
              <Text style={styles.statLabel}>VISITS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{storeInfo.reviews}</Text>
              <Text style={styles.statLabel}>REVIEWS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, storeInfo.status === 'Open' && styles.statValueOpen]}>
                {storeInfo.status}
              </Text>
              <Text style={styles.statLabel}>STATUS</Text>
            </View>
          </View>
        </View>

        {/* Business Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Business Details</Text>
          
          <View style={styles.detailsList}>
            {/* Address */}
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <MapMarkerIcon size={20} color="#293454" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>HEADQUARTERS</Text>
                <Text style={styles.detailText}>{storeInfo.address.street}</Text>
                <Text style={styles.detailText}>{storeInfo.address.city}</Text>
              </View>
            </View>

            {/* Phone */}
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <PhoneIcon size={20} color="#293454" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>CONTACT NUMBER</Text>
                <Text style={styles.detailText}>{storeInfo.phone}</Text>
              </View>
            </View>

            {/* Email */}
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <EmailIcon size={20} color="#293454" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>EMAIL ADDRESS</Text>
                <Text style={styles.detailText}>{storeInfo.email}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Location Management Section */}
        <View style={styles.managementSection}>
          <Text style={styles.managementTitle}>Location Management</Text>
          
          {/* Update Location Button */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleUpdateLocation}
            activeOpacity={0.7}
          >
            <View style={styles.actionCardLeft}>
              <View style={styles.actionIconFilled}>
                <MapMarkedIcon size={24} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.actionTitle}>Update Location</Text>
                <Text style={styles.actionSubtitle}>Edit current address details</Text>
              </View>
            </View>
            <ChevronRightIcon size={16} color="#D1D5DB" />
          </TouchableOpacity>

          {/* Add Branch Button */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleAddBranch}
            activeOpacity={0.7}
          >
            <View style={styles.actionCardLeft}>
              <View style={styles.actionIconOutlined}>
                <PlusIcon size={24} color="#293454" />
              </View>
              <View>
                <Text style={styles.actionTitle}>Add New Branch</Text>
                <Text style={styles.actionSubtitle}>Expand your business reach</Text>
              </View>
            </View>
            <ChevronRightIcon size={16} color="#D1D5DB" />
          </TouchableOpacity>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <InfoCircleIcon size={16} color="#293454" />
            <View style={styles.infoBoxContent}>
              <Text style={styles.infoBoxText}>
                Need to change sensitive business information? Send a request to our admin team.
              </Text>
              <TouchableOpacity onPress={handleSendChangeRequest} activeOpacity={0.7}>
                <Text style={styles.infoBoxLink}>Send Change Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity
          style={styles.fab}
          onPressIn={handleFabPressIn}
          onPressOut={handleFabPressOut}
          activeOpacity={0.9}
        >
          <PenIcon size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    </View>
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
    paddingBottom: 16,
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Hero Section
  heroSection: {
    height: 224,
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  coverGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(41, 52, 84, 0.5)',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logoContainer: {
    position: 'absolute',
    bottom: -40,
    left: 24,
  },
  logoWrapper: {
    width: 96,
    height: 96,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    padding: 4,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },

  // Info Card
  infoCard: {
    backgroundColor: '#FFFFFF',
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoLeft: {
    flex: 1,
  },
  storeName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  storeCategory: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#293454',
  },
  statValueOpen: {
    color: '#22C55E',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
  },

  // Details Card
  detailsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#293454',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailsList: {
    gap: 20,
  },
  detailItem: {
    flexDirection: 'row',
    gap: 16,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginTop: 4,
    lineHeight: 20,
  },

  // Management Section
  managementSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  managementTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  actionCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionIconFilled: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#293454',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#293454',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIconOutlined: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#293454',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  // Info Box
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(41, 52, 84, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(41, 52, 84, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoBoxContent: {
    flex: 1,
  },
  infoBoxText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  infoBoxLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#293454',
    textDecorationLine: 'underline',
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

export default MyStoreScreen;
