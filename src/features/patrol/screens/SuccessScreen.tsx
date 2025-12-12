/**
 * E-GOV-GUARDS-PORTAL - Success Screen
 * Screen 12: Transaction Complete
 * 
 * Features:
 * - Centered success animation
 * - Transaction summary card
 * - Print/Email/Return action buttons
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../../config/colors';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

interface SuccessParams {
    title?: string;
    message?: string;
    transactionId?: string;
    details?: {
        label: string;
        value: string;
    }[];
    primaryAction?: {
        label: string;
        route: string;
    };
}

const SuccessScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<{ params: SuccessParams }, 'params'>>();

    const {
        title = 'Success!',
        message = 'Your transaction has been completed successfully.',
        transactionId = 'TXN-' + Date.now().toString().slice(-8),
        details = [
            { label: 'Reference', value: 'REF-2024-001234' },
            { label: 'Date', value: new Date().toLocaleDateString() },
            { label: 'Time', value: new Date().toLocaleTimeString() },
        ],
        primaryAction = { label: 'Return to Dashboard', route: 'MapScreen' },
    } = route.params || {};

    const handlePrimaryAction = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: primaryAction.route as never }],
        });
    };

    const handlePrint = () => {
        // Print functionality
    };

    const handleEmail = () => {
        // Email functionality
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.content}>
                {/* Success Icon */}
                <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <Icon name="check" size={48} color="#FFFFFF" />
                    </View>
                    <View style={styles.iconRing} />
                    <View style={styles.iconRingOuter} />
                </View>

                {/* Title & Message */}
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>

                {/* Transaction Card */}
                <View style={styles.transactionCard}>
                    <View style={styles.transactionHeader}>
                        <Icon name="receipt" size={16} color={colors.primary} />
                        <Text style={styles.transactionTitle}>Transaction Details</Text>
                    </View>

                    <View style={styles.transactionId}>
                        <Text style={styles.transactionIdLabel}>Transaction ID</Text>
                        <Text style={styles.transactionIdValue}>{transactionId}</Text>
                    </View>

                    <View style={styles.divider} />

                    {details.map((detail, index) => (
                        <View key={index} style={styles.detailRow}>
                            <Text style={styles.detailLabel}>{detail.label}</Text>
                            <Text style={styles.detailValue}>{detail.value}</Text>
                        </View>
                    ))}
                </View>

                {/* Share Options */}
                <View style={styles.shareOptions}>
                    <TouchableOpacity style={styles.shareButton} onPress={handlePrint}>
                        <Icon name="print" size={18} color={colors.primary} />
                        <Text style={styles.shareButtonText}>Print</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareButton} onPress={handleEmail}>
                        <Icon name="envelope" size={18} color={colors.primary} />
                        <Text style={styles.shareButtonText}>Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareButton}>
                        <Icon name="share-alt" size={18} color={colors.primary} />
                        <Text style={styles.shareButtonText}>Share</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Primary Action Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.primaryButton} onPress={handlePrimaryAction}>
                    <Text style={styles.primaryButtonText}>{primaryAction.label}</Text>
                    <Icon name="arrow-right" size={16} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 60,
    },

    // Icon
    iconContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.status.success,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.status.success,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
        zIndex: 3,
    },
    iconRing: {
        position: 'absolute',
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        zIndex: 2,
    },
    iconRingOuter: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        zIndex: 1,
    },

    // Text
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
        paddingHorizontal: 16,
    },

    // Transaction Card
    transactionCard: {
        width: '100%',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    transactionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    transactionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
        marginLeft: 8,
    },
    transactionId: {
        backgroundColor: '#FFFFFF',
        padding: 14,
        borderRadius: 10,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    transactionIdLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#9CA3AF',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    transactionIdValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        letterSpacing: 1,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    detailLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },

    // Share Options
    shareOptions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginTop: 24,
    },
    shareButton: {
        alignItems: 'center',
        padding: 12,
    },
    shareButtonText: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '500',
        marginTop: 4,
    },

    // Footer
    footer: {
        padding: 20,
        paddingBottom: 32,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 10,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});

export default SuccessScreen;
