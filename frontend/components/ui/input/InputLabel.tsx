import { StyleSheet, StyleProp, TextStyle } from "react-native";
import ThemedText from "../ThemedText";
import { colors, fontSize, letterSpacing } from "@/theme";

export interface InputLabelProps {
    label?: string;
    labelStyle?: StyleProp<TextStyle>;
}

export default function InputLabel(props: InputLabelProps) {
    const flatLabelStyle = StyleSheet.flatten(props.labelStyle);

    return (
        <ThemedText
            style={{
                fontSize: fontSize.base,
                fontWeight: 500,
                letterSpacing: letterSpacing.sm,
                color: colors.schemes.light.onSurfaceVariant,
                ...flatLabelStyle
            }}
        >
            {props.label}
        </ThemedText>
    )
}