import { theme } from "@/theme";
import { TextStyle } from "react-native";
import InputLabel from "./InputLabel";

interface InputErrorMessageProps {
    errorMessage?: string;
    labelStyle?: TextStyle;
}

export default function InputErrorMessage(props: InputErrorMessageProps) {
    return (
        <InputLabel
            label={props.errorMessage}
            labelStyle={{
                marginTop: theme.padding.sm,
                fontSize: theme.fontSize.md,
                fontWeight: 400,
                letterSpacing: theme.letterSpacing.lg,
                color: theme.colors.schemes.light.error,
                ...props.labelStyle,
            }}
        />
    )
}