/**
 * ✅ PATROL APP - GLOBAL DATABASE SEARCH SCREEN
 * Search warrants, records, property with BOLO alerts
 * Police Department Only
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
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const ShieldIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
  </Svg>
);

const BellIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SearchIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={2} />
    <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const BarcodeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="2" height="16" fill={color} />
    <Rect x="7" y="4" width="1" height="16" fill={color} />
    <Rect x="10" y="4" width="2" height="16" fill={color} />
    <Rect x="14" y="4" width="1" height="16" fill={color} />
    <Rect x="17" y="4" width="3" height="16" fill={color} />
    <Rect x="22" y="4" width="1" height="16" fill={color} />
  </Svg>
);

const UserIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={2} />
  </Svg>
);

const CarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </Svg>
);

const FileIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BoxIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const AlertIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </Svg>
);

const ClockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const MicIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="9" y="2" width="6" height="11" rx="3" stroke={color} strokeWidth={2} />
    <Path d="M19 10v1a7 7 0 01-14 0v-1M12 18.5v3.5M8 22h8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowRightIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const GavelIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M1 21h12v2H1v-2zM5.245 8.07l2.83-2.827 14.14 14.142-2.828 2.828L5.245 8.07zM12.317 1l5.657 5.656-2.83 2.83-5.654-5.66L12.317 1zM3.825 9.485l5.657 5.657-2.828 2.828-5.657-5.657 2.828-2.828z" />
  </Svg>
);

// Types
type SearchScope = 'all' | 'person' | 'vehicle' | 'case' | 'property';

interface RecentSearch {
  id: string;
  query: string;
  type: SearchScope;
  time: string;
}

interface BOLOAlert {
  id: string;
  type: 'warrant' | 'vehicle' | 'missing';
  title: string;
  description: string;
  priority: 'high' | 'medium';
  time: string;
  color: string;
}

const RECENT_SEARCHES: RecentSearch[] = [
  { id: '1', query: 'John Michael Smith', type: 'person', time: '10m ago' },
  { id: '2', query: 'BJL-4521', type: 'vehicle', time: '1h ago' },
  { id: '3', query: 'Case #2024-08415', type: 'case', time: '2h ago' },
];

const BOLO_ALERTS: BOLOAlert[] = [
  {
    id: '1',
    type: 'warrant',
    title: 'Active Warrant',
    description: 'Marcus Webb, 34 • Armed robbery • Last seen: Bakau District',
    priority: 'high',
    time: '2h ago',
    color: '#EF4444',
  },
  {
    id: '2',
    type: 'vehicle',
    title: 'Stolen Vehicle',
    description: 'Black Honda Accord • BJL-8827 • Taken from Serekunda Market',
    priority: 'high',
    time: '5h ago',
    color: '#F59E0B',
  },
  {
    id: '3',
    type: 'missing',
    title: 'Missing Person',
    description: 'Fatou Jallow, 16 • Last seen wearing school uniform • Brikama',
    priority: 'medium',
    time: '12h ago',
    color: '#8B5CF6',
  },
];

const GlobalDatabaseSearchScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeScope, setActiveScope] = useState<SearchScope>('all');
  const fabPulse = useRef(new Animated.Value(1)).current;

  // FAB pulse animation
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fabPulse, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fabPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const getScopeIcon = (scope: SearchScope) => {
    switch (scope) {
      case 'person':
        return <UserIcon size={16} color={activeScope === scope ? '#FFFFFF' : '#6B7280'} />;
      case 'vehicle':
        return <CarIcon size={16} color={activeScope === scope ? '#FFFFFF' : '#6B7280'} />;
      case 'case':
        return <FileIcon size={16} color={activeScope === scope ? '#FFFFFF' : '#6B7280'} />;
      case 'property':
        return <BoxIcon size={16} color={activeScope === scope ? '#FFFFFF' : '#6B7280'} />;
      default:
        return null;
    }
  };

  const getScopeLabel = (scope: SearchScope) => {
    switch (scope) {
      case 'all':
        return 'All';
      case 'person':
        return 'Person';
      case 'vehicle':
        return 'Vehicle';
      case 'case':
        return 'Case #';
      case 'property':
        return 'Property';
      default:
        return scope;
    }
  };

  const getSearchTypeIcon = (type: SearchScope) => {
    switch (type) {
      case 'person':
        return <UserIcon size={14} color="#6B7280" />;
      case 'vehicle':
        return <CarIcon size={14} color="#6B7280" />;
      case 'case':
        return <FileIcon size={14} color="#6B7280" />;
      case 'property':
        return <BoxIcon size={14} color="#6B7280" />;
      default:
        return <SearchIcon size={14} color="#6B7280" />;
    }
  };

  const getBOLOIcon = (type: BOLOAlert['type']) => {
    switch (type) {
      case 'warrant':
        return <GavelIcon size={18} color="#FFFFFF" />;
      case 'vehicle':
        return <CarIcon size={18} color="#FFFFFF" />;
      case 'missing':
        return <UserIcon size={18} color="#FFFFFF" />;
      default:
        return <AlertIcon size={18} color="#FFFFFF" />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <ShieldIcon size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Sentinel Patrol</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <BellIcon size={20} color="#FFFFFF" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <View style={styles.avatarSmall}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <SearchIcon size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search database..."
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.barcodeButton}>
              <BarcodeIcon size={18} color="#1E40AF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Scope Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scopeContainer}
          contentContainerStyle={styles.scopeContent}
        >
          {(['all', 'person', 'vehicle', 'case', 'property'] as SearchScope[]).map((scope) => (
            <TouchableOpacity
              key={scope}
              style={[styles.scopeButton, activeScope === scope && styles.scopeButtonActive]}
              onPress={() => setActiveScope(scope)}
            >
              {scope !== 'all' && getScopeIcon(scope)}
              <Text style={[styles.scopeText, activeScope === scope && styles.scopeTextActive]}>
                {getScopeLabel(scope)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent Searches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentList}>
            {RECENT_SEARCHES.map((search) => (
              <TouchableOpacity key={search.id} style={styles.recentItem}>
                <View style={styles.recentIcon}>
                  <ClockIcon size={14} color="#9CA3AF" />
                </View>
                <View style={styles.recentContent}>
                  <Text style={styles.recentQuery}>{search.query}</Text>
                  <View style={styles.recentMeta}>
                    {getSearchTypeIcon(search.type)}
                    <Text style={styles.recentTime}>{search.time}</Text>
                  </View>
                </View>
                <ArrowRightIcon size={16} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Active BOLOs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.boloTitleRow}>
              <AlertIcon size={16} color="#EF4444" />
              <Text style={styles.sectionTitleBolo}>Active BOLOs</Text>
              <View style={styles.boloCount}>
                <Text style={styles.boloCountText}>3</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.boloList}>
            {BOLO_ALERTS.map((bolo) => (
              <TouchableOpacity key={bolo.id} style={styles.boloCard}>
                <View style={[styles.boloIconContainer, { backgroundColor: bolo.color }]}>
                  {getBOLOIcon(bolo.type)}
                </View>
                <View style={styles.boloContent}>
                  <View style={styles.boloHeader}>
                    <Text style={styles.boloTitle}>{bolo.title}</Text>
                    {bolo.priority === 'high' && (
                      <View style={styles.highPriorityBadge}>
                        <Text style={styles.highPriorityText}>HIGH</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.boloDescription}>{bolo.description}</Text>
                  <Text style={styles.boloTime}>Posted {bolo.time}</Text>
                </View>
                <ArrowRightIcon size={18} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Access */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickGrid}>
            <TouchableOpacity style={styles.quickCard}>
              <View style={[styles.quickIcon, { backgroundColor: '#EFF6FF' }]}>
                <GavelIcon size={22} color="#1E40AF" />
              </View>
              <Text style={styles.quickLabel}>Warrants</Text>
              <Text style={styles.quickCount}>24 Active</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard}>
              <View style={[styles.quickIcon, { backgroundColor: '#FEF3C7' }]}>
                <CarIcon size={22} color="#D97706" />
              </View>
              <Text style={styles.quickLabel}>Stolen Vehicles</Text>
              <Text style={styles.quickCount}>156 Listed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard}>
              <View style={[styles.quickIcon, { backgroundColor: '#F3E8FF' }]}>
                <UserIcon size={22} color="#7C3AED" />
              </View>
              <Text style={styles.quickLabel}>Missing Persons</Text>
              <Text style={styles.quickCount}>8 Active</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard}>
              <View style={[styles.quickIcon, { backgroundColor: '#DCFCE7' }]}>
                <BoxIcon size={22} color="#16A34A" />
              </View>
              <Text style={styles.quickLabel}>Property</Text>
              <Text style={styles.quickCount}>1,240 Items</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <SearchIcon size={22} color="#1E40AF" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <FileIcon size={22} color="#6B7280" />
          <Text style={styles.navLabel}>History</Text>
        </TouchableOpacity>

        {/* Voice Search FAB */}
        <View style={styles.fabContainer}>
          <Animated.View style={[styles.fabPulse, { transform: [{ scale: fabPulse }] }]} />
          <TouchableOpacity style={styles.fab}>
            <MicIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.navItem}>
          <AlertIcon size={22} color="#6B7280" />
          <Text style={styles.navLabel}>BOLOs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <BoxIcon size={22} color="#6B7280" />
          <Text style={styles.navLabel}>Evidence</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  // Header
  header: {
    backgroundColor: '#1E40AF',
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 24,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerButton: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#1E40AF',
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#93C5FD',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E40AF',
  },

  // Search Bar
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    paddingVertical: 14,
  },
  barcodeButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Content
  content: {
    flex: 1,
  },

  // Scope Filters
  scopeContainer: {
    marginTop: 16,
  },
  scopeContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  scopeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  scopeButtonActive: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  scopeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
  },
  scopeTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Section
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionTitleBolo: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
  },
  boloTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  boloCount: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  boloCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },

  // Recent Searches
  recentList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  recentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentContent: {
    flex: 1,
  },
  recentQuery: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  recentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recentTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // BOLO Cards
  boloList: {
    gap: 12,
  },
  boloCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  boloIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boloContent: {
    flex: 1,
  },
  boloHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  boloTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  highPriorityBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  highPriorityText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#DC2626',
  },
  boloDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 4,
  },
  boloTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  // Quick Access
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginHorizontal: -6,
  },
  quickCard: {
    width: (width - 44) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  quickCount: {
    fontSize: 12,
    color: '#6B7280',
  },

  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  fabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  fabPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(30, 64, 175, 0.2)',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default GlobalDatabaseSearchScreen;
