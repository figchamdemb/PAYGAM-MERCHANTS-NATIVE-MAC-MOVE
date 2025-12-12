import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
} from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';

type RegistrationCompleteScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'RegistrationComplete'>;
type RegistrationCompleteScreenRouteProp = RouteProp<AuthStackParamList, 'RegistrationComplete'>;

const RegistrationCompleteScreen: React.FC = () => {
    const navigation = useNavigation<RegistrationCompleteScreenNavigationProp>();
    const route = useRoute<RegistrationCompleteScreenRouteProp>();
    const { theme, isDarkMode } = useTheme();
    const registrationData = route.params?.registrationData || {};
    
    // Get user name from registration data
    const userName = registrationData.firstName || 'Citizen';

    const handleReturnToLogin = () => {
        // Reset navigation stack and go to Login
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    // Icons
    const ShieldIcon = () => (
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="#FFFFFF">
            <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </Svg>
    );

    const CheckIcon = () => (
        <Svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M20 6L9 17l-5-5" />
        </Svg>
    );

    const HourglassIcon = () => (
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2M7 22v-4.172a2 2 0 0 1 .586-1.414L12 12 7.586 7.586A2 2 0 0 1 7 6.172V2" />
        </Svg>
    );

    const CheckSmallIcon = () => (
        <Svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M20 6L9 17l-5-5" />
        </Svg>
    );

    const FileIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </Svg>
    );

    const ArrowRightIcon = () => (
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M5 12h14M12 5l7 7-7 7" />
        </Svg>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.logoCircle}>
                        <ShieldIcon />
                    </View>
                    <Text style={styles.headerTitle}>EGOV-CITIZEN</Text>
                </View>
            </View>

            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Success Hero */}
                    <View style={styles.heroSection}>
                        <View style={styles.successCircleContainer}>
                            <View style={styles.successCircle}>
                                <CheckIcon />
                            </View>
                            <View style={styles.doneBadge}>
                                <Text style={styles.doneBadgeText}>DONE</Text>
                            </View>
                        </View>

                        <Text style={styles.title}>Registration Submitted!</Text>
                        <Text style={styles.subtitle}>
                            Thank you, <Text style={styles.userName}>{userName}</Text>. Your profile and address details have been securely received.
                        </Text>
                    </View>

                    {/* Status Card */}
                    <View style={styles.statusCard}>
                        <View style={styles.statusHeader}>
                            <View style={styles.statusHeaderLeft}>
                                <View style={styles.statusIcon}>
                                    <HourglassIcon />
                                </View>
                                <View>
                                    <Text style={styles.statusLabel}>CURRENT STATUS</Text>
                                    <Text style={styles.statusValue}>Pending Verification</Text>
                                </View>
                            </View>
                            <View style={styles.refBadge}>
                                <Text style={styles.refBadgeText}>Ref: #GG-8921</Text>
                            </View>
                        </View>

                        <View style={styles.statusBody}>
                            <Text style={styles.sectionTitle}>What happens next?</Text>

                            {/* Timeline */}
                            <View style={styles.timeline}>
                                {/* Step 1 - Complete */}
                                <View style={styles.timelineItem}>
                                    <View style={styles.timelineDot}>
                                        <View style={[styles.dot, styles.dotComplete]}>
                                            <CheckSmallIcon />
                                        </View>
                                        <View style={styles.timelineLine} />
                                    </View>
                                    <View style={styles.timelineContent}>
                                        <Text style={styles.timelineTitle}>Submission Received</Text>
                                        <Text style={styles.timelineTime}>Today, 10:42 AM</Text>
                                    </View>
                                </View>

                                {/* Step 2 - Active */}
                                <View style={styles.timelineItem}>
                                    <View style={styles.timelineDot}>
                                        <View style={[styles.dot, styles.dotActive]} />
                                        <View style={styles.timelineLine} />
                                    </View>
                                    <View style={styles.timelineContent}>
                                        <Text style={styles.timelineTitle}>Identity Verification</Text>
                                        <Text style={styles.timelineTimeActive}>In Progress (1-2 Days)</Text>
                                        <Text style={styles.timelineDescription}>
                                            We are verifying your National ID and personal details.
                                        </Text>
                                    </View>
                                </View>

                                {/* Step 3 - Pending */}
                                <View style={[styles.timelineItem, styles.timelineItemPending]}>
                                    <View style={styles.timelineDot}>
                                        <View style={[styles.dot, styles.dotPending]} />
                                        <View style={styles.timelineLine} />
                                    </View>
                                    <View style={styles.timelineContent}>
                                        <Text style={styles.timelineTitle}>Address Verification</Text>
                                        <Text style={styles.timelineTime}>Pending</Text>
                                    </View>
                                </View>

                                {/* Step 4 - Pending */}
                                <View style={[styles.timelineItem, styles.timelineItemPending, styles.timelineItemLast]}>
                                    <View style={styles.timelineDot}>
                                        <View style={[styles.dot, styles.dotPending]} />
                                    </View>
                                    <View style={styles.timelineContent}>
                                        <Text style={styles.timelineTitle}>Account Activation</Text>
                                        <Text style={styles.timelineTime}>Final Step</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Summary Preview */}
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryHeader}>
                            <FileIcon />
                            <Text style={styles.summaryTitle}>Submitted Details</Text>
                        </View>

                        <View style={styles.summaryList}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Full Name</Text>
                                <Text style={styles.summaryValue}>Fatou Ceesay</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Phone</Text>
                                <Text style={styles.summaryValue}>+220 345 6789</Text>
                            </View>
                            <View style={[styles.summaryItem, styles.summaryItemLast]}>
                                <Text style={styles.summaryLabel}>Address</Text>
                                <Text style={[styles.summaryValue, styles.summaryValueAddress]}>
                                    Compound #42, Kairaba Avenue, Kanifing Municipality
                                </Text>
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </SafeAreaView>

            {/* Sticky Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.returnButton}
                    onPress={handleReturnToLogin}
                    activeOpacity={0.9}
                >
                    <Text style={styles.returnButtonText}>Return to Login</Text>
                    <ArrowRightIcon />
                </TouchableOpacity>
                <Text style={styles.footerHelp}>
                    Need help?{' '}
                    <Text style={styles.footerLink}>Contact Support</Text>
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        backgroundColor: '#B45309',
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    logoCircle: {
        width: 32,
        height: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        paddingBottom: 120,
    },
    heroSection: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    successCircleContainer: {
        position: 'relative',
        marginBottom: 24,
    },
    successCircle: {
        width: 96,
        height: 96,
        backgroundColor: '#DCFCE7',
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        borderWidth: 8,
        borderColor: '#F0FDF4',
    },
    doneBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#B45309',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    doneBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: 300,
    },
    userName: {
        fontWeight: '600',
        color: '#111827',
    },
    statusCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 24,
        overflow: 'hidden',
    },
    statusHeader: {
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#FED7AA',
    },
    statusHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statusIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(180, 83, 9, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#6B7280',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    statusValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#B45309',
    },
    refBadge: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#FED7AA',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    refBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#D97706',
    },
    statusBody: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    timeline: {
        paddingLeft: 16,
        borderLeftWidth: 2,
        borderLeftColor: '#F3F4F6',
    },
    timelineItem: {
        position: 'relative',
        marginBottom: 24,
    },
    timelineItemPending: {
        opacity: 0.6,
    },
    timelineItemLast: {
        marginBottom: 0,
    },
    timelineDot: {
        position: 'absolute',
        left: -25,
        top: 4,
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dotComplete: {
        backgroundColor: '#22C55E',
    },
    dotActive: {
        backgroundColor: '#B45309',
    },
    dotPending: {
        backgroundColor: '#E5E7EB',
    },
    timelineLine: {
        width: 2,
        height: 40,
        backgroundColor: '#F3F4F6',
        position: 'absolute',
        left: 7,
        top: 16,
    },
    timelineContent: {
        paddingLeft: 8,
    },
    timelineTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    timelineTime: {
        fontSize: 12,
        color: '#6B7280',
    },
    timelineTimeActive: {
        fontSize: 12,
        color: '#B45309',
        fontWeight: '600',
    },
    timelineDescription: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
        lineHeight: 16,
    },
    summaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        padding: 20,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    summaryTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    summaryList: {
        gap: 12,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB',
    },
    summaryItemLast: {
        borderBottomWidth: 0,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    summaryValueAddress: {
        textAlign: 'right',
        maxWidth: '60%',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 10,
    },
    returnButton: {
        backgroundColor: '#B45309',
        borderRadius: 12,
        paddingVertical: 14,
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
    returnButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    footerHelp: {
        textAlign: 'center',
        fontSize: 10,
        color: '#9CA3AF',
        marginTop: 12,
    },
    footerLink: {
        color: '#B45309',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});

export default RegistrationCompleteScreen;
