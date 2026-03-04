import { colors } from "@/theme";
import { LucideProps, X } from "lucide-react-native";
import { Pressable, ViewStyle } from "react-native";

interface ButtonExitProps {
    onExit?: () => void;
    buttonStyle?: ViewStyle;
    svgProps?: LucideProps;
    svgStyle?: ViewStyle;
}

export default function ButtonExit(props: ButtonExitProps) {
    return (
        <Pressable
            style={{
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 100,
                backgroundColor: colors.schemes.light.surfaceContainerHighest,
                ...props.buttonStyle
            }}
            onPress={props.onExit}
        >
            <X
                size={12}
                strokeWidth={3}
                color={colors.schemes.light.onSurface}
                style={props.svgStyle}
                {...props.svgProps}
            />
         </Pressable>
    )
}