import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';

type SelectMerchantTypeScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface MerchantType {
  id: 'GENERAL' | 'CORPORATE' | 'FUEL' | 'GOVERNMENT';
  name: string;
  icon: string;
  color: string;
  borderColor: string;
  bgColor: string;
  description: string;
  route: keyof MainStackParamList;
}

const MERCHANT_TYPES: MerchantType[] = [
  {
    id: 'GENERAL',
    name: 'General Merchant',
    icon: 'store',
    color: '#059669',
    borderColor: '#10B981',
    bgColor: '#D1FAE5',
    description: 'Retail & Services',
    route: 'GeneralMerchantDashboard',
  },
  {
    id: 'CORPORATE',
    name: 'Corporate Merchant',
    icon: 'building',
    color: '#DC2626',
    borderColor: '#DC2626',
    bgColor: '#FEE2E2',
    description: 'Business Payments',
    route: 'CorporateMerchantDashboard',
  },
  {
    id: 'FUEL',
    name: 'Fuel Merchant',
    icon: 'gas-pump',
    color: '#4F46E5',
    borderColor: '#6366F1',
    bgColor: '#E0E7FF',
    description: 'Fuel Station',
    route: 'FuelMerchantDashboard',
  },
  {
    id: 'GOVERNMENT',
    name: 'Government Merchant',
    icon: 'landmark',
    color: '#1E40AF',
    borderColor: '#2563EB',
    bgColor: '#DBEAFE',
    description: 'Government Services',
    route: 'GovernmentMerchantDashboard',
  },
];

const SelectAgencyScreen = () => {
  const navigation = useNavigation<SelectMerchantTypeScreenNavigationProp>();

  const handleMerchantSelect = (merchant: MerchantType) => {
    // Navigate to Login screen with selected merchant type
    (navigation as any).navigate('Login', { merchantType: merchant.route });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#293454" />

      <View style={styles.header}>
        <View style={styles.statusBar}>
          <Text style={styles.statusTime}>9:41</Text>
          <View style={styles.statusIcons}>
            <Icon name="signal" size={12} color="rgba(255,255,255,0.9)" solid />
            <Icon
              name="wifi"
              size={12}
              color="rgba(255,255,255,0.9)"
              solid
              style={styles.iconGap}
            />
            <Icon
              name="battery-full"
              size={12}
              color="rgba(255,255,255,0.9)"
              solid
              style={styles.iconGap}
            />
          </View>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileLeft}>
            <View style={styles.profileAvatar}>
              <Icon name="user" size={14} color="#FFFFFF" solid />
            </View>
            <View>
              <Text style={styles.profileId}>MERCHANT ID: 8842</Text>
              <Text style={styles.profileName}>Welcome Back</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="bell" size={16} color="#FFFFFF" solid />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>Select Merchant Type</Text>
          <Text style={styles.subtitle}>Choose your business type to access dashboard.</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {MERCHANT_TYPES.map((merchant) => (
            <TouchableOpacity
              key={merchant.id}
              style={styles.serviceCard}
              onPress={() => handleMerchantSelect(merchant)}
              activeOpacity={0.7}
            >
              <View style={[styles.serviceBorder, { backgroundColor: merchant.borderColor }]} />
              <View style={styles.serviceContent}>
                <View style={[styles.serviceIcon, { backgroundColor: merchant.bgColor }]}>
                  <Icon name={merchant.icon} size={18} color={merchant.color} solid />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{merchant.name}</Text>
                  <Text style={styles.serviceDesc}>{merchant.description}</Text>
                </View>
              </View>
              <View style={styles.serviceChevron}>
                <Icon name="chevron-right" size={10} color="#CBD5E1" solid />
              </View>
            </TouchableOpacity>
          ))
        }</View>

        <View style={styles.statusSection}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusHeaderText}>ACCOUNT STATUS</Text>
            <View style={styles.operationalBadge}>
              <Text style={styles.operationalText}>Active</Text>
            </View>
          </View>
          <View style={styles.statusCards}>
            <View style={styles.statusCard}>
              <Icon name="wallet" size={16} color="#10B981" solid />
              <Text style={styles.statusCardLabel}>Balance</Text>
              <Text style={styles.statusCardValue}>GMD 0.00</Text>
            </View>
            <View style={styles.statusCard}>
              <Icon name="exchange-alt" size={16} color="#10B981" />
              <Text style={styles.statusCardLabel}>Transactions</Text>
              <Text style={styles.statusCardValue}>0</Text>
            </View>
            <View style={styles.statusCard}>
              <Icon name="check-circle" size={16} color="#10B981" solid />
              <Text style={styles.statusCardLabel}>Status</Text>
              <Text style={styles.statusCardValue}>Verified</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.quickActionButton}>
          <View style={styles.quickActionIcon}>
            <Icon name="qrcode" size={16} color="#FFFFFF" solid />
          </View>
          <Text style={styles.quickActionText}>Accept Payment</Text>
          <Icon name="arrow-right" size={14} color="#CBD5E1" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    backgroundColor: '#293454',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTime: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconGap: {
    marginLeft: 6,
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileId: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  titleSection: {
    marginTop: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  grid: {
    marginBottom: 24,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  serviceBorder: {
    width: 4,
    height: '100%',
    position: 'absolute',
    left: 0,
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 16,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  serviceDesc: {
    fontSize: 12,
    color: '#64748B',
  },
  serviceChevron: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1,
  },
  operationalBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  operationalText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
  },
  statusCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    marginHorizontal: 4,
  },
  statusCardLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 8,
    marginBottom: 2,
  },
  statusCardValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  quickActionButton: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quickActionText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SelectAgencyScreen;
