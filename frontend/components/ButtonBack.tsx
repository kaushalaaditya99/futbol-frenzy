import { colors } from "@/theme";
import { ArrowLeft, LucideProps } from "lucide-react-native";
import { Pressable, ViewStyle } from "react-native";

interface ButtonBackProps {
    onBack: () => void;
    buttonStyle?: ViewStyle;
    buttonIconStyle1?: LucideProps
    buttonIconStyle2?: ViewStyle;
}

export default function ButtonBack(props: ButtonBackProps) {
    return (
        <Pressable
            onPress={props.onBack}
            style={{
                width: 28,
                height: 28,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 100,  
                backgroundColor: colors.schemes.light.surfaceContainer,
                ...props.buttonStyle
            }}
        >
            <ArrowLeft
                size={16}
                strokeWidth={3}
                color={colors.schemes.light.onSurfaceVariant}
                {...props.buttonIconStyle1}
                style={props.buttonIconStyle2}
            />
        </Pressable>
    )
}