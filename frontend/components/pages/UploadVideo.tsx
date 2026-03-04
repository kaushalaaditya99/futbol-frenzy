import { theme } from "@/theme";
import { Pressable, View } from "react-native";
import ThemedText from "../ui/ThemedText";
import { FileVideoCamera } from "lucide-react-native";

interface UploadVideoProps {
    error?: boolean;
    onPress: () => void;
}

export default function UploadVideo(props: UploadVideoProps) {
    return (
        <Pressable
            onPress={props.onPress}
            style={{
                height: 180,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                rowGap: theme.padding.lg,
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: props.error ? theme.colors.schemes.light.error : theme.colors.schemes.light.outlineVariant,
                borderRadius: theme.borderRadius.base,
                backgroundColor: props.error ? theme.colors.schemes.light.errorContainer : theme.colors.schemes.light.surfaceContainerHigh,
                ...theme.shadow.sm
            }}
        >
            <FileVideoCamera
                size={40}
                strokeWidth={1.25}
                color={theme.colors.schemes.light.onSurfaceVariant}
            />
            <View>
                <ThemedText
                    style={{
                        fontSize: 12,
                        fontWeight: 500,
                        marginBottom: 2,
                        letterSpacing: 0.1,
                        textAlign: "center",
                        color: theme.colors.schemes.light.onSurfaceVariant
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
                        color: theme.colors.schemes.light.onSurfaceVariant,
                        opacity: 0.5
                    }}
                >
                    Max 500MB
                </ThemedText>
            </View>
        </Pressable>
    )
}