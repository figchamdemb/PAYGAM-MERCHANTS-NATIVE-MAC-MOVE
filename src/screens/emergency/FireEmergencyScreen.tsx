/**
 * FireEmergencyScreen - Fire Emergency Report Screen
 * Based on the Figma/Vybes design
 * Features: Location, SOS Priority, Who is affected, Type of Fire, Life at risk,
 * Additional details, Record Audio, Add Photo, Training checkbox, Send Alert
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

const ChevronDownIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MicIcon = ({ size = 18, color = '#B45309' }) => (
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

const SendIcon = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckboxIcon = ({ checked, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="3" stroke={checked ? '#B45309' : '#D1D5DB'} strokeWidth={2} fill={checked ? '#B45309' : 'none'} />
    {checked && <Path d="M9 12l2 2 4-4" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />}
  </Svg>
);

// Fire incident types
const FIRE_INCIDENT_TYPES = [
  'Building / House Fire',
  'Vehicle Fire',
  'Bush / Forest Fire',
  'Electrical Fire',
  'Industrial Fire',
  'Other',
];

const FireEmergencyScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { theme, isDarkMode } = useTheme();
  
  // GPS Location State
  const [currentLocation, setCurrentLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [locationAddress, setLocationAddress] = useState('Getting location...');
  const [locationCoords, setLocationCoords] = useState('Fetching GPS...');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  
  // State
  const [locationType, setLocationType] = useState<'current' | 'home'>('current');
  const [sosEnabled, setSosEnabled] = useState(true);
  const [affectedType, setAffectedType] = useState<'myHouse' | 'someoneElse'>('myHouse');
  const [incidentType, setIncidentType] = useState('Building / House Fire');
  const [showIncidentDropdown, setShowIncidentDropdown] = useState(false);
  const [lifeAtRisk, setLifeAtRisk] = useState<'YES' | 'NO' | 'UNK'>('YES');
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
          message: 'Fire Emergency needs your location to dispatch fire services.',
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

  const handleSendAlert = () => {
    console.log('Sending Fire Alert:', {
      locationType,
      sosEnabled,
      affectedType,
      incidentType,
      lifeAtRisk,
      additionalDetails,
      isTraining,
      attachedPhoto,
      attachedAudio,
    });
    // Generate reference number and show response modal
    setReferenceNumber('FIR-' + Date.now().toString().slice(-8));
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
            message: 'Fire Emergency needs camera access to capture photos.',
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
            message: 'Fire Emergency needs microphone access to record voice notes.',
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
            const fileName = `fire_photo_${Date.now()}.jpg`;
            setAttachedPhoto({
              uri: asset.uri,
              name: fileName,
            });
            Alert.alert('Success', 'Photo has been attached to your fire alert.');
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
        Alert.alert('Audio Added', 'Audio file has been attached to your fire alert.');
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
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeftIcon size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fire Emergency</Text>
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
          
          {/* Incident Location Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>INCIDENT LOCATION</Text>
              <TouchableOpacity onPress={getCurrentLocation}>
                <Text style={styles.changeLink}>{isLoadingLocation ? 'LOADING...' : 'REFRESH'}</Text>
              </TouchableOpacity>
            </View>

            {/* Current Location Card */}
            <View style={styles.locationCard}>
              <View style={styles.locationIcon}>
                <MapPinIcon size={24} color="#B45309" />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>{locationAddress}</Text>
                <Text style={styles.locationAddress}>{locationCoords}</Text>
              </View>
              <View style={styles.locationMap}>
                {/* Mini map placeholder */}
                <View style={styles.mapPlaceholder}>
                  <View style={styles.mapDot} />
                </View>
              </View>
            </View>

            {/* SOS Priority */}
            <View style={styles.sosPriorityCard}>
              <View style={styles.sosPriorityIcon}>
                <View style={styles.sosIconBg}>
                  <Text style={styles.sosIconText}>🚨</Text>
                </View>
              </View>
              <View style={styles.sosPriorityInfo}>
                <Text style={styles.sosPriorityTitle}>SOS Priority</Text>
                <Text style={styles.sosPrioritySubtitle}>Alerts all nearby units immediately</Text>
              </View>
              <Switch
                value={sosEnabled}
                onValueChange={setSosEnabled}
                trackColor={{ false: '#D1D5DB', true: '#DC2626' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Who is affected? */}
          <View style={styles.section}>
            <Text style={styles.questionTitle}>Who is affected?</Text>
            <View style={styles.affectedButtons}>
              <TouchableOpacity
                style={[styles.affectedButton, affectedType === 'myHouse' && styles.affectedButtonActive]}
                onPress={() => setAffectedType('myHouse')}
              >
                <HomeIcon size={24} color={affectedType === 'myHouse' ? '#B45309' : '#6B7280'} />
                <Text style={[styles.affectedButtonText, affectedType === 'myHouse' && styles.affectedButtonTextActive]}>
                  My House
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.affectedButton, affectedType === 'someoneElse' && styles.affectedButtonActive]}
                onPress={() => setAffectedType('someoneElse')}
              >
                <Svg width={24} height={24} viewBox="0 0 24 24" fill={affectedType === 'someoneElse' ? '#B45309' : '#6B7280'}>
                  <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </Svg>
                <Text style={[styles.affectedButtonText, affectedType === 'someoneElse' && styles.affectedButtonTextActive]}>
                  Someone Else
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Type of Fire Incident */}
          <View style={styles.section}>
            <Text style={styles.questionTitle}>Type of Fire Incident</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowIncidentDropdown(!showIncidentDropdown)}
            >
              <Text style={styles.dropdownText}>{incidentType}</Text>
              <ChevronDownIcon size={20} color="#6B7280" />
            </TouchableOpacity>
            
            {showIncidentDropdown && (
              <View style={styles.dropdownMenu}>
                {FIRE_INCIDENT_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.dropdownItem, incidentType === type && styles.dropdownItemActive]}
                    onPress={() => {
                      setIncidentType(type);
                      setShowIncidentDropdown(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, incidentType === type && styles.dropdownItemTextActive]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Is life at risk / lost? */}
          <View style={styles.section}>
            <Text style={styles.questionTitle}>Is life at risk / lost?</Text>
            <View style={styles.riskButtons}>
              {(['YES', 'NO', 'UNK'] as const).map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.riskButton, lifeAtRisk === option && styles.riskButtonActive]}
                  onPress={() => setLifeAtRisk(option)}
                >
                  <Text style={[styles.riskButtonText, lifeAtRisk === option && styles.riskButtonTextActive]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Additional Details */}
          <View style={styles.section}>
            <Text style={styles.questionTitle}>
              Additional Details <Text style={styles.optionalText}>(Optional)</Text>
            </Text>
            <TextInput
              style={styles.detailsInput}
              placeholder="Describe the fire intensity, trapped people, etc..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={additionalDetails}
              onChangeText={setAdditionalDetails}
            />
          </View>

          {/* Media Buttons */}
          <View style={styles.mediaButtons}>
            <TouchableOpacity 
              style={[styles.mediaButton, attachedAudio && styles.mediaButtonActive]} 
              onPress={handleRecordAudio}
            >
              <MicIcon size={18} color={attachedAudio ? '#FFFFFF' : '#B45309'} />
              <Text style={[styles.mediaButtonText, attachedAudio && styles.mediaButtonTextActive]}>
                {attachedAudio ? '✓ Audio Added' : 'Record Audio'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.mediaButton, attachedPhoto && styles.mediaButtonActive]} 
              onPress={handleAddPhoto}
            >
              <CameraIcon size={18} color={attachedPhoto ? '#FFFFFF' : '#6B7280'} />
              <Text style={[styles.mediaButtonText, attachedPhoto && styles.mediaButtonTextActive]}>
                {attachedPhoto ? '✓ Photo Added' : 'Add Photo'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Show attached photo preview */}
          {attachedPhoto && (
            <View style={styles.attachedPhotoContainer}>
              <Image source={{ uri: attachedPhoto.uri }} style={styles.attachedPhotoPreview} />
              <TouchableOpacity 
                style={styles.removePhotoButton}
                onPress={() => setAttachedPhoto(null)}
              >
                <Text style={styles.removePhotoText}>✕ Remove</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Training Checkbox */}
          <TouchableOpacity
            style={styles.trainingCheckbox}
            onPress={() => setIsTraining(!isTraining)}
          >
            <CheckboxIcon checked={isTraining} size={20} />
            <Text style={styles.trainingText}>This is a General Live Training Emergency</Text>
          </TouchableOpacity>

          {/* Bottom spacing for buttons - reduced when keyboard visible */}
          <View style={{ height: keyboardVisible ? 80 : 140 }} />
        </KeyboardAwareScrollView>

        {/* Fixed Bottom Buttons - always visible with keyboard */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.bottomButtonsContainer}
        >
          <View style={[styles.bottomButtons, keyboardVisible && styles.bottomButtonsKeyboard]}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendButton} onPress={handleSendAlert}>
              <Text style={styles.sendButtonText}>SEND FIRE ALERT</Text>
              <SendIcon size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          By sending, you agree to share your location with emergency services.
        </Text>
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
            
            {/* Recording indicator */}
            <View style={styles.recordingIndicator}>
              <View style={[styles.recordingDot, isRecording && styles.recordingDotActive]} />
              <Text style={styles.recordingTime}>{recordingDuration}</Text>
            </View>
            
            {/* Progress bar */}
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${(recordingSecondsRef.current / MAX_RECORDING_SECONDS) * 100}%` }
                ]} 
              />
            </View>
            
            {/* Recording buttons */}
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
        emergencyType="fire"
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
    color: '#FECACA',
  },
  sosSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 16,
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
  },
  changeLink: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3B82F6',
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 12,
  },
  locationIcon: {
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  locationMap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B45309',
  },
  sosPriorityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sosPriorityIcon: {
    marginRight: 12,
  },
  sosIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosIconText: {
    fontSize: 20,
  },
  sosPriorityInfo: {
    flex: 1,
  },
  sosPriorityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  sosPrioritySubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  questionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  optionalText: {
    fontWeight: '400',
    color: '#9CA3AF',
  },
  affectedButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  affectedButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  affectedButtonActive: {
    borderColor: '#B45309',
    backgroundColor: '#FFF7ED',
  },
  affectedButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 8,
  },
  affectedButtonTextActive: {
    color: '#B45309',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownText: {
    fontSize: 14,
    color: '#374151',
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemActive: {
    backgroundColor: '#FFF7ED',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#374151',
  },
  dropdownItemTextActive: {
    color: '#B45309',
    fontWeight: '600',
  },
  riskButtons: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  riskButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  riskButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  riskButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  riskButtonTextActive: {
    color: '#B45309',
  },
  detailsInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#374151',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mediaButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  trainingCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
    paddingVertical: 8,
  },
  trainingText: {
    fontSize: 14,
    color: '#374151',
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 24,
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  bottomButtonsKeyboard: {
    paddingTop: 8,
    paddingBottom: 0,
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  sendButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  disclaimer: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  // Media button active state
  mediaButtonActive: {
    backgroundColor: '#B45309',
    borderColor: '#B45309',
  },
  mediaButtonTextActive: {
    color: '#FFFFFF',
  },
  // Attached photo styles
  attachedPhotoContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
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

export default FireEmergencyScreen;
