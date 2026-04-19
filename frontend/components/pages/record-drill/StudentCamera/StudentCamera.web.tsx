import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Text, Pressable, ActivityIndicator } from 'react-native';
import { PoseOverlay } from './PoseOverlay';
import { PoseLandmark, CameraFacing } from '@/types/pose';

// MediaPipe types (loaded dynamically)
interface PoseLandmarkerResult {
    landmarks: Array<Array<{ x: number; y: number; z: number; visibility?: number }>>;
}

interface PoseLandmarker {
    detectForVideo: (video: HTMLVideoElement, timestamp: number) => PoseLandmarkerResult;
    close: () => void;
}

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

export const StudentCamera = forwardRef<StudentCameraRef, StudentCameraProps>(function StudentCamera({
    isRecording,
    onRecordingStart,
    onRecordingStop,
    facing = 'front',
    onFlipCamera,
    onPoseDetected,
}, ref) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [landmarks, setLandmarks] = useState<PoseLandmark[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState(false);

    const landmarkerRef = useRef<PoseLandmarker | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);

    // Initialize MediaPipe PoseLandmarker
    useEffect(() => {
        let mounted = true;

        const initializeMediaPipe = async () => {
            try {
                console.log('Loading MediaPipe PoseLandmarker...');

                // Dynamically import MediaPipe tasks-vision
                const { PoseLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
                console.log('MediaPipe module loaded');

                // Initialize the vision task
                const vision = await FilesetResolver.forVisionTasks(
                    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
                );
                console.log('Vision task resolver created');

                // Create pose landmarker
                const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
                        delegate: 'GPU',
                    },
                    runningMode: 'VIDEO',
                    numPoses: 1,
                });
                console.log('PoseLandmarker created successfully');

                if (mounted) {
                    landmarkerRef.current = poseLandmarker;
                    setIsLoading(false);
                    console.log('MediaPipe initialization complete');
                }
            } catch (err) {
                console.error('Failed to initialize MediaPipe:', err);
                if (mounted) {
                    setError(`Failed to load pose detection: ${err instanceof Error ? err.message : 'Unknown error'}`);
                    setIsLoading(false);
                }
            }
        };

        initializeMediaPipe();

        return () => {
            mounted = false;
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }
        };
    }, []);

    // Set up camera stream
    useEffect(() => {
        if (isLoading) {
            console.log('Waiting for MediaPipe to load...');
            return;
        }

        let mounted = true;

        const setupCamera = async () => {
            try {
                console.log('Requesting camera access...');
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: facing === 'front' ? 'user' : 'environment',
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    },
                    audio: false,
                });
                console.log('Camera access granted');

                if (!mounted) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                mediaStreamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                    setHasPermission(true);
                    console.log('Camera stream playing');
                }
            } catch (err: any) {
                console.error('Failed to get camera stream:', err);
                if (mounted) {
                    if (err.name === 'NotAllowedError') {
                        setError('Camera permission denied. Please allow camera access.');
                    } else {
                        setError(`Failed to access camera: ${err.message}`);
                    }
                }
            }
        };

        setupCamera();

        return () => {
            mounted = false;
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [isLoading, facing]);

    // Real-time pose detection loop
    useEffect(() => {
        if (!landmarkerRef.current || !videoRef.current || !hasPermission) {
            console.log('Pose detection not ready:', {
                hasLandmarker: !!landmarkerRef.current,
                hasVideo: !!videoRef.current,
                hasPermission
            });
            return;
        }

        console.log('Starting pose detection loop');
        let frameCount = 0;

        const detectPose = (timestamp: number) => {
            if (
                landmarkerRef.current &&
                videoRef.current &&
                videoRef.current.readyState >= 2
            ) {
                try {
                    const results = landmarkerRef.current.detectForVideo(videoRef.current, timestamp);

                    if (results.landmarks && results.landmarks.length > 0) {
                        const detectedLandmarks: PoseLandmark[] = results.landmarks[0].map(lm => ({
                            x: lm.x,
                            y: lm.y,
                            z: lm.z,
                            visibility: lm.visibility,
                        }));
                        setLandmarks(detectedLandmarks);
                        onPoseDetected?.(detectedLandmarks);

                        // Log every 60 frames to avoid spam
                        if (frameCount % 60 === 0) {
                            console.log('Pose detected:', detectedLandmarks.length, 'landmarks');
                        }
                        frameCount++;
                    } else {
                        if (frameCount % 60 === 0) {
                            console.log('No pose detected');
                        }
                        setLandmarks([]);
                        onPoseDetected?.([]);
                    }
                } catch (err) {
                    console.error('Pose detection error:', err);
                }
            }

            animationFrameRef.current = requestAnimationFrame(detectPose);
        };

        animationFrameRef.current = requestAnimationFrame(detectPose);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [hasPermission, onPoseDetected]);

    // Expose camera methods via ref
    useImperativeHandle(ref, () => ({
        recordAsync: async (options?: any) => {
            if (!mediaStreamRef.current) {
                console.error('No media stream available');
                return null;
            }

            try {
                recordedChunksRef.current = [];

                // Create MediaRecorder
                const mediaRecorder = new MediaRecorder(mediaStreamRef.current, {
                    mimeType: 'video/webm;codecs=vp9',
                });

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        recordedChunksRef.current.push(event.data);
                    }
                };

                return new Promise<{ uri: string }>((resolve, reject) => {
                    mediaRecorder.onstop = () => {
                        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                        const uri = URL.createObjectURL(blob);
                        resolve({ uri });
                    };

                    mediaRecorder.onerror = (event) => {
                        reject(new Error('Recording failed'));
                    };

                    mediaRecorderRef.current = mediaRecorder;
                    mediaRecorder.start();
                });
            } catch (error) {
                console.error('Failed to start recording:', error);
                return null;
            }
        },
        stopRecording: () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
        },
    }), []);

    // Loading state
    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#00FF88" />
                    <Text style={styles.loadingText}>Loading pose detection...</Text>
                </View>
            </View>
        );
    }

    // Error state
    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Pressable
                        style={styles.retryButton}
                        onPress={() => {
                            setError(null);
                            setIsLoading(true);
                        }}
                    >
                        <Text style={styles.retryText}>Retry</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <video
                ref={videoRef}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: facing === 'front' ? 'scaleX(-1)' : 'none',
                }}
                playsInline
                muted
                autoPlay
            />
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        color: 'white',
        marginTop: 16,
        fontSize: 16,
    },
    errorText: {
        color: '#FF6B6B',
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#00FF88',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryText: {
        color: 'black',
        fontWeight: '600',
        fontSize: 16,
    },
});