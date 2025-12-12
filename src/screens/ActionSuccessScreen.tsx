import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Animated,
} from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';

type ActionSuccessScreenProps = {
    title?: string;
    message?: string;
    reportId?: string;
    reportType?: string;
    location?: string;
    time?: string;
    status?: string;
};

const ActionSuccessScreen: React.FC<ActionSuccessScreenProps> = ({
    title = 'Report Submitted',
    message = 'Your report has been successfully received. Help is on the way to your location.',
    reportId = '#GG-89204',
    reportType = 'Emergency Assistance',
    location = 'Kairaba Avenue, Serrekunda',
    time = '10:42 AM',
    status = 'Dispatched',
}) => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const { theme, isDarkMode } = useTheme();
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Scale up animation
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
        }).start();

        // Pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handleReturnHome = () => {
        navigation.navigate('Home');
    };

    const handleViewDetails = () => {
        console.log('View report details');
    };

    // Icons
    const CheckIcon = () => (
        <Svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M5 13l4 4L19 7" />
        </Svg>
    );

    const AlertIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <Path d="M12 9v4M12 17h.01" />
        </Svg>
    );

    const MapPinIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <Circle cx="12" cy="10" r="3" />
        </Svg>
    );

    const ClockIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="12" r="10" />
            <Path d="M12 6v6l4 2" />
        </Svg>
    );

    const HomeIcon = () => (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <Path d="M9 22V12h6v10" />
        </Svg>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>

                    {/* Animated Success Icon */}
                    <View style={styles.iconContainer}>
                        <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
                        <View style={styles.staticRing} />
                        <Animated.View
                            style={[
                                styles.checkCircle,
                                { transform: [{ scale: scaleAnim }] }
                            ]}
                        >
                            <CheckIcon />
                        </Animated.View>
                    </View>

                    {/* Success Text */}
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    {/* Summary Card */}
                    <View style={styles.summaryCard}>
                        <View style={styles.reportIdRow}>
                            <Text style={styles.reportIdLabel}>REPORT ID</Text>
                            <Text style={styles.reportIdValue}>{reportId}</Text>
                        </View>

                        <View style={styles.detailsContainer}>
                            {/* Type */}
                            <View style={styles.detailRow}>
                                <View style={styles.detailLeft}>
                                    <View style={styles.iconCircleOrange}>
                                        <AlertIcon />
                                    </View>
                                    <View>
                                        <Text style={styles.detailLabel}>Type</Text>
                                        <Text style={styles.detailValue}>{reportType}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Location */}
                            <View style={styles.detailRow}>
                                <View style={styles.detailLeft}>
                                    <View style={styles.iconCircleBlue}>
                                        <MapPinIcon />
                                    </View>
                                    <View>
                                        <Text style={styles.detailLabel}>Location</Text>
                                        <Text style={styles.detailValue}>{location}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Time */}
                            <View style={styles.detailRow}>
                                <View style={styles.detailLeft}>
                                    <View style={styles.iconCirclePurple}>
                                        <ClockIcon />
                                    </View>
                                    <View>
                                        <Text style={styles.detailLabel}>Time Submitted</Text>
                                        <Text style={styles.detailValue}>{time}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Status */}
                        <View style={styles.statusRow}>
                            <Text style={styles.statusLabel}>Current Status</Text>
                            <View style={styles.statusBadge}>
                                <View style={styles.statusDot} />
                                <Text style={styles.statusText}>{status}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Spacer */}
                    <View style={styles.spacer} />

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.homeButton}
                            onPress={handleReturnHome}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.homeButtonText}>Return to Home</Text>
                            <HomeIcon />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.detailsButton}
                            onPress={handleViewDetails}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.detailsButtonText}>View Report Details</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 24,
        alignItems: 'center',
    },
    iconContainer: {
        width: 128,
        height: 128,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        position: 'relative',
    },
    pulseRing: {
        position: 'absolute',
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: '#D1FAE5',
        opacity: 0.75,
    },
    staticRing: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F0FDF4',
    },
    checkCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#22C55E',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#22C55E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: 300,
        marginBottom: 40,
    },
    summaryCard: {
        width: '100%',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    reportIdRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 16,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    reportIdLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    reportIdValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#374151',
        fontFamily: 'monospace',
    },
    detailsContainer: {
        gap: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    detailLeft: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconCircleOrange: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FED7AA',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    iconCircleBlue: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    iconCirclePurple: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3E8FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    detailLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    statusLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 12,
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#22C55E',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#15803D',
    },
    spacer: {
        flex: 1,
    },
    actionButtons: {
        width: '100%',
        gap: 12,
        marginTop: 32,
    },
    homeButton: {
        width: '100%',
        backgroundColor: '#B45309',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#78350F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    homeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    detailsButton: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
    },
    detailsButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
});

export default ActionSuccessScreen;
