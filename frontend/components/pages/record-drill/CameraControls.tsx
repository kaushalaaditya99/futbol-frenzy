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
    onCountdownComplete?: () => void;
    maxDuration?: number;
    countdownDuration?: number;
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
    onCountdownComplete,
    maxDuration = 60, // Default 60 seconds
    countdownDuration = 10, // Default 10 second countdown
}: CameraControlsProps) {
    const [recordingTime, setRecordingTime] = useState(0);
    const [countdownTime, setCountdownTime] = useState(countdownDuration);
    const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const hasAutoStopped = useRef(false);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const countdownPulseAnim = useRef(new Animated.Value(1)).current;

    // Timer for recording duration
    useEffect(() => {
        if (recordingState === 'recording') {
            // reset recording time and auto-stop flag when starting
            setRecordingTime(0);
            hasAutoStopped.current = false;

            timerInterval.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            if (timerInterval.current) {
                clearInterval(timerInterval.current);
                timerInterval.current = null;
            }
            if (recordingState === 'idle') {
                setRecordingTime(0);
            }
        }

        return () => {
            if (timerInterval.current) {
                clearInterval(timerInterval.current);
                timerInterval.current = null;
            }
        };
    }, [recordingState]);

    // Auto-stop when max duration reached
    useEffect(() => {
        if (
            recordingState === 'recording' &&
            recordingTime >= maxDuration &&
            !hasAutoStopped.current
        ) {
            hasAutoStopped.current = true;
            onStopRecording();
        }
    }, [recordingTime, recordingState, maxDuration, onStopRecording]);

    // Countdown timer before recording
    useEffect(() => {
        if (recordingState === 'countdown') {
            setCountdownTime(countdownDuration);
            countdownInterval.current = setInterval(() => {
                setCountdownTime(prev => {
                    if (prev <= 1) {
                        // Countdown finished, trigger callback
                        clearInterval(countdownInterval.current!);
                        onCountdownComplete?.();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (countdownInterval.current) {
                clearInterval(countdownInterval.current);
            }
            if (recordingState === 'idle') {
                setCountdownTime(countdownDuration);
            }
        }

        return () => {
            if (countdownInterval.current) {
                clearInterval(countdownInterval.current);
            }
        };
    }, [recordingState, countdownDuration, onCountdownComplete]);

    
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

    // Pulse animation for countdown
    useEffect(() => {
        if (recordingState === 'countdown') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(countdownPulseAnim, {
                        toValue: 1.3,
                        duration: 300,
                        useNativeDriver: false,
                    }),
                    Animated.timing(countdownPulseAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: false,
                    }),
                ])
            ).start();
        } else {
            countdownPulseAnim.setValue(1);
        }
    }, [recordingState, countdownPulseAnim]);

    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const isIdle = recordingState === 'idle';
    const isCountdown = recordingState === 'countdown';
    const isRecording = recordingState === 'recording';
    const isProcessing = recordingState === 'processing';
    const isComplete = recordingState === 'complete';

    return (
        <View style={styles.container}>
            {/* Countdown display */}
            {isCountdown && (
                <View style={styles.countdownContainer}>
                    <Animated.Text
                        style={[
                            styles.countdownText,
                            { transform: [{ scale: countdownPulseAnim }] },
                        ]}
                    >
                        {countdownTime}
                    </Animated.Text>
                    <Text style={styles.countdownSubtext}>Get ready...</Text>
                </View>
            )}

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
                {(isIdle || isCountdown) ? (
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

                {isCountdown && (
                    <View style={styles.countdownButton}>
                        <Text style={styles.countdownButtonText}>Starting...</Text>
                    </View>
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

                {/* Flip camera button (right)*/}
                {isIdle && (
                    <Pressable style={styles.sideButton} onPress={onFlipCamera}>
                        <SwitchCamera size={24} color="white" />
                        <Text style={styles.sideButtonText}>Flip</Text>
                    </Pressable>
                )}

                {(isCountdown || isRecording || isProcessing) && (
                    <View style={styles.sideButtonPlaceholder} />
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
    countdownContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    countdownText: {
        color: '#00FF88',
        fontSize: 72,
        fontWeight: '700',
    },
    countdownSubtext: {
        color: 'white',
        fontSize: 18,
        marginTop: 8,
    },
    countdownButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(0, 255, 136, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#00FF88',
    },
    countdownButtonText: {
        color: '#00FF88',
        fontSize: 12,
        fontWeight: '600',
    },
});