import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Pressable, Animated } from 'react-native';
import { RotateCcw, SwitchCamera, Circle, Square, X, Check } from 'lucide-react-native';
import { RecordingState, CameraFacing } from '@/types/pose';

interface CameraControlsProps {
    recordingState: RecordingState;
    cameraFacing: CameraFacing;
    hasSubmitted?: boolean;
    onStartRecording: () => void;
    onStopRecording: () => void;
    onFlipCamera: () => void;
    onCancel: () => void;
    onSubmit: () => void;
    onRetake?: () => void;
    maxDuration?: number; // in seconds
}

export function CameraControls({
    recordingState,
    cameraFacing,
    hasSubmitted = false,
    onStartRecording,
    onStopRecording,
    onFlipCamera,
    onCancel,
    onSubmit,
    onRetake,
    maxDuration = 60, // Default 60 seconds
}: CameraControlsProps) {
    const [recordingTime, setRecordingTime] = useState(0);
    const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Timer for recording duration
    useEffect(() => {
        if (recordingState === 'recording') {
            timerInterval.current = setInterval(() => {
                setRecordingTime(prev => {
                    if (prev >= maxDuration) {
                        onStopRecording();
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);
        } else {
            if (timerInterval.current) {
                clearInterval(timerInterval.current);
            }
            if (recordingState === 'idle') {
                setRecordingTime(0);
            }
        }

        return () => {
            if (timerInterval.current) {
                clearInterval(timerInterval.current);
            }
        };
    }, [recordingState, maxDuration, onStopRecording]);

    // Pulse animation for recording indicator
    useEffect(() => {
        if (recordingState === 'recording') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 500,
                        useNativeDriver: false,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: false,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [recordingState, pulseAnim]);

    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const isIdle = recordingState === 'idle';
    const isRecording = recordingState === 'recording';
    const isProcessing = recordingState === 'processing';
    const isComplete = recordingState === 'complete';

    return (
        <View style={styles.container}>
            {/* Timer display when recording */}
            {(isRecording || isComplete) && (
                <View style={styles.timerContainer}>
                    {isRecording && (
                        <Animated.View
                            style={[
                                styles.recordingDot,
                                { transform: [{ scale: pulseAnim }] },
                            ]}
                        />
                    )}
                    <Text style={[
                        styles.timerText,
                        recordingTime > maxDuration * 0.8 && styles.timerWarning,
                    ]}>
                        {formatTime(recordingTime)}
                    </Text>
                    {isRecording && (
                        <Text style={styles.timerMax}>/ {formatTime(maxDuration)}</Text>
                    )}
                </View>
            )}

            {/* Controls row */}
            <View style={styles.controlsRow}>
                {/* Cancel button (left) */}
                {isIdle ? (
                    <Pressable
                        style={styles.sideButton}
                        onPress={onCancel}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <X size={24} color="white" />
                        <Text style={styles.sideButtonText}>Cancel</Text>
                    </Pressable>
                ) : isComplete && !hasSubmitted ? (
                    <Pressable
                        style={styles.sideButton}
                        onPress={onRetake}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <RotateCcw size={24} color="white" />
                        <Text style={styles.sideButtonText}>Retake</Text>
                    </Pressable>
                ) : (
                    <View style={styles.sideButtonPlaceholder} />
                )}

                {/* Center button */}
                {isIdle && (
                    <Pressable
                        style={styles.recordButton}
                        onPress={onStartRecording}
                        disabled={isProcessing}
                    >
                        <Circle size={40} color="#FF3B30" fill="#FF3B30" />
                    </Pressable>
                )}

                {isRecording && (
                    <Pressable
                        style={styles.stopButton}
                        onPress={onStopRecording}
                    >
                        <Square size={32} color="white" fill="white" />
                    </Pressable>
                )}

                {isComplete && !hasSubmitted && (
                    <Pressable
                        style={styles.submitButton}
                        onPress={onSubmit}
                    >
                        <Text style={styles.submitText}>Submit</Text>
                    </Pressable>
                )}

                {isComplete && hasSubmitted && (
                    <View style={styles.submittedButton}>
                        <Text style={styles.submittedText}>Submitted ✓</Text>
                    </View>
                )}

                {isProcessing && (
                    <View style={styles.processingButton}>
                        <Text style={styles.processingText}>Processing...</Text>
                    </View>
                )}

                {/* Flip camera button (right) */}
                {(isIdle || isRecording) && (
                    <Pressable style={styles.sideButton} onPress={onFlipCamera}>
                        <SwitchCamera size={24} color="white" />
                        <Text style={styles.sideButtonText}>Flip</Text>
                    </Pressable>
                )}

                {isComplete && (
                    <View style={styles.sideButtonPlaceholder} />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    recordingDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FF3B30',
        marginRight: 8,
    },
    timerText: {
        color: 'white',
        fontSize: 24,
        fontWeight: '600',
        fontVariant: ['tabular-nums'],
    },
    timerWarning: {
        color: '#FF9500',
    },
    timerMax: {
        color: '#888',
        fontSize: 18,
        marginLeft: 4,
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sideButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
    },
    sideButtonText: {
        color: 'white',
        fontSize: 12,
        marginTop: 4,
    },
    sideButtonPlaceholder: {
        width: 70,
    },
    recordButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: 'white',
    },
    stopButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FF3B30',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: 'white',
    },
    submitButton: {
        width: 120,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#00FF88',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitText: {
        color: 'black',
        fontSize: 18,
        fontWeight: '600',
    },
    submittedButton: {
        width: 140,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(100, 100, 100, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submittedText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    processingButton: {
        width: 100,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    processingText: {
        color: 'white',
        fontSize: 14,
    },
});