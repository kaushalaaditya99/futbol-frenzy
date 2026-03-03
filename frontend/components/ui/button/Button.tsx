import { borderRadius, colors, padding, shadow } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ReactNode, useState } from "react";

export interface ButtonProps {
    children: ReactNode;
    onPress?: () => void;
    outerStyle?: ViewStyle;
    innerStyle?: ViewStyle;
    innerMostStyle?: ViewStyle;
    tintColor?: string;
    tintUpsideDown?: boolean;
    borderColor?: string;
    backgroundColor?: string;
    borderRadius?: number;
}

export default function Button(props: ButtonProps) {
    const outerStyle = StyleSheet.flatten(props.outerStyle);
    const innerStyle = StyleSheet.flatten(props.innerStyle);
    const innerMostStyle = StyleSheet.flatten(props.innerMostStyle);
    const [outerBorderRadius, setOuterBorderRadius] = useState(props.borderRadius === undefined ? borderRadius.base : props.borderRadius)

    return (
        <Pressable
            onPress={props.onPress}
            style={{
                padding: 1,
                alignSelf: "flex-start",
                borderRadius: outerBorderRadius,
                backgroundColor: props.borderColor,
                ...shadow.md,
                ...outerStyle,
            }}
        >
            <LinearGradient
                colors={[
                    props.tintColor || "white",
                    props.backgroundColor || "white",
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
                    borderRadius: outerBorderRadius - 1,
                    ...innerStyle,
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
                        columnGap: 6,
                        borderRadius: outerBorderRadius - 2,
                        backgroundColor: props.backgroundColor,
                        ...innerMostStyle
                    }}
                >
                    {props.children}
                </View>
            </LinearGradient>
        </Pressable>
    )
}