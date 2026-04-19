import { PoseLandmark } from '@/types/pose';

/**
 * Normalizes pose landmarks to be relative to the bounding box
 * This makes poses comparable regardless of body size or position in frame
 */
export function normalizePose(landmarks: PoseLandmark[]): PoseLandmark[] {
    if (landmarks.length === 0) return [];

    // Find bounding box
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    for (const lm of landmarks) {
        minX = Math.min(minX, lm.x);
        maxX = Math.max(maxX, lm.x);
        minY = Math.min(minY, lm.y);
        maxY = Math.max(maxY, lm.y);
    }

    const width = maxX - minX || 1;
    const height = maxY - minY || 1;

    // Normalize to 0-1 range within bounding box
    return landmarks.map(lm => ({
        x: (lm.x - minX) / width,
        y: (lm.y - minY) / height,
        z: lm.z / width, // Scale z by width for 3D consistency
        visibility: lm.visibility,
    }));
}

/**
 * Calculates the Euclidean distance between two landmarks
 */
function landmarkDistance(a: PoseLandmark, b: PoseLandmark): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = (a.z || 0) - (b.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculates the angle at a joint (using 3 landmarks)
 * Returns angle in degrees
 */
function calculateAngle(a: PoseLandmark, b: PoseLandmark, c: PoseLandmark): number {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180 / Math.PI);
    if (angle > 180) angle = 360 - angle;
    return angle;
}

/**
 * Key joints for pose comparison (indices from MediaPipe)
 */
const KEY_JOINTS = {
    // Arms
    leftShoulder: 11, rightShoulder: 12,
    leftElbow: 13, rightElbow: 14,
    leftWrist: 15, rightWrist: 16,
    // Legs
    leftHip: 23, rightHip: 24,
    leftKnee: 25, rightKnee: 26,
    leftAnkle: 27, rightAnkle: 28,
};

/**
 * Key angles to compare (formed by these landmark triplets)
 */
const KEY_ANGLES = [
    // Left arm angles
    [KEY_JOINTS.leftShoulder, KEY_JOINTS.leftElbow, KEY_JOINTS.leftWrist],
    // Right arm angles
    [KEY_JOINTS.rightShoulder, KEY_JOINTS.rightElbow, KEY_JOINTS.rightWrist],
    // Left leg angles
    [KEY_JOINTS.leftHip, KEY_JOINTS.leftKnee, KEY_JOINTS.leftAnkle],
    // Right leg angles
    [KEY_JOINTS.rightHip, KEY_JOINTS.rightKnee, KEY_JOINTS.rightAnkle],
    // Torso angles (shoulder-hip-knee)
    [KEY_JOINTS.leftShoulder, KEY_JOINTS.leftHip, KEY_JOINTS.leftKnee],
    [KEY_JOINTS.rightShoulder, KEY_JOINTS.rightHip, KEY_JOINTS.rightKnee],
];

/**
 * Compare two poses and return a similarity score (0-100)
 * Higher score = more similar
 */
export function comparePoses(
    instructorLandmarks: PoseLandmark[],
    studentLandmarks: PoseLandmark[]
): {
    score: number;
    details: {
        landmarkScore: number;
        angleScore: number;
        visibilityScore: number;
    };
} {
    if (!instructorLandmarks?.length || !studentLandmarks?.length) {
        return { score: 0, details: { landmarkScore: 0, angleScore: 0, visibilityScore: 0 } };
    }

    // Normalize both poses
    const normalizedInstructor = normalizePose(instructorLandmarks);
    const normalizedStudent = normalizePose(studentLandmarks);

    // 1. Calculate landmark position similarity (weighted by visibility)
    let totalLandmarkDistance = 0;
    let visibleCount = 0;

    for (let i = 0; i < Math.min(normalizedInstructor.length, normalizedStudent.length); i++) {
        const inst = normalizedInstructor[i];
        const stud = normalizedStudent[i];

        // Weight by minimum visibility
        const visibility = Math.min(inst.visibility || 1, stud.visibility || 1);

        if (visibility > 0.5) {
            totalLandmarkDistance += landmarkDistance(inst, stud) * visibility;
            visibleCount += visibility;
        }
    }

    // Convert distance to score (lower distance = higher score)
    const avgLandmarkDistance = visibleCount > 0 ? totalLandmarkDistance / visibleCount : 1;
    const landmarkScore = Math.max(0, 100 * (1 - avgLandmarkDistance));

    // 2. Calculate angle similarity
    let totalAngleDifference = 0;
    let angleCount = 0;

    for (const [a, b, c] of KEY_ANGLES) {
        if (
            a < normalizedInstructor.length &&
            b < normalizedInstructor.length &&
            c < normalizedInstructor.length &&
            a < normalizedStudent.length &&
            b < normalizedStudent.length &&
            c < normalizedStudent.length
        ) {
            // Check visibility
            const visA = Math.min(normalizedInstructor[a].visibility || 1, normalizedStudent[a].visibility || 1);
            const visB = Math.min(normalizedInstructor[b].visibility || 1, normalizedStudent[b].visibility || 1);
            const visC = Math.min(normalizedInstructor[c].visibility || 1, normalizedStudent[c].visibility || 1);

            if (visA > 0.5 && visB > 0.5 && visC > 0.5) {
                const instAngle = calculateAngle(normalizedInstructor[a], normalizedInstructor[b], normalizedInstructor[c]);
                const studAngle = calculateAngle(normalizedStudent[a], normalizedStudent[b], normalizedStudent[c]);
                const angleDiff = Math.abs(instAngle - studAngle);
                totalAngleDifference += Math.min(angleDiff, 360 - angleDiff); // Handle angle wraparound
                angleCount++;
            }
        }
    }

    // Convert angle difference to score (max 180 degrees difference = 0 score)
    const avgAngleDifference = angleCount > 0 ? totalAngleDifference / angleCount : 90;
    const angleScore = Math.max(0, 100 * (1 - avgAngleDifference / 180));

    // 3. Visibility score (how many landmarks are visible in both poses)
    let visibleInBoth = 0;
    const totalLandmarks = Math.min(normalizedInstructor.length, normalizedStudent.length);

    for (let i = 0; i < totalLandmarks; i++) {
        const instVis = normalizedInstructor[i].visibility || 0;
        const studVis = normalizedStudent[i].visibility || 0;
        if (instVis > 0.5 && studVis > 0.5) {
            visibleInBoth++;
        }
    }

    const visibilityScore = (visibleInBoth / totalLandmarks) * 100;

    // Combine scores with weights
    // Landmark positions: 40%, Angles: 40%, Visibility: 20%
    const combinedScore =
        landmarkScore * 0.4 +
        angleScore * 0.4 +
        visibilityScore * 0.2;

    return {
        score: Math.round(combinedScore * 10) / 10, // Round to 1 decimal
        details: {
            landmarkScore: Math.round(landmarkScore * 10) / 10,
            angleScore: Math.round(angleScore * 10) / 10,
            visibilityScore: Math.round(visibilityScore * 10) / 10,
        },
    };
}

/**
 * Convert a numeric score to a letter grade
 */
export function scoreToGrade(score: number): { letter: string; color: string } {
    if (score >= 95) return { letter: 'A+', color: '#00FF88' };
    if (score >= 90) return { letter: 'A', color: '#00FF88' };
    if (score >= 85) return { letter: 'A-', color: '#88FF00' };
    if (score >= 80) return { letter: 'B+', color: '#88FF00' };
    if (score >= 75) return { letter: 'B', color: '#FFFF00' };
    if (score >= 70) return { letter: 'B-', color: '#FFFF00' };
    if (score >= 65) return { letter: 'C+', color: '#FFAA00' };
    if (score >= 60) return { letter: 'C', color: '#FFAA00' };
    if (score >= 55) return { letter: 'C-', color: '#FF8800' };
    if (score >= 50) return { letter: 'D', color: '#FF5500' };
    return { letter: 'F', color: '#FF0000' };
}

/**
 * Get feedback based on score
 */
export function getScoreFeedback(score: number): string {
    if (score >= 90) return "Excellent form! Your pose matches the instructor very closely.";
    if (score >= 80) return "Great job! Your form is very similar to the instructor's.";
    if (score >= 70) return "Good effort! Some minor adjustments could improve your form.";
    if (score >= 60) return "Keep practicing! Try to match the instructor's arm and leg positions more closely.";
    if (score >= 50) return "You're getting there! Focus on the key body positions shown in the example.";
    return "Keep trying! Watch the instructor's pose carefully and try to match the positions.";
}