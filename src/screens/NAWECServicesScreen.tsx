/**
 * NAWECServicesScreen - NAWEC Services Interface with Popup Modal
 * Based on HTML/Tailwind design provided
 * Features: Service cards, popup modal with account summary and quick actions
 * Uses react-native-svg for icons to avoid FontAwesome type errors
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Animated,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

// ============ SVG ICON COMPONENTS ============

const ArrowLeftIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const HomeIcon = ({ size = 16, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </Svg>
);

const FileTextIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const ShieldIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
);

const HeartIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Svg>
);

const GlobeIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={color} strokeWidth={2} />
  </Svg>
);

const CreditCardIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="1" y="4" width="22" height="16" rx="2" stroke={color} strokeWidth={2} />
    <Path d="M1 10h22" stroke={color} strokeWidth={2} />
  </Svg>
);

const DropletIcon = ({ size = 16, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </Svg>
);

const CloseIcon = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const CameraIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
      stroke={color}
      strokeWidth={2}
    />
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth={2} />
  </Svg>
);

const EyeIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth={2} />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
  </Svg>
);

const BoltIcon = ({ size = 14, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </Svg>
);

const CheckIcon = ({ size = 12, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const InvoiceIcon = ({ size = 16, color = '#B45309' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
      stroke={color}
      strokeWidth={2}
    />
    <Path d="M14 2v6h6M12 18v-6M9 15h6" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const WaterMeterIcon = ({ size = 20, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const ElectricMeterIcon = ({ size = 20, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </Svg>
);

const HistoryIcon = ({ size = 20, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 8v4l3 3" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
    <Path d="M3 12a9 9 0 0 1 9-9" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const AlertTriangleIcon = ({ size = 20, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
      stroke={color}
      strokeWidth={2}
    />
    <Path d="M12 9v4M12 17h.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const HeadsetIcon = ({ size = 20, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 18v-6a9 9 0 0 1 18 0v6" stroke={color} strokeWidth={2} />
    <Path
      d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z"
      stroke={color}
      strokeWidth={2}
    />
  </Svg>
);

// ============ MAIN COMPONENT ============

const NAWECServicesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const quickActions = [
    { id: 'reading', title: 'Reading', icon: CameraIcon, color: '#B45309', bgColor: '#FFF7ED' },
    { id: 'history', title: 'History', icon: HistoryIcon, color: '#3B82F6', bgColor: '#EFF6FF' },
    { id: 'faults', title: 'Faults', icon: AlertTriangleIcon, color: '#EF4444', bgColor: '#FEF2F2' },
    { id: 'support', title: 'Support', icon: HeadsetIcon, color: '#10B981', bgColor: '#F0FDF4' },
  ];

  const recentBills = [
    {
      id: 1,
      title: 'August Bill',
      reference: '#90230816-001',
      amount: '$125.50',
      status: 'Pending',
      statusColor: '#B45309',
      bgColor: '#FFFBEB',
    },
    {
      id: 2,
      title: 'July Bill',
      reference: '#90230715-001',
      amount: '$110.25',
      status: 'Paid',
      statusColor: '#10B981',
      bgColor: '#ECFDF5',
    },
  ];

  const openModal = () => {
    setShowModal(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowModal(false));
  };

  const renderQuickAction = (action: typeof quickActions[0]) => {
    const IconComponent = action.icon;
    return (
      <TouchableOpacity
        key={action.id}
        style={styles.quickActionButton}
        activeOpacity={0.8}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: action.bgColor }]}>
          <IconComponent size={20} color={action.color} />
        </View>
        <Text style={styles.quickActionText}>{action.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderServiceApplication = (
    title: string,
    subtitle: string,
    color: string,
    bgColor: string,
    IconComponent: React.FC<{ size?: number; color?: string }>
  ) => (
    <View style={[styles.serviceApplication, { backgroundColor: bgColor, borderColor: color }]}>
      <View style={styles.serviceIcon}>
        <IconComponent size={20} color={color} />
      </View>
      <View style={styles.serviceContent}>
        <Text style={styles.serviceTitle}>{title}</Text>
        <Text style={styles.serviceSubtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity
        style={[styles.applyButton, { backgroundColor: color }]}
        onPress={() => navigation.navigate('NAWECApplication' as never)}
      >
        <Text style={styles.applyButtonText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRecentBill = (bill: typeof recentBills[0]) => (
    <View key={bill.id} style={[styles.billItem, { borderLeftColor: bill.statusColor }]}>
      <View style={styles.billHeader}>
        <View style={[styles.billIcon, { backgroundColor: bill.bgColor }]}>
          {bill.status === 'Paid' ? (
            <CheckIcon size={16} color={bill.statusColor} />
          ) : (
            <InvoiceIcon size={16} color={bill.statusColor} />
          )}
        </View>
        <View style={styles.billInfo}>
          <Text style={styles.billTitle}>{bill.title}</Text>
          <Text style={styles.billReference}>{bill.reference}</Text>
        </View>
        <View style={styles.billAmount}>
          <Text style={styles.billPrice}>{bill.amount}</Text>
          <View style={[styles.statusBadge, { backgroundColor: bill.bgColor }]}>
            <Text style={[styles.statusText, { color: bill.statusColor }]}>{bill.status}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />
      {/* Background Content (Blurred/Dimmed) */}
      <View style={[styles.backgroundContent, showModal && styles.backgroundDimmed]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeftIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report Cases</Text>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
          <View style={styles.servicesCard}>
            <Text style={styles.servicesTitle}>Other Services :</Text>

            <View style={styles.servicesGrid}>
              {/* Service Item 1 */}
              <TouchableOpacity style={styles.serviceItem} activeOpacity={0.8}>
                <View style={[styles.serviceIconContainer, { backgroundColor: '#EF4444' }]}>
                  <FileTextIcon size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.serviceText}>Write a{'\n'}report</Text>
              </TouchableOpacity>

              {/* Service Item 2 */}
              <TouchableOpacity style={styles.serviceItem} activeOpacity={0.8}>
                <View style={[styles.serviceIconContainer, { backgroundColor: '#EF4444' }]}>
                  <ShieldIcon size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.serviceText}>Give info{'\n'}to Police</Text>
              </TouchableOpacity>

              {/* Service Item 3 */}
              <TouchableOpacity style={styles.serviceItem} activeOpacity={0.8}>
                <View style={[styles.serviceIconContainer, { backgroundColor: '#B45309' }]}>
                  <HeartIcon size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.serviceText}>Donate{'\n'}blood</Text>
              </TouchableOpacity>

              {/* Service Item 4 */}
              <TouchableOpacity style={styles.serviceItem} activeOpacity={0.8}>
                <View style={[styles.serviceIconContainer, { backgroundColor: '#EF4444' }]}>
                  <GlobeIcon size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.serviceText}>Give Immigration{'\n'}Info</Text>
              </TouchableOpacity>

              {/* Service Item 5 (NAWEC) */}
              <TouchableOpacity style={styles.serviceItem} activeOpacity={0.8} onPress={openModal}>
                <View style={[styles.serviceIconContainer, { backgroundColor: '#EF4444' }]}>
                  <CreditCardIcon size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.serviceText}>Pay NAWEC{'\n'}water bill</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Footer Navigation */}
        <View style={styles.footer}>
          <View style={styles.footerButton}>
            <View style={styles.footerIconContainer}>
              <HomeIcon size={16} color="#9CA3AF" />
            </View>
            <Text style={styles.footerText}>Home</Text>
          </View>
        </View>
      </View>

      {/* NAWEC Popup Modal */}
      <Modal
        transparent
        visible={showModal}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeModal}
          >
            <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <View style={styles.modalIcon}>
                    <DropletIcon size={16} color="#3B82F6" />
                  </View>
                  <Text style={styles.modalTitle}>NAWEC Services</Text>
                </View>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <CloseIcon size={18} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Modal Content */}
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {/* Quick Actions Section */}
                <View style={styles.quickActionsSection}>
                  <View style={styles.sectionTitleRow}>
                    <BoltIcon size={14} color="#3B82F6" />
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.primaryActionButton}
                      onPress={() => {
                        closeModal();
                        navigation.navigate('NAWECSubmitReading' as never);
                      }}
                    >
                      <CameraIcon size={16} color="#FFFFFF" />
                      <Text style={styles.primaryButtonText}>Submit Reading</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryActionButton}>
                      <EyeIcon size={16} color="#6B7280" />
                      <Text style={styles.secondaryButtonText}>View Latest Bill</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Account Summary Section */}
                <View style={styles.accountSummarySection}>
                  <View style={styles.summaryHeader}>
                    <Text style={styles.sectionTitle}>Account Summary</Text>
                    <Text style={styles.accountNumber}>#90230816</Text>
                  </View>

                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Latest Bill</Text>
                    <Text style={styles.summaryValue}>$125.50</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Due Date</Text>
                    <Text style={styles.summaryValue}>August 15, 2024</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Status</Text>
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingText}>Pending</Text>
                    </View>
                  </View>
                </View>

                {/* Recent Activity Teaser */}
                <View style={styles.recentActivity}>
                  <Text style={styles.sectionTitle}>Recent Activity</Text>
                  <View style={styles.activityItem}>
                    <View style={styles.activityIcon}>
                      <CheckIcon size={12} color="#10B981" />
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.activityTitle}>Bill Paid</Text>
                      <Text style={styles.activityDate}>July 15, 2024</Text>
                    </View>
                    <Text style={styles.activityAmount}>$110.25</Text>
                  </View>
                </View>

                {/* New Connections / Applications */}
                <View style={styles.applicationsSection}>
                  <Text style={styles.sectionTitle}>Apply for Service</Text>
                  {renderServiceApplication(
                    'Water Meter',
                    'New residential connection',
                    '#3B82F6',
                    '#EFF6FF',
                    WaterMeterIcon
                  )}
                  {renderServiceApplication(
                    'Electric Meter',
                    'New prepaid meter',
                    '#F59E0B',
                    '#FEF3C7',
                    ElectricMeterIcon
                  )}
                </View>

                {/* Recent Bills */}
                <View style={styles.recentBillsSection}>
                  <View style={styles.recentBillsHeader}>
                    <Text style={styles.sectionTitle}>Recent Bills</Text>
                    <TouchableOpacity>
                      <Text style={styles.seeAllText}>View All</Text>
                    </TouchableOpacity>
                  </View>
                  {recentBills.map(renderRecentBill)}
                </View>

                {/* Consumption Chart */}
                <View style={styles.consumptionChart}>
                  <Text style={styles.chartTitle}>Consumption Trend (m³)</Text>
                  <View style={styles.chartBars}>
                    <View style={[styles.chartBar, { height: 51 }]} />
                    <View style={[styles.chartBar, { height: 77 }]} />
                    <View style={[styles.chartBar, { height: 70 }]} />
                    <View style={[styles.chartBar, { height: 96 }]} />
                    <View style={[styles.chartBar, styles.chartBarActive, { height: 109 }]} />
                  </View>
                  <View style={styles.chartLabels}>
                    <Text style={styles.chartLabel}>Apr</Text>
                    <Text style={styles.chartLabel}>May</Text>
                    <Text style={styles.chartLabel}>Jun</Text>
                    <Text style={styles.chartLabel}>Jul</Text>
                    <Text style={[styles.chartLabel, styles.chartLabelActive]}>Aug</Text>
                  </View>
                </View>
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

// ============ STYLES ============

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  backgroundContent: {
    flex: 1,
  },
  backgroundDimmed: {
    opacity: 0.3,
  },
  header: {
    backgroundColor: '#B45309',
    padding: 16,
    paddingTop: 48,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  servicesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  servicesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  serviceText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 8,
    alignItems: 'center',
    paddingBottom: 24,
  },
  footerButton: {
    alignItems: 'center',
    padding: 8,
    width: 64,
  },
  footerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBackdrop: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 8,
  },
  modalBody: {
    padding: 20,
  },
  // Quick Actions Section
  quickActionsSection: {
    backgroundColor: '#EFF6FF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 6,
  },
  actionButtons: {
    gap: 12,
  },
  primaryActionButton: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  secondaryActionButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  // Account Summary Section
  accountSummarySection: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountNumber: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pendingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#92400E',
    textTransform: 'uppercase',
  },
  // Recent Activity
  recentActivity: {
    marginBottom: 24,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginTop: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#D1FAE5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  activityDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  // Applications Section
  applicationsSection: {
    marginBottom: 24,
  },
  serviceApplication: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  serviceSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  applyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // Quick Action Buttons
  quickActionButton: {
    alignItems: 'center',
    marginRight: 16,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  // Recent Bills Section
  recentBillsSection: {
    marginBottom: 24,
  },
  recentBillsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
  },
  billItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  billIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  billInfo: {
    flex: 1,
  },
  billTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  billReference: {
    fontSize: 12,
    color: '#6B7280',
  },
  billAmount: {
    alignItems: 'flex-end',
  },
  billPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  // Consumption Chart
  consumptionChart: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 128,
    marginBottom: 12,
  },
  chartBar: {
    width: '18%',
    backgroundColor: '#FED7AA',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  chartBarActive: {
    backgroundColor: '#B45309',
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartLabel: {
    fontSize: 12,
    color: '#6B7280',
    width: '18%',
    textAlign: 'center',
  },
  chartLabelActive: {
    fontWeight: 'bold',
    color: '#B45309',
  },
});

export default NAWECServicesScreen;
