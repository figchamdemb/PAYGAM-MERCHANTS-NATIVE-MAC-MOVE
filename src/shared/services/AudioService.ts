/**
 * E-GOV-GUARDS-PORTAL - Audio Recording Service
 * Real Audio Recording using react-native-audio-recorder-player
 * 
 * Features:
 * - Record audio
 * - Playback audio
 * - Get recording duration
 * - Handle permissions
 */

import { Platform, PermissionsAndroid } from 'react-native';
import AudioRecorderPlayer, {
    AudioEncoderAndroidType,
    AudioSourceAndroidType,
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    OutputFormatAndroidType,
    RecordBackType,
    PlayBackType,
} from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';

export interface RecordingResult {
    success: boolean;
    uri?: string;
    duration?: number;
    error?: string;
}

export interface RecordingState {
    isRecording: boolean;
    isPaused: boolean;
    isPlaying: boolean;
    currentPosition: number;
    duration: number;
    recordingPath?: string;
}

class AudioService {
    private audioRecorderPlayer: AudioRecorderPlayer;
    private state: RecordingState;
    private onStateChange?: (state: RecordingState) => void;

    constructor() {
        this.audioRecorderPlayer = new AudioRecorderPlayer();
        this.state = {
            isRecording: false,
            isPaused: false,
            isPlaying: false,
            currentPosition: 0,
            duration: 0,
        };
    }

    /**
     * Set state change listener
     */
    setOnStateChange(callback: (state: RecordingState) => void): void {
        this.onStateChange = callback;
    }

    /**
     * Update state and notify listener
     */
    private updateState(updates: Partial<RecordingState>): void {
        this.state = { ...this.state, ...updates };
        this.onStateChange?.(this.state);
    }

    /**
     * Request microphone permissions
     */
    async requestMicrophonePermission(): Promise<boolean> {
        if (Platform.OS === 'ios') {
            return true; // iOS handles permissions in recorder
        }

        try {
            const recordPermission = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    title: 'Microphone Permission',
                    message: 'E-GOV Guards Portal needs microphone access to record audio evidence.',
                    buttonPositive: 'Grant',
                    buttonNegative: 'Deny',
                }
            );

            if (recordPermission !== PermissionsAndroid.RESULTS.GRANTED) {
                return false;
            }

            // Also request storage for saving recordings
            if (Platform.Version < 33) {
                const writePermission = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );
                return writePermission === PermissionsAndroid.RESULTS.GRANTED;
            }

            return true;
        } catch (error) {
            console.error('Microphone permission error:', error);
            return false;
        }
    }

    /**
     * Generate unique recording filename
     */
    private generateRecordingPath(): string {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `recording_${timestamp}`;

        if (Platform.OS === 'android') {
            return `${RNFS.CachesDirectoryPath}/${filename}.mp4`;
        } else {
            return `${RNFS.DocumentDirectoryPath}/${filename}.m4a`;
        }
    }

    /**
     * Start recording audio
     */
    async startRecording(): Promise<RecordingResult> {
        const hasPermission = await this.requestMicrophonePermission();

        if (!hasPermission) {
            return {
                success: false,
                error: 'Microphone permission not granted',
            };
        }

        try {
            const path = this.generateRecordingPath();

            const audioSet = {
                AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
                AudioSourceAndroid: AudioSourceAndroidType.MIC,
                AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
                AVNumberOfChannelsKeyIOS: 2,
                AVFormatIDKeyIOS: AVEncodingOption.aac,
                OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
            };

            const uri = await this.audioRecorderPlayer.startRecorder(path, audioSet);

            this.audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
                this.updateState({
                    isRecording: true,
                    currentPosition: e.currentPosition,
                    duration: e.currentPosition,
                    recordingPath: uri,
                });
            });

            this.updateState({
                isRecording: true,
                isPaused: false,
                recordingPath: uri,
            });

            return {
                success: true,
                uri,
            };
        } catch (error) {
            console.error('Start recording error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to start recording',
            };
        }
    }

    /**
     * Pause recording
     */
    async pauseRecording(): Promise<boolean> {
        try {
            await this.audioRecorderPlayer.pauseRecorder();
            this.updateState({ isPaused: true });
            return true;
        } catch (error) {
            console.error('Pause recording error:', error);
            return false;
        }
    }

    /**
     * Resume recording
     */
    async resumeRecording(): Promise<boolean> {
        try {
            await this.audioRecorderPlayer.resumeRecorder();
            this.updateState({ isPaused: false });
            return true;
        } catch (error) {
            console.error('Resume recording error:', error);
            return false;
        }
    }

    /**
     * Stop recording and return result
     */
    async stopRecording(): Promise<RecordingResult> {
        try {
            const uri = await this.audioRecorderPlayer.stopRecorder();
            this.audioRecorderPlayer.removeRecordBackListener();

            const finalDuration = this.state.duration;

            this.updateState({
                isRecording: false,
                isPaused: false,
                currentPosition: 0,
            });

            return {
                success: true,
                uri,
                duration: finalDuration,
            };
        } catch (error) {
            console.error('Stop recording error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to stop recording',
            };
        }
    }

    /**
     * Start playback of audio file
     */
    async startPlayback(uri: string): Promise<boolean> {
        try {
            await this.audioRecorderPlayer.startPlayer(uri);

            this.audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
                this.updateState({
                    isPlaying: e.currentPosition < e.duration,
                    currentPosition: e.currentPosition,
                    duration: e.duration,
                });

                if (e.currentPosition >= e.duration) {
                    this.stopPlayback();
                }
            });

            this.updateState({ isPlaying: true });
            return true;
        } catch (error) {
            console.error('Start playback error:', error);
            return false;
        }
    }

    /**
     * Pause playback
     */
    async pausePlayback(): Promise<boolean> {
        try {
            await this.audioRecorderPlayer.pausePlayer();
            this.updateState({ isPlaying: false });
            return true;
        } catch (error) {
            console.error('Pause playback error:', error);
            return false;
        }
    }

    /**
     * Resume playback
     */
    async resumePlayback(): Promise<boolean> {
        try {
            await this.audioRecorderPlayer.resumePlayer();
            this.updateState({ isPlaying: true });
            return true;
        } catch (error) {
            console.error('Resume playback error:', error);
            return false;
        }
    }

    /**
     * Stop playback
     */
    async stopPlayback(): Promise<void> {
        try {
            await this.audioRecorderPlayer.stopPlayer();
            this.audioRecorderPlayer.removePlayBackListener();
            this.updateState({
                isPlaying: false,
                currentPosition: 0,
            });
        } catch (error) {
            console.error('Stop playback error:', error);
        }
    }

    /**
     * Seek to position in playback
     */
    async seekTo(position: number): Promise<void> {
        try {
            await this.audioRecorderPlayer.seekToPlayer(position);
        } catch (error) {
            console.error('Seek error:', error);
        }
    }

    /**
     * Format duration for display (mm:ss)
     */
    formatDuration(milliseconds: number): string {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Get current state
     */
    getState(): RecordingState {
        return { ...this.state };
    }

    /**
     * Delete recording file
     */
    async deleteRecording(uri: string): Promise<boolean> {
        try {
            const exists = await RNFS.exists(uri);
            if (exists) {
                await RNFS.unlink(uri);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Delete recording error:', error);
            return false;
        }
    }

    /**
     * Get file size of recording
     */
    async getFileSize(uri: string): Promise<number> {
        try {
            const stat = await RNFS.stat(uri);
            return stat.size;
        } catch (error) {
            console.error('Get file size error:', error);
            return 0;
        }
    }

    /**
     * Clean up resources
     */
    async cleanup(): Promise<void> {
        await this.stopRecording();
        await this.stopPlayback();
    }
}

export const audioService = new AudioService();
export default audioService;
