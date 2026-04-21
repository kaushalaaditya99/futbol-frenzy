import ThemedText from "@/components/ui/ThemedText";
import { borderRadius, colors, fontSize, padding, shadow } from "@/theme";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";

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
    const [expanded, setExpanded] = useState(false);
    const isLong = feedback.split('\n').length > 2 || feedback.length > 120;

    return (
        <View
            style={{
                backgroundColor: colors.schemes.light.surfaceContainerLowest,
                borderRadius: borderRadius.lg,
                borderWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                // overflow: "hidden", // Shadow doesn't show up if overflow is hidden
                ...shadow.sm,
            }}
        >
            {/* Header */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: padding.lg,
                    padding: padding.md,
                    borderBottomWidth: 1,
                    borderTopLeftRadius: borderRadius.lg,
                    borderTopRightRadius: borderRadius.lg,
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
                    <ThemedText style={{ fontSize: fontSize.xl }}>{drillEmoji}</ThemedText>
                </View>
                <View style={{ flex: 1 }}>
                    <ThemedText
                        style={{
                            fontSize: fontSize.base,
                            fontWeight: "600",
                            color: colors.schemes.light.onSurface,
                        }}
                    >
                        {drillName}
                    </ThemedText>
                    <ThemedText
                        style={{
                            fontSize: fontSize.md,
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
                        fontWeight: "600",
                        color: scoreColor,
                    }}
                >
                    {score}/{maxScore}
                </ThemedText>
            </View>

            {/* Body */}
            <View style={{ padding: padding.md, paddingVertical: padding.xl, }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: padding.md,
                        // marginBottom: padding.md,
                        // backgroundColor: 'red'
                    }}
                >
                    <View
                        style={{
                            width: 40,
                            // height: 40,
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            // backgroundColor: 'yellow'
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
                                    fontSize: fontSize.md,
                                    fontWeight: "600",
                                    color: "white",
                                }}
                            >
                                {coachInitials}
                            </ThemedText>
                        </View>
                    </View>
                    <ThemedText
                        style={{
                            fontSize: fontSize.base,
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
                            COACH
                        </ThemedText>
                    </View>
                </View>
                <ThemedText
                    style={{
                        fontSize: fontSize.base,
                        color: colors.schemes.light.onSurfaceVariant,
                        lineHeight: 20,
                        paddingLeft: 40 + padding.md,
                    }}
                    numberLines={!expanded && isLong ? 2 : undefined}
                >
                    {feedback}
                </ThemedText>
                {isLong && (
                    <Pressable
                        onPress={() => setExpanded(!expanded)}
                        style={{
                            paddingLeft: 40 + padding.md,
                            paddingTop: padding.sm,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                        }}
                    >
                        <ThemedText
                            style={{
                                fontSize: fontSize.md,
                                fontWeight: "500",
                                color: colors.coreColors.primary,
                            }}
                        >
                            {expanded ? "Show less" : "Show more"}
                        </ThemedText>
                        {expanded
                            ? <ChevronUp size={14} color={colors.coreColors.primary} />
                            : <ChevronDown size={14} color={colors.coreColors.primary} />
                        }
                    </Pressable>
                )}
            </View>
        </View>
    );
}
