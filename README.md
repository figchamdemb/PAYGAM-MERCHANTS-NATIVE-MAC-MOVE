# eGov Gambia Citizen App

Enterprise-grade mobile application for eGov Gambia citizen services built with React Native CLI.

## 📱 Overview

This is a **React Native CLI** application (not Expo) designed for maximum stability and enterprise reliability. The app provides citizens with access to:

- Digital Address Services
- Emergency Services
- Nearby Services (Hospitals, Doctors, Pharmacies, Banks)
- Government Service Applications
- Report Submission
- License Management
- Profile & Notifications

## 🏗️ Architecture

### Technology Stack

- **React Native 0.73** (CLI - no Expo)
- **TypeScript** for type safety
- **Redux Toolkit** + Redux Persist for state management
- **React Navigation** for navigation (Drawer library + Static tabs)
- **Axios** for API calls
- **React Native Keychain** for secure token storage

### Project Structure

```
citizen-react-cli/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Button, Icon, Card, Input (enterprise-grade)
│   │   ├── layout/      # Layout components
│   │   ├── features/    # Feature-specific components
│   │   └── navigation/  # Navigation components
│   ├── config/          # Configuration files
│   │   ├── colors.ts    # ✅ Central color config
│   │   ├── spacing.ts   # ✅ Spacing system
│   │   ├── typography.ts # ✅ Typography system
│   │   └── constants.ts # ✅ App constants
│   ├── navigation/      # Navigation structure
│   │   ├── AppNavigator.tsx     # Main navigator
│   │   ├── AuthStack.tsx        # Auth flow
│   │   ├── MainDrawer.tsx       # Drawer (library)
│   │   ├── TabNavigator.tsx     # ✅ STATIC tabs (custom code)
│   │   └── DrawerContent.tsx    # Custom drawer UI
│   ├── screens/         # All app screens (29 total)
│   │   ├── auth/        # Login, Signup, Reset Password
│   │   ├── dashboard/   # Dashboard
│   │   ├── digital/     # Digital Address services
│   │   ├── emergency/   # Emergency services
│   │   ├── nearby/      # Nearby services
│   │   ├── reports/     # Report management
│   │   ├── company/     # Company management
│   │   └── admin/       # Admin screens
│   ├── services/        # API services
│   │   ├── api.ts       # ✅ Axios base config
│   │   ├── auth.service.ts      # Authentication
│   │   ├── user.service.ts      # User management
│   │   └── citizen.service.ts   # Citizen services
│   ├── store/           # Redux store
│   │   ├── slices/      # Redux slices
│   │   │   └── authSlice.ts     # Auth state
│   │   ├── hooks.ts     # Typed hooks
│   │   └── index.ts     # Store config + persist
│   ├── utils/           # Utility functions
│   ├── hooks/           # Custom hooks
│   ├── types/           # TypeScript types
│   └── assets/          # Images, fonts, etc.
├── android/             # Android native code
├── ios/                 # iOS native code
├── package.json         # ✅ All dependencies
├── tsconfig.json        # ✅ TypeScript config
├── babel.config.js      # ✅ Babel config
└── metro.config.js      # ✅ Metro bundler config
```

## 🎨 Design System

### Static Tab Navigation

**IMPORTANT:** Tab navigation is **STATIC** (custom code, no library). This ensures:
- ✅ Maximum stability (no library crashes)
- ✅ Full control over design
- ✅ Enterprise-grade reliability

Drawer navigation uses the library for standard behavior.

### Color System

All colors are centralized in `src/config/colors.ts`:

```typescript
import { colors } from '@/config/colors';

// Usage
backgroundColor: colors.primary      // #1A3C5A
color: colors.tab.active             // #B45309
```

### Reusable Components

All UI components are enterprise-grade and reusable:

```typescript
import { Button, Icon, Card, Input } from '@/components/ui';

<Button title="Login" variant="primary" onPress={handleLogin} />
<Icon name="home" library="material" size={24} color={colors.primary} />
```

## 📦 Dependencies

### Core Features

- **Navigation:** @react-navigation/native, @react-navigation/stack, @react-navigation/drawer
- **State:** @reduxjs/toolkit, react-redux, redux-persist
- **API:** axios
- **Storage:** @react-native-async-storage/async-storage, react-native-keychain

### Device Features

- **Camera & QR:** react-native-camera, react-native-qrcode-scanner, react-native-image-picker
- **Maps & Location:** react-native-maps, react-native-geolocation-service
- **Biometric:** react-native-biometrics, react-native-touch-id
- **Documents:** react-native-document-picker, react-native-fs, react-native-pdf, react-native-share

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Install iOS Pods (macOS only):**

```bash
cd ios && pod install && cd ..
```

3. **Setup environment variables:**

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Running the App

**Android:**

```bash
npm run android
```

**iOS:**

```bash
npm run ios
```

**Start Metro:**

```bash
npm start
```

### Development Commands

```bash
npm run lint          # Run ESLint
npm run format        # Format with Prettier
npm run type-check    # Check TypeScript
npm test              # Run tests
npm run clean         # Clean build cache
```

## 🔑 Key Features

### Authentication

- Email/Password login
- Biometric authentication (fingerprint/face)
- Social login (Google OAuth)
- Forgot/Reset password with OTP
- Secure token storage (Keychain)

### Digital Address

- Register digital addresses
- View address list
- Address details with QR code
- Landlord certificates
- Interactive maps

### Emergency Services

- Quick access to emergency numbers
- Police, Fire, Ambulance
- SOS button with location sharing

### Nearby Services

- Find nearby hospitals, doctors, pharmacies, banks
- Map view and list view
- Filter by distance
- Get directions

### Reports

- Submit incident reports
- Photo/video upload
- Track report status
- View history

## 📄 API Integration

API base URL is configured in `.env`:

```
API_BASE_URL=http://localhost:8080/api/v1
```

All API services are in `src/services/`:

```typescript
import { AuthService, UserService, ReportsService } from '@/services';

// Login
const response = await AuthService.login({ email, password });

// Get profile
const user = await UserService.getProfile();

// Create report
const report = await ReportsService.createReport(data);
```

## 🔒 Security

- JWT tokens stored in iOS Keychain / Android Keystore
- Auto token refresh on 401
- Secure API communication
- Biometric authentication
- Environment variables for sensitive config

## 📱 Platform Support

- ✅ iOS 13.0+
- ✅ Android 6.0+ (API 23+)

## 🧪 Testing

```bash
npm test
```

## 📝 License

Proprietary - eGov Gambia

## 👥 Support

For support, contact: support@egov.gm
