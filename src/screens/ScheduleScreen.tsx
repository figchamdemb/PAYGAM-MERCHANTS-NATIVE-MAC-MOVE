/**
 * ScheduleScreen - Safety & Emergency Hub
 * 
 * Combined screen for:
 * 1. "Are You OK?" Scheduler - Elderly safety check-ins
 * 2. Emergency Contacts Management
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  Alert,
  Modal,
  FlatList,
  PermissionsAndroid,
  Linking,
  NativeModules,
} from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import DatePicker from 'react-native-date-picker';
import { useTheme } from '../context/ThemeContext';

// Get the native SelectContact module directly
const { SelectContact } = NativeModules;

// SVG Icons
const ClockIcon = ({ size = 24, color = '#B45309' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);

const BellAlertIcon = ({ size = 20, color = '#B45309' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
  </Svg>
);

const UserHeartIcon = ({ size = 20, color = '#DC2626' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </Svg>
);

const LocationIcon = ({ size = 18, color = '#059669' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </Svg>
);

const PhoneIcon = ({ size = 18, color = '#1E40AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </Svg>
);

const PlusIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5}>
    <Path d="M12 5v14M5 12h14" />
  </Svg>
);

const TrashIcon = ({ size = 16, color = '#DC2626' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </Svg>
);

const InfoCircleIcon = ({ size = 14, color = '#B45309' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </Svg>
);

const ContactsIcon = ({ size = 20, color = '#1E40AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </Svg>
);

const EditIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </Svg>
);

// Custom Toggle Switch
interface ToggleSwitchProps {
  value: boolean;
  onValueChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ value, onValueChange }) => (
  <TouchableOpacity
    onPress={onValueChange}
    activeOpacity={0.8}
    style={[styles.toggleTrack, value ? styles.toggleTrackOn : styles.toggleTrackOff]}
  >
    <View style={[styles.toggleThumb, value ? styles.toggleThumbOn : styles.toggleThumbOff]} />
  </TouchableOpacity>
);

interface ScheduleItem {
  id: string;
  time: string;
  days: string[];
  enabled: boolean;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

const ScheduleScreen: React.FC = () => {
  const { theme } = useTheme();
  
  // Are You OK Scheduler states
  const [isEnabled, setIsEnabled] = useState(true);
  const [responseTimeout, setResponseTimeout] = useState('5');
  const [includeLocation, setIncludeLocation] = useState(true);
  
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    { id: '1', time: '08:00 AM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], enabled: true },
    { id: '2', time: '02:00 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], enabled: true },
    { id: '3', time: '08:00 PM', days: ['Sat', 'Sun'], enabled: false },
  ]);

  // Emergency Contacts states
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'Fatou Jallow', phone: '+220 7123456', relationship: 'Daughter' },
    { id: '2', name: 'Modou Sanneh', phone: '+220 3654321', relationship: 'Son' },
  ]);

  // Time Picker Modal State
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  // Days Picker Modal State
  const [showDaysPicker, setShowDaysPicker] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Contact Picker Modal State
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [phoneContacts, setPhoneContacts] = useState<{id: string, name: string, phone: string}[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  const toggleSchedule = (id: string) => {
    setSchedules(prev => prev.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const deleteSchedule = (id: string) => {
    Alert.alert('Delete Schedule', 'Remove this check-in time?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        setSchedules(prev => prev.filter(s => s.id !== id));
      }},
    ]);
  };

  const addSchedule = () => {
    // Open time picker for new schedule
    setEditingScheduleId(null);
    setSelectedTime(new Date());
    setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    setShowTimePicker(true);
  };

  const handleTimeConfirm = (date: Date) => {
    setShowTimePicker(false);
    setSelectedTime(date);
    // After selecting time, show days picker
    setShowDaysPicker(true);
  };

  const handleDaysConfirm = () => {
    setShowDaysPicker(false);
    
    const hours = selectedTime.getHours();
    const minutes = selectedTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const timeString = `${formattedHours.toString().padStart(2, '0')}:${formattedMinutes} ${ampm}`;

    if (editingScheduleId) {
      // Update existing schedule
      setSchedules(prev => prev.map(s => 
        s.id === editingScheduleId ? { ...s, time: timeString, days: selectedDays } : s
      ));
    } else {
      // Add new schedule
      const newSchedule: ScheduleItem = {
        id: Date.now().toString(),
        time: timeString,
        days: [...selectedDays],
        enabled: true,
      };
      setSchedules(prev => [...prev, newSchedule]);
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const editSchedule = (schedule: ScheduleItem) => {
    // Parse existing time
    const [time, period] = schedule.time.split(' ');
    const [hourStr, minStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const min = parseInt(minStr, 10);
    
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    const date = new Date();
    date.setHours(hour, min, 0, 0);
    
    setEditingScheduleId(schedule.id);
    setSelectedTime(date);
    setSelectedDays([...schedule.days]);
    setShowTimePicker(true);
  };

  const deleteContact = (id: string) => {
    Alert.alert('Remove Contact', 'Remove this emergency contact?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => {
        setContacts(prev => prev.filter(c => c.id !== id));
      }},
    ]);
  };

  const requestContactsPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
        if (granted) {
          return true;
        }

        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission',
            message: 'This app needs access to your contacts to add emergency contacts.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          }
        );
        
        if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
            'Permission Required',
            'Contacts permission was denied. Please enable it in Settings > Apps > EGOV-CITIZEN > Permissions.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
          return false;
        }
        
        return result === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const addContact = async () => {
    try {
      const hasPermission = await requestContactsPermission();
      
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Cannot access contacts without permission.');
        return;
      }

      console.log('Opening contact picker directly via NativeModules...');
      
      // Use native module directly to avoid the "twice" issue
      // This opens the native Android contact picker
      const contact = await SelectContact.openContactSelection();
      
      console.log('Contact selection result:', contact);
      
      if (!contact) {
        console.log('User cancelled contact picker');
        return;
      }

      // Get first phone number from the contact
      const phones = contact.phones || [];
      if (phones.length === 0) {
        Alert.alert('No Phone Number', `${contact.name} does not have a phone number.`);
        return;
      }

      const phoneNumber = phones[0]?.number || '';
      const displayName = contact?.name || 'Unknown';

      if (!phoneNumber) {
        Alert.alert('No Phone Number', 'The selected contact does not have a phone number.');
        return;
      }

      // Check if already exists
      if (contacts.find(c => c.phone === phoneNumber)) {
        Alert.alert('Already Added', 'This contact is already in your emergency contacts.');
        return;
      }
        
      const newContact: EmergencyContact = {
        id: Date.now().toString(),
        name: displayName,
        phone: phoneNumber,
        relationship: 'Family',
      };
        
      setContacts(prev => [...prev, newContact]);
      Alert.alert('Contact Added', `${displayName} has been added to your emergency contacts.`);
    } catch (error: any) {
      console.error('Contact picker error:', error);
      // Check if user just cancelled
      if (error?.code === 'E_CONTACT_CANCELLED') {
        console.log('User cancelled');
        return;
      }
      Alert.alert('Error', `Failed to open contacts: ${error?.message || 'Unknown error'}`);
    }
  };

  const selectContact = (contact: {id: string, name: string, phone: string}) => {
    // Check if already exists
    if (contacts.find(c => c.phone === contact.phone)) {
      Alert.alert('Already Added', 'This contact is already in your emergency contacts.');
      return;
    }

    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: contact.name,
      phone: contact.phone,
      relationship: 'Family',
    };
    setContacts(prev => [...prev, newContact]);
    setShowContactPicker(false);
    Alert.alert('Contact Added', `${contact.name} has been added to your emergency contacts.`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={[styles.scrollView, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>
        {/* Header Banner */}
        <View style={[styles.headerBanner, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.headerIconBg}>
            <UserHeartIcon size={28} color="#DC2626" />
          </View>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Safety & Emergency Hub</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
              Manage check-ins & emergency contacts
            </Text>
          </View>
        </View>

        {/* ===== ARE YOU OK? SECTION ===== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BellAlertIcon size={18} color="#B45309" />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Are You OK? Check-in</Text>
          </View>

          {/* Main Toggle */}
          <View style={[styles.mainToggleCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={styles.mainToggleInfo}>
              <Text style={[styles.mainToggleTitle, { color: theme.colors.text }]}>Enable Check-ins</Text>
              <Text style={styles.mainToggleSubtitle}>
                {isEnabled ? 'Active - Alerts scheduled' : 'Disabled'}
              </Text>
            </View>
            <ToggleSwitch value={isEnabled} onValueChange={() => setIsEnabled(!isEnabled)} />
          </View>

          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <InfoCircleIcon size={14} color="#B45309" />
            <Text style={styles.infoBannerText}>
              If you don't respond "I'm OK" within {responseTimeout} min, an alert with your location is sent to your contacts.
            </Text>
          </View>

          {/* Response Timeout */}
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Response timeout</Text>
              <View style={styles.timeoutWrapper}>
                <TextInput
                  style={styles.timeoutInput}
                  value={responseTimeout}
                  onChangeText={setResponseTimeout}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.timeoutUnit}>min</Text>
              </View>
            </View>
            <View style={styles.settingRowLast}>
              <View style={styles.settingLabelRow}>
                <LocationIcon size={16} color="#059669" />
                <Text style={styles.settingLabel}>Include location</Text>
              </View>
              <ToggleSwitch value={includeLocation} onValueChange={() => setIncludeLocation(!includeLocation)} />
            </View>
          </View>

          {/* Scheduled Times */}
          <View style={styles.subsectionHeader}>
            <Text style={styles.subsectionTitle}>Scheduled Times</Text>
            <TouchableOpacity style={styles.addBtn} onPress={addSchedule}>
              <PlusIcon size={12} color="#FFFFFF" />
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {schedules.map((schedule, index) => (
              <View key={schedule.id} style={[styles.scheduleRow, index < schedules.length - 1 && styles.borderBottom]}>
                <View style={styles.scheduleInfo}>
                  <View style={styles.scheduleTimeRow}>
                    <ClockIcon size={16} color={schedule.enabled ? '#B45309' : '#9CA3AF'} />
                    <Text style={[styles.scheduleTime, !schedule.enabled && styles.textDisabled]}>
                      {schedule.time}
                    </Text>
                  </View>
                  <Text style={styles.scheduleDays}>{schedule.days.join(', ')}</Text>
                </View>
                <View style={styles.scheduleActions}>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteSchedule(schedule.id)}>
                    <TrashIcon size={14} color="#DC2626" />
                  </TouchableOpacity>
                  <ToggleSwitch value={schedule.enabled} onValueChange={() => toggleSchedule(schedule.id)} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ===== EMERGENCY CONTACTS SECTION ===== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ContactsIcon size={18} color="#1E40AF" />
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          </View>

          <View style={styles.infoBannerBlue}>
            <InfoCircleIcon size={14} color="#1E40AF" />
            <Text style={styles.infoBannerTextBlue}>
              These contacts receive an SMS alert with your location if you miss a check-in.
            </Text>
          </View>

          <View style={styles.subsectionHeader}>
            <Text style={styles.subsectionTitle}>Your Contacts</Text>
            <TouchableOpacity style={styles.addBtnBlue} onPress={addContact}>
              <PlusIcon size={12} color="#FFFFFF" />
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {contacts.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No emergency contacts added</Text>
              </View>
            ) : (
              contacts.map((contact, index) => (
                <View key={contact.id} style={[styles.contactRow, index < contacts.length - 1 && styles.borderBottom]}>
                  <View style={styles.contactAvatar}>
                    <Text style={styles.contactInitials}>
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <View style={styles.contactPhoneRow}>
                      <PhoneIcon size={12} color="#6B7280" />
                      <Text style={styles.contactPhone}>{contact.phone}</Text>
                    </View>
                    <Text style={styles.contactRelation}>{contact.relationship}</Text>
                  </View>
                  <View style={styles.contactActions}>
                    <TouchableOpacity style={styles.editBtn}>
                      <EditIcon size={14} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteContact(contact.id)}>
                      <TrashIcon size={14} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Time Picker Modal */}
      <DatePicker
        modal
        open={showTimePicker}
        date={selectedTime}
        mode="time"
        title="Select Check-in Time"
        confirmText="Next"
        cancelText="Cancel"
        onConfirm={handleTimeConfirm}
        onCancel={() => setShowTimePicker(false)}
      />

      {/* Days Picker Modal */}
      <Modal
        visible={showDaysPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDaysPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.daysPickerModal}>
            <Text style={styles.daysPickerTitle}>Select Days</Text>
            <Text style={styles.daysPickerSubtitle}>Choose which days to receive check-in alerts</Text>
            
            <View style={styles.daysGrid}>
              {allDays.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayChip,
                    selectedDays.includes(day) && styles.dayChipSelected,
                  ]}
                  onPress={() => toggleDay(day)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.dayChipText,
                    selectedDays.includes(day) && styles.dayChipTextSelected,
                  ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.daysPickerButtons}>
              <TouchableOpacity 
                style={styles.daysPickerCancelBtn}
                onPress={() => setShowDaysPicker(false)}
              >
                <Text style={styles.daysPickerCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.daysPickerConfirmBtn, selectedDays.length === 0 && styles.daysPickerConfirmDisabled]}
                onPress={handleDaysConfirm}
                disabled={selectedDays.length === 0}
              >
                <Text style={styles.daysPickerConfirmText}>Save Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Contact Picker Modal */}
      <Modal
        visible={showContactPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowContactPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.contactPickerModal}>
            <View style={styles.contactPickerHeader}>
              <Text style={styles.contactPickerTitle}>Select Contact</Text>
              <TouchableOpacity onPress={() => setShowContactPicker(false)}>
                <Text style={styles.contactPickerClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {loadingContacts ? (
              <View style={styles.contactPickerLoading}>
                <Text style={styles.contactPickerLoadingText}>Loading contacts...</Text>
              </View>
            ) : (
              <FlatList
                data={phoneContacts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.contactPickerItem}
                    onPress={() => selectContact(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.contactPickerAvatar}>
                      <Text style={styles.contactPickerInitials}>
                        {item.name.split(' ').map(n => n[0]).join('')}
                      </Text>
                    </View>
                    <View style={styles.contactPickerInfo}>
                      <Text style={styles.contactPickerName}>{item.name}</Text>
                      <Text style={styles.contactPickerPhone}>{item.phone}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  headerBanner: {
    backgroundColor: '#FEF2F2',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  headerIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#991B1B',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#B91C1C',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  mainToggleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  mainToggleInfo: {
    flex: 1,
  },
  mainToggleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  mainToggleSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  infoBanner: {
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  infoBannerText: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
    flex: 1,
  },
  infoBannerBlue: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoBannerTextBlue: {
    fontSize: 11,
    color: '#1E40AF',
    lineHeight: 16,
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  settingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingLabel: {
    fontSize: 13,
    color: '#374151',
  },
  timeoutWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeoutInput: {
    width: 36,
    height: 32,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#B45309',
  },
  timeoutUnit: {
    fontSize: 12,
    color: '#6B7280',
  },
  subsectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  subsectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#B45309',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  addBtnBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1E40AF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  addBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scheduleTime: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  textDisabled: {
    color: '#9CA3AF',
  },
  scheduleDays: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    marginLeft: 22,
  },
  scheduleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInitials: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  contactPhoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  contactPhone: {
    fontSize: 11,
    color: '#6B7280',
  },
  contactRelation: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 1,
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  // Toggle styles
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  daysPickerModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 340,
  },
  daysPickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  daysPickerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dayChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dayChipSelected: {
    backgroundColor: '#B45309',
    borderColor: '#B45309',
  },
  dayChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  dayChipTextSelected: {
    color: '#FFFFFF',
  },
  daysPickerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  daysPickerCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  daysPickerCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  daysPickerConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#B45309',
    alignItems: 'center',
  },
  daysPickerConfirmDisabled: {
    backgroundColor: '#D1D5DB',
  },
  daysPickerConfirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactPickerModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    maxHeight: '70%',
    position: 'absolute',
    bottom: 0,
    paddingBottom: 40,
  },
  contactPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  contactPickerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  contactPickerClose: {
    fontSize: 24,
    color: '#6B7280',
    padding: 4,
  },
  contactPickerLoading: {
    padding: 40,
    alignItems: 'center',
  },
  contactPickerLoadingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  contactPickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactPickerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactPickerInitials: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E40AF',
  },
  contactPickerInfo: {
    flex: 1,
  },
  contactPickerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  contactPickerPhone: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
});

export default ScheduleScreen;
