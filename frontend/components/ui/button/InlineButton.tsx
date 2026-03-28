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
                height: undefined,
                width: undefined,
                flexGrow: undefined,
                flexShrink: undefined,
                flex: undefined,
                ...shadow.sm,
                ...props.outerStyle
            }}
            innerStyle={{
                height: undefined,
                flexGrow: undefined,
                flexShrink: undefined,
                flex: undefined,
                ...props.innerStyle
            }}
            innerMostStyle={{
                height: undefined,
                width: undefined,
                flexGrow: undefined,
                flexShrink: undefined,
                flex: undefined,
                paddingVertical: padding.sm,
                paddingHorizontal: padding.lg,
                ...props.innerMostStyle
            }}
        >
            {props.children}
        </Button>
    )
}