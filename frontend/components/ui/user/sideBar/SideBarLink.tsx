import { colors, fontSize, letterSpacing, margin, padding } from "@/theme";
import { ReactNode } from "react";
import { Pressable, TextStyle, ViewStyle } from "react-native";
import ThemedText from "../../ThemedText";

interface SideBarLinkProps {
    icon: ReactNode; 
    label: string; 
    onPress: () => void; 
    textStyle?: TextStyle;
    containerStyle?: ViewStyle;
}

export function SideBarLink(props: SideBarLinkProps) {
    return (
        <Pressable
            style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: padding.md,
                paddingVertical: padding.xl,
                paddingHorizontal: margin.sm,
                ...props.containerStyle
            }}
        >
            {props.icon}
            <ThemedText
                style={{
                    fontSize: fontSize.base,
                    fontWeight: 500,
                    letterSpacing: letterSpacing.base,
                    color: colors.schemes.light.onSurface
                }}
            >
                {props.label}
            </ThemedText>
        </Pressable>
    )
}