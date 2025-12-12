import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Svg, Path, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';

type Contact = {
  id: string;
  name: string;
  phone: string;
  initials: string;
  color: string;
};

const EmergencyContactsScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { theme, isDarkMode } = useTheme();
  const [emergencyMessage, setEmergencyMessage] = useState('I need help');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [countdownTime, setCountdownTime] = useState(45);
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Meeee Chamma', phone: '+220 123 4567', initials: 'MC', color: '#FED7AA' },
    { id: '2', name: 'Sarah Johnson', phone: '+1 345 678 9012', initials: 'SJ', color: '#DBEAFE' },
  ]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDeleteContact = (id: string) => {
    Alert.alert('Delete Contact', 'Remove this emergency contact?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: () => {
          setContacts(contacts.filter(c => c.id !== id));
        }
      },
    ]);
  };

  const handleAddContact = () => {
    Alert.alert('Add Contact', 'Contact picker would open here');
  };

  const handleStartCountdown = () => {
    navigation.navigate('EmergencyCountdown');
  };

  // Icons
  const ArrowLeftIcon = () => (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M19 12H5M12 19l-7-7 7-7" />
    </Svg>
  );

  const InfoIcon = () => (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 16v-4M12 8h.01" />
    </Svg>
  );

  const TrashIcon = () => (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </Svg>
  );

  const PlusIcon = () => (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 5v14M5 12h14" />
    </Svg>
  );

  const PenIcon = () => (
    <Svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </Svg>
  );

  const AlertTriangleIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <Path d="M12 9v4M12 17h.01" />
    </Svg>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeftIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Emergency Contacts</Text>
        </View>
        <TouchableOpacity style={styles.infoButton}>
          <InfoIcon />
        </TouchableOpacity>
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

          {/* Contact List Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>TRUSTED CONTACTS</Text>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>{contacts.length} Active</Text>
              </View>
            </View>

            <View style={styles.contactsList}>
              {contacts.map((contact) => (
                <View key={contact.id} style={styles.contactCard}>
                  <View style={styles.contactInfo}>
                    <View style={[styles.avatar, { backgroundColor: contact.color }]}>
                      <Text style={styles.avatarText}>{contact.initials}</Text>
                    </View>
                    <View>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactPhone}>{contact.phone}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteContact(contact.id)}
                  >
                    <TrashIcon />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
              <PlusIcon />
              <Text style={styles.addButtonText}>Add New Contact</Text>
            </TouchableOpacity>
          </View>

          {/* Message Configuration */}
          <View style={styles.section}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Emergency Message</Text>
              <View style={styles.textareaContainer}>
                <TextInput
                  style={styles.textarea}
                  value={emergencyMessage}
                  onChangeText={setEmergencyMessage}
                  multiline
                  numberOfLines={2}
                />
                <View style={styles.penIcon}>
                  <PenIcon />
                </View>
              </View>
              <Text style={styles.helperText}>This message will be sent immediately.</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Additional Details (Optional)</Text>
              <TextInput
                style={[styles.textarea, styles.textareaLarge]}
                placeholder="E.g., I am at the market, feeling dizzy..."
                placeholderTextColor="#9CA3AF"
                value={additionalDetails}
                onChangeText={setAdditionalDetails}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Countdown Settings */}
          <View style={styles.section}>
            <Text style={styles.label}>Countdown Timer</Text>
            <View style={styles.countdownCard}>
              <View style={styles.countdownButtons}>
                {[5, 10, 30, 45].map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.countdownButton,
                      countdownTime === time && styles.countdownButtonActive,
                    ]}
                    onPress={() => setCountdownTime(time)}
                  >
                    <Text style={[
                      styles.countdownButtonText,
                      countdownTime === time && styles.countdownButtonTextActive,
                    ]}>
                      {time}s
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.countdownHelperText}>
                Time to cancel before message is sent.
              </Text>
            </View>
          </View>

        </KeyboardAwareScrollView>
      </SafeAreaView>

      {/* Bottom Action Bar */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            Ready to send to <Text style={styles.footerTextBold}>{contacts.length} contacts</Text>
          </Text>
          <View style={styles.delayBadge}>
            <Text style={styles.delayBadgeText}>{countdownTime}s Delay</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleStartCountdown}
          activeOpacity={0.9}
        >
          <AlertTriangleIcon />
          <Text style={styles.emergencyButtonText}>Start Emergency Countdown</Text>
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
    backgroundColor: '#B45309',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  infoButton: {
    padding: 8,
    borderRadius: 20,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 160,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  activeBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
  },
  contactsList: {
    gap: 12,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B45309',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 12,
    color: '#6B7280',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    marginTop: 16,
    width: '100%',
    paddingVertical: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(180, 83, 9, 0.3)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#B45309',
    fontSize: 16,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  textareaContainer: {
    position: 'relative',
  },
  textarea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    fontSize: 14,
    color: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    minHeight: 60,
  },
  textareaLarge: {
    minHeight: 90,
  },
  penIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    marginLeft: 4,
  },
  countdownCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  countdownButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  countdownButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  countdownButtonActive: {
    backgroundColor: '#B45309',
    shadowColor: '#FED7AA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    transform: [{ scale: 1.05 }],
  },
  countdownButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  countdownButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  countdownHelperText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    padding: 16,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
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
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  footerTextBold: {
    fontWeight: '700',
    color: '#1F2937',
  },
  delayBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  delayBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
  },
  emergencyButton: {
    backgroundColor: '#DC2626',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#FCA5A5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default EmergencyContactsScreen;
