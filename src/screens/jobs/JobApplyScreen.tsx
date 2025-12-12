import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// SVG Icon Components
const ArrowLeftIcon = ({ size = 24, color = '#1F2937' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M12 19l-7-7 7-7"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const UserIcon = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const EmailIcon = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M22 6l-10 7L2 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PhoneIcon = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LocationIcon = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth={2} />
  </Svg>
);

const FileIcon = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UploadIcon = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CheckCircleIcon = ({ size = 20, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BriefcaseIcon = ({ size = 20, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const GraduationIcon = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 10l-10-6L2 10l10 6 10-6zM6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const EditIcon = ({ size = 16, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const InfoIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M12 16v-4M12 8h.01" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

interface JobApplyScreenProps {
  navigation: any;
  route: any;
}

const JobApplyScreen: React.FC<JobApplyScreenProps> = ({ navigation, route }) => {
  const { job } = route.params;
  
  // Pre-filled user data (simulated from profile)
  const [formData, setFormData] = useState({
    fullName: 'Ousman Jallow',
    email: 'ousman.jallow@gmail.com',
    phone: '+220 772 1234',
    address: 'Bakau, The Gambia',
    education: "Bachelor's in Computer Science",
    experience: '3 years',
    currentEmployer: 'Tech Solutions Ltd',
    linkedIn: '',
    portfolio: '',
    coverLetter: '',
  });
  
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [additionalDocs, setAdditionalDocs] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUploadResume = () => {
    // Simulate file upload
    Alert.alert(
      'Upload Resume',
      'Select your resume file',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Upload', 
          onPress: () => {
            setResumeUploaded(true);
            Alert.alert('Success', 'Resume uploaded successfully!');
          }
        },
      ]
    );
  };

  const handleAddDocument = () => {
    Alert.alert(
      'Add Document',
      'Select additional document (certificates, references, etc.)',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Upload', 
          onPress: () => {
            setAdditionalDocs(prev => [...prev, `Document_${prev.length + 1}.pdf`]);
          }
        },
      ]
    );
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    if (!resumeUploaded) {
      Alert.alert('Resume Required', 'Please upload your resume to continue');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Application Submitted!',
        `Your application for ${job.title} at ${job.department} has been submitted successfully. You will receive a confirmation email shortly.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('JobBoard'),
          },
        ]
      );
    }, 2000);
  };

  const { theme, isDarkMode } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply for Job</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Job Summary */}
          <View style={styles.jobSummary}>
            <View style={styles.jobSummaryIcon}>
              <BriefcaseIcon size={24} color="#3B82F6" />
            </View>
            <View style={styles.jobSummaryInfo}>
              <Text style={styles.jobSummaryTitle}>{job.title}</Text>
              <Text style={styles.jobSummaryCompany}>{job.department}</Text>
              <Text style={styles.jobSummaryLocation}>{job.location}</Text>
            </View>
          </View>

          {/* Progress Steps */}
          <View style={styles.progressContainer}>
            <View style={styles.progressStep}>
              <View style={[styles.progressDot, styles.progressDotActive]}>
                <Text style={styles.progressDotText}>1</Text>
              </View>
              <Text style={styles.progressLabel}>Details</Text>
            </View>
            <View style={[styles.progressLine, styles.progressLineActive]} />
            <View style={styles.progressStep}>
              <View style={[styles.progressDot, styles.progressDotActive]}>
                <Text style={styles.progressDotText}>2</Text>
              </View>
              <Text style={styles.progressLabel}>Documents</Text>
            </View>
            <View style={styles.progressLine} />
            <View style={styles.progressStep}>
              <View style={styles.progressDot}>
                <Text style={[styles.progressDotText, styles.progressDotTextInactive]}>3</Text>
              </View>
              <Text style={[styles.progressLabel, styles.progressLabelInactive]}>Submit</Text>
            </View>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.infoNote}>
              <InfoIcon size={14} color="#3B82F6" />
              <Text style={styles.infoNoteText}>
                Pre-filled from your profile. Tap to edit.
              </Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <View style={styles.inputContainer}>
                <UserIcon size={18} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={formData.fullName}
                  onChangeText={(value) => updateFormData('fullName', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                />
                <EditIcon size={16} color="#3B82F6" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address *</Text>
              <View style={styles.inputContainer}>
                <EmailIcon size={18} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <EditIcon size={16} color="#3B82F6" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <View style={styles.inputContainer}>
                <PhoneIcon size={18} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(value) => updateFormData('phone', value)}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
                <EditIcon size={16} color="#3B82F6" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address</Text>
              <View style={styles.inputContainer}>
                <LocationIcon size={18} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={formData.address}
                  onChangeText={(value) => updateFormData('address', value)}
                  placeholder="Enter your address"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>

          {/* Professional Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Highest Education</Text>
              <View style={styles.inputContainer}>
                <GraduationIcon size={18} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={formData.education}
                  onChangeText={(value) => updateFormData('education', value)}
                  placeholder="e.g., Bachelor's in Computer Science"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Years of Experience</Text>
              <View style={styles.inputContainer}>
                <BriefcaseIcon size={18} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={formData.experience}
                  onChangeText={(value) => updateFormData('experience', value)}
                  placeholder="e.g., 3 years"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current/Last Employer</Text>
              <View style={styles.inputContainer}>
                <BriefcaseIcon size={18} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={formData.currentEmployer}
                  onChangeText={(value) => updateFormData('currentEmployer', value)}
                  placeholder="Company name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>

          {/* Documents */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documents</Text>
            
            {/* Resume Upload */}
            <TouchableOpacity 
              style={[styles.uploadCard, resumeUploaded && styles.uploadCardSuccess]}
              onPress={handleUploadResume}
            >
              {resumeUploaded ? (
                <>
                  <CheckCircleIcon size={32} color="#10B981" />
                  <View style={styles.uploadInfo}>
                    <Text style={styles.uploadTitle}>Resume Uploaded</Text>
                    <Text style={styles.uploadSubtitle}>Ousman_Jallow_Resume.pdf</Text>
                  </View>
                  <TouchableOpacity style={styles.changeButton}>
                    <Text style={styles.changeButtonText}>Change</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <UploadIcon size={32} color="#3B82F6" />
                  <View style={styles.uploadInfo}>
                    <Text style={styles.uploadTitle}>Upload Resume *</Text>
                    <Text style={styles.uploadSubtitle}>PDF, DOC, DOCX (Max 5MB)</Text>
                  </View>
                </>
              )}
            </TouchableOpacity>

            {/* Additional Documents */}
            <TouchableOpacity 
              style={styles.uploadCard}
              onPress={handleAddDocument}
            >
              <FileIcon size={32} color="#6B7280" />
              <View style={styles.uploadInfo}>
                <Text style={styles.uploadTitle}>Additional Documents</Text>
                <Text style={styles.uploadSubtitle}>Certificates, references (optional)</Text>
              </View>
            </TouchableOpacity>

            {additionalDocs.length > 0 && (
              <View style={styles.docsList}>
                {additionalDocs.map((doc, index) => (
                  <View key={index} style={styles.docItem}>
                    <FileIcon size={16} color="#10B981" />
                    <Text style={styles.docName}>{doc}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Cover Letter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cover Letter (Optional)</Text>
            <TextInput
              style={styles.textArea}
              value={formData.coverLetter}
              onChangeText={(value) => updateFormData('coverLetter', value)}
              placeholder={`Dear Hiring Manager,\n\nI am writing to express my interest in the ${job.title} position at ${job.department}...`}
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={isSubmitting ? ['#9CA3AF', '#9CA3AF'] : ['#3B82F6', '#1D4ED8']}
            style={styles.submitButtonGradient}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  jobSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  jobSummaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  jobSummaryInfo: {
    flex: 1,
  },
  jobSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  jobSummaryCompany: {
    fontSize: 14,
    color: '#6B7280',
  },
  jobSummaryLocation: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
  },
  progressStep: {
    alignItems: 'center',
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressDotActive: {
    backgroundColor: '#3B82F6',
  },
  progressDotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressDotTextInactive: {
    color: '#9CA3AF',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
    marginBottom: 20,
  },
  progressLineActive: {
    backgroundColor: '#3B82F6',
  },
  progressLabel: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  progressLabelInactive: {
    color: '#9CA3AF',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoNoteText: {
    fontSize: 13,
    color: '#3B82F6',
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#1F2937',
  },
  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  uploadCardSuccess: {
    borderColor: '#10B981',
    borderStyle: 'solid',
    backgroundColor: '#ECFDF5',
  },
  uploadInfo: {
    flex: 1,
    marginLeft: 12,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  uploadSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  changeButtonText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '500',
  },
  docsList: {
    marginTop: 8,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  docName: {
    fontSize: 14,
    color: '#10B981',
    marginLeft: 8,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#1F2937',
    minHeight: 150,
  },
  bottomPadding: {
    height: 120,
  },
  submitContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default JobApplyScreen;
