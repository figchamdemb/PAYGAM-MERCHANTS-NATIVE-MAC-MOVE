/**
 * ✅ WRITE FOR CITIZEN SCREEN - SENTINEL PATROL
 * 
 * Officers can write official statements on behalf of citizens
 * Features:
 * - Statement type selection (Report/Complaint/Witness/Affidavit)
 * - Citizen lookup or manual entry
 * - Voice notes and attachments
 * - Digital signature capture
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faChevronLeft,
  faFileAlt,
  faExclamationTriangle,
  faEye,
  faGavel,
  faSearch,
  faPlus,
  faMicrophone,
  faPaperclip,
  faCheckCircle,
  faUser,
  faIdCard,
  faPhone,
  faMapMarkerAlt,
  faChevronRight,
  faPen,
  faCamera,
} from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

// Types
interface StatementType {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
}

interface CitizenInfo {
  id: string;
  name: string;
  nationalId: string;
  phone: string;
  address: string;
}

const STATEMENT_TYPES: StatementType[] = [
  {
    id: 'report',
    title: 'Police Report',
    description: 'Official incident report',
    icon: faFileAlt,
    color: '#1E40AF',
    bgColor: '#DBEAFE',
  },
  {
    id: 'complaint',
    title: 'Complaint',
    description: 'Formal complaint filing',
    icon: faExclamationTriangle,
    color: '#DC2626',
    bgColor: '#FEE2E2',
  },
  {
    id: 'witness',
    title: 'Witness Statement',
    description: 'Eyewitness account',
    icon: faEye,
    color: '#7C3AED',
    bgColor: '#EDE9FE',
  },
  {
    id: 'affidavit',
    title: 'Affidavit',
    description: 'Sworn statement',
    icon: faGavel,
    color: '#059669',
    bgColor: '#D1FAE5',
  },
];

const WriteForCitizenScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  // State
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [citizenSearchQuery, setCitizenSearchQuery] = useState('');
  const [citizenInfo, setCitizenInfo] = useState<CitizenInfo | null>(null);
  const [isNewCitizen, setIsNewCitizen] = useState(false);
  const [statementText, setStatementText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [step, setStep] = useState(1);

  // Form state for new citizen
  const [newCitizen, setNewCitizen] = useState({
    fullName: '',
    nationalId: '',
    phone: '',
    address: '',
    dateOfBirth: '',
  });

  const handleCitizenSearch = () => {
    // Mock search - in real app, call API
    if (citizenSearchQuery.trim()) {
      setCitizenInfo({
        id: '1',
        name: 'Amadou Jallow',
        nationalId: 'GMB-12345678',
        phone: '+220 3456789',
        address: '45 Kairaba Avenue, Serrekunda',
      });
    }
  };

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
    setStep(2);
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    // Submit statement
    navigation.goBack();
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((s) => (
        <View key={s} style={styles.stepWrapper}>
          <View style={[
            styles.stepCircle,
            step >= s && styles.stepCircleActive,
            step > s && styles.stepCircleCompleted,
          ]}>
            {step > s ? (
              <FontAwesomeIcon icon={faCheckCircle} size={14} color="#FFFFFF" />
            ) : (
              <Text style={[
                styles.stepNumber,
                step >= s && styles.stepNumberActive,
              ]}>{s}</Text>
            )}
          </View>
          <Text style={[
            styles.stepLabel,
            step >= s && styles.stepLabelActive,
          ]}>
            {s === 1 ? 'Type' : s === 2 ? 'Citizen' : s === 3 ? 'Statement' : 'Review'}
          </Text>
          {s < 4 && (
            <View style={[
              styles.stepLine,
              step > s && styles.stepLineActive,
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Select Statement Type</Text>
      <Text style={styles.sectionSubtitle}>
        Choose the type of statement you are writing for the citizen
      </Text>

      <View style={styles.typeGrid}>
        {STATEMENT_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeCard,
              selectedType === type.id && styles.typeCardActive,
            ]}
            onPress={() => handleSelectType(type.id)}
          >
            <View style={[styles.typeIcon, { backgroundColor: type.bgColor }]}>
              <FontAwesomeIcon icon={type.icon} size={24} color={type.color} />
            </View>
            <Text style={styles.typeTitle}>{type.title}</Text>
            <Text style={styles.typeDescription}>{type.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Citizen Information</Text>
      <Text style={styles.sectionSubtitle}>
        Search for existing citizen or enter new details
      </Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesomeIcon icon={faSearch} size={18} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by National ID or Name..."
          placeholderTextColor="#94A3B8"
          value={citizenSearchQuery}
          onChangeText={setCitizenSearchQuery}
          onSubmitEditing={handleCitizenSearch}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleCitizenSearch}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* OR Divider */}
      <View style={styles.orDivider}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.orLine} />
      </View>

      {/* Add New Citizen Button */}
      <TouchableOpacity
        style={[styles.addNewButton, isNewCitizen && styles.addNewButtonActive]}
        onPress={() => {
          setIsNewCitizen(!isNewCitizen);
          setCitizenInfo(null);
        }}
      >
        <FontAwesomeIcon icon={faPlus} size={18} color={isNewCitizen ? '#FFFFFF' : '#1E40AF'} />
        <Text style={[styles.addNewButtonText, isNewCitizen && styles.addNewButtonTextActive]}>
          Add New Citizen
        </Text>
      </TouchableOpacity>

      {/* Citizen Info Display */}
      {citizenInfo && !isNewCitizen && (
        <View style={styles.citizenCard}>
          <View style={styles.citizenAvatar}>
            <FontAwesomeIcon icon={faUser} size={24} color="#1E40AF" />
          </View>
          <View style={styles.citizenDetails}>
            <Text style={styles.citizenName}>{citizenInfo.name}</Text>
            <View style={styles.citizenInfoRow}>
              <FontAwesomeIcon icon={faIdCard} size={12} color="#64748B" />
              <Text style={styles.citizenInfoText}>{citizenInfo.nationalId}</Text>
            </View>
            <View style={styles.citizenInfoRow}>
              <FontAwesomeIcon icon={faPhone} size={12} color="#64748B" />
              <Text style={styles.citizenInfoText}>{citizenInfo.phone}</Text>
            </View>
            <View style={styles.citizenInfoRow}>
              <FontAwesomeIcon icon={faMapMarkerAlt} size={12} color="#64748B" />
              <Text style={styles.citizenInfoText}>{citizenInfo.address}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.citizenSelectButton}>
            <FontAwesomeIcon icon={faCheckCircle} size={24} color="#059669" />
          </TouchableOpacity>
        </View>
      )}

      {/* New Citizen Form */}
      {isNewCitizen && (
        <View style={styles.newCitizenForm}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Full Name *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter full name"
              placeholderTextColor="#94A3B8"
              value={newCitizen.fullName}
              onChangeText={(text) => setNewCitizen({ ...newCitizen, fullName: text })}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>National ID *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter National ID"
              placeholderTextColor="#94A3B8"
              value={newCitizen.nationalId}
              onChangeText={(text) => setNewCitizen({ ...newCitizen, nationalId: text })}
            />
          </View>
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.formLabel}>Phone Number</Text>
              <TextInput
                style={styles.formInput}
                placeholder="+220"
                placeholderTextColor="#94A3B8"
                value={newCitizen.phone}
                onChangeText={(text) => setNewCitizen({ ...newCitizen, phone: text })}
                keyboardType="phone-pad"
              />
            </View>
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.formLabel}>Date of Birth</Text>
              <TextInput
                style={styles.formInput}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#94A3B8"
                value={newCitizen.dateOfBirth}
                onChangeText={(text) => setNewCitizen({ ...newCitizen, dateOfBirth: text })}
              />
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Address</Text>
            <TextInput
              style={[styles.formInput, styles.formInputMultiline]}
              placeholder="Enter full address"
              placeholderTextColor="#94A3B8"
              value={newCitizen.address}
              onChangeText={(text) => setNewCitizen({ ...newCitizen, address: text })}
              multiline
              numberOfLines={2}
            />
          </View>
        </View>
      )}

      {/* Next Button */}
      {(citizenInfo || (isNewCitizen && newCitizen.fullName)) && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>Continue to Statement</Text>
          <FontAwesomeIcon icon={faChevronRight} size={16} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Write Statement</Text>
      <Text style={styles.sectionSubtitle}>
        Record or type the citizen's statement
      </Text>

      {/* Recording Controls */}
      <View style={styles.recordingControls}>
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordButtonActive]}
          onPress={() => setIsRecording(!isRecording)}
        >
          <FontAwesomeIcon 
            icon={faMicrophone} 
            size={24} 
            color={isRecording ? '#FFFFFF' : '#1E40AF'} 
          />
        </TouchableOpacity>
        <Text style={styles.recordingHint}>
          {isRecording ? 'Recording... Tap to stop' : 'Tap to start voice recording'}
        </Text>
      </View>

      {/* Statement Text Area */}
      <View style={styles.statementContainer}>
        <TextInput
          style={styles.statementInput}
          placeholder="Type or dictate the citizen's statement here..."
          placeholderTextColor="#94A3B8"
          value={statementText}
          onChangeText={setStatementText}
          multiline
          textAlignVertical="top"
        />
        <View style={styles.statementFooter}>
          <Text style={styles.charCount}>{statementText.length} characters</Text>
          <View style={styles.attachmentButtons}>
            <TouchableOpacity style={styles.attachButton}>
              <FontAwesomeIcon icon={faCamera} size={18} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachButton}>
              <FontAwesomeIcon icon={faPaperclip} size={18} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Quick Templates */}
      <View style={styles.templatesSection}>
        <Text style={styles.templatesTitle}>Quick Templates</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['Robbery Report', 'Assault', 'Theft', 'Harassment', 'Property Damage'].map((template) => (
            <TouchableOpacity key={template} style={styles.templateChip}>
              <Text style={styles.templateChipText}>{template}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Next Button */}
      {statementText.length > 20 && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>Review Statement</Text>
          <FontAwesomeIcon icon={faChevronRight} size={16} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Review & Submit</Text>
      <Text style={styles.sectionSubtitle}>
        Review the statement before submission
      </Text>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Statement Type</Text>
          <Text style={styles.summaryValue}>
            {STATEMENT_TYPES.find(t => t.id === selectedType)?.title}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Citizen</Text>
          <Text style={styles.summaryValue}>
            {citizenInfo?.name || newCitizen.fullName}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Statement Length</Text>
          <Text style={styles.summaryValue}>{statementText.length} characters</Text>
        </View>
      </View>

      {/* Statement Preview */}
      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>Statement Preview</Text>
        <ScrollView style={styles.previewScroll}>
          <Text style={styles.previewText}>{statementText}</Text>
        </ScrollView>
      </View>

      {/* Signature Section */}
      <TouchableOpacity
        style={styles.signatureButton}
        onPress={() => setShowSignatureModal(true)}
      >
        <FontAwesomeIcon icon={faPen} size={20} color="#1E40AF" />
        <Text style={styles.signatureButtonText}>Capture Citizen Signature</Text>
        <FontAwesomeIcon icon={faChevronRight} size={16} color="#64748B" />
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <LinearGradient
          colors={['#1E40AF', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.submitGradient}
        >
          <FontAwesomeIcon icon={faCheckCircle} size={20} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>Submit Statement</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => step > 1 ? handlePrevStep() : navigation.goBack()}
        >
          <FontAwesomeIcon icon={faChevronLeft} size={20} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Write for Citizen</Text>
        <View style={styles.headerRight}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>
              {STATEMENT_TYPES.find(t => t.id === selectedType)?.title || 'New'}
            </Text>
          </View>
        </View>
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Signature Modal */}
      <Modal
        visible={showSignatureModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowSignatureModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.signatureModal}>
            <Text style={styles.modalTitle}>Capture Signature</Text>
            <View style={styles.signatureCanvas}>
              <Text style={styles.signatureHint}>Sign here</Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowSignatureModal(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={() => setShowSignatureModal(false)}
              >
                <Text style={styles.modalButtonConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  badgeContainer: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  stepWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#1E40AF',
  },
  stepCircleCompleted: {
    backgroundColor: '#059669',
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginLeft: 4,
    marginRight: 8,
  },
  stepLabelActive: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  stepLine: {
    width: 20,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: '#059669',
  },
  content: {
    flex: 1,
  },
  stepContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  typeCardActive: {
    borderColor: '#1E40AF',
    backgroundColor: '#EFF6FF',
  },
  typeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  typeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  searchButton: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  orText: {
    marginHorizontal: 16,
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#1E40AF',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  addNewButtonActive: {
    backgroundColor: '#1E40AF',
  },
  addNewButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
  addNewButtonTextActive: {
    color: '#FFFFFF',
  },
  citizenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#059669',
  },
  citizenAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  citizenDetails: {
    flex: 1,
    marginLeft: 12,
  },
  citizenName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  citizenInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  citizenInfoText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 6,
  },
  citizenSelectButton: {
    padding: 8,
  },
  newCitizenForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  formInputMultiline: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 20,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  recordButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonActive: {
    backgroundColor: '#DC2626',
  },
  recordingHint: {
    flex: 1,
    marginLeft: 16,
    fontSize: 14,
    color: '#64748B',
  },
  statementContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  statementInput: {
    minHeight: 200,
    padding: 16,
    fontSize: 14,
    lineHeight: 22,
    color: '#1F2937',
  },
  statementFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  charCount: {
    fontSize: 12,
    color: '#94A3B8',
  },
  attachmentButtons: {
    flexDirection: 'row',
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  templatesSection: {
    marginBottom: 20,
  },
  templatesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  templateChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  templateChipText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  previewScroll: {
    maxHeight: 150,
  },
  previewText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
  },
  signatureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  signatureButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  signatureModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  signatureCanvas: {
    height: 200,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signatureHint: {
    fontSize: 14,
    color: '#94A3B8',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  modalButtonConfirm: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
  },
  modalButtonConfirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default WriteForCitizenScreen;
