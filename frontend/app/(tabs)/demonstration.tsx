import { Camera, FolderOpen, MoveLeft } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";
import ButtonField from "@/components/ButtonField";
import { Fragment, useState } from "react";
import { uploadVideo, getVideoUrl } from "@/services/cloud";
import "expo-document-picker"
import * as DocumentPicker from "expo-document-picker";

export default function Demonstration() {
     // usestate for the uploaded/retrieved video URL
      const [videoSource, setVideoSource] = useState<string | null>(null);
      const [isUploading, setIsUploading] = useState(false);

      // Use remote URL if available, otherwise fall back to local asset
      const player = useVideoPlayer(
          videoSource || require('../../assets/videos/video.mp4')
      );

    // user taps the upload button, it opens the document picker, if a file is chosen, calls the backend
    // flow in `services/cloud` to get a presigned URL and upload the
    // selected video directly to S3.
    const pickAndUpload = async () => {
        try {
            setIsUploading
            const result = await DocumentPicker.getDocumentAsync({
                type: 'video/*',
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const { uri } = result.assets[0];
                const { videoUrl } = await uploadVideo(uri);
                console.log('uploaded URL', videoUrl);
                // TODO: you could set state here to display the video or
                // a confirmation message.
                //setVideoSource(videoUrl);
            }
        } catch (e) {
            console.error('upload failed', e);
        }
    };
    // Load a video from S3 by fileName (for testing retrieval, wont be like this in actual product)
    const loadVideoFromS3 = (fileName: string) => {
        const url = getVideoUrl(fileName);
        console.log("Loading video from S3:", url);
        setVideoSource(url);
    };
    return (
        <SafeAreaView
            edges={["top"]}
            style={{
                flex: 1,
                backgroundColor: "black"
            }}
        >
            {/* Header */}
            <View
                style={{
                    backgroundColor: "black",
                    height: 12 * 6,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 24,
                    columnGap: 12
                }}
            >
                <MoveLeft
                    size={24}
                    color="white"
                />
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: "white"
                    }}
                >
                    Shooting Accuracy
                </Text>
            </View>
            <ScrollView
                style={{
                    flex: 1,
                    flexDirection: "column",
                    backgroundColor: "white",
                    paddingHorizontal: 24,
                    paddingVertical: 24,
                    rowGap: 24 // Not working for some reason
                }}
            >
                {/* Demonstration */}
                <View
                    style={{
                        rowGap: 12,
                        marginBottom: 24
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: 600
                        }}
                    >
                        Demonstration
                    </Text>
                    <VideoView 
                        player={player}
                        style={{ 
                            width: "auto", 
                            height: 180,
                            backgroundColor: "lightgray",
                            borderWidth: 1,
                            borderColor: "black",
                            borderStyle: "solid",
                            borderRadius: 8,
                        }}
                    />
                    {videoSource && (
                        <Text style={{ fontSize: 12, color: "gray" }}>
                            Playing: S3 Video 
                        </Text>
                    )}
                </View>
                {/* Instructions */}
                <View
                    style={{
                        rowGap: 12,
                        borderWidth: 1,
                        borderColor: "black",
                        borderStyle: "solid",
                        borderRadius: 8,
                        paddingVertical: 12,
                        paddingHorizontal: 12,
                        marginBottom: 24
                    }}
                >
                    <View>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: 600,
                                marginBottom: 2
                            }}
                        >
                            Instructions
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: "gray"
                            }}
                        >
                            Set up 5 targets in the goal (4 corners + center). From 18 yards, take 10 shots aiming for different targets. Focus on planting foot position and follow through.
                        </Text>
                    </View>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            columnGap: 8
                        }}
                    >
                        {["Shooting", "5 min", "Beginner"].map((tag, i) => (
                            <View
                                key={i}
                                style={{
                                    paddingVertical: 2,
                                    paddingHorizontal: 12,
                                    borderRadius: 100,
                                    backgroundColor: "lightgray"
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 400
                                    }}
                                >
                                    {tag}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
                {/* Submission */}
                <View
                    style={{
                        paddingVertical: 24,
                        borderTopWidth: 1,
                        borderColor: "black",
                        borderStyle: "dashed",
                        rowGap: 12
                    }}
                >
                    <View>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: 600,
                                marginBottom: 2
                            }}
                        >
                            Your Submission
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: "gray"
                            }}
                        >
                            Record yourself performing the drill
                        </Text>
                    </View>
                    <View
                        style={{
                            borderWidth: 1,
                            borderColor: "black",
                            borderStyle: "dashed",
                            borderRadius: 8,
                            paddingHorizontal: 24,
                            paddingVertical: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 48,
                                marginBottom: 8
                            }}
                        >
                            📁
                        </Text>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 600
                            }}
                        >
                            {isUploading ? "Uploading..." : "Tap to Upload Video"}
                        </Text>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                columnGap: 8
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: "gray"
                                }}
                            >
                                MP4, MOV
                            </Text>
                            <View
                                style={{
                                    width: 3,
                                    height: 3,
                                    borderRadius: 1000,
                                    backgroundColor: "gray"
                                }}
                            />
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: "gray"
                                }}
                            >
                                Max 500MB
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            columnGap: 12
                        }}
                    >
                        <Pressable
                            style={{
                                flex: 1,
                                backgroundColor: "white",
                                borderWidth: 1,
                                borderColor: "black",
                                borderStyle: "solid",
                                borderRadius: 8,
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                columnGap: 4
                            }}
                        >
                            <Camera
                                size={18}
                            />
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: 600
                                }}
                            >
                                Record
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={pickAndUpload}
                            disabled={isUploading}
                            style={{
                                flex: 1,
                                backgroundColor: "white",
                                borderWidth: 1,
                                borderColor: "black",
                                borderStyle: "solid",
                                borderRadius: 8,
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                columnGap: 4,
                                opacity: isUploading ? 0.5 : 1
                            }}
                        >
                            <FolderOpen
                                size={18}
                            />
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: 600
                                }}
                            >
                                Upload
                            </Text>
                        </Pressable>
                    </View>
                    <Pressable
                        style={{
                            flex: 1,
                            backgroundColor: "black",
                            borderWidth: 1,
                            borderColor: "black",
                            borderStyle: "solid",
                            borderRadius: 8,
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            columnGap: 4
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 600,
                                color: "white"
                            }}
                        >
                            Submit for Review
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}