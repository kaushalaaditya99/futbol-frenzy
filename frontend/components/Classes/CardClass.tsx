import { Class } from "@/services/classes";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import ThemedText from "../ThemedText";
import { colors, shadow } from "@/theme";

interface CardClassProps extends Class {}

export default function CardClass(props: CardClassProps) {
    return (
        <Pressable
            onPress={() => router.push('/class')}
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
                    backgroundColor: colors.palettes.neutral[90],
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <ThemedText
                    style={{
                        fontSize: 24
                    }}
                >
                    {props.imageEmoji}
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
                    {props.name}
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
                        Coach {props.teacherName}
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
                        {props.size} students
                    </ThemedText>
                </View>
            </View>
        </Pressable>
    )
}