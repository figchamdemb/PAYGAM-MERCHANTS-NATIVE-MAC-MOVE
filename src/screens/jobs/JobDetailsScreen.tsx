import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import Svg, { Path, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

// SVG Icon Components
const ArrowLeftIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M12 19l-7-7 7-7"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ShareIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const BookmarkIcon = ({ size = 24, color = '#FFFFFF', filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
    <Path
      d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LocationIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth={2} />
  </Svg>
);

const ClockIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BriefcaseIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const DollarIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path
      d="M12 6v12M16 10c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.8 3 4 3 4 1.3 4 3-1.8 3-4 3"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CalendarIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const UsersIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 11a4 4 0 100-8 4 4 0 000 8z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CheckIcon = ({ size = 16, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 6L9 17l-5-5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const BuildingIcon = ({ size = 20, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-16 0H3"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 7h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const GlobeIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path
      d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const EmailIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M22 6l-10 7L2 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PhoneIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface JobDetailsScreenProps {
  navigation: any;
  route: any;
}

const JobDetailsScreen: React.FC<JobDetailsScreenProps> = ({ navigation, route }) => {
  const { job } = route.params;
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this job: ${job.title} at ${job.department}\n\nLocation: ${job.location}\nSalary: ${job.salary}\n\nApply now!`,
        title: job.title,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleApply = () => {
    navigation.navigate('JobApply', { job });
  };

  const jobDetails = {
    postedDate: '3 days ago',
    applicants: '45 applicants',
    experience: '2-4 years',
    education: "Bachelor's degree",
    deadline: job.deadline || 'March 15, 2024',
  };

  const requirements = job.requirements || [
    'Bachelor\'s degree in relevant field',
    'Minimum 2 years of experience',
    'Strong communication skills',
    'Proficiency in Microsoft Office',
    'Ability to work in a team environment',
    'Good problem-solving skills',
  ];

  const responsibilities = job.responsibilities || [
    'Manage daily operations and workflows',
    'Coordinate with team members and departments',
    'Prepare reports and documentation',
    'Handle client inquiries and requests',
    'Ensure compliance with company policies',
    'Participate in training and development programs',
  ];

  const benefits = job.benefits || [
    'Competitive salary package',
    'Health insurance coverage',
    'Annual leave and sick leave',
    'Professional development opportunities',
    'Transportation allowance',
    'Performance bonuses',
  ];

  const { theme, isDarkMode } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.statusBar} />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#3B82F6', '#1D4ED8']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeftIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleShare}
            >
              <ShareIcon size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setIsSaved(!isSaved)}
            >
              <BookmarkIcon size={22} color="#FFFFFF" filled={isSaved} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.headerContent}>
          <View style={styles.companyLogo}>
            <Text style={styles.companyLogoText}>{job.department.charAt(0)}</Text>
          </View>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.companyName}>{job.department}</Text>
          
          <View style={styles.jobMeta}>
            <View style={styles.metaItem}>
              <LocationIcon size={14} color="#DBEAFE" />
              <Text style={styles.metaText}>{job.location}</Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <ClockIcon size={14} color="#DBEAFE" />
              <Text style={styles.metaText}>{job.type}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Info Cards */}
        <View style={styles.quickInfoContainer}>
          <View style={styles.quickInfoCard}>
            <DollarIcon size={20} color="#10B981" />
            <Text style={styles.quickInfoLabel}>Salary</Text>
            <Text style={styles.quickInfoValue}>{job.salary}</Text>
          </View>
          <View style={styles.quickInfoCard}>
            <BriefcaseIcon size={20} color="#3B82F6" />
            <Text style={styles.quickInfoLabel}>Experience</Text>
            <Text style={styles.quickInfoValue}>{jobDetails.experience}</Text>
          </View>
          <View style={styles.quickInfoCard}>
            <CalendarIcon size={20} color="#F59E0B" />
            <Text style={styles.quickInfoLabel}>Deadline</Text>
            <Text style={styles.quickInfoValue}>{jobDetails.deadline}</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {['description', 'company', 'reviews'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'description' && (
          <>
            {/* Job Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Job Description</Text>
              <Text style={styles.descriptionText}>
                {job.description || `We are looking for a skilled ${job.title} to join our team at ${job.department}. The ideal candidate will have experience in their field and a passion for excellence. This is an exciting opportunity to work with a dynamic team and contribute to meaningful projects.`}
              </Text>
            </View>

            {/* Requirements */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Requirements</Text>
              {requirements.map((req, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.bulletPoint}>
                    <CheckIcon size={14} color="#10B981" />
                  </View>
                  <Text style={styles.listItemText}>{req}</Text>
                </View>
              ))}
            </View>

            {/* Responsibilities */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Responsibilities</Text>
              {responsibilities.map((resp, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.bulletPoint}>
                    <Text style={styles.bulletNumber}>{index + 1}</Text>
                  </View>
                  <Text style={styles.listItemText}>{resp}</Text>
                </View>
              ))}
            </View>

            {/* Benefits */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Benefits</Text>
              <View style={styles.benefitsGrid}>
                {benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitCard}>
                    <CheckIcon size={16} color="#10B981" />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {activeTab === 'company' && (
          <View style={styles.section}>
            <View style={styles.companyInfoCard}>
              <View style={styles.companyInfoHeader}>
                <View style={styles.companyInfoLogo}>
                  <BuildingIcon size={32} color="#3B82F6" />
                </View>
                <View style={styles.companyInfoDetails}>
                  <Text style={styles.companyInfoName}>{job.department}</Text>
                  <Text style={styles.companyInfoType}>
                    {job.isGovernment ? 'Government Organization' : 'Private Company'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.companyInfoRow}>
                <GlobeIcon size={16} color="#6B7280" />
                <Text style={styles.companyInfoText}>www.{job.department.toLowerCase().replace(/\s/g, '')}.gm</Text>
              </View>
              <View style={styles.companyInfoRow}>
                <EmailIcon size={16} color="#6B7280" />
                <Text style={styles.companyInfoText}>careers@{job.department.toLowerCase().replace(/\s/g, '')}.gm</Text>
              </View>
              <View style={styles.companyInfoRow}>
                <PhoneIcon size={16} color="#6B7280" />
                <Text style={styles.companyInfoText}>+220 123 4567</Text>
              </View>
              <View style={styles.companyInfoRow}>
                <LocationIcon size={16} color="#6B7280" />
                <Text style={styles.companyInfoText}>{job.location}, The Gambia</Text>
              </View>
              
              <Text style={styles.companyDescription}>
                {job.department} is a leading organization in The Gambia, committed to providing excellent services and opportunities for growth. We value innovation, integrity, and teamwork.
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'reviews' && (
          <View style={styles.section}>
            <View style={styles.noReviews}>
              <UsersIcon size={48} color="#D1D5DB" />
              <Text style={styles.noReviewsTitle}>No Reviews Yet</Text>
              <Text style={styles.noReviewsText}>
                Be the first to share your experience working at {job.department}
              </Text>
            </View>
          </View>
        )}

        {/* Application Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <UsersIcon size={20} color="#3B82F6" />
            <Text style={styles.statValue}>{jobDetails.applicants}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <CalendarIcon size={20} color="#3B82F6" />
            <Text style={styles.statValue}>Posted {jobDetails.postedDate}</Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.applyContainer}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApply}
        >
          <LinearGradient
            colors={['#3B82F6', '#1D4ED8']}
            style={styles.applyButtonGradient}
          >
            <Text style={styles.applyButtonText}>Apply Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 8,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  companyLogo: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyLogoText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#3B82F6',
  },
  jobTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    color: '#DBEAFE',
    marginBottom: 12,
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#DBEAFE',
    fontSize: 14,
    marginLeft: 4,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DBEAFE',
    marginHorizontal: 12,
  },
  content: {
    flex: 1,
    marginTop: -16,
  },
  quickInfoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  quickInfoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickInfoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  quickInfoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 4,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletPoint: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bulletNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  benefitsGrid: {
    gap: 8,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  benefitText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 12,
  },
  companyInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  companyInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  companyInfoLogo: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  companyInfoDetails: {
    flex: 1,
  },
  companyInfoName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  companyInfoType: {
    fontSize: 14,
    color: '#6B7280',
  },
  companyInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyInfoText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 12,
  },
  companyDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  noReviews: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  noReviewsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  noReviewsText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 16,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statValue: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
  },
  bottomPadding: {
    height: 100,
  },
  applyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  applyButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default JobDetailsScreen;
