import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform, Text, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SplitScreenLayout } from './SplitScreenLayout';
import { InstructorVideo } from './InstructorVideo';
import { StudentCamera } from './StudentCamera';
import type { StudentCameraRef } from './StudentCamera';
import { CameraControls } from './CameraControls';
import { LiveScoreBadge, ScoreDisplay } from './ScoreDisplay';
import { useCameraPermission } from '@/hooks/useCameraPermission';
import { RecordingState, CameraFacing, PoseLandmark } from '@/types/pose';
import { comparePoses } from '@/utils/poseComparison';
import { uploadVideo, createSubmission, saveSubmittedDrillWithUrl } from '@/services/cloud';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RecordDrillScreenProps {
    drillId: number;
    drillName: string;
    instructorVideoUrl: string;
    assignmentId: number;
}

export function RecordDrillScreen({
    drillId,
    drillName,
    instructorVideoUrl,
    assignmentId,
}: RecordDrillScreenProps) {
    const router = useRouter();

    // Permission state
    const { granted: hasCameraPermission, request: requestCameraPermission } = useCameraPermission();

    // Recording state
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const [cameraFacing, setCameraFacing] = useState<CameraFacing>('front');
    const [recordedVideoUri, setRecordedVideoUri] = useState<string | null>(null);

    // Playback speed (0.5x, 0.75x, 1x)
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const cyclePlaybackSpeed = useCallback(() => {
        setPlaybackSpeed(prev => {
            if (prev === 1) return 0.5;
            if (prev === 0.5) return 0.75;
            return 1;
        });
    }, []);

    // Pose tracking
    const [instructorPose, setInstructorPose] = useState<PoseLandmark[]>([]);
    const [studentPose, setStudentPose] = useState<PoseLandmark[]>([]);
    const [similarityScore, setSimilarityScore] = useState<number | null>(null);

    // Submission tracking
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Refs for camera operations
    const cameraRef = useRef<StudentCameraRef>(null);
    const recordingPromiseRef = useRef<Promise<{ uri: string } | null> | null>(null);
    const [isRequestingPermission, setIsRequestingPermission] = useState(false);

    // Auto-request camera permission on mount for web
    useEffect(() => {
        if (Platform.OS === 'web' && !hasCameraPermission) {
            requestCameraPermission();
        }
    }, []);

    // Request camera permission if not granted
    const ensureCameraPermission = useCallback(async (): Promise<boolean> => {
        if (hasCameraPermission) return true;

        setIsRequestingPermission(true);
        const granted = await requestCameraPermission();
        setIsRequestingPermission(false);

        if (!granted) {
            Alert.alert(
                'Camera Required',
                'Camera access is needed to record your drill. Please enable camera permissions.',
                [{ text: 'OK' }]
            );
        }
        return granted;
    }, [hasCameraPermission, requestCameraPermission]);

    // Handle instructor pose detection
    const handleInstructorPose = useCallback((landmarks: PoseLandmark[]) => {
        setInstructorPose(landmarks);
    }, []);

    // Handle student pose detection (this would come from StudentCamera)
    const handleStudentPose = useCallback((landmarks: PoseLandmark[]) => {
        setStudentPose(landmarks);
    }, []);

    // Calculate similarity score when both poses are available
    const updateSimilarityScore = useCallback(() => {
        if (instructorPose.length > 0 && studentPose.length > 0) {
            const result = comparePoses(instructorPose, studentPose);
            setSimilarityScore(result.score);
        }
    }, [instructorPose, studentPose]);

    // Update score when poses change
    React.useEffect(() => {
        updateSimilarityScore();
    }, [instructorPose, studentPose, updateSimilarityScore]);

    // Handle recording start
    const handleStartRecording = useCallback(async () => {
        const hasPermission = await ensureCameraPermission();
        if (!hasPermission) return;

        try {
            setRecordingState('recording');

            // Start camera recording (both web and mobile)
            if (cameraRef.current) {
                recordingPromiseRef.current = cameraRef.current.recordAsync({
                    maxDuration: 60,
                    quality: '720p',
                });
            }
        } catch (error) {
            console.error('Failed to start recording:', error);
            setRecordingState('error');
            Alert.alert('Recording Error', 'Failed to start recording. Please try again.');
        }
    }, [ensureCameraPermission]);

    // Handle recording stop
    const handleStopRecording = useCallback(async () => {
        try {
            setRecordingState('processing');

            // Stop recording and get video URI
            if (cameraRef.current) {
                cameraRef.current.stopRecording();

                // Wait for recording to finish and get the video URI
                const video = await recordingPromiseRef.current;
                if (video?.uri) {
                    setRecordedVideoUri(video.uri);
                    console.log('Video recorded successfully');
                }
            }

            setRecordingState('complete');
        } catch (error) {
            console.error('Failed to stop recording:', error);
            setRecordingState('error');
            Alert.alert('Recording Error', 'Failed to stop recording. Please try again.');
        }
    }, []);

    // Handle camera flip
    const handleFlipCamera = useCallback(() => {
        setCameraFacing(prev => prev === 'front' ? 'back' : 'front');
    }, []);

    // Handle retake - reset to record again
    const handleRetake = useCallback(() => {
        setRecordingState('idle');
        setRecordedVideoUri(null);
        setSimilarityScore(null);
        setInstructorPose([]);
        setStudentPose([]);
    }, []);

    // Handle cancel - go back or navigate to demonstration
    const handleCancel = useCallback(() => {
        if (router.canGoBack()) {
            router.back();
        } else {
            // If no previous screen, navigate to demonstration tab
            router.replace('/(tabs)/demonstration');
        }
    }, [router]);

    // Handle submit
    const handleSubmit = useCallback(async () => {
        if (!recordedVideoUri) {
            Alert.alert('No Video', 'Please record a video first.');
            return;
        }

        // Show confirmation dialog (web-compatible)
        const confirmSubmit = () => {
            if (Platform.OS === 'web') {
                return window.confirm('Are you sure you want to submit this recording?');
            }
            return true; // On mobile, we'll use Alert.alert below
        };

        // On mobile, use Alert.alert for confirmation
        if (Platform.OS !== 'web') {
            Alert.alert(
                'Submit Drill',
                'Are you sure you want to submit this recording?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Yes, Submit', onPress: () => performSubmit() },
                ]
            );
            return;
        }

        // On web, use window.confirm
        if (!confirmSubmit()) {
            return;
        }

        performSubmit();
    }, [recordedVideoUri, assignmentId, drillId, drillName, similarityScore, router]);

    // Actual submission logic
    const performSubmit = useCallback(async () => {
        if (!recordedVideoUri) {
            console.error('No video to submit');
            return;
        }

        try {
            setRecordingState('processing');

            // Get the current user's ID from AsyncStorage
            const storedUserID = await AsyncStorage.getItem('userID');
            const studentID = storedUserID ? parseInt(storedUserID, 10) : 1;

            // Create a submission for the assignment
            const submission = await createSubmission({
                studentID,
                assignmentID: assignmentId,
                imageBackgroundColor: '#000000',
                imageText: drillName,
                imageTextColor: '#FFFFFF',
            });

            // Upload video to S3
            const { videoUrl } = await uploadVideo(recordedVideoUri);

            // Calculate final score (round to integer for grade)
            const finalGrade = similarityScore !== null ? Math.round(similarityScore) : undefined;

            // Save submitted drill record with grade
            await saveSubmittedDrillWithUrl({
                submissionID: submission.id,
                drillID: drillId,
                s3VideoUrl: videoUrl,
                grade: finalGrade,
            });

            setHasSubmitted(true);
            setRecordingState('complete');

            // Show success message
            if (Platform.OS === 'web') {
                window.alert(`Success! Your drill has been submitted for review.\n${finalGrade !== undefined ? `Grade: ${finalGrade}/100` : ''}`);
            } else {
                Alert.alert(
                    'Success!',
                    `Your drill has been submitted for review.\n${finalGrade !== undefined ? `Grade: ${finalGrade}/100` : ''}`,
                    [{ text: 'OK', onPress: () => router.back() }]
                );
            }
        } catch (error) {
            console.error('Submission error:', error);
            setRecordingState('error');
            if (Platform.OS === 'web') {
                window.alert('Submission Failed: Could not submit your video. Please try again.');
            } else {
                Alert.alert('Submission Failed', 'Could not submit your video. Please try again.');
            }
        }
    }, [recordedVideoUri, assignmentId, drillId, drillName, similarityScore, router]);

    // Show permission request if not granted
    if (!hasCameraPermission) {
        return (
            <View style={styles.container}>
                <CameraControls
                    recordingState={recordingState}
                    cameraFacing={cameraFacing}
                    onStartRecording={async () => {
                        await requestCameraPermission();
                    }}
                    onStopRecording={() => {}}
                    onFlipCamera={() => {}}
                    onCancel={handleCancel}
                    onSubmit={() => {}}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SplitScreenLayout
                instructorVideo={
                    <InstructorVideo
                        videoUrl={instructorVideoUrl}
                        autoPlay={true}
                        loop={true}
                        playbackSpeed={playbackSpeed}
                        onPoseDetected={handleInstructorPose}
                    />
                }
                studentCamera={
                    <StudentCamera
                        ref={cameraRef}
                        isRecording={recordingState === 'recording'}
                        facing={cameraFacing}
                        onPoseDetected={handleStudentPose}
                    />
                }
                isRecording={recordingState === 'recording'}
            />

            {/* Speed control button */}
            <TouchableOpacity
                style={styles.speedButton}
                onPress={cyclePlaybackSpeed}
                activeOpacity={0.7}
            >
                <Text style={styles.speedText}>{playbackSpeed}x</Text>
            </TouchableOpacity>

            {/* Live similarity score badge */}
            {similarityScore !== null && recordingState === 'recording' && (
                <View style={styles.scoreBadgeContainer}>
                    <LiveScoreBadge score={similarityScore} />
                </View>
            )}

            {/* Final score display after recording */}
            <ScoreDisplay
                score={similarityScore}
                isVisible={recordingState === 'complete' && similarityScore !== null}
                showDetails={true}
            />

            <CameraControls
                recordingState={recordingState}
                cameraFacing={cameraFacing}
                hasSubmitted={hasSubmitted}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
                onFlipCamera={handleFlipCamera}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
                onRetake={handleRetake}
                maxDuration={60}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    speedButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        zIndex: 5,
    },
    speedText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    scoreBadgeContainer: {
        position: 'absolute',
        top: 20,
        alignSelf: 'center',
        zIndex: 10,
    },
});