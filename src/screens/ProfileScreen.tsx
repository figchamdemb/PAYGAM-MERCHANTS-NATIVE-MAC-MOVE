/**
 * ProfileScreen - Complete Profile Interface with Tabs
 * Based on HTML/Tailwind design provided
 * Features: Personal, Medical, and Vehicle tabs with comprehensive information
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

type TabType = 'personal' | 'medical' | 'vehicle';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMedicalEditModal, setShowMedicalEditModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('wallet');
  
  // Editable medical data
  const [editBloodType, setEditBloodType] = useState('O+');
  const [editWeight, setEditWeight] = useState('78');
  const [editHeight, setEditHeight] = useState('182');
  const [editAllergies, setEditAllergies] = useState('Peanuts, Penicillin');
  const [editConditions, setEditConditions] = useState('Asthma, Hypertension');

  // Sample data - would come from props/state in real app
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    id: 'GM-2024-8821',
    avatar: null,
  };

  const personalData = {
    fullName: 'John Doe',
    dateOfBirth: '01/01/1990',
    gender: 'Male',
    nationality: 'Gambian',
    phone: '+220 123 4567',
    email: 'john.doe@example.com',
    emergency: '+220 987 6543',
    address: '123 Main Street\nBanjul, The Gambia',
  };

  const medicalData = {
    bloodType: 'O+',
    weight: '78 kg',
    height: '182 cm',
    allergies: ['Peanuts', 'Penicillin'],
    conditions: ['Asthma', 'Hypertension'],
    medications: [
      { name: 'Albuterol Inhaler', dosage: 'As needed for asthma' },
      { name: 'Lisinopril', dosage: '10mg - Daily' },
    ],
    emergencyContacts: [
      { name: 'Dr. Sarah Smith', role: 'Primary Physician', phone: '+220 111 2222' },
      { name: 'Jane Doe', role: 'Spouse (Next of Kin)', phone: '+220 333 4444' },
    ],
  };

  const vehicleData = {
    makeModel: 'Toyota Camry 2020',
    licensePlate: 'BJL-1234',
    type: 'Private Car',
    color: 'Silver',
    engineNo: 'ENG123456',
    chassisNo: 'CHS987654',
    insurance: {
      provider: 'Gambia Insurance Co.',
      expiry: 'Dec 15, 2024',
      status: 'ACTIVE',
    },
    drivers: [
      { name: 'John Doe', role: 'Owner', license: 'DL-2020-1234', status: 'Active' },
      { name: 'Jane Doe', role: 'Spouse', license: 'DL-2021-5678', status: 'Active' },
      { name: 'Mike Johnson', role: 'Family', license: 'DL-2019-9012', status: 'Restricted' },
    ],
    penaltyPoints: { current: 3, total: 12, remaining: 9 },
    pendingTickets: [
      { id: 1, violation: 'Speeding Violation', location: 'Kairaba Avenue', date: 'Dec 1, 2024', amount: 'GMD 2,500', points: 2, due: 'Dec 15, 2024' },
      { id: 2, violation: 'Parking Violation', location: 'Westfield Junction', date: 'Nov 28, 2024', amount: 'GMD 500', points: 1, due: 'Dec 12, 2024' },
    ],
  };

  const renderPersonalTab = () => (
    <View style={styles.tabContent}>
      {/* Personal Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <Icon name="user" size={16} color="#B45309" />
          <Text style={styles.cardTitle}>Personal Information</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{personalData.fullName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoValue}>{personalData.dateOfBirth}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>{personalData.gender}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nationality</Text>
            <Text style={styles.infoValue}>{personalData.nationality}</Text>
          </View>
        </View>
      </View>

      {/* Contact Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <Icon name="phone" size={16} color="#B45309" />
          <Text style={styles.cardTitle}>Contact Information</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{personalData.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{personalData.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Emergency</Text>
            <Text style={styles.infoValue}>{personalData.emergency}</Text>
          </View>
        </View>
      </View>

      {/* Address Card */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <Icon name="home" size={16} color="#B45309" />
          <Text style={styles.cardTitle}>Address</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.addressText}>{personalData.address}</Text>
        </View>
      </View>
    </View>
  );

  const renderMedicalTab = () => (
    <View style={styles.tabContent}>
      {/* Medical ID Card */}
      <View style={styles.infoCard}>
        <View style={[styles.cardHeader, styles.medicalHeader]}>
          <Icon name="id-card" size={16} color="#DC2626" />
          <Text style={[styles.cardTitle, styles.medicalTitle]}>Medical ID</Text>
          <TouchableOpacity 
            style={styles.editButtonContainer}
            onPress={() => setShowMedicalEditModal(true)}
          >
            <Icon name="pencil" size={12} color="#B45309" />
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.vitalsGrid}>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Blood Type</Text>
              <Text style={styles.vitalValue}>{editBloodType}</Text>
            </View>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Weight</Text>
              <Text style={styles.vitalValue}>{editWeight} kg</Text>
            </View>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Height</Text>
              <Text style={styles.vitalValue}>{editHeight} cm</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Critical Information Card */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <Icon name="exclamation-triangle" size={16} color="#B45309" />
          <Text style={styles.cardTitle}>Critical Info</Text>
          <TouchableOpacity 
            style={styles.editButtonContainer}
            onPress={() => setShowMedicalEditModal(true)}
          >
            <Icon name="pencil" size={12} color="#B45309" />
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          {/* Allergies */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Allergies</Text>
            <View style={styles.tagContainer}>
              {editAllergies.split(', ').map((allergy, index) => (
                <View key={index} style={styles.dangerTag}>
                  <Icon name="ban" size={10} color="#DC2626" />
                  <Text style={styles.dangerTagText}>{allergy}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Conditions */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Medical Conditions</Text>
            <View style={styles.tagContainer}>
              {editConditions.split(', ').map((condition, index) => (
                <View key={index} style={styles.infoTag}>
                  <Text style={styles.infoTagText}>{condition}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Current Medications Card */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <Icon name="pills" size={16} color="#14B8A6" />
          <Text style={styles.cardTitle}>Medications</Text>
          <TouchableOpacity style={styles.addButton}>
            <Icon name="plus" size={12} color="#6B7280" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          {medicalData.medications.map((med, index) => (
            <View key={index} style={styles.medicationItem}>
              <View style={styles.medicationIcon}>
                <Icon name="prescription-bottle" size={14} color="#14B8A6" />
              </View>
              <View style={styles.medicationInfo}>
                <Text style={styles.medicationName}>{med.name}</Text>
                <Text style={styles.medicationDosage}>{med.dosage}</Text>
              </View>
              <Text style={styles.medicationStatus}>Active</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Emergency Contacts Card */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <Icon name="phone" size={16} color="#EF4444" />
          <Text style={styles.cardTitle}>Emergency Contacts</Text>
        </View>
        <View style={styles.cardContent}>
          {medicalData.emergencyContacts.map((contact, index) => (
            <View key={index} style={styles.contactItem}>
              <View style={styles.contactAvatar}>
                {contact.role === 'Primary Physician' ? (
                  <Image source={{ uri: 'https://i.pravatar.cc/150?img=5' }} style={styles.contactImage} />
                ) : (
                  <View style={styles.contactInitials}>
                    <Text style={styles.initialsText}>JD</Text>
                  </View>
                )}
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRole}>{contact.role}</Text>
              </View>
              <TouchableOpacity style={styles.callButton}>
                <Icon name="phone" size={12} color="#10B981" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderVehicleTab = () => (
    <View style={styles.tabContent}>
      {/* Vehicle Info Card */}
      <View style={styles.infoCard}>
        <View style={[styles.cardHeader, styles.vehicleHeader]}>
          <View style={styles.headerLeft}>
            <Icon name="car" size={16} color="#2563EB" />
            <Text style={[styles.cardTitle, styles.vehicleTitle]}>{vehicleData.makeModel}</Text>
          </View>
          <Text style={styles.licenseBadge}>{vehicleData.licensePlate}</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.vehicleGrid}>
            <View style={styles.vehicleItem}>
              <Text style={styles.vehicleLabel}>Type</Text>
              <Text style={styles.vehicleValue}>{vehicleData.type}</Text>
            </View>
            <View style={styles.vehicleItem}>
              <Text style={styles.vehicleLabel}>Color</Text>
              <Text style={styles.vehicleValue}>{vehicleData.color}</Text>
            </View>
            <View style={styles.vehicleItem}>
              <Text style={styles.vehicleLabel}>Engine No.</Text>
              <Text style={styles.vehicleValue}>{vehicleData.engineNo}</Text>
            </View>
            <View style={styles.vehicleItem}>
              <Text style={styles.vehicleLabel}>Chassis No.</Text>
              <Text style={styles.vehicleValue}>{vehicleData.chassisNo}</Text>
            </View>
          </View>

          {/* Insurance Section */}
          <View style={styles.insuranceSection}>
            <Text style={styles.insuranceTitle}>Insurance Status</Text>
            <View style={styles.insuranceStatus}>
              <View>
                <Text style={styles.insuranceProvider}>{vehicleData.insurance.provider}</Text>
                <Text style={styles.insuranceExpiry}>Expires: {vehicleData.insurance.expiry}</Text>
              </View>
              <Text style={styles.insuranceBadge}>{vehicleData.insurance.status}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Authorized Drivers Card */}
      <View style={styles.infoCard}>
        <View style={[styles.cardHeader, styles.driversHeader]}>
          <View style={styles.headerLeft}>
            <Icon name="users" size={16} color="#7C3AED" />
            <Text style={[styles.cardTitle, styles.driversTitle]}>Authorized Drivers</Text>
          </View>
          <Text style={styles.driverCount}>{vehicleData.drivers.length}</Text>
        </View>
        <View style={styles.cardContent}>
          {vehicleData.drivers.map((driver, index) => (
            <View key={index} style={styles.driverItem}>
              <View style={styles.driverAvatar}>
                <Text style={styles.driverInitials}>
                  {driver.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>
                  {driver.name} {driver.role === 'Owner' && <Text style={styles.ownerTag}>(Owner)</Text>}
                </Text>
                <Text style={styles.driverLicense}>Lic: {driver.license}</Text>
              </View>
              <Text style={[
                styles.driverStatus,
                driver.status === 'Active' ? styles.statusActive : styles.statusRestricted
              ]}>
                {driver.status}
              </Text>
            </View>
          ))}
          <TouchableOpacity style={styles.manageDriversButton}>
            <Text style={styles.manageDriversText}>Manage Drivers</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Traffic Record Card */}
      <View style={styles.infoCard}>
        <View style={[styles.cardHeader, styles.trafficHeader]}>
          <Icon name="exclamation-triangle" size={16} color="#EF4444" />
          <Text style={[styles.cardTitle, styles.trafficTitle]}>Traffic Record</Text>
        </View>
        <View style={styles.cardContent}>
          {/* Points Display */}
          <View style={styles.pointsSection}>
            <Text style={styles.pointsLabel}>Penalty Points</Text>
            <View style={styles.pointsValue}>
              <Text style={styles.pointsCurrent}>{vehicleData.penaltyPoints.current}</Text>
              <Text style={styles.pointsTotal}>/ {vehicleData.penaltyPoints.total}</Text>
            </View>
            <Text style={styles.pointsRemaining}>{vehicleData.penaltyPoints.remaining} remaining</Text>
          </View>

          {/* Pending Tickets */}
          <Text style={styles.ticketsTitle}>Pending Fines ({vehicleData.pendingTickets.length})</Text>
          <View style={styles.ticketsList}>
            {vehicleData.pendingTickets.map((ticket, index) => (
              <View key={index} style={styles.ticketItem}>
                <View style={styles.ticketIndicator} />
                <View style={styles.ticketContent}>
                  <View style={styles.ticketHeader}>
                    <View>
                      <Text style={styles.ticketViolation}>{ticket.violation}</Text>
                      <Text style={styles.ticketLocation}>{ticket.date} • {ticket.location}</Text>
                      <Text style={styles.ticketDue}>Due: {ticket.due}</Text>
                    </View>
                    <View style={styles.ticketAmount}>
                      <Text style={styles.ticketPrice}>GMD {ticket.amount}</Text>
                      <Text style={styles.ticketPoints}>+{ticket.points} pts</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.ticketActions}>
            <TouchableOpacity style={styles.payButton} onPress={() => setShowPaymentModal(true)}>
              <Text style={styles.payButtonText}>Pay Pending Fines</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.historyButton}>
              <Text style={styles.historyButtonText}>View History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Add Vehicle Button */}
      <TouchableOpacity style={styles.addVehicleButton}>
        <Icon name="plus-circle" size={16} color="#6B7280" />
        <Text style={styles.addVehicleText}>Add New Vehicle</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.colors.statusBarStyle} backgroundColor={theme.colors.headerBackground} />
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.headerBackground }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="bell" size={18} color="#FFFFFF" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Profile Hero */}
      <View style={[styles.profileHero, { backgroundColor: theme.colors.backgroundSecondary }]}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            {userData.avatar ? (
              <Image source={{ uri: userData.avatar }} style={styles.avatarImage} />
            ) : (
              <Icon name="user" size={40} color={theme.colors.textSecondary} />
            )}
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Icon name="camera" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.userName, { color: theme.colors.text }]}>{userData.name}</Text>
        <Text style={[styles.userId, { color: theme.colors.textSecondary }]}>ID: {userData.id}</Text>
      </View>

      {/* Tabs Navigation */}
      <View style={[styles.tabNavigation, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'personal' && styles.tabButtonActive]}
          onPress={() => setActiveTab('personal')}
        >
          <Text style={[styles.tabText, { color: theme.colors.textSecondary }, activeTab === 'personal' && styles.tabTextActive]}>
            Personal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'medical' && styles.tabButtonActive]}
          onPress={() => setActiveTab('medical')}
        >
          <Text style={[styles.tabText, { color: theme.colors.textSecondary }, activeTab === 'medical' && styles.tabTextActive]}>
            <Icon name="heartbeat" size={12} color={activeTab === 'medical' ? '#B45309' : theme.colors.textSecondary} /> Medical
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'vehicle' && styles.tabButtonActive]}
          onPress={() => setActiveTab('vehicle')}
        >
          <Text style={[styles.tabText, { color: theme.colors.textSecondary }, activeTab === 'vehicle' && styles.tabTextActive]}>
            Vehicle
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView style={[styles.tabContentContainer, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>
        {activeTab === 'personal' && renderPersonalTab()}
        {activeTab === 'medical' && renderMedicalTab()}
        {activeTab === 'vehicle' && renderVehicleTab()}
      </ScrollView>

      {/* Floating Action Button - Help & Support */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Help')}>
        <Icon name="question" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Payment Modal for Fines */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.paymentModalContainer}>
            <View style={styles.paymentModalHeader}>
              <Text style={styles.paymentModalTitle}>Pay Pending Fines</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Icon name="times" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Fine Summary */}
            <View style={styles.fineSummary}>
              <Text style={styles.fineSummaryLabel}>Total Amount Due</Text>
              <Text style={styles.fineSummaryAmount}>GMD 3,000</Text>
              <Text style={styles.fineSummaryItems}>2 pending violations</Text>
            </View>

            {/* Payment Methods */}
            <Text style={styles.paymentMethodTitle}>Select Payment Method</Text>
            
            <TouchableOpacity 
              style={[styles.paymentMethodCard, selectedPaymentMethod === 'wallet' && styles.paymentMethodSelected]}
              onPress={() => setSelectedPaymentMethod('wallet')}
            >
              <Icon name="wallet" size={20} color="#B45309" />
              <View style={styles.paymentMethodInfo}>
                <Text style={styles.paymentMethodName}>EGOV-CITIZEN Wallet</Text>
                <Text style={styles.paymentMethodBalance}>Balance: GMD 5,000</Text>
              </View>
              {selectedPaymentMethod === 'wallet' && <Icon name="check-circle" size={20} color="#10B981" />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.paymentMethodCard, selectedPaymentMethod === 'card' && styles.paymentMethodSelected]}
              onPress={() => setSelectedPaymentMethod('card')}
            >
              <Icon name="credit-card" size={20} color="#2563EB" />
              <View style={styles.paymentMethodInfo}>
                <Text style={styles.paymentMethodName}>Credit/Debit Card</Text>
                <Text style={styles.paymentMethodBalance}>**** 1234</Text>
              </View>
              {selectedPaymentMethod === 'card' && <Icon name="check-circle" size={20} color="#10B981" />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.paymentMethodCard, selectedPaymentMethod === 'mobile' && styles.paymentMethodSelected]}
              onPress={() => setSelectedPaymentMethod('mobile')}
            >
              <Icon name="mobile" size={20} color="#059669" />
              <View style={styles.paymentMethodInfo}>
                <Text style={styles.paymentMethodName}>Mobile Money</Text>
                <Text style={styles.paymentMethodBalance}>Africell / QMoney</Text>
              </View>
              {selectedPaymentMethod === 'mobile' && <Icon name="check-circle" size={20} color="#10B981" />}
            </TouchableOpacity>

            {/* Pay Button */}
            <TouchableOpacity 
              style={styles.payNowButton}
              onPress={() => {
                setShowPaymentModal(false);
                Alert.alert('Payment Successful', 'Your fines have been paid successfully!');
              }}
            >
              <Text style={styles.payNowButtonText}>Pay GMD 3,000</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Medical Edit Modal */}
      <Modal
        visible={showMedicalEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMedicalEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.medicalEditContainer}>
            <View style={styles.paymentModalHeader}>
              <Text style={styles.paymentModalTitle}>Edit Medical Info</Text>
              <TouchableOpacity onPress={() => setShowMedicalEditModal(false)}>
                <Icon name="times" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.medicalEditScroll}>
              {/* Blood Type */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Blood Type</Text>
                <View style={styles.bloodTypeContainer}>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.bloodTypeButton, editBloodType === type && styles.bloodTypeSelected]}
                      onPress={() => setEditBloodType(type)}
                    >
                      <Text style={[styles.bloodTypeText, editBloodType === type && styles.bloodTypeTextSelected]}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Weight */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editWeight}
                  onChangeText={setEditWeight}
                  keyboardType="numeric"
                  placeholder="Enter weight in kg"
                />
              </View>

              {/* Height */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Height (cm)</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editHeight}
                  onChangeText={setEditHeight}
                  keyboardType="numeric"
                  placeholder="Enter height in cm"
                />
              </View>

              {/* Allergies */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Allergies (comma separated)</Text>
                <TextInput
                  style={[styles.modalInput, styles.multilineInput]}
                  value={editAllergies}
                  onChangeText={setEditAllergies}
                  placeholder="e.g., Peanuts, Penicillin"
                  multiline
                />
              </View>

              {/* Medical Conditions */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Medical Conditions (comma separated)</Text>
                <TextInput
                  style={[styles.modalInput, styles.multilineInput]}
                  value={editConditions}
                  onChangeText={setEditConditions}
                  placeholder="e.g., Asthma, Diabetes"
                  multiline
                />
              </View>
            </ScrollView>

            {/* Save Button */}
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={() => {
                setShowMedicalEditModal(false);
                Alert.alert('Saved', 'Your medical information has been updated!');
              }}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // gray-50
  },
  header: {
    backgroundColor: '#B45309', // amber-700
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    padding: 4,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  notificationButton: {
    padding: 8,
    borderRadius: 20,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#B45309',
  },
  profileHero: {
    backgroundColor: '#FFFBEB', // amber-50
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FED7AA', // amber-200
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    backgroundColor: '#B45309',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: '#6B7280',
  },
  tabNavigation: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#B45309',
    backgroundColor: 'rgba(255, 251, 235, 0.5)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#B45309',
    fontWeight: '600',
  },
  tabContentContainer: {
    flex: 1,
    padding: 16,
  },
  tabContent: {
    paddingBottom: 80, // Space for FAB
  },
  // Info Cards
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  medicalHeader: {
    backgroundColor: '#FEF2F2',
    borderBottomColor: '#FECACA',
  },
  vehicleHeader: {
    backgroundColor: '#EFF6FF',
    borderBottomColor: '#DBEAFE',
  },
  driversHeader: {
    backgroundColor: '#F5F3FF',
    borderBottomColor: '#E9D5FF',
  },
  trafficHeader: {
    backgroundColor: '#FEF2F2',
    borderBottomColor: '#FECACA',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  medicalTitle: {
    color: '#DC2626',
  },
  vehicleTitle: {
    color: '#2563EB',
  },
  driversTitle: {
    color: '#7C3AED',
  },
  trafficTitle: {
    color: '#EF4444',
  },
  editButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 4,
  },
  editButton: {
    fontSize: 13,
    color: '#B45309',
    fontWeight: '600',
  },
  verifiedBadge: {
    fontSize: 10,
    color: '#FFFFFF',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: 'bold',
  },
  licenseBadge: {
    fontSize: 12,
    color: '#FFFFFF',
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: 'bold',
  },
  driverCount: {
    fontSize: 12,
    color: '#7C3AED',
    backgroundColor: '#E9D5FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 16,
  },
  // Personal Tab Styles
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  addressText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  // Medical Tab Styles
  vitalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  vitalItem: {
    alignItems: 'center',
  },
  vitalLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  vitalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B45309',
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dangerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dangerTagText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
    marginLeft: 4,
  },
  infoTag: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  infoTagText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  medicationIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#99F6E4',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  medicationDosage: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  medicationStatus: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  addButton: {
    width: 24,
    height: 24,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  contactAvatar: {
    marginRight: 12,
  },
  contactImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  contactInitials: {
    width: 40,
    height: 40,
    backgroundColor: '#E9D5FF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  contactRole: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  callButton: {
    width: 32,
    height: 32,
    backgroundColor: '#D1FAE5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  // Vehicle Tab Styles
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  vehicleItem: {
    width: '50%',
    marginBottom: 12,
  },
  vehicleLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  vehicleValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  insuranceSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  insuranceTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  insuranceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  insuranceProvider: {
    fontSize: 14,
    color: '#4B5563',
  },
  insuranceExpiry: {
    fontSize: 12,
    fontWeight: '500',
    color: '#059669',
    marginTop: 2,
  },
  insuranceBadge: {
    fontSize: 10,
    color: '#FFFFFF',
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontWeight: 'bold',
  },
  driverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 8,
  },
  driverAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#E9D5FF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  driverInitials: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  ownerTag: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: 'normal',
  },
  driverLicense: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  driverStatus: {
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontWeight: 'bold',
  },
  statusActive: {
    backgroundColor: '#D1FAE5',
    color: '#059669',
  },
  statusRestricted: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
  },
  manageDriversButton: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  manageDriversText: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '500',
  },
  pointsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 16,
  },
  pointsLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  pointsValue: {
    alignItems: 'flex-end',
  },
  pointsCurrent: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  pointsTotal: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  pointsRemaining: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  ticketsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  ticketsList: {
    marginBottom: 16,
  },
  ticketItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  ticketIndicator: {
    width: 4,
    backgroundColor: '#EF4444',
    marginRight: 12,
  },
  ticketContent: {
    flex: 1,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  ticketViolation: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  ticketLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  ticketDue: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
    marginTop: 4,
  },
  ticketAmount: {
    alignItems: 'flex-end',
  },
  ticketPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  ticketPoints: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: 'bold',
  },
  ticketActions: {
    flexDirection: 'row',
    gap: 12,
  },
  payButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  historyButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  historyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  addVehicleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 12,
    marginTop: 8,
  },
  addVehicleText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginLeft: 8,
  },
  // Floating Action Button
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
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  // Payment Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  paymentModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 30,
  },
  paymentModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  paymentModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  fineSummary: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  fineSummaryLabel: {
    fontSize: 12,
    color: '#92400E',
    marginBottom: 4,
  },
  fineSummaryAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#B45309',
  },
  fineSummaryItems: {
    fontSize: 12,
    color: '#92400E',
    marginTop: 4,
  },
  paymentMethodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentMethodSelected: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  paymentMethodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentMethodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  paymentMethodBalance: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  payNowButton: {
    backgroundColor: '#B45309',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  payNowButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // Medical Edit Modal Styles
  medicalEditContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  medicalEditScroll: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: '#111827',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  bloodTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  bloodTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  bloodTypeSelected: {
    backgroundColor: '#FEF3C7',
    borderColor: '#B45309',
  },
  bloodTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  bloodTypeTextSelected: {
    color: '#B45309',
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ProfileScreen;
