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
                height: props.outerStyle?.height ?? undefined,
                minHeight: props.outerStyle?.height ?? undefined,
                maxHeight: props.outerStyle?.height ?? undefined,
                // height: undefined,
                width: undefined,
                flexGrow: undefined,
                flexShrink: undefined,
                flex: undefined,
                ...shadow.sm,
                ...props.outerStyle
            }}
            innerStyle={{
                height: [null, undefined].includes(props.outerStyle?.height as any) ? undefined : props.outerStyle?.height as number - 2,
                flexGrow: undefined,
                flexShrink: undefined,
                flex: undefined,
                // flex: [null, undefined].includes(props.outerStyle?.height as any) ? undefined : 1,
                ...props.innerStyle
            }}
            innerMostStyle={{
                height: [null, undefined].includes(props.outerStyle?.height as any) ? undefined : props.outerStyle?.height as number - 4,
                width: undefined,
                flexGrow: undefined,
                flexShrink: undefined,
                // flex: undefined,
                // flex: [null, undefined].includes(props.outerStyle?.height as any) ? undefined : 1,
                paddingVertical: padding.sm,
                paddingHorizontal: padding.lg,
                ...props.innerMostStyle
            }}
        >
            {props.children}
        </Button>
    )
}