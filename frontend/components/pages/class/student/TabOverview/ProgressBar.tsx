import ThemedText from "@/components/ui/ThemedText";
import { borderRadius, colors, fontSize, padding, shadow } from "@/theme";
import { View } from "react-native";

interface ProgressBarProps {
    label: string;
    current: number;
    total: number;
}

export default function ProgressBar({ label, current, total }: ProgressBarProps) {
    const pct = total > 0 ? Math.round((current / total) * 100) : 0;
    const barColor = pct >= 75 ? colors.coreColors.tertiary : colors.coreColors.primary;

    return (
        <View
            style={{
                backgroundColor: colors.schemes.light.surfaceContainerLowest,
                borderRadius: borderRadius.lg,
                borderWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                padding: padding.xl,
                ...shadow.sm,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: padding.md,
                }}
            >
                <ThemedText
                    style={{
                        fontSize: fontSize.md,
                        fontWeight: "600",
                        color: colors.schemes.light.onSurface,
                    }}
                >
                    {label}
                </ThemedText>
                <ThemedText
                    style={{
                        fontSize: fontSize.md,
                        fontWeight: "800",
                        color: barColor,
                    }}
                >
                    {pct}%
                </ThemedText>
            </View>
            <View
                style={{
                    width: "100%",
                    height: 8,
                    backgroundColor: colors.schemes.light.outlineVariant,
                    borderRadius: 4,
                    overflow: "hidden",
                }}
            >
                <View
                    style={{
                        width: `${pct}%`,
                        height: "100%",
                        backgroundColor: barColor,
                        borderRadius: 4,
                    }}
                />
            </View>
            <ThemedText
                style={{
                    fontSize: fontSize.xs,
                    color: colors.schemes.light.onSurfaceVariant,
                    marginTop: padding.md,
                }}
            >
                Session #{current} of {total} · {total - current} remaining
            </ThemedText>
        </View>
    );
}
