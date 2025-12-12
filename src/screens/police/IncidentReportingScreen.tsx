/**
 * ✅ PATROL APP - INCIDENT REPORTING SCREEN
 * Multi-step incident report creation form
 * Police Department Only
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const ShieldIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
  </Svg>
);

const BellIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const FileEditIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
  </Svg>
);

const CalendarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const ClockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const LocationIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </Svg>
);

const CrosshairIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M22 12h-4M6 12H2M12 6V2M12 22v-4" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const ChevronUpIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 15l-6-6-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronDownIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowRightIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12h14M12 5l7 7-7 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Types
interface IncidentType {
  id: string;
  label: string;
}

const INCIDENT_TYPES: IncidentType[] = [
  { id: 'theft', label: 'Theft / Larceny' },
  { id: 'traffic', label: 'Traffic Accident' },
  { id: 'assault', label: 'Assault' },
  { id: 'vandalism', label: 'Vandalism' },
  { id: 'suspicious', label: 'Suspicious Activity' },
  { id: 'noise', label: 'Noise Complaint' },
];

const IncidentReportingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIncidentType, setSelectedIncidentType] = useState('');
  const [showIncidentDropdown, setShowIncidentDropdown] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [narrative, setNarrative] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [activeTab, setActiveTab] = useState<'drafts' | 'new' | 'history'>('new');

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSaveDraft = () => {
    // Save draft logic
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <ShieldIcon size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Sentinel Patrol</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <BellIcon size={20} color="#FFFFFF" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <View style={styles.avatarSmall}>
              <Text style={styles.avatarText}>JD</Text>
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
              Drafts <Text style={styles.tabBadge}>3</Text>
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
          <View style={styles.stepperLine} />
          
          <View style={styles.stepperItems}>
            {/* Step 1 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, currentStep >= 1 && styles.stepCircleActive]}>
                <Text style={[styles.stepNumber, currentStep >= 1 && styles.stepNumberActive]}>1</Text>
              </View>
              <Text style={[styles.stepLabel, currentStep >= 1 && styles.stepLabelActive]}>Incident</Text>
            </View>

            <View style={styles.stepConnector} />

            {/* Step 2 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, currentStep >= 2 && styles.stepCircleActive]}>
                <Text style={[styles.stepNumber, currentStep >= 2 && styles.stepNumberActive]}>2</Text>
              </View>
              <Text style={[styles.stepLabel, currentStep >= 2 && styles.stepLabelActive]}>People</Text>
            </View>

            <View style={styles.stepConnector} />

            {/* Step 3 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, currentStep >= 3 && styles.stepCircleActive]}>
                <Text style={[styles.stepNumber, currentStep >= 3 && styles.stepNumberActive]}>3</Text>
              </View>
              <Text style={[styles.stepLabel, currentStep >= 3 && styles.stepLabelActive]}>Evidence</Text>
            </View>
          </View>
        </View>

        {/* Form Sections */}
        <View style={styles.formSections}>
          {/* Section 1: Incident Details (Expanded) */}
          <View style={[styles.section, currentStep === 1 && styles.sectionExpanded]}>
            <TouchableOpacity style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <FileEditIcon size={18} color="#1E40AF" />
                <Text style={styles.sectionTitle}>Incident Details</Text>
              </View>
              {currentStep === 1 ? (
                <ChevronUpIcon size={18} color="#9CA3AF" />
              ) : (
                <ChevronDownIcon size={18} color="#9CA3AF" />
              )}
            </TouchableOpacity>

            {currentStep === 1 && (
              <View style={styles.sectionContent}>
                {/* Incident Type */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Incident Type</Text>
                  <TouchableOpacity
                    style={styles.select}
                    onPress={() => setShowIncidentDropdown(!showIncidentDropdown)}
                  >
                    <Text style={selectedIncidentType ? styles.selectValue : styles.selectPlaceholder}>
                      {selectedIncidentType
                        ? INCIDENT_TYPES.find((t) => t.id === selectedIncidentType)?.label
                        : 'Select incident type...'}
                    </Text>
                    <ChevronDownIcon size={14} color="#6B7280" />
                  </TouchableOpacity>
                  {showIncidentDropdown && (
                    <View style={styles.dropdown}>
                      {INCIDENT_TYPES.map((type) => (
                        <TouchableOpacity
                          key={type.id}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedIncidentType(type.id);
                            setShowIncidentDropdown(false);
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
                      <CalendarIcon size={16} color="#9CA3AF" />
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
                      <ClockIcon size={16} color="#9CA3AF" />
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
                  <Text style={styles.label}>Location</Text>
                  <View style={styles.locationRow}>
                    <View style={[styles.inputWithIcon, { flex: 1 }]}>
                      <LocationIcon size={16} color="#9CA3AF" />
                      <TextInput
                        style={styles.inputField}
                        value={location}
                        onChangeText={setLocation}
                        placeholder="Enter address or coordinates"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                    <TouchableOpacity style={styles.gpsButton}>
                      <CrosshairIcon size={18} color="#1E40AF" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Narrative */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Narrative</Text>
                  <TextInput
                    style={styles.textarea}
                    value={narrative}
                    onChangeText={setNarrative}
                    placeholder="Describe the incident details here..."
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
                      style={[styles.priorityButton, priority === 'low' && styles.priorityLow]}
                      onPress={() => setPriority('low')}
                    >
                      <Text style={[styles.priorityText, priority === 'low' && styles.priorityTextLow]}>Low</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.priorityButton, priority === 'medium' && styles.priorityMedium]}
                      onPress={() => setPriority('medium')}
                    >
                      <Text style={[styles.priorityText, priority === 'medium' && styles.priorityTextMedium]}>
                        Medium
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.priorityButton, priority === 'high' && styles.priorityHigh]}
                      onPress={() => setPriority('high')}
                    >
                      <Text style={[styles.priorityText, priority === 'high' && styles.priorityTextHigh]}>High</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Section 2: People Involved (Collapsed) */}
          <View style={[styles.section, styles.sectionCollapsed, currentStep >= 2 && styles.sectionExpanded]}>
            <TouchableOpacity style={styles.sectionHeaderCollapsed}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.stepNumberSmall}>
                  <Text style={styles.stepNumberSmallText}>2</Text>
                </View>
                <Text style={styles.sectionTitleCollapsed}>People Involved</Text>
              </View>
              <ChevronDownIcon size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Section 3: Evidence (Collapsed) */}
          <View style={[styles.section, styles.sectionCollapsed, currentStep >= 3 && styles.sectionExpanded]}>
            <TouchableOpacity style={styles.sectionHeaderCollapsed}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.stepNumberSmall}>
                  <Text style={styles.stepNumberSmallText}>3</Text>
                </View>
                <Text style={styles.sectionTitleCollapsed}>Evidence & Media</Text>
              </View>
              <ChevronDownIcon size={18} color="#9CA3AF" />
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
          <Text style={styles.nextButtonText}>Next Step</Text>
          <ArrowRightIcon size={18} color="#FFFFFF" />
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

  // Header
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
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#1E40AF',
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#93C5FD',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E40AF',
  },

  // Tabs
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#153084',
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

  // Content
  content: {
    flex: 1,
  },

  // Stepper
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
    position: 'relative',
  },
  stepperLine: {
    position: 'absolute',
    top: '50%',
    left: 60,
    right: 60,
    height: 4,
    backgroundColor: '#F3F4F6',
    zIndex: 0,
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
    zIndex: 1,
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

  // Form Sections
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
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sectionExpanded: {
    opacity: 1,
  },
  sectionCollapsed: {
    opacity: 0.6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionHeaderCollapsed: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  sectionTitleCollapsed: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  stepNumberSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberSmallText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  sectionContent: {
    padding: 20,
    gap: 20,
  },

  // Form Elements
  formGroup: {
    gap: 8,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  select: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
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
    position: 'absolute',
    top: 76,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 100,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#1F2937',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingLeft: 12,
    gap: 8,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    paddingVertical: 10,
    paddingRight: 12,
  },
  locationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  gpsButton: {
    width: 44,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textarea: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 100,
  },

  // Priority
  priorityRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 14,
    color: '#6B7280',
  },
  priorityLow: {
    backgroundColor: '#D1FAE5',
    borderColor: '#A7F3D0',
  },
  priorityTextLow: {
    color: '#065F46',
  },
  priorityMedium: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  priorityTextMedium: {
    color: '#92400E',
  },
  priorityHigh: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  priorityTextHigh: {
    color: '#991B1B',
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 10,
  },
  draftButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    alignItems: 'center',
  },
  draftButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default IncidentReportingScreen;
