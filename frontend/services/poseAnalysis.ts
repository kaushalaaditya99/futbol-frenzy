import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import resolveEndpoint from './resolveEndpoint';
import { PoseResult, VideoPoseResult } from '../types/pose';

// Get auth token from AsyncStorage
async function getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
}

// Helper function to make authenticated headers
async function authHeaders(): Promise<{ Authorization: string }> {
    const token = await getAuthToken();
    return { Authorization: `Token ${token}` };
}

/**
 * Analyze a single image frame for pose landmarks
 * Used for mobile camera streaming (frame-by-frame analysis)
 *
 * @param imageBase64 - Base64 encoded image data (without data URI prefix)
 * @returns PoseResult with landmarks or error
 */
export async function analyzeFrame(imageBase64: string): Promise<PoseResult> {
    try {
        const headers = await authHeaders();

        // Use React Native compatible FormData with base64 data URI
        const formData = new FormData();
        formData.append('image', {
            uri: `data:image/jpeg;base64,${imageBase64}`,
            type: 'image/jpeg',
            name: 'frame.jpg',
        } as any);

        const response = await axios.post(
            resolveEndpoint('/analyze-pose/'),
            formData,
            {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 5000,
            }
        );

        return {
            landmarks: response.data.landmarks || [],
            success: true,
        };
    } catch (error: any) {
        // Only log once, not every frame
        return {
            landmarks: [],
            success: false,
            error: error.message || 'Failed to analyze frame',
        };
    }
}

/**
 * Analyze a video file for pose landmarks across all frames
 * Used for post-recording analysis
 *
 * @param videoUri - URI of the video file
 * @returns VideoPoseResult with landmarks per frame
 */
export async function analyzeVideo(videoUri: string): Promise<VideoPoseResult> {
    try {
        const headers = await authHeaders();

        // Fetch the video and convert to blob
        const response = await fetch(videoUri);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append('video', blob, 'video.mp4');

        const apiResponse = await axios.post(
            resolveEndpoint('/analyze-video-pose/'),
            formData,
            {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 60000, // 60 second timeout for video processing
            }
        );

        return {
            frames: apiResponse.data.frames || [],
            success: true,
        };
    } catch (error: any) {
        console.error('Video analysis error:', error.message);
        return {
            frames: [],
            success: false,
            error: error.message || 'Failed to analyze video',
        };
    }
}

/**
 * Analyze an image file from URI for pose landmarks
 * Alternative method for images already on disk
 *
 * @param imageUri - URI of the image file
 * @returns PoseResult with landmarks or error
 */
export async function analyzeImage(imageUri: string): Promise<PoseResult> {
    try {
        const headers = await authHeaders();

        // Fetch the image and convert to blob
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append('image', blob, 'image.jpg');

        const apiResponse = await axios.post(
            resolveEndpoint('/analyze-pose/'),
            formData,
            {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 10000,
            }
        );

        return {
            landmarks: apiResponse.data.landmarks || [],
            success: true,
        };
    } catch (error: any) {
        console.error('Image analysis error:', error.message);
        return {
            landmarks: [],
            success: false,
            error: error.message || 'Failed to analyze image',
        };
    }
}