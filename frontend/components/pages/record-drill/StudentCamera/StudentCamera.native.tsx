import React, { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { PoseOverlay } from './PoseOverlay';
import { PoseLandmark, CameraFacing } from '@/types/pose';
import { analyzeFrame } from '@/services/poseAnalysis';

interface StudentCameraProps {
    isRecording: boolean;
    onRecordingStart?: () => void;
    onRecordingStop?: (videoUri: string) => void;
    facing?: CameraFacing;
    onFlipCamera?: () => void;
    onPoseDetected?: (landmarks: PoseLandmark[]) => void;
}

export interface StudentCameraRef {
    recordAsync: (options?: any) => Promise<{ uri: string } | null>;
    stopRecording: () => void;
}

// Frame analysis interval in milliseconds (5-10 FPS for balance between responsiveness and server load)
const FRAME_ANALYSIS_INTERVAL = 200;

export const StudentCamera = forwardRef<StudentCameraRef, StudentCameraProps>(function StudentCamera({
    isRecording,
    onRecordingStart,
    onRecordingStop,
    facing = 'front',
    onFlipCamera,
    onPoseDetected,
}, ref) {
    const [permission, requestPermission] = useCameraPermissions();
    const [landmarks, setLandmarks] = useState<PoseLandmark[]>([]);
    const [cameraReady, setCameraReady] = useState(false);

    const cameraRef = useRef<CameraView>(null);
    const isAnalyzing = useRef(false);
    const analysisInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    // Convert facing mode to CameraType
    const cameraType: CameraType = facing === 'front' ? 'front' : 'back';

    // Capture frame and analyze for pose
    const captureAndAnalyze = useCallback(async () => {
        if (isAnalyzing.current || !cameraRef.current || !cameraReady) {
            return;
        }

        isAnalyzing.current = true;

        try {
            // Take a snapshot for pose analysis
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.3, // Lower quality for faster upload
                base64: true,
                skipProcessing: true, // Skip additional processing for speed
            });

            if (photo?.base64) {
                // Send to backend for analysis
                const result = await analyzeFrame(photo.base64);

                if (result.success && result.landmarks.length > 0) {
                    setLandmarks(result.landmarks);
                    onPoseDetected?.(result.landmarks);
                } else {
                    onPoseDetected?.([]);
                }
            }
        } catch (error) {
            console.error('Frame analysis error:', error);
        } finally {
            isAnalyzing.current = false;
        }
    }, [cameraReady]);

    // Start/stop frame analysis based on camera ready state
    useEffect(() => {
        if (cameraReady && !isRecording) {
            // Start periodic frame analysis
            analysisInterval.current = setInterval(captureAndAnalyze, FRAME_ANALYSIS_INTERVAL);
        }

        return () => {
            if (analysisInterval.current) {
                clearInterval(analysisInterval.current);
                analysisInterval.current = null;
            }
        };
    }, [cameraReady, isRecording, captureAndAnalyze]);

    // Expose camera methods via ref
    useImperativeHandle(ref, () => ({
        recordAsync: async (options?: any): Promise<{ uri: string } | null> => {
            if (cameraRef.current) {
                try {
                    const result = await cameraRef.current.recordAsync(options);
                    return result || null;
                } catch (error) {
                    console.error('Recording error:', error);
                    return null;
                }
            }
            return null;
        },
        stopRecording: () => {
            if (cameraRef.current) {
                cameraRef.current.stopRecording();
            }
        },
    }), []);

    // Handle permission
    if (!permission) {
        // Camera permissions are still loading
        return (
            <View style={styles.container}>
                <View style={styles.permissionContainer}>
                    {/* Loading state */}
                </View>
            </View>
        );
    }

    if (!permission.granted) {
        // Camera permissions not granted
        return (
            <View style={styles.container}>
                <View style={styles.permissionContainer}>
                    {/* Permission request UI - handled by parent component */}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={cameraType}
                onCameraReady={() => setCameraReady(true)}
                mode="video" // Enable video recording mode
                mute={true} // Mute camera sounds
            />
            {/* Pose overlay */}
            <PoseOverlay landmarks={landmarks} />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
});