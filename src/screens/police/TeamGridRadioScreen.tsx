/**
 * ✅ PATROL APP - TEAM GRID & RADIO SCREEN
 * Squad member grid with direct communication
 * Police Department Only
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
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const ShieldIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
  </Svg>
);

const BellIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PhoneIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MicIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="9" y="2" width="6" height="11" rx="3" stroke={color} strokeWidth={2} />
    <Path d="M19 10v1a7 7 0 01-14 0v-1M12 18.5v3.5M8 22h8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MessageIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UsersIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 7a4 4 0 110 8 4 4 0 010-8z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SendIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const RadioIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M16.24 7.76a6 6 0 010 8.49M12 12h.01M19.07 4.93a10 10 0 010 14.14M7.76 16.24a6 6 0 010-8.49M4.93 19.07a10 10 0 010-14.14" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={color} strokeWidth={2} />
    <Path d="M7 11V7a5 5 0 0110 0v4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const VolumeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PlayIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 3l14 9-14 9V3z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Types
interface SquadMember {
  id: string;
  initials: string;
  name: string;
  badge: string;
  status: 'on-scene' | 'en-route' | 'available' | 'busy';
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

const SQUAD_MEMBERS: SquadMember[] = [
  {
    id: '1',
    initials: 'JD',
    name: 'John Doe',
    badge: '#4521',
    status: 'on-scene',
    distance: '0.2 mi',
    lastSeen: 'Now',
    bgColor: '#3B82F6',
  },
  {
    id: '2',
    initials: 'SK',
    name: 'Sarah Kim',
    badge: '#4522',
    status: 'en-route',
    distance: '1.8 mi',
    lastSeen: '2m ago',
    bgColor: '#22C55E',
  },
  {
    id: '3',
    initials: 'MR',
    name: 'Mike Ross',
    badge: '#4523',
    status: 'available',
    distance: '3.2 mi',
    lastSeen: '5m ago',
    bgColor: '#F59E0B',
  },
  {
    id: '4',
    initials: 'LP',
    name: 'Lisa Park',
    badge: '#4524',
    status: 'busy',
    distance: '2.1 mi',
    lastSeen: '1m ago',
    bgColor: '#8B5CF6',
  },
];

const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    senderId: '2',
    senderName: 'Sarah Kim',
    type: 'text',
    content: 'Suspect vehicle spotted heading east on Main St. Blue sedan, partial plate XK7',
    time: '14:32',
  },
  {
    id: '2',
    senderId: '1',
    senderName: 'John Doe',
    type: 'audio',
    content: 'Audio message',
    time: '14:33',
    duration: '0:12',
  },
  {
    id: '3',
    senderId: 'system',
    senderName: 'System',
    type: 'system',
    content: 'Unit 4523 has joined the channel',
    time: '14:34',
  },
];

const TeamGridRadioScreen: React.FC = () => {
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

  const getStatusColor = (status: SquadMember['status']) => {
    switch (status) {
      case 'on-scene':
        return '#22C55E';
      case 'en-route':
        return '#3B82F6';
      case 'available':
        return '#F59E0B';
      case 'busy':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status: SquadMember['status']) => {
    switch (status) {
      case 'on-scene':
        return 'On Scene';
      case 'en-route':
        return 'En Route';
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
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <ShieldIcon size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Sentinel Patrol</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <BellIcon size={20} color="#FFFFFF" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <View style={styles.avatarSmall}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
          </View>
        </View>

        {/* Channel Info */}
        <View style={styles.channelInfo}>
          <View style={styles.channelLeft}>
            <UsersIcon size={20} color="#93C5FD" />
            <View>
              <Text style={styles.channelTitle}>Alpha Squad</Text>
              <Text style={styles.channelSubtitle}>4 members online • Encrypted</Text>
            </View>
          </View>
          <View style={styles.channelRight}>
            <LockIcon size={14} color="#22C55E" />
            <Text style={styles.channelStatus}>SECURE</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Squad Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Squad Status</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.squadGrid}>
          {SQUAD_MEMBERS.map((member) => (
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
          <Text style={styles.commsTitle}>Direct Comms: Sarah Kim</Text>
          <View style={styles.commsButtons}>
            <TouchableOpacity style={styles.commsButton}>
              <View style={styles.commsButtonIcon}>
                <PhoneIcon size={18} color="#22C55E" />
              </View>
              <Text style={styles.commsButtonText}>VoIP Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.commsButton}>
              <View style={[styles.commsButtonIcon, styles.commsButtonIconBlue]}>
                <RadioIcon size={18} color="#3B82F6" />
              </View>
              <Text style={styles.commsButtonText}>Push-to-Talk</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.commsButton}>
              <View style={[styles.commsButtonIcon, styles.commsButtonIconPurple]}>
                <LockIcon size={18} color="#8B5CF6" />
              </View>
              <Text style={styles.commsButtonText}>Secure Text</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Squad Chat */}
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>Squad Channel</Text>
            <TouchableOpacity style={styles.volumeButton}>
              <VolumeIcon size={16} color="#6B7280" />
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
                          <PlayIcon size={14} color="#1E40AF" />
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
            <SendIcon size={18} color="#FFFFFF" />
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
            <MicIcon size={24} color="#FFFFFF" />
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

  // Header
  header: {
    backgroundColor: '#1E40AF',
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
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#1E40AF',
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#93C5FD',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E40AF',
  },

  // Channel Info
  channelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#153084',
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
    color: '#93C5FD',
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

  // Content
  content: {
    flex: 1,
  },

  // Section Header
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
    color: '#1E40AF',
  },

  // Squad Grid
  squadGrid: {
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

  // Comms Card
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
  commsButtonIconBlue: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  commsButtonIconPurple: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  commsButtonText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4B5563',
  },

  // Chat Container
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
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageAvatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
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
    backgroundColor: '#EFF6FF',
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
    backgroundColor: '#3B82F6',
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

  // Input Container
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
    backgroundColor: '#1E40AF',
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
    backgroundColor: '#EF4444',
  },
  pttButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  pttButtonActive: {
    backgroundColor: '#DC2626',
  },
});

export default TeamGridRadioScreen;
