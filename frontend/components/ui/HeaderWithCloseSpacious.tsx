import { theme } from "@/theme";
import { LucideProps } from "lucide-react-native";
import { TextStyle, View, ViewStyle } from "react-native";
import ButtonExit from "./button/ButtonExit";
import ThemedText from "./ThemedText";

interface HeaderWithCloseSpaciousProps {
    onClose?: () => void;
    header?: string;
    containerStyle?: ViewStyle;
    headerStyle?: TextStyle;
    buttonStyle?: ViewStyle;
    svgProps?: LucideProps;
    svgStyle?: ViewStyle;
}


export default function HeaderWithCloseSpacious(props: HeaderWithCloseSpaciousProps) {
    return (
        <View
            style={{
                marginBottom: theme.margin.sm,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                ...props.containerStyle
            }}    
        >
            <ThemedText
                style={{
                    fontSize: theme.fontSize.lg,
                    fontWeight: 500,
                    letterSpacing: theme.letterSpacing.lg,
                    ...props.headerStyle
                }}
            >
                {props.header}
            </ThemedText>
            <ButtonExit
                onExit={props.onClose}
                svgStyle={props.svgStyle}
                svgProps={props.svgProps}
            />
        </View>
    )
}