import { ReactNode } from "react";
import { View, ImageBackground, Pressable } from "react-native"
import ThemedText from "./ThemedText";
import { colors, margin, padding } from "@/theme";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftFromLine, Cog } from "lucide-react-native";

export function SideBarLink(props: {icon: ReactNode; label: string; onPress: () => void; style?: {[k: string]: string|number}}) {
    return (
        <Pressable
            style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: padding.md,
                paddingVertical: margin.xs,
                paddingHorizontal: margin.sm,
                ...props.style
            }}
        >
            {props.icon}
            <ThemedText
                style={{
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: 0.1,
                    color: colors.schemes.light.onPrimary
                }}
            >
                {props.label}
            </ThemedText>
        </Pressable>
    )
}

interface SideBarProps {
    targetWidth: number;
    animatedExpandFromLeft: {
        minWidth: number;
    }
}

export default function SideBar(props: SideBarProps) {
    return (
        <Animated.View
            style={[
                {
                    flex: 1,
                    backgroundColor: colors.palettes.neutral[0],
                },
                props.animatedExpandFromLeft
            ]}
        >
            <SafeAreaView
                edges={["top"]}
                style={{
                    minWidth: props.targetWidth,
                    flex: 1,
                    justifyContent: "space-between",
                }}
            >
                <View
                    style={{
                        borderBottomWidth: 1,
                        borderColor: "#FFFFFF20",
                        paddingVertical: margin.sm,
                        paddingHorizontal: margin.sm,
                        rowGap: padding.lg
                    }}
                >
                    <ImageBackground
                        source={require('../assets/images/Pedri-11.jpg')}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 100,
                            overflow: "hidden",
                            backgroundColor: colors.schemes.light.surfaceContainerLowest,
                        }}
                    />
                    <View
                        style={{
                            rowGap: 1
                        }}
                    >
                        <ThemedText
                            style={{
                                fontSize: 14,
                                fontWeight: 500,
                                letterSpacing: 0.1,
                                color: colors.schemes.dark.onSurfaceVariant,
                            }}
                        >
                            Good Morning,
                        </ThemedText>
                        <ThemedText
                            style={{
                                fontSize: 18,
                                fontWeight: 500,
                                letterSpacing: -0.1,
                                color: colors.schemes.light.onPrimary
                            }}
                        >
                            Alex Rivera
                        </ThemedText>
                    </View>
                </View>
                <View
                    style={{
                        borderTopWidth: 1,
                        borderColor: "#FFFFFF20"
                    }}
                >
                    <SideBarLink
                        icon={
                            <Cog
                                size={16}
                                color={colors.schemes.light.onPrimary}
                            />
                        }
                        label="Settings"
                        onPress={() => 0}
                    />
                    <SideBarLink
                        icon={
                            <ArrowLeftFromLine
                                size={16}
                                color={colors.schemes.light.onPrimary}
                            />
                        }
                        label="Log Out"
                        style={{
                            borderTopWidth: 1,
                            borderBottomWidth: 1,
                            borderColor: "#FFFFFF20"
                        }}
                        onPress={() => 0}
                    />
                </View>
            </SafeAreaView>
        </Animated.View>
    )
}