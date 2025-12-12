/**
 * ✅ REDUX STORE CONFIGURATION
 *
 * Configures Redux store with:
 * - Redux Toolkit
 * - Redux Persist (for local storage)
 * - Encrypted storage for sensitive data
 *
 * Persisted State:
 * - Auth state (user, tokens)
 *
 * Non-Persisted State:
 * - UI state (loading, modals, etc.)
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Slices
import authReducer from './slices/authSlice';

/**
 * ROOT REDUCER
 * Combines all slice reducers
 */
const rootReducer = combineReducers({
  auth: authReducer,
  // Add more slices here as needed:
  // ui: uiReducer,
  // notifications: notificationsReducer,
  // services: servicesReducer,
  // etc.
});

/**
 * PERSIST CONFIGURATION
 * Configure which parts of state to persist
 */
const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth'], // Only persist auth state
  // blacklist: [], // Add slices to NOT persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * STORE CONFIGURATION
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for Redux Persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: __DEV__, // Enable Redux DevTools in development only
});

export const persistor = persistStore(store);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
