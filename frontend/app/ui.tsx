import Button from "@/components/ui/button/Button";
import ButtonHalfWidth from "@/components/ui/button/ButtonHalfWidth";
import { buttonTheme } from "@/components/ui/button/buttonTheme";
import IconButton from "@/components/ui/button/IconButton";
import InlineButton from "@/components/ui/button/InlineButton";
import HeaderWithCloseSpacious from "@/components/ui/HeaderWithCloseSpacious";
import ThemedText from "@/components/ui/ThemedText";
import { margin, theme } from "@/theme";
import { FrownIcon, PlusIcon, SmileIcon } from "lucide-react-native";
import { Dimensions, View } from "react-native";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Random Page for Playing w/ UI

export default function UI() {
    return (
        <ScrollView
            style={{
                backgroundColor: "blue"
            }}
        >
            <SafeAreaView
                style={{
                    padding: 100,
                    rowGap: 100
                }}
            > 
                <View
                    style={{
                        width: "100%",
                        height: Dimensions.get("screen").height * 0.66,
                        minHeight: Dimensions.get("screen").height * 0.66,
                        maxHeight: Dimensions.get("screen").height * 0.66,
                        padding: margin.sm,
                        backgroundColor: "white"
                    }}
                >
                    <HeaderWithCloseSpacious
                        header={"header"}
                        onClose={() => null}
                    />
                    <Button
                        outerStyle={{
                            maxHeight: 48
                        }}
                        {...buttonTheme.white}
                    >
                        <ThemedText>
                            OK
                        </ThemedText>    
                    </Button>
                    <InlineButton
                        outerStyle={{
                            maxHeight: 48
                        }}
                        {...buttonTheme.white}
                    >
                        <ThemedText>
                            OK
                        </ThemedText>    
                    </InlineButton>
                    <Button
                        // outerStyle={{
                        //     maxHeight: 48
                        // }}
                        {...buttonTheme.white}
                    >
                        <ThemedText>
                            OK
                        </ThemedText>    
                    </Button>
                </View>
                <View
                    style={{
                        rowGap: 10
                    }}
                >
                    <Button
                        {...buttonTheme.white}
                    >
                        <ThemedText>
                            OK
                        </ThemedText>    
                    </Button>        
                </View>
                <View
                    style={{
                        flexDirection: "column"
                    }}
                >
                    <Button
                        {...buttonTheme.blue}
                        outerStyle={{
                            height: 100
                        }}
                    >
                        <ThemedText>
                            Button 0
                        </ThemedText>
                    </Button>
                    <ButtonHalfWidth
                        {...buttonTheme.black}
                        buttonHeight={60}
                    >
                        <ThemedText
                            style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: "white",
                                letterSpacing: theme.letterSpacing.lg,
                                textAlign: "center"
                            }}
                        >
                            Button
                        </ThemedText>
                    </ButtonHalfWidth>
                </View>
                <View
                    style={{
                        flexDirection: "row"
                    }}
                >
                    <ButtonHalfWidth
                        {...buttonTheme.black}
                        buttonHeight={60}
                    >
                        <ThemedText
                            style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: "white",
                                letterSpacing: theme.letterSpacing.lg,
                                textAlign: "center"
                            }}
                        >
                            Button 1
                        </ThemedText>
                    </ButtonHalfWidth>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        columnGap: 10
                    }}
                >
                    <ButtonHalfWidth
                        {...buttonTheme.black}
                        buttonHeight={60}
                    >
                        <ThemedText
                            style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: "white",
                                letterSpacing: theme.letterSpacing.lg,
                                textAlign: "center"
                            }}
                        >
                            Button 1
                        </ThemedText>
                    </ButtonHalfWidth>
                    <ButtonHalfWidth
                        {...buttonTheme.black}
                        buttonHeight={60}
                    >
                        <ThemedText
                            style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: "white",
                                letterSpacing: theme.letterSpacing.lg,
                                textAlign: "center"
                            }}
                        >
                            Button 2
                        </ThemedText>
                    </ButtonHalfWidth>
                </View>
                <View>
                    <InlineButton>
                        <ThemedText>
                            Button
                        </ThemedText>
                    </InlineButton>
                </View>
                <View
                    style={{
                        flexDirection: "row"
                    }}
                >
                    <InlineButton>
                        <ThemedText>
                            Button
                        </ThemedText>
                    </InlineButton>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        columnGap: 10
                    }}
                >
                    <Button
                        {...buttonTheme.black}
                    >
                        <ThemedText
                            style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: "white",
                                letterSpacing: theme.letterSpacing.lg,
                                textAlign: "center"
                            }}
                        >
                            Button 1
                        </ThemedText>
                    </Button>
                    <Button
                        {...buttonTheme.black}
                    >
                        <ThemedText
                            style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: "white",
                                letterSpacing: theme.letterSpacing.lg,
                                textAlign: "center"
                            }}
                        >
                            Button 2
                        </ThemedText>
                    </Button>
                </View>
                <View
                    style={{
                        flexDirection: "row"
                    }}
                >
                    <IconButton>
                        <SmileIcon/>
                    </IconButton>
                    <IconButton>
                        <FrownIcon/>
                    </IconButton>
                </View>
                <View>
                    <IconButton>
                        <SmileIcon/>
                    </IconButton>
                    <IconButton>
                        <FrownIcon/>
                    </IconButton>
                </View>
                <View>
                    <InlineButton
                        borderRadius={8}
                        {...buttonTheme.white}
                        outerStyle={{
                            height: 36
                        }}
                    >
                        <PlusIcon
                            size={14}
                            strokeWidth={2.5}
                            color={theme.colors.schemes.light.onSurfaceVariant}
                        />
                        <ThemedText
                            style={{
                                fontSize: 14,
                                fontWeight: 500,
                                letterSpacing: theme.letterSpacing.lg,
                                color: theme.colors.schemes.light.onSurface
                            }}
                        >
                            Create Workout
                        </ThemedText>
                    </InlineButton>
                    <InlineButton
                        outerStyle={{
                            height: 48,
                            backgroundColor: "red"
                        }}
                    >
                        <SmileIcon/>
                    </InlineButton>
                </View>
                <View
                    style={{
                        flexDirection: "row"
                    }}
                >
                    <InlineButton
                        borderRadius={8}
                        {...buttonTheme.white}
                        outerStyle={{
                            height: 36
                        }}
                    >
                        <PlusIcon
                            size={14}
                            strokeWidth={2.5}
                            color={theme.colors.schemes.light.onSurfaceVariant}
                        />
                        <ThemedText
                            style={{
                                fontSize: 14,
                                fontWeight: 500,
                                letterSpacing: theme.letterSpacing.lg,
                                color: theme.colors.schemes.light.onSurface
                            }}
                        >
                            Create Workout
                        </ThemedText>
                    </InlineButton>
                    <InlineButton
                        outerStyle={{
                            height: 48,
                            backgroundColor: "red"
                        }}
                    >
                        <SmileIcon/>
                    </InlineButton>
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}