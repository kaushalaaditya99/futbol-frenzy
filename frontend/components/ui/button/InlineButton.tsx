import { padding, shadow } from "@/theme";
import Button, { ButtonProps } from "./Button";

export default function InlineButton(props: ButtonProps) {
    return (
        <Button
            onPress={props.onPress}
            tintColor={props.tintColor}
            borderColor={props.borderColor}
            tintUpsideDown={props.tintUpsideDown}
            backgroundColor={props.backgroundColor}
            borderRadius={props.borderRadius || 8}
            outerStyle={{
                width: undefined,
                flexShrink: 1,
                ...shadow.sm,
                ...props.outerStyle
            }}
            innerStyle={{
                ...props.innerStyle
            }}
            innerMostStyle={{
                width: undefined,
                paddingVertical: padding.sm,
                paddingHorizontal: padding.lg,
                ...props.innerMostStyle
            }}
        >
            {props.children}
        </Button>
    )
}