/**
 * ✅ AMBULANCE - PATIENT REPORT SCREEN
 * Multi-step patient report creation form
 * Ambulance Department Only
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
  faHeartPulse,
  faBell,
  faChevronDown,
  faChevronUp,
  faArrowRight,
  faCalendar,
  faClock,
  faLocationDot,
  faCrosshairs,
  faFileLines,
  faUser,
  faHospital,
  faFileMedical,
} from '@fortawesome/free-solid-svg-icons';

const { width } = Dimensions.get('window');

// Types
interface EmergencyType {
  id: string;
  label: string;
}

const EMERGENCY_TYPES: EmergencyType[] = [
  { id: 'cardiac', label: 'Cardiac Emergency' },
  { id: 'respiratory', label: 'Respiratory Distress' },
  { id: 'trauma', label: 'Trauma / Injury' },
  { id: 'accident', label: 'Road Accident' },
  { id: 'stroke', label: 'Stroke Symptoms' },
  { id: 'other', label: 'Other Medical Emergency' },
];

const AmbulancePatientReportScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEmergencyType, setSelectedEmergencyType] = useState('');
  const [showEmergencyDropdown, setShowEmergencyDropdown] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [patientCondition, setPatientCondition] = useState('');
  const [priority, setPriority] = useState<'stable' | 'urgent' | 'critical'>('urgent');
  const [activeTab, setActiveTab] = useState<'drafts' | 'new' | 'history'>('new');

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      Alert.alert('Report Submitted', 'Patient report has been submitted successfully.');
    }
  };

  const handleSaveDraft = () => {
    Alert.alert('Draft Saved', 'Patient report draft has been saved.');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <FontAwesomeIcon icon={faHeartPulse} size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Sentinel Ambulance</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <FontAwesomeIcon icon={faBell} size={20} color="#FFFFFF" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <View style={styles.avatarSmall}>
              <Text style={styles.avatarText}>PM</Text>
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
            <Text style={[styles.tabText, activeTab === 'new' && styles.tabTextActive]}>New Report</Text>
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
              <Text style={[styles.stepLabel, currentStep >= 1 && styles.stepLabelActive]}>Emergency</Text>
            </View>

            <View style={styles.stepConnector} />

            {/* Step 2 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, currentStep >= 2 && styles.stepCircleActive]}>
                <Text style={[styles.stepNumber, currentStep >= 2 && styles.stepNumberActive]}>2</Text>
              </View>
              <Text style={[styles.stepLabel, currentStep >= 2 && styles.stepLabelActive]}>Patient</Text>
            </View>

            <View style={styles.stepConnector} />

            {/* Step 3 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, currentStep >= 3 && styles.stepCircleActive]}>
                <Text style={[styles.stepNumber, currentStep >= 3 && styles.stepNumberActive]}>3</Text>
              </View>
              <Text style={[styles.stepLabel, currentStep >= 3 && styles.stepLabelActive]}>Hospital</Text>
            </View>
          </View>
        </View>

        {/* Form Sections */}
        <View style={styles.formSections}>
          {/* Section 1: Emergency Details */}
          <View style={[styles.section, currentStep === 1 && styles.sectionExpanded]}>
            <TouchableOpacity style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <FontAwesomeIcon icon={faFileMedical} size={18} color="#DC2626" />
                <Text style={styles.sectionTitle}>Emergency Details</Text>
              </View>
              <FontAwesomeIcon 
                icon={currentStep === 1 ? faChevronUp : faChevronDown} 
                size={18} 
                color="#9CA3AF" 
              />
            </TouchableOpacity>

            {currentStep === 1 && (
              <View style={styles.sectionContent}>
                {/* Emergency Type */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Emergency Type</Text>
                  <TouchableOpacity
                    style={styles.select}
                    onPress={() => setShowEmergencyDropdown(!showEmergencyDropdown)}
                  >
                    <Text style={selectedEmergencyType ? styles.selectValue : styles.selectPlaceholder}>
                      {selectedEmergencyType
                        ? EMERGENCY_TYPES.find((t) => t.id === selectedEmergencyType)?.label
                        : 'Select emergency type...'}
                    </Text>
                    <FontAwesomeIcon icon={faChevronDown} size={14} color="#6B7280" />
                  </TouchableOpacity>
                  {showEmergencyDropdown && (
                    <View style={styles.dropdown}>
                      {EMERGENCY_TYPES.map((type) => (
                        <TouchableOpacity
                          key={type.id}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedEmergencyType(type.id);
                            setShowEmergencyDropdown(false);
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
                  <Text style={styles.label}>Pickup Location</Text>
                  <View style={styles.locationRow}>
                    <View style={[styles.inputWithIcon, { flex: 1 }]}>
                      <FontAwesomeIcon icon={faLocationDot} size={16} color="#9CA3AF" />
                      <TextInput
                        style={styles.inputField}
                        value={location}
                        onChangeText={setLocation}
                        placeholder="Enter address or use GPS"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                    <TouchableOpacity style={styles.gpsButton}>
                      <FontAwesomeIcon icon={faCrosshairs} size={18} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Condition */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Patient Condition</Text>
                  <TextInput
                    style={styles.textarea}
                    value={patientCondition}
                    onChangeText={setPatientCondition}
                    placeholder="Describe patient symptoms and condition..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Priority */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Priority Level</Text>
                  <View style={styles.priorityRow}>
                    <TouchableOpacity
                      style={[styles.priorityButton, priority === 'stable' && styles.priorityStable]}
                      onPress={() => setPriority('stable')}
                    >
                      <Text style={[styles.priorityText, priority === 'stable' && styles.priorityTextStable]}>Stable</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.priorityButton, priority === 'urgent' && styles.priorityUrgent]}
                      onPress={() => setPriority('urgent')}
                    >
                      <Text style={[styles.priorityText, priority === 'urgent' && styles.priorityTextUrgent]}>
                        Urgent
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.priorityButton, priority === 'critical' && styles.priorityCritical]}
                      onPress={() => setPriority('critical')}
                    >
                      <Text style={[styles.priorityText, priority === 'critical' && styles.priorityTextCritical]}>Critical</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Section 2: Patient Information */}
          <View style={[styles.section, styles.sectionCollapsed, currentStep >= 2 && styles.sectionExpanded]}>
            <TouchableOpacity style={styles.sectionHeaderCollapsed}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.stepNumberSmall}>
                  <FontAwesomeIcon icon={faUser} size={12} color="#DC2626" />
                </View>
                <Text style={styles.sectionTitleCollapsed}>Patient Information</Text>
              </View>
              <FontAwesomeIcon icon={faChevronDown} size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Section 3: Hospital Referral */}
          <View style={[styles.section, styles.sectionCollapsed, currentStep >= 3 && styles.sectionExpanded]}>
            <TouchableOpacity style={styles.sectionHeaderCollapsed}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.stepNumberSmall}>
                  <FontAwesomeIcon icon={faHospital} size={12} color="#DC2626" />
                </View>
                <Text style={styles.sectionTitleCollapsed}>Hospital Referral</Text>
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
          <Text style={styles.nextButtonText}>{currentStep === 3 ? 'Submit Report' : 'Next Step'}</Text>
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
    backgroundColor: '#DC2626',
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
    backgroundColor: '#FCD34D',
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FECACA',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#991B1B',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#B91C1C',
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
    color: '#FECACA',
  },
  tabTextActive: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tabBadge: {
    fontSize: 11,
    backgroundColor: '#991B1B',
    color: '#FECACA',
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
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
    shadowColor: '#DC2626',
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
    color: '#DC2626',
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
    borderColor: '#FEE2E2',
  },
  sectionCollapsed: {
    opacity: 0.7,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FEF2F2',
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
    backgroundColor: '#FEE2E2',
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
    backgroundColor: '#FEE2E2',
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
  priorityStable: {
    backgroundColor: '#DCFCE7',
    borderWidth: 2,
    borderColor: '#22C55E',
  },
  priorityTextStable: {
    color: '#166534',
  },
  priorityUrgent: {
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  priorityTextUrgent: {
    color: '#B45309',
  },
  priorityCritical: {
    backgroundColor: '#FEE2E2',
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  priorityTextCritical: {
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
    backgroundColor: '#DC2626',
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

export default AmbulancePatientReportScreen;
