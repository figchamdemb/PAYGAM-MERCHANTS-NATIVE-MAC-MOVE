/**
 * ✅ E-GOV-GUARDS-PORTAL TAB NAVIGATOR
 *
 * STATIC tab navigation for patrol officers
 * Uses custom TouchableOpacity buttons (no library)
 *
 * Tabs:
 * 1. Map (Command Dashboard)
 * 2. Traffic (Traffic Operations)
 * 3. Reports (Incident Reporting)
 * 4. Team (Communications)
 * 5. Profile (Officer Profile)
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../config/colors';

// Patrol Screens
import MapScreen from '../features/patrol/screens/MapScreen';
import TrafficOpsScreen from '../features/patrol/screens/TrafficOpsScreen';
import ReportSuiteScreen from '../features/patrol/screens/ReportSuiteScreen';
import TeamCommsScreen from '../features/team/screens/TeamCommsScreen';
import ProfileScreen from '../screens/ProfileScreen';

type TabName = 'Map' | 'Traffic' | 'Reports' | 'Team' | 'Profile';

interface Tab {
  name: TabName;
  label: string;
  icon: string;
  component: React.FC;
}

const TABS: Tab[] = [
  {
    name: 'Map',
    label: 'Map',
    icon: 'map-marked-alt',
    component: MapScreen,
  },
  {
    name: 'Traffic',
    label: 'Traffic',
    icon: 'car',
    component: TrafficOpsScreen,
  },
  {
    name: 'Reports',
    label: 'Reports',
    icon: 'file-alt',
    component: ReportSuiteScreen,
  },
  {
    name: 'Team',
    label: 'Team',
    icon: 'users',
    component: TeamCommsScreen,
  },
  {
    name: 'Profile',
    label: 'Profile',
    icon: 'user-shield',
    component: ProfileScreen,
  },
];

export const TabNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>('Map');

  // Get the active screen component
  const ActiveScreen = TABS.find((tab) => tab.name === activeTab)?.component || MapScreen;

  return (
    <SafeAreaView style={styles.container}>
      {/* Screen Content */}
      <View style={styles.screenContainer}>
        <ActiveScreen />
      </View>

      {/* Static Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.name;

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabButton}
              onPress={() => setActiveTab(tab.name)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                <Icon
                  name={tab.icon}
                  size={20}
                  color={isActive ? '#FFFFFF' : colors.tab.inactive}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? colors.tab.active : colors.tab.inactive },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.tab.background,
    borderTopWidth: 1,
    borderTopColor: colors.tab.border,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: colors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    width: 40,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  iconContainerActive: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default TabNavigator;
