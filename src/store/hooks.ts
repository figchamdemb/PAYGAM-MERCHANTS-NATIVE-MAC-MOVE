/**
 * ✅ TYPED REDUX HOOKS
 *
 * Pre-typed hooks for Redux usage in components
 * Provides type safety when using Redux with TypeScript
 *
 * Usage:
 * import { useAppDispatch, useAppSelector } from '@/store/hooks';
 *
 * const dispatch = useAppDispatch();
 * const user = useAppSelector(state => state.auth.user);
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
