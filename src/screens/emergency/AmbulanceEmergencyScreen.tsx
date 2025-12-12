/**
 * AmbulanceEmergencyScreen - Medical Emergency Report Screen
 * Based on the documentation design
 * Features: Location, Provider selection, Nature of Emergency, Critical Questions,
 * Patient count, Additional details with camera/mic, Request Ambulance button
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Switch,
  Platform,
  PermissionsAndroid,
  Alert,
  Modal,
  Image,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import EmergencyResponseModal from '../../components/EmergencyResponseModal';
import { launchCamera, CameraOptions, ImagePickerResponse } from 'react-native-image-picker';
import DocumentPicker, { types } from 'react-native-document-picker';
import Geolocation from '@react-native-community/geolocation';

// ============ SVG ICON COMPONENTS ============

const ArrowLeftIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12L12 19M5 12L12 5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MapPinIcon = ({ size = 20, color = '#B45309' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </Svg>
);

const LocationCrosshairIcon = ({ size = 16, color = '#B45309' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={2} />
    <Path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const HomeIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </Svg>
);

const TruckMedicalIcon = ({ size = 24, color = '#B45309' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </Svg>
);

const HeartPulseIcon = ({ size = 24, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </Svg>
);

const DoctorIcon = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM16 11V9M16 9V7M16 9H14M16 9H18" />
  </Svg>
);

const CheckCircleIcon = ({ size = 16, color = '#B45309' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Path d="M22 4L12 14.01l-3-3" stroke="#FFFFFF" strokeWidth={2} fill="none" />
  </Svg>
);

const MinusIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12h14" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const PlusIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const MicIcon = ({ size = 20, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke={color} strokeWidth={2} />
    <Path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const CameraIcon = ({ size = 18, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke={color} strokeWidth={2} />
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth={2} />
  </Svg>
);

// Nature of emergency options
const NATURE_OPTIONS = ['Accident', 'Cardiac', 'Maternity', 'Breathing', 'Bleeding', 'Other'];

// Provider options
const PROVIDERS = [
  { id: 'public', name: 'Public EMS', subtitle: 'Free Service', icon: TruckMedicalIcon, color: '#B45309', bgColor: '#FFF7ED' },
  { id: 'africmed', name: 'Africmed', subtitle: 'Premium Plan', icon: DoctorIcon, color: '#3B82F6', bgColor: '#EFF6FF' },
  { id: 'medicare', name: 'Medicare', subtitle: 'Pay on Arrival', icon: HeartPulseIcon, color: '#10B981', bgColor: '#ECFDF5' },
];

const AmbulanceEmergencyScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { theme, isDarkMode } = useTheme();
  
  // GPS Location State
  const [currentLocation, setCurrentLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [locationAddress, setLocationAddress] = useState('Getting location...');
  const [locationCoords, setLocationCoords] = useState('Fetching GPS...');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  
  // State
  const [locationType, setLocationType] = useState<'current' | 'home'>('current');
  const [sosEnabled, setSosEnabled] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('public');
  const [selectedNature, setSelectedNature] = useState('Accident');
  const [isConscious, setIsConscious] = useState<boolean | null>(true);
  const [isBreathing, setIsBreathing] = useState<boolean | null>(false);
  const [severeBleeding, setSevereBleeding] = useState<boolean | null>(false);
  const [patientCount, setPatientCount] = useState(1);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  // Media state
  const [attachedPhoto, setAttachedPhoto] = useState<{uri: string; name: string} | null>(null);
  const [attachedAudio, setAttachedAudio] = useState<{name: string; duration: number} | null>(null);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState('00:00');
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingSecondsRef = useRef(0);
  const MAX_RECORDING_SECONDS = 10;


  // Keyboard visibility listener
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Request location permission
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    
    try {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (granted) return true;
      
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Ambulance Emergency needs your location to dispatch medical help.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Location permission error:', err);
      return false;
    }
  };

  // Get current GPS location
  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setLocationAddress('Location permission denied');
      setLocationCoords('Please enable location');
      setIsLoadingLocation(false);
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCurrentLocation({ latitude, longitude });
        setLocationAddress('Current Location');
        setLocationCoords(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} (±${Math.round(accuracy || 5)}m)`);
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('GPS Error:', error);
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            setCurrentLocation({ latitude, longitude });
            setLocationAddress('Current Location');
            setLocationCoords(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} (±${Math.round(accuracy || 10)}m)`);
            setIsLoadingLocation(false);
          },
          () => {
            setLocationAddress('Unable to get location');
            setLocationCoords('Tap to retry');
            setIsLoadingLocation(false);
          },
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 }
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  };

  // Fetch location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainDrawer' }],
    });
  };

  const handleRequestAmbulance = () => {
    console.log('Requesting Ambulance:', {
      locationType,
      sosEnabled,
      selectedProvider,
      selectedNature,
      isConscious,
      isBreathing,
      severeBleeding,
      patientCount,
      additionalDetails,
      attachedPhoto,
      attachedAudio,
    });
    // Generate reference number and show response modal
    setReferenceNumber('AMB-' + Date.now().toString().slice(-8));
    setShowResponseModal(true);
  };

  const handleCallRequest = (wantsCall: boolean) => {
    console.log('User wants callback:', wantsCall);
  };

  const handleCloseModal = () => {
    setShowResponseModal(false);
    navigation.goBack();
  };

  // Request permissions for camera and audio
  const requestPermissions = async (type: 'camera' | 'audio'): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    
    try {
      if (type === 'camera') {
        // Check if permission is already granted
        const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (hasPermission) return true;
        
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'Medical Emergency needs camera access to capture photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
            'Camera Permission Required',
            'Please go to Settings > Apps > EGOV-CITIZEN > Permissions and enable Camera.',
            [{ text: 'OK' }]
          );
          return false;
        }
        return false;
      } else if (type === 'audio') {
        // Check if permission is already granted
        const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        if (hasPermission) return true;
        
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'Medical Emergency needs microphone access to record voice notes.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
            'Microphone Permission Required',
            'Please go to Settings > Apps > EGOV-CITIZEN > Permissions and enable Microphone.',
            [{ text: 'OK' }]
          );
          return false;
        }
        return false;
      }
    } catch (err) {
      console.error('Permission error:', err);
      Alert.alert('Permission Error', 'Failed to request permission. Please try again.');
    }
    return false;
  };

  // Format recording time
  const formatRecordingTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle taking a photo with camera
  const handleAddPhoto = async () => {
    try {
      const hasPermission = await requestPermissions('camera');
      if (!hasPermission) {
        return;
      }
      
      const options: CameraOptions = {
        mediaType: 'photo',
        quality: 0.8,
        cameraType: 'back',
        saveToPhotos: false,
        includeBase64: false,
      };
      
      launchCamera(options, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log('User cancelled camera');
          return;
        }
        if (response.errorCode) {
          console.error('Camera error:', response.errorCode, response.errorMessage);
          Alert.alert('Camera Error', response.errorMessage || 'Failed to capture photo. Please try again.');
          return;
        }
        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          if (asset.uri) {
            const fileName = `medical_photo_${Date.now()}.jpg`;
            setAttachedPhoto({
              uri: asset.uri,
              name: fileName,
            });
            Alert.alert('Success', 'Photo has been attached to your request.');
          }
        }
      });
    } catch (error) {
      console.error('handleAddPhoto error:', error);
      Alert.alert('Error', 'Failed to open camera. Please try again.');
    }
  };

  // Handle audio recording
  const handleRecordAudio = () => {
    Alert.alert(
      'Add Voice Note',
      'How would you like to add audio?',
      [
        {
          text: 'Record Voice',
          onPress: () => setShowAudioRecorder(true),
        },
        {
          text: 'Pick Audio File',
          onPress: handlePickAudioFile,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  // Pick audio file from device
  const handlePickAudioFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [types.audio],
        copyTo: 'cachesDirectory',
      });
      
      if (result && result.length > 0) {
        const file = result[0];
        setAttachedAudio({
          name: file.name || `audio_${Date.now()}.mp3`,
          duration: 0,
        });
        Alert.alert('Audio Added', 'Audio file has been attached to your request.');
      }
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Audio picker cancelled');
      } else {
        console.error('Audio picker error:', err);
        Alert.alert('Error', 'Failed to pick audio file. Please try again.');
      }
    }
  };

  // Start audio recording
  const startRecording = async () => {
    const hasPermission = await requestPermissions('audio');
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Microphone permission is needed for voice notes.');
      return;
    }
    
    recordingSecondsRef.current = 0;
    setRecordingDuration('00:00');
    setIsRecording(true);
    
    recordingTimerRef.current = setInterval(() => {
      recordingSecondsRef.current += 1;
      setRecordingDuration(formatRecordingTime(recordingSecondsRef.current));
      
      if (recordingSecondsRef.current >= MAX_RECORDING_SECONDS) {
        stopRecording(true);
      }
    }, 1000);
  };

  // Stop audio recording
  const stopRecording = async (saveFile: boolean = true) => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    setIsRecording(false);
    
    if (saveFile && recordingSecondsRef.current > 0) {
      const duration = recordingSecondsRef.current;
      setAttachedAudio({
        name: `voice_note_${duration}s.mp3`,
        duration: duration,
      });
      setShowAudioRecorder(false);
      Alert.alert('Recording Saved', `Voice note (${duration} seconds) has been attached.`);
    }
    
    recordingSecondsRef.current = 0;
    setRecordingDuration('00:00');
  };

  // Cancel audio recording
  const cancelRecording = async () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecording(false);
    recordingSecondsRef.current = 0;
    setRecordingDuration('00:00');
    setShowAudioRecorder(false);
  };

  const updatePatientCount = (change: number) => {
    const newCount = patientCount + change;
    if (newCount >= 1 && newCount <= 20) {
      setPatientCount(newCount);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeftIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Medical Emergency</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={[styles.sosText, sosEnabled && styles.sosTextActive]}>
            {sosEnabled ? 'SOS ON' : 'SOS OFF'}
          </Text>
          <Switch
            value={sosEnabled}
            onValueChange={setSosEnabled}
            trackColor={{ false: 'rgba(127, 29, 29, 0.4)', true: '#DC2626' }}
            thumbColor="#FFFFFF"
            style={styles.sosSwitch}
          />
        </View>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAwareScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={Platform.OS === 'ios' ? 100 : 120}
          keyboardOpeningTime={0}
        >
          
          {/* Location Selector */}
          <View style={styles.locationCard}>
            <View style={styles.locationTabs}>
              <TouchableOpacity
                style={[styles.locationTab, locationType === 'current' && styles.locationTabActive]}
                onPress={() => setLocationType('current')}
              >
                <LocationCrosshairIcon size={16} color={locationType === 'current' ? '#B45309' : '#6B7280'} />
                <Text style={[styles.locationTabText, locationType === 'current' && styles.locationTabTextActive]}>
                  Current
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.locationTab, locationType === 'home' && styles.locationTabActive]}
                onPress={() => setLocationType('home')}
              >
                <HomeIcon size={16} color={locationType === 'home' ? '#B45309' : '#6B7280'} />
                <Text style={[styles.locationTabText, locationType === 'home' && styles.locationTabTextActive]}>
                  Home
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.locationInfo}>
              <View style={styles.locationPinContainer}>
                <MapPinIcon size={24} color="#B45309" />
              </View>
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Dispatch Location</Text>
                <Text style={styles.locationAddress}>{locationAddress}</Text>
                <Text style={styles.locationCoords}>{locationCoords}</Text>
              </View>
              <TouchableOpacity onPress={getCurrentLocation}>
                <Text style={styles.editLink}>{isLoadingLocation ? 'Loading...' : 'Refresh'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Provider Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>SELECT PROVIDER</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllLink}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.providerScroll}>
              {PROVIDERS.map((provider) => {
                const IconComponent = provider.icon;
                const isSelected = selectedProvider === provider.id;
                return (
                  <TouchableOpacity
                    key={provider.id}
                    style={[
                      styles.providerCard,
                      isSelected && styles.providerCardActive,
                      { backgroundColor: isSelected ? provider.bgColor : '#FFFFFF' }
                    ]}
                    onPress={() => setSelectedProvider(provider.id)}
                  >
                    {isSelected && (
                      <View style={styles.providerCheck}>
                        <CheckCircleIcon size={16} color="#B45309" />
                      </View>
                    )}
                    <View style={[styles.providerIcon, { backgroundColor: provider.bgColor }]}>
                      <IconComponent size={24} color={provider.color} />
                    </View>
                    <Text style={styles.providerName}>{provider.name}</Text>
                    <Text style={styles.providerSubtitle}>{provider.subtitle}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Situation Assessment */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>SITUATION ASSESSMENT</Text>
            
            {/* Nature of Emergency */}
            <View style={styles.subsection}>
              <Text style={styles.subsectionLabel}>NATURE OF EMERGENCY</Text>
              <View style={styles.natureGrid}>
                {NATURE_OPTIONS.map((nature) => (
                  <TouchableOpacity
                    key={nature}
                    style={[styles.natureButton, selectedNature === nature && styles.natureButtonActive]}
                    onPress={() => setSelectedNature(nature)}
                  >
                    <Text style={[styles.natureButtonText, selectedNature === nature && styles.natureButtonTextActive]}>
                      {nature}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Critical Questions */}
            <View style={styles.questionsCard}>
              {/* Is patient conscious? */}
              <View style={styles.questionRow}>
                <Text style={styles.questionText}>Is patient conscious?</Text>
                <View style={styles.questionButtons}>
                  <TouchableOpacity
                    style={[styles.questionBtn, isConscious === true && styles.questionBtnYes]}
                    onPress={() => setIsConscious(true)}
                  >
                    <Text style={[styles.questionBtnText, isConscious === true && styles.questionBtnTextYes]}>YES</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.questionBtn, isConscious === false && styles.questionBtnNo]}
                    onPress={() => setIsConscious(false)}
                  >
                    <Text style={[styles.questionBtnText, isConscious === false && styles.questionBtnTextNo]}>NO</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.questionDivider} />

              {/* Is patient breathing? */}
              <View style={styles.questionRow}>
                <Text style={styles.questionText}>Is patient breathing?</Text>
                <View style={styles.questionButtons}>
                  <TouchableOpacity
                    style={[styles.questionBtn, isBreathing === true && styles.questionBtnYes]}
                    onPress={() => setIsBreathing(true)}
                  >
                    <Text style={[styles.questionBtnText, isBreathing === true && styles.questionBtnTextYes]}>YES</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.questionBtn, isBreathing === false && styles.questionBtnNo]}
                    onPress={() => setIsBreathing(false)}
                  >
                    <Text style={[styles.questionBtnText, isBreathing === false && styles.questionBtnTextNo]}>NO</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.questionDivider} />

              {/* Severe bleeding? */}
              <View style={styles.questionRow}>
                <Text style={styles.questionText}>Severe bleeding?</Text>
                <View style={styles.questionButtons}>
                  <TouchableOpacity
                    style={[styles.questionBtn, severeBleeding === true && styles.questionBtnYes]}
                    onPress={() => setSevereBleeding(true)}
                  >
                    <Text style={[styles.questionBtnText, severeBleeding === true && styles.questionBtnTextYes]}>YES</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.questionBtn, severeBleeding === false && styles.questionBtnNo]}
                    onPress={() => setSevereBleeding(false)}
                  >
                    <Text style={[styles.questionBtnText, severeBleeding === false && styles.questionBtnTextNo]}>NO</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Patient Count */}
            <View style={styles.patientCountCard}>
              <Text style={styles.patientCountLabel}>Number of Patients</Text>
              <View style={styles.patientCounter}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => updatePatientCount(-1)}
                >
                  <MinusIcon size={16} color="#6B7280" />
                </TouchableOpacity>
                <Text style={styles.patientCountValue}>{patientCount}</Text>
                <TouchableOpacity
                  style={[styles.counterButton, styles.counterButtonPlus]}
                  onPress={() => updatePatientCount(1)}
                >
                  <PlusIcon size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Additional Details */}
          <View style={styles.section}>
            <Text style={styles.subsectionLabel}>ADDITIONAL DETAILS</Text>
            <View style={styles.detailsContainer}>
              <TextInput
                style={styles.detailsInput}
                placeholder="Describe the situation (optional)..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={additionalDetails}
                onChangeText={setAdditionalDetails}
              />
              <View style={styles.detailsActions}>
                <TouchableOpacity 
                  style={[styles.detailsActionBtn, attachedPhoto && styles.detailsActionBtnActive]}
                  onPress={handleAddPhoto}
                >
                  <CameraIcon size={18} color={attachedPhoto ? '#FFFFFF' : '#6B7280'} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.detailsActionBtn, styles.detailsActionBtnMic, attachedAudio && styles.detailsActionBtnMicActive]}
                  onPress={handleRecordAudio}
                >
                  <MicIcon size={18} color={attachedAudio ? '#FFFFFF' : '#EF4444'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Attached Media Preview */}
          {attachedPhoto && (
            <View style={styles.attachedPhotoContainer}>
              <Image source={{ uri: attachedPhoto.uri }} style={styles.attachedPhotoPreview} />
              <TouchableOpacity 
                style={styles.removePhotoButton}
                onPress={() => setAttachedPhoto(null)}
              >
                <Text style={styles.removePhotoText}>✕ Remove Photo</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Bottom spacing - reduced when keyboard visible */}
          <View style={{ height: keyboardVisible ? 80 : 160 }} />
        </KeyboardAwareScrollView>

        {/* Floating Action Bar - always visible with keyboard */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.floatingBarContainer}
        >
          <View style={[styles.floatingBar, keyboardVisible && styles.floatingBarKeyboard]}>
            <View style={styles.floatingBarContent}>
              <TouchableOpacity 
                style={[styles.recordButton, attachedAudio && styles.recordButtonActive]}
                onPress={handleRecordAudio}
              >
                <MicIcon size={24} color={attachedAudio ? '#FFFFFF' : '#6B7280'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.requestButton} onPress={handleRequestAmbulance}>
                <View style={styles.pulseDot}>
                  <View style={styles.pulseDotInner} />
                </View>
                <Text style={styles.requestButtonText}>REQUEST AMBULANCE</Text>
              </TouchableOpacity>
            </View>
            {!keyboardVisible && (
              <Text style={styles.disclaimer}>
                By clicking request, you agree to share your live location with EMS.
              </Text>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Audio Recording Modal */}
      <Modal
        visible={showAudioRecorder}
        transparent
        animationType="fade"
        onRequestClose={cancelRecording}
      >
        <View style={styles.audioModalOverlay}>
          <View style={styles.audioModalContent}>
            <Text style={styles.audioModalTitle}>Voice Recording</Text>
            <Text style={styles.audioModalSubtitle}>Max {MAX_RECORDING_SECONDS} seconds</Text>
            
            <View style={styles.recordingIndicator}>
              <View style={[styles.recordingDot, isRecording && styles.recordingDotActive]} />
              <Text style={styles.recordingTime}>{recordingDuration}</Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${(recordingSecondsRef.current / MAX_RECORDING_SECONDS) * 100}%` }
                ]} 
              />
            </View>
            
            <View style={styles.audioModalButtons}>
              <TouchableOpacity style={styles.audioModalCancelBtn} onPress={cancelRecording}>
                <Text style={styles.audioModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              {!isRecording ? (
                <TouchableOpacity style={styles.audioModalRecordBtn} onPress={startRecording}>
                  <View style={styles.recordButtonInner}>
                    <MicIcon size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.audioModalRecordText}>Start</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.audioModalStopBtn} onPress={() => stopRecording(true)}>
                  <View style={styles.stopButtonInner}>
                    <Rect x="6" y="6" width="12" height="12" fill="#FFFFFF" />
                  </View>
                  <Text style={styles.audioModalStopText}>Stop & Save</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Emergency Response Modal */}
      <EmergencyResponseModal
        visible={showResponseModal}
        emergencyType="ambulance"
        onClose={handleCloseModal}
        onCallRequest={handleCallRequest}
        referenceNumber={referenceNumber}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#B45309',
    paddingTop: 44,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    gap: 8,
  },
  sosText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(254, 202, 202, 1)',
  },
  sosTextActive: {
    color: '#DC2626',
  },
  sosSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  locationTabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  locationTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
  },
  locationTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  locationTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  locationTabTextActive: {
    fontWeight: '700',
    color: '#B45309',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(239, 246, 255, 0.5)',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 12,
    padding: 12,
  },
  locationPinContainer: {
    marginRight: 12,
    marginTop: 4,
  },
  locationDetails: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  locationAddress: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
  locationCoords: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  editLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  section: {
    padding: 16,
    paddingBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  viewAllLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  providerScroll: {
    marginLeft: -4,
  },
  providerCard: {
    width: 140,
    padding: 12,
    marginRight: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  providerCardActive: {
    borderWidth: 2,
    borderColor: '#B45309',
  },
  providerCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  providerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  providerSubtitle: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  subsection: {
    marginBottom: 16,
  },
  subsectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  natureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  natureButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  natureButtonActive: {
    backgroundColor: '#B45309',
    borderColor: '#B45309',
  },
  natureButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  natureButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  questionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  questionButtons: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  questionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  questionBtnYes: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  questionBtnNo: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  questionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  questionBtnTextYes: {
    color: '#16A34A',
  },
  questionBtnTextNo: {
    color: '#DC2626',
  },
  questionDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  patientCountCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  patientCountLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  patientCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonPlus: {
    backgroundColor: '#B45309',
  },
  patientCountValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#B45309',
    minWidth: 16,
    textAlign: 'center',
  },
  detailsContainer: {
    position: 'relative',
  },
  detailsInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    paddingRight: 80,
    fontSize: 14,
    color: '#374151',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  detailsActions: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  detailsActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsActionBtnMic: {
    backgroundColor: '#FEF2F2',
  },
  floatingBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  floatingBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  floatingBarKeyboard: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  floatingBarContent: {
    flexDirection: 'row',
    gap: 12,
  },
  recordButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestButton: {
    flex: 1,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    borderRadius: 16,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  requestButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  disclaimer: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 12,
  },
  // Active button states
  detailsActionBtnActive: {
    backgroundColor: '#B45309',
  },
  detailsActionBtnMicActive: {
    backgroundColor: '#EF4444',
  },
  recordButtonActive: {
    backgroundColor: '#EF4444',
  },
  // Attached photo styles
  attachedPhotoContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    marginBottom: 16,
  },
  attachedPhotoPreview: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  removePhotoButton: {
    padding: 8,
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
  },
  removePhotoText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  // Audio modal styles
  audioModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  audioModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  audioModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  audioModalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  recordingDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D1D5DB',
  },
  recordingDotActive: {
    backgroundColor: '#DC2626',
  },
  recordingTime: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827',
    fontVariant: ['tabular-nums'],
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#B45309',
    borderRadius: 3,
  },
  audioModalButtons: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  audioModalCancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  audioModalCancelText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  audioModalRecordBtn: {
    alignItems: 'center',
  },
  recordButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#B45309',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  audioModalRecordText: {
    fontSize: 14,
    color: '#B45309',
    fontWeight: '600',
  },
  audioModalStopBtn: {
    alignItems: 'center',
  },
  stopButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  audioModalStopText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '600',
  },
});

export default AmbulanceEmergencyScreen;
