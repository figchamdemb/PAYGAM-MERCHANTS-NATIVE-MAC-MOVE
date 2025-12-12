import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Platform,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Svg, Path, Circle, Line, G } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';

// Types
type SOSActiveScreenNavigationProp = StackNavigationProp<any>;

type SOSType = 'medical' | 'police' | 'fire';

interface Responder {
  id: string;
  name: string;
  role: string;
  organization: string;
  distance: string;
  status: 'approaching' | 'stationary' | 'unknown';
  type: SOSType;
  iconType: 'police' | 'volunteer' | 'citizen' | 'medical' | 'fire';
}

const { width, height } = Dimensions.get('window');

// Mock responders data
const allResponders: Responder[] = [
  // Medical responders
  { id: '1', name: 'Officer Lamin', role: 'First Aid Officer', organization: 'Gambia Police Force', distance: '120m', status: 'approaching', type: 'medical', iconType: 'police' },
  { id: '2', name: 'Fatou S.', role: 'Nurse Volunteer', organization: 'Community Volunteer', distance: '300m', status: 'stationary', type: 'medical', iconType: 'volunteer' },
  { id: '3', name: 'Musa J.', role: 'First Aid Trained', organization: 'Citizen', distance: '450m', status: 'unknown', type: 'medical', iconType: 'citizen' },
  // Police responders
  { id: '4', name: 'Sgt. Bojang', role: 'Patrol Officer', organization: 'Gambia Police Force', distance: '200m', status: 'approaching', type: 'police', iconType: 'police' },
  { id: '5', name: 'Modou K.', role: 'Security Guard', organization: 'Neighborhood Watch', distance: '350m', status: 'stationary', type: 'police', iconType: 'volunteer' },
  { id: '6', name: 'Binta T.', role: 'Community Watch', organization: 'Citizen', distance: '500m', status: 'unknown', type: 'police', iconType: 'citizen' },
  // Fire responders
  { id: '7', name: 'Amadou D.', role: 'Fire Volunteer', organization: 'Community Fire Team', distance: '280m', status: 'approaching', type: 'fire', iconType: 'fire' },
  { id: '8', name: 'Ebrima S.', role: 'Safety Officer', organization: 'Community Volunteer', distance: '400m', status: 'stationary', type: 'fire', iconType: 'volunteer' },
  { id: '9', name: 'Awa J.', role: 'Fire Extinguisher Owner', organization: 'Citizen', distance: '550m', status: 'unknown', type: 'fire', iconType: 'citizen' },
];

// SVG Icons
const ChevronDownIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 9l6 6 6-6" />
  </Svg>
);

const GearIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Svg>
);

const ShieldIcon = ({ color = '#FFFFFF', size = 12 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
);

const HeartHandIcon = ({ color = '#FFFFFF', size = 12 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </Svg>
);

const CrosshairsIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="#B45309">
    <Circle cx="12" cy="12" r="10" fill="none" stroke="#B45309" strokeWidth={2} />
    <Line x1="22" y1="12" x2="18" y2="12" stroke="#B45309" strokeWidth={2} />
    <Line x1="6" y1="12" x2="2" y2="12" stroke="#B45309" strokeWidth={2} />
    <Line x1="12" y1="6" x2="12" y2="2" stroke="#B45309" strokeWidth={2} />
    <Line x1="12" y1="22" x2="12" y2="18" stroke="#B45309" strokeWidth={2} />
  </Svg>
);

const SendIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="22" y1="2" x2="11" y2="13" />
    <Path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </Svg>
);

const UserShieldIcon = ({ color = '#3B82F6', size = 18 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </Svg>
);

const AmbulanceIcon = ({ color = '#FFFFFF', size = 16 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V3H9v2H6.5c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    <Path d="M12 6h-1v2H9v1h2v2h1V9h2V8h-2z" />
  </Svg>
);

const FireIcon = ({ color = '#FFFFFF', size = 16 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2zm-1-7.28V18h2v-5.28c.6-.35 1-.98 1-1.72 0-1.1-.9-2-2-2s-2 .9-2 2c0 .74.4 1.37 1 1.72z" />
  </Svg>
);

const PoliceIcon = ({ color = '#FFFFFF', size = 16 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
  </Svg>
);

const UserIcon = ({ color = '#6B7280', size = 18 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </Svg>
);

const SOSActiveScreen: React.FC = () => {
  const navigation = useNavigation<SOSActiveScreenNavigationProp>();
  const { theme, isDarkMode } = useTheme();
  
  // State
  const [selectedSOSType, setSelectedSOSType] = useState<SOSType>('medical');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [messageText, setMessageText] = useState('');
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_RECORDING_TIME = 10; // Maximum 10 seconds

  // Animation refs
  const pulseAnim = useRef(new Animated.Value(0.8)).current;
  const radarAnim = useRef(new Animated.Value(0)).current;
  const waveAnims = useRef([...Array(13)].map(() => new Animated.Value(10))).current;
  const sosTextPulse = useRef(new Animated.Value(1)).current;

  // Start animations
  useEffect(() => {
    // Pulse ring animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // Radar spin animation
    const radarLoop = Animated.loop(
      Animated.timing(radarAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );
    radarLoop.start();

    // SOS text pulse
    const textPulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(sosTextPulse, {
          toValue: 0.7,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(sosTextPulse, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    textPulseLoop.start();

    return () => {
      pulseLoop.stop();
      radarLoop.stop();
      textPulseLoop.stop();
    };
  }, []);

  // Wave animation for recording
  useEffect(() => {
    if (isRecording) {
      const animations = waveAnims.map((anim, index) => {
        const duration = 800 + (index % 3) * 200;
        return Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 24,
              duration: duration / 2,
              useNativeDriver: false,
            }),
            Animated.timing(anim, {
              toValue: 10,
              duration: duration / 2,
              useNativeDriver: false,
            }),
          ])
        );
      });
      animations.forEach((a) => a.start());
      return () => animations.forEach((a) => a.stop());
    } else {
      waveAnims.forEach((anim) => anim.setValue(10));
    }
  }, [isRecording]);

  // Recording timer - stops at MAX_RECORDING_TIME
  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_TIME - 1) {
            // Stop recording when max time reached
            setIsRecording(false);
            if (recordingIntervalRef.current) {
              clearInterval(recordingIntervalRef.current);
            }
            Alert.alert(
              '✅ Voice Note Saved',
              'Your 10-second voice note has been recorded and attached to your emergency alert.',
              [{ text: 'OK' }]
            );
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);
      return () => {
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
        }
      };
    }
  }, [isRecording]);

  // Handle recording toggle
  const handleRecordingToggle = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (recordingTime > 0) {
        Alert.alert(
          '✅ Voice Note Saved',
          `Your ${recordingTime}-second voice note has been recorded and attached to your emergency alert.`,
          [{ text: 'OK' }]
        );
      }
    } else {
      // Start recording
      setRecordingTime(0);
      setIsRecording(true);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      Alert.alert(
        '🚨 Emergency Message Sent',
        `Your message has been sent to all nearby responders:\n\n"${messageText.trim()}"`,
        [
          {
            text: 'OK',
            onPress: () => {
              setMessageText('');
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Empty Message',
        'Please type a message before sending.',
        [{ text: 'OK' }]
      );
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter responders by selected type
  const filteredResponders = allResponders.filter((r) => r.type === selectedSOSType);

  // Radar rotation
  const radarRotate = radarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Pulse opacity
  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0.8, 1.3],
    outputRange: [0.5, 0],
  });

  const getResponderIcon = (iconType: Responder['iconType']) => {
    switch (iconType) {
      case 'police':
        return <UserShieldIcon color="#3B82F6" size={18} />;
      case 'volunteer':
        return <HeartHandIcon color="#B45309" size={18} />;
      case 'medical':
        return <AmbulanceIcon color="#EF4444" size={18} />;
      case 'fire':
        return <FireIcon color="#F97316" size={18} />;
      default:
        return <UserIcon color="#6B7280" size={18} />;
    }
  };

  const getResponderBgColor = (iconType: Responder['iconType']) => {
    switch (iconType) {
      case 'police':
        return '#DBEAFE'; // blue-100
      case 'volunteer':
        return '#FFEDD5'; // orange-100
      case 'medical':
        return '#FEE2E2'; // red-100
      case 'fire':
        return '#FED7AA'; // orange-200
      default:
        return '#F3F4F6'; // gray-100
    }
  };

  const getResponderTextColor = (iconType: Responder['iconType']) => {
    switch (iconType) {
      case 'police':
        return '#2563EB'; // blue-600
      case 'volunteer':
        return '#B45309'; // amber-700
      case 'medical':
        return '#DC2626'; // red-600
      case 'fire':
        return '#EA580C'; // orange-600
      default:
        return '#6B7280'; // gray-500
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} translucent />

      {/* Main SOS Container (Red Background) */}
      <View style={styles.sosContainer}>
        {/* Top Bar */}
        <SafeAreaView style={styles.topBarSafe}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.chevronButton} onPress={handleGoBack}>
              <ChevronDownIcon />
            </TouchableOpacity>

            <View style={styles.topBarCenter}>
              <Animated.Text style={[styles.sosActiveText, { opacity: sosTextPulse }]}>
                SOS ACTIVE
              </Animated.Text>
              <Text style={styles.broadcastingText}>Broadcasting Location...</Text>
            </View>

            <TouchableOpacity style={styles.settingsButton}>
              <GearIcon />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Radar Section */}
        <View style={styles.radarSection}>
          {/* Radar Rings */}
          <View style={styles.radarRing1} />
          <View style={styles.radarRing2} />
          <View style={styles.radarRing3} />

          {/* Pulsing Effect */}
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: pulseAnim }],
                opacity: pulseOpacity,
              },
            ]}
          />

          {/* Scanner Sweep */}
          <Animated.View
            style={[
              styles.scannerContainer,
              { transform: [{ rotate: radarRotate }] },
            ]}
          >
            <View style={styles.scannerBeam} />
          </Animated.View>

          {/* User Center Dot */}
          <View style={styles.centerDot}>
            <View style={styles.centerDotInner} />
          </View>

          {/* Nearby Helpers on Radar */}
          {selectedSOSType === 'police' && (
            <View style={styles.helperPolice}>
              <View style={styles.helperIconPolice}>
                <ShieldIcon color="#FFFFFF" size={12} />
              </View>
              <Text style={styles.helperLabel}>Police</Text>
            </View>
          )}

          {selectedSOSType !== 'police' && (
            <View style={styles.helperVolunteer}>
              <View style={styles.helperIconVolunteer}>
                <HeartHandIcon color="#FFFFFF" size={12} />
              </View>
              <Text style={styles.helperLabel}>Helper</Text>
            </View>
          )}
        </View>

        {/* Bottom Sheet */}
        <View style={styles.bottomSheet}>
          {/* Drag Handle */}
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>

          <KeyboardAwareScrollView
            style={styles.bottomSheetContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraScrollHeight={Platform.OS === 'ios' ? 100 : 120}
            keyboardOpeningTime={0}
          >
              {/* SOS Type Toggles */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    selectedSOSType === 'medical' && styles.toggleButtonActive,
                  ]}
                  onPress={() => setSelectedSOSType('medical')}
                  activeOpacity={0.8}
                >
                  <AmbulanceIcon
                    color={selectedSOSType === 'medical' ? '#FFFFFF' : '#B45309'}
                    size={18}
                  />
                  <Text
                    style={[
                      styles.toggleText,
                      selectedSOSType === 'medical' && styles.toggleTextActive,
                    ]}
                  >
                    Medical
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    selectedSOSType === 'police' && styles.toggleButtonActive,
                  ]}
                  onPress={() => setSelectedSOSType('police')}
                  activeOpacity={0.8}
                >
                  <PoliceIcon
                    color={selectedSOSType === 'police' ? '#FFFFFF' : '#B45309'}
                    size={18}
                  />
                  <Text
                    style={[
                      styles.toggleText,
                      selectedSOSType === 'police' && styles.toggleTextActive,
                    ]}
                  >
                    Police
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    selectedSOSType === 'fire' && styles.toggleButtonActive,
                  ]}
                  onPress={() => setSelectedSOSType('fire')}
                  activeOpacity={0.8}
                >
                  <FireIcon
                    color={selectedSOSType === 'fire' ? '#FFFFFF' : '#B45309'}
                    size={18}
                  />
                  <Text
                    style={[
                      styles.toggleText,
                      selectedSOSType === 'fire' && styles.toggleTextActive,
                    ]}
                  >
                    Fire
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Voice Recorder - Tap to Record */}
              <TouchableOpacity 
                style={[styles.recorderCard, isRecording && styles.recorderCardActive]}
                onPress={handleRecordingToggle}
                activeOpacity={0.85}
              >
                <View style={styles.recorderHeader}>
                  <View style={styles.recorderStatus}>
                    <View style={[styles.recordingDot, isRecording && styles.recordingDotActive]} />
                    <Text style={styles.recordingLabel}>
                      {isRecording ? 'Recording...' : 'Tap to Record Voice Note'}
                    </Text>
                  </View>
                  <Text style={styles.recordingTime}>
                    {isRecording ? formatTime(recordingTime) : `Max ${MAX_RECORDING_TIME}s`}
                  </Text>
                </View>

                {/* Progress Bar when recording */}
                {isRecording && (
                  <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${(recordingTime / MAX_RECORDING_TIME) * 100}%` }]} />
                  </View>
                )}

                {/* Waveform */}
                <View style={styles.waveformContainer}>
                  {waveAnims.map((anim, index) => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.waveBar,
                        {
                          height: isRecording ? anim : 10,
                          opacity: isRecording ? (index % 2 === 0 ? 1 : 0.6) : 0.3,
                        },
                      ]}
                    />
                  ))}
                </View>

                <Text style={styles.recorderHint}>
                  {isRecording ? 'Tap to stop recording' : 'Record a quick voice message (max 10 seconds)'}
                </Text>
              </TouchableOpacity>

              {/* Emergency Details Input */}
              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>EMERGENCY DETAILS</Text>
                <View style={styles.detailsContainer}>
                  <TextInput
                    style={styles.detailsInput}
                    placeholder="Describe your emergency situation...\n\nProvide any important details that can help responders."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={messageText}
                    onChangeText={setMessageText}
                  />
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendMessage}
                    activeOpacity={0.85}
                  >
                    <SendIcon />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Nearby Responders List */}
              <View style={styles.respondersSection}>
                <View style={styles.respondersTitleRow}>
                  <CrosshairsIcon />
                  <Text style={styles.respondersTitle}>Nearby Responders</Text>
                </View>

                <View style={styles.respondersList}>
                  {filteredResponders.map((responder, index) => (
                    <View
                      key={responder.id}
                      style={[
                        styles.responderCard,
                        index === filteredResponders.length - 1 && { opacity: 0.7 },
                      ]}
                    >
                      <View style={styles.responderLeft}>
                        <View
                          style={[
                            styles.responderAvatar,
                            { backgroundColor: getResponderBgColor(responder.iconType) },
                          ]}
                        >
                          {getResponderIcon(responder.iconType)}
                        </View>
                        <View style={styles.responderInfo}>
                          <Text style={styles.responderName}>{responder.name}</Text>
                          <Text
                            style={[
                              styles.responderRole,
                              { color: getResponderTextColor(responder.iconType) },
                            ]}
                          >
                            {responder.organization}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.responderRight}>
                        <Text style={styles.responderDistance}>{responder.distance}</Text>
                        <Text style={styles.responderStatus}>
                          {responder.status.charAt(0).toUpperCase() + responder.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </KeyboardAwareScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DC2626', // red-600
  },
  sosContainer: {
    flex: 1,
    backgroundColor: '#DC2626',
  },

  // Top Bar
  topBarSafe: {
    zIndex: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 16,
    paddingBottom: 16,
  },
  chevronButton: {
    padding: 4,
  },
  topBarCenter: {
    alignItems: 'center',
  },
  sosActiveText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
  },
  broadcastingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  settingsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 50,
  },

  // Radar Section
  radarSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -80,
  },
  radarRing1: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)', // red-400/30
  },
  radarRing2: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.4)', // red-400/40
  },
  radarRing3: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.5)', // red-400/50
  },
  pulseRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(239, 68, 68, 0.3)', // red-500/30
  },
  scannerContainer: {
    position: 'absolute',
    width: 320,
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.3,
  },
  scannerBeam: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderTopLeftRadius: 160,
    backgroundColor: 'transparent',
    borderLeftWidth: 160,
    borderTopWidth: 160,
    borderLeftColor: 'transparent',
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    transform: [{ rotate: '-45deg' }],
  },
  centerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
    zIndex: 10,
  },
  centerDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },

  // Helpers on radar
  helperPolice: {
    position: 'absolute',
    top: '25%',
    right: '25%',
    alignItems: 'center',
    transform: [{ translateX: 16 }, { translateY: -16 }],
  },
  helperVolunteer: {
    position: 'absolute',
    bottom: '33%',
    left: '25%',
    alignItems: 'center',
    transform: [{ translateX: -24 }, { translateY: 8 }],
  },
  helperIconPolice: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E3A5F', // blue-900
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  helperIconVolunteer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#B45309',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  helperLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    overflow: 'hidden',
  },

  // Bottom Sheet
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
    zIndex: 30,
  },
  dragHandleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  dragHandle: {
    width: 48,
    height: 6,
    backgroundColor: '#D1D5DB', // gray-300
    borderRadius: 3,
  },
  bottomSheetContent: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },

  // Toggle Buttons
  toggleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6', // gray-100
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-200
  },
  toggleButtonActive: {
    backgroundColor: '#B45309',
    borderColor: '#B45309',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151', // gray-700
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },

  // Recorder Card
  recorderCard: {
    backgroundColor: '#FEF2F2', // red-50
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2', // red-100
  },
  recorderCardActive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
    borderWidth: 2,
  },
  recorderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recorderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB', // gray when not recording
  },
  recordingDotActive: {
    backgroundColor: '#DC2626', // red when recording
  },
  recordingLabel: {
    color: '#991B1B', // red-800
    fontSize: 14,
    fontWeight: '600',
  },
  recordingTime: {
    color: '#DC2626', // red-600
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: '#FCA5A5',
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#DC2626',
    borderRadius: 2,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    gap: 2,
  },
  waveBar: {
    width: 4,
    backgroundColor: '#B45309',
    borderRadius: 2,
  },
  recorderHint: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },

  // Message Input - Multiline Description Box
  detailsSection: {
    marginBottom: 20,
  },
  detailsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  detailsContainer: {
    position: 'relative',
  },
  detailsInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    paddingRight: 60,
    paddingBottom: 16,
    fontSize: 14,
    color: '#374151',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    textAlignVertical: 'top',
  },
  sendButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#B45309',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  // Responders Section
  respondersSection: {
    flex: 1,
  },
  respondersTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  respondersTitle: {
    color: '#1F2937', // gray-800
    fontSize: 18,
    fontWeight: '700',
  },
  respondersList: {
    gap: 12,
  },
  responderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6', // gray-100
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  responderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  responderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  responderInfo: {
    gap: 2,
  },
  responderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937', // gray-800
  },
  responderRole: {
    fontSize: 12,
    fontWeight: '500',
  },
  responderRight: {
    alignItems: 'flex-end',
  },
  responderDistance: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937', // gray-800
  },
  responderStatus: {
    fontSize: 10,
    color: '#9CA3AF', // gray-400
  },
});

export default SOSActiveScreen;
