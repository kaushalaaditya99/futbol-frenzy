import { borderRadius, colors, padding, shadow } from "@/theme";
import { Pressable, Text, View } from "react-native";
import ThemedText from "../ThemedText";

export interface RadioCardProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    description: string;
    emoji?: string;
}

export default function RadioCard(props: RadioCardProps) {
    return (
        <Pressable
            onPress={() => props.onChange(props.value)}
            style={{
                paddingVertical: padding.lg,
                paddingHorizontal: padding.lg,
                display: "flex",
                alignSelf: "flex-start",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: colors.schemes.light.outlineVariant,
                borderRadius: borderRadius.base,
                backgroundColor:  "white",
                ...shadow.sm
            }}
        >
            {props.emoji &&
                <Text
                    style={{
                        marginBottom: 8,
                        fontSize: 48,
                        textAlign: "center",
                    }}
                >
                    {props.emoji}
                </Text>
            }
            <ThemedText
                style={{
                    fontSize: 18,
                    fontWeight: 600,
                    textAlign: "center",
                    color: colors.schemes.light.onSurface
                }}
            >
                {props.label}
            </ThemedText>
            <ThemedText
                style={{
                    fontSize: 14,
                    fontWeight: 400,
                    textAlign: "center",
                    color: colors.schemes.light.onSurfaceVariant
                }}
            >
                {props.description}
            </ThemedText>
        </Pressable>
    )
}