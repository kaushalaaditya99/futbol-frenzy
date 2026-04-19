import { useState, useEffect, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import { useCameraPermissions } from 'expo-camera';

// Platform-aware camera permission hook
// Uses expo-camera for mobile, navigator.mediaDevices for web

export interface CameraPermissionState {
    granted: boolean;
    canAskAgain: boolean;
    request: () => Promise<boolean>;
    check: () => Promise<boolean>;
}

export function useCameraPermission(): CameraPermissionState {
    const [granted, setGranted] = useState(false);
    const [canAskAgain, setCanAskAgain] = useState(true);

    // Use expo-camera's hook for mobile
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();

    const check = useCallback(async (): Promise<boolean> => {
        if (Platform.OS === 'web') {
            try {
                // Check if mediaDevices API is available
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    console.warn('getUserMedia not supported');
                    return false;
                }

                // Check permission status if available
                if (navigator.permissions && navigator.permissions.query) {
                    const result = await navigator.permissions.query({ name: 'camera' } as PermissionDescriptor);
                    return result.state === 'granted';
                }

                return false;
            } catch (error) {
                console.error('Error checking camera permission:', error);
                return false;
            }
        } else {
            // Mobile - use expo-camera's permission status
            return cameraPermission?.granted ?? false;
        }
    }, [cameraPermission]);

    const request = useCallback(async (): Promise<boolean> => {
        if (Platform.OS === 'web') {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    Alert.alert('Error', 'Camera not supported in this browser');
                    return false;
                }

                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                // Immediately stop the stream - we just wanted to get permission
                stream.getTracks().forEach(track => track.stop());
                setGranted(true);
                return true;
            } catch (error: any) {
                console.error('Error requesting camera permission:', error);
                if (error.name === 'NotAllowedError') {
                    setCanAskAgain(false);
                    Alert.alert(
                        'Camera Permission Denied',
                        'Please enable camera access in your browser settings.'
                    );
                }
                return false;
            }
        } else {
            // Mobile - use expo-camera's request function
            const result = await requestCameraPermission();
            setCanAskAgain(result.canAskAgain);
            setGranted(result.granted);

            if (!result.granted && !result.canAskAgain) {
                Alert.alert(
                    'Camera Permission Denied',
                    'Please enable camera access in your device settings.'
                );
            }

            return result.granted;
        }
    }, [requestCameraPermission]);

    // Check permission on mount
    useEffect(() => {
        check().then(isGranted => setGranted(isGranted));
    }, [check]);

    return {
        granted,
        canAskAgain,
        request,
        check,
    };
}