import { padding, colors, borderRadius, shadow, margin, letterSpacing } from "@/theme";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import ThemedText from "./ThemedText";
import { ReactNode } from "react";

interface InlineRadioButtonsProps {
    selectedValue: string;
    options: Array<[string, ReactNode]>;
    onChange: (value: string) => void;
    containerStyle?: ViewStyle;
    optionStyle?: ViewStyle;
    selectedOptionStyle?: ViewStyle;
    unselectedOptionStyle?: ViewStyle;
}

export default function InlineRadioButton(props: InlineRadioButtonsProps) {
    return (
        <View
            style={{
                padding: padding.sm,
                flexDirection: "row",
                borderWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                borderRadius: borderRadius.base,
                // borderBottomWidth: 0,
                // borderBottomLeftRadius: 0,
                // borderBottomRightRadius: 0,
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
                            // flex: 1,
                            paddingVertical: padding.lg,
                            paddingHorizontal: padding.lg,
                            ...props.optionStyle,
                        },
                        value === props.selectedValue &&
                        {
                            "backgroundColor": "white",
                            "borderWidth": 1,
                            "borderColor": colors.schemes.light.outlineVariant,
                            "borderRadius": borderRadius.md,
                            ...shadow.sm,
                            ...props.selectedOptionStyle
                        },
                        {
                            ...props.unselectedOptionStyle
                        }
                    )}
                >
                    {typeof label === "string" &&
                        <ThemedText
                            style={{
                                fontSize: 12,
                                fontWeight: props.selectedValue === value ? 600 : 400,
                                letterSpacing: letterSpacing.md,
                                color: props.selectedValue === value ? colors.schemes.light.onSurface : colors.schemes.light.onSurfaceVariant,
                                textAlign: "center"
                            }}
                        >
                            {label}
                        </ThemedText>
                    }
                    {typeof label !== "string" &&
                        <>
                            {label}
                        </>
                    }
                </Pressable>
            ))}
        </View>
    )
}