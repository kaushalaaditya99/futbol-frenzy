import { padding, colors, borderRadius, shadow, letterSpacing } from "@/theme";
import { Pressable, TextStyle, View, ViewStyle } from "react-native";
import { ReactNode } from "react";
import ThemedText from "../ThemedText";

export interface InlineRadioGroupProps {
    value: string;
    options: Array<[string, ReactNode]>;
    onChange: (value: string) => void;
    containerStyle?: ViewStyle;
    optionStyle?: ViewStyle;
    selectedOptionStyle?: ViewStyle;
    unselectedOptionStyle?: ViewStyle;
    textStyle?: TextStyle;
}

export default function InlineRadioGroup(props: InlineRadioGroupProps) {
    return (
        <View
            style={{
                padding: padding.sm,
                flexDirection: "row",
                borderWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                borderRadius: borderRadius.base,
                backgroundColor: colors.schemes.light.surface,
                ...shadow.sm,
                ...props.containerStyle
            }}
        >
            {props.options.map(([value, label], i) => (
                <Pressable
                    key={i}
                    onPress={() => props.onChange(value)}
                    style={Object.assign({},
                        {
                            "flex": 1,
                            "paddingVertical": padding.lg,
                            "paddingHorizontal": padding.lg,
                            ...props.optionStyle,
                        },
                        value === props.value &&
                        {
                            "backgroundColor": "white",
                            "borderWidth": 1,
                            "borderColor": colors.schemes.light.outlineVariant,
                            "borderRadius": borderRadius.md,
                            ...shadow.sm,
                            ...props.selectedOptionStyle
                        },
                        value !== props.value &&
                        {
                            ...props.unselectedOptionStyle
                        }
                    )}
                >
                    {typeof label !== "string" &&
                        <>
                            {label}
                        </>
                    }
                    {typeof label === "string" &&
                        <ThemedText
                            style={{
                                fontSize: 12,
                                fontWeight: props.value === value ? 600 : 400,
                                letterSpacing: letterSpacing.md,
                                textAlign: "center",
                                color: props.value === value ? colors.schemes.light.onSurface : colors.schemes.light.onSurfaceVariant,
                                ...props.textStyle
                            }}
                        >
                            {label}
                        </ThemedText>
                    }
                </Pressable>
            ))}
        </View>
    )
}