/**
 * ✅ PATROL APP - SETTINGS SCREEN
 * Settings for MFA configuration and app preferences
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
  Alert,
  Switch,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const { width, height } = require('react-native').Dimensions.get('window');

// Icons
const BackIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </Svg>
);

const ShieldIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
  </Svg>
);

const KeyIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
  </Svg>
);

const BellIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </Svg>
);

const InfoIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </Svg>
);

// Department color configurations
const departmentConfigs: Record<string, { primary: string; secondary: string; name: string }> = {
  police: { primary: '#3B82F6', secondary: '#1D4ED8', name: 'Police' },
  fire: { primary: '#EF4444', secondary: '#DC2626', name: 'Fire' },
  ambulance: { primary: '#10B981', secondary: '#059669', name: 'Medical' },
  immigration: { primary: '#1E40AF', secondary: '#1E3A8A', name: 'Immigration' },
};

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, label, description, onPress, rightElement }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
    <View style={styles.settingIcon}>{icon}</View>
    <View style={styles.settingContent}>
      <Text style={styles.settingLabel}>{label}</Text>
      {description && <Text style={styles.settingDescription}>{description}</Text>}
    </View>
    {rightElement}
  </TouchableOpacity>
);

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const department = route.params?.department || 'police';
  const config = departmentConfigs[department] || departmentConfigs.police;

  const [mfaCode, setMfaCode] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSaveMFA = () => {
    if (mfaCode.length !== 6) {
      Alert.alert('Invalid Code', 'MFA code must be 6 digits.');
      return;
    }
    
    // Validate MFA codes
    const validCodes: Record<string, string> = {
      '123456': 'Police',
      '111111': 'Fire',
      '222222': 'Immigration',
      '000006': 'Ambulance/Medical',
    };
    
    if (validCodes[mfaCode]) {
      Alert.alert(
        'MFA Code Saved',
        `Your MFA code for ${validCodes[mfaCode]} department has been saved.`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Invalid MFA Code',
        'Please enter a valid department MFA code:\n\n• Police: 123456\n• Fire: 111111\n• Immigration: 222222\n• Ambulance: 000006',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient colors={['#0F172A', '#1E293B', '#0F172A']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackIcon size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Department Badge */}
      <View style={styles.departmentBadge}>
        <LinearGradient colors={[config.primary, config.secondary]} style={styles.departmentGradient}>
          <ShieldIcon size={20} color="#FFFFFF" />
          <Text style={styles.departmentText}>{config.name.toUpperCase()} DEPARTMENT</Text>
        </LinearGradient>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* MFA Configuration Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MFA Configuration</Text>
          <View style={styles.mfaCard}>
            <LinearGradient colors={['rgba(59,130,246,0.2)', 'rgba(59,130,246,0.1)']} style={styles.mfaGradient}>
              <View style={styles.mfaIconContainer}>
                <KeyIcon size={28} color={config.primary} />
              </View>
              <Text style={styles.mfaTitle}>Multi-Factor Authentication</Text>
              <Text style={styles.mfaDescription}>
                Enter your 6-digit MFA code to authenticate with your department.
              </Text>
              <View style={styles.mfaInputContainer}>
                <TextInput
                  style={styles.mfaInput}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor="#64748B"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={mfaCode}
                  onChangeText={setMfaCode}
                />
                <TouchableOpacity 
                  style={[styles.mfaSaveButton, { backgroundColor: config.primary }]} 
                  onPress={handleSaveMFA}
                >
                  <Text style={styles.mfaSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.mfaCodesInfo}>
                <Text style={styles.mfaCodesTitle}>Department MFA Codes:</Text>
                <Text style={styles.mfaCodeItem}>• Police: 123456</Text>
                <Text style={styles.mfaCodeItem}>• Fire: 111111</Text>
                <Text style={styles.mfaCodeItem}>• Immigration: 222222</Text>
                <Text style={styles.mfaCodeItem}>• Ambulance: 000006</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingsCard}>
            <SettingItem
              icon={<BellIcon size={22} color={config.primary} />}
              label="Push Notifications"
              description="Receive emergency alerts"
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#334155', true: config.primary + '80' }}
                  thumbColor={notificationsEnabled ? config.primary : '#94A3B8'}
                />
              }
            />
            <View style={styles.settingDivider} />
            <SettingItem
              icon={<BellIcon size={22} color={config.primary} />}
              label="Sound Alerts"
              description="Play sound for emergencies"
              rightElement={
                <Switch
                  value={soundEnabled}
                  onValueChange={setSoundEnabled}
                  trackColor={{ false: '#334155', true: config.primary + '80' }}
                  thumbColor={soundEnabled ? config.primary : '#94A3B8'}
                />
              }
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Location</Text>
          <View style={styles.settingsCard}>
            <SettingItem
              icon={<ShieldIcon size={22} color={config.primary} />}
              label="Location Services"
              description="Allow GPS tracking on duty"
              rightElement={
                <Switch
                  value={locationEnabled}
                  onValueChange={setLocationEnabled}
                  trackColor={{ false: '#334155', true: config.primary + '80' }}
                  thumbColor={locationEnabled ? config.primary : '#94A3B8'}
                />
              }
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.settingsCard}>
            <SettingItem
              icon={<InfoIcon size={22} color={config.primary} />}
              label="App Version"
              description="Sentinel Patrol v1.0.6"
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Sentinel Patrol System</Text>
          <Text style={styles.footerSubtext}>© 2025 eGov Gambia</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight! + 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
  },
  departmentBadge: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  departmentGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  departmentText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mfaCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)',
  },
  mfaGradient: {
    padding: 20,
    alignItems: 'center',
  },
  mfaIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(59,130,246,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mfaTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  mfaDescription: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 20,
  },
  mfaInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    marginBottom: 20,
  },
  mfaInput: {
    flex: 1,
    height: 48,
    backgroundColor: 'rgba(15,23,42,0.8)',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 8,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.2)',
  },
  mfaSaveButton: {
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mfaSaveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mfaCodesInfo: {
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  mfaCodesTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 8,
  },
  mfaCodeItem: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  settingsCard: {
    backgroundColor: 'rgba(30,41,59,0.5)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.1)',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(59,130,246,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  settingDescription: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  settingDivider: {
    height: 1,
    backgroundColor: 'rgba(148,163,184,0.1)',
    marginLeft: 74,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
  },
});

export default SettingsScreen;
