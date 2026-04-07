import { padding, shadow } from "@/theme";
import Button, { ButtonProps } from "./Button";

export default function IconButton(props: ButtonProps) {
    return (
        <Button
            onPress={props.onPress}
            tintColor={props.tintColor}
            borderColor={props.borderColor}
            tintUpsideDown={props.tintUpsideDown}
            backgroundColor={props.backgroundColor}
            borderRadius={props.borderRadius}
            outerStyle={{
                width: undefined,
                height: undefined,
                flex: undefined,
                flexGrow: undefined,
                flexShrink: undefined,
                ...shadow.sm,
                ...props.outerStyle
            }}
            innerStyle={{
                width: undefined,
                height: undefined,
                flex: undefined,
                flexGrow: undefined,
                flexShrink: undefined,
                ...props.innerStyle
            }}
            innerMostStyle={{
                width: undefined,
                height: 28,
                flex: undefined,
                flexGrow: undefined,
                flexShrink: undefined,
                aspectRatio: 1,
                ...props.innerMostStyle
            }}
        >
            {props.children}
        </Button>
    )
}