import { Pressable, View } from "react-native";
import ThemedText from "../ThemedText";
import { colors, fontSize, letterSpacing, padding } from "@/theme";

interface MissingClassProps {
    onPress: () => void;
}

export default function MissingClass(props: MissingClassProps) {
    return (
        <Pressable
            onPress={props.onPress}
            style={{
                marginTop: 12,
                paddingHorizontal: 24,
                paddingVertical: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                borderStyle: "dashed",
                borderRadius: 12,
                backgroundColor: colors.schemes.light.surfaceContainer,
            }}
        >
            <ThemedText
                style={{
                    fontSize: fontSize["2xl"],
                    marginBottom: padding.lg
                }}
            >
                ⚽
            </ThemedText>
            <ThemedText
                style={{
                    marginBottom: padding.sm,
                    fontSize: fontSize.base,
                    fontWeight: 500,
                    letterSpacing: letterSpacing.xs,
                    color: "black"
                }}
            >
                Missing a Class?
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
                        maxWidth: 200,
                        fontSize: fontSize.md,
                        fontWeight: 400,
                        letterSpacing: letterSpacing.md,
                        color: colors.schemes.light.onSurfaceVariant,
                        textAlign: "center"
                    }}
                >
                    To join a class, enter its class code or scan its QR code.
                </ThemedText>
            </View>
        </Pressable>
    )
}