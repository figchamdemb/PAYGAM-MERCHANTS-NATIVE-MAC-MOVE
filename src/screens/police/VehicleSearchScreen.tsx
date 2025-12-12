/**
 * ✅ VEHICLE SEARCH SCREEN - SENTINEL PATROL
 * 
 * Comprehensive vehicle/driver lookup before issuing tickets
 * Features:
 * - Multi-mode search (Plate/License/VIN)
 * - Vehicle status display
 * - Driver history and points
 * - Quick actions grid
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
  Animated,
  Modal,
  Alert,
  Image,
  PermissionsAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, CameraOptions, ImagePickerResponse } from 'react-native-image-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faChevronLeft,
  faSearch,
  faCar,
  faIdCard,
  faBarcode,
  faUser,
  faPhone,
  faMapMarkerAlt,
  faCheckCircle,
  faExclamationTriangle,
  faTimesCircle,
  faFileAlt,
  faHistory,
  faShieldAlt,
  faCamera,
  faBan,
  faChevronRight,
  faCarCrash,
  faMoneyBill,
  faClock,
  faCalendarAlt,
  faInfoCircle,
  faFlag,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

// Types
interface VehicleResult {
  plate: string;
  make: string;
  model: string;
  year: string;
  color: string;
  vin: string;
  registration: {
    status: 'valid' | 'expired' | 'suspended';
    expiryDate: string;
  };
  insurance: {
    status: 'active' | 'expired' | 'none';
    provider: string;
    expiryDate: string;
  };
  owner: {
    name: string;
    address: string;
    phone: string;
  };
  flags: string[];
}

interface DriverResult {
  name: string;
  nationalId: string;
  licenseNumber: string;
  licenseType: string;
  licenseStatus: 'valid' | 'expired' | 'suspended' | 'revoked';
  expiryDate: string;
  dateOfBirth: string;
  address: string;
  phone: string;
  penaltyPoints: number;
  maxPoints: number;
  violations: {
    id: string;
    date: string;
    type: string;
    fine: number;
    status: 'paid' | 'unpaid' | 'pending';
  }[];
}

const VehicleSearchScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  // State
  const [searchMode, setSearchMode] = useState<'plate' | 'license' | 'vin'>('plate');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [vehicleResult, setVehicleResult] = useState<VehicleResult | null>(null);
  const [driverResult, setDriverResult] = useState<DriverResult | null>(null);
  const [activeTab, setActiveTab] = useState<'vehicle' | 'driver'>('vehicle');
  
  // Flag Vehicle Modal State
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [flagDescription, setFlagDescription] = useState('');
  const [flagPhoto, setFlagPhoto] = useState<string | null>(null);
  const [isSubmittingFlag, setIsSubmittingFlag] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // Mock API call
    setTimeout(() => {
      setVehicleResult({
        plate: searchQuery.toUpperCase(),
        make: 'Toyota',
        model: 'Hilux',
        year: '2020',
        color: 'White',
        vin: 'JTFBT4CVXA0123456',
        registration: {
          status: 'valid',
          expiryDate: '2025-08-15',
        },
        insurance: {
          status: 'active',
          provider: 'GTUC Insurance',
          expiryDate: '2025-06-30',
        },
        owner: {
          name: 'Modou Jobe',
          address: '123 Kairaba Avenue, Serrekunda',
          phone: '+220 7123456',
        },
        flags: [],
      });

      setDriverResult({
        name: 'Modou Jobe',
        nationalId: 'GMB-12345678',
        licenseNumber: 'DL-2018-98765',
        licenseType: 'Class B (Light Vehicle)',
        licenseStatus: 'valid',
        expiryDate: '2026-03-20',
        dateOfBirth: '1985-07-15',
        address: '123 Kairaba Avenue, Serrekunda',
        phone: '+220 7123456',
        penaltyPoints: 4,
        maxPoints: 12,
        violations: [
          {
            id: '1',
            date: '2024-01-15',
            type: 'Speeding',
            fine: 2500,
            status: 'paid',
          },
          {
            id: '2',
            date: '2023-09-22',
            type: 'Parking Violation',
            fine: 1000,
            status: 'paid',
          },
        ],
      });

      setIsSearching(false);
    }, 1500);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setVehicleResult(null);
    setDriverResult(null);
  };

  const handleIssueTicket = () => {
    navigation.navigate('TrafficTicket', {
      driverInfo: driverResult ? {
        name: driverResult.name,
        licenseNumber: driverResult.licenseNumber,
        licenseType: driverResult.licenseType,
        expiryDate: driverResult.expiryDate,
        address: driverResult.address,
        phone: driverResult.phone,
      } : null,
      vehicleInfo: vehicleResult ? {
        plate: vehicleResult.plate,
        make: vehicleResult.make,
        model: vehicleResult.model,
        year: vehicleResult.year,
        color: vehicleResult.color,
        owner: vehicleResult.owner.name,
        registration: vehicleResult.registration.status,
        insurance: vehicleResult.insurance.status,
      } : null,
    });
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

  // Handle Flag Vehicle
  const handleFlagVehicle = () => {
    if (!vehicleResult) return;
    setShowFlagModal(true);
    setFlagReason('');
    setFlagDescription('');
    setFlagPhoto(null);
  };

  // Handle taking photo for flag
  const handleAddFlagPhoto = async () => {
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
          return;
        }
        if (response.errorCode) {
          Alert.alert('Camera Error', response.errorMessage || 'Failed to capture photo.');
          return;
        }
        if (response.assets && response.assets[0]?.uri) {
          setFlagPhoto(response.assets[0].uri);
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to open camera. Please try again.');
    }
  };

  // Submit flag
  const handleSubmitFlag = () => {
    if (!flagReason.trim()) {
      Alert.alert('Required', 'Please select or enter a reason for flagging.');
      return;
    }

    setIsSubmittingFlag(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmittingFlag(false);
      setShowFlagModal(false);
      Alert.alert(
        'Vehicle Flagged',
        `Vehicle ${vehicleResult?.plate} has been flagged successfully. All patrol units will be notified.`,
        [{ text: 'OK' }]
      );
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
      case 'active':
      case 'paid':
        return '#059669';
      case 'expired':
      case 'unpaid':
        return '#F59E0B';
      case 'suspended':
      case 'revoked':
      case 'none':
        return '#DC2626';
      default:
        return '#64748B';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'valid':
      case 'active':
      case 'paid':
        return '#D1FAE5';
      case 'expired':
      case 'unpaid':
        return '#FEF3C7';
      case 'suspended':
      case 'revoked':
      case 'none':
        return '#FEE2E2';
      default:
        return '#F1F5F9';
    }
  };

  const renderSearchModes = () => (
    <View style={styles.searchModes}>
      {[
        { id: 'plate', label: 'Plate', icon: faCar },
        { id: 'license', label: 'License', icon: faIdCard },
        { id: 'vin', label: 'VIN', icon: faBarcode },
      ].map((mode) => (
        <TouchableOpacity
          key={mode.id}
          style={[
            styles.searchModeBtn,
            searchMode === mode.id && styles.searchModeBtnActive,
          ]}
          onPress={() => setSearchMode(mode.id as any)}
        >
          <FontAwesomeIcon
            icon={mode.icon}
            size={16}
            color={searchMode === mode.id ? '#FFFFFF' : '#64748B'}
          />
          <Text style={[
            styles.searchModeText,
            searchMode === mode.id && styles.searchModeTextActive,
          ]}>
            {mode.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderVehicleTab = () => (
    <View style={styles.tabContent}>
      {/* Vehicle Card */}
      <View style={styles.vehicleCard}>
        <View style={styles.plateDisplayLarge}>
          <Text style={styles.plateTextLarge}>{vehicleResult?.plate}</Text>
        </View>
        <Text style={styles.vehicleName}>
          {vehicleResult?.year} {vehicleResult?.make} {vehicleResult?.model}
        </Text>
        <Text style={styles.vehicleColor}>{vehicleResult?.color}</Text>
        <Text style={styles.vehicleVin}>VIN: {vehicleResult?.vin}</Text>
      </View>

      {/* Status Cards */}
      <View style={styles.statusGrid}>
        <View style={styles.statusCard}>
          <View style={[
            styles.statusIcon,
            { backgroundColor: getStatusBgColor(vehicleResult?.registration.status || '') },
          ]}>
            <FontAwesomeIcon
              icon={vehicleResult?.registration.status === 'valid' ? faCheckCircle : faTimesCircle}
              size={20}
              color={getStatusColor(vehicleResult?.registration.status || '')}
            />
          </View>
          <Text style={styles.statusLabel}>Registration</Text>
          <Text style={[
            styles.statusValue,
            { color: getStatusColor(vehicleResult?.registration.status || '') },
          ]}>
            {vehicleResult?.registration.status.toUpperCase()}
          </Text>
          <Text style={styles.statusExpiry}>
            Exp: {vehicleResult?.registration.expiryDate}
          </Text>
        </View>

        <View style={styles.statusCard}>
          <View style={[
            styles.statusIcon,
            { backgroundColor: getStatusBgColor(vehicleResult?.insurance.status || '') },
          ]}>
            <FontAwesomeIcon
              icon={vehicleResult?.insurance.status === 'active' ? faShieldAlt : faExclamationTriangle}
              size={20}
              color={getStatusColor(vehicleResult?.insurance.status || '')}
            />
          </View>
          <Text style={styles.statusLabel}>Insurance</Text>
          <Text style={[
            styles.statusValue,
            { color: getStatusColor(vehicleResult?.insurance.status || '') },
          ]}>
            {vehicleResult?.insurance.status.toUpperCase()}
          </Text>
          <Text style={styles.statusExpiry}>
            {vehicleResult?.insurance.provider}
          </Text>
        </View>
      </View>

      {/* Owner Info */}
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>Registered Owner</Text>
        <View style={styles.ownerCard}>
          <View style={styles.ownerAvatar}>
            <FontAwesomeIcon icon={faUser} size={20} color="#1E40AF" />
          </View>
          <View style={styles.ownerDetails}>
            <Text style={styles.ownerName}>{vehicleResult?.owner.name}</Text>
            <View style={styles.ownerInfoRow}>
              <FontAwesomeIcon icon={faPhone} size={12} color="#64748B" />
              <Text style={styles.ownerInfoText}>{vehicleResult?.owner.phone}</Text>
            </View>
            <View style={styles.ownerInfoRow}>
              <FontAwesomeIcon icon={faMapMarkerAlt} size={12} color="#64748B" />
              <Text style={styles.ownerInfoText}>{vehicleResult?.owner.address}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Flags */}
      {vehicleResult?.flags && vehicleResult.flags.length > 0 && (
        <View style={styles.flagsSection}>
          <Text style={styles.infoSectionTitle}>⚠️ Alerts & Flags</Text>
          {vehicleResult.flags.map((flag, index) => (
            <View key={index} style={styles.flagItem}>
              <FontAwesomeIcon icon={faExclamationTriangle} size={14} color="#DC2626" />
              <Text style={styles.flagText}>{flag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderDriverTab = () => (
    <View style={styles.tabContent}>
      {/* Driver Card */}
      <View style={styles.driverCard}>
        <View style={styles.driverAvatarLarge}>
          <FontAwesomeIcon icon={faUser} size={32} color="#1E40AF" />
        </View>
        <Text style={styles.driverNameLarge}>{driverResult?.name}</Text>
        <Text style={styles.driverLicenseNum}>{driverResult?.licenseNumber}</Text>
        <View style={[
          styles.licenseStatusBadge,
          { backgroundColor: getStatusBgColor(driverResult?.licenseStatus || '') },
        ]}>
          <Text style={[
            styles.licenseStatusText,
            { color: getStatusColor(driverResult?.licenseStatus || '') },
          ]}>
            License {driverResult?.licenseStatus.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Points Meter */}
      <View style={styles.pointsSection}>
        <Text style={styles.infoSectionTitle}>Penalty Points</Text>
        <View style={styles.pointsCard}>
          <View style={styles.pointsMeter}>
            <View style={styles.pointsTrack}>
              <View
                style={[
                  styles.pointsFill,
                  {
                    width: `${((driverResult?.penaltyPoints || 0) / (driverResult?.maxPoints || 12)) * 100}%`,
                    backgroundColor: (driverResult?.penaltyPoints || 0) > 8 ? '#DC2626' : '#F59E0B',
                  },
                ]}
              />
            </View>
            <View style={styles.pointsLabels}>
              <Text style={styles.pointsCurrent}>{driverResult?.penaltyPoints} pts</Text>
              <Text style={styles.pointsMax}>Max: {driverResult?.maxPoints}</Text>
            </View>
          </View>
          {(driverResult?.penaltyPoints || 0) > 6 && (
            <View style={styles.pointsWarning}>
              <FontAwesomeIcon icon={faExclamationTriangle} size={14} color="#F59E0B" />
              <Text style={styles.pointsWarningText}>
                Close to suspension threshold
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* License Details */}
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>License Details</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <FontAwesomeIcon icon={faIdCard} size={14} color="#64748B" />
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>{driverResult?.licenseType}</Text>
          </View>
          <View style={styles.detailItem}>
            <FontAwesomeIcon icon={faCalendarAlt} size={14} color="#64748B" />
            <Text style={styles.detailLabel}>Expires</Text>
            <Text style={styles.detailValue}>{driverResult?.expiryDate}</Text>
          </View>
          <View style={styles.detailItem}>
            <FontAwesomeIcon icon={faClock} size={14} color="#64748B" />
            <Text style={styles.detailLabel}>DOB</Text>
            <Text style={styles.detailValue}>{driverResult?.dateOfBirth}</Text>
          </View>
          <View style={styles.detailItem}>
            <FontAwesomeIcon icon={faPhone} size={14} color="#64748B" />
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{driverResult?.phone}</Text>
          </View>
        </View>
      </View>

      {/* Violation History */}
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>Recent Violations</Text>
        {driverResult?.violations.map((violation) => (
          <View key={violation.id} style={styles.violationItem}>
            <View style={styles.violationLeft}>
              <FontAwesomeIcon icon={faCarCrash} size={16} color="#DC2626" />
            </View>
            <View style={styles.violationMiddle}>
              <Text style={styles.violationType}>{violation.type}</Text>
              <Text style={styles.violationDate}>{violation.date}</Text>
            </View>
            <View style={styles.violationRight}>
              <Text style={styles.violationFine}>D {violation.fine.toLocaleString()}</Text>
              <View style={[
                styles.violationStatusBadge,
                { backgroundColor: getStatusBgColor(violation.status) },
              ]}>
                <Text style={[
                  styles.violationStatusText,
                  { color: getStatusColor(violation.status) },
                ]}>
                  {violation.status.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Vehicle Search</Text>
        <TouchableOpacity style={styles.scanButton}>
          <FontAwesomeIcon icon={faCamera} size={20} color="#1E40AF" />
        </TouchableOpacity>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        {renderSearchModes()}
        
        <View style={styles.searchInputContainer}>
          <FontAwesomeIcon icon={faSearch} size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder={
              searchMode === 'plate'
                ? 'Enter license plate...'
                : searchMode === 'license'
                ? 'Enter driver license...'
                : 'Enter VIN number...'
            }
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="characters"
            onSubmitEditing={handleSearch}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={handleClearSearch}>
              <FontAwesomeIcon icon={faTimesCircle} size={18} color="#94A3B8" />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.searchButton, !searchQuery.trim() && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={!searchQuery.trim() || isSearching}
        >
          <LinearGradient
            colors={searchQuery.trim() ? ['#1E40AF', '#3B82F6'] : ['#94A3B8', '#94A3B8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.searchButtonGradient}
          >
            <FontAwesomeIcon icon={faSearch} size={18} color="#FFFFFF" />
            <Text style={styles.searchButtonText}>
              {isSearching ? 'Searching...' : 'Search Database'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {vehicleResult && driverResult && (
        <>
          {/* Tab Switcher */}
          <View style={styles.tabSwitcher}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'vehicle' && styles.tabActive]}
              onPress={() => setActiveTab('vehicle')}
            >
              <FontAwesomeIcon
                icon={faCar}
                size={16}
                color={activeTab === 'vehicle' ? '#1E40AF' : '#64748B'}
              />
              <Text style={[
                styles.tabText,
                activeTab === 'vehicle' && styles.tabTextActive,
              ]}>
                Vehicle
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'driver' && styles.tabActive]}
              onPress={() => setActiveTab('driver')}
            >
              <FontAwesomeIcon
                icon={faUser}
                size={16}
                color={activeTab === 'driver' ? '#1E40AF' : '#64748B'}
              />
              <Text style={[
                styles.tabText,
                activeTab === 'driver' && styles.tabTextActive,
              ]}>
                Driver
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
            {activeTab === 'vehicle' ? renderVehicleTab() : renderDriverTab()}
            
            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <Text style={styles.quickActionsTitle}>Quick Actions</Text>
              <View style={styles.actionsGrid}>
                <TouchableOpacity style={styles.actionCard} onPress={handleIssueTicket}>
                  <View style={[styles.actionIcon, { backgroundColor: '#FEE2E2' }]}>
                    <FontAwesomeIcon icon={faFileAlt} size={20} color="#DC2626" />
                  </View>
                  <Text style={styles.actionLabel}>Issue Ticket</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard} onPress={handleFlagVehicle}>
                  <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
                    <FontAwesomeIcon icon={faBan} size={20} color="#F59E0B" />
                  </View>
                  <Text style={styles.actionLabel}>Flag Vehicle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard}>
                  <View style={[styles.actionIcon, { backgroundColor: '#DBEAFE' }]}>
                    <FontAwesomeIcon icon={faHistory} size={20} color="#1E40AF" />
                  </View>
                  <Text style={styles.actionLabel}>Full History</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard}>
                  <View style={[styles.actionIcon, { backgroundColor: '#D1FAE5' }]}>
                    <FontAwesomeIcon icon={faInfoCircle} size={20} color="#059669" />
                  </View>
                  <Text style={styles.actionLabel}>More Info</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>
        </>
      )}

      {/* Empty State */}
      {!vehicleResult && !isSearching && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <FontAwesomeIcon icon={faCar} size={48} color="#CBD5E1" />
          </View>
          <Text style={styles.emptyTitle}>Search for a Vehicle</Text>
          <Text style={styles.emptyText}>
            Enter a license plate, driver's license, or VIN to lookup vehicle and driver information.
          </Text>
        </View>
      )}

      {/* Flag Vehicle Modal */}
      <Modal
        visible={showFlagModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFlagModal(false)}
      >
        <View style={styles.flagModalOverlay}>
          <View style={styles.flagModal}>
            {/* Header */}
            <View style={styles.flagModalHeader}>
              <Text style={styles.flagModalTitle}>Flag Vehicle</Text>
              <TouchableOpacity
                style={styles.flagCloseBtn}
                onPress={() => setShowFlagModal(false)}
              >
                <FontAwesomeIcon icon={faTimes} size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Vehicle Info */}
              <View style={styles.flagVehicleInfo}>
                <View style={styles.flagPlateBox}>
                  <Text style={styles.flagPlateText}>{vehicleResult?.plate}</Text>
                </View>
                <Text style={styles.flagVehicleName}>
                  {vehicleResult?.make} {vehicleResult?.model} • {vehicleResult?.color}
                </Text>
              </View>

              {/* Flag Reason Selection */}
              <View style={styles.flagSection}>
                <Text style={styles.flagSectionTitle}>Reason for Flagging</Text>
                {['Stolen Vehicle', 'Wanted by Police', 'Suspicious Activity', 'Traffic Offense', 'Other'].map((reason) => (
                  <TouchableOpacity
                    key={reason}
                    style={[
                      styles.flagReasonOption,
                      flagReason === reason && styles.flagReasonSelected,
                    ]}
                    onPress={() => setFlagReason(reason)}
                  >
                    <View style={[
                      styles.flagRadio,
                      flagReason === reason && styles.flagRadioSelected,
                    ]}>
                      {flagReason === reason && <View style={styles.flagRadioInner} />}
                    </View>
                    <Text style={[
                      styles.flagReasonText,
                      flagReason === reason && styles.flagReasonTextSelected,
                    ]}>{reason}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Description */}
              <View style={styles.flagSection}>
                <Text style={styles.flagSectionTitle}>Description</Text>
                <TextInput
                  style={styles.flagDescriptionInput}
                  placeholder="Describe why you are flagging this vehicle..."
                  placeholderTextColor="#94A3B8"
                  value={flagDescription}
                  onChangeText={setFlagDescription}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              {/* Photo Evidence */}
              <View style={styles.flagSection}>
                <Text style={styles.flagSectionTitle}>Photo Evidence</Text>
                {flagPhoto ? (
                  <View style={styles.flagPhotoContainer}>
                    <Image source={{ uri: flagPhoto }} style={styles.flagPhotoPreview} />
                    <TouchableOpacity
                      style={styles.flagRemovePhoto}
                      onPress={() => setFlagPhoto(null)}
                    >
                      <FontAwesomeIcon icon={faTimes} size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.flagAddPhotoBtn} onPress={handleAddFlagPhoto}>
                    <FontAwesomeIcon icon={faCamera} size={24} color="#1E40AF" />
                    <Text style={styles.flagAddPhotoText}>Take Photo</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.flagSubmitBtn,
                !flagReason && styles.flagSubmitBtnDisabled,
              ]}
              onPress={handleSubmitFlag}
              disabled={!flagReason || isSubmittingFlag}
            >
              <FontAwesomeIcon icon={faFlag} size={18} color="#FFFFFF" />
              <Text style={styles.flagSubmitText}>
                {isSubmittingFlag ? 'Submitting...' : 'Flag Vehicle'}
              </Text>
            </TouchableOpacity>
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
  scanButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchModes: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  searchModeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchModeBtnActive: {
    backgroundColor: '#1E40AF',
  },
  searchModeText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  searchModeTextActive: {
    color: '#FFFFFF',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  searchButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  searchButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  tabActive: {
    backgroundColor: '#DBEAFE',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#1E40AF',
  },
  resultsContainer: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  plateDisplayLarge: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#374151',
    marginBottom: 16,
  },
  plateTextLarge: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 3,
  },
  vehicleName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  vehicleColor: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  vehicleVin: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  statusGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusExpiry: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  ownerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ownerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerDetails: {
    flex: 1,
    marginLeft: 12,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  ownerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ownerInfoText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#64748B',
  },
  flagsSection: {
    marginBottom: 16,
  },
  flagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  flagText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '500',
  },
  driverCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  driverAvatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  driverNameLarge: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  driverLicenseNum: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  licenseStatusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  licenseStatusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  pointsSection: {
    marginBottom: 16,
  },
  pointsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pointsMeter: {
    marginBottom: 8,
  },
  pointsTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  pointsFill: {
    height: '100%',
    borderRadius: 4,
  },
  pointsLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  pointsCurrent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  pointsMax: {
    fontSize: 12,
    color: '#64748B',
  },
  pointsWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  pointsWarningText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailItem: {
    width: '50%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  violationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  violationLeft: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  violationMiddle: {
    flex: 1,
    marginLeft: 12,
  },
  violationType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  violationDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  violationRight: {
    alignItems: 'flex-end',
  },
  violationFine: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  violationStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 4,
  },
  violationStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  quickActions: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 44) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Flag Modal Styles
  flagModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  flagModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  flagModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  flagModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  flagCloseBtn: {
    padding: 8,
  },
  flagVehicleInfo: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  flagPlateBox: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  flagPlateText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  flagVehicleName: {
    fontSize: 14,
    color: '#64748B',
  },
  flagSection: {
    marginBottom: 20,
  },
  flagSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  flagReasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  flagReasonSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#1E40AF',
  },
  flagRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  flagRadioSelected: {
    borderColor: '#1E40AF',
  },
  flagRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1E40AF',
  },
  flagReasonText: {
    fontSize: 14,
    color: '#374151',
  },
  flagReasonTextSelected: {
    fontWeight: '600',
    color: '#1E40AF',
  },
  flagDescriptionInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    fontSize: 14,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  flagPhotoContainer: {
    position: 'relative',
  },
  flagPhotoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  flagRemovePhoto: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    padding: 8,
  },
  flagAddPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#1E40AF',
    gap: 10,
  },
  flagAddPhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
  flagSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  flagSubmitBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  flagSubmitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default VehicleSearchScreen;
