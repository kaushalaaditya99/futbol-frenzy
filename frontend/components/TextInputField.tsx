import { colors, shadow } from "@/theme";
import { StyleSheet, StyleProp, TextInput, TextStyle, ViewStyle } from "react-native";
import InputLabel from "./SideBar/InputLabel";
import InputWrapper from "./SideBar/InputWrapper";

export interface TextInputFieldProps {
    label?: string;
    value?: string;
    errorMessage?: string;
    placeholder?: string;
    onChangeText?: (text: string) => void;
    inputStyle?: StyleProp<TextStyle>;
    labelStyle?: TextStyle;
    containerStyle?: StyleProp<ViewStyle>;
}

export default function TextInputField(props: TextInputFieldProps) {
    const flatInputStyle = StyleSheet.flatten(props.inputStyle);

    return (
        <InputWrapper
            containerStyle={props.containerStyle}
        >
            <InputLabel
                label={props.label}
                labelStyle={{
                    ...props.labelStyle,
                    color: props.errorMessage ? colors.schemes.light.error : colors.schemes.light.onSurface
                }}
            />
            <TextInput
                style={{
                    fontSize: 14,
                    fontFamily: "Inter_400Regular",
                    color: props.errorMessage ? colors.schemes.light.onErrorContainer : colors.schemes.light.onBackground,
                    backgroundColor: "white",
                    width: "100%",
                    minWidth: "100%",
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderStyle: props.errorMessage ? "dashed" : "solid",
                    borderColor: props.errorMessage ? colors.schemes.light.error : colors.schemes.light.outlineVariant,
                    borderRadius: 8,
                    ...shadow.sm,
                    ...flatInputStyle
                }}
                value={props.value}
                onChangeText={props.onChangeText}
                placeholder={props.placeholder}
            />
            {props.errorMessage &&
                <InputLabel
                    label={props.errorMessage}
                    labelStyle={{
                        ...props.labelStyle,
                        marginTop: 2,
                        fontSize: 13,
                        fontWeight: 400,
                        letterSpacing: 0.1,
                        color: colors.schemes.light.error
                    }}
                />
            }
        </InputWrapper>
    )
}