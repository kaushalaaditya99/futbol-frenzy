import { colors } from "@/theme";
import { ArrowLeft, LucideProps } from "lucide-react-native";
import { Pressable, ViewStyle } from "react-native";

interface ButtonBackProps {
    onBack: () => void;
    buttonStyle?: ViewStyle;
    svgProps?: LucideProps;
    svgStyle?: ViewStyle;
}

export default function ButtonBack(props: ButtonBackProps) {
    return (
        <Pressable
            onPress={props.onBack}
            style={{
                width: 28,
                height: 28,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 100,
                backgroundColor: colors.schemes.light.surfaceContainerHigh,
                ...props.buttonStyle
            }}
        >
            <ArrowLeft
                size={16}
                strokeWidth={3}
                color={colors.schemes.light.onSurfaceVariant}
                style={props.svgStyle}
                {...props.svgProps}
            />
        </Pressable>
    )
}