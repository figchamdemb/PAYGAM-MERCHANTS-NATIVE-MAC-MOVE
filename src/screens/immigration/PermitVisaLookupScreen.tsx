/**
 * ✅ IMMIGRATION - PERMIT/VISA LOOKUP SCREEN
 * Document verification and permit status check
 * Immigration Department Only
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faPassport,
  faBell,
  faSearch,
  faQrcode,
  faIdCard,
  faFileCircleCheck,
  faFileCircleXmark,
  faUser,
  faCalendarDays,
  faLocationDot,
  faFlag,
  faTriangleExclamation,
  faCircleCheck,
  faCircleXmark,
  faClock,
  faPlane,
  faBuilding,
  faBan,
  faTimesCircle,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const { width, height } = Dimensions.get('window');

// Types
interface DocumentResult {
  type: 'passport' | 'visa' | 'permit' | 'workpermit';
  documentNumber: string;
  holderName: string;
  nationality: string;
  dateOfBirth: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'revoked' | 'pending';
  visaType?: string;
  permitType?: string;
  entryPurpose?: string;
  employer?: string;
  alerts?: string[];
}

interface RecentSearch {
  id: string;
  documentNumber: string;
  holderName: string;
  type: string;
  status: string;
  time: string;
}

const RECENT_SEARCHES: RecentSearch[] = [
  {
    id: '1',
    documentNumber: 'A12345678',
    holderName: 'John Smith',
    type: 'Passport',
    status: 'valid',
    time: '10m ago',
  },
  {
    id: '2',
    documentNumber: 'VIS-2024-001234',
    holderName: 'Maria Garcia',
    type: 'Tourist Visa',
    status: 'expired',
    time: '25m ago',
  },
  {
    id: '3',
    documentNumber: 'WP-GM-2024-5678',
    holderName: 'Ahmed Hassan',
    type: 'Work Permit',
    status: 'valid',
    time: '1h ago',
  },
];

const PermitVisaLookupScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'passport' | 'visa' | 'permit'>('passport');
  const [showResultModal, setShowResultModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [searchResult, setSearchResult] = useState<DocumentResult | null>(null);

  // Mock search function
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a document number or name to search');
      return;
    }

    // Simulate search result
    const mockResult: DocumentResult = {
      type: searchType === 'passport' ? 'passport' : searchType === 'visa' ? 'visa' : 'workpermit',
      documentNumber: searchQuery.toUpperCase() || 'A12345678',
      holderName: 'John Michael Smith',
      nationality: 'United States',
      dateOfBirth: '1985-06-15',
      issueDate: '2022-03-10',
      expiryDate: '2032-03-09',
      status: Math.random() > 0.3 ? 'valid' : 'expired',
      visaType: searchType === 'visa' ? 'Tourist Visa' : undefined,
      permitType: searchType === 'permit' ? 'Work Permit - Skilled Worker' : undefined,
      entryPurpose: 'Business Meeting',
      employer: searchType === 'permit' ? 'ACME Corporation Ltd.' : undefined,
      alerts: Math.random() > 0.7 ? ['Previous overstay violation - 2021', 'Passport reported stolen - resolved'] : [],
    };

    setSearchResult(mockResult);
    setShowResultModal(true);
  };

  const handleFlagDocument = () => {
    setShowFlagModal(true);
  };

  const submitFlag = (reason: string) => {
    Alert.alert(
      'Document Flagged',
      `Document ${searchResult?.documentNumber} has been flagged for: ${reason}`,
      [{ text: 'OK', onPress: () => { setShowFlagModal(false); setShowResultModal(false); }}]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return '#22C55E';
      case 'expired':
        return '#EF4444';
      case 'revoked':
        return '#991B1B';
      case 'pending':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return faCircleCheck;
      case 'expired':
        return faClock;
      case 'revoked':
        return faBan;
      case 'pending':
        return faClock;
      default:
        return faCircleXmark;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <FontAwesomeIcon icon={faPassport} size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Document Lookup</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <FontAwesomeIcon icon={faBell} size={20} color="#FFFFFF" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <View style={styles.avatarSmall}>
              <Text style={styles.avatarText}>IO</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Card */}
        <View style={styles.searchCard}>
          {/* Search Type Tabs */}
          <View style={styles.searchTabs}>
            <TouchableOpacity
              style={[styles.searchTab, searchType === 'passport' && styles.searchTabActive]}
              onPress={() => setSearchType('passport')}
            >
              <FontAwesomeIcon 
                icon={faPassport} 
                size={14} 
                color={searchType === 'passport' ? '#1E40AF' : '#6B7280'} 
              />
              <Text style={[styles.searchTabText, searchType === 'passport' && styles.searchTabTextActive]}>
                Passport
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.searchTab, searchType === 'visa' && styles.searchTabActive]}
              onPress={() => setSearchType('visa')}
            >
              <FontAwesomeIcon 
                icon={faPlane} 
                size={14} 
                color={searchType === 'visa' ? '#1E40AF' : '#6B7280'} 
              />
              <Text style={[styles.searchTabText, searchType === 'visa' && styles.searchTabTextActive]}>
                Visa
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.searchTab, searchType === 'permit' && styles.searchTabActive]}
              onPress={() => setSearchType('permit')}
            >
              <FontAwesomeIcon 
                icon={faIdCard} 
                size={14} 
                color={searchType === 'permit' ? '#1E40AF' : '#6B7280'} 
              />
              <Text style={[styles.searchTabText, searchType === 'permit' && styles.searchTabTextActive]}>
                Work Permit
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.searchInputContainer}>
            <FontAwesomeIcon icon={faSearch} size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={`Enter ${searchType} number or name...`}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.qrButton}>
              <FontAwesomeIcon icon={faQrcode} size={20} color="#1E40AF" />
            </TouchableOpacity>
          </View>

          {/* Search Button */}
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <FontAwesomeIcon icon={faSearch} size={18} color="#FFFFFF" />
            <Text style={styles.searchButtonText}>Search Document</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Verification</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
                <FontAwesomeIcon icon={faFileCircleCheck} size={20} color="#1E40AF" />
              </View>
              <Text style={styles.actionText}>Valid Documents</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#FEF2F2' }]}>
                <FontAwesomeIcon icon={faFileCircleXmark} size={20} color="#DC2626" />
              </View>
              <Text style={styles.actionText}>Flagged Docs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
                <FontAwesomeIcon icon={faTriangleExclamation} size={20} color="#F59E0B" />
              </View>
              <Text style={styles.actionText}>Watchlist</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Searches */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <TouchableOpacity>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          {RECENT_SEARCHES.map((item) => (
            <TouchableOpacity key={item.id} style={styles.recentItem}>
              <View style={styles.recentLeft}>
                <View style={[
                  styles.recentIcon,
                  { backgroundColor: item.status === 'valid' ? '#D1FAE5' : '#FEE2E2' }
                ]}>
                  <FontAwesomeIcon
                    icon={item.status === 'valid' ? faCircleCheck : faCircleXmark}
                    size={16}
                    color={item.status === 'valid' ? '#059669' : '#DC2626'}
                  />
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentName}>{item.holderName}</Text>
                  <Text style={styles.recentDoc}>{item.documentNumber} • {item.type}</Text>
                </View>
              </View>
              <View style={styles.recentRight}>
                <Text style={styles.recentTime}>{item.time}</Text>
                <FontAwesomeIcon icon={faChevronRight} size={12} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Result Modal */}
      <Modal
        visible={showResultModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowResultModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Document Details</Text>
              <TouchableOpacity onPress={() => setShowResultModal(false)} style={styles.closeButton}>
                <FontAwesomeIcon icon={faTimesCircle} size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {searchResult && (
                <>
                  {/* Status Banner */}
                  <View style={[
                    styles.statusBanner,
                    { backgroundColor: `${getStatusColor(searchResult.status)}15` }
                  ]}>
                    <FontAwesomeIcon
                      icon={getStatusIcon(searchResult.status)}
                      size={24}
                      color={getStatusColor(searchResult.status)}
                    />
                    <View style={styles.statusInfo}>
                      <Text style={[styles.statusText, { color: getStatusColor(searchResult.status) }]}>
                        {searchResult.status.toUpperCase()}
                      </Text>
                      <Text style={styles.statusSubtext}>
                        {searchResult.type === 'passport' ? 'Passport' : 
                         searchResult.type === 'visa' ? searchResult.visaType : 
                         searchResult.permitType}
                      </Text>
                    </View>
                  </View>

                  {/* Alerts */}
                  {searchResult.alerts && searchResult.alerts.length > 0 && (
                    <View style={styles.alertsSection}>
                      <View style={styles.alertHeader}>
                        <FontAwesomeIcon icon={faTriangleExclamation} size={16} color="#F59E0B" />
                        <Text style={styles.alertTitle}>Alerts ({searchResult.alerts.length})</Text>
                      </View>
                      {searchResult.alerts.map((alert, index) => (
                        <Text key={index} style={styles.alertText}>• {alert}</Text>
                      ))}
                    </View>
                  )}

                  {/* Document Info */}
                  <View style={styles.infoSection}>
                    <Text style={styles.infoSectionTitle}>Document Information</Text>
                    
                    <View style={styles.infoRow}>
                      <FontAwesomeIcon icon={faIdCard} size={14} color="#6B7280" />
                      <Text style={styles.infoLabel}>Document No:</Text>
                      <Text style={styles.infoValue}>{searchResult.documentNumber}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <FontAwesomeIcon icon={faUser} size={14} color="#6B7280" />
                      <Text style={styles.infoLabel}>Holder Name:</Text>
                      <Text style={styles.infoValue}>{searchResult.holderName}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <FontAwesomeIcon icon={faFlag} size={14} color="#6B7280" />
                      <Text style={styles.infoLabel}>Nationality:</Text>
                      <Text style={styles.infoValue}>{searchResult.nationality}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <FontAwesomeIcon icon={faCalendarDays} size={14} color="#6B7280" />
                      <Text style={styles.infoLabel}>Date of Birth:</Text>
                      <Text style={styles.infoValue}>{searchResult.dateOfBirth}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <FontAwesomeIcon icon={faCalendarDays} size={14} color="#6B7280" />
                      <Text style={styles.infoLabel}>Issue Date:</Text>
                      <Text style={styles.infoValue}>{searchResult.issueDate}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <FontAwesomeIcon icon={faClock} size={14} color="#6B7280" />
                      <Text style={styles.infoLabel}>Expiry Date:</Text>
                      <Text style={[
                        styles.infoValue,
                        searchResult.status === 'expired' && { color: '#DC2626' }
                      ]}>
                        {searchResult.expiryDate}
                      </Text>
                    </View>

                    {searchResult.employer && (
                      <View style={styles.infoRow}>
                        <FontAwesomeIcon icon={faBuilding} size={14} color="#6B7280" />
                        <Text style={styles.infoLabel}>Employer:</Text>
                        <Text style={styles.infoValue}>{searchResult.employer}</Text>
                      </View>
                    )}

                    {searchResult.entryPurpose && (
                      <View style={styles.infoRow}>
                        <FontAwesomeIcon icon={faPlane} size={14} color="#6B7280" />
                        <Text style={styles.infoLabel}>Purpose:</Text>
                        <Text style={styles.infoValue}>{searchResult.entryPurpose}</Text>
                      </View>
                    )}
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.flagButton]}
                      onPress={handleFlagDocument}
                    >
                      <FontAwesomeIcon icon={faTriangleExclamation} size={16} color="#FFFFFF" />
                      <Text style={styles.flagButtonText}>Flag Document</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.verifyButton]}
                      onPress={() => {
                        Alert.alert('Verified', 'Document has been verified and entry cleared.');
                        setShowResultModal(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faCircleCheck} size={16} color="#FFFFFF" />
                      <Text style={styles.verifyButtonText}>Clear Entry</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Flag Modal */}
      <Modal
        visible={showFlagModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowFlagModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.flagModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Flag Document</Text>
              <TouchableOpacity onPress={() => setShowFlagModal(false)} style={styles.closeButton}>
                <FontAwesomeIcon icon={faTimesCircle} size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.flagDescription}>Select a reason for flagging this document:</Text>

            <View style={styles.flagOptions}>
              <TouchableOpacity style={styles.flagOption} onPress={() => submitFlag('Suspected Fraud')}>
                <FontAwesomeIcon icon={faFileCircleXmark} size={18} color="#DC2626" />
                <Text style={styles.flagOptionText}>Suspected Fraud</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.flagOption} onPress={() => submitFlag('Document Expired')}>
                <FontAwesomeIcon icon={faClock} size={18} color="#F59E0B" />
                <Text style={styles.flagOptionText}>Document Expired</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.flagOption} onPress={() => submitFlag('Overstay Violation')}>
                <FontAwesomeIcon icon={faTriangleExclamation} size={18} color="#EF4444" />
                <Text style={styles.flagOptionText}>Overstay Violation</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.flagOption} onPress={() => submitFlag('On Watchlist')}>
                <FontAwesomeIcon icon={faBan} size={18} color="#991B1B" />
                <Text style={styles.flagOptionText}>On Watchlist</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.flagOption} onPress={() => submitFlag('Other Violation')}>
                <FontAwesomeIcon icon={faFlag} size={18} color="#6B7280" />
                <Text style={styles.flagOptionText}>Other Violation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#1E40AF',
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 24,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
    gap: 16,
  },
  headerButton: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F59E0B',
    borderWidth: 2,
    borderColor: '#1E40AF',
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#BFDBFE',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  content: {
    flex: 1,
  },
  searchCard: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchTabs: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  searchTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  searchTabActive: {
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#1E40AF',
  },
  searchTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  searchTabTextActive: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  qrButton: {
    padding: 8,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  searchButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickActions: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4B5563',
    textAlign: 'center',
  },
  recentSection: {
    paddingHorizontal: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E40AF',
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentInfo: {},
  recentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  recentDoc: {
    fontSize: 12,
    color: '#6B7280',
  },
  recentRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recentTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  statusInfo: {},
  statusText: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusSubtext: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  alertsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B45309',
  },
  alertText: {
    fontSize: 13,
    color: '#92400E',
    marginLeft: 24,
    marginTop: 4,
  },
  infoSection: {
    marginHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    width: 100,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  flagButton: {
    backgroundColor: '#EF4444',
  },
  flagButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  verifyButton: {
    backgroundColor: '#22C55E',
  },
  verifyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  flagModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 30,
  },
  flagDescription: {
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  flagOptions: {
    paddingHorizontal: 16,
    gap: 8,
  },
  flagOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  flagOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
});

export default PermitVisaLookupScreen;
