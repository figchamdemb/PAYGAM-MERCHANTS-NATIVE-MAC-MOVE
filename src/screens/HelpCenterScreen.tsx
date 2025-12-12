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
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { StackNavigationProp } from '@react-navigation/stack';

type HelpCategory = {
    id: number;
    title: string;
    description: string;
    content: string;
};

const HelpCenterScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const { theme, isDarkMode } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<HelpCategory | null>(null);

    const categories: HelpCategory[] = [
        {
            id: 1,
            title: 'Emergency Services',
            description: 'Get help with emergency services, reporting incidents, and ambulance tracking.',
            content: 'Emergency services are available 24/7. In case of emergency, you can use the app to contact police, ambulance, or fire services. The app will automatically share your location with emergency responders to ensure quick assistance.',
        },
        {
            id: 2,
            title: 'App Features',
            description: 'Learn how to use scheduled check-ins, digital ID, and location sharing.',
            content: 'The EMS Gambia app offers various features to ensure your safety. You can set up scheduled check-ins, report incidents, track emergency response, and access nearby services.',
        },
        {
            id: 3,
            title: 'Account Issues',
            description: 'Reset password, update profile information, and manage notifications.',
            content: 'If you\'re having issues with your account, you can reset your password, update your profile information, or contact support for assistance. Make sure your contact information is up to date.',
        },
        {
            id: 4,
            title: 'Technical Support',
            description: 'Troubleshoot app crashes, connection issues, and update problems.',
            content: 'For technical issues, ensure your app is updated to the latest version. You can clear the app cache, restart your device, or contact our technical support team for assistance.',
        },
    ];

    const handleBack = () => {
        navigation.goBack();
    };

    const handleOpenCategory = (category: HelpCategory) => {
        setSelectedCategory(category);
        setModalVisible(true);
    };

    const handleCallSupport = () => {
        console.log('Call support: +220 777-7777');
    };

    const handleEmailSupport = () => {
        console.log('Email support: support@emsgambia.com');
    };

    const handleWhatsAppSupport = () => {
        console.log('WhatsApp support');
    };

    // Icons
    const ArrowLeftIcon = () => (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 19l-7-7 7-7M19 12H5" />
        </Svg>
    );

    const SearchIcon = () => (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="11" cy="11" r="8" />
            <Path d="M21 21l-4.3-4.3" />
        </Svg>
    );

    const EyeIcon = () => (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <Circle cx="12" cy="12" r="3" />
        </Svg>
    );

    const PhoneIcon = () => (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </Svg>
    );

    const EmailIcon = () => (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Rect width="20" height="16" x="2" y="4" rx="2" />
            <Path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </Svg>
    );

    const MessageIcon = () => (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </Svg>
    );

    const CloseIcon = () => (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M18 6L6 18M6 6l12 12" />
        </Svg>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.colors.headerBackground }]}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <ArrowLeftIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help Center</Text>
                <View style={{ width: 40 }} />
            </View>

            <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
                <KeyboardAwareScrollView 
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    enableOnAndroid={true}
                    enableAutomaticScroll={true}
                    extraScrollHeight={Platform.OS === 'ios' ? 100 : 120}
                    keyboardOpeningTime={0}
                >

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <View style={styles.searchIconContainer}>
                            <SearchIcon />
                        </View>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search for help..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {/* Help Categories */}
                    <View style={styles.categoriesContainer}>
                        {categories.map((category) => (
                            <View key={category.id} style={styles.categoryCard}>
                                <Text style={styles.categoryTitle}>{category.title}</Text>
                                <Text style={styles.categoryDescription}>{category.description}</Text>
                                <TouchableOpacity
                                    style={styles.viewButton}
                                    onPress={() => handleOpenCategory(category)}
                                    activeOpacity={0.8}
                                >
                                    <EyeIcon />
                                    <Text style={styles.viewButtonText}>View Articles & Videos</Text>
                                </TouchableOpacity>
                                <Text style={styles.helperText}>Watch video demonstrations and read detailed guides</Text>
                            </View>
                        ))}
                    </View>

                    {/* Contact Support Section */}
                    <View style={styles.contactSection}>
                        <Text style={styles.contactTitle}>Contact Support</Text>

                        <View style={styles.contactButtons}>
                            <TouchableOpacity
                                style={styles.contactButton}
                                onPress={handleCallSupport}
                                activeOpacity={0.8}
                            >
                                <View style={styles.contactIconCircleGreen}>
                                    <PhoneIcon />
                                </View>
                                <View style={styles.contactInfo}>
                                    <Text style={styles.contactLabel}>Call Support</Text>
                                    <Text style={styles.contactDetail}>+220 777-7777</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.contactButton}
                                onPress={handleEmailSupport}
                                activeOpacity={0.8}
                            >
                                <View style={styles.contactIconCircleBlue}>
                                    <EmailIcon />
                                </View>
                                <View style={styles.contactInfo}>
                                    <Text style={styles.contactLabel}>Email Support</Text>
                                    <Text style={styles.contactDetail}>support@emsgambia.com</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.contactButton}
                                onPress={handleWhatsAppSupport}
                                activeOpacity={0.8}
                            >
                                <View style={styles.contactIconCircleEmerald}>
                                    <MessageIcon />
                                </View>
                                <View style={styles.contactInfo}>
                                    <Text style={styles.contactLabel}>WhatsApp Support</Text>
                                    <Text style={styles.contactDetail}>Chat with an agent</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </SafeAreaView>

            {/* Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedCategory?.title}</Text>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <CloseIcon />
                            </TouchableOpacity>
                        </View>

                        {/* Modal Content */}
                        <ScrollView style={styles.modalContent}>
                            {/* Video Placeholder */}
                            <View style={styles.videoPlaceholder}>
                                <Text style={styles.videoPlaceholderText}>Video Tutorial</Text>
                            </View>

                            {/* Article */}
                            <View style={styles.articleSection}>
                                <Text style={styles.articleTitle}>Detailed Guide</Text>
                                <Text style={styles.articleText}>{selectedCategory?.content}</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.closeGuideButton}
                                onPress={() => setModalVisible(false)}
                                activeOpacity={0.9}
                            >
                                <Text style={styles.closeGuideButtonText}>Close Guide</Text>
                            </TouchableOpacity>
                        </ScrollView>
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
        backgroundColor: '#B45309',
        paddingVertical: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    backButton: {
        padding: 4,
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 16,
        paddingBottom: 100,
    },
    searchContainer: {
        position: 'relative',
        marginBottom: 24,
    },
    searchIconContainer: {
        position: 'absolute',
        left: 12,
        top: 14,
        zIndex: 1,
    },
    searchInput: {
        width: '100%',
        paddingLeft: 40,
        paddingRight: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
        fontSize: 14,
        color: '#374151',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    categoriesContainer: {
        gap: 16,
        marginBottom: 32,
    },
    categoryCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    categoryDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 16,
    },
    viewButton: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 8,
    },
    viewButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#B45309',
    },
    helperText: {
        fontSize: 10,
        color: '#9CA3AF',
        textAlign: 'center',
    },
    contactSection: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 24,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
        paddingLeft: 4,
    },
    contactButtons: {
        gap: 12,
    },
    contactButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    contactIconCircleGreen: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0FDF4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    contactIconCircleBlue: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    contactIconCircleEmerald: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ECFDF5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    contactDetail: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        width: '100%',
        maxWidth: 500,
        maxHeight: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        backgroundColor: '#FFFFFF',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    modalCloseButton: {
        padding: 8,
        borderRadius: 20,
    },
    modalContent: {
        padding: 20,
    },
    videoPlaceholder: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    videoPlaceholderText: {
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    articleSection: {
        marginBottom: 24,
    },
    articleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    articleText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    closeGuideButton: {
        backgroundColor: '#B45309',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#78350F',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    closeGuideButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default HelpCenterScreen;
