import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';

type EmergencyServiceScreenProps = {
  serviceType: 'police' | 'fire' | 'ambulance';
};

type RouteParams = {
  params: EmergencyServiceScreenProps;
};

const EmergencyServiceScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { theme, isDarkMode } = useTheme();
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const { serviceType } = route.params || { serviceType: 'police' };

  const [selectedLocation, setSelectedLocation] = useState<'current' | 'home'>('current');
  const [sosEnabled, setSosEnabled] = useState(false);
  const [message, setMessage] = useState('');

  const serviceConfig = {
    police: {
      title: 'Police Assistance',
      icon: 'shield',
      color: '#3B82F6',
      description: 'Request police support for security incidents',
    },
    fire: {
      title: 'Fire Emergency',
      icon: 'fire',
      color: '#EF4444',
      description: 'Report fire incidents and request fire services',
    },
    ambulance: {
      title: 'Medical Emergency',
      icon: 'heart',
      color: '#10B981',
      description: 'Request immediate medical assistance',
    },
  };

  const config = serviceConfig[serviceType];

  const handleSendEmergency = () => {
    console.log('Sending emergency:', {
      serviceType,
      location: selectedLocation,
      sosEnabled,
      message,
    });
    // Navigate to Emergency Countdown
    navigation.navigate('EmergencyCountdown');
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  // Icons
  const ArrowLeftIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M19 12H5M12 19l-7-7 7-7" />
    </Svg>
  );

  const ShieldIcon = () => (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );

  const FireIcon = () => (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M8.5 14.5A2.5 2.5 0 0 0 11 17a6 6 0 1 0 0-12c-1.38 0-2.63.56-3.54 1.46a7 7 0 0 0-.95.95 2.5 2.5 0 1 0-3.53 3.53L8.5 14.5z" />
    </Svg>
  );

  const HeartIcon = () => (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </Svg>
  );

  const MapPinIcon = ({ active }: { active?: boolean }) => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={active ? "#FFFFFF" : "#6B7280"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <Circle cx="12" cy="10" r="3" />
    </Svg>
  );

  const HomeIcon = ({ active }: { active?: boolean }) => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={active ? "#FFFFFF" : "#6B7280"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Path d="M9 22V12h6v10" />
    </Svg>
  );

  const AlertIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 8v4M12 16h.01" />
    </Svg>
  );

  const MessageIcon = () => (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </Svg>
  );

  const SendIcon = () => (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </Svg>
  );

  const renderServiceIcon = () => {
    switch (serviceType) {
      case 'police':
        return <ShieldIcon />;
      case 'fire':
        return <FireIcon />;
      case 'ambulance':
        return <HeartIcon />;
      default:
        return <ShieldIcon />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: config.color }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{config.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAwareScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={Platform.OS === 'ios' ? 100 : 120}
          keyboardOpeningTime={0}
        >

          {/* Service Icon */}
          <View style={styles.iconSection}>
            <View style={[styles.iconCircle, { borderColor: config.color }]}>
              {renderServiceIcon()}
            </View>
            <Text style={styles.serviceTitle}>{config.title}</Text>
            <Text style={styles.serviceDescription}>{config.description}</Text>
          </View>

          {/* Location Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Location</Text>
            <View style={styles.locationOptions}>
              <TouchableOpacity
                style={[
                  styles.locationOption,
                  selectedLocation === 'current' && styles.locationOptionActive,
                ]}
                onPress={() => setSelectedLocation('current')}
                activeOpacity={0.7}
              >
                <View style={styles.locationIconCircle}>
                  <MapPinIcon active={selectedLocation === 'current'} />
                </View>
                <View style={styles.locationInfo}>
                  <Text style={[
                    styles.locationTitle,
                    selectedLocation === 'current' && styles.locationTitleActive,
                  ]}>
                    Current Location
                  </Text>
                  <Text style={styles.locationAddress}>12 Kairaba Ave, Serrekunda</Text>
                </View>
                {selectedLocation === 'current' && (
                  <View style={styles.selectedBadge}>
                    <View style={styles.selectedDot} />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.locationOption,
                  selectedLocation === 'home' && styles.locationOptionActive,
                ]}
                onPress={() => setSelectedLocation('home')}
                activeOpacity={0.7}
              >
                <View style={styles.locationIconCircle}>
                  <HomeIcon active={selectedLocation === 'home'} />
                </View>
                <View style={styles.locationInfo}>
                  <Text style={[
                    styles.locationTitle,
                    selectedLocation === 'home' && styles.locationTitleActive,
                  ]}>
                    Home Address
                  </Text>
                  <Text style={styles.locationAddress}>28 Bakau New Town</Text>
                </View>
                {selectedLocation === 'home' && (
                  <View style={styles.selectedBadge}>
                    <View style={styles.selectedDot} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* SOS Toggle */}
          <View style={styles.section}>
            <View style={styles.sosHeader}>
              <View style={styles.sosLabelRow}>
                <AlertIcon />
                <Text style={styles.sectionTitle}>Enable SOS Alert</Text>
              </View>
              <Switch
                value={sosEnabled}
                onValueChange={setSosEnabled}
                trackColor={{ false: '#D1D5DB', true: '#FCA5A5' }}
                thumbColor={sosEnabled ? '#DC2626' : '#F3F4F6'}
                ios_backgroundColor="#D1D5DB"
              />
            </View>
            <Text style={styles.sosDescription}>
              When enabled, this will trigger a full SOS alert and notify all your emergency contacts
            </Text>
          </View>

          {/* Message Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Message (Optional)</Text>
            <View style={styles.messageContainer}>
              <View style={styles.messageIcon}>
                <MessageIcon />
              </View>
              <TextInput
                style={styles.messageInput}
                placeholder="Describe the situation..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={message}
                onChangeText={setMessage}
              />
            </View>
            <Text style={styles.helperText}>
              This message will be sent to emergency responders
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: config.color }]}
              onPress={handleSendEmergency}
              activeOpacity={0.9}
            >
              <Text style={styles.sendButtonText}>Send Request</Text>
              <SendIcon />
            </TouchableOpacity>
          </View>

        </KeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 16,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  locationOptions: {
    gap: 12,
  },
  locationOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  locationOptionActive: {
    borderColor: '#B45309',
    backgroundColor: '#FFF7ED',
  },
  locationIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  locationTitleActive: {
    color: '#B45309',
  },
  locationAddress: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#B45309',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  sosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sosLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sosDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  messageContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 12,
    minHeight: 120,
  },
  messageIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  messageInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    padding: 0,
  },
  helperText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    marginLeft: 4,
  },
  buttonSection: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  sendButton: {
    flex: 2,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EmergencyServiceScreen;
