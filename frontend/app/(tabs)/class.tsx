import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, margin } from "@/theme";
import { router } from "expo-router";
import HeaderWithBack from "@/components/ui/HeaderWithBack";
import CoachView from "@/components/pages/class/coach/CoachView";
import StudentView from "@/components/pages/class/student/StudentView";

export default function Class() {
    const [isTeacher, setIsTeacher] = useState(true);
    
    const loadIsTeacher = () => {
        // is this user a teacher
        setIsTeacher(false);
    }
    

    return (
        <SafeAreaView
            edges={["top"]}
            style={{
                flex: 1,
                backgroundColor: colors.schemes.light.background
            }}
        >
            <HeaderWithBack
                header="U12 Boys A-Team"
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
            {
                isTeacher ? <CoachView/> : <StudentView/>
            }
        </SafeAreaView>
    )
}