import { borderRadius, colors, padding, shadow } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    outerStyle?: StyleProp<ViewStyle>;
    inBetweenStyle?: StyleProp<ViewStyle>;
    innerStyle?: StyleProp<ViewStyle>;
    onPress?: () => void;
    tintColor?: string;
    tintUpsideDown?: boolean;
    borderColor?: string;
    backgroundColor?: string;
}

export const buttonThemes: {[k: string]: {borderColor: string; tintColor: string; backgroundColor: string}} = {
    "black": {
        borderColor: "black",
        tintColor: "#646464f0",
        backgroundColor: "black"
    },
    "white": {
        borderColor: colors.schemes.light.outlineVariant,
        tintColor: "#efefef",
        backgroundColor: "white"
    },
    "disabled": {
        borderColor: "gray",
        tintColor: "#ffffffad",
        backgroundColor: "gray"
    }
}

export default function Button(props: ButtonProps) {
    const flatStyle1 = StyleSheet.flatten(props.outerStyle);
    const flatStyle2 = StyleSheet.flatten(props.inBetweenStyle);
    const flatStyle3 = StyleSheet.flatten(props.innerStyle);

    return (
        <Pressable
            onPress={props.onPress}
            style={{
                alignSelf: "flex-start",
                padding: 1,
                backgroundColor: props.borderColor || "#2989FF",
                borderRadius: borderRadius.base,
                ...shadow.md,
                ...flatStyle1,
            }}
        >
            <LinearGradient
                colors={[
                    props.tintColor || "#FFFFFF5A", 
                    props.backgroundColor || colors.coreColors.primary
                ]}
                start={{ 
                    x: 0, 
                    y: props.tintUpsideDown ? 1 : 0
                }}
                end={{ 
                    x: 0, 
                    y: props.tintUpsideDown ? 0 : 1
                }}
                style={{
                    padding: 1,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: padding.sm,
                    borderRadius: borderRadius.base - 1,
                    ...flatStyle2,
                }}
            >
                <View
                    style={{
                        paddingVertical: padding.lg,
                        paddingHorizontal: padding.lg,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        columnGap: padding.sm,
                        borderRadius: borderRadius.base - 2,
                        backgroundColor: props.backgroundColor || colors.coreColors.primary,
                        ...flatStyle3
                    }}
                >
                    {props.children}
                </View>
            </LinearGradient>
        </Pressable>
    )
}