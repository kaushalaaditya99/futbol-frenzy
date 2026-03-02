import { ReactNode } from "react";
import { View, ImageBackground, Pressable } from "react-native"
import ThemedText from "@/components/ThemedText";
import { colors, fontSize, letterSpacing, margin, padding } from "@/theme";
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
                paddingVertical: padding.xl,
                paddingHorizontal: margin.sm,
                ...props.style
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
                    backgroundColor: colors.schemes.light.background,
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
                        borderColor: colors.schemes.light.outlineVariant,
                        paddingVertical: margin.sm,
                        paddingHorizontal: margin.sm,
                        rowGap: padding.lg
                    }}
                >
                    <ImageBackground
                        source={require('../../assets/images/Pedri-11.jpg')}
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
                                fontSize: fontSize.md,
                                fontWeight: 500,
                                letterSpacing: letterSpacing.lg,
                                color: colors.schemes.light.onSurfaceVariant,
                            }}
                        >
                            Good Morning,
                        </ThemedText>
                        <ThemedText
                            style={{
                                fontSize: fontSize.lg,
                                fontWeight: 600,
                                letterSpacing: letterSpacing.sm,
                                color: colors.schemes.light.onSurface
                            }}
                        >
                            Alex Rivera
                        </ThemedText>
                    </View>
                </View>
                <View
                    style={{
                        borderTopWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant
                    }}
                >
                    <SideBarLink
                        icon={
                            <Cog
                                size={18}
                                color={colors.schemes.light.onSurfaceVariant}
                            />
                        }
                        label="Settings"
                        onPress={() => 0}
                    />
                    <SideBarLink
                        icon={
                            <ArrowLeftFromLine
                                size={18}
                                color={colors.schemes.light.onSurfaceVariant}
                            />
                        }
                        label="Log Out"
                        style={{
                            borderTopWidth: 1,
                            borderColor: colors.schemes.light.outlineVariant
                        }}
                        onPress={() => 0}
                    />
                </View>
            </SafeAreaView>
        </Animated.View>
    )
}