/**
 * E-GOV-GUARDS-PORTAL - Team Communications Screen
 * Screen 7: Squad Grid & Radio Channel
 * 
 * Features:
 * - Squad status grid (online/busy/offline officers)
 * - Quick call buttons
 * - Team chat channel
 * - Broadcast messages
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    StatusBar,
    ScrollView,
    FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../../config/colors';
import { useNavigation } from '@react-navigation/native';

type OfficerStatus = 'ONLINE' | 'BUSY' | 'OFFLINE';
type TabType = 'SQUAD' | 'CHAT';

interface Officer {
    id: string;
    name: string;
    badge: string;
    status: OfficerStatus;
    unit: string;
    lastSeen?: string;
}

interface ChatMessage {
    id: string;
    sender: string;
    badge: string;
    message: string;
    time: string;
    isOwn?: boolean;
}

const MOCK_OFFICERS: Officer[] = [
    { id: '1', name: 'Sgt. Ceesay', badge: '1234', status: 'ONLINE', unit: 'Unit 12' },
    { id: '2', name: 'Ofc. Jallow', badge: '2345', status: 'BUSY', unit: 'Unit 15' },
    { id: '3', name: 'Ofc. Touray', badge: '3456', status: 'ONLINE', unit: 'Unit 18' },
    { id: '4', name: 'Cpl. Bojang', badge: '4567', status: 'OFFLINE', unit: 'Unit 22', lastSeen: '15 min ago' },
    { id: '5', name: 'Ofc. Camara', badge: '5678', status: 'ONLINE', unit: 'Unit 25' },
    { id: '6', name: 'Ofc. Barry', badge: '6789', status: 'BUSY', unit: 'Unit 30' },
];

const MOCK_MESSAGES: ChatMessage[] = [
    { id: '1', sender: 'Sgt. Ceesay', badge: '1234', message: 'Unit 12 on scene at Highland Ave', time: '12:45 PM' },
    { id: '2', sender: 'Dispatch', badge: 'CTRL', message: 'All units, be advised: traffic accident on Main St junction', time: '12:43 PM' },
    { id: '3', sender: 'You', badge: '1234', message: 'Copy that, Unit 15 responding to Main St', time: '12:42 PM', isOwn: true },
    { id: '4', sender: 'Ofc. Touray', badge: '3456', message: 'Unit 18 standing by at sector 4', time: '12:40 PM' },
];

const TeamCommsScreen: React.FC = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState<TabType>('SQUAD');
    const [messageText, setMessageText] = useState('');

    const getStatusColor = (status: OfficerStatus) => {
        switch (status) {
            case 'ONLINE': return colors.status.online;
            case 'BUSY': return colors.status.busy;
            case 'OFFLINE': return colors.status.offline;
        }
    };

    const getOnlineCount = () => MOCK_OFFICERS.filter(o => o.status === 'ONLINE').length;
    const getBusyCount = () => MOCK_OFFICERS.filter(o => o.status === 'BUSY').length;

    const handleSendMessage = () => {
        if (!messageText.trim()) return;
        // Send message logic
        setMessageText('');
    };

    const renderOfficerCard = ({ item }: { item: Officer }) => (
        <TouchableOpacity style={styles.officerCard}>
            <View style={styles.officerAvatar}>
                <Icon name="user-shield" size={20} color={getStatusColor(item.status)} />
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
            </View>
            <View style={styles.officerInfo}>
                <Text style={styles.officerName}>{item.name}</Text>
                <Text style={styles.officerUnit}>{item.unit}</Text>
                {item.lastSeen && <Text style={styles.lastSeen}>{item.lastSeen}</Text>}
            </View>
            <TouchableOpacity style={styles.callButton}>
                <Icon name="phone" size={14} color={colors.primary} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderMessage = ({ item }: { item: ChatMessage }) => (
        <View style={[styles.messageContainer, item.isOwn && styles.messageOwn]}>
            <View style={[styles.messageBubble, item.isOwn && styles.messageBubbleOwn]}>
                {!item.isOwn && (
                    <View style={styles.messageSender}>
                        <Text style={styles.senderName}>{item.sender}</Text>
                        <Text style={styles.senderBadge}>[{item.badge}]</Text>
                    </View>
                )}
                <Text style={[styles.messageText, item.isOwn && styles.messageTextOwn]}>
                    {item.message}
                </Text>
                <Text style={[styles.messageTime, item.isOwn && styles.messageTimeOwn]}>
                    {item.time}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Team Communications</Text>
                <TouchableOpacity style={styles.settingsButton}>
                    <Icon name="cog" size={18} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Stats Bar */}
            <View style={styles.statsBar}>
                <View style={styles.statItem}>
                    <View style={[styles.statDot, { backgroundColor: colors.status.online }]} />
                    <Text style={styles.statText}>{getOnlineCount()} Online</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <View style={[styles.statDot, { backgroundColor: colors.status.busy }]} />
                    <Text style={styles.statText}>{getBusyCount()} Busy</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statText}>{MOCK_OFFICERS.length} Total</Text>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'SQUAD' && styles.tabActive]}
                    onPress={() => setActiveTab('SQUAD')}
                >
                    <Icon name="users" size={16} color={activeTab === 'SQUAD' ? '#FFFFFF' : '#6B7280'} />
                    <Text style={[styles.tabText, activeTab === 'SQUAD' && styles.tabTextActive]}>
                        Squad ({MOCK_OFFICERS.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'CHAT' && styles.tabActive]}
                    onPress={() => setActiveTab('CHAT')}
                >
                    <Icon name="comment-dots" size={16} color={activeTab === 'CHAT' ? '#FFFFFF' : '#6B7280'} />
                    <Text style={[styles.tabText, activeTab === 'CHAT' && styles.tabTextActive]}>
                        Channel
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {activeTab === 'SQUAD' ? (
                    <FlatList
                        data={MOCK_OFFICERS}
                        renderItem={renderOfficerCard}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.chatContainer}>
                        {/* Channel Header */}
                        <View style={styles.channelHeader}>
                            <Icon name="broadcast-tower" size={16} color={colors.primary} />
                            <Text style={styles.channelName}>Sector 4 Channel</Text>
                            <View style={styles.channelBadge}>
                                <Text style={styles.channelBadgeText}>{MOCK_OFFICERS.length} officers</Text>
                            </View>
                        </View>

                        {/* Messages */}
                        <FlatList
                            data={MOCK_MESSAGES}
                            renderItem={renderMessage}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.messagesContent}
                            inverted
                        />

                        {/* Input */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.messageInput}
                                placeholder="Type a message..."
                                placeholderTextColor="#6B7280"
                                value={messageText}
                                onChangeText={setMessageText}
                            />
                            <TouchableOpacity
                                style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
                                onPress={handleSendMessage}
                                disabled={!messageText.trim()}
                            >
                                <Icon name="paper-plane" size={16} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <TouchableOpacity style={styles.quickActionButton}>
                    <Icon name="broadcast-tower" size={16} color="#FFFFFF" />
                    <Text style={styles.quickActionText}>Broadcast</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.quickActionButton, styles.emergencyButton]}>
                    <Icon name="exclamation-triangle" size={16} color="#FFFFFF" />
                    <Text style={styles.quickActionText}>Emergency Call</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.dark,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    settingsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Stats Bar
    statsBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 10,
        marginHorizontal: 16,
        borderRadius: 10,
        marginBottom: 12,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    statDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statText: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    statDivider: {
        width: 1,
        height: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },

    // Tabs
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        gap: 8,
        marginBottom: 12,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        gap: 8,
    },
    tabActive: {
        backgroundColor: colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    tabTextActive: {
        color: '#FFFFFF',
    },

    // Content
    content: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    listContent: {
        padding: 16,
    },

    // Officer Cards
    officerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    officerAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        position: 'relative',
    },
    statusDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    officerInfo: {
        flex: 1,
    },
    officerName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    officerUnit: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    lastSeen: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 2,
    },
    callButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Chat Container
    chatContainer: {
        flex: 1,
    },
    channelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    channelName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginLeft: 8,
        flex: 1,
    },
    channelBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    channelBadgeText: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
    },
    messagesContent: {
        padding: 16,
        flexGrow: 1,
    },

    // Messages
    messageContainer: {
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    messageOwn: {
        alignItems: 'flex-end',
    },
    messageBubble: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderTopLeftRadius: 4,
        padding: 12,
        maxWidth: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    messageBubbleOwn: {
        backgroundColor: colors.primary,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 4,
    },
    messageSender: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    senderName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primary,
        marginRight: 4,
    },
    senderBadge: {
        fontSize: 10,
        color: '#9CA3AF',
    },
    messageText: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    messageTextOwn: {
        color: '#FFFFFF',
    },
    messageTime: {
        fontSize: 10,
        color: '#9CA3AF',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    messageTimeOwn: {
        color: 'rgba(255,255,255,0.7)',
    },

    // Input
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    messageInput: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14,
        color: '#111827',
        marginRight: 10,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#9CA3AF',
    },

    // Quick Actions
    quickActions: {
        flexDirection: 'row',
        gap: 10,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    quickActionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 12,
        borderRadius: 10,
        gap: 8,
    },
    emergencyButton: {
        backgroundColor: colors.status.error,
    },
    quickActionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default TeamCommsScreen;
