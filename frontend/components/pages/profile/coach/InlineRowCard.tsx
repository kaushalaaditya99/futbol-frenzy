import { borderRadius, colors, fontSize, letterSpacing, padding, shadow } from "@/theme";
import { Pressable, View } from "react-native";
import { Fragment, ReactNode, useEffect, useState } from "react";
import ThemedText from "@/components/ui/ThemedText";
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { TrashIcon } from "lucide-react-native";
import { scheduleOnRN } from 'react-native-worklets';
// import { usePanGestureHandler } from 'react-native-gesture-handler';


interface InlineRowCardProps {
    onPress: () => void;
    title: string;
    titleTag?: ReactNode;
    description: string;
    descriptions: Array<string>;
    imageText: string;
    imageTextColor: string;
    imageBackgroundColor: string;
    deleteObject: () => void;
}

export default function InlineRowCard(props: InlineRowCardProps) {
    const fontSizes = {
        0: fontSize.md,
        1: fontSize.md,
        2: fontSize.md,
        3: fontSize.md,
    }

    const translateX = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10])   // only activate after horizontal movement
        .failOffsetY([-10, 10])  
        .onUpdate((event) => {
            if (event.translationX >= 0 || event.translationX <= -100)
                return;
            translateX.value = event.translationX;
        })
        .onEnd((event) => {
            // console.log(translateX.value)
            if (translateX.value <= -50) {
                scheduleOnRN(props.deleteObject);
            }
            translateX.value = 0;
        });

    return (
        <GestureDetector 
            gesture={panGesture}
        >
            <View
                style={{
                    position: "relative",
                    backgroundColor: "white",
                    height: 96,
                }}
            >   
                <View
                    style={{
                        position: "absolute",
                        zIndex: -1,
                        right: 0,
                        width: 100,
                        height: 96,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: "#ff0000"
                    }}
                >
                    <TrashIcon
                        size={24}
                        color='white'
                    />
                </View>
                <Animated.View
                    style={[
                        animatedStyle,
                        {
                            position: "relative",
                            zIndex: 10,
                            height: 96,
                            paddingVertical: 16,
                            paddingHorizontal: 16,
                            display: "flex",
                            flexDirection: "row",
                            columnGap: 8,
                            backgroundColor: colors.schemes.light.surfaceContainerLowest,
                            borderBottomWidth: 1,
                            borderColor: colors.schemes.light.outlineVariant,
                            borderStyle: "solid",
                        }
                    ]}
                >
                    <Pressable
                        onPress={props.onPress}
                        style={{
                            height: 96,
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "row",
                            columnGap: 16,
                        }}   
                    >
                        <View
                            style={{
                                // width: 48,
                                height: 96 - 32,
                                aspectRatio: 1,
                                display: "flex",
                                // flexGrow: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                padding: padding.md,
                                // borderWidth: 1,
                                // borderColor: colors.schemes.light.outlineVariant,
                                borderRadius: borderRadius.base - 2,
                                backgroundColor: props.imageBackgroundColor || colors.palettes.neutral[90],
                                // ...shadow.lg
                            }}
                        >
                            <ThemedText
                                numberLines={1}
                                style={{
                                    fontSize: fontSizes[((!props.imageText ? 0 : props.imageText.length) % 4 || 0) as 0|1|2|3],
                                    fontWeight: 600,
                                    color: props.imageTextColor || "black"
                                }}
                            >
                                {props.imageText && props.imageText.toUpperCase().slice(0, 2)}
                            </ThemedText>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                rowGap: 2
                            }}
                        >
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between"
                                }}
                            >
                                <ThemedText
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 500,
                                        letterSpacing: letterSpacing["xl"] * 1,
                                        color: colors.schemes.light.onSurface
                                    }}
                                >
                                    {props.title}
                                </ThemedText>
                                {props.titleTag}
                            </View>
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    columnGap: 8
                                }}
                            >
                                <ThemedText
                                    style={{
                                        fontSize: 15,
                                        letterSpacing: letterSpacing["xl"] * 3,
                                        color: colors.schemes.light.onSurfaceVariant
                                    }}
                                >
                                    {props.description}
                                </ThemedText>
                            </View>
                        </View>
                    </Pressable>
                </Animated.View>
            </View>
        </GestureDetector>
    )
}