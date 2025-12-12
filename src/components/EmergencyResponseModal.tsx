/**
 * EmergencyResponseModal - Reusable popup for live emergency responses
 * Shows confirmation after sending Police, Fire, or Ambulance alerts
 * Includes "Do you want us to call you?" option
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

// ============ SVG ICON COMPONENTS ============

const CheckCircleIcon = ({ size = 60, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M9 12l2 2 4-4" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PhoneIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

const CloseIcon = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const PoliceIcon = ({ size = 32, color = '#1E3A8A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
  </Svg>
);

const FireIcon = ({ size = 32, color = '#DC2626' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 12.9a2.1 2.1 0 100 4.2 2.1 2.1 0 000-4.2zM6 9c0-3.31 2.69-6 6-6s6 2.69 6 6c0 .35-.03.69-.09 1.02C16.16 8.77 14.21 8 12 8s-4.16.77-5.91 2.02C6.03 9.69 6 9.35 6 9zm6-3c-1.52 0-2.94.49-4.1 1.32-.1.73-.15 1.46-.15 2.18 0 3.73 2.43 6.82 5.75 7.87.25.08.5.13.75.13s.5-.05.75-.13C18.32 16.32 20.75 13.23 20.75 9.5c0-.72-.05-1.45-.15-2.18C19.44 6.49 18.02 6 16.5 6 14.98 6 13.52 6.49 12 6z" />
  </Svg>
);

const AmbulanceIcon = ({ size = 32, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM7 10h2v2H7v-2zm4 0h2v2h-2v-2z" />
  </Svg>
);

export type EmergencyType = 'police' | 'fire' | 'ambulance';

interface EmergencyResponseModalProps {
  visible: boolean;
  emergencyType: EmergencyType;
  onClose: () => void;
  onCallRequest: (wantsCall: boolean) => void;
  referenceNumber?: string;
}

const getEmergencyConfig = (type: EmergencyType) => {
  switch (type) {
    case 'police':
      return {
        title: 'Police Alert Sent!',
        subtitle: 'Your emergency has been reported to the police',
        color: '#1E3A8A',
        bgColor: '#EFF6FF',
        Icon: PoliceIcon,
        unit: 'Police Unit',
      };
    case 'fire':
      return {
        title: 'Fire Alert Sent!',
        subtitle: 'Fire department has been notified',
        color: '#DC2626',
        bgColor: '#FEF2F2',
        Icon: FireIcon,
        unit: 'Fire Brigade',
      };
    case 'ambulance':
      return {
        title: 'Ambulance Requested!',
        subtitle: 'Medical team is being dispatched',
        color: '#EF4444',
        bgColor: '#FEF2F2',
        Icon: AmbulanceIcon,
        unit: 'Medical Team',
      };
  }
};

const EmergencyResponseModal: React.FC<EmergencyResponseModalProps> = ({
  visible,
  emergencyType,
  onClose,
  onCallRequest,
  referenceNumber = 'EMR-' + Date.now().toString().slice(-8),
}) => {
  const [showCallOption, setShowCallOption] = useState(true);
  const config = getEmergencyConfig(emergencyType);

  const handleYesCall = () => {
    onCallRequest(true);
    setShowCallOption(false);
  };

  const handleNoCall = () => {
    onCallRequest(false);
    setShowCallOption(false);
  };

  const handleDone = () => {
    setShowCallOption(true); // Reset for next time
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDone}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { borderTopColor: config.color }]}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={handleDone}>
            <CloseIcon size={20} color="#6B7280" />
          </TouchableOpacity>

          {/* Success Icon */}
          <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
            <CheckCircleIcon size={60} color={config.color} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: config.color }]}>{config.title}</Text>
          <Text style={styles.subtitle}>{config.subtitle}</Text>

          {/* Reference Number */}
          <View style={styles.refContainer}>
            <Text style={styles.refLabel}>Reference Number:</Text>
            <Text style={[styles.refNumber, { color: config.color }]}>{referenceNumber}</Text>
          </View>

          {/* Status Info */}
          <View style={[styles.statusCard, { backgroundColor: config.bgColor }]}>
            <config.Icon size={28} color={config.color} />
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>{config.unit} Notified</Text>
              <Text style={styles.statusSubtitle}>Estimated response: 5-10 minutes</Text>
            </View>
          </View>

          {/* Call Option */}
          {showCallOption ? (
            <View style={styles.callOptionContainer}>
              <View style={styles.callQuestion}>
                <PhoneIcon size={20} color={config.color} />
                <Text style={styles.callQuestionText}>
                  Do you want us to call you?
                </Text>
              </View>
              <View style={styles.callButtonsRow}>
                <TouchableOpacity
                  style={[styles.callBtn, styles.callBtnYes, { backgroundColor: config.color }]}
                  onPress={handleYesCall}
                >
                  <PhoneIcon size={18} color="#FFFFFF" />
                  <Text style={styles.callBtnTextYes}>Yes, Call Me</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.callBtn, styles.callBtnNo]}
                  onPress={handleNoCall}
                >
                  <Text style={styles.callBtnTextNo}>No Thanks</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={[styles.confirmationBanner, { backgroundColor: config.bgColor }]}>
              <CheckCircleIcon size={24} color={config.color} />
              <Text style={[styles.confirmationText, { color: config.color }]}>
                Your preference has been saved!
              </Text>
            </View>
          )}

          {/* Done Button */}
          <TouchableOpacity
            style={[styles.doneButton, { backgroundColor: config.color }]}
            onPress={handleDone}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>

          {/* Footer Note */}
          <Text style={styles.footerNote}>
            Stay calm and remain in a safe location. Help is on the way.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    borderTopWidth: 4,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  refContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  refLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 6,
  },
  refNumber: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
  },
  statusTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  statusSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  callOptionContainer: {
    width: '100%',
    marginBottom: 16,
  },
  callQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  callQuestionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  callButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  callBtnYes: {
    // backgroundColor set dynamically
  },
  callBtnNo: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  callBtnTextYes: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  callBtnTextNo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  confirmationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    width: '100%',
    gap: 8,
  },
  confirmationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  doneButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footerNote: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default EmergencyResponseModal;
