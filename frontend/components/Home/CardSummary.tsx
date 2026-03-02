import { borderRadius, colors, fontSize, letterSpacing, padding, shadow } from "@/theme";
import { View } from "react-native";
import { ReactNode } from "react";
import ThemedText from "../ThemedText";

export default function CardSummary(props: {k: string; v1?: ReactNode; v2: string}) {
    return (
        <View
            style={{
                flex: 1,
                paddingVertical: padding.lg,
                paddingHorizontal: padding.lg,
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
                    justifyContent: "center",
                    alignItems: "center",
                    columnGap: padding.sm
                }}
            >
                {props.v1}
                <ThemedText
                    style={{
                        fontWeight: 500,
                        fontSize: fontSize.base,
                        color: colors.coreColors.primary
                    }}
                >
                    {props.v2}
                </ThemedText>
            </View>
            <ThemedText
                style={{
                    fontWeight: 500,
                    letterSpacing: letterSpacing.lg,
                    fontSize: fontSize.sm,
                    textAlign: "center",
                    color: colors.schemes.light.onSurfaceVariant,
                }}
            >
                {props.k}
            </ThemedText>
        </View>
    )
}