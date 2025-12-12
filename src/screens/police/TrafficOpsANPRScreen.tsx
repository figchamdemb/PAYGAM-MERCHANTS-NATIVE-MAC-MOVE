/**
 * ✅ PATROL APP - TRAFFIC OPS & ANPR SCREEN
 * License plate scanning with camera and manual entry
 * Police Department Only
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const BackIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SettingsIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </Svg>
);

const FlashIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M7 2v11h3v9l7-12h-4l4-8z" />
  </Svg>
);

const CameraRotateIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z" />
  </Svg>
);

const CarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </Svg>
);

const IdCardIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM8 11c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm3 4H5v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1zm9-2h-6v-2h6v2zm0-4h-6V7h6v2z" />
  </Svg>
);

const SearchIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const EyeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </Svg>
);

const ListIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
  </Svg>
);

const MapIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </Svg>
);

const CloseIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </Svg>
);

const AlertIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
  </Svg>
);

const CheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </Svg>
);

const FileIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
  </Svg>
);

const ShieldIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
  </Svg>
);

const UserIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </Svg>
);

const TrafficOpsANPRScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'plate' | 'license'>('plate');
  const [searchInput, setSearchInput] = useState('L88-XRT');
  const [showModal, setShowModal] = useState(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  // Scan line animation
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const handleSearch = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Camera Viewfinder Section */}
      <View style={styles.cameraSection}>
        {/* Simulated Camera Background */}
        <View style={styles.cameraBackground}>
          {/* Grid pattern */}
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={i} style={[styles.gridDot, { top: (i % 5) * 40 + 60, left: Math.floor(i / 5) * 50 + 30 }]} />
          ))}
        </View>

        {/* Header Overlay */}
        <LinearGradient colors={['rgba(0,0,0,0.8)', 'transparent']} style={styles.headerOverlay}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <BackIcon size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <View>
                <Text style={styles.headerTitle}>Traffic Ops</Text>
                <View style={styles.statusRow}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>ANPR ONLINE</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <SettingsIcon size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Viewfinder */}
        <View style={styles.viewfinder}>
          <View style={styles.focusBox}>
            {/* Corner brackets */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {/* Scanning line */}
            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [
                    {
                      translateX: scanLineAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-width * 0.35, width * 0.35],
                      }),
                    },
                  ],
                  opacity: scanLineAnim.interpolate({
                    inputRange: [0, 0.1, 0.9, 1],
                    outputRange: [0, 1, 1, 0],
                  }),
                },
              ]}
            />

            <Text style={styles.scanningText}>SCANNING PLATE</Text>
          </View>
        </View>

        {/* Camera Controls */}
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.cameraButton}>
            <FlashIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraButton}>
            <CameraRotateIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Manual Entry Section */}
      <View style={styles.contentSection}>
        <View style={styles.dragHandle} />

        <View style={styles.contentInner}>
          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'plate' && styles.tabActive]}
              onPress={() => setActiveTab('plate')}
            >
              <Text style={[styles.tabText, activeTab === 'plate' && styles.tabTextActive]}>PLATE ID</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'license' && styles.tabActive]}
              onPress={() => setActiveTab('license')}
            >
              <Text style={[styles.tabText, activeTab === 'license' && styles.tabTextActive]}>LICENSE</Text>
            </TouchableOpacity>
          </View>

          {/* Manual Input */}
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                {activeTab === 'plate' ? (
                  <CarIcon size={18} color="#9CA3AF" />
                ) : (
                  <IdCardIcon size={18} color="#9CA3AF" />
                )}
              </View>
              <TextInput
                style={styles.input}
                value={searchInput}
                onChangeText={setSearchInput}
                placeholder={activeTab === 'plate' ? 'ENTER PLATE' : 'ENTER LICENSE #'}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="characters"
              />
            </View>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <SearchIcon size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Recent Scans (dimmed) */}
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Recent Scans</Text>
              <Text style={styles.recentLink}>History</Text>
            </View>
            <View style={styles.recentCard}>
              <View style={styles.recentIcon}>
                <CarIcon size={24} color="#9CA3AF" />
              </View>
              <View style={styles.recentInfo}>
                <Text style={styles.recentPlate}>K99-ABC</Text>
                <Text style={styles.recentDetails}>2021 FORD • CLEAN</Text>
              </View>
              <View style={styles.safeBadge}>
                <Text style={styles.safeBadgeText}>SAFE</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <EyeIcon size={24} color="#1E40AF" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>SCAN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <ListIcon size={24} color="#9CA3AF" />
          <Text style={styles.navLabel}>LOGS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MapIcon size={24} color="#9CA3AF" />
          <Text style={styles.navLabel}>MAP</Text>
        </TouchableOpacity>
      </View>

      {/* Vehicle Details Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={closeModal} />
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>VEHICLE REPORT</Text>
                <Text style={styles.modalSubtitle}>
                  ID: #REQ-88291 • <Text style={styles.modalLive}>Live Database</Text>
                </Text>
              </View>
              <TouchableOpacity style={styles.modalClose} onPress={closeModal}>
                <CloseIcon size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {/* Vehicle Identity Card */}
              <View style={styles.vehicleCard}>
                <View style={styles.wantedBadge}>
                  <Text style={styles.wantedBadgeText}>WANTED VEHICLE</Text>
                </View>
                <View style={styles.vehicleCardContent}>
                  <View style={styles.vehicleIconBox}>
                    <CarIcon size={32} color="#1E40AF" />
                  </View>
                  <View style={styles.vehicleInfo}>
                    <Text style={styles.vehiclePlate}>L88-XRT</Text>
                    <Text style={styles.vehicleModel}>TOYOTA CAMRY</Text>
                    <View style={styles.vehicleTags}>
                      <View style={styles.vehicleTag}>
                        <Text style={styles.vehicleTagText}>COUPE</Text>
                      </View>
                      <View style={[styles.vehicleTag, styles.vehicleTagBlack]}>
                        <Text style={styles.vehicleTagTextWhite}>BLACK</Text>
                      </View>
                      <Text style={styles.vehicleYear}>2019</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Status Section */}
              <Text style={styles.sectionLabel}>Status & Flags</Text>
              
              {/* Stolen Alert */}
              <View style={styles.alertCard}>
                <View>
                  <Text style={styles.alertLabel}>Vehicle Status</Text>
                  <View style={styles.alertRow}>
                    <AlertIcon size={20} color="#DC2626" />
                    <Text style={styles.alertText}>STOLEN</Text>
                  </View>
                </View>
                <View style={styles.alertRight}>
                  <Text style={styles.alertRef}>REF: #NCIC-99</Text>
                  <Text style={styles.alertConfirmed}>CONFIRMED</Text>
                </View>
              </View>

              {/* Status Grid */}
              <View style={styles.statusGrid}>
                <View style={styles.statusBox}>
                  <View style={styles.statusBoxHeader}>
                    <View style={styles.statusBoxIcon}>
                      <FileIcon size={16} color="#6B7280" />
                    </View>
                    <CloseIcon size={16} color="#EF4444" />
                  </View>
                  <Text style={styles.statusBoxLabel}>Registration</Text>
                  <Text style={styles.statusBoxValue}>EXPIRED</Text>
                  <Text style={styles.statusBoxNote}>30+ Days</Text>
                </View>

                <View style={styles.statusBox}>
                  <View style={styles.statusBoxHeader}>
                    <View style={styles.statusBoxIcon}>
                      <ShieldIcon size={16} color="#6B7280" />
                    </View>
                    <CheckIcon size={16} color="#10B981" />
                  </View>
                  <Text style={styles.statusBoxLabel}>Insurance</Text>
                  <Text style={styles.statusBoxValue}>VALID</Text>
                  <Text style={styles.statusBoxNoteGreen}>Geico Inc.</Text>
                </View>
              </View>

              {/* Owner Section */}
              <Text style={styles.sectionLabel}>Registered Owner</Text>
              <View style={styles.ownerCard}>
                <View style={styles.ownerHeader}>
                  <View style={styles.ownerAvatar}>
                    <UserIcon size={24} color="#9CA3AF" />
                  </View>
                  <View style={styles.ownerInfo}>
                    <Text style={styles.ownerName}>Johnathan Doe</Text>
                    <Text style={styles.ownerDetails}>DOB: 12/05/1985 • Male</Text>
                  </View>
                  <View style={styles.warrantBadge}>
                    <Text style={styles.warrantBadgeText}>Warrant</Text>
                  </View>
                </View>
                <View style={styles.ownerFooter}>
                  <View style={styles.ownerStat}>
                    <Text style={styles.ownerStatLabel}>License Class</Text>
                    <Text style={styles.ownerStatValue}>Class C (Regular)</Text>
                  </View>
                  <View style={styles.ownerStat}>
                    <Text style={styles.ownerStatLabel}>License Status</Text>
                    <View style={styles.validRow}>
                      <CheckIcon size={12} color="#10B981" />
                      <Text style={styles.validText}>VALID</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Action Button */}
              <TouchableOpacity style={styles.actionButton}>
                <FileIcon size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>CREATE INCIDENT REPORT</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  
  // Camera Section
  cameraSection: {
    height: height * 0.4,
    backgroundColor: '#0F172A',
    position: 'relative',
  },
  cameraBackground: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  gridDot: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#6B7280',
    borderRadius: 1,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24) + 10,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#86EFAC',
    letterSpacing: 1,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Viewfinder
  viewfinder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  focusBox: {
    width: '100%',
    maxWidth: 280,
    aspectRatio: 3,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderColor: '#60A5FA',
  },
  cornerTL: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTR: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBL: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBR: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanLine: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: 'rgba(59,130,246,0.5)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 5,
  },
  scanningText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 3,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    gap: 12,
  },
  cameraButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  // Content Section
  contentSection: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  dragHandle: {
    width: 48,
    height: 6,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  contentInner: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    fontWeight: '700',
    color: '#1E40AF',
  },

  // Input
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 2,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  searchButton: {
    width: 56,
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  // Recent Scans
  recentSection: {
    opacity: 0.5,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  recentLink: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recentIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  recentInfo: {
    flex: 1,
  },
  recentPlate: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  recentDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  safeBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  safeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 32,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 4,
  },
  navLabelActive: {
    fontWeight: '700',
    color: '#1E40AF',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.6)',
  },
  modalContent: {
    height: height * 0.9,
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  modalLive: {
    color: '#2563EB',
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    flex: 1,
    padding: 24,
  },

  // Vehicle Card
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  wantedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
  },
  wantedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  vehicleCardContent: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  vehicleIconBox: {
    width: 64,
    height: 64,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehiclePlate: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1,
  },
  vehicleModel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
    marginTop: 2,
  },
  vehicleTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  vehicleTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  vehicleTagBlack: {
    backgroundColor: '#000000',
    borderColor: '#4B5563',
  },
  vehicleTagText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#4B5563',
  },
  vehicleTagTextWhite: {
    fontSize: 10,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  vehicleYear: {
    fontSize: 12,
    color: '#6B7280',
  },

  // Section Labels
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },

  // Alert Card
  alertCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#7F1D1D',
  },
  alertRight: {
    alignItems: 'flex-end',
  },
  alertRef: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#EF4444',
  },
  alertConfirmed: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B91C1C',
    marginTop: 2,
  },

  // Status Grid
  statusGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statusBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
  },
  statusBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statusBoxIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBoxLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  statusBoxValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
  statusBoxNote: {
    fontSize: 10,
    color: '#EF4444',
    marginTop: 2,
  },
  statusBoxNoteGreen: {
    fontSize: 10,
    color: '#10B981',
    marginTop: 2,
  },

  // Owner Card
  ownerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 24,
  },
  ownerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 16,
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  ownerDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  warrantBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  warrantBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
    textTransform: 'uppercase',
  },
  ownerFooter: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  ownerStat: {
    flex: 1,
  },
  ownerStatLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  ownerStatValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginTop: 2,
  },
  validRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  validText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },

  // Action Button
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default TrafficOpsANPRScreen;
