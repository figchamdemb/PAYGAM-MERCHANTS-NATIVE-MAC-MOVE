/**
 * TrackingScreen - Report Cases Interface
 * Based on HTML/Tailwind design provided
 * Features: Service cards with modals for different report types
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '@/config/colors';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const TrackingScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Modal visibility handlers
  const showModal = (modalType: string) => {
    setActiveModal(modalType);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setActiveModal(null));
  };

  // Service card data
  const services = [
    {
      id: 'report',
      title: 'Write a\nreport',
      icon: 'file-text',
      modal: 'report',
      color: '#EF4444', // red-400
    },
    {
      id: 'police',
      title: 'Give info\nto Police',
      icon: 'shield',
      modal: 'police',
      color: '#EF4444', // red-400
    },
    {
      id: 'blood',
      title: 'Donate\nblood',
      icon: 'heart',
      modal: 'blood',
      color: '#EF4444', // red-400
    },
    {
      id: 'immigration',
      title: 'Give Immigration\nInfo',
      icon: 'globe',
      modal: 'immigration',
      color: '#EF4444', // red-400
    },
    {
      id: 'water',
      title: 'Pay NAWAC\nwater bill',
      icon: 'credit-card',
      modal: 'water',
      color: '#EF4444', // red-400
    },
  ];

  const renderServiceCard = (service: typeof services[0]) => (
    <TouchableOpacity
      key={service.id}
      style={styles.serviceCard}
      onPress={() => showModal(service.modal)}
      activeOpacity={0.8}
    >
      <View style={[styles.serviceIconContainer, { backgroundColor: service.color }]}>
        <Icon name={service.icon} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.serviceText}>{service.title}</Text>
    </TouchableOpacity>
  );

  const renderModal = () => {
    if (!activeModal) return null;

    return (
      <Modal
        transparent
        visible={!!activeModal}
        animationType="fade"
        onRequestClose={hideModal}
      >
        <TouchableWithoutFeedback onPress={hideModal}>
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {activeModal === 'water' && <WaterBillModal onClose={hideModal} />}
                {activeModal === 'police' && <PoliceInfoModal onClose={hideModal} />}
                {activeModal === 'blood' && <BloodDonationModal onClose={hideModal} />}
                {activeModal === 'immigration' && <ImmigrationModal onClose={hideModal} />}
                {activeModal === 'report' && <ReportModal onClose={hideModal} />}
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.headerBackground }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Cases</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={[styles.mainContent, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>
        {/* Services Card */}
        <View style={[styles.servicesCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.servicesTitle, { color: theme.colors.text }]}>Other Services :</Text>
          
          <View style={styles.servicesGrid}>
            {services.map(renderServiceCard)}
          </View>
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} activeOpacity={0.7}>
          <View style={styles.footerIconContainer}>
            <Icon name="home" size={16} color="#6B7280" />
          </View>
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
      </View>

      {renderModal()}
    </SafeAreaView>
  );
};

// Water Bill Modal Component
const WaterBillModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <View style={styles.modalContainer}>
      {/* Modal Header */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>NAWAC Water Services</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="times" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Modal Content */}
      <ScrollView style={styles.modalBody}>
        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>
            <Icon name="bolt" size={14} color="#3B82F6" /> Quick Actions
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryActionButton}>
              <Icon name="camera" size={16} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.primaryButtonText}>Submit Reading</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryActionButton}>
              <Icon name="eye" size={16} color="#6B7280" style={styles.buttonIcon} />
              <Text style={styles.secondaryButtonText}>View Latest Bill</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Summary */}
        <View style={styles.accountSummarySection}>
          <Text style={styles.sectionTitle}>Account Summary</Text>
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
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Pending</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Police Info Modal Component
const PoliceInfoModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [incidentType, setIncidentType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Report to Police</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="times" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalBody}>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Incident Type</Text>
          <View style={styles.selectContainer}>
            <TextInput
              style={styles.selectInput}
              placeholder="Select incident type"
              value={incidentType}
              onChangeText={setIncidentType}
            />
            <Icon name="chevron-down" size={12} color="#6B7280" style={styles.selectIcon} />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Location</Text>
          <View style={styles.locationInputContainer}>
            <TextInput
              style={styles.locationInput}
              placeholder="Enter location"
              value={location}
              onChangeText={setLocation}
            />
            <TouchableOpacity style={styles.locationButton}>
              <Icon name="location-arrow" size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe what happened..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.infoBox}>
          <Icon name="info-circle" size={14} color="#3B82F6" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            This information will be sent to both the patrol team and the police station in real-time.
          </Text>
        </View>

        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton}>
            <Icon name="paper-plane" size={14} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.submitButtonText}>Send Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// Blood Donation Modal Component
const BloodDonationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Blood Donation</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="times" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalBody}>
        <View style={styles.prizeDrawSection}>
          <Text style={styles.prizeTitle}>
            <Icon name="gift" size={14} color="#DC2626" /> Monthly Prize Draw
          </Text>
          <Text style={styles.prizeText}>
            Every confirmed blood donation enters you into our monthly prize draw. Prizes include gift cards, electronics, and more!
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Select Donation Center</Text>
        
        <View style={styles.centerCard}>
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>0.8 mi</Text>
          </View>
          <Text style={styles.centerName}>Central Hospital</Text>
          <Text style={styles.centerAddress}>
            <Icon name="map-marker" size={12} color="#6B7280" /> 123 Main St, Banjul
          </Text>
        </View>

        <View style={styles.centerCard}>
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>1.2 mi</Text>
          </View>
          <Text style={styles.centerName}>Memorial Medical Center</Text>
          <Text style={styles.centerAddress}>
            <Icon name="map-marker" size={12} color="#6B7280" /> 456 Oak Ave, Serrekunda
          </Text>
        </View>

        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Register to Donate</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Immigration Modal Component
const ImmigrationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Immigration Report</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="times" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalBody}>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Report Type</Text>
          <View style={styles.selectContainer}>
            <TextInput
              style={styles.selectInput}
              placeholder="Select report type"
              value={reportType}
              onChangeText={setReportType}
            />
            <Icon name="chevron-down" size={12} color="#6B7280" style={styles.selectIcon} />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe the immigration matter..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.infoBox}>
          <Icon name="lock" size={14} color="#10B981" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            This information will be sent to the immigration department. Your report will be handled confidentially.
          </Text>
        </View>

        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton}>
            <Icon name="paper-plane" size={14} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// Report Modal Component (Write Report)
const ReportModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Write Report</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="times" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalBody}>
        <Text style={styles.modalDescription}>
          Create a detailed report for your case. This will be submitted to the relevant authorities.
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Report Title</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter report title"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Provide detailed description..."
            multiline
            numberOfLines={6}
          />
        </View>

        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // gray-50
  },
  header: {
    backgroundColor: '#B45309', // amber-700
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    marginRight: 16,
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
    borderColor: '#F3F4F6', // gray-100
  },
  servicesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937', // gray-800
    marginBottom: 32,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  serviceCard: {
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
    color: '#4B5563', // gray-600
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB', // gray-200
    padding: 8,
    alignItems: 'center',
    paddingBottom: 24, // safe area
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
    backgroundColor: '#F3F4F6', // gray-100
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280', // gray-500
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6', // gray-100
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937', // gray-800
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  modalBody: {
    padding: 20,
  },
  // Form Styles
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280', // gray-500
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#F9FAFB', // gray-50
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-200
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  textArea: {
    backgroundColor: '#F9FAFB', // gray-50
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-200
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  selectContainer: {
    position: 'relative',
  },
  selectInput: {
    backgroundColor: '#F9FAFB', // gray-50
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-200
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    paddingRight: 40,
  },
  selectIcon: {
    position: 'absolute',
    right: 12,
    top: 16,
  },
  locationInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  locationInput: {
    flex: 1,
    backgroundColor: '#F9FAFB', // gray-50
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-200
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  locationButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-200
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Action Buttons
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-200
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280', // gray-600
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: '#3B82F6', // blue-600
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  buttonIcon: {
    marginRight: 8,
  },
  // Info Box
  infoBox: {
    backgroundColor: '#EFF6FF', // blue-50
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 16,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    fontSize: 12,
    color: '#1E40AF', // blue-700
    lineHeight: 16,
    flex: 1,
  },
  // Section Styles
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937', // gray-800
    marginBottom: 12,
  },
  quickActionsSection: {
    backgroundColor: '#EFF6FF', // blue-50
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE', // blue-100
    marginBottom: 24,
  },
  actionButtons: {
    gap: 12,
  },
  primaryActionButton: {
    flexDirection: 'row',
    backgroundColor: '#EF4444', // red-500
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
    borderColor: '#E5E7EB', // gray-200
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151', // gray-700
  },
  accountSummarySection: {
    backgroundColor: '#F9FAFB', // gray-50
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6', // gray-100
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // gray-200
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280', // gray-500
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827', // gray-900
  },
  statusBadge: {
    backgroundColor: '#FEF3C7', // orange-100
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#92400E', // orange-700
    textTransform: 'uppercase',
  },
  // Blood Donation Styles
  prizeDrawSection: {
    backgroundColor: '#FEF2F2', // red-50
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2', // red-100
    marginBottom: 24,
  },
  prizeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626', // red-700
    marginBottom: 8,
  },
  prizeText: {
    fontSize: 12,
    color: '#DC2626', // red-600
    lineHeight: 16,
  },
  centerCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-200
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    position: 'relative',
  },
  distanceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#F3F4F6', // gray-100
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151', // gray-600
  },
  centerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827', // gray-900
    marginBottom: 4,
  },
  centerAddress: {
    fontSize: 12,
    color: '#6B7280', // gray-500
  },
  registerButton: {
    backgroundColor: '#EF4444', // red-500
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Report Modal Styles
  modalDescription: {
    fontSize: 14,
    color: '#6B7280', // gray-600
    marginBottom: 20,
    lineHeight: 20,
  },
});

export default TrackingScreen;
