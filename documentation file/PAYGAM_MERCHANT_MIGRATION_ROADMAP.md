# PayGam Merchant App - Migration Roadmap

## Overview

This document outlines the migration from the current **Patrol App** to the **PayGam Merchant App**. Only the splash screen and dashboard screens will be changed.

---

## 🎯 App Transformation Summary

| Attribute | Current (Patrol) | New (PayGam Merchant) |
|-----------|------------------|----------------------|
| **App Name** | PayGam Merchant | PayGam Merchant (NO CHANGE) |
| **Purpose** | Emergency Response | Payment & Settlement Management |
| **Theme Color** | Blue (#1E3A8A) | Dark Blue (#293454) |
| **User Types** | Police, Fire, Immigration, Ambulance | General Merchant, Corporate Merchant, Fuel Merchant, Government Merchant |

---

## 🔐 MFA Code Mapping (Dashboard Routing)

| MFA Code | Current Dashboard | New Dashboard |
|----------|------------------|---------------|
| `000006` | Ambulance Dashboard | **General Merchant Dashboard** |
| `111111` | Fire Dashboard | **Corporate Merchant Dashboard** |
| `222222` | Immigration Dashboard | **Fuel Merchant Dashboard** |
| `123456` | Police Dashboard | **Government Merchant Dashboard** |

---

## 📱 Screen Migration Map

### Phase 1: Core Screens

#### 1.1 Splash Screen
| File | Current | New |
|------|---------|-----|
| `src/screens/SplashScreenSimple.tsx` | Patrol Logo + Shield Animation | PayGam Merchant Logo + Animation |

**Changes Required:**
- Replace shield icon with PayGam Merchant logo
- Update colors to `#293454`
- Change text to "PayGam Merchant"
- Update tagline to "Payments Made Simple"

---

#### 1.2 Login Screen
| File | Current | New |
|------|---------|-----|
| `src/screens/LoginScreenSimple.tsx` | Badge ID + Password | Phone Number + Password |

**Changes Required:**
- Replace "Badge ID" field with "Phone Number" field
- Add country code selector (+220 Gambia default)
- Update MFA code routing logic (see table above)
- Replace police/shield icons with merchant/payment icons
- Update text: "Secure Officer Login" → "Merchant Login Portal"

---

### Phase 2: Dashboard Migrations

#### 2.1 General Merchant Dashboard (was Ambulance)
| File | Current | New |
|------|---------|-----|
| `src/screens/AmbulanceDashboardScreen.tsx` | Ambulance emergency response | General Merchant Payments Dashboard |

**New Features:**
- Balance Card (GMD, USD, GBP)
- Transaction History List
- Quick Actions: Accept Payment, Transfer, Settlements
- QR Code generation
- Currency selector

**Sub-screens to migrate:**
| Current | New | Purpose |
|---------|-----|---------|
| `AmbulanceDispatcherScreen` | `PaymentsScreen` | Main payments view |
| `AmbulancePatientReportScreen` | `TransactionDetailsScreen` | View transaction details |
| `AmbulanceTeamRadioScreen` | `AcceptPaymentsScreen` | QR code for receiving payments |

---

#### 2.2 Corporate Merchant Dashboard (was Fire)
| File | Current | New |
|------|---------|-----|
| `src/screens/FireDashboardScreen.tsx` | Fire emergency response | Corporate Merchant Dashboard |

**New Features:**
- Corporate balance overview
- Standing orders list
- Multi-currency display
- Bulk payment options
- Employee salary disbursement

**Sub-screens to migrate:**
| Current | New | Purpose |
|---------|-----|---------|
| `FireDispatcherScreen` | `CorporateHomeScreen` | Corporate main dashboard |
| `FireIncidentReportScreen` | `StandingOrdersScreen` | Manage recurring payments |
| `FireTeamRadioScreen` | `TopUpWalletScreen` | Add funds to corporate wallet |

---

#### 2.3 Fuel Merchant Dashboard (was Immigration)
| File | Current | New |
|------|---------|-----|
| `src/screens/ImmigrationDashboardScreen.tsx` | Immigration processing | Fuel Merchant Dashboard |

**New Features:**
- Fuel sales tracking
- Pump-wise transaction view
- Daily/weekly reports
- Customer loyalty integration
- Fuel price management

**Sub-screens to migrate:**
| Current | New | Purpose |
|---------|-----|---------|
| `ImmigrationDispatcherScreen` | `FuelSalesScreen` | Track fuel sales |
| `ImmigrationCaseReportScreen` | `PumpReportsScreen` | Per-pump analytics |
| `ImmigrationTeamRadioScreen` | `FuelPriceScreen` | Manage fuel prices |
| `PermitVisaLookupScreen` | `CustomerLookupScreen` | Search customer transactions |

---

#### 2.4 Government Merchant Dashboard (was Police)
| File | Current | New |
|------|---------|-----|
| `src/screens/PoliceDashboardScreen.tsx` | Police operations | Government Merchant Dashboard |

**New Features:**
- Government fee collections
- Service payment tracking
- Citizen payment portal
- Revenue reports
- Multi-department support

**Sub-screens to migrate:**
| Current | New | Purpose |
|---------|-----|---------|
| `TrafficOpsANPRScreen` | `ServiceFeesScreen` | List government services |
| `IncidentReportingScreen` | `CollectionReportScreen` | Revenue collection reports |
| `TeamGridRadioScreen` | `DepartmentStatsScreen` | Department-wise stats |
| `GlobalDatabaseSearchScreen` | `CitizenSearchScreen` | Search citizen payments |
| `DispatcherMapScreen` | `LocationsScreen` | Payment collection points |
| `WriteForCitizenScreen` | `ManualEntryScreen` | Manual payment entry |
| `StatementFormScreen` | `ReceiptGeneratorScreen` | Generate payment receipts |
| `TrafficTicketScreen` | `FinePaymentScreen` | Process fine payments |
| `VehicleSearchScreen` | `PaymentHistoryScreen` | Search payment history |
| `SearchCasesScreen` | `PendingPaymentsScreen` | View pending payments |

---

### Phase 3: Shared/Common Screens

| Current Screen | New Screen | Purpose |
|----------------|------------|---------|
| `OfficerProfileScreen` | `MerchantProfileScreen` | Merchant account details |
| `SettingsScreen` | `SettingsScreen` | App settings (minor updates) |
| `QRScannerScreen` | `QRScannerScreen` | Scan payment QR codes |
| `ActionSuccessScreen` | `ActionSuccessScreen` | Transaction success confirmation |

---

### Phase 4: New Screens to Create

| Screen Name | Category | Purpose |
|-------------|----------|---------|
| `WelcomeSliderScreen` | Auth | 3-slide intro carousel |
| `SelectionScreen` | Auth | Choose merchant type |
| `SignUpScreen` | Auth | New merchant registration |
| `MerchantRegistrationScreen` | Auth | Complete registration form |
| `WalletTransferScreen` | Flow | Transfer to wallet |
| `SettleToBankScreen` | Flow | Bank settlement |
| `CurrencyModalScreen` | Modal | Currency selection |
| `FilterModalScreen` | Modal | Transaction filters |
| `NotificationsScreen` | Flow | Notification center |

---

## 🗂️ Folder Structure Changes

### Current Structure
```
src/screens/
├── emergency/
├── police/
├── fire/
├── ambulance/
├── immigration/
```

### New Structure
```
src/screens/
├── auth/
│   ├── WelcomeSliderScreen.tsx
│   ├── LoginScreen.tsx
│   ├── SignUpScreen.tsx
│   ├── SelectionScreen.tsx
│   └── RegistrationScreen.tsx
├── general/
│   ├── GeneralDashboardScreen.tsx
│   ├── PaymentsScreen.tsx
│   ├── SettlementsScreen.tsx
│   └── AcceptPaymentsScreen.tsx
├── corporate/
│   ├── CorporateDashboardScreen.tsx
│   ├── CorporateHomeScreen.tsx
│   ├── StandingOrdersScreen.tsx
│   └── TopUpWalletScreen.tsx
├── fuel/
│   ├── FuelDashboardScreen.tsx
│   ├── FuelSalesScreen.tsx
│   ├── PumpReportsScreen.tsx
│   └── FuelPriceScreen.tsx
├── government/
│   ├── GovernmentDashboardScreen.tsx
│   ├── ServiceFeesScreen.tsx
│   ├── CollectionReportScreen.tsx
│   └── CitizenSearchScreen.tsx
├── flows/
│   ├── WalletTransferScreen.tsx
│   ├── TransactionDetailsScreen.tsx
│   ├── ActionSuccessScreen.tsx
│   └── NotificationsScreen.tsx
├── settings/
│   ├── SettingsScreen.tsx
│   └── MerchantProfileScreen.tsx
└── modals/
    ├── CurrencyModal.tsx
    └── FilterModal.tsx
```

---

## 📝 Navigation Updates

### File: `src/App.tsx`

**Current Navigation:**
```typescript
// MFA Code Routing
case '123456': targetScreen = 'PoliceDashboard';
case '111111': targetScreen = 'FireDashboard';
case '222222': targetScreen = 'ImmigrationDashboard';
case '000006': targetScreen = 'AmbulanceDashboard';
```

**New Navigation:**
```typescript
// MFA Code Routing
case '000006': targetScreen = 'GeneralMerchantDashboard';
case '111111': targetScreen = 'CorporateMerchantDashboard';
case '222222': targetScreen = 'FuelMerchantDashboard';
case '123456': targetScreen = 'GovernmentMerchantDashboard';
```

---

## 🎨 Theme/Styling Updates

### Color Palette Change
| Element | Current | New |
|---------|---------|-----|
| Primary | `#1E3A8A` (Royal Blue) | `#293454` (Dark Navy) |
| Secondary | `#3B82F6` | `#4A5568` |
| Accent | `#60A5FA` | `#667EEA` |
| Success | `#10B981` | `#48BB78` |
| Background | `#0F172A` | `#1A202C` |

### Icon Updates
| Current Icon | New Icon | Usage |
|-------------|----------|-------|
| Shield | Wallet | App logo |
| Badge | Phone | Login identifier |
| Radio | Transfer | Quick action |
| Emergency | Payment | Dashboard action |
| Ambulance | Store | General merchant |
| Fire Truck | Building | Corporate |
| Immigration | Fuel Pump | Fuel merchant |
| Police Car | Government | Government |

---

## ✅ Implementation Checklist

### Phase 1: Foundation (Week 1)
- [ ] Update splash screen branding to PayGam Merchant
- [ ] Update login screen text
- [ ] Update MFA routing logic for 4 merchant types
- [ ] Update color theme to #293454

### Phase 2: General Merchant Dashboard (from Ambulance)
- [ ] Replace `AmbulanceDashboardScreen` with `GeneralMerchantDashboard`
- [ ] Add Balance Card, Transaction History
- [ ] Add Quick Actions: Accept Payment, Transfer, Settlements

### Phase 3: Corporate Merchant Dashboard (from Fire)
- [ ] Replace `FireDashboardScreen` with `CorporateMerchantDashboard`
- [ ] Add Corporate balance overview
- [ ] Add Standing orders list

### Phase 4: Fuel Merchant Dashboard (from Immigration)
- [ ] Replace `ImmigrationDashboardScreen` with `FuelMerchantDashboard`
- [ ] Add Fuel sales tracking
- [ ] Add Pump reports

### Phase 5: Government Merchant Dashboard (from Police)
- [ ] Replace `PoliceDashboardScreen` with `GovernmentMerchantDashboard`
- [ ] Add Government fee collections
- [ ] Add Service payment tracking

### Phase 6: Testing & Build
- [ ] Test all MFA routing
- [ ] Build release APK
- [ ] Test on device

---

## 📋 Quick Reference: Screen Renaming

| Old Name | New Name | File Path |
|----------|----------|-----------|
| `AmbulanceDashboardScreen` | `GeneralMerchantDashboardScreen` | `src/screens/general/` |
| `FireDashboardScreen` | `CorporateMerchantDashboardScreen` | `src/screens/corporate/` |
| `ImmigrationDashboardScreen` | `FuelMerchantDashboardScreen` | `src/screens/fuel/` |
| `PoliceDashboardScreen` | `GovernmentMerchantDashboardScreen` | `src/screens/government/` |

---

## 🚀 Getting Started

1. **Read this document completely**
2. **Start with Phase 1** - Update branding and login
3. **Test MFA routing** after each dashboard change
4. **Build release APK** after each phase
5. **Document any issues** in this file

---

*Last Updated: December 15, 2025*
*Migration from Patrol v1.0 to PayGam Merchant v1.0*
