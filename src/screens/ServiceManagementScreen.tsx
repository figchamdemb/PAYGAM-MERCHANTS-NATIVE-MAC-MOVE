/**
 * PAYGAM MERCHANT - SERVICE MANAGEMENT SCREEN
 * For General Merchants to create and manage their services
 * Accessible from sidebar menu -> Create a Service
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  Animated,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const ArrowLeftIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BellIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SearchIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const FilterIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
  </Svg>
);

const CalendarCheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 14l2 2 4-4-1.41-1.41L11 13.17l-.59-.59L9 14z" />
  </Svg>
);

const BoltIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13.01 3h1l-1 7h3.51c.4 0 .62.19.4.66C12.97 17.55 11 21 11 21z" />
  </Svg>
);

const ClockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#D97706' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </Svg>
);

const PenIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#4B5563' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </Svg>
);

const TrashIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </Svg>
);

const CameraIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 15.2c1.77 0 3.2-1.43 3.2-3.2S13.77 8.8 12 8.8 8.8 10.23 8.8 12s1.43 3.2 3.2 3.2zm9-8.6h-3.17l-1.86-2H8.03l-1.86 2H3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h18c.55 0 1-.45 1-1v-12c0-.55-.45-1-1-1z" />
  </Svg>
);

const ChevronDownIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PlusCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
  </Svg>
);

const ShieldIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
  </Svg>
);

const HeadsetIcon: React.FC<{ size?: number; color?: string }> = ({ size = 32, color = '#D1D5DB' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
  </Svg>
);

const CalendarDayIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
  </Svg>
);

// ==================== TYPES ====================
type TabType = 'list' | 'create';
type BillingCycle = 'one-time' | 'monthly' | 'yearly';
type ServiceType = 'paid' | 'free';

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  billingLabel: string;
  status: 'active' | 'reviewing' | 'inactive';
  image: string | null;
  accessType: 'recurring' | 'instant' | 'booking';
  isFree: boolean;
}

// ==================== MAIN COMPONENT ====================
const ServiceManagementScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create form state
  const [serviceName, setServiceName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Education');
  const [serviceType, setServiceType] = useState<ServiceType>('paid');
  const [currency, setCurrency] = useState('USD');
  const [price, setPrice] = useState('');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('one-time');
  const [description, setDescription] = useState('');
  
  // Dropdown modal states
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  
  const buttonScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Demo services data
  const services: Service[] = [
    {
      id: '1',
      name: 'Premium Gym Access',
      category: 'Health & Fitness',
      price: 49.99,
      currency: 'USD',
      billingLabel: '/ month',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150',
      accessType: 'recurring',
      isFree: false,
    },
    {
      id: '2',
      name: 'Python Masterclass',
      category: 'Education',
      price: 120.00,
      currency: 'USD',
      billingLabel: 'One-time',
      status: 'reviewing',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150',
      accessType: 'instant',
      isFree: false,
    },
    {
      id: '3',
      name: 'Initial Consultation',
      category: 'Professional Services',
      price: 0,
      currency: 'USD',
      billingLabel: '',
      status: 'active',
      image: null,
      accessType: 'booking',
      isFree: true,
    },
  ];

  const categories = ['Education', 'Health & Fitness', 'Entertainment', 'Utilities', 'Professional'];
  const currencies = ['USD', 'EUR', 'GMD', 'GBP'];

  // Filter services based on search
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const switchTab = (tab: TabType) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tab);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleCreateService = () => {
    // Validate and submit
    if (!serviceName.trim()) {
      Alert.alert('Error', 'Please enter a service name');
      return;
    }
    
    navigation.navigate('ActionSuccess', {
      title: 'Service Created',
      message: 'Your service has been submitted for review. You will be notified once it is approved.',
      navigateTo: 'GeneralMerchantDashboard',
    });
  };

  const handleEditService = (service: Service) => {
    Alert.alert('Edit Service', `Editing: ${service.name}`);
  };

  const handleDeleteService = (service: Service) => {
    Alert.alert(
      'Delete Service',
      `Are you sure you want to delete "${service.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: '#DCFCE7', text: '#15803D' };
      case 'reviewing':
        return { bg: '#FEF3C7', text: '#B45309' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const getAccessTypeIcon = (type: string) => {
    switch (type) {
      case 'recurring':
        return <CalendarCheckIcon size={12} color="#9CA3AF" />;
      case 'instant':
        return <BoltIcon size={12} color="#9CA3AF" />;
      case 'booking':
        return <CalendarDayIcon size={12} color="#9CA3AF" />;
      default:
        return null;
    }
  };

  const getAccessTypeLabel = (type: string) => {
    switch (type) {
      case 'recurring':
        return 'Recurring';
      case 'instant':
        return 'Instant Access';
      case 'booking':
        return 'Booking';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#293454" />
      
      {/* Header */}
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.topNav}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeftIcon size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Service Management</Text>
            <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
              <BellIcon size={18} color="#FFFFFF" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
          
          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'list' && styles.tabActive]}
              onPress={() => switchTab('list')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === 'list' && styles.tabTextActive]}>
                My Services
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'create' && styles.tabActive]}
              onPress={() => switchTab('create')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === 'create' && styles.tabTextActive]}>
                Create New
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Service List View */}
          {activeTab === 'list' && (
            <View style={styles.listView}>
              {/* Search & Filter */}
              <View style={styles.searchRow}>
                <View style={styles.searchContainer}>
                  <SearchIcon size={18} color="#9CA3AF" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search services..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
                <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
                  <FilterIcon size={18} color="#293454" />
                </TouchableOpacity>
              </View>

              {/* Service Cards */}
              {filteredServices.map((service) => {
                const statusStyle = getStatusStyle(service.status);
                return (
                  <View key={service.id} style={styles.serviceCard}>
                    {/* Status Badge */}
                    <View style={styles.statusBadgeContainer}>
                      <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        {service.status === 'reviewing' && (
                          <ClockIcon size={10} color={statusStyle.text} />
                        )}
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>
                          {service.status === 'reviewing' ? 'Reviewing' : 'Active'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.serviceContent}>
                      {/* Service Image */}
                      <View style={styles.serviceImageContainer}>
                        {service.image ? (
                          <Image
                            source={{ uri: service.image }}
                            style={styles.serviceImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={styles.servicePlaceholder}>
                            <HeadsetIcon size={32} color="#D1D5DB" />
                          </View>
                        )}
                      </View>

                      {/* Service Info */}
                      <View style={styles.serviceInfo}>
                        <Text style={styles.serviceName}>{service.name}</Text>
                        <Text style={styles.serviceCategory}>{service.category}</Text>
                        <View style={styles.priceRow}>
                          {service.isFree ? (
                            <Text style={styles.freeLabel}>FREE</Text>
                          ) : (
                            <>
                              <Text style={styles.priceAmount}>
                                ${service.price.toFixed(2)}
                              </Text>
                              <Text style={styles.pricePeriod}>{service.billingLabel}</Text>
                            </>
                          )}
                        </View>
                      </View>
                    </View>

                    {/* Card Footer */}
                    <View style={styles.cardFooter}>
                      <View style={styles.accessType}>
                        {getAccessTypeIcon(service.accessType)}
                        <Text style={styles.accessTypeText}>
                          {getAccessTypeLabel(service.accessType)}
                        </Text>
                      </View>
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => handleEditService(service)}
                          activeOpacity={0.7}
                        >
                          <PenIcon size={12} color="#4B5563" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteService(service)}
                          activeOpacity={0.7}
                        >
                          <TrashIcon size={12} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Create Service View */}
          {activeTab === 'create' && (
            <View style={styles.createView}>
              {/* Image Upload */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Service Image</Text>
                <TouchableOpacity style={styles.imageUpload} activeOpacity={0.7}>
                  <View style={styles.cameraIconContainer}>
                    <CameraIcon size={24} color="#293454" />
                  </View>
                  <Text style={styles.uploadText}>Tap to take picture or upload</Text>
                </TouchableOpacity>
              </View>

              {/* Basic Info */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>SERVICE DETAILS</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Service Name (e.g. Yoga Class)"
                  placeholderTextColor="#9CA3AF"
                  value={serviceName}
                  onChangeText={setServiceName}
                />

                <View style={styles.rowInputs}>
                  <View style={styles.halfInput}>
                    <Text style={styles.smallLabel}>Category</Text>
                    <TouchableOpacity 
                      style={styles.selectInput} 
                      activeOpacity={0.7}
                      onPress={() => setShowCategoryPicker(true)}
                    >
                      <Text style={styles.selectText}>{selectedCategory}</Text>
                      <ChevronDownIcon size={14} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.halfInput}>
                    <Text style={styles.smallLabel}>Type</Text>
                    <View style={styles.typeToggle}>
                      <TouchableOpacity
                        style={[
                          styles.typeButton,
                          serviceType === 'paid' && styles.typeButtonActive,
                        ]}
                        onPress={() => setServiceType('paid')}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.typeButtonText,
                            serviceType === 'paid' && styles.typeButtonTextActive,
                          ]}
                        >
                          Paid
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.typeButton,
                          serviceType === 'free' && styles.typeButtonActive,
                        ]}
                        onPress={() => setServiceType('free')}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.typeButtonText,
                            serviceType === 'free' && styles.typeButtonTextActive,
                          ]}
                        >
                          Free
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              {/* Pricing */}
              {serviceType === 'paid' && (
                <View style={styles.formSection}>
                  <Text style={styles.sectionTitle}>PRICING & BILLING</Text>
                  
                  <View style={styles.priceInputRow}>
                    <View style={styles.currencyInput}>
                      <Text style={styles.smallLabel}>Currency</Text>
                      <TouchableOpacity 
                        style={styles.selectInput} 
                        activeOpacity={0.7}
                        onPress={() => setShowCurrencyPicker(true)}
                      >
                        <Text style={styles.selectText}>{currency}</Text>
                        <ChevronDownIcon size={14} color="#9CA3AF" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.priceInput}>
                      <Text style={styles.smallLabel}>Price</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="0.00"
                        placeholderTextColor="#D1D5DB"
                        keyboardType="numeric"
                        value={price}
                        onChangeText={setPrice}
                      />
                    </View>
                  </View>

                  <View style={styles.billingSection}>
                    <Text style={styles.smallLabel}>Billing Cycle</Text>
                    <View style={styles.billingOptions}>
                      {(['one-time', 'monthly', 'yearly'] as BillingCycle[]).map((cycle) => (
                        <TouchableOpacity
                          key={cycle}
                          style={[
                            styles.billingOption,
                            billingCycle === cycle && styles.billingOptionActive,
                          ]}
                          onPress={() => setBillingCycle(cycle)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.billingOptionText,
                              billingCycle === cycle && styles.billingOptionTextActive,
                            ]}
                          >
                            {cycle === 'one-time' ? 'One-time' : cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              )}

              {/* Description */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>DESCRIPTION</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Describe your service..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              {/* Submit Button */}
              <View style={styles.submitSection}>
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleCreateService}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={0.9}
                  >
                    <PlusCircleIcon size={18} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>Create Service</Text>
                  </TouchableOpacity>
                </Animated.View>
                <View style={styles.disclaimer}>
                  <ShieldIcon size={12} color="#9CA3AF" />
                  <Text style={styles.disclaimerText}>
                    Your service will be reviewed before publishing.
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryPicker(false)}
        >
          <View style={styles.pickerModal}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                <Text style={styles.pickerClose}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.pickerItem,
                    selectedCategory === category && styles.pickerItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedCategory(category);
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text style={[
                    styles.pickerItemText,
                    selectedCategory === category && styles.pickerItemTextSelected,
                  ]}>
                    {category}
                  </Text>
                  {selectedCategory === category && (
                    <View style={styles.pickerCheck}>
                      <Text style={styles.pickerCheckText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Currency Picker Modal */}
      <Modal
        visible={showCurrencyPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCurrencyPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCurrencyPicker(false)}
        >
          <View style={styles.pickerModal}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Currency</Text>
              <TouchableOpacity onPress={() => setShowCurrencyPicker(false)}>
                <Text style={styles.pickerClose}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerList}>
              {currencies.map((curr) => (
                <TouchableOpacity
                  key={curr}
                  style={[
                    styles.pickerItem,
                    currency === curr && styles.pickerItemSelected,
                  ]}
                  onPress={() => {
                    setCurrency(curr);
                    setShowCurrencyPicker(false);
                  }}
                >
                  <Text style={[
                    styles.pickerItemText,
                    currency === curr && styles.pickerItemTextSelected,
                  ]}>
                    {curr}
                  </Text>
                  {currency === curr && (
                    <View style={styles.pickerCheck}>
                      <Text style={styles.pickerCheckText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  // Header
  header: {
    backgroundColor: '#293454',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 50,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 12 : 12,
    paddingBottom: 16,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: '#293454',
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  tab: {
    flex: 1,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },

  // List View
  listView: {
    gap: 16,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 8,
    fontSize: 14,
    color: '#1F2937',
  },
  filterButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Service Card
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  statusBadgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  serviceContent: {
    flexDirection: 'row',
    gap: 16,
  },
  serviceImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  servicePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  serviceCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#293454',
  },
  pricePeriod: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  freeLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16A34A',
  },
  cardFooter: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F9FAFB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accessType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  accessTypeText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Create View
  createView: {
    gap: 24,
  },
  formSection: {
    gap: 12,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  imageUpload: {
    height: 192,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 12,
    color: '#6B7280',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  smallLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  selectInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 14,
    color: '#1F2937',
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    padding: 4,
    borderRadius: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: '#293454',
    fontWeight: '600',
  },
  priceInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  currencyInput: {
    width: '33%',
  },
  priceInput: {
    flex: 1,
  },
  billingSection: {
    marginTop: 8,
  },
  billingOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  billingOption: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    alignItems: 'center',
  },
  billingOptionActive: {
    backgroundColor: '#293454',
    borderColor: '#293454',
  },
  billingOptionText: {
    fontSize: 12,
    color: '#6B7280',
  },
  billingOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 100,
  },
  submitSection: {
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: '#293454',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#293454',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Picker Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pickerModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxHeight: 400,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pickerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#293454',
  },
  pickerClose: {
    fontSize: 16,
    fontWeight: '600',
    color: '#293454',
  },
  pickerList: {
    maxHeight: 320,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerItemSelected: {
    backgroundColor: '#F0F4FF',
  },
  pickerItemText: {
    fontSize: 15,
    color: '#374151',
  },
  pickerItemTextSelected: {
    color: '#293454',
    fontWeight: '600',
  },
  pickerCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#293454',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerCheckText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ServiceManagementScreen;
