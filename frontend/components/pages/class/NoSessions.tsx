import ThemedText from "@/components/ui/ThemedText";
import { borderRadius, colors, fontSize, letterSpacing, padding } from "@/theme";
import { TreePalm } from "lucide-react-native";
import { View } from "react-native";

export default function NoSessions() {
    return (
        <View

            style={{
                width: "100%",
                paddingHorizontal: 24,
                paddingVertical: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                rowGap: padding.xs,
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: colors.schemes.light.outlineVariant,
                borderRadius: borderRadius.base,
                backgroundColor: colors.schemes.light.surfaceContainer
            }}
        >
            <TreePalm
                size={36}
                strokeWidth={1.5}
                color={colors.schemes.light.onSurfaceVariant}
                style={{
                    marginBottom: padding.sm
                }}
            />
            <ThemedText
                style={{
                    fontSize: fontSize.base,
                    fontWeight: 500,
                    letterSpacing: letterSpacing.lg,
                    color: colors.schemes.light.onSurface,
                    textAlign: "center"
                }}
            >
                No Sessions
            </ThemedText>
            <ThemedText
                style={{
                    maxWidth: 200,
                    fontSize: 14,
                    fontWeight: 400,
                    color: colors.schemes.light.onSurfaceVariant,
                    letterSpacing: letterSpacing.xl,
                    textAlign: "center"
                }}
            >
                There are no sessions scheduled for today.
            </ThemedText>
        </View>
    )
}