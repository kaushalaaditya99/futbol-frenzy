import { borderRadius, colors, padding, shadow } from "@/theme";
import { Pressable, Text, View } from "react-native";
import ThemedText from "../ThemedText";

export interface RadioCardProps {
    label?: string;
    value?: string;
    selected?: boolean;
    onChange: (value: string) => void;
    description?: string;
    icon?: string;
}

export default function RadioCard(props: RadioCardProps) {
    return (
        <Pressable
            onPress={() => props.value && props.onChange(props.value)}
            style={{
                paddingVertical: padding.lg,
                paddingHorizontal: padding.lg,
                display: "flex",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: colors.schemes.light.outlineVariant,
                borderRadius: borderRadius.base,
                backgroundColor:  "white",
                ...shadow.sm,
                flex: 1,
            }}
        >
            <View
                style={{
                    width: 24,
                    height: 24,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: props.selected ? "black" : colors.schemes.light.outlineVariant,
                    borderRadius: 100,
                    backgroundColor: props.selected ? "white" : colors.schemes.light.surfaceContainerHigh,
                    ...shadow.sm,
                }}
            >
                {props.selected &&
                    <View
                        style={{
                            width: 18,
                            height: 18,
                            borderRadius: 100,
                            backgroundColor: props.selected ? "black" : colors.schemes.light.surfaceContainerHigh
                        }}
                    />
                }
            </View>
            {props.icon &&
                <Text
                    style={{
                        marginBottom: 8,
                        fontSize: 48,
                        textAlign: "center",
                    }}
                >
                    {props.icon}
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