import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faUserCircle,
  faFileContract,
  faCheckCircle,
  faArrowRight,
  faCircleNotch,
  faTimes,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faHome,
  faStore,
  faFaucet,
  faBolt,
} from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';

interface NAWECApplicationSummaryScreenProps {
  route?: {
    params?: {
      serviceType?: string;
      propertyType?: string;
      address?: string;
      notes?: string;
    };
  };
}

const NAWECApplicationSummaryScreen: React.FC<NAWECApplicationSummaryScreenProps> = ({ 
  route 
}) => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [isChecked, setIsChecked] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const serviceType = route?.params?.serviceType || 'Water Meter';
  const propertyType = route?.params?.propertyType || 'Residential';
  const address = route?.params?.address || '12 Kairaba Avenue, Serrekunda';
  const notes = route?.params?.notes || 'Near the big mango tree';

  useEffect(() => {
    if (showSuccessModal) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showSuccessModal]);

  const handleSubmit = async () => {
    if (!isChecked) {
      Alert.alert('Please accept the terms and conditions');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setTrackingId('REQ-' + Math.floor(100000 + Math.random() * 900000));
      setShowSuccessModal(true);
    }, 2000);
  };

  const handleTrackStatus = () => {
    setShowSuccessModal(false);
    navigation.navigate('Tracking' as never);
  };

  const handleGoHome = () => {
    setShowSuccessModal(false);
    navigation.navigate('Home' as never);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const getServiceIcon = () => {
    return serviceType.includes('Water') ? faFaucet : faBolt;
  };

  const getServiceColor = () => {
    return serviceType.includes('Water') ? '#3B82F6' : '#F59E0B';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />
      
      {/* Header */}
      <LinearGradient
        colors={['#B45309', '#92400e']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleCancel}
          >
            <FontAwesomeIcon icon={faArrowLeft} size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Application</Text>
          <View style={{ width: 40 }} />
        </View>
        
        {/* Progress Steps */}
        <View style={styles.progressContainer}>
          <View style={styles.stepContainer}>
            <View style={styles.stepCompleted}>
              <FontAwesomeIcon icon={faCheckCircle} size={12} color="#FFFFFF" />
            </View>
            <View style={styles.stepLineCompleted} />
          </View>
          <View style={styles.stepContainer}>
            <View style={styles.stepActive}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <View style={styles.stepLineActive} />
          </View>
          <View style={styles.stepInactive}>
            <Text style={styles.stepNumberInactive}>3</Text>
          </View>
        </View>
        <Text style={styles.stepLabel}>Step 2: Review & Confirm</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Applicant Details Card (Pre-filled) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              <FontAwesomeIcon icon={faUserCircle} size={16} color="#B45309" /> Applicant Details
            </Text>
            <View style={styles.verifiedBadge}>
              <FontAwesomeIcon icon={faCheckCircle} size={10} color="#10B981" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Full Name</Text>
              <Text style={styles.detailValue}>Lamin Darboe</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>NIN Number</Text>
              <Text style={styles.detailValue}>19902345678</Text>
            </View>
            <View style={styles.detailItemFull}>
              <Text style={styles.detailLabel}>Registered Address</Text>
              <Text style={styles.detailValue}>Plot 45, Kairaba Avenue, Serrekunda, KSMD</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>+220 776 5432</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>lamin.d@email.com</Text>
            </View>
          </View>
        </View>

        {/* Service Application Details */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              <FontAwesomeIcon icon={faFileContract} size={16} color="#3B82F6" /> Service Request
            </Text>
            <TouchableOpacity>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.serviceCard}>
            <View style={styles.serviceIconContainer}>
              <FontAwesomeIcon icon={getServiceIcon()} size={24} color={getServiceColor()} />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceType}>{serviceType} Connection</Text>
              <Text style={styles.serviceDescription}>
                {serviceType.includes('Water') ? 'Standard residential meter installation' : 'New prepaid meter installation'}
              </Text>
            </View>
          </View>

          <View style={styles.detailItemFull}>
            <Text style={styles.detailLabel}>Installation Address</Text>
            <Text style={styles.detailValue}>{address}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Property Type</Text>
            <Text style={styles.detailValue}>{propertyType} (Owner Occupied)</Text>
          </View>

          {notes && (
            <View style={styles.detailItemFull}>
              <Text style={styles.detailLabel}>Additional Notes</Text>
              <Text style={styles.detailValue}>{notes}</Text>
            </View>
          )}
        </View>

        {/* Cost Breakdown */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          
          <View style={styles.costBreakdown}>
            <View style={styles.costItem}>
              <Text style={styles.costLabel}>Application Fee</Text>
              <Text style={styles.costValue}>D 500.00</Text>
            </View>
            <View style={styles.costItem}>
              <Text style={styles.costLabel}>Site Inspection</Text>
              <Text style={styles.costValue}>D 250.00</Text>
            </View>
            <View style={styles.costItem}>
              <Text style={styles.costLabel}>VAT (15%)</Text>
              <Text style={styles.costValue}>D 112.50</Text>
            </View>
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Due</Text>
            <Text style={styles.totalValue}>D 862.50</Text>
          </View>
        </View>

        {/* Terms Checkbox */}
        <View style={styles.termsContainer}>
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setIsChecked(!isChecked)}
          >
            <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
              {isChecked && <FontAwesomeIcon icon={faCheckCircle} size={12} color="#FFFFFF" />}
            </View>
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I certify that the information provided is correct and I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text> of NAWEC.
          </Text>
        </View>

      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faCircleNotch} size={16} color="#FFFFFF" style={styles.loadingIcon} />
                <Text style={styles.submitButtonText}>Processing...</Text>
              </>
            ) : (
              <>
                <Text style={styles.submitButtonText}>Confirm & Submit</Text>
                <FontAwesomeIcon icon={faArrowRight} size={16} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="none"
        onRequestClose={handleGoHome}
      >
        <Animated.View 
          style={[
            styles.modalOverlay,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleGoHome}
          />
          
          <Animated.View 
            style={[
              styles.modalContent,
              {
                transform: [
                  { scale: scaleAnim },
                ],
              }
            ]}
          >
            <View style={styles.successIconContainer}>
              <View style={styles.successIconBackground}>
                <FontAwesomeIcon icon={faCheckCircle} size={32} color="#10B981" />
              </View>
            </View>
            
            <Text style={styles.modalTitle}>Application Submitted!</Text>
            <Text style={styles.modalSubtitle}>
              Your request for a new {serviceType} has been successfully submitted.
            </Text>

            <View style={styles.trackingContainer}>
              <Text style={styles.trackingLabel}>Tracking ID</Text>
              <Text style={styles.trackingId}>{trackingId}</Text>
            </View>

            <TouchableOpacity 
              style={styles.trackButton}
              onPress={handleTrackStatus}
            >
              <Text style={styles.trackButtonText}>Track Status</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.homeButton}
              onPress={handleGoHome}
            >
              <Text style={styles.homeButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerButton: {
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
    letterSpacing: 0.5,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCompleted: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLineCompleted: {
    width: 32,
    height: 2,
    backgroundColor: 'rgba(16, 185, 129, 0.5)',
    marginHorizontal: 4,
  },
  stepActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  stepLineActive: {
    width: 32,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  stepInactive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberInactive: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  stepLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verifiedText: {
    fontSize: 10,
    color: '#065F46',
    fontWeight: '600',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
  },
  detailItemFull: {
    width: '100%',
  },
  detailLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceType: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 12,
    color: '#64748B',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  costBreakdown: {
    marginBottom: 16,
  },
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  costLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  costValue: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '600',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    borderStyle: 'dashed',
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#B45309',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  checkboxContainer: {
    padding: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#B45309',
    borderColor: '#B45309',
  },
  termsText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    flex: 1,
  },
  termsLink: {
    color: '#B45309',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 20,
  },
  footerContent: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#B45309',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  submitButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadingIcon: {
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    margin: 20,
    maxWidth: 320,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successIconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  trackingContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  trackingLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  trackingId: {
    fontSize: 18,
    fontWeight: '700',
    color: '#B45309',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 2,
  },
  trackButton: {
    backgroundColor: '#B45309',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  trackButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  homeButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  homeButtonText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
});

export default NAWECApplicationSummaryScreen;
