import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Platform } from 'react-native';
import { PoseOverlay } from './StudentCamera/PoseOverlay';
import { PoseLandmark } from '@/types/pose';

interface InstructorVideoProps {
    videoUrl: string;
    autoPlay?: boolean;
    loop?: boolean;
    playbackSpeed?: number;
    onPoseDetected?: (landmarks: PoseLandmark[]) => void;
}

export function InstructorVideo({
    videoUrl,
    autoPlay = true,
    loop = true,
    playbackSpeed = 1,
    onPoseDetected,
}: InstructorVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [landmarks, setLandmarks] = useState<PoseLandmark[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const landmarkerRef = useRef<any>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Initialize MediaPipe for instructor video
    useEffect(() => {
        let mounted = true;

        const initializeMediaPipe = async () => {
            try {
                console.log('Loading MediaPipe for instructor video...');
                const { PoseLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');

                const vision = await FilesetResolver.forVisionTasks(
                    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
                );

                const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
                        delegate: 'GPU',
                    },
                    runningMode: 'VIDEO',
                    numPoses: 1,
                });

                if (mounted) {
                    landmarkerRef.current = poseLandmarker;
                    setIsLoading(false);
                    console.log('MediaPipe loaded for instructor video');
                }
            } catch (err) {
                console.error('Failed to initialize MediaPipe for instructor:', err);
                if (mounted) {
                    setError('Failed to load pose detection');
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

    // Set up video and pose detection
    useEffect(() => {
        if (!videoRef.current || isLoading) return;

        const video = videoRef.current;

        const handleLoadedData = () => {
            console.log('Instructor video loaded');
            if (autoPlay) {
                video.play().catch(e => console.log('Auto-play failed:', e));
            }
        };

        const handlePlay = () => {
            setIsPlaying(true);
            console.log('Instructor video playing');
        };

        const handlePause = () => {
            setIsPlaying(false);
            console.log('Instructor video paused');
        };

        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);

        return () => {
            video.removeEventListener('loadeddata', handleLoadedData);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
        };
    }, [isLoading, autoPlay]);

    // Apply playback speed
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed]);

    // Pose detection loop for instructor video
    useEffect(() => {
        if (!landmarkerRef.current || !videoRef.current || !isPlaying) return;

        let lastTimestamp = 0;

        const detectPose = (timestamp: number) => {
            if (
                landmarkerRef.current &&
                videoRef.current &&
                videoRef.current.readyState >= 2 &&
                isPlaying
            ) {
                try {
                    const results = landmarkerRef.current.detectForVideo(videoRef.current, timestamp);

                    if (results.landmarks && results.landmarks.length > 0) {
                        const detectedLandmarks: PoseLandmark[] = results.landmarks[0].map((lm: any) => ({
                            x: lm.x,
                            y: lm.y,
                            z: lm.z,
                            visibility: lm.visibility,
                        }));
                        setLandmarks(detectedLandmarks);
                        onPoseDetected?.(detectedLandmarks);
                    }
                } catch (err) {
                    console.error('Instructor pose detection error:', err);
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
    }, [isPlaying, onPoseDetected]);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#00FF88" />
                    <Text style={styles.loadingText}>Loading instructor video...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <video
                ref={videoRef}
                src={videoUrl}
                crossOrigin="anonymous"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    backgroundColor: '#1a1a1a',
                }}
                autoPlay={autoPlay}
                loop={loop}
                muted
                playsInline
                onError={(e) => {
                    const video = e.currentTarget;
                    console.error('Video error:', video.error?.code, video.error?.message);
                    setError(`Video failed to load (code ${video.error?.code})`);
                }}
            />
            <PoseOverlay landmarks={landmarks} />
            <View style={styles.labelContainer}>
                <View style={styles.label}>
                    <Text style={styles.labelText}>Example</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        position: 'relative',
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
    },
    labelContainer: {
        position: 'absolute',
        top: 12,
        left: 12,
    },
    label: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    labelText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
});