/**
 * E-GOV-GUARDS-PORTAL - useLocation Hook
 * React hook for real-time location tracking
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import locationService, { LocationCoords, LocationResult } from '../services/LocationService';

export interface UseLocationOptions {
    enableHighAccuracy?: boolean;
    watchPosition?: boolean;
    distanceFilter?: number;
    interval?: number;
}

export interface UseLocationReturn {
    location: LocationCoords | null;
    error: string | null;
    loading: boolean;
    timestamp: number | null;
    refresh: () => Promise<void>;
    startWatching: () => Promise<void>;
    stopWatching: () => void;
    calculateDistanceTo: (destination: LocationCoords) => number | null;
    formatDistance: (meters: number) => string;
    calculateETA: (destination: LocationCoords, speedKmh?: number) => string | null;
}

export const useLocation = (options: UseLocationOptions = {}): UseLocationReturn => {
    const {
        enableHighAccuracy = true,
        watchPosition = false,
        distanceFilter = 10,
        interval = 5000,
    } = options;

    const [location, setLocation] = useState<LocationCoords | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [timestamp, setTimestamp] = useState<number | null>(null);
    const isWatching = useRef<boolean>(false);
    const appState = useRef<AppStateStatus>(AppState.currentState);

    // Get current position
    const getCurrentLocation = useCallback(async () => {
        setLoading(true);
        setError(null);

        const result = await locationService.getCurrentPosition({
            enableHighAccuracy,
            timeout: 15000,
            maximumAge: 10000,
        });

        if (result.success && result.coords) {
            setLocation(result.coords);
            setTimestamp(result.timestamp || Date.now());
            setError(null);
        } else {
            setError(result.error || 'Failed to get location');
        }

        setLoading(false);
    }, [enableHighAccuracy]);

    // Handle location updates from watching
    const handleLocationUpdate = useCallback((result: LocationResult) => {
        if (result.success && result.coords) {
            setLocation(result.coords);
            setTimestamp(result.timestamp || Date.now());
            setError(null);
            setLoading(false);
        } else {
            setError(result.error || 'Location update failed');
        }
    }, []);

    // Start watching position
    const startWatching = useCallback(async () => {
        if (isWatching.current) return;

        setLoading(true);
        const started = await locationService.watchPosition(handleLocationUpdate, {
            enableHighAccuracy,
            distanceFilter,
            interval,
        });

        if (started) {
            isWatching.current = true;
        } else {
            setError('Failed to start location tracking');
            setLoading(false);
        }
    }, [enableHighAccuracy, distanceFilter, interval, handleLocationUpdate]);

    // Stop watching position
    const stopWatching = useCallback(() => {
        locationService.stopWatching();
        isWatching.current = false;
    }, []);

    // Refresh current location
    const refresh = useCallback(async () => {
        await getCurrentLocation();
    }, [getCurrentLocation]);

    // Calculate distance to destination
    const calculateDistanceTo = useCallback(
        (destination: LocationCoords): number | null => {
            if (!location) return null;
            return locationService.calculateDistance(location, destination);
        },
        [location]
    );

    // Format distance for display
    const formatDistance = useCallback((meters: number): string => {
        return locationService.formatDistance(meters);
    }, []);

    // Calculate ETA to destination
    const calculateETA = useCallback(
        (destination: LocationCoords, speedKmh?: number): string | null => {
            if (!location) return null;
            const distance = locationService.calculateDistance(location, destination);
            return locationService.calculateETA(distance, speedKmh);
        },
        [location]
    );

    // Handle app state changes
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                // App came to foreground - refresh if not watching
                if (!isWatching.current) {
                    getCurrentLocation();
                }
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [getCurrentLocation]);

    // Initial location fetch and optional watch
    useEffect(() => {
        if (watchPosition) {
            startWatching();
        } else {
            getCurrentLocation();
        }

        return () => {
            stopWatching();
        };
    }, [watchPosition, startWatching, getCurrentLocation, stopWatching]);

    return {
        location,
        error,
        loading,
        timestamp,
        refresh,
        startWatching,
        stopWatching,
        calculateDistanceTo,
        formatDistance,
        calculateETA,
    };
};

export default useLocation;
