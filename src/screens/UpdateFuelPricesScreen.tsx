/**
 * PAYGAM MERCHANT - UPDATE FUEL PRICES SCREEN
 * Fuel Station price management with live updates
 * Features: Multiple fuel types, Toggle availability, Price change tracking
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// ==================== SVG ICONS ====================
const ArrowLeftIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const HelpIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const InfoIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M12 16v-4M12 8h.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const TrendUpIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#16A34A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M23 6l-9.5 9.5-5-5L1 18" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 6h6v6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TruckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#334155' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="5.5" cy="18.5" r="2.5" stroke={color} strokeWidth={2} />
    <Circle cx="18.5" cy="18.5" r="2.5" stroke={color} strokeWidth={2} />
  </Svg>
);

const FlameIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#2563EB' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const XCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M15 9l-6 6M9 9l6 6" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const CloudUploadIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M16 16l-4-4-4 4M12 12v9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ==================== TYPES ====================
interface FuelType {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  enabled: boolean;
  iconType: 'number' | 'truck' | 'flame';
  iconValue?: string;
  iconBgColor: string;
  iconBorderColor: string;
  iconTextColor: string;
  changePercent?: string;
  changeType?: 'up' | 'down';
  unavailable?: boolean;
}

// ==================== MAIN COMPONENT ====================
const UpdateFuelPricesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>([
    {
      id: '1',
      name: 'Unleaded 91',
      subtitle: 'Regular Petrol',
      price: '1.89',
      enabled: true,
      iconType: 'number',
      iconValue: '91',
      iconBgColor: '#F0FDF4',
      iconBorderColor: '#DCFCE7',
      iconTextColor: '#16A34A',
      changePercent: '+2.5%',
      changeType: 'up',
    },
    {
      id: '2',
      name: 'Premium 95',
      subtitle: 'High Octane',
      price: '2.05',
      enabled: true,
      iconType: 'number',
      iconValue: '95',
      iconBgColor: '#FEFCE8',
      iconBorderColor: '#FEF9C3',
      iconTextColor: '#CA8A04',
    },
    {
      id: '3',
      name: 'Diesel',
      subtitle: 'Standard Diesel',
      price: '1.95',
      enabled: true,
      iconType: 'truck',
      iconBgColor: '#F1F5F9',
      iconBorderColor: '#E2E8F0',
      iconTextColor: '#334155',
    },
    {
      id: '4',
      name: 'LPG',
      subtitle: 'Auto Gas',
      price: '0.99',
      enabled: false,
      iconType: 'flame',
      iconBgColor: '#EFF6FF',
      iconBorderColor: '#DBEAFE',
      iconTextColor: '#2563EB',
      unavailable: true,
    },
  ]);

  const activeCount = fuelTypes.filter(f => f.enabled).length;

  const handleToggle = (id: string) => {
    setFuelTypes(prev => prev.map(fuel => 
      fuel.id === id ? { ...fuel, enabled: !fuel.enabled } : fuel
    ));
  };

  const handlePriceChange = (id: string, value: string) => {
    setFuelTypes(prev => prev.map(fuel => 
      fuel.id === id ? { ...fuel, price: value } : fuel
    ));
  };

  const handleSavePublish = () => {
    navigation.navigate('ActionSuccess', {
      title: 'Prices Updated',
      message: 'Your fuel prices have been published and are now visible to all NexusPay users.',
      type: 'fuel-prices',
      navigateTo: 'FuelMerchantDashboard',
    });
  };

  const renderFuelIcon = (fuel: FuelType) => {
    if (fuel.iconType === 'number') {
      return (
        <View style={[
          styles.fuelIconContainer,
          { 
            backgroundColor: fuel.iconBgColor,
            borderColor: fuel.iconBorderColor,
          }
        ]}>
          <Text style={[styles.fuelIconNumber, { color: fuel.iconTextColor }]}>
            {fuel.iconValue}
          </Text>
        </View>
      );
    } else if (fuel.iconType === 'truck') {
      return (
        <View style={[
          styles.fuelIconContainer,
          { 
            backgroundColor: fuel.iconBgColor,
            borderColor: fuel.iconBorderColor,
          }
        ]}>
          <TruckIcon size={16} color={fuel.iconTextColor} />
        </View>
      );
    } else {
      return (
        <View style={[
          styles.fuelIconContainer,
          { 
            backgroundColor: fuel.iconBgColor,
            borderColor: fuel.iconBorderColor,
          }
        ]}>
          <FlameIcon size={16} color={fuel.iconTextColor} />
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon size={18} color="#64748B" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Update Fuel Prices</Text>
        
        <TouchableOpacity style={styles.headerButton}>
          <HelpIcon size={18} color="#293454" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* Station Status Card */}
        <View style={styles.stationCard}>
          <View style={styles.stationDecor1} />
          <View style={styles.stationDecor2} />
          
          <View style={styles.stationContent}>
            <View style={styles.stationHeader}>
              <View>
                <Text style={styles.stationName}>Nexus Station #402</Text>
                <Text style={styles.stationBranch}>Downtown Branch</Text>
              </View>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Live</Text>
              </View>
            </View>
            
            <View style={styles.stationFooter}>
              <Text style={styles.lastPublishedLabel}>Last published</Text>
              <Text style={styles.lastPublishedTime}>Today, 08:30 AM</Text>
            </View>
          </View>
        </View>

        {/* Info Text */}
        <View style={styles.infoContainer}>
          <InfoIcon size={14} color="#293454" />
          <Text style={styles.infoText}>
            Prices updated here will be immediately visible to all NexusPay users and nearby drivers.
          </Text>
        </View>

        {/* Fuel Price Cards */}
        <View style={styles.fuelList}>
          {fuelTypes.map((fuel) => (
            <View 
              key={fuel.id} 
              style={[
                styles.fuelCard,
                !fuel.enabled && styles.fuelCardDisabled,
              ]}
            >
              <View style={styles.fuelCardHeader}>
                <View style={styles.fuelCardLeft}>
                  {renderFuelIcon(fuel)}
                  <View>
                    <Text style={styles.fuelName}>{fuel.name}</Text>
                    <Text style={styles.fuelSubtitle}>{fuel.subtitle}</Text>
                  </View>
                </View>
                <Switch
                  value={fuel.enabled}
                  onValueChange={() => handleToggle(fuel.id)}
                  trackColor={{ false: '#E5E7EB', true: '#293454' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#E5E7EB"
                />
              </View>
              
              <View style={styles.priceInputContainer}>
                <View style={styles.currencyPrefix}>
                  <Text style={[
                    styles.currencySymbol,
                    !fuel.enabled && styles.currencySymbolDisabled,
                  ]}>$</Text>
                </View>
                <TextInput
                  style={[
                    styles.priceInput,
                    !fuel.enabled && styles.priceInputDisabled,
                  ]}
                  value={fuel.price}
                  onChangeText={(value) => handlePriceChange(fuel.id, value)}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="#D1D5DB"
                  editable={fuel.enabled}
                />
                <View style={styles.priceSuffix}>
                  <Text style={[
                    styles.priceSuffixText,
                    !fuel.enabled && styles.priceSuffixTextDisabled,
                  ]}>/ Liter</Text>
                </View>
              </View>

              {fuel.changePercent && fuel.enabled && (
                <View style={styles.changeIndicator}>
                  <TrendUpIcon size={14} color="#16A34A" />
                  <Text style={styles.changeText}>{fuel.changePercent} from yesterday</Text>
                </View>
              )}

              {fuel.unavailable && !fuel.enabled && (
                <View style={styles.unavailableIndicator}>
                  <XCircleIcon size={14} color="#EF4444" />
                  <Text style={styles.unavailableText}>Currently Unavailable</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer Action */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerInfoLeft}>{activeCount} types active</Text>
          <TouchableOpacity>
            <Text style={styles.footerInfoRight}>Preview Changes</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSavePublish}
          activeOpacity={0.9}
        >
          <CloudUploadIcon size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save & Publish</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 8 : 8,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#293454',
  },
  content: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  stationCard: {
    margin: 20,
    backgroundColor: '#293454',
    borderRadius: 16,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#293454',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  stationDecor1: {
    position: 'absolute',
    top: -24,
    right: -24,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  stationDecor2: {
    position: 'absolute',
    bottom: 0,
    left: -24,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
  },
  stationContent: {
    position: 'relative',
    zIndex: 10,
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stationName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stationBranch: {
    fontSize: 14,
    color: '#93C5FD',
    marginTop: 4,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
  },
  liveText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#86EFAC',
  },
  stationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  lastPublishedLabel: {
    fontSize: 14,
    color: 'rgba(191, 219, 254, 0.8)',
  },
  lastPublishedTime: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  fuelList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  fuelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  fuelCardDisabled: {
    opacity: 0.75,
  },
  fuelCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  fuelCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fuelIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  fuelIconNumber: {
    fontSize: 12,
    fontWeight: '900',
  },
  fuelName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  fuelSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 2,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  currencyPrefix: {
    paddingLeft: 16,
    paddingRight: 8,
    justifyContent: 'center',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  currencySymbolDisabled: {
    color: '#D1D5DB',
  },
  priceInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    paddingVertical: 14,
  },
  priceInputDisabled: {
    color: '#9CA3AF',
  },
  priceSuffix: {
    paddingRight: 16,
    paddingLeft: 8,
    justifyContent: 'center',
  },
  priceSuffixText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  priceSuffixTextDisabled: {
    color: '#D1D5DB',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#16A34A',
  },
  unavailableIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  unavailableText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#EF4444',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
  },
  footerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  footerInfoLeft: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  footerInfoRight: {
    fontSize: 14,
    fontWeight: '700',
    color: '#293454',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#293454',
    paddingVertical: 18,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#293454',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default UpdateFuelPricesScreen;
