import ThemedText from "@/components/ui/ThemedText";
import { borderRadius, colors, fontSize, padding, shadow } from "@/theme";
import { View } from "react-native";

interface FeedbackCardProps {
    drillName: string;
    drillEmoji: string;
    sessionLabel: string;
    score: number;
    maxScore: number;
    coachName: string;
    coachInitials: string;
    feedback: string;
}

export default function FeedbackCard({
    drillName,
    drillEmoji,
    sessionLabel,
    score,
    maxScore,
    coachName,
    coachInitials,
    feedback,
}: FeedbackCardProps) {
    const scoreColor = score / maxScore >= 0.7 ? colors.coreColors.tertiary : colors.coreColors.primary;

    return (
        <View
            style={{
                backgroundColor: colors.schemes.light.surfaceContainerLowest,
                borderRadius: borderRadius.lg,
                borderWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                overflow: "hidden",
                ...shadow.sm,
            }}
        >
            {/* Header */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: padding.lg,
                    padding: padding.xl,
                    borderBottomWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant,
                    backgroundColor: colors.schemes.light.surfaceContainerHigh,
                }}
            >
                <View
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: borderRadius.base,
                        backgroundColor: "#2D2D2D",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <ThemedText style={{ fontSize: fontSize.lg }}>{drillEmoji}</ThemedText>
                </View>
                <View style={{ flex: 1 }}>
                    <ThemedText
                        style={{
                            fontSize: fontSize.md,
                            fontWeight: "600",
                            color: colors.schemes.light.onSurface,
                        }}
                    >
                        {drillName}
                    </ThemedText>
                    <ThemedText
                        style={{
                            fontSize: fontSize.xs,
                            color: colors.schemes.light.onSurfaceVariant,
                            marginTop: 1,
                        }}
                    >
                        {sessionLabel}
                    </ThemedText>
                </View>
                <ThemedText
                    style={{
                        fontSize: fontSize.lg,
                        fontWeight: "800",
                        color: scoreColor,
                    }}
                >
                    {score}/{maxScore}
                </ThemedText>
            </View>

            {/* Body */}
            <View style={{ padding: padding.xl }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: padding.md,
                        marginBottom: padding.md,
                    }}
                >
                    <View
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: 14,
                            backgroundColor: colors.coreColors.primary,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <ThemedText
                            style={{
                                fontSize: fontSize.xs,
                                fontWeight: "700",
                                color: "white",
                            }}
                        >
                            {coachInitials}
                        </ThemedText>
                    </View>
                    <ThemedText
                        style={{
                            fontSize: fontSize.sm,
                            fontWeight: "600",
                            color: colors.schemes.light.onSurface,
                        }}
                    >
                        {coachName}
                    </ThemedText>
                    <View
                        style={{
                            backgroundColor: colors.schemes.light.surfaceContainerHigh,
                            paddingVertical: padding.xs,
                            paddingHorizontal: padding.md,
                            borderRadius: borderRadius.sm,
                        }}
                    >
                        <ThemedText
                            style={{
                                fontSize: fontSize.xs,
                                fontWeight: "600",
                                color: colors.schemes.light.onSurfaceVariant,
                            }}
                        >
                            Coach
                        </ThemedText>
                    </View>
                </View>
                <ThemedText
                    style={{
                        fontSize: fontSize.md,
                        color: colors.schemes.light.onSurfaceVariant,
                        lineHeight: 20,
                        paddingLeft: 36,
                    }}
                >
                    {feedback}
                </ThemedText>
            </View>
        </View>
    );
}
