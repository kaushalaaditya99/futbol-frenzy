import { TextStyle, ViewStyle } from "react-native";
import InlineRadioGroup, { InlineRadioGroupProps } from "./InlineRadioGroup";
import InputWrapper from "./InputWrapper";
import InputLabel from "./InputLabel";
import { theme } from "@/theme";
import InputErrorMessage from "./InputErrorMessage";

interface InputInlineRadioGroupProps extends InlineRadioGroupProps {
    label?: string;
    errorMessage?: string;
    onChangeText?: (text: string) => void;
    labelStyle?: TextStyle;
    wrapperStyle?: ViewStyle;
}

export default function InputInlineRadioGroup(props: InputInlineRadioGroupProps) {
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
            <InlineRadioGroup
                {...props}
                textStyle={{
                    fontSize: 14
                }}
            />
            {props.errorMessage &&
                <InputErrorMessage
                    errorMessage={props.errorMessage}
                />
            }
        </InputWrapper>
    )
}