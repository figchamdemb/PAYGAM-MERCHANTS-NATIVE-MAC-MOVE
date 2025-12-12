/**
 * E-GOV-GUARDS-PORTAL - Database Search Screen
 * Screen 11: Global Database Search
 * 
 * Features:
 * - Multi-scope search (Persons, Vehicles, Cases, Warrants)
 * - Advanced filters
 * - BOLO priority list
 * - Recent searches
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

type SearchScope = 'ALL' | 'PERSONS' | 'VEHICLES' | 'CASES' | 'WARRANTS';
type ResultType = 'person' | 'vehicle' | 'case' | 'warrant';
type AlertLevel = 'HIGH' | 'MEDIUM' | 'LOW';

interface SearchResult {
    id: string;
    type: ResultType;
    title: string;
    subtitle: string;
    alertLevel?: AlertLevel;
    date?: string;
}

interface BOLOItem {
    id: string;
    type: 'person' | 'vehicle';
    title: string;
    description: string;
    priority: 'URGENT' | 'HIGH' | 'MEDIUM';
    issuedDate: string;
}

const MOCK_RESULTS: SearchResult[] = [
    { id: '1', type: 'person', title: 'John Doe', subtitle: 'ID: GMB-12345', alertLevel: 'HIGH' },
    { id: '2', type: 'vehicle', title: 'BJL-5678', subtitle: 'Toyota Corolla - Silver', alertLevel: 'MEDIUM' },
    { id: '3', type: 'case', title: 'Case #2024-1234', subtitle: 'Robbery - Open', date: 'Dec 5, 2024' },
    { id: '4', type: 'warrant', title: 'Warrant #W-5678', subtitle: 'Arrest - Active', alertLevel: 'HIGH' },
];

const BOLO_ITEMS: BOLOItem[] = [
    {
        id: '1',
        type: 'person',
        title: 'Wanted: Armed Robbery Suspect',
        description: 'Male, 30-35 years, last seen Sector 4',
        priority: 'URGENT',
        issuedDate: '2 hours ago',
    },
    {
        id: '2',
        type: 'vehicle',
        title: 'Stolen Vehicle: BJL-9999',
        description: 'Black Toyota Hilux, dented rear bumper',
        priority: 'HIGH',
        issuedDate: '5 hours ago',
    },
];

const SCOPES: { value: SearchScope; label: string; icon: string }[] = [
    { value: 'ALL', label: 'All', icon: 'search' },
    { value: 'PERSONS', label: 'Persons', icon: 'user' },
    { value: 'VEHICLES', label: 'Vehicles', icon: 'car' },
    { value: 'CASES', label: 'Cases', icon: 'folder' },
    { value: 'WARRANTS', label: 'Warrants', icon: 'gavel' },
];

const DatabaseSearchScreen: React.FC = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedScope, setSelectedScope] = useState<SearchScope>('ALL');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        // Simulate search
        setTimeout(() => {
            setIsSearching(false);
            setResults(MOCK_RESULTS);
            setShowResults(true);
        }, 1000);
    };

    const getAlertColor = (level?: AlertLevel) => {
        switch (level) {
            case 'HIGH': return colors.status.error;
            case 'MEDIUM': return colors.status.warning;
            case 'LOW': return colors.status.info;
            default: return 'transparent';
        }
    };

    const getTypeIcon = (type: ResultType) => {
        switch (type) {
            case 'person': return 'user';
            case 'vehicle': return 'car';
            case 'case': return 'folder';
            case 'warrant': return 'gavel';
        }
    };

    const getPriorityColor = (priority: 'URGENT' | 'HIGH' | 'MEDIUM') => {
        switch (priority) {
            case 'URGENT': return colors.status.error;
            case 'HIGH': return colors.status.warning;
            case 'MEDIUM': return colors.status.info;
        }
    };

    const renderResult = ({ item }: { item: SearchResult }) => (
        <TouchableOpacity style={styles.resultCard}>
            <View style={[styles.resultIcon, { backgroundColor: getAlertColor(item.alertLevel) + '20' }]}>
                <Icon name={getTypeIcon(item.type)} size={18} color={getAlertColor(item.alertLevel) || colors.primary} />
            </View>
            <View style={styles.resultInfo}>
                <Text style={styles.resultTitle}>{item.title}</Text>
                <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
            </View>
            {item.alertLevel && (
                <View style={[styles.alertBadge, { backgroundColor: getAlertColor(item.alertLevel) }]}>
                    <Text style={styles.alertBadgeText}>{item.alertLevel}</Text>
                </View>
            )}
            <Icon name="chevron-right" size={14} color="#9CA3AF" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Database Search</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Icon name="sliders-h" size={16} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputWrapper}>
                    <Icon name="search" size={18} color="#6B7280" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search name, plate, case number..."
                        placeholderTextColor="#6B7280"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => { setSearchQuery(''); setShowResults(false); }}>
                            <Icon name="times-circle" size={18} color="#6B7280" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity
                    style={[styles.searchButton, !searchQuery.trim() && styles.searchButtonDisabled]}
                    onPress={handleSearch}
                    disabled={!searchQuery.trim()}
                >
                    <Icon name="search" size={16} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Scope Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scopeContainer}
                contentContainerStyle={styles.scopeContent}
            >
                {SCOPES.map((scope) => (
                    <TouchableOpacity
                        key={scope.value}
                        style={[styles.scopeButton, selectedScope === scope.value && styles.scopeButtonActive]}
                        onPress={() => setSelectedScope(scope.value)}
                    >
                        <Icon
                            name={scope.icon}
                            size={14}
                            color={selectedScope === scope.value ? '#FFFFFF' : '#6B7280'}
                        />
                        <Text style={[styles.scopeText, selectedScope === scope.value && styles.scopeTextActive]}>
                            {scope.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.content}>
                {showResults ? (
                    // Search Results
                    <View style={styles.resultsSection}>
                        <Text style={styles.sectionTitle}>
                            {results.length} Results for "{searchQuery}"
                        </Text>
                        <FlatList
                            data={results}
                            renderItem={renderResult}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                ) : (
                    // BOLO & Recent Searches
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* BOLO Section */}
                        <View style={styles.boloSection}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleContainer}>
                                    <Icon name="exclamation-triangle" size={16} color={colors.status.error} />
                                    <Text style={styles.sectionTitle}>Active BOLOs</Text>
                                </View>
                                <TouchableOpacity>
                                    <Text style={styles.viewAll}>View All</Text>
                                </TouchableOpacity>
                            </View>

                            {BOLO_ITEMS.map((item) => (
                                <TouchableOpacity key={item.id} style={styles.boloCard}>
                                    <View style={[styles.boloPriority, { backgroundColor: getPriorityColor(item.priority) }]}>
                                        <Text style={styles.boloPriorityText}>{item.priority}</Text>
                                    </View>
                                    <View style={styles.boloContent}>
                                        <View style={styles.boloHeader}>
                                            <Icon
                                                name={item.type === 'person' ? 'user' : 'car'}
                                                size={14}
                                                color="#6B7280"
                                            />
                                            <Text style={styles.boloTitle}>{item.title}</Text>
                                        </View>
                                        <Text style={styles.boloDescription}>{item.description}</Text>
                                        <Text style={styles.boloDate}>Issued: {item.issuedDate}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Recent Searches */}
                        <View style={styles.recentSection}>
                            <Text style={styles.sectionTitle}>Recent Searches</Text>
                            <View style={styles.recentList}>
                                {['BJL-4523', 'Amadou Jallow', 'Case #2024-789'].map((search, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.recentItem}
                                        onPress={() => { setSearchQuery(search); handleSearch(); }}
                                    >
                                        <Icon name="history" size={14} color="#6B7280" />
                                        <Text style={styles.recentText}>{search}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Quick Access */}
                        <View style={styles.quickAccessSection}>
                            <Text style={styles.sectionTitle}>Quick Access</Text>
                            <View style={styles.quickGrid}>
                                <TouchableOpacity style={styles.quickCard}>
                                    <Icon name="id-card" size={24} color={colors.primary} />
                                    <Text style={styles.quickText}>Person Lookup</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.quickCard}>
                                    <Icon name="car" size={24} color={colors.primary} />
                                    <Text style={styles.quickText}>Plate Check</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.quickCard}>
                                    <Icon name="gavel" size={24} color={colors.status.warning} />
                                    <Text style={styles.quickText}>Warrants</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.quickCard}>
                                    <Icon name="fingerprint" size={24} color={colors.primary} />
                                    <Text style={styles.quickText}>Criminal Records</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                )}
            </View>
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
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Search
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 10,
        marginBottom: 12,
    },
    searchInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        paddingHorizontal: 14,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 15,
        color: '#FFFFFF',
    },
    searchButton: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchButtonDisabled: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },

    // Scope Tabs
    scopeContainer: {
        maxHeight: 50,
        marginBottom: 8,
    },
    scopeContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    scopeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
        gap: 6,
    },
    scopeButtonActive: {
        backgroundColor: colors.primary,
    },
    scopeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    scopeTextActive: {
        color: '#FFFFFF',
    },

    // Content
    content: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 16,
    },

    // Section Headers
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    viewAll: {
        fontSize: 13,
        color: colors.primary,
        fontWeight: '600',
    },

    // Results
    resultsSection: {
        flex: 1,
    },
    resultCard: {
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
    resultIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    resultInfo: {
        flex: 1,
    },
    resultTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    resultSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    alertBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
    },
    alertBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    // BOLO
    boloSection: {
        marginBottom: 24,
    },
    boloCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    boloPriority: {
        paddingVertical: 4,
        alignItems: 'center',
    },
    boloPriorityText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    boloContent: {
        padding: 14,
    },
    boloHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    boloTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        flex: 1,
    },
    boloDescription: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 6,
    },
    boloDate: {
        fontSize: 11,
        color: '#9CA3AF',
    },

    // Recent
    recentSection: {
        marginBottom: 24,
    },
    recentList: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        gap: 12,
    },
    recentText: {
        fontSize: 14,
        color: '#374151',
    },

    // Quick Access
    quickAccessSection: {
        marginBottom: 32,
    },
    quickGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    quickCard: {
        width: '47%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    quickText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
        marginTop: 10,
    },
});

export default DatabaseSearchScreen;
