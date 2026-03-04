import { letterSpacing } from "@/theme";
import ThemedText from "../ThemedText";
import Button, { ButtonProps } from "./Button";
import { buttonTheme } from "./buttonTheme";
import { TextStyle, ViewStyle } from "react-native";
import InlineButton from "./InlineButton";

interface SimpleInlineButtonProps extends Omit<ButtonProps, "children"> {
    label: string;
    textStyle?: TextStyle;
}

export default function SimpleInlineButton(props: SimpleInlineButtonProps) {
    return (
        <InlineButton
            {...buttonTheme.black}
            outerStyle={props.outerStyle}
            innerStyle={props.innerStyle}
            innerMostStyle={props.innerMostStyle}
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
        </InlineButton>
    )
}