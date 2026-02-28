import { colors, shadow } from "@/theme";
import { View } from "react-native";
import ThemedText from "../ThemedText";

export default function CardResult(props: {
    name: string;
    date: string;
    type: string;
    score: number;
    imageBackgroundColor: string;
    imageColor: string;
}) {
    return (
        <View
            style={{    
                paddingVertical: 8,
                paddingHorizontal: 8,
                display: "flex",
                flexDirection: "row",
                columnGap: 8,
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
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    backgroundColor: props["imageBackgroundColor"],
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <ThemedText
                    style={{
                        fontSize: 24,
                        fontWeight: 500,
                        color: props["imageColor"]
                    }}
                >
                    {props["score"]}
                </ThemedText>
            </View>
            <View
                style={{
                    flex: 1,
                    rowGap: 2
                }}
            >
                <ThemedText
                    style={{
                        fontSize: 14,
                        fontWeight: 500,
                        letterSpacing: -0.1,
                        color: colors.schemes.light.onSurface
                    }}
                >
                    {props["name"]}
                </ThemedText>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        columnGap: 8
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: 12,
                            letterSpacing: 0.1,
                            color: colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        {props["date"]}
                    </ThemedText>
                    <View
                        style={{
                            backgroundColor: "gray",
                            width: 3,
                            height: 3,
                            borderRadius: 1000
                        }}
                    />
                    <ThemedText
                        style={{
                            fontSize: 12,
                            letterSpacing: 0.1,
                            color: colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        {props["type"]}
                    </ThemedText>
                </View>
            </View>
        </View>
    )
}