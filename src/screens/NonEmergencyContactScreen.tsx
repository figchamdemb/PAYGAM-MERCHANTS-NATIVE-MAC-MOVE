import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faCog,
  faUserShield,
  faCircleInfo,
  faPhone,
  faChevronRight,
  faTimes,
  faCheckCircle,
  faCrosshairs,
  faHeartbeat,
  faNotesMedical,
  faVolumeUp,
} from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';

interface NonEmergencyContactScreenProps {
  serviceType?: 'police' | 'ambulance' | 'general';
}

const NonEmergencyContactScreen: React.FC<NonEmergencyContactScreenProps> = ({ 
  serviceType = 'general' 
}) => {
  const navigation = useNavigation();

  const getServiceConfig = () => {
    switch (serviceType) {
      case 'police':
        return {
          title: 'Police Support',
          subtitle: 'General Inquiries & Reports',
          icon: faUserShield,
          iconColor: '#3B82F6',
          bgColor: '#3B82F6',
          whatsappNumber: '+220-700-1234',
          phoneNumber: '+220-800-1234',
          serviceName: 'Gambia Police Force',
        };
      case 'ambulance':
        return {
          title: 'Ambulance Support',
          subtitle: 'Non-Emergency Medical Transport',
          icon: faHeartbeat,
          iconColor: '#EF4444',
          bgColor: '#EF4444',
          whatsappNumber: '+220-700-5678',
          phoneNumber: '+220-800-5678',
          serviceName: 'Gambia Ambulance Service',
        };
      default:
        return {
          title: 'Contact Support',
          subtitle: 'General Inquiries & Reports',
          icon: faUserShield,
          iconColor: '#3B82F6',
          bgColor: '#B45309',
          whatsappNumber: '+220-700-1234',
          phoneNumber: '+220-800-1234',
          serviceName: 'Gambia Support Services',
        };
    }
  };

  const config = getServiceConfig();

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hello, I need ${serviceType} support assistance.`);
    const url = `https://wa.me/${config.whatsappNumber.replace(/[-\s]/g, '')}?text=${message}`;
    Linking.openURL(url).catch(err => {
      Alert.alert('Error', 'Could not open WhatsApp. Please make sure WhatsApp is installed.');
    });
  };

  const handlePhoneCall = () => {
    const phoneUrl = `tel:${config.phoneNumber}`;
    Linking.openURL(phoneUrl).catch(err => {
      Alert.alert('Error', 'Could not initiate phone call.');
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={config.bgColor} />
      
      {/* Header Section */}
      <LinearGradient
        colors={[config.bgColor, `${config.bgColor}CC`]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesomeIcon icon={faArrowLeft} size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{config.title}</Text>
          <TouchableOpacity style={styles.headerButton}>
            <FontAwesomeIcon icon={faCog} size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.bannerContent}>
          <View style={styles.serviceIndicator}>
            <View style={styles.statusDot} />
            <Text style={styles.bannerSubtitle}>Non-Emergency Service</Text>
          </View>
          <Text style={styles.bannerTitle}>{config.subtitle}</Text>
        </View>
      </LinearGradient>

      {/* Selected Service Card (Floating) */}
      <View style={styles.serviceCardContainer}>
        <View style={styles.serviceCard}>
          <View style={styles.serviceIconContainer}>
            <FontAwesomeIcon icon={config.icon} size={32} color={config.iconColor} />
          </View>
          <Text style={styles.serviceTitle}>{config.serviceName}</Text>
          <Text style={styles.serviceSubtitle}>{config.subtitle}</Text>
          <View style={styles.statusIndicator}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Agents Online</Text>
          </View>
        </View>
      </View>

      {/* Selection Prompt */}
      <View style={styles.promptContainer}>
        <Text style={styles.promptTitle}>Choose Contact Method</Text>
        <Text style={styles.promptSubtitle}>Select how you would like to connect with the support team.</Text>
      </View>

      {/* Action Buttons */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.buttonsContainer}>
          {/* WhatsApp Option */}
          <TouchableOpacity 
            style={[styles.contactButton, styles.whatsappButton]}
            onPress={handleWhatsApp}
            activeOpacity={0.8}
          >
            <View style={styles.buttonDecoration} />
            
            <View style={styles.buttonIconContainer}>
              <FontAwesomeIcon icon={faPhone} size={28} color="#25D366" />
            </View>
            
            <View style={styles.buttonContent}>
              <Text style={styles.buttonTitle}>WhatsApp Chat</Text>
              <Text style={styles.buttonSubtitle}>Start a text conversation</Text>
            </View>
            
            <View style={styles.buttonArrow}>
              <FontAwesomeIcon icon={faChevronRight} size={14} color="#6B7280" />
            </View>
          </TouchableOpacity>

          {/* Direct Call Option */}
          <TouchableOpacity 
            style={[styles.contactButton, styles.phoneButton]}
            onPress={handlePhoneCall}
            activeOpacity={0.8}
          >
            <View style={styles.buttonDecoration} />
            
            <View style={styles.buttonIconContainer}>
              <FontAwesomeIcon icon={faPhone} size={28} color={config.iconColor} />
            </View>
            
            <View style={styles.buttonContent}>
              <Text style={styles.buttonTitle}>Toll-Free Call</Text>
              <Text style={styles.buttonSubtitle}>Direct voice call (Free)</Text>
            </View>
            
            <View style={styles.buttonArrow}>
              <FontAwesomeIcon icon={faChevronRight} size={14} color="#6B7280" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Info / Disclaimer */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <FontAwesomeIcon icon={faCircleInfo} size={16} color="#3B82F6" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Note</Text>
              <Text style={styles.infoText}>
                Wait times may vary. For immediate life-threatening situations, please hang up and use the red SOS button on the home screen.
              </Text>
            </View>
          </View>
        </View>

        {/* Spacer for footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel Request</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 80,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  bannerContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  serviceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#FED7AA',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  serviceCardContainer: {
    paddingHorizontal: 24,
    marginTop: -48,
    marginBottom: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  serviceIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  serviceSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  onlineText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
  },
  promptContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  promptSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  content: {
    flex: 1,
  },
  buttonsContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  whatsappButton: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#25D366',
  },
  phoneButton: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#B45309',
  },
  buttonDecoration: {
    position: 'absolute',
    right: -16,
    top: -16,
    width: 64,
    height: 64,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: 32,
  },
  buttonIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  buttonContent: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  buttonArrow: {
    marginLeft: 8,
  },
  infoContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 32,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#DBEAFE',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
});

export default NonEmergencyContactScreen;
