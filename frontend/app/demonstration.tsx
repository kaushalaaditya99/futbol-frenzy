import { Camera, Check, FolderOpen, MoveLeft, MoveRight, NotepadText, Sparkle } from "lucide-react-native";
import { ActivityIndicator, Alert, Dimensions, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";
import { colors, fontSize, letterSpacing, margin, padding, shadow } from "@/theme";
import { useEffect, useState } from "react";
import { Drill, getSession, Session, submitSessionForGrading } from "@/services/sessions";
import { Asset } from 'expo-asset';
import ProgressBar from "@/components/pages/demonstration/ProgressBar";
import { router, useLocalSearchParams } from "expo-router";
import { Analysis, getAnalysis } from "@/services/analysis";
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import ButtonBack from "@/components/ui/button/ButtonBack";
import ThemedText from "@/components/ui/ThemedText";
import Button from "@/components/ui/button/Button";
import { buttonTheme } from "@/components/ui/button/buttonTheme";
import ButtonHalfWidth from "@/components/ui/button/ButtonHalfWidth";
import { launchCameraAsync, launchImageLibraryAsync, useCameraPermissions, useMediaLibraryPermissions } from "expo-image-picker";
import { useAuth } from "@/contexts/AuthContext";

// Example
// This is just a workaround so you can see the functionality.
// When everything is in place, this will be deleted.
// const localVideos = {
//     "@/assets/videos/video.mp4": require("@/assets/videos/video.mp4"),
//     "@/assets/videos/video2.mp4": require("@/assets/videos/video2.mp4"),
//     "@/assets/videos/video3.mp4": require("@/assets/videos/video3.mp4"),
//     "@/assets/videos/video4.mp4": require("@/assets/videos/video4.mp4"),
// };

interface Submission {
    uri: string;
    analysis: Analysis | null;
}

interface Submissions {[drillIndex: number]: Submission};

export default function Demonstration() {
    const { token } = useAuth();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [session, setSession] = useState<Session>();
    const [drillIndex, setDrillIndex] = useState<number>(0);
    const [drill, setDrill] = useState<Drill>();

    const drillPlayer = useVideoPlayer(null, (player) => {
        player.muted = true;
        player.audioMixingMode = "mixWithOthers";
        player.loop = true;
    });
    
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [mediaLibraryPermission, requestMediaLibraryPermission] = useMediaLibraryPermissions();
    
    const [submissions, setSubmissions] = useState<Submissions>({});
    const [submittedDrills, setSubmittedDrills] = useState<Array<number>>([]);
    
    const submissionPlayer = useVideoPlayer(null, (player) => {
        player.muted = true;
        player.audioMixingMode = "mixWithOthers";
    });

    // Used for Blur Effect
    const insets = useSafeAreaInsets();

    // Loading
    // I'm adding an artificial load, I think it might
    // be helpful for the user and for the example.
    // There's definitely a better way to do this, but
    // I cannot be arsed.
    const [sendingSubmission, setSendingSubmission] = useState(false);
    const [sentSubmission, setSentSubmission] = useState<boolean>();

    useEffect(() => {
        // When this is true, which should
        // take place after 4s or so, we will
        // go back.
        if (sentSubmission)
            router.back();
    }, [sentSubmission])

    useEffect(() => {
        loadSession();
    }, []);


    useEffect(() => {
        if (!session || !session.drills.length)
            return;
        updateDrillData(session, drillIndex);
    }, [session, drillIndex]);

    
    useEffect(() => {
        updateSubmissionData(submissions, drillIndex);
    }, [submissions, drillIndex]);
    

    const loadSession = async () => {
        if (!token)
            return;

        const session = await getSession(token, parseInt(id));
        console.log(session);
        
        if (!session)
            return;

        setSession(session);
    }


    const updateDrillData = async (session: Session, drillIndex: number) => {
        const drill = session.drills[drillIndex];
        setDrill(drill);
        
        const resolvedURL = await resolveURL(drill.url);
        drillPlayer.replaceAsync(resolvedURL);
        drillPlayer.play();
    }


    const updateSubmissionData = async (submissions: Submissions, drillIndex: number) => {
        const submissionURI = submissions[drillIndex] || null;
        submissionPlayer.replaceAsync(submissionURI);
        submissionPlayer.play();
        
        const submitted = Object.keys(submissions).map(drillIndex => parseInt(drillIndex));
        setSubmittedDrills(submitted);
    }


    const safelySetDrillIndex = (drillIndex: number) => {
        if (!session)
            return;
        const safeDrillIndex = Math.max(0, Math.min(drillIndex || 0, session.drills.length - 1)); 
        const safeDrill = session.drills[safeDrillIndex];
        setDrillIndex(safeDrillIndex);
    }

    
    const nextDrill = () => {
        safelySetDrillIndex(drillIndex + 1);
    }


    const prevDrill = () => {
        safelySetDrillIndex(drillIndex - 1);
    }


    // As there's no real data, I'm using local videos. 
    // I use an alias in the filepaths for convenience. 
    // However, you need to resolve this before using it
    // in useVideoPlayer.
    const resolveURL = async (url: string) => {
        if (!!url && url.charAt(0) === "@") {
            const resolvedURL = await Asset.loadAsync((localVideos as any)[url]);
            return resolvedURL[0].localUri;
        }
        return url;
    }


    const uploadVideoFromCamera = async (drillIndex: number) => {
        if (!cameraPermission?.granted) {
            const ask = await requestCameraPermission();
            if (!ask.granted) {
                Alert.alert("Permission Required", "Camera access is needed to record a video.");
                return;
            }
        }

        const video = await launchCameraAsync({mediaTypes: ["videos"]});
        if (!video.canceled) {
            const uri = video.assets[0].uri;
            storeVideoInSubmissions(drillIndex, uri);
        }
    }


    const uploadVideoFromLibrary = async (drillIndex: number) => {        
        if (!mediaLibraryPermission?.granted) {
            const ask = await requestMediaLibraryPermission();
            if (!ask.granted) {
                Alert.alert("Permission Required", "Media library access is needed to select a video.");
                return;
            }
        }

        const video = await launchImageLibraryAsync({mediaTypes: ["videos"]});
        if (!video.canceled) {
            const uri = video.assets[0].uri;
            storeVideoInSubmissions(drillIndex, uri);
        }
    }


    const storeVideoInSubmissions = async (drillIndex: number, uri: string) => {
        setSubmissions({
            ...submissions,
            [drillIndex]: {
                uri,
                analysis: null
            }
        });
    }
    

    const analyzeVideoSubmission = async (submissions: Submissions, drills: Array<Drill>, drillIndex: number) => {
        const drillID = drills[drillIndex].id;
        const drillURI = submissions[drillIndex].uri;
        
        const analysis = await getAnalysis(drillID, drillURI);
        setSubmissions({
            ...submissions,
            [drillIndex]: {
                uri: submissions[drillIndex].uri,
                analysis: analysis
            }
        });   
    }


    const submitSession = async (session: Session, submissions: Submissions) => {
        // This information would be provided elsewhere.
        // But, as this is an example, I'll define fake
        // values here.
        const sessionID = 0;
        const studentID = 2;
        //const drills = Object.fromEntries(Object.entries(submissions).map(([k, v]) => [k, v.uri]));
        const assignmentID = sessionID;
        setSendingSubmission(true);
        try {
            const submission = await createSubmission({
                studentID,
                assignmentID,
                imageBackgroundColor: "#FFFFFF",
                imageText: "",
                imageTextColor: "#000000"
            });
            const submissionID = submission.id;
            await Promise.all(Object.entries(submissions).map(async ([drillIndexStr, {uri, analysis}]) => {
                const drillIndex = parseInt(drillIndexStr);
                const drill = session.drills[drillIndex];
                await uploadAndSubmitDrill({
                    videoUri: uri,
                    submissionID,
                    drillID: drill.id,
                    touchCount: analysis?.numTouches || undefined
                });
            }));

            setSendingSubmission(false);
            setSentSubmission(false);
            setTimeout(() => {
                setSentSubmission(true);
            }, 500);
        } catch (error) {
            setSendingSubmission(false);
            Alert.alert("Submission Failed", "There was a problem submitting your drills. Please try again.");
            console.log("Error submitting session:", error);
        }
        const drills = Object.fromEntries(Object.entries(submissions).map(([k, v]) => [k, v.uri]));
        
        // Error (Missing Video)
        // if (Object.keys(drills).length !== session.drills.length) {
        //     alert("Must Submit All Drills!");
        //     return;
        // }

        const submitted = await submitSessionForGrading(
            sessionID,
            studentID,
            drills
        );

        if (!submitted) {
            alert("Error in Drill Submission!");
            return false;
        }

        setSendingSubmission(true);
        setTimeout(() => {
            setSendingSubmission(false);
            setSentSubmission(false);
            setTimeout(() => {
                setSentSubmission(true);
            }, 500);
        }, 2000);
    }


    return (
        <View
            style={{
                flex: 1,
                // backgroundColor: colors.palettes.neutral[0],
                backgroundColor: "red",
                position: "relative"
            }}
        >
            {(session && drill) &&
                <>
                    <StatusBar 
                        style="light"  
                    />
                    <BlurView
                        intensity={50}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            minHeight: insets.top,
                            paddingTop: insets.top,
                            zIndex: 100,
                            paddingVertical: padding.xl,
                            paddingHorizontal: padding.md,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            columnGap: 12,
                            backgroundColor: "#ffffff75"
                        }}
                    >
                        <ButtonBack
                            onBack={() => router.back()}
                        />
                    </BlurView>
                    <ScrollView
                        style={{
                            flex: 1,
                        }}
                        // contentContainerStyle={{ paddingBottom: 10000 }}
                    >
                        <VideoView 
                            player={drillPlayer}
                            style={{ 
                                // width: Dimensions.get("screen").width * 1, 
                                height: Dimensions.get("screen").height * 0.5,
                                // position: "absolute",
                                // top: 0,
                                // left: 0,
                                backgroundColor: colors.palettes.neutral[0]
                            }}
                            contentFit="cover"
                        />
                        <View
                            style={{
                                width: "100%", 
                                // height: Dimensions.get("screen").height * 0.5,
                                // maxHeight: Dimensions.get("screen").height * 0.5,
                                // position: "absolute",
                                // top: Dimensions.get("screen").height * 0.5 + 0,
                                // left: 0,
                                flex: 1,
                                backgroundColor: colors.schemes.light.surface,
                                ...shadow.lg
                            }}
                        >
                            <ProgressBar
                                drills={session.drills}
                                drillIndex={drillIndex}
                                submittedDrills={submittedDrills}
                                setDrillIndex={safelySetDrillIndex}
                            />
                            <View
                                style={{
                                    paddingTop: margin.sm,
                                    borderBottomWidth: 1,
                                    borderColor: colors.schemes.light.outlineVariant,
                                    borderStyle: "solid",
                                    backgroundColor: colors.schemes.light.background
                                }}
                            >
                                <View>
                                    <ThemedText
                                        style={{
                                            paddingHorizontal: 12,
                                            paddingBottom: padding.xs,
                                            fontSize: 12,
                                            fontWeight: 600,
                                            letterSpacing: letterSpacing.xl,
                                            color: colors.schemes.light.onSurfaceVariant
                                        }}
                                    >
                                        {(session?.name || "").toUpperCase()}
                                    </ThemedText>
                                    <ThemedText
                                        style={{
                                            paddingHorizontal: 12,
                                            paddingBottom: padding.sm,
                                            fontSize: 20,
                                            fontWeight: 600,
                                            letterSpacing: letterSpacing.sm,
                                            marginBottom: 2
                                        }}
                                    >
                                        {drill.name}
                                    </ThemedText>
                                    <ThemedText
                                        style={{
                                            paddingHorizontal: 12,
                                            marginBottom: margin.sm,
                                            fontSize: fontSize.base,
                                            letterSpacing: letterSpacing.xl,
                                            color: colors.schemes.light.onSurfaceVariant
                                        }}
                                    >
                                        {drill.instructions}
                                    </ThemedText>
                                </View>
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        borderTopWidth: 1,
                                        borderStyle: "dashed",
                                        borderColor: colors.schemes.light.outlineVariant,
                                    }}
                                >
                                    {[drill.type, `${drill.time} min`, drill.level].map((tag, i) => (
                                        <View
                                            key={i}
                                            style={{
                                                flex: 1,
                                                justifyContent: "center",
                                                paddingVertical: padding.md,
                                                paddingHorizontal: padding.lg,
                                                borderLeftWidth: i === 0 ? 0 : 1,
                                                borderColor: colors.schemes.light.outlineVariant,
                                                backgroundColor: colors.schemes.light.surface,
                                            }}
                                        >
                                            <ThemedText
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    letterSpacing: 0.25,
                                                    textAlign: "center",
                                                    color: colors.schemes.light.onSurfaceVariant
                                                }}
                                            >
                                                {tag.toUpperCase()}
                                            </ThemedText>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            <View
                                style={{
                                    paddingVertical: 12,
                                    paddingTop: 20,
                                    paddingHorizontal: 0,
                                }}
                            >
                                <ThemedText
                                    style={{
                                        paddingHorizontal: 12,
                                        fontSize: 18,
                                        fontWeight: 600,
                                        letterSpacing: -0.25,
                                        marginBottom: 2,
                                        textAlign: "center"
                                    }}
                                >
                                    Your Submission
                                </ThemedText>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        marginBottom: 20,
                                        paddingHorizontal: 12,
                                    }}
                                >
                                    <ThemedText
                                        style={{
                                            fontSize: 14,
                                            letterSpacing: 0.25,
                                            color: colors.schemes.light.onSurfaceVariant,
                                            textAlign: "center",
                                            maxWidth: 300,
                                        }}
                                    >
                                        Upload a video of yourself performing the drill.
                                    </ThemedText>
                                </View>
                                <View
                                    style={{
                                        paddingHorizontal: 12,
                                        flexDirection: "row",
                                        columnGap: padding.lg,
                                        marginBottom: 12,
                                    }}
                                >
                                    <ButtonHalfWidth
                                        buttonHeight={60}
                                        {...buttonTheme.black}
                                        onPress={() => uploadVideoFromCamera(drillIndex)}
                                    >
                                        <Camera
                                            color="white"
                                            size={18}
                                        />
                                        <ThemedText
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                letterSpacing: letterSpacing.lg,
                                                color: "white",
                                                textAlign: "center"
                                            }}
                                        >
                                            Record Video
                                        </ThemedText>
                                    </ButtonHalfWidth>
                                    <ButtonHalfWidth
                                        {...buttonTheme.black}
                                        buttonHeight={60}
                                        onPress={() => uploadVideoFromLibrary(drillIndex)}
                                    >
                                        <FolderOpen
                                            color="white"
                                            size={18}
                                        />
                                        <ThemedText
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                letterSpacing: letterSpacing.lg,
                                                color: "white",
                                                textAlign: "center"
                                            }}
                                        >
                                            Upload Video
                                        </ThemedText>
                                    </ButtonHalfWidth>
                                </View>
                                {!submissions[drillIndex]?.uri &&
                                    <Pressable
                                        onPress={() => uploadVideoFromLibrary(drillIndex)}
                                        style={{ 
                                            width: "auto", 
                                            height: 180,
                                            marginBottom: 12,
                                            marginHorizontal: 12,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderWidth: 1,
                                            borderColor: colors.schemes.light.outlineVariant,
                                            borderStyle: "dashed",
                                            borderRadius: 12,
                                            backgroundColor: colors.schemes.light.surfaceContainerHigh
                                        }}
                                    >
                                        <ThemedText
                                            style={{
                                                fontSize: 32,
                                                marginBottom: 8
                                            }}
                                        >
                                            🎥
                                        </ThemedText>
                                        <ThemedText
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 500,
                                                marginBottom: 2,
                                                letterSpacing: 0.1,
                                                textAlign: "center",
                                                color: colors.schemes.light.onSurfaceVariant
                                            }}
                                        >
                                            MP4, MOV
                                        </ThemedText>
                                        <ThemedText
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 500,
                                                letterSpacing: 0.1,
                                                textAlign: "center",
                                                color: colors.schemes.light.onSurfaceVariant,
                                                opacity: 0.5
                                            }}
                                        >
                                            Max 500MB
                                        </ThemedText>
                                    </Pressable>
                                }
                                {!!submissions[drillIndex]?.uri &&
                                    <VideoView 
                                        player={submissionPlayer}
                                        style={{ 
                                            width: "auto", 
                                            height: 180,
                                            marginBottom: 12,
                                            marginHorizontal: 12,
                                            borderRadius: 12,
                                            backgroundColor: colors.palettes.neutral[0]
                                        }}
                                        contentFit="cover"
                                    />
                                }
                                <View
                                    style={{
                                        marginHorizontal: 12,
                                        marginBottom: 12
                                    }}
                                >
                                    <Button
                                        {...((!!submissions[drillIndex]?.uri) ? buttonTheme.black : buttonTheme.disabled)}
                                        onPress={() => {
                                            if (!submissions[drillIndex]?.uri)
                                                return;
                                            analyzeVideoSubmission(submissions, session.drills, drillIndex);
                                        }}
                                        outerStyle={{
                                            alignSelf: undefined,
                                            borderBottomLeftRadius: !submissions[drillIndex]?.analysis ? 10 : 0,
                                            borderBottomRightRadius: !submissions[drillIndex]?.analysis ? 10 : 0
                                        }}
                                        innerStyle={{
                                            flex: 1,
                                            columnGap: 6
                                        }}
                                    >
                                        <Sparkle
                                            color={"white"}
                                            size={18}
                                            opacity={(!!submissions[drillIndex]?.uri) ? 1: 0.75}
                                        />
                                        <ThemedText
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                letterSpacing: letterSpacing.lg,
                                                color: "white",
                                                textAlign: "center",
                                                opacity: (!!submissions[drillIndex]?.uri) ? 1: 0.75
                                            }}
                                        >
                                            Analyze Video
                                        </ThemedText>
                                    </Button>
                                    {submissions[drillIndex]?.analysis &&
                                        <View
                                            style={{
                                                borderWidth: 1,
                                                borderColor: colors.schemes.light.outlineVariant,
                                                borderBottomLeftRadius: 10,
                                                borderBottomRightRadius: 10,
                                                ...shadow.sm
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    columnGap: 6,
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 12,
                                                    borderBottomWidth: 1,
                                                    borderColor: colors.schemes.light.outlineVariant,
                                                    borderStyle: "dashed",
                                                    backgroundColor: colors.schemes.light.surfaceContainerHigh
                                                }}
                                            >
                                                <NotepadText
                                                    size={18}
                                                />
                                                <ThemedText
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        letterSpacing: letterSpacing.lg,
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    Video Analysis Results
                                                </ThemedText>
                                            </View>
                                            <View
                                                style={{
                                                    padding: 12,
                                                    paddingVertical: 16,
                                                    rowGap: 12,
                                                    backgroundColor: colors.schemes.light.surfaceBright,
                                                    borderBottomRightRadius: 10,
                                                    borderBottomLeftRadius: 10,
                                                }}
                                            >
                                                <View>
                                                    <ThemedText
                                                        style={{
                                                            marginBottom: 2,
                                                            fontSize: 14,
                                                            fontWeight: 600,
                                                            letterSpacing: 0.25,
                                                        }}
                                                    >
                                                        1. Statistics
                                                    </ThemedText>
                                                    <View
                                                        style={{
                                                            flexDirection: "row",
                                                            columnGap: 4,
                                                            marginLeft: 12,
                                                            paddingLeft: 12,
                                                            borderLeftWidth: 1,
                                                            borderColor: colors.schemes.light.outlineVariant
                                                        }}
                                                    >
                                                        <ThemedText
                                                            style={{
                                                                fontSize: 14,
                                                                fontWeight: 500,
                                                                letterSpacing: 0.25,
                                                                color: colors.schemes.light.onSurface
                                                            }}
                                                        >
                                                            1.1 Number Touches
                                                        </ThemedText>
                                                        <ThemedText
                                                            style={{
                                                                fontSize: 14,
                                                                fontWeight: 400,
                                                                letterSpacing: 0.25,
                                                                color: colors.schemes.light.onSurfaceVariant
                                                            }}
                                                        >
                                                            {submissions[drillIndex]?.analysis.numTouches}
                                                        </ThemedText>
                                                    </View>
                                                </View>
                                                <View>
                                                    <ThemedText
                                                        style={{
                                                            marginBottom: 4,
                                                            fontSize: 14,
                                                            fontWeight: 600,
                                                            letterSpacing: 0.25,
                                                        }}
                                                    >
                                                        2. Mistakes
                                                    </ThemedText>
                                                    <View
                                                        style={{
                                                            rowGap: 4,
                                                            marginLeft: 12,
                                                            paddingLeft: 12,
                                                            borderLeftWidth: 1,
                                                            borderColor: colors.schemes.light.outlineVariant
                                                        }}
                                                    >
                                                        {submissions[drillIndex]?.analysis.mistakes.map((mistake, i) => (
                                                            <View
                                                                key={i}
                                                                style={{
                                                                    flexDirection: "row",
                                                                    columnGap: 4
                                                                }}
                                                            >
                                                                <ThemedText
                                                                    style={{
                                                                        fontSize: 14,
                                                                        fontWeight: 400,
                                                                        letterSpacing: 0.25,
                                                                        color: colors.schemes.light.onSurfaceVariant
                                                                    }}
                                                                >
                                                                    <ThemedText
                                                                        style={{
                                                                            fontWeight: 500,
                                                                            color: colors.schemes.light.onSurface
                                                                        }}
                                                                    >
                                                                        2.{i+1}. {mistake.mistakeType}{' '}
                                                                    </ThemedText>
                                                                    {mistake.mistakeDesc}
                                                                </ThemedText>
                                                            </View>
                                                        ))}
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    }
                                </View>
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginHorizontal: 12,
                                        marginBottom: 36,
                                        columnGap: 12
                                    }}
                                >
                                    <ButtonHalfWidth
                                        {...((drillIndex !== 0) ? buttonTheme.black : buttonTheme.disabled)}
                                        onPress={prevDrill}
                                    >
                                        <MoveLeft
                                            color={"white"}
                                            size={18}
                                            opacity={drillIndex !== 0 ? 1: 0.75}
                                        />
                                        <ThemedText
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                letterSpacing: letterSpacing.lg,
                                                color: "white",
                                                textAlign: "center",
                                                opacity: drillIndex !== 0 ? 1: 0.75
                                            }}
                                        >
                                            Back
                                        </ThemedText>
                                    </ButtonHalfWidth>
                                    {(session && session.drills && (drillIndex || 0) !== session.drills.length - 1) &&
                                        <ButtonHalfWidth
                                            {...buttonTheme.black}
                                            onPress={nextDrill}
                                        >
                                            <ThemedText
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: 500,
                                                    letterSpacing: letterSpacing.lg,
                                                    color: "white",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Next
                                            </ThemedText>
                                            <MoveRight
                                                color={"white"}
                                                size={18}
                                            />
                                        </ButtonHalfWidth>
                                    }
                                    {(session && session.drills && (drillIndex || 0) === session.drills.length - 1) &&
                                        <ButtonHalfWidth
                                            {...buttonTheme.blue}
                                            onPress={() => submitSession(session, submissions)}
                                        >
                                            {sendingSubmission === true &&
                                                <ActivityIndicator
                                                    color="white"
                                                    size={18}
                                                />
                                            }
                                            {sentSubmission === false &&
                                                <Check
                                                    color="white"
                                                    size={18}
                                                />
                                            }
                                            <ThemedText
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: 500,
                                                    letterSpacing: letterSpacing.lg,
                                                    color: "white",
                                                    textAlign: "center"
                                                }}
                                            >
                                                Complete Session
                                            </ThemedText>
                                        </ButtonHalfWidth>
                                    }
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </>
            }
        </View>
    )
}

// import { Camera, Check, FolderOpen, MoveLeft, MoveRight, NotepadText, Sparkle } from "lucide-react-native";
// import { ActivityIndicator, Dimensions, Pressable, ScrollView, View } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useVideoPlayer, VideoView } from "expo-video";
// import { colors, fontSize, letterSpacing, margin, padding, shadow } from "@/theme";
// import { useEffect, useState } from "react";
// import { Drill, getSession, Session, submitSessionForGrading } from "@/services/sessions";
// import { Asset } from 'expo-asset';
// import ProgressBar from "@/components/pages/demonstration/ProgressBar";
// import { router } from "expo-router";
// import { Analysis, getAnalysis } from "@/services/analysis";
// import { BlurView } from 'expo-blur';
// import { StatusBar } from 'expo-status-bar';
// import ButtonBack from "@/components/ui/button/ButtonBack";
// import ThemedText from "@/components/ui/ThemedText";
// import Button from "@/components/ui/button/Button";
// import { buttonTheme } from "@/components/ui/button/buttonTheme";
// import ButtonHalfWidth from "@/components/ui/button/ButtonHalfWidth";
// import { launchCameraAsync, launchImageLibraryAsync, useCameraPermissions, useMediaLibraryPermissions } from "expo-image-picker";
// import { createSubmission, uploadAndSubmitDrill } from "@/services/cloud";
// import { useAuth } from "@/contexts/AuthContext";

// // Example
// // This is just a workaround so you can see the functionality.
// // When everything is in place, this will be deleted.
// const localVideos = {
//     "@/assets/videos/video.mp4": require("@/assets/videos/video.mp4"),
//     "@/assets/videos/video2.mp4": require("@/assets/videos/video2.mp4"),
//     "@/assets/videos/video3.mp4": require("@/assets/videos/video3.mp4"),
//     "@/assets/videos/video4.mp4": require("@/assets/videos/video4.mp4"),
// };

// interface Submission {
//     uri: string;
//     analysis: Analysis | null;
// }

// interface Submissions {[drillIndex: number]: Submission};

// export default function Demonstration() {
//     const { token } = useAuth();
//     const [session, setSession] = useState<Session>();
//     const [drillIndex, setDrillIndex] = useState<number>(0);
//     const [drill, setDrill] = useState<Drill>();

//     const drillPlayer = useVideoPlayer(null, (player) => {
//         player.muted = true;
//         player.audioMixingMode = "mixWithOthers";
//         player.loop = true;
//     });
    
//     const [cameraPermission, requestCameraPermission] = useCameraPermissions();
//     const [mediaLibraryPermission, requestMediaLibraryPermission] = useMediaLibraryPermissions();
    
//     const [submissions, setSubmissions] = useState<Submissions>({});
//     const [submittedDrills, setSubmittedDrills] = useState<Array<number>>([]);
    
//     const submissionPlayer = useVideoPlayer(null, (player) => {
//         player.muted = true;
//         player.audioMixingMode = "mixWithOthers";
//     });

//     // Used for Blur Effect
//     const insets = useSafeAreaInsets();

//     // Loading
//     // I'm adding an artificial load, I think it might
//     // be helpful for the user and for the example.
//     // There's definitely a better way to do this, but
//     // I cannot be arsed.
//     const [sendingSubmission, setSendingSubmission] = useState(false);
//     const [sentSubmission, setSentSubmission] = useState<boolean>();

//     useEffect(() => {
//         // When this is true, which should
//         // take place after 4s or so, we will
//         // go back.
//         if (sentSubmission)
//             router.back();
//     }, [sentSubmission])

//     useEffect(() => {
//         loadSession();
//     }, []);


//     useEffect(() => {
//         if (!session || !session.drills.length)
//             return;
//         updateDrillData(session, drillIndex);
//     }, [session, drillIndex]);

    
//     useEffect(() => {
//         updateSubmissionData(submissions, drillIndex);
//     }, [submissions, drillIndex]);
    

//     const loadSession = async () => {
//         if (!token) return;
//         const session = await getSession(token, 0);
//         if (session) setSession(session);
//     }


//     const updateDrillData = async (session: Session, drillIndex: number) => {
//         const drill = session.drills[drillIndex];
//         setDrill(drill);
        
//         const resolvedURL = await resolveURL(drill.url);
//         drillPlayer.replaceAsync(resolvedURL);
//         drillPlayer.play();
//     }


//     const updateSubmissionData = async (submissions: Submissions, drillIndex: number) => {
//         const submissionURI = submissions[drillIndex] || null;
//         submissionPlayer.replaceAsync(submissionURI);
//         submissionPlayer.play();
        
//         const submitted = Object.keys(submissions).map(drillIndex => parseInt(drillIndex));
//         setSubmittedDrills(submitted);
//     }


//     const safelySetDrillIndex = (drillIndex: number) => {
//         if (!session)
//             return;
//         const safeDrillIndex = Math.max(0, Math.min(drillIndex || 0, session.drills.length - 1)); 
//         const safeDrill = session.drills[safeDrillIndex];
//         setDrillIndex(safeDrillIndex);
//     }

    
//     const nextDrill = () => {
//         safelySetDrillIndex(drillIndex + 1);
//     }


//     const prevDrill = () => {
//         safelySetDrillIndex(drillIndex - 1);
//     }


//     // As there's no real data, I'm using local videos. 
//     // I use an alias in the filepaths for convenience. 
//     // However, you need to resolve this before using it
//     // in useVideoPlayer.
//     const resolveURL = async (url: string) => {
//         if (!!url && url.charAt(0) === "@") {
//             const resolvedURL = await Asset.loadAsync((localVideos as any)[url]);
//             return resolvedURL[0].localUri;
//         }
//         return url;
//     }


//     const uploadVideoFromCamera = async (drillIndex: number) => {
//         if (!cameraPermission?.granted) {
//             const ask = await requestCameraPermission();
//             if (!ask.granted) {
//                 alert("No Camera Permission");
//                 return;
//             }
//         }

//         const video = await launchCameraAsync({mediaTypes: ["videos"]});
//         if (!video.canceled) {
//             const uri = video.assets[0].uri;
//             storeVideoInSubmissions(drillIndex, uri);
//         }
//     }


//     const uploadVideoFromLibrary = async (drillIndex: number) => {        
//         if (!mediaLibraryPermission?.granted) {
//             const ask = await requestMediaLibraryPermission();
//             if (!ask.granted) {
//                 alert("No Media Library Permission");
//                 return;
//             }
//         }

//         const video = await launchImageLibraryAsync({mediaTypes: ["videos"]});
//         if (!video.canceled) {
//             const uri = video.assets[0].uri;
//             storeVideoInSubmissions(drillIndex, uri);
//         }
//     }


//     const storeVideoInSubmissions = async (drillIndex: number, uri: string) => {
//         setSubmissions({
//             ...submissions,
//             [drillIndex]: {
//                 uri,
//                 analysis: null
//             }
//         });
//     }
    

//     const analyzeVideoSubmission = async (submissions: Submissions, drills: Array<Drill>, drillIndex: number) => {
//         const drillID = drills[drillIndex].id;
//         const drillURI = submissions[drillIndex].uri;
        
//         const analysis = await getAnalysis(drillID, drillURI);
//         setSubmissions({
//             ...submissions,
//             [drillIndex]: {
//                 uri: submissions[drillIndex].uri,
//                 analysis: analysis
//             }
//         });   
//     }


//     const submitSession = async (session: Session, submissions: Submissions) => {
//         // This information would be provided elsewhere.
//         // But, as this is an example, I'll define fake
//         // values here.
//         const sessionID = 0;
//         const studentID = 2;
//         //const drills = Object.fromEntries(Object.entries(submissions).map(([k, v]) => [k, v.uri]));
//         const assignmentID = sessionID;
//         setSendingSubmission(true);
//         try {
//             const submission = await createSubmission({
//                 studentID,
//                 assignmentID,
//                 imageBackgroundColor: "#FFFFFF",
//                 imageText: "",
//                 imageTextColor: "#000000"
//             });
//             const submissionID = submission.id;
//             await Promise.all(Object.entries(submissions).map(async ([drillIndexStr, {uri, analysis}]) => {
//                 const drillIndex = parseInt(drillIndexStr);
//                 const drill = session.drills[drillIndex];
//                 await uploadAndSubmitDrill({
//                     videoUri: uri,
//                     submissionID,
//                     drillID: drill.id,
//                     touchCount: analysis?.numTouches || undefined
//                 });
//             }));

//             setSendingSubmission(false);
//             setSentSubmission(false);
//             setTimeout(() => {
//                 setSentSubmission(true);
//             }, 500);
//         } catch (error) {
//             setSendingSubmission(false);
//             alert("Error in Drill Submission!");
//             console.error("Error submitting session:", error);
//         }
//         // Error (Missing Video)
//         // if (Object.keys(drills).length !== session.drills.length) {
//         //     alert("Must Submit All Drills!");
//         //     return;
//         // }

//         // const submitted = await submitSessionForGrading(
//         //    sessionID,
//         //    studentID,
//         //    drills
//         //);

//         //if (!submitted) {
//         //    alert("Error in Drill Submission!");
//         //    return false;
//         //}

//         //setSendingSubmission(true);
//         //setTimeout(() => {
//          //   setSendingSubmission(false);
//         //    setSentSubmission(false);
//         //    setTimeout(() => {
//         //        setSentSubmission(true);
//         //    }, 500);
//         //}, 2000);
//     }


//     return (
//         <View
//             style={{
//                 flex: 1,
//                 backgroundColor: colors.palettes.neutral[0],
//                 position: "relative"
//             }}
//         >
//             {(session && drill) &&
//                 <>
//                     <StatusBar
//                         style="light"
//                     />
//                     {/* @ts-ignore - expo-blur BlurView has type incompatibility with React Native */}
//                     <BlurView
//                         intensity={50}
//                         style={{
//                             position: 'absolute',
//                             top: 0,
//                             left: 0,
//                             right: 0,
//                             minHeight: insets.top,
//                             paddingTop: insets.top,
//                             zIndex: 100,
//                             paddingVertical: padding.xl,
//                             paddingHorizontal: padding.md,
//                             display: "flex",
//                             flexDirection: "row",
//                             alignItems: "center",
//                             columnGap: 12,
//                             backgroundColor: "#ffffff75"
//                         }}
//                     >
//                         <ButtonBack
//                             onBack={() => router.back()}
//                         />
//                     </BlurView>
//                     <ScrollView
//                         style={{
//                             flex: 1,
//                         }}
//                         // contentContainerStyle={{ paddingBottom: 10000 }}
//                     >
//                         <VideoView 
//                             player={drillPlayer}
//                             style={{ 
//                                 // width: Dimensions.get("screen").width * 1, 
//                                 height: Dimensions.get("screen").height * 0.5,
//                                 // position: "absolute",
//                                 // top: 0,
//                                 // left: 0,
//                                 backgroundColor: colors.palettes.neutral[0]
//                             }}
//                             contentFit="cover"
//                         />
//                         <View
//                             style={{
//                                 width: "100%", 
//                                 // height: Dimensions.get("screen").height * 0.5,
//                                 // maxHeight: Dimensions.get("screen").height * 0.5,
//                                 // position: "absolute",
//                                 // top: Dimensions.get("screen").height * 0.5 + 0,
//                                 // left: 0,
//                                 flex: 1,
//                                 backgroundColor: colors.schemes.light.surface,
//                                 ...shadow.lg
//                             }}
//                         >
//                             <ProgressBar
//                                 drills={session.drills}
//                                 drillIndex={drillIndex}
//                                 submittedDrills={submittedDrills}
//                                 setDrillIndex={safelySetDrillIndex}
//                             />
//                             <View
//                                 style={{
//                                     paddingTop: margin.sm,
//                                     borderBottomWidth: 1,
//                                     borderColor: colors.schemes.light.outlineVariant,
//                                     borderStyle: "solid",
//                                     backgroundColor: colors.schemes.light.background
//                                 }}
//                             >
//                                 <View>
//                                     <ThemedText
//                                         style={{
//                                             paddingHorizontal: 12,
//                                             paddingBottom: padding.xs,
//                                             fontSize: 12,
//                                             fontWeight: 600,
//                                             letterSpacing: letterSpacing.xl,
//                                             color: colors.schemes.light.onSurfaceVariant
//                                         }}
//                                     >
//                                         {(session?.name || "").toUpperCase()}
//                                     </ThemedText>
//                                     <ThemedText
//                                         style={{
//                                             paddingHorizontal: 12,
//                                             paddingBottom: padding.sm,
//                                             fontSize: 20,
//                                             fontWeight: 600,
//                                             letterSpacing: letterSpacing.sm,
//                                             marginBottom: 2
//                                         }}
//                                     >
//                                         {drill.name}
//                                     </ThemedText>
//                                     <ThemedText
//                                         style={{
//                                             paddingHorizontal: 12,
//                                             marginBottom: margin.sm,
//                                             fontSize: fontSize.base,
//                                             letterSpacing: letterSpacing.xl,
//                                             color: colors.schemes.light.onSurfaceVariant
//                                         }}
//                                     >
//                                         {drill.instructions}
//                                     </ThemedText>
//                                 </View>
//                                 <View
//                                     style={{
//                                         display: "flex",
//                                         flexDirection: "row",
//                                         borderTopWidth: 1,
//                                         borderStyle: "dashed",
//                                         borderColor: colors.schemes.light.outlineVariant,
//                                     }}
//                                 >
//                                     {[drill.type, `${drill.time} min`, drill.level].map((tag, i) => (
//                                         <View
//                                             key={i}
//                                             style={{
//                                                 flex: 1,
//                                                 justifyContent: "center",
//                                                 paddingVertical: padding.md,
//                                                 paddingHorizontal: padding.lg,
//                                                 borderLeftWidth: i === 0 ? 0 : 1,
//                                                 borderColor: colors.schemes.light.outlineVariant,
//                                                 backgroundColor: colors.schemes.light.surface,
//                                             }}
//                                         >
//                                             <ThemedText
//                                                 style={{
//                                                     fontSize: 12,
//                                                     fontWeight: 600,
//                                                     letterSpacing: 0.25,
//                                                     textAlign: "center",
//                                                     color: colors.schemes.light.onSurfaceVariant
//                                                 }}
//                                             >
//                                                 {tag.toUpperCase()}
//                                             </ThemedText>
//                                         </View>
//                                     ))}
//                                 </View>
//                             </View>
//                             <View
//                                 style={{
//                                     paddingVertical: 12,
//                                     paddingTop: 20,
//                                     paddingHorizontal: 0,
//                                 }}
//                             >
//                                 <ThemedText
//                                     style={{
//                                         paddingHorizontal: 12,
//                                         fontSize: 18,
//                                         fontWeight: 600,
//                                         letterSpacing: -0.25,
//                                         marginBottom: 2,
//                                         textAlign: "center"
//                                     }}
//                                 >
//                                     Your Submission
//                                 </ThemedText>
//                                 <View
//                                     style={{
//                                         flexDirection: "row",
//                                         justifyContent: "center",
//                                         marginBottom: 20,
//                                         paddingHorizontal: 12,
//                                     }}
//                                 >
//                                     <ThemedText
//                                         style={{
//                                             fontSize: 14,
//                                             letterSpacing: 0.25,
//                                             color: colors.schemes.light.onSurfaceVariant,
//                                             textAlign: "center",
//                                             maxWidth: 300,
//                                         }}
//                                     >
//                                         Upload a video of yourself performing the drill.
//                                     </ThemedText>
//                                 </View>
//                                 <View
//                                     style={{
//                                         paddingHorizontal: 12,
//                                         flexDirection: "row",
//                                         columnGap: padding.lg,
//                                         marginBottom: 12,
//                                     }}
//                                 >
//                                     <ButtonHalfWidth
//                                         buttonHeight={60}
//                                         {...buttonTheme.black}
//                                         onPress={() => uploadVideoFromCamera(drillIndex)}
//                                     >
//                                         <Camera
//                                             color="white"
//                                             size={18}
//                                         />
//                                         <ThemedText
//                                             style={{
//                                                 fontSize: 14,
//                                                 fontWeight: 500,
//                                                 letterSpacing: letterSpacing.lg,
//                                                 color: "white",
//                                                 textAlign: "center"
//                                             }}
//                                         >
//                                             Record Video
//                                         </ThemedText>
//                                     </ButtonHalfWidth>
//                                     <ButtonHalfWidth
//                                         {...buttonTheme.black}
//                                         buttonHeight={60}
//                                         onPress={() => uploadVideoFromLibrary(drillIndex)}
//                                     >
//                                         <FolderOpen
//                                             color="white"
//                                             size={18}
//                                         />
//                                         <ThemedText
//                                             style={{
//                                                 fontSize: 14,
//                                                 fontWeight: 500,
//                                                 letterSpacing: letterSpacing.lg,
//                                                 color: "white",
//                                                 textAlign: "center"
//                                             }}
//                                         >
//                                             Upload Video
//                                         </ThemedText>
//                                     </ButtonHalfWidth>
//                                 </View>
//                                 {!submissions[drillIndex]?.uri &&
//                                     <Pressable
//                                         onPress={() => uploadVideoFromLibrary(drillIndex)}
//                                         style={{ 
//                                             width: "auto", 
//                                             height: 180,
//                                             marginBottom: 12,
//                                             marginHorizontal: 12,
//                                             display: "flex",
//                                             justifyContent: "center",
//                                             alignItems: "center",
//                                             borderWidth: 1,
//                                             borderColor: colors.schemes.light.outlineVariant,
//                                             borderStyle: "dashed",
//                                             borderRadius: 12,
//                                             backgroundColor: colors.schemes.light.surfaceContainerHigh
//                                         }}
//                                     >
//                                         <ThemedText
//                                             style={{
//                                                 fontSize: 32,
//                                                 marginBottom: 8
//                                             }}
//                                         >
//                                             🎥
//                                         </ThemedText>
//                                         <ThemedText
//                                             style={{
//                                                 fontSize: 12,
//                                                 fontWeight: 500,
//                                                 marginBottom: 2,
//                                                 letterSpacing: 0.1,
//                                                 textAlign: "center",
//                                                 color: colors.schemes.light.onSurfaceVariant
//                                             }}
//                                         >
//                                             MP4, MOV
//                                         </ThemedText>
//                                         <ThemedText
//                                             style={{
//                                                 fontSize: 12,
//                                                 fontWeight: 500,
//                                                 letterSpacing: 0.1,
//                                                 textAlign: "center",
//                                                 color: colors.schemes.light.onSurfaceVariant,
//                                                 opacity: 0.5
//                                             }}
//                                         >
//                                             Max 500MB
//                                         </ThemedText>
//                                     </Pressable>
//                                 }
//                                 {!!submissions[drillIndex]?.uri &&
//                                     <VideoView 
//                                         player={submissionPlayer}
//                                         style={{ 
//                                             width: "auto", 
//                                             height: 180,
//                                             marginBottom: 12,
//                                             marginHorizontal: 12,
//                                             borderRadius: 12,
//                                             backgroundColor: colors.palettes.neutral[0]
//                                         }}
//                                         contentFit="cover"
//                                     />
//                                 }
//                                 <View
//                                     style={{
//                                         marginHorizontal: 12,
//                                         marginBottom: 12
//                                     }}
//                                 >
//                                     <Button
//                                         {...((!!submissions[drillIndex]?.uri) ? buttonTheme.black : buttonTheme.disabled)}
//                                         onPress={() => {
//                                             if (!submissions[drillIndex]?.uri)
//                                                 return;
//                                             analyzeVideoSubmission(submissions, session.drills, drillIndex);
//                                         }}
//                                         outerStyle={{
//                                             alignSelf: undefined,
//                                             borderBottomLeftRadius: !submissions[drillIndex]?.analysis ? 10 : 0,
//                                             borderBottomRightRadius: !submissions[drillIndex]?.analysis ? 10 : 0
//                                         }}
//                                         innerStyle={{
//                                             flex: 1,
//                                             columnGap: 6
//                                         }}
//                                     >
//                                         <Sparkle
//                                             color={"white"}
//                                             size={18}
//                                             opacity={(!!submissions[drillIndex]?.uri) ? 1: 0.75}
//                                         />
//                                         <ThemedText
//                                             style={{
//                                                 fontSize: 14,
//                                                 fontWeight: 500,
//                                                 letterSpacing: letterSpacing.lg,
//                                                 color: "white",
//                                                 textAlign: "center",
//                                                 opacity: (!!submissions[drillIndex]?.uri) ? 1: 0.75
//                                             }}
//                                         >
//                                             Analyze Video
//                                         </ThemedText>
//                                     </Button>
//                                     {submissions[drillIndex]?.analysis &&
//                                         <View
//                                             style={{
//                                                 borderWidth: 1,
//                                                 borderColor: colors.schemes.light.outlineVariant,
//                                                 borderBottomLeftRadius: 10,
//                                                 borderBottomRightRadius: 10,
//                                                 ...shadow.sm
//                                             }}
//                                         >
//                                             <View
//                                                 style={{
//                                                     flexDirection: "row",
//                                                     justifyContent: "center",
//                                                     alignItems: "center",
//                                                     columnGap: 6,
//                                                     paddingHorizontal: 12,
//                                                     paddingVertical: 12,
//                                                     borderBottomWidth: 1,
//                                                     borderColor: colors.schemes.light.outlineVariant,
//                                                     borderStyle: "dashed",
//                                                     backgroundColor: colors.schemes.light.surfaceContainerHigh
//                                                 }}
//                                             >
//                                                 <NotepadText
//                                                     size={18}
//                                                 />
//                                                 <ThemedText
//                                                     style={{
//                                                         fontSize: 14,
//                                                         fontWeight: 500,
//                                                         letterSpacing: letterSpacing.lg,
//                                                         textAlign: "center"
//                                                     }}
//                                                 >
//                                                     Video Analysis Results
//                                                 </ThemedText>
//                                             </View>
//                                             <View
//                                                 style={{
//                                                     padding: 12,
//                                                     paddingVertical: 16,
//                                                     rowGap: 12,
//                                                     backgroundColor: colors.schemes.light.surfaceBright,
//                                                     borderBottomRightRadius: 10,
//                                                     borderBottomLeftRadius: 10,
//                                                 }}
//                                             >
//                                                 <View>
//                                                     <ThemedText
//                                                         style={{
//                                                             marginBottom: 2,
//                                                             fontSize: 14,
//                                                             fontWeight: 600,
//                                                             letterSpacing: 0.25,
//                                                         }}
//                                                     >
//                                                         1. Statistics
//                                                     </ThemedText>
//                                                     <View
//                                                         style={{
//                                                             flexDirection: "row",
//                                                             columnGap: 4,
//                                                             marginLeft: 12,
//                                                             paddingLeft: 12,
//                                                             borderLeftWidth: 1,
//                                                             borderColor: colors.schemes.light.outlineVariant
//                                                         }}
//                                                     >
//                                                         <ThemedText
//                                                             style={{
//                                                                 fontSize: 14,
//                                                                 fontWeight: 500,
//                                                                 letterSpacing: 0.25,
//                                                                 color: colors.schemes.light.onSurface
//                                                             }}
//                                                         >
//                                                             1.1 Number Touches
//                                                         </ThemedText>
//                                                         <ThemedText
//                                                             style={{
//                                                                 fontSize: 14,
//                                                                 fontWeight: 400,
//                                                                 letterSpacing: 0.25,
//                                                                 color: colors.schemes.light.onSurfaceVariant
//                                                             }}
//                                                         >
//                                                             {submissions[drillIndex]?.analysis.numTouches}
//                                                         </ThemedText>
//                                                     </View>
//                                                 </View>
//                                                 <View>
//                                                     <ThemedText
//                                                         style={{
//                                                             marginBottom: 4,
//                                                             fontSize: 14,
//                                                             fontWeight: 600,
//                                                             letterSpacing: 0.25,
//                                                         }}
//                                                     >
//                                                         2. Mistakes
//                                                     </ThemedText>
//                                                     <View
//                                                         style={{
//                                                             rowGap: 4,
//                                                             marginLeft: 12,
//                                                             paddingLeft: 12,
//                                                             borderLeftWidth: 1,
//                                                             borderColor: colors.schemes.light.outlineVariant
//                                                         }}
//                                                     >
//                                                         {submissions[drillIndex]?.analysis.mistakes.map((mistake, i) => (
//                                                             <View
//                                                                 key={i}
//                                                                 style={{
//                                                                     flexDirection: "row",
//                                                                     columnGap: 4
//                                                                 }}
//                                                             >
//                                                                 <ThemedText
//                                                                     style={{
//                                                                         fontSize: 14,
//                                                                         fontWeight: 400,
//                                                                         letterSpacing: 0.25,
//                                                                         color: colors.schemes.light.onSurfaceVariant
//                                                                     }}
//                                                                 >
//                                                                     <ThemedText
//                                                                         style={{
//                                                                             fontWeight: 500,
//                                                                             color: colors.schemes.light.onSurface
//                                                                         }}
//                                                                     >
//                                                                         2.{i+1}. {mistake.mistakeType}{' '}
//                                                                     </ThemedText>
//                                                                     {mistake.mistakeDesc}
//                                                                 </ThemedText>
//                                                             </View>
//                                                         ))}
//                                                     </View>
//                                                 </View>
//                                             </View>
//                                         </View>
//                                     }
//                                 </View>
//                                 <View
//                                     style={{
//                                         display: "flex",
//                                         flexDirection: "row",
//                                         marginHorizontal: 12,
//                                         marginBottom: 36,
//                                         columnGap: 12
//                                     }}
//                                 >
//                                     <ButtonHalfWidth
//                                         {...((drillIndex !== 0) ? buttonTheme.black : buttonTheme.disabled)}
//                                         onPress={prevDrill}
//                                     >
//                                         <MoveLeft
//                                             color={"white"}
//                                             size={18}
//                                             opacity={drillIndex !== 0 ? 1: 0.75}
//                                         />
//                                         <ThemedText
//                                             style={{
//                                                 fontSize: 14,
//                                                 fontWeight: 500,
//                                                 letterSpacing: letterSpacing.lg,
//                                                 color: "white",
//                                                 textAlign: "center",
//                                                 opacity: drillIndex !== 0 ? 1: 0.75
//                                             }}
//                                         >
//                                             Back
//                                         </ThemedText>
//                                     </ButtonHalfWidth>
//                                     {(session && session.drills && (drillIndex || 0) !== session.drills.length - 1) &&
//                                         <ButtonHalfWidth
//                                             {...buttonTheme.black}
//                                             onPress={nextDrill}
//                                         >
//                                             <ThemedText
//                                                 style={{
//                                                     fontSize: 14,
//                                                     fontWeight: 500,
//                                                     letterSpacing: letterSpacing.lg,
//                                                     color: "white",
//                                                     textAlign: "center",
//                                                 }}
//                                             >
//                                                 Next
//                                             </ThemedText>
//                                             <MoveRight
//                                                 color={"white"}
//                                                 size={18}
//                                             />
//                                         </ButtonHalfWidth>
//                                     }
//                                     {(session && session.drills && (drillIndex || 0) === session.drills.length - 1) &&
//                                         <ButtonHalfWidth
//                                             {...buttonTheme.blue}
//                                             onPress={() => submitSession(session, submissions)}
//                                         >
//                                             {sendingSubmission === true &&
//                                                 <ActivityIndicator
//                                                     color="white"
//                                                     size={18}
//                                                 />
//                                             }
//                                             {sentSubmission === false &&
//                                                 <Check
//                                                     color="white"
//                                                     size={18}
//                                                 />
//                                             }
//                                             <ThemedText
//                                                 style={{
//                                                     fontSize: 14,
//                                                     fontWeight: 500,
//                                                     letterSpacing: letterSpacing.lg,
//                                                     color: "white",
//                                                     textAlign: "center"
//                                                 }}
//                                             >
//                                                 Complete Session
//                                             </ThemedText>
//                                         </ButtonHalfWidth>
//                                     }
//                                 </View>
//                             </View>
//                         </View>
//                     </ScrollView>
//                 </>
//             }
//         </View>
//     )
// }