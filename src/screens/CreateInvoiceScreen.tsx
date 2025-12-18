/**
 * PAYGAM MERCHANT - CREATE INVOICE SCREEN
 * Corporate Merchant Invoice Creation
 * Features: Customer selection, Invoice details, Amount, Attachments
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
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const BackIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const HelpIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="17" r="1" fill={color} />
  </Svg>
);

const SearchIcon = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={2} />
    <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const UserIcon = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={2} />
    <Path d="M20 21a8 8 0 10-16 0" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const CloseCircleIcon = ({ size = 24, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M15 9l-6 6M9 9l6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PlusIcon = ({ size = 20, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const PaperclipIcon = ({ size = 20, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRightIcon = ({ size = 16, color = '#D1D5DB' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ShieldIcon = ({ size = 18, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SendIcon = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ==================== TYPES ====================
interface Customer {
  id: string;
  name: string;
  initials: string;
  phone: string;
}

interface RecentCustomer {
  id: string;
  name: string;
  isNew?: boolean;
}

// ==================== MOCK DATA ====================
const recentCustomers: RecentCustomer[] = [
  { id: '1', name: 'Michael' },
  { id: '2', name: 'Emma' },
  { id: 'new', name: 'New', isNew: true },
];

// ==================== MAIN COMPONENT ====================
const CreateInvoiceScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>({
    id: '1',
    name: 'Sarah Jenkins',
    initials: 'SJ',
    phone: '+1 (555) 012-3456',
  });
  const [invoiceReference, setInvoiceReference] = useState('Web Design Services - June');
  const [amount, setAmount] = useState('450.00');
  const [currentStep] = useState(1);

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
  };

  const handleSelectRecentCustomer = (customer: RecentCustomer) => {
    if (customer.isNew) {
      // Handle new customer creation
      return;
    }
    setSelectedCustomer({
      id: customer.id,
      name: customer.name,
      initials: customer.name.substring(0, 2).toUpperCase(),
      phone: '+1 (555) 000-0000',
    });
  };

  const handleCreateInvoice = () => {
    // Navigate to success or next step
    navigation.navigate('ActionSuccess', {
      title: 'Invoice Sent!',
      message: `Invoice for $${amount} has been sent to ${selectedCustomer?.name}`,
      actionText: 'Back to Dashboard',
      navigateTo: 'CorporateMerchantDashboard',
    });
  };

  const formatAmount = (value: string) => {
    // Remove non-numeric characters except decimal
    const cleaned = value.replace(/[^0-9.]/g, '');
    return cleaned;
  };

  const displayAmount = parseFloat(amount || '0').toFixed(2);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#293454" />
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }} />
          
          {/* Top Navigation */}
          <View style={styles.headerNav}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.goBack()}
            >
              <BackIcon size={22} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Create Invoice</Text>
            
            <TouchableOpacity style={styles.headerButton}>
              <HelpIcon size={22} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>

          {/* Progress Stepper */}
          <View style={styles.stepperContainer}>
            <View style={styles.stepperDots}>
              <View style={[styles.stepperDot, currentStep >= 1 && styles.stepperDotActive]} />
              <View style={[styles.stepperDot, currentStep >= 2 && styles.stepperDotActive]} />
              <View style={[styles.stepperDot, currentStep >= 3 && styles.stepperDotActive]} />
            </View>
            <Text style={styles.stepperText}>Step {currentStep} of 3: Details</Text>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Section 1: Customer Selection */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>BILL TO</Text>
            
            {/* Search Input */}
            <View style={styles.searchContainer}>
              <View style={styles.searchIconContainer}>
                <SearchIcon size={18} color="#9CA3AF" />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Search name, ID, or phone..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Selected Customer */}
            {selectedCustomer && (
              <View style={styles.selectedCustomer}>
                <View style={styles.selectedCustomerLeft}>
                  <View style={styles.customerAvatar}>
                    <Text style={styles.customerAvatarText}>{selectedCustomer.initials}</Text>
                  </View>
                  <View>
                    <Text style={styles.customerName}>{selectedCustomer.name}</Text>
                    <Text style={styles.customerPhone}>{selectedCustomer.phone}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.clearCustomerButton}
                  onPress={handleClearCustomer}
                >
                  <CloseCircleIcon size={24} color="#293454" />
                </TouchableOpacity>
              </View>
            )}

            {/* Recent Customers */}
            <View style={styles.recentSection}>
              <Text style={styles.recentLabel}>Recent Customers</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentList}
              >
                {recentCustomers.map((customer) => (
                  <TouchableOpacity
                    key={customer.id}
                    style={styles.recentItem}
                    onPress={() => handleSelectRecentCustomer(customer)}
                  >
                    <View style={[
                      styles.recentAvatar,
                      customer.isNew && styles.recentAvatarNew,
                    ]}>
                      {customer.isNew ? (
                        <PlusIcon size={20} color="#9CA3AF" />
                      ) : (
                        <UserIcon size={20} color="#6B7280" />
                      )}
                    </View>
                    <Text style={styles.recentName}>{customer.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Section 2: Invoice Details */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>PAYMENT DETAILS</Text>
            
            {/* Reference Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Invoice Reference / Title</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Consulting Fee"
                placeholderTextColor="#9CA3AF"
                value={invoiceReference}
                onChangeText={setInvoiceReference}
              />
            </View>

            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount to Request</Text>
              <View style={styles.amountInputContainer}>
                <View style={styles.amountPrefix}>
                  <Text style={styles.amountPrefixText}>$</Text>
                </View>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor="#D1D5DB"
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={(text) => setAmount(formatAmount(text))}
                />
                <View style={styles.amountSuffix}>
                  <Text style={styles.amountSuffixText}>USD</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Section 3: Attach Receipt */}
          <TouchableOpacity style={styles.attachCard} activeOpacity={0.7}>
            <View style={styles.attachLeft}>
              <View style={styles.attachIconContainer}>
                <PaperclipIcon size={20} color="#293454" />
              </View>
              <Text style={styles.attachText}>Attach Receipt/Image</Text>
            </View>
            <ChevronRightIcon size={16} color="#D1D5DB" />
          </TouchableOpacity>

          {/* Info Note */}
          <View style={styles.infoNote}>
            <ShieldIcon size={18} color="#293454" />
            <Text style={styles.infoNoteText}>
              Once created, the customer will receive a notification. They can view details and confirm payment securely via fingerprint. You will be notified immediately upon success.
            </Text>
          </View>
        </ScrollView>

        {/* Bottom Action Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Receivable</Text>
            <Text style={styles.totalAmount}>${displayAmount}</Text>
          </View>
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleCreateInvoice}
            activeOpacity={0.9}
          >
            <Text style={styles.submitButtonText}>Create & Send Invoice</Text>
            <SendIcon size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: '#293454',
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  
  // Stepper
  stepperContainer: {
    alignItems: 'center',
  },
  stepperDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  stepperDot: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  stepperDotActive: {
    backgroundColor: '#FFFFFF',
  },
  stepperText: {
    fontSize: 12,
    color: 'rgba(191, 219, 254, 0.8)',
  },
  
  // Content
  content: {
    flex: 1,
    marginTop: -16,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 200,
  },
  
  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 16,
  },
  
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  searchIconContainer: {
    paddingLeft: 14,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#1F2937',
  },
  
  // Selected Customer
  selectedCustomer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(41, 52, 84, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(41, 52, 84, 0.2)',
    borderRadius: 14,
    padding: 12,
  },
  selectedCustomerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#293454',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  customerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 12,
    color: '#6B7280',
  },
  clearCustomerButton: {
    padding: 4,
  },
  
  // Recent Customers
  recentSection: {
    marginTop: 16,
  },
  recentLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  recentList: {
    gap: 12,
  },
  recentItem: {
    alignItems: 'center',
    width: 64,
  },
  recentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  recentAvatarNew: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
  },
  recentName: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  
  // Input Groups
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  
  // Amount Input
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  amountPrefix: {
    paddingLeft: 16,
  },
  amountPrefixText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  amountInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    fontSize: 28,
    fontWeight: '700',
    color: '#293454',
  },
  amountSuffix: {
    paddingRight: 16,
  },
  amountSuffixText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  
  // Attach Card
  attachCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  attachLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  attachIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  
  // Info Note
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 8,
  },
  infoNoteText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  
  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#293454',
  },
  submitButton: {
    backgroundColor: '#293454',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default CreateInvoiceScreen;
