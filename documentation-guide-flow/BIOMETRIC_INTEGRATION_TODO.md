# PATROL App - Biometric Integration Guide

## Overview
The PATROL React Native app integrates with a native Kotlin biometric app for fingerprint capture. This approach avoids the complexity of integrating native Bluetooth SDK directly in React Native.

## Architecture

```
PATROL-APP (React Native)
    │
    │ Button: "Capture Biometric"
    │ Uses Android Linking to open biometric app
    ▼
agent-app-android-kotlin-main (Native Kotlin)
    │
    │ Captures fingerprint via Bluetooth device
    │ Returns template data via Intent result
    ▼
PATROL-APP receives data
    │
    │ Sends template to backend API
    ▼
Backend verifies/stores fingerprint
```

## How to Launch Biometric App

### React Native Code (PATROL-APP)

```typescript
// src/services/biometricService.ts

import { Linking, Platform } from 'react-native';

export const BiometricService = {
  /**
   * Launch biometric capture app
   * @param userId - The user ID for whom to capture fingerprint
   * @param action - 'enroll' | 'verify' | 'identify'
   */
  launchBiometricCapture: async (userId: string, action: 'enroll' | 'verify' | 'identify') => {
    if (Platform.OS !== 'android') {
      console.warn('Biometric capture only available on Android');
      return;
    }

    const url = `egov-biometric://capture?userId=${userId}&action=${action}`;
    
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      console.error('Biometric app not installed');
      // Show alert to user to install biometric app
    }
  },

  /**
   * Check if biometric app is installed
   */
  isBiometricAppInstalled: async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return false;
    return Linking.canOpenURL('egov-biometric://');
  }
};
```

### Usage in Screen

```tsx
// src/features/patrol/screens/BiometricCaptureScreen.tsx

import React from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { BiometricService } from '../../../services/biometricService';

const BiometricCaptureScreen = ({ route }) => {
  const { suspectId, suspectName } = route.params;

  const handleCaptureBiometric = async () => {
    const isInstalled = await BiometricService.isBiometricAppInstalled();
    
    if (!isInstalled) {
      Alert.alert(
        'Biometric App Not Found',
        'Please install the eGov Biometric app to capture fingerprints.'
      );
      return;
    }

    await BiometricService.launchBiometricCapture(suspectId, 'enroll');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Capture Biometric</Text>
      <Text style={styles.subtitle}>Suspect: {suspectName}</Text>
      
      <TouchableOpacity 
        style={styles.captureButton}
        onPress={handleCaptureBiometric}
      >
        <Text style={styles.buttonText}>Open Biometric Scanner</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BiometricCaptureScreen;
```

## Remaining Tasks for PATROL-APP

### Phase 1: Create Biometric Service
- [ ] Create `src/services/biometricService.ts`
- [ ] Implement `launchBiometricCapture` function
- [ ] Implement `isBiometricAppInstalled` check

### Phase 2: Create UI Screens
- [ ] Create BiometricCaptureScreen component
- [ ] Add biometric button to suspect details screen
- [ ] Add biometric button to address verification screen

### Phase 3: Handle Return Data
- [ ] Set up deep link handler to receive data back from biometric app
- [ ] Parse returned template data
- [ ] Send template to backend API

### Phase 4: API Integration
- [ ] Implement fingerprint enrollment endpoint call
- [ ] Implement fingerprint verification endpoint call
- [ ] Handle success/error responses

## Deep Link Configuration

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <data android:scheme="egov-patrol" android:host="biometric-result" />
</intent-filter>
```

This allows the biometric app to return results back to PATROL-APP.

## Testing Without Device

1. **Mock the biometric service** in development
2. Use placeholder data to test UI flow
3. Verify API calls with mock template data
4. Replace with real integration when device arrives
