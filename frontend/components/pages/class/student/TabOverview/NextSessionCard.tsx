import SimpleButton from "@/components/ui/button/SimpleButton";
import ThemedText from "@/components/ui/ThemedText";
import { borderRadius, colors, fontSize, letterSpacing, padding, shadow } from "@/theme";
import { View } from "react-native";

interface Drill {
    name: string;
    duration: string;
}

interface NextSessionCardProps {
    sessionName: string;
    dueLabel: string;
    drills: Drill[];
    onStart?: () => void;
}

export default function NextSessionCard({
    sessionName,
    dueLabel,
    drills,
    onStart,
}: NextSessionCardProps) {
    return (
        <View
            style={{
                backgroundColor: colors.schemes.light.surfaceContainerLowest,
                borderRadius: borderRadius.lg,
                borderWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                padding: padding.xl,
                gap: padding.xl,
                ...shadow.sm,
            }}
        >
            {/* Top row */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <ThemedText
                    style={{
                        fontSize: fontSize.base,
                        fontWeight: "500",
                        letterSpacing: letterSpacing.lg,
                        color: colors.schemes.light.onSurface,
                    }}
                >
                    {sessionName}
                </ThemedText>
                <View
                    style={{
                        backgroundColor: "#FFF8E1",
                        paddingVertical: padding.sm,
                        paddingHorizontal: padding.lg,
                        borderRadius: borderRadius.sm,
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: fontSize.sm,
                            fontWeight: "500",
                            color: "#FF9800",
                        }}
                    >
                        {dueLabel}
                    </ThemedText>
                </View>
            </View>

            {/* Drill list */}
            <View style={{ gap: padding.xl }}>
                {drills.map((drill, i) => (
                    <View
                        key={i}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: padding.md,
                        }}
                    >
                        <View
                            style={{
                                width: 22,
                                height: 22,
                                borderRadius: 11,
                                backgroundColor: colors.schemes.light.surfaceContainerHigh,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: fontSize.sm,
                                    fontWeight: "700",
                                    color: colors.schemes.light.onSurfaceVariant,
                                }}
                            >
                                {i + 1}
                            </ThemedText>
                        </View>
                        <ThemedText
                            style={{
                                fontSize: fontSize.md,
                                letterSpacing: letterSpacing.lg,
                                color: colors.schemes.light.onSurfaceVariant,
                            }}
                        >
                            {drill.name} {drill.duration && `· ${drill.duration}`}
                        </ThemedText>
                    </View>
                ))}
            </View>

            <SimpleButton label="Start Session" onPress={onStart} />
        </View>
    );
}
