import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
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
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize video player with the instructor's video URL
    const player = useVideoPlayer(videoUrl, (player) => {
        console.log('Instructor video player initialized');
        player.muted = true;
        player.loop = loop;
    });

    // Apply playback speed
    useEffect(() => {
        player.playbackRate = playbackSpeed;
    }, [player, playbackSpeed]);

    // Handle video status changes
    useEffect(() => {
        const subscription = player.addListener('statusChange', (event) => {
            console.log('Instructor video status:', event);
            if (event.status === 'readyToPlay') {
                setIsReady(true);
                setError(null);
                if (autoPlay) {
                    player.play();
                }
            } else if (event.status === 'error') {
                setError('Failed to load video');
                console.error('Instructor video error');
            }
        });

        return () => {
            subscription.remove();
        };
    }, [player, autoPlay]);

    // Note: For mobile, pose detection on instructor video would need to be done
    // either via pre-processing or streaming frames to backend
    // This is a placeholder for that functionality

    if (!videoUrl) {
        return (
            <View style={styles.container}>
                <View style={styles.centerContainer}>
                    <Text style={styles.placeholderText}>No example video available</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <VideoView
                player={player}
                style={styles.video}
                contentFit="contain"
                nativeControls={false}
            />
            {!isReady && !error && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#00FF88" />
                </View>
            )}
            {error && (
                <View style={styles.loadingOverlay}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
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
    },
    video: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
    },
    placeholderText: {
        color: '#666',
        fontSize: 16,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 14,
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