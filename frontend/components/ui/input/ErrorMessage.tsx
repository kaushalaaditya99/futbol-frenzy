import { colors } from "@/theme";
import { CircleX } from "lucide-react-native";
import { View } from "react-native";
import ThemedText from "../ThemedText";

interface ErrorMessageProps {
    message: string;
}

export default function ErrorMessage(props: ErrorMessageProps) {
    return (
        <View
            style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                flexDirection: "row",
                alignItems: "flex-start",
                columnGap: 6,
                borderWidth: 1,
                borderColor: colors.schemes.light.error,
                borderStyle: "dashed",
                borderRadius: 8,
                backgroundColor: colors.schemes.light.errorContainer
            }}
        >
            <CircleX
                size={14}
                color={colors.schemes.light.onErrorContainer}
                style={{
                    position: "relative",
                    top: 1.5
                }}
            />
            <View
                style={{
                    flexShrink: 1,
                }}
            >
                <ThemedText
                    style={{
                        flexShrink: 1,
                        fontSize: 12,
                        fontWeight: 400,
                        letterSpacing: 0.25,
                        color: colors.schemes.light.onErrorContainer
                    }}
                >
                    A class with this code was not found. Please try again.
                </ThemedText>
            </View>
        </View>
    )
}