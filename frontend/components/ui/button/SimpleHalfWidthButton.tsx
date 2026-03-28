import { letterSpacing } from "@/theme";
import ThemedText from "../ThemedText";
import Button, { ButtonProps } from "./Button";
import { buttonTheme } from "./buttonTheme";
import { TextStyle, ViewStyle } from "react-native";
import InlineButton from "./InlineButton";
import ButtonHalfWidth from "./ButtonHalfWidth";

interface SimpleHalfWidthButtonProps extends Omit<ButtonProps, "children"> {
    label: string;
    textStyle?: TextStyle;
}

export default function SimpleHalfWidthButton(props: SimpleHalfWidthButtonProps) {
    return (
        <ButtonHalfWidth
            {...buttonTheme.black}
            outerStyle={props.outerStyle}
            innerStyle={props.innerStyle}
            innerMostStyle={props.innerMostStyle}
            onPress={props.onPress}
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
        </ButtonHalfWidth>
    )
}