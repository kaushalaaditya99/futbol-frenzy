/**
 * Pose landmark types for MediaPipe pose detection
 */

// Single pose landmark point (normalized 0-1 coordinates)
export interface PoseLandmark {
    x: number;
    y: number;
    z: number;
    visibility?: number;
}

// Result from pose detection (single frame)
export interface PoseResult {
    landmarks: PoseLandmark[];
    success: boolean;
    error?: string;
}

// Result from video pose detection (multiple frames)
export interface VideoPoseResult {
    frames: Array<{
        timestamp_ms: number;
        landmarks: PoseLandmark[];
    }>;
    success: boolean;
    error?: string;
}

// Recording state machine
export type RecordingState = 'idle' | 'countdown' | 'preparing' | 'recording' | 'processing' | 'complete' | 'error';

// Camera facing mode
export type CameraFacing = 'front' | 'back';

// Pose connections for drawing skeleton (MediaPipe pose landmark indices)
// Reference: https://developers.google.com/mediapipe/solutions/vision/pose_landmarker
export const POSE_CONNECTIONS: [number, number][] = [
    // Torso - full coverage
    [11, 12], // shoulders
    [11, 23], [12, 24], // shoulders to hips (sides)
    [23, 24], // hips
    [11, 24], [12, 23], // cross torso (X pattern for stability)
    [0, 11], [0, 12], // nose to shoulders (head position reference)

    // Left arm - full
    [11, 13], // shoulder to elbow
    [13, 15], // elbow to wrist
    [13, 17], // elbow to pinky (forearm)
    [15, 17], // wrist to pinky (hand edge)
    [15, 19], // wrist to index (hand edge)
    [15, 21], // wrist to thumb (hand edge)
    [17, 19], // pinky to index (hand span)

    // Right arm - full
    [12, 14], // shoulder to elbow
    [14, 16], // elbow to wrist
    [14, 18], // elbow to pinky (forearm)
    [16, 18], // wrist to pinky (hand edge)
    [16, 20], // wrist to index (hand edge)
    [16, 22], // wrist to thumb (hand edge)
    [18, 20], // pinky to index (hand span)

    // Left leg - full
    [23, 25], // hip to knee
    [25, 27], // knee to ankle
    [27, 29], // ankle to heel
    [27, 31], // ankle to foot index
    [29, 31], // heel to foot index
    [25, 29], // knee to heel (calf line)

    // Right leg - full
    [24, 26], // hip to knee
    [26, 28], // knee to ankle
    [28, 30], // ankle to heel
    [28, 32], // ankle to foot index
    [30, 32], // heel to foot index
    [26, 30], // knee to heel (calf line)
];

// Key landmarks used for pose visualization (indexes)
export const KEY_LANDMARKS = {
    nose: 0,
    leftShoulder: 11,
    rightShoulder: 12,
    leftElbow: 13,
    rightElbow: 14,
    leftWrist: 15,
    rightWrist: 16,
    leftHip: 23,
    rightHip: 24,
    leftKnee: 25,
    rightKnee: 26,
    leftAnkle: 27,
    rightAnkle: 28,
};

// Landmark count from MediaPipe
export const LANDMARK_COUNT = 33;