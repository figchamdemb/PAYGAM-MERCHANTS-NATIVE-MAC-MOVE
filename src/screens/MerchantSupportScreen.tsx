/**
 * PAYGAM MERCHANT - MERCHANT SUPPORT SCREEN
 * Support and help center for merchants
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
  Linking,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const BackArrowIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SearchIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={2} />
    <Path d="M21 21l-4.3-4.3" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const PhoneIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#16A34A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EmailIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect width="20" height="16" x="2" y="4" rx="2" stroke={color} strokeWidth={2} />
    <Path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const WhatsAppIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#25D366' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChatIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#8B5CF6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const QuestionIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Circle cx="12" cy="17" r="1" fill={color} />
  </Svg>
);

const TicketIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#EC4899' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M2 9a3 3 0 013-3h14a3 3 0 013 3v0a3 3 0 00-3 3v0a3 3 0 003 3v0a3 3 0 01-3 3H5a3 3 0 01-3-3v0a3 3 0 003-3v0a3 3 0 00-3-3z" stroke={color} strokeWidth={2} />
    <Path d="M13 6v2M13 16v2M13 11v2" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const DocumentIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#06B6D4' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const AlertIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 9v4M12 17h.01" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRightIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CloseIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SendIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ==================== TYPES ====================
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
}

// ==================== MAIN COMPONENT ====================
const MerchantSupportScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [faqModalVisible, setFaqModalVisible] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketCategory, setTicketCategory] = useState('general');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const merchantType = route.params?.merchantType || 'general';

  // FAQ Data
  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I receive payments?',
      answer: 'You can receive payments through QR codes, payment links, or direct transfers. Go to "Receive" on your dashboard to generate a QR code or payment link. Share it with your customers and they can pay instantly using their PayGam wallet.',
      category: 'payments',
    },
    {
      id: '2',
      question: 'How long do settlements take?',
      answer: 'Settlement times vary by method:\n\n• Mobile Wallet (Africell, QMoney, Gamcel): Instant to 5 minutes\n• Bank Transfer: 24-48 business hours\n• Agent Cashout: Instant at any PayGam agent\n\nSettlements are processed automatically based on your settings.',
      category: 'settlements',
    },
    {
      id: '3',
      question: 'What are the transaction fees?',
      answer: 'PayGam offers competitive rates:\n\n• Receiving payments: 1.5% per transaction\n• Mobile wallet settlement: Free\n• Bank transfer: D25 flat fee\n• Agent cashout: 1% (paid by you or customer)\n\nCorporate merchants may qualify for volume discounts.',
      category: 'fees',
    },
    {
      id: '4',
      question: 'How do I change my PIN?',
      answer: 'To change your transaction PIN:\n\n1. Go to Settings > Security\n2. Tap "Change PIN"\n3. Enter your current PIN\n4. Enter and confirm your new PIN\n\nFor security, choose a PIN that\'s not easily guessable (avoid birthdays, 1234, etc.).',
      category: 'security',
    },
    {
      id: '5',
      question: 'How do I report a failed transaction?',
      answer: 'If a transaction failed but money was deducted:\n\n1. Go to History and find the transaction\n2. Tap on it and select "Report Issue"\n3. Provide details about the problem\n4. Our team will investigate within 24 hours\n\nYou can also contact us via WhatsApp for urgent issues.',
      category: 'transactions',
    },
    {
      id: '6',
      question: 'Can I have multiple staff accounts?',
      answer: 'Yes! Corporate and Premium merchants can create sub-accounts for staff:\n\n1. Go to Settings > Staff Management\n2. Tap "Add Staff"\n3. Set their permissions and limits\n4. They\'ll receive login credentials\n\nYou can track all staff transactions separately.',
      category: 'account',
    },
    {
      id: '7',
      question: 'How do I generate reports?',
      answer: 'To generate transaction reports:\n\n1. Go to History or Reports section\n2. Set your date range\n3. Choose filters (type, status, etc.)\n4. Tap "Generate Report"\n5. Download as PDF or Excel\n\nYou can also set up automatic daily/weekly reports via email.',
      category: 'reports',
    },
    {
      id: '8',
      question: 'What if I forgot my password?',
      answer: 'To reset your password:\n\n1. On the login screen, tap "Forgot Password"\n2. Enter your registered phone number\n3. You\'ll receive an OTP via SMS\n4. Create a new password\n\nIf you don\'t receive the OTP, contact support.',
      category: 'security',
    },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCallSupport = () => {
    Linking.openURL('tel:+2207777777').catch(() => {
      Alert.alert('Error', 'Unable to make call. Please dial +220 777-7777 manually.');
    });
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@paygam.gm?subject=Merchant Support Request').catch(() => {
      Alert.alert('Error', 'Unable to open email. Please email support@paygam.gm');
    });
  };

  const handleWhatsAppSupport = () => {
    Linking.openURL('https://wa.me/2207777777?text=Hello, I need help with my PayGam Merchant account.').catch(() => {
      Alert.alert('Error', 'Unable to open WhatsApp. Please message +220 777-7777');
    });
  };

  const handleLiveChat = () => {
    Alert.alert(
      'Live Chat',
      'Connecting you to a support agent...\n\nOur average response time is under 2 minutes during business hours (8AM - 10PM GMT).',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleSubmitTicket = () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    Alert.alert(
      'Ticket Submitted',
      'Your support ticket has been submitted successfully. Our team will respond within 24 hours.\n\nTicket #: TKT-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      [{ 
        text: 'OK', 
        onPress: () => {
          setTicketModalVisible(false);
          setTicketSubject('');
          setTicketMessage('');
          setTicketCategory('general');
        }
      }]
    );
  };

  const supportOptions: SupportOption[] = [
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      description: 'Chat with us instantly',
      icon: <WhatsAppIcon size={28} color="#25D366" />,
      action: handleWhatsAppSupport,
      color: '#DCFCE7',
    },
    {
      id: 'call',
      title: 'Call Us',
      description: '24/7 hotline',
      icon: <PhoneIcon size={28} color="#16A34A" />,
      action: handleCallSupport,
      color: '#D1FAE5',
    },
    {
      id: 'email',
      title: 'Email',
      description: 'Send us a message',
      icon: <EmailIcon size={28} color="#3B82F6" />,
      action: handleEmailSupport,
      color: '#DBEAFE',
    },
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'In-app support',
      icon: <ChatIcon size={28} color="#8B5CF6" />,
      action: handleLiveChat,
      color: '#EDE9FE',
    },
  ];

  const quickActions = [
    {
      id: 'ticket',
      title: 'Submit a Ticket',
      description: 'Report an issue or request help',
      icon: <TicketIcon size={22} color="#EC4899" />,
      action: () => setTicketModalVisible(true),
      color: '#FCE7F3',
    },
    {
      id: 'transaction',
      title: 'Transaction Issue',
      description: 'Report failed or wrong transaction',
      icon: <AlertIcon size={22} color="#EF4444" />,
      action: () => {
        setTicketCategory('transaction');
        setTicketSubject('Transaction Issue');
        setTicketModalVisible(true);
      },
      color: '#FEE2E2',
    },
    {
      id: 'guides',
      title: 'User Guides',
      description: 'Learn how to use PayGam',
      icon: <DocumentIcon size={22} color="#06B6D4" />,
      action: () => Alert.alert('Coming Soon', 'User guides will be available in the next update.'),
      color: '#CFFAFE',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16A34A" />
      
      {/* Header */}
      <LinearGradient colors={['#16A34A', '#15803D']} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <BackArrowIcon size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support Center</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <SearchIcon size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for help..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactGrid}>
            {supportOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.contactCard, { backgroundColor: option.color }]}
                onPress={option.action}
                activeOpacity={0.7}
              >
                <View style={styles.contactIconContainer}>
                  {option.icon}
                </View>
                <Text style={styles.contactTitle}>{option.title}</Text>
                <Text style={styles.contactDesc}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={action.action}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: action.color }]}>
                {action.icon}
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDesc}>{action.description}</Text>
              </View>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {filteredFaqs.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqCard}
              onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <View style={styles.faqQuestionContainer}>
                  <QuestionIcon size={18} color="#F59E0B" />
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                </View>
                <View style={[styles.chevronContainer, expandedFaq === faq.id && styles.chevronRotated]}>
                  <ChevronRightIcon size={18} color="#6B7280" />
                </View>
              </View>
              {expandedFaq === faq.id && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Support Hours */}
        <View style={styles.supportHoursCard}>
          <Text style={styles.supportHoursTitle}>Support Hours</Text>
          <View style={styles.supportHoursRow}>
            <Text style={styles.supportHoursLabel}>Phone & Chat:</Text>
            <Text style={styles.supportHoursValue}>24/7</Text>
          </View>
          <View style={styles.supportHoursRow}>
            <Text style={styles.supportHoursLabel}>Email Response:</Text>
            <Text style={styles.supportHoursValue}>Within 24 hours</Text>
          </View>
          <View style={styles.supportHoursRow}>
            <Text style={styles.supportHoursLabel}>Office Hours:</Text>
            <Text style={styles.supportHoursValue}>Mon-Fri, 8AM-6PM</Text>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Submit Ticket Modal */}
      <Modal
        visible={ticketModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTicketModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Support Ticket</Text>
              <TouchableOpacity onPress={() => setTicketModalVisible(false)}>
                <CloseIcon size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryContainer}>
                {['general', 'transaction', 'account', 'technical'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      ticketCategory === cat && styles.categoryChipActive,
                    ]}
                    onPress={() => setTicketCategory(cat)}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      ticketCategory === cat && styles.categoryChipTextActive,
                    ]}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Subject</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Brief description of your issue"
                placeholderTextColor="#9CA3AF"
                value={ticketSubject}
                onChangeText={setTicketSubject}
              />

              <Text style={styles.inputLabel}>Message</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Please provide details about your issue..."
                placeholderTextColor="#9CA3AF"
                value={ticketMessage}
                onChangeText={setTicketMessage}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </ScrollView>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitTicket}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#16A34A', '#15803D']}
                style={styles.submitGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <SendIcon size={18} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Submit Ticket</Text>
              </LinearGradient>
            </TouchableOpacity>
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
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },

  // Search
  searchContainer: {
    padding: 16,
    paddingTop: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    marginLeft: 10,
    paddingVertical: 0,
  },

  // Section
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },

  // Contact Grid
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactCard: {
    width: (width - 44) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  contactIconContainer: {
    marginBottom: 8,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  contactDesc: {
    fontSize: 12,
    color: '#6B7280',
  },

  // Action Cards
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  actionDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  // FAQ
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 10,
    flex: 1,
  },
  chevronContainer: {
    transform: [{ rotate: '90deg' }],
  },
  chevronRotated: {
    transform: [{ rotate: '270deg' }],
  },
  faqAnswer: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  // Support Hours
  supportHoursCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  supportHoursTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  supportHoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  supportHoursLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  supportHoursValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16A34A',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  categoryChipActive: {
    backgroundColor: '#16A34A',
  },
  categoryChipText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    margin: 20,
    marginTop: 0,
    borderRadius: 14,
    overflow: 'hidden',
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default MerchantSupportScreen;
