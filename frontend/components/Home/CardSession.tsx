import { colors, padding, shadow } from "@/theme";
import { router } from "expo-router";
import { View } from "react-native";
import { Pressable } from "react-native";
import ThemedText from "../ThemedText";
import { Session } from "@/services/sessions";

interface SessionProps extends Session {}

export default function CardSession(props: SessionProps) {
    return (
        <Pressable
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
            onPress={() => router.push('/demonstration')}
        >
            <View
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    backgroundColor: props.imageBackgroundColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <ThemedText
                    style={{
                        fontSize: 24
                    }}
                >
                    {props["imageEmoji"]}
                </ThemedText>
            </View>
            <View
                style={{
                    flex: 1,
                    rowGap: 2
                }}
            >
                <View    
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <ThemedText
                        style={{
                            fontWeight: 500,
                            fontSize: 14,
                            letterSpacing: -0.1,
                            color: colors.schemes.light.onSurface
                        }}
                    >
                        {props["name"]}
                    </ThemedText>
                    {(props["isNew"] || props["isDue"]) &&
                        <View
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                paddingVertical: 0,
                                paddingHorizontal: 8,
                                backgroundColor: props["isNew"] ? colors.palettes.primary[90] : colors.palettes.tertiary[95],
                                borderRadius: 100
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: 10,
                                    fontWeight: 600,
                                    color: props["isNew"] ? colors.palettes.primary[50] : colors.palettes.tertiary[50],
                                }}
                            >
                                {props["isNew"] ? "NEW" : props["isDue"] ? "DUE" : ""}
                            </ThemedText>
                        </View>
                    }
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        columnGap: padding.md
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: 12,
                            letterSpacing: 0.1,
                            color: colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        {props["type"]}
                    </ThemedText>
                    <View
                        style={{
                            width: 3,
                            height: 3,
                            borderRadius: 100,
                            backgroundColor: colors.schemes.light.onSurfaceVariant
                        }}
                    />
                    <ThemedText
                        style={{
                            fontSize: 12,
                            letterSpacing: 0.1,
                            color: colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        {props["time"]}
                    </ThemedText>
                    <View
                        style={{
                            width: 3,
                            height: 3,
                            borderRadius: 100,
                            backgroundColor: colors.schemes.light.onSurfaceVariant
                        }}
                    />
                    <ThemedText
                        style={{
                            fontSize: 12,
                            letterSpacing: 0.1,
                            color: colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        {props["class"]}
                    </ThemedText>
                </View>
            </View>
        </Pressable>
    )
}