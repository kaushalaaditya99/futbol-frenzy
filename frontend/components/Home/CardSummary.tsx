import { colors, shadow } from "@/theme";
import { View } from "react-native";
import { ReactNode } from "react";
import ThemedText from "../ThemedText";

export default function CardSummary(props: {k: string; v1?: ReactNode; v2: string}) {
    return (
        <View
            style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 12,
                backgroundColor: colors.schemes.light.surfaceContainerLowest,
                borderWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                borderStyle: "solid",
                borderRadius: 12,
                ...shadow.md
            }}
        >
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    columnGap: 4
                }}
            >
                {props.v1}
                <ThemedText
                    style={{
                        fontWeight: 500,
                        fontSize: 16,
                        color: colors.coreColors.primary
                    }}
                >
                    {props.v2}
                </ThemedText>
            </View>
            <ThemedText
                style={{
                    fontWeight: 500,
                    letterSpacing: 0.1,
                    fontSize: 12,
                    textAlign: "center",
                    color: colors.schemes.light.onSurfaceVariant,
                }}
            >
                {props.k}
            </ThemedText>
        </View>
    )
}