import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, margin } from "@/theme";
import HeaderWithBack from "@/components/HeaderWithBack";
import { router } from "expo-router";
import ClassTeacherView from "@/components/Class/TeacherView/ClassTeacherView";
import ClassStudentView from "@/components/Class/StudentView/ClassStudentView";

export default function Class() {
    const [isTeacher, setIsTeacher] = useState(true);
    
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
                isTeacher ? <ClassTeacherView/> : <ClassStudentView/>
            }
        </SafeAreaView>
    )
}