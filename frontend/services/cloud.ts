import * as FileSystem from 'expo-file-system/legacy';
import axios from "axios";
import { Platform } from "react-native";

const BACKEND_URL = Platform.OS === 'android'
   ? 'http://10.0.2.2:8000'
   : 'http://127.0.0.1:8000';

   export async function uploadVideo(uri: string) {
    // You'd do whatever you need to
    // upload the video (accessed by the URI) to the
    // cloud. The cloud will return an URL that we will
    // store in the DB to reference the video.

    // get presigned URL from backend
    const fileName = uri.split("/").pop() || "video.mp4";
    console.log("Requesting presigned URL for:", fileName);

    const presignedResponse = await axios.post(
        `${BACKEND_URL}/drill/get_presigned_url/`, 
        {
            file_name: fileName,
            file_type: "video/mp4"
        }
    );
    //console.log("Presigned response:", presignedResponse.data);
    const {uploadUrl, fields, videoUrl} = presignedResponse.data;

    // create form data for the S3 upload
    const formData = new FormData();
    // add all fields from presigned URL
    Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
    });
    // add the file itself
    formData.append("file", {
        uri: uri,
        type: "video/mp4",
        name: fileName,
    } as any);

    console.log("Uploading to:", uploadUrl);

    // upload to S3
    const uploadResponse = await axios.post(uploadUrl, formData);
    console.log("Upload successful:", uploadResponse.status);

    return {videoUrl, fileName};
}

// Getting stuff from s3:

const S3_BUCKET_URL = "https://direct-object-upload-seniorproj-s3.s3.amazonaws.com";
// retrieve video from S3 given the video URL
export function getVideoUrl(fileName: string) {
    return `${S3_BUCKET_URL}/${fileName}`;
}
// Retrieve a video from S3 and download it to local storage
export async function retrieveVideo(fileName: string) {
    const videoUrl = getVideoUrl(fileName);
    console.log("Retrieving video from:", videoUrl);

    // download to a local file using expo-file-system
    const localUri = `${FileSystem.documentDirectory}${fileName}`;

    const downloadResult = await FileSystem.downloadAsync(videoUrl, localUri);
    console.log("Video downloaded to:", downloadResult.uri);

    return downloadResult.uri;
  }
export async function videoExists(fileName: string){
    const videoUrl = getVideoUrl(fileName);
    try {
        const response = await axios.head(videoUrl);
        return response.status === 200;
    } catch {
        return false;
    }
  }