import { useState, useEffect, useCallback } from "react";
import { Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, margin } from "@/theme";
import { router, useFocusEffect } from "expo-router";
import HeaderWithBack from "@/components/ui/HeaderWithBack";
import CoachView from "@/components/pages/class/coach/CoachView";
import StudentView from "@/components/pages/class/student/StudentView";
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { getClassById, Class, defaultClass, removeStudentFromClass } from "@/services/classes";
import { DoorOpen } from "lucide-react-native";

export default function ClassPage() {
  const { token, loaded, role } = useAuth();
  const { profile } = useProfile();
  const isTeacher = role === "Coach";

  const { id } = useLocalSearchParams<{ id: string }>();
  const jojo_id  = Number(id);
    const [soccerclass, setSoccerClass] = useState(defaultClass);

  async function fetchClass(in_token: string, in_id: number)
  {
    const theclass = await getClassById(in_token, in_id);
    setSoccerClass(theclass);
  }

    useEffect(() => {
      if (!token || !loaded)
      {
        return;
      }
      fetchClass(token, jojo_id);

    }, [token, loaded, jojo_id]);

    useFocusEffect(
      useCallback(() => {
        if (token && loaded) {
          fetchClass(token, jojo_id);
        }
      }, [token, loaded, jojo_id])
    );

  const handleLeaveClass = () => {
    Alert.alert(
      "Leave Class",
      `Are you sure you want to leave ${soccerclass.className}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            if (!token || !profile.id) return;
            const success = await removeStudentFromClass(token, jojo_id, profile.id);
            if (success) {
              router.back();
            } else {
              Alert.alert("Error", "Could not leave class. Please try again.");
            }
          },
        },
      ]
    );
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
                header= {soccerclass.className}
                onBack={() => router.back()}
                containerStyle={{
                    paddingVertical: margin.xs,
                    paddingHorizontal: margin.sm,
                    borderBottomWidth: 0,
                }}
                buttonStyle={{
                    backgroundColor: "#00000010"
                }}
                leftHeader={!isTeacher ? (
                    <Pressable
                        onPress={handleLeaveClass}
                        style={{
                            padding: 6,
                            borderRadius: 8,
                            backgroundColor: "#00000010",
                        }}
                    >
                        <DoorOpen size={20} color={colors.schemes.light.onSurfaceVariant} />
                    </Pressable>
                ) : undefined}
            />
            {
          isTeacher ? <CoachView
            param_class={soccerclass} /> : <StudentView classId={jojo_id} />
            }
        </SafeAreaView>
    )
}
