import { borderRadius, colors, fontSize, letterSpacing, padding, shadow } from "@/theme";
import { useState } from "react";
import { Pressable, StyleSheet, StyleProp, TextInput, TextStyle, View, ViewStyle } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import InputLabel from "./InputLabel";
import InputWrapper from "./InputWrapper";
import ErrorMessage from "./ErrorMessage";
import InputErrorMessage from "./InputErrorMessage";

export interface InputTextProps {
    label?: string;
    value?: string;
    placeholder?: string;
    multiline?: boolean;
    numberOfLines?: number;
    errorMessage?: string;
    onChangeText?: (text: string) => void;
    labelStyle?: TextStyle;
    inputStyle?: StyleProp<TextStyle>;
    wrapperStyle?: StyleProp<ViewStyle>;
    secureTextEntry?: boolean;
}

export default function InputText(props: InputTextProps) {
    const flatInputStyle = StyleSheet.flatten(props.inputStyle);
    const [visible, setVisible] = useState(false);
    const isPassword = props.secureTextEntry;

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
            <View style={{ position: "relative" }}>
                <TextInput
                    value={props.value}
                    onChangeText={props.onChangeText}
                    placeholder={props.placeholder}
                    multiline={props.multiline}
                    numberOfLines={props.numberOfLines}
                    secureTextEntry={isPassword && !visible}
                    autoCapitalize="none"
                    style={{
                        width: "100%",
                        minWidth: "100%",
                        paddingVertical: padding.md,
                        paddingHorizontal: padding.lg,
                        paddingRight: isPassword ? 44 : padding.lg,
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
                {isPassword && (
                    <Pressable
                        onPress={() => setVisible(!visible)}
                        style={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: 44,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {visible ? (
                            <Eye size={18} color={colors.schemes.light.onSurfaceVariant} />
                        ) : (
                            <EyeOff size={18} color={colors.schemes.light.onSurfaceVariant} />
                        )}
                    </Pressable>
                )}
            </View>
            {props.errorMessage &&
                <InputErrorMessage
                    errorMessage={props.errorMessage}
                />
            }
        </InputWrapper>
    )
}