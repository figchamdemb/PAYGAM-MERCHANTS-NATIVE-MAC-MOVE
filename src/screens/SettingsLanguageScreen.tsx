/**
 * SettingsLanguageScreen - Settings & Languages Interface
 * Features: Voice alert languages with play buttons, custom toggles, general settings
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Svg, Path } from 'react-native-svg';
import ConfirmationModal from '../components/ConfirmationModal';
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

// SVG Icons
const ArrowLeftIcon = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

const LanguageIcon = ({ size = 16, color = '#B45309' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2.01h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
  </Svg>
);

const PlayIcon = ({ size = 12, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M8 5v14l11-7z" />
  </Svg>
);

const GearIcon = ({ size = 16, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </Svg>
);

const BellIcon = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

const MoonIcon = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
  </Svg>
);

const FontIcon = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z" />
  </Svg>
);

const ChevronRightIcon = ({ size = 12, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

const VolumeHighIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </Svg>
);

const FingerprintIcon = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12zM14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1-1.4-1.39-2.17-3.24-2.17-5.22 0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29-.49-1.31-.73-2.61-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38z" />
  </Svg>
);

const TrashIcon = ({ size = 18, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </Svg>
);

const WarningIcon = ({ size = 48, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <Path d="M12 9v4M12 17h.01" />
  </Svg>
);

const InfoCircleIcon = ({ size = 14, color = '#B45309' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </Svg>
);

// Emergency Service Icons
const PoliceIcon = ({ size = 18, color = '#1E40AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
  </Svg>
);

const AmbulanceIcon = ({ size = 18, color = '#DC2626' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V3H9v2H6.5c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5zm8-5h-2V4h2v2zm0 4h-2V8h2v2z" />
  </Svg>
);

const FireIcon = ({ size = 18, color = '#EA580C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
  </Svg>
);

const ShieldAlertIcon = ({ size = 16, color = '#B45309' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1s-1-.45-1-1V8c0-.55.45-1 1-1zm1 10h-2v-2h2v2z" />
  </Svg>
);

// Custom Toggle Switch Component
interface ToggleSwitchProps {
  value: boolean;
  onValueChange: () => void;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ value, onValueChange, disabled = false }) => {
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onValueChange}
      activeOpacity={disabled ? 1 : 0.8}
      style={[
        styles.toggleTrack,
        value ? styles.toggleTrackOn : styles.toggleTrackOff,
        disabled && styles.toggleDisabled,
      ]}
    >
      <View
        style={[
          styles.toggleThumb,
          value ? styles.toggleThumbOn : styles.toggleThumbOff,
        ]}
      />
    </TouchableOpacity>
  );
};

interface LanguageConfig {
  code: string;
  name: string;
  subtitle: string;
  initials: string;
  fixed: boolean;
}

const SettingsLanguageScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode, toggleDarkMode } = useTheme();

  // Language toggle states
  const [languages, setLanguages] = useState<Record<string, boolean>>({
    english: true,
    mandinka: true,
    wolof: true,
    fula: false,
    jola: false,
    sarahuley: false,
  });

  // General settings states
  const [pushNotifications, setPushNotifications] = useState(true);
  
  // Biometric settings
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('Biometric');
  
  // Delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmStep, setDeleteConfirmStep] = useState(1);

  // Initialize biometrics on mount
  useEffect(() => {
    checkBiometricAvailability();
    loadBiometricSetting();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      setBiometricAvailable(available);
      if (biometryType === 'Biometrics' || biometryType === 'TouchID') {
        setBiometricType('Fingerprint');
      } else if (biometryType === 'FaceID') {
        setBiometricType('Face ID');
      } else {
        setBiometricType('Biometric');
      }
    } catch (error) {
      console.log('Biometric check error:', error);
      setBiometricAvailable(false);
    }
  };

  const loadBiometricSetting = async () => {
    try {
      const saved = await AsyncStorage.getItem('biometricEnabled');
      if (saved === 'true') {
        setBiometricEnabled(true);
      }
    } catch (error) {
      console.log('Error loading biometric setting:', error);
    }
  };

  const handleBiometricToggle = async () => {
    if (!biometricAvailable) {
      Alert.alert(
        'Biometric Not Available',
        'Your device does not support biometric authentication or it is not set up.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const rnBiometrics = new ReactNativeBiometrics();
      
      if (!biometricEnabled) {
        // Enabling - verify fingerprint first
        const { success } = await rnBiometrics.simplePrompt({
          promptMessage: 'Verify your identity to enable biometric login',
        });
        
        if (success) {
          await AsyncStorage.setItem('biometricEnabled', 'true');
          setBiometricEnabled(true);
          Alert.alert('Success', 'Biometric authentication has been enabled. You can now use your fingerprint to log in.');
        }
      } else {
        // Disabling
        await AsyncStorage.setItem('biometricEnabled', 'false');
        setBiometricEnabled(false);
        Alert.alert('Disabled', 'Biometric authentication has been disabled.');
      }
    } catch (error) {
      console.log('Biometric toggle error:', error);
      Alert.alert('Error', 'Failed to update biometric settings. Please try again.');
    }
  };

  const handleDeleteAccount = () => {
    setDeleteConfirmStep(1);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmStep === 1) {
      setDeleteConfirmStep(2);
    } else {
      // Final confirmation - schedule deletion
      setShowDeleteModal(false);
      Alert.alert(
        'Account Scheduled for Deletion',
        'Your account will be permanently deleted within 7 days. If you change your mind, log in again to cancel the deletion.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      // TODO: Call API to schedule account deletion
    }
  };

  // Help Nearby toggle states
  const [nearbyPolice, setNearbyPolice] = useState(true);
  const [nearbyAmbulance, setNearbyAmbulance] = useState(true);
  const [nearbyFire, setNearbyFire] = useState(false);

  const languageConfigs: LanguageConfig[] = [
    { code: 'english', name: 'English', subtitle: 'Default Language', initials: 'EN', fixed: true },
    { code: 'mandinka', name: 'Mandinka', subtitle: 'Local Dialect', initials: 'MN', fixed: false },
    { code: 'wolof', name: 'Wolof', subtitle: 'Local Dialect', initials: 'WO', fixed: false },
    { code: 'fula', name: 'Fula', subtitle: 'Local Dialect', initials: 'FU', fixed: false },
    { code: 'jola', name: 'Jola', subtitle: 'Local Dialect', initials: 'JO', fixed: false },
    { code: 'sarahuley', name: 'Sarahuley', subtitle: 'Local Dialect', initials: 'SA', fixed: false },
  ];

  const toggleLanguage = (code: string) => {
    const config = languageConfigs.find(lang => lang.code === code);
    if (config?.fixed) return;

    setLanguages(prev => ({
      ...prev,
      [code]: !prev[code],
    }));
  };

  const playLanguagePreview = (code: string) => {
    console.log(`Playing preview for ${code}`);
    // TODO: Implement audio playback
  };

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSave = () => {
    console.log('Saving settings:', { languages, pushNotifications, isDarkMode });
    setShowConfirmation(true);
  };

  const renderLanguageItem = (config: LanguageConfig, index: number) => {
    const isEnabled = languages[config.code];
    const isFixed = config.fixed;
    const isLast = index === languageConfigs.length - 1;

    return (
      <TouchableOpacity
        key={config.code}
        style={[styles.languageItem, !isLast && styles.languageItemBorder]}
        activeOpacity={isFixed ? 1 : 0.7}
        onPress={() => !isFixed && toggleLanguage(config.code)}
      >
        <View style={styles.languageInfo}>
          <View
            style={[
              styles.languageIcon,
              isFixed ? styles.languageIconDefault : styles.languageIconLocal,
            ]}
          >
            <Text
              style={[
                styles.languageInitials,
                isFixed ? styles.languageInitialsDefault : styles.languageInitialsLocal,
              ]}
            >
              {config.initials}
            </Text>
          </View>
          <View style={styles.languageText}>
            <Text style={styles.languageName}>{config.name}</Text>
            <Text style={styles.languageSubtitle}>{config.subtitle}</Text>
          </View>
        </View>

        <View style={styles.languageControls}>
          {/* Play Button */}
          <TouchableOpacity
            style={[
              styles.playButton,
              isEnabled && !isFixed ? styles.playButtonActive : styles.playButtonInactive,
            ]}
            onPress={() => playLanguagePreview(config.code)}
            activeOpacity={0.7}
          >
            <PlayIcon size={12} color={isEnabled && !isFixed ? '#B45309' : '#9CA3AF'} />
          </TouchableOpacity>

          {/* Toggle Switch */}
          <ToggleSwitch
            value={isEnabled}
            onValueChange={() => toggleLanguage(config.code)}
            disabled={isFixed}
          />
        </View>
      </TouchableOpacity>
    );
  };

  // Dynamic styles based on theme
  const dynamicStyles = {
    container: {
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.card,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      color: theme.colors.text,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
    },
    text: {
      color: theme.colors.text,
    },
    textSecondary: {
      color: theme.colors.textSecondary,
    },
  };

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <StatusBar 
        barStyle={theme.isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.background} 
      />

      {/* Header */}
      <View style={[styles.header, dynamicStyles.header]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeftIcon size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>Settings & Languages</Text>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.7}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        {/* Language Preferences Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <LanguageIcon size={16} color={theme.colors.secondary} />
            <Text style={[styles.sectionTitle, dynamicStyles.text]}>Voice Alert Languages</Text>
          </View>

          <View style={[styles.languageCard, dynamicStyles.card]}>
            {/* Info Banner */}
            <View style={[styles.languageInfoBanner, { backgroundColor: theme.isDark ? '#422006' : '#FFFBEB' }]}>
              <InfoCircleIcon size={14} color={theme.colors.secondary} />
              <Text style={[styles.languageInfoText, { color: theme.isDark ? '#FCD34D' : '#92400E' }]}>
                Enable languages to hear audio instructions when you trigger an emergency (Police, Fire, Ambulance).
              </Text>
            </View>

            {/* Language List */}
            <View style={styles.languageList}>
              {languageConfigs.map((config, index) => renderLanguageItem(config, index))}
            </View>
          </View>
        </View>

        {/* Help Nearby Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ShieldAlertIcon size={16} color={theme.colors.secondary} />
            <Text style={[styles.sectionTitle, dynamicStyles.text]}>Help Nearby</Text>
          </View>

          <View style={[styles.settingsCard, dynamicStyles.card]}>
            {/* Info Banner */}
            <View style={[styles.languageInfoBanner, { backgroundColor: theme.isDark ? '#422006' : '#FFFBEB' }]}>
              <InfoCircleIcon size={14} color={theme.colors.secondary} />
              <Text style={[styles.languageInfoText, { color: theme.isDark ? '#FCD34D' : '#92400E' }]}>
                Enable to show nearby emergency services on your map when you trigger an SOS or need help.
              </Text>
            </View>

            {/* Nearby Police */}
            <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
              <View style={styles.settingInfo}>
                <View style={[styles.settingIconCircle, { backgroundColor: theme.isDark ? '#1E3A5F' : '#EFF6FF' }]}>
                  <PoliceIcon size={18} color="#3B82F6" />
                </View>
                <View style={styles.settingTextGroup}>
                  <Text style={[styles.settingLabel, dynamicStyles.text]}>Nearby Police</Text>
                  <Text style={[styles.settingDescription, dynamicStyles.textSecondary]}>Find police stations & patrols</Text>
                </View>
              </View>
              <ToggleSwitch
                value={nearbyPolice}
                onValueChange={() => setNearbyPolice(!nearbyPolice)}
              />
            </View>

            {/* Nearby Ambulance */}
            <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
              <View style={styles.settingInfo}>
                <View style={[styles.settingIconCircle, { backgroundColor: theme.isDark ? '#450A0A' : '#FEF2F2' }]}>
                  <AmbulanceIcon size={18} color="#EF4444" />
                </View>
                <View style={styles.settingTextGroup}>
                  <Text style={[styles.settingLabel, dynamicStyles.text]}>Nearby Ambulance</Text>
                  <Text style={[styles.settingDescription, dynamicStyles.textSecondary]}>Find hospitals & ambulances</Text>
                </View>
              </View>
              <ToggleSwitch
                value={nearbyAmbulance}
                onValueChange={() => setNearbyAmbulance(!nearbyAmbulance)}
              />
            </View>

            {/* Nearby Fire */}
            <View style={styles.settingItemLast}>
              <View style={styles.settingInfo}>
                <View style={[styles.settingIconCircle, { backgroundColor: theme.isDark ? '#431407' : '#FFF7ED' }]}>
                  <FireIcon size={18} color="#F97316" />
                </View>
                <View style={styles.settingTextGroup}>
                  <Text style={[styles.settingLabel, dynamicStyles.text]}>Nearby Fire Station</Text>
                  <Text style={[styles.settingDescription, dynamicStyles.textSecondary]}>Find fire stations nearby</Text>
                </View>
              </View>
              <ToggleSwitch
                value={nearbyFire}
                onValueChange={() => setNearbyFire(!nearbyFire)}
              />
            </View>
          </View>
        </View>

        {/* General Settings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <GearIcon size={16} color={theme.colors.textTertiary} />
            <Text style={[styles.sectionTitle, dynamicStyles.text]}>General</Text>
          </View>

          <View style={[styles.settingsCard, dynamicStyles.card]}>
            {/* Push Notifications */}
            <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIcon}>
                  <BellIcon size={18} color={theme.colors.textTertiary} />
                </View>
                <Text style={[styles.settingLabel, dynamicStyles.text]}>Push Notifications</Text>
              </View>
              <ToggleSwitch
                value={pushNotifications}
                onValueChange={() => setPushNotifications(!pushNotifications)}
              />
            </View>

            {/* Dark Mode */}
            <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIcon}>
                  <MoonIcon size={18} color={isDarkMode ? '#D97706' : theme.colors.textTertiary} />
                </View>
                <Text style={[styles.settingLabel, dynamicStyles.text]}>Dark Mode</Text>
              </View>
              <ToggleSwitch value={isDarkMode} onValueChange={toggleDarkMode} />
            </View>

            {/* Text Size */}
            <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.colors.border }]} activeOpacity={0.7}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIcon}>
                  <FontIcon size={18} color={theme.colors.textTertiary} />
                </View>
                <Text style={[styles.settingLabel, dynamicStyles.text]}>Text Size</Text>
              </View>
              <View style={styles.settingValue}>
                <Text style={[styles.settingValueText, dynamicStyles.textSecondary]}>Medium</Text>
                <ChevronRightIcon size={12} color={theme.colors.borderMedium} />
              </View>
            </TouchableOpacity>

            {/* Biometric Authentication */}
            <View style={styles.settingItemLast}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIcon}>
                  <FingerprintIcon size={18} color={biometricAvailable ? theme.colors.success : theme.colors.textTertiary} />
                </View>
                <View style={styles.settingTextGroup}>
                  <Text style={[styles.settingLabel, dynamicStyles.text]}>{biometricType} Login</Text>
                  <Text style={[styles.settingDescription, dynamicStyles.textSecondary]}>
                    {biometricAvailable ? 'Use fingerprint to unlock app' : 'Not available on this device'}
                  </Text>
                </View>
              </View>
              <ToggleSwitch 
                value={biometricEnabled} 
                onValueChange={handleBiometricToggle}
                disabled={!biometricAvailable}
              />
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrashIcon size={16} color={theme.colors.error} />
            <Text style={[styles.sectionTitle, { color: theme.colors.error }]}>Account</Text>
          </View>

          <View style={[styles.settingsCard, dynamicStyles.card]}>
            <TouchableOpacity 
              style={styles.deleteAccountButton} 
              onPress={handleDeleteAccount}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.settingIconCircle, { backgroundColor: theme.isDark ? '#450A0A' : '#FEE2E2' }]}>
                  <TrashIcon size={18} color={theme.colors.error} />
                </View>
                <View style={styles.settingTextGroup}>
                  <Text style={[styles.settingLabel, { color: theme.colors.error }]}>Delete Account</Text>
                  <Text style={[styles.settingDescription, dynamicStyles.textSecondary]}>Permanently remove your account and data</Text>
                </View>
              </View>
              <ChevronRightIcon size={12} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Help Text */}
        <View style={styles.helpSection}>
          <Text style={[styles.helpText, dynamicStyles.textSecondary]}>
            EGOV-CITIZEN Version 1.0.2{'\n'}
            Need help? <Text style={styles.helpLink}>Contact Support</Text>
          </Text>
        </View>

        {/* Bottom spacing for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <View style={styles.deleteModalIcon}>
              <WarningIcon size={48} color="#EF4444" />
            </View>
            
            <Text style={styles.deleteModalTitle}>
              {deleteConfirmStep === 1 ? 'Delete Account?' : 'Are you absolutely sure?'}
            </Text>
            
            <Text style={styles.deleteModalMessage}>
              {deleteConfirmStep === 1 
                ? 'This action cannot be undone. All your data, reports, and emergency contacts will be permanently removed.'
                : 'Your account will be scheduled for deletion. You have 7 days to cancel by logging in again.'}
            </Text>

            {deleteConfirmStep === 2 && (
              <View style={styles.deleteWarningBox}>
                <Text style={styles.deleteWarningText}>
                  ⚠️ Your account will be deleted within 7 days. Log in again to cancel.
                </Text>
              </View>
            )}

            <View style={styles.deleteModalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmDeleteButton}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.confirmDeleteButtonText}>
                  {deleteConfirmStep === 1 ? 'Yes, Delete' : 'Confirm Deletion'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Floating Action Button - Test Sound */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <VolumeHighIcon size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <ConfirmationModal
        visible={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          navigation.goBack();
        }}
        type="success"
        title="Settings Saved!"
        message="Your language and notification settings have been updated successfully."
        actionText="Done"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B45309',
  },
  mainContent: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  languageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  languageInfoBanner: {
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FED7AA',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  languageInfoText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
    flex: 1,
  },
  languageList: {},
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  languageItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  languageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  languageIconDefault: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  languageIconLocal: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
  },
  languageInitials: {
    fontSize: 12,
    fontWeight: '700',
  },
  languageInitialsDefault: {
    color: '#6B7280',
  },
  languageInitialsLocal: {
    color: '#B45309',
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  languageSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  languageControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  playButtonActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFEDD5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  playButtonInactive: {
    backgroundColor: '#F9FAFB',
    borderColor: '#F3F4F6',
  },
  // Toggle Switch Styles
  toggleTrack: {
    width: 40,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    padding: 2,
  },
  toggleTrackOn: {
    backgroundColor: '#B45309',
  },
  toggleTrackOff: {
    backgroundColor: '#E5E7EB',
  },
  toggleDisabled: {
    opacity: 0.6,
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  toggleThumbOff: {
    alignSelf: 'flex-start',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingItemLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  settingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  settingTextGroup: {
    flex: 1,
  },
  settingDescription: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  settingIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValueText: {
    fontSize: 14,
    color: '#6B7280',
  },
  helpSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  helpLink: {
    color: '#B45309',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: '#B45309',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  deleteAccountButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  deleteModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  deleteModalIcon: {
    marginBottom: 16,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  deleteModalMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  deleteWarningBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    width: '100%',
  },
  deleteWarningText: {
    fontSize: 13,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 20,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  confirmDeleteButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },
  confirmDeleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SettingsLanguageScreen;
