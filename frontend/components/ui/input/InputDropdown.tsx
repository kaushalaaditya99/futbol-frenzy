import InputDropdownV2, { InputDropdownV2Props } from "@/components/ui/input/InputDropdownV2";
import { TextStyle, ViewStyle } from "react-native";
import InputWrapper from "./InputWrapper";
import InputLabel from "./InputLabel";
import { theme } from "@/theme";
import ErrorMessage from "./ErrorMessage";
import InputErrorMessage from "./InputErrorMessage";

export interface InputDropdownProps<T> extends InputDropdownV2Props<T> {
    label?: string;
    errorMessage?: string;
    onChangeText?: (text: string) => void;
    labelStyle?: TextStyle;
    wrapperStyle?: ViewStyle;
}

export default function InputDropdown<T>(props: InputDropdownProps<T>) {
    return (
        <InputWrapper
            wrapperStyle={props.wrapperStyle}
        >
            <InputLabel
                label={props.label}
                labelStyle={{
                    color: props.errorMessage ? theme.colors.schemes.light.error : theme.colors.schemes.light.onSurface,
                    ...props.labelStyle,
                }}
            />
            <InputDropdownV2
                buttonStyle={{
                    paddingVertical: theme.padding.md,
                    paddingHorizontal: theme.padding.lg,
                    borderWidth: 1,
                    borderStyle: props.errorMessage ? "dashed" : "solid",
                    borderColor: props.errorMessage ? theme.colors.schemes.light.error : theme.colors.schemes.light.outlineVariant,
                    borderRadius: theme.borderRadius.sm,
                    backgroundColor: "white",
                }}
                textStyle={{
                    fontSize: theme.fontSize.md,
                    fontFamily: "Arimo-Regular",
                    color: props.errorMessage ? theme.colors.schemes.light.onErrorContainer : theme.colors.schemes.light.onBackground,
                }}
                {...props}
            />
            {props.errorMessage &&
                <InputErrorMessage
                    errorMessage={props.errorMessage}
                />
            }
        </InputWrapper>
    )
}