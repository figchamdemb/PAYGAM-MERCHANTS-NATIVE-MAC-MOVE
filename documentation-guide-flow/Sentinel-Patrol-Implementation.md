






# 📱 **ENTERPRISE REACT NATIVE CLI ARCHITECTURE GUIDE (FEATURE-BASED)**

### **Universal Multi-Service Patrol System: Police, Fire, Immigration, Ambulance**

---

# ⚠️ **CRITICAL: READ FIRST - THIS IS THE LOCKED STANDARD**

**🔒 THIS DOCUMENT IS READ-ONLY - DO NOT MODIFY**

This document establishes the **mandatory architectural standard** for all React Native CLI patrol applications. Any AI assistant, developer, or team member working on this project **MUST follow these rules exactly**.

**✅ CONFIRMATION REQUIRED**: If you are reading this, confirm you understand:
- This is a **React Native CLI** project (NOT Next.js, NOT Expo managed)
- This uses **feature-based architecture** (as explained in the video transcript)
- Each service (Police, Fire, Immigration, Ambulance) is **ONE mobile app**
- Different dashboards appear based on **user role and organization** within the single app
- The folder structure follows **strict one-way data flow** principles

---

# 🎯 **PROJECT OVERVIEW**

## What We're Building

A **single React Native mobile application** that serves multiple patrol services:
- **Police Patrol Teams** (Officers, Admins, Desk Personnel)
- **Fire Service Teams** (Firefighters, Station Commanders, Equipment Managers)
- **Immigration Officers** (Border Control, Permit Processing, Registry)
- **Ambulance/EMS Teams** (Paramedics, Dispatchers, Medical Officers)

## Key Architectural Principle

**Role-Based Dynamic Dashboards within ONE App**

When a user logs in:
```typescript
// Login determines which dashboard/features they see
if (user.organization === 'POLICE' && user.role === 'PATROL_OFFICER') {
  → Show Police Patrol Dashboard (Screens 2-12)
}
if (user.organization === 'POLICE' && user.role === 'ADMIN') {
  → Show Police Admin Dashboard (Screen 8 + admin features)
}
if (user.organization === 'FIRE' && user.role === 'FIREFIGHTER') {
  → Show Fire Response Dashboard
}
```

This is **NOT** 4 separate apps. This is **ONE app with feature-based organization**.

---

# 🧨 **PROBLEM: Why Traditional React Native Structure Fails**

## The Video's Warning Applied to Mobile

The video transcript explains why mixing all features together causes disasters. In React Native, this manifests as:

### ❌ **Traditional Flat Structure Problems:**

```
src/
├── screens/          ← 50+ screens all mixed together
│   ├── PoliceMapScreen.tsx
│   ├── FireAlertScreen.tsx
│   ├── ImmigrationScannerScreen.tsx
│   ├── AmbulanceDispatchScreen.tsx
│   ├── TrafficTicketScreen.tsx
│   ├── IncidentReportScreen.tsx
│   └── ... (40+ more files)
│
├── components/       ← 200+ components from all services
│   ├── PoliceStatusBadge.tsx
│   ├── FireEquipmentCard.tsx
│   ├── ImmigrationPassportScanner.tsx
│   ├── CustomButton.tsx (which service uses this?)
│   └── ... (impossible to maintain)
│
├── api/             ← Every API call from every service
│   ├── policeApi.ts
│   ├── fireApi.ts
│   ├── immigrationApi.ts
│   └── ambulanceApi.ts
│
└── navigation/      ← One massive navigation file
    └── index.tsx    ← 500+ lines, all services mixed
```

### 🔥 **Why This Destroys React Native Projects:**

1. **Build Times**: Metro bundler becomes slower with 200+ component imports
2. **Import Hell**: `import PoliceStatusBadge from '../../../components/police/PoliceStatusBadge'`
3. **Circular Dependencies**: Police imports Fire, Fire imports Immigration, Immigration imports Police
4. **Breaking Changes**: Updating a Fire component accidentally breaks Police screens
5. **Team Conflicts**: 10 developers editing the same `/screens` folder → constant merge conflicts
6. **Cannot Delete**: Afraid to remove old code because you don't know what still uses it
7. **Onboarding Nightmare**: New developers take 2 weeks to understand where anything lives
8. **Testing Impossible**: Unit tests require mocking 50 unrelated dependencies

**This is EXACTLY what the video warns about.**

---

# ✅ **SOLUTION: Feature-Based React Native Architecture**

## Core Principle from Video

> **"Each feature should be entirely self-contained and independent.
> Features should NEVER import from other features.
> Shared code flows one-way: Shared → Features → App"**

---

# 📁 **THE MANDATORY FOLDER STRUCTURE**

## Root Structure

```
SentinelPatrol/                    # Single React Native CLI app
├── android/                        # Native Android code
├── ios/                           # Native iOS code
├── src/
│   ├── app/                       # ⚠️ ROUTING ONLY - NO BUSINESS LOGIC
│   │   ├── navigation/
│   │   │   ├── RootNavigator.tsx           # Main app navigator
│   │   │   ├── PoliceNavigator.tsx         # Police-specific nav
│   │   │   ├── FireNavigator.tsx           # Fire-specific nav
│   │   │   ├── ImmigrationNavigator.tsx    # Immigration nav
│   │   │   └── AmbulanceNavigator.tsx      # Ambulance nav
│   │   └── App.tsx                         # Root component
│   │
│   ├── features/                  # 🟢 FEATURE-BASED ORGANIZATION
│   │   ├── auth/                           # Shared authentication
│   │   │   ├── screens/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api/
│   │   │   └── index.ts
│   │   │
│   │   ├── police/                         # Police service features
│   │   │   ├── map/                        # Screen 2: Command Map
│   │   │   ├── response/                   # Screen 3: Emergency Response
│   │   │   ├── traffic-ops/                # Screen 4: Traffic Ops & ANPR
│   │   │   ├── ticket/                     # Screen 5: E-Ticket Issuance
│   │   │   ├── incident-report/            # Screen 6: Incident Reporting
│   │   │   ├── team-comms/                 # Screen 7: Team Grid & Radio
│   │   │   ├── admin/                      # Screen 8: Station Admin
│   │   │   ├── immigration-scanner/        # Screen 9: Immigration Scanner
│   │   │   ├── profile/                    # Screen 10: Officer Profile
│   │   │   ├── database-search/            # Screen 11: Database Search
│   │   │   └── success/                    # Screen 12: Transaction Success
│   │   │
│   │   ├── fire/                           # Fire service features
│   │   │   ├── alert-response/
│   │   │   ├── equipment-management/
│   │   │   ├── station-dashboard/
│   │   │   └── incident-report/
│   │   │
│   │   ├── immigration/                    # Immigration features
│   │   │   ├── registration/
│   │   │   ├── permit-processing/
│   │   │   ├── scanner/
│   │   │   └── database/
│   │   │
│   │   └── ambulance/                      # Ambulance/EMS features
│   │       ├── dispatch/
│   │       ├── patient-records/
│   │       └── emergency-response/
│   │
│   ├── shared/                    # 🔵 SHARED ACROSS ALL SERVICES
│   │   ├── components/                     # UI components used everywhere
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── MapComponent.tsx            # Reusable map
│   │   │   ├── CameraComponent.tsx         # Reusable camera
│   │   │   └── StatusToggle.tsx
│   │   ├── hooks/                          # Shared hooks
│   │   │   ├── useGeolocation.ts
│   │   │   ├── useCamera.ts
│   │   │   ├── useAudioRecorder.ts
│   │   │   └── useAuth.ts
│   │   ├── utils/                          # Utilities
│   │   │   ├── dateHelpers.ts
│   │   │   ├── validators.ts
│   │   │   └── formatters.ts
│   │   ├── types/                          # TypeScript types
│   │   │   ├── user.types.ts
│   │   │   ├── incident.types.ts
│   │   │   └── common.types.ts
│   │   ├── api/                            # Base API configuration
│   │   │   ├── baseApi.ts
│   │   │   └── apiConfig.ts
│   │   └── constants/                      # App-wide constants
│   │       ├── colors.ts
│   │       └── config.ts
│   │
│   └── lib/                       # 🔧 INFRASTRUCTURE ONLY
│       ├── storage/                        # AsyncStorage wrappers
│       ├── notifications/                   # Push notification setup
│       └── permissions/                     # Native permissions
│
├── .eslintrc.js                   # ⚠️ CONTAINS BOUNDARY RULES
├── tsconfig.json
└── package.json
```

---

# 🏗️ **FEATURE STRUCTURE TEMPLATE**

## Every Feature Follows This Exact Pattern

```
features/<service>/<feature-name>/
├── screens/                       # React Native screens
│   ├── <Feature>Screen.tsx
│   └── index.ts
├── components/                    # Feature-specific components
│   ├── <Feature>Card.tsx
│   ├── <Feature>List.tsx
│   └── index.ts
├── hooks/                         # Feature-specific hooks
│   ├── use<Feature>.ts
│   └── index.ts
├── api/                          # Feature-specific API calls
│   ├── <feature>Api.ts
│   └── index.ts
├── types/                        # Feature-specific TypeScript types
│   ├── <feature>.types.ts
│   └── index.ts
├── utils/                        # Feature-specific utilities
│   ├── <feature>Helpers.ts
│   └── index.ts
└── index.ts                      # Public API of the feature
```

---

# 📋 **COMPLETE EXAMPLE: POLICE MAP FEATURE (SCREEN 2)**

## File Structure

```
features/police/map/
├── screens/
│   ├── MapScreen.tsx
│   └── index.ts
├── components/
│   ├── TaskList.tsx
│   ├── IncidentMarker.tsx
│   ├── BottomSheet.tsx
│   └── index.ts
├── hooks/
│   ├── useIncidents.ts
│   ├── useOfficerStatus.ts
│   └── index.ts
├── api/
│   ├── incidentApi.ts
│   └── index.ts
├── types/
│   ├── incident.types.ts
│   └── index.ts
└── index.ts
```

## Implementation Files

### `features/police/map/screens/MapScreen.tsx`

```typescript
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MapComponent } from '@/shared/components/MapComponent';
import { StatusToggle } from '@/shared/components/StatusToggle';
import { useGeolocation } from '@/shared/hooks/useGeolocation';
import { TaskList, BottomSheet } from '../components';
import { useIncidents, useOfficerStatus } from '../hooks';

// ✅ CORRECT: Imports only from:
// 1. React Native core
// 2. Shared components/hooks
// 3. Same feature (../components, ../hooks)
//
// ❌ NEVER imports from:
// - features/fire/...
// - features/immigration/...
// - features/ambulance/...

export const MapScreen = ({ navigation }) => {
  const { location } = useGeolocation();
  const { incidents, acceptIncident } = useIncidents();
  const { status, updateStatus } = useOfficerStatus();

  const handleAcceptTask = (taskId: string) => {
    acceptIncident(taskId);
    navigation.navigate('ResponseScreen', { taskId });
  };

  return (
    <View style={styles.container}>
      <MapComponent
        region={{
          latitude: location?.latitude || 13.4549,
          longitude: location?.longitude || -16.5790,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        markers={incidents.map(inc => ({
          id: inc.id,
          coordinate: inc.location,
          title: inc.title,
          pinColor: inc.priority === 'HIGH' ? 'red' : 'orange',
        }))}
      />

      <StatusToggle 
        status={status} 
        onStatusChange={updateStatus}
      />

      <BottomSheet>
        <TaskList 
          tasks={incidents}
          onAcceptTask={handleAcceptTask}
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
```

### `features/police/map/hooks/useIncidents.ts`

```typescript
import { useState, useEffect } from 'react';
import { incidentApi } from '../api/incidentApi';
import type { PoliceIncident } from '../types/incident.types';

// ✅ CORRECT: Self-contained hook
// - Uses own API
// - Uses own types
// - No external feature dependencies

export const useIncidents = () => {
  const [incidents, setIncidents] = useState<PoliceIncident[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const data = await incidentApi.getIncoming();
      setIncidents(data.alerts);
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptIncident = async (taskId: string) => {
    try {
      await incidentApi.accept(taskId);
      await fetchIncidents(); // Refresh list
    } catch (error) {
      console.error('Failed to accept incident:', error);
    }
  };

  return { incidents, loading, acceptIncident };
};
```

### `features/police/map/api/incidentApi.ts`

```typescript
import { apiClient } from '@/shared/api/baseApi';
import type { PoliceIncident } from '../types/incident.types';

// ✅ CORRECT: Feature-specific API calls
// - Uses shared apiClient
// - Returns feature-specific types
// - No dependencies on other features

export const incidentApi = {
  async getIncoming(): Promise<{ alerts: PoliceIncident[] }> {
    return apiClient.get('/api/alerts/incoming');
  },

  async accept(alertId: string) {
    return apiClient.post(`/api/alerts/${alertId}/accept`, {
      acceptedAt: new Date().toISOString(),
    });
  },
};
```

### `features/police/map/index.ts`

```typescript
// Public API of the map feature
export { MapScreen } from './screens/MapScreen';
export * from './types/incident.types';
export { useIncidents, useOfficerStatus } from './hooks';
```

---

# 🔄 **NAVIGATION ARCHITECTURE**

## Role-Based Dynamic Routing

```typescript
// src/app/navigation/RootNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { PoliceNavigator } from './PoliceNavigator';
import { FireNavigator } from './FireNavigator';
import { ImmigrationNavigator } from './ImmigrationNavigator';
import { AmbulanceNavigator } from './AmbulanceNavigator';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const { user, isAuthenticated } = useAuth();

  // ✅ CORRECT: Route based on organization + role
  const getServiceNavigator = () => {
    if (!isAuthenticated || !user) return null;

    switch (user.organization) {
      case 'POLICE':
        return <Stack.Screen name="Police" component={PoliceNavigator} />;
      case 'FIRE':
        return <Stack.Screen name="Fire" component={FireNavigator} />;
      case 'IMMIGRATION':
        return <Stack.Screen name="Immigration" component={ImmigrationNavigator} />;
      case 'AMBULANCE':
        return <Stack.Screen name="Ambulance" component={AmbulanceNavigator} />;
      default:
        return null;
    }
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        getServiceNavigator()
      )}
    </Stack.Navigator>
  );
};
```

## Police-Specific Navigator

```typescript
// src/app/navigation/PoliceNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';

// ✅ CORRECT: Import screens from feature public API
import { MapScreen } from '@/features/police/map';
import { TrafficOpsScreen } from '@/features/police/traffic-ops';
import { AdminMenuScreen } from '@/features/police/admin';
import { ProfileScreen } from '@/features/police/profile';
import { ResponseScreen } from '@/features/police/response';
import { IssueTicketScreen } from '@/features/police/ticket';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main tabs for patrol officers
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#1E40AF',
    }}
  >
    <Tab.Screen 
      name="Map" 
      component={MapScreen}
      options={{
        tabBarIcon: ({ color }) => <Icon name="map-marked-alt" size={20} color={color} />
      }}
    />
    <Tab.Screen 
      name="Traffic" 
      component={TrafficOpsScreen}
      options={{
        tabBarIcon: ({ color }) => <Icon name="car" size={20} color={color} />
      }}
    />
    <Tab.Screen 
      name="Admin" 
      component={AdminMenuScreen}
      options={{
        tabBarIcon: ({ color }) => <Icon name="cog" size={20} color={color} />
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color }) => <Icon name="user" size={20} color={color} />
      }}
    />
  </Tab.Navigator>
);

// Stack navigator for flow screens
export const PoliceNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen name="ResponseScreen" component={ResponseScreen} />
    <Stack.Screen name="IssueTicket" component={IssueTicketScreen} />
  </Stack.Navigator>
);
```

---

# ⚠️ **ESLINT BOUNDARIES CONFIGURATION**

## React Native-Specific ESLint Rules

Create `.eslintrc.js`:

```javascript
module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['boundaries'],
  
  settings: {
    'boundaries/elements': [
      { type: 'shared', pattern: 'src/shared/*' },
      { type: 'feature', pattern: 'src/features/*/*', capture: ['service', 'feature'] },
      { type: 'app', pattern: 'src/app/*' },
      { type: 'lib', pattern: 'src/lib/*' },
    ],
  },

  rules: {
    // Prevent unknown file types
    'boundaries/element-types': [2, {
      default: 'disallow',
      message: '${file.type} is not allowed to be imported',
    }],

    // Enforce one-way data flow
    'boundaries/entry-point': [2, {
      default: 'disallow',
      message: 'Importing from ${dependency.type} is not allowed',
      rules: [
        // Shared can only import shared
        {
          target: 'shared',
          allow: ['shared'],
        },
        // Features can import shared and same service
        {
          target: ['feature'],
          allow: [
            'shared',
            ['feature', { service: '${service}' }], // Same service only
          ],
        },
        // App can import everything
        {
          target: 'app',
          allow: '*',
        },
        // Lib can only import lib
        {
          target: 'lib',
          allow: ['lib'],
        },
      ],
    }],
  },
};
```

### What This Enforces:

✅ **Police features CANNOT import Fire features**
✅ **Fire features CANNOT import Immigration features**
✅ **Shared CANNOT import features**
✅ **Features CAN import shared**
✅ **App CAN import everything (for routing)**

---

# 🚀 **MIGRATION PLAN**

## Safe, Incremental Migration Strategy

### Phase 1: Setup New Structure (Day 1)

```bash
# Create new folder structure
mkdir -p src/features/{auth,police,fire,immigration,ambulance}
mkdir -p src/shared/{components,hooks,utils,types,api}
mkdir -p src/app/navigation
mkdir -p src/lib/{storage,notifications,permissions}

# Install ESLint boundaries
npm install --save-dev eslint-plugin-boundaries

# Copy ESLint config
# (use config from previous section)
```

### Phase 2: Move Shared Components (Day 2-3)

```bash
# Identify truly shared components
# Example: Button, Input, Card, MapComponent

# Move to shared
mv src/components/Button.tsx src/shared/components/Button.tsx
mv src/components/Input.tsx src/shared/components/Input.tsx

# Update imports across project
# Use global find-replace in VS Code
```

### Phase 3: Move One Feature (Day 4-7)

**Start with Police Map (Screen 2)** as proof of concept:

1. Create feature structure:
```bash
mkdir -p src/features/police/map/{screens,components,hooks,api,types}
```

2. Move screen:
```bash
mv src/screens/MapScreen.tsx src/features/police/map/screens/MapScreen.tsx
```

3. Extract components from screen into `features/police/map/components/`

4. Create API layer in `features/police/map/api/`

5. Create hooks in `features/police/map/hooks/`

6. Test feature in isolation

7. Update navigator imports

### Phase 4: Repeat for All Police Features (Week 2-3)

Continue with:
- Response (Screen 3)
- Traffic Ops (Screen 4)
- Ticket (Screen 5)
- Incident Report (Screen 6)
- Team Comms (Screen 7)
- Admin (Screen 8)
- Immigration Scanner (Screen 9)
- Profile (Screen 10)
- Database Search (Screen 11)
- Success (Screen 12)

### Phase 5: Fire/Immigration/Ambulance (Week 4-6)

Apply same pattern to other services.

### Phase 6: Remove Old Folders (Week 7)

```bash
# Once fully migrated
rm -rf src/screens
rm -rf src/components  # Keep only shared
rm -rf src/api        # Keep only shared/api
```

---

# 📝 **ASSISTANT RULES FILE**

## Create `ARCHITECTURE-RULES.md`

```markdown
# React Native CLI Enterprise Architecture Rules

## 1. Project Structure

This is a SINGLE React Native CLI app serving multiple patrol services.
Users see different dashboards based on organization and role.

## 2. Feature-Based Organization

All features MUST be organized as:
```
features/<service>/<feature>/
  ├── screens/
  ├── components/
  ├── hooks/
  ├── api/
  ├── types/
  └── index.ts
```

## 3. Import Rules (STRICTLY ENFORCED)

### ✅ ALLOWED:
- Shared → Shared
- Feature → Shared
- Feature → Same Service's Other Features
- App → Everything

### ❌ FORBIDDEN:
- Feature → Different Service's Features
- Shared → Features
- Lib → Features

## 4. Screen Organization

### App Folder (src/app/):
- ONLY navigation and routing
- NO business logic
- NO components (except layout wrappers)
- NO API calls

### Features Folder (src/features/):
- ALL business logic
- ALL feature-specific components
- ALL API calls
- ALL state management

### Shared Folder (src/shared/):
- ONLY reusable UI components
- ONLY common hooks
- ONLY utilities used by 2+ services
- NO service-specific logic

## 5. Navigation Rules

- Each service has its own Navigator
- RootNavigator switches based on user.organization
- Use Stack + Tab navigators per service
- Keep navigator files in src/app/navigation/

## 6. Naming Conventions

- Screens: `<Feature>Screen.tsx`
- Components: `<Feature><Purpose>.tsx`
- Hooks: `use<Feature>.ts`
- API: `<feature>Api.ts`
- Types: `<feature>.types.ts`

## 7. Dependencies

ALL existing React Native libraries stay:
- react-native-maps (for maps)
- react-native-camera (for camera)
- react-native-geolocation-service (for GPS)
- react-native-vector-icons (for icons)
- @react-navigation/* (for navigation)
- @react-native-async-storage (for storage)

DO NOT add new libraries without approval.

## 8. Testing

Each feature must be testable in isolation.
Write tests in:
```
features/<service>/<feature>/__tests__/
```

## 9. TypeScript

ALWAYS use TypeScript.
NEVER use `any` type.
Define types in feature's types/ folder.

## 10. Performance

- Use React.memo for heavy components
- Use useCallback for functions passed as props
- Use useMemo for expensive calculations
- Keep re-renders minimal

## 11. When Adding New Feature

1. Create folder: `features/<service>/<feature-name>/`
2. Copy template structure
3. Implement in isolation
4. Export via index.ts
5. Add to navigator
6. Write tests
7. Document in feature's README.md

## 12. When in Doubt

Ask: "Does this belong to ONE specific service/feature?"
- YES → Put in features/<service>/<feature>/
- NO → Put in shared/

## 13. Code Review Checklist

Before committing, verify:
- [ ] No cross-service imports
- [ ] ESLint boundaries pass
- [ ] TypeScript compiles
- [ ] Feature has index.ts export
- [ ] No business logic in app/
- [ ] Shared components are truly shared
```

---

# 🎯 **FINAL SUMMARY**

## What You Now Have

1. ✅ **Clear folder structure** following video principles
2. ✅ **Feature isolation** preventing spaghetti code
3. ✅ **One-way data flow** enforced by ESLint
4. ✅ **Role-based routing** for dynamic dashboards
5. ✅ **Migration plan** that's safe and incremental
6. ✅ **Assistant rules** so AI always follows your architecture
7. ✅ **Complete examples** you can copy and adapt

## Key Differences from Next.js Version

| Aspect | Next.js (Web) | React Native CLI (Mobile) |
|--------|---------------|---------------------------|
| Project Type | Multiple standalone apps | One app, role-based routing |
| Routing | File-based (app folder) | Navigator-based |
| Deployment | Separate per service | Single APK/IPA |
| State Management | Server/client separation | Client-only |
| Components | HTML-based | React Native primitives |
| Styling | CSS/Tailwind | StyleSheet API |
| Navigation | Next router | React Navigation |

## What Stays the Same

- ✅ Feature-based organization principle
- ✅ One-way data flow rule
- ✅ Shared vs. feature separation
- ✅ No cross-feature imports
- ✅ ESLint boundaries enforcement

---

# 📚 **NEXT STEPS**

1. **Copy folder structure** into your project
2. **Install ESLint boundaries**: `npm install --save-dev eslint-plugin-boundaries`
3. **Copy `.eslintrc.js`** configuration
4. **Create `ARCHITECTURE-RULES.md`** for your team
5. **Start migration** with Police Map feature
6. **Validate** with ESLint before committing
7. **Train team** on new architecture

---

**🔒 END OF LOCKED DOCUMENT - FOLLOW EXACTLY AS SPECIFIED**













# 📋 Complete Step-by-Step Conversion Guide: Gambia Citizen App → Sentinel Patrol Multi-Service App

## Executive Summary

This guide transforms the existing Gambia Citizen App into a **multi-service patrol application** supporting Police, Fire, Ambulance, and Immigration teams. The conversion maintains all existing dependencies, libraries, and infrastructure while restructuring the codebase into a feature-based architecture for enterprise-level scalability.

---

## Table of Contents

1. [Prerequisites & Setup](#1-prerequisites--setup)
2. [Project Structure Transformation](#2-project-structure-transformation)
3. [Screen-by-Screen Conversion Mapping](#3-screen-by-screen-conversion-mapping)
4. [Feature-Based Architecture Implementation](#4-feature-based-architecture-implementation)
5. [Shared Components & Services](#5-shared-components--services)
6. [Service-Specific Customization](#6-service-specific-customization)
7. [Navigation & Routing](#7-navigation--routing)
8. [Testing & Validation](#8-testing--validation)
9. [Deployment Checklist](#9-deployment-checklist)

---

## 1. Prerequisites & Setup

### Step 1.1: Create Project Backup
```bash
# Create a new folder for the patrol app
mkdir SentinelPatrol
cd SentinelPatrol

# Copy the entire Gambia Citizen App
cp -r /path/to/gambia-citizen-app/* .

# Create a git branch for safety
git checkout -b feature/patrol-conversion
git add .
git commit -m "Initial backup before patrol conversion"
```

### Step 1.2: Verify Existing Dependencies
**DO NOT CHANGE THESE** - All libraries remain the same:

```json
// package.json - Verify these are present
{
  "dependencies": {
    "@react-navigation/native": "^6.x.x",
    "@react-navigation/stack": "^6.x.x",
    "@react-native-async-storage/async-storage": "^1.x.x",
    "react-native-maps": "^1.x.x",
    "react-native-vector-icons": "^10.x.x",
    "react-native-geolocation-service": "^5.x.x",
    "react-native-camera": "^4.x.x",
    "react-native-image-picker": "^5.x.x",
    "react-native-audio-toolkit": "^2.x.x",
    // All existing libraries stay
  }
}
```

### Step 1.3: Create New Directory Structure
```bash
# Create the new feature-based structure
mkdir -p src/features/{auth,police,fire,ambulance,immigration,shared}
mkdir -p src/features/shared/{components,hooks,utils,types,api}
```

---

## 2. Project Structure Transformation

### Current Structure (Citizen App)
```
src/
├── screens/          # All screens in one folder
├── components/       # All components mixed together
├── navigation/       # Simple navigation
└── api/             # Basic API calls
```

### Target Structure (Patrol App)
```
src/
├── features/
│   ├── auth/                          # Authentication (shared by all)
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx        # Screen 1
│   │   │   └── BiometricSetup.tsx
│   │   ├── components/
│   │   │   ├── MfaModal.tsx
│   │   │   └── BadgeInput.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── api/
│   │       └── authApi.ts
│   │
│   ├── police/                        # Police-specific features
│   │   ├── screens/
│   │   │   ├── MapScreen.tsx          # Screen 2
│   │   │   ├── ResponseScreen.tsx     # Screen 3
│   │   │   ├── TrafficOpsScreen.tsx   # Screen 4
│   │   │   ├── IssueTicketScreen.tsx  # Screen 5
│   │   │   ├── ReportSuiteScreen.tsx  # Screen 6
│   │   │   ├── TeamCommsScreen.tsx    # Screen 7
│   │   │   ├── AdminMenuScreen.tsx    # Screen 8
│   │   │   ├── ImmigrationScannerScreen.tsx # Screen 9
│   │   │   ├── ProfileScreen.tsx      # Screen 10
│   │   │   ├── DatabaseSearchScreen.tsx # Screen 11
│   │   │   └── SuccessScreen.tsx      # Screen 12
│   │   ├── components/
│   │   │   ├── IncidentCard.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── TaskList.tsx
│   │   ├── hooks/
│   │   │   ├── useIncidents.ts
│   │   │   └── useTrafficOps.ts
│   │   └── api/
│   │       ├── incidentApi.ts
│   │       └── trafficApi.ts
│   │
│   ├── fire/                          # Fire service features
│   │   ├── screens/
│   │   │   ├── FireMapScreen.tsx      # Similar to Screen 2
│   │   │   ├── FireResponseScreen.tsx # Similar to Screen 3
│   │   │   └── FireReportScreen.tsx   # Similar to Screen 6
│   │   └── ... (similar structure)
│   │
│   ├── ambulance/                     # Ambulance features
│   │   ├── screens/
│   │   │   ├── AmbulanceMapScreen.tsx
│   │   │   └── PatientRecordScreen.tsx
│   │   └── ... (similar structure)
│   │
│   ├── immigration/                   # Immigration features
│   │   ├── screens/
│   │   │   ├── ImmigrationDashboard.tsx
│   │   │   └── PermitProcessing.tsx
│   │   └── ... (similar structure)
│   │
│   └── shared/                        # Shared across all services
│       ├── components/
│       │   ├── CustomButton.tsx
│       │   ├── ThemedInput.tsx
│       │   ├── MapComponent.tsx       # Reusable map
│       │   ├── CameraComponent.tsx    # Reusable camera
│       │   └── StatusToggle.tsx
│       ├── hooks/
│       │   ├── useGeolocation.ts
│       │   ├── useCamera.ts
│       │   └── useAudioRecorder.ts
│       ├── types/
│       │   ├── incident.types.ts
│       │   ├── user.types.ts
│       │   └── common.types.ts
│       ├── api/
│       │   ├── baseApi.ts
│       │   └── apiConfig.ts
│       └── utils/
│           ├── dateHelpers.ts
│           └── validators.ts
│
├── navigation/
│   ├── RootNavigator.tsx              # Main router
│   ├── PoliceNavigator.tsx            # Police-specific routes
│   ├── FireNavigator.tsx              # Fire-specific routes
│   ├── AmbulanceNavigator.tsx         # Ambulance routes
│   └── ImmigrationNavigator.tsx       # Immigration routes
│
└── App.tsx                            # Root component
```

---

## 3. Screen-by-Screen Conversion Mapping

### Conversion Matrix

| Citizen App Screen | Patrol Screen Name | Screen # | Service Applicability | New File Path |
|-------------------|-------------------|----------|----------------------|---------------|
| CitizenLogin.tsx | LoginScreen.tsx | Screen 1 | ALL (Police, Fire, Ambulance, Immigration) | `features/auth/screens/LoginScreen.tsx` |
| CitizenDashboard.tsx | MapScreen.tsx | Screen 2 | Police, Fire, Ambulance | `features/police/screens/MapScreen.tsx` |
| ReportIncident.tsx | ResponseScreen.tsx | Screen 3 | Police, Fire, Ambulance | `features/police/screens/ResponseScreen.tsx` |
| VehicleCheck.tsx | TrafficOpsScreen.tsx | Screen 4 | Police only | `features/police/screens/TrafficOpsScreen.tsx` |
| ComplaintForm.tsx | IssueTicketScreen.tsx | Screen 5 | Police only | `features/police/screens/IssueTicketScreen.tsx` |
| SubmitReport.tsx | ReportSuiteScreen.tsx | Screen 6 | ALL services | `features/police/screens/ReportSuiteScreen.tsx` |
| ContactOfficer.tsx | TeamCommsScreen.tsx | Screen 7 | ALL services | `features/police/screens/TeamCommsScreen.tsx` |
| Services.tsx | AdminMenuScreen.tsx | Screen 8 | ALL services | `features/police/screens/AdminMenuScreen.tsx` |
| DocumentScanner.tsx | ImmigrationScannerScreen.tsx | Screen 9 | Immigration only | `features/immigration/screens/ImmigrationScannerScreen.tsx` |
| Profile.tsx | ProfileScreen.tsx | Screen 10 | ALL services | `features/police/screens/ProfileScreen.tsx` |
| SearchRecords.tsx | DatabaseSearchScreen.tsx | Screen 11 | Police, Immigration | `features/police/screens/DatabaseSearchScreen.tsx` |
| SuccessPage.tsx | SuccessScreen.tsx | Screen 12 | ALL services | `features/shared/screens/SuccessScreen.tsx` |

---

## 4. Feature-Based Architecture Implementation

### Step 4.1: Create Auth Feature (Shared by All Services)

```bash
# Move login screen
mv src/screens/CitizenLogin.tsx src/features/auth/screens/LoginScreen.tsx
```

**Update LoginScreen.tsx:**
```typescript
// src/features/auth/screens/LoginScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth'; // Feature-local hook
import MfaModal from '../components/MfaModal'; // Feature-local component

// CHANGE: Update interface for patrol services
interface LoginFormData {
  badgeNumber: string; // CHANGED FROM: citizenId
  password: string;
  role: 'police' | 'fire' | 'ambulance' | 'immigration'; // NEW FIELD
}

const LoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    badgeNumber: '', // CHANGED FROM: citizenId
    password: '',
    role: 'police' // NEW DEFAULT
  });
  const [mfaVisible, setMfaVisible] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    // KEEP: Existing validation logic
    // CHANGE: API endpoint
    await login(formData.badgeNumber, formData.password, formData.role);
  };

  return (
    // KEEP: Existing UI structure
    // CHANGE: Labels and placeholders
    <View style={styles.container}>
      <Text style={styles.title}>Sentinel Patrol</Text>
      
      {/* NEW: Role selector */}
      <View style={styles.roleSelector}>
        {['police', 'fire', 'ambulance', 'immigration'].map(role => (
          <TouchableOpacity
            key={role}
            style={[styles.roleButton, formData.role === role && styles.roleButtonActive]}
            onPress={() => setFormData({...formData, role})}
          >
            <Text>{role.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CHANGED: Label from "Citizen ID" to "Badge Number" */}
      <TextInput
        style={styles.input}
        placeholder="Badge Number" // CHANGED FROM: "Citizen ID"
        value={formData.badgeNumber} // CHANGED FROM: citizenId
        onChangeText={(text) => setFormData({...formData, badgeNumber: text})}
      />

      {/* KEEP: Rest of the form remains the same */}
    </View>
  );
};

// KEEP: All existing styles
const styles = StyleSheet.create({
  // ... existing styles
});

export default LoginScreen;
```

### Step 4.2: Create Police Feature

**Move and rename screens:**
```bash
# Screen 2: Map Screen
mv src/screens/CitizenDashboard.tsx src/features/police/screens/MapScreen.tsx

# Screen 3: Emergency Response
mv src/screens/ReportIncident.tsx src/features/police/screens/ResponseScreen.tsx

# Screen 4: Traffic Operations
mv src/screens/VehicleCheck.tsx src/features/police/screens/TrafficOpsScreen.tsx

# Screen 5: Issue Ticket
mv src/screens/ComplaintForm.tsx src/features/police/screens/IssueTicketScreen.tsx

# Screen 6: Incident Reporting
mv src/screens/SubmitReport.tsx src/features/police/screens/ReportSuiteScreen.tsx

# Screen 7: Team Communications
mv src/screens/ContactOfficer.tsx src/features/police/screens/TeamCommsScreen.tsx

# Screen 8: Admin Menu
mv src/screens/Services.tsx src/features/police/screens/AdminMenuScreen.tsx

# Screen 10: Profile
mv src/screens/Profile.tsx src/features/police/screens/ProfileScreen.tsx

# Screen 11: Database Search
mv src/screens/SearchRecords.tsx src/features/police/screens/DatabaseSearchScreen.tsx
```

**Update MapScreen.tsx (Screen 2):**
```typescript
// src/features/police/screens/MapScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useGeolocation } from '../../shared/hooks/useGeolocation'; // Shared hook
import TaskList from '../components/TaskList'; // Feature-local component
import StatusToggle from '../../shared/components/StatusToggle'; // Shared component

// CHANGE: Interface for police incidents
interface PoliceIncident {
  id: string;
  title: string; // CHANGED FROM: description
  type: 'ROBBERY' | 'ASSAULT' | 'DOMESTIC' | 'TRAFFIC'; // NEW FIELD
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  priority: 'HIGH' | 'MEDIUM' | 'LOW'; // NEW FIELD
  reportedAt: string;
}

const MapScreen = ({ navigation }) => {
  const [incidents, setIncidents] = useState<PoliceIncident[]>([]);
  const [officerStatus, setOfficerStatus] = useState<'online' | 'offline' | 'busy'>('online'); // NEW STATE
  const { location } = useGeolocation(); // KEEP: Using existing geolocation

  useEffect(() => {
    // CHANGE: API endpoint from /api/citizen/incidents to /api/alerts/incoming
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    // KEEP: Existing fetch logic structure
    // CHANGE: API endpoint
    const response = await fetch('/api/alerts/incoming');
    const data = await response.json();
    setIncidents(data.alerts); // CHANGED FROM: data.incidents
  };

  const handleAcceptTask = (taskId: string) => {
    // NEW: Navigate to ResponseScreen
    navigation.navigate('ResponseScreen', { taskId });
  };

  return (
    <View style={styles.container}>
      {/* KEEP: Map structure */}
      <MapView
        style={styles.map}
        region={{
          latitude: location?.latitude || 13.4549,
          longitude: location?.longitude || -16.5790,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* KEEP: Marker logic, CHANGE: data source */}
        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            coordinate={{
              latitude: incident.location.latitude,
              longitude: incident.location.longitude,
            }}
            title={incident.title}
            description={incident.type}
            pinColor={incident.priority === 'HIGH' ? 'red' : 'orange'} // NEW: Priority-based color
          />
        ))}
      </MapView>

      {/* NEW: Status toggle at top */}
      <StatusToggle 
        status={officerStatus} 
        onStatusChange={setOfficerStatus}
      />

      {/* KEEP: Bottom sheet structure, CHANGE: content */}
      <View style={styles.bottomSheet}>
        <TaskList 
          tasks={incidents} 
          onAcceptTask={handleAcceptTask}
        />
      </View>
    </View>
  );
};

// KEEP: Existing styles with minor adjustments
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    height: 300,
  },
});

export default MapScreen;
```

### Step 4.3: Create Shared Components

**Create reusable MapComponent:**
```typescript
// src/features/shared/components/MapComponent.tsx

import React from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { StyleSheet } from 'react-native';

interface MapComponentProps {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  markers?: Array<{
    id: string;
    coordinate: { latitude: number; longitude: number };
    title: string;
    description?: string;
    pinColor?: string;
  }>;
  route?: Array<{ latitude: number; longitude: number }>;
}

export const MapComponent: React.FC<MapComponentProps> = ({ 
  region, 
  markers = [], 
  route 
}) => {
  return (
    <MapView style={styles.map} region={region}>
      {/* Render markers */}
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={marker.coordinate}
          title={marker.title}
          description={marker.description}
          pinColor={marker.pinColor || 'red'}
        />
      ))}

      {/* Render route if provided */}
      {route && route.length > 0 && (
        <Polyline
          coordinates={route}
          strokeWidth={5}
          strokeColor="#1E40AF"
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
```

**Create reusable CameraComponent:**
```typescript
// src/features/shared/components/CameraComponent.tsx

import React, { useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';

interface CameraComponentProps {
  onCapture: (photo: any) => void;
  onClose: () => void;
}

export const CameraComponent: React.FC<CameraComponentProps> = ({ 
  onCapture, 
  onClose 
}) => {
  const cameraRef = useRef<RNCamera>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.8, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      onCapture(data);
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.auto}
        captureAudio={false}
      />
      
      <View style={styles.controls}>
        <TouchableOpacity style={styles.capture} onPress={takePicture}>
          <Text style={styles.captureText}>CAPTURE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.close} onPress={onClose}>
          <Text style={styles.closeText}>CLOSE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  preview: { flex: 1 },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  capture: {
    backgroundColor: '#1E40AF',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
  },
  captureText: { color: 'white', fontSize: 16 },
  close: {
    backgroundColor: '#EF4444',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
  },
  closeText: { color: 'white', fontSize: 16 },
});
```

---

## 5. Shared Components & Services

### Step 5.1: Create Shared Hooks

**useGeolocation.ts:**
```typescript
// src/features/shared/hooks/useGeolocation.ts

import { useState, useEffect } from 'react';
import Geolocation from 'react-native-geolocation-service';

export const useGeolocation = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        setError(error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );

    const watchId = Geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        setError(error.message);
      }
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  return { location, error };
};
```

### Step 5.2: Create API Base Configuration

```typescript
// src/features/shared/api/baseApi.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://api.sentinelpatrol.gm'; // CHANGE: Your API URL

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = await AsyncStorage.getItem('authToken');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  get(endpoint: string) {
    return this.request(endpoint);
  },

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  },
};
```

---

## 6. Service-Specific Customization

### Step 6.1: Create Service-Specific Navigation

**Police Navigator:**
```typescript
// src/navigation/PoliceNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';

// Police Screens
import MapScreen from '../features/police/screens/MapScreen';
import TrafficOpsScreen from '../features/police/screens/TrafficOpsScreen';
import AdminMenuScreen from '../features/police/screens/AdminMenuScreen';
import ProfileScreen from '../features/police/screens/ProfileScreen';

// Flow Screens
import ResponseScreen from '../features/police/screens/ResponseScreen';
import IssueTicketScreen from '../features/police/screens/IssueTicketScreen';
import ReportSuiteScreen from '../features/police/screens/ReportSuiteScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#1E40AF',
      tabBarInactiveTintColor: '#6B7280',
    }}
  >
    <Tab.Screen 
      name="Map" 
      component={MapScreen}
      options={{
        tabBarIcon: ({ color }) => <Icon name="map-marked-alt" size={20} color={color} />
      }}
    />
    <Tab.Screen 
      name="Traffic" 
      component={TrafficOpsScreen}
      options={{
        tabBarIcon: ({ color }) => <Icon name="car" size={20} color={color} />
      }}
    />
    <Tab.Screen 
      name="Admin" 
      component={AdminMenuScreen}
      options={{
        tabBarIcon: ({ color }) => <Icon name="cog" size={20} color={color} />
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color }) => <Icon name="user" size={20} color={color} />
      }}
    />
  </Tab.Navigator>
);

export const PoliceNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen name="ResponseScreen" component={ResponseScreen} />
    <Stack.Screen name="IssueTicket" component={IssueTicketScreen} />
    <Stack.Screen name="ReportSuite" component={ReportSuiteScreen} />
  </Stack.Navigator>
);
```

**Fire Navigator:**
```typescript
// src/navigation/FireNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';

// Fire Screens (similar to police but fire-specific)
import FireMapScreen from '../features/fire/screens/FireMapScreen';
import FireResponseScreen from '../features/fire/screens/FireResponseScreen';
import FireReportScreen from '../features/fire/screens/FireReportScreen';
import ProfileScreen from '../features/police/screens/ProfileScreen'; // Shared

const Tab = createBottomTabNavigator();

export const FireNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#DC2626', // Red for fire
    }}
  >
    <Tab.Screen 
      name="FireMap" 
      component={FireMapScreen}
      options={{
        tabBarIcon: ({ color }) => <Icon name="fire" size={20} color={color} />
      }}
    />
    <Tab.Screen 
      name="FireResponse" 
      component={FireResponseScreen}
      options={{
        tabBarIcon: ({ color }) => <Icon name="truck" size={20} color={color} />
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color }) => <Icon name="user" size={20} color={color} />
      }}
    />
  </Tab.Navigator>
);
```

### Step 6.2: Root Navigator with Service Switching

```typescript
// src/navigation/RootNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../features/auth/hooks/useAuth';

import LoginScreen from '../features/auth/screens/LoginScreen';
import { PoliceNavigator } from './PoliceNavigator';
import { FireNavigator } from './FireNavigator';
import { AmbulanceNavigator } from './AmbulanceNavigator';
import { ImmigrationNavigator } from './ImmigrationNavigator';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const { user, isAuthenticated } = useAuth();

  // Route to appropriate navigator based on user role
  const getServiceNavigator = () => {
    if (!isAuthenticated || !user) return null;

    switch (user.role) {
      case 'police':
        return <Stack.Screen name="Police" component={PoliceNavigator} />;
      case 'fire':
        return <Stack.Screen name="Fire" component={FireNavigator} />;
      case 'ambulance':
        return <Stack.Screen name="Ambulance" component={AmbulanceNavigator} />;
      case 'immigration':
        return <Stack.Screen name="Immigration" component={ImmigrationNavigator} />;
      default:
        return null;
    }
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        getServiceNavigator()
      )}
    </Stack.Navigator>
  );
};
```

---

## 7. Navigation & Routing

### Step 7.1: Update App.tsx

```typescript
// src/App.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './features/auth/context/AuthContext';
import { RootNavigator } from './navigation/RootNavigator';

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
```

---

## 8. Testing & Validation

### Step 8.1: Test Each Service

**Create test script:**
```bash
# Create testing checklist file
touch TESTING_CHECKLIST.md
```

**TESTING_CHECKLIST.md:**
```markdown
# Sentinel Patrol Testing Checklist

## Auth Flow
- [ ] Police login works
- [ ] Fire login works
- [ ] Ambulance login works
- [ ] Immigration login works
- [ ] MFA verification works
- [ ] Biometric login works

## Police Service
- [ ] Screen 1: Login → Police Dashboard
- [ ] Screen 2: MapScreen displays incidents
- [ ] Screen 3: ResponseScreen navigation works
- [ ] Screen 4: TrafficOpsScreen vehicle lookup
- [ ] Screen 5


: IssueTicketScreen form submission
- [ ] Screen 6: ReportSuiteScreen file upload
- [ ] Screen 7: TeamCommsScreen messaging
- [ ] Screen 8: AdminMenuScreen navigation
- [ ] Screen 9: ImmigrationScannerScreen QR scan
- [ ] Screen 10: ProfileScreen displays correctly
- [ ] Screen 11: DatabaseSearchScreen search works
- [ ] Screen 12: SuccessScreen displays after actions

## Fire Service
- [ ] FireMapScreen displays fire incidents
- [ ] FireResponseScreen navigation works
- [ ] Equipment tracking works

## Ambulance Service
- [ ] AmbulanceMapScreen displays medical calls
- [ ] Patient record creation works

## Immigration Service
- [ ] ImmigrationDashboard displays arrivals
- [ ] Permit processing works

## Shared Features
- [ ] Geolocation tracking works
- [ ] Camera capture works
- [ ] Voice recording works
- [ ] File uploads work
- [ ] Offline mode works
```

### Step 8.2: Run Tests

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react-native jest

# Run tests
npm test

# Run specific feature tests
npm test -- features/police
npm test -- features/shared
```

---

## 9. Deployment Checklist

### Step 9.1: Pre-Deployment

```markdown
## Code Quality
- [ ] All console.logs removed
- [ ] No hardcoded API URLs (use environment variables)
- [ ] All TypeScript errors resolved
- [ ] ESLint passes without errors

## Security
- [ ] API keys stored in environment variables
- [ ] Sensitive data encrypted
- [ ] JWT token refresh implemented
- [ ] Password hashing verified

## Performance
- [ ] Images optimized
- [ ] Bundle size analyzed
- [ ] Memory leaks checked
- [ ] Offline mode tested

## Documentation
- [ ] README updated
- [ ] API documentation complete
- [ ] User guide created
- [ ] Deployment guide ready
```

### Step 9.2: Build and Deploy

```bash
# iOS Build
cd ios
pod install
cd ..
npx react-native run-ios --configuration Release

# Android Build
cd android
./gradlew assembleRelease
cd ..

# Generate APK/IPA
# iOS: Archive in Xcode
# Android: Find APK in android/app/build/outputs/apk/release/
```

---

## 10. Quick Reference: File Rename Commands

```bash
# Execute all renames at once

# Auth (Screen 1)
mv src/screens/CitizenLogin.tsx src/features/auth/screens/LoginScreen.tsx

# Police Screens
mv src/screens/CitizenDashboard.tsx src/features/police/screens/MapScreen.tsx # Screen 2
mv src/screens/ReportIncident.tsx src/features/police/screens/ResponseScreen.tsx # Screen 3
mv src/screens/VehicleCheck.tsx src/features/police/screens/TrafficOpsScreen.tsx # Screen 4
mv src/screens/ComplaintForm.tsx src/features/police/screens/IssueTicketScreen.tsx # Screen 5
mv src/screens/SubmitReport.tsx src/features/police/screens/ReportSuiteScreen.tsx # Screen 6
mv src/screens/ContactOfficer.tsx src/features/police/screens/TeamCommsScreen.tsx # Screen 7
mv src/screens/Services.tsx src/features/police/screens/AdminMenuScreen.tsx # Screen 8
mv src/screens/DocumentScanner.tsx src/features/police/screens/ImmigrationScannerScreen.tsx # Screen 9
mv src/screens/Profile.tsx src/features/police/screens/ProfileScreen.tsx # Screen 10
mv src/screens/SearchRecords.tsx src/features/police/screens/DatabaseSearchScreen.tsx # Screen 11
mv src/screens/SuccessPage.tsx src/features/shared/screens/SuccessScreen.tsx # Screen 12

# Update all imports automatically
find src -type f -name "*.tsx" -exec sed -i '' 's/CitizenLogin/LoginScreen/g' {} +
find src -type f -name "*.tsx" -exec sed -i '' 's/CitizenDashboard/MapScreen/g' {} +
# ... repeat for all screens
```

---

## Summary

This guide provides a complete roadmap to transform the Gambia Citizen App into the Sentinel Patrol multi-service application. Key transformations include:

1. **Structure**: Flat screen structure → Feature-based architecture
2. **Naming**: Citizen-focused names → Patrol service names
3. **Features**: Single-service app → Multi-service platform (Police, Fire, Ambulance, Immigration)
4. **Reusability**: Duplicated components → Shared component library
5. **Scalability**: Basic navigation → Service-specific routing with role-based access

All existing dependencies, libraries, and infrastructure remain unchanged, ensuring a smooth transition with minimal risk.






Alright, let’s turn that “copy of Gambia Citizen app” into a clean **Sentinel Patrol** app in a way your AI agent (and any dev) can just follow step-by-step.

Below is a **comprehensive Implementation Guide** you can drop into `Implementation.md` in the new repo. It explains:

* What we’re converting
* What must stay the same (libs, permissions, camera/location/etc)
* New **feature-based structure** (police / fire / ambulance / immigration)
* How to **rename screens** and wire navigation
* Which **Patrol screen is Screen 1, 2, 3…** and what each does
* Exact steps the AI agent should follow when editing files

You can literally paste this into your AI assistant and say “follow this document to refactor the project”.

---

# 🚨 Sentinel Patrol Refactor Guide

*Convert Gambia Citizen App → Multi-Agency Patrol App*

## 0. Goal & Constraints

We already have a **stable Gambia Citizen React Native app** (camera, location, audio, permissions, etc. all working).
We **copied** this app into a new folder. This copy will become the **Sentinel Patrol** app.

### 🎯 GOAL

* Reuse **all existing dependencies and native integrations** (camera, geolocation, file storage, audio, notifications, etc.).
* Replace “citizen” flows with **patrol operations** flows (police, fire, ambulance, immigration).
* Reorganise into a **feature-based, enterprise-grade structure** so later we can plug more modules.
* Support **multiple patrol agencies** using the **same app**:

  * Police Patrol
  * Fire Patrol
  * Ambulance Patrol
  * Immigration Patrol
* Same core dashboard and tech stack, but each role sees their **own patrol flow**.

> ⚠️ Important: **Do not remove or change libs** in `package.json` or native Android/iOS setup unless explicitly needed. We are mostly renaming screens + reorganising folders + changing UI/flows.

---

## 1. High-Level Phases

1. **Phase 1 – Project Branding & App Identity**
2. **Phase 2 – Feature-Based Folder Structure**
3. **Phase 3 – Screen Mapping (Citizen → Patrol)**
4. **Phase 4 – Navigation Refactor**
5. **Phase 5 – Shared Core Services (camera, GPS, audio, storage)**
6. **Phase 6 – Multi-Agency Role Handling**
7. **Phase 7 – Cleanup & De-citizen-isation**

The AI agent should work **phase by phase**, not mixing everything at once.

---

## 2. Phase 1 – Project Branding & App Identity

**Files to update (JavaScript-level only):**

* `app.json` or `app.config.js` (if Expo)
* `src/constants/appConfig.ts` (if exists)
* Any place where “Gambia Citizen”, “EGOV-CITIZEN”, etc. appears in **JS/TS** only.

**Rename values but keep wiring:**

* App display name → **“Sentinel Patrol”**
* Bundle/app identifiers can be updated later; focus on UI names first.

> ❗ Do **not** touch native package IDs yet if you don’t need to ship builds immediately. The main job is screens and flows.

---

## 3. Phase 2 – Target Feature-Based Structure

We want a feature-oriented layout rather than one giant `screens/` folder.

### 3.1 Target Structure

```text
src/
  app/
    navigation/
      RootNavigator.tsx
      AuthNavigator.tsx
      MainTabNavigator.tsx
      PatrolStackNavigator.tsx
    providers/
      ThemeProvider.tsx
      AuthProvider.tsx
      AgencyProvider.tsx
  features/
    auth/
      screens/
        LoginScreen.tsx
        SelectAgencyScreen.tsx
      components/
        AuthHeader.tsx
        AuthInput.tsx
      types.ts
    patrol/
      screens/
        DashboardScreen.tsx           // Map + alerts
        ResponseScreen.tsx            // Emergency response mode
        ReportSuiteScreen.tsx         // Incident reporting
        TrafficOpsScreen.tsx          // Traffic operations / ANPR
        IssueTicketScreen.tsx         // E-ticketing
        SuccessScreen.tsx             // Generic success
      components/
        PatrolBottomSheet.tsx
        IncidentCard.tsx
        PatrolStatusBadge.tsx
    team/
      screens/
        TeamCommsScreen.tsx
      components/
        SquadGrid.tsx
        ChannelChat.tsx
    admin/
      screens/
        AdminMenuScreen.tsx
    immigration/
      screens/
        ImmigrationScannerScreen.tsx
    search/
      screens/
        DatabaseSearchScreen.tsx
    profile/
      screens/
        ProfileScreen.tsx
    media/
      services/
        CameraService.ts
        AudioService.ts
      components/
        MediaPreview.tsx
    location/
      services/
        LocationService.ts
  shared/
    components/
      Button.tsx
      IconButton.tsx
      Card.tsx
      Badge.tsx
      TextInput.tsx
    hooks/
      useThemeColors.ts
      useAgency.ts
    theme/
      colors.ts
      spacing.ts
      typography.ts
  types/
    navigation.ts
    models.ts
```

> ✅ The AI agent should **create these folders gradually**, moving files from the old Citizen app into the right feature.

---

## 4. Phase 3 – Screen Mapping (Citizen → Patrol)

We already have the **Sentinel Patrol screen list** from the implementation guide.

Define the canonical list as **Screen 1..12** so everyone (and AI) knows what we’re talking about:

### 4.1 Patrol Screen Index

1. **Screen 1 – LoginScreen**
   Secure officer login (badge ID, password, biometric, MFA).

2. **Screen 2 – MapScreen / DashboardScreen**
   Main patrol map; shows units, incidents, tasks, bottom sheet.

3. **Screen 3 – ResponseScreen**
   Emergency response mode (route navigation + status: EN_ROUTE / ON_SCENE / COMPLETED / SOS).

4. **Screen 4 – TrafficOpsScreen**
   Traffic operations + ANPR / plate lookup.

5. **Screen 5 – IssueTicketScreen**
   E-ticket issuing (violations, driver details, payment status).

6. **Screen 6 – ReportSuiteScreen**
   Incident reporting suite (case creation, stepper, drafts, history).

7. **Screen 7 – TeamCommsScreen**
   Team grid, unit status, radio/chat.

8. **Screen 8 – AdminMenuScreen**
   Station admin dashboard (equipment, training, rosters, approvals).

9. **Screen 9 – ImmigrationScannerScreen**
   Passport/QR scanner; immigration verification.

10. **Screen 10 – ProfileScreen**
    Officer profile, roster, performance stats.

11. **Screen 11 – DatabaseSearchScreen**
    Global search for persons, vehicles, cases, alerts.

12. **Screen 12 – SuccessScreen**
    Universal “transaction complete” screen (ticket issued, case filed, etc.).

### 4.2 Mapping from Citizen App (Example)

> The AI agent needs to **scan the old `/screens` folder** and map similar functionality.

Suggested mapping pattern:

| Old Citizen Screen (example)   | New Patrol Screen Target                                         |
| ------------------------------ | ---------------------------------------------------------------- |
| `LoginScreen` (citizen login)  | `features/auth/screens/LoginScreen.tsx`                          |
| `HomeMapScreen` (citizen map)  | `features/patrol/screens/DashboardScreen.tsx`                    |
| `PoliceEmergencyScreen`        | `features/patrol/screens/ResponseScreen.tsx`                     |
| `NAWECSubmitReadingScreen`     | (Can be reused as **IssueTicket** style layout or later removed) |
| `AddressVerificationMapScreen` | Contribute patterns to `DashboardScreen` & `ResponseScreen`      |
| `HelpScreen` / `SupportScreen` | Move content into `DatabaseSearchScreen` or `ProfileScreen`      |

> 🧠 **Rule for the AI:**
> For each old `XYZScreen.tsx`, decide:
>
> * **Keep** (rename and move)
> * **Use layout as reference** for a new patrol screen
> * **Deprecate** (if pure citizen logic that doesn’t fit patrol)

---

## 5. Phase 4 – Navigation Refactor

We want a **Root Stack → Auth Stack / Main Tabs → Feature Stacks** pattern.

### 5.1 Step 1 – Identify Old Navigation

AI agent must locate:

* `AppNavigator.tsx`, `RootNavigator.tsx` or similar
* Any `createStackNavigator`, `createBottomTabNavigator`, `NavigationContainer`.

### 5.2 Step 2 – Create New Navigation Files

Create:

* `src/app/navigation/RootNavigator.tsx`
* `src/app/navigation/AuthNavigator.tsx`
* `src/app/navigation/MainTabNavigator.tsx`
* `src/app/navigation/PatrolStackNavigator.tsx`

Example skeleton (AI can expand):

```tsx
// RootNavigator.tsx
const RootStack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
```

`MainTabNavigator` will host:

* Tab 1: `DashboardScreen`
* Tab 2: `TrafficOpsScreen`
* Tab 3: `ReportSuiteScreen`
* Tab 4: `TeamCommsScreen`
* Tab 5: `ProfileScreen`

`PatrolStackNavigator` can be nested inside the first tab (Map / Dashboard) to handle:

* `DashboardScreen`
* `ResponseScreen`
* `SuccessScreen`
* `AdminMenuScreen` (if opened from patrol)

> ✅ **Important instruction to AI:**
> When renaming routes, **do not delete existing stacks** until the new ones compile. Gradually move screens from old stacks into the new navigators.

---

## 6. Phase 5 – Reusing Media & Location Services

We must **reuse** the existing infrastructure for:

* Camera (`react-native-image-picker` / `react-native-camera` / etc.)
* GPS (`@react-native-community/geolocation` or similar)
* Audio record (`react-native-audio` / `expo-av` / etc.)
* Permissions (`PermissionsAndroid`, `react-native-permissions`, etc.)

### 6.1 Create Shared Services

From existing code (e.g. `PoliceEmergencyScreen`, `NAWECSubmitReadingScreen`), extract logic like:

* `requestCameraPermission`
* `launchCamera`
* `requestLocationPermission`
* `getCurrentPosition`
* `startAudioRecording`, `stopAudioRecording`

Put into:

```text
src/features/media/services/CameraService.ts
src/features/media/services/AudioService.ts
src/features/location/services/LocationService.ts
```

Example pattern (AI should copy from existing implementations):

```ts
export const takePhoto = async (): Promise<string | null> => {
  // reuse existing options & permission logic
};
```

Then in new screens (e.g. `ResponseScreen`, `TrafficOpsScreen`, `IssueTicketScreen`), call these helpers instead of duplicating.

> 🔁 This keeps the **same dependencies** but makes them reusable for all patrol agencies.

---

## 7. Phase 6 – Multi-Agency Role Handling (Police / Fire / Ambulance / Immigration)

We want **one app**, multiple patrol types.

### 7.1 Add Agency Type

Create `src/shared/types/agency.ts`:

```ts
export type AgencyType = 'POLICE' | 'FIRE' | 'AMBULANCE' | 'IMMIGRATION';
```

### 7.2 Agency Context

Add `AgencyProvider`:

```ts
interface AgencyContextValue {
  agency: AgencyType;
  setAgency: (agency: AgencyType) => void;
}

const AgencyContext = createContext<AgencyContextValue>(...);

export const useAgency = () => useContext(AgencyContext);
```

### 7.3 Select Agency Screen

Before login or just after login, show:

* `SelectAgencyScreen.tsx` with choices:

  * Police Patrol
  * Fire Patrol
  * Ambulance Patrol
  * Immigration Patrol

On select → `setAgency('POLICE')` etc, then navigate to `DashboardScreen`.

### 7.4 Agency-Aware Screens

In patrol screens, AI should parameterise text & icons:

* `DashboardScreen` header → “Police Patrol” / “Fire Patrol” / “Ambulance Patrol” etc.
* Incident types & colors may vary by agency (config object).

Create config:

```ts
const AGENCY_CONFIG: Record<AgencyType, { primaryColor: string; label: string; iconName: string; }> = {
  POLICE: { primaryColor: '#1E40AF', label: 'Police Patrol', iconName: 'shield' },
  FIRE: { primaryColor: '#DC2626', label: 'Fire Patrol', iconName: 'fire-extinguisher' },
  AMBULANCE: { primaryColor: '#16A34A', label: 'Ambulance Patrol', iconName: 'ambulance' },
  IMMIGRATION: { primaryColor: '#0EA5E9', label: 'Immigration Patrol', iconName: 'passport' },
};
```

Screens call `useAgency()` and apply `AGENCY_CONFIG[agency]`.

> ✅ This way, **same DashboardScreen** can serve all agencies with just different styling and copies.

---

## 8. Phase 7 – Cleanup & De-Citizen-isation

After all patrol screens compile:

1. Remove / archive **pure citizen features**:

   * NAWEC water readings (if not reused)
   * Local KYC flows not relevant to patrol
   * Citizen help flows, etc.

2. Update i18n / copy texts:

   * Replace “citizen", "address verification", etc. with patrol wording (incident, case, ticket, etc.).

3. Ensure **dark mode theme** remains consistent:

   * Use existing dark/light theme provider but adjust new screens to reference `theme.colors` instead of hardcoded values (where possible).

---

## 9. Concrete Instructions For AI Agent

When you (AI) are working on the codebase:

1. **Never** remove dependencies from `package.json` unless explicitly told.
2. For each existing screen in `src/screens`:

   * Decide its mapping using the table in section 4.2.
   * Move it to `src/features/.../screens` and rename the file + exported component to the new patrol name.
   * Update imports and navigation registration accordingly.
3. When converting the UI:

   * Use the HTML/Tailwind **Sentinel Patrol designs** as the new layout template.
   * Reuse camera/location/audio code from the citizen screens via shared services (section 6).
4. For every new screen:

   * Add route type in `src/types/navigation.ts`.
   * Register it in the appropriate navigator (Auth, Main Tabs, PatrolStack).
5. Implement **SelectAgencyScreen** early, so we can test multi-agency flows.
6. Keep the app compiling after each major move (run `npx react-native run-android` / `run-ios` and fix TS/JS errors immediately).

---

## 10. Screen Flow Summary

Final flow the app should follow:

1. **Launch → LoginScreen (Screen 1)**
2. After success → **SelectAgencyScreen** (choose Police / Fire / Ambulance / Immigration)
3. → **MainTabNavigator (Screen 2 as default tab)**

   * Tab 1: Dashboard (MapScreen / PatrolStack)

     * From incident card → ResponseScreen (Screen 3)
     * From actions → SuccessScreen (Screen 12)
   * Tab 2: TrafficOpsScreen (Screen 4)

     * Can open IssueTicketScreen (Screen 5) → SuccessScreen (12)
   * Tab 3: ReportSuiteScreen (Screen 6)
   * Tab 4: TeamCommsScreen (Screen 7)
   * Tab 5: ProfileScreen (Screen 10) with link to AdminMenuScreen (Screen 8), ImmigrationsScannerScreen (Screen 9), DatabaseSearchScreen (Screen 11).

This is the **logical map** that the AI must follow when wiring navigation.

---

If you like, next step I can:

* Draft the **RootNavigator / MainTabNavigator code**
* Give a **sample `SelectAgencyScreen` implementation**
* Or produce a **migration checklist per actual files** once you show me your current `citizen` `/screens` list.














# 📝 Implementation Guide: Sentinel Patrol Mobile App

As an expert mobile app architect specializing in React Native, this document outlines the technical implementation strategy for the **Sentinel Patrol** application. This guide is tailored for development using React Native (CLI), TypeScript, functional components with hooks, and React Native's `StyleSheet` for styling, leveraging GitHub Copilot for accelerated development.

---

## 1. Project Overview

| Feature | Detail |
| :--- | :--- |
| **App Name** | Sentinel Patrol |
| **Purpose** | Comprehensive mobile tool for law enforcement operations (incident management, traffic enforcement, team coordination). |
| **Target Platform** | iOS & Android (React Native CLI) |
| **Language** | TypeScript/JavaScript |
| **Styling** | React Native `StyleSheet` (Tailwind concepts applied via utility props/classes where applicable, but fundamentally standard RN styling) |
| **Theme Color** | `#1E40AF` (Primary Blue) |
| **AI Editor** | GitHub Copilot |

## 2. Tech Stack Setup

We will initialize the project using the standard React Native CLI, ensuring we use TypeScript templates for robust code quality.

### 2.1 Project Initialization

```bash
# Initialize a new React Native project with TypeScript template
npx react-native init SentinelPatrol --template react-native-template-typescript

# Navigate into the project directory
cd SentinelPatrol
```

### 2.2 Core Dependencies

The application relies heavily on navigation, state management, mapping, and secure storage:

| Dependency | Purpose | Installation Command |
| :--- | :--- | :--- |
| `react-navigation/native` | Primary navigation library (Stack, Tabs) | `npm install @react-navigation/native` |
| `react-native-screens` | Native primitives for navigation performance | `npm install react-native-screens react-native-safe-area-context` |
| `react-navigation/stack` | Implementing the navigation flow | `npm install @react-navigation/stack` |
| `@react-native-async-storage/async-storage` | Secure local storage for tokens/session | `npm install @react-native-async-storage/async-storage` |
| `react-native-maps` | Displaying maps and real-time markers | `npm install react-native-maps` |
| `react-native-vector-icons` | Replacing FontAwesome icons | `npm install react-native-vector-icons` |
| `react-native-geolocation-service` | High-accuracy location tracking | `npm install react-native-geolocation-service` |

**Post-installation Steps (iOS):**

```bash
cd ios && pod install && cd ..
```

### 2.3 Directory Structure

```
src/
├── api/             # API service wrappers (Axios calls)
├── assets/          # Images, fonts, etc.
├── components/      # Reusable UI components (Button, InputField, Card)
├── context/         # State management (AuthContext, IncidentContext)
├── hooks/           # Custom hooks (useAuth, useGeolocation)
├── navigation/      # Navigation stacks and configuration
├── screens/         # Main application screens (Login, Map, Reports)
├── types/           # All TypeScript interfaces and types
└── App.tsx          # Root component
```

## 3. Generation Status

| Screen Name | Category | Status | Notes |
| :--- | :--- | :--- | :--- |
| 1. Secure Login Portal | Auth | ✅ Complete | Login form, MFA modal simulation. |
| 2. Command Map (Home) | Main | ✅ Complete | Map view, bottom sheet, task management tabs. |
| 3. Emergency Response Mode | Flow | ✅ Complete | Full-screen navigation, status toggles, SOS button. |
| 4. Traffic Ops & ANPR | Main | ✅ Complete | Camera/Input view, status modal (Red/Green). |
| 5. E-Ticket Issuance | Flow | ✅ Complete | Detailed form, fine calculation, QR generation, cash receipt modal. |
| 6. Incident Reporting Suite | Main | ✅ Complete | Tabbed/stepper form for case creation. |
| 7. Team Grid & Radio | Main | ✅ Complete | Squad status grid, direct comms, chat channel. |
| 8. Station Admin Menu | Main | ✅ Complete | Grid dashboard for admin functions, notification badges. |
| 9. Immigration Scanner | Flow | ✅ Complete | QR/Passport scanner UI, result card, biometric verification. |
| 10. Officer Profile & Roster | Settings | ✅ Complete | Digital ID badge, duty roster calendar, stats. |
| 11. Global Database Search | Flow | ✅ Complete | Search bar, filters, recent searches, BOLO list. |
| 12. Transaction Success | Flow | ✅ Complete | Universal success screen (e.g., after issuing ticket). |

## 4. Screen Breakdown (React Native Implementation)

All screens will utilize functional components and `useMemo`/`useCallback` hooks for performance.

### 4.1 Screen 1: Secure Login Portal (`screens/Auth/LoginScreen.tsx`)

*   **Purpose:** Secure officer authentication using Badge ID/Password, supporting Biometric login (FaceID/Fingerprint) and MFA.
*   **User Flow:** Enter credentials → Tap Authenticate → (If successful) → Enter MFA Code → Redirect to Dashboard.
*   **Key RN Components:**
    *   `SafeAreaView`: Ensure content avoids notches and home bars.
    *   `ImageBackground`: For the blurred map background.
    *   `TextInput`: For `badgeNumber` and `password`. Use `secureTextEntry` for password.
    *   `TouchableOpacity` / `Button`: For login and biometric actions.
    *   `Modal`: To simulate the MFA verification screen.
*   **Interactions:**
    *   Authentication logic will call `POST /api/auth/login`.
    *   Upon receiving JWT, store it in `AsyncStorage` and update `AuthContext`.
    *   Biometric login requires integration with `react-native-keychain` or similar biometric libraries (not detailed here, but planned).

```typescript
// src/screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Modal } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome5';

const LoginScreen = () => {
  const [badgeNumber, setBadgeNumber] = useState('');
  const [password, setPassword] = useState('');
  const [mfaVisible, setMfaVisible] = useState(false);
  const { login } = useAuth(); // Assume login handles API call

  const handleLogin = async () => {
    // 1. Validate inputs
    // 2. Call API (simulate success path)
    setMfaVisible(true);
  };

  const handleMfaVerify = async (code: string) => {
    // 3. Simulate MFA verification success
    setMfaVisible(false);
    await login(badgeNumber, password, code); // Final login step
  };

  return (
    <ImageBackground 
      source={require('../../assets/map-blur.jpg')} // Placeholder
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Header/Logo */}
        <View style={styles.header}>
          <Icon name="shield-alt" size={48} color="#1E40AF" style={styles.logoIcon} />
          <Text style={styles.title}>Sentinel Patrol</Text>
        </View>

        {/* Input Fields */}
        <View style={styles.formContainer}>
          {/* Badge ID Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Badge ID</Text>
            <View style={styles.inputWrapper}>
              <Icon name="id-card" size={18} color="#4B5563" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter Badge Number"
                placeholderTextColor="#6B7280"
                onChangeText={setBadgeNumber}
                value={badgeNumber}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Icon name="lock" size={18} color="#4B5563" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#6B7280"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
              />
            </View>
          </View>

          {/* Authenticate Button */}
          <TouchableOpacity style={styles.authButton} onPress={handleLogin}>
            <Text style={styles.authButtonText}>AUTHENTICATE</Text>
            <Icon name="arrow-right" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        {/* Biometric Login */}
        <TouchableOpacity style={styles.biometricButton}>
            <Icon name="fingerprint" size={24} color="#60A5FA" />
            <Text style={styles.biometricButtonText}>Biometric Login</Text>
        </TouchableOpacity>
      </View>

      {/* MFA Modal Implementation */}
      <Modal visible={mfaVisible} transparent animationType="fade">
        {/* MFA component implementation here */}
        <MfaModal onVerify={handleMfaVerify} onClose={() => setMfaVisible(false)} />
      </Modal>
    </ImageBackground>
  );
};

// Simplified Styles for React Native
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(17, 24, 39, 0.85)', // Dark overlay
  },
  header: {
    alignItems: 'center',
  },
  logoIcon: {
    backgroundColor: 'rgba(30, 64, 175, 0.2)',
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
    borderColor: '#374151',
    borderWidth: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.5,
  },
  formContainer: {
    width: '100%',
    marginVertical: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 55, 72, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4B5563',
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E40AF',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  authButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
    letterSpacing: 1,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 55, 72, 0.4)',
    borderWidth: 1,
    borderColor: '#4B5563',
    padding: 16,
    borderRadius: 12,
    marginBottom: 60,
  },
  biometricButtonText: {
    color: '#E5E7EB',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  }
});

// MfaModal Component (Simplified)
const MfaModal = ({ onVerify, onClose }) => (
    <View style={stylesMfa.centeredView}>
        <View style={stylesMfa.modalView}>
            <Text style={stylesMfa.modalTitle}>Security Verification</Text>
            <Text style={stylesMfa.modalText}>Enter the 6-digit code sent to your device.</Text>
            <TextInput
                style={stylesMfa.mfaInput}
                keyboardType="numeric"
                maxLength={6}
                placeholder="000000"
                placeholderTextColor="#9CA3AF"
                onChangeText={(code) => code.length === 6 && onVerify(code)}
            />
            <TouchableOpacity style={stylesMfa.verifyButton} onPress={() => onVerify('123456')}>
                <Text style={stylesMfa.verifyButtonText}>VERIFY IDENTITY</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
                <Text style={stylesMfa.cancelText}>CANCEL REQUEST</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const stylesMfa = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
    },
    modalView: {
        width: '90%',
        maxWidth: 350,
        backgroundColor: '#1F2937',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderTopWidth: 4,
        borderTopColor: '#1E40AF',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    modalText: {
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 14,
    },
    mfaInput: {
        width: '100%',
        backgroundColor: '#111827',
        borderRadius: 10,
        paddingVertical: 15,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 8,
        color: 'white',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#4B5563',
    },
    verifyButton: {
        backgroundColor: '#1E40AF',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        marginBottom: 15,
    },
    verifyButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cancelText: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: '600',
    }
});

export default LoginScreen;
```

### 4.2 Screen 2: Command Map (Home) (`screens/Main/MapScreen.tsx`)

*   **Purpose:** Central operational hub showing real-time location, shift status, and pending tasks.
*   **Key RN Components:**
    *   `MapView` (from `react-native-maps`): Full-screen map rendering.
    *   `Marker`: Display officer and incident locations.
    *   `Animated.View` or a library like `react-native-reanimated` for the Draggable Bottom Sheet.
    *   `ScrollView`: For the task list within the bottom sheet.
*   **Interactions:**
    *   Fetch officer status and pending tasks: `GET /api/dashboard/overview`.
    *   Status toggle updates: `PUT /api/officers/{id}/status`.
    *   Task acceptance logic (handled by `setStage` in the mock) updates local state and prepares navigation data for the Emergency Response screen.

### 4.3 Screen 3: Emergency Response Mode (`screens/Flow/ResponseScreen.tsx`)

*   **Purpose:** Dedicated navigation mode for active incidents.
*   **Key RN Components:**
    *   `MapView` with `Polyline`: Displaying the navigation route.
    *   Fixed `View` overlays for the Incident Info and Navigation instructions.
    *   Large `TouchableOpacity` elements for status updates (`EN_ROUTE`, `ON_SCENE`).
*   **Interactions:**
    *   Tapping status buttons triggers `PUT /api/tasks/{taskId}/status` and updates the UI state.
    *   "Request Backup" triggers a `POST /api/emergency/backup-request` and likely activates a real-time WebSocket alert for nearby units.

### 4.4 Screen 4: Traffic Ops & ANPR (`screens/Main/TrafficOpsScreen.tsx`)

*   **Purpose:** Vehicle and driver lookup via camera (ANPR) or manual entry.
*   **Key RN Components:**
    *   `Camera` (using `react-native-camera` or `expo-camera` analog): Simulated viewfinder.
    *   `TextInput`: Manual plate/license entry.
    *   `Modal` or `BottomSheet`: For displaying the detailed Vehicle/Driver Report Card.
    *   `SegmentedControl` (or custom buttons): For switching between Plate and License search tabs.
*   **Interactions:**
    *   Manual search calls `GET /api/vehicles/search?plateNumber={plate}` or `GET /api/drivers/search?licenseNumber={license}`.
    *   The result determines the color-coding (Red for Stolen/Warrant, Green for Clear).

### 4.5 Screen 5: E-Ticket Issuance (`screens/Flow/IssueTicketScreen.tsx`)

*   **Purpose:** Digital citation issuance form.
*   **Key RN Components:**
    *   `Picker` or custom dropdown component: Violation Selector.
    *   `ImagePicker` integration: For uploading photographic evidence.
    *   `Modal`: Used for the Ticket Generated (QR Code) and Cash Payment Confirmation steps.
*   **Interactions:**
    *   Form submission calls `POST /api/traffic-tickets`.
    *   The `Generate QR & Issue` button triggers the API call and transitions to the success modal, displaying the QR code (which can be generated client-side using a QR library).

### 4.6 Screen 6: Incident Reporting Suite (`screens/Main/ReportSuiteScreen.tsx`)

*   **Purpose:** Comprehensive incident documentation interface.
*   **Key RN Components:**
    *   `TabView` (from a navigation library or custom implementation): For Drafts, New Report, History tabs.
    *   `Stepper` component (custom): Visual progress indicator for form steps.
    *   `Collapsible` components: To manage visibility of large form sections (Incident Details, People Involved, Evidence).
    *   `TextInput` (multiline): For detailed narrative (`reportText`).
*   **Interactions:**
    *   `Next Step` button validates the current step's fields and advances the stepper state.
    *   Final submission calls `POST /api/case-reports`.

### 4.7 Screen 7: Team Grid & Radio (`screens/Main/TeamCommsScreen.tsx`)

*   **Purpose:** Team coordination and communication hub.
*   **Key RN Components:**
    *   `FlatList` or `ScrollView` with `View` grid: For the Squad Status display.
    *   `Modal` or `Overlay`: To show the Direct Comms Card upon officer selection.
    *   `GiftedChat` or custom `ScrollView`/`TextInput`: For the Channel Chat area.
    *   PTT (Push-to-Talk) requires integration with a background audio library (e.g., `react-native-audio-toolkit`) and WebSocket for real-time streaming, simulating radio communication.
*   **Interactions:**
    *   Fetches team status: `GET /api/patrol-teams/available`.
    *   Sending messages: `POST /api/messages` (or WebSocket).

### 4.8 Screen 8: Station Admin Menu (`screens/Main/AdminMenuScreen.tsx`)

*   **Purpose:** Administrative task navigation for Station Officers/Supervisors.
*   **Key RN Components:**
    *   `ScrollView` with a `View` grid layout.
    *   Custom `Tile` component with icons, titles, and `Badge` indicators.
*   **Interactions:**
    *   Badges require fetching summary data (e.g., `GET /api/equipment/requests` count, `GET /api/training/courses` overdue count).
    *   Navigation to relevant sub-screens (e.g., Equipment, Training).

### 4.9 Screen 9: Immigration Scanner (`screens/Flow/ImmigrationScannerScreen.tsx`)

*   **Purpose:** Verification of immigrant status and permits.
*   **Key RN Components:**
    *   `Camera` component: For QR/Passport scanning simulation.
    *   `Switch`: For the Manual Verification toggle.
    *   Custom `Card` components: To display the Digital Passport result.
*   **Interactions:**
    *   QR scan simulation calls `GET /api/immigration/verify-qr?qrCode={qrCode}`.
    *   Biometric Verify button simulates a local biometric check and calls an API endpoint to log the verification.

### 4.10 Screen 10: Officer Profile & Roster (`screens/Settings/ProfileScreen.tsx`)

*   **Purpose:** Display personal information, duty schedule, and performance stats.
*   **Key RN Components:**
    *   `Image` and custom `View` styling: To create the Digital ID Badge.
    *   Horizontal `FlatList`: For the Duty Roster calendar strip.
    *   `ScrollView`: To contain the stats and certifications sections.
*   **Interactions:**
    *   Roster data fetched via `GET /api/schedule/officer/{officerId}`.
    *   Stats data fetched from a dedicated endpoint (`GET /api/dashboard/overview` or similar).

### 4.11 Screen 11: Global Database Search (`screens/Flow/DatabaseSearchScreen.tsx`)

*   **Purpose:** Universal search interface for law enforcement records.
*   **Key RN Components:**
    *   `TextInput` with clear button/icon.
    *   Horizontal `ScrollView` with `TouchableOpacity` for scope filters.
    *   `FlatList` or `ScrollView` for Recent Searches and BOLO lists.
*   **Interactions:**
    *   Search input triggers API calls based on the selected scope (Person, Vehicle, Case #).
    *   BOLO list fetches high-priority data: `GET /api/alerts/bolo`.

### 4.12 Screen 12: Transaction Success (`screens/Flow/SuccessScreen.tsx`)

*   **Purpose:** Generic confirmation screen after a critical transaction (e.g., report submission, ticket issuance).
*   **Key RN Components:**
    *   Large, centered `View` with icon/animation for success feedback.
    *   `Card` component for transaction summary.
    *   `TouchableOpacity` for primary actions (Print, Email, Return).
*   **Interactions:**
    *   `Print Receipt` requires integrating with `react-native-bluetooth-printer` or similar library.
    *   `Return to Patrol` navigates the user back to the `MapScreen`.

## 5. Navigation Architecture

We will use **React Navigation** with a combination of Stack and Tab navigators.

```typescript
// src/navigation/AppNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from '../screens/Main/MapScreen';
// ... other imports

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 1. Main Tab Navigator (Bottom Bar)
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#1E40AF',
      tabBarStyle: { height: 80, paddingBottom: 15 },
    }}
  >
    <Tab.Screen 
      name="Map" 
      component={MapScreen} 
      options={{ tabBarIcon: ({ color }) => (<Icon name="map-marked-alt" color={color} size={20} />) }}
    />
    <Tab.Screen 
      name="Traffic" 
      component={TrafficOpsScreen} 
      options={{ tabBarIcon: ({ color }) => (<Icon name="car" color={color} size={20} />) }}
    />
    {/* ... other main tabs (Admin, Profile) */}
  </Tab.Navigator>
);

// 2. Root Stack Navigator (Handles Auth and Main Flow)
const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {/* Conditional rendering based on AuthContext */}
    {isAuthenticated ? (
      <>
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="ResponseMode" component={ResponseScreen} />
        <Stack.Screen name="IssueTicket" component={IssueTicketScreen} />
        {/* ... other flow screens */}
      </>
    ) : (
      <Stack.Screen name="Login" component={LoginScreen} />
    )}
  </Stack.Navigator>
);
```

## 6. Implementation Guide for GitHub Copilot

### 6.1 Using Copilot with this Document

1.  **Copilot Chat:** Use Copilot Chat to discuss the implementation plan, focusing on complex components like the Draggable Bottom Sheet (`MapScreen`) or the ANPR camera integration (`TrafficOpsScreen`).
    *   *Example Prompt for Chat:* "I need a React Native functional component for a draggable bottom sheet on the `MapScreen.tsx`. It should contain two tabs: 'Current Task' and 'Next Jobs', similar to the HTML mockup."
2.  **Inline Suggestions:** Use inline suggestions extensively for:
    *   Converting HTML/Tailwind structure to React Native `StyleSheet` objects.
    *   Generating boilerplate for functional components and necessary imports (`useState`, `useEffect`, `View`, `Text`, `TouchableOpacity`).
    *   Implementing API call structures using TypeScript interfaces defined in the `types/` directory.

### 6.2 Order of Implementation

Follow this order to build a functional core quickly:

1.  **Authentication & Context (`LoginScreen`, `AuthContext`)**: Establish secure login and session management.
2.  **Core Navigation (`AppNavigator`)**: Set up the main stack and tab navigators.
3.  **Core Main Screen (`MapScreen`)**: Implement the map view and the complex Draggable Bottom Sheet (Screen 2).
4.  **Critical Flow (`ResponseScreen`)**: Implement the emergency call response flow (Screen 3).
5.  **Traffic Enforcement (`TrafficOpsScreen`, `IssueTicketScreen`, `SuccessScreen`)**: Implement search, citation issuance, and success feedback (Screens 4, 5, 12).
6.  **Administrative Screens (`ReportSuiteScreen`, `AdminMenuScreen`, `ProfileScreen`)**: Build the detailed forms and information displays (Screens 6, 8, 10).
7.  **Specialized Screens (`TeamCommsScreen`, `ImmigrationScannerScreen`, `DatabaseSearchScreen`)**: Finalize specialized functionality (Screens 7, 9, 11).

### 6.3 Component Reusability

Focus on creating these reusable components early to maintain consistency and speed:

*   **`CustomButton`**: Handles primary (`#1E40AF`) and secondary styles, loading states, and disabled states.
*   **`ThemedInput`**: Standardized `TextInput` component with icon support and error handling.
*   **`StatusBadge`**: Displays color-coded status (Green: Online, Red: Critical, Yellow: Warning).
*   **`InfoCard`**: Standardized container for displaying data (used in Profile, Traffic Ops results).
*   **`TabButton`**: Used for custom segmented controls in Traffic Ops and Report Suite.

## 7. Code Conversion Guide

The provided HTML/Tailwind CSS mockups must be meticulously converted into React Native components using `View`, `Text`, `Image`, `TouchableOpacity`, and `StyleSheet.create`.

| HTML/CSS Concept | React Native Equivalent | Notes |
| :--- | :--- | :--- |
| `div` | `View` | The fundamental container. |
| `p`, `h1`, `span` | `Text` | Must be used for all text content. |
| `img` | `Image` | Use `require()` for local assets or `{ uri: '...' }` for network images. |
| `button`, `a` | `TouchableOpacity` / `Pressable` | For all interactive elements. |
| `class="flex justify-between"` | `style={{ flexDirection: 'row', justifyContent: 'space-between' }}` | Flexbox properties are standard but use camelCase and inline/StyleSheet objects. |
| `class="bg-blue-600 p-4"` | `backgroundColor: '#1E40AF'`, `padding: 16` | All styling is numerical or string based in JavaScript objects. |
| `class="shadow-lg"` | `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`, `elevation` | Shadows require platform-specific properties. |
| `input`, `select`, `textarea` | `TextInput`, `Picker` | Use platform-specific components. |
| FontAwesome Icons | `Icon` (from `react-native-vector-icons`) | Use the imported Icon component instead of `<i>` tags. |

---

## 8. Reference Code (React Native Structure)

The following is an example of converting the **Emergency Response Mode (Screen 3)** HTML/CSS into a structured React Native component using TypeScript and `StyleSheet`.

```tsx
// src/screens/Flow/ResponseScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

type Status = 'EN_ROUTE' | 'ON_SCENE' | 'COMPLETED';

const ResponseScreen = () => {
    const [currentStatus, setCurrentStatus] = useState<Status>('EN_ROUTE');

    // Dummy data for map/route
    const officerLocation = { latitude: 13.4549, longitude: -16.5790 };
    const incidentLocation = { latitude: 13.4600, longitude: -16.5850 };
    const routeCoordinates = [
        officerLocation,
        { latitude: 13.4570, longitude: -16.5800 },
        incidentLocation,
    ];

    const handleStatusUpdate = (newStatus: Status) => {
        // API Call: PUT /api/tasks/{taskId}/status
        console.log(`Updating status to: ${newStatus}`);
        setCurrentStatus(newStatus);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Map View */}
            <MapView
                style={styles.map}
                initialRegion={{
                    ...officerLocation,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }}
            >
                {/* Route Line */}
                <Polyline
                    coordinates={routeCoordinates}
                    strokeWidth={5}
                    strokeColor="#1E40AF"
                />
                {/* Officer Marker */}
                <Marker coordinate={officerLocation}>
                    <View style={styles.officerMarker}>
                        <Icon name="car-side" size={18} color="#1E40AF" />
                    </View>
                </Marker>
                {/* Incident Marker */}
                <Marker coordinate={incidentLocation}>
                    <View style={styles.incidentMarker}>
                        <Icon name="exclamation-triangle" size={18} color="white" />
                    </View>
                </Marker>
            </MapView>

            {/* Top Navigation Strip */}
            <View style={styles.navStrip}>
                <View style={styles.navDetails}>
                    <Text style={styles.navLabel}>Then Turn Right</Text>
                    <Text style={styles.navInstruction}>W. Highland Ave</Text>
                </View>
                <View style={styles.navDistance}>
                    <Text style={styles.navDistanceValue}>200</Text>
                    <Text style={styles.navDistanceUnit}>FEET</Text>
                </View>
            </View>

            {/* Incident Info Overlay */}
            <View style={styles.incidentOverlay}>
                <View style={styles.incidentCard}>
                    <View>
                        <Text style={styles.severityBadge}>Severity: Critical</Text>
                        <Text style={styles.incidentTitle}>Armed Robbery</Text>
                    </View>
                    <View style={styles.codeBox}>
                        <Text style={styles.codeLabel}>CODE</Text>
                        <Text style={styles.codeValue}>211</Text>
                    </View>
                </View>
                <View style={styles.incidentAddress}>
                    <Icon name="map-marker-alt" size={14} color="#4B5563" style={{ marginRight: 5 }} />
                    <Text style={styles.incidentAddressText}>4502 W. Highland Ave, Sector 4</Text>
                </View>
            </View>

            {/* Bottom Control Panel */}
            <View style={styles.controlPanel}>
                <View style={styles.tripInfo}>
                    <View>
                        <Text style={styles.tripTime}>4 min</Text>
                        <Text style={styles.tripDetails}>1.2 miles • 12:42 PM Arrival</Text>
                    </View>
                    <View style={styles.trafficStatus}>
                        <View style={styles.trafficDot} />
                        <Text style={styles.trafficText}>Live Traffic</Text>
                    </View>
                </View>

                {/* Action Buttons Grid */}
                <View style={styles.actionGrid}>
                    <TouchableOpacity
                        style={[styles.actionButton, currentStatus === 'EN_ROUTE' && styles.actionButtonActive]}
                        onPress={() => handleStatusUpdate('ON_SCENE')}
                        disabled={currentStatus !== 'EN_ROUTE'}
                    >
                        <Icon name="map-pin" size={24} color={currentStatus === 'EN_ROUTE' ? 'white' : '#9CA3AF'} />
                        <Text style={[styles.actionButtonText, currentStatus === 'EN_ROUTE' && { color: 'white' }]}>
                            On Scene
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, currentStatus === 'ON_SCENE' && styles.actionButtonActive]}
                        onPress={() => handleStatusUpdate('COMPLETED')}
                        disabled={currentStatus !== 'ON_SCENE'}
                    >
                        <Icon name="check-circle" size={24} color={currentStatus === 'ON_SCENE' ? 'white' : '#9CA3AF'} />
                        <Text style={[styles.actionButtonText, currentStatus === 'ON_SCENE' && { color: 'white' }]}>
                            Completed
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* SOS Button */}
                <TouchableOpacity style={styles.sosButton}>
                    <Icon name="exclamation-triangle" size={20} color="white" style={styles.sosIcon} />
                    <Text style={styles.sosButtonText}>Request Backup</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#E5E7EB',
    },
    map: {
        flex: 1,
    },
    officerMarker: {
        width: 30, height: 30, borderRadius: 15, backgroundColor: 'white',
        justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#1E40AF',
    },
    incidentMarker: {
        width: 30, height: 30, borderRadius: 15, backgroundColor: '#EF4444',
        justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white',
    },
    // --- Top Navigation Strip ---
    navStrip: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        backgroundColor: '#111827',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 40, // Adjust for notch
    },
    navDetails: {
        marginLeft: 10,
    },
    navLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
        textTransform: 'uppercase',
    },
    navInstruction: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    navDistance: {
        alignItems: 'flex-end',
    },
    navDistanceValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    navDistanceUnit: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    // --- Incident Info Overlay ---
    incidentOverlay: {
        position: 'absolute',
        top: 130, // Below nav strip
        left: 16,
        right: 16,
        zIndex: 10,
    },
    incidentCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        padding: 16,
        borderLeftWidth: 8,
        borderLeftColor: '#DC2626',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    severityBadge: {
        backgroundColor: '#FEE2E2',
        color: '#B91C1C',
        fontSize: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    incidentTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1F2937',
    },
    codeBox: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        minWidth: 60,
    },
    codeLabel: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    codeValue: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1F2937',
    },
    incidentAddress: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    incidentAddressText: {
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '500',
    },
    // --- Bottom Control Panel ---
    controlPanel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 10,
        paddingHorizontal: 16,
        paddingBottom: 30, // Adjust for iPhone X safe area
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10,
    },
    tripInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        marginBottom: 10,
    },
    tripTime: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    tripDetails: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    trafficStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trafficDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4ade80', // Green dot
        marginRight: 8,
    },
    trafficText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#10B981',
        textTransform: 'uppercase',
    },
    actionGrid: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 10,
    },
    actionButton: {
        flex: 1,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtonActive: {
        backgroundColor: '#1E40AF',
        borderColor: '#1E40AF',
        shadowColor: '#1E40AF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6B7280',
        marginTop: 4,
        textTransform: 'uppercase',
    },
    sosButton: {
        width: '100%',
        backgroundColor: '#DC2626',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        marginTop: 16,
        shadowColor: '#DC2626',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 5,
    },
    sosIcon: {
        marginRight: 12,
    },
    sosButtonText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 18,
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});

export default ResponseScreen;
```