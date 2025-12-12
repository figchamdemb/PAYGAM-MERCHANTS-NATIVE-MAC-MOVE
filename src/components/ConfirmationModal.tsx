/**
 * ConfirmationModal - Reusable popup for action confirmations
 * Used for: Meter Reading submitted, Payment completed/failed, Report submitted,
 * Are You OK set, Address saved, etc.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

// ============ SVG ICON COMPONENTS ============

const SuccessIcon = ({ size = 60, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M9 12l2 2 4-4" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ErrorIcon = ({ size = 60, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M15 9l-6 6M9 9l6 6" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const InfoIcon = ({ size = 60, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M12 16v-4M12 8h.01" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const WarningIcon = ({ size = 60, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L2 22h20L12 2z" fill={color} />
    <Path d="M12 9v4M12 17h.01" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const CloseIcon = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

export type ConfirmationType = 'success' | 'error' | 'info' | 'warning';

interface ConfirmationModalProps {
  visible: boolean;
  type: ConfirmationType;
  title: string;
  message: string;
  onClose: () => void;
  onAction?: () => void;
  actionText?: string;
  showCloseButton?: boolean;
  referenceNumber?: string;
}

const getTypeConfig = (type: ConfirmationType) => {
  switch (type) {
    case 'success':
      return {
        Icon: SuccessIcon,
        color: '#10B981',
        bgColor: '#ECFDF5',
      };
    case 'error':
      return {
        Icon: ErrorIcon,
        color: '#EF4444',
        bgColor: '#FEF2F2',
      };
    case 'info':
      return {
        Icon: InfoIcon,
        color: '#3B82F6',
        bgColor: '#EFF6FF',
      };
    case 'warning':
      return {
        Icon: WarningIcon,
        color: '#F59E0B',
        bgColor: '#FFFBEB',
      };
  }
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  type,
  title,
  message,
  onClose,
  onAction,
  actionText = 'OK',
  showCloseButton = true,
  referenceNumber,
}) => {
  const config = getTypeConfig(type);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { borderTopColor: config.color }]}>
          {/* Close Button */}
          {showCloseButton && (
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <CloseIcon size={20} color="#6B7280" />
            </TouchableOpacity>
          )}

          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
            <config.Icon size={60} color={config.color} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: config.color }]}>{title}</Text>
          
          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Reference Number (if provided) */}
          {referenceNumber && (
            <View style={styles.refContainer}>
              <Text style={styles.refLabel}>Reference:</Text>
              <Text style={[styles.refNumber, { color: config.color }]}>{referenceNumber}</Text>
            </View>
          )}

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: config.color }]}
            onPress={onAction || onClose}
          >
            <Text style={styles.actionButtonText}>{actionText}</Text>
          </TouchableOpacity>
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
    maxWidth: 340,
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
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 8,
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
    fontSize: 13,
    fontWeight: '700',
  },
  actionButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default ConfirmationModal;
