# Implementation Guide: PayGam Merchant App (React Native/TypeScript)

## 1. Project Overview

| Attribute | Detail |
| :--- | :--- |
| **App Name** | PayGam Merchant |
| **Purpose** | A mobile application for merchants to manage payments, settlements, and customer accounts across different business types (General, Corporate, Fuel). |
| **Target Platform** | iOS & Android (React Native) |
| **Language** | TypeScript/JavaScript |
| **UI Framework** | React Native (Functional Components + Hooks, `StyleSheet`) |
| **Theme Color** | Primary: `#293454` (Dark Blue) |
| **AI Editor** | GitHub Copilot |

## 2. Tech Stack Setup

We will initialize the project using the React Native CLI to ensure maximum control and performance.

### 2.1 Project Initialization

```bash
# Initialize a new React Native project with TypeScript template
npx react-native init PaygamMerchant --template react-native-template-typescript

# Navigate to project directory
cd PaygamMerchant
```

### 2.2 Required Dependencies

| Category | Dependency | Purpose |
| :--- | :--- | :--- |
| **Navigation** | `react-navigation/native`, `react-navigation/stack`, `react-navigation/bottom-tabs`, `react-navigation/drawer` | Handling complex authentication, tab, and drawer navigation structures. |
| **Styling** | `react-native-safe-area-context` | Managing safe areas on various devices (iOS notch/Android cutouts). |
| **UI/UX** | `@react-native-community/viewpager` (for sliders), `react-native-modal` (for modals) | Implementing the Welcome slider and various filter/currency modals. |
| **Forms** | `react-native-phone-input` (optional, for country code selection) | Handling phone number inputs as specified in the mockups. |
| **State** | `@reduxjs/toolkit`, `react-redux` | Centralized state management for authentication status and user mode (`General`, `Corporate`, `Fuel`). |

```bash
# Install core navigation packages
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs @react-navigation/drawer
npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view

# Install utility packages
npm install react-native-modal @reduxjs/toolkit react-redux

# Install phone input (optional, if needed for complex input)
# npm install react-native-phone-input
```

### 2.3 Directory Structure

```
src/
├── assets/ (Images, icons, fonts)
├── components/
│   ├── common/ (Buttons, Inputs, Headers, Modals)
│   ├── cards/ (BalanceCard, TransactionCard)
├── navigation/
│   ├── AuthStack.tsx
│   ├── GeneralTabs.tsx
│   ├── CorporateTabs.tsx
│   └── AppNavigator.tsx (Main entry point)
├── screens/
│   ├── auth/ (WelcomeFirst, Login, SignUp, Registration...)
│   ├── general/ (Payments, Settlements, AcceptPayments)
│   ├── corporate/ (CorporateHome, TopUpWallet...)
│   ├── flows/ (WalletTransfer, TransactionDetails, SuccessScreen)
│   └── settings/ (Settings, Notifications)
├── state/
│   ├── authSlice.ts
│   └── store.ts
└── App.tsx
```

## 3. Generation Status

| Screen Name | Category | Status | Code Reference |
| :--- | :--- | :--- | :--- |
| `WelcomeFirst` | Auth | ⏳ Pending | N/A |
| `Login` | Auth | ✅ Complete | Section 8, Screen 3 |
| `SignUp` | Auth | ⏳ Pending | N/A |
| `SelectionScreen` | Auth | ✅ Complete | Section 8, Screen 2 |
| `GeneralMerchantRegistration` | Auth | ⏳ Pending | N/A |
| `Payments` | General Main | ✅ Complete | Section 8, Screen 5 |
| `Settlements` | General Main | ✅ Complete | Section 8, Screen 7 |
| `AcceptPayments` | General Main | ✅ Complete | Section 8, Screen 6 |
| `CorporateHome` | Corporate Main | ✅ Complete | Section 8, Screen 10 |
| `WalletTransfer` | Flow | ✅ Complete | Section 8, Screen 8 |
| `TransactionDetails` | Flow | ✅ Complete | Section 8, Screen 9 |
| `Settings` | Settings | ✅ Complete | Section 8, Screen 11 |
| `ActionSuccess` | Flow | ✅ Complete | Section 8, Screen 12 |
| `Notifications` (Empty State) | Flow | ✅ Complete | Section 8, Screen 13 |

## 4. Screen Breakdown

### 4.1 Authentication & Registration Screens

#### 1. WelcomeFirst Screen
**Status:** ⏳ Pending Generation
*   **Purpose:** Introduce the app features via a 3-slide carousel.
*   **User Flow:** Swipe/tap 'Next' to advance. 'Get Started' on the final slide navigates to Login.
*   **Key Components:** `ViewPager` (from `@react-native-community/viewpager`), custom pagination dots, `TouchableOpacity` buttons.
*   **Code Structure:**
    ```typescript
    // src/screens/auth/WelcomeFirst.tsx
    import React, { useState, useRef } from 'react';
    import { View, Text, ImageBackground, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
    // Use a data array for slides (title, description, image)
    const slides = [/* ... */];
    const WelcomeFirst = ({ navigation }) => {
        // ... state and logic for slide index
        const handleGetStarted = () => {
             navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        };
        return (
            <View style={styles.container}>
                {/* ViewPager implementation */}
            </View>
        );
    };
    // ... StyleSheet
    ```

#### 2. Login Screen
**Status:** ✅ Complete
*   **Purpose:** Authenticate the merchant using phone number and password.
*   **User Flow:** Input credentials, tap 'Continue'. Successful login dispatches `setAuth(true)` and navigates to the main app based on stored `userMode`.
*   **Key Components:** `ImageBackground`, custom `TextInput` with icons, `TouchableOpacity` for links.
*   **User Interactions:** Secure text entry for password, country code selector integration.
*   **Code Structure:** (See Reference Code 3 - converted to RN)

#### 3. SignUp Screen
**Status:** ⏳ Pending Generation
*   **Purpose:** Collect phone number to initiate the registration process.
*   **User Flow:** Enter phone number, tap 'Continue' to proceed to `SelectionScreen`.
*   **Key Components:** Similar layout to `Login` but simpler form.
*   **Code Structure:**
    ```typescript
    // src/screens/auth/SignUp.tsx
    const SignUp = ({ navigation }) => {
        const handleContinue = () => {
            // Basic validation
            navigation.navigate('SelectionScreen');
        };
        // ... UI (similar to Login but simpler)
    };
    ```

#### 4. SelectionScreen
**Status:** ✅ Complete
*   **Purpose:** Allow the user to select their merchant type (General, Corporate, Fuel).
*   **User Flow:** Select one radio option, tap 'Continue'. This choice determines the main app structure.
*   **Key Components:** Custom `RadioCard` components, `SafeAreaView`.
*   **Code Structure:** (See Reference Code 2 - converted to RN)

#### 5. GeneralMerchantRegistration
**Status:** ⏳ Pending Generation
*   **Purpose:** Capture full registration details (Name, DOB, Email, Password).
*   **User Flow:** Fill form, use modal date picker for DOB, tap 'Continue' to complete registration and navigate to Login.
*   **Key Components:** `ScrollView`, `TextInput`, `DatePickerModal` (or similar library).
*   **Code Structure:**
    ```typescript
    // src/screens/auth/GeneralMerchantRegistration.tsx
    const GeneralMerchantRegistration = ({ navigation }) => {
        // ... state for form fields
        const handleRegister = () => {
            // Placeholder: Should integrate with API
            navigation.navigate('Login');
        };
        // ... UI with ScrollView and form elements
    };
    ```

### 4.2 General Merchant Main Screens

#### 6. Payments Screen (Dashboard)
**Status:** ✅ Complete
*   **Purpose:** Main dashboard displaying balance and transaction history.
*   **User Flow:** Tap currency selector to open currency modal. Tap filter icon to open filter modal. Tap list item to view `TransactionDetails`.
*   **Key Components:** `BalanceCard` (custom component), `TransactionListItem`, `FilterModal`, `CurrencyModal`.
*   **Code Structure:** (See Reference Code 5 - converted to RN)

#### 7. Settlements Screen
**Status:** ✅ Complete
*   **Purpose:** Manage payouts and view settlement history.
*   **User Flow:** Tap action buttons to initiate transfers (`WalletTransfer`, `SettleToBank`, `Banks`).
*   **Key Components:** `BalanceCard`, `ActionButtons` (Transfer options), `SettlementListItem`.
*   **Code Structure:** (See Reference Code 7 - converted to RN)

#### 8. AcceptPayments Screen
**Status:** ✅ Complete
*   **Purpose:** Generate a dynamic QR code for receiving payments.
*   **User Flow:** Tap 'Specific Amount' to open `SpecifyMoneyModal`. Select currency. Tap share buttons to distribute the QR link/image.
*   **Key Components:** `QRCode` image (static placeholder initially), `CurrencyToggleGroup`, `ShareButton`.
*   **Code Structure:** (See Reference Code 6 - converted to RN)

### 4.3 Corporate Merchant Main Screens

#### 9. CorporateHome Screen
**Status:** ✅ Complete
*   **Purpose:** Corporate dashboard focused on consolidated balance and standing orders.
*   **User Flow:** Select currency to update display. Tap standing order item to navigate to `StandingOrderDetails` (`UserDetails`).
*   **Key Components:** Dark themed `BalanceHeader`, horizontal `CurrencySelector`, `StandingOrderListItem`.
*   **Code Structure:** (See Reference Code 10 - converted to RN)

### 4.4 Flow Screens

#### 10. WalletTransfer
**Status:** ✅ Complete
*   **Purpose:** Screen to initiate fund transfer from merchant account to a linked wallet.
*   **User Flow:** Select currency, input amount, view fees, tap 'Request To Withdraw'.
*   **Key Components:** Custom `WalletCard`, large `TextInput` for amount, `FooterButton`.
*   **Code Structure:** (See Reference Code 8 - converted to RN)

#### 11. Transaction Details
**Status:** ✅ Complete
*   **Purpose:** Show detailed information about a single transaction/receipt.
*   **User Flow:** View details, tap 'Share Receipt' (uses native sharing module).
*   **Key Components:** Custom `ReceiptCard` layout with dashed separator (simulating ticket tear).
*   **Code Structure:** (See Reference Code 9 - converted to RN)

#### 12. ActionSuccess
**Status:** ✅ Complete
*   **Purpose:** Generic success state feedback screen after a transaction (e.g., settlement request).
*   **User Flow:** Tap 'Back to Dashboard' to reset stack to home tab.
*   **Key Components:** Animated success icon (can use Lottie or simple checkmark animation), `PrimaryButton`.
*   **Code Structure:** (See Reference Code 12 - converted to RN)

#### 13. Notifications (Empty State)
**Status:** ✅ Complete
*   **Purpose:** Display notification list or an empty state.
*   **User Flow:** Tap refresh button.
*   **Key Components:** `EmptyStateIllustration`, `PrimaryButton`.
*   **Code Structure:** (See Reference Code 13 - converted to RN)

## 5. Navigation Architecture

We will use `react-navigation` to define the hierarchy:

1.  **Root Switch Navigator:** Determines if the user is authenticated.
    *   `AuthStack` (Unauthenticated)
    *   `AppDrawer` (Authenticated)

2.  **Auth Stack:** Handles introductory and registration flows.
    *   `WelcomeFirst` -> `Login` -> `SignUp` -> `SelectionScreen` -> `RegistrationScreens`

3.  **App Drawer:** Contains user profile and settings links.
    *   `MainTabs` (The core application tabs, which vary by mode)
    *   `SettingsStack` (Settings, Profile, PIN changes)

4.  **Tab Navigation (Dynamic):** The tabs displayed depend on the `userMode` state.

    ```typescript
    // navigation/AppNavigator.tsx
    const AppNavigator = () => {
        const { isAuthenticated, userMode } = useSelector(state => state.auth);

        if (!isAuthenticated) {
            return <AuthStack />;
        }

        // Dynamically choose the Main Tab Navigator
        let MainTabs;
        if (userMode === 'Corporate') {
            MainTabs = CorporateTabs;
        } else if (userMode === 'Fuel') {
            MainTabs = FuelTabs; // Pending implementation
        } else {
            MainTabs = GeneralTabs;
        }

        return (
            <Drawer.Navigator>
                <Drawer.Screen name="Main" component={MainTabs} />
                <Drawer.Screen name="SettingsStack" component={SettingsStack} />
            </Drawer.Navigator>
        );
    };
    ```

## 6. Implementation Guide for GitHub Copilot

As an expert React Native developer, use this detailed plan to guide the implementation.

### 6.1 Using Copilot Chat and Inline Suggestions

1.  **Component Scaffolding:** Use Copilot Chat to generate the initial functional component structure, including imports for `React`, `View`, `Text`, `StyleSheet`, and `useState`.
    *   *Example Prompt:* "Generate a React Native functional component template for the `LoginScreen` that uses `useState` for phone and password, and includes a basic `StyleSheet`."
2.  **StyleSheet Conversion:** When converting HTML mockups (Section 8), use inline suggestions to translate Tailwind-like classes into `StyleSheet.create` objects.
    *   *Example:* Convert `<div class="bg-[#293454] p-6 rounded-2xl shadow-xl">` to:
        ```typescript
        container: {
            backgroundColor: '#293454',
            padding: 24,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 5.46,
            elevation: 9,
        }
        ```
3.  **Navigation and State Logic:** Discuss the Redux/navigation flow with Copilot Chat for complex interactions (e.g., handling the `Continue` button on `Login` to check `userMode` before navigating).

### 6.2 Order of Implementation

To ensure a functional application core early on, follow this order:

1.  **Setup & Navigation:** Implement `AuthStack.tsx` and `AppNavigator.tsx`.
2.  **Auth Flow (Core):** Implement `Login` (3), `SelectionScreen` (2), and `SignUp` (Pending).
3.  **General Merchant Core:** Implement `Payments` (5) and `Settlements` (7) to create the first usable tab navigator (`GeneralTabs.tsx`).
4.  **Core Flows:** Implement `WalletTransfer` (8), `TransactionDetails` (9), and `ActionSuccess` (12) as common screens accessible from the main tabs.
5.  **Utility/Settings:** Implement `AcceptPayments` (6) and `Settings` (11).
6.  **Corporate Flow:** Implement `CorporateHome` (10) and its corresponding tab navigator (`CorporateTabs.tsx`).
7.  **Remaining Auth/Registration:** Implement `WelcomeFirst` (Pending) and `GeneralMerchantRegistration` (Pending).

### 6.3 Component Reusability

Prioritize creating reusable components, especially for elements with the dark primary color (`#293454`).

| Component Name | Description | Used In |
| :--- | :--- | :--- |
| `PrimaryButton` | Dark blue, large, rounded, shadowed button. | Login, Registration, WalletTransfer, Success |
| `BalanceCard` | Dark blue, large card displaying balance and currency. | Payments, Settlements, CorporateHome |
| `CustomHeader` | Header with back button, title, and notification/menu icon. | All Stack Screens |
| `TransactionListItem` | Item showing avatar, name, amount, and status. | Payments, CorporateHome, Settlements |
| `CurrencyModal` | Full-screen modal for selecting currency (USD, GBP, GMD). | Payments, Settlements |

## 7. Code Conversion Guide

The provided mockups use a Tailwind CSS structure within HTML, which must be converted to React Native's `StyleSheet`.

| HTML/Tailwind Concept | React Native Equivalent | Example Conversion |
| :--- | :--- | :--- |
| `div` | `View` | `<View>` |
| `p`, `h1`, `span` | `Text` | `<Text style={styles.title}>` |
| `img` | `Image` | `<Image source={...} style={styles.image} />` |
| `w-full`, `h-full` | `{ width: '100%', height: '100%' }` or `flex: 1` | `StyleSheet.absoluteFill` |
| `bg-[#293454]` | `{ backgroundColor: '#293454' }` | `styles.darkBg` |
| `px-6 py-4` | `{ paddingHorizontal: 24, paddingVertical: 16 }` | `styles.padding` |
| `font-bold text-xl` | `{ fontWeight: '700', fontSize: 20 }` | `styles.boldText` |
| `shadow-xl` | `{ elevation: 8, shadowOpacity: 0.3 }` | `styles.shadow` |
| `flex items-center` | `{ flexDirection: 'row', alignItems: 'center' }` | `styles.rowCenter` |

### Example Conversion: Login Button (From HTML to RN)

**HTML/Tailwind (Screen 3 Reference):**
```html
<button class="w-full h-14 bg-[#293454] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#293454]/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
    <span>Login</span>
</button>
```

**React Native (TypeScript/JavaScript):**
```typescript
// src/components/common/PrimaryButton.tsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
// ...

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 56, // h-14 * 4
        backgroundColor: '#293454',
        borderRadius: 12, // rounded-xl
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        // shadow-lg shadow-[#293454]/30
        shadowColor: '#293454',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    text: {
        color: 'white',
        fontWeight: '700',
        fontSize: 18, // text-lg
    },
});

const PrimaryButton = ({ title, onPress }) => (
    <TouchableOpacity 
        style={styles.button} 
        onPress={onPress}
        activeOpacity={0.8} // Simulates active:scale
    >
        <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
);
```

## 8. Reference Code (React Native Conversion Notes)

The following sections contain the provided design code converted into a React Native functional component structure.

### Screen 2: SelectionScreen (Merchant Type Selection)

**RN Conversion Notes:**
*   Uses `SafeAreaView` and `ScrollView` within the main `View`.
*   The radio button cards are implemented using `TouchableOpacity` with conditional styling based on the selected state.
*   The Font Awesome icons must be replaced by icons from `react-native-vector-icons`.

**Code Pending**

### Screen 3: Login

**RN Conversion Notes:**
*   Uses `ImageBackground` for `ic_intro.jpg` representation.
*   The bottom sheet is a `View` with `borderTopLeftRadius` and `borderTopRightRadius` set high (`40` or `50`).
*   Input fields are custom components handling focus state for border color change.

**Code Pending**

### Screen 5: Payments Dashboard

**RN Conversion Notes:**
*   Requires `ScrollView` for the main content.
*   The `Balance Card` is a complex component with custom gradients and shadow effects.
*   The `Transaction History` list should utilize `FlatList` or simple mapping for performance, especially when dealing with large datasets.

**Code Pending**

### Screen 6: Accept Payments (QR)

**RN Conversion Notes:**
*   The QR code generation needs a library (e.g., `react-native-qrcode-svg`) or use a static image placeholder.
*   The bottom action bar uses `View` with `flexDirection: 'row'` and `justifyContent: 'space-around'` for sharing buttons.
*   Currency toggles are `TouchableOpacity` elements.

**Code Pending**

### Screen 7: Settlements

**RN Conversion Notes:**
*   Similar structure to `Payments` with `BalanceCard` and `ScrollView`.
*   The `Request Settlement` actions are simple `TouchableOpacity` components with icons.
*   The list items use conditional styling for status badges (`Pending`/`Success`).

**Code Pending**

### Screen 8: Wallet Transfer

**RN Conversion Notes:**
*   The `Wallet Card` uses a gradient background.
*   The large amount input requires careful styling to achieve the center-aligned, large font effect.
*   The footer actions are stacked `TouchableOpacity` elements.

**Code Pending**

### Screen 9: Transaction Details

**RN Conversion Notes:**
*   The ticket tear effect is achieved by using two small `View` circles with negative margins on the separator line.
*   The top section uses absolute positioning or padding to align content within the dark background.

**Code Pending**

### Screen 10: Corporate Home

**RN Conversion Notes:**
*   The dark blue theme is dominant.
*   The horizontal `Currency Selector` should be implemented using a horizontal `FlatList` or `ScrollView`.
*   The search bar is a standard `TextInput` wrapped in a `View`.

**Code Pending**

### Screen 11: Settings & Profile

**RN Conversion Notes:**
*   List options are implemented as reusable `SettingsItem` components (`TouchableOpacity`).
*   The `Biometric Login` uses a standard `Switch` component.
*   The layout is wrapped in a `ScrollView` for access to the footer details.

**Code Pending**

### Screen 12: Action Success

**RN Conversion Notes:**
*   The success animation can be a simple `Animated.View` for the ripple effect combined with a static checkmark icon.
*   The layout is primarily centered using `justifyContent: 'center'` and `alignItems: 'center'`.

**Code Pending**

### Screen 13: Empty Notifications

**RN Conversion Notes:**
*   A classic empty state pattern.
*   The illustration is a composite `View` structure to replicate the sleeping bell icon.
*   The bottom navigation bar is fixed using `position: 'absolute'` or a dedicated `Tab.Navigator`.

**Code Pending**