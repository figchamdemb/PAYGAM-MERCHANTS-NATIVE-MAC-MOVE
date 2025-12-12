import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faShieldAlt,
  faLock,
  faArrowRight,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';

interface SecurityPinModalProps {
  visible: boolean;
  onClose: () => void;
  onUnlock: (pin: string) => void;
  onForgotPin?: () => void;
}

const SecurityPinModal: React.FC<SecurityPinModalProps> = ({
  visible,
  onClose,
  onUnlock,
  onForgotPin,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handlePinChange = (text: string) => {
    // Only allow numbers and max 4 digits
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 4) {
      setPin(cleaned);
      setError('');
    }
  };

  const handleUnlock = () => {
    if (pin.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }
    onUnlock(pin);
  };

  const handleClose = () => {
    setPin('');
    setError('');
    onClose();
  };

  const formatPinDisplay = () => {
    return pin.padEnd(4, '•').split('').map((char, index) => (
      <Text key={index} style={styles.pinChar}>
        {index < pin.length ? '•' : '•'}
      </Text>
    ));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.6)" />
      
      <Animated.View 
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          activeOpacity={1} 
          onPress={handleClose}
        />
        
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim },
              ],
            }
          ]}
        >
          {/* Decorative Top Bar */}
          <LinearGradient
            colors={['#B45309', '#92400e']}
            style={styles.topBar}
          />
          
          <View style={styles.modalContent}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <FontAwesomeIcon icon={faShieldAlt} size={32} color="#B45309" />
              </View>
              <View style={styles.lockIconContainer}>
                <FontAwesomeIcon icon={faLock} size={12} color="#6B7280" />
              </View>
            </View>

            {/* Text */}
            <Text style={styles.title}>Security Check</Text>
            <Text style={styles.subtitle}>
              This view is protected. Please enter your 4-digit security PIN to unlock hidden cases.
            </Text>

            {/* PIN Input */}
            <View style={styles.pinContainer}>
              <TextInput
                style={styles.hiddenInput}
                value={pin}
                onChangeText={handlePinChange}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                autoFocus
                textAlign="center"
              />
              
              <View style={styles.pinDisplay}>
                {formatPinDisplay()}
              </View>

              {/* Blinking Cursor */}
              {pin.length < 4 && (
                <View style={styles.cursorContainer}>
                  <View style={styles.cursor} />
                </View>
              )}
            </View>

            {/* Error Message */}
            {error ? (
              <Text style={styles.errorText}>
                <FontAwesomeIcon icon={faTimes} size={12} color="#EF4444" /> {error}
              </Text>
            ) : null}

            {/* Actions */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.unlockButton} 
                onPress={handleUnlock}
                activeOpacity={0.7}
              >
                <Text style={styles.unlockButtonText}>Unlock</Text>
                <FontAwesomeIcon icon={faArrowRight} size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Forgot PIN Link */}
            <TouchableOpacity 
              style={styles.forgotButton}
              onPress={onForgotPin}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotButtonText}>Forgot Security PIN?</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
  },
  topBar: {
    height: 8,
    width: '100%',
  },
  modalContent: {
    padding: 24,
    paddingTop: 32,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  lockIconContainer: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  pinContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    fontSize: 16,
    color: 'transparent',
  },
  pinDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  pinChar: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    width: 24,
    textAlign: 'center',
  },
  cursorContainer: {
    position: 'absolute',
    top: '50%',
    left: '58%',
    transform: [{ translateY: -12 }],
  },
  cursor: {
    width: 2,
    height: 24,
    backgroundColor: '#B45309',
    borderRadius: 1,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  unlockButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#B45309',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  unlockButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  forgotButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  forgotButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
});

export default SecurityPinModal;
