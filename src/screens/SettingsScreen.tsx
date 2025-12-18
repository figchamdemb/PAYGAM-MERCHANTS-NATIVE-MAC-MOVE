/**
 * PAYGAM MERCHANT - SETTINGS SCREEN
 * Settings page with profile, security, preferences, and support sections
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
  ScrollView,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const ArrowLeftIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </Svg>
);

const BellIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </Svg>
);

const ShieldIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
  </Svg>
);

const MobileIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
  </Svg>
);

const FingerprintIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21z" />
  </Svg>
);

const LanguageIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#9333EA' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
  </Svg>
);

const HeadsetIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#16A34A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
  </Svg>
);

const ChevronRightIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#D1D5DB' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </Svg>
);

const LogoutIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#DC2626' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </Svg>
);

const StarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#FACC15' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </Svg>
);

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const handleGoBack = () => navigation.goBack();
  const handleTransactionPIN = () => Alert.alert('Transaction PIN', 'Change your 4-digit transaction PIN');
  const handleChangeMPIN = () => Alert.alert('Change MPIN', 'Update your login password');
  const handleLanguage = () => Alert.alert('Language', 'Select your preferred language');
  const handleHelpSupport = () => navigation.navigate('HelpCenter');
  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => navigation.replace('Login') }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.navButton} onPress={handleGoBack}>
            <ArrowLeftIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <TouchableOpacity style={styles.navButton}>
            <BellIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Profile */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.profileImage} />
            <View style={styles.onlineIndicator} />
          </View>
          <Text style={styles.profileName}>Nexus Tech Solutions</Text>
          <Text style={styles.merchantId}>Merchant ID: 8839201</Text>
          <View style={styles.ratingBadge}>
            <StarIcon size={14} color="#FACC15" />
            <Text style={styles.ratingText}>4.9 Rating</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SECURITY</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity style={styles.settingItem} onPress={handleTransactionPIN}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#EFF6FF' }]}>
                  <ShieldIcon size={18} color="#293454" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Transaction PIN</Text>
                  <Text style={styles.settingSubtitle}>Change your 4-digit PIN</Text>
                </View>
              </View>
              <ChevronRightIcon size={16} color="#D1D5DB" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingItem} onPress={handleChangeMPIN}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#EFF6FF' }]}>
                  <MobileIcon size={18} color="#293454" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Change MPIN</Text>
                  <Text style={styles.settingSubtitle}>Login password</Text>
                </View>
              </View>
              <ChevronRightIcon size={16} color="#D1D5DB" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#EFF6FF' }]}>
                  <FingerprintIcon size={18} color="#293454" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Biometric Login</Text>
                  <Text style={styles.settingSubtitle}>FaceID / TouchID</Text>
                </View>
              </View>
              <Switch value={biometricEnabled} onValueChange={setBiometricEnabled} trackColor={{ false: '#E5E7EB', true: '#293454' }} thumbColor="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity style={styles.settingItem} onPress={handleLanguage}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <LanguageIcon size={18} color="#9333EA" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Language</Text>
                  <Text style={styles.settingSubtitle}>App display language</Text>
                </View>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>English</Text>
                <ChevronRightIcon size={16} color="#D1D5DB" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity style={styles.settingItem} onPress={handleHelpSupport}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#DCFCE7' }]}>
                  <HeadsetIcon size={18} color="#16A34A" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Help & Support</Text>
                  <Text style={styles.settingSubtitle}>FAQ and Customer Care</Text>
                </View>
              </View>
              <ChevronRightIcon size={16} color="#D1D5DB" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogoutIcon size={18} color="#DC2626" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
          <View style={styles.appInfo}>
            <Text style={styles.appName}>NexusPay Merchant App</Text>
            <Text style={styles.appVersion}>Version 2.4.0 (Build 2023)</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#293454', paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 24) + 16, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  navButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', letterSpacing: 0.5 },
  profileSection: { alignItems: 'center' },
  profileImageContainer: { position: 'relative' },
  profileImage: { width: 96, height: 96, borderRadius: 48, borderWidth: 4, borderColor: 'rgba(255,255,255,0.2)' },
  onlineIndicator: { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: '#4ADE80', borderWidth: 4, borderColor: '#293454' },
  profileName: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginTop: 16 },
  merchantId: { fontSize: 14, fontWeight: '500', color: '#93C5FD', marginTop: 4 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, paddingHorizontal: 16, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  ratingText: { fontSize: 12, fontWeight: '500', color: '#FFFFFF' },
  content: { flex: 1, marginTop: -24 },
  contentContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#6B7280', letterSpacing: 1, marginLeft: 16, marginBottom: 12 },
  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#F3F4F6' },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  settingTextContainer: { marginLeft: 16 },
  settingTitle: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  settingSubtitle: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingValue: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
  divider: { height: 1, backgroundColor: '#F9FAFB', marginLeft: 72 },
  footerActions: { marginTop: 8 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FEE2E2', borderRadius: 12, paddingVertical: 16 },
  logoutText: { fontSize: 14, fontWeight: '700', color: '#DC2626' },
  appInfo: { alignItems: 'center', marginTop: 16 },
  appName: { fontSize: 12, fontWeight: '500', color: '#9CA3AF' },
  appVersion: { fontSize: 10, color: '#D1D5DB', marginTop: 4 },
});

export default SettingsScreen;
