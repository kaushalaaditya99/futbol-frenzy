import { borderRadius, colors, fontSize, letterSpacing, padding, shadow, theme } from "@/theme";
import { TextStyle, View } from "react-native";
import { ReactNode } from "react";
import ThemedText from "../ui/ThemedText";

interface CardMetricProps {
    label: string;
    labelStyle?: TextStyle;
    value: string;
    valueIcon?: ReactNode;
    valueIconSide?: "left" | "right";
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
                {props.valueIconSide !== "right" &&
                    <>
                        {props.valueIcon}
                    </>
                }
                <ThemedText
                    style={{
                        fontWeight: 500,
                        fontSize: fontSize.base,
                        color: colors.coreColors.primary,
                        letterSpacing: theme.letterSpacing.lg,
                        ...props.labelStyle
                    }}
                >
                    {props.value}
                </ThemedText>
                {props.valueIconSide === "right" &&
                    <>
                        {props.valueIcon}
                    </>
                }
            </View>
            <ThemedText
                style={{
                    fontSize: fontSize.sm,
                    fontWeight: 500,
                    textAlign: "center",
                    letterSpacing: letterSpacing.xl * 1,
                    color: colors.schemes.light.onSurfaceVariant,
                }}
            >
                {props.label}
            </ThemedText>
        </View>
    )
}