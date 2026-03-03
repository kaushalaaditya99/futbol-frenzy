import { colors, fontSize, letterSpacing, padding } from "@/theme";
import { View } from "react-native";
import ThemedText from "./ThemedText";

export default function Logo() {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                alignSelf: "flex-start",
                padding: padding.sm,
                paddingHorizontal: padding.md,
                borderRadius: 8
            }}
        >
            <ThemedText
                style={{
                    fontSize: fontSize.lg,
                    fontWeight: 500,
                    letterSpacing: letterSpacing.lg,
                    color: colors.schemes.light.onSurface,
                    textAlign: "center"
                }}
            >
                DrillUp
            </ThemedText>
        </View>
    )
}