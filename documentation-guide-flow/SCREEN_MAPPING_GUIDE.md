# 🗺️ Sentinel Patrol Screen Mapping Guide

## Purpose
This document provides a **comprehensive mapping** from the existing Citizen App screens to the new Sentinel Patrol screens. It serves as the **single source of truth** for the AI agent and developers to understand which existing screens should be transformed into which patrol screens.

---

## 📋 Quick Reference: Sentinel Patrol 12 Screens

| Screen # | Patrol Screen Name | Category | Purpose |
|----------|-------------------|----------|---------|
| 1 | **LoginScreen** | Auth | Secure officer login (Badge ID, Password, MFA, Biometric) |
| 2 | **MapScreen/DashboardScreen** | Main | Command center with map, incidents, tasks, officer status |
| 3 | **ResponseScreen** | Flow | Emergency response mode (navigation, status updates, SOS) |
| 4 | **TrafficOpsScreen** | Main | Traffic operations, ANPR, plate/license lookup |
| 5 | **IssueTicketScreen** | Flow | E-Ticket issuance with violation details, payment, QR |
| 6 | **ReportSuiteScreen** | Main | Incident reporting with stepper form, drafts, history |
| 7 | **TeamCommsScreen** | Main | Team grid, squad status, radio/chat communications |
| 8 | **AdminMenuScreen** | Main | Station admin dashboard with tiles and badges |
| 9 | **ImmigrationScannerScreen** | Flow | QR/Passport scanner, biometric verification |
| 10 | **ProfileScreen** | Settings | Officer profile, digital ID badge, duty roster, stats |
| 11 | **DatabaseSearchScreen** | Flow | Global search for persons, vehicles, cases, BOLO |
| 12 | **SuccessScreen** | Flow | Universal transaction success confirmation |

---

## 🔄 Complete Screen Mapping Matrix

### Current Citizen App Structure
```
src/screens/
├── auth/                          # 10 screens
│   ├── LoginScreen.tsx
│   ├── SignupScreen.tsx
│   ├── SignupStep2Screen.tsx
│   ├── SignupStep3Screen.tsx
│   ├── SignupStep4Screen.tsx
│   ├── OTPVerificationScreen.tsx
│   ├── ForgotPasswordScreen.tsx
│   ├── ResetPasswordScreen.tsx
│   ├── RegistrationStatusScreen.tsx
│   └── RegistrationCompleteScreen.tsx
├── dashboard/
│   └── DashboardScreen.tsx
├── emergency/                     # 9 screens
│   ├── PoliceEmergencyScreen.tsx
│   ├── FireEmergencyScreen.tsx
│   ├── AmbulanceEmergencyScreen.tsx
│   ├── EmergencyContactsScreen.tsx
│   ├── EmergencyCountdownScreen.tsx
│   ├── EmergencyReportScreen.tsx
│   ├── EmergencyServiceScreen.tsx
│   ├── EmergencyTrackingScreen.tsx
│   └── SOSActiveScreen.tsx
├── nearby/                        # 6 screens
├── digital/                       # 11 screens
├── reports/                       # 2 screens
├── jobs/                          # 6 screens
└── (root level screens)           # 28 screens
```

---

## 🎯 Detailed Mapping: Citizen App → Sentinel Patrol

### Screen 1: LoginScreen (Auth)

| Aspect | Current (Citizen) | New (Patrol) |
|--------|-------------------|--------------|
| **File Path** | `screens/auth/LoginScreen.tsx` | `features/auth/screens/LoginScreen.tsx` |
| **Primary Input** | Phone Number | Badge Number |
| **Auth Method** | OTP via SMS | Password + MFA + Biometric |
| **After Success** | → Dashboard | → SelectAgencyScreen → MapScreen |

**What to Keep:**
- ✅ TextInput styling and structure
- ✅ Background image/overlay pattern
- ✅ Icon imports and styling
- ✅ Basic form validation logic

**What to Change:**
- 🔄 Replace phone input with Badge ID input
- 🔄 Add password field with secureTextEntry
- 🔄 Add role/agency selector (Police/Fire/Ambulance/Immigration)
- 🔄 Add MFA modal component
- 🔄 Add biometric login button
- 🔄 Change branding from "Gambia Citizen" to "Sentinel Patrol"
- 🔄 Update color theme to `#1E40AF` (Primary Blue)

**Files to Reference for UI Pattern:**
- `screens/auth/SignupScreen.tsx` - Multi-field form layout
- `screens/auth/OTPVerificationScreen.tsx` - Modal/verification UI

---

### Screen 2: MapScreen/DashboardScreen (Main)

| Aspect | Current (Citizen) | New (Patrol) |
|--------|-------------------|--------------|
| **File Path** | `screens/dashboard/DashboardScreen.tsx` | `features/patrol/screens/MapScreen.tsx` |
| **Map Display** | User location + nearby services | Officer location + incidents + other units |
| **Primary Action** | SOS Alert | Accept Task / View Incidents |
| **Bottom Section** | Quick action cards | Draggable bottom sheet with task list |

**What to Keep:**
- ✅ Map integration and geolocation hooks
- ✅ SafeAreaView structure
- ✅ Location permission handling
- ✅ Basic card/tile styling

**What to Change:**
- 🔄 Replace citizen dashboard with command map
- 🔄 Add officer status toggle (Online/Busy/Offline)
- 🔄 Add incident markers with priority colors
- 🔄 Add draggable bottom sheet with tabs ("Current Task" / "Next Jobs")
- 🔄 Remove citizen-specific quick actions
- 🔄 Add task acceptance flow

**Files to Reference:**
- `screens/emergency/EmergencyTrackingScreen.tsx` - Map with markers
- `screens/NearbyServicesMapScreen.tsx` - Map implementation

---

### Screen 3: ResponseScreen (Flow)

| Aspect | Current (Citizen) | New (Patrol) |
|--------|-------------------|--------------|
| **Base Screen** | `screens/emergency/PoliceEmergencyScreen.tsx` | `features/patrol/screens/ResponseScreen.tsx` |
| **Map Mode** | Full-screen emergency tracking | Full-screen navigation to incident |
| **Status Flow** | Report progress | EN_ROUTE → ON_SCENE → COMPLETED |
| **SOS Feature** | Request help | Request Backup |

**What to Keep:**
- ✅ Full-screen map layout
- ✅ MapView with Polyline/route
- ✅ Marker components
- ✅ SafeAreaView overlay pattern

**What to Change:**
- 🔄 Add navigation strip at top (turn-by-turn)
- 🔄 Add incident info overlay card
- 🔄 Add status progression buttons (On Scene / Completed)
- 🔄 Add "Request Backup" SOS button
- 🔄 Add ETA and distance display

**Files to Reference:**
- `screens/emergency/EmergencyTrackingScreen.tsx` - Route tracking
- `screens/emergency/SOSActiveScreen.tsx` - Emergency overlay UI

---

### Screen 4: TrafficOpsScreen (Main)

| Aspect | Current (Citizen) | New (Patrol) |
|--------|-------------------|--------------|
| **Base Concept** | Document scanning (digital) | Vehicle/License plate lookup |
| **Input Methods** | Manual entry | Camera (ANPR) + Manual entry |
| **Result Display** | Document details | Vehicle/Driver status card (Red/Green) |

**What to Keep:**
- ✅ Camera integration pattern
- ✅ Manual input form structure
- ✅ Card/result display styling

**What to Change:**
- 🔄 Add camera viewfinder for ANPR
- 🔄 Add segmented control (Plate / License tabs)
- 🔄 Add vehicle/driver result card with status colors
- 🔄 Add "Issue Ticket" action button
- 🔄 Add stolen/warrant alert indicators

**Files to Reference:**
- `screens/digital/QRInspectionScreen.tsx` - Scanner UI
- `screens/digital/DigitalLicenseScreen.tsx` - Document display

---

### Screen 5: IssueTicketScreen (Flow)

| Aspect | Current (Citizen) | New (Patrol) |
|--------|-------------------|--------------|
| **Base Pattern** | Form submission screens | E-Ticket issuance form |
| **Form Fields** | Basic info | Violation, Vehicle, Driver, Fine, Payment |
| **Completion** | Success confirmation | QR ticket + Print/Email options |

**What to Keep:**
- ✅ Multi-field form layout
- ✅ Picker/dropdown components
- ✅ Image picker integration
- ✅ Form validation patterns

**What to Change:**
- 🔄 Add violation type selector
- 🔄 Add fine calculation display
- 🔄 Add evidence photo upload
- 🔄 Add QR code generation
- 🔄 Add cash receipt modal
- 🔄 Add print/email actions

**Files to Reference:**
- `screens/emergency/EmergencyReportScreen.tsx` - Multi-step form
- `screens/NAWECSubmitReadingScreen.tsx` - Form with calculations

---

### Screen 6: ReportSuiteScreen (Main)

| Aspect | Current (Citizen) | New (Patrol) |
|--------|-------------------|--------------|
| **Base Pattern** | Report submission | Incident documentation suite |
| **Structure** | Single form | Tabbed interface (Drafts/New/History) |
| **Form Flow** | Basic | Step-by-step stepper |

**What to Keep:**
- ✅ Form input components
- ✅ File/photo upload logic
- ✅ Multi-step form patterns
- ✅ Draft saving logic

**What to Change:**
- 🔄 Add tab navigation (Drafts/New Report/History)
- 🔄 Add visual stepper component
- 🔄 Add collapsible form sections
- 🔄 Add evidence management section
- 🔄 Add persons involved section

**Files to Reference:**
- `screens/reports/NewReportScreen.tsx` - Report creation
- `screens/auth/SignupStep*.tsx` - Multi-step pattern

---

### Screen 7: TeamCommsScreen (Main)

| Aspect | Current (Citizen) | New (Patrol) |
|--------|-------------------|--------------|
| **Base Concept** | Emergency contacts | Team coordination hub |
| **Display** | Contact list | Squad status grid |
| **Communication** | Call/message links | PTT radio + Chat channel |

**What to Keep:**
- ✅ Contact card styling
- ✅ FlatList grid layout
- ✅ Modal overlay patterns

**What to Change:**
- 🔄 Add squad status cards (online/offline/busy)
- 🔄 Add status color indicators
- 🔄 Add channel chat section
- 🔄 Add PTT (Push-to-Talk) button
- 🔄 Add direct comms modal on officer tap

**Files to Reference:**
- `screens/emergency/EmergencyContactsScreen.tsx` - Contact grid
- `screens/emergency/EmergencyServiceScreen.tsx` - Service cards

---

### Screen 8: AdminMenuScreen (Main)

| Aspect | Current (Citizen) | New (Patrol) |
|--------|-------------------|--------------|
| **Base Pattern** | Services/Menu screens | Admin dashboard |
| **Display** | Service listing | Grid of admin tiles with badges |
| **Navigation** | Deep links to features | Navigate to admin sub-screens |

**What to Keep:**
- ✅ Grid tile layout
- ✅ Icon + title pattern
- ✅ TouchableOpacity navigation

**What to Change:**
- 🔄 Add admin function tiles (Equipment, Training, Roster, etc.)
- 🔄 Add notification badges on tiles
- 🔄 Add pending approvals section
- 🔄 Add station statistics

**Files to Reference:**
- `screens/ServicesScreen.tsx` - Services grid
- `screens/MyServicesScreen.tsx` - Feature tiles

---

### Screen 9: ImmigrationScannerScreen (Flow)

| Aspect | Current (Citizen) | New (Patrol) |
|--------|-------------------|--------------|
| **Base Pattern** | QR scanning | Passport/QR verification |
| **Output** | Document validation | Immigration status card |
| **Verification** | Document authenticity | Biometric + database check |

**What to Keep:**
- ✅ Camera/scanner integration
- ✅ Result card display
- ✅ Manual entry toggle

**What to Change:**
- 🔄 Add passport scanning mode
- 🔄 Add digital passport result card
- 🔄 Add biometric verify button
- 🔄 Add immigration status indicators
- 🔄 Add permit validity display

**Files to Reference:**
- `screens/digital/QRInspectionScreen.tsx` - QR scanner
- `screens/digital/DigitalAddressScreen.tsx` - Document display

---

### Screen 10: ProfileScreen (Settings)

| Aspect | Current (Citizen) | New (Patrol) |
|--------|-------------------|--------------|
| **File Path** | `screens/ProfileScreen.tsx` | `features/profile/screens/ProfileScreen.tsx` |
| **Content** | Citizen profile | Officer digital ID + roster + stats |
| **Display** | Basic info card | Badge-style ID card |

**What to Keep:**
- ✅ Profile layout structure
- ✅ Image display
- ✅ ScrollView organization
- ✅ Settings navigation

**What to Change:**
- 🔄 Convert to digital badge ID card design
- 🔄 Add duty roster calendar strip
- 🔄 Add performance statistics section
- 🔄 Add certifications list
- 🔄 Add shift information

**Files to Reference:**
- `screens/ProfileScreen.tsx` - Profile structure
- `screens/ScheduleScreen.tsx` - Calendar/schedule

---

### Screen 11: DatabaseSearchScreen (Flow)

| Aspect | Current (Citizen) | New (Patrol) |
|--------|-------------------|--------------|
| **Base Concept** | Service search | Law enforcement database search |
| **Scope** | Services/locations | Persons, Vehicles, Cases, BOLO |
| **Results** | Service listings | Criminal/vehicle records |

**What to Keep:**
- ✅ Search input styling
- ✅ Filter chips/buttons
- ✅ Result list layout

**What to Change:**
- 🔄 Add scope filter chips (Person/Vehicle/Case #)
- 🔄 Add recent searches section
- 🔄 Add BOLO (Be On Lookout) priority list
- 🔄 Add result detail cards

**Files to Reference:**
- `screens/NearbyServicesScreen.tsx` - Search with filters
- `screens/HelpScreen.tsx` - Search interface

---

### Screen 12: SuccessScreen (Flow)

| Aspect | Current (Citizen) | New (Patrol) |
|--------|-------------------|--------------|
| **Base Pattern** | Action completion | Transaction success confirmation |
| **Display** | Success message | Success icon + transaction summary |
| **Actions** | Back to home | Print / Email / Return to Patrol |

**What to Keep:**
- ✅ Centered success layout
- ✅ Animation/icon display
- ✅ Action buttons

**What to Change:**
- 🔄 Add transaction summary card
- 🔄 Add print receipt action
- 🔄 Add email confirmation action
- 🔄 Add "Return to Patrol" navigation

**Files to Reference:**
- `screens/ActionSuccessScreen.tsx` - Success screen
- `screens/auth/RegistrationCompleteScreen.tsx` - Completion screen

---

## 📁 Target Feature-Based Structure

After transformation, the structure should look like:

```
src/
├── features/
│   ├── auth/
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx          # Screen 1
│   │   │   └── SelectAgencyScreen.tsx   # NEW
│   │   ├── components/
│   │   │   └── MfaModal.tsx
│   │   └── hooks/
│   │       └── useAuth.ts
│   │
│   ├── patrol/
│   │   ├── screens/
│   │   │   ├── MapScreen.tsx            # Screen 2
│   │   │   ├── ResponseScreen.tsx       # Screen 3
│   │   │   ├── TrafficOpsScreen.tsx     # Screen 4
│   │   │   ├── IssueTicketScreen.tsx    # Screen 5
│   │   │   ├── ReportSuiteScreen.tsx    # Screen 6
│   │   │   └── SuccessScreen.tsx        # Screen 12
│   │   └── components/
│   │       ├── BottomSheet.tsx
│   │       ├── TaskList.tsx
│   │       └── IncidentCard.tsx
│   │
│   ├── team/
│   │   ├── screens/
│   │   │   └── TeamCommsScreen.tsx      # Screen 7
│   │   └── components/
│   │       ├── SquadGrid.tsx
│   │       └── ChannelChat.tsx
│   │
│   ├── admin/
│   │   └── screens/
│   │       └── AdminMenuScreen.tsx      # Screen 8
│   │
│   ├── immigration/
│   │   └── screens/
│   │       └── ImmigrationScannerScreen.tsx # Screen 9
│   │
│   ├── profile/
│   │   └── screens/
│   │       └── ProfileScreen.tsx        # Screen 10
│   │
│   └── search/
│       └── screens/
│           └── DatabaseSearchScreen.tsx # Screen 11
│
├── shared/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── TextInput.tsx
│   ├── hooks/
│   │   ├── useGeolocation.ts
│   │   └── useCamera.ts
│   └── theme/
│       └── colors.ts
│
└── navigation/
    ├── RootNavigator.tsx
    ├── AuthNavigator.tsx
    ├── MainTabNavigator.tsx
    └── PatrolStackNavigator.tsx
```

---

## 🧭 Navigation Mapping

### Main Tab Navigator (Bottom Tabs)

| Tab | Icon | Screen | Notes |
|-----|------|--------|-------|
| 1 | `map-marked-alt` | MapScreen | Home/Dashboard |
| 2 | `car` | TrafficOpsScreen | Traffic operations |
| 3 | `file-alt` | ReportSuiteScreen | Incident reporting |
| 4 | `users` | TeamCommsScreen | Team communications |
| 5 | `user` | ProfileScreen | Officer profile |

### Stack Flows (Modal/Push)

| From | Action | To |
|------|--------|-----|
| MapScreen | Accept Task | ResponseScreen |
| TrafficOpsScreen | Issue Ticket | IssueTicketScreen |
| IssueTicketScreen | Complete | SuccessScreen |
| ReportSuiteScreen | Submit | SuccessScreen |
| ProfileScreen | Admin Menu | AdminMenuScreen |
| ProfileScreen | Immigration | ImmigrationScannerScreen |
| ProfileScreen | Database | DatabaseSearchScreen |

---

## 🏷️ Screens to DELETE (Citizen-Specific)

These screens are citizen-specific and should be removed or archived:

| Screen | Reason |
|--------|--------|
| `SignupScreen.tsx` | Officers are pre-registered, no self-signup |
| `SignupStep2/3/4Screen.tsx` | Part of citizen registration flow |
| `RegistrationStatusScreen.tsx` | Citizen registration tracking |
| `RegistrationCompleteScreen.tsx` | Citizen registration completion |
| `NAWECServicesScreen.tsx` | Citizen utility service |
| `NAWECSubmitReadingScreen.tsx` | Citizen utility reading |
| `NAWECPaymentScreen.tsx` | Citizen utility payment |
| `NAWECApplicationScreen.tsx` | Citizen utility application |
| `BloodDonationScreen.tsx` | Citizen health service |
| `BloodDonationConfirmationScreen.tsx` | Citizen health service |
| `JobBoardScreen.tsx` | Citizen job search |
| `JobApplyScreen.tsx` | Citizen job application |
| `JobDetailsScreen.tsx` | Citizen job details |
| All `Nearby*Screen.tsx` | Citizen location services |

---

## ⚡ Implementation Order

Follow this order for efficient transformation:

1. **Phase 1: Auth & Navigation** (Week 1)
   - LoginScreen (Screen 1)
   - SelectAgencyScreen (NEW)
   - RootNavigator
   - MainTabNavigator

2. **Phase 2: Core Patrol** (Week 1-2)
   - MapScreen (Screen 2)
   - ResponseScreen (Screen 3)

3. **Phase 3: Traffic Enforcement** (Week 2)
   - TrafficOpsScreen (Screen 4)
   - IssueTicketScreen (Screen 5)
   - SuccessScreen (Screen 12)

4. **Phase 4: Reporting & Teams** (Week 3)
   - ReportSuiteScreen (Screen 6)
   - TeamCommsScreen (Screen 7)

5. **Phase 5: Admin & Specialized** (Week 3-4)
   - AdminMenuScreen (Screen 8)
   - ImmigrationScannerScreen (Screen 9)
   - ProfileScreen (Screen 10)
   - DatabaseSearchScreen (Screen 11)

6. **Phase 6: Cleanup** (Week 4)
   - Remove citizen-specific screens
   - Update all imports
   - Final testing

---

## 🎨 Theme Changes

| Aspect | Citizen App | Patrol App |
|--------|-------------|------------|
| Primary Color | Various | `#1E40AF` (Blue) |
| App Name | "Gambia Citizen" | "Sentinel Patrol" |
| Primary User | Citizens | Officers |
| Authentication | Phone + OTP | Badge + Password + MFA |
| Main Action | Report Emergency | Accept Patrol Tasks |

---

## 📝 Summary

This mapping guide provides a clear roadmap for transforming the Gambia Citizen App into the Sentinel Patrol multi-agency app. Key points:

1. **Keep** the existing React Native infrastructure, libraries, and native integrations
2. **Transform** citizen-facing screens into officer-facing patrol screens
3. **Reorganize** into feature-based architecture
4. **Add** multi-agency support (Police, Fire, Ambulance, Immigration)
5. **Remove** citizen-specific features not applicable to patrol operations

The AI agent should follow this guide sequentially, validating each phase before moving to the next.
