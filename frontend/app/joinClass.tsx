import { TextInput, View } from "react-native";
import { borderRadius, colors, fontSize, letterSpacing, margin, padding, shadow } from "@/theme";
import { ArrowRightToLine } from "lucide-react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { joinClass } from "@/services/classes";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderWithBack from "@/components/ui/HeaderWithBack";
import ThemedText from "@/components/ui/ThemedText";
import Button from "@/components/ui/button/Button";
import ErrorMessage from "@/components/ui/input/ErrorMessage";

export default function JoinClass() {
    const [failed, setFailed] = useState(false);
    const [classCode, setClassCode] = useState("");
    
    useEffect(() => {
        setFailed(false);
    }, [classCode]);

    const onJoinClass = async () => {
        // The student's ID would be provided
        // elsewhere, but walk with me.
        const studentID = 0;
        if (await joinClass(classCode, studentID)) {
            router.back();
            return
        }
        setFailed(true);
    }

    return (
        <SafeAreaView
            edges={["top"]}
            style={{
                flex: 1,
                backgroundColor: colors.schemes.light.background,
            }}
        >
            <HeaderWithBack
                header="Join Class"
                onBack={() => router.back()}
                containerStyle={{
                    paddingVertical: margin.xs,
                    paddingHorizontal: margin.sm,
                }}
                buttonStyle={{
                    backgroundColor: "#00000010"
                }}
            />
            <View
                style={{
                    paddingVertical: padding["2xl"],
                    paddingHorizontal: padding["2xl"],
                    flex: 1,
                    rowGap: 24,
                    justifyContent: "center",
                    backgroundColor: colors.schemes.light.background
                }}
            >
                <View
                    style={{
                        alignItems: "center",
                        rowGap: 4
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: fontSize.xl,
                            fontWeight: 600,
                            letterSpacing: letterSpacing.xs,
                            textAlign: "center",
                            color: colors.schemes.light.onSurface
                        }}
                    >
                        Enter the Class' Code
                    </ThemedText>
                    <ThemedText
                        style={{
                            maxWidth: 250,
                            fontSize: fontSize.base,
                            fontWeight: 400,
                            letterSpacing: letterSpacing.lg,
                            textAlign: "center",
                            color: colors.schemes.light.onSurfaceVariant,
                        }}
                    >
                        What's the code of the class you'd like to join?
                    </ThemedText>
                </View>
                <View
                    style={{
                        rowGap: 12
                    }}
                >
                    <TextInput
                        value={classCode}
                        onChangeText={(text) => setClassCode(text)}
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            borderWidth: 1,
                            borderColor: colors.schemes.light.outlineVariant,
                            borderRadius: borderRadius.base,
                            backgroundColor: "white",
                            fontSize: 24,
                            textAlign: "center",
                            fontFamily: "Arimo-700Bold",
                            ...shadow.sm
                        }}
                    />
                    <Button
                        innerStyle={{
                            columnGap: 12,
                            width: "100%"
                        }}
                        onPress={onJoinClass}
                    >
                        <ArrowRightToLine
                            size={18}
                            color={"white"}
                        />
                        <ThemedText
                            style={{
                                fontSize: 18,
                                fontWeight: 500,
                                letterSpacing: -0.25,
                                color: "white"
                            }}
                        >
                            Join Class
                        </ThemedText>
                    </Button>
                    <View
                        style={{
                            opacity: failed ? 1 : 0
                        }}
                    >
                        <ErrorMessage
                            message="A class with this code was not found. Please try again."
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}