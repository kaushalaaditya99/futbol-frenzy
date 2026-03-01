import { Text, View } from "react-native";
import ThemedText from "../ThemedText";
import { colors, padding, shadow } from "@/theme";
import { ArrowRightToLine } from "lucide-react-native";

interface JoinClassButton1Props {
    onPress: () => void;
}

export default function JoinClassButton1(props: JoinClassButton1Props) {
    return (
        <View
            style={{
                marginTop: 12,
                paddingHorizontal: 24,
                paddingVertical: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                borderStyle: "dashed",
                borderRadius: 12,
                backgroundColor: colors.schemes.light.surfaceContainer,
                // ...shadow.sm
            }}
        >
            <ThemedText
                style={{
                    fontSize: 36,
                    marginBottom: padding.lg
                }}
            >
                ⚽
            </ThemedText>
            <ThemedText
                style={{
                    marginBottom: padding.sm,
                    fontSize: 16,
                    fontWeight: 500,
                    letterSpacing: -0.25,
                    color: "black"
                }}
            >
                Missing a Class?
            </ThemedText>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 8
                }}
            >
                <ThemedText
                    style={{
                        maxWidth: 200,
                        fontSize: 13,
                        fontWeight: 400,
                        letterSpacing: 0.25,
                        color: colors.schemes.light.onSurfaceVariant,
                        textAlign: "center"
                    }}
                >
                    To join a class, enter its class code or scan its QR code.
                </ThemedText>
            </View>
        </View>
    )
}