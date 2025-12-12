import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faCamera,
  faUser,
  faPaperclip,
  faMicrophone,
  faTimes,
  faCheckCircle,
  faChevronDown,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const ReportNewCaseScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const [caseType, setCaseType] = useState('');
  const [date, setDate] = useState('2023-10-27');
  const [time, setTime] = useState('14:30');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [peopleInvolved, setPeopleInvolved] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [statement, setStatement] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([
    { id: 1, name: 'scene_photo_01.jpg', size: '2.4 MB', type: 'image' },
    { id: 2, name: 'witness_statement.mp3', size: '0.8 MB', type: 'audio' },
  ]);

  const caseTypes = [
    { value: '', label: 'Select case type' },
    { value: 'general_crime', label: 'General Crime' },
    { value: 'theft', label: 'Theft' },
    { value: 'assault', label: 'Assault' },
    { value: 'fire', label: 'Fire Incident' },
    { value: 'medical', label: 'Medical Emergency' },
    { value: 'traffic', label: 'Traffic Accident' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmitReport = () => {
    // Handle submit report logic
    console.log('Submitting report:', { caseType, date, time, location, description });
  };

  const handleAddEvidence = (type: string) => {
    // Handle add evidence logic
    console.log('Adding evidence:', type);
  };

  const handleRemoveFile = (fileId: number) => {
    setAttachedFiles(attachedFiles.filter(file => file.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return faCamera;
      case 'audio':
        return faMicrophone;
      default:
        return faPaperclip;
    }
  };

  const getFileIconColor = (type: string) => {
    switch (type) {
      case 'image':
        return '#3B82F6';
      case 'audio':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />
      
      {/* Header */}
      <LinearGradient
        colors={['#B45309', '#92400e']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report New Case</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Case Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Case Type</Text>
          <View style={styles.selectContainer}>
            <TouchableOpacity style={styles.selectButton}>
              <Text style={[
                styles.selectText,
                caseType ? styles.selectTextSelected : styles.selectTextPlaceholder
              ]}>
                {caseTypes.find(type => type.value === caseType)?.label || 'Select case type'}
              </Text>
              <FontAwesomeIcon icon={faChevronDown} size={12} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.rowInputs}>
          <View style={styles.halfInputGroup}>
            <Text style={styles.inputLabel}>Date</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>
          <View style={styles.halfInputGroup}>
            <Text style={styles.inputLabel}>Time</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={time}
                onChangeText={setTime}
                placeholder="HH:MM"
              />
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Location</Text>
          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faMapMarkerAlt} size={16} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.inputWithIcon}
              value={location}
              onChangeText={setLocation}
              placeholder="Enter incident location"
            />
          </View>
        </View>

        {/* Brief Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Brief Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Briefly describe what happened..."
            multiline
            numberOfLines={3}
          />
        </View>

        {/* People Involved */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>People Involved</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={peopleInvolved}
            onChangeText={setPeopleInvolved}
            placeholder="Names of people involved..."
            multiline
            numberOfLines={2}
          />
        </View>

        {/* Contact Info */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Contact Information</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={contactInfo}
            onChangeText={setContactInfo}
            placeholder="Phone numbers/addresses..."
            multiline
            numberOfLines={2}
          />
        </View>

        {/* Evidence Section */}
        <View style={styles.evidenceSection}>
          <Text style={styles.inputLabel}>Evidence</Text>
          
          {/* Action Buttons */}
          <View style={styles.evidenceButtons}>
            <TouchableOpacity
              style={[styles.evidenceButton, styles.cameraButton]}
              onPress={() => handleAddEvidence('camera')}
            >
              <FontAwesomeIcon icon={faCamera} size={24} color="#EF4444" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.evidenceButton, styles.userButton]}
              onPress={() => handleAddEvidence('user')}
            >
              <FontAwesomeIcon icon={faUser} size={24} color="#3B82F6" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.evidenceButton, styles.attachmentButton]}
              onPress={() => handleAddEvidence('attachment')}
            >
              <FontAwesomeIcon icon={faPaperclip} size={24} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.evidenceButton, styles.microphoneButton]}
              onPress={() => handleAddEvidence('audio')}
            >
              <FontAwesomeIcon icon={faMicrophone} size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Uploaded Files List */}
          {attachedFiles.length > 0 && (
            <View style={styles.filesList}>
              <Text style={styles.filesTitle}>Attached Files</Text>
              
              {attachedFiles.map((file) => (
                <View key={file.id} style={styles.fileItem}>
                  <View style={styles.fileInfo}>
                    <View style={[
                      styles.fileIcon,
                      { backgroundColor: getFileIconColor(file.type) + '20' }
                    ]}>
                      <FontAwesomeIcon
                        icon={getFileIcon(file.type)}
                        size={16}
                        color={getFileIconColor(file.type)}
                      />
                    </View>
                    <View style={styles.fileDetails}>
                      <Text style={styles.fileName} numberOfLines={1}>
                        {file.name}
                      </Text>
                      <Text style={styles.fileSize}>{file.size}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveFile(file.id)}
                  >
                    <FontAwesomeIcon icon={faTimes} size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Detailed Statement */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Detailed Statement</Text>
          <TextInput
            style={[styles.input, styles.largeTextArea]}
            value={statement}
            onChangeText={setStatement}
            placeholder="Provide a detailed statement about the incident..."
            multiline
            numberOfLines={6}
          />
        </View>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReport}>
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    backgroundColor: '#B45309',
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
  content: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    marginLeft: 4,
  },
  selectContainer: {
    position: 'relative',
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectText: {
    fontSize: 14,
  },
  selectTextPlaceholder: {
    color: '#9CA3AF',
  },
  selectTextSelected: {
    color: '#111827',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInputGroup: {
    flex: 1,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    fontSize: 14,
    color: '#111827',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputWithIcon: {
    width: '100%',
    paddingLeft: 48,
    paddingRight: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    fontSize: 14,
    color: '#111827',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -8 }],
    zIndex: 1,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  largeTextArea: {
    minHeight: 160,
    textAlignVertical: 'top',
  },
  evidenceSection: {
    marginBottom: 20,
  },
  evidenceButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  evidenceButton: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cameraButton: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  userButton: {
    backgroundColor: '#DBEAFE',
    borderColor: '#93C5FD',
  },
  attachmentButton: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  microphoneButton: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  filesList: {
    marginTop: 8,
  },
  filesTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  fileSize: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
  },
  submitContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
  submitButton: {
    backgroundColor: '#B45309',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ReportNewCaseScreen;
