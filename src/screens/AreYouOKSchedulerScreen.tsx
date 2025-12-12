/**
 * AreYouOKSchedulerScreen - Elderly Safety Check-in Scheduler
 * 
 * This feature allows elderly users or their caretakers to set up scheduled
 * "Are You OK?" alerts. If the user doesn't respond within 5 minutes,
 * an automatic help message with location is sent to emergency contacts.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
  TextInput,
  Alert,
  Modal,
  FlatList,
  PermissionsAndroid,
  Linking,
  NativeModules,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { Svg, Path, Circle } from 'react-native-svg';
import ConfirmationModal from '../components/ConfirmationModal';
import DatePicker from 'react-native-date-picker';

// Get the native SelectContact module directly
const { SelectContact } = NativeModules;

// SVG Icons
const ArrowLeftIcon = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

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

const MessageIcon = ({ size = 18, color = '#7C3AED' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
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

const CheckIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3}>
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

const InfoCircleIcon = ({ size = 14, color = '#B45309' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
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

const AreYouOKSchedulerScreen: React.FC = () => {
  const navigation = useNavigation();

  // Scheduler enabled
  const [isEnabled, setIsEnabled] = useState(true);

  // Response timeout (minutes)
  const [responseTimeout, setResponseTimeout] = useState('5');

  // Include location in alert
  const [includeLocation, setIncludeLocation] = useState(true);

  // Time picker state
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  // Days picker state
  const [showDaysPicker, setShowDaysPicker] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Contact picker state
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [phoneContacts, setPhoneContacts] = useState<{id: string, name: string, phone: string}[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  // Scheduled check-ins
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    { id: '1', time: '08:00 AM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], enabled: true },
    { id: '2', time: '02:00 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], enabled: true },
    { id: '3', time: '08:00 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], enabled: false },
  ]);

  // Emergency contacts
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'Fatou Jallow', phone: '+220 7123456', relationship: 'Daughter' },
    { id: '2', name: 'Modou Sanneh', phone: '+220 3654321', relationship: 'Son' },
  ]);

  const toggleSchedule = (id: string) => {
    setSchedules(prev => prev.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const deleteSchedule = (id: string) => {
    Alert.alert(
      'Delete Schedule',
      'Are you sure you want to delete this check-in schedule?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          setSchedules(prev => prev.filter(s => s.id !== id));
        }},
      ]
    );
  };

  const deleteContact = (id: string) => {
    Alert.alert(
      'Remove Contact',
      'Are you sure you want to remove this emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => {
          setContacts(prev => prev.filter(c => c.id !== id));
        }},
      ]
    );
  };

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSave = () => {
    // Show confirmation modal
    setShowConfirmation(true);
  };

  const handleConfirmClose = () => {
    setShowConfirmation(false);
    navigation.goBack();
  };

  const handleAddSchedule = () => {
    // Open time picker for new schedule
    setEditingScheduleId(null);
    setSelectedTime(new Date());
    setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    setShowTimePicker(true);
  };

  const handleTimeConfirm = (date: Date) => {
    setShowTimePicker(false);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const timeString = `${formattedHours.toString().padStart(2, '0')}:${formattedMinutes} ${ampm}`;
    
    // Show days picker after selecting time
    setSelectedTime(date);
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
      // Editing existing schedule
      setSchedules(prev => prev.map(s => 
        s.id === editingScheduleId ? { ...s, time: timeString, days: selectedDays } : s
      ));
    } else {
      // Adding new schedule
      const newSchedule: ScheduleItem = {
        id: Date.now().toString(),
        time: timeString,
        days: selectedDays,
        enabled: true,
      };
      setSchedules(prev => [...prev, newSchedule]);
    }
  };

  const handleEditScheduleTime = (schedule: ScheduleItem) => {
    // Parse time string to Date
    const [time, ampm] = schedule.time.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hour24 = hours;
    if (ampm === 'PM' && hours !== 12) hour24 += 12;
    if (ampm === 'AM' && hours === 12) hour24 = 0;
    
    const date = new Date();
    date.setHours(hour24, minutes, 0, 0);
    
    setEditingScheduleId(schedule.id);
    setSelectedTime(date);
    setSelectedDays(schedule.days);
    setShowTimePicker(true);
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
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
            message: 'EGOV-CITIZEN needs access to your contacts to add emergency contacts.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
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

  const handleAddContact = async () => {
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

  const handleSelectContact = (contact: {id: string, name: string, phone: string}) => {
    // Check if already added
    if (contacts.find(c => c.phone === contact.phone)) {
      Alert.alert('Already Added', 'This contact is already in your emergency contacts.');
      return;
    }
    
    Alert.prompt 
      ? Alert.prompt(
          'Add Relationship',
          `What is ${contact.name}'s relationship to you?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Add',
              onPress: (relationship) => {
                const newContact: EmergencyContact = {
                  id: Date.now().toString(),
                  name: contact.name,
                  phone: contact.phone,
                  relationship: relationship || 'Family',
                };
                setContacts(prev => [...prev, newContact]);
                setShowContactPicker(false);
              },
            },
          ],
          'plain-text',
          'Family'
        )
      : Alert.alert(
          'Add Contact',
          `Add ${contact.name} as emergency contact?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Add',
              onPress: () => {
                const newContact: EmergencyContact = {
                  id: Date.now().toString(),
                  name: contact.name,
                  phone: contact.phone,
                  relationship: 'Family',
                };
                setContacts(prev => [...prev, newContact]);
                setShowContactPicker(false);
              },
            },
          ]
        );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeftIcon size={18} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Are You OK? Scheduler</Text>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.7}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView 
        style={styles.mainContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={Platform.OS === 'ios' ? 100 : 120}
        keyboardOpeningTime={0}
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <View style={styles.infoBannerIcon}>
            <UserHeartIcon size={24} color="#DC2626" />
          </View>
          <View style={styles.infoBannerContent}>
            <Text style={styles.infoBannerTitle}>Elderly Safety Feature</Text>
            <Text style={styles.infoBannerText}>
              Schedule regular check-ins. If you don't respond "I'm OK" within {responseTimeout} minutes, 
              an automatic alert with your location will be sent to your emergency contacts.
            </Text>
          </View>
        </View>

        {/* Main Toggle */}
        <View style={styles.section}>
          <View style={styles.mainToggleCard}>
            <View style={styles.mainToggleInfo}>
              <View style={styles.mainToggleIconBg}>
                <BellAlertIcon size={24} color="#B45309" />
              </View>
              <View style={styles.mainToggleText}>
                <Text style={styles.mainToggleTitle}>Enable Check-ins</Text>
                <Text style={styles.mainToggleSubtitle}>
                  {isEnabled ? 'Active - You will receive check-in alerts' : 'Disabled - No check-in alerts'}
                </Text>
              </View>
            </View>
            <ToggleSwitch value={isEnabled} onValueChange={() => setIsEnabled(!isEnabled)} />
          </View>
        </View>

        {/* Response Timeout */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏱️ Response Timeout</Text>
          <View style={styles.card}>
            <View style={styles.timeoutRow}>
              <Text style={styles.timeoutLabel}>Wait time before sending alert:</Text>
              <View style={styles.timeoutInputWrapper}>
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
            <View style={styles.locationRow}>
              <View style={styles.locationInfo}>
                <LocationIcon size={18} color="#059669" />
                <Text style={styles.locationLabel}>Include my location in alert</Text>
              </View>
              <ToggleSwitch value={includeLocation} onValueChange={() => setIncludeLocation(!includeLocation)} />
            </View>
          </View>
        </View>

        {/* Scheduled Check-ins */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>🕐 Scheduled Check-ins</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddSchedule} activeOpacity={0.7}>
              <PlusIcon size={14} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            {schedules.map((schedule, index) => (
              <View 
                key={schedule.id} 
                style={[styles.scheduleItem, index < schedules.length - 1 && styles.scheduleItemBorder]}
              >
                <TouchableOpacity 
                  style={styles.scheduleInfo}
                  onPress={() => handleEditScheduleTime(schedule)}
                  activeOpacity={0.7}
                >
                  <View style={styles.scheduleTimeRow}>
                    <ClockIcon size={18} color={schedule.enabled ? '#B45309' : '#9CA3AF'} />
                    <Text style={[styles.scheduleTime, !schedule.enabled && styles.scheduleTimeDisabled]}>
                      {schedule.time}
                    </Text>
                  </View>
                  <Text style={styles.scheduleDays}>{schedule.days.join(', ')}</Text>
                </TouchableOpacity>
                <View style={styles.scheduleActions}>
                  <TouchableOpacity 
                    style={styles.deleteButton} 
                    onPress={() => deleteSchedule(schedule.id)}
                    activeOpacity={0.7}
                  >
                    <TrashIcon size={16} color="#DC2626" />
                  </TouchableOpacity>
                  <ToggleSwitch value={schedule.enabled} onValueChange={() => toggleSchedule(schedule.id)} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>📱 Emergency Contacts</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddContact} activeOpacity={0.7}>
              <PlusIcon size={14} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <View style={styles.contactInfoBanner}>
              <InfoCircleIcon size={14} color="#B45309" />
              <Text style={styles.contactInfoText}>
                These contacts will receive an automatic SMS with your location if you don't respond to a check-in.
              </Text>
            </View>
            {contacts.map((contact, index) => (
              <View 
                key={contact.id} 
                style={[styles.contactItem, index < contacts.length - 1 && styles.contactItemBorder]}
              >
                <View style={styles.contactAvatar}>
                  <Text style={styles.contactInitials}>
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                  <Text style={styles.contactRelation}>{contact.relationship}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteContactButton} 
                  onPress={() => deleteContact(contact.id)}
                  activeOpacity={0.7}
                >
                  <TrashIcon size={16} color="#DC2626" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Alert Message Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Alert Message Preview</Text>
          <View style={styles.messagePreviewCard}>
            <View style={styles.messageHeader}>
              <MessageIcon size={18} color="#7C3AED" />
              <Text style={styles.messageHeaderText}>SMS Alert Preview</Text>
            </View>
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>
                🚨 URGENT: [Your Name] has not responded to their scheduled safety check-in. 
                They may need assistance.{'\n\n'}
                📍 Last known location:{'\n'}
                [GPS Coordinates / Address]{'\n\n'}
                ⏰ Missed check-in at: [Time]{'\n\n'}
                Please check on them immediately or contact emergency services.{'\n\n'}
                - EGOV-CITIZEN Safety Alert
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </KeyboardAwareScrollView>

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={showConfirmation}
        type="success"
        title="Settings Saved!"
        message='Your "Are You OK?" check-in schedules have been saved successfully. You will receive check-in alerts at the scheduled times.'
        onClose={handleConfirmClose}
        actionText="Done"
        referenceNumber={'SCH-' + Date.now().toString().slice(-8)}
      />

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
                style={[styles.daysPickerConfirmBtn, selectedDays.length === 0 && styles.daysPickerConfirmBtnDisabled]}
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
                    onPress={() => handleSelectContact(item)}
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
    fontSize: 18,
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
  infoBanner: {
    backgroundColor: '#FEF2F2',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  infoBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBannerContent: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 4,
  },
  infoBannerText: {
    fontSize: 12,
    color: '#B91C1C',
    lineHeight: 18,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mainToggleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mainToggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  mainToggleIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainToggleText: {
    flex: 1,
  },
  mainToggleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  mainToggleSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  timeoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  timeoutLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  timeoutInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeoutInput: {
    width: 40,
    height: 36,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#B45309',
  },
  timeoutUnit: {
    fontSize: 14,
    color: '#6B7280',
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationLabel: {
    fontSize: 14,
    color: '#374151',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#B45309',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  scheduleItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  scheduleTimeDisabled: {
    color: '#9CA3AF',
  },
  scheduleDays: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginLeft: 26,
  },
  scheduleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfoBanner: {
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FED7AA',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  contactInfoText: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  contactItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInitials: {
    fontSize: 14,
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
  contactPhone: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  contactRelation: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  deleteContactButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagePreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#F5F3FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  messageHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6D28D9',
  },
  messageBubble: {
    margin: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 18,
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
  // Days Picker Modal
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
    gap: 10,
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
    color: '#374151',
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
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  daysPickerCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  daysPickerConfirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#B45309',
    alignItems: 'center',
  },
  daysPickerConfirmBtnDisabled: {
    opacity: 0.5,
  },
  daysPickerConfirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Contact Picker Modal
  contactPickerModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
    maxHeight: '70%',
    position: 'absolute',
    bottom: 0,
  },
  contactPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  contactPickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  contactPickerClose: {
    fontSize: 22,
    color: '#6B7280',
    fontWeight: '600',
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactPickerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contactPickerInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
  },
  contactPickerInfo: {
    flex: 1,
  },
  contactPickerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  contactPickerPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default AreYouOKSchedulerScreen;
