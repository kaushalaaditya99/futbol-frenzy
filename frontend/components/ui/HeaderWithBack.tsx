import { TextStyle, View, ViewStyle } from "react-native";
import ThemedText from "./ThemedText";
import { LucideProps } from "lucide-react-native";
import { colors, letterSpacing, padding } from "@/theme";
import ButtonBack from "./button/ButtonBack";
import { ReactNode } from "react";

interface HeaderWithBackProps {
    onBack: () => void;
    header: string;
    subHeader?: ReactNode;
    containerStyle?: ViewStyle;
    headerStyle?: TextStyle;
    buttonStyle?: ViewStyle;
    svgProps?: LucideProps;
    svgStyle?: ViewStyle;
}

export default function HeaderWithBack(props: HeaderWithBackProps) {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                columnGap: padding.lg,
                borderBottomWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                backgroundColor: colors.schemes.light.background,
                ...props.containerStyle
            }}
        >
            <ButtonBack
                onBack={props.onBack}
                buttonStyle={props.buttonStyle}
                svgStyle={props.svgStyle}
                svgProps={props.svgProps}
            />
            <View>
                <View
                    style={{
                        height: 28,
                        justifyContent: 'center',
                        // alignItems: 'center',
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: 20,
                            fontWeight: 600,
                            letterSpacing: letterSpacing.sm,
                            color: colors.schemes.light.onBackground,
                            ...props.headerStyle
                        }}
                    >
                        {props.header}
                    </ThemedText>
                </View>
                {props.subHeader}
            </View>
        </View>
    )
}