/**
 * PAYGAM MERCHANT - TRANSACTION HISTORY SCREEN
 * Full transaction history with advanced filtering
 * Features: Filter by year, month, day, type (sale, withdrawal, refund), receiver
 */

import React, { useState } from 'react';
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
  Modal,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const BackIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SearchIcon = ({ size = 20, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={2} />
    <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const FilterIcon = ({ size = 20, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CalendarIcon = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth={2} />
    <Path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const ChevronDownIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CloseIcon = ({ size = 24, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Transaction Type Icons
const SaleIcon = ({ size = 24, color = '#059669' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2v20M17 7l-5-5-5 5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const WithdrawalIcon = ({ size = 24, color = '#DC2626' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22V2M7 17l5 5 5-5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const RefundIcon = ({ size = 24, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 10h11M3 10l4-4M3 10l4 4M21 14H10M21 14l-4-4M21 14l-4 4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TransferIcon = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M7 17L17 7M17 7H7M17 7v10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ==================== TYPES ====================
interface Transaction {
  id: string;
  type: 'sale' | 'withdrawal' | 'refund' | 'transfer';
  amount: number;
  currency: string;
  receiver: string;
  description: string;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

interface FilterState {
  year: string;
  month: string;
  day: string;
  type: string;
  receiver: string;
}

// ==================== MOCK DATA ====================
const years = ['2025', '2024', '2023', '2022'];
const months = [
  'All Months', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const days = ['All Days', ...Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))];
const types = ['All Types', 'Sale', 'Withdrawal', 'Refund', 'Transfer'];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'sale',
    amount: 2500.00,
    currency: 'GMD',
    receiver: 'Modou Jallow',
    description: 'Product Purchase',
    date: 'Dec 16, 2025',
    time: '10:30 AM',
    status: 'completed',
    reference: 'TXN-2025121601',
  },
  {
    id: '2',
    type: 'withdrawal',
    amount: 5000.00,
    currency: 'GMD',
    receiver: 'Bank Account',
    description: 'Withdrawal to GTBank',
    date: 'Dec 15, 2025',
    time: '02:45 PM',
    status: 'completed',
    reference: 'TXN-2025121502',
  },
  {
    id: '3',
    type: 'refund',
    amount: 750.00,
    currency: 'GMD',
    receiver: 'Fatou Ceesay',
    description: 'Product Return Refund',
    date: 'Dec 14, 2025',
    time: '09:15 AM',
    status: 'completed',
    reference: 'TXN-2025121403',
  },
  {
    id: '4',
    type: 'sale',
    amount: 12500.00,
    currency: 'GMD',
    receiver: 'Lamin Touray',
    description: 'Bulk Order Payment',
    date: 'Dec 14, 2025',
    time: '04:20 PM',
    status: 'completed',
    reference: 'TXN-2025121404',
  },
  {
    id: '5',
    type: 'transfer',
    amount: 3000.00,
    currency: 'GMD',
    receiver: 'Saikou Drammeh',
    description: 'Funds Transfer',
    date: 'Dec 13, 2025',
    time: '11:00 AM',
    status: 'pending',
    reference: 'TXN-2025121305',
  },
  {
    id: '6',
    type: 'sale',
    amount: 8750.00,
    currency: 'GMD',
    receiver: 'Amadou Bah',
    description: 'Service Payment',
    date: 'Dec 12, 2025',
    time: '03:30 PM',
    status: 'completed',
    reference: 'TXN-2025121206',
  },
  {
    id: '7',
    type: 'withdrawal',
    amount: 15000.00,
    currency: 'GMD',
    receiver: 'Bank Account',
    description: 'Withdrawal to Ecobank',
    date: 'Dec 11, 2025',
    time: '10:00 AM',
    status: 'completed',
    reference: 'TXN-2025121107',
  },
  {
    id: '8',
    type: 'refund',
    amount: 1200.00,
    currency: 'GMD',
    receiver: 'Mariama Sowe',
    description: 'Cancelled Order Refund',
    date: 'Dec 10, 2025',
    time: '01:45 PM',
    status: 'completed',
    reference: 'TXN-2025121008',
  },
  {
    id: '9',
    type: 'sale',
    amount: 4500.00,
    currency: 'GMD',
    receiver: 'Ousman Jatta',
    description: 'Product Purchase',
    date: 'Dec 09, 2025',
    time: '05:15 PM',
    status: 'completed',
    reference: 'TXN-2025120909',
  },
  {
    id: '10',
    type: 'transfer',
    amount: 7500.00,
    currency: 'GMD',
    receiver: 'Binta Colley',
    description: 'Supplier Payment',
    date: 'Dec 08, 2025',
    time: '09:30 AM',
    status: 'failed',
    reference: 'TXN-2025120810',
  },
];

// ==================== MAIN COMPONENT ====================
const TransactionHistoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    year: '2025',
    month: 'All Months',
    day: 'All Days',
    type: 'All Types',
    receiver: '',
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <SaleIcon size={24} color="#059669" />;
      case 'withdrawal':
        return <WithdrawalIcon size={24} color="#DC2626" />;
      case 'refund':
        return <RefundIcon size={24} color="#F59E0B" />;
      case 'transfer':
        return <TransferIcon size={24} color="#3B82F6" />;
      default:
        return <SaleIcon size={24} color="#059669" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'sale':
        return { bg: '#ECFDF5', text: '#059669' };
      case 'withdrawal':
        return { bg: '#FEF2F2', text: '#DC2626' };
      case 'refund':
        return { bg: '#FFFBEB', text: '#F59E0B' };
      case 'transfer':
        return { bg: '#EFF6FF', text: '#3B82F6' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return { bg: '#DCFCE7', text: '#15803D' };
      case 'pending':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'failed':
        return { bg: '#FEE2E2', text: '#DC2626' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const getAmountPrefix = (type: string) => {
    return type === 'sale' || type === 'refund' ? '+' : '-';
  };

  const applyFilters = () => {
    let count = 0;
    if (filters.month !== 'All Months') count++;
    if (filters.day !== 'All Days') count++;
    if (filters.type !== 'All Types') count++;
    if (filters.receiver.trim() !== '') count++;
    setActiveFiltersCount(count);
    setShowFilterModal(false);
  };

  const resetFilters = () => {
    setFilters({
      year: '2025',
      month: 'All Months',
      day: 'All Days',
      type: 'All Types',
      receiver: '',
    });
    setActiveFiltersCount(0);
  };

  const filteredTransactions = mockTransactions.filter(transaction => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        transaction.receiver.toLowerCase().includes(query) ||
        transaction.description.toLowerCase().includes(query) ||
        transaction.reference.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Type filter
    if (filters.type !== 'All Types') {
      if (transaction.type.toLowerCase() !== filters.type.toLowerCase()) return false;
    }

    // Receiver filter
    if (filters.receiver.trim() !== '') {
      if (!transaction.receiver.toLowerCase().includes(filters.receiver.toLowerCase())) return false;
    }

    return true;
  });

  const renderDropdown = (
    label: string,
    value: string,
    options: string[],
    onSelect: (value: string) => void,
    dropdownKey: string
  ) => (
    <View style={styles.filterField}>
      <Text style={styles.filterLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowDropdown(showDropdown === dropdownKey ? null : dropdownKey)}
      >
        <Text style={styles.dropdownText}>{value}</Text>
        <ChevronDownIcon size={16} color="#6B7280" />
      </TouchableOpacity>
      
      {showDropdown === dropdownKey && (
        <View style={styles.dropdownList}>
          <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.dropdownItem,
                  value === option && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  onSelect(option);
                  setShowDropdown(null);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  value === option && styles.dropdownItemTextActive,
                ]}>
                  {option}
                </Text>
                {value === option && <CheckIcon size={16} color="#059669" />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const colors = getTransactionColor(item.type);
    const statusStyle = getStatusStyle(item.status);
    const prefix = getAmountPrefix(item.type);

    return (
      <TouchableOpacity style={styles.transactionCard} activeOpacity={0.7}>
        <View style={styles.transactionLeft}>
          <View style={[styles.transactionIconContainer, { backgroundColor: colors.bg }]}>
            {getTransactionIcon(item.type)}
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionReceiver}>{item.receiver}</Text>
            <Text style={styles.transactionDescription}>{item.description}</Text>
            <Text style={styles.transactionDateTime}>{item.date} • {item.time}</Text>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text style={[styles.transactionAmount, { color: colors.text }]}>
            {prefix}{item.currency} {item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
          <Text style={styles.transactionRef}>{item.reference}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Calculate totals
  const totalSales = filteredTransactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = filteredTransactions
    .filter(t => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalRefunds = filteredTransactions
    .filter(t => t.type === 'refund')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }} />
        
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction History</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Summary Cards */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.summaryContainer}
        >
          <View style={[styles.summaryCard, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Text style={styles.summaryLabel}>Total Sales</Text>
            <Text style={styles.summaryAmount}>GMD {totalSales.toLocaleString()}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Text style={styles.summaryLabel}>Withdrawals</Text>
            <Text style={styles.summaryAmount}>GMD {totalWithdrawals.toLocaleString()}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
            <Text style={styles.summaryLabel}>Refunds</Text>
            <Text style={styles.summaryAmount}>GMD {totalRefunds.toLocaleString()}</Text>
          </View>
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Search & Filter Bar */}
        <View style={styles.searchFilterBar}>
          <View style={styles.searchContainer}>
            <SearchIcon size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by receiver, reference..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity 
            style={[
              styles.filterButton,
              activeFiltersCount > 0 && styles.filterButtonActive,
            ]}
            onPress={() => setShowFilterModal(true)}
          >
            <FilterIcon size={20} color={activeFiltersCount > 0 ? '#FFFFFF' : '#293454'} />
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <View style={styles.activeFiltersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filters.type !== 'All Types' && (
                <View style={styles.activeFilterChip}>
                  <Text style={styles.activeFilterText}>{filters.type}</Text>
                  <TouchableOpacity onPress={() => setFilters({...filters, type: 'All Types'})}>
                    <CloseIcon size={14} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              )}
              {filters.month !== 'All Months' && (
                <View style={styles.activeFilterChip}>
                  <Text style={styles.activeFilterText}>{filters.month}</Text>
                  <TouchableOpacity onPress={() => setFilters({...filters, month: 'All Months'})}>
                    <CloseIcon size={14} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              )}
              {filters.day !== 'All Days' && (
                <View style={styles.activeFilterChip}>
                  <Text style={styles.activeFilterText}>Day {filters.day}</Text>
                  <TouchableOpacity onPress={() => setFilters({...filters, day: 'All Days'})}>
                    <CloseIcon size={14} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              )}
              {filters.receiver.trim() !== '' && (
                <View style={styles.activeFilterChip}>
                  <Text style={styles.activeFilterText}>"{filters.receiver}"</Text>
                  <TouchableOpacity onPress={() => setFilters({...filters, receiver: ''})}>
                    <CloseIcon size={14} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        )}

        {/* Transaction Count */}
        <View style={styles.countContainer}>
          <Text style={styles.countText}>
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Transactions List */}
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No transactions found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your filters or search query
              </Text>
            </View>
          }
        />
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Transactions</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <CloseIcon size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {/* Year Filter */}
              {renderDropdown(
                'Year',
                filters.year,
                years,
                (value) => setFilters({...filters, year: value}),
                'year'
              )}

              {/* Month Filter */}
              {renderDropdown(
                'Month',
                filters.month,
                months,
                (value) => setFilters({...filters, month: value}),
                'month'
              )}

              {/* Day Filter */}
              {renderDropdown(
                'Day',
                filters.day,
                days,
                (value) => setFilters({...filters, day: value}),
                'day'
              )}

              {/* Type Filter */}
              {renderDropdown(
                'Transaction Type',
                filters.type,
                types,
                (value) => setFilters({...filters, type: value}),
                'type'
              )}

              {/* Receiver Filter */}
              <View style={styles.filterField}>
                <Text style={styles.filterLabel}>Receiver / Recipient</Text>
                <TextInput
                  style={styles.receiverInput}
                  placeholder="Enter receiver name..."
                  placeholderTextColor="#9CA3AF"
                  value={filters.receiver}
                  onChangeText={(text) => setFilters({...filters, receiver: text})}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={resetFilters}
              >
                <Text style={styles.resetButtonText}>Reset All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={applyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    backgroundColor: '#059669',
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
  },
  
  // Summary
  summaryContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 12,
  },
  summaryCard: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    marginRight: 12,
    minWidth: 140,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  
  // Content
  content: {
    flex: 1,
    marginTop: -10,
    paddingTop: 10,
  },
  
  // Search & Filter
  searchFilterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#1F2937',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: '#059669',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  
  // Active Filters
  activeFiltersContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  
  // Count
  countContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  countText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  
  // List
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  
  // Transaction Card
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  transactionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionReceiver: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  transactionDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  transactionDateTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  transactionRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  transactionRef: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  
  // Filter Fields
  filterField: {
    marginBottom: 20,
    zIndex: 1,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownText: {
    fontSize: 14,
    color: '#1F2937',
  },
  dropdownList: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 100,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemActive: {
    backgroundColor: '#ECFDF5',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#1F2937',
  },
  dropdownItemTextActive: {
    color: '#059669',
    fontWeight: '600',
  },
  receiverInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  
  // Buttons
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#059669',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default TransactionHistoryScreen;
