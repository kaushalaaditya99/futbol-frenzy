import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, margin } from "@/theme";
import { router } from "expo-router";
import HeaderWithBack from "@/components/ui/HeaderWithBack";
import CoachView from "@/components/pages/class/coach/CoachView";
import StudentView from "@/components/pages/class/student/StudentView";
import { useAuth } from "@/contexts/AuthContext";
import { getClassById, Class as SoccerClassType, defaultClass } from "@/services/classes";
import { ActivityIndicator } from "react-native";
import ThemedText from "@/components/ui/ThemedText";

export default function Class() {
    const { role, token } = useAuth();
    const [soccerClass, setSoccerClass] = useState<SoccerClassType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        loadClass();
    }, [token]);

    const loadClass = async () => {
        setIsLoading(true);
        try {
            // For now, load the first class (or we could use a route param)
            // This page seems to be a fallback - the main class viewing is at /classes/[id]
            const response = await fetch("/api/classes/", {
                headers: { Authorization: `Token ${token}` },
            });
            const classes = await response.json();
            if (classes && classes.length > 0) {
                setSoccerClass(classes[0]);
            }
        } catch (err) {
            console.error("Failed to load class:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView
            edges={["top"]}
            style={{
                flex: 1,
                backgroundColor: colors.schemes.light.background
            }}
        >
            <HeaderWithBack
                header={soccerClass?.className || "Class"}
                onBack={() => router.back()}
                containerStyle={{
                    paddingVertical: margin.xs,
                    paddingHorizontal: margin.sm,
                    borderBottomWidth: 0,
                }}
                buttonStyle={{
                    backgroundColor: "#00000010"
                }}
            />
            {isLoading ? (
                <ActivityIndicator size="large" color={colors.coreColors.primary} style={{ marginTop: 20 }} />
            ) : role === "Coach" && soccerClass ? (
                <CoachView param_class={soccerClass} />
            ) : (
                <StudentView classId={soccerClass?.id} />
            )}
        </SafeAreaView>
    );
}