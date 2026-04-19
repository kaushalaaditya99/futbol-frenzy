// Platform-aware export for StudentCamera
// StudentCamera.native.tsx for iOS/Android
// StudentCamera.web.tsx for web
// at runtime Metro replaces it with the correct platform file

// For TypeScript during development, we import from web (which will be swapped at runtime)
// Metro's platform resolution will pick the correct file based on the platform
export { StudentCamera } from './StudentCamera.web';
export type { StudentCameraRef } from './StudentCamera.web';