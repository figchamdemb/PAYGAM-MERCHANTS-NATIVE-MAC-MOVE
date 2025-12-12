declare module '@react-native-community/geolocation' {
  export interface GeolocationOptions {
    timeout?: number;
    maximumAge?: number;
    enableHighAccuracy?: boolean;
    distanceFilter?: number;
    useSignificantChanges?: boolean;
  }

  export interface GeolocationPosition {
    coords: {
      latitude: number;
      longitude: number;
      altitude: number | null;
      accuracy: number;
      altitudeAccuracy: number | null;
      heading: number | null;
      speed: number | null;
    };
    timestamp: number;
  }

  export interface GeolocationError {
    code: number;
    message: string;
    PERMISSION_DENIED: number;
    POSITION_UNAVAILABLE: number;
    TIMEOUT: number;
  }

  type SuccessCallback = (position: GeolocationPosition) => void;
  type ErrorCallback = (error: GeolocationError) => void;

  interface Geolocation {
    setRNConfiguration(config: { skipPermissionRequests: boolean; authorizationLevel?: string }): void;
    requestAuthorization(): void;
    getCurrentPosition(
      success: SuccessCallback,
      error?: ErrorCallback,
      options?: GeolocationOptions
    ): void;
    watchPosition(
      success: SuccessCallback,
      error?: ErrorCallback,
      options?: GeolocationOptions
    ): number;
    clearWatch(watchId: number): void;
    stopObserving(): void;
  }

  const Geolocation: Geolocation;
  export default Geolocation;
}
