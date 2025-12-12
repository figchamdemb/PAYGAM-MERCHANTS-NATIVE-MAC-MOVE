// src/screens/jobs/JobBoardScreen.tsx
// Government Jobs Board Screen

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import { governmentJobs, Job, getUrgentJobs, searchJobs } from '../../data/jobs';

const { width } = Dimensions.get('window');

// SVG Icon Components
const ArrowLeftIcon = ({ color = '#374151', size = 18 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

const BellIcon = ({ color = '#4B5563', size = 18 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

const SearchIcon = ({ color = '#9CA3AF', size = 16 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Circle cx={11} cy={11} r={8} />
    <Path d="m21 21-4.35-4.35" />
  </Svg>
);

const BriefcaseIcon = ({ color = '#B45309', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Rect x={2} y={7} width={20} height={14} rx={2} ry={2} />
    <Path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </Svg>
);

const ShieldIcon = ({ color = '#FFFFFF', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
);

const MedicalIcon = ({ color = '#2563EB', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </Svg>
);

const TreeIcon = ({ color = '#16A34A', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M12 22v-7M10 7l-2 5h8l-2-5M12 2l4 10H8l4-10z" />
  </Svg>
);

const BuildingIcon = ({ color = '#6B7280', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18H6zM6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
  </Svg>
);

const GraduationIcon = ({ color = '#7C3AED', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <Path d="M6 12v5c0 2.21 2.69 4 6 4s6-1.79 6-4v-5" />
  </Svg>
);

const CoinsIcon = ({ color = '#D97706', size = 12 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Circle cx={8} cy={8} r={6} />
    <Path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4" />
  </Svg>
);

const DoctorIcon = ({ color = '#4B5563', size = 12 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
  </Svg>
);

const ShieldBadgeIcon = ({ color = '#4B5563', size = 12 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4" />
  </Svg>
);

const BookmarkIcon = ({ color = '#9CA3AF', size = 18, filled = false }: { color?: string; size?: number; filled?: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth={2}>
    <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </Svg>
);

const ArrowRightIcon = ({ color = '#B45309', size = 10 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M5 12h14M12 5l7 7-7 7" />
  </Svg>
);

const InfoIcon = ({ color = '#3B82F6', size = 16 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Circle cx={12} cy={12} r={10} />
    <Path d="M12 16v-4M12 8h.01" />
  </Svg>
);

const HomeIcon = ({ color = '#9CA3AF', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Path d="M9 22V12h6v10" />
  </Svg>
);

const FileIcon = ({ color = '#9CA3AF', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </Svg>
);

const UserIcon = ({ color = '#9CA3AF', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx={12} cy={7} r={4} />
  </Svg>
);

const PlusIcon = ({ color = '#FFFFFF', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M12 5v14M5 12h14" />
  </Svg>
);

type FilterCategory = 'all' | 'health' | 'police' | 'education' | 'revenue';

interface FilterButton {
  id: FilterCategory;
  label: string;
  iconType?: string;
}

const filterButtons: FilterButton[] = [
  { id: 'all', label: 'All Jobs' },
  { id: 'health', label: 'Health', iconType: 'doctor' },
  { id: 'police', label: 'Police', iconType: 'shield' },
  { id: 'education', label: 'Education', iconType: 'graduation' },
  { id: 'revenue', label: 'Revenue', iconType: 'coins' },
];

const getJobIconComponent = (iconName: string, color: string) => {
  switch (iconName) {
    case 'shield': return <ShieldIcon color={color} />;
    case 'medical': return <MedicalIcon color={color} />;
    case 'tree': return <TreeIcon color={color} />;
    case 'bank': return <BuildingIcon color={color} />;
    case 'education': return <GraduationIcon color={color} />;
    default: return <BriefcaseIcon color={color} />;
  }
};

const getFilterIcon = (iconType: string | undefined, color: string) => {
  switch (iconType) {
    case 'doctor': return <DoctorIcon color={color} size={12} />;
    case 'shield': return <ShieldBadgeIcon color={color} size={12} />;
    case 'graduation': return <GraduationIcon color={color} size={12} />;
    case 'coins': return <CoinsIcon color={color} size={12} />;
    default: return null;
  }
};

const JobBoardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  const urgentJobs = getUrgentJobs().filter(job => job.category === 'government');
  const featuredJob = urgentJobs[0];

  const getFilteredJobs = useCallback(() => {
    let jobs = governmentJobs;
    
    if (searchQuery) {
      jobs = searchJobs(searchQuery, 'government');
    }

    if (activeFilter !== 'all') {
      jobs = jobs.filter(job => {
        const deptLower = job.department.toLowerCase();
        switch (activeFilter) {
          case 'health': return deptLower.includes('health');
          case 'police': return deptLower.includes('interior') || deptLower.includes('police');
          case 'education': return deptLower.includes('education');
          case 'revenue': return deptLower.includes('revenue');
          default: return true;
        }
      });
    }

    return jobs.filter(job => !job.isUrgent);
  }, [searchQuery, activeFilter]);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleApplyNow = (job: Job) => {
    navigation.navigate('JobApply', { job });
  };

  const handleViewDetails = (job: Job) => {
    navigation.navigate('JobDetails', { job });
  };

  const renderJobCard = (job: Job) => (
    <View key={job.id} style={styles.jobCard}>
      <View style={styles.jobCardHeader}>
        <View style={styles.jobCardLeft}>
          <View style={[styles.jobIconContainer, { backgroundColor: job.iconBgColor }]}>
            {getJobIconComponent(job.icon, job.iconColor)}
          </View>
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.jobDepartment}>{job.department}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => toggleSaveJob(job.id)}>
          <BookmarkIcon 
            color={savedJobs.includes(job.id) ? '#B45309' : '#9CA3AF'}
            filled={savedJobs.includes(job.id)}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tagContainer}>
        {job.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.jobCardFooter}>
        <View>
          <Text style={styles.salary}>D{job.salary.toLocaleString()} <Text style={styles.salaryPeriod}>/mo</Text></Text>
        </View>
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => handleViewDetails(job)}
        >
          <Text style={styles.detailsButtonText}>Details & Apply</Text>
          <ArrowRightIcon />
        </TouchableOpacity>
      </View>
    </View>
  );

  const { theme, isDarkMode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeftIcon />
            </TouchableOpacity>
            <View>
              <Text style={styles.brandText}>EGOV-CITIZEN</Text>
              <Text style={styles.headerTitle}>Government Jobs</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <BellIcon />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder="Search positions or departments..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Buttons */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {filterButtons.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                activeFilter === filter.id && styles.filterButtonActive
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              {filter.iconType && (
                <View style={{ marginRight: 6 }}>
                  {getFilterIcon(filter.iconType, activeFilter === filter.id ? '#FFFFFF' : '#4B5563')}
                </View>
              )}
              <Text style={[
                styles.filterButtonText,
                activeFilter === filter.id && styles.filterButtonTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Urgent Hiring Section */}
        {featuredJob && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Urgent Hiring</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>

            <LinearGradient
              colors={['#B45309', '#9A3412']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featuredCard}
            >
              <View style={styles.featuredDecoration} />
              <View style={styles.featuredHeader}>
                <View style={styles.featuredIconContainer}>
                  <ShieldIcon color="#FFFFFF" />
                </View>
                <View style={styles.urgentBadge}>
                  <Text style={styles.urgentBadgeText}>Urgent</Text>
                </View>
              </View>
              <Text style={styles.featuredTitle}>{featuredJob.title}</Text>
              <Text style={styles.featuredDepartment}>{featuredJob.department} • {featuredJob.location}</Text>
              
              <View style={styles.featuredFooter}>
                <View>
                  <Text style={styles.featuredSalary}>
                    D{featuredJob.salary.toLocaleString()} 
                    <Text style={styles.featuredSalaryPeriod}> / month</Text>
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.applyNowButton}
                  onPress={() => handleApplyNow(featuredJob)}
                >
                  <Text style={styles.applyNowButtonText}>Apply Now</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </>
        )}

        {/* Recent Openings */}
        <Text style={styles.recentTitle}>Recent Openings</Text>
        
        {getFilteredJobs().map(renderJobCard)}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <InfoIcon />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Gov Hiring Process</Text>
            <Text style={styles.infoText}>
              Applications are reviewed directly by the respective department. Ensure your profile is up to date before applying.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <HomeIcon />
          <Text style={styles.navItemText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <BriefcaseIcon />
          <Text style={[styles.navItemText, styles.navItemTextActive]}>Jobs</Text>
        </TouchableOpacity>
        
        <View style={styles.navItemCenter}>
          <TouchableOpacity style={styles.addButton}>
            <PlusIcon />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('JobApplicationStatus')}
        >
          <FileIcon />
          <Text style={styles.navItemText}>Status</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <UserIcon />
          <Text style={styles.navItemText}>Profile</Text>
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
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? 40 : 48,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  brandText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B45309',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
  filterContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#B45309',
    borderColor: '#B45309',
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#B45309',
  },
  featuredCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  featuredDecoration: {
    position: 'absolute',
    right: -24,
    top: -24,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  featuredIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  urgentBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  urgentBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featuredDepartment: {
    fontSize: 14,
    color: '#FED7AA',
    marginBottom: 16,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredSalary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  featuredSalaryPeriod: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FDBA74',
  },
  applyNowButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  applyNowButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B45309',
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    marginTop: 8,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobCardLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  jobIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  jobDepartment: {
    fontSize: 12,
    color: '#6B7280',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  jobCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F9FAFB',
  },
  salary: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  salaryPeriod: {
    fontWeight: '400',
    color: '#9CA3AF',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B45309',
    marginRight: 4,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    gap: 12,
  },
  infoContent: {
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
    color: '#2563EB',
    lineHeight: 18,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navItemText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  navItemTextActive: {
    color: '#B45309',
  },
  navItemCenter: {
    position: 'relative',
    top: -24,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#B45309',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#F9FAFB',
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default JobBoardScreen;
