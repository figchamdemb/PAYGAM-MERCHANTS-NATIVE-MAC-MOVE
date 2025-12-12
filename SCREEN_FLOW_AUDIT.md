# GambiaGuard / eGov Gambia - React Native Screen Flow Audit

## Overview
This document provides a comprehensive audit comparing the **React Native CLI app** (`citizen-react-cli`) with the **Next.js reference app** (`EGOVE-CITIZEN-APP-NEXTJS`). It covers:
- Screen alignment between both apps
- Input field types and validation requirements
- Button behaviors and navigation flows
- Issues found and fixes needed

---

## 1. PROJECT STRUCTURE COMPARISON

### React Native App (`citizen-react-cli`)
```
src/
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx           ✅ Exists
│   │   ├── SignupScreen.tsx          ✅ Exists
│   │   ├── OTPVerificationScreen.tsx ✅ Exists
│   │   ├── RegistrationStatusScreen.tsx ✅ Exists
│   │   ├── ForgotPasswordScreen.tsx  ✅ Exists
│   │   ├── ResetPasswordScreen.tsx   ✅ Exists
│   │   ├── SignupStep2Screen.tsx     ✅ Exists
│   │   ├── SignupStep3Screen.tsx     ✅ Exists
│   │   ├── SignupStep4Screen.tsx     ✅ Exists
│   │   └── RegistrationCompleteScreen.tsx ✅ Exists
│   ├── dashboard/
│   │   └── DashboardScreen.tsx       ✅ Exists
│   ├── emergency/
│   │   ├── EmergencyContactsScreen.tsx   ✅ Exists
│   │   ├── EmergencyCountdownScreen.tsx  ✅ Exists
│   │   ├── EmergencyReportScreen.tsx     ✅ Exists
│   │   ├── EmergencyServiceScreen.tsx    ✅ Exists
│   │   └── SOSActiveScreen.tsx           ✅ Exists
│   ├── nearby/                       (Services screens)
│   ├── reports/                      (Case reports screens)
│   └── (other feature screens)
├── navigation/
│   ├── AppNavigator.tsx              ✅ Root navigator
│   ├── AuthStack.tsx                 ✅ Auth flow
│   ├── MainDrawer.tsx                ✅ Drawer navigation
│   └── TabNavigator.tsx              ✅ Bottom tabs
└── config/
    └── colors.ts                     ✅ Theme colors
```

### Next.js App (`EGOVE-CITIZEN-APP-NEXTJS`)
```
app/
├── login/page.tsx                    ✅ Login with OTP verification
├── signup/page.tsx                   ✅ Multi-step signup (2878 lines!)
├── dashboard/                        ✅ Main dashboard
├── emergency/                        ✅ Emergency features
├── emergency-contacts/               ✅ Emergency contacts
├── nearby/                           ✅ Nearby services
├── nearby-help/                      ✅ Nearby help
├── reports/                          ✅ Case reports
├── profile/                          ✅ User profile
├── services/                         ✅ Services listing
└── (other feature routes)
```

---

## 2. AUTHENTICATION FLOW COMPARISON

### 2.1 Login Screen

| Aspect | Next.js Reference | React Native Current | Status |
|--------|-------------------|---------------------|--------|
| Phone Input | `type="tel"` with country code | `keyboardType="numeric"` ✅ | ✅ Match |
| Password Input | `type="password"` with toggle | Not on login (uses OTP) | ℹ️ Different flow |
| OTP Modal | Popup 6-digit modal | Navigates to OTP screen | ℹ️ Different UX |
| Login Button | Calls `/api/auth/login` | `handleSendOTP()` → navigates | ✅ Has handler |
| Create Account | Links to `/signup` | Navigates to `Signup` screen | ✅ Has handler |
| Forgot Password | Links to `/forgot-password` | Navigates to `ForgotPassword` | ✅ Has handler |

**React Native Login Inputs:**
```tsx
// LoginScreen.tsx - Line 106-115
<TextInput
  style={styles.input}
  placeholder="712 3456"
  placeholderTextColor="#9CA3AF"
  keyboardType="numeric"     // ✅ Correct for phone
  value={phoneNumber}
  onChangeText={setPhoneNumber}
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
/>
```

**Issues Found:**
1. ❌ Phone input may crash when focused - need to verify TextInput behavior
2. ✅ Country code selector is TouchableOpacity (line 88)
3. ✅ Send OTP button has `handleSendOTP` handler (line 126)
4. ✅ Create Account button has `handleRegister` handler (line 133)

---

### 2.2 OTP Verification Screen

| Aspect | Next.js Reference | React Native Current | Status |
|--------|-------------------|---------------------|--------|
| OTP Input | 6 individual inputs with refs | 6 TextInputs with refs ✅ | ✅ Match |
| Auto-advance | Yes, on keypress | Yes, `handleOtpChange` | ✅ Match |
| Backspace handling | Yes | Yes, `handleKeyPress` | ✅ Match |
| Timer | Countdown to resend | 45 second timer | ✅ Match |
| Verify Button | Submits OTP to Firebase | `handleVerify()` → navigates | ⚠️ UI only |

**React Native OTP Flow:**
```tsx
// OTPVerificationScreen.tsx - Line 33-44
const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
        inputRefs.current[index + 1]?.focus();  // ✅ Auto-advance
    }
};

const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();  // ✅ Backspace handling
    }
};
```

**Issues Found:**
1. ⚠️ OTP inputs need `keyboardType="number-pad"` for proper keyboard
2. ⚠️ Verify only logs and navigates, no actual verification
3. ✅ Timer countdown works correctly

---

### 2.3 Signup Screen (Create Account)

| Step | Next.js Reference | React Native Current | Status |
|------|-------------------|---------------------|--------|
| Step 1 - Account | firstName, lastName, username, phone, email, password | ✅ All fields exist | ✅ Match |
| Step 2 - OTP | Firebase OTP verification | ⚠️ Separate screen | Different flow |
| Step 3 - Personal | DOB, nationalId, tinNumber, occupation | ⚠️ SignupStep2Screen | Check if exists |
| Step 4 - Profile | nextOfKin, employer, etc. | ⚠️ SignupStep3Screen | Check if exists |
| Step 5 - Address | GPS, photos, address fields | ⚠️ SignupStep4Screen | Check if exists |

**React Native Signup Inputs (SignupScreen.tsx):**

| Field | Input Type | Keyboard Type | Status |
|-------|-----------|---------------|--------|
| First Name | TextInput | default | ✅ OK |
| Last Name | TextInput | default | ✅ OK |
| Username | TextInput | default | ✅ OK |
| Phone | TextInput (readonly) | - | ✅ OK |
| Email | TextInput | `keyboardType="email-address"` ✅ | ✅ OK |
| Password | TextInput | `secureTextEntry={!showPassword}` ✅ | ✅ OK |

**Issues Found:**
1. ✅ All input fields have correct keyboard types
2. ✅ Password toggle works (`showPassword` state)
3. ✅ Create Account button has `handleCreateAccount` handler
4. ⚠️ Currently just navigates to Login instead of completing signup

---

## 3. DASHBOARD SCREEN

| Component | Next.js Reference | React Native Current | Status |
|-----------|-------------------|---------------------|--------|
| Header with Menu | Drawer toggle + notifications | ✅ Menu icon + Bell icon | ✅ Match |
| User Greeting | "Good Morning, [Name]" | ✅ "Good Afternoon, Fatou Ceesay" | ✅ Match |
| Location Card | MapView + address | ✅ Map image + address | ✅ Match |
| Share Location | Button with icon | ✅ TouchableOpacity | ✅ Has handler needed |
| SOS Alert | Large red button | ✅ Large red button | ✅ Has handler |
| Quick Actions Grid | Emergency services | ✅ Emergency grid | ✅ Match |
| Bottom Navigation | Home/Reports/Profile | ✅ TabNavigator | ✅ Match |

**Button Handlers in DashboardScreen.tsx:**
```tsx
// Line 48-50
const handleSOSPress = () => {
    navigation.navigate('EmergencyCountdown');
};
```

**Issues Found:**
1. ⚠️ Menu icon (`MenuIcon`) button has no `onPress` handler for drawer
2. ⚠️ Bell icon button has no `onPress` handler for notifications
3. ⚠️ Share Location button has no `onPress` handler
4. ⚠️ SOS button has no `onPress` connected (handler exists but not linked)

---

## 4. INPUT FIELD REQUIREMENTS BY SCREEN

### 4.1 Login Screen
| Field | Type | keyboardType | Required Props |
|-------|------|--------------|----------------|
| Phone Number | TextInput | `numeric` or `phone-pad` | maxLength={7} |

### 4.2 OTP Screen  
| Field | Type | keyboardType | Required Props |
|-------|------|--------------|----------------|
| OTP Digit 1-6 | TextInput | `number-pad` | maxLength={1}, selectTextOnFocus |

### 4.3 Signup Screen
| Field | Type | keyboardType | Required Props |
|-------|------|--------------|----------------|
| First Name | TextInput | `default` | autoCapitalize="words" |
| Last Name | TextInput | `default` | autoCapitalize="words" |
| Username | TextInput | `default` | autoCapitalize="none" |
| Email | TextInput | `email-address` | autoCapitalize="none" |
| Password | TextInput | `default` | secureTextEntry, minLength validation |

### 4.4 Personal Info (Step 2)
| Field | Type | keyboardType | Required Props |
|-------|------|--------------|----------------|
| Date of Birth | DatePicker or TextInput | - | Date format validation |
| National ID | TextInput | `default` | Pattern validation |
| TIN Number | TextInput | `numeric` | - |
| Occupation | TextInput or Picker | `default` | - |

### 4.5 Profile (Step 3)
| Field | Type | keyboardType | Required Props |
|-------|------|--------------|----------------|
| Next of Kin Phone | TextInput | `phone-pad` | +220 prefix |
| Next of Kin Email | TextInput | `email-address` | Email validation |
| Employer Name | TextInput | `default` | - |

### 4.6 Address (Step 4)
| Field | Type | keyboardType | Required Props |
|-------|------|--------------|----------------|
| Full Address | TextInput (multiline) | `default` | multiline={true} |
| Region | Picker/Dropdown | - | Gambia regions list |
| District | Picker/Dropdown | - | District list |
| GPS | Auto-captured | - | Geolocation API |

---

## 5. BUTTON NAVIGATION FLOWS

### 5.1 Auth Flow
```
┌─────────────────┐
│  SplashScreen   │
└────────┬────────┘
         │ (3s delay)
         ▼
┌─────────────────┐     "Create Account"    ┌─────────────────┐
│   LoginScreen   │ ──────────────────────► │  SignupScreen   │
│                 │                          │   (Step 1)      │
│  [Send OTP] ────┼──────────────────────►  └────────┬────────┘
└────────┬────────┘                                   │
         │                                            │ "Create Account"
         │ navigates                                  ▼
         ▼                                   ┌─────────────────┐
┌─────────────────┐                          │  OTP/Step2/...  │
│ OTPVerification │                          └────────┬────────┘
│                 │                                   │
│   [Verify] ─────┼──────────────────────────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ RegistrationStatus  │
│   (shows progress)  │
│                     │
│ [Resume] ───────────┼─► Next incomplete step
└─────────┬───────────┘
          │ (if complete)
          ▼
┌─────────────────┐
│   Dashboard     │
│   (MainDrawer)  │
└─────────────────┘
```

### 5.2 Dashboard Navigation
```
┌────────────────────────────────────────────────────┐
│                    Dashboard                        │
├────────────────────────────────────────────────────┤
│  [☰ Menu]  →  Opens Drawer (Profile, Settings...)  │
│  [🔔 Bell]  →  NotificationsScreen                 │
│  [Share Location]  →  ShareLocationModal           │
│  [SOS ALERT]  →  EmergencyCountdownScreen          │
├────────────────────────────────────────────────────┤
│  Quick Actions:                                     │
│  [Police]  →  PoliceNonEmergencyScreen             │
│  [Ambulance]  →  AmbulanceNonEmergencyScreen       │
│  [Fire]  →  FireEmergencyAlertScreen               │
└────────────────────────────────────────────────────┘
```

---

## 6. ISSUES AND FIXES NEEDED

### 6.1 Critical Issues (Causing Crashes)

| Issue | File | Line | Fix Required |
|-------|------|------|--------------|
| ❌ TextInput crashes | All screens | Various | Check for native module conflicts |
| ❌ Button crashes | All screens | Various | Verify TouchableOpacity handlers |

### 6.2 Missing Handlers (Navigation Won't Work)

| Screen | Button | Missing Handler | Fix |
|--------|--------|-----------------|-----|
| DashboardScreen | Menu Icon | No drawer toggle | Add `navigation.openDrawer()` |
| DashboardScreen | Bell Icon | No handler | Add `navigation.navigate('Notifications')` |
| DashboardScreen | Share Location | No handler | Add share modal or navigation |
| DashboardScreen | SOS Button | Handler not connected | Connect `handleSOSPress` to button |
| DashboardScreen | Quick Actions | No handlers | Add navigation to each service |

### 6.3 Input Field Fixes Needed

| Screen | Field | Current | Fix Needed |
|--------|-------|---------|------------|
| OTPVerification | OTP inputs | No keyboardType | Add `keyboardType="number-pad"` |
| OTPVerification | OTP inputs | No maxLength | Add `maxLength={1}` |
| LoginScreen | Phone | `numeric` | Consider `phone-pad` for better UX |
| SignupScreen | Username | Missing autoCapitalize | Add `autoCapitalize="none"` |

### 6.4 Validation Missing

| Screen | Field | Validation Needed |
|--------|-------|-------------------|
| LoginScreen | Phone | Must be 7 digits |
| SignupScreen | Email | Email format regex |
| SignupScreen | Password | Min 8 chars, number, symbol |
| SignupScreen | Username | No special characters |

---

## 7. SCREEN-BY-SCREEN FIX CHECKLIST

### LoginScreen.tsx
- [ ] Verify TextInput works without crash
- [ ] Add `maxLength={7}` to phone input
- [ ] Verify Send OTP button triggers `handleSendOTP`
- [ ] Verify Create Account navigates to Signup
- [ ] Verify Forgot Password navigates correctly

### OTPVerificationScreen.tsx
- [ ] Add `keyboardType="number-pad"` to all OTP inputs
- [ ] Add `maxLength={1}` to all OTP inputs
- [ ] Verify auto-advance on input
- [ ] Verify backspace goes to previous field
- [ ] Add actual OTP verification logic (or mock for now)

### SignupScreen.tsx
- [ ] Verify all TextInputs work without crash
- [ ] Add input validation for email format
- [ ] Add password strength validation
- [ ] Verify password toggle works
- [ ] Connect Create Account to next step (not Login)

### DashboardScreen.tsx
- [ ] Connect Menu icon to `navigation.openDrawer()`
- [ ] Connect Bell icon to `navigation.navigate('Notifications')`
- [ ] Connect Share Location button to modal/screen
- [ ] Connect SOS button to `handleSOSPress`
- [ ] Add handlers for all Quick Action buttons

---

## 8. NAVIGATION CONFIGURATION

### AuthStack.tsx (Already Correct)
```tsx
<Stack.Navigator initialRouteName="Splash">
  <Stack.Screen name="Splash" component={SplashScreen} />
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="Signup" component={SignupScreen} />
  <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
  <Stack.Screen name="RegistrationStatus" component={RegistrationStatusScreen} />
  <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
</Stack.Navigator>
```

### MainDrawer.tsx Screens Available
- Home (TabNavigator)
- Profile
- Notifications
- Help
- QA
- Tracking
- License
- BloodDonation
- NAWECServices
- NAWECSubmitReading
- NAWECPayment
- ReportNewCase
- CaseReports
- PoliceNonEmergency
- AmbulanceNonEmergency
- NonEmergencyContact
- NAWECApplication

---

## 9. RECOMMENDED FIX ORDER

1. **First Pass: Verify Basic Inputs Work**
   - Test each TextInput on Login screen
   - Test each TextInput on Signup screen
   - Identify which specific component causes crash

2. **Second Pass: Fix Keyboard Types**
   - Update all phone inputs to `phone-pad`
   - Update all OTP inputs to `number-pad` with `maxLength={1}`
   - Update all email inputs with `email-address`

3. **Third Pass: Connect All Buttons**
   - Add missing `onPress` handlers
   - Verify navigation works for each button
   - Test back navigation

4. **Fourth Pass: Add Validation**
   - Phone number validation (7 digits)
   - Email format validation
   - Password strength validation

5. **Fifth Pass: Test Full Flows**
   - Complete login flow
   - Complete signup flow (all steps)
   - Test dashboard navigation
   - Test emergency features

---

## 10. NEXT STEPS

After this audit, the immediate priority should be:

1. **Debug the crash** - Find which component/handler is causing the crash on input interaction
2. **Fix one screen at a time** - Start with LoginScreen, ensure it works completely
3. **Test incrementally** - Build APK after each screen fix to verify
4. **Connect navigation** - Once inputs work, connect all button handlers

---

## 11. DETAILED FIX PLAN

### PHASE 1: Fix Dashboard Button Handlers (Critical)

The DashboardScreen.tsx has many TouchableOpacity buttons WITHOUT `onPress` handlers. This needs to be fixed:

**Buttons Missing `onPress`:**
1. Menu Icon (line ~126) - needs `navigation.openDrawer()`
2. Bell Icon (line ~131) - needs `navigation.navigate('Notifications')`  
3. Share Location button (line ~186) - needs handler or navigation
4. SOS Alert button (line ~193) - has `handleSOSPress` function but NOT connected
5. Police grid item (line ~205) - needs navigation
6. Ambulance grid item (line ~212) - needs navigation
7. Fire grid item (line ~219) - needs navigation
8. Police Non-Urg (line ~258) - needs navigation
9. Fire Non-Urg (line ~266) - needs navigation
10. Medic Non-Urg (line ~274) - needs navigation
11. FAB center button (line ~328) - needs handler

### PHASE 2: Test and Verify Input Fields

All TextInput fields appear correctly configured:
- LoginScreen: `keyboardType="numeric"` ✅
- OTPVerification: `keyboardType="numeric"`, `maxLength={1}` ✅
- SignupScreen: Various keyboard types ✅

**Potential crash causes to investigate:**
1. GestureHandlerRootView wrapping issue
2. react-native-screens interaction with TextInput
3. Navigation state when pressing inputs

### PHASE 3: Complete Auth Navigation Flow

Current auth flow works but needs completion:
```
Splash → Login → [Send OTP] → OTPVerification → [Verify] → RegistrationStatus
                     ↓
               [Create Account] → Signup → [Create] → (should go to next steps, not Login)
```

**Fix Needed in SignupScreen.tsx:**
- Change `handleCreateAccount` to navigate to Step 2, not back to Login

---

## 12. SUMMARY

### Working ✅
- App builds and runs
- Screens display correctly
- Navigation structure is proper
- Input field configurations are correct
- Redux store with persist is set up

### Needs Fixing ⚠️
- Dashboard buttons missing onPress handlers
- Signup flow goes back to Login instead of forward
- Bottom navigation only changes local state, doesn't navigate

### To Investigate 🔍
- Why inputs/buttons crash on interaction
- Check for native module conflicts
- Verify GestureHandler setup

---

*Document created: Screen Flow Audit for GambiaGuard React Native App*
*Reference: Next.js app at EGOVE-CITIZEN-APP-NEXTJS*
*Target: citizen-react-cli React Native app*
*Date: Generated during development session*
