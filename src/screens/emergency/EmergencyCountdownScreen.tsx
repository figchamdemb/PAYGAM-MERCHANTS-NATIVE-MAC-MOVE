import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  SafeAreaView,
  Platform,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';
import { Svg, Circle, Path, Line, G } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';

// Types for navigation
type EmergencyCountdownScreenNavigationProp = StackNavigationProp<any>;

// Constants
const { width, height } = Dimensions.get('window');
const COUNTDOWN_SECONDS = 45;
const CIRCLE_SIZE = 192; // w-48 h-48
const STROKE_WIDTH = 8;
const RADIUS = 88; // r="88" from design
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~552.92

// Contact data
interface Contact {
  id: string;
  name: string;
  imageUrl: string;
  isOnline?: boolean;
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Fatou',
    imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Lamin',
    imageUrl: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    isOnline: false,
  },
];

// SVG Icons
const ShieldIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="#B45309">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
);

const SendIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="22" y1="2" x2="11" y2="13" />
    <Path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </Svg>
);

const MapPinIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="#B45309">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx="12" cy="10" r="3" fill="#1F2937" />
  </Svg>
);

const XIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="18" y1="6" x2="6" y2="18" />
    <Line x1="6" y1="6" x2="18" y2="18" />
  </Svg>
);

const EmergencyCountdownScreen: React.FC = () => {
  const navigation = useNavigation<EmergencyCountdownScreenNavigationProp>();
  const { theme, isDarkMode } = useTheme();
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  
  // Animation refs
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(0)).current;
  const pingAnimation = useRef(new Animated.Value(0)).current;
  const overlayPulse = useRef(new Animated.Value(0.1)).current;
  const mapPinBounce = useRef(new Animated.Value(0)).current;

  // Start all animations
  useEffect(() => {
    // Progress animation (depletes over countdown time)
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: COUNTDOWN_SECONDS * 1000,
      useNativeDriver: false,
    }).start();

    // Pulse animation for inner ring (continuous)
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // Ping animation for outer ring (continuous)
    const pingLoop = Animated.loop(
      Animated.timing(pingAnimation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    pingLoop.start();

    // Overlay pulse (continuous)
    const overlayLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(overlayPulse, {
          toValue: 0.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(overlayPulse, {
          toValue: 0.1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    overlayLoop.start();

    // Map pin bounce (continuous)
    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(mapPinBounce, {
          toValue: -8,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(mapPinBounce, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    bounceLoop.start();

    return () => {
      pulseLoop.stop();
      pingLoop.stop();
      overlayLoop.stop();
      bounceLoop.stop();
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSendNow();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSendNow = () => {
    // Show confirmation that emergency alert was sent
    Alert.alert(
      '🚨 Emergency Alert Sent!',
      'Your emergency contacts (Fatou, Lamin & 2 others) will receive a text message with your location immediately.\n\nStay calm, help is on the way.',
      [
        {
          text: 'OK',
          onPress: () => navigation.replace('SOSActive'),
        },
      ],
      { cancelable: false }
    );
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  // Calculate stroke dash offset based on time left
  const strokeDashoffset = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, CIRCUMFERENCE],
  });

  // Animated circle component
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  // Ping ring animations
  const pingScale = pingAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  const pingOpacity = pingAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.1, 0],
  });

  // Pulse ring animations
  const pulseScale = pulseAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const pulseOpacity = pulseAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.05],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} translucent />

      {/* Background Map Image with Blur Effect */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }}
        style={styles.backgroundImage}
        blurRadius={Platform.OS === 'ios' ? 8 : 3}
        resizeMode="cover"
      >
        {/* Dark gradient overlay */}
        <View style={styles.gradientOverlay} />
      </ImageBackground>

      {/* Pulsing Urgency Overlay */}
      <Animated.View style={[styles.urgencyOverlay, { opacity: overlayPulse }]} />

      {/* Main Content */}
      <SafeAreaView style={styles.content}>
        {/* Top Bar: Status & Send Now */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.brandRow}>
              <ShieldIcon />
              <Text style={styles.brandText}>EGOV-CITIZEN</Text>
            </View>
            <Text style={styles.titleLine1}>Emergency</Text>
            <Text style={styles.titleLine2}>Mode Active</Text>
          </View>

          <TouchableOpacity 
            style={styles.sendNowButton} 
            onPress={handleSendNow}
            activeOpacity={0.85}
          >
            <Text style={styles.sendNowText}>Send Now</Text>
            <SendIcon />
          </TouchableOpacity>
        </View>

        {/* Center: Countdown Timer */}
        <View style={styles.centerSection}>
          {/* Timer Circle Container */}
          <View style={styles.timerContainer}>
            {/* Outer Ping Ring */}
            <Animated.View 
              style={[
                styles.pingRing,
                {
                  transform: [{ scale: pingScale }],
                  opacity: pingOpacity,
                }
              ]}
            />

            {/* Inner Pulse Ring */}
            <Animated.View 
              style={[
                styles.pulseRing,
                {
                  transform: [{ scale: pulseScale }],
                  opacity: pulseOpacity,
                }
              ]}
            />

            {/* SVG Progress Ring */}
            <View style={styles.svgContainer}>
              <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={styles.svgRing}>
                <G rotation="-90" origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}>
                  {/* Track Circle */}
                  <Circle
                    cx={CIRCLE_SIZE / 2}
                    cy={CIRCLE_SIZE / 2}
                    r={RADIUS}
                    stroke="#374151"
                    strokeWidth={STROKE_WIDTH}
                    fill="transparent"
                  />
                  {/* Progress Circle */}
                  <AnimatedCircle
                    cx={CIRCLE_SIZE / 2}
                    cy={CIRCLE_SIZE / 2}
                    r={RADIUS}
                    stroke="#B45309"
                    strokeWidth={STROKE_WIDTH}
                    fill="transparent"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </G>
              </Svg>

              {/* Timer Number */}
              <View style={styles.timerTextContainer}>
                <Text style={styles.timerValue}>{secondsLeft}</Text>
                <Text style={styles.timerLabel}>SECONDS</Text>
              </View>
            </View>
          </View>

          {/* Alert Details */}
          <View style={styles.alertDetails}>
            {/* Location Badge */}
            <View style={styles.locationBadge}>
              <Animated.View style={{ transform: [{ translateY: mapPinBounce }] }}>
                <MapPinIcon />
              </Animated.View>
              <Text style={styles.locationText}>
                Locating: <Text style={styles.locationHighlight}>Senegambia Strip, Kololi</Text>
              </Text>
            </View>

            {/* Contacts Section */}
            <View style={styles.contactsSection}>
              <Text style={styles.contactsLabel}>Sending emergency alerts to contacts:</Text>
              
              {/* Contact Avatars */}
              <View style={styles.avatarsContainer}>
                {mockContacts.map((contact, index) => (
                  <View 
                    key={contact.id} 
                    style={[
                      styles.avatarWrapper,
                      index > 0 && { marginLeft: -12 }
                    ]}
                  >
                    <Image
                      source={{ uri: contact.imageUrl }}
                      style={styles.avatar}
                    />
                    {contact.isOnline && (
                      <View style={styles.onlineIndicator} />
                    )}
                  </View>
                ))}
                {/* More Contacts Badge */}
                <View style={[styles.avatarWrapper, { marginLeft: -12 }]}>
                  <View style={styles.moreAvatar}>
                    <Text style={styles.moreAvatarText}>+2</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.contactsNames}>Fatou, Lamin & 2 others</Text>
            </View>
          </View>
        </View>

        {/* Bottom: Cancel Action */}
        <View style={styles.bottomSection}>
          <Text style={styles.cancelHint}>Tap below if this was a mistake.</Text>
          
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={handleCancel}
            activeOpacity={0.9}
          >
            <View style={styles.cancelIconCircle}>
              <XIcon />
            </View>
            <Text style={styles.cancelButtonText}>Cancel Alert</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827', // gray-900
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17, 24, 39, 0.85)', // gray-900 with 85% opacity
  },
  urgencyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#B45309', // amber/orange
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
    justifyContent: 'space-between',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 16,
  },
  headerLeft: {
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  brandText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF', // gray-400
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  titleLine1: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 34,
  },
  titleLine2: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 34,
  },
  sendNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B45309',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 50,
    gap: 8,
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sendNowText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Center Section
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  pingRing: {
    position: 'absolute',
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: '#B45309',
  },
  pulseRing: {
    position: 'absolute',
    width: 224,
    height: 224,
    borderRadius: 112,
    backgroundColor: '#B45309',
  },
  svgContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgRing: {
    position: 'absolute',
  },
  timerTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerValue: {
    fontSize: 64,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  timerLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#B45309',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 4,
  },

  // Alert Details
  alertDetails: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    gap: 16,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
  },
  locationText: {
    fontSize: 13,
    color: '#9CA3AF', // gray-400
  },
  locationHighlight: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  contactsSection: {
    alignItems: 'center',
    gap: 12,
  },
  contactsLabel: {
    fontSize: 13,
    color: '#9CA3AF', // gray-400
    textAlign: 'center',
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#111827', // Match bg for gap effect
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E', // green-500
    borderWidth: 2,
    borderColor: '#111827',
  },
  moreAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#374151', // gray-700
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  contactsNames: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 4,
  },

  // Bottom Section
  bottomSection: {
    paddingBottom: 24,
    paddingTop: 16,
  },
  cancelHint: {
    fontSize: 12,
    color: '#9CA3AF', // gray-400
    textAlign: 'center',
    marginBottom: 16,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  cancelIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D1D5DB', // gray-300
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827', // gray-900
  },
});

export default EmergencyCountdownScreen;
