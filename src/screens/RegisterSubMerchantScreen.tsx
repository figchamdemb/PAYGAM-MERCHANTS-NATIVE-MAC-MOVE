/**
 * PAYGAM MERCHANT - SUB-MERCHANT MANAGEMENT SCREEN
 * Create/Register new sub-merchants and manage existing ones
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const ArrowLeftIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const StoreIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
  </Svg>
);

const ChevronRightIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EnvelopeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </Svg>
);

const PhoneIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </Svg>
);

const CogIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#4B5563' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </Svg>
);

const BoxOpenIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18-.21 0-.41-.06-.57-.18l-7.9-4.44A.991.991 0 013 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18.21 0 .41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9zM12 4.15L6.04 7.5 12 10.85l5.96-3.35L12 4.15zM5 15.91l6 3.38v-6.71L5 9.21v6.7zm14 0v-6.7l-6 3.37v6.71l6-3.38z" />
  </Svg>
);

const InvoiceIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zm-4 5h6v2H8v-2zm6-4H8v2h6v-2z" />
  </Svg>
);

const BankIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#A855F7' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M4 10h3v7H4zm6.5 0h3v7h-3zM2 19h20v3H2zm15-9h3v7h-3zm-5-9L2 6v2h20V6z" />
  </Svg>
);

const InfoCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </Svg>
);

const UserPlusIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </Svg>
);

const UsersIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </Svg>
);

const EyeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </Svg>
);

const BanIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z" />
  </Svg>
);

const TrashIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </Svg>
);

const CheckCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </Svg>
);

const CloseIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SearchIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={2} />
    <Path d="M21 21l-4.3-4.3" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const UnbanIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </Svg>
);

// ==================== TYPES ====================
interface Permission {
  id: string;
  icon: React.ReactNode;
  iconBgColor: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface SubMerchant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  branch: string;
  branchId: string;
  status: 'active' | 'banned' | 'pending';
  dateAdded: string;
  permissions: string[];
  avatar?: string;
}

// ==================== TOGGLE SWITCH COMPONENT ====================
interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ value, onValueChange }) => {
  const translateX = useRef(new Animated.Value(value ? 20 : 2)).current;

  React.useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 20 : 2,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  }, [value]);

  return (
    <TouchableOpacity
      style={[
        styles.toggleSwitch,
        value && styles.toggleSwitchActive,
      ]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.toggleThumb,
          { transform: [{ translateX }] },
        ]}
      />
    </TouchableOpacity>
  );
};

// ==================== MAIN COMPONENT ====================
const RegisterSubMerchantScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const buttonScale = useRef(new Animated.Value(1)).current;
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubMerchant, setSelectedSubMerchant] = useState<SubMerchant | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // Mock sub-merchants data
  const [subMerchants, setSubMerchants] = useState<SubMerchant[]>([
    {
      id: 'SM001',
      firstName: 'Fatou',
      lastName: 'Jallow',
      email: 'fatou.jallow@nexuscoffee.com',
      phone: '+220 777-1234',
      branch: 'Nexus Coffee - Westfield',
      branchId: '883-920-WF',
      status: 'active',
      dateAdded: '2024-11-15',
      permissions: ['Create Services', 'Manage Settings'],
    },
    {
      id: 'SM002',
      firstName: 'Lamin',
      lastName: 'Ceesay',
      email: 'lamin.ceesay@nexuscoffee.com',
      phone: '+220 777-5678',
      branch: 'Nexus Coffee - HQ',
      branchId: '883-920-HQ',
      status: 'active',
      dateAdded: '2024-10-20',
      permissions: ['Create Services', 'Create Settlement'],
    },
    {
      id: 'SM003',
      firstName: 'Mariama',
      lastName: 'Touray',
      email: 'mariama.touray@nexuscoffee.com',
      phone: '+220 777-9012',
      branch: 'Nexus Coffee - Senegambia',
      branchId: '883-920-SG',
      status: 'banned',
      dateAdded: '2024-09-10',
      permissions: ['Create Services'],
    },
    {
      id: 'SM004',
      firstName: 'Ousman',
      lastName: 'Sanneh',
      email: 'ousman.sanneh@nexuscoffee.com',
      phone: '+220 777-3456',
      branch: 'Nexus Coffee - Banjul',
      branchId: '883-920-BJ',
      status: 'pending',
      dateAdded: '2024-12-01',
      permissions: ['Create Services'],
    },
  ]);
  const [tempPassword, setTempPassword] = useState('Nexus@2024');
  
  // Permissions state
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: 'settings',
      icon: <CogIcon size={18} color="#4B5563" />,
      iconBgColor: '#F3F4F6',
      title: 'Manage Settings',
      description: 'Edit shop profile & config',
      enabled: false,
    },
    {
      id: 'services',
      icon: <BoxOpenIcon size={18} color="#3B82F6" />,
      iconBgColor: '#EFF6FF',
      title: 'Create Services',
      description: 'Add new products/services',
      enabled: true,
    },
    {
      id: 'settlement',
      icon: <InvoiceIcon size={18} color="#22C55E" />,
      iconBgColor: '#F0FDF4',
      title: 'Create Settlement',
      description: 'Request payouts & withdrawals',
      enabled: false,
    },
    {
      id: 'banking',
      icon: <BankIcon size={18} color="#A855F7" />,
      iconBgColor: '#FAF5FF',
      title: 'Manage Banking',
      description: 'Add/Edit bank accounts',
      enabled: false,
    },
  ]);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const togglePermission = (id: string) => {
    setPermissions(prev =>
      prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p)
    );
  };

  const regeneratePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTempPassword(password);
  };

  const handleCreateSubMerchant = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      Alert.alert('Required Fields', 'Please fill in all required fields');
      return;
    }

    // Navigate to success or handle creation
    navigation.navigate('ActionSuccess', {
      title: 'Sub-Merchant Created!',
      message: `${firstName} ${lastName} has been added successfully. They will receive login credentials via email.`,
      actionLabel: 'Back to Dashboard',
      navigateTo: 'CorporateMerchantDashboard',
    });
  };

  const handleChangeShop = () => {
    // Navigate to shop selection screen
    Alert.alert('Select Shop', 'This would open shop selection');
  };

  const handleViewDetails = (merchant: SubMerchant) => {
    setSelectedSubMerchant(merchant);
    setDetailModalVisible(true);
  };

  const handleBanMerchant = (merchant: SubMerchant) => {
    const action = merchant.status === 'banned' ? 'unban' : 'ban';
    Alert.alert(
      `${action === 'ban' ? 'Ban' : 'Unban'} Sub-Merchant`,
      `Are you sure you want to ${action} ${merchant.firstName} ${merchant.lastName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'ban' ? 'Ban' : 'Unban',
          style: action === 'ban' ? 'destructive' : 'default',
          onPress: () => {
            setSubMerchants(prev =>
              prev.map(sm =>
                sm.id === merchant.id
                  ? { ...sm, status: action === 'ban' ? 'banned' : 'active' }
                  : sm
              )
            );
            setDetailModalVisible(false);
            Alert.alert('Success', `${merchant.firstName} ${merchant.lastName} has been ${action === 'ban' ? 'banned' : 'unbanned'}.`);
          },
        },
      ]
    );
  };

  const handleRemoveMerchant = (merchant: SubMerchant) => {
    Alert.alert(
      'Remove Sub-Merchant',
      `Are you sure you want to permanently remove ${merchant.firstName} ${merchant.lastName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setSubMerchants(prev => prev.filter(sm => sm.id !== merchant.id));
            setDetailModalVisible(false);
            Alert.alert('Removed', `${merchant.firstName} ${merchant.lastName} has been removed.`);
          },
        },
      ]
    );
  };

  const filteredSubMerchants = subMerchants.filter(
    sm =>
      sm.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sm.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sm.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sm.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: SubMerchant['status']) => {
    switch (status) {
      case 'active':
        return { bg: '#DCFCE7', text: '#16A34A' };
      case 'banned':
        return { bg: '#FEE2E2', text: '#DC2626' };
      case 'pending':
        return { bg: '#FEF3C7', text: '#D97706' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const renderSubMerchantsList = () => (
    <View style={styles.listContainer}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchIcon size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search sub-merchants..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: '#EEF2FF' }]}>
          <Text style={[styles.statNumber, { color: '#293454' }]}>{subMerchants.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#DCFCE7' }]}>
          <Text style={[styles.statNumber, { color: '#16A34A' }]}>
            {subMerchants.filter(sm => sm.status === 'active').length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FEE2E2' }]}>
          <Text style={[styles.statNumber, { color: '#DC2626' }]}>
            {subMerchants.filter(sm => sm.status === 'banned').length}
          </Text>
          <Text style={styles.statLabel}>Banned</Text>
        </View>
      </View>

      {/* Sub-Merchants List */}
      <Text style={styles.listTitle}>Sub-Merchants ({filteredSubMerchants.length})</Text>
      {filteredSubMerchants.map((merchant) => {
        const statusColors = getStatusColor(merchant.status);
        return (
          <TouchableOpacity
            key={merchant.id}
            style={styles.merchantCard}
            onPress={() => handleViewDetails(merchant)}
            activeOpacity={0.7}
          >
            <View style={styles.merchantCardLeft}>
              <View style={styles.merchantAvatar}>
                <Text style={styles.merchantInitials}>
                  {merchant.firstName[0]}{merchant.lastName[0]}
                </Text>
              </View>
              <View style={styles.merchantInfo}>
                <Text style={styles.merchantName}>
                  {merchant.firstName} {merchant.lastName}
                </Text>
                <Text style={styles.merchantBranch}>{merchant.branch}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                  <Text style={[styles.statusText, { color: statusColors.text }]}>
                    {merchant.status.charAt(0).toUpperCase() + merchant.status.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.merchantActions}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#EFF6FF' }]}
                onPress={() => handleViewDetails(merchant)}
              >
                <EyeIcon size={16} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: merchant.status === 'banned' ? '#DCFCE7' : '#FEF3C7' }]}
                onPress={() => handleBanMerchant(merchant)}
              >
                {merchant.status === 'banned' ? (
                  <UnbanIcon size={16} color="#22C55E" />
                ) : (
                  <BanIcon size={16} color="#F59E0B" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#FEE2E2' }]}
                onPress={() => handleRemoveMerchant(merchant)}
              >
                <TrashIcon size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        );
      })}

      {filteredSubMerchants.length === 0 && (
        <View style={styles.emptyState}>
          <UsersIcon size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>No sub-merchants found</Text>
          <Text style={styles.emptySubtext}>Add a new sub-merchant to get started</Text>
        </View>
      )}
    </View>
  );

  const renderAddSubMerchantForm = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardView}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Shop Selection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ASSIGN TO SHOP</Text>
          <TouchableOpacity
            style={styles.shopCard}
            onPress={handleChangeShop}
            activeOpacity={0.8}
          >
            <View style={styles.shopCardLeft}>
              <View style={styles.shopIconContainer}>
                <StoreIcon size={24} color="#293454" />
              </View>
              <View>
                <Text style={styles.shopName}>Nexus Coffee - HQ</Text>
                <Text style={styles.shopId}>ID: 883-920-MER</Text>
              </View>
            </View>
            <View style={styles.changeButton}>
              <Text style={styles.changeText}>Change</Text>
              <ChevronRightIcon size={14} color="#293454" />
            </View>
          </TouchableOpacity>
          <Text style={styles.sectionHint}>
            Search and select the merchant branch for this user.
          </Text>
        </View>

        {/* Personal Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PERSONAL DETAILS</Text>
          
          {/* Name Row */}
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John"
                placeholderTextColor="#9CA3AF"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Doe"
                placeholderTextColor="#9CA3AF"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputWithIcon}>
              <EnvelopeIcon size={18} color="#9CA3AF" />
              <TextInput
                style={styles.inputWithIconField}
                placeholder="john.doe@nexuspay.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Phone */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputWithIcon}>
              <PhoneIcon size={18} color="#9CA3AF" />
              <TextInput
                style={styles.inputWithIconField}
                placeholder="+1 (555) 000-0000"
                placeholderTextColor="#9CA3AF"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Date of Birth */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#9CA3AF"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
            />
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SECURITY</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Temporary Password</Text>
            <View style={styles.passwordInputRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={tempPassword}
                onChangeText={setTempPassword}
                editable={false}
              />
              <TouchableOpacity
                style={styles.regenerateButton}
                onPress={regeneratePassword}
                activeOpacity={0.7}
              >
                <Text style={styles.regenerateText}>Regenerate</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.passwordHint}>
              <InfoCircleIcon size={14} color="#6B7280" />
              <Text style={styles.hintText}>
                User must change this upon first login.
              </Text>
            </View>
          </View>
        </View>

        {/* Permissions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ROLE & PERMISSIONS</Text>
          
          <View style={styles.permissionsCard}>
            {permissions.map((permission, index) => (
              <View
                key={permission.id}
                style={[
                  styles.permissionItem,
                  index < permissions.length - 1 && styles.permissionItemBorder,
                ]}
              >
                <View style={styles.permissionLeft}>
                  <View
                    style={[
                      styles.permissionIcon,
                      { backgroundColor: permission.iconBgColor },
                    ]}
                  >
                    {permission.icon}
                  </View>
                  <View>
                    <Text style={styles.permissionTitle}>{permission.title}</Text>
                    <Text style={styles.permissionDesc}>{permission.description}</Text>
                  </View>
                </View>
                <ToggleSwitch
                  value={permission.enabled}
                  onValueChange={() => togglePermission(permission.id)}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateSubMerchant}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.9}
          >
            <UserPlusIcon size={20} color="#FFFFFF" />
            <Text style={styles.createButtonText}>Create Sub-Merchant</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );

  // ==================== DETAIL MODAL ====================
  const renderDetailModal = () => (
    <Modal
      visible={detailModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setDetailModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sub-Merchant Details</Text>
            <TouchableOpacity
              onPress={() => setDetailModalVisible(false)}
              style={styles.modalCloseBtn}
            >
              <CloseIcon size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {selectedSubMerchant && (
            <ScrollView style={styles.modalContent}>
              {/* Avatar & Name */}
              <View style={styles.modalAvatarSection}>
                <View style={styles.modalAvatar}>
                  <Text style={styles.modalAvatarText}>
                    {selectedSubMerchant.firstName[0]}{selectedSubMerchant.lastName[0]}
                  </Text>
                </View>
                <Text style={styles.modalName}>
                  {selectedSubMerchant.firstName} {selectedSubMerchant.lastName}
                </Text>
                <View style={[
                  styles.modalStatusBadge,
                  { backgroundColor: getStatusColor(selectedSubMerchant.status).bg }
                ]}>
                  <Text style={[
                    styles.modalStatusText,
                    { color: getStatusColor(selectedSubMerchant.status).text }
                  ]}>
                    {selectedSubMerchant.status.charAt(0).toUpperCase() + selectedSubMerchant.status.slice(1)}
                  </Text>
                </View>
              </View>

              {/* Details Grid */}
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{selectedSubMerchant.email}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Phone</Text>
                  <Text style={styles.detailValue}>{selectedSubMerchant.phone}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Branch</Text>
                  <Text style={styles.detailValue}>{selectedSubMerchant.branch}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Branch ID</Text>
                  <Text style={styles.detailValue}>{selectedSubMerchant.branchId}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Date Added</Text>
                  <Text style={styles.detailValue}>{selectedSubMerchant.dateAdded}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>ID</Text>
                  <Text style={styles.detailValue}>{selectedSubMerchant.id}</Text>
                </View>
              </View>

              {/* Permissions */}
              <View style={styles.permissionsSection}>
                <Text style={styles.permissionsSectionTitle}>Permissions</Text>
                <View style={styles.permissionTags}>
                  {selectedSubMerchant.permissions.map((perm, idx) => (
                    <View key={idx} style={styles.permissionTag}>
                      <CheckCircleIcon size={14} color="#22C55E" />
                      <Text style={styles.permissionTagText}>{perm}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[
                    styles.modalActionBtn,
                    { backgroundColor: selectedSubMerchant.status === 'banned' ? '#DCFCE7' : '#FEF3C7' }
                  ]}
                  onPress={() => handleBanMerchant(selectedSubMerchant)}
                >
                  {selectedSubMerchant.status === 'banned' ? (
                    <>
                      <UnbanIcon size={18} color="#22C55E" />
                      <Text style={[styles.modalActionText, { color: '#22C55E' }]}>Unban User</Text>
                    </>
                  ) : (
                    <>
                      <BanIcon size={18} color="#F59E0B" />
                      <Text style={[styles.modalActionText, { color: '#F59E0B' }]}>Ban User</Text>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalActionBtn, { backgroundColor: '#FEE2E2' }]}
                  onPress={() => handleRemoveMerchant(selectedSubMerchant)}
                >
                  <TrashIcon size={18} color="#EF4444" />
                  <Text style={[styles.modalActionText, { color: '#EF4444' }]}>Remove</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  // ==================== MAIN RETURN ====================
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#293454" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeftIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sub-Merchants</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.helpButton}>Help</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'list' && styles.activeTab]}
          onPress={() => setActiveTab('list')}
          activeOpacity={0.7}
        >
          <UsersIcon size={18} color={activeTab === 'list' ? '#293454' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>
            Sub-Merchants
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'add' && styles.activeTab]}
          onPress={() => setActiveTab('add')}
          activeOpacity={0.7}
        >
          <UserPlusIcon size={18} color={activeTab === 'add' ? '#293454' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>
            Add New
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'list' ? renderSubMerchantsList() : renderAddSubMerchantForm()}

      {/* Detail Modal */}
      {renderDetailModal()}
    </View>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  // Header
  header: {
    backgroundColor: '#293454',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  helpButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#93C5FD',
  },

  // Keyboard & Scroll
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    marginLeft: 4,
  },

  // Shop Card
  shopCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  shopCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  shopIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  shopId: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#293454',
  },

  // Form
  formRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    gap: 12,
  },
  inputWithIconField: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
  },

  // Password
  passwordInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 1,
  },
  regenerateButton: {
    position: 'absolute',
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  regenerateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#293454',
  },
  passwordHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  hintText: {
    fontSize: 12,
    color: '#6B7280',
  },

  // Permissions Card
  permissionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  permissionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  permissionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  permissionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  permissionDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  // Toggle Switch
  toggleSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: '#293454',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  createButton: {
    backgroundColor: '#293454',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Tab Navigation
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#EEF2FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#293454',
    fontWeight: '600',
  },

  // List Container
  listContainer: {
    flex: 1,
    padding: 16,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },

  // List Title
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },

  // Merchant Card
  merchantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  merchantCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  merchantAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  merchantInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: '#293454',
  },
  merchantInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  merchantBranch: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  merchantActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  modalAvatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAvatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#293454',
  },
  modalName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
  },
  modalStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  modalStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsGrid: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
  },
  permissionsSection: {
    marginBottom: 24,
  },
  permissionsSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  permissionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  permissionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  permissionTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#16A34A',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  modalActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  modalActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterSubMerchantScreen;
