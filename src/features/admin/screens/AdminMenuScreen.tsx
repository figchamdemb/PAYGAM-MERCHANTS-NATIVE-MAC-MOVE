/**
 * E-GOV-GUARDS-PORTAL - Admin Menu Screen
 * Screen 8: Station Administration
 * 
 * Features:
 * - Grid of admin function tiles
 * - Badge counts for pending items
 * - Quick stats dashboard
 */

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
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../../config/colors';
import { useNavigation } from '@react-navigation/native';

interface AdminTile {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    color: string;
    badge?: number;
    route?: string;
}

const ADMIN_TILES: AdminTile[] = [
    {
        id: 'roster',
        title: 'Duty Roster',
        subtitle: 'Manage schedules',
        icon: 'calendar-alt',
        color: colors.primary,
        badge: 2,
    },
    {
        id: 'officers',
        title: 'Officers',
        subtitle: 'Personnel management',
        icon: 'users',
        color: colors.agency.police.secondary,
    },
    {
        id: 'vehicles',
        title: 'Fleet',
        subtitle: 'Vehicle management',
        icon: 'car',
        color: '#059669',
    },
    {
        id: 'equipment',
        title: 'Equipment',
        subtitle: 'Inventory & checkout',
        icon: 'tools',
        color: '#7C3AED',
        badge: 5,
    },
    {
        id: 'reports',
        title: 'Reports',
        subtitle: 'Analytics & stats',
        icon: 'chart-bar',
        color: '#EC4899',
    },
    {
        id: 'approvals',
        title: 'Approvals',
        subtitle: 'Pending requests',
        icon: 'clipboard-check',
        color: colors.status.warning,
        badge: 8,
    },
    {
        id: 'announcements',
        title: 'Announcements',
        subtitle: 'Station bulletins',
        icon: 'bullhorn',
        color: '#EF4444',
    },
    {
        id: 'settings',
        title: 'Settings',
        subtitle: 'System config',
        icon: 'cog',
        color: '#6B7280',
    },
];

const QUICK_STATS = [
    { label: 'On Duty', value: '24', icon: 'user-check' },
    { label: 'Active Patrol', value: '12', icon: 'car-side' },
    { label: 'Open Cases', value: '48', icon: 'folder-open' },
    { label: 'Pending', value: '8', icon: 'clock' },
];

const AdminMenuScreen: React.FC = () => {
    const navigation = useNavigation();

    const handleTilePress = (tile: AdminTile) => {
        if (tile.route) {
            // navigation.navigate(tile.route as never);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Station Admin</Text>
                    <Text style={styles.stationName}>Banjul Central Police Station</Text>
                </View>
                <TouchableOpacity style={styles.profileButton}>
                    <Icon name="user-shield" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                    {QUICK_STATS.map((stat, index) => (
                        <View key={index} style={styles.statCard}>
                            <Icon name={stat.icon} size={18} color={colors.primary} />
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Admin Tiles Grid */}
                <Text style={styles.sectionTitle}>Administration</Text>
                <View style={styles.tilesGrid}>
                    {ADMIN_TILES.map((tile) => (
                        <TouchableOpacity
                            key={tile.id}
                            style={styles.tile}
                            onPress={() => handleTilePress(tile)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.tileIconContainer, { backgroundColor: tile.color + '15' }]}>
                                <Icon name={tile.icon} size={24} color={tile.color} />
                                {tile.badge && (
                                    <View style={styles.tileBadge}>
                                        <Text style={styles.tileBadgeText}>{tile.badge}</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.tileTitle}>{tile.title}</Text>
                            <Text style={styles.tileSubtitle}>{tile.subtitle}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recent Activity */}
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <View style={styles.activityCard}>
                    <View style={styles.activityItem}>
                        <View style={styles.activityIcon}>
                            <Icon name="user-plus" size={14} color={colors.status.success} />
                        </View>
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityText}>New officer assigned to Sector 4</Text>
                            <Text style={styles.activityTime}>10 minutes ago</Text>
                        </View>
                    </View>
                    <View style={styles.activityDivider} />
                    <View style={styles.activityItem}>
                        <View style={styles.activityIcon}>
                            <Icon name="car" size={14} color={colors.primary} />
                        </View>
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityText}>Vehicle Unit-15 returned from patrol</Text>
                            <Text style={styles.activityTime}>25 minutes ago</Text>
                        </View>
                    </View>
                    <View style={styles.activityDivider} />
                    <View style={styles.activityItem}>
                        <View style={styles.activityIcon}>
                            <Icon name="file-alt" size={14} color={colors.status.warning} />
                        </View>
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityText}>3 reports pending supervisor review</Text>
                            <Text style={styles.activityTime}>45 minutes ago</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.dark,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    greeting: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
    },
    stationName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 4,
    },
    profileButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    content: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingTop: 20,
    },

    // Stats
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 10,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 11,
        color: '#6B7280',
        marginTop: 2,
    },

    // Section Title
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        paddingHorizontal: 20,
        marginBottom: 12,
    },

    // Tiles Grid
    tilesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 24,
    },
    tile: {
        width: '47%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    tileIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        position: 'relative',
    },
    tileBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: colors.status.error,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    tileBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    tileTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    tileSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },

    // Activity
    activityCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 16,
        marginBottom: 32,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 10,
    },
    activityIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    activityInfo: {
        flex: 1,
    },
    activityText: {
        fontSize: 14,
        color: '#374151',
    },
    activityTime: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    activityDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 44,
    },
});

export default AdminMenuScreen;
