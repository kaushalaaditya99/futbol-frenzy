import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, RefreshCw } from 'lucide-react-native';
import InputText from "@/components/ui/input/InputText";
import SimpleButton from "@/components/ui/button/SimpleButton";
import ThemedText from "@/components/ui/ThemedText";
import { colors, fontSize, margin, padding, theme } from "@/theme";
import { router } from "expo-router";
import ButtonBack from "@/components/ui/button/ButtonBack";

export default function ResetPassword() {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.schemes.light.background,
            }}
        >
            <View
                style={{
                    marginTop: theme.margin.sm,
                    marginHorizontal: theme.margin.sm
                }}
            >
                <ButtonBack
                    onBack={() => router.back()}
                />
            </View>
            <View
                style={{
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    rowGap: margin.lg,
                    paddingVertical: margin.sm,
                    paddingHorizontal: margin.lg,
                }}
            >
                <View
                    style={{
                        padding: padding.sm,
                        borderRadius: 100,
                        backgroundColor: colors.schemes.light.surfaceContainerLowest,
                        borderWidth: 1,
                        borderColor: theme.colors.schemes.light.outlineVariant,
                        ...theme.shadow.sm
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
                            borderWidth: 1,
                            borderColor: theme.colors.schemes.light.outlineVariant,
                            backgroundColor: colors.schemes.light.surfaceContainerLowest
                        }}
                    >
                        <RefreshCw
                            size={48}
                            color={colors.coreColors.primary}
                        />
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        rowGap: padding.sm
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: fontSize.xl,
                            fontWeight: "600",
                            letterSpacing: theme.letterSpacing.xs,
                            textAlign: "center",
                            marginBottom: padding.sm
                        }}
                    >
                        Reset Password
                    </ThemedText>
                    <ThemedText
                        style={{
                            maxWidth: 300,
                            fontSize: fontSize.base,
                            fontWeight: "400",
                            letterSpacing: theme.letterSpacing.lg,
                            textAlign: "center",
                            color: theme.colors.schemes.light.onSurfaceVariant
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
                            rowGap: padding.lg
                        }}
                    >
                        <SimpleButton
                            label="Send Reset Link"
                        />
                        <Pressable
                            onPress={() => router.back()}
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                columnGap: padding.sm
                            }}
                        >
                            <ArrowLeft
                                size={12}
                                strokeWidth={3}
                            />
                            <ThemedText
                                style={{
                                    fontSize: fontSize.md,
                                    fontWeight: 500
                                }}
                            >
                                Back to Login
                            </ThemedText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}