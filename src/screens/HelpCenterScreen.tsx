import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TextInput,
    Modal,
    Platform,
    Linking,
    Alert,
    Dimensions,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Svg, Path, Circle, Rect, Line } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { StackNavigationProp } from '@react-navigation/stack';

const { width } = Dimensions.get('window');

type HelpCategory = {
    id: number;
    title: string;
    description: string;
    content: string;
    icon: string;
};

type VideoTutorial = {
    id: number;
    title: string;
    duration: string;
    thumbnail: string;
    category: string;
    description: string;
};

const HelpCenterScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const { theme, isDarkMode } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [videoModalVisible, setVideoModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<HelpCategory | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);
    const [activeTab, setActiveTab] = useState<'help' | 'videos' | 'contact'>('help');

    const categories: HelpCategory[] = [
        {
            id: 1,
            title: 'Getting Started',
            description: 'Learn how to set up your merchant account and start accepting payments.',
            content: 'Welcome to PayGam Merchant! To get started:\n\n1. Complete your profile setup with business details\n2. Verify your identity with valid ID documents\n3. Add your bank account or mobile wallet for settlements\n4. Generate your unique QR code for receiving payments\n5. Start accepting payments from customers!\n\nOnce verified, you can accept payments via QR codes, payment links, or direct transfers. Your verification typically takes 24-48 hours.',
            icon: '🚀',
        },
        {
            id: 2,
            title: 'Settlements & Withdrawals',
            description: 'Understand how to withdraw funds to your wallet or bank account.',
            content: 'Withdrawing your funds is easy!\n\n**Mobile Wallet Settlement:**\n• Africell Money, QMoney, Gamcel\n• Instant transfers (usually within 5 minutes)\n• Minimum: D100, Maximum: D50,000\n\n**Bank Transfer:**\n• All major Gambian banks supported\n• Processing time: 24 hours\n• Minimum: D500, Maximum: D500,000\n\n**Cashout QR:**\n• Generate QR for agent withdrawal\n• Valid for 24 hours\n• Agent takes a small fee\n\nGo to Settlement from your dashboard to start.',
            icon: '💰',
        },
        {
            id: 3,
            title: 'Transaction Management',
            description: 'View transaction history, generate reports, and manage refunds.',
            content: 'Managing your transactions:\n\n**View History:**\n• Access from Dashboard or History tab\n• Filter by date, type, or status\n• Search by customer name or reference\n\n**Generate Reports:**\n• Daily, weekly, or monthly reports\n• Export to PDF or Excel\n• Email reports automatically\n\n**Refunds:**\n• Select transaction > Request Refund\n• Refunds processed within 24 hours\n• Full or partial refunds available\n\n**Disputes:**\n• Contact support for disputed transactions\n• Provide transaction reference and details',
            icon: '📊',
        },
        {
            id: 4,
            title: 'Security & PIN',
            description: 'Manage your security settings, change PIN, and enable biometrics.',
            content: 'Keep your account secure:\n\n**Transaction PIN:**\n• Required for all financial transactions\n• Change regularly from Settings > Security\n• Never share with anyone\n\n**Biometric Login:**\n• Enable fingerprint or face recognition\n• Faster and more secure access\n• Settings > Security > Biometrics\n\n**Security Tips:**\n• Log out when not in use\n• Don\'t save PIN on your device\n• Report suspicious activity immediately\n• Use strong, unique passwords\n\n**If compromised:**\nCall our 24/7 hotline immediately!',
            icon: '🔒',
        },
        {
            id: 5,
            title: 'Technical Issues',
            description: 'Troubleshoot app crashes, connection issues, and update problems.',
            content: 'Common solutions:\n\n**App Crashes:**\n• Update to latest version\n• Clear app cache\n• Restart your device\n• Reinstall if needed\n\n**Connection Issues:**\n• Check internet connection\n• Switch between WiFi and data\n• Disable VPN if active\n\n**Payment Failures:**\n• Check wallet/bank balance\n• Verify recipient details\n• Try again in a few minutes\n\n**Still having issues?**\nContact our 24/7 technical support team. We\'re here to help!',
            icon: '🔧',
        },
    ];

    const videoTutorials: VideoTutorial[] = [
        {
            id: 1,
            title: 'How to Accept Payments',
            duration: '3:45',
            thumbnail: '💳',
            category: 'Payments',
            description: 'Learn the different ways to accept payments from your customers including QR codes, payment links, and direct transfers.',
        },
        {
            id: 2,
            title: 'Setting Up Your Profile',
            duration: '2:30',
            thumbnail: '👤',
            category: 'Getting Started',
            description: 'Complete guide to setting up your merchant profile, adding business details, and verifying your account.',
        },
        {
            id: 3,
            title: 'Withdrawing to Bank Account',
            duration: '4:15',
            thumbnail: '🏦',
            category: 'Settlements',
            description: 'Step-by-step guide on how to withdraw your earnings to your bank account safely and quickly.',
        },
        {
            id: 4,
            title: 'Withdrawing to Mobile Wallet',
            duration: '3:00',
            thumbnail: '📱',
            category: 'Settlements',
            description: 'Learn how to transfer funds to your Africell Money, QMoney, or Gamcel mobile wallet instantly.',
        },
        {
            id: 5,
            title: 'Understanding Transaction Fees',
            duration: '2:45',
            thumbnail: '💵',
            category: 'Fees',
            description: 'Detailed breakdown of all transaction fees, settlement fees, and how to minimize costs.',
        },
        {
            id: 6,
            title: 'Generating QR Codes',
            duration: '1:55',
            thumbnail: '📲',
            category: 'Payments',
            description: 'Create static and dynamic QR codes for your business to receive payments easily.',
        },
        {
            id: 7,
            title: 'Managing Sub-Merchants',
            duration: '5:20',
            thumbnail: '👥',
            category: 'Business',
            description: 'For corporate merchants: Learn how to add and manage sub-merchants under your main account.',
        },
        {
            id: 8,
            title: 'Security Best Practices',
            duration: '4:00',
            thumbnail: '🔐',
            category: 'Security',
            description: 'Essential security tips to protect your merchant account and prevent fraud.',
        },
        {
            id: 9,
            title: 'Reading Transaction Reports',
            duration: '3:30',
            thumbnail: '📈',
            category: 'Reports',
            description: 'How to generate, read, and export your transaction reports for accounting purposes.',
        },
        {
            id: 10,
            title: 'Fuel Merchant Features',
            duration: '4:45',
            thumbnail: '⛽',
            category: 'Fuel',
            description: 'Special features for fuel merchants including price updates, redemption codes, and fuel sales tracking.',
        },
    ];

    const handleBack = () => {
        navigation.goBack();
    };

    const handleOpenCategory = (category: HelpCategory) => {
        setSelectedCategory(category);
        setModalVisible(true);
    };

    const handleOpenVideo = (video: VideoTutorial) => {
        setSelectedVideo(video);
        setVideoModalVisible(true);
    };

    const handleCallSupport = () => {
        Linking.openURL('tel:+2207777777').catch(() => {
            Alert.alert('Error', 'Unable to make call. Please dial +220 777-7777 manually.');
        });
    };

    const handleEmailSupport = () => {
        Linking.openURL('mailto:support@paygam.gm?subject=Merchant Support Request').catch(() => {
            Alert.alert('Error', 'Unable to open email. Please email support@paygam.gm');
        });
    };

    const handleWhatsAppSupport = () => {
        Linking.openURL('https://wa.me/2207777777?text=Hello, I need help with my PayGam Merchant account.').catch(() => {
            Alert.alert('Error', 'Unable to open WhatsApp. Please message +220 777-7777');
        });
    };

    const handleLiveChat = () => {
        Alert.alert(
            'Live Chat',
            'Connecting you to a support agent...\n\nOur average response time is under 2 minutes during business hours (8AM - 10PM GMT).',
            [{ text: 'OK', style: 'default' }]
        );
    };

    const handleWatchVideo = () => {
        Alert.alert(
            'Playing Video',
            `Now playing: ${selectedVideo?.title}\n\nDuration: ${selectedVideo?.duration}`,
            [{ text: 'Close', style: 'default' }]
        );
    };

    // Icons
    const ArrowLeftIcon = () => (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );

    const SearchIcon = () => (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth={2} />
            <Path d="M21 21l-4.3-4.3" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" />
        </Svg>
    );

    const PhoneIcon = ({ color = '#16A34A' }: { color?: string }) => (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );

    const EmailIcon = ({ color = '#3B82F6' }: { color?: string }) => (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Rect width="20" height="16" x="2" y="4" rx="2" stroke={color} strokeWidth={2} />
            <Path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
    );

    const WhatsAppIcon = () => (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="#25D366" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );

    const ChatIcon = () => (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#8B5CF6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );

    const PlayIcon = () => (
        <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" fill="#293454" />
            <Path d="M10 8L16 12L10 16V8Z" fill="#FFFFFF" />
        </Svg>
    );

    const CloseIcon = () => (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M18 6L6 18M6 6l12 12" stroke="#6B7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );

    const HelpTabIcon = ({ active }: { active: boolean }) => (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={active ? '#293454' : '#9CA3AF'} strokeWidth={2} />
            <Path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke={active ? '#293454' : '#9CA3AF'} strokeWidth={2} strokeLinecap="round" />
            <Circle cx="12" cy="17" r="1" fill={active ? '#293454' : '#9CA3AF'} />
        </Svg>
    );

    const VideoTabIcon = ({ active }: { active: boolean }) => (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Rect x="2" y="4" width="15" height="16" rx="2" stroke={active ? '#293454' : '#9CA3AF'} strokeWidth={2} />
            <Path d="M17 8L22 5V19L17 16" stroke={active ? '#293454' : '#9CA3AF'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );

    const ContactTabIcon = ({ active }: { active: boolean }) => (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke={active ? '#293454' : '#9CA3AF'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );

    const HeadphonesIcon = () => (
        <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
            <Path d="M3 18v-6a9 9 0 0118 0v6" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );

    const filteredCategories = categories.filter(
        cat => cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredVideos = videoTutorials.filter(
        video => video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 video.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderHelpContent = () => (
        <>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchIconContainer}>
                    <SearchIcon />
                </View>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search help topics..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Help Categories */}
            <Text style={styles.sectionTitle}>Help Topics</Text>
            <View style={styles.categoriesContainer}>
                {filteredCategories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={styles.categoryCard}
                        onPress={() => handleOpenCategory(category)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.categoryIcon}>
                            <Text style={styles.categoryEmoji}>{category.icon}</Text>
                        </View>
                        <View style={styles.categoryContent}>
                            <Text style={styles.categoryTitle}>{category.title}</Text>
                            <Text style={styles.categoryDescription} numberOfLines={2}>{category.description}</Text>
                        </View>
                        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                            <Path d="M9 18L15 12L9 6" stroke="#293454" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    </TouchableOpacity>
                ))}
            </View>
        </>
    );

    const renderVideosContent = () => (
        <>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchIconContainer}>
                    <SearchIcon />
                </View>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search video tutorials..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Featured Video */}
            <View style={styles.featuredVideo}>
                <View style={styles.featuredVideoOverlay}>
                    <Text style={styles.featuredLabel}>FEATURED</Text>
                    <Text style={styles.featuredTitle}>Complete Guide to PayGam Merchant</Text>
                    <Text style={styles.featuredDuration}>12:30 • Full Tutorial</Text>
                    <TouchableOpacity style={styles.watchNowBtn} onPress={() => Alert.alert('Playing', 'Complete Guide to PayGam Merchant - 12:30')}>
                        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                            <Path d="M5 3L19 12L5 21V3Z" fill="#293454" />
                        </Svg>
                        <Text style={styles.watchNowText}>Watch Now</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Video Tutorials List */}
            <Text style={styles.sectionTitle}>Video Tutorials</Text>
            <View style={styles.videosGrid}>
                {filteredVideos.map((video) => (
                    <TouchableOpacity
                        key={video.id}
                        style={styles.videoCard}
                        onPress={() => handleOpenVideo(video)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.videoThumbnail}>
                            <Text style={styles.videoEmoji}>{video.thumbnail}</Text>
                            <View style={styles.playOverlay}>
                                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                                    <Circle cx="12" cy="12" r="10" fill="rgba(41, 52, 84, 0.9)" />
                                    <Path d="M10 8L16 12L10 16V8Z" fill="#FFFFFF" />
                                </Svg>
                            </View>
                            <View style={styles.durationBadge}>
                                <Text style={styles.durationText}>{video.duration}</Text>
                            </View>
                        </View>
                        <View style={styles.videoInfo}>
                            <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
                            <Text style={styles.videoCategory}>{video.category}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </>
    );

    const renderContactContent = () => (
        <>
            {/* 24/7 Helpline Banner */}
            <View style={styles.helplineBanner}>
                <View style={styles.helplineIconContainer}>
                    <HeadphonesIcon />
                </View>
                <View style={styles.helplineInfo}>
                    <Text style={styles.helplineTitle}>24/7 Helpline</Text>
                    <Text style={styles.helplineSubtitle}>We're always here to help you</Text>
                </View>
                <TouchableOpacity style={styles.callNowBtn} onPress={handleCallSupport}>
                    <PhoneIcon color="#FFFFFF" />
                    <Text style={styles.callNowText}>Call Now</Text>
                </TouchableOpacity>
            </View>

            {/* Quick Contact Options */}
            <Text style={styles.sectionTitle}>Contact Options</Text>
            <View style={styles.contactGrid}>
                <TouchableOpacity style={styles.contactOption} onPress={handleCallSupport} activeOpacity={0.8}>
                    <View style={[styles.contactOptionIcon, { backgroundColor: '#DCFCE7' }]}>
                        <PhoneIcon color="#16A34A" />
                    </View>
                    <Text style={styles.contactOptionTitle}>Phone Support</Text>
                    <Text style={styles.contactOptionDetail}>+220 777-7777</Text>
                    <Text style={styles.contactOptionAvailability}>24/7 Available</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contactOption} onPress={handleWhatsAppSupport} activeOpacity={0.8}>
                    <View style={[styles.contactOptionIcon, { backgroundColor: '#D1FAE5' }]}>
                        <WhatsAppIcon />
                    </View>
                    <Text style={styles.contactOptionTitle}>WhatsApp</Text>
                    <Text style={styles.contactOptionDetail}>+220 777-7777</Text>
                    <Text style={styles.contactOptionAvailability}>Instant Response</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contactOption} onPress={handleEmailSupport} activeOpacity={0.8}>
                    <View style={[styles.contactOptionIcon, { backgroundColor: '#DBEAFE' }]}>
                        <EmailIcon color="#3B82F6" />
                    </View>
                    <Text style={styles.contactOptionTitle}>Email Us</Text>
                    <Text style={styles.contactOptionDetail}>support@paygam.gm</Text>
                    <Text style={styles.contactOptionAvailability}>Reply within 24hrs</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contactOption} onPress={handleLiveChat} activeOpacity={0.8}>
                    <View style={[styles.contactOptionIcon, { backgroundColor: '#EDE9FE' }]}>
                        <ChatIcon />
                    </View>
                    <Text style={styles.contactOptionTitle}>Live Chat</Text>
                    <Text style={styles.contactOptionDetail}>Chat with an agent</Text>
                    <Text style={styles.contactOptionAvailability}>8AM - 10PM GMT</Text>
                </TouchableOpacity>
            </View>

            {/* Support Hours */}
            <View style={styles.supportHoursCard}>
                <Text style={styles.supportHoursTitle}>Support Hours</Text>
                <View style={styles.hoursRow}>
                    <Text style={styles.hoursLabel}>Phone Support:</Text>
                    <Text style={styles.hoursValue}>24/7</Text>
                </View>
                <View style={styles.hoursRow}>
                    <Text style={styles.hoursLabel}>WhatsApp:</Text>
                    <Text style={styles.hoursValue}>24/7</Text>
                </View>
                <View style={styles.hoursRow}>
                    <Text style={styles.hoursLabel}>Live Chat:</Text>
                    <Text style={styles.hoursValue}>8AM - 10PM GMT</Text>
                </View>
                <View style={styles.hoursRow}>
                    <Text style={styles.hoursLabel}>Email Response:</Text>
                    <Text style={styles.hoursValue}>Within 24 hours</Text>
                </View>
            </View>

            {/* Emergency Notice */}
            <View style={styles.emergencyNotice}>
                <Text style={styles.emergencyTitle}>⚠️ Account Compromised?</Text>
                <Text style={styles.emergencyText}>
                    If you suspect unauthorized access to your account, call our emergency hotline immediately at{' '}
                    <Text style={styles.emergencyPhone}>+220 777-7777</Text>
                </Text>
            </View>
        </>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle="light-content" backgroundColor="#293454" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <ArrowLeftIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'help' && styles.activeTab]}
                    onPress={() => setActiveTab('help')}
                >
                    <HelpTabIcon active={activeTab === 'help'} />
                    <Text style={[styles.tabText, activeTab === 'help' && styles.activeTabText]}>Help</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
                    onPress={() => setActiveTab('videos')}
                >
                    <VideoTabIcon active={activeTab === 'videos'} />
                    <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>Videos</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'contact' && styles.activeTab]}
                    onPress={() => setActiveTab('contact')}
                >
                    <ContactTabIcon active={activeTab === 'contact'} />
                    <Text style={[styles.tabText, activeTab === 'contact' && styles.activeTabText]}>Contact</Text>
                </TouchableOpacity>
            </View>

            <SafeAreaView style={styles.safeArea}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    enableOnAndroid={true}
                    enableAutomaticScroll={true}
                    extraScrollHeight={Platform.OS === 'ios' ? 100 : 120}
                    showsVerticalScrollIndicator={false}
                >
                    {activeTab === 'help' && renderHelpContent()}
                    {activeTab === 'videos' && renderVideosContent()}
                    {activeTab === 'contact' && renderContactContent()}
                </KeyboardAwareScrollView>
            </SafeAreaView>

            {/* Help Category Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalTitleRow}>
                                <Text style={styles.modalEmoji}>{selectedCategory?.icon}</Text>
                                <Text style={styles.modalTitle}>{selectedCategory?.title}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <CloseIcon />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                            <Text style={styles.modalText}>{selectedCategory?.content}</Text>
                            <TouchableOpacity
                                style={styles.needHelpBtn}
                                onPress={() => {
                                    setModalVisible(false);
                                    setActiveTab('contact');
                                }}
                            >
                                <Text style={styles.needHelpText}>Still Need Help? Contact Us</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Video Modal */}
            <Modal
                visible={videoModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setVideoModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.videoModalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle} numberOfLines={1}>{selectedVideo?.title}</Text>
                            <TouchableOpacity onPress={() => setVideoModalVisible(false)}>
                                <CloseIcon />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.videoPlayer}>
                            <Text style={styles.videoPlayerEmoji}>{selectedVideo?.thumbnail}</Text>
                            <TouchableOpacity style={styles.bigPlayBtn} onPress={handleWatchVideo}>
                                <PlayIcon />
                            </TouchableOpacity>
                            <Text style={styles.videoPlayerDuration}>{selectedVideo?.duration}</Text>
                        </View>
                        <View style={styles.videoDescription}>
                            <Text style={styles.videoDescTitle}>About This Video</Text>
                            <Text style={styles.videoDescText}>{selectedVideo?.description}</Text>
                            <View style={styles.videoCategoryTag}>
                                <Text style={styles.videoCategoryTagText}>{selectedVideo?.category}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.watchFullBtn} onPress={handleWatchVideo}>
                            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                                <Path d="M5 3L19 12L5 21V3Z" fill="#FFFFFF" />
                            </Svg>
                            <Text style={styles.watchFullText}>Watch Full Video</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        backgroundColor: '#293454',
        paddingVertical: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 14,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#293454',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#9CA3AF',
    },
    activeTabText: {
        color: '#293454',
        fontWeight: '600',
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    searchContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    searchIconContainer: {
        position: 'absolute',
        left: 12,
        top: 14,
        zIndex: 1,
    },
    searchInput: {
        width: '100%',
        paddingLeft: 44,
        paddingRight: 16,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
        fontSize: 15,
        color: '#374151',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
        marginTop: 8,
    },
    categoriesContainer: {
        gap: 12,
    },
    categoryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    categoryIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    categoryEmoji: {
        fontSize: 24,
    },
    categoryContent: {
        flex: 1,
    },
    categoryTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    categoryDescription: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    // Videos Tab
    featuredVideo: {
        backgroundColor: '#293454',
        borderRadius: 16,
        height: 180,
        marginBottom: 20,
        overflow: 'hidden',
    },
    featuredVideoOverlay: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-end',
    },
    featuredLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FCD34D',
        letterSpacing: 1,
        marginBottom: 8,
    },
    featuredTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    featuredDuration: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 12,
    },
    watchNowBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    watchNowText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#293454',
    },
    videosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    videoCard: {
        width: (width - 44) / 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    videoThumbnail: {
        height: 100,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    videoEmoji: {
        fontSize: 36,
    },
    playOverlay: {
        position: 'absolute',
    },
    durationBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    durationText: {
        fontSize: 11,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    videoInfo: {
        padding: 12,
    },
    videoTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
        lineHeight: 18,
    },
    videoCategory: {
        fontSize: 11,
        color: '#6B7280',
    },
    // Contact Tab
    helplineBanner: {
        backgroundColor: '#293454',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    helplineIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    helplineInfo: {
        flex: 1,
        marginLeft: 16,
    },
    helplineTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    helplineSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    callNowBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#16A34A',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    callNowText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    contactGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
    },
    contactOption: {
        width: (width - 44) / 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    contactOptionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    contactOptionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    contactOptionDetail: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    contactOptionAvailability: {
        fontSize: 11,
        color: '#16A34A',
        fontWeight: '500',
    },
    supportHoursCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 16,
    },
    supportHoursTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
    },
    hoursRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    hoursLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    hoursValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    emergencyNotice: {
        backgroundColor: '#FEF2F2',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    emergencyTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#DC2626',
        marginBottom: 8,
    },
    emergencyText: {
        fontSize: 13,
        color: '#7F1D1D',
        lineHeight: 20,
    },
    emergencyPhone: {
        fontWeight: '700',
        color: '#DC2626',
    },
    // Modals
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
    },
    videoModalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    modalEmoji: {
        fontSize: 24,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        flex: 1,
    },
    modalContent: {
        padding: 20,
    },
    modalText: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 22,
    },
    needHelpBtn: {
        backgroundColor: '#293454',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 20,
    },
    needHelpText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    videoPlayer: {
        height: 200,
        backgroundColor: '#1F2937',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    videoPlayerEmoji: {
        fontSize: 64,
        opacity: 0.3,
    },
    bigPlayBtn: {
        position: 'absolute',
    },
    videoPlayerDuration: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '500',
        overflow: 'hidden',
    },
    videoDescription: {
        padding: 20,
    },
    videoDescTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    videoDescText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 12,
    },
    videoCategoryTag: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    videoCategoryTagText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#4F46E5',
    },
    watchFullBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#293454',
        marginHorizontal: 20,
        marginBottom: 30,
        paddingVertical: 14,
        borderRadius: 12,
    },
    watchFullText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default HelpCenterScreen;
