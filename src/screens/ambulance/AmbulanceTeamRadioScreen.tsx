/**
 * ✅ AMBULANCE - TEAM RADIO SCREEN
 * Medical team grid with direct communication
 * Ambulance Department Only
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faTruckMedical,
  faBell,
  faUsers,
  faLock,
  faPhone,
  faMicrophone,
  faCommentDots,
  faPaperPlane,
  faVolumeHigh,
  faPlay,
  faTowerBroadcast,
} from '@fortawesome/free-solid-svg-icons';

const { width } = Dimensions.get('window');

// Types
interface CrewMember {
  id: string;
  initials: string;
  name: string;
  badge: string;
  status: 'on-call' | 'responding' | 'available' | 'busy';
  distance: string;
  lastSeen: string;
  bgColor: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  type: 'text' | 'audio' | 'system';
  content: string;
  time: string;
  duration?: string;
}

const CREW_MEMBERS: CrewMember[] = [
  {
    id: '1',
    initials: 'DR',
    name: 'Dr. Roberts',
    badge: 'P-101',
    status: 'on-call',
    distance: '0.3 mi',
    lastSeen: 'Now',
    bgColor: '#DC2626',
  },
  {
    id: '2',
    initials: 'NK',
    name: 'Nurse Kim',
    badge: 'N-202',
    status: 'responding',
    distance: '1.5 mi',
    lastSeen: '1m ago',
    bgColor: '#22C55E',
  },
  {
    id: '3',
    initials: 'JM',
    name: 'James Miller',
    badge: 'EMT-303',
    status: 'available',
    distance: '2.8 mi',
    lastSeen: '3m ago',
    bgColor: '#F59E0B',
  },
  {
    id: '4',
    initials: 'SL',
    name: 'Sarah Lee',
    badge: 'EMT-304',
    status: 'busy',
    distance: '2.0 mi',
    lastSeen: '2m ago',
    bgColor: '#8B5CF6',
  },
];

const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    senderId: '2',
    senderName: 'Nurse Kim',
    type: 'text',
    content: 'Patient is stable. Preparing for transport to General Hospital.',
    time: '14:32',
  },
  {
    id: '2',
    senderId: '1',
    senderName: 'Dr. Roberts',
    type: 'audio',
    content: 'Audio message',
    time: '14:33',
    duration: '0:18',
  },
  {
    id: '3',
    senderId: 'system',
    senderName: 'System',
    type: 'system',
    content: 'Ambulance A2 has arrived on scene',
    time: '14:34',
  },
];

const AmbulanceTeamRadioScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [message, setMessage] = useState('');
  const [isPTTActive, setIsPTTActive] = useState(false);
  const pttPulse = useRef(new Animated.Value(1)).current;
  const pttOpacity = useRef(new Animated.Value(0.6)).current;

  // PTT Animation
  useEffect(() => {
    let animation: Animated.CompositeAnimation;
    if (isPTTActive) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pttPulse, {
              toValue: 1.2,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(pttOpacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pttPulse, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(pttOpacity, {
              toValue: 0.6,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      animation.start();
    }
    return () => {
      animation?.stop();
      pttPulse.setValue(1);
      pttOpacity.setValue(0.6);
    };
  }, [isPTTActive]);

  const getStatusColor = (status: CrewMember['status']) => {
    switch (status) {
      case 'on-call':
        return '#22C55E';
      case 'responding':
        return '#3B82F6';
      case 'available':
        return '#F59E0B';
      case 'busy':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status: CrewMember['status']) => {
    switch (status) {
      case 'on-call':
        return 'On Call';
      case 'responding':
        return 'Responding';
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <FontAwesomeIcon icon={faTruckMedical} size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Sentinel EMS</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <FontAwesomeIcon icon={faBell} size={20} color="#FFFFFF" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <View style={styles.avatarSmall}>
              <Text style={styles.avatarText}>DR</Text>
            </View>
          </View>
        </View>

        {/* Channel Info */}
        <View style={styles.channelInfo}>
          <View style={styles.channelLeft}>
            <FontAwesomeIcon icon={faUsers} size={20} color="#FCA5A5" />
            <View>
              <Text style={styles.channelTitle}>Medical Team Alpha</Text>
              <Text style={styles.channelSubtitle}>4 crew online • Encrypted</Text>
            </View>
          </View>
          <View style={styles.channelRight}>
            <FontAwesomeIcon icon={faLock} size={12} color="#22C55E" />
            <Text style={styles.channelStatus}>SECURE</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Crew Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Crew Status</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.crewGrid}>
          {CREW_MEMBERS.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              <View style={styles.memberAvatarContainer}>
                <View style={[styles.memberAvatar, { backgroundColor: member.bgColor }]}>
                  <Text style={styles.memberInitials}>{member.initials}</Text>
                </View>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(member.status) }]} />
              </View>
              <Text style={styles.memberName}>{member.name.split(' ')[0]}</Text>
              <Text style={styles.memberBadge}>{member.badge}</Text>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(member.status)}20` }]}>
                <Text style={[styles.statusText, { color: getStatusColor(member.status) }]}>
                  {getStatusLabel(member.status)}
                </Text>
              </View>
              <Text style={styles.memberDistance}>{member.distance}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Direct Comms Card */}
        <View style={styles.commsCard}>
          <Text style={styles.commsTitle}>Direct Comms: Nurse Kim</Text>
          <View style={styles.commsButtons}>
            <TouchableOpacity style={styles.commsButton}>
              <View style={styles.commsButtonIcon}>
                <FontAwesomeIcon icon={faPhone} size={18} color="#22C55E" />
              </View>
              <Text style={styles.commsButtonText}>VoIP Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.commsButton}>
              <View style={[styles.commsButtonIcon, styles.commsButtonIconRed]}>
                <FontAwesomeIcon icon={faTowerBroadcast} size={18} color="#DC2626" />
              </View>
              <Text style={styles.commsButtonText}>Push-to-Talk</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.commsButton}>
              <View style={[styles.commsButtonIcon, styles.commsButtonIconPurple]}>
                <FontAwesomeIcon icon={faLock} size={18} color="#8B5CF6" />
              </View>
              <Text style={styles.commsButtonText}>Secure Text</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Crew Chat */}
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>Medical Channel</Text>
            <TouchableOpacity style={styles.volumeButton}>
              <FontAwesomeIcon icon={faVolumeHigh} size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.chatMessages}>
            {CHAT_MESSAGES.map((msg) => {
              if (msg.type === 'system') {
                return (
                  <View key={msg.id} style={styles.systemMessage}>
                    <Text style={styles.systemMessageText}>{msg.content}</Text>
                  </View>
                );
              }

              return (
                <View key={msg.id} style={styles.chatMessage}>
                  <View style={styles.messageAvatar}>
                    <Text style={styles.messageAvatarText}>
                      {msg.senderName.split(' ').map((n) => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.messageContent}>
                    <View style={styles.messageHeader}>
                      <Text style={styles.messageSender}>{msg.senderName}</Text>
                      <Text style={styles.messageTime}>{msg.time}</Text>
                    </View>
                    {msg.type === 'audio' ? (
                      <View style={styles.audioMessage}>
                        <TouchableOpacity style={styles.playButton}>
                          <FontAwesomeIcon icon={faPlay} size={12} color="#DC2626" />
                        </TouchableOpacity>
                        <View style={styles.audioWaveform}>
                          {[1, 0.6, 1, 0.4, 0.8, 1, 0.5, 0.9, 0.7, 1, 0.6, 0.8].map((h, i) => (
                            <View key={i} style={[styles.waveformBar, { height: 16 * h }]} />
                          ))}
                        </View>
                        <Text style={styles.audioDuration}>{msg.duration}</Text>
                      </View>
                    ) : (
                      <Text style={styles.messageText}>{msg.content}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type secure message..."
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.sendButton}>
            <FontAwesomeIcon icon={faPaperPlane} size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* PTT Button */}
        <TouchableOpacity
          style={styles.pttButton}
          onPressIn={() => setIsPTTActive(true)}
          onPressOut={() => setIsPTTActive(false)}
          activeOpacity={1}
        >
          {isPTTActive && (
            <Animated.View
              style={[
                styles.pttPulse,
                {
                  transform: [{ scale: pttPulse }],
                  opacity: pttOpacity,
                },
              ]}
            />
          )}
          <View style={[styles.pttButtonInner, isPTTActive && styles.pttButtonActive]}>
            <FontAwesomeIcon icon={faMicrophone} size={24} color="#FFFFFF" />
          </View>
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
    backgroundColor: '#DC2626',
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerButton: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FCD34D',
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FCA5A5',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#991B1B',
  },
  channelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#B91C1C',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  channelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  channelTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  channelSubtitle: {
    fontSize: 12,
    color: '#FCA5A5',
    marginTop: 2,
  },
  channelRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  channelStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: '#22C55E',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  crewGrid: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  memberCard: {
    width: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  memberAvatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  memberName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  memberBadge: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  memberDistance: {
    fontSize: 11,
    color: '#6B7280',
  },
  commsCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  commsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 14,
  },
  commsButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commsButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  commsButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  commsButtonIconRed: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  commsButtonIconPurple: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  commsButtonText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4B5563',
  },
  chatContainer: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  chatTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  volumeButton: {
    padding: 4,
  },
  chatMessages: {
    padding: 16,
    gap: 16,
  },
  chatMessage: {
    flexDirection: 'row',
    gap: 12,
  },
  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageAvatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B91C1C',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  messageSender: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  messageTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  messageText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  audioMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
  },
  playButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  audioWaveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  waveformBar: {
    width: 3,
    backgroundColor: '#DC2626',
    borderRadius: 2,
  },
  audioDuration: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 'auto',
  },
  systemMessage: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  systemMessageText: {
    fontSize: 12,
    color: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    paddingVertical: 10,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pttButton: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pttPulse: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DC2626',
  },
  pttButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  pttButtonActive: {
    backgroundColor: '#B91C1C',
  },
});

export default AmbulanceTeamRadioScreen;
