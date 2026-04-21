// fastdtw implementation based on algorithm by Stan Salvador and Philip Chan
// https://github.com/slaypni/fastdtw

import { PoseLandmark } from '@/types/pose';
import { normalizePose, comparePoses, applyLenientCurve, scoreToGrade } from './poseComparison';

export interface PoseSequence {
    frames: PoseLandmark[][];
    timestamps: number[];
}

// converts pose landmarks to feature vector for DTW comparison
// uses key joint positions and angles
function poseToFeatures(landmarks: PoseLandmark[]): number[] {
    if (!landmarks || landmarks.length === 0) return [];

    const normalized = normalizePose(landmarks);
    const features: number[] = [];

    const KEY_JOINTS = {
        leftShoulder: 11, rightShoulder: 12,
        leftElbow: 13, rightElbow: 14,
        leftWrist: 15, rightWrist: 16,
        leftHip: 23, rightHip: 24,
        leftKnee: 25, rightKnee: 26,
        leftAnkle: 27, rightAnkle: 28,
    };

    // add normalized positions for key joints
    for (const idx of Object.values(KEY_JOINTS)) {
        if (idx < normalized.length) {
            const lm = normalized[idx];
            // check for NaN values
            if (isNaN(lm.x) || isNaN(lm.y)) {
                features.push(0.5, 0.5, 0);
            } else {
                features.push(lm.x, lm.y, lm.z || 0);
            }
        }
    }

    // add joint angles
    const angles = [
        [KEY_JOINTS.leftShoulder, KEY_JOINTS.leftElbow, KEY_JOINTS.leftWrist],
        [KEY_JOINTS.rightShoulder, KEY_JOINTS.rightElbow, KEY_JOINTS.rightWrist],
        [KEY_JOINTS.leftHip, KEY_JOINTS.leftKnee, KEY_JOINTS.leftAnkle],
        [KEY_JOINTS.rightHip, KEY_JOINTS.rightKnee, KEY_JOINTS.rightAnkle],
    ];

    for (const [a, b, c] of angles) {
        if (a < normalized.length && b < normalized.length && c < normalized.length) {
            const angle = calculateAngle(normalized[a], normalized[b], normalized[c]);
            features.push(angle / 180);
        }
    }

    return features;
}

// calculates angle at joint b between points a-b-c
function calculateAngle(a: PoseLandmark, b: PoseLandmark, c: PoseLandmark): number {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180 / Math.PI);
    if (angle > 180) angle = 360 - angle;
    return angle;
}

// euclidean distance between two feature vectors
function euclideanDistance(a: number[], b: number[]): number {
    if (a.length !== b.length) return Infinity;

    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        sum += Math.pow(a[i] - b[i], 2);
    }
    return Math.sqrt(sum);
}

// cost function between two poses
function poseDistance(pose1: PoseLandmark[], pose2: PoseLandmark[]): number {
    const features1 = poseToFeatures(pose1);
    const features2 = poseToFeatures(pose2);

    if (features1.length === 0 || features2.length === 0) return 1; // return moderate distance instead of infinity
    if (features1.length !== features2.length) return 1;

    const dist = euclideanDistance(features1, features2);
    return isNaN(dist) ? 1 : dist;
}

// standard DTW distance calculation, O(n*m) time and space
export function dtwDistance(
    seq1: PoseLandmark[][],
    seq2: PoseLandmark[][]
): { distance: number; path: [number, number][] } {
    const n = seq1.length;
    const m = seq2.length;

    if (n === 0 || m === 0) {
        return { distance: 1, path: [] };
    }

    // initialize cost matrix
    const dtw: number[][] = Array(n + 1).fill(null).map(() => Array(m + 1).fill(Infinity));
    dtw[0][0] = 0;

    // fill cost matrix
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            const cost = poseDistance(seq1[i - 1], seq2[j - 1]);
            dtw[i][j] = cost + Math.min(
                dtw[i - 1][j],
                dtw[i][j - 1],
                dtw[i - 1][j - 1]
            );
        }
    }

    // backtrack to find path
    const path: [number, number][] = [];
    let i = n;
    let j = m;

    while (i > 0 && j > 0) {
        path.unshift([i - 1, j - 1]);

        const min = Math.min(dtw[i - 1][j], dtw[i][j - 1], dtw[i - 1][j - 1]);

        if (min === dtw[i - 1][j - 1]) {
            i--;
            j--;
        } else if (min === dtw[i - 1][j]) {
            i--;
        } else {
            j--;
        }
    }

    const finalDistance = dtw[n][m];
    // normalize by path length to get average cost per alignment
    const normalizedDistance = finalDistance / path.length;

    return { distance: normalizedDistance, path };
}

// fastdtw uses multi-level approach with increasing resolution
// runs in O(n) time instead of O(n*m)
export function fastDTWDistance(
    seq1: PoseLandmark[][],
    seq2: PoseLandmark[][],
    radius: number = 1
): { distance: number; path: [number, number][] } {
    const n = seq1.length;
    const m = seq2.length;

    if (n === 0 || m === 0) {
        return { distance: 1, path: [] };
    }

    // use standard DTW for small sequences
    if (n <= radius * 2 + 1 || m <= radius * 2 + 1) {
        return dtwDistance(seq1, seq2);
    }

    // recursive multi-level approach
    const shrunk1 = shrinkSequence(seq1);
    const shrunk2 = shrinkSequence(seq2);

    const { path: lowResPath } = fastDTWDistance(shrunk1, shrunk2, radius);

    const expandedPath = expandPath(lowResPath, n, m);
    const constrainedPath = constrainedDTW(seq1, seq2, expandedPath, radius);

    return constrainedPath;
}

// shrink sequence by averaging adjacent pairs
function shrinkSequence(seq: PoseLandmark[][]): PoseLandmark[][] {
    const result: PoseLandmark[][] = [];

    for (let i = 0; i < seq.length; i += 2) {
        if (i + 1 < seq.length) {
            result.push(averagePoses([seq[i], seq[i + 1]]));
        } else {
            result.push(seq[i]);
        }
    }

    return result;
}

// average multiple poses into one
function averagePoses(poses: PoseLandmark[][]): PoseLandmark[] {
    if (poses.length === 0) return [];
    if (poses.length === 1) return poses[0];

    const numLandmarks = poses[0].length;
    const result: PoseLandmark[] = [];

    for (let i = 0; i < numLandmarks; i++) {
        let sumX = 0, sumY = 0, sumZ = 0, sumVis = 0;
        let count = 0;

        for (const pose of poses) {
            if (i < pose.length) {
                sumX += pose[i].x;
                sumY += pose[i].y;
                sumZ += pose[i].z || 0;
                sumVis += pose[i].visibility || 1;
                count++;
            }
        }

        if (count > 0) {
            result.push({
                x: sumX / count,
                y: sumY / count,
                z: sumZ / count,
                visibility: sumVis / count,
            });
        }
    }

    return result;
}

// expand path from lower resolution to higher resolution
function expandPath(
    path: [number, number][],
    targetLen1: number,
    targetLen2: number
): [number, number][] {
    if (path.length === 0) return [];

    const expanded: [number, number][] = [];

    for (const [i, j] of path) {
        expanded.push([i * 2, j * 2]);
        expanded.push([i * 2 + 1, j * 2]);
        expanded.push([i * 2, j * 2 + 1]);
        expanded.push([i * 2 + 1, j * 2 + 1]);
    }

    return expanded.filter(([i, j]) => i < targetLen1 && j < targetLen2);
}

// constrained DTW that only searches within a radius of given path
function constrainedDTW(
    seq1: PoseLandmark[][],
    seq2: PoseLandmark[][],
    windowPath: [number, number][],
    radius: number
): { distance: number; path: [number, number][] } {
    const n = seq1.length;
    const m = seq2.length;

    // build search window from path
    const window = new Set<string>();
    for (const [i, j] of windowPath) {
        for (let di = -radius; di <= radius; di++) {
            for (let dj = -radius; dj <= radius; dj++) {
                const ni = i + di;
                const nj = j + dj;
                if (ni >= 0 && ni < n && nj >= 0 && nj < m) {
                    window.add(`${ni},${nj}`);
                }
            }
        }
    }

    // add diagonal path
    for (let i = 0; i < n; i++) {
        const j = Math.floor((i / n) * m);
        for (let dj = -radius; dj <= radius; dj++) {
            const nj = j + dj;
            if (nj >= 0 && nj < m) {
                window.add(`${i},${nj}`);
            }
        }
    }

    // DTW with constrained window
    const dtw: Map<string, number> = new Map();
    dtw.set('0,0', poseDistance(seq1[0], seq2[0]));

    const getPath = (i: number, j: number): number => {
        return dtw.get(`${i},${j}`) ?? Infinity;
    };

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (!window.has(`${i},${j}`)) continue;
            if (i === 0 && j === 0) continue;

            const cost = poseDistance(seq1[i], seq2[j]);
            const minPrev = Math.min(
                getPath(i - 1, j),
                getPath(i, j - 1),
                getPath(i - 1, j - 1)
            );

            dtw.set(`${i},${j}`, cost + minPrev);
        }
    }

    // backtrack to find path
    const path: [number, number][] = [];
    let i = n - 1;
    let j = m - 1;
    path.unshift([i, j]);

    while (i > 0 || j > 0) {
        const prev = Math.min(
            getPath(i - 1, j),
            getPath(i, j - 1),
            getPath(i - 1, j - 1)
        );

        if (prev === getPath(i - 1, j - 1) && i > 0 && j > 0) {
            i--;
            j--;
        } else if (prev === getPath(i - 1, j) && i > 0) {
            i--;
        } else if (j > 0) {
            j--;
        } else if (i > 0) {
            i--;
        } else {
            break;
        }

        path.unshift([i, j]);
    }

    const finalDistance = getPath(n - 1, m - 1);
    // normalize by path length to get average cost per alignment
    const normalizedDistance = finalDistance / path.length;

    return { distance: normalizedDistance, path };
}

// compare two pose sequences using fastdtw, returns similarity score
export function comparePoseSequences(
    instructorSequence: PoseLandmark[][],
    studentSequence: PoseLandmark[][]
): {
    score: number;
    path: [number, number][];
    frameScores: number[];
} {
    if (!instructorSequence?.length || !studentSequence?.length) {
        console.log('[FastDTW] Empty sequences provided');
        return { score: 0, path: [], frameScores: [] };
    }

    console.log(`[FastDTW] Starting comparison: ${instructorSequence.length} instructor frames vs ${studentSequence.length} student frames`);

    const { distance, path } = fastDTWDistance(instructorSequence, studentSequence, 1);

    console.log(`[FastDTW] DTW distance: ${distance.toFixed(4)}, path length: ${path.length}`);

    // calculate per-frame scores along alignment path
    const frameScores: number[] = [];

    for (const [instIdx, studIdx] of path) {
        const instPose = instructorSequence[instIdx];
        const studPose = studentSequence[studIdx];

        if (instPose && studPose) {
            const { score } = comparePoses(instPose, studPose);
            frameScores.push(score);
        }
    }

    const avgScore = frameScores.length > 0
        ? frameScores.reduce((a, b) => a + b, 0) / frameScores.length
        : 0;

    // dtwScore: distance is normalized per-frame distance
    // typical range is 0.5-3.0 for similar poses
    // convert to 0-100 scale: distance 0 = score 100, distance 3+ = score 0
    const dtwScore = Math.max(0, Math.min(100, 100 * (1 - distance / 3)));

    // combine: 70% frame comparison, 30% DTW distance
    const combinedScore = avgScore * 0.7 + dtwScore * 0.3;

    // apply lenient curve for young children grading
    const curvedScore = applyLenientCurve(combinedScore);

    console.log(`[FastDTW] Results - avgFrameScore: ${avgScore.toFixed(2)}, dtwScore: ${dtwScore.toFixed(2)}`);
    console.log(`[FastDTW] Raw combined score: ${combinedScore.toFixed(2)} → Curved score: ${curvedScore.toFixed(2)}`);
    console.log(`[FastDTW] Grade: ${scoreToGrade(curvedScore).letter}`);

    // Return curved score for display
    return {
        score: Math.round(curvedScore * 10) / 10,
        path,
        frameScores,
    };
}

// sample pose sequence at fixed rate (e.g., every 100ms)
export function samplePoseSequence(
    sequence: PoseSequence,
    sampleRateMs: number = 100
): PoseLandmark[][] {
    if (!sequence.frames.length) return [];

    const sampled: PoseLandmark[][] = [];
    let lastTimestamp = -Infinity;

    for (let i = 0; i < sequence.frames.length; i++) {
        const timestamp = sequence.timestamps[i];
        if (timestamp - lastTimestamp >= sampleRateMs) {
            sampled.push(sequence.frames[i]);
            lastTimestamp = timestamp;
        }
    }

    return sampled;
}