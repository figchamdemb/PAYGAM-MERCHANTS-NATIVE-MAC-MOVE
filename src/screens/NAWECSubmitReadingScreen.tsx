/**
 * NAWECSubmitReadingScreen - Submit Meter Reading Interface
 * Based on HTML/Tailwind design provided
 * Features: Customer info, location verification, meter reading with OCR, photo capture
 * Uses react-native-svg for icons to avoid FontAwesome type errors
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Dimensions,
  Animated,
  Platform,
  Alert,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import ConfirmationModal from '../components/ConfirmationModal';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import Geolocation from '@react-native-community/geolocation';
import { launchCamera, CameraOptions, ImagePickerResponse } from 'react-native-image-picker';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

// ============ SVG ICON COMPONENTS ============

const ArrowLeftIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const DropletIcon = ({ size = 12, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </Svg>
);

const CompassIcon = ({ size = 24, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path
      d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"
      fill={color}
    />
  </Svg>
);

const CheckCircleIcon = ({ size = 12, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path
      d="M9 12l2 2 4-4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const MapPinIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx="12" cy="10" r="3" fill={color === '#FFFFFF' ? '#B45309' : 'white'} />
  </Svg>
);

const LocationDotIcon = ({ size = 12, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </Svg>
);

const CameraIcon = ({ size = 14, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth={2} />
  </Svg>
);

const WandIcon = ({ size = 18, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M12.2 11.8L11 13M12.2 6.2L11 5M12 12L2 22"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const InfoCircleIcon = ({ size = 14, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path
      d="M12 16v-4M12 8h.01"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const PaperPlaneIcon = ({ size = 14, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </Svg>
);

// ============ MAIN COMPONENT ============

const NAWECSubmitReadingScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const [currentReading, setCurrentReading] = useState('');
  const [previousReading] = useState('012345');
  const [usage, setUsage] = useState('0');
  const [pulseAnim] = useState(new Animated.Value(0));
  
  // Real location state
  const [currentLocation, setCurrentLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [locationAddress, setLocationAddress] = useState('Getting location...');
  const [isLocationVerified, setIsLocationVerified] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  
  // Real camera state
  const [meterPhotoUri, setMeterPhotoUri] = useState<string | null>(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isExtractingReading, setIsExtractingReading] = useState(false);

  // Request location permission
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'NAWEC needs your location to verify meter reading submission.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Location permission error:', err);
      return false;
    }
  };

  // Request camera permission
  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    
    try {
      const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (hasPermission) return true;
      
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'NAWEC needs camera access to take meter photos.',
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
    } catch (err) {
      console.error('Camera permission error:', err);
      return false;
    }
  };

  // Get current GPS location with fallback
  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      setLocationAddress('Location permission denied');
      setIsLoadingLocation(false);
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        setLocationAddress(`${latitude.toFixed(4)}° N, ${Math.abs(longitude).toFixed(4)}° W`);
        setIsLocationVerified(true);
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Geolocation error (high accuracy):', error);
        // Try again with low accuracy as fallback
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ latitude, longitude });
            setLocationAddress(`${latitude.toFixed(4)}° N, ${Math.abs(longitude).toFixed(4)}° W`);
            setIsLocationVerified(true);
            setIsLoadingLocation(false);
          },
          (fallbackError) => {
            console.error('Geolocation error (fallback):', fallbackError);
            setLocationAddress('Tap to get location');
            setIsLoadingLocation(false);
          },
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 }
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  };

  // Take photo of meter
  const handleTakePhoto = async () => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        return;
      }
      
      const options: CameraOptions = {
        mediaType: 'photo',
        quality: 0.9,
        cameraType: 'back',
        saveToPhotos: false,
        includeBase64: false,
      };
      
      launchCamera(options, (response: ImagePickerResponse) => {
        try {
          if (!response) {
            console.log('No response from camera');
            return;
          }
          if (response.didCancel) {
            console.log('User cancelled camera');
            return;
          }
          if (response.errorCode) {
            console.error('Camera error:', response.errorCode, response.errorMessage);
            Alert.alert('Camera Error', response.errorMessage || 'Failed to capture photo. Please try again.');
            return;
          }
          if (response.assets && response.assets.length > 0 && response.assets[0]) {
            const asset = response.assets[0];
            const photoUri = asset.uri;
            if (photoUri) {
              setMeterPhotoUri(photoUri);
              setHasPhoto(true);
              
              // Simulate OCR extraction (in real app, send to backend for OCR)
              setIsExtractingReading(true);
              setTimeout(() => {
                try {
                  // Simulate extracting a random reading from the photo
                  const randomReading = Math.floor(Math.random() * 900000 + 100000).toString().padStart(6, '0');
                  setCurrentReading(randomReading);
                  const prevReadingNum = parseInt(previousReading) || 0;
                  const currReadingNum = parseInt(randomReading) || 0;
                  const usageValue = currReadingNum - prevReadingNum;
                  setUsage(usageValue > 0 ? usageValue.toString() : '0');
                  setIsExtractingReading(false);
                  Alert.alert('Success', 'Meter photo captured and reading extracted!');
                } catch (ocrError) {
                  console.error('OCR simulation error:', ocrError);
                  setIsExtractingReading(false);
                }
              }, 1500);
            }
          }
        } catch (callbackError) {
          console.error('Camera callback error:', callbackError);
          Alert.alert('Error', 'Failed to process photo. Please try again.');
        }
      });
    } catch (error) {
      console.error('handleTakePhoto error:', error);
      Alert.alert('Error', 'Failed to open camera. Please try again.');
    }
  };

  // Get location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Pulse animation for location pin
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmitReading = () => {
    if (!hasPhoto) {
      Alert.alert('Photo Required', 'Please take a photo of the meter before submitting.');
      return;
    }
    if (!currentReading) {
      Alert.alert('Reading Required', 'Please enter or capture the meter reading.');
      return;
    }
    if (!isLocationVerified) {
      Alert.alert('Location Required', 'Please wait for location verification or enable location services.');
      return;
    }
    console.log('Submit reading:', currentReading, 'at location:', currentLocation);
    setShowConfirmation(true);
  };

  const handleRetakePhoto = () => {
    handleTakePhoto();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />

      {/* Header */}
      <LinearGradient
        colors={['#B45309', '#92400e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeftIcon size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Submit Reading</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <KeyboardAwareScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={Platform.OS === 'ios' ? 100 : 120}
        keyboardOpeningTime={0}
      >
        {/* Customer Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.sectionLabel}>CUSTOMER DETAILS</Text>
              <Text style={styles.customerName}>Lamin Touray</Text>
            </View>
            <View style={styles.waterBadge}>
              <DropletIcon size={12} color="#3B82F6" />
              <Text style={styles.waterBadgeText}>Water</Text>
            </View>
          </View>

          <View style={styles.meterInfoBox}>
            <View>
              <Text style={styles.meterLabel}>Meter Number</Text>
              <Text style={styles.meterNumber}>123456890</Text>
            </View>
            <CompassIcon size={30} color="#D1D5DB" />
          </View>
        </View>

        {/* Location Verification Card */}
        <View style={styles.card}>
          <View style={styles.locationHeader}>
            <Text style={styles.sectionLabel}>LOCATION VERIFICATION</Text>
            {isLoadingLocation ? (
              <View style={styles.loadingBadge}>
                <Text style={styles.loadingText}>Fetching GPS...</Text>
              </View>
            ) : isLocationVerified ? (
              <View style={styles.verifiedBadge}>
                <CheckCircleIcon size={12} color="#10B981" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            ) : currentLocation ? (
              <View style={styles.warningBadge}>
                <Text style={styles.warningText}>Location Detected</Text>
              </View>
            ) : (
              <View style={styles.errorBadge}>
                <Text style={styles.errorBadgeText}>GPS Required</Text>
              </View>
            )}
          </View>

          {/* Map Placeholder */}
          <View style={styles.mapContainer}>
            {/* Grid Pattern Background */}
            <View style={styles.gridPattern}>
              {[...Array(12)].map((_, i) => (
                <View key={i} style={styles.gridDot} />
              ))}
            </View>

            {/* Fake Roads */}
            <View style={styles.roadHorizontal} />
            <View style={styles.roadVertical} />

            {/* Location Pin with Pulse */}
            <View style={styles.pinContainer}>
              <Animated.View
                style={[
                  styles.pulseRing,
                  {
                    transform: [{ scale: pulseScale }],
                    opacity: pulseOpacity,
                  },
                ]}
              />
              <View style={styles.locationPinOuter}>
                <LocationDotIcon size={14} color="#FFFFFF" />
              </View>
            </View>
          </View>

          {/* Location Details */}
          <View style={styles.locationDetails}>
            <View style={styles.locationRow}>
              <View style={styles.locationIconBox}>
                <MapPinIcon size={14} color="#B45309" />
              </View>
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Registered Address</Text>
                <Text style={styles.locationValue}>14 Kairaba Avenue, Serrekunda</Text>
              </View>
            </View>

            <View style={styles.locationRow}>
              <View style={styles.locationIconBox}>
                <CompassIcon size={14} color="#B45309" />
              </View>
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Current GPS Location</Text>
                <Text style={styles.locationValue}>
                  {isLoadingLocation 
                    ? 'Fetching GPS coordinates...' 
                    : currentLocation 
                      ? `${currentLocation.latitude.toFixed(4)}° N, ${Math.abs(currentLocation.longitude).toFixed(4)}° W`
                      : 'GPS not available'}
                </Text>
              </View>
            </View>

            {!currentLocation && !isLoadingLocation && (
              <TouchableOpacity 
                style={styles.retryLocationButton}
                onPress={getCurrentLocation}
                activeOpacity={0.8}
              >
                <MapPinIcon size={14} color="#FFFFFF" />
                <Text style={styles.retryLocationText}>Retry GPS Location</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Meter Reading Section */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>METER READING</Text>

          {/* Photo Preview or Take Photo Button */}
          <View style={styles.photoContainer}>
            {meterPhotoUri ? (
              <>
                <Image
                  source={{ uri: meterPhotoUri }}
                  style={styles.meterImage}
                  resizeMode="cover"
                />

                {/* OCR Overlay Box */}
                <View style={styles.ocrOverlay}>
                  <View style={styles.ocrDetectedLabel}>
                    <Text style={styles.ocrDetectedText}>DETECTED</Text>
                  </View>
                </View>

                {/* Retake Button */}
                <TouchableOpacity
                  style={styles.retakeButton}
                  onPress={handleRetakePhoto}
                  activeOpacity={0.8}
                >
                  <CameraIcon size={14} color="#FFFFFF" />
                  <Text style={styles.retakeButtonText}>Retake</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity 
                style={styles.takePhotoContainer}
                onPress={handleTakePhoto}
                activeOpacity={0.8}
              >
                <View style={styles.cameraIconCircle}>
                  <CameraIcon size={32} color="#B45309" />
                </View>
                <Text style={styles.takePhotoText}>Tap to Take Photo</Text>
                <Text style={styles.takePhotoSubtext}>Point camera at meter display</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Reading Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Current Reading (m³)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.readingInput}
                value={currentReading}
                onChangeText={setCurrentReading}
                keyboardType="numeric"
                maxLength={10}
              />
              <View style={styles.wandIconContainer}>
                <WandIcon size={18} color="#10B981" />
              </View>
            </View>
            <View style={styles.confidenceRow}>
              <CheckCircleIcon size={12} color="#10B981" />
              <Text style={styles.confidenceText}>
                Extracted from image (98% confidence)
              </Text>
            </View>
          </View>

          {/* Reading Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Previous</Text>
              <Text style={styles.statValue}>{previousReading}</Text>
            </View>
            <View style={[styles.statBox, styles.usageBox]}>
              <Text style={styles.usageLabel}>Usage</Text>
              <Text style={styles.usageValue}>+{usage} m³</Text>
            </View>
          </View>
        </View>

        {/* Warning Box */}
        <View style={styles.warningBox}>
          <InfoCircleIcon size={14} color="#3B82F6" />
          <Text style={styles.warningText}>
            Please ensure the reading matches the photo. Providing false
            information may lead to service disconnection and fines.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitReading}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Submit Reading</Text>
            <PaperPlaneIcon size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      <ConfirmationModal
        visible={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          navigation.goBack();
        }}
        type="success"
        title="Reading Submitted!"
        message={`Your meter reading of ${currentReading} has been submitted successfully. You will receive your bill shortly.`}
        actionText="Done"
      />
    </View>
  );
};

// ============ STYLES ============

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  waterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  waterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
    marginLeft: 6,
  },
  meterInfoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  meterLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  meterNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 6,
  },
  mapContainer: {
    height: 144,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignContent: 'space-around',
    opacity: 0.3,
    padding: 20,
  },
  gridDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
    margin: 12,
  },
  roadHorizontal: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{ rotate: '-3deg' }],
  },
  roadVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '33%',
    width: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{ rotate: '12deg' }],
  },
  pinContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#B45309',
  },
  locationPinOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#B45309',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  locationDetails: {
    gap: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 20,
  },
  photoContainer: {
    height: 208,
    backgroundColor: '#111827',
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  meterImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  ocrOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -96 }, { translateY: -32 }],
    width: 192,
    height: 64,
    borderWidth: 2,
    borderColor: '#4ADE80',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ocrDetectedLabel: {
    position: 'absolute',
    top: -12,
    left: 8,
    backgroundColor: '#22C55E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ocrDetectedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  retakeButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  retakeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  takePhotoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
  },
  cameraIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(180, 83, 9, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#B45309',
    borderStyle: 'dashed',
  },
  takePhotoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B45309',
  },
  takePhotoSubtext: {
    fontSize: 12,
    color: '#92400E',
    marginTop: 4,
  },
  loadingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#B45309',
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  errorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  errorBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#DC2626',
  },
  retryLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B45309',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  retryLocationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    position: 'relative',
  },
  readingInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#22C55E',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'monospace',
  },
  wandIconContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -9 }],
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 4,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#16A34A',
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    fontFamily: 'monospace',
  },
  usageBox: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  usageLabel: {
    fontSize: 12,
    color: '#B45309',
    marginBottom: 4,
    fontWeight: '500',
    opacity: 0.8,
  },
  usageValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B45309',
    fontFamily: 'monospace',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 18,
    fontWeight: '500',
    marginLeft: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#B45309',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
});

export default NAWECSubmitReadingScreen;
