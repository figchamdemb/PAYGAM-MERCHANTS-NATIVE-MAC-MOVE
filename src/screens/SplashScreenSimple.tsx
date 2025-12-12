/**
 * ✅ LIVE RESPONSE - SPLASH SCREEN (SIMPLE VERSION)
 * Blue gradient splash screen without FontAwesome dependency
 */

import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle, Defs, RadialGradient, Stop, Rect, Pattern } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Shield Icon as SVG Path (no FontAwesome dependency)
const ShieldIcon: React.FC<{ size?: number; color?: string }> = ({ size = 60, color = '#FFFFFF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 2L4 5V11C4 16.25 7.4 21.14 12 22C16.6 21.14 20 16.25 20 11V5L12 2Z"
            fill={color}
            opacity={0.2}
        />
        <Path
            d="M12 2L4 5V11C4 16.25 7.4 21.14 12 22C16.6 21.14 20 16.25 20 11V5L12 2ZM12 20C8.5 19.22 6 14.94 6 11V6.4L12 4L18 6.4V11C18 14.94 15.5 19.22 12 20Z"
            fill={color}
        />
        <Path
            d="M12 7V13M12 13L9 10M12 13L15 10"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

// Lock Icon as SVG Path
const LockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 10, color = '#FFFFFF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <Path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </Svg>
);

const SplashScreenSimple: React.FC = () => {
    const navigation = useNavigation<any>();

    // Animation values
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const loadingAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade in
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Pulse animation for logo
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Loading bar animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(loadingAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(loadingAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Navigate to Login after delay
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 5000);  // 5 seconds

        return () => clearTimeout(timer);
    }, [navigation]);

    const loadingTranslate = loadingAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-width * 0.6, width * 0.6],
    });

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            {/* Background Gradient */}
            <LinearGradient
                colors={['#1E40AF', '#172554', '#1E40AF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Decorative Background Elements */}
            <View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
                {/* Top-left glow */}
                <Svg height={height} width={width} style={{ position: 'absolute', top: -100, left: -100 }}>
                    <Defs>
                        <RadialGradient id="blueGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                            <Stop offset="0" stopColor="#3B82F6" stopOpacity="0.3" />
                            <Stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Circle cx="150" cy="150" r="200" fill="url(#blueGlow)" />
                </Svg>

                {/* Bottom-right glow */}
                <Svg height={height} width={width} style={{ position: 'absolute', bottom: -100, right: -100 }}>
                    <Defs>
                        <RadialGradient id="indigoGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                            <Stop offset="0" stopColor="#6366F1" stopOpacity="0.3" />
                            <Stop offset="1" stopColor="#6366F1" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Circle cx={width - 50} cy={height - 50} r="180" fill="url(#indigoGlow)" />
                </Svg>

                {/* Grid Pattern */}
                <Svg height="100%" width="100%" style={{ opacity: 0.1 }}>
                    <Defs>
                        <Pattern id="gridPattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                            <Circle cx="1" cy="1" r="1" fill="#FFFFFF" />
                        </Pattern>
                    </Defs>
                    <Rect x="0" y="0" width="100%" height="100%" fill="url(#gridPattern)" />
                </Svg>
            </View>

            {/* Content */}
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {/* Spacer */}
                <View style={{ flex: 1 }} />

                {/* Logo Section */}
                <View style={styles.logoSection}>
                    {/* Logo with glow effect */}
                    <View style={styles.logoWrapper}>
                        <View style={styles.logoGlow} />
                        <Animated.View style={[styles.logoBox, { transform: [{ scale: pulseAnim }, { rotate: '3deg' }] }]}>
                            <View style={{ transform: [{ rotate: '-3deg' }] }}>
                                <ShieldIcon size={60} color="#FFFFFF" />
                            </View>
                        </Animated.View>
                        {/* Status dot */}
                        <View style={styles.statusDot} />
                    </View>

                    {/* App Name */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.appName}>LIVE</Text>
                        <Text style={styles.appSubtitle}>RESPONSE</Text>
                    </View>

                    {/* Tagline */}
                    <Text style={styles.tagline}>Advanced Security & Surveillance Systems</Text>
                </View>

                {/* Spacer */}
                <View style={{ flex: 1 }} />

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    {/* Loading Bar */}
                    <View style={styles.loadingContainer}>
                        <View style={styles.loadingTrack}>
                            <Animated.View style={[styles.loadingBar, { transform: [{ translateX: loadingTranslate }] }]}>
                                <LinearGradient
                                    colors={['rgba(96, 165, 250, 0)', '#FFFFFF', 'rgba(96, 165, 250, 0)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={{ flex: 1, borderRadius: 999 }}
                                />
                            </Animated.View>
                        </View>
                        <View style={styles.loadingLabels}>
                            <Text style={styles.loadingText}>SYSTEM CHECK</Text>
                            <Text style={[styles.loadingText, { opacity: 0.7 }]}>LOADING...</Text>
                        </View>
                    </View>

                    {/* Version & Secure Badge */}
                    <View style={styles.footer}>
                        <Text style={styles.versionText}>v1.0.1 (Build 2)</Text>
                        <View style={styles.secureBadge}>
                            <LockIcon size={10} color="#FFFFFF" />
                            <Text style={styles.secureText}>Secure Connection</Text>
                        </View>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E40AF',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 32,
        zIndex: 10,
    },
    logoSection: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoWrapper: {
        position: 'relative',
        marginBottom: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoGlow: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(96, 165, 250, 0.3)',
    },
    logoBox: {
        width: 128,
        height: 128,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    statusDot: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 16,
        height: 16,
        backgroundColor: '#4ADE80',
        borderColor: '#1E40AF',
        borderWidth: 2,
        borderRadius: 8,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 8,
    },
    appName: {
        fontSize: 40,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -1,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    appSubtitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#BFDBFE',
        letterSpacing: 8,
        textTransform: 'uppercase',
        marginTop: 4,
    },
    tagline: {
        marginTop: 16,
        color: '#DBEAFE',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        opacity: 0.9,
    },
    bottomSection: {
        width: '100%',
        paddingBottom: 48,
        alignItems: 'center',
    },
    loadingContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 24,
    },
    loadingTrack: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(30, 58, 138, 0.5)',
        borderRadius: 999,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        marginBottom: 8,
    },
    loadingBar: {
        width: '60%',
        height: '100%',
        borderRadius: 999,
    },
    loadingLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    loadingText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#93C5FD',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    footer: {
        alignItems: 'center',
    },
    versionText: {
        fontSize: 10,
        color: 'rgba(147, 197, 253, 0.6)',
        fontFamily: 'monospace',
    },
    secureBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        opacity: 0.5,
        gap: 6,
    },
    secureText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: '500',
        marginLeft: 4,
    },
});

export default SplashScreenSimple;
