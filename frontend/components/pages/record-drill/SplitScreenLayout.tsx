import React from 'react';
import { View, StyleSheet, Dimensions, useWindowDimensions, ViewStyle } from 'react-native';

interface SplitScreenLayoutProps {
    instructorVideo: React.ReactNode;
    studentCamera: React.ReactNode;
    isRecording?: boolean;
}

export function SplitScreenLayout({
    instructorVideo,
    studentCamera,
    isRecording = false,
}: SplitScreenLayoutProps) {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const isTabletOrDesktop = width >= 768;

    // Determine layout configuration
    const getLayoutConfig = () => {
        // When recording, camera takes more space
        const instructorRatio = isRecording ? 0.3 : 0.5;
        const cameraRatio = isRecording ? 0.7 : 0.5;

        if (isTabletOrDesktop || isLandscape) {
            // Side by side layout for tablets/desktop or landscape phones
            return {
                direction: 'row' as const,
                instructorStyle: {
                    width: `${instructorRatio * 100}%` as any,
                    height: '100%' as any,
                },
                cameraStyle: {
                    width: `${cameraRatio * 100}%` as any,
                    height: '100%' as any,
                },
            };
        } else {
            // Stacked layout for mobile portrait
            return {
                direction: 'column' as const,
                instructorStyle: {
                    width: '100%' as any,
                    height: `${instructorRatio * 100}%` as any,
                },
                cameraStyle: {
                    width: '100%' as any,
                    height: `${cameraRatio * 100}%` as any,
                },
            };
        }
    };

    const layoutConfig = getLayoutConfig();

    return (
        <View style={[styles.container, { flexDirection: layoutConfig.direction }]}>
            {/* Instructor Video Section */}
            <View style={[styles.videoSection, layoutConfig.instructorStyle]}>
                {instructorVideo}
            </View>

            {/* Divider */}
            <View style={[
                styles.divider,
                layoutConfig.direction === 'row' ? styles.verticalDivider : styles.horizontalDivider,
            ]} />

            {/* Student Camera Section */}
            <View style={[styles.cameraSection, layoutConfig.cameraStyle]}>
                {studentCamera}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    videoSection: {
        backgroundColor: '#1a1a1a',
    },
    cameraSection: {
        backgroundColor: 'black',
    },
    divider: {
        backgroundColor: '#333',
    },
    verticalDivider: {
        width: 2,
        height: '100%',
    },
    horizontalDivider: {
        height: 2,
        width: '100%',
    },
});