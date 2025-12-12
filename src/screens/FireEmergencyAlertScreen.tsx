import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faCog,
  faFireExtinguisher,
  faMapMarkerAlt,
  faInfoCircle,
  faVolumeUp,
  faChevronDown,
  faUser,
  faHandsHelping,
  faMicrophone,
  faStop,
  faTimes,
  faPaperPlane,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const FireEmergencyAlertScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const [fireType, setFireType] = useState('house');
  const [context, setContext] = useState('me');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingText, setRecordingText] = useState('Tap microphone to explain situation...');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  
  const contextAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnims = useRef([
    new Animated.Value(8),
    new Animated.Value(5),
    new Animated.Value(2),
    new Animated.Value(4),
    new Animated.Value(3),
    new Animated.Value(5),
  ]).current;

  useEffect(() => {
    if (isRecording) {
      startRecordingAnimation();
    } else {
      stopRecordingAnimation();
    }
  }, [isRecording]);

  const startRecordingAnimation = () => {
    const animations = waveAnims.map((anim, index) => 
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 20,
            duration: 500,
            delay: index * 100,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 8,
            duration: 500,
            delay: index * 100,
            useNativeDriver: false,
          }),
        ])
      )
    );
    Animated.parallel(animations).start();
  };

  const stopRecordingAnimation = () => {
    waveAnims.forEach(anim => anim.stop());
    waveAnims.forEach(anim => anim.setValue(8));
  };

  const handleContextChange = (newContext: string) => {
    setContext(newContext);
    Animated.timing(contextAnim, {
      toValue: newContext === 'me' ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleFireTypeChange = (type: string) => {
    setFireType(type);
    setSelectedOptions({});
  };

  const handleOptionSelect = (question: string, answer: string) => {
    setSelectedOptions(prev => ({ ...prev, [question]: answer }));
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setRecordingText('Audio Recorded (0:12)');
    } else {
      setIsRecording(true);
      setRecordingText('Recording... 0:12');
    }
  };

  const playAudio = (id: string) => {
    // Placeholder for audio playback
    console.log('Playing audio for:', id);
  };

  const getDynamicQuestions = () => {
    const questions = [];
    
    if (fireType === 'house') {
      questions.push({
        id: 'trapped',
        question: 'Are people trapped inside?',
        options: ['YES', 'NO', 'NOT SURE'],
        colors: ['#EF4444', '#10B981', '#6B7280']
      });
      questions.push({
        id: 'gas',
        question: 'Are there gas cylinders?',
        options: ['YES', 'NO', 'NOT SURE'],
        colors: ['#EF4444', '#10B981', '#6B7280']
      });
    } else if (fireType === 'vehicle') {
      questions.push({
        id: 'inside',
        question: 'Is anyone inside the vehicle?',
        options: ['YES', 'NO', 'NOT SURE'],
        colors: ['#EF4444', '#10B981', '#6B7280']
      });
      questions.push({
        id: 'fuel',
        question: 'Is the vehicle carrying fuel?',
        options: ['YES', 'NO', 'NOT SURE'],
        colors: ['#EF4444', '#10B981', '#6B7280']
      });
    } else if (fireType === 'bush') {
      questions.push({
        id: 'near_houses',
        question: 'Is it near houses?',
        options: ['YES', 'NO'],
        colors: ['#EF4444', '#10B981']
      });
    }

    if (context === 'other') {
      questions.push({
        id: 'breathing',
        question: 'Is the person breathing?',
        options: ['YES', 'NO'],
        colors: ['#10B981', '#EF4444']
      });
    }

    return questions;
  };

  const handleSendAlert = () => {
    console.log('Sending fire emergency alert:', { fireType, context, selectedOptions });
  };

  const handleCancel = () => {
    navigation.goBack();
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
            onPress={() => navigation.goBack()}
          >
            <FontAwesomeIcon icon={faArrowLeft} size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fire Emergency</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <FontAwesomeIcon icon={faCog} size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Service Indicator Banner (Fire Specific) */}
        <LinearGradient
          colors={['#DC2626', '#B45309']}
          style={styles.banner}
        >
          {/* Decorative Background Elements */}
          <View style={styles.bannerDecoration1} />
          <View style={styles.bannerDecoration2} />
          
          <View style={styles.bannerContent}>
            <View style={styles.bannerIconContainer}>
              <FontAwesomeIcon icon={faFireExtinguisher} size={28} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.bannerSubtitle}>Emergency Service</Text>
              <Text style={styles.bannerTitle}>Fire & Rescue</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.mainContent}>
          
          {/* Section 1: Location (Critical) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                <FontAwesomeIcon icon={faMapMarkerAlt} size={14} color="#B45309" /> Incident Location
              </Text>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>GPS ON</Text>
              </View>
            </View>
            
            <View style={styles.locationContainer}>
              <TouchableOpacity style={styles.locationOption}>
                <View style={styles.radioButton}>
                  <View style={styles.radioButtonInner} />
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationTitle}>Current Location</Text>
                  <Text style={styles.locationCoords}>Lat: 13.4549° N, Long: 16.5790° W</Text>
                </View>
                {/* Mini Map */}
                <View style={styles.miniMap}>
                  <View style={styles.mapGrid} />
                  <View style={styles.mapPinContainer}>
                    <View style={styles.mapPin} />
                    <View style={styles.mapPinPulse} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Section 2: Incident Details (Smart Form) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                <FontAwesomeIcon icon={faInfoCircle} size={14} color="#64748B" /> Fire Details
              </Text>
              <TouchableOpacity style={styles.voiceAssistButton}>
                <FontAwesomeIcon icon={faVolumeUp} size={12} color="#B45309" />
                <Text style={styles.voiceAssistText}>Voice Assist</Text>
              </TouchableOpacity>
            </View>
            
            {/* 1. Fire Type Selector */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelContainer}>
                <Text style={styles.inputLabel}>What is burning?</Text>
                <TouchableOpacity onPress={() => playAudio('type')} style={styles.audioButton}>
                  <FontAwesomeIcon icon={faVolumeUp} size={10} color="#B45309" />
                </TouchableOpacity>
              </View>
              <View style={styles.selectContainer}>
                <View style={styles.selectIconContainer}>
                  <FontAwesomeIcon icon={faFireExtinguisher} size={16} color="#B45309" />
                </View>
                <TextInput
                  style={styles.selectInput}
                  value={fireType === 'house' ? 'House / Building Fire' : 
                         fireType === 'vehicle' ? 'Car / Vehicle Fire' :
                         fireType === 'bush' ? 'Bush / Grass Fire' :
                         fireType === 'electrical' ? 'Electrical / Pole' :
                         'Gas Explosion'}
                  editable={false}
                />
                <FontAwesomeIcon icon={faChevronDown} size={12} color="#64748B" style={styles.selectArrow} />
              </View>
            </View>

            {/* 2. Context Toggle (Who is involved?) */}
            <View style={styles.toggleContainer}>
              <Animated.View 
                style={[
                  styles.toggleBackground,
                  {
                    transform: [{ translateX: contextAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [4, Dimensions.get('window').width / 2 - 4]
                    }) }]
                  }
                ]}
              />
              <TouchableOpacity 
                style={[styles.toggleButton, context === 'me' && styles.toggleButtonActive]}
                onPress={() => handleContextChange('me')}
              >
                <FontAwesomeIcon icon={faUser} size={12} color={context === 'me' ? '#B45309' : '#64748B'} />
                <Text style={[styles.toggleText, context === 'me' && styles.toggleTextActive]}>My Property</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleButton, context === 'other' && styles.toggleButtonActive]}
                onPress={() => handleContextChange('other')}
              >
                <FontAwesomeIcon icon={faHandsHelping} size={12} color={context === 'other' ? '#B45309' : '#64748B'} />
                <Text style={[styles.toggleText, context === 'other' && styles.toggleTextActive]}>Helping Others</Text>
              </TouchableOpacity>
            </View>

            {/* 3. Dynamic Questions Container */}
            <View style={styles.dynamicQuestionsContainer}>
              {getDynamicQuestions().map((question, index) => (
                <View key={question.id} style={styles.questionCard}>
                  <View style={styles.questionHeader}>
                    <Text style={styles.questionText}>{question.question}</Text>
                    <TouchableOpacity onPress={() => playAudio(question.id)} style={styles.audioButton}>
                      <FontAwesomeIcon icon={faVolumeUp} size={12} color="#B45309" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.optionsContainer}>
                    {question.options.map((option, optIndex) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          selectedOptions[question.id] === option && styles.optionButtonSelected
                        ]}
                        onPress={() => handleOptionSelect(question.id, option)}
                      >
                        <Text style={[
                          styles.optionText,
                          selectedOptions[question.id] === option && styles.optionTextSelected
                        ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>

            {/* 4. Voice Recording (Prominent) */}
            <View style={styles.recordingSection}>
              <View style={styles.recordingHeader}>
                <Text style={styles.recordingLabel}>Record Description</Text>
                <Text style={styles.languageSupport}>Wolof / Mandinka / English</Text>
              </View>
              
              <View style={styles.recordingContainer}>
                <TouchableOpacity 
                  style={[
                    styles.recordButton,
                    isRecording && styles.recordButtonRecording
                  ]}
                  onPress={toggleRecording}
                >
                  <View style={[
                    styles.recordButtonInner,
                    isRecording && styles.recordButtonInnerRecording
                  ]}>
                    <FontAwesomeIcon 
                      icon={isRecording ? faStop : faMicrophone} 
                      size={24} 
                      color={isRecording ? '#EF4444' : '#64748B'} 
                    />
                  </View>
                  {isRecording && (
                    <Animated.View 
                      style={[
                        styles.recordingPulse,
                        {
                          transform: [{ scale: pulseAnim }],
                          opacity: pulseAnim.interpolate({
                            inputRange: [0.5, 1],
                            outputRange: [0.3, 0.7]
                          })
                        }
                      ]}
                    />
                  )}
                </TouchableOpacity>
                
                <View style={styles.recordingDisplay}>
                  <Text style={[
                    styles.recordingText,
                    isRecording && styles.recordingTextActive
                  ]}>
                    {recordingText}
                  </Text>
                  {/* Fake Waveform */}
                  {isRecording && (
                    <View style={styles.waveformContainer}>
                      {waveAnims.map((anim, index) => (
                        <Animated.View
                          key={index}
                          style={[
                            styles.waveBar,
                            {
                              height: anim,
                              backgroundColor: '#B45309',
                              opacity: 0.8
                            }
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Disclaimer */}
          <Text style={styles.disclaimer}>
            False fire alarms divert resources from real emergencies and are punishable by law.
          </Text>
        </View>
      </ScrollView>

      {/* Floating Footer Action */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <FontAwesomeIcon icon={faTimes} size={20} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.sendButton} onPress={handleSendAlert}>
            <View style={styles.sendButtonIcon}>
              <FontAwesomeIcon icon={faPaperPlane} size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.sendButtonText}>Send Alert</Text>
            <View style={styles.sendButtonArrows}>
              <FontAwesomeIcon icon={faChevronRight} size={10} color="#FFFFFF" />
              <FontAwesomeIcon icon={faChevronRight} size={10} color="#FFFFFF" />
              <FontAwesomeIcon icon={faChevronRight} size={10} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    backgroundColor: '#B45309',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    flex: 1,
  },
  banner: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  bannerDecoration1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderRadius: 80,
    filter: 'blur(40px)',
  },
  bannerDecoration2: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 128,
    height: 128,
    backgroundColor: 'rgba(127, 29, 29, 0.2)',
    borderRadius: 64,
    filter: 'blur(20px)',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  bannerIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#FED7AA',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    backgroundColor: 'rgba(248, 250, 252, 0.5)',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    color: '#065F46',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  voiceAssistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  voiceAssistText: {
    fontSize: 10,
    color: '#B45309',
    fontWeight: '700',
  },
  locationContainer: {
    padding: 12,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#B45309',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#B45309',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B45309',
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 12,
    color: '#64748B',
  },
  miniMap: {
    width: 48,
    height: 48,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    position: 'relative',
  },
  mapGrid: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#FED7AA',
    opacity: 0.5,
  },
  mapPinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -5 }, { translateY: -5 }],
  },
  mapPin: {
    width: 10,
    height: 10,
    backgroundColor: '#B45309',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  mapPinPulse: {
    width: 24,
    height: 24,
    backgroundColor: '#B45309',
    borderRadius: 12,
    position: 'absolute',
    top: -7,
    left: -7,
    opacity: 0.3,
  },
  inputGroup: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  audioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  selectContainer: {
    position: 'relative',
  },
  selectIconContainer: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -8 }],
    zIndex: 1,
  },
  selectInput: {
    width: '100%',
    paddingLeft: 40,
    paddingRight: 40,
    paddingVertical: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  selectArrow: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -6 }],
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 4,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    position: 'relative',
  },
  toggleBackground: {
    position: 'absolute',
    left: 4,
    top: 4,
    bottom: 4,
    width: '50%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
    position: 'relative',
    zIndex: 1,
  },
  toggleButtonActive: {
    // Active state handled by background animation
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  toggleTextActive: {
    color: '#B45309',
  },
  dynamicQuestionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  questionCard: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionButtonSelected: {
    backgroundColor: '#B45309',
    borderColor: '#B45309',
  },
  optionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  recordingSection: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  recordingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordingLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  languageSupport: {
    fontSize: 10,
    color: '#B45309',
    fontWeight: '700',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recordButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  recordButtonRecording: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  recordButtonInner: {
    position: 'relative',
    zIndex: 1,
  },
  recordButtonInnerRecording: {
    // Recording state styling
  },
  recordingPulse: {
    position: 'absolute',
    inset: 0,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  recordingDisplay: {
    flex: 1,
    height: 56,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    paddingHorizontal: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  recordingText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  recordingTextActive: {
    color: '#1F2937',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 24,
    justifyContent: 'center',
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
  },
  disclaimer: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 20,
  },
  footerContent: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cancelButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#B45309',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    overflow: 'hidden',
  },
  sendButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sendButtonArrows: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: -2,
    paddingRight: 12,
  },
});

export default FireEmergencyAlertScreen;
