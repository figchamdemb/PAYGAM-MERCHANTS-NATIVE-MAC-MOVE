/**
 * PAYGAM MERCHANT - SPLASH SCREEN
 * Auto-sliding splash with merchant type selection
 * Merchant Types: General, Corporate, Fuel
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const BoltIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z" />
  </Svg>
);

const ChartPieIcon: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = '#93C5FD' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2.03 0v8.99H22c-.47-4.74-4.24-8.52-8.97-8.99zm0 11.01V22c4.74-.47 8.5-4.25 8.97-8.99h-8.97z" />
  </Svg>
);

const ShieldIcon: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = '#86EFAC' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
  </Svg>
);

const StoreIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#293454' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
  </Svg>
);

const BuildingIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#DC2626' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
  </Svg>
);

const GasPumpIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#4F46E5' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
  </Svg>
);

const CheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </Svg>
);

const ArrowRightIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
  </Svg>
);

// ==================== TYPES ====================
interface MerchantType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  route: string;
}

// ==================== MERCHANT TYPES DATA ====================
const MERCHANT_TYPES: MerchantType[] = [
  {
    id: 'general',
    name: 'General Merchant',
    description: 'Retail Stores, Shops, Services',
    icon: <StoreIcon size={24} color="#293454" />,
    iconBgColor: '#DBEAFE',
    route: 'GeneralMerchantDashboard',
  },
  {
    id: 'corporate',
    name: 'Corporate Merchant',
    description: 'Business Payments, Companies',
    icon: <BuildingIcon size={24} color="#DC2626" />,
    iconBgColor: '#FEE2E2',
    route: 'CorporateMerchantDashboard',
  },
  {
    id: 'fuel',
    name: 'Fuel Merchant',
    description: 'Gas Stations, Fuel Services',
    icon: <GasPumpIcon size={24} color="#4F46E5" />,
    iconBgColor: '#E0E7FF',
    route: 'FuelMerchantDashboard',
  },
];

// ==================== MAIN COMPONENT ====================
const SplashScreenSimple: React.FC = () => {
  const navigation = useNavigation<any>();
  const [showSplash, setShowSplash] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedMerchant, setSelectedMerchant] = useState<string>('general');

  // Animation values
  const splashTranslateY = useRef(new Animated.Value(0)).current;
  const mainContentOpacity = useRef(new Animated.Value(0)).current;
  const loadingWidth = useRef(new Animated.Value(0)).current;
  const slide1Opacity = useRef(new Animated.Value(1)).current;
  const slide1TranslateX = useRef(new Animated.Value(0)).current;
  const slide2Opacity = useRef(new Animated.Value(0)).current;
  const slide2TranslateX = useRef(new Animated.Value(width)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    // Fade in logo
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(logoTranslateY, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Loading bar animation (4.5 seconds)
    Animated.timing(loadingWidth, {
      toValue: 1,
      duration: 4500,
      useNativeDriver: false,
    }).start();

    // Slide transition at 2.2 seconds
    const slideTimer = setTimeout(() => {
      setCurrentSlide(1);
      
      // Animate slide 1 out
      Animated.parallel([
        Animated.timing(slide1Opacity, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(slide1TranslateX, {
          toValue: -width,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate slide 2 in
      Animated.parallel([
        Animated.timing(slide2Opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(slide2TranslateX, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2200);

    // Transition to main content at 4.5 seconds
    const mainTimer = setTimeout(() => {
      // Slide splash up
      Animated.timing(splashTranslateY, {
        toValue: -height,
        duration: 700,
        useNativeDriver: true,
      }).start();

      // Fade in main content
      Animated.timing(mainContentOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        setShowSplash(false);
      }, 700);
    }, 4500);

    return () => {
      clearTimeout(slideTimer);
      clearTimeout(mainTimer);
    };
  }, []);

  const handleContinue = () => {
    const selected = MERCHANT_TYPES.find(m => m.id === selectedMerchant);
    if (selected) {
      // Navigate to Login with merchant type info
      navigation.navigate('Login', { merchantType: selected.id, merchantRoute: selected.route });
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#293454" />

      {/* MAIN CONTENT - Merchant Selection */}
      <Animated.View style={[styles.mainContent, { opacity: mainContentOpacity }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <BoltIcon size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.logoText}>PayGam Merchant</Text>
          </View>
          <Text style={styles.headerTitle}>Select Merchant Type</Text>
          <Text style={styles.headerSubtitle}>
            Choose the category that best fits your business to customize your dashboard.
          </Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.optionsContainer}>
            {MERCHANT_TYPES.map((merchant) => (
              <TouchableOpacity
                key={merchant.id}
                style={[
                  styles.optionCard,
                  selectedMerchant === merchant.id && styles.optionCardSelected,
                ]}
                onPress={() => setSelectedMerchant(merchant.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIcon, { backgroundColor: merchant.iconBgColor }]}>
                  {merchant.icon}
                </View>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionName}>{merchant.name}</Text>
                  <Text style={styles.optionDesc}>{merchant.description}</Text>
                </View>
                <View style={[
                  styles.radioOuter,
                  selectedMerchant === merchant.id && styles.radioOuterSelected,
                ]}>
                  {selectedMerchant === merchant.id && (
                    <CheckIcon size={12} color="#FFFFFF" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Action */}
        <View style={styles.bottomAction}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <ArrowRightIcon size={16} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.loginPrompt}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* SPLASH SCREEN OVERLAY */}
      {showSplash && (
        <Animated.View 
          style={[
            styles.splashOverlay,
            { transform: [{ translateY: splashTranslateY }] }
          ]}
        >
          {/* Top Logo */}
          <Animated.View style={[
            styles.splashLogo,
            { 
              opacity: logoOpacity,
              transform: [{ translateY: logoTranslateY }]
            }
          ]}>
            <View style={styles.splashLogoIcon}>
              <BoltIcon size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.splashLogoText}>PayGam Merchant</Text>
          </Animated.View>

          {/* Slides Container */}
          <View style={styles.slidesContainer}>
            {/* Slide 1 */}
            <Animated.View style={[
              styles.slide,
              {
                opacity: slide1Opacity,
                transform: [{ translateX: slide1TranslateX }],
              }
            ]}>
              <View style={styles.slideIconContainer}>
                <View style={styles.slideIconPing} />
                <ChartPieIcon size={48} color="#93C5FD" />
              </View>
              <Text style={styles.slideTitle}>Real-time Analytics</Text>
              <Text style={styles.slideDesc}>
                Monitor your daily sales, track inventory, and grow your business with powerful insights.
              </Text>
            </Animated.View>

            {/* Slide 2 */}
            <Animated.View style={[
              styles.slide,
              styles.slideAbsolute,
              {
                opacity: slide2Opacity,
                transform: [{ translateX: slide2TranslateX }],
              }
            ]}>
              <View style={styles.slideIconContainer}>
                <ShieldIcon size={48} color="#86EFAC" />
              </View>
              <Text style={styles.slideTitle}>Secure Payments</Text>
              <Text style={styles.slideDesc}>
                Accept payments securely from anywhere. Fast settlements directly to your bank.
              </Text>
            </Animated.View>
          </View>

          {/* Indicators & Loading */}
          <View style={styles.indicatorsContainer}>
            {/* Dots */}
            <View style={styles.dotsRow}>
              <View style={[
                styles.dot,
                currentSlide === 0 ? styles.dotActive : styles.dotInactive
              ]} />
              <View style={[
                styles.dot,
                currentSlide === 1 ? styles.dotActive : styles.dotInactive
              ]} />
            </View>

            {/* Loading Bar */}
            <View style={styles.loadingBarContainer}>
              <Animated.View 
                style={[
                  styles.loadingBar,
                  {
                    width: loadingWidth.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  }
                ]} 
              />
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  
  // Main Content Styles
  mainContent: {
    flex: 1,
  },
  header: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#293454',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#293454',
    letterSpacing: -0.5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 20,
  },
  
  scrollContent: {
    flex: 1,
    padding: 24,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 16,
    marginBottom: 16,
  },
  optionCardSelected: {
    borderColor: '#293454',
    backgroundColor: 'rgba(41, 52, 84, 0.05)',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionInfo: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  optionDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#293454',
    backgroundColor: '#293454',
  },
  
  bottomAction: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#293454',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#1E3A5F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#293454',
  },
  
  // Splash Overlay Styles
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#293454',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 48,
    zIndex: 50,
  },
  splashLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 32,
  },
  splashLogoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  
  slidesContainer: {
    width: width,
    height: 256,
    position: 'relative',
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  slideAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  slideIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  slideIconPing: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  slideDesc: {
    fontSize: 14,
    color: '#BFDBFE',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  
  indicatorsContainer: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 24,
    width: '100%',
    paddingHorizontal: 32,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 32,
    backgroundColor: '#FFFFFF',
  },
  dotInactive: {
    width: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  loadingBarContainer: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 16,
  },
  loadingBar: {
    height: '100%',
    backgroundColor: '#60A5FA',
    borderRadius: 2,
  },
});

export default SplashScreenSimple;
