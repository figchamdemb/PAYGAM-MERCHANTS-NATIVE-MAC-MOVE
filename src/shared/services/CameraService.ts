/**
 * E-GOV-GUARDS-PORTAL - Camera Service
 * Real Camera Service using react-native-vision-camera and image-picker
 * 
 * Features:
 * - Take photos
 * - Record videos
 * - Pick from gallery
 * - Handle permissions
 */

import { Platform, PermissionsAndroid, Alert } from 'react-native';
import {
    launchCamera,
    launchImageLibrary,
    ImagePickerResponse,
    CameraOptions,
    ImageLibraryOptions,
    Asset,
} from 'react-native-image-picker';

export interface MediaResult {
    success: boolean;
    uri?: string;
    type?: 'photo' | 'video';
    fileName?: string;
    fileSize?: number;
    width?: number;
    height?: number;
    duration?: number;
    error?: string;
}

export interface CaptureOptions {
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    includeBase64?: boolean;
    saveToPhotos?: boolean;
    cameraType?: 'front' | 'back';
    videoQuality?: 'low' | 'high';
    durationLimit?: number;
}

class CameraService {
    /**
     * Request camera permissions
     */
    async requestCameraPermission(): Promise<boolean> {
        if (Platform.OS === 'ios') {
            return true; // iOS handles permissions in picker
        }

        try {
            const cameraPermission = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera Permission',
                    message: 'E-GOV Guards Portal needs camera access to capture evidence.',
                    buttonPositive: 'Grant',
                    buttonNegative: 'Deny',
                }
            );

            return cameraPermission === PermissionsAndroid.RESULTS.GRANTED;
        } catch (error) {
            console.error('Camera permission error:', error);
            return false;
        }
    }

    /**
     * Request storage/media permissions for Android
     */
    async requestStoragePermission(): Promise<boolean> {
        if (Platform.OS === 'ios') {
            return true;
        }

        try {
            if (Platform.Version >= 33) {
                // Android 13+
                const readImages = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                );
                const readVideo = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
                );
                return (
                    readImages === PermissionsAndroid.RESULTS.GRANTED &&
                    readVideo === PermissionsAndroid.RESULTS.GRANTED
                );
            } else {
                const readStorage = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                );
                return readStorage === PermissionsAndroid.RESULTS.GRANTED;
            }
        } catch (error) {
            console.error('Storage permission error:', error);
            return false;
        }
    }

    /**
     * Take a photo with the camera
     */
    async takePhoto(options?: CaptureOptions): Promise<MediaResult> {
        const hasPermission = await this.requestCameraPermission();

        if (!hasPermission) {
            return {
                success: false,
                error: 'Camera permission not granted',
            };
        }

        const cameraOptions: CameraOptions = {
            mediaType: 'photo',
            quality: options?.quality ?? 0.8,
            maxWidth: options?.maxWidth ?? 1920,
            maxHeight: options?.maxHeight ?? 1080,
            includeBase64: options?.includeBase64 ?? false,
            saveToPhotos: options?.saveToPhotos ?? false,
            cameraType: options?.cameraType ?? 'back',
        };

        return new Promise((resolve) => {
            launchCamera(cameraOptions, (response: ImagePickerResponse) => {
                if (response.didCancel) {
                    resolve({
                        success: false,
                        error: 'User cancelled camera',
                    });
                } else if (response.errorCode) {
                    resolve({
                        success: false,
                        error: response.errorMessage || 'Camera error',
                    });
                } else if (response.assets && response.assets.length > 0) {
                    const asset = response.assets[0];
                    resolve({
                        success: true,
                        uri: asset.uri,
                        type: 'photo',
                        fileName: asset.fileName,
                        fileSize: asset.fileSize,
                        width: asset.width,
                        height: asset.height,
                    });
                } else {
                    resolve({
                        success: false,
                        error: 'No image captured',
                    });
                }
            });
        });
    }

    /**
     * Record a video with the camera
     */
    async recordVideo(options?: CaptureOptions): Promise<MediaResult> {
        const hasPermission = await this.requestCameraPermission();

        if (!hasPermission) {
            return {
                success: false,
                error: 'Camera permission not granted',
            };
        }

        const cameraOptions: CameraOptions = {
            mediaType: 'video',
            videoQuality: options?.videoQuality ?? 'high',
            durationLimit: options?.durationLimit ?? 60,
            saveToPhotos: options?.saveToPhotos ?? false,
            cameraType: options?.cameraType ?? 'back',
        };

        return new Promise((resolve) => {
            launchCamera(cameraOptions, (response: ImagePickerResponse) => {
                if (response.didCancel) {
                    resolve({
                        success: false,
                        error: 'User cancelled recording',
                    });
                } else if (response.errorCode) {
                    resolve({
                        success: false,
                        error: response.errorMessage || 'Video recording error',
                    });
                } else if (response.assets && response.assets.length > 0) {
                    const asset = response.assets[0];
                    resolve({
                        success: true,
                        uri: asset.uri,
                        type: 'video',
                        fileName: asset.fileName,
                        fileSize: asset.fileSize,
                        width: asset.width,
                        height: asset.height,
                        duration: asset.duration,
                    });
                } else {
                    resolve({
                        success: false,
                        error: 'No video recorded',
                    });
                }
            });
        });
    }

    /**
     * Pick photo from gallery
     */
    async pickPhoto(options?: CaptureOptions): Promise<MediaResult> {
        await this.requestStoragePermission();

        const libraryOptions: ImageLibraryOptions = {
            mediaType: 'photo',
            quality: options?.quality ?? 0.8,
            maxWidth: options?.maxWidth ?? 1920,
            maxHeight: options?.maxHeight ?? 1080,
            includeBase64: options?.includeBase64 ?? false,
            selectionLimit: 1,
        };

        return new Promise((resolve) => {
            launchImageLibrary(libraryOptions, (response: ImagePickerResponse) => {
                if (response.didCancel) {
                    resolve({
                        success: false,
                        error: 'User cancelled selection',
                    });
                } else if (response.errorCode) {
                    resolve({
                        success: false,
                        error: response.errorMessage || 'Gallery error',
                    });
                } else if (response.assets && response.assets.length > 0) {
                    const asset = response.assets[0];
                    resolve({
                        success: true,
                        uri: asset.uri,
                        type: 'photo',
                        fileName: asset.fileName,
                        fileSize: asset.fileSize,
                        width: asset.width,
                        height: asset.height,
                    });
                } else {
                    resolve({
                        success: false,
                        error: 'No image selected',
                    });
                }
            });
        });
    }

    /**
     * Pick video from gallery
     */
    async pickVideo(options?: CaptureOptions): Promise<MediaResult> {
        await this.requestStoragePermission();

        const libraryOptions: ImageLibraryOptions = {
            mediaType: 'video',
            selectionLimit: 1,
        };

        return new Promise((resolve) => {
            launchImageLibrary(libraryOptions, (response: ImagePickerResponse) => {
                if (response.didCancel) {
                    resolve({
                        success: false,
                        error: 'User cancelled selection',
                    });
                } else if (response.errorCode) {
                    resolve({
                        success: false,
                        error: response.errorMessage || 'Gallery error',
                    });
                } else if (response.assets && response.assets.length > 0) {
                    const asset = response.assets[0];
                    resolve({
                        success: true,
                        uri: asset.uri,
                        type: 'video',
                        fileName: asset.fileName,
                        fileSize: asset.fileSize,
                        width: asset.width,
                        height: asset.height,
                        duration: asset.duration,
                    });
                } else {
                    resolve({
                        success: false,
                        error: 'No video selected',
                    });
                }
            });
        });
    }

    /**
     * Pick multiple photos from gallery
     */
    async pickMultiplePhotos(limit: number = 5): Promise<MediaResult[]> {
        await this.requestStoragePermission();

        const libraryOptions: ImageLibraryOptions = {
            mediaType: 'photo',
            quality: 0.8,
            selectionLimit: limit,
        };

        return new Promise((resolve) => {
            launchImageLibrary(libraryOptions, (response: ImagePickerResponse) => {
                if (response.didCancel) {
                    resolve([]);
                } else if (response.errorCode) {
                    resolve([]);
                } else if (response.assets && response.assets.length > 0) {
                    const results = response.assets.map((asset: Asset) => ({
                        success: true,
                        uri: asset.uri,
                        type: 'photo' as const,
                        fileName: asset.fileName,
                        fileSize: asset.fileSize,
                        width: asset.width,
                        height: asset.height,
                    }));
                    resolve(results);
                } else {
                    resolve([]);
                }
            });
        });
    }

    /**
     * Show action sheet to pick source
     */
    async captureOrPick(type: 'photo' | 'video' = 'photo'): Promise<MediaResult> {
        return new Promise((resolve) => {
            Alert.alert(
                type === 'photo' ? 'Add Photo' : 'Add Video',
                'Choose source',
                [
                    {
                        text: 'Camera',
                        onPress: async () => {
                            const result = type === 'photo'
                                ? await this.takePhoto()
                                : await this.recordVideo();
                            resolve(result);
                        },
                    },
                    {
                        text: 'Gallery',
                        onPress: async () => {
                            const result = type === 'photo'
                                ? await this.pickPhoto()
                                : await this.pickVideo();
                            resolve(result);
                        },
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => resolve({ success: false, error: 'Cancelled' }),
                    },
                ]
            );
        });
    }
}

export const cameraService = new CameraService();
export default cameraService;
