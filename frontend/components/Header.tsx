import { colors, margin, padding } from "@/theme";
import { GestureResponderEvent, ImageBackground, Pressable, View } from "react-native";
import ThemedText from "./ThemedText";

interface HeaderProps {
    openSideBar: () => void;
}

export default function Header(props: HeaderProps) {
    // Not Needed Now
    // const [fontsLoaded] = useFonts({
    //     'Doto-Regular': require('../assets/fonts/Doto/Doto-Regular.ttf'),
    //     'Doto-Medium': require('../assets/fonts/Doto/Doto-Medium.ttf'),
    //     'Doto-Bold': require('../assets/fonts/Doto/Doto-Bold.ttf'),
    //     'Doto-SemiBold': require('../assets/fonts/Doto/Doto-SemiBold.ttf'),
    //     'Doto-ExtraBold': require('../assets/fonts/Doto/Doto-ExtraBold.ttf'),
    //     'Doto-Black': require('../assets/fonts/Doto/Doto_Rounded-Black.ttf'),
    // });

    // if (!fontsLoaded)
    //     return null;

    return (
        <View
            style={{
                height: 72,
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                backgroundColor: colors.palettes.neutral[0],
                // borderBottomWidth: 1,
                // borderColor: colors.schemes.light.outlineVariant
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
                            transform: [{ 
                                scaleY: 0.9375 
                            }],
                            letterSpacing: -0.1,
                            fontSize: 20,
                            fontWeight: 500,
                            color: colors.schemes.light.onPrimary,
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