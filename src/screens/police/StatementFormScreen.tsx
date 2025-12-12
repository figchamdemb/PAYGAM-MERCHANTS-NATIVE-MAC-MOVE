/**
 * ✅ STATEMENT FORM SCREEN - SENTINEL PATROL
 * 
 * Officers create detailed case statements
 * Features:
 * - 3-step stepper (Incident Info, Narrative, Officer Info)
 * - Location and timestamp capture
 * - Detailed narrative with formatting
 * - Officer signature and badge number
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faCheck,
  faFileAlt,
  faMapMarkerAlt,
  faCalendarAlt,
  faClock,
  faExclamationCircle,
  faUsers,
  faPen,
  faShieldAlt,
  faIdBadge,
  faBuilding,
  faCheckCircle,
  faCamera,
  faPaperclip,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

// Types
interface IncidentInfo {
  caseNumber: string;
  incidentType: string;
  location: string;
  date: string;
  time: string;
  severity: string;
  involvedParties: string;
}

interface OfficerInfo {
  name: string;
  badgeNumber: string;
  rank: string;
  department: string;
  signature: boolean;
}

const INCIDENT_TYPES = [
  'Robbery',
  'Assault',
  'Burglary',
  'Theft',
  'Traffic Accident',
  'Domestic Violence',
  'Vandalism',
  'Drug Offense',
  'Public Disturbance',
  'Other',
];

const SEVERITY_LEVELS = [
  { id: 'low', label: 'Low', color: '#22C55E' },
  { id: 'medium', label: 'Medium', color: '#F59E0B' },
  { id: 'high', label: 'High', color: '#EF4444' },
  { id: 'critical', label: 'Critical', color: '#7C3AED' },
];

const StatementFormScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [incidentInfo, setIncidentInfo] = useState<IncidentInfo>({
    caseNumber: '',
    incidentType: '',
    location: '',
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    severity: '',
    involvedParties: '',
  });
  const [narrative, setNarrative] = useState('');
  const [officerInfo, setOfficerInfo] = useState<OfficerInfo>({
    name: 'Officer John Doe',
    badgeNumber: 'GPF-12345',
    rank: 'Sergeant',
    department: 'Criminal Investigation',
    signature: false,
  });
  const [showIncidentTypePicker, setShowIncidentTypePicker] = useState(false);

  // Generate case number on mount
  useEffect(() => {
    const caseNum = `GPF-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setIncidentInfo(prev => ({ ...prev, caseNumber: caseNum }));
  }, []);

  const steps = [
    { number: 1, label: 'Incident Info', icon: faFileAlt },
    { number: 2, label: 'Narrative', icon: faPen },
    { number: 3, label: 'Officer Info', icon: faShieldAlt },
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSubmit = () => {
    // Submit the statement
    console.log('Submitting statement:', { incidentInfo, narrative, officerInfo });
    navigation.goBack();
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return incidentInfo.incidentType && incidentInfo.location && incidentInfo.severity;
    }
    if (currentStep === 2) {
      return narrative.length > 50;
    }
    if (currentStep === 3) {
      return officerInfo.signature;
    }
    return true;
  };

  const renderStepIndicator = () => (
    <View style={styles.stepperContainer}>
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <View style={styles.stepItem}>
            <View style={[
              styles.stepCircle,
              currentStep >= step.number && styles.stepCircleActive,
              currentStep > step.number && styles.stepCircleCompleted,
            ]}>
              {currentStep > step.number ? (
                <FontAwesomeIcon icon={faCheck} size={14} color="#FFFFFF" />
              ) : (
                <FontAwesomeIcon 
                  icon={step.icon} 
                  size={14} 
                  color={currentStep >= step.number ? '#FFFFFF' : '#94A3B8'} 
                />
              )}
            </View>
            <Text style={[
              styles.stepLabel,
              currentStep >= step.number && styles.stepLabelActive,
            ]}>
              {step.label}
            </Text>
          </View>
          {index < steps.length - 1 && (
            <View style={[
              styles.stepConnector,
              currentStep > step.number && styles.stepConnectorActive,
            ]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Incident Information</Text>
      <Text style={styles.sectionSubtitle}>
        Enter the basic details of the incident
      </Text>

      {/* Case Number - Auto Generated */}
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Case Number</Text>
        <View style={styles.autoGeneratedField}>
          <FontAwesomeIcon icon={faFileAlt} size={16} color="#1E40AF" />
          <Text style={styles.autoGeneratedText}>{incidentInfo.caseNumber}</Text>
          <View style={styles.autoBadge}>
            <Text style={styles.autoBadgeText}>Auto</Text>
          </View>
        </View>
      </View>

      {/* Incident Type */}
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Incident Type *</Text>
        <TouchableOpacity
          style={styles.selectField}
          onPress={() => setShowIncidentTypePicker(!showIncidentTypePicker)}
        >
          <FontAwesomeIcon icon={faExclamationCircle} size={16} color="#64748B" />
          <Text style={[
            styles.selectFieldText,
            !incidentInfo.incidentType && styles.selectFieldPlaceholder,
          ]}>
            {incidentInfo.incidentType || 'Select incident type'}
          </Text>
          <FontAwesomeIcon icon={faChevronRight} size={14} color="#94A3B8" />
        </TouchableOpacity>
        {showIncidentTypePicker && (
          <View style={styles.pickerDropdown}>
            {INCIDENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.pickerOption,
                  incidentInfo.incidentType === type && styles.pickerOptionSelected,
                ]}
                onPress={() => {
                  setIncidentInfo({ ...incidentInfo, incidentType: type });
                  setShowIncidentTypePicker(false);
                }}
              >
                <Text style={[
                  styles.pickerOptionText,
                  incidentInfo.incidentType === type && styles.pickerOptionTextSelected,
                ]}>
                  {type}
                </Text>
                {incidentInfo.incidentType === type && (
                  <FontAwesomeIcon icon={faCheck} size={14} color="#1E40AF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Location */}
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Location *</Text>
        <View style={styles.inputWithIcon}>
          <FontAwesomeIcon icon={faMapMarkerAlt} size={16} color="#64748B" />
          <TextInput
            style={styles.textInput}
            placeholder="Enter incident location"
            placeholderTextColor="#94A3B8"
            value={incidentInfo.location}
            onChangeText={(text) => setIncidentInfo({ ...incidentInfo, location: text })}
          />
        </View>
      </View>

      {/* Date & Time */}
      <View style={styles.formRow}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.formLabel}>Date</Text>
          <View style={styles.inputWithIcon}>
            <FontAwesomeIcon icon={faCalendarAlt} size={16} color="#64748B" />
            <TextInput
              style={styles.textInput}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#94A3B8"
              value={incidentInfo.date}
              onChangeText={(text) => setIncidentInfo({ ...incidentInfo, date: text })}
            />
          </View>
        </View>
        <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.formLabel}>Time</Text>
          <View style={styles.inputWithIcon}>
            <FontAwesomeIcon icon={faClock} size={16} color="#64748B" />
            <TextInput
              style={styles.textInput}
              placeholder="HH:MM"
              placeholderTextColor="#94A3B8"
              value={incidentInfo.time}
              onChangeText={(text) => setIncidentInfo({ ...incidentInfo, time: text })}
            />
          </View>
        </View>
      </View>

      {/* Severity Level */}
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Severity Level *</Text>
        <View style={styles.severityOptions}>
          {SEVERITY_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.severityOption,
                incidentInfo.severity === level.id && {
                  borderColor: level.color,
                  backgroundColor: `${level.color}15`,
                },
              ]}
              onPress={() => setIncidentInfo({ ...incidentInfo, severity: level.id })}
            >
              <View style={[styles.severityDot, { backgroundColor: level.color }]} />
              <Text style={[
                styles.severityLabel,
                incidentInfo.severity === level.id && { color: level.color },
              ]}>
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Involved Parties */}
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Involved Parties</Text>
        <View style={styles.inputWithIcon}>
          <FontAwesomeIcon icon={faUsers} size={16} color="#64748B" />
          <TextInput
            style={styles.textInput}
            placeholder="Names or descriptions of involved parties"
            placeholderTextColor="#94A3B8"
            value={incidentInfo.involvedParties}
            onChangeText={(text) => setIncidentInfo({ ...incidentInfo, involvedParties: text })}
          />
        </View>
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Incident Narrative</Text>
      <Text style={styles.sectionSubtitle}>
        Provide a detailed account of the incident
      </Text>

      {/* Narrative Text Area */}
      <View style={styles.narrativeContainer}>
        <TextInput
          style={styles.narrativeInput}
          placeholder="Describe the incident in detail. Include what happened, when, where, who was involved, and any relevant observations..."
          placeholderTextColor="#94A3B8"
          value={narrative}
          onChangeText={setNarrative}
          multiline
          textAlignVertical="top"
        />
        <View style={styles.narrativeFooter}>
          <Text style={styles.charCount}>
            {narrative.length} characters (minimum 50)
          </Text>
          <View style={styles.attachmentRow}>
            <TouchableOpacity style={styles.attachBtn}>
              <FontAwesomeIcon icon={faCamera} size={18} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachBtn}>
              <FontAwesomeIcon icon={faPaperclip} size={18} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Quick Sections */}
      <Text style={styles.quickSectionsTitle}>Quick Sections</Text>
      <View style={styles.quickSectionsGrid}>
        {[
          { label: 'Initial Response', emoji: '🚔' },
          { label: 'Witness Accounts', emoji: '👁️' },
          { label: 'Evidence Found', emoji: '🔍' },
          { label: 'Actions Taken', emoji: '⚡' },
          { label: 'Injuries Reported', emoji: '🏥' },
          { label: 'Conclusion', emoji: '📋' },
        ].map((section) => (
          <TouchableOpacity
            key={section.label}
            style={styles.quickSectionBtn}
            onPress={() => setNarrative(prev => prev + `\n\n${section.label.toUpperCase()}:\n`)}
          >
            <Text style={styles.quickSectionEmoji}>{section.emoji}</Text>
            <Text style={styles.quickSectionLabel}>{section.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Formatting Tips */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 Writing Tips</Text>
        <Text style={styles.tipsText}>
          • Use chronological order{'\n'}
          • Be specific with times and locations{'\n'}
          • Include direct quotes when possible{'\n'}
          • Describe physical evidence clearly
        </Text>
      </View>
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Officer Information</Text>
      <Text style={styles.sectionSubtitle}>
        Verify your details and sign the statement
      </Text>

      {/* Officer Details Card */}
      <View style={styles.officerCard}>
        <View style={styles.officerAvatar}>
          <FontAwesomeIcon icon={faShieldAlt} size={32} color="#1E40AF" />
        </View>
        <View style={styles.officerDetails}>
          <Text style={styles.officerName}>{officerInfo.name}</Text>
          <View style={styles.officerInfoRow}>
            <FontAwesomeIcon icon={faIdBadge} size={12} color="#64748B" />
            <Text style={styles.officerInfoText}>Badge: {officerInfo.badgeNumber}</Text>
          </View>
          <View style={styles.officerInfoRow}>
            <FontAwesomeIcon icon={faShieldAlt} size={12} color="#64748B" />
            <Text style={styles.officerInfoText}>Rank: {officerInfo.rank}</Text>
          </View>
          <View style={styles.officerInfoRow}>
            <FontAwesomeIcon icon={faBuilding} size={12} color="#64748B" />
            <Text style={styles.officerInfoText}>Dept: {officerInfo.department}</Text>
          </View>
        </View>
      </View>

      {/* Statement Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Statement Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Case Number</Text>
          <Text style={styles.summaryValue}>{incidentInfo.caseNumber}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Incident Type</Text>
          <Text style={styles.summaryValue}>{incidentInfo.incidentType}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Date & Time</Text>
          <Text style={styles.summaryValue}>{incidentInfo.date} {incidentInfo.time}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Location</Text>
          <Text style={styles.summaryValue}>{incidentInfo.location}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Narrative Length</Text>
          <Text style={styles.summaryValue}>{narrative.length} characters</Text>
        </View>
      </View>

      {/* Signature Section */}
      <TouchableOpacity
        style={[
          styles.signatureSection,
          officerInfo.signature && styles.signatureSectionSigned,
        ]}
        onPress={() => setOfficerInfo({ ...officerInfo, signature: !officerInfo.signature })}
      >
        {officerInfo.signature ? (
          <>
            <FontAwesomeIcon icon={faCheckCircle} size={24} color="#059669" />
            <View style={styles.signatureContent}>
              <Text style={styles.signatureTitle}>Statement Signed</Text>
              <Text style={styles.signatureSubtitle}>
                Signed by {officerInfo.name}
              </Text>
            </View>
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faPen} size={24} color="#1E40AF" />
            <View style={styles.signatureContent}>
              <Text style={styles.signatureTitle}>Sign Statement</Text>
              <Text style={styles.signatureSubtitle}>
                Tap to add your electronic signature
              </Text>
            </View>
            <FontAwesomeIcon icon={faChevronRight} size={16} color="#94A3B8" />
          </>
        )}
      </TouchableOpacity>

      {/* Legal Disclaimer */}
      <View style={styles.disclaimerCard}>
        <Text style={styles.disclaimerText}>
          By signing this statement, I affirm that the information provided is 
          accurate and complete to the best of my knowledge. This statement may 
          be used as official documentation in legal proceedings.
        </Text>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesomeIcon icon={faChevronLeft} size={20} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Statement Form</Text>
        <TouchableOpacity style={styles.saveButton}>
          <FontAwesomeIcon icon={faSave} size={20} color="#1E40AF" />
        </TouchableOpacity>
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </KeyboardAvoidingView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <FontAwesomeIcon icon={faChevronLeft} size={16} color="#64748B" />
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        )}
        {currentStep < 3 ? (
          <TouchableOpacity
            style={[styles.nextBtn, !canProceed() && styles.nextBtnDisabled]}
            onPress={handleNext}
            disabled={!canProceed()}
          >
            <Text style={styles.nextBtnText}>Continue</Text>
            <FontAwesomeIcon icon={faChevronRight} size={16} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.submitBtn, !canProceed() && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!canProceed()}
          >
            <LinearGradient
              colors={canProceed() ? ['#059669', '#10B981'] : ['#94A3B8', '#94A3B8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitGradient}
            >
              <FontAwesomeIcon icon={faCheckCircle} size={18} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>Submit Statement</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
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
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#1E40AF',
  },
  stepCircleCompleted: {
    backgroundColor: '#059669',
  },
  stepLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  stepLabelActive: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  stepConnector: {
    width: 40,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
    marginBottom: 24,
  },
  stepConnectorActive: {
    backgroundColor: '#059669',
  },
  content: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  autoGeneratedField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  autoGeneratedText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
  autoBadge: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  autoBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectFieldText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  selectFieldPlaceholder: {
    color: '#94A3B8',
  },
  pickerDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pickerOptionSelected: {
    backgroundColor: '#EFF6FF',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#475569',
  },
  pickerOptionTextSelected: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937',
  },
  severityOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  severityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  severityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  severityLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  narrativeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  narrativeInput: {
    minHeight: 200,
    padding: 16,
    fontSize: 14,
    lineHeight: 22,
    color: '#1F2937',
  },
  narrativeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  charCount: {
    fontSize: 12,
    color: '#94A3B8',
  },
  attachmentRow: {
    flexDirection: 'row',
  },
  attachBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickSectionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  quickSectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  quickSectionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickSectionEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  quickSectionLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  tipsCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    color: '#B45309',
    lineHeight: 20,
  },
  officerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  officerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  officerDetails: {
    flex: 1,
    marginLeft: 16,
  },
  officerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  officerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  officerInfoText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 8,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    maxWidth: '50%',
    textAlign: 'right',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  signatureSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  signatureSectionSigned: {
    borderColor: '#059669',
    borderStyle: 'solid',
    backgroundColor: '#F0FDF4',
  },
  signatureContent: {
    flex: 1,
    marginLeft: 16,
  },
  signatureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  signatureSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  disclaimerCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  backBtnText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    borderRadius: 12,
    marginLeft: 12,
  },
  nextBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  submitBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: 12,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 10,
  },
});

export default StatementFormScreen;
