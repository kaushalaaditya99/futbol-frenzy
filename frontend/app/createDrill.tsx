import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
import { launchCameraAsync, launchImageLibraryAsync, useCameraPermissions, useMediaLibraryPermissions } from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderWithBack from "@/components/ui/HeaderWithBack";
import { router } from "expo-router";
import { padding, theme } from "@/theme";
import { ScrollView, View } from "react-native";
import ThemedText from "@/components/ui/ThemedText";
import InputText from "@/components/ui/input/InputText";
import ErrorMessage, { Errors, Error } from "@/components/ui/input/ErrorMessage";
import InputDropdown from "@/components/ui/input/InputDropdown";
import ButtonHalfWidth from "@/components/ui/button/ButtonHalfWidth";
import { buttonTheme } from "@/components/ui/button/buttonTheme";
import { Camera, FileUp, FolderOpen, Play, Plus, Upload } from "lucide-react-native";
import UploadVideo from "@/components/pages/UploadVideo";
import Button from "@/components/ui/button/Button";
import InputErrorMessage from "@/components/ui/input/InputErrorMessage";
import InputInlineRadioGroup from "@/components/ui/input/InputInlineRadioGroup";

export default function CreateDrill() {
    const levelOptions = [
        ["beginner", "Beginner"],
        ["intermediate", "Intermediate"],
        ["advanced", "Advanced"]
    ];

    const [failed, setFailed] = useState(false);
    const [errors, setErrors] = useState<Errors>();

    const [name, setName] = useState("");
    const [accessControl, setAccessControl] = useState("private");
    const [level, setLevel] = useState("beginner");
    const [instructions, setInstructions] = useState("");
    const [videoURI, setVideoURI] = useState("");

    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [mediaLibraryPermission, requestMediaLibraryPermission] = useMediaLibraryPermissions();
    const demonstration = useVideoPlayer(null, (player) => {
        player.muted = true;
        player.audioMixingMode = "mixWithOthers";
    });


    useEffect(() => {
        if (!errors?.name)
            return;
        const formCheck = checkForm();
        setErrors(errors => (
            {
                ...errors,
                name: formCheck.errors.name
            }
        ));
    }, [name]);


    useEffect(() => {
        if (!errors?.instructions)
            return;
        const formCheck = checkForm();
        setErrors(errors => (
            {
                ...errors,
                instructions: formCheck.errors.instructions
            }
        ));
    }, [instructions]);


    useEffect(() => {
        if (!errors?.demo)
            return;
        const formCheck = checkForm();
        setErrors(errors => (
            {
                ...errors,
                demo: formCheck.errors.demo
            }
        ));
    }, [demonstration.status]);


    useEffect(() => {
        setFailed(false);
    }, [name, instructions, demonstration.status]);


    const uploadVideoFromCamera = async () => {
        if (!cameraPermission?.granted) {
            const ask = await requestCameraPermission();
            if (!ask.granted) {
                alert("No Camera Permission");
                return;
            }
        }

        const video = await launchCameraAsync({mediaTypes: ["videos"]});
        if (!video.canceled) {
            const uri = video.assets[0].uri;
            updateVideo(uri);
        }
    }


    const uploadVideoFromLibrary = async () => {        
        if (!mediaLibraryPermission?.granted) {
            const ask = await requestMediaLibraryPermission();
            if (!ask.granted) {
                alert("No Media Library Permission");
                return;
            }
        }

        const video = await launchImageLibraryAsync({mediaTypes: ["videos"]});
        if (!video.canceled) {
            const uri = video.assets[0].uri;
            updateVideo(uri);
        }
    }


    const updateVideo = async (uri: string) => {
        setVideoURI(uri);
        await demonstration.replaceAsync(uri);
        demonstration.play();
    }


    const onCreateDrill = () => {
        const {errors, canSubmit} = checkForm();
        setErrors(errors);

        if (canSubmit) {
            // Create Drill Here
            router.back();
            return;
        }
        setFailed(true);
    }

    
    const checkForm = (): {errors: Errors; canSubmit: boolean} => {
        let canSubmit = true;
        let nameError: Error = {valid: true, errorMessage: ""};
        
        if (name.length === 0) {
            nameError = {valid: false, errorMessage: "Must enter a name."};
            canSubmit = false;
        }
        else if (name.length > 10) {
            nameError = {valid: false, errorMessage: "Must enter a name less than 10 characters."};
            canSubmit = false;
        }

        let instructionError: Error = {valid: true, errorMessage: ""};
        if (instructions.length === 0) {
            instructionError = {valid: false, errorMessage: "Must enter instructions."};
            canSubmit = false;
        }

        let demoError: Error = {valid: true, errorMessage: ""};
        if (!videoURI) {
            demoError = {valid: false, errorMessage: "Must upload demonstration."};
            canSubmit = false;
        }

        return {
            errors: {
                "name": nameError,
                "instructions": instructionError,
                "demo": demoError
            },
            canSubmit
        };
    }


    return (
        <SafeAreaView
            edges={["top"]}
            style={{
                flex: 1,
                backgroundColor: theme.colors.schemes.light.surface,
            }}
        >
            <HeaderWithBack
                header="Create Drill"
                onBack={() => router.back()}
                containerStyle={{
                    paddingVertical: theme.margin.xs,
                    paddingHorizontal: theme.margin.sm,
                }}
                buttonStyle={{
                    backgroundColor: "#00000010"
                }}
            />
            <ScrollView
                style={{
                    backgroundColor: theme.colors.schemes.light.background
                }}
            >
                <View
                    style={{
                        paddingTop: theme.margin.sm - 8,
                        paddingVertical: theme.margin.sm,
                        paddingHorizontal: theme.margin.sm,
                        rowGap: theme.padding.lg,
                        backgroundColor: theme.colors.schemes.light.background,
                        borderBottomWidth: 1,
                        borderColor: theme.colors.schemes.light.outlineVariant
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: theme.fontSize.lg,
                            fontWeight: 500,
                            letterSpacing: theme.letterSpacing.sm,
                            color: theme.colors.schemes.light.onSurface,
                        }}
                    >
                        General Information
                    </ThemedText>
                    <InputText
                        label="Name"
                        value={name}
                        errorMessage={errors?.name?.errorMessage}
                        onChangeText={setName}
                    />
                    <InputText
                        label="Instructions"
                        value={instructions}
                        errorMessage={errors?.instructions?.errorMessage}
                        onChangeText={setInstructions}
                        multiline={true}
                        inputStyle={{
                            height: 200,
                            letterSpacing: theme.letterSpacing.xl * 2,
                            lineHeight: 24
                        }}
                    />
                    <InputDropdown
                        label="Level"
                        options={levelOptions as [string, string][]}
                        value={level}
                        onChange={setLevel}
                        errorMessage={errors?.name?.errorMessage}
                        onChangeText={setName}
                    />
                    <InputInlineRadioGroup
                        label="Access Control"
                        value={accessControl}
                        options={[["public", "Public"], ["private", "Private"]]}
                        onChange={setAccessControl}
                    />
                </View>
                <View
                    style={{
                        paddingTop: theme.margin.sm - 8,
                        paddingVertical: theme.margin.sm,
                        paddingHorizontal: theme.margin.sm,
                        rowGap: theme.padding.lg,
                        backgroundColor: theme.colors.schemes.light.background,
                        borderBottomWidth: 1,
                        borderColor: theme.colors.schemes.light.outlineVariant
                    }}
                >
                    <View
                        style={{
                            rowGap: 4
                        }}
                    >
                        <ThemedText
                            style={{
                                fontSize: theme.fontSize.lg,
                                fontWeight: 500,
                                letterSpacing: theme.letterSpacing.sm,
                                color: theme.colors.schemes.light.onSurface,
                            }}
                        >
                            Demonstration
                        </ThemedText>
                        <ThemedText
                            style={{
                                fontSize: 14,
                                letterSpacing: 0.25,
                                color: theme.colors.schemes.light.onSurfaceVariant,
                                textAlign: "center",
                                maxWidth: 300,
                            }}
                        >
                            Upload a video of yourself performing the drill.
                        </ThemedText>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            columnGap: theme.padding.lg,
                        }}
                    >
                        <ButtonHalfWidth
                            {...buttonTheme.white}
                            buttonHeight={48}
                            onPress={() => uploadVideoFromCamera()}
                        >
                            <Camera
                                color={theme.colors.schemes.light.onSurfaceVariant}
                                size={18}
                            />
                            <ThemedText
                                style={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    letterSpacing: theme.letterSpacing.lg,
                                    color: theme.colors.schemes.light.onSurface,
                                    textAlign: "center"
                                }}
                            >
                                Record Video
                            </ThemedText>
                        </ButtonHalfWidth>
                        <ButtonHalfWidth
                            {...buttonTheme.white}
                            buttonHeight={48}
                            onPress={() => uploadVideoFromLibrary()}
                        >
                            <FolderOpen
                                color={theme.colors.schemes.light.onSurfaceVariant}
                                size={18}
                            />
                            <ThemedText
                                style={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    letterSpacing: theme.letterSpacing.lg,
                                    color: theme.colors.schemes.light.onSurface,
                                    textAlign: "center"
                                }}
                            >
                                Upload Video
                            </ThemedText>
                        </ButtonHalfWidth>
                    </View>
                    <View
                        style={{
                            rowGap: padding.sm
                        }}
                    >
                        {!videoURI &&
                            <UploadVideo
                                error={!!errors?.demo?.errorMessage}
                                onPress={uploadVideoFromCamera}
                            />
                        }
                        {videoURI &&
                            <VideoView
                                player={demonstration}
                                style={{ 
                                    width: "auto", 
                                    height: 180,
                                    borderRadius: theme.borderRadius.base,
                                    backgroundColor: theme.colors.palettes.neutral[0]
                                }}
                                contentFit="cover"
                            />
                        }
                        {errors?.demo?.errorMessage &&
                            <InputErrorMessage
                                errorMessage={errors?.demo?.errorMessage}
                            />
                        }
                    </View>
                </View>
                <View
                    style={{
                        paddingVertical: theme.margin.sm,
                        paddingHorizontal: theme.margin.sm,
                        rowGap: theme.padding.md
                    }}
                >
                    <Button
                        onPress={onCreateDrill}
                        {...buttonTheme.blue}
                        innerStyle={{
                            width: "100%"
                        }}
                    >
                        <Plus
                            size={18}
                            strokeWidth={2.5}
                            color="white"
                        />
                        <ThemedText
                            style={{
                                fontSize: 16,
                                fontWeight: 600,
                                letterSpacing: -0.25,
                                color: "white"
                            }}
                        >
                            Create Drill
                        </ThemedText>
                    </Button>
                    {failed &&
                        <ErrorMessage
                            message="Please fix the errors to finish creating your drill."
                        />
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}