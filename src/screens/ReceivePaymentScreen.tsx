/**
 * PAYGAM MERCHANT - RECEIVE PAYMENT SCREEN
 * QR code display for receiving payments with sharing options
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
  TextInput,
  ScrollView,
  Modal,
  Share,
  Image,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const BackArrowIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SettingsIcon: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </Svg>
);

const QRCodeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 200, color = '#1F2937' }) => (
  <Svg width={size} height={size} viewBox="0 0 200 200">
    {/* Top-Left Module */}
    <Rect x="20" y="20" width="50" height="50" rx="4" fill={color} />
    <Rect x="28" y="28" width="34" height="34" rx="2" fill="#FFFFFF" />
    <Rect x="36" y="36" width="18" height="18" rx="1" fill={color} />
    
    {/* Top-Right Module */}
    <Rect x="130" y="20" width="50" height="50" rx="4" fill={color} />
    <Rect x="138" y="28" width="34" height="34" rx="2" fill="#FFFFFF" />
    <Rect x="146" y="36" width="18" height="18" rx="1" fill={color} />
    
    {/* Bottom-Left Module */}
    <Rect x="20" y="130" width="50" height="50" rx="4" fill={color} />
    <Rect x="28" y="138" width="34" height="34" rx="2" fill="#FFFFFF" />
    <Rect x="36" y="146" width="18" height="18" rx="1" fill={color} />
    
    {/* Data Pattern - Center */}
    <Rect x="80" y="20" width="8" height="8" rx="1" fill={color} />
    <Rect x="92" y="20" width="8" height="8" rx="1" fill={color} />
    <Rect x="104" y="20" width="8" height="8" rx="1" fill={color} />
    <Rect x="116" y="20" width="8" height="8" rx="1" fill={color} />
    
    <Rect x="80" y="32" width="8" height="8" rx="1" fill={color} />
    <Rect x="104" y="32" width="8" height="8" rx="1" fill={color} />
    
    <Rect x="80" y="44" width="8" height="8" rx="1" fill={color} />
    <Rect x="92" y="44" width="8" height="8" rx="1" fill={color} />
    <Rect x="116" y="44" width="8" height="8" rx="1" fill={color} />
    
    <Rect x="92" y="56" width="8" height="8" rx="1" fill={color} />
    <Rect x="104" y="56" width="8" height="8" rx="1" fill={color} />
    
    {/* Center Row Pattern */}
    <Rect x="20" y="80" width="8" height="8" rx="1" fill={color} />
    <Rect x="32" y="80" width="8" height="8" rx="1" fill={color} />
    <Rect x="56" y="80" width="8" height="8" rx="1" fill={color} />
    <Rect x="80" y="80" width="8" height="8" rx="1" fill={color} />
    <Rect x="92" y="80" width="8" height="8" rx="1" fill={color} />
    <Rect x="116" y="80" width="8" height="8" rx="1" fill={color} />
    <Rect x="140" y="80" width="8" height="8" rx="1" fill={color} />
    <Rect x="164" y="80" width="8" height="8" rx="1" fill={color} />
    <Rect x="176" y="80" width="8" height="8" rx="1" fill={color} />
    
    <Rect x="20" y="92" width="8" height="8" rx="1" fill={color} />
    <Rect x="44" y="92" width="8" height="8" rx="1" fill={color} />
    <Rect x="80" y="92" width="8" height="8" rx="1" fill={color} />
    <Rect x="104" y="92" width="8" height="8" rx="1" fill={color} />
    <Rect x="128" y="92" width="8" height="8" rx="1" fill={color} />
    <Rect x="152" y="92" width="8" height="8" rx="1" fill={color} />
    <Rect x="176" y="92" width="8" height="8" rx="1" fill={color} />
    
    <Rect x="20" y="104" width="8" height="8" rx="1" fill={color} />
    <Rect x="32" y="104" width="8" height="8" rx="1" fill={color} />
    <Rect x="56" y="104" width="8" height="8" rx="1" fill={color} />
    <Rect x="92" y="104" width="8" height="8" rx="1" fill={color} />
    <Rect x="116" y="104" width="8" height="8" rx="1" fill={color} />
    <Rect x="140" y="104" width="8" height="8" rx="1" fill={color} />
    <Rect x="164" y="104" width="8" height="8" rx="1" fill={color} />
    
    <Rect x="20" y="116" width="8" height="8" rx="1" fill={color} />
    <Rect x="44" y="116" width="8" height="8" rx="1" fill={color} />
    <Rect x="68" y="116" width="8" height="8" rx="1" fill={color} />
    <Rect x="92" y="116" width="8" height="8" rx="1" fill={color} />
    <Rect x="104" y="116" width="8" height="8" rx="1" fill={color} />
    <Rect x="128" y="116" width="8" height="8" rx="1" fill={color} />
    <Rect x="152" y="116" width="8" height="8" rx="1" fill={color} />
    <Rect x="176" y="116" width="8" height="8" rx="1" fill={color} />
    
    {/* Bottom Row Pattern */}
    <Rect x="80" y="130" width="8" height="8" rx="1" fill={color} />
    <Rect x="104" y="130" width="8" height="8" rx="1" fill={color} />
    <Rect x="128" y="130" width="8" height="8" rx="1" fill={color} />
    <Rect x="152" y="130" width="8" height="8" rx="1" fill={color} />
    <Rect x="164" y="130" width="8" height="8" rx="1" fill={color} />
    
    <Rect x="80" y="142" width="8" height="8" rx="1" fill={color} />
    <Rect x="92" y="142" width="8" height="8" rx="1" fill={color} />
    <Rect x="116" y="142" width="8" height="8" rx="1" fill={color} />
    <Rect x="140" y="142" width="8" height="8" rx="1" fill={color} />
    <Rect x="176" y="142" width="8" height="8" rx="1" fill={color} />
    
    <Rect x="80" y="154" width="8" height="8" rx="1" fill={color} />
    <Rect x="104" y="154" width="8" height="8" rx="1" fill={color} />
    <Rect x="116" y="154" width="8" height="8" rx="1" fill={color} />
    <Rect x="128" y="154" width="8" height="8" rx="1" fill={color} />
    <Rect x="152" y="154" width="8" height="8" rx="1" fill={color} />
    <Rect x="164" y="154" width="8" height="8" rx="1" fill={color} />
    
    <Rect x="80" y="166" width="8" height="8" rx="1" fill={color} />
    <Rect x="92" y="166" width="8" height="8" rx="1" fill={color} />
    <Rect x="104" y="166" width="8" height="8" rx="1" fill={color} />
    <Rect x="128" y="166" width="8" height="8" rx="1" fill={color} />
    <Rect x="140" y="166" width="8" height="8" rx="1" fill={color} />
    <Rect x="152" y="166" width="8" height="8" rx="1" fill={color} />
    <Rect x="176" y="166" width="8" height="8" rx="1" fill={color} />
    
    <Rect x="80" y="178" width="8" height="8" rx="1" fill={color} />
    <Rect x="116" y="178" width="8" height="8" rx="1" fill={color} />
    <Rect x="140" y="178" width="8" height="8" rx="1" fill={color} />
    <Rect x="164" y="178" width="8" height="8" rx="1" fill={color} />
    <Rect x="176" y="178" width="8" height="8" rx="1" fill={color} />
  </Svg>
);

const WhatsAppIcon: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = '#25D366' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </Svg>
);

const SaveIcon: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
  </Svg>
);

const LinkIcon: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
  </Svg>
);

const EditIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </Svg>
);

const CloseIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </Svg>
);

const StoreIcon: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
  </Svg>
);

// ==================== TYPES ====================
type CurrencyType = 'USD' | 'GMD' | 'GBP';

// ==================== MAIN COMPONENT ====================
const ReceivePaymentScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>('USD');
  const [amountModalVisible, setAmountModalVisible] = useState(false);
  const [specificAmount, setSpecificAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState<string | null>(null);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const currencies: { key: CurrencyType; symbol: string; label: string }[] = [
    { key: 'USD', symbol: '$', label: 'USD' },
    { key: 'GMD', symbol: 'D', label: 'GMD' },
    { key: 'GBP', symbol: '£', label: 'GBP' },
  ];

  const handleWhatsAppShare = async () => {
    try {
      await Share.share({
        message: `Pay me via NexusPay!\n\nMerchant: Nexus Merchant Store\nID: NX-8829-MER\n${displayAmount ? `Amount: ${currencies.find(c => c.key === selectedCurrency)?.symbol}${displayAmount}\n` : ''}Currency: ${selectedCurrency}\n\nScan the QR code or use this link: https://nexuspay.com/pay/NX-8829-MER`,
        title: 'Share Payment QR',
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const handleSaveQR = () => {
    // TODO: Implement save to gallery
    console.log('Save QR to gallery');
  };

  const handleCopyLink = () => {
    // TODO: Implement copy to clipboard
    console.log('Copy link');
  };

  const handleSetAmount = () => {
    if (specificAmount) {
      setDisplayAmount(specificAmount);
    }
    setAmountModalVisible(false);
  };

  const handleClearAmount = () => {
    setDisplayAmount(null);
    setSpecificAmount('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#293454" />
      
      {/* Header */}
      <LinearGradient colors={['#293454', '#1f2842']} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <BackArrowIcon size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receive Payment</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.7}
        >
          <SettingsIcon size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* QR Code Card */}
        <Animated.View style={[styles.qrCard, { transform: [{ scale: pulseAnim }] }]}>
          {/* Merchant Info */}
          <View style={styles.merchantInfo}>
            <View style={styles.merchantAvatar}>
              <StoreIcon size={28} color="#293454" />
            </View>
            <View style={styles.merchantDetails}>
              <Text style={styles.merchantName}>Nexus Merchant Store</Text>
              <Text style={styles.merchantId}>Merchant ID: NX-8829-MER</Text>
            </View>
          </View>

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <View style={styles.qrWrapper}>
              <QRCodeIcon size={200} color="#1F2937" />
            </View>
            
            {/* Amount Display */}
            {displayAmount && (
              <View style={styles.amountOverlay}>
                <View style={styles.amountBadge}>
                  <Text style={styles.amountText}>
                    {currencies.find(c => c.key === selectedCurrency)?.symbol}
                    {displayAmount}
                  </Text>
                  <TouchableOpacity 
                    style={styles.clearAmountButton}
                    onPress={handleClearAmount}
                  >
                    <CloseIcon size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Set Amount Button */}
          <TouchableOpacity
            style={styles.setAmountButton}
            onPress={() => setAmountModalVisible(true)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#293454', '#1f2842']}
              style={styles.setAmountGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <EditIcon size={16} color="#FFFFFF" />
              <Text style={styles.setAmountText}>Set Specific Amount</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Currency Selection */}
          <View style={styles.currencySection}>
            <Text style={styles.currencyLabel}>Select Currency</Text>
            <View style={styles.currencyContainer}>
              {currencies.map((currency) => (
                <TouchableOpacity
                  key={currency.key}
                  style={[
                    styles.currencyButton,
                    selectedCurrency === currency.key && styles.currencyButtonActive,
                  ]}
                  onPress={() => setSelectedCurrency(currency.key)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.currencyButtonText,
                      selectedCurrency === currency.key && styles.currencyButtonTextActive,
                    ]}
                  >
                    {currency.symbol} {currency.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Scan Instruction */}
          <Text style={styles.scanInstruction}>
            Ask the payer to scan this QR code to complete the payment
          </Text>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleWhatsAppShare}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#25D366', '#128C7E']}
              style={styles.actionButtonGradient}
            >
              <WhatsAppIcon size={22} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>WhatsApp</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSaveQR}
            activeOpacity={0.8}
          >
            <View style={styles.actionButtonOutline}>
              <SaveIcon size={22} color="#293454" />
              <Text style={[styles.actionButtonText, { color: '#293454' }]}>Save QR</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCopyLink}
            activeOpacity={0.8}
          >
            <View style={styles.actionButtonOutline}>
              <LinkIcon size={22} color="#293454" />
              <Text style={[styles.actionButtonText, { color: '#293454' }]}>Copy Link</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Amount Modal */}
      <Modal
        visible={amountModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAmountModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Payment Amount</Text>
              <TouchableOpacity
                onPress={() => setAmountModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <CloseIcon size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Enter Amount</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencyPrefix}>
                  {currencies.find(c => c.key === selectedCurrency)?.symbol}
                </Text>
                <TextInput
                  style={styles.amountInput}
                  value={specificAmount}
                  onChangeText={setSpecificAmount}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  autoFocus
                />
              </View>

              <View style={styles.quickAmounts}>
                {['10', '25', '50', '100'].map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={styles.quickAmountButton}
                    onPress={() => setSpecificAmount(amount)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.quickAmountText}>
                      {currencies.find(c => c.key === selectedCurrency)?.symbol}{amount}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setAmountModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, !specificAmount && styles.confirmButtonDisabled]}
                onPress={handleSetAmount}
                activeOpacity={0.8}
                disabled={!specificAmount}
              >
                <LinearGradient
                  colors={specificAmount ? ['#293454', '#1f2842'] : ['#9CA3AF', '#6B7280']}
                  style={styles.confirmButtonGradient}
                >
                  <Text style={styles.confirmButtonText}>Set Amount</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  merchantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  merchantAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(41, 52, 84, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  merchantDetails: {
    flex: 1,
    marginLeft: 16,
  },
  merchantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  merchantId: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  amountOverlay: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
  },
  amountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#293454',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  clearAmountButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  setAmountButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  setAmountGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  setAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  currencySection: {
    marginBottom: 20,
  },
  currencyLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  currencyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  currencyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  currencyButtonActive: {
    backgroundColor: 'rgba(41, 52, 84, 0.1)',
    borderColor: '#293454',
  },
  currencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  currencyButtonTextActive: {
    color: '#293454',
  },
  scanInstruction: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  actionButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#293454',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  currencyPrefix: {
    fontSize: 24,
    fontWeight: '700',
    color: '#293454',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    paddingVertical: 16,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
  },
  quickAmountButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
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
    color: '#6B7280',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ReceivePaymentScreen;
