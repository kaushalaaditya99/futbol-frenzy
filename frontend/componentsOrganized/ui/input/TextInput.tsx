import { borderRadius, colors, fontSize, letterSpacing, padding, shadow } from "@/theme";
import { StyleSheet, StyleProp, TextInput, TextStyle, ViewStyle } from "react-native";
import InputLabel from "./InputLabel";
import InputWrapper from "./InputWrapper";

export interface TextInputFieldProps {
    label?: string;
    value?: string;
    placeholder?: string;
    errorMessage?: string;
    onChangeText?: (text: string) => void;
    labelStyle?: TextStyle;
    inputStyle?: StyleProp<TextStyle>;
    wrapperStyle?: StyleProp<ViewStyle>;
}

export default function TextInputField(props: TextInputFieldProps) {
    const flatInputStyle = StyleSheet.flatten(props.inputStyle);

    return (
        <InputWrapper
            wrapperStyle={props.wrapperStyle}
        >
            <InputLabel
                label={props.label}
                labelStyle={{
                    color: props.errorMessage ? colors.schemes.light.error : colors.schemes.light.onSurface,
                    ...props.labelStyle,
                }}
            />
            <TextInput
                value={props.value}
                onChangeText={props.onChangeText}
                placeholder={props.placeholder}
                style={{
                    width: "100%",
                    minWidth: "100%",
                    paddingVertical: padding.md,
                    paddingHorizontal: padding.lg,
                    fontSize: fontSize.md,
                    fontFamily: "Arimo-Regular",
                    color: props.errorMessage ? colors.schemes.light.onErrorContainer : colors.schemes.light.onBackground,
                    borderWidth: 1,
                    borderStyle: props.errorMessage ? "dashed" : "solid",
                    borderColor: props.errorMessage ? colors.schemes.light.error : colors.schemes.light.outlineVariant,
                    borderRadius: borderRadius.sm,
                    backgroundColor: "white",
                    ...shadow.sm,
                    ...flatInputStyle
                }}
            />
            {props.errorMessage &&
                <InputLabel
                    label={props.errorMessage}
                    labelStyle={{
                        marginTop: padding.sm,
                        fontSize: fontSize.md,
                        fontWeight: 400,
                        letterSpacing: letterSpacing.lg,
                        color: colors.schemes.light.error,
                        ...props.labelStyle,
                    }}
                />
            }
        </InputWrapper>
    )
}