/**
 * E-GOV-GUARDS-PORTAL - Location Service
 * Real GPS Location Service using react-native-geolocation-service
 * 
 * Features:
 * - Get current position
 * - Watch position updates
 * - Calculate distance between points
 * - Reverse geocoding
 */

import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation, {
    GeoPosition,
    GeoError,
    GeoOptions,
} from 'react-native-geolocation-service';

export interface LocationCoords {
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number;
    altitudeAccuracy?: number;
    heading?: number;
    speed?: number;
}

export interface LocationResult {
    success: boolean;
    coords?: LocationCoords;
    timestamp?: number;
    error?: string;
}

export interface WatchOptions {
    enableHighAccuracy?: boolean;
    distanceFilter?: number;
    interval?: number;
    fastestInterval?: number;
    showLocationDialog?: boolean;
}

class LocationService {
    private watchId: number | null = null;
    private isWatching: boolean = false;

    /**
     * Request location permissions
     */
    async requestPermissions(): Promise<boolean> {
        if (Platform.OS === 'ios') {
            const status = await Geolocation.requestAuthorization('whenInUse');
            return status === 'granted' || status === 'restricted';
        }

        if (Platform.OS === 'android') {
            try {
                const fineLocation = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission Required',
                        message: 'E-GOV Guards Portal needs access to your location for patrol operations.',
                        buttonPositive: 'Grant Permission',
                        buttonNegative: 'Cancel',
                    }
                );

                if (fineLocation === PermissionsAndroid.RESULTS.GRANTED) {
                    // Also request background location for Android 10+
                    if (Platform.Version >= 29) {
                        const backgroundLocation = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
                            {
                                title: 'Background Location Permission',
                                message: 'Allow E-GOV Guards Portal to access location while in background for continuous patrol tracking.',
                                buttonPositive: 'Allow',
                                buttonNegative: 'Deny',
                            }
                        );
                        return backgroundLocation === PermissionsAndroid.RESULTS.GRANTED;
                    }
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Permission request error:', error);
                return false;
            }
        }

        return false;
    }

    /**
     * Check if location services are enabled
     */
    async checkLocationEnabled(): Promise<boolean> {
        return new Promise((resolve) => {
            Geolocation.getCurrentPosition(
                () => resolve(true),
                (error) => {
                    if (error.code === 2) {
                        // Position unavailable - location services disabled
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                },
                { timeout: 1000, maximumAge: 0 }
            );
        });
    }

    /**
     * Get current position
     */
    async getCurrentPosition(options?: GeoOptions): Promise<LocationResult> {
        const hasPermission = await this.requestPermissions();

        if (!hasPermission) {
            return {
                success: false,
                error: 'Location permission not granted',
            };
        }

        return new Promise((resolve) => {
            Geolocation.getCurrentPosition(
                (position: GeoPosition) => {
                    resolve({
                        success: true,
                        coords: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            altitude: position.coords.altitude ?? undefined,
                            altitudeAccuracy: position.coords.altitudeAccuracy ?? undefined,
                            heading: position.coords.heading ?? undefined,
                            speed: position.coords.speed ?? undefined,
                        },
                        timestamp: position.timestamp,
                    });
                },
                (error: GeoError) => {
                    console.error('Location error:', error);
                    resolve({
                        success: false,
                        error: this.getErrorMessage(error.code),
                    });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                    ...options,
                }
            );
        });
    }

    /**
     * Start watching position
     */
    async watchPosition(
        onUpdate: (location: LocationResult) => void,
        options?: WatchOptions
    ): Promise<boolean> {
        const hasPermission = await this.requestPermissions();

        if (!hasPermission) {
            onUpdate({
                success: false,
                error: 'Location permission not granted',
            });
            return false;
        }

        if (this.isWatching) {
            this.stopWatching();
        }

        this.watchId = Geolocation.watchPosition(
            (position: GeoPosition) => {
                onUpdate({
                    success: true,
                    coords: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        altitude: position.coords.altitude ?? undefined,
                        heading: position.coords.heading ?? undefined,
                        speed: position.coords.speed ?? undefined,
                    },
                    timestamp: position.timestamp,
                });
            },
            (error: GeoError) => {
                onUpdate({
                    success: false,
                    error: this.getErrorMessage(error.code),
                });
            },
            {
                enableHighAccuracy: options?.enableHighAccuracy ?? true,
                distanceFilter: options?.distanceFilter ?? 10,
                interval: options?.interval ?? 5000,
                fastestInterval: options?.fastestInterval ?? 2000,
                showLocationDialog: options?.showLocationDialog ?? true,
            }
        );

        this.isWatching = true;
        return true;
    }

    /**
     * Stop watching position
     */
    stopWatching(): void {
        if (this.watchId !== null) {
            Geolocation.clearWatch(this.watchId);
            this.watchId = null;
            this.isWatching = false;
        }
    }

    /**
     * Calculate distance between two points (Haversine formula)
     */
    calculateDistance(
        from: LocationCoords,
        to: LocationCoords
    ): number {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = (from.latitude * Math.PI) / 180;
        const φ2 = (to.latitude * Math.PI) / 180;
        const Δφ = ((to.latitude - from.latitude) * Math.PI) / 180;
        const Δλ = ((to.longitude - from.longitude) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
    }

    /**
     * Format distance for display
     */
    formatDistance(meters: number): string {
        if (meters < 1000) {
            return `${Math.round(meters)} m`;
        }
        return `${(meters / 1000).toFixed(1)} km`;
    }

    /**
     * Calculate ETA based on distance and speed
     */
    calculateETA(distanceMeters: number, speedKmh: number = 40): string {
        if (speedKmh <= 0) return 'N/A';

        const speedMs = (speedKmh * 1000) / 3600;
        const seconds = distanceMeters / speedMs;

        if (seconds < 60) {
            return 'Less than 1 min';
        } else if (seconds < 3600) {
            return `${Math.round(seconds / 60)} min`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const mins = Math.round((seconds % 3600) / 60);
            return `${hours}h ${mins}m`;
        }
    }

    /**
     * Get error message from error code
     */
    private getErrorMessage(code: number): string {
        switch (code) {
            case 1:
                return 'Location permission denied';
            case 2:
                return 'Location unavailable. Please enable GPS.';
            case 3:
                return 'Location request timed out';
            case 4:
                return 'Google Play Services not available';
            case 5:
                return 'Location settings not satisfied';
            default:
                return 'Unknown location error';
        }
    }
}

export const locationService = new LocationService();
export default locationService;
