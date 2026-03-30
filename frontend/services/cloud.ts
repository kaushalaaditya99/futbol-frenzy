import * as FileSystem from 'expo-file-system/legacy';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import resolveEndpoint from './resolveEndpoint';

// Get auth token from AsyncStorage
async function getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
}

// Helper function to make authenticated API calls
async function authHeaders(): Promise<{ Authorization: string }> {
    const token = await getAuthToken();
    return { Authorization: `Token ${token}` };
}

   export async function uploadVideo(uri: string) {
    // Upload  video (accessed by URI) to S3.
    // S3 will return a URL that we store in DB to reference video.

    // get presigned URL from backend
    const fileName = uri.split("/").pop() || "video.mp4";
    console.log("Requesting presigned URL for:", fileName);

    const headers = await authHeaders();
    const presignedResponse = await axios.post(
        `${resolveEndpoint("/get_presigned_url/")}`,
        {
            file_name: fileName,
            file_type: "video/mp4"
        },
        { headers }
    );
    console.log("Presigned response:", presignedResponse.data);
    const {uploadUrl, fields, videoUrl, fileKey} = presignedResponse.data;

    // create form data for S3 upload
    const formData = new FormData();
    // add all fields from presigned URL
    Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
    });

    // For web/blob URIs, we need to fetch blob first. React Native uses blobs and uris.
    let fileBlob;
    if (uri.startsWith('blob:')) {
        // Fetch blob from blob URL
        const response = await fetch(uri);
        fileBlob = await response.blob();
    } else {
        // For native file URIs, use expo-file-system to read
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        fileBlob = await fetch(`data:video/mp4;base64,${base64}`).then(r => r.blob());
    }

    // append file with proper blob
    formData.append("file", fileBlob, fileName);

    console.log("Uploading to:", uploadUrl);
    console.log("File blob size:", fileBlob.size);

    // upload to S3
    const uploadResponse = await axios.post(uploadUrl, formData, {
        transformRequest: (data) => {
            // For React Native/Web, FormData must be sent as-is
            return data;
        },
    });
    console.log("Upload successful:", uploadResponse.status);

    return {videoUrl, fileName, fileKey};
}

// Getting stuff from s3:

const S3_BUCKET_URL = "https://direct-object-upload-seniorproj-s3.s3.amazonaws.com";

// Extract file key from a full S3 URL (useful for re-uploads or references)
export function extractFileKey(videoUrl: string): string {
    // Handle both full URLs and already-extracted keys
    if (videoUrl.startsWith(S3_BUCKET_URL + '/')) {
        return videoUrl.replace(S3_BUCKET_URL + '/', '');
    }
    return videoUrl;
}

// retrieve video from S3 given video URL or file key
export function getVideoUrl(fileKey: string): string {
    return `${S3_BUCKET_URL}/${fileKey}`;
}

// Retrieve a video from S3 and download it to local storage
export async function retrieveVideo(videoUrlOrFileKey: string) {
    const fileKey = extractFileKey(videoUrlOrFileKey);
    const videoUrl = getVideoUrl(fileKey);
    console.log("Retrieving video from:", videoUrl);

    // download to a local file using expo-file-system
    const localUri = `${FileSystem.documentDirectory}${fileKey.split('/').pop()}`;

    const downloadResult = await FileSystem.downloadAsync(videoUrl, localUri);
    console.log("Video downloaded to:", downloadResult.uri);

    return downloadResult.uri;
}

export async function videoExists(videoUrlOrFileKey: string) {
    const fileKey = extractFileKey(videoUrlOrFileKey);
    const videoUrl = getVideoUrl(fileKey);
    try {
        const response = await axios.head(videoUrl);
        return response.status === 200;
    } catch {
        return false;
    }
}

// Create a new drill with uploaded video URL
export async function createDrill(drillData: {
    drillName: string;
    drillType: string;
    coachID: number;
    url: string;  // S3 video URL
    time: number;
    difficultyLevel: string;
    instructions: string;
    imageBackgroundColor: string;
    imageText: string;
    imageTextColor: string;
    publicDrill: boolean;
}): Promise<{ id: number; drillName: string }> {
    const API_URL = resolveEndpoint("/api/");
    const headers = await authHeaders();

    const response = await axios.post(
        `${API_URL}drills/`,
        drillData,
        { headers }
    );

    return response.data;
}

// Create a new submission
export async function createSubmission(submissionData: {
    studentID: number;
    assignmentID: number;
    imageBackgroundColor?: string;
    imageText?: string;
    imageTextColor?: string;
}): Promise<{ id: number }> {
    const API_URL = resolveEndpoint("/api/");
    const headers = await authHeaders();

    const response = await axios.post(
        `${API_URL}submissions/`,
        submissionData,
        { headers }
    );

    return response.data;
}

// Create a submitted drill (student's video submission for a specific drill)
export async function createSubmittedDrill(submittedDrillData: {
    submissionID: number;
    drillID: number;
    videoURL: string;
    touchCount?: number;
}): Promise<{ id: number; videoURL: string }> {
    const API_URL = resolveEndpoint("/api/");
    const headers = await authHeaders();

    const response = await axios.post(
        `${API_URL}submitteddrills/`,
        submittedDrillData,
        { headers }
    );

    return response.data;
}

// Create a submitted drill with an existing S3 URL (no re-upload needed)
export async function saveSubmittedDrillWithUrl(params: {
    submissionID: number;
    drillID: number;
    s3VideoUrl: string;
    touchCount?: number;
}): Promise<{ id: number; videoURL: string }> {
    return createSubmittedDrill({
        submissionID: params.submissionID,
        drillID: params.drillID,
        videoURL: params.s3VideoUrl,
        touchCount: params.touchCount || -1
    });
}

// Upload video to S3, then save submitted drill to database
export async function uploadAndSubmitDrill(params: {
    videoUri: string;
    submissionID: number;
    drillID: number;
    touchCount?: number;
}): Promise<{ videoUrl: string; submittedDrillId: number; fileKey: string }> {
    const { videoUri, submissionID, drillID, touchCount } = params;

    // Upload video to S3
    const { videoUrl, fileKey } = await uploadVideo(videoUri);

    // Save to database
    const result = await createSubmittedDrill({
        submissionID,
        drillID,
        videoURL: videoUrl,
        touchCount: touchCount || -1
    });

    return {
        videoUrl,
        submittedDrillId: result.id,
        fileKey
    };
}

// Upload video to S3, then create a drill
export async function uploadAndCreateDrill(params: {
    videoUri: string;
    drillName: string;
    drillType: string;
    coachID: number;
    time: number;
    difficultyLevel: string;
    instructions: string;
    imageBackgroundColor: string;
    imageText: string;
    imageTextColor: string;
    publicDrill: boolean;
}): Promise<{ videoUrl: string; drillId: number; fileKey: string }> {
    const { videoUri, ...drillFields } = params;

    // upload video to S3
    const { videoUrl, fileKey } = await uploadVideo(videoUri);

    // create drill in database with S3 URL
    const result = await createDrill({
        ...drillFields,
        url: videoUrl
    });

    return {
        videoUrl,
        drillId: result.id,
        fileKey
    };
}

