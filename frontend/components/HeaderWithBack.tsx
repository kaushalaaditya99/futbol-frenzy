import { Pressable, TextStyle, View, ViewProps, ViewStyle } from "react-native";
import ThemedText from "./ThemedText";
import { ArrowLeft, LucideProps, MoveLeft } from "lucide-react-native";
import { colors, letterSpacing, padding } from "@/theme";
import { Text, TextProps, StyleSheet, StyleProp } from "react-native";
import ButtonBack from "./ButtonBack";

interface HeaderWithBackProps {
    onBack: () => void;
    header: string;
    containerStyle?: ViewStyle;
    buttonStyle?: ViewStyle;
    buttonIconStyle1?: LucideProps
    buttonIconStyle2?: ViewStyle;
    headerStyle?: TextStyle;
}

export default function HeaderWithBack(props: HeaderWithBackProps) {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                columnGap: padding.lg,
                borderBottomWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                ...props.containerStyle
            }}
        >
            <ButtonBack
                onBack={props.onBack}
                buttonStyle={props.buttonStyle}
                buttonIconStyle1={props.buttonIconStyle1}
                buttonIconStyle2={props.buttonIconStyle2}
            />
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
    )
}