/**
 * ✅ IMMIGRATION - CASE REPORT SCREEN
 * Multi-step immigration case report creation form
 * Immigration Department Only
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faPassport,
  faBell,
  faChevronDown,
  faChevronUp,
  faArrowRight,
  faCalendar,
  faClock,
  faLocationDot,
  faCrosshairs,
  faIdCard,
  faUserShield,
  faFileContract,
} from '@fortawesome/free-solid-svg-icons';

const { width } = Dimensions.get('window');

// Types
interface CaseType {
  id: string;
  label: string;
}

const CASE_TYPES: CaseType[] = [
  { id: 'passport_fraud', label: 'Passport Fraud' },
  { id: 'visa_violation', label: 'Visa Violation' },
  { id: 'overstay', label: 'Overstay / Expired Permit' },
  { id: 'illegal_entry', label: 'Illegal Entry' },
  { id: 'human_trafficking', label: 'Human Trafficking' },
  { id: 'document_forgery', label: 'Document Forgery' },
  { id: 'smuggling', label: 'Smuggling' },
  { id: 'other', label: 'Other Violation' },
];

const ImmigrationCaseReportScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCaseType, setSelectedCaseType] = useState('');
  const [showCaseDropdown, setShowCaseDropdown] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [caseDescription, setCaseDescription] = useState('');
  const [priority, setPriority] = useState<'routine' | 'priority' | 'urgent'>('priority');
  const [activeTab, setActiveTab] = useState<'drafts' | 'new' | 'history'>('new');

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      Alert.alert('Case Submitted', 'Immigration case report has been submitted successfully.');
    }
  };

  const handleSaveDraft = () => {
    Alert.alert('Draft Saved', 'Immigration case report draft has been saved.');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <FontAwesomeIcon icon={faPassport} size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Immigration Control</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <FontAwesomeIcon icon={faBell} size={20} color="#FFFFFF" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <View style={styles.avatarSmall}>
              <Text style={styles.avatarText}>IO</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'drafts' && styles.tabActive]}
            onPress={() => setActiveTab('drafts')}
          >
            <Text style={[styles.tabText, activeTab === 'drafts' && styles.tabTextActive]}>
              Drafts <Text style={styles.tabBadge}>2</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'new' && styles.tabActive]}
            onPress={() => setActiveTab('new')}
          >
            <Text style={[styles.tabText, activeTab === 'new' && styles.tabTextActive]}>New Case</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.tabActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>History</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stepper */}
        <View style={styles.stepper}>
          <View style={styles.stepperItems}>
            {/* Step 1 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, currentStep >= 1 && styles.stepCircleActive]}>
                <Text style={[styles.stepNumber, currentStep >= 1 && styles.stepNumberActive]}>1</Text>
              </View>
              <Text style={[styles.stepLabel, currentStep >= 1 && styles.stepLabelActive]}>Case Info</Text>
            </View>

            <View style={styles.stepConnector} />

            {/* Step 2 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, currentStep >= 2 && styles.stepCircleActive]}>
                <Text style={[styles.stepNumber, currentStep >= 2 && styles.stepNumberActive]}>2</Text>
              </View>
              <Text style={[styles.stepLabel, currentStep >= 2 && styles.stepLabelActive]}>Subject</Text>
            </View>

            <View style={styles.stepConnector} />

            {/* Step 3 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, currentStep >= 3 && styles.stepCircleActive]}>
                <Text style={[styles.stepNumber, currentStep >= 3 && styles.stepNumberActive]}>3</Text>
              </View>
              <Text style={[styles.stepLabel, currentStep >= 3 && styles.stepLabelActive]}>Actions</Text>
            </View>
          </View>
        </View>

        {/* Form Sections */}
        <View style={styles.formSections}>
          {/* Section 1: Case Details */}
          <View style={[styles.section, currentStep === 1 && styles.sectionExpanded]}>
            <TouchableOpacity style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <FontAwesomeIcon icon={faIdCard} size={18} color="#1E40AF" />
                <Text style={styles.sectionTitle}>Case Details</Text>
              </View>
              <FontAwesomeIcon 
                icon={currentStep === 1 ? faChevronUp : faChevronDown} 
                size={18} 
                color="#9CA3AF" 
              />
            </TouchableOpacity>

            {currentStep === 1 && (
              <View style={styles.sectionContent}>
                {/* Case Type */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Violation Type</Text>
                  <TouchableOpacity
                    style={styles.select}
                    onPress={() => setShowCaseDropdown(!showCaseDropdown)}
                  >
                    <Text style={selectedCaseType ? styles.selectValue : styles.selectPlaceholder}>
                      {selectedCaseType
                        ? CASE_TYPES.find((t) => t.id === selectedCaseType)?.label
                        : 'Select violation type...'}
                    </Text>
                    <FontAwesomeIcon icon={faChevronDown} size={14} color="#6B7280" />
                  </TouchableOpacity>
                  {showCaseDropdown && (
                    <View style={styles.dropdown}>
                      {CASE_TYPES.map((type) => (
                        <TouchableOpacity
                          key={type.id}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedCaseType(type.id);
                            setShowCaseDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{type.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Date & Time */}
                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Date</Text>
                    <View style={styles.inputWithIcon}>
                      <FontAwesomeIcon icon={faCalendar} size={16} color="#9CA3AF" />
                      <TextInput
                        style={styles.inputField}
                        value={date}
                        onChangeText={setDate}
                        placeholder="MM/DD/YYYY"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Time</Text>
                    <View style={styles.inputWithIcon}>
                      <FontAwesomeIcon icon={faClock} size={16} color="#9CA3AF" />
                      <TextInput
                        style={styles.inputField}
                        value={time}
                        onChangeText={setTime}
                        placeholder="HH:MM"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                  </View>
                </View>

                {/* Location */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Location / Border Post</Text>
                  <View style={styles.locationRow}>
                    <View style={[styles.inputWithIcon, { flex: 1 }]}>
                      <FontAwesomeIcon icon={faLocationDot} size={16} color="#9CA3AF" />
                      <TextInput
                        style={styles.inputField}
                        value={location}
                        onChangeText={setLocation}
                        placeholder="Enter location or border post name"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                    <TouchableOpacity style={styles.gpsButton}>
                      <FontAwesomeIcon icon={faCrosshairs} size={18} color="#1E40AF" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Description */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Case Description</Text>
                  <TextInput
                    style={styles.textarea}
                    value={caseDescription}
                    onChangeText={setCaseDescription}
                    placeholder="Describe the violation, circumstances, and evidence found..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Priority */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Case Priority</Text>
                  <View style={styles.priorityRow}>
                    <TouchableOpacity
                      style={[styles.priorityButton, priority === 'routine' && styles.priorityRoutine]}
                      onPress={() => setPriority('routine')}
                    >
                      <Text style={[styles.priorityText, priority === 'routine' && styles.priorityTextRoutine]}>Routine</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.priorityButton, priority === 'priority' && styles.priorityPriority]}
                      onPress={() => setPriority('priority')}
                    >
                      <Text style={[styles.priorityText, priority === 'priority' && styles.priorityTextPriority]}>
                        Priority
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.priorityButton, priority === 'urgent' && styles.priorityUrgent]}
                      onPress={() => setPriority('urgent')}
                    >
                      <Text style={[styles.priorityText, priority === 'urgent' && styles.priorityTextUrgent]}>Urgent</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Section 2: Subject Information */}
          <View style={[styles.section, styles.sectionCollapsed, currentStep >= 2 && styles.sectionExpanded]}>
            <TouchableOpacity style={styles.sectionHeaderCollapsed}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.stepNumberSmall}>
                  <FontAwesomeIcon icon={faUserShield} size={12} color="#1E40AF" />
                </View>
                <Text style={styles.sectionTitleCollapsed}>Subject Information</Text>
              </View>
              <FontAwesomeIcon icon={faChevronDown} size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Section 3: Actions Taken */}
          <View style={[styles.section, styles.sectionCollapsed, currentStep >= 3 && styles.sectionExpanded]}>
            <TouchableOpacity style={styles.sectionHeaderCollapsed}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.stepNumberSmall}>
                  <FontAwesomeIcon icon={faFileContract} size={12} color="#1E40AF" />
                </View>
                <Text style={styles.sectionTitleCollapsed}>Actions Taken</Text>
              </View>
              <FontAwesomeIcon icon={faChevronDown} size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.draftButton} onPress={handleSaveDraft}>
          <Text style={styles.draftButtonText}>Save Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>{currentStep === 3 ? 'Submit Case' : 'Next Step'}</Text>
          <FontAwesomeIcon icon={faArrowRight} size={18} color="#FFFFFF" />
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
  header: {
    backgroundColor: '#1E40AF',
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 24,
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
    backgroundColor: '#F59E0B',
    borderWidth: 2,
    borderColor: '#1E40AF',
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#BFDBFE',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#1E3A8A',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#93C5FD',
  },
  tabTextActive: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tabBadge: {
    fontSize: 11,
    backgroundColor: '#1E3A8A',
    color: '#93C5FD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  stepper: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  stepperItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  stepLabelActive: {
    fontWeight: '600',
    color: '#1E40AF',
  },
  stepConnector: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginTop: -28,
  },
  formSections: {
    paddingHorizontal: 16,
    gap: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionExpanded: {
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  sectionCollapsed: {
    opacity: 0.7,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#EFF6FF',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionContent: {
    padding: 16,
    gap: 16,
  },
  sectionHeaderCollapsed: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionTitleCollapsed: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  stepNumberSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formGroup: {
    marginBottom: 0,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  select: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectValue: {
    fontSize: 14,
    color: '#1F2937',
  },
  selectPlaceholder: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  dropdown: {
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 999,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#374151',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    padding: 0,
  },
  locationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  gpsButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textarea: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#1F2937',
    minHeight: 100,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  priorityRoutine: {
    backgroundColor: '#D1FAE5',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  priorityTextRoutine: {
    color: '#047857',
  },
  priorityPriority: {
    backgroundColor: '#DBEAFE',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  priorityTextPriority: {
    color: '#1D4ED8',
  },
  priorityUrgent: {
    backgroundColor: '#FEE2E2',
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  priorityTextUrgent: {
    color: '#991B1B',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  draftButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  draftButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  nextButton: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ImmigrationCaseReportScreen;
