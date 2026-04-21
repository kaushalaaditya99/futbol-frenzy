import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, G } from 'react-native-svg';
import { PoseLandmark, POSE_CONNECTIONS } from '@/types/pose';

interface PoseOverlayProps {
    landmarks: PoseLandmark[];
    width?: number;
    height?: number;
    facing?: 'front' | 'back';
}

// Colors for the pose overlay
const OVERLAY_COLORS = {
    line: 'rgba(0, 255, 136, 0.8)', // Bright green for skeleton lines
    lineStroke: 'rgba(255, 255, 255, 0.3)', // White outline for visibility
    point: 'rgba(0, 255, 136, 1)', // Green for landmark points
    pointStroke: 'rgba(255, 255, 255, 0.9)', // White outline for points
};

// Line thickness based on body part importance
const LINE_WIDTH = {
    torso: 4,
    limbs: 3,
};

const POINT_RADIUS = 5;

export function PoseOverlay({ landmarks, width, height, facing }: PoseOverlayProps) {
    // Get screen dimensions if not provided
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const viewWidth = width || screenWidth;
    const viewHeight = height || screenHeight;

    // Log landmarks count for debugging
    useEffect(() => {
        if (landmarks.length > 0) {
            console.log('PoseOverlay received', landmarks.length, 'landmarks');
        }
    }, [landmarks.length]);

    // Don't render if no landmarks
    if (!landmarks || landmarks.length === 0) {
        return null;
    }

    // Convert normalized coordinates (0-1) to pixel coordinates
    const toPixelX = (normalizedX: number): number => {
        const flipped = facing === 'front' ? 1 - normalizedX : normalizedX;
        return flipped * viewWidth;
    };
    const toPixelY = (normalizedY: number): number => normalizedY * viewHeight;

    // Check if a landmark is valid (not undefined and has reasonable visibility)
    const isValidLandmark = (index: number): boolean => {
        if (index < 0 || index >= landmarks.length) return false;
        const lm = landmarks[index];
        if (!lm) return false;
        // Check if coordinates are in valid range
        if (lm.x < 0 || lm.x > 1 || lm.y < 0 || lm.y > 1) return false;
        // Check visibility if available
        if (lm.visibility !== undefined && lm.visibility < 0.5) return false;
        return true;
    };

    // Determine line width based on connection
    const getLineWidth = (startIndex: number, endIndex: number): number => {
        // Torso connections (shoulders, hips) are thicker
        const torsoConnections = [
            [11, 12], // shoulders
            [11, 23], [12, 24], // shoulders to hips
            [23, 24], // hips
        ];

        const isTorso = torsoConnections.some(
            ([s, e]) => (s === startIndex && e === endIndex) || (s === endIndex && e === startIndex)
        );

        return isTorso ? LINE_WIDTH.torso : LINE_WIDTH.limbs;
    };

    return (
        <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
            <Svg width="100%" height="100%" viewBox={`0 0 ${viewWidth} ${viewHeight}`}>
                <G>
                    {/* Draw skeleton lines */}
                    {POSE_CONNECTIONS.map(([startIndex, endIndex], index) => {
                        if (!isValidLandmark(startIndex) || !isValidLandmark(endIndex)) {
                            return null;
                        }

                        const startLm = landmarks[startIndex];
                        const endLm = landmarks[endIndex];
                        const lineWidth = getLineWidth(startIndex, endIndex);

                        return (
                            <G key={`connection-${index}`}>
                                {/* White outline for visibility on all backgrounds */}
                                <Line
                                    x1={toPixelX(startLm.x)}
                                    y1={toPixelY(startLm.y)}
                                    x2={toPixelX(endLm.x)}
                                    y2={toPixelY(endLm.y)}
                                    stroke={OVERLAY_COLORS.lineStroke}
                                    strokeWidth={lineWidth + 2}
                                    strokeLinecap="round"
                                />
                                {/* Green main line */}
                                <Line
                                    x1={toPixelX(startLm.x)}
                                    y1={toPixelY(startLm.y)}
                                    x2={toPixelX(endLm.x)}
                                    y2={toPixelY(endLm.y)}
                                    stroke={OVERLAY_COLORS.line}
                                    strokeWidth={lineWidth}
                                    strokeLinecap="round"
                                />
                            </G>
                        );
                    })}

                    {/* Draw landmark points */}
                    {landmarks.map((lm, index) => {
                        if (!isValidLandmark(index)) return null;

                        return (
                            <G key={`point-${index}`}>
                                {/* White outline */}
                                <Circle
                                    cx={toPixelX(lm.x)}
                                    cy={toPixelY(lm.y)}
                                    r={POINT_RADIUS + 1}
                                    fill={OVERLAY_COLORS.pointStroke}
                                />
                                {/* Green point */}
                                <Circle
                                    cx={toPixelX(lm.x)}
                                    cy={toPixelY(lm.y)}
                                    r={POINT_RADIUS}
                                    fill={OVERLAY_COLORS.point}
                                    stroke={OVERLAY_COLORS.pointStroke}
                                    strokeWidth={1}
                                />
                            </G>
                        );
                    })}
                </G>
            </Svg>
        </View>
    );
}