/**
 * PoliceEmergencyScreen - Police Emergency Report Screen
 * Based on the documentation design
 * Features: Location, Type of incident, Details, Media attachments, Emergency report button
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
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

const MapPinIcon = ({ size = 20, color = '#1E3A8A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </Svg>
);

const LocationCrosshairIcon = ({ size = 16, color = '#1E3A8A' }) => (
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

const ShieldIcon = ({ size = 24, color = '#1E3A8A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CarCrashIcon = ({ size = 24, color = '#DC2626' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </Svg>
);

const TheftIcon = ({ size = 24, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15.5 5.5c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" fill={color} />
    <Path d="M5 12c0 1.1.9 2 2 2h2l2 5h2l2-5h2c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v4z" stroke={color} strokeWidth={2} />
  </Svg>
);

const ViolenceIcon = ({ size = 24, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </Svg>
);

const SuspiciousIcon = ({ size = 24, color = '#8B5CF6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={2} />
    <Path d="M5.5 21a8.5 8.5 0 0 1 13 0" stroke={color} strokeWidth={2} />
    <Path d="M12 14l3 3-3 3-3-3 3-3z" fill={color} />
  </Svg>
);

const NoiseIcon = ({ size = 24, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </Svg>
);

const OtherIcon = ({ size = 24, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill="none" />
    <Circle cx="8" cy="12" r="1.5" fill={color} />
    <Circle cx="12" cy="12" r="1.5" fill={color} />
    <Circle cx="16" cy="12" r="1.5" fill={color} />
  </Svg>
);

const CheckIcon = ({ size = 12, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronDownIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MicIcon = ({ size = 20, color = '#6B7280' }) => (
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

// Incident Types
const INCIDENT_TYPES = [
  { id: 'accident', label: 'Accident', icon: CarCrashIcon, color: '#DC2626', bgColor: '#FEF2F2' },
  { id: 'theft', label: 'Theft/Robbery', icon: TheftIcon, color: '#F59E0B', bgColor: '#FFFBEB' },
  { id: 'violence', label: 'Violence/Assault', icon: ViolenceIcon, color: '#EF4444', bgColor: '#FEE2E2' },
  { id: 'suspicious', label: 'Suspicious Activity', icon: SuspiciousIcon, color: '#8B5CF6', bgColor: '#F5F3FF' },
  { id: 'noise', label: 'Noise/Disturbance', icon: NoiseIcon, color: '#10B981', bgColor: '#ECFDF5' },
  { id: 'other', label: 'Other', icon: OtherIcon, color: '#6B7280', bgColor: '#F3F4F6' },
];

// Urgency Options
const URGENCY_OPTIONS = [
  { id: 'immediate', label: 'Immediate', description: 'Life threatening', color: '#DC2626' },
  { id: 'urgent', label: 'Urgent', description: 'Crime in progress', color: '#F59E0B' },
  { id: 'non-urgent', label: 'Non-Urgent', description: 'For reporting purposes', color: '#10B981' },
];

const PoliceEmergencyScreen: React.FC = () => {
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
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [selectedUrgency, setSelectedUrgency] = useState('immediate');
  const [perpetratorPresent, setPerpetratorPresent] = useState<boolean | null>(null);
  const [weaponInvolved, setWeaponInvolved] = useState<boolean | null>(null);
  const [injuryPresent, setInjuryPresent] = useState<boolean | null>(null);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isTraining, setIsTraining] = useState(false);
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
          message: 'Police Emergency needs your location to dispatch officers to you.',
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
        // Try with low accuracy
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

  const handleReportEmergency = () => {
    console.log('Reporting Police Emergency:', {
      locationType,
      sosEnabled,
      selectedIncident,
      selectedUrgency,
      perpetratorPresent,
      weaponInvolved,
      injuryPresent,
      additionalDetails,
      isTraining,
      attachedPhoto,
      attachedAudio,
    });
    // Generate reference number and show response modal
    setReferenceNumber('POL-' + Date.now().toString().slice(-8));
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
            message: 'Police Emergency needs camera access to capture evidence.',
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
            message: 'Police Emergency needs microphone access to record voice notes.',
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
            const fileName = `police_evidence_${Date.now()}.jpg`;
            setAttachedPhoto({
              uri: asset.uri,
              name: fileName,
            });
            Alert.alert('Success', 'Photo evidence has been attached to your report.');
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
        Alert.alert('Audio Added', 'Audio file has been attached to your report.');
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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeftIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Police Emergency</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={[styles.sosText, sosEnabled && styles.sosTextActive]}>
            SOS Priority
          </Text>
          <Switch
            value={sosEnabled}
            onValueChange={setSosEnabled}
            trackColor={{ false: 'rgba(59, 130, 246, 0.4)', true: '#DC2626' }}
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
                <LocationCrosshairIcon size={16} color={locationType === 'current' ? '#1E3A8A' : '#6B7280'} />
                <Text style={[styles.locationTabText, locationType === 'current' && styles.locationTabTextActive]}>
                  Current
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.locationTab, locationType === 'home' && styles.locationTabActive]}
                onPress={() => setLocationType('home')}
              >
                <HomeIcon size={16} color={locationType === 'home' ? '#1E3A8A' : '#6B7280'} />
                <Text style={[styles.locationTabText, locationType === 'home' && styles.locationTabTextActive]}>
                  Home
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.locationInfo}>
              <View style={styles.locationPinContainer}>
                <MapPinIcon size={24} color="#1E3A8A" />
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

          {/* Incident Type */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>TYPE OF INCIDENT</Text>
            <View style={styles.incidentGrid}>
              {INCIDENT_TYPES.map((type) => {
                const IconComponent = type.icon;
                const isSelected = selectedIncident === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.incidentCard,
                      isSelected && { 
                        borderColor: type.color, 
                        backgroundColor: type.bgColor,
                        borderWidth: 2
                      }
                    ]}
                    onPress={() => setSelectedIncident(type.id)}
                  >
                    {isSelected && (
                      <View style={[styles.incidentCheck, { backgroundColor: type.color }]}>
                        <CheckIcon size={10} color="#FFFFFF" />
                      </View>
                    )}
                    <View style={[styles.incidentIcon, { backgroundColor: type.bgColor }]}>
                      <IconComponent size={24} color={type.color} />
                    </View>
                    <Text style={[styles.incidentLabel, isSelected && { color: type.color, fontWeight: '700' }]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Urgency Level */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>URGENCY LEVEL</Text>
            <View style={styles.urgencyContainer}>
              {URGENCY_OPTIONS.map((option) => {
                const isSelected = selectedUrgency === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.urgencyCard,
                      isSelected && { borderColor: option.color, borderWidth: 2, backgroundColor: `${option.color}10` }
                    ]}
                    onPress={() => setSelectedUrgency(option.id)}
                  >
                    <View style={styles.urgencyHeader}>
                      <View style={[styles.urgencyRadio, isSelected && { borderColor: option.color }]}>
                        {isSelected && <View style={[styles.urgencyRadioInner, { backgroundColor: option.color }]} />}
                      </View>
                      <View style={styles.urgencyTextContainer}>
                        <Text style={[styles.urgencyLabel, isSelected && { color: option.color, fontWeight: '700' }]}>
                          {option.label}
                        </Text>
                        <Text style={styles.urgencyDescription}>{option.description}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Critical Questions */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CRITICAL QUESTIONS</Text>
            <View style={styles.questionsCard}>
              {/* Perpetrator Present? */}
              <View style={styles.questionRow}>
                <Text style={styles.questionText}>Is the perpetrator still present?</Text>
                <View style={styles.questionButtons}>
                  <TouchableOpacity
                    style={[styles.questionBtn, perpetratorPresent === true && styles.questionBtnYes]}
                    onPress={() => setPerpetratorPresent(true)}
                  >
                    <Text style={[styles.questionBtnText, perpetratorPresent === true && styles.questionBtnTextYes]}>YES</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.questionBtn, perpetratorPresent === false && styles.questionBtnNo]}
                    onPress={() => setPerpetratorPresent(false)}
                  >
                    <Text style={[styles.questionBtnText, perpetratorPresent === false && styles.questionBtnTextNo]}>NO</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.questionDivider} />

              {/* Weapon Involved? */}
              <View style={styles.questionRow}>
                <Text style={styles.questionText}>Any weapon involved?</Text>
                <View style={styles.questionButtons}>
                  <TouchableOpacity
                    style={[styles.questionBtn, weaponInvolved === true && styles.questionBtnYes]}
                    onPress={() => setWeaponInvolved(true)}
                  >
                    <Text style={[styles.questionBtnText, weaponInvolved === true && styles.questionBtnTextYes]}>YES</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.questionBtn, weaponInvolved === false && styles.questionBtnNo]}
                    onPress={() => setWeaponInvolved(false)}
                  >
                    <Text style={[styles.questionBtnText, weaponInvolved === false && styles.questionBtnTextNo]}>NO</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.questionDivider} />

              {/* Injury Present? */}
              <View style={styles.questionRow}>
                <Text style={styles.questionText}>Anyone injured?</Text>
                <View style={styles.questionButtons}>
                  <TouchableOpacity
                    style={[styles.questionBtn, injuryPresent === true && styles.questionBtnYes]}
                    onPress={() => setInjuryPresent(true)}
                  >
                    <Text style={[styles.questionBtnText, injuryPresent === true && styles.questionBtnTextYes]}>YES</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.questionBtn, injuryPresent === false && styles.questionBtnNo]}
                    onPress={() => setInjuryPresent(false)}
                  >
                    <Text style={[styles.questionBtnText, injuryPresent === false && styles.questionBtnTextNo]}>NO</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Additional Details */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ADDITIONAL DETAILS</Text>
            <View style={styles.detailsContainer}>
              <TextInput
                style={styles.detailsInput}
                placeholder="Describe what happened, describe the suspects if applicable..."
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
          {(attachedPhoto || attachedAudio) && (
            <View style={styles.attachedMediaSection}>
              <Text style={styles.sectionLabel}>ATTACHED EVIDENCE</Text>
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
              {attachedAudio && (
                <View style={styles.attachedAudioContainer}>
                  <MicIcon size={18} color="#1E3A8A" />
                  <Text style={styles.attachedAudioText}>{attachedAudio.name}</Text>
                  <TouchableOpacity onPress={() => setAttachedAudio(null)}>
                    <Text style={styles.removeAudioText}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Training Checkbox */}
          <View style={styles.trainingContainer}>
            <TouchableOpacity
              style={styles.trainingCheckbox}
              onPress={() => setIsTraining(!isTraining)}
            >
              <View style={[styles.checkbox, isTraining && styles.checkboxChecked]}>
                {isTraining && <CheckIcon size={12} color="#FFFFFF" />}
              </View>
              <Text style={styles.trainingText}>
                This is a training exercise (will not dispatch real officers)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom spacing for floating bar - reduced when keyboard is visible */}
          <View style={{ height: keyboardVisible ? 80 : 160 }} />
        </KeyboardAwareScrollView>

        {/* Floating Action Bar - always visible even with keyboard */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.floatingBarContainer}
        >
          <View style={[styles.floatingBar, keyboardVisible && styles.floatingBarKeyboard]}>
            <View style={styles.floatingBarContent}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reportButton} onPress={handleReportEmergency}>
                <View style={styles.pulseDot}>
                  <View style={styles.pulseDotInner} />
                </View>
                <Text style={styles.reportButtonText}>REPORT EMERGENCY</Text>
              </TouchableOpacity>
            </View>
            {!keyboardVisible && (
              <Text style={styles.disclaimer}>
                Nearest patrol unit will be dispatched to your location.
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
        emergencyType="police"
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
    backgroundColor: '#1E3A8A',
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
    color: 'rgba(191, 219, 254, 1)',
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
    color: '#1E3A8A',
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
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  incidentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  incidentCard: {
    width: '30%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    position: 'relative',
  },
  incidentCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incidentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  incidentLabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  urgencyContainer: {
    gap: 8,
  },
  urgencyCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  urgencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  urgencyRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgencyRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  urgencyTextContainer: {
    flex: 1,
  },
  urgencyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  urgencyDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
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
    flex: 1,
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
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  questionBtnNo: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  questionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  questionBtnTextYes: {
    color: '#DC2626',
  },
  questionBtnTextNo: {
    color: '#16A34A',
  },
  questionDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
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
  trainingContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  trainingCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  trainingText: {
    fontSize: 12,
    color: '#92400E',
    flex: 1,
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
  cancelButton: {
    height: 56,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  reportButton: {
    flex: 1,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1E3A8A',
    borderRadius: 16,
    shadowColor: '#1E3A8A',
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
  reportButtonText: {
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
    backgroundColor: '#1E3A8A',
  },
  detailsActionBtnMicActive: {
    backgroundColor: '#EF4444',
  },
  // Attached media section
  attachedMediaSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  attachedPhotoContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    marginTop: 8,
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
  attachedAudioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    marginTop: 8,
  },
  attachedAudioText: {
    flex: 1,
    fontSize: 14,
    color: '#1E3A8A',
  },
  removeAudioText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 8,
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
    backgroundColor: '#1E3A8A',
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
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  audioModalRecordText: {
    fontSize: 14,
    color: '#1E3A8A',
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

export default PoliceEmergencyScreen;
