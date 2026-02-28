import { colors, padding, shadow } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    style1?: StyleProp<ViewStyle>;
    style2?: StyleProp<ViewStyle>;
    style3?: StyleProp<ViewStyle>;
    onPress?: () => void;
    borderColor?: string;
    tintColor?: string;
    backgroundColor?: string;
}

export default function Button(props: ButtonProps) {
    const flatStyle1 = StyleSheet.flatten(props.style1);
    const flatStyle2 = StyleSheet.flatten(props.style2);
    const flatStyle3 = StyleSheet.flatten(props.style3);

    return (
        <Pressable
            onPress={props.onPress}
            style={{
                flex: 1,
                padding: 1,
                backgroundColor: props.borderColor || "#2989FF",
                borderRadius: 10,
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
                    y: 0 
                }}
                end={{ 
                    x: 0, 
                    y: 1 
                }}
                style={{
                    padding: 1,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: padding.sm,
                    borderRadius: 10,
                    ...flatStyle2,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        paddingVertical: padding.lg,
                        paddingHorizontal: padding.lg,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        columnGap: padding.sm,
                        borderRadius: 8,
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