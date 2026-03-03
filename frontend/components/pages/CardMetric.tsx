import { borderRadius, colors, fontSize, letterSpacing, padding, shadow } from "@/theme";
import { View } from "react-native";
import { ReactNode } from "react";
import ThemedText from "../ui/ThemedText";

interface CardMetricProps {
    key: string;
    value: string;
    valueIcon?: ReactNode;
}

export default function CardMetric(props: CardMetricProps) {
    return (
        <View
            style={{
                paddingVertical: padding.lg,
                paddingHorizontal: padding.lg,
                flex: 1,
                borderWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                borderStyle: "solid",
                borderRadius: borderRadius.base,
                backgroundColor: colors.schemes.light.surfaceContainerLowest,
                ...shadow.sm
            }}
        >
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    columnGap: padding.sm
                }}
            >
                {props.valueIcon}
                <ThemedText
                    style={{
                        fontWeight: 500,
                        fontSize: fontSize.base,
                        color: colors.coreColors.primary
                    }}
                >
                    {props.value}
                </ThemedText>
            </View>
            <ThemedText
                style={{
                    fontSize: fontSize.sm,
                    fontWeight: 500,
                    textAlign: "center",
                    letterSpacing: letterSpacing.lg,
                    color: colors.schemes.light.onSurfaceVariant,
                }}
            >
                {props.key}
            </ThemedText>
        </View>
    )
}