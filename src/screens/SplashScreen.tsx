import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    StatusBar,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {
    Defs,
    RadialGradient,
    Stop,
    Pattern,
    Rect,
    Circle as SvgCircle,
} from 'react-native-svg';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faShieldHalved,
    faLock,
    faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    // Animation drivers
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const loadingBarAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // 1. Fade In Content
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // 2. Logo Pulse Loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // 3. Loading Bar Loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(loadingBarAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: false, // width change not supported by native driver
                }),
                Animated.timing(loadingBarAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: false,
                }),
            ])
        ).start();

        // 4. Navigation Timer
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 4000); // Increased a bit to let the user see the animation

        return () => clearTimeout(timer);
    }, [navigation, fadeAnim, pulseAnim, loadingBarAnim]);

    // Interpolations
    const loadingBarWidth = loadingBarAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const loadingBarTranslate = loadingBarAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [-width * 0.6, 0, width * 0.6],
    });

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />

            {/* MAIN BACKGROUND GRADIENT */}
            <LinearGradient
                colors={['#1E40AF', '#172554', '#1E40AF']} // Blue-800 to Blue-950 to Blue-800
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* DECORATIVE BACKGROUND SHAPES (Simulated with Svg Radial Gradients for blur effect) */}
            <View
                style={[
                    StyleSheet.absoluteFill,
                    { overflow: 'hidden', zIndex: 0 },
                ]}
            >
                {/* Top-Left Blob */}
                <Svg
                    height={height}
                    width={width}
                    style={{ position: 'absolute', top: -100, left: -100 }}
                >
                    <Defs>
                        <RadialGradient
                            id="blueGlow"
                            cx="50%"
                            cy="50%"
                            rx="50%"
                            ry="50%"
                        >
                            <Stop
                                offset="0"
                                stopColor="#3B82F6"
                                stopOpacity="0.3"
                            />
                            <Stop
                                offset="1"
                                stopColor="#3B82F6"
                                stopOpacity="0"
                            />
                        </RadialGradient>
                    </Defs>
                    <SvgCircle
                        cx="150"
                        cy="150"
                        r="200"
                        fill="url(#blueGlow)"
                    />
                </Svg>

                {/* Bottom-Right Blob */}
                <Svg
                    height={height}
                    width={width}
                    style={{ position: 'absolute', bottom: -100, right: -100 }}
                >
                    <Defs>
                        <RadialGradient
                            id="indigoGlow"
                            cx="50%"
                            cy="50%"
                            rx="50%"
                            ry="50%"
                        >
                            <Stop
                                offset="0"
                                stopColor="#6366F1"
                                stopOpacity="0.3"
                            />
                            <Stop
                                offset="1"
                                stopColor="#6366F1"
                                stopOpacity="0"
                            />
                        </RadialGradient>
                    </Defs>
                    <SvgCircle
                        cx={width - 50}
                        cy={height - 50}
                        r="180"
                        fill="url(#indigoGlow)"
                    />
                </Svg>

                {/* GRID OVERLAY */}
                <Svg height="100%" width="100%" style={{ opacity: 0.1 }}>
                    <Defs>
                        <Pattern
                            id="gridPattern"
                            x="0"
                            y="0"
                            width="30"
                            height="30"
                            patternUnits="userSpaceOnUse"
                        >
                            <SvgCircle cx="1" cy="1" r="1" fill="#FFFFFF" />
                        </Pattern>
                    </Defs>
                    <Rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="url(#gridPattern)"
                    />
                </Svg>
            </View>

            {/* CONTENT CONTAINER */}
            <Animated.View
                style={[styles.contentContainer, { opacity: fadeAnim }]}
            >
                {/* SPACER TOP */}
                <View style={{ flex: 1 }} />

                {/* CENTER LOGO & BRANDING */}
                <View style={styles.centerSection}>
                    {/* Logo with Glow */}
                    <View style={styles.logoWrapper}>
                        {/* Glow Behind */}
                        <View style={styles.logoGlow} />

                        {/* Glassy Logo Box */}
                        <Animated.View
                            style={[
                                styles.logoBox,
                                {
                                    transform: [
                                        { rotate: '3deg' },
                                        { scale: pulseAnim },
                                    ],
                                },
                            ]}
                        >
                            {/* Icon */}
                            <Animated.View
                                style={{ transform: [{ rotate: '-3deg' }] }}
                            >
                                <FontAwesomeIcon
                                    icon={faShieldHalved || faShieldAlt}
                                    size={60}
                                    color="#FFFFFF"
                                    style={styles.shadowIcon}
                                />
                            </Animated.View>
                        </Animated.View>

                        {/* Status Dot */}
                        <View style={styles.statusDot} />
                    </View>

                    {/* App Name */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.appName}>LIVE</Text>
                        <Text style={styles.appSubtitle}>RESPONSE</Text>
                    </View>

                    {/* Tagline */}
                    <Text style={styles.tagline}>
                        Advanced Response Portal
                    </Text>
                </View>

                {/* SPACER MIDDLE */}
                <View style={{ flex: 1 }} />

                {/* BOTTOM LOADING SECTION */}
                <View style={styles.bottomSection}>
                    {/* Loading Bar Container */}
                    <View style={styles.loaderWrapper}>
                        <View style={styles.loadingTrack}>
                            <Animated.View
                                style={[
                                    styles.loadingBar,
                                    { transform: [{ translateX: loadingBarTranslate }] },
                                ]}
                            >
                                <LinearGradient
                                    colors={['rgba(96, 165, 250, 0)', '#FFFFFF', 'rgba(96, 165, 250, 0)']}
                                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                    style={{ flex: 1 }}
                                />
                            </Animated.View>
                        </View>

                        <View style={styles.loaderLabels}>
                            <Text style={styles.loaderTextLeft}>System Check</Text>
                            <Text style={styles.loaderTextRight}>Loading...</Text>
                        </View>
                    </View>

                    {/* Footer Info */}
                    <View style={styles.footer}>
                        <Text style={styles.versionText}>v2.4.0 (Build 892)</Text>
                        <View style={styles.secureBadge}>
                            <FontAwesomeIcon icon={faLock} size={10} color="#FFFFFF" />
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
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 32,
        zIndex: 10,
    },
    centerSection: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
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
        backgroundColor: 'rgba(96, 165, 250, 0.3)', // blue-400
        // blurRadius would go here if using BlurView, opacity simulates it
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
    shadowIcon: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    statusDot: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 16,
        height: 16,
        backgroundColor: '#4ADE80', // green-400
        borderColor: '#1E40AF',
        borderWidth: 2,
        borderRadius: 8,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 8,
    },
    appName: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -1,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        textAlign: 'center',
    },
    appSubtitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#BFDBFE', // blue-200
        letterSpacing: 4, // tracking-[0.3em] roughly
        textTransform: 'uppercase',
        marginTop: 4,
        textAlign: 'center',
    },
    tagline: {
        marginTop: 16,
        color: '#DBEAFE', // blue-100/80
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
    loaderWrapper: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 24,
    },
    loadingTrack: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(30, 58, 138, 0.5)', // blue-900/50
        borderRadius: 999,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        marginBottom: 8,
    },
    loadingBar: {
        width: '60%', // Fixed width for the moving bar
        height: '100%',
        borderRadius: 999,
    },
    loaderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    loaderTextLeft: {
        fontSize: 10,
        fontWeight: '600',
        color: '#93C5FD', // blue-300
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    loaderTextRight: {
        fontSize: 10,
        fontWeight: '600',
        color: '#93C5FD', // blue-300
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    footer: {
        alignItems: 'center',
    },
    versionText: {
        fontSize: 10,
        color: 'rgba(147, 197, 253, 0.6)', // blue-300/60
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

export default SplashScreen;
