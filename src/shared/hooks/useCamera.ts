/**
 * E-GOV-GUARDS-PORTAL - useCamera Hook
 * React hook for camera and media operations
 */

import { useState, useCallback } from 'react';
import cameraService, { MediaResult, CaptureOptions } from '../services/CameraService';

export interface UseCameraReturn {
    media: MediaResult | null;
    loading: boolean;
    error: string | null;
    takePhoto: (options?: CaptureOptions) => Promise<MediaResult>;
    recordVideo: (options?: CaptureOptions) => Promise<MediaResult>;
    pickPhoto: (options?: CaptureOptions) => Promise<MediaResult>;
    pickVideo: (options?: CaptureOptions) => Promise<MediaResult>;
    pickMultiple: (limit?: number) => Promise<MediaResult[]>;
    captureOrPick: (type?: 'photo' | 'video') => Promise<MediaResult>;
    clearMedia: () => void;
}

export const useCamera = (): UseCameraReturn => {
    const [media, setMedia] = useState<MediaResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleResult = (result: MediaResult): MediaResult => {
        if (result.success) {
            setMedia(result);
            setError(null);
        } else {
            setError(result.error || 'Operation failed');
        }
        setLoading(false);
        return result;
    };

    const takePhoto = useCallback(async (options?: CaptureOptions): Promise<MediaResult> => {
        setLoading(true);
        setError(null);
        const result = await cameraService.takePhoto(options);
        return handleResult(result);
    }, []);

    const recordVideo = useCallback(async (options?: CaptureOptions): Promise<MediaResult> => {
        setLoading(true);
        setError(null);
        const result = await cameraService.recordVideo(options);
        return handleResult(result);
    }, []);

    const pickPhoto = useCallback(async (options?: CaptureOptions): Promise<MediaResult> => {
        setLoading(true);
        setError(null);
        const result = await cameraService.pickPhoto(options);
        return handleResult(result);
    }, []);

    const pickVideo = useCallback(async (options?: CaptureOptions): Promise<MediaResult> => {
        setLoading(true);
        setError(null);
        const result = await cameraService.pickVideo(options);
        return handleResult(result);
    }, []);

    const pickMultiple = useCallback(async (limit: number = 5): Promise<MediaResult[]> => {
        setLoading(true);
        setError(null);
        const results = await cameraService.pickMultiplePhotos(limit);
        setLoading(false);
        if (results.length > 0) {
            setMedia(results[0]);
        }
        return results;
    }, []);

    const captureOrPick = useCallback(async (type: 'photo' | 'video' = 'photo'): Promise<MediaResult> => {
        setLoading(true);
        setError(null);
        const result = await cameraService.captureOrPick(type);
        return handleResult(result);
    }, []);

    const clearMedia = useCallback(() => {
        setMedia(null);
        setError(null);
    }, []);

    return {
        media,
        loading,
        error,
        takePhoto,
        recordVideo,
        pickPhoto,
        pickVideo,
        pickMultiple,
        captureOrPick,
        clearMedia,
    };
};

export default useCamera;
