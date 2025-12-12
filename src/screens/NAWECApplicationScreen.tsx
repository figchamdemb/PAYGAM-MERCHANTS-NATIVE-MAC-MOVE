import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
  Animated,
  Modal,
  Dimensions,
  Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faUserCircle,
  faLock,
  faBolt,
  faFaucet,
  faCheckCircle,
  faChevronDown,
  faMapMarkerAlt,
  faFileUpload,
  faIdCard,
  faCloudUploadAlt,
  faArrowRight,
  faInfoCircle,
  faCheck,
  faCircleNotch,
} from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const NAWECApplicationScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const [serviceType, setServiceType] = useState<'electricity' | 'water'>('electricity');
  const [meterType, setMeterType] = useState('Prepaid (Cash Power)');
  const [address, setAddress] = useState('Kotu West, Near Brusubi Turn Table');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const successScaleAnim = useRef(new Animated.Value(0.5)).current;
  const successFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (showSummaryModal) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 90,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showSummaryModal]);

  useEffect(() => {
    if (showSuccessModal) {
      Animated.parallel([
        Animated.spring(successScaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 15,
        }),
        Animated.timing(successFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showSuccessModal]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSummaryModal(false);
      setShowSuccessModal(true);
    }, 1500);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#B45309', '#92400e']} // amber-700 to amber-800 roughly
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <FontAwesomeIcon icon={faArrowLeft} size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Application</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Progress Steps */}
          <View style={styles.progressContainer}>
            <View style={styles.stepItem}>
              <View style={styles.stepCircleActive}>
                <Text style={styles.stepNumberActive}>1</Text>
              </View>
              <Text style={styles.stepTextActive}>Details</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepItem}>
              <View style={styles.stepCircleInactive}>
                <Text style={styles.stepNumberInactive}>2</Text>
              </View>
              <Text style={styles.stepTextInactive}>Review</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepItem}>
              <View style={styles.stepCircleInactive}>
                <Text style={styles.stepNumberInactive}>3</Text>
              </View>
              <Text style={styles.stepTextInactive}>Done</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <KeyboardAwareScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={Platform.OS === 'ios' ? 100 : 120}
        keyboardOpeningTime={0}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          
          {/* Applicant Information */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <FontAwesomeIcon icon={faUserCircle} size={20} color="#B45309" />
                <Text style={styles.cardTitle}>Applicant Information</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value="Lamin Jatta"
                  editable={false}
                />
                <FontAwesomeIcon icon={faLock} size={14} color="#9CA3AF" style={styles.inputIcon} />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.label}>NIN Number</Text>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value="19902839102"
                  editable={false}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value="+220 776 5432"
                  editable={false}
                />
              </View>
            </View>
          </View>

          {/* Service Selection */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <FontAwesomeIcon icon={faBolt} size={20} color="#B45309" />
                <Text style={styles.cardTitle}>Service Details</Text>
              </View>
            </View>

            {/* Service Type Toggle */}
            <View style={styles.serviceToggleContainer}>
              <TouchableOpacity
                style={[
                  styles.serviceOption,
                  serviceType === 'electricity' && styles.serviceOptionActiveElectricity
                ]}
                onPress={() => setServiceType('electricity')}
                activeOpacity={0.9}
              >
                <View style={styles.serviceIconCircle}>
                  <FontAwesomeIcon icon={faBolt} size={20} color="#B45309" />
                </View>
                <Text style={[
                  styles.serviceOptionText,
                  serviceType === 'electricity' && styles.serviceOptionTextActiveElectricity
                ]}>Electricity</Text>
                {serviceType === 'electricity' && (
                  <View style={styles.checkIcon}>
                    <FontAwesomeIcon icon={faCheckCircle} size={16} color="#B45309" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.serviceOption,
                  serviceType === 'water' && styles.serviceOptionActiveWater
                ]}
                onPress={() => setServiceType('water')}
                activeOpacity={0.9}
              >
                <View style={styles.serviceIconCircle}>
                  <FontAwesomeIcon icon={faFaucet} size={20} color="#3B82F6" />
                </View>
                <Text style={[
                  styles.serviceOptionText,
                  serviceType === 'water' && styles.serviceOptionTextActiveWater
                ]}>Water</Text>
                {serviceType === 'water' && (
                  <View style={styles.checkIcon}>
                    <FontAwesomeIcon icon={faCheckCircle} size={16} color="#3B82F6" />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Meter Type</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={meterType}
                  editable={false} // For now, just display
                />
                <FontAwesomeIcon icon={faChevronDown} size={14} color="#9CA3AF" style={styles.inputIcon} />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Installation Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={2}
                placeholder="Enter detailed address or landmark..."
              />
              <TouchableOpacity style={styles.locationButton}>
                <FontAwesomeIcon icon={faMapMarkerAlt} size={12} color="#B45309" />
                <Text style={styles.locationButtonText}>Use Current Location</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Required Documents */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <FontAwesomeIcon icon={faFileUpload} size={20} color="#B45309" />
                <Text style={styles.cardTitle}>Documents</Text>
              </View>
            </View>

            <View style={styles.documentList}>
              {/* ID Uploaded */}
              <View style={styles.documentItemUploaded}>
                <View style={styles.documentInfo}>
                  <View style={styles.documentIconUploaded}>
                    <FontAwesomeIcon icon={faIdCard} size={20} color="#16A34A" />
                  </View>
                  <View>
                    <Text style={styles.documentTitle}>National ID Card</Text>
                    <Text style={styles.documentSubtitle}>Uploaded from Profile</Text>
                  </View>
                </View>
                <FontAwesomeIcon icon={faCheckCircle} size={20} color="#22C55E" />
              </View>

              {/* Property Doc Upload */}
              <TouchableOpacity style={styles.uploadBox}>
                <View style={styles.uploadIconCircle}>
                  <FontAwesomeIcon icon={faCloudUploadAlt} size={20} color="#B45309" />
                </View>
                <Text style={styles.uploadTitle}>Upload Property Document</Text>
                <Text style={styles.uploadSubtitle}>Title Deed or Tenancy Agreement (PDF/JPG)</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Spacer for bottom bar */}
          <View style={{ height: 120 }} />
        </Animated.View>
      </KeyboardAwareScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.feeLabel}>Application Fee</Text>
          <Text style={styles.feeAmount}>D 500.00</Text>
        </View>
        <TouchableOpacity 
          style={styles.reviewButton}
          onPress={() => setShowSummaryModal(true)}
        >
          <Text style={styles.reviewButtonText}>Review Application</Text>
          <FontAwesomeIcon icon={faArrowRight} size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Summary Modal */}
      {showSummaryModal && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1}
            onPress={() => setShowSummaryModal(false)}
          />
          <Animated.View 
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Confirm Application</Text>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service Type</Text>
                <Text style={styles.summaryValue}>
                  {serviceType === 'electricity' ? 'Electricity (Prepaid)' : 'Water Supply'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Applicant</Text>
                <Text style={styles.summaryValue}>Lamin Jatta</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Location</Text>
                <Text style={styles.summaryValue} numberOfLines={1}>{address}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Fee</Text>
                <Text style={styles.summaryTotal}>D 500.00</Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <FontAwesomeIcon icon={faInfoCircle} size={14} color="#B45309" style={{ marginTop: 2 }} />
              <Text style={styles.infoText}>
                By clicking confirm, you agree to NAWEC's terms of service. The application fee will be deducted from your wallet.
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelModalButton}
                onPress={() => setShowSummaryModal(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <FontAwesomeIcon icon={faCircleNotch} size={20} color="#FFFFFF" /> // Should animate spin
                ) : (
                  <>
                    <Text style={styles.confirmButtonText}>Confirm & Submit</Text>
                    <FontAwesomeIcon icon={faCheck} size={16} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <View style={styles.successModalOverlay}>
          <Animated.View 
            style={[
              styles.successContent,
              { 
                opacity: successFadeAnim,
                transform: [{ scale: successScaleAnim }] 
              }
            ]}
          >
            <View style={styles.successIconContainer}>
              <FontAwesomeIcon icon={faCheck} size={40} color="#16A34A" />
            </View>
            
            <Text style={styles.successTitle}>Application Submitted!</Text>
            <Text style={styles.successMessage}>
              Your request for a new {serviceType === 'electricity' ? 'Electricity Meter' : 'Water Connection'} has been received successfully.
            </Text>

            <View style={styles.trackingBox}>
              <Text style={styles.trackingLabel}>Tracking ID</Text>
              <Text style={styles.trackingId}>NWC-2023-8492</Text>
            </View>

            <TouchableOpacity style={styles.trackStatusButton}>
              <Text style={styles.trackStatusText}>Track Status</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleCloseSuccess} style={styles.homeLink}>
              <Text style={styles.homeLinkText}>Return to Home</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // gray-50
  },
  headerContainer: {
    backgroundColor: '#B45309',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  stepItem: {
    alignItems: 'center',
    gap: 4,
  },
  stepCircleActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepNumberActive: {
    color: '#B45309',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepTextActive: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '500',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  stepCircleInactive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberInactive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepTextInactive: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    marginTop: -24,
    zIndex: 20,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#7C2D12', // orange-900
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6', // gray-100
    paddingBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B', // slate-800
  },
  verifiedBadge: {
    backgroundColor: '#DCFCE7', // green-100
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#15803D', // green-700
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280', // gray-500
    marginBottom: 4,
    marginLeft: 4,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#F9FAFB', // gray-50
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-200
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563', // gray-600
  },
  inputDisabled: {
    color: '#4B5563',
    backgroundColor: '#F9FAFB',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  row: {
    flexDirection: 'row',
  },
  serviceToggleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  serviceOption: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  serviceOptionActiveElectricity: {
    backgroundColor: '#FFF7ED', // orange-50
    borderColor: '#B45309',
  },
  serviceOptionActiveWater: {
    backgroundColor: '#EFF6FF', // blue-50
    borderColor: '#3B82F6',
  },
  serviceIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  serviceOptionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
  },
  serviceOptionTextActiveElectricity: {
    color: '#B45309',
  },
  serviceOptionTextActiveWater: {
    color: '#3B82F6',
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
    height: 80,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  locationButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B45309',
  },
  documentList: {
    gap: 12,
  },
  documentItemUploaded: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4', // green-50
    borderWidth: 1,
    borderColor: '#BBF7D0', // green-200
    borderRadius: 12,
    padding: 12,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  documentIconUploaded: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  documentTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  documentSubtitle: {
    fontSize: 10,
    color: '#16A34A', // green-600
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  uploadIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
  },
  uploadSubtitle: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 10,
    zIndex: 30,
  },
  feeLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  feeAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  reviewButton: {
    backgroundColor: '#B45309',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#FED7AA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  reviewButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)', // slate-900/60
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 24,
  },
  modalHandle: {
    width: 48,
    height: 6,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    maxWidth: '60%',
    textAlign: 'right',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B45309',
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFF7ED',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelModalButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelModalButtonText: {
    color: '#4B5563',
    fontWeight: 'bold',
    fontSize: 14,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#B45309',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#FED7AA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  successModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  successContent: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  successIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  trackingBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 32,
    alignItems: 'center',
  },
  trackingLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  trackingId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  trackStatusButton: {
    width: '100%',
    backgroundColor: '#B45309',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#FED7AA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  trackStatusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  homeLink: {
    paddingVertical: 8,
  },
  homeLinkText: {
    color: '#6B7280',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default NAWECApplicationScreen;
