/**
 * ✅ SEARCH CASES SCREEN - SENTINEL PATROL
 * 
 * Officers can search and view citizen cases
 * Features:
 * - Search by phone number or case ID
 * - View case details, citizen info, witnesses
 * - Update case status
 * - Contact witnesses
 * - Refer to court or close case
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
  Image,
  Dimensions,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faShieldHalved,
  faBell,
  faMagnifyingGlass,
  faPhone,
  faMessage,
  faGavel,
  faBan,
  faFloppyDisk,
  faChevronDown,
  faChevronLeft,
  faCircle,
  faImage,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

// Theme colors
const THEME = {
  primary: '#1E40AF',
  primaryLight: '#3B82F6',
  primaryDark: '#1E3A8A',
  background: '#F8FAFC',
  white: '#FFFFFF',
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  yellow100: '#FEF3C7',
  yellow500: '#F59E0B',
  yellow600: '#D97706',
  yellow700: '#B45309',
  green100: '#D1FAE5',
  green500: '#10B981',
  green600: '#059669',
  red100: '#FEE2E2',
  red200: '#FECACA',
  red500: '#EF4444',
  red600: '#DC2626',
  purple100: '#EDE9FE',
  purple600: '#9333EA',
  orange100: '#FFEDD5',
  orange600: '#EA580C',
  blue50: '#EFF6FF',
  blue200: '#BFDBFE',
  blue500: '#3B82F6',
};

// Types
interface Witness {
  id: string;
  name: string;
  initials: string;
  role: string;
  phone: string;
  color: string;
  bgColor: string;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  officer: string;
  action: string;
  statusColor?: string;
  isLatest: boolean;
}

interface CaseData {
  id: string;
  caseNumber: string;
  title: string;
  status: string;
  statusColor: string;
  timeAgo: string;
  citizen: {
    name: string;
    id: string;
    phone: string;
    avatar: string;
  };
  description: string;
  images: string[];
  witnesses: Witness[];
  activityLog: ActivityLog[];
}

// Mock data
const MOCK_CASE: CaseData = {
  id: '1',
  caseNumber: '#CASE-2023-892',
  title: 'Public Disturbance & Theft',
  status: 'In Progress',
  statusColor: THEME.yellow600,
  timeAgo: '2 hrs ago',
  citizen: {
    name: 'Michael T. Harrison',
    id: '8492-1029-CA',
    phone: '+220 3456789',
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  description: 'Subject was reported causing a disturbance at the Metro Central Station. Witnesses allege subject attempted to remove a bag from a vendor stall. Security intervened prior to officer arrival.',
  images: [
    'https://images.unsplash.com/photo-1555881400-74d7acaacd81?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=200',
  ],
  witnesses: [
    {
      id: '1',
      name: 'Sarah Jenkins',
      initials: 'SJ',
      role: 'Vendor Owner',
      phone: '+220 7891234',
      color: THEME.purple600,
      bgColor: THEME.purple100,
    },
    {
      id: '2',
      name: 'David Kim',
      initials: 'DK',
      role: 'Bystander',
      phone: '+220 9876543',
      color: THEME.orange600,
      bgColor: THEME.orange100,
    },
  ],
  activityLog: [
    {
      id: '1',
      timestamp: 'Today, 10:42 AM',
      officer: 'Sgt. D. Reynolds',
      action: 'changed status to',
      statusColor: THEME.yellow600,
      isLatest: true,
    },
    {
      id: '2',
      timestamp: 'Today, 09:15 AM',
      officer: 'Officer K. Lewis',
      action: 'created the case.',
      isLatest: false,
    },
  ],
};

const STATUS_OPTIONS = [
  'In Progress',
  'Pending Review',
  'Closed - Resolved',
  'Closed - Unresolved',
];

const SearchCasesScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  // State
  const [searchMode, setSearchMode] = useState<'phone' | 'caseId'>('phone');
  const [searchQuery, setSearchQuery] = useState('(555) 928-1042');
  const [searchResult, setSearchResult] = useState<CaseData | null>(MOCK_CASE);
  const [selectedStatus, setSelectedStatus] = useState('In Progress');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const handleSearch = () => {
    // Mock search - in real app, call API
    if (searchQuery.trim()) {
      setSearchResult(MOCK_CASE);
    } else {
      setSearchResult(null);
    }
  };

  const handleCallCitizen = () => {
    if (searchResult?.citizen.phone) {
      Linking.openURL(`tel:${searchResult.citizen.phone}`);
    }
  };

  const handleContactWitness = (witness: Witness) => {
    Alert.alert(
      `Contact ${witness.name}`,
      `Role: ${witness.role}\nPhone: ${witness.phone}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${witness.phone}`) },
        { text: 'Message', onPress: () => Alert.alert('Opening messaging...') },
      ]
    );
  };

  const handleReferToCourt = () => {
    Alert.alert(
      'Refer to Court',
      'Are you sure you want to refer this case to court?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => Alert.alert('Success', 'Case has been referred to court.') },
      ]
    );
  };

  const handleCloseCase = () => {
    Alert.alert(
      'Close Case',
      'Are you sure you want to close this case?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Close', style: 'destructive', onPress: () => Alert.alert('Success', 'Case has been closed.') },
      ]
    );
  };

  const handleSaveChanges = () => {
    Alert.alert('Success', 'Changes have been saved successfully.');
  };

  const renderHeader = () => (
    <LinearGradient
      colors={[THEME.primary, THEME.primaryLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      {/* Top Bar */}
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesomeIcon icon={faChevronLeft} size={18} color={THEME.white} />
          </TouchableOpacity>
          <View style={styles.headerIcon}>
            <FontAwesomeIcon icon={faShieldHalved} size={18} color={THEME.white} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Search Cases</Text>
            <Text style={styles.headerSubtitle}>Officer: Sgt. D. Reynolds</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <FontAwesomeIcon icon={faBell} size={20} color={THEME.white} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Search Toggle */}
      <View style={styles.searchToggle}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            searchMode === 'phone' && styles.toggleButtonActive,
          ]}
          onPress={() => setSearchMode('phone')}
        >
          <Text style={[
            styles.toggleButtonText,
            searchMode === 'phone' && styles.toggleButtonTextActive,
          ]}>
            By Phone
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            searchMode === 'caseId' && styles.toggleButtonActive,
          ]}
          onPress={() => setSearchMode('caseId')}
        >
          <Text style={[
            styles.toggleButtonText,
            searchMode === 'caseId' && styles.toggleButtonTextActive,
          ]}>
            By Case ID
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <FontAwesomeIcon icon={faMagnifyingGlass} size={18} color={THEME.gray400} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={searchMode === 'phone' ? 'Enter citizen phone number...' : 'Enter case ID...'}
          placeholderTextColor={THEME.gray400}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          keyboardType={searchMode === 'phone' ? 'phone-pad' : 'default'}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const renderCaseResult = () => {
    if (!searchResult) return null;

    return (
      <View style={styles.resultCard}>
        {/* Case Header */}
        <View style={styles.caseHeader}>
          <View>
            <View style={styles.caseNumberBadge}>
              <Text style={styles.caseNumberText}>{searchResult.caseNumber}</Text>
            </View>
            <Text style={styles.caseTitle}>{searchResult.title}</Text>
          </View>
          <View style={styles.caseStatusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: THEME.yellow100 }]}>
              <View style={[styles.statusDot, { backgroundColor: THEME.yellow500 }]} />
              <Text style={[styles.statusText, { color: THEME.yellow700 }]}>
                {searchResult.status}
              </Text>
            </View>
            <Text style={styles.timeAgo}>{searchResult.timeAgo}</Text>
          </View>
        </View>

        {/* Citizen Profile */}
        <View style={styles.citizenSection}>
          <Text style={styles.sectionLabel}>CITIZEN INVOLVED</Text>
          <View style={styles.citizenCard}>
            <Image
              source={{ uri: searchResult.citizen.avatar }}
              style={styles.citizenAvatar}
            />
            <View style={styles.citizenInfo}>
              <Text style={styles.citizenName}>{searchResult.citizen.name}</Text>
              <Text style={styles.citizenId}>ID: {searchResult.citizen.id}</Text>
            </View>
            <TouchableOpacity style={styles.callButton} onPress={handleCallCitizen}>
              <FontAwesomeIcon icon={faPhone} size={16} color={THEME.green600} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Case Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionLabel}>INCIDENT DETAILS</Text>
          <Text style={styles.descriptionText}>{searchResult.description}</Text>
          
          {/* Evidence Images */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
            {searchResult.images.map((img, index) => (
              <TouchableOpacity key={index} style={styles.evidenceImage}>
                <Image source={{ uri: img }} style={styles.evidenceImageInner} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addImageButton}>
              <FontAwesomeIcon icon={faImage} size={20} color={THEME.gray400} />
              <Text style={styles.addImageText}>Add</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Witnesses */}
        <View style={styles.witnessesSection}>
          <Text style={styles.sectionLabel}>WITNESSES</Text>
          {searchResult.witnesses.map((witness) => (
            <TouchableOpacity
              key={witness.id}
              style={styles.witnessCard}
              onPress={() => handleContactWitness(witness)}
            >
              <View style={styles.witnessLeft}>
                <View style={[styles.witnessAvatar, { backgroundColor: witness.bgColor }]}>
                  <Text style={[styles.witnessInitials, { color: witness.color }]}>
                    {witness.initials}
                  </Text>
                </View>
                <View>
                  <Text style={styles.witnessName}>{witness.name}</Text>
                  <Text style={styles.witnessRole}>{witness.role}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.messageButton}
                onPress={() => handleContactWitness(witness)}
              >
                <FontAwesomeIcon icon={faMessage} size={18} color={THEME.gray400} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Activity Log */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionLabel}>ACTIVITY LOG</Text>
          <View style={styles.timeline}>
            {searchResult.activityLog.map((log, index) => (
              <View key={log.id} style={styles.timelineItem}>
                <View style={[
                  styles.timelineDot,
                  log.isLatest ? styles.timelineDotActive : styles.timelineDotInactive,
                ]} />
                {index < searchResult.activityLog.length - 1 && (
                  <View style={styles.timelineLine} />
                )}
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTimestamp}>{log.timestamp}</Text>
                  <Text style={styles.timelineAction}>
                    <Text style={styles.timelineOfficer}>{log.officer}</Text>
                    {' '}{log.action}
                    {log.statusColor && (
                      <Text style={[styles.timelineStatus, { color: log.statusColor }]}>
                        {' '}In Progress
                      </Text>
                    )}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionLabel}>OFFICER ACTIONS</Text>
          
          {/* Status Dropdown */}
          <View style={styles.statusDropdownContainer}>
            <Text style={styles.dropdownLabel}>Update Status</Text>
            <TouchableOpacity
              style={styles.statusDropdown}
              onPress={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <Text style={styles.statusDropdownText}>{selectedStatus}</Text>
              <FontAwesomeIcon icon={faChevronDown} size={12} color={THEME.gray700} />
            </TouchableOpacity>
            
            {showStatusDropdown && (
              <View style={styles.dropdownMenu}>
                {STATUS_OPTIONS.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.dropdownItem,
                      selectedStatus === status && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setSelectedStatus(status);
                      setShowStatusDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      selectedStatus === status && styles.dropdownItemTextActive,
                    ]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.actionButtonOutline} onPress={handleReferToCourt}>
              <FontAwesomeIcon icon={faGavel} size={16} color={THEME.gray700} />
              <Text style={styles.actionButtonOutlineText}>Refer to Court</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtonDanger} onPress={handleCloseCase}>
              <FontAwesomeIcon icon={faBan} size={16} color={THEME.red600} />
              <Text style={styles.actionButtonDangerText}>Close Case</Text>
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <LinearGradient
              colors={[THEME.primary, THEME.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButtonGradient}
            >
              <FontAwesomeIcon icon={faFloppyDisk} size={18} color={THEME.white} />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderNoResults = () => (
    <View style={styles.noResultsContainer}>
      <View style={styles.noResultsIcon}>
        <FontAwesomeIcon icon={faMagnifyingGlass} size={40} color={THEME.gray300} />
      </View>
      <Text style={styles.noResultsTitle}>No Cases Found</Text>
      <Text style={styles.noResultsText}>
        Try searching with a different phone number or case ID
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
      
      {renderHeader()}
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {searchResult ? renderCaseResult() : renderNoResults()}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.white,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: THEME.blue200,
    fontWeight: '500',
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.red500,
    borderWidth: 2,
    borderColor: THEME.primary,
  },
  searchToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30,58,138,0.5)',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: THEME.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: THEME.blue200,
  },
  toggleButtonTextActive: {
    color: THEME.primary,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.white,
    borderRadius: 12,
    paddingLeft: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: THEME.gray800,
    fontWeight: '500',
  },
  searchButton: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
    marginRight: 4,
    marginVertical: 4,
  },
  searchButtonText: {
    color: THEME.white,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    marginTop: -16,
  },
  contentContainer: {
    padding: 16,
  },
  resultCard: {
    backgroundColor: THEME.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: THEME.gray100,
  },
  caseHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: THEME.gray100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  caseNumberBadge: {
    backgroundColor: THEME.blue50,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  caseNumberText: {
    color: THEME.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  caseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.gray900,
    marginTop: 8,
    maxWidth: width * 0.5,
  },
  caseStatusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  timeAgo: {
    fontSize: 11,
    color: THEME.gray400,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.gray400,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  citizenSection: {
    padding: 20,
    backgroundColor: 'rgba(248,250,252,0.5)',
  },
  citizenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  citizenAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: THEME.white,
    backgroundColor: THEME.gray200,
  },
  citizenInfo: {
    flex: 1,
  },
  citizenName: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.gray900,
  },
  citizenId: {
    fontSize: 13,
    color: THEME.gray500,
    marginTop: 2,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.green100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailsSection: {
    padding: 20,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: THEME.gray600,
  },
  imagesScroll: {
    marginTop: 16,
    marginHorizontal: -4,
  },
  evidenceImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 4,
    backgroundColor: THEME.gray200,
  },
  evidenceImageInner: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: THEME.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: THEME.gray200,
    borderStyle: 'dashed',
  },
  addImageText: {
    fontSize: 11,
    color: THEME.gray400,
    marginTop: 4,
    fontWeight: '500',
  },
  witnessesSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: THEME.gray100,
  },
  witnessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.white,
    borderWidth: 1,
    borderColor: THEME.gray100,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  witnessLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  witnessAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  witnessInitials: {
    fontSize: 12,
    fontWeight: '700',
  },
  witnessName: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.gray800,
  },
  witnessRole: {
    fontSize: 12,
    color: THEME.gray500,
  },
  messageButton: {
    padding: 8,
  },
  activitySection: {
    padding: 20,
    backgroundColor: THEME.gray50,
    borderTopWidth: 1,
    borderTopColor: THEME.gray100,
  },
  timeline: {
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: THEME.gray200,
  },
  timelineItem: {
    position: 'relative',
    paddingBottom: 24,
  },
  timelineDot: {
    position: 'absolute',
    left: -22,
    top: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: THEME.white,
  },
  timelineDotActive: {
    backgroundColor: THEME.blue500,
  },
  timelineDotInactive: {
    backgroundColor: THEME.gray300,
  },
  timelineLine: {
    position: 'absolute',
    left: -17,
    top: 16,
    bottom: 0,
    width: 2,
    backgroundColor: THEME.gray200,
  },
  timelineContent: {
    paddingLeft: 8,
  },
  timelineTimestamp: {
    fontSize: 11,
    color: THEME.gray500,
    marginBottom: 4,
  },
  timelineAction: {
    fontSize: 13,
    color: THEME.gray800,
    lineHeight: 20,
  },
  timelineOfficer: {
    fontWeight: '600',
    color: THEME.primary,
  },
  timelineStatus: {
    fontWeight: '500',
  },
  actionsSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: THEME.gray200,
    backgroundColor: THEME.white,
  },
  statusDropdownContainer: {
    marginBottom: 16,
    position: 'relative',
    zIndex: 10,
  },
  dropdownLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.gray700,
    marginBottom: 6,
  },
  statusDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.gray50,
    borderWidth: 1,
    borderColor: THEME.gray300,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  statusDropdownText: {
    fontSize: 14,
    color: THEME.gray800,
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: THEME.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.gray200,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 100,
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.gray100,
  },
  dropdownItemActive: {
    backgroundColor: THEME.blue50,
  },
  dropdownItemText: {
    fontSize: 14,
    color: THEME.gray700,
  },
  dropdownItemTextActive: {
    color: THEME.primary,
    fontWeight: '600',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButtonOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: THEME.white,
    borderWidth: 1,
    borderColor: THEME.gray300,
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButtonOutlineText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.gray700,
  },
  actionButtonDanger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: THEME.white,
    borderWidth: 1,
    borderColor: THEME.red200,
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButtonDangerText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.red600,
  },
  saveButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 4,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  saveButtonText: {
    color: THEME.white,
    fontSize: 15,
    fontWeight: '700',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  noResultsIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: THEME.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.gray800,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: THEME.gray500,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 32,
  },
});

export default SearchCasesScreen;
