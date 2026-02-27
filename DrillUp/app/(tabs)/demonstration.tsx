import { Camera, FolderOpen, MoveLeft } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";
import ButtonField from "@/components/ButtonField";
import { Fragment } from "react";

export default function Demonstration() {
    const player = useVideoPlayer(require('../../assets/videos/video.mp4'));

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
                                fontSize: 48
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
                            Tap to Upload Video
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
    )
}