import { colors, fontSize, letterSpacing, margin, padding } from "@/theme";
import { GestureResponderEvent, ImageBackground, Pressable, View } from "react-native";
import ThemedText from "./ThemedText";

interface HeaderProps {
    openSideBar: () => void;
}

export default function Header(props: HeaderProps) {
    return (
        <View
            style={{
                paddingVertical: padding.xl,
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                backgroundColor: colors.schemes.light.surface,
                borderBottomWidth: 1,
                borderColor: colors.schemes.light.outlineVariant
            }}
        >
            <View
                style={{
                    width: "33%",
                    paddingHorizontal: margin.sm
                }}
            >
                <Pressable
                    onPress={(e: GestureResponderEvent) => {
                        e.stopPropagation();
                        props.openSideBar()
                    }}
                    style={{
                        position: "relative",
                        alignSelf: "flex-start"
                    }}
                >
                    <ImageBackground
                        source={require('../assets/images/Pedri-11.jpg')}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 100,
                            overflow: "hidden",
                            backgroundColor: colors.schemes.light.surfaceContainerLowest,
                        }}
                    />
                </Pressable>
            </View>
            {/* 
                Logo could go here, but I couldn't make it look good.
                So, I'm commenting it out for now.
            */}
            <View
                style={{
                    width: "33%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignSelf: "flex-start",
                        padding: padding.sm,
                        paddingHorizontal: padding.md,
                        borderRadius: 8
                    }}
                >
                    <ThemedText
                        style={{
                            letterSpacing: letterSpacing.lg,
                            fontSize: fontSize.lg,
                            fontWeight: 500,
                            color: colors.schemes.light.onSurface,
                            textAlign: "center",
                        }}
                    >
                        DrillUp
                    </ThemedText>
                </View>
            </View>
        </View>
    )
}