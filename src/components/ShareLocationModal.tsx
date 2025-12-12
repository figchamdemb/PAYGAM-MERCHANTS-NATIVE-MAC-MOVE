import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Alert,
} from 'react-native';
import { Svg, Path, Circle, Rect } from 'react-native-svg';

type ShareLocationModalProps = {
    visible: boolean;
    onClose: () => void;
    location?: {
        address: string;
        area: string;
        latitude: number;
        longitude: number;
        accuracy: string;
    };
};

const ShareLocationModal: React.FC<ShareLocationModalProps> = ({
    visible,
    onClose,
    location = {
        address: '14 Kairaba Avenue',
        area: 'Serrekunda, The Gambia',
        latitude: 13.4549,
        longitude: 16.5790,
        accuracy: '±5m',
    },
}) => {
    const handleWhatsApp = () => {
        const message = `${location.address}, ${location.area}\n${location.latitude}° N, ${location.longitude}° W`;
        Alert.alert('WhatsApp', `Sharing: ${message}`);
    };

    const handleSMS = () => {
        const message = `${location.address}, ${location.area}\n${location.latitude}° N, ${location.longitude}° W`;
        Alert.alert('SMS', `Sending: ${message}`);
    };

    const handleCopyLink = () => {
        Alert.alert('Copied!', 'Location coordinates copied to clipboard');
    };

    // Icons
    const CloseIcon = () => (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M18 6L6 18M6 6l12 12" />
        </Svg>
    );

    const LocationDotIcon = () => (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="#B45309">
            <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </Svg>
    );

    const SatelliteIcon = () => (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M13 7L9 3 5 7l4 4 4-4zM17 11l2-2M19 13l2-2M21 15l-4-4-4 4 4 4 4-4z" />
        </Svg>
    );

    const WhatsAppIcon = () => (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="#FFFFFF">
            <Path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
        </Svg>
    );

    const MessageIcon = () => (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </Svg>
    );

    const LinkIcon = () => (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </Svg>
    );

    const ChevronRightIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M9 18l6-6-6-6" />
        </Svg>
    );

    const ShieldIcon = () => (
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </Svg>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>

                    {/* Drag Handle */}
                    <View style={styles.dragHandle} />

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerText}>
                            <Text style={styles.title}>Share Location</Text>
                            <Text style={styles.subtitle}>Send your current coordinates to help.</Text>
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <CloseIcon />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>

                        {/* Location Card */}
                        <View style={styles.locationCard}>
                            <View style={styles.locationCardBar} />
                            <View style={styles.locationCardContent}>
                                <View style={styles.locationIconCircle}>
                                    <LocationDotIcon />
                                </View>
                                <View style={styles.locationInfo}>
                                    <Text style={styles.locationTitle}>CURRENT POSITION</Text>
                                    <Text style={styles.locationAddress}>{location.address}</Text>
                                    <Text style={styles.locationArea}>{location.area}</Text>

                                    <View style={styles.locationMeta}>
                                        <View style={styles.coordsBadge}>
                                            <Text style={styles.coordsText}>
                                                {location.latitude}° N, {location.longitude}° W
                                            </Text>
                                        </View>
                                        <View style={styles.accuracyBadge}>
                                            <SatelliteIcon />
                                            <Text style={styles.accuracyText}>{location.accuracy}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionButtons}>
                            {/* WhatsApp */}
                            <TouchableOpacity
                                style={[styles.actionButton, styles.whatsappButton]}
                                onPress={handleWhatsApp}
                                activeOpacity={0.85}
                            >
                                <View style={styles.actionButtonLeft}>
                                    <View style={styles.actionIconCircle}>
                                        <WhatsAppIcon />
                                    </View>
                                    <View>
                                        <Text style={styles.actionButtonTitle}>WhatsApp</Text>
                                        <Text style={styles.actionButtonSubtitle}>Share via message</Text>
                                    </View>
                                </View>
                                <ChevronRightIcon />
                            </TouchableOpacity>

                            {/* SMS */}
                            <TouchableOpacity
                                style={[styles.actionButton, styles.smsButton]}
                                onPress={handleSMS}
                                activeOpacity={0.85}
                            >
                                <View style={styles.actionButtonLeft}>
                                    <View style={styles.actionIconCircle}>
                                        <MessageIcon />
                                    </View>
                                    <View>
                                        <Text style={styles.actionButtonTitle}>SMS Message</Text>
                                        <Text style={styles.actionButtonSubtitle}>Send text directly</Text>
                                    </View>
                                </View>
                                <ChevronRightIcon />
                            </TouchableOpacity>

                            {/* Copy Link */}
                            <TouchableOpacity
                                style={[styles.actionButton, styles.copyButton]}
                                onPress={handleCopyLink}
                                activeOpacity={0.85}
                            >
                                <View style={styles.actionButtonLeft}>
                                    <View style={styles.copyIconCircle}>
                                        <LinkIcon />
                                    </View>
                                    <View>
                                        <Text style={styles.copyButtonTitle}>Copy Link</Text>
                                        <Text style={styles.copyButtonSubtitle}>Copy coordinates to clipboard</Text>
                                    </View>
                                </View>
                                <View style={styles.copyBadge}>
                                    <Text style={styles.copyBadgeText}>COPY</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Warning */}
                        <View style={styles.warningBox}>
                            <ShieldIcon />
                            <Text style={styles.warningText}>
                                <Text style={styles.warningBold}>Security Warning:</Text> Only share your exact live location with trusted contacts or emergency services. This link provides real-time access to your position.
                            </Text>
                        </View>

                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    dragHandle: {
        width: 48,
        height: 6,
        backgroundColor: '#D1D5DB',
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 4,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 16,
    },
    locationCard: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        position: 'relative',
        overflow: 'hidden',
    },
    locationCardBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 6,
        backgroundColor: '#B45309',
    },
    locationCardContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
        paddingLeft: 8,
    },
    locationIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FED7AA',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    locationInfo: {
        flex: 1,
    },
    locationTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#111827',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    locationAddress: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        lineHeight: 22,
    },
    locationArea: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
    },
    locationMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    coordsBadge: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    coordsText: {
        fontSize: 12,
        fontFamily: 'monospace',
        color: '#6B7280',
    },
    accuracyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    accuracyText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#16A34A',
    },
    actionButtons: {
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    whatsappButton: {
        backgroundColor: '#25D366',
    },
    smsButton: {
        backgroundColor: '#3B82F6',
    },
    copyButton: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    actionButtonLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    actionIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    copyIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    actionButtonTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    actionButtonSubtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    copyButtonTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    copyButtonSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    copyBadge: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    copyBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
    },
    warningBox: {
        backgroundColor: '#FFF7ED',
        borderWidth: 1,
        borderColor: '#FED7AA',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginTop: 24,
    },
    warningText: {
        flex: 1,
        fontSize: 12,
        color: '#9A3412',
        lineHeight: 18,
    },
    warningBold: {
        fontWeight: '700',
    },
    footer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: 'rgba(249, 250, 251, 0.5)',
    },
    cancelButton: {
        width: '100%',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
});

export default ShareLocationModal;
