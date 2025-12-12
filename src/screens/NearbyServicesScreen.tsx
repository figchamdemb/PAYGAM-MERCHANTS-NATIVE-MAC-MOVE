import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
} from 'react-native';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';

type ServiceType = 'police' | 'ambulance' | 'fire' | 'hospital' | 'pharmacy' | 'doctors';

const NearbyServicesScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const { theme, isDarkMode } = useTheme();

    const handleBack = () => {
        navigation.goBack();
    };

    const handleServicePress = (service: ServiceType) => {
        console.log(`Navigate to ${service} nearby`);
        // Navigation logic here
    };

    const handleHomePress = () => {
        navigation.navigate('Home');
    };

    // Icons
    const ArrowLeftIcon = () => (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M19 12H5M12 19l-7-7 7-7" />
        </Svg>
    );

    const PhoneIcon = () => (
        <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </Svg>
    );

    const AmbulanceIcon = () => (
        <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M10 10H6M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
            <Path d="M18 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-2.316-.772M14 18h-4" />
            <Circle cx="7" cy="18" r="2" />
            <Circle cx="17" cy="18" r="2" />
        </Svg>
    );

    const FireIcon = () => (
        <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 2v8M8 4h8M6 8h12M4 12h16M2 16h20M4 20h16" />
        </Svg>
    );

    const HospitalIcon = () => (
        <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 6v4M14 8h-4M14 10h-4M6 18h12M8 22v-4M16 22v-4" />
            <Rect x="4" y="4" width="16" height="16" rx="2" />
        </Svg>
    );

    const PillsIcon = () => (
        <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M10.5 20.5 10 21a2 2 0 0 1-2.828 0L3.879 17.707a2 2 0 0 1 0-2.828l8.49-8.49a2 2 0 0 1 2.828 0l4.293 4.293a2 2 0 0 1 0 2.828l-.707.707" />
            <Path d="M15 3c-8.5 8.5-8.5 8.5-3 14s5.5 5.5 14-3" />
            <Circle cx="18.5" cy="5.5" r="1.5" />
        </Svg>
    );

    const DoctorIcon = () => (
        <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="8" r="4" />
            <Path d="M16 20v-2a4 4 0 0 0-8 0v2M12 14v7M15 18h-6" />
        </Svg>
    );

    const HomeIcon = () => (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <Path d="M9 22V12h6v10" />
        </Svg>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <ArrowLeftIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Near By Service</Text>
            </View>

            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Title Section */}
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>Emergency & Health</Text>
                        <Text style={styles.subtitle}>Select a service below to locate nearby help</Text>
                    </View>

                    {/* Services Grid */}
                    <View style={styles.servicesGrid}>

                        {/* Police */}
                        <TouchableOpacity
                            style={styles.serviceCard}
                            onPress={() => handleServicePress('police')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconCircle, styles.iconCircleBlue]}>
                                <PhoneIcon />
                            </View>
                            <Text style={styles.serviceLabel}>Police{'\n'}Nearby</Text>
                        </TouchableOpacity>

                        {/* Ambulance */}
                        <TouchableOpacity
                            style={styles.serviceCard}
                            onPress={() => handleServicePress('ambulance')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconCircle, styles.iconCircleGreen]}>
                                <AmbulanceIcon />
                            </View>
                            <Text style={styles.serviceLabel}>Ambulance{'\n'}Service</Text>
                        </TouchableOpacity>

                        {/* Fire Service */}
                        <TouchableOpacity
                            style={styles.serviceCard}
                            onPress={() => handleServicePress('fire')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconCircle, styles.iconCircleRed]}>
                                <FireIcon />
                            </View>
                            <Text style={styles.serviceLabel}>Fire Service{'\n'}Nearby</Text>
                        </TouchableOpacity>

                        {/* Hospital */}
                        <TouchableOpacity
                            style={styles.serviceCard}
                            onPress={() => handleServicePress('hospital')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconCircle, styles.iconCircleBlue]}>
                                <HospitalIcon />
                            </View>
                            <Text style={styles.serviceLabel}>Hospital{'\n'}Nearby</Text>
                        </TouchableOpacity>

                        {/* Pharmacy (Highlighted) */}
                        <TouchableOpacity
                            style={styles.serviceCardHighlight}
                            onPress={() => handleServicePress('pharmacy')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.popularBadge}>
                                <Text style={styles.popularBadgeText}>POPULAR</Text>
                            </View>
                            <View style={[styles.iconCircle, styles.iconCircleRed]}>
                                <PillsIcon />
                            </View>
                            <Text style={styles.serviceLabelBold}>Pharmacies{'\n'}Nearby</Text>
                        </TouchableOpacity>

                        {/* Doctors */}
                        <TouchableOpacity
                            style={styles.serviceCard}
                            onPress={() => handleServicePress('doctors')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconCircle, styles.iconCircleGreen]}>
                                <DoctorIcon />
                            </View>
                            <Text style={styles.serviceLabel}>Doctors{'\n'}Nearby</Text>
                        </TouchableOpacity>

                    </View>

                </ScrollView>
            </SafeAreaView>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.homeButton} onPress={handleHomePress}>
                    <View style={styles.homeIconCircle}>
                        <HomeIcon />
                    </View>
                    <Text style={styles.homeLabel}>Home</Text>
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
        backgroundColor: '#B45309',
        paddingVertical: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    backButton: {
        padding: 8,
        marginRight: 16,
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
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 500,
        width: '100%',
        alignSelf: 'center',
    },
    titleSection: {
        width: '100%',
        marginBottom: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    servicesGrid: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
        justifyContent: 'space-between',
    },
    serviceCard: {
        width: '47%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        minHeight: 140,
    },
    serviceCardHighlight: {
        width: '47%',
        backgroundColor: 'rgba(254, 243, 199, 0.5)',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(180, 83, 9, 0.3)',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        position: 'relative',
        overflow: 'hidden',
        minHeight: 140,
    },
    popularBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#B45309',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderBottomLeftRadius: 8,
    },
    popularBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    iconCircleBlue: {
        backgroundColor: '#EFF6FF',
    },
    iconCircleGreen: {
        backgroundColor: '#F0FDF4',
    },
    iconCircleRed: {
        backgroundColor: '#FEF2F2',
    },
    serviceLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        textAlign: 'center',
        lineHeight: 18,
    },
    serviceLabelBold: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        textAlign: 'center',
        lineHeight: 18,
    },
    footer: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingVertical: 8,
        paddingBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 10,
        alignItems: 'center',
    },
    homeButton: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    homeIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(180, 83, 9, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    homeLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#B45309',
    },
});

export default NearbyServicesScreen;
