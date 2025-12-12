import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme } from '../context/ThemeContext';
import {
  faArrowLeft,
  faHome,
  faFileAlt,
  faUser,
  faLock,
  faChevronRight,
  faCheckCircle,
  faClock,
  faShieldAlt,
  faEye,
  faEyeSlash,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Security PIN system for domestic violence protection
// FAKE PIN: Shows empty list (for abusers who force victims to show)
// REAL PIN: Shows actual cases (for authorities/safe viewing)

const CaseReportsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('open');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Security PIN states
  const [isHidden, setIsHidden] = useState(true); // Default: hidden for safety
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [pinSetupStep, setPinSetupStep] = useState(1); // 1=fake pin, 2=real pin
  const [fakePin, setFakePin] = useState('');
  const [realPin, setRealPin] = useState('');
  const [enteredPin, setEnteredPin] = useState('');
  const [storedFakePin, setStoredFakePin] = useState<string | null>(null);
  const [storedRealPin, setStoredRealPin] = useState<string | null>(null);
  const [showRealCases, setShowRealCases] = useState(false); // false = show empty, true = show real
  const [pinError, setPinError] = useState('');

  // Load stored PINs on mount
  useEffect(() => {
    loadStoredPins();
  }, []);

  const loadStoredPins = async () => {
    try {
      const savedFakePin = await AsyncStorage.getItem('caseReports_fakePin');
      const savedRealPin = await AsyncStorage.getItem('caseReports_realPin');
      setStoredFakePin(savedFakePin);
      setStoredRealPin(savedRealPin);
    } catch (error) {
      console.log('Error loading PINs:', error);
    }
  };

  const savePins = async (fake: string, real: string) => {
    try {
      await AsyncStorage.setItem('caseReports_fakePin', fake);
      await AsyncStorage.setItem('caseReports_realPin', real);
      setStoredFakePin(fake);
      setStoredRealPin(real);
    } catch (error) {
      console.log('Error saving PINs:', error);
    }
  };

  const handleToggleHideView = () => {
    if (!storedFakePin || !storedRealPin) {
      // First time - setup PINs
      setShowPinSetup(true);
      setPinSetupStep(1);
      setFakePin('');
      setRealPin('');
    } else {
      // PINs exist - show entry modal
      setShowPinEntry(true);
      setEnteredPin('');
      setPinError('');
    }
  };

  const handlePinSetupNext = () => {
    if (pinSetupStep === 1) {
      if (fakePin.length !== 6) {
        Alert.alert('Invalid PIN', 'Decoy PIN must be 6 digits');
        return;
      }
      setPinSetupStep(2);
    } else {
      if (realPin.length !== 6) {
        Alert.alert('Invalid PIN', 'Real PIN must be 6 digits');
        return;
      }
      if (fakePin === realPin) {
        Alert.alert('PINs Must Differ', 'Decoy PIN and Real PIN cannot be the same');
        return;
      }
      // Save PINs
      savePins(fakePin, realPin);
      setShowPinSetup(false);
      setIsHidden(true);
      Alert.alert(
        'Security PINs Set',
        'Your case reports are now protected.\n\n' +
        '• Decoy PIN: Shows empty list\n' +
        '• Real PIN: Shows actual cases\n\n' +
        'Use Decoy PIN if forced to show your phone.',
        [{ text: 'Understood' }]
      );
    }
  };

  const handlePinEntry = () => {
    if (enteredPin.length !== 6) {
      setPinError('Enter 6-digit PIN');
      return;
    }

    if (enteredPin === storedFakePin) {
      // FAKE PIN entered - show empty list (for abusers)
      setShowRealCases(false);
      setIsHidden(false);
      setShowPinEntry(false);
      setEnteredPin('');
    } else if (enteredPin === storedRealPin) {
      // REAL PIN entered - show actual cases (for authorities)
      setShowRealCases(true);
      setIsHidden(false);
      setShowPinEntry(false);
      setEnteredPin('');
    } else {
      setPinError('Incorrect PIN');
      setEnteredPin('');
    }
  };

  const handleHideAgain = () => {
    setIsHidden(true);
    setShowRealCases(false);
  };

  const cases = {
    open: [
      {
        id: 1,
        caseNo: '19020202',
        status: 'Open Case',
        statusColor: '#10B981',
        caseType: 'Family Issue',
        dateSent: '2023-10-23 09:09 AM',
        location: 'Banjul Station',
      },
      {
        id: 2,
        caseNo: '19020245',
        status: 'Open Case',
        statusColor: '#10B981',
        caseType: 'Theft',
        dateSent: '2023-10-22 02:15 PM',
        location: 'Serrekunda Market',
      },
      {
        id: 3,
        caseNo: '19020288',
        status: 'Pending Review',
        statusColor: '#F59E0B',
        caseType: 'Traffic Incident',
        dateSent: '2023-10-21 11:30 AM',
        location: 'Bakau Highway',
      },
    ],
    completed: [
      {
        id: 4,
        caseNo: '19020156',
        status: 'Completed',
        statusColor: '#10B981',
        caseType: 'Lost Property',
        dateSent: '2023-10-20 03:45 PM',
        location: 'Westfield Junction',
      },
    ],
    rejected: [
      {
        id: 5,
        caseNo: '19020089',
        status: 'Rejected',
        statusColor: '#EF4444',
        caseType: 'Noise Complaint',
        dateSent: '2023-10-19 08:20 AM',
        location: 'Latrikunda',
      },
    ],
  };

  const handleViewDetails = (caseItem: any) => {
    // Handle view details logic
    console.log('View details:', caseItem);
  };

  const handleReportNew = () => {
    navigation.navigate('ReportNewCase' as never);
  };

  const getStatusBadgeStyle = (status: string, color: string) => {
    return {
      backgroundColor: color + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    };
  };

  const getStatusTextStyle = (color: string) => {
    return {
      fontSize: 12,
      color: color,
      fontWeight: '600',
    };
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.headerBackground} />
      
      {/* Header */}
      <LinearGradient
        colors={['#B45309', '#92400e']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Cases</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <KeyboardAwareScrollView 
        style={[styles.content, { backgroundColor: theme.colors.background }]} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={Platform.OS === 'ios' ? 100 : 120}
        keyboardOpeningTime={0}
      >
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'open' && styles.tabActive
              ]}
              onPress={() => setActiveTab('open')}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'open' && styles.tabTextActive
              ]}>
                Open Cases
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'completed' && styles.tabActive
              ]}
              onPress={() => setActiveTab('completed')}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'completed' && styles.tabTextActive
              ]}>
                Completed
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'rejected' && styles.tabActive
              ]}
              onPress={() => setActiveTab('rejected')}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'rejected' && styles.tabTextActive
              ]}>
                Rejected
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Bar */}
        <View style={styles.actionBar}>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>{isHidden ? 'Show Cases' : 'Hide View'}</Text>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={isHidden ? handleToggleHideView : handleHideAgain}
            >
              <View style={[styles.toggleTrack, !isHidden && styles.toggleTrackActive]}>
                <View style={[styles.toggleThumb, !isHidden && styles.toggleThumbActive]} />
              </View>
            </TouchableOpacity>
          </View>
          {/* Report New button removed - use Services > Report Case instead */}
        </View>

        {/* Case List - Show based on PIN entered */}
        {isHidden ? (
          <View style={styles.hiddenContainer}>
            <View style={styles.hiddenIcon}>
              <FontAwesomeIcon icon={faShieldAlt} size={48} color="#B45309" />
            </View>
            <Text style={styles.hiddenTitle}>Cases Protected</Text>
            <Text style={styles.hiddenText}>
              Tap "Show Cases" and enter your PIN to view
            </Text>
            <View style={styles.securityNote}>
              <FontAwesomeIcon icon={faExclamationTriangle} size={14} color="#92400E" />
              <Text style={styles.securityNoteText}>
                If forced to show, use decoy PIN for safety
              </Text>
            </View>
          </View>
        ) : (
        <View style={styles.casesList}>
          {/* Show empty if fake PIN, show real cases if real PIN */}
          {showRealCases ? (
            cases[activeTab as keyof typeof cases].map((caseItem) => (
            <View key={caseItem.id} style={styles.caseCard}>
              <View style={styles.caseDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <View style={styles.detailValueContainer}>
                    <Text style={styles.detailSeparator}>:</Text>
                    <View style={getStatusBadgeStyle(caseItem.status, caseItem.statusColor)}>
                      <Text style={getStatusTextStyle(caseItem.statusColor)}>
                        {caseItem.status}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Case No</Text>
                  <View style={styles.detailValueContainer}>
                    <Text style={styles.detailSeparator}>:</Text>
                    <Text style={styles.detailValue}>{caseItem.caseNo}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Case Type</Text>
                  <View style={styles.detailValueContainer}>
                    <Text style={styles.detailSeparator}>:</Text>
                    <Text style={styles.detailValue}>{caseItem.caseType}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date Sent</Text>
                  <View style={styles.detailValueContainer}>
                    <Text style={styles.detailSeparator}>:</Text>
                    <Text style={styles.detailValue}>{caseItem.dateSent}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <View style={styles.detailValueContainer}>
                    <Text style={styles.detailSeparator}>:</Text>
                    <Text style={styles.detailValue}>{caseItem.location}</Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => handleViewDetails(caseItem)}
              >
                <Text style={styles.viewDetailsButtonText}>View Details</Text>
                <FontAwesomeIcon icon={faChevronRight} size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))
          ) : (
            // FAKE PIN entered - show empty list to fool abuser
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <FontAwesomeIcon icon={faFileAlt} size={40} color="#D1D5DB" />
              </View>
              <Text style={styles.emptyTitle}>No Cases Found</Text>
              <Text style={styles.emptyText}>
                You haven't submitted any reports yet
              </Text>
            </View>
          )}
        </View>
        )}
      </KeyboardAwareScrollView>

      {/* PIN Setup Modal */}
      <Modal
        visible={showPinSetup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPinSetup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIcon}>
                <FontAwesomeIcon icon={faShieldAlt} size={24} color="#B45309" />
              </View>
              <Text style={styles.modalTitle}>
                {pinSetupStep === 1 ? 'Set Decoy PIN' : 'Set Real PIN'}
              </Text>
              <Text style={styles.modalSubtitle}>
                {pinSetupStep === 1 
                  ? 'This PIN shows EMPTY list when forced to reveal'
                  : 'This PIN reveals your REAL cases (for authorities)'
                }
              </Text>
            </View>

            <View style={styles.pinSteps}>
              <View style={[styles.pinStep, pinSetupStep >= 1 && styles.pinStepActive]}>
                <Text style={styles.pinStepText}>1</Text>
              </View>
              <View style={styles.pinStepLine} />
              <View style={[styles.pinStep, pinSetupStep >= 2 && styles.pinStepActive]}>
                <Text style={styles.pinStepText}>2</Text>
              </View>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.pinLabel}>
                {pinSetupStep === 1 ? 'Decoy PIN (6 digits)' : 'Real PIN (6 digits)'}
              </Text>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                keyboardType="numeric"
                maxLength={6}
                value={pinSetupStep === 1 ? fakePin : realPin}
                onChangeText={pinSetupStep === 1 ? setFakePin : setRealPin}
                textAlign="center"
              />
              <Text style={styles.pinHint}>
                {pinSetupStep === 1 
                  ? 'Example: 123456 (shows nothing if forced)'
                  : 'Example: 000000 (reveals real cases)'
                }
              </Text>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => {
                  if (pinSetupStep === 2) {
                    setPinSetupStep(1);
                  } else {
                    setShowPinSetup(false);
                  }
                }}
              >
                <Text style={styles.modalButtonSecondaryText}>
                  {pinSetupStep === 1 ? 'Cancel' : 'Back'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButtonPrimary}
                onPress={handlePinSetupNext}
              >
                <Text style={styles.modalButtonPrimaryText}>
                  {pinSetupStep === 1 ? 'Next' : 'Finish Setup'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* PIN Entry Modal */}
      <Modal
        visible={showPinEntry}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPinEntry(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIcon}>
                <FontAwesomeIcon icon={faLock} size={24} color="#B45309" />
              </View>
              <Text style={styles.modalTitle}>Enter PIN</Text>
              <Text style={styles.modalSubtitle}>Enter your security PIN to view cases</Text>
            </View>

            <View style={styles.modalBody}>
              <TextInput
                style={[styles.passwordInput, pinError ? styles.passwordInputError : null]}
                placeholder="••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                keyboardType="numeric"
                maxLength={6}
                value={enteredPin}
                onChangeText={(text) => {
                  setEnteredPin(text);
                  setPinError('');
                }}
                textAlign="center"
              />
              {pinError ? (
                <Text style={styles.pinErrorText}>{pinError}</Text>
              ) : null}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => {
                  setShowPinEntry(false);
                  setEnteredPin('');
                  setPinError('');
                }}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButtonPrimary}
                onPress={handlePinEntry}
              >
                <Text style={styles.modalButtonPrimaryText}>Unlock</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconContainer}>
            <FontAwesomeIcon icon={faHome} size={20} color="#B45309" />
          </View>
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconContainerActive}>
            <FontAwesomeIcon icon={faFileAlt} size={20} color="#B45309" />
          </View>
          <Text style={styles.navTextActive}>Reports</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconContainer}>
            <FontAwesomeIcon icon={faUser} size={20} color="#9CA3AF" />
          </View>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    backgroundColor: '#B45309',
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
  content: {
    flex: 1,
    padding: 20,
  },
  tabsContainer: {
    marginBottom: 20,
  },
  tabs: {
    backgroundColor: '#E5E7EB',
    padding: 4,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#B45309',
    fontWeight: '600',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  toggleButton: {
    padding: 4,
  },
  toggleTrack: {
    width: 44,
    height: 24,
    backgroundColor: '#D1D5DB',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  toggleTrackActive: {
    backgroundColor: '#10B981',
  },
  toggleThumb: {
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  reportButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  casesList: {
    spaceY: 16,
  },
  caseCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  caseDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValueContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailSeparator: {
    fontSize: 14,
    color: '#9CA3AF',
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    backgroundColor: '#B45309',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  viewDetailsButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  bottomNav: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navIconContainerActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  navTextActive: {
    fontSize: 10,
    color: '#B45309',
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxWidth: 320,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '700',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalBody: {
    marginBottom: 24,
  },
  passwordInput: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    fontSize: 18,
    color: '#111827',
    letterSpacing: 4,
  },
  passwordInputError: {
    borderColor: '#EF4444',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonSecondary: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonSecondaryText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  modalButtonPrimary: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#B45309',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonPrimaryText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  // Hidden state container
  hiddenContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  hiddenIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  hiddenTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  hiddenText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  securityNoteText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  // Empty state (for fake PIN)
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  // PIN setup modal styles
  pinSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pinStep: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinStepActive: {
    backgroundColor: '#B45309',
  },
  pinStepText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pinStepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  pinLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  pinHint: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  pinErrorText: {
    fontSize: 12,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default CaseReportsScreen;
