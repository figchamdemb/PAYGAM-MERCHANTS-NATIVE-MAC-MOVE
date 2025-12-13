/**
 * ✅ PATROL APP - OFFICER PROFILE SCREEN
 * Shows officer profile details and team members with online/offline status
 * Works for all departments with dynamic theming
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ==================== SVG ICONS ====================
const BackIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </Svg>
);

const UserIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </Svg>
);

const BadgeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4zm2 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
  </Svg>
);

const PhoneIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </Svg>
);

const EmailIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </Svg>
);

const LocationIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </Svg>
);

const TeamIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </Svg>
);

const RankIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </Svg>
);

// Department configurations
const departmentConfig: { [key: string]: any } = {
  police: {
    name: 'Police Patrol Unit',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1D4ED8'],
    officer: {
      name: 'Sergeant Johnson',
      badge: 'Badge #12345',
      rank: 'Patrol Sergeant',
      phone: '+220 777 1234',
      email: 'johnson@police.gov.gm',
      station: 'Central Police Station',
      shift: 'Day Shift (06:00 - 18:00)',
    },
    team: [
      { id: 1, name: 'Officer Williams', badge: '#12346', rank: 'Patrol Officer', status: 'online', avatar: 'W' },
      { id: 2, name: 'Officer Davis', badge: '#12347', rank: 'Patrol Officer', status: 'online', avatar: 'D' },
      { id: 3, name: 'Officer Brown', badge: '#12348', rank: 'Patrol Officer', status: 'offline', avatar: 'B' },
      { id: 4, name: 'Officer Miller', badge: '#12349', rank: 'Junior Officer', status: 'online', avatar: 'M' },
      { id: 5, name: 'Officer Garcia', badge: '#12350', rank: 'Junior Officer', status: 'offline', avatar: 'G' },
      { id: 6, name: 'Officer Martinez', badge: '#12351', rank: 'Patrol Officer', status: 'online', avatar: 'M' },
    ],
  },
  fire: {
    name: 'Fire Rescue Unit',
    color: '#EF4444',
    gradient: ['#EF4444', '#DC2626'],
    officer: {
      name: 'Captain Rodriguez',
      badge: 'Unit #FD-201',
      rank: 'Fire Captain',
      phone: '+220 777 2345',
      email: 'rodriguez@fire.gov.gm',
      station: 'Fire Station #1',
      shift: 'Day Shift (08:00 - 20:00)',
    },
    team: [
      { id: 1, name: 'Lt. Thompson', badge: '#FD-202', rank: 'Lieutenant', status: 'online', avatar: 'T' },
      { id: 2, name: 'FF. Anderson', badge: '#FD-203', rank: 'Firefighter', status: 'online', avatar: 'A' },
      { id: 3, name: 'FF. Jackson', badge: '#FD-204', rank: 'Firefighter', status: 'online', avatar: 'J' },
      { id: 4, name: 'FF. White', badge: '#FD-205', rank: 'Firefighter', status: 'offline', avatar: 'W' },
      { id: 5, name: 'FF. Harris', badge: '#FD-206', rank: 'Probationary', status: 'online', avatar: 'H' },
    ],
  },
  ambulance: {
    name: 'Emergency Medical Unit',
    color: '#10B981',
    gradient: ['#10B981', '#059669'],
    officer: {
      name: 'Paramedic Williams',
      badge: 'Unit #EMS-105',
      rank: 'Lead Paramedic',
      phone: '+220 777 3456',
      email: 'williams@ems.gov.gm',
      station: 'EMS Central Station',
      shift: 'Day Shift (07:00 - 19:00)',
    },
    team: [
      { id: 1, name: 'EMT. Johnson', badge: '#EMS-106', rank: 'EMT-Advanced', status: 'online', avatar: 'J' },
      { id: 2, name: 'EMT. Smith', badge: '#EMS-107', rank: 'EMT-Basic', status: 'online', avatar: 'S' },
      { id: 3, name: 'Para. Lee', badge: '#EMS-108', rank: 'Paramedic', status: 'offline', avatar: 'L' },
      { id: 4, name: 'EMT. Taylor', badge: '#EMS-109', rank: 'EMT-Basic', status: 'online', avatar: 'T' },
      { id: 5, name: 'EMT. Moore', badge: '#EMS-110', rank: 'EMT-Basic', status: 'online', avatar: 'M' },
    ],
  },
  immigration: {
    name: 'Immigration Response',
    color: '#3B82F6',
    gradient: ['#1E40AF', '#2563EB'],
    officer: {
      name: 'Officer Martinez',
      badge: 'ID #882-TC',
      rank: 'Senior Immigration Officer',
      phone: '+220 777 4567',
      email: 'martinez@immigration.gov.gm',
      station: 'Border Control HQ',
      shift: 'Day Shift (06:00 - 18:00)',
    },
    team: [
      { id: 1, name: 'Officer Chen', badge: '#883-TC', rank: 'Immigration Officer', status: 'online', avatar: 'C' },
      { id: 2, name: 'Officer Patel', badge: '#884-TC', rank: 'Immigration Officer', status: 'online', avatar: 'P' },
      { id: 3, name: 'Officer Nguyen', badge: '#885-TC', rank: 'Junior Officer', status: 'offline', avatar: 'N' },
      { id: 4, name: 'Officer Kim', badge: '#886-TC', rank: 'Immigration Officer', status: 'online', avatar: 'K' },
      { id: 5, name: 'Officer Ali', badge: '#887-TC', rank: 'Junior Officer', status: 'offline', avatar: 'A' },
    ],
  },
};

// Team Member Card Component
interface TeamMemberProps {
  name: string;
  badge: string;
  rank: string;
  status: 'online' | 'offline';
  avatar: string;
  color: string;
}

const TeamMemberCard: React.FC<TeamMemberProps> = ({ name, badge, rank, status, avatar, color }) => (
  <View style={styles.teamCard}>
    <View style={[styles.teamAvatar, { backgroundColor: status === 'online' ? color : '#475569' }]}>
      <Text style={styles.teamAvatarText}>{avatar}</Text>
    </View>
    <View style={styles.teamInfo}>
      <Text style={styles.teamName}>{name}</Text>
      <Text style={styles.teamBadge}>{badge} • {rank}</Text>
    </View>
    <View style={styles.teamStatus}>
      <View style={[styles.statusDot, { backgroundColor: status === 'online' ? '#10B981' : '#6B7280' }]} />
      <Text style={[styles.statusText, { color: status === 'online' ? '#10B981' : '#6B7280' }]}>
        {status === 'online' ? 'Online' : 'Offline'}
      </Text>
    </View>
  </View>
);

// Info Row Component
interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIcon}>{icon}</View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const OfficerProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  // Get department from route params, default to police
  const department = route.params?.department || 'police';
  const config = departmentConfig[department] || departmentConfig.police;
  
  const onlineCount = config.team.filter((m: any) => m.status === 'online').length;
  const totalCount = config.team.length;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient colors={['#0F172A', '#1E293B', '#0F172A']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackIcon size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient colors={config.gradient} style={styles.profileGradient}>
            <View style={styles.profileAvatar}>
              <UserIcon size={48} color="#FFFFFF" />
            </View>
            <Text style={styles.profileName}>{config.officer.name}</Text>
            <Text style={styles.profileBadge}>{config.officer.badge}</Text>
            <View style={styles.profileDepartment}>
              <Text style={styles.profileDepartmentText}>{config.name}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Officer Details */}
        <Text style={styles.sectionTitle}>Officer Details</Text>
        <View style={styles.detailsCard}>
          <InfoRow 
            icon={<RankIcon size={20} color={config.color} />}
            label="Rank"
            value={config.officer.rank}
          />
          <InfoRow 
            icon={<PhoneIcon size={20} color={config.color} />}
            label="Phone"
            value={config.officer.phone}
          />
          <InfoRow 
            icon={<EmailIcon size={20} color={config.color} />}
            label="Email"
            value={config.officer.email}
          />
          <InfoRow 
            icon={<LocationIcon size={20} color={config.color} />}
            label="Station"
            value={config.officer.station}
          />
          <InfoRow 
            icon={<BadgeIcon size={20} color={config.color} />}
            label="Current Shift"
            value={config.officer.shift}
          />
        </View>

        {/* Team Section */}
        <View style={styles.teamHeader}>
          <View style={styles.teamHeaderLeft}>
            <TeamIcon size={20} color={config.color} />
            <Text style={styles.sectionTitle}>My Team</Text>
          </View>
          <View style={styles.teamCount}>
            <Text style={styles.teamCountText}>{onlineCount}/{totalCount} Online</Text>
          </View>
        </View>

        <View style={styles.teamList}>
          {config.team.map((member: any) => (
            <TeamMemberCard
              key={member.id}
              name={member.name}
              badge={member.badge}
              rank={member.rank}
              status={member.status}
              avatar={member.avatar}
              color={config.color}
            />
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>Last updated: Just now</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 24) + 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(30,41,59,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(71,85,105,0.5)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 44,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  profileCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  profileGradient: {
    padding: 32,
    alignItems: 'center',
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileBadge: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  profileDepartment: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  profileDepartmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    marginLeft: 8,
  },
  detailsCard: {
    backgroundColor: 'rgba(30,41,59,0.6)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(71,85,105,0.5)',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(71,85,105,0.3)',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(148,163,184,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  teamHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamCount: {
    backgroundColor: 'rgba(16,185,129,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  teamCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  teamList: {
    gap: 12,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30,41,59,0.6)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(71,85,105,0.5)',
    marginBottom: 8,
  },
  teamAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  teamInfo: {
    flex: 1,
    marginLeft: 12,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  teamBadge: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  teamStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  footerInfo: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#64748B',
  },
});

export default OfficerProfileScreen;
