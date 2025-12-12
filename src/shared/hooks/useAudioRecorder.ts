/**
 * E-GOV-GUARDS-PORTAL - useAudioRecorder Hook
 * React hook for audio recording and playback
 */

import { useState, useCallback, useEffect } from 'react';
import audioService, { RecordingResult, RecordingState } from '../services/AudioService';

export interface UseAudioRecorderReturn {
    state: RecordingState;
    recording: RecordingResult | null;
    startRecording: () => Promise<RecordingResult>;
    pauseRecording: () => Promise<boolean>;
    resumeRecording: () => Promise<boolean>;
    stopRecording: () => Promise<RecordingResult>;
    startPlayback: (uri: string) => Promise<boolean>;
    pausePlayback: () => Promise<boolean>;
    resumePlayback: () => Promise<boolean>;
    stopPlayback: () => Promise<void>;
    deleteRecording: (uri: string) => Promise<boolean>;
    formatDuration: (ms: number) => string;
}

export const useAudioRecorder = (): UseAudioRecorderReturn => {
    const [state, setState] = useState<RecordingState>(audioService.getState());
    const [recording, setRecording] = useState<RecordingResult | null>(null);

    // Subscribe to state changes
    useEffect(() => {
        audioService.setOnStateChange((newState) => {
            setState({ ...newState });
        });

        return () => {
            audioService.cleanup();
        };
    }, []);

    const startRecording = useCallback(async (): Promise<RecordingResult> => {
        const result = await audioService.startRecording();
        if (result.success) {
            setRecording(result);
        }
        return result;
    }, []);

    const pauseRecording = useCallback(async (): Promise<boolean> => {
        return audioService.pauseRecording();
    }, []);

    const resumeRecording = useCallback(async (): Promise<boolean> => {
        return audioService.resumeRecording();
    }, []);

    const stopRecording = useCallback(async (): Promise<RecordingResult> => {
        const result = await audioService.stopRecording();
        if (result.success) {
            setRecording(result);
        }
        return result;
    }, []);

    const startPlayback = useCallback(async (uri: string): Promise<boolean> => {
        return audioService.startPlayback(uri);
    }, []);

    const pausePlayback = useCallback(async (): Promise<boolean> => {
        return audioService.pausePlayback();
    }, []);

    const resumePlayback = useCallback(async (): Promise<boolean> => {
        return audioService.resumePlayback();
    }, []);

    const stopPlayback = useCallback(async (): Promise<void> => {
        return audioService.stopPlayback();
    }, []);

    const deleteRecording = useCallback(async (uri: string): Promise<boolean> => {
        const result = await audioService.deleteRecording(uri);
        if (result) {
            setRecording(null);
        }
        return result;
    }, []);

    const formatDuration = useCallback((ms: number): string => {
        return audioService.formatDuration(ms);
    }, []);

    return {
        state,
        recording,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        startPlayback,
        pausePlayback,
        resumePlayback,
        stopPlayback,
        deleteRecording,
        formatDuration,
    };
};

export default useAudioRecorder;
