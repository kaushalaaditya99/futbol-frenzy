import SimpleButton from "@/components/ui/button/SimpleButton";
import InputText from "@/components/ui/input/InputText";
import RadioCard from "@/components/ui/input/RadioCard";
import Separator from "@/components/ui/Separator";
import SeparatorText from "@/components/ui/SeparatorText";
import ThemedText from "@/components/ui/ThemedText";
import { colors, fontSize, letterSpacing, margin, padding, theme } from "@/theme";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function CreateAccount() {
    return (
        <ScrollView
            style={{
                backgroundColor: colors.schemes.light.background,
            }}
        >
            <SafeAreaView
                style={{    
                    rowGap: padding.xl,
                    paddingVertical: margin.lg,
                    paddingTop: margin.lg * 1.25,
                    paddingHorizontal: margin.lg,
                    flex: 1,
                }}
            >
                <View>
                    <ThemedText
                        style={{
                            fontSize: 32,
                            fontWeight: 600,
                            textAlign: "center",
                            marginBottom: 4
                        }}
                    >
                        Create Account
                    </ThemedText>
                    <ThemedText
                        style={{
                            fontSize: 16,
                            fontWeight: 400,
                            textAlign: "center",
                            letterSpacing: letterSpacing.lg,
                            color: colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        Join DrillUp and level up your game.
                    </ThemedText>
                </View>
                <Separator/>
                <View
                    style={{
                        rowGap: 12
                    }}
                >
                    <SimpleButton
                        label="Sign Up with Google"
                    />
                    <SimpleButton
                        label="Sign Up with Apple"
                    />
                </View>
                <SeparatorText
                    text="OR WITH EMAIL"
                />
                <View
                    style={{
                        flex: 1,
                        rowGap: padding.lg
                    }}
                >
                    <InputText
                        label="First Name"
                    />
                    <InputText
                        label="Last Name"
                    />
                    <InputText
                        label="Email Address"
                    />
                    <InputText
                        label="Password"
                    />
                    <InputText
                        label="Confirm Password"
                    />
                    <View
                        style={{
                            display: "flex",
                            flexShrink: 1,
                            minHeight: 100,
                            flexDirection: "row",
                            columnGap: padding.lg,
                        }}
                    >
                        <RadioCard
                            value="Coach"
                            selected={true}
                            onChange={(value) => console.log(value)}
                            icon="🧑‍🏫"
                            label="Coach"
                            description="Create and assign drills"
                        />
                        <RadioCard
                            value="Student"
                            selected={false}
                            onChange={(value) => console.log(value)}
                            icon="⚽"
                            label="Player"
                            description="Practice and submit drills"
                        />
                    </View>
                    <View
                        style={{
                            display: "flex",
                            alignItems: "center",
                            rowGap: padding.md
                        }}
                    >
                        <SimpleButton
                            label="Create Account"
                        />
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                columnGap: padding.sm
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: fontSize.md,
                                    letterSpacing: letterSpacing.lg,
                                    alignSelf: "flex-start",
                                    color: theme.colors.schemes.light.onSurfaceVariant
                                }}
                            >
                                Already have an account?
                            </ThemedText>
                            <ThemedText
                                onPress={() => router.push("/")}
                                style={{
                                    fontSize: fontSize.md,
                                    fontWeight: 600,
                                    letterSpacing: letterSpacing.lg,
                                    alignSelf: "flex-start",
                                    color: theme.colors.schemes.light.onSurface
                                }}
                            >
                                Log In
                            </ThemedText>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}