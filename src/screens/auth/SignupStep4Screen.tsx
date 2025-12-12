import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    Alert,
    PermissionsAndroid,
    Modal,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useTheme } from '../../context/ThemeContext';
import { launchCamera, CameraOptions, ImagePickerResponse } from 'react-native-image-picker';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList, RegistrationData } from '../../navigation/types';

type SignupStep4ScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignupStep4'>;
type SignupStep4ScreenRouteProp = RouteProp<AuthStackParamList, 'SignupStep4'>;

// Dropdown options
const HOUSE_TYPES = [
    { value: 'COMPOUND', label: 'Compound', description: 'Multiple buildings within a shared perimeter' },
    { value: 'STANDALONE', label: 'Standalone', description: 'Single independent building' },
    { value: 'APARTMENT', label: 'Apartment', description: 'Unit within a multi-story building' },
];

const OWNERSHIP_STATUSES = [
    { value: 'owner', label: 'Owner of Property' },
    { value: 'tenant', label: 'Tenant' },
    { value: 'landlord', label: 'Landlord' },
    { value: 'community_elder', label: 'Community Elder' },
    { value: 'community_owner', label: 'Community Owner' },
];

interface PhotoState {
    front: string | null;
    back: string | null;
    selfie: string | null;
    compound: string | null;
}

interface DocumentState {
    landOwnership: string | null;
    councilTax: string | null;
    landlordAgreement: string | null;
    landlordId: string | null;
}

const SignupStep4Screen: React.FC = () => {
    const navigation = useNavigation<SignupStep4ScreenNavigationProp>();
    const route = useRoute<SignupStep4ScreenRouteProp>();
    const { theme, isDarkMode } = useTheme();
    const existingData = route.params?.registrationData || {};
    
    const [latitude, setLatitude] = useState(existingData.gpsLatitude?.toString() || '');
    const [longitude, setLongitude] = useState(existingData.gpsLongitude?.toString() || '');
    const [fullAddress, setFullAddress] = useState(existingData.fullAddress || '');
    const [digitalAddress, setDigitalAddress] = useState(existingData.digitalAddress || '');
    const [houseType, setHouseType] = useState(existingData.houseType || 'COMPOUND');
    const [compoundName, setCompoundName] = useState(existingData.compoundName || '');
    const [landmark, setLandmark] = useState(existingData.nearestLandmark || '');
    const [ownershipStatus, setOwnershipStatus] = useState(existingData.ownershipStatus || 'owner');
    const [isLoading, setIsLoading] = useState(false);
    const [locationCaptured, setLocationCaptured] = useState(!!existingData.gpsLatitude);

    // Modal states
    const [showHouseTypeModal, setShowHouseTypeModal] = useState(false);
    const [showOwnershipModal, setShowOwnershipModal] = useState(false);

    // Photo states
    const [photos, setPhotos] = useState<PhotoState>({
        front: null,
        back: null,
        selfie: null,
        compound: null,
    });

    // Document states
    const [documents, setDocuments] = useState<DocumentState>({
        landOwnership: null,
        councilTax: null,
        landlordAgreement: null,
        landlordId: null,
    });

    const handleComplete = () => {
        // Validate GPS coordinates
        if (!latitude || !longitude) {
            Alert.alert('Required Field', 'Please capture your GPS location');
            return;
        }

        console.log('[SignupStep4] Completing registration...');
        
        // Combine all registration data
        const finalData: RegistrationData = {
            ...existingData,
            fullAddress,
            gpsLatitude: parseFloat(latitude),
            gpsLongitude: parseFloat(longitude),
            digitalAddress,
            compoundName,
            nearestLandmark: landmark,
            houseType,
            ownershipStatus,
        };
        
        // Navigate to Registration Complete screen
        navigation.navigate('RegistrationComplete', { registrationData: finalData });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleCaptureLocation = async () => {
        setIsLoading(true);
        try {
            // Request location permission on Android
            if (Platform.OS === 'android') {
                // Check if permission already granted
                const hasPermission = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                
                if (!hasPermission) {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Location Permission',
                            message: 'EGOV-CITIZEN needs access to your location for address verification.',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                        }
                    );
                    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                        setIsLoading(false);
                        Alert.alert('Permission Denied', 'Location permission is required to capture GPS coordinates.');
                        return;
                    }
                }
            }

            // Use Geolocation with proper error handling
            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude: lat, longitude: lng } = position.coords;
                    setLatitude(lat.toFixed(6));
                    setLongitude(lng.toFixed(6));
                    setLocationCaptured(true);
                    setIsLoading(false);
                    Alert.alert('Success', `Location captured!\nLatitude: ${lat.toFixed(6)}\nLongitude: ${lng.toFixed(6)}`);
                    console.log('[SignupStep4] Location captured:', lat, lng);
                },
                (error) => {
                    setIsLoading(false);
                    console.log('[SignupStep4] Location error:', error.code, error.message);
                    
                    let errorMessage = 'Failed to get location. Please try again.';
                    let errorTitle = 'Location Error';
                    
                    switch (error.code) {
                        case 1: // PERMISSION_DENIED
                            errorMessage = 'Location permission denied. Please enable location access in settings.';
                            break;
                        case 2: // POSITION_UNAVAILABLE
                            errorMessage = 'Location unavailable. Please make sure GPS is enabled and try again outdoors.';
                            break;
                        case 3: // TIMEOUT
                            errorMessage = 'Location request timed out. Please try again in an open area.';
                            break;
                        case 4: // PLAY_SERVICE_NOT_AVAILABLE
                            errorTitle = 'Google Play Services';
                            errorMessage = 'Google Play Services is not available. Please update Google Play Services.';
                            break;
                        case 5: // SETTINGS_NOT_SATISFIED
                            errorTitle = 'Location Settings';
                            errorMessage = 'Please enable Location in your device settings and set it to High Accuracy mode.';
                            break;
                        case -1: // INTERNAL_ERROR
                            errorMessage = 'Internal error occurred. Please restart the app and try again.';
                            break;
                        default:
                            errorMessage = `Location error: ${error.message}`;
                    }
                    Alert.alert(errorTitle, errorMessage);
                },
                { 
                    enableHighAccuracy: true,
                    timeout: 30000,
                    maximumAge: 10000,
                    showLocationDialog: true,
                    forceRequestLocation: true,
                    forceLocationManager: true, // Use native LocationManager for better compatibility
                }
            );
        } catch (error: any) {
            setIsLoading(false);
            console.log('[SignupStep4] Permission error:', error);
            Alert.alert('Error', 'Failed to request location permission.');
        }
    };

    const requestCameraPermission = async (): Promise<boolean> => {
        if (Platform.OS === 'android') {
            try {
                // Check if already granted
                const hasPermission = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.CAMERA
                );
                
                if (hasPermission) {
                    return true;
                }
                
                // Request permission
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'EGOV-CITIZEN needs access to your camera to take property photos.',
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
                        'Please enable camera permission in your phone settings to take photos.',
                        [{ text: 'OK' }]
                    );
                    return false;
                }
                return false;
            } catch (err) {
                console.log('[SignupStep4] Camera permission error:', err);
                Alert.alert('Error', 'Failed to request camera permission.');
                return false;
            }
        }
        return true;
    };

    const handleTakePhoto = async (photoType: keyof PhotoState) => {
        try {
            const hasPermission = await requestCameraPermission();
            
            if (!hasPermission) {
                return;
            }

            const options: CameraOptions = {
                mediaType: 'photo',
                quality: 0.8,
                cameraType: photoType === 'selfie' ? 'front' : 'back',
                saveToPhotos: false,
                includeBase64: false,
            };

            launchCamera(options, (response: ImagePickerResponse) => {
                if (response.didCancel) {
                    console.log('[SignupStep4] User cancelled camera');
                    return;
                }
                
                if (response.errorCode) {
                    console.log('[SignupStep4] Camera error:', response.errorCode, response.errorMessage);
                    Alert.alert('Camera Error', response.errorMessage || 'Failed to take photo');
                    return;
                }

                if (response.assets && response.assets.length > 0) {
                    const uri = response.assets[0].uri;
                    if (uri) {
                        setPhotos(prev => ({ ...prev, [photoType]: uri }));
                        Alert.alert('Success', 'Photo captured successfully!');
                        console.log('[SignupStep4] Photo captured:', photoType, uri);
                    }
                }
            });
        } catch (error) {
            console.log('[SignupStep4] handleTakePhoto error:', error);
            Alert.alert('Error', 'Failed to open camera. Please try again.');
        }
    };

    const handleTakeDocument = async (docType: keyof DocumentState) => {
        try {
            const hasPermission = await requestCameraPermission();
            
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
                    console.log('[SignupStep4] User cancelled document capture');
                    return;
                }
                
                if (response.errorCode) {
                    console.log('[SignupStep4] Document capture error:', response.errorCode, response.errorMessage);
                    Alert.alert('Camera Error', response.errorMessage || 'Failed to capture document');
                    return;
                }

                if (response.assets && response.assets.length > 0) {
                    const uri = response.assets[0].uri;
                    if (uri) {
                        setDocuments(prev => ({ ...prev, [docType]: uri }));
                        Alert.alert('Success', 'Document captured successfully!');
                        console.log('[SignupStep4] Document captured:', docType, uri);
                    }
                }
            });
        } catch (error) {
            console.log('[SignupStep4] handleTakeDocument error:', error);
            Alert.alert('Error', 'Failed to open camera. Please try again.');
        }
    };

    const getHouseTypeLabel = () => {
        const type = HOUSE_TYPES.find(t => t.value === houseType);
        return type ? type.label : 'Select House Type';
    };

    const getOwnershipLabel = () => {
        const status = OWNERSHIP_STATUSES.find(s => s.value === ownershipStatus);
        return status ? status.label : 'Select Status';
    };

    const getHouseTypeInfo = () => {
        return HOUSE_TYPES.find(t => t.value === houseType);
    };

    const getPhotoCount = () => {
        const count = Object.values(photos).filter(p => p !== null).length;
        return count;
    };

    // Icons
    const ArrowLeftIcon = () => (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M19 12H5M12 19l-7-7 7-7" />
        </Svg>
    );

    const ShieldIcon = () => (
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="#B45309">
            <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </Svg>
    );

    const CheckIcon = () => (
        <Svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M20 6L9 17l-5-5" />
        </Svg>
    );

    const LockIcon = () => (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </Svg>
    );

    const TargetIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="12" r="10" />
            <Circle cx="12" cy="12" r="6" />
            <Circle cx="12" cy="12" r="2" />
        </Svg>
    );

    const CheckCircleIcon = () => (
        <Svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <Path d="M22 4L12 14.01l-3-3" />
        </Svg>
    );

    const HouseIcon = () => (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <Path d="M9 22V12h6v10" />
        </Svg>
    );

    const MapPinIcon = () => (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <Circle cx="12" cy="10" r="3" />
        </Svg>
    );

    const ChevronDownIcon = () => (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M6 9l6 6 6-6" />
        </Svg>
    );

    const FileIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </Svg>
    );

    const CameraIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <Circle cx="12" cy="13" r="4" />
        </Svg>
    );

    const TrashIcon = () => (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </Svg>
    );

    const ArrowRightIcon = () => (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M5 12h14M12 5l7 7-7 7" />
        </Svg>
    );

    const CloseIcon = () => (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M18 6L6 18M6 6l12 12" />
        </Svg>
    );

    // House Type Modal
    const renderHouseTypeModal = () => (
        <Modal
            visible={showHouseTypeModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowHouseTypeModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select House Type</Text>
                        <TouchableOpacity onPress={() => setShowHouseTypeModal(false)}>
                            <CloseIcon />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={HOUSE_TYPES}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.modalOption,
                                    houseType === item.value && styles.modalOptionSelected
                                ]}
                                onPress={() => {
                                    setHouseType(item.value);
                                    setShowHouseTypeModal(false);
                                }}
                            >
                                <View style={styles.modalOptionContent}>
                                    <Text style={[
                                        styles.modalOptionLabel,
                                        houseType === item.value && styles.modalOptionLabelSelected
                                    ]}>
                                        {item.label}
                                    </Text>
                                    <Text style={styles.modalOptionDesc}>{item.description}</Text>
                                </View>
                                {houseType === item.value && (
                                    <View style={styles.modalCheckCircle}>
                                        <CheckIcon />
                                    </View>
                                )}
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        </Modal>
    );

    // Ownership Status Modal
    const renderOwnershipModal = () => (
        <Modal
            visible={showOwnershipModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowOwnershipModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Ownership Status</Text>
                        <TouchableOpacity onPress={() => setShowOwnershipModal(false)}>
                            <CloseIcon />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={OWNERSHIP_STATUSES}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.modalOption,
                                    ownershipStatus === item.value && styles.modalOptionSelected
                                ]}
                                onPress={() => {
                                    setOwnershipStatus(item.value);
                                    setShowOwnershipModal(false);
                                }}
                            >
                                <Text style={[
                                    styles.modalOptionLabel,
                                    ownershipStatus === item.value && styles.modalOptionLabelSelected
                                ]}>
                                    {item.label}
                                </Text>
                                {ownershipStatus === item.value && (
                                    <View style={styles.modalCheckCircle}>
                                        <CheckIcon />
                                    </View>
                                )}
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        </Modal>
    );

    // Render photo item with actual camera capture
    const renderPhotoItem = (type: keyof PhotoState, label: string) => {
        const photo = photos[type];
        
        if (photo) {
            return (
                <View style={styles.photoItem}>
                    <Image source={{ uri: photo }} style={styles.photoImage} />
                    <View style={styles.photoLabel}>
                        <Text style={styles.photoLabelText}>{label}</Text>
                    </View>
                    <View style={styles.photoCheck}>
                        <CheckIcon />
                    </View>
                    <TouchableOpacity 
                        style={styles.photoDelete}
                        onPress={() => setPhotos(prev => ({ ...prev, [type]: null }))}
                    >
                        <TrashIcon />
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <TouchableOpacity 
                style={styles.photoAdd}
                onPress={() => handleTakePhoto(type)}
            >
                <View style={styles.photoAddIcon}>
                    <CameraIcon />
                </View>
                <Text style={styles.photoAddText}>{label}</Text>
            </TouchableOpacity>
        );
    };

    // Render document item
    const renderDocumentItem = (type: keyof DocumentState, label: string, required: boolean = true) => {
        const doc = documents[type];
        
        if (doc) {
            return (
                <View style={styles.documentItem}>
                    <View style={styles.docPreview}>
                        <Image source={{ uri: doc }} style={styles.docImage} />
                    </View>
                    <View style={styles.docInfo}>
                        <Text style={styles.docName}>{label}</Text>
                        <View style={styles.docStatus}>
                            <CheckCircleIcon />
                            <Text style={styles.docStatusText}>Captured</Text>
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={styles.docDelete}
                        onPress={() => setDocuments(prev => ({ ...prev, [type]: null }))}
                    >
                        <TrashIcon />
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={[styles.documentItem, styles.documentItemDashed]}>
                <View style={styles.docEmptyIcon}>
                    <CameraIcon />
                </View>
                <View style={styles.docInfo}>
                    <Text style={styles.docName}>{label}</Text>
                    <Text style={styles.docRequired}>{required ? 'Required' : 'Optional'}</Text>
                </View>
                <TouchableOpacity 
                    style={styles.captureButton}
                    onPress={() => handleTakeDocument(type)}
                >
                    <Text style={styles.captureButtonText}>Capture</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />

            {/* Modals */}
            {renderHouseTypeModal()}
            {renderOwnershipModal()}

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <ArrowLeftIcon />
                    </TouchableOpacity>
                    <View style={styles.headerBrand}>
                        <View style={styles.logo}>
                            <ShieldIcon />
                        </View>
                        <Text style={styles.headerTitle}>EGOV-CITIZEN</Text>
                    </View>
                </View>
                <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>Step 5/5</Text>
                </View>
            </View>

            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent}>

                        {/* Progress Bar */}
                        <View style={styles.progressSection}>
                            <View style={styles.progressRow}>
                                <View style={[styles.stepCircle, styles.stepCircleDone]}><CheckIcon /></View>
                                <View style={[styles.progressLine, styles.progressLineDone]} />
                                <View style={[styles.stepCircle, styles.stepCircleDone]}><CheckIcon /></View>
                                <View style={[styles.progressLine, styles.progressLineDone]} />
                                <View style={[styles.stepCircle, styles.stepCircleDone]}><CheckIcon /></View>
                                <View style={[styles.progressLine, styles.progressLineDone]} />
                                <View style={[styles.stepCircle, styles.stepCircleDone]}><CheckIcon /></View>
                                <View style={[styles.progressLine, styles.progressLineDone]} />
                                <View style={[styles.stepCircle, styles.stepCircleActive]}>
                                    <Text style={styles.stepNumberActive}>5</Text>
                                </View>
                            </View>
                            <View style={styles.progressLabels}>
                                <Text style={styles.progressLabel}>Account</Text>
                                <Text style={[styles.progressLabel, { paddingLeft: 8 }]}>Verify</Text>
                                <Text style={[styles.progressLabel, { paddingLeft: 4 }]}>Personal</Text>
                                <Text style={[styles.progressLabel, { paddingLeft: 4 }]}>Profile</Text>
                                <Text style={[styles.progressLabel, styles.progressLabelActive]}>Address</Text>
                            </View>
                        </View>

                        {/* Form Card */}
                        <View style={styles.card}>
                            <View style={styles.form}>

                                <View style={styles.titleSection}>
                                    <Text style={styles.cardTitle}>Address Registration</Text>
                                    <Text style={styles.cardSubtitle}>Verify your location and property details</Text>
                                </View>

                                {/* Full Address (Disabled) */}
                                <View style={[styles.inputGroup, { opacity: 0.6 }]}>
                                    <View style={styles.labelRow}>
                                        <Text style={styles.labelUpper}>FULL ADDRESS</Text>
                                        <View style={styles.adminBadge}>
                                            <Text style={styles.adminBadgeText}>Admin Only</Text>
                                        </View>
                                    </View>
                                    <View style={styles.inputDisabled}>
                                        <TextInput
                                            style={styles.inputFieldDisabled}
                                            value="Pending Verification..."
                                            editable={false}
                                        />
                                        <LockIcon />
                                    </View>
                                </View>

                                {/* GPS Coordinates */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.labelUpper}>
                                        GPS COORDINATES <Text style={styles.required}>*</Text>
                                    </Text>
                                    <View style={styles.gpsRow}>
                                        <View style={styles.gpsInput}>
                                            <Text style={styles.gpsPrefix}>Lat</Text>
                                            <TextInput
                                                style={styles.gpsField}
                                                value={latitude}
                                                editable={false}
                                                placeholder="0.000000"
                                                placeholderTextColor="#9CA3AF"
                                            />
                                        </View>
                                        <View style={styles.gpsInput}>
                                            <Text style={styles.gpsPrefix}>Lng</Text>
                                            <TextInput
                                                style={styles.gpsField}
                                                value={longitude}
                                                editable={false}
                                                placeholder="0.000000"
                                                placeholderTextColor="#9CA3AF"
                                            />
                                        </View>
                                        <TouchableOpacity 
                                            style={[styles.gpsButton, isLoading && styles.gpsButtonDisabled]} 
                                            onPress={handleCaptureLocation}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <ActivityIndicator color="#FFFFFF" size="small" />
                                            ) : (
                                                <TargetIcon />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                    {locationCaptured && (
                                        <View style={styles.successRow}>
                                            <CheckCircleIcon />
                                            <Text style={styles.successText}>Location captured successfully</Text>
                                        </View>
                                    )}
                                </View>

                                {/* House Type - Clickable Dropdown */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.labelUpper}>
                                        HOUSE TYPE <Text style={styles.required}>*</Text>
                                    </Text>
                                    <TouchableOpacity 
                                        style={styles.selectContainer}
                                        onPress={() => setShowHouseTypeModal(true)}
                                    >
                                        <Text style={styles.selectText}>{getHouseTypeLabel()}</Text>
                                        <ChevronDownIcon />
                                    </TouchableOpacity>

                                    {/* House Type Info Box */}
                                    {getHouseTypeInfo() && (
                                        <View style={styles.infoBox}>
                                            <View style={styles.infoIconCircle}>
                                                <HouseIcon />
                                            </View>
                                            <View style={styles.infoContent}>
                                                <Text style={styles.infoTitle}>{getHouseTypeLabel()} Selected</Text>
                                                <Text style={styles.infoText}>
                                                    {getHouseTypeInfo()?.description}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </View>

                                {/* Compound Name - Show only for COMPOUND type */}
                                {houseType === 'COMPOUND' && (
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.labelUpper}>COMPOUND NAME</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="e.g., Kinteh Kunda"
                                            placeholderTextColor="#9CA3AF"
                                            value={compoundName}
                                            onChangeText={setCompoundName}
                                        />
                                    </View>
                                )}

                                {/* Landmark */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.labelUpper}>NEAREST LANDMARK</Text>
                                    <View style={styles.inputWithIcon}>
                                        <View style={styles.inputIcon}>
                                            <MapPinIcon />
                                        </View>
                                        <TextInput
                                            style={styles.inputField}
                                            placeholder="e.g., Near Central Mosque"
                                            placeholderTextColor="#9CA3AF"
                                            value={landmark}
                                            onChangeText={setLandmark}
                                        />
                                    </View>
                                </View>

                                {/* Ownership Status - Clickable Dropdown */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.labelUpper}>
                                        OWNERSHIP STATUS <Text style={styles.required}>*</Text>
                                    </Text>
                                    <TouchableOpacity 
                                        style={styles.selectContainer}
                                        onPress={() => setShowOwnershipModal(true)}
                                    >
                                        <Text style={styles.selectText}>{getOwnershipLabel()}</Text>
                                        <ChevronDownIcon />
                                    </TouchableOpacity>
                                </View>

                                {/* Owner/Landlord Documents - Conditional */}
                                {(ownershipStatus === 'owner' || ownershipStatus === 'landlord') && (
                                    <View style={styles.documentsSection}>
                                        <View style={styles.documentsHeader}>
                                            <FileIcon />
                                            <Text style={styles.documentsTitle}>
                                                {ownershipStatus === 'landlord' ? 'Landlord Documents' : 'Owner Documents'}
                                            </Text>
                                        </View>
                                        <Text style={styles.documentsSubtitle}>
                                            Please capture photos of your documents for verification.
                                        </Text>

                                        <View style={styles.documentsList}>
                                            {renderDocumentItem('landOwnership', 'Land Ownership')}
                                            {renderDocumentItem('councilTax', 'Council Tax Receipt')}
                                            
                                            {/* Extra documents for Landlord */}
                                            {ownershipStatus === 'landlord' && (
                                                <>
                                                    {renderDocumentItem('landlordAgreement', 'Rental Agreement')}
                                                    {renderDocumentItem('landlordId', 'Landlord ID', false)}
                                                </>
                                            )}
                                        </View>
                                    </View>
                                )}

                                {/* Tenant Documents */}
                                {ownershipStatus === 'tenant' && (
                                    <View style={styles.documentsSection}>
                                        <View style={styles.documentsHeader}>
                                            <FileIcon />
                                            <Text style={styles.documentsTitle}>Tenant Documents</Text>
                                        </View>
                                        <Text style={styles.documentsSubtitle}>
                                            Please capture your rental agreement for verification.
                                        </Text>

                                        <View style={styles.documentsList}>
                                            {renderDocumentItem('landlordAgreement', 'Rental Agreement')}
                                        </View>
                                    </View>
                                )}

                                {/* Property Photos */}
                                <View style={styles.inputGroup}>
                                    <View style={styles.labelRow}>
                                        <Text style={styles.labelUpper}>
                                            PROPERTY PHOTOS <Text style={styles.required}>*</Text>
                                        </Text>
                                        <View style={styles.photoCount}>
                                            <Text style={styles.photoCountText}>{getPhotoCount()} of 4 ready</Text>
                                        </View>
                                    </View>

                                    <View style={styles.photoGrid}>
                                        {renderPhotoItem('front', 'Front')}
                                        {renderPhotoItem('back', 'Back')}
                                    </View>
                                    <View style={[styles.photoGrid, { marginTop: 12 }]}>
                                        {renderPhotoItem('selfie', 'Selfie')}
                                        {houseType === 'COMPOUND' && renderPhotoItem('compound', 'Compound')}
                                    </View>
                                </View>

                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
                                <Text style={styles.backBtnText}>Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.completeBtn} onPress={handleComplete}>
                                <Text style={styles.completeBtnText}>Complete Registration</Text>
                                <ArrowRightIcon />
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
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
        paddingVertical: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    backButton: {
        padding: 4,
    },
    headerBrand: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logo: {
        width: 32,
        height: 32,
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    stepBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    stepBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    safeArea: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 16,
        paddingBottom: 96,
    },
    progressSection: {
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    stepCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepCircleDone: {
        backgroundColor: '#B45309',
    },
    stepCircleActive: {
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#B45309',
        shadowColor: '#B45309',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    stepNumberActive: {
        fontSize: 12,
        fontWeight: '700',
        color: '#B45309',
    },
    progressLine: {
        flex: 1,
        height: 4,
        backgroundColor: '#D1D5DB',
        marginHorizontal: 4,
        borderRadius: 2,
    },
    progressLineDone: {
        backgroundColor: '#B45309',
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    progressLabel: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '500',
    },
    progressLabelActive: {
        color: '#B45309',
        fontWeight: '700',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        overflow: 'hidden',
    },
    form: {
        padding: 20,
        gap: 20,
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    inputGroup: {
        gap: 6,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    labelUpper: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    required: {
        color: '#EF4444',
    },
    adminBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    adminBadgeText: {
        fontSize: 10,
        color: '#6B7280',
    },
    inputDisabled: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
    },
    inputFieldDisabled: {
        flex: 1,
        fontSize: 14,
        color: '#9CA3AF',
    },
    gpsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    gpsInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingLeft: 10,
        paddingRight: 8,
        height: 44,
    },
    gpsPrefix: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        marginRight: 8,
    },
    gpsField: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    gpsButton: {
        backgroundColor: '#B45309',
        width: 44,
        height: 44,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    successRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    successText: {
        fontSize: 10,
        color: '#16A34A',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: '#111827',
    },
    selectContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
    },
    selectInput: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#FFF7ED',
        borderWidth: 1,
        borderColor: '#FED7AA',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        gap: 12,
    },
    infoIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#B45309',
        marginBottom: 2,
    },
    infoText: {
        fontSize: 10,
        color: '#92400E',
        lineHeight: 14,
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingLeft: 12,
        paddingRight: 12,
        height: 44,
        gap: 8,
    },
    inputIcon: {
        // No styles needed
    },
    inputField: {
        flex: 1,
        fontSize: 14,
        color: '#111827',
    },
    documentsSection: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#DBEAFE',
        borderRadius: 12,
        padding: 16,
        gap: 12,
    },
    documentsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    documentsTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E3A8A',
    },
    documentsSubtitle: {
        fontSize: 12,
        color: '#1E40AF',
        lineHeight: 18,
    },
    documentsList: {
        gap: 12,
    },
    documentItem: {
        backgroundColor: '#FFFFFF',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DBEAFE',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    documentItemDashed: {
        borderStyle: 'dashed',
    },
    docPreview: {
        width: 48,
        height: 48,
        borderRadius: 4,
        overflow: 'hidden',
    },
    docImage: {
        width: 48,
        height: 48,
        backgroundColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    docImageText: {
        fontSize: 10,
        color: '#64748B',
    },
    docInfo: {
        flex: 1,
    },
    docName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    docStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    docStatusText: {
        fontSize: 10,
        color: '#16A34A',
    },
    docRequired: {
        fontSize: 10,
        color: '#9CA3AF',
    },
    docDelete: {
        padding: 8,
    },
    docEmptyIcon: {
        width: 48,
        height: 48,
        backgroundColor: '#EFF6FF',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    captureButton: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    captureButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    photoCount: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    photoCountText: {
        fontSize: 10,
        color: '#6B7280',
    },
    photoGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    photoItem: {
        flex: 1,
        aspectRatio: 1,
        position: 'relative',
    },
    photoPlaceholder: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoPlaceholderText: {
        fontSize: 12,
        color: '#94A3B8',
    },
    photoLabel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingVertical: 4,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    photoLabelText: {
        fontSize: 10,
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: '600',
    },
    photoCheck: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#22C55E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoAdd: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 8,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: 'rgba(180, 83, 9, 0.4)',
        backgroundColor: '#FFF7ED',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    photoAddIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(180, 83, 9, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoAddText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#B45309',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    backBtn: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    backBtnText: {
        color: '#374151',
        fontSize: 14,
        fontWeight: '600',
    },
    completeBtn: {
        flex: 2,
        backgroundColor: '#B45309',
        borderRadius: 12,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#78350F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    completeBtnText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    // GPS Button disabled state
    gpsButtonDisabled: {
        backgroundColor: '#D97706',
    },
    // Select text style
    selectText: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
    },
    // Photo image style
    photoImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    // Photo delete button
    photoDelete: {
        position: 'absolute',
        top: 4,
        left: 4,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '60%',
        paddingBottom: 34,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalOptionSelected: {
        backgroundColor: '#FFF7ED',
    },
    modalOptionContent: {
        flex: 1,
    },
    modalOptionLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
    },
    modalOptionLabelSelected: {
        color: '#B45309',
        fontWeight: '600',
    },
    modalOptionDesc: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    modalCheckCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#B45309',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SignupStep4Screen;
