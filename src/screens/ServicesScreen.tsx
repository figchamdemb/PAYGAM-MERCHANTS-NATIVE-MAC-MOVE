/**
 * ServicesScreen - Civic Reports Hub
 * Features:
 * - Civic Reports dashboard with stats
 * - FAB with animated radial menu
 * - Report forms with confirmation dialogs
 * - Report cards list
 * - Real camera/photo/audio/file upload functionality
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  StatusBar,
  TextInput,
  Animated,
  Image,
  Platform,
  Alert,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Geolocation from 'react-native-geolocation-service';
import Svg, { Path, Circle, Rect, Line, G } from 'react-native-svg';
import { launchCamera, launchImageLibrary, CameraOptions, ImageLibraryOptions, ImagePickerResponse } from 'react-native-image-picker';
import DocumentPicker, { types } from 'react-native-document-picker';

const { width, height } = Dimensions.get('window');

// ============ SVG ICON COMPONENTS ============

const FileTextIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const ShieldIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
);

const HeartIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Svg>
);

const GlobeIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={color} strokeWidth={2} />
  </Svg>
);

const CreditCardIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke={color} strokeWidth={2} />
    <Path d="M1 10h22" stroke={color} strokeWidth={2} />
  </Svg>
);

const BellIcon = ({ size = 24, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth={2} />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const SearchIcon = ({ size = 24, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={2} />
    <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const FilterIcon = ({ size = 24, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PlusIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
  </Svg>
);

const CloseIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
  </Svg>
);

const CameraIcon = ({ size = 24, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke={color} strokeWidth={2} />
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth={2} />
  </Svg>
);

const PlaneIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </Svg>
);

const PassportIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="2" width="16" height="20" rx="2" stroke={color} strokeWidth={2} />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth={2} />
    <Path d="M8 17h8" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const ClockIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const EyeIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth={2} />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
  </Svg>
);

const CheckCircleIcon = ({ size = 48, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M9 12l2 2 4-4" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MapPinIcon = ({ size = 24, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={color} strokeWidth={2} />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth={2} />
  </Svg>
);

const ChevronRightIcon = ({ size = 20, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowLeftIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronDownIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MicrophoneIcon = ({ size = 20, color = '#D97706' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" stroke={color} strokeWidth={2} />
    <Path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="12" y1="19" x2="12" y2="22" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const PaperclipIcon = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UserIcon = ({ size = 20, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={2} />
  </Svg>
);

const ImageIcon = ({ size = 18, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth={2} />
    <Circle cx="8.5" cy="8.5" r="1.5" fill={color} />
    <Path d="M21 15l-5-5L5 21" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TrashIcon = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CrosshairIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Line x1="22" y1="12" x2="18" y2="12" stroke={color} strokeWidth={2} />
    <Line x1="6" y1="12" x2="2" y2="12" stroke={color} strokeWidth={2} />
    <Line x1="12" y1="6" x2="12" y2="2" stroke={color} strokeWidth={2} />
    <Line x1="12" y1="22" x2="12" y2="18" stroke={color} strokeWidth={2} />
  </Svg>
);

// ============ INTERFACES ============

interface ReportCard {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
  status: 'pending' | 'in-progress' | 'resolved';
  category: string;
  image?: string;
}

interface FABMenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

// ============ SAMPLE DATA ============

const sampleReports: ReportCard[] = [
  {
    id: '1',
    title: 'Road Pothole on Kairaba Ave',
    description: 'Large pothole causing traffic issues near the junction',
    location: 'Kairaba Avenue, Serrekunda',
    time: '2 hours ago',
    status: 'pending',
    category: 'Infrastructure',
  },
  {
    id: '2',
    title: 'Street Light Not Working',
    description: 'Street light has been off for 3 days, creating safety concerns',
    location: 'Bakau New Town',
    time: '5 hours ago',
    status: 'in-progress',
    category: 'Utilities',
  },
  {
    id: '3',
    title: 'Illegal Dumping Site',
    description: 'Waste being dumped illegally near the market area',
    location: 'Brikama Market',
    time: '1 day ago',
    status: 'resolved',
    category: 'Environment',
  },
  {
    id: '4',
    title: 'Water Pipe Leak',
    description: 'Major water pipe leak causing flooding on the street',
    location: 'Pipeline Road, Kanifing',
    time: '3 hours ago',
    status: 'pending',
    category: 'Utilities',
  },
];

const fabMenuItems: FABMenuItem[] = [
  {
    id: 'general',
    title: 'General Report',
    icon: <FileTextIcon size={22} color="#FFFFFF" />,
    color: '#B45309',
    description: 'Report any civic issue',
  },
  {
    id: 'tourism',
    title: 'Tourism Safety',
    icon: <PlaneIcon size={22} color="#FFFFFF" />,
    color: '#0EA5E9',
    description: 'Report tourism-related concerns',
  },
  {
    id: 'immigration',
    title: 'Immigration Report',
    icon: <PassportIcon size={22} color="#FFFFFF" />,
    color: '#8B5CF6',
    description: 'Report immigration matters',
  },
  {
    id: 'visa',
    title: 'Visa Overstay',
    icon: <ClockIcon size={22} color="#FFFFFF" />,
    color: '#EF4444',
    description: 'Report visa overstay cases',
  },
  {
    id: 'suspicious',
    title: 'Suspicious Activity',
    icon: <EyeIcon size={22} color="#FFFFFF" />,
    color: '#1E3A5F',
    description: 'Report suspicious behavior',
  },
];

// Note: Audio recording feature uses file picker for audio files
// For real-time recording, consider using react-native-audio-recorder-player when JVM issues are resolved

// ============ MAIN COMPONENT ============

const ServicesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  
  // State
  const [isFABOpen, setIsFABOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<FABMenuItem | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showCaseTypePicker, setShowCaseTypePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Audio recording state
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState('00:00');
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingSecondsRef = useRef(0);
  const MAX_RECORDING_SECONDS = 10;
  
  // Case types for dropdown
  const caseTypes = [
    { value: 'theft', label: 'Theft / Burglary' },
    { value: 'assault', label: 'Assault' },
    { value: 'accident', label: 'Traffic Accident' },
    { value: 'fire', label: 'Fire Incident' },
    { value: 'medical', label: 'Medical Emergency' },
    { value: 'fraud', label: 'Fraud / Scam' },
    { value: 'vandalism', label: 'Vandalism' },
    { value: 'other', label: 'Other' },
  ];
  
  // Attached files state
  const [attachedFiles, setAttachedFiles] = useState<Array<{
    id: string;
    name: string;
    size: string;
    type: 'image' | 'audio' | 'file';
  }>>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: 'Modou Jallow',
    email: 'modou.jallow@gmail.com',
    phone: '+220 7123456',
    title: '',
    description: '',
    location: '',
    caseType: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    peopleInvolved: '',
  });
  
  // GPS location loading state
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  // Animation refs
  const fabRotation = useRef(new Animated.Value(0)).current;
  const menuScale = useRef(new Animated.Value(0)).current;
  const menuOpacity = useRef(new Animated.Value(0)).current;
  const itemAnimations = useRef(fabMenuItems.map(() => new Animated.Value(0))).current;

  // Stats
  const stats = {
    pending: 12,
    resolved: 84,
    inProgress: 5,
  };

  // Toggle FAB menu
  const toggleFAB = () => {
    const toValue = isFABOpen ? 0 : 1;
    
    Animated.parallel([
      Animated.spring(fabRotation, {
        toValue,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(menuScale, {
        toValue,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(menuOpacity, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Stagger menu items
    itemAnimations.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue,
        friction: 6,
        delay: isFABOpen ? 0 : index * 50,
        useNativeDriver: true,
      }).start();
    });

    setIsFABOpen(!isFABOpen);
  };

  // Handle menu item press
  const handleMenuItemPress = (item: FABMenuItem) => {
    toggleFAB();
    setSelectedReportType(item);
    setShowFormModal(true);
  };

  // Handle form submit
  const handleFormSubmit = () => {
    setShowConfirmDialog(true);
  };

  // Confirm submission
  const confirmSubmission = () => {
    setShowConfirmDialog(false);
    setShowFormModal(false);
    
    // Show success after brief delay
    setTimeout(() => {
      setShowSuccessDialog(true);
    }, 300);
    
    // Reset form
    setFormData(prev => ({
      ...prev,
      title: '',
      description: '',
      location: '',
      caseType: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      peopleInvolved: '',
    }));
    setAttachedFiles([]);
  };
  
  // Request permissions for camera and audio
  const requestPermissions = async (type: 'camera' | 'audio' | 'storage'): Promise<boolean> => {
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
            message: 'EGOV-CITIZEN needs camera access to take photos for your report.',
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
            'Camera permission was denied. Please go to Settings > Apps > EGOV-CITIZEN > Permissions and enable Camera.',
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
            message: 'EGOV-CITIZEN needs microphone access to record voice notes for your report.',
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
            'Microphone permission was denied. Please go to Settings > Apps > EGOV-CITIZEN > Permissions and enable Microphone.',
            [{ text: 'OK' }]
          );
          return false;
        }
        return false;
      } else if (type === 'storage') {
        // For Android 13+, we don't need storage permission for media picker
        const sdkInt = Platform.Version as number;
        if (sdkInt >= 33) return true;
        
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'EGOV-CITIZEN needs storage access to upload files for your report.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.error('Permission error:', err);
      Alert.alert('Permission Error', 'Failed to request permission. Please try again.');
    }
    return false;
  };
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  // Handle taking a photo with camera
  const handleTakePhoto = async (isSelfie: boolean = false) => {
    try {
      const hasPermission = await requestPermissions('camera');
      if (!hasPermission) {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera permission in your phone settings to take photos.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      const options: CameraOptions = {
        mediaType: 'photo',
        quality: 0.8,
        cameraType: isSelfie ? 'front' : 'back',
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
            const fileId = Date.now().toString();
            const fileName = isSelfie ? `selfie_${fileId}.jpg` : `photo_${fileId}.jpg`;
            const fileSize = asset.fileSize ? formatFileSize(asset.fileSize) : '2.0 MB';
            
            const newFile = {
              id: fileId,
              name: fileName,
              size: fileSize,
              type: 'image' as const,
              uri: asset.uri,
            };
            setAttachedFiles(prev => [...prev, newFile]);
            Alert.alert('Success', 'Photo captured successfully!');
          }
        }
      });
    } catch (error) {
      console.error('handleTakePhoto error:', error);
      Alert.alert('Error', 'Failed to open camera. Please try again.');
    }
  };
  
  // Handle picking a file
  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [types.pdf, types.doc, types.docx, types.images, types.plainText],
        allowMultiSelection: false,
      });
      
      if (result && result[0]) {
        const file = result[0];
        const fileId = Date.now().toString();
        const fileSize = file.size ? formatFileSize(file.size) : '1.0 MB';
        
        const newFile = {
          id: fileId,
          name: file.name || `document_${fileId}`,
          size: fileSize,
          type: 'file' as const,
          uri: file.uri,
        };
        setAttachedFiles(prev => [...prev, newFile]);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.error('File picker error:', err);
        Alert.alert('Error', 'Failed to select file. Please try again.');
      }
    }
  };
  
  // Format recording time
  const formatRecordingTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
        const fileId = Date.now().toString();
        const newFile = {
          id: fileId,
          name: file.name || `audio_${fileId}.mp3`,
          size: formatFileSize(file.size || 0),
          type: 'audio' as const,
          uri: file.fileCopyUri || file.uri,
        };
        setAttachedFiles(prev => [...prev, newFile]);
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
  
  // Handle simulated recording (timer-based demo)
  const startRecording = async () => {
    const hasPermission = await requestPermissions('audio');
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Microphone permission is needed for voice notes.');
      return;
    }
    
    recordingSecondsRef.current = 0;
    setRecordingDuration('00:00');
    setIsRecording(true);
    
    // Start timer for visual feedback
    recordingTimerRef.current = setInterval(() => {
      recordingSecondsRef.current += 1;
      setRecordingDuration(formatRecordingTime(recordingSecondsRef.current));
      
      // Auto-stop at max duration
      if (recordingSecondsRef.current >= MAX_RECORDING_SECONDS) {
        stopRecording(true);
      }
    }, 1000);
  };
  
  // Stop simulated recording
  const stopRecording = async (saveFile: boolean = true) => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    setIsRecording(false);
    
    if (saveFile && recordingSecondsRef.current > 0) {
      const fileId = Date.now().toString();
      const duration = recordingSecondsRef.current;
      const estimatedSize = Math.round(duration * 16 * 1024); // ~16KB per second for mp3
      
      const newFile = {
        id: fileId,
        name: `voice_note_${duration}s.mp3`,
        size: formatFileSize(estimatedSize),
        type: 'audio' as const,
        uri: `recorded_audio_${fileId}`,
      };
      setAttachedFiles(prev => [...prev, newFile]);
      setShowAudioRecorder(false);
      Alert.alert('Recording Saved', `Voice note (${duration} seconds) has been attached.`);
    }
    
    recordingSecondsRef.current = 0;
    setRecordingDuration('00:00');
  };
  
  // Cancel recording
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
  
  // Handle evidence upload - main dispatcher
  const handleAddEvidence = (type: 'photo' | 'selfie' | 'audio' | 'file') => {
    switch (type) {
      case 'photo':
        handleTakePhoto(false);
        break;
      case 'selfie':
        handleTakePhoto(true);
        break;
      case 'audio':
        // Show audio options: record or pick existing
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
        break;
      case 'file':
        handlePickFile();
        break;
    }
  };
  
  // Remove attached file
  const handleRemoveFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Handle GPS location capture
  const handleCaptureLocation = async () => {
    setIsGettingLocation(true);
    try {
      // Request location permission on Android
      if (Platform.OS === 'android') {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        
        if (!hasPermission) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'EGOV-CITIZEN needs access to your location to auto-fill your address.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setIsGettingLocation(false);
            Alert.alert('Permission Denied', 'Location permission is required to capture GPS coordinates.');
            return;
          }
        }
      }

      // Get current position
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Format as readable coordinates or use reverse geocoding if available
          const locationString = `GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          setFormData(prev => ({ ...prev, location: locationString }));
          setIsGettingLocation(false);
          Alert.alert('Location Captured', `Your current location has been captured.\n\nCoordinates: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        },
        (error) => {
          setIsGettingLocation(false);
          console.log('Location error:', error.code, error.message);
          
          let errorMessage = 'Failed to get location. Please try again.';
          switch (error.code) {
            case 1:
              errorMessage = 'Location permission denied. Please enable location access in settings.';
              break;
            case 2:
              errorMessage = 'Location unavailable. Please make sure GPS is enabled and try again.';
              break;
            case 3:
              errorMessage = 'Location request timed out. Please try again in an open area.';
              break;
          }
          Alert.alert('Location Error', errorMessage);
        },
        { 
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } catch (error: any) {
      setIsGettingLocation(false);
      console.log('Permission error:', error);
      Alert.alert('Error', 'Failed to request location permission.');
    }
  };

  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#FEF3C7', color: '#B45309', text: 'Pending' };
      case 'in-progress':
        return { bg: '#DBEAFE', color: '#1D4ED8', text: 'In Progress' };
      case 'resolved':
        return { bg: '#D1FAE5', color: '#059669', text: 'Resolved' };
      default:
        return { bg: '#F3F4F6', color: '#6B7280', text: 'Unknown' };
    }
  };

  // Rotation interpolation for FAB
  const rotateZ = fabRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <ShieldIcon size={24} color="#FFFFFF" />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>EGOV-CITIZEN</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>Civic Reports</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <BellIcon size={24} color="#374151" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
          <Text style={[styles.statNumber, { color: '#B45309' }]}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
          <Text style={[styles.statNumber, { color: '#059669' }]}>{stats.resolved}</Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#DBEAFE' }]}>
          <Text style={[styles.statNumber, { color: '#1D4ED8' }]}>{stats.inProgress}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
      </View>

      {/* Search & Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reports..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <FilterIcon size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterChipsContainer}
        contentContainerStyle={styles.filterChipsContent}
      >
        {['all', 'pending', 'in-progress', 'resolved'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.filterChipActive
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterChipText,
              selectedFilter === filter && styles.filterChipTextActive
            ]}>
              {filter === 'all' ? 'All Reports' : filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Reports List */}
      <ScrollView 
        style={styles.reportsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.reportsListContent}
      >
        {sampleReports.map((report) => {
          const statusBadge = getStatusBadge(report.status);
          return (
            <TouchableOpacity key={report.id} style={styles.reportCard} activeOpacity={0.8}>
              <View style={styles.reportCardHeader}>
                <View style={[styles.categoryBadge, { backgroundColor: '#F3F4F6' }]}>
                  <Text style={styles.categoryBadgeText}>{report.category}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
                  <Text style={[styles.statusBadgeText, { color: statusBadge.color }]}>
                    {statusBadge.text}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportDescription} numberOfLines={2}>
                {report.description}
              </Text>
              
              <View style={styles.reportMeta}>
                <View style={styles.reportMetaItem}>
                  <MapPinIcon size={14} color="#6B7280" />
                  <Text style={styles.reportMetaText}>{report.location}</Text>
                </View>
                <View style={styles.reportMetaItem}>
                  <ClockIcon size={14} color="#6B7280" />
                  <Text style={styles.reportMetaText}>{report.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB Menu Overlay */}
      {isFABOpen && (
        <TouchableOpacity 
          style={styles.fabOverlay}
          activeOpacity={1}
          onPress={toggleFAB}
        />
      )}

      {/* FAB Menu Items */}
      <Animated.View 
        style={[
          styles.fabMenuContainer,
          {
            opacity: menuOpacity,
            transform: [{ scale: menuScale }],
          }
        ]}
        pointerEvents={isFABOpen ? 'auto' : 'none'}
      >
        {fabMenuItems.map((item, index) => (
          <Animated.View
            key={item.id}
            style={[
              styles.fabMenuItem,
              {
                transform: [
                  {
                    translateY: itemAnimations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                  {
                    scale: itemAnimations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.fabMenuItemContent}
              onPress={() => handleMenuItemPress(item)}
              activeOpacity={0.8}
            >
              <View style={[styles.fabMenuItemIcon, { backgroundColor: item.color }]}>
                {item.icon}
              </View>
              <View style={styles.fabMenuItemTextContainer}>
                <Text style={styles.fabMenuItemTitle}>{item.title}</Text>
                <Text style={styles.fabMenuItemDescription}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </Animated.View>

      {/* FAB Button */}
      <Animated.View style={[styles.fabButton, { transform: [{ rotate: rotateZ }] }]}>
        <TouchableOpacity
          style={styles.fabButtonInner}
          onPress={toggleFAB}
          activeOpacity={0.9}
        >
          {isFABOpen ? (
            <CloseIcon size={28} color="#FFFFFF" />
          ) : (
            <PlusIcon size={28} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Report Form Modal */}
      <Modal
        visible={showFormModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowFormModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.formModalHeader}>
            <TouchableOpacity 
              style={styles.formBackButton}
              onPress={() => setShowFormModal(false)}
            >
              <ArrowLeftIcon size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.formModalTitle}>New Report</Text>
            <View style={{ width: 40 }} />
          </View>

          <KeyboardAwareScrollView 
            style={styles.modalContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraScrollHeight={Platform.OS === 'ios' ? 100 : 120}
            keyboardOpeningTime={0}
          >
              {/* Progress Indicator */}
              <View style={styles.progressContainer}>
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressStep}>STEP 1 OF 2</Text>
                  <Text style={styles.progressTitle}>Incident Details</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={styles.progressFill} />
                </View>
              </View>

              {/* Section 1: Basic Info */}
              <View style={styles.formSection}>
                {/* Case Type */}
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Case Type</Text>
                  <TouchableOpacity 
                    style={styles.selectButton}
                    onPress={() => setShowCaseTypePicker(!showCaseTypePicker)}
                  >
                    <Text style={formData.caseType ? styles.selectTextSelected : styles.selectTextPlaceholder}>
                      {formData.caseType ? caseTypes.find(t => t.value === formData.caseType)?.label : 'Select category...'}
                    </Text>
                    <ChevronDownIcon size={16} color="#6B7280" />
                  </TouchableOpacity>
                  
                  {/* Case Type Dropdown */}
                  {showCaseTypePicker && (
                    <View style={styles.dropdownContainer}>
                      {caseTypes.map((type) => (
                        <TouchableOpacity
                          key={type.value}
                          style={[
                            styles.dropdownItem,
                            formData.caseType === type.value && styles.dropdownItemSelected
                          ]}
                          onPress={() => {
                            setFormData(prev => ({ ...prev, caseType: type.value }));
                            setShowCaseTypePicker(false);
                          }}
                        >
                          <Text style={[
                            styles.dropdownItemText,
                            formData.caseType === type.value && styles.dropdownItemTextSelected
                          ]}>
                            {type.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Date & Time Grid */}
                <View style={styles.dateTimeRow}>
                  <View style={styles.halfField}>
                    <Text style={styles.fieldLabel}>Date</Text>
                    <TouchableOpacity 
                      style={styles.dateTimeInput}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Text style={styles.dateTimeText}>{formData.date}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.halfField}>
                    <Text style={styles.fieldLabel}>Time</Text>
                    <TouchableOpacity 
                      style={styles.dateTimeInput}
                      onPress={() => setShowTimePicker(true)}
                    >
                      <Text style={styles.dateTimeText}>{formData.time}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Location */}
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Location</Text>
                  <View style={styles.locationInputWrapper}>
                    <View style={styles.locationIconWrapper}>
                      <MapPinIcon size={18} color="#B45309" />
                    </View>
                    <TextInput
                      style={styles.locationInput}
                      placeholder="Enter location or use GPS"
                      placeholderTextColor="#9CA3AF"
                      value={formData.location}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                    />
                    <TouchableOpacity 
                      style={styles.gpsButton}
                      onPress={handleCaptureLocation}
                      disabled={isGettingLocation}
                    >
                      {isGettingLocation ? (
                        <ActivityIndicator size="small" color="#B45309" />
                      ) : (
                        <CrosshairIcon size={16} color="#B45309" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Section 2: Evidence */}
              <View style={styles.formSection}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionHeaderLeft}>
                    <FileTextIcon size={16} color="#B45309" />
                    <Text style={styles.sectionLabelBold}>Evidence & Media</Text>
                  </View>
                  <Text style={styles.optionalText}>Optional</Text>
                </View>

                {/* Media Buttons */}
                <View style={styles.mediaButtonsGrid}>
                  <TouchableOpacity 
                    style={[styles.mediaButton, styles.mediaButtonRed]}
                    onPress={() => handleAddEvidence('photo')}
                  >
                    <View style={styles.mediaButtonIconWrapper}>
                      <CameraIcon size={20} color="#EF4444" />
                    </View>
                    <Text style={styles.mediaButtonTextRed}>Photo</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.mediaButton, styles.mediaButtonBlue]}
                    onPress={() => handleAddEvidence('selfie')}
                  >
                    <View style={styles.mediaButtonIconWrapper}>
                      <UserIcon size={20} color="#3B82F6" />
                    </View>
                    <Text style={styles.mediaButtonTextBlue}>Selfie</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.mediaButton, styles.mediaButtonAmber]}
                    onPress={() => handleAddEvidence('audio')}
                  >
                    <View style={styles.mediaButtonIconWrapper}>
                      <MicrophoneIcon size={20} color="#D97706" />
                    </View>
                    <Text style={styles.mediaButtonTextAmber}>Audio</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.mediaButton, styles.mediaButtonGray]}
                    onPress={() => handleAddEvidence('file')}
                  >
                    <View style={styles.mediaButtonIconWrapper}>
                      <PaperclipIcon size={20} color="#6B7280" />
                    </View>
                    <Text style={styles.mediaButtonTextGray}>File</Text>
                  </TouchableOpacity>
                </View>

                {/* Uploaded Files List */}
                {attachedFiles.length > 0 && (
                  <View style={styles.uploadedFilesContainer}>
                    {attachedFiles.map((file) => (
                      <View key={file.id} style={styles.uploadedFileItem}>
                        <View style={styles.uploadedFileLeft}>
                          <View style={[
                            styles.uploadedFileIcon,
                            file.type === 'image' && styles.uploadedFileIconRed,
                            file.type === 'audio' && styles.uploadedFileIconAmber,
                            file.type === 'file' && styles.uploadedFileIconGray,
                          ]}>
                            {file.type === 'image' && <ImageIcon size={18} color="#EF4444" />}
                            {file.type === 'audio' && <MicrophoneIcon size={18} color="#D97706" />}
                            {file.type === 'file' && <PaperclipIcon size={18} color="#6B7280" />}
                          </View>
                          <View>
                            <Text style={styles.uploadedFileName}>{file.name}</Text>
                            <Text style={styles.uploadedFileSize}>{file.size} • Just now</Text>
                          </View>
                        </View>
                        <TouchableOpacity 
                          style={styles.removeFileButton}
                          onPress={() => handleRemoveFile(file.id)}
                        >
                          <TrashIcon size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* Section 3: Description */}
              <View style={styles.formSection}>
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Description *</Text>
                  <TextInput
                    style={[styles.fieldInput, styles.textArea]}
                    placeholder="Describe what happened..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={formData.description}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>People Involved</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="Names or descriptions"
                    placeholderTextColor="#9CA3AF"
                    value={formData.peopleInvolved}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, peopleInvolved: text }))}
                  />
                </View>
              </View>

          </KeyboardAwareScrollView>

          {/* Bottom Action Bar */}
          <View style={styles.bottomActionBar}>
            <TouchableOpacity 
              style={[
                styles.submitReportButton,
                (!formData.description || !formData.location) && styles.submitButtonDisabled
              ]}
              onPress={handleFormSubmit}
              disabled={!formData.description || !formData.location}
            >
              <Text style={styles.submitReportButtonText}>Submit Report</Text>
              <PlaneIcon size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Confirmation Dialog */}
      <Modal
        visible={showConfirmDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmDialog(false)}
      >
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogContainer}>
            <View style={styles.dialogIconContainer}>
              <ShieldIcon size={40} color="#B45309" />
            </View>
            <Text style={styles.dialogTitle}>Submit Report?</Text>
            <Text style={styles.dialogMessage}>
              Are you sure you want to submit this report? Our team will review it and take appropriate action.
            </Text>
            <View style={styles.dialogButtons}>
              <TouchableOpacity 
                style={styles.dialogButtonCancel}
                onPress={() => setShowConfirmDialog(false)}
              >
                <Text style={styles.dialogButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dialogButtonConfirm}
                onPress={confirmSubmission}
              >
                <Text style={styles.dialogButtonConfirmText}>Yes, Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Dialog */}
      <Modal
        visible={showSuccessDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessDialog(false)}
      >
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogContainer}>
            <CheckCircleIcon size={64} color="#10B981" />
            <Text style={[styles.dialogTitle, { marginTop: 16 }]}>Success!</Text>
            <Text style={styles.dialogMessage}>
              Your report has been submitted successfully. You will receive a notification once it has been reviewed.
            </Text>
            <Text style={styles.referenceNumber}>Reference: #GG-2024-0456</Text>
            <TouchableOpacity 
              style={[styles.dialogButtonConfirm, { marginTop: 24, width: '100%' }]}
              onPress={() => setShowSuccessDialog(false)}
            >
              <Text style={styles.dialogButtonConfirmText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Audio Recording Modal */}
      <Modal
        visible={showAudioRecorder}
        transparent
        animationType="fade"
        onRequestClose={cancelRecording}
      >
        <View style={styles.dialogOverlay}>
          <View style={[styles.dialogContainer, { paddingVertical: 32 }]}>
            <View style={styles.audioRecorderHeader}>
              <MicrophoneIcon size={32} color={isRecording ? '#EF4444' : '#D97706'} />
              <Text style={styles.audioRecorderTitle}>
                {isRecording ? 'Recording...' : 'Voice Note'}
              </Text>
            </View>
            
            {/* Timer Display */}
            <View style={styles.audioTimerContainer}>
              <Text style={[
                styles.audioTimerText,
                isRecording && { color: '#EF4444' }
              ]}>
                {recordingDuration}
              </Text>
              <Text style={styles.audioMaxDuration}>
                / 00:{MAX_RECORDING_SECONDS} max
              </Text>
            </View>
            
            {/* Recording Indicator */}
            {isRecording && (
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>Recording audio...</Text>
              </View>
            )}
            
            {/* Progress Bar */}
            <View style={styles.audioProgressBar}>
              <View 
                style={[
                  styles.audioProgressFill,
                  { width: `${(recordingSecondsRef.current / MAX_RECORDING_SECONDS) * 100}%` }
                ]} 
              />
            </View>
            
            {/* Action Buttons */}
            <View style={styles.audioButtonsContainer}>
              {!isRecording ? (
                <>
                  <TouchableOpacity 
                    style={styles.audioCancelButton}
                    onPress={cancelRecording}
                  >
                    <Text style={styles.audioCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.audioStartButton}
                    onPress={startRecording}
                  >
                    <MicrophoneIcon size={20} color="#FFFFFF" />
                    <Text style={styles.audioStartButtonText}>Start Recording</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity 
                  style={styles.audioStopButton}
                  onPress={() => stopRecording(true)}
                >
                  <View style={styles.stopIcon} />
                  <Text style={styles.audioStopButtonText}>Stop & Save</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <Text style={styles.audioHint}>
              Tap to start recording. Maximum {MAX_RECORDING_SECONDS} seconds.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ============ STYLES ============

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  
  // Header
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#B45309',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    paddingVertical: 12,
    marginLeft: 10,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  // Filter Chips
  filterChipsContainer: {
    marginTop: 12,
    maxHeight: 44,
  },
  filterChipsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#B45309',
    borderColor: '#B45309',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },

  // Reports List
  reportsList: {
    flex: 1,
    marginTop: 16,
  },
  reportsListContent: {
    paddingHorizontal: 16,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reportCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  reportDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  reportMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  reportMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reportMetaText: {
    fontSize: 12,
    color: '#6B7280',
  },

  // FAB
  fabOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#B45309',
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabButtonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabMenuContainer: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: width - 40,
    maxWidth: 320,
  },
  fabMenuItem: {
    marginBottom: 8,
  },
  fabMenuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  fabMenuItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fabMenuItemTextContainer: {
    flex: 1,
  },
  fabMenuItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  fabMenuItemDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  reportTypeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  reportTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  reportTypeText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  userInfoSection: {
    marginBottom: 24,
  },
  userInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  fieldInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
  },
  fieldInputDisabled: {
    backgroundColor: '#F9FAFB',
    color: '#6B7280',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  reportDetailsSection: {
    marginBottom: 24,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoUploadButton: {
    height: 100,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  photoUploadText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
  },
  submitContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#B45309',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Dialog
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialogContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  dialogIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  dialogMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  dialogButtons: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  dialogButtonCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  dialogButtonCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  dialogButtonConfirm: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#B45309',
    alignItems: 'center',
  },
  dialogButtonConfirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  referenceNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B45309',
    marginTop: 12,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  
  // Enhanced Form Modal Styles
  formModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#B45309',
  },
  formBackButton: {
    padding: 8,
    borderRadius: 20,
  },
  formModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  progressTextContainer: {
    flex: 1,
  },
  progressStep: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B45309',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
  progressBar: {
    width: 100,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    width: '50%',
    height: '100%',
    backgroundColor: '#B45309',
    borderRadius: 3,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectTextPlaceholder: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  selectTextSelected: {
    fontSize: 15,
    color: '#1F2937',
  },
  dropdownContainer: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemSelected: {
    backgroundColor: '#FEF3C7',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#374151',
  },
  dropdownItemTextSelected: {
    color: '#B45309',
    fontWeight: '600',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfField: {
    flex: 1,
  },
  dateTimeInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateTimeText: {
    fontSize: 15,
    color: '#1F2937',
  },
  locationInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  locationIconWrapper: {
    paddingLeft: 14,
  },
  locationInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  gpsButton: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionLabelBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  optionalText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  mediaButtonsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  mediaButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  mediaButtonRed: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  mediaButtonBlue: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  mediaButtonAmber: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  mediaButtonGray: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mediaButtonIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mediaButtonTextRed: {
    fontSize: 10,
    fontWeight: '600',
    color: '#DC2626',
  },
  mediaButtonTextBlue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2563EB',
  },
  mediaButtonTextAmber: {
    fontSize: 10,
    fontWeight: '600',
    color: '#D97706',
  },
  mediaButtonTextGray: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4B5563',
  },
  uploadedFilesContainer: {
    marginTop: 12,
    gap: 8,
  },
  uploadedFileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  uploadedFileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  uploadedFileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadedFileIconRed: {
    backgroundColor: '#FEE2E2',
  },
  uploadedFileIconAmber: {
    backgroundColor: '#FEF3C7',
  },
  uploadedFileIconGray: {
    backgroundColor: '#E5E7EB',
  },
  uploadedFileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  uploadedFileSize: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  removeFileButton: {
    padding: 8,
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  submitReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B45309',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  submitReportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Audio Recorder Modal Styles
  audioRecorderHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  audioRecorderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
  },
  audioTimerContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 16,
  },
  audioTimerText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1F2937',
    fontVariant: ['tabular-nums'],
  },
  audioMaxDuration: {
    fontSize: 16,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500',
  },
  audioProgressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 24,
    overflow: 'hidden',
  },
  audioProgressFill: {
    height: '100%',
    backgroundColor: '#D97706',
    borderRadius: 3,
  },
  audioButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  audioCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  audioCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  audioStartButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#D97706',
    gap: 8,
  },
  audioStartButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  audioStopButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    gap: 8,
  },
  stopIcon: {
    width: 16,
    height: 16,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  audioStopButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  audioHint: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default ServicesScreen;
