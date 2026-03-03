import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from 'lucide-react-native';
import InputText from "@/components/ui/input/InputText";
import SimpleButton from "@/components/ui/button/SimpleButton";
import ThemedText from "@/components/ui/ThemedText";
import { colors, fontSize, margin, padding } from "@/theme";
import { router } from "expo-router";

export default function ResetPassword() {
    return (
        <SafeAreaView
            style={{
                backgroundColor: colors.schemes.light.background,
				display: "flex",
                alignItems: "center",
                justifyContent: "center",
				rowGap: margin.lg,
				paddingVertical: margin.sm,
				paddingHorizontal: margin.lg,
				flex: 1
            }}
        >
            <View
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 100,
                    height: 100,
                    borderRadius: 100,
                    backgroundColor: "lightgray"
                }}
            >
                <Text
                    style={{
                        fontSize: 60
                    }}
                >
                    🔒
                </Text>
            </View>
            <View
                style={{
                    rowGap: padding.sm
                }}
            >
                <ThemedText
                    style={{
                        fontSize: 32,
                        fontWeight: 600,
                        textAlign: "center",
                        marginBottom: 4
                    }}
                >
                    Reset Password
                </ThemedText>
                <ThemedText
                    style={{
                        fontSize: 16,
                        fontWeight: 400,
                        textAlign: "center",
                        color: "gray"
                    }}
                >
                    Enter your email address and we'll send you a link to reset your password.
                </ThemedText>
            </View>
            <View
                style={{
                    display: "flex",
                    rowGap: padding.lg
                }}
            >
                <InputText
                    label="Email Address"
                />
                <View
                    style={{
                        display: "flex",
                        rowGap: padding.sm
                    }}
                >
                    <SimpleButton
                        label="Send Reset Link"
                    />
                    <Pressable
                        onPress={() => router.replace("/")}
                    >
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                columnGap: 4
                            }}
                        >
                            <ArrowLeft
                                size={12}
                                strokeWidth={3}
                            />
                            <ThemedText
                                style={{
                                    fontSize: fontSize.md
                                }}
                            >
                                Back to Login
                            </ThemedText>
                        </View>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}