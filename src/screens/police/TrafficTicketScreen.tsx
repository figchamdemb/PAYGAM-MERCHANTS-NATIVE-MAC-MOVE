/**
 * ✅ TRAFFIC TICKET SCREEN - SENTINEL PATROL
 * 
 * Issue traffic violations and fines
 * Features:
 * - Driver lookup via license/plate
 * - Violation type selection
 * - Fine amount calculation
 * - Penalty points assignment
 * - Evidence capture (photos)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  Platform,
  Dimensions,
  Modal,
  Image,
  Alert,
  PermissionsAndroid,
  Share,
} from 'react-native';
import { launchCamera, CameraOptions, ImagePickerResponse } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faChevronLeft,
  faSearch,
  faUser,
  faCar,
  faIdCard,
  faMapMarkerAlt,
  faCamera,
  faExclamationTriangle,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faPlus,
  faChevronRight,
  faFileAlt,
  faCarCrash,
  faTrafficLight,
  faLocationArrow,
  faTachometerAlt,
  faParking,
  faMobile,
  faWineBottle,
  faQrcode,
  faCoins,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp as fabWhatsapp } from '@fortawesome/free-brands-svg-icons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

// Types
interface ViolationType {
  id: string;
  name: string;
  code: string;
  baseFineDalasi: number;
  points: number;
  icon: any;
  color: string;
}

interface DriverInfo {
  name: string;
  licenseNumber: string;
  licenseType: string;
  expiryDate: string;
  address: string;
  phone: string;
  photo?: string;
}

interface VehicleInfo {
  plate: string;
  make: string;
  model: string;
  year: string;
  color: string;
  owner: string;
  registration: string;
  insurance: string;
}

const VIOLATION_TYPES: ViolationType[] = [
  {
    id: 'speeding',
    name: 'Speeding',
    code: 'SPD',
    baseFineDalasi: 2500,
    points: 3,
    icon: faTachometerAlt,
    color: '#EF4444',
  },
  {
    id: 'red_light',
    name: 'Running Red Light',
    code: 'RRL',
    baseFineDalasi: 3500,
    points: 4,
    icon: faTrafficLight,
    color: '#DC2626',
  },
  {
    id: 'no_license',
    name: 'No Valid License',
    code: 'NVL',
    baseFineDalasi: 5000,
    points: 6,
    icon: faIdCard,
    color: '#7C3AED',
  },
  {
    id: 'parking',
    name: 'Illegal Parking',
    code: 'IPK',
    baseFineDalasi: 1000,
    points: 0,
    icon: faParking,
    color: '#F59E0B',
  },
  {
    id: 'phone',
    name: 'Phone While Driving',
    code: 'PWD',
    baseFineDalasi: 2000,
    points: 3,
    icon: faMobile,
    color: '#3B82F6',
  },
  {
    id: 'dui',
    name: 'DUI/Intoxication',
    code: 'DUI',
    baseFineDalasi: 15000,
    points: 12,
    icon: faWineBottle,
    color: '#991B1B',
  },
  {
    id: 'no_insurance',
    name: 'No Insurance',
    code: 'NOI',
    baseFineDalasi: 4000,
    points: 2,
    icon: faFileAlt,
    color: '#059669',
  },
  {
    id: 'reckless',
    name: 'Reckless Driving',
    code: 'RKD',
    baseFineDalasi: 8000,
    points: 6,
    icon: faCarCrash,
    color: '#B91C1C',
  },
];

const TrafficTicketScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Get pre-filled data from vehicle search
  const prefilledDriver = route.params?.driverInfo;
  const prefilledVehicle = route.params?.vehicleInfo;

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'plate' | 'license'>('plate');
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(prefilledDriver || null);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(prefilledVehicle || null);
  const [selectedViolations, setSelectedViolations] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketIssued, setTicketIssued] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  
  // Payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'cash' | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isConfirmingCash, setIsConfirmingCash] = useState(false);
  const [ticketQRCode, setTicketQRCode] = useState('');

  const handleSearch = () => {
    // Mock search - in real app, call API
    if (searchQuery.trim()) {
      setDriverInfo({
        name: 'Lamin Ceesay',
        licenseNumber: 'GMB-DL-2019-12345',
        licenseType: 'Class B',
        expiryDate: '2025-06-15',
        address: '78 Independence Drive, Banjul',
        phone: '+220 7654321',
      });
      setVehicleInfo({
        plate: searchQuery.toUpperCase(),
        make: 'Toyota',
        model: 'Corolla',
        year: '2018',
        color: 'Silver',
        owner: 'Lamin Ceesay',
        registration: 'Valid until 2025',
        insurance: 'Active - GTUC',
      });
    }
  };

  const toggleViolation = (violationId: string) => {
    setSelectedViolations(prev =>
      prev.includes(violationId)
        ? prev.filter(id => id !== violationId)
        : [...prev, violationId]
    );
  };

  const calculateTotalFine = () => {
    return VIOLATION_TYPES
      .filter(v => selectedViolations.includes(v.id))
      .reduce((sum, v) => sum + v.baseFineDalasi, 0);
  };

  const calculateTotalPoints = () => {
    return VIOLATION_TYPES
      .filter(v => selectedViolations.includes(v.id))
      .reduce((sum, v) => sum + v.points, 0);
  };

  const handleIssueTicket = () => {
    setShowConfirmModal(true);
  };

  const confirmIssueTicket = () => {
    setIsSubmitting(true);
    // Simulate API call to create ticket
    setTimeout(() => {
      const ticketNum = `TKT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketNumber(ticketNum);
      setTicketQRCode(`GAMBIA-TICKET:${ticketNum}:${calculateTotalFine()}:${vehicleInfo?.plate || ''}`);
      setIsSubmitting(false);
      setShowConfirmModal(false);
      setShowPaymentModal(true); // Show payment options after ticket is created
    }, 1500);
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method: 'qr' | 'cash') => {
    setPaymentMethod(method);
    if (method === 'cash') {
      setIsConfirmingCash(true);
    }
  };

  // Confirm cash payment received
  const handleConfirmCashPayment = () => {
    setIsPaid(true);
    setIsConfirmingCash(false);
    Alert.alert('Payment Confirmed', 'Cash payment has been recorded successfully.');
  };

  // Simulate QR payment completion
  const handleQRPaymentComplete = () => {
    setIsPaid(true);
    Alert.alert('Payment Received', 'Mobile payment has been received successfully.');
  };

  // Issue ticket without payment (pay later)
  const handleIssueWithoutPayment = () => {
    setShowPaymentModal(false);
    setTicketIssued(true);
  };

  // Complete with payment
  const handleCompleteWithPayment = () => {
    setShowPaymentModal(false);
    setTicketIssued(true);
  };

  // Share ticket via WhatsApp
  const handleShareWhatsApp = async () => {
    const ticketInfo = `
🚔 TRAFFIC TICKET - GAMBIA POLICE FORCE
━━━━━━━━━━━━━━━━━━━━━━
📋 Ticket #: ${ticketNumber}
📅 Date: ${new Date().toLocaleDateString()}

👤 Driver: ${driverInfo?.name}
🚗 Vehicle: ${vehicleInfo?.plate}
   ${vehicleInfo?.make} ${vehicleInfo?.model} (${vehicleInfo?.color})

⚠️ Violations:
${selectedViolations.map(id => {
  const v = VIOLATION_TYPES.find(vt => vt.id === id);
  return `  • ${v?.name} - D${v?.baseFineDalasi}`;
}).join('\n')}

💰 Total Fine: D${calculateTotalFine()}
📊 Points: ${calculateTotalPoints()}
✅ Status: ${isPaid ? 'PAID' : 'UNPAID'}

📍 Location: ${location}
━━━━━━━━━━━━━━━━━━━━━━
Gambia Police Force
    `.trim();
    
    try {
      await Share.share({
        message: ticketInfo,
        title: `Traffic Ticket ${ticketNumber}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share ticket');
    }
  };

  // Share ticket via Email
  const handleShareEmail = async () => {
    const ticketInfo = `
TRAFFIC TICKET - GAMBIA POLICE FORCE
=====================================
Ticket #: ${ticketNumber}
Date: ${new Date().toLocaleDateString()}

DRIVER INFORMATION
------------------
Name: ${driverInfo?.name}
License: ${driverInfo?.licenseNumber}
Phone: ${driverInfo?.phone}

VEHICLE INFORMATION
-------------------
Plate: ${vehicleInfo?.plate}
Make/Model: ${vehicleInfo?.make} ${vehicleInfo?.model}
Color: ${vehicleInfo?.color}
Year: ${vehicleInfo?.year}

VIOLATIONS
----------
${selectedViolations.map(id => {
  const v = VIOLATION_TYPES.find(vt => vt.id === id);
  return `- ${v?.name}: D${v?.baseFineDalasi} (${v?.points} points)`;
}).join('\n')}

Total Fine: D${calculateTotalFine()}
Total Points: ${calculateTotalPoints()}
Payment Status: ${isPaid ? 'PAID' : 'UNPAID - Please pay within 14 days'}

Location: ${location}
Notes: ${notes}

=====================================
This ticket was issued by the Gambia Police Force.
For questions, please contact the Traffic Division.
    `.trim();
    
    try {
      await Share.share({
        message: ticketInfo,
        title: `Traffic Ticket ${ticketNumber}`,
        subject: `Traffic Ticket ${ticketNumber} - ${driverInfo?.name}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share ticket');
    }
  };

  const handleNewTicket = () => {
    setTicketIssued(false);
    setDriverInfo(null);
    setVehicleInfo(null);
    setSelectedViolations([]);
    setLocation('');
    setNotes('');
    setPhotos([]);
    setSearchQuery('');
    // Reset payment state
    setShowPaymentModal(false);
    setPaymentMethod(null);
    setIsPaid(false);
    setIsConfirmingCash(false);
    setTicketQRCode('');
  };

  // Request camera permission
  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs camera access to capture photo evidence.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Camera permission error:', err);
        return false;
      }
    }
    return true;
  };

  // Handle taking a photo with camera
  const handleAddPhoto = async () => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
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
            setPhotos(prev => [...prev, asset.uri!]);
            Alert.alert('Success', 'Photo evidence has been added.');
          }
        }
      });
    } catch (error) {
      console.error('handleAddPhoto error:', error);
      Alert.alert('Error', 'Failed to open camera. Please try again.');
    }
  };

  // Request location permission
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs location access to get the violation location.',
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
    }
    return true;
  };

  // Handle getting current location
  const handleGetLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you would reverse geocode this to get an address
          setLocation(`Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
          Alert.alert('Location Retrieved', 'Current location has been set.');
        },
        (error) => {
          console.error('Geolocation error:', error);
          Alert.alert('Location Error', 'Failed to get current location. Please enter manually.');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      console.error('handleGetLocation error:', error);
      Alert.alert('Error', 'Failed to get location. Please try again.');
    }
  };

  if (ticketIssued) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        {/* Success Screen */}
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <FontAwesomeIcon icon={faCheckCircle} size={64} color="#059669" />
          </View>
          <Text style={styles.successTitle}>Ticket Issued!</Text>
          <Text style={styles.successTicketNumber}>{ticketNumber}</Text>
          
          <View style={styles.successSummary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Violator</Text>
              <Text style={styles.summaryValue}>{driverInfo?.name}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Vehicle</Text>
              <Text style={styles.summaryValue}>{vehicleInfo?.plate}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Fine</Text>
              <Text style={[styles.summaryValue, styles.fineValue]}>
                D {calculateTotalFine().toLocaleString()}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Points</Text>
              <Text style={styles.summaryValue}>{calculateTotalPoints()} pts</Text>
            </View>
            <View style={[styles.summaryItem, { borderBottomWidth: 0 }]}>
              <Text style={styles.summaryLabel}>Payment Status</Text>
              <Text style={[styles.summaryValue, { color: isPaid ? '#059669' : '#DC2626' }]}>
                {isPaid ? 'PAID' : 'UNPAID'}
              </Text>
            </View>
          </View>

          {/* Share Options */}
          <Text style={styles.shareTitle}>Share Ticket</Text>
          <View style={styles.shareOptions}>
            <TouchableOpacity 
              style={[styles.shareBtn, styles.whatsappBtn]}
              onPress={handleShareWhatsApp}
            >
              <FontAwesomeIcon icon={fabWhatsapp} size={20} color="#FFFFFF" />
              <Text style={styles.shareBtnText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.shareBtn, styles.emailBtn]}
              onPress={handleShareEmail}
            >
              <FontAwesomeIcon icon={faEnvelope} size={20} color="#FFFFFF" />
              <Text style={styles.shareBtnText}>Email</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.newTicketBtn}
            onPress={handleNewTicket}
          >
            <LinearGradient
              colors={['#1E40AF', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.newTicketGradient}
            >
              <FontAwesomeIcon icon={faPlus} size={18} color="#FFFFFF" />
              <Text style={styles.newTicketBtnText}>Issue New Ticket</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesomeIcon icon={faChevronLeft} size={20} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Traffic Ticket</Text>
        <View style={styles.ticketBadge}>
          <FontAwesomeIcon icon={faFileAlt} size={14} color="#FFFFFF" />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        {!driverInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Driver / Vehicle Lookup</Text>
            
            {/* Search Type Toggle */}
            <View style={styles.searchTypeToggle}>
              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  searchType === 'plate' && styles.toggleBtnActive,
                ]}
                onPress={() => setSearchType('plate')}
              >
                <FontAwesomeIcon 
                  icon={faCar} 
                  size={14} 
                  color={searchType === 'plate' ? '#FFFFFF' : '#64748B'} 
                />
                <Text style={[
                  styles.toggleBtnText,
                  searchType === 'plate' && styles.toggleBtnTextActive,
                ]}>
                  License Plate
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  searchType === 'license' && styles.toggleBtnActive,
                ]}
                onPress={() => setSearchType('license')}
              >
                <FontAwesomeIcon 
                  icon={faIdCard} 
                  size={14} 
                  color={searchType === 'license' ? '#FFFFFF' : '#64748B'} 
                />
                <Text style={[
                  styles.toggleBtnText,
                  searchType === 'license' && styles.toggleBtnTextActive,
                ]}>
                  License No.
                </Text>
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <FontAwesomeIcon icon={faSearch} size={18} color="#64748B" />
              <TextInput
                style={styles.searchInput}
                placeholder={searchType === 'plate' ? 'Enter plate number...' : 'Enter license number...'}
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="characters"
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
                <Text style={styles.searchBtnText}>Search</Text>
              </TouchableOpacity>
            </View>

            {/* Or navigate to full search */}
            <TouchableOpacity
              style={styles.fullSearchLink}
              onPress={() => navigation.navigate('VehicleSearch')}
            >
              <Text style={styles.fullSearchLinkText}>Go to full vehicle search</Text>
              <FontAwesomeIcon icon={faChevronRight} size={14} color="#1E40AF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Driver Info Card */}
        {driverInfo && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Driver Information</Text>
              <TouchableOpacity onPress={() => setDriverInfo(null)}>
                <FontAwesomeIcon icon={faTimesCircle} size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.infoCard}>
              <View style={styles.driverHeader}>
                <View style={styles.driverAvatar}>
                  <FontAwesomeIcon icon={faUser} size={24} color="#1E40AF" />
                </View>
                <View style={styles.driverDetails}>
                  <Text style={styles.driverName}>{driverInfo.name}</Text>
                  <Text style={styles.driverLicense}>{driverInfo.licenseNumber}</Text>
                </View>
              </View>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>License Type</Text>
                  <Text style={styles.infoValue}>{driverInfo.licenseType}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Expires</Text>
                  <Text style={styles.infoValue}>{driverInfo.expiryDate}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{driverInfo.phone}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Vehicle Info Card */}
        {vehicleInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Information</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.vehicleHeader}>
                <View style={styles.plateContainer}>
                  <Text style={styles.plateText}>{vehicleInfo.plate}</Text>
                </View>
                <View style={styles.vehicleDetails}>
                  <Text style={styles.vehicleMakeModel}>
                    {vehicleInfo.make} {vehicleInfo.model}
                  </Text>
                  <Text style={styles.vehicleYear}>{vehicleInfo.year} • {vehicleInfo.color}</Text>
                </View>
              </View>
              <View style={styles.vehicleStatusRow}>
                <View style={[styles.statusBadge, styles.statusValid]}>
                  <Text style={styles.statusBadgeText}>Registration: Valid</Text>
                </View>
                <View style={[styles.statusBadge, styles.statusValid]}>
                  <Text style={styles.statusBadgeText}>Insurance: Active</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Violation Selection */}
        {driverInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Violations</Text>
            <Text style={styles.sectionSubtitle}>
              Tap to select one or more violations
            </Text>

            <View style={styles.violationsGrid}>
              {VIOLATION_TYPES.map((violation) => (
                <TouchableOpacity
                  key={violation.id}
                  style={[
                    styles.violationCard,
                    selectedViolations.includes(violation.id) && {
                      borderColor: violation.color,
                      backgroundColor: `${violation.color}10`,
                    },
                  ]}
                  onPress={() => toggleViolation(violation.id)}
                >
                  <View style={[styles.violationIcon, { backgroundColor: `${violation.color}20` }]}>
                    <FontAwesomeIcon icon={violation.icon} size={20} color={violation.color} />
                  </View>
                  <Text style={styles.violationName}>{violation.name}</Text>
                  <Text style={styles.violationCode}>{violation.code}</Text>
                  <View style={styles.violationFooter}>
                    <Text style={styles.violationFine}>D {violation.baseFineDalasi.toLocaleString()}</Text>
                    <Text style={styles.violationPoints}>{violation.points} pts</Text>
                  </View>
                  {selectedViolations.includes(violation.id) && (
                    <View style={styles.selectedBadge}>
                      <FontAwesomeIcon icon={faCheckCircle} size={18} color={violation.color} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Location & Notes */}
        {selectedViolations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location & Notes</Text>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Violation Location</Text>
              <View style={styles.inputWithIcon}>
                <FontAwesomeIcon icon={faMapMarkerAlt} size={16} color="#64748B" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter location of violation"
                  placeholderTextColor="#94A3B8"
                  value={location}
                  onChangeText={setLocation}
                />
                <TouchableOpacity
                  style={styles.locationBtn}
                  onPress={handleGetLocation}
                >
                  <FontAwesomeIcon icon={faLocationArrow} size={16} color="#1E40AF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Officer Notes (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Additional notes about the violation..."
                placeholderTextColor="#94A3B8"
                value={notes}
                onChangeText={setNotes}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Photo Evidence */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Photo Evidence</Text>
              <View style={styles.photoRow}>
                <TouchableOpacity style={styles.addPhotoBtn} onPress={handleAddPhoto}>
                  <FontAwesomeIcon icon={faCamera} size={24} color="#1E40AF" />
                  <Text style={styles.addPhotoText}>Add Photo</Text>
                </TouchableOpacity>
                {photos.map((photo, index) => (
                  <View key={index} style={styles.photoThumb}>
                    <Image source={{ uri: photo }} style={styles.photoImage} />
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Fine Summary */}
        {selectedViolations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.fineSummaryCard}>
              <Text style={styles.fineSummaryTitle}>Ticket Summary</Text>
              
              {VIOLATION_TYPES
                .filter(v => selectedViolations.includes(v.id))
                .map((violation) => (
                  <View key={violation.id} style={styles.fineRow}>
                    <Text style={styles.fineRowName}>{violation.name}</Text>
                    <Text style={styles.fineRowAmount}>
                      D {violation.baseFineDalasi.toLocaleString()}
                    </Text>
                  </View>
                ))}
              
              <View style={styles.fineDivider} />
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Fine</Text>
                <Text style={styles.totalAmount}>
                  D {calculateTotalFine().toLocaleString()}
                </Text>
              </View>
              
              <View style={styles.pointsRow}>
                <FontAwesomeIcon icon={faExclamationTriangle} size={16} color="#F59E0B" />
                <Text style={styles.pointsText}>
                  {calculateTotalPoints()} penalty points will be added
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Spacer for button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Issue Ticket Button */}
      {selectedViolations.length > 0 && location.trim() && (
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity
            style={styles.issueTicketBtn}
            onPress={handleIssueTicket}
          >
            <LinearGradient
              colors={['#DC2626', '#EF4444']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.issueTicketGradient}
            >
              <FontAwesomeIcon icon={faFileAlt} size={20} color="#FFFFFF" />
              <Text style={styles.issueTicketText}>
                Issue Ticket • D {calculateTotalFine().toLocaleString()}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <View style={styles.modalIcon}>
              <FontAwesomeIcon icon={faExclamationTriangle} size={32} color="#F59E0B" />
            </View>
            <Text style={styles.modalTitle}>Confirm Ticket</Text>
            <Text style={styles.modalText}>
              You are about to issue a traffic ticket for{' '}
              <Text style={styles.modalHighlight}>
                D {calculateTotalFine().toLocaleString()}
              </Text>{' '}
              to {driverInfo?.name}
            </Text>
            
            <View style={styles.modalViolations}>
              {VIOLATION_TYPES
                .filter(v => selectedViolations.includes(v.id))
                .map((v) => (
                  <Text key={v.id} style={styles.modalViolationItem}>
                    • {v.name}
                  </Text>
                ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={confirmIssueTicket}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Text style={styles.modalConfirmText}>Issuing...</Text>
                ) : (
                  <Text style={styles.modalConfirmText}>Issue Ticket</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Options Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent
        onRequestClose={() => {}}
      >
        <View style={styles.paymentModalOverlay}>
          <View style={styles.paymentModal}>
            {/* Header */}
            <View style={styles.paymentModalHeader}>
              <FontAwesomeIcon icon={faCheckCircle} size={40} color="#10B981" />
              <Text style={styles.paymentModalTitle}>Ticket Created</Text>
              <Text style={styles.paymentTicketNumber}>{ticketNumber}</Text>
            </View>

            {/* Ticket Summary */}
            <View style={styles.paymentSummaryBox}>
              <View style={styles.paymentSummaryRow}>
                <Text style={styles.paymentSummaryLabel}>Driver</Text>
                <Text style={styles.paymentSummaryValue}>{driverInfo?.name}</Text>
              </View>
              <View style={styles.paymentSummaryRow}>
                <Text style={styles.paymentSummaryLabel}>Vehicle</Text>
                <Text style={styles.paymentSummaryValue}>{vehicleInfo?.plate}</Text>
              </View>
              <View style={styles.paymentDivider} />
              <View style={styles.paymentSummaryRow}>
                <Text style={styles.paymentTotalLabel}>Total Fine</Text>
                <Text style={styles.paymentTotalValue}>D {calculateTotalFine().toLocaleString()}</Text>
              </View>
            </View>

            {/* Payment Options or Confirmation */}
            {!paymentMethod && !isPaid && (
              <View style={styles.paymentOptionsSection}>
                <Text style={styles.paymentOptionsTitle}>Select Payment Option</Text>
                
                <TouchableOpacity
                  style={styles.paymentOptionBtn}
                  onPress={() => handlePaymentMethodSelect('qr')}
                >
                  <View style={styles.paymentOptionIcon}>
                    <FontAwesomeIcon icon={faQrcode} size={24} color="#3B82F6" />
                  </View>
                  <View style={styles.paymentOptionTextContainer}>
                    <Text style={styles.paymentOptionTitle}>Mobile Payment</Text>
                    <Text style={styles.paymentOptionDesc}>Driver scans QR code to pay</Text>
                  </View>
                  <FontAwesomeIcon icon={faChevronLeft} size={16} color="#94A3B8" style={{ transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.paymentOptionBtn}
                  onPress={() => handlePaymentMethodSelect('cash')}
                >
                  <View style={[styles.paymentOptionIcon, { backgroundColor: '#F0FDF4' }]}>
                    <FontAwesomeIcon icon={faCoins} size={24} color="#10B981" />
                  </View>
                  <View style={styles.paymentOptionTextContainer}>
                    <Text style={styles.paymentOptionTitle}>Cash Payment</Text>
                    <Text style={styles.paymentOptionDesc}>Driver pays cash on spot</Text>
                  </View>
                  <FontAwesomeIcon icon={faChevronLeft} size={16} color="#94A3B8" style={{ transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.payLaterBtn}
                  onPress={handleIssueWithoutPayment}
                >
                  <FontAwesomeIcon icon={faClock} size={16} color="#64748B" />
                  <Text style={styles.payLaterText}>Issue Ticket - Pay Later</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* QR Code Payment */}
            {paymentMethod === 'qr' && !isPaid && (
              <View style={styles.qrPaymentSection}>
                <Text style={styles.qrTitle}>Scan to Pay</Text>
                <View style={styles.qrCodeContainer}>
                  {/* QR Code Placeholder - In real app use QR code library */}
                  <View style={styles.qrCodePlaceholder}>
                    <FontAwesomeIcon icon={faQrcode} size={120} color="#1F2937" />
                  </View>
                  <Text style={styles.qrAmount}>D {calculateTotalFine().toLocaleString()}</Text>
                </View>
                <Text style={styles.qrInstruction}>Have the driver scan this code with their banking app</Text>
                
                <View style={styles.qrButtons}>
                  <TouchableOpacity
                    style={styles.qrBackBtn}
                    onPress={() => setPaymentMethod(null)}
                  >
                    <Text style={styles.qrBackBtnText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.qrCompleteBtn}
                    onPress={handleQRPaymentComplete}
                  >
                    <Text style={styles.qrCompleteBtnText}>Payment Received</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Cash Payment Confirmation */}
            {paymentMethod === 'cash' && isConfirmingCash && !isPaid && (
              <View style={styles.cashPaymentSection}>
                <View style={styles.cashIconContainer}>
                  <FontAwesomeIcon icon={faCoins} size={48} color="#10B981" />
                </View>
                <Text style={styles.cashTitle}>Confirm Cash Payment</Text>
                <Text style={styles.cashAmount}>D {calculateTotalFine().toLocaleString()}</Text>
                <Text style={styles.cashInstruction}>
                  Confirm that you have received the cash payment from the driver
                </Text>
                
                <View style={styles.cashButtons}>
                  <TouchableOpacity
                    style={styles.cashBackBtn}
                    onPress={() => {
                      setIsConfirmingCash(false);
                      setPaymentMethod(null);
                    }}
                  >
                    <Text style={styles.cashBackBtnText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cashConfirmBtn}
                    onPress={handleConfirmCashPayment}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} size={18} color="#FFFFFF" />
                    <Text style={styles.cashConfirmBtnText}>Confirm Receipt</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Payment Success / Share Options */}
            {isPaid && (
              <View style={styles.paymentSuccessSection}>
                <View style={styles.successBadge}>
                  <FontAwesomeIcon icon={faCheckCircle} size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.successTitle}>Payment Received!</Text>
                <Text style={styles.successSubtitle}>
                  Fine of D {calculateTotalFine().toLocaleString()} has been paid
                </Text>

                <Text style={styles.shareTitle}>Share Ticket Receipt</Text>
                <View style={styles.shareOptions}>
                  <TouchableOpacity
                    style={[styles.shareBtn, styles.whatsappBtn]}
                    onPress={handleShareWhatsApp}
                  >
                    <FontAwesomeIcon icon={fabWhatsapp} size={24} color="#FFFFFF" />
                    <Text style={styles.shareBtnText}>WhatsApp</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.shareBtn, styles.emailBtn]}
                    onPress={handleShareEmail}
                  >
                    <FontAwesomeIcon icon={faEnvelope} size={24} color="#FFFFFF" />
                    <Text style={styles.shareBtnText}>Email</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.doneBtn}
                  onPress={handleCompleteWithPayment}
                >
                  <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
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
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  ticketBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    paddingBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: -8,
    marginBottom: 16,
  },
  searchTypeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#1E40AF',
  },
  toggleBtnText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  searchBtn: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  fullSearchLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
  },
  fullSearchLinkText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '500',
    marginRight: 4,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverDetails: {
    marginLeft: 12,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  driverLicense: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  plateContainer: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#374151',
  },
  plateText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
  },
  vehicleDetails: {
    marginLeft: 12,
  },
  vehicleMakeModel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  vehicleYear: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  vehicleStatusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusValid: {
    backgroundColor: '#D1FAE5',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  violationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  violationCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  violationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  violationName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  violationCode: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 10,
  },
  violationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  violationFine: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  violationPoints: {
    fontSize: 11,
    color: '#64748B',
  },
  selectedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  locationBtn: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  notesInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 80,
    fontSize: 14,
    color: '#1F2937',
  },
  photoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  addPhotoBtn: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    borderWidth: 2,
    borderColor: '#93C5FD',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: {
    fontSize: 10,
    color: '#1E40AF',
    marginTop: 4,
    fontWeight: '600',
  },
  photoThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  fineSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fineSummaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  fineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  fineRowName: {
    fontSize: 14,
    color: '#475569',
  },
  fineRowAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  fineDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#DC2626',
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  pointsText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#F59E0B',
    fontWeight: '500',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  issueTicketBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  issueTicketGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  issueTicketText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  confirmModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalHighlight: {
    fontWeight: '700',
    color: '#DC2626',
  },
  modalViolations: {
    alignSelf: 'stretch',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  modalViolationItem: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 8,
  },
  successTicketNumber: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 32,
  },
  successSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  fineValue: {
    color: '#DC2626',
    fontWeight: '700',
  },
  successActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBEAFE',
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionBtnText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
  newTicketBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 12,
  },
  newTicketGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  newTicketBtnText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  doneBtn: {
    paddingVertical: 14,
  },
  doneBtnText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  // Payment Modal Styles
  paymentModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  paymentModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 34,
  },
  paymentModalHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  paymentModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
  },
  paymentTicketNumber: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  paymentSummaryBox: {
    backgroundColor: '#F8FAFC',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  paymentSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentSummaryLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  paymentSummaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  paymentDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  paymentTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  paymentTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
  },
  paymentOptionsSection: {
    padding: 16,
  },
  paymentOptionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  paymentOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  paymentOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentOptionTextContainer: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  paymentOptionDesc: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  payLaterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  payLaterText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginLeft: 8,
  },
  // QR Payment Section
  qrPaymentSection: {
    padding: 16,
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  qrCodeContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  qrCodePlaceholder: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  qrAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#DC2626',
    marginTop: 16,
  },
  qrInstruction: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  qrButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  qrBackBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  qrBackBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  qrCompleteBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  qrCompleteBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Cash Payment Section
  cashPaymentSection: {
    padding: 24,
    alignItems: 'center',
  },
  cashIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cashTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  cashAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 12,
  },
  cashInstruction: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  cashButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cashBackBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cashBackBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  cashConfirmBtn: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cashConfirmBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Payment Success Section
  paymentSuccessSection: {
    padding: 24,
    alignItems: 'center',
  },
  successBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  shareOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  whatsappBtn: {
    backgroundColor: '#25D366',
  },
  emailBtn: {
    backgroundColor: '#3B82F6',
  },
  shareBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default TrafficTicketScreen;
