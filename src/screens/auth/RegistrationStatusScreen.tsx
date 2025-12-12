import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../config/colors';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Types for navigation
type RegistrationStatusScreenNavigationProp = StackNavigationProp<any>;

const RegistrationStatusScreen: React.FC = () => {
    const navigation = useNavigation<RegistrationStatusScreenNavigationProp>();
    const { theme, isDarkMode } = useTheme();

    // Icons
    const ArrowLeftIcon = () => (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M19 12H5" />
            <Path d="M12 19l-7-7 7-7" />
        </Svg>
    );

    const QuestionIcon = () => (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx={12} cy={12} r={10} />
            <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <Path d="M12 17h.01" />
        </Svg>
    );

    const CheckIcon = () => (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M20 6L9 17l-5-5" />
        </Svg>
    );

    const MapIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <Circle cx={12} cy={10} r={3} />
        </Svg>
    );

    const ArrowRightIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M5 12h14" />
            <Path d="M12 5l7 7-7 7" />
        </Svg>
    );

    const LockIcon = () => (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
            <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </Svg>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                        <ArrowLeftIcon />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Registration Status</Text>
                    <TouchableOpacity style={styles.iconButton}>
                        <QuestionIcon />
                    </TouchableOpacity>
                </View>

                {/* Progress Overview */}
                <View style={styles.progressOverview}>
                    <Text style={styles.progressLabel}>Profile Completion</Text>
                    <Text style={styles.progressValue}>50%</Text>
                </View>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '50%' }]} />
                </View>
                <Text style={styles.progressHelper}>Just 2 more steps to secure your account.</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Step 1: Personal Details (Completed) */}
                <View style={styles.stepRow}>
                    <View style={styles.timelineColumn}>
                        <View style={styles.checkCircle}>
                            <CheckIcon />
                        </View>
                        <View style={[styles.timelineLine, { backgroundColor: '#16A34A' }]} />
                    </View>
                    <View style={[styles.stepContent, { opacity: 0.6 }]}>
                        <View style={styles.stepHeader}>
                            <Text style={styles.stepTitle}>Personal Details</Text>
                            <View style={styles.statusBadgeCompleted}>
                                <Text style={styles.statusTextCompleted}>Completed</Text>
                            </View>
                        </View>
                        <Text style={styles.stepDescription}>Name, DOB, Nationality</Text>
                    </View>
                </View>

                {/* Step 2: Profile Setup (Completed) */}
                <View style={styles.stepRow}>
                    <View style={styles.timelineColumn}>
                        <View style={styles.checkCircle}>
                            <CheckIcon />
                        </View>
                        <View style={[styles.timelineLine, { backgroundColor: '#D1D5DB' }]} />
                    </View>
                    <View style={[styles.stepContent, { opacity: 0.6 }]}>
                        <View style={styles.stepHeader}>
                            <Text style={styles.stepTitle}>Profile Setup</Text>
                            <View style={styles.statusBadgeCompleted}>
                                <Text style={styles.statusTextCompleted}>Completed</Text>
                            </View>
                        </View>
                        <Text style={styles.stepDescription}>Username, Avatar, Bio</Text>
                    </View>
                </View>

                {/* Step 3: Address (Current / Active) */}
                <View style={styles.stepRow}>
                    <View style={styles.timelineColumn}>
                        <View style={styles.activeStepCircle}>
                            <Text style={styles.activeStepNumber}>3</Text>
                        </View>
                        <View style={[styles.timelineLine, { backgroundColor: '#E5E7EB' }]} />
                    </View>
                    <View style={styles.stepContent}>
                        <View style={styles.activeCard}>
                            <View style={styles.activeCardBorder} />
                            <View style={styles.stepHeader}>
                                <Text style={styles.activeCardTitle}>Address Info</Text>
                                <View style={styles.statusBadgeProgress}>
                                    <Text style={styles.statusTextProgress}>In Progress</Text>
                                </View>
                            </View>
                            <Text style={styles.activeCardDescription}>
                                We need your current residential address in The Gambia for regional alerts.
                            </Text>

                            <View style={styles.activeCardDetail}>
                                <View style={styles.detailIconCircle}>
                                    <MapIcon />
                                </View>
                                <View style={styles.detailLines}>
                                    <View style={styles.detailLineLong} />
                                    <View style={styles.detailLineShort} />
                                </View>
                            </View>

                            <TouchableOpacity style={styles.resumeButton} activeOpacity={0.9}>
                                <Text style={styles.resumeButtonText}>Resume Registration</Text>
                                <ArrowRightIcon />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Step 4: Verification (Locked) */}
                <View style={styles.stepRow}>
                    <View style={styles.timelineColumn}>
                        <View style={styles.lockedCircle}>
                            <LockIcon />
                        </View>
                        {/* No line after last step */}
                    </View>
                    <View style={[styles.stepContent, { opacity: 0.5, paddingBottom: 24 }]}>
                        <View style={styles.stepHeader}>
                            <Text style={styles.stepTitle}>Identity Verification</Text>
                            <View style={styles.statusBadgePending}>
                                <Text style={styles.statusTextPending}>Pending</Text>
                            </View>
                        </View>
                        <Text style={styles.stepDescription}>ID Card Upload, Selfie</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Bottom Action / Help */}
            <View style={styles.bottomBar}>
                <View style={styles.helpRow}>
                    <Text style={styles.helpText}>Having trouble?</Text>
                    <TouchableOpacity>
                        <Text style={styles.contactSupportText}>Contact Support</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // gray-50
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'android' ? 48 : 60,
        paddingBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        zIndex: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6', // gray-100
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827', // gray-900
    },
    progressOverview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280', // gray-500
    },
    progressValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#B45309',
    },
    progressBarBg: {
        width: '100%',
        height: 10,
        backgroundColor: '#E5E7EB', // gray-200
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#B45309',
        borderRadius: 5,
    },
    progressHelper: {
        fontSize: 12,
        color: '#6B7280', // gray-500
        marginTop: 8,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 100,
    },
    stepRow: {
        flexDirection: 'row',
        gap: 16,
    },
    timelineColumn: {
        alignItems: 'center',
        width: 32,
    },
    checkCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#DCFCE7', // green-100
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#16A34A', // green-600
        zIndex: 10,
    },
    timelineLine: {
        flex: 1,
        width: 2,
        marginVertical: 4,
    },
    stepContent: {
        flex: 1,
        paddingBottom: 32,
    },
    stepHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    stepTitle: {
        fontWeight: '700',
        color: '#111827', // gray-900
        fontSize: 16,
    },
    statusBadgeCompleted: {
        backgroundColor: '#F0FDF4', // green-50
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    statusTextCompleted: {
        fontSize: 12,
        fontWeight: '500',
        color: '#16A34A', // green-600
    },
    stepDescription: {
        fontSize: 14,
        color: '#6B7280', // gray-500
    },
    activeStepCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#B45309',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FED7AA', // orange-200
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 4,
        zIndex: 10,
        borderWidth: 4,
        borderColor: '#FFF7ED', // orange-50
    },
    activeStepNumber: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    activeCard: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6', // gray-100
        overflow: 'hidden',
        position: 'relative',
    },
    activeCardBorder: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 4,
        backgroundColor: '#B45309',
    },
    activeCardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827', // gray-900
    },
    statusBadgeProgress: {
        backgroundColor: '#FFF7ED', // orange-50
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusTextProgress: {
        fontSize: 12,
        fontWeight: '700',
        color: '#B45309',
    },
    activeCardDescription: {
        fontSize: 14,
        color: '#6B7280', // gray-500
        marginBottom: 16,
        lineHeight: 20,
    },
    activeCardDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#F9FAFB', // gray-50
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6', // gray-100
    },
    detailIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    detailLines: {
        flex: 1,
        gap: 6,
    },
    detailLineLong: {
        height: 8,
        width: 96,
        backgroundColor: '#E5E7EB', // gray-200
        borderRadius: 4,
    },
    detailLineShort: {
        height: 8,
        width: 64,
        backgroundColor: '#E5E7EB', // gray-200
        borderRadius: 4,
    },
    resumeButton: {
        width: '100%',
        paddingVertical: 12,
        backgroundColor: '#B45309',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#FED7AA', // orange-200
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 4,
    },
    resumeButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
    lockedCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6', // gray-100
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#E5E7EB', // gray-200
        zIndex: 10,
    },
    statusBadgePending: {
        backgroundColor: '#F3F4F6', // gray-100
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    statusTextPending: {
        fontSize: 12,
        fontWeight: '500',
        color: '#9CA3AF', // gray-400
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6', // gray-100
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 32 : 16,
        zIndex: 20,
    },
    helpRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    helpText: {
        fontSize: 14,
        color: '#6B7280', // gray-500
    },
    contactSupportText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#B45309',
    },
});

export default RegistrationStatusScreen;
