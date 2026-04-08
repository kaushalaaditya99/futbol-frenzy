import SimpleButton from "@/components/ui/button/SimpleButton";
import RadioCard from "@/components/ui/input/RadioCard";
import ThemedText from "@/components/ui/ThemedText";
import { colors, fontSize, letterSpacing, padding, margin, theme } from "@/theme";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import resolveEndpoint from "@/services/resolveEndpoint";

const API_URL = resolveEndpoint("/api/");

export default function SelectRole() {
    const [group, setGroup] = useState("Coach");
    const { token, setAuth } = useAuth();

    const submitRole = async () => {
        try {
            const response = await fetch(`${API_URL}set-role/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({ group }),
            });
            const data = await response.json();
            if (response.ok) {
                setAuth(token!, group as "Coach" | "Student");
                router.replace("/(tabs)");
            } else {
                alert(`Failed to set role: ${data.error || JSON.stringify(data)}`);
            }
        } catch (error) {
            console.error("Error setting role:", error);
            alert("Error setting role. See console for details.");
        }
    };

    return (
        <SafeAreaView
            style={{
                backgroundColor: colors.schemes.light.background,
                flex: 1,
                justifyContent: "center",
                paddingHorizontal: margin.lg,
                rowGap: padding.xl,
            }}
        >
            <View>
                <ThemedText
                    style={{
                        fontSize: fontSize.xl,
                        fontWeight: "600",
                        textAlign: "center",
                        marginBottom: 4,
                    }}
                >
                    Welcome to DrillUp
                </ThemedText>
                <ThemedText
                    style={{
                        fontSize: fontSize.base,
                        fontWeight: "400",
                        textAlign: "center",
                        letterSpacing: letterSpacing.lg,
                        color: colors.schemes.light.onSurfaceVariant,
                    }}
                >
                    Select your role to get started.
                </ThemedText>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    columnGap: padding.lg,
                    minHeight: 100,
                }}
            >
                <RadioCard
                    value="Coach"
                    selected={group === "Coach"}
                    onChange={(value) => setGroup(value)}
                    icon="🧑‍🏫"
                    label="Coach"
                    description="Create and assign drills"
                />
                <RadioCard
                    value="Student"
                    selected={group === "Student"}
                    onChange={(value) => setGroup(value)}
                    icon="⚽"
                    label="Player"
                    description="Practice and submit drills"
                />
            </View>
            <SimpleButton label="Continue" onPress={submitRole} />
        </SafeAreaView>
    );
}
