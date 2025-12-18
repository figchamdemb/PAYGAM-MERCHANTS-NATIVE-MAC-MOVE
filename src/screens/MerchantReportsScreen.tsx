/**
 * PAYGAM MERCHANT - REPORTS SCREEN
 * Analytics and reporting dashboard for merchants
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
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const BackArrowIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BellIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronDownIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DownloadIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TrendUpIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ShoppingBagIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChartBarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MoreIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="1" fill={color} />
    <Circle cx="12" cy="5" r="1" fill={color} />
    <Circle cx="12" cy="19" r="1" fill={color} />
  </Svg>
);

// ==================== TYPES ====================
type DateFilter = 'today' | 'week' | 'month' | 'year';
type CurrencyType = 'GMD' | 'USD' | 'EUR' | 'GBP';

interface SalesMethod {
  name: string;
  percentage: number;
  color: string;
}

interface WeeklyData {
  day: string;
  value: number;
  isActive?: boolean;
}

// ==================== MAIN COMPONENT ====================
const MerchantReportsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [dateFilter, setDateFilter] = useState<DateFilter>('month');
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>('GMD');
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);

  const merchantType = route.params?.merchantType || 'general';
  const merchantName = route.params?.merchantName || 'Nexus Merchant';

  // Mock data
  const totalRevenue = 24592.00;
  const revenueGrowth = 12.5;
  const totalTransactions = 1240;
  const avgOrder = 19.80;

  const salesMethods: SalesMethod[] = [
    { name: 'PayGam Wallet', percentage: 45, color: '#293454' },
    { name: 'Credit Card', percentage: 30, color: '#6366F1' },
    { name: 'Cash', percentage: 15, color: '#10B981' },
    { name: 'QR Code', percentage: 10, color: '#F59E0B' },
  ];

  const weeklyData: WeeklyData[] = [
    { day: 'Mon', value: 40 },
    { day: 'Tue', value: 65 },
    { day: 'Wed', value: 50 },
    { day: 'Thu', value: 85, isActive: true },
    { day: 'Fri', value: 60 },
    { day: 'Sat', value: 75 },
    { day: 'Sun', value: 45 },
  ];

  const currencies = [
    { key: 'GMD', symbol: 'D', label: 'Dalasi', flag: '🇬🇲' },
    { key: 'USD', symbol: '$', label: 'US Dollar', flag: '🇺🇸' },
    { key: 'EUR', symbol: '€', label: 'Euro', flag: '🇪🇺' },
    { key: 'GBP', symbol: '£', label: 'British Pound', flag: '🇬🇧' },
  ];

  const dateFilters = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'year', label: 'This Year' },
  ];

  const currentCurrency = currencies.find(c => c.key === selectedCurrency);
  const currentDateFilter = dateFilters.find(d => d.key === dateFilter);

  const formatAmount = (amount: number) => {
    return `${currentCurrency?.symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const handleExport = () => {
    // Export report functionality
  };

  // Calculate pie chart segments
  const renderPieChart = () => {
    let currentAngle = 0;
    const radius = 80;
    const centerX = 96;
    const centerY = 96;

    return (
      <View style={styles.pieChartContainer}>
        <Svg width={192} height={192} viewBox="0 0 192 192">
          {salesMethods.map((method, index) => {
            const angle = (method.percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);

            const x1 = centerX + radius * Math.cos(startRad);
            const y1 = centerY + radius * Math.sin(startRad);
            const x2 = centerX + radius * Math.cos(endRad);
            const y2 = centerY + radius * Math.sin(endRad);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            return (
              <Path
                key={index}
                d={pathData}
                fill={method.color}
              />
            );
          })}
          {/* Inner circle for donut effect */}
          <Circle cx={centerX} cy={centerY} r={50} fill="#FFFFFF" />
        </Svg>
        {/* Center text */}
        <View style={styles.pieChartCenter}>
          <Text style={styles.pieChartCenterLabel}>Total</Text>
          <Text style={styles.pieChartCenterValue}>100%</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#293454" />

      {/* Header */}
      <LinearGradient colors={['#293454', '#1f2842']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <BackArrowIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerSubtitle}>Welcome back,</Text>
            <Text style={styles.headerTitle}>{merchantName}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate('NotificationsScreen')}
            activeOpacity={0.7}
          >
            <BellIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Filters Row */}
        <View style={styles.filtersRow}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setDateModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.filterButtonText}>{currentDateFilter?.label}</Text>
            <ChevronDownIcon size={16} color="#93C5FD" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setCurrencyModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.filterButtonText}>{currentCurrency?.flag} {selectedCurrency}</Text>
            <ChevronDownIcon size={16} color="#93C5FD" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExport}
            activeOpacity={0.7}
          >
            <DownloadIcon size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Total Revenue Card */}
        <View style={styles.revenueCard}>
          <View style={styles.revenueCardAccent} />
          <Text style={styles.revenueLabel}>Total Revenue</Text>
          <Text style={styles.revenueAmount}>{formatAmount(totalRevenue)}</Text>
          <View style={styles.growthBadge}>
            <TrendUpIcon size={12} color="#10B981" />
            <Text style={styles.growthText}>+{revenueGrowth}%</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#EFF6FF' }]}>
              <ShoppingBagIcon size={16} color="#3B82F6" />
            </View>
            <Text style={styles.statLabel}>Transactions</Text>
            <Text style={styles.statValue}>{totalTransactions.toLocaleString()}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#FFF7ED' }]}>
              <ChartBarIcon size={16} color="#F59E0B" />
            </View>
            <Text style={styles.statLabel}>Avg. Order</Text>
            <Text style={styles.statValue}>{formatAmount(avgOrder)}</Text>
          </View>
        </View>

        {/* Pie Chart Section */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Sales by Method</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <MoreIcon size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {renderPieChart()}

          {/* Legend */}
          <View style={styles.legend}>
            {salesMethods.map((method, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={styles.legendLeft}>
                  <View style={[styles.legendDot, { backgroundColor: method.color }]} />
                  <Text style={styles.legendLabel}>{method.name}</Text>
                </View>
                <Text style={styles.legendValue}>{method.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly Trend */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Weekly Trend</Text>
          <View style={styles.barChart}>
            {weeklyData.map((item, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${item.value}%`,
                        backgroundColor: item.isActive ? '#293454' : '#C7D2FE',
                      },
                    ]}
                  />
                </View>
                <Text style={[
                  styles.barLabel,
                  item.isActive && styles.barLabelActive,
                ]}>
                  {item.day}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Date Filter Modal */}
      <Modal
        visible={dateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDateModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDateModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Period</Text>
            {dateFilters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.modalOption,
                  dateFilter === filter.key && styles.modalOptionActive,
                ]}
                onPress={() => {
                  setDateFilter(filter.key as DateFilter);
                  setDateModalVisible(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.modalOptionText,
                  dateFilter === filter.key && styles.modalOptionTextActive,
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Currency Modal */}
      <Modal
        visible={currencyModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCurrencyModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setCurrencyModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            {currencies.map((currency) => (
              <TouchableOpacity
                key={currency.key}
                style={[
                  styles.modalOption,
                  selectedCurrency === currency.key && styles.modalOptionActive,
                ]}
                onPress={() => {
                  setSelectedCurrency(currency.key as CurrencyType);
                  setCurrencyModalVisible(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.currencyFlag}>{currency.flag}</Text>
                <View style={styles.currencyInfo}>
                  <Text style={[
                    styles.modalOptionText,
                    selectedCurrency === currency.key && styles.modalOptionTextActive,
                  ]}>
                    {currency.label}
                  </Text>
                  <Text style={styles.currencyCode}>{currency.key}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
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
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#93C5FD',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 6,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: 'auto',
  },
  revenueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  revenueCardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#293454',
  },
  revenueLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#293454',
    letterSpacing: -1,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 10,
    gap: 4,
  },
  growthText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -10,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#293454',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#293454',
  },
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  pieChartCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChartCenterLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  pieChartCenterValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#293454',
  },
  legend: {
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  legendLabel: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  legendValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#293454',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 140,
    gap: 8,
    marginTop: 16,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barBackground: {
    width: '100%',
    height: 120,
    backgroundColor: '#EEF2FF',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  barLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 8,
  },
  barLabelActive: {
    color: '#293454',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  modalOptionActive: {
    backgroundColor: 'rgba(41, 52, 84, 0.1)',
    borderWidth: 2,
    borderColor: '#293454',
  },
  modalOptionText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  modalOptionTextActive: {
    color: '#293454',
    fontWeight: '600',
  },
  currencyFlag: {
    fontSize: 24,
    marginRight: 14,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});

export default MerchantReportsScreen;
