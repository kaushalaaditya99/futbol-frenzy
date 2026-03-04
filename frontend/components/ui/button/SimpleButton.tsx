import { letterSpacing } from "@/theme";
import ThemedText from "../ThemedText";
import Button, { ButtonProps } from "./Button";
import { buttonTheme } from "./buttonTheme";
import { TextStyle, ViewStyle } from "react-native";

interface SimpleButtonProps extends Omit<ButtonProps, "children"> {
    label: string;
    textStyle?: TextStyle;
}

export default function SimpleButton(props: SimpleButtonProps) {
    return (
        <Button
            {...buttonTheme.black}
            {...props}
        >
            <ThemedText
                style={{
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: letterSpacing.lg,
                    color: "white",
                    ...props.textStyle
                }}
            >
                {props.label}
            </ThemedText>
        </Button>
    )
}